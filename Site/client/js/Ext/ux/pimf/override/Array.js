Ext.override(Array, {

  extractProperty: function(property) {

    var properties = [];

    for(var index = 0; index < this.length; index++) {
      properties.push(this[index][property]);
    }

    return properties;

  },

  includeIndex: function() {

    var newArray = [];

    for(var index = 0; index < this.length; index++) {
      newArray.push([index, this[index]]);
    }

    return newArray;

  }

});