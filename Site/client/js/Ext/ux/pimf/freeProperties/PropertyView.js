Ext.namespace('Ext.ux', 'Ext.ux.pimf', 'Ext.ux.pimf.freeProperties');

Ext.ux.pimf.freeProperties.PropertyView = Ext.extend(Ext.form.FormPanel, {

  constructor: function() {

    Ext.ux.pimf.freeProperties.PropertyView.superclass.constructor.call(this, {
      id: 'FreePropertyPropertyView',
      border: false,
      defaults: {
        anchor: '100%'
      },
      border: false,
      padding: '10px 10px 6px 10px',
      items: [
        new Ext.form.DisplayField({
          name: 'type',
          hideLabel: true,
          cls: 'x-propertyview x-propertyview-freeProperty',
          value: 'Freie Eigenschaft'
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
          name: 'format',
          fieldLabel: 'Format'
        }),
        new Ext.form.DisplayField({
          name: 'columnWidth',
          fieldLabel: 'Standard Breite'
        }),
        new Ext.form.Label({
          fieldLabel: 'Regeln'
        }),
        new Ext.grid.GridPanel({
          cls: 'greyborder',
          colModel: new Ext.grid.ColumnModel({
            columns: [
              {
                header: 'Name',
                dataIndex: 'name',
                renderer: function(value, metaData, record, rowIndex, colIndex, store) {
                  return Ext.StoreMgr.get('FreePropertyStore').ruleLabels[value];
                }
              },
              {
                header: 'Wert',
                dataIndex: 'value',
                renderer: function(value, metaData, record, rowIndex, colIndex, store) {
                  return value ? 'Ja' : 'Nein';
                }
              }
            ]
          }),
          columnLines: true,
          disableSelection: true,
          enableColumnMove: false,
          set: function(freePropertyRecord) {
            this.getStore().loadData(Ext.ux.pimf.Util.includeKey({
              'unique': freePropertyRecord.data.unique,
              'mandatory': freePropertyRecord.data.mandatory,
              'notEmpty': freePropertyRecord.data.notEmpty,
              'readOnly': freePropertyRecord.data.readOnly,
              'afterToday': freePropertyRecord.data.afterToday
            }));
          },
          store: new Ext.data.ArrayStore({
            fields: [
              'name',
              'value'
            ],
            idIndex: 0,
            idProperty: 'name'
          }),
          style: 'margin-top: 7px; ',
          trackMouseOver: false,
          view: new Ext.grid.GridView({
            forceFit: true,
            headersDisabled: true,
            scrollOffset: 0
          })
        })
      ]
    });

    Ext.ux.pimf.StoreObserver.create({
      storeId: 'FreePropertyStore',
      scope: this,
      events: ['load', 'update'],
      listeners: {
        load: function(store, freePropertyRecords, options) {

          if(this.freePropertyId === undefined || this.freePropertyId === null) {
            return;
          }

          this.reload();

        },
        update: function(store, freePropertyRecord, operation) {

          if(freePropertyRecord.data.id === this.freePropertyId && operation === Ext.data.Record.COMMIT) {
            this.reload();
          }

        }
      }
    });

  },

  activate: function() {

    this.ownerCt.layout.setActiveItem(this.id);

  },

  load: function(freePropertyId) {

    this.freePropertyId = freePropertyId;
    this.reload();

  },

  reload: function() {

    if(this.freePropertyId === undefined || this.freePropertyId === null) {
      return;
    }

    var freePropertyRecord = Ext.StoreMgr.get('FreePropertyStore').getById(this.freePropertyId);

    if(freePropertyRecord === undefined) {
      return;
    }

    this.getForm().setValues({
      id: freePropertyRecord.data.id.toString(),
      name: freePropertyRecord.data.name,
      format: freePropertyRecord.getFormatLabel(),
      columnWidth: freePropertyRecord.data.columnWidth.toString()
    });
    this.items.item(6).set(freePropertyRecord);

  }

});
