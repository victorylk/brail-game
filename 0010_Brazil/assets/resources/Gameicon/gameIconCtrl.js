
cc.Class({
    extends: cc.Component,

    properties: {
        icon_sp: cc.Sprite,//图标
        line_sp: cc.Sprite,//线
        comingsoon: cc.Node,
        favor_node: cc.Node,
    },

    onLoad() {
        this.canvasNode = cc.find("Canvas");
        this.playerInfo = require("PlayerInfo").getInstant;
    },

    start() {
        this.initView();
    },

    update() {
        if (this.language != cc.sys.localStorage.getItem('language')) {
            this.language = cc.sys.localStorage.getItem('language');
            this.ChangeLanguage(this.language);
        }
    },

    ChangeLanguage(language) {
        switch (language) {
            case 'zh':
                this.folder = "icon_zh";
                break;
            case 'fr':
                this.folder = "icon_en";
                break;
            case 'th':
                this.folder = "icon_en";
                break;
            case 'es':
                this.folder = "icon_en";
                break;
            case 'vn':
                this.folder = "icon_en";
                break;
            case 'my':
                this.folder = "icon_en";
                break;
            case 'kp':
                this.folder = "icon_en";
                break;
            case 'in':
                this.folder = "icon_en";
                break;
            case 'id':
                this.folder = "icon_en";
                break;
            case 'en':
                this.folder = "icon_en";
                break;
            default:
                this.folder = "icon_en";
                break;
        }
        let self = this;
        cc.resources.load("Gameicon/" + this.folder + "/" + this.data.iconName, cc.SpriteFrame, function (err, spriteFrame) {
            if (self.icon_sp) {
                self.icon_sp.spriteFrame = spriteFrame;
            }
            // self.iconAction();
        });
    },

    initView() {
        this.node.name = this.index;
        let self = this;
        this.line_sp.node.active = false;
        this.favor_node.active = false;
        this.comingsoon.active = this.data.isFinish == 0;
        if (this.data.gameType == 2) {
            cc.resources.load("Gameicon/line/" + this.data.lineName, cc.SpriteFrame, function (err, spriteFrame) {
                if (self.line_sp) {
                    self.line_sp.spriteFrame = spriteFrame;
                    self.line_sp.node.active = true;
                }