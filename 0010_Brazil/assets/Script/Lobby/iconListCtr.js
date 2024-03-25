/**
 * 购买正版源码请联系微信:jacksun1983,QQ:54893605
 */
cc.Class({
    extends: cc.Component,

    properties: {

    },

    setAllChildDisplay(isShow) {
        for (const iterator of this.node.children) {
            iterator.active = isShow;
        }
    },

    onToggleClick(toggle, cus) {
        console.log("点击切换按钮", cus);
        this.node.getComponent(cc.ScrollView).scrollToLeft(0.1);
        switch (cus) {
            case "all":
                this.setAllChildDisplay(true);
                break;
            case "qipai":
                this.setAllChildDisplay(false);
                for (const iterator of this.node.children) {
                    if (iterator.gameType == 0) {
                        iterator.active = true;
                        // iterator.getComponent("gameIconCtrl").iconAction();
                    }
                }
                break;
            case "dianwan":
                this.setAllChildDisplay(false);
                for (const iterator of this.node.children) {
                    if (iterator.gameType == 1) {
                        iterator.active = true;
                        // iterator.getComponent("gameIconCtrl").iconAction();
                    }
                }
                break;
            case "laohuji":
                this.setAllChildDisplay(false);
                for (const iterator of this.node.children) {
                    if (iterator.gameType == 2) {
                        iterator.active = true;
                        // iterator.getComponent("gameIconCtrl").iconAction();
                    }
                }
                break;
            case "buyu":
                    this.setAllChildDisplay(false);
                    for (const iterator of this.node.children) {
                        if (iterator.gameType == 3) {
                            iterator.active = true;
                            // iterator.getComponent("gameIconCtrl").iconAction();
                        }
                    }
                    break;
            case "Favorites":
                this.setAllChildDisplay(false);
                for (const iterator of this.node.children) {
                    if (iterator.isFavor) {
                        iterator.active = true;
                    }
                }
                break;
            default:
                this.setAllChildDisplay(false);
                break;
        }
    },

});
