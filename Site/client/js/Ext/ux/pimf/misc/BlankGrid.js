Ext.namespace('Ext.ux', 'Ext.ux.pimf', 'Ext.ux.pimf.misc');

Ext.ux.pimf.misc.BlankGrid = Ext.extend(Ext.Panel, {

  constructor: function() {

    Ext.ux.pimf.misc.BlankGrid.superclass.constructor.call(this, {
      id: 'BlankGrid',
      border: false,
      html: '<div class="x-grid-empty">Bitte wählen Sie links im Navigationsbaum einen Ordner aus oder verwenden Sie die Suche!</div>'
    });

  },

  activate: function() {

    this.ownerCt.layout.setActiveItem(this.id);

  }

});