var laba_config = require('../../util/laba_config');

gameConfig = {};
gameConfig.gameId = 266;			//第几个游戏ID
gameConfig.serverId = 15166;		//当前游戏的第几台服务器
gameConfig.logflag = 15166;			//游戏记录表示
gameConfig.port = 15166;			//游戏记录表示
gameConfig.gameName = "bikiniparadise";
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


gameConfig.GAME_HAND_CARDS_NUMBER_DIAMOND = 20;
gameConfig.GAME_LINES_DIAMOND = [
    [1, 2, 3, 4, 5],        //# line 1
    [6, 7, 8, 9, 10],       //# line 2
    [11, 12, 13, 14, 15],   //# line 3
    [16, 17, 18, 19, 20],   //# line 4
    [1, 7, 3, 9, 5],        //# line 5
    [6, 12, 3, 14, 10],     //# line 6
    [11, 17, 13, 19, 15],   //# line 7
    [6, 2, 8, 4, 10],       //# line 8
    [11, 7, 13, 9, 15],     //# line 9
    [16, 12, 18, 14, 20],   //# line 10
    [1, 2, 8, 4, 5],        //# line 11
    [6, 7, 13, 9, 10],      //# line 12
    [6, 7, 3, 9, 10],       //# line 13
    [11, 12, 8, 14, 15],    //# line 14
    [16, 17, 13, 19, 20],   //# line 15
    [1, 7, 8, 9, 5],	    //# line 16
    [6, 12, 13, 14, 10],	//# line 17
    [11, 17, 18, 19, 15],	//# line 18
    [6, 2, 3, 4, 10],	    //# line 19
    [11, 7, 8, 9, 15],	    //# line 20
    [16, 12, 13, 14, 20],	//# line 21
    [1, 7, 13, 9, 5],	    //# line 22
    [6, 12, 18, 14, 10],	//# line 23
    [11, 7, 3, 9, 15],	    //# line 24
    [16, 12, 8, 14, 20],	//# line 25
];

gameConfig.GAME_MAGIC_CARD_DIAMOND = 11;
gameConfig.GAME_OPEN_BOX_CARD_DIAMOND = -1;
gameConfig.GAME_FREE_TIMES_CARD_DIAMOND = 10;
gameConfig.GAME_COLORS_DIAMOND = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
gameConfig.Free_GAME_COLORS_DIAMOND = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
gameConfig.GAME_COMBINATIONS_DIAMOND = [
    [5.0, 10.0, 15.0],
    [5.0, 10.0, 15.0],
    [5.0, 10.0, 15.0],
    [5.0, 10.0, 15.0],
    [5.0, 10.0, 15.0],
    [10.0, 15.0, 20.0],
    [10.0, 15.0, 20.0],
    [15.0, 20.0, 25.0],
    [15.0, 20.0, 25.0],
    [20.0, 25.0, 30.0],
    [0.0, 0.0, 0.0],
    [0.0, 0.0, 0.0],
];
gameConfig.GAME_LINE_WIN_LOWER_LIMIT_CARD_NUMBER_DIAMOND = 3;
gameConfig.GAME_LINE_DIRECTION_DIAMOND = laba_config.GAME_SLOT_LEFT_TO_RIGHT;
gameConfig.GAME_LINE_RULE_DIAMOND = true;
gameConfig.GAME_MULTIPLES_DIAMOND = [];

//# 翻牌子对应颜色倍数
gameConfig.GAME_DIAMOND_TURN_OVER_CARD = {
    1: 10,
    2: 100,
    3: 1000,
};

module.exports = gameConfig;