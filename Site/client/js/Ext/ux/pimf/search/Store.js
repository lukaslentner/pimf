Ext.namespace('Ext.ux', 'Ext.ux.pimf', 'Ext.ux.pimf.search');

Ext.ux.pimf.search.Store = Ext.extend(Ext.data.JsonStore, {

  constructor: function() {

    Ext.ux.pimf.search.Store.superclass.constructor.call(this, {
      storeId: 'SubjectStore',
      autoSave: false,
      fields: [
        {
          name: 'id',
          type: 'string'
        },
        {
          name: 'name',
          type: 'string'
        },
        {
          name: 'format',
          type: 'string'
        },
        {
          name: 'comparators',
          type: 'auto'
        }
      ],
      root: 'records',
      sortInfo: {
        field: 'name',
        direction: 'ASC'
      },
      getComparatorLabel: function(id) {

        switch(id) {

          case 'is':
            return 'ist';

          case 'has':
            return 'enthält';

          case 'is not empty':
            return 'besteht';

          default:
            return '';

        }

      }
    });

    Ext.ux.pimf.StoreObserver.create({
      storeId: 'FreePropertyStore',
      scope: this,
      events: ['load', 'add', 'remove', 'update'],
      listeners: {
        load: function(store, records, options) {

          this.removeAll();

          var subjectRecord;

          subjectRecord = new this.reader.recordType({
            id: 'any',
            name: 'Volltext',
            format: 'string',
            comparators: ['has']
          }, 'any');
          this.add([subjectRecord]);

          subjectRecord = new this.reader.recordType({
            id: 'id',
            name: 'ID',
            format: 'int',
            comparators: ['is']
          }, 'id');
          this.add([subjectRecord]);

          subjectRecord = new this.reader.recordType({
            id: 'name',
            name: 'Name',
            format: 'string',
            comparators: ['is', 'has']
          }, 'name');
          this.add([subjectRecord]);

          subjectRecord = new this.reader.recordType({
            id: 'description',
            name: 'Beschreibung',
            format: 'string',
            comparators: ['is', 'has']
          }, 'description');
          this.add([subjectRecord]);

          subjectRecord = new this.reader.recordType({
            id: 'parentFolderId',
            name: 'Oberordner ID',
            format: 'int',
            comparators: ['is']
          }, 'parentFolderId');
          this.add([subjectRecord]);

          subjectRecord = new this.reader.recordType({
            id: 'path',
            name: 'Pfad',
            format: 'string',
            comparators: ['has']
          }, 'path');
          this.add([subjectRecord]);

          subjectRecord = new this.reader.recordType({
            id: 'type',
            name: 'Typ',
            format: 'string',
            comparators: ['is']
          }, 'type');
          this.add([subjectRecord]);

          subjectRecord = new this.reader.recordType({
            id: 'ruleViolation',
            name: 'Regelverletzung',
            format: '',
            comparators: ['is not empty']
          }, 'ruleViolation');
          this.add([subjectRecord]);

          for(var recordIndex = 0; recordIndex < records.length; recordIndex++) {

            subjectRecord = new this.reader.recordType({
              id: 'freePropertyValue' + String(records[recordIndex].data.id),
              name: records[recordIndex].data.name,
              format: records[recordIndex].data.format,
              comparators: ['is', 'has']
            }, 'freePropertyValue' + String(records[recordIndex].data.id));

            this.add([subjectRecord]);

          }

        },
        add: function(store, records, index) {

          var subjectRecord;
          for(var recordIndex = 0; recordIndex < records.length; recordIndex++) {

            subjectRecord = new this.reader.recordType({
              id: 'freePropertyValue' + String(records[recordIndex].data.id),
              name: records[recordIndex].data.name,
              format: records[recordIndex].data.format,
              comparators: ['is', 'has']
            }, 'freePropertyValue' + String(records[recordIndex].data.id));

            this.add([subjectRecord]);

          }

        },
        remove: function(store, records, index) {

          var subjectRecord;
          for(var recordIndex = 0; recordIndex < records.length; recordIndex++) {

            subjectRecord = this.getById('freePropertyValue' + String(records[recordIndex].data.id));

            this.remove([subjectRecord]);

          }

          this.commitChanges();

        },
        update: function(store, record, operation) {

          var subjectRecord = this.getById('freePropertyValue' + String(record.data.id));
          subjectRecord.set('name', record.data.name);
          subjectRecord.set('format', record.data.format);

          this.commitChanges();

        }
      }
    });

  }

});
