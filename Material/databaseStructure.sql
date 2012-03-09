CREATE DATABASE IF NOT EXISTS `PIMF`;
USE `PIMF`;

DROP TABLE IF EXISTS `Folders`;
CREATE TABLE `Folders` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `parentFolderId` int(10) unsigned NOT NULL,
  `type` varchar(255) NOT NULL,
  `manualURL` varchar(255) NOT NULL,
  `homepageURL` varchar(255) NOT NULL,
  `image` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  FULLTEXT KEY `name` (`name`),
  FULLTEXT KEY `description` (`description`),
  FULLTEXT KEY `typeData` (`manualURL`)
) ENGINE=MyISAM AUTO_INCREMENT=0 DEFAULT CHARSET=utf8;

INSERT INTO `Folders` VALUES (1,'Kategorien','',0,'category','','',0),(2,'Versuche','',0,'experiment','','',0),(3,'Orte','',0,'location','','',0),(4,'Bezugsquellen','',0,'vendor','','',0);

DROP TABLE IF EXISTS `ItemFolderLinks`;
CREATE TABLE `ItemFolderLinks` (
  `itemId` int(10) unsigned NOT NULL,
  `folderId` int(10) unsigned NOT NULL,
  PRIMARY KEY (`itemId`,`folderId`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `Users`;
CREATE TABLE `Users` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL COMMENT 'Uses SHA-1',
  `role` int(10) unsigned NOT NULL COMMENT '0=Leser, 1=Editor, 2=Admin',
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=MyISAM AUTO_INCREMENT=0 DEFAULT CHARSET=utf8;

INSERT INTO `Users` VALUES (1, 'root', SHA1('root'), 2);

DROP TABLE IF EXISTS `Items`;
CREATE TABLE `Items` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `image` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  FULLTEXT KEY `name` (`name`),
  FULLTEXT KEY `description` (`description`)
) ENGINE=MyISAM AUTO_INCREMENT=0 DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `Misc`;
CREATE TABLE `Misc` (
  `lock` int(10) unsigned NOT NULL COMMENT 'userid from user that has locked the db',
  `version` int(10) unsigned NOT NULL COMMENT 'current version numer'
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

INSERT INTO `Misc` VALUES (0,0);

DROP TABLE IF EXISTS `FreeProperties`;
CREATE TABLE `FreeProperties` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `format` varchar(10) NOT NULL COMMENT 'string, bool, int, float or date',
  `columnWidth` varchar(255) NOT NULL,
  `mandatory` tinyint(1) NOT NULL,
  `unique` tinyint(1) NOT NULL,
  `notEmpty` tinyint(1) NOT NULL,
  `readOnly` tinyint(1) NOT NULL,
  `afterToday` tinyint(4) NOT NULL,
  PRIMARY KEY (`id`),
  FULLTEXT KEY `name` (`name`)
) ENGINE=MyISAM AUTO_INCREMENT=0 DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `Images`;
CREATE TABLE `Images` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=0 DEFAULT CHARSET=latin1;

DROP TABLE IF EXISTS `FreePropertyValues`;
CREATE TABLE `FreePropertyValues` (
  `itemId` int(10) unsigned NOT NULL,
  `freePropertyId` int(10) unsigned NOT NULL,
  `value` text NOT NULL,
  PRIMARY KEY (`itemId`,`freePropertyId`),
  FULLTEXT KEY `value` (`value`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;