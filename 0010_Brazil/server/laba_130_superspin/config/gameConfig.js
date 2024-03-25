var laba_config = require('../../util/laba_config');

gameConfig = {};
gameConfig.gameId = 230;			//第几个游戏ID
gameConfig.serverId = 15130;		//当前游戏的第几台服务器
gameConfig.logflag = 15130;		//游戏记录表示
gameConfig.port = 15130;		//游戏记录表示
gameConfig.gameName = "superspin";
gameConfig.sendMessage_mul = 5;

//筹码
gameConfig.coinConfig = [10, 20, 50, 80, 100, 120, 150, 200, 250, 300, 400, 500, 700, 800, 1000, 1500, 2000, 3000, 5000, 6000, 8000];
gameConfig.tax = 1;

gameConfig.seatMax = 30;
gameConfig.tableMax = 10;

gameConfig.LoginServeSign = "slel3@lsl334xx,deka";

//每日获得金币签到活动
gameConfig.everyWinCoinActivity = true;
//等级
gameConfig.lvActivity = true;

gameConfig.GAME_ITEM_NUMBER = 16;

gameConfig.GAME_FREE_TIMES_CARD_DIAMOND = {
    0: 5,
    9: 10
};

gameConfig.GAME_MUL_TURNTABLE = [0, 80, 0.4, 1.2, 20, 8, 0.6, 50, 6, 10, 3, 15, 150, 0.2, 30, 2];

module.exports = gameConfig;