cc.Class({
    extends: cc.Component,

    properties: {
        word: cc.Label,
    },

    updateItem: function(name, big, small) {
        this.word.string = "[" + name + "]" + "下注" + big + "大" + small + "小";
    },
});
