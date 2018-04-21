/// <source>
/// <name>Hemi.driver</name>
/// <project>
/// 	<name>Hemi JavaScript Framework</name>
/// 	<url-title>Hemi JavaScript Framework</url-title>
/// 	<url>/Hemi/</url>
/// </project>
///
/// <package>
///	<path>Hemi.driver</path>
///	<library>Hemi</library>
///		<description>The Application Driver is a bootstrap for leveraging browser load and unload events to start and stop the framework.</description>
///	<static-class>
///		<name>service</name>
///		<version>%FILE_VERSION%</version>
///		<description>Static implementation of serviceImpl.</description>
///	</static-class>
///	<class>
///		<name>service</name>
///		<version>%FILE_VERSION%</version>
///		<description>Driver for starting up and shutting down the framework.</description>

(function(){
	HemiEngine.include("hemi.event");
	HemiEngine.namespace("driver",HemiEngine,{
		service:null,
		serviceImpl:function(){
			var t = this,_x = HemiEngine.xml,_m = HemiEngine.message.service;
			
			t.properties = {
				l:0,

				/* window_loaded */
				wl:0,
				/* window unloaded */
				wu:0,
				global_counter:0
			};
			t.objects = {
				application_config:0
			};
			/// <method private = "1" internal = "1">
			/// <name>_terminate</name>
			/// <description>Publishes a destroy message to all subscribing objects.</description>
			/// </method>
			t._terminate = function(){
				_m.setDeliveryDelay(0);
				_m.publish("destroy",window);
			};
			
			/// <method>
			/// <name>getConfig</name>
			/// <return-value name = "c" type = "org.cote.js.util.config">Config object.</return-value>
			/// <description>Returns a org.cote.js.util.config object.</description>
			/// </method>
			t.getConfig = function(){
				return t.objects.a;
			};
			
			/// <method>
			/// <name>setConfig</name>
			/// <param name = "c" type = "org.cote.js.util.config">Config object.</param>
			/// <description>Specifies the application configuration object.  Causes the <i>application_config_loaded</i> message to be published.</description>
			/// </method>
			t.setConfig = function(o,b){
				/*
					o = config object
					b = switch; publish a message that the config was loaded.
				*/

				t.properties.l = 1;
				t.objects.a = o;
				if(b) _m.publish("application_config_loaded",o);
			};

			t._handle_window_unload = function(){

				this.destroy();
			};
			
			/*
			 * if a sigterm is detected, then invoke destroy but don't propogate the
			 * sigterm by invoking sendSigterm
			 */
			/// <method>
			/// <name>sigterm</name>
			/// <description>Sends termination signal to destroy object without propogating termination signal to other objects.</description>
			/// </method>
			t.sigterm = function(){
				this.destroy(1);
			};

			/// <method>
			/// <name>destroy</name>
			/// <param name = "b" type = "boolean">Bit indicating whether a termination signal should be sent to all registered objects.</param>
			/// <description>Destroys this object, and if specified, sends a termination signal to all registered objects.</description>
			/// </method>
			t.destroy = function(b){
				var t = this;
				if(!t.properties.wu){
					t.properties.wu = 1;
					t.objects.a = 0;
					if(!b) HemiEngine.registry.service.sendSigterm();

					this._terminate();

					t.ready_state = 5;

					HemiEngine.event.removeEventListener(window,"unbeforeload",t._prehandle_window_unload);
					HemiEngine.event.removeEventListener(window,"unload",t._prehandle_window_unload);
					HemiEngine.event.removeEventListener(window,"load",t._prehandle_window_load);

				}
			};


			t._handle_window_load=function(){
				t.properties.wl=1;
				_m.publish("dom_event_window_load",this);
			};

			/*
				Add event buffer was designed for DOM events as a way
				of creating instance-specific handlers.
			*/

			HemiEngine.event.addScopeBuffer(t);

			HemiEngine._implements(t,"base_object","driver_utility","%FILE_VERSION%");
			HemiEngine.registry.service.addObject(t);

			t.scopeHandler("window_load",0,0,1);
			t.scopeHandler("window_unload",0,0,1);

			HemiEngine.event.addEventListener(window,"unbeforeload",t._prehandle_window_unload);
			HemiEngine.event.addEventListener(window,"unload",t._prehandle_window_unload);
			HemiEngine.event.addEventListener(window,"load",t._prehandle_window_load);
			
			t.ready_state = 4;

		}

	},1);

}());
///	</class>
/// </package>
/// </source>