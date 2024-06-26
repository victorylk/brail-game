var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var api = require('./class/socre_api');
var recharge_api = require('./class/recharge_api');
let withdrawal_api = require('./class/withdrawal_api');
var webGetUser = require('./class/webGetUser');
var appleRecharge = require('./class/appleRecharger');
var schedule = require("node-schedule");
var bodyParser = require('body-parser');
var weixin = require('./class/weixin');
var Robotname = require('./config/RobotName');
var path = require('path');
var crypto = require('crypto');
var gm_api = require('./class/gm_api');
var ml_api = require('./class/ml_api');
var tw_api = require('./class/tw_api');
var guanfang_api = require('./class/guanfang_api');
var dao = require('./dao/dao');
var game_log_dao = require('./dao/game_log_dao');
var landlord_race_dao = require('./dao/landlord_race_Dao');
var gameConfig = require('./config/gameConfig');
var log = require("./class/loginfo").getInstand;
var multer = require('multer');
var multerObj = multer({dest: './static/upload'});
var consolidate = require('consolidate');
var statics = require('express-static');
var updateConfig = require('./class/updateConfig').getInstand;
var Post = require('./class/post');
var shopping_dao = require('./dao/shopping_dao');
const sms = require("./class/sms.js");
//版本密钥和版本号
var version = "ymymymymym12121212qwertyuiop5656_";
var num = "2.0";
//
// var Pio = require('socket.io-client');
// var Psocket = Pio('http://192.168.1.66:2020');
//
// Psocket.on('connected', function (msg) {
//     console.log("与PHP进行连接......");
//
//     Psocket.emit('GameServerConnect', {})
// })
// Psocket.on('disconnect', function (data) {
//     console.log("登录PHP被断开")
// });


app.use(statics('./static/'));

//跨域问题
app.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", ' 3.2.1');
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});


//网页模板
app.engine('html', consolidate.ejs);
app.set('views', 'template');
app.set('view engine', 'html');

app.use(bodyParser());
app.get('/Activity/gameuse', function (req, res) {
    //res.sendfile('index.html');
    //外部接口

    api(req, function (sendStr) {
        res.send(sendStr);
    });


    //log.info(req.query.a);
    //res.send('{"status":0,"msg":"","data":{"accountname":"xiexie","gold":"147587148"}}');
});

//app.use('/logitech',require('./routes/login/logitech.js')());
//网页接口
//app.use('/index',require('./routes/login/login.js')());
//app.use('/shopping',require('./routes/login/shopp.js')());
//app.use('/PersonalCenter',require('./routes/login/PersonalCenter.js')());


//验证充值
app.post('/apple', function (req, res_s) {
    appleRecharge(req, function (sendStr) {
        res_s.send(sendStr)
    });
});


app.get('/logitech', function (req, res) {
    var Cun = updateConfig.getUpdateCoifig();
    res.send(Cun)
});

//充值相关接口
app.get('/recharge', function (req, res) {
    recharge_api(req, function (sendStr) {
        res.send(sendStr)
    });
});

//充值支付宝相关接口
app.get('/rechargeZhifuBao', function (req, res) {
    //wap
    if (req.query.payType) {
        tw_api.rechargeZhifuBao(req, function (result, url, sendStr) {
            if (result) {
                res.redirect(url);
            } else {
                res.send(sendStr);
            }
        });
    } else {
        guanfang_api.rechargeZhifuBao(req, function (result, url, sendStr) {
            if (result) {
                res.redirect(url);
            } else {
                res.send(sendStr);
            }
        });
    }
    //皎洁
    // Post.rechargeRfupay(req.query,function(result,url,sendStr){
    //   if (result){
    //     log.info(sendStr)
    //     //res.render('1.ejs',{})
    //     res.type('html');
    //     res.send(sendStr);
    //     //res.redirect(url);
    //   }else{
    //     res.send(sendStr);
    //   }
    // });
});

//充值支付宝相关接口
app.get('/rechargeZhifuBaoReturn', function (req, res) {

    tw_api.rechargeZhifuBaoReturn(req.query, function (result) {
        if (result) {
            res.send("SUCCESS");
        } else {
            res.send("FAIL");
        }
    });
});


app.get('/outCoin', function (req, res) {

    tw_api.outCoin(req.query, function (result) {
        if (result) {
            res.send("SUCCESS");
        } else {
            res.send("FAIL");
        }
    });
});


app.post('/gmManage', function (req, res) {
    console.log("gmManage---");
    var r = null;
    for (var i in req.body) {
        r = JSON.parse(i)
    }
    let key = version + num;
    if (r.key !== key) {
        res.send({rusult: -1});
        return;
    }
    gm_api(r, function (result) {
        res.send(result);
    });
});


app.get('/weixinLogin', function (req, res) {
    //res.sendfile('index.html');
    //外部接口
    weixin(req, function (act, sendStr) {
        if (act == 1) {
            res.send(sendStr);
        } else if (act == 2) {
            res.redirect(sendStr);
        }

    });

    //log.info(req.query.a);
    //res.send('{"status":0,"msg":"","data":{"accountname":"xiexie","gold":"147587148"}}');
});


app.get('/ml_api', function (req, res) {
    //res.sendfile('index.html');
    //外部接口
    ml_api.get(req, function (act, sendStr) {
        if (act == 1) {
            res.send(sendStr);
        } else if (act == 2) {
            res.redirect(sendStr);
        }

    });
});

//商城相关
app.post('/webGetUser', function (req, res) {
    webGetUser(req, function (sendStr) {
        log.info(sendStr);
        res.send(sendStr);
    })
});


//版本验证
app.post('/checkVersion', function (req, res) {
    // console.log("版本验证")
    //验证版本
    var r = req.query.key;
    let key = version + num;
    if (r !== key) {
        res.send({code: 0, url: "http://yidali.youmegame.cn/tg/"});
        return;
    }
    res.send({code: 1, url: "http://yidali.youmegame.cn/tg/"});
});

//商城相关
app.post('/getShopList', function (req, response) {
    shopping_dao.selectShopList((res) => {
        response.writeHead(200, {"Content-Type": "text/plain"});
        response.write(JSON.stringify(res));
        response.end();
    });
});

