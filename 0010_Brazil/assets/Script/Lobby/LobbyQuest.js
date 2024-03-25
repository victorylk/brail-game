/**
 * 购买正版源码请联系微信:jacksun1983,QQ:54893605
 */
cc.Class({
    extends: cc.Component,

    properties: {
        lingqu_btn: cc.Button,
        tasklist: cc.Node
    },

    onLoad() {
        this.netWork = require("LobbyNetWork");
    },

    start() {

    },

    getEveryLoginPrice(data) {
        this.setView(data);
    },

    updatePanel(data, list) {
        for (let i = 0; i < this.tasklist.children.length; i++) {
            this.tasklist.children[i].getChildByName("奖励").getComponent(cc.Label).string = Helper.fixNum(list[i]);
        }
        this.setView(data);
    },

    setView(data) {
        this.data = data;
        this.lingqu_btn.node.active = data.isLingQu != 2;
        this.lingqu_btn.interactable = data.isLingQu == 1;
        for (let i = 0; i < data.num; i++) {
            this.tasklist.children[i].color = new cc.Color(85, 85, 85);;
        }
    },

    lingquClick() {
        this.netWork.socket.emit("getEveryLogin");
    },

    //通用关闭界面
    onBtnClick_closePanel(event) {
        //这里 event 是一个 Touch Event 对象，你可以通过 event.target 取到事件的发送节点
        event.target.parent.active = false;
    },
});
