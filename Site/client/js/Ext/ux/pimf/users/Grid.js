Ext.namespace('Ext.ux', 'Ext.ux.pimf', 'Ext.ux.pimf.users');

Ext.ux.pimf.users.Grid = Ext.extend(Ext.grid.GridPanel, {

  constructor: function() {

    Ext.ux.pimf.users.Grid.superclass.constructor.call(this, {
      id: 'UserGrid',
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
          sortable: true
        },
        columns: [
          {
            header: '',
            dataIndex: '',
            fixed: true,
            menuDisabled: true,
            hideable: false,
            width: 30,
            renderer: function(value, metaData, record, rowIndex, colIndex, store) {
              return '<img src="images/' + record.getRoleImageFile() + '" />';
            }
          },
          {
            header: 'ID',
            dataIndex: 'id',
            hidden: true,
            width: 50
          },
          {
            header: 'Benutzername',
            dataIndex: 'username',
            width: 400
          },
          {
            header: 'Rolle',
            dataIndex: 'role',
            width: 100,
            renderer: function(value, metaData, record, rowIndex, colIndex, store) {
              return record.getRoleLabel();
            }
          }
        ]
      }),
      columnLines: true,
      selModel: new Ext.grid.RowSelectionModel({
        listeners: {
          selectionchange: function(selectionModel) {
            selectionModel.grid.loadPropertyView();
          }
        }
      }),
      stripeRows: true,
      store: Ext.StoreMgr.get('UserStore'),
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
            new Ext.ux.pimf.users.EditWindow(this.getSelectionModel().getSelected()).show(button.getEl());
          }
        }),
        new Ext.menu.Item({
          text: 'Löschen',
          iconCls: 'x-menu-remove',
          hidden: !Ext.ux.pimf.Connection.locked || !event.rowContext,
          scope: this,
          handler: function(button, event) {
            new Ext.ux.pimf.users.RemoveDialog(this.getSelectionModel().getSelections()).show(button.getEl());
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
            new Ext.ux.pimf.users.NewWindow().show(button.getEl());
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
      Ext.getCmp('UserPropertyView').load(null);

    } else if(selections.length === 1) {

      Ext.getCmp('UserPropertyView').activate();
      Ext.getCmp('UserPropertyView').load(selections[0].data.id);

    } else {

      Ext.getCmp('MultiPropertyView').activate(selections.length);
      Ext.getCmp('UserPropertyView').load(null);

    }

  }

});
