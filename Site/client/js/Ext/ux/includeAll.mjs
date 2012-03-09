// Minified by MiniME from toptensoftware.com
Ext.namespace("Ext.ux","Ext.ux.crypto");Ext.ux.crypto.SHA1=(function(){var w=function(d,a,b,c){switch(d){case 0:return a
&b^~a&c;case 1:return a^b^c;case 2:return a&b^a&c^b&c;case 3:return a^b^c}},r=function(b,a){return b<<a|b>>>32-a};
return{hash:function(c){var t=[1518500249,1859775393,2400959708,3395469782];c+=String.fromCharCode(128);var u=Math.ceil(
c.length/4)+2,f=Math.ceil(u/16),e=[f];for(var b=0;b<f;b++){e[b]=[16];for(var d=0;d<16;d++)e[b][d]=c.charCodeAt(b*64+d*4)
<<24|c.charCodeAt(b*64+d*4+1)<<16|c.charCodeAt(b*64+d*4+2)<<8|c.charCodeAt(b*64+d*4+3)}e[f-1][14]=(c.length-1)*8/Math.
pow(2,32);e[f-1][14]=Math.floor(e[f-1][14]);e[f-1][15]=(c.length-1)*8&4294967295;var m=1732584193,n=4023233417,o=
2562383102,p=271733878,q=3285377520,g=[80],h,i,j,k,l;for(var b=0;b<f;b++){for(var a=0;a<16;a++)g[a]=e[b][a];for(var a=16
;a<80;a++)g[a]=r(g[a-3]^g[a-8]^g[a-14]^g[a-16],1);h=m;i=n;j=o;k=p;l=q;for(var a=0;a<80;a++){var s=Math.floor(a/20),v=r(h
,5)+w(s,i,j,k)+l+t[s]+g[a]&4294967295;l=k;k=j;j=r(i,30);i=h;h=v}m=m+h&4294967295;n=n+i&4294967295;o=o+j&4294967295;p=p+k
&4294967295;q=q+l&4294967295}return m.toHexStr()+n.toHexStr()+o.toHexStr()+p.toHexStr()+q.toHexStr()}}})();Ext.applyIf(
Number.prototype,{toHexStr:function(){var b="",c;for(var a=7;a>=0;a--){c=this>>>a*4&15;b+=c.toString(16)}return b}});
/*
 * Ext JS Library 3.3.0
 * Copyright(c) 2006-2010 Ext JS, Inc.
 * licensing@extjs.com
 * http://www.extjs.com/license
 */
