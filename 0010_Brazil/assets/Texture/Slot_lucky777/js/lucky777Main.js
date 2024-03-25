const BETNUM = 4; //单注值
const LINES = 3; //线数
const BET = [1, 2.5, 5, 7.5, 10, 12.5, 15, 17.5, 20, 25, 37.5, 50, 60, 75, 100, 150, 200, 250, 300, 375, 450, 500, 600, 700];
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
    },

    onLoad() {
        cc.view.setOrientation(cc.macro.ORIENTATION_PORTRAIT);
        this.playerInfo = require("PlayerInfo").getInstant;
        this.net = this.node.getComponent('lucky777Network');
        this.audio = this.node.getComponent('lucky777Audio');
        this.wheelList = [];
        this.bet = 0;
        this.auto = false;
        this.status = 0;
        this.bigWinBoo = false;
        this.freeTimes = 0;
        this.rollIndex = 0;
        this.lotteryRes = null;
        this.stopFree = false;
        this.freeGameCoin = 0;
        this.bIsFreeGame = false;
        this.delayClick = false;
    },

    start() {
        this.lblWinCoin.string = '0.00';
        this.setBet();
        this.money = this.playerInfo.playerCoin;
        this.lblUserCoin.string = this.money.toFixed(2);
        this.anim_cb = null;
    },

    onCLick(event, args) {
        this.audio.playClick();
        switch (args) {
            case 'auto':
                if (this.freeTimes > 0 || this.bigWinBoo || this.stopFree || this.bIsFreeGame || this.delayClick) {
                    return;
                }
                this.auto = !this.auto;
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
            case 'max':
                if (this.freeTimes > 0 || this.bigWinBoo || this.stopFree || this.auto) {
                    return;
                }
                this.bet = BET.length - 1;
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

    freeType_onclick(event, args) {
        let type = parseInt(args);
        if (this.freeTimes > 0) {
            return;
        }
        this.net.socket.emit('freeTimeType', JSON.stringify({ type: type }));
    },

    setBet() {
        this.lblBet.string = Helper.fixNum(BET[this.bet] * BETNUM);
        this.lblCurBet.string = Helper.fixNum(BET[this.bet] * BETNUM * LINES);
    },
    //设置按钮变化
    setBtnState(isStart) {
        for (let i in this.btnGray_list) {
            this.btnGray_list[i].interactable = !isStart;
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
                if (this.lotteryRes.viewarray.getFreeTime.nFreeType == 0) {
                    this.auto = false;
                    this.scheduleOnce(() => {
                        this.freeBeginNode.active = true;
                    }, 2);
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
                .to(0.5, { scale: 0.6, position: cc.v2(0, 500) })
                .call(() => {
                    this.effectAnimFullB.active = false;
                    this.effectAnimFullB.scale = 1;
                    this.effectAnimFullB.y = 0;
                    this.money = this.lotteryRes.userscore / this.playerInfo.exchangeRate;
                    this.lblUserCoin.string = this.money.toFixed(2);
                    this.lblWinCoin.string = Helper.fixNum(this.lotteryRes.winscore);
                    this.setBtnState(false);
                    this.startBtn.node.getComponent(cc.Button).interactable = true;
                })
                .start();
            //判断播放金币掉落动画
            if (this.lotteryRes.winscore > BET[this.bet] * BETNUM * LINES * 5) { //如果大于100倍赌注，就播放bigFull动画
                this.effectAnimBigFull.active = true;
                this.effectAnimBigFull.getComponent(sp.Skeleton).clearTrack(0);
                this.effectAnimBigFull.getComponent(sp.Skeleton).setAnimation(0, "animation1", true);
            }
        } else {
            this.startBtn.node.getComponent(cc.Button).interactable = true;
        }

        let animIndex = 0;
        this.anim_cb = () => {
            if (rIndex == this.rollIndex) {
                this.closeShine();
                for (let i = 0; i < 3; i++) {
                    this.closeAnim(i % 3, parseInt(i / 3));
                }
                if (!!!list[animIndex]) {
                    return;
                }

                for (let j in list[animIndex]) {
                    this.showAnim(list[animIndex][j] % 3, parseInt(list[animIndex][j] / 3));
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
                    this.freeTimesNode.getChildByName('lab').getComponent(cc.Label).string = this.freeTimes;
                    if (this.freeTimes == 0) {
                        this.stopFree = true;
                    }
                    this.auto && this.sendRoll();
                }
                if (rIndex == this.rollIndex) {
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
        for (let i in this.freeHideNode) {
            this.freeHideNode[i].active = false;
        }

        for (let i in this.wheelList) {
            this.wheelList[i].initWheel();
        }
        this.freeTimesNode.active = true;
        this.freeTimes--;
        this.freeTimesNode.getChildByName('lab').getComponent(cc.Label).string = this.freeTimes;
        this.setFreeType();
        this.auto = true;
        this.sendRoll();
        // }, 2);
    },

    stopFreeTimes() {
        console.log("stopFreeTimes freeGameCoin : ", this.freeGameCoin);
        this.audio.playBgm(0);
        this.auto = false;
        for (let i in this.freeHideNode) {
            this.freeHideNode[i].active = true;
        }

        for (let i in this.wheelList) {
            this.wheelList[i].initWheel();
        }
        this.freeTimesNode.active = false;
        this.freeEndNode.active = true;
        this.freeEndNode.getChildByName("lbl_coin").getComponent(cc.Label).string = Helper.fixNum(this.freeGameCoin);
        this.scheduleOnce(() => {
            this.freeEndNode.active = false;
            this.BgNode.active = true;
            this.freeBgNode.active = false;
            this.bIsFreeGame = false;
        }, 2);

    },

    setTypeResult(data) {
        if (data.type > 0) {
            this.freeTimes = data.freeCount;
            this.closeShine();
            this.freeType = data.type;
            this.freeBeginNode.active = false;
            this.startFreeGame();
        }
    },
    //设置免费模式下的显示
    setFreeType() {
        switch (this.freeType) {
            case 1:
                this.freeTotalTimes = 28;
                break;
            case 2:
                this.freeTotalTimes = 14;
                break;
            case 3:
                this.freeTotalTimes = 7;
                break;
        }
    },

    //0-5 0-2
    showAnim(cols, index) {
        let length = this.wheelList[cols].roleIdList.length;
        this.wheelList[cols].rolePbList[length - 2 - index].getComponent("TempAnimation").playAnim();
    },

    closeAnim(cols, index) {
        let length = this.wheelList[cols].roleIdList.length;
        this.wheelList[cols].rolePbList[length - 2 - index].getComponent("TempAnimation").stopAnim();
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
        for (let i in this.effectLines.children) {
            this.effectLines.children[i].active = false;
        }
    },

    sendRoll() {
        this.rollIndex++;
        this.closeShine();
        this.lblWinCoin.string = "0.00";
        this.anim_cb && this.unschedule(this.anim_cb);
        this.startBtn.spriteFrame = this.start_sp[1];
        if (this.freeTimes == 0) {
            this.money -= (BET[this.bet] * BETNUM / this.playerInfo.exchangeRate * LINES);
            this.lblUserCoin.string = this.money.toFixed(2);
        }
        this.net.socket.emit('lottery', JSON.stringify({
            bet: this.bet,
            nBetList: [BET[this.bet] * BETNUM * LINES]
        }));
    },

    stopImmediately() {
        if (!this.auto) {
            for (let i in this.wheelList) {
                this.wheelList[i].stopImmediately();
            }
        }
    },




});