Ext.namespace('Ext.ux', 'Ext.ux.pimf', 'Ext.ux.pimf.items');

Ext.ux.pimf.items.NewWindow = Ext.extend(Ext.ux.pimf.items.AbstractWindow, {

  constructor: function(parentFolderRecord) {

    Ext.ux.pimf.items.NewWindow.superclass.constructor.call(this, 'Neuer Gegenstand');

    this.parentFolderId = parentFolderRecord.data.id;

    this.addListener('show', function(component) {

      this.items.item(0).items.item(0).getForm().setValues({
        id: '(neu)',
        image: 0
      });

      this.tree.set([this.parentFolderId]);

    });

    Ext.ux.pimf.StoreObserver.create({
      storeId: 'ItemStore',
      scope: this,
      events: ['remotenew'],
      listeners: {
        remotenew: function() {

          this.close();

        }
      }
    });

  },

  save: function() {

    var formData = this.items.item(0).items.item(0).getForm().getFieldValues();
    var rawData = this.items.item(0).items.item(0).getForm().getValues();

    var itemData = {
      id: 0,
      name: formData.name,
      image: parseInt(rawData.image),
      description: formData.description
    };

    Ext.apply(itemData, this.tree.get());
    Ext.apply(itemData, this.grid.get());

    Ext.StoreMgr.get('ItemStore').remoteNew(itemData);

  }

});
