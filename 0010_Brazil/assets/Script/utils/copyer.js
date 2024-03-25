const i18n = require('i18n');
cc.Class({
    extends: cc.Component,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        this.lobbyMain = cc.find('Canvas').getComponent("LobbyMain");
    },

    // update (dt) {},
    onClick() {
        var str = this.node.getComponent(cc.Label).string;
        if (!cc.sys.isNative) {
            this.webCopyString(str);
        } else if (cc.sys.os === cc.sys.OS_ANDROID) {
            setTimeout(() => {
                jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "JavaCopy", "(Ljava/lang/String;)V", str);
            }, 100)
        } else if (cc.sys.os === cc.sys.OS_IOS) {
            let ret = jsb.reflection.callStaticMethod("AdMaster", "copy:", str);
        }
        this.lobbyMain.showMessagebox_Function(i18n.t("Tuiguang_13"), 1, 4);
    },

    webCopyString(str) {
        var input = str;
        const el = document.createElement('textarea');
        el.value = input;
        el.setAttribute('readonly', '');
        el.style.contain = 'strict';
        el.style.position = 'absolute';
        el.style.left = '-9999px';
        el.style.fontSize = '12pt';

        const selection = getSelection();
        var originalRange = false;
        if (selection.rangeCount > 0) {
            originalRange = selection.getRangeAt(0);
        }
        document.body.appendChild(el);
        el.select();
        el.selectionStart = 0;
        el.selectionEnd = input.length;

        var success = false;
        try {
            success = document.execCommand('copy');
        } catch (err) { }

        document.body.removeChild(el);

        if (originalRange) {
            selection.removeAllRanges();
            selection.addRange(originalRange);
        }

        return success;
    }
});
