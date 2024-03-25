gameConfig = {};
gameConfig.gameId = 302;			//第几个游戏ID
gameConfig.serverId = 15302;		//当前游戏的第几台服务器
gameConfig.logflag = 15302;		//游戏记录表示
gameConfig.port = 15302;		//游戏记录表示
gameConfig.gameName = "幸运扑克";

gameConfig.maintainTime = 60;  //关服倒计时
gameConfig.bigWinScore = 100000; //大奖播报金额

//筹码
gameConfig.coinConfig = [50, 100, 200, 400, 800, 1000];

gameConfig.seatMax = 30;
gameConfig.tableMax = 10;

gameConfig.LoginServeSign = "slel3@lsl334xx,deka";


//每日获得金币签到活动
gameConfig.everyWinCoinActivity = true;
//等级
gameConfig.lvActivity = true;

module.exports = gameConfig;