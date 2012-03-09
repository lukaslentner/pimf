Ext.namespace('Ext.ux', 'Ext.ux.pimf', 'Ext.ux.pimf.misc');

Ext.ux.pimf.misc.MultiPropertyView = Ext.extend(Ext.Panel, {

  constructor: function() {

    Ext.ux.pimf.misc.MultiPropertyView.superclass.constructor.call(this, {
      id: 'MultiPropertyView',
      border: false
    });

  },

  activate: function(count) {

    this.el.dom.innerHTML = '<div class="x-grid-empty">Sie haben ' + count + ' Objekte ausgewählt.<br /><br />Um spezifische Eigenschaften angezeigt zu bekommen, selektieren Sie bitte nur ein Objekt!</div>';
    this.ownerCt.layout.setActiveItem(this.id);

  }

});