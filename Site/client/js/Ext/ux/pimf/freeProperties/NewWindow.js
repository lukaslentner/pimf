Ext.namespace('Ext.ux', 'Ext.ux.pimf', 'Ext.ux.pimf.freeProperties');

Ext.ux.pimf.freeProperties.NewWindow = Ext.extend(Ext.ux.pimf.freeProperties.AbstractWindow, {

  constructor: function() {

    Ext.ux.pimf.freeProperties.NewWindow.superclass.constructor.call(this, 'Neue freie Eigenschaft');

    this.addListener('show', function(component) {

      this.items.item(0).getForm().setValues({
        id: '(neu)'
      });

    });

    Ext.ux.pimf.StoreObserver.create({
      storeId: 'FreePropertyStore',
      scope: this,
      events: ['remotenew'],
      listeners: {
        remotenew: function() {

          this.close();

        }
      }
    });

  },

  save: function() {

    var formData = this.items.item(0).getForm().getFieldValues();
    var rawData = this.items.item(0).getForm().getValues();

    Ext.StoreMgr.get('FreePropertyStore').remoteNew({
      id: 0,
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
