const i18n = require('i18n');
cc.Class({
    extends: cc.Component,

    properties: {
        iseread_lab: cc.Label,
        title_lab: cc.Label,
        date_lab: cc.Label,
    },

    onLoad() {
        this.netWork = require("LobbyNetWork");
    },

    start() {

    },

    setView(data) {
        this.data = data;
        this.iseread_lab.string = data.isread == 0 ? i18n.t("MAIL3_K") : i18n.t("MAIL4_K");
        this.iseread_lab.node.color = data.isread == 0 ? new cc.Color(31, 255, 35) : new cc.Color(255, 31, 71);
        this.title_lab.string = data.title;
        this.date_lab.string = Helper.timeFormat(data.timeStamp);
    },

    look_click() {
        if (this.data.isread == 0) {
            let data = {
                id: this.data.id,
            };
            this.netWork.socket.emit("setEmailRead", data);
            this.iseread_lab.node.color = new cc.Color(255, 31, 71);
        }
        cc.find("Canvas/com_Mail").getComponent("LobbyEmails").look_email(this.data);
    }
});
