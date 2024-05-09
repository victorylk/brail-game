cc.Class({
    extends: cc.Component,

    properties: {

    },

    onLoad() {
        this.mainObj = this.node.getComponent('fortunerabbitMain');
        this.playerInfo = require("PlayerInfo").getInstant;
        this.audio = this.node.getComponent('fortunerabbitAudio');

    },

    start() {
        this.url = Lhjconfig.Server_IP + ':15170';
        this.socket = io.connect(this.url);
        this.addEvent();
    },

    getUrlCode_Function(name) {
        var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
        var result = window.location.search.substr(1).match(reg);
        return result ? decodeURIComponent(result[2]) : null;
    },

    addEvent() {
        this.socket.on('connected', () => {
            let t = this.getUrlCode_Function('t')
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
            // window.fortunerabbit_LOBBYNET.disconnect();
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