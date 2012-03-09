Ext.namespace('Ext.ux', 'Ext.ux.pimf');

Ext.ux.pimf.Connection = new Ext.util.Observable();
Ext.ux.pimf.Connection.addEvents('login', 'lock', 'unlock', 'unlockFailure');

Ext.apply(Ext.ux.pimf.Connection, {

  request: function(additionalOptions) {

    if(additionalOptions.msg !== undefined) {
      this.addMessage(additionalOptions.msg);
    } else if(additionalOptions.action[1] === 'get') {
      this.addMessage('Die Daten werden vom Server geholt ...');
    } else {
      this.addMessage('Die Daten werden zum Server gesendet ...');
    }

    Ext.Ajax.request(Ext.applyIf({
      connection: this,
      url: Ext.SOFTWARE_URL + 'server/' + additionalOptions.action[0] + '/' + additionalOptions.action[1] + '.php',
      params: {
        data: Ext.util.JSON.encode(additionalOptions.data),
        login: Ext.util.JSON.encode(this.userData)
      },
      success: function(response, options) {

        if(Ext.util.JSON.decode(response.responseText).success === true) {

          if(options.customSuccess !== undefined) {
            options.customSuccess.call(this, response, options);
          }

          options.connection.removeMessage();

        } else {

          if(options.customFailure !== undefined) {
            options.customFailure.call(this, response, options);
          }

          options.connection.removeMessage();

          if(options.customFailureMessageBox !== undefined) {
            options.customFailureMessageBox.call(this, response, options);
          } else {
            Ext.MessageBox.show({
              title: 'Serverfehler',
              msg: Ext.util.JSON.decode(response.responseText).errormessage,
              buttons: Ext.MessageBox.OK,
              icon: Ext.MessageBox.ERROR
            });
          }

        }

      },
      failure: function(response, options) {

        if(options.customFailure !== undefined) {
          options.customFailure.call(this, response, options);
        }

        options.connection.removeMessage();

        Ext.MessageBox.show({
          title: 'Verbindungsfehler',
          msg: unescape(response.statusText),
          buttons: Ext.MessageBox.OK,
          icon: Ext.MessageBox.ERROR
        });

      }
    }, additionalOptions));

  },

  userData: null,

  getUserRole: function() {

    return this.userData === null ? -1 : this.userData.role;

  },

  login: function(userData) {

    this.userData = userData;

    this.request({
      action: ['users', 'getRole'],
      data: {},
      scope: this,
      customSuccess: function(response, options) {

        this.userData.role = Ext.util.JSON.decode(response.responseText).role;

        Ext.StoreMgr.get('FolderStore').remoteLoad();
        Ext.StoreMgr.get('FreePropertyStore').remoteLoad();

        this.fireEvent('login');

      }
    });

  },

  logout: function() {

    this.userData = null;

    this.addMessage('Das Fenster wird jetzt neu geladen ...');

    window.location.reload();

  },

  locked: false,

  lock: function(adminOverwrite) {

    this.request({
      action: ['lock', 'create'],
      data: {
        adminOverwrite: adminOverwrite
      },
      scope: this,
      customSuccess: function(response, options) {

        this.locked = true;

        this.fireEvent('lock');

      },
      customFailureMessageBox: function(response, options) {

        if(!options.data.adminOverwrite && this.getUserRole() === 2) {

          Ext.MessageBox.show({
            title: 'Serverfehler',
            msg: 'Der Server lieferte folgenden Fehler zurück:<br />' + Ext.util.JSON.decode(response.responseText).errormessage + '<br /><br />' + 'Wollen Sie Ihre Administratorrechte einsetzen, um die Schreibrechte zu erzwingen?',
            buttons: Ext.MessageBox.YESNO,
            icon: Ext.MessageBox.ERROR,
            scope: this,
            fn: function(button) {

              if(button === 'yes') {
                this.lock(true);
              }

            }
          });

        } else {

          Ext.MessageBox.show({
            title: 'Serverfehler',
            msg: Ext.util.JSON.decode(response.responseText).errormessage,
            buttons: Ext.MessageBox.OK,
            icon: Ext.MessageBox.ERROR
          });

        }

      }
    });

  },

  unlock: function() {

    this.request({
      action: ['lock', 'delete'],
      data: {},
      scope: this,
      customSuccess: function(response, options) {

        this.locked = false;

        this.fireEvent('unlock');

      },
      customFailure: function(response, options) {

        this.fireEvent('unlockFailure');

      }
    });

  },

  messageQueue: new Array(),

  addMessage: function(message) {

    this.messageQueue.push(message);

    if(this.messageQueue.length > 0) {

      this.messageWaitBox = Ext.MessageBox.wait(this.messageQueue[0], 'Serververbindung');

    }

  },

  removeMessage: function() {

    this.messageQueue.shift();

    if(this.messageQueue.length > 0) {

      this.messageWaitBox.updateText(this.messageQueue[0]);

    } else {

      this.messageWaitBox.hide();
      this.messageWaitBox = undefined;

    }

  }

});