app.post('/addShoppingGoods', function (req, response) {
    try {
        let data = {};
        for (let key in req.body) {
            data = JSON.parse(key);
        }
        req.body = data;
    } catch (e) {
        log.warn('addShoppingGoods-json');
    }
    shopping_dao.insertNewGoods(req.body, (res) => {
        response.writeHead(200, {"Content-Type": "text/plain"});
        response.write(JSON.stringify({result: res}));
        response.end();
    });
});

app.post('/delShoppingGoods', function (req, response) {
    try {
        let data = {};
        for (let key in req.body) {
            data = JSON.parse(key);
        }
        req.body = data;
    } catch (e) {
        log.warn('delShoppingGoods-json');
    }
    shopping_dao.delGoods(req.body, (res) => {
        response.writeHead(200, {"Content-Type": "text/plain"});
        response.write(JSON.stringify({result: res}));
        response.end();
    });
});

//购买商品
// app.post('/webShopBuy',function(req,res){
//   webGetUser
//   gameInfo.shopBuy(req,function(sendStr){

//     try{
//       var data = JSON.parse(sendStr);
//       if (!data.status){

//       }
//     }
//     catch(e){
//       log.warn('webGetUser');
//     }
//     log.info(sendStr)
//     res.send(sendStr)
//   })
// })
//获取验证码
app.post('/getSmsCode', function (req, response) {
    try {
        let data = {};
        for (let key in req.body) {
            data = JSON.parse(key);
        }
        req.body = data;
    } catch (e) {
        log.warn('getSmsCode-json');
    }
    sms.send_shansuma(req.body.phone);
    response.writeHead(200, {"Content-Type": "text/plain"});
    response.write(JSON.stringify({code: 1}));
    response.end();
});
//检查验证码
app.post('/checkSmsCode', function (req, response) {
    try {
        let data = {};
        for (let key in req.body) {
            data = JSON.parse(key);
        }
        req.body = data;
    } catch (e) {
        log.warn('checkSmsCode-json');
    }
    let isCodeRight = sms.verify(req.body.phone, req.body.code); // 返回true/false
    let code = 0;
    if (isCodeRight) {
        code = 1;
    }
    response.writeHead(200, {"Content-Type": "text/plain"});
    response.write(JSON.stringify({code: code}));
    response.end();
});


var serverSign = "slel3@lsl334xx,deka";

var gameInfo = require('./class/game').getInstand;
var luck_tree = require('./class/luck_tree').getInstand;
var ServerInfo = require('./config/ServerInfo').getInstand;

gameInfo.setIo(io);

