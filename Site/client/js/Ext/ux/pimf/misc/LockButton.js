Ext.namespace('Ext.ux', 'Ext.ux.pimf', 'Ext.ux.pimf.misc');

Ext.ux.pimf.misc.LockButton = Ext.extend(Ext.Button, {

  constructor: function() {

    Ext.ux.pimf.misc.LockButton.superclass.constructor.call(this, {
      text: 'Schreibrechte erlangen',
      icon: 'images/led-icons/lock.png',
      style: 'margin: 5px 5px 0 0; float: right; ',
      hidden: true,
      handler: function(button, event) {

        if(Ext.ux.pimf.Connection.locked) {

          Ext.ux.pimf.Connection.unlock();

        } else {

          Ext.ux.pimf.Connection.lock(false);

        }

      }
    });

    this.relayEvents(Ext.ux.pimf.Connection, ['login', 'lock', 'unlock']);
    this.addListener('login', function() {

      this.setVisible(Ext.ux.pimf.Connection.getUserRole() >= 1);

    });
    this.addListener('lock', function() {

      this.setText('Schreibrechte abgeben');
      this.setIcon('images/led-icons/lock_unlock.png');

    });
    this.addListener('unlock', function() {

      this.setText('Schreibrechte erlangen');
      this.setIcon('images/led-icons/lock.png');

    });

  }

});