<?php

// Get rid of the stupid "magicQuotes"
if(get_magic_quotes_gpc()) {
  function magicQuotes_awStripslashes(&$value, $key) { $value = stripslashes($value); }
  $gpc = array(&$_GET, &$_POST, &$_COOKIE, &$_REQUEST);
  array_walk_recursive($gpc, 'magicQuotes_awStripslashes');
}

require_once('../config.php');

//Error Handling

//define("ERROR_HANDLER_STRING","<b>Error!</b> ");

//define("ERROR_CLASS_400","<b>Error!</b> ");

//define("ERROR_CLASS_500","<b>Error!</b> ");

//MYSQL-Variables

define("MYSQL_CONNECTIONERROR", "Die Verbindung zum Datenbank-Server konnte nicht hergestellt werden! Kontaktieren Sie den Systemadministrator.");

define("MYSQL_SELECTDBERROR", "Die angeforderte Datenbank wurde nicht gefunden! Kontaktieren Sie den Systemadministrator.");

define("MYSQL_QUERYERROR", "Die gestellte Datenbank-Anfrage konnte nicht ausgeführt werden! Kontaktieren Sie den Systemadministrator.");

//define("MYSQL_MYSQL_QUERYERROR", "Error querying database. Please try again. If you receive this message again please contact an admin.");

//JSON-Variables

define("JSON_NO_LOGIN", "Die Server-Anfrage enthält keine Authentifizierungsinformationen! Kontaktieren Sie den Systemadministrator.");

define("JSON_NO_CALL", "Die Server-Anfrage ist leer! Kontaktieren Sie den Systemadministrator.");

define("JSON_INCORRECT_STRING", "Die Server-Anfrage ist kein valides JSON! Kontaktieren Sie den Systemadministrator.");

define("JSON_NO_ARRAY", "Die Server-Anfrage enthält kein Datenobjekt! Kontaktieren Sie den Systemadministrator.");

define("JSON_WRONG_CALL_FORMAT","Die Server-Anfrage entspricht nicht dem korrekten Format! Kontaktieren Sie den Systemadministrator.");

//User-Variables

define("USER_WRONG_FORMAT","Die gesendete Autentifizierungsinformation entspricht nicht dem korrekten Format! Kontaktieren Sie den Systemadministrator.");

define("USER_NOT_EXIST","Der angegebene Benutzer existiert nicht!");

define("USER_AUTH_WRONG","Das angegebene Passwort stimmt nicht mit dem Datenbank-Wert überein!");

define("USER_NO_PRIVELEGE","Der Benutzer besitzt nicht die notwendigen Rechte diese Aktion auszuführen!");

define("USER_NO_PRIVELEGE_NO_LOCK","Diese Aktion erfordert Schreibrechte!");

define("USER_NAME","Der angegebene Benutzername ist schon vergeben oder entspricht nicht dem korrekten Format!");

define("USER_PASSWORD","Geben Sie ein Passwort ein!");

//Image-Variables

define("IMAGE_TYPE","Dieser Bildertyp wird nicht unterstützt!");

define("IMAGE_ERROR","Während des Hochladens des Bildes ist ein unbekannter Fehler aufgetreten!");

define("IMAGE_EXISTS","Es existiert bereits ein Bild mit der (eigentlich) neuen ID! Versuchen Sie es nocheinmal und kontaktieren Sie den Systemadministrator.");

define("IMAGE_NOT_EXISTS","Das angegebene Bild existiert nicht! Kontaktieren Sie den Systemadministrator.");

define("IMAGE_DELETE_EXISTS","Das angebene Bild kann nicht gelöscht werden, da es nicht existiert! Kontaktieren Sie den Systemadministrator.");

define("IMAGE_MAX_SIZE",3000000);

define("IMAGE_SIZE","Das Bild ist zu groß (".IMAGE_MAX_SIZE." Bytes)!");

define("IMAGE_LINKED", "Das angegebene Bild kann nicht gelöscht werden, da es noch in Verwendung ist!");

//Lock-Variables

define("LOCK_ALREADY_LOCKED_FIRST","Zur Zeit hält der folgende Benutzer die Schreibrechte an der Datenbank: ");

define("LOCK_ALREADY_LOCKED_SECOND"," Warten Sie bis er diese wieder freigibt und/oder setzten Sie sich mit ihm in Verbindung!");

//define("LOCK_UNLOCK_ERROR_FIRST","Can not unlock lock of user: ");

//define("LOCK_UNLOCK_ERROR_SECOND"," Only that user or an admin may unlock the database.");



//Other

define("OTHER_FREEPROPERTYVALUE_EXISTS","Sie können diese freie Eigenschaft nicht löschen, da sie noch von Gegenständen verwendet wird!");

define("OTHER_FREEPROPERTYNAME_EXISTS","Der angebene Name für eine freie Eigenschaft existiert bereits!");

define("OTHER_FOLDER_ZERO","Sie können keine Hauptordner löschen!");

define("OTHER_FOLDER_NOT_EXIST","Der angebene Ordner existiert nicht!");

define("OTHER_FOLDER_ZERO_MOVE","Sie können keine Ordner auf die/von der Hauptebene verschieben!");

define("OTHER_MOVE_TYPE","Sie können Ordner nur innerhalb ihres Typs verschieben!");

define("OTHER_MOVE_FAMILY","Sie können einen Ordner nich nicht in einen seiner Unterordner verschieben!");

define("OTHER_FOLDER_ZERO_CLONE","Sie können Hauptordner nicht klonen!");

//not that bad... todo
//define("OTHER_LINK_EXIST","Can not perform this action, because one of the items is already linked with that folder."); 

//define("OTHER_UNLINK_EXIST","Can not perform this action, because at least of the items is not linked with that folder.");

define("OTHER_READ_ONLY","Die freie Eigenschaft kann nur von Administratoren geändert werden, da sie als schreibgeschützt definiert ist!");

define("OTHER_CLONE_NOT_EXIST","Der zu klonende Gegenstand existiert nicht!");

define("OTHER_ITEM_PROP_NOT_EXIST","Die freie Eigenschaft existiert nicht!");

define("OTHER_ITEM_FOLDER_NOT_EXIST","Der Ordner existiert nicht!");

define("OTHER_ITEM_NOT_EXIST","Der Gegenstand existiert nicht!");

define("OTHER_CLONE_LOCATION","Sie können nur Ordner vom Typ Ort klonen!");
?>
