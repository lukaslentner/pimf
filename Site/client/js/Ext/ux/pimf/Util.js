Ext.namespace('Ext.ux', 'Ext.ux.pimf');

Ext.ux.pimf.Util = function() {};

Ext.ux.pimf.Util.includeKey = function(obj) {

  var newArray = [];

  for(var key in obj) {
    newArray.push([key, obj[key]]);
  }

  return newArray;

};