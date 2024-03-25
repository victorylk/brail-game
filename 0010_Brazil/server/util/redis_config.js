redis_config = {};
//拉把类游戏每条线判断方向
redis_config.RDS_PORT= 6379;
redis_config.RDS_IP= "localhost";
redis_config.RDS_PWD= "";
redis_config.RDS_OPTS= {auth_pass:redis_config.RDS_PWD};





module.exports = redis_config;