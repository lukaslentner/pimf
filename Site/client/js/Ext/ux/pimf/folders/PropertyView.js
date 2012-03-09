Ext.namespace('Ext.ux', 'Ext.ux.pimf', 'Ext.ux.pimf.folders');

Ext.ux.pimf.folders.PropertyView = Ext.extend(Ext.Panel, {

  constructor: function() {

    Ext.ux.pimf.folders.PropertyView.superclass.constructor.call(this, {
      id: 'FolderPropertyView',
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
              cls: 'x-propertyview'
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
              name: 'manualURL',
              fieldLabel: 'Anleitung URL'
            }),
            new Ext.form.DisplayField({
              name: 'homepageURL',
              fieldLabel: 'Homepage URL'
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
              html: '<div class="x-form-item x-form-display-field">Enthalten&nbsp;in:</div>'
            }),
            new Ext.grid.GridPanel({
              cls: 'greyborder',
              colModel: new Ext.grid.ColumnModel({
                columns: [
                  {
                    header: '',
                    dataIndex: 'id',
                    width: 30,
                    fixed: true,
                    renderer: function(value, metaData, record, rowIndex, colIndex, store) {
                      if(value === 0) {
                        return '';
                      } else {
                        return '<img src="images/' + Ext.StoreMgr.get('FolderStore').getById(value).getTypeImageFile() + '" />';
                      }
                    }
                  },
                  {
                    header: 'Name',
                    dataIndex: 'id',
                    renderer: function(value, metaData, record, rowIndex, colIndex, store) {
                      if(value === 0) {
                        return '';
                      } else {
                        return '<a href="#" title="' + Ext.StoreMgr.get('FolderStore').getById(value).getPath() + '" onclick="Ext.getCmp(\'NavigationTree\').getNodeById(\'' + value.toString() + '\').approvedSelect(); return false; ">' + Ext.StoreMgr.get('FolderStore').getById(value).data.name + '</a>';
                      }
                    }
                  }
                ]
              }),
              columnLines: true,
              disableSelection: true,
              enableColumnMove: false,
              setRecord: function(folderRecord) {

                var store = this.getStore();
                store.removeAll();

                store.addSorted(new store.recordType({
                  id: folderRecord.data.parentFolderId
                }, folderRecord.data.parentFolderId));

              },
              store: new Ext.data.ArrayStore({
                data: [
                  [
                    0
                  ]
                ],
                fields: [
                  'id'
                ],
                idIndex: 0
              }),
              trackMouseOver: false,
              view: new Ext.grid.GridView({
                forceFit: true,
                headersDisabled: true,
                scrollOffset: 0
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
      storeId: 'FolderStore',
      scope: this,
      events: ['load', 'update'],
      listeners: {
        load: function(store, folderRecords, options) {

          if(this.folderId === undefined || this.folderId === null) {
            return;
          }

          this.reload();

        },
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

  load: function(folderId) {

    this.folderId = folderId;
    this.reload();

  },

  reload: function() {

    if(this.folderId === undefined || this.folderId === null) {
      return;
    }

    var folderRecord = Ext.StoreMgr.get('FolderStore').getById(this.folderId);

    if(folderRecord === undefined) {
      return;
    }

    this.items.item(0).getForm().findField('type').removeClass('x-propertyview-category');
    this.items.item(0).getForm().findField('type').removeClass('x-propertyview-experiment');
    this.items.item(0).getForm().findField('type').removeClass('x-propertyview-location');
    this.items.item(0).getForm().findField('type').removeClass('x-propertyview-vendor');

    this.items.item(0).getForm().findField('type').addClass('x-propertyview-' + folderRecord.data.type);
    this.items.item(0).getForm().setValues({
      type: folderRecord.getTypeLabel().replace(/ /g, '&nbsp;'),
      id: folderRecord.data.id.toString().replace(/ /g, '&nbsp;'),
      name: folderRecord.data.name.replace(/ /g, '&nbsp;'),
      manualURL: folderRecord.data.type === 'experiment' ? (folderRecord.data.manualURL === '' ? '' : '<a href="' + folderRecord.data.manualURL + '" target="_blank">' + folderRecord.data.manualURL.replace(/ /g, '&nbsp;') + '</a>') : '&lt;Nicht&nbsp;in&nbsp;Verwendung&gt;',
      homepageURL: folderRecord.data.type === 'vendor' ? (folderRecord.data.homepageURL === '' ? '' : '<a href="' + folderRecord.data.homepageURL + '" target="_blank">' + folderRecord.data.homepageURL.replace(/ /g, '&nbsp;') + '</a>') : '&lt;Nicht&nbsp;in&nbsp;Verwendung&gt;',
      image: Ext.StoreMgr.get('ImageStore').getTag(folderRecord.data.image)
    });

    this.items.item(1).items.item(1).setRecord(folderRecord);
    this.items.item(1).items.item(3).getEl().first().first().first().update(folderRecord.data.description.replace(/\n/g, '<br />'));

  }

});