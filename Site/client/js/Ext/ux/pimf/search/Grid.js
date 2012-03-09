Ext.namespace('Ext.ux', 'Ext.ux.pimf', 'Ext.ux.pimf.search');

Ext.ux.pimf.search.Grid = Ext.extend(Ext.grid.EditorGridPanel, {

  constructor: function() {

    Ext.ux.pimf.search.Grid.superclass.constructor.call(this, {
      id: 'SearchGrid',
      region: 'south',
      height: 150,
      border: false,
      collapsed: true,
      buttonAlign: 'left',
      bbar: new Ext.Toolbar({
        style: 'background-image: none; ',
        items: [
          new Ext.form.ComboBox({
            editable: false,
            mode: 'local',
            triggerAction: 'all',
            store: new Ext.data.ArrayStore({
              data: [
                [
                  'AND',
                  'UND-Verknüpfung'
                ],
                [
                  'OR',
                  'ODER-Verknüpfung'
                ]
              ],
              fields: [
                'id',
                'label'
              ],
              idIndex: 0
            }),
            valueField: 'id',
            displayField: 'label',
            value: 'AND'
          }),
          new Ext.Toolbar.Fill(),
          new Ext.Button({
            text: 'Kriterium hinzufügen',
            icon: 'images/led-icons/add.png',
            handler: function(button, event) {
              var store = button.ownerCt.ownerCt.getStore();
              store.add(new store.recordType({
                subject: '',
                comparator: '',
                value: ''
              }));
            }
          }),
          new Ext.Button({
            text: 'Erweiterte Suche starten',
            icon: 'images/led-icons/find.png',
            handler: function(button, event) {
              button.ownerCt.ownerCt.fireEvent('extendedsearch', button.ownerCt.ownerCt);
            }
          })
        ]
      }),
      hideHeaders: true,
      border: false,
      clicksToEdit: 1,
      listeners: {
        beforeedit: function(event) {

          if(event.column === 1) {

            var subjectRecord = Ext.StoreMgr.get('SubjectStore').getById(event.record.data.subject);
            var column = event.grid.getColumnModel().getColumnById(1);

            if(subjectRecord === undefined) {

              column.setEditor(undefined);

            } else {

              var data = [];
              for(var comparatorIndex = 0; comparatorIndex < subjectRecord.data.comparators.length; comparatorIndex++) {
                data.push([subjectRecord.data.comparators[comparatorIndex], Ext.StoreMgr.get('SubjectStore').getComparatorLabel(subjectRecord.data.comparators[comparatorIndex])]);
              }

              column.setEditor(new Ext.form.ComboBox({
                mode: 'local',
                lazyRender: true,
                lazyInit: false,
                forceSelection: true,
                triggerAction: 'all',
                store: new Ext.data.ArrayStore({
                  idIndex: 0,
                  fields: [
                    'id',
                    'name'
                  ],
                  data: data
                }),
                valueField: 'id',
                displayField: 'name'
              }));

            }

          } else if(event.column === 2) {

            var subjectRecord = Ext.StoreMgr.get('SubjectStore').getById(event.record.data.subject);
            var column = event.grid.getColumnModel().getColumnById(2);

            if(subjectRecord === undefined) {

              column.setEditor(undefined);

            } else {

              var format = subjectRecord.data.format;

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

          if(event.column === 0) {

            event.record.set('comparator', '');
            event.record.set('value', '');

          }

        },
        cellclick: function(grid, rowIndex, columnIndex, event) {

          if(columnIndex === 3) {

            grid.getStore().remove(grid.getStore().getAt(rowIndex));

          }

        }
      },
      colModel: new Ext.grid.ColumnModel({
        defaults: {
          editable: true
        },
        columns: [
          {
            dataIndex: 'subject',
            renderer: function(value, metaData, record, rowIndex, colIndex, store) {

              if(value === '') {
                return '';
              }

              var subjectRecord = Ext.StoreMgr.get('SubjectStore').getById(value);

              if(subjectRecord === undefined) {
                return 'Unbekanntes Subjekt';
              } else {
                return subjectRecord.data.name;
              }

            },
            editor: new Ext.form.ComboBox({
              mode: 'local',
              lazyRender: true,
              lazyInit: false,
              forceSelection: true,
              triggerAction: 'all',
              store: Ext.StoreMgr.get('SubjectStore'),
              valueField: 'id',
              displayField: 'name'
            })
          },
          {
            dataIndex: 'comparator',
            renderer: function(value, metaData, record, rowIndex, colIndex, store) {

              return Ext.StoreMgr.get('SubjectStore').getComparatorLabel(value);

            },
            editor: undefined
          },
          {
            dataIndex: 'value',
            renderer: function(value, metaData, record, rowIndex, colIndex, store) {

              if(value === '') {
                return '';
              }

              var subjectRecord = Ext.StoreMgr.get('SubjectStore').getById(record.data.subject);

              if(subjectRecord === undefined) {

                return '';

              } else {

                var format = subjectRecord.data.format;

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
          },
          {
            fixed: true,
            width: 30,
            dataIndex: '',
            editable: false,
            renderer: function(value, metaData, record, rowIndex, colIndex, store) {

              return '<img src="images/led-icons/cross.png" />';

            }
          }
        ]
      }),
      columnLines: true,
      selModel: new Ext.grid.RowSelectionModel(),
      stripeRows: true,
      store: new Ext.data.ArrayStore({
        idIndex: 0,
        fields: [
          'subject',
          'comparator',
          'value'
        ]
      }),
      view: new Ext.grid.GridView({
        forceFit: true,
        emptyText: 'Es sind keine Suchkriterien definiert!',
        deferEmptyText: false
      }),
      bodyStyle: 'border-width: 1px 0 0 0;'
    });

    this.addEvents('extendedsearch');

  }

});