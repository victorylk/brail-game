var mysql = require('mysql')
var async = require('async');
var gameConfig = require("./../config/gameConfig");
var mysql_config=require("./../../util/mysql_config");

var pool = mysql.createPool({
	connectionLimit:10000,
	host:mysql_config.host,
	user:mysql_config.user,
	password:mysql_config.password,
	port:mysql_config.port,
	database:'la_ba'
})



//摇奖记录
exports.lotteryLog = function lotteryLog(userInfo,callback){
	// console.log("userInfo----------")
	// console.log(userInfo)


	var sql = "INSERT INTO lotterylog_99999(userid,bet,score_before,score_win,score_current) VALUES(?,?,?,?,?)";
	var values = [];

	pool.getConnection(function(err,connection){
		for (var i = 0 ; i < userInfo.length ; i++){
			values.push(userInfo[i].userid);
			values.push(userInfo[i].bet);
			values.push(userInfo[i].score_before);
			values.push(userInfo[i].score_win);
			values.push(userInfo[i].score_current);

		 	connection.query({sql:sql,values:values},function(err,rows){
				if (err)
				{
					console.log("lotteryLog");
					console.log(err);
				}
			})
			values = [];
		}


		connection.release();
		values = [];
		
	});

}

//金币记录
exports.score_changeLog = function score_changeLog(userInfo){
	var sql = "INSERT INTO gameaccount.score_changelog(userid,score_before,score_change,score_current,change_type,isOnline) VALUES(?,?,?,?,?,?)";
	var values = [];

	pool.getConnection(function(err,connection){
		for (var i = 0 ; i < userInfo.length ; i++){
			values.push(userInfo[i].userid);
			values.push(userInfo[i].score_before);
			values.push(userInfo[i].score_change);
			values.push(userInfo[i].score_current);
			values.push(userInfo[i].change_type);
			values.push(userInfo[i].isOnline);

		 	connection.query({sql:sql,values:values},function(err,rows){
				if (err)
				{
					console.log("score_changeLog");
					console.log(err);
				}
			})
			values = [];
		}


		connection.release();
		values = [];
		
	});
}


//奖池记录
exports.Update_score_pool = function Update_score_pool(poollist,Virtualpool,poollistId,callback){
	var sql = "UPDATE score_pool SET score_pool=? WHERE id = ?";
	
	pool.getConnection(function(err,connection){
		for (var i = 0 ;i <= poollistId.length ; ++i){
			var values = [];
			if (i != poollistId.length)
			{
				values.push(poollist[i]);
				values.push(poollistId[i]);
			}else{
				values.push(Virtualpool);
				values.push(0);
			}

			console.log(values);
			
		 	connection.query({sql:sql,values:values},function(err,rows){
				if (err)
				{
					console.log(err);
				}
				
			})

		}
	 	//callback();
		connection.release();
		
	});
}

//获得奖池最新记录
exports.getScore_pools = function getScore_pools(callback){
	var sql = "SELECT * FROM score_pool";
	pool.getConnection(function(err,connection){

	 	connection.query({sql:sql},function(err,rows){
			if (err)
			{
				console.log(err);
				callback(0);
			}else{
				if (rows.length == 0){
					callback(0);
				}else{
					callback(rows);
					}
		 		}
	 		})
		connection.release();

	});
}


//===========================================================================================================================================================
//获得拉霸水位和库存 奖池最新记录
exports.getGamblingGame = function getGamblingGame(callback){

	var sql = "SELECT * FROM gambling_game_list WHERE nGameID = ?";
	var values = [];
	values.push(99999);
	pool.getConnection(function(err,connection){

		connection.query({sql:sql,values:values},function(err,rows){
			if (err)
			{
				console.log(err);
				callback(0);
			}else{
				if (rows.length == 0){
					callback(0);
				}else{
					callback(rows);
				}
			}
		})
		connection.release();

	});
}

//保存库存奖池
exports.Update_GamblingBalanceGold = function Update_GamblingBalanceGold(nGamblingBalanceGold,nGamblingWinPool,callback){
	var sql = "UPDATE gambling_game_list SET nGamblingBalanceGold=?,nGamblingWinPool=?  WHERE nGameID = ?";

	pool.getConnection(function(err,connection){
			var values = [nGamblingBalanceGold,nGamblingWinPool,99999];
			console.log("库存 奖池 id");
			console.log(values);
			connection.query({sql:sql,values:values},function(err,rows){
				if (err)
				{
					console.log(err);
				}

			});

		connection.release();

	});
}



