Ext.namespace('Ext.ux', 'Ext.ux.pimf', 'Ext.ux.pimf.items');

Ext.ux.pimf.items.EditWindow = Ext.extend(Ext.ux.pimf.items.AbstractWindow, {

  constructor: function(itemRecord) {

    Ext.ux.pimf.items.EditWindow.superclass.constructor.call(this, 'Bearbeite Gegenstand');

    this.itemData = itemRecord.data;

    this.addListener('show', function(component) {

      this.items.item(0).items.item(0).getForm().setValues({
        id: String(this.itemData.id),
        name: this.itemData.name,
        image: this.itemData.image,
        description: this.itemData.description
      });

      this.tree.set(this.itemData.itemFolderLinks);
      this.grid.set(this.itemData);

    });

    Ext.ux.pimf.StoreObserver.create({
      storeId: 'ItemStore',
      scope: this,
      events: ['remoteedit'],
      listeners: {
        remoteedit: function() {

          this.close();

        }
      }
    });

  },

  save: function() {

    var formData = this.items.item(0).items.item(0).getForm().getFieldValues();
    var rawData = this.items.item(0).items.item(0).getForm().getValues();

    var itemData = {
      id: this.itemData.id,
      name: formData.name,
      image: parseInt(rawData.image),
      description: formData.description
    };

    Ext.apply(itemData, this.tree.get());
    Ext.apply(itemData, this.grid.get());

    Ext.StoreMgr.get('ItemStore').remoteEdit(itemData);

  }

});
