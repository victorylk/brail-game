cc.Class({
    extends: cc.Component,

    properties: {
        bet: cc.Node,
    },

    onLoad: function () {
        this.move();
        this.t = 0;
    },

    move: function () {
        this.bet.x = this.bet.x + Math.random() * 200;
        this.callback = function () {
            if(this.bet.y < 200){
                this.t += 0.1;
                this.bet.x += 5;
                this.bet.y =  this.bet.y + 2 * this.t * this.t;
                if(this.bet.width > 50){
                    this.bet.width -= 5;
                    this.bet.height -= 5;
                }
            }else{
                this.bet.destroy();
                this.unschedule(this.callback);
            }
        };
        this.schedule(this.callback, 0.02);
    }
});
