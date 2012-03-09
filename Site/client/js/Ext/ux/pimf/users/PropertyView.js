Ext.namespace('Ext.ux', 'Ext.ux.pimf', 'Ext.ux.pimf.users');

Ext.ux.pimf.users.PropertyView = Ext.extend(Ext.form.FormPanel, {

  constructor: function() {

    Ext.ux.pimf.users.PropertyView.superclass.constructor.call(this, {
      id: 'UserPropertyView',
      border: false,
      defaults: {
        anchor: '100%'
      },
      border: false,
      padding: '10px 10px 6px 10px',
      items: [
        new Ext.form.DisplayField({
          name: 'type',
          hideLabel: true,
          cls: 'x-propertyview'
        }),
        new Ext.form.DisplayField({
          name: 'id',
          fieldLabel: 'ID'
        }),
        new Ext.form.DisplayField({
          name: 'username',
          fieldLabel: 'Benutzername'
        }),
        new Ext.form.DisplayField({
          name: 'role',
          fieldLabel: 'Rolle'
        })
      ]
    });

    Ext.ux.pimf.StoreObserver.create({
      storeId: 'UserStore',
      scope: this,
      events: ['load', 'update'],
      listeners: {
        load: function(store, userRecords, options) {

          if(this.userId === undefined || this.userId === null) {
            return;
          }

          this.reload();

        },
        update: function(store, userRecord, operation) {

          if(userRecord.data.id === this.userId && operation === Ext.data.Record.COMMIT) {
            this.reload();
          }

        }
      }
    });

  },

  activate: function() {

    this.ownerCt.layout.setActiveItem(this.id);

  },

  load: function(userId) {

    this.userId = userId;
    this.reload();

  },

  reload: function() {

    if(this.userId === undefined || this.userId === null) {
      return;
    }

    var userRecord = Ext.StoreMgr.get('UserStore').getById(this.userId);

    if(userRecord === undefined) {
      return;
    }

    this.getForm().findField('type').removeClass('x-propertyview-reader');
    this.getForm().findField('type').removeClass('x-propertyview-editor');
    this.getForm().findField('type').removeClass('x-propertyview-administrator');

    this.getForm().findField('type').addClass('x-propertyview-' + userRecord.getRoleName());
    this.getForm().setValues({
      type: 'Benutzer (' + userRecord.getRoleLabel() + ')',
      id: userRecord.data.id.toString(),
      username: userRecord.data.username,
      role: userRecord.getRoleLabel()
    });

  }

});