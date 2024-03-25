cc.Class({
    extends: cc.Component,

    properties: {
        Btn_start: {
            default: null,
            type: cc.Node,
            displayName: '开始按钮',
        },
        spin_Sp: {
            default: [],
            type: [cc.SpriteFrame],
            displayName: '旋转图片',
        },
        spin_AnimNode: cc.Node,
        Btn_stopAuto: {
            default: null,
            type: cc.Node,
            displayName: '自动次数按钮',
        },
        Btn_free: {
            default: null,
            type: cc.Node,
            displayName: '免费按钮',
        },
        Btn_add: {
            default: null,
            type: cc.Node,
            displayName: '加注',
        },
        Btn_sub: {
            default: null,
            type: cc.Node,
            displayName: '减注',
        },
        Btn_auto: {
            default: null,
            type: cc.Node,
            displayName: '自动面板',
        },
        Btn_set: {
            default: null,
            type: cc.Node,
            displayName: '设置',
        },
        Auto_panel: {
            default: null,
            type: cc.Node,
            displayName: '自动面板',
        },
        betting_panel: {
            default: null,
            type: cc.Node,
            displayName: '下注面板',
        },
        Setting_panel: {
            default: null,
            type: cc.Node,
            displayName: '设置面板',
        },
        coin_panel: {
            default: null,
            type: cc.Node,
            displayName: '金币面板',
        },
        chooseBet_panel: {
            default: null,
            type: cc.Node,
            displayName: '下注面板',
        },
        spUserFace: {
            default: null,
            type: cc.Sprite,
            displayName: '用户头像',
        },
        lblUserName: {
            default: null,
            type: cc.Label,
            displayName: '用户名',
        },
        lblUserCoin: {
            default: null,
            type: cc.Label,
            displayName: '用户金币',
        },
        lblUserCoin2: {
            default: null,
            type: cc.Label,
            displayName: '用户金币2',
        },
        lblUserCoin3: {
            default: null,
            type: cc.Label,
            displayName: '用户金币3',
        },
        lblLines: {
            default: null,
            type: cc.Label,
            displayName: '线数',
        },
        lblCurBet: {
            default: null,
            type: cc.Label,
            displayName: '本局总注',
        },
        lblCurBet2: {
            default: null,
            type: cc.Label,
            displayName: '本局总注2',
        },
        lblCurBet3: {
            default: null,
            type: cc.Label,
            displayName: '本局总注3',
        },
        jackpot_lab: {
            default: null,
            type: cc.Label,
            displayName: '奖池',
        },
        winCoin_lab: {
            default: null,
            type: cc.Label,
            displayName: '赢钱金额',
        },
        winCoin_lab2: {
            default: null,
            type: cc.Label,
            displayName: '赢钱金额2',
        },
        winCoin_lab3: {
            default: null,
            type: cc.Label,
            displayName: '赢钱金额3',
        },
        bigWinCoin_lab: {
            default: null,
            type: cc.Label,
            displayName: '大奖赢钱金额',
        },
        stateNode: {
            default: null,
            type: cc.Node,
            displayName: '状态节点',
        },
        bigWinNode: {
            default: null,
            type: cc.Node,
            displayName: '大奖节点',
        },
        chooseAutoNum_lab: {
            default: null,
            type: cc.Label,
            displayName: '自动次数',
        },
        chooseBet_list1: {
            default: null,
            type: cc.Node,
            displayName: '下注滑动组件1',
        },
        chooseBet_list2: {
            default: null,
            type: cc.Node,
            displayName: '下注滑动组件2',
        },
        chooseBet_list3: {
            default: null,
            type: cc.Node,
            displayName: '下注滑动组件3',
        },
        chooseBet_pb: {
            default: null,
            type: cc.Prefab,
            displayName: '下注数字',
        },
        chooseTotalBet_pb: {
            default: null,
            type: cc.Prefab,
            displayName: '下注总计数字',
        },
        musicBtn: cc.Node,//音乐
        sp_settingControl: [cc.SpriteFrame],
        speedBtn: cc.Node,//极速
        sp_speed: [cc.SpriteFrame],
    },

    start() {
        this.playerInfo = require("PlayerInfo").getInstant;
        Helper.loadHead(this.playerInfo.playerHeadId, sp => {
            this.spUserFace.spriteFrame = sp;
        });
        this.lblUserName.string = this.playerInfo.playerName;
        this.lblUserCoin.string = Helper.tofixNum(this.playerInfo.playerCoin);
        this.Setting_panel.opacity = 0;
        this.autoNum = 0;//自动次数
        this.isPanelAnim = false;
        this.isSpeed = false;
        this.settingInit_Function();
    },

    init(obj) {
        this.mainJs = obj;
        this.winCoin_lab.string = "0.00";
    },

    update() {
        this.lblUserCoin2.string = this.lblUserCoin.string;
        this.lblCurBet2.string = this.lblCurBet.string;
        this.winCoin_lab2.string = this.winCoin_lab.string;
        if (!this.lblUserCoin3) {
            return;
        }
        this.lblUserCoin3.string = this.lblUserCoin.string;
        this.lblCurBet3.string = this.lblCurBet.string;
        this.winCoin_lab3.string = this.winCoin_lab.string;
    },
    //初始化下注弹板数据
    initBetContent(numList, betList, line) {
        this.numList = numList;
        this.betList = betList;
        this.line = line;
        this.val1 = this.numList[0];
        this.val2 = this.betList[0];
        this.val3 = this.numList[0] * this.betList[0] * this.line;

        let c1 = this.chooseBet_list1.getComponent(cc.PageView).content;
        c1.removeAllChildren();
        for (let i = 0; i < numList.length; i++) {
            let newNode = cc.instantiate(this.chooseBet_pb);
            newNode.children[0].active = (i == 0);
            newNode.children[1].active = (i == numList.length - 1);
            newNode.getComponent(cc.Label).string = "R$" + Helper.fixNum(numList[i]);
            newNode.valNum = numList[i];
            c1.addChild(newNode);
        }

        let c2 = this.chooseBet_list2.getComponent(cc.PageView).content;
        c2.removeAllChildren();
        for (let i = 0; i < betList.length; i++) {
            let newNode = cc.instantiate(this.chooseBet_pb);
            newNode.children[0].active = false;
            newNode.children[1].active = false;
            newNode.getComponent(cc.Label).string = betList[i];
            newNode.valNum = betList[i];
            c2.addChild(newNode);
        }
        //动态计算第三列的值
        let list = [];
        for (let i = 0; i < numList.length; i++) {
            for (let j = 0; j < betList.length; j++) {
                list.push(numList[i] * betList[j] * line);
            }
        }
        let sumList = Array.from(new Set(list));
        sumList.sort((a, b) => {
            return a - b;
        });
        this.sumList = sumList;
        let c3 = this.chooseBet_list3.getComponent(cc.PageView).content;
        c3.removeAllChildren();
        for (let i = 0; i < sumList.length; i++) {
            let newNode = cc.instantiate(this.chooseTotalBet_pb);
            newNode.children[0].active = (i == 0);
            newNode.children[1].active = (i == sumList.length - 1);
            newNode.getComponent(cc.Label).string = "R$" + Helper.fixNum(sumList[i]);
            newNode.valNum = sumList[i];
            c3.addChild(newNode);
        }

        this.chooseBet_list1.on('page-turning', this.cb_pt1, this);
        this.chooseBet_list2.on('page-turning', this.cb_pt2, this);
        this.chooseBet_list3.on('page-turning', this.cb_pt3, this);
    },

    cb_pt1: function (pageView) {
        let c3 = this.chooseBet_list3.getComponent(cc.PageView).content;
        this.val1 = this.numList[pageView._curPageIdx];
        //更新指示器位置
        for (let i = 0; i < c3.children.length; i++) {
            if (c3.children[i].valNum == this.val1 * this.val2 * this.line) {
                this.chooseBet_list3.getComponent(cc.PageView).setCurrentPageIndex(i);
                this.val3 = c3.children[i].valNum;
                this.mainJs.sumIdx = i;
                break;
            }
        }
        this.mainJs.betNum = pageView._curPageIdx;
        this.lblCurBet.string = Helper.fixNum(this.val3);
    },

    cb_pt2: function (pageView) {
        let c3 = this.chooseBet_list3.getComponent(cc.PageView).content;
        this.val2 = this.betList[pageView._curPageIdx];
        //更新指示器位置
        for (let i = 0; i < c3.children.length; i++) {
            if (c3.children[i].valNum == this.val1 * this.val2 * this.line) {
                this.chooseBet_list3.getComponent(cc.PageView).setCurrentPageIndex(i);
                this.val3 = c3.children[i].valNum;
                this.mainJs.sumIdx = i;
                break;
            }
        }
        this.mainJs.bet = pageView._curPageIdx;
        this.lblCurBet.string = Helper.fixNum(this.val3);
    },

    cb_pt3: function (pageView) {
        let c1 = this.chooseBet_list1.getComponent(cc.PageView).content;
        let c2 = this.chooseBet_list2.getComponent(cc.PageView).content;
        this.val3 = this.sumList[pageView._curPageIdx];
        this.mainJs.sumIdx = pageView._curPageIdx;
        //更新指示器位置
        for (let i = 0; i < c1.children.length; i++) {
            for (let j = 0; j < c2.children.length; j++) {
                if (this.val3 == c1.children[i].valNum * c2.children[j].valNum * this.line) {
                    this.chooseBet_list1.getComponent(cc.PageView).setCurrentPageIndex(i);
                    this.chooseBet_list2.getComponent(cc.PageView).setCurrentPageIndex(j);
                    this.val1 = c1.children[i].valNum;
                    this.val2 = c2.children[j].valNum;
                    this.mainJs.betNum = i;
                    this.mainJs.bet = j;
                    break;
                }
            }
        }
        this.lblCurBet.string = Helper.fixNum(this.val3);
    },
    //选择最大下注
    choose_Max: function () {
        let c1 = this.chooseBet_list1.getComponent(cc.PageView).content;
        let c2 = this.chooseBet_list2.getComponent(cc.PageView).content;
        this.val3 = this.sumList[this.sumList.length - 1];
        this.mainJs.sumIdx = this.sumList.length - 1;
        //更新指示器位置
        for (let i = 0; i < c1.children.length; i++) {
            for (let j = 0; j < c2.children.length; j++) {
                if (this.val3 == c1.children[i].valNum * c2.children[j].valNum * this.line) {
                    this.chooseBet_list1.getComponent(cc.PageView).setCurrentPageIndex(i);
                    this.chooseBet_list2.getComponent(cc.PageView).setCurrentPageIndex(j);
                    this.val1 = c1.children[i].valNum;
                    this.val2 = c2.children[i].valNum;
                    this.mainJs.betNum = i;
                    this.mainJs.bet = j;
                    break;
                }
            }
        }
        this.lblCurBet.string = Helper.fixNum(this.val3);
    },

    settingInit_Function: function () {
        cc.audioEngine.stopAll();
        this.mainJs.audio.playBgm(0);
        this.playerInfo.musicControl ? (this.musicBtn.getComponent("cc.Sprite").spriteFrame = this.sp_settingControl[1]) :
            (this.musicBtn.getComponent("cc.Sprite").spriteFrame = this.sp_settingControl[0]);
    },

    settingControlButtonClick_Function: function () {
        if (this.playerInfo.musicControl) {
            this.playerInfo.musicControl = 0;
            this.musicBtn.getComponent("cc.Sprite").spriteFrame = this.sp_settingControl[0];
            this.writeUserSettingDate_Function();
            this.mainJs.audio.stopAudio();
        } else {
            this.playerInfo.musicControl = 1;
            this.musicBtn.getComponent("cc.Sprite").spriteFrame = this.sp_settingControl[1];
            this.writeUserSettingDate_Function();
            if (this.mainJs.freeTimes > 0) {
                this.mainJs.audio.playBgm(1);
            } else if (this.mainJs.bigWinBoo) {
                this.mainJs.audio.playBgm(2);
            } else {
                this.mainJs.audio.playBgm(0);
            }
        }
    },

    //main.js相关点击
    onCLick(event, args) {
        this.mainJs.onCLick(event, args);
    },
    //打开自动弹板
    onCLick_openAutoPanel() {
        this.Auto_panel.active = true;
    },
    //关闭自动弹板
    onCLick_closeAutoPanel() {
        this.Auto_panel.active = false;
    },
    //设置弹板开关
    onCLick_settingPanel(event, args) {
        let type = parseInt(args);
        if (this.isPanelAnim) {
            return;
        }
        this.isPanelAnim = true;
        this.scheduleOnce(() => {
            this.isPanelAnim = false;
        }, 0.5);
        if (type == 1) {
            if (this.betting_panel.opacity == 0) {
                return;
            }
            this.betting_panel.runAction(cc.spawn(cc.moveBy(0.2, 0, -190), cc.fadeOut(0.2)));
            this.Setting_panel.runAction(cc.spawn(cc.moveBy(0.2, 0, 190), cc.fadeIn(0.2)));
        } else {
            if (this.Setting_panel.opacity == 0) {
                return;
            }
            this.Setting_panel.runAction(cc.spawn(cc.moveBy(0.2, 0, -190), cc.fadeOut(0.2)));
            this.betting_panel.runAction(cc.spawn(cc.moveBy(0.2, 0, 190), cc.fadeIn(0.2)));
        }
    },
    //下注弹板开关
    onCLick_betPanel(event, args) {
        let type = parseInt(args);
        if (this.isPanelAnim) {
            return;
        }
        this.isPanelAnim = true;
        this.scheduleOnce(() => {
            this.isPanelAnim = false;
        }, 0.5);
        if (type == 0) {
            this.chooseBet_panel.runAction(cc.sequence(cc.moveBy(0.2, 0, -756), cc.callFunc(() => {
                this.chooseBet_panel.active = false;
            })));
        } else {
            this.chooseBet_panel.active = true;
            this.chooseBet_list1.getComponent(cc.PageView).setCurrentPageIndex(this.mainJs.betNum);
            this.chooseBet_list2.getComponent(cc.PageView).setCurrentPageIndex(this.mainJs.bet);
            //更新指示器位置
            let c3 = this.chooseBet_list3.getComponent(cc.PageView).content;
            for (let i = 0; i < c3.children.length; i++) {
                if (c3.children[i].valNum == this.val1 * this.val2 * this.line) {
                    this.chooseBet_list3.getComponent(cc.PageView).setCurrentPageIndex(i);
                    this.val3 = c3.children[i].valNum;
                    break;
                }
            }
            this.chooseBet_panel.runAction(cc.sequence(cc.moveBy(0.2, 0, 756), cc.callFunc(() => {

            })));
        }
    },
    //声音选项
    onCLick_sound(event, args) {
        if (args == "music") {
            this.settingControlButtonClick_Function(this.musicBtn, 0);
        } else if (args == "sound") {
            this.settingControlButtonClick_Function(this.soundBtn, 1);
        }
    },
    //购买金币
    onCLick_buyCoin() {
        cc.log("购买金币");
    },
    //选择自动次数
    onCLick_chooseAutoNum(event, args) {
        this.autoNum = parseInt(args);
        this.chooseAutoNum_lab.string = this.autoNum;
    },
    //开始自动
    onCLick_startAuto() {
        this.Auto_panel.active = false;
        if (this.autoNum > 0) {
            this.mainJs.startAuto(this.autoNum);
        }
    },
    //停止自动
    onCLick_stopAuto() {
        this.Btn_stopAuto.active = false;
        this.Btn_start.active = true;
        this.mainJs.stopAuto();
    },
    //设置极速模式
    onCLick_speed() {
        if (this.isSpeed) {
            this.isSpeed = false;
            this.speedBtn.getComponent("cc.Sprite").spriteFrame = this.sp_speed[0];
        } else {
            this.isSpeed = true;
            this.speedBtn.getComponent("cc.Sprite").spriteFrame = this.sp_speed[1];
        }
    },

    updateStateNode(type) {

    },

    //更新下注值
    updateBet(idx) {
        if (idx >= this.sumList.length || idx < 0) {
            return 0;
        }
        let c1 = this.chooseBet_list1.getComponent(cc.PageView).content;
        let c2 = this.chooseBet_list2.getComponent(cc.PageView).content;
        this.val3 = this.sumList[idx];
        //更新指示器位置
        for (let i = 0; i < c1.children.length; i++) {
            for (let j = 0; j < c2.children.length; j++) {
                if (this.val3 == c1.children[i].valNum * c2.children[j].valNum * this.line) {
                    this.val1 = c1.children[i].valNum;
                    this.val2 = c2.children[j].valNum;
                    this.mainJs.betNum = i;
                    this.mainJs.bet = j;
                    break;
                }
            }
        }
        this.lblCurBet.string = Helper.fixNum(this.val3);
        return 1;
    },

    playAnimWin(type, coin, labNode) {
        let t = (type + 1) * 30;//变化次数
        let list = [];//变化数组
        for (let i = 0; i < t; i++) {
            let A1 = coin / 100;
            let An = A1 + 2 * i * (coin - t * A1) / (t * (t - 1));

            list.push(An);
        }
        let x = t - 1;
        let addcoin = 0;
        this.schedule(() => {
            addcoin += list[x];
            if (x == 0) {
                addcoin = coin;
            }
            labNode.string = Helper.fixNum(addcoin);
            x--;
        }, 0.05, t - 1);

        let x_ = t - 1;
        let addcoin2 = 0;
        this.schedule(() => {
            addcoin2 += list[x_];
            if (x_ == 0) {
                addcoin2 = coin;
                this.changeLabColor(1);
            }
            this.winCoin_lab.string = Helper.fixNum(addcoin);
            this.lblUserCoin.string = Helper.fixNum(this.mainJs.lotteryRes.userscore - this.mainJs.lotteryRes.winscore + addcoin);
            x_--;
        }, 0.05, t - 1, 0.05 * (t + 3));
    },
    //大奖数字滚动动画
    playBigWinCoin(coin) {
        let addcoin = 0;
        this.schedule(() => {
            addcoin += coin / 30;
            if (addcoin > coin) {
                addcoin = coin;
            }
            this.bigWinCoin_lab.string = Helper.fixNum(addcoin);
        }, 0.05, 30);

        this.scheduleOnce(() => {
            this.closeBigWin();
        }, 4.5);

    },
    //大奖BigWin动画
    playAnim_BigWin(coin) {
        this.bigWinNode.active = true;
        this.bigWinNode.children[0].active = true;
        this.bigWinNode.children[1].active = false;
        this.bigWinNode.children[2].active = false;
        this.bigWinNode.children[0].getComponent(cc.Animation).play();
        this.playBigWinCoin(coin);
    },
    //大奖SuperWin动画
    playAnim_SuperWin(coin) {
        this.bigWinNode.active = true;
        this.bigWinNode.children[0].active = false;
        this.bigWinNode.children[1].active = true;
        this.bigWinNode.children[2].active = false;
        this.bigWinNode.children[1].getComponent(cc.Animation).play();
        this.playBigWinCoin(coin);
    },
    //大奖MegaWin动画
    playAnim_MegaWin(coin) {
        this.bigWinNode.active = true;
        this.bigWinNode.children[0].active = false;
        this.bigWinNode.children[1].active = false;
        this.bigWinNode.children[2].active = true;
        this.bigWinNode.children[2].getComponent(cc.Animation).play();
        this.playBigWinCoin(coin);
    },

    closeBigWin() {
        this.bigWinNode.active = false;
    },
    //设置免费游戏UI
    setFreeGameUI(isFree) {
        this.betting_panel.active = !isFree;
        this.coin_panel.getComponent(cc.Widget).bottom = isFree ? 0 : 210;
        this.coin_panel.getComponent(cc.Widget).updateAlignment();
    },
    //设置当前旋转动画
    setSpinAnim(type) {//0-默认旋转  1-加速旋转   2-加速置灰旋转   3-置灰停止旋转
        switch (type) {
            case 0:
                this.Btn_start.getComponent(cc.Button).interactable = true;
                this.spin_AnimNode.getComponent(cc.Sprite).spriteFrame = this.spin_Sp[0];
                this.spin_AnimNode.getComponent(cc.Animation).getAnimationState("xuanzhuan").speed = 1;
                this.setButtonState(true);
                if (this.mainJs.lotteryRes && this.mainJs.lotteryRes.winscore == 0) {
                    this.changeLabColor(1);
                }
                break;
            case 1:
                this.Btn_start.getComponent(cc.Button).interactable = false;
                this.Btn_start.getChildByName("VFX").getComponent(cc.Animation).play();
                this.Btn_start.getChildByName("VFX2") && this.Btn_start.getChildByName("VFX2").getComponent(cc.Animation).play();
                this.spin_AnimNode.getComponent(cc.Sprite).spriteFrame = this.spin_Sp[2];
                this.spin_AnimNode.getComponent(cc.Animation).getAnimationState("xuanzhuan").speed = 10;
                this.winCoin_lab.string = "0.00";
                this.setButtonState(false);
                this.changeLabColor(0);
                break;
            case 2:
                this.Btn_start.getComponent(cc.Button).interactable = false;
                this.spin_AnimNode.getComponent(cc.Sprite).spriteFrame = this.spin_Sp[0];
                this.spin_AnimNode.getComponent(cc.Animation).getAnimationState("xuanzhuan").speed = 1;
                break;
            case 3:
                this.Btn_start.getComponent(cc.Button).interactable = false;
                this.spin_AnimNode.getComponent(cc.Sprite).spriteFrame = this.spin_Sp[3];
                this.spin_AnimNode.getComponent(cc.Animation).getAnimationState("xuanzhuan").speed = 0;
                break;
        }
    },

    setButtonState(state) {
        this.Btn_add.opacity = state ? 255 : 100;
        this.Btn_sub.opacity = state ? 255 : 100;
        this.Btn_auto.opacity = state ? 255 : 100;
        this.Btn_set.opacity = state ? 255 : 100;
        this.Btn_add.getComponent(cc.Button).interactable = state;
        this.Btn_sub.getComponent(cc.Button).interactable = state;
        this.Btn_auto.getComponent(cc.Button).interactable = state;
        this.Btn_set.getComponent(cc.Button).interactable = state;
    },

    changeLabColor(type) {
        if (type == 0) {
            this.lblUserCoin.node.color = new cc.Color(255, 255, 255);
            this.lblCurBet.node.color = new cc.Color(255, 255, 255);
            this.winCoin_lab.node.color = new cc.Color(255, 255, 255);
        } else {
            this.lblUserCoin.node.color = new cc.Color(123, 233, 246);
            this.lblCurBet.node.color = new cc.Color(123, 233, 246);
            this.winCoin_lab.node.color = new cc.Color(123, 233, 246);
        }
    },

    /**
     * 将设置数据写入缓存数据
     */
    writeUserSettingDate_Function: function () {
        var data = {
            musicControl: this.playerInfo.musicControl,
            soundEffectControl: this.playerInfo.soundEffectControl
        };
        this.playerInfo.writeData_Function("userSetting", data);
    },

    //通用关闭界面
    onBtnClick_closePanel(event) {
        //这里 event 是一个 Touch Event 对象，你可以通过 event.target 取到事件的发送节点
        event.target.parent.active = false;
    },

});
