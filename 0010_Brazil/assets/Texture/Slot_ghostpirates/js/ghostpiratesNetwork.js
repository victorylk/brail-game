cc.Class({
    extends: cc.Component,

    properties: {

    },

    onLoad() {
        this.mainObj = this.node.getComponent('ghostpiratesMain');
        this.playerInfo = require("PlayerInfo").getInstant;
        this.audio = this.node.getComponent('ghostpiratesAudio');

    },

    start() {
        this.url = Lhjconfig.Server_IP + ':15134';
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
            window.ghostpirates_LOBBYNET.disconnect();
            this.socket.emit('LoginfreeCount');
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
        this.socket.on('LoginRoomResult', data => {
            data = this.changeResultJSON_Function(data);
            console.log('LoginRoomResult', data);
        });
        this.socket.on('LoginfreeCountResult', data => {
            data = this.changeResultJSON_Function(data);
            console.log('LoginfreeCountResult:', data);
            if (data.ResultCode == 1 && data.freeCount > 0) {
                this.mainObj.freeTimes = data.freeCount;
                this.mainObj.freeType = data.freeType;
                this.mainObj.closeShine();
                this.mainObj.startFreeGame();
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