Ext.data.Types.AUTO = {
  convert: function(value) {
    if(value === undefined || value === null) return undefined;
    return value;
  },
  sortType: Ext.data.SortTypes.none,
  type: 'auto'
};

Ext.data.Types.STRING = {
  convert: function(value) {
    if(value === undefined || value === null) return undefined;
    return String(value);
  },
  sortType: Ext.data.SortTypes.asUCString,
  type: 'string'
};

Ext.data.Types.INT = {
  convert: function(value) {
    if(value === undefined || value === null) return undefined;
    if(value === '') return null;
    return parseInt(String(value).replace(Ext.data.Types.stripRe, ''), 10);
  },
  sortType: Ext.data.SortTypes.none,
  type: 'int'
};

Ext.data.Types.FLOAT = {
  convert: function(value) {
    if(value === undefined || value === null) return undefined;
    if(value === '') return null;
    return parseFloat(String(value).replace(Ext.data.Types.stripRe, ''), 10);
  },
  sortType: Ext.data.SortTypes.none,
  type: 'float'
};

Ext.data.Types.BOOL = {
  convert: function(value) {
    if(value === undefined || value === null) return undefined;
    if(value === '') return null;
    return value === true || value === '1';
  },
  sortType: Ext.data.SortTypes.none,
  type: 'bool'
};

Ext.data.Types.DATE = {
  convert: function(value) {
    if(value === undefined || value === null) return undefined;
    if(value === '') return null;
    return Date.parseDate(value, 'Y/m/d');
  },
  sortType: Ext.data.SortTypes.asDate,
  type: 'date'
};