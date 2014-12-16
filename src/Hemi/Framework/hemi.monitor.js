/// <source>
/// <name>Hemi.monitor</name>
/// <project>
/// 	<name>Hemi JavaScript Framework</name>
/// 	<url-title>Hemi JavaScript Framework</url-title>
/// 	<url>/Hemi/</url>
/// </project>
///
/// <package>
///		<path>Hemi.monitor</path>
///		<library>Hemi</library>
///		<description>The Monitor service provides a passive client-side monitor framework. Monitors collect and aggregate data per page view and send that data to a server for Web analytics processing.  The Account Manager 4 project includes a reference implementation.</description>
/*
	Raccoon Customer Experience Monitor
	Development version.
	Copyright 2005, All Rights Reserved.
	
	Using Engine for Web Applications framework.
	Copyright 2002 - 2005, All Rights Reserved.
			
	Author: Stephen W. Cote
	Email: sw.cote@gmail.com
*/

/// <static-class>
///		<name>service</name>
///		<description>Static instance of serviceImpl</description>
///		<version>%FILE_VERSION%</version>
/// </static-class>
/// <class>
///		<name>Monitor</name>
///		<description>An object registerer with the <i>ObjectRegistry</i>, that defines an <i>initializeMonitor</i> method, and that may define any <i>handle_{event name}</i> method listed for the MonitorService.  The <i>initializeMonitor</i> method must return true for the object to be treated as a monitor and receive event notifications and intervall callbacks.</description>
///		<version>%FILE_VERSION%</version>
/// 		<example implementation="1">
///			<name>Example Monitor #1</name>
///			<description>Demonstrate how to create and register a basic monitor object.</description>
///			<code>var oMonitor = {</code>
///			<code>   handle_window_load:function(){</code>
///			<code>   },</code>
///			<code>   // Required by MonitorService</code>
///			<code>   initializeMonitor:function(){</code>
///			<code>      // must return true for monitoring to be enabled;</code>
///			<code>      return 1;</code>
///			<code>   }</code>
///			<code>};</code>
///			<code>// important to prepare object so 1) it can be registered, and 2) add it to the ObjectRegistry</code>
///			<code>Hemi.prepareObject("MyMonitor","1.0",true,oMonitor);</code>
///			<code>// add the monitor object</code>
///			<code>Hemi.monitor.service.addMonitor(oMonitor);</code>
///		</example>
/// 		<example>
///			<name>Example Monitor #2</name>
///			<description>Demonstrate alternate method to create and register a basic monitor object, and include inline configuration for the monitor.</description>
///			<code>function Monitor(){</code>
///			<code>}</code>
///			<code>Monitor.prototype.initializeMonitor = function(){</code>
///			<code>   alert("Access configuration value: " + this.getConfigKey("myprop"));</code>
///			<code>   // must return true for monitoring to be enabled;</code>
///			<code>   return 1;</code>
///			<code>}</code>
///			<code>var oMonitor = new Monitor();</code>
///			<code>// important to prepare object so it can be registered; skip auto-registering for this demonstration.</code>
///			<code>Hemi.prepareObject("MyMonitor","1.0",false,oMonitor");</code>
///			<code>// Add object to the registry.  It must be registered in order to be added as a monitor.</code>
///			<code>Hemi.registry.service.addObject(oMonitor);</code>
///			<code><![CDATA[Hemi.monitor.service.addMonitor(oMonitor,"myprop:myval&myprop2:myval2");]]></code>
///		</example>
///		<example>
///			<name>Example Monitor #3</name>
///			<description>Demonstrate how to create and register a monitor using an ApplicationComponent.</description>
///			<code><![CDATA[<!-- XML Component File -->]]></code>
///			<code><![CDATA[<application-components>]]></code>
///			<code><![CDATA[   <application-component id = "demo_monitor">]]></code>
///			<code>      <![CDATA[<![]]>CDATA[</code>
///			<code>         component_init:function(){</code>
///			<code>           Hemi.monitor.service.addMonitor(this);</code>
///			<code>         },</code>
///			<code>         initializeMonitor:function(){</code>
///			<code>            return true;</code>
///			<code>         },</code>
///			<code>         handle_window_load:function(e){</code>
///			<code>            alert("window load via monitor service");</code>
///			<code>         }</code>
///			<code>      ]]<![CDATA[>]]></code>
///			<code><![CDATA[   </application-component>]]></code>
///			<code><![CDATA[</application-components>]]></code>
///			<code><![CDATA[<!-- HTML Page -->]]></code>
///			<code><![CDATA[<script type = "text/javascript">]]></code>
///			<code>var oComponent = Hemi.app.comp.newInstance();</code>
///			<code>oComponent.loadComponent("demo_monitor","/path/to/file.xml");</code>
///			<code><![CDATA[</script>]]></code>
///		</example>
///		<method>
///			<name>getMonitorService</name>
///			<description>Returns the MonitorService to which this Monitor is registered.</description>
///			<return-value name = "m" type = "MonitorServiceImpl">A MonitorService implementation.</return-value>
///		</method>
///		<method>
///			<name>getConfigKeys</name>
///			<description>Returns the <i>config_keys</i> hash.</description>
///			<return-value name= "c" type = "hash">Returns the hash containing the parsed inline configuration name/value pairs.</return-value>
///		</method>
///		<method>
///			<name>getConfigKey</name>
///			<param name = "c" type = "String">Name of a config key.</param>
///			<return-value name = "v" type = "variant">Returns the String or int value for the corresponding key.</return-value>
///		</method>
///		<method virtual = "1">
///			<name>initializeMonitor</name>
///			<return-value type = "boolean" name = "b">True if the object initialized and should be treated as a monitor, false if the object should be ignored.</return-value>
///			<description>Invoked by <i>addMonitor</i> if the object met the basic criteria for participating in the MonitorService: it must be registered, and it must define this method.  Returns true if the object was initialized, false otherwise.  If returning false, the object will not be treated as monitor and receive no notifications or callbacks.   Whether this returns true or false, the object will continue to define the members set when <i>addMonitor</i> was invoked.</description>
///		</method>
///
///		<method virtual="1">
///			<name>doInterval</name>
///			<description>Invoked by MonitorService <i>doInterval</i>.  By default, this is invoked every one second.  Each monitor can conttrol participating in the interval by setting the <i>can_interval</i> property to true or false, and can increase delay by setting the <i>interval_offset</i> property to the number of whole seconds that should elapse before doInterval is invoked again.  The <i>interval_offset</i> is used as a degrading counter, so each monitor is responsible for setting its own delay after each invocation of doInterval.</description>
///		</method>
///		<method virtual = "1">
///			<name>handle_select_change</name>
///			<description>Invoked by MonitorService <i>dispatchEvent</i> to  delegate the  select change event.</description>
///			<param name = "e" type = "event">Event object raised for this event notification.</param>
///		</method>
///		<method virtual = "1">
///			<name>handle_form_submit</name>
///			<description>Invoked by MonitorService <i>dispatchEvent</i> to  delegate the  form submit event.</description>
///			<param name = "e" type = "event">Event object raised for this event notification.</param>
///		</method>	
///		<method virtual = "1">
///			<name>handle_form_reset</name>
///			<description>Invoked by MonitorService <i>dispatchEvent</i> to  delegate the  form reset event.</description>
///			<param name = "e" type = "event">Event object raised for this event notification.</param>
///		</method>	
///		<method virtual = "1">
///			<name>handle_window_resize</name>
///			<description>Invoked by MonitorService <i>dispatchEvent</i> to  delegate the  window resize event.</description>
///			<param name = "e" type = "event">Event object raised for this event notification.</param>
///		</method>	
///		<method virtual = "1">
///			<name>handle_window_keydown</name>
///			<description>Invoked by MonitorService <i>dispatchEvent</i> to  delegate the  window keydown event.</description>
///			<param name = "e" type = "event">Event object raised for this event notification.</param>
///		</method>
///		<method virtual = "1">
///			<name>handle_input_blur</name>
///			<description>Invoked by MonitorService <i>dispatchEvent</i> to  delegate the  input blur event.</description>
///			<param name = "e" type = "event">Event object raised for this event notification.</param>
///		</method>
///		<method virtual = "1">
///			<name>handle_input_focus</name>
///			<description>Invoked by MonitorService <i>dispatchEvent</i> to  delegate the  input focus event.</description>
///			<param name = "e" type = "event">Event object raised for this event notification.</param>
///		</method>
///		<method virtual = "1">
///			<name>handle_window_blur</name>
///			<description>Invoked by MonitorService <i>dispatchEvent</i> to  delegate the  window blur event.</description>
///			<param name = "e" type = "event">Event object raised for this event notification.</param>
///		</method>	
///		<method virtual = "1">
///			<name>handle_window_focus</name>
///			<description>Invoked by MonitorService <i>dispatchEvent</i> to  delegate the  window focus event.</description>
///			<param name = "e" type = "event">Event object raised for this event notification.</param>
///		</method>	
///		<method virtual = "1">
///			<name>handle_document_scroll</name>
///			<description>Invoked by MonitorService <i>dispatchEvent</i> to  delegate the  document scroll event.</description>
///			<param name = "e" type = "event">Event object raised for this event notification.</param>
///		</method>
///		<method virtual = "1">
///			<name>handle_mouse_move</name>
///			<description>Invoked by MonitorService <i>dispatchEvent</i> to  delegate the  mouse move event.</description>
///			<param name = "e" type = "event">Event object raised for this event notification.</param>
///		</method>
///		<method virtual = "1">
///			<name>handle_mouse_click</name>
///			<description>Invoked by MonitorService <i>dispatchEvent</i> to  delegate the  mouse click event.</description>
///			<param name = "e" type = "event">Event object raised for this event notification.</param>
///		</method>
///		<method virtual = "1">
///			<name>handle_window_error</name>
///			<description>Invoked by MonitorService <i>dispatchEvent</i> to  delegate the  error event. TODO: need to fix handler parameters. At the moment, error information is not being passed.</description>
///			<param name = "e" type = "event">Event object raised for this event notification.</param>
///		</method>
///		<method virtual = "1">
///			<name>handle_context_menu</name>
///			<description>Invoked by MonitorService <i>dispatchEvent</i> to  delegate the  contextmenu event.</description>
///			<param name = "e" type = "event">Event object raised for this event notification.</param>
///		</method>	
///		<method virtual = "1">
///			<name>handle_window_unload</name>
///			<description>Invoked by MonitorService <i>dispatchEvent</i> to  delegate the  unload event.</description>
///			<param name = "e" type = "event">Event object raised for this event notification.</param>
///		</method>
///		<method virtual = "1">
///			<name>handle_window_beforeunload</name>
///			<description>Invoked by MonitorService <i>dispatchEvent</i> to  delegate the  beforeunload event.</description>
///			<param name = "e" type = "event">Event object raised for this event notification.</param>
///		</method>
///		<method virtual = "1">
///			<name>handle_window_load</name>
///			<description>Invoked by MonitorService <i>dispatchEvent</i> to  delegate the  load event and binds elements to internal handlers.  Dispatches <i>window_load</i> to monitors.</description>
///			<param name = "e" type = "event">Event object raised for this event notification.</param>
///		</method>	
/// </class>
/// <class>
///		<name>MonitorServiceImpl</name>
///		<description>A base class for creating beacon and XML transponders for monitoring Web pages.</description>
///		<version>%FILE_VERSION%</version>
(function () {
	HemiEngine.include("hemi.event");
	HemiEngine.include("hemi.util");
	HemiEngine.include("hemi.util.logger");
	HemiEngine.namespace("monitor", HemiEngine, {
		service: null,
		serviceImpl: function () {
			var t = this;
			t.object_type = "MonitorService";
			t.object_version = "%FILE_VERSION%";
			t.object_id = "monitor_service_1";
			t.ready_state = 0;

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
			/// <method>
			/// <name>getStatus</name>
			/// <return-value name = "o" type = "object">The object_config.status substructure.</return-value>
			/// <description>Returns the object_config.status sub structure.</description>
			/// </method>
			///
			/// <method>
			/// <name>getPointers</name>
			/// <return-value name = "o" type = "object">The object_config.pointers substructure.</return-value>
			/// <description>Returns the object_config.pointers sub structure.</description>
			/// </method>
			///

			t.objects = {
				monitors: [],
				context_object: 0
			};
			t.cookies = {};
			t.properties = {
				/*
				1 = uninitialized
				2 = window not loaded
				3 = window loaded
				4 = window before unload
				5 = window unload
				*/
				context_id: 0,
				delay: 1000,
				session_name: "MSESS_ID",
				document_rendered: 0,
				hashed_cookies: 0,
				window_interval: 0,
				can_interval: 1,
				window_state: 0,
				application_id: 0,
				dataset_id: 0,
				last_image_index: 0
			};

			///		<method>
			///			<name>getContextObject</name>
			///			<return-value name = "d" type = "DOMNode">The context node in which monitoring is to take place.</return-value>
			///			<description>Returns the object in which all monitoring should take place.    Defaults to <i>document</i>.  Can be specified by setting the global <i>CONTEXT_OBJECT</i> variable to a different object prior to loading the MonitorService.</description>
			///		</method>
			t.getContextObject = function () {
				return t.objects.context_object;
			};

			///		<method>
			///			<name>getDatasetId</name>
			///			<return-value name = "d" type = "String">Identifier representing the type of data being collected.</return-value>
			///			<description>Returns the identifier used to describe the data being collected.  Defaults to <i>public</i>.  Can be specified by defining the global <i>DATASET_ID</i> variable to a custom value. </description>
			///		</method>
			t.getDatasetId = function () {
				return t.properties.dataset_id;
			};

			///		<method>
			///			<name>getDatasetId</name>
			///			<return-value name = "b" type = "boolean">Bit indicating whether the document has loaded and, under normal circumstances, whether it is rendered.</return-value>
			///			<description>Returns true if the document has loaded, false otherwise.</description>
			///		</method>
			t.getDocumentRendered = function () {
				return t.properties.document_rendered;
			};

			///		<method>
			///			<name>getWindowState</name>
			///			<return-value name = "i" type = "int">The current state of the browser window.</return-value>
			///			<description>Returns an int representing the current state of the browser window.  0 = unknown, 1 = uninitialized, 2 = window not loaded, 3 = window loaded, 4 = window before unload, 5 = window unload</description>
			///		</method>
			t.getWindowState = function () {
				return t.properties.window_state;
			};

			///		<method>
			///			<name>getSessionId</name>
			///			<return-value name = "s" type = "String">String indicating the application session identifier.</return-value>
			///			<description>Returns the session id based on the pre-configured session cookie name. By default, the MonitorService ships with <i>MONITOR_SESSION_ID</i>, and the value is auto-generated.  To use a different cookie name, the SDK must be used to alter the build configuration.  TODO: Add support for configurable names at runtime.</description>
			///		</method>
			t.getSessionId = function () {
				return t.cookies[t.properties.session_name];
			};

			///		<method>
			///			<name>getApplicationId</name>
			///			<return-value name = "s" type = "String">String indicating the application identifier.</return-value>
			///			<description>Returns the application id.  Defaults to <i>Global</i>. Can be specified by defining the global <i>APPLICATION_ID</i> variable to a custom value.</description>
			///		</method>
			t.getApplicationId = function () {
				return t.properties.application_id;
			};

			///		<method>
			///			<name>getContextId</name>
			///			<return-value name = "s" type = "String">Light hash of the current Web page location plus a few random numbers.</return-value>
			///			<description>Returns a light hash of the current page location plus a few random numbers to uniquely identify the current page visit from other pages visits by this particular session.  This value only has to be unique in relation to other context_ids for the session id.</description>
			///		</method>
			t.getContextId = function () {
				return t.properties.context_id;
			};

			///		<method>
			///			<name>hashCookie</name>
			///			<param name = "n" type = "String" optional = "1">Name of a specific cookie value to hash and promote its values into the main hash of cookie values.</param>
			///			<param name = "b" type = "boolean" optional = "1">Bit indicating whether to hash embedded cookie values using the specified value name.</param>
			///			<param name = "f" type = "boolean" optional = "1">Bit indicating to hash the cookie and ignore whether the cookie was previously hashed.  By default, the cookie may only be hashed once per page view.</param>
			///			<description><![CDATA[Hashes the document cookies into the <i>cookies</i> hash, where the default cookie structure of most browsers is: <i>name=value; name2=value2</i>.  Optionally hashes embedded cookie values that use the following syntax: <i>subname:subvalue&subname2:subvalue2</i>.  For example: <i>name=subname:subvalue; name2=subname2:subvalue2&subname3:subvalue3</i>]]></description>
			///		</method>
			t.hashCookie = function (n, b, s) {
				var c = t.properties, k = t.cookies;
				if (!c.hashed_cookies++ || s)
					t.hashValue(document.cookie, ";", "=", k);

				/*
				Hash a specific cookie value
				This will take a sub-hash from a cookie and move the values
				up one level.
				*/
				if (b && DATATYPES.TS(k[n]))
					t.hashValue(k[n], "&", ":", k);
			};

			///		<method internal = "1">
			///			<name>hashValue</name>
			///			<param name = "c" type = "String">The value to be hashed (eg: name=value; name2=value2).</param>
			///			<param name = "d" type = "String">The delimiter of the value (eg: ;).</param>
			///			<param name = "s" type = "String">The name/value assignment operator (eg: =).</param>
			///			<param name = "k" type = "object">Object hash into which the retrieved name and value pairs will be applied.</param>
			///			<description><![CDATA[Hashes the value into the specified hash, using the specified delimiters, such as: <i>name=value; name2=value2</i>.]]></description>
			///		</method>	
			t.hashValue = function (c, d, s, k) {
				if (c) {
					var j = 0,
						l,
						a = c.split(d),
						f = eval("/\\s*([^\\s" + s + "]+)" + s + "(.+)\\s*/")
					;
					for (; a && j < a.length; ) {
						l = a[j++].match(f);
						if (l)
							k[l[1]] = l[2].match(/^\d+$/) ? parseInt(l[2]) : l[2];  /* use this to convert all #s to actual # objects*/
					}
				}
			};


			t.G = function (n) {

				return t.objects.context_object.getElementsByTagName(n);

			};

			///		<method private = "1" internal = "1">
			///			<name>doInterval</name>
			///			<description>A an interval (one second / one thousand milliseconds) that invokes the <i>doInterval</i> method on Monitor instances that set the <i>can_interval</i> property to true.  Monitors can increase delay by setting the <i>interval_offset</i> property to the number of seconds that should elapse before doInterval is invoked again.  The <i>interval_offset</i> is used as a degrading counter, so each monitor is responsible for setting its own delay after each invocation of doInterval.</description>
			///		</method>	
			t.doInterval = function () {

				var m = t.objects.monitors, c = t.properties, i = 0, l, o, z;
				l = m.length;
				for (; i < l; ) {
					o = m[i++];
					if (!o) continue;
					z = o.properties;
					if (DATATYPES.TF(o.doInterval) && z.can_interval) {
						if (z.interval_offset <= 0) z.interval_offset = 1;
						z.interval_offset--;
						/* individual monitors can override the interval offset to increase the delay between invocation */
						/*
						only invoke the interal if the offset is 0.
						the monitor is responsible for bumping it back up if a delay is desired
						*/
						if (z.interval_offset <= 0) o.doInterval();
					}
				}
				c.window_interval = window.setTimeout(t.handle_window_interval, c.delay);
				return 1;
			};

			///		<method private = "1" internal = "1">
			///			<name>handle_window_interval</name>
			///			<description>Handler that manages the interval thread.  Note: this doesn't use the ThreadService, though probably should.</description>
			///		</method>	
			t.handle_window_interval = function () {
				var c = t.properties;

				/* if unloading */
				if (c.window_state > 3) {
					window.clearTimeout(c.window_interval);
					c.window_interval = 0;
					return;
				}
				if (!c.can_interval) return;

				if (c.can_interval)
					if (!t.doInterval()) {
						window.clearTimeout(c.window_interval);
						c.window_interval = 0;
						c.can_interval = 0;
					}
			};

			///		<method private = "1" internal = "1">
			///			<name>handle_document_stop</name>
			///			<description>Handler that manages the stop event.  Dispatches <i>document_stop</i> to monitors.</description>
			///		</method>
			t.handle_document_stop = function (e) {
				t.dispatchEvent("document_stop", e);
			};

			///		<method private = "1" internal = "1">
			///			<name>handle_window_load</name>
			///			<description>Handler that manages the load event and binds elements to internal handlers.  Dispatches <i>window_load</i> to monitors.</description>
			///		</method>
			t.handle_window_load = function (e) {
				var c = t.properties;
				if (c.window_state >= 3) return;
				t.bindElements();
				c.window_state = 3;
				c.document_rendered = 1;
				t.dispatchEvent("window_load", e);

			};

			///		<method private = "1" internal = "1">
			///			<name>handle_window_beforeunload</name>
			///			<description>Handler that manages the beforeunload event.  Dispatches <i>window_beforeunload</i> to monitors.</description>
			///		</method>
			t.handle_window_beforeunload = function (e) {
				t.dispatchEvent("window_beforeunload", e);
				t.properties.window_state = 4;
				/*t.properties.document_rendered = 0;*/
			};

			///		<method private = "1" internal = "1">
			///			<name>handle_window_unload</name>
			///			<description>Handler that manages the unload event.  Dispatches <i>window_unload</i> to monitors.</description>
			///		</method>	
			t.handle_window_unload = function (e, bPub) {
				var c = t.properties;

				/* Validate the current context */
				/* don't try using DATATYPES here because it may not be loaded anymore */
				if (!Hemi || typeof Hemi.include != "function") return;
				if (t.ready_state == 4) {

					t.ready_state = 4.5;
					c.window_state = 5;
					t.dispatchEvent("window_unload", e);
					c.document_rendered = 0;
					/* cleanup */
					t.bindElements(1);
					t.bindObjects(1);
					t.ImageProbe(1);
				}
				/* end action */
				t.ready_state = 5;
			};
			t.destroy = function (bPub) {
				this.handle_window_unload(0, 1);
			};

			///		<method private = "1" internal = "1">
			///			<name>dispatchEvent</name>
			///			<param name = "s" type = "String">Event key, such is <i>window_load</i> or <i>window_unload</i>.</param>
			///			<param name = "e" type = "object">Event object.</param>
			///			<description>Dispatches event notifications to Monitor instances that define a function named <i>handle_{event key}</i>, such as <i>handle_window_load</i>. The event object is passed as the only parameter. NOTES: should we bother with cancelling events?  These are monitors, which shouldn't be tampering with anything.</description>
			///		</method>	
			t.dispatchEvent = function (s, e, p2, p3) {
				/*
				s = event key (eg: window_load)
				e = event object
				*/
				var m = t.objects.monitors, i = 0, l, o, n;
				n = "handle_" + s;
				l = m.length;
				for (; i < l; ) {
					o = m[i++];
					/* use string for datatype; the object may no longer be defined */
					if (o && typeof o[n] == "function")
						o[n](e, p2, p3);

				}
			};

			///		<method private = "1" internal = "1">
			///			<name>initializeMonitorService</name>
			///			<description>Starts the MonitorService.  This is automatically invoke when a MonitorService instance is created.</description>
			///		</method>	
			t.initializeMonitorService = function () {
				if (t.ready_state) return 0;
				var 
				d = document, w = window, c = t.properties, o = t.cookies, p = t.objects;
				t.ready_state = 2;

				/* don't use shorthand for typecheck because the variable isn't named in this scope */
				c.application_id = (typeof APPLICATION_ID != DATATYPES.TYPE_UNDEFINED) ? APPLICATION_ID : "Global";
				c.dataset_id = (typeof DATASET_ID != DATATYPES.TYPE_UNDEFINED ? DATASET_ID : "public");
				p.context_object = (typeof CONTEXT_OBJECT != DATATYPES.TYPE_UNDEFINED ? CONTEXT_OBJECT : document);

				/* Hash-up the cookies */
				t.hashCookie();

				c.context_id = HemiEngine.guid();

				/* Create Session ID if needed */
				if (!o[c.session_name]) {
					o[c.session_name] = c.context_id;
					d.cookie = c.session_name + "=" + o[c.session_name] + ";";
				}
				t.bindObjects();
				t.ImageProbe();
				t.ready_state = 4;
				t.doInterval();
				t.log("Initialized");
			};

			///		<method private = "1" internal = "1">
			///			<name>handle_context_menu</name>
			///			<description>Handler that manages the contextmenu event.  Dispatches <i>context_menu</i> to monitors.</description>
			///		</method>	
			t.handle_context_menu = function (e) {
				t.dispatchEvent("context_menu", e);
			};

			///		<method private = "1" internal = "1">
			///			<name>handle_window_error</name>
			///			<description>Handler that manages the error event.  Dispatches <i>window_error</i> to monitors.  TODO: need to fix handler parameters. At the moment, error information is not being passed.</description>
			///		</method>	
			t.handle_window_error = function (m, u, l) {
				t.dispatchEvent("window_error", m, u, l);
				if (typeof window.ph_error == DATATYPES.TYPE_FUNCTION)
					return window.ph_error.apply(window, arguments);
			};

			///		<method private = "1" internal = "1">
			///			<name>handle_mouse_click</name>
			///			<description>Handler that manages the mouse click event.  Dispatches <i>mouse_click</i> to monitors.</description>
			///		</method>	
			t.handle_mouse_click = function (e) {
				t.dispatchEvent("mouse_click", e);
			};

			///		<method private = "1" internal = "1">
			///			<name>handle_mouse_move</name>
			///			<description>Handler that manages the mouse move event.  Dispatches <i>mouse_move</i> to monitors.</description>
			///		</method>	
			t.handle_mouse_move = function (e) {
				t.dispatchEvent("mouse_move", e);
			};

			///		<method private = "1" internal = "1">
			///			<name>handle_document_scroll</name>
			///			<description>Handler that manages the document scroll event.  Dispatches <i>document_scroll</i> to monitors.</description>
			///		</method>	
			t.handle_document_scroll = function (e) {
				t.dispatchEvent("document_scroll", e);
			};

			///		<method private = "1" internal = "1">
			///			<name>handle_window_focus</name>
			///			<description>Handler that manages the window focus event.  Dispatches <i>window_focus</i> to monitors.</description>
			///		</method>	
			t.handle_window_focus = function (e) {
				t.dispatchEvent("window_focus", e);
			};

			///		<method private = "1" internal = "1">
			///			<name>handle_window_blur</name>
			///			<description>Handler that manages the window blur event.  Dispatches <i>window_blur</i> to monitors.</description>
			///		</method>	
			t.handle_window_blur = function (e) {
				t.dispatchEvent("window_blur", e);
			};

			///		<method private = "1" internal = "1">
			///			<name>handle_input_focus</name>
			///			<description>Handler that manages the input focus event.  Dispatches <i>input_focus</i> to monitors.</description>
			///		</method>	
			t.handle_input_focus = function (e) {
				t.dispatchEvent("input_focus", e);
			};

			///		<method private = "1" internal = "1">
			///			<name>handle_input_blur</name>
			///			<description>Handler that manages the input blur event.  Dispatches <i>input_blur</i> to monitors.</description>
			///		</method>	
			t.handle_input_blur = function (e) {
				t.dispatchEvent("input_blur", e);
			};

			///		<method private = "1" internal = "1">
			///			<name>handle_window_keydown</name>
			///			<description>Handler that manages the window keydown event.  Dispatches <i>window_keydown</i> to monitors.</description>
			///		</method>	
			t.handle_window_keydown = function (e) {
				t.dispatchEvent("window_keydown", e);
			};

			///		<method private = "1" internal = "1">
			///			<name>handle_window_resize</name>
			///			<description>Handler that manages the window resize event.  Dispatches <i>window_resize</i> to monitors.</description>
			///		</method>	
			t.handle_window_resize = function (e) {
				t.dispatchEvent("window_resize", e);
			};

			///		<method private = "1" internal = "1">
			///			<name>handle_form_submit</name>
			///			<description>Handler that manages the form submit event.  Dispatches <i>form_submit</i> to monitors.</description>
			///		</method>	
			t.handle_form_submit = function (e) {
				t.dispatchEvent("form_submit", e);
				var oF = HemiEngine.event.getEventSource(e);
				if (oF && oF.nodeType == 1 && typeof oF.ph_submit == DATATYPES.TYPE_FUNCTION)
					return oF.ph_submit.apply(oF, arguments);
			};

			///		<method private = "1" internal = "1">
			///			<name>handle_form_reset</name>
			///			<description>Handler that manages the form reset event.  Dispatches <i>form_reset</i> to monitors.</description>
			///		</method>	
			t.handle_form_reset = function (e) {
				t.dispatchEvent("form_reset", e);
				var oF = HemiEngine.event.getEventSource(e);
				if (oF && oF.nodeType == 1 && typeof oF.ph_reset == DATATYPES.TYPE_FUNCTION)
					return oF.ph_reset.apply(oF, arguments);
			};


			///		<method private = "1" internal = "1">
			///			<name>handle_select_change</name>
			///			<description>Handler that manages the select change event.  Dispatches <i>select_change</i> to monitors.</description>
			///		</method>	
			t.handle_select_change = function (e) {
				t.dispatchEvent("select_change", e);
			};
			///		<method private = "1" internal = "1">
			///			<name>bindObjects</name>
			///			<description>Binds MonitorService event handlers to common browser objects.  Individual monitors participate in the event handler by defining a <i>handle_{event name}</i> function, such as <i>handle_window_load</i>.</description>
			///		</method>
			t.bindObjects = function (b) {
				var _a = (b ? HemiEngine.event.removeEventListener : HemiEngine.event.addEventListener),
					d = document, w = window, f = false, o, p = t.objects
				;

				_a(d, "stop", t.handle_document_stop, f);
				/// d.onstop = t.handle_window_stop;

				_a(w, "load", t.handle_window_load, f);
				_a(w, "unload", t.handle_window_unload, f);
				_a(w, "beforeunload", t.handle_window_beforeunload, f);

				/* reuse o */
				o = p.context_object;
				if (o == d) o = d.documentElement;
				_a(o, "contextmenu", t.handle_context_menu, f);
				_a(o, "mousemove", t.handle_mouse_move, f);
				_a(o, "click", t.handle_mouse_click, f);
				_a(o, "scroll", t.handle_document_scroll, f);
				_a(w, "focus", t.handle_window_focus, f);
				_a(w, "blur", t.handle_window_blur, f);
				_a(w, "keydown", t.handle_window_keydown, f);
				_a(w, "resize", t.handle_window_resize, f);
				if (!b) {
					if (w.onerror) w.ph_error = w.onerror;
					w.onerror = t.handle_window_error;
				}
				else {
					if (w.ph_error) w.onerror = w.ph_error;
				}


			};

			///		<method private = "1" internal = "1">
			///			<name>bindElements</name>
			///			<description>Binds MonitorService event handlers to common Web page objects.  Individual monitors participate in the event handler by defining a <i>handle_{event name}</i> function, such as <i>handle_window_load</i>.</description>
			///		</method>
			t.bindElements = function (b) {
				var a = [], i, o,
					f = (b ? HemiEngine.event.removeEventListener : HemiEngine.event.addEventListener),
					mc = t.handle_mouse_click,
					hs = t.handle_form_submit,
					hr = t.handle_form_reset,
					hc = t.handle_select_change,
					uf = t.handle_input_focus,
					ub = t.handle_input_blur
				;

				HemiEngine.util.absorb(t.G("form"), a);
				HemiEngine.util.absorb(t.G("a"), a);
				HemiEngine.util.absorb(t.G("input"), a);
				HemiEngine.util.absorb(t.G("area"), a);
				HemiEngine.util.absorb(t.G("select"), a);
				HemiEngine.util.absorb(t.G("textarea"), a);

				for (i = 0; i < a.length; i++) {

					o = a[i];

					if (!o.nodeName.match(/select/i)) {
						f(o, "click", mc);
						f(o, "focus", uf);
						f(o, "blur", ub);
						f(o, "keydown", ub);
					}
					if (o.nodeName.match(/form/i)) {
						/// f(o,"submit",hs);
						/// f(o,"reset",hs);
						if (!b) {
							if (o.onsubmit) o.ph_submit = o.onsubmit;
							o.onsubmit = hs;

							if (o.onreset) o.ph_reset = o.onreset;
							o.onreset = hr;
						}
						else {
							if (o.ph_submit) o.onsubmit = o.ph_submit;
							if (o.ph_reset) o.onreset = o.ph_reset;
						}
					}
					else if (o.nodeName.match(/select/i)) {
						f(o, "click", hc);
						f(o, "change", hc);
						f(o, "focus", hc);
						f(o, "blur", hc);
						f(o, "keydown", hc);
					}
				}

			};
			///		<method>
			///			<name>removeMonitor</name>
			///			<param name = "o" type = "object">Object registered as a Monitor.</param>
			///			<return-value name = "b" type = "boolean">Bit indicating whether the monitor was removed.</return-value>
			///			<description>Remove an object from the monitor service.</description>
			///		</method>	
			t.removeMonitor = function (o) {
				var m = t.objects.monitors, i = 0, b = 0;
				if (!o) return 0;
				for (; i < m.length; i++) {
					if (m[i] && m[i].getObjectId() == o.getObjectId()) {
						m[i] = 0;
						b = 1;
					}
				}
				return b;
			};

			///		<method>
			///			<name>addMonitor</name>
			///			<param name = "o" type = "object">Object registered with the ObjectRegistry.</param>
			///			<param name = "c" type = "String"><![CDATA[Embedded configuration string.  The format of the embedde config string is: name:value&name2:value2.  Use the <i>config_keys</i> hash on the Monitor instance to retrieve individual values.]]></param>
			///			<description>Adds an object to the monitor service, and allows that object to automatically receive event callbacks and easy access to MonitorService information.  The specified object must define an <i>initializeMonitor</i> method, and the method must return true for the monitor to be added.  Defines the <i>getMonitorService</i> method, <i>can_interval</i>, and <i>interval_offset</i> on the specified object.</description>
			///		</method>	
			t.addMonitor = function (o, c) {
				var m = t.objects.monitors, r = HemiEngine.registry.service;
				if (
					!DATATYPES.TO(o)
					||
					o == null
					||
					r.isRegistered(o) == false
					||
					!DATATYPES.TF(o.initializeMonitor)
				) {
					t.logError("Invalid monitor object");
					return 0;
				}


				if (!o.config_keys) o.config_keys = {};
				if (DATATYPES.TO(o.config_keys) && DATATYPES.TS(c))
					t.hashValue(c, "&", ":", o.config_keys);

				o.getConfigKeys = function () { return o.config_keys };
				o.getConfigKey = function (n) { return o.config_keys[n]; };
				o.getMonitorService = function () { return t; };
				o.properties.can_interval = 1;
				o.properties.interval_offset = 0;

				if (o.initializeMonitor()) {
					m[m.length] = o;
					return 1;
				}
				t.logError("Monitor " + o.object_type + " failed to initialize");
				return 0;

			};

			t.handle_image_load = function (e) {
				t.dispatchEvent("image_load", e);
			};
			t.handle_image_abort = function (e) {
				t.dispatchEvent("image_abort", e);
			};
			t.handle_image_error = function (e) {
				t.dispatchEvent("image_error", e);
			};

			t.ImageProbe = function (b) {
				var _a = (b ? HemiEngine.event.removeEventListener : HemiEngine.event.addEventListener), _s = t.properties, i, _i = document.images, l;
				if (t.ready_state > 4 || !_i) return;
				l = _i.length;

				for (i = (b ? 0 : _s.last_image_index); i < l; i++) {
					_i[i].onload = t.handle_image_load;
					_i[i].onabort = t.handle_image_abort;
					_i[i].onerror = t.handle_image_error;
					_i[i]._ix = i;
				}
				_s.last_image_index = l;
				if (!_s.document_rendered) window.setTimeout(t.ImageProbe, 10);
			};
			HemiEngine._implements(t, "base_object", "monitor_service", "%FILE_VERSION%");
			HemiEngine.registry.service.addObject(t);
			HemiEngine.util.logger.addLogger(t, "Monitor Base", "Monitor Base Service", "700");
			t.initializeMonitorService();

		}

	}, 1);

} ());


/// </class>
/// </package>
/// </source>
