/**
 * Created by win10 on 2019/4/15.
 */
var laba_config = require("./laba_config");


module.exports.createHandCards = function (bFreeTimeFlag, nGameFreeTimesCard, nGameColors, nGameHandCardsNumber) {
    //免费模式去除免费牌
    var nHandCards = [];
    var nNewGameColors = [];
    var nGameColors2 = [];
    if (nGameFreeTimesCard != -1) {
        //# 降低free time出现几率
        for (var i = 0; i < 5; i++) {
            if (i != 0) {
                for (var x in nGameColors) {
                    var nColor = nGameColors[x]
                    if (nColor != nGameFreeTimesCard) {
                        nGameColors2.push(nColor)
                    }
                }
            } else {
                for (var x in nGameColors) {
                    nGameColors2.push(nGameColors[x])
                }
            }
        }
        for (var i = 0; i < 10; i++) {
            nGameColors2.push(nGameFreeTimesCard)
        }
        if (bFreeTimeFlag) {
            for (var x in nGameColors2) {
                if (nGameColors2[x] != nGameFreeTimesCard) {
                    nNewGameColors.push(nGameColors2[x])
                }
            }
        } else {
            nNewGameColors = nGameColors2
        }
        for (var i = 0; i < nGameHandCardsNumber; i++) {
            nHandCards.push(nNewGameColors[RandomNumBoth(0, nNewGameColors.length - 1)])
        }

    } else {
        for (var i = 0; i < nGameHandCardsNumber; i++) {
            nHandCards.push(nGameColors[RandomNumBoth(0, nGameColors.length - 1)])
        }
    }
    return nHandCards

};

