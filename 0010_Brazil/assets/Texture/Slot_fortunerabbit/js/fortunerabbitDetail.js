const GAME_COMBINATIONS = [
    { 3: 2 },		// hand cards no fix line 0
    { 3: 3 },		// hand cards no fix line 1
    { 3: 5 },		// hand cards no fix line 2
    { 3: 10 },		// hand cards no fix line 3
    { 3: 50 },	    // hand cards no fix line 4
    { 3: 100 },	    // hand cards no fix line 5
    { 3: 200 },	    // hand cards no fix line 6
    { 3: 0 },	    // hand cards no fix line 7
];
cc.Class({
    extends: cc.Component,

    properties: {

        roleSpriteNode: {
            default: null,
            type: cc.Node,
            displayName: '图片',
        },

        BGNode: {
            default: null,
            type: cc.Node,
            displayName: '背景板',
        },

        BGNode2: {
            default: null,
            type: cc.Node,
            displayName: '反向背景板',
        },

        numNode: {
            default: null,
            type: cc.Node,
            displayName: '中奖分数',
        },

        specialNode: {
            default: null,
            type: cc.Node,
            displayName: '特殊牌',
        },
    },

    init(idx, isLeft) {
        let id = idx;

        this.roleSpriteNode.children[idx - 1].active = true;

        for (let i in GAME_COMBINATIONS[id - 1]) {
            this.numNode.getChildByName(i).children[0].getComponent(cc.Label).string = GAME_COMBINATIONS[idx - 1][i];
        }
        //位于右边的时候需要切换显示位置
        if (!isLeft) {
            this.BGNode.active = false;
            this.BGNode2.active = true;
            this.numNode.x = -150;
            this.specialNode.x = -340;
        }
    },

    node_onclick() {
        this.node.destroy();
    },
});
