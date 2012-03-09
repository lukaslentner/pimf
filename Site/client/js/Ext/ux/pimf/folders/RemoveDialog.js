Ext.namespace('Ext.ux', 'Ext.ux.pimf', 'Ext.ux.pimf.folders');

Ext.ux.pimf.folders.RemoveDialog = function(folderRecords) {

  this.folderIds = folderRecords.extractProperty('data').extractProperty('id');

  this.show = function(animateElement) {

    Ext.MessageBox.show({
      title: 'Lösche Ordner',
      msg: 'Sind Sie sich sicher, dass Sie diese(n) Ordner löschen wollen?',
      buttons: Ext.MessageBox.YESNO,
      icon: Ext.MessageBox.QUESTION,
      animEl: animateElement,
      scope: this,
      fn: function(button) {

        if(button === 'yes') {

          Ext.StoreMgr.get('FolderStore').remoteRemove(this.folderIds);

        }

      }
    });

  };

};