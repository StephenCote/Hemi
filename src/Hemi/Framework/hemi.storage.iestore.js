/// <source>
/// <name>Hemi.storage.iestore</name>
/// <project>
/// 	<name>Hemi JavaScript Framework</name>
/// 	<url-title>Hemi JavaScript Framework</url-title>
/// 	<url>/Hemi/</url>
/// </project>
/// <package>
///		<path>Hemi.storage</path>
///		<library>Hemi</library>
///		<description>A DOM Storage facade for Internet Explore 6 and 7, using the Hemi Configuration class and the Internet Explorer User Data behavior.</description>
/// Legacy Package System
///
/// _js_package("org.cote.js");

/// Debug
///
/// Package("Hemi.storage");

/// Stand Alone Package System
/// - assumes HemiEngine.storage.js is first

/// var org  = {};
/// org.cote = {};
/// org.cote.js = {};

/// <static-class>
///		<name>iestore</name>
///		<version>%FILE_VERSION%</version>
///		<description>A conditional wrapper exposed based on browser support.  This is not the preferred provider and is included to support IE 6 and 7.</description>

/// Requires engine framework for config reader
///
(function () {

    HemiEngine.namespace("storage.iestore", HemiEngine, {
    	dependencies : ["hemi.util.config"],
        storage_type: "IEStorage",
        behavior_storage: 0,
        behavior_storage_reader: 0,
        check_support: 0,
        behavior_storage_name: "IEStorageProvider",

        getPreferredStorage: function () {
            return HemiEngine.storage.iestore.gP();
        },
        gP: function () {
            var s = HemiEngine.storage.iestore;
            if (!s.check_support) s.init();
            return s.behavior_storage;
        },
        init: function () {
            var s = HemiEngine.storage.iestore, o, br,b = document.body;
            if(!b) return;
            o = document.createElement("div");

            o.style.cssText = "position:absolute;display:none;width:1px;height:1px;top:0px;left:0px;";
            b.appendChild(o);
            o.addBehavior("#default#userData");

            if (typeof o.XMLDocument != "undefined") {
                o.load(s.behavior_storage_name);
                s.behavior_storage = o;
                br = s.behavior_storage_reader = HemiEngine.util.config.newInstance();
                br.setElementParentName("c");
                br.setElementName("p");
                br.setAttrNameName("n");
                br.setAttrValueName("v");
                br.parseConfig(o.XMLDocument);
            }
            else {
                Hemi.logWarning("userData XML document not defined");
            }
            s.check_support = 1;
            return s.behavior_storage;
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

        getLength: function () {
            var o, s = HemiEngine.storage.iestore, i = 0, ar, r = 0;
            o = s.gP();
            if (!o) return 0;
            if (s.behavior_storage) {
                ar = s.behavior_storage_reader.getParams();
                for (; i < ar.length; i++)
                    if (ar[i] != null && ar[i].value != null && typeof ar[i].value != "undefined") r++;

                return r;
            }
            return 0;
        },
        removeItem: function (n) {
            HemiEngine.storage.iestore.setItem(n, null);
        },
        getItem: function (n) {
            var o, s = HemiEngine.storage.iestore;
            o = s.gP();
            if (!o) return 0;
            if (s.behavior_storage) {
                return unescape(s.behavior_storage_reader.getParam(n));
            }
            return null;
        },
        setItem: function (n, v) {
            var o, s = HemiEngine.storage.iestore;
            o = s.gP();
            if (!o) return 0;
            if (s.behavior_storage) {
                /// alert('write ' + n + "=" + v);
                s.behavior_storage_reader.writeParam(s.behavior_storage.XMLDocument, n, escape(v));
                s.behavior_storage.save(s.behavior_storage_name);
                return 1;
            }
            return 0;
        },

        key: function (i) {
            var o, s = HemiEngine.storage.iestore, ar, m = 0, n = 0, z = 0;
            o = s.gP();
            if (!o || i < 0) return 0;
            if (s.behavior_storage) {
                ar = s.behavior_storage_reader.getParams();
                for (; n < ar.length; n++) {
                    if (ar[i].value == null || typeof ar[i].value == "undefined") continue;
                    if (m == i) {
                        z = ar[i].name;
                        break;
                    }
                    m++;
                }
                return z;
                /// return ar[i].name;
            }
            return 0;
        },

        clear: function () {
            var o, s = HemiEngine.storage.iestore, ar, m = 0, n = 0, z = 0;
            o = s.gP();
            if (!o) return 0;
            ar = s.behavior_storage_reader.getParams();
            for (var i = ar.length - 1; i >= 0; i--) {
                if (ar[i].value == null || typeof ar[i].value == "undefined") continue;
                s.behavior_storage_reader.writeParam(s.behavior_storage.XMLDocument, ar[i].name, null);
            }
            s.behavior_storage.save(s.behavior_storage_name);
            s.behavior_storage_reader.clearConfig();

        }

    });
} ());


/// </static-class>
/// </package>
/// </source>

