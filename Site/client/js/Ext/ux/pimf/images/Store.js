Ext.namespace('Ext.ux', 'Ext.ux.pimf', 'Ext.ux.pimf.images');

Ext.ux.pimf.images.Store = Ext.extend(Ext.data.JsonStore, {

  constructor: function() {

    Ext.ux.pimf.images.Store.superclass.constructor.call(this, {
      storeId: 'ImageStore',
      autoSave: false,
      fields: [
        {
          name: 'id',
          type: 'int'
        },
        {
          name: 'name',
          type: 'string'
        }
      ],
      root: 'records',
      sortInfo: {
        field: 'name',
        direction: 'ASC'
      }
    });

    this.addEvents('remoteload', 'remotenew', 'remoteedit', 'remoteremove');

  },

  getOriginalURL: function(imageId) {
    return imageId === 0 ? 'images/blank_thumbnail.png' : Ext.SOFTWARE_URL + 'data/images/' + imageId.toString() + '.jpeg';
  },

  getOriginalAbsoluteURL: function(imageId) {
    return imageId === 0 ? Ext.SOFTWARE_URL + 'server/images/blank_thumbnail.png' : Ext.SOFTWARE_URL + 'data/images/' + imageId.toString() + '.jpeg';
  },

  getThumbnailURL: function(imageId) {
    return imageId === 0 ? 'images/blank_thumbnail.png' : Ext.SOFTWARE_URL + 'data/images/thumbnails/' + imageId.toString() + '.jpeg';
  },

  getThumbnailAbsoluteURL: function(imageId) {
    return imageId === 0 ? Ext.SOFTWARE_URL + 'server/images/blank_thumbnail.png' : Ext.SOFTWARE_URL + 'data/images/thumbnails/' + imageId.toString() + '.jpeg';
  },

  getTag: function(imageId) {
    return imageId === 0 ? '<img src="images/blank_thumbnail.png" title="Kein Bild" width="80" height="80" style="border: 1px solid #CCCCCC; " />' : '<img src="' + this.getThumbnailURL(imageId) + '" title="ID: ' + imageId.toString() + '" onclick="window.open(\'' + this.getOriginalAbsoluteURL(imageId) + '\')" width="80" height="80" style="border: 1px solid #CCCCCC; cursor: pointer; " />';
  },

  remoteLoad: function(data) {

    this.removeAll();

    Ext.ux.pimf.Connection.request({
      action: ['images', 'get'],
      data: data,
      scope: this,
      customSuccess: function(response, options) {

        this.lastOptions = options;

        this.loadData(Ext.util.JSON.decode(response.responseText));

        this.fireEvent('remoteload', this.getRange());

      }
    });

  },

  remoteReload: function() {

    if(this.lastOptions !== null) {

      this.remoteLoad(Ext.decode(this.lastOptions.params.data));

    }

  },

  remoteNew: function(imageData, form) {

    Ext.ux.pimf.Connection.request({
      action: ['images', 'create'],
      data: imageData,
      form: form.getEl(),
      formComponent: form,
      scope: this,
      customSuccess: function(response, options) {

        options.formComponent.reset();

        this.removeAll();

        var imageData = Ext.apply(options.data, {
          id: Ext.util.JSON.decode(response.responseText).id
        });
        var imageRecord = new this.reader.recordType(imageData, imageData.id);

        this.add(imageRecord);

        Ext.getCmp('ImageDataView').select(imageRecord);

        this.fireEvent('remotenew', imageRecord);

      }
    });

  },

  remoteEdit: function(imageData) {

    Ext.ux.pimf.Connection.request({
      action: ['images', 'update'],
      data: imageData,
      scope: this,
      customSuccess: function(response, options) {

        var imageData = options.data;
        var imageRecord = this.getById(imageData.id);

        for(var property in imageData) {
          imageRecord.set(property, imageData[property]);
        }

        this.commitChanges();
        this.sort(this.getSortState().field, this.getSortState().direction);

        this.fireEvent('remoteedit', imageRecord);

      }
    });

  },

  remoteRemove: function(imageId) {

    Ext.ux.pimf.Connection.request({
      action: ['images', 'delete'],
      data: {
        id: imageId
      },
      scope: this,
      customSuccess: function(response, options) {

        var imageId = options.data.id;
        var imageRecord = this.getById(imageId);

        this.remove(imageRecord);

        this.commitChanges();

        this.fireEvent('remoteremove', imageRecord);

      }
    });

  }

});
