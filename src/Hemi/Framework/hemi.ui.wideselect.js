
/*
	Wide Select Control
	Source: Hemi.ui.wideselect
	Copyright 2002 - 2008. All Rights Reserved.
	Version: %FILE_VERSION%
	Author: Stephen W. Cote
	Email: sw.cote@gmail.com
	Project: http://www.whitefrost.com/projects/engine/
	License: http://www.whitefrost.com/projects/engine/code/engine.license.txt
	
*/

/*

	Page Hashing
		keep a hash of ids for paged items so as to compare which items may or may not be currently in use.
		This was designed for using WideSelect as a transfer control where a data item may exist for some period of time within another field.
*/

/*
	Value Constructs
		Item Construct
			Each item in the visible or paged list has the following structure:

			v = {
				name:"{name}",
				data:"{value data}",
				id:"{unique item id}",
				index:"{item index}"
			}
		
		Paged Construct
			Paged items are stored internally in the following structure:
			v = {
				name:"{name}",
				data:"{value data | data construct}",
			}
			This value shouldn't need to be exposed anywhere.
			
			
		Paged Data Construct
			When items are paged, the following construct is loosely enforced as the
			value.  The purpose for this construct is to include the relevant data items
			for the label, an item id, and value.
			Although this means the label is used twice in the pageItem invocation, it also
			allows the single contstruct to be used in an array for importPageItems.
			
			v = {
				label:"{name}",
				id:"{id}",
				value:"{value}"
			}
		
*/

/// <source>
/// <name>Hemi.ui.wideselect</name>
/// <project>
/// 	<name>Hemi JavaScript Framework</name>
/// 	<url-title>Hemi JavaScript Framework</url-title>
/// 	<url>/Hemi/</url>
/// </project>
///
/// <package>
///		<path>Hemi.ui.wideselect</path>
///		<library>Hemi</library>
///		<description>The WideSelect control is a list control which supports buffered and paginated presentation.</description>
///		<static-class>
///			<name>WideSelect</name>
///			<version>%FILE_VERSION%</version>
///			<description>Control for buffering and paging large sets of data for display.</description>
///			<version>%FILE_VERSION%</version>
///			<method>
///				<name>newInstance</name>
///				<param name = "o" type = "HTMLNode">Parent HTML Node in which the control will be created.</param>
///				<param name = "cf" type = "function" optional = "1">Click event handler.</param>
///				<param name = "pf" type = "function" optional = "1">Paginate event handler.</param>
///				<description>Creates a new WideSelectInstance object.</description>
///				<return-value name = "u" type = "WideSelectInstance">Instance of a WideSelect control.</return-value>
///			</method>
///	 </static-class>


