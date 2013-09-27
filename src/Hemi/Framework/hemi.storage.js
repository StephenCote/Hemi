/// <source>
/// <name>Hemi.storage</name>
/// <project>
/// 	<name>Hemi JavaScript Framework</name>
/// 	<url-title>Hemi JavaScript Framework</url-title>
/// 	<url>/Hemi/</url>
/// </project>
///

/*
	libStorage
	Source: Hemi.storage
	Copyright 2008 - 2009. All Rights Reserved.
	Version: %FILE_VERSION%
	Author: Stephen W. Cote
	Email: sw.cote@gmail.com
	Project: http://www.whitefrost.com/projects/engine/
	License: http://www.whitefrost.com/projects/engine/code/engine.license.txt
*/

/*
	NOTES
	
	BUGS
	
	WORK EXAMPLES
*/


/// Legacy Package System
///
/// _js_package("org.cote.js");

/// Stand Alone Package System
///

/// Debug
///
/// Package("Hemi.storage");

/// <package>
/// 	<path>Hemi</path>
/// <library>Hemi</library>
///	<description>A bridge for implementing DOM Storage or Storage facades.</description>
///	<static-class>
///		<name>storage</name>
///		<version>%FILE_VERSION%</version>
///		<description>A wrapper for cross browser storage support.</description>
/// 

/// <example>
/// <name>Get Item</name>
/// <description>Retrieves an item from storage</description>
/// <syntax>[string] = getItem(key);</syntax>
///	<code>var provider = HemiEngine.storage.StorageManager.getStorageProvider();</code>
/// <code>if(provider) var sValue = provider.getItem("some key");</code>
/// </example>

/// <example>
/// <name>Set Item</name>
/// <description>Saves an item into storage</description>
/// <syntax>[bool] = setItem(key, val);</syntax>
///	<code>var provider = HemiEngine.storage.StorageManager.getStorageProvider();</code>
/// <code>if(provider) var bReturn = provider.setItem("some key","some value");</code>
/// </example>

(function () {
    /// 2011/05/03
    /// IE 9 is balking at the check for the Storage object in some conditions, potentially due to corporate proxy/firewall settings
    ///
    if (typeof localStorage != "undefined") {
        HemiEngine.include("hemi.storage.dom");
    }
    if (!DATATYPES.TU(document.documentElement.addBehavior)) {
        HemiEngine.include("hemi.storage.iestore");
    }
    HemiEngine.namespace("storage", HemiEngine, {


        /// Interface Support
        ///
        /// length : 0,
        /// getItem : function("key")
        /// setItem : function("key","data");
        /// removeItem : function("key");
        /// clear : function()
        /// key : function(iIndex);

        /// <property type = "String" get = "1" internal = "1">
        /// <name>object_version</name>
        /// <description>Version of the object class.</description>
        /// </property>
        object_version: "%FILE_VERSION%",

        /// <property type = "Object" get = "1" set = "1" default = "auto">
        /// <name>storage_provider</name>
        /// <description>Specifies the provider to use for storage management.</description>
        /// </property>
        storage_provider: 0,

        /// <property type = "String" get = "1" set = "1" default = "auto">
        /// <name>preferred_storage_type</name>
        /// <description>Specify or retrieve the preferred storage type.</description>
        /// </property>
        preferred_storage_type: "auto",

        preferred_storage_types: ["auto", "local", "session", "global"],

        ///	<method>
        ///		<name>getStorageProvider</name>
        ///		<return-value name= "o" type = "StorageProvider">Returns a storage provider.</return-value>
        ///		<description>Returns a reference to a storage provider.</description>
        ///	</method>
        getStorageProvider: function () {
            var o = HemiEngine.storage.storage_provider;
            if (o) return o;

            if (!DATATYPES.TU(HemiEngine.storage.dom))
                o = HemiEngine.storage.tR(HemiEngine.storage.dom);
            if (!o && !DATATYPES.TU(HemiEngine.storage.iestore))
                o = HemiEngine.storage.tR(HemiEngine.storage.iestore);

            HemiEngine.storage.storage_provider = o;
            return o;

        },
        /*
        setItem : function(n, v){
        var o = HemiEngine.storage.getStorageProvider();
        if(!o) return 0;
        return o.setItem(n, v);		
        },
        getLength : function(){
        var o = HemiEngine.storage.getStorageProvider();
        if(!o) return 0;
        return o.getLength();
        },
        getStorage : function(){
		
        }
        */
        ///	<method internal = "1">
        ///		<name>testStorageReadWrite</name>
        ///     <param name = "o" type = "StorageProvider">A StorageProvider to test.</param>
        ///		<return-value name= "b" type = "StorageProvider">Returns the specified provider if it passes the test, otherwise, returns undefined.</return-value>
        ///		<description>Fixed test to assert the specified API is functioning.</description>
        ///	</method>
        tR: function (p) {
            var n = HemiEngine.guid(), v = "~hsj", c;
            p.setItem(n, v);
            c = p.getItem(n);
            p.removeItem(n);
            return (c ? p : 0);

        },
        ///	<method>
        ///		<name>testStorageSupported</name>
        ///		<return-value name= "b" type = "bool">Bit indicating storage API support.</return-value>
        ///		<description>Returns a bit indicating whether the storage API is supported. </description>
        ///	</method>
        testStorageSupported: function () {
            return (HemiEngine.storage.getStorageProvider() != null && HemiEngine.storage.getStorageProvider().getPreferredStorage() != null ? 1 : 0);
        }
    });
} ());
/// </static-class>
/// <object>
///		<name>StorageProvider</name>
///		<version>%FILE_VERSION%</version>
///		<description>A storage provider.</description>
///		<property type = "String" get = "1" internal = "1">
///			<name>storage_type</name>
///			<description>Type name of the storage provider (eg: DOMStorage, IEStorage, DBStorage).</description>
///		</property>
/// </object>
/// </package>
/// </source>
///


