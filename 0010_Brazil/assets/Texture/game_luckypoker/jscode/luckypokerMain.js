cc.Class({
    extends: cc.Component,

    properties: {
        lblUserCoin: {
            default: null,
            type: cc.Label,
            displayName: '用户金币',
        },
        lblWinCoin: {
            default: null,
            type: cc.Label,
            displayName: '本局赢得',
        },
        lblBet: {
            default: null,
            type: cc.Label,
            displayName: '押注',
        },
        curCardNum: {
            default: null,
            type: cc.Label,
            displayName: '当前剩余扑克数量',
        },
        lblWinLose: {
            default: null,
            type: cc.Label,
            displayName: '当前输赢显示',
        },
        lblJackpot: {
            default: null,
            type: cc.Label,
            displayName: '奖池',
        },
        lblSettlement: {
            default: null,
            type: cc.Label,
            displayName: '结算页显示收益',
        },
        mul_btnList: {
            default: [],
            type: cc.Node,
            displayName: '下注倍率按钮',
        },
        chip_node: {
            default: null,
            type: cc.Node,
            displayName: '筹码',
        },
        chip_nodeList: {
            default: null,
            type: cc.Node,
            displayName: '筹码区',
        },
        star_nodeList: {
            default: null,
            type: cc.Node,
            displayName: '星星显示',
        },
        anim_win: {
            default: null,
            type: cc.Node,
            displayName: '获胜动画',
        },
        help_node: {
            default: null,
            type: cc.Node,
            displayName: '帮助',
        },
        settlement_node: {
            default: null,
            type: cc.Node,
            displayName: '结算',
        },
        setting_node: {
            default: null,
            type: cc.Node,
            displayName: '设置面板',
        },
        rolePb: {
            default: null,
            type: cc.Prefab,
            displayName: '牌角色Pb',
        },
        rolePb_s: {
            default: null,
            type: cc.Prefab,
            displayName: '小的牌角色Pb',
        },
        coinPb: {
            default: null,
            type: cc.Prefab,
            displayName: '金币Pb',
        },
        poker_spAtlas: {
            default: null,
            type: cc.SpriteAtlas,
            displayName: '扑克图集',
        },
        sound_sp: {
            default: [],
            type: cc.SpriteFrame,
            displayName: '声音图标',
        },
        chip_sp: {
            default: [],
            type: cc.SpriteFrame,
            displayName: '筹码图标',
        },
        audioBtn: {
            default: null,
            type: cc.Sprite,
            displayName: '声音按钮',
        },
        anim_xipai: {
            default: null,
            type: cc.Node,
            displayName: '洗牌动画节点',
        },
        cards: {
            default: null,
            type: cc.Node,
            displayName: '桌面牌',
        },
        btnGray_list: {
            default: [],
            type: cc.Button,
            displayName: '按钮置灰列表',
        },

    },



    onLoad() {
        // 获取屏幕物理分辨率
        // let frameSize = cc.view.getFrameSize()
        cc.view.setOrientation(cc.macro.ORIENTATION_PORTRAIT);
        // if (frameSize.width > frameSize.height)
        //     cc.view.setFrameSize(frameSize.height, frameSize.width)
        // // this.canvas 为当前fire场景的画板  
        // this.canvas.designResolution = cc.size(640, 1136)
        // cc.view.setOrientation(cc.macro.ORIENTATION_LANDSCAPE)
        // if (frameSize.height > frameSize.width)
        //     cc.view.setFrameSize(frameSize.height, frameSize.width)
        // this.canvas.designResolution = cc.size(1136, 640)
        this.playerInfo = require("PlayerInfo").getInstant;
        this.net = this.node.getComponent('luckypokerNetwork');
        this.audio = this.node.getComponent('luckypokerAudio');
        this.bet = 50;              //当前所选注码
        this.curbet = 50;           //当前注码
        this.needCost = 0;          //当前需要花费的钱
        this.mul = 1;               //当前倍数
        this.chipList = [];
        this.lotteryRes = null;
        this.isAnimPlay = false;    //正在播放洗牌动画
        this.isGameStart = false;   //游戏是否处于进行状态
        this.lastIsWin = false;     //记录当前是否赢钱
    },

    start() {
        this.money = parseFloat(this.playerInfo.playerCoin * this.playerInfo.exchangeRate);
        this.lblUserCoin.string = (this.money / this.playerInfo.exchangeRate).toFixed(2);
        this.lblWinCoin.string = '';
        this.curCardNum.string = 52;
        this.btnGray_list[6].interactable = false;
        this.anim_win.active = false;
    },



    onCLick(event, args) {
        switch (args) {
            case "takeWin":
                this.net.socket.emit('settlement', {});
                break;
            case "rollBlack":
                this.audio.playEffect(5);
                this.sendRoll(1);
                break;
            case "rollRed":
                this.audio.playEffect(5);
                this.sendRoll(2);
                break;
            case "choose2x":
                this.refreshMul(2);
                break;
            case "choose3x":
                this.refreshMul(3);
                break;
            case "choose5x":
                this.refreshMul(5);
                break;
            case "chooseBet":
                this.chip_nodeList.active = false;
                let num = event.target.getChildByName("lab").getComponent(cc.Label).string;
                if (this.checkMoney(parseInt(num * this.playerInfo.exchangeRate), this.mul)) {
                    this.bet = parseInt(num * this.playerInfo.exchangeRate);
                    this.curbet = parseInt(num * this.playerInfo.exchangeRate);
                    this.chip_node.getComponent(cc.Sprite).spriteFrame = this.chip_sp[parseInt(event.target.name)];
                    this.audio.playEffect(0);
                    this.refreshLab();
                }
                break;
            case "openChip":
                if (this.isGameStart) {
                    return;
                }
                this.audio.playEffect(4);
                this.chip_nodeList.active = !this.chip_nodeList.active;
                break;
            case "openHelp":
                this.audio.playEffect(4);
                this.help_node.active = !this.help_node.active;
                this.setting_node.active = false;
                break;
            case "closeSettlement"://关闭结算页面
                this.audio.playEffect(4);
                this.settlement_node.active = false;
                this.finishGame();
                break;
            case "Setting"://设置
                this.audio.playEffect(4);
                this.setting_node.active = !this.setting_node.active;
                break;
            case 'audio':
                this.audio.playEffect(4);
                this.setting_node.active = false;
                this.audio.pInfo.musicControl = !this.audio.pInfo.musicControl;
                this.audioBtn.spriteFrame = this.audio.pInfo.musicControl ? this.sound_sp[0] : this.sound_sp[1];
                if (!this.audio.pInfo.musicControl) {
                    this.audio.stopAudio();
                } else {
                    this.audio.playBgm(0);
                }
                break;
            case "goEvent":
                this.audio.playEffect(4);
                alert("跳转测试_活动");
                break;
            case "goService":
                this.audio.playEffect(4);
                alert("跳转测试_服务");
                break;
            case "goDeposit":
                this.audio.playEffect(4);
                alert("跳转测试_充值");
                break;
            case "exitGame":
                this.audio.playEffect(4);
                this.net.socket.disconnect();
                cc.director.loadScene(window.hallName);
                break;
        }

    },

    //设置按钮变化
    setBtnState(isStart) {
        for (let i in this.btnGray_list) {
            this.btnGray_list[i].interactable = !isStart;
        }
    },

    setBet() {
        this.lblBet.string = (this.curbet * this.mul / this.playerInfo.exchangeRate).toFixed(2);
    },

    refreshLab() {
        this.needCost = this.curbet * this.mul;
        this.lblUserCoin.string = ((this.money - this.needCost) / this.playerInfo.exchangeRate).toFixed(2);
        this.setBet();
    },

    refreshChip(list) {
        this.newGameAnim();
        this.chipList = list;
        for (let i = 0; i < this.chip_nodeList.children.length; i++) {
            this.chip_nodeList.children[i].getChildByName("lab").getComponent(cc.Label).string = (this.chipList[i] / this.playerInfo.exchangeRate).toFixed(2);
        }
        this.bet = this.chipList[0];
        this.curbet = this.chipList[0];
        this.setBet();
    },


    refreshMul(x) {
        // if (this.checkMoney(this.curbet, x)) {
        //     return;
        // }
        for (let i in this.mul_btnList) {
            this.mul_btnList[i].children[0].active = false;
        }
        if (this.mul == x) {
            this.mul = 1;
            this.audio.playEffect(1);
        } else {
            this.mul = x;
            this.mul == 2 ? this.mul_btnList[0].children[0].active = true :
                this.mul == 3 ? this.mul_btnList[1].children[0].active = true : this.mul_btnList[2].children[0].active = true;
            this.audio.playEffect(0);
        }
        this.refreshLab();
        this.lblSettlement.string = this.lblBet.string;
    },
    //jackpot刷新
    refreshPool(score) {
        this.lblJackpot.string = (score / this.playerInfo.exchangeRate).toFixed(2);
    },

    //开牌
    openCards(data) {
        this.setBtnState(true);
        //下注变化
        this.isGameStart = true;
        if (this.needCost == 0) {
            if (data.win > 0) {
                this.needCost = data.win * this.mul;
            } else {
                this.needCost = 0;
            }
            this.lblUserCoin.string = ((this.money - this.needCost) / this.playerInfo.exchangeRate).toFixed(2);
        }
        this.lblWinCoin.string = this.lblBet.string;
        this.lblBet.string = "";
        //开牌动效
        let newNode = cc.instantiate(this.rolePb);
        newNode.y = 109;
        this.node.addChild(newNode);
        cc.tween(newNode)
            .to(0.2, { scale: 1.2 })
            .delay(0.3)
            .to(0.2, { scaleX: 0, scaleY: 1.2 })
            .call(() => {
                newNode.getComponent(cc.Sprite).spriteFrame = this.poker_spAtlas.getSpriteFrame(this.getCardName(data.winCards));
            })
            .to(0.2, { scaleX: 1, scaleY: 1 })
            .call(() => {
                this.curCardNum.string = data.cardTotal;
                if (data.win > 0) {
                    //播放WIN字样动画
                    this.anim_win.active = true;
                    this.anim_win.getComponent(sp.Skeleton).clearTrack(0);
                    this.anim_win.getComponent(sp.Skeleton).setAnimation(0, "win_en", false);
                    this.lblWinLose.string = "WIN";
                    this.lblWinCoin.string = (data.win / this.playerInfo.exchangeRate).toFixed(2);
                    this.lastIsWin = true;
                    this.scheduleOnce(() => {
                        this.lblWinCoin.string = "";
                    }, 1);
                } else {
                    //播放LOSE字样动画
                    this.anim_win.active = true;
                    this.anim_win.getComponent(sp.Skeleton).clearTrack(0);
                    this.anim_win.getComponent(sp.Skeleton).setAnimation(0, "lose_en", false);
                    this.lblWinLose.string = "LOSE";
                    this.lblWinCoin.string = "";
                    this.lastIsWin = false;
                }
            })
            .delay(1)
            .to(0.8, { position: cc.v2(180, 109), opacity: 50 })
            .call(() => {
                for (let i = 0; i < data.winTimes; i++) {
                    this.star_nodeList.children[i].children[0].active = true;
                }
                this.anim_win.active = false;
                this.showResult(data.winCards, data.win, data.winTimes);
                newNode.destroy();
            })
            .start();

    },
    //结果展示
    showResult(num, win, winTimes) {
        let newNode = cc.instantiate(this.rolePb_s);
        newNode.y = -2;
        if (win > 0) {
            newNode.color = new cc.Color(255, 255, 255, 255);
        } else {
            newNode.color = new cc.Color(130, 130, 130, 255);
        }
        newNode.getComponent(cc.Sprite).spriteFrame = this.poker_spAtlas.getSpriteFrame(this.getCardName(num));
        this.cards.addChild(newNode);
        cc.tween(this.cards)
            .by(0.3, { x: -53.5 })
            .call(() => {
                this.lblWinLose.string = "";
                if (win > 0) {
                    //获胜后关闭倍率
                    for (let i in this.mul_btnList) {
                        this.mul_btnList[i].children[0].active = false;
                    }
                    this.mul = 1;
                    this.curbet = win;
                    this.lblBet.string = (this.curbet / this.playerInfo.exchangeRate).toFixed(2);
                } else {
                    this.needCost = this.curbet * this.mul;
                    //资金不足时直接结算
                    if (this.checkMoney(this.curbet, this.mul)) {
                        this.lblUserCoin.string = ((this.money - this.needCost) / this.playerInfo.exchangeRate).toFixed(2);
                    } else {
                        this.net.socket.emit('settlement', {});
                    }
                    this.lblBet.string = (this.needCost / this.playerInfo.exchangeRate).toFixed(2);
                }
                this.lblSettlement.string = this.lblBet.string;
                this.setBtnState(false);
                this.checkMul();
                if (winTimes == 7) {
                    this.net.socket.emit('settlement', {});
                }
            })
            .start();
    },
    //开始新的一轮游戏
    startNewTurn(score) {
        this.isGameStart = false;
        this.money = score;
        //重置界面
        this.cards.removeAllChildren();
        this.cards.x = 145;
        this.curbet = this.bet;
        this.needCost = 0;
        this.lblBet.string = (this.curbet / this.playerInfo.exchangeRate).toFixed(2);
        for (let i = 0; i < this.star_nodeList.children.length; i++) {
            this.star_nodeList.children[i].children[0].active = false;
        }
        //重置倍率
        for (let i in this.mul_btnList) {
            this.mul_btnList[i].children[0].active = false;
        }
        this.mul = 1;
        if (this.lastIsWin) {
            this.settlement_node.active = true;
            this.lastIsWin = false;
            this.audio.playEffect(3);
            this.scheduleOnce(() => {
                this.settlement_node.active = false;
                this.finishGame();
            }, 3);
        } else {
            this.finishGame();
        }
    },

    finishGame() {
        if (this.isAnimPlay) {
            return;
        }
        this.newGameAnim();
        this.addCoinAnim();
    },

    newGameAnim() {
        // this.poker_spAtlas.getSpriteFrame('001');
        let cardList = this.anim_xipai.children;
        if (this.isAnimPlay) {
            return;
        }
        this.setBtnState(true);
        this.isAnimPlay = true;
        for (let i = 0; i < cardList.length; i++) {
            let x1 = 0;
            let x2 = 0;
            let ax1 = 0;
            if (i < 9) {
                x1 = -10;
                x2 = 100;
                ax1 = 0;
            } else {
                x2 = -100;
                ax1 = 1;
            }

            cc.tween(cardList[i])
                .to(0.1, { position: cc.v2(0, 100) })
                .to(0.5, { position: cc.v2(x1, 100), angle: -80 + i * 10 })
                .delay(0.5)
                .call(() => {
                    cardList[i].anchorY = 0.5;
                    cardList[i].y = 230;
                })
                .to(1, { position: cc.v2(x2, 230), angle: 360, anchorX: 0.5 })
                .delay(i % 9 * 0.1)
                .to(0.5, { position: cc.v2(0, 50) })
                .call(() => {
                    this.audio.playEffect(6);
                })
                .delay(0.8 - i % 9 * 0.1)
                .delay(i * 0.05)
                .to(0.5, { position: cc.v2(0, 230 + Math.floor(i / 2)) })
                .call(() => {//还原到初始位置
                    cardList[i].anchorY = 0;
                    cardList[i].y -= 130;
                    cardList[i].angle = 0;
                    if (i == cardList.length - 1) {
                        this.isAnimPlay = false;
                        this.setBtnState(false);
                        this.checkMul();
                        this.btnGray_list[6].interactable = false;
                        this.curCardNum.string = 52;
                    }
                })
                .start();
        }
    },

    addCoinAnim() {
        for (let i = 0; i < 20; i++) {
            let coinpb = cc.instantiate(this.coinPb);
            let rx = Math.random() * 200 - 100;
            let ry = Math.random() * 150 - 75;
            coinpb.position = cc.v2(rx, ry);
            this.node.addChild(coinpb);
            cc.tween(coinpb)
                .delay(0.03 * i)
                .to(0.5, { position: cc.v2(-100, 590) })
                .delay(0.1)
                .call(() => {
                    if (i == 19) {
                        this.audio.playEffect(2);
                        this.lblUserCoin.string = (this.money / this.playerInfo.exchangeRate).toFixed(2);
                    }
                    coinpb.destroy();
                })
                .start();
        }

    },

    sendRoll(_type) {
        this.net.socket.emit('lottery', JSON.stringify({
            bet: this.curbet,
            mul: this.mul,
            type: _type
        }));
    },

    //检查资金
    checkMoney(_bet, _mul) {
        let m = this.money - (_bet * _mul);
        if (m > 0) {
            return true;
        }
        return false;
    },

    checkMul() {
        if (this.checkMoney(this.curbet, 2)) {
            this.btnGray_list[0].interactable = true;
        } else if (this.mul == 2) {
            this.btnGray_list[0].interactable = true;
        } else {
            this.btnGray_list[0].interactable = false;
        }

        if (this.checkMoney(this.curbet, 3)) {
            this.btnGray_list[1].interactable = true;
        } else if (this.mul == 3) {
            this.btnGray_list[1].interactable = true;
        } else {
            this.btnGray_list[1].interactable = false;
        }

        if (this.checkMoney(this.curbet, 5)) {
            this.btnGray_list[2].interactable = true;
        } else if (this.mul == 5) {
            this.btnGray_list[2].interactable = true;
        } else {
            this.btnGray_list[2].interactable = false;
        }

    },

    getCardName(num) {
        let a = num % 13 + 1;
        let b = Math.floor(num / 13) + 1;
        return b + "_" + this.pad(a, 2);;
    },

    //数字补0
    pad(num, n) {
        var len = num.toString().length;
        while (len < n) {
            num = "0" + num;
            len++;
        }
        return num;
    },

});