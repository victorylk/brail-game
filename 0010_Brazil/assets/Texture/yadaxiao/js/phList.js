cc.Class({
    extends: cc.Component,

    properties: {
        scrollView: {
        	default: null,
        	type: cc.ScrollView
        },
        itemPrefeb: cc.Prefab,
    },

    start: function () {
        this.init();
        this.item = [];
    },
    init: function () {
        this.itemSlots = [];
        var cfg = require("cfg");
        var http = require("http");
        var self = this;
        var userGetrank = function(ret){
            console.log("成功");
            self.item = ret;
            for (let i = 0; i < self.item.length; ++i) {
                let itemSlot = self.addItemSlot(self.item[i].username,self.item[i].coin,self.item[i].id,self.item[i].weixin,self.item[i].qq,self.item[i].mobile);
                self.itemSlots.push(itemSlot);
            }
        };
        http.createXMLHttpRequest(cfg.cUrl + "USERGETRANK",userGetrank);
    },

    addItemSlot: function (a,b,c,d,e,f) {
        let itemSlot = cc.instantiate(this.itemPrefeb);
        this.scrollView.content.addChild(itemSlot);
        itemSlot.getComponent('phItem').updateItem(a, b, c, d, e, f);
        return itemSlot;
    },
});