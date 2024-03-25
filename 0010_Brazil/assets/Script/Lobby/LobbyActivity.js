/**
 * 购买正版源码请联系微信:jacksun1983,QQ:54893605
 */
cc.Class({
    extends: cc.Component,

    properties: {

    },

    onLoad() {
        this.netWork = require("LobbyNetWork");
    },

    start() {

    },
    //关闭当前面板
    closePanel() {
        this.node.active = false;
    },
});
