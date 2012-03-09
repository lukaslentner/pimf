Ext.namespace('Ext.ux', 'Ext.ux.pimf', 'Ext.ux.pimf.folders');

Ext.ux.pimf.folders.NewWindow = Ext.extend(Ext.ux.pimf.folders.AbstractWindow, {

  constructor: function(parentFolderRecord) {

    Ext.ux.pimf.folders.NewWindow.superclass.constructor.call(this, parentFolderRecord.data.type, 'Neuer Ordner');

    this.parentFolderData = parentFolderRecord.data;

    this.addListener('show', function(component) {

      this.items.item(0).getForm().setValues({
        id: '(neu)',
        image: 0
      });

    });

    Ext.ux.pimf.StoreObserver.create({
      storeId: 'FolderStore',
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

    var formData = this.items.item(0).getForm().getFieldValues();
    var rawData = this.items.item(0).getForm().getValues();

    Ext.StoreMgr.get('FolderStore').remoteNew({
      id: 0,
      name: formData.name,
      image: parseInt(rawData.image),
      description: formData.description,
      parentFolderId: this.parentFolderData.id,
      type: this.parentFolderData.type,
      manualURL: this.parentFolderData.type === 'experiment' ? formData.manualURL : '',
      homepageURL: this.parentFolderData.type === 'vendor' ? formData.homepageURL : ''
    });

  }

});