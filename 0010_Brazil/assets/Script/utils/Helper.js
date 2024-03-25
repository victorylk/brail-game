(() => {
    let helper = function () { };

    helper.prototype.loadHead = (url, cb) => {
        if (!!url) {
            if (url == parseInt(url)) {
                cc.loader.loadRes(`head/s${url}`, cc.SpriteFrame, (err, sp) => {
                    cb(sp);
                });
            } else {
                cc.loader.load({
                    url: url,
                    type: 'png'
                }, (err, texture) => {
                    cb(new cc.SpriteFrame(texture));
                });
            }
        }
    };

    helper.prototype.setButtonAudio = () => {
        cc.Button.prototype._onTouchEnded = function (t) {
            let audioBool = this.clickEvents.length > 0 && !!this.clickEvents[0] && !!this.clickEvents[0].target && !!this.clickEvents[0].handler;
            if (audioBool && cc.director.getScene().name == 'LobbyMain') {
                window.playEffect('click');
            }
            if (this.interactable && this.enabledInHierarchy) {
                if (this._pressed) {
                    cc.Component.EventHandler.emitEvents(this.clickEvents, t);
                    this.node.emit("click", this);

                }
                this._pressed = !1;
                this._updateState();
                t.stopPropagation();
            }
        };
    };

    helper.prototype.QRCreate = (ctx, url) => {
        var qrcode = new QRCode(-1, QRErrorCorrectLevel.H);
        qrcode.addData(url);
        qrcode.make();

        ctx.fillColor = cc.Color.BLACK;
        //块宽高
        var tileW = ctx.node.width / qrcode.getModuleCount();
        var tileH = ctx.node.height / qrcode.getModuleCount();

        // draw in the Graphics
        for (var row = 0; row < qrcode.getModuleCount(); row++) {
            for (var col = 0; col < qrcode.getModuleCount(); col++) {
                if (qrcode.isDark(row, col)) {
                    // ctx.fillColor = cc.Color.BLACK;
                    var w = (Math.ceil((col + 1) * tileW) - Math.floor(col * tileW));
                    var h = (Math.ceil((row + 1) * tileW) - Math.floor(row * tileW));
                    ctx.rect(Math.round(col * tileW), Math.round(row * tileH), w, h);
                    ctx.fill();
                }
            }
        }
    };

    helper.prototype.fixNum = n => {
        let playerInfo = require("PlayerInfo").getInstant;
        n = n / playerInfo.exchangeRate;
        return n.toFixed(2);
    };

    helper.prototype.tofixNum = n => {
        return n.toFixed(2);
    };

    helper.prototype.toThousands = val => {
        if (!isNaN(val)) {
            var source = String(val.toFixed(2)).split("."); //按小数点分成2部分
            source[0] = source[0].replace(new RegExp('(\\d)(?=(\\d{3})+$)', 'ig'), "$1,");//只将整数部分进行都好分割
            return source.join(".");//再将小数部分合并进来
        }
        else {
            console.log("数字格式化失败");
            return val;
        }
    };

    helper.prototype.http = (url, data, isPost) => {
        return new Promise((resolve, reject) => {
            let xhr = new XMLHttpRequest();
            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    if (!!xhr.response) {
                        try {
                            const response = JSON.parse(xhr.response);
                            resolve(response);
                        } catch (e) {
                            reject(e);
                            console.error('json解析错误');
                        }
                    } else {
                        reject('空消息');
                    }
                }
            }
            if (isPost) {
                xhr.open("post", url);
            } else {
                xhr.open("get", url);
            }
            xhr.send(data);
        })
    };

    //时间格式转化
    helper.prototype.timeFormat = (time) => {
        var d = new Date(time);

        var year = d.getFullYear();       //年  
        var month = d.getMonth() + 1;     //月  
        var day = d.getDate();            //日  

        var hh = d.getHours();            //时  
        var mm = d.getMinutes();          //分  
        var ss = d.getSeconds();           //秒  

        var clock = year + "/";

        if (month < 10) {
            clock += "0";
        }
        clock += month + "/";

        if (day < 10) {
            clock += "0";
        }
        clock += day + " ";

        if (hh < 10) {
            clock += "0";
        }
        clock += hh + ":";

        if (mm < 10) {
            clock += '0';
        }
        clock += mm + ":";

        if (ss < 10) {
            clock += '0';
        }
        clock += ss;
        return (clock);
    };

    //时间格式转化
    helper.prototype.date = (format, timestamp) => {
        var a, jsdate = ((timestamp) ? new Date(timestamp * 1000) : new Date());
        var pad = function (n, c) {
            if ((n = n + "").length < c) {
                return new Array(++c - n.length).join("0") + n;
            } else {
                return n;
            }
        };
        var txt_weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        var txt_ordin = { 1: "st", 2: "nd", 3: "rd", 21: "st", 22: "nd", 23: "rd", 31: "st" };
        var txt_months = ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        var f = {
            // Day 
            d: function () { return pad(f.j(), 2) },
            D: function () { return f.l().substr(0, 3) },
            j: function () { return jsdate.getDate() },
            l: function () { return txt_weekdays[f.w()] },
            N: function () { return f.w() + 1 },
            S: function () { return txt_ordin[f.j()] ? txt_ordin[f.j()] : 'th' },
            w: function () { return jsdate.getDay() },
            z: function () { return (jsdate - new Date(jsdate.getFullYear() + "/1/1")) / 864e5 >> 0 },

            // Week 
            W: function () {
                var a = f.z(), b = 364 + f.L() - a;
                var nd2, nd = (new Date(jsdate.getFullYear() + "/1/1").getDay() || 7) - 1;
                if (b <= 2 && ((jsdate.getDay() || 7) - 1) <= 2 - b) {
                    return 1;
                } else {
                    if (a <= 2 && nd >= 4 && a >= (6 - nd)) {
                        nd2 = new Date(jsdate.getFullYear() - 1 + "/12/31");
                        return date("W", Math.round(nd2.getTime() / 1000));
                    } else {
                        return (1 + (nd <= 3 ? ((a + nd) / 7) : (a - (7 - nd)) / 7) >> 0);
                    }
                }
            },

            // Month 
            F: function () { return txt_months[f.n()] },
            m: function () { return pad(f.n(), 2) },
            M: function () { return f.F().substr(0, 3) },
            n: function () { return jsdate.getMonth() + 1 },
            t: function () {
                var n;
                if ((n = jsdate.getMonth() + 1) == 2) {
                    return 28 + f.L();
                } else {
                    if (n & 1 && n < 8 || !(n & 1) && n > 7) {
                        return 31;
                    } else {
                        return 30;
                    }
                }
            },

            // Year 
            L: function () { var y = f.Y(); return (!(y & 3) && (y % 1e2 || !(y % 4e2))) ? 1 : 0 },
            //o not supported yet 
            Y: function () { return jsdate.getFullYear() },
            y: function () { return (jsdate.getFullYear() + "").slice(2) },

            // Time 
            a: function () { return jsdate.getHours() > 11 ? "pm" : "am" },
            A: function () { return f.a().toUpperCase() },
            B: function () {
                // peter paul koch: 
                var off = (jsdate.getTimezoneOffset() + 60) * 60;
                var theSeconds = (jsdate.getHours() * 3600) + (jsdate.getMinutes() * 60) + jsdate.getSeconds() + off;
                var beat = Math.floor(theSeconds / 86.4);
                if (beat > 1000) beat -= 1000;
                if (beat < 0) beat += 1000;
                if ((String(beat)).length == 1) beat = "00" + beat;
                if ((String(beat)).length == 2) beat = "0" + beat;
                return beat;
            },
            g: function () { return jsdate.getHours() % 12 || 12 },
            G: function () { return jsdate.getHours() },
            h: function () { return pad(f.g(), 2) },
            H: function () { return pad(jsdate.getHours(), 2) },
            i: function () { return pad(jsdate.getMinutes(), 2) },
            s: function () { return pad(jsdate.getSeconds(), 2) },
            //u not supported yet 

            // Timezone 
            //e not supported yet 
            //I not supported yet 
            O: function () {
                var t = pad(Math.abs(jsdate.getTimezoneOffset() / 60 * 100), 4);
                if (jsdate.getTimezoneOffset() > 0) t = "-" + t; else t = "+" + t;
                return t;
            },
            P: function () { var O = f.O(); return (O.substr(0, 3) + ":" + O.substr(3, 2)) },
            //T not supported yet 
            //Z not supported yet 

            // Full Date/Time 
            c: function () { return f.Y() + "-" + f.m() + "-" + f.d() + "T" + f.h() + ":" + f.i() + ":" + f.s() + f.P() },
            //r not supported yet 
            U: function () { return Math.round(jsdate.getTime() / 1000) }
        };
        let reg = new RegExp("[\]?([a-zA-Z])", "g");
        return format.replace(reg, function (t, s) {
            let ret = null;
            if (t != s) {
                // escaped 
                ret = s;
            } else if (f[s]) {
                // a date function exists 
                ret = f[s]();
            } else {
                // nothing special 
                ret = s;
            }
            return ret;
        });
    };

    if (typeof (window) != "undefined") {
        window.Helper = Object.create(helper.prototype);
    }
})();