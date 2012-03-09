Ext.namespace('Ext.ux', 'Ext.ux.pimf', 'Ext.ux.pimf.misc');

Ext.ux.pimf.misc.LogoutButton = Ext.extend(Ext.Button, {

  constructor: function() {

    Ext.ux.pimf.misc.LogoutButton.superclass.constructor.call(this, {
      text: 'Logout',
      icon: 'images/led-icons/door_in.png',
      style: 'margin: 5px 5px 0 0; float: right; ',
      handler: function(button, event) {

        this.logoutRequested = true;

        if(Ext.ux.pimf.Connection.locked) {
          Ext.ux.pimf.Connection.unlock();
        } else {
          this.fireEvent('unlockFailure');
        }

      }
    });

    this.logoutRequested = false;

    this.relayEvents(Ext.ux.pimf.Connection, ['unlock', 'unlockFailure']);
    this.addListener('unlock', function() {

      if(this.logoutRequested) {
        Ext.ux.pimf.Connection.logout();
      }

    });
    this.addListener('unlockFailure', function() {

      if(this.logoutRequested) {
        Ext.ux.pimf.Connection.logout();
      }

    });

  }

});