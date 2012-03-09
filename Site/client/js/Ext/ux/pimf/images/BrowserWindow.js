Ext.namespace('Ext.ux', 'Ext.ux.pimf', 'Ext.ux.pimf.images');

Ext.ux.pimf.images.BrowserWindow = Ext.extend(Ext.Window, {

  constructor: function(field, nameSuggestion) {

    Ext.ux.pimf.images.BrowserWindow.superclass.constructor.call(this, {
      title: 'Bild auswählen',
      modal: true,
      resizable: false,
      width: 750,
      height: 500,
      buttons: [
        new Ext.Button({
          text: 'Abbrechen',
          icon: 'images/led-icons/cancel.png',
          handler: function(button, event) {

            this.ownerCt.ownerCt.close();

          }
        }),
        new Ext.Button({
          text: 'Auswählen',
          icon: 'images/led-icons/add.png',
          handler: function(button, event) {

            var selections = this.ownerCt.ownerCt.items.item(0).getSelectedRecords();

            if(selections.length === 1) {
              this.ownerCt.ownerCt.field.setValue(selections[0].data.id);
              this.ownerCt.ownerCt.close();
            }

          }
        })
      ],
      tbar: new Ext.Toolbar({
        layout: 'fit',
        items: [
          new Ext.form.TriggerField({
            refOwner: this, // For the event handler to know the window object
            triggerClass: 'u-form-trigger-clear',
            hideTrigger: true,
            emptyText: 'Suche',
            emptyClass: 'u-form-trigger-empty',
            listeners: {
              specialkey: function(component, event) {

                if(event.getKey() === event.ENTER) {

                  Ext.StoreMgr.get('ImageStore').remoteLoad({
                    search: this.getRawValue()
                  });

                  this.setHideTrigger(false);

                }

              },
              added: function(component, ownerCt, index) {

                this.refName = 'defaultButton';
                this.refOwner.defaultButton = this;

              }
            },
            onTriggerClick: function(event) {

              Ext.StoreMgr.get('ImageStore').removeAll();

              this.setValue('');
              this.setHideTrigger(true);

            }
          })
        ]
      }),
      bbar: new Ext.Toolbar({
        layout: 'fit',
        items: [
          new Ext.FormPanel({
            border: false,
            fileUpload: true,
            autoHeight: true,
            layout: 'hbox',
            layoutConfig: {
              align: 'middle'
            },
            items: [
              new Ext.form.TextField({
                name: 'name',
                emptyText: 'Name',
                value: nameSuggestion,
                flex: 1
              }),
              new Ext.ux.form.FileUploadField({
                name: 'file',
                buttonOnly: true,
                buttonText: 'Durchsuchen'
              }),
              new Ext.Button({
                text: 'Hochladen',
                icon: 'images/arrow_up.png',
                handler: function(button, event) {

                  button.ownerCt.ownerCt.ownerCt.items.item(0).getStore().remoteNew({
                    id: 0,
                    name: button.ownerCt.items.item(0).getValue()
                  }, button.ownerCt.getForm());

                }
              })
            ]
          })
        ]
      }),
      layout: 'fit',
      items: [
        new Ext.DataView({
          id: 'ImageDataView',
          autoScroll: true,
          tpl: new Ext.XTemplate(
            '<tpl for=".">',
              '<div class="x-view-thumb">',
                '<div><img src="' + Ext.SOFTWARE_URL + 'data/images/thumbnails/' + '{id}.jpeg" title="ID: {id}"></div>',
                '<span title="{name}">{name}</span>',
              '</div>',
            '</tpl>',
            '<div class="x-clear"></div>'
          ),
          store: Ext.StoreMgr.get('ImageStore'),
          emptyText: '<div class="x-grid-empty">Es wurden keine Daten gefunden!</div>',
          singleSelect: true,
          overClass:'x-view-over',
          itemSelector:'div.x-view-thumb',
          style: 'background-color: #FFFFFF; ',
          listeners: {
            contextmenu: function(dataView, index, node, event) {

              event.stopEvent();

              dataView.select(node);

              var contextmenu = new Ext.menu.Menu({
                items: [
                  new Ext.menu.Item({
                    text: 'Orginal ansehen',
                    iconCls: 'x-menu-magnifier',
                    scope: {
                      dataView: dataView,
                      node: node
                    },
                    handler: function(button, event) {
                      var imageId = this.dataView.getRecord(this.node).data.id;
                      if(imageId !== 0) {
                        window.open(Ext.SOFTWARE_URL + 'data/images/' + imageId.toString() + '.jpeg');
                      }
                    }
                  }),
                  new Ext.menu.Item({
                    text: 'Umbennen',
                    iconCls: 'x-menu-rename',
                    scope: {
                      dataView: dataView,
                      node: node
                    },
                    handler: function(button, event) {
                      new Ext.ux.pimf.images.RenameDialog(this.dataView.getRecord(this.node)).show(button.getEl());
                    }
                  }),
                  new Ext.menu.Item({
                    text: 'Löschen',
                    iconCls: 'x-menu-remove',
                    scope: {
                      dataView: dataView,
                      node: node
                    },
                    handler: function(button, event) {
                      new Ext.ux.pimf.images.RemoveDialog(this.dataView.getRecord(this.node)).show(button.getEl());
                    }
                  })
                ]
              });

              var coords = event.getXY();
              contextmenu.showAt([coords[0] + 5, coords[1] + 5]);

            },
            dblclick: function(dataView, index, node, event) {
              dataView.ownerCt.field.setValue(dataView.getRecord(node).data.id);
              dataView.ownerCt.close();
            }
          }
        })
      ]
    });

    this.field = field;

    if(this.field.value === 0) {

      Ext.StoreMgr.get('ImageStore').removeAll();

    } else {

      Ext.StoreMgr.get('ImageStore').remoteLoad({
        id: this.field.value
      });

    }

  }

});
