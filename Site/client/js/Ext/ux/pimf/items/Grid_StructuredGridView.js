Ext.namespace('Ext.ux', 'Ext.ux.pimf', 'Ext.ux.pimf.items');

Ext.ux.pimf.items.Grid_StructuredGridView = Ext.extend(Ext.grid.GroupingView, {

  constructor: function() {

    Ext.ux.pimf.items.Grid_StructuredGridView.superclass.constructor.call(this, {
      emptyText: 'Es wurden keine Daten gefunden!',
      enableRowBody: true,
      getRowClass:function(record, rowIndex, p, store) {

        if(Ext.getCmp('NavigationTree').getSelectedNodeId() !== 'ruleViolation') {
          return '';
        }

        var ruleViolation = record.data.ruleViolation;

        if(ruleViolation === undefined) {

          p.body = '<div class="ruleViolation-undefined"><p>Dieser Gegenstand verletzt keine Regeln.</p></div>';

        } else if(ruleViolation === null) {

          p.body = '<div class="ruleViolation-null"><p>Es ist unbekannt, ob dieser Gegenstand Regeln verletzt. Aktualisieren Sie die Liste, um dies zu erfahren.</p></div>';

        } else {

          p.body = '<div class="ruleViolation-violated"><p>Regelverletzungen bei freien Eigenschaften:</p>';
          p.body += '<ul>';

          var freePropertyRecords = store.reader.meta.freeProperties;
          var freePropertyName = '';

          for(var freePropertyId in ruleViolation) {

            if(isNaN(Number(freePropertyId))) {
              continue;
            }

            for(var freePropertyRecordIndex = 0; freePropertyRecordIndex < freePropertyRecords.length; freePropertyRecordIndex++) {
              if(freePropertyRecords[freePropertyRecordIndex].id === Number(freePropertyId)) {
                freePropertyName = freePropertyRecords[freePropertyRecordIndex].name;
              }
            }

            p.body += '<li>"' + freePropertyName + '" ist ';

            var firstRule = true;
            for(var ruleNameIndex = 0; ruleNameIndex < ruleViolation[freePropertyId].length; ruleNameIndex++) {

              var ruleName = ruleViolation[freePropertyId][ruleNameIndex];

              if(firstRule) {
                firstRule = false;
              } else {
                p.body += ' und ';
              }

              if(ruleName === 'unique') {
                p.body += 'nicht eindeutig';
              } else if(ruleName === 'mandatory') {
                p.body += 'Pflichtfeld';
              } else if(ruleName === 'notEmpty') {
                p.body += 'leer';
              } else if(ruleName === 'afterToday') {
                p.body += 'früher als Heute';
              } else {
                p.body += 'FEHLER: UNBEKANNTE REGEL';
              }

            }

             p.body += '</li>';
          }

          p.body += '</ul></div>';

        }

        return '';

      },
      beforeColMenuShow: function() {

        var gv = this;
        var colCount = gv.cm.getColumnCount();

        gv.colMenu.removeAll();

        var folderPropertiesMenu = new Ext.menu.Menu();

        var freePropertiesItem = new Ext.menu.Item({
          text: 'Freie Eigenschaften',
          icon: 'images/led-icons/tag_blue.png',
          menu: {
            listeners: {
              itemclick: function(item, event) {
                gv.handleHdMenuClick(item);
              }
            }
          }
        });

        var submenus = {
          main: gv.colMenu,
          folderProperties: folderPropertiesMenu,
          freeProperties: freePropertiesItem.menu
        };

        for(var colIndex = 0; colIndex < colCount; colIndex++) {

          if(gv.cm.config[colIndex].fixed !== true && gv.cm.config[colIndex].hideable !== false) {

            submenus[gv.cm.config[colIndex].submenu].add(new Ext.menu.CheckItem({
              itemId: 'col-' + gv.cm.getColumnId(colIndex),
              text: gv.cm.getColumnHeader(colIndex),
              checked: !gv.cm.isHidden(colIndex),
              hideOnClick: false,
              disabled: gv.cm.config[colIndex].hideable === false
            }));
          }
        }

        this.colMenu.add(new Ext.menu.Separator());

        var folderPropertiesMenuCount = folderPropertiesMenu.items.getCount();
        for(var folderPropertiesMenuIndex = 0; folderPropertiesMenuIndex < folderPropertiesMenuCount; folderPropertiesMenuIndex++) {
          this.colMenu.add(folderPropertiesMenu.items.itemAt(0));
        }

        this.colMenu.add(new Ext.menu.Separator());
        this.colMenu.add(freePropertiesItem);

      },
      groupTextTpl: '{text} (Anzahl: {[values.rs.length]})'
    });

  }

});
