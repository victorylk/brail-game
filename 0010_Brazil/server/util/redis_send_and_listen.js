var redis = require('redis');
var redis_config=require("./redis_config");

var client = redis.createClient(redis_config.RDS_PORT, redis_config.RDS_IP,redis_config.RDS_OPTS);
var client_1 = redis.createClient(redis_config.RDS_PORT, redis_config.RDS_IP,redis_config.RDS_OPTS);


client.on("error", function (err) {
    console.log("RedisError :" , err);
});

client.on('connect', function(){
    console.log('Redis send listen连接成功.');
})

// var redis_win_pool_key = "gambling_win_pool";

//----------------------------------------------------------------
//发布

module.exports.send_msg= function send_msg(s,msg) {
    client.publish(s, JSON.stringify(msg));//client将member发布到chat这个频道
    //然后订阅这个频道的订阅者就会收到消息

};
//---------------------------------------------------
//订阅
//客户端连接redis成功后执行回调
client_1.on("ready", function () {
    //订阅消息
    client_1.subscribe("GMsendMsgToUser");   //gm发送信息给用户事件
    client_1.subscribe("EditLabaSet");      //修改水位
    client_1.subscribe("UserOut");           //踢人
    client_1.subscribe("DDZBSC_START");           //斗地主比赛场开始 关闭
    console.log("订阅成功。。。");
});


//监听订阅成功事件
client_1.on("subscribe", function (channel, count) {
    console.log("client subscribed to " + channel + "," + count + "total subscriptions");
});

//收到消息后执行回调，message是redis发布的消息
// client_1.on("message", function (channel, message) {
//     console.log("我接收到信息了" + channel);
//     console.log("我接收到信息了" + message);
// });

module.exports.client_1=client_1;

