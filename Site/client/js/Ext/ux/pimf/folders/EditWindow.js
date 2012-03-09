Ext.namespace('Ext.ux', 'Ext.ux.pimf', 'Ext.ux.pimf.folders');

Ext.ux.pimf.folders.EditWindow = Ext.extend(Ext.ux.pimf.folders.AbstractWindow, {

  constructor: function(folderRecord) {

    Ext.ux.pimf.folders.EditWindow.superclass.constructor.call(this, folderRecord.data.type, 'Bearbeite Ordner');

    this.folderData = folderRecord.data;

    this.addListener('show', function(component) {

      this.items.item(0).getForm().setValues(this.folderData);

    });

    Ext.ux.pimf.StoreObserver.create({
      storeId: 'FolderStore',
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

    var formData = this.items.item(0).getForm().getFieldValues();
    var rawData = this.items.item(0).getForm().getValues();

    Ext.StoreMgr.get('FolderStore').remoteEdit({
      id: this.folderData.id,
      name: formData.name,
      image: parseInt(rawData.image),
      description: formData.description,
      parentFolderId: this.folderData.parentFolderId,
      type: this.folderData.type,
      manualURL: this.folderData.type === 'experiment' ? formData.manualURL : '',
      homepageURL: this.folderData.type === 'vendor' ? formData.homepageURL : ''
    });

  }

});
