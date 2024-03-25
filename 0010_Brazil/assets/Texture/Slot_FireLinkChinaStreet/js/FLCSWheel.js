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
        this.audio = cc.director.getScene().getChildByName('Canvas').getComponent('FLCSAudio');
        this.mainObj = cc.director.getScene().getChildByName('Canvas').getComponent('FLCSMain');
        this.mainObj.wheelList[this.wheelId] = this;
        this.status = 0; //0停止 1转 
        this.lastResult = [0, 0, 0, 0, 0, 0]; //中间4位是上一局结果 首位末尾是为了防止露出部分转起来不一样 
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
        setTimeout(() => {
            this.lastResult = this.roleIdList.slice(-6);
            this.node.y = -this.node.height + 680;
        }, 50);

        this.mainObj.rollIndex++;
        this.mainObj.closeShine();
    },

    startRoll(...args) {
        this.status = 1;
        for (let i in this.rolePbList) {
            if (i < this.rolePbList.length - 6) {
                this.rolePbList[i].destroy();
            }
        }
        this.rolePbList = this.rolePbList.slice(-6);
        this.roleIdList = [...this.lastResult];
        this.node.y = 0; //滚轮启动位移距离

        for (let i = 0; i < ROLENUM - this.lastResult.length - args.length - 1; i++) {
            this.addRole(this.getRandomId());
        }
        for (let i in args) {
            this.addRole(args[i]);
        }
        this.addRole(this.getRandomId());//防止顶部露出
        setTimeout(() => {
            let timer = TIMEMIN + this.wheelId * 0.3;
            // timer = !this.mainObj.auto ? TIMEMIN : timer;
            this.node.runAction(
                cc.sequence(
                    cc.delayTime(0.2),
                    cc.moveTo(timer, cc.v2(this.node.x, -this.node.height + 680)),
                    cc.moveTo(0.15, cc.v2(this.node.x, -this.node.height + 650)),
                    cc.moveTo(0.1, cc.v2(this.node.x, -this.node.height + 680)),
                    cc.callFunc(this.rollCallBack.bind(this))
                )
            );
        }, 100);
    },

    getRandomId() {
        let randomId = 0;
        while (randomId == 0) {
            if (this.mainObj.freeTimes > 0 || this.mainObj.stopFree) {
                randomId = Math.floor(Math.random() * (this.mainObj.rolePb.length - 2) + 1);
            } else {
                randomId = Math.floor(Math.random() * (this.mainObj.rolePb.length - 2) + 1);
            }
            randomId = randomId == this.excludeId ? 0 : randomId;
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
        this.lastResult = this.roleIdList.slice(-6);
        this.status = 0;
        this.mainObj.stateCallBack();
    },

    stopImmediately() {
        this.lastResult = this.roleIdList.slice(-6);
        this.node.stopAllActions();
        if (this.status != 0) {
            this.node.runAction(
                cc.sequence(
                    cc.delayTime(0.05),
                    cc.callFunc(() => {
                        this.node.y = -this.node.height + 680;
                    }),
                    cc.moveTo(0.15, cc.v2(this.node.x, -this.node.height + 650)),
                    cc.moveTo(0.1, cc.v2(this.node.x, -this.node.height + 680)),

                )
            );
        }
        this.status = 0;
        this.mainObj.stateCallBack();
    },
});