Ext.namespace('Ext.ux', 'Ext.ux.pimf', 'Ext.ux.pimf.images');

Ext.ux.pimf.images.ImageField = Ext.extend(Ext.form.CompositeField, {

  constructor: function(hiddenFieldConfiguration) {

    Ext.ux.pimf.images.ImageField.superclass.constructor.call(this, {
      hideLabel: true,
      items:[
        Ext.apply(new Ext.form.Hidden(hiddenFieldConfiguration), {
          setValue: function(value) {

            var info;

            if(value === 0) {

              info = {
                id: '-',
                type: '-',
                tag: Ext.StoreMgr.get('ImageStore').getTag(0)
              };

            } else {

              info = {
                id: value.toString(),
                type: 'JPG',
                tag: Ext.StoreMgr.get('ImageStore').getTag(value)
              };

            }

            var imageInfoTpl = new Ext.XTemplate(
              '<p style="padding-bottom: 3px; ">ID: {id}</p>',
              '<p style="padding-bottom: 3px; ">Typ: {type}</p>'
            );
            imageInfoTpl.overwrite(this.ownerCt.items.item(1).items.item(1).items.item(0).body, info);

            Ext.form.Hidden.prototype.setValue.call(this, value);
            this.ownerCt.items.item(1).items.item(0).setValue(info.tag);

          }
        }),
        new Ext.Panel({
          flex: 1,
          layout: 'hbox',
          layoutConfig: {
            align: 'stretchmax'
          },
          items: [
            new Ext.form.DisplayField({
              width: 100,
              height: 100,
              cls: 'x-image-display',
              hideLabel: true
            }),
            new Ext.Panel({
              unstyled: true,
              layout: 'vbox',
              padding: '10px 10px 10px 0',
              flex: 1,
              layoutConfig: {
                align: 'stretch'
              },
              items: [
                new Ext.Panel({
                  unstyled: true,
                  padding: '0 0 10px 0',
                  flex: 1
                }),
                new Ext.Panel({
                  unstyled: true,
                  layout: 'hbox',
                  layoutConfig: {
                    align: 'stretchmax'
                  },
                  items: [
                    new Ext.Button({
                      imageField: this,
                      text: 'Auswählen',
                      icon: 'images/led-icons/add.png',
                      margins: '0 5 0 0',
                      handler: function(button, event) {
                        new Ext.ux.pimf.images.BrowserWindow(button.ownerCt.ownerCt.ownerCt.ownerCt.items.item(0), button.imageField.ownerCt.form.getValues().name).show(this.getEl());
                      }
                    }),
                    new Ext.Button({
                      text: 'Entfernen',
                      icon: 'images/led-icons/cross.png',
                      margins: '0 5 0 0',
                      handler: function(button, event) {
                        button.ownerCt.ownerCt.ownerCt.ownerCt.items.item(0).setValue(0);
                      }
                    })
                  ]
                })
              ]
            })
          ]
        })
      ]
    });

  }

});