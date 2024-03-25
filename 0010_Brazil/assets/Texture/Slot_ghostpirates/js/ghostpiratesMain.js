const BETNUM = 25; //单注值
const LINES = 20; //线数
const BET = [1, 2, 3, 6, 12];
const COMB = [1, 5, 15, 40, 100, 500, 2000];
const FREE = [10, 20, 15, 10, 20, 12, 25, 10, 30, 12];
cc.Class({
    extends: cc.Component,

    properties: {
        lblUserCoin: {
            default: null,
            type: cc.Label,
            displayName: '用户金币',
        },
        lblBet: {
            default: null,
            type: cc.Label,
            displayName: '单注',
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
        lblWinCoin: {
            default: null,
            type: cc.Label,
            displayName: '本局赢得',
        },
        rolePb: {
            default: [],
            type: cc.Prefab,
            displayName: '滚轮角色Pb',
        },
        btnGray_list: {
            default: [],
            type: cc.Button,
            displayName: '按钮置灰列表',
        },
        sound_sp: {
            default: [],
            type: cc.SpriteFrame,
            displayName: '声音图标',
        },
        start_sp: {
            default: [],
            type: cc.SpriteFrame,
            displayName: '开始按钮图标',
        },
        startBtn: {
            default: null,
            type: cc.Sprite,
            displayName: '开始按钮Sprite',
        },
        effectAnimPr: {
            default: null,
            type: cc.Node,
            displayName: '中奖特效',
        },
        effectLines: {
            default: null,
            type: cc.Node,
            displayName: '中奖连线',
        },
        effectAnimFullA: {
            default: null,
            type: cc.Node,
            displayName: '中奖全屏特效A',
        },
        effectAnimFullB: {
            default: null,
            type: cc.Node,
            displayName: '中奖全屏特效B',
        },
        effectAnimBigFull: {
            default: null,
            type: cc.Node,
            displayName: '中大奖全屏特效',
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

        freeTimesNode: {
            default: null,
            type: cc.Node,
            displayName: '免费摇奖显示节点',
        },

        zhuanpanNode: {
            default: null,
            type: cc.Node,
            displayName: '转盘节点',
        },

        bigWinNode: {
            default: null,
            type: cc.Node,
            displayName: '大奖节点',
        },

        helpUI: {
            default: null,
            type: cc.Node,
            displayName: 'help界面',
        },

        audioBtn: {
            default: null,
            type: cc.Sprite,
            displayName: '声音按钮',
        },

        settingBtn: {
            default: [],
            type: cc.Node,
            displayName: '设置按钮',
        },
        autoBtn: cc.Node,
        stopAutoBtn: cc.Node,
    },

    onLoad() {
        cc.view.setOrientation(cc.macro.ORIENTATION_PORTRAIT);
        this.playerInfo = require("PlayerInfo").getInstant;
        this.net = this.node.getComponent('ghostpiratesNetwork');
        this.audio = this.node.getComponent('ghostpiratesAudio');
        this.wheelList = [];
        this.bet = 0;
        this.linesNum = LINES;
        this.auto = false;
        this.status = 0;
        this.zpStatus = 0;
        this.bigWinBoo = false;
        this.freeTimes = 0;
        this.freeType = 0;
        this.rollIndex = 0;
        this.lotteryRes = null;
        this.stopFree = false;
        this.freeGameCoin = 0;
        this.bIsFreeGame = false;
        this.delayClick = false;
        this.freeObj = null;
        this.bigWinNum = 0;
    },

    start() {
        this.lblLines.string = this.linesNum;
        this.lblWinCoin.string = '0.00';
        this.setBet();
        this.setBigWinShow(0);
        this.money = this.playerInfo.playerCoin;
        this.lblUserCoin.string = this.money.toFixed(2);
        this.anim_cb = null;
    },

    update() {
        if (!this.bIsFreeGame) {
            this.zhuanpanNode.angle -= 0.5;
        }
    },

    onCLick(event, args) {
        this.audio.playClick();
        switch (args) {
            case 'auto':
                if (this.freeTimes > 0 || this.bigWinBoo || this.stopFree || this.bIsFreeGame || this.delayClick) {
                    return;
                }
                this.auto = !this.auto;
                this.autoBtn.active = !this.auto;
                this.stopAutoBtn.active = this.auto;
                if (this.auto && this.status == 0) {
                    this.sendRoll();
                }
                break;
            case 'roll':
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
                        this.stopImmediately();
                    }
                }
                break;
            case 'add':
                if (this.freeTimes > 0 || this.bigWinBoo || this.stopFree || this.auto) {
                    return;
                }
                this.bet += 1;
                this.bet = this.bet >= BET.length ? BET.length - 1 : this.bet;
                this.setBet();
                break;
            case 'dec':
                if (this.freeTimes > 0 || this.bigWinBoo || this.stopFree || this.auto) {
                    return;
                }
                this.bet -= 1;
                this.bet = this.bet >= 0 ? this.bet : 0;
                this.setBet();
                break;
            case 'addLine':
                if (this.freeTimes > 0 || this.bigWinBoo || this.stopFree || this.auto) {
                    return;
                }
                this.linesNum += 1;
                this.linesNum = this.linesNum >= LINES ? LINES : this.linesNum;
                this.setBet();
                break;
            case 'decLine':
                if (this.freeTimes > 0 || this.bigWinBoo || this.stopFree || this.auto) {
                    return;
                }
                this.linesNum -= 1;
                this.linesNum = this.linesNum >= 1 ? this.linesNum : 1;
                this.setBet();
                break;
            case 'setting':
                this.settingBtn[0].active = !this.settingBtn[0].active;
                this.settingBtn[1].active = !this.settingBtn[1].active;
                break;
            case 'help':
                this.settingBtn[0].active = true;
                this.settingBtn[1].active = false;
                this.helpUI.active = true;
                break;
            case 'closeHelp':
                this.helpUI.active = false;
                break;
            case 'exitGame':
                this.net.socket.disconnect();
                cc.director.loadScene(window.hallName);
                break;
            case 'audio':
                this.settingBtn[0].active = true;
                this.settingBtn[1].active = false;
                this.audio.pInfo.musicControl = !this.audio.pInfo.musicControl;
                this.audioBtn.spriteFrame = this.audio.pInfo.musicControl ? this.sound_sp[0] : this.sound_sp[1];
                if (!this.audio.pInfo.musicControl) {
                    this.audio.stopAudio();
                } else {
                    if (this.freeTimes > 0) {
                        this.audio.playBgm(1);
                    } else {
                        this.audio.playBgm(0);
                    }
                }
                break;
        }
    },

    setBet() {
        this.lblBet.string = Helper.fixNum(BET[this.bet] * BETNUM);
        this.lblLines.string = this.linesNum;
        this.lblCurBet.string = "About to pay " + Helper.fixNum(BET[this.bet] * BETNUM * this.linesNum);
        for (let i = 2; i < this.bigWinNode.children.length; i++) {
            this.bigWinNode.children[i].getChildByName("lab").getComponent(cc.Label).string = Helper.fixNum(BET[this.bet] * BETNUM * this.linesNum * COMB[i - 2]);
        }
    },
    //设置按钮变化
    setBtnState(isStart) {
        for (let i in this.btnGray_list) {
            this.btnGray_list[i].interactable = !isStart;
        }
    },

    //设置大奖显示
    setBigWinShow(n) {
        this.bigWinNum += n;
        for (let i = 0; i < this.bigWinNode.children.length; i++) {
            this.bigWinNode.children[i].getChildByName("guang").active = false;
            this.bigWinNode.children[i].getChildByName("iconbg").active = false;
            this.bigWinNode.children[i].getChildByName("lab").color = new cc.Color(41, 56, 81);
            if (i < this.bigWinNum) {
                this.bigWinNode.children[i].getChildByName("iconbg").active = true;
                this.bigWinNode.children[i].getChildByName("lab").color = new cc.Color(255, 255, 255);
            }
        }
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
            let rIndex = this.rollIndex;
            this.startBtn.spriteFrame = this.start_sp[0];
            this.startBtn.node.getComponent(cc.Button).interactable = false;
            if (this.bIsFreeGame) {
                this.freeGameCoin += this.lotteryRes.winscore;
            }
            this.scheduleOnce(() => {
                if (rIndex == this.rollIndex) {
                    this.playWinAnim();
                }
            }, 1);

            if (this.lotteryRes.viewarray.getFreeTime.bFlag) {
                this.bIsFreeGame = true;
                if (this.freeTimes == 0) {
                    this.auto = false;
                    this.freeBeginNode.active = true;

                    let delay = 2;
                    if (this.lotteryRes.winscore > 0) {
                        delay = 3.5;
                    }
                    this.scheduleOnce(() => {
                        this.freeBeginNode.active = false;
                        this.FreeGameAnim();
                    }, delay);
                } else {
                    this.freeTimes = this.lotteryRes.viewarray.getFreeTime.nFreeTime;
                    this.stopFree = false;
                }
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
        let list = (this.freeTimes > 0 || this.stopFree || this.auto) ? [allLine] : [allLine, ...lines];
        hasWinBool = list.length - 1;
        if (this.lotteryRes.winscore > 0) {
            //播放恭喜字样动画
            this.effectAnimFullA.active = true;
            this.effectAnimFullA.getComponent(sp.Skeleton).clearTrack(0);
            this.effectAnimFullA.getComponent(sp.Skeleton).setAnimation(0, "win_en", false);
            //播放招财猫动画
            this.effectAnimFullB.active = true;
            let lbl_coin = this.effectAnimFullB.getChildByName("lbl_coin").getComponent(cc.Label);
            let addcoin = 0;
            this.schedule(() => {
                addcoin += this.lotteryRes.winscore / 50;
                if (addcoin > this.lotteryRes.winscore) {
                    addcoin = this.lotteryRes.winscore;
                }
                lbl_coin.string = "+" + Helper.fixNum(addcoin);
            }, 0, 50, 0.04);

            cc.tween(this.effectAnimFullB)
                .delay(2)
                .to(0.5, { scale: 0.6, position: cc.v2(-160, 590) })
                .call(() => {
                    this.effectAnimFullB.active = false;
                    this.effectAnimFullB.scale = 1;
                    this.effectAnimFullB.x = 0;
                    this.effectAnimFullB.y = 0;
                    this.money = this.lotteryRes.userscore / this.playerInfo.exchangeRate;
                    this.lblUserCoin.string = this.money.toFixed(2);
                    this.lblWinCoin.string = Helper.fixNum(this.lotteryRes.winscore);
                    this.setBtnState(false);
                    !this.auto && (this.startBtn.node.getComponent(cc.Button).interactable = true);
                })
                .start();
            //判断播放金币掉落动画
            if (this.lotteryRes.winscore > BET[this.bet] * BETNUM * this.linesNum * 5) { //如果大于100倍赌注，就播放bigFull动画
                this.effectAnimBigFull.active = true;
                this.effectAnimBigFull.getComponent(sp.Skeleton).clearTrack(0);
                this.effectAnimBigFull.getComponent(sp.Skeleton).setAnimation(0, "animation1", true);
            }
        } else {
            !this.auto && (this.startBtn.node.getComponent(cc.Button).interactable = true);
        }

        if (this.bigWinNum >= 3) {
            this.bigWinNode.children[this.bigWinNum - 1].getChildByName("guang").active = true;
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
                if (animIndex == 0) {
                    for (let i in linesNumList) {
                        if (linesNumList[i] != 99) {
                            this.effectLines.children[linesNumList[i]].active = true;
                        }
                    }
                } else {
                    if (linesNumList[animIndex - 1] != 99) {
                        this.effectLines.children[linesNumList[animIndex - 1]].active = true;
                    }
                }
                animIndex++;
                if (animIndex == list.length) {
                    animIndex = 1;
                }
            }
        }
        this.schedule(this.anim_cb, 2, cc.macro.REPEAT_FOREVER, 0.01);
        let t = 3;
        if (this.lotteryRes.winscore > 0) {
            t = 3;
        } else {
            t = 1;
        }
        this.scheduleOnce(() => {
            if (rIndex == this.rollIndex) {
                this.effectAnimFullA.active = false;
                this.setBtnState(false);
                this.effectAnimBigFull.getComponent(sp.Skeleton).clearTrack(0);
                this.effectAnimBigFull.active = false;
                if (this.stopFree) {
                    this.stopFree = false;
                    this.stopFreeTimes();
                    this.closeShine();
                }
                if (this.freeTimes > 0) {
                    this.freeTimes--;
                    this.freeObj.getChildByName('wenzi').getComponent(cc.Label).string = this.freeTimes;
                    if (this.freeTimes == 0) {
                        this.stopFree = true;
                    }
                    this.auto && this.sendRoll();
                }
                if (rIndex == this.rollIndex) {
                    !this.auto && (this.startBtn.node.getComponent(cc.Button).interactable = true);
                    this.auto && this.freeTimes == 0 && this.sendRoll();
                }
            }
        }, hasWinBool > 0 ? hasWinBool * 3 : t);
    },

    //免费次数有关
    startFreeGame() {
        console.log("startFreeGame");
        this.audio.playBgm(1);
        this.freeGameCoin = 0;
        this.BgNode.active = false;
        this.bIsFreeGame = true;
        this.freeBgNode.active = true;
        this.autoBtn.active = true;
        this.stopAutoBtn.active = false;

        for (let i in this.wheelList) {
            this.wheelList[i].initWheel();
        }
        this.freeTimes--;
        this.zhuanpanNode.angle = 36 * this.freeType;
        this.freeObj = this.zhuanpanNode.children[this.freeType];
        this.freeObj.getChildByName('wenzi').getComponent(cc.Label).string = this.freeTimes;
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

        for (let i = 0; i < this.zhuanpanNode.children.length; i++) {
            this.zhuanpanNode.children[i].getChildByName('wenzi').getComponent(cc.Label).string = FREE[i];
        }
        let delay = 1;
        if (this.freeGameCoin > 0) {
            this.freeEndNode.active = true;
            this.freeEndNode.getChildByName("lbl_coin").getComponent(cc.Label).string = Helper.fixNum(this.freeGameCoin);
            delay = 3;
        }
        this.scheduleOnce(() => {
            this.freeEndNode.active = false;
            this.BgNode.active = true;
            this.freeBgNode.active = false;
            this.bIsFreeGame = false;
            this.startBtn.node.getComponent(cc.Button).interactable = true;
        }, delay);

    },
    //转盘移动动画
    FreeGameAnim() {
        cc.find("Canvas/game_bg").active = false;
        this.bigWinNode.active = false;
        cc.find("Canvas/Game_main").active = false;
        let animNode = cc.find("Canvas/zhuanpan_main");
        this.effectAnimPr.active = false;
        this.zhuanpanNode.angle = 0;
        cc.tween(animNode)
            .to(1, { position: cc.v2(0, 0) })
            .call(() => {
                this.zhuanpanAnim();
            })
            .start();
    },
    //转盘旋转动画
    zhuanpanAnim() {
        //转盘
        let finAngle = 36 * this.lotteryRes.viewarray.getFreeTime.nFreeType;
        this.freeType = this.lotteryRes.viewarray.getFreeTime.nFreeType;
        let n = 10;
        this.zhuanpanNode.angle = this.zhuanpanNode.angle % 360;
        this.newTween = cc.tween(this.zhuanpanNode)
            .by(1, { angle: -1200 }, { easing: "cubicIn" })
            .to(n / 3, { angle: finAngle - n * 360 }, { easing: "quintOut" })
            .call(() => {
                cc.find("Canvas/game_bg").active = true;
                this.bigWinNode.active = true;
                cc.find("Canvas/Game_main").active = true;
                this.effectAnimPr.active = true;
                cc.find("Canvas/zhuanpan_main").y = 240;
                this.startFreeGame();
            })
            .start();
        //刷新免费次数
        this.freeTimes = this.lotteryRes.viewarray.getFreeTime.nFreeTime;
        this.freeObj = this.zhuanpanNode.children[this.freeType];
    },

    //0-5 0-2
    showAnim(cols, index) {
        let length = this.wheelList[cols].roleIdList.length;
        this.wheelList[cols].rolePbList[length - 2 - index].getComponent("TempAnimation").playAnim();

        //添加结束
        let nodeList = this.effectAnimPr.children;
        nodeList[cols * 3 + index].active = false;
    },

    closeAnim(cols, index) {
        let length = this.wheelList[cols].roleIdList.length;
        this.wheelList[cols].rolePbList[length - 2 - index].getComponent("TempAnimation").stopAnim();

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
        this.setBtnState(true);
        this.audio.playStartWheel();
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

        for (let i in this.effectLines.children) {
            this.effectLines.children[i].active = false;
        }

    },

    sendRoll() {
        this.rollIndex++;
        this.closeShine();
        this.lblWinCoin.string = "0.00";
        this.bigWinNum = 0;
        this.setBigWinShow(0);
        this.anim_cb && this.unschedule(this.anim_cb);
        !this.auto && (this.startBtn.spriteFrame = this.start_sp[1]);
        this.auto && (this.startBtn.node.getComponent(cc.Button).interactable = false);
        if (this.freeTimes == 0) {
            if (this.money >= (BET[this.bet] * BETNUM / this.playerInfo.exchangeRate * this.linesNum)) {
                this.money -= (BET[this.bet] * BETNUM / this.playerInfo.exchangeRate * this.linesNum);
                this.lblUserCoin.string = this.money.toFixed(2);
            }
        }
        this.net.socket.emit('lottery', JSON.stringify({
            bet: this.bet,
            linesNum: this.linesNum,
            nBetList: [BET[this.bet] * BETNUM * this.linesNum]
        }));
    },

    stopImmediately() {
        if (!this.auto) {
            this.bigWinNum = 0;
            for (let i in this.wheelList) {
                this.wheelList[i].stopImmediately();
            }
        }
    },


});