var laba_config = require('../../util/laba_config');

gameConfig = {};
gameConfig.gameId = 225;			//第几个游戏ID
gameConfig.serverId = 15125;		//当前游戏的第几台服务器
gameConfig.logflag = 15125;		//游戏记录表示
gameConfig.port = 15125;		//游戏记录表示
gameConfig.gameName = "FireLinkRoute66";
gameConfig.sendMessage_mul = 5;

//筹码
gameConfig.coinConfig = [1, 10, 100, 1000, 10000];
gameConfig.tax = 0.99;

gameConfig.seatMax = 30;
gameConfig.tableMax = 10;

gameConfig.LoginServeSign = "slel3@lsl334xx,deka";

//每日获得金币签到活动
gameConfig.everyWinCoinActivity = true;
//等级
gameConfig.lvActivity = true;

gameConfig.GAME_HAND_CARDS_NUMBER_DIAMOND = 20;
gameConfig.GAME_LINES_DIAMOND = [
    [6, 7, 8, 9, 10],       //# line 1
    [1, 2, 3, 4, 5],        //# line 2
    [11, 12, 13, 14, 15],   //# line 3
    [16, 17, 18, 19, 20],   //# line 4
    [6, 12, 18, 14, 10],    //# line 5
    [11, 7, 3, 9, 15],      //# line 6
    [1, 7, 13, 9, 5],       //# line 7
    [16, 12, 8, 14, 20],    //# line 8
    [11, 17, 13, 19, 15],   //# line 9
    [6, 2, 8, 4, 10],       //# line 10
    [6, 7, 13, 19, 20],     //# line 11
    [11, 12, 8, 4, 5],      //# line 12
    [16, 12, 13, 14, 20],   //# line 13
    [1, 7, 8, 9, 5],        //# line 14
    [6, 12, 8, 4, 10],      //# line 15
    [11, 7, 13, 19, 15],	//# line 16
    [6, 2, 3, 9, 15],	    //# line 17
    [11, 17, 18, 14, 10],	//# line 18
    [6, 12, 13, 14, 10],	//# line 19
    [11, 7, 8, 9, 15],	    //# line 20
    [11, 12, 18, 14, 10],	//# line 21
    [6, 7, 3, 9, 15],	    //# line 22
    [1, 7, 3, 9, 5],	    //# line 23
    [16, 12, 18, 14, 20],	//# line 24
    [1, 2, 8, 4, 5],	    //# line 25
    [16, 17, 13, 19, 20],	//# line 26
    [6, 7, 13, 9, 10],	    //# line 27
    [11, 12, 8, 14, 15],	//# line 28
    [1, 2, 8, 14, 15],	    //# line 29
    [16, 17, 13, 9, 10],	//# line 30
    [6, 12, 8, 14, 10],	    //# line 31
    [11, 7, 13, 9, 15],	    //# line 32
    [11, 17, 13, 9, 15],	//# line 33
    [6, 2, 8, 14, 10],	    //# line 34
    [6, 2, 3, 4, 10],	    //# line 35
    [11, 17, 18, 19, 15],	//# line 36
    [6, 7, 8, 14, 20],	    //# line 37
    [11, 12, 13, 9, 5],	    //# line 38
    [1, 7, 13, 19, 15],	    //# line 39
    [16, 12, 8, 4, 10],	    //# line 40
    [6, 12, 18, 19, 20],	//# line 41
    [11, 7, 3, 4, 5],	    //# line 42
    [1, 2, 3, 9, 15],	    //# line 43
    [16, 17, 18, 14, 10],	//# line 44
    [16, 12, 13, 9, 5],	    //# line 45
    [1, 7, 8, 14, 20],	    //# line 46
    [6, 12, 13, 19, 20],	//# line 47
    [11, 7, 8, 4, 5],	    //# line 48
    [1, 7, 3, 9, 15],	    //# line 49
    [16, 12, 18, 14, 10],	//# line 50
];

gameConfig.GAME_MAGIC_CARD_DIAMOND = 11;
gameConfig.GAME_OPEN_BOX_CARD_DIAMOND = 10;
gameConfig.GAME_FREE_TIMES_CARD_DIAMOND = 9;
gameConfig.GAME_COLORS_DIAMOND = [0, 1, 2, 3, 4, 5, 6, 7, 8, gameConfig.GAME_FREE_TIMES_CARD_DIAMOND, gameConfig.GAME_MAGIC_CARD_DIAMOND, gameConfig.GAME_OPEN_BOX_CARD_DIAMOND];//常规花色
gameConfig.Free_GAME_COLORS_DIAMOND = [0, 1, 2, 3, 4, 5, 6, 7, 8, gameConfig.GAME_FREE_TIMES_CARD_DIAMOND, gameConfig.GAME_MAGIC_CARD_DIAMOND];//免费花色
gameConfig.GAME_COMBINATIONS_DIAMOND = [
    [5.0, 10.0, 25.0],
    [5.0, 10.0, 25.0],
    [5.0, 10.0, 25.0],
    [5.0, 15.0, 50.0],
    [5.0, 15.0, 50.0],
    [5.0, 15.0, 50.0],
    [10.0, 25.0, 100.0],
    [15.0, 50.0, 150.0],
    [25.0, 100.0, 250.0],
    [0.0, 0.0, 0.0],
    [0.0, 0.0, 0.0],
    [50.0, 150.0, 500.0],
];
gameConfig.GAME_LINE_WIN_LOWER_LIMIT_CARD_NUMBER_DIAMOND = 3;
gameConfig.GAME_LINE_DIRECTION_DIAMOND = laba_config.GAME_SLOT_LEFT_TO_RIGHT;
gameConfig.GAME_LINE_RULE_DIAMOND = true;
gameConfig.GAME_MULTIPLES_DIAMOND = [];
gameConfig.GAME_BIG_WIN_FREETIMES = 3;
gameConfig.GAME_FREE_MUL_DIAMOND = {
    1: [2, 3, 5],
    2: [3, 5, 8],
    3: [5, 8, 10],
    4: [8, 10, 15],
    5: [10, 15, 25],
};

module.exports = gameConfig;