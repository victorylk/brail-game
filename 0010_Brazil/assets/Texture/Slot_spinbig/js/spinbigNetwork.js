cc.Class({
    extends: cc.Component,

    properties: {

    },

    onLoad() {
        this.mainObj = this.node.getComponent('spinbigMain');
        this.playerInfo = require("PlayerInfo").getInstant;
        this.audio = this.node.getComponent('spinbigAudio');

    },

    start() {
        this.url = Lhjconfig.Server_IP + ':15135';
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
            if (!!data.resultid && data.resultid == 1) {
                this.mainObj.init(data.Obj);
                this.mainObj.setPool(data.Obj.nGamblingWinPool);
            }
            window.spinbig_LOBBYNET.disconnect();
            this.socket.emit('LoginfreeCount');
        });

        this.socket.on('lotteryResult', data => {
            data = this.changeResultJSON_Function(data);
            console.log('lotteryResult:', data);
            if (!!data.ResultCode && data.ResultCode == 1) {
                this.mainObj.lotteryRes = JSON.parse(JSON.stringify(data.ResultData));
                this.mainObj.roll(data.ResultData.viewarray);
            } else {
                this.mainObj.status = 0;
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
                this.mainObj.freeTimes = data.freeCount;
                this.mainObj.closeShine();
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