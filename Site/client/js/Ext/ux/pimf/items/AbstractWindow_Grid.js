Ext.namespace('Ext.ux', 'Ext.ux.pimf', 'Ext.ux.pimf.items');

Ext.ux.pimf.items.AbstractWindow_Grid = Ext.extend(Ext.grid.EditorGridPanel, {

  constructor: function() {

    Ext.ux.pimf.items.AbstractWindow_Grid.superclass.constructor.call(this, {
      title: 'Freie Eigenschaften',
      border: false,
      clicksToEdit: 1,
      listeners: {
        rowcontextmenu: function(grid, rowIndex, event) {

          event.stopEvent();

          if(!grid.getSelectionModel().isSelected(rowIndex)) {
            grid.getSelectionModel().selectRow(rowIndex);
          }

          var contextmenu = new Ext.menu.Menu({
            items: [
              new Ext.menu.Item({
                text: 'Lösche Wertzuweisung',
                iconCls: 'x-menu-remove',
                handler: function(button, event) {
                  grid.getStore().remove(grid.getSelectionModel().getSelected());
                }
              }),
              new Ext.menu.Separator(),
              new Ext.menu.Item({
                text: 'Neue Wertzuweisung',
                iconCls: 'x-menu-new',
                handler: function(button, event) {
                  var store = grid.getStore();
                  store.add(new store.recordType({
                    id: '',
                    value: ''
                  }));
                }
              }),
              new Ext.menu.Item({
                text: 'Neue freie Eigenschaft',
                iconCls: 'x-menu-new',
                handler: function(button, event) {
                  new Ext.ux.pimf.freeProperties.NewWindow().show(this.getEl());
                }
              })
            ]
          });
          var coords = event.getXY();
          contextmenu.showAt([coords[0] + 5, coords[1] + 5]);

        },
        containercontextmenu: function(grid, event) {

          event.stopEvent();

          var contextmenu = new Ext.menu.Menu({
            items: [
              new Ext.menu.Item({
                text: 'Neue Wertzuweisung',
                iconCls: 'x-menu-new',
                handler: function(button, event) {
                  var store = grid.getStore();
                  store.add(new store.recordType({
                    id: '',
                    value: ''
                  }));
                }
              }),
              new Ext.menu.Item({
                text: 'Neue freie Eigenschaft',
                iconCls: 'x-menu-new',
                handler: function(button, event) {
                  new Ext.ux.pimf.freeProperties.NewWindow().show(this.getEl());
                }
              })
            ]
          });
          var coords = event.getXY();
          contextmenu.showAt([coords[0] + 5, coords[1] + 5]);

        },
        beforeedit: function(event) {

          if(event.column === 2) {

            var freePropertyRecord = Ext.StoreMgr.get('FreePropertyStore').getById(event.record.data.id);
            var column = event.grid.getColumnModel().getColumnById(2);

            if(freePropertyRecord === undefined) {

              column.setEditor(undefined);

            } else {

              var format = freePropertyRecord.data.format;

              if(format === 'string') {

                column.setEditor(new Ext.form.TextField());

              } else if(format === 'bool') {

                column.setEditor(new Ext.form.ComboBox({
                  editable: false,
                  mode: 'local',
                  triggerAction: 'all',
                  store: [
                    [
                      '',
                      'Kein Wert'
                    ],
                    [
                      'true',
                      'Ja'
                    ],
                    [
                      'false',
                      'Nein'
                    ]
                  ],
                  value: 0
                }));

              } else if(format === 'int') {

                column.setEditor(new Ext.form.NumberField({
                  allowDecimals: false,
                  maxValue: 1000000000000
                }));

              } else if(format === 'float') {

                column.setEditor(new Ext.form.NumberField({
                  baseChars: '+0123456789eE',
                  decimalPrecision: 16
                }));

              } else if(format === 'date') {

                column.setEditor(new Ext.form.DateField());

              } else {

                column.setEditor(undefined);

              }

            }

          }

        },
        afteredit: function(event) {

          if(event.column === 1) {

            event.record.set('value', '');

          }

        }
      },
      colModel: new Ext.grid.ColumnModel({
        defaults: {
          editable: true
        },
        columns: [
          {
            header: '',
            dataIndex: '',
            width: 30,
            editable: false,
            fixed: true,
            menuDisabled: true,
            renderer: function(value, metaData, record, rowIndex, colIndex, store) {

              return '<img src="images/led-icons/tag_blue.png" />';

            }
          },
          {
            header: 'Name',
            dataIndex: 'id',
            renderer: function(value, metaData, record, rowIndex, colIndex, store) {

              if(value === '') {
                return '';
              }

              var freePropertyRecord = Ext.StoreMgr.get('FreePropertyStore').getById(value);
              if(freePropertyRecord === undefined) {
                return 'Unbekannte Eigenschaft';
              } else {
                return freePropertyRecord.data.name;
              }

            },
            editor: new Ext.form.ComboBox({
              mode: 'local',
              lazyRender: true,
              lazyInit: false,
              forceSelection: true,
              triggerAction: 'all',
              store: Ext.StoreMgr.get('FreePropertyStore'),
              valueField: 'id',
              displayField: 'name'
            })
          },
          {
            header: 'Wert',
            dataIndex: 'value',
            renderer: function(value, metaData, record, rowIndex, colIndex, store) {

              var freePropertyRecord = Ext.StoreMgr.get('FreePropertyStore').getById(record.data.id);

              if(freePropertyRecord === undefined) {

                return '';

              } else {

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

            },
            editor: undefined
          }
        ]
      }),
      columnLines: true,
      selModel: new Ext.grid.RowSelectionModel(),
      stripeRows: true,
      store: new Ext.data.ArrayStore({
        idIndex: 0,
        fields: [
          'id',
          'value'
        ]
      }),
      view: new Ext.grid.GridView({
        forceFit: true,
        emptyText: 'Es sind keine freien Eigenschaften definiert!'
      })
    });

  },

  get: function() {

    var returnArray = {};

    var freePropertyRows = this.getStore().getRange();
    for(var freePropertyRowIndex = 0; freePropertyRowIndex < freePropertyRows.length; freePropertyRowIndex++) {

      var freePropertyRecord = Ext.StoreMgr.get('FreePropertyStore').getById(freePropertyRows[freePropertyRowIndex].data.id);
      var freePropertyValue = freePropertyRows[freePropertyRowIndex].data.value;

      if(freePropertyRecord === undefined) {
        continue;
      }

      if(freePropertyRecord.data.format === 'string') {
        // Do nothing
      } else if(freePropertyRecord.data.format === 'bool') {
        if(freePropertyValue === 'true') {
          freePropertyValue = true;
        } else if(freePropertyValue === 'false') {
          freePropertyValue = false;
        } else {
          freePropertyValue = null;
        }
      } else if(freePropertyRecord.data.format === 'int') {
        if(typeof freePropertyValue === 'number') {
          freePropertyValue = parseInt(freePropertyValue);
        } else {
          freePropertyValue = null;
        }
      } else if(freePropertyRecord.data.format === 'float') {
        if(typeof freePropertyValue === 'number') {
          freePropertyValue = parseFloat(freePropertyValue);
        } else {
          freePropertyValue = null;
        }
      } else if(freePropertyRecord.data.format === 'date') {
        if(typeof freePropertyValue === 'object') {
          // Do nothing
        } else {
          freePropertyValue = null;
        }
      } else {
        continue;
      }

      returnArray['freePropertyValue' + freePropertyRecord.data.id.toString()] = freePropertyValue;

    }

    return returnArray;

  },

  set: function(itemData) {

    var store = this.getStore();

    for(var property in itemData) {

      if(property.substr(0, 17) === 'freePropertyValue' && itemData[property] !== undefined) {

        var freePropertyRecord = Ext.StoreMgr.get('FreePropertyStore').getById(Number(property.substr(17)));
        var freePropertyValue = itemData[property];

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


        var freePropertyRow = new store.recordType({
          id: freePropertyRecord.data.id,
          value: freePropertyValue
        }, freePropertyRecord.data.id);
        store.addSorted(freePropertyRow);

      }

    }

  }

});
