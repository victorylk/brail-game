var laba_config = require('../../util/laba_config');

gameConfig = {};
gameConfig.gameId = 235;			//第几个游戏ID
gameConfig.serverId = 15135;		//当前游戏的第几台服务器
gameConfig.logflag = 15135;		//游戏记录表示
gameConfig.port = 15135;		//游戏记录表示
gameConfig.gameName = "spinBig";
gameConfig.sendMessage_mul = 5;

//筹码
gameConfig.coinConfig = [100, 500, 1000, 2000];
gameConfig.tax = 1;

gameConfig.seatMax = 30;
gameConfig.tableMax = 10;

gameConfig.LoginServeSign = "slel3@lsl334xx,deka";

//每日获得金币签到活动
gameConfig.everyWinCoinActivity = true;
//等级
gameConfig.lvActivity = true;

gameConfig.GAME_ITEM_NUMBER = 10;

gameConfig.GAME_FREE_TIMES_CARD_DIAMOND = {
    0: 5,
    8: 10
};

gameConfig.GAME_MUL_TURNTABLE = [
    [200, 200, 800, 300, 200, 3, 3, 120, 500, 700],
    [16, 1000, 16, 1500, 5000, 10000, 4000, 1250, 600, 2500],
    [1200, 2000, 40000, 25, 5000, 1000, 3000, 25, 10000, 150],
    [2400, 40, 100000, 10000, 4000, 20000, 40, 16000, 10000, 30000],
];
gameConfig.FREE_MAX_MUL = 1;
module.exports = gameConfig;