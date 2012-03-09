Ext.namespace('Ext.ux', 'Ext.ux.pimf', 'Ext.ux.pimf.items');

Ext.ux.pimf.items.PropertyView = Ext.extend(Ext.Panel, {

  constructor: function() {

    Ext.ux.pimf.items.PropertyView.superclass.constructor.call(this, {
      id: 'ItemPropertyView',
      border: false,
      layout: 'vbox',
      layoutConfig: {
        align: 'stretch'
      },
      border: false,
      padding: '10px 10px 0 10px',
      items: [
        new Ext.form.FormPanel({
          border: false,
          items: [
            new Ext.form.DisplayField({
              name: 'type',
              hideLabel: true,
              cls: 'x-propertyview x-propertyview-item',
              value: 'Gegenstand'
            }),
            new Ext.form.DisplayField({
              name: 'id',
              fieldLabel: 'ID'
            }),
            new Ext.form.DisplayField({
              name: 'name',
              fieldLabel: 'Name'
            }),
            new Ext.form.DisplayField({
              name: 'image',
              fieldLabel: 'Bild'
            })
          ]
        }),
        new Ext.Panel({
          border: false,
          flex: 1,
          layout: 'vbox',
          layoutConfig: {
            align: 'stretch'
          },
          items: [
            new Ext.Panel({
              border: false,
              html: '<div class="x-form-item x-form-display-field">Gelinkt&nbsp;in:</div>'
            }),
            new Ext.grid.GridPanel({
              flex: 1,
              cls: 'greyborder',
              colModel: new Ext.grid.ColumnModel({
                columns: [
                  {
                    header: '',
                    dataIndex: 'id',
                    width: 30,
                    fixed: true,
                    renderer: function(value, metaData, record, rowIndex, colIndex, store) {
                      return '<img src="images/' + Ext.StoreMgr.get('FolderStore').getById(value).getTypeImageFile() + '" />';
                    }
                  },
                  {
                    header: 'Name',
                    dataIndex: 'id',
                    renderer: function(value, metaData, record, rowIndex, colIndex, store) {
                      return '<a href="#" title="' + Ext.StoreMgr.get('FolderStore').getById(value).getPath() + '" onclick="Ext.getCmp(\'NavigationTree\').getNodeById(\'' + value.toString() + '\').approvedSelect(); return false; ">' + Ext.StoreMgr.get('FolderStore').getById(value).data.name + '</a>';
                    }
                  }
                ]
              }),
              columnLines: true,
              disableSelection: true,
              enableColumnMove: false,
              setRecord: function(itemRecord) {

                var store = this.getStore();
                store.removeAll();

                var itemFolderLinks = itemRecord.data.itemFolderLinks;

                for(var itemFolderLinkIndex = 0; itemFolderLinkIndex < itemFolderLinks.length; itemFolderLinkIndex++) {

                  store.addSorted(new store.recordType({
                    id: itemFolderLinks[itemFolderLinkIndex]
                  }, itemFolderLinks[itemFolderLinkIndex]));

                }

              },
              store: new Ext.data.ArrayStore({
                fields: [
                  'id'
                ],
                idIndex: 0
              }),
              trackMouseOver: false,
              view: new Ext.grid.GridView({
                forceFit: true,
                headersDisabled: true
              })
            }),
            new Ext.Panel({
              border: false,
              html: '<div style="padding-top: 7px !important; " class="x-form-item x-form-display-field">Freie&nbsp;Eigenschaften:</div>'
            }),
            new Ext.grid.GridPanel({
              flex: 1,
              cls: 'greyborder',
              colModel: new Ext.grid.ColumnModel({
                columns: [
                  {
                    header: '',
                    dataIndex: '',
                    width: 30,
                    fixed: true,
                    renderer: function(value, metaData, record, rowIndex, colIndex, store) {
                      return '<img src="images/led-icons/tag_blue.png" />';
                    }
                  },
                  {
                    header: 'Name',
                    dataIndex: 'id',
                    renderer: function(value, metaData, record, rowIndex, colIndex, store) {
                      return Ext.StoreMgr.get('FreePropertyStore').getById(value).data.name;
                    }
                  },
                  {
                    header: 'Wert',
                    dataIndex: 'value',
                    renderer: function(value, metaData, record, rowIndex, colIndex, store) {

                      var freePropertyRecord = Ext.StoreMgr.get('FreePropertyStore').getById(record.data.id);

                      var format = freePropertyRecord.data.format;

                      if(format === 'string') {

                        return value;

                      } else if(format === 'bool') {

                        if(value === 'true') {
                          return 'Ja';
                        } else if(value === 'false') {
                          return 'Nein';
                        } else {
                          return '';
                        }

                        return value;

                      } else if(format === 'int') {

                        return typeof value !== 'number' ? '' : parseInt(value).toString();

                      } else if(format === 'float') {

                        return typeof value !== 'number' ? '' : parseFloat(value).toExponential();

                      } else if(format === 'date') {

                        return typeof value !== 'object' ? '' : value.format('d.m.Y');

                      }

                    }
                  }
                ]
              }),
              columnLines: true,
              disableSelection: true,
              enableColumnMove: false,
              setRecord: function(itemRecord) {

                var store = this.getStore();
                store.removeAll();

                for(var property in itemRecord.data) {
                  if(property.substr(0, 17) === 'freePropertyValue' && itemRecord.data[property] !== undefined) {

                    var freePropertyRecord = Ext.StoreMgr.get('FreePropertyStore').getById(Number(property.substr(17)));
                    var freePropertyValue = itemRecord.data[property];

                    if(freePropertyRecord.data.format === 'string') {
                      // Do nothing
                    } else if(freePropertyRecord.data.format === 'bool') {
                      if(freePropertyValue === true) {
                        freePropertyValue = 'true';
                      } else if(freePropertyValue === false) {
                        freePropertyValue = 'false';
                      } else {
                        freePropertyValue = '';
                      }
                    } else if(freePropertyRecord.data.format === 'int') {
                      if(typeof freePropertyValue === 'number') {
                        // Do nothing
                      } else {
                        freePropertyValue = '';
                      }
                    } else if(freePropertyRecord.data.format === 'float') {
                      if(typeof freePropertyValue === 'number') {
                        // Do nothing
                      } else {
                        freePropertyValue = '';
                      }
                    } else if(freePropertyRecord.data.format === 'date') {
                      if(typeof freePropertyValue === 'object') {
                        // Do nothing
                      } else {
                        freePropertyValue = '';
                      }
                    } else {
                      freePropertyValue = '';
                    }

                    store.addSorted(new store.recordType({
                      id: freePropertyRecord.data.id,
                      value: freePropertyValue
                    }, freePropertyRecord.data.id));

                  }
                }

              },
              store: new Ext.data.ArrayStore({
                fields: [
                  'id',
                  'value'
                ],
                idIndex: 0
              }),
              trackMouseOver: false,
              view: new Ext.grid.GridView({
                forceFit: true,
                headersDisabled: true
              })
            }),
            new Ext.Panel({
              border: false,
              html: '<div style="padding-top: 7px !important; " class="x-form-item x-form-display-field">Beschreibung:</div>'
            }),
            new Ext.Panel({
              cls: 'greyborder x-form-item',
              style: 'padding-bottom: 10px; ',
              autoScroll: true,
              flex: 1,
              html: '<div style="padding: 5px; "></div>'
            })
          ]
        })
      ]
    });

    Ext.ux.pimf.StoreObserver.create({
      storeId: 'ItemStore',
      scope: this,
      events: ['load', 'update'],
      listeners: {
        load: function(store, itemRecords, options) {

          if(this.itemId === undefined || this.itemId === null) {
            return;
          }

          this.reload();

        },
        update: function(store, itemRecord, operation) {

          if(itemRecord.data.id === this.itemId && operation === Ext.data.Record.COMMIT) {
            this.reload();
          }

        }
      }
    });

    Ext.ux.pimf.StoreObserver.create({
      storeId: 'FolderStore',
      scope: this,
      events: ['update'],
      listeners: {
        update: function(store, folderRecord, operation) {

        if(operation === Ext.data.Record.COMMIT) {
          this.reload();
        }

      }
      }
    });

  },

  activate: function() {

    this.ownerCt.layout.setActiveItem(this.id);

  },

  load: function(itemId) {

    this.itemId = itemId;
    this.reload();

  },

  reload: function() {

    if(this.itemId === undefined || this.itemId === null) {
      return;
    }

    var itemRecord = Ext.StoreMgr.get('ItemStore').getById('item' + this.itemId.toString());

    if(itemRecord === undefined) {
      return;
    }

    this.items.item(0).getForm().setValues({
      id: itemRecord.data.id.toString().replace(/ /g, '&nbsp;'),
      name: itemRecord.data.name.replace(/ /g, '&nbsp;'),
      image: Ext.StoreMgr.get('ImageStore').getTag(itemRecord.data.image)
    });

    this.items.item(1).items.item(1).setRecord(itemRecord);
    this.items.item(1).items.item(3).setRecord(itemRecord);
    this.items.item(1).items.item(5).getEl().first().first().first().update(itemRecord.data.description.replace(/\n/g, '<br />'));

  }

});