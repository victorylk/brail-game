var mysql = require('mysql')
var async = require('async');
var mysql_config = require("./../../util/mysql_config");

var pool = mysql.createPool({
    connectionLimit: 10000,
    host: mysql_config.host,
    user: mysql_config.user,
    password: mysql_config.password,
    port: mysql_config.port,
    database: 'LandLords'
});


//------------------------------------------------------------------------------------------


//获得报名记录
exports.getBaoMing = function getBaoMing(uid, callback) {
    var sql = "select * from log_baoming where uid=?";
    var values = [];

    values.push(uid);


    pool.getConnection(function (err, connection) {

        connection.query({sql: sql, values: values}, function (err, rows) {
            connection.release();
            if (err) {
                console.log("getBaoMing");
                console.log(err);
                callback(0);
            } else {
                if (rows.length)
                    callback(1, rows);
                else {
                    callback(0);
                }
            }
        })

    });

}


//报名
exports.add_BaoMing = function add_BaoMing(userInfo, callback) {
    var sql = "INSERT INTO log_baoming(uid,allc,lostc,bm_score) VALUES(?,?,?,?)";
    var values = [];

    values.push(userInfo.userid);
    values.push(userInfo.all_num);
    values.push(userInfo.lost_num);
    values.push(userInfo.bm_score);

    pool.getConnection(function (err, connection) {

        connection.query({sql: sql, values: values}, function (err, rows) {
            connection.release();
            if (err) {
                console.log(err);
                callback(0)
            } else {
                callback(1)
            }

        });


    });
};

//获得厉害的人的比赛记录
exports.query_race_list= function query_race_list(callback){
    var sql = "select * from log_baoming_save where win_all=12 order by create_time desc limit 0,20";
    var values = [];


    pool.getConnection(function(err,connection){

        connection.query({sql:sql,values:values},function(err,rows){
            connection.release();
            if (err)
            {
                console.log("query_race_list");
                console.log(err);
                callback(0);
            }else{

                if (rows.length)
                    callback(1, rows);
                else{
                    callback(1);
                }
            }})

    });

}



//获得自己比赛记录
exports.query_race_record= function query_race_record(uid,callback){
    var sql = "select * from log_baoming_save where uid=? order by create_time";
    var values = [];

    values.push(uid);

    pool.getConnection(function(err,connection){

        connection.query({sql:sql,values:values},function(err,rows){
            connection.release();
            if (err)
            {
                console.log("query_race_record");
                console.log(err);
                callback(0);
            }else{

                if (rows.length)
                    callback(1, rows);
                else{
                    callback(1,[]);
                }
            }})

    });

}



//获得比赛记录 为了排名发奖
exports.query_race_record_for_sort= function query_race_record(info,callback){
    var sql = "select * from log_temp where createtime >= ? and createtime < ? order by createtime desc";
    var values = [];

    values.push(info.start_time);
    values.push(info.end_time);

    pool.getConnection(function(err,connection){

        connection.query({sql:sql,values:values},function(err,rows){
            connection.release();
            if (err)
            {
                console.log("query_race_record_for_sort");
                console.log(err);
                callback(0);
            }else{

                if (rows.length)
                    callback(1, rows);
                else{
                    callback(1,[]);
                }
            }})

    });

}




