Ext.namespace('Ext.ux', 'Ext.ux.pimf', 'Ext.ux.pimf.misc');

Ext.ux.pimf.misc.BlankPropertyView = Ext.extend(Ext.Panel, {

  constructor: function() {

    Ext.ux.pimf.misc.BlankPropertyView.superclass.constructor.call(this, {
      id: 'BlankPropertyView',
      border: false,
      html: '<div class="x-grid-empty">Bitte wählen Sie links im Browser ein Objekt aus, um sich hier dessen Eigenschaften anzeigen zu lassen!</div>'
    });

  },

  activate: function() {

    this.ownerCt.layout.setActiveItem(this.id);

  }

});
