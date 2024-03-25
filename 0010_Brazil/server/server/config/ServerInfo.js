var config_ip = "127.0.0.1";//60.205.191.87

var ServerInfo = function () {

    var _serverinfo = "";

    var Server = function () {

        var GameConfig = [];
        var serverGame = {};
        var serverRoomTemp = {};
        serverGame.GameId = 1;
        serverGame.GameName = "捕鱼游戏";
        //serverGame1.ip = "192.168.1.170";
        serverGame.serverInfo = {};
        //正常
        serverGame.serverInfo.normal = [];
        serverRoomTemp = {};
        serverRoomTemp.Server = 1;
        serverRoomTemp.bet = 1;
        serverRoomTemp.entryCoin = 1000;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "13101";
        serverGame.serverInfo.normal.push(serverRoomTemp);
        //
        //serverRoomTemp = {};
        //serverRoomTemp.Server = 2;
        //serverRoomTemp.bet = 5;
        //serverRoomTemp.entryCoin = 1500;
        //serverRoomTemp.ip = config_ip;
        //serverRoomTemp.prot = "13102";
        //serverGame.serverInfo.normal.push(serverRoomTemp);

        //serverRoomTemp = {};
        //serverRoomTemp.Server = 3;
        //serverRoomTemp.bet = 1;
        //serverRoomTemp.entryCoin = 1000;
        //serverRoomTemp.ip = config_ip;
        //serverRoomTemp.prot = "13103";
        //serverGame.serverInfo.normal.push(serverRoomTemp);

        serverRoomTemp = {};
        serverRoomTemp.Server = 3;
        serverRoomTemp.bet = 10;
        serverRoomTemp.entryCoin = 2500;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "13103";
        serverGame.serverInfo.normal.push(serverRoomTemp);

        serverRoomTemp = {};
        serverRoomTemp.Server = 5;
        serverRoomTemp.bet = 100;
        serverRoomTemp.entryCoin = 5000;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "13105";
        serverGame.serverInfo.normal.push(serverRoomTemp);

        //serverRoomTemp = {};
        //serverRoomTemp.Server = 6;
        //serverRoomTemp.bet = 500;
        //serverRoomTemp.entryCoin = 10000;
        //serverRoomTemp.ip = config_ip;
        //serverRoomTemp.prot = "13106";
        //serverGame.serverInfo.normal.push(serverRoomTemp);

        serverRoomTemp = {};
        serverRoomTemp.Server = 7;
        serverRoomTemp.bet = 1000;
        serverRoomTemp.entryCoin = 10000;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "13107";
        serverGame.serverInfo.normal.push(serverRoomTemp);

        serverRoomTemp = {};
        serverRoomTemp.Server = 2;
        serverRoomTemp.bet = 1;
        serverRoomTemp.entryCoin = 1000;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "13102";
        serverGame.serverInfo.normal.push(serverRoomTemp);

        //礼物
        serverGame.serverInfo.gift = [];
        //比赛
        serverGame.serverInfo.match = [];
        serverRoomTemp = {};
        serverRoomTemp.Server = 11;
        serverRoomTemp.bet = 1;
        serverRoomTemp.entryCoin = 500;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "13111";
        serverGame.serverInfo.match.push(serverRoomTemp);

        GameConfig.push(serverGame);
//=====================海王2==========================
        serverGame = {};
        serverRoomTemp = {};
        serverGame.GameId = 2;
        serverGame.GameName = "海王2";
        serverGame.serverInfo = {};
        //正常
        serverGame.serverInfo.normal = [];
        serverRoomTemp.Server = 1;
        serverRoomTemp.bet = 1;
        serverRoomTemp.entryCoin = 1000;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "13111";
        serverGame.serverInfo.normal.push(serverRoomTemp);

        serverRoomTemp = {};
        serverRoomTemp.Server = 2;
        serverRoomTemp.bet = 10;
        serverRoomTemp.entryCoin = 2500;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "13112";
        serverGame.serverInfo.normal.push(serverRoomTemp);

        serverRoomTemp = {};
        serverRoomTemp.Server = 3;
        serverRoomTemp.bet = 100;
        serverRoomTemp.entryCoin = 5000;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "13113";
        serverGame.serverInfo.normal.push(serverRoomTemp);

        serverRoomTemp = {};
        serverRoomTemp.Server = 4;
        serverRoomTemp.bet = 1000;
        serverRoomTemp.entryCoin = 10000;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "13114";
        serverGame.serverInfo.normal.push(serverRoomTemp);

        GameConfig.push(serverGame);
//==========
        serverGame = {};
        serverRoomTemp = {};
        serverGame.GameId = 6;
        serverGame.GameName = "连线游戏";
        //serverGame1.ip = "192.168.1.170";
        serverGame.serverInfo = {};
        //正常
        serverGame.serverInfo.normal = [];
        serverRoomTemp.Server = 1;
        serverRoomTemp.bet = 1;
        serverRoomTemp.Match = 0;
        serverRoomTemp.entryCoin = 1000;
        serverRoomTemp.gift = 0;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "13601";
        serverGame.serverInfo.normal.push(serverRoomTemp);
        GameConfig.push(serverGame);

//=====================红包达人==========================
        serverGame = {};
        serverRoomTemp = {};
        serverGame.GameId = 3;
        serverGame.GameName = "红包达人";
        serverGame.serverInfo = {};
        //正常
        serverGame.serverInfo.normal = [];
        serverRoomTemp.Server = 1;
        serverRoomTemp.bet = 20;
        serverRoomTemp.Match = 0;
        serverRoomTemp.entryCoin = 2000;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "13201";
        serverGame.serverInfo.normal.push(serverRoomTemp);

        serverRoomTemp = {};
        serverRoomTemp.Server = 2;
        serverRoomTemp.bet = 50;
        serverRoomTemp.entryCoin = 5000;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "13202";
        serverGame.serverInfo.normal.push(serverRoomTemp);

        serverRoomTemp = {};
        serverRoomTemp.Server = 3;
        serverRoomTemp.bet = 100;
        serverRoomTemp.entryCoin = 10000;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "13203";
        serverGame.serverInfo.normal.push(serverRoomTemp);

        serverRoomTemp = {};
        serverRoomTemp.Server = 4;
        serverRoomTemp.bet = 200;
        serverRoomTemp.entryCoin = 20000;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "13204";
        serverGame.serverInfo.normal.push(serverRoomTemp);
        GameConfig.push(serverGame);
//=====================八搭二游戏==========================
        serverGame = {};
        serverRoomTemp = {};
        serverGame.GameId = 5;
        serverGame.GameName = "八搭二游戏";
        serverGame.serverInfo = {};
        //正常
        serverGame.serverInfo.normal = [];
        serverRoomTemp.Server = 1;
        serverRoomTemp.bet = 100;
        serverRoomTemp.Match = 0;
        serverRoomTemp.entryCoin = 5000;
        serverRoomTemp.gift = 0;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "13301";
        serverGame.serverInfo.normal.push(serverRoomTemp);


        serverRoomTemp = {};
        serverRoomTemp.Server = 2;
        serverRoomTemp.bet = 200;
        serverRoomTemp.entryCoin = 10000;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "13302";
        serverGame.serverInfo.normal.push(serverRoomTemp);

        serverRoomTemp = {};
        serverRoomTemp.Server = 3;
        serverRoomTemp.bet = 500;
        serverRoomTemp.entryCoin = 25000;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "13303";
        serverGame.serverInfo.normal.push(serverRoomTemp);

        serverRoomTemp = {};
        serverRoomTemp.Server = 4;
        serverRoomTemp.bet = 1000;
        serverRoomTemp.entryCoin = 50000;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "13304";
        serverGame.serverInfo.normal.push(serverRoomTemp);
        GameConfig.push(serverGame);
//=====================抢庄牛牛==========================
        serverGame = {};
        serverRoomTemp = {};
        serverGame.GameId = 4;
        serverGame.GameName = "抢庄牛牛";
        serverGame.serverInfo = {};
        //正常
        serverGame.serverInfo.normal = [];
        serverRoomTemp.Server = 1;
        serverRoomTemp.bet = 100;
        serverRoomTemp.Match = 0;
        serverRoomTemp.entryCoin = 5000;
        serverRoomTemp.gift = 0;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "13401";
        serverGame.serverInfo.normal.push(serverRoomTemp);

        serverRoomTemp = {};
        serverRoomTemp.Server = 2;
        serverRoomTemp.bet = 500;
        serverRoomTemp.Match = 0;
        serverRoomTemp.entryCoin = 26000;
        serverRoomTemp.gift = 0;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "13402";
        serverGame.serverInfo.normal.push(serverRoomTemp);
        GameConfig.push(serverGame);

        serverRoomTemp = {};
        serverRoomTemp.Server = 3;
        serverRoomTemp.bet = 1000;
        serverRoomTemp.Match = 0;
        serverRoomTemp.entryCoin = 60000;
        serverRoomTemp.gift = 0;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "13403";
        serverGame.serverInfo.normal.push(serverRoomTemp);

        serverRoomTemp = {};
        serverRoomTemp.Server = 4;
        serverRoomTemp.bet = 2000;
        serverRoomTemp.Match = 0;
        serverRoomTemp.entryCoin = 120000;
        serverRoomTemp.gift = 0;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "13404";
        serverGame.serverInfo.normal.push(serverRoomTemp);

//=====================经典牛牛==========================
        serverGame = {}
        serverRoomTemp = {};
        serverGame.GameId = 5;
        serverGame.GameName = "经典牛牛";
        serverGame.serverInfo = {};
        //正常
        serverGame.serverInfo.normal = [];
        // serverRoomTemp.Server = 1;
        // serverRoomTemp.bet = 100;
        // serverRoomTemp.Match = 0;
        // serverRoomTemp.entryCoin = 5000;
        // serverRoomTemp.gift = 0;
        // serverRoomTemp.ip = config_ip;
        // serverRoomTemp.prot = "13501";
        // serverGame.serverInfo.normal.push(serverRoomTemp);

        serverRoomTemp = {};
        serverRoomTemp.Server = 2;
        serverRoomTemp.bet = 500;
        serverRoomTemp.Match = 0;
        serverRoomTemp.entryCoin = 25000;
        serverRoomTemp.gift = 0;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "13502";
        serverGame.serverInfo.normal.push(serverRoomTemp);
        GameConfig.push(serverGame);

        serverRoomTemp = {};
        serverRoomTemp.Server = 3;
        serverRoomTemp.bet = 1000;
        serverRoomTemp.Match = 0;
        serverRoomTemp.entryCoin = 50000;
        serverRoomTemp.gift = 0;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "13503";
        serverGame.serverInfo.normal.push(serverRoomTemp);

        serverRoomTemp = {};
        serverRoomTemp.Server = 4;
        serverRoomTemp.bet = 2000;
        serverRoomTemp.Match = 0;
        serverRoomTemp.entryCoin = 100000;
        serverRoomTemp.gift = 0;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "13504";
        serverGame.serverInfo.normal.push(serverRoomTemp);

//=====================斗地主==========================

        //斗地主
        serverGame = {}
        serverRoomTemp = {};
        serverGame.GameId = 7;
        serverGame.GameName = "Land";
        serverGame.serverInfo = {};
        //正常
        serverGame.serverInfo.normal = [];

        serverRoomTemp = {};
        serverRoomTemp.Server = 1;
        serverRoomTemp.bet = 1000;
        serverRoomTemp.Match = 0;
        serverRoomTemp.entryCoin = 1000;
        serverRoomTemp.gift = 0;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "13701";
        serverGame.serverInfo.normal.push(serverRoomTemp);


        serverRoomTemp = {};
        serverRoomTemp.Server = 2;
        serverRoomTemp.bet = 2000;
        serverRoomTemp.Match = 0;
        serverRoomTemp.entryCoin = 2000;
        serverRoomTemp.gift = 0;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "13702";
        serverGame.serverInfo.normal.push(serverRoomTemp);

        serverRoomTemp = {};
        serverRoomTemp.Server = 3;
        serverRoomTemp.bet = 3000;
        serverRoomTemp.Match = 0;
        serverRoomTemp.entryCoin = 10000;
        serverRoomTemp.gift = 0;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "13703";
        serverGame.serverInfo.normal.push(serverRoomTemp);

        serverRoomTemp = {};
        serverRoomTemp.Server = 4;
        serverRoomTemp.bet = 5000;
        serverRoomTemp.Match = 0;
        serverRoomTemp.entryCoin = 20000;
        serverRoomTemp.gift = 0;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "13704";
        serverGame.serverInfo.normal.push(serverRoomTemp);


        GameConfig.push(serverGame);

//=====================跑得快==========================
        serverGame = {}
        serverRoomTemp = {};
        serverGame.GameId = 9;
        serverGame.GameName = "跑得快";
        serverGame.serverInfo = {};
        //正常
        serverGame.serverInfo.normal = [];

        serverRoomTemp = {};
        serverRoomTemp.Server = 1;
        serverRoomTemp.bet = 1000;
        serverRoomTemp.Match = 0;
        serverRoomTemp.entryCoin = 1000;
        serverRoomTemp.gift = 0;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "13801";
        serverGame.serverInfo.normal.push(serverRoomTemp);


        serverRoomTemp = {};
        serverRoomTemp.Server = 2;
        serverRoomTemp.bet = 2000;
        serverRoomTemp.Match = 0;
        serverRoomTemp.entryCoin = 2000;
        serverRoomTemp.gift = 0;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "13802";
        serverGame.serverInfo.normal.push(serverRoomTemp);

        serverRoomTemp = {};
        serverRoomTemp.Server = 3;
        serverRoomTemp.bet = 3000;
        serverRoomTemp.Match = 0;
        serverRoomTemp.entryCoin = 10000;
        serverRoomTemp.gift = 0;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "13803";
        serverGame.serverInfo.normal.push(serverRoomTemp);

        serverRoomTemp = {};
        serverRoomTemp.Server = 4;
        serverRoomTemp.bet = 5000;
        serverRoomTemp.Match = 0;
        serverRoomTemp.entryCoin = 20000;
        serverRoomTemp.gift = 0;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "13804";
        serverGame.serverInfo.normal.push(serverRoomTemp);

        GameConfig.push(serverGame);

//=====================德州扑克==========================
        serverGame = {}
        serverRoomTemp = {};
        serverGame.GameId = 10;
        serverGame.GameName = "德州扑克";
        serverGame.serverInfo = {};
        //正常
        serverGame.serverInfo.normal = [];

        serverRoomTemp = {};
        serverRoomTemp.Server = 1;
        serverRoomTemp.bet = 1000;
        serverRoomTemp.Match = 0;
        serverRoomTemp.entryCoin = 5000;
        serverRoomTemp.gift = 0;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "14101";
        serverGame.serverInfo.normal.push(serverRoomTemp);


        serverRoomTemp = {};
        serverRoomTemp.Server = 2;
        serverRoomTemp.bet = 2000;
        serverRoomTemp.Match = 0;
        serverRoomTemp.entryCoin = 20000;
        serverRoomTemp.gift = 0;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "14102";
        serverGame.serverInfo.normal.push(serverRoomTemp);

        serverRoomTemp = {};
        serverRoomTemp.Server = 3;
        serverRoomTemp.bet = 3000;
        serverRoomTemp.Match = 0;
        serverRoomTemp.entryCoin = 50000;
        serverRoomTemp.gift = 0;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "14103";
        serverGame.serverInfo.normal.push(serverRoomTemp);

        serverRoomTemp = {};
        serverRoomTemp.Server = 4;
        serverRoomTemp.bet = 5000;
        serverRoomTemp.Match = 0;
        serverRoomTemp.entryCoin = 200000;
        serverRoomTemp.gift = 0;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "14104";
        serverGame.serverInfo.normal.push(serverRoomTemp);

        GameConfig.push(serverGame);
//=====================炸金花==========================
        serverGame = {}
        serverRoomTemp = {};
        serverGame.GameId = 11;
        serverGame.GameName = "炸金花";
        serverGame.serverInfo = {};
        //正常
        serverGame.serverInfo.normal = [];

        serverRoomTemp = {};
        serverRoomTemp.Server = 1;
        serverRoomTemp.bet = 1000;
        serverRoomTemp.Match = 0;
        serverRoomTemp.entryCoin = 5000;
        serverRoomTemp.gift = 0;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "14201";
        serverGame.serverInfo.normal.push(serverRoomTemp);


        serverRoomTemp = {};
        serverRoomTemp.Server = 2;
        serverRoomTemp.bet = 2000;
        serverRoomTemp.Match = 0;
        serverRoomTemp.entryCoin = 30000;
        serverRoomTemp.gift = 0;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "14202";
        serverGame.serverInfo.normal.push(serverRoomTemp);

        serverRoomTemp = {};
        serverRoomTemp.Server = 3;
        serverRoomTemp.bet = 3000;
        serverRoomTemp.Match = 0;
        serverRoomTemp.entryCoin = 60000;
        serverRoomTemp.gift = 0;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "14203";
        serverGame.serverInfo.normal.push(serverRoomTemp);

        serverRoomTemp = {};
        serverRoomTemp.Server = 4;
        serverRoomTemp.bet = 5000;
        serverRoomTemp.Match = 0;
        serverRoomTemp.entryCoin = 120000;
        serverRoomTemp.gift = 0;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "14204";
        serverGame.serverInfo.normal.push(serverRoomTemp);

        GameConfig.push(serverGame);
//=====================深海捕鱼==========================
        serverGame = {};
        serverRoomTemp = {};
        serverGame.GameId = 12;
        serverGame.GameName = "深海捕鱼";
        serverGame.serverInfo = {};
        //正常
        serverGame.serverInfo.normal = [];
        serverRoomTemp.Server = 1;
        serverRoomTemp.bet = 1;
        serverRoomTemp.entryCoin = 1000;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "13121";
        serverGame.serverInfo.normal.push(serverRoomTemp);

        serverRoomTemp = {};
        serverRoomTemp.Server = 2;
        serverRoomTemp.bet = 10;
        serverRoomTemp.entryCoin = 2500;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "13122";
        serverGame.serverInfo.normal.push(serverRoomTemp);

        serverRoomTemp = {};
        serverRoomTemp.Server = 3;
        serverRoomTemp.bet = 100;
        serverRoomTemp.entryCoin = 5000;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "13123";
        serverGame.serverInfo.normal.push(serverRoomTemp);

        serverRoomTemp = {};
        serverRoomTemp.Server = 4;
        serverRoomTemp.bet = 1000;
        serverRoomTemp.entryCoin = 10000;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "13124";
        serverGame.serverInfo.normal.push(serverRoomTemp);

        GameConfig.push(serverGame);
//==========

//=====================雷霆战机==========================
        serverGame = {};
        serverRoomTemp = {};
        serverGame.GameId = 13;
        serverGame.GameName = "雷霆战机";
        serverGame.serverInfo = {};
        //正常
        serverGame.serverInfo.normal = [];
        serverRoomTemp.Server = 1;
        serverRoomTemp.bet = 1;
        serverRoomTemp.entryCoin = 1000;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "13131";
        serverGame.serverInfo.normal.push(serverRoomTemp);

        serverRoomTemp = {};
        serverRoomTemp.Server = 2;
        serverRoomTemp.bet = 10;
        serverRoomTemp.entryCoin = 2500;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "13132";
        serverGame.serverInfo.normal.push(serverRoomTemp);

        serverRoomTemp = {};
        serverRoomTemp.Server = 3;
        serverRoomTemp.bet = 100;
        serverRoomTemp.entryCoin = 5000;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "13133";
        serverGame.serverInfo.normal.push(serverRoomTemp);

        serverRoomTemp = {};
        serverRoomTemp.Server = 4;
        serverRoomTemp.bet = 1000;
        serverRoomTemp.entryCoin = 10000;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "13134";
        serverGame.serverInfo.normal.push(serverRoomTemp);

        GameConfig.push(serverGame);
//==========
//=====================快乐捕鱼==========================
        serverGame = {};
        serverRoomTemp = {};
        serverGame.GameId = 14;
        serverGame.GameName = "快乐捕鱼";
        serverGame.serverInfo = {};
        //正常
        serverGame.serverInfo.normal = [];
        serverRoomTemp.Server = 1;
        serverRoomTemp.bet = 1;
        serverRoomTemp.entryCoin = 1000;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "13141";
        serverGame.serverInfo.normal.push(serverRoomTemp);

        serverRoomTemp = {};
        serverRoomTemp.Server = 2;
        serverRoomTemp.bet = 10;
        serverRoomTemp.entryCoin = 2500;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "13142";
        serverGame.serverInfo.normal.push(serverRoomTemp);

        serverRoomTemp = {};
        serverRoomTemp.Server = 3;
        serverRoomTemp.bet = 100;
        serverRoomTemp.entryCoin = 5000;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "13143";
        serverGame.serverInfo.normal.push(serverRoomTemp);

        serverRoomTemp = {};
        serverRoomTemp.Server = 4;
        serverRoomTemp.bet = 1000;
        serverRoomTemp.entryCoin = 10000;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "13144";
        serverGame.serverInfo.normal.push(serverRoomTemp);

        serverRoomTemp = {};
        serverRoomTemp.Server = 5;
        serverRoomTemp.bet = 10000;
        serverRoomTemp.entryCoin = 100000;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "13145";
        serverGame.serverInfo.normal.push(serverRoomTemp);

        GameConfig.push(serverGame);
//==========
//=====================海王3阿拉丁==========================
        serverGame = {};
        serverRoomTemp = {};
        serverGame.GameId = 15;
        serverGame.GameName = "海王3阿拉丁";
        serverGame.serverInfo = {};
        //正常
        serverGame.serverInfo.normal = [];
        serverRoomTemp.Server = 1;
        serverRoomTemp.bet = 1;
        serverRoomTemp.entryCoin = 1000;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "13151";
        serverGame.serverInfo.normal.push(serverRoomTemp);

        serverRoomTemp = {};
        serverRoomTemp.Server = 2;
        serverRoomTemp.bet = 10;
        serverRoomTemp.entryCoin = 2500;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "13152";
        serverGame.serverInfo.normal.push(serverRoomTemp);

        serverRoomTemp = {};
        serverRoomTemp.Server = 3;
        serverRoomTemp.bet = 100;
        serverRoomTemp.entryCoin = 5000;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "13153";
        serverGame.serverInfo.normal.push(serverRoomTemp);

        serverRoomTemp = {};
        serverRoomTemp.Server = 4;
        serverRoomTemp.bet = 1000;
        serverRoomTemp.entryCoin = 10000;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "13154";
        serverGame.serverInfo.normal.push(serverRoomTemp);

        GameConfig.push(serverGame);
        //=====================疯狂捕鱼==========================
        serverGame = {};
        serverRoomTemp = {};
        serverGame.GameId = 20;
        serverGame.GameName = "疯狂捕鱼";
        serverGame.serverInfo = {};
        //正常
        serverGame.serverInfo.normal = [];
        serverRoomTemp.Server = 1;
        serverRoomTemp.bet = 1;
        serverRoomTemp.entryCoin = 1000;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "13301";
        serverGame.serverInfo.normal.push(serverRoomTemp);

        serverRoomTemp = {};
        serverRoomTemp.Server = 2;
        serverRoomTemp.bet = 10;
        serverRoomTemp.entryCoin = 2500;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "13302";
        serverGame.serverInfo.normal.push(serverRoomTemp);

        serverRoomTemp = {};
        serverRoomTemp.Server = 3;
        serverRoomTemp.bet = 100;
        serverRoomTemp.entryCoin = 5000;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "13303";
        serverGame.serverInfo.normal.push(serverRoomTemp);

        serverRoomTemp = {};
        serverRoomTemp.Server = 4;
        serverRoomTemp.bet = 1000;
        serverRoomTemp.entryCoin = 10000;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "13304";
        serverGame.serverInfo.normal.push(serverRoomTemp);

        serverRoomTemp = {};
        serverRoomTemp.Server = 5;
        serverRoomTemp.bet = 2000;
        serverRoomTemp.entryCoin = 100000;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "13305";
        serverGame.serverInfo.normal.push(serverRoomTemp);

        GameConfig.push(serverGame);
        //=====================ATT街机版==========================
        serverGame = {};
        serverRoomTemp = {};
        serverGame.GameId = 21;
        serverGame.GameName = "ATT街机";
        serverGame.serverInfo = {};
        //正常
        serverGame.serverInfo.normal = [];

        serverRoomTemp = {};
        serverRoomTemp.Server = 1;
        serverRoomTemp.bet = 1000;
        serverRoomTemp.Match = 0;
        serverRoomTemp.entryCoin = 5000;
        serverRoomTemp.gift = 0;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "14301";
        serverGame.serverInfo.normal.push(serverRoomTemp);


        serverRoomTemp = {};
        serverRoomTemp.Server = 2;
        serverRoomTemp.bet = 2000;
        serverRoomTemp.Match = 0;
        serverRoomTemp.entryCoin = 30000;
        serverRoomTemp.gift = 0;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "14302";
        serverGame.serverInfo.normal.push(serverRoomTemp);

        serverRoomTemp = {};
        serverRoomTemp.Server = 3;
        serverRoomTemp.bet = 3000;
        serverRoomTemp.Match = 0;
        serverRoomTemp.entryCoin = 60000;
        serverRoomTemp.gift = 0;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "14303";
        serverGame.serverInfo.normal.push(serverRoomTemp);

        serverRoomTemp = {};
        serverRoomTemp.Server = 4;
        serverRoomTemp.bet = 5000;
        serverRoomTemp.Match = 0;
        serverRoomTemp.entryCoin = 120000;
        serverRoomTemp.gift = 0;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "14304";
        serverGame.serverInfo.normal.push(serverRoomTemp);

        GameConfig.push(serverGame);
        //=====================捕鱼世界==========================
        serverGame = {};
        serverRoomTemp = {};
        serverGame.GameId = 22;
        serverGame.GameName = "捕鱼世界";
        serverGame.serverInfo = {};
        //正常
        serverGame.serverInfo.normal = [];
        serverRoomTemp.Server = 1;
        serverRoomTemp.bet = 1;
        serverRoomTemp.entryCoin = 1000;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "13311";
        serverGame.serverInfo.normal.push(serverRoomTemp);

        serverRoomTemp = {};
        serverRoomTemp.Server = 2;
        serverRoomTemp.bet = 10;
        serverRoomTemp.entryCoin = 2500;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "13312";
        serverGame.serverInfo.normal.push(serverRoomTemp);

        serverRoomTemp = {};
        serverRoomTemp.Server = 3;
        serverRoomTemp.bet = 100;
        serverRoomTemp.entryCoin = 5000;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "13313";
        serverGame.serverInfo.normal.push(serverRoomTemp);

        serverRoomTemp = {};
        serverRoomTemp.Server = 4;
        serverRoomTemp.bet = 1000;
        serverRoomTemp.entryCoin = 10000;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "13314";
        serverGame.serverInfo.normal.push(serverRoomTemp);

        serverRoomTemp = {};
        serverRoomTemp.Server = 5;
        serverRoomTemp.bet = 2000;
        serverRoomTemp.entryCoin = 100000;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "13315";
        serverGame.serverInfo.normal.push(serverRoomTemp);

        GameConfig.push(serverGame);
//==========

        //斗地主自创
        serverGame = {};
        serverRoomTemp = {};
        serverGame.GameId = 7;
        serverGame.serverId = 13750;
        serverGame.GameName = "斗地主自创";
        serverGame.serverInfo = {};
        //正常
        serverGame.serverInfo.normal = [];
        serverRoomTemp.Server = 1;
        serverRoomTemp.bet = 1;
        serverRoomTemp.Match = 0;
        serverRoomTemp.entryCoin = 1000;
        serverRoomTemp.gift = 0;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "13750";
        serverGame.serverInfo.normal.push(serverRoomTemp);
        GameConfig.push(serverGame);

        //斗地主自创
        serverGame = {};
        serverRoomTemp = {};
        serverGame.GameId = 8;
        serverGame.serverId = 13706;
        serverGame.GameName = "斗地主比赛场";
        serverGame.serverInfo = {};
        //正常
        serverGame.serverInfo.normal = [];
        serverRoomTemp.Server = 1;
        serverRoomTemp.bet = 1;
        serverRoomTemp.Match = 0;
        serverRoomTemp.entryCoin = 1000;
        serverRoomTemp.gift = 0;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "13706";
        serverGame.serverInfo.normal.push(serverRoomTemp);
        GameConfig.push(serverGame);

        //跑得快房卡
        serverGame = {};
        serverRoomTemp = {};
        serverGame.GameId = 7;
        serverGame.serverId = 13810;
        serverGame.GameName = "跑得快房卡";
        serverGame.serverInfo = {};
        //正常
        serverGame.serverInfo.normal = [];
        serverRoomTemp.Server = 1;
        serverRoomTemp.bet = 1;
        serverRoomTemp.Match = 0;
        serverRoomTemp.entryCoin = 1000;
        serverRoomTemp.gift = 0;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "13810";
        serverGame.serverInfo.normal.push(serverRoomTemp);
        GameConfig.push(serverGame);

        //牛牛房卡
        serverGame = {};
        serverRoomTemp = {};
        serverGame.GameId = 4;
        serverGame.serverId = 13410;
        serverGame.GameName = "房卡牛牛";
        serverGame.serverInfo = {};
        //正常
        serverGame.serverInfo.normal = [];
        serverRoomTemp.Server = 1;
        serverRoomTemp.bet = 100;
        serverRoomTemp.Match = 0;
        serverRoomTemp.entryCoin = 5000;
        serverRoomTemp.gift = 0;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "13410";
        serverGame.serverInfo.normal.push(serverRoomTemp);
        GameConfig.push(serverGame);

        //炸金花房卡
        serverGame = {};
        serverRoomTemp = {};
        serverGame.GameId = 4;
        serverGame.serverId = 14210;
        serverGame.GameName = "房卡炸金花";
        serverGame.serverInfo = {};
        //正常
        serverGame.serverInfo.normal = [];
        serverRoomTemp.Server = 1;
        serverRoomTemp.bet = 100;
        serverRoomTemp.Match = 0;
        serverRoomTemp.entryCoin = 5000;
        serverRoomTemp.gift = 0;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "14210";
        serverGame.serverInfo.normal.push(serverRoomTemp);
        GameConfig.push(serverGame);

        //鱼虾蟹
        serverGame = {};
        serverRoomTemp = {};
        serverGame.GameId = 66;
        serverGame.serverId = 13850;
        serverGame.GameName = "鱼虾蟹";
        serverGame.serverInfo = {};
        //正常
        serverGame.serverInfo.normal = [];
        serverRoomTemp.Server = 1;
        serverRoomTemp.bet = 1;
        serverRoomTemp.Match = 0;
        serverRoomTemp.entryCoin = 1000;
        serverRoomTemp.gift = 0;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "13850";
        serverGame.serverInfo.normal.push(serverRoomTemp);
        GameConfig.push(serverGame);


        //=============================================================================================================================
        //拉霸
        serverGame = {};
        serverRoomTemp = {};
        serverGame.GameId = 100;
        serverGame.serverId = 15000;
        serverGame.GameName = "精灵女王";
        serverGame.serverInfo = {};
        //正常
        serverGame.serverInfo.normal = [];
        serverRoomTemp.Server = 1;
        serverRoomTemp.bet = 1;
        serverRoomTemp.Match = 0;
        serverRoomTemp.entryCoin = 1000;
        serverRoomTemp.gift = 0;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "15000";
        serverGame.serverInfo.normal.push(serverRoomTemp);
        GameConfig.push(serverGame);


        serverGame = {}
        serverRoomTemp = {};
        serverGame.GameId = 101;
        serverGame.serverId = 15001;
        serverGame.GameName = "万圣节";
        serverGame.serverInfo = {};
        //正常
        serverGame.serverInfo.normal = [];
        serverRoomTemp.Server = 1;
        serverRoomTemp.bet = 1;
        serverRoomTemp.Match = 0;
        serverRoomTemp.entryCoin = 1000;
        serverRoomTemp.gift = 0;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "15001";
        serverGame.serverInfo.normal.push(serverRoomTemp);
        GameConfig.push(serverGame);


        serverGame = {}
        serverRoomTemp = {};
        serverGame.GameId = 102;
        serverGame.serverId = 15002;
        serverGame.GameName = "足球";
        serverGame.serverInfo = {};
        //正常
        serverGame.serverInfo.normal = [];
        serverRoomTemp.Server = 1;
        serverRoomTemp.bet = 1;
        serverRoomTemp.Match = 0;
        serverRoomTemp.entryCoin = 1000;
        serverRoomTemp.gift = 0;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "15002";
        serverGame.serverInfo.normal.push(serverRoomTemp);
        GameConfig.push(serverGame);

        serverGame = {}
        serverRoomTemp = {};
        serverGame.GameId = 103;
        serverGame.serverId = 15003;
        serverGame.GameName = "Joker";
        serverGame.serverInfo = {};
        //正常
        serverGame.serverInfo.normal = [];
        serverRoomTemp.Server = 1;
        serverRoomTemp.bet = 1;
        serverRoomTemp.Match = 0;
        serverRoomTemp.entryCoin = 1000;
        serverRoomTemp.gift = 0;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "15003";
        serverGame.serverInfo.normal.push(serverRoomTemp);
        GameConfig.push(serverGame);


        serverGame = {}
        serverRoomTemp = {};
        serverGame.GameId = 105;
        serverGame.serverId = 15005;
        serverGame.GameName = "水果机";
        serverGame.serverInfo = {};
        //正常
        serverGame.serverInfo.normal = [];
        serverRoomTemp.Server = 1;
        serverRoomTemp.bet = 1;
        serverRoomTemp.Match = 0;
        serverRoomTemp.entryCoin = 1000;
        serverRoomTemp.gift = 0;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "15005";
        serverGame.serverInfo.normal.push(serverRoomTemp);
        GameConfig.push(serverGame);


        serverGame = {}
        serverRoomTemp = {};
        serverGame.GameId = 106;
        serverGame.serverId = 15006;
        serverGame.GameName = "水果机竖版";
        serverGame.serverInfo = {};
        //正常
        serverGame.serverInfo.normal = [];
        serverRoomTemp.Server = 1;
        serverRoomTemp.bet = 1;
        serverRoomTemp.Match = 0;
        serverRoomTemp.entryCoin = 1000;
        serverRoomTemp.gift = 0;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "15006";
        serverGame.serverInfo.normal.push(serverRoomTemp);
        GameConfig.push(serverGame);

        serverGame = {}
        serverRoomTemp = {};
        serverGame.GameId = 107;
        serverGame.serverId = 15007;
        serverGame.GameName = "三打白骨精";
        serverGame.serverInfo = {};
        //正常
        serverGame.serverInfo.normal = [];
        serverRoomTemp.Server = 1;
        serverRoomTemp.bet = 1;
        serverRoomTemp.Match = 0;
        serverRoomTemp.entryCoin = 1000;
        serverRoomTemp.gift = 0;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "15007";
        serverGame.serverInfo.normal.push(serverRoomTemp);
        GameConfig.push(serverGame);

        serverGame = {}
        serverRoomTemp = {};
        serverGame.GameId = 108;
        serverGame.serverId = 15008;
        serverGame.GameName = "Safari";
        serverGame.serverInfo = {};
        //正常
        serverGame.serverInfo.normal = [];
        serverRoomTemp.Server = 1;
        serverRoomTemp.bet = 1;
        serverRoomTemp.Match = 0;
        serverRoomTemp.entryCoin = 1000;
        serverRoomTemp.gift = 0;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "15008";
        serverGame.serverInfo.normal.push(serverRoomTemp);
        GameConfig.push(serverGame);

        serverGame = {}
        serverRoomTemp = {};
        serverGame.GameId = 109;
        serverGame.serverId = 15009;
        serverGame.GameName = "RomeGlory";
        serverGame.serverInfo = {};
        //正常
        serverGame.serverInfo.normal = [];
        serverRoomTemp.Server = 1;
        serverRoomTemp.bet = 1;
        serverRoomTemp.Match = 0;
        serverRoomTemp.entryCoin = 1000;
        serverRoomTemp.gift = 0;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "15009";
        serverGame.serverInfo.normal.push(serverRoomTemp);
        GameConfig.push(serverGame);


        serverGame = {}
        serverRoomTemp = {};
        serverGame.GameId = 110;
        serverGame.serverId = 15010;
        serverGame.GameName = "lingdangyouxi";
        serverGame.serverInfo = {};
        //正常
        serverGame.serverInfo.normal = [];
        serverRoomTemp.Server = 1;
        serverRoomTemp.bet = 1;
        serverRoomTemp.Match = 0;
        serverRoomTemp.entryCoin = 1000;
        serverRoomTemp.gift = 0;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "15010";
        serverGame.serverInfo.normal.push(serverRoomTemp);
        GameConfig.push(serverGame);

        serverGame = {}
        serverRoomTemp = {};
        serverGame.GameId = 111;
        serverGame.serverId = 15011;
        serverGame.GameName = "僵尸先生";
        serverGame.serverInfo = {};
        //正常
        serverGame.serverInfo.normal = [];
        serverRoomTemp.Server = 1;
        serverRoomTemp.bet = 1;
        serverRoomTemp.Match = 0;
        serverRoomTemp.entryCoin = 1000;
        serverRoomTemp.gift = 0;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "15011";
        serverGame.serverInfo.normal.push(serverRoomTemp);
        GameConfig.push(serverGame);


        serverGame = {}
        serverRoomTemp = {};
        serverGame.GameId = 113;
        serverGame.serverId = 15013;
        serverGame.GameName = "9线拉王";
        serverGame.serverInfo = {};
        //正常
        serverGame.serverInfo.normal = [];
        serverRoomTemp.Server = 1;
        serverRoomTemp.bet = 1;
        serverRoomTemp.Match = 0;
        serverRoomTemp.entryCoin = 1000;
        serverRoomTemp.gift = 0;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "15013";
        serverGame.serverInfo.normal.push(serverRoomTemp);
        GameConfig.push(serverGame);


        serverGame = {};
        serverRoomTemp = {};
        serverGame.GameId = 115;
        serverGame.serverId = 15015;
        serverGame.GameName = "三角魔阵";
        serverGame.serverInfo = {};
        //正常
        serverGame.serverInfo.normal = [];
        serverRoomTemp.Server = 1;
        serverRoomTemp.bet = 1;
        serverRoomTemp.Match = 0;
        serverRoomTemp.entryCoin = 1000;
        serverRoomTemp.gift = 0;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "15015";
        serverGame.serverInfo.normal.push(serverRoomTemp);
        GameConfig.push(serverGame);

        serverGame = {};
        serverRoomTemp = {};
        serverGame.GameId = 116;
        serverGame.serverId = 15016;
        serverGame.GameName = "水浒传";
        serverGame.serverInfo = {};
        //正常
        serverGame.serverInfo.normal = [];
        serverRoomTemp.Server = 1;
        serverRoomTemp.bet = 1;
        serverRoomTemp.Match = 0;
        serverRoomTemp.entryCoin = 1000;
        serverRoomTemp.gift = 0;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "15016";
        serverGame.serverInfo.normal.push(serverRoomTemp);
        GameConfig.push(serverGame);

        serverGame = {}
        serverRoomTemp = {};
        serverGame.GameId = 121;
        serverGame.serverId = 15021;
        serverGame.GameName = "水果之夏";
        serverGame.serverInfo = {};
        //正常
        serverGame.serverInfo.normal = [];
        serverRoomTemp.Server = 1;
        serverRoomTemp.bet = 1;
        serverRoomTemp.Match = 0;
        serverRoomTemp.entryCoin = 1000;
        serverRoomTemp.gift = 0;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "15021";
        serverGame.serverInfo.normal.push(serverRoomTemp);
        GameConfig.push(serverGame);

        serverGame = {}
        serverRoomTemp = {};
        serverGame.GameId = 131;
        serverGame.serverId = 15031;
        serverGame.GameName = "冰球突破2";
        serverGame.serverInfo = {};
        //正常
        serverGame.serverInfo.normal = [];
        serverRoomTemp.Server = 1;
        serverRoomTemp.bet = 1;
        serverRoomTemp.Match = 0;
        serverRoomTemp.entryCoin = 1000;
        serverRoomTemp.gift = 0;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "15031";
        serverGame.serverInfo.normal.push(serverRoomTemp);
        GameConfig.push(serverGame);


        serverGame = {}
        serverRoomTemp = {};
        serverGame.GameId = 135;
        serverGame.serverId = 15035;
        serverGame.GameName = "钻石";
        serverGame.serverInfo = {};
        //正常
        serverGame.serverInfo.normal = [];
        serverRoomTemp.Server = 1;
        serverRoomTemp.bet = 1;
        serverRoomTemp.Match = 0;
        serverRoomTemp.entryCoin = 1000;
        serverRoomTemp.gift = 0;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "15035";
        serverGame.serverInfo.normal.push(serverRoomTemp);
        GameConfig.push(serverGame);


        serverGame = {}
        serverRoomTemp = {};
        serverGame.GameId = 136;
        serverGame.serverId = 15036;
        serverGame.GameName = "埃及珍宝";
        serverGame.serverInfo = {};
        //正常
        serverGame.serverInfo.normal = [];
        serverRoomTemp.Server = 1;
        serverRoomTemp.bet = 1;
        serverRoomTemp.Match = 0;
        serverRoomTemp.entryCoin = 1000;
        serverRoomTemp.gift = 0;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "15036";
        serverGame.serverInfo.normal.push(serverRoomTemp);
        GameConfig.push(serverGame);

        serverGame = {}
        serverRoomTemp = {};
        serverGame.GameId = 301;
        serverGame.serverId = 15301;
        serverGame.GameName = "俄罗斯转盘";
        serverGame.serverInfo = {};
        //正常
        serverGame.serverInfo.normal = [];
        serverRoomTemp.Server = 1;
        serverRoomTemp.bet = 1;
        serverRoomTemp.Match = 0;
        serverRoomTemp.entryCoin = 1000;
        serverRoomTemp.gift = 0;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "15301";
        serverGame.serverInfo.normal.push(serverRoomTemp);
        GameConfig.push(serverGame);

        serverGame = {};
        serverRoomTemp = {};
        serverGame.GameId = 15040;
        serverGame.serverId = 15040;
        serverGame.GameName = "拉霸集合";
        serverGame.serverInfo = {};
        //正常
        serverGame.serverInfo.normal = [];
        serverRoomTemp.Server = 1;
        serverRoomTemp.bet = 1;
        serverRoomTemp.Match = 0;
        serverRoomTemp.entryCoin = 1000;
        serverRoomTemp.gift = 0;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "15040";
        serverGame.serverInfo.normal.push(serverRoomTemp);
        GameConfig.push(serverGame);

        serverGame = {};
        serverRoomTemp = {};
        serverGame.GameId = 141;
        serverGame.serverId = 15041;
        serverGame.GameName = "阿拉丁";
        serverGame.serverInfo = {};
        //正常
        serverGame.serverInfo.normal = [];
        serverRoomTemp.Server = 1;
        serverRoomTemp.bet = 1;
        serverRoomTemp.Match = 0;
        serverRoomTemp.entryCoin = 1000;
        serverRoomTemp.gift = 0;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "15041";
        serverGame.serverInfo.normal.push(serverRoomTemp);
        GameConfig.push(serverGame);

        serverGame = {};
        serverRoomTemp = {};
        serverGame.GameId = 142;
        serverGame.serverId = 15042;
        serverGame.GameName = "财源滚滚";
        serverGame.serverInfo = {};
        //正常
        serverGame.serverInfo.normal = [];
        serverRoomTemp.Server = 1;
        serverRoomTemp.bet = 1;
        serverRoomTemp.Match = 0;
        serverRoomTemp.entryCoin = 1000;
        serverRoomTemp.gift = 0;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "15042";
        serverGame.serverInfo.normal.push(serverRoomTemp);
        GameConfig.push(serverGame);

        serverGame = {};
        serverRoomTemp = {};
        serverGame.GameId = 143;
        serverGame.serverId = 15043;
        serverGame.GameName = "红楼春梦";
        serverGame.serverInfo = {};
        //正常
        serverGame.serverInfo.normal = [];
        serverRoomTemp.Server = 1;
        serverRoomTemp.bet = 1;
        serverRoomTemp.Match = 0;
        serverRoomTemp.entryCoin = 1000;
        serverRoomTemp.gift = 0;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "15043";
        serverGame.serverInfo.normal.push(serverRoomTemp);
        GameConfig.push(serverGame);

        serverGame = {};
        serverRoomTemp = {};
        serverGame.GameId = 144;
        serverGame.serverId = 15044;
        serverGame.GameName = "锦衣卫";
        serverGame.serverInfo = {};
        //正常
        serverGame.serverInfo.normal = [];
        serverRoomTemp.Server = 1;
        serverRoomTemp.bet = 1;
        serverRoomTemp.Match = 0;
        serverRoomTemp.entryCoin = 1000;
        serverRoomTemp.gift = 0;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "15044";
        serverGame.serverInfo.normal.push(serverRoomTemp);
        GameConfig.push(serverGame);

        serverGame = {};
        serverRoomTemp = {};
        serverGame.GameId = 145;
        serverGame.serverId = 15045;
        serverGame.GameName = "吕布戏貂蝉";
        serverGame.serverInfo = {};
        //正常
        serverGame.serverInfo.normal = [];
        serverRoomTemp.Server = 1;
        serverRoomTemp.bet = 1;
        serverRoomTemp.Match = 0;
        serverRoomTemp.entryCoin = 1000;
        serverRoomTemp.gift = 0;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "15045";
        serverGame.serverInfo.normal.push(serverRoomTemp);
        GameConfig.push(serverGame);

        serverGame = {};
        serverRoomTemp = {};
        serverGame.GameId = 146;
        serverGame.serverId = 15046;
        serverGame.GameName = "梦幻女神";
        serverGame.serverInfo = {};
        //正常
        serverGame.serverInfo.normal = [];
        serverRoomTemp.Server = 1;
        serverRoomTemp.bet = 1;
        serverRoomTemp.Match = 0;
        serverRoomTemp.entryCoin = 1000;
        serverRoomTemp.gift = 0;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "15046";
        serverGame.serverInfo.normal.push(serverRoomTemp);
        GameConfig.push(serverGame);

        serverGame = {};
        serverRoomTemp = {};
        serverGame.GameId = 147;
        serverGame.serverId = 15047;
        serverGame.GameName = "哪吒闹海";
        serverGame.serverInfo = {};
        //正常
        serverGame.serverInfo.normal = [];
        serverRoomTemp.Server = 1;
        serverRoomTemp.bet = 1;
        serverRoomTemp.Match = 0;
        serverRoomTemp.entryCoin = 1000;
        serverRoomTemp.gift = 0;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "15047";
        serverGame.serverInfo.normal.push(serverRoomTemp);
        GameConfig.push(serverGame);

        serverGame = {};
        serverRoomTemp = {};
        serverGame.GameId = 148;
        serverGame.serverId = 15048;
        serverGame.GameName = "潘金莲";
        serverGame.serverInfo = {};
        //正常
        serverGame.serverInfo.normal = [];
        serverRoomTemp.Server = 1;
        serverRoomTemp.bet = 1;
        serverRoomTemp.Match = 0;
        serverRoomTemp.entryCoin = 1000;
        serverRoomTemp.gift = 0;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "15048";
        serverGame.serverInfo.normal.push(serverRoomTemp);
        GameConfig.push(serverGame);

        serverGame = {};
        serverRoomTemp = {};
        serverGame.GameId = 149;
        serverGame.serverId = 15049;
        serverGame.GameName = "上海00发";
        serverGame.serverInfo = {};
        //正常
        serverGame.serverInfo.normal = [];
        serverRoomTemp.Server = 1;
        serverRoomTemp.bet = 1;
        serverRoomTemp.Match = 0;
        serverRoomTemp.entryCoin = 1000;
        serverRoomTemp.gift = 0;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "15049";
        serverGame.serverInfo.normal.push(serverRoomTemp);
        GameConfig.push(serverGame);

        serverGame = {};
        serverRoomTemp = {};
        serverGame.GameId = 150;
        serverGame.serverId = 15050;
        serverGame.GameName = "太极熊猫";
        serverGame.serverInfo = {};
        //正常
        serverGame.serverInfo.normal = [];
        serverRoomTemp.Server = 1;
        serverRoomTemp.bet = 1;
        serverRoomTemp.Match = 0;
        serverRoomTemp.entryCoin = 1000;
        serverRoomTemp.gift = 0;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "15050";
        serverGame.serverInfo.normal.push(serverRoomTemp);
        GameConfig.push(serverGame);

        serverGame = {};
        serverRoomTemp = {};
        serverGame.GameId = 151;
        serverGame.serverId = 15051;
        serverGame.GameName = "旺宝";
        serverGame.serverInfo = {};
        //正常
        serverGame.serverInfo.normal = [];
        serverRoomTemp.Server = 1;
        serverRoomTemp.bet = 1;
        serverRoomTemp.Match = 0;
        serverRoomTemp.entryCoin = 1000;
        serverRoomTemp.gift = 0;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "15051";
        serverGame.serverInfo.normal.push(serverRoomTemp);
        GameConfig.push(serverGame);

        serverGame = {};
        serverRoomTemp = {};
        serverGame.GameId = 152;
        serverGame.serverId = 15052;
        serverGame.GameName = "五福临门";
        serverGame.serverInfo = {};
        //正常
        serverGame.serverInfo.normal = [];
        serverRoomTemp.Server = 1;
        serverRoomTemp.bet = 1;
        serverRoomTemp.Match = 0;
        serverRoomTemp.entryCoin = 1000;
        serverRoomTemp.gift = 0;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "15052";
        serverGame.serverInfo.normal.push(serverRoomTemp);
        GameConfig.push(serverGame);

        serverGame = {};
        serverRoomTemp = {};
        serverGame.GameId = 153;
        serverGame.serverId = 15053;
        serverGame.GameName = "艺伎回忆录";
        serverGame.serverInfo = {};
        //正常
        serverGame.serverInfo.normal = [];
        serverRoomTemp.Server = 1;
        serverRoomTemp.bet = 1;
        serverRoomTemp.Match = 0;
        serverRoomTemp.entryCoin = 1000;
        serverRoomTemp.gift = 0;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "15053";
        serverGame.serverInfo.normal.push(serverRoomTemp);
        GameConfig.push(serverGame);

        serverGame = {};
        serverRoomTemp = {};
        serverGame.GameId = 154;
        serverGame.serverId = 15054;
        serverGame.GameName = "一路发发";
        serverGame.serverInfo = {};
        //正常
        serverGame.serverInfo.normal = [];
        serverRoomTemp.Server = 1;
        serverRoomTemp.bet = 1;
        serverRoomTemp.Match = 0;
        serverRoomTemp.entryCoin = 1000;
        serverRoomTemp.gift = 0;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "15054";
        serverGame.serverInfo.normal.push(serverRoomTemp);
        GameConfig.push(serverGame);

        serverGame = {};
        serverRoomTemp = {};
        serverGame.GameId = 155;
        serverGame.serverId = 15055;
        serverGame.GameName = "玉蒲团";
        serverGame.serverInfo = {};
        //正常
        serverGame.serverInfo.normal = [];
        serverRoomTemp.Server = 1;
        serverRoomTemp.bet = 1;
        serverRoomTemp.Match = 0;
        serverRoomTemp.entryCoin = 1000;
        serverRoomTemp.gift = 0;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "15055";
        serverGame.serverInfo.normal.push(serverRoomTemp);
        GameConfig.push(serverGame);

        serverGame = {};
        serverRoomTemp = {};
        serverGame.GameId = 156;
        serverGame.serverId = 15056;
        serverGame.GameName = "玉蒲团2";
        serverGame.serverInfo = {};
        //正常
        serverGame.serverInfo.normal = [];
        serverRoomTemp.Server = 1;
        serverRoomTemp.bet = 1;
        serverRoomTemp.Match = 0;
        serverRoomTemp.entryCoin = 1000;
        serverRoomTemp.gift = 0;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "15056";
        serverGame.serverInfo.normal.push(serverRoomTemp);
        GameConfig.push(serverGame);

        serverGame = {};
        serverRoomTemp = {};
        serverGame.GameId = 157;
        serverGame.serverId = 15057;
        serverGame.GameName = "忠肝义胆";
        serverGame.serverInfo = {};
        //正常
        serverGame.serverInfo.normal = [];
        serverRoomTemp.Server = 1;
        serverRoomTemp.bet = 1;
        serverRoomTemp.Match = 0;
        serverRoomTemp.entryCoin = 1000;
        serverRoomTemp.gift = 0;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "15057";
        serverGame.serverInfo.normal.push(serverRoomTemp);
        GameConfig.push(serverGame);

        serverGame = {};
        serverRoomTemp = {};
        serverGame.GameId = 158;
        serverGame.serverId = 15058;
        serverGame.GameName = "宙斯之怒";
        serverGame.serverInfo = {};
        //正常
        serverGame.serverInfo.normal = [];
        serverRoomTemp.Server = 1;
        serverRoomTemp.bet = 1;
        serverRoomTemp.Match = 0;
        serverRoomTemp.entryCoin = 1000;
        serverRoomTemp.gift = 0;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "15058";
        serverGame.serverInfo.normal.push(serverRoomTemp);
        GameConfig.push(serverGame);

        serverGame = {};
        serverRoomTemp = {};
        serverGame.GameId = 159;
        serverGame.serverId = 15059;
        serverGame.GameName = "猪爷到";
        serverGame.serverInfo = {};
        //正常
        serverGame.serverInfo.normal = [];
        serverRoomTemp.Server = 1;
        serverRoomTemp.bet = 1;
        serverRoomTemp.Match = 0;
        serverRoomTemp.entryCoin = 1000;
        serverRoomTemp.gift = 0;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "15059";
        serverGame.serverInfo.normal.push(serverRoomTemp);
        GameConfig.push(serverGame);

        serverGame = {};
        serverRoomTemp = {};
        serverGame.GameId = 160;
        serverGame.serverId = 15060;
        serverGame.GameName = "水果小玛丽";
        serverGame.serverInfo = {};
        //正常
        serverGame.serverInfo.normal = [];
        serverRoomTemp.Server = 1;
        serverRoomTemp.bet = 1;
        serverRoomTemp.Match = 0;
        serverRoomTemp.entryCoin = 1000;
        serverRoomTemp.gift = 0;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "15060";
        serverGame.serverInfo.normal.push(serverRoomTemp);
        GameConfig.push(serverGame);

        serverGame = {};
        serverRoomTemp = {};
        serverGame.GameId = 161;
        serverGame.serverId = 15061;
        serverGame.GameName = "阿兹塔克";
        serverGame.serverInfo = {};
        //正常
        serverGame.serverInfo.normal = [];
        serverRoomTemp.Server = 1;
        serverRoomTemp.bet = 1;
        serverRoomTemp.Match = 0;
        serverRoomTemp.entryCoin = 1000;
        serverRoomTemp.gift = 0;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "15061";
        serverGame.serverInfo.normal.push(serverRoomTemp);
        GameConfig.push(serverGame);

        serverGame = {};
        serverRoomTemp = {};
        serverGame.GameId = 12;
        serverGame.serverId = 15062;
        serverGame.GameName = "财神夺宝";
        serverGame.serverInfo = {};
        //正常
        serverGame.serverInfo.normal = [];
        serverRoomTemp.Server = 1;
        serverRoomTemp.bet = 1;
        serverRoomTemp.Match = 0;
        serverRoomTemp.entryCoin = 1000;
        serverRoomTemp.gift = 0;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "15062";
        serverGame.serverInfo.normal.push(serverRoomTemp);
        GameConfig.push(serverGame);

        serverGame = {};
        serverRoomTemp = {};
        serverGame.GameId = 501;
        serverGame.serverId = 15501;
        serverGame.GameName = "金财神";
        serverGame.serverInfo = {};
        //正常
        serverGame.serverInfo.normal = [];
        serverRoomTemp.Server = 1;
        serverRoomTemp.bet = 1;
        serverRoomTemp.Match = 0;
        serverRoomTemp.entryCoin = 1000;
        serverRoomTemp.gift = 0;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "15501";
        serverGame.serverInfo.normal.push(serverRoomTemp);
        GameConfig.push(serverGame);

        serverGame = {};
        serverRoomTemp = {};
        serverGame.GameId = 174;
        serverGame.serverId = 15074;
        serverGame.GameName = "GreatBlue";
        serverGame.serverInfo = {};
        //正常
        serverGame.serverInfo.normal = [];
        serverRoomTemp.Server = 1;
        serverRoomTemp.bet = 1;
        serverRoomTemp.Match = 0;
        serverRoomTemp.entryCoin = 1000;
        serverRoomTemp.gift = 0;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "15074";
        serverGame.serverInfo.normal.push(serverRoomTemp);
        GameConfig.push(serverGame);

        serverGame = {};
        serverRoomTemp = {};
        serverGame.GameId = 177;
        serverGame.serverId = 15077;
        serverGame.GameName = "IrishLuck";
        serverGame.serverInfo = {};
        //正常
        serverGame.serverInfo.normal = [];
        serverRoomTemp.Server = 1;
        serverRoomTemp.bet = 1;
        serverRoomTemp.Match = 0;
        serverRoomTemp.entryCoin = 1000;
        serverRoomTemp.gift = 0;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "15077";
        serverGame.serverInfo.normal.push(serverRoomTemp);
        GameConfig.push(serverGame);

        serverGame = {};
        serverRoomTemp = {};
        serverGame.GameId = 178;
        serverGame.serverId = 15078;
        serverGame.GameName = "T-REX";
        serverGame.serverInfo = {};
        //正常
        serverGame.serverInfo.normal = [];
        serverRoomTemp.Server = 1;
        serverRoomTemp.bet = 1;
        serverRoomTemp.Match = 0;
        serverRoomTemp.entryCoin = 1000;
        serverRoomTemp.gift = 0;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "15078";
        serverGame.serverInfo.normal.push(serverRoomTemp);
        GameConfig.push(serverGame);

        serverGame = {};
        serverRoomTemp = {};
        serverGame.GameId = 179;
        serverGame.serverId = 15079;
        serverGame.GameName = "Iceland";
        serverGame.serverInfo = {};
        //正常
        serverGame.serverInfo.normal = [];
        serverRoomTemp.Server = 1;
        serverRoomTemp.bet = 1;
        serverRoomTemp.Match = 0;
        serverRoomTemp.entryCoin = 1000;
        serverRoomTemp.gift = 0;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "15079";
        serverGame.serverInfo.normal.push(serverRoomTemp);
        GameConfig.push(serverGame);

        serverGame = {};
        serverRoomTemp = {};
        serverGame.GameId = 180;
        serverGame.serverId = 15080;
        serverGame.GameName = "PantherMoon";
        serverGame.serverInfo = {};
        //正常
        serverGame.serverInfo.normal = [];
        serverRoomTemp.Server = 1;
        serverRoomTemp.bet = 1;
        serverRoomTemp.Match = 0;
        serverRoomTemp.entryCoin = 1000;
        serverRoomTemp.gift = 0;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "15080";
        serverGame.serverInfo.normal.push(serverRoomTemp);
        GameConfig.push(serverGame);

        serverGame = {};
        serverRoomTemp = {};
        serverGame.GameId = 181;
        serverGame.serverId = 15081;
        serverGame.GameName = "IndianMyth";
        serverGame.serverInfo = {};
        //正常
        serverGame.serverInfo.normal = [];
        serverRoomTemp.Server = 1;
        serverRoomTemp.bet = 1;
        serverRoomTemp.Match = 0;
        serverRoomTemp.entryCoin = 1000;
        serverRoomTemp.gift = 0;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "15081";
        serverGame.serverInfo.normal.push(serverRoomTemp);
        GameConfig.push(serverGame);

        serverGame = {};
        serverRoomTemp = {};
        serverGame.GameId = 182;
        serverGame.serverId = 15082;
        serverGame.GameName = "JapanForture";
        serverGame.serverInfo = {};
        //正常
        serverGame.serverInfo.normal = [];
        serverRoomTemp.Server = 1;
        serverRoomTemp.bet = 1;
        serverRoomTemp.Match = 0;
        serverRoomTemp.entryCoin = 1000;
        serverRoomTemp.gift = 0;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "15082";
        serverGame.serverInfo.normal.push(serverRoomTemp);
        GameConfig.push(serverGame);

        serverGame = {};
        serverRoomTemp = {};
        serverGame.GameId = 183;
        serverGame.serverId = 15083;
        serverGame.GameName = "BonusBears";
        serverGame.serverInfo = {};
        //正常
        serverGame.serverInfo.normal = [];
        serverRoomTemp.Server = 1;
        serverRoomTemp.bet = 1;
        serverRoomTemp.Match = 0;
        serverRoomTemp.entryCoin = 1000;
        serverRoomTemp.gift = 0;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "15083";
        serverGame.serverInfo.normal.push(serverRoomTemp);
        GameConfig.push(serverGame);

        serverGame = {};
        serverRoomTemp = {};
        serverGame.GameId = 184;
        serverGame.serverId = 15084;
        serverGame.GameName = "月光宝盒";
        serverGame.serverInfo = {};
        //正常
        serverGame.serverInfo.normal = [];
        serverRoomTemp.Server = 1;
        serverRoomTemp.bet = 1;
        serverRoomTemp.Match = 0;
        serverRoomTemp.entryCoin = 1000;
        serverRoomTemp.gift = 0;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "15084";
        serverGame.serverInfo.normal.push(serverRoomTemp);
        GameConfig.push(serverGame);

        serverGame = {};
        serverRoomTemp = {};
        serverGame.GameId = 185;
        serverGame.serverId = 15085;
        serverGame.GameName = "美女游泳队";
        serverGame.serverInfo = {};
        //正常
        serverGame.serverInfo.normal = [];
        serverRoomTemp.Server = 1;
        serverRoomTemp.bet = 1;
        serverRoomTemp.Match = 0;
        serverRoomTemp.entryCoin = 1000;
        serverRoomTemp.gift = 0;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "15085";
        serverGame.serverInfo.normal.push(serverRoomTemp);
        GameConfig.push(serverGame);

        serverGame = {};
        serverRoomTemp = {};
        serverGame.GameId = 186;
        serverGame.serverId = 15086;
        serverGame.GameName = "维加斯之夜";
        serverGame.serverInfo = {};
        //正常
        serverGame.serverInfo.normal = [];
        serverRoomTemp.Server = 1;
        serverRoomTemp.bet = 1;
        serverRoomTemp.Match = 0;
        serverRoomTemp.entryCoin = 1000;
        serverRoomTemp.gift = 0;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "15086";
        serverGame.serverInfo.normal.push(serverRoomTemp);
        GameConfig.push(serverGame);

        serverGame = {};
        serverRoomTemp = {};
        serverGame.GameId = 187;
        serverGame.serverId = 15087;
        serverGame.GameName = "财神到";
        serverGame.serverInfo = {};
        //正常
        serverGame.serverInfo.normal = [];
        serverRoomTemp.Server = 1;
        serverRoomTemp.bet = 1;
        serverRoomTemp.Match = 0;
        serverRoomTemp.entryCoin = 1000;
        serverRoomTemp.gift = 0;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "15087";
        serverGame.serverInfo.normal.push(serverRoomTemp);
        GameConfig.push(serverGame);

        serverGame = {};
        serverRoomTemp = {};
        serverGame.GameId = 188;
        serverGame.serverId = 15088;
        serverGame.GameName = "fire88";
        serverGame.serverInfo = {};
        //正常
        serverGame.serverInfo.normal = [];
        serverRoomTemp.Server = 1;
        serverRoomTemp.bet = 1;
        serverRoomTemp.Match = 0;
        serverRoomTemp.entryCoin = 1000;
        serverRoomTemp.gift = 0;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "15088";
        serverGame.serverInfo.normal.push(serverRoomTemp);
        GameConfig.push(serverGame);

        serverGame = {};
        serverRoomTemp = {};
        serverGame.GameId = 189;
        serverGame.serverId = 15089;
        serverGame.GameName = "西游记";
        serverGame.serverInfo = {};
        //正常
        serverGame.serverInfo.normal = [];
        serverRoomTemp.Server = 1;
        serverRoomTemp.bet = 1;
        serverRoomTemp.Match = 0;
        serverRoomTemp.entryCoin = 1000;
        serverRoomTemp.gift = 0;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "15089";
        serverGame.serverInfo.normal.push(serverRoomTemp);
        GameConfig.push(serverGame);

        serverGame = {};
        serverRoomTemp = {};
        serverGame.GameId = 190;
        serverGame.serverId = 15090;
        serverGame.GameName = "鹰夫人";
        serverGame.serverInfo = {};
        //正常
        serverGame.serverInfo.normal = [];
        serverRoomTemp.Server = 1;
        serverRoomTemp.bet = 1;
        serverRoomTemp.Match = 0;
        serverRoomTemp.entryCoin = 1000;
        serverRoomTemp.gift = 0;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "15090";
        serverGame.serverInfo.normal.push(serverRoomTemp);
        GameConfig.push(serverGame);

        serverGame = {};
        serverRoomTemp = {};
        serverGame.GameId = 191;
        serverGame.serverId = 15091;
        serverGame.GameName = "包青天";
        serverGame.serverInfo = {};
        //正常
        serverGame.serverInfo.normal = [];
        serverRoomTemp.Server = 1;
        serverRoomTemp.bet = 1;
        serverRoomTemp.Match = 0;
        serverRoomTemp.entryCoin = 1000;
        serverRoomTemp.gift = 0;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "15091";
        serverGame.serverInfo.normal.push(serverRoomTemp);
        GameConfig.push(serverGame);

        serverGame = {};
        serverRoomTemp = {};
        serverGame.GameId = 192;
        serverGame.serverId = 15092;
        serverGame.GameName = "潘金莲GW";
        serverGame.serverInfo = {};
        //正常
        serverGame.serverInfo.normal = [];
        serverRoomTemp.Server = 1;
        serverRoomTemp.bet = 1;
        serverRoomTemp.Match = 0;
        serverRoomTemp.entryCoin = 1000;
        serverRoomTemp.gift = 0;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "15092";
        serverGame.serverInfo.normal.push(serverRoomTemp);
        GameConfig.push(serverGame);

        serverGame = {};
        serverRoomTemp = {};
        serverGame.GameId = 193;
        serverGame.serverId = 15093;
        serverGame.GameName = "八卦2";
        serverGame.serverInfo = {};
        //正常
        serverGame.serverInfo.normal = [];
        serverRoomTemp.Server = 1;
        serverRoomTemp.bet = 1;
        serverRoomTemp.Match = 0;
        serverRoomTemp.entryCoin = 1000;
        serverRoomTemp.gift = 0;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "15093";
        serverGame.serverInfo.normal.push(serverRoomTemp);
        GameConfig.push(serverGame);

        serverGame = {};
        serverRoomTemp = {};
        serverGame.GameId = 194;
        serverGame.serverId = 15094;
        serverGame.GameName = "招财进宝";
        serverGame.serverInfo = {};
        //正常
        serverGame.serverInfo.normal = [];
        serverRoomTemp.Server = 1;
        serverRoomTemp.bet = 1;
        serverRoomTemp.Match = 0;
        serverRoomTemp.entryCoin = 1000;
        serverRoomTemp.gift = 0;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "15094";
        serverGame.serverInfo.normal.push(serverRoomTemp);
        GameConfig.push(serverGame);

        serverGame = {};
        serverRoomTemp = {};
        serverGame.GameId = 200;
        serverGame.serverId = 15100;
        serverGame.GameName = "冰球突破";
        serverGame.serverInfo = {};
        //正常
        serverGame.serverInfo.normal = [];
        serverRoomTemp.Server = 1;
        serverRoomTemp.bet = 1;
        serverRoomTemp.Match = 0;
        serverRoomTemp.entryCoin = 1000;
        serverRoomTemp.gift = 0;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "15100";
        serverGame.serverInfo.normal.push(serverRoomTemp);
        GameConfig.push(serverGame);

        serverGame = {};
        serverRoomTemp = {};
        serverGame.GameId = 206;
        serverGame.serverId = 15106;
        serverGame.GameName = "明星97";
        serverGame.serverInfo = {};
        //正常
        serverGame.serverInfo.normal = [];
        serverRoomTemp.Server = 1;
        serverRoomTemp.bet = 1;
        serverRoomTemp.Match = 0;
        serverRoomTemp.entryCoin = 1000;
        serverRoomTemp.gift = 0;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "15106";
        serverGame.serverInfo.normal.push(serverRoomTemp);
        GameConfig.push(serverGame);

        serverGame = {};
        serverRoomTemp = {};
        serverGame.GameId = 219;
        serverGame.serverId = 15119;
        serverGame.GameName = "疯狂小丑";
        serverGame.serverInfo = {};
        //正常
        serverGame.serverInfo.normal = [];
        serverRoomTemp.Server = 1;
        serverRoomTemp.bet = 1;
        serverRoomTemp.Match = 0;
        serverRoomTemp.entryCoin = 1000;
        serverRoomTemp.gift = 0;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "15119";
        serverGame.serverInfo.normal.push(serverRoomTemp);
        GameConfig.push(serverGame);

        serverGame = {};
        serverRoomTemp = {};
        serverGame.GameId = 220;
        serverGame.serverId = 15120;
        serverGame.GameName = "大富豪";
        serverGame.serverInfo = {};
        //正常
        serverGame.serverInfo.normal = [];
        serverRoomTemp.Server = 1;
        serverRoomTemp.bet = 1;
        serverRoomTemp.Match = 0;
        serverRoomTemp.entryCoin = 1000;
        serverRoomTemp.gift = 0;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "15120";
        serverGame.serverInfo.normal.push(serverRoomTemp);
        GameConfig.push(serverGame);

        serverGame = {};
        serverRoomTemp = {};
        serverGame.GameId = 221;
        serverGame.serverId = 15121;
        serverGame.GameName = "金库";
        serverGame.serverInfo = {};
        //正常
        serverGame.serverInfo.normal = [];
        serverRoomTemp.Server = 1;
        serverRoomTemp.bet = 1;
        serverRoomTemp.Match = 0;
        serverRoomTemp.entryCoin = 1000;
        serverRoomTemp.gift = 0;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "15121";
        serverGame.serverInfo.normal.push(serverRoomTemp);
        GameConfig.push(serverGame);

        serverGame = {};
        serverRoomTemp = {};
        serverGame.GameId = 222;
        serverGame.serverId = 15122;
        serverGame.GameName = "FireLinkRR";
        serverGame.serverInfo = {};
        //正常
        serverGame.serverInfo.normal = [];
        serverRoomTemp.Server = 1;
        serverRoomTemp.bet = 1;
        serverRoomTemp.Match = 0;
        serverRoomTemp.entryCoin = 1000;
        serverRoomTemp.gift = 0;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "15122";
        serverGame.serverInfo.normal.push(serverRoomTemp);
        GameConfig.push(serverGame);

        serverGame = {};
        serverRoomTemp = {};
        serverGame.GameId = 223;
        serverGame.serverId = 15123;
        serverGame.GameName = "FireLinkOS";
        serverGame.serverInfo = {};
        //正常
        serverGame.serverInfo.normal = [];
        serverRoomTemp.Server = 1;
        serverRoomTemp.bet = 1;
        serverRoomTemp.Match = 0;
        serverRoomTemp.entryCoin = 1000;
        serverRoomTemp.gift = 0;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "15123";
        serverGame.serverInfo.normal.push(serverRoomTemp);
        GameConfig.push(serverGame);

        serverGame = {};
        serverRoomTemp = {};
        serverGame.GameId = 224;
        serverGame.serverId = 15124;
        serverGame.GameName = "FireLinkCS";
        serverGame.serverInfo = {};
        //正常
        serverGame.serverInfo.normal = [];
        serverRoomTemp.Server = 1;
        serverRoomTemp.bet = 1;
        serverRoomTemp.Match = 0;
        serverRoomTemp.entryCoin = 1000;
        serverRoomTemp.gift = 0;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "15124";
        serverGame.serverInfo.normal.push(serverRoomTemp);
        GameConfig.push(serverGame);

        serverGame = {};
        serverRoomTemp = {};
        serverGame.GameId = 225;
        serverGame.serverId = 15125;
        serverGame.GameName = "FireLinkR66";
        serverGame.serverInfo = {};
        //正常
        serverGame.serverInfo.normal = [];
        serverRoomTemp.Server = 1;
        serverRoomTemp.bet = 1;
        serverRoomTemp.Match = 0;
        serverRoomTemp.entryCoin = 1000;
        serverRoomTemp.gift = 0;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "15125";
        serverGame.serverInfo.normal.push(serverRoomTemp);
        GameConfig.push(serverGame);

        serverGame = {};
        serverRoomTemp = {};
        serverGame.GameId = 226;
        serverGame.serverId = 15126;
        serverGame.GameName = "WildBuffAlo";
        serverGame.serverInfo = {};
        //正常
        serverGame.serverInfo.normal = [];
        serverRoomTemp.Server = 1;
        serverRoomTemp.bet = 1;
        serverRoomTemp.Match = 0;
        serverRoomTemp.entryCoin = 1000;
        serverRoomTemp.gift = 0;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "15126";
        serverGame.serverInfo.normal.push(serverRoomTemp);
        GameConfig.push(serverGame);

        serverGame = {};
        serverRoomTemp = {};
        serverGame.GameId = 227;
        serverGame.serverId = 15127;
        serverGame.GameName = "LockitLink_nightlife";
        serverGame.serverInfo = {};
        //正常
        serverGame.serverInfo.normal = [];
        serverRoomTemp.Server = 1;
        serverRoomTemp.bet = 1;
        serverRoomTemp.Match = 0;
        serverRoomTemp.entryCoin = 1000;
        serverRoomTemp.gift = 0;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "15127";
        serverGame.serverInfo.normal.push(serverRoomTemp);
        GameConfig.push(serverGame);

        serverGame = {};
        serverRoomTemp = {};
        serverGame.GameId = 228;
        serverGame.serverId = 15128;
        serverGame.GameName = "goldcup";
        serverGame.serverInfo = {};
        //正常
        serverGame.serverInfo.normal = [];
        serverRoomTemp.Server = 1;
        serverRoomTemp.bet = 1;
        serverRoomTemp.Match = 0;
        serverRoomTemp.entryCoin = 1000;
        serverRoomTemp.gift = 0;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "15128";
        serverGame.serverInfo.normal.push(serverRoomTemp);
        GameConfig.push(serverGame);

        serverGame = {};
        serverRoomTemp = {};
        serverGame.GameId = 229;
        serverGame.serverId = 15129;
        serverGame.GameName = "freespin";
        serverGame.serverInfo = {};
        //正常
        serverGame.serverInfo.normal = [];
        serverRoomTemp.Server = 1;
        serverRoomTemp.bet = 1;
        serverRoomTemp.Match = 0;
        serverRoomTemp.entryCoin = 1000;
        serverRoomTemp.gift = 0;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "15129";
        serverGame.serverInfo.normal.push(serverRoomTemp);
        GameConfig.push(serverGame);

        serverGame = {};
        serverRoomTemp = {};
        serverGame.GameId = 230;
        serverGame.serverId = 15130;
        serverGame.GameName = "superspin";
        serverGame.serverInfo = {};
        //正常
        serverGame.serverInfo.normal = [];
        serverRoomTemp.Server = 1;
        serverRoomTemp.bet = 1;
        serverRoomTemp.Match = 0;
        serverRoomTemp.entryCoin = 1000;
        serverRoomTemp.gift = 0;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "15130";
        serverGame.serverInfo.normal.push(serverRoomTemp);
        GameConfig.push(serverGame);

        serverGame = {};
        serverRoomTemp = {};
        serverGame.GameId = 231;
        serverGame.serverId = 15131;
        serverGame.GameName = "jackpotspin";
        serverGame.serverInfo = {};
        //正常
        serverGame.serverInfo.normal = [];
        serverRoomTemp.Server = 1;
        serverRoomTemp.bet = 1;
        serverRoomTemp.Match = 0;
        serverRoomTemp.entryCoin = 1000;
        serverRoomTemp.gift = 0;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "15131";
        serverGame.serverInfo.normal.push(serverRoomTemp);
        GameConfig.push(serverGame);

        serverGame = {};
        serverRoomTemp = {};
        serverGame.GameId = 232;
        serverGame.serverId = 15132;
        serverGame.GameName = "lucky777";
        serverGame.serverInfo = {};
        //正常
        serverGame.serverInfo.normal = [];
        serverRoomTemp.Server = 1;
        serverRoomTemp.bet = 1;
        serverRoomTemp.Match = 0;
        serverRoomTemp.entryCoin = 1000;
        serverRoomTemp.gift = 0;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "15132";
        serverGame.serverInfo.normal.push(serverRoomTemp);
        GameConfig.push(serverGame);

        serverGame = {};
        serverRoomTemp = {};
        serverGame.GameId = 233;
        serverGame.serverId = 15133;
        serverGame.GameName = "premierleaguestar";
        serverGame.serverInfo = {};
        //正常
        serverGame.serverInfo.normal = [];
        serverRoomTemp.Server = 1;
        serverRoomTemp.bet = 1;
        serverRoomTemp.Match = 0;
        serverRoomTemp.entryCoin = 1000;
        serverRoomTemp.gift = 0;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "15133";
        serverGame.serverInfo.normal.push(serverRoomTemp);
        GameConfig.push(serverGame);

        serverGame = {};
        serverRoomTemp = {};
        serverGame.GameId = 234;
        serverGame.serverId = 15134;
        serverGame.GameName = "ghostpirates";
        serverGame.serverInfo = {};
        //正常
        serverGame.serverInfo.normal = [];
        serverRoomTemp.Server = 1;
        serverRoomTemp.bet = 1;
        serverRoomTemp.Match = 0;
        serverRoomTemp.entryCoin = 1000;
        serverRoomTemp.gift = 0;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "15134";
        serverGame.serverInfo.normal.push(serverRoomTemp);
        GameConfig.push(serverGame);

        serverGame = {};
        serverRoomTemp = {};
        serverGame.GameId = 235;
        serverGame.serverId = 15135;
        serverGame.GameName = "spinBig";
        serverGame.serverInfo = {};
        //正常
        serverGame.serverInfo.normal = [];
        serverRoomTemp.Server = 1;
        serverRoomTemp.bet = 1;
        serverRoomTemp.Match = 0;
        serverRoomTemp.entryCoin = 1000;
        serverRoomTemp.gift = 0;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "15135";
        serverGame.serverInfo.normal.push(serverRoomTemp);
        GameConfig.push(serverGame);

        serverGame = {};
        serverRoomTemp = {};
        serverGame.GameId = 236;
        serverGame.serverId = 15136;
        serverGame.GameName = "canghaiyizhu";
        serverGame.serverInfo = {};
        //正常
        serverGame.serverInfo.normal = [];
        serverRoomTemp.Server = 1;
        serverRoomTemp.bet = 1;
        serverRoomTemp.Match = 0;
        serverRoomTemp.entryCoin = 1000;
        serverRoomTemp.gift = 0;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "15136";
        serverGame.serverInfo.normal.push(serverRoomTemp);
        GameConfig.push(serverGame);

        serverGame = {};
        serverRoomTemp = {};
        serverGame.GameId = 237;
        serverGame.serverId = 15137;
        serverGame.GameName = "hotspin";
        serverGame.serverInfo = {};
        //正常
        serverGame.serverInfo.normal = [];
        serverRoomTemp.Server = 1;
        serverRoomTemp.bet = 1;
        serverRoomTemp.Match = 0;
        serverRoomTemp.entryCoin = 1000;
        serverRoomTemp.gift = 0;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "15137";
        serverGame.serverInfo.normal.push(serverRoomTemp);
        GameConfig.push(serverGame);

        serverGame = {};
        serverRoomTemp = {};
        serverGame.GameId = 238;
        serverGame.serverId = 15138;
        serverGame.GameName = "烈火英雄";
        serverGame.serverInfo = {};
        //正常
        serverGame.serverInfo.normal = [];
        serverRoomTemp.Server = 1;
        serverRoomTemp.bet = 1;
        serverRoomTemp.Match = 0;
        serverRoomTemp.entryCoin = 1000;
        serverRoomTemp.gift = 0;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "15138";
        serverGame.serverInfo.normal.push(serverRoomTemp);
        GameConfig.push(serverGame);

        serverGame = {};
        serverRoomTemp = {};
        serverGame.GameId = 239;
        serverGame.serverId = 15139;
        serverGame.GameName = "麻将欢乐门";
        serverGame.serverInfo = {};
        //正常
        serverGame.serverInfo.normal = [];
        serverRoomTemp.Server = 1;
        serverRoomTemp.bet = 1;
        serverRoomTemp.Match = 0;
        serverRoomTemp.entryCoin = 1000;
        serverRoomTemp.gift = 0;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "15139";
        serverGame.serverInfo.normal.push(serverRoomTemp);
        GameConfig.push(serverGame);

        serverGame = {};
        serverRoomTemp = {};
        serverGame.GameId = 240;
        serverGame.serverId = 15140;
        serverGame.GameName = "纸牌老虎机";
        serverGame.serverInfo = {};
        //正常
        serverGame.serverInfo.normal = [];
        serverRoomTemp.Server = 1;
        serverRoomTemp.bet = 1;
        serverRoomTemp.Match = 0;
        serverRoomTemp.entryCoin = 1000;
        serverRoomTemp.gift = 0;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "15140";
        serverGame.serverInfo.normal.push(serverRoomTemp);
        GameConfig.push(serverGame);

        serverGame = {};
        serverRoomTemp = {};
        serverGame.GameId = 241;
        serverGame.serverId = 15141;
        serverGame.GameName = "企鹅寻宝";
        serverGame.serverInfo = {};
        //正常
        serverGame.serverInfo.normal = [];
        serverRoomTemp.Server = 1;
        serverRoomTemp.bet = 1;
        serverRoomTemp.Match = 0;
        serverRoomTemp.entryCoin = 1000;
        serverRoomTemp.gift = 0;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "15141";
        serverGame.serverInfo.normal.push(serverRoomTemp);
        GameConfig.push(serverGame);


        serverGame = {};
        serverRoomTemp = {};
        serverGame.GameId = 242;
        serverGame.serverId = 15142;
        serverGame.GameName = "MadameDestiny";
        serverGame.serverInfo = {};
        //正常
        serverGame.serverInfo.normal = [];
        serverRoomTemp.Server = 1;
        serverRoomTemp.bet = 1;
        serverRoomTemp.Match = 0;
        serverRoomTemp.entryCoin = 1000;
        serverRoomTemp.gift = 0;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "15142";
        serverGame.serverInfo.normal.push(serverRoomTemp);
        GameConfig.push(serverGame);

        serverGame = {};
        serverRoomTemp = {};
        serverGame.GameId = 243;
        serverGame.serverId = 15143;
        serverGame.GameName = "绿叶水果";
        serverGame.serverInfo = {};
        //正常
        serverGame.serverInfo.normal = [];
        serverRoomTemp.Server = 1;
        serverRoomTemp.bet = 1;
        serverRoomTemp.Match = 0;
        serverRoomTemp.entryCoin = 1000;
        serverRoomTemp.gift = 0;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "15143";
        serverGame.serverInfo.normal.push(serverRoomTemp);
        GameConfig.push(serverGame);

        serverGame = {};
        serverRoomTemp = {};
        serverGame.GameId = 244;
        serverGame.serverId = 15144;
        serverGame.GameName = "财神发发发";
        serverGame.serverInfo = {};
        //正常
        serverGame.serverInfo.normal = [];
        serverRoomTemp.Server = 1;
        serverRoomTemp.bet = 1;
        serverRoomTemp.Match = 0;
        serverRoomTemp.entryCoin = 1000;
        serverRoomTemp.gift = 0;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "15144";
        serverGame.serverInfo.normal.push(serverRoomTemp);
        GameConfig.push(serverGame);

        serverGame = {};
        serverRoomTemp = {};
        serverGame.GameId = 245;
        serverGame.serverId = 15145;
        serverGame.GameName = "水果777";
        serverGame.serverInfo = {};
        //正常
        serverGame.serverInfo.normal = [];
        serverRoomTemp.Server = 1;
        serverRoomTemp.bet = 1;
        serverRoomTemp.Match = 0;
        serverRoomTemp.entryCoin = 1000;
        serverRoomTemp.gift = 0;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "15145";
        serverGame.serverInfo.normal.push(serverRoomTemp);
        GameConfig.push(serverGame);

        serverGame = {};
        serverRoomTemp = {};
        serverGame.GameId = 246;
        serverGame.serverId = 15146;
        serverGame.GameName = "麻将胡了";
        serverGame.serverInfo = {};
        //正常
        serverGame.serverInfo.normal = [];
        serverRoomTemp.Server = 1;
        serverRoomTemp.bet = 1;
        serverRoomTemp.Match = 0;
        serverRoomTemp.entryCoin = 1000;
        serverRoomTemp.gift = 0;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "15146";
        serverGame.serverInfo.normal.push(serverRoomTemp);
        GameConfig.push(serverGame);

        serverGame = {};
        serverRoomTemp = {};
        serverGame.GameId = 247;
        serverGame.serverId = 15147;
        serverGame.GameName = "法老宝藏";
        serverGame.serverInfo = {};
        //正常
        serverGame.serverInfo.normal = [];
        serverRoomTemp.Server = 1;
        serverRoomTemp.bet = 1;
        serverRoomTemp.Match = 0;
        serverRoomTemp.entryCoin = 1000;
        serverRoomTemp.gift = 0;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "15147";
        serverGame.serverInfo.normal.push(serverRoomTemp);
        GameConfig.push(serverGame);

        serverGame = {};
        serverRoomTemp = {};
        serverGame.GameId = 248;
        serverGame.serverId = 15148;
        serverGame.GameName = "跳高高";
        serverGame.serverInfo = {};
        //正常
        serverGame.serverInfo.normal = [];
        serverRoomTemp.Server = 1;
        serverRoomTemp.bet = 1;
        serverRoomTemp.Match = 0;
        serverRoomTemp.entryCoin = 1000;
        serverRoomTemp.gift = 0;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "15148";
        serverGame.serverInfo.normal.push(serverRoomTemp);
        GameConfig.push(serverGame);

        serverGame = {};
        serverRoomTemp = {};
        serverGame.GameId = 249;
        serverGame.serverId = 15149;
        serverGame.GameName = "竹子熊猫";
        serverGame.serverInfo = {};
        //正常
        serverGame.serverInfo.normal = [];
        serverRoomTemp.Server = 1;
        serverRoomTemp.bet = 1;
        serverRoomTemp.Match = 0;
        serverRoomTemp.entryCoin = 1000;
        serverRoomTemp.gift = 0;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "15149";
        serverGame.serverInfo.normal.push(serverRoomTemp);
        GameConfig.push(serverGame);

        serverGame = {};
        serverRoomTemp = {};
        serverGame.GameId = 250;
        serverGame.serverId = 15150;
        serverGame.GameName = "心动主播";
        serverGame.serverInfo = {};
        //正常
        serverGame.serverInfo.normal = [];
        serverRoomTemp.Server = 1;
        serverRoomTemp.bet = 1;
        serverRoomTemp.Match = 0;
        serverRoomTemp.entryCoin = 1000;
        serverRoomTemp.gift = 0;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "15150";
        serverGame.serverInfo.normal.push(serverRoomTemp);
        GameConfig.push(serverGame);

        serverGame = {};
        serverRoomTemp = {};
        serverGame.GameId = 251;
        serverGame.serverId = 15151;
        serverGame.GameName = "双喜临门";
        serverGame.serverInfo = {};
        //正常
        serverGame.serverInfo.normal = [];
        serverRoomTemp.Server = 1;
        serverRoomTemp.bet = 1;
        serverRoomTemp.Match = 0;
        serverRoomTemp.entryCoin = 1000;
        serverRoomTemp.gift = 0;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "15151";
        serverGame.serverInfo.normal.push(serverRoomTemp);
        GameConfig.push(serverGame);

        serverGame = {};
        serverRoomTemp = {};
        serverGame.GameId = 252;
        serverGame.serverId = 15152;
        serverGame.GameName = "比翼双飞";
        serverGame.serverInfo = {};
        //正常
        serverGame.serverInfo.normal = [];
        serverRoomTemp.Server = 1;
        serverRoomTemp.bet = 1;
        serverRoomTemp.Match = 0;
        serverRoomTemp.entryCoin = 1000;
        serverRoomTemp.gift = 0;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "15152";
        serverGame.serverInfo.normal.push(serverRoomTemp);
        GameConfig.push(serverGame);

        serverGame = {};
        serverRoomTemp = {};
        serverGame.GameId = 254;
        serverGame.serverId = 15154;
        serverGame.GameName = "HerculesSonZeus";
        serverGame.serverInfo = {};
        //正常
        serverGame.serverInfo.normal = [];
        serverRoomTemp.Server = 1;
        serverRoomTemp.bet = 1;
        serverRoomTemp.Match = 0;
        serverRoomTemp.entryCoin = 1000;
        serverRoomTemp.gift = 0;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "15154";
        serverGame.serverInfo.normal.push(serverRoomTemp);
        GameConfig.push(serverGame);

        serverGame = {};
        serverRoomTemp = {};
        serverGame.GameId = 256;
        serverGame.serverId = 15156;
        serverGame.GameName = "PantherQueen";
        serverGame.serverInfo = {};
        //正常
        serverGame.serverInfo.normal = [];
        serverRoomTemp.Server = 1;
        serverRoomTemp.bet = 1;
        serverRoomTemp.Match = 0;
        serverRoomTemp.entryCoin = 1000;
        serverRoomTemp.gift = 0;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "15156";
        serverGame.serverInfo.normal.push(serverRoomTemp);
        GameConfig.push(serverGame);

        serverGame = {};
        serverRoomTemp = {};
        serverGame.GameId = 260;
        serverGame.serverId = 15160;
        serverGame.GameName = "IceStone";
        serverGame.serverInfo = {};
        //正常
        serverGame.serverInfo.normal = [];
        serverRoomTemp.Server = 1;
        serverRoomTemp.bet = 1;
        serverRoomTemp.Match = 0;
        serverRoomTemp.entryCoin = 1000;
        serverRoomTemp.gift = 0;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "15160";
        serverGame.serverInfo.normal.push(serverRoomTemp);
        GameConfig.push(serverGame);

        serverGame = {};
        serverRoomTemp = {};
        serverGame.GameId = 262;
        serverGame.serverId = 15162;
        serverGame.GameName = "明星972023";
        serverGame.serverInfo = {};
        //正常
        serverGame.serverInfo.normal = [];
        serverRoomTemp.Server = 1;
        serverRoomTemp.bet = 1;
        serverRoomTemp.Match = 0;
        serverRoomTemp.entryCoin = 1000;
        serverRoomTemp.gift = 0;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "15162";
        serverGame.serverInfo.normal.push(serverRoomTemp);
        GameConfig.push(serverGame);

        serverGame = {};
        serverRoomTemp = {};
        serverGame.GameId = 263;
        serverGame.serverId = 15163;
        serverGame.GameName = "ganeshagold";
        serverGame.serverInfo = {};
        //正常
        serverGame.serverInfo.normal = [];
        serverRoomTemp.Server = 1;
        serverRoomTemp.bet = 1;
        serverRoomTemp.Match = 0;
        serverRoomTemp.entryCoin = 1000;
        serverRoomTemp.gift = 0;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "15163";
        serverGame.serverInfo.normal.push(serverRoomTemp);
        GameConfig.push(serverGame);

        serverGame = {};
        serverRoomTemp = {};
        serverGame.GameId = 264;
        serverGame.serverId = 15164;
        serverGame.GameName = "fortuneox";
        serverGame.serverInfo = {};
        //正常
        serverGame.serverInfo.normal = [];
        serverRoomTemp.Server = 1;
        serverRoomTemp.bet = 1;
        serverRoomTemp.Match = 0;
        serverRoomTemp.entryCoin = 1000;
        serverRoomTemp.gift = 0;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "15164";
        serverGame.serverInfo.normal.push(serverRoomTemp);
        GameConfig.push(serverGame);

        serverGame = {};
        serverRoomTemp = {};
        serverGame.GameId = 265;
        serverGame.serverId = 15165;
        serverGame.GameName = "fortunemouse";
        serverGame.serverInfo = {};
        //正常
        serverGame.serverInfo.normal = [];
        serverRoomTemp.Server = 1;
        serverRoomTemp.bet = 1;
        serverRoomTemp.Match = 0;
        serverRoomTemp.entryCoin = 1000;
        serverRoomTemp.gift = 0;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "15165";
        serverGame.serverInfo.normal.push(serverRoomTemp);
        GameConfig.push(serverGame);

        serverGame = {};
        serverRoomTemp = {};
        serverGame.GameId = 266;
        serverGame.serverId = 15166;
        serverGame.GameName = "bikiniparadise";
        serverGame.serverInfo = {};
        //正常
        serverGame.serverInfo.normal = [];
        serverRoomTemp.Server = 1;
        serverRoomTemp.bet = 1;
        serverRoomTemp.Match = 0;
        serverRoomTemp.entryCoin = 1000;
        serverRoomTemp.gift = 0;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "15166";
        serverGame.serverInfo.normal.push(serverRoomTemp);
        GameConfig.push(serverGame);


        serverGame = {};
        serverRoomTemp = {};
        serverGame.GameId = 268;
        serverGame.serverId = 15168;
        serverGame.GameName = "fortunetiger";
        serverGame.serverInfo = {};
        //正常
        serverGame.serverInfo.normal = [];
        serverRoomTemp.Server = 1;
        serverRoomTemp.bet = 1;
        serverRoomTemp.Match = 0;
        serverRoomTemp.entryCoin = 1000;
        serverRoomTemp.gift = 0;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "15168";
        serverGame.serverInfo.normal.push(serverRoomTemp);
        GameConfig.push(serverGame);

        serverGame = {};
        serverRoomTemp = {};
        serverGame.GameId = 269;
        serverGame.serverId = 15169;
        serverGame.GameName = "麻将胡了PG";
        serverGame.serverInfo = {};
        //正常
        serverGame.serverInfo.normal = [];
        serverRoomTemp.Server = 1;
        serverRoomTemp.bet = 1;
        serverRoomTemp.Match = 0;
        serverRoomTemp.entryCoin = 1000;
        serverRoomTemp.gift = 0;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "15169";
        serverGame.serverInfo.normal.push(serverRoomTemp);
        GameConfig.push(serverGame);

        serverGame = {};
        serverRoomTemp = {};
        serverGame.GameId = 270;
        serverGame.serverId = 15170;
        serverGame.GameName = "fortunerabbit";
        serverGame.serverInfo = {};
        //正常
        serverGame.serverInfo.normal = [];
        serverRoomTemp.Server = 1;
        serverRoomTemp.bet = 1;
        serverRoomTemp.Match = 0;
        serverRoomTemp.entryCoin = 1000;
        serverRoomTemp.gift = 0;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "15170";
        serverGame.serverInfo.normal.push(serverRoomTemp);
        GameConfig.push(serverGame);

        serverGame = {};
        serverRoomTemp = {};
        serverGame.GameId = 5200;
        serverGame.serverId = 15200;
        serverGame.GameName = "连环夺宝";
        serverGame.serverInfo = {};
        //正常
        serverGame.serverInfo.normal = [];
        serverRoomTemp.Server = 1;
        serverRoomTemp.bet = 1;
        serverRoomTemp.Match = 0;
        serverRoomTemp.entryCoin = 1000;
        serverRoomTemp.gift = 0;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "15200";
        serverGame.serverInfo.normal.push(serverRoomTemp);
        GameConfig.push(serverGame);

        serverGame = {}
        serverRoomTemp = {};
        serverGame.GameId = 302;
        serverGame.serverId = 15302;
        serverGame.GameName = "luckypoker";
        serverGame.serverInfo = {};
        //正常
        serverGame.serverInfo.normal = [];
        serverRoomTemp.Server = 1;
        serverRoomTemp.bet = 1;
        serverRoomTemp.Match = 0;
        serverRoomTemp.entryCoin = 1000;
        serverRoomTemp.gift = 0;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "15302";
        serverGame.serverInfo.normal.push(serverRoomTemp);
        GameConfig.push(serverGame);

        serverGame = {}
        serverRoomTemp = {};
        serverGame.GameId = 303;
        serverGame.serverId = 15303;
        serverGame.GameName = "penaltyshooters";
        serverGame.serverInfo = {};
        //正常
        serverGame.serverInfo.normal = [];
        serverRoomTemp.Server = 1;
        serverRoomTemp.bet = 1;
        serverRoomTemp.Match = 0;
        serverRoomTemp.entryCoin = 1000;
        serverRoomTemp.gift = 0;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "15303";
        serverGame.serverInfo.normal.push(serverRoomTemp);
        GameConfig.push(serverGame);


        serverGame = {};
        serverRoomTemp = {};
        serverGame.GameId = 3901;
        serverGame.serverId = 13901;
        serverGame.GameName = "black jack";
        serverGame.serverInfo = {};
        //正常
        serverGame.serverInfo.normal = [];
        serverRoomTemp.Server = 1;
        serverRoomTemp.bet = 1;
        serverRoomTemp.Match = 0;
        serverRoomTemp.entryCoin = 1000;
        serverRoomTemp.gift = 0;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "13901";
        serverGame.serverInfo.normal.push(serverRoomTemp);
        GameConfig.push(serverGame);


//=============================================================================================
        //百人场
        serverGame = {}
        serverRoomTemp = {};
        serverGame.GameId = 1000;
        serverGame.serverId = 16000;
        serverGame.GameName = "西游争霸";
        serverGame.serverInfo = {};
        //正常
        serverGame.serverInfo.normal = [];
        serverRoomTemp.Server = 1;
        serverRoomTemp.bet = 1;
        serverRoomTemp.Match = 0;
        serverRoomTemp.entryCoin = 1000;
        serverRoomTemp.gift = 0;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "16000";
        serverGame.serverInfo.normal.push(serverRoomTemp);
        GameConfig.push(serverGame);

        serverGame = {}
        serverRoomTemp = {};
        serverGame.GameId = 1001;
        serverGame.serverId = 16001;
        serverGame.GameName = "西游争霸2";
        serverGame.serverInfo = {};
        //正常
        serverGame.serverInfo.normal = [];
        serverRoomTemp.Server = 1;
        serverRoomTemp.bet = 1;
        serverRoomTemp.Match = 0;
        serverRoomTemp.entryCoin = 1000;
        serverRoomTemp.gift = 0;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "16001";
        serverGame.serverInfo.normal.push(serverRoomTemp);
        GameConfig.push(serverGame);


        serverGame = {};
        serverRoomTemp = {};
        serverGame.GameId = 1002;
        serverGame.serverId = 16002;
        serverGame.GameName = "百人场俄罗斯轮盘";
        serverGame.serverInfo = {};
        //正常
        serverGame.serverInfo.normal = [];
        serverRoomTemp.Server = 1;
        serverRoomTemp.bet = 1;
        serverRoomTemp.Match = 0;
        serverRoomTemp.entryCoin = 1000;
        serverRoomTemp.gift = 0;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "16002";
        serverGame.serverInfo.normal.push(serverRoomTemp);
        GameConfig.push(serverGame);

        serverGame = {};
        serverRoomTemp = {};
        serverGame.GameId = 1003;
        serverGame.serverId = 16003;
        serverGame.GameName = "百人场龙虎斗";
        serverGame.serverInfo = {};
        //正常
        serverGame.serverInfo.normal = [];
        serverRoomTemp.Server = 1;
        serverRoomTemp.bet = 1;
        serverRoomTemp.Match = 0;
        serverRoomTemp.entryCoin = 1000;
        serverRoomTemp.gift = 0;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "16003";
        serverGame.serverInfo.normal.push(serverRoomTemp);
        GameConfig.push(serverGame);

        serverGame = {};
        serverRoomTemp = {};
        serverGame.GameId = 1004;
        serverGame.serverId = 16004;
        serverGame.GameName = "百人场百家乐";
        serverGame.serverInfo = {};
        //正常
        serverGame.serverInfo.normal = [];
        serverRoomTemp.Server = 1;
        serverRoomTemp.bet = 1;
        serverRoomTemp.Match = 0;
        serverRoomTemp.entryCoin = 1000;
        serverRoomTemp.gift = 0;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "16004";
        serverGame.serverInfo.normal.push(serverRoomTemp);
        GameConfig.push(serverGame);


        serverGame = {};
        serverRoomTemp = {};
        serverGame.GameId = 5201;
        serverGame.serverId = 15201;
        serverGame.GameName = "百人场森林舞会";
        serverGame.serverInfo = {};
        //正常
        serverGame.serverInfo.normal = [];
        serverRoomTemp.Server = 1;
        serverRoomTemp.bet = 1;
        serverRoomTemp.Match = 0;
        serverRoomTemp.entryCoin = 1000;
        serverRoomTemp.gift = 0;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "15201";
        serverGame.serverInfo.normal.push(serverRoomTemp);
        GameConfig.push(serverGame);

        serverGame = {};
        serverRoomTemp = {};
        serverGame.GameId = 6005;
        serverGame.serverId = 16005;
        serverGame.GameName = "百人场猜大小";
        serverGame.serverInfo = {};
        //正常
        serverGame.serverInfo.normal = [];
        serverRoomTemp.Server = 1;
        serverRoomTemp.bet = 1;
        serverRoomTemp.Match = 0;
        serverRoomTemp.entryCoin = 1000;
        serverRoomTemp.gift = 0;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "16005";
        serverGame.serverInfo.normal.push(serverRoomTemp);
        GameConfig.push(serverGame);

        serverGame = {};
        serverRoomTemp = {};
        serverGame.GameId = 1007;
        serverGame.serverId = 16007;
        serverGame.GameName = "ATT连环炮";
        serverGame.serverInfo = {};
        //正常
        serverGame.serverInfo.normal = [];
        serverRoomTemp.Server = 1;
        serverRoomTemp.bet = 1;
        serverRoomTemp.Match = 0;
        serverRoomTemp.entryCoin = 1000;
        serverRoomTemp.gift = 0;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "16007";
        serverGame.serverInfo.normal.push(serverRoomTemp);
        GameConfig.push(serverGame);
//----------------------百人场_奔驰宝马--------------
        serverGame = {};
        serverRoomTemp = {};
        serverGame.GameId = 1008;
        serverGame.serverId = 16008;
        serverGame.GameName = "奔驰宝马";
        serverGame.serverInfo = {};
        //正常
        serverGame.serverInfo.normal = [];
        serverRoomTemp.Server = 1;
        serverRoomTemp.bet = 1;
        serverRoomTemp.Match = 0;
        serverRoomTemp.entryCoin = 100;
        serverRoomTemp.gift = 0;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "16008";
        serverGame.serverInfo.normal.push(serverRoomTemp);
        GameConfig.push(serverGame);
//-----------------------------------------------------
        serverGame = {};
        serverRoomTemp = {};
        serverGame.GameId = 1009;
        serverGame.serverId = 16009;
        serverGame.GameName = "火凤凰";
        serverGame.serverInfo = {};
        //正常
        serverGame.serverInfo.normal = [];
        serverRoomTemp.Server = 1;
        serverRoomTemp.bet = 1;
        serverRoomTemp.Match = 0;
        serverRoomTemp.entryCoin = 1000;
        serverRoomTemp.gift = 0;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "16009";
        serverGame.serverInfo.normal.push(serverRoomTemp);
        GameConfig.push(serverGame);
//----------------------百人场_德州牛仔--------------
        serverGame = {};
        serverRoomTemp = {};
        serverGame.GameId = 1010;
        serverGame.serverId = 16010;
        serverGame.GameName = "德州牛仔";
        serverGame.serverInfo = {};
        //正常
        serverGame.serverInfo.normal = [];
        serverRoomTemp.Server = 1;
        serverRoomTemp.bet = 1;
        serverRoomTemp.Match = 0;
        serverRoomTemp.entryCoin = 100;
        serverRoomTemp.gift = 0;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "16010";
        serverGame.serverInfo.normal.push(serverRoomTemp);
        GameConfig.push(serverGame);
//----------------------百人场_28杠--------------
        serverGame = {};
        serverRoomTemp = {};
        serverGame.GameId = 1011;
        serverGame.serverId = 16011;
        serverGame.GameName = "28杠";
        serverGame.serverInfo = {};
        //正常
        serverGame.serverInfo.normal = [];
        serverRoomTemp.Server = 1;
        serverRoomTemp.bet = 1;
        serverRoomTemp.Match = 0;
        serverRoomTemp.entryCoin = 100;
        serverRoomTemp.gift = 0;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "16011";
        serverGame.serverInfo.normal.push(serverRoomTemp);
        GameConfig.push(serverGame);
//-----------------------------------------------------
        serverGame = {};
        serverRoomTemp = {};
        serverGame.GameId = 1012;
        serverGame.serverId = 16012;
        serverGame.GameName = "4D彩票";
        serverGame.serverInfo = {};
        //正常
        serverGame.serverInfo.normal = [];
        serverRoomTemp.Server = 1;
        serverRoomTemp.bet = 1;
        serverRoomTemp.Match = 0;
        serverRoomTemp.entryCoin = 1000;
        serverRoomTemp.gift = 0;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "16012";
        serverGame.serverInfo.normal.push(serverRoomTemp);
        GameConfig.push(serverGame);
//-----------------------------------------------------
        serverGame = {};
        serverRoomTemp = {};
        serverGame.GameId = 1013;
        serverGame.serverId = 16013;
        serverGame.GameName = "科诺球";
        serverGame.serverInfo = {};
        //正常
        serverGame.serverInfo.normal = [];
        serverRoomTemp.Server = 1;
        serverRoomTemp.bet = 1;
        serverRoomTemp.Match = 0;
        serverRoomTemp.entryCoin = 1000;
        serverRoomTemp.gift = 0;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "16013";
        serverGame.serverInfo.normal.push(serverRoomTemp);
        GameConfig.push(serverGame);
        //-----------------------------------------------------
        serverGame = {};
        serverRoomTemp = {};
        serverGame.GameId = 1014;
        serverGame.serverId = 16014;
        serverGame.GameName = "colorgame";
        serverGame.serverInfo = {};
        //正常
        serverGame.serverInfo.normal = [];
        serverRoomTemp.Server = 1;
        serverRoomTemp.bet = 1;
        serverRoomTemp.Match = 0;
        serverRoomTemp.entryCoin = 1000;
        serverRoomTemp.gift = 0;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "16014";
        serverGame.serverInfo.normal.push(serverRoomTemp);
        GameConfig.push(serverGame);
        //----------------------百人场_飞禽走兽--------------
        serverGame = {};
        serverRoomTemp = {};
        serverGame.GameId = 1015;
        serverGame.serverId = 16015;
        serverGame.GameName = "飞禽走兽";
        serverGame.serverInfo = {};
        //正常
        serverGame.serverInfo.normal = [];
        serverRoomTemp.Server = 1;
        serverRoomTemp.bet = 1;
        serverRoomTemp.Match = 0;
        serverRoomTemp.entryCoin = 100;
        serverRoomTemp.gift = 0;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "16015";
        serverGame.serverInfo.normal.push(serverRoomTemp);
        GameConfig.push(serverGame);
        //----------------------百人场_翻硬币--------------
        serverGame = {};
        serverRoomTemp = {};
        serverGame.GameId = 1016;
        serverGame.serverId = 16016;
        serverGame.GameName = "翻硬币";
        serverGame.serverInfo = {};
        //正常
        serverGame.serverInfo.normal = [];
        serverRoomTemp.Server = 1;
        serverRoomTemp.bet = 1;
        serverRoomTemp.Match = 0;
        serverRoomTemp.entryCoin = 100;
        serverRoomTemp.gift = 0;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "16016";
        serverGame.serverInfo.normal.push(serverRoomTemp);
        GameConfig.push(serverGame);
        //----------------------百人场_红黑大战--------------
        serverGame = {};
        serverRoomTemp = {};
        serverGame.GameId = 1018;
        serverGame.serverId = 16018;
        serverGame.GameName = "红黑大战";
        serverGame.serverInfo = {};
        //正常
        serverGame.serverInfo.normal = [];
        serverRoomTemp.Server = 1;
        serverRoomTemp.bet = 1;
        serverRoomTemp.Match = 0;
        serverRoomTemp.entryCoin = 100;
        serverRoomTemp.gift = 0;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "16018";
        serverGame.serverInfo.normal.push(serverRoomTemp);
        GameConfig.push(serverGame);
        //----------------------百人场_百人斗牛--------------
        serverGame = {};
        serverRoomTemp = {};
        serverGame.GameId = 1019;
        serverGame.serverId = 16019;
        serverGame.GameName = "百人斗牛";
        serverGame.serverInfo = {};
        //正常
        serverGame.serverInfo.normal = [];
        serverRoomTemp.Server = 1;
        serverRoomTemp.bet = 1;
        serverRoomTemp.Match = 0;
        serverRoomTemp.entryCoin = 100;
        serverRoomTemp.gift = 0;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "16019";
        serverGame.serverInfo.normal.push(serverRoomTemp);
        GameConfig.push(serverGame);
        //----------------------百人场_神兽大战--------------
        serverGame = {};
        serverRoomTemp = {};
        serverGame.GameId = 1020;
        serverGame.serverId = 16020;
        serverGame.GameName = "百人场_神兽大战";
        serverGame.serverInfo = {};
        //正常
        serverGame.serverInfo.normal = [];
        serverRoomTemp.Server = 1;
        serverRoomTemp.bet = 1;
        serverRoomTemp.Match = 0;
        serverRoomTemp.entryCoin = 100;
        serverRoomTemp.gift = 0;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "16020";
        serverGame.serverInfo.normal.push(serverRoomTemp);
        GameConfig.push(serverGame);
        //----------------------百人场_抢庄百家乐--------------
        serverGame = {};
        serverRoomTemp = {};
        serverGame.GameId = 1021;
        serverGame.serverId = 16021;
        serverGame.GameName = "百人场_抢庄百家乐";
        serverGame.serverInfo = {};
        //正常
        serverGame.serverInfo.normal = [];
        serverRoomTemp.Server = 1;
        serverRoomTemp.bet = 1;
        serverRoomTemp.Match = 0;
        serverRoomTemp.entryCoin = 100;
        serverRoomTemp.gift = 0;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "16021";
        serverGame.serverInfo.normal.push(serverRoomTemp);
        GameConfig.push(serverGame);
//-----------------------------------------------------
//----------------------百人场_俄罗斯轮盘36----------------------------
        serverGame = {};
        serverRoomTemp = {};
        serverGame.GameId = 1022;
        serverGame.serverId = 16022;
        serverGame.GameName = "百人场_俄罗斯轮盘36";
        serverGame.serverInfo = {};
        //正常
        serverGame.serverInfo.normal = [];
        serverRoomTemp.Server = 1;
        serverRoomTemp.bet = 1;
        serverRoomTemp.Match = 0;
        serverRoomTemp.entryCoin = 100;
        serverRoomTemp.gift = 0;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "16022";
        serverGame.serverInfo.normal.push(serverRoomTemp);
        GameConfig.push(serverGame);
//-----------------------------------------------------
//----------------------百人场_百米飞人----------------------------
        serverGame = {};
        serverRoomTemp = {};
        serverGame.GameId = 1023;
        serverGame.serverId = 16023;
        serverGame.GameName = "百人场_百米飞人";
        serverGame.serverInfo = {};
        //正常
        serverGame.serverInfo.normal = [];
        serverRoomTemp.Server = 1;
        serverRoomTemp.bet = 1;
        serverRoomTemp.Match = 0;
        serverRoomTemp.entryCoin = 100;
        serverRoomTemp.gift = 0;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "16023";
        serverGame.serverInfo.normal.push(serverRoomTemp);
        GameConfig.push(serverGame);
//----------------------百人场_7UpDown----------------------------
        serverGame = {};
        serverRoomTemp = {};
        serverGame.GameId = 1024;
        serverGame.serverId = 16024;
        serverGame.GameName = "百人场_7UpDown";
        serverGame.serverInfo = {};
        //正常
        serverGame.serverInfo.normal = [];
        serverRoomTemp.Server = 1;
        serverRoomTemp.bet = 1;
        serverRoomTemp.Match = 0;
        serverRoomTemp.entryCoin = 100;
        serverRoomTemp.gift = 0;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "16024";
        serverGame.serverInfo.normal.push(serverRoomTemp);
        GameConfig.push(serverGame);
//----------------------百人场_西游争霸王者天下----------------------------
        serverGame = {};
        serverRoomTemp = {};
        serverGame.GameId = 1025;
        serverGame.serverId = 16025;
        serverGame.GameName = "西游争霸王者天下";
        serverGame.serverInfo = {};
        //正常
        serverGame.serverInfo.normal = [];
        serverRoomTemp.Server = 1;
        serverRoomTemp.bet = 1;
        serverRoomTemp.Match = 0;
        serverRoomTemp.entryCoin = 1000;
        serverRoomTemp.gift = 0;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "16025";
        serverGame.serverInfo.normal.push(serverRoomTemp);
        GameConfig.push(serverGame);
//----------------------百人场_铁拳6奔驰宝马----------------------------
        serverGame = {};
        serverRoomTemp = {};
        serverGame.GameId = 1026;
        serverGame.serverId = 16026;
        serverGame.GameName = "铁拳6奔驰宝马";
        serverGame.serverInfo = {};
        //正常
        serverGame.serverInfo.normal = [];
        serverRoomTemp.Server = 1;
        serverRoomTemp.bet = 1;
        serverRoomTemp.Match = 0;
        serverRoomTemp.entryCoin = 1000;
        serverRoomTemp.gift = 0;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "16026";
        serverGame.serverInfo.normal.push(serverRoomTemp);
        GameConfig.push(serverGame);

//-----------------------------------------------------
//----------------------百人场_动物跑跑跑----------------------------
        serverGame = {};
        serverRoomTemp = {};
        serverGame.GameId = 1027;
        serverGame.serverId = 16027;
        serverGame.GameName = "动物跑跑跑";
        serverGame.serverInfo = {};
        //正常
        serverGame.serverInfo.normal = [];
        serverRoomTemp.Server = 1;
        serverRoomTemp.bet = 1;
        serverRoomTemp.Match = 0;
        serverRoomTemp.entryCoin = 1000;
        serverRoomTemp.gift = 0;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "16027";
        serverGame.serverInfo.normal.push(serverRoomTemp);
        GameConfig.push(serverGame);

//-----------------------------------------------------
//-----------------------------------------------------
        serverGame = {};
        serverRoomTemp = {};
        serverGame.GameId = 3501;
        serverGame.serverId = 13501;
        serverGame.GameName = "百人场牛牛";
        serverGame.serverInfo = {};
        //正常
        serverGame.serverInfo.normal = [];
        serverRoomTemp.Server = 1;
        serverRoomTemp.bet = 1;
        serverRoomTemp.Match = 0;
        serverRoomTemp.entryCoin = 1000;
        serverRoomTemp.gift = 0;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "13501";
        serverGame.serverInfo.normal.push(serverRoomTemp);
        GameConfig.push(serverGame);

        serverGame = {};
        serverRoomTemp = {};
        serverGame.GameId = 6006;
        serverGame.serverId = 16006;
        serverGame.GameName = "百人场鱼虾蟹";
        serverGame.serverInfo = {};
        //正常
        serverGame.serverInfo.normal = [];
        serverRoomTemp.Server = 1;
        serverRoomTemp.bet = 1;
        serverRoomTemp.Match = 0;
        serverRoomTemp.entryCoin = 1000;
        serverRoomTemp.gift = 0;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "16006";
        serverGame.serverInfo.normal.push(serverRoomTemp);
        GameConfig.push(serverGame);


        serverGame = {};
        serverRoomTemp = {};
        serverGame.GameId = 99999;
        serverGame.serverId = 13900;
        serverGame.GameName = "俱乐部";
        serverGame.serverInfo = {};
        //正常
        serverGame.serverInfo.normal = [];
        serverRoomTemp.Server = 1;
        serverRoomTemp.bet = 1;
        serverRoomTemp.Match = 0;
        serverRoomTemp.entryCoin = 1000;
        serverRoomTemp.gift = 0;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "13900";
        serverGame.serverInfo.normal.push(serverRoomTemp);
        GameConfig.push(serverGame);


        serverGame = {};
        serverRoomTemp = {};
        serverGame.GameId = 67;
        serverGame.serverId = 13851;
        serverGame.GameName = "鱼虾蟹俱乐部";
        serverGame.serverInfo = {};
        //正常
        serverGame.serverInfo.normal = [];
        serverRoomTemp.Server = 1;
        serverRoomTemp.bet = 1;
        serverRoomTemp.Match = 0;
        serverRoomTemp.entryCoin = 1000;
        serverRoomTemp.gift = 0;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "13851";
        serverGame.serverInfo.normal.push(serverRoomTemp);
        GameConfig.push(serverGame);


        serverGame = {};
        serverRoomTemp = {};
        serverGame.GameId = 67;
        serverGame.serverId = 13852;
        serverGame.GameName = "鱼虾蟹金币场";
        serverGame.serverInfo = {};
        //正常
        serverGame.serverInfo.normal = [];
        serverRoomTemp.Server = 1;
        serverRoomTemp.bet = 1;
        serverRoomTemp.Match = 0;
        serverRoomTemp.entryCoin = 1000;
        serverRoomTemp.gift = 0;
        serverRoomTemp.ip = config_ip;
        serverRoomTemp.prot = "13852";
        serverGame.serverInfo.normal.push(serverRoomTemp);
        GameConfig.push(serverGame);
        //==============================================================================================================================================


        //初始
        this.init = function () {

        };

        this.getServerNameById = function (_id) {
            for (var i in GameConfig) {
                if (GameConfig[i].serverId == parseInt(_id)) {
                    return GameConfig[i].GameName
                }


            }
            return GameConfig[0].GameName;
        };

        this.getServerIpById = function (_id) {
            return GameConfig[0].GameId;
        };

        //通过ID获得服务器关键信息
        this.getServerInfoById = function (_id) {
            return GameConfig[_id - 1];
        };

        //获得进场数据
        this.getServerEnterCoinByProt = function (_port) {
            for (var i = 0; i < GameConfig.length; ++i) {
                for (var j = 0; j < GameConfig[i].serverInfo.normal.length; ++j) {
                    if (GameConfig[i].serverInfo.normal[j].prot == _port) {
                        return GameConfig[i].serverInfo.normal[j].entryCoin;
                    }
                }
            }
            return -1;
        };

        this.getServerAll = function () {
            return GameConfig;
        };

        this.socketList = {};

        this.setScoket = function (_idx, _socket) {
            this.socketList[_idx] = _socket;
            _socket.serverGameid = _idx;
        };

        this.getScoket = function (_idx) {
            return this.socketList[_idx];
        };

        this.getScoketList = function () {
            return this.socketList;
        }
        //运行初始化
        this.init();
    }

    if (_serverinfo) {
        return {getInstand: _serverinfo}
    } else {
        console.log("####create ServerInfo!####");
        _serverinfo = new Server();
        return {getInstand: _serverinfo}
    }

}()


module.exports = ServerInfo;

