Ext.namespace('Ext.ux', 'Ext.ux.pimf', 'Ext.ux.pimf.misc');

Ext.ux.pimf.misc.LoginWindow = Ext.extend(Ext.Window, {

  constructor: function() {

    Ext.ux.pimf.misc.LoginWindow.superclass.constructor.call(this, {
      title: 'Login',
      modal: true,
      resizable: false,
      closable: false,
      width: 300,
      autoHeight: true,
      buttons: [
        new Ext.Button({
          text: 'Login',
          icon: 'images/led-icons/key.png',
          handler: function(button, event) {

            var userData = this.ownerCt.ownerCt.items.item(0).getForm().getValues();
            userData.password = Ext.ux.crypto.SHA1.hash(userData.password);
            userData.role = 0;

            Ext.ux.pimf.Connection.login(userData);

          }
        })
      ],
      layout: 'auto',
      items: [
        new Ext.form.FormPanel({
          defaults: {
            anchor: '100%'
          },
          border: false,
          padding: '10px 10px 6px 10px',
          items: [
            new Ext.form.TextField({
              name: 'username',
              fieldLabel: 'Benutzername',
              ref: '../defaultButton',
              listeners: {
                specialkey: function(component, event) {

                  if(event.getKey() === event.ENTER) {
                    this.ownerCt.ownerCt.buttons[0].handler(this.ownerCt.ownerCt.buttons[0], {});
                  }

                }
              }
            }),
            new Ext.form.TextField({
              name: 'password',
              fieldLabel: 'Passwort',
              inputType: 'password',
              listeners: {
                specialkey: function(component, event) {

                  if(event.getKey() === event.ENTER) {
                    this.ownerCt.ownerCt.buttons[0].handler(this.ownerCt.ownerCt.buttons[0], {});
                  }

                }
              }
            })
          ]
        })
      ]
    });

    this.relayEvents(Ext.ux.pimf.Connection, ['login']);
    this.addListener('login', function() {

      this.close();

    });

  }

});