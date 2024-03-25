var redis = require('redis');

var redis_config=require("./redis_config")
var client = redis.createClient(redis_config.RDS_PORT, redis_config.RDS_IP,redis_config.RDS_OPTS);


client.on("error", function (err) {
    console.log("RedisError :" , err);
});

client.on('connect', function(){
    console.log('Redis连接成功.');
})

var redis_win_pool_key = "gambling_win_pool";


//初始奖池
exports.redis_win_pool_init  = function redis_win_pool_init() {
    client.set(redis_win_pool_key,0);

};


//累加奖池
exports.redis_win_pool_incrby  = function redis_win_pool_incrby(increment) {

    client.incrby(redis_win_pool_key,increment);

};


//累减奖池
exports.redis_win_pool_decrby  = function redis_win_pool_decrby(increment) {
    client.decrby(redis_win_pool_key,increment);

};


//获取奖池
exports.get_redis_win_pool  = function get_redis_win_pool() {
    return new Promise(function(resolve, reject){
        client.get(redis_win_pool_key , function(error,date){
            if(error){
                reject(error);
            }else{
                resolve(date);
            }
        });
    });

};