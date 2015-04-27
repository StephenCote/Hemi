/// <source>
/// <name>Hemi.app.module</name>
/// <project>
/// 	<name>Hemi JavaScript Framework</name>
/// 	<url-title>Hemi JavaScript Framework Project</url-title>
/// 	<url>/Hemi/</url>
/// </project>
///
/// <package>
///	<path>Hemi.app.module</path>
///	<library>Hemi</library>
///	<description>Modules are external script instrumented with a basic API to operate within the Hemi framework and be included in the Hemi.registry service.  Similar to Application Components, the concept permits a typical external JavaScript format but which operates within its own namespace.  The module class also includes basic support for unit testing, so that modules may be quickly written to act as externally loaded unit tests.  For example, the <a href = "../Tests/test.app.comp.js">Application Component Tests</a> includes several unit tests for vetting the Application Component class.</description>
(function () {
	HemiEngine.include("hemi.object");
	HemiEngine.include("hemi.util.logger");
	HemiEngine.namespace("app.module", HemiEngine, {
		///	<static-class>
		///		<name>service</name>
		///		<version>%FILE_VERSION%</version>
		///		<description>Static implementation of the hemi.app.module.serviceImpl class.</description>
		///
		///
		///	</static-class>
		///	<class>
		///		<name>serviceImpl</name>
		///		<version>%FILE_VERSION%</version>
		///		<description>The module service provides a convenience for modularizing and managing standard JavaScript as reusable components and tests.</description>
		///

		service: null,

		serviceImpl: function () {
			var t = this;
			HemiEngine.prepareObject("module_service", "%FILE_VERSION%", 0, t);

			HemiEngine.util.logger.addLogger(t, "Module Service", "Application Module Service", "620");
			HemiEngine.object.addObjectAccessor(t, "module");

			/// <method>
			/// 	<name>NewModule</name>
			///		<param name="sName" type="String">Name of the Module</param>
			///		<param name="oContainer" type="XHTMLComponent" optional = "1">XHTML Component acting as a container for the module.</param>
			///		<param name="sPath" type="String" optional = "1">Path where the module resides.</param>
			///		<param name="oModuleService" type="FrameworkObject" optional = "1">A framework object for which a <i>decorateModule</i> method is defined.</param>
			///     <param name = "bPathIsContent" type = "boolean" optional = "1">Bit indicating that the path is the text of the module to load.</param>
			///     <param name = "sType" type = "String" optional = "1" default = "module">Alternate module type for reference implementations.</param>
			/// 	<return-value type = "Module" name = "oModule">A new Module object.</return-value>
			/// 	<description>Creates a new Module object.</description>
			/// </method>
			t.NewModule = function (n, x, p, d, b, q) {
				var m = this.LoadModule(n, p, d, b, q), v;
				if (!m) return null;
				var v = new m.impl();
				if (x) {
					v.Container = x;
					if (DATATYPES.TF(x.getObjectType) && x.getObjectType().match(/xhtml_component/)) {
						v.Container = x.getContainer();
						v.Component = x;
					}
				}
				/// vMod._IMod();
				if (DATATYPES.TF(v.Initialize)) v.Initialize();
				return v;
			};
			/// <method>
			/// 	<name>UnloadModuleImplementations</name>
			///		<param name="sModule" type="String">Name of the Module</param>
			/// 	<return-value type = "boolean" name = "bRemoved">Bit indicating whether the module implementations were removed.</return-value>
			/// 	<description>Destroys all module implementations for the specified module.</description>
			/// </method>
			t.UnloadModuleImplementations = function (v) {
				var o = t.getModuleByName(v), i = 0, m;
				if (!o) return 0;
				for (var i = 0; i < o.Impls.length; i++) {
					if (!o.Impls[i]) continue;
					m = HemiEngine.registry.service.getObject(o.Impls[i]);
					/// Modules use the hemi.object.addObjectDeconstructor
					/// So, destroy is present (or it's a bug) and invoking destroy will also
					/// clean up the object.
					if (m)
						m.destroy();
				}
				o.Impls = [];
				return 1;
			};
			/// <method>
			/// 	<name>UnloadModule</name>
			///		<param name="sModule" type="String">Name of the Test Module</param>
			/// 	<return-value type = "boolean" name = "bRemoved">Bit indicating whether the module was removed.</return-value>
			/// 	<description>Unloads the specified module.</description>
			/// </method>
			t.UnloadModule = function (v) {
				var o = t.getModuleByName(v), b = 0, i, m;
				if (!o) return b;
				t.UnloadModuleImplementations(v);
				HemiEngine.dereference(v);
				/*
				if (DATATYPES.TN((i = HemiEngine.LibraryMap[v]))) {
				delete HemiEngine.LibraryMap[v];
				delete HemiEngine.Libraries[i];
				}
				*/
				return t.removeModule(o);
			};
			/// <method internal = "1">
			/// 	<name>LoadModule</name>
			///		<param name="sName" type="String">Name of the Module</param>
			///		<param name="sPath" type="String" optional = "1">Path to the modules directory.</param>
			///		<param name="sDecoration" type="String" optional = "1">Additional script to include in the module prior to the module being instantiated.</param>
			///     <param name = "bPathIsContent" type = "boolean" optional = "1">Bit indicating that the path is the text of the module to load.</param>
			///     <param name = "sType" type = "String" optional = "1" default = "module">Alternate module type for reference implementations.</param>
			/// 	<return-value type = "Module" name = "oModule">A new Module object.</return-value>
			/// 	<description>Loads a Module definition.</description>
			/// </method>
			t.LoadModule = function (n, p, d, b, q) {
				var m = this.getModuleByName(n), o, s = "", r, x;
				if (m)
					return m;
				if (b) x = p;
				else {
					o = HemiEngine.include(n, (p ? p : "Modules/"), 1);
					if (!o || !o.raw) {
						HemiEngine.logError("Failed to load module: " + n);
						return 0;
					}
					x = o.raw;
				}

				if (d && DATATYPES.TF(d.DecorateModuleContent))
					s = d.DecorateModuleContent(n, p, x);
				/// <object>
				///	<name>ModuleBase</name>
				/// 	<description>The ModuleBase is the raw definition from which a Module implementation is created.</description>
				///		<property type = "String[]" get = "1" name = "Impls">An array of object ids representing instances of this ModuleBase.</property>
				/// </object>
				/// <object>
				///	<name>Module</name>
				/// 	<description>A Module encapsulates the imported JavaScript and an API for operating within the framework.</description>
				///		<method virtual = "1">
				///			<name>Initialize</name>
				/// 		<description>Invoked when the module is loaded.</description>
				///		</method>
				///		<method virtual = "1">
				///			<name>Unload</name>
				/// 		<description>Invoked when the module is unloaded or destroyed.</description>
				///		</method>
				///		<property type = "XHTMLComponent" get = "1" name = "Component">A pointer to an underlying XHTMLComponent, if the module is bound to an HTML element via an XHTMLComponent.</property>
				///		<property type = "String" get = "1" name = "name">The name of the module.</property>
				///		<property type = "Module" get = "1" name = "Module">An anonymous pointer to the Module instance, for refering to the instance from the anonymous scope enclosure.</property>
				///		<property type = "Node" get = "1" name = "Container">A pointer to the XHTML Node for which the module was loaded.</property>
				///		<property type = "XHTMLComponent" get = "1" name = "Component">A pointer to the XHTMLComponent created for any Container, if a Container was used.</property>
				/// </object>

				r = "(function(){" + (d && d.DecorateModuleHeader ? d.DecorateModuleHeader(n, p, x) : "") + "\nHemiEngine.app.module.service.Register(\"" + n + "\",{ impl : func" + "tion(){"
				+ (s ? s + "\n" : "")
				+ x
				+ "\nthis.Component = null;"
				+ "this.Container = null;"
                + "var Module = null;"
                + "this.name = \"" + n + "\";"
				///+ "this._IMod = function(){ Module = this; };"
                + "this.object_prepare = function(){ Module = this; HemiEngine.app.module.service.AddImpl(\"" + n + "\",this.object_id);};"
                + "this.object_destroy = function(){if(DATATYPES.TF(this.Unload)){this.Unload();}};"
                + "HemiEngine.prepareObject(\"" + (q ? q : "module") + "\",\"%FILE_VERSION%\",1,this,1);"
                + "this.ready_state = 4;"
				+ "},"
                + "Impls : [],"
                + "name : \"" + n + "\""
                + "});}());";

				r = r.replace(/^\s+/, "").replace(/\s+$/, "");
				/// if(!b) o.raw = x;
				/*
				var oT = document.createElement("textarea");
				document.body.appendChild(oT);
				oT.value = r;
				*/
				try {
					eval(r);
				}
				catch (e) {
					HemiEngine.logError("Error loading module '" + n + "'\n\n" + (e.message ? e.message : e.description));
					return 0;
				}

				m = this.getModuleByName(n);
				if (!m) {
					HemiEngine.logError("Module could not be retrieved");
					return 0;
				}
				return m;

			};
			/// <method virtual = "1">
			/// 	<name>DecorateModuleHeader</name>
			///		<param name="sName" type="String">Name of the Module</param>
			///		<param name="sPath" type="String">Path to the Module</param>
			///		<param name="sRaw" type="String">The raw imported text of the module.</param>
			/// 	<return-value type = "String" name = "sDecoration">A value to be included in the module header prior to the module being instantiated.</return-value>
			/// 	<description>Decorates a module header.</description>
			/// </method>
			/// <method virtual = "1">
			/// 	<name>DecorateModuleContent</name>
			///		<param name="sName" type="String">Name of the Module</param>
			///		<param name="sPath" type="String">Path to the Module</param>
			///		<param name="sRaw" type="String">The raw imported text of the module.</param>
			/// 	<return-value type = "String" name = "sDecoration">A value to be included in the module prior to the module being instantiated.</return-value>
			/// 	<description>Decorates a module content.</description>
			/// </method>
			/// <method internal = "1">
			/// 	<name>Register</name>
			///		<param name="sName" type="String">Name of the Module</param>
			///		<param name="vContent" type="Hash">Object hash representing the module API.</param>
			/// 	<return-value type = "object" name = "object">Internal module object.</return-value>
			/// 	<description>Registers a Module object.</description>
			/// </method>
			t.Register = function (n, c) {
				/// m = { name: n, data: c, impls: [] };
				this.addNewModule(c, n);
				/// return m;
			};
			t.AddImpl = function (n, i) {
				var o = t.getModuleByName(n);
				if (o) o.Impls[o.Impls.length] = i;

			};
			HemiEngine.registry.service.addObject(t);
			t.ready_state = 4;
		}
	}, 1);
} ());

///	</class>
/// </package>
/// </source>