﻿var User = require("./User");
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
            var sourceFreeType = this.userList[_userId].getFreeType();   //获取免费游戏模式
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
                bFreeTimeFlag = true;
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


            //判断下注长度
            if (nBetList.length != gameConfig.GAME_LINES_DIAMOND.length) {
                return {code: -1};
            }
            //用户扣钱或者减少免费次数
            var lotteryResult = this.userList[_userId].lottery(nBetSum);
            if (!lotteryResult) {
                console.log(nBetSum);
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

                if (bFreeTimeFlag) {
                    //# 免费模式生成手牌
                    nHandCards = laba.createHandCards(bFreeTimeFlag, gameConfig.GAME_FREE_TIMES_CARD_DIAMOND,
                        gameConfig.Free_GAME_COLORS_DIAMOND, gameConfig.GAME_HAND_CARDS_NUMBER_DIAMOND)
                } else {
                    //# 生成手牌
                    nHandCards = laba.createHandCards(bFreeTimeFlag, gameConfig.GAME_FREE_TIMES_CARD_DIAMOND,
                        gameConfig.GAME_COLORS_DIAMOND, gameConfig.GAME_HAND_CARDS_NUMBER_DIAMOND)
                }

                // nHandCards=[5,5,5,1,2,3,1,2,3,2,3,1,2,3,1]
                //添加
                //wild元素，只允许出现在2～5列
                if (nHandCards[0] === gameConfig.GAME_MAGIC_CARD_DIAMOND ||
                    nHandCards[3] === gameConfig.GAME_MAGIC_CARD_DIAMOND ||
                    nHandCards[6] === gameConfig.GAME_MAGIC_CARD_DIAMOND) {
                    continue;
                }
                //添加结束
                for (var i = 0; i < gameConfig.GAME_HAND_CARDS_NUMBER_DIAMOND; i++) {
                    dictAnalyseResult["nWinCards"].push(false)
                }

                //# 获取处理结果
                dictAnalyseResult = laba.newAnalyse(nHandCards, gameConfig.GAME_LINES_DIAMOND,
                    gameConfig.GAME_COMBINATIONS_DIAMOND,
                    gameConfig.GAME_MAGIC_CARD_DIAMOND,
                    gameConfig.GAME_LINE_WIN_LOWER_LIMIT_CARD_NUMBER_DIAMOND,
                    gameConfig.GAME_OPEN_BOX_CARD_DIAMOND, 3,
                    gameConfig.GAME_FREE_TIMES_CARD_DIAMOND, 3,
                    gameConfig.GAME_MULTIPLES_DIAMOND,
                    nBetList, dictAnalyseResult, jackpotUpperLimit);

                //# 判断是否进入免费模式 2345列出现3个进入免费 所以要从新判断
                dictAnalyseResult["getFreeTime"] = {"bFlag": false, "nFreeType": 0, "nFreeTime": 0};
                dictAnalyseResult["getOpenBox"] = {bFlag: false, nWinOpenBox: 0, win: 0};


                //# 将手牌添加到游戏结果字典
                var new_hand_card = [];
                for (var i in nHandCards) {
                    new_hand_card.push(parseInt(nHandCards[i]) + 1);
                }
                dictAnalyseResult["nHandCards"] = new_hand_card;


                var break_check = false;
                if (parseInt(dictAnalyseResult["win"]) + parseInt(dictAnalyseResult["getOpenBox"]["win"]) == 0) {
                    break_check = true;
                } else if (parseInt(dictAnalyseResult["win"]) + parseInt(dictAnalyseResult["getOpenBox"]["win"]) < parseInt(jackpotUpperLimit)) {
                    break_check = true;
                }
                if (break_check && !dictAnalyseResult["getOpenBox"]["bFlag"] && !dictAnalyseResult["getFreeTime"]["bFlag"]) {
                    break_check = true;
                } else {
                    if (break_check) {
                        if (dictAnalyseResult["getOpenBox"]["bFlag"] && is_luck) {

                        } else if (dictAnalyseResult["getFreeTime"]["bFlag"] && is_luck) {

                        } else {
                            break_check = false;
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
                    console.log("从新发牌");
                }


            }


            var ResultArray = dictAnalyseResult;

            var winscore = parseInt(dictAnalyseResult["win"]) + parseInt(dictAnalyseResult["getOpenBox"]["win"]);

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


            var freeCount = dictAnalyseResult["getFreeTime"]["nFreeTime"];

            this.userList[_userId].winscore(winscore);
            this.userList[_userId].AddFreeCount(freeCount);
            var resFreeCount = this.userList[_userId].getFreeCount();
            var score_current = this.userList[_userId].getScore();
            var arstring = JSON.stringify(dictAnalyseResult);

            if (resFreeCount) {
                dictAnalyseResult["is_free"] = true;
            } else {
                dictAnalyseResult["is_free"] = false;
            }
            dictAnalyseResult["user_score"] = this.userList[_userId].getScore();


            //写入服务器记录
            //1.写记录
            var userInfo = {
                userid: _userId,
                bet: _bet,
                lines: gameConfig.GAME_LINES_DIAMOND.length,
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

        this.setFreeType = function (_userId, _type) {

            if (typeof _userId == 'undefined') {					//传输ID错误
                console.log("未传用户ID");
                return false;
            }
            if (!this.userList[_userId]) {	//未找到用户
                console.log("找不到用户");
                return false
            }
            if (_type <= 0) {	//传入参数错误
                console.log("传入参数错误");
                return false
            }
            if (this.userList[_userId].getFreeCount() > 0) {
                return false
            }

            let freeCount = 0;
            switch (_type) {
                case 1:
                    freeCount = 28;
                    break;
                case 2:
                    freeCount = 14;
                    break;
                case 3:
                    freeCount = 7;
                    break;
            }

            console.log("免费次数", this.userList[_userId].getFreeCount());

            this.userList[_userId].AddFreeCount(freeCount);
            this.userList[_userId].SetFreeType(_type);
            return {type: _type, freeCount: freeCount};
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
            console.log("zaixianrenshu----------------------------------", this.onlinePlayerCount);
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

            let resultObj = {
                account: this.userList[userInfo._userId]._account,
                id: this.userList[userInfo._userId]._userId,
                nickname: this.userList[userInfo._userId]._nickname,
                score: this.userList[userInfo._userId]._score
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


        //删除用户
        this.deleteUser = function (_socket) {
            if (_socket.userId) {
                //存免费次数
                var info = {
                    userId: _socket.userId,
                    freeCount: this.userList[_socket.userId].getFreeCount(),
                    freeType: this.userList[_socket.userId].getFreeType(),
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
                        var url = 0;
                        if (this.userList[userid]._headimgurl) {
                            url = ""
                        }

                        userItem.headimgurl = url;
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
                    freeType: self.userList[_userId].getFreeType(),
                    score_pool: self.A.getVirtualScorePool()
                };
                _socket.emit("LoginRoomResult", {ResultCode: 1, ResultData: ResultData});

                if (!linemsg.Result) {
                    var tablestring = "table" + LoginResult.tableId;
                    var url = 0;
                    if (self.userList[_userId]._headimgurl) {
                        url = ""
                    }
                    _socket.broadcast.to(tablestring).emit('playEnter', {
                        ResultCode: 1,
                        ResultData: {
                            userId: _userId,
                            TableId: LoginResult.tableId,
                            seatId: LoginResult.seatId,
                            nickname: self.userList[_userId]._nickname,
                            score: self.userList[_userId]._score,
                            headimgurl: url,
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
                _socket.emit("LoginfreeCountResult", {
                    ResultCode: 1,
                    freeCount: Result.freeCount,
                    freeType: Result.freeType
                });
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
            for (var itme in this.userList) {
                this.userList[itme]._socket.disconnect();
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

module.exports = GameInfo;

