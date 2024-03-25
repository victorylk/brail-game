﻿var User = require("./User");
var gameDao = require("../dao/gameDao");
var arithmetic = require("./arithmetic");
var sever = require("./sever");
var schedule = require("node-schedule");
var gameConfig = require("../config/gameConfig");

var laba = require("../../util/laba");
var http_bc = require("./../../util/http_broadcast");
var redis_send_and_listen = require("../../util/redis_send_and_listen");
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

            var rule = new schedule.RecurrenceRule();
            var times = [];
            for (var i = 0; i < 60; i++) {
                times.push(i);
            }
            rule.second = times;
            var self = this;
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
                var nowDate = new Date();
                var minute = nowDate.getMinutes();
                var second = nowDate.getSeconds();
                if (minute % 10 == 0 && second == 1) {
                    //if (second == 1){
                    //	self.saveSocrePool();
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
                        nGamblingWinPool: nGamblingWinPool
                    };

                    for (let item in self.userList) {
                        self.userList[item]._socket.emit("pushGamblingWinPool", result);
                    }
                }

            });
        };

        this.tt = 0;

        this.lottery = function (_userId, _betIdx, _nBetList) {
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
            // is_luck=true


            var bFreeTimeFlag = false;     //是否有免费次数
            if (sourceFreeCount > 0) {
                bFreeTimeFlag = true
            }

            //======================================================================================
            var nBetList = _nBetList;    //下注数组
            // 下注总额
            var nBetSum = 0;
            for (var i in nBetList) {
                nBetSum += nBetList[i]
            }

            var addBalanceGold = parseInt(nBetSum * parseInt(nGamblingWaterLevelGold) / 100);     //进入库存的钱
            var addWinPool = parseInt(nBetSum - addBalanceGold);                                  //进入奖池的钱

            var jackpotUpperLimit = 0;

            //用户扣钱或者减少免费次数
            var lotteryResult = this.userList[_userId].lottery(nBetSum);
            if (!lotteryResult) {
                console.log(_userId + "分数不够");
                //console.log(this.userList[_userId])
                return {code: -2}
            }
            if (!bFreeTimeFlag) {
                //增加库存和奖池
                this.A.addGamblingBalanceGold(addBalanceGold, addWinPool);
                jackpotUpperLimit = parseInt(nGamblingWinPool + addWinPool);   //可以赢的钱 奖池加上下注进入奖池的钱
            } else {
                jackpotUpperLimit = parseInt(nGamblingWinPool)
            }

            while (true) {
                var nHandCards = [];  //# 手牌
                //# 处理结果初始化
                var dictAnalyseResult = {
                    code: 2,
                    nHandCards: [],  //# 结果手牌
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
                var nGameColors = [];

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
                        gameConfig.GAME_HAND_CARDS_No_Magic_Column_List)
                }

                //# 下注倍数
                var bet_num = parseInt(nBetSum / gameConfig.GAME_GOLD_Single);

                // 测试中奖连线是否正常
                // nHandCards = [
                //     5, 6, 9, 9, 12,
                //     5, 12, 1, 10, 4,
                //     3, 0, 6, 8, 9
                // ]

                //# 获取处理结果
                dictAnalyseResult = laba.AnalyseColumnSolt(nHandCards,
                    gameConfig.GAME_MAGIC_CARD_DIAMOND[0],
                    gameConfig.GAME_FREE_TIMES_CARD_DIAMOND,
                    gameConfig.GAME_HAND_CARDS_LowerLimit,
                    gameConfig.GAME_HAND_CARDS_Column, bet_num,
                    gameConfig.GAME_COMBINATIONS_DIAMOND,
                    gameConfig.GAME_GOLD_Single);


                dictAnalyseResult["nBet"] = nBetSum;

                // 覆盖掉之前的结果重新计算中大奖和免费模式
                dictAnalyseResult["getFreeTime"] = {"bFlag": false, "nFreeType": 0, "nFreeTime": 0};
                dictAnalyseResult["getOpenBox"] = {bFlag: false, nWinOpenBox: 0, win: 0};
                // 判断是否进入免费模式
                if (!bFreeTimeFlag && list_one_count(gameConfig.GAME_FREE_TIMES_CARD_DIAMOND, nHandCards) >= 5) {//不是免费期间才能触发免费
                    //免费牌每列只许出现一张
                    let col1 = [nHandCards[0], nHandCards[5], nHandCards[10]];
                    let col2 = [nHandCards[1], nHandCards[6], nHandCards[11]];
                    let col3 = [nHandCards[2], nHandCards[7], nHandCards[12]];
                    let col4 = [nHandCards[3], nHandCards[8], nHandCards[13]];
                    let col5 = [nHandCards[4], nHandCards[9], nHandCards[14]];
                    if (list_one_count(gameConfig.GAME_FREE_TIMES_CARD_DIAMOND, col1) > 1 &&
                        list_one_count(gameConfig.GAME_FREE_TIMES_CARD_DIAMOND, col2) > 1 &&
                        list_one_count(gameConfig.GAME_FREE_TIMES_CARD_DIAMOND, col3) > 1 &&
                        list_one_count(gameConfig.GAME_FREE_TIMES_CARD_DIAMOND, col4) > 1 &&
                        list_one_count(gameConfig.GAME_FREE_TIMES_CARD_DIAMOND, col5) > 1) {
                        dictAnalyseResult["getFreeTime"] = { "bFlag": true, "nFreeTime": 12, "nIndex": 0 };
                    }
                }
                /*
                添加
                在免费游戏模式中，如果连线成功
                */
                if (bFreeTimeFlag && sourceFreeCount > 0) {
                    let tempBeishu = RandomFreeBet(sourceFreeType);

                    dictAnalyseResult["getFreeTime"]["nFreeType"] = sourceFreeType;
                    dictAnalyseResult["win"] += dictAnalyseResult["win"] * tempBeishu;
                }


                //# 将手牌添加到游戏结果字典
                var new_hand_card = [];
                for (var i in nHandCards) {
                    //替换万能牌
                    if (nHandCards.hasOwnProperty(i)) {

                    }
                    new_hand_card.push(parseInt(nHandCards[i]) + 1);
                }
                dictAnalyseResult["nHandCards"] = new_hand_card;

                // 判断
                var break_check = false;
                if (parseInt(dictAnalyseResult["win"]) + parseInt(dictAnalyseResult["getOpenBox"]["win"]) == 0) {
                    break_check = true
                } else if (parseInt(dictAnalyseResult["win"]) + parseInt(dictAnalyseResult["getOpenBox"]["win"]) < parseInt(jackpotUpperLimit)) {
                    break_check = true
                }

                if (break_check && !dictAnalyseResult["getOpenBox"]["bFlag"] && !dictAnalyseResult["getFreeTime"]["bFlag"]) {
                    break_check = true
                } else {
                    if (break_check) {
                        if (dictAnalyseResult["getOpenBox"]["bFlag"] && is_luck) {

                        } else if (dictAnalyseResult["getFreeTime"]["bFlag"] && is_luck) {

                        } else {
                            break_check = false
                        }
                    }
                }

                if (break_check) {
                    console.log("-----------------------------");
                    console.log(nHandCards);
                    console.log(dictAnalyseResult);
                    console.log(dictAnalyseResult["win"]);

                    break
                } else {
                    console.log("从新发牌")
                }
            }

            var ResultArray = dictAnalyseResult;
            // 计算赢得的钱数
            var winscore = parseInt(dictAnalyseResult["win"]) + parseInt(dictAnalyseResult["getOpenBox"]["win"]);

            // 减少奖池
            if (winscore > 0) {
                this.A.subGamblingBalanceGold(0, winscore)
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


            var freeCount = dictAnalyseResult["getFreeTime"]["nFreeTime"];

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
                lines: 243,
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
                userscore: score_current - dictAnalyseResult["getOpenBox"]["win"],
                winscore: dictAnalyseResult["win"],
                viewarray: ResultArray,
                winfreeCount: freeCount,
                freeCount: resFreeCount,
                score_pool: 0,
                dictAnalyseResult: dictAnalyseResult
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

            //已经断线
            if (this.userList[userInfo._userId]._isLeave) {
                var result = {ResultCode: 0, userId: userInfo._userId};
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
            var resultObj = {
                account: this.userList[userInfo._userId]._account,
                id: this.userList[userInfo._userId]._userId,
                nickname: this.userList[userInfo._userId]._nickname,
                score: this.userList[userInfo._userId]._score,
                nGamblingWinPool: nGamblingWinPool
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

        //保存时间段输赢状况
        this.saveSocrePool = function () {
            //获得虚拟池
            var Virtualpool = this.A.getVirtualScorePool();
            //获得实际池
            var poollist = this.A.getScorePoolList();

            //var poollistLength = this.A.getScorePoolListLength();

            var poollistId = this.A.getScoreId();

            gameDao.Update_score_pool(poollist, Virtualpool, poollistId, function (Result) {
            })
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
                Result.Id = _userId
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
                Result.Id = _userId
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
                })
                delete this.lineOutList[_info.userId];
            }
        }

        //获得断线用户信息
        this.getLineOutMsg = function (_userId) {
            if (this.lineOutList[_userId]) {
                this.lineOutList[_userId].Result = 1;
                return this.lineOutList[_userId];
            } else {
                return {Result: 0};
            }
        }

        //清楚断线用户信息
        this.cleanLineOut = function () {
            //清理登录服务器
            console.log(this.lineOutList)
            for (var Item in this.lineOutList) {
                Item = parseInt(Item)
                var tableid = this.lineOutList[Item].tableId;
                var tablestring = "table" + tableid;
                this._io.sockets.in(tablestring).emit('PlayerOut', {
                    PlayerSeatId: this.lineOutList[Item].seatId,
                    userId: Item
                });
                this.sever.cleanLineOut(tableid, this.lineOutList[Item].seatId)
                this._Csocket.emit("lineOut", {
                    signCode: gameConfig.LoginServeSign,
                    state: 0,
                    gameId: gameConfig.gameId,
                    userId: Item
                })
            }
            this.lineOutList = {};
        }

        this.getDownTime = function (_socket) {
            if (!this.userList[_socket.userId]) {
                //console.log("用户" + _socket.userId + "不存在");
                return;
            }

            var tableid = this.userList[_socket.userId].TableId;
            if (tableid < 0) {
                _socket.emit("getDownTimeResult", {ResultCode: 0, msg: "用户没有进入桌子"});
                return;
            }

            if (this.upUserList[tableid].length == 0) {
                _socket.emit("getDownTimeResult", {
                    ResultCode: 1,
                    downTime: this.sever.downTime,
                    upUserList: [],
                    upCoin: 0,
                    DownCoin: [0, 0, 0],
                    myDownCoin: [0, 0, 0]
                });
                return;
            }

            var down1 = 0;
            var down2 = 0;
            var down3 = 0;
            for (var itme in this.downCoinList[tableid]) {
                down1 += this.downCoinList[tableid][itme][0];
                down2 += this.downCoinList[tableid][itme][1];
                down3 += this.downCoinList[tableid][itme][2];
            }

            var mydown1 = 0;
            var mydown2 = 0;
            var mydown3 = 0;
            if (this.downCoinList[tableid][_socket.userId]) {
                mydown1 = this.downCoinList[tableid][_socket.userId][0];
                mydown2 = this.downCoinList[tableid][_socket.userId][1];
                mydown3 = this.downCoinList[tableid][_socket.userId][2];
            }

            //每门下注额度
            _socket.emit("getDownTimeResult", {
                ResultCode: 1,
                downTime: this.sever.downTime,
                upUserList: this.upUserList[tableid],
                upCoin: this.upUserList[tableid][0].upCoin,
                DownCoin: [down1, down2, down3],
                myDownCoin: [mydown1, mydown2, mydown3]
            });
        }


        this.disconnectAllUser = function () {
            for (var itme in this.userList) {
                this.userList[itme]._socket.disconnect();
            }
            console.log("服务器开启维护，已经全部离线");
        }

        //运行初始化
        this.init();
    }


    if (_gameinfo) {
        return {getInstand: _gameinfo}
    } else {
        console.log("####create game!####");
        _gameinfo = new Game();
        return {getInstand: _gameinfo}
    }

}()

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


module.exports = GameInfo;

