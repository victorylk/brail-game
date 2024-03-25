/**
 * 大厅按钮管理类
 * 购买正版源码请联系微信:jacksun1983,QQ:54893605
 */
cc.Class({
    extends: cc.Component,

    properties: {
        com_GameMenu: {
            default: null,
            type: cc.Node
        },
        gameIconPb: cc.Prefab,//游戏图标
    },
    onLoad: function () {
        this.playerInfo = this.node.getComponent("LobbyMain").playerInfo;
        this.lightTime = new Array(3);
        for (var i = 0; i < this.lightTime.length; i++) {
            this.lightTime[i] = this.getRandom_Function(2, 5);
        }
        this.iconInit_Function();
    },
    //设置icon初始化
    iconInit_Function: function () {
        let gameConfig = require("gameConfig_all");
        let menuList = this.com_GameMenu.getChildByName("Game_lconlist_box").getChildByName("Game_iconlist");
        for (let i in gameConfig) {
            if (gameConfig[i].isShow) {
                let newNode = cc.instantiate(this.gameIconPb);
                newNode.getComponent("gameIconCtrl").setData(gameConfig[i], i);
                menuList.addChild(newNode);
            }
        }
        let i = 0;
        // cc.tween(this.node)
        //     .delay(0.1)
        //     .call(() => {
        //         menuList.children[i].getComponent("gameIconCtrl").iconAction();
        //         i = i + 1;
        //     })
        //     .repeat(menuList.children.length)
        //     .start();
    },
    /**
     * 按钮上显示更新图标
     */
    needToUpdate_Function: function () {
        var menuList = this.com_GameMenu.getChildByName("Game_iconlistz");
        //在按钮上显示更新图标
        for (var i = 1; i < this.playerInfo.needToUpdate.length; i++) {
            if (this.playerInfo.needToUpdate[i]) {
                menuList.children[i + 3].children[0].active = true;
            }
            else {
                menuList.children[i + 3].children[0].active = false;
            }
        }
    },
    /**
     * 初始化大厅游戏按钮
     * @param {*} info 
     */
    gameMenuInit_Function: function (info) {
        this.com_GameMenu.active = true;
        console.log("game menu init gameInfo: ", info);
        //按钮列表
        var menuList = this.com_GameMenu.getChildByName("Game_lconlist_box").getChildByName("Game_iconlist")
        menuList.getChildByName("钻石捕鱼") && this.gameMenuButtonInit_Function(info[0], menuList.getChildByName("钻石捕鱼"), this.com_GameMenu.getChildByName("com_Fish"), 0);
        menuList.getChildByName("海王2") && this.gameMenuButtonInit_Function(info[1], menuList.getChildByName("海王2"), this.com_GameMenu.getChildByName("com_Fishhaiwang2"), 0);
        menuList.getChildByName("红包接龙") && this.gameMenuButtonInit_Function(info[3], menuList.getChildByName("红包接龙"), this.com_GameMenu.getChildByName("com_Hongbao"), 0);
        menuList.getChildByName("抢庄牛牛") && this.gameMenuButtonInit_Function(info[5], menuList.getChildByName("抢庄牛牛"), this.com_GameMenu.getChildByName("com_GrabBull"), 0);
        menuList.getChildByName("斗地主") && this.gameMenuButtonInit_Function(info[7], menuList.getChildByName("斗地主"), this.com_GameMenu.getChildByName("com_Land"), 0);
        menuList.getChildByName("跑得快") && this.gameMenuButtonInit_Function(info[8], menuList.getChildByName("跑得快"), this.com_GameMenu.getChildByName("com_Run"), 0);
        menuList.getChildByName("德州扑克") && this.gameMenuButtonInit_Function(info[9], menuList.getChildByName("德州扑克"), this.com_GameMenu.getChildByName("com_Holdem"), 0);
        menuList.getChildByName("炸金花") && this.gameMenuButtonInit_Function(info[10], menuList.getChildByName("炸金花"), this.com_GameMenu.getChildByName("com_Flower"), 0);
		menuList.getChildByName("深海捕鱼") && this.gameMenuButtonInit_Function(info[11], menuList.getChildByName("深海捕鱼"), this.com_GameMenu.getChildByName("com_Shenhaibuyu"), 0);
		menuList.getChildByName("雷霆战机") && this.gameMenuButtonInit_Function(info[12], menuList.getChildByName("雷霆战机"), this.com_GameMenu.getChildByName("com_Leitingzhanji"), 0);
		menuList.getChildByName("快乐捕鱼") && this.gameMenuButtonInit_Function(info[13], menuList.getChildByName("快乐捕鱼"), this.com_GameMenu.getChildByName("com_Kuailebuyu"), 0);
        menuList.getChildByName("海王3阿拉丁") && this.gameMenuButtonInit_Function(info[14], menuList.getChildByName("海王3阿拉丁"), this.com_GameMenu.getChildByName("com_Fishhaiwang3alading"), 0);
        menuList.getChildByName("疯狂捕鱼") && this.gameMenuButtonInit_Function(info[15], menuList.getChildByName("疯狂捕鱼"), this.com_GameMenu.getChildByName("com_Fishfengkuangbuyu"), 0);
    },

    /**
     * 初始化选场按钮
     * @param {*} data 
     * @param {*} btNode 
     * @param {*} comNode 
     * @param {*} type 
     * @param {*} index 
     */
    gameMenuButtonInit_Function: function (data, btNode, comNode, type, index) {
        //cc.log('初始化选场按钮:' + type  + ',按钮===========================' + btNode.getComponent("cc.Button"));
        //console.log("游戏信息：",data.GameId,"房间信息：",data.serverInfo.normal,"游戏按钮：",btNode,"type:",type);
        if (!cc.isValid(btNode)) return;
        switch (type) {
            case 0://第一个子节点为背景图
                for (var i = 0; i < data.serverInfo.normal.length; i++) {
                    if (!comNode.children[i + 1]) break;
                    comNode.children[i + 1].gameId = data.GameId;
                    comNode.children[i + 1].ip = data.serverInfo.normal[i].ip;
                    comNode.children[i + 1].prot = data.serverInfo.normal[i].prot;
                    comNode.children[i + 1].entryCoin = data.serverInfo.normal[i].entryCoin;
                    comNode.children[i + 1].server = data.serverInfo.normal[i].Server;
                    comNode.children[i + 1].bet = data.serverInfo.normal[i].bet;
                    comNode.children[i + 1].getChildByName("lb_Bet").getComponent(cc.Label).string = (data.serverInfo.normal[i].bet / this.playerInfo.exchangeRate).toFixed(2);
                    comNode.children[i + 1].getChildByName("lb_EntryCoin").getComponent(cc.Label).string = (data.serverInfo.normal[i].entryCoin / this.playerInfo.exchangeRate).toFixed(2);
                    comNode.children[i + 1].getChildByName("lb_PlayerNum").getComponent(cc.Label).string = "良好";
                    comNode.children[i + 1].getComponent(cc.Button).interactable = true;
                }
                break;
            case 1:
                btNode.gameId = data.GameId;
                btNode.ip = data.serverInfo.normal[0].ip;
                btNode.prot = data.serverInfo.normal[0].prot;
                btNode.entryCoin = data.serverInfo.normal[0].entryCoin;
                btNode.server = data.serverInfo.normal[0].Server;
                btNode.bet = data.serverInfo.normal[0].bet;
                btNode.getComponent(cc.Button).interactable = true;
                break;
            case 2:
                btNode.gameId = data.GameId;
                btNode.ip = data.serverInfo.normal[index].ip;
                btNode.prot = data.serverInfo.normal[index].prot;
                btNode.entryCoin = data.serverInfo.normal[index].entryCoin;
                btNode.server = data.serverInfo.normal[index].Server;
                btNode.bet = data.serverInfo.normal[index].bet;
                btNode.getChildByName("lb_Bet").getComponent(cc.Label).string = (data.serverInfo.normal[index].bet / this.playerInfo.exchangeRate).toFixed(2);
                btNode.getChildByName("lb_EntryCoin").getComponent(cc.Label).string = (data.serverInfo.normal[index].entryCoin / this.playerInfo.exchangeRate).toFixed(2);
                btNode.getComponent(cc.Button).interactable = true;
                break;
        }
    },

    /**
     * 更新
     * @param {*} dt 
     */
    update: function (dt) {

    },

    /**
     * 获得范围随机数
     * @param {*} min 
     * @param {*} max 
     */
    getRandom_Function: function (min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
});