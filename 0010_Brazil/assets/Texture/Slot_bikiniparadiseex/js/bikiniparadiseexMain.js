const BETNUM = [2, 10, 80]; //单注值
const LINES = 25; //线数
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
        BgNode: {
            default: null,
            type: cc.Node,
            displayName: '游戏背景节点',
        },
        freeBgNode: {
            default: null,
            type: cc.Node,
            displayName: '免费模式背景',
        },
        //免费次数有关
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
        win2BG: {
            default: null,
            type: cc.Node,
            displayName: '中奖背景2',
        },
        win3BG: {
            default: null,
            type: cc.Node,
            displayName: '中奖背景3',
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
        coinLineLab: {
            default: null,
            type: cc.Label,
            displayName: '单线中奖金币',
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
        this.net = this.node.getComponent('bikiniparadiseexNetwork');
        this.audio = this.node.getComponent('bikiniparadiseexAudio');

        this.wheelList = [];
        this.bet = 0;
        this.betNum = 0;
        this.sumIdx = 0;
        this.betSum = 0;//累计下注计算
        this.auto = false;
        this.status = 0;
        this.winLinePos = [
            140, -10, -160, -310, 140,
            -10, -160, -160, -310, 140,
            -10, -160, 140, -10, -160,
            -10, -160, -310, 140, -10,
            -160, -160, -310, 140, -10];
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
        this.isFreeStart = false;
        this.isFreeEnd = false;
    },

    start() {
        this.slotCtrl.lblLines.string = LINES;
        this.slotCtrl.updateBet(0);
        this.anim_cb = null;

        this.web = cc.find("Canvas/web").getComponent('cc_WebView'); 
        if (this.web) {
            console.log('获取webview组件成功 ')
        }
        else {
            console.log('获取webview组件失败 ')
        }

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
            case "startFree":
                this.isFreeStart = true;
                this.auto = true;
                this.freeBeginNode.active = false;
                this.sendRoll();
                break;
            case "stopFree":
                this.isFreeEnd = true;
                this.freeEndNode.active = false;
                this.bIsFreeGame = false;
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

            //延迟一点让立即结束落位
            this.scheduleOnce(() => {
                //高等级特效
                for (let i in this.wheelList) {
                    for (let j = 0; j < 10; j++) {
                        if (this.wheelList[i].roleIdList[j + 1] > 10) {
                            this.wheelList[i].rolePbList[j + 1].children[0].getComponent(sp.Skeleton).setAnimation(0, "win", false);
                        }
                    }
                }
            }, 0.1);

            let rIndex = this.rollIndex;
            // this.slotCtrl.lblUserCoin.string = Helper.fixNum(this.lotteryRes.userscore);
            if (this.bIsFreeGame) {
                this.freeGameCoin += this.lotteryRes.winscore;
            }
            this.scheduleOnce(() => {
                if (rIndex == this.rollIndex) {
                    this.playWinAnim();
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
                    this.bIsFreeGame = true;
                    this.auto = false;
                    this.freeTimes = this.lotteryRes.viewarray.getFreeTime.nFreeTime;
                    this.freeTotalTimes = this.lotteryRes.viewarray.getFreeTime.nFreeTime;
                    this.scheduleOnce(() => {
                        this.closeShine();
                        this.startFreeGame();
                    }, 3);
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

    playWinAnim() {
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
            this.coinBoomEffect.getComponent(cc.Animation).play();
        } else {
            this.slotCtrl.updateStateNode(2);
        }
        let animIndex = 0;
        this.anim_cb = () => {
            if (rIndex == this.rollIndex) {
                this.closeShine();
                for (let i = 0; i < 20; i++) {
                    this.closeAnim(i % 5, parseInt(i / 5));
                }
                if (!!!list[animIndex] || list[animIndex].length == 0) {
                    return;
                }
                this.maskNode.active = true;

                for (let j in list[animIndex]) {
                    this.showAnim(list[animIndex][j] % 5, parseInt(list[animIndex][j] / 5));
                }
                if (animIndex == 0) {
                    for (let i = 0; i < this.lotteryRes.viewarray.nWinLines.length; i++) {
                        this.effectLine.children[this.lotteryRes.viewarray.nWinLines[i]].active = true;
                        this.effectNum.children[this.lotteryRes.viewarray.nWinLines[i]].active = true;
                    }
                } else {
                    //中奖数字和位置
                    this.coinLineLab.node.active = true;
                    this.coinLineLab.node.y = this.winLinePos[this.lotteryRes.viewarray.nWinLines[animIndex - 1]];
                    this.coinLineLab.string = Helper.fixNum(this.lotteryRes.viewarray.nWinDetail[animIndex - 1]);

                    this.effectLine.children[this.lotteryRes.viewarray.nWinLines[animIndex - 1]].active = true;
                    this.effectNum.children[this.lotteryRes.viewarray.nWinLines[animIndex - 1]].active = true;
                }
                animIndex++;
            }
        }
        this.schedule(this.anim_cb, 2, cc.macro.REPEAT_FOREVER, 0.01);
        let t = 3;
        if (this.lotteryRes.winscore > 0) {
            t = 3;
        } else {
            t = 1;
        }

        this.slotCtrl.setSpinAnim(0);
        this.scheduleOnce(() => {
            if (rIndex == this.rollIndex) {
                this.tipNode.active = true;
                this.winNode.active = false;
                if (this.stopFree) {
                    this.stopFree = false;
                    this.stopFreeTimes();
                    this.closeShine();
                }
                if (this.freeTimes > 0) {
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
                    this.auto && this.freeTimes == 0 && this.sendRoll();
                }
            }
        }, hasWinBool > 0 ? hasWinBool * t : t);
    },

    //免费次数有关
    startFreeGame() {
        console.log("startFreeGame");
        this.audio.playBgm(1);
        this.freeGameCoin = 0;
        this.BgNode.active = false;
        this.bIsFreeGame = true;
        this.freeBgNode.active = true;
        this.freeBeginNode.active = true;
        this.freeBeginNode.getChildByName('lab').getComponent(cc.Label).string = this.freeTimes + 1;
        this.slotCtrl.setFreeGameUI(true);

        for (let i in this.wheelList) {
            this.wheelList[i].initWheel();
        }
        this.slotCtrl.Btn_free.active = true;
        this.slotCtrl.Btn_free.children[0].active = true;
        this.slotCtrl.Btn_free.children[1].active = false;
        this.slotCtrl.Btn_free.getChildByName('auto_lab').getComponent(cc.Label).string = this.freeTimes;
        this.auto = true;
        if (this.freeTimes == 0) {
            this.stopFree = true;
            this.slotCtrl.Btn_free.children[0].active = false;
            this.slotCtrl.Btn_free.children[1].active = true;
        }
        this.scheduleOnce(() => {
            if (!this.isFreeStart) {
                this.auto = true;
                this.freeBeginNode.active = false;
                this.sendRoll();
            }
        }, 5);
    },

    stopFreeTimes() {
        console.log("stopFreeTimes freeGameCoin : ", this.freeGameCoin);
        this.audio.playBgm(0);
        this.auto = false;
        this.isFreeEnd = false;
        this.slotCtrl.setFreeGameUI(false);

        for (let i in this.wheelList) {
            this.wheelList[i].initWheel();
        }
        this.slotCtrl.Btn_free.active = false;
        this.freeEndNode.active = true;
        this.freeEndNode.getChildByName("lbl_coin").getComponent(cc.Label).string = Helper.fixNum(this.freeGameCoin);
        this.scheduleOnce(() => {
            if (!this.isFreeEnd) {
                this.freeEndNode.active = false;
                this.BgNode.active = true;
                this.freeBgNode.active = false;
                this.bIsFreeGame = false;
            }
        }, 5);

    },

    //0-5 0-2
    showAnim(cols, index) {
        this.audio.playBW();
        let targetIdx = index + 1;
        for (let i in this.wheelList[cols].rolePbList[targetIdx].children) {
            this.wheelList[cols].rolePbList[targetIdx].children[i].active = false;
        }
        //添加结束
        let nodeList = this.effectLight.children;
        nodeList[cols * 4 + index].active = true;
        let nodeList2 = this.effectCard.children;
        for (let i = 0; i < nodeList2[cols * 4 + index].children.length; i++) {
            if (this.wheelList[cols].roleIdList[targetIdx + 3] >= 12) {
                cc.log(3);
                nodeList2[cols * 4 + index + 3].children[i].active = i == (this.wheelList[cols].roleIdList[targetIdx + 3] - 1);
            } else if (this.wheelList[cols].roleIdList[targetIdx + 2] >= 12) {
                cc.log(2);
                nodeList2[cols * 4 + index + 2].children[i].active = i == (this.wheelList[cols].roleIdList[targetIdx + 2] - 1);
            } else if (this.wheelList[cols].roleIdList[targetIdx + 1] >= 12) {
                cc.log(1);
                nodeList2[cols * 4 + index + 1].children[i].active = i == (this.wheelList[cols].roleIdList[targetIdx + 1] - 1);
            } else if (this.wheelList[cols].roleIdList[targetIdx] >= 12) {
                cc.log(index);
                nodeList2[cols * 4 + index].children[i].active = i == (this.wheelList[cols].roleIdList[targetIdx] - 1);
            } else {
                nodeList2[cols * 4 + index].children[i].active = i == (this.wheelList[cols].roleIdList[targetIdx] - 1);
            }
        }
    },

    closeAnim(cols, index) {
        let targetIdx = index + 1;
        this.wheelList[cols].rolePbList[targetIdx].children[0].active = true;
        //添加结束
        let nodeList = this.effectLight.children;
        nodeList[cols * 4 + index].active = false;
        let nodeList2 = this.effectCard.children;
        for (let i = 0; i < nodeList2[cols * 4 + index].children.length; i++) {
            nodeList2[cols * 4 + index].children[i].active = false;
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
        for (let i = 0; i < 5; i++) {
            line[i] = [];
        }
        for (let i in list) {
            line[i % 5][3 - parseInt(i / 5)] = list[i];
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
        this.coinLineLab.node.active = false;
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