module.exports.Analyse = function (nHandCards, nGameLines, nGameCombinations, nGameMagicCardIndex, nGameLineWinLowerLimitCardNumber,
                                   nGameLineDirection, bGameLineRule, nOpenBoxCard, nOpenBoxLowerLimit, nFreeTimeCard, nFreeTimeLowerLimit,
                                   fGameMultiples, nBetList, dictAnalyseResult, jackpotUpperLimit) {
    /*
     手牌处理分析
     :param nHandCards: 手牌
     :param nGameLines: 游戏定义的线数
     :param nGameCombinations: 中奖倍率
     :param nGameMagicCardIndex: 万能花色
     :param nGameLineWinLowerLimitCardNumber: 每条线中奖要求的最少相同花色数
     :param nGameLineDirection: 线的判断方向（从左到右、从右到左、或者双向）
     :param bGameLineRule: 双向判断的情况下，如果两个方向都中奖，取大值或者取小值（True：取大值；False：取小值）
     :param nOpenBoxCard: 开宝箱的花色（没有开宝箱传-1）
     :param nOpenBoxLowerLimit: 开宝箱花色出现的最少次数）
     :param nFreeTimeCard: 获取免费次数的花色（没有获取免费次数传-1）
     :param nFreeTimeLowerLimit: 获取免费次数的花色出现的最少次数）
     :param fGameMultiples: 翻倍（适合阿兹台克类右侧有翻倍的游戏，没有传空list）
     :param nBetList: 下注列表
     :param dictAnalyseResult: 分析结果字典
     :param jackpotUpperLimit: 开宝箱、中大奖之类活动的上限金额（已区分金币和筹码）
     :return: dictAnalyseResult
     */
    var nLineNum = 0;  //当前线数
    var nBetSum = 0;

    for (var i in nBetList) {
        nBetSum += nBetList[i]
    }
    console.log("nGameLines:", nGameLines);
    // 遍历分析每条线
    for (var nl in nGameLines) {
        var nLine = nGameLines[nl];
        //# 如果该线有下注
        if (nBetList[nLineNum] > 0) {
            var temp = []; //存放此线的花色
            var nMultiple = 0;
            var nMultiple1 = 0;
            var nMultiple2 = 0;
            var dict = {};
            var dict1 = {};
            var dict2 = {};
            // console.log("nHandCards:",nHandCards);
            // console.log("nLine:",nLine);
            // 生成此条线的花色
            for (var il in nLine) {
                var i = nLine[il];
                temp.push(nHandCards[i - 1])
            }
            //# 判断是否是从左向右判断
            if (nGameLineDirection && (nGameLineDirection === laba_config.GAME_SLOT_LEFT_TO_RIGHT || nGameLineDirection === laba_config.GAME_SLOT_BOTH_WAY)) {
                //单条线分析
                dict1 = Sort(nLine, temp, nGameMagicCardIndex, nGameLineWinLowerLimitCardNumber, nGameCombinations, bGameLineRule);
                if (dict1["nNumber"] >= nGameLineWinLowerLimitCardNumber) {
                    var bFlag = true;
                    for (var n in dict1["nCardsIndex"]) {
                        if (dict1["nCardsIndex"][n] != nLine[n]) {
                            bFlag = false;
                        }
                    }
                    if (bFlag) {
                        // console.log("nGameCombinations:",nGameCombinations);
                        // console.log("nColor:",dict1["nColor"]);
                        // console.log("nNumber:",dict1["nNumber"]);
                        // console.log("nGameLineWinLowerLimitCardNumber:",nGameLineWinLowerLimitCardNumber);
                        //# 中奖倍数
                        nMultiple1 = nGameCombinations[dict1["nColor"]][dict1["nNumber"] - nGameLineWinLowerLimitCardNumber];
                        for (var n in dict1["nCardsIndex"]) {
                            dict1["nCardsIndex"][n] -= 1;
                        }
                    } else {
                        console.log("FALSE1")
                    }
                }
            }
            //# 判断是否是从右向左判断
            if (nGameLineDirection && (nGameLineDirection === laba_config.GAME_SLOT_RIGHT_TO_LEFT || nGameLineDirection === laba_config.GAME_SLOT_BOTH_WAY)) {
                //# DEBUG_MSG("--------------RIGHT TO LEFT--------------")
                //# 将线反向排序
                temp.reverse();
                nLine.reverse();
                //单条线分析
                dict2 = Sort(nLine, temp, nGameMagicCardIndex, nGameLineWinLowerLimitCardNumber, nGameCombinations, bGameLineRule);
                if (dict2["nNumber"] >= nGameLineWinLowerLimitCardNumber) {
                    var bFlag = true;
                    for (var n in dict2["nCardsIndex"]) {
                        if (dict2["nCardsIndex"][n] != nLine[n]) {
                            bFlag = false;
                        }
                    }
                    if (bFlag) {
                        //# 中奖倍数
                        nMultiple2 = nGameCombinations[dict2["nColor"]][dict2["nNumber"] - nGameLineWinLowerLimitCardNumber];
                        for (var n in dict2["nCardsIndex"]) {
                            dict2["nCardsIndex"][n] -= 1;
                        }
                    }
                }
            }
            //# 判断优先取大值还是取小值
            if (bGameLineRule) {
                if (nMultiple1 > nMultiple2) {
                    nMultiple = nMultiple1;
                    dict = dict1
                } else {
                    nMultiple = nMultiple2;
                    dict = dict2
                }
            } else {
                if (nMultiple1 > nMultiple2) {
                    nMultiple = nMultiple2;
                    dict = dict2
                } else {
                    nMultiple = nMultiple1;
                    dict = dict1
                }
            }
            //# 设置中奖金额
            dictAnalyseResult["win"] += nMultiple * nBetList[nLineNum];
            //# 设置中奖线数、中奖角标
            if (nMultiple * nBetList[nLineNum] > 0) {
                dictAnalyseResult["nWinLines"].push(nLineNum);
                dictAnalyseResult["nWinDetail"].push(nMultiple * nBetList[nLineNum]);
                dictAnalyseResult["nWinLinesDetail"].push(dict["nCardsIndex"]);
                for (var li in dict["nCardsIndex"]) {
                    var i = dict["nCardsIndex"][li];
                    dictAnalyseResult["nWinCards"][i] = true;
                }

            }
        }
        nLineNum += 1
    }
    //# 开宝箱
    if (nOpenBoxCard > -1) {
        dictAnalyseResult["getOpenBox"] = OpenBoxAnalyse(nHandCards, nOpenBoxCard, nOpenBoxLowerLimit, jackpotUpperLimit)
    }
    //# 获取免费次数
    if (nFreeTimeCard > -1) {
        dictAnalyseResult["getFreeTime"] = FreeTimeAnalyse(nHandCards, nFreeTimeCard, nFreeTimeLowerLimit)
    }
    // # 翻倍（适用于类似阿兹台克类右侧有翻倍显示的游戏）
    if (fGameMultiples.length > 0) {
        var nIndex = RandomNumBoth(0, fGameMultiples.length - 1);
        dictAnalyseResult["fMultiple"] = fGameMultiples[nIndex];
        dictAnalyseResult["win"] *= fGameMultiples[nIndex]

    }
    return dictAnalyseResult
};


