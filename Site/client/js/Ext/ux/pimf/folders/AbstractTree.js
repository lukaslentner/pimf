Ext.namespace('Ext.ux', 'Ext.ux.pimf', 'Ext.ux.pimf.folders');

Ext.ux.pimf.folders.AbstractTree = Ext.extend(Ext.tree.TreePanel, {

  constructor: function(configurationOfParameter) {

    var configurationOfComponent = {
      renderCheckboxes: false,
      border: false,
      containerScroll: true,
      ddScroll: true,
      autoScroll: true,
      selModel: new Ext.tree.DefaultSelectionModel({
        approvedSelectFlag: false,
        approvedSelect: function(node) {

          this.approvedSelectFlag = true;

          if(node === undefined) {
            this.clearSelections();
          } else {
            node.ensureVisible();
            node.select();
          }

          this.approvedSelectFlag = false;

        },
        listeners: {
          beforeselect: function(selectionModel, newNode, oldNode) {

            if(!selectionModel.approvedSelectFlag) {
              return false;
            }

          }
        }
      }),
      store: Ext.StoreMgr.get('FolderStore'),
      root: new Ext.tree.TreeNode({
        id: '0'
      }),
      rootVisible: false,
      enableDD: true,
      ddGroup: 'FoldersMove&ItemsLink',
      dropConfig: {
        allowDrop: true,
        appendOnly: true,
        ddGroup: 'FoldersMove&ItemsLink',
        prepareDDParameters: function(nodeData, source, event, data) {

          var noAnswer = {
            action: undefined,
            checkAction: function() {
              return false;
            },
            getProxyCls: function() {
              return 'x-dd-drop-nodrop';
            }
          };

          if(nodeData.node.attributes.record === undefined) {
            return noAnswer;
          }

          if(data.selections !== undefined) {// Records come from the grid

            if(data.selections[0].data.type === 'item') {

              return {
                action: event.altKey ? 'unlink' : 'link',
                checkAction: function() {
                  return Ext.StoreMgr.get('ItemStore').checkItemsLink(this.sourceItemRecords, this.targetFolderRecord);
                },
                getProxyCls: function() {
                  return this.checkAction() ? (event.altKey ? 'x-dd-drop-unlink' : 'x-dd-drop-link') : 'x-dd-drop-nodrop';
                },
                sourceItemRecords: data.selections,
                targetFolderRecord: nodeData.node.attributes.record
              };

            } else if(Ext.StoreMgr.get('FolderStore').isFolderType(data.selections[0].data.type)) {

              return {
                action: 'move',
                checkAction: function() {
                  return Ext.StoreMgr.get('FolderStore').checkFoldersMove(this.sourceFolderRecords, this.targetFolderRecord);
                },
                getProxyCls: function() {
                  return this.checkAction() ? 'x-dd-drop-move' : 'x-dd-drop-nodrop';
                },
                sourceFolderRecords: Ext.StoreMgr.get('ItemStore').getFolderRecordsOfItemRecords(data.selections),
                targetFolderRecord: nodeData.node.attributes.record
              };

            } else {

              return noAnswer;

            }

          } else if(data.node !== undefined) {// Record comes from the tree

            if(data.node.attributes.record === undefined) {
              return noAnswer;
            }

            return {
              action: 'move',
              checkAction: function() {
                return Ext.StoreMgr.get('FolderStore').checkFoldersMove(this.sourceFolderRecords, this.targetFolderRecord);
              },
              getProxyCls: function() {
                return this.checkAction() ? 'x-dd-drop-move' : 'x-dd-drop-nodrop';
              },
              sourceFolderRecords: [data.node.attributes.record],
              targetFolderRecord: nodeData.node.attributes.record
            };

          } else {

            return noAnswer;

          }

        },
        onNodeOver: function(nodeData, source, event, data) {

          var dDParameters = this.prepareDDParameters(nodeData, source, event, data);

          return dDParameters.getProxyCls();

        },
        onNodeDrop: function(nodeData, source, event, data) {

          var dDParameters = this.prepareDDParameters(nodeData, source, event, data);

          if(dDParameters.checkAction()) {

            if(dDParameters.action === 'move') {
              Ext.StoreMgr.get('FolderStore').remoteMove(dDParameters.sourceFolderRecords.extractProperty('data').extractProperty('id'), dDParameters.targetFolderRecord.data.id);
            }

            if(dDParameters.action === 'link') {
              Ext.StoreMgr.get('ItemStore').remoteLink(dDParameters.sourceItemRecords.extractProperty('data').extractProperty('id'), dDParameters.targetFolderRecord.data.id);
            }

            if(dDParameters.action === 'unlink') {
              Ext.StoreMgr.get('ItemStore').remoteUnlink(dDParameters.sourceItemRecords.extractProperty('data').extractProperty('id'), dDParameters.targetFolderRecord.data.id);
            }

            return true;

          } else {

            return false;

          }

        }
      }
    };

    Ext.apply(configurationOfComponent, configurationOfParameter);

    Ext.ux.pimf.folders.AbstractTree.superclass.constructor.call(this, configurationOfComponent);

    Ext.ux.pimf.StoreObserver.create({
      storeId: 'FolderStore',
      scope: this,
      events: ['remoteload', 'remotenew', 'remoteedit', 'remotemove', 'remoteremove'],
      listeners: {
        remoteload: function(folderRecords) {

          var selectedNodeId = this.getSelectedNodeId();
          this.getSelectionModel().clearSelections();

          var refreshChildren = function(parentTreeNode, handle) {

            var childTreeNodeIds = parentTreeNode.childNodes.extractProperty('id');

            var folderRecords = Ext.StoreMgr.get('FolderStore').query('parentFolderId', new RegExp('^' + parentTreeNode.id + '$'), true, true);
            folderRecords.each(function(folderRecord, index, length) {

              var childTreeNode = this.parentTreeNode.findChild('id', folderRecord.data.id.toString());
              if(childTreeNode === null) {

                childTreeNode = this.parentTreeNode.appendChild(new Ext.tree.TreeNode({
                  text: folderRecord.data.name,
                  id: folderRecord.data.id.toString(),
                  cls: 'x-node-' + folderRecord.data.type + (folderRecord.data.parentFolderId === 0 ? ' x-node-main' : ''),
                  sort: (folderRecord.data.parentFolderId === 0 ? folderRecord.data.id.toString() : folderRecord.data.name.toLowerCase()),
                  checked: this.parentTreeNode.getOwnerTree().renderCheckboxes ? false : undefined,
                  record: folderRecord
                }));

              } else {

                childTreeNode.setText(folderRecord.data.name);
                childTreeNode.setCls('x-node-' + folderRecord.data.type + (folderRecord.data.parentFolderId === 0 ? ' x-node-main' : ''));
                childTreeNode.attributes.sort = (folderRecord.data.parentFolderId === 0 ? folderRecord.data.id.toString() : folderRecord.data.name.toLowerCase());
                childTreeNode.getUI().toggleCheck(false);
                childTreeNode.attributes.record = folderRecord;

              }

              this.childTreeNodeIds.remove(childTreeNode.id);

              this.handle(childTreeNode, this.handle);

            }, {
             childTreeNodeIds: childTreeNodeIds,
             handle: handle,
             parentTreeNode: parentTreeNode
            });

            for(var childTreeNodeIdIndex = 0; childTreeNodeIdIndex < childTreeNodeIds.length; childTreeNodeIdIndex++) {
              var lostChildTreeNode = parentTreeNode.findChild('id', childTreeNodeIds[childTreeNodeIdIndex]);
              if(lostChildTreeNode.attributes.record !== undefined) {
                lostChildTreeNode.remove(true);
              }
            }

          };
          refreshChildren(this.root, refreshChildren);

          var selectedNode = this.getNodeById(selectedNodeId);
          if(selectedNode !== undefined) {
            selectedNode.approvedSelect();
          }

        },
        remotenew: function(folderRecord) {

          var folderData = folderRecord.data;

          this.getNodeById(folderData.parentFolderId.toString()).appendChild(new Ext.tree.TreeNode({
            text: folderData.name,
            id: folderData.id.toString(),
            cls: 'x-node-' + folderData.type,
            sort: folderData.name.toLowerCase(),
            checked: this.renderCheckboxes ? false : undefined,
            record: folderRecord
          }));

        },
        remoteedit: function(folderRecord) {

          var folderData = folderRecord.data;
          var folderNode = this.getNodeById(folderData.id.toString());

          folderNode.setText(folderData.name);
          folderNode.attributes.sort = folderData.name.toLowerCase();

        },
        remotemove: function(folderRecords, newParentFolderRecord) {

          var newParentFolderNode = this.getNodeById(newParentFolderRecord.data.id.toString());

          for(var folderRecordIndex = 0; folderRecordIndex < folderRecords.length; folderRecordIndex++) {
            var folderNode = this.getNodeById(folderRecords[folderRecordIndex].data.id.toString());
            newParentFolderNode.expand(false, false);
            var wasSelected = folderNode.isSelected();
            newParentFolderNode.appendChild(folderNode);
            if(wasSelected) {
              folderNode.getOwnerTree().getSelectionModel().approvedSelect(folderNode);
            }
          }

        },
        remoteremove: function(folderRecords) {

          for(var folderRecordIndex = 0; folderRecordIndex < folderRecords.length; folderRecordIndex++) {
            this.getNodeById(folderRecords[folderRecordIndex].data.id.toString()).remove();
          }

        }
      }
    });

    this.addListener('click', function(node, event) {

      this.getSelectionModel().approvedSelect(node);

    });
    this.addListener('containercontextmenu', function(tree, event) {

      event.stopEvent();

    });
    this.addListener('contextmenu', function(node, event) {

      event.stopEvent();

      if(!Ext.ux.pimf.Connection.locked) {
        return false;
      }
      if(node.id === 'search' || node.id === 'ruleViolation' || node.id === 'freeProperty' || node.id === 'user') {
        return false;
      }

      var contextmenu = new Ext.menu.Menu({
        items: [
          new Ext.menu.Item({
            text: 'Klonen',
            iconCls: 'x-menu-clone',
            disabled: node.attributes.record.data.parentFolderId === 0,
            scope: node,
            handler: function(button, event) {
              new Ext.ux.pimf.folders.CloneDialog([this.attributes.record]).show(button.getEl());
            }
          }),
          new Ext.menu.Item({
            text: 'Bearbeiten',
            iconCls: 'x-menu-edit',
            disabled: node.attributes.record.data.parentFolderId === 0,
            scope: node,
            handler: function(button, event) {
              new Ext.ux.pimf.folders.EditWindow(this.attributes.record).show(button.getEl());
            }
          }),
          new Ext.menu.Item({
            text: 'Löschen',
            iconCls: 'x-menu-remove',
            disabled: node.attributes.record.data.parentFolderId === 0,
            scope: node,
            handler: function(button, event) {
              new Ext.ux.pimf.folders.RemoveDialog([this.attributes.record]).show(button.getEl());
            }
          }),
          new Ext.menu.Separator(),
          new Ext.menu.Item({
            text: 'Neu',
            iconCls: 'x-menu-new',
            scope: node,
            handler: function(button, event) {
              new Ext.ux.pimf.folders.NewWindow(this.attributes.record).show(button.getEl());
            }
          })
        ]
      });
      var coords = event.getXY();
      contextmenu.showAt([coords[0] + 5, coords[1] + 5]);

    });

    this.sorter = new Ext.tree.TreeSorter(this, {
      caseSensitive: false,
      property: 'sort'
    });

  },

  getSelectedNode: function() {
    return this.getSelectionModel().getSelectedNode() === null ? undefined : this.getSelectionModel().getSelectedNode();
  },

  getSelectedNodeId: function() {

    if(this.getSelectedNode() === undefined) {
      return undefined;
    } else {
      return this.getSelectedNode().id;
    }

  },

  getSelectedNodeFolderRecord: function() {

    if(this.getSelectedNode() === undefined) {
      return undefined;
    } else {
      return this.getSelectedNode().attributes.record;
    }

  }

});
