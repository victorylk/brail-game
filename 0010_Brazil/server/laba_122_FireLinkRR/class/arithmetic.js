var gameDao = require("./../dao/gameDao");
var gameConfig = require("./../config/gameConfig");
var redis_laba_win_pool = require("./../../util/redis_laba_win_pool");


arithmetic = function (_idx) {
    //相关属性
    //调试是否显示相关数据
    var debug = false;

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


    //pro 能整除最大值
    this.pro_max = new Array();
    //pro 个数
    this.pro_max_count = new Array();
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

    this.printPool = function () {
        for (var i = 0; i < betCount.length; ++i) {
            console.log("i:" + i + "-" + this.score_pool[i]);
        }
    };

    //获得实际奖池
    this.getScorePool = function (_betIdx) {
        if (this.score_pool[_betIdx]) {
            this.printPool();
            return this.score_pool[_betIdx];
        } else {
            //this.printPool();
            return 0
        }

    };

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

        return dict

    };
    this.addGamblingBalanceGold = function (Gold, Pool) {
        //添加库存 奖池   数据库同步使用
        this.nGamblingBalanceGold += parseInt(Gold);
        this.nGamblingWinPool += parseInt(Pool);
        console.log("添加库存:" + Gold);
        console.log("添加奖池:" + Pool);
        console.log(this.nGamblingBalanceGold);
        console.log(this.nGamblingWinPool);
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
        console.log(this.nGamblingWinPool)
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

    //添加实际奖池
    this.addScorePool = function (_betIdx, _socre) {
        if (this.score_pool[_betIdx]) {
            this.score_pool[_betIdx] += parseInt(_socre);
        } else {
            this.score_pool[_betIdx] = 0;
            this.score_pool[_betIdx] += parseInt(_socre);
        }

        this.printPool();
    };

    //减少奖池
    this.subScorePool = function (_betIdx) {
        if (this.score_pool[_betIdx]) {
            this.score_pool[_betIdx] -= this.subValue;
        } else {
            this.score_pool[_betIdx] = 0;
        }
        this.printPool();
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
        ////debug = true;

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
    //fireLink获取大奖牌种类
    this.getOpenBoxCard = function (isBigWin, _line, _bet) {
        let r = Math.floor(Math.random() * 1000);
        let data = {
            num: 0,
            type: 0
        };

        // if (isBigWin && r === 0) {//MEGA奖池获取规则不明，跳过
        //     data.num = 0;
        //     data.type = 4;//MEGA
        // }
        if (!isBigWin) {
            if (r < 2 && _line === 2) {//MAJOR只出现在最中间
                data.num = "";
                data.type = 3;//MAJOR
            } else if (r < 5) {
                data.num = "";
                data.type = 2;//MINOR
            } else if (r < 10) {
                data.num = "";
                data.type = 1;//MINI
            } else {
                data.type = 0;
                if (_line === 1 || _line === 3) {//上限50倍最大，保证末尾是5的倍数
                    data.num = Math.ceil(Math.random() * _bet * 10) * 5;
                } else {//上限100倍最大
                    data.num = Math.ceil(Math.random() * _bet * 20) * 5;
                }
            }
        } else {//大奖模式奖励调整
            data.type = 0;
            if (r < 700) {
                data.num = Math.ceil(Math.random() * _bet) * 5;
            } else if (r < 950) {
                data.num = Math.ceil(Math.random() * _bet * 2) * 5;
            } else if (r < 990) {
                data.num = Math.ceil(Math.random() * _bet * 5) * 5;
            } else if (r < 1000) {
                data.num = Math.ceil(Math.random() * _bet * 10) * 5;
            }
        }
        return data;
    };

    this.init();

};

module.exports = arithmetic;