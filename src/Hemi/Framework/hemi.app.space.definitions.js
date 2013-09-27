/// <source>
/// <name>Hemi.app.space.definitions</name>
/// <project>
/// 	<name>Hemi JavaScript Framework</name>
/// 	<url-title>Hemi JavaScript Framework Project</url-title>
/// 	<url>/Hemi/</url>
/// </project>
///
/// <package>
///	<path>Hemi.app.space.definitions</path>
///	<library>Hemi</library>
///	<description>Application Space Definitions define the mapping between XML and XHTML nodes and JavaScript constructors.  The constructors can be from any framework or library, not just Hemi.</description>
(function () {
    HemiEngine.include("hemi.util.logger");
    HemiEngine.namespace("app.space.definitions", HemiEngine, {
        ///	<static-class>
        ///		<name>service</name>
        ///		<version>%FILE_VERSION%</version>
        ///		<description>Static implementation of hemi.app.space.definitions.serviceImpl</description>
        ///	</static-class>
        service: null,
        ///	<class>
        ///		<name>service</name>
        ///		<version>%FILE_VERSION%</version>
        ///		<description>This service defines space implementations for use by the Hemi Space Service.</description>
        serviceImpl: function () {
            var t = this;
            HemiEngine.util.logger.addLogger(t, "Space Definitions", "Application Space Definitions", "610");
            t.objects = {
                d: [],
                dm: []
            };

            /// <method>
            /// 	<name>clearDefinitions</name>
            /// 	<description>Clears all definitions.</description>
            /// </method>
            t.clearDefinitions = function () {
                this.objects.d.length = 0;
                this.objects.dm.length = 0;
            };
            /// <method>
            /// 	<name>newDefinition</name>
            ///		<param name="aMatchNodes" type="array">Array of node names that should match the specified constructor.</param>
            ///		<param name="sNameSpace" type="String" optional = "1">JavaScript Class namespace, such as MyCompany.MyLibrary.  If the value is "abstract", the definition is treated as a pass-through.</param>
            ///		<param name="sConstructor" type="String" optional = "1">JavaScript Class constructor, such as MyClass.</param>
            ///		<param name="aParams" type="array" optional = "1">Array of parameters to pass to the constructor.  The parameter values can use the Object Request Alias (ORA) for passing in node attribute values from the container (ora:attr_{name}), or object references such as the Space (space_element or space_object).  Refer to the internal Space _parseORAParam function for details.</param>
            ///		<param name="bSwitchContext" type="boolean" optional = "1">Bit indicating that an XML or XHTML node is returned from the constructor, and that the Space service should continue processing into the new object context.</param>
            ///		<param name="sContextPath" type="String" optional = "1">XPath to use to find the object context to switch into.</param>
            ///		<param name="sSwapName" type="String" optional = "1">Element name to use (e.g.: span) to swap a custom node, such is import-xml, to contain valid XHTML markup.</param>
            /// 	<return-value type = "object" name = "object">A new internal space definition.</return-value>
            /// 	<description>Creates a new implementation definition.  An implementation definition maps a node name to a specified constructor.</description>
            /// </method>
            t.newDefinition = function (a, n, c, p, b, s, w) {
                if (!a || a.length == 0) return null;

                var o = {
                    id: a[0],
                    match_ids: a,
                    namespace: (n != "abstract" ? n : 0),
                    is_abstract: (n == "abstract" ? 1 : 0),
                    constructor: c,
                    constructor_params: p,
                    context_switch: (b ? 1 : 0),
                    context_path: s,
                    swap_name: w,
                    use_parent: 0,
                    no_recursion: 0,
                    method_reference: 0,
                    method_reference_parameter: 0
                };
                return o;
            };
            t.addDefinition = function (a) {
                var _I = this.objects.d, _M = this.objects.dm, i = 0, b = 0, l;
                if (!a) {
                    t.logWarning("Invalid definition implementation");
                    return 0;
                }

                for (; i < a.match_ids.length; ) {
                    if (DATATYPES.TN(_M[a.match_ids[++i]])) {
                        b = a.match_ids[i];
                        break;
                    }
                }
                if (b) {
                    t.logWarning("Duplicate definition implementation '" + b + "'");
                    return;
                }
                l = _I.length;
                _I.push(a);
                for (i = 0; i < a.match_ids.length; i++) {

                    _M[a.match_ids[i]] = l;
                }
                return a;
            };
            t.getDefinition = function (n) {
                n = n.toLowerCase();
                var _I = this.objects.d, _M = this.objects.dm;
                if (!n || !DATATYPES.TN(_M[n])) return 0;
                return _I[_M[n]];
            };
            t.addDefinition(
				t.newDefinition(
					["html-fragment", "template", "fragment"],
					"abstract",
					0,
					1
				)
			);

            t.addDefinition(
				t.newDefinition(
					["import-dxml"],
					"Hemi.xml",
					"getXml",
					["ora:src_attr", "ora:integer_0", "ora:integer_0", "ora:id_attr", "ora:integer_1"],
					1,
					"ora:context-path_attr",
					"span"
				)
			);

            t.addDefinition(
				t.newDefinition(
					["import-xml"],
					"Hemi.xml",
					"getXml",
					["ora:src_attr", "ora:integer_0", "ora:integer_0", "ora:id_attr", "ora:integer_1"],
					1,
					"/html-fragment",
					"span"
				)
			);
            t.addDefinition(
				t.newDefinition(
					["import-style"],
					"Hemi.css",
					"loadStyleSheet",
					["ora:src_attr", "ora:id_attr"]
				)
			);
            t.addDefinition(
				t.newDefinition(
					["p", "span", "div", "body", "form", "input", "textarea", "select", "table", "tr", "td", "tbody", "thead", "th", "img", "ul", "ol", "li", "a", "iframe", "h1", "h2", "h3", "h4", "h5", "h6", "dl", "dd", "dt"],
					"hemi.object.xhtml",
					"newInstance",
					["ora:parent_element", "ora:node_context", "ora:rid_attr", "ora:space_id", "hemi.data.form.service", "ora:integer_0", "ora:integer_0", "ora:space_config"],
					0,
					0,
					0
				)
			);
        }
    }, 1);

} ());
///	</class>
/// </package>
/// </source>