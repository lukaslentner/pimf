Ext.override(Ext.tree.TreeNode, {
  approvedSelect: function() {
    this.getOwnerTree().getSelectionModel().approvedSelect(this);
  }
});