var http = require('http');
var req = require('request');

module.exports.send = function (requestData) {

    var url = "127.0.0.1";

    var postdata = JSON.stringify(requestData);
    var appstore_optios = {
        hostname: url,
        port: 13001,
        path: '/addMessage',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    };

    var req = http.request(appstore_optios, function (res) {
        var size = 0;
        var chunks = [];

        res.on('data', function (chunk) {
            size += chunk.length;
            chunks.push(chunk);
        });

        res.on('end', function () {
            var data = Buffer.concat(chunks, size);
            try {
                console.log(data.toString());
            } catch (e) {
                console.log('post BoSenWebServer error..');
            }
        });
    });

    req.write(postdata);
    req.end();
};

module.exports.getTableKey = function (requestData, cb) {

    var url = "127.0.0.1";

    var postdata = JSON.stringify(requestData);
    var appstore_optios = {
        hostname: url,
        port: 13001,
        path: '/getTableKey',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    };

    var req = http.request(appstore_optios, function (res) {
        var size = 0;
        var chunks = [];

        res.on('data', function (chunk) {
            size += chunk.length;
            chunks.push(chunk);
        });

        res.on('end', function () {
            var data = Buffer.concat(chunks, size);
            try {
                // console.log(data.toString());
                cb(data.toString());
            } catch (e) {
                console.log('post BoSenWebServer error..');
            }
        });
    });

    req.write(postdata);
    req.end();
};

module.exports.updateTableKey = function (requestData, cb) {

    var url = "127.0.0.1";

    var postdata = JSON.stringify(requestData);
    var appstore_optios = {
        hostname: url,
        port: 13001,
        path: '/updateTableKey',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    };

    var req = http.request(appstore_optios, function (res) {
        var size = 0;
        var chunks = [];

        res.on('data', function (chunk) {
            size += chunk.length;
            chunks.push(chunk);
        });

        res.on('end', function () {
            var data = Buffer.concat(chunks, size);
            try {
                // console.log(data.toString());
                cb(data.toString());
            } catch (e) {
                console.log('post BoSenWebServer error..');
            }
        });
    });

    req.write(postdata);
    req.end();
};

module.exports.getUserCtrl = function (requestData, cb) {

    var url = "127.0.0.1";

    var postdata = JSON.stringify(requestData);
    var appstore_optios = {
        hostname: url,
        port: 13001,
        path: '/getUserCtrl',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    };

    var req = http.request(appstore_optios, function (res) {
        var size = 0;
        var chunks = [];

        res.on('data', function (chunk) {
            size += chunk.length;
            chunks.push(chunk);
        });

        res.on('end', function () {
            var data = Buffer.concat(chunks, size);
            try {
                // console.log(data.toString());
                cb(data.toString());
            } catch (e) {
                console.log('post BoSenWebServer error..');
            }
        });
    });

    req.write(postdata);
    req.end();
};

module.exports.getTax = function (requestData, cb) {

    var url = "127.0.0.1";

    var postdata = JSON.stringify(requestData);
    var appstore_optios = {
        hostname: url,
        port: 13001,
        path: '/getTax',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    };

    var req = http.request(appstore_optios, function (res) {
        var size = 0;
        var chunks = [];

        res.on('data', function (chunk) {
            size += chunk.length;
            chunks.push(chunk);
        });

        res.on('end', function () {
            var data = Buffer.concat(chunks, size);
            try {
                // console.log(data.toString());
                cb(data.toString());
            } catch (e) {
                console.log('post BoSenWebServer error..');
            }
        });
    });

    req.write(postdata);
    req.end();
};
//通知后台给代理加分成
module.exports.addTax = function (requestData, cb) {
    console.log(JSON.stringify(requestData));
    req({
        url: "http://127.0.0.1:9999/api/game/addTaxs",
        method: "post",
        headers: {
            "content-type": "application/x-www-form-urlencoded"
        },
        form: {
            uid: requestData.uid,
            amount: requestData.amount,
            mark_id: requestData.mark_id
        }
    }, function (error, response, body) {
        console.log(body);
    });
};

//获取后台每日签到金币数
module.exports.getEverySign = function (cb) {
    req({
        url: "http://127.0.0.1:9999/api/index/getActivityInfo?action=dayreward",
        method: "get",
    }, function (error, response, body) {
        console.log(body);
        let data = JSON.parse(body);
        if (data.status === 0) {
            cb && cb(data.data);
        }
    });
};

//签到收获金币数
module.exports.getEveryPrice = function (requestData, cb) {
    req({
        url: "http://127.0.0.1:9999/api/index/activityAmount",
        method: "post",
        headers: {
            "content-type": "application/x-www-form-urlencoded"
        },
        form: {
            user_id: requestData.uid,
            amount: requestData.amount,
        }
    }, function (error, response, body) {
        console.log(body);
    });
};

//签到收获金币数
module.exports.getEveryPrice = function (requestData, cb) {
    req({
        url: "http://127.0.0.1:9999/api/index/activityAmount",
        method: "post",
        headers: {
            "content-type": "application/x-www-form-urlencoded"
        },
        form: {
            user_id: requestData.uid,
            amount: requestData.amount,
        }
    }, function (error, response, body) {
        console.log(body);
    });
};

//签到收获金币数
module.exports.addTreasureBoxGold = function (cb) {
    req({
        url: "http://127.0.0.1:9999/api/config/addTreasureBoxGold",
        method: "get"
    }, function (error, response, body) {
        console.log(body);
        let data = JSON.parse(body);
        if (data.code === 1) {
            cb && cb(data.data);
        }
    });
};