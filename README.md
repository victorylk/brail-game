# brail-game
巴西-cocos
在build文件夹下 找到 main.js 和 style-mobile.css 两文件
1.修改 main.js
    添加 
    cc.director.setClearColor(new cc.Color(0,0,0, 0));
    cc.macro.ENABLE_TRANSPARENT_CANVAS = true;

    例如：
    function setLoadingDisplay () {
        // Loading splash scene
        var splash = document.getElementById('splash');
        var progressBar = splash.querySelector('.progress-bar span');
        onProgress = function (finish, total) {
            var percent = 100 * finish / total;
            if (progressBar) {
                progressBar.style.width = percent.toFixed(2) + '%';
            }
        };
        splash.style.display = 'block';
        progressBar.style.width = '0%';
        cc.director.setClearColor(new cc.Color(0,0,0, 0));//插入设置透明色   这里添加
        cc.director.once(cc.Director.EVENT_AFTER_SCENE_LAUNCH, function () {
            splash.style.display = 'none';
        });
    }
    
    cc.macro.ENABLE_TRANSPARENT_CANVAS = true;//修改状态属性  这里添加
    var onStart = function () {

    }


2. 修改 style-mobile.css
    body {
    ...
    background-color: transparent;  //修改状态属性  这里添加
    ...
    }

    canvas {
    background-color: transparent;  //修改状态属性  这里添加
    }


