cc.Class({
    extends: cc.Component,

    properties: {

    },

    onLoad() {
        this.mainObj = this.node.getComponent('luckypokerMain');
        this.playerInfo = require("PlayerInfo").getInstant;
        this.audio = this.node.getComponent('luckypokerAudio');

    },

    start() {
        this.url = Lhjconfig.Server_IP + ':15302';
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
            window.luckypoker_LOBBYNET.disconnect();
            this.mainObj.refreshChip(data.Obj.betList);
            this.mainObj.refreshPool(data.Obj.virPool);
        });

        this.socket.on('lotteryResult', data => {
            data = this.changeResultJSON_Function(data);
            console.log('lotteryResult:', data.ResultData);
            if (!!data.ResultCode && data.ResultCode == 1) {
                this.mainObj.lotteryRes = JSON.parse(JSON.stringify(data.ResultData));
                this.mainObj.money = data.ResultData.userscore;
                this.mainObj.openCards(data.ResultData.viewarray);
            } else {
                this.mainObj.setBtnState(false);
            }
        });

        this.socket.on('settlementResult', data => {
            data = this.changeResultJSON_Function(data);
            console.log('settlementResult:', data);
            if (data.ResultCode == 1) {
                this.mainObj.startNewTurn(data.score);
            }
        });

        this.socket.on('LoginRoomResult', data => {
            data = this.changeResultJSON_Function(data);
            console.log('LoginRoomResult', data);
            // self.canvas.onFreeTime(data.ResultData.freeCount);                    //调用刷新免费次数的方法 
        });

        this.socket.on('pushVirPool', data => {
            data = this.changeResultJSON_Function(data);
            // console.log('pushGamblingWinPool:', data);
            if (data.ResultCode == 1) {
                this.mainObj.refreshPool(data.virPool);
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