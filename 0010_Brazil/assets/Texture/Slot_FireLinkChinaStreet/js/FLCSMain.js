const BETNUM = 100; //单注值
const LINES = 50; //线数
const BET = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
cc.Class({
    extends: cc.Component,

    properties: {
        spUserFace: {
            default: null,
            type: cc.Sprite,
            displayName: '用户头像',
        },
        sp_settingControl: [cc.SpriteFrame],
        lblUserName: {
            default: null,
            type: cc.Label,
            displayName: '用户名',
        },
        lblUserCoin: {
            default: null,
            type: cc.Label,
            displayName: '用户金币',
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
        lblWin_detail: {
            default: null,
            type: cc.Label,
            displayName: '赢钱细节',
        },
        lblCoinList: {
            default: [],
            type: cc.Label,
            displayName: '列倍率显示',
        },
        rolePb: {
            default: [],
            type: cc.Prefab,
            displayName: '滚轮角色Pb',
        },
        spAtlas: {
            default: null,
            type: cc.SpriteAtlas,
            displayName: '图集',
        },
        BgNode: {
            default: null,
            type: cc.Node,
            displayName: '游戏背景节点',
        },
        normalNode: {
            default: null,
            type: cc.Node,
            displayName: '普通模式节点',
        },
        jackpotNode: {
            default: null,
            type: cc.Node,
            displayName: '奖池节点',
        },
        //免费次数有关
        freeBgNode: {
            default: null,
            type: cc.Node,
            displayName: '免费摇奖背景节点',
        },
        freeBgNode2: {
            default: null,
            type: cc.Node,
            displayName: '免费摇奖背景节点2',
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
        freeWinCoin: {
            default: null,
            type: cc.Label,
            displayName: '免费模式总计赢得',
        },
        //大奖模式相关
        bigWinSprite: {
            default: [],
            type: cc.SpriteFrame,
            displayName: '大奖模式图片',
        },
        effectBigWinNode: {
            default: null,
            type: cc.Node,
            displayName: '大奖中奖特效节点',
        },
        effectBigWinAnim: {
            default: null,
            type: cc.Node,
            displayName: '大奖中奖特效',
        },
        BigWinReelAnim: {
            default: null,
            type: cc.Node,
            displayName: '大奖卷轴动画',
        },
        BigWinReelMask: {
            default: null,
            type: cc.Node,
            displayName: '大奖卷轴遮挡',
        },
        BigWinReel: {
            default: null,
            type: cc.Node,
            displayName: '大奖卷轴',
        },
        BigWin_btnStart: {
            default: null,
            type: cc.Node,
            displayName: '大奖开始按钮',
        },
        BigWin_btnState: {
            default: null,
            type: cc.Node,
            displayName: '大奖状态按钮',
        },
        normalReel: {
            default: null,
            type: cc.Node,
            displayName: '普通卷轴',
        },
        helpUI: {
            default: null,
            type: cc.Node,
            displayName: 'help界面',
        },
        helpPageView: {
            default: null,
            type: cc.PageView,
            displayName: 'help容器',
        },
        com_setting: {
            default: null,
            type: cc.Node,
            displayName: '设置面板',
        },
        setBtn: cc.Node,//设置按钮
        ksBtn: cc.Node,//开始按钮
        autoBtn: cc.Node,//自动按钮
        exitBtn: cc.Button,//退出
        musicBtn: cc.Node,//音乐
        soundBtn: cc.Node,//音效
        _holdTimeEclipse: 0,//用来检测长按
        _holdClick: false,
    },

    onLoad() {
        cc.view.setOrientation(cc.macro.ORIENTATION_PORTRAIT);
        this.playerInfo = require("PlayerInfo").getInstant;
        Helper.loadHead(this.playerInfo.playerHeadId, sp => {
            this.spUserFace.spriteFrame = sp;
        });
        this.net = this.node.getComponent('FLCSNetwork');
        this.audio = this.node.getComponent('FLCSAudio');
        this.wheelList = [];
        this.wheelLinkList = [];
        this.bet = 0;
        this.auto = false;
        this.status = 0;
        this.bigWinBoo = false;
        this.freeTimes = 0;
        this.freeTotalTimes = 0;
        this.freeType = 0;
        this.rollIndex = 0;
        this.lotteryRes = null;
        this.bigWinResult = null;
        this.stopFree = false;
        this.freeGameCoin = 0;
        this.bIsFreeGame = false;
        this.delayClick = false;
        this.turnNum = 0;
        this.cb_coin = () => { };
        this.ksBtn.on('touchstart', function (event) {
            this._holdClick = true;
            this._holdTimeEclipse = 0;
        }, this);
        this.ksBtn.on('touchend', function (event) {
            this._holdClick = false;
            this._holdTimeEclipse = 0;
        }, this);
        //免费模式动画监听
        this.card_anim = this.freeBeginNode.getChildByName("card_anim").getComponent(cc.Animation);

        this.card_anim.on('finished', (type, state) => {
            this.card_anim.node.active = false;
            this.freeBeginNode.active = false;
            this.startFreeGame();
        }, this);
        //大奖模式动画监听
        this.bigWin_Anim = this.BigWinReelAnim.getComponent(cc.Animation);

        this.bigWin_Anim.on('finished', (type, state) => {
            this.effectBigWinAnim.active = false;
            this.BigWinReel.active = true;
            this.BigWin_btnStart.active = true;
            this.autoBtn.active = false;
            this.ksBtn.active = false;
            let sum = 0;
            for (let i in this.lotteryRes.viewarray.boxCardList) {
                sum += 1;
                for (let j in this.effectBigWinNode.children[parseInt(i) + 20].children) {
                    this.effectBigWinNode.children[parseInt(i) + 20].children[j].active = true;
                }
                this.effectBigWinNode.children[parseInt(i) + 20].getChildByName("num").getComponent(cc.Label).string =
                    Helper.toThousands(this.lotteryRes.viewarray.boxCardList[i].num / this.playerInfo.exchangeRate);
            }

            this.BigWinReelMask.children[0].getChildByName("num_lab").getComponent(cc.Label).string = 20 - sum;
            this.BigWinReelMask.children[1].getChildByName("num_lab").getComponent(cc.Label).string = 16 - sum;
            this.BigWinReelMask.children[2].getChildByName("num_lab").getComponent(cc.Label).string = 12 - sum;
            this.BigWinReelMask.children[3].getChildByName("num_lab").getComponent(cc.Label).string = 8 - sum;
            this.BigWinReelMask.children[0].active = (20 - sum > 0);
            this.BigWinReelMask.children[1].active = (16 - sum > 0);
            this.BigWinReelMask.children[2].active = (12 - sum > 0);
            this.BigWinReelMask.children[3].active = (8 - sum > 0);
        }, this);
    },

    start() {
        this.lblWinCoin.string = '0.00';
        this.setBet();
        this.lblUserName.string = this.playerInfo.playerName;
        this.lblUserCoin.string = Helper.toThousands(this.playerInfo.playerCoin);
        this.settingInit_Function();
        this.initBigWinNode();
    },

    initBigWinNode() {
        this.effectBigWinNode.removeAllChildren();
        this.node.getChildByName("BG_LinkNum").active = false;
        this.node.getChildByName("BG_LinkNum").getChildByName("LinkWinTotal_lab").getComponent(cc.Label).string = "0";
        for (let i = 0; i < 40; i++) {
            let newNode = cc.instantiate(this.rolePb[11]);
            this.effectBigWinNode.addChild(newNode);
            for (let j in newNode.children) {
                newNode.children[j].active = false;
            }
        }
    },

    setBigWin(id) {
        for (let i in this.bigWinResult.card) {
            if (this.effectBigWinNode.children[parseInt(i)].children[0].active) {
                continue;
            } else if (parseInt(i) % 5 == id) {
                for (let j in this.effectBigWinNode.children[parseInt(i)].children) {
                    this.effectBigWinNode.children[parseInt(i)].children[j].active = true;
                }
                this.effectBigWinNode.children[parseInt(i)].getChildByName("num").getComponent(cc.Label).string =
                    Helper.toThousands(this.bigWinResult.card[i].num / this.playerInfo.exchangeRate);
            }
        }
    },

    update() {
        if (this._holdClick) {
            this._holdTimeEclipse++;
            if (this._holdTimeEclipse > 60) {//如果长按时间大于1s，则认为长按了1s
                this._holdClick = false;
                this._holdTimeEclipse = 0;
                if (this.auto) {
                    return;
                }
                this.onCLick(null, "auto");
            }
        }
    },

    onCLick(event, args) {
        switch (args) {
            case "auto":
                if (this.freeTimes > 0 || this.bigWinBoo || this.stopFree || this.bIsFreeGame || this.delayClick) {
                    return;
                }
                this.auto = true;
                this.autoBtn.active = this.auto;
                this.ksBtn.active = !this.auto;
                if (this.auto && this.status == 0) {
                    this.sendRoll();
                }
                break;
            case "stopAuto":
                this.auto = false;
                this.autoBtn.active = this.auto;
                this.ksBtn.active = !this.auto;
                break;
            case "roll":
                if (this.freeTimes > 0 || this.bigWinBoo || this.stopFree || this.bIsFreeGame || this.delayClick) {
                    return;
                }
                if (!this.auto) {
                    if (this.status == 0) {
                        this.status = 2;
                        this.sendRoll();
                    } else if (this.status == 1) {
                        if (this.lotteryRes.viewarray.getFreeTime.bFlag) {
                            return;
                        }
                        this.delayClick = true;
                        this.scheduleOnce(() => {
                            this.delayClick = false;
                        }, 1);
                        this.stopImmediately();
                    }
                }
                break;
            case "startBigWin":
                if (!this.bigWinBoo) {
                    return;
                }
                this.sendBigWin();
                break;
            case "add":
                if (this.freeTimes > 0 || this.bigWinBoo || this.stopFree || this.auto) {
                    return;
                }
                this.bet += 1;
                this.bet = this.bet >= BET.length ? BET.length - 1 : this.bet;
                this.setBet();
                break;
            case "dec":
                if (this.freeTimes > 0 || this.bigWinBoo || this.stopFree || this.auto) {
                    return;
                }
                this.bet -= 1;
                this.bet = this.bet >= 0 ? this.bet : 0;
                this.setBet();
                break;
            case "max":
                if (this.freeTimes > 0 || this.bigWinBoo || this.stopFree || this.auto) {
                    return;
                }
                this.bet = BET.length - 1;
                this.setBet();
                break;
            case "closeBigWin":
                this.audio.playBgm(0);
                break;
            case "setting":
                if (this.sLock) {
                    return;
                }
                this.sLock = true;
                this.com_setting.x = this.pos_setting;
                this.com_setting.active = true;
                this.setBtn.x = this.pos_setBtn;
                cc.tween(this.setBtn)
                    .to(0.3, { position: cc.v2(this.setBtn.x + 200, this.setBtn.y) })
                    .call(() => {
                        this.setBtn.active = false;
                        this.sLock = false;
                    })
                    .start();
                cc.tween(this.com_setting)
                    .to(0.3, { position: cc.v2(this.com_setting.x - 200, this.com_setting.y) })
                    .start();
                break;
            case "closeSetting":
                if (this.sLock) {
                    return;
                }
                this.sLock = true;
                this.setBtn.active = true;
                this.com_setting.x = this.pos_setting - 200;
                this.setBtn.x = this.pos_setBtn + 200;
                cc.tween(this.com_setting)
                    .to(0.3, { position: cc.v2(this.com_setting.x + 200, this.com_setting.y) })
                    .call(() => {
                        this.com_setting.active = false;
                        this.sLock = false;
                    })
                    .start();
                cc.tween(this.setBtn)
                    .to(0.3, { position: cc.v2(this.setBtn.x - 200, this.setBtn.y) })
                    .start();
                break;
                break;
            case "help":
                this.helpUI.active = true;
                break;
            case "closeHelp":
                this.helpUI.active = false;
                break;
            case "nextPage":
                let a = this.helpPageView.getCurrentPageIndex();
                a = a == this.helpPageView.content.children.length - 1 ? 0 : a + 1;
                this.helpPageView.scrollToPage(a);
                break;
            case "prevPage":
                let b = this.helpPageView.getCurrentPageIndex();
                b = b == 0 ? this.helpPageView.content.children.length - 1 : b - 1;
                this.helpPageView.scrollToPage(b);
                break;
            case "exitGame":
                this.net.socket.disconnect();
                cc.director.loadScene(window.hallName);
                break;
            case "music":
                this.settingControlButtonClick_Function(this.musicBtn, 0);
                break;
            case "sound":
                this.settingControlButtonClick_Function(this.soundBtn, 1);
                break;
        }
    },

    freeType_onclick(event, args) {
        let type = parseInt(args);
        if (this.freeTimes > 0) {
            return;
        }
        let btnList = this.freeBeginNode.getChildByName("xuanze").children;
        for (let i = 0; i < btnList.length; i++) {
            btnList[i].getComponent(cc.Button).interactable = false;
        }
        if (type == 6) {
            type = Math.floor(Math.random() * 5 + 1);
        }
        this.net.socket.emit('freeTimeType', JSON.stringify({ type: type }));
    },

    settingInit_Function: function () {
        cc.audioEngine.stopAll();
        this.com_setting.active = false;
        this.setBtn.active = true;
        this.pos_setting = this.com_setting.x + 200;
        this.pos_setBtn = this.setBtn.x;
        this.playerInfo.musicControl ? (
            this.musicBtn.getChildByName("sp_Control").getComponent("cc.Sprite").spriteFrame = this.sp_settingControl[1],
            this.musicBtn.getChildByName("sp_Control").setPosition(39, 0)) :
            (this.musicBtn.getChildByName("sp_Control").getComponent("cc.Sprite").spriteFrame = this.sp_settingControl[0],
                this.musicBtn.getChildByName("sp_Control").setPosition(-39, 4.5));
        this.playerInfo.soundEffectControl ? (
            this.soundBtn.getComponent("cc.Sprite").spriteFrame = this.sp_settingControl[1],
            this.soundBtn.getChildByName("sp_Control").setPosition(60, 0)) :
            (this.soundBtn.getComponent("cc.Sprite").spriteFrame = this.sp_settingControl[0],
                this.soundBtn.getChildByName("sp_Control").setPosition(-60, 0));

    },

    settingControlButtonClick_Function: function (self, type) {
        var movePoint, action;
        switch (type) {
            case 0:
                if (this.playerInfo.musicControl) {
                    movePoint = cc.moveBy(.1, -78, 4.5);
                    action = cc.sequence(movePoint, cc.callFunc(function () {
                        this.playerInfo.musicControl = 0;
                        self.getChildByName("sp_Control").getComponent("cc.Sprite").spriteFrame = this.sp_settingControl[0];
                        this.writeUserSettingDate_Function();
                    }, this));
                    this.audio.stopAudio();
                } else {
                    movePoint = cc.moveBy(.1, 78, -4.5);
                    action = cc.sequence(movePoint, cc.callFunc(function () {
                        this.playerInfo.musicControl = 1;
                        self.getChildByName("sp_Control").getComponent("cc.Sprite").spriteFrame = this.sp_settingControl[1];
                        this.writeUserSettingDate_Function();
                        if (this.freeTimes > 0) {
                            this.audio.playBgm(1);
                        } else if (this.bigWinBoo) {
                            this.audio.playBgm(2);
                        } else {
                            this.audio.playBgm(0);
                        }
                    }, this));
                }
                break;
            case 1:
                if (this.playerInfo.soundEffectControl) {
                    movePoint = cc.moveBy(.1, -120, 0);
                    action = cc.sequence(movePoint, cc.callFunc(function () {
                        this.playerInfo.soundEffectControl = 0;
                        self.getComponent("cc.Sprite").spriteFrame = this.sp_settingControl[0];
                        this.writeUserSettingDate_Function();
                    }, this));
                } else {
                    movePoint = cc.moveBy(.1, 120, 0);
                    action = cc.sequence(movePoint, cc.callFunc(function () {
                        this.playerInfo.soundEffectControl = 1;
                        self.getComponent("cc.Sprite").spriteFrame = this.sp_settingControl[1];
                        this.writeUserSettingDate_Function();
                    }, this));
                }
                break;
        }
        self.getChildByName("sp_Control").runAction(action);
    },
    /**
     * 将设置数据写入缓存数据
     */
    writeUserSettingDate_Function: function () {
        var data = {
            musicControl: this.playerInfo.musicControl,
            soundEffectControl: this.playerInfo.soundEffectControl
        };
        this.playerInfo.writeData_Function("userSetting", data);
    },

    setBet() {
        this.lblCurBet.string = Helper.toThousands(BET[this.bet] * BETNUM / this.playerInfo.exchangeRate);
    },
    //设置按钮变化
    setBtnState(isStart) {
        this.ksBtn.children[0].active = !isStart;
        this.ksBtn.children[1].active = isStart;
        this.exitBtn.interactable = !isStart;
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
            this.showResult();
        }
    },

    showResult() {
        //结束当前轮盘
        let rIndex = this.rollIndex;
        this.setBtnState(false);
        this.bigWinBoo = false;
        this.lblUserCoin.string = Helper.toThousands(this.lotteryRes.userscore / this.playerInfo.exchangeRate);
        if (this.bIsFreeGame) {
            let addcoin = this.freeGameCoin;
            this.freeGameCoin += this.lotteryRes.winscore;
            this.schedule(() => {
                addcoin += this.lotteryRes.winscore / 10;
                if (addcoin > this.freeGameCoin) {
                    addcoin = this.freeGameCoin;
                }
                this.freeWinCoin.string = Helper.toThousands(addcoin / this.playerInfo.exchangeRate);
            }, 0, 10, 0.1);
        }
        this.scheduleOnce(() => {
            if (rIndex == this.rollIndex) {
                this.turnNum += 1;
                this.playWinAnim(this.turnNum);
            }
        }, 1);

        if (this.lotteryRes.viewarray.getFreeTime.bFlag) {
            this.bIsFreeGame = true;
            if (this.lotteryRes.viewarray.getFreeTime.nFreeType == 0) {
                this.auto = false;
                this.scheduleOnce(() => {
                    let btnList = this.freeBeginNode.getChildByName("xuanze").children;
                    for (let i = 0; i < btnList.length; i++) {
                        btnList[i].active = true;
                        btnList[i].getComponent(cc.Button).interactable = true;
                    }
                    this.freeBeginNode.active = true;
                }, 2);
            } else {
                this.freeTimes = this.lotteryRes.viewarray.getFreeTime.nFreeTime;
                this.stopFree = false;
            }
        }

        if (this.lotteryRes.viewarray.getOpenBox.bFlag) {
            this.bigWinBoo = true;
            this.scheduleOnce(() => {
                this.effectBigWinAnim.active = true;
                this.effectBigWinAnim.children[0].getComponent(cc.Animation).play();
                this.scheduleOnce(() => {
                    this.normalReel.active = false;
                    this.normalNode.active = false;
                    this.bigWin_Anim.play();
                }, 1.2);
            }, 2);

        }
    },

    playWinAnim(tm) {
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
        let list = (this.freeTimes > 0 || this.stopFree) ? [lines[0]] : [...lines];
        hasWinBool = list.length - 1;
        if (this.lotteryRes.winscore > 0) {
            //播放赢钱动画
            let lbl_coin = this.lblWinCoin;
            let addcoin = 0;
            this.cb_coin = () => {
                addcoin += this.lotteryRes.winscore / 20;
                if (addcoin > this.lotteryRes.winscore) {
                    addcoin = this.lotteryRes.winscore;
                }
                lbl_coin.string = Helper.toThousands(addcoin / this.playerInfo.exchangeRate);
            };
            this.schedule(this.cb_coin, 0, 20, 0.06);
        }
        let animIndex = 0;
        if (this.lotteryRes.viewarray.fMultiple > 1) {
            let mul = this.lotteryRes.viewarray.fMultiple;
            this.freeTimesNode.getChildByName("result_mul").getChildByName(`Jinhou_${mul}x`).active = true;
            this.scheduleOnce(() => {
                this.freeTimesNode.getChildByName("result_mul").getChildByName(`Jinhou_${mul}x`).active = false;
            }, 1.3);
        }
        this.schedule(() => {
            if (rIndex == this.rollIndex) {
                this.closeShine();
                for (let i = 0; i < 20; i++) {
                    this.closeAnim(i % 5, parseInt(i / 5));
                }
                if (!!!list[animIndex]) {
                    this.closeShine();
                    return;
                }
                for (let j in list[animIndex]) {
                    this.showAnim(list[animIndex][j] % 5, parseInt(list[animIndex][j] / 5));
                }
                if (this.lotteryRes.viewarray.nWinLines[animIndex]) {
                    this.lblWin_detail.string = `You won ${Helper.toThousands(this.lotteryRes.viewarray.nWinDetail[animIndex]
                        / this.playerInfo.exchangeRate)} on line ${this.lotteryRes.viewarray.nWinLines[animIndex] + 1}`;
                }
                animIndex++;
            }
        }, 3, list.length, 0.01)


        this.scheduleOnce(() => {
            if (tm != this.turnNum) {//不是当前旋转轮次则跳过后续操作
                return;
            }
            if (this.stopFree) {
                this.stopFree = false;
                this.stopFreeTimes();
                this.closeShine();
            }
            if (this.freeTimes > 0) {
                this.freeTimes--;
                this.freeTimesNode.getChildByName("freetimes_lab").getComponent(cc.Label).string = this.freeTimes;
                if (this.freeTimes == 0) {
                    this.stopFree = true;
                }
                this.auto && this.sendRoll();
            }
            if (rIndex == this.rollIndex) {
                this.auto && this.freeTimes == 0 && this.sendRoll();
            }
        }, hasWinBool > 0 ? hasWinBool * 3 : 1);
    },

    //免费次数有关
    startFreeGame() {
        console.log("startFreeGame");
        this.audio.playBgm(1);
        this.freeGameCoin = 0;
        this.BgNode.active = false;
        this.normalNode.active = false;
        this.jackpotNode.active = false;
        this.bIsFreeGame = true;
        this.freeBgNode.active = true;
        this.freeBgNode2.active = true;
        this.BigWinReelAnim.active = false;
        this.autoBtn.active = false;
        this.ksBtn.active = true;
        for (let i in this.freeHideNode) {
            this.freeHideNode[i].active = false;
        }

        for (let i in this.wheelList) {
            this.wheelList[i].initWheel();
        }
        this.freeTimesNode.active = true;
        this.freeWinCoin.string = "0.00";
        this.freeTimes--;
        this.freeTimesNode.getChildByName("freetimes_lab").getComponent(cc.Label).string = this.freeTimes;
        this.setFreeType();
        this.auto = true;
        this.scheduleOnce(() => {
            this.sendRoll();
        }, 1);
    },

    stopFreeTimes() {
        console.log("stopFreeTimes freeGameCoin : ", this.freeGameCoin);
        this.audio.playBgm(0);
        this.auto = false;
        for (let i in this.freeHideNode) {
            this.freeHideNode[i].active = true;
        }

        this.freeTimesNode.active = false;
        this.freeEndNode.active = true;
        this.freeEndNode.getChildByName("lbl_coin").getComponent(cc.Label).string = Helper.toThousands(this.freeGameCoin / this.playerInfo.exchangeRate);
        this.freeEndNode.getChildByName("BigWin01").getComponent(cc.Animation).play();
        this.scheduleOnce(() => {
            this.freeEndNode.active = false;
            this.BgNode.active = true;
            this.normalNode.active = true;
            this.jackpotNode.active = true;
            this.freeBgNode.active = false;
            this.freeBgNode2.active = false;
            this.BigWinReelAnim.active = true;
            this.bIsFreeGame = false;
        }, 2);

    },

    setTypeResult(data) {
        if (data.type > 0) {
            this.freeTimes = data.freeCount;
            this.closeShine();
            let len = this.freeBeginNode.getChildByName("xuanze").children.length;
            this.freeBeginNode.getChildByName("xuanze").children[len - 1].active = false;
            this.card_anim.node.active = true;
            this.freeType = data.type;
            this.card_anim.play();
        }
    },
    //设置免费模式下的显示
    setFreeType() {
        for (let i in this.freeTimesNode.getChildByName("Pick06_Result").children) {
            this.freeTimesNode.getChildByName("Pick06_Result").children[i].active = false;
        }
        this.freeTimesNode.getChildByName("Pick06_Result").getChildByName(`type${this.freeType}`).active = true;
        switch (this.freeType) {
            case 1:
                this.freeTotalTimes = 20;
                break;
            case 2:
                this.freeTotalTimes = 15;
                break;
            case 3:
                this.freeTotalTimes = 10;
                break;
            case 4:
                this.freeTotalTimes = 7;
                break;
            case 5:
                this.freeTotalTimes = 5;
                break;
        }
        this.freeTimesNode.getChildByName("freetimesTotal_lab").getComponent(cc.Label).string = this.freeTotalTimes;
    },

    //0-5 0-3
    showAnim(cols, index) {
        this.audio.playBW();
        let length = this.wheelList[cols].roleIdList.length;
        this.wheelList[cols].rolePbList[length - 2 - index].getComponent("TempAnimation").playAnim();
        this.wheelList[cols].rolePbList[length - 2 - index].children[0].color = new cc.Color(255, 255, 255);
    },

    closeAnim(cols, index) {
        let length = this.wheelList[cols].roleIdList.length;
        let anim = this.wheelList[cols].rolePbList[length - 2 - index].getComponent("TempAnimation");
        if (anim) {
            anim.stopAnim();
        }
        this.wheelList[cols].rolePbList[length - 2 - index].children[0].color = new cc.Color(99, 99, 99);
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

        for (let i in this.lotteryRes.viewarray.boxCardList) {
            let num = parseInt(i);
            let length = this.wheelList[num % 5].roleIdList.length;
            this.wheelList[num % 5].rolePbList[length - 2 - parseInt(i / 5)].children[1].getComponent(cc.Sprite).spriteFrame =
                this.bigWinSprite[this.lotteryRes.viewarray.boxCardList[i].type];
            if (this.lotteryRes.viewarray.boxCardList[i].num) {
                this.wheelList[num % 5].rolePbList[length - 2 - parseInt(i / 5)].getChildByName("num").getComponent(cc.Label).string =
                    Helper.toThousands(this.lotteryRes.viewarray.boxCardList[i].num / this.playerInfo.exchangeRate);
            }
        }
    },

    rollLink() {
        this.status = 1;
        for (let i in this.wheelLinkList) {
            this.wheelLinkList[i].startRoll();
        }
    },

    stateCallBack2() {
        let st = 0;
        for (let i in this.wheelLinkList) {
            if (this.wheelLinkList[i].status) {
                st = 1;
                break;
            }
        }
        this.status = st;
        if (this.status == 0) {
            this.BigWin_btnState.getChildByName("num_lab").getComponent(cc.Label).string = this.bigWinResult.count;
            this.BigWinReelMask.children[0].getChildByName("num_lab").getComponent(cc.Label).string = 20 - this.bigWinResult.sumNum;
            this.BigWinReelMask.children[1].getChildByName("num_lab").getComponent(cc.Label).string = 16 - this.bigWinResult.sumNum;
            this.BigWinReelMask.children[2].getChildByName("num_lab").getComponent(cc.Label).string = 12 - this.bigWinResult.sumNum;
            this.BigWinReelMask.children[3].getChildByName("num_lab").getComponent(cc.Label).string = 8 - this.bigWinResult.sumNum;
            this.BigWinReelMask.children[0].active = (20 - this.bigWinResult.sumNum > 0);
            this.BigWinReelMask.children[1].active = (16 - this.bigWinResult.sumNum > 0);
            this.BigWinReelMask.children[2].active = (12 - this.bigWinResult.sumNum > 0);
            this.BigWinReelMask.children[3].active = (8 - this.bigWinResult.sumNum > 0);
            if (this.bigWinResult.count > 0) {
                this.net.socket.emit('bigWinGO');
            } else {
                //结束大奖模式
                let startNum = 5 * (Math.ceil((20 - this.bigWinResult.sumNum) / 4) >= 0 ? Math.ceil((20 - this.bigWinResult.sumNum) / 4) : 0);
                let win = 0;
                let dt = 0;
                this.node.getChildByName("BG_LinkNum").active = true;
                this.jackpotNode.active = false;
                for (let i in this.bigWinResult.card) {
                    if (parseInt(i) < startNum) {
                        continue;
                    }
                    dt += 0.5;
                    let nowNode = this.effectBigWinNode.children[parseInt(i)];
                    let targetNode = this.node.getChildByName("BG_LinkNum");
                    let worldPos = nowNode.parent.convertToWorldSpaceAR(nowNode.position);
                    let pos = targetNode.convertToNodeSpaceAR(worldPos);
                    let newNode = cc.instantiate(this.rolePb[11]);
                    cc.tween(newNode)
                        .delay(dt)
                        .call(() => {
                            targetNode.addChild(newNode);
                            newNode.scale = 0.6;
                            newNode.setPosition(pos);
                        })
                        .to(0.5, { position: cc.v2(0, 0) })
                        .call(() => {
                            newNode.destroy();
                            win += this.bigWinResult.card[i].num;
                            targetNode.getChildByName("LinkWinTotal_lab").getComponent(cc.Label).string = Helper.toThousands(win / this.playerInfo.exchangeRate);
                            if (win == this.bigWinResult.win) {
                                this.scheduleOnce(() => {
                                    this.bigWinEnd();
                                }, 2);
                            }
                        })
                        .start();
                }
            }

        }
    },

    bigWinEnd() {
        this.bigWin_Anim.play();
        this.bigWin_Anim.setCurrentTime(0);
        this.bigWin_Anim.stop();
        this.BigWin_btnStart.active = false;
        this.BigWin_btnState.active = false;
        this.jackpotNode.active = true;
        this.autoBtn.active = this.auto;
        this.ksBtn.active = !this.auto;
        this.bigWinBoo = false;
        this.BigWinReel.active = false;
        this.normalReel.active = true;
        this.normalNode.active = true;
        this.BigWinReelMask.children[0].active = false;
        this.BigWinReelMask.children[1].active = false;
        this.BigWinReelMask.children[2].active = false;
        this.BigWinReelMask.children[3].active = false;
        this.initBigWinNode();
        this.lblUserCoin.string = Helper.toThousands(this.bigWinResult.userscore / this.playerInfo.exchangeRate);
        //播放赢钱动画
        let lbl_coin = this.lblWinCoin;
        let addcoin = 0;
        this.cb_coin = () => {
            addcoin += this.bigWinResult.win / 20;
            if (addcoin > this.bigWinResult.win) {
                addcoin = this.bigWinResult.win;
            }
            lbl_coin.string = Helper.toThousands(addcoin / this.playerInfo.exchangeRate);
        };
        this.schedule(this.cb_coin, 0, 20, 0.06);
        this.freeEndNode.active = true;
        this.freeEndNode.getChildByName("lbl_coin").getComponent(cc.Label).string = Helper.toThousands(this.bigWinResult.win / this.playerInfo.exchangeRate);
        this.freeEndNode.getChildByName("BigWin01").getComponent(cc.Animation).play();
        this.scheduleOnce(() => {
            this.freeEndNode.active = false;
        }, 2);
    },

    closeShine() {
        for (let i = 0; i < 20; i++) {
            let length = this.wheelList[i % 5].roleIdList.length;
            if (this.wheelList[i % 5].rolePbList[length - 2 - parseInt(i / 5)]) {
                this.wheelList[i % 5].rolePbList[length - 2 - parseInt(i / 5)].children[0].color = new cc.Color(255, 255, 255);
            }
        }
    },

    sendRoll() {
        this.rollIndex++;
        this.closeShine();
        this.unschedule(this.cb_coin);
        this.lblWinCoin.string = '0.00';
        this.lblWin_detail.string = "GOOD LUCK";
        this.net.socket.emit('lottery', JSON.stringify({
            bet: this.bet,
            nBetList: [BET[this.bet] * BETNUM]
        }));
    },

    sendBigWin() {
        this.BigWin_btnStart.active = false;
        this.BigWin_btnState.active = true;
        this.unschedule(this.cb_coin);
        this.lblWinCoin.string = '0.00';
        this.lblWin_detail.string = "GOOD LUCK";
        this.BigWin_btnState.getChildByName("num_lab").getComponent(cc.Label).string = "3";
        this.net.socket.emit('bigWinGO');
    },

    stopImmediately() {
        if (!this.auto) {
            for (let i in this.wheelList) {
                this.wheelList[i].stopImmediately();
            }
        }
    },

    //设置奖池
    setPool(data) {
        this.winPool = data;
        this.lblCoinList[0].string = Helper.toThousands(data / this.playerInfo.exchangeRate);
        this.lblCoinList[1].string = Helper.toThousands(0.5 * data / this.playerInfo.exchangeRate);
        this.lblCoinList[2].string = Helper.toThousands(0.2 * data / this.playerInfo.exchangeRate);
        this.lblCoinList[3].string = Helper.toThousands(0.05 * data / this.playerInfo.exchangeRate);
    },
    //刷新奖池
    refreshPool(data) {
        this.lblCoinList[0].string = Helper.toThousands(data / this.playerInfo.exchangeRate);
        this.lblCoinList[1].string = Helper.toThousands(0.5 * data / this.playerInfo.exchangeRate);
        this.lblCoinList[2].string = Helper.toThousands(0.2 * data / this.playerInfo.exchangeRate);
        this.lblCoinList[3].string = Helper.toThousands(0.05 * data / this.playerInfo.exchangeRate);
    },

});