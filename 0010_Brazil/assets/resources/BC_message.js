cc.Class({
    extends: cc.Component,

    properties: {
        rich_text: cc.RichText,
    },

    setView(data) {
        // cc.log(data);
        this.playerInfo = require("PlayerInfo").getInstant;
        this.rich_text.string = `<outline color=black width=3>${data.nickName} 在游戏 <color=#4fffec>${data.gameName}</color> 中，赢得 <color=#ffc730>${data.win / this.playerInfo.exchangeRate}</color> 金币</outline>`;
        this.actionDo();
    },
    //滚动展示
    actionDo() {
        this.rich_text.node.x = 600;
        cc.tween(this.rich_text.node)
            .to(6, { position: cc.v2(-600, 0) })
            .call(() => {
                this.node.destroy();
            })
            .start();
    }
});
