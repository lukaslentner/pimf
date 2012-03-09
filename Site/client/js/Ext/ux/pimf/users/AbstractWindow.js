Ext.namespace('Ext.ux', 'Ext.ux.pimf', 'Ext.ux.pimf.users');

Ext.ux.pimf.users.AbstractWindow = Ext.extend(Ext.Window, {

  constructor: function(title) {

    Ext.ux.pimf.users.AbstractWindow.superclass.constructor.call(this, {
      title: title,
      modal: true,
      resizable: false,
      width: 400,
      autoHeight: true,
      buttons: [
        new Ext.Button({
          text: 'Abbrechen',
          icon: 'images/led-icons/cancel.png',
          handler: function(button, event) {
            this.ownerCt.ownerCt.close();
          }
        }),
        new Ext.Button({
          text: 'Speichern',
          icon: 'images/led-icons/disk.png',
          handler: function(button, event) {
            this.ownerCt.ownerCt.save();
          }
        })
      ],
      layout: 'fit',
      items: [
        new Ext.form.FormPanel({
          autoHeight: true,
          defaults: {
            anchor: '100%'
          },
          border: false,
          padding: '10px 10px 6px 10px',
          items: [
            new Ext.form.DisplayField({
              name: 'id',
              fieldLabel: 'ID'
            }),
            new Ext.form.TextField({
              name: 'username',
              fieldLabel: 'Benutzername',
              ref: '../defaultButton',
              listeners: {
                specialkey: function(component, event) {

                  if(event.getKey() === event.ENTER) {
                    this.ownerCt.ownerCt.buttons[1].handler(this.ownerCt.ownerCt.buttons[1], {});
                  }

                }
              }
            }),
            new Ext.form.ComboBox({
              fieldLabel: 'Rolle',
              editable: false,
              mode: 'local',
              hiddenName: 'role',
              triggerAction: 'all',
              store: new Ext.data.ArrayStore({
                data: Ext.StoreMgr.get('UserStore').roleLabels.includeIndex(),
                fields: [
                  'id',
                  'label'
                ],
                idIndex: 0
              }),
              valueField: 'id',
              displayField: 'label',
              value: 0
            }),
            new Ext.form.FieldSet({
              title: 'Passwort setzen',
              collapsed: true,
              checkboxToggle: true,
              checkboxName: 'setPassword',
              autoHeight: true,
              layout: 'fit',
              items: [
                new Ext.form.TextField({
                  name: 'password',
                  inputType: 'password',
                  listeners: {
                    specialkey: function(component, event) {

                      if(event.getKey() === event.ENTER) {
                        this.ownerCt.ownerCt.ownerCt.buttons[1].handler(this.ownerCt.ownerCt.ownerCt.buttons[1], {});
                      }

                    }
                  }
                })
              ],
              listeners: {
                expand: function(panel, animate) {
                  panel.ownerCt.ownerCt.syncShadow();
                },
                collapse: function(panel, animate) {
                  panel.ownerCt.ownerCt.syncShadow();
                }
              }
            })
          ]
        })
      ]
    });

  }

});