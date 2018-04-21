
/// <source>
/// <name>Hemi.template</name>
/// <project>
/// 	<name>Hemi JavaScript Framework</name>
/// 	<url-title>Hemi JavaScript Framework Project</url-title>
/// 	<url>/Hemi/</url>
/// </project>
///
/// <package>
///		<path>Hemi.template</path>
///		<library>Hemi</library>
///	<description>The Application Component is a portable and reusable set of code that can act as code-behind for HTML elements, quickly instrument event handling, and quickly load external templates within their own Application Space.</description>
/// <static-class>
///		<name>ApplicationComponent</name>
///		<description>Static initializer for TemplateInstance objects.</description>
///		<version>%FILE_VERSION%</version>
///		<method>
///			<name>bindTemplate</name>
///			<param name = "o" type = "variant">HTML DOM Node or String id of registered XHTMLComponent.</param>
///			<param name = "c" type = "String" optional = "1">Path to the external XML file containing the template.</param>
///			<param name = "a" type = "boolean" optional = "1" default = "false">Load synchronously.</param>
///			<description>Binds the specified HTML Node or XHTMLComponent object to the specified template.</description>
///			<return-value name = "a" type = "TemplateInstance">Instance of a Template.</return-value>
///		</method>
///		<method>
///			<name>newInstance</name>
///			<param name = "i" type = "String">Identifier of the template to create.</param>
///			<param name = "o" type = "variant">XHTML/HTML Node or function pointer.</param>
///			<param name = "c" type = "String" optional = "1">Container identifier.</param>
///			<param name = "f" type = "function" optional = "1">Load handler.  Handler is invoke with two parameters: The string "ontemplateload", and the TemplateInstance object that was loaded.</param>
///			<description>Creates a new TemplateInstance object.</description>
///			<return-value name = "a" type = "TemplateInstance">Instance of an ApplicationComponent.</return-value>
///		</method>
/// </static-class>
/// <class>
///		<name>TemplateInstance</name>
///		<version>%FILE_VERSION%</version>
///		<description>A code fragment in a private scope that may be bound to HTML Nodes, and/or XHTMLComponent objects, and which provides a controlled environment for code execution and management.</description>

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
    HemiEngine.include("hemi.util");
    HemiEngine.include("hemi.util.logger");
    HemiEngine.include("hemi.event");
    HemiEngine.include("hemi.transaction");
    HemiEngine.include("hemi.app.space");
    HemiEngine.include("hemi.data.stack");
    HemiEngine.include("hemi.data.form");

    HemiEngine.namespace("app.comp", HemiEngine, {
        properties: {
            /* id set on an element that refers back to the application component */
            r: "trid",
            /* quick-fix template */
            t: "template"
        },

        bindTemplate: function (o, c, a) {
            /*
            o = object
            c = definition path
            a = sync load
            */
            var _a = HemiEngine.template, z, q = o, r;
            r = _a.properties.r;

            if (typeof q == DATATYPES.TYPE_STRING) {
                q = HemiEngine.registry.service.getObject(o);
                if (q != null && typeof q.getContainer == DATATYPES.TYPE_FUNCTION) q = q.getContainer();
            }
            if (typeof q != DATATYPES.TYPE_OBJECT || q == null) {
                HemiEngine.message.service.sendMessage("Invalid ID reference '" + o + "' in bindTemplate", "200.4");

                return 0;
            }


            if (typeof q[r] == DATATYPES.TYPE_STRING) {
                HemiEngine.message.service.sendMessage("Object is already bound to '" + q[r] + "'", "200.4");


                return 0;

            }


            /* #1 Create a new Template for 'o' */
            z = _a.newInstance(0, c, 0);
            z.setAsync(!a);

            /* #2 Enabled bindings (for events) - this must be done prior to loading the component definition */

            /// z.loadTemplate(i, c);
            if (typeof q.setAttribute == DATATYPES.TYPE_UNDEFINED)
                q[r] = z.object_id;

            else
                q.setAttribute(r, z.object_id);



            HemiEngine.message.service.sendMessage("Bind to template " + z.getObjectId(), "200.1");


            return z;
        },

        newInstance: function (i, c, f) {
            /*
            i = id
            o = node context
            c = container id
            f = load handler
            */

            var n = HemiEngine.newObject("template", "%FILE_VERSION%");

            if (typeof o == DATATYPES.TYPE_FUNCTION) f = o;
            if (typeof o != DATATYPES.TYPE_OBJECT) o = 0;
            if (typeof i != DATATYPES.TYPE_STRING) i = 0;
            if (typeof c == DATATYPES.TYPE_UNDEFINED) c = 0;
            else if (DATATYPES.TO(c) && DATATYPES.TF(c.getObjectId)) c = c.getObjectId();


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
                /// beans
                b: [],
                ts: HemiEngine.data.stack.service
            };
            n.properties = {
                eic: 1,
                edc: 1,
                te: 0,
                ei: 0,
                /* c = component path */
                c: 0,
                /* container id */
                e: c,
                /* use friendly id - recommended only when there are unique appcomp ids*/
                i: 1,

                /* async */
                a: 1,

                /* load handler */
                h: f

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
                if (this.ready_state == 4) f("ontemplateload", this);
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
                var r = s, g = /\$\{form\.(\S+)\}/, b = /\$\{bean\.(.[^\.]+)\}/, b2 = /\$\{bean\.(.[^\.]+)\.(.[^\.]+)\}/, m, f = "replace";

                if (i == 2 || i == 3) {
                    if (!r || !r.length || !r.match(/\$/)) return r;

                    r = r[f](/\$\{this\}/g, "HemiEngine.registry.service.getObject('" + n.object_id + "')");
                    r = r[f](/\$\{this\.id\}/g, n.object_id);
                    r = r[f](/\$\{hemi\.hemi_base\}/g, HemiEngine.hemi_base);
                    if (n.properties.te && (m = r.match(g)) && m.length > 1)
                        r = r.replace(g, HemiEngine.data.form.service.getValue(m[1], n.properties.ei));
                    if ((m = r.match(b)) && m.length > 1)
                        r = r[f](b, n.object_id + "-" + m[1]);

                    if ((m = r.match(b2)) && m.length > 2) {
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
                        r = r[f](b2, b ? b[m[2]] : "");
                        Hemi.log("Resolve " + m[1] + "." + m[2] + "='" + b[m[2]] + "'");
                        /// r = r[f](b2, b[m[2]]);
                    }

                    if (typeof n.local_handle_xhtml_token == DATATYPES.TYPE_FUNCTION) r = n.local_handle_xhtml_token(i, r);
                }
                else if (i == 1 && s.match(/^embedded-script$/i)) return 0;

                return r;
            };

            ///		<method>
            ///			<name>destroy</name>
            ///			<description>Prepares the ApplicationComponent to be destroyed.  Removes all tokens created for this object, removes this object from participating in any transactions, removes it from the registry, and invokes the <i>component_destroy</i> method.</description>
            ///		</method>	
            n.destroy = function () {
                var t = this, o, i;

                /* only do this once */
                if (t.ready_state < 5) {

                    HemiEngine.message.service.unsubscribe(this, "onspaceconfigload", "_handle_spaceconfig_load");


                    HemiEngine.message.service.unsubscribe(t, "onloadxml", "_handle_load_xml");

                    t.cleanTemplate();

                    t.ready_state = 5;

                    /// Destroy any container object, too
                    if (typeof this.properties.e == DATATYPES.TYPE_STRING && (o = HemiEngine.registry.service.getObject(this.properties.e)) && typeof o.destroy == DATATYPES.TYPE_FUNCTION)
                        o.destroy();

                    /// 2007/02/03
                    /// Destroy  any template space service
                    ///
                    var oE = this.getTemplateSpace();
                    if (oE) 
                        HemiEngine.app.space.service.clearAppSpace(oE);
                    


                    HemiEngine.data.stack.service.clear(t);


                    /* It is up to the object to remove itself from the registry */
                    HemiEngine.registry.service.removeObject(t);

                    /// Cleanup beans
                    ///
                    for (i in t.objects.b) HemiEngine.registry.service.removeObject(HemiEngine.registry.service.getObject(t.objects.b[i]));

                    /* cleanup pointers */
                    for (i in t.objects) t.objects[i] = null;

                }
            };
            ///		<method>
            ///			<name>setBean</name>
            ///			<param name = "o" type = "object">A JavaScript object.</param>
            ///			<param name = "n" type = "String">The name to assign to the object.</param>
            ///         <return-value name = "b" type = "boolean">Bit indicating whether the bean was set.</return-value>
            ///			<description>Creates a local reference to the specified object.  The object will be prepared and registered as a framework object if it is not already.  All bean objects will be cleaned up and removed from the registry when the component is destroyed.</description>
            ///		</method>
            n.setBean = function (o, n) {
                var v, i = this.object_id + "-" + n, _o = this.objects, b = 0;
                if (_o.b[n] || o.object_id) return 0;

                /// if (!o.object_id) {
                Hemi.prepareObject("bean", "1.0", false, o, true);
                o.object_id = i;
                HemiEngine.registry.service.addObject(o);
                /// }
                /// if (!_o.b[n]) {
                _o.b[n] = o.object_id;
                b = 1;
                /// }
                return b;
            };
            ///		<method>
            ///			<name>getBean</name>
            ///			<param name = "n" type = "String">The name assigned to the object.</param>
            ///			<return-value name = "o" type = "object">A JavaScript object.</return-value>
            ///			<description>Retrieves the named object.</description>
            ///		</method>
            n.getBean = function (n) {
                var _o = this.objects, b = 0;
                if (_o.b[n])
                    b = HemiEngine.registry.service.getObject(_o.b[n]);

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



            /// <method internal = "1">
            /// <name>post_init</name>
            /// <param name = "x" type = "XHTMLComponent">XHTMLComponent object representing an HTML Form Element.</param>
            /// <param name = "ri" type = "String" optional = "1">Reference id for field containment.</param>
            /// <description>Invokes a post initialization after the component has been initialized, and after any child content and objects have been added and initialized.  Automatically invoked by Space servire through XHTMLComponent. Or, can be manually invoked as needed.  Causes any virtual <i>component_post_init</i> function to be invoked.</description>
            /// </method>
            n.post_init = function (o, i) {
                if (typeof this.template_post_init == DATATYPES.TYPE_FUNCTION) this.template_post_init();
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

            ///		<method internal = "1">
            ///			<name>init</name>
            ///			<description>Initializes the Template.</description>
            ///		</method>
            n.init = function () {
                var t = this, _s;
                /* status is specified here only for the compiled version */
                _s = t.properties;
                HemiEngine.event.addScopeBuffer(t);
                this.scopeHandler("load_template", 0, 0, 1);

                t.ready_state = 1;

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
                if (v && v.space_element && v.space_element.getAttribute("trid") == this.object_id) {
                    this.properties.ei = v.space_id;
                    this.InitializeTemplate();
                }
            };
            n.InitializeTemplate = function () {


                for (var i = 1; i < this.properties.eic; i++) {
                    this["embedded_init_" + i]();
                    this["embedded_init_" + i] = 0;
                }
                if (typeof this.template_init == DATATYPES.TYPE_FUNCTION) this.template_init();
                this.template_init = 0;
                this.properties.eic = 1;
                if (typeof this.local_template_init == DATATYPES.TYPE_FUNCTION) this.local_template_init(this);
                HemiEngine.message.service.publish("ontemplateload", this);
            };
            n._handle_load_template = function (s, v) {
                HemiEngine.logDebug("Handle load template");
                if (v && v.xdom) this.loadTemplateFromNode(v.xdom.documentElement);
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
                this.importEmbeddedScript(q);

                if (typeof this.getTemplateContainer == DATATYPES.TYPE_FUNCTION) o = this.getTemplateContainer();
                HemiEngine.xml.removeChildren(o);

                a = q.childNodes;
                for (i = 0; i < a.length; )
                    HemiEngine.xml.setInnerXHTML(o, a[i++], 1, 0, 0, 0, 0, this._handle_xhtml_token);

                /// check for any spaces in the loaded templates
                ///
                if (b) {
                    o.setAttribute("space-config", "self");
                    if (!this.properties.ei) {
                        HemiEngine.message.service.subscribe(this, "onspaceconfigload", "_handle_spaceconfig_load");
                        o.setAttribute("trid", this.object_id);
                        o.setAttribute("is-space", "1");

                        this.scopeHandler("template_processor", 0, 0, 1);
                        var oSpace = HemiEngine.app.space.service.createSpace(o, 0, this._prehandle_template_processor, this._handle_xhtml_token);
                    }
                    else {
                        x = HemiEngine.app.space.service.getSpace(this.properties.ei);
                        HemiEngine.app.space.service.configureSpace(x, "self");
                    }
                }
                else
                    this.InitializeTemplate();
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
                if (!s || !s.length) return;
                this.cleanTemplate();
                if (i) this.properties.tid = i;
                /// Use path for cache
                ///
                HemiEngine.xml.getXml(s, this._prehandle_load_template, 1);

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
