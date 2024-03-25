const GAME_COMBINATIONS = [
    { 3: 10, 4: 20, 5: 100 },		// hand cards no fix line 0
    { 3: 10, 4: 20, 5: 100 },		// hand cards no fix line 1
    { 3: 15, 4: 30, 5: 125 },		// hand cards no fix line 2
    { 3: 15, 4: 30, 5: 125 },		// hand cards no fix line 3
    { 3: 30, 4: 100, 5: 200 },	    // hand cards no fix line 4
    { 3: 40, 4: 100, 5: 250 },	    // hand cards no fix line 5
    { 3: 50, 4: 150, 5: 300 },	    // hand cards no fix line 6
    { 3: 75, 4: 150, 5: 400 },	    // hand cards no fix line 7
    { 3: 0, 4: 0, 5: 0 },	        // hand cards no fix line 8
    { 3: 0, 4: 0, 5: 0 },	        // hand cards no fix line 9
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

        if (idx > 8) {
            this.BGNode.width = 460;
            this.BGNode2.width = 460;
            this.numNode.active = false;
            this.specialNode.active = true;
            this.specialNode.children[0].active = idx == 9;
            this.specialNode.children[1].active = idx == 10;
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
            this.specialNode.x = -340;
        }
    },

    node_onclick() {
        this.node.destroy();
    },
});
