Ext.namespace('Ext.ux', 'Ext.ux.pimf', 'Ext.ux.pimf.items');

Ext.ux.pimf.items.RemoveDialog = function(itemRecords) {

  this.itemIds = itemRecords.extractProperty('data').extractProperty('id');

  this.show = function(animateElement) {

    Ext.MessageBox.show({
      title: 'Lösche Gegenstand',
      msg: 'Sind Sie sich sicher, dass Sie diese(n) Gegenstände/Gegenstand löschen wollen?',
      buttons: Ext.MessageBox.YESNO,
      icon: Ext.MessageBox.QUESTION,
      animEl: animateElement,
      scope: this,
      fn: function(button) {

        if(button === 'yes') {

          Ext.StoreMgr.get('ItemStore').remoteRemove(this.itemIds);

        }

      }
    });

  };

};