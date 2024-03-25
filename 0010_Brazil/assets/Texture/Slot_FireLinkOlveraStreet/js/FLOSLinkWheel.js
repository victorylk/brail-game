const ROLENUM = 40; //每一轮的角色数量
const TIMEMIN = 1; //第一轮摇奖时间

cc.Class({
    extends: cc.Component,

    properties: {
        wheelId: 0,
    },

    onLoad() {
        this.audio = cc.director.getScene().getChildByName('Canvas').getComponent('FLOSAudio');
        this.mainObj = cc.director.getScene().getChildByName('Canvas').getComponent('FLOSMain');
        this.mainObj.wheelLinkList[this.wheelId] = this;
        this.status = 0; //0停止 1转 
        this.lastResult = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]; //中间4位是上一局结果 首位末尾是为了防止露出部分转起来不一样 
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
        for (let i = 0; i < ROLENUM; i++) {
            this.addRole(this.getRandomId());
        }
        this.lastResult = this.roleIdList.slice(0, 10);
        this.node.y = 0;
        this.mainObj.rollIndex++;
        this.mainObj.closeShine();
    },

    startRoll() {
        this.status = 1;
        this.rolePbList = [];
        this.roleIdList = [];
        this.node.removeAllChildren();
        this.node.y = 0; //滚轮启动位移距离

        for (let i in this.lastResult) {
            this.lastResult[i] = this.lastResult[i] == 0 ? this.getRandomId() : this.lastResult[i];
            this.addRole(this.lastResult[i]);
        }
        for (let i = 0; i < ROLENUM - this.lastResult.length - 1; i++) {
            this.addRole(this.getRandomId());
        }
        this.addRole(this.getRandomId());//防止顶部露出
        setTimeout(() => {
            let timer = TIMEMIN + this.wheelId * 0.3;
            this.node.runAction(
                cc.sequence(
                    cc.delayTime(0.2),
                    cc.moveTo(timer, cc.v2(this.node.x, -this.node.height + 1224)),
                    cc.moveTo(0.15, cc.v2(this.node.x, -this.node.height + 1194)),
                    cc.moveTo(0.1, cc.v2(this.node.x, -this.node.height + 1224)),
                    cc.callFunc(this.rollCallBack.bind(this))
                )
            );
        }, 100);
    },

    getRandomId() {
        let randomId = 0;
        while (randomId == 0) {
            randomId = Math.floor(Math.random() * (this.mainObj.rolePb.length - 2) + 1);
            randomId = randomId > 9 ? 0 : randomId;
        };
        return randomId;
    },

    addRole(id) {
        let pb = cc.instantiate(this.mainObj.rolePb[id]);
        this.rolePbList.push(pb);
        this.roleIdList.push(id);
        this.node.addChild(pb);
    },

    rollCallBack() {
        this.audio.playStopWheel();
        this.lastResult = this.roleIdList.slice(-10);
        this.status = 0;
        this.mainObj.setBigWin(this.wheelId);
        this.mainObj.stateCallBack2();
    },

});