const BETNUM = [8, 80, 300, 1000]; //单注值
const LINES = 5; //线数
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
        effectLine: {
            default: null,
            type: cc.Node,
            displayName: '中奖线特效',
        },

        effectNum: {
            default: null,
            type: cc.Node,
            displayName: '中奖数字特效',
        },

        effectLight: {
            default: null,
            type: cc.Node,
            displayName: '中奖光特效',
        },

        effectCard: {
            default: null,
            type: cc.Node,
            displayName: '中奖牌特效',
        },

        maskNode: {
            default: null,
            type: cc.Node,
            displayName: '中奖图层遮罩',
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

        mulListNode: {
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
        mouseAnim: {
            default: null,
            type: cc.Node,
            displayName: '老鼠动画',
        },
    },

    onLoad() {
        this.playerInfo = require("PlayerInfo").getInstant;
        this.slotCtrl = cc.find("Canvas/Slot_Control_05").getComponent('slot_Ctrl_05'); //newSlot
        this.slotCtrl.init(this); //newSlot
        this.slotCtrl.initBetContent(BETNUM, BET, LINES);
        this.net = this.node.getComponent('fortunemouseNetwork');
        this.audio = this.node.getComponent('fortunemouseAudio');
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
        //监听老鼠动画播放
        this.mouseAnim.getComponent(sp.Skeleton).setCompleteListener((event) => {
            switch (event.animation.name) {
                case "idle2":
                    this.mouseAnim.getComponent(sp.Skeleton).setAnimation(0, "idle", true);
                    break;
                case "idle3":
                    this.mouseAnim.getComponent(sp.Skeleton).setAnimation(0, "idle", true);
                    break;
                case "idle4":
                    this.mouseAnim.getComponent(sp.Skeleton).setAnimation(0, "idle", true);
                    break;
                case "small_win":
                    this.mouseAnim.getComponent(sp.Skeleton).setAnimation(0, "idle", true);
                    break;
                case "medium_win":
                    this.mouseAnim.getComponent(sp.Skeleton).setAnimation(0, "idle", true);
                    break;
            }
        });
        //定期切换静止动画
        this.schedule(() => {
            if (this.freeTimes > 0 || this.bigWinBoo || this.stopFree || this.bIsFreeGame || this.delayClick) {
                return;
            }
            let r = Math.random();
            if (r < 0.4) {
                this.mouseAnim.getComponent(sp.Skeleton).setAnimation(0, "idle2", false);
            } else if (r < 0.7) {
                this.mouseAnim.getComponent(sp.Skeleton).setAnimation(0, "idle3", false);
            } else {
                this.mouseAnim.getComponent(sp.Skeleton).setAnimation(0, "idle4", false);
            }
        }, 6);
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
            }, 1);

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
        let rIndex = this.rollIndex;
        let list = (this.freeTimes > 0 || this.stopFree) ? [allLine] : [allLine, ...lines];
        hasWinBool = list.length - 1;
        if (this.lotteryRes.winscore > 0) {
            this.audio.playBW();
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
            this.coinBoomEffect.getComponent(cc.Animation).play();
            if (this.lotteryRes.winscore < this.betSum * 3) {
                this.mouseAnim.getComponent(sp.Skeleton).setAnimation(0, "small_win", false);
            } else {
                this.mouseAnim.getComponent(sp.Skeleton).setAnimation(0, "medium_win", false);
            }
        } else {
            this.slotCtrl.updateStateNode(2);
        }
        let animIndex = 0;
        this.schedule(() => {
            if (rIndex == this.rollIndex) {
                this.closeShine();
                for (let i = 0; i < 9; i++) {
                    this.closeAnim(i % 3, parseInt(i / 3));
                }

                if (!!!list[animIndex] || list[animIndex].length == 0) {
                    return;
                }
                this.maskNode.active = true;
                for (let j in list[animIndex]) {
                    this.showAnim(list[animIndex][j] % 3, parseInt(list[animIndex][j] / 3));
                }
                if (animIndex == 0) {
                    for (let i = 0; i < this.lotteryRes.viewarray.nWinLines.length; i++) {
                        this.effectLine.children[this.lotteryRes.viewarray.nWinLines[i]].active = true;
                        this.effectNum.children[this.lotteryRes.viewarray.nWinLines[i]].active = true;
                    }
                } else {
                    this.effectLine.children[this.lotteryRes.viewarray.nWinLines[animIndex - 1]].active = true;
                    this.effectNum.children[this.lotteryRes.viewarray.nWinLines[animIndex - 1]].active = true;
                }
                animIndex++;
            }
        }, 3, list.length, 0.01);


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
        }, hasWinBool > 0 ? hasWinBool * 3 : 1);
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
        this.sendRoll();
        // }, 2);
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
    showAnim(cols, index) {
        let targetIdx = index + 1;
        for (let i in this.wheelList[cols].rolePbList[targetIdx].children) {
            this.wheelList[cols].rolePbList[targetIdx].children[i].active = false;
        }

        //添加结束
        let nodeList = this.effectLight.children;
        nodeList[cols * 3 + index].active = true;

        let nodeList2 = this.effectCard.children;
        for (let i = 0; i < nodeList2[cols * 3 + index].children.length; i++) {
            nodeList2[cols * 3 + index].children[i].active = i == (this.wheelList[cols].roleIdList[targetIdx] - 1);
        }
        // nodeList2[cols * 3 + index].active = true;
    },

    closeAnim(cols, index) {
        let targetIdx = index + 1;
        for (let i in this.wheelList[cols].rolePbList[targetIdx].children) {
            this.wheelList[cols].rolePbList[targetIdx].children[i].active = true;
        }

        //添加结束
        let nodeList = this.effectLight.children;
        nodeList[cols * 3 + index].active = false;

        let nodeList2 = this.effectCard.children;
        for (let i = 0; i < nodeList2[cols * 3 + index].children.length; i++) {
            nodeList2[cols * 3 + index].children[i].active = false;
        }
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
        for (let i = 0; i < 3; i++) {
            line[i] = [];
        }
        for (let i in list) {
            line[i % 3][2 - parseInt(i / 3)] = list[i];
        }
        for (let i in this.wheelList) {
            this.wheelList[i].startRoll(...line[i]);
        }
    },

    closeShine() {
        for (let i = 0; i < this.effectLine.children.length; i++) {
            this.effectLine.children[i].active = false;
        }

        for (let i = 0; i < this.effectNum.children.length; i++) {
            this.effectNum.children[i].active = false;
        }

        for (let i = 0; i < this.effectLight.children.length; i++) {
            this.effectLight.children[i].active = false;
        }

        for (let i = 0; i < this.effectCard.children.length; i++) {
            for (let j = 0; j < this.effectCard.children[i].children.length; j++) {
                this.effectCard.children[i].children[j].active = false;
            }
        }

        for (let i = 0; i < this.wheelList.length; i++) {
            for (let j = 0; j < this.wheelList[i].rolePbList.length; j++) {
                for (let k = 0; k < this.wheelList[i].rolePbList[j].children.length; k++) {
                    this.wheelList[i].rolePbList[j].children[k].active = true;
                }
            }
        }
        this.maskNode.active = false;
    },

    sendRoll() {
        this.rollIndex++;
        this.closeShine();
        this.slotCtrl.unscheduleAllCallbacks();
        this.slotCtrl.closeBigWin();
        this.autoTimes = this.autoTimes > 0 ? this.autoTimes - 1 : 0;
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