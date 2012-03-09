Ext.namespace('Ext.ux', 'Ext.ux.pimf', 'Ext.ux.pimf.folders');

Ext.ux.pimf.folders.Store = Ext.extend(Ext.data.JsonStore, {

  constructor: function() {

    Ext.ux.pimf.folders.Store.superclass.constructor.call(this, {
      storeId: 'FolderStore',
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
          name: 'parentFolderId',
          type: 'int'
        },
        {
          name: 'description',
          type: 'string'
        },
        {
          name: 'type',
          type: 'string'
        },
        {
          name: 'manualURL',
          type: 'string'
        },
        {
          name: 'homepageURL',
          type: 'string'
        },
        {
          name: 'image',
          type: 'int'
        }
      ],
      root: 'records'
    });

    this.reader.recordType.prototype.getTypeLabel = function() {
      return this.store.typeLabels[this.data.type];
    };
    this.reader.recordType.prototype.getTypeImageFile = function() {
      return this.store.typeImageFiles[this.data.type];
    };
    this.reader.recordType.prototype.getTypePluralLabel = function() {
      return this.store.typePluralLabels[this.data.type];
    };
    this.reader.recordType.prototype.getAllChildren = function() {

      var getAllChildrenR = function(folderRecord, handler, allChildFolderRecords) {

        var childFolderRecords = Ext.StoreMgr.get('FolderStore').query('parentFolderId', new RegExp('^' + folderRecord.data.id.toString() + '$'), true, true);

        childFolderRecords.each(function(childFolderRecord, index, length) {

          this.allChildFolderRecords.push(childFolderRecord);
          this.handler(childFolderRecord, this.handler, this.allChildFolderRecords);

        }, {
         allChildFolderRecords: allChildFolderRecords,
         handler: handler
        });

      };

      var allChildFolderRecords = [];

      getAllChildrenR(this, getAllChildrenR, allChildFolderRecords);

      return allChildFolderRecords;

    };
    this.reader.recordType.prototype.getPath = function() {

      var getPathR = function(folderRecord, handler) {

        if(folderRecord.data.parentFolderId === 0) {
          return '/' + folderRecord.data.name;
        }

        var parentFolderRecord = Ext.StoreMgr.get('FolderStore').getById(folderRecord.data.parentFolderId);

        return handler(parentFolderRecord, handler) + '/' + folderRecord.data.name;

      };

      return getPathR(this, getPathR);

    };

    this.addEvents('remoteload', 'remotenew', 'remoteclone', 'remoteedit', 'remotemove', 'remoteremove');

  },

  checkFoldersMove: function(sourceFolderRecords, targetFolderRecord) {

    if(!Ext.ux.pimf.Connection.locked) {
      return false;
    }

    for(var sourceFolderRecordIndex = 0; sourceFolderRecordIndex < sourceFolderRecords.length; sourceFolderRecordIndex++) {

      // Source folders must have same type as target folder
      if(sourceFolderRecords[sourceFolderRecordIndex].data.type !== targetFolderRecord.data.type) {
        return false;
      }

      // Source folders must not be target folder
      if(sourceFolderRecords[sourceFolderRecordIndex] === targetFolderRecord) {
        return false;
      }

      // Moving of main folders is not allowed
      if(sourceFolderRecords[sourceFolderRecordIndex].data.parentFolderId === 0) {
        return false;
      }

      // You can't move a folder in it's (grand...) child
      if(sourceFolderRecords[sourceFolderRecordIndex].getAllChildren().indexOf(targetFolderRecord) > -1) {
        return false;
      }

    }

    return true;

  },

  isFolderType: function(type) {

    return type === 'category' || type === 'experiment' || type === 'location' || type === 'vendor';

  },

  typeImageFiles: {
    'category': 'led-icons/book.png',
    'experiment': 'experiment.png',
    'location': 'led-icons/direction.png',
    'vendor': 'led-icons/delivery.png'
  },

  typeLabels: {
    'category': 'Ordner (Kategorie)',
    'experiment': 'Ordner (Versuch)',
    'location': 'Ordner (Ort)',
    'vendor': 'Ordner (Bezugsquelle)'
  },

  typePluralLabels: {
    'category': 'Ordner (Kategorien)',
    'experiment': 'Ordner (Versuche)',
    'location': 'Ordner (Orte)',
    'vendor': 'Ordner (Bezugsquellen)'
  },

  remoteLoad: function() {

    Ext.ux.pimf.Connection.request({
      action: ['folders', 'get'],
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

  remoteNew: function(folderData) {

    Ext.ux.pimf.Connection.request({
      action: ['folders', 'create'],
      data: folderData,
      scope: this,
      customSuccess: function(response, options) {

        var folderData = Ext.apply(options.data, {
          id: Ext.util.JSON.decode(response.responseText).id
        });
        var folderRecord = new this.reader.recordType(folderData, folderData.id);

        this.add(folderRecord);

        this.fireEvent('remotenew', folderRecord);

      }
    });

  },

  remoteClone: function(folderIds, count) {

    Ext.ux.pimf.Connection.request({
      action: ['folders', 'clone'],
      data: {
        ids: folderIds,
        count: count
      },
      scope: this,
      customSuccess: function(response, options) {

        this.remoteLoad();

        this.fireEvent('remoteclone');

      }
    });

  },

  remoteEdit: function(folderData) {

    Ext.ux.pimf.Connection.request({
      action: ['folders', 'update'],
      data: folderData,
      scope: this,
      customSuccess: function(response, options) {

        var folderData = options.data;
        var folderRecord = this.getById(folderData.id);

        for(var property in folderData) {
          folderRecord.set(property, folderData[property]);
        }

        this.commitChanges();

        this.fireEvent('remoteedit', folderRecord);

      }
    });

  },

  remoteMove: function(folderIds, newParentFolderId) {

    Ext.ux.pimf.Connection.request({
      action: ['folders', 'move'],
      data: {
        ids: folderIds,
        newParentFolderId: newParentFolderId
      },
      scope: this,
      customSuccess: function(response, options) {

        var folderIds = options.data.ids;
        var folderRecord;
        var folderRecords = new Array();
        var newParentFolderId = options.data.newParentFolderId;
        var newParentFolderRecord = this.getById(newParentFolderId);

        for(var folderIdIndex = 0; folderIdIndex < folderIds.length; folderIdIndex++) {
          folderRecord = this.getById(folderIds[folderIdIndex]);
          folderRecord.set('parentFolderId', newParentFolderId);
          folderRecords.push(folderRecord);
        }

        this.commitChanges();

        this.fireEvent('remotemove', folderRecords, newParentFolderRecord);

      }
    });

  },

  remoteRemove: function(folderIds) {

    Ext.ux.pimf.Connection.request({
      action: ['folders', 'delete'],
      data: {
        ids: folderIds
      },
      scope: this,
      customSuccess: function(response, options) {

        var folderIds = options.data.ids;
        var folderRecord;
        var folderRecords = new Array();

        for(var folderIdIndex = 0; folderIdIndex < folderIds.length; folderIdIndex++) {
          folderRecord = this.getById(folderIds[folderIdIndex]);
          this.remove(folderRecord);
          folderRecords.push(folderRecord);
        }

        this.commitChanges();

        this.fireEvent('remoteremove', folderRecords);

      }
    });

  }

});
