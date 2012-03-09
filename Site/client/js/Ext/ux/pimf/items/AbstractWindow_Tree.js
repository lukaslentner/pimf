Ext.namespace('Ext.ux', 'Ext.ux.pimf', 'Ext.ux.pimf.folders');

Ext.ux.pimf.items.AbstractWindow_Tree = Ext.extend(Ext.ux.pimf.folders.AbstractTree, {

  constructor: function() {

    Ext.ux.pimf.items.AbstractWindow_Tree.superclass.constructor.call(this, {
      title: 'Ordnerlinks',
      checked: [],
      renderCheckboxes: true
    });

    this.addListener('afterrender', function(treePanel) {

      for(var checkedIndex = 0; checkedIndex < this.checked.length; checkedIndex++) {
        this.getNodeById(this.checked[checkedIndex].toString()).ensureVisible(function() {
          this.ui.toggleCheck(true);
        });
      }

    });

    this.storeObservers['FolderStore'].fireEvent('remoteload', true);

  },

  get: function() {

    var itemFolderLinks;

    if(this.rendered) {
      itemFolderLinks = this.getChecked('id');
      for(var itemFolderLinkIndex = 0; itemFolderLinkIndex < itemFolderLinks.length; itemFolderLinkIndex++) {
        itemFolderLinks[itemFolderLinkIndex] = Number(itemFolderLinks[itemFolderLinkIndex]);
      }
    } else {
      itemFolderLinks = this.checked;
    }

    return {
      itemFolderLinks: itemFolderLinks
    };

  },

  set: function(itemFolderLinks) {

    this.checked = itemFolderLinks;

  }

});