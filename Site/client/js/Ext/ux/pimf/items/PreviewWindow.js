Ext.namespace('Ext.ux', 'Ext.ux.pimf', 'Ext.ux.pimf.items');

Ext.ux.pimf.items.PreviewWindow = Ext.extend(Ext.Window, {

  constructor: function() {

    Ext.ux.pimf.items.PreviewWindow.superclass.constructor.call(this, {
      title: 'Druckvorschau - Optionen',
      modal: true,
      resizable: false,
      width: 300,
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
          text: 'Druckvorschau',
          icon: 'images/led-icons/printer.png',
          handler: function(button, event) {

            this.ownerCt.ownerCt.items.item(0).preparedSubmit();
            this.ownerCt.ownerCt.close();

          }
        })
      ],
      layout: 'fit',
      items: [
        new Ext.form.FormPanel({
          standardSubmit: true,
          autoHeight: true,
          defaults: {
            anchor: '100%'
          },
          border: false,
          padding: '10px 10px 6px 10px',
          items: [
            new Ext.form.CheckboxGroup({
              hideLabel: true,
              columns: 1,
              items: [
                new Ext.form.Checkbox({
                  boxLabel: '<span title="Auch jeder Unterordner werden rekursiv durchsucht. Die Darstellung erfolgt hierarchisch als Baum.">Rekursives Auflisten</span>',
                  submitValue: false
                }),
                new Ext.form.Checkbox({
                  boxLabel: '<span title="Auch für jeden Unterordner wird ein Bericht erzeugt. Auf diese Weise lassen sich ganze Berichtsätze (z.B. für einen Raum) erstellen.">Rekursive Berichterstellung</span>',
                  submitValue: false
                })
              ]
            }),
            new Ext.form.Hidden({
              name: 'data'
            }),
            new Ext.form.Hidden({
              name: 'login'
            })
          ],
          preparedSubmit: function() {

            var data = Ext.decode(Ext.StoreMgr.get('ItemStore').lastOptions.params.data);

            Ext.apply(data, {
              recursiveTree: this.items.item(0).items.item(0).checked,
              recursiveReports: this.items.item(0).items.item(1).checked
            });

            this.getForm().setValues({
              data: Ext.util.JSON.encode(data),
              login: Ext.util.JSON.encode(Ext.ux.pimf.Connection.userData)
            });
            this.getForm().getEl().dom.target = '_blank';
            this.getForm().getEl().dom.action = Ext.SOFTWARE_URL + 'server/items/getAsReport.php';

            this.getForm().submit();

          }
        })
      ]
    });

  }

});
