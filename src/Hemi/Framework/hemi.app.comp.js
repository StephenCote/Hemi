
/// <source>
/// <name>Hemi.app.comp</name>
/// <project>
/// 	<name>Hemi JavaScript Framework</name>
/// 	<url-title>Hemi JavaScript Framework Project</url-title>
/// 	<url>/Hemi/</url>
/// </project>
///
/// <package>
///		<path>Hemi.app.comp</path>
///		<library>Hemi</library>
///	<description>The Application Component is a portable and reusable set of code that can act as code-behind for HTML elements, quickly instrument event handling, and quickly load external templates within their own Application Space.</description>
/// <static-class>
///		<name>ApplicationComponent</name>
///		<description>Static initializer for ApplicationComponentInstance objects.</description>
///		<version>%FILE_VERSION%</version>
///		<method>
///			<name>bindComponent</name>
///			<param name = "o" type = "variant">HTML DOM Node or String id of registered XHTMLComponent.</param>
///			<param name = "i" type = "String">Identifier of the component to bind to.</param>
///			<param name = "c" type = "String">Path to the external XML file containing the component definition.</param>
///			<param name = "p" type = "String" optional = "1" default = "component id">Participant id.</param>
///			<param name = "a" type = "boolean" optional = "1" default = "false">Load synchronously.</param>
///			<description>Binds the specified HTML Node or XHTMLComponent object to the specified Application Component, and returns the Application Component.</description>
///			<return-value name = "a" type = "ApplicationComponentInstance">Instance of an ApplicationComponent.</return-value>
///		</method>
///		<method>
///			<name>newInstance</name>
///			<param name = "i" type = "String">Identifier of the component to create.</param>
///			<param name = "o" type = "variant">XHTML/HTML Node or function pointer.</param>
///			<param name = "c" type = "String" optional = "1">Container identifier.</param>
///			<param name = "f" type = "function" optional = "1">Load handler.  Handler is invoke with two parameters: The string "onloadappcomp", and the ApplicationComponentInstance object that was loaded.</param>
///			<param name = "p" type = "String" optional = "1" default = "component id">Participant id.</param>
///			<param name = "b" type = "boolean" optional = "1" default = "false">Bit indicating whether the application component should bind to its XHTMLComponent container.</param>
///			<description>Creates a new ApplicationComponentInstance object.</description>
///			<return-value name = "a" type = "ApplicationComponentInstance">Instance of an ApplicationComponent.</return-value>
///		</method>
/// </static-class>
/// <class>
///		<name>ApplicationComponentInstance</name>
///		<version>%FILE_VERSION%</version>
///		<description>A code fragment in a private scope that may be bound to HTML Nodes, and/or XHTMLComponent objects, and which provides a controlled environment for code execution and management.</description>
/// <example>
///		<description>Demonstrate how an ApplicationComponent can be used to bind an HTML Node to a external code.</description>
///		<name>Bind HTML Node to Application Component #1</name>
///		<code><![CDATA[<!-- XML Component File -->]]></code>
///		<code><![CDATA[<application-components>]]></code>
///		<code><![CDATA[   <application-component id = "demo_ac1">]]></code>
///		<code><![CDATA[      <![]]>CDATA[</code>
///		<code>         component_init:function(){</code>
///		<code>            alert('loaded');</code>
///		<code>         },</code>
///		<code>         component_destroy:function(){</code>
///		<code>         },</code>
///		<code>         _handle_click:function(e){</code>
///		<code>            alert('click');</code>
///		<code>         }</code>
///		<code>      ]]<![CDATA[>]]></code>
///		<code><![CDATA[   </application-component>]]></code>
///		<code><![CDATA[</application-components>]]></code>
///		<code><![CDATA[<!-- HTML Page -->]]></code>
///		<code><![CDATA[<p id = "oTest">This is a test</p>]]></code>
///		<code><![CDATA[<script type = "text/javascript">]]></code>
///		<code>window.onload = init;</code>
///		<code>function init(){</code>
///		<code>   var oAC = Hemi.app.comp.ApplicationComponent;</code>
///		<code>   var oComponent = oAC.bindComponent(document.getElementById("oTest"),"demo_ac1","/path/to/file.xml");</code>
///		<code>}</code>
///		<code><![CDATA[</script>]]></code>
/// </example>
/// <message>
/// <name>ontemplateload</name>
/// <param name = "o" type = "ApplicationComponent">The application component for which the template was recently loaded and initialized.</param>
/// <description>Message published to all subscribers when a template has been loaded.</description>
/// </message>
/// <message>
/// <name>oncomponentload</name>
/// <param name = "o" type = "ApplicationComponent">The application component that was just loaded.</param>
/// <description>Message published to all subscribers when a component has been loaded.</description>
/// </message>
/*
	Author: Stephen W. Cote
	Email: wranlon@hotmail.com
	
	Copyright 2003, All Rights Reserved.
	
	Do not copy, archive, or distribute without prior written consent of the author.
*/

