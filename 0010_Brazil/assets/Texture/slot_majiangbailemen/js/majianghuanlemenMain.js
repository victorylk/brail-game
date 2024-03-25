const BETNUM = 200; //单注值
const LINES = 20; //线数
const BET = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
cc.Class({
    extends: cc.Component,

    properties: {
        rolePb: {
            default: [],
            type: cc.Prefab,
            displayName: '滚轮角色Pb',
        },

        helpUI: {
            default: null,
            type: cc.Node,
            displayName: 'help界面',
        },

        comboNode: {
            default: null,
            type: cc.Node,
            displayName: '连击节点',
        },

        //免费相关
        freeHideNode: {
            default: [],
            type: cc.Node,
            displayName: '免费模式隐藏内容',
        },
        freeShowNode: {
            default: [],
            type: cc.Node,
            displayName: '免费模式显示内容',
        },
        freeSpineAnim: {
            default: null,
            type: cc.Node,
            displayName: '免费模式开场动画',
        },
    },

    onLoad() {
        cc.view.setOrientation(cc.macro.ORIENTATION_PORTRAIT);
        this.playerInfo = require("PlayerInfo").getInstant;
        this.slotCtrl = cc.find("Canvas/Slot_Control_03").getComponent('slot_Ctrl'); //newSlot
        this.slotCtrl.init(this); //newSlot
        this.net = this.node.getComponent('majianghuanlemenNetwork');
        this.audio = this.node.getComponent('majianghuanlemenAudio');
        this.wheelList = [];
        this.freeWheelList = [];
        this.bet = 0;
        this.auto = false;
        this.status = 0;
        this.bigWinResList = [3, 1, 2];
        this.bigWinCard = 0;
        this.bigWinCoin = 0;
        this.bigWinBoo = false;
        this.freeTimes = 0;
        this.rollResult = [];
        this.rollIndex = 0;
        this.lotteryRes = null;
        this.lotteryView = null;
        this.stopFree = false;
    },

    start() {
        this.slotCtrl.lblLines.string = LINES;
        this.setCombo(0);
        this.setBet();
    },

    update() {
        if (this.status == 0 && !this.slotCtrl.Btn_start.children[0].active) {
            this._showBtnAnimTime++;
            if (this._showBtnAnimTime >= 300) {
                this._showBtnAnimTime = 0;
                this.slotCtrl.Btn_start.children[0].active = true;
            }
        }
    },

    onCLick(event, args) {
        switch (args) {
            case "roll":
                if (this.freeTimes > 0 || this.bigWinBoo || this.stopFree) {
                    return;
                }
                if (!this.auto) {
                    console.log("this.status == " + this.status);
                    if (this.status == 0) {
                        this.sendRoll();
                    } else if (this.status == 1) {
                        // this.stopImmediately();
                    }
                }
                break;
            case "stopRoll":
                if (this.freeTimes > 0 || this.bigWinBoo || this.stopFree || this.bIsFreeGame || this.delayClick) {
                    return;
                }
                if (!this.auto) {
                    if (this.status == 1) {
                        this.delayClick = true;
                        this.scheduleOnce(() => {
                            this.delayClick = false;
                        }, 1);
                        this.stopImmediately();
                    }
                }
                break;
            case "add":
                if (this.freeTimes > 0 || this.bigWinBoo || this.stopFree || this.auto) {
                    return;
                }
                this.slotCtrl.addBet();
                this.bet += 1;
                this.bet = this.bet >= BET.length ? BET.length - 1 : this.bet;
                if (this.bet >= BET.length - 1) {
                    this.slotCtrl.maxBet();
                    this.slotCtrl.MaxCoin_bg.active = true;
                    this.slotCtrl.NonMaxCoin_bg.active = false;
                }
                this.setBet();
                break;
            case "dec":
                if (this.freeTimes > 0 || this.bigWinBoo || this.stopFree || this.auto) {
                    return;
                }
                this.slotCtrl.subBet();
                this.bet -= 1;
                this.bet = this.bet >= 0 ? this.bet : 0;
                if (this.bet < BET.length - 1) {
                    this.slotCtrl.MaxCoin_bg.active = false;
                    this.slotCtrl.NonMaxCoin_bg.active = true;
                }
                this.setBet();
                break;
            case "max":
                if (this.bet == BET.length - 1 || this.freeTimes > 0 || this.bigWinBoo || this.stopFree || this.auto) {
                    return;
                }
                this.slotCtrl.maxBet();
                this.bet = BET.length - 1;
                this.slotCtrl.MaxCoin_bg.active = true;
                this.slotCtrl.NonMaxCoin_bg.active = false;
                this.setBet();
                break;
            case "closeBigWin":
                this.audio.playBgm(0);
                this.bigWinResultAnim.node.active = false;
                this.bigWinNode.active = false;
                this.caiShenBg.active = false;
                break;
            case "help":
                this.helpUI.active = true;
                break;
            case "closeHelp":
                this.helpUI.active = false;
                break;
            case "exitGame":
                this.net.socket.disconnect();
                cc.director.loadScene(window.hallName);
                break;
        }
    },

    startAuto(n) {
        if (this.freeTimes > 0 || this.bigWinBoo || this.stopFree) {
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

    setCombo(x) {
        let nodeList = this.comboNode.children;
        for (let i = 0; i < nodeList.length; i++) {
            nodeList[i].children[0].active = (i < x);

        }
    },

    setBet() {
        this.slotCtrl.lblCurBet.string = Helper.fixNum(BET[this.bet] * BETNUM);
        this.slotCtrl.lineLv_lab.string = this.bet + 1;
    },

    stateCallBack() {
        if (this.freeTimes > 0) {
            for (let i in this.freeWheelList) {
                if (this.freeWheelList[i].status != 2) {
                    return;
                }
            }
        } else {
            for (let i in this.wheelList) {
                if (this.wheelList[i].status != 2) {
                    return;
                }
            }
        }

        console.log("结束旋转");

        //结束当前轮盘
        this.status = 2;
        let rIndex = this.rollIndex;
        let comboCount = this.lotteryRes.viewarray.length;
        this.slotCtrl.lblUserCoin.string = Helper.fixNum(this.lotteryRes.userscore);
        this.schedule(() => {
            this.lotteryView = this.lotteryRes.viewarray.shift();
            if (this.lotteryView.nWinLinesDetail.length == 0) {
                this.unscheduleAllCallbacks();
                this.rollEnd();
                if (!this.auto) {
                    this.slotCtrl.Btn_start.active = true;
                    this.slotCtrl.Btn_stop.active = false;
                }
                return;
            } else if (rIndex == this.rollIndex) {
                this.setCombo(this.lotteryView.combo_num ? this.lotteryView.combo_num : 0);
                this.playWinAnim();
                if (!this.auto) {
                    this.slotCtrl.Btn_start.active = true;
                    this.slotCtrl.Btn_stop.active = false;
                }
            }
        }, 5, comboCount, 1);
    },

    rollEnd() {
        console.log("rollEnd !!!!");
        //免费次数
        if (this.lotteryRes.getFreeTime.bFlag) {
            this.freeTimes = this.lotteryRes.getFreeTime.nFreeTime;
            this.scheduleOnce(() => {
                this.closeShine();
                this.startFreeGame();
            }, 1);
        }
        this.status = 0;
        let rIndex = this.rollIndex;
        this.scheduleOnce(() => {
            if (!this.status && this.stopFree) {
                this.stopFree = false;
                this.stopFreeTimes();
                this.auto = false;
            }
            if (!this.status && this.freeTimes > 0) {
                this.freeTimes--;
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
        }, 2);
    },
    playWinAnim() {
        if (!this.lotteryView) {
            return;
        }
        //动画结束后自动roll
        let allLine = [];
        for (let i in this.lotteryView.nWinCards) {
            if (this.lotteryView.nWinCards[i]) {
                allLine.push(i);
            }
        }
        let lines = this.lotteryView.nWinLinesDetail;
        let rIndex = this.rollIndex;
        let list = (this.freeTimes > 0 || this.stopFree) ? [allLine] : [allLine, ...lines];
        if (this.lotteryRes.winscore > 0) {
            this.slotCtrl.updateStateNode(3);
            //判断播放金币掉落动画
            if (this.lotteryRes.winscore > BET[this.bet] * BETNUM * 80) { //如果大于80倍赌注，就播放bigFull动画
                this.slotCtrl.playAnim_BigWin(this.lotteryRes.winscore);
                this.slotCtrl.playAnimWin(3, this.lotteryRes.winscore);
            } else if (this.lotteryRes.winscore > BET[this.bet] * BETNUM * 50) {
                this.slotCtrl.playAnim_SuperWin(this.lotteryRes.winscore);
                this.slotCtrl.playAnimWin(2, this.lotteryRes.winscore);
            } else if (this.lotteryRes.winscore > BET[this.bet] * BETNUM * 30) {
                this.slotCtrl.playAnim_BigWin(this.lotteryRes.winscore);
                this.slotCtrl.playAnimWin(1, this.lotteryRes.winscore);
            } else {
                this.slotCtrl.playAnimWin(0, this.lotteryRes.winscore);
            }
        } else {
            this.slotCtrl.updateStateNode(2);
        }
        let animIndex = 0;

        this.scheduleOnce(() => {
            if (rIndex == this.rollIndex) {
                this.closeShine();
                for (let i = 0; i < this.lotteryView.nHandCards.length; i++) {
                    this.closeAnim(i % 5, (this.lotteryView.nHandCards.length / 5 - 1) - parseInt(i / 5));
                }
                if (!list[animIndex]) {
                    return;
                }

                for (let j in list[animIndex]) {
                    this.showAnim(list[animIndex][j] % 5, (this.lotteryView.nHandCards.length / 5 - 1) - parseInt(list[animIndex][j] / 5));
                }
                animIndex++;
            }
        }, 1)
    },

    //免费次数有关
    startFreeGame() {
        console.log("start free game !!!!");

        this.audio.playBgm(1);
        this.auto = false;
        this.freeGameCoin = 0;
        this.bIsFreeGame = true;

        for (let i in this.freeHideNode) {
            this.freeHideNode[i].active = false;
        }

        for (let i in this.freeShowNode) {
            this.freeShowNode[i].active = true;
        }

        this.freeSpineAnim.active = true;
        this.freeSpineAnim.children[0].getComponent(sp.Skeleton).setAnimation(0, "trans", false);

        for (let i in this.wheelList) {
            this.wheelList[i].initWheel();
        }
        this.freeTimes--;
        this.slotCtrl.Btn_free.active = true;
        this.slotCtrl.Btn_free.getChildByName('auto_lab').getComponent(cc.Label).string = this.freeTimes;
        if (this.freeTimes == 0) {
            this.stopFree = true;
        }
        this.scheduleOnce(() => {
            this.freeSpineAnim.active = false;
            this.auto = true;
            this.sendRoll();
        }, 6);
    },

    stopFreeTimes() {
        this.audio.playBgm(0);
        this.auto = false;

        for (let i in this.freeHideNode) {
            this.freeHideNode[i].active = true;
        }

        for (let i in this.freeShowNode) {
            this.freeShowNode[i].active = false;
        }

        for (let i in this.wheelList) {
            this.wheelList[i].initWheel();
        }
        this.slotCtrl.Btn_free.active = false;
        this.scheduleOnce(() => {
            this.bIsFreeGame = false;
        }, 2);
    },

    //0-5 0-2
    showAnim(cols, index) {
        this.audio.playBW();
        if (this.freeTimes > 0) {
            this.freeWheelList[cols].rolePbList[index].getComponent(cc.Animation).play();
            this.freeWheelList[cols].rolePbList[index].children[0].active = false;
            this.freeWheelList[cols].rolePbList[index].children[1].active = true;
            this.freeWheelList[cols].rolePbList[index].children[1].getComponent(sp.Skeleton).setAnimation(0, "win", false);
            this.scheduleOnce(() => {
                this.freeWheelList[cols].changeRoll(index);
                this.freeWheelList[cols].rolePbList[index].children[1].getComponent(sp.Skeleton).addAnimation(0, "end", false);
            }, 2);
        } else {
            this.wheelList[cols].rolePbList[index].getComponent(cc.Animation).play();
            this.wheelList[cols].rolePbList[index].children[0].active = false;
            this.wheelList[cols].rolePbList[index].children[1].active = true;
            this.wheelList[cols].rolePbList[index].children[1].getComponent(sp.Skeleton).setAnimation(0, "win", false);
            this.scheduleOnce(() => {
                this.wheelList[cols].changeRoll(index);
                this.wheelList[cols].rolePbList[index].children[1].getComponent(sp.Skeleton).addAnimation(0, "end", false);
            }, 2);
        }
    },

    closeAnim(cols, index) {
        let anim = this.wheelList[cols].rolePbList[index].getComponent(cc.Animation);
        anim.setCurrentTime(0);
        anim.stop();
    },

    pushRollData(list) {
        let line = [];
        for (let i = 0; i < 5; i++) {
            line[i] = [];
        }

        for (const key in list) {
            let hCards = list[key].nHandCards;
            if (key != 0) {
                let wCards = list[key - 1].nWinCards;
                for (let i = hCards.length - 1; i >= 0; i--) {
                    if (wCards[i]) {
                        let num = Math.floor(i / 5);
                        if (wCards[i - 5]) {
                            num--;
                        }
                        if (wCards[i - 10]) {
                            num--;
                        }
                        if (wCards[i - 15]) {
                            num--;
                        }
                        line[(i % 5)].push(hCards[i - 5 * num]);
                    }

                }
            } else {
                for (let i in hCards) {
                    line[4 - (i % 5)][parseInt(i / 5)] = hCards[19 - i];
                }
            }
        }
        console.log(line);

        this.beginRoll(line);
    },

    beginRoll(line) {
        if (!this.auto) {
            this.slotCtrl.Btn_start.active = false;
            this.slotCtrl.Btn_stop.active = true;
        }
        this.status = 1;
        for (let i in this.wheelList) {
            this.wheelList[i].startRoll(...line[i]);
        }
    },

    freeRoll(list) {
        let line = [];
        for (let i = 0; i < 5; i++) {
            line[i] = [];
        }

        for (const key in list) {
            let hCards = list[key].nHandCards;
            if (key != 0) {
                let wCards = list[key - 1].nWinCards;
                for (let i = hCards.length - 1; i >= 0; i--) {
                    if (wCards[i]) {
                        let num = Math.floor(i / 5);
                        if (wCards[i - 5]) {
                            num--;
                        }
                        if (wCards[i - 10]) {
                            num--;
                        }
                        if (wCards[i - 15]) {
                            num--;
                        }
                        if (wCards[i - 20]) {
                            num--;
                        }
                        if (wCards[i - 25]) {
                            num--;
                        }
                        if (wCards[i - 30]) {
                            num--;
                        }
                        if (wCards[i - 35]) {
                            num--;
                        }
                        line[(i % 5)].push(hCards[i - 5 * num]);
                    }

                }
            } else {
                for (let i in hCards) {
                    line[4 - (i % 5)][parseInt(i / 5)] = hCards[39 - i];
                }
            }
        }

        if (!this.auto) {
            this.slotCtrl.Btn_start.active = false;
            this.slotCtrl.Btn_stop.active = true;
        }
        this.status = 1;
        for (let i in this.freeWheelList) {
            this.freeWheelList[i].startRoll(...line[i]);
        }
    },

    closeShine() {

    },

    sendRoll() {
        this.rollIndex++;
        this.closeShine();
        this.autoTimes = this.autoTimes > 0 ? this.autoTimes - 1 : 0;
        this.slotCtrl.Btn_start.children[0].active = false;
        if (this.freeTimes == 0 && this.autoTimes == 0) {
            this.auto = false;
        }
        this.slotCtrl.Btn_stopAuto.active = this.auto;
        this.slotCtrl.Btn_start.active = !this.auto;
        this.slotCtrl.updateStateNode(1);
        this.slotCtrl.Btn_stopAuto.children[0].getComponent(cc.Label).string = this.autoTimes;
        this.net.socket.emit('lottery', JSON.stringify({
            bet: this.bet,
            nBetList: [BET[this.bet] * BETNUM]
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

});