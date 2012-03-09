Ext.namespace('Ext.ux', 'Ext.ux.pimf', 'Ext.ux.pimf.users');

Ext.ux.pimf.users.RemoveDialog = function(userRecords) {

  this.userIds = userRecords.extractProperty('data').extractProperty('id');

  this.show = function(animateElement) {

    Ext.MessageBox.show({
      title: 'Lösche Benutzer',
      msg: 'Sind Sie sich sicher, dass Sie diese(n) Benutzer löschen wollen?',
      buttons: Ext.MessageBox.YESNO,
      icon: Ext.MessageBox.QUESTION,
      animEl: animateElement,
      scope: this,
      fn: function(button) {

        if(button === 'yes') {

          Ext.StoreMgr.get('UserStore').remoteRemove(this.userIds);

        }

      }
    });

  };

};