/*
	ocj.appcomp
		This file is parameterized because it is used for two primary purposes:
			1) A dynamic loader for application components
			2) An application component binder
			
		In #1, an XML node is used for code delivery.
		In #2, source code is injected at the SOURCE_CODE token point, and the PACKAGE, CLASS,
			and LABEL tokens are substituted with specified names.  This means the dynamic portion
			is not used, and so should also be parameterized (which isn't done yet).
		

		Application Components are 'locked' by the ready_state after initialization to prevent being overwritten through re-initialization.
		An overwrite can happen when synchronously loading multiple components from the same XML file with the same component id.
		It therefore necessary to first 'release' the component prior to initializing it again.

*/
/*
    2011/02/28:
        TODO: Should the Template feature be refactored into its own class that inherits from an Application Component?  There is an obvious separation between the two, but separating them would result in a fair amount of duplicate handling.
*/
(function () {
	HemiEngine.namespace("app.comp", HemiEngine, {
		dependencies : ["hemi.util","hemi.util.logger","hemi.event","hemi.transaction","hemi.app.space","hemi.data.stack","hemi.data.form"],
		properties: {
			/* id on an element that points to an appcomp entry */
			c: "acid",
			/* id on an element that points to a config item, which represents and appcomp definition path */
			g: "accfgid",
			/* default component config id; see above */
			k: "appcomp_path",
			/* id set on an element that refers back to the application component */
			r: "acrid",
			/* participant id for application components */
			p: "participant-id",
			/* application component path to use */
			q: "appcomp_path",
			/* quick-fix lookup */
			x: "component",
			/* quick-fix template */
			t: "template"
		},

		bindComponent: function (o, i, c, p, a) {
			/*
			o = object
			i = definition id
			c = definition path
			p = participant id; if not specified, it is the definition id
			a = sync load
			*/
			var _a = HemiEngine.app.comp, z, q = o, r;
			r = _a.properties.r;

			if (typeof q == DATATYPES.TYPE_STRING) {
				q = HemiEngine.registry.service.getObject(o);
				if (q != null && typeof q.getContainer == DATATYPES.TYPE_FUNCTION) q = q.getContainer();
			}
			if (typeof q != DATATYPES.TYPE_OBJECT || q == null) {
				HemiEngine.message.service.sendMessage("Invalid ID reference '" + o + "' in bindComponent", "200.4");

				return 0;
			}


			if (typeof q[r] == DATATYPES.TYPE_STRING) {
				HemiEngine.message.service.sendMessage("Object is already bound to '" + q[r] + "'", "200.4");


				return 0;

			}


			/* #1 Create a new ApplicationComponent for 'o' */
			z = _a.newInstance(0, 0, o, 0, p, 1);
			/// z.setAsync(!a);
			z.setAsync(1);
			/* #2 Enabled bindings (for events) - this must be done prior to loading the component definition */

			z.getObjects().promise = z.loadComponent(i, c);
			if (typeof q.setAttribute == DATATYPES.TYPE_UNDEFINED)
				q[r] = z.object_id;

			else
				q.setAttribute(r, z.object_id);

			HemiEngine.logDebug("Bind to application component " + i + " / " + z.getObjectId());

			return z;
		},

		newInstance: function (i, o, c, f, p, b) {
			/*
			i = id
			o = node context
			c = container id
			f = load handler
			p = participant id; used for transactions
			b = binding enabled
			*/

			var n = HemiEngine.newObject("application_component", "%FILE_VERSION%");

			if (typeof o == DATATYPES.TYPE_FUNCTION) f = o;
			if (typeof o != DATATYPES.TYPE_OBJECT) o = 0;
			if (typeof i != DATATYPES.TYPE_STRING) i = 0;
			if (typeof p != DATATYPES.TYPE_STRING) p = 0;
			if (typeof c == DATATYPES.TYPE_UNDEFINED) c = 0;
			else if (DATATYPES.TO(c) && DATATYPES.TF(c.getObjectId)) c = c.getObjectId();
			if (typeof b == DATATYPES.TYPE_UNDEFINED) b = 0;


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


			n.objects = {
				/* mark handlers being used */
				/* This is used when filtering events through the dispatch */
				tp: [],
				/// beans
				b: [],
				ts: HemiEngine.data.stack.service,
				dependencies:{}
			};
			n.properties = {
				eic: 1,
				edc: 1,
				te: 0,
				ei: 0,
				/* c = component path */
				c: 0,
				/* component name */
				n: 0,
				/* container id */
				e: c,
				/* use friendly id - recommended only when there are unique appcomp ids*/
				i: 1,
				/* element_parent_name */
				p: "application-components",
				/*  element_name */
				m: "application-component",

				/* async */
				a: 1,

				/* load handler */
				h: f,

				/* binding_enabled */
				b: b,

				/* event binding list */
				eb: "keydown,keyup,keypress,change,focus,blur,mouseover,mouseout,mouseup,mousedown,click,touchstart,touchend,touchmove",
				/* transactional */
				t: 1,
				/* transaction name */
				TransactionName: p,
				/* transaction id */
				TransactionId: 0
			};

			if (i && 1) n.object_id = i;

			/*
			A sigterm message is invoked when the window unloads,
			or when everything is shut off unexpectedly.
				
			This also relies on a signal from a containment component, such as ocju.driver
			*/
			///		<method virtual = "1">
			///			<name>_handle_event</name>
			///			<param name = "e" type = "event">Event object.  This is determined cross browser, so there should be no need to query for the global event object in browsers such as Internet Explorer.</param>
			///			<description>Handler for a specific event, where <i>event</i> is one of the following: change, focus, blur, mouseover, mouseout, click.  When binding a component with one of these handlers, the event instrumentation is done automatically.</description>
			///		</method>

			///		<method>
			///			<name>sigterm</name>
			///			<description>Sends a termination signal to the ApplicationComponent.</description>
			///		</method>
			n.sigterm = function () {
				this.destroy();
			};

			n.setLoadHandler = function (f) {
				this.properties.h = f;
				if (this.ready_state == 4) f("oncomponentload", this);
			};

			/*
			Destroy is invoked by a containment component, such as an ocj.engine, or by listening for the 'destroy' publication, and specifying this function as the handler.
			Invoking ocju.driver.ApplicationDriver._terminate will publish the destroy message.
				
			The only time this is directly invoked is from ocj.engine
			*/
			///		<method virtual = "1">
			///			<name>local_handle_xhtml_token</name>
			///			<param name = "i" type = "int">Integer representing the nodeType.</param>
			///			<param name = "s" type = "String">String value provided by HemiEngine.xml.setInnerXHTML, when this method is provided as the callback argument.</param>
			///			<description>Virtual token pre-processor to be implemented as needed for substituting tokenized values (eg: ${this})</description>
			///			<return-value type = "String" name = "r">The substituted value</return-value>
			///		</method>	
			///		<method>
			///			<name>_handle_xhtml_token</name>
			///			<param name = "i" type = "int">Integer representing the nodeType.</param>
			///			<param name = "s" type = "String">String value provided by HemiEngine.xml.setInnerXHTML, when this method is provided as the callback argument.</param>
			///			<description>Token pre-processor.  Tokens include: ${this} returns a string representing a request to the registry for the context object, ${this.id} represents the running object id, ${hemi.hemi_base} represents the framework base path, and ${form.[name]} may be used to access virtual form fields.</description>
			///			<return-value type = "String" name = "r">The substituted value</return-value>
			///		</method>

			n._handle_xhtml_token = function (i, s) {
				var r = s, h = /\$\{hemiConfig\.(\S[^\}]+)\}/,p = /\$\{property\.(\S[^\}]+)\}/, g = /\$\{form\.(\S[^\}]+)\}/, b = /\$\{bean\.(.[^\.\}]+)\}/, b2 = /\$\{bean\.(.[^\.\}]+)\.(.[^\.]+)\}/, m, f = "replace",v;

				if (i == 2 || i == 3) {
					if (!r || !r.length || !r.match(/\$/)) return r;

					r = r[f](/\$\{this\}/g, "HemiEngine.registry.service.getObject('" + n.object_id + "')");
					r = r[f](/\$\{this\.id\}/g, n.object_id);
					r = r[f](/\$\{hemi\.hemi_base\}/g, HemiEngine.hemi_base);
					while (n.properties.te && (m = r.match(g)) && m.length > 1)
						r = r.replace(g, HemiEngine.data.form.service.getValue(m[1], n.properties.ei));
					while ((m = r.match(b)) && m.length > 1)
						r = r[f](b, n.object_id + "-" + m[1]);
					while ((m = r.match(p)) && m.length > 1)
						r = r[f](p, n.properties[m[1]]);
					while ((m = r.match(h)) && m.length > 1)
						r = r[f](h, (typeof HemiConfig != DATATYPES.TYPE_UNDEFINED && HemiConfig[m[1]] ? HemiConfig[m[1]] : ""));
					while ((m = r.match(b2)) && m.length > 2) {
						/// reuse b
						b = n.getBean(m[1]);

						/// Force a sync-out on any backing form
						/// This is required because the token is processed before any current template is unloaded
						/// And if the bean is bound to a form element, the element hasn't been synchronized-out yet
						///
						if (n.properties.ei && (g = HemiEngine.data.form.service.getXElement(m[2], n.properties.ei)) && (g = Hemi.registry.service.getObject(g.object_id))) {
							/* if (g && (g = Hemi.registry.service.getObject(g.object_id)))*/
							g.objects.cc.synchronizeComponent(g);
						}

						/* if(b) alert(n.objects.b[m[1]] + ":" + m[1] + "." + m[2] + " = " + b[m[2]]); */
						if(b && (v = b[m[2]]) instanceof Date){
							r = r[f](b2, (v.getMonth()+1) + "-" + v.getDate() + "-" + v.getFullYear());
						}
						else{
							r = r[f](b2, b ? b[m[2]] : "");
						}
						Hemi.log("Resolve " + m[1] + "." + m[2] + "='" + b[m[2]] + "'");
						/// r = r[f](b2, b[m[2]]);
					}

					if (typeof n.local_handle_xhtml_token == DATATYPES.TYPE_FUNCTION) r = n.local_handle_xhtml_token(i, r);
				}
				else if (i == 1 && s.match(/^embedded-script$/i)) return 0;

				return r;
			};
			///		<method virtual = "1">
			///			<name>component_destroy</name>
			///			<description>Invoked when the ApplicationComponent destroy method is invoked, but before internal references are removed or cleaned up.</description>
			///		</method>	
			///		<method>
			///			<name>destroy</name>
			///			<description>Prepares the ApplicationComponent to be destroyed.  Removes all tokens created for this object, removes this object from participating in any transactions, removes it from the registry, and invokes the <i>component_destroy</i> method.</description>
			///		</method>	
			n.destroy = function () {
				var t = this, o, i;

				/* only do this once */
				Hemi.log("Destroy application component " + t.object_id);
				if (t.ready_state < 5) {

					HemiEngine.message.service.unsubscribe(this, "onspaceconfigload", "_handle_spaceconfig_load");


					HemiEngine.message.service.unsubscribe(t, "onloadxml", "_handle_load_xml");


					if (typeof t.component_destroy == DATATYPES.TYPE_FUNCTION) t.component_destroy();
					t.cleanTemplate();

					t.ready_state = 5;

					/// Destroy any container object, too
					if (typeof this.properties.e == DATATYPES.TYPE_STRING && (o = HemiEngine.registry.service.getObject(this.properties.e)) && typeof o.destroy == DATATYPES.TYPE_FUNCTION)
						o.destroy();

					/// 2007/02/03
					/// Destroy  any template space service
					///
					var oE = this.getTemplateSpace();
					if (oE) {
						HemiEngine.app.space.service.clearAppSpace(oE);
					}


					HemiEngine.data.stack.service.clear(t);

					if (HemiEngine.transaction.service.isRegistered(this))
						HemiEngine.transaction.service.removeTransactionParticipant(t, t.getPacket());


					/* It is up to the object to remove itself from the registry */
					HemiEngine.registry.service.removeObject(t);
					for (i in t.objects.b) HemiEngine.registry.service.removeObject(HemiEngine.registry.service.getObject(t.objects.b[i]));
					/* cleanup pointers */
					for (i in t.objects) t.objects[i] = null;

				}
			};
			///		<method>
			///			<name>sanitizeBean</name>
			///			<param name = "s" type = "object">The bean object.</param>
			///			<param name = "t" type = "object">A new object with the expected properties.</param>
			///         <return-value name = "o" type = "object">A copy of the bean object including only the properties identified in the reference object.</return-value>
			///			<description>Returns a version of the bean with only the expected properties, stripping out any framework related properties.</description>
			///		</method>

			n.sanitizeBean = function(s){

				///var o = new t();
				for(i in o){
					o[i] = s[i];
				}
				return o;
			},
			///		<method>
			///			<name>clearBean</name>
			///			<param name = "v" type = "variant">The object or object_id of the locally referenced object.</param>
			///         <return-value name = "b" type = "boolean">Bit indicating whether the bean was cleared.</return-value>
			///			<description>Clears a local reference to the specified object.  Otherwise, the object will be cleaned up and removed from the registry when the component is destroyed.</description>
			///		</method>
			n.clearBean = function(n){
				var t = this;
				if(!t.objects.b[n]) return 0;
				
				var o = HemiEngine.registry.service.getObject(t.objects.b[n]);
				if(typeof o == DATATYPES.TYPE_OBJECT && o!=null){
					HemiEngine.registry.service.removeObject(o);
					delete o.bind;
				}
				delete t.objects.b[n];
				return 1;
			},
			
			///		<method>
			///			<name>setBean</name>
			///			<param name = "o" type = "object">A JavaScript object.</param>
			///			<param name = "n" type = "String">The name to assign to the object.</param>
			///         <return-value name = "b" type = "boolean">Bit indicating whether the bean was set.</return-value>
			///			<description>Creates a local reference to the specified object.  The object will be prepared and registered as a framework object if it is not already.  All bean objects will be cleaned up and removed from the registry when the component is destroyed.</description>
			///		</method>
			n.setBean = function (o, n) {
				var v, i = this.object_id + "-" + n, _o = this.objects;
				if (_o.b[n] || o.object_id) return 0;

				/// if (!o.object_id) {
				var b = {bind:o};
				Hemi.prepareObject("bean", "1.0", false, b, true);
				b.object_id = i;
				HemiEngine.registry.service.addObject(b);
				/// }
				/// if (!_o.b[n]) {
				_o.b[n] = b.object_id;
				/// }
				return 0;
			};
			///		<method>
			///			<name>getBean</name>
			///			<param name = "n" type = "String">The name assigned to the object.</param>
			///			<return-value name = "o" type = "object">A JavaScript object.</return-value>
			///			<description>Retrieves the named object.</description>
			///		</method>
			n.getBean = function (n) {
				var _o = this.objects, b = 0;
				if (_o.b[n]){
					b = HemiEngine.registry.service.getObject(_o.b[n]);
					if(b) b = b.bind;
				}
				return b;
			};
			///		<method>
			///			<name>getDataStack</name>
			///			<description>Returns the StackStack used by this component.</description>
			///			<return-value type = "StackStack" name = "t">DataStack object.</return-value>
			///		</method>
			n.getDataStack = function () {
				return this.objects.ts;
			};



			///		<method>
			///			<name>setAsync</name>
			///			<param name = "b" type = "boolean">Bit indicating whether load operations should be asynchronous.</param>
			///			<description>Specify whether load operations should be handled asynchronously.</description>
			///		</method>
			n.setAsync = function (b) {
				this.properties.a = b;
			};

			///		<method>
			///			<name>release</name>
			///			<description>Releases the ApplicationComponent object so that it can be reinitialized with another definition.</description>
			///		</method>	
			n.release = function () {
				/*
				Back off the ready_state so another definition may  be loaded
				*/
				this.ready_state = 2;
			};


			/// <method internal = "1">
			/// <name>post_init</name>
			/// <param name = "x" type = "XHTMLComponent">XHTMLComponent object representing an HTML Form Element.</param>
			/// <param name = "ri" type = "String" optional = "1">Reference id for field containment.</param>
			/// <description>Invokes a post initialization after the component has been initialized, and after any child content and objects have been added and initialized.  Automatically invoked by Space servire through XHTMLComponent. Or, can be manually invoked as needed.  Causes any virtual <i>component_post_init</i> function to be invoked.</description>
			/// </method>
			n.post_init = function (o, i) {
				/// console.log("Application component post_init: " + this.component_post_init);
				if (typeof this.component_post_init == DATATYPES.TYPE_FUNCTION) this.component_post_init();
			};


			///		<method>
			///			<name>setTemplateIsSpace</name>
			///			<param name = "b" type = "boolean">Bit indicating whether to treate the template container as an engine.</param>
			///			<description>Specifies whether to instrument a template container as an Application Space.  Note: When a component is set as a space, the space-id attribute artifact is stripped.  The space-id attribute is used as a processing boundary by the Application Space service.  If the marker is not removed, the spaces will overlap and may result in errors due to expected objects not existing in the expected spaces.</description>
			///		</method>
			n.setTemplateIsSpace = function (b) {
				if (b) this.getContainer().removeAttribute("space-id");
				this.properties.te = b;
			};

			///		<method>
			///			<name>getTemplateSpace</name>
			///			<return-value name = "e" type = "SpaceObject">Space object created for the template container.</return-value>
			///			<description>Returns the Space object created for the template container.  Used when setTemplateIsSpace is set to 1.</description>
			///		</method>	
			n.getTemplateSpace = function () {
				var _s = this.properties;
				if (!_s.te || !_s.ei) return 0;
				return HemiEngine.app.space.service.getSpace(_s.ei);
			};

			///		<method>
			///			<name>setBindingEnabled</name>
			///			<param name = "b" type = "boolean">Bit indicating whether the component should bind to any specified XHTMLComponent.</param>
			///			<description>Specify whether the component should bind to an XHTMLComponent.  Binding is used to automatically instrument event handlers with the corresponding DOM Node represented by the XHTMLComponent.</description>
			///		</method>
			n.setBindingEnabled = function (b) {
				this.properties.b = b;
			};

			///		<method>
			///			<name>getBindingEnabled</name>
			///			<return-value name = "b" type = "boolean">Bit indicating whether the component should bind to any specified XHTMLComponent.</return-value>
			///			<description>Bit indicating whether the component should bind to an XHTMLComponent.  Binding is used to automatically instrument event handlers with the corresponding DOM Node represented by the XHTMLComponent.</description>
			///		</method>	
			n.getBindingEnabled = function () {
				return this.properties.b;
			};

			///		<method deprecated = "1">
			///			<name>getDefinitionId</name>
			///			<return-value name = "i" type = "String">Application component definition id.</return-value>
			///			<description>Returns the definition id, which is the code executed to construct the component.</description>
			///		</method>	
			n.getDefinitionId = function () {
				return this.properties.n;
			};

			///		<method>
			///			<name>setContainerId</name>
			///			<param name = "i" type = "String">Identifier of the registered object to which this application component belongs.</param>
			///			<description>Specifies the container id, which is the object to which the component belongs.</description>
			///		</method>
			n.setContainerId = function (s) {
				this.properties.e = s;
			};

			///		<method>
			///			<name>getContainerId</name>
			///			<return-value name = "i" type = "String">Identifier of the registered object to which this application component belongs.</return-value>
			///			<description>Returns the container id, which is the object to which the component belongs.</description>
			///		</method>	
			n.getContainerId = function (s) {
				return this.properties.e;
			};

			///		<method>
			///			<name>getComponentName</name>
			///			<return-value name = "i" type = "String">The name of the component.</return-value>
			///			<description>Returns the container name.</description>
			///		</method>
			n.getComponentName = function () {
				return this.properties.n;
			};

			///		<method>
			///			<name>getContainer</name>
			///			<return-value name = "o" type = "object">The object that contains the application component.</return-value>
			///			<description>Returns the object that contains the application component.</description>
			///		</method>			
			n.getContainer = function () {
				var o = this.properties.e;
				if (!o) return 0;
				if (typeof o == DATATYPES.TYPE_STRING) o = HemiEngine.registry.service.getObject(o);
				if (o != null && typeof o.getContainer == DATATYPES.TYPE_FUNCTION) o = o.getContainer();
				return o;

			};


			///		<method>
			///			<name>loadComponent</name>
			///			<param name = "l" type = "String">The identifier of the component to load.</param>
			///			<param name = "c" type = "String">Path to the external XML file containing the component definitions.</param>
			///			<description>Loads the specified component definition.</description>
			///		</method>
			n.loadComponent = function (l, c) {
				/*
				c = component path
				l = component label
				*/

				var t = this, _s, _x = HemiEngine.xml, _p;
				_s = t.properties, _p = t.objects;

				if (typeof c != DATATYPES.TYPE_STRING || typeof l != DATATYPES.TYPE_STRING) return 0;
				_s.c = c;
				_s.n = l;

				/* a/synchronous get, cache the request */

				/// 2011/04/10
				/// Restricting XML handler scope

				/*
				Use the message service to pick up the xml loaded event for asynchronous
				operations because the handler loses its scope to the object instance
				Doing so means that the handler must correctly identify the config
				
				Refer to notes in ocju.config for repro steps
				*/

				if (!_s.hx) {
					_s.hx = 1;
					HemiEngine.message.service.subscribe(t, "onloadxml", "_handle_load_xml");
				}

				/*
				Just use the path for the cache id for sync requests
				*/

				/// _x.getXml(c, null, _s.a, (_s.a ? t.object_id : c), 1);
				return HemiEngine.xml.promiseXml(c, "GET", 0, t.object_id);
				/// 2009/09/21 - why not cache this? -- !(_s.a)
			};


			///		<method internal = "1">
			///			<name>init</name>
			///			<param name = "o" type = "object">Application Component definition node.  This should be an XML node.</param>
			///			<description>Initializes the Application Component with the specified definition node.</description>
			///		</method>
			n.init = function (o) {
				var t = this, _s;
				/* status is specified here only for the compiled version */
				_s = t.properties;
				HemiEngine.event.addScopeBuffer(t);
				this.scopeHandler("load_template", 0, 0, 1);



				t.ready_state = 1;

				if (typeof o == DATATYPES.TYPE_OBJECT)
					t.importNodeDefinition(o);

			};

			n._handle_load_xml = function (s, v) {
				var t = this, o, _x = HemiEngine.xml, x, _s;
				_s = t.properties;

				/*
				05/11/2003
				Check for ready_state < 4 because multiple requests using the same cache id 
				and same comparison id will cause the component to be loaded multiple times.
				*/
				/// console.log("Handle load XML: " + t.object_id + " : " + _s.c + ":" + t.object_id);
				if (v.id == (_s.a ? t.object_id : _s.c ) && t.ready_state < 4) {
					HemiEngine.message.service.unsubscribe(t, "onloadxml", "_handle_load_xml");
					_s.hx = 0;
					x = v.xdom;
					o = _x.queryNode(x.documentElement, _s.m, 0, "id", _s.n);
					/*
					* 2004/07/22
					* Removed the alert-level on the warning message
					*/

					if (o != null) t.importNodeDefinition(o);
					else {
						HemiEngine.message.service.sendMessage("Invalid component definition for '" + _s.n + "' in '" + _s.m + "'", "200.4");
					}

				}

			};

			///		<method internal = "1">
			///			<name>importNodeDefinition</name>
			///			<param name = "o" type = "object">Application Component definition node.  This should be an XML node.</param>
			///			<description>Imports the definition node.</description>
			///		</method>	
			n.importNodeDefinition = function (x) {
				/*
				x = xml node
				i = id
				s = string data
				*/
				/// console.log("Import node definition");
				var i, t = this, _s, p;
				_s = t.properties;

				t.ready_state = 3;

				if (typeof x != DATATYPES.TYPE_OBJECT || x == null) {

					HemiEngine.message.service.sendMessage("Invalid object in importNodeDefinition", "200.1");

					return 0;
				}

				i = x.getAttribute("id");
				p = x.getAttribute(HemiEngine.app.comp.properties.p);

				return n.importComponentDefinition(HemiEngine.xml.getCDATAValue(x), i, p);


			};


			///		<method virtual = "1">
			///			<name>component_init</name>
			///			<description>Invoked when the component has been initialized and is ready to be used.</description>
			///		</method>

			///		<method virtual = "1">
			///			<name>component_post_init</name>
			///			<description>Invoked after the component and any children have been initialized.</description>
			///		</method>

			///		<method internal = "1">
			///			<name>importComponentDefinition</name>
			///			<param name = "s" type = "String">The Application Component code.</param>
			///			<param name = "i" type = "String">The component identifier.</param>
			///			<param name = "pn" type = "String" optional = "1">The transaction name this component should participate in.</param>
			///			<description>Imports the definition node.  Invokes the handler specified in <i>newInstance</i> with the String "onloadappcomp" and the ApplicationComponentInstance object.  Invokes the <i>component_init</i> method if it was defined.</description>
			///		</method>
			n.importComponentDefinition = function (s, i, pn) {
				/*
				s = component string 
				i = id 
				p = participant id
				*/
				/// console.log("Import component definition: " + s);
				var t = this, _s, p;
				_s = t.properties;
				if (typeof s != DATATYPES.TYPE_STRING){
					console.warn("Component definition is null");
					return 0;
				}

				/*
				If there is already a component definition loaded, then invoke any destroy handler.
				*/
				if (typeof t.component_destroy == DATATYPES.TYPE_FUNCTION) t.component_destroy();
				t.cleanTemplate();
				/*
				Back out the ready_state for a moment.
				If something fails, then the component won't be ready (duh)
				*/

				t.ready_state = 3;

				if (i) _s.n = i;
				else _s.n = HemiEngine.guid();

				if (pn) _s.TransactionName = pn;
				else if (!_s.TransactionName) {
					if (this.getReferenceId())
						_s.TransactionName = this.getReferenceId();
					else

						_s.TransactionName = _s.n;
				}

				s = '{' + s + '}';
				HemiEngine.util.merge(t, _s.n, s);

				/*
				Invoke the component initialization handler.
				*/



				var a, l, h, o = _s.e, ph;

				if (_s.b && _s.eb && o) {



					if (typeof o == DATATYPES.TYPE_STRING) o = HemiEngine.registry.service.getObject(o);

					if (o) {

						if (typeof o.getContainer == DATATYPES.TYPE_FUNCTION) o = o.getContainer();
						a = _s.eb.split(",");
						for (l = 0; l < a.length; l++) {
							h = '_handle_' + a[l];
							ph = '_prehandle_' + a[l];
							/*
							Is it necessary to remove event listeners when objects are destroyed?
							*/
							if (typeof t[ph] == DATATYPES.TYPE_FUNCTION) {
								HemiEngine.event.removeEventListener(o, a[l], t[ph]);
								t[ph] = null;
							}

							if (typeof t[h] == DATATYPES.TYPE_FUNCTION) {
								t.scopeHandler(a[l], 0, 0, 1);
								HemiEngine.event.addEventListener(o, a[l], t[ph]);
							}
						}
					}
				}

				if (_s.t)
					t.joinTransactionPacket();


				if (typeof t.component_init == DATATYPES.TYPE_FUNCTION) t.component_init();

				t.ready_state = 4;


				if (typeof _s.h == DATATYPES.TYPE_FUNCTION) _s.h("oncomponentload", t);
				HemiEngine.message.service.publish("oncomponentload", t);

			};
			///		<method internal = "1">
			///			<name>_handle_template_processor</name>
			///			<param name = "o" type = "Space">A Space object.</param>		
			///			<param name = "v" type = "variant">An XHTML Node, or string.</param>
			///			<description>Buffered handler for Space Processor override.</description>
			///		</method>

			n._handle_template_processor = function (o, n) {
				if (typeof n == DATATYPES.TYPE_OBJECT && n.nodeType == 1) {
					this.importEmbeddedScript(n, 1);
				}
			};
			///		<method>
			///			<name>importEmbeddedScript</name>
			///			<param name = "n" type = "XML node">An XML node.</param>
			///			<param name = "b" type = "bool">Bit indicating whether the embedded script element should be preserved in the parent node.  The default action is to remove it.</param>
			///			<description>Imports embedded-script elements from an XML document.</description>
			///		</method>
			n.importEmbeddedScript = function (oX, b) {

				var j, j2, a = oX.getElementsByTagName("embedded-script"), _p = this.objects, i, t, x;
				
				for (i = a.length - 1; i >= 0; i--) {
					t = HemiEngine.xml.getInnerText(a[i]);
					if (!b) a[i].parentNode.removeChild(a[i]);

					try {

						eval("x={" + t + "}");
						for (j in x) {

							j2 = j;
							if (j2.match(/^embedded_init$/)) {
								j2 = "embedded_init_" + this.properties.eic++;
							}
							else if (j2.match(/^embedded_destroy$/)) {
								j2 = "embedded_destroy_" + this.properties.edc++;
							}
							else if(j.match(/^dependencies$/)){
								x[j].map((n)=>{this.objects.dependencies[n]=1;});
								
								continue;
							}
							_p.tp[_p.tp.length] = j2;
							this[j2] = x[j];
						}

					}
					catch (e) {
						alert("Error: " + (e.description ? e.description : e.message));
					}


				}

			};
			n._handle_spaceconfig_load = function (s, v) {
				if (v && v.space_element && v.space_element.getAttribute("acrid") == this.object_id) {
					Hemi.logDebug("App Comp Space Config Load: Space (" + v.space_id + ") : Space Comp Ref Id (" + v.space_element.getAttribute("acrid") + ") : Comp Id (" + this.object_id + ")");
					this.properties.ei = v.space_id;
					this.InitializeTemplate();
				}
				else{
					Hemi.logDebug("Don't initialize for " + this.object_id);
				}
			};
			n.InitializeTemplate = function () {
				Hemi.logDebug("Initialize template " + this.object_id);
				
				var aP = [];
        		Object.keys(this.objects.dependencies).map(function(x){
        			if(!HemiEngine.isImported(x)){
        				aP.push(HemiEngine.include(x));
        			}
        		});
				Promise.all(aP).then(()=>{
					Hemi.logDebug("Resolved component (" + this.object_id + ") dependencies");
					this.dependencies = {};
					for (var i = 1; i < this.properties.eic; i++) {
						this["embedded_init_" + i]();
						this["embedded_init_" + i] = 0;
					}
					
					if (typeof this.template_init == DATATYPES.TYPE_FUNCTION){
						this.template_init();
					}
					
					this.template_init = 0;	
					this.properties.eic = 1;
					if (typeof this.local_template_init == DATATYPES.TYPE_FUNCTION) this.local_template_init(this);
					HemiEngine.message.service.publish("ontemplateload", this);
					
					if (typeof this.template_post_init == DATATYPES.TYPE_FUNCTION){
						this.template_post_init();
					}
					this.template_post_init = 0;
				});
			};

			///		<method>
			///			<name>loadTemplateFromNode</name>
			///			<param name = "o" type = "Node">Xml node representing the template to load.</param>
			///			<description>Loads the specified template node into the component container, or, if specified, into the object returned by the optional getTemplateContainer function defined on the component.</description>
			///		</method>
			n.loadTemplateFromNode = function (oX) {
				var a, o = this.getContainer(), x, i, t, _p = this.objects, b = this.properties.te, q, z;
				if (!oX) return;
				q = oX;
				z = this.properties.tid;
				if (q.nodeName.match(/^Template$/) != null) {
					if (z && q.getAttribute("id") != z) return;
				}
				else {
					a = oX.getElementsByTagName("Template");
					if (!a.length) return;
					if (!z) q = a[0];
					else {
						q = 0;
						for (i = 0; i < a.length; i++) {
							if (a[i].getAttribute("id") == z) {
								q = a[i];
								break;
							}
						}
						if (!q) return;
					}
				}

				this.properties.tid = 0;

				if (typeof this.setTitle == DATATYPES.TYPE_FUNCTION) this.setTitle(q.getAttribute("Title"));
				/// Import any embedded-script elements
				///
				/// 2019/04/05 - Set the preserve bit to true since the mechanism by which the xml is being passed in
				/// changed
				this.importEmbeddedScript(q, 1);

				if (typeof this.getTemplateContainer == DATATYPES.TYPE_FUNCTION) o = this.getTemplateContainer();
				HemiEngine.xml.removeChildren(o);

				a = q.childNodes;
				for (i = 0; i < a.length; )
					HemiEngine.xml.setInnerXHTML(o, a[i++], 1, 0, 0, 0, 0, this._handle_xhtml_token);

				/// check for any spaces in the loaded templates
				///
				/// console.log("Checking for spaces loaded in template: " + b + " / " + this.properties.ei);
				if (b) {
					o.setAttribute("space-config", "self");
					if (!this.properties.ei) {
						Hemi.logDebug("Create new application component space");
						HemiEngine.message.service.subscribe(this, "onspaceconfigload", "_handle_spaceconfig_load");
						o.setAttribute("acrid", this.object_id);
						o.setAttribute("is-space", "1");

						this.scopeHandler("template_processor", 0, 0, 1);
						HemiEngine.logDebug("Create App Comp Space for " + this.object_id);
						var oSpace = HemiEngine.app.space.service.createSpace(o, 0, this._prehandle_template_processor, this._handle_xhtml_token);

					}
					else {
						/// console.log("Use existing application component space " + this.properties.ei);
						x = HemiEngine.app.space.service.getSpace(this.properties.ei);
						HemiEngine.logDebug("Configure App Comp Space for " + this.object_id);
						HemiEngine.app.space.service.configureSpace(x, "self");
					}
				}
				else{
					this.InitializeTemplate();
				}
			};

			///		<method virtual = "1">
			///			<name>getTemplateObjectByName</name>
			///			<description>Returns an object reference from the current template.  Used when setTemplateIsSpace is set to true.</description>
			///			<return-value type = "object" name = "o">XHTML object.</return-value>
			///		</method>
			n.getTemplateObjectByName = function (i) {
				var e = this.getTemplateSpace(), o;
				if (!e) return 0;
				o = e.getSpaceObjectByName(i);
				if (!o || !o.object || !o.object.getContainer) return 0;
				return o.object.getContainer();
			};

			///		<method virtual = "1" internal = "1">
			///			<name>setTitle</name>
			///			<param name = "s" type = "String">Text of the title.</param>
			///			<description>Invoked by _handle_load_template, and sets a title for a component based on a loaded template.</description>
			///		</method>

			///		<method virtual = "1">
			///			<name>getTemplateContainer</name>
			///			<description>Returns the XHTML object into which a template is copied.</description>
			///			<return-value type = "object" name = "o">XHTML object.</return-value>
			///		</method>

			///		<method virtual = "1">
			///			<name>embedded_init</name>
			///			<description>Invoked when a template is loaded via the loadTemplate method.  This method is automatically removed after invocation, so each embedded-script must define it in order for it to be invoked.  Where the template_init method is unique to the object, there can be any number of embedded_init declarations.</description>
			///		</method>
			///		<method virtual = "1">
			///			<name>embedded_destroy</name>
			///			<description>Invoked prior to a template being loaded, or the containing object being destroyed. This method is automatically removed after invocation, so each embedded-script must define it in order for it to be invoked.  Where the template_destroy method is unique to the object, there can be any number of embedded_destroy declarations.</description>
			///		</method>

			///		<method virtual = "1">
			///			<name>local_template_init</name>
			///			<param name = "o" type = "ApplicationComponent">The application component.</param>
			///			<description>Invoked after template_init and all embedded_init functions.  Used for specifying load handlers.</description>
			///		</method>
			///		<method virtual = "1">
			///			<name>template_init</name>
			///			<description>Invoked when a template is loaded via the loadTemplate method.  This method is automatically removed after invocation, so each template must define it in order for it to be invoked.</description>
			///		</method>
			///		<method virtual = "1">
			///			<name>template_destroy</name>
			///			<description>Invoked prior to a template being loaded, or the containing object being destroyed.</description>
			///		</method>

			///		<method>
			///			<name>loadTemplate</name>
			///			<param name = "s" type = "String">Path to the XML file containing the template data.</param>
			///			<param name = "i" type = "String" optional = "1">Optional id of the template to load.</param>
			///			<description>Loads the specified template into the component container, or, if specified, into the object returned by the optional getTemplateContainer function defined on the component.</description>
			///		</method>

			n.loadTemplate = function (s, i) {
				HemiEngine.logDebug("Load template: " + s);
				if (!s || !s.length){
					console.error("Template (" + s + ") was null: " + s);
					return;
				}
				this.cleanTemplate();
				if (i) this.properties.tid = i;
				/// Use path for cache
				///
				return new Promise((res,rej)=>{
					HemiEngine.xml.promiseXml(s, "GET", 0, i).then((v)=>{
						this.loadTemplateFromNode(v.documentElement);
						res(this);
					});
				});
				/// ,s, 1
			};
			///		<method>
			///			<name>cleanTemplate</name>
			///			<description>Invokes virtual template_destroy and embedded_destroy methods, and removes embedded script that had been loaded.  This will not remove any XHTMLComponent or Space objects, or clear the XHTML contents.</description>
			///		</method>
			n.cleanTemplate = function () {
				var _p = this.objects, i;
				/// HemiEngine.logDebug may not exist anymore during final cleanup
				///

				if (typeof this.template_destroy == DATATYPES.TYPE_FUNCTION) this.template_destroy();
				this.template_destroy = 0;
				for (i = 1; i < this.properties.edc; i++) {
					this["embedded_destroy_" + i]();
					this["embedded_destroy_" + i] = 0;
				}
				this.properties.edc = 1;

				/// Remove any embedded scripts loaded from a previous template
				///
				for (i = 0; i < _p.tp.length; ) {
					if (_p.tp[i++]) this[_p.tp[i++]] = null;
				}
				_p.tp = [];

			};




			///		<method deprecated = "1">
			///			<name>evaluateWireReference</name>
			///			<param name = "b" type = "boolean">Bit indicating whether only the wire action should be evaluated.</param>
			///			<param name = "n" type = "String" optional = "1">Wire name to supercede the hardcoded definition.</param>
			///			<param name = "a" type = "array" optional = "1">Argument array.</param>
			///			<return-value name = "w" type = "boolean">Returns true if the wire was evaluated, false otherwise.</return-value>
			///			<description>Evaluates the wire reference. Deprecated.</description>
			///		</method>
			/*
			n.evaluateWireReference = function (b, n, a) {
			if (typeof a != DATATYPES.TYPE_OBJECT) a = 0;
			var t = this,
			o,
			_e = HemiEngine.app.space.service,
			w,
			i,
			e,
			s
			;
			o = t.getContainer();

			/// Must be an XHTML Component; check node type
			if (!o || o.nodeType != 1) return 0;

			w = (n ? n : o.getAttribute("wire"));

			/// erid is auto-added by XHTMLComponent
			i = o.getAttribute("space-id");

			e = _e.getSpace(i);
			if (_e.isSpace(e) && e.getPrimitiveWire(w)) {
			s = _e.getWireService();
			if (s.invokeHardWireAction(e, w, a)) {
			if (!b) s.invokeHardWireHandler(e, w);
			return 1;
			}
			}
			return 0;
			};
			*/


			///		<method>
			///			<name>getReferenceId</name>
			///			<return-value name = "s" type = "String">Identifier of the component container.</return-value>
			///			<description>Returns the specified identifier of the component container, such as the containing Space identifier.</description>
			///		</method>
			n.getReferenceId = function () {
				var c = HemiEngine.registry.service.getObject(this.properties.e);
				/* c = XHTLM Component */
				if (!c || !DATATYPES.TF(c.getReferenceId)) return 0;
				/* ReferenceId = EngineID or specified id */
				return c.getReferenceId();
			};

			///		<method>
			///			<name>getContainerComponentId</name>
			///			<return-value name = "s" type = "String">Identifier of the component's container component.</return-value>
			///			<description>Returns the specified identifier of the component's container component.</description>
			///		</method>
			n.getContainerComponentId = function () {
				var c = HemiEngine.registry.service.getObject(this.properties.e);
				/* c = XHTLM Component */
				if (!c || c.object_type != "xhtml_component") return 0;
				/* ComponentId = Object ID or specified id */
				return c.getComponentId();
			};


			/*
			Make component initialization dependent on the addObject call.
			*/
			if (HemiEngine.registry.service.addObject(n)) {


				if (n.properties.t) HemiEngine.transaction.service.register(n, 1);

				n.init(o);
			}
			else {
				HemiEngine.message.service.sendMessage("Could not add application component to registry", "200.4");
			}

			return n;
		}
	});
} ());

/// </class>
/// </package>
/// </source>
