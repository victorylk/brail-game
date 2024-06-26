const ROLENUM = 40; //每一轮的角色数量
const TIMEMIN = 1; //第一轮摇奖时间

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
        this.audio = cc.director.getScene().getChildByName('Canvas').getComponent('fortuneoxAudio');
        this.mainObj = cc.director.getScene().getChildByName('Canvas').getComponent('fortuneoxMain');
        this.mainObj.wheelList[this.wheelId] = this;
        this.status = 0; //0停止 1转 
        this.lastResult = [0, 0, 0, 0, 0]; //中间三位是上一局结果 首位末尾是为了防止露出部分转起来不一样 
        this.rolePbList = []; //roles
        this.roleIdList = []; //role ID
        this.lastResultNum = [0, 0, 0, 0, 0];
    },

    start() {
        //初始化场景role
        this.initWheel();
    },

    initWheel() {
        this.rolePbList = [];
        this.roleIdList = [];
        this.node.removeAllChildren();
        for (let i in this.lastResult) {
            this.lastResult[i] = this.getRandomId();
            this.addRole(this.lastResult[i]);
        }
        this.addRole(this.getRandomId());
        this.p = 0;
        if (this.wheelId == 1) {
            this.p = 170;
        }
        this.node.y = this.p;
        this.mainObj.rollIndex++;
        this.mainObj.closeShine();
        this.lastResult = this.roleIdList.slice(-5);
    },

    startRoll(...args) {
        this.status = 1;
        this.rolePbList = [];
        this.roleIdList = [];
        this.node.removeAllChildren();
        this.node.y = this.p; //滚轮启动位移距离
        this.addRole(this.getRandomId());
        for (let i = args.length - 1; i >= 0; i--) {
            if (args[i] == 8) {
                this.addRole(this.getRandomId());
            } else {
                this.addRole(args[i]);
            }
        }
        for (let i = 0; i < ROLENUM - 12; i++) {
            this.addRole(this.getRandomId());
        }

        for (let i = 0; i < this.lastResult.length; i++) {
            this.lastResult[i] = this.lastResult[i] == 0 ? this.getRandomId() : this.lastResult[i];
            this.addRole(this.lastResult[i]);
        }
        setTimeout(() => {
            let timer = TIMEMIN + this.wheelId * 0.2;
            //timer = !this.mainObj.auto ? TIMEMIN : timer;
            this.node.runAction(
                cc.sequence(
                    cc.delayTime(0.2),
                    cc.moveTo(timer, cc.v2(this.node.x, -this.node.height + 672 + this.p)),
                    cc.moveTo(0.1, cc.v2(this.node.x, -this.node.height + 620 + this.p)),
                    cc.moveTo(0.1, cc.v2(this.node.x, -this.node.height + 672 + this.p)),
                    cc.callFunc(this.rollCallBack.bind(this))
                )
            );
        }, 100);
    },

    getRandomId() {
        let randomId = 0;
        while (randomId == 0) {
            randomId = Math.floor(Math.random() * (this.mainObj.rolePb.length - 1) + 1);
            randomId = randomId == this.excludeId ? 0 : randomId;
        };
        return randomId;
    },

    addRole(id) {
        let pb = cc.instantiate(this.mainObj.rolePb[id]);
        this.rolePbList.push(pb);
        this.roleIdList.push(id);
        this.addClickEvent(pb, id);
        this.node.addChild(pb);
    },

    rollCallBack() {
        this.audio.playStopWheel();
        this.lastResult = this.roleIdList.slice(0, 5);
        for (let i = 0; i < this.lastResult.length; i++) {
            if (this.lastResult[i] == 8) {
                this.lastResultNum[i] = this.rolePbList[i].children[1].getComponent(cc.Label).string;
            } else {
                this.lastResultNum[i] = 0;
            }
        }
        this.status = 0;
        this.mainObj.stateCallBack();
    },

    stopImmediately() {
        this.lastResult = this.roleIdList.slice(0, 5);
        for (let i = 0; i < this.lastResult.length; i++) {
            if (this.lastResult[i] == 8) {
                this.lastResultNum[i] = this.rolePbList[i].children[1].getComponent(cc.Label).string;
            } else {
                this.lastResultNum[i] = 0;
            }
        }
        this.node.stopAllActions();
        setTimeout(() => {
            this.node.y = -this.node.height + 672 + this.p;
        }, 50);
        this.status = 0;
        this.mainObj.stateCallBack();
    },

    addClickEvent(node, idx) {
        let clickEventHandler = new cc.Component.EventHandler();
        clickEventHandler.target = this.node; // 这个 node 节点是你的事件处理代码组件所属的节点
        clickEventHandler.component = "fortuneoxWheel";// 这个是代码文件名
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
        newNode.x -= 50;
        let isLeft = newNode.x < 10;
        newNode.getComponent("fortuneoxDetail").init(customEventData, isLeft);
        this.mainObj.node.addChild(newNode);
        cc.log(newNode.position);

    }
});