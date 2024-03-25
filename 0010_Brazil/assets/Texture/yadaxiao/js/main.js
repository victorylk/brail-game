cc.Class({
    extends: cc.Component,

    properties: {
        //下注类型
        xzStyle: cc.Label,
        //通知
        gg: cc.Node,
        //金币数
        coinText: cc.Label,
        //时间
        timeText: cc.Node,
        //用户名
        nameText: cc.Label,
        idText: cc.Label,
        //筹码图片
        cm1: cc.SpriteFrame,
        cm2: cc.SpriteFrame,
        cm3: cc.SpriteFrame,
        cm4: cc.SpriteFrame,
        cm5: cc.SpriteFrame,
        cm6: cc.SpriteFrame,
        cm7: cc.SpriteFrame,
        cm8: cc.SpriteFrame,
        target: cc.Prefab,
        tnum: cc.Prefab,
        father1: cc.Node,
        father2: cc.Node,
        //中部显示
        atext: cc.Label,
        btext: cc.Label,
        ctext: cc.Label,
        dtext: cc.Label,
        //中部选择
        tablett: cc.Node,
        Choose1: cc.Node,
        Choose2: cc.Node,
        //下方选择
        Choose3: cc.Node,
        Choose4: cc.Node,
        Choose5: cc.Node,
        Choose6: cc.Node,
        Choose7: cc.Node,
        Choose8: cc.Node,
        Choose9: cc.Node,
        Choose10: cc.Node,
        //猜大小界面
        guess: cc.Node,
        sz1: cc.Node,
        sz2: cc.Node,
        sz3: cc.Node,
        sz4: cc.Node,
        sz5: cc.Node,
        sz6: cc.Node,
        sz7: cc.Node,
        sz8: cc.Node,
        sz9: cc.Node,
        sz10: cc.Node,
        sz11: cc.Node,
        sz12: cc.Node,
        sz13: cc.Node,
        sz14: cc.Node,
        sz15: cc.Node,
        sz16: cc.Node,
        sz17: cc.Node,
        sz18: cc.Node,
        szdh1: cc.Node,
        szdh2: cc.Node,
        szdh3: cc.Node,
        szText1: cc.Label,
        szText2: cc.Label,
        szText3: cc.Label,
        result: cc.Label,
        //抢庄按钮
        goAct: cc.Node,
        goBtn: cc.Node,
        goBg: cc.Node,
        qzBox: cc.EditBox,
        //上庄
        zname: cc.Label,
        zcoin: cc.Label,
        //往期
        past: cc.Node,
        //赠送
        gift: cc.Node,
        giftUseid: cc.EditBox,
        giftCoin: cc.EditBox,
        //详情
        detail: cc.Node,
        //MUSIC
        bgMusic: 
        {
            type:cc.AudioClip,
            default:null,
        },
        cmMusic: 
        {
            type:cc.AudioClip,
            default:null,
        },
        resultMusic: 
        {
            type:cc.AudioClip,
            default:null,
        },
        waitMusic: 
        {
            type:cc.AudioClip,
            default:null,
        },
        //结算
        resBG: cc.Node,
        bCoin: cc.Label,
        bgCoin: cc.Label,
        sCoin: cc.Label,
        sgCoin: cc.Label,
        zwBG: cc.Node,
        zlBG: cc.Node,
        zwinCoin: cc.Label,
        zwinCoin2: cc.Label,
        zloseCoin: cc.Label,
        zloseCoin2: cc.Label,
        //在线人数
        online: cc.Label,
        onlinex: cc.Label,
        //个人下注金额
        xzText1: cc.Node,
        xzText2: cc.Node,
        //下线提示
        notifyDown: cc.Node,
        notifyText: cc.Label,
        //下注记录
        scrollView: {
        	default: null,
        	type: cc.ScrollView
        },
        itemPrefeb: cc.Prefab,
        //排行榜
        rank: cc.Node,
    },

    onLoad: function () {
        window.yadaxiao_ins = this;
        var self = this;

        this.playerInfo = require("PlayerInfo").getInstant;
        this.playerInfoEx = window.yadaxiao_sc;

        var cfg = require("cfg");
        var http = require("http");
        if (this.playerInfo.musicControl == 1)
            this.current = cc.audioEngine.play(this.bgMusic, true, 0.6);
        this.chip = 100; //倍数
        this.randomRange = cc.p(160, 125);
        this.px = 0;
        this.py = 65;
        this.big = 0;
        this.small = 0;
        this.zhuang = cfg.zhuang;
        this.qzBox.string = cfg.zhuang.toString();
        this.zhname = "无";
        //this.coin = cfg.coin;
        this.coin = this.playerInfoEx.score;
        // if(cc.sys.os == cc.sys.OS_ANDROID || cc.sys.os == cc.sys.OS_IOS){ 
        //     this.nameText.string = "手机专区." + cfg.nickname;
        // }else{
        //     this.nameText.string = "电脑专区." + cfg.nickname;
        // }
        this.nameText.string = this.playerInfoEx.nickname;
        //this.idText.string = "ID:" + cfg.userid;
        this.idText.string = "ID:" + this.playerInfoEx.id;
        this.b100 = 0;
        this.b500 = 0;
        this.b1000 = 0;
        this.b2000 = 0;
        this.b5000 = 0;
        this.b10000 = 0;
        this.b50000 = 0;
        this.b100000 = 0;
        this.bn100 = 0;
        this.bn500 = 0;
        this.bn1000 = 0;
        this.bn2000 = 0;
        this.bn5000 = 0;
        this.bn10000 = 0;
        this.bn50000 = 0;
        this.bn100000 = 0;
        this.b = [];
        this.s100 = 0;
        this.s500 = 0;
        this.s1000 = 0;
        this.s2000 = 0;
        this.s5000 = 0;
        this.s10000 = 0;
        this.s50000 = 0;
        this.s100000 = 0;
        this.sn100 = 0;
        this.sn500 = 0;
        this.sn1000 = 0;
        this.sn2000 = 0;
        this.sn5000 = 0;
        this.sn10000 = 0;
        this.sn50000 = 0;
        this.sn100000 = 0;
        this.s = [];
        this.time = 99999;
        this.a = 1;
        this.b = 1;
        this.c = 1;
        //this.socket = new WebSocket("ws://60.205.191.87:10031/");
        this.socket = require("yadaxiaoNetWork").getInstant;
        setHeadTexture(this.node.getChildByName('head'),this.playerInfoEx.headimgurl);
        this.tp = 1;
        this.person = 0;
        this.key = "";
        //结算数值初始化
        this.resultbt = 0;
        this.resultst = 0;
        this.resultb = 0;
        this.results = 0;
        this.resultzend = 0;
    },
    
    start: function () {
        this.item = [];
        this.itemSlots = [];
        this.prepareWebSocket();

        this.network = require('yadaxiaoNetWork').getInstant;
        this.network.LandlordsSocket.emit('getGameType', '');
    },
    

    init_stat(result){
        var a = 1;
        // if (result.game_type == 1)
        // {
        //     if (result.bet_time == 20)
        //     {
        //         this.betBegin();
        //     }else{
        //         this.bet_text.active = true;
        //         this.m_iGameOverTime = Date.now()/1000+result.bet_time;
        //     }
        //     this.node.getChildByName("anim_wait").active = false;
        //     this.poker_arr[4].opacity = 0;
        //     this.poker_arr[5].opacity = 0;
        // }else 
        // {
        //     this.node.getChildByName("anim_wait").active = true;
        //     for (var i in this.poker_arr)
        //     {
        //         this.poker_arr[i].opacity = 0;
        //     }
        // }

        // for (var i in result.bet_list)
        // {
        //     this.m_lPoolNum[result.bet_list[i].bet_res] = result.bet_list[i].bet_gold;
        // }
        // this.setPoolView();
    },

    update: function (dt) {
        var cfg = require("cfg");
        this.coinText.string = this.coin.toString();
        cfg.zhuang = parseInt(this.qzBox.string);
        if(parseInt(this.qzBox.string) > 1000000){
            this.qzBox.string = "1000000";
        }
        if(this.tp == 1){
            this.goBtn.active = false;
        }
    },
    //长连接
    prepareWebSocket: function () {
        return;
        var self = this;
        var cfg = require("cfg");
        this.socket.onopen = function(evt) {
            console.log("socket已开启");
            //获取金币
            self.socket.send("CMD=USERGETCOIN&USERNAME=" + cfg.username + "&PWD=" + cfg.pwd);
            self.socket.send("CMD=QUERYBANKER");
        };

        this.socket.onmessage = function(evt) {
            var ret = eval("(" + evt.data + ")");
            switch(ret.CMD){
                case "GETCOUNT":
                    self.timeSocket(ret);
                    self.online.string =  "在线人数：" + ret.ONLINECOUNT;
                    self.onlinex.string =  "下注人数：" + ret.XZCOUNT;
                    break;
                case "USERGETCOIN":
                    console.log(evt.data);
                    cfg.coin = ret.COIN;
                    self.coin = ret.COIN;
                    self.socket.send("CMD=GETTOTAL");
                    break;
                case "QUERYBANKER":
                    console.log(evt.data);
                    self.getzhuang(ret);
                    break;
                case "CATCHBANKER":
                    console.log(evt.data);
                    console.log(ret.STATE + "抢庄");
                    break;
                case "GETTOTAL":
                    console.log(evt.data);
                    self.everyBet(ret);
                    self.getDice();
                    break;
                case "USERKEY":
                    self.key = ret.KEY;
                    self.socket.send("CMD=NOTIFYUSER&USERNAME=" + cfg.username + "&KEY=" + self.key);
                    break;
                case "NOTIFYDOWN":
                    self.notifyDown.active = true;
                    console.log("下线通知");
                    self.notifyText.string = "<下线通知>\n您的账号已在其它设备上登录";
                    self.Choose1.getComponent(cc.Button).interactable = false;
                    self.Choose2.getComponent(cc.Button).interactable = false;
                    self.Choose3.getComponent(cc.Button).interactable = false;
                    self.Choose4.getComponent(cc.Button).interactable = false;
                    self.Choose5.getComponent(cc.Button).interactable = false;
                    self.Choose6.getComponent(cc.Button).interactable = false;
                    self.Choose7.getComponent(cc.Button).interactable = false;
                    self.Choose8.getComponent(cc.Button).interactable = false;
                    self.Choose9.getComponent(cc.Button).interactable = false;
                    self.Choose10.getComponent(cc.Button).interactable = false;
                    self.scheduleOnce(function() {
                        self.socket.close();
                        cc.director.loadScene('login');
                    }, 3);
                    break;
                case "QUERYRESULT":
                    self.resultbt = parseInt(ret.BIGTOTAL);
                    self.resultst = parseInt(ret.SMALLTOTAL);
                    self.resultb = parseInt(ret.BIGRESULT);
                    self.results = parseInt(ret.SMALLRESULT);
                    self.resultzend = parseInt(ret.ZJRESULT);
                    console.log(evt.data);
                    break;
                case "SENDDATA":
                    self.gg.active = true;
                    self.gg.getComponent(cc.Label).string = ret.DATA;
                    self.schedule(function() {
                        self.gg.active = false;
                    }, 2);
                    console.log(evt.data);
                    break;
                case "USERBET":
                    console.log(evt.data);
                    self.otherBet(ret);
                    self.init(ret);
                case "GETDICE":
                    self.a = ret.VALUE1;
                    self.b = ret.VALUE2;
                    self.c = ret.VALUE3;
                    console.log(evt.data);
                    break;
                default : 
                    console.log(evt.data);
                    break;
            }
        };

        this.socket.onerror = function(evt) {
            console.log("socket错误");
        };

        this.socket.onclose = function(evt) {
            console.log("socket关闭");
        };
    },
    //获取金币
    getCoin: function () {
        var cfg = require("cfg");
        this.socket.send("CMD=USERGETCOIN&USERNAME=" + cfg.username + "&PWD=" + cfg.pwd);
    },
    //当前时间状态
    timeSocket: function (ret) {
        var cfg = require("cfg");
        // this.timeText.string = ret.COUNT.toString();
        this.timeText.getComponent(cc.Label).string = ret.COUNT.toString();
        switch(ret.TIMETYPE){
            case "QZ":
                this.timeText.active = true;
                if(this.coin > 200000 && this.tp == 0){
                    this.goBtn.active = true;
                }
                this.Choose1.getComponent(cc.Button).interactable = false;
                this.Choose2.getComponent(cc.Button).interactable = false;
                this.xzStyle.string = "正在抢庄";
                break;
            case "SZ":
                this.timeText.active = false;
                this.xzStyle.string = "确认庄家";
                this.Choose1.getComponent(cc.Button).interactable = false;
                this.Choose2.getComponent(cc.Button).interactable = false;
                this.goBtn.active = false;
                this.socket.send("CMD=QUERYBANKER");
                break;
            case "YZ":
                this.timeText.active = true;
                this.xzStyle.string = "下注阶段";
                if(ret.COUNT == ret.YZSJ - 1){
                     this.getDice();
                }
                if(this.atext.string == "999999999"){
                    this.atext.string = "0";
                    this.btext.string = "0";
                    this.ctext.string = this.zhuang;
                    this.dtext.string = this.zhuang;
                }
                this.person += Math.floor(Math.random() * 50); 
                this.onlinex.string =  "下注人数：" + this.person.toString();
                if(this.zhname != cfg.nickname){
                    this.Choose1.getComponent(cc.Button).interactable = true;
                    this.Choose2.getComponent(cc.Button).interactable = true;
                }
                break;
            case "FZ":
                this.timeText.active = false;
                this.xzStyle.string = "停止下注";
                if(ret.COUNT == ret.FZSJ){
                    this.socket.send("CMD=QUERYRESULT&USERNAME=" + cfg.username + "&BIGTOTAL=" + this.big + "&SMALLTOTAL=" + this.small);
                }
                this.Choose1.getComponent(cc.Button).interactable = false;
                this.Choose2.getComponent(cc.Button).interactable = false;
                this.Choose3.getComponent(cc.Button).interactable = false;
                this.Choose4.getComponent(cc.Button).interactable = false;
                this.Choose5.getComponent(cc.Button).interactable = false;
                this.Choose6.getComponent(cc.Button).interactable = false;
                this.Choose7.getComponent(cc.Button).interactable = false;
                this.Choose8.getComponent(cc.Button).interactable = false;
                this.Choose9.getComponent(cc.Button).interactable = false;
                this.Choose10.getComponent(cc.Button).interactable = false;
                break;
            case "KJ":
                this.timeText.active = false;
                this.Choose1.getComponent(cc.Button).interactable = false;
                this.Choose2.getComponent(cc.Button).interactable = false;
                if(ret.COUNT == ret.KJSJ){
                    this.guessBOS();
                }
                if(ret.COUNT == 0){
                    cc.audioEngine.stop(this.current);
                    cc.director.loadScene('table');
                    this.socket.close();
                }
                this.xzStyle.string = "正在开奖";
                break;
        }
    },
    //当前庄家
    getzhuang: function(ret) {
        var cfg = require("cfg");
        if(ret.USERNAME == "null"){
            this.zhname = "无";
            this.zcoin.string = "0";
        }else{
            this.zhname = ret.NICKNAME;
            this.zhuang = ret.COIN;
            this.zcoin.string = this.zhuang.toString();
        }
        this.zname.string = this.zhname;
        if(this.zhname == cfg.nickname){
            this.coin = this.coin - ret.COIN;
        }
    },
    //获取骰子结果
    getDice: function() {
        this.socket.send("CMD=GETDICE");
    },
    //实时获取筹码
    otherBet: function (ret) {
        var cfg = require("cfg");
        this.atext.string = ret.BIGTOTAL;
        this.btext.string = ret.SMALLTOTAL;
        this.ctext.string = this.zhuang + ret.SMALLTOTAL - ret.BIGTOTAL;
        this.dtext.string = this.zhuang + ret.BIGTOTAL - ret.SMALLTOTAL;
        if(this.zhname != cfg.username){
            if((this.zhuang + ret.SMALLTOTAL - ret.BIGTOTAL) <= 0){
                this.Choose1.getComponent(cc.Button).interactable = false;
            }else{
                this.Choose1.getComponent(cc.Button).interactable = true;
            }
            if((this.zhuang + ret.BIGTOTAL - ret.SMALLTOTAL) <= 0){
                this.Choose2.getComponent(cc.Button).interactable = false;
            }else{
                this.Choose2.getComponent(cc.Button).interactable = true;
            }
        }
        if(ret.BIG > 0){
            this.px = -310;
            var node = new cc.Node('Sprite');
            var sp = node.addComponent(cc.Sprite);
            switch(ret.BIG){
                case 100:
                    sp.spriteFrame = this.cm1;
                    break;
                case 500:
                    sp.spriteFrame = this.cm2;
                    break;
                case 2000:
                    sp.spriteFrame = this.cm3;
                    break;
                case 5000:
                    sp.spriteFrame = this.cm4;
                    break;
                case 10000:
                    sp.spriteFrame = this.cm5;
                    break;
                case 50000:
                    sp.spriteFrame = this.cm6;
                    break;
                case 100000:
                    sp.spriteFrame = this.cm7;
                    break;
                default:
                    sp.spriteFrame = this.cm8;
                    var dialogNode = cc.instantiate(this.tnum);
                    dialogNode.color = new cc.Color(0, 0, 0);
                    dialogNode.getComponent(cc.Label).string = ret.BIG;
                    node.addChild(dialogNode);
                    break;
            }
            node.parent = this.tablett;
            node.position = this.getRandomPosition();
            node.width = 50;
            node.height = 50;
        }
        if(ret.SMALL > 0){
            this.px = 310;
            var node = new cc.Node('Sprite');
            var sp = node.addComponent(cc.Sprite);
            switch(ret.SMALL){
                case 100:
                    sp.spriteFrame = this.cm1;
                    break;
                case 500:
                    sp.spriteFrame = this.cm2;
                    break;
                case 2000:
                    sp.spriteFrame = this.cm3;
                    break;
                case 5000:
                    sp.spriteFrame = this.cm4;
                    break;
                case 10000:
                    sp.spriteFrame = this.cm5;
                    break;
                case 50000:
                    sp.spriteFrame = this.cm6;
                    break;
                case 100000:
                    sp.spriteFrame = this.cm7;
                    break;
                default:
                    sp.spriteFrame = this.cm8;
                    var dialogNode = cc.instantiate(this.tnum);
                    dialogNode.color = new cc.Color(0, 0, 0);
                    dialogNode.getComponent(cc.Label).string = ret.SMALL;
                    node.addChild(dialogNode);
                    break;
            }
            node.parent = this.tablett;
            node.position = this.getRandomPosition();
            node.width = 50;
            node.height = 50;
        }
    },
    everyBet: function (ret) {
        var cfg = require("cfg");
        var http = require("http");
        this.atext.string = ret.BIG;
        this.btext.string = ret.SMALL;
        this.ctext.string = this.zhuang + ret.SMALL - ret.BIG;
        this.dtext.string = this.zhuang + ret.BIG - ret.SMALL;
        //自动更新筹码
        this.b100 = ret.BIG100;
        this.b500 = ret.BIG500;
        this.b2000 = ret.BIG2000;
        this.b5000 = ret.BIG5000;
        this.b10000 = ret.BIG10000;
        this.b50000 = ret.BIG50000;
        this.b100000 = ret.BIG100000;
        this.s100 = ret.SMALL100;
        this.s500 = ret.SMALL500;
        this.s2000 = ret.SMALL2000;
        this.s5000 = ret.SMALL5000;
        this.s10000 = ret.SMALL10000;
        this.s50000 = ret.SMALL50000;
        this.s100000 = ret.SMALL100000;
        this.b = [this.b100 - this.bn100,this.b500 - this.bn500,this.b2000 - this.bn2000,this.b5000 - this.bn5000,this.b10000 - this.bn10000,this.b50000 - this.bn50000,this.b100000 - this.bn100000];
        this.s = [this.s100 - this.sn100,this.s500 - this.sn500,this.s2000 - this.sn2000,this.s5000 - this.sn5000,this.s10000 - this.sn10000,this.s50000 - this.sn50000,this.s100000 - this.sn100000];
        //添加大筹码
        for(let i = 0;i < this.b.length;i++){
            for(let j = 0;j < this.b[i];j++){
                this.px = -310;
                var node = new cc.Node('Sprite');
                var sp = node.addComponent(cc.Sprite);
                switch(i){
                case 0:
                    sp.spriteFrame = this.cm1;
                    break;
                case 1:
                    sp.spriteFrame = this.cm2;
                    break;
                case 2:
                    sp.spriteFrame = this.cm3;
                    break;
                case 3:
                    sp.spriteFrame = this.cm4;
                    break;
                case 4:
                    sp.spriteFrame = this.cm5;
                    break;
                case 5:
                    sp.spriteFrame = this.cm6;
                    break;
                case 6:
                    sp.spriteFrame = this.cm7;
                    break;
                }
                node.parent = this.tablett;
                node.position = this.getRandomPosition();
                node.width = 50;
                node.height = 50;
            }
        }
        //添加小筹码
        for(let i = 0;i < this.s.length;i++){
            for(let j = 0;j < this.s[i];j++){
                this.px = 310;
                var node = new cc.Node('Sprite');
                var sp = node.addComponent(cc.Sprite);
                switch(i){
                case 0:
                    sp.spriteFrame = this.cm1;
                    break;
                case 1:
                    sp.spriteFrame = this.cm2;
                    break;
                case 2:
                    sp.spriteFrame = this.cm3;
                    break;
                case 3:
                    sp.spriteFrame = this.cm4;
                    break;
                case 4:
                    sp.spriteFrame = this.cm5;
                    break;
                case 5:
                    sp.spriteFrame = this.cm6;
                    break;
                case 6:
                    sp.spriteFrame = this.cm7;
                    break;
                }
                node.parent = this.tablett;
                node.position = this.getRandomPosition();
                node.width = 50;
                node.height = 50;
            }
        }
        if(this.zhname != cfg.username){
            if((this.zhuang + ret.SMALL - ret.BIG) <= 0){
                this.Choose1.getComponent(cc.Button).interactable = false;
            }else{
                this.Choose1.getComponent(cc.Button).interactable = true;
            }
            if((this.zhuang + ret.big - ret.small) <= 0){
                this.Choose2.getComponent(cc.Button).interactable = false;
            }else{
                this.Choose2.getComponent(cc.Button).interactable = true;
            }
        }
        this.bn100 = ret.BIG100;
        this.bn500 = ret.BIG500;
        this.bn2000 = ret.BIG2000;
        this.bn5000 = ret.BIG5000;
        this.bn10000 = ret.BIG10000;
        this.bn50000 = ret.BIG50000;
        this.bn100000 = ret.BIG100000;
        this.sn100 = ret.SMALL100;
        this.sn500 = ret.SMALL500;
        this.sn2000 = ret.SMALL2000;
        this.sn5000 = ret.SMALL5000;
        this.sn10000 = ret.SMALL10000;
        this.sn50000 = ret.SMALL50000;
        this.sn100000 = ret.SMALL100000;
    // http.createXMLHttpRequest(cfg.cUrl + "GETTOTAL",timedate);
    },
    //100注按钮
    coin100Onclick: function () {
        this.chip = 100;
    },
    //500注按钮
    coin500Onclick: function () {
        this.chip = 500;
    },
    //2000注按钮
    coin2000Onclick: function () {
        this.chip = 2000;
    },
    //5000注按钮
    coin5000Onclick: function () {
        this.chip = 5000;
    },
    //10000注按钮
    coin1WOnclick: function () {
        this.chip = 10000;
    },
    //50000注按钮
    coin5WOnclick: function () {
        this.chip = 50000;
    },
    //100000注按钮
    coin10WOnclick: function () {
        this.chip = 100000;
    },
    //快压按钮
    coin10WOnclick: function () {
        this.chip = this.coin;
    },
    //按钮大小
    bigOnclick: function () {
        //快压
        if(this.playerInfo.soundEffectControl == 1)
           cc.audioEngine.play(this.cmMusic, false, 1);
        if(this.chip == this.coin && this.coin > 0){
            if(this.chip > parseInt(this.ctext.string)){
                this.chip = parseInt(this.ctext.string);
            }
            this.xzText1.active = true;
            this.big = this.big + this.chip;
            this.xzText1.getComponent(cc.Label).string = this.big;
            this.coin = this.coin - this.chip;
            var node = cc.instantiate(this.target);
            node.parent = this.father1;
            var sp = node.getComponent(cc.Sprite);
            sp.spriteFrame = this.cm8;
            node.setPosition(0, 0);
            var cfg = require("cfg");
            this.socket.send("CMD=USERBET&USERNAME=" + cfg.username + "&BIG=" + this.chip + "&SMALL=0");
            this.chip = this.coin;
        }else{
            //普通
            if(this.coin < this.chip || this.chip > parseInt(this.ctext.string)){
                console.log("筹码不足");
            }else{
                this.xzText1.active = true;
                this.big = this.big + this.chip;
                    this.xzText1.getComponent(cc.Label).string = this.big;
                this.coin = this.coin - this.chip;
                    var node = cc.instantiate(this.target);
                node.parent = this.father1;
                var sp = node.getComponent(cc.Sprite);
                switch(this.chip){
                case 100:
                    sp.spriteFrame = this.cm1;
                    break;
                case 500:
                    sp.spriteFrame = this.cm2;
                    break;
                case 2000:
                    sp.spriteFrame = this.cm3;
                    break;
                case 5000:
                    sp.spriteFrame = this.cm4;
                    break;
                case 10000:
                    sp.spriteFrame = this.cm5;
                    break;
                case 50000:
                    sp.spriteFrame = this.cm6;
                    break;
                case 100000:
                    sp.spriteFrame = this.cm7;
                    break;
                }
                node.setPosition(0, 0);
                var cfg = require("cfg");
                this.socket.send("CMD=USERBET&USERNAME=" + cfg.username + "&BIG=" + this.chip + "&SMALL=0");
            }
        }
    },
    smallOnclick: function () {
        //快压
        if(this.chip == this.coin && this.coin > 0){
            if(this.chip > parseInt(this.dtext.string)){
                this.chip = parseInt(this.dtext.string);
            }
            this.xzText2.active = true;
            this.small = this.small + this.chip;
            this.xzText2.getComponent(cc.Label).string = this.small;
            this.coin = this.coin - this.chip;
            var node = cc.instantiate(this.target);
            node.parent = this.father2;
            var sp = node.getComponent(cc.Sprite);
            sp.spriteFrame = this.cm8;
            node.setPosition(0, 0);
            var cfg = require("cfg");
            this.socket.send("CMD=USERBET&USERNAME=" + cfg.username + "&BIG=0" + "&SMALL=" + this.chip);
            this.chip = this.coin;
        }else{
            //普通
            if(this.coin < this.chip || this.chip > parseInt(this.dtext.string)){
                console.log("筹码不足");
            }else{
                this.xzText2.active = true;
                this.small = this.small + this.chip;
                this.xzText2.getComponent(cc.Label).string = this.small;
                this.coin = this.coin - this.chip;
                var node = cc.instantiate(this.target);
                node.parent = this.father2;
                var sp = node.getComponent(cc.Sprite);
                switch(this.chip){
                case 100:
                    sp.spriteFrame = this.cm1;
                    break;
                case 500:
                    sp.spriteFrame = this.cm2;
                    break;
                case 2000:
                    sp.spriteFrame = this.cm3;
                    break;
                case 5000:
                    sp.spriteFrame = this.cm4;
                    break;
                case 10000:
                    sp.spriteFrame = this.cm5;
                    break;
                case 50000:
                    sp.spriteFrame = this.cm6;
                    break;
                case 100000:
                    sp.spriteFrame = this.cm7;
                    break;
                }
                node.setPosition(0, 0);
                var cfg = require("cfg");
                this.socket.send("CMD=USERBET&USERNAME=" + cfg.username + "&BIG=0" + "&SMALL=" + this.chip);
            }
        }
    },
    //获取圆形区域的随机坐标
    getRandomPosition: function() {
        return cc.p(cc.randomMinus1To1() * this.randomRange.x + this.px, cc.randomMinus1To1() * this.randomRange.y + this.py);
    },
    //猜大小逻辑
    guessBOS: function() {
        this.guess.active = true;
        if(this.playerInfo.soundEffectControl == 1)

            cc.audioEngine.play(this.waitMusic, false, 1);
        var self = this;
        var cfg = require("cfg");
        var http = require("http");
        self.scheduleOnce(function() {
            self.szdh1.active = false;
            self.szdh2.active = false;
            self.szdh3.active = false;
            switch(this.a){
                case 1:
                    self.sz1.active = true;
                    self.szText1.string = "1";
                    break;
                case 2:
                    self.sz2.active = true;
                    self.szText1.string = "2";
                    break;
                case 3:
                    self.sz3.active = true;
                    self.szText1.string = "3";
                    break;
                case 4:
                    self.sz4.active = true;
                    self.szText1.string = "4";
                    break;
                case 5:
                    self.sz5.active = true;
                    self.szText1.string = "5";
                    break;
                case 6:
                    self.sz6.active = true;
                    self.szText1.string = "6";
                    break;
            }
            switch(this.b){
                case 1:
                    self.sz7.active = true;
                    self.szText2.string = "1";
                    break;
                case 2:
                    self.sz8.active = true;
                    self.szText2.string = "2";
                    break;
                case 3:
                    self.sz9.active = true;
                    self.szText2.string = "3";
                    break;
                case 4:
                    self.sz10.active = true;
                    self.szText2.string = "4";
                    break;
                case 5:
                    self.sz11.active = true;
                    self.szText2.string = "5";
                    break;
                case 6:
                    self.sz12.active = true;
                    self.szText2.string = "6";
                    break;
            }
            switch(this.c){
                case 1:
                    self.sz13.active = true;
                    self.szText3.string = "1";
                    break;
                case 2:
                    self.sz14.active = true;
                    self.szText3.string = "2";
                    break;
                case 3:
                    self.sz15.active = true;
                    self.szText3.string = "3";
                    break;
                case 4:
                    self.sz16.active = true;
                    self.szText3.string = "4";
                    break;
                case 5:
                    self.sz17.active = true;
                    self.szText3.string = "5";
                    break;
                case 6:
                    self.sz18.active = true;
                    self.szText3.string = "6";
                    break;
            }
            if(this.zhname == cfg.username){
                if(this.a == this.b && this.b == this.c){
                    this.result.string = "本局结果  豹子";
                }else if((this.a+this.b+this.c) <= 10){
                    this.result.string = "本局结果  小";
                }else{
                    this.result.string = "本局结果  大";
                }
                if(this.resultzend > 0){
                    this.scheduleOnce(function() {
                        this.guess.active = false;
                        this.zwBG.active = true;
                        this.zwinCoin.string = this.zhuang.toString();
                        this.zwinCoin2.string = this.resultzend.toString();
                    }, 1);
                }else{
                    this.scheduleOnce(function() {
                        this.guess.active = false;
                        this.zlBG.active = true;
                        this.zloseCoin.string = this.zhuang.toString();
                        this.zloseCoin2.string = this.resultzend.toString();
                    }, 1);
                }
            }else{
                if(this.a == this.b && this.b == this.c){
                    this.result.string = "本局结果  豹子";
                    cfg.coin = this.coin;
                }else{
                    if((this.a+this.b+this.c) <= 10){
                        this.result.string = "本局结果  小";
                        cfg.coin = this.coin;
                    }else{
                        this.result.string = "本局结果  大";
                        cfg.coin = this.coin;
                    }
                }
                this.scheduleOnce(function() {
                    this.guess.active = false;
                    this.resBG.active = true;
                    if(this.playerInfo.soundEffectControl == 1)
                        cc.audioEngine.play(this.resultMusic, false, 1);
                    this.bCoin.string = this.resultbt.toString();
                    this.sCoin.string = this.resultst.toString();
                    if(this.resultb > 0){
                        this.bgCoin.string = "赢得" + this.resultb.toString();
                    }else{
                        this.bgCoin.string = "损失" + this.resultbt.toString();
                    }
                    if(this.results > 0){
                        this.sgCoin.string = "赢得" + this.results.toString();
                    }else{
                        this.sgCoin.string = "损失" + this.resultst.toString();
                    }
                    this.coin = this.coin + this.resultbt + this.resultst + this.resultb + this.results;
                }, 1);
            }
        }, 1);
    },
    //抢庄
    goOnclick: function() {
        this.goBg.active = true;
    },
    btn20: function() {
        this.zhuang = 200000;
    },
    btn50: function() {
        this.zhuang = 500000;
    },
    btn100: function() {
        this.zhuang = 1000000;
    },
    btn150: function() {
        this.zhuang = 1500000;
    },
    btn200: function() {
        this.zhuang = 2000000;
    },
    goClose: function() {
        this.goBg.active = false;
    },
    qiang: function() {
        var self = this;
        var cfg = require("cfg");
        var http = require("http");
        //抢庄
        if(this.coin < this.zhuang){
            this.goBtn.active = false;
        }else{
            this.goBtn.active = false;
            self.tp = 1;
            this.socket.send("CMD=CATCHBANKER&USERNAME=" + cfg.username + "&COIN=" + cfg.zhuang);
        }
    },
    //往期记录
    pastBtn: function () {
        this.past.active = true;
        var a = [];
        var self = this;
        var cfg = require("cfg");
    },
    //关闭往期
    closePast: function () {
        this.past.active = false;
    },
    //赠送
    giftBtn: function () {
        this.gift.active = true;
    },
    giftSend: function () {
        var self = this;
        var cfg = require("cfg");
        var http = require("http");
        var givecoin = function(ret){
            self.notifyDown.active = true;
            if(ret.state == "ok"){
                self.coin = self.coin - self.giftCoin.string;
                self.notifyText.string = "赠送成功!";
            }else{
                self.notifyText.string = "赠送失败！\n请确认输入的金额或者ID是否正确";
            }
            self.scheduleOnce(function() {
                self.notifyDown.active = false;
            }, 2);
            self.gift.active = false;
        };
        http.createXMLHttpRequest(cfg.webUrl + "givecoin?myid=" + cfg.userid + "&youname=" + this.giftUseid.string + "&coin=" + this.giftCoin.string,givecoin);
    },
    closeGift: function () {
        this.gift.active = false;
    },
    //详情
    detailsBtn: function () {
        this.detail.active = true;
    },
    closeDetail: function () {
        this.detail.active = false;
    },
    //排行榜
    rankBtn: function () {
        this.rank.active = true;
    },
    
    closeRank: function () {
        this.rank.active = false;
    },
    
    init: function (ret) {
        this.item = ret;
        let itemSlot = this.addItemSlot(ret.NICKNAME,ret.BIG,ret.SMALL);
        this.itemSlots.push(itemSlot);
    },

    addItemSlot: function (a,b,c) {
        let itemSlot = cc.instantiate(this.itemPrefeb);
        this.scrollView.content.addChild(itemSlot);
        itemSlot.getComponent('xzItem').updateItem(a, b, c);
        return itemSlot;
    },

    quit()
    {
        var ins = require("yadaxiaoNetWork").getInstant;
        ins.LandlordsSocket.disconnect();
        cc.director.loadScene(window.hallName);
    },
});
