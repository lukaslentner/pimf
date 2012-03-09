/**
 * @class Ext.ux.ToolsTips
 * @extends Object
 * @version 1.0.1
 * @license GPL 3.0
 * @copyright 2009, Doug Hendricks, The Active Group, Inc.
 * For Ext 3.0+
 * Plugin (ptype = 'toolstips') adds Tooltips to the standard and user-defined Panel tools.
 * A standard set of English defaults are built-in but each tool 'id' may be overridden with
 * either a simple text string or a full Quicktip cfg object (in any language locale you choose).
 * @ptype toolstips
 * @example

   var tt = new Ext.ux.ToolsTips(
      { tips:
        {
         pin : 'Anchor this Window',
         help : { title: 'More about..', text: 'What this does' },
         refresh : 'Refresh this chart',
         maximize : 'Go Full Screen',
         minimize : 'Hide this thing'
       }
    });

    new Ext.Window({
      title : 'Products Chart',
      height: 500,
      width : 600,
      maximizable : true,
      minimizable : true,
      layout : 'fit',
      plugins : [ tt ],
      items : {
         xtype : 'somechart',
         tools : [ {id : 'refresh', handler : function() {} } ],
         plugins : [ tt ],
         }
    }).show()

    //or apply it to a Panel that's already rendered:
    tt.init(renderedPanel);

 */

Ext.ux.ToolsTips = function(cfg){
    this.tools = Ext.apply({}, (cfg||{}).tips || {}, this._tools);

    /**
     * List of Tools that tips were applied to. (for destruction/cleanup)
     * @type Array
     */
    this.release = [];
};

Ext.extend(Ext.ux.ToolsTips, Object, {

    /**
     * @private English defaults (override each if necessary in the constructor tips:{} cfg)
     * @type {object}
     */
    _tools : {
          toggle : 'Expand/Collapse',
          expand : 'Expand',   //Use this one for collapsible region tool
           close : 'Close',
        minimize : 'Minimize',
        maximize : 'Maximize',
         restore : 'Restore',
            gear : 'Configure',
             pin : 'Pin',
           unpin : 'Unpin',
           right : 'Collapse right',
            left : 'Collapse left',
              up : 'Up',
            down : 'Down',
         refresh : 'Refresh',
           minus : 'Subtract',
            plus : 'Add',
            help : 'Help',
          search : 'Find',
            save : 'Save',
           print : 'Print'
    },

    ptype    :  'toolstips',

    init : function(panel){

        if(Ext.QuickTips && Ext.QuickTips.isEnabled() && panel){
           panel.rendered ?
             this.applyTips(panel) :
                panel.on('afterrender', this.applyTips , this, {single:true, delay:1200}) ;

           panel.on('destroy', this.releaseTips, this);
         }
    },


    applyTips : function(comp){

       if(comp){
            var CT = comp ? comp.tools : null,
                register = Ext.QuickTips.register,
                qtip = Ext.QuickTips.getQuickTip(),
                layout = comp && comp.ownerCt? comp.ownerCt.layout : null,
                region = layout ? layout[comp.region] : null,
                ctool, tipCfg, cEl;

            Ext.iterate(this.tools, function(toolName, tip){

                   tipCfg = Ext.isString(tip) ? {text : tip } : tip || {text : toolName } ;

                   if(CT &&
                     CT.hasOwnProperty(toolName) &&
                     !qtip.targets[CT[toolName].id] //already defined inline?
                     ){
                      tipCfg.target = CT[toolName];
                      register( tipCfg );
                      this.release.push(CT[toolName]);
                   }

                   //Seek Border Layout region for collapse and other tools
                   if(region && (cEl = region.getCollapsedEl()) &&
                      (ctool = cEl.child('div.x-tool-'+toolName+'-'+comp.region))){
                          tipCfg.target = ctool;
                          register(tipCfg);
                          this.release.push(ctool);
                   }
            }, this);

        }
    },
    /**
     * @private
     */
    releaseTips : function(){
        Ext.each(this.release || [], function(tool){
           Ext.QuickTips && Ext.QuickTips.unregister(tool);
        });
    }
});

Ext.preg && Ext.preg('toolstips', Ext.ux.ToolsTips);