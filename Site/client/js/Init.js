var Init = new Object();

Ext.apply(Init, {

  startApplication: function() {

    Ext.onReady(function() {

      Ext.BLANK_IMAGE_URL = 'js/Ext/framework-3.3.1/resources/images/default/s.gif';
      Ext.QuickTips.init();

      Ext.StoreMgr.addAll([
        new Ext.ux.pimf.folders.Store(),
        new Ext.ux.pimf.freeProperties.Store(),
        new Ext.ux.pimf.images.Store(),
        new Ext.ux.pimf.items.Store(),
        new Ext.ux.pimf.users.Store(),
        new Ext.ux.pimf.search.Store()
      ]);

      var viewport = new Ext.ux.pimf.Viewport();
      viewport.render();

      if(Ext.USE_HASH_LOGIN) {
        Ext.ux.pimf.Connection.login(Ext.urlDecode(window.location.search.substr(1)));
      } else {
        new Ext.ux.pimf.misc.LoginWindow().show();
      }

      Ext.get('initBox-background').pause(1).fadeOut({
        duration: 1,
        remove: true
      });

    });

  }

});