Sort = function (nLine, nList, nMagicCard, nMinLimit, nCombinations, bRule) {
    /*
     分析线上牌型
     :param nList: 单条线牌型
     :param nMagicCard: 女王（会牌）
     :param nMinLimit: 中奖最少连续数
     :param nCombinations: 各花色中奖倍率表
     :param bRule: 同一条线上出现多种开奖组合的情况下取高值或低值   True:择优取高值  False:择优取低值
     :return: [0]:花色 [1]:张数
     */
    var nStart = 0;  //# 第一张不是女王的牌
    var temp = [];  //# 满足开奖条件的牌总和
    var res = {
        nNumber: 0,
        nColor: 0,
        nCardsIndex: null
    }; //# 返回结果
    var nCount = 0; //# 连贯总数
    var nMark = 0; //# 花色
    var listWinCards = []; //# 保存开奖图案角标
    var i = 0;
    //# 遍历单条线牌型，找出第一张不是女王的牌
    for (i in nList) {
        if (nList[i] === nMagicCard) {
            temp.push(nList[i]);
            listWinCards.push(nLine[i])
        } else {
            nStart = nList[i];
            temp.push(nList[i]);
            listWinCards.push(nLine[i]);
            break
        }
    }
    //# 查找nStart之后满足条件的牌
    for (var j = parseInt(i) + 1; j < nList.length; j++) {
        if (nList[j] == nStart || nList[j] == nMagicCard) {
            temp.push(nList[j]);
            listWinCards.push(nLine[j])
        } else {
            break;
        }

    }
    //# 满足胡牌条件
    if (temp.length >= nMinLimit) {
        //# 倒序排列，为让有女王的情况下，女王开头（女王为最大牌）
        temp.sort(function (a, b) {
            return a - b
        });
        temp.reverse();
        if (check_count(temp, temp[0]) === temp.length && temp[0] === nMagicCard) {//# 整条线全是女王
            nMark = nMagicCard;
            nCount = temp.length
        } else if (check_count(temp, nMagicCard) >= nMinLimit) {   //# 女王牌数大于最小中奖数和其他花色混搭
            if (bRule) {
                if (nCombinations[nMagicCard][check_count(temp, nMagicCard) - nMinLimit] > nCombinations[temp[temp.length - 1]][temp.length - nMinLimit]) {
                    nMark = nMagicCard;
                    nCount = check_count(temp, nMagicCard)
                } else {
                    nMark = temp[temp.length - 1];
                    nCount = temp.length
                }
            } else {
                if (nCombinations[nMagicCard][check_count(temp, nMagicCard) - nMinLimit] > nCombinations[temp[temp.length - 1]][temp.length - nMinLimit]) {
                    nMark = temp[temp.length - 1];
                    nCount = temp.length
                } else {
                    nMark = nMagicCard;
                    nCount = check_count(temp, nMagicCard)
                }
            }
        } else if (nList[0] !== nMagicCard) {  //# 一般混搭或纯女王外花色牌(开始牌必须不是女王)
            nMark = nList[0];
            nCount = temp.length;
        } else if (nList[0] === nMagicCard) { //# 女王牌开头的普通花色，找出第一个不是女王的花色
            for (let i = 0; i < nList.length; i++) {
                if (nList[i] !== nMagicCard) {
                    nMark = nList[i];
                    break;
                }
            }
            nCount = temp.length;
        }
    }
    res["nColor"] = nMark;
    res["nNumber"] = nCount;
    res["nCardsIndex"] = listWinCards;
    return res;
};


check_count = function (check_list, x) {
    //检查数组中指定元素的个数
    var num = 0;
    for (var i = 0; i < check_list.length; ++i) {
        if (check_list[i] == x) {
            num++
        }
    }
    return num

};
OpenBoxAnalyse = function (nHandCards, nOpenBoxCard, nOpenBoxLowerLimit, jackpotUpperLimit) {
    //开宝箱
    var dictResult = {
        bFlag: false,
        nWinOpenBox: 0
    };
    var nCount = 0
    for (var i in nHandCards) {
        if (nHandCards[i] == nOpenBoxCard) {
            nCount += 1
        }
    }
    if (nCount >= nOpenBoxLowerLimit) {
        dictResult["bFlag"] = true
        if (jackpotUpperLimit > 0) {
            dictResult["nWinOpenBox"] = RandomNumBoth(0, jackpotUpperLimit)
        } else {
            dictResult["nWinOpenBox"] = 0
        }

    }
    return dictResult
};

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
        dictResult["bFlag"] = true;
        dictResult["nFreeTime"] = 10
    }
    return dictResult
};

check_hand_cards = function (nHandCards, game_colors, magic_card, no_magic_card_list) {
    //检查手牌去除指定位置万能牌
    var colors = game_colors.slice()
    var magic_card_index = colors.indexOf(magic_card)
    if (magic_card_index > -1) {
        colors.splice(magic_card_index, 1);
    }
    for (var i = 0; i < nHandCards.length; ++i) {
        if (no_magic_card_list.indexOf(i) > -1) {
            if (nHandCards[i] == magic_card) {
                nHandCards[i] = RandomNumForList(colors)
            }
        }
    }
    return nHandCards

};

module.exports.CreateRandomTurnOverCardList = function (bet_num, nWinUpperLimit, turn_over_card, GAME_CAI_SHEN_GOLD_Single) {
    /*翻牌子
     :param bet_num: 倍数
     :param nWinUpperLimit: 最大赢钱数
     :param turn_over_card: 翻牌子对应颜色倍数
     */

    var dictResult = {
        bFlag: false,
        nWinOpenBox: 0,
        win_list: [],
        win_card: 0,
        win: 0
    };
    var choice_list = [];
    for (var x in turn_over_card) {
        choice_list.push(turn_over_card[x])
    }
    var card = null;
    while (true) {
        var choice_num = RandomNumForList(choice_list);
        if (bet_num * choice_num < nWinUpperLimit) {
            card = choice_num;
            break;
        }

        if (bet_num * choice_list[0] > nWinUpperLimit) {//最小的都不行   就开最小的
            card = choice_list[0];
            break;
        }

    }
    // console.log("choice_list----")
    // console.log(choice_list)
    // console.log(card)
    var win_list = [];
    for (var c in choice_list) {
        if (choice_list[c] == card) {
            for (var i = 0; i < 3; ++i) {
                win_list.push(choice_list[c])
            }
        } else {
            var rand_n = RandomNumBoth(1, 2);
            for (var i = 0; i < rand_n; ++i) {
                win_list.push(choice_list[c])
            }
        }
    }
    // console.log(win_list)
    win_list.sort(randomsort);
    // var new_win_list=[]
    // for(var w in win_list){
    //     if(parseInt(w)>=win_list.indexOf(choice_num)){
    //         new_win_list.push(win_list[x])
    //     }
    // }
    // console.log("win_list----")
    // console.log(win_list)
    // console.log("---")


    var new_win_list = curt_list(win_list.indexOf(choice_num), win_list);
    // console.log(win_list.indexOf(choice_num))
    // console.log(new_win_list)
    // new_win_list.reverse()   //不反转数组
    // console.log(new_win_list)
    dictResult["bFlag"] = true;
    dictResult["win_list"] = new_win_list;
    dictResult["win_card"] = card;
    dictResult["win"] = bet_num * card * GAME_CAI_SHEN_GOLD_Single;

    // console.log(bet_num)
    // console.log(card)
    // console.log(GAME_CAI_SHEN_GOLD_Single)

    return dictResult

};

