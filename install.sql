/*
 Navicat Premium Data Transfer

 Source Server         : 1
 Source Server Type    : MySQL
 Source Server Version : 50726 (5.7.26)
 Source Host           : localhost:3306
 Source Schema         : test

 Target Server Type    : MySQL
 Target Server Version : 50726 (5.7.26)
 File Encoding         : 65001

 Date: 10/12/2024 15:35:50
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for app
-- ----------------------------
DROP TABLE IF EXISTS `app`;
CREATE TABLE `app`  (
  `app_id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'ID\r\n',
  `app_uuid` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT 'UUID 用于加密通讯',
  `app_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '名称',
  `app_logo` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT 'logo',
  `app_description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL COMMENT '描述',
  `app_state` enum('on','off') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT 'on' COMMENT 'APP开关',
  `app_off_msg` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL COMMENT 'APP关闭消息',
  `reg_state` enum('on','off') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT 'on' COMMENT '注册开关',
  `reg_off_msg` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL COMMENT '注册关闭消息',
  `reg_time_sn` int(13) NULL DEFAULT 86400000 COMMENT '机器码注册间隔时间',
  `reg_time_ip` int(13) UNSIGNED NULL DEFAULT 86400000 COMMENT 'IP注册间隔时间',
  `reg_award` enum('vip','fen') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT 'vip' COMMENT '注册奖励类型',
  `reg_award_val` int(13) UNSIGNED NULL DEFAULT 604800000 COMMENT '注册奖励：vip/毫秒 1000*60*60*24*7',
  `logon_state` enum('on','off') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT 'on' COMMENT '登录开关',
  `logon_off_msg` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL COMMENT '登录关闭消息',
  `logon_token_exp` int(13) NULL DEFAULT 3600000 COMMENT '用户token过期时间',
  `logon_sn_dk` enum('on','off') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT 'off' COMMENT '用户设备多开',
  `logon_sn_num` int(2) NULL DEFAULT 2 COMMENT '登录最大设备数',
  `logon_sn_unbdeType` enum('vip','fen') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT 'vip' COMMENT '解绑扣除类型',
  `logon_sn_unbdeVal` int(13) UNSIGNED NULL DEFAULT 3600000 COMMENT '解绑扣除值 vip/毫秒',
  `invitee_award` enum('vip','fen') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT 'vip' COMMENT '受邀者奖励类型',
  `invitee_award_val` int(13) NULL DEFAULT 604800000 COMMENT '受邀者奖励：vip/毫秒',
  `inviter_award` enum('vip','fen') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT 'vip' COMMENT '邀请人奖励',
  `inviter_award_val` int(13) UNSIGNED ZEROFILL NULL DEFAULT 0000604800000 COMMENT '邀请人奖励：vip/毫秒',
  `diary_award` enum('vip','fen') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT 'fen' COMMENT '签到奖励类型',
  `diary_award_val` int(13) NULL DEFAULT 10 COMMENT '签到奖励：vip/毫秒',
  `smtp_state` enum('on','off') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT 'off' COMMENT '发信状态',
  `smtp_host` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '邮箱服务器',
  `smtp_user` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NULL DEFAULT NULL COMMENT '邮箱账户',
  `smtp_pass` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '邮箱密码',
  `smtp_port` int(6) NULL DEFAULT 465 COMMENT '邮箱端口',
  `vc_time` int(2) NULL DEFAULT 10 COMMENT '验证码有效期 / 分钟',
  `vc_length` int(1) UNSIGNED NULL DEFAULT 4 COMMENT '验证码长度',
  PRIMARY KEY (`app_id`) USING BTREE
) ENGINE = MyISAM AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user`  (
  `uid` int(11) NOT NULL AUTO_INCREMENT,
  `appid` int(11) NULL DEFAULT NULL COMMENT 'APP ID',
  `uuid` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT 'UUID',
  `account` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '账号',
  `password` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '密码 SHA256',
  `avatars` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '头像',
  `vip` int(13) NULL DEFAULT 0 COMMENT 'VIP',
  `fen` int(13) NULL DEFAULT 0 COMMENT '分',
  `inviter_uid` int(36) NULL DEFAULT NULL COMMENT '邀请人ID',
  `reg_time` int(13) NULL DEFAULT NULL COMMENT '注册时间',
  `reg_ip` varchar(15) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '注册IP',
  `reg_sn` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '注册机器码',
  `sn_list` json NULL COMMENT '当前账号机器码',
  `ban` enum('on','off') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT 'off' COMMENT '封禁',
  `ban_msg` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '封禁理由',
  PRIMARY KEY (`uid`) USING BTREE
) ENGINE = MyISAM AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

SET FOREIGN_KEY_CHECKS = 1;
