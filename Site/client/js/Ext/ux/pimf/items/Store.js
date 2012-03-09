Ext.namespace('Ext.ux', 'Ext.ux.pimf', 'Ext.ux.pimf.items');

Ext.ux.pimf.items.Store = Ext.extend(Ext.data.GroupingStore, {

  constructor: function() {

    Ext.ux.pimf.items.Store.superclass.constructor.call(this, {
      storeId: 'ItemStore',
      reader: new Ext.data.JsonReader(),
      autoSave: false
    });

    this.addEvents('remoteload', 'remotenew', 'remoteclone', 'remoteedit', 'remotelink', 'remoteunlink', 'remoteremove');

    Ext.ux.pimf.StoreObserver.create({
      storeId: 'FolderStore',
      scope: this,
      events: ['remotenew', 'remoteedit', 'remotemove', 'remoteremove'],
      listeners: {
        remotenew: function(folderRecord) {

          var folderData = folderRecord.data;

          if(Ext.getCmp('NavigationTree').getSelectedNodeId() === folderData.parentFolderId.toString()) {

            var itemRecord = new this.recordType(folderData, 'folder' + folderData.id.toString());
            itemRecord.set('uid', 'folder' + folderData.id.toString());
            this.addSorted(itemRecord);

          }

          this.commitChanges();

        },
        remoteedit: function(folderRecord) {

          var folderData = folderRecord.data;
          var itemRecord = this.getById('folder' + folderData.id.toString());

          if(itemRecord !== undefined) {

            for(var property in folderData) {
              itemRecord.set(property, folderData[property]);
            }
            itemRecord.set('uid', 'folder' + folderData.id.toString());
            this.sort(this.getSortState().field, this.getSortState().direction);

          }

          this.commitChanges();

        },
        remotemove: function(folderRecords, newParentFolderRecord) {

          for(var folderRecordIndex = 0; folderRecordIndex < folderRecords.length; folderRecordIndex++) {

            var itemRecord = this.getById('folder' + folderRecords[folderRecordIndex].data.id.toString());

            if(itemRecord !== undefined) {

              if(Ext.getCmp('NavigationTree').getSelectedNodeId() === newParentFolderRecord.data.id.toString() || Ext.getCmp('NavigationTree').isSelectedNodeSpecial()) {

                itemRecord.set('parentFolderId', newParentFolderRecord.data.id);

              } else {

                this.remove(itemRecord);

              }

            } else {

              if(Ext.getCmp('NavigationTree').getSelectedNodeId() === newParentFolderRecord.data.id.toString()) {

                itemRecord = new this.recordType(folderRecords[folderRecordIndex].data, 'folder' + folderRecords[folderRecordIndex].data.id.toString());
                itemRecord.set('uid', 'folder' + folderRecords[folderRecordIndex].data.id.toString());
                this.addSorted(itemRecord);

              }

            }

          }

          this.commitChanges();

        },
        remoteremove: function(folderRecords) {

          for(var folderRecordIndex = 0; folderRecordIndex < folderRecords.length; folderRecordIndex++) {

            this.remove(this.getById('folder' + folderRecords[folderRecordIndex].data.id.toString()));

            var itemRecords = this.getRange();
            for(var itemRecordIndex = 0; itemRecordIndex < itemRecords.length; itemRecordIndex++) {
              if(itemRecords[itemRecordIndex].data.type === 'item') {
                itemRecords[itemRecordIndex].set('itemFolderLinks', itemRecords[itemRecordIndex].data.itemFolderLinks.concat([]).remove(folderRecords[folderRecordIndex].data.id));
              }
            }
          }

          this.commitChanges();

        }
      }
    });

    Ext.ux.pimf.StoreObserver.create({
      storeId: 'FreePropertyStore',
      scope: this,
      events: ['add', 'remove', 'update'],
      listeners: {
        add: function(store, records, index) {

          this.remoteReload();

        },
        remove: function(store, records, index) {

          this.remoteReload();

        },
        update: function(store, record, operation) {

          this.remoteReload();

        }
      }
    });

  },

  checkItemsLink: function(sourceItemRecords, targetFolderRecord) {

    if(!Ext.ux.pimf.Connection.locked) {
      return false;
    }

    // All source records have to be an item
    for(var sourceItemRecordIndex = 0; sourceItemRecordIndex < sourceItemRecords.length; sourceItemRecordIndex++) {
      if(sourceItemRecords[sourceItemRecordIndex].data.type !== 'item') {
        return false;
      }
    }

    return true;

  },

  getFolderRecordsOfItemRecords: function(itemRecords) {

    var folderRecords = [];

    for(var itemRecordIndex = 0; itemRecordIndex < itemRecords.length; itemRecordIndex++) {
      folderRecords.push(itemRecords[itemRecordIndex].getFolderRecord());
    }

    return folderRecords;

  },

  remoteLoad: function(data) {

    Ext.ux.pimf.Connection.request({
      action: ['items', 'get'],
      data: data,
      scope: this,
      customSuccess: function(response, options) {

        var colModel = new Ext.grid.ColumnModel([
          {
            header: '',
            dataIndex: '',
            fixed: true,
            menuDisabled: true,
            width: 30
          },
          {
            header: 'Name',
            dataIndex: '',
            fixed: true,
            menuDisabled: true,
            width: 250
          }
        ]);

        this.clearGrouping();

        Ext.getCmp('ItemGrid').reconfigure(this, colModel);

        this.lastOptions = options;

        this.loadData(Ext.util.JSON.decode(response.responseText));

        this.reader.recordType.prototype.getFolderRecord = function() {
          return Ext.StoreMgr.get('FolderStore').getById(this.data.id);
        };
        this.reader.recordType.prototype.getTypeLabel = function() {
          return this.store.typeLabels[this.data.type];
        };
        this.reader.recordType.prototype.getTypeImageFile = function() {
          return this.store.typeImageFiles[this.data.type];
        };
        this.reader.recordType.prototype.getTypePluralLabel = function() {
          return this.store.typePluralLabels[this.data.type];
        };

        var columnsConfig = [
          {
            header: '',
            dataIndex: '',
            fixed: true,
            hidden: false,
            menuDisabled: true,
            width: 30,
            renderer: function(value, metaData, record, rowIndex, colIndex, store) {
              return '<img src="' + record.getTypeImageFile() + '" />';
            }
          },
          {
            header: 'Bild',
            dataIndex: 'image',
            width: 95,
            submenu: 'main',
            renderer: function(value, metaData, record, rowIndex, colIndex, store) {
              return Ext.StoreMgr.get('ImageStore').getTag(value);
            }
          },
          {
            header: 'ID',
            dataIndex: 'id',
            width: 50,
            submenu: 'main'
          },
          {
            header: 'Name',
            dataIndex: 'name',
            width: 400,
            hidden: false,
            submenu: 'main'
          },
          {
            header: 'Typ',
            dataIndex: 'type',
            width: 100,
            submenu: 'main',
            renderer: function(value, metaData, record, rowIndex, colIndex, store) {
              return record.getTypeLabel();
            }
          },
          {
            header: 'Anleitung URL',
            dataIndex: 'manualURL',
            width: 200,
            submenu: 'folderProperties'
          },
          {
            header: 'Homepage URL',
            dataIndex: 'homepageURL',
            width: 200,
            submenu: 'folderProperties'
          }
        ];

        var freeProperties = this.reader.meta.freeProperties;

        Ext.StoreMgr.get('FreePropertyStore').loadData({
          success: true,
          total: freeProperties.length,
          records: freeProperties
        });

        for(var freePropertyIndex = 0; freePropertyIndex < freeProperties.length; freePropertyIndex++) {

          var col = {
            header: freeProperties[freePropertyIndex].name,
            dataIndex: 'freePropertyValue' + freeProperties[freePropertyIndex].id.toString(),
            width: Number(freeProperties[freePropertyIndex].columnWidth),
            submenu: 'freeProperties'
          };

          switch(freeProperties[freePropertyIndex].format) {

            case 'string':
              col.renderer = function(value, metaData, record, rowIndex, colIndex, store) {
                return value === undefined ? '' : value;
              };
              break;

            case 'bool':
              col.renderer = function(value, metaData, record, rowIndex, colIndex, store) {
                return value === undefined || value === null ? '' : (value ? 'Ja' : 'Nein');
              };
              break;

            case 'int':
              col.renderer = function(value, metaData, record, rowIndex, colIndex, store) {
                return value === undefined || value === null ? '' : value.toString();
              };
              break;

            case 'float':
              col.renderer = function(value, metaData, record, rowIndex, colIndex, store) {
                return value === undefined || value === null ? '' : value.toExponential();
              };
              break;

            case 'date':
              col.renderer = function(value, metaData, record, rowIndex, colIndex, store) {
                return value === undefined || value === null ? '' : value.format('d.m.Y');
              };
              break;

          }

          columnsConfig.push(col);

        }

        colModel = new Ext.grid.ColumnModel({
          defaults: {
            editable: false,
            sortable: true,
            hidden: true
          },
          columns: columnsConfig
        });

        Ext.getCmp('ItemGrid').reconfigure(this, colModel);

        this.fireEvent('remoteload', this.getRange());

      }
    });

  },

  remoteReload: function() {

    if(this.lastOptions !== null) {

      this.remoteLoad(Ext.decode(this.lastOptions.params.data));

    }

  },

  remoteNew: function(itemData) {

    Ext.ux.pimf.Connection.request({
      action: ['items', 'create'],
      data: itemData,
      scope: this,
      customSuccess: function(response, options) {

        var itemData = Ext.apply(options.data, {
          id: Ext.util.JSON.decode(response.responseText).id
        });
        var itemRecord;

        if(itemData.itemFolderLinks.indexOf(Number(Ext.getCmp('NavigationTree').getSelectedNodeId())) > -1) {

          itemRecord = new this.reader.recordType(itemData, 'item' + itemData.id.toString());
          itemRecord.set('uid', 'item' + itemData.id.toString());
          itemRecord.set('type', 'item');

          this.addSorted(itemRecord);

        }

        this.resetRuleViolation();
        this.commitChanges();

        this.fireEvent('remotenew', itemRecord);

      }
    });

  },

  remoteClone: function(itemIds, count) {

    Ext.ux.pimf.Connection.request({
      action: ['items', 'clone'],
      data: {
        ids: itemIds,
        count: count
      },
      scope: this,
      customSuccess: function(response, options) {

        var itemIds = options.data.ids;
        var itemRecord;
        var itemRecords = new Array();
        var cloneItemIds = Ext.util.JSON.decode(response.responseText).ids;
        var cloneItemRecord;
        var cloneItemRecords = new Array();

        for(var itemIdIndex = 0; itemIdIndex < itemIds.length; itemIdIndex++) {

          itemRecord = this.getById('item' + itemIds[itemIdIndex].toString());
          cloneItemRecords.push(new Array());

          if(itemRecord.data.itemFolderLinks.indexOf(Number(Ext.getCmp('NavigationTree').getSelectedNodeId())) > -1) {

            for(var cloneItemIdIndex = 0; cloneItemIdIndex < cloneItemIds[itemIdIndex].length; cloneItemIdIndex++) {
              cloneItemRecord = itemRecord.copy('item' + cloneItemIds[itemIdIndex][cloneItemIdIndex].toString());
              cloneItemRecord.set('id', cloneItemIds[itemIdIndex][cloneItemIdIndex]);
              cloneItemRecord.set('uid', 'item' + cloneItemIds[itemIdIndex][cloneItemIdIndex].toString());
              this.addSorted(cloneItemRecord);
              cloneItemRecords[itemIdIndex].push(cloneItemRecord);
            }

          }

          itemRecords.push(itemRecord);

        }

        this.resetRuleViolation();
        this.commitChanges();

        this.fireEvent('remoteclone', itemRecords, cloneItemRecords);

      }
    });

  },

  remoteEdit: function(itemData) {

    Ext.ux.pimf.Connection.request({
      action: ['items', 'update'],
      data: itemData,
      scope: this,
      customSuccess: function(response, options) {

        var itemData = options.data;
        var itemRecord = this.getById('item' + itemData.id.toString());

        if(itemData.itemFolderLinks.indexOf(Number(Ext.getCmp('NavigationTree').getSelectedNodeId())) === -1 && !Ext.getCmp('NavigationTree').isSelectedNodeSpecial()) {

          this.remove(itemRecord);

        } else {

          // FreePropertyValues löschen
          var freePropertyRecords = Ext.StoreMgr.get('FreePropertyStore').getRange();
          for(var freePropertyRecordIndex = 0; freePropertyRecordIndex < freePropertyRecords.length; freePropertyRecordIndex++) {
            itemRecord.set('freePropertyValue' + freePropertyRecords[freePropertyRecordIndex].data.id.toString(), undefined);
          }

          for(var property in itemData) {
            itemRecord.set(property, itemData[property]);
          }

        }

        this.resetRuleViolation();
        this.commitChanges();
        this.sort(this.getSortState().field, this.getSortState().direction);

        this.fireEvent('remoteedit', itemRecord);

      }
    });

  },

  remoteLink: function(itemIds, newLinkFolderId) {

    Ext.ux.pimf.Connection.request({
      action: ['items', 'link'],
      data: {
        ids: itemIds,
        newLinkFolderId: newLinkFolderId
      },
      scope: this,
      customSuccess: function(response, options) {

        var itemIds = options.data.ids;
        var itemRecord;
        var itemRecords = new Array();
        var newLinkFolderId = options.data.newLinkFolderId;
        var newLinkFolderRecord = Ext.StoreMgr.get('FolderStore').getById(newLinkFolderId);

        for(var itemIdIndex = 0; itemIdIndex < itemIds.length; itemIdIndex++) {
          itemRecord = this.getById('item' + itemIds[itemIdIndex].toString());
          if(itemRecord.data.itemFolderLinks.indexOf(newLinkFolderId) === -1) {
            itemRecord.set('itemFolderLinks', itemRecord.data.itemFolderLinks.concat(newLinkFolderId));
          }
          itemRecords.push(itemRecord);
        }

        this.resetRuleViolation();
        this.commitChanges();

        this.fireEvent('remotelink', itemRecords, newLinkFolderRecord);

      }
    });

  },

  remoteUnlink: function(itemIds, oldLinkFolderId) {

    Ext.ux.pimf.Connection.request({
      action: ['items', 'unlink'],
      data: {
        ids: itemIds,
        oldLinkFolderId: oldLinkFolderId
      },
      scope: this,
      customSuccess: function(response, options) {

        var itemIds = options.data.ids;
        var itemRecord;
        var itemRecords = new Array();
        var oldLinkFolderId = options.data.oldLinkFolderId;
        var oldLinkFolderRecord = Ext.StoreMgr.get('FolderStore').getById(oldLinkFolderId);

        for(var itemIdIndex = 0; itemIdIndex < itemIds.length; itemIdIndex++) {
          itemRecord = this.getById('item' + itemIds[itemIdIndex].toString());
          if(Ext.getCmp('NavigationTree').getSelectedNodeId() === oldLinkFolderId.toString()) {
            this.remove(itemRecord);
          } else {
            itemRecord.set('itemFolderLinks', itemRecord.data.itemFolderLinks.concat([]).remove(oldLinkFolderId));
          }
          itemRecords.push(itemRecord);
        }

        this.resetRuleViolation();
        this.commitChanges();

        this.fireEvent('remoteunlink', itemRecords, oldLinkFolderRecord);

      }
    });

  },

  remoteRemove: function(itemIds) {

    Ext.ux.pimf.Connection.request({
      action: ['items', 'delete'],
      data: {
        ids: itemIds
      },
      scope: this,
      customSuccess: function(response, options) {

        var itemIds = options.data.ids;
        var itemRecord;
        var itemRecords = new Array();

        for(var itemIdIndex = 0; itemIdIndex < itemIds.length; itemIdIndex++) {
          itemRecord = this.getById('item' + itemIds[itemIdIndex].toString());
          this.remove(itemRecord);
          itemRecords.push(itemRecord);
        }

        this.resetRuleViolation();
        this.commitChanges();

        this.fireEvent('remoteremove', itemRecords);

      }
    });

  },

  resetRuleViolation: function() {

    var itemRecords = this.getRange();

    for(var itemRecordIndex = 0; itemRecordIndex < itemRecords.length; itemRecordIndex++) {
      if(itemRecords[itemRecordIndex].data.type === 'item') {
        itemRecords[itemRecordIndex].set('ruleViolation', null);
      }
    }

  },

  typeLabels: {
    'item': 'Gegenstand',
    'category': 'Ordner (Kategorie)',
    'experiment': 'Ordner (Versuch)',
    'location': 'Ordner (Ort)',
    'vendor': 'Ordner (Bezugsquelle)'
  },

  typeImageFiles: {
    'item': 'images/led-icons/brick.png',
    'category': 'images/led-icons/book.png',
    'experiment': 'images/experiment.png',
    'location': 'images/led-icons/direction.png',
    'vendor': 'images/led-icons/delivery.png'
  },

  typePluralLabels: {
    'item': 'Gegenstände',
    'category': 'Ordner (Kategorien)',
    'experiment': 'Ordner (Versuche)',
    'location': 'Ordner (Orte)',
    'vendor': 'Ordner (Bezugsquellen)'
  }

});
