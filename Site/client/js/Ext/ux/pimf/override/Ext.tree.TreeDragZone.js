Ext.override(Ext.tree.TreeDragZone, {
  beforeInvalidDrop: function(event, id) {},
  afterRepair: function() {
    this.dragging = false;
  },
  onInitDrag: function(e){
    var data = this.dragData;
    this.tree.getSelectionModel().select(data.node);
    this.proxy.update("");
    data.node.ui.appendDDGhost(this.proxy.ghost.dom);
    this.tree.fireEvent("startdrag", this.tree, data.node, e);
  }
});