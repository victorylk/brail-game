var User = require("./User");
var gameDao = require("./../dao/gameDao");
var arithmetic = require("./arithmetic")
var sever = require("./sever");
var schedule = require("node-schedule");
var gameConfig = require("./../config/gameConfig");

var redis_send_and_listen = require("./../../util/redis_send_and_listen");
var http_bc = require("./../../util/http_broadcast");
//读取文件包

var GameInfo = function () {

    var _gameinfo = "";

    var Game = function () {

        //初始化算法，使用第X种
        this.initAlgorithm = function (idx) {
            console.log('####init Algorithm!####')
            console.log('use [' + idx + '] Algorithm!')
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

                if (minute % 10 === 0 && second === 1) {
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
                    let result = {
                        ResultCode: 1,
                        virPool: self.A.getVirtualScorePool()
                    };

                    for (let item in self.userList) {
                        self.userList[item]._socket.emit("pushVirPool", result);
                    }
                }

            });
        };

        this.tt = 0;

        this.lottery = function (_userId, _bet, _mul, _type) {
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
            var score_before = this.userList[_userId].getScore();     //用户金币
            var sourceFreeCount = this.userList[_userId].getFreeCount();   //获取免费次数
            var youScore = this.userList[_userId].getScore();         //用户金币
            let GamblingBalanceLevelBigWin = this.A.getGamblingBalanceLevelBigWin(); //获取库存 水位 大奖幸运值
            //水位
            let nGamblingWaterLevelGold = GamblingBalanceLevelBigWin.nGamblingWaterLevelGold;
            //奖池
            var nGamblingWinPool = GamblingBalanceLevelBigWin.nGamblingWinPool;
            var is_luck = false;

            //======================================================================================
            // 下注总额
            let nBetSum = 0;
            let curWinScore = this.userList[_userId].getCurWinScore();         //用户当前获胜金币
            let curWinTimes = this.userList[_userId].getCurWinTimes();         //用户获胜次数
            let cardArray = this.userList[_userId].getOriginalArray();
            if (curWinScore === 0) {
                nBetSum = _bet * _mul;
                this.userList[_userId].setCurWinScore(nBetSum);
                //新的一轮重新洗牌
                for (let i = 0; i < 52; i++) {
                    cardArray.push(i);
                }
                this.userList[_userId].setOriginalArray(cardArray);
            } else {
                nBetSum = _bet * _mul;
            }

            var addBalanceGold = nBetSum * parseInt(nGamblingWaterLevelGold) / 100;    //进入库存的钱
            var addWinPool = parseInt(nBetSum - addBalanceGold);                     //进入奖池的钱

            var jackpotUpperLimit = 0;


            //用户扣钱或者减少免费次数
            var lotteryResult = 0;
            let isFinal = this.userList[_userId].getFinal();
            if (isFinal) {
                lotteryResult = 1;
            } else {
                lotteryResult = this.userList[_userId].lottery(nBetSum);
            }
            if (!lotteryResult) {
                console.log(nBetSum);
                console.log(_userId + "分数不够");
                //console.log(this.userList[_userId])
                return {code: -2};
            }

            //增加库存和奖池
            if (!isFinal) {
                this.A.addGamblingBalanceGold(addBalanceGold, addWinPool);
            }
            jackpotUpperLimit = parseInt(nGamblingWinPool + addWinPool);   //可以赢的钱奖池加上下注进入奖池的钱
            this.A.addVirtualScorePool(nBetSum);

            let dictAnalyseResult = this.A.gameProcessor(nBetSum, jackpotUpperLimit, cardArray, _type);

            cardArray.forEach(function (item, index, arr) {
                if (item === dictAnalyseResult["winCards"]) {
                    arr.splice(index, 1);
                }
            });
            this.userList[_userId].setOriginalArray(cardArray);
            //设置连胜状态
            this.userList[_userId].setFinal(dictAnalyseResult["isFinal"]);
            if (dictAnalyseResult["win"] > 0) {
                dictAnalyseResult["winTimes"] = curWinTimes + 1;
                this.userList[_userId].setCurWinTimes(curWinTimes + 1);
                this.userList[_userId].setCurWinScore(dictAnalyseResult["win"]);

            } else {
                dictAnalyseResult["winTimes"] = curWinTimes;
            }

            let ResultArray = dictAnalyseResult;
            let winscore;
            if (dictAnalyseResult["win"] === 0) {
                winscore = 0;
                if (isFinal) {
                    lotteryResult = this.userList[_userId].lottery(nBetSum);
                    this.A.addGamblingBalanceGold(addBalanceGold, addWinPool);
                }
            } else {
                if (isFinal) {
                    winscore = parseInt(dictAnalyseResult["win"] - curWinScore * _mul);
                } else {
                    winscore = parseInt(dictAnalyseResult["win"]);
                }
            }

            //减少奖池
            if (winscore > 0) {
                this.A.subGamblingBalanceGold(0, winscore)
            }

            console.log("最大赢钱数", jackpotUpperLimit);
            console.log("库存", this.A.getGamblingBalanceLevelBigWin().nGamblingBalanceGold);
            console.log("奖池", this.A.getGamblingBalanceLevelBigWin().nGamblingWinPool);
            console.log("用户赢钱数", winscore);

            var freeCount = 0;

            this.userList[_userId].winscore(winscore);
            var resFreeCount = this.userList[_userId].getFreeCount();
            var score_current = this.userList[_userId].getScore();
            var arstring = JSON.stringify(dictAnalyseResult);


            //写入服务器记录
            //1.写记录
            var userInfo = {
                userid: _userId,
                bet: nBetSum,
                lines: 0,
                nBetSum: nBetSum,
                score_before: score_before,
                score_win: winscore,
                score_current: score_current,
                result_array: arstring,
                score_linescore: nBetSum,
                free_count_win: 0,
                free_count_before: 0,
                free_count_current: 0
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
                winscore: winscore,
                viewarray: ResultArray,
                winfreeCount: freeCount,
                freeCount: resFreeCount,
                score_pool: this.A.getVirtualScorePool(),
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

        this.settlementGame = function (_userId, _socket) {
            //判断是否需要发送中奖信息到通知服
            if (http_bc && this.userList[_userId].getCurWinScore() >= gameConfig.bigWinScore) {
                let data = {
                    userId: _userId,
                    nickName: this.userList[_userId]._nickname,
                    gameName: gameConfig.gameName,
                    win: this.userList[_userId].getCurWinScore()
                };
                http_bc.send(data);
            }
            this.userList[_userId].setCurWinScore(0);
            this.userList[_userId].setCurWinTimes(0);
            this.userList[_userId].setFinal(false);
            this.userList[_userId].setOriginalArray([]);
            _socket.emit("settlementResult", {ResultCode: 1, score: this.userList[_userId].getScore()});
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

            let resultObj = {
                account: this.userList[userInfo._userId]._account,
                id: this.userList[userInfo._userId]._userId,
                nickname: this.userList[userInfo._userId]._nickname,
                score: this.userList[userInfo._userId]._score,
                betList: gameConfig.coinConfig,
                virPool: this.A.getVirtualScorePool()
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

                let ResultData = {
                    TableId: LoginResult.tableId,
                    seatId: LoginResult.seatId,
                    userList: tableUserList,
                    betList: gameConfig.coinConfig,
                    score_pool: self.A.getVirtualScorePool()
                };
                _socket.emit("LoginRoomResult", {ResultCode: 1, ResultData: ResultData});

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
                this.sever.cleanLineOut(tableid, this.lineOutList[Item].seatId)
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

}()

function RandomNumBoth(Min, Max) {
    //生成指定范围内随机整数
    var Range = Max - Min;
    var Rand = Math.random();
    var num = Min + Math.round(Rand * Range); //四舍五入
    return num;
}


module.exports = GameInfo;

