Ext.namespace('Ext.ux', 'Ext.ux.pimf', 'Ext.ux.pimf.items');

Ext.ux.pimf.items.CloneDialog = function(itemRecords) {

  this.itemIds = itemRecords.extractProperty('data').extractProperty('id');

  this.show = function(animateElement) {

    Ext.MessageBox.show({
      title: 'Klone Gegenstand',
      msg: 'Geben Sie bitte die gewünschte Anzahl der Klone ein:',
      buttons: Ext.MessageBox.OKCANCEL,
      icon: Ext.MessageBox.QUESTION,
      animEl: animateElement,
      prompt: true,
      value: '1',
      scope: this,
      fn: function(button, text) {

        var count = parseInt(text);

        if(button === 'ok' && count > 0) {

          Ext.StoreMgr.get('ItemStore').remoteClone(this.itemIds, count);

        }

      }
    });

  };

};