//无线拉霸发牌
module.exports.CreateRandomCardList = function (init_type_card_list, column, row, no_magic_column_list) {
    //生成随机牌型
    //:param init_type_card_list: 花色数组
    //:param column: 列
    //:param row: 行
    // :param no_magic_column_list: 没有万能牌的列号数组
    var random_card_list = [];
    var n = init_type_card_list.slice();
    n.pop();
    for (var x = 0; x < column; x++) {
        var column_list = [];
        for (var i = 0; i < row; i++) {
            if (no_magic_column_list.indexOf(x + 1) > -1) {
                column_list.push(RandomNumForList(n))
            } else {
                column_list.push(RandomNumForList(init_type_card_list))
            }
        }
        random_card_list.push(column_list)
    }
    var result_list = [];
    for (var j = 0; j < row; j++) {
        for (var x in random_card_list) {

            if (random_card_list[parseInt(x)]) {
                result_list.push(random_card_list[parseInt(x)][0]);
                random_card_list[parseInt(x)].shift()
            } else {
                break
            }
        }

    }
    return result_list;
};


module.exports.CreateRandomCardListForFree = function (init_type_card_list, column, row, no_magic_column_list) {
    //生成随机牌型
    //:param init_type_card_list: 花色数组
    //:param column: 列
    //:param row: 行
    // :param no_magic_column_list: 没有万能牌的列号数组
    var random_card_list = [];
    for (var x = 0; x < column; x++) {
        var column_list = [];
        for (var i = 0; i < row; i++) {
            if (no_magic_column_list.indexOf(x + 1) > -1) {
                column_list.push(init_type_card_list[x][RandomNumBoth(0, init_type_card_list[x].length - 2)])
            } else {
                column_list.push(init_type_card_list[x][RandomNumBoth(0, init_type_card_list[x].length - 1)])
            }
        }
        random_card_list.push(column_list)
    }

    var result_list = [];
    for (var j = 0; j < row; j++) {
        for (var x in random_card_list) {

            if (random_card_list[parseInt(x)]) {
                result_list.push(random_card_list[parseInt(x)][0]);
                random_card_list[parseInt(x)].shift()
            } else {
                break
            }
        }

    }
    return result_list
};


