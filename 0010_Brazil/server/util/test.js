/**
 * Created by win10 on 2019/4/17.
 */
//var x =1
//var arr=[1,2,3,4,5,6,7]
//var arr_1=arr.slice()
//arr_1[0]=2
//console.log(arr_1)
//console.log(arr)
////console.log(arr.indexOf(8))
//arr_1.splice(arr_1.indexOf(2), 1);
//console.log(arr_1)


//var arr = [0,1,2 ];
//for(var i=0; i < 10; ++i){
//    console.log(RandomNumForList(arr));
//}
//
//
//function RandomNumForList(arr){
//    return arr[Math.floor((Math.random()*arr.length))]
//}


//function randomsort(a, b) {
//    return Math.random()>.5 ? -1 : 1; //通过随机产生0到1的数，然后判断是否大于0.5从而影响排序，产生随机性的效果。
//}
//var arr = [1, 2, 3, 4, 5];
//arr.sort(randomsort);
//for (var i=0; i < 10; ++i){
//    arr.sort(randomsort)
//    console.log(arr)
//}

//function curt_list(index, list) {
//    //根据索引切割数组
//    var new_list = []
//    for (var i = 0; i < list.length; ++i) {
//        if (i >= index) {
//            new_list.push(list[i])
//        }
//    }
//    return new_list
//
//}
//var list=[1,2,3,4,5,6,7,8,9]
//console.log(curt_list(1,list))
var laba = require("./laba");
var gameConfig = require("./../laba_1_jing_ling_nv_wang_server/config/gameConfig");

var dictAnalyseResult = {
    code:2,
    nHandCards: [],  //# 结果手牌
    nWinLines: [],  //# 中奖的线数的检索
    nWinLinesDetail: [],  //# 中奖线数上中奖的牌的检索
    nWinDetail: [],  //# 每条线中多少钱
    nBet: 0, // # 下注总额
    win: 0,  //# 中奖总额
    nWinCards: [],  //# 位数与手牌数相同，中奖的为True，没中奖的为False
    getOpenBox: {
        bFlag: false,
        nWinOpenBox: 0
    },
    getFreeTime: {
        bFlag: false,
        nFreeTime: 0,
        nIndex: 0
    },
    fMultiple: 1,
    nBetTime: Number(new Date())
}

//laba.Analyse([ 1, 1, 1, 1, 1, 1, 9, 9, 2, 8, 9, 8, 8, 1, 0 ], gameConfig.GAME_LINES_SPIRIT_QUEEN,
//    gameConfig.GAME_COMBINATIONS_SPIRIT_QUEEN,
//    gameConfig.GAME_MAGIC_CARD_SPIRIT_QUEEN,
//    gameConfig.GAME_LINE_WIN_LOWER_LIMIT_CARD_NUMBER_SPIRIT_QUEEN,
//    gameConfig.GAME_LINE_DIRECTION_SPIRIT_QUEEN, gameConfig.GAME_LINE_RULE_SPIRIT_QUEEN,
//    gameConfig.GAME_OPEN_BOX_CARD_SPIRIT_QUEEN, 3,
//    gameConfig.GAME_FREE_TIMES_CARD_SPIRIT_QUEEN, 3,
//    gameConfig.GAME_MULTIPLES_SPIRIT_QUEEN,
//    [ 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10 ], dictAnalyseResult, 200)


FreeTimeAnalyse = function (nHandCards, nFreeTimeCard, nFreeTimeLowerLimit) {
    //免费次数
    var dictResult = {
        bFlag: false,
        nFreeTime: 0,
        nIndex: 0
    };
    var nCount = 0
    for (var i in nHandCards) {
        if (nHandCards[i] == nFreeTimeCard) {
            nCount += 1
        }
    }
    if (nCount >= nFreeTimeLowerLimit) {
        dictResult["bFlag"] = true
        dictResult["nFreeTime"] = 10
    }
    return dictResult
}


saddsa = function (a, b){
   return parseInt(a+b)
}
saddsa(40,-160)
