
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
            });
        }

        this.node.getChildByName("icon").on('mouseenter', () => {
            this.favor_node.active = true;
            this.node.getChildByName("icon").scale = 1.1;
        });

        this.node.getChildByName("icon").on('mouseleave', () => {
            this.favor_node.active = false;
            this.node.getChildByName("icon").scale = 1;
        });

        this.favor_node.on('mouseenter', () => {
            this.node.getChildByName("icon").scale = 1.1;
            this.favor_node.active = true;
        });

        this.favor_node.on('mouseleave', () => {
            this.node.getChildByName("icon").scale = 1;
            this.favor_node.active = false;
        });
        this.checkFavorData();
    },
    //动效
    iconAction() {
        let endPos = cc.v2(0, 0);
        this.icon_sp.node.x = 700;
        cc.tween(this.node)
            .to(1, { position: endPos })
            .call(() => {

            })
            .start();
    },
    //保存传入的数据
    setData(data, index) {
        this.index = index;
        this.data = data;
        this.node.gameType = data.gameType;
    },
    //收藏点击
    favorClick() {
        if (this.node.isFavor) {
            this.node.isFavor = 0;
        } else {
            this.node.isFavor = 1;
        }
        this.updateFavorData();
    },
    //更新收藏数据
    updateFavorData() {
        let favorList = this.playerInfo.readData_Function("favorList");
        if (!favorList) {
            favorList = [];
        }
        if (this.node.isFavor) {
            favorList.push(this.node.name);
            this.favor_node.children[0].active = false;
            this.favor_node.children[1].active = true;
        } else {
            for (let i in favorList) {
                if (this.node.name == favorList[i]) {
                    favorList.splice(i, 1);
                    break;
                }
            }
            this.favor_node.children[0].active = true;
            this.favor_node.children[1].active = false;
        }
        this.playerInfo.writeData_Function("favorList", favorList);
    },
    //检查收藏数据
    checkFavorData() {
        let favorList = this.playerInfo.readData_Function("favorList");
        if (!favorList) {
            return;
        }
        this.favor_node.children[0].active = true;
        this.favor_node.children[1].active = false;
        this.node.isFavor = 0;
        for (let i in favorList) {
            if (this.node.name == favorList[i]) {
                this.favor_node.children[0].active = false;
                this.favor_node.children[1].active = true;
                this.node.isFavor = 1;
            }
        }
    },

    onclick(event, customEventData) {
        let tempNetWork = null;
        let lobbySocket = this.canvasNode.getComponent("LobbyMain").netWork.socket;
        // cc.find('Canvas/Loading').active = true;
        switch (this.node.name) {
            default:
                // cc.find('Canvas/Loading').active = false;
                break;
            case "钻石捕鱼":
                this.canvasNode.getComponent("LobbyMain").gameMenuButtonClick_Function("com_Fish");
                break;
            case "海王2":
                this.canvasNode.getComponent("LobbyMain").gameMenuButtonClick_Function("com_Fishhaiwang2");
                break;
            case "海王3阿拉丁":
                this.canvasNode.getComponent("LobbyMain").gameMenuButtonClick_Function("com_Fishhaiwang3alading");
                break;
            case "深海捕鱼":
                this.canvasNode.getComponent("LobbyMain").gameMenuButtonClick_Function("com_Shenhaibuyu");
                break;
            case "雷霆战机":
                this.canvasNode.getComponent("LobbyMain").gameMenuButtonClick_Function("com_Leitingzhanji");
                break;
            case "快乐捕鱼":
                this.canvasNode.getComponent("LobbyMain").gameMenuButtonClick_Function("com_Kuailebuyu");
                break;
            case "疯狂捕鱼":
                this.canvasNode.getComponent("LobbyMain").gameMenuButtonClick_Function("com_Fishfengkuangbuyu");
                break;
            case "二十一点":
                event.currentTarget.getComponent(cc.Button).interactable = false;
                window.BLACKJACK_LOBBYNET = lobbySocket;
                this.QieHuanScene_normal('game_21dian');
                break;
            case "埃及珍宝":
                window.EF_LOBBYNET = lobbySocket;
                this.QieHuanScene2('Slot_EgyptianTreasures');
                break;
            case "阿兹特克":
                window.AZTK_LOBBYNET = lobbySocket;
                this.QieHuanScene2('Slot_aztec');
                break;
            case "阿拉丁":
                window.ALADING_LOBBYNET = lobbySocket;
                this.QieHuanScene2('Slot_Alading');
                break;
            case "WildBullAlo":
                window.WBA_LOBBYNET = lobbySocket;
                this.QieHuanScene2('Slot_WildBuffAlo');
                break;
            case "FireLinkRR":
                window.FLRW_LOBBYNET = lobbySocket;
                this.QieHuanScene2('Slot_FireLinkRiverWalk');
                break;
            case "FireLinkCS":
                window.FLCS_LOBBYNET = lobbySocket;
                this.QieHuanScene2('Slot_FireLinkChinaStreet');
                break;
            case "FireLinkOS":
                window.FLOS_LOBBYNET = lobbySocket;
                this.QieHuanScene2('Slot_FireLinkOlveraStreet');
                break;
            case "FireLinkR66":
                window.FLR66_LOBBYNET = lobbySocket;
                this.QieHuanScene2('Slot_FireLinkRoute66');
                break;
            case "ATT翻牌机":
                window.ATT_LOBBYNET = lobbySocket;
                this.QieHuanScene2('game_ATTlianhuanpao');
                break;
            case "科诺球":
                window.KNQ_LOBBYNET = lobbySocket;
                this.QieHuanScene2('game_realball');
                break;
            case "火凤凰":
                window.HFH_LOBBYNET = lobbySocket;
                this.QieHuanScene2('game_ATThuofenghuang');
                break;
            case "二八杠":
                tempNetWork = require("TwoEightNetWork").getInstant;
                tempNetWork.setLobbyMainObj_Function(this.canvasNode.getComponent("LobbyMain"));
                tempNetWork.loginGame_Function('', 16011, tempNetWork.playerInfo.playerId, tempNetWork.playerInfo.gameSign);
                break;
            case "百家乐":
                tempNetWork = require("baijialeNetWork").getInstant;
                event.currentTarget.getComponent(cc.Button).interactable = false;
                tempNetWork.loginGame_Function('', 16004, tempNetWork.playerInfo.playerId, tempNetWork.playerInfo.gameSign);
                break;
            case "抢庄百家乐":
                tempNetWork = require("baijialeQZNetWork").getInstant;
                event.currentTarget.getComponent(cc.Button).interactable = false;
                tempNetWork.loginGame_Function('', 16021, tempNetWork.playerInfo.playerId, tempNetWork.playerInfo.gameSign);
                break;
            case "动物跑跑跑":
                event.currentTarget.getComponent(cc.Button).interactable = false;
                window.DWPPP_LOBBYNET = lobbySocket;
                this.QieHuanScene_normal('game_dongwupaopaopao');
                break;
            case "百人牛牛":
                tempNetWork = require("bairenniuniuNetWork").getInstant;
                event.currentTarget.getComponent(cc.Button).interactable = false;
                tempNetWork.loginGame_Function('', 13501, tempNetWork.playerInfo.playerId, tempNetWork.playerInfo.gameSign);
                break;
            case "奔驰宝马":
                tempNetWork = require("bcbm_NetWork").getInstant;
                event.currentTarget.getComponent(cc.Button).interactable = false;
                tempNetWork.loginGame_Function('', 16008, tempNetWork.playerInfo.playerId, tempNetWork.playerInfo.gameSign);
                break;
            case "飞禽走兽":
                tempNetWork = require("feiqinzoushou_NetWork").getInstant;
                event.currentTarget.getComponent(cc.Button).interactable = false;
                tempNetWork.loginGame_Function('', 16015, tempNetWork.playerInfo.playerId, tempNetWork.playerInfo.gameSign);
                break;
            case "麻将胡了":
                window.majianghule_LOBBYNET = lobbySocket;
                this.QieHuanScene2('Slot_majianghule');
                break;
            case "麻将胡了PG":
                window.majianghulePG_LOBBYNET = lobbySocket;
                this.QieHuanScene('Slot_majianghulePG');
                break;
            case "冰球突破":
                window.BQTP_LOBBYNET = lobbySocket;
                this.QieHuanScene2('Slot_bingqiutupo');
                break;
            case "冰球突破2":
                window.BQTP2_LOBBYNET = lobbySocket;
                this.QieHuanScene2('Slot_bingqiutupo2');
                break;
            case "熊出没":
                window.BonusBears_LOBBYNET = lobbySocket;
                this.QieHuanScene2('Slot_BonusBears');
                break;
            case "熊出没918":
                window.BonusBears_LOBBYNET = lobbySocket;
                this.QieHuanScene2('Slot_BonusBears');
                break;
            case "财神到":
                window.CSDHY_LOBBYNET = lobbySocket;
                this.QieHuanScene2('Slot_Caishendao');
                break;
            case "财神夺宝":
                window.CSDB_LOBBYNET = lobbySocket;
                this.QieHuanScene2('Slot_Caishenduobao');
                break;
            case "财源滚滚":
                window.CYGG_LOBBYNET = lobbySocket;
                this.QieHuanScene2('Slot_Caiyuangungun');
                break;
            case "PantherQueen":
                window.PantherQueen_LOBBYNET = lobbySocket;
                this.QieHuanScene2('Slot_PantherQueen');
                break;
            case "HerculesSonZeus":
                window.HerculesSonZeus_LOBBYNET = lobbySocket;
                this.QieHuanScene2('Slot_HerculesSonZeus');
                break;
            case "德州扑克":
                if (cc.sys.isNative && this.canvasNode.getComponent("LobbyMain").playerInfo.needToUpdate[7]) {
                    this.canvasNode.getComponent("LobbyMain").checkUpdate_Function("Holdem");
                } else {
                    this.canvasNode.getComponent("LobbyMain").gameMenuButtonClick_Function("com_Holdem");
                }
                break;
            case "斗地主":
                if (cc.sys.isNative && this.canvasNode.getComponent("LobbyMain").playerInfo.needToUpdate[7]) {
                    this.canvasNode.getComponent("LobbyMain").checkUpdate_Function("Land");
                } else {
                    this.canvasNode.getComponent("LobbyMain").gameMenuButtonClick_Function("com_Land");
                }
                break;
            case "俄罗斯轮盘":
                this.canvasNode.getComponent("LobbyMain").loginGameRoom_Function(this, "Roulette");
                break;
            case "俄罗斯轮盘36":
                this.canvasNode.getComponent("LobbyMain").loginGameRoom_Function(this, "Roulette36");
                break;
            case "俄罗斯轮盘36918":
                this.canvasNode.getComponent("LobbyMain").loginGameRoom_Function(this, "Roulette36");
                break;
            case "铁拳6":
                tempNetWork = require("tiequan6_NetWork").getInstant;
                event.currentTarget.getComponent(cc.Button).interactable = false;
                tempNetWork.loginGame_Function('', 16026, tempNetWork.playerInfo.playerId, tempNetWork.playerInfo.gameSign);
                break;
            case "西游争霸王者天下":
                event.currentTarget.getComponent(cc.Button).interactable = false;
                window.XYZBWZTX_LOBBYNET = lobbySocket;
                this.QieHuanScene_normal('Game_xiyouzhengbaWZTX');
                break;
            case "火焰88":
                window.FIRE88_LOBBYNET = lobbySocket;
                this.QieHuanScene2('Slot_Fire88');
                break;
            case "IceStone":
                window.IceStone_LOBBYNET = lobbySocket;
                this.QieHuanScene2('Slot_IceStone');
                break;
            case "大蓝":
                window.GreatBlue_LOBBYNET = lobbySocket;
                this.QieHuanScene2('Slot_GreatBlue');
            case "大蓝918":
                window.GreatBlue_LOBBYNET = lobbySocket;
                this.QieHuanScene2('Slot_GreatBlue');
                break;
            case "红包接龙":
                if (cc.sys.isNative && this.canvasNode.getComponent("LobbyMain").playerInfo.needToUpdate[1]) {
                    this.canvasNode.getComponent("LobbyMain").checkUpdate_Function("Game_hongbao");
                } else {
                    this.canvasNode.getComponent("LobbyMain").gameMenuButtonClick_Function("com_Hongbao");
                }
                break;
            case "皇家赛马":
                event.currentTarget.getComponent(cc.Button).interactable = false;
                window.HJSM_LOBBYNET = lobbySocket;
                this.QieHuanScene_normal('game_saima');
                break;
            case "僵尸先生":
                window.JSXS_LOBBYNET = lobbySocket;
                this.QieHuanScene2('Slot_Jiangshixiansheng');
                break;
            case "金财神":
                window.CAISHEN_LOBBYNET = lobbySocket;
                this.QieHuanScene2('Slot_CaishenGold');
                break;
            case "经典水果机":
                this.QieHuanScene2('game_shuiguoji_shuban');
                break;
            case "精灵女王":
                this.QieHuanScene2('game_jlnw');
                break;
            case "锦衣卫":
                window.JYW_LOBBYNET = lobbySocket;
                this.QieHuanScene2('Slot_Jinyiwei');
                break;
            case "小丑":
                this.QieHuanScene2('Slot_joker');
                break;
            case "连环夺宝":
                window.LHDB_LOBBYNET = lobbySocket;
                this.QieHuanScene_normal('game_Lianhuanduobao');
                break;
            case "铃铛游戏":
                this.QieHuanScene2('game_lingdangyouxi');
                break;
            case "龙虎斗":
                tempNetWork = require("longhudouNetWork").getInstant;
                event.currentTarget.getComponent(cc.Button).interactable = false;
                tempNetWork.loginGame_Function('', 16003, tempNetWork.playerInfo.playerId, tempNetWork.playerInfo.gameSign);
                break;
            case "红黑大战":
                tempNetWork = require("hongheidazhaNetWork").getInstant;
                event.currentTarget.getComponent(cc.Button).interactable = false;
                tempNetWork.loginGame_Function('', 16018, tempNetWork.playerInfo.playerId, tempNetWork.playerInfo.gameSign);
                break;
            case "斗牛":
                tempNetWork = require("douniuNetWork").getInstant;
                event.currentTarget.getComponent(cc.Button).interactable = false;
                tempNetWork.loginGame_Function('', 16019, tempNetWork.playerInfo.playerId, tempNetWork.playerInfo.gameSign);
                break;
            case "德州牛仔":
                tempNetWork = require("DZNZNetWork").getInstant;
                tempNetWork.lobbyMainSocket = lobbySocket;
                event.currentTarget.getComponent(cc.Button).interactable = false;
                tempNetWork.loginGame_Function('', 16010, tempNetWork.playerInfo.playerId, tempNetWork.playerInfo.gameSign);
                break;
            case "翻硬币":
                tempNetWork = require("fanjinbiNetWork").getInstant;
                event.currentTarget.getComponent(cc.Button).interactable = false;
                tempNetWork.loginGame_Function('', 16016, tempNetWork.playerInfo.playerId, tempNetWork.playerInfo.gameSign);
                break;
            case "神兽":
                tempNetWork = require("shenshouNetWork").getInstant;
                event.currentTarget.getComponent(cc.Button).interactable = false;
                tempNetWork.loginGame_Function('', 16020, tempNetWork.playerInfo.playerId, tempNetWork.playerInfo.gameSign);
                break;
            case "斗鸡":
                tempNetWork = require("doujiNetWork").getInstant;
                event.currentTarget.getComponent(cc.Button).interactable = false;
                tempNetWork.loginGame_Function('', 16017, tempNetWork.playerInfo.playerId, tempNetWork.playerInfo.gameSign);
                break;
            case "吕布戏貂蝉":
                window.LBXDC_LOBBYNET = lobbySocket;
                this.QieHuanScene2('Slot_Lvbuxidiaochan');
                break;
            case "沧海遗珠":
                window.canghaiyizhu_LOBBYNET = lobbySocket;
                this.QieHuanScene2('Slot_canghaiyizhu');
                break;
            case "企鹅寻宝":
                window.qiexunbao_LOBBYNET = lobbySocket;
                this.QieHuanScene2('Slot_qiexunbao');
                break;
            case "麻将百乐门":
                window.majianghuanlemen_LOBBYNET = lobbySocket;
                this.QieHuanScene2('Slot_majianghuanlemen');
                break;
            case "纸牌老虎机":
                window.zhipailaohuji_LOBBYNET = lobbySocket;
                this.QieHuanScene2('Slot_zhipailaohuji');
                break;
            case "烈火英雄":
                window.liehuoyingxiong_LOBBYNET = lobbySocket;
                this.QieHuanScene2('Slot_liehuoyingxiong');
                break;
            case "MadameDestiny":
                window.MadameDestiny_LOBBYNET = lobbySocket;
                this.QieHuanScene2('Slot_MadameDestiny');
                break;
            case "美女游泳队":
                window.MNYYD_LOBBYNET = lobbySocket;
                this.QieHuanScene2('Slot_Meinvyouyongdui');
                break;
            case "梦幻女神":
                window.MHNS_LOBBYNET = lobbySocket;
                this.QieHuanScene2('Slot_Menghuannvshen');
                break;
            case "哪吒闹海":
                window.NZNH_LOBBYNET = lobbySocket;
                this.QieHuanScene2('Slot_Nezhanaohai');
                break;
            case "潘金莲":
                window.PJL_LOBBYNET = lobbySocket;
                this.QieHuanScene2('Slot_Panjinlian');
                break;
            case "跑得快":
                if (cc.sys.isNative && this.canvasNode.getComponent("LobbyMain").playerInfo.needToUpdate[7]) {
                    this.canvasNode.getComponent("LobbyMain").checkUpdate_Function("Runing");
                } else {
                    this.canvasNode.getComponent("LobbyMain").gameMenuButtonClick_Function("com_Run");
                }
                break;
            case "抢庄牛牛":
                if (cc.sys.isNative && this.canvasNode.getComponent("LobbyMain").playerInfo.needToUpdate[1]) {
                    this.canvasNode.getComponent("LobbyMain").checkUpdate_Function("GrabBull");
                } else {
                    this.canvasNode.getComponent("LobbyMain").gameMenuButtonClick_Function("com_GrabBull");
                }
                break;
            case "罗马":
                window.ROMA_LOBBYNET = lobbySocket;
                this.QieHuanScene2('Slot_RomeGlory');
                break;
            case "狂热非洲":
                window.Safari_LOBBYNET = lobbySocket;
                this.QieHuanScene2('Slot_Safari');
                break;
            case "狂热非洲918":
                window.Safari_LOBBYNET = lobbySocket;
                this.QieHuanScene2('Slot_Safari');
                break;
            case "三打白骨精":
                window.SDBGJ_LOBBYNET = lobbySocket;
                this.QieHuanScene2('Slot_sandabaigujing');
                break;
            case "森林舞会":
                event.currentTarget.getComponent(cc.Button).interactable = false;
                window.XYZB_LOBBYNET = lobbySocket;
                this.QieHuanScene_normal('game_senlinwuhui');
                break;
            case "上海零零发":
                window.SH00F_LOBBYNET = lobbySocket;
                this.QieHuanScene2('Slot_Shanghai00fa');
                break;
            case "鹰夫人":
                window.YFR_LOBBYNET = lobbySocket;
                this.QieHuanScene2('Slot_Yingfuren');
                break;
            case "招财进宝":
                window.ZCJB_LOBBYNET = lobbySocket;
                this.QieHuanScene2('Slot_Zhaocaijinbao');
                break;
            case "水果机":
                this.QieHuanScene2('game_shuiguoji');
                break;
            case "水果小玛丽":
                window.SGXML_LOBBYNET = lobbySocket;
                this.QieHuanScene2('Slot_Shuiguoxiaomali');
                break;
            case "水果钻石":
                window.DIAMOND_LOBBYNET = lobbySocket;
                this.QieHuanScene2('Slot_DiamondStrike');
                break;
            case "水浒传":
                window.SHZ_LOBBYNET = lobbySocket;
                this.QieHuanScene2('Slot_Shuihuzhuan');
                break;
            case "太极熊猫":
                window.TaijiPanda_LOBBYNET = lobbySocket;
                this.QieHuanScene2('Slot_Taijixiongmao');
                break;
            case "侏罗纪":
                window.trex_LOBBYNET = lobbySocket;
                this.QieHuanScene2('Slot_trex');
                break;
            case "侏罗纪918":
                window.trex_LOBBYNET = lobbySocket;
                this.QieHuanScene2('Slot_trex');
                break;
            case "旺宝":
                window.WB_LOBBYNET = lobbySocket;
                this.QieHuanScene2('Slot_Wangbao');
                break;
            case "万圣节":
                this.QieHuanScene2('game_wsj');
                break;
            case "维加斯之夜":
                window.WJSZY_LOBBYNET = lobbySocket;
                this.QieHuanScene2('Slot_Weijiasizhiye');
                break;
            case "五福临门":
                window.WFLM_LOBBYNET = lobbySocket;
                this.QieHuanScene2('Slot_Wufulinmen');
                break;
            case "西游记":
                window.XYJ_LOBBYNET = lobbySocket;
                this.QieHuanScene2('Slot_Xiyouxi');
                break;
            case "潘金莲GW":
                window.PJLGW_LOBBYNET = lobbySocket;
                this.QieHuanScene2('Slot_PanjinlianGW');
                break;
            case "水果之夏":
                window.SGZX_LOBBYNET = lobbySocket;
                this.QieHuanScene2('Slot_Shuiguozhixia');
                break;
            case "九线拉王":
                window.JXLW_LOBBYNET = lobbySocket;
                this.QieHuanScene2('Slot_9xianlawang');
                break;
            case "八卦2":
                window.BG2_LOBBYNET = lobbySocket;
                this.QieHuanScene2('Slot_Bagua2');
                break;
            case "疯狂小丑":
                window.FKXC_LOBBYNET = lobbySocket;
                this.QieHuanScene2('Slot_Fengkuangxiaochou');
                break;
            case "金库":
                window.JK_LOBBYNET = lobbySocket;
                this.QieHuanScene2('Slot_Jinku');
                break;
            case "大富豪":
                window.DFH_LOBBYNET = lobbySocket;
                this.QieHuanScene2('Slot_Dafuhao');
                break;
            case "goldcup":
                window.goldcup_LOBBYNET = lobbySocket;
                this.QieHuanScene2('Slot_goldcup');
                break;
            case "freespin":
                window.freespin_LOBBYNET = lobbySocket;
                this.QieHuanScene2('Slot_freespin');
                break;
            case "freespin横版":
                window.freespin_LOBBYNET = lobbySocket;
                this.QieHuanScene2('Slot_freespin_L');
                break;
            case "superspin":
                window.superspin_LOBBYNET = lobbySocket;
                this.QieHuanScene2('Slot_superspin');
                break;
            case "jackpotspin":
                window.jackpotspin_LOBBYNET = lobbySocket;
                this.QieHuanScene2('Slot_jackpotspin');
                break;
            case "lucky777":
                window.lucky777_LOBBYNET = lobbySocket;
                this.QieHuanScene2('Slot_lucky777');
                break;
            case "premierleaguestar":
                window.premierleaguestar_LOBBYNET = lobbySocket;
                this.QieHuanScene2('Slot_premierleaguestar');
                break;
            case "luckypoker":
                window.luckypoker_LOBBYNET = lobbySocket;
                this.QieHuanScene2('game_luckypoker');
                break;
            case "ghostpirates":
                window.ghostpirates_LOBBYNET = lobbySocket;
                this.QieHuanScene2('Slot_ghostpirates');
                break;
            case "spinBig":
                window.spinbig_LOBBYNET = lobbySocket;
                this.QieHuanScene2('Slot_spinbig');
                break;
            case "penaltyshooters":
                window.penaltyshooters_LOBBYNET = lobbySocket;
                this.QieHuanScene2('game_penaltyshooters');
                break;
            case "财神发发发":
                window.caishenfafafa_LOBBYNET = lobbySocket;
                this.QieHuanScene2('Slot_caishenfafafa');
                break;
            case "绿叶水果":
                window.lvyeshuiguo_LOBBYNET = lobbySocket;
                this.QieHuanScene2('Slot_lvyeshuiguo');
                break;
            case "法老宝藏":
                window.falaobaozang_LOBBYNET = lobbySocket;
                this.QieHuanScene2('Slot_falaobaozang');
                break;
            case "跳高高":
                window.tiaogaogao_LOBBYNET = lobbySocket;
                this.QieHuanScene2('Slot_tiaogaogao');
                break;
            case "比翼双飞":
                window.biyishuangfei_LOBBYNET = lobbySocket;
                this.QieHuanScene2('Slot_biyishuangfei');
                break;
            case "水果之夏":
                window.SGZX_LOBBYNET = lobbySocket;
                this.QieHuanScene2('Slot_Shuiguozhixia');
                break;
            case "熊猫竹子":
                window.xiongmaozhuzi_LOBBYNET = lobbySocket;
                this.QieHuanScene2('Slot_xiongmaozhuzi');
                break;

            case "西游争霸2":
                event.currentTarget.getComponent(cc.Button).interactable = false;
                window.XYZB_LOBBYNET = lobbySocket;
                this.QieHuanScene_normal('game_xiyouzhengba');
                break;
            case "西游争霸2918":
                event.currentTarget.getComponent(cc.Button).interactable = false;
                window.XYZB_LOBBYNET = lobbySocket;
                this.QieHuanScene_normal('game_xiyouzhengba');
                break;
            case "押大小":
                tempNetWork = require("yadaxiaoNetWork").getInstant;
                event.currentTarget.getComponent(cc.Button).interactable = false;
                tempNetWork.loginGame_Function('', 16005, tempNetWork.playerInfo.playerId, tempNetWork.playerInfo.gameSign);
                break;
            case "ColorGame":
                tempNetWork = require("colorgameNetWork").getInstant;
                event.currentTarget.getComponent(cc.Button).interactable = false;
                tempNetWork.loginGame_Function('', 16014, tempNetWork.playerInfo.playerId, tempNetWork.playerInfo.gameSign);
                break;
            case "UpDown7":
                tempNetWork = require("7UpDownNetWork").getInstant;
                event.currentTarget.getComponent(cc.Button).interactable = false;
                tempNetWork.loginGame_Function('', 16024, tempNetWork.playerInfo.playerId, tempNetWork.playerInfo.gameSign);
                break;
            case "一路发发发":
                window.YLFFF_LOBBYNET = lobbySocket;
                this.QieHuanScene2('Slot_Yilufafafa');
                break;
            case "月光宝盒":
                window.YGBH_LOBBYNET = lobbySocket;
                this.QieHuanScene2('Slot_yueguangbaohe');
                break;
            case "玉蒲团":
                window.YPT_LOBBYNET = lobbySocket;
                this.QieHuanScene2('Slot_Yuputuan');
                break;
            case "玉蒲团2":
                window.YPT2_LOBBYNET = lobbySocket;
                this.QieHuanScene2('Slot_Yuputuan2');
                break;
            case "炸金花":
                if (cc.sys.isNative && this.canvasNode.getComponent("LobbyMain").playerInfo.needToUpdate[7]) {
                    this.canvasNode.getComponent("LobbyMain").checkUpdate_Function("Flower");
                } else {
                    this.canvasNode.getComponent("LobbyMain").gameMenuButtonClick_Function("com_Flower");
                }
                break;
            case "忠肝义胆":
                window.ZGYD_LOBBYNET = lobbySocket;
                this.QieHuanScene2('Slot_Zhongganyidan');
                break;
            case "足球王国":
                this.QieHuanScene2('game_3Dfootball');
                break;
            case "ganeshagold":
                window.ganeshagold_LOBBYNET = lobbySocket;
                this.QieHuanScene('Slot_ganeshagold');
                break;
            case "fortuneox":
                window.fortuneox_LOBBYNET = lobbySocket;
                this.QieHuanScene('Slot_fortuneox');
                break;
            case "fortunetiger":
                window.fortunetiger_LOBBYNET = lobbySocket;
                this.QieHuanScene('Slot_fortunetiger');
                break;
            case "fortunemouse":
                window.fortunemouse_LOBBYNET = lobbySocket;
                this.QieHuanScene('Slot_fortunemouse');
                break;
            case "bikiniparadise":
                window.bikiniparadise_LOBBYNET = lobbySocket;
                this.QieHuanScene('Slot_bikiniparadise');
                break;
            case "fortunerabbit":
                window.fortunerabbit_LOBBYNET = lobbySocket;
                this.QieHuanScene('Slot_fortunerabbit');
                break;
            case "麻将胡了2PG":
                window.majianghule2PG_LOBBYNET = lobbySocket;
                this.QieHuanScene('Slot_majianghule2PG');
                break;
        }
    },

    /**
     * 跳转PG老虎机界面
     */
    QieHuanScene: function (sceneName) {
        if (this.canvasNode.getComponent('LobbyMain').netWork.connected == false) { //判断大厅服务器是否连接
            return;
        }
        cc.find("Canvas/logo_loading").active = true;
        this.scheduleOnce(() => {
            // cc.find("Canvas/logo_loading").active = false;
            cc.loader.loadRes("gameLoading/" + sceneName, function (err, prefab) {
                cc.loader.setAutoReleaseRecursively(prefab, true);
                let newNode = cc.instantiate(prefab);
                cc.find("Canvas").addChild(newNode);
                let loadingNode = newNode;
                loadingNode.active = true; //点亮加载游戏界面
                let progressBarNode = loadingNode.getChildByName('loadingProgressBar');
                let loadTxt = cc.find("pb_Loading_txt", progressBarNode);
                //初始化
                progressBarNode.getComponent(cc.ProgressBar).progress = 0;
                loadTxt.getComponent(cc.Label).string = 0 + "%";
                this.p = 0;
                cc.director.preloadScene(sceneName, (completedCount, totalCount, item) => { //预加载场景&监听加载进度
                    if (this.p < completedCount / totalCount) {
                        let loadProgress = completedCount / totalCount;
                        this.p = loadProgress;
                        progressBarNode.getComponent(cc.ProgressBar).progress = loadProgress;
                        loadTxt.getComponent(cc.Label).string = (loadProgress * 100).toFixed(0) + "%";
                    }
                }, (err, scene) => {
                    // loadingNode.active = false; //隐藏加载游戏界面
                    cc.audioEngine.stopAll();
                    cc.director.loadScene(sceneName);
                });
            }.bind(this));
        }, 3);

    },

    /**
     * 跳转各种老虎机界面
     */
    QieHuanScene2: function (sceneName) {
        if (this.canvasNode.getComponent('LobbyMain').netWork.connected == false) { //判断大厅服务器是否连接
            return;
        }
        var self = this;
        let loadingNode = cc.find('Canvas/Loading');
        loadingNode.active = true; //点亮加载游戏界面
        let progressBarNode = loadingNode.getChildByName('loadingProgressBar');
        let loadTxt = cc.find("pb_Loading_txt", progressBarNode);
        //初始化
        progressBarNode.getComponent(cc.ProgressBar).progress = 0;
        loadTxt.getComponent(cc.Label).string = 0 + "%";
        this.p = 0;
        cc.director.preloadScene(sceneName, (completedCount, totalCount, item) => { //预加载场景&监听加载进度
            if (this.p < completedCount / totalCount) {
                let loadProgress = completedCount / totalCount;
                this.p = loadProgress;
                progressBarNode.getComponent(cc.ProgressBar).progress = loadProgress;
                loadTxt.getComponent(cc.Label).string = (loadProgress * 100).toFixed(2) + "%";
            }
        }, (err, scene) => {
            // loadingNode.active = false; //隐藏加载游戏界面
            cc.audioEngine.stopAll();
            cc.director.loadScene(sceneName);
        });
    },

    /**
     * 普通跳转场景界面
     */
    QieHuanScene_normal(sceneName, cb) {
        let loadingNode = cc.find('Canvas/Loading');
        loadingNode.active = true; //点亮加载游戏界面
        let progressBarNode = loadingNode.getChildByName('loadingProgressBar');
        let loadTxt = cc.find("pb_Loading_txt", progressBarNode);
        //初始化
        progressBarNode.getComponent(cc.ProgressBar).progress = 0;
        loadTxt.getComponent(cc.Label).string = 0 + "%";
        this.p = 0;
        cc.director.preloadScene(sceneName, (completedCount, totalCount, item) => { //预加载场景&监听加载进度
            if (this.p < completedCount / totalCount) {
                let loadProgress = completedCount / totalCount;
                this.p = loadProgress;
                progressBarNode.getComponent(cc.ProgressBar).progress = loadProgress;
                loadTxt.getComponent(cc.Label).string = (loadProgress * 100).toFixed(2) + "%";
            }
        }, (err, scene) => {
            // loadingNode.active = false; //隐藏加载游戏界面
            cc.audioEngine.stopAll();
            cc.director.loadScene(sceneName, cb);
        });
    },


});
