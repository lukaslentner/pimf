Ext.namespace('Ext.ux', 'Ext.ux.pimf', 'Ext.ux.pimf.search');

Ext.ux.pimf.search.Field = Ext.extend(Ext.form.TwinTriggerField, {

  constructor: function() {

    Ext.ux.pimf.search.Field.superclass.constructor.call(this, {
      id: 'SearchField',
      emptyText: '...',
      emptyClass: 'u-form-trigger-empty',
      extendedMode: false,
      hideTrigger1: true,
      listeners: {
        specialkey: function(component, event) {

          if(event.getKey() === event.ENTER) {

            this.triggers[0].show();
            this.fireEvent('search', this.getRawValue());

          }

        }
      },
      onTrigger1Click: function(event) {

        if(this.extendedMode) {
          this.toggleExtendedMode();
        }

        this.triggers[0].hide();
        this.setValue('');

        this.fireEvent('endsearch');

      },
      onTrigger2Click: function(event) {
        this.toggleExtendedMode();
      },
      toggleExtendedMode: function() {

        this.triggers[1].dom.className = 'x-form-trigger u-form-trigger-' + (this.extendedMode ? 'up' : 'down');
        Ext.getCmp('SearchGrid').toggleCollapse(false);
        this.extendedMode = !this.extendedMode;

      },
      trigger1Class: 'u-form-trigger-clear',
      trigger2Class: 'u-form-trigger-up',
      flex: 1
    });

    this.addEvents('search', 'endsearch');

  }

});