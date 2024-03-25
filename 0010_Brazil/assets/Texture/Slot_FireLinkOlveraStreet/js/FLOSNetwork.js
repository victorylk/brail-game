cc.Class({
    extends: cc.Component,

    properties: {

    },

    onLoad() {
        this.mainObj = this.node.getComponent('FLOSMain');
        this.playerInfo = require("PlayerInfo").getInstant;
        this.audio = this.node.getComponent('FLOSAudio');

    },

    start() {
        this.url = Lhjconfig.Server_IP + ':15123';
        this.socket = io.connect(this.url);
        this.addEvent();
    },


    addEvent() {
        this.socket.on('connected', () => {
            this.socket.emit('LoginGame', JSON.stringify({
                userid: this.playerInfo.playerId,
                gametype: null,
                sign: this.playerInfo.gameSign
            }));
        });

        this.socket.on('loginGameResult', data => {
            data = this.changeResultJSON_Function(data);
            console.log('LoginGameResult:', data);
            window.FLOS_LOBBYNET.disconnect();
            this.socket.emit('LoginfreeCount');
            if (data.resultid == 1) {
                this.mainObj.setPool(data.Obj.nGamblingWinPool);
            }
        });

        this.socket.on('lotteryResult', data => {
            data = this.changeResultJSON_Function(data);
            console.log('lotteryResult:', data);
            if (!!data.ResultCode && data.ResultCode == 1) {
                this.mainObj.lotteryRes = JSON.parse(JSON.stringify(data.ResultData));
                this.mainObj.roll(data.ResultData.viewarray.nHandCards);
            } else {
                this.mainObj.status = 0;
            }
        });
        this.socket.on('bigWinGOResult', data => {
            data = this.changeResultJSON_Function(data);
            console.log('bigWinGOResult:', data);
            if (!!data.ResultCode && data.ResultCode == 1) {
                this.mainObj.bigWinResult = data.ResultData;
                this.mainObj.rollLink();
            }
        });
        this.socket.on('freeTimeTypeResult', data => {
            data = this.changeResultJSON_Function(data);
            console.log('freeTimeTypeResult:', data);
            if (data.ResultCode >= 0) {
                this.mainObj.setTypeResult(data.ResultData);
            }
        });
        this.socket.on('LoginRoomResult', data => {
            data = this.changeResultJSON_Function(data);
            console.log('LoginRoomResult', data);
        });
        this.socket.on('LoginfreeCountResult', data => {
            data = this.changeResultJSON_Function(data);
            console.log('LoginfreeCountResult:', data);
            if (data.ResultCode == 1 && data.freeCount > 0) {
                this.mainObj.freeTimes = data.freeCount - 1;
                this.mainObj.freeType = data.freeType;
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