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
        lblWinCoin: {
            default: null,
            type: cc.Label,
            displayName: '最大赢得',
        },
        lblPrice: {
            default: null,
            type: cc.Node,
            displayName: '中奖数值',
        },
        lblJackpot: {
            default: null,
            type: cc.Label,
            displayName: '奖池数值',
        },
        zhuanPan: {
            default: null,
            type: cc.Node,
            displayName: '转盘',
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
        startBtn: {
            default: null,
            type: cc.Sprite,
            displayName: '开始按钮Sprite',
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
        effectAnimShine: {
            default: null,
            type: cc.Node,
            displayName: '摇奖特效',
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
        stopAutoBtn: cc.Node,
    },

    onLoad() {
        cc.view.setOrientation(cc.macro.ORIENTATION_PORTRAIT);
        this.playerInfo = require("PlayerInfo").getInstant;
        this.net = this.node.getComponent('spinbigNetwork');
        this.audio = this.node.getComponent('spinbigAudio');
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
        this.newTween = null;
        this.delayClick = false;

        let isFirst = null;
        //判断是否首次进入
        if (cc.sys.isNative) {
            isFirst = JSON.parse(cc.sys.localStorage.getItem("spinbig"));
        }
        else {
            isFirst = JSON.parse(localStorage.getItem("spinbig"));
        }

        // if (!isFirst) {
        //     this.helpUI.active = true;
        //     if (cc.sys.isNative) {
        //         cc.sys.localStorage.setItem("spinbig", 1);
        //     } else {
        //         localStorage.setItem("spinbig", 1);
        //     }
        // }
    },

    start() {
        this.money = this.playerInfo.playerCoin;
        this.lblUserCoin.string = this.money.toFixed(2);
    },

    init(data) {
        this.betList = data.betList;
        this.priceList = data.priceList;
        //按钮文字更新
        for (let i = 0; i < 4; i++) {
            this.btnGray_list[i].node.getChildByName("num").getComponent(cc.Label).string = Helper.fixNum(this.betList[i]);
        }
        this.setBet();
    },

    onCLick(event, args) {
        this.audio.playClick();
        switch (args) {
            case 'auto':
                if (this.freeTimes > 0 || this.bigWinBoo || this.stopFree || this.bIsFreeGame || this.delayClick) {
                    return;
                }
                this.auto = !this.auto;
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

                    }
                }
                break;
            case 'bet0':
                if (this.freeTimes > 0 || this.bigWinBoo || this.stopFree || this.auto) {
                    return;
                }
                this.bet = 0;
                this.setBet();
                break;
            case 'bet1':
                if (this.freeTimes > 0 || this.bigWinBoo || this.stopFree || this.auto) {
                    return;
                }
                this.bet = 1;
                this.setBet();
                break;
            case 'bet2':
                if (this.freeTimes > 0 || this.bigWinBoo || this.stopFree || this.auto) {
                    return;
                }
                this.bet = 2;
                this.setBet();
                break;
            case 'bet3':
                if (this.freeTimes > 0 || this.bigWinBoo || this.stopFree || this.auto) {
                    return;
                }
                this.bet = 3;
                this.setBet();
                break;
            case 'setting':
                this.settingBtn[1].active = !this.settingBtn[1].active;
                break;
            case 'help':
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
        this.lblBet.string = Helper.fixNum(this.betList[this.bet]);
        let maxNum = Math.max.apply(null, this.priceList[this.bet]);
        this.lblWinCoin.string = Helper.fixNum(maxNum);
        for (let i = 0; i < this.lblPrice.children.length; i++) {
            if (this.priceList[i] != 0) {
                this.lblPrice.children[i].getComponent(cc.Label).string = Helper.fixNum(this.priceList[this.bet][i]);
            }
        }
        //按钮选项更新
        for (let i = 0; i < 4; i++) {
            this.zhuanPan.getChildByName("icon_bigwin" + i).active = i == this.bet;
            this.btnGray_list[i].node.getChildByName("btn_1").active = i == this.bet;
            this.btnGray_list[i].node.getChildByName("btn_2").active = i != this.bet;
        }
    },
    //设置按钮变化
    setBtnState(isStart) {
        for (let i in this.btnGray_list) {
            this.btnGray_list[i].interactable = !isStart;
        }
    },

    stateCallBack() {
        let st = 0;
        this.status = st;
        if (this.status == 0) {
            //结束当前轮盘
            let rIndex = this.rollIndex;
            this.startBtn.node.getComponent(cc.Button).interactable = false;
            if (this.bIsFreeGame) {
                this.freeGameCoin += this.lotteryRes.winscore;
            }
            this.scheduleOnce(() => {
                if (rIndex == this.rollIndex) {
                    this.playWinAnim();
                }
            }, 1);

        }
    },

    playWinAnim() {
        //动画结束后自动roll
        let hasWinBool = 0;

        let rIndex = this.rollIndex;
        if (this.lotteryRes.winscore > 0) {
            //播放恭喜字样动画
            hasWinBool = 1;
            this.effectAnimFullA.active = true;
            this.effectAnimFullA.getComponent(sp.Skeleton).clearTrack(0);
            this.effectAnimFullA.getComponent(sp.Skeleton).setAnimation(0, "win_en", false);
            //播放招财猫动画
            this.effectAnimFullB.active = true;
            let lbl_coin = this.effectAnimFullB.getChildByName("lbl_coin").getComponent(cc.Label);
            let addcoin = 0;
            this.schedule(() => {
                addcoin += this.lotteryRes.winscore / 30;
                if (addcoin > this.lotteryRes.winscore) {
                    addcoin = this.lotteryRes.winscore;
                }
                lbl_coin.string = "+" + Helper.fixNum(addcoin);
            }, 0.04, 30);

            cc.tween(this.effectAnimFullB)
                .delay(2)
                .to(0.5, { scale: 0.6, position: cc.v2(-90, 600) })
                .call(() => {
                    this.effectAnimFullB.active = false;
                    this.effectAnimFullB.scale = 1;
                    this.effectAnimFullB.x = 0;
                    this.effectAnimFullB.y = 0;
                    this.money = this.lotteryRes.userscore / this.playerInfo.exchangeRate;
                    this.lblUserCoin.string = this.money.toFixed(2);
                    this.setBtnState(false);
                    this.startBtn.node.getComponent(cc.Button).interactable = true;
                })
                .start();

            //判断播放金币掉落动画
            if (this.lotteryRes.winscore > this.betList[this.bet] * 5) { //如果大于5倍赌注，就播放bigFull动画
                this.effectAnimBigFull.active = true;
                this.effectAnimBigFull.getComponent(sp.Skeleton).clearTrack(0);
                this.effectAnimBigFull.getComponent(sp.Skeleton).setAnimation(0, "animation1", true);
            }
        } else {
            this.startBtn.node.getComponent(cc.Button).interactable = true;
        }

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

                if (rIndex == this.rollIndex) {
                    this.auto && this.freeTimes == 0 && this.sendRoll();
                }
            }
        }, hasWinBool > 0 ? hasWinBool * 3 : t);
    },

    roll(result) {
        this.setBtnState(true);
        this.audio.playStartWheel();

        this.status = 1;
        let ra = Math.floor(Math.random() * 28 + 4);
        let finAngle = 36 * result.nWinLines + ra;
        let n = Math.floor(Math.random() * 5 + 15);
        this.zhuanPan.angle = this.zhuanPan.angle % 360;
        this.effectAnimShine.getComponent(cc.Animation).play();
        this.newTween = cc.tween(this.zhuanPan)
            .by(3, { angle: -3600 }, { easing: "cubicIn" })
            .parallel(
                cc.tween().to(n / 3, { angle: finAngle - n * 360 }, { easing: "quintOut" }),
                cc.tween()
                    .delay(n / 3 - 1.2)
                    .call(() => {
                        this.effectAnimShine.getComponent(cc.Animation).stop();
                        this.stateCallBack();
                    })
            )
            .start();
    },

    sendRoll() {
        this.rollIndex++;
        if (this.freeTimes == 0) {
            this.money -= (this.betList[this.bet] / this.playerInfo.exchangeRate);
            this.lblUserCoin.string = this.money.toFixed(2);
        }
        this.net.socket.emit('lottery', JSON.stringify({
            bet: this.bet,
        }));
    },

    //设置奖池
    setPool(data) {
        this.winPool = data;
        this.lblJackpot.string = Helper.fixNum(data);
    },
    //刷新奖池
    refreshPool(data) {
        this.lblJackpot.string = Helper.fixNum(data);
    },

});