Ext.namespace('Ext.ux', 'Ext.ux.pimf', 'Ext.ux.pimf.freeProperties');

Ext.ux.pimf.freeProperties.AbstractWindow = Ext.extend(Ext.Window, {

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
              name: 'name',
              fieldLabel: 'Name',
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
              fieldLabel: 'Format',
              editable: false,
              mode: 'local',
              hiddenName: 'format',
              triggerAction: 'all',
              store: new Ext.data.ArrayStore({
                data: Ext.ux.pimf.Util.includeKey(Ext.StoreMgr.get('FreePropertyStore').formatLabels),
                fields: [
                  'name',
                  'label'
                ],
                idIndex: 0
              }),
              valueField: 'name',
              displayField: 'label',
              value: 'string'
            }),
            new Ext.form.NumberField({
              name: 'columnWidth',
              fieldLabel: 'Standard Breite',
              value: 80,
              listeners: {
                specialkey: function(component, event) {

                  if(event.getKey() === event.ENTER) {
                    this.ownerCt.ownerCt.buttons[1].handler(this.ownerCt.ownerCt.buttons[1], {});
                  }

                }
              }
            }),
            new Ext.form.CheckboxGroup({
              fieldLabel: 'Regeln',
              columns: 2,
              items: [
                new Ext.form.Checkbox({
                  name: 'unique',
                  boxLabel: Ext.StoreMgr.get('FreePropertyStore').ruleLabels['unique']
                }),
                new Ext.form.Checkbox({
                  name: 'readOnly',
                  boxLabel: Ext.StoreMgr.get('FreePropertyStore').ruleLabels['readOnly']
                }),
                new Ext.form.Checkbox({
                  name: 'mandatory',
                  boxLabel: Ext.StoreMgr.get('FreePropertyStore').ruleLabels['mandatory']
                }),
                new Ext.form.Checkbox({
                  name: 'afterToday',
                  boxLabel: Ext.StoreMgr.get('FreePropertyStore').ruleLabels['afterToday']
                }),
                new Ext.form.Checkbox({
                  name: 'notEmpty',
                  boxLabel: Ext.StoreMgr.get('FreePropertyStore').ruleLabels['notEmpty']
                })
              ]
            })
          ]
        })
      ]
    });

  }

});
