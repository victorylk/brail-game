var gameDao = require("./../dao/gameDao");
var redis_laba_win_pool = require("./../../util/redis_laba_win_pool");

arithmetic = function (_idx) {
    //相关属性
    //调试是否显示相关数据
    var debug = false;

    //算法说明：
    //游戏倍数分别为
    //2,5,20,3,10,40,5,15,60,7,20,100,30,200,100,10,30,160,15,40,200,20,80,400,50,200,100
    //所以以上的概率为50%,20%,5%
    //
    //
    //本算法说明，先选中组合，然后再尝试他的概率。
    var bet = [[2, 5, 20], [5, 15, 60], [10, 30, 160], [20, 80, 400], [50, 200, 1000], [100, 400, 2000], [0, 0, 0]];
    var linesPoint = [[5, 6, 7, 8, 9], [0, 1, 2, 3, 4], [10, 11, 12, 13, 14], [0, 6, 12, 8, 4], [10, 6, 2, 8, 14], [0, 1, 7, 3, 4], [10, 11, 7, 13, 14], [5, 11, 12, 13, 9], [5, 1, 2, 3, 9]]
    //免费次数
    var freeCountArr = [10, 20, 30];
    //可选择倍数
    var betCountObj = {};
    betCountObj[1] = 1;
    betCountObj[2] = 2;
    betCountObj[5] = 3;
    betCountObj[10] = 4;
    betCountObj[20] = 5;
    betCountObj[50] = 6;
    betCountObj[100] = 7;
    var betCount = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    //外部控制倍率
    this.controlBet = 0.98;
    //超级大奖占成
    this.poolBet = 0.01;
    //最大公约数
    this.max_pro = 0;

    this._testMax = 0;

    //分数数组
    this.scoreArr = {};

    //虚拟奖池
    this.virtual_score_pool = 1000000;
    //实际奖池
    this.score_pool = [];

    //========================================
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

    this.getScorePoolList = function () {
        return this.score_pool;
    };

    this.getScorePoolListLength = function () {
        return betCount.length;
    };

    this.getScoreId = function () {
        return betCount;
    };

    this.getGamblingBalanceGold = function () {
        //获取库存 奖池   数据库同步使用
        var dict = {
            nGamblingBalanceGold: this.nGamblingBalanceGold,
            nGamblingWinPool: this.nGamblingWinPool
        };
        return dict;
    };
    this.addGamblingBalanceGold = function (Gold, Pool) {
        //添加库存 奖池   数据库同步使用
        this.nGamblingBalanceGold += parseInt(Gold);
        this.nGamblingWinPool += parseInt(Pool);
        console.log("添加库存:" + Gold);
        console.log("添加奖池:" + Pool);
        console.log(this.nGamblingBalanceGold);
        console.log(this.nGamblingWinPool)
        //redis存储奖池
        redis_laba_win_pool.redis_win_pool_incrby(parseInt(Pool))
    };
    this.subGamblingBalanceGold = function (Gold, Pool) {
        //减少库存   奖池 数据库同步使用
        //this.nGamblingBalanceGold-= parseInt(Gold);
        this.nGamblingWinPool -= parseInt(Pool);
        console.log("减少库存:" + Gold);
        console.log("减少奖池:" + Pool);
        console.log(this.nGamblingBalanceGold);
        console.log(this.nGamblingWinPool);
        //redis奖池
        redis_laba_win_pool.redis_win_pool_decrby(parseInt(Pool))
    };
    this.getGamblingBalanceLevelBigWin = function () {
        //获取库存  水位 奖池 幸运值   判断中奖使用
        var value = {
            nGamblingWaterLevelGold: this.nGamblingWaterLevelGold,
            nGamblingBalanceGold: this.nGamblingBalanceGold,
            nGamblingWinPool: this.nGamblingWinPool,
            nGamblingBigWinLevel: this.nGamblingBigWinLevel,
            nGamblingBigWinLuck: this.nGamblingBigWinLuck
        };
        return value;
    };

    this.getAllcaishenValue = function () {
        //获得全财神的值
        return this.subValue;
    };

    //获得奖池
    this.getVirtualScorePool = function () {
        //var result = {virtual_score_pool:this.virtual_score_pool,score_pool}
        return this.virtual_score_pool;
    };

    //添加奖池
    this.addVirtualScorePool = function (score_bet) {
        this.virtual_score_pool += parseInt(score_bet);
    };

    //减少虚拟奖池
    this.subVirtualScorePool = function (score_bet, flag) {
        this.subValue = Math.floor((this.virtual_score_pool / 100 * score_bet * 0.9));
        //console.log(score_bet)
        //console.log(this.virtual_score_pool)
        //console.log(this.subValue)
        if (flag) {
            this.virtual_score_pool -= this.subValue;
        } else {
            if (this.virtual_score_pool - this.subValue > 900000 || this.virtual_score_pool > 2000000) {
                this.virtual_score_pool -= this.subValue;
            }
        }

    };

    this.init = function () {
        //初始化水位和库存
        this.initGamblingGame();
    };

    this.CheckBet = function (_betIdx) {
        return betCount[_betIdx];
    };

    //=================================================================================================
    this.initGamblingGame = function () {
        var self = this;
        gameDao.getGamblingGame(function (Result) {

            self.nGamblingWaterLevelGold = Result[0].nGamblingWaterLevelGold;  //水位
            self.nGamblingBalanceGold = Result[0].nGamblingBalanceGold;      //库存
            self.nGamblingWinPool = Result[0].nGamblingWinPool;      //奖池

            self.nGamblingBigWinLevel = Result[0].nGamblingBigWinLevel.split(',').map(Number);  //大奖幸运等级
            self.nGamblingBigWinLuck = Result[0].nGamblingBigWinLuck.split(',').map(Number);    //大奖幸运概率

            //redis存储奖池
            redis_laba_win_pool.redis_win_pool_incrby(self.nGamblingWinPool)


            console.log("读取采池数据完毕!");
            console.log("水位:" + self.nGamblingWaterLevelGold);
            console.log("库存:" + self.nGamblingBalanceGold);
            console.log("奖池:" + self.nGamblingWinPool);
            console.log("大奖幸运等级:" + self.nGamblingBigWinLevel);
            console.log("大奖幸运概率:" + self.nGamblingBigWinLuck);
        })


    };

    this.init();

};

module.exports = arithmetic;