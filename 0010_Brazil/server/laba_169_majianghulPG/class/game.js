var User = require("./User");
var gameDao = require("./../dao/gameDao");
var arithmetic = require("./arithmetic");
var sever = require("./sever");
var schedule = require("node-schedule");
var gameConfig = require("./../config/gameConfig");

var laba = require("./../../util/laba");
var http_bc = require("./../../util/http_broadcast");
var redis_send_and_listen = require("./../../util/redis_send_and_listen");
//读取文件包


var GameInfo = function () {

    var _gameinfo = "";

    var Game = function () {

        //初始化算法，使用第X种
        this.initAlgorithm = function (idx) {
            console.log('####init Algorithm!####');
            console.log('use [' + idx + '] Algorithm!');
            this.A = new arithmetic(idx);
        };

        this.serverId = gameConfig.serverId;

        //初始化游戏
        this.init = function () {
            console.log('####init game!####');

            //初始化算法
            this.initAlgorithm(0);
            //初始化用户列表
            this.userList = {};
            //在线人数为0
            this.onlinePlayerCount = 0;
            //统计
            this.winTotal = 0;
            this.lotteryCount = 0;
            this.hourWinTotal = 0;
            this.hourlotteryCount = 0;

            this.score_changeLogList = [];
            this.lotteryLogList = [];
            this.lineOutList = [];
            //维护模式
            this.maintain = false;

            this.sever = new sever();

            this.ranScore = Math.floor(Math.random() * 900000000 + 100000000);
            var rule = new schedule.RecurrenceRule();
            var times = [];
            for (var i = 0; i < 60; i++) {
                times.push(i);
            }
            rule.second = times;
            let self = this;
            schedule.scheduleJob(rule, function () {
                if (gameConfig.maintain) {
                    --gameConfig.maintainTime;
                    //console.log(gameConfig.maintainTime);;
                    if (!gameConfig.maintainTime) {
                        self.disconnectAllUser();
                    }
                }

                self.score_changeLog();
                self.lotteryLog();
                let nowDate = new Date();
                let minute = nowDate.getMinutes();
                let second = nowDate.getSeconds();
                if (minute % 10 == 0 && second == 1) {
                    self.saveGamblingBalanceGold();
                    console.log("保存库存和奖池");
                    redis_send_and_listen.send_msg("OnlineUserMsg", {
                        server_id: gameConfig.serverId,
                        online_num: self.onlinePlayerCount
                    });
                    //console.log("推送在线人数");
                }
                //推送奖池给玩家
                if (second % 20 == 0) {
                    let GamblingBalanceLevelBigWin = self.A.getGamblingBalanceLevelBigWin();
                    let nGamblingWinPool = GamblingBalanceLevelBigWin.nGamblingWinPool;
                    nGamblingWinPool = nGamblingWinPool > 0 ? nGamblingWinPool : 0;
                    let result = {
                        ResultCode: 1,
                        nGamblingWinPool: nGamblingWinPool + self.ranScore
                    };

                    for (let item in self.userList) {
                        self.userList[item]._socket.emit("pushGamblingWinPool", result);
                    }
                }
            });
        };

        this.tt = 0;

        this.lottery = function (_userId, _betIdx, _nBetList, isUse, coinCtrl) {
            //用户_userid 摇奖
            //返回-1 未登录
            //返回-2 资金不足

            if (!_userId) {					//传输ID错误
                console.log("未传用户ID");
                return {code: -1};
            }
            if (!this.userList[_userId]) {	//未找到用户
                console.log("找不到用户");
                return {code: -1}
            }

            let _bet = this.A.CheckBet(_betIdx);

            if (!_bet) {
                console.log(_betIdx + "没有这个概率ID");
                return {code: -1};
            }

            var score_before = this.userList[_userId].getScore();     //用户金币
            var sourceFreeCount = this.userList[_userId].getFreeCount();   //获取免费次数
            var youScore = this.userList[_userId].getScore();         //用户金币
            var GamblingBalanceLevelBigWin = this.A.getGamblingBalanceLevelBigWin(); //获取库存 水位 大奖幸运值
            //水位
            var nGamblingWaterLevelGold = GamblingBalanceLevelBigWin.nGamblingWaterLevelGold;
            //库存
            var nGamblingBalanceGold = GamblingBalanceLevelBigWin.nGamblingBalanceGold;
            //奖池
            var nGamblingWinPool = GamblingBalanceLevelBigWin.nGamblingWinPool;
            //大奖幸运等级
            var nGamblingBigWinLevel = GamblingBalanceLevelBigWin.nGamblingBigWinLevel;
            //大奖幸运概率
            var nGamblingBigWinLuck = GamblingBalanceLevelBigWin.nGamblingBigWinLuck;

            var is_luck = false;

            //判断幸运值
            var random_Num_1000 = RandomNumBoth(0, 1000);
            var random_Num_100 = RandomNumBoth(0, 100);
            if (nGamblingBigWinLevel[2] >= random_Num_1000) {
                if (nGamblingBigWinLuck[2] >= random_Num_100) {
                    is_luck = true
                }
            } else if (nGamblingBigWinLevel[1] >= random_Num_1000) {
                if (nGamblingBigWinLuck[1] >= random_Num_100) {
                    is_luck = true
                }
            } else if (nGamblingBigWinLevel[0] >= random_Num_1000) {
                if (nGamblingBigWinLuck[0] >= random_Num_100) {
                    is_luck = true
                }
            }

            //测试幸运值为true
            // is_luck = true;

            var bFreeTimeFlag = false;     //是否有免费次数
            if (sourceFreeCount > 0) {
                bFreeTimeFlag = true
            }

            //======================================================================================
            var nBetList = _nBetList;    //下注数组
            // 下注总额
            var nBetSum = 0;
            for (var i in nBetList) {
                nBetSum += nBetList[i];
            }

            var addBalanceGold = nBetSum * parseInt(nGamblingWaterLevelGold) / 100;    //进入库存的钱
            var addWinPool = parseInt(nBetSum - addBalanceGold);                     //进入奖池的钱

            var jackpotUpperLimit = 0;

            //用户扣钱或者减少免费次数
            var lotteryResult = this.userList[_userId].lottery(nBetSum);
            if (!lotteryResult) {
                console.log(_userId + "分数不够");
                //console.log(this.userList[_userId]);
                return {code: -2}
            }
            if (!bFreeTimeFlag) {
                //增加库存和奖池
                this.A.addGamblingBalanceGold(addBalanceGold, addWinPool);
                jackpotUpperLimit = parseInt(nGamblingWinPool + addWinPool);   //可以赢的钱 奖池加上下注进入奖池的钱
            } else {
                jackpotUpperLimit = parseInt(nGamblingWinPool);
            }

            while (true) {
                var nHandCards = [];  //# 手牌
                //# 处理结果初始化
                var dictAnalyseResult = {
                    code: 2,
                    nHandCards: [],  //# 结果手牌
                    goldCards: [],  //# 金色手牌位置
                    nWinLines: [],  //# 中奖的线数的检索
                    nWinLinesDetail: [],  //# 中奖线数上中奖的牌的检索
                    nWinDetail: [],  //# 每条线中多少钱
                    nBet: nBetSum, // # 下注总额
                    win: 0,  //# 中奖总额
                    nWinCards: [],  //# 位数与手牌数相同，中奖的为True，没中奖的为False
                    getOpenBox: {
                        bFlag: false,
                        nWinOpenBox: 0
                    },
                    getFreeTime: {
                        bFlag: false,
                        nFreeTime: 0,
                        nIndex: 0
                    },
                    fMultiple: 1,
                    nBetTime: Number(new Date())
                };
                //# 免费模式去除免费牌
                if (!bFreeTimeFlag) {
                    //# 普通发牌
                    nHandCards = laba.CreateRandomCardList(gameConfig.GAME_COLORS_DIAMOND,
                        gameConfig.GAME_HAND_CARDS_Column,
                        gameConfig.GAME_HAND_CARDS_Row,
                        gameConfig.GAME_HAND_CARDS_No_Magic_Column_List);
                } else {
                    //# 免费发牌
                    nHandCards = laba.CreateRandomCardList(gameConfig.Free_GAME_COLORS_DIAMOND,
                        gameConfig.GAME_HAND_CARDS_Column,
                        gameConfig.GAME_HAND_CARDS_Row,
                        gameConfig.GAME_HAND_CARDS_No_Magic_Column_List);
                }

                //添加
                //免费牌每列只许出现一张
                let col1 = [nHandCards[0], nHandCards[5], nHandCards[10], nHandCards[15]];
                let col2 = [nHandCards[1], nHandCards[6], nHandCards[11], nHandCards[16]];
                let col3 = [nHandCards[2], nHandCards[7], nHandCards[12], nHandCards[17]];
                let col4 = [nHandCards[3], nHandCards[8], nHandCards[13], nHandCards[18]];
                let col5 = [nHandCards[4], nHandCards[9], nHandCards[14], nHandCards[19]];
                if (list_one_count(gameConfig.GAME_FREE_TIMES_CARD_DIAMOND, col1) > 1 ||
                    list_one_count(gameConfig.GAME_FREE_TIMES_CARD_DIAMOND, col2) > 1 ||
                    list_one_count(gameConfig.GAME_FREE_TIMES_CARD_DIAMOND, col3) > 1 ||
                    list_one_count(gameConfig.GAME_FREE_TIMES_CARD_DIAMOND, col4) > 1 ||
                    list_one_count(gameConfig.GAME_FREE_TIMES_CARD_DIAMOND, col5) > 1) {
                    continue;
                }

                //2,3,4列随机黄金牌
                let goldCards = [];
                if (!bFreeTimeFlag) {
                    for (let i = 0; i < nHandCards.length - 1; i++) {
                        if (i % 5 === 0 || i % 5 === 4) {
                            continue;
                        }
                        let ran = RandomNumBoth(1, 100);
                        if (ran < 10 && nHandCards[i] < 8) {
                            goldCards.push(parseInt(i));
                        }
                    }
                } else {
                    goldCards = [2, 7, 12, 17];
                }

                // nHandCards = [0, 3, 2, 1, 3, 2, 3, 2, 8, 4, 6, 0, 7, 3, 7, 3, 0, 3, 1, 7];
                // goldCards = [2, 7];

                for (var i = 0; i < gameConfig.GAME_HAND_CARDS_NUMBER_DIAMOND; i++) {
                    dictAnalyseResult["nWinCards"].push(false);
                }

                var bet_num = parseInt(nBetSum / gameConfig.GAME_GOLD_Single);

                //# 获取处理结果
                dictAnalyseResult = laba.AnalyseColumnSolt(nHandCards,
                    gameConfig.GAME_MAGIC_CARD_DIAMOND,
                    gameConfig.GAME_FREE_TIMES_CARD_DIAMOND,
                    gameConfig.GAME_HAND_CARDS_LowerLimit,
                    gameConfig.GAME_HAND_CARDS_Column, bet_num,
                    gameConfig.GAME_COMBINATIONS_DIAMOND,
                    gameConfig.GAME_GOLD_Single);

                dictAnalyseResult["goldCards"] = goldCards;
                //# 判断是否进入免费模式

                var getFreeTime = {"bFlag": false, "nFreeTime": 0};
                var getOpenBox = {bFlag: false, nWinOpenBox: 0, win: 0};

                var res_dict_list = [];
                var new_hand_card = [];
                for (var i in nHandCards) {
                    new_hand_card.push(parseInt(nHandCards[i]) + 1)
                }
                dictAnalyseResult["nHandCards"] = new_hand_card;
                res_dict_list.push(JSON.parse(JSON.stringify(dictAnalyseResult)));

                var combo_num = 0;
                var all_win = 0;
                var box_win = 0;
                while (true) {
                    if (dictAnalyseResult["win"] > 0) { // 中奖了
                        all_win += dictAnalyseResult["win"];
                        combo_num += 1;
                        var win_lines_index = [];
                        for (let nwldi in dictAnalyseResult["nWinLinesDetail"]) {
                            for (let nwldii in dictAnalyseResult["nWinLinesDetail"][nwldi]) {
                                win_lines_index.push(dictAnalyseResult["nWinLinesDetail"][nwldi][nwldii])
                            }
                        }
                        win_lines_index = es6_set(win_lines_index);
                        win_lines_index.sort(function (a, b) {
                            return a - b
                        });
                        let lastGoldCards = dictAnalyseResult["goldCards"].concat();
                        win_lines_index.reverse();
                        for (let wlii in win_lines_index) {
                            nHandCards[parseInt(win_lines_index[wlii])] = -1;
                            if (dictAnalyseResult["goldCards"].length > 0) {
                                for (let i = 0; i < dictAnalyseResult["goldCards"].length; i++) {
                                    if (dictAnalyseResult["goldCards"][i] === parseInt(win_lines_index[wlii])) {
                                        nHandCards[parseInt(win_lines_index[wlii])] = gameConfig.GAME_MAGIC_CARD_DIAMOND;
                                        lastGoldCards[i] = -1;
                                    }
                                }
                            }
                        }
                        //删除用获得黄金牌
                        for (let i = 0; i < lastGoldCards.length; i++) {
                            if (lastGoldCards[i] === -1) {
                                lastGoldCards.splice(i, 1);
                                i = i - 1;
                            }
                        }
                        nHandCards.reverse();

                        if (!bFreeTimeFlag) {
                            for (let i = 0; i < lastGoldCards.length; i++) {
                                let n = 0;
                                if (14 - lastGoldCards[i] > 0 && nHandCards[14 - lastGoldCards[i]] === -1) {
                                    n++;
                                }
                                if (9 - lastGoldCards[i] > 0 && nHandCards[9 - lastGoldCards[i]] === -1) {
                                    n++;
                                }
                                if (4 - lastGoldCards[i] > 0 && nHandCards[4 - lastGoldCards[i]] === -1) {
                                    n++;
                                }
                                lastGoldCards[i] += n * 5;
                            }
                            for (let n_h_i in nHandCards) {
                                if (nHandCards[n_h_i] === -1) {
                                    if (parseInt(n_h_i) + 5 < 20 && nHandCards[parseInt(n_h_i) + 5] !== -1) {
                                        nHandCards[n_h_i] = nHandCards[parseInt(n_h_i) + 5];
                                        nHandCards[parseInt(n_h_i) + 5] = -1;
                                        // for (let i = 0; i < lastGoldCards.length; i++) {
                                        //     if (lastGoldCards[i] === 19 - parseInt(n_h_i)) {
                                        //         lastGoldCards[i] += 5;
                                        //     }
                                        // }
                                    } else if (parseInt(n_h_i) + 10 < 20 && nHandCards[parseInt(n_h_i) + 10] !== -1) {
                                        nHandCards[n_h_i] = nHandCards[parseInt(n_h_i) + 10];
                                        nHandCards[parseInt(n_h_i) + 10] = -1;
                                        // for (let i = 0; i < lastGoldCards.length; i++) {
                                        //     if (lastGoldCards[i] === 19 - parseInt(n_h_i)) {
                                        //         lastGoldCards[i] += 10;
                                        //     }
                                        // }
                                    } else if (parseInt(n_h_i) + 15 < 20 && nHandCards[parseInt(n_h_i) + 15] !== -1) {
                                        nHandCards[n_h_i] = nHandCards[parseInt(n_h_i) + 15];
                                        nHandCards[parseInt(n_h_i) + 15] = -1;
                                        // for (let i = 0; i < lastGoldCards.length; i++) {
                                        //     if (lastGoldCards[i] === 19 - parseInt(n_h_i)) {
                                        //         lastGoldCards[i] += 15;
                                        //     }
                                        // }
                                    } else {
                                        nHandCards[n_h_i] = gameConfig.Free_GAME_COLORS_DIAMOND[RandomNumBoth(0, gameConfig.Free_GAME_COLORS_DIAMOND.length - 1)];
                                    }
                                }
                            }
                        } else {
                            for (let n_h_i in nHandCards) {
                                if (nHandCards[n_h_i] === -1) {
                                    if (parseInt(n_h_i) + 5 < 20 && nHandCards[parseInt(n_h_i) + 5] !== -1) {
                                        nHandCards[n_h_i] = nHandCards[parseInt(n_h_i) + 5];
                                        nHandCards[parseInt(n_h_i) + 5] = -1;
                                    } else if (parseInt(n_h_i) + 10 < 20 && nHandCards[parseInt(n_h_i) + 10] !== -1) {
                                        nHandCards[n_h_i] = nHandCards[parseInt(n_h_i) + 10];
                                        nHandCards[parseInt(n_h_i) + 10] = -1;
                                    } else if (parseInt(n_h_i) + 15 < 20 && nHandCards[parseInt(n_h_i) + 15] !== -1) {
                                        nHandCards[n_h_i] = nHandCards[parseInt(n_h_i) + 15];
                                        nHandCards[parseInt(n_h_i) + 15] = -1;
                                    } else {
                                        nHandCards[n_h_i] = gameConfig.Free_GAME_COLORS_DIAMOND[RandomNumBoth(0, gameConfig.Free_GAME_COLORS_DIAMOND.length - 1)];
                                    }
                                }
                            }

                            lastGoldCards = [2, 7, 12, 17];
                            //去掉万能模式的黄金牌
                            for (let i = 0; i < lastGoldCards.length; i++) {
                                if (nHandCards[24 - lastGoldCards[i]] === gameConfig.GAME_MAGIC_CARD_DIAMOND) {
                                    lastGoldCards.splice(i, 1);
                                    i = i - 1;
                                }
                            }
                        }
                        nHandCards.reverse();

                        dictAnalyseResult = {
                            code: 2,
                            nHandCards: [],  //# 结果手牌
                            goldCards: [],  //# 金色手牌位置
                            nWinLines: [],  //# 中奖的线数的检索
                            nWinLinesDetail: [],  //# 中奖线数上中奖的牌的检索
                            nWinDetail: [],  //# 每条线中多少钱
                            nBet: 0, // # 下注总额
                            win: 0,  //# 中奖总额
                            nWinCards: [],  //# 位数与手牌数相同，中奖的为True，没中奖的为False
                            getOpenBox: {
                                bFlag: false,
                                nWinOpenBox: 0
                            },
                            getFreeTime: {
                                bFlag: false,
                                nFreeTime: 0,
                                nIndex: 0
                            },
                            fMultiple: 1,
                            combo_num: combo_num,
                            nBetTime: Number(new Date())
                        };
                        //# 获取处理结果
                        dictAnalyseResult = laba.AnalyseColumnSolt(nHandCards,
                            gameConfig.GAME_MAGIC_CARD_DIAMOND,
                            gameConfig.GAME_FREE_TIMES_CARD_DIAMOND,
                            gameConfig.GAME_HAND_CARDS_LowerLimit,
                            gameConfig.GAME_HAND_CARDS_Column, bet_num,
                            gameConfig.GAME_COMBINATIONS_DIAMOND,
                            gameConfig.GAME_GOLD_Single);

                        new_hand_card = [];
                        for (var i in nHandCards) {
                            new_hand_card.push(parseInt(nHandCards[i]) + 1)
                        }
                        dictAnalyseResult["nHandCards"] = new_hand_card;
                        dictAnalyseResult["combo_num"] = combo_num;
                        //根据连击奖励加倍
                        let mul = 1;
                        if (combo_num === 1) {
                            mul = 1;
                        } else if (combo_num === 2) {
                            mul = 2;
                        } else if (combo_num === 3) {
                            mul = 3;
                        } else if (combo_num >= 4) {
                            mul = 5;
                        }
                        //免费模式加倍
                        if (bFreeTimeFlag) {
                            mul *= 2;
                        }
                        dictAnalyseResult["win"] *= mul;
                        dictAnalyseResult["goldCards"] = lastGoldCards;

                        res_dict_list.push(JSON.parse(JSON.stringify(dictAnalyseResult)));
                    } else {
                        break;
                    }
                }
                //检查是否进入免费模式
                if (!bFreeTimeFlag && list_one_count(gameConfig.GAME_FREE_TIMES_CARD_DIAMOND, nHandCards) >= 3) {
                    let t = list_one_count(gameConfig.GAME_FREE_TIMES_CARD_DIAMOND, nHandCards);
                    getFreeTime = {"bFlag": true, "nFreeTime": 10 + (t - 3) * 2};
                    dictAnalyseResult["getFreeTime"] = getFreeTime;
                }


                var break_check = false;
                if (parseInt(all_win) + parseInt(box_win) == 0) {
                    break_check = true;
                } else if (parseInt(all_win) + parseInt(box_win) < parseInt(jackpotUpperLimit)) {
                    break_check = true;
                }
                if (break_check && !parseInt(box_win) && !getFreeTime["bFlag"]) {
                    break_check = true;
                } else {
                    if (break_check) {
                        if (parseInt(box_win) && is_luck) {

                        } else if (getFreeTime["bFlag"] && is_luck) {

                        } else {
                            break_check = false;
                        }
                    }

                }

                //检查点控
                if (isUse === 1) {
                    if (score_before < coinCtrl) {
                        if (parseInt(box_win)) {

                        } else if (getFreeTime["bFlag"]) {

                        } else {
                            if (parseInt(all_win) + parseInt(box_win) - nBetSum >= 0) {
                                break_check = true;
                            }
                        }
                    } else {
                        break_check = false;
                        if (parseInt(box_win)) {

                        } else if (getFreeTime["bFlag"]) {

                        } else {
                            let r = RandomNumBoth(1, 100);
                            if (r === 100) {
                                break_check = true;
                            } else if (parseInt(all_win) + parseInt(box_win) - nBetSum <= 0) {
                                break_check = true;
                            }

                        }

                    }
                }


                if (break_check) {
                    //dictAnalyseResult["win"] = parseFloat("%.2f" % dictAnalyseResult["win"])
                    console.log("-----------------------------");
                    console.log(res_dict_list);
                    console.log(all_win);
                    break;
                } else {
                    console.log("从新发牌");
                }

            }

            var ResultArray = dictAnalyseResult;

            var winscore = parseInt(all_win) + parseInt(box_win);

            //减少奖池
            if (winscore > 0) {
                this.A.subGamblingBalanceGold(0, winscore);
            }
            //判断是否需要发送中奖信息到通知服
            if (http_bc && dictAnalyseResult["win"] >= nBetSum * gameConfig.sendMessage_mul) {
                let data = {
                    userId: _userId,
                    nickName: this.userList[_userId]._nickname,
                    gameName: gameConfig.gameName,
                    win: dictAnalyseResult["win"]
                };
                http_bc.send(data);
            }

            console.log("最大赢钱数", jackpotUpperLimit);
            console.log("库存", this.A.getGamblingBalanceLevelBigWin().nGamblingBalanceGold);
            console.log("奖池", this.A.getGamblingBalanceLevelBigWin().nGamblingWinPool);
            console.log("免费次数", this.userList[_userId].getFreeCount());
            console.log("用户赢钱数", winscore);


            var freeCount = getFreeTime["nFreeTime"];

            this.userList[_userId].winscore(winscore);
            this.userList[_userId].AddFreeCount(freeCount);
            var resFreeCount = this.userList[_userId].getFreeCount();
            var score_current = this.userList[_userId].getScore();
            var arstring = JSON.stringify(dictAnalyseResult);

            if (resFreeCount) {
                dictAnalyseResult["is_free"] = true
            } else {
                dictAnalyseResult["is_free"] = false
            }
            dictAnalyseResult["user_score"] = this.userList[_userId].getScore();


            //写入服务器记录
            //1.写记录
            var userInfo = {
                userid: _userId,
                bet: _bet,
                lines: 20000,
                nBetSum: nBetSum,
                score_before: score_before,
                score_win: winscore,
                score_current: score_current,
                result_array: arstring,
                score_linescore: nBetSum,
                free_count_win: freeCount,
                free_count_before: sourceFreeCount,
                free_count_current: resFreeCount
            };
            this.lotteryLogList.push(userInfo);

            //记录金钱变化量
            var userInfolog = {
                userid: _userId,
                score_before: youScore,
                score_change: winscore - nBetSum,
                score_current: score_current,
                change_type: gameConfig.logflag,
                isOnline: true
            };

            this.score_changeLogList.push(userInfolog);

            var CoinLog = [];
            var logTemp = {
                userId: _userId,
                useCoin: nBetSum,
                winCoin: winscore - nBetSum,
                tax: 0,
                serverId: gameConfig.serverId,
                gameId: gameConfig.gameId
            };
            CoinLog.push(logTemp);
            this._Csocket.emit("insertMark", CoinLog);

            //制作结果
            var Result = {
                code: 1,
                userscore: score_current,
                winscore: all_win,
                viewarray: res_dict_list,
                winfreeCount: freeCount,
                freeCount: resFreeCount,
                getFreeTime: getFreeTime,
                dictAnalyseResult: dictAnalyseResult,
                res_dict_list: res_dict_list
            };

            //服务器统计
            ++this.lotteryCount;
            ++this.hourlotteryCount;
            if (lotteryResult == 1) {
                this.winTotal += (winscore - nBetSum);
                this.hourWinTotal += (winscore - nBetSum);
            } else if (lotteryResult == 2) {
                this.winTotal += winscore;
                this.hourWinTotal += winscore;
            }
            //console.log(Result)
            return Result;

        };

        this.setIo = function (_io, _Csocket) {
            this.sever.setIo(_io, _Csocket);
            this._io = _io;
            this._Csocket = _Csocket;
        };


        this.Setmaintain = function () {
            gameConfig.maintain = true;
        };

        this.isMaintain = function () {
            return gameConfig.maintain;
        };

        //判断是否是同一scoket连续登录，不允许
        this.isLoginAgain = function (socket) {
            if (socket.userId) {
                return this.userList[socket.userId].Islogin();
            } else {
                return false;
            }
        };

        //添加用户
        this.addUser = function (_userInfo, socket) {
            this.userList[_userInfo.userid] = new User(_userInfo, socket);
        };

        this.updateUser = function (userInfo) {
            //console.log("update")
            if (!this.userList[userInfo._userId]) return;
            let result = {};
            //已经断线
            if (this.userList[userInfo._userId]._isLeave) {
                result = {ResultCode: 0, userId: userInfo._userId};
                this._Csocket.emit("userDisconnect", result);
                delete this.userList[userInfo._userId];
                return;
            }
            this.userList[userInfo._userId].update(userInfo);

            this.LoginGame(userInfo._userId, this.serverId);
            ++this.onlinePlayerCount;

            let GamblingBalanceLevelBigWin = this.A.getGamblingBalanceLevelBigWin();
            let nGamblingWinPool = GamblingBalanceLevelBigWin.nGamblingWinPool;
            nGamblingWinPool = nGamblingWinPool > 0 ? nGamblingWinPool : 0;
            let resultObj = {
                account: this.userList[userInfo._userId]._account,
                id: this.userList[userInfo._userId]._userId,
                nickname: this.userList[userInfo._userId]._nickname,
                score: this.userList[userInfo._userId]._score,
                nGamblingWinPool: nGamblingWinPool + this.ranScore
            };
            result = {resultid: '1', msg: 'login lineserver succeed!', Obj: resultObj};
            this.userList[userInfo._userId]._socket.emit('loginGameResult', result);

        };

        //获得在线人数
        this.getOnlinePlayerCount = function () {
            return this.onlinePlayerCount;
        };

        //在线所有人
        this.getOnlinePlayer = function () {
            return this.userList;
        };

        this.score_changeLog = function () {
            var self = this;
            var saveListTemp = [];
            var ItemTemp;
            var max = 0;
            if (this.score_changeLogList.length > 200) {
                max = 200;
            } else {
                max = this.score_changeLogList.length;
            }
            for (var i = 0; i < max; i++) {
                if (this.score_changeLogList.length > 0) {
                    ItemTemp = this.score_changeLogList.shift();
                    saveListTemp.push(ItemTemp);
                }
            }
            if (saveListTemp.length > 0) {
                this._Csocket.emit("score_changeLog", saveListTemp);
                //gameDao.score_changeLog(saveListTemp);
            }
        };

        this.lotteryLog = function () {
            var self = this;
            var saveListLotteryLogTemp = [];
            var ItemTemp;
            var max = 0;
            if (this.lotteryLogList.length > 200) {
                max = 200;
            } else {
                max = this.lotteryLogList.length;
            }
            for (var i = 0; i < max; i++) {
                if (this.lotteryLogList.length > 0) {
                    ItemTemp = this.lotteryLogList.shift();
                    saveListLotteryLogTemp.push(ItemTemp);
                }
            }
            if (saveListLotteryLogTemp.length > 0) {
                gameDao.lotteryLog(saveListLotteryLogTemp);
            }
        };

        //保存库存 奖池
        this.getHistory = function (_userId, _socket) {
            gameDao.getLotteryLog(_userId, function (Result) {
                if (Result) {
                    _socket.emit('historyResult', {ResultCode: 1, Result: Result});
                } else {
                    _socket.emit('historyResult', {ResultCode: 0});
                }
            });
        };

        //删除用户
        this.deleteUser = function (_socket) {
            if (_socket.userId) {
                //存免费次数
                var info = {
                    userId: _socket.userId,
                    freeCount: this.userList[_socket.userId].getFreeCount(),
                    LotteryCount: this.userList[_socket.userId].getLotteryCount()
                };
                gameDao.saveFree(info, function (result) {
                    if (!result)
                        logInfo.error("存免费次数:" + _userinfo.userId + "失败!")
                });
                this._Csocket.emit("lineOut", {
                    signCode: gameConfig.LoginServeSign,
                    state: 0,
                    gameId: gameConfig.gameId,
                    serverId: gameConfig.serverId,
                    userId: _socket.userId,
                    tableId: -1,
                    seatId: -1
                });
                this.sever.LogoutRoom(this.userList[_socket.userId], _socket);
                delete this.userList[_socket.userId];
                --this.onlinePlayerCount;
            }
        };

        //删除用户
        this.deleteUserById = function (_userId, msg) {
            if (_userId) {
                var socketItem = this.userList[_userId]._socket;
                result = {resultid: 0, msg: msg};
                socketItem.emit('loginGameResult', result);
                delete this.userList[_userId];
            }
        };

        //获得用户当前分数
        this.getUserscore = function (_userId) {
            if (_userId) {
                return this.userList[_userId]._score;
            }
        };

        //获得用户
        this.getUser = function (_userId) {
            if (_userId) {
                return this.userList[_userId];
            }
        };

        //用户是否在线
        this.IsPlayerOnline = function (_userId) {
            if (!_userId) {	//传输ID错误
                console.log("查询在线,参数错误");
                return -1;
            }
            if (this.userList[_userId]) {//未找到用户
                //console.log("查询在线,未找到" + _userId + "用户");
                return 1;
            } else {
                return 0;
            }
        };

        //获得用户当前分数
        this.getPlayerScore = function (_userId) {
            if (!_userId) {	//传输ID错误
                console.log("查询分数,参数错误");
                return -1;
            }
            if (this.userList[_userId]) {//未找到用户
                //console.log("查询在线,未找到" + _userId + "用户");
                return this.userList[_userId].getScore();
            } else {
                return -1;
            }
        };

        //GM加分
        this.addgold = function (_userId, score) {

            if (!_userId) {					//传输ID错误
                console.log("加分,未登录");
                return 0;
            }
            if (!this.userList[_userId]) {	//未找到用户
                console.log("加分,未登录");
                return 0
            } else {
                console.log(score);
                if (this.userList[_userId].addgold(score)) {
                    console.log(this.userList[_userId].getScore());
                    console.log("加分成功!");
                    var tablestring = "table" + this.userList[_userId].getTable();
                    this._io.sockets.in(tablestring).emit('addgoldResult', {
                        userId: _userId,
                        userSeatId: this.userList[_userId].getSeat(),
                        userScore: this.userList[_userId]._score
                    });
                    return 1;
                } else {
                    console.log("减分失败,大于用户分数!");
                    return 0;
                }
            }
        };

        //保存库存 奖池
        this.saveGamblingBalanceGold = function () {
            //获得库存奖池
            var dict = this.A.getGamblingBalanceGold();

            gameDao.Update_GamblingBalanceGold(dict.nGamblingBalanceGold, dict.nGamblingWinPool, function (Result) {
            })
        };

        this.updateGamblingBalanceGold = function (_info) {
            console.log(_info.dataKey);
            switch (_info.dataKey) {
                case "nGamblingWaterLevelGold":
                    this.A.nGamblingWaterLevelGold = parseInt(_info.data);
                    console.log("水位:" + this.A.nGamblingWaterLevelGold);
                    break;
                case "nGamblingBalanceGold":
                    this.A.nGamblingBalanceGold = parseInt(_info.data);
                    console.log("库存:" + this.A.nGamblingBalanceGold);
                    break;
                case "nGamblingWinPool":
                    this.A.nGamblingWinPool = parseInt(_info.data);
                    console.log("奖池:" + this.A.nGamblingWinPool);
                    break;
                case "nGamblingBigWinLevel":
                    this.A.nGamblingBigWinLevel = _info.data.split(',').map(Number);
                    console.log("大奖幸运等级:" + this.A.nGamblingBigWinLevel);
                    break;
                case "nGamblingBigWinLuck":
                    this.A.nGamblingBigWinLuck = _info.data.split(',').map(Number);
                    console.log("大奖幸运概率:" + this.A.nGamblingBigWinLuck);
                    break;
                case "expectRTP":
                    this.A.expectRTP = parseInt(_info.data);
                    console.log("RTP:" + this.A.expectRTP);
                    break;
            }
        };

        //进入游戏
        this.LoginGame = function (_userId, gametype) {
            if (!this.userList[_userId]) return;
            //用户添加游戏ID
            //console.log(_userId)
            //console.log("用户进入游戏" + gametype);
            this.userList[_userId].loginGame(gametype);
        };


        //进入房间
        this.LoginRoom = function (_userId, roomid, _socket) {
            if (!this.userList[_userId]) return;


            if (!this.userList[_userId].getGameId()) {
                console.log("用户" + _userId + ",没有进入任何游戏,进入房间")
                return;
            }

            if (this.userList[_userId].getSeat() != -1) {
                console.log("用户" + _userId + "已经有座位");
                return;
            }

            this.userList[_userId].loginRoom(roomid);
            var LoginResult;
            var linemsg = this.getLineOutMsg(_userId);
            if (linemsg.Result) {
                console.log("断线重连接table:" + linemsg.tableId + " seatid:" + linemsg.seatId);
                LoginResult = this.sever.LoginRoombyLineOut(this.getUser(_userId), _socket, linemsg.tableId, linemsg.seatId);
                this.lineOutSet({state: 0, userId: _userId});
            } else {
                LoginResult = this.sever.LoginRoom(this.getUser(_userId), _socket);
            }
            //进入房间后，帮分配座位
            // LoginResult
            //发送场景消息给当前用户
            var tableUserList = Array();

            for (var i = 0; i < this.sever.seatMax; i++) {
                //除了自己以外
                //console.log(LoginResult.tableId);
                //console.log(this.sever.tableList);
                if (this.sever.tableList[LoginResult.tableId][i] && this.sever.tableList[LoginResult.tableId][i] != _userId) {
                    var userItem = {};
                    var userid = this.sever.tableList[LoginResult.tableId][i];

                    if (this.userList[userid]) {
                        //先确定在线才能拿到相关信息
                        userItem.userId = this.userList[userid].getUserId();
                        userItem.seatId = this.userList[userid].getSeat();
                        userItem.nickname = this.userList[userid]._nickname;
                        userItem.score = this.userList[userid]._score;
                        userItem.userType = this.userList[userid]._Robot;
                        userItem.headimgurl = this.userList[userid]._headimgurl;
                        tableUserList.push(userItem);
                    }
                }
            }
            //发送场景消息
            //检查自己下注情况,效准玩家金额
            var self = this;
            gameDao.getFreeCount(_userId, function (ResultCode, Result) {
                //console.log("**" + Result.Id);
                if (!self.userList[_userId]) return;
                Result.Id = _userId;
                self.userList[_userId].updateFreeGame(Result);
                console.log("从数据库里获得免费次数" + Result.freeCount);

                var ResultData = {
                    TableId: LoginResult.tableId,
                    seatId: LoginResult.seatId,
                    userList: tableUserList,
                    freeCount: self.userList[_userId].getFreeCount(),
                    score_pool: self.A.getVirtualScorePool()
                };
                _socket.emit("LoginRoomResult", {ResultCode: 1, ResultData: ResultData});

                if (!linemsg.Result) {
                    var tablestring = "table" + LoginResult.tableId;
                    _socket.broadcast.to(tablestring).emit('playEnter', {
                        ResultCode: 1,
                        ResultData: {
                            userId: _userId,
                            TableId: LoginResult.tableId,
                            seatId: LoginResult.seatId,
                            nickname: self.userList[_userId]._nickname,
                            score: self.userList[_userId]._score,
                            headimgurl: self.userList[_userId]._headimgurl,
                            userType: self.userList[_userId]._Robot
                        }
                    });
                }

            })

        };
        //登录获取免费次数
        this.LoginfreeCount = function (_userId, _socket) {
            var self = this;
            gameDao.getFreeCount(_userId, function (ResultCode, Result) {
                if (!self.userList[_userId]) return;
                Result.Id = _userId;
                self.userList[_userId].updateFreeGame(Result);
                console.log("从数据库里获得免费次数" + Result.freeCount);
                _socket.emit("LoginfreeCountResult", {ResultCode: 1, freeCount: Result.freeCount});
            })
        };


        //断线保存
        this.lineOutSet = function (_info) {
            if (_info.state == 1) {
                //添加
                this.lineOutList[_info.userId] = {tableId: _info.tableId, seatId: _info.seatId}
                //console.log(this.lineOutList[_info.userId]);
            } else {
                //移除
                this._Csocket.emit("lineOut", {
                    signCode: gameConfig.LoginServeSign,
                    state: 0,
                    gameId: gameConfig.gameId,
                    userId: _info.userId
                });
                delete this.lineOutList[_info.userId];
            }
        };

        //获得断线用户信息
        this.getLineOutMsg = function (_userId) {
            if (this.lineOutList[_userId]) {
                this.lineOutList[_userId].Result = 1;
                return this.lineOutList[_userId];
            } else {
                return {Result: 0};
            }
        };

        //清楚断线用户信息
        this.cleanLineOut = function () {
            //清理登录服务器
            console.log(this.lineOutList);
            for (var Item in this.lineOutList) {
                Item = parseInt(Item);
                var tableid = this.lineOutList[Item].tableId;
                var tablestring = "table" + tableid;
                this._io.sockets.in(tablestring).emit('PlayerOut', {
                    PlayerSeatId: this.lineOutList[Item].seatId,
                    userId: Item
                });
                this.sever.cleanLineOut(tableid, this.lineOutList[Item].seatId);
                this._Csocket.emit("lineOut", {
                    signCode: gameConfig.LoginServeSign,
                    state: 0,
                    gameId: gameConfig.gameId,
                    userId: Item
                })
            }
            this.lineOutList = {};
        };

        this.disconnectAllUser = function () {
            for (let item in this.userList) {
                this.userList[item]._socket.disconnect();
            }
            console.log("服务器开启维护，已经全部离线");
        };

        //运行初始化
        this.init();
    };


    if (_gameinfo) {
        return {getInstand: _gameinfo}
    } else {
        console.log("####create game!####");
        _gameinfo = new Game();
        return {getInstand: _gameinfo}
    }

}();

function RandomNumForList(arr) {
    //从指定数组中选取随机值
    return arr[Math.floor((Math.random() * arr.length))]
}

function RandomNumBoth(Min, Max) {
    //生成指定范围内随机整数
    var Range = Max - Min;
    var Rand = Math.random();
    var num = Min + Math.round(Rand * Range); //四舍五入
    return num;
}

function list_one_count(x, list) {
    //数组中指定值出现次数
    var count = 0;
    for (var i in list) {
        if (list[i] == x) {
            count++
        }
    }
    return count;
}

function es6_set(arr) {
    //es6 数组去重
    return Array.from(new Set(arr));
}


module.exports = GameInfo;

