Ext.namespace('Ext.ux', 'Ext.ux.pimf', 'Ext.ux.pimf.images');

Ext.ux.pimf.images.RemoveDialog = function(imageRecord) {

  this.imageData = imageRecord.data;

  this.show = function(animateElement) {

    Ext.MessageBox.show({
      title: 'Lösche Bild',
      msg: 'Sind Sie sich sicher, dass Sie dieses Bild löschen wollen?',
      buttons: Ext.MessageBox.YESNO,
      icon: Ext.MessageBox.QUESTION,
      animEl: animateElement,
      scope: this,
      fn: function(button) {

        if(button === 'yes') {

          Ext.StoreMgr.get('ImageStore').remoteRemove(this.imageData.id);

        }

      }
    });

  };

};