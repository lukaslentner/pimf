Ext.namespace('Ext.ux', 'Ext.ux.pimf', 'Ext.ux.pimf.items');

Ext.ux.pimf.items.Grid = Ext.extend(Ext.grid.GridPanel, {

  constructor: function() {

    Ext.ux.pimf.items.Grid.superclass.constructor.call(this, {
      id: 'ItemGrid',
      border: false,
      listeners: {
        render: function(grid) {
          grid.ddInitDropTarget();
        },
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
        rowdblclick: function(grid, rowIndex, event) {

          if(grid.getSelectionModel().justFolders()) {

            var folderRecord = grid.getStore().getAt(rowIndex).getFolderRecord();

            Ext.getCmp('NavigationTree').getNodeById(folderRecord.data.id.toString()).approvedSelect();

          }

        },
        containerclick: function(grid, event) {

          grid.getSelectionModel().clearSelections();

        }
      },
      colModel: new Ext.grid.ColumnModel({
        defaults: {
          editable: false,
          sortable: true,
          width: 80
        },
        columns: []
      }),
      columnLines: true,
      selModel: new Ext.ux.pimf.items.Grid_MultiRowSelectionModel(),
      stripeRows: true,
      enableDragDrop: true,
      ddGroup: 'FoldersMove&ItemsLink',
      ddInitDropTarget: function() {
        var dropEl = this.getView().el.dom.childNodes[0].childNodes[1];
        var dropTarget = new Ext.dd.DropTarget(dropEl, {
          ddGroup: 'FoldersMove&ItemsLink',
          grid: this,
          prepareDDParameters: function(source, event, data) {

            var noAnswer = {
              action: undefined,
              checkAction: function() {
                return false;
              },
              getProxyCls: function() {
                return 'x-dd-drop-nodrop';
              }
            };

            var targetItemRecord = this.grid.store.data.items[this.grid.getView().findRowIndex(event.target)];
            var targetFolderRecord;
            if(targetItemRecord === undefined) {

              if(Ext.getCmp('NavigationTree').getSelectedNodeFolderRecord() === undefined || Ext.getCmp('NavigationTree').isSelectedNodeSpecial()) {
                return noAnswer;
              }

              targetFolderRecord = Ext.getCmp('NavigationTree').getSelectedNodeFolderRecord();

            } else {

              if(!Ext.StoreMgr.get('FolderStore').isFolderType(targetItemRecord.data.type)) {
                return noAnswer;
              }

              targetFolderRecord = targetItemRecord.getFolderRecord();

            }

            if(data.selections !== undefined) {// Records come from the grid

              if(data.selections[0].data.type === 'item') {

                return {
                  action: event.altKey ? 'unlink' : 'link',
                  checkAction: function() {
                    return Ext.StoreMgr.get('ItemStore').checkItemsLink(this.sourceItemRecords, this.targetFolderRecord);
                  },
                  getProxyCls: function() {
                    return this.checkAction() ? (event.altKey ? 'x-dd-drop-unlink' : 'x-dd-drop-link') : 'x-dd-drop-nodrop';
                  },
                  sourceItemRecords: data.selections,
                  targetFolderRecord: targetFolderRecord
                };

              } else if(Ext.StoreMgr.get('FolderStore').isFolderType(data.selections[0].data.type)) {

                return {
                  action: 'move',
                  checkAction: function() {
                    return Ext.StoreMgr.get('FolderStore').checkFoldersMove(this.sourceFolderRecords, this.targetFolderRecord);
                  },
                  getProxyCls: function() {
                    return this.checkAction() ? 'x-dd-drop-move' : 'x-dd-drop-nodrop';
                  },
                  sourceFolderRecords: Ext.StoreMgr.get('ItemStore').getFolderRecordsOfItemRecords(data.selections),
                  targetFolderRecord: targetFolderRecord
                };

              } else {

                return noAnswer;

              }

            } else if(data.node !== undefined) {// Record comes from the tree

              if(data.node.attributes.record === undefined) {
                return noAnswer;
              }

              return {
                action: 'move',
                checkAction: function() {
                  return Ext.StoreMgr.get('FolderStore').checkFoldersMove(this.sourceFolderRecords, this.targetFolderRecord);
                },
                getProxyCls: function() {
                  return this.checkAction() ? 'x-dd-drop-move' : 'x-dd-drop-nodrop';
                },
                sourceFolderRecords: [data.node.attributes.record],
                targetFolderRecord: targetFolderRecord
              };

            } else {

              return noAnswer;

            }

          },
          notifyOver: function(source, event, data){

            var dDParameters = this.prepareDDParameters(source, event, data);

            return dDParameters.getProxyCls();

          },
          notifyDrop: function(source, event, data){

            var dDParameters = this.prepareDDParameters(source, event, data);

            if(dDParameters.checkAction()) {

              if(dDParameters.action === 'move') {
                Ext.StoreMgr.get('FolderStore').remoteMove(dDParameters.sourceFolderRecords.extractProperty('data').extractProperty('id'), dDParameters.targetFolderRecord.data.id);
              }

              if(dDParameters.action === 'link') {
                Ext.StoreMgr.get('ItemStore').remoteLink(dDParameters.sourceItemRecords.extractProperty('data').extractProperty('id'), dDParameters.targetFolderRecord.data.id);
              }

              if(dDParameters.action === 'unlink') {
                Ext.StoreMgr.get('ItemStore').remoteUnlink(dDParameters.sourceItemRecords.extractProperty('data').extractProperty('id'), dDParameters.targetFolderRecord.data.id);
              }

              return true;

            } else {

              return false;

            }

          }
        });
      },
      store: Ext.StoreMgr.get('ItemStore'),
      view: new Ext.ux.pimf.items.Grid_StructuredGridView()
    });

  },

  getContextMenu: function(event) {

    var sm = this.getSelectionModel();

    return new Ext.menu.Menu({
      items: [
        new Ext.menu.Item({
          text: 'Bearbeiten',
          iconCls: 'x-menu-edit',
          disabled: !sm.hasSameType() || sm.includesMainFolders() || (sm.justFolders() && !sm.justOne()),
          hidden: !Ext.ux.pimf.Connection.locked || !event.rowContext,
          scope: this,
          handler: function(button, event) {
            if(this.getSelectionModel().justItems() && this.getSelectionModel().justOne()) {
              new Ext.ux.pimf.items.EditWindow(this.getSelectionModel().getSelected()).show(button.getEl());
            } else if(this.getSelectionModel().justItems()) {
              //TODO: Batch
              alert('TODO');
            } else {
              new Ext.ux.pimf.folders.EditWindow(this.getSelectionModel().getSelected().getFolderRecord()).show(button.getEl());
            }
          }
        }),
        new Ext.menu.Item({
          text: 'Klonen',
          iconCls: 'x-menu-clone',
          disabled: !sm.hasSameType() || sm.includesMainFolders(),
          hidden: !Ext.ux.pimf.Connection.locked || !event.rowContext,
          scope: this,
          handler: function(button, event) {
            if(this.getSelectionModel().justItems()) {
              new Ext.ux.pimf.items.CloneDialog(this.getSelectionModel().getSelections()).show(button.getEl());
            } else {
              new Ext.ux.pimf.folders.CloneDialog(this.getStore().getFolderRecordsOfItemRecords(this.getSelectionModel().getSelections())).show(button.getEl());
            }
          }
        }),
        new Ext.menu.Item({
          text: 'Löschen',
          iconCls: 'x-menu-remove',
          disabled: !sm.hasSameType() || sm.includesMainFolders(),
          hidden: !Ext.ux.pimf.Connection.locked || !event.rowContext,
          scope: this,
          handler: function(button, event) {
            if(this.getSelectionModel().justItems()) {
              new Ext.ux.pimf.items.RemoveDialog(this.getSelectionModel().getSelections()).show(button.getEl());
            } else {
              new Ext.ux.pimf.folders.RemoveDialog(this.getStore().getFolderRecordsOfItemRecords(this.getSelectionModel().getSelections())).show(button.getEl());
            }
          }
        }),
        new Ext.menu.Separator({
          hidden: !Ext.ux.pimf.Connection.locked || !event.rowContext
        }),
        new Ext.menu.Item({
          text: 'Neuer Gegenstand',
          iconCls: 'x-menu-new',
          disabled: Ext.getCmp('NavigationTree').isSelectedNodeSpecial(),
          hidden: !Ext.ux.pimf.Connection.locked,
          scope: this,
          handler: function(button, event) {
            new Ext.ux.pimf.items.NewWindow(Ext.getCmp('NavigationTree').getSelectedNodeFolderRecord()).show(button.getEl());
          }
        }),
        new Ext.menu.Item({
          text: 'Neuer Ordner',
          iconCls: 'x-menu-new',
          disabled: Ext.getCmp('NavigationTree').isSelectedNodeSpecial(),
          hidden: !Ext.ux.pimf.Connection.locked,
          scope: this,
          handler: function(button, event) {
            new Ext.ux.pimf.folders.NewWindow(Ext.getCmp('NavigationTree').getSelectedNodeFolderRecord()).show(button.getEl());
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
        }),
        new Ext.menu.Item({
          text: 'Druckvorschau',
          iconCls: 'x-menu-preview',
          scope: this,
          handler: function(button, event) {
            new Ext.ux.pimf.items.PreviewWindow().show(button.getEl());
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
      Ext.getCmp('ItemPropertyView').load(null);
      Ext.getCmp('FolderPropertyView').load(null);

    } else if(selections.length === 1) {

      if(selections[0].data.type === 'item') {

        Ext.getCmp('ItemPropertyView').activate();
        Ext.getCmp('ItemPropertyView').load(selections[0].data.id);
        Ext.getCmp('FolderPropertyView').load(null);

      } else {

        Ext.getCmp('FolderPropertyView').activate();
        Ext.getCmp('ItemPropertyView').load(null);
        Ext.getCmp('FolderPropertyView').load(selections[0].data.id);

      }

    } else {

      Ext.getCmp('MultiPropertyView').activate(selections.length);
      Ext.getCmp('ItemPropertyView').load(null);
      Ext.getCmp('FolderPropertyView').load(null);

    }

  }

});
