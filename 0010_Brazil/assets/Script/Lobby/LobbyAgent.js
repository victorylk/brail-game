/**
 * 购买正版源码请联系微信:jacksun1983,QQ:54893605
 */
cc.Class({
    extends: cc.Component,

    properties: {
        node_Panel: [cc.Node],
        ar_lab1: cc.Label,
        ar_lab2: cc.Label,
        ar_lab3: cc.Label,
        ar_lab4: cc.Label,
        ar_lab5: cc.Label,
        ar_lab6: cc.Label,
        ar_lab7: cc.Label,
        ar_lab8: cc.Label,
        ar_lab9: cc.Label,
        dr_scrollView: cc.ScrollView,
        dr_preb: cc.Prefab,
        wr_scrollView: cc.ScrollView,
        wr_lab1: cc.Label,
        wr_lab2: cc.Label,
        wr_lab3: cc.Label,
        childNum_lab: cc.Label,//下级人数
        teamNum_lab: cc.Label,//团队成员总数
        historyGold_lab: cc.Label,//累计收益
        url_lab: cc.Label,//推广url
        url_pic: cc.Graphics,//推广二维码
        pr_scrollView: cc.ScrollView,
        pr_preb: cc.Prefab,
        treasure_num_lab: cc.Label,
    },

    onLoad() {
        this.netWork = require("LobbyNetWork");
        this.lobbyMain = cc.find('Canvas').getComponent("LobbyMain");
        this.playerInfo = require("PlayerInfo").getInstant;
    },

    start() {
        this.changePanel(null, 0);
    },
    //切换
    changePanel(event, data) {
        let num = parseInt(data);
        for (let i = 0; i < this.node_Panel.length; i++) {
            this.node_Panel[i].active = i == num;
        }
        switch (num) {
            case 0:
                this.sendExtension((data) => {
                    this.url_lab.string = data.agentUrl;
                    this.childNum_lab.string = data.subordinateNumber;
                    this.teamNum_lab.string = data.teamNumber;
                    this.historyGold_lab.string = data.agentAmountCount;
                    Helper.QRCreate(this.url_pic, data.agentUrl);
                });
                this.sendPlayerTreasure((data) => {
                    this.treasure_num_lab.string = "x" + data.TreasureBoxNum;
                });
                break;
            case 1:
                this.sendExtensionStat((data) => {
                    this.ar_lab1.string = `${data.team_size}(${data.team_size_new})`;
                    this.ar_lab2.string = `${data.affiliation_size}(${data.affiliation_size_new})`;
                    this.ar_lab3.string = `${data.affiliation_agent}(${data.affiliation_agent_new})`;
                    this.ar_lab4.string = data.team_performance;
                    this.ar_lab5.string = data.promotion_performance;
                    this.ar_lab6.string = data.yesterday_commission;
                    this.ar_lab7.string = data.today_commission;
                    this.ar_lab8.string = data.claimed_commission;
                    this.ar_lab9.string = data.current_claimable_commission;
                });
                break;
            case 2:
                this.sendDailyRecord((data) => {
                    this.dr_scrollView.content.removeAllChildren();
                    for (let i = 0; i < data.data.length; i++) {
                        let newNode = cc.instantiate(this.dr_preb);
                        newNode.getChildByName("bg").active = i % 2 == 0;
                        newNode.getChildByName("time_lab").getComponent(cc.Label).string = data.data[i].date_format;
                        newNode.getChildByName("num_lab1").getComponent(cc.Label).string = data.data[i].status == 0 ? 0 : data.data[i].every_statement;
                        newNode.getChildByName("num_lab2").getComponent(cc.Label).string = data.data[i].status == 0 ? 0 : data.data[i].amount;
                        newNode.getChildByName("num_lab3").getComponent(cc.Label).string = data.data[i].status == 1 ? 0 : data.data[i].every_statement;
                        newNode.getChildByName("num_lab4").getComponent(cc.Label).string = data.data[i].status == 1 ? 0 : data.data[i].amount;
                        this.dr_scrollView.content.addChild(newNode);
                    }
                });
                break;
            case 3:
                this.sendWeekRecord((data) => {
                    this.wr_scrollView.content.removeAllChildren();
                    let idx = 0;
                    for (let i in data.teamList) {
                        let newNode = cc.instantiate(this.dr_preb);
                        newNode.getChildByName("bg").active = idx % 2 == 0;
                        newNode.getChildByName("time_lab").getComponent(cc.Label).string = data.teamList[i].begin_time + "~" + data.teamList[i].end_time;
                        newNode.getChildByName("num_lab1").getComponent(cc.Label).string = data.teamList[i].income_team;
                        newNode.getChildByName("num_lab2").getComponent(cc.Label).string = data.teamList[i].income_directAgent;
                        newNode.getChildByName("num_lab3").getComponent(cc.Label).string = data.teamList[i].performance_team;
                        newNode.getChildByName("num_lab4").getComponent(cc.Label).string = data.teamList[i].performance_directTeam;
                        this.wr_scrollView.content.addChild(newNode);
                        idx += 1;
                    }

                    this.wr_lab1.string = data.topList.my_commission;
                    this.wr_lab2.string = data.topList.team_performance;
                    this.wr_lab3.string = data.topList.direct_performance;
                });
                break;
            case 4:
                this.sendPlayerRecord((data) => {
                    this.pr_scrollView.content.removeAllChildren();
                    let idx = 0;
                    for (let i in data) {
                        let newNode = cc.instantiate(this.pr_preb);
                        newNode.getChildByName("bg").active = idx % 2 == 0;
                        newNode.getChildByName("id_lab").getComponent(cc.Label).string = data[i].uid;
                        newNode.getChildByName("nickname_lab").getComponent(cc.Label).string = data[i].nickname;
                        newNode.getChildByName("num_lab1").getComponent(cc.Label).string = data[i].week_team_performance;
                        newNode.getChildByName("num_lab2").getComponent(cc.Label).string = data[i].week_person_performance;
                        newNode.getChildByName("num_lab3").getComponent(cc.Label).string = data[i].today_team_performance;
                        newNode.getChildByName("num_lab4").getComponent(cc.Label).string = data[i].today_person_performance;
                        newNode.getChildByName("teamSize_lab").getComponent(cc.Label).string = `${data[i].count_team_size}(${data[i].today_add_size})`;
                        newNode.getChildByName("yesPer_lab").getComponent(cc.Label).string = data[i].old_team_performance;
                        this.pr_scrollView.content.addChild(newNode);
                        idx += 1;
                    }
                });
                break;
        }
    },
    //关闭当前面板
    closePanel() {
        this.node.active = false;
    },
    //推广界面请求
    sendExtension(callback) {
        let url = this.playerInfo.apiIp + `/api/game/getUserAgentCount`;
        let formData = `id=${this.playerInfo.playerId}`;
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                var response = xhr.response;
                if (null !== xhr.response !== null) {
                    try {
                        response = JSON.parse(response);
                        cc.log(response);
                    }
                    catch (errot) {
                        cc.log("JSON wrong");
                    }
                    if (response.status == 0) {
                        callback && callback(response.data);
                    }
                }
            }
        };

        xhr.open("post", url);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.send(formData);
    },
    //统计界面请求
    sendExtensionStat(callback) {
        let url = this.playerInfo.apiIp + `/api/game/getAgentSystem`;
        let formData = `id=${this.playerInfo.playerId}`;
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                var response = xhr.response;
                if (null !== xhr.response !== null) {
                    try {
                        response = JSON.parse(response);
                        cc.log(response);
                    }
                    catch (errot) {
                        cc.log("JSON wrong");
                    }
                    if (response.status == 0) {
                        callback && callback(response.data);
                    }
                }
            }
        };

        xhr.open("post", url);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.send(formData);
    },
    //查询每日代理收益
    sendDailyRecord(callback) {
        let url = this.playerInfo.apiIp + `/api/game/dayAgentListCount`;
        let formData = `id=${this.playerInfo.playerId}&&limit=20&page=1`;
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                var response = xhr.response;
                if (null !== xhr.response !== null) {
                    try {
                        response = JSON.parse(response);
                        cc.log(response);
                    }
                    catch (errot) {
                        cc.log("JSON wrong");
                    }
                    if (response.status == 0) {
                        callback && callback(response.data);
                    }
                }
            }
        };

        xhr.open("post", url);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.send(formData);
    },
    //查询每周代理收益
    sendWeekRecord(callback) {
        let url = this.playerInfo.apiIp + `/api/game/getWeekCount`;
        let formData = `id=${this.playerInfo.playerId}&&limit=20&page=1`;
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                var response = xhr.response;
                if (null !== xhr.response !== null) {
                    try {
                        response = JSON.parse(response);
                        cc.log(response);
                    }
                    catch (errot) {
                        cc.log("JSON wrong");
                    }
                    if (response.status == 0) {
                        callback && callback(response.data);
                    }
                }
            }
        };

        xhr.open("post", url);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.send(formData);
    },
    //查询玩家收益
    sendPlayerRecord(callback) {
        let url = this.playerInfo.apiIp + `/api/game/getUserAgentInfo`;
        let formData = `id=${this.playerInfo.playerId}`;
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                var response = xhr.response;
                if (null !== xhr.response !== null) {
                    try {
                        response = JSON.parse(response);
                        cc.log(response);
                    }
                    catch (errot) {
                        cc.log("JSON wrong");
                    }
                    if (response.status == 0) {
                        callback && callback(response.data);
                    }
                }
            }
        };

        xhr.open("post", url);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.send(formData);
    },

    //查询玩家收益
    sendPlayerTreasure(callback) {
        let url = this.playerInfo.apiIp + `/api/config/getTreasureBox?id=` + this.playerInfo.playerId;
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                var response = xhr.response;
                if (null !== xhr.response !== null) {
                    try {
                        response = JSON.parse(response);
                        cc.log(response);
                    }
                    catch (errot) {
                        cc.log("JSON wrong");
                    }
                    if (response.code == 1) {
                        callback && callback(response.data);
                    }
                }
            }
        };

        xhr.open("get", url);
        xhr.send();
    },

    //计算本年的周数
    getYearWeek(endDate) {
        //本年的第一天
        var beginDate = new Date(endDate.getFullYear(), 0, 1);
        //星期从0-6,0代表星期天，6代表星期六
        var endWeek = endDate.getDay();
        if (endWeek == 0) endWeek = 7;
        var beginWeek = beginDate.getDay();
        if (beginWeek == 0) beginWeek = 7;
        //计算两个日期的天数差
        var millisDiff = endDate.getTime() - beginDate.getTime();
        var dayDiff = Math.floor((millisDiff + (beginWeek - endWeek) * (24 * 60 * 60 * 1000)) / 86400000);
        return Math.ceil(dayDiff / 7) + 1;
    }

});