Ext.ns("Ext.ux.form");Ext.ux.form.FileUploadField=Ext.extend(Ext.form.TextField,{buttonText:"Browse...",buttonOnly:false
,buttonOffset:3,readOnly:true,autoSize:Ext.emptyFn,initComponent:function(){Ext.ux.form.FileUploadField.superclass.
initComponent.call(this);this.addEvents("fileselected")},onRender:function(b,c){Ext.ux.form.FileUploadField.superclass.
onRender.call(this,b,c);this.wrap=this.el.wrap({cls:"x-form-field-wrap x-form-file-wrap"});this.el.addClass(
"x-form-file-text");this.el.dom.removeAttribute("name");this.createFileInput();var a=Ext.applyIf(this.buttonCfg||{},{
text:this.buttonText});this.button=new Ext.Button(Ext.apply(a,{renderTo:this.wrap,cls:"x-form-file-btn"+(a.iconCls?
" x-btn-icon":"")}));if(this.buttonOnly){this.el.hide();this.wrap.setWidth(this.button.getEl().getWidth())}this.
bindListeners();this.resizeEl=this.positionEl=this.wrap},bindListeners:function(){this.fileInput.on({scope:this,
mouseenter:function(){this.button.addClass(["x-btn-over","x-btn-focus"])},mouseleave:function(){this.button.removeClass(
["x-btn-over","x-btn-focus","x-btn-click"])},mousedown:function(){this.button.addClass("x-btn-click")},mouseup:function(
){this.button.removeClass(["x-btn-over","x-btn-focus","x-btn-click"])},change:function(){var a=this.fileInput.dom.value;
this.setValue(a);this.fireEvent("fileselected",this,a)}})},createFileInput:function(){this.fileInput=this.wrap.
createChild({id:this.getFileInputId(),name:this.name||this.getId(),cls:"x-form-file",tag:"input",type:"file",size:1})},
reset:function(){this.fileInput.remove();this.createFileInput();this.bindListeners();Ext.ux.form.FileUploadField.
superclass.reset.call(this)},getFileInputId:function(){return this.id+"-file"},onResize:function(a,b){Ext.ux.form.
FileUploadField.superclass.onResize.call(this,a,b);this.wrap.setWidth(a);if(!this.buttonOnly){a=this.wrap.getWidth()-
this.button.getEl().getWidth()-this.buttonOffset;this.el.setWidth(a)}},onDestroy:function(){Ext.ux.form.FileUploadField.
superclass.onDestroy.call(this);Ext.destroy(this.fileInput,this.button,this.wrap)},onDisable:function(){Ext.ux.form.
FileUploadField.superclass.onDisable.call(this);this.doDisable(true)},onEnable:function(){Ext.ux.form.FileUploadField.
superclass.onEnable.call(this);this.doDisable(false)},doDisable:function(a){this.fileInput.dom.disabled=a;this.button.
setDisabled(a)},preFocus:Ext.emptyFn,alignErrorIcon:function(){this.errorIcon.alignTo(this.wrap,"tl-tr",[2,0])}});Ext.
reg("fileuploadfield",Ext.ux.form.FileUploadField);Ext.form.FileUploadField=Ext.ux.form.FileUploadField;Ext.namespace(
"Ext.ux","Ext.ux.pimf","Ext.ux.pimf.folders");Ext.ux.pimf.folders.AbstractTree=Ext.extend(Ext.tree.TreePanel,{
constructor:function(m){var j={renderCheckboxes:false,border:false,containerScroll:true,ddScroll:true,autoScroll:true,
selModel:new Ext.tree.DefaultSelectionModel({approvedSelectFlag:false,approvedSelect:function(a){this.approvedSelectFlag
=true;if(a===undefined)this.clearSelections();else{a.ensureVisible();a.select()}this.approvedSelectFlag=false},listeners
:{beforeselect:function(a,b,c){if(!a.approvedSelectFlag)return false}}}),store:Ext.StoreMgr.get("FolderStore"),root:new 
Ext.tree.TreeNode({id:"0"}),rootVisible:false,enableDD:true,ddGroup:"FoldersMove&ItemsLink",dropConfig:{allowDrop:true,
appendOnly:true,ddGroup:"FoldersMove&ItemsLink",prepareDDParameters:function(c,e,d,a){var b={action:undefined,
checkAction:function(){return false},getProxyCls:function(){return"x-dd-drop-nodrop"}};if(c.node.attributes.record===
undefined)return b;if(a.selections!==undefined)if(a.selections[0].data.type==="item")return{action:d.altKey?"unlink":
"link",checkAction:function(){return Ext.StoreMgr.get("ItemStore").checkItemsLink(this.sourceItemRecords,this.
targetFolderRecord)},getProxyCls:function(){return this.checkAction()?d.altKey?"x-dd-drop-unlink":"x-dd-drop-link":
"x-dd-drop-nodrop"},sourceItemRecords:a.selections,targetFolderRecord:c.node.attributes.record};else if(Ext.StoreMgr.get
("FolderStore").isFolderType(a.selections[0].data.type))return{action:"move",checkAction:function(){return Ext.StoreMgr.
get("FolderStore").checkFoldersMove(this.sourceFolderRecords,this.targetFolderRecord)},getProxyCls:function(){
return this.checkAction()?"x-dd-drop-move":"x-dd-drop-nodrop"},sourceFolderRecords:Ext.StoreMgr.get("ItemStore").
getFolderRecordsOfItemRecords(a.selections),targetFolderRecord:c.node.attributes.record};else return b;else if(a.node!==
undefined){if(a.node.attributes.record===undefined)return b;return{action:"move",checkAction:function(){return Ext.
StoreMgr.get("FolderStore").checkFoldersMove(this.sourceFolderRecords,this.targetFolderRecord)},getProxyCls:function(){
return this.checkAction()?"x-dd-drop-move":"x-dd-drop-nodrop"},sourceFolderRecords:[a.node.attributes.record],
targetFolderRecord:c.node.attributes.record}}else return b},onNodeOver:function(d,e,c,a){var b=this.prepareDDParameters(
d,e,c,a);return b.getProxyCls()},onNodeDrop:function(d,e,c,b){var a=this.prepareDDParameters(d,e,c,b);if(a.checkAction()
){if(a.action==="move")Ext.StoreMgr.get("FolderStore").remoteMove(a.sourceFolderRecords.extractProperty("data").
extractProperty("id"),a.targetFolderRecord.data.id);if(a.action==="link")Ext.StoreMgr.get("ItemStore").remoteLink(a.
sourceItemRecords.extractProperty("data").extractProperty("id"),a.targetFolderRecord.data.id);if(a.action==="unlink")Ext
.StoreMgr.get("ItemStore").remoteUnlink(a.sourceItemRecords.extractProperty("data").extractProperty("id"),a.
targetFolderRecord.data.id);return true}else return false}}};Ext.apply(j,m);Ext.ux.pimf.folders.AbstractTree.superclass.
constructor.call(this,j);Ext.ux.pimf.StoreObserver.create({storeId:"FolderStore",scope:this,events:["remoteload",
"remotenew","remoteedit","remotemove","remoteremove"],listeners:{remoteload:function(p){var l=this.getSelectedNodeId();
this.getSelectionModel().clearSelections();var g=function(c,k){var e=c.childNodes.extractProperty("id"),i=Ext.StoreMgr.
get("FolderStore").query("parentFolderId",new RegExp("^"+c.id+"$"),true,true);i.each(function(a,q,r){var b=this.
parentTreeNode.findChild("id",a.data.id.toString());if(b===null)b=this.parentTreeNode.appendChild(new Ext.tree.TreeNode(
{text:a.data.name,id:a.data.id.toString(),cls:"x-node-"+a.data.type+(a.data.parentFolderId===0?" x-node-main":""),sort:a
.data.parentFolderId===0?a.data.id.toString():a.data.name.toLowerCase(),checked:this.parentTreeNode.getOwnerTree().
renderCheckboxes?false:undefined,record:a}));else{b.setText(a.data.name);b.setCls("x-node-"+a.data.type+(a.data.
parentFolderId===0?" x-node-main":""));b.attributes.sort=a.data.parentFolderId===0?a.data.id.toString():a.data.name.
toLowerCase();b.getUI().toggleCheck(false);b.attributes.record=a}this.childTreeNodeIds.remove(b.id);this.handle(b,this.
handle)},{childTreeNodeIds:e,handle:k,parentTreeNode:c});for(var d=0;d<e.length;d++){var f=c.findChild("id",e[d]);if(f.
attributes.record!==undefined)f.remove(true)}};g(this.root,g);var h=this.getNodeById(l);if(h!==undefined)h.
approvedSelect()},remotenew:function(b){var a=b.data;this.getNodeById(a.parentFolderId.toString()).appendChild(new Ext.
tree.TreeNode({text:a.name,id:a.id.toString(),cls:"x-node-"+a.type,sort:a.name.toLowerCase(),checked:this.
renderCheckboxes?false:undefined,record:b}))},remoteedit:function(c){var a=c.data,b=this.getNodeById(a.id.toString());b.
setText(a.name);b.attributes.sort=a.name.toLowerCase()},remotemove:function(c,e){var d=this.getNodeById(e.data.id.
toString());for(var b=0;b<c.length;b++){var a=this.getNodeById(c[b].data.id.toString());d.expand(false,false);var f=a.
isSelected();d.appendChild(a);if(f)a.getOwnerTree().getSelectionModel().approvedSelect(a)}},remoteremove:function(b){
for(var a=0;a<b.length;a++)this.getNodeById(b[a].data.id.toString()).remove()}}});this.addListener("click",function(a,b)
{this.getSelectionModel().approvedSelect(a)});this.addListener("containercontextmenu",function(b,a){a.stopEvent()});this
.addListener("contextmenu",function(a,c){c.stopEvent();if(!Ext.ux.pimf.Connection.locked)return false;if(a.id==="search"
||a.id==="ruleViolation"||a.id==="freeProperty"||a.id==="user")return false;var e=new Ext.menu.Menu({items:[new Ext.menu
.Item({text:"Klonen",iconCls:"x-menu-clone",disabled:a.attributes.record.data.parentFolderId===0,scope:a,handler:
function(d,n){new Ext.ux.pimf.folders.CloneDialog([this.attributes.record]).show(d.getEl())}}),new Ext.menu.Item({text:
"Bearbeiten",iconCls:"x-menu-edit",disabled:a.attributes.record.data.parentFolderId===0,scope:a,handler:function(d,n){
new Ext.ux.pimf.folders.EditWindow(this.attributes.record).show(d.getEl())}}),new Ext.menu.Item({text:"L\xF6schen",
iconCls:"x-menu-remove",disabled:a.attributes.record.data.parentFolderId===0,scope:a,handler:function(d,n){new Ext.ux.
pimf.folders.RemoveDialog([this.attributes.record]).show(d.getEl())}}),new Ext.menu.Separator(),new Ext.menu.Item({text:
"Neu",iconCls:"x-menu-new",scope:a,handler:function(d,n){new Ext.ux.pimf.folders.NewWindow(this.attributes.record).show(
d.getEl())}})]}),b=c.getXY();e.showAt([(b[0]+5),(b[1]+5)])});this.sorter=new Ext.tree.TreeSorter(this,{caseSensitive:
false,property:"sort"})},getSelectedNode:function(){return this.getSelectionModel().getSelectedNode()===null?undefined:
this.getSelectionModel().getSelectedNode()},getSelectedNodeId:function(){if(this.getSelectedNode()===undefined)
return undefined;else return this.getSelectedNode().id},getSelectedNodeFolderRecord:function(){if(this.getSelectedNode()
===undefined)return undefined;else return this.getSelectedNode().attributes.record}});Ext.namespace("Ext.ux",
"Ext.ux.pimf","Ext.ux.pimf.folders");Ext.ux.pimf.folders.AbstractWindow=Ext.extend(Ext.Window,{constructor:function(b,c)
{Ext.ux.pimf.folders.AbstractWindow.superclass.constructor.call(this,{title:c,modal:true,resizable:false,width:500,
autoHeight:true,buttons:[new Ext.Button({text:"Abbrechen",icon:"images/led-icons/cancel.png",handler:function(a,d){this.
ownerCt.ownerCt.close()}}),new Ext.Button({text:"Speichern",icon:"images/led-icons/disk.png",handler:function(a,d){this.
ownerCt.ownerCt.save()}})],layout:"auto",items:[new Ext.form.FormPanel({defaults:{anchor:"100%"},border:false,padding:
"10px 10px 6px 10px",items:[new Ext.form.DisplayField({name:"id",fieldLabel:"ID"}),new Ext.form.TextField({name:"name",
fieldLabel:"Name",ref:"../defaultButton",listeners:{specialkey:function(d,a){if(a.getKey()===a.ENTER)this.ownerCt.
ownerCt.buttons[1].handler(this.ownerCt.ownerCt.buttons[1],{})}}}),new Ext.form.TextField({name:"manualURL",fieldLabel:
"Anleitung URL",hidden:b!=="experiment",listeners:{specialkey:function(d,a){if(a.getKey()===a.ENTER)this.ownerCt.ownerCt
.buttons[1].handler(this.ownerCt.ownerCt.buttons[1],{})}}}),new Ext.form.TextField({name:"homepageURL",fieldLabel:
"Homepage URL",hidden:b!=="vendor",listeners:{specialkey:function(d,a){if(a.getKey()===a.ENTER)this.ownerCt.ownerCt.
buttons[1].handler(this.ownerCt.ownerCt.buttons[1],{})}}}),new Ext.form.Label({fieldLabel:"Bild"}),new Ext.ux.pimf.
images.ImageField({name:"image"}),new Ext.form.Label({fieldLabel:"Beschreibung"}),new Ext.form.TextArea({name:
"description",hideLabel:true,height:200})]})]})}});Ext.namespace("Ext.ux","Ext.ux.pimf","Ext.ux.pimf.folders");Ext.ux.
pimf.folders.CloneDialog=function(d){this.folderIds=d.extractProperty("data").extractProperty("id");this.show=function(b
){Ext.MessageBox.show({title:"Klone Ordner",msg:"Geben Sie bitte die gew\xFCnschte Anzahl der Klone ein:",buttons:Ext.
MessageBox.OKCANCEL,icon:Ext.MessageBox.QUESTION,animEl:b,scope:this,prompt:true,value:"1",fn:function(e,f){var a=
parseInt(f);if(e==="ok"&&a>0)Ext.StoreMgr.get("FolderStore").remoteClone(this.folderIds,a)}})}};Ext.namespace("Ext.ux",
"Ext.ux.pimf","Ext.ux.pimf.folders");Ext.ux.pimf.folders.EditWindow=Ext.extend(Ext.ux.pimf.folders.AbstractWindow,{
constructor:function(a){Ext.ux.pimf.folders.EditWindow.superclass.constructor.call(this,a.data.type,"Bearbeite Ordner");
this.folderData=a.data;this.addListener("show",function(b){this.items.item(0).getForm().setValues(this.folderData)});Ext
.ux.pimf.StoreObserver.create({storeId:"FolderStore",scope:this,events:["remoteedit"],listeners:{remoteedit:function(){
this.close()}}})},save:function(){var a=this.items.item(0).getForm().getFieldValues(),b=this.items.item(0).getForm().
getValues();Ext.StoreMgr.get("FolderStore").remoteEdit({id:this.folderData.id,name:a.name,image:parseInt(b.image),
description:a.description,parentFolderId:this.folderData.parentFolderId,type:this.folderData.type,manualURL:this.
folderData.type==="experiment"?a.manualURL:"",homepageURL:this.folderData.type==="vendor"?a.homepageURL:""})}});Ext.
namespace("Ext.ux","Ext.ux.pimf","Ext.ux.pimf.folders");Ext.ux.pimf.folders.NavigationTree=Ext.extend(Ext.ux.pimf.
folders.AbstractTree,{constructor:function(){Ext.ux.pimf.folders.NavigationTree.superclass.constructor.call(this,{id:
"NavigationTree"});this.storeObservers.FolderStore.addListener("remoteload",function(g){if(this.getNodeById("search")===
undefined){var a=this.root.appendChild(new Ext.tree.TreeNode({text:"Suche",id:"search",cls:"x-node-search x-node-main",
sort:"0",hidden:true,selectAction:function(){Ext.getCmp("ItemGrid").activate();Ext.StoreMgr.get("ItemStore").remoteLoad(
this.searchParameter)}}));a.relayEvents(Ext.getCmp("SearchField"),["search","endsearch"]);a.addListener("search",
function(b){var c=Ext.getCmp("NavigationTree");this.unselect();this.attributes.searchParameter={pattern:[{subject:"any",
comparator:"has",value:b}],logic:"AND"};this.getUI().show();this.approvedSelect()});a.addListener("endsearch",function()
{this.unselect();this.getUI().hide()});a.relayEvents(Ext.getCmp("SearchGrid"),["extendedsearch"]);a.addListener(
"extendedsearch",function(d){var f=Ext.getCmp("NavigationTree");this.unselect();var e=d.getStore().getRange(),c=[];for(
var b=0;b<e.length;b++)c.push(e[b].data);this.attributes.searchParameter={pattern:c,logic:d.getBottomToolbar().items.
item(0).value};this.getUI().show();this.approvedSelect()});if(Ext.ux.pimf.Connection.getUserRole()>=1)this.root.
appendChild(new Ext.tree.TreeNode({text:"Regelverletzungen",id:"ruleViolation",cls:"x-node-ruleViolation x-node-main",
sort:"01",selectAction:function(){Ext.getCmp("ItemGrid").activate();Ext.StoreMgr.get("ItemStore").remoteLoad({pattern:[{
subject:"ruleViolation",comparator:"is not empty",value:""}],logic:"AND"})}}));if(Ext.ux.pimf.Connection.getUserRole()
===2){this.root.appendChild(new Ext.tree.TreeNode({text:"Freie Eigenschaften",id:"freeProperty",cls:
"x-node-freeProperty x-node-main",sort:"90",selectAction:function(){Ext.getCmp("FreePropertyGrid").activate();Ext.
StoreMgr.get("FreePropertyStore").remoteLoad()}}));this.root.appendChild(new Ext.tree.TreeNode({text:"Benutzer",id:
"user",cls:"x-node-user x-node-main",sort:"91",selectAction:function(){Ext.getCmp("UserGrid").activate();Ext.StoreMgr.
get("UserStore").remoteLoad()}}))}}});this.getSelectionModel().addListener("selectionchange",function(b,a){if(a===null)
Ext.getCmp("BlankGrid").activate();else if(a.attributes.selectAction!==undefined)a.attributes.selectAction();else{Ext.
getCmp("ItemGrid").activate();Ext.StoreMgr.get("ItemStore").remoteLoad({pattern:[{subject:"parentFolderId",comparator:
"is",value:a.attributes.record.data.id}],logic:"AND"})}})},isSelectedNodeSpecial:function(){return this.
getSelectedNodeId()==="search"||this.getSelectedNodeId()==="ruleViolation"||this.getSelectedNodeId()==="freeProperty"||
this.getSelectedNodeId()==="user"}});Ext.namespace("Ext.ux","Ext.ux.pimf","Ext.ux.pimf.folders");Ext.ux.pimf.folders.
NewWindow=Ext.extend(Ext.ux.pimf.folders.AbstractWindow,{constructor:function(a){Ext.ux.pimf.folders.NewWindow.
superclass.constructor.call(this,a.data.type,"Neuer Ordner");this.parentFolderData=a.data;this.addListener("show",
function(b){this.items.item(0).getForm().setValues({id:"(neu)",image:0})});Ext.ux.pimf.StoreObserver.create({storeId:
"FolderStore",scope:this,events:["remotenew"],listeners:{remotenew:function(){this.close()}}})},save:function(){var a=
this.items.item(0).getForm().getFieldValues(),b=this.items.item(0).getForm().getValues();Ext.StoreMgr.get("FolderStore")
.remoteNew({id:0,name:a.name,image:parseInt(b.image),description:a.description,parentFolderId:this.parentFolderData.id,
type:this.parentFolderData.type,manualURL:this.parentFolderData.type==="experiment"?a.manualURL:"",homepageURL:this.
parentFolderData.type==="vendor"?a.homepageURL:""})}});Ext.namespace("Ext.ux","Ext.ux.pimf","Ext.ux.pimf.folders");Ext.
ux.pimf.folders.PropertyView=Ext.extend(Ext.Panel,{constructor:function(){Ext.ux.pimf.folders.PropertyView.superclass.
constructor.call(this,{id:"FolderPropertyView",border:false,layout:"vbox",layoutConfig:{align:"stretch"},border:false,
padding:"10px 10px 0 10px",items:[new Ext.form.FormPanel({border:false,items:[new Ext.form.DisplayField({name:"type",
hideLabel:true,cls:"x-propertyview"}),new Ext.form.DisplayField({name:"id",fieldLabel:"ID"}),new Ext.form.DisplayField({
name:"name",fieldLabel:"Name"}),new Ext.form.DisplayField({name:"manualURL",fieldLabel:"Anleitung URL"}),new Ext.form.
DisplayField({name:"homepageURL",fieldLabel:"Homepage URL"}),new Ext.form.DisplayField({name:"image",fieldLabel:"Bild"})
]}),new Ext.Panel({border:false,flex:1,layout:"vbox",layoutConfig:{align:"stretch"},items:[new Ext.Panel({border:false,
html:'<div class="x-form-item x-form-display-field">Enthalten&nbsp;in:</div>'}),new Ext.grid.GridPanel({cls:"greyborder"
,colModel:new Ext.grid.ColumnModel({columns:[{header:"",dataIndex:"id",width:30,fixed:true,renderer:function(a,c,d,e,b,f
){if(a===0)return"";else return'<img src="images/'+Ext.StoreMgr.get("FolderStore").getById(a).getTypeImageFile()+'" />'}
},{header:"Name",dataIndex:"id",renderer:function(a,c,d,e,b,f){if(a===0)return"";else return'<a href="#" title="'+Ext.
StoreMgr.get("FolderStore").getById(a).getPath()+"\" onclick=\"Ext.getCmp('NavigationTree').getNodeById('"+a.toString()+
"').approvedSelect(); return false; \">"+Ext.StoreMgr.get("FolderStore").getById(a).data.name+"</a>"}}]}),columnLines:
true,disableSelection:true,enableColumnMove:false,setRecord:function(b){var a=this.getStore();a.removeAll();a.addSorted(
new a.recordType({id:b.data.parentFolderId},b.data.parentFolderId))},store:new Ext.data.ArrayStore({data:[[0]],fields:[
"id"],idIndex:0}),trackMouseOver:false,view:new Ext.grid.GridView({forceFit:true,headersDisabled:true,scrollOffset:0})})
,new Ext.Panel({border:false,html:
'<div style="padding-top: 7px !important; " class="x-form-item x-form-display-field">Beschreibung:</div>'}),new Ext.
Panel({cls:"greyborder x-form-item",style:"padding-bottom: 10px; ",autoScroll:true,flex:1,html:
'<div style="padding: 5px; "></div>'})]})]});Ext.ux.pimf.StoreObserver.create({storeId:"FolderStore",scope:this,events:[
"load","update"],listeners:{load:function(c,a,b){if(this.folderId===undefined||this.folderId===null)return;this.reload()
},update:function(c,b,a){if(a===Ext.data.Record.COMMIT)this.reload()}}})},activate:function(){this.ownerCt.layout.
setActiveItem(this.id)},load:function(a){this.folderId=a;this.reload()},reload:function(){if(this.folderId===undefined||
this.folderId===null)return;var a=Ext.StoreMgr.get("FolderStore").getById(this.folderId);if(a===undefined)return;this.
items.item(0).getForm().findField("type").removeClass("x-propertyview-category");this.items.item(0).getForm().findField(
"type").removeClass("x-propertyview-experiment");this.items.item(0).getForm().findField("type").removeClass(
"x-propertyview-location");this.items.item(0).getForm().findField("type").removeClass("x-propertyview-vendor");this.
items.item(0).getForm().findField("type").addClass("x-propertyview-"+a.data.type);this.items.item(0).getForm().setValues
({type:a.getTypeLabel().replace(/ /g,"&nbsp;"),id:a.data.id.toString().replace(/ /g,"&nbsp;"),name:a.data.name.replace(
/ /g,"&nbsp;"),manualURL:a.data.type==="experiment"?a.data.manualURL===""?"":'<a href="'+a.data.manualURL+
'" target="_blank">'+a.data.manualURL.replace(/ /g,"&nbsp;")+"</a>":"&lt;Nicht&nbsp;in&nbsp;Verwendung&gt;",homepageURL:
a.data.type==="vendor"?a.data.homepageURL===""?"":'<a href="'+a.data.homepageURL+'" target="_blank">'+a.data.homepageURL
.replace(/ /g,"&nbsp;")+"</a>":"&lt;Nicht&nbsp;in&nbsp;Verwendung&gt;",image:Ext.StoreMgr.get("ImageStore").getTag(a.
data.image)});this.items.item(1).items.item(1).setRecord(a);this.items.item(1).items.item(3).getEl().first().first().
first().update(a.data.description.replace(/\n/g,"<br />"))}});Ext.namespace("Ext.ux","Ext.ux.pimf","Ext.ux.pimf.folders"
);Ext.ux.pimf.folders.RemoveDialog=function(c){this.folderIds=c.extractProperty("data").extractProperty("id");this.show=
function(a){Ext.MessageBox.show({title:"L\xF6sche Ordner",msg:
"Sind Sie sich sicher, dass Sie diese(n) Ordner l\xF6schen wollen?",buttons:Ext.MessageBox.YESNO,icon:Ext.MessageBox.
QUESTION,animEl:a,scope:this,fn:function(d){if(d==="yes")Ext.StoreMgr.get("FolderStore").remoteRemove(this.folderIds)}})
}};Ext.namespace("Ext.ux","Ext.ux.pimf","Ext.ux.pimf.folders");Ext.ux.pimf.folders.Store=Ext.extend(Ext.data.JsonStore,{
constructor:function(){Ext.ux.pimf.folders.Store.superclass.constructor.call(this,{storeId:"FolderStore",autoSave:false,
fields:[{name:"id",type:"int"},{name:"name",type:"string"},{name:"parentFolderId",type:"int"},{name:"description",type:
"string"},{name:"type",type:"string"},{name:"manualURL",type:"string"},{name:"homepageURL",type:"string"},{name:"image",
type:"int"}],root:"records"});this.reader.recordType.prototype.getTypeLabel=function(){return this.store.typeLabels[this
.data.type]};this.reader.recordType.prototype.getTypeImageFile=function(){return this.store.typeImageFiles[this.data.
type]};this.reader.recordType.prototype.getTypePluralLabel=function(){return this.store.typePluralLabels[this.data.type]
};this.reader.recordType.prototype.getAllChildren=function(){var c=function(f,g,d){var e=Ext.StoreMgr.get("FolderStore")
.query("parentFolderId",new RegExp("^"+f.data.id.toString()+"$"),true,true);e.each(function(b,h,i){this.
allChildFolderRecords.push(b);this.handler(b,this.handler,this.allChildFolderRecords)},{allChildFolderRecords:d,handler:
g})},a=[];c(this,c,a);return a};this.reader.recordType.prototype.getPath=function(){var b=function(a,c){if(a.data.
parentFolderId===0)return"/"+a.data.name;var d=Ext.StoreMgr.get("FolderStore").getById(a.data.parentFolderId);return c(d
,c)+"/"+a.data.name};return b(this,b)};this.addEvents("remoteload","remotenew","remoteclone","remoteedit","remotemove",
"remoteremove")},checkFoldersMove:function(b,c){if(!Ext.ux.pimf.Connection.locked)return false;for(var a=0;a<b.length;
a++){if(b[a].data.type!==c.data.type)return false;if(b[a]===c)return false;if(b[a].data.parentFolderId===0)return false;
if(b[a].getAllChildren().indexOf(c)>-1)return false}return true},isFolderType:function(a){return a==="category"||a===
"experiment"||a==="location"||a==="vendor"},typeImageFiles:{category:"led-icons/book.png",experiment:"experiment.png",
location:"led-icons/direction.png",vendor:"led-icons/delivery.png"},typeLabels:{category:"Ordner (Kategorie)",experiment
:"Ordner (Versuch)",location:"Ordner (Ort)",vendor:"Ordner (Bezugsquelle)"},typePluralLabels:{category:
"Ordner (Kategorien)",experiment:"Ordner (Versuche)",location:"Ordner (Orte)",vendor:"Ordner (Bezugsquellen)"},
remoteLoad:function(){Ext.ux.pimf.Connection.request({action:["folders","get"],data:{},scope:this,customSuccess:function
(b,a){this.lastOptions=a;this.loadData(Ext.util.JSON.decode(b.responseText));this.fireEvent("remoteload",this.getRange()
)}})},remoteReload:function(){this.remoteLoad()},remoteNew:function(c){Ext.ux.pimf.Connection.request({action:["folders"
,"create"],data:c,scope:this,customSuccess:function(e,d){var a=Ext.apply(d.data,{id:Ext.util.JSON.decode(e.responseText)
.id}),b=new this.reader.recordType(a,a.id);this.add(b);this.fireEvent("remotenew",b)}})},remoteClone:function(b,a){Ext.
ux.pimf.Connection.request({action:["folders","clone"],data:{ids:b,count:a},scope:this,customSuccess:function(d,c){this.
remoteLoad();this.fireEvent("remoteclone")}})},remoteEdit:function(d){Ext.ux.pimf.Connection.request({action:["folders",
"update"],data:d,scope:this,customSuccess:function(f,e){var a=e.data,b=this.getById(a.id);for(var c in a)b.set(c,a[c]);
this.commitChanges();this.fireEvent("remoteedit",b)}})},remoteMove:function(g,i){Ext.ux.pimf.Connection.request({action:
["folders","move"],data:{ids:g,newParentFolderId:i},scope:this,customSuccess:function(j,f){var c=f.data.ids,b,d=[],e=f.
data.newParentFolderId,h=this.getById(e);for(var a=0;a<c.length;a++){b=this.getById(c[a]);b.set("parentFolderId",e);d.
push(b)}this.commitChanges();this.fireEvent("remotemove",d,h)}})},remoteRemove:function(e){Ext.ux.pimf.Connection.
request({action:["folders","delete"],data:{ids:e},scope:this,customSuccess:function(g,f){var c=f.data.ids,b,d=[];for(var
 a=0;a<c.length;a++){b=this.getById(c[a]);this.remove(b);d.push(b)}this.commitChanges();this.fireEvent("remoteremove",d)
}})}});Ext.namespace("Ext.ux","Ext.ux.pimf","Ext.ux.pimf.freeProperties");Ext.ux.pimf.freeProperties.AbstractWindow=Ext.
extend(Ext.Window,{constructor:function(b){Ext.ux.pimf.users.AbstractWindow.superclass.constructor.call(this,{title:b,
modal:true,resizable:false,width:400,autoHeight:true,buttons:[new Ext.Button({text:"Abbrechen",icon:
"images/led-icons/cancel.png",handler:function(a,c){this.ownerCt.ownerCt.close()}}),new Ext.Button({text:"Speichern",
icon:"images/led-icons/disk.png",handler:function(a,c){this.ownerCt.ownerCt.save()}})],layout:"fit",items:[new Ext.form.
FormPanel({autoHeight:true,defaults:{anchor:"100%"},border:false,padding:"10px 10px 6px 10px",items:[new Ext.form.
DisplayField({name:"id",fieldLabel:"ID"}),new Ext.form.TextField({name:"name",fieldLabel:"Name",ref:"../defaultButton",
listeners:{specialkey:function(c,a){if(a.getKey()===a.ENTER)this.ownerCt.ownerCt.buttons[1].handler(this.ownerCt.ownerCt
.buttons[1],{})}}}),new Ext.form.ComboBox({fieldLabel:"Format",editable:false,mode:"local",hiddenName:"format",
triggerAction:"all",store:new Ext.data.ArrayStore({data:Ext.ux.pimf.Util.includeKey(Ext.StoreMgr.get("FreePropertyStore"
).formatLabels),fields:["name","label"],idIndex:0}),valueField:"name",displayField:"label",value:"string"}),new Ext.form
.NumberField({name:"columnWidth",fieldLabel:"Standard Breite",value:80,listeners:{specialkey:function(c,a){if(a.getKey()
===a.ENTER)this.ownerCt.ownerCt.buttons[1].handler(this.ownerCt.ownerCt.buttons[1],{})}}}),new Ext.form.CheckboxGroup({
fieldLabel:"Regeln",columns:2,items:[new Ext.form.Checkbox({name:"unique",boxLabel:Ext.StoreMgr.get("FreePropertyStore")
.ruleLabels.unique}),new Ext.form.Checkbox({name:"readOnly",boxLabel:Ext.StoreMgr.get("FreePropertyStore").ruleLabels.
readOnly}),new Ext.form.Checkbox({name:"mandatory",boxLabel:Ext.StoreMgr.get("FreePropertyStore").ruleLabels.mandatory})
,new Ext.form.Checkbox({name:"afterToday",boxLabel:Ext.StoreMgr.get("FreePropertyStore").ruleLabels.afterToday}),new Ext
.form.Checkbox({name:"notEmpty",boxLabel:Ext.StoreMgr.get("FreePropertyStore").ruleLabels.notEmpty})]})]})]})}});Ext.
namespace("Ext.ux","Ext.ux.pimf","Ext.ux.pimf.freeProperties");Ext.ux.pimf.freeProperties.EditWindow=Ext.extend(Ext.ux.
pimf.freeProperties.AbstractWindow,{constructor:function(a){Ext.ux.pimf.freeProperties.EditWindow.superclass.constructor
.call(this,"Bearbeite freie Eigenschaft");this.freePropertyData=a.data;this.addListener("show",function(b){this.items.
item(0).getForm().setValues(this.freePropertyData)});Ext.ux.pimf.StoreObserver.create({storeId:"FreePropertyStore",scope
:this,events:["remoteedit"],listeners:{remoteedit:function(){this.close()}}})},save:function(){var b=this.items.item(0).
getForm().getFieldValues(),a=this.items.item(0).getForm().getValues();Ext.StoreMgr.get("FreePropertyStore").remoteEdit({
id:this.freePropertyData.id,name:b.name,format:b.format,columnWidth:b.columnWidth,unique:a.unique==="on",mandatory:a.
mandatory==="on",notEmpty:a.notEmpty==="on",readOnly:a.readOnly==="on",afterToday:a.afterToday==="on"})}});Ext.namespace
("Ext.ux","Ext.ux.pimf","Ext.ux.pimf.freeProperties");Ext.ux.pimf.freeProperties.Grid=Ext.extend(Ext.grid.GridPanel,{
constructor:function(){Ext.ux.pimf.freeProperties.Grid.superclass.constructor.call(this,{id:"FreePropertyGrid",border:
false,listeners:{rowcontextmenu:function(a,c,b){b.rowContext=true;if(!a.getSelectionModel().isSelected(c))a.
getSelectionModel().selectRow(c);a.showContextMenu(b)},containercontextmenu:function(b,a){a.rowContext=false;b.
showContextMenu(a)},containerclick:function(a,b){a.getSelectionModel().clearSelections()}},colModel:new Ext.grid.
ColumnModel({defaults:{editable:false,sortable:true,hidden:true},columns:[{header:"",dataIndex:"",fixed:true,
menuDisabled:true,hideable:false,hidden:false,width:30,renderer:function(f,b,c,d,a,e){
return'<img src="images/led-icons/tag_blue.png" />'}},{header:"ID",dataIndex:"id",width:50},{header:"Name",dataIndex:
"name",hidden:false,width:400},{header:"Format",dataIndex:"format",hidden:false,width:150,renderer:function(f,c,a,d,b,e)
{return a.getFormatLabel()}},{header:"Standard Breite",dataIndex:"columnWidth",width:100},{header:Ext.StoreMgr.get(
"FreePropertyStore").ruleLabels.unique,dataIndex:"unique",width:100,renderer:function(a,c,d,e,b,f){return a?"Ja":"Nein"}
},{header:Ext.StoreMgr.get("FreePropertyStore").ruleLabels.mandatory,dataIndex:"mandatory",width:100,renderer:function(a
,c,d,e,b,f){return a?"Ja":"Nein"}},{header:Ext.StoreMgr.get("FreePropertyStore").ruleLabels.notEmpty,dataIndex:
"notEmpty",width:100,renderer:function(a,c,d,e,b,f){return a?"Ja":"Nein"}},{header:Ext.StoreMgr.get("FreePropertyStore")
.ruleLabels.readOnly,dataIndex:"readOnly",width:100,renderer:function(a,c,d,e,b,f){return a?"Ja":"Nein"}},{header:Ext.
StoreMgr.get("FreePropertyStore").ruleLabels.afterToday,dataIndex:"afterToday",width:100,renderer:function(a,c,d,e,b,f){
return a?"Ja":"Nein"}}]}),columnLines:true,selModel:new Ext.grid.RowSelectionModel({listeners:{selectionchange:function(
a){this.grid.loadPropertyView()}}}),stripeRows:true,store:Ext.StoreMgr.get("FreePropertyStore"),view:new Ext.grid.
GridView({emptyText:"Es wurden keine Daten gefunden!"})})},getContextMenu:function(a){return new Ext.menu.Menu({items:[
new Ext.menu.Item({text:"Bearbeiten",iconCls:"x-menu-edit",disabled:this.getSelectionModel().getSelections().length>1,
hidden:!Ext.ux.pimf.Connection.locked||!a.rowContext,scope:this,handler:function(b,c){new Ext.ux.pimf.freeProperties.
EditWindow(this.getSelectionModel().getSelected()).show(b.getEl())}}),new Ext.menu.Item({text:"L\xF6schen",iconCls:
"x-menu-remove",hidden:!Ext.ux.pimf.Connection.locked||!a.rowContext,scope:this,handler:function(b,c){new Ext.ux.pimf.
freeProperties.RemoveDialog(this.getSelectionModel().getSelections()).show(b.getEl())}}),new Ext.menu.Separator({hidden:
!Ext.ux.pimf.Connection.locked||!a.rowContext}),new Ext.menu.Item({text:"Neu",iconCls:"x-menu-new",hidden:!Ext.ux.pimf.
Connection.locked,scope:this,handler:function(b,c){new Ext.ux.pimf.freeProperties.NewWindow().show(b.getEl())}}),new Ext
.menu.Separator({hidden:!Ext.ux.pimf.Connection.locked}),new Ext.menu.Item({text:"Alles ausw\xE4hlen",iconCls:
"x-menu-selection",scope:this,handler:function(b,c){this.getSelectionModel().selectAll()}})]})},showContextMenu:function
(a){a.stopEvent();if(a.button===0){if(this.getSelectionModel().getCount()===0)return;a.rowContext=true}var b=a.getXY();
this.getContextMenu(a).showAt([(b[0]+5),(b[1]+5)])},activate:function(){this.ownerCt.layout.setActiveItem(this.id);this.
loadPropertyView()},loadPropertyView:function(){var a=this.getSelectionModel().getSelections();if(a.length===0){Ext.
getCmp("BlankPropertyView").activate();Ext.getCmp("FreePropertyPropertyView").load(null)}else if(a.length===1){Ext.
getCmp("FreePropertyPropertyView").activate();Ext.getCmp("FreePropertyPropertyView").load(a[0].data.id)}else{Ext.getCmp(
"MultiPropertyView").activate(a.length);Ext.getCmp("FreePropertyPropertyView").load(null)}}});Ext.namespace("Ext.ux",
"Ext.ux.pimf","Ext.ux.pimf.freeProperties");Ext.ux.pimf.freeProperties.NewWindow=Ext.extend(Ext.ux.pimf.freeProperties.
AbstractWindow,{constructor:function(){Ext.ux.pimf.freeProperties.NewWindow.superclass.constructor.call(this,
"Neue freie Eigenschaft");this.addListener("show",function(a){this.items.item(0).getForm().setValues({id:"(neu)"})});Ext
.ux.pimf.StoreObserver.create({storeId:"FreePropertyStore",scope:this,events:["remotenew"],listeners:{remotenew:function
(){this.close()}}})},save:function(){var b=this.items.item(0).getForm().getFieldValues(),a=this.items.item(0).getForm().
getValues();Ext.StoreMgr.get("FreePropertyStore").remoteNew({id:0,name:b.name,format:b.format,columnWidth:b.columnWidth,
unique:a.unique==="on",mandatory:a.mandatory==="on",notEmpty:a.notEmpty==="on",readOnly:a.readOnly==="on",afterToday:a.
afterToday==="on"})}});Ext.namespace("Ext.ux","Ext.ux.pimf","Ext.ux.pimf.freeProperties");Ext.ux.pimf.freeProperties.
PropertyView=Ext.extend(Ext.form.FormPanel,{constructor:function(){Ext.ux.pimf.freeProperties.PropertyView.superclass.
constructor.call(this,{id:"FreePropertyPropertyView",border:false,defaults:{anchor:"100%"},border:false,padding:
"10px 10px 6px 10px",items:[new Ext.form.DisplayField({name:"type",hideLabel:true,cls:
"x-propertyview x-propertyview-freeProperty",value:"Freie Eigenschaft"}),new Ext.form.DisplayField({name:"id",fieldLabel
:"ID"}),new Ext.form.DisplayField({name:"name",fieldLabel:"Name"}),new Ext.form.DisplayField({name:"format",fieldLabel:
"Format"}),new Ext.form.DisplayField({name:"columnWidth",fieldLabel:"Standard Breite"}),new Ext.form.Label({fieldLabel:
"Regeln"}),new Ext.grid.GridPanel({cls:"greyborder",colModel:new Ext.grid.ColumnModel({columns:[{header:"Name",dataIndex
:"name",renderer:function(a,c,d,e,b,f){return Ext.StoreMgr.get("FreePropertyStore").ruleLabels[a]}},{header:"Wert",
dataIndex:"value",renderer:function(a,c,d,e,b,f){return a?"Ja":"Nein"}}]}),columnLines:true,disableSelection:true,
enableColumnMove:false,set:function(a){this.getStore().loadData(Ext.ux.pimf.Util.includeKey({unique:a.data.unique,
mandatory:a.data.mandatory,notEmpty:a.data.notEmpty,readOnly:a.data.readOnly,afterToday:a.data.afterToday}))},store:new 
Ext.data.ArrayStore({fields:["name","value"],idIndex:0,idProperty:"name"}),style:"margin-top: 7px; ",trackMouseOver:
false,view:new Ext.grid.GridView({forceFit:true,headersDisabled:true,scrollOffset:0})})]});Ext.ux.pimf.StoreObserver.
create({storeId:"FreePropertyStore",scope:this,events:["load","update"],listeners:{load:function(c,a,b){if(this.
freePropertyId===undefined||this.freePropertyId===null)return;this.reload()},update:function(c,a,b){if(a.data.id===this.
freePropertyId&&b===Ext.data.Record.COMMIT)this.reload()}}})},activate:function(){this.ownerCt.layout.setActiveItem(this
.id)},load:function(a){this.freePropertyId=a;this.reload()},reload:function(){if(this.freePropertyId===undefined||this.
freePropertyId===null)return;var a=Ext.StoreMgr.get("FreePropertyStore").getById(this.freePropertyId);if(a===undefined)
return;this.getForm().setValues({id:a.data.id.toString(),name:a.data.name,format:a.getFormatLabel(),columnWidth:a.data.
columnWidth.toString()});this.items.item(6).set(a)}});Ext.namespace("Ext.ux","Ext.ux.pimf","Ext.ux.pimf.freeProperties")
;Ext.ux.pimf.freeProperties.RemoveDialog=function(c){this.freePropertyIds=c.extractProperty("data").extractProperty("id"
);this.show=function(a){Ext.MessageBox.show({title:"L\xF6sche freie Eigenschaft(en)",msg:
"Sind Sie sich sicher, dass Sie diese Eigenschaft(en) l\xF6schen wollen?",buttons:Ext.MessageBox.YESNO,icon:Ext.
MessageBox.QUESTION,animEl:a,scope:this,fn:function(d){if(d==="yes")Ext.StoreMgr.get("FreePropertyStore").remoteRemove(
this.freePropertyIds)}})}};Ext.namespace("Ext.ux","Ext.ux.pimf","Ext.ux.pimf.freeProperties");Ext.ux.pimf.freeProperties
.Store=Ext.extend(Ext.data.JsonStore,{constructor:function(){Ext.ux.pimf.freeProperties.Store.superclass.constructor.
call(this,{storeId:"FreePropertyStore",autoSave:false,fields:[{name:"id",type:"int"},{name:"name",type:"string"},{name:
"format",type:"string"},{name:"columnWidth",type:"int"},{name:"unique",type:"bool"},{name:"mandatory",type:"bool"},{name
:"notEmpty",type:"bool"},{name:"readOnly",type:"bool"},{name:"afterToday",type:"bool"}],root:"records",sortInfo:{field:
"name",direction:"ASC"}});this.reader.recordType.prototype.getFormatLabel=function(){return this.store.formatLabels[this
.data.format]};this.addEvents("remoteload","remotenew","remoteedit","remoteremove")},formatLabels:{string:"Text",bool:
"Wahrheitswert",int:"Ganzzahl",float:"Gleitkommazahl",date:"Datum"},remoteLoad:function(){Ext.ux.pimf.Connection.request
({action:["freeProperties","get"],data:{},scope:this,customSuccess:function(b,a){this.lastOptions=a;this.loadData(Ext.
util.JSON.decode(b.responseText));this.fireEvent("remoteload",this.getRange())}})},remoteReload:function(){this.
remoteLoad()},remoteNew:function(c){Ext.ux.pimf.Connection.request({action:["freeProperties","create"],data:c,scope:this
,customSuccess:function(e,d){var a=Ext.apply(d.data,{id:Ext.util.JSON.decode(e.responseText).id}),b=new this.reader.
recordType(a,a.id);this.addSorted(b);this.fireEvent("remotenew",b)}})},remoteEdit:function(d){Ext.ux.pimf.Connection.
request({action:["freeProperties","update"],data:d,scope:this,customSuccess:function(f,e){var a=e.data,b=this.getById(a.
id);for(var c in a)b.set(c,a[c]);this.commitChanges();this.sort(this.getSortState().field,this.getSortState().direction)
;this.fireEvent("remoteedit",b)}})},remoteRemove:function(e){Ext.ux.pimf.Connection.request({action:["freeProperties",
"delete"],data:{ids:e},scope:this,customSuccess:function(g,f){var c=f.data.ids,b,d=[];for(var a=0;a<c.length;a++){b=this
.getById(c[a]);this.remove(b);d.push(b)}this.commitChanges();this.fireEvent("remoteremove",d)}})},ruleLabels:{unique:
"Eindeutig",mandatory:"Pflichtfeld",notEmpty:"Nicht leer",readOnly:"Schreibgesch\xFCtzt",afterToday:
"Sp\xE4ter als Heute"}});Ext.namespace("Ext.ux","Ext.ux.pimf","Ext.ux.pimf.images");Ext.ux.pimf.images.BrowserWindow=Ext
.extend(Ext.Window,{constructor:function(h,i){Ext.ux.pimf.images.BrowserWindow.superclass.constructor.call(this,{title:
"Bild ausw\xE4hlen",modal:true,resizable:false,width:750,height:500,buttons:[new Ext.Button({text:"Abbrechen",icon:
"images/led-icons/cancel.png",handler:function(a,b){this.ownerCt.ownerCt.close()}}),new Ext.Button({text:"Ausw\xE4hlen",
icon:"images/led-icons/add.png",handler:function(b,c){var a=this.ownerCt.ownerCt.items.item(0).getSelectedRecords();if(a
.length===1){this.ownerCt.ownerCt.field.setValue(a[0].data.id);this.ownerCt.ownerCt.close()}}})],tbar:new Ext.Toolbar({
layout:"fit",items:[new Ext.form.TriggerField({refOwner:this,triggerClass:"u-form-trigger-clear",hideTrigger:true,
emptyText:"Suche",emptyClass:"u-form-trigger-empty",listeners:{specialkey:function(b,a){if(a.getKey()===a.ENTER){Ext.
StoreMgr.get("ImageStore").remoteLoad({search:this.getRawValue()});this.setHideTrigger(false)}},added:function(a,c,b){
this.refName="defaultButton";this.refOwner.defaultButton=this}},onTriggerClick:function(a){Ext.StoreMgr.get("ImageStore"
).removeAll();this.setValue("");this.setHideTrigger(true)}})]}),bbar:new Ext.Toolbar({layout:"fit",items:[new Ext.
FormPanel({border:false,fileUpload:true,autoHeight:true,layout:"hbox",layoutConfig:{align:"middle"},items:[new Ext.form.
TextField({name:"name",emptyText:"Name",value:i,flex:1}),new Ext.ux.form.FileUploadField({name:"file",buttonOnly:true,
buttonText:"Durchsuchen"}),new Ext.Button({text:"Hochladen",icon:"images/arrow_up.png",handler:function(a,b){a.ownerCt.
ownerCt.ownerCt.items.item(0).getStore().remoteNew({id:0,name:a.ownerCt.items.item(0).getValue()},a.ownerCt.getForm())}}
)]})]}),layout:"fit",items:[new Ext.DataView({id:"ImageDataView",autoScroll:true,tpl:new Ext.XTemplate('<tpl for=".">',
'<div class="x-view-thumb">','<div><img src="'+Ext.SOFTWARE_URL+"data/images/thumbnails/"+
'{id}.jpeg" title="ID: {id}"></div>','<span title="{name}">{name}</span>',"</div>","</tpl>",
'<div class="x-clear"></div>'),store:Ext.StoreMgr.get("ImageStore"),emptyText:
'<div class="x-grid-empty">Es wurden keine Daten gefunden!</div>',singleSelect:true,overClass:"x-view-over",itemSelector
:"div.x-view-thumb",style:"background-color: #FFFFFF; ",listeners:{contextmenu:function(a,k,b,e){e.stopEvent();a.select(
b);var f=new Ext.menu.Menu({items:[new Ext.menu.Item({text:"Orginal ansehen",iconCls:"x-menu-magnifier",scope:{dataView:
a,node:b},handler:function(g,j){var c=this.dataView.getRecord(this.node).data.id;if(c!==0)window.open(Ext.SOFTWARE_URL+
"data/images/"+c.toString()+".jpeg")}}),new Ext.menu.Item({text:"Umbennen",iconCls:"x-menu-rename",scope:{dataView:a,
node:b},handler:function(c,g){new Ext.ux.pimf.images.RenameDialog(this.dataView.getRecord(this.node)).show(c.getEl())}})
,new Ext.menu.Item({text:"L\xF6schen",iconCls:"x-menu-remove",scope:{dataView:a,node:b},handler:function(c,g){new Ext.ux
.pimf.images.RemoveDialog(this.dataView.getRecord(this.node)).show(c.getEl())}})]}),d=e.getXY();f.showAt([(d[0]+5),(d[1]
+5)])},dblclick:function(a,d,b,c){a.ownerCt.field.setValue(a.getRecord(b).data.id);a.ownerCt.close()}}})]});this.field=h
;if(this.field.value===0)Ext.StoreMgr.get("ImageStore").removeAll();else Ext.StoreMgr.get("ImageStore").remoteLoad({id:
this.field.value})}});Ext.namespace("Ext.ux","Ext.ux.pimf","Ext.ux.pimf.images");Ext.ux.pimf.images.ImageField=Ext.
extend(Ext.form.CompositeField,{constructor:function(c){Ext.ux.pimf.images.ImageField.superclass.constructor.call(this,{
hideLabel:true,items:[Ext.apply(new Ext.form.Hidden(c),{setValue:function(b){var a;if(b===0)a={id:"-",type:"-",tag:Ext.
StoreMgr.get("ImageStore").getTag(0)};else a={id:b.toString(),type:"JPG",tag:Ext.StoreMgr.get("ImageStore").getTag(b)};
var d=new Ext.XTemplate('<p style="padding-bottom: 3px; ">ID: {id}</p>',
'<p style="padding-bottom: 3px; ">Typ: {type}</p>');d.overwrite(this.ownerCt.items.item(1).items.item(1).items.item(0).
body,a);Ext.form.Hidden.prototype.setValue.call(this,b);this.ownerCt.items.item(1).items.item(0).setValue(a.tag)}}),new 
Ext.Panel({flex:1,layout:"hbox",layoutConfig:{align:"stretchmax"},items:[new Ext.form.DisplayField({width:100,height:100
,cls:"x-image-display",hideLabel:true}),new Ext.Panel({unstyled:true,layout:"vbox",padding:"10px 10px 10px 0",flex:1,
layoutConfig:{align:"stretch"},items:[new Ext.Panel({unstyled:true,padding:"0 0 10px 0",flex:1}),new Ext.Panel({unstyled
:true,layout:"hbox",layoutConfig:{align:"stretchmax"},items:[new Ext.Button({imageField:this,text:"Ausw\xE4hlen",icon:
"images/led-icons/add.png",margins:"0 5 0 0",handler:function(a,b){new Ext.ux.pimf.images.BrowserWindow(a.ownerCt.
ownerCt.ownerCt.ownerCt.items.item(0),a.imageField.ownerCt.form.getValues().name).show(this.getEl())}}),new Ext.Button({
text:"Entfernen",icon:"images/led-icons/cross.png",margins:"0 5 0 0",handler:function(a,b){a.ownerCt.ownerCt.ownerCt.
ownerCt.items.item(0).setValue(0)}})]})]})]})]})}});Ext.namespace("Ext.ux","Ext.ux.pimf","Ext.ux.pimf.images");Ext.ux.
pimf.images.RemoveDialog=function(c){this.imageData=c.data;this.show=function(a){Ext.MessageBox.show({title:
"L\xF6sche Bild",msg:"Sind Sie sich sicher, dass Sie dieses Bild l\xF6schen wollen?",buttons:Ext.MessageBox.YESNO,icon:
Ext.MessageBox.QUESTION,animEl:a,scope:this,fn:function(d){if(d==="yes")Ext.StoreMgr.get("ImageStore").remoteRemove(this
.imageData.id)}})}};Ext.namespace("Ext.ux","Ext.ux.pimf","Ext.ux.pimf.images");Ext.ux.pimf.images.RenameDialog=function(
b){this.imageData=b.data;this.show=function(a){Ext.MessageBox.show({title:"Benenne Bild um",msg:
"Geben Sie bitte den neuen Namen des Bildes ein:",buttons:Ext.MessageBox.OKCANCEL,icon:Ext.MessageBox.QUESTION,animEl:a,
prompt:true,value:this.imageData.name,scope:this,fn:function(d,c){Ext.StoreMgr.get("ImageStore").remoteEdit({id:this.
imageData.id,name:c})}})}};Ext.namespace("Ext.ux","Ext.ux.pimf","Ext.ux.pimf.images");Ext.ux.pimf.images.Store=Ext.
extend(Ext.data.JsonStore,{constructor:function(){Ext.ux.pimf.images.Store.superclass.constructor.call(this,{storeId:
"ImageStore",autoSave:false,fields:[{name:"id",type:"int"},{name:"name",type:"string"}],root:"records",sortInfo:{field:
"name",direction:"ASC"}});this.addEvents("remoteload","remotenew","remoteedit","remoteremove")},getOriginalURL:function(
a){return a===0?"images/blank_thumbnail.png":Ext.SOFTWARE_URL+"data/images/"+a.toString()+".jpeg"},
getOriginalAbsoluteURL:function(a){return a===0?Ext.SOFTWARE_URL+"server/images/blank_thumbnail.png":Ext.SOFTWARE_URL+
"data/images/"+a.toString()+".jpeg"},getThumbnailURL:function(a){return a===0?"images/blank_thumbnail.png":Ext.
SOFTWARE_URL+"data/images/thumbnails/"+a.toString()+".jpeg"},getThumbnailAbsoluteURL:function(a){return a===0?Ext.
SOFTWARE_URL+"server/images/blank_thumbnail.png":Ext.SOFTWARE_URL+"data/images/thumbnails/"+a.toString()+".jpeg"},getTag
:function(a){return a===0?
'<img src="images/blank_thumbnail.png" title="Kein Bild" width="80" height="80" style="border: 1px solid #CCCCCC; " />':
'<img src="'+this.getThumbnailURL(a)+'" title="ID: '+a.toString()+'" onclick="window.open(\''+this.
getOriginalAbsoluteURL(a)+'\')" width="80" height="80" style="border: 1px solid #CCCCCC; cursor: pointer; " />'},
remoteLoad:function(a){this.removeAll();Ext.ux.pimf.Connection.request({action:["images","get"],data:a,scope:this,
customSuccess:function(c,b){this.lastOptions=b;this.loadData(Ext.util.JSON.decode(c.responseText));this.fireEvent(
"remoteload",this.getRange())}})},remoteReload:function(){if(this.lastOptions!==null)this.remoteLoad(Ext.decode(this.
lastOptions.params.data))},remoteNew:function(f,b){Ext.ux.pimf.Connection.request({action:["images","create"],data:f,
form:b.getEl(),formComponent:b,scope:this,customSuccess:function(e,d){d.formComponent.reset();this.removeAll();var c=Ext
.apply(d.data,{id:Ext.util.JSON.decode(e.responseText).id}),a=new this.reader.recordType(c,c.id);this.add(a);Ext.getCmp(
"ImageDataView").select(a);this.fireEvent("remotenew",a)}})},remoteEdit:function(d){Ext.ux.pimf.Connection.request({
action:["images","update"],data:d,scope:this,customSuccess:function(f,e){var a=e.data,b=this.getById(a.id);for(var c in 
a)b.set(c,a[c]);this.commitChanges();this.sort(this.getSortState().field,this.getSortState().direction);this.fireEvent(
"remoteedit",b)}})},remoteRemove:function(c){Ext.ux.pimf.Connection.request({action:["images","delete"],data:{id:c},
scope:this,customSuccess:function(e,d){var b=d.data.id,a=this.getById(b);this.remove(a);this.commitChanges();this.
fireEvent("remoteremove",a)}})}});Ext.namespace("Ext.ux","Ext.ux.pimf","Ext.ux.pimf.items");Ext.ux.pimf.items.
AbstractWindow=Ext.extend(Ext.Window,{constructor:function(b){this.tree=new Ext.ux.pimf.items.AbstractWindow_Tree();this
.grid=new Ext.ux.pimf.items.AbstractWindow_Grid();Ext.ux.pimf.items.AbstractWindow.superclass.constructor.call(this,{
title:b,modal:true,resizable:false,width:600,autoHeight:true,buttons:[new Ext.Button({text:"Abbrechen",icon:
"images/led-icons/cancel.png",handler:function(a,c){this.ownerCt.ownerCt.close()}}),new Ext.Button({text:"Speichern",
icon:"images/led-icons/disk.png",handler:function(a,c){this.ownerCt.ownerCt.save()}})],layout:"fit",items:[new Ext.
TabPanel({activeTab:0,bodyStyle:"background-color: inherit; ",border:false,items:[new Ext.form.FormPanel({title:
"Allgemein",autoHeight:true,defaults:{anchor:"100%"},border:false,padding:"10px 10px 6px 10px",items:[new Ext.form.
DisplayField({name:"id",fieldLabel:"ID"}),new Ext.form.TextField({name:"name",fieldLabel:"Name",ref:
"../../defaultButton",listeners:{specialkey:function(c,a){if(a.getKey()===a.ENTER)this.ownerCt.ownerCt.ownerCt.buttons[1
].handler(this.ownerCt.ownerCt.ownerCt.buttons[1],{})}}}),new Ext.form.Label({fieldLabel:"Bild"}),new Ext.ux.pimf.images
.ImageField({name:"image"}),new Ext.form.Label({fieldLabel:"Beschreibung"}),new Ext.form.TextArea({name:"description",
hideLabel:true,height:350})]}),this.tree,this.grid]})]})}});Ext.namespace("Ext.ux","Ext.ux.pimf","Ext.ux.pimf.items");
Ext.ux.pimf.items.AbstractWindow_Grid=Ext.extend(Ext.grid.EditorGridPanel,{constructor:function(){Ext.ux.pimf.items.
AbstractWindow_Grid.superclass.constructor.call(this,{title:"Freie Eigenschaften",border:false,clicksToEdit:1,listeners:
{rowcontextmenu:function(d,f,e){e.stopEvent();if(!d.getSelectionModel().isSelected(f))d.getSelectionModel().selectRow(f)
;var g=new Ext.menu.Menu({items:[new Ext.menu.Item({text:"L\xF6sche Wertzuweisung",iconCls:"x-menu-remove",handler:
function(a,b){d.getStore().remove(d.getSelectionModel().getSelected())}}),new Ext.menu.Separator(),new Ext.menu.Item({
text:"Neue Wertzuweisung",iconCls:"x-menu-new",handler:function(b,h){var a=d.getStore();a.add(new a.recordType({id:"",
value:""}))}}),new Ext.menu.Item({text:"Neue freie Eigenschaft",iconCls:"x-menu-new",handler:function(a,b){new Ext.ux.
pimf.freeProperties.NewWindow().show(this.getEl())}})]}),c=e.getXY();g.showAt([(c[0]+5),(c[1]+5)])},containercontextmenu
:function(f,c){c.stopEvent();var d=new Ext.menu.Menu({items:[new Ext.menu.Item({text:"Neue Wertzuweisung",iconCls:
"x-menu-new",handler:function(e,g){var b=f.getStore();b.add(new b.recordType({id:"",value:""}))}}),new Ext.menu.Item({
text:"Neue freie Eigenschaft",iconCls:"x-menu-new",handler:function(b,e){new Ext.ux.pimf.freeProperties.NewWindow().show
(this.getEl())}})]}),a=c.getXY();d.showAt([(a[0]+5),(a[1]+5)])},beforeedit:function(c){if(c.column===2){var d=Ext.
StoreMgr.get("FreePropertyStore").getById(c.record.data.id),a=c.grid.getColumnModel().getColumnById(2);if(d===undefined)
a.setEditor(undefined);else{var b=d.data.format;if(b==="string")a.setEditor(new Ext.form.TextField());else if(b==="bool"
)a.setEditor(new Ext.form.ComboBox({editable:false,mode:"local",triggerAction:"all",store:[["","Kein Wert"],["true","Ja"
],["false","Nein"]],value:0}));else if(b==="int")a.setEditor(new Ext.form.NumberField({allowDecimals:false,maxValue:
0xE8D4A51000}));else if(b==="float")a.setEditor(new Ext.form.NumberField({baseChars:"+0123456789eE",decimalPrecision:16}
));else if(b==="date")a.setEditor(new Ext.form.DateField());else a.setEditor(undefined)}}},afteredit:function(a){if(a.
column===1)a.record.set("value","")}},colModel:new Ext.grid.ColumnModel({defaults:{editable:true},columns:[{header:"",
dataIndex:"",width:30,editable:false,fixed:true,menuDisabled:true,renderer:function(f,b,c,d,a,e){
return'<img src="images/led-icons/tag_blue.png" />'}},{header:"Name",dataIndex:"id",renderer:function(b,d,e,f,c,g){if(b
==="")return"";var a=Ext.StoreMgr.get("FreePropertyStore").getById(b);if(a===undefined)return"Unbekannte Eigenschaft";
else return a.data.name},editor:new Ext.form.ComboBox({mode:"local",lazyRender:true,lazyInit:false,forceSelection:true,
triggerAction:"all",store:Ext.StoreMgr.get("FreePropertyStore"),valueField:"id",displayField:"name"})},{header:"Wert",
dataIndex:"value",renderer:function(a,f,d,g,e,h){var c=Ext.StoreMgr.get("FreePropertyStore").getById(d.data.id);if(c===
undefined)return"";else{var b=c.data.format;if(b==="string")return a;else if(b==="bool"){if(a==="true")return"Ja";else 
if(a==="false")return"Nein";else return"";return a}else if(b==="int")return typeof a!=="number"?"":parseInt(a).toString(
);else if(b==="float")return typeof a!=="number"?"":parseFloat(a).toExponential();else if(b==="date")return typeof a!==
"object"?"":a.format("d.m.Y")}},editor:undefined}]}),columnLines:true,selModel:new Ext.grid.RowSelectionModel(),
stripeRows:true,store:new Ext.data.ArrayStore({idIndex:0,fields:["id","value"]}),view:new Ext.grid.GridView({forceFit:
true,emptyText:"Es sind keine freien Eigenschaften definiert!"})})},get:function(){var e={},d=this.getStore().getRange()
;for(var c=0;c<d.length;c++){var b=Ext.StoreMgr.get("FreePropertyStore").getById(d[c].data.id),a=d[c].data.value;if(b===
undefined)continue;if(b.data.format==="string"){}else if(b.data.format==="bool")if(a==="true")a=true;else if(a==="false"
)a=false;else a=null;else if(b.data.format==="int")if(typeof a==="number")a=parseInt(a);else a=null;else if(b.data.
format==="float")if(typeof a==="number")a=parseFloat(a);else a=null;else if(b.data.format==="date")if(typeof a===
"object"){}else a=null;else continue;e["freePropertyValue"+b.data.id.toString()]=a}return e},set:function(d){var e=this.
getStore();for(var c in d)if(c.substr(0,17)==="freePropertyValue"&&d[c]!==undefined){var b=Ext.StoreMgr.get(
"FreePropertyStore").getById(Number(c.substr(17))),a=d[c];if(b.data.format==="string"){}else if(b.data.format==="bool")
if(a===true)a="true";else if(a===false)a="false";else a="";else if(b.data.format==="int")if(typeof a==="number"){}else a
="";else if(b.data.format==="float")if(typeof a==="number"){}else a="";else if(b.data.format==="date")if(typeof a===
"object"){}else a="";else a="";var f=new e.recordType({id:b.data.id,value:a},b.data.id);e.addSorted(f)}}});Ext.namespace
("Ext.ux","Ext.ux.pimf","Ext.ux.pimf.folders");Ext.ux.pimf.items.AbstractWindow_Tree=Ext.extend(Ext.ux.pimf.folders.
AbstractTree,{constructor:function(){Ext.ux.pimf.items.AbstractWindow_Tree.superclass.constructor.call(this,{title:
"Ordnerlinks",checked:[],renderCheckboxes:true});this.addListener("afterrender",function(b){for(var a=0;a<this.checked.
length;a++)this.getNodeById(this.checked[a].toString()).ensureVisible(function(){this.ui.toggleCheck(true)})});this.
storeObservers.FolderStore.fireEvent("remoteload",true)},get:function(){var a;if(this.rendered){a=this.getChecked("id");
for(var b=0;b<a.length;b++)a[b]=Number(a[b])}else a=this.checked;return{itemFolderLinks:a}},set:function(a){this.checked
=a}});Ext.namespace("Ext.ux","Ext.ux.pimf","Ext.ux.pimf.items");Ext.ux.pimf.items.CloneDialog=function(d){this.itemIds=d
.extractProperty("data").extractProperty("id");this.show=function(b){Ext.MessageBox.show({title:"Klone Gegenstand",msg:
"Geben Sie bitte die gew\xFCnschte Anzahl der Klone ein:",buttons:Ext.MessageBox.OKCANCEL,icon:Ext.MessageBox.QUESTION,
animEl:b,prompt:true,value:"1",scope:this,fn:function(e,f){var a=parseInt(f);if(e==="ok"&&a>0)Ext.StoreMgr.get(
"ItemStore").remoteClone(this.itemIds,a)}})}};Ext.namespace("Ext.ux","Ext.ux.pimf","Ext.ux.pimf.items");Ext.ux.pimf.
items.EditWindow=Ext.extend(Ext.ux.pimf.items.AbstractWindow,{constructor:function(a){Ext.ux.pimf.items.EditWindow.
superclass.constructor.call(this,"Bearbeite Gegenstand");this.itemData=a.data;this.addListener("show",function(b){this.
items.item(0).items.item(0).getForm().setValues({id:String(this.itemData.id),name:this.itemData.name,image:this.itemData
.image,description:this.itemData.description});this.tree.set(this.itemData.itemFolderLinks);this.grid.set(this.itemData)
});Ext.ux.pimf.StoreObserver.create({storeId:"ItemStore",scope:this,events:["remoteedit"],listeners:{remoteedit:function
(){this.close()}}})},save:function(){var b=this.items.item(0).items.item(0).getForm().getFieldValues(),c=this.items.item
(0).items.item(0).getForm().getValues(),a={id:this.itemData.id,name:b.name,image:parseInt(c.image),description:b.
description};Ext.apply(a,this.tree.get());Ext.apply(a,this.grid.get());Ext.StoreMgr.get("ItemStore").remoteEdit(a)}});
Ext.namespace("Ext.ux","Ext.ux.pimf","Ext.ux.pimf.items");Ext.ux.pimf.items.Grid=Ext.extend(Ext.grid.GridPanel,{
constructor:function(){Ext.ux.pimf.items.Grid.superclass.constructor.call(this,{id:"ItemGrid",border:false,listeners:{
render:function(a){a.ddInitDropTarget()},rowcontextmenu:function(a,c,b){b.rowContext=true;if(!a.getSelectionModel().
isSelected(c))a.getSelectionModel().selectRow(c);a.showContextMenu(b)},containercontextmenu:function(b,a){a.rowContext=
false;b.showContextMenu(a)},rowdblclick:function(a,c,d){if(a.getSelectionModel().justFolders()){var b=a.getStore().getAt
(c).getFolderRecord();Ext.getCmp("NavigationTree").getNodeById(b.data.id.toString()).approvedSelect()}},containerclick:
function(a,b){a.getSelectionModel().clearSelections()}},colModel:new Ext.grid.ColumnModel({defaults:{editable:false,
sortable:true,width:80},columns:[]}),columnLines:true,selModel:new Ext.ux.pimf.items.Grid_MultiRowSelectionModel(),
stripeRows:true,enableDragDrop:true,ddGroup:"FoldersMove&ItemsLink",ddInitDropTarget:function(){var f=this.getView().el.
dom.childNodes[0].childNodes[1],h=new Ext.dd.DropTarget(f,{ddGroup:"FoldersMove&ItemsLink",grid:this,prepareDDParameters
:function(g,e,a){var b={action:undefined,checkAction:function(){return false},getProxyCls:function(){
return"x-dd-drop-nodrop"}},d=this.grid.store.data.items[this.grid.getView().findRowIndex(e.target)],c;if(d===undefined){
if(Ext.getCmp("NavigationTree").getSelectedNodeFolderRecord()===undefined||Ext.getCmp("NavigationTree").
isSelectedNodeSpecial())return b;c=Ext.getCmp("NavigationTree").getSelectedNodeFolderRecord()}else{if(!Ext.StoreMgr.get(
"FolderStore").isFolderType(d.data.type))return b;c=d.getFolderRecord()}if(a.selections!==undefined)if(a.selections[0].
data.type==="item")return{action:e.altKey?"unlink":"link",checkAction:function(){return Ext.StoreMgr.get("ItemStore").
checkItemsLink(this.sourceItemRecords,this.targetFolderRecord)},getProxyCls:function(){return this.checkAction()?e.
altKey?"x-dd-drop-unlink":"x-dd-drop-link":"x-dd-drop-nodrop"},sourceItemRecords:a.selections,targetFolderRecord:c};else
 if(Ext.StoreMgr.get("FolderStore").isFolderType(a.selections[0].data.type))return{action:"move",checkAction:function(){
return Ext.StoreMgr.get("FolderStore").checkFoldersMove(this.sourceFolderRecords,this.targetFolderRecord)},getProxyCls:
function(){return this.checkAction()?"x-dd-drop-move":"x-dd-drop-nodrop"},sourceFolderRecords:Ext.StoreMgr.get(
"ItemStore").getFolderRecordsOfItemRecords(a.selections),targetFolderRecord:c};else return b;else if(a.node!==undefined)
{if(a.node.attributes.record===undefined)return b;return{action:"move",checkAction:function(){return Ext.StoreMgr.get(
"FolderStore").checkFoldersMove(this.sourceFolderRecords,this.targetFolderRecord)},getProxyCls:function(){return this.
checkAction()?"x-dd-drop-move":"x-dd-drop-nodrop"},sourceFolderRecords:[a.node.attributes.record],targetFolderRecord:c}}
else return b},notifyOver:function(d,c,a){var b=this.prepareDDParameters(d,c,a);return b.getProxyCls()},notifyDrop:
function(d,c,b){var a=this.prepareDDParameters(d,c,b);if(a.checkAction()){if(a.action==="move")Ext.StoreMgr.get(
"FolderStore").remoteMove(a.sourceFolderRecords.extractProperty("data").extractProperty("id"),a.targetFolderRecord.data.
id);if(a.action==="link")Ext.StoreMgr.get("ItemStore").remoteLink(a.sourceItemRecords.extractProperty("data").
extractProperty("id"),a.targetFolderRecord.data.id);if(a.action==="unlink")Ext.StoreMgr.get("ItemStore").remoteUnlink(a.
sourceItemRecords.extractProperty("data").extractProperty("id"),a.targetFolderRecord.data.id);return true}else
 return false}})},store:Ext.StoreMgr.get("ItemStore"),view:new Ext.ux.pimf.items.Grid_StructuredGridView()})},
getContextMenu:function(b){var a=this.getSelectionModel();return new Ext.menu.Menu({items:[new Ext.menu.Item({text:
"Bearbeiten",iconCls:"x-menu-edit",disabled:!a.hasSameType()||a.includesMainFolders()||a.justFolders()&&!a.justOne(),
hidden:!Ext.ux.pimf.Connection.locked||!b.rowContext,scope:this,handler:function(c,d){if(this.getSelectionModel().
justItems()&&this.getSelectionModel().justOne())new Ext.ux.pimf.items.EditWindow(this.getSelectionModel().getSelected())
.show(c.getEl());else if(this.getSelectionModel().justItems())alert("TODO");else new Ext.ux.pimf.folders.EditWindow(this
.getSelectionModel().getSelected().getFolderRecord()).show(c.getEl())}}),new Ext.menu.Item({text:"Klonen",iconCls:
"x-menu-clone",disabled:!a.hasSameType()||a.includesMainFolders(),hidden:!Ext.ux.pimf.Connection.locked||!b.rowContext,
scope:this,handler:function(c,d){if(this.getSelectionModel().justItems())new Ext.ux.pimf.items.CloneDialog(this.
getSelectionModel().getSelections()).show(c.getEl());else new Ext.ux.pimf.folders.CloneDialog(this.getStore().
getFolderRecordsOfItemRecords(this.getSelectionModel().getSelections())).show(c.getEl())}}),new Ext.menu.Item({text:
"L\xF6schen",iconCls:"x-menu-remove",disabled:!a.hasSameType()||a.includesMainFolders(),hidden:!Ext.ux.pimf.Connection.
locked||!b.rowContext,scope:this,handler:function(c,d){if(this.getSelectionModel().justItems())new Ext.ux.pimf.items.
RemoveDialog(this.getSelectionModel().getSelections()).show(c.getEl());else new Ext.ux.pimf.folders.RemoveDialog(this.
getStore().getFolderRecordsOfItemRecords(this.getSelectionModel().getSelections())).show(c.getEl())}}),new Ext.menu.
Separator({hidden:!Ext.ux.pimf.Connection.locked||!b.rowContext}),new Ext.menu.Item({text:"Neuer Gegenstand",iconCls:
"x-menu-new",disabled:Ext.getCmp("NavigationTree").isSelectedNodeSpecial(),hidden:!Ext.ux.pimf.Connection.locked,scope:
this,handler:function(c,d){new Ext.ux.pimf.items.NewWindow(Ext.getCmp("NavigationTree").getSelectedNodeFolderRecord()).
show(c.getEl())}}),new Ext.menu.Item({text:"Neuer Ordner",iconCls:"x-menu-new",disabled:Ext.getCmp("NavigationTree").
isSelectedNodeSpecial(),hidden:!Ext.ux.pimf.Connection.locked,scope:this,handler:function(c,d){new Ext.ux.pimf.folders.
NewWindow(Ext.getCmp("NavigationTree").getSelectedNodeFolderRecord()).show(c.getEl())}}),new Ext.menu.Separator({hidden:
!Ext.ux.pimf.Connection.locked}),new Ext.menu.Item({text:"Alles ausw\xE4hlen",iconCls:"x-menu-selection",scope:this,
handler:function(c,d){this.getSelectionModel().selectAll()}}),new Ext.menu.Item({text:"Druckvorschau",iconCls:
"x-menu-preview",scope:this,handler:function(c,d){new Ext.ux.pimf.items.PreviewWindow().show(c.getEl())}})]})},
showContextMenu:function(a){a.stopEvent();if(a.button===0){if(this.getSelectionModel().getCount()===0)return;a.
rowContext=true}var b=a.getXY();this.getContextMenu(a).showAt([(b[0]+5),(b[1]+5)])},activate:function(){this.ownerCt.
layout.setActiveItem(this.id);this.loadPropertyView()},loadPropertyView:function(){var a=this.getSelectionModel().
getSelections();if(a.length===0){Ext.getCmp("BlankPropertyView").activate();Ext.getCmp("ItemPropertyView").load(null);
Ext.getCmp("FolderPropertyView").load(null)}else if(a.length===1)if(a[0].data.type==="item"){Ext.getCmp(
"ItemPropertyView").activate();Ext.getCmp("ItemPropertyView").load(a[0].data.id);Ext.getCmp("FolderPropertyView").load(
null)}else{Ext.getCmp("FolderPropertyView").activate();Ext.getCmp("ItemPropertyView").load(null);Ext.getCmp(
"FolderPropertyView").load(a[0].data.id)}else{Ext.getCmp("MultiPropertyView").activate(a.length);Ext.getCmp(
"ItemPropertyView").load(null);Ext.getCmp("FolderPropertyView").load(null)}}});Ext.namespace("Ext.ux","Ext.ux.pimf",
"Ext.ux.pimf.items");Ext.ux.pimf.items.Grid_MultiRowSelectionModel=Ext.extend(Ext.grid.RowSelectionModel,{constructor:
function(){Ext.ux.pimf.items.Grid_MultiRowSelectionModel.superclass.constructor.call(this,{hasSameType:function(){
return this.justItems()||this.justFolders()},includesMainFolders:function(){var b=this.getSelections();for(var a=0;a<b.
length;a++)if(b[a].data.parentFolderId==="0"&&Ext.StoreMgr.get("FolderStore").isFolderType(b[a].data.type))return true;
return false},justOne:function(){return this.getSelections().length===1},justItems:function(){var b=this.getSelections()
;for(var a=0;a<b.length;a++)if(b[a].data.type!=="item")return false;return true},justFolders:function(){var b=this.
getSelections();for(var a=0;a<b.length;a++)if(!Ext.StoreMgr.get("FolderStore").isFolderType(b[a].data.type))return false
;return true},listeners:{selectionchange:function(a){this.grid.loadPropertyView()}}})}});Ext.namespace("Ext.ux",
"Ext.ux.pimf","Ext.ux.pimf.items");Ext.ux.pimf.items.Grid_StructuredGridView=Ext.extend(Ext.grid.GroupingView,{
constructor:function(){Ext.ux.pimf.items.Grid_StructuredGridView.superclass.constructor.call(this,{emptyText:
"Es wurden keine Daten gefunden!",enableRowBody:true,getRowClass:function(j,l,a,k){if(Ext.getCmp("NavigationTree").
getSelectedNodeId()!=="ruleViolation")return"";var b=j.data.ruleViolation;if(b===undefined)a.body=
'<div class="ruleViolation-undefined"><p>Dieser Gegenstand verletzt keine Regeln.</p></div>';else if(b===null)a.body=
'<div class="ruleViolation-null"><p>Es ist unbekannt, ob dieser Gegenstand Regeln verletzt. Aktualisieren Sie die Liste, um dies zu erfahren.</p></div>'
;else{a.body='<div class="ruleViolation-violated"><p>Regelverletzungen bei freien Eigenschaften:</p>';a.body+="<ul>";var
 f=k.reader.meta.freeProperties,i="";for(var c in b){if(isNaN(Number(c)))continue;for(var d=0;d<f.length;d++)if(f[d].id
===Number(c))i=f[d].name;a.body+='<li>"'+i+'" ist ';var h=true;for(var g=0;g<b[c].length;g++){var e=b[c][g];if(h)h=false
;else a.body+=" und ";if(e==="unique")a.body+="nicht eindeutig";else if(e==="mandatory")a.body+="Pflichtfeld";else if(e
==="notEmpty")a.body+="leer";else if(e==="afterToday")a.body+="fr\xFCher als Heute";else a.body+=
"FEHLER: UNBEKANNTE REGEL"}a.body+="</li>"}a.body+="</ul></div>"}return""},beforeColMenuShow:function(){var a=this,g=a.
cm.getColumnCount();a.colMenu.removeAll();var c=new Ext.menu.Menu(),e=new Ext.menu.Item({text:"Freie Eigenschaften",icon
:"images/led-icons/tag_blue.png",menu:{listeners:{itemclick:function(f,j){a.handleHdMenuClick(f)}}}}),i={main:a.colMenu,
folderProperties:c,freeProperties:e.menu};for(var b=0;b<g;b++)if(a.cm.config[b].fixed!==true&&a.cm.config[b].hideable!==
false)i[a.cm.config[b].submenu].add(new Ext.menu.CheckItem({itemId:"col-"+a.cm.getColumnId(b),text:a.cm.getColumnHeader(
b),checked:!a.cm.isHidden(b),hideOnClick:false,disabled:a.cm.config[b].hideable===false}));this.colMenu.add(new Ext.menu
.Separator());var h=c.items.getCount();for(var d=0;d<h;d++)this.colMenu.add(c.items.itemAt(0));this.colMenu.add(new Ext.
menu.Separator());this.colMenu.add(e)},groupTextTpl:"{text} (Anzahl: {[values.rs.length]})"})}});Ext.namespace("Ext.ux",
"Ext.ux.pimf","Ext.ux.pimf.items");Ext.ux.pimf.items.NewWindow=Ext.extend(Ext.ux.pimf.items.AbstractWindow,{constructor:
function(a){Ext.ux.pimf.items.NewWindow.superclass.constructor.call(this,"Neuer Gegenstand");this.parentFolderId=a.data.
id;this.addListener("show",function(b){this.items.item(0).items.item(0).getForm().setValues({id:"(neu)",image:0});this.
tree.set([this.parentFolderId])});Ext.ux.pimf.StoreObserver.create({storeId:"ItemStore",scope:this,events:["remotenew"],
listeners:{remotenew:function(){this.close()}}})},save:function(){var b=this.items.item(0).items.item(0).getForm().
getFieldValues(),c=this.items.item(0).items.item(0).getForm().getValues(),a={id:0,name:b.name,image:parseInt(c.image),
description:b.description};Ext.apply(a,this.tree.get());Ext.apply(a,this.grid.get());Ext.StoreMgr.get("ItemStore").
remoteNew(a)}});Ext.namespace("Ext.ux","Ext.ux.pimf","Ext.ux.pimf.items");Ext.ux.pimf.items.PreviewWindow=Ext.extend(Ext
.Window,{constructor:function(){Ext.ux.pimf.items.PreviewWindow.superclass.constructor.call(this,{title:
"Druckvorschau - Optionen",modal:true,resizable:false,width:300,autoHeight:true,buttons:[new Ext.Button({text:
"Abbrechen",icon:"images/led-icons/cancel.png",handler:function(a,b){this.ownerCt.ownerCt.close()}}),new Ext.Button({
text:"Druckvorschau",icon:"images/led-icons/printer.png",handler:function(a,b){this.ownerCt.ownerCt.items.item(0).
preparedSubmit();this.ownerCt.ownerCt.close()}})],layout:"fit",items:[new Ext.form.FormPanel({standardSubmit:true,
autoHeight:true,defaults:{anchor:"100%"},border:false,padding:"10px 10px 6px 10px",items:[new Ext.form.CheckboxGroup({
hideLabel:true,columns:1,items:[new Ext.form.Checkbox({boxLabel:
'<span title="Auch jeder Unterordner werden rekursiv durchsucht. Die Darstellung erfolgt hierarchisch als Baum.">Rekursives Auflisten</span>'
,submitValue:false}),new Ext.form.Checkbox({boxLabel:
'<span title="Auch f\xFCr jeden Unterordner wird ein Bericht erzeugt. Auf diese Weise lassen sich ganze Berichts\xE4tze (z.B. f\xFCr einen Raum) erstellen.">Rekursive Berichterstellung</span>'
,submitValue:false})]}),new Ext.form.Hidden({name:"data"}),new Ext.form.Hidden({name:"login"})],preparedSubmit:function(
){var a=Ext.decode(Ext.StoreMgr.get("ItemStore").lastOptions.params.data);Ext.apply(a,{recursiveTree:this.items.item(0).
items.item(0).checked,recursiveReports:this.items.item(0).items.item(1).checked});this.getForm().setValues({data:Ext.
util.JSON.encode(a),login:Ext.util.JSON.encode(Ext.ux.pimf.Connection.userData)});this.getForm().getEl().dom.target=
"_blank";this.getForm().getEl().dom.action=Ext.SOFTWARE_URL+"server/items/getAsReport.php";this.getForm().submit()}})]})
}});Ext.namespace("Ext.ux","Ext.ux.pimf","Ext.ux.pimf.items");Ext.ux.pimf.items.PropertyView=Ext.extend(Ext.Panel,{
constructor:function(){Ext.ux.pimf.items.PropertyView.superclass.constructor.call(this,{id:"ItemPropertyView",border:
false,layout:"vbox",layoutConfig:{align:"stretch"},border:false,padding:"10px 10px 0 10px",items:[new Ext.form.FormPanel
({border:false,items:[new Ext.form.DisplayField({name:"type",hideLabel:true,cls:"x-propertyview x-propertyview-item",
value:"Gegenstand"}),new Ext.form.DisplayField({name:"id",fieldLabel:"ID"}),new Ext.form.DisplayField({name:"name",
fieldLabel:"Name"}),new Ext.form.DisplayField({name:"image",fieldLabel:"Bild"})]}),new Ext.Panel({border:false,flex:1,
layout:"vbox",layoutConfig:{align:"stretch"},items:[new Ext.Panel({border:false,html:
'<div class="x-form-item x-form-display-field">Gelinkt&nbsp;in:</div>'}),new Ext.grid.GridPanel({flex:1,cls:"greyborder"
,colModel:new Ext.grid.ColumnModel({columns:[{header:"",dataIndex:"id",width:30,fixed:true,renderer:function(a,c,d,e,b,f
){return'<img src="images/'+Ext.StoreMgr.get("FolderStore").getById(a).getTypeImageFile()+'" />'}},{header:"Name",
dataIndex:"id",renderer:function(a,c,d,e,b,f){return'<a href="#" title="'+Ext.StoreMgr.get("FolderStore").getById(a).
getPath()+"\" onclick=\"Ext.getCmp('NavigationTree').getNodeById('"+a.toString()+
"').approvedSelect(); return false; \">"+Ext.StoreMgr.get("FolderStore").getById(a).data.name+"</a>"}}]}),columnLines:
true,disableSelection:true,enableColumnMove:false,setRecord:function(d){var c=this.getStore();c.removeAll();var b=d.data
.itemFolderLinks;for(var a=0;a<b.length;a++)c.addSorted(new c.recordType({id:b[a]},b[a]))},store:new Ext.data.ArrayStore
({fields:["id"],idIndex:0}),trackMouseOver:false,view:new Ext.grid.GridView({forceFit:true,headersDisabled:true})}),new 
Ext.Panel({border:false,html:
'<div style="padding-top: 7px !important; " class="x-form-item x-form-display-field">Freie&nbsp;Eigenschaften:</div>'}),
new Ext.grid.GridPanel({flex:1,cls:"greyborder",colModel:new Ext.grid.ColumnModel({columns:[{header:"",dataIndex:"",
width:30,fixed:true,renderer:function(f,b,c,d,a,e){return'<img src="images/led-icons/tag_blue.png" />'}},{header:"Name",
dataIndex:"id",renderer:function(a,c,d,e,b,f){return Ext.StoreMgr.get("FreePropertyStore").getById(a).data.name}},{
header:"Wert",dataIndex:"value",renderer:function(a,f,d,g,e,h){var c=Ext.StoreMgr.get("FreePropertyStore").getById(d.
data.id),b=c.data.format;if(b==="string")return a;else if(b==="bool"){if(a==="true")return"Ja";else if(a==="false")
return"Nein";else return"";return a}else if(b==="int")return typeof a!=="number"?"":parseInt(a).toString();else if(b===
"float")return typeof a!=="number"?"":parseFloat(a).toExponential();else if(b==="date")return typeof a!=="object"?"":a.
format("d.m.Y")}}]}),columnLines:true,disableSelection:true,enableColumnMove:false,setRecord:function(d){var e=this.
getStore();e.removeAll();for(var c in d.data)if(c.substr(0,17)==="freePropertyValue"&&d.data[c]!==undefined){var b=Ext.
StoreMgr.get("FreePropertyStore").getById(Number(c.substr(17))),a=d.data[c];if(b.data.format==="string"){}else if(b.data
.format==="bool")if(a===true)a="true";else if(a===false)a="false";else a="";else if(b.data.format==="int")if(typeof a===
"number"){}else a="";else if(b.data.format==="float")if(typeof a==="number"){}else a="";else if(b.data.format==="date")
if(typeof a==="object"){}else a="";else a="";e.addSorted(new e.recordType({id:b.data.id,value:a},b.data.id))}},store:new
 Ext.data.ArrayStore({fields:["id","value"],idIndex:0}),trackMouseOver:false,view:new Ext.grid.GridView({forceFit:true,
headersDisabled:true})}),new Ext.Panel({border:false,html:
'<div style="padding-top: 7px !important; " class="x-form-item x-form-display-field">Beschreibung:</div>'}),new Ext.
Panel({cls:"greyborder x-form-item",style:"padding-bottom: 10px; ",autoScroll:true,flex:1,html:
'<div style="padding: 5px; "></div>'})]})]});Ext.ux.pimf.StoreObserver.create({storeId:"ItemStore",scope:this,events:[
"load","update"],listeners:{load:function(c,a,b){if(this.itemId===undefined||this.itemId===null)return;this.reload()},
update:function(c,a,b){if(a.data.id===this.itemId&&b===Ext.data.Record.COMMIT)this.reload()}}});Ext.ux.pimf.
StoreObserver.create({storeId:"FolderStore",scope:this,events:["update"],listeners:{update:function(c,b,a){if(a===Ext.
data.Record.COMMIT)this.reload()}}})},activate:function(){this.ownerCt.layout.setActiveItem(this.id)},load:function(a){
this.itemId=a;this.reload()},reload:function(){if(this.itemId===undefined||this.itemId===null)return;var a=Ext.StoreMgr.
get("ItemStore").getById("item"+this.itemId.toString());if(a===undefined)return;this.items.item(0).getForm().setValues({
id:a.data.id.toString().replace(/ /g,"&nbsp;"),name:a.data.name.replace(/ /g,"&nbsp;"),image:Ext.StoreMgr.get(
"ImageStore").getTag(a.data.image)});this.items.item(1).items.item(1).setRecord(a);this.items.item(1).items.item(3).
setRecord(a);this.items.item(1).items.item(5).getEl().first().first().first().update(a.data.description.replace(/\n/g,
"<br />"))}});Ext.namespace("Ext.ux","Ext.ux.pimf","Ext.ux.pimf.items");Ext.ux.pimf.items.RemoveDialog=function(c){this.
itemIds=c.extractProperty("data").extractProperty("id");this.show=function(a){Ext.MessageBox.show({title:
"L\xF6sche Gegenstand",msg:"Sind Sie sich sicher, dass Sie diese(n) Gegenst\xE4nde/Gegenstand l\xF6schen wollen?",
buttons:Ext.MessageBox.YESNO,icon:Ext.MessageBox.QUESTION,animEl:a,scope:this,fn:function(d){if(d==="yes")Ext.StoreMgr.
get("ItemStore").remoteRemove(this.itemIds)}})}};Ext.namespace("Ext.ux","Ext.ux.pimf","Ext.ux.pimf.items");Ext.ux.pimf.
items.Store=Ext.extend(Ext.data.GroupingStore,{constructor:function(){Ext.ux.pimf.items.Store.superclass.constructor.
call(this,{storeId:"ItemStore",reader:new Ext.data.JsonReader(),autoSave:false});this.addEvents("remoteload","remotenew"
,"remoteclone","remoteedit","remotelink","remoteunlink","remoteremove");Ext.ux.pimf.StoreObserver.create({storeId:
"FolderStore",scope:this,events:["remotenew","remoteedit","remotemove","remoteremove"],listeners:{remotenew:function(c){
var a=c.data;if(Ext.getCmp("NavigationTree").getSelectedNodeId()===a.parentFolderId.toString()){var b=new this.
recordType(a,"folder"+a.id.toString());b.set("uid","folder"+a.id.toString());this.addSorted(b)}this.commitChanges()},
remoteedit:function(d){var a=d.data,b=this.getById("folder"+a.id.toString());if(b!==undefined){for(var c in a)b.set(c,a[
c]);b.set("uid","folder"+a.id.toString());this.sort(this.getSortState().field,this.getSortState().direction)}this.
commitChanges()},remotemove:function(c,d){for(var a=0;a<c.length;a++){var b=this.getById("folder"+c[a].data.id.toString(
));if(b!==undefined)if(Ext.getCmp("NavigationTree").getSelectedNodeId()===d.data.id.toString()||Ext.getCmp(
"NavigationTree").isSelectedNodeSpecial())b.set("parentFolderId",d.data.id);else this.remove(b);else if(Ext.getCmp(
"NavigationTree").getSelectedNodeId()===d.data.id.toString()){b=new this.recordType(c[a].data,"folder"+c[a].data.id.
toString());b.set("uid","folder"+c[a].data.id.toString());this.addSorted(b)}}this.commitChanges()},remoteremove:function
(d){for(var b=0;b<d.length;b++){this.remove(this.getById("folder"+d[b].data.id.toString()));var c=this.getRange();for(
var a=0;a<c.length;a++)if(c[a].data.type==="item")c[a].set("itemFolderLinks",c[a].data.itemFolderLinks.concat([]).remove
(d[b].data.id))}this.commitChanges()}}});Ext.ux.pimf.StoreObserver.create({storeId:"FreePropertyStore",scope:this,events
:["add","remove","update"],listeners:{add:function(c,b,a){this.remoteReload()},remove:function(c,b,a){this.remoteReload(
)},update:function(c,b,a){this.remoteReload()}}})},checkItemsLink:function(b,c){if(!Ext.ux.pimf.Connection.locked)
return false;for(var a=0;a<b.length;a++)if(b[a].data.type!=="item")return false;return true},
getFolderRecordsOfItemRecords:function(c){var b=[];for(var a=0;a<c.length;a++)b.push(c[a].getFolderRecord());return b},
remoteLoad:function(l){Ext.ux.pimf.Connection.request({action:["items","get"],data:l,scope:this,customSuccess:function(h
,g){var e=new Ext.grid.ColumnModel([{header:"",dataIndex:"",fixed:true,menuDisabled:true,width:30},{header:"Name",
dataIndex:"",fixed:true,menuDisabled:true,width:250}]);this.clearGrouping();Ext.getCmp("ItemGrid").reconfigure(this,e);
this.lastOptions=g;this.loadData(Ext.util.JSON.decode(h.responseText));this.reader.recordType.prototype.getFolderRecord=
function(){return Ext.StoreMgr.get("FolderStore").getById(this.data.id)};this.reader.recordType.prototype.getTypeLabel=
function(){return this.store.typeLabels[this.data.type]};this.reader.recordType.prototype.getTypeImageFile=function(){
return this.store.typeImageFiles[this.data.type]};this.reader.recordType.prototype.getTypePluralLabel=function(){
return this.store.typePluralLabels[this.data.type]};var f=[{header:"",dataIndex:"",fixed:true,hidden:false,menuDisabled:
true,width:30,renderer:function(q,n,d,o,m,p){return'<img src="'+d.getTypeImageFile()+'" />'}},{header:"Bild",dataIndex:
"image",width:95,submenu:"main",renderer:function(d,n,o,p,m,q){return Ext.StoreMgr.get("ImageStore").getTag(d)}},{header
:"ID",dataIndex:"id",width:50,submenu:"main"},{header:"Name",dataIndex:"name",width:400,hidden:false,submenu:"main"},{
header:"Typ",dataIndex:"type",width:100,submenu:"main",renderer:function(q,n,d,o,m,p){return d.getTypeLabel()}},{header:
"Anleitung URL",dataIndex:"manualURL",width:200,submenu:"folderProperties"},{header:"Homepage URL",dataIndex:
"homepageURL",width:200,submenu:"folderProperties"}],a=this.reader.meta.freeProperties;Ext.StoreMgr.get(
"FreePropertyStore").loadData({success:true,total:a.length,records:a});for(var c=0;c<a.length;c++){var b={header:a[c].
name,dataIndex:"freePropertyValue"+a[c].id.toString(),width:Number(a[c].columnWidth),submenu:"freeProperties"};switch(a[
c].format){case"string":b.renderer=function(d,n,o,p,m,q){return d===undefined?"":d};break;case"bool":b.renderer=function
(d,n,o,p,m,q){return d===undefined||d===null?"":d?"Ja":"Nein"};break;case"int":b.renderer=function(d,n,o,p,m,q){return d
===undefined||d===null?"":d.toString()};break;case"float":b.renderer=function(d,n,o,p,m,q){return d===undefined||d===
null?"":d.toExponential()};break;case"date":b.renderer=function(d,n,o,p,m,q){return d===undefined||d===null?"":d.format(
"d.m.Y")};break}f.push(b)}e=new Ext.grid.ColumnModel({defaults:{editable:false,sortable:true,hidden:true},columns:f});
Ext.getCmp("ItemGrid").reconfigure(this,e);this.fireEvent("remoteload",this.getRange())}})},remoteReload:function(){if(
this.lastOptions!==null)this.remoteLoad(Ext.decode(this.lastOptions.params.data))},remoteNew:function(c){Ext.ux.pimf.
Connection.request({action:["items","create"],data:c,scope:this,customSuccess:function(e,d){var b=Ext.apply(d.data,{id:
Ext.util.JSON.decode(e.responseText).id}),a;if(b.itemFolderLinks.indexOf(Number(Ext.getCmp("NavigationTree").
getSelectedNodeId()))>-1){a=new this.reader.recordType(b,"item"+b.id.toString());a.set("uid","item"+b.id.toString());a.
set("type","item");this.addSorted(a)}this.resetRuleViolation();this.commitChanges();this.fireEvent("remotenew",a)}})},
remoteClone:function(l,i){Ext.ux.pimf.Connection.request({action:["items","clone"],data:{ids:l,count:i},scope:this,
customSuccess:function(k,j){var g=j.data.ids,e,h=[],d=Ext.util.JSON.decode(k.responseText).ids,c,f=[];for(var a=0;a<g.
length;a++){e=this.getById("item"+g[a].toString());f.push([]);if(e.data.itemFolderLinks.indexOf(Number(Ext.getCmp(
"NavigationTree").getSelectedNodeId()))>-1)for(var b=0;b<d[a].length;b++){c=e.copy("item"+d[a][b].toString());c.set("id"
,d[a][b]);c.set("uid","item"+d[a][b].toString());this.addSorted(c);f[a].push(c)}h.push(e)}this.resetRuleViolation();this
.commitChanges();this.fireEvent("remoteclone",h,f)}})},remoteEdit:function(f){Ext.ux.pimf.Connection.request({action:[
"items","update"],data:f,scope:this,customSuccess:function(h,g){var a=g.data,b=this.getById("item"+a.id.toString());if(a
.itemFolderLinks.indexOf(Number(Ext.getCmp("NavigationTree").getSelectedNodeId()))===-1&&!Ext.getCmp("NavigationTree").
isSelectedNodeSpecial())this.remove(b);else{var d=Ext.StoreMgr.get("FreePropertyStore").getRange();for(var c=0;c<d.
length;c++)b.set("freePropertyValue"+d[c].data.id.toString(),undefined);for(var e in a)b.set(e,a[e])}this.
resetRuleViolation();this.commitChanges();this.sort(this.getSortState().field,this.getSortState().direction);this.
fireEvent("remoteedit",b)}})},remoteLink:function(g,i){Ext.ux.pimf.Connection.request({action:["items","link"],data:{ids
:g,newLinkFolderId:i},scope:this,customSuccess:function(j,f){var d=f.data.ids,a,e=[],c=f.data.newLinkFolderId,h=Ext.
StoreMgr.get("FolderStore").getById(c);for(var b=0;b<d.length;b++){a=this.getById("item"+d[b].toString());if(a.data.
itemFolderLinks.indexOf(c)===-1)a.set("itemFolderLinks",a.data.itemFolderLinks.concat(c));e.push(a)}this.
resetRuleViolation();this.commitChanges();this.fireEvent("remotelink",e,h)}})},remoteUnlink:function(g,i){Ext.ux.pimf.
Connection.request({action:["items","unlink"],data:{ids:g,oldLinkFolderId:i},scope:this,customSuccess:function(j,f){var 
d=f.data.ids,a,e=[],c=f.data.oldLinkFolderId,h=Ext.StoreMgr.get("FolderStore").getById(c);for(var b=0;b<d.length;b++){a=
this.getById("item"+d[b].toString());if(Ext.getCmp("NavigationTree").getSelectedNodeId()===c.toString())this.remove(a);
else a.set("itemFolderLinks",a.data.itemFolderLinks.concat([]).remove(c));e.push(a)}this.resetRuleViolation();this.
commitChanges();this.fireEvent("remoteunlink",e,h)}})},remoteRemove:function(e){Ext.ux.pimf.Connection.request({action:[
"items","delete"],data:{ids:e},scope:this,customSuccess:function(g,f){var c=f.data.ids,b,d=[];for(var a=0;a<c.length;a++
){b=this.getById("item"+c[a].toString());this.remove(b);d.push(b)}this.resetRuleViolation();this.commitChanges();this.
fireEvent("remoteremove",d)}})},resetRuleViolation:function(){var b=this.getRange();for(var a=0;a<b.length;a++)if(b[a].
data.type==="item")b[a].set("ruleViolation",null)},typeLabels:{item:"Gegenstand",category:"Ordner (Kategorie)",
experiment:"Ordner (Versuch)",location:"Ordner (Ort)",vendor:"Ordner (Bezugsquelle)"},typeImageFiles:{item:
"images/led-icons/brick.png",category:"images/led-icons/book.png",experiment:"images/experiment.png",location:
"images/led-icons/direction.png",vendor:"images/led-icons/delivery.png"},typePluralLabels:{item:"Gegenst\xE4nde",
category:"Ordner (Kategorien)",experiment:"Ordner (Versuche)",location:"Ordner (Orte)",vendor:"Ordner (Bezugsquellen)"}}
);Ext.namespace("Ext.ux","Ext.ux.pimf","Ext.ux.pimf.misc");Ext.ux.pimf.misc.BlankGrid=Ext.extend(Ext.Panel,{constructor:
function(){Ext.ux.pimf.misc.BlankGrid.superclass.constructor.call(this,{id:"BlankGrid",border:false,html:
'<div class="x-grid-empty">Bitte w\xE4hlen Sie links im Navigationsbaum einen Ordner aus oder verwenden Sie die Suche!</div>'
})},activate:function(){this.ownerCt.layout.setActiveItem(this.id)}});Ext.namespace("Ext.ux","Ext.ux.pimf",
"Ext.ux.pimf.misc");Ext.ux.pimf.misc.BlankPropertyView=Ext.extend(Ext.Panel,{constructor:function(){Ext.ux.pimf.misc.
BlankPropertyView.superclass.constructor.call(this,{id:"BlankPropertyView",border:false,html:
'<div class="x-grid-empty">Bitte w\xE4hlen Sie links im Browser ein Objekt aus, um sich hier dessen Eigenschaften anzeigen zu lassen!</div>'
})},activate:function(){this.ownerCt.layout.setActiveItem(this.id)}});Ext.namespace("Ext.ux","Ext.ux.pimf",
"Ext.ux.pimf.misc");Ext.ux.pimf.misc.LockButton=Ext.extend(Ext.Button,{constructor:function(){Ext.ux.pimf.misc.
LockButton.superclass.constructor.call(this,{text:"Schreibrechte erlangen",icon:"images/led-icons/lock.png",style:
"margin: 5px 5px 0 0; float: right; ",hidden:true,handler:function(a,b){if(Ext.ux.pimf.Connection.locked)Ext.ux.pimf.
Connection.unlock();else Ext.ux.pimf.Connection.lock(false)}});this.relayEvents(Ext.ux.pimf.Connection,["login","lock",
"unlock"]);this.addListener("login",function(){this.setVisible(Ext.ux.pimf.Connection.getUserRole()>=1)});this.
addListener("lock",function(){this.setText("Schreibrechte abgeben");this.setIcon("images/led-icons/lock_unlock.png")});
this.addListener("unlock",function(){this.setText("Schreibrechte erlangen");this.setIcon("images/led-icons/lock.png")})}
});Ext.namespace("Ext.ux","Ext.ux.pimf","Ext.ux.pimf.misc");Ext.ux.pimf.misc.LoginWindow=Ext.extend(Ext.Window,{
constructor:function(){Ext.ux.pimf.misc.LoginWindow.superclass.constructor.call(this,{title:"Login",modal:true,resizable
:false,closable:false,width:300,autoHeight:true,buttons:[new Ext.Button({text:"Login",icon:"images/led-icons/key.png",
handler:function(b,c){var a=this.ownerCt.ownerCt.items.item(0).getForm().getValues();a.password=Ext.ux.crypto.SHA1.hash(
a.password);a.role=0;Ext.ux.pimf.Connection.login(a)}})],layout:"auto",items:[new Ext.form.FormPanel({defaults:{anchor:
"100%"},border:false,padding:"10px 10px 6px 10px",items:[new Ext.form.TextField({name:"username",fieldLabel:
"Benutzername",ref:"../defaultButton",listeners:{specialkey:function(b,a){if(a.getKey()===a.ENTER)this.ownerCt.ownerCt.
buttons[0].handler(this.ownerCt.ownerCt.buttons[0],{})}}}),new Ext.form.TextField({name:"password",fieldLabel:"Passwort"
,inputType:"password",listeners:{specialkey:function(b,a){if(a.getKey()===a.ENTER)this.ownerCt.ownerCt.buttons[0].
handler(this.ownerCt.ownerCt.buttons[0],{})}}})]})]});this.relayEvents(Ext.ux.pimf.Connection,["login"]);this.
addListener("login",function(){this.close()})}});Ext.namespace("Ext.ux","Ext.ux.pimf","Ext.ux.pimf.misc");Ext.ux.pimf.
misc.LogoutButton=Ext.extend(Ext.Button,{constructor:function(){Ext.ux.pimf.misc.LogoutButton.superclass.constructor.
call(this,{text:"Logout",icon:"images/led-icons/door_in.png",style:"margin: 5px 5px 0 0; float: right; ",handler:
function(a,b){this.logoutRequested=true;if(Ext.ux.pimf.Connection.locked)Ext.ux.pimf.Connection.unlock();else this.
fireEvent("unlockFailure")}});this.logoutRequested=false;this.relayEvents(Ext.ux.pimf.Connection,["unlock",
"unlockFailure"]);this.addListener("unlock",function(){if(this.logoutRequested)Ext.ux.pimf.Connection.logout()});this.
addListener("unlockFailure",function(){if(this.logoutRequested)Ext.ux.pimf.Connection.logout()})}});Ext.namespace(
"Ext.ux","Ext.ux.pimf","Ext.ux.pimf.misc");Ext.ux.pimf.misc.MultiPropertyView=Ext.extend(Ext.Panel,{constructor:function
(){Ext.ux.pimf.misc.MultiPropertyView.superclass.constructor.call(this,{id:"MultiPropertyView",border:false})},activate:
function(a){this.el.dom.innerHTML='<div class="x-grid-empty">Sie haben '+a+
" Objekte ausgew\xE4hlt.<br /><br />Um spezifische Eigenschaften angezeigt zu bekommen, selektieren Sie bitte nur ein Objekt!</div>"
;this.ownerCt.layout.setActiveItem(this.id)}});Ext.override(Array,{extractProperty:function(c){var b=[];for(var a=0;a<
this.length;a++)b.push(this[a][c]);return b},includeIndex:function(){var b=[];for(var a=0;a<this.length;a++)b.push([a,
this[a]]);return b}});Ext.override(Ext.data.Record,{set:function(a,b){if(this.data[a]===b)return;this.dirty=true;if(!
this.modified)this.modified={};if(this.modified[a]===undefined)this.modified[a]=this.data[a];this.data[a]=b;if(!this.
editing)this.afterEdit()}});Ext.data.Types.AUTO={convert:function(a){if(a===undefined||a===null)return undefined;
return a},sortType:Ext.data.SortTypes.none,type:"auto"};Ext.data.Types.STRING={convert:function(a){if(a===undefined||a
===null)return undefined;return String(a)},sortType:Ext.data.SortTypes.asUCString,type:"string"};Ext.data.Types.INT={
convert:function(a){if(a===undefined||a===null)return undefined;if(a==="")return null;return parseInt(String(a).replace(
Ext.data.Types.stripRe,""),10)},sortType:Ext.data.SortTypes.none,type:"int"};Ext.data.Types.FLOAT={convert:function(a){
if(a===undefined||a===null)return undefined;if(a==="")return null;return parseFloat(String(a).replace(Ext.data.Types.
stripRe,""),10)},sortType:Ext.data.SortTypes.none,type:"float"};Ext.data.Types.BOOL={convert:function(a){if(a===
undefined||a===null)return undefined;if(a==="")return null;return a===true||a==="1"},sortType:Ext.data.SortTypes.none,
type:"bool"};Ext.data.Types.DATE={convert:function(a){if(a===undefined||a===null)return undefined;if(a==="")return null;
return Date.parseDate(a,"Y/m/d")},sortType:Ext.data.SortTypes.asDate,type:"date"};Ext.MessageBox.getDialog().buttons.
reverse();Ext.override(Ext.tree.TreeDragZone,{beforeInvalidDrop:function(a,b){},afterRepair:function(){this.dragging=
false},onInitDrag:function(b){var a=this.dragData;this.tree.getSelectionModel().select(a.node);this.proxy.update("");a.
node.ui.appendDDGhost(this.proxy.ghost.dom);this.tree.fireEvent("startdrag",this.tree,a.node,b)}});Ext.override(Ext.tree
.TreeNode,{approvedSelect:function(){this.getOwnerTree().getSelectionModel().approvedSelect(this)}});Ext.namespace(
"Ext.ux","Ext.ux.pimf","Ext.ux.pimf.search");Ext.ux.pimf.search.Field=Ext.extend(Ext.form.TwinTriggerField,{constructor:
function(){Ext.ux.pimf.search.Field.superclass.constructor.call(this,{id:"SearchField",emptyText:"...",emptyClass:
"u-form-trigger-empty",extendedMode:false,hideTrigger1:true,listeners:{specialkey:function(b,a){if(a.getKey()===a.ENTER)
{this.triggers[0].show();this.fireEvent("search",this.getRawValue())}}},onTrigger1Click:function(a){if(this.extendedMode
)this.toggleExtendedMode();this.triggers[0].hide();this.setValue("");this.fireEvent("endsearch")},onTrigger2Click:
function(a){this.toggleExtendedMode()},toggleExtendedMode:function(){this.triggers[1].dom.className=
"x-form-trigger u-form-trigger-"+(this.extendedMode?"up":"down");Ext.getCmp("SearchGrid").toggleCollapse(false);this.
extendedMode=!this.extendedMode},trigger1Class:"u-form-trigger-clear",trigger2Class:"u-form-trigger-up",flex:1});this.
addEvents("search","endsearch")}});Ext.namespace("Ext.ux","Ext.ux.pimf","Ext.ux.pimf.search");Ext.ux.pimf.search.Grid=
Ext.extend(Ext.grid.EditorGridPanel,{constructor:function(){Ext.ux.pimf.search.Grid.superclass.constructor.call(this,{id
:"SearchGrid",region:"south",height:150,border:false,collapsed:true,buttonAlign:"left",bbar:new Ext.Toolbar({style:
"background-image: none; ",items:[new Ext.form.ComboBox({editable:false,mode:"local",triggerAction:"all",store:new Ext.
data.ArrayStore({data:[["AND","UND-Verkn\xFCpfung"],["OR","ODER-Verkn\xFCpfung"]],fields:["id","label"],idIndex:0}),
valueField:"id",displayField:"label",value:"AND"}),new Ext.Toolbar.Fill(),new Ext.Button({text:"Kriterium hinzuf\xFCgen"
,icon:"images/led-icons/add.png",handler:function(b,c){var a=b.ownerCt.ownerCt.getStore();a.add(new a.recordType({
subject:"",comparator:"",value:""}))}}),new Ext.Button({text:"Erweiterte Suche starten",icon:"images/led-icons/find.png"
,handler:function(a,b){a.ownerCt.ownerCt.fireEvent("extendedsearch",a.ownerCt.ownerCt)}})]}),hideHeaders:true,border:
false,clicksToEdit:1,listeners:{beforeedit:function(c){if(c.column===1){var b=Ext.StoreMgr.get("SubjectStore").getById(c
.record.data.subject),a=c.grid.getColumnModel().getColumnById(1);if(b===undefined)a.setEditor(undefined);else{var f=[];
for(var e=0;e<b.data.comparators.length;e++)f.push([b.data.comparators[e],Ext.StoreMgr.get("SubjectStore").
getComparatorLabel(b.data.comparators[e])]);a.setEditor(new Ext.form.ComboBox({mode:"local",lazyRender:true,lazyInit:
false,forceSelection:true,triggerAction:"all",store:new Ext.data.ArrayStore({idIndex:0,fields:["id","name"],data:f}),
valueField:"id",displayField:"name"}))}}else if(c.column===2){var b=Ext.StoreMgr.get("SubjectStore").getById(c.record.
data.subject),a=c.grid.getColumnModel().getColumnById(2);if(b===undefined)a.setEditor(undefined);else{var d=b.data.
format;if(d==="string")a.setEditor(new Ext.form.TextField());else if(d==="bool")a.setEditor(new Ext.form.ComboBox({
editable:false,mode:"local",triggerAction:"all",store:[["","Kein Wert"],["true","Ja"],["false","Nein"]],value:0}));else 
if(d==="int")a.setEditor(new Ext.form.NumberField({allowDecimals:false,maxValue:0xE8D4A51000}));else if(d==="float")a.
setEditor(new Ext.form.NumberField({baseChars:"+0123456789eE",decimalPrecision:16}));else if(d==="date")a.setEditor(new 
Ext.form.DateField());else a.setEditor(undefined)}}},afteredit:function(a){if(a.column===0){a.record.set("comparator",""
);a.record.set("value","")}},cellclick:function(a,c,b,d){if(b===3)a.getStore().remove(a.getStore().getAt(c))}},colModel:
new Ext.grid.ColumnModel({defaults:{editable:true},columns:[{dataIndex:"subject",renderer:function(b,d,e,f,c,g){if(b===
"")return"";var a=Ext.StoreMgr.get("SubjectStore").getById(b);if(a===undefined)return"Unbekanntes Subjekt";else return a
.data.name},editor:new Ext.form.ComboBox({mode:"local",lazyRender:true,lazyInit:false,forceSelection:true,triggerAction:
"all",store:Ext.StoreMgr.get("SubjectStore"),valueField:"id",displayField:"name"})},{dataIndex:"comparator",renderer:
function(a,c,d,e,b,f){return Ext.StoreMgr.get("SubjectStore").getComparatorLabel(a)},editor:undefined},{dataIndex:
"value",renderer:function(a,f,d,g,e,h){if(a==="")return"";var c=Ext.StoreMgr.get("SubjectStore").getById(d.data.subject)
;if(c===undefined)return"";else{var b=c.data.format;if(b==="string")return a;else if(b==="bool"){if(a==="true")
return"Ja";else if(a==="false")return"Nein";else return"";return a}else if(b==="int")return typeof a!=="number"?"":
parseInt(a).toString();else if(b==="float")return typeof a!=="number"?"":parseFloat(a).toExponential();else if(b===
"date")return typeof a!=="object"?"":a.format("d.m.Y")}},editor:undefined},{fixed:true,width:30,dataIndex:"",editable:
false,renderer:function(f,b,c,d,a,e){return'<img src="images/led-icons/cross.png" />'}}]}),columnLines:true,selModel:new
 Ext.grid.RowSelectionModel(),stripeRows:true,store:new Ext.data.ArrayStore({idIndex:0,fields:["subject","comparator",
"value"]}),view:new Ext.grid.GridView({forceFit:true,emptyText:"Es sind keine Suchkriterien definiert!",deferEmptyText:
false}),bodyStyle:"border-width: 1px 0 0 0;"});this.addEvents("extendedsearch")}});Ext.namespace("Ext.ux","Ext.ux.pimf",
"Ext.ux.pimf.search");Ext.ux.pimf.search.Store=Ext.extend(Ext.data.JsonStore,{constructor:function(){Ext.ux.pimf.search.
Store.superclass.constructor.call(this,{storeId:"SubjectStore",autoSave:false,fields:[{name:"id",type:"string"},{name:
"name",type:"string"},{name:"format",type:"string"},{name:"comparators",type:"auto"}],root:"records",sortInfo:{field:
"name",direction:"ASC"},getComparatorLabel:function(a){switch(a){case"is":return"ist";case"has":return"enth\xE4lt";case
"is not empty":return"besteht";default:return""}}});Ext.ux.pimf.StoreObserver.create({storeId:"FreePropertyStore",scope:
this,events:["load","add","remove","update"],listeners:{load:function(e,c,d){this.removeAll();var a;a=new this.reader.
recordType({id:"any",name:"Volltext",format:"string",comparators:["has"]},"any");this.add([a]);a=new this.reader.
recordType({id:"id",name:"ID",format:"int",comparators:["is"]},"id");this.add([a]);a=new this.reader.recordType({id:
"name",name:"Name",format:"string",comparators:["is","has"]},"name");this.add([a]);a=new this.reader.recordType({id:
"description",name:"Beschreibung",format:"string",comparators:["is","has"]},"description");this.add([a]);a=new this.
reader.recordType({id:"parentFolderId",name:"Oberordner ID",format:"int",comparators:["is"]},"parentFolderId");this.add(
[a]);a=new this.reader.recordType({id:"path",name:"Pfad",format:"string",comparators:["has"]},"path");this.add([a]);a=
new this.reader.recordType({id:"type",name:"Typ",format:"string",comparators:["is"]},"type");this.add([a]);a=new this.
reader.recordType({id:"ruleViolation",name:"Regelverletzung",format:"",comparators:["is not empty"]},"ruleViolation");
this.add([a]);for(var b=0;b<c.length;b++){a=new this.reader.recordType({id:"freePropertyValue"+String(c[b].data.id),name
:c[b].data.name,format:c[b].data.format,comparators:["is","has"]},"freePropertyValue"+String(c[b].data.id));this.add([a]
)}},add:function(e,b,d){var c;for(var a=0;a<b.length;a++){c=new this.reader.recordType({id:"freePropertyValue"+String(b[
a].data.id),name:b[a].data.name,format:b[a].data.format,comparators:["is","has"]},"freePropertyValue"+String(b[a].data.
id));this.add([c])}},remove:function(e,b,d){var c;for(var a=0;a<b.length;a++){c=this.getById("freePropertyValue"+String(
b[a].data.id));this.remove([c])}this.commitChanges()},update:function(d,a,c){var b=this.getById("freePropertyValue"+
String(a.data.id));b.set("name",a.data.name);b.set("format",a.data.format);this.commitChanges()}}})}});Ext.namespace(
"Ext.ux","Ext.ux.pimf","Ext.ux.pimf.users");Ext.ux.pimf.users.AbstractWindow=Ext.extend(Ext.Window,{constructor:function
(b){Ext.ux.pimf.users.AbstractWindow.superclass.constructor.call(this,{title:b,modal:true,resizable:false,width:400,
autoHeight:true,buttons:[new Ext.Button({text:"Abbrechen",icon:"images/led-icons/cancel.png",handler:function(a,c){this.
ownerCt.ownerCt.close()}}),new Ext.Button({text:"Speichern",icon:"images/led-icons/disk.png",handler:function(a,c){this.
ownerCt.ownerCt.save()}})],layout:"fit",items:[new Ext.form.FormPanel({autoHeight:true,defaults:{anchor:"100%"},border:
false,padding:"10px 10px 6px 10px",items:[new Ext.form.DisplayField({name:"id",fieldLabel:"ID"}),new Ext.form.TextField(
{name:"username",fieldLabel:"Benutzername",ref:"../defaultButton",listeners:{specialkey:function(c,a){if(a.getKey()===a.
ENTER)this.ownerCt.ownerCt.buttons[1].handler(this.ownerCt.ownerCt.buttons[1],{})}}}),new Ext.form.ComboBox({fieldLabel:
"Rolle",editable:false,mode:"local",hiddenName:"role",triggerAction:"all",store:new Ext.data.ArrayStore({data:Ext.
StoreMgr.get("UserStore").roleLabels.includeIndex(),fields:["id","label"],idIndex:0}),valueField:"id",displayField:
"label",value:0}),new Ext.form.FieldSet({title:"Passwort setzen",collapsed:true,checkboxToggle:true,checkboxName:
"setPassword",autoHeight:true,layout:"fit",items:[new Ext.form.TextField({name:"password",inputType:"password",listeners
:{specialkey:function(c,a){if(a.getKey()===a.ENTER)this.ownerCt.ownerCt.ownerCt.buttons[1].handler(this.ownerCt.ownerCt.
ownerCt.buttons[1],{})}}})],listeners:{expand:function(a,c){a.ownerCt.ownerCt.syncShadow()},collapse:function(a,c){a.
ownerCt.ownerCt.syncShadow()}}})]})]})}});Ext.namespace("Ext.ux","Ext.ux.pimf","Ext.ux.pimf.users");Ext.ux.pimf.users.
EditWindow=Ext.extend(Ext.ux.pimf.users.AbstractWindow,{constructor:function(a){Ext.ux.pimf.users.EditWindow.superclass.
constructor.call(this,"Bearbeite Benutzer");this.userData=a.data;this.addListener("show",function(b){this.items.item(0).
getForm().setValues(this.userData);this.items.item(0).getForm().setValues({password:""})});Ext.ux.pimf.StoreObserver.
create({storeId:"UserStore",scope:this,events:["remoteedit"],listeners:{remoteedit:function(){this.close()}}})},save:
function(){var a=this.items.item(0).getForm().getFieldValues(),b=this.items.item(0).getForm().getValues();Ext.StoreMgr.
get("UserStore").remoteEdit({id:this.userData.id,username:a.username,password:b.setPassword==="on"?Ext.ux.crypto.SHA1.
hash(a.password):this.userData.password,role:a.role})}});Ext.namespace("Ext.ux","Ext.ux.pimf","Ext.ux.pimf.users");Ext.
ux.pimf.users.Grid=Ext.extend(Ext.grid.GridPanel,{constructor:function(){Ext.ux.pimf.users.Grid.superclass.constructor.
call(this,{id:"UserGrid",border:false,listeners:{rowcontextmenu:function(a,c,b){b.rowContext=true;if(!a.
getSelectionModel().isSelected(c))a.getSelectionModel().selectRow(c);a.showContextMenu(b)},containercontextmenu:function
(b,a){a.rowContext=false;b.showContextMenu(a)},containerclick:function(a,b){a.getSelectionModel().clearSelections()}},
colModel:new Ext.grid.ColumnModel({defaults:{editable:false,sortable:true},columns:[{header:"",dataIndex:"",fixed:true,
menuDisabled:true,hideable:false,width:30,renderer:function(f,c,a,d,b,e){return'<img src="images/'+a.getRoleImageFile()+
'" />'}},{header:"ID",dataIndex:"id",hidden:true,width:50},{header:"Benutzername",dataIndex:"username",width:400},{
header:"Rolle",dataIndex:"role",width:100,renderer:function(f,c,a,d,b,e){return a.getRoleLabel()}}]}),columnLines:true,
selModel:new Ext.grid.RowSelectionModel({listeners:{selectionchange:function(a){a.grid.loadPropertyView()}}}),stripeRows
:true,store:Ext.StoreMgr.get("UserStore"),view:new Ext.grid.GridView({emptyText:"Es wurden keine Daten gefunden!"})})},
getContextMenu:function(a){return new Ext.menu.Menu({items:[new Ext.menu.Item({text:"Bearbeiten",iconCls:"x-menu-edit",
disabled:this.getSelectionModel().getSelections().length>1,hidden:!Ext.ux.pimf.Connection.locked||!a.rowContext,scope:
this,handler:function(b,c){new Ext.ux.pimf.users.EditWindow(this.getSelectionModel().getSelected()).show(b.getEl())}}),
new Ext.menu.Item({text:"L\xF6schen",iconCls:"x-menu-remove",hidden:!Ext.ux.pimf.Connection.locked||!a.rowContext,scope:
this,handler:function(b,c){new Ext.ux.pimf.users.RemoveDialog(this.getSelectionModel().getSelections()).show(b.getEl())}
}),new Ext.menu.Separator({hidden:!Ext.ux.pimf.Connection.locked||!a.rowContext}),new Ext.menu.Item({text:"Neu",iconCls:
"x-menu-new",hidden:!Ext.ux.pimf.Connection.locked,scope:this,handler:function(b,c){new Ext.ux.pimf.users.NewWindow().
show(b.getEl())}}),new Ext.menu.Separator({hidden:!Ext.ux.pimf.Connection.locked}),new Ext.menu.Item({text:
"Alles ausw\xE4hlen",iconCls:"x-menu-selection",scope:this,handler:function(b,c){this.getSelectionModel().selectAll()}})
]})},showContextMenu:function(a){a.stopEvent();if(a.button===0){if(this.getSelectionModel().getCount()===0)return;a.
rowContext=true}var b=a.getXY();this.getContextMenu(a).showAt([(b[0]+5),(b[1]+5)])},activate:function(){this.ownerCt.
layout.setActiveItem(this.id);this.loadPropertyView()},loadPropertyView:function(){var a=this.getSelectionModel().
getSelections();if(a.length===0){Ext.getCmp("BlankPropertyView").activate();Ext.getCmp("UserPropertyView").load(null)}
else if(a.length===1){Ext.getCmp("UserPropertyView").activate();Ext.getCmp("UserPropertyView").load(a[0].data.id)}else{
Ext.getCmp("MultiPropertyView").activate(a.length);Ext.getCmp("UserPropertyView").load(null)}}});Ext.namespace("Ext.ux",
"Ext.ux.pimf","Ext.ux.pimf.users");Ext.ux.pimf.users.NewWindow=Ext.extend(Ext.ux.pimf.users.AbstractWindow,{constructor:
function(){Ext.ux.pimf.users.NewWindow.superclass.constructor.call(this,"Neuer Benutzer");this.addListener("show",
function(a){this.items.item(0).getForm().setValues({id:"(neu)"})});Ext.ux.pimf.StoreObserver.create({storeId:"UserStore"
,scope:this,events:["remotenew"],listeners:{remotenew:function(){this.close()}}})},save:function(){var a=this.items.item
(0).getForm().getFieldValues(),b=this.items.item(0).getForm().getValues();Ext.StoreMgr.get("UserStore").remoteNew({id:0,
username:a.username,role:a.role,password:Ext.ux.crypto.SHA1.hash(a.password)})}});Ext.namespace("Ext.ux","Ext.ux.pimf",
"Ext.ux.pimf.users");Ext.ux.pimf.users.PropertyView=Ext.extend(Ext.form.FormPanel,{constructor:function(){Ext.ux.pimf.
users.PropertyView.superclass.constructor.call(this,{id:"UserPropertyView",border:false,defaults:{anchor:"100%"},border:
false,padding:"10px 10px 6px 10px",items:[new Ext.form.DisplayField({name:"type",hideLabel:true,cls:"x-propertyview"}),
new Ext.form.DisplayField({name:"id",fieldLabel:"ID"}),new Ext.form.DisplayField({name:"username",fieldLabel:
"Benutzername"}),new Ext.form.DisplayField({name:"role",fieldLabel:"Rolle"})]});Ext.ux.pimf.StoreObserver.create({
storeId:"UserStore",scope:this,events:["load","update"],listeners:{load:function(b,c,a){if(this.userId===undefined||this
.userId===null)return;this.reload()},update:function(c,b,a){if(b.data.id===this.userId&&a===Ext.data.Record.COMMIT)this.
reload()}}})},activate:function(){this.ownerCt.layout.setActiveItem(this.id)},load:function(a){this.userId=a;this.reload
()},reload:function(){if(this.userId===undefined||this.userId===null)return;var a=Ext.StoreMgr.get("UserStore").getById(
this.userId);if(a===undefined)return;this.getForm().findField("type").removeClass("x-propertyview-reader");this.getForm(
).findField("type").removeClass("x-propertyview-editor");this.getForm().findField("type").removeClass(
"x-propertyview-administrator");this.getForm().findField("type").addClass("x-propertyview-"+a.getRoleName());this.
getForm().setValues({type:"Benutzer ("+a.getRoleLabel()+")",id:a.data.id.toString(),username:a.data.username,role:a.
getRoleLabel()})}});Ext.namespace("Ext.ux","Ext.ux.pimf","Ext.ux.pimf.users");Ext.ux.pimf.users.RemoveDialog=function(c)
{this.userIds=c.extractProperty("data").extractProperty("id");this.show=function(a){Ext.MessageBox.show({title:
"L\xF6sche Benutzer",msg:"Sind Sie sich sicher, dass Sie diese(n) Benutzer l\xF6schen wollen?",buttons:Ext.MessageBox.
YESNO,icon:Ext.MessageBox.QUESTION,animEl:a,scope:this,fn:function(d){if(d==="yes")Ext.StoreMgr.get("UserStore").
remoteRemove(this.userIds)}})}};Ext.namespace("Ext.ux","Ext.ux.pimf","Ext.ux.pimf.users");Ext.ux.pimf.users.Store=Ext.
extend(Ext.data.JsonStore,{constructor:function(){Ext.ux.pimf.users.Store.superclass.constructor.call(this,{storeId:
"UserStore",autoSave:false,fields:[{name:"id",type:"int"},{name:"username",type:"string"},{name:"password",type:"string"
},{name:"role",type:"int"}],root:"records",sortInfo:{field:"username",direction:"ASC"}});this.reader.recordType.
prototype.getRoleImageFile=function(){return this.store.roleImageFiles[this.data.role]};this.reader.recordType.prototype
.getRoleLabel=function(){return this.store.roleLabels[this.data.role]};this.reader.recordType.prototype.getRoleName=
function(){return this.store.roleNames[this.data.role]};this.addEvents("remoteload","remotenew","remoteedit",
"remoteremove")},remoteLoad:function(){Ext.ux.pimf.Connection.request({action:["users","get"],data:{},scope:this,
customSuccess:function(b,a){this.lastOptions=a;this.loadData(Ext.util.JSON.decode(b.responseText));this.fireEvent(
"remoteload",this.getRange())}})},remoteReload:function(){this.remoteLoad()},remoteNew:function(e){Ext.ux.pimf.
Connection.request({action:["users","create"],data:e,scope:this,customSuccess:function(d,c){var a=Ext.apply(c.data,{id:
Ext.util.JSON.decode(d.responseText).id}),b=new this.reader.recordType(a,a.id);this.addSorted(b);this.fireEvent(
"remotenew",b)}})},remoteEdit:function(e){Ext.ux.pimf.Connection.request({action:["users","update"],data:e,scope:this,
customSuccess:function(f,d){var a=d.data,c=this.getById(a.id);for(var b in a)c.set(b,a[b]);this.commitChanges();this.
sort(this.getSortState().field,this.getSortState().direction);this.fireEvent("remoteedit",c)}})},remoteRemove:function(f
){Ext.ux.pimf.Connection.request({action:["users","delete"],data:{ids:f},scope:this,customSuccess:function(g,e){var c=e.
data.ids,b,d=[];for(var a=0;a<c.length;a++){b=this.getById(c[a]);this.remove(b);d.push(b)}this.commitChanges();this.
fireEvent("remoteremove",d)}})},roleImageFiles:["led-icons/user.png","led-icons/user_business.png",
"led-icons/user_business_boss.png"],roleLabels:["Leser","Editor","Administrator"],roleNames:["reader","editor",
"administrator"]});Ext.namespace("Ext.ux","Ext.ux.pimf");Ext.ux.pimf.Connection=new Ext.util.Observable();Ext.ux.pimf.
Connection.addEvents("login","lock","unlock","unlockFailure");Ext.apply(Ext.ux.pimf.Connection,{request:function(b){if(b
.msg!==undefined)this.addMessage(b.msg);else if(b.action[1]==="get")this.addMessage(
"Die Daten werden vom Server geholt ...");else this.addMessage("Die Daten werden zum Server gesendet ...");Ext.Ajax.
request(Ext.applyIf({connection:this,url:Ext.SOFTWARE_URL+"server/"+b.action[0]+"/"+b.action[1]+".php",params:{data:Ext.
util.JSON.encode(b.data),login:Ext.util.JSON.encode(this.userData)},success:function(c,a){if(Ext.util.JSON.decode(c.
responseText).success===true){if(a.customSuccess!==undefined)a.customSuccess.call(this,c,a);a.connection.removeMessage()
}else{if(a.customFailure!==undefined)a.customFailure.call(this,c,a);a.connection.removeMessage();if(a.
customFailureMessageBox!==undefined)a.customFailureMessageBox.call(this,c,a);else Ext.MessageBox.show({title:
"Serverfehler",msg:Ext.util.JSON.decode(c.responseText).errormessage,buttons:Ext.MessageBox.OK,icon:Ext.MessageBox.ERROR
})}},failure:function(c,a){if(a.customFailure!==undefined)a.customFailure.call(this,c,a);a.connection.removeMessage();
Ext.MessageBox.show({title:"Verbindungsfehler",msg:unescape(c.statusText),buttons:Ext.MessageBox.OK,icon:Ext.MessageBox.
ERROR})}},b))},userData:null,getUserRole:function(){return this.userData===null?-1:this.userData.role},login:function(b)
{this.userData=b;this.request({action:["users","getRole"],data:{},scope:this,customSuccess:function(a,c){this.userData.
role=Ext.util.JSON.decode(a.responseText).role;Ext.StoreMgr.get("FolderStore").remoteLoad();Ext.StoreMgr.get(
"FreePropertyStore").remoteLoad();this.fireEvent("login")}})},logout:function(){this.userData=null;this.addMessage(
"Das Fenster wird jetzt neu geladen ...");window.location.reload()},locked:false,lock:function(b){this.request({action:[
"lock","create"],data:{adminOverwrite:b},scope:this,customSuccess:function(c,a){this.locked=true;this.fireEvent("lock")}
,customFailureMessageBox:function(a,d){if(!d.data.adminOverwrite&&this.getUserRole()===2)Ext.MessageBox.show({title:
"Serverfehler",msg:"Der Server lieferte folgenden Fehler zur\xFCck:<br />"+Ext.util.JSON.decode(a.responseText).
errormessage+"<br /><br />"+"Wollen Sie Ihre Administratorrechte einsetzen, um die Schreibrechte zu erzwingen?",buttons:
Ext.MessageBox.YESNO,icon:Ext.MessageBox.ERROR,scope:this,fn:function(c){if(c==="yes")this.lock(true)}});else Ext.
MessageBox.show({title:"Serverfehler",msg:Ext.util.JSON.decode(a.responseText).errormessage,buttons:Ext.MessageBox.OK,
icon:Ext.MessageBox.ERROR})}})},unlock:function(){this.request({action:["lock","delete"],data:{},scope:this,
customSuccess:function(b,a){this.locked=false;this.fireEvent("unlock")},customFailure:function(b,a){this.fireEvent(
"unlockFailure")}})},messageQueue:[],addMessage:function(a){this.messageQueue.push(a);if(this.messageQueue.length>0)this
.messageWaitBox=Ext.MessageBox.wait(this.messageQueue[0],"Serververbindung")},removeMessage:function(){this.messageQueue
.shift();if(this.messageQueue.length>0)this.messageWaitBox.updateText(this.messageQueue[0]);else{this.messageWaitBox.
hide();this.messageWaitBox=undefined}}});Ext.namespace("Ext.ux","Ext.ux.pimf");Ext.ux.pimf.StoreObserver=Ext.extend(Ext.
util.Observable,{relayEvents:function(a){Ext.ux.pimf.StoreObserver.superclass.relayEvents.call(this,Ext.StoreMgr.get(
this.storeId),a)},addListener:function(a,b){Ext.ux.pimf.StoreObserver.superclass.addListener.call(this,a,b,this.scope)}}
);Ext.ux.pimf.StoreObserver.create=function(b){var a=new Ext.ux.pimf.StoreObserver();a.scope=b.scope;a.storeId=b.storeId
;a.relayEvents(b.events);for(var d in b.listeners)a.addListener(d,b.listeners[d]);if(a.scope.storeObservers===undefined)
{a.scope.storeObservers={};a.scope.addListener("beforedestroy",function(e){for(var c in this.storeObservers){this.
storeObservers[c].purgeListeners();delete this.storeObservers[c]}})}a.scope.storeObservers[a.storeId]=a};Ext.namespace(
"Ext.ux","Ext.ux.pimf");Ext.ux.pimf.Util=function(){};Ext.ux.pimf.Util.includeKey=function(c){var b=[];for(var a in c)b.
push([a,c[a]]);return b};Ext.namespace("Ext.ux","Ext.ux.pimf");Ext.ux.pimf.Viewport=Ext.extend(Ext.Viewport,{constructor
:function(){Ext.ux.pimf.Viewport.superclass.constructor.call(this,{layout:"border",items:[new Ext.Panel({region:"north",
height:39,border:false,bodyStyle:"background-image: url(images/header-background.gif); color: #FFF; ",layout:"border",
items:[new Ext.Panel({region:"center",unstyled:true,html:
'<h1 style="padding: 5px; font-weight: normal; font: 17px arial,tahoma,helvetica,sans-serif; "><span style="font-size: 1.2em; ">Praktikum Inventar</span> <span style="font-size: 0.7em; ">der Physik Fakult\xE4t der Ludwig-Maximilian-Universit\xE4t, M\xFCnchen</span></h1>'
}),new Ext.Panel({region:"east",width:400,unstyled:true,items:[new Ext.ux.pimf.misc.LogoutButton(),new Ext.ux.pimf.misc.
LockButton()]})]}),new Ext.Panel({region:"west",split:true,border:false,style:"border-width: 0 1px 0 0; ",collapsible:
true,floatable:false,plugins:[new Ext.ux.ToolsTips({tips:{expand:"Navigation ausklappen",refresh:"Aktualisieren"}})],
toolTemplate:new Ext.XTemplate("<tpl if=\"id=='collapse-west'\">",
'<div class="x-tool x-tool-{id} displayblock">&#160;</div>',"</tpl>","<tpl if=\"id!='collapse-west'\">",
'<div class="x-tool x-tool-{id}">&#160;</div>',"</tpl>"),tools:[{id:"refresh",handler:function(a,d,b,c){Ext.StoreMgr.get
("FolderStore").remoteLoad()}},{id:"separator1",handler:function(){}},{id:"collapseAll",qtip:"Alle reduzieren",handler:
function(b,d,a,c){a.items.item(0).getRootNode().collapse(true)}},{id:"expandAll",qtip:"Alle erweitern",handler:function(
b,d,a,c){a.items.item(0).getRootNode().expand(true)}},{id:"separator2",handler:function(){}},{id:"collapse-west",qtip:
"Navigation einklappen",handler:function(b,d,a,c){a.collapse()}}],width:300,title:"Navigation",margins:"0",cmargins:"0",
layout:"fit",items:[new Ext.ux.pimf.folders.NavigationTree()]}),new Ext.Panel({region:"center",layout:"border",margins:
"0",border:false,style:"border-width: 0 1px 0 1px; ",title:"Browser",items:[new Ext.Panel({region:"center",border:false,
layout:"card",activeItem:0,items:[new Ext.ux.pimf.misc.BlankGrid(),new Ext.ux.pimf.freeProperties.Grid(),new Ext.ux.pimf
.items.Grid(),new Ext.ux.pimf.users.Grid()],bbar:new Ext.Toolbar({layout:"HBox",items:[new Ext.Toolbar.TextItem({text:
"Suche:",style:"font-weight: bold; padding-top: 3px; padding-right: 10px; "}),new Ext.ux.pimf.search.Field()]})}),new 
Ext.ux.pimf.search.Grid()]}),new Ext.Panel({region:"east",split:true,border:false,style:"border-width: 0 0 0 1px; ",
collapsible:true,floatable:false,plugins:[new Ext.ux.ToolsTips({tips:{toggle:"Eigenschaften einklappen",expand:
"Eigenschaften ausklappen"}})],width:300,title:"Eigenschaften",margins:"0",cmargins:"0",layout:"card",activeItem:0,items
:[new Ext.ux.pimf.misc.BlankPropertyView(),new Ext.ux.pimf.misc.MultiPropertyView(),new Ext.ux.pimf.folders.PropertyView
(),new Ext.ux.pimf.freeProperties.PropertyView(),new Ext.ux.pimf.items.PropertyView(),new Ext.ux.pimf.users.PropertyView
()]})]})}});Ext.ux.ToolsTips=function(a){this.tools=Ext.apply({},(a||{}).tips||{},this._tools);this.release=[]};Ext.
extend(Ext.ux.ToolsTips,Object,{_tools:{toggle:"Expand/Collapse",expand:"Expand",close:"Close",minimize:"Minimize",
maximize:"Maximize",restore:"Restore",gear:"Configure",pin:"Pin",unpin:"Unpin",right:"Collapse right",left:
"Collapse left",up:"Up",down:"Down",refresh:"Refresh",minus:"Subtract",plus:"Add",help:"Help",search:"Find",save:"Save",
print:"Print"},ptype:"toolstips",init:function(a){if(Ext.QuickTips&&Ext.QuickTips.isEnabled()&&a){a.rendered?this.
applyTips(a):a.on("afterrender",this.applyTips,this,{single:true,delay:1200});a.on("destroy",this.releaseTips,this)}},
applyTips:function(a){if(a){var h=a?a.tools:null,o=Ext.QuickTips.register,p=Ext.QuickTips.getQuickTip(),g=a&&a.ownerCt?a
.ownerCt.layout:null,m=g?g[a.region]:null,j,n,l;Ext.iterate(this.tools,function(b,c){n=Ext.isString(c)?{text:c}:c||{text
:b};if(h&&h.hasOwnProperty(b)&&!p.targets[h[b].id]){n.target=h[b];o(n);this.release.push(h[b])}if(m&&(l=m.getCollapsedEl
())&&(j=l.child("div.x-tool-"+b+"-"+a.region))){n.target=j;o(n);this.release.push(j)}},this)}},releaseTips:function(){
Ext.each(this.release||[],function(a){Ext.QuickTips&&Ext.QuickTips.unregister(a)})}});Ext.preg&&Ext.preg("toolstips",Ext
.ux.ToolsTips)