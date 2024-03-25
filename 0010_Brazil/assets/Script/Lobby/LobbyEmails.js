const i18n = require('i18n');
cc.Class({
    extends: cc.Component,

    properties: {
        //邮件
        email_scroll: cc.ScrollView,
        email_preb: cc.Prefab,
        email_wordPanel: cc.Node,
        email_sendman_lab: cc.Label,
        email_title_lab: cc.Label,
        email_word_lab: cc.Label,
        email_btn: cc.Node,
        refresh_btn: cc.Node,
    },

    onLoad() {
        this.netWork = require("LobbyNetWork");
    },

    start() {

    },

    //创建邮件列表
    setEmail(data) {
        this.email_scroll.content.removeAllChildren();
        for (let i = 0; i < data.length; i++) {
            let newNode = cc.instantiate(this.email_preb);
            newNode.getComponent("email_Item").setView(data[i]);
            this.email_scroll.content.addChild(newNode);
        }
    },

    //刷新邮件
    refreshEmail() {
        this.netWork.socket.emit("getEmail");
    },

    refresh_click() {
        this.refreshEmail();
    },
    //查看邮件详情
    look_email(data) {
        this.data = data;
        this.email_wordPanel.active = true;
        this.email_sendman_lab.string = i18n.t("MAIL5_K") + (data.sendid == 0 ? i18n.t("MAIL8_K") : data.sendid);
        this.email_title_lab.string = i18n.t("MAIL6_K") + data.title;
        this.email_btn.active = data.state == 0;
        switch (data.type) {
            case 0://金币撤回
                this.email_word_lab.string = `正文：您赠送给ID：${data.getcoinuserid}[${data.nickname}]的${data.sendcoin}金币已成功撤回！`;
                break;
            case 1://金币赠送
                this.email_word_lab.string = `正文：ID：${data.sendid}赠送了${data.sendcoin}金币，请查收！`;
                break;
            case 2://发送给个人的系统消息
                this.email_word_lab.string = `正文：${data.content}`;
                break;
            case 999://发送给全员的系统消息
                this.email_word_lab.string = `正文：${data.content}`;
                break;
        }
    },
    //领取邮件
    getPrice_click() {
        this.email_btn.active = false;
        let data = {
            state: 1,
            id: this.data.otherId,
            coin: this.data.sendcoin
        };
        this.netWork.socket.emit("lqCoin_email", data);
    },

    onBtnClick_closePanel(event) {
        //这里 event 是一个 Touch Event 对象，你可以通过 event.target 取到事件的发送节点
        event.target.parent.active = false;
    },
});
