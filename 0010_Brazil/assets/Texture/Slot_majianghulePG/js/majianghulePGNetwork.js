cc.Class({
    extends: cc.Component,

    properties: {

    },

    onLoad() {
        this.mainObj = this.node.getComponent('majianghulePGMain');
        this.playerInfo = require("PlayerInfo").getInstant;
        this.audio = this.node.getComponent('majianghulePGAudio');

    },

    start() {
        this.url = Lhjconfig.Server_IP + ':15169';
        this.socket = io.connect(this.url);
        this.addEvent();
        this.d = {
            "ResultCode": 1,
            "ResultData": {
                "userscore": 98550,
                "winscore": 100,
                "viewarray": [
                    {
                        "nHandCards": [
                            5,
                            4,
                            9,
                            2,
                            2,
                            5,
                            7,
                            5,
                            5,
                            8,
                            5,
                            1,
                            2,
                            8,
                            4,
                            2,
                            2,
                            1,
                            4,
                            4
                        ],
                        "nAllWinLines": [
                            {
                                "win_num": 100,
                                "win_line": [
                                    false,
                                    false,
                                    false,
                                    true,
                                    true,
                                    false,
                                    false,
                                    false,
                                    false,
                                    false,
                                    false,
                                    false,
                                    true,
                                    false,
                                    false,
                                    true,
                                    true,
                                    false,
                                    false,
                                    false
                                ]
                            }
                        ],
                        "nWinLinesDetail": [
                            [
                                15,
                                16,
                                12,
                                3,
                                4
                            ]
                        ],
                        "win": 100,
                        "nWinCards": [
                            false,
                            false,
                            false,
                            true,
                            true,
                            false,
                            false,
                            false,
                            false,
                            false,
                            false,
                            false,
                            true,
                            false,
                            false,
                            true,
                            true,
                            false,
                            false,
                            false
                        ],
                        "getOpenBox": {
                            "bFlag": false,
                            "nWinOpenBox": 0,
                            "win": 0
                        },
                        "getFreeTime": {
                            "bFlag": false,
                            "nFreeTime": 0
                        },
                        "nBetTime": 1692095304524,
                        "goldCards": [
                            1,
                            11,
                            12
                        ]
                    },
                    {
                        "nHandCards": [
                            8,
                            6,
                            9,
                            6,
                            8,
                            5,
                            4,
                            5,
                            5,
                            8,
                            5,
                            7,
                            10,
                            8,
                            4,
                            5,
                            1,
                            1,
                            4,
                            4
                        ],
                        "nAllWinLines": [],
                        "nWinLinesDetail": [],
                        "win": 0,
                        "nWinCards": [],
                        "getOpenBox": {
                            "bFlag": false,
                            "nWinOpenBox": 0,
                            "win": 0
                        },
                        "getFreeTime": {
                            "bFlag": false,
                            "nFreeTime": 0
                        },
                        "nBetTime": 1692095304524,
                        "combo_num": 1,
                        "goldCards": [
                            6,
                            16
                        ]
                    }
                ],
                "winfreeCount": 0,
                "freeCount": 0,
                "getFreeTime": {
                    "bFlag": false,
                    "nFreeTime": 0
                }
            }
        }
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
            window.majianghulePG_LOBBYNET.disconnect();
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
                this.mainObj.slotCtrl.lblUserCoin.string = Helper.fixNum(data.ResultData.userscore - data.ResultData.winscore);
                this.mainObj.pushRollData(data.ResultData.viewarray);
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