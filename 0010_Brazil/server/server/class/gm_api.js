var gameInfo = require('./game').getInstand;
var ServerInfo = require('./../config/ServerInfo').getInstand;

var gm_api = function (info, callback) {
    console.log(info);
    let gameScoketList = ServerInfo.getScoketList();
    switch (info.act) {
        case "GetuserListOnline":
            var userlist = [];
            var i = 0;
            var list = gameInfo.getOnlinePlayer();
            //console.log(list);
            for (var obj in gameInfo.getOnlinePlayer()) {
                userlist[i] = {};
                userlist[i]._userId = list[obj]._userId;
                userlist[i]._account = list[obj]._account;
                userlist[i]._score = list[obj]._score;
                userlist[i].GameId = list[obj].GameId;
                //console.log(list[obj]._userId);
                ++i;
                //console.log(obj.userid);
            }
            callback(userlist);
            break;
        case "GetGameTotalData":
            //获得输赢情况
            callback(gameInfo.getGameTotalData());
            break;
        case "maintainServer":
            gameInfo.Setmaintain(true);
            console.log("服务器开始维护模式!");
            callback({rusult: 1});
            break;
        case "closeServer":
            //先进入维护模式
            if (!info.port) {
                gameInfo.Setmaintain(true);
                for (var item in gameScoketList) {
                    console.log("here");
                    gameScoketList[item].emit("Setmaintain");
                }
            } else {
                for (var item in gameScoketList) {
                    if (info.port == item) {
                        gameScoketList[item].emit("Setmaintain");
                        break
                    }
                }
            }

            //通知所有服务器30秒后，自动关闭服务
            //ServerInfo.GameServerScoket_fish.emit('colseServer',{time:10})
            //使所有用户断线
            // var list = gameInfo.getOnlinePlayer();
            // for(var obj in gameInfo.getOnlinePlayer())
            // {
            // 	list[obj]._socket.disconnect();
            // }
            //保存所有数据
            //保存用户数据
            //gameInfo.saveAll();
            //保存时间段的收益情况
            //gameInfo.saveTimeScoreTotal();
            //保存采池
            //gameInfo.saveSocrePool();
            //保存总收益情况
            //gameInfo.saveTotal();
            console.log("服务器已经关闭!");
            callback({rusult: 1});
            break;
        case "sendCoinServer":
            //console.log(gameInfo.sendCoinServer(info));
            gameInfo.sendCoinServer(info, function (res) {
                callback(res)
            });
            break;
        //return {rusult:1};
        case "updateGameData":
            console.log("更新服务器数据：" + info.port);
            for (let item in gameScoketList) {
                if (info.port === item) {
                    gameScoketList[item].emit("updateGamblingGame", JSON.stringify({
                        dataKey: info.dataKey,
                        data: info.data,
                        roomid: info.roomid
                    }));
                    break;
                }
            }
            callback({rusult: 1});
            break;
        case "sendEmail":
            gameInfo.haveNewEmail(info);
            callback({rusult: 1});
            break;
    }

};

module.exports = gm_api;