module.exports.AnalyseColumnSolt = function (nHandCards, nMagicCard, nFreeCard, nLowerLimit, nColumnNumber, nBet, game_odds, GOLD_Single, is_free) {
    /*
        列数判断型拉把算法
        :param nHandCards: 手牌
        :param nMagicCard: 万能牌的值
        :param nLowerLimit: 一条线上最少连线的数量
        :param nColumnNumber: 手牌总共多少列
        :param nBet: 下注倍数
        :param game_odds: 花色对应赔率
        :param free_num: 免费次数
        :param free_multiple:免费倍数
     */
    var now_time = Number(new Date());
    var result = {};
    //# 校验手牌是否满足列数
    //# 生成列的结合
    var i = 0;
    var columns = [];
    while (i < nColumnNumber) {
        var column = [];
        for (var str_j in nHandCards) {
            var j = parseInt(str_j);
            if (j % nColumnNumber == i) {
                column.push(j);
            }

        }
        columns.push(column);
        i++;
    }
    //# 可以连接的列
    var nWinLines = [];
    var nIndex = 0;
    for (var column_index in columns) {
        var column = columns[parseInt(column_index)];
        nIndex++;
        //# 初始化为第一列
        if (nWinLines.length == 0) {
            for (var i_idx in column) {
                var nWinLine = [];
                nWinLine.push(column[parseInt(i_idx)]);
                nWinLines.push(nWinLine)
            }
        } else {
            //# 遍历nWinLines 和 column 判断是否可以连线
            for (var i_idx in column) {
                var i = column[parseInt(i_idx)];
                for (var w_l_idx in nWinLines) {
                    var nWinLine = nWinLines[parseInt(w_l_idx)];
                    //# 存放中奖线的牌的花色
                    var nWinLineCards = [];
                    for (var n_idx in nWinLine) {
                        var n = nWinLine[parseInt(n_idx)];
                        nWinLineCards.push(nHandCards[n])
                    }
                    // # 用nWinLine的最后一位和 column中的角标比较，如果值相等的话将角标添加到nWinLine中
                    if (nWinLineCards.indexOf(nHandCards[i]) > -1 || nHandCards[i] == nMagicCard) {
                        var temp = [];
                        //# 复制出当前的nWinLine
                        for (var m in nWinLine) {
                            temp.push(nWinLine[parseInt(m)]);
                        }
                        //# 如果nWinLine的长度比列数少一位则满足条件，将角标i添加到新的nWinLine中，然后将nWinLine添加到列表nWinLine中
                        if (temp.indexOf(i) == -1 && nWinLine.length + 1 == nIndex) {
                            temp.push(i);
                            nWinLines.push(temp);

                        }
                    }
                }

            }
        }

    }
    //# 遍历nWinLines，将包含于其他线中的线（之前判断的老线）和长度不满足最短连线要求的线删除
    var bFlage = true;
    while (bFlage) {
        bFlage = false;
        for (var w_l_idx in nWinLines) {
            var nWinLine = nWinLines[parseInt(w_l_idx)];
            for (var wl_idx in nWinLines) {
                var line = nWinLines[parseInt(wl_idx)];
                if (es6_set(nWinLine).length < es6_set(line).length || nWinLine.length < nLowerLimit) {
                    // nWinLines.remove(nWinLine)
                    list_remove(nWinLine, nWinLines);
                    bFlage = true;
                    break
                }
            }
        }
    }
    //# 根据下注倍数计算每条线
    var bIsFree = false;  //# 是否免费
    var nFreeNum = 0;  //# 免费次数
    var AllWinNum = 0;  //# 赢钱总数
    var WinLinesList = [];  //# 获奖线和金额
    var AllWinLinesList = [];  //# 所有中奖位置

    //# 判断赢线里有没有免费牌中奖 有没有万能牌代替免费牌 有的话删除中奖线
    // console.log("nWinLines----------------------0")
    // console.log(nWinLines)
    if (nWinLines.length > 0) {
        for (var i_idx in nWinLines) {
            var i = parseInt(i_idx);
            var x = nWinLines[i_idx];
            var is_free_card = false;
            var is_magic_card = false;
            for (var j_idx in nWinLines[i_idx]) {
                var j = nWinLines[i_idx][j_idx];
                if (nHandCards[j] == nFreeCard) {
                    is_free_card = true;
                } else if (nHandCards[j] == nMagicCard) {
                    is_magic_card = true;
                }
            }
            if (is_free_card && is_magic_card) {
                if (nHandCards[nWinLines[i_idx][1]] == nMagicCard) {
                    nWinLines[i_idx] = [];
                } else if (nHandCards[nWinLines[i_idx][2]] == nMagicCard) {
                    nWinLines[i_idx] = [];
                } else if (nHandCards[nWinLines[i_idx][3]] == nMagicCard) {
                    nWinLines[i_idx] = [nWinLines[i_idx][0], nWinLines[i_idx][1], nWinLines[i_idx][2]];
                } else if (nHandCards[nWinLines[i_idx][4]] == nMagicCard) {
                    nWinLines[i_idx] = [nWinLines[i_idx][0], nWinLines[i_idx][1], nWinLines[i_idx][2], nWinLines[i_idx][3]];
                }

            }
        }
        // console.log("nWinLines----------------------")
        // console.log(nWinLines)
        for (var x_idx in nWinLines) {
            var x = nWinLines[parseInt(x_idx)];
            if (!x) {
                // nWinLines.remove(x)
                list_remove(x, nWinLines);
            }
        }

    }
    if (nWinLines.length > 0) {
        for (var x_idx in nWinLines) {
            var x = nWinLines[parseInt(x_idx)];
            var cards_index = x[0]
            if (cards_index || cards_index == 0) {
                var card = nHandCards[cards_index];
                var win_num = 0;
                if (is_free) { //# 免费倍数
                    win_num = game_odds[card][x.length] * nBet
                } else {
                    console.log("------------------------");
                    console.log(game_odds);
                    console.log(card);
                    console.log(x.length);
                    console.log(nHandCards);
                    console.log(cards_index);
                    console.log(nWinLines);
                    win_num = game_odds[card][x.length] * nBet;
                    console.log(win_num);
                    console.log(nBet);
                    console.log(game_odds[card][x.length]);
                    console.log(GOLD_Single)
                }
                AllWinNum += win_num;
                var win_line = [];
                for (var i_idx in nHandCards) {
                    var i = parseInt(i_idx);
                    var j = nHandCards[i];
                    if (x.indexOf(i) > -1) {
                        win_line.push(true)
                    } else {
                        win_line.push(false)
                    }
                }
                WinLinesList.push({"win_num": win_num, "win_line": win_line});
                if (card == nFreeCard) {
                    bIsFree = true;
                    nFreeNum = 10
                }
            }
        }

        for (var i_idx in nHandCards) {
            AllWinLinesList.push(false)
        }
        for (var i_idx in nWinLines) {
            var nWinLineDetail = nWinLines[parseInt(i_idx)];
            for (var o_idx in nWinLineDetail) {
                var o = nWinLineDetail[o_idx];
                AllWinLinesList[o] = true
            }

        }
    }
    result["nHandCards"] = nHandCards;  //# 手牌
    result["nAllWinLines"] = WinLinesList; //# 获胜线具体
    result["nWinLinesDetail"] = nWinLines; //# 获胜线
    // result["nBet"] = nBet  //# 下注
    result["win"] = AllWinNum; //# 赢钱总数
    result["nWinCards"] = AllWinLinesList; //# 总获胜线
    result["getOpenBox"] = {"bFlag": false, "nWinOpenBox": 0, "win": 0}; //# 开箱子
    result["getFreeTime"] = {"bFlag": bIsFree, "nFreeTime": nFreeNum};  //# 免费次数
    result["nBetTime"] = now_time; //# 时间戳

    return result;
};

