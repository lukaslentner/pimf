Ext.namespace('Ext.ux', 'Ext.ux.pimf', 'Ext.ux.pimf.items');

Ext.ux.pimf.items.AbstractWindow = Ext.extend(Ext.Window, {

  constructor: function(title) {

    this.tree = new Ext.ux.pimf.items.AbstractWindow_Tree();
    this.grid = new Ext.ux.pimf.items.AbstractWindow_Grid();

    Ext.ux.pimf.items.AbstractWindow.superclass.constructor.call(this, {
      title: title,
      modal: true,
      resizable: false,
      width: 600,
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
        new Ext.TabPanel({
          activeTab: 0,
          bodyStyle: 'background-color: inherit; ',
          border: false,
          items: [
            new Ext.form.FormPanel({
              title: 'Allgemein',
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
                  ref: '../../defaultButton',
                  listeners: {
                    specialkey: function(component, event) {

                      if(event.getKey() === event.ENTER) {
                        this.ownerCt.ownerCt.ownerCt.buttons[1].handler(this.ownerCt.ownerCt.ownerCt.buttons[1], {});
                      }

                    }
                  }
                }),
                new Ext.form.Label({
                  fieldLabel: 'Bild'
                }),
                new Ext.ux.pimf.images.ImageField({
                  name: 'image'
                }),
                new Ext.form.Label({
                  fieldLabel: 'Beschreibung'
                }),
                new Ext.form.TextArea({
                  name: 'description',
                  hideLabel: true,
                  height: 350
                })
              ]
            }),
            this.tree,
            this.grid
          ]
        })
      ]
    });

  }

});
