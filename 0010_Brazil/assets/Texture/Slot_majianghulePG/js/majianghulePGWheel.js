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
        this.audio = cc.director.getScene().getChildByName('Canvas').getComponent('majianghulePGAudio');
        this.mainObj = cc.director.getScene().getChildByName('Canvas').getComponent('majianghulePGMain');
        this.widget = this.getComponent(cc.Widget);
        this.mainObj.wheelList[this.wheelId] = this;
        this.status = 0; //0初始化 1转 2转停止 
        this.lastResult = [0, 0, 0, 0, 0]; //6位是上一局结果
        this.rolePbList = []; //role
        this.roleIdList = []; //role ID
        this.moveY = 0;
    },

    start() {
        //初始化场景role
        this.initWheel();
    },

    initWheel() {
        this.rolePbList = [];
        this.roleIdList = [];
        this.node.removeAllChildren();
        for (let i = 0; i < ROLENUM - 16; i++) {
            this.addRole(this.getRandomId());
        }
        this.addRole(this.getRandomId());
        this.moveY = 700;
        this.widget.bottom = 20;
        this.widget.updateAlignment();
        this.mainObj.rollIndex++;
        this.argLen = 0;
        this.lastResult = this.roleIdList.slice(-5);
    },

    startRoll(...args) {
        this.status = 1;
        this.rolePbList = [];
        this.roleIdList = [];
        this.node.removeAllChildren();
        this.widget.bottom = 20;
        this.widget.updateAlignment();

        this.addRole(this.getRandomId());

        for (let i = args.length - 1; i >= 0; i--) {
            if (args[i] == 12) {
                this.addRole(this.getRandomId());
            } else {
                this.addRole(args[i]);
            }
        }
        for (let i = 0; i < ROLENUM - 9; i++) {
            this.addRole(this.getRandomId());
        }

        for (let i = 0; i < this.lastResult.length; i++) {
            this.lastResult[i] = this.lastResult[i] == 0 ? this.getRandomId() : this.lastResult[i];
            this.addRole(this.lastResult[i]);
        }

        this.argLen = args.length;
        this.moveY = 700 + (args.length - 4) * 140;
        setTimeout(() => {
            let timer = TIMEMIN + this.wheelId * 0.2;
            this.node.runAction(
                cc.sequence(
                    //cc.delayTime(0.2),
                    cc.moveTo(timer, cc.v2(this.node.x, -this.node.height + this.moveY)),
                    cc.moveTo(0.1, cc.v2(this.node.x, -this.node.height + this.moveY + 30)),
                    cc.moveTo(0.1, cc.v2(this.node.x, -this.node.height + this.moveY)),
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
        let pb = null;
        if (id > 100) {
            pb = cc.instantiate(this.mainObj.rolePb[id - 100]);
            pb.children[0].active = false;
            pb.children[2].active = true;
            this.roleIdList.push(id - 100);
        } else {
            pb = cc.instantiate(this.mainObj.rolePb[id]);
            this.roleIdList.push(id);
        }

        if (this.mainObj.bIsFreeGame && this.wheelId == 2 && id < 10) {
            pb.children[0].active = false;
            pb.children[2].active = true;
        }
        this.rolePbList.push(pb);
        this.addClickEvent(pb, id);
        this.node.addChild(pb);
    },

    rollCallBack() {
        // for (let i = 0; i < this.lastResult.length; i++) {
        //     this.rolePbList.splice(0, 1)[0].removeFromParent();
        //     this.roleIdList.splice(0, 1);
        // }
        // this.widget.bottom = -this.node.height + this.moveY;
        // this.widget.updateAlignment();
        this.audio.playStopWheel();
        this.lastResult = this.roleIdList.slice(0, 5);
        // cc.log(this.lastResult, this.roleIdList);
        this.status = 2;
        this.mainObj.stateCallBack();
    },

    stopImmediately() {
        this.lastResult = this.roleIdList.slice(0, 5);
        this.node.stopAllActions();
        setTimeout(() => {
            this.node.y = -this.node.height + this.moveY;
            this.rollCallBack();
            cc.log(this.wheelId + "----------------------Admin over!");
        }, 50);
    },

    changeRoll(id, node) {
        cc.log("remove Roll item :", id, this.wheelId, this.roleIdList[id]);
        if (node.children[3] && node.children[3].active) {
            node.children[3].active = false;
            let pb = cc.instantiate(this.mainObj.rolePb[10]);
            node.addChild(pb);
            this.roleIdList.splice(id, 1, 10);
        } else {
            // this.addRole(this.getRandomId());
            //添加一个压缩动作，实现下落效果
            cc.tween(this.rolePbList[id])
                .delay(0.7)
                .to(0.2, { height: 0 })
                .call(() => {
                    this.rolePbList.splice(id, 1);
                    node.destroy();
                    this.roleIdList.splice(id, 1);
                    // cc.log(node[0], id);
                    this.argLen -= 1;
                    this.lastResult = this.roleIdList.slice(0, 5);
                    // console.log(this.wheelId + "----------------------Admin over!", this.roleIdList, this.lastResult);
                })
                .start();
        }
    },

    vibrateAction() {
        for (let i in this.rolePbList) {
            let rx = Math.random() * 12 - 6;
            let ry = Math.random() * 12 - 6;
            let seq = cc.repeat(
                cc.sequence(
                    cc.moveBy(0.06, rx, ry),
                    cc.moveBy(0.06, -rx, -ry)
                ), 5);
            for (let j in this.rolePbList[i].children) {
                this.rolePbList[i].children[j].runAction(seq);
            }
        }
    },

    addClickEvent(node, idx) {
        let clickEventHandler = new cc.Component.EventHandler();
        clickEventHandler.target = this.node; // 这个 node 节点是你的事件处理代码组件所属的节点
        clickEventHandler.component = "majianghulePGWheel";// 这个是代码文件名
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
        newNode.y += 10;
        let isLeft = newNode.x < 10;
        newNode.getComponent("majianghulePGDetail").init(customEventData, isLeft);
        this.mainObj.node.addChild(newNode);
        cc.log(newNode.position);

    }
});