module.exports.AnalyseColumnSolt2 = function (nHandCards, nMagicCard, nFreeCard, nLowerLimit, nColumnNumber, nBet, game_odds, GOLD_Single, is_free) {
    /*
        列数判断型拉把算法
        :param nHandCards: 手牌
        :param nMagicCard: 万能牌的值
        :param nLowerLimit: 一条线上最少连线的数量
        :param nColumnNumber: 手牌总共多少列
        :param nBet: 下注倍数
        :param game_odds: 花色对应赔率
        :param free_num: 免费次数
        :param free_multiple:免费倍数
     */
    var now_time = Number(new Date());
    var result = {};
    //# 校验手牌是否满足列数
    //# 生成列的结合
    var i = 0;
    var columns = [];
    while (i < nColumnNumber) {
        var column = [];
        for (var str_j in nHandCards) {
            var j = parseInt(str_j);
            if (j % nColumnNumber == i) {
                column.push(j);
            }

        }
        columns.push(column);
        i++;
    }
    //# 可以连接的列
    var nWinLines = [];
    var nIndex = 0;
    for (var column_index in columns) {
        var column = columns[parseInt(column_index)];
        nIndex++;
        //# 初始化为第一列
        if (nWinLines.length == 0) {
            for (var i_idx in column) {
                var nWinLine = [];
                nWinLine.push(column[parseInt(i_idx)]);
                nWinLines.push(nWinLine)
            }
        } else {
            //# 遍历nWinLines 和 column 判断是否可以连线
            for (var i_idx in column) {
                var i = column[parseInt(i_idx)];
                for (var w_l_idx in nWinLines) {
                    var nWinLine = nWinLines[parseInt(w_l_idx)];
                    //# 存放中奖线的牌的花色
                    var nWinLineCards = [];
                    for (var n_idx in nWinLine) {
                        var n = nWinLine[parseInt(n_idx)];
                        nWinLineCards.push(nHandCards[n])
                    }
                    // # 用nWinLine的最后一位和 column中的角标比较，如果值相等的话将角标添加到nWinLine中
                    if (nHandCards[i] !== nFreeCard && nWinLineCards.indexOf(nHandCards[i]) > -1 || nHandCards[i] == nMagicCard) {
                        var temp = [];
                        //# 复制出当前的nWinLine
                        for (var m in nWinLine) {
                            temp.push(nWinLine[parseInt(m)]);
                        }
                        //# 如果nWinLine的长度比列数少一位则满足条件，将角标i添加到新的nWinLine中，然后将nWinLine添加到列表nWinLine中
                        if (temp.indexOf(i) == -1 && nWinLine.length + 1 == nIndex) {
                            temp.push(i);
                            nWinLines.push(temp);

                        }
                    }
                }

            }
        }

    }
    //# 遍历nWinLines，将包含于其他线中的线（之前判断的老线）和长度不满足最短连线要求的线删除
    var bFlage = true;
    while (bFlage) {
        bFlage = false;
        for (var w_l_idx in nWinLines) {
            var nWinLine = nWinLines[parseInt(w_l_idx)];
            for (var wl_idx in nWinLines) {
                var line = nWinLines[parseInt(wl_idx)];
                if (es6_set(nWinLine).length < es6_set(line).length || nWinLine.length < nLowerLimit) {
                    // nWinLines.remove(nWinLine)
                    list_remove(nWinLine, nWinLines);
                    bFlage = true;
                    break
                }
            }
        }
    }
    //# 根据下注倍数计算每条线
    var bIsFree = false;  //# 是否免费
    var nFreeNum = 0;  //# 免费次数
    var AllWinNum = 0;  //# 赢钱总数
    var WinLinesList = [];  //# 获奖线和金额
    var AllWinLinesList = [];  //# 所有中奖位置

    //# 判断赢线里有没有免费牌中奖 有没有万能牌代替免费牌 有的话删除中奖线
    // console.log("nWinLines----------------------0")
    // console.log(nWinLines)
    if (nWinLines.length > 0) {
        for (var i_idx in nWinLines) {
            var i = parseInt(i_idx);
            var x = nWinLines[i_idx];
            var is_free_card = false;
            var is_magic_card = false;
            for (var j_idx in nWinLines[i_idx]) {
                var j = nWinLines[i_idx][j_idx];
                if (nHandCards[j] == nFreeCard) {
                    is_free_card = true;
                } else if (nHandCards[j] == nMagicCard) {
                    is_magic_card = true;
                }
            }
            if (is_free_card) {
                nWinLines[i_idx] = [];
            }
            if (is_free_card && is_magic_card) {
                if (nHandCards[nWinLines[i_idx][1]] == nMagicCard) {
                    nWinLines[i_idx] = [];
                } else if (nHandCards[nWinLines[i_idx][2]] == nMagicCard) {
                    nWinLines[i_idx] = [];
                } else if (nHandCards[nWinLines[i_idx][3]] == nMagicCard) {
                    nWinLines[i_idx] = [nWinLines[i_idx][0], nWinLines[i_idx][1], nWinLines[i_idx][2]];
                } else if (nHandCards[nWinLines[i_idx][4]] == nMagicCard) {
                    nWinLines[i_idx] = [nWinLines[i_idx][0], nWinLines[i_idx][1], nWinLines[i_idx][2], nWinLines[i_idx][3]];
                }

            }
        }
        // console.log("nWinLines----------------------")
        // console.log(nWinLines)
        for (var x_idx in nWinLines) {
            var x = nWinLines[parseInt(x_idx)];
            if (!x || x.length === 0) {
                // nWinLines.remove(x)
                list_remove(x, nWinLines);
            }
        }

    }
    if (nWinLines.length > 0) {
        for (var x_idx in nWinLines) {
            var x = nWinLines[parseInt(x_idx)];
            var cards_index = x[0]
            if (cards_index || cards_index == 0) {
                var card = nHandCards[cards_index];
                var win_num = 0;
                if (is_free) { //# 免费倍数
                    win_num = game_odds[card][x.length] * nBet
                } else {
                    console.log("------------------------");
                    console.log(game_odds);
                    console.log(card);
                    console.log(x.length);
                    console.log(nHandCards);
                    console.log(cards_index);
                    console.log(nWinLines);
                    win_num = game_odds[card][x.length] * nBet;
                    console.log(win_num);
                    console.log(nBet);
                    console.log(game_odds[card][x.length]);
                    console.log(GOLD_Single)
                }
                AllWinNum += win_num;
                var win_line = [];
                for (var i_idx in nHandCards) {
                    var i = parseInt(i_idx);
                    var j = nHandCards[i];
                    if (x.indexOf(i) > -1) {
                        win_line.push(true)
                    } else {
                        win_line.push(false)
                    }
                }
                WinLinesList.push({"win_num": win_num, "win_line": win_line});
                if (card == nFreeCard) {
                    bIsFree = true;
                    nFreeNum = 10
                }
            }
        }

        for (var i_idx in nHandCards) {
            AllWinLinesList.push(false)
        }
        for (var i_idx in nWinLines) {
            var nWinLineDetail = nWinLines[parseInt(i_idx)];
            for (var o_idx in nWinLineDetail) {
                var o = nWinLineDetail[o_idx];
                AllWinLinesList[o] = true
            }

        }
    }
    result["nHandCards"] = nHandCards;  //# 手牌
    result["nAllWinLines"] = WinLinesList; //# 获胜线具体
    result["nWinLinesDetail"] = nWinLines; //# 获胜线
    // result["nBet"] = nBet  //# 下注
    result["win"] = AllWinNum; //# 赢钱总数
    result["nWinCards"] = AllWinLinesList; //# 总获胜线
    result["getOpenBox"] = {"bFlag": false, "nWinOpenBox": 0, "win": 0}; //# 开箱子
    result["getFreeTime"] = {"bFlag": bIsFree, "nFreeTime": nFreeNum};  //# 免费次数
    result["nBetTime"] = now_time; //# 时间戳

    return result;
};
//老虎机通用算法 date:2021/2/3 by:zhao
module.exports.newAnalyse = function (nHandCards, nGameLines, nGameCombinations, nGameMagicCardIndex, nGameLineWinLowerLimitCardNumber,
                                      nOpenBoxCard, nOpenBoxLowerLimit, nFreeTimeCard, nFreeTimeLowerLimit,
                                      fGameMultiples, nBetList, dictAnalyseResult, jackpotUpperLimit) {
    /*
     手牌处理分析
     :param nHandCards: 手牌
     :param nGameLines: 游戏定义的线数
     :param nGameCombinations: 中奖倍率
     :param nGameMagicCardIndex: 万能花色
     :param nGameLineWinLowerLimitCardNumber: 每条线中奖要求的最少相同花色数
     :param nOpenBoxCard: 开宝箱的花色（没有开宝箱传-1）
     :param nOpenBoxLowerLimit: 开宝箱花色出现的最少次数）
     :param nFreeTimeCard: 获取免费次数的花色（没有获取免费次数传-1）
     :param nFreeTimeLowerLimit: 获取免费次数的花色出现的最少次数）
     :param fGameMultiples: 翻倍（适合阿兹台克类右侧有翻倍的游戏，没有传空list）
     :param nBetList: 下注列表
     :param dictAnalyseResult: 分析结果字典
     :param jackpotUpperLimit: 开宝箱、中大奖之类活动的上限金额（已区分金币和筹码）
     :return: dictAnalyseResult
     */
    let nLineNum = 0;  //当前第几条线
    let nBetSum = 0;

    for (let i in nBetList) {
        nBetSum += nBetList[i];
    }
    // console.log("nGameLines:", nGameLines);
    // 遍历分析每条线
    for (let i = 0; i < nGameLines.length; i++) {
        let nLine = nGameLines[i];
        //# 如果该线有下注
        if (nBetList[i] > 0) {
            let temp = []; //存放此线的花色
            let winCard = -1;//当前线的中奖卡
            let winCardNum = 0;//中奖卡总数
            let nMultiple = 0;//中奖的倍数
            let winline = [];
            for (let j = 0; j < nLine.length; j++) {
                temp.push(nHandCards[nLine[j] - 1]);
            }
            //第一张是否为万能牌
            if (temp[0] != nGameMagicCardIndex) {
                let winLine_normal = [];//普通中奖卡数组
                winCard = temp[0];
                for (let j = 0; j < temp.length; j++) {
                    if (temp[j] == winCard || temp[j] == nGameMagicCardIndex) {
                        winCardNum += 1;
                        winLine_normal.push(nLine[j] - 1);
                    } else {
                        break;
                    }
                }
                if (winCardNum >= nGameLineWinLowerLimitCardNumber) {
                    nMultiple = nGameCombinations[winCard][winCardNum - nGameLineWinLowerLimitCardNumber];
                    winline.push(winLine_normal);
                }
            } else {
                //计算万能牌中奖数
                let winLine_magic = [];

                for (let j = 0; j < temp.length; j++) {
                    if (temp[j] == nGameMagicCardIndex) {
                        winCardNum += 1;
                        winLine_magic.push(nLine[j] - 1);
                    } else {
                        winCard = temp[j];
                        break;
                    }
                }
                if (winCardNum >= nGameLineWinLowerLimitCardNumber) {
                    //万能卡中奖倍率不为0才算中奖
                    if (nGameCombinations[nGameMagicCardIndex][winCardNum - nGameLineWinLowerLimitCardNumber] > 0) {
                        nMultiple = nGameCombinations[nGameMagicCardIndex][winCardNum - nGameLineWinLowerLimitCardNumber];
                        winline.push(winLine_magic);
                    }
                }
                //计算普通牌中奖
                let winLine_normal = [];
                winCardNum = 0;
                for (let j = 0; j < temp.length; j++) {
                    if (temp[j] == winCard || temp[j] == nGameMagicCardIndex) {
                        winCardNum += 1;
                        winLine_normal.push(nLine[j] - 1);
                    } else {
                        break;
                    }
                }
                if (winCard != -1 && winCardNum >= nGameLineWinLowerLimitCardNumber) {
                    nMultiple += nGameCombinations[winCard][winCardNum - nGameLineWinLowerLimitCardNumber];
                    winline.push(winLine_normal);
                }

            }
            //结果统计
            //# 设置中奖金额
            dictAnalyseResult["win"] += nMultiple * nBetList[i];
            //# 设置中奖线数、中奖角标
            if (nMultiple * nBetList[i] > 0) {
                dictAnalyseResult["nWinLines"].push(i);
                dictAnalyseResult["nWinDetail"].push(nMultiple * nBetList[i]);
                dictAnalyseResult["nWinLinesDetail"].push(...winline);
                for (let a in winline) {
                    for (let b in winline[a]) {
                        let c = winline[a][b];
                        dictAnalyseResult["nWinCards"][c] = true;
                    }
                }

            }
        }
        nLineNum += 1;
    }
    //# 开宝箱
    if (nOpenBoxCard > -1) {
        dictAnalyseResult["getOpenBox"] = OpenBoxAnalyse(nHandCards, nOpenBoxCard, nOpenBoxLowerLimit, jackpotUpperLimit)
    }
    //# 获取免费次数
    if (nFreeTimeCard > -1) {
        dictAnalyseResult["getFreeTime"] = FreeTimeAnalyse(nHandCards, nFreeTimeCard, nFreeTimeLowerLimit)
    }
    // # 翻倍（适用于类似阿兹台克类右侧有翻倍显示的游戏）
    if (fGameMultiples.length > 0) {
        var nIndex = RandomNumBoth(0, fGameMultiples.length - 1);
        dictAnalyseResult["fMultiple"] = fGameMultiples[nIndex];
        dictAnalyseResult["win"] *= fGameMultiples[nIndex]

    }
    return dictAnalyseResult;
};

