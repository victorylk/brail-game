/**
 * 购买正版源码请联系微信:jacksun1983,QQ:54893605
 */
cc.Class({
    extends: cc.Component,

    properties: {
        node_Panel: [cc.Node],
        childNum_lab: cc.Label,//下级人数
        childGold_lab: cc.Label,//下级可领收益
        historyGold_lab: cc.Label,//累计收益
        url_lab: cc.Label,//推广url
        url_pic: cc.Sprite,//推广二维码
        id_lab: cc.Label,
        childNum_lab2: cc.Label,//下级人数
        historyGold_lab2: cc.Label,//累计收益
    },

    onLoad() {
        this.netWork = require("LobbyNetWork");
        this.lobbyMain = cc.find('Canvas').getComponent("LobbyMain");
        this.playerInfo = require("PlayerInfo").getInstant;
    },

    start() {
        this.changePanel(null, 0);
    },
    //切换
    changePanel(event, data) {
        let num = parseInt(data);
        for (let i = 0; i < this.node_Panel.length; i++) {
            this.node_Panel[i].active = i == num;
        }
        switch (num) {
            case 0:
                this.sendExtensionStat((data) => {
                    this.childNum_lab.string = data.directly_number;
                    this.childGold_lab.string = data.available.toFixed(2);
                    this.historyGold_lab.string = data.total_profit.toFixed(2);
                });
                break;
            case 1:
                break;
            case 2:
                this.sendExtension((data) => {
                    this.url_lab.string = data.url;
                    this.childNum_lab2.string = data.directly_number;
                    this.id_lab.string = data.id;
                    this.historyGold_lab2.string = data.total_profit.toFixed(2);
                    cc.loader.load({
                        url: data.qrcode,
                        type: 'png'
                    }, (err, texture) => {
                        this.url_pic.spriteFrame = new cc.SpriteFrame(texture);
                    });
                });
                break;
        }
    },
    //关闭当前面板
    closePanel() {
        this.node.active = false;
    },
    //推广界面请求
    sendExtension(callback) {
        let url = this.playerInfo.apiIp + `/api/user/extension`;
        let sendData = "id=" + this.playerInfo.playerId;
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                var response = xhr.response;
                if (null !== xhr.response !== null) {
                    try {
                        response = JSON.parse(response);
                        cc.log(response);
                    }
                    catch (errot) {
                        cc.log("JSON wrong");
                    }
                    if (response.code == 1) {
                        callback && callback(response.data);
                    }
                }
            }
        };

        xhr.open("post", url);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.send(sendData);
    },
    //统计界面请求
    sendExtensionStat(callback) {
        let url = this.playerInfo.apiIp + `/api/user/extensionStat`;
        let sendData = "id=" + this.playerInfo.playerId;
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                var response = xhr.response;
                if (null !== xhr.response !== null) {
                    try {
                        response = JSON.parse(response);
                        cc.log(response);
                    }
                    catch (errot) {
                        cc.log("JSON wrong");
                    }
                    if (response.code == 1) {
                        callback && callback(response.data);
                    }
                }
            }
        };

        xhr.open("post", url);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.send(sendData);
    },
    //领取收益
    getReward() {
        let self = this;
        let url = this.playerInfo.apiIp + `/api/user/extensionReward`;
        let sendData = "id=" + this.playerInfo.playerId;
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                var response = xhr.response;
                if (null !== xhr.response !== null) {
                    try {
                        response = JSON.parse(response);
                        cc.log(response);
                    }
                    catch (errot) {
                        cc.log("JSON wrong");
                    }
                    if (response.code == 1) {
                        self.lobbyMain.showMessagebox_Function("领取成功", 1, 4);
                    }
                }
            }
        };

        xhr.open("post", url);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.send(sendData);
    }
});