/// <class>
///		<name>WideSelectItem</name>
///		<version>%FILE_VERSION%</version>
///		<description>Object representing an item in the WideSelect control.</description>
///		<property type = "String" get = "1" set = "1">
///			<name>name</name>
///			<description>Visible name of the item.</description>
///		</property>
///		<property type = "variant" get = "1" set = "1">
///			<name>data</name>
///			<description>The data referenced or held by the item.</description>
///		</property>
///		<property type = "HTMLNode" get = "1" private = "1" internal = "1">
///			<name>object</name>
///			<description>The HTML object used to display the item.</description>
///		</property>
///		<property type = "String" get = "1">
///			<name>id</name>
///			<description>Unique identifier.</description>
///		</property>
///		<property type = "integer" get = "1">
///			<name>index</name>
///			<description>Index of this item in the items array.</description>
///		</property>
///	</class>
/// <class>
///		<name>ImportPageItem</name>
///		<version>%FILE_VERSION%</version>
///		<description>Object construct used to bulk load paginated items.</description>
///		<property type = "String" get = "1" set = "1">
///			<name>label</name>
///			<description>Name of the item.</description>
///		</property>
///		<property type = "String" get = "1" set = "1">
///			<name>id</name>
///			<description>Unique identifier</description>
///		</property>
///		<property type = "variant" get = "1" private = "1" internal = "1">
///			<name>value</name>
///			<description>Value of the item.</description>
///		</property>
///		<property type = "integer" get = "1">
///			<name>index</name>
///			<description>Index of this item in the items array.</description>
///		</property>
///	</class>
/// <class>
///		<name>WideSelectInstance</name>
///		<version>%FILE_VERSION%</version>
///		<description>A buffering and pagination control for displaying large and incremental sets of data.</description>
(function(){
	HemiEngine.include("hemi.event");
	HemiEngine.include("hemi.css");
	HemiEngine.include("hemi.ui.util");
	HemiEngine.namespace("ui.wideselect", HemiEngine, {

		newInstance:function(o, h, ph){
			/*
				o = object parent
				h = optional onclick handler
				ph = optional page navigate handler
			*/
			/// <property type = "String" get = "1" internal = "1">
			/// <name>object_id</name>
			/// <description>Unique instance identifier.</description>
			/// </property>

			/// <property type = "String" get = "1" internal = "1">
			/// <name>object_version</name>
			/// <description>Version of the object class.</description>
			/// </property>

			/// <property type = "String" get = "1" internal = "1">
			/// <name>object_type</name>
			/// <description>The type of this object.</description>
			/// </property>
			
			/// <property type = "int" get = "1" internal = "1">
			/// <name>ready_state</name>
			/// <description>Object load and execution state.  Follows: 0 unitialized, 1 through 3 variant, 4 ready, 5 destroyed.</description>
			/// </property>
			
			/// <property type = "object" get = "1" internal = "1">
			/// <name>object_config</name>
			/// <description>Object API structure for storing sub structures: object_config.pointers and object_config.status.</description>
			/// </property>
			
			/// <method>
			/// <name>getObjectId</name>
			/// <return-value name = "i" type = "String">The unique object instance id.</return-value>
			/// <description>Returns the unique id of the object.</description>
			/// </method>
			///
			/// <method>
			/// <name>getObjectType</name>
			/// <return-value name = "t" type = "String">The type of the object instance.</return-value>
			/// <description>Returns the type of the object.</description>
			/// </method>
			///
			/// <method>
			/// <name>getObjectVersion</name>
			/// <return-value name = "v" type = "String">The version of the object instance.</return-value>
			/// <description>Returns the version of the object.</description>
			/// </method>
			///
			/// <method>
			/// <name>getReadyState</name>
			/// <return-value name = "s" type = "int">The object ready state.</return-value>
			/// <description>Returns the state of the object.</description>
			/// </method>
			///
			
			/// <message>
			/// <name>onbuffercommitted</name>
			/// <param name = "o" type = "WideSelectInstance">The WideSelect control for which the buffer was committed.</param>
			/// <description>Message published to all subscribers when a buffered resultset was committed; being completely rendered and/or paginated.</description>
			/// </message>

			/// <message>
			/// <name>onresultclick</name>
			/// <param name = "o" type = "WideSelectInstance">The WideSelect control for which the item state was changed.</param>
			/// <description>Message published to all subscribers when the state changes for a WideSelectItem object.</description>
			/// </message>

			/// <method virtual = "1">
			/// <name>handle_pagenavigate</name>
			/// <param name = "s" type = "String">Static parameter: <i>onpagenavigate</i>.</param>
			/// <param name = "i" type = "integer">Current page index.</param>
			/// <description>Handler is specified in the WideSelectInstance constructor; <i>newInstance</i>.</description>
			/// </method>

			/// <method>
			/// <name>getPointers</name>
			/// <return-value name = "o" type = "object">The object_config.pointers substructure.</return-value>
			/// <description>Returns the object_config.pointers sub structure.</description>
			/// </method>
			
			var n = HemiEngine.newObject("wideselect","%FILE_VERSION%");		

			if(!DATATYPES.TO(o)) o = document.body;
			
			n.objects = {
				/* parent_object */
				p:o,
				/* c = container  */
				c:0,
				/* b = buffer */
				b:[],
				/* r = results */
				r:[],
				/* rh = results hash */
				rh:[],
				/* h = optional click handler */
				h:h,
				/* ph = optional page navigate handler */
				ph:ph,
				active_item:null,
				active_results:[],

				/* g = pages */
				g:[],
				/* s = pages_hash */
				s:[],
				request_hash:[],
				request_object:0
			};
			n.properties = {
				/* m = buffer mark */
				m:0,
				buffered:1,
				auto_commit:1,
				is_commit:0,
				buffer_delay:20,
				buffer_step:10,

				auto_scroll:0,
				auto_select:0,
				maximum_items:100,
				maximum_rollover:1,
				item_id_counter:0,
				multiple:0,

				/* is paging enabled */
				is_paging:0,
				/* current page in the series */
				current_page:0,
				/* known maximum page count */
				maximum_page_size:0,
				/* max items per page */
				maximum_page_items:200,
				/* a marker used while paging data */
				page_marker:0,
				/* marker used to note that no more data was returned */
				page_stop:0,
				/* whash up the paged values */
				page_hashing:1,
				is_requested:0,
				can_request:0,
				
				class_container:"wideselect_container",
				class_item:"wideselect_item",
				class_item_blocked:"wideselect_item_blocked",
				class_item_hover:"wideselect_item_hover",
				class_item_active:"wideselect_item_active"
			};
			
			/// <method>
			/// <name>setMultiple</name>
			/// <param name = "b" type = "boolean">Bit indicating whether multiple selection is enabled.</param>
			/// <description>Sets whether multiple selection is enabled.</description>
			/// </method>
			n.setMultiple = function(b){
				this.properties.multiple=(b?1:0);
				this.deselectAllItems();
			};
			
			/// <method>
			/// <name>getMultiple</name>
			/// <return-value name = "b" type = "boolean">Bit indicating whether multiple selection is enabled.</return-value>
			/// <description>Returns whether multiple selection is enabled.</description>
			/// </method>
			n.getMultiple = function(){
				return (this.properties.multiple?true:false);
			};
			
			/// <method>
			/// <name>setMaximumItems</name>
			/// <param name = "i" type = "integer">Maximum number of items supported by the control.</param>
			/// <description>Sets the maximum number of items supported by the control.   Specify zero to indicate no limit.  Any items over the maximum when rollover is enabled will cause the top-most item to be removed.  When rollover is disabled, the addItem method will fail on the last item.</description>
			/// </method>
			n.setMaximumItems = function(i){
				this.properties.maximum_items = i;
			};
			
			/// <method>
			/// <name>getMaximumItems</name>
			/// <return-value name = "i" type = "integer">Maximum number of items supported by the control.  Zero indicates no limit.</return-value>
			/// <description>Returns the maximum number of items supported by the control.</description>
			/// </method>
			n.getMaximumItems = function(){
				return this.properties.maximum_items;
			};
			
			/// <method>
			/// <name>setMaximumPageItems</name>
			/// <param name = "i" type = "integer">Maximum number of items to be displayed per page.</param>
			/// <description>Sets the maximum number of items displayed per page, if paging is enabled.</description>
			/// </method>
			n.setMaximumPageItems = function(i){
				this.properties.maximum_page_items = i;
			};
			
			/// <method>
			/// <name>getMaximumPageItems</name>
			/// <return-value name = "i" type = "integer">Maximum number of items displayed per page.</return-value>
			/// <description>Returns the maximum number of items to display per page, if paging is enabled.</description>
			/// </method>
			n.getMaximumPageItems = function(){
				return this.properties.maximum_page_items;
			};
			
			/// <method>
			/// <name>getCurrentPageItemCount</name>
			/// <return-value name = "i" type = "integer">Number of items in the current page.</return-value>
			/// <description>Returns the number of items in the current page.</description>
			/// </method>
			n.getCurrentPageItemCount = function(){
				var t = this, _p, _s;
				_p = t.objects;
				_s = t.properties;
				if(!DATATYPES.TO(_p.g[_s.current_page])) _p.g[_s.current_page] = [];
				return _p.g[_s.current_page].length;
			};
			
			/// <method>
			/// <name>getContainer</name>
			/// <return-value name = "o" type = "HTMLNode">HTML Node in which the control is created.</return-value>
			/// <description>Returns the the HTML Node in which the control is created.</description>
			/// </method>
			n.getContainer = function(){
				return this.objects.c;
			};

			/// <method>
			/// <name>getBufferMark</name>
			/// <return-value name = "i" type = "integer">Current insert position in the buffer.</return-value>
			/// <description>Returns the current position in the buffer, after which additional items will be rendered.</description>
			/// </method>
			n.getBufferMark=function(){
				return this.properties.m;
			};
			
			/// <method>
			/// <name>setResultHandler</name>
			///	<param name = "f" type = "function">Function pointer to click handler.</param>
			/// <description>Specifies the handler to invoke when a result item is activated.</description>
			/// </method>		
			n.setResultHandler=function(f){
				this.objects.h = f;
			};

			/// <method>
			/// <name>getBufferSize</name>
			/// <return-value name = "i" type = "integer">Current size of the buffer.</return-value>
			/// <description>Returns the current size of the buffer.</description>
			/// </method>		
			n.getBufferSize=function(){
				return this.objects.b.length;
			};
			
			/// <method>
			/// <name>getItemSize</name>
			/// <return-value name = "i" type = "integer">Count of all rendered and paginated items.</return-value>
			/// <description>Returns the current size of all items in the control.</description>
			/// </method>	
			n.getItemSize=function(){
				return this.objects.r.length;
			};

			/// <method>
			/// <name>getItems</name>
			/// <return-value name = "a" type = "Array">Array of WideSelectItem objects.</return-value>
			/// <description>Returns an array of WideSelectItem objects.</description>
			/// </method>
			n.getItems = function(){
				return this.objects.r;
			};
			
			/// <method>
			/// <name>getItem</name>
			/// <param name = "i" type = "integer">Index of WideSelectItem in items array.</param>
			/// <return-value name = "o" type = "WideSelectItem">WideSelectItem object.</return-value>
			/// <description>Returns the WideSelectItem object at the specified index.</description>
			/// </method>
			n.getItem=function(i){
				return this.objects.r[i];
			};
			
			/// <method>
			/// <name>getActiveItem</name>
			/// <return-value name = "o" type = "WideSelectItem">WideSelectItem object.</return-value>
			/// <description>Returns the selected WideSelectItem object.</description>
			/// </method>
			n.getActiveItem=function(){
				var c=this.objects;
				if(c.active_item){
					return c.r[c.rh[c.active_item.getAttribute("rid")]]
				}
				return null;
			};
			
			/// <method>
			/// <name>getActiveItems</name>
			/// <return-value name = "a" type = "Array">Array of WideSelectItem objects.</return-value>
			/// <description>Returns an array of selected WideSelectItem objects.</description>
			/// </method>
			n.getActiveItems = function(){
				var a = [], o = this.objects,i;
				for(i in o.active_results){
					if(o.active_results[i] == 1) a.push(o.r[o.rh[i]]);
				}
				return a;
			};


			/// <method>
			/// <name>setCanRequest</name>
			/// <param name = "b" type = "boolean">Bit indicating whether the control can be requested.</param>
			/// <description>Specifies whether the WideSelect control can be requested.  The request featureset is used when the control is a pop-up or conditionally visible.</description>
			/// </method>
			n.setCanRequest = function(b){
				this.properties.can_request = b;
			};

			/// <method>
			/// <name>setIsPaging</name>
			/// <param name = "b" type = "boolean">Bit indicating whether the control is in paging mode.</param>
			/// <description>Specifies whether the WideSelect control is in paging mode.  Changing this value will clear paged items, and the control will need to be repopulated.</description>
			/// </method>
			n.setIsPaging = function(i){
				this.properties.is_paging = (i?1:0);
				this.clearPagingValues();
			};

			/// <method>
			/// <name>getIsPaging</name>
			/// <return-value name = "b" type = "boolean">Bit indicating whether the control is in paging mode.</return-value>
			/// <description>Returns whether the WideSelect control is in paging mode.</description>
			/// </method>
			n.getIsPaging = function(){
				return this.properties.is_paging;
			};

			/// <method>
			/// <name>setPageStop</name>
			/// <param name = "b" type = "boolean">Bit indicating whether the control should stop expecting more data.</param>
			/// <description>Specifies whether the WideSelect control should stop expecting more data, when in paging mode.</description>
			/// </method>
			n.setPageStop = function(b){
				this.properties.page_stop = (b?1:0);
			};
			
			/// <method>
			/// <name>getPageStop</name>
			/// <return-value name = "b" type = "boolean">Bit indicating whether the control is no longer expecting additional data.</return-value>
			/// <description>Returns whether the WideSelect control is no longer expecting data.</description>
			/// </method>
			n.getPageStop = function(){
				return this.properties.page_stop;
			};
			
			/// <method>
			/// <name>setAutoCommit</name>
			/// <param name = "b" type = "boolean">Bit indicating whether the control will automatically render items as they are added.</param>
			/// <description>Specifies whether the WideSelect control should render items as they are added.  If buffering is enabled, items will automatically begin rendering.</description>
			/// </method>
			n.setAutoCommit = function(b){
				this.properties.auto_commit = b;
			};
			
			/// <method>
			/// <name>setAutoScroll</name>
			/// <param name = "b" type = "boolean">Bit indicating whether the control will automatically scroll to the last rendered item.</param>
			/// <description>Specifies whether the WideSelect control will automatically scroll to the last rendered item.</description>
			/// </method>
			n.setAutoScroll = function(b){
				this.properties.auto_scroll = b;
			};

			/// <method>
			/// <name>setAutoSelect</name>
			/// <param name = "b" type = "boolean">Bit indicating whether the control will automatically select the last rendered item.</param>
			/// <description>Specifies whether the WideSelect control will automatically select the last rendered item.</description>
			/// </method>
			n.setAutoSelect = function(b){
				this.properties.auto_select = b;
			};

			/// <method>
			/// <name>setMaximumRollover</name>
			/// <param name = "b" type = "boolean">Bit indicating whether the control will rollover when the maximum number of items is reached.</param>
			/// <description>Specifies whether the WideSelect control will rollover when the maximum number of items is reached; deleting the first item and adding the new item to the end.  If disabled and a maximum limit is stipulated, then new items won't be added.</description>
			/// </method>
			n.setMaximumRollover = function(b){
				this.properties.maximum_rollover = b;
			};

			/// <method>
			/// <name>deselectAllItems</name>
			/// <description>Deselects all selected items in the WideSelect control.</description>
			/// </method>
			n.deselectAllItems = function(){
				var a, _p = this.objects,i=0,l;
				a = _p.r;
				l = a.length;
				_p.active_results = [];
				_p.active_item = null;
				for(;i<l;i++){
					a[i].object.className = this.properties.class_item;
				}
			};

			/// <method internal = "1" private = "1">
			/// <name>init</name>
			/// <description>Initializes the WideSelect control.</description>
			/// </method>
			n.init=function(){
				var t=this,v,d,_m=HemiEngine.message.service,_d=HemiEngine.event,c,_p;

				_p = t.objects;

				d = document.createElement("div");
				/// Specify avoid so the Space service doesn't drill into the results
				///
				d.setAttribute("avoid","1");
				_p.p.appendChild(d);
				d.className = t.properties.class_container;
				
				_d.addScopeBuffer(t);

				/*
				buffer_check is not used with the eventfactory
				but the handler is used to retrieve a pointer from the anonymous call
				of a timeout.
				
				 Yet another case where a probe would be nice.
				*/
				t.scopeHandler("buffer_check",0,0,1);
				t.scopeHandler("commit_buffer",0,0,1);

				t.scopeHandler("mouseover",0,0,1);
				t.scopeHandler("mouseout",0,0,1);
				t.scopeHandler("click",0,0,1);			

				_d.addEventListener(d,"mouseover",t._prehandle_mouseover,0);
				_d.addEventListener(d,"mouseout",t._prehandle_mouseout,0);
				_d.addEventListener(d,"click",t._prehandle_click,0);

				_m.subscribe(t,"destroy","_handle_window_destroy",window);
				/*_m.subscribe(t,"_buffer_updated","_handle_buffer_updated",t);*/

				_p.c = d;

				t.ready_state = 4;

			};
			
			/// <method internal = "1" private = "1">
			/// <name>_handle_window_destroy</name>
			/// <description>Message subscription handler invoked when the host window is unloading.</description>
			/// </method>
			n._handle_window_destroy=function(){
				this.destroy();
			};
	/*		
			n.setMaximumItems=function(i){
				if(typeof i == "number" && i >= 0){
					this.properties.maximum_items = i;
				}
			};
	*/	
			/// <method>
			/// <name>setIsBuffered</name>
			/// <param name = "b" type = "boolean">Bit indicating whether the control should buffer new items.</param>
			/// <description>Specifies whether the control should buffer new items.  Buffered items are incrementally rendered.</description>
			/// </method>
			n.setIsBuffered=function(b){
				var t=this,c;
				t.properties.buffered=b;
				t.properties.m=0;
				t.objects.b=[];
			};
			
			/// <method>
			/// <name>setBufferOffset</name>
			/// <param name = "i" type = "integer">Number of items to render at a time.</param>
			/// <description>Specifies the number of items to be rendered at a time.</description>
			/// </method>
			n.setBufferOffset=function(i){
				this.properties.buffer_step=i;
			};
			
			/// <method>
			/// <name>setBufferDelay</name>
			/// <param name = "i" type = "integer">Number of milleseconds.</param>
			/// <description>Specifies the number of milliseconds to pause between rendering the buffer offset.</description>
			/// </method>
			n.setBufferDelay=function(i){
				this.properties.buffer_delay=i;
			};

			/// <method>
			/// <name>destroy</name>
			/// <description>Cleans up internal pointers, empties buffers, and removes HTML artifacts.  Invoked when the window is unloaded.</description>
			/// </method>
			n.destroy=function(){
				var t=this,c_p;
				_p = t.objects;
				if(t.ready_state == 4){
					t.clearItems();
					_p.b=[];
					_p.p.removeChild(_p.c);
					HemiEngine.registry.service.removeObject(t);
				}
				t.ready_state = 0;
			};

			/// <method>
			/// <name>addItem</name>
			/// <param name = "n" type = "String">Name of the item.  The name is used for the label.</param>
			/// <param name = "d" type = "variant" optional = "1">The value of the item.</param>
			/// <description>Adds an item to the WideSelect control.  The item is displayed based on buffering, and maximum display settings and restrictions.  Use <i>pageItem</i> to add items for pagination.  Specify a value of "_avoid" to create non-selectable labels.</description>
			/// </method>
			n.addItem=function(s,d){
				var t=this,c,_p;
				_p = t.objects;
				if(t.ready_state != 4) return;
				if(t.properties.buffered){
					_p.b[_p.b.length]={name:s,data:d};

					if(t.properties.auto_commit && !t.properties.is_commit){
					
						/* this should be a probe */
						window.setTimeout(t._prehandle_buffer_check,t.properties.buffer_delay);
						/* t.commitBuffer();*/
					}
				}
				else{
					t._addItem(s,d);
				}
			};
			
			/// <method internal = "1" private = "1">
			/// <name>_handle_buffer_check</name>
			/// <description>Internal operation for testing the state of the buffer.</description>
			/// </method>
			n._handle_buffer_check=function(){
				var t=this,c;
				if(t.properties.auto_commit && !t.properties.is_commit){
					t._handle_commit_buffer();
				}
			};
			
			/// <method>
			/// <name>commitBuffer</name>
			/// <description>Commits the buffer up to the next buffer offset.  Invoked automatically when AutoCommit is enabled.</description>
			/// </method>
			n.commitBuffer=function(){
				this._handle_commit_buffer();
			};
			
			/// <method internal = "1" private = "1">
			/// <name>_handle_commit_buffer</name>
			/// <description>Internal operation for committing the buffer into the WideSelectItem array.</description>
			/// </method>
			n._handle_commit_buffer=function(){
				var t=this,c,l,b,m,i,v,_p;
				_p = t.objects;
				t.properties.is_commit=1;
				l=_p.b.length;
				b = false;
				m = t.properties.m;
				for(i=m;i< (m + t.properties.buffer_step) ;i++){
					if(i >= l){
						b=true;
						break;
					}
					v=_p.b[i];
					t._addItem(v.name,v.data);
					t.properties.m++;
				}
				if(b){
					t.properties.m=0;
					_p.b = [];
					t.properties.is_commit=0;
					HemiEngine.message.service.publish("onbuffercommitted",t);
				}
				else{
					window.setTimeout(t._prehandle_commit_buffer,t.properties.buffer_delay);
				}
			};
			
			/// <method>
			/// <name>pageItem</name>
			/// <param name = "n" type = "String">Name of the item.  The name is used for the label.</param>
			/// <param name = "d" type = "variant" optional = "1">The value of the item.</param>
			/// <description>Adds an item for pagination within the WideSelect control.  The item is displayed based on pagination settings.</description>
			/// </method>
			n.pageItem = function(s,d){
				var t = this, _p, _s, page_size, l, v = {name:s,data:d};
				_p = t.objects;
				_s = t.properties;
				page_size = _s.maximum_page_size;

				if(_s.is_paging){
			
					
					if(!DATATYPES.TO(_p.g[page_size])) _p.g[page_size] = [];
					
					l = _p.g[page_size].length;
			
					if(l >= _s.maximum_page_items){
						page_size = (++_s.maximum_page_size);
						if(!DATATYPES.TO(_p.g[page_size])) _p.g[page_size] = [];
						l = _p.g[page_size].length;
					}
			
					/* if page hashing is enabled, record this new id */
					if(_s.page_hashing) _p.s[d.id]=1;
			
			
					_p.g[page_size][l] = v;

				}
			};
			
			/// <method>
			/// <name>updatePage</name>
			/// <description>Renders the current page of WideSelectItem objects.</description>
			/// </method>
			n.updatePage = function(){
				var t = this,
					_p = this.objects,
					_s = this.properties,
					a,
					b,
					i,
					p,
					c,
					o
	/*				_m = HemiEngine.message.service;*/
				;
			
				if(!_s.is_paging) return 0;
			
				c = _s.current_page;
				p = _s.maximum_page_size;





	/*
				if(_s.page_stop)
					_m.sendMessage("Page " + (c + 1) + " of " + (p + 1),"200.1");
	*/
					/*_p.btn_paging_ctrs_label.innerText = "Page " + (c+1) + " of " + (p + 1);*/
				
	/*
				else
					_m.sendMessage("Page " + (c + 1) + " of n","200.1");
	*/
					/*_p.btn_paging_ctrs_label.innerText = "Page " + (c+1) + " of n";*/
		
			
				t.clearItems();
				
				if(DATATYPES.TO(_p.g[c])){
					for(i = 0; i < _p.g[c].length; i++){
						o = _p.g[c][i];
						if(_s.page_hashing && o.data && o.data.id && _p.request_hash[o.data.id])
							_p.s[o.data.id]=0;
							
			
						t.addItem(o.name, o.data);
					}
					/*
					if(t.getCanMoveNext()) t.addItem("more ...","_more");
					*/
				}
				else{
					t.addItem("Paging Error at Page #" + c,"_avoid");
				}
				/*_synchronize_result_options();*/
			};

			/// <method internal = "1" private = "1">
			/// <name>_addItem</name>
			/// <param name = "n" type = "String">Name of the item.  The name is used for the label.</param>
			/// <param name = "d" type = "variant" optional = "1">The value of the item.</param>
			/// <description>Creates and renders a WideSelectItem object.</description>
			/// </method>
			n._addItem=function(s,d){
				var t=this,e,i=HemiEngine.guid(),v,l,_p,_s;
				_s = t.properties;
				_p = t.objects;
				l = _p.r.length;
				
				if(
					_s.maximum_items > 0
					&& l >= _s.maximum_items
				){
					if(_s.maximum_rollover){
						t.clearItem(0);
						l--;
					}
					else{
						return;
					}
				}
				
				e = document.createElement("div");
				_p.c.appendChild(e);
				e.className = _s.class_item;
				if(
					(DATATYPES.TS(d) && d != "_avoid")
					||
					(DATATYPES.TO(d) && d.value != "_avoid")
				){
					e.setAttribute("is-result-item","1");
				}

				e.setAttribute("rid",i);
				/*e.appendChild(document.createTextNode(s));*/

				/* At the moment, wide select assumes and node references specified as the label are HTML nodes (the 7th param; 1)*/
				HemiEngine.xml.setInnerXHTML(e,s,0,0,0,0,1);


				v={
					name:s,
					data:d,
					object:e,
					id:i,
					index:l
				};
				
				_p.r[l] = v;
				_p.rh[i] =l;
				
				if(_s.auto_select) t.setActiveItem(l);
				if(_s.auto_scroll) t.scrollToItem(l);
			};

			/// <method internal = "1" private = "1">
			/// <name>_handle_mouseover</name>
			/// <param name = "e" type = "event">Event object</param>
			/// <description>Internal handler for mouseover event.</description>
			/// </method>
			n._handle_mouseover=function(v){
				var t=this,o,e,_p,_s, l;
				_s = t.properties;
				_p = t.objects;

				if(DATATYPES.TN(v))
					o=_p.r[v].object;
				
				else{
					e=HemiEngine.event.getEvent(v);
					o=(!DATATYPES.TU(v) && v.nodeType)?v:HemiEngine.event.getEventSource(v);
					if(o && o.nodeType==3) o=o.parentNode;
					l = o;
					while(l){
						/* don't use shorthand for .getAttribute or it will throw an error */
				 		if(typeof l.getAttribute != DATATYPES.TYPE_UNDEFINED && l.getAttribute("is-result-item")){
							o = l;
							break;
						}
						l = l.parentNode;
					}
				}
				if(
					o.getAttribute("is-result-item")
					&&
					((
						_s.multiple
						&&
						!_p.active_results[o.getAttribute("rid")]
					)
					||
					(
						!_s.multiple
						&&
						o != _p.active_item
					))
					&&		
					(
						!_s.is_paging
						||
						(_s.page_hashing && _p.s[_p.r[_p.rh[o.getAttribute("rid")]].data.id])
					)
				){
					o.className = _s.class_item + " " + _s.class_item_hover;
					/*"wideselect_item wideselect_item_hover";*/
				}
			};
			/// <method internal = "1" private = "1">
			/// <name>_handle_mouseout</name>
			/// <param name = "e" type = "event">Event object</param>
			/// <description>Internal handler for mouseout event.</description>
			/// </method>
			n._handle_mouseout=function(v){
				var t=this,o,e,_p,_s,l;
				_s = t.properties;
				_p = t.objects;
				e=HemiEngine.event.getEvent(v);
				o=(!DATATYPES.TU(v) && v.nodeType)?v:HemiEngine.event.getEventSource(v);
				if(o && o.nodeType==3) o=o.parentNode;
				l = o;
				while(l){
			 		if(typeof l.getAttribute != DATATYPES.TYPE_UNDEFINED && l.getAttribute("is-result-item")){
						o = l;
						break;
					}
					l = l.parentNode;
				}
				if(
					o.getAttribute("is-result-item")
					&&
					((
						_s.multiple
						&&
						!_p.active_results[o.getAttribute("rid")]
					)
					||
					(
						!_s.multiple
						&&
						o != _p.active_item
					))
			
					&&
					
					(
						!_s.is_paging
						||
						(_s.page_hashing && _p.s[_p.r[_p.rh[o.getAttribute("rid")]].data.id])
					)
					
				){
					o.className = _s.class_item;
					/*"wideselect_item";*/
				}
			};

			/// <method>
			/// <name>setActiveItem</name>
			/// <param name = "i" type = "integer">Index of WideSelectItem to activate.</param>
			/// <description>Selects the specified WideSelectItem .  Blocks publication of the <i>onresultclick</i> message.</description>
			/// </method>
			n.setActiveItem=function(i){
				this.selectItem(i,1);
			};

			/// <method>
			/// <name>selectItem</name>
			/// <param name = "i" type = "integer">Index of WideSelectItem to activate.</param>
			/// <param name = "b" type = "boolean" optional = "1">Bit indicating whether to block the <i>onresultclick</i> message.</param>
			/// <description>Selects the specified WideSelectItem.</description>
			/// </method>		
			n.selectItem=function(i,b){
				var t = this;
				if(t.objects.r[i] != null){
					t._handle_mouseover(i);
					t._handle_click(i,b);
					t.scrollToItem(i);
				}
			};
			
			/// <method>
			/// <name>scrollToItem</name>
			/// <param name = "i" type = "integer">Index of WideSelectItem to activate.</param>
			/// <description>Scrolls to control to the specified WideSelectItem.</description>
			/// </method>	
			n.scrollToItem=function(i){
				var t = this,c;
				c=t.objects;
				if(c.r[i]!=null){
					c.c.scrollTop=c.r[i].object.offsetTop;
				}
			};
			
			/// <method internal = "1" private = "1">
			/// <name>_handle_click</name>
			/// <param name = "v" type = "variant">Overloaded variant which may be an event or index.</param>
			/// <param name = "b" type = "boolean" optional = "1">Bit indicating whether the "onresultclick" message should be suppressed.</param>
			/// <description>Internal handler for mouseout event.</description>
			/// </method>
			n._handle_click=function(v,b){
				var t=this,o,e,_p,_s,l;
				_p = t.objects;
				_s = t.properties;
				if(DATATYPES.TN(v)){
					o = _p.r[v].object;
				}
				else{
					e=HemiEngine.event.getEvent(v);
					o=(!DATATYPES.TU(v) && v.nodeType)?v:HemiEngine.event.getEventSource(v);
					if(o && o.nodeType==3) o=o.parentNode;
					l = o;
					while(l){
				 		if(typeof l.getAttribute != DATATYPES.TYPE_UNDEFINED && l.getAttribute("is-result-item")){
							o = l;
							break;
						}
						l = l.parentNode;
					}
				}
		
				if(
					o.getAttribute("is-result-item")
					&&
					(
						!_s.is_paging
						||
						(_s.page_hashing && _p.s[_p.r[_p.rh[o.getAttribute("rid")]].data.id])
					)	
				){
					/*if(o == _p.active_item){*/
					if(
						(
							_s.multiple
							&&
							_p.active_results[o.getAttribute("rid")]
						)
						||
						(
							!_s.multiple
							&&
							o == _p.active_item
						)
					){

						_p.active_results[o.getAttribute("rid")] = 0;
						_p.active_item = null;
						o.className = _s.class_item + " " + _s.class_item_hover;
						/*"wideselect_item wideselect_item_hover";*/
						return;
					}

					if(!_s.multiple && _p.active_item != null){
						_p.active_item.className= _s.class_item;
						_p.active_results[_p.active_item.getAttribute("rid")] = 0;
					}

					_p.active_item = o;
					_p.active_results[o.getAttribute("rid")] = 1;
					o.className = _s.class_item + " " + _s.class_item_active;
					/*"wideselect_item wideselect_item_active";*/

					if(!b){
						HemiEngine.message.service.publish("onresultclick",t);
						if(DATATYPES.TF(_p.h)) _p.h("onresultclick",_p.r[_p.rh[o.getAttribute("rid")]]);
					}
				}
			};
			
			/// <method>
			/// <name>clearItem</name>
			/// <param name = "i" type = "integer">Index of WideSelectItem to remove.</param>
			/// <description>Removes the specified WideSelectItem.</description>
			/// </method>
			n.clearItem=function(i){
				var t=this,o,c,d,_p,x;
				_p = t.objects;
				o=_p.r[i];
				if(o){
					d=o.id;
					if(
						(
							t.properties.multiple
							&&
							_p.active_results[d]
						)
						||
						(
							!t.properties.multiple
							&&
							o != _p.active_item
						)
					){
						_p.active_item=null;
						_p.active_results[d] = 0;
					}
	/*				if(o.object == c.status.a) c.status.a=null;*/
					_p.rh[d] = null;

					o = o.object;
					_p.c.removeChild(o);
					_p.r.splice(i,1);

					/* correct the object indices */
			
					for(x=i;x<_p.r.length;x++){
						_p.r[x].index = x;
						_p.rh[_p.r[x].id] = x;
					}

				}

			};

			/// <method>
			/// <name>clearItems</name>
			/// <description>Removes all WideSelectItem objects.</description>
			/// </method>
			n.clearItems=function(){
				var t=this,c,a,i,_p;
				_p = t.objects;
				_p.active_item = null;
				_p.r = [];
				_p.rh = [];
				t.properties.m = 0;
				_p.b=[];
				a = _p.c.childNodes;
				for(i = a.length - 1;i >= 0;i--){
					_p.c.removeChild(a[i]);
				}
			};

			/// <method>
			/// <name>clearPagingValues</name>
			/// <description>Removes all paged WideSelectItem objects.</description>
			/// </method>
			n.clearPagingValues = function(){
				var _s = this.properties,_p = this.objects;
			
				_s.current_page=0;
				_s.maximum_page_size=0;
				_s.page_mark=0;
				_s.page_stop = 0;
				_p.g = [];
				_p.s = [];
				_p.request_hash = [];
			};
			
			/// <method>
			/// <name>reset</name>
			/// <description>Clears both paged and non-paged WideSelectItem objects, and ends any active request.</description>
			/// </method>
			n.reset = function(){
				var t = this;
				/* end any active request; this only applies if request was first invoked on an object */
				t.endRequest();
				/* clear out the result list */
				t.clearItems();
				/* clear out any  paged values */
				t.clearPagingValues();
			};

			/// <method>
			/// <name>moveFirst</name>
			/// <description>Moves the paginated result set to the first page.  Invokes any specified <i>handle_pagenavigate</i> handler.</description>
			/// </method>
			n.moveFirst = function(){
				var _p = this.objects,_s = this.properties;
				_s.current_page = 0;
				this.updatePage();
				if(DATATYPES.TF(_p.ph)) _p.ph("onpagenavigate",_s.current_page);
			};

			/// <method>
			/// <name>moveLast</name>
			/// <description>Moves the paginated result set to the last page.  Invokes any specified <i>handle_pagenavigate</i> handler.</description>
			/// </method>
			n.moveLast = function(){
				var _s = this.properties, _p = this.objects;
				if(_s.page_stop){
					_s.current_page = _s.maximum_page_size;
					this.updatePage();
					if(DATATYPES.TF(_p.ph)) _p.ph("onpagenavigate",_s.current_page);
				}
			};

			/// <method>
			/// <name>getCanMoveNext</name>
			/// <return-value name = "b" type = "boolean">Bit indicating whether there is an additional page.</return-value>
			/// <description>Checks whether there is an additional page beyond the current.</description>
			/// </method>
			n.getCanMoveNext = function(){
				return this.moveNext(1);
			};

			/// <method>
			/// <name>getCanMovePrevious</name>
			/// <return-value name = "b" type = "boolean">Bit indicating whether there is a previous page.</return-value>
			/// <description>Checks whether there is a previous page prior to the current.</description>
			/// </method>
			n.getCanMovePrevious = function(){
				return this.movePrevious(1);
			};
			/// <method>
			/// <name>moveNext</name>
			/// <param name = "b" type = "boolean" option = "1">Bit indicating whether the operation is a test.</param>
			/// <description>Moves the paginated result set to the next page.  Invokes any specified <i>handle_pagenavigate</i> handler.</description>
			/// </method>
			n.moveNext = function(b){
				/* b = toggle to only evaluate the check */
				var _s = this.properties, _p = this.objects;
				if(
					(_s.current_page + 1) < _s.maximum_page_size
					||
					(_s.page_stop && (_s.current_page + 1) == _s.maximum_page_size)
				){
					if(!b){
						_s.current_page++;
						this.updatePage();
						if(DATATYPES.TF(_p.ph)) _p.ph("onpagenavigate",_s.current_page);
					}
					return 1;
				}
	/*
				/ * Get more data * /
				else if(!_s.page_stop){
					_s.current_page++;
				}
	*/
				return 0;
			};
			
			/// <method>
			/// <name>movePrevious</name>
			/// <param name = "b" type = "boolean" option = "1">Bit indicating whether the operation is a test.</param>
			/// <description>Moves the paginated result set to the previous page.  Invokes any specified <i>handle_pagenavigate</i> handler.</description>
			/// </method>
			n.movePrevious = function(b){
				/* b = toggle to only evaluate the check */
				var _s = this.properties,_p = this.objects;
				if((_s.current_page - 1) >= 0 && DATATYPES.TO(_p.g[_s.current_page - 1])){
					if(!b){
						_s.current_page--;
						this.updatePage();
						if(DATATYPES.TF(_p.ph)) _p.ph("onpagenavigate",_s.current_page);
					}
					return 1;
				}
				return 0;
			};

			/// <method>
			/// <name>importPageItems</name>
			/// <param name = "a" type = "Array">Array of ImportPageItem objects.</param>
			/// <param name = "b" type = "boolean" option = "1">Bit indicating whether this is the last page.</param>
			/// <description>Imports a variant-length array of data into the paginated set of WideSelectItem objects.</description>
			/// </method>
			n.importPageItems = function(a, b){
			/*
				XXX i = request id
				a = array of objects with the construct:
					{
						label:label (display name for the control)
						id:id (opt - used for page hashing)
						value:value (opt)
					}
					
				b = toggle to indicate that this is the last set of items
			*/
			
				if(!DATATYPES.TO(a)) return 0;
			
				var n,
					c = 0,
					_s = this.properties,
					v,
					z,
					s,
					l,
					_p = this.objects,
					/* r = result count */
					r = a.length,
					t = this
				;
			
			
				if(r == 0){
					/* only add the zero label if there really are no items at all */
					if(_p.r.length == 0 && _p.g.length == 0){
						if(_s.is_paging)
							t.pageItem("Zero Items","_avoid");
						else
							t.addItem("Zero Items","_avoid");
					}
				}
				else{
			
					s = _s.page_mark;
					l = _s.maximum_page_items;
				
					for(z=0; z < a.length; z++){
						n = a[z];
						c++;
				
						if(_s.is_paging) t.pageItem(n.label,n);
						else t.addItem(n.label,n);
			
					}
					_s.page_mark += _s.maximum_page_items;
				}
			
				if(c < _s.maximum_page_items || b)
					_s.page_stop = 1;
						
				if(_s.is_paging) 
					t.updatePage();
			
			};
			

			
			/// <method>
			/// <name>request</name>
			/// <description>If requesting is enabled, displays and positions the WideSelectInstance control.</description>
			/// </method>
			n.request = function(o){
				var t = this,_s,b=0;
				if( (b = HemiEngine.ui.util.request(this, o, t.objects.c)) && t.properties.is_paging) t.updatePage();
				return b;
				

			};

			/// <method>
			/// <name>endRequest</name>
			/// <description>Hides the WideSelectInstance control if requested.</description>
			/// </method>
			n.endRequest = function(){
				return HemiEngine.ui.util.endRequest(this, this.objects.c);
			};
			
			/// <method>
			/// <name>alignControl</name>
			/// <param name = "o" type = "HTMLNode">HTML Node to which the control should be aligned.</param>
			/// <description>Aligns the WideSelectInstance to the bottom border of the specified HTML Node.</description>
			/// </method>
			n.alignControl = function(o){
				var
					/* document width */
					/*p_w = document.documentElement.offsetWidth,*/
					/* document height */
					/*p_h = document.documentElement.offsetHeight,*/
					/* request object width */
					w = o.offsetWidth,
					/* request object height */
					h = o.offsetHeight,
					/* request object left */
					l = HemiEngine.css.getAbsoluteLeft(o),
					/* request object top */
					t = HemiEngine.css.getAbsoluteTop(o),
					/* main control width */
					c_w,
					/* main control height */
					c_h,
					/* rr_w = remaining right width */
					/*rr_w,*/
					/* rl_w = remaining left width */
					/*rl_w,*/
					_p = this.objects,
					_s = this.properties

				;

				_p.c.style.display = "block";

				c_w = _p.c.offsetWidth;
				c_h = _p.c.offsetHeight;	
				
				/* don't care about top position right now, it's adjacent */
				_p.c.style.top = (t + h) + "px";
				_p.c.style.left = l + "px";
			
			};
			
			n.init();

			HemiEngine.registry.service.addObject(n);

			return n;
		}
	});
}());
/// </class>
/// </package>
/// </source>
