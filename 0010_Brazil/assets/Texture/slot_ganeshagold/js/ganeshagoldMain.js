const BETNUM = [1, 4, 20]; //单注值
const LINES = 30; //线数
const BET = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
cc.Class({
    extends: cc.Component,

    properties: {

        rolePb: {
            default: [],
            type: cc.Prefab,
            displayName: '滚轮角色Pb',
        },

        detailPb: {
            default: null,
            type: cc.Prefab,
            displayName: '角色详情Pb',
        },

        helpUI: {
            default: null,
            type: cc.Node,
            displayName: '规则',
        },

        help2UI: {
            default: null,
            type: cc.Node,
            displayName: '赔付表',
        },

        recordUI: {
            default: null,
            type: cc.Node,
            displayName: '历史记录',
        },
        effectAnimPr: {
            default: null,
            type: cc.Node,
            displayName: '中奖特效',
        },

        BgNode: {
            default: null,
            type: cc.Node,
            displayName: '游戏背景节点',
        },

        //免费次数有关
        freeBgNode: {
            default: null,
            type: cc.Node,
            displayName: '免费摇奖背景节点',
        },
        freeBeginNode: {
            default: null,
            type: cc.Node,
            displayName: '开始免费摇奖节点',
        },
        freeEndNode: {
            default: null,
            type: cc.Node,
            displayName: '结束免费摇奖节点',
        },
        tipNode: {
            default: null,
            type: cc.Node,
            displayName: '滚屏提示',
        },
        winNode: {
            default: null,
            type: cc.Node,
            displayName: '中奖提示',
        },
        coinBoomEffect: {
            default: null,
            type: cc.Node,
            displayName: '爆金币',
        },
        recordScrollView: {
            default: null,
            type: cc.ScrollView,
            displayName: '历史记录列表',
        },
        recordPb: {
            default: null,
            type: cc.Prefab,
            displayName: '历史记录预制体',
        },
    },

    onLoad() {
        this.playerInfo = require("PlayerInfo").getInstant;
        this.slotCtrl = cc.find("Canvas/Slot_Control_05").getComponent('slot_Ctrl_05'); //newSlot
        this.slotCtrl.init(this); //newSlot
        this.slotCtrl.initBetContent(BETNUM, BET, LINES);
        this.net = this.node.getComponent('ganeshagoldNetwork');
        this.audio = this.node.getComponent('ganeshagoldAudio');
        this.wheelList = [];
        this.bet = 0;
        this.betNum = 0;
        this.sumIdx = 0;
        this.betSum = 0;//累计下注计算
        this.auto = false;
        this.autoTimes = 0;
        this.status = 0;
        this.bigWinResList = [3, 1, 2];
        this.bigWinCard = 0;
        this.bigWinCoin = 0;
        this.bigWinBoo = false;
        this.freeTimes = 0;
        this.freeTotalTimes = 0;
        this.rollResult = [];
        this.rollIndex = 0;
        this.lotteryRes = null;
        this.stopFree = false;
        this.freeGameCoin = 0;
        this.bIsFreeGame = false;
        this.delayClick = false;
    },

    start() {
        this.slotCtrl.lblLines.string = LINES;
        this.slotCtrl.updateBet(0);
        this.anim_cb = null;
    },

    update() {
        this.betSum = BET[this.bet] * BETNUM[this.betNum] * LINES;
    },

    onCLick(event, args) {
        switch (args) {
            case "roll":
                if (this.freeTimes > 0 || this.bigWinBoo || this.stopFree || this.bIsFreeGame || this.delayClick) {
                    return;
                }
                if (!this.auto) {
                    if (this.status == 0) {
                        this.status = 2;
                        this.sendRoll();
                    } else if (this.status == 1) {
                        this.delayClick = true;
                        this.scheduleOnce(() => {
                            this.delayClick = false;
                        }, 1);
                        this.slotCtrl.setSpinAnim(3);
                        this.stopImmediately();
                    }
                }
                break;
            case "add":
                if (this.freeTimes > 0 || this.bigWinBoo || this.stopFree || this.auto) {
                    return;
                }
                this.sumIdx += 1;
                this.sumIdx = this.slotCtrl.updateBet(this.sumIdx) == 0 ? this.sumIdx - 1 : this.sumIdx;
                break;
            case "dec":
                if (this.freeTimes > 0 || this.bigWinBoo || this.stopFree || this.auto) {
                    return;
                }
                this.sumIdx -= 1;
                this.sumIdx = this.slotCtrl.updateBet(this.sumIdx) == 0 ? this.sumIdx + 1 : this.sumIdx;
                break;
            case "closeBigWin":
                this.audio.playBgm(0);
                break;
            case "help":
                this.helpUI.active = true;
                break;
            case "closeHelp":
                this.helpUI.active = false;
                break;
            case "help2":
                this.help2UI.active = true;
                break;
            case "close2Help":
                this.help2UI.active = false;
                break;
            case "history":
                this.net.socket.emit("history");
                this.recordUI.active = true;
                break;
            case "closeHistory":
                this.recordUI.active = false;
                break;
            case "exitGame":
                this.net.socket.disconnect();
                cc.director.loadScene(window.hallName);
                break;
            case "closeTip":
                cc.find("Canvas/com_tishi").active = false;
                this.slotCtrl.setSpinAnim(0);
                break;
        }
    },

    startAuto(n) {
        if (this.freeTimes > 0 || this.bigWinBoo || this.stopFree || this.bIsFreeGame || this.delayClick) {
            return;
        }
        if (this.status == 0) {
            this.auto = true;
            this.autoTimes = n;
            this.slotCtrl.Btn_stopAuto.children[1].getComponent(cc.Label).string = n;
            this.sendRoll();
        }
    },

    stopAuto() {
        this.auto = false;
        this.autoTimes = 0;
    },

    stateCallBack() {
        let st = 0;
        for (let i in this.wheelList) {
            if (this.wheelList[i].status) {
                st = 1;
                break;
            }
        }
        this.status = st;
        if (this.status == 0) {
            //结束当前轮盘
            if (this.lotteryRes.winscore > 0) {
                this.slotCtrl.setSpinAnim(3);
            } else {
                this.slotCtrl.setSpinAnim(2);
            }
            let rIndex = this.rollIndex;
            // this.slotCtrl.lblUserCoin.string = Helper.fixNum(this.lotteryRes.userscore);
            if (this.bIsFreeGame) {
                this.freeGameCoin += this.lotteryRes.winscore;
            }
            let freeFlag = this.lotteryRes.viewarray.getFreeTime.bFlag
            this.scheduleOnce(() => {
                if (rIndex == this.rollIndex) {
                    this.playWinAnim(freeFlag);
                }
                if (!this.auto) {

                }
            }, 1);
            // } else {
            //     this.playWinAnim();
            // }
            if (this.bIsFreeGame) {
                this.freeGameCoin += this.lotteryRes.winscore;
            }


            if (this.lotteryRes.viewarray.getFreeTime.bFlag) {
                if (this.freeTimes == 0) {
                    this.auto = false;
                    this.freeBeginNode.active = true;
                    this.freeTimes = this.lotteryRes.viewarray.getFreeTime.nFreeTime;
                    this.freeTimes--;
                    this.scheduleOnce(() => {
                        this.freeBeginNode.active = false;
                        this.closeShine();
                        this.startFreeGame();
                    }, 5);
                } else {
                    this.freeTimes = this.lotteryRes.viewarray.getFreeTime.nFreeTime;
                    this.stopFree = false;
                }
            } else {
                this.scheduleOnce(() => {
                    if (rIndex == this.rollIndex) {
                        this.playWinAnim();
                    }
                }, 1);
            }
        }
    },

    playWinAnim(freeTimeFlag) {
        //动画结束后自动roll
        let hasWinBool = 0;
        let allLine = [];

        for (let i in this.lotteryRes.viewarray.nWinCards) {
            if (this.lotteryRes.viewarray.nWinCards[i]) {
                allLine.push(i);
            }
        }
        let lines = this.lotteryRes.viewarray.nWinLinesDetail;
        let linesNumList = this.lotteryRes.viewarray.nWinLines;
        let rIndex = this.rollIndex;
        let list = (this.freeTimes > 0 || this.stopFree) ? [allLine] : [allLine, ...lines];
        hasWinBool = list.length - 1;
        if (this.lotteryRes.winscore > 0) {
            let wl = this.winNode.getChildByName("lab").getComponent(cc.Label);
            //判断播放金币掉落动画
            if (this.lotteryRes.winscore > this.betSum * 15) { //如果大于80倍赌注，就播放bigFull动画
                this.slotCtrl.playAnim_MegaWin(this.lotteryRes.winscore);
                this.slotCtrl.playAnimWin(3, this.lotteryRes.winscore, wl);
            } else if (this.lotteryRes.winscore > this.betSum * 10) {
                this.slotCtrl.playAnim_SuperWin(this.lotteryRes.winscore);
                this.slotCtrl.playAnimWin(2, this.lotteryRes.winscore, wl);
            } else if (this.lotteryRes.winscore > this.betSum * 8) {
                this.slotCtrl.playAnim_BigWin(this.lotteryRes.winscore);
                this.slotCtrl.playAnimWin(1, this.lotteryRes.winscore, wl);
            } else {
                this.slotCtrl.playAnimWin(0, this.lotteryRes.winscore, wl);
            }
            this.tipNode.active = false;
            this.winNode.active = true;
            this.winNode.children[1].active = true;
            this.winNode.children[2].active = false;
            this.winNode.getChildByName("lab").getComponent(cc.Label).string = Helper.fixNum(this.lotteryRes.winscore);
            this.coinBoomEffect.getComponent(cc.Animation).play();
        } else {
            this.slotCtrl.updateStateNode(2);
        }
        let animIndex = 0;
        this.anim_cb = () => {
            if (rIndex == this.rollIndex) {
                this.closeShine();
                for (let i = 0; i < 15; i++) {
                    this.closeAnim(i % 5, parseInt(i / 5));
                }
                if (!!!list[animIndex]) {
                    return;
                }
                if (list[animIndex].length > 0) {
                    for (let i in this.effectAnimPr.children) {
                        this.effectAnimPr.children[i].active = true;
                    }
                }

                for (let j in list[animIndex]) {
                    this.showAnim(list[animIndex][j] % 5, parseInt(list[animIndex][j] / 5));
                }
                animIndex++;
            }
        }
        this.schedule(this.anim_cb, 2, cc.macro.REPEAT_FOREVER, 0.01);
        let t = 2;
        if (this.lotteryRes.winscore > 0) {
            t = 2 * list.length;
        } else {
            t = 1;
        }

        this.slotCtrl.setSpinAnim(0);

        this.scheduleOnce(() => {
            this.tipNode.active = true;
            this.winNode.active = false;
            if (this.stopFree) {
                this.stopFree = false;
                this.stopFreeTimes();
                this.closeShine();
            }
            if (this.freeTimes > 0 && !freeTimeFlag) {
                this.freeTimes--;
                this.slotCtrl.Btn_free.getChildByName('auto_lab').getComponent(cc.Label).string = this.freeTimes;
                if (this.freeTimes == 0) {
                    this.stopFree = true;
                }
                if (rIndex == this.rollIndex) {
                    this.auto && this.sendRoll();
                }
            }
            if (rIndex == this.rollIndex) {
                this.auto && this.freeTimes == 0 && this.autoTimes > 0 && this.sendRoll();
            }
        }, t);
    },

    //免费次数有关
    startFreeGame() {
        console.log("startFreeGame");
        this.audio.playBgm(1);
        this.freeGameCoin = 0;
        this.BgNode.active = false;
        this.bIsFreeGame = true;
        this.freeBgNode.active = true;

        for (let i in this.wheelList) {
            this.wheelList[i].initWheel();
        }
        this.slotCtrl.Btn_free.active = true;
        this.slotCtrl.Btn_free.getChildByName('auto_lab').getComponent(cc.Label).string = this.freeTimes;
        this.auto = true;
        if (this.freeTimes == 0) {
            this.stopFree = true;
        }
        this.sendRoll();
    },

    stopFreeTimes() {
        console.log("stopFreeTimes freeGameCoin : ", this.freeGameCoin);
        this.audio.playBgm(0);
        this.auto = false;

        for (let i in this.wheelList) {
            this.wheelList[i].initWheel();
        }
        this.slotCtrl.Btn_free.active = false;
        this.freeEndNode.active = true;
        this.freeEndNode.getChildByName("lbl_coin").getComponent(cc.Label).string = Helper.fixNum(this.freeGameCoin);
        this.scheduleOnce(() => {
            this.freeEndNode.active = false;
            this.BgNode.active = true;
            this.freeBgNode.active = false;
            this.bIsFreeGame = false;
        }, 2);

    },

    //0-5 0-2
    showAnim(cols, index, beishu) {
        this.audio.playBW();
        let length = this.wheelList[cols].roleIdList.length;
        this.wheelList[cols].rolePbList[length - 2 - index].getComponent("TempAnimation").playAnim();
        //添加
        if (this.wheelList[cols].rolePbList[length - 2 - index].getChildByName("beishu") && beishu > 1) {
            this.wheelList[cols].rolePbList[length - 2 - index].getChildByName("beishu").active = true;
            this.wheelList[cols].rolePbList[length - 2 - index].getChildByName("beishu").getComponent(cc.Label).string = "x" + beishu;
        }
        //添加结束
        let nodeList = this.effectAnimPr.children;
        nodeList[cols * 3 + index].active = false;
    },

    closeAnim(cols, index) {
        let length = this.wheelList[cols].roleIdList.length;
        this.wheelList[cols].rolePbList[length - 2 - index].getComponent("TempAnimation").stopAnim();
        //添加
        if (this.wheelList[cols].rolePbList[length - 2 - index].getChildByName("beishu")) {
            this.wheelList[cols].rolePbList[length - 2 - index].getChildByName("beishu").active = false;
        }
        //添加结束
        let nodeList = this.effectAnimPr.children;
        nodeList[cols * 3 + index].active = false;
    },

    checkRollData(list) {
        for (const iterator of list) {
            if (iterator >= this.rolePb.length) {
                return false;
            }
        }
        return true;
    },

    roll(list) {
        if (!this.checkRollData(list)) {
            alert(`
            服务器获取的花色种类大于现有的花色种类！！！
            请联系服务器人员进行数据调整！`
            );
            return;
        }
        if (!this.auto) {
            this.slotCtrl.Btn_start.getComponent(cc.Button).interactable = true;
        }
        this.status = 1;
        let line = [];
        for (let i = 0; i < 5; i++) {
            line[i] = [];
        }
        for (let i in list) {
            line[i % 5][2 - parseInt(i / 5)] = list[i];
        }
        for (let i in this.wheelList) {
            this.wheelList[i].startRoll(...line[i]);
        }
    },

    closeShine() {
        let nodeList = this.effectAnimPr.children;
        for (let i in nodeList) {
            nodeList[i].active = false;
        }
    },

    sendRoll() {
        this.rollIndex++;
        this.closeShine();
        this.slotCtrl.unscheduleAllCallbacks();
        this.slotCtrl.closeBigWin();
        this.autoTimes = this.autoTimes > 0 ? this.autoTimes - 1 : 0;
        this.anim_cb && this.unschedule(this.anim_cb);
        if (this.freeTimes == 0 && this.autoTimes == 0) {
            this.auto = false;
        }
        this.slotCtrl.Btn_stopAuto.active = (this.auto && this.freeTimes == 0);
        this.slotCtrl.winCoin_lab.string = "0.00";
        this.slotCtrl.setSpinAnim(1);
        this.slotCtrl.Btn_stopAuto.children[0].getComponent(cc.Label).string = this.autoTimes;
        this.net.socket.emit('lottery', JSON.stringify({
            bet: this.bet,
            nBetList: [this.betSum]
        }));
    },

    stopImmediately() {
        if (!this.auto) {
            for (let i in this.wheelList) {
                this.wheelList[i].stopImmediately();
            }
        }
    },

    setPool(coin) {
        this.slotCtrl.jackpot_lab.string = Helper.fixNum(coin);
    },

    refreshPool(coin) {
        this.slotCtrl.jackpot_lab.string = Helper.fixNum(coin);
    },

    updateRecord(data) {
        data.reverse();
        this.recordScrollView.content.removeAllChildren();
        for (let i = 0; i < data.length; i++) {
            let newNode = cc.instantiate(this.recordPb);
            newNode.children[0].getComponent(cc.Label).string = Helper.timeFormat(data[i].lotteryTime);
            newNode.children[1].getComponent(cc.Label).string = data[i].id;
            newNode.children[2].getComponent(cc.Label).string = Helper.fixNum(data[i].score_linescore);
            newNode.children[3].getComponent(cc.Label).string = Helper.fixNum(data[i].score_win);
            this.recordScrollView.content.addChild(newNode);
        }
    },


});