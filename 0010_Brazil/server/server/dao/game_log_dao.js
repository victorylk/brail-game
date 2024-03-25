var mysql = require('mysql')
var async = require('async'); 
var gameConfig = require('./../config/gameConfig');
var log = require("./../class/loginfo").getInstand;
var mysql_config=require("./../../util/mysql_config");

var pool = mysql.createPool({
	connectionLimit:10000,
	host:mysql_config.host,
	user:mysql_config.user,
	password:mysql_config.password,
	port:mysql_config.port,
	database:'game_log'
})




//获取鱼虾蟹游戏记录
exports.getYXXGameRecord = function getYXXGameRecord(date,callback){
	var sql = "SELECT * FROM yu_xia_xie_table_log WHERE user_id = ?  Order By id desc LIMIT ?,?";
	var values = [];
	values.push(date.user_id)
	values.push(date.now_page)
	values.push(date.limit)

	pool.getConnection(function(err,connection){

		connection.query({sql:sql,values:values},function(err,rows){
			connection.release();
			if (err)
			{
				console.log("getYXXGameRecord");
				console.log(err);
				callback(0);
			}else{
				if (rows[0]){
					callback(1,rows);
				}else{
					callback(0);
				}

			}})
		values = [];
	});
}








