var User = require("./User");
var schedule = require("node-schedule");
var gameConfig = require("./../config/gameConfig");
var urlencode = require('urlencode');
var fs = require('fs');

var gameInfo = require('./game').getInstand;

var luckTreeDao = require("./../dao/luck_tree_Dao");

var laba = require("./../../util/laba");
var redis_send_and_listen = require("./../../util/redis_send_and_listen");
//读取文件包


var luck_tree = function () {

    var _gameinfo = "";

    var Game = function () {

        //初始化算法，使用第X种
        this.initAlgorithm = function (idx) {
            console.log('####init Algorithm!####')
            console.log('use [' + idx + '] Algorithm!')
        };

        this.serverId = gameConfig.serverId;

        //初始化游戏
        this.init = function () {
            console.log('####init game!####')

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
            //水位
            this.nGamblingWaterLevelGold = 0;
            //库存
            this.nGamblingBalanceGold = 0;
            //奖池
            this.nGamblingWinPool = 0;
            //大奖幸运等级
            this.nGamblingBigWinLevel = [];
            //大奖幸运概率
            this.nGamblingBigWinLuck = [];

            var self = this;
            luckTreeDao.getGamblingGame(function (Result) {

                self.nGamblingWaterLevelGold = Result[0].nGamblingWaterLevelGold;  //水位
                self.nGamblingBalanceGold = Result[0].nGamblingBalanceGold;      //库存
                self.nGamblingWinPool = Result[0].nGamblingWinPool;      //奖池

                self.nGamblingBigWinLevel = Result[0].nGamblingBigWinLevel.split(',').map(Number);  //大奖幸运等级
                self.nGamblingBigWinLuck = Result[0].nGamblingBigWinLuck.split(',').map(Number);    //大奖幸运概率


                console.log("摇钱树读取采池数据完毕!");
                console.log("水位:" + self.nGamblingWaterLevelGold);
                console.log("库存:" + self.nGamblingBalanceGold);
                console.log("奖池:" + self.nGamblingWinPool);
                console.log("大奖幸运等级:" + self.nGamblingBigWinLevel);
                console.log("大奖幸运概率:" + self.nGamblingBigWinLuck);
            });

            var rule = new schedule.RecurrenceRule();
            var times = [];
            for (var i = 0; i < 60; i++) {
                times.push(i);
            }
            rule.second = times;
            var c = 0;
            var self = this;
            var j = schedule.scheduleJob(rule, function () {
                self.score_changeLog();
                var nowDate = new Date();
                var minute = nowDate.getMinutes();
                var second = nowDate.getSeconds();
                if (minute % 10 == 0 && second == 1) {
                    //if (second == 1){
                    //	self.saveSocrePool();
                    console.log("保存摇钱树奖池库存");
                    luckTreeDao.Update_GamblingBalanceGold(self.nGamblingBalanceGold, self.nGamblingWinPool, function (Result) {
                    });

                    //console.log("推送在线人数");
                }

            });
        };

        this.tt = 0;

        this.lottery = function (_userId) {
            //用户_userid 摇奖
            //返回-1 未登录
            //返回-2 资金不足

            if (!_userId) {					//传输ID错误
                console.log("未传用户ID")
                return {code: -1};
            }
            if (!gameInfo.userList[_userId]) {	//未找到用户
                console.log("找不到用户")
                return {code: -1}
            }


            var score_before = gameInfo.userList[_userId].getScore();     //用户金币
            var youScore = gameInfo.userList[_userId].getScore();         //用户金币
            //水位
            var nGamblingWaterLevelGold = this.nGamblingWaterLevelGold;
            //库存
            var nGamblingBalanceGold = this.nGamblingBalanceGold;
            //奖池
            var nGamblingWinPool = this.nGamblingWinPool;


            var is_luck = false;


            //======================================================================================
            // 下注总额
            var nBetSum = 100;


            var addBalanceGold = nBetSum * parseInt(nGamblingWaterLevelGold) / 100;    //进入库存的钱
            var addWinPool = parseInt(nBetSum - addBalanceGold);                     //进入奖池的钱

            var jackpotUpperLimit = 0;


            //用户扣钱或者减少免费次数
            var lotteryResult = gameInfo.userList[_userId].addgold(-nBetSum);
            if (!lotteryResult) {
                console.log(nBetSum)
                console.log(_userId + "钱不够")
                //console.log(this.userList[_userId])
                return {code: -2}
            }
            //增加库存和奖池
            this.nGamblingBalanceGold+= parseInt(addBalanceGold);
            this.nGamblingWinPool+= parseInt(addWinPool);

            jackpotUpperLimit = this.nGamblingWinPool;   //可以赢的钱奖池加上下注进入奖池的钱

            var win = 0;
            if (jackpotUpperLimit > 1000) {
                win = RandomNumBoth(10, 1000)
            } else {
                win = RandomNumBoth(10, jackpotUpperLimit)
            }



            var winscore = win;

            //减少奖池
            if (winscore > 0) {
                this.nGamblingWinPool-= parseInt(winscore);
            }

            console.log("最大赢钱数", jackpotUpperLimit);
            console.log("库存", this.nGamblingBalanceGold);
            console.log("奖池", this.nGamblingWinPool);
            console.log("用户赢钱数", winscore);


            var freeCount = 0;
            gameInfo.userList[_userId].winscore(winscore);
            var score_current = gameInfo.userList[_userId].getScore();


            //写入服务器记录
            //1.写记录
            var userInfo = {
                userid: _userId, bet: 100, lines: 20, nBetSum: nBetSum,
                score_before: score_before, score_win: winscore,
                score_current: score_current, result_array: {},
                score_linescore: nBetSum, free_count_win: freeCount, free_count_before: 0,
                free_count_current: 0
            }
            luckTreeDao.lotteryLog([userInfo])


            //记录金钱变化量
            var userInfolog = {
                userid: _userId,
                score_before: youScore,
                score_change: winscore - nBetSum,
                score_current: score_current,
                change_type: 0,
                isOnline: true
            };

            this.score_changeLogList.push(userInfolog);

            //制作结果
            var Result = {
                code: 1, userscore: score_current, winscore: winscore,
                viewarray: {}, winfreeCount: freeCount,
                freeCount: 0, score_pool: this.nGamblingWinPool,
                dictAnalyseResult: {}
            };


            return Result;
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
                gameInfo.insertScore_change_log(saveListTemp);
            }
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

function RandomNumBoth(Min, Max) {
    //生成指定范围内随机整数
    var Range = Max - Min;
    var Rand = Math.random();
    var num = Min + Math.round(Rand * Range); //四舍五入
    return num;
}


module.exports = luck_tree;


//监听gm发送来的消息
redis_send_and_listen.client_1.on("message", function (channel, message) {
    console.log("------------------------------server接收到信息了");
    console.log("channel" + channel);
    console.log("message" + message);
    var message = JSON.parse(message);
    if(channel=="EditLabaSet"){
        if (parseInt(message.serverId) == 99999) {
            var luck_tree = require('./luck_tree').getInstand;
            if(parseInt(message.type)==1){    //修改水位
                luck_tree.nGamblingWaterLevelGold=parseInt(message.swval);
                console.log("修改水位",luck_tree.nGamblingWaterLevelGold)
            }


        }
    }

});