function es6_set(arr) {
    //es6 数组去重
    return Array.from(new Set(arr));
}

function es5_set(arr) {
    //es5 数组去重
    var hash = [];
    for (var i = 0; i < arr.length; i++) {
        if (arr.indexOf(arr[i]) == i) {
            hash.push(arr[i]);
        }
    }
    return hash;
}

function RandomNumBoth(Min, Max) {
    //生成指定范围内随机整数
    var Range = Max - Min;
    var Rand = Math.random();
    var num = Min + Math.round(Rand * Range); //四舍五入
    return num;
}

function RandomNumForList(arr) {
    //从指定数组中选取随机值
    return arr[Math.floor((Math.random() * arr.length))]
}

function randomsort(a, b) {
    //数组随机排序
    //使用方法
    //arr.sort(randomsort)
    return Math.random() > .5 ? -1 : 1; //通过随机产生0到1的数，然后判断是否大于0.5从而影响排序，产生随机性的效果。
}

function curt_list(index, list) {
    //根据索引切割数组
    var new_list = [];
    for (var i = 0; i < list.length; ++i) {
        if (i >= index) {
            new_list.push(list[i])
        }
    }
    return new_list
}

function list_remove(val, list) {
    //数组去除指定元素
    //用法 list.remove(元素)
    var index = list.indexOf(val);
    if (index > -1) {
        list.splice(index, 1);
    }
}

function list_one_count(x, list) {
    //数组中指定值出现次数
    var count = 0;
    for (var i in list) {
        if (list[i] == x) {
            count++
        }
    }

    return count;
}