Ext.namespace('Ext.ux', 'Ext.ux.pimf', 'Ext.ux.pimf.freeProperties');

Ext.ux.pimf.freeProperties.Grid = Ext.extend(Ext.grid.GridPanel, {

  constructor: function() {

    Ext.ux.pimf.freeProperties.Grid.superclass.constructor.call(this, {
      id: 'FreePropertyGrid',
      border: false,
      listeners: {
        rowcontextmenu: function(grid, rowIndex, event) {

          event.rowContext = true;

          if(!grid.getSelectionModel().isSelected(rowIndex)) {
            grid.getSelectionModel().selectRow(rowIndex);
          }

          grid.showContextMenu(event);

        },
        containercontextmenu: function(grid, event) {

          event.rowContext = false;

          grid.showContextMenu(event);

        },
        containerclick: function(grid, event) {

          grid.getSelectionModel().clearSelections();

        }
      },
      colModel: new Ext.grid.ColumnModel({
        defaults: {
          editable: false,
          sortable: true,
          hidden: true
        },
        columns: [
          {
            header: '',
            dataIndex: '',
            fixed: true,
            menuDisabled: true,
            hideable: false,
            hidden: false,
            width: 30,
            renderer: function(value, metaData, record, rowIndex, colIndex, store) {
              return '<img src="images/led-icons/tag_blue.png" />';
            }
          },
          {
            header: 'ID',
            dataIndex: 'id',
            width: 50
          },
          {
            header: 'Name',
            dataIndex: 'name',
            hidden: false,
            width: 400
          },
          {
            header: 'Format',
            dataIndex: 'format',
            hidden: false,
            width: 150,
            renderer: function(value, metaData, record, rowIndex, colIndex, store) {
              return record.getFormatLabel();
            }
          },
          {
            header: 'Standard Breite',
            dataIndex: 'columnWidth',
            width: 100
          },
          {
            header: Ext.StoreMgr.get('FreePropertyStore').ruleLabels['unique'],
            dataIndex: 'unique',
            width: 100,
            renderer: function(value, metaData, record, rowIndex, colIndex, store) {
              return value ? 'Ja' : 'Nein';
            }
          },
          {
            header: Ext.StoreMgr.get('FreePropertyStore').ruleLabels['mandatory'],
            dataIndex: 'mandatory',
            width: 100,
            renderer: function(value, metaData, record, rowIndex, colIndex, store) {
              return value ? 'Ja' : 'Nein';
            }
          },
          {
            header: Ext.StoreMgr.get('FreePropertyStore').ruleLabels['notEmpty'],
            dataIndex: 'notEmpty',
            width: 100,
            renderer: function(value, metaData, record, rowIndex, colIndex, store) {
              return value ? 'Ja' : 'Nein';
            }
          },
          {
            header: Ext.StoreMgr.get('FreePropertyStore').ruleLabels['readOnly'],
            dataIndex: 'readOnly',
            width: 100,
            renderer: function(value, metaData, record, rowIndex, colIndex, store) {
              return value ? 'Ja' : 'Nein';
            }
          },
          {
            header: Ext.StoreMgr.get('FreePropertyStore').ruleLabels['afterToday'],
            dataIndex: 'afterToday',
            width: 100,
            renderer: function(value, metaData, record, rowIndex, colIndex, store) {
              return value ? 'Ja' : 'Nein';
            }
          }
        ]
      }),
      columnLines: true,
      selModel: new Ext.grid.RowSelectionModel({
        listeners: {
          selectionchange: function(selectionModel) {
            this.grid.loadPropertyView();
          }
        }
      }),
      stripeRows: true,
      store: Ext.StoreMgr.get('FreePropertyStore'),
      view: new Ext.grid.GridView({
        emptyText: 'Es wurden keine Daten gefunden!'
      })
    });

  },

  getContextMenu: function(event) {

    return new Ext.menu.Menu({
      items: [
        new Ext.menu.Item({
          text: 'Bearbeiten',
          iconCls: 'x-menu-edit',
          disabled: this.getSelectionModel().getSelections().length > 1,
          hidden: !Ext.ux.pimf.Connection.locked || !event.rowContext,
          scope: this,
          handler: function(button, event) {
            new Ext.ux.pimf.freeProperties.EditWindow(this.getSelectionModel().getSelected()).show(button.getEl());
          }
        }),
        new Ext.menu.Item({
          text: 'Löschen',
          iconCls: 'x-menu-remove',
          hidden: !Ext.ux.pimf.Connection.locked || !event.rowContext,
          scope: this,
          handler: function(button, event) {
            new Ext.ux.pimf.freeProperties.RemoveDialog(this.getSelectionModel().getSelections()).show(button.getEl());
          }
        }),
        new Ext.menu.Separator({
          hidden: !Ext.ux.pimf.Connection.locked || !event.rowContext
        }),
        new Ext.menu.Item({
          text: 'Neu',
          iconCls: 'x-menu-new',
          hidden: !Ext.ux.pimf.Connection.locked,
          scope: this,
          handler: function(button, event) {
            new Ext.ux.pimf.freeProperties.NewWindow().show(button.getEl());
          }
        }),
        new Ext.menu.Separator({
          hidden: !Ext.ux.pimf.Connection.locked
        }),
        new Ext.menu.Item({
          text: 'Alles auswählen',
          iconCls: 'x-menu-selection',
          scope: this,
          handler: function(button, event) {
            this.getSelectionModel().selectAll();
          }
        })
      ]
    });

  },

  showContextMenu: function(event) {

    event.stopEvent();

    if(event.button === 0) {

      if(this.getSelectionModel().getCount() === 0) {
        return;
      }

      event.rowContext = true;

    }

    var coords = event.getXY();
    this.getContextMenu(event).showAt([coords[0] + 5, coords[1] + 5]);

  },

  activate: function() {

    this.ownerCt.layout.setActiveItem(this.id);
    this.loadPropertyView();

  },

  loadPropertyView: function() {

    var selections = this.getSelectionModel().getSelections();

    if(selections.length === 0) {

      Ext.getCmp('BlankPropertyView').activate();
      Ext.getCmp('FreePropertyPropertyView').load(null);

    } else if(selections.length === 1) {

      Ext.getCmp('FreePropertyPropertyView').activate();
      Ext.getCmp('FreePropertyPropertyView').load(selections[0].data.id);

    } else {

      Ext.getCmp('MultiPropertyView').activate(selections.length);
      Ext.getCmp('FreePropertyPropertyView').load(null);

    }

  }

});