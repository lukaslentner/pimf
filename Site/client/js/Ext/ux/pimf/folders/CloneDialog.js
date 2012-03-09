Ext.namespace('Ext.ux', 'Ext.ux.pimf', 'Ext.ux.pimf.folders');

Ext.ux.pimf.folders.CloneDialog = function(folderRecords) {

  this.folderIds = folderRecords.extractProperty('data').extractProperty('id');

  this.show = function(animateElement) {

    Ext.MessageBox.show({
      title: 'Klone Ordner',
      msg: 'Geben Sie bitte die gewünschte Anzahl der Klone ein:',
      buttons: Ext.MessageBox.OKCANCEL,
      icon: Ext.MessageBox.QUESTION,
      animEl: animateElement,
      scope: this,
      prompt: true,
      value: '1',
      fn: function(button, text) {

        var count = parseInt(text);

        if(button === 'ok' && count > 0) {

          Ext.StoreMgr.get('FolderStore').remoteClone(this.folderIds, count);

        }

      }
    });

  };

};