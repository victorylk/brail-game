/**
 * 购买正版源码请联系微信:jacksun1983,QQ:54893605
 */
cc.Class({
    extends: cc.Component,

    properties: {

    },

    // onLoad () {},

    start() {
        if (!window.BCNetWork) {
            window.BCNetWork = require("BCNetWork");
            window.BCNetWork.netWorkInit_Function();
        }
    },

});
