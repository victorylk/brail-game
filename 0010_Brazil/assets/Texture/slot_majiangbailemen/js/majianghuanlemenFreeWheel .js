const ROLENUM = 50; //每一轮的角色数量
const TIMEMIN = 2; //第一轮摇奖时间

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
        this.audio = cc.director.getScene().getChildByName('Canvas').getComponent('majianghuanlemenAudio');
        this.mainObj = cc.director.getScene().getChildByName('Canvas').getComponent('majianghuanlemenMain');
        this.widget = this.getComponent(cc.Widget);
        this.mainObj.freeWheelList[this.wheelId] = this;
        this.status = 0; //0初始化 1转 2转停止 
        this.lastResult = [0, 0, 0, 0, 0, 0, 0, 0]; //三位是上一局结果
        this.rolePbList = []; //role
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
        for (let i = 0; i < ROLENUM - 15; i++) {
            this.addRole(this.getRandomId());
        }
        this.addRole(this.getRandomId());
        this.widget.bottom = 5;
        this.widget.updateAlignment();
        this.mainObj.rollIndex++;
    },

    startRoll(...args) {
        this.status = 1;
        this.rolePbList = [];
        this.roleIdList = [];
        this.node.removeAllChildren();
        this.widget.bottom = 5;
        this.widget.updateAlignment();

        for (let i in this.lastResult) {
            this.lastResult[i] = this.lastResult[i] == 0 ? this.getRandomId() : this.lastResult[i];
            this.addRole(this.lastResult[i]);
        }
        for (let i in args) {
            this.addRole(args[i]);
        }
        for (let i = 0; i < ROLENUM - 9; i++) {
            this.addRole(this.getRandomId());
        }
        for (let i = 0; i < 8; i++) {
            this.addRole(args[i]);
        }
        this.addRole(this.getRandomId());

        setTimeout(() => {
            let timer = TIMEMIN + this.wheelId * 0.4;
            // timer = !this.mainObj.auto ? TIMEMIN : timer;

            this.node.runAction(
                cc.sequence(
                    //cc.delayTime(0.2),
                    cc.moveTo(timer, cc.v2(this.node.x, -this.node.height + 1152)),
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
        this.node.addChild(pb);
    },

    rollCallBack() {
        for (let i = 0; i < this.lastResult.length; i++) {
            this.rolePbList.splice(0, 1)[0].removeFromParent();
            this.roleIdList.splice(0, 1);
        }
        this.widget.bottom = 5;
        this.widget.updateAlignment();
        this.audio.playStopWheel();
        this.lastResult = this.roleIdList.slice(0, 8);
        // cc.log(this.lastResult, this.roleIdList);
        this.status = 2;
        this.mainObj.stateCallBack();
    },

    stopImmediately() {
        this.lastResult = this.roleIdList.slice(0, 8);
        this.node.stopAllActions();
        setTimeout(() => {
            this.node.y = -this.node.height + 1152;
            this.rollCallBack();
        }, 50);
    },

    changeRoll(id) {
        // console.log("remove Roll item :", id);

        this.addRole(this.getRandomId());
        //添加一个压缩动作，实现下落效果
        this.rolePbList[id].runAction(cc.sequence(
            cc.scaleTo(0.8, 1, 0.5),
            cc.callFunc(() => {
                this.rolePbList.splice(id, 1)[0].removeFromParent();
                this.roleIdList.splice(id, 1);
                this.lastResult = this.roleIdList.slice(0, 8);
                // cc.log(this.roleIdList);
                console.log("----------------------Admin over!");

            })
        ));

    },
});