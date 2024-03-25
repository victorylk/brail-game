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

        wildEffectPb: {
            default: null,
            type: cc.Prefab,
            displayName: '万能特效Pb',
        },

        wildEndEffect: {
            default: null,
            type: cc.Node,
            displayName: '万能结束光效',
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
        tigerAnim: {
            default: null,
            type: cc.Node,
            displayName: '老虎动画',
        },
        leafNode: {
            default: null,
            type: cc.Node,
            displayName: '花瓣存放空间',
        },
        leafPb: {
            default: null,
            type: cc.Prefab,
            displayName: '花瓣预制体',
        },
    },

    onLoad() {
        this.playerInfo = require("PlayerInfo").getInstant;
        this.slotCtrl = cc.find("Canvas/Slot_Control_05").getComponent('slot_Ctrl_05'); //newSlot
        this.slotCtrl.init(this); //newSlot
        this.slotCtrl.initBetContent(BETNUM, BET, LINES);
        this.net = this.node.getComponent('jungledelightNetwork');
        this.audio = this.node.getComponent('jungledelightAudio');
        this.wheelList = [];
        this.bet = 0;
        this.betNum = 0;
        this.sumIdx = 0;
        this.betSum = 0;//累计下注计算
        this.auto = false;
        this.autoTimes = 0;
        this.status = 0;
        this.winLinePos = [50, 250, -150, 50, 50];
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
        //监听老虎动画播放
        this.tigerAnim.getComponent(sp.Skeleton).setCompleteListener((event) => {
            switch (event.animation.name) {
                case "idle2":
                    this.tigerAnim.getComponent(sp.Skeleton).setAnimation(0, "idle", true);
                    break;
                case "idle3":
                    this.tigerAnim.getComponent(sp.Skeleton).setAnimation(0, "idle", true);
                    break;
                case "idle4":
                    this.tigerAnim.getComponent(sp.Skeleton).setAnimation(0, "idle", true);
                    break;
                case "idle5":
                    this.tigerAnim.getComponent(sp.Skeleton).setAnimation(0, "idle", true);
                    break;
                case "win":
                    this.tigerAnim.getComponent(sp.Skeleton).setAnimation(0, "idle", true);
                    break;
                case "win2":
                    this.tigerAnim.getComponent(sp.Skeleton).setAnimation(0, "idle", true);
                    break;
                case "wild_collect":
                    this.tigerAnim.getComponent(sp.Skeleton).setAnimation(0, "idle", true);
                    break;
            }
        });
        //定期生成花瓣
        this.schedule(() => {
            this.createLeafAnim();
        }, 0.7);
    },

    update() {
        this.betSum = BET[this.bet] * BETNUM[this.betNum] * LINES;
    },
    //创建花瓣
    createLeafAnim() {
        let rx = -150 + Math.floor(Math.random() * 600 - 300);
        let ry = 770 + Math.floor(Math.random() * 100 - 50);
        let tx = 410;
        let ty = Math.floor(Math.random() * 600 - 300);
        let rScale = (Math.floor(Math.random() * 5 + 5)) / 10;
        let newNode = cc.instantiate(this.leafPb);
        newNode.position = cc.v2(rx, ry);
        newNode.scale = rScale;
        this.leafNode.addChild(newNode);
        newNode.runAction(cc.sequence(cc.moveTo(5, tx, ty), cc.callFunc(() => {
            newNode.destroy();
        })));
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
                //万能牌特效
                for (let i in this.wheelList) {
                    let length = this.wheelList[i].roleIdList.length;
                    for (let j = 2; j <= 4; j++) {
                        if (this.wheelList[i].roleIdList[length - j] == 7) {
                            this.wheelList[i].rolePbList[length - j].children[0].getComponent(sp.Skeleton).setAnimation(0, "idle", true);
                            let pb = cc.instantiate(this.wildEffectPb);
                            let newVec2 = this.wheelList[i].rolePbList[length - j].convertToWorldSpaceAR(cc.v2(0, 0));
                            let p = this.node.convertToNodeSpaceAR(newVec2);
                            pb.position = p;
                            this.node.addChild(pb);
                            pb.runAction(cc.sequence(
                                cc.callFunc(() => {
                                    pb.children[0].getComponent(cc.Animation).play();
                                }),
                                cc.delayTime(1),
                                cc.callFunc(() => {
                                    pb.children[0].active = false;
                                    this.tigerAnim.getComponent(sp.Skeleton).setAnimation(0, "wild_collect", false);
                                }),
                                cc.jumpTo(0.3, cc.v2(-167, 542), 100, 1),
                                cc.callFunc(() => {
                                    this.wildEndEffect.active = true;
                                    this.wildEndEffect.getComponent(cc.Animation).play();
                                }),
                                cc.removeSelf()
                            ))
                        }
                    }
                }
            }, 0.1);

            let rIndex = this.rollIndex;
            // this.slotCtrl.lblUserCoin.string = Helper.fixNum(this.lotteryRes.userscore);
            if (this.bIsFreeGame) {
                this.freeGameCoin += this.lotteryRes.winscore;
            }
            let freeFlag = this.lotteryRes.viewarray.getFreeTime.bFlag;
            this.scheduleOnce(() => {
                if (rIndex == this.rollIndex) {
                    this.playWinAnim(freeFlag);
                }
            }, 1.2);

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
            this.win2BG.active = (this.lotteryRes.winscore > this.betSum * 3 && this.lotteryRes.winscore < this.betSum * 5);
            this.win3BG.active = this.lotteryRes.winscore >= this.betSum * 5;
            if (this.lotteryRes.winscore < this.betSum * 3) {
                this.tigerAnim.getComponent(sp.Skeleton).setAnimation(0, "win", false);
            } else {
                this.tigerAnim.getComponent(sp.Skeleton).setAnimation(0, "win2", false);
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
                    //中奖数字和位置
                    this.coinLineLab.node.active = true;
                    this.coinLineLab.node.y = this.winLinePos[this.lotteryRes.viewarray.nWinLines[animIndex - 1]];
                    this.coinLineLab.string = Helper.fixNum(this.lotteryRes.viewarray.nWinDetail[animIndex - 1]);

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
            this.win2BG.active = false;
            this.win3BG.active = false;
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
        this.audio.playBW();
        let length = this.wheelList[cols].roleIdList.length;
        for (let i in this.wheelList[cols].rolePbList[length - 2 - index].children) {
            this.wheelList[cols].rolePbList[length - 2 - index].children[i].active = false;
        }
        // this.wheelList[cols].rolePbList[length - 2 - index].getComponent("TempAnimation").playAnim();

        //添加结束
        let nodeList = this.effectLight.children;
        nodeList[cols * 3 + index].active = true;

        let nodeList2 = this.effectCard.children;
        for (let i = 0; i < nodeList2[cols * 3 + index].children.length; i++) {
            nodeList2[cols * 3 + index].children[i].active = i == (this.wheelList[cols].roleIdList[length - 2 - index] - 1);
        }
        // nodeList2[cols * 3 + index].active = true;
    },

    closeAnim(cols, index) {
        let length = this.wheelList[cols].roleIdList.length;
        for (let i in this.wheelList[cols].rolePbList[length - 2 - index].children) {
            this.wheelList[cols].rolePbList[length - 2 - index].children[i].active = true;
        }
        // this.wheelList[cols].rolePbList[length - 2 - index].getComponent("TempAnimation").stopAnim();

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
        this.coinLineLab.node.active = false;
        this.wildEndEffect.active = false;
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