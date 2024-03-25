/*
Navicat MySQL Data Transfer

Source Server         : 192.168.1.117
Source Server Version : 50553
Source Host           : localhost:3306
Source Database       : la_ba

Target Server Type    : MYSQL
Target Server Version : 50553
File Encoding         : 65001

Date: 2019-05-16 17:48:35
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for `gambling_game_list`
-- ----------------------------
DROP TABLE IF EXISTS `gambling_game_list`;
CREATE TABLE `gambling_game_list` (
  `nGameID` int(10) unsigned NOT NULL COMMENT '游戏id',
  `strGameName` varchar(255) CHARACTER SET utf8mb4 NOT NULL,
  `nGameType` int(5) NOT NULL,
  `nGamblingWaterLevelGold` int(10) NOT NULL COMMENT '水位值(百分比)',
  `nGamblingBalanceGold` bigint(20) NOT NULL COMMENT '水位库存',
  `nGamblingWinPool` bigint(20) NOT NULL DEFAULT '0' COMMENT '奖池',
  `nGamblingUpdateBalanceGold` bigint(20) NOT NULL COMMENT '修改库存值(累计)',
  `nGamblingBigWinLevel` varchar(200) NOT NULL COMMENT '大奖幸运等级(千分概率)',
  `nGamblingBigWinLuck` varchar(200) CHARACTER SET ucs2 NOT NULL COMMENT '大奖幸运概率(百分概率)',
  PRIMARY KEY (`nGameID`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of gambling_game_list
-- ----------------------------
INSERT INTO `gambling_game_list` VALUES ('100', 'jing ling nv wang', '0', '20', '6067', '557', '0', '10,5,1', '1,5,10');
INSERT INTO `gambling_game_list` VALUES ('101', 'wan sheng jie', '0', '20', '10880', '3570', '0', '10,5,1', '1,5,10');
INSERT INTO `gambling_game_list` VALUES ('102', 'zu qiu ', '0', '20', '40', '160', '0', '10,5,1', '1,5,10');
INSERT INTO `gambling_game_list` VALUES ('501', 'jin cai shen', '0', '20', '0', '0', '0', '10,5,1', '1,5,10');
INSERT INTO `gambling_game_list` VALUES ('105', 'shui guo ji', '0', '0', '0', '8015', '0', '10,5,1', '1,5,10');
INSERT INTO `gambling_game_list` VALUES ('1000', 'xi you zheng ba', '0', '0', '0', '0', '0', '10,5,1', '1,5,10');
INSERT INTO `gambling_game_list` VALUES ('135', 'zuan shi', '0', '20', '0', '0', '0', '10,5,1', '1,5,10');
INSERT INTO `gambling_game_list` VALUES ('136', 'ai ji zhen bao', '0', '20', '0', '0', '0', '10,5,1', '1,5,10');
INSERT INTO `gambling_game_list` VALUES ('1001', 'xi you zheng ba 2', '0', '0', '0', '0', '0', '10,5,1', '1,5,10');
INSERT INTO `gambling_game_list` VALUES ('115', 'san jiao mo zhen', '0', '20', '0', '0', '0', '10,5,1', '1,5,10');
INSERT INTO `gambling_game_list` VALUES ('301', 'russian_roulette', '0', '0', '0', '0', '0', '10,5,1', '1,5,10');

-- ----------------------------
-- Table structure for `lotterylog`
-- ----------------------------
DROP TABLE IF EXISTS `lotterylog`;
CREATE TABLE `lotterylog` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userid` int(20) NOT NULL,
  `bet` int(20) NOT NULL,
  `line_s` int(2) NOT NULL,
  `score_before` int(20) NOT NULL,
  `score_linescore` int(20) NOT NULL,
  `score_win` int(20) NOT NULL,
  `score_current` int(20) NOT NULL,
  `free_count_before` int(4) NOT NULL,
  `free_count_win` int(4) NOT NULL,
  `free_count_current` int(4) NOT NULL,
  `result_array` char(30) DEFAULT NULL,
  `lotteryTime` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `mark` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=282383 DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of lotterylog
-- ----------------------------

-- ----------------------------
-- Table structure for `lotterylog_1000`
-- ----------------------------
DROP TABLE IF EXISTS `lotterylog_1000`;
CREATE TABLE `lotterylog_1000` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userid` int(20) NOT NULL,
  `bet` int(20) NOT NULL,
  `line_s` int(2) NOT NULL,
  `score_before` int(20) NOT NULL,
  `score_linescore` int(20) NOT NULL,
  `score_win` int(20) NOT NULL,
  `score_current` int(20) NOT NULL,
  `free_count_before` int(4) NOT NULL,
  `free_count_win` int(4) NOT NULL,
  `free_count_current` int(4) NOT NULL,
  `result_array` char(30) DEFAULT NULL,
  `lotteryTime` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `mark` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=282524 DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of lotterylog_1000
-- ----------------------------

-- ----------------------------
-- Table structure for `lotterylog_1001`
-- ----------------------------
DROP TABLE IF EXISTS `lotterylog_1001`;
CREATE TABLE `lotterylog_1001` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userid` int(20) NOT NULL,
  `bet` int(20) NOT NULL,
  `line_s` int(2) NOT NULL,
  `score_before` int(20) NOT NULL,
  `score_linescore` int(20) NOT NULL,
  `score_win` int(20) NOT NULL,
  `score_current` int(20) NOT NULL,
  `free_count_before` int(4) NOT NULL,
  `free_count_win` int(4) NOT NULL,
  `free_count_current` int(4) NOT NULL,
  `result_array` char(30) DEFAULT NULL,
  `lotteryTime` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `mark` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=282524 DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of lotterylog_1001
-- ----------------------------

-- ----------------------------
-- Table structure for `lotterylog_101`
-- ----------------------------
DROP TABLE IF EXISTS `lotterylog_101`;
CREATE TABLE `lotterylog_101` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userid` int(20) NOT NULL,
  `bet` int(20) NOT NULL,
  `line_s` int(2) NOT NULL,
  `score_before` int(20) NOT NULL,
  `score_linescore` int(20) NOT NULL,
  `score_win` int(20) NOT NULL,
  `score_current` int(20) NOT NULL,
  `free_count_before` int(4) NOT NULL,
  `free_count_win` int(4) NOT NULL,
  `free_count_current` int(4) NOT NULL,
  `result_array` char(30) DEFAULT NULL,
  `lotteryTime` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `mark` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=282347 DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of lotterylog_101
-- ----------------------------

-- ----------------------------
-- Table structure for `lotterylog_102`
-- ----------------------------
DROP TABLE IF EXISTS `lotterylog_102`;
CREATE TABLE `lotterylog_102` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userid` int(20) NOT NULL,
  `bet` int(20) NOT NULL,
  `line_s` int(2) NOT NULL,
  `score_before` int(20) NOT NULL,
  `score_linescore` int(20) NOT NULL,
  `score_win` int(20) NOT NULL,
  `score_current` int(20) NOT NULL,
  `free_count_before` int(4) NOT NULL,
  `free_count_win` int(4) NOT NULL,
  `free_count_current` int(4) NOT NULL,
  `result_array` char(30) DEFAULT NULL,
  `lotteryTime` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `mark` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=282459 DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of lotterylog_102
-- ----------------------------

-- ----------------------------
-- Table structure for `lotterylog_105`
-- ----------------------------
DROP TABLE IF EXISTS `lotterylog_105`;
CREATE TABLE `lotterylog_105` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userid` int(20) NOT NULL,
  `bet` int(20) NOT NULL,
  `line_s` int(2) NOT NULL,
  `score_before` int(20) NOT NULL,
  `score_linescore` int(20) NOT NULL,
  `score_win` int(20) NOT NULL,
  `score_current` int(20) NOT NULL,
  `free_count_before` int(4) NOT NULL,
  `free_count_win` int(4) NOT NULL,
  `free_count_current` int(4) NOT NULL,
  `result_array` char(30) DEFAULT NULL,
  `lotteryTime` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `mark` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=282749 DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of lotterylog_105
-- ----------------------------

-- ----------------------------
-- Table structure for `lotterylog_115`
-- ----------------------------
DROP TABLE IF EXISTS `lotterylog_115`;
CREATE TABLE `lotterylog_115` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userid` int(20) NOT NULL,
  `bet` int(20) NOT NULL,
  `line_s` int(2) NOT NULL,
  `score_before` int(20) NOT NULL,
  `score_linescore` int(20) NOT NULL,
  `score_win` int(20) NOT NULL,
  `score_current` int(20) NOT NULL,
  `free_count_before` int(4) NOT NULL,
  `free_count_win` int(4) NOT NULL,
  `free_count_current` int(4) NOT NULL,
  `result_array` char(30) DEFAULT NULL,
  `lotteryTime` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `mark` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=282592 DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of lotterylog_115
-- ----------------------------

-- ----------------------------
-- Table structure for `lotterylog_135`
-- ----------------------------
DROP TABLE IF EXISTS `lotterylog_135`;
CREATE TABLE `lotterylog_135` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userid` int(20) NOT NULL,
  `bet` int(20) NOT NULL,
  `line_s` int(2) NOT NULL,
  `score_before` int(20) NOT NULL,
  `score_linescore` int(20) NOT NULL,
  `score_win` int(20) NOT NULL,
  `score_current` int(20) NOT NULL,
  `free_count_before` int(4) NOT NULL,
  `free_count_win` int(4) NOT NULL,
  `free_count_current` int(4) NOT NULL,
  `result_array` char(30) DEFAULT NULL,
  `lotteryTime` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `mark` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=282592 DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of lotterylog_135
-- ----------------------------

-- ----------------------------
-- Table structure for `lotterylog_136`
-- ----------------------------
DROP TABLE IF EXISTS `lotterylog_136`;
CREATE TABLE `lotterylog_136` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userid` int(20) NOT NULL,
  `bet` int(20) NOT NULL,
  `line_s` int(2) NOT NULL,
  `score_before` int(20) NOT NULL,
  `score_linescore` int(20) NOT NULL,
  `score_win` int(20) NOT NULL,
  `score_current` int(20) NOT NULL,
  `free_count_before` int(4) NOT NULL,
  `free_count_win` int(4) NOT NULL,
  `free_count_current` int(4) NOT NULL,
  `result_array` char(30) DEFAULT NULL,
  `lotteryTime` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `mark` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=282592 DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of lotterylog_136
-- ----------------------------

-- ----------------------------
-- Table structure for `lotterylog_301`
-- ----------------------------
DROP TABLE IF EXISTS `lotterylog_301`;
CREATE TABLE `lotterylog_301` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userid` int(20) NOT NULL,
  `bet` int(20) NOT NULL,
  `line_s` int(2) NOT NULL,
  `score_before` int(20) NOT NULL,
  `score_linescore` int(20) NOT NULL,
  `score_win` int(20) NOT NULL,
  `score_current` int(20) NOT NULL,
  `free_count_before` int(4) NOT NULL,
  `free_count_win` int(4) NOT NULL,
  `free_count_current` int(4) NOT NULL,
  `result_array` char(30) DEFAULT NULL,
  `lotteryTime` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `mark` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=282592 DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of lotterylog_301
-- ----------------------------

-- ----------------------------
-- Table structure for `lotterylog_501`
-- ----------------------------
DROP TABLE IF EXISTS `lotterylog_501`;
CREATE TABLE `lotterylog_501` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userid` int(20) NOT NULL,
  `bet` int(20) NOT NULL,
  `line_s` int(2) NOT NULL,
  `score_before` int(20) NOT NULL,
  `score_linescore` int(20) NOT NULL,
  `score_win` int(20) NOT NULL,
  `score_current` int(20) NOT NULL,
  `free_count_before` int(4) NOT NULL,
  `free_count_win` int(4) NOT NULL,
  `free_count_current` int(4) NOT NULL,
  `result_array` char(30) DEFAULT NULL,
  `lotteryTime` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `mark` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=282592 DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of lotterylog_501
-- ----------------------------

-- ----------------------------
-- Table structure for `scoretotal`
-- ----------------------------
DROP TABLE IF EXISTS `scoretotal`;
CREATE TABLE `scoretotal` (
  `serve_id` int(3) NOT NULL,
  `winScoreTotal` float NOT NULL,
  `lotteryTotal` int(20) NOT NULL,
  `updateTime` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`serve_id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of scoretotal
-- ----------------------------

-- ----------------------------
-- Table structure for `scoretotallog`
-- ----------------------------
DROP TABLE IF EXISTS `scoretotallog`;
CREATE TABLE `scoretotallog` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `serve_id` int(11) NOT NULL,
  `winscore` float DEFAULT NULL,
  `lotteryCount` int(20) DEFAULT NULL,
  `CreateTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=2188 DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of scoretotallog
-- ----------------------------

-- ----------------------------
-- Table structure for `score_pool`
-- ----------------------------
DROP TABLE IF EXISTS `score_pool`;
CREATE TABLE `score_pool` (
  `id` int(11) NOT NULL,
  `score_pool` bigint(11) NOT NULL DEFAULT '0',
  `change_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of score_pool
-- ----------------------------

-- ----------------------------
-- Table structure for `useraccounts`
-- ----------------------------
DROP TABLE IF EXISTS `useraccounts`;
CREATE TABLE `useraccounts` (
  `Id` int(11) NOT NULL,
  `freeCount` int(10) NOT NULL DEFAULT '0',
  `AddDate` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '创建时间',
  `LotteryCount` int(11) NOT NULL DEFAULT '0',
  `nFreeIndex` varchar(200) DEFAULT '',
  PRIMARY KEY (`Id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of useraccounts
-- ----------------------------
