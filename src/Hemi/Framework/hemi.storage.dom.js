/// <source>
/// <name>Hemi.storage.dom</name>
/// <project>
/// 	<name>Hemi JavaScript Framework</name>
/// 	<url-title>Hemi JavaScript Framework</url-title>
/// 	<url>/Hemi/</url>
/// </project>
/// <package>
///		<path>Hemi.storage</path>
///		<library>Hemi</library>
///		<description>A lightweight wrapper around the DOM Storage API.</description>
/// Legacy Package System
///
/// _js_package("org.cote.js");

/// Debug
///
/// Package("Hemi.storage");
/// Engine.Package("Hemi.storage");

/// Stand Alone Package System
/// - assumes HemiEngine.storage.js is first

/// var org  = {};
/// org.cote = {};
/// org.cote.js = {};

/// <static-class>
///		<name>dom</name>
///		<version>%FILE_VERSION%</version>
///		<description>A conditional wrapper exposed based on browser support.</description>
(function () {
    /// 2011/05/03 - Remove redundant check
    /*if (typeof Storage == "undefined") return;*/
    HemiEngine.namespace("storage.dom", HemiEngine, {

        storage_type: "DOMStorage",
        session_storage: 0 /*(window.sessionStorage ? window.sessionStorage : 0)*/,
        local_storage: (window.localStorage ? window.localStorage : 0),
        /*global_storage: (window.globalStorage ? window.globalStorage : 0),*/
        preferred_storage: 0,
        check_support: 0,
        getPreferredStorage: function () {
            return HemiEngine.storage.dom.gP();
        },
        gP: function () {
            var s = HemiEngine.storage.dom;
            if (!s.check_support) s.init();
            return s.preferred_storage;
        },
        init: function () {
            var s = HemiEngine.storage.dom;
            /// preference is local, then global, then session
            ///
            try {
                s.session_storage = (window.sessionStorage ? window.sessionStorage : 0);
            }
            catch (e) {
                /// Sink the unsupported error when accessing via FileSystem
                HemiEngine.logWarning(e.message ? e.message : e.description);
            }
            /// 2011/02/24 - Remove global storage reference as it's no longer spec'd
            ///
            if (s.local_storage) s.preferred_storage = s.local_storage;
            /*
            else if (s.global_storage) s.preferred_storage = s.global_storage;
            */
            else if (s.session_storage) s.preferred_storage = s.session_storage;

            /// s.preferred_storage = s.global_storage;
            s.check_support = 1;
        },
        ///	<method>
        ///		<name>getLength</name>
        ///		<return-value name= "l" type = "int">Number of keys.</return-value>
        ///		<description>Returns the number of keys currently stored.</description>
        ///	</method>
        ///	<method>
        ///		<name>removeItem</name>
        ///		<param name = "n" type = "String">Key name.</param>
        ///		<description>Removes the specified item from storage.</description>
        ///	</method>
        ///	<method>
        ///		<name>getItem</name>
        ///		<param name = "n" type = "String">Key name.</param>
        ///		<return-value name= "v" type = "String">Stored value.</return-value>
        ///		<description>Returns the stored value corresponding to the specified key.</description>
        ///	</method>
        ///	<method>
        ///		<name>setItem</name>
        ///		<param name = "n" type = "String">Key name.</param>
        ///		<param name = "v" type = "String">Value.</param>
        ///		<return-value name= "b" type = "bit">Bit indicating whether the value was stored.</return-value>
        ///		<description>Stores the supplied value at the specified key.</description>
        ///	</method>
        ///	<method>
        ///		<name>key</name>
        ///		<param name = "i" type = "int">Storage index.</param>
        ///		<return-value name= "s" type = "String">The key name.</return-value>
        ///		<description>Returns the key at the specified index.</description>
        ///	</method>
        ///	<method>
        ///		<name>clear</name>
        ///		<description>Empties the storage of all saved key/value pairs.</description>
        ///	</method>
        iS: function (o) {
            ///return (o instanceof Storage);
            return (typeof globalStorage == DATATYPES.TYPE_UNDEFINED || o != globalStorage);
        },
        getLength: function () {
            var o, s = HemiEngine.storage.dom;
            o = s.gP();
            if (!o) return 0;
            if (s.iS(o)) return o.length;
            return o[document.domain].length;
        },
        getItem: function (n) {
            var o, s = HemiEngine.storage.dom;
            o = s.gP();
            if (!o) return 0;
            if (s.iS(o)) return o.getItem(n);
            return o[document.domain].getItem(n);
        },
        setItem: function (n, v) {
            var o, s = HemiEngine.storage.dom;
            o = s.gP();
            if (!o) return 0;
            if (s.iS(o)) return o.setItem(n, v);
            return o[document.domain].setItem(n, v);
            /// [n] = v;
            /// o.setItem(n,v);	
        },
        removeItem: function (n) {
            var o, s = HemiEngine.storage.dom;
            o = s.gP();
            if (!o) return 0;
            if (s.iS(o)) return o.removeItem(n);
            return o[document.domain].removeItem(n);
            /// o.setItem(n,v);	
        },
        key: function (i) {
            var o, s = HemiEngine.storage.dom;
            o = s.gP();
            if (!o) return 0;
            if (s.iS(o)) return o.key(i);
            return o[document.domain].key(i);
        },
        clear: function (i) {
            var o, s = HemiEngine.storage.dom;
            o = s.gP();
            if (!o) return 0;
            var i, l = s.getLength();
            for (i = l - 1; i >= 0; i--) {
                s.removeItem(s.key(i));
            }
            /// Not working at present
            ///
            /// return o[document.domain].clear();	
        }

    });
} ());
/// </static-class>
/// </package>
/// </source>