io.on('connection', function (socket) {
    //log.info(socket);
    //log.info("test1" + "用户连接");
    socket.emit('connected', 'connect server');

    //服务器进行连接
    socket.on('GameServerConnect', function (info) {
        if (info.signCode == serverSign) {
            log.info(info.serverName + " | 服务器连接成功!");
            log.info("游戏Id:" + info.serverId);
            socket.emit('GameServerConnectResult', {resultCode: 1});
            if (info.serverId)
                ServerInfo.setScoket(info.serverId, socket);
            //log.info(ServerInfo)
        } else {
            log.info("尝试连接服务器失败,密码不对");
        }
    });

    socket.on('login', function (user) {
        //登录时,必须收到游戏号与房间号
        log.info("login");
        log.info(user);
        try {
            var data = JSON.parse(user);
            user = data;
            var zidunqi = true;
            if (!user.userName) {
                zidunqi = false
            }
            if (!user.password) {
                if (!user.sign) {
                    zidunqi = false
                }
            }
            if (!zidunqi) {
                log.info("用户名密码不能为空:" + JSON.stringify(user));
                return;
            }
        } catch (e) {
            log.warn('loginjson');
        }

        if (!user) {
            log.info("user" + user);
            return;
        }
        //是不是维护模式
        if (gameInfo.isMaintain()) {
            log.info("维护模式,禁止登录!");
            socket.emit("maintain", {ResultCode: 1, msg: gameConfig.maintain});
            return;
        }

        //log.info(user)
        //判断是不是同一socket登录2次**********未完成还要判断每个游戏里，是否在线？以后再去改
        if (gameInfo.isLoginAgain(socket)) {
            log.info("同一帐号连续登录!,必须退出一个游戏才能进入另一个游戏!");
            return;
        }

        if (user.password) {
            var key_login = "89b5b987124d2ec3";
            var content = user.userName + user.password + key_login;
            var md5_sign = crypto.createHash('md5');
            md5_sign.update(content);
            user.password = md5_sign.digest('hex');
            user.sign = user.password;
        }

        dao.login(user, socket, function (state, rows) {

            if (!state) {
                if (!rows) {
                    result = {resultid: 0, msg: 'Account or password error,login fail!'};
                    socket.emit('loginResult', result);
                }
                //数据库有此用户
                if (gameInfo.IsPlayerOnline(rows.Id)) {
                    //在线
                    log.info("用户在线,进入等待离线列队");
                    user.id = rows.Id;
                    user.socket = socket;
                    user.userName = rows.Account;
                    user.headimgurl = rows.headimgurl;
                    //加入登录列队
                    gameInfo.addLoginList(user);
                } else {
                    gameInfo.addUser(rows, socket, function (result) {

                        if (result == 1) {   //断线从连
                            gameInfo.lineOutSet({userId: user.id})
                        }
                    });

                }
            } else if (state == 1) {
                var result = {};
                result = {resultid: 0, msg: 'Account or password error,login fail!'};
                socket.emit('loginResult', result);
                // log.info("=============================")
                // log.info(user)
                log.info("登录失败!");
            } else if (state == 2) {
                var result = {};
                result = {resultid: -1, msg: 'This account is disabled!'};
                socket.emit('loginResult', result);
                log.info("登录失败,帐号被停用!");
            }
        })
        //log.info('userId' + dao.login(user,socket) + 'login!')
    })

    //登录完成之后先进入游戏房间,来自于游戏服务器
    socket.on('LoginGame', function (_userinof) {
        // log.info("test6" + "登录游戏");
        // log.info(_userinof);
        if (_userinof.serverSign == serverSign) {
            //让这个用户进入该游戏
            //log.info(_userinof)
            var encoin = ServerInfo.getServerEnterCoinByProt(_userinof.serverId);

            var userInfo = gameInfo.LoginGame(_userinof.userid, _userinof.sign, _userinof.serverId, encoin);
            var result = {};
            if (userInfo._userId) {
                var result = {ResultCode: 1, userInfo: userInfo};
                var info = {
                    state: 1,
                    gameId: _userinof.gameId,
                    serverId: _userinof.serverId,
                    userId: _userinof.userid,
                    tableId: -1,
                    seatId: -1
                };
                gameInfo.lineOutSet(info);
            } else {
                var result = {ResultCode: 0, userid: _userinof.userid, msg: userInfo.msg};
            }
            //log.info("用户进入房间")
            socket.emit('LoginGameResult', result);
            //log.info("test7" + "发送登录的游戏");
        }

    });

    //登录完成之后进入俱乐部服务器,来自于游戏服务器
    socket.on('LoginClub', function (_userinof) {
        if (_userinof.serverSign == serverSign) {
            //让这个用户进入该游戏
            //log.info(_userinof)
            var encoin = ServerInfo.getServerEnterCoinByProt(_userinof.serverId);

            var userInfo = gameInfo.LoginGame(_userinof.userid, _userinof.sign, _userinof.serverId, encoin);
            var result = {};
            if (userInfo._userId) {
                var result = {ResultCode: 1, userInfo: userInfo};
                // var info = {
                //     state: 1,
                //     gameId: _userinof.gameId,
                //     serverId: _userinof.serverId,
                //     userId: _userinof.userid,
                //     tableId: -1,
                //     seatId: -1
                // };
                // gameInfo.lineOutSet(info);
            } else {
                var result = {ResultCode: 0, userid: _userinof.userid, msg: userInfo.msg};
            }
            socket.emit('LoginClubResult', result);
        }

    });

    //离线操作
    socket.on('disconnect', function () {
        //log.info("有人离线");
        if (socket.gm_id) {
            console.log("删除gm_socket");
            delete gameInfo.gm_socket[socket.gm_id]
            return;
        }

        //有人离线
        if (!socket.userId) {
            return
        }

        if (socket.serverGameid) {
            log.info("游戏服务器 -" + ServerInfo.getServerNameById(socket.serverGameid) + "- 已经断开连接");
        }

        log.info("disconnect:" + socket.userId);
        //log.info("************")
        //如果用户还存在的话，删除
        var userInfo = {userId: socket.userId, nolog: true};
        gameInfo.deleteUser(userInfo);
        //gameInfo.deleteUserNoLoginGame(socket.userId);


    });

    //有用户离开
    socket.on('userDisconnect', function (_userInfo) {
        log.info("userDisconnect:");
        log.info(_userInfo);
        if (_userInfo.ResultCode) {

            gameInfo.setCleanGameIdByUserId(_userInfo);
            gameInfo.deleteUser(_userInfo);
        } else {
            gameInfo.deleteUserNoLoginGame(_userInfo.userId, 1);
        }
    });

    //游戏结算
    socket.on('GameBalance', function (_Info) {
        if (_Info.signCode == serverSign) {
            gameInfo.GameBalance(_Info);
        }
    });

    //游戏结算(俱乐部扣房卡用)
    socket.on('GameUpdateDiamond', function (_Info) {
        log.info("扣除房卡");
        log.info(_Info);
        if (_Info.signCode == serverSign) {
            gameInfo.GameUpdateDiamond(_Info);
        }
    });

    //牌局断线
    socket.on('lineOut', function (_Info) {
        console.log("lineOut");
        console.log(_Info);
        if (_Info.signCode == serverSign) {
            gameInfo.lineOutSet(_Info);
        }
    });

    //获得断线
    socket.on('getLineOut', function (_Info) {
        if (_Info.signCode == serverSign) {
            gameInfo.getLineOutMsg(_Info);
        }
    });

    //比赛结束
    socket.on('matchEnd', function (_info) {
        gameInfo.addPrize(_info);
    });

    //兑换电话卡
    socket.on("exchange", function (_info) {
        try {
            var data = JSON.parse(_info);
            _info = data;
        } catch (e) {
            log.warn('exchangejson');
        }
        gameInfo.exchange(socket.userId, _info, io);
    });

    //赠送游戏币给他人
    socket.on("sendCoin", function (_info) {
        try {
            var data = JSON.parse(_info);
            _info = data;
        } catch (e) {
            log.warn('sendCoinjson');
        }

        if (gameInfo.IsPlayerOnline(socket.userId)) {
            gameInfo.sendCoin(socket, _info);
        }
    });
    //赠送游戏币给他人账号形式
    socket.on("sendCoin2", function (_info) {
        try {
            var data = JSON.parse(_info);
            _info = data;
        } catch (e) {
            log.warn('sendCoinjson');
        }

        if (gameInfo.IsPlayerOnline(socket.userId)) {
            gameInfo.selectUserIdAndSendCoin(socket, _info);
        }
    });

    //查询游戏币记录
    socket.on("selectCoinLog", function () {
        if (gameInfo.IsPlayerOnline(socket.userId)) {
            gameInfo.selectCoinLog(socket);
        }
    });

    socket.on("selectgetCoinLog", function () {
        if (gameInfo.IsPlayerOnline(socket.userId)) {
            gameInfo.selectgetCoinLog(socket);
        }
    });

    //修改游戏币记录状态
    socket.on("updateCoinLogState", function (_info) {
        try {
            var data = JSON.parse(_info);
            _info = data;
        } catch (e) {
            log.warn('sendCoinjson');
        }
        if (gameInfo.IsPlayerOnline(socket.userId)) {
            gameInfo.updateCoinLogState(socket, _info);
        }
    });

    //获取邮件
    socket.on("getEmail", function () {
        if (gameInfo.IsPlayerOnline(socket.userId)) {
            gameInfo.getEmail(socket);
        }
    });

    //设置邮件已读
    socket.on("setEmailRead", function (_info) {
        try {
            var data = JSON.parse(_info);
            _info = data;
        } catch (e) {
            log.warn('sendCoinjson');
        }
        if (gameInfo.IsPlayerOnline(socket.userId)) {
            gameInfo.setEmailRead(socket, _info);
        }
    });

    //领取邮件金币
    socket.on("lqCoin_email", function (_info) {
        try {
            var data = JSON.parse(_info);
            _info = data;
        } catch (e) {
            log.warn('sendCoinjson');
        }
        if (gameInfo.IsPlayerOnline(socket.userId)) {
            gameInfo.lqCoin_email(socket, _info);
        }
    });

    //使用点卡
    socket.on("useEXcard", function (_info) {
        try {
            var data = JSON.parse(_info);
            _info = data;
        } catch (e) {
            log.warn('useEXcardjson');
        }
        if (gameInfo.IsPlayerOnline(socket.userId)) {
            gameInfo.useEXcard(socket, _info);
        }
    });

    //赠送点卡
    socket.on("sendcard", function (_info) {
        try {
            var data = JSON.parse(_info);
            _info = data;
        } catch (e) {
            log.warn('sendcardjson');
        }
        if (gameInfo.IsPlayerOnline(socket.userId)) {
            gameInfo.sendcard(socket, _info);
        }
    });

    //查询点卡记录
    socket.on("cardLog", function (_info) {
        try {
            var data = JSON.parse(_info);
            _info = data;
        } catch (e) {
            log.warn('cardLogjson');
        }
        if (gameInfo.IsPlayerOnline(socket.userId)) {
            gameInfo.cardLog(socket, _info);
        }
    });

    //检测
    socket.on("checkNickName", function (_info) {

        try {
            var data = JSON.parse(_info);
            _info = data;
        } catch (e) {
            log.warn('checkNickName-json');
        }
        if (gameInfo.IsPlayerOnline(socket.userId)) {
            gameInfo.checkNickName(socket, _info);
        }
    });

    //账号检测昵称
    socket.on("checkNickNameByAccount", function (_info) {

        try {
            var data = JSON.parse(_info);
            _info = data;
        } catch (e) {
            log.warn('checkNickNameByAccount-json');
        }
        if (gameInfo.IsPlayerOnline(socket.userId)) {
            gameInfo.checkNickName2(socket, _info);
        }
    });

    //修改昵称
    socket.on("updateNickName", function (_info) {
        try {
            var data = JSON.parse(_info);
            _info = data;
        } catch (e) {
            log.warn('updateNickName-json');
        }
        if (gameInfo.IsPlayerOnline(socket.userId)) {
            gameInfo.updateNickName(socket, _info);
        }
    });

    //修改头像
    socket.on("updateHeadUrl", function (_info) {
        try {
            var data = JSON.parse(_info);
            _info = data;
        } catch (e) {
            log.warn('updateHeadUrl-json');
        }
        if (gameInfo.IsPlayerOnline(socket.userId)) {
            gameInfo.updateHeadUrl(socket, _info);
        }
    });

    //修改密码
    socket.on("updatePassword", function (_info) {
        try {
            var data = JSON.parse(_info);
            _info = data;
        } catch (e) {
            log.warn('updatePassword-json');
        }
        if (gameInfo.checkDataPassword(socket, _info)) {
            gameInfo.updatePassword(socket, _info);
        }
    });

    //转正
    socket.on("changeOfficial", function (_info) {
        try {
            var data = JSON.parse(_info);
            _info = data;
        } catch (e) {
            log.warn('changeOfficial-json');
        }
        if (gameInfo.checkData(socket, _info)) {
            gameInfo.changeOfficial(socket, _info);
        }
    });

    //银行卡
    socket.on("BankInfo", function (_info) {

        try {
            var data = JSON.parse(_info);
            _info = data;
        } catch (e) {
            log.warn('BankInfo-json');
        }
        if (gameInfo.IsPlayerOnline(socket.userId)) {
            gameInfo.BankInfo(socket, _info);
        }
    });

    //获取自己银行卡
    socket.on("getBank", function (_info) {
        try {
            var data = JSON.parse(_info);
            _info = data;
        } catch (e) {
            log.warn('getBank-json');
        }
        if (gameInfo.IsPlayerOnline(socket.userId)) {
            gameInfo.getBank(socket, _info);
        }
    });

    //绑定支付宝
    socket.on("bindZhifubao", function (_info) {

        try {
            var data = JSON.parse(_info);
            _info = data;
        } catch (e) {
            log.warn('bindZhifubao-json');
        }
        if (gameInfo.IsPlayerOnline(socket.userId)) {
            gameInfo.bindZhifubao(socket, _info);
        }
    });

    //发验证码
    socket.on("sendbindPhoneNo", function (_info) {
        try {
            var data = JSON.parse(_info);
            _info = data;
        } catch (e) {
            log.warn('sendbindPhoneNo-json');
        }

        if (gameInfo.IsPlayerOnline(socket.userId)) {
            gameInfo.sendbindPhoneNo(socket, _info);
        }
    });

    //绑定手机
    socket.on("bindPhone", function (_info) {
        try {
            var data = JSON.parse(_info);
            _info = data;
        } catch (e) {
            log.warn('bindPhone-json');
        }
        if (gameInfo.IsPlayerOnline(socket.userId)) {
            gameInfo.bindPhone(socket, _info);
        }
    });

    //获取是否有未领取奖品
    socket.on("getPrize", function (_info) {
        try {
            var data = JSON.parse(_info);
            _info = data;
        } catch (e) {
            log.warn('getPrize-json');
        }
        if (gameInfo.IsPlayerOnline(socket.userId)) {
            gameInfo.getPrize(socket, _info);
        }
    });

    //获得每天任务奖品
    socket.on("getDayPrize", function (_info) {
        try {
            var data = JSON.parse(_info);
            _info = data;
        } catch (e) {
            log.warn('getDayPrize-json');
        }
        if (gameInfo.IsPlayerOnline(socket.userId)) {
            gameInfo.getDayPrize(socket, _info);
        }
    });

    //获得金币排行榜
    socket.on("getCoinRank", function () {
        if (gameInfo.IsPlayerOnline(socket.userId)) {
            gameInfo.getCoinRank(socket);
        }
    });
    //获得钻石排行榜
    socket.on("getDiamondRank", function () {
        if (gameInfo.IsPlayerOnline(socket.userId)) {
            gameInfo.getDiamondRank(socket);
        }
    });
    //获得商城商品列表
    socket.on("getShoppingList", function () {
        if (gameInfo.IsPlayerOnline(socket.userId)) {
            gameInfo.getShopping_List(socket);
        }
    });

    //获得商城用户收货信息
    socket.on("getShopPlayerInfo", function () {
        if (gameInfo.IsPlayerOnline(socket.userId)) {
            gameInfo.getShopPlayerInfo(socket);
        }
    });

    //更新商城用户收货信息
    socket.on("updateShopPlayerInfo", function (_info) {
        try {
            let data = JSON.parse(_info);
            _info = data;
        } catch (e) {
            log.warn('updateShopPlayerInfo-json');
        }
        if (gameInfo.IsPlayerOnline(socket.userId)) {
            gameInfo.updateShopPlayerInfo(socket, _info);
        }
    });

    //提交商城兑换
    socket.on("requestGetShopItem", function (_info) {
        try {
            let data = JSON.parse(_info);
            _info = data;
        } catch (e) {
            log.warn('requestGetShopItem-json');
        }
        if (gameInfo.IsPlayerOnline(socket.userId)) {
            gameInfo.requestGetShopItem(socket, _info);
        }
    });

    //获取商城兑换记录
    socket.on("getShouhuoRecord", function () {
        if (gameInfo.IsPlayerOnline(socket.userId)) {
            gameInfo.getShouhuoRecord(socket);
        }
    });

    //获得任务信息
    socket.on("getTaskInfo", function () {
        if (gameInfo.IsPlayerOnline(socket.userId)) {
            gameInfo.getTaskInfo(socket);
        }
    });

    //获得每日登录奖励
    socket.on("getEveryLogin", function () {
        if (gameInfo.IsPlayerOnline(socket.userId)) {
            gameInfo.getEveryLogin(socket);
        }
    });

    //获取用户鱼虾蟹游戏记录查询
    socket.on('getYXXGameRecord', function (_Info) {
        console.log("大厅获取游戏记录");
        try {
            var data = JSON.parse(_Info);
            if (!data.now_page) {
                data.now_page = 0
            }

        } catch (e) {
            log.warn('getYXXGameRecord-json');
        }
        var limit = 10;
        var user_id = socket.userId;
        var now_page = data.now_page;

        game_log_dao.getYXXGameRecord({limit: limit, user_id: user_id, now_page: now_page}, function (state, rows) {
            var result_data = [];
            if (rows) {
                for (var x in rows) {
                    var table_dict = JSON.parse(rows[x].table_dict);
                    var add_date = rows[x].add_date;

                    var all_change_user_list = {};
                    for (var i in table_dict.game_win_record) {

                        var change_user_list = table_dict.game_win_record[i].change_user_list;
                        for (var v in change_user_list) {
                            if (!all_change_user_list[v]) {
                                all_change_user_list[v] = 0
                            }
                            if (!change_user_list[v]) {
                                change_user_list[v] = 0
                            }
                            all_change_user_list[v] += change_user_list[v]
                        }

                    }
                    var res_user_list = {};
                    if (table_dict.game_win_record[0]) {
                        // console.log("-------------------------------------------")
                        // console.log(table_dict.game_win_record)
                        res_user_list = table_dict.game_win_record[table_dict.game_win_record.length - 1].res_user_list
                    }

                    result_data.push({
                        ju_shu: table_dict.ju_shu,                                 //局数
                        fang_ka_shu: table_dict.fang_ka_shu,                      //房卡数
                        user_name_dict: table_dict.user_name_dict,            //桌子内玩家对应名字
                        user_head_url_dict: table_dict.user_head_url_dict,            //对应头像
                        game_type: table_dict.game_type,                      //游戏类型
                        tableKey: table_dict.tableKey,                       //房间号
                        game_win_record: table_dict.game_win_record,      //用户游戏记录
                        all_change_user_list: all_change_user_list,      //用户总金币变动
                        res_user_list: res_user_list,   //用户最后一局数
                        add_date: add_date,                                //记录创建时间
                        is_qiang_zhuang: table_dict.is_qiang_zhuang,                                //是否抢庄
                        zhuang: table_dict.zhuang,                                //庄
                    })

                }

            }
            socket.emit('getYXXGameRecordResult', {
                result: true,
                data: result_data,
            });

        })


    });


    //游戏服务器的排行
    socket.on("setServerRank", function (_info) {
        try {
            var data = JSON.parse(_info);
            _info = data;
        } catch (e) {
            log.warn('setServerRank-json');
        }
        gameInfo.setServerRank(_info);
    });


    socket.on("score_changeLog", function (_info) {
        gameInfo.insertScore_change_log(_info);
    });

    socket.on("insertMark", function (_info) {
        gameInfo.insertMark(_info);
    });

    socket.on("pro_change", function (_info) {
        gameInfo.pro_change(_info);
    });

    //游戏服务器的排行
    socket.on("getServerRank", function (_info) {
        try {
            var data = JSON.parse(_info);
            _info = data;
        } catch (e) {
            log.warn('getServerRank-json');
        }
        gameInfo.getServerRank(socket, _info);
    });

    //报名
    socket.on('applyMatch', function (_info) {
        try {
            var data = JSON.parse(_info);
            _info = data;
        } catch (e) {
            log.warn('applyMatch-json');
        }
        gameInfo.ApplyMatch(socket.userId, _info.roomid, socket)
    });

    //喇叭说话
    socket.on('sendMsg', function (_info) {
        try {
            var data = JSON.parse(_info);
            _info = data;
        } catch (e) {
            log.warn('sendMsg-json');
        }
        gameInfo.sendMsg(socket.userId, _info, io)
    });

    //私聊
    socket.on('sendMsgToUser', function (_info) {
        try {
            var data = JSON.parse(_info);
            _info = data;
        } catch (e) {
            log.warn('sendMsgToUser-json');
        }
        gameInfo.sendMsgToUser(socket, _info);
    });

    //私聊发图
    socket.on('sendImgToUser', function (_info) {
        try {
            var data = JSON.parse(_info);
            _info = data;
        } catch (e) {
            log.warn('sendImgToUser-json');
        }
        gameInfo.sendImgToUser(socket, _info);
    });

    //获取未收到私聊
    socket.on('getMsgToUser', function (_info) {
        try {
            var data = JSON.parse(_info);
            _info = data;
        } catch (e) {
            log.warn('getMsgToUser-json');
        }
        gameInfo.getMsgToUser(socket, _info)
    });

    //更新聊天记录
    socket.on('updateCharLog', function (_info) {
        try {
            var data = JSON.parse(_info);
            _info = data;
        } catch (e) {
            log.warn('updateCharLog-json');
        }
        gameInfo.updateCharLog(socket, _info.idList);
    });

    //兑奖
    socket.on('scoreOut', function (_info) {
        try {
            var data = JSON.parse(_info);
            _info = data;
        } catch (e) {
            log.warn('getMsgToUser-json');
        }
        _info.ip = socket.handshake.address;
        log.info(_info);
        if (_info.ip.split(':').length > 0) {
            var ip = _info.ip.split(':')[3];
            if (ip) {
                _info.ip = ip;
            } else {
                // _info.ip = "116.196.93.26";
            }


            gameInfo.scoreOut(socket, _info);
        }

    });

    //发送聊天给GM
    socket.on('sendMsgToGM', function (_info) {
        console.log("sendMsgToGM");
        if (!socket.userId) {
            console.log("没有用户id")
        }
        try {
            var data = JSON.parse(_info);
            _info = data;
        } catch (e) {
            // log.warn('sendMsgToGM-json');
        }
        gameInfo.sendMsgToGM(socket, _info);
    });


    //客服登录
    socket.on('GMLogin', function (_info) {
        console.log("GMLogin");
        try {
            var data = JSON.parse(_info);
            _info = data;
        } catch (e) {
            // log.warn('sendMsgToGM-json');
        }
        var code = "sjfhcnweuqiebncwe2@!5fy&";
        if (_info.code == code) {
            socket.gm_id = _info.gm_id;
            gameInfo.setGMSocket(_info.gm_id, socket)
        }
    });


    //获得斗地主比赛记录  个人信息
    socket.on('getLandlordRaceInfo', function (_info) {
        console.log("getLandlordRaceInfo");
        //有人离线
        if (!socket.userId) {
            return
        }
        if (!gameInfo.landload_race_is_start) {
            console.log("比赛场关闭不能查询");
            return;
        }

        landlord_race_dao.query_race_list(function (res, rows) {
            if (res) {
                var race_list = [];
                for (var r in rows) {
                    race_list.push(
                        {
                            play: rows[r].play,
                            win_all: rows[r].win_all,
                            nick_name: rows[r].nick_name,
                            head_url: rows[r].head_url
                        }
                    )

                }

                landlord_race_dao.getBaoMing(socket.userId, function (state, rs) {
                    var bm_score = gameInfo.landload_race_dict["score"];
                    var rss = {};
                    if (rs) {
                        bm_score = rs[0].bm_score;
                        rss = {play: rs[0].play, win_all: rs[0].win_all}
                    }
                    console.log(state);

                    var award = [];
                    var awards = gameInfo.landload_race_dict["awards"];
                    for (var la in awards) {
                        award.push(awards[la]["value"])
                    }

                    socket.emit('getLandlordRaceInfoResult', {
                        result: true,
                        data: state,
                        rows: rss,
                        race_list: race_list,
                        bm_score: bm_score,
                        award: award,
                    });

                })

            }

        })

    });


    //获得斗地主比赛场报名记录
    socket.on('getLandlordBaoMing', function (_info) {
        console.log("getLandlordBaoMing");
        //有人离线
        if (!socket.userId) {
            return;
        }
        if (!gameInfo.landload_race_is_start) {
            console.log("比赛场关闭不能查询");
            return;
        }


        landlord_race_dao.getBaoMing(socket.userId, function (state, rows) {
            socket.emit('getLandlordBaoMingResult', {
                result: true,
                data: state,
                rows: rows,
            });

        })

    });


    //斗地主   比赛场报名
    socket.on('add_Landlord_BaoMing', function (_info) {
        console.log("add_Landlord_BaoMing");
        //有人离线
        if (!socket.userId) {
            return
        }
        if (!gameInfo.userList[socket.userId]) {
            return
        }
        if (!gameInfo.landload_race_is_start) {
            console.log("比赛场关闭不能报名");
            return;
        }
        landlord_race_dao.getBaoMing(socket.userId, function (state, rows) {   //检查是否已经报名了
            if (state) {
                socket.emit('add_Landlord_BaoMingResult', {
                    result: false,
                    data: 1,
                });
            } else {

                var baoming_Info = {};
                baoming_Info["userid"] = socket.userId;
                baoming_Info["all_num"] = parseInt(gameInfo.landload_race_dict.total);
                baoming_Info["lost_num"] = parseInt(gameInfo.landload_race_dict.out);
                baoming_Info["bm_score"] = parseInt(gameInfo.landload_race_dict.score);

                gameInfo.userList[socket.userId].addgold(-baoming_Info["bm_score"]);

                console.log("-----------------", baoming_Info)
                landlord_race_dao.add_BaoMing(baoming_Info, function (state) {
                    if (state) {
                        console.log("报名成功");
                        socket.emit('add_Landlord_BaoMingResult', {
                            result: true,
                            data: state,
                        });
                    } else {
                        console.log("报名失败");
                        socket.emit('add_Landlord_BaoMingResult', {
                            result: false,
                            data: 2,
                        });
                    }
                })
            }
        })
    });


    //获得自己斗地主比赛场记录
    socket.on('getLandlord_race_record', function (_info) {
        console.log("getLandlord_race_record");
        //有人离线
        if (!socket.userId) {
            return
        }

        landlord_race_dao.query_race_record(socket.userId, function (state, rows) {
            if (state) {
                socket.emit('getLandlord_race_recordResult', {
                    result: true,
                    data: state,
                    rows: rows,
                });
            }

        })

    });


    //获得斗地主比赛场排行榜
    socket.on('getLandlord_race_sort', function (_info) {
        console.log("getLandlord_race_sort");
        //有人离线
        if (!socket.userId) {
            return
        }
        var my_user_id = socket.userId;

        var nowDate = new Date();

        var start_time = nowDate.getFullYear() + "-" + (nowDate.getMonth() + 1) + "-" + nowDate.getDate() + " " + "11:00:00";
        var end_time = nowDate.getFullYear() + "-" + (nowDate.getMonth() + 1) + "-" + nowDate.getDate() + " " + "23:00:00";
        start_time = start_time.substring(0, 19);
        start_time = start_time.replace(/-/g, '/');

        end_time = end_time.substring(0, 19);
        end_time = end_time.replace(/-/g, '/');

        var new_start_time = new Date(start_time).getTime();
        var new_end_time = new Date(end_time).getTime();
        landlord_race_dao.query_race_record_for_sort({
            start_time: new_start_time,
            end_time: new_end_time
        }, function (state, rows) {
            if (state) {
                var race_user_list = [];
                var race_user_dict = {};
                for (var r in rows) {
                    if (race_user_list.indexOf(rows[r].uid) == -1) {
                        race_user_list.push(rows[r].uid);
                        if (rows[r].iswin) {
                            race_user_dict[rows[r].uid] = {play: 1, win: 1}
                        } else {
                            race_user_dict[rows[r].uid] = {play: 1, win: 0}
                        }
                        race_user_dict[rows[r].uid]["nick_name"] = rows[r].nick_name;
                        race_user_dict[rows[r].uid]["head_url"] = rows[r].head_url

                    } else {
                        if (race_user_dict[rows[r].uid]["play"] < 20) {
                            race_user_dict[rows[r].uid]["play"] += 1;
                            if (rows[r].iswin) {
                                race_user_dict[rows[r].uid]["win"] += 1;
                            }
                        }
                    }
                }
                // console.log(rows);
                // console.log(race_user_dict);
                for (var rud in race_user_dict) {
                    if (race_user_dict[rud]["play"] < 20) {
                        delete race_user_dict[rud]
                    }
                }

                console.log("---------------------------");
                console.log(race_user_dict);
                var my_sheng_lv = 0;   //我的胜率
                var my_pai_ming = 0;  //我的排名
                var race_win_res_dict = {};
                var res_rac_index_list = [];
                for (var rud in race_user_dict) {
                    var win_key = parseInt(parseInt(race_user_dict[rud]["win"]) / parseInt(race_user_dict[rud]["play"]) * 100);
                    race_win_res_dict[rud] = win_key;
                    res_rac_index_list.push(win_key);

                    if (parseInt(rud) == parseInt(my_user_id)) {
                        my_sheng_lv = win_key
                    }

                }
                console.log(res_rac_index_list);

                var new_res_rac_index_list = es6_set(JSON.parse(JSON.stringify(res_rac_index_list)));
                new_res_rac_index_list.sort(function (a, b) {
                    return a - b
                });
                new_res_rac_index_list.reverse();

                for (var i in new_res_rac_index_list) {
                    if (new_res_rac_index_list[i] == my_sheng_lv) {
                        my_pai_ming = parseInt(i) + 1
                    }
                }

                var win_1 = null;
                var win_2 = null;
                var win_3 = null;
                var win_4 = [];

                if (new_res_rac_index_list.length) {
                    win_1 = new_res_rac_index_list[0];
                    if (new_res_rac_index_list.length > 1) {
                        win_2 = new_res_rac_index_list[1];
                    }
                    if (new_res_rac_index_list.length > 2) {
                        win_3 = new_res_rac_index_list[2];
                    }

                    if (new_res_rac_index_list.length > 3) {
                        for (var i = 3; i < new_res_rac_index_list.length; i++) {
                            if (new_res_rac_index_list[i] && i < 10) {
                                win_4.push(new_res_rac_index_list[i])
                            }
                        }
                    }
                }
                var huojianguser = [];
                var win_list = [];
                var win_user_list = [];
                //一等奖
                for (var rwr in race_win_res_dict) {
                    if (race_win_res_dict[rwr] == win_1 && win_list.length < 4) {
                        win_list.push({
                            user_id: rwr,
                            nick_name: race_user_dict[rwr].nick_name,
                            head_url: race_user_dict[rwr].head_url,
                            sheng_lv: win_1,
                        });

                        win_user_list.push(rwr)
                    }
                }
                for (var rwr in race_win_res_dict) {
                    if (race_win_res_dict[rwr] == win_2 && win_list.length < 4) {
                        win_list.push({
                            user_id: rwr,
                            nick_name: race_user_dict[rwr].nick_name,
                            head_url: race_user_dict[rwr].head_url,
                            sheng_lv: win_2,
                        })
                        win_user_list.push(rwr)
                    }
                }

                for (var rwr in race_win_res_dict) {
                    if (race_win_res_dict[rwr] == win_3 && win_list.length < 4) {
                        win_list.push({
                            user_id: rwr,
                            nick_name: race_user_dict[rwr].nick_name,
                            head_url: race_user_dict[rwr].head_url,
                            sheng_lv: win_3,
                        });
                        win_user_list.push(rwr)
                    }
                }

                for (var rwr in race_win_res_dict) {
                    if (win_4.indexOf(race_win_res_dict[rwr]) > -1 && win_list.length < 4) {
                        win_list.push({
                            user_id: rwr,
                            nick_name: race_user_dict[rwr].nick_name,
                            head_url: race_user_dict[rwr].head_url,
                        })
                        win_user_list.push(rwr)
                    }
                }
                for (var rwr in race_win_res_dict) {
                    if (win_user_list.indexOf(rwr) == -1 && win_list.length < 4) {
                        win_list.push({
                            user_id: rwr,
                            nick_name: race_user_dict[rwr].nick_name,
                            head_url: race_user_dict[rwr].head_url,
                        })
                        win_user_list.push(rwr)
                    }
                }

                var now_shijianchuo = Number(new Date());

                socket.emit('getLandlord_race_sortResult', {
                    result: true,
                    win_list: win_list,
                    my_sheng_lv: my_sheng_lv,
                    my_pai_ming: my_pai_ming,
                    over_time: new_end_time - now_shijianchuo,
                    info: {
                        pw_total: gameInfo.landload_race_dict.pw_total,
                        socre_1: gameInfo.landload_race_dict.pw_award1,
                        socre_2: gameInfo.landload_race_dict.pw_award2,
                        socre_3: gameInfo.landload_race_dict.pw_award3,
                        socre_4: gameInfo.landload_race_dict.pw_award4,
                        socre_5: gameInfo.landload_race_dict.pw_award5,
                    },
                });

            }
        })


    });


    //心跳
    socket.on('heartbeat', function () {
        socket.emit('heartbeatResult');
    });


    //摇钱树
    socket.on('LuckTree', function () {
        if (!socket.userId) {
            return
        }
        var res = luck_tree.lottery(socket.userId);
        socket.emit('LuckTreeResult', res);
    });

    //查用户金币数
    socket.on('getPlayerCoin', function (_info) {
        try {
            var data = JSON.parse(_info);
            _info = data;
        } catch (e) {
            log.warn('getPlayerCoin-json');
        }
        if (!socket.userId) {
            return;
        }
        gameInfo.getUserCoin(socket, _info);
    });

    //领取新手卡
    socket.on('newPlayerExchange', function (_info) {
        try {
            var data = JSON.parse(_info);
            _info = data;
        } catch (e) {
            log.warn('newPlayerExchange-json');
        }
        if (!socket.userId) {
            return;
        }
        let sendData = {
            userId: socket.userId,
            code: _info.key
        };
        ml_api.cdKey(sendData, (res) => {
            console.log(res);
            if (res.code == 1) {
                socket.emit('newPlayerExchangeResult', {Result: 1, msg: "兑换成功"});
            } else {
                socket.emit('newPlayerExchangeResult', {Result: 0, msg: res.msg});
            }
        });
    });

    //修改银行密码
    socket.on('updateBankpwd', function (_info) {
        try {
            var data = JSON.parse(_info);
            _info = data;
        } catch (e) {
            log.warn('updateBankpwd-json');
        }
        if (!socket.userId) {
            return;
        }
        gameInfo.getUserBankPwd(socket.userId, (pwd) => {
            if (pwd != _info.pwd) {
                socket.emit('updateBankpwdResult', {Result: 0, msg: "原始密码错误"});
                return;
            } else {
                gameInfo.updateUserBankPwd(socket, _info);
            }
        });
    });

    //获取银行分数
    socket.on('getBankScore', function () {
        if (!socket.userId) {
            return;
        }
        socket.emit('getBankScoreResult', {
            bankScore: gameInfo.userList[socket.userId].bankScore
        });
    });

    //修改银行分数
    socket.on('updateBankScore', function (_info) {
        try {
            var data = JSON.parse(_info);
            _info = data;
        } catch (e) {
            log.warn('updateBankScore-json');
        }
        if (!socket.userId) {
            return;
        }
        //判断存取
        if (_info.saveCoin > 0) {
            if (gameInfo.userList[socket.userId].getScore() < _info.saveCoin) {
                socket.emit('updateBankScoreResult', {ResultCode: 0, msg: "金币不足"});
                return;
            }
            gameInfo.updateBankScore(socket, _info);
        } else {
            //密码判断
            gameInfo.getUserBankPwd(socket.userId, (pwd) => {
                if (pwd != _info.pwd) {
                    socket.emit('updateBankScoreResult', {Result: 0, msg: "银行密码错误"});
                    return;
                } else {
                    if (gameInfo.userList[socket.userId].bankScore < -_info.saveCoin) {
                        socket.emit('updateBankScoreResult', {ResultCode: 0, msg: "银行余额不足"});
                        return;
                    }
                    gameInfo.updateBankScore(socket, _info);
                }
            });
        }
    });
    //查询游戏分数
    socket.on('getScoreChange', function (_info) {
        try {
            var data = JSON.parse(_info);
            _info = data;
        } catch (e) {
            log.warn('getScoreChange-json');
        }
        gameInfo.getScoreChange(socket, _info);
    });
    //查询游戏分数2
    socket.on('getCoinLog', function (_info) {
        try {
            var data = JSON.parse(_info);
            _info = data;
        } catch (e) {
            log.warn('getCoinLog-json');
        }
        gameInfo.getCoinLog(socket, _info);
    });
    //用户申请提现
    socket.on("withdraw_apply", function (_info) {
        try {
            var data = JSON.parse(_info);
            _info = data;
        } catch (e) {
            log.warn('withdraw_apply');
        }
        if (gameInfo.IsPlayerOnline(socket.userId)) {
            withdrawal_api(socket, _info);
        }
    });

});


app.set('port', process.env.PORT || 13000);

var server = http.listen(app.get('port'), function () {
    log.info('start at port:' + server.address().port);
});


var period = 1000; // 1 second
var noticeflag = true;
var times = 0;

setInterval(function () {

    var nowDate = new Date();
    var hours = nowDate.getHours();
    var minute = nowDate.getMinutes();
    var second = nowDate.getSeconds();
    times++;
    //比赛时间 8:00 - 24:00
    if (minute % 10 == 0 && second == 0) {
        if (noticeflag)
            gameInfo.sendNotice(io);
        noticeflag = false;
    } else {
        noticeflag = true;
    }
    //更新登录
    gameInfo.updateLogin();
    //保存用户
    gameInfo.pisaveUser();
    gameInfo.pisaveUser2();
    //保存log
    gameInfo.score_changeLog();
    gameInfo.diamond_changeLog();
    //PostCoin
    if (times == 60) {
        gameInfo.PostCoin();
        times = 0;
    }

}, period);


// var rule = new schedule.RecurrenceRule();
//每到55秒
//rule.seconds = 55;
//正常模式
//rule.minute = 55;
// var times = [];

// for(var i=0; i<60; i++){
// 　　times.push(i);
// }
// rule.second = times;
// var timer = (Math.floor(Math.random() * 120)) + 60;
// var timer_yin = (Math.floor(Math.random() * 50)) + 1600;
// var j = schedule.scheduleJob(rule, function(){
// //更新登录
// // gameInfo.updateLogin();
// // //保存用户
// // gameInfo.pisaveUser();
// // //保存log
// // gameInfo.score_changeLog();
// //暂时不知道干什么用的
// // gameInfo.sendApi();
// --timer;

// if (timer <= 0){
// var idx = (Math.floor(Math.random() * 10000))
// io.sockets.emit('noticeMsg',{nickname:Robotname[idx].nickname,msg:"成功兑换20元电话卡!"});
// timer =  (Math.floor(Math.random() * 120)) + 60;
// }

// var nowDate = new Date();
// var hours = nowDate.getHours();
// if (hours > 3 && hours < 10){

// }else{
//   --timer_yin;
//   if (timer_yin <= 0){
//     timer_yin = (Math.floor(Math.random() * 50)) + 1600;
//     io.sockets.emit('noticeMsg',{nickname:".",msg:"上分100元=15000金币"});
//     io.sockets.emit('noticeMsg',{nickname:".",msg:"收分16000金币=100元"});
//     io.sockets.emit('noticeMsg',{nickname:".",msg:"加微信18875495446"});
//   }
// }


//io.sockets.in('table0').emit('broadcast room message');
//保存用户数据
//gameInfo.saveAll();
//保存时间段的收益情况
//gameInfo.saveTimeScoreTotal();
//保存采池
//gameInfo.saveSocrePool();
//保存总收益情况
//gameInfo.saveTotal();
//log.info("自动保存数据!");
// });

dao.clenaLineOut();

log.info("登录服务器 v2.0.0");
log.info("服务器启动成功!");
log.info("更新时间:2017.12.17");


function es6_set(arr) {
    //es6 数组去重
    return Array.from(new Set(arr));
}


