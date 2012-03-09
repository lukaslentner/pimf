Ext.namespace('Ext.ux', 'Ext.ux.pimf', 'Ext.ux.pimf.images');

Ext.ux.pimf.images.RenameDialog = function(imageRecord) {

  this.imageData = imageRecord.data;

  this.show = function(animateElement) {

    Ext.MessageBox.show({
      title: 'Benenne Bild um',
      msg: 'Geben Sie bitte den neuen Namen des Bildes ein:',
      buttons: Ext.MessageBox.OKCANCEL,
      icon: Ext.MessageBox.QUESTION,
      animEl: animateElement,
      prompt: true,
      value: this.imageData.name,
      scope: this,
      fn: function(button, text) {

        Ext.StoreMgr.get('ImageStore').remoteEdit({
          id: this.imageData.id,
          name: text
        });

      }
    });

  };

};