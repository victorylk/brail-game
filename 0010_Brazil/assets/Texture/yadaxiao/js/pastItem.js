cc.Class({
    extends: cc.Component,

    properties: {
        //骰子1
        dice11: cc.Node,
        dice12: cc.Node,
        dice13: cc.Node,
        dice14: cc.Node,
        dice15: cc.Node,
        dice16: cc.Node,
        //骰子2
        dice21: cc.Node,
        dice22: cc.Node,
        dice23: cc.Node,
        dice24: cc.Node,
        dice25: cc.Node,
        dice26: cc.Node,
        //骰子3
        dice31: cc.Node,
        dice32: cc.Node,
        dice33: cc.Node,
        dice34: cc.Node,
        dice35: cc.Node,
        dice36: cc.Node,
        word: cc.Label,
    },

    updateItem: function(a, b, c) {
        switch(a){
            case 1:
                this.dice11.active = true;
                break;
            case 2:
                this.dice12.active = true;
                break;
            case 3:
                this.dice13.active = true;
                break;
            case 4:
                this.dice14.active = true;
                break;
            case 5:
                this.dice15.active = true;
                break;
            case 6:
                this.dice16.active = true;
                break;
        }
        switch(b){
            case 1:
                this.dice21.active = true;
                break;
            case 2:
                this.dice22.active = true;
                break;
            case 3:
                this.dice23.active = true;
                break;
            case 4:
                this.dice24.active = true;
                break;
            case 5:
                this.dice25.active = true;
                break;
            case 6:
                this.dice26.active = true;
                break;
        }
        switch(c){
            case 1:
                this.dice31.active = true;
                break;
            case 2:
                this.dice32.active = true;
                break;
            case 3:
                this.dice33.active = true;
                break;
            case 4:
                this.dice34.active = true;
                break;
            case 5:
                this.dice35.active = true;
                break;
            case 6:
                this.dice36.active = true;
                break;
        }
        if(a == b && b == c){
            this.word.string = "豹子";
        }else if((a+b+c) <= 10){
            this.word.string = "小";
        }else{
            this.word.string = "大";
        }
    },

});
