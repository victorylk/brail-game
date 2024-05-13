const GAME_COMBINATIONS = [
    { 3: 5, 4: 10, 5: 15 },		// hand cards no fix line 0
    { 3: 5, 4: 10, 5: 15 },		// hand cards no fix line 1
    { 3: 5, 4: 10, 5: 15 },		// hand cards no fix line 2
    { 3: 5, 4: 10, 5: 15 },		// hand cards no fix line 3
    { 3: 5, 4: 10, 5: 15 },	    // hand cards no fix line 4
    { 3: 10, 4: 15, 5: 20 },	// hand cards no fix line 5
    { 3: 10, 4: 15, 5: 20 },	// hand cards no fix line 6
    { 3: 15, 4: 20, 5: 25 },	// hand cards no fix line 7
    { 3: 15, 4: 20, 5: 25 },	// hand cards no fix line 8
    { 3: 20, 4: 25, 5: 30 },	// hand cards no fix line 9
    { 3: 0, 4: 0, 5: 0 },	    // hand cards no fix line 10
    { 3: 0, 4: 0, 5: 0 },	    // hand cards no fix line 11
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

        if (idx > 10) {
            this.BGNode.width = 460;
            this.BGNode2.width = 460;
            this.numNode.active = false;
            this.specialNode.active = true;
            this.specialNode.children[0].active = idx == 11;
            this.specialNode.children[1].active = idx >= 12;
            if (idx >= 12) {
                this.BGNode.height = 850;
                this.BGNode2.height = 850;
            }
        } else {
            for (let i in GAME_COMBINATIONS[id - 1]) {
                this.numNode.getChildByName(i).children[0].getComponent(cc.Label).string = GAME_COMBINATIONS[idx - 1][i];
            }
        }
        //位于右边的时候需要切换显示位置
        if (!isLeft) {
            this.BGNode.active = false;
            this.BGNode2.active = true;
            this.numNode.x = -180;
            this.specialNode.x = -320;
        }
    },

    node_onclick() {
        this.node.destroy();
    },
});
