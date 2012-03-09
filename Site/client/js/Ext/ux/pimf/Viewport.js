Ext.namespace('Ext.ux', 'Ext.ux.pimf');

Ext.ux.pimf.Viewport = Ext.extend(Ext.Viewport, {

  constructor: function() {

    Ext.ux.pimf.Viewport.superclass.constructor.call(this, {
      layout: 'border',
      items: [
        new Ext.Panel({
          region: 'north',
          height: 39,
          border: false,
          bodyStyle: 'background-image: url(images/header-background.gif); color: #FFF; ',
          layout: 'border',
          items: [
            new Ext.Panel({
              region: 'center',
              unstyled: true,
              html: '<h1 style="padding: 5px; font-weight: normal; font: 17px arial,tahoma,helvetica,sans-serif; "><span style="font-size: 1.2em; ">Praktikum Inventar<\/span> <span style="font-size: 0.7em; ">der Physik Fakultät der Ludwig-Maximilian-Universität, München<\/span><\/h1>'
            }),
            new Ext.Panel({
              region: 'east',
              width: 400,
              unstyled: true,
              items: [
                new Ext.ux.pimf.misc.LogoutButton(),
                new Ext.ux.pimf.misc.LockButton()
              ]
            })
          ]
        }),
        new Ext.Panel({
          region: 'west',
          split: true,
          border: false,
          style: 'border-width: 0 1px 0 0; ',
          collapsible: true,
          floatable: false,
          plugins: [
            new Ext.ux.ToolsTips({
              tips: {
                expand: 'Navigation ausklappen',
                refresh: 'Aktualisieren'
              }
            })
          ],
          toolTemplate: new Ext.XTemplate(
            '<tpl if="id==\'collapse-west\'">',
              '<div class="x-tool x-tool-{id} displayblock">&#160;</div>',
            '</tpl>',
            '<tpl if="id!=\'collapse-west\'">',
              '<div class="x-tool x-tool-{id}">&#160;</div>',
            '</tpl>'
          ),
          tools: [
            {
              id: 'refresh',
              handler: function(event, toolEl, panel, toolConfig) {
                Ext.StoreMgr.get('FolderStore').remoteLoad();
              }
            },
            {
              id: 'separator1',
              handler: function() {}
            },
            {
              id: 'collapseAll',
              qtip: 'Alle reduzieren',
              handler: function(event, toolEl, panel, toolConfig) {
                panel.items.item(0).getRootNode().collapse(true);
              }
            },
            {
              id: 'expandAll',
              qtip: 'Alle erweitern',
              handler: function(event, toolEl, panel, toolConfig) {
                panel.items.item(0).getRootNode().expand(true);
              }
            },
            {
              id: 'separator2',
              handler: function() {}
            },
            {
              id: 'collapse-west',
              qtip: 'Navigation einklappen',
              handler: function(event, toolEl, panel, toolConfig) {
                panel.collapse();
              }
            }
          ],
          width: 300,
          title: 'Navigation',
          margins: '0',
          cmargins: '0',
          layout: 'fit',
          items: [
            new Ext.ux.pimf.folders.NavigationTree()
          ]
        }),
        new Ext.Panel({
          region: 'center',
          layout: 'border',
          margins: '0',
          border: false,
          style: 'border-width: 0 1px 0 1px; ',
          title: 'Browser',
          items: [
            new Ext.Panel({
              region: 'center',
              border: false,
              layout: 'card',
              activeItem: 0,
              items: [
                new Ext.ux.pimf.misc.BlankGrid(),
                new Ext.ux.pimf.freeProperties.Grid(),
                new Ext.ux.pimf.items.Grid(),
                new Ext.ux.pimf.users.Grid()
              ],
              bbar: new Ext.Toolbar({
                layout: 'HBox',
                items: [
                  new Ext.Toolbar.TextItem({
                    text: 'Suche:',
                    style: 'font-weight: bold; padding-top: 3px; padding-right: 10px; '
                  }),
                  new Ext.ux.pimf.search.Field()
                ]
              })
            }),
            new Ext.ux.pimf.search.Grid()
          ]
        }),
        new Ext.Panel({
          region: 'east',
          split: true,
          border: false,
          style: 'border-width: 0 0 0 1px; ',
          collapsible: true,
          floatable: false,
          plugins: [
            new Ext.ux.ToolsTips({
              tips: {
                toggle: 'Eigenschaften einklappen',
                expand: 'Eigenschaften ausklappen'
              }
            })
          ],
          width: 300,
          title: 'Eigenschaften',
          margins: '0',
          cmargins: '0',
          layout: 'card',
          activeItem: 0,
          items: [
            new Ext.ux.pimf.misc.BlankPropertyView(),
            new Ext.ux.pimf.misc.MultiPropertyView(),
            new Ext.ux.pimf.folders.PropertyView(),
            new Ext.ux.pimf.freeProperties.PropertyView(),
            new Ext.ux.pimf.items.PropertyView(),
            new Ext.ux.pimf.users.PropertyView()
          ]
        })
      ]
    });

  }

});
