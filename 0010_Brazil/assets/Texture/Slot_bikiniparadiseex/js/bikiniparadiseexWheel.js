const ROLENUM = 60; //每一轮的角色数量
const TIMEMIN = 1.5; //第一轮摇奖时间

cc.Class({
    extends: cc.Component,

    properties: {
        wheelId: 0,
        excludeId: {
            default: 0,
            displayName: '不会出现的数字id',
        },
    },

    onLoad() {
        this.audio = cc.director.getScene().getChildByName('Canvas').getComponent('bikiniparadiseexAudio');
        this.mainObj = cc.director.getScene().getChildByName('Canvas').getComponent('bikiniparadiseexMain');
        this.mainObj.wheelList[this.wheelId] = this;
        this.status = 0; //0停止 1转 
        this.lastResult = [0, 0, 0, 0, 0, 0]; //中间三位是上一局结果 首位末尾是为了防止露出部分转起来不一样 
        this.rolePbList = []; //roles
        this.roleIdList = []; //role ID
    },

    start() {
        //初始化场景role
        this.initWheel();
    },

    initWheel() {
        this.rolePbList = [];
        this.roleIdList = [];
        this.node.removeAllChildren();
        for (let i = 0; i < ROLENUM - 12; i++) {
            this.addRole(this.getRandomId());
        }
        this.addRole(this.getRandomId());
        this.node.y = 0;
        this.mainObj.rollIndex++;
        this.mainObj.closeShine();
        this.lastResult = this.roleIdList.slice(-6);
        this.argLen = 0;
    },

    startRoll(...args) {
        this.status = 1;
        this.rolePbList = [];
        this.roleIdList = [];
        this.node.removeAllChildren();
        this.node.y = 0;

        this.addRole(this.getRandomId(), true);
        for (let i = args.length - 1; i >= 0; i--) {
            if (args[i] == 12) {
                if (i != args.length - 1) {
                    if (args[i - 1] != 12) {
                        this.addRole(12 + this.wheelId, true);
                    } else {
                        this.addRole(12 + this.wheelId, false);
                    }
                } else {
                    this.addRole(12 + this.wheelId, true);
                }
            } else {
                this.addRole(args[i], true);
            }
        }

        for (let i = 0; i < ROLENUM - 12; i++) {
            this.addRole(this.getRandomId(), true);
        }

        for (let i = 0; i < this.lastResult.length; i++) {
            this.lastResult[i] = this.lastResult[i] == 0 ? this.getRandomId() : this.lastResult[i];
            if (this.lastResult[i] == 12) {
                if (i != this.lastResult.length - 1) {
                    if (this.lastResult[i + 1] != 12) {
                        this.addRole(12 + this.wheelId, true);
                    } else {
                        this.addRole(12 + this.wheelId, false);
                    }
                } else {
                    this.addRole(12 + this.wheelId, true);
                }
            } else {
                this.addRole(this.lastResult[i], true);
            }
        }
        this.argLen = args.length;

        setTimeout(() => {
            let timer = TIMEMIN + this.wheelId * 0.1;
            // timer = !this.mainObj.auto ? TIMEMIN : timer;
            this.node.runAction(
                cc.sequence(
                    cc.delayTime(0.1),
                    cc.moveTo(timer, cc.v2(this.node.x, -this.node.height + 750)),
                    cc.moveTo(0.1, cc.v2(this.node.x, -this.node.height + 700)),
                    cc.moveTo(0.1, cc.v2(this.node.x, -this.node.height + 750)),
                    cc.callFunc(this.rollCallBack.bind(this))
                )
            );
        }, 100);
    },

    getRandomId() {
        let randomId = 0;
        while (randomId == 0) {
            randomId = Math.floor(Math.random() * 11 + 1);
            randomId = randomId == this.excludeId ? 0 : randomId;
        };
        return randomId;
    },

    addRole(id, needShow) {
        let pb = cc.instantiate(this.mainObj.rolePb[id]);
        if (!needShow) {
            pb.children[0].active = false;
        }
        this.rolePbList.push(pb);
        this.roleIdList.push(id);
        this.addClickEvent(pb, id);
        this.node.addChild(pb);
    },

    rollCallBack() {
        this.audio.playStopWheel();
        this.lastResult = this.roleIdList.slice(0, 6);
        this.status = 0;
        this.mainObj.stateCallBack();
    },

    stopImmediately() {
        this.lastResult = this.roleIdList.slice(0, 6);
        this.node.stopAllActions();
        setTimeout(() => {
            this.node.y = -this.node.height + 750;
        }, 50);
        this.status = 0;
        this.mainObj.stateCallBack();
    },

    addClickEvent(node, idx) {
        let clickEventHandler = new cc.Component.EventHandler();
        clickEventHandler.target = this.node; // 这个 node 节点是你的事件处理代码组件所属的节点
        clickEventHandler.component = "bikiniparadiseWheel";// 这个是代码文件名
        clickEventHandler.handler = "roleClick";
        clickEventHandler.customEventData = idx;

        let button = node.getComponent(cc.Button);
        button.clickEvents.push(clickEventHandler);
    },

    roleClick: function (event, customEventData) {
        let newNode = cc.instantiate(this.mainObj.detailPb);
        let newVec2 = event.target.convertToWorldSpaceAR(cc.v2(0, 0));
        let p = this.mainObj.node.convertToNodeSpaceAR(newVec2);
        newNode.position = p;
        // newNode.y += 10;
        let isLeft = newNode.x < 10;
        newNode.getComponent("bikiniparadiseDetail").init(customEventData, isLeft);
        this.mainObj.node.addChild(newNode);
        // cc.log(newNode.position);

    }
});