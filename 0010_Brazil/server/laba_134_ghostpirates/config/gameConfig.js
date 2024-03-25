var laba_config = require('../../util/laba_config');

gameConfig = {};
gameConfig.gameId = 234;			//第几个游戏ID
gameConfig.serverId = 15134;		//当前游戏的第几台服务器
gameConfig.logflag = 15134;		//游戏记录表示
gameConfig.port = 15134;		//游戏记录表示
gameConfig.gameName = "ghostpirates";
gameConfig.sendMessage_mul = 5;

//筹码
gameConfig.coinConfig = [1, 10, 100, 1000, 10000];
gameConfig.tax = 1;

gameConfig.seatMax = 30;
gameConfig.tableMax = 10;

gameConfig.LoginServeSign = "slel3@lsl334xx,deka";


//每日获得金币签到活动
gameConfig.everyWinCoinActivity = true;
//等级
gameConfig.lvActivity = true;


gameConfig.GAME_HAND_CARDS_NUMBER_DIAMOND = 15;
gameConfig.GAME_LINES_DIAMOND = [
    [6, 7, 8, 9, 10],       //# line 1
    [1, 2, 3, 4, 5],        //# line 2
    [11, 12, 13, 14, 15],   //# line 3
    [1, 7, 13, 9, 5],       //# line 4
    [11, 7, 3, 9, 15],      //# line 5
    [6, 2, 3, 4, 10],       //# line 6
    [6, 12, 13, 14, 10],    //# line 7
    [1, 2, 8, 14, 15],      //# line 8
    [11, 12, 8, 4, 5],      //# line 9
    [6, 12, 8, 4, 10],      //# line 10
    [6, 2, 8, 12, 10],      //# line 11
    [1, 7, 8, 9, 5],        //# line 12
    [11, 7, 8, 9, 15],      //# line 13
    [1, 7, 3, 9, 5],        //# line 14
    [11, 7, 13, 9, 15],     //# line 15
    [6, 7, 3, 9, 10],       //# line 16
    [6, 7, 13, 9, 10],      //# line 17
    [1, 2, 13, 4, 5],     //# line 18
    [11, 12, 3, 14, 15],     //# line 19
    [1, 12, 13, 14, 5],     //# line 20
];
gameConfig.GAME_MAGIC_CARD_DIAMOND = 9;
gameConfig.GAME_OPEN_BOX_CARD_DIAMOND = -1;
gameConfig.GAME_FREE_TIMES_CARD_DIAMOND = 8;

gameConfig.GAME_COLORS_DIAMOND = [0, 1, 2, 3, 4, 5, 6, 7, gameConfig.GAME_FREE_TIMES_CARD_DIAMOND, gameConfig.GAME_MAGIC_CARD_DIAMOND];
gameConfig.Free_GAME_COLORS_DIAMOND = [0, 1, 2, 3, 4, 5, 6, 7, gameConfig.GAME_MAGIC_CARD_DIAMOND];
gameConfig.GAME_COMBINATIONS_DIAMOND = [
    [5.0, 20.0, 100.0],
    [5.0, 20.0, 100.0],
    [7.0, 30.0, 150.0],
    [7.0, 30.0, 150.0],
    [20.0, 70.0, 500.0],
    [20.0, 150.0, 1000.0],
    [50.0, 500.0, 5000.0],
    [0.0, 0.0, 0.0],
    [0.0, 0.0, 0.0],
    [5.0, 20.0, 100.0],
];

gameConfig.FREE_GAME_TIMES = [10, 20, 15, 10, 20, 12, 25, 10, 30, 12];
gameConfig.MUL_LIST = [2, 2, 2, 2, 2, 2, 3, 2, 3, 2];
gameConfig.SCATTER_COMB = [1, 5, 15, 40, 100, 500, 2000];
gameConfig.GAME_LINE_WIN_LOWER_LIMIT_CARD_NUMBER_DIAMOND = 3;
gameConfig.GAME_LINE_DIRECTION_DIAMOND = laba_config.GAME_SLOT_LEFT_TO_RIGHT;
gameConfig.GAME_LINE_RULE_DIAMOND = true;
gameConfig.GAME_MULTIPLES_DIAMOND = [];

module.exports = gameConfig;