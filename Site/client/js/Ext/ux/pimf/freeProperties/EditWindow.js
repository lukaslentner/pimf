Ext.namespace('Ext.ux', 'Ext.ux.pimf', 'Ext.ux.pimf.freeProperties');

Ext.ux.pimf.freeProperties.EditWindow = Ext.extend(Ext.ux.pimf.freeProperties.AbstractWindow, {

  constructor: function(freePropertyRecord) {

    Ext.ux.pimf.freeProperties.EditWindow.superclass.constructor.call(this, 'Bearbeite freie Eigenschaft');

    this.freePropertyData = freePropertyRecord.data;

    this.addListener('show', function(component) {

      this.items.item(0).getForm().setValues(this.freePropertyData);

    });

    Ext.ux.pimf.StoreObserver.create({
      storeId: 'FreePropertyStore',
      scope: this,
      events: ['remoteedit'],
      listeners: {
        remoteedit: function() {

          this.close();

        }
      }
    });

  },

  save: function() {

    var formData = this.items.item(0).getForm().getFieldValues();
    var rawData = this.items.item(0).getForm().getValues();

    Ext.StoreMgr.get('FreePropertyStore').remoteEdit({
      id: this.freePropertyData.id,
      name: formData.name,
      format: formData.format,
      columnWidth: formData.columnWidth,
      unique: rawData.unique === 'on',
      mandatory: rawData.mandatory === 'on',
      notEmpty: rawData.notEmpty === 'on',
      readOnly: rawData.readOnly === 'on',
      afterToday: rawData.afterToday === 'on'
    });

  }

});