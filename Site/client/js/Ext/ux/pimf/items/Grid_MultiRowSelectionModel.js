Ext.namespace('Ext.ux', 'Ext.ux.pimf', 'Ext.ux.pimf.items');

Ext.ux.pimf.items.Grid_MultiRowSelectionModel = Ext.extend(Ext.grid.RowSelectionModel, {

  constructor: function() {

    Ext.ux.pimf.items.Grid_MultiRowSelectionModel.superclass.constructor.call(this, {
      hasSameType: function() {

        return this.justItems() || this.justFolders();

      },
      includesMainFolders: function() {

        var selections = this.getSelections();
        for(var selectionIndex = 0; selectionIndex < selections.length; selectionIndex++) {
          if(selections[selectionIndex].data.parentFolderId === '0' && Ext.StoreMgr.get('FolderStore').isFolderType(selections[selectionIndex].data.type)) {
            return true;
          }
        }

        return false;

      },
      justOne: function() {
        return this.getSelections().length === 1;
      },
      justItems: function() {

        var selections = this.getSelections();
        for(var selectionIndex = 0; selectionIndex < selections.length; selectionIndex++) {
          if(selections[selectionIndex].data.type !== 'item') {
            return false;
          }
        }

        return true;

      },
      justFolders: function() {

        var selections = this.getSelections();
        for(var selectionIndex = 0; selectionIndex < selections.length; selectionIndex++) {
          if(!Ext.StoreMgr.get('FolderStore').isFolderType(selections[selectionIndex].data.type)) {
            return false;
          }
        }

        return true;

      },
      listeners: {
        selectionchange: function(selectionModel) {
          this.grid.loadPropertyView();
        }
      }
    });

  }

});