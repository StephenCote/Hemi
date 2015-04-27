
/// <source>
/// <name>Hemi.object.xhtml</name>
/// <project>
/// 	<name>Hemi JavaScript Framework</name>
/// 	<url-title>Hemi JavaScript Framework Project</url-title>
/// 	<url>/Hemi/</url>
/// </project>
///
/// <package>
///		<path>Hemi.object.xhtml</path>
/// 	<library>Hemi</library>
///		<description>The XHTML Component class is used to represent an XHTML Node within the Hemi Framework as a registered object. This class also coordinates the XHTML Node with referenced Application Components, Modules, Templates, Distributed Application Components, and Virtual Forms, and is used with Application Spaces as an Application Space Definition.</description>
///		<static-class>
///			<name>XHTMLComponent</name>
///			<version>%FILE_VERSION%</version>
///			<description>Factory for creating XHTMLComponentInstance objects, which represent a XHTML objects (HTML nodes) within the framework.</description>

/// <example>
///		<description>Demonstrate how an XHTMLInstanceObject is created from an HTML Node.  Also refer to Application Components, which connect an XHTMLInstanceObject to pre-defined code blocks.</description>
///		<name>Create an XHTMLComponentInstance from an HTML Node</name>
///		<code><![CDATA[<!-- HTML Source -->]]></code>
///		<code><![CDATA[<div id = "oDiv">Some node</div>]]></code>
///		<code><![CDATA[<!-- Script -->]]></code>
///		<code><![CDATA[<script type = "text/javascript">]]></code>
///		<code>var o = document.getElementById("oDiv");</code>
///		<code>/// Create an XHTMLComponentInstance that can be used</code>
///		<code>/// To reference the node within the framework.</code>
///		<code>var oX = Hemi.object.xhtml.newInstance(o.parentNode,o);</code>
///		<code><![CDATA[</script>]]></code>
///	</example>
///			<method>
///				<name>newInstance</name>
///				<param name = "hp" type = "object">HTML Node in which the XHTML Component will be created.</param>
///				<param name = "xp" type = "object">XHTML Node for which the XHTML Component will be created.</param>
///				<param name = "cid" type = "String" optional = "1">String representing the id to give to the component.</param>
///				<param name = "rid" type = "String" optional = "1">String representing the reference id of an Engine object.</param>
///				<param name = "cc" type = "object" optional = "1">Object representing a component collection, such as XHTMLFormComponent.</param>
///				<param name = "cn" type = "String" optional = "1">String representing a component name.  The component name refers to an ApplicationComponent.</param>
///				<param name = "cp" type = "String" optional = "1">String representing the path to an ApplicationComponent file.</param>
///				<param name = "cf" type = "String" optional = "1">String representing the name of the calling configuration.  This is used when making self configuration declarations with an EngineService.</param>
///				<return-value type = "XHTMLComponentInstance" name = "c">Returns a new XHTMLComponentInstance.</return-value>
///				<description>Creates and returns a new XHTMLComponentInstance instance.</description>
///			</method>
///		</static-class>
///		<class>
///			<name>XHTMLComponentInstance</name>
///			<version>%FILE_VERSION%</version>
///			<description>An object representing a XHTML object (HTML node) to the framework.</description>

/*
	Author: Stephen W. Cote
	Email: wranlon@hotmail.com
	
	Copyright 2002, All Rights Reserved.
	
	Do not copy, archive, or distribute without prior written consent of the author.
*/
(function () {
    HemiEngine.namespace("object.xhtml", HemiEngine, {
        bind: function (o) {
            return HemiEngine.object.xhtml.newInstance(o.parentNode, o);
        },
        newInstance: function (hp, xn, cid, rid, cc, cn, cp, cf) {
            /*
            hp = html_parent
            xn = xhtml_node
            cid = component_id (eg: friend_name)
            rid = reference_id (eg: engine id)
            cc = component_collection (eg: XHTMLFormComponent)
            cn = component name
            cp = component path
            cf = component config name
            */

            /// <property type = "object" get = "1">
            /// <name>properties</name>
            /// <description>A hash of primitive values (strings, ints, etc) for storing configuration, settings, and status.</description>
            /// </property>

            /// <property type = "object" get = "1">
            /// <name>objects</name>
            /// <description>A hash of object values for storing named object references.</description>
            /// </property>

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

            /*
            If hp is a parent node, and xn is an XML node, then the node is duplicated.
				
            If hp is an object and xn is a number, then hp is assumed to be a reference node.
            */
            if (!xn) return null;
            if (!hp && DATATYPES.TO(xn)) hp = document;
            if (!cid) {
                /* Typeof Unknown won't work with this */
                /* !DATATYPES.TU(xn.getAttribute) */
                if (xn.nodeType == 1 && typeof xn.getAttribute != DATATYPES.TYPE_UNDEFINED) {
                    cid = xn.getAttribute("id");

                    if (cid == null || cid.length == 0) cid = xn.getAttribute("name");
                    if (cid == null || cid.length == 0) cid = 0;
                }
                else
                    cid = 0;
            }

            if (!cc) cc = 0;
            if (DATATYPES.TS(cc)) cc = HemiEngine.lookup(cc);


            var n = HemiEngine._forName("base_object", "xhtml_component", "%FILE_VERSION%");
            /*
            var mhx = (DATATYPES.TN(xn) ? Hemi.GetSpecifiedAttribute(hp,"hxid") : Hemi.GetSpecifiedAttribute(xn, "hxid"));
            if(mhx){
            var xo = Hemi.registry.service.getObject(hp.getAttribute("hxid"));
            if(xo){
            HemiEngine.logWarning("Duplicate XHTML Object Discovered");
            return xo;
            }
            else hp.setAttribute("hxid", n.getObjectId());
            }
            */
            n.objects = {
                /* container object */
                c: 0,
                /* html parent */
                r: hp,
                /* component collection */
                cc: cc,
                /* application component */
                a: 0
            };
            n.properties = {
                rid: rid,
                cid: cid,
                /* component name */
                cn: cn,
                /* component config path */
                cp: cp,
                /* config name */
                cf: cf,
                /* linked component bit */
                lcp: 0,
                /* quick-template path */
                qt: 0,
                /* module path */
                mp: 0
            };

            /// <method>
            /// <name>getComponentCollection</name>
            /// <return-value name = "c" type = "object">Component collection (eg: XHTMLFormComponent).</return-value>
            /// <description>Returns any component collection that was included when the object was created.</description>
            /// </method>
            n.getComponentCollection = function () {
                return this.objects.cc;
            };
            /// <method>
            /// <name>getIsComponentLinked</name>
            /// <return-value name = "i" type = "bit">Bit indicating whether the object is linked with a component collection (eg: to XHTMLFormComponent).</return-value>
            /// <description>Returns a bit indicating whether the object is linked.</description>
            /// </method>
            n.getIsComponentLinked = function () {
                return this.properties.lcp;
            };
            /* getContainer is commonly used by the engine syntax parser when adding xhtml as xml into the live DOM for an object instance */
            /// <method>
            /// <name>getContainer</name>
            /// <return-value name = "o" type = "object">The XHTML/HTML object created based on the specified values when the instance was created.</return-value>
            /// <description>Returns the component container object.  For example, if a component was created from an XHTML import &lt;div /&gt; then the HTML version of that node is the container.</description>
            /// </method>
            ///
            n.getContainer = function () {
                return this.objects.c;
            };

            /// <method>
            /// <name>getComponentId</name>
            /// <return-value name = "i" type = "String">Returns the component id which was specified when the XHTMLComponent was created.</return-value>
            /// <description>Returns the component id.  The component id is used as a friendly name reference to Engine objects and Component Collections such as XHTMLFormComponent.</description>
            /// </method>
            ///
            n.getComponentId = function () {
                return this.properties.cid;
            };

            /// <method>
            /// <name>getComponentId</name>
            /// <return-value name = "i" type = "String">Returns the reference id which was specified when the XHTMLComponent was created.</return-value>
            /// <description>Returns the reference id.  For example, the reference id could be an Engine object for which the XHTMLComponent was created.</description>
            /// </method>
            ///
            n.getReferenceId = function () {
                return this.properties.rid;
            };

            /// <method>
            /// <name>getApplicationComponent</name>
            /// <return-value name = "i" type = "ApplicationComponent">Returns any underlying ApplicationComponent object.</return-value>
            /// <description>Returns any underlying ApplicationComponent object.  For example, if a component name, component path, and component config name were specified when the instance was created, then the corresponding ApplicationComponent would be returned.</description>
            /// </method>
            ///
            n.getApplicationComponent = function () {
                var _p = this.objects;
                if (_p.a) return _p.a;
                return 0;
            };

            n.setApplicationComponent = function (a) {
                var _p = this.objects;
                if (!_p.a) _p.a = a;
            };

            ///		<method>
            ///			<name>sigterm</name>
            ///			<description>Sends a termination signal to this object, causing it to be destroyed.</description>
            ///		</method>
            n.sigterm = function () {
                this.destroy();
            };

            ///		<method>
            ///			<name>destroy</name>
            ///			<description>Clears internal pointers and data, preparing the object for destruction.</description>
            ///		</method>
            n.destroy = function () {
                var _p, t = this, _s;
                _p = t.objects;
                _s = t.properties;

                if (t.ready_state != 5) {

                    if (_p.cc && _s.cid)
                        _p.cc.synchronizeComponent(t);


                    if (_p.a) _p.a.destroy();

                    if (_p.c && _p.r && _p.c.parentNode == _p.r && (!_s.cf || _s.cf != "self"))
                    /// HemiEngine.log("XHTML Remove node");
                        _p.r.removeChild(_p.c);

                    /// else HemiEngine.log("Didn't clean up because " + _p.c + ":" + _p.r + ":" + _s.cf);
                    HemiEngine.registry.service.removeObject(t);
                    /// HemiEngine.log("Cleanup " + t.object_id);

                    /*
                    * 2004/07/22
                    * Clean up object references
                    */
                    _p.c = 0;
                    _p.r = 0;
                    _p.cc = 0;
                    _p.a = 0;

                    t.ready_state = 5;
                }

            };

            ///		<method internal = "1">
            ///			<name>init_component</name>
            ///			<description>Initializes the instance of this object.</description>
            ///		</method>
            n.init_component = function () {
                var t = this,
					o,
					p,
					_s = t.properties,
					_p = t.objects,
					_ac = HemiEngine.lookup("hemi.app.comp"),
					_am = HemiEngine.lookup("hemi.app.module"),
					i,
					d,
					a,
					dc,
					dp,
					_dw = HemiEngine.lookup("hemi.app.dwac")
				;
                if (DATATYPES.TO(hp) && DATATYPES.TO(xn) && (!_s.cf || _s.cf != "self"))
                    o = HemiEngine.xml.setInnerXHTML(hp, xn, 1, 0, 1);

                else if (DATATYPES.TO(xn))
                    o = xn;

                else
                    o = hp;

                if (!HemiEngine.IsAttributeSet(o, "hemi-id")) o.setAttribute("hemi-id", n.object_id);
                if (_s.rid && o && !o.getAttribute("space-id")) o.setAttribute("space-id", _s.rid);

                t.objects.c = o;

                i = (_s.cn ? _s.cn : (_ac ? (o.getAttribute(_ac.properties.x) ? o.getAttribute(_ac.properties.x) : o.getAttribute(_ac.properties.c)) : 0));

                /// If a component name was specified
                ///
                if (i) {
                    /// If a component path was specified in the constructor
                    ///
                    if (_s.cp) {
                        dp = _s.cp;
                    }
                    else if (_ac && HemiEngine.IsAttributeSet(o, _ac.properties.x)) {
                        if (i.match(/\.xml/)) {
                            dp = i;
                            i = i.match(/(component\.)?([\S][^\.\/]*)\.xml/)[2];
                        }
                        else {
                            dp = HemiEngine.hemi_base + "Components/component." + i.toLowerCase() + ".xml";
                        }
                    }
                    /// Check for an inline appcomp_path attribute
                    ///
                    else if (_ac && (a = o.getAttribute(_ac.properties.q)) && a.length > 0) {
                        dp = a;
                    }
                    else {
                        /// Otherwise, check for the path in the configuration
                        ///
                        a = o.getAttribute(_ac.properties.g);
                        if (!a || a.length == 0) a = _ac.properties.k;

                        /*
                        dc = org.cote.js.util.driver.ApplicationDriver.getConfig();
                        if(dc) dp = dc.getParam(a);
                        */
                    }
                    if (dp && _ac) {
                        _p.a = _ac.bindComponent(t.object_id, i, dp, 0, 1);

                    }
                    else {
                        HemiEngine.message.service.sendMessage("Component binding to " + dp + " for " + i + " using " + a + " failed.", "200.4");
                    }

                }
                /* If a quick-template was specified */
                else if (_ac && (dp = o.getAttribute(_ac.properties.t))) {
                    _p.a = _ac.newInstance(0, 0, this.getObjectId(), 0, 0, 1);
                    _p.a.setTemplateIsSpace(1);
                    /// Remove the space attribute to promote this element into its own space
                    ///
                    /// o.removeAttribute("space-id");
                    if (!dp.match(/\.xml$/) && !dp.match(/\//))
                        _s.qt = "Templates/" + dp + ".xml";
                    else _s.qt = dp;
                    _p.a.importComponentDefinition("", 0, _s.rid);
                }
                /* If a quick module was specified */

                else if (_am && (p = HemiEngine.GetSpecifiedAttribute(o, "module")) && p != null)
                    _s.mp = p;

                else if (_dw && (i = o.getAttribute(_dw.atkey)) != null && i.length > 0) {
                    /// Remove the space attribute to promote this element into its own space
                    ///
                    /// o.removeAttribute("space-id");
                    _p.a = _dw.newInstance(t, o.getAttribute(_dw.aturi), o.getAttribute(_dw.attid), o.getAttribute(_dw.attk));
                }

                t.ready_state = 4;

            };

            /*
            post_init is invoked by the engine service
            */
            ///		<method internal = "1">
            ///			<name>post_init</name>
            ///			<description>Post initializes the object to add it to a component collection.  This is invoked internally when using the EngineService for a specific Engine object.</description>
            ///		</method>
            n.post_init = function () {
                var _s = this.properties, _p = this.objects;

                if (_p.cc && DATATYPES.TF(_p.cc.addComponent) && _p.cc.addComponent(this, _s.rid)) _s.lcp = 1;
                /* drop the collection pointer if it's not used */
                else _p.cc = 0;

                if (_p.a) {
                    if (_s.qt)
                        _p.a.loadTemplate(_s.qt);

                    /// If there is an application component and it defines a post_init, then invoke it
                    if (DATATYPES.TF(_p.a.post_init)) _p.a.post_init(this, _s.rid);
                }
                else if (_s.mp)
                    HemiEngine.app.module.service.NewModule(_s.mp, this);

            };

            HemiEngine.registry.service.addObject(n);
            n.init_component();

            return n;
        }
    });
} ());

/// </class>
/// </package>
/// </source>
///