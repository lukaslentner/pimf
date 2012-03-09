Ext.namespace('Ext.ux', 'Ext.ux.pimf');

Ext.ux.pimf.StoreObserver = Ext.extend(Ext.util.Observable, {

  relayEvents: function(eventNames) {

    Ext.ux.pimf.StoreObserver.superclass.relayEvents.call(this, Ext.StoreMgr.get(this.storeId), eventNames);

  },

  addListener: function(eventName, handler) {

    Ext.ux.pimf.StoreObserver.superclass.addListener.call(this, eventName, handler, this.scope);

  }

});

Ext.ux.pimf.StoreObserver.create = function(configuration) {

  var storeObserver = new Ext.ux.pimf.StoreObserver();

  storeObserver.scope = configuration.scope;
  storeObserver.storeId = configuration.storeId;

  storeObserver.relayEvents(configuration.events);

  for(var eventName in configuration.listeners) {

    storeObserver.addListener(eventName, configuration.listeners[eventName]);

  }

  if(storeObserver.scope.storeObservers === undefined) {
    storeObserver.scope.storeObservers = {};
    storeObserver.scope.addListener('beforedestroy', function(component) {
      for(var storeId in this.storeObservers) {
        this.storeObservers[storeId].purgeListeners();
        delete(this.storeObservers[storeId]);
      }
    });
  }

  storeObserver.scope.storeObservers[storeObserver.storeId] = storeObserver;

};
