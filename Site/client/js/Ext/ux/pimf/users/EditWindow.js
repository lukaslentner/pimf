Ext.namespace('Ext.ux', 'Ext.ux.pimf', 'Ext.ux.pimf.users');

Ext.ux.pimf.users.EditWindow = Ext.extend(Ext.ux.pimf.users.AbstractWindow, {

  constructor: function(userRecord) {

    Ext.ux.pimf.users.EditWindow.superclass.constructor.call(this, 'Bearbeite Benutzer');

    this.userData = userRecord.data;

    this.addListener('show', function(component) {

      this.items.item(0).getForm().setValues(this.userData);
      this.items.item(0).getForm().setValues({
        password: ''
      });

    });

    Ext.ux.pimf.StoreObserver.create({
      storeId: 'UserStore',
      scope: this,
      events: ['remoteedit'],
      listeners: {
        remoteedit: function() {

          this.close();

        }
      }
    });

  },

  save: function() {

    var formData = this.items.item(0).getForm().getFieldValues();
    var rawData = this.items.item(0).getForm().getValues();

    Ext.StoreMgr.get('UserStore').remoteEdit({
      id: this.userData.id,
      username: formData.username,
      password: rawData.setPassword === 'on' ? Ext.ux.crypto.SHA1.hash(formData.password) : this.userData.password,
      role: formData.role
    });

  }

});