Ext.namespace('Ext.ux', 'Ext.ux.pimf', 'Ext.ux.pimf.users');

Ext.ux.pimf.users.Store = Ext.extend(Ext.data.JsonStore, {

  constructor: function() {

    Ext.ux.pimf.users.Store.superclass.constructor.call(this, {
      storeId: 'UserStore',
      autoSave: false,
      fields: [
        {
          name: 'id',
          type: 'int'
        },
        {
          name: 'username',
          type: 'string'
        },
        {
          name: 'password',
          type: 'string'
        },
        {
          name: 'role',
          type: 'int'
        }
      ],
      root: 'records',
      sortInfo: {
        field: 'username',
        direction: 'ASC'
      }
    });

    this.reader.recordType.prototype.getRoleImageFile = function() {
      return this.store.roleImageFiles[this.data.role];
    };
    this.reader.recordType.prototype.getRoleLabel = function() {
      return this.store.roleLabels[this.data.role];
    };
    this.reader.recordType.prototype.getRoleName = function() {
      return this.store.roleNames[this.data.role];
    };

    this.addEvents('remoteload', 'remotenew', 'remoteedit', 'remoteremove');

  },

  remoteLoad: function() {

    Ext.ux.pimf.Connection.request({
      action: ['users', 'get'],
      data: {},
      scope: this,
      customSuccess: function(response, options) {

        this.lastOptions = options;

        this.loadData(Ext.util.JSON.decode(response.responseText));

        this.fireEvent('remoteload', this.getRange());

      }
    });

  },

  remoteReload: function() {

    this.remoteLoad();

  },

  remoteNew: function(userData) {

    Ext.ux.pimf.Connection.request({
      action: ['users', 'create'],
      data: userData,
      scope: this,
      customSuccess: function(response, options) {

        var userData = Ext.apply(options.data, {
          id: Ext.util.JSON.decode(response.responseText).id
        });
        var userRecord = new this.reader.recordType(userData, userData.id);

        this.addSorted(userRecord);

        this.fireEvent('remotenew', userRecord);

      }
    });

  },

  remoteEdit: function(userData) {

    Ext.ux.pimf.Connection.request({
      action: ['users', 'update'],
      data: userData,
      scope: this,
      customSuccess: function(response, options) {

        var userData = options.data;
        var userRecord = this.getById(userData.id);

        for(var property in userData) {
          userRecord.set(property, userData[property]);
        }

        this.commitChanges();
        this.sort(this.getSortState().field, this.getSortState().direction);

        this.fireEvent('remoteedit', userRecord);

      }
    });

  },

  remoteRemove: function(userIds) {

    Ext.ux.pimf.Connection.request({
      action: ['users', 'delete'],
      data: {
        ids: userIds
      },
      scope: this,
      customSuccess: function(response, options) {

        var userIds = options.data.ids;
        var userRecord;
        var userRecords = new Array();

        for(var userIdIndex = 0; userIdIndex < userIds.length; userIdIndex++) {
          userRecord = this.getById(userIds[userIdIndex]);
          this.remove(userRecord);
          userRecords.push(userRecord);
        }

        this.commitChanges();

        this.fireEvent('remoteremove', userRecords);

      }
    });

  },

  roleImageFiles: [
    'led-icons/user.png',
    'led-icons/user_business.png',
    'led-icons/user_business_boss.png'
  ],

  roleLabels: [
    'Leser',
    'Editor',
    'Administrator'
  ],

  roleNames: [
    'reader',
    'editor',
    'administrator'
  ]

});
