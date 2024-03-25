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
        this.audio = cc.director.getScene().getChildByName('Canvas').getComponent('fortunetigerAudio');
        this.mainObj = cc.director.getScene().getChildByName('Canvas').getComponent('fortunetigerMain');
        this.mainObj.wheelList[this.wheelId] = this;
        this.status = 0; //0停止 1转 
        this.lastResult = [0, 0, 0, 0, 0]; //中间三位是上一局结果 首位末尾是为了防止露出部分转起来不一样 
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
        for (let i in this.lastResult) {
            this.lastResult[i] = this.getRandomId();
            this.addRole(this.lastResult[i]);
        }
        this.addRole(this.getRandomId());
        this.node.y = 0;
        this.mainObj.rollIndex++;
        this.mainObj.closeShine();
    },
    //清空卷轴
    removeWheel() {
        this.rolePbList = [];
        this.roleIdList = [];
        this.node.removeAllChildren();
        this.node.y = 0;
    },

    startRoll(...args) {
        this.status = 1;
        this.rolePbList = [];
        this.roleIdList = [];
        this.node.removeAllChildren();
        this.node.y = 0; //滚轮启动位移距离
        for (let i in this.lastResult) {
            this.lastResult[i] = this.lastResult[i] == 0 ? this.getRandomId() : this.lastResult[i];
            this.addRole(this.lastResult[i]);
        }
        for (let i = 0; i < ROLENUM - 12; i++) {
            this.addRole(this.getRandomId());
        }
        for (let i in args) {
            this.addRole(args[i]);
        }
        this.addRole(this.getRandomId());
        setTimeout(() => {
            let timer = TIMEMIN + this.wheelId * 0.2;
            //timer = !this.mainObj.auto ? TIMEMIN : timer;
            this.node.runAction(
                cc.sequence(
                    cc.delayTime(0.2),
                    cc.moveTo(timer, cc.v2(this.node.x, -this.node.height + 800)),
                    cc.moveTo(0.1, cc.v2(this.node.x, -this.node.height + 750)),
                    cc.moveTo(0.1, cc.v2(this.node.x, -this.node.height + 800)),
                    cc.callFunc(this.rollCallBack.bind(this))
                )
            );
        }, 100);
    },

    startFreeRoll(...args) {
        this.status = 1;
        this.rolePbList = [];
        this.roleIdList = [];
        this.node.removeAllChildren();
        this.node.y = 0; //滚轮启动位移距离
        for (let i in this.lastResult) {
            this.lastResult[i] = this.lastResult[i] == 0 ? this.getRandomId() : this.lastResult[i];
            this.addRole(this.lastResult[i]);
        }
        for (let i = 0; i < ROLENUM * 3; i++) {
            this.addRole(this.getRandomId());
        }
        setTimeout(() => {
            let timer = TIMEMIN * 3 + this.wheelId * 0.2;
            this.node.runAction(
                cc.sequence(
                    cc.delayTime(0.2),
                    cc.moveTo(timer, cc.v2(this.node.x, -this.node.height + 800)),
                    cc.callFunc(this.FreeRoll_again.bind(this, args))
                )
            );
        }, 100);
    },

    FreeRoll_again(args) {
        this.status = 1;
        this.rolePbList = [];
        this.roleIdList = [];
        this.node.removeAllChildren();
        this.node.y = 0; //滚轮启动位移距离
        for (let i in this.lastResult) {
            this.lastResult[i] = this.lastResult[i] == 0 ? this.getRandomId() : this.lastResult[i];
            this.addRole(this.lastResult[i]);
        }
        for (let i = 0; i < ROLENUM; i++) {
            this.addRole(this.getRandomId());
        }
        let chooseNum = 0;
        for (let i in args) {
            if (args[i] == 8) {
                this.addRole(this.getRandomId());
            } else {
                this.addRole(args[i]);
                chooseNum = args[i];
            }
        }
        this.addRole(this.getRandomId());
        for (let i in this.roleIdList) {
            if (this.roleIdList[i] != chooseNum) {
                for (let j in this.rolePbList[i].children) {
                    this.rolePbList[i].children[j].active = false;
                }
            }
        }
        setTimeout(() => {
            let timer = TIMEMIN * 3 + this.wheelId * 0.2;
            this.node.runAction(
                cc.sequence(
                    cc.delayTime(0.2),
                    cc.moveTo(timer, cc.v2(this.node.x, -this.node.height + 800)),
                    cc.callFunc(this.rollCallBack_Free.bind(this))
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
        this.lastResult = this.roleIdList.slice(-5);
        this.status = 0;
        this.mainObj.stateCallBack();
    },

    rollCallBack_Free() {
        this.audio.playStopWheel();
        this.status = 0;
        this.mainObj.stateCallBack();
    },


    stopImmediately() {
        this.lastResult = this.roleIdList.slice(-5);
        this.node.stopAllActions();
        setTimeout(() => {
            this.node.y = -this.node.height + 800;
        }, 50);
        this.status = 0;
        this.mainObj.stateCallBack();
    },

    addClickEvent(node, idx) {
        let clickEventHandler = new cc.Component.EventHandler();
        clickEventHandler.target = this.node; // 这个 node 节点是你的事件处理代码组件所属的节点
        clickEventHandler.component = "fortunetigerWheel";// 这个是代码文件名
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
        newNode.getComponent("fortunetigerDetail").init(customEventData, isLeft);
        this.mainObj.node.addChild(newNode);
        cc.log(newNode.position);

    }
});