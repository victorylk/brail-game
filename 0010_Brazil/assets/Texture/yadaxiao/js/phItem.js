cc.Class({
    extends: cc.Component,

    properties: {
        //名次
        rankText: cc.Label,
        //昵称
        nickText: cc.Label,
        //金币
        coinText: cc.Label,
        //ID
        idText: cc.Label,
        //微信
        wxText: cc.Label,
        //QQ
        qqText: cc.Label,
        //手机
        phoneText: cc.Label,
    },

    updateItem: function(a, b, c, d, e, f) {
        this.nickText.string = a;
        this.coinText.string = b;
        this.idText.string = "ID:" + c;
        this.wxText.string = "微信:" + d;
        this.qqText.string = "QQ:" + e;
        this.phoneText.string = "手机:" + f;
    },

});