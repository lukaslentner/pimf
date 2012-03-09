Ext.namespace('Ext.ux', 'Ext.ux.pimf', 'Ext.ux.pimf.users');

Ext.ux.pimf.users.NewWindow = Ext.extend(Ext.ux.pimf.users.AbstractWindow, {

  constructor: function() {

    Ext.ux.pimf.users.NewWindow.superclass.constructor.call(this, 'Neuer Benutzer');

    this.addListener('show', function(component) {

      this.items.item(0).getForm().setValues({
        id: '(neu)'
      });

    });

    Ext.ux.pimf.StoreObserver.create({
      storeId: 'UserStore',
      scope: this,
      events: ['remotenew'],
      listeners: {
        remotenew: function() {

          this.close();

        }
      }
    });

  },

  save: function() {

    var formData = this.items.item(0).getForm().getFieldValues();
    var rawData = this.items.item(0).getForm().getValues();

    Ext.StoreMgr.get('UserStore').remoteNew({
      id: 0,
      username: formData.username,
      role: formData.role,
      password: Ext.ux.crypto.SHA1.hash(formData.password)
    });

  }

});

