const BETNUM = [2, 10, 100, 250]; //单注值
const LINES = 20; //线数
const BET = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
import { GameGlobal } from "./../../../Script/utils/GameGlobal";
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
            displayName: '角色角色详情Pb',
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
            displayName: '赢得倍率',
        },
        mulFreeListNode: {
            default: null,
            type: cc.Node,
            displayName: '免费模式赢得倍率',
        },
        maskEffectNode: {
            default: null,
            type: cc.Node,
            displayName: '遮罩特效',
        },
        boomEffectNode: {
            default: null,
            type: cc.Node,
            displayName: '爆炸特效',
        },
        winEffectNode: {
            default: null,
            type: cc.Node,
            displayName: '中奖特效',
        },
        freeBgNode: {
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
        this.net = this.node.getComponent('majianghule2PGNetwork');
        this.audio = this.node.getComponent('majianghule2PGAudio');
        this.wheelList = [];
        this.bet = 0;
        this.betNum = 0;
        this.sumIdx = 0;
        this.betSum = 0;//累计下注计算
        this.auto = false;
        this.status = 0;
        this.bigWinBoo = false;
        this.freeTimes = 0;
        this.freeTotalTimes = 0;
        this.rollResult = [];
        this.rollIndex = 0;
        this.winTotal = 0;
        this.lotteryRes = null;
        this.lotteryView = null;
        this.stopFree = false;
        this.isFreeStart = false;
        this.isFreeEnd = false;

        // if (GameGlobal.LANG == 'cn') {
        //     this.helpUI.children[2].active = true
        //     this.help2UI.children[2].active = true
        // }
        // else {
        //     this.helpUI.children[3].active = true
        //     this.help2UI.children[3].active = true
        // }
    },

    getUrlCode_Function(name) {
        var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
        var result = window.location.search.substr(1).match(reg);
        return result ? decodeURIComponent(result[2]) : null;
    },

    getLanguage() {
        return this.getUrlCode_Function('lang')
    },

    start() {
        this.slotCtrl.lblLines.string = LINES;
        this.setCombo(0);
        this.slotCtrl.updateBet(0);
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
                    console.log("this.status == " + this.status);
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
                this.freeBgNode.active = false;
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
        for (let i = 0; i < this.mulListNode.children.length; i++) {
            this.mulListNode.children[i].children[0].active = i == x - 1;
        }

        for (let i = 0; i < this.mulFreeListNode.children.length; i++) {
            this.mulFreeListNode.children[i].children[0].active = i == x - 1;
        }
    },

    stateCallBack() {
        for (let i in this.wheelList) {
            if (this.wheelList[i].status != 2) {
                return;
            }
        }
        
        //结束当前轮盘
        if (this.lotteryRes.winscore > 0) {
            this.slotCtrl.setSpinAnim(3);
        } else {
            this.slotCtrl.setSpinAnim(2);
        }

        //结束当前轮盘
        this.status = 2;
        let rIndex = this.rollIndex;
        let comboCount = this.lotteryRes.viewarray.length;
        // this.slotCtrl.lblUserCoin.string = Helper.fixNum(this.lotteryRes.userscore);
        if (this.bIsFreeGame) {
            this.freeGameCoin += this.lotteryRes.winscore;
        }

        console.log("结束旋转", comboCount);

        let nTm = 2
        if (comboCount > 1) {
            nTm = 4
        }

        this.schedule(() => {
            this.lotteryView = this.lotteryRes.viewarray.shift();
            if (this.lotteryView.nWinLinesDetail.length == 0) {
                this.unscheduleAllCallbacks();
                this.rollEnd();
                return;
            } else if (rIndex == this.rollIndex) {
                this.setCombo(this.lotteryView.combo_num ? this.lotteryView.combo_num : 0);
                this.playWinAnim();
            }
        }, nTm, comboCount, 1);
    },

    rollEnd() {
        console.log("rollEnd !!!!");
        //免费次数
        this.setCombo(0);
        this.winNode.children[1].active = false;
        this.winNode.children[2].active = true;
        this.winNode.getChildByName("lab").getComponent(cc.Label).string = Helper.fixNum(this.winTotal);
        if (this.lotteryRes.getFreeTime.bFlag) {
            this.bIsFreeGame = true;
            this.auto = false;
            this.freeTimes = this.lotteryRes.getFreeTime.nFreeTime - 1;
            this.freeTotalTimes = this.lotteryRes.getFreeTime.nFreeTime;
            this.scheduleOnce(() => {
                this.closeShine();
                this.startFreeGame();
            }, 3);
        }
        this.status = 0;
        let rIndex = this.rollIndex;
        this.slotCtrl.setSpinAnim(0);
        this.scheduleOnce(() => {
            if (!this.status && this.stopFree) {
                this.stopFree = false;
                this.stopFreeTimes();
                this.auto = false;
            }
            this.tipNode.active = true;
            this.winNode.active = false;
            if (this.auto && !this.status && this.freeTimes > 0) {
                this.freeTimes--;
                this.slotCtrl.Btn_free.getChildByName('auto_lab').getComponent(cc.Label).string = this.freeTimes;
                if (this.freeTimes == 0) {
                    this.stopFree = true;
                    this.slotCtrl.Btn_free.children[0].active = false;
                    this.slotCtrl.Btn_free.children[1].active = true;
                }
                this.sendRoll();
            }
            if (rIndex == this.rollIndex) {
                this.auto && this.freeTimes == 0 && this.sendRoll();
            }
        }, 0.2);
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
        if (this.lotteryView.win > 0) {
            this.winTotal += this.lotteryView.win;
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

        this.scheduleOnce(() => {
            if (rIndex == this.rollIndex) {
                this.closeShine();
                for (let i = 0; i < this.lotteryView.nHandCards.length; i++) {
                    this.closeAnim(i % 5, (this.lotteryView.nHandCards.length / 5 - 1) - parseInt(i / 5));
                }
                if (!list[animIndex]) {
                    return;
                }

                // for (let i in this.maskEffectNode.children) {
                //     this.maskEffectNode.children[i].active = true;
                // }

                for (let i=0; i<5; i++){
                    this.wheelList[i].showAllMasktEffect(true)
                }

                let tDeleteIndex = []
                for (let i = 0; i < 5; i++) {
                    tDeleteIndex[i] = [];
                }
                
                for (let j in list[animIndex]) {
                    let nDeleteIndex = this.showAnim(list[animIndex][j] % 5, (this.lotteryView.nHandCards.length / 5 - 1) - parseInt(list[animIndex][j] / 5));
                    tDeleteIndex[list[animIndex][j] % 5].push(nDeleteIndex)
                }
                
                this.scheduleOnce(() => {
                    for (let i in this.wheelList) {
                        this.wheelList[i].deleteRollNodes(tDeleteIndex[i]) 
                        this.wheelList[i].vibrateAction();
                    }
                }, 2.9);
                animIndex++;
            }
        }, 0.5);
    },

    //免费次数有关
    startFreeGame() {
        console.log("start free game !!!!");

        this.audio.playBgm(1);
        this.auto = false;
        this.isFreeStart = false;
        this.freeGameCoin = 0;
        this.bIsFreeGame = true;
        this.freeBgNode.active = true;
        this.mulListNode.active = false;
        this.mulFreeListNode.active = true;
        this.slotCtrl.setFreeGameUI(true);
        this.freeBgNode.getChildByName('lab').getComponent(cc.Label).string = this.freeTimes + 1;

        for (let i in this.wheelList) {
            this.wheelList[i].initWheel();
        }
        this.slotCtrl.Btn_free.active = true;
        this.slotCtrl.Btn_free.children[0].active = true;
        this.slotCtrl.Btn_free.children[1].active = false;
        this.slotCtrl.Btn_free.getChildByName('auto_lab').getComponent(cc.Label).string = this.freeTimes;
        if (this.freeTimes == 0) {
            this.stopFree = true;
            this.slotCtrl.Btn_free.children[0].active = false;
            this.slotCtrl.Btn_free.children[1].active = true;
        }
        this.scheduleOnce(() => {
            if (!this.isFreeStart) {
                this.auto = true;
                this.freeBgNode.active = false;
                this.sendRoll();
            }
        }, 5);
    },

    stopFreeTimes() {
        this.audio.playBgm(0);
        this.auto = false;
        this.isFreeEnd = false;
        this.mulListNode.active = true;
        this.mulFreeListNode.active = false;
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
                this.bIsFreeGame = false;
            }
        }, 5);
    },

    //0-5 0-2
    showAnim(cols, index) {
        this.audio.playBW();
        let targetIdx = this.wheelList[cols].argLen - index;
        this.scheduleOnce(() => {
            // if(!this.wheelList[cols] || !this.wheelList[cols].rolePbList[targetIdx] || !this.wheelList[cols].rolePbList[targetIdx].children) {
            //     console.log('输出异常 B ', cols, targetIdx)
            // }

            //判断是否为普通牌
            if (this.wheelList[cols].rolePbList[targetIdx].children[0].active) {
                if (this.wheelList[cols].roleIdList[targetIdx] < 9) {
                    let animNode = this.wheelList[cols].rolePbList[targetIdx].children[1].getComponent(cc.Animation);
                    this.wheelList[cols].rolePbList[targetIdx].children[0].active = false;
                    this.wheelList[cols].rolePbList[targetIdx].children[1].active = true;
                    animNode.play();
                }
            } else if (this.wheelList[cols].rolePbList[targetIdx].children[2].active) {//黄金牌
                if (this.wheelList[cols].roleIdList[targetIdx] < 9) {
                    let animNode = this.wheelList[cols].rolePbList[targetIdx].children[3].getComponent(cc.Animation);
                    this.wheelList[cols].rolePbList[targetIdx].children[2].active = false;
                    this.wheelList[cols].rolePbList[targetIdx].children[3].active = true;
                    animNode.play();
                }
            }
            this.scheduleOnce(() => {
                this.wheelList[cols].rolePbList[targetIdx].children[4] && (this.wheelList[cols].rolePbList[targetIdx].children[4].active = false);
                this.wheelList[cols].rolePbList[targetIdx].children[1].active = false;
                let nodeList = this.boomEffectNode.children;
                nodeList[cols * 5 + 4 - index].active = true;
                let spineNode = nodeList[cols * 5 + 4 - index].children[0].getComponent(sp.Skeleton);
                spineNode.setAnimation(0, "winCoin", false);
                this.wheelList[cols].hideHightEffect()
                // let nodeList2 = this.winEffectNode.children;
                // for (let i in nodeList2) {
                //     nodeList2[i].active = false;
                // }
                // for (let i in this.maskEffectNode.children) {
                //     this.maskEffectNode.children[i].active = false;
                // }

                for (let i=0; i<5; i++){
                    this.wheelList[i].showAllMasktEffect(false)
                }

            }, 0.3);
            this.scheduleOnce(() => {
                this.wheelList[cols].changeRoll(targetIdx, this.wheelList[cols].rolePbList[targetIdx]);
                // console.log(cols, index);
            }, 1);
        }, 1);
        //添加结束
        // let nodeList2 = this.winEffectNode.children;
        // nodeList2[cols * 5 + 4 - index].active = true;
        this.wheelList[cols].showHighEffect(this.wheelList[cols].rolePbList[targetIdx])

        // let nodeList3 = this.maskEffectNode.children;
        // nodeList3[cols * 5 + 4 - index].active = false;
        this.wheelList[cols].hideMaskEffect(this.wheelList[cols].rolePbList[targetIdx])

        return targetIdx
    },

    closeAnim(cols, index) {
        // if(!this.wheelList[cols] || !this.wheelList[cols].rolePbList[index] || !this.wheelList[cols].rolePbList[index].children) {
        //     console.log('输出异常 A ', cols, index)
        // }

        let anim = this.wheelList[cols].rolePbList[index].getComponent(cc.Animation);
        anim.setCurrentTime(0);
        anim.stop();
        //添加结束
        let nodeList = this.boomEffectNode.children;
        nodeList[cols * 5 + 4 - index].active = false;
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
                        if (wCards[i - 5] && list[key - 1].goldCards.indexOf(i - 5) == -1) {
                            num--;
                        }
                        if (wCards[i - 10] && list[key - 1].goldCards.indexOf(i - 10) == -1) {
                            num--;
                        }
                        if (wCards[i - 15] && list[key - 1].goldCards.indexOf(i - 15) == -1) {
                            num--;
                        }
                        if (wCards[i - 20] && list[key - 1].goldCards.indexOf(i - 20) == -1) {
                            num--;
                        }
                        if (hCards[i - 5 * num] != 10) {
                            line[(i % 5)].push(hCards[i - 5 * num]);
                        }
                    }

                }
            } else {
                for (let i in hCards) {
                    line[4 - (i % 5)][parseInt(i / 5)] = hCards[24 - i];
                    for (let j = 0; j < list[key]["goldCards"].length; j++) {
                        if (list[key]["goldCards"][j] == 24 - i) {
                            line[5 - (i % 5)][parseInt(i / 5)] = hCards[24 - i] + 100;
                        }
                    }
                }
            }
        }
        // console.log(line);
        this.checkResultList(line);

        this.beginRoll(line);
    },

    //检查牌组
    checkResultList(list) {
        let newList = [[], [], [], [], []];
        for (let i = 0; i < list.length; i++) {
            for (let j = 0; j < list[i].length; j++) {
                switch (list[i][j]) {
                    case 1:
                        newList[i].push("二条");
                        break;
                    case 2:
                        newList[i].push("二筒");
                        break;
                    case 3:
                        newList[i].push("五条");
                        break;
                    case 4:
                        newList[i].push("五筒");
                        break;
                    case 5:
                        newList[i].push("八万");
                        break;
                    case 6:
                        newList[i].push("白板");
                        break;
                    case 7:
                        newList[i].push("红中");
                        break;
                    case 8:
                        newList[i].push("发财");
                        break;
                    case 9:
                        newList[i].push("免费");
                        break;
                    case 101:
                        newList[i].push("金二条");
                        break;
                    case 102:
                        newList[i].push("金二筒");
                        break;
                    case 103:
                        newList[i].push("金五条");
                        break;
                    case 104:
                        newList[i].push("金五筒");
                        break;
                    case 105:
                        newList[i].push("金八万");
                        break;
                    case 106:
                        newList[i].push("金白板");
                        break;
                    case 107:
                        newList[i].push("金红中");
                        break;
                    case 108:
                        newList[i].push("金发财");
                        break;
                }
            }
        }
        cc.log(newList);
    },

    beginRoll(line) {
        if (!this.auto) {
            this.slotCtrl.Btn_start.getComponent(cc.Button).interactable = true;
        }
        this.status = 1;
        for (let i in this.wheelList) {
            this.wheelList[i].startRoll(...line[i]);
        }
    },

    closeShine() {
        let nodeList1 = this.boomEffectNode.children;
        // let nodeList2 = this.winEffectNode.children;
        for (let i in nodeList1) {
            nodeList1[i].active = false;
        }
        // for (let i in nodeList2) {
        //     nodeList2[i].active = false;
        // }

        for (let i=0; i<5; i++){
            this.wheelList[i].hideHightEffect()
        }
        
    },

    sendRoll() {
        this.rollIndex++;
        this.closeShine();
        this.slotCtrl.unscheduleAllCallbacks();
        this.slotCtrl.closeBigWin();
        this.winTotal = 0;
        this.autoTimes = this.autoTimes > 0 ? this.autoTimes - 1 : 0;
        if (this.freeTimes == 0 && this.autoTimes == 0) {
            this.auto = false;
        }
        this.slotCtrl.Btn_stopAuto.active = this.auto;
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

    updateRecord(data) {
        data = data.splice(0, 50)  
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

    setPool(coin) {
        this.slotCtrl.jackpot_lab.string = Helper.fixNum(coin);
    },

    refreshPool(coin) {
        this.slotCtrl.jackpot_lab.string = Helper.fixNum(coin);
    },

});