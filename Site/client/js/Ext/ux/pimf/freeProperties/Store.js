Ext.namespace('Ext.ux', 'Ext.ux.pimf', 'Ext.ux.pimf.freeProperties');

Ext.ux.pimf.freeProperties.Store = Ext.extend(Ext.data.JsonStore, {

  constructor: function() {

    Ext.ux.pimf.freeProperties.Store.superclass.constructor.call(this, {
      storeId: 'FreePropertyStore',
      autoSave: false,
      fields: [
        {
          name: 'id',
          type: 'int'
        },
        {
          name: 'name',
          type: 'string'
        },
        {
          name: 'format',
          type: 'string'
        },
        {
          name: 'columnWidth',
          type: 'int'
        },
        {
          name: 'unique',
          type: 'bool'
        },
        {
          name: 'mandatory',
          type: 'bool'
        },
        {
          name: 'notEmpty',
          type: 'bool'
        },
        {
          name: 'readOnly',
          type: 'bool'
        },
        {
          name: 'afterToday',
          type: 'bool'
        }
      ],
      root: 'records',
      sortInfo: {
        field: 'name',
        direction: 'ASC'
      }
    });

    this.reader.recordType.prototype.getFormatLabel = function() {
      return this.store.formatLabels[this.data.format];
    };

    this.addEvents('remoteload', 'remotenew', 'remoteedit', 'remoteremove');

  },

  formatLabels: {
    'string': 'Text',
    'bool': 'Wahrheitswert',
    'int': 'Ganzzahl',
    'float': 'Gleitkommazahl',
    'date': 'Datum'
  },

  remoteLoad: function() {

    Ext.ux.pimf.Connection.request({
      action: ['freeProperties', 'get'],
      data: {},
      scope: this,
      customSuccess: function(response, options) {

        this.lastOptions = options;

        this.loadData(Ext.util.JSON.decode(response.responseText));

        this.fireEvent('remoteload', this.getRange());

      }
    });

  },

  remoteReload: function() {

    this.remoteLoad();

  },

  remoteNew: function(freePropertyData) {

    Ext.ux.pimf.Connection.request({
      action: ['freeProperties', 'create'],
      data: freePropertyData,
      scope: this,
      customSuccess: function(response, options) {

        var freePropertyData = Ext.apply(options.data, {
          id: Ext.util.JSON.decode(response.responseText).id
        });
        var freePropertyRecord = new this.reader.recordType(freePropertyData, freePropertyData.id);

        this.addSorted(freePropertyRecord);

        this.fireEvent('remotenew', freePropertyRecord);

      }
    });

  },

  remoteEdit: function(freePropertyData) {

    Ext.ux.pimf.Connection.request({
      action: ['freeProperties', 'update'],
      data: freePropertyData,
      scope: this,
      customSuccess: function(response, options) {

        var freePropertyData = options.data;
        var freePropertyRecord = this.getById(freePropertyData.id);

        for(var property in freePropertyData) {
          freePropertyRecord.set(property, freePropertyData[property]);
        }

        this.commitChanges();
        this.sort(this.getSortState().field, this.getSortState().direction);

        this.fireEvent('remoteedit', freePropertyRecord);

      }
    });

  },

  remoteRemove: function(freePropertyIds) {

    Ext.ux.pimf.Connection.request({
      action: ['freeProperties', 'delete'],
      data: {
        ids: freePropertyIds
      },
      scope: this,
      customSuccess: function(response, options) {

        var freePropertyIds = options.data.ids;
        var freePropertyRecord;
        var freePropertyRecords = new Array();

        for(var freePropertyIdIndex = 0; freePropertyIdIndex < freePropertyIds.length; freePropertyIdIndex++) {
          freePropertyRecord = this.getById(freePropertyIds[freePropertyIdIndex]);
          this.remove(freePropertyRecord);
          freePropertyRecords.push(freePropertyRecord);
        }

        this.commitChanges();

        this.fireEvent('remoteremove', freePropertyRecords);

      }
    });

  },

  ruleLabels: {
    'unique': 'Eindeutig',
    'mandatory': 'Pflichtfeld',
    'notEmpty': 'Nicht leer',
    'readOnly': 'Schreibgeschützt',
    'afterToday': 'Später als Heute'
  }

});
