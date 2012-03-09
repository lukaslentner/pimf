Ext.namespace('Ext.ux', 'Ext.ux.pimf', 'Ext.ux.pimf.freeProperties');

Ext.ux.pimf.freeProperties.RemoveDialog = function(freePropertyRecords) {

  this.freePropertyIds = freePropertyRecords.extractProperty('data').extractProperty('id');

  this.show = function(animateElement) {

    Ext.MessageBox.show({
      title: 'Lösche freie Eigenschaft(en)',
      msg: 'Sind Sie sich sicher, dass Sie diese Eigenschaft(en) löschen wollen?',
      buttons: Ext.MessageBox.YESNO,
      icon: Ext.MessageBox.QUESTION,
      animEl: animateElement,
      scope: this,
      fn: function(button) {

        if(button === 'yes') {

          Ext.StoreMgr.get('FreePropertyStore').remoteRemove(this.freePropertyIds);

        }

      }
    });

  };

};