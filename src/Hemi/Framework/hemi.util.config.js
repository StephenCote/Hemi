/// <source>
/// <name>Hemi.util.config</name>
/// <project>
/// 	<name>Hemi JavaScript Framework</name>
/// 	<url-title>Hemi JavaScript Framework</url-title>
/// 	<url>/Hemi/</url>
/// </project>
///
/// <package>
///		<path>Hemi.util</path>
/// 	<library>Hemi</library>
///		<description>The Configuration class imports and parses XML for providing application level configuration.</description>
///		<static-class>
///			<name>config</name>
///			<version>%FILE_VERSION%</version>
///			<description>Static initializer for new Config objects.</description>
///			<method>
///				<name>newInstance</name>
///				<param name = "s" type = "variant">XML Document representing config data, or string representing path to XML file.</param>
///				<param name = "h" type = "variant" optional = "1">String representinga function or a function pointer to be invoked when the config data has been loaded, if the loading is asynchronous.</param>
///				<param name = "a" type = "boolean" optional = "1" default = "false">Bit indicating whether the loading is asynchronous.</param>
///				<return-value type = "Config" name = "c">Returns a new Wire instance.</return-value>
///				<description>Creates and returns a new Config instance.</description>
///			</method>
///		</static-class>
///		<class>
///			<name>ConfigInstance</name>
///			<version>%FILE_VERSION%</version>
///			<description>Service for sending messages, and sending and receiving publication broadcasts.</description>

/*
	Author: Stephen W. Cote
	Email: wranlon@hotmail.com
	
	Copyright 2002, All Rights Reserved.
	
	Do not copy, archive, or distribute without prior written consent of the author.
*/

(function () {
    HemiEngine.namespace("util.config", HemiEngine, {

        newInstance: function (s, h, a) {
            var n = {
                objects: {
                    config: [],
                    config_map: [],
                    config_load_handler: 0
                },
                properties: {
                    config_path: 0,
                    /* config_loaded */
                    l: 0,
                    la: 0,
                    rn: 0,
                    epn: "config",
                    en: "param",
                    ann: "name",
                    avn: "value"
                }
            };

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


            ///		<method>
            ///			<name>setElementParentName</name>
            ///			<param name = "n" type = "String">Name of the root element containing the config data.</param>
            ///			<description>Specifies the root element that holds the config data.</description>
            ///		</method>
            n.setElementParentName = function (s) {
                this.properties.epn = s;
            };

            ///		<method>
            ///			<name>setElementName</name>
            ///			<param name = "n" type = "String">Name of the element containing and individual config item.  The default value is <i>param</i>.</param>
            ///			<description>Specifies the element that holds a single config item.</description>
            ///		</method>
            n.setElementName = function (s) {
                this.properties.param_child_name = s;
            };

            ///		<method>
            ///			<name>setAttrNameName</name>
            ///			<param name = "n" type = "String">Name of the attribute used to identify a config data item.  The default value is <i>name</i>.</param>
            ///			<description>Specifies the attribute used to identify the config data name.</description>
            ///		</method>
            n.setAttrNameName = function (s) {
                this.properties.ann = s;
            };


            ///		<method>
            ///			<name>setAttrValueName</name>
            ///			<param name = "n" type = "String">Name of the attribute used to identify a config data value.  The default value is <i>value</i>.</param>
            ///			<description>Specifies the attribute used to identify the config data value.</description>
            ///		</method>
            n.setAttrValueName = function (s) {
                this.properties.avn = s;
            };

            ///		<method>
            ///			<name>clearConfig</name>
            ///			<description>Clears internal hashmaps of config data.</description>
            ///		</method>
            n.clearConfig = function () {
                var t = this, _p;
                _p = t.objects;

                _p.config = [];
                _p.config_map = [];

            };

            ///		<method>
            ///			<name>destroy</name>
            ///			<description>Clears internal pointers and data, preparing the object for destruction.</description>
            ///		</method>
            n.destroy = function () {
                var t = this;
                if (t.ready_state != 5) {
                    HemiEngine.message.service.unsubscribe(t, "onloadxml", "_handle_load_xml");
                    t.clearConfig();
                    t.objects.config_load_handler = 0;
                }
            };

            ///		<method>
            ///			<name>sigterm</name>
            ///			<description>Sends a termination signal to this object, causing it to be destroyed.</description>
            ///		</method>
            n.sigterm = function () {
                this.destroy();
            };

            ///		<method>
            ///			<name>reload</name>
            ///			<description>Clears internal hashmaps and reloads config data from original source.</description>
            ///		</method>
            n.reload = function () {
                var t = this, _s, _p;
                t.clearConfig();
                _s = t.properties;
                _p = t.objects;
                if (_s.config_path) {
                    t.load(_s.config_path, _p.config_load_handler, _s.la);
                }
            };
            ///		<method>
            ///			<name>init</name>
            ///			<description>Initializes an empty configuration.</description>
            ///		</method>
            n.init = function () {
                var t = this;
                t.ready_state = 4;
                t.properties.l = 1;
                t.properties.rn = "web-application";
            };

            ///		<method>
            ///			<name>load</name>
            ///			<param name = "p" type = "String">Path to the XML-based configuration.</param>
            ///			<param name = "h" type = "function" optional = "1">Function pointer to be invoked when the config data has been loaded, if the loading is asynchronous.</param>
            ///			<param name = "a" type = "boolean" optional = "1" default = "false">Bit indicating whether the loading is asynchronous.</param>
            ///			<description>Loads the specified configuration file.</description>
            ///		</method>
            n.load = function (s, h, a) {
                /*
                s = source
                a = async?
                h = handler if async
                */
                var t = this, o, c;
                t.objects.config_load_handler = (DATATYPES.TF(h) ? h : 0);
                t.properties.config_path = s;
                t.properties.la = a;

                o = HemiEngine.xml.getXml(s, null, a, t.object_id);

                /*
                If not asynchronous, then parse the result right now.
					
                02/13/2003 - parse right now, but block parsing in the handler for sync requests.
                */
                if (!a)
                    t._parse_config(o);



            };

            n._handle_load_xml = function (s, v) {
                var t = this;

                /* Only invoke the parse method if the xml file was loaded asynchronously */
                if (v.id == t.object_id && t.properties.la) {
                    this._parse_config(v.xdom);
                }
            };

            ///		<method>
            ///			<name>getParams</name>
            ///			<return-value name = "a" type = "array">Array of ConfigObjects</return-value>
            ///			<description>Returns an array of ConfigObjects.</description>
            ///		</method>
            n.getParams = function () {
                return this.objects.config;
            };

            ///		<method>
            ///			<name>serialize</name>
            ///			<param name = "XMLDocument" type = "XMLDocument" optional= "1">XMLDocument onto which the parameters are serialized.</param>
            ///			<return-value name = "xml" type = "XMLDocument">XMLDocument representing the parameters.</return-value>
            ///			<description>Serializes the current configuration into an XML document.</description>
            ///		</method>
            n.serialize = function (x) {
                var t = this, c, o, l, i = 0, x, p;
                l = t.objects.config.length;
                if (!t.properties.rn) return null;
                if (!x) x = HemiEngine.xml.newXmlDocument(t.properties.rn);

                p = x.createElement(t.properties.epn);
                x.documentElement.appendChild(p);
                for (; i < l; i++) {
                    if (t.objects.config[i].value == null || DATATYPES.TU(t.objects.config[i].value)) continue;
                    o = x.createElement(t.properties.en);
                    p.appendChild(o);
                    o.setAttribute(t.properties.ann, t.objects.config[i].name);
                    o.setAttribute(t.properties.avn, "#cdata");
                    o.appendChild(x.createCDATASection(t.objects.config[i].value));

                }
                return x;
            };
            ///		<method>
            ///			<name>writeParam</name>
            ///			<param name = "XMLDocument" type = "XMLDocument">XMLDocument onto which the parameters are serialized.</param>
            ///			<param name = "name" type = "String">String representing the name of the config value.</param>
            ///			<param name = "value" type = "String">String representing the value.</param>
            ///			<return-value name = "b" type = "boolean">Bit indicating whether the operation succeeded</return-value>
            ///			<description>Sets a parameter value.</description>
            ///		</method>

            n.writeParam = function (o, x, v) {
                var t = this, c, p, n, b = (v == null || DATATYPES.TU(v));
                /// if(!o || !x) return 0;
                p = o.documentElement.getElementsByTagName(t.properties.epn);
                if (p.length) p = p[0];
                else {
                    p = o.createElement(t.properties.epn);
                    o.documentElement.appendChild(p);
                }
                n = HemiEngine.xml.selectSingleNode(o, t.properties.en + "[@" + t.properties.ann + " = '" + x + "']", p);
                if (n && b)
                    p.removeChild(n);
                else if (!b) {
                    if (!n) {
                        n = o.createElement(t.properties.en);
                        n.setAttribute(t.properties.ann, x);
                        p.appendChild(n);
                    }
                    else HemiEngine.xml.removeChildren(n);

                    n.setAttribute(t.properties.avn, "#cdata");
                    n.appendChild(o.createCDATASection(v));
                }
                /// HemiEngine.log("Write Param " + x + "=" + v);
                return t.setParam(x, v);
            };

            ///		<method>
            ///			<name>setParam</name>
            ///			<param name = "name" type = "String">String representing the name of the config value.</param>
            ///			<param name = "value" type = "String">String representing the value.</param>
            ///			<return-value name = "b" type = "boolean">Bit indicating whether the operation succeeded</return-value>
            ///			<description>Sets a parameter value.</description>
            ///		</method>
            n.setParam = function (x, v) {
                var t = this, c, o, l;
                if (!t.properties.l) return null;

                /// Value exists, so overwrite
                ///
                if (DATATYPES.TN(t.objects.config_map[x]))
                    if (t.objects.config[t.objects.config_map[x]]) {
                        if (v == null || DATATYPES.TU(v)) {
                            HemiEngine.logWarning("Nullify object ref for " + x + " with value " + v);
                            delete t.objects.config_map[x];
                            t.objects.config_map[x] = null;
                        }
                        else {
                            t.objects.config[t.objects.config_map[x]].value = v;
                        }
                    }
                    else return 0;
                else if (v != null && !DATATYPES.TU(v)) {
                    HemiEngine.log("Set param: " + x + "=" + v + " at " + t.objects.config.length);
                    t.objects.config_map[x] = t.objects.config.length;
                    t.objects.config[t.objects.config.length] = { "name": x, "value": v };
                }

                return 1;
            };

            ///		<method>
            ///			<name>getParam</name>
            ///			<param name = "x" type = "variant">String or integer representing the index or name of the config value to return.</param>
            ///			<return-value name = "v" type = "String">Value of the specified ConfigObject.</return-value>
            ///			<description>Returns the value of the specified ConfigObject.</description>
            ///		</method>
            n.getParam = function (x) {
                var t = this, c, o;
                if (!t.properties.l) return null;
                HemiEngine.log("Lookup param " + x + " :: " + t.objects.config_map[x]);
                if (DATATYPES.TS(x))
                    x = t.objects.config_map[x];

                if (DATATYPES.TN(x) && DATATYPES.TO(t.objects.config[x]))
                    return t.objects.config[x].value;
                HemiEngine.logWarning("Param " + x + " not found");
                return null;
            };

            ///		<object internal = "1">
            ///		<name>ConfigObject</name>
            ///		<property name = "name" type = "String">The name of the config key.</property>
            ///		<property name = "value" type = "String">The value of the config key.</property>
            ///		</object>

            ///		<method internal = "1">
            ///			<name>parseConfig</name>
            ///			<param name = "o" type = "XMLDocument">XML Document representing the config data.</param>
            ///			<description>Parses the specified XML document for config data.</description>
            ///		</method>
            n.parseConfig = function (o) {
                return this._parse_config(o);
            };

            n._parse_config = function (o) {
                var t = this, c, p, i = 0, a, n, v;
                t.ready_state = 3;
                if (DATATYPES.TO(o) && o.documentElement != null) {
                    t.properties.l = 1;
                    if (!t.properties.rn) t.properties.rn = o.documentElement.nodeName;

                    a = HemiEngine.xml.queryNodes(o.documentElement, t.properties.epn, t.properties.en, 0, 0); /*HemiEngine.xml.selectNodes(o,t.properties.epn + "/" + t.properties.en,o.documentElement);*/

                    for (; i < a.length; i++) {
                        p = a[i];
                        n = p.getAttribute(t.properties.ann);
                        if (DATATYPES.TS(n) && n.length > 0) {
                            v = p.getAttribute(t.properties.avn);
                            if (!DATATYPES.TS(v)) v = "";

                            t.objects.config_map[n] = t.objects.config.length;

                            if (v == "#cdata" && p.hasChildNodes())
                                v = HemiEngine.xml.getCDATAValue(p);

                            t.objects.config[t.objects.config.length] = { "name": n, "value": v };
                        }
                    }

                    t.ready_state = 4;
                }
                else {
                    HemiEngine.logError("Null document element");
                }

                if (DATATYPES.TF(t.objects.config_load_handler)) {
                    t.objects.config_load_handler("onconfigload", this);
                }

            };

            HemiEngine._implements(n, "base_object", "config_utility", "%FILE_VERSION%");
            HemiEngine.registry.service.addObject(n);



            /*
            Use the message service to pick up the xml loaded event for asynchronous
            operations because:
            - the handler loses its scope to the object instance
            - and that's bad
					
            Doing so means that the handler must correctly identify the config
				
				
            02/13/2003 - I switched it over to using just a function pointer because I can't repro the problem, and it seems lame to have to use the subscription
            Addendum - Ok, found the problem.  It loses context for parts of the object -- very weird.  So, this work around is valid again.
					
            Repro example:
            Specify the handler as a pointer instead of using the message
            Try to alert this.object_id - this should work
            Now, try to alert some other function or property that is not part of the base object definition.  This fails.
            */

            HemiEngine.message.service.subscribe(n, "onloadxml", "_handle_load_xml");

            if (DATATYPES.TS(h) && DATATYPES.TF(window[h])) {
                h = window[h];
            }

            if (DATATYPES.TS(s)) {
                if (!a) a = 0;
                n.load(s, h, a);
            }

            else if (DATATYPES.TO(s) && s != null) {
                n._parse_config(s);
            }

            else if (DATATYPES.TU(s)) {
                /*
                alert(h);
                n.ready_state = 4;
                n.status.l = 1;
                n.status.rn = "Config";
                */
            }

            return n;

        }
    });
} ());

/// </class>
/// </package>
/// </source>
///