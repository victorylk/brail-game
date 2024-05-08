cc.Class({
    extends: cc.Component,

    properties: {

    },

    onLoad() {
        this.mainObj = this.node.getComponent('fortunetigerMain');
        this.audio = this.node.getComponent('fortunetigerAudio');

    },

    start() {
        this.playerInfo = require("PlayerInfo").getInstant;
        this.url = Lhjconfig.Server_IP + ':15168';
        this.socket = io.connect(this.url);
        this.addEvent();
    },

    getBrowserValue: function(value) {
        var params = {}
        var query = window.location.search.substring(1).split("&");
        for (var i = 0; i < query.length; i++) {
            var pair = query[i].split("=");
            if (pair.length == 2) {
                params[pair[0]] = pair[1]
            }
        }
        if (value) {
            return params[value] || null
        }
        return params;
    },

    addEvent() {
        this.socket.on('connected', () => {
            var t = this.getBrowserValue("t")
            this.socket.emit('LoginGame', JSON.stringify({
                userid: this.playerInfo.playerId,
                gametype: null,
                sign: this.playerInfo.gameSign,
                token: t,
                loginIp: this.playerInfo.loginIp
            }));
        });

        this.socket.on('loginGameResult', data => {
            data = this.changeResultJSON_Function(data);
            console.log('LoginGameResult:', data);
            // window.fortunetiger_LOBBYNET.disconnect();
            this.socket.emit('LoginfreeCount', JSON.stringify({
                roomid: window.slotMul
            }));
            if (data.resultid == 1) {
                this.mainObj.setPool(data.Obj.nGamblingWinPool);
            }

            this.playerInfo.playerId = data.Obj.id;
            this.playerInfo.playerName = data.Obj.nickname;
            this.playerInfo.playerCoin = data.Obj.score;            
            this.playerInfo.playerAccount = data.Obj.account;            
            this.playerInfo.win_pool = data.Obj.nGamblingWinPool;
            this.mainObj.slotCtrl.lblUserCoin.string = Helper.fixNum(data.Obj.score);
        });

        this.socket.on('lotteryResult', data => {
            data = this.changeResultJSON_Function(data);
            console.log('lotteryResult:', data);
            if (!!data.ResultCode && data.ResultCode == 1) {
                this.mainObj.lotteryRes = JSON.parse(JSON.stringify(data.ResultData));
                this.mainObj.slotCtrl.lblUserCoin.string = Helper.fixNum(data.ResultData.userscore - data.ResultData.winscore);
                this.mainObj.roll(data.ResultData.viewarray.nHandCards);
            } else {
                this.mainObj.status = 0;
                cc.find("Canvas/com_tishi").active = true;
            }
        });
        this.socket.on('LoginRoomResult', data => {
            data = this.changeResultJSON_Function(data);
            console.log('LoginRoomResult', data);
            // self.canvas.onFreeTime(data.ResultData.freeCount);                    //调用刷新免费次数的方法 
        });
        this.socket.on('LoginfreeCountResult', data => {
            data = this.changeResultJSON_Function(data);
            console.log('LoginfreeCountResult:', data);
            if (data.ResultCode == 1 && data.freeCount > 0) {
                this.mainObj.freeTimes = data.freeCount - 1;
                this.mainObj.closeShine();
                this.mainObj.startFreeGame();
            }
        });
        this.socket.on('pushGamblingWinPool', data => {
            data = this.changeResultJSON_Function(data);
            // console.log('pushGamblingWinPool:', data);
            if (data.ResultCode == 1) {
                this.mainObj.refreshPool(data.nGamblingWinPool);
            }
        });
        this.socket.on('historyResult', data => {
            data = this.changeResultJSON_Function(data);
            console.log('historyResult:', data);
            if (data.ResultCode == 1) {
                this.mainObj.updateRecord(data.Result);
            }
        });

        this.socket.on("loginResult", ret => {
            console.log('返回登陆信息:' + JSON.stringify(ret));
            var result = this.changeResultJSON(ret);
            switch (result.resultid) {
                case -2:
                    this.accountChange = false;
                    switch (this.playerInfo.isAutoLogin) {
                        case 0:
                            break;
                        case 1:
                            // this.lobbyMain.showMessagebox_Function(i18n.t("TIP9_MSG"), 1, 4);
                            break;
                        case 2:
                            // this.lobbyMain.showMessagebox_Function(i18n.t("TIP9_MSG"), 1, 0);
                            break;
                    }
                    break;
                case -1:
                    this.accountChange = false;
                    switch (this.playerInfo.isAutoLogin) {
                        case 0:
                            // this.lobbyMain.showMessagebox_Function(i18n.t("TIP10_MSG"), 1, 0);
                            break;
                        case 1:
                            // this.lobbyMain.showMessagebox_Function(i18n.t("TIP10_MSG"), 1, 4);
                            break;
                        case 2:
                            // this.lobbyMain.showMessagebox_Function(i18n.t("TIP10_MSG"), 1, 0);
                            break;
                    }
                    break;
                case 0:
                    this.accountChange = false;
                    switch (this.playerInfo.isAutoLogin) {
                        case 0:
                            // this.lobbyMain.showMessagebox_Function(i18n.t("TIP11_MSG"), 1, 10);
                            break;
                        case 1:
                            // this.lobbyMain.showMessagebox_Function(i18n.t("TIP12_MSG"), 1, 4);
                            break;
                        case 2:
                            // this.lobbyMain.showMessagebox_Function(i18n.t("TIP11_MSG"), 1, 10);
                            break;
                    }
                    break;
                case 1:
                    this.loginClick = false;
                    this.playerInfo.account = result.Obj.account;
                    // this.playerInfo.password = this.lobbyMain.com_Login.getChildByName("eb_Password").getComponent("cc.EditBox").string;
                    this.playerInfo.loginCode = this.loginCode;
                    this.playerInfo.gameSign = result.Obj.sign;
                    this.playerInfo.playerId = result.Obj.id;
                    this.playerInfo.playerName = result.Obj.nickname;
                    this.playerInfo.playerCoin = result.Obj.score / this.playerInfo.exchangeRate;
                    this.playerInfo.playerDiamond = result.Obj.diamond;
                    this.playerInfo.playerHeadId = result.Obj.headimgurl;
                    this.playerInfo.iosChannel = result.Obj.ChannelType;
                    this.playerInfo.win_pool = result.win_pool;

                    if (result.Obj.proplist[1]) {
                        this.playerInfo.playerGift = result.Obj.proplist[1];
                    } else {
                        this.playerInfo.playerGift = 0;
                    }

                    this.playerInfo.phoneNumber = result.Obj.phoneNo;
                    this.playerInfo.isOffical = result.Obj.official;
                    this.playerInfo.gameDisconnect || (this.playerInfo.gameName = "Lobby");         
                    this.socket.emit("getBankScore")
                    break;
            };            
        });

    },

    changeResultJSON_Function(ret) {
        if (cc.sys.isNative) {
            return JSON.parse(ret);
        }
        return ret;
    },

    onDestroy() {
        this.socket.emit('cleanLineOut');
    }
});