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
        // this.init();
        this.item = [];
    },
    init: function () {
        this.itemSlots = [];
        var cfg = require("cfg");
        var http = require("http");
        var self = this;
        var xiazhu = function(ret){
            console.log("成功");
            self.item = ret;
            for (let i = 0; i < self.item.length; ++i) {
                let itemSlot = self.addItemSlot(self.item[i].username,self.item[i].big,self.item[i].small);
                self.itemSlots.push(itemSlot);
            }
        };
        http.createXMLHttpRequest(cfg.webUrl + "getbetlist",xiazhu);
    },

    addItemSlot: function (a,b,c) {
        let itemSlot = cc.instantiate(this.itemPrefeb);
        this.scrollView.content.addChild(itemSlot);
        itemSlot.getComponent('xzItem').updateItem(a, b, c);
        return itemSlot;
    },

});