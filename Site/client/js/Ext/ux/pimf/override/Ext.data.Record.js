Ext.override(Ext.data.Record, {
  set: function(name, value) {

    if(this.data[name] === value) {
      return;
    }

    this.dirty = true;

    if(!this.modified){
      this.modified = {};
    }

    if(this.modified[name] === undefined){
      this.modified[name] = this.data[name];
    }

    this.data[name] = value;

    if(!this.editing){
      this.afterEdit();
    }

  }
});