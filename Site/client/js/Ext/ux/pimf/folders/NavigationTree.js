Ext.namespace('Ext.ux', 'Ext.ux.pimf', 'Ext.ux.pimf.folders');

Ext.ux.pimf.folders.NavigationTree = Ext.extend(Ext.ux.pimf.folders.AbstractTree, {

  constructor: function() {

    Ext.ux.pimf.folders.NavigationTree.superclass.constructor.call(this, {
      id: 'NavigationTree'
    });

    this.storeObservers['FolderStore'].addListener('remoteload', function(folderRecords) {

      if(this.getNodeById('search') === undefined) {

        var searchNode = this.root.appendChild(new Ext.tree.TreeNode({
          text: 'Suche',
          id: 'search',
          cls: 'x-node-search x-node-main',
          sort: '0',
          hidden: true,
          selectAction: function() {
            Ext.getCmp('ItemGrid').activate();
            Ext.StoreMgr.get('ItemStore').remoteLoad(this.searchParameter);
          }
        }));
        searchNode.relayEvents(Ext.getCmp('SearchField'), ['search', 'endsearch']);
        searchNode.addListener('search', function(searchText) {

          this.unselect();

          this.attributes.searchParameter = {
            pattern: [
              {
                subject: 'any',
                comparator: 'has',
                value: searchText
              }
            ],
            logic: 'AND'
          };

          this.getUI().show();
          this.approvedSelect();

        });
        searchNode.addListener('endsearch', function() {

          this.unselect();

          this.getUI().hide();

        });
        searchNode.relayEvents(Ext.getCmp('SearchGrid'), ['extendedsearch']);
        searchNode.addListener('extendedsearch', function(searchGrid) {

          this.unselect();

          var searchRecords = searchGrid.getStore().getRange();
          var patterns = [];

          for(var searchRecordIndex = 0; searchRecordIndex < searchRecords.length; searchRecordIndex++) {
            patterns.push(searchRecords[searchRecordIndex].data);
          }

          this.attributes.searchParameter = {
            pattern: patterns,
            logic: searchGrid.getBottomToolbar().items.item(0).value
          };

          this.getUI().show();
          this.approvedSelect();

        });

        if(Ext.ux.pimf.Connection.getUserRole() >= 1) {

          this.root.appendChild(new Ext.tree.TreeNode({
            text: 'Regelverletzungen',
            id: 'ruleViolation',
            cls: 'x-node-ruleViolation x-node-main',
            sort: '01',
            selectAction: function() {
              Ext.getCmp('ItemGrid').activate();
              Ext.StoreMgr.get('ItemStore').remoteLoad({
                pattern: [
                  {
                    subject: 'ruleViolation',
                    comparator: 'is not empty',
                    value: ''
                  }
                ],
                logic: 'AND'
              });
            }
          }));

        }

        if(Ext.ux.pimf.Connection.getUserRole() === 2) {

          this.root.appendChild(new Ext.tree.TreeNode({
            text: 'Freie Eigenschaften',
            id: 'freeProperty',
            cls: 'x-node-freeProperty x-node-main',
            sort: '90',
            selectAction: function() {
              Ext.getCmp('FreePropertyGrid').activate();
              Ext.StoreMgr.get('FreePropertyStore').remoteLoad();
            }
          }));

          this.root.appendChild(new Ext.tree.TreeNode({
            text: 'Benutzer',
            id: 'user',
            cls: 'x-node-user x-node-main',
            sort: '91',
            selectAction: function() {
              Ext.getCmp('UserGrid').activate();
              Ext.StoreMgr.get('UserStore').remoteLoad();
            }
          }));

        }

      }

    });
    this.getSelectionModel().addListener('selectionchange', function(selectionModel, node) {

      if(node === null) {

        Ext.getCmp('BlankGrid').activate();

      } else if(node.attributes.selectAction !== undefined) {

        node.attributes.selectAction();

      } else {

        Ext.getCmp('ItemGrid').activate();
        Ext.StoreMgr.get('ItemStore').remoteLoad({
          pattern: [
            {
              subject: 'parentFolderId',
              comparator: 'is',
              value: node.attributes.record.data.id
            }
          ],
          logic: 'AND'
        });

      }

    });

  },

  isSelectedNodeSpecial: function() {
    return this.getSelectedNodeId() === 'search' || this.getSelectedNodeId() === 'ruleViolation' || this.getSelectedNodeId() === 'freeProperty' || this.getSelectedNodeId() === 'user';
  }

});
