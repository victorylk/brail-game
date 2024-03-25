const GAME_COMBINATIONS = [
    { 3: 2, 4: 5, 5: 10 },		// hand cards no fix line 0
    { 3: 2, 4: 5, 5: 10 },		// hand cards no fix line 1
    { 3: 4, 4: 10, 5: 20 },		// hand cards no fix line 2
    { 3: 4, 4: 10, 5: 20 },		// hand cards no fix line 3
    { 3: 6, 4: 15, 5: 40 },	    // hand cards no fix line 4
    { 3: 8, 4: 20, 5: 60 },	    // hand cards no fix line 5
    { 3: 10, 4: 40, 5: 80 },	// hand cards no fix line 6
    { 3: 15, 4: 60, 5: 100 },	// hand cards no fix line 7
    { 3: 0, 4: 0, 5: 0 },	    // hand cards no fix line 8
    { 3: 0, 4: 0, 5: 0 },	    // hand cards no fix line 9
    { 3: 0, 4: 0, 5: 0 },	    // hand cards no fix line 10
];
cc.Class({
    extends: cc.Component,

    properties: {
        roleSprite: {
            default: [],
            type: cc.SpriteFrame,
            displayName: '角色图片',
        },

        roleGoldBGSprite: {
            default: null,
            type: cc.SpriteFrame,
            displayName: '金色角色图片',
        },

        roleSpriteNode: {
            default: null,
            type: cc.Sprite,
            displayName: '图片',
        },

        roleBGNode: {
            default: null,
            type: cc.Sprite,
            displayName: '牌背景图片',
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
        if (idx > 100) {
            this.roleSpriteNode.spriteFrame = this.roleSprite[idx - 100];
            this.roleBGNode.spriteFrame = this.roleGoldBGSprite;
            id = idx - 100;
        } else {
            this.roleSpriteNode.spriteFrame = this.roleSprite[idx];
        }

        if (idx == 9 || idx == 10) {
            this.roleBGNode.spriteFrame = null;
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
            this.numNode.x = -170;
            this.specialNode.x = -340;
        }
    },

    node_onclick() {
        this.node.destroy();
    },
});
