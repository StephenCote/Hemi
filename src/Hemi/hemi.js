/// <source>
/// <name>Hemi</name>
/// <project>
/// 	<name>Hemi JavaScript Framework</name>
/// 	<url-title>Hemi JavaScript Framework</url-title>
/// 	<url>/Hemi/</url>
/// </project>
///
/// <package>
///	<description>Framework base classes, including: Hemi for creating framework objects and loading external libraries; Hemi.xml for AJAX and JSON requests (libXmlRequest derivative); Hemi.registry for object repository management; Hemi.message for delegating message subscriptions and publications.</description>
///	<library>Hemi</library>
/// <global>
///	    <version>%FILE_VERSION%</version>
///		<description>The base set of classes for the Hemi Framework.</description>
///		<object>
///			<name>Hemi</name>
///			<description>The core class used to load and manage framework classes.</description>
///		</object>
/// </global>
///	<static-class>
///		<name>Hemi</name>
///	<example>
///		<name>Create Framework Object</name>
///		<description>Demonstrate how to create a new Framework Object</description>
///		<code>// Create a new object that is also registered</code>
///		<code>var oNewObject = Hemi.newObject("myObject","1.0", true);</code>
///		<code>var sId = oNewObject.getObjectId();</code>
///		<code>// Retrieve the object from the registry</code>
///		<code>var oLookup = Hemi.registry.service.getObject(sId);</code>
///	</example>
///	<example>
///		<name>Prepare an Existing Object for the Framework</name>
///		<description>Demonstrate how to prepare an existing object for the framework and use a custom identifier.</description>
///		<code>// Prepare an existing object and give it a custom id</code>
///		<code>var oObject = {};</code>
///		<code>oObject.object_id = "MyCustomId";</code>
///		<code>Hemi.prepareObject("myObject", "1.0", true, oObject);</code>
///		<code>// Retrieve the object from the registry</code>
///		<code>var oLookup = Hemi.registry.service.getObject("MyCustomId");</code>
///	</example>
/// <object>
/// <name>FrameworkObject</name>
/// <description>API definition for any object created by the Hemi Framework.</description>

/// <property type = "object" name = "properties">A hash of primitive values (strings, ints, etc) for storing configuration, settings, and status.</property>
/// <property type = "object" name = "objects">A hash of object values for storing named object references.</property>
/// <property name = "object_id" type = "String" internal = "1">A globally unique identifier.</property>
/// <property name = "object_type" type = "String" internal = "1">The named type of the object.</property>
/// <property name = "object_version" type = "String" internal = "1">The version of the object.</property>
/// <property name = "ready_state" type = "int" internal = "1">State tracking mechanism, used primarily for determining object availability and destruction.</property>
/// <property name = "object_config" type = "object">Object on which the inner status and pointers objects are defined.</property>
/// <method>
/// <name>getObjectId</name>
/// <return-value type = "String" name = "i">Identifier used to identify this object within the registry.</return-value>
/// <description>Returns the object identifier.</description>
/// </method>
/// <method>
/// <name>setObjectId</name>
/// <param name="i" type="String">The id of the object.</param>
/// <description>Sets the object identifier.  Only applicable after creating or preparing a new object, and prior to registering the object.</description>
/// </method>
/// <method>
/// <name>getObjectType</name>
/// <return-value type = "String" name = "t">Named type for the object.</return-value>
/// <description>Returns the object identifier.</description>
/// </method>
/// <method>
/// <name>getObjectVersion</name>
/// <return-value type = "String" name = "v">Version of the object.</return-value>
/// <description>Returns the object version.</description>
/// </method>
/// <method>
/// <name>getReadyState</name>
/// <return-value type = "int" name = "i">The ready state of the object.</return-value>
/// <description>Returns the state of the object.</description>
/// </method>

/// </object>
if (typeof window != "object") window = {};
(function () {
    
    if (window.Hemi) return;

    HemiEngine = {
        Libraries: [],
        LibraryMap: [],
        Namespaces: [],
        NamespaceMap: [],
        ClassImports: [],
        Context: window,

        ///		<property name = "hemi_base" get = "1" set = "1" type = "String">The base path of the Hemi Framework. By default, the base path is /Hemi/ when accessed via http/s, and the current directory when accessed via the filesystem.</property>
        ///
        hemi_base: (location.protocol.match(/^file/i) ? "file://" + location.pathname.substring(0, location.pathname.lastIndexOf("/") + 1) : "/") + "Hemi/",
        uid_prefix: "hemi-",
        guid_counter: 0,
        version: "4.0.0-Beta",
        build: "%FILE_VERSION%"
    };
    if(window.HemiConfig){
       if(window.HemiConfig.hemi_base) HemiEngine.hemi_base = window.HemiConfig.hemi_base;
    }

    ///		<object internal = "1">
    ///			<name>DATATYPES</name>
    ///			<description>Enumeration of object types.</description>
    ///			<property name = "TYPE_STRING" type = "String">string</property>
    ///			<property name = "TYPE_OBJECT" type = "String">object</property>
    ///			<property name = "TYPE_FUNCTION" type = "String">function</property>
    ///			<property name = "TYPE_UNDEFINED" type = "String">undefined</property>
    ///			<property name = "TYPE_NUMBER" type = "String">number</property>
    ///		</object>
    var DATATYPES = {
        TYPE_STRING: "string",
        TYPE_BOOLEAN: "boolean",
        TYPE_OBJECT: "object",
        TYPE_FUNCTION: "function",
        TYPE_UNDEFINED: "undefined",
        TYPE_NUMBER: "number",
        T: function (v, t) { return (typeof v == t); },
        TS: function (v) { return DATATYPES.T(v, DATATYPES.TYPE_STRING); },
        TO: function (v) { return DATATYPES.T(v, DATATYPES.TYPE_OBJECT); },
        TB: function (v) { return DATATYPES.T(v, DATATYPES.TYPE_BOOLEAN); },
        TF: function (v) { return DATATYPES.T(v, DATATYPES.TYPE_FUNCTION); },
        TU: function (v) { return DATATYPES.T(v, DATATYPES.TYPE_UNDEFINED); },
        TN: function (v) { return DATATYPES.T(v, DATATYPES.TYPE_NUMBER); }

    };

    var data_undefined;

    DATATYPES.XMLHTTPREQUEST = (typeof XMLHttpRequest != DATATYPES.TYPE_UNDEFINED ? XMLHttpRequest : data_undefined);

    if (typeof window.DATATYPES != DATATYPES.TYPE_OBJECT) window.DATATYPES = DATATYPES;

    /// <method>
    /// 	<name>logError</name>
    ///		<param name="sMessage" type="String">Message to send to the logger.</param>
    /// 	<description>Sends a message in the #100.5 message block.</description>
    /// </method>
    HemiEngine.logError = function (s) {
        HemiEngine._logInternal(s, "100.5");
    };

    /// <method>
    /// 	<name>logWarning</name>
    ///		<param name="sMessage" type="String">Message to send to the logger.</param>
    /// 	<description>Sends a message in the #100.4 message block.</description>
    /// </method>
    HemiEngine.logWarning = function (s) {
        HemiEngine._logInternal(s, "100.4");
    };
    /// <method>
    /// 	<name>logDebug</name>
    ///		<param name="sMessage" type="String">Message to send to the logger.</param>
    /// 	<description>Sends a message in the #100.1 message block.</description>
    /// </method>

    HemiEngine.logDebug = function (s) {
        HemiEngine._logInternal(s, "100.1");
    };

    /// <method>
    /// 	<name>log</name>
    ///		<param name="sMessage" type="String">Message to send to the logger.</param>
    /// 	<description>Sends a message in the #100.3 message block.</description>
    /// </method>
    HemiEngine.log = function (s) {
    	console.log(s);
        HemiEngine._logInternal(s, "100.3");
    };
    HemiEngine._logInternal = function(s, l){
        HemiEngine.message.service.sendMessage(s, l);
    };

    /// <method>
    /// 	<name>isImported</name>
    ///		<param name="s" type="String">Namespace name.</param>
    /// 	<return-value type = "boolean" name = "bImported">Bit indicating whether the namespace has been imported.</return-value>
    /// 	<description>Returns the object identifier.</description>
    /// </method>
    HemiEngine.isImported = function (s) {
        var o = HemiEngine.getLibrary(s);
        return (o && o.loaded);
    };
    /// <method internal = "1">
    /// 	<name>dereference</name>
    ///		<param name="sName" type="String">Namespace or Library name of the imported script file.</param>
    ///		<return-value name = "bUnreferenced" type = "bit">Bit indicating the namespace and library maps were dereferenced.</return-value>
    /// 	<description>Dereferences the imported library and library map.  This does not delete the object from its parent, or destroy the object from the framework.</description>
    /// </method>
	HemiEngine.dereference = function(n){
		var i;
		if (DATATYPES.TN((i = HemiEngine.LibraryMap[n]))) {
			delete HemiEngine.LibraryMap[n];
			delete HemiEngine.Libraries[i];
			delete HemiEngine.NamespaceMap[n.replace(/^hemi\./, "")];
			HemiEngine.log("Dereference '" + n + "'");
			/// alert('def: ' + n + ":" + HemiEngine.isImported(n));
		}
	};
    /// <method internal = "1">
    /// 	<name>getLibrary</name>
    ///		<param name="sName" type="String">Namespace or Library name of the imported script file.</param>
    ///		<return-value name = "NamespaceObject" type = "object">Returns an internal namespace object.</return-value>
    /// 	<description>Returns the specified namespace object.</description>
    /// </method>
    HemiEngine.getLibrary = function(s){
        if(!DATATYPES.TN(HemiEngine.LibraryMap[s])) s = "hemi." + s;
        if(DATATYPES.TN(HemiEngine.LibraryMap[s])) return HemiEngine.Libraries[HemiEngine.LibraryMap[s]];
        return 0;
    };

    /// <method>
    /// 	<name>include</name>
    ///		<param name="sName" type="String">Namespace of the script file to import.</param>
    ///		<param name="sPath" type="String" optional = "1">Path where the script file resides.  Default to Framework/</param>
    ///		<param name="bNoEval" type="boolean" optional = "1">Bit indicating whether the loaded script should not be executed.</param>
    ///		<return-value name = "NamespaceObject" type = "object">Returns an internal namespace object.</return-value>
    /// 	<description>Imports the specified namespace.</description>
    /// </method>
    HemiEngine.including = {};
    
    /// 2019/03/06 - Currently a first pass at updating the structure
    /// It's kludgy but works.  However, a better way seems to be making this an async function
    HemiEngine.include = function (s, z, n) {
    	if(HemiEngine.including[s]) return HemiEngine.including[s];
        if(HemiEngine.isImported(s) || (!z && DATATYPES.TN(HemiEngine.NamespaceMap[s.replace(/^hemi\./, "")]))){
			return new Promise(function(res, rej){ res(HemiEngine.getLibrary(s)); });
		}
        var v, q, k = s, kn=n,
        	p = (z && (!HemiEngine.lookup("hemi.data.io.proxy") || !HemiEngine.data.io.proxy.service.isProxyProtocol(z)) && !z.match(/^\//) ? HemiEngine.hemi_base : "") + (z ? z : "Framework/") + s.toLowerCase() + ".js"
        ;
        
        var x = HemiEngine.xml.promiseText(p, "GET", 0, s);
        HemiEngine.including[k] = x;
        
        x.then(function(d){
            var l = HemiEngine.Libraries.length, b = 0, o;
             d = d.replace(/^\s+/, "").replace(/\s+$/, "");
             if (!kn){
            	 o= eval(d);
            	 b = 1
             }
             q = {
	             package: s,
	             index: l,
	             raw: d,
	             loaded: b
             };
             HemiEngine.Libraries[l] = q;
             HemiEngine.LibraryMap[s] = l;
             return d;
        });
        x.catch(function(d){
        	reject(d);
        });
        
        /*
        var x = HemiEngine.xml.getText((z && (!HemiEngine.lookup("hemi.data.io.proxy") || !HemiEngine.data.io.proxy.service.isProxyProtocol(z)) && !z.match(/^\//) ? HemiEngine.hemi_base : "") + (z ? z : "Framework/") + s.toLowerCase() + ".js", 0, 0, s, 1);
        /// try {
            if (x) {
                x = x.replace(/^\s+/, "").replace(/\s+$/, "");
                if (!n) eval(x);
                b = 1;
            }
		/*
        }
        catch (e) {
            alert("Error including library '" + s + "'\n\n" + e.message);
        }
		*/

        return x;

    };
    /// <method>
    /// <name>namespace</name>
    /// <description>Creates a hierarchical object namespace from the supplied name.</description>
    /// <param name="sPath" type="String">Period-delimited hierarchy.</param>
    /// <param name="oBase" type="object" optional = "1">Base object, defaults to Hemi.Context (which default to window).</param>
    /// <param name="hContents" type="object" optional = "1">Object hash contents.</param>
    /// <param name="bService" type="boolean" optional = "1">Bit indicating the namespace defines service and serviceImpl members, and to instantiate the service.</param>
    /// </method>
    ///

    HemiEngine.dependencies = {};
    HemiEngine.resolveDependency = function(s, o, b, m){
    	if(HemiEngine.allStop) return;
    	var d = HemiEngine.dependencies;
    	if(!m) m = 1;
    	else m++;
    	if(m > 50){
    		/// Using console since message service may not yet be ready
    		console.error("Exceeded wait limit to resolve " + s);
    		return;
    	}
    	if(DATATYPES.TU(d[s]) || !d[s].length){
    		try{
    			if (b && DATATYPES.TF(o["serviceImpl"]) && o.service == null){
    				console.debug("Implementing service " + s);
    				o.service = new o.serviceImpl();
    				o.servicePromiseResolver(o.service)
    			}
    			else o.servicePromiseResolver(o);
    	    	Object.keys(d).forEach(i => {
    	    		d[i].forEach(function(item, index, object){
    	    			if(item == s || item.match(new RegExp("hemi." + s,"gi"))){
    	    				object.splice(index, 1);
    	    			}
    	    		});
    	    	});
    	    	delete HemiEngine.including["hemi." + s];
    		}
    		catch(e){
    			console.error(s + " threw an error: " + e);
    		}
    	}
    	else{
    		console.debug(s + " is waiting for " + d[s].join(", "));
    		setTimeout(HemiEngine.resolveDependency, 5, s, o, b, m);
    	}
    };
    HemiEngine.namespace = function (c, o, v, b) {
        var a, i = 0, s, o, l, p, sp, aP=[];
        if (!o) o = HemiEngine.Context;
        if (DATATYPES.TS(c)) {
            if (!HemiEngine.NamespaceMap[c]) {
                l = HemiEngine.Namespaces.length;
                HemiEngine.NamespaceMap[c] = l;
                HemiEngine.Namespaces[l] = c;
            }
            a = c.split(".");
            p = o;
            for (; i < a.length; ) {
                s = a[i++];
                if (!DATATYPES.TO(p[s])) p[s] = {};
                p = p[s];
            }
        }

        if (v) {
        	o = Object.assign(p, v);
        	if(!HemiEngine.dependencies[c]) HemiEngine.dependencies[c] = [];
        	if(o.dependencies){
        		
        		o.dependencies.map(function(x){
        			if(!HemiEngine.isImported(x)){
        				HemiEngine.dependencies[c].push(x);
        				aP.push(HemiEngine.include(x));
        			}
        		});
        	}
        	sp = Promise.all(aP).then(function(){
        		HemiEngine.resolveDependency(c, o, b);
        		
        		/// 2019/03/13 - Fire framework load once the xml namespace is loaded and all dependencies resolved
        		///
        		if(c.match(/xml/) && window.HemiConfig){
        			/// if(!window.HemiConfig.dependencies) window.HemiConfig.dependencies = [];
        			HemiEngine.prepareFrameworkLoad(c);
        		
        		}
        		/// if (b && DATATYPES.TF(o["serviceImpl"])) o.service = new o.serviceImpl();
        		
        	});
        	
        	o.servicePromise = new Promise((res,rej)=>{
        		o.servicePromiseResolver = res;
        		o.servicePromiseRejecter = rej;
        	});
        }
        return p;
    };
    HemiEngine.prepareFrameworkLoad = function(c){
    	var aP2 = [], aP3 = [], aP4 = [];
		
		window.HemiConfig.dependencies.map(function(x){
			if(!HemiEngine.isImported(x)){
				HemiEngine.dependencies[c].push(x);
				aP2.push(HemiEngine.include(x));
				aP3.push(x);
			}
		});
		Promise.all(aP2).then((aO)=>{
			
			aP3.map(function(x){
				var oN = Hemi.lookup(x);
				if(oN && oN.servicePromise) aP4.push(oN.servicePromise);
			});
			Promise.all(aP4).then(()=>{
				HemiEngine.frameworkLoad();
			});
		});
    };
    HemiEngine.frameworkLoad = function(){
    
    	if (!HemiEngine.xml.si) HemiEngine.xml.StaticInitialize();
    	if(DATATYPES.TF(window.HemiConfig.frameworkLoad)) window.HemiConfig.frameworkLoad(HemiEngine);
    };
    /// <method>
    /// <name>lookup</name>
    /// <description>Verifies the specified hierarchy exists.</description>
    /// <param name="sPath" type="String">Period-delimited hierarchy.</param>
    /// <return-value name = "v" type = "boolean">Returns true if the hierachy exists, or the matching object if bObjOut is set to true.</return-value>
    /// </method>
    ///
    HemiEngine.lookup = function (c) {
        var a, i = 0, s, w = window, o, l;
        if (!DATATYPES.TS(c)) return 0;
        a = c.split(".");
        o = w;
        if (a[0].match(/^hemi$/)) {
            o = HemiEngine;
            i = 1;
        }
        l = a.length;
        for (; i < l; ) {
            s = a[i++];
            if (!DATATYPES.TO(o[s])) return 0;
            o = o[s];
        }

        return o;
    };

    /// <method>
    /// <name>hashlight</name>
    /// <description>A very light hash.</description>
    /// <param name="sData" type="String">Data to be hashed.</param>
    /// <return-value name = "sHash" type = "String">A light hash of the input data.</return-value>
    /// </method>
    ///
    HemiEngine.hashlight = function (s) {
        var i = c = 0;
        for (; s && i < s.length; ++i) {
            c = (c + s.charCodeAt(i) * (i + 1)) & 0xFFFFFFFF;
        }
        return c.toString(16);
    },
    /// <method>
    /// <name>guid</name>
    /// <description>Returns a globally unique identifier, relative to the page view.  This uses a weak hash.</description>
    /// <return-value name = "sId" type = "String">A unique id.</return-value>
    /// </method>
    ///
	HemiEngine.guid = function () {

	    var d = new Date(), t, i = 4, r, l, x = 0;
	    t = new String(d.getTime());
	    r = new String(parseInt(Math.random() * (1000 * i)));
	    l = r.length;
	    for (; x < i - l; x++) r = "0" + r;
	    return (HemiEngine.uid_prefix + (++HemiEngine.guid_counter) + "-" + t + "-" + r);
	};

    /// <method>
    ///		<name>newObject</name>
    ///		<param name = "t" type = "String">The type of the object.</param>
    ///		<param name = "v" type = "String">The version of the object.</param>
    ///		<param name = "r" type = "boolean">Bit indicating whether the object should be registered with the Object Registry.</param>
    ///		<param name = "d" type = "boolean">Bit indicating whether the object should include a deconstructor.</param>
    ///		<param name = "h" type = "hash">Object members to include on this object.</param>
    ///		<return-value type = "FrameworkObject" name = "o">The new framework object.</return-value>
    ///		<description>Creates and optionally registers a new FrameworkObject ready for use within the framework.</description>
    /// </method>
    HemiEngine.newObject = function (n, v, r, d, h) {
        var o = {}, p, a;
        
        if(DATATYPES.TO(h))
        	o = Object.assign(o, h);
        HemiEngine.prepareObject(n, v, r, o, d);
    	if(DATATYPES.TF(o.object_create)){
    		if(( p = o.objects.promise)){
    			p.then(function(){o.object_create();});
    		}
    		else o.object_create();
    	}
        return o;
    };

    /// <method>
    ///		<name>prepareObject</name>
    ///		<param name = "t" type = "String">The type of the object.</param>
    ///		<param name = "v" type = "String">The version of the object.</param>
    ///		<param name = "r" type = "boolean">Bit indicating whether the object should be registered with the Object Registry.</param>
    ///		<param type = "FrameworkObject" name = "o">The object to be prepared for use in the Hemi framework.</param>
    ///		<param name = "d" type = "boolean">Bit indicating whether the object should include a deconstructor.</param>
    ///		<description>Prepares and optionally registers a new FrameworkObject ready for use within the Hemi framework.</description>
    /// </method>
    
    HemiEngine.prepareObject = function (n, v, r, o, d) {
        var p, aP = [];    
    	if (!o) o = {}	

        if (!o.objects) o.objects = {};
        if (!o.properties) o.properties = {};
        if (!n) n = "custom_object";
        if (!v) v = "1.0";
        HemiEngine._implements(o, "base_object", n, v);
      
        
        if (r && HemiEngine.registry.service != null)
            HemiEngine.registry.service.addObject(o);
        
        if(!HemiEngine.dependencies[n]) HemiEngine.dependencies[n] = [];
 		if(o.dependencies) o.dependencies.map(function(x){
			if(!HemiEngine.isImported(x)){
				HemiEngine.dependencies[n].push(x);
				aP.push(HemiEngine.include(x));
			}
		});
        
    	aP.push(HemiEngine.include("hemi.object"));
    	p = o.objects.promise = new Promise((res,rej)=>{
    		Promise.all(aP).then(()=>{
    			if(d) HemiEngine.object.addObjectDeconstructor(o);
    			res(o);
    		});
    	});
        
        if(DATATYPES.TF(o.object_prepare)){
        	if(p) p.then(function(){o.object_prepare();});
        	else o.object_prepare();
        }
    };
    

    /// <method private = "1">
    /// <name>_implements</name>
    /// <param name="o" type="object">Target object to merge features..</param>
    /// <param name="n" type="String">Name of merge features.</param>
    /// <param name="v" type="variant">Overloaded variant arguments to pass to the implementing object constructor.</param>
    /// <description>Implements a specified feature.</description>
    /// </method>
    ///
    HemiEngine._implements = function (o, s) {
        var v, a = arguments, i, n_a = [];

        for (i = 1; i < a.length; i++)
            n_a[n_a.length] = a[i];

        v = HemiEngine._forName.apply(this.caller, n_a);

        if (
			DATATYPES.TO(o)
			&&
			DATATYPES.TO(v)
		) {
            for (i in v)
                o[i] = v[i];

        }
    };

    /// <method private = "1" internal = "1">
    /// <name>_forName</name>
    /// <param name="s" type="String">Name of the object to return.</param>
    /// <return-value name = "o" type = "object">Object based on the specified name.</return-value>
    /// <description>Creates a specific internal object.  Includes the definition for base_object, and supports external definitions via class imports.</description>
    /// </method>
    ///
    HemiEngine._forName = function (s) {
        var v, a = arguments;
        if (DATATYPES.TS(HemiEngine.ClassImports[s])) {
            eval("v=" + HemiEngine.ClassImports[s]);
            return v;
        }
        switch (s) {
            case "base_object":
                return {
                    object_id: HemiEngine.guid(),
                    getObjectId: function () { return this.object_id; },
                    setObjectId: function(i){ this.object_id = i;},
                    object_type: a[1],
                    getObjectType: function () { return this.object_type; },
                    object_version: a[2],
                    getObjectVersion: function () { return this.object_version; },
                    ready_state: 0,
                    getReadyState: function () { return this.ready_state; },
                    getProperties: function () { return this.properties; },
                    getObjects: function () { return this.objects; }
                };
                break;
        }
        return null;
    };

    /// <method>
    /// <name>GetSpecifiedAttribute</name>
    /// <param name="o" type="Node">Node reference</param>
    /// <param name="n" type="String">Name of the attribute to test.</param>
    /// <return-value type = "String" name = "v">Value of the attribute.</return-value>
    /// <description>Returns the value of an attribute if it was specified and the length is greater than zero.</description>
    /// </method>
    ///
    HemiEngine.GetSpecifiedAttribute = function (o, n) {
        return HemiEngine.IsAttributeSet(o, n, 1);
    };

    /// <method>
    /// <name>IsAttributeSet</name>
    /// <param name="o" type="Node">Node reference</param>
    /// <param name="n" type="String">Name of the attribute to test.</param>
    /// <param name="b" type="bit" optional="1" default = "0">Bit indicating whether to return the attribute value instead of a positive bit.</param>
    /// <return-value type = "bit" name = "b">A bit indicating whether the specified attribute was set.</return-value>
    /// <description>Tests whether an attribute has been set.</description>
    /// </method>
    ///
    HemiEngine.IsAttributeSet = function (o, n, b) {
        if (o == null || !DATATYPES.TO(o) || o.nodeType != 1) return 0;
        var s = o.getAttribute(n);
        if (!DATATYPES.TS(s) || s.length == 0) return 0;
        return (b ? s : 1);
    };

    ///
    ///	</static-class>
    ///	<static-class>
    ///		<name>registry.service</name>
    ///		<version>%FILE_VERSION%</version>
    ///		<description>Static implementation of hemi.registry.serviceImpl</description>
    /// <method>
    /// <name>getEvalStatement</name>
    /// <param name = "o" type = "object">Registered object.</param>
    /// <return-value name = "sEvalCode" type = "String">A javascript statement which, when evaluated, returns a reference to the object.</return-value>
    /// <description>Returns a string statement that can be evaluated to return a reference to the registered object.</description>
    /// </method>
    /// <method>
    /// <name>getApplyStatement</name>
    /// <param name = "o" type = "object">Registered object.</param>
    /// <param name = "f" type = "String">Name of a method on the registered object</param>
    /// <return-value name = "sApplyCode" type = "String">A javascript statement which, when evaluated, returns a reference to the function on the object.</return-value>
    /// <description>Returns a string statement that can be evaluated to return a reference to the specified method for the registered object.</description>
    /// </method>
    ///
    ///	</static-class>
    ///	<class>
    ///		<name>registry.serviceImpl</name>
    ///		<version>%FILE_VERSION%</version>
    ///		<description>Repository service for storing and discovering framework objects.</description>

    HemiEngine.namespace("registry", HemiEngine, {
    	dependencies : [],
        getEvalStatement : function(o){
            if(!HemiEngine.registry.service.isRegistered(o)) return 0;
            return "HemiEngine.registry.service.getObject('" + o.object_id + "')";
        },
        getApplyStatement : function(o, f){
            var a = HemiEngine.registry.getEvalStatement(o);
            if(!a) return 0;
            return  a + "." + f + ".apply(" + a + ")";
        },
        service: null,
        serviceImpl: function () {
            var t = this;
            t.properties = {
                register_transactions: 0
            };
            t.objects = {
                o: [],
                om: []
            };

            /// <method>
            /// <name>canRegister</name>
            /// <param name = "o" type = "object">Object to test whether or not it can be registered.</param>
            /// <return-value name = "b" type = "boolean">Returns true if the specified object defines an <i>object_id</i>, <i>object_version</i>, and <i>object_type</i> String property, and <i>ready_state</i> int property.</return-value>
            /// <description>Verifies whether an object can be added to the registry.</description>
            /// </method>
            ///
            t.canRegister = function (o) {
                if (
					!DATATYPES.TO(o)
					||
					(
						!DATATYPES.TS(o.object_id)
						||
						!DATATYPES.TS(o.object_type)
						||
						!DATATYPES.TS(o.object_version)
						||
						!DATATYPES.TN(o.ready_state)
					)
				) {
                    return 0;
                }
                return 1;

            };

            /// <method>
            /// <name>addObject</name>
            /// <param name = "o" type = "object">Object to add to the registry</param>
            /// <return-value name = "b" type = "boolean">Returns true if the object was added to the registry.</return-value>
            /// <description>Adds the specified object to the registry, and automatically registers the object with the transaction service.</description>
            /// </method>
            ///
            t.addObject = function (o) {
                var i, m, p;
                if (!t.canRegister(o)) 
                {
                    HemiEngine._logInternal("Invalid Object Structure", "540.4", 1);
                    return 0;
                }
                if (t.isRegistered(o)) {
                    HemiEngine._logInternal("Object '" + o.object_id + "' is already registered", "540.4");
                    return 0;
                }
                p = t.objects;
                i = o.object_id;

                if (!DATATYPES.TN(p.om[i])) {

                    m = p.o.length;
                    p.o[m] = o;
                    p.om[i] = m;
                    if (
						t.properties.register_transactions
						&&
						HemiEngine.isImported("hemi.transaction")
					) {
                        HemiEngine.transaction.service.register(o);
                    }

                    return 1;
                }
                return 0;
            };

            /// <method>
            /// <name>removeObject</name>
            /// <param name = "o" type = "object">Object to remove from the registry</param>
            /// <param name = "b" type = "boolean" default = "false">Bit indicating whether the <i>onremoveobject</i> message should be suppressed from being published.</param>
            /// <return-value name = "b" type = "boolean">Returns true if the object was removed.</return-value>
            /// <description>Removes the specified object from the registry.</description>
            /// </method>
            ///
            t.removeObject = function (o, b) {

                var i = o.object_id, m, p;
                p = t.objects;

                if (DATATYPES.TN(p.om[i])) {
                    m = p.om[i];

                    p.o[m] = 0;
                    p.om[i] = null;
                    if (!b) HemiEngine.message.service.publish("onremoveobject", i);
                    return 1;
                }
                return 0;
            };
            /// <method>
            /// <name>getObjectsArray</name>
            /// <return-value name = "a" type = "array">Array of registered objects.</return-value>
            /// <description>Returns an array of registered objects.</description>
            /// </method>
            ///
            t.getObjectsArray = function () {
                return t.objects.o;
            };

            /// <method>
            /// <name>getObjectsMap</name>
            /// <return-value name = "a" type = "array">Array of object identifiers directly mapped to the objects array.</return-value>
            /// <description>Returns the object identifier mapping.</description>
            /// </method>
            ///
            t.getObjectsMap = function () {
                return t.objects.om;
            };

            /// <method>
            /// <name>getObject</name>
            /// <param name = "v" type = "variant">Index or name of the object to retrieve.</param>
            /// <return-value name = "o" type = "object">Object with the specified identifier or index.</return-value>
            /// <description>Returns the object matching the specified identifier or index.</description>
            /// </method>
            ///
            t.getObject = function (i) {
                var p = t.objects;
                if (
					DATATYPES.TN(p.om[i])
					&&
					DATATYPES.TO(p.o[p.om[i]])
				) {
                    return p.o[p.om[i]];
                }
                return null;
            };

            /// <method>
            /// <name>isRegistered</name>
            /// <param name = "o" type = "object">Object in the registry</param>
            /// <return-value name = "b" type = "boolean">Returns true if the object is in the registry.</return-value>
            /// <description>Returns true if the specified object is in the registry.</description>
            /// </method>
            ///
            t.isRegistered = function (i) {

                if (DATATYPES.TO(i)) {
                    if (DATATYPES.TU(i.object_id)) return 0;
                    i = i.object_id;
                }

                if (DATATYPES.TN(t.objects.om[i])) {
                    return 1;
                }
                return 0;
            };

            /// <method>
            /// <name>sendSigterm</name>
            /// <description>Sends a termination signal to all registered objects for preparation to be destroyed. This method causes all objects to be removed from the registry, and to have any <i>sigterm</i> method invoked.</description>
            /// </method>
            ///
            t.sendSigterm = function () {
                var o, i, p = t.objects;

                for (i = p.o.length - 1; i >= 0; ) {
                    o = p.o[i--];

                    if (o != null && o.ready_state == 4 && DATATYPES.TF(o.sigterm)) {
                        o.sigterm();
                    }
                }

                for (i = 0; i < p.o.length; ) {
                    o = p.o[i++];
                    if (t.isRegistered(o))
                        t.removeObject(o, 1);
                }

            };

            /// <method>
            /// <name>sendDestroyTo</name>
            /// <param name = "o" type = "object">Object in the registry</param>
            /// <return-value name = "b" type = "boolean">Returns true if the object defined a destroy method and the method was invoked.</return-value>
            /// <description>Invokes the destroy method on the specified object.  Object must be registered.  This method will not remove the object from the registry.</description>
            /// </method>
            ///
            t.sendDestroyTo = function (o) {
                if (
					t.isRegistered(o)
					&&
					DATATYPES.TF(o.destroy)
				) {
                    o.destroy();
                    return 1;
                }
                return 0;
            };
            HemiEngine.prepareObject("registry_service", "%FILE_VERSION%", 0, t);
            t.addObject(t);

        }

    }, 1);
    /// </class>

    ///	<static-class>
    ///		<name>message.service</name>
    ///		<version>%FILE_VERSION%</version>
    ///		<description>Static implementation of hemi.message.serviceImpl</description>
    ///	</static-class>
    ///	<class>
    ///		<name>message.serviceImpl</name>
    ///		<version>%FILE_VERSION%</version>
    ///		<description>Service that delegates subscriptions and publications at a global and object level.</description>
    HemiEngine.namespace("message", HemiEngine, {
        service: null,
        serviceImpl: function () {
            var t = this;
            t.objects = {
                s: [],
                dd: [],
                e: []
            };
            t.properties = {
                dd: 0,
                me: 500,
                rt: 3
            };
            t.data = {
                l: ["ALL", "DEBUG", "ADVISORY", "NORMAL", "WARNING", "ERROR", "FATAL", "NONE"],
                lm: { ALL: 0, DEBUG: 1, ADVISORY: 2, NORMAL: 3, WARNING: 4, ERROR: 5, FATAL: 6, NONE: 7 },
                dm: [],
                ed: [
                /*["Status","[specify status message]",200]*/
				]
            };
            /// <method>
            /// <name>getReportThreshold</name>
            /// <return-value name = "iThreshold" type = "int">The message threshold.</return-value>
            /// <description>Returns the report threshold for <i>sendMessage</i>.    Messages sent below this level will not be propogated.</description>
            /// </method>
            ///
            t.getReportThreshold = function () {
                return t.properties.rt;
            };
            t.getLevelMap = function () {
                return this.data.lm;
            };
            t.getLevels = function () {
                return this.data.l;
            };
            /// <method>
            /// <name>setReportThreshold</name>
            /// <param name = "level" type = "variant">Int or string value.  Int values are 0 - 7, and String values are: ALL, DEBUG, ADVISORY, NORMAL, WARNING, ERROR, FATAL, NONE</param>
            /// <description>Sets the report threshold for <i>sendMessage</i>.   Messages sent below this level will not be propogated.</description>
            /// </method>
            ///
            t.setReportThreshold = function (i) {
                /// If a number, retrieve the level name
                ///
                if (DATATYPES.TN(i)) i = t.data.l[i];
                /// If the level name is a valid index ...
                ///
                if (DATATYPES.TN(t.data.lm[i])) {
                    t.properties.rt = t.data.lm[i];
                }
            };

            /// <method>
            /// <name>getEntries</name>
            /// <return-value name = "aBuffer" type = "array">Array of recent messages.</return-value>
            /// <description>Returns the current message buffer.</description>
            /// </method>
            ///
            t.getEntries = function () {
                return t.objects.e;
            };

            /// <method>
            /// <name>clearEntries</name>
            /// <description>Clears message entries.</description>
            /// </method>
            ///
            t.clearEntries = function () {
                t.objects.e = [];
            };

            /// <method>
            /// <name>getDeliveryDelay</name>
            /// <return-value name = "d" type = "int">Delay in milliseconds between publication and delivery.</return-value>
            /// <description>Returns the delay in milliseconds between publication and delivery.</description>
            /// </method>
            ///
            t.getDeliveryDelay = function () {
                return t.properties.dd;
            };

            /// <method>
            /// <name>setDeliveryDelay</name>
            /// <param name = "d" type = "int">Sets the delay in milliseconds.</param>
            /// <description>Sets the delay in milliseconds between publication and delivery.</description>
            /// </method>
            ///
            t.setDeliveryDelay = function (i) {
                if (DATATYPES.TN(i) && i >= 0)
                    t.properties.dd = i;

            };

            t.newSubscriptionObject = function (o, n, h, g) {
                return {
                    object: o,
                    subscription_name: n,
                    handler: h,
                    target: g
                };
            };

            /// <method>
            /// <name>subscribe</name>
            /// <param name = "o" type = "object">The object for which the subscription will belong.</param>
            /// <param name = "e" type = "String">The name of the publication.</param>		
            /// <param name = "f" type = "function">Function to be invoked on message publication.</param>		
            /// <param name = "v" type = "object">Reference object, such as the publication owner, used to filter publications to this subscription.</param>		
            /// <description>Subscribes an object to receive message publications for the specified publication name.</description>
            /// </method>
            ///
            t.subscribe = function (o, e, f, v) {

                var l, a = arguments, t = this;

                if (a.length == 4) {
                    if (!o) o = window;
                    if (!v) v = null;
                }
                if (a.length == 2) {

                    var t1 = a[0], t2 = a[1];
                    o = window;
                    e = t1;
                    f = t2;
                }

                if (!DATATYPES.TO(t.objects.s[e])) t.objects.s[e] = [];
                l = t.objects.s[e].length;
                t.objects.s[e][l] = t.newSubscriptionObject(o, e, f, v);


                return 0;
            };

            /// <method>
            /// <name>unsubscribe</name>
            /// <param name = "o" type = "object">The object for which the subscription belongs.</param>
            /// <param name = "e" type = "String">The name of the publication.</param>		
            /// <param name = "f" type = "function">Function invoked on message publication.</param>		
            /// <description>Unsubscribes an object from receiving message publications for the specified publication name.</description>
            /// <return-value name = "b" type = "boolean">Returns true if unsubscribed, false otherwise.</return-value>
            /// </method>
            ///
            t.unsubscribe = function (o, e, f) {


                var t = this, a = [], l, i = 0, z, g = arguments;

                if (g.length == 2) {
                    var t1 = g[0], t2 = g[1];
                    o = window;
                    e = t1;
                    f = t2;
                }
                if (!DATATYPES.TO(t.objects.s[e])) return 0;

                l = t.objects.s[e].length;
                for (; i < l; i++) {
                    z = t.objects.s[e][i];
                    if (
						z.object != o
						|| z.handler != f
					) {
                        a[a.length] = z;
                    }
                }
                t.objects.s[e] = a;
                return 1;
            };

            /// <method>
            /// <name>sigterm</name>
            /// <description>Termination signal indicating the message service should stop processing messages and subscriptions, and be prepared for destruction.</description>
            /// </method>
            ///
            t.sigterm = function () {
                var t = this;
                t.ready_state = 5;
                t.properties.dd = 0;
                t.objects.dd = [];
                t.objects.e = [];
            };

            /// <method>
            /// <name>flush</name>
            /// <description>Clears delayed delivery cache.</description>
            /// </method>
            ///
            t.flush = function () {
                t.objects.dd = [];
            };

            /// <method private = "1" internal = "1">
            /// <name>_delayPublish</name>
            /// <param name = "i" type = "String">Identifier of the cached message item to be delivered for the corresponding subscribers.</param>
            /// <description>End action for a delayed publication.  Cached message is sent directly on to publication.</description>
            /// </method>
            ///
            t._delayPublish = function (i) {

                var t = this, d;
                if (t.ready_state != 4) return;
                if (DATATYPES.TS(i) && DATATYPES.TO(t.objects.dd[i])) {
                    d = t.objects.dd[i];
                    t._publish(d.event, d.data);
                    t.objects.dd[i] = 0;
                }
            };

            /// <method>
            /// <name>publish</name>
            /// <param name = "e" type = "String">The name of the publication.</param>		
            /// <param name = "v" type = "variant">Data being published.</param>
            /// <description>Publishes the specified data to registered subscribers.  If delayed delivery is in effect, caches the message data and sends it after the preset delay in milliseconds.</description>
            /// </method>
            ///
            t.publish = function (e, o) {
                var t = this, c, x, d;
                c = t.object_config;


                if (t.properties.dd) {
                    d = t.objects.dd;
                    x = HemiEngine.guid();
                    d[x] = { data: o, event: e };
                    setTimeout("try{if(Hemi.registry.service.isRegistered('" + t.object_id + "')) Hemi.registry.service.getObject('" + t.object_id + "')._delayPublish('" + x + "');}catch(er){alert('Publish Error In " + e + " To " + t.object_type + "'\n + (er.message || er.description));}", t.properties.dd);
                }
                else {
                    t._publish(e, o);
                }
            };

            /// <method internal = "1" private = "1">
            /// <name>_publish</name>
            /// <param name = "e" type = "String">The name of the publication.</param>		
            /// <param name = "v" type = "variant">Data being published.</param>
            /// <description>Publishes the specified data to registered subscribers.</description>
            /// </method>
            ///
            t._publish = function (e, o) {
                var t = this, c, j, l, i, z, x, d;
                if (t.ready_state != 4) return;
                c = t.object_config;
                if (!DATATYPES.TO(t.objects.s[e])) return;

                l = t.objects.s[e].length;

                for (i = l - 1; i >= 0; ) {
                    z = t.objects.s[e][i--];
                    if (
							!z.target || z.target == o
					) {

                        try {

                            if (DATATYPES.TS(z.handler))
                                z.object[z.handler](e, o);

                            else if (DATATYPES.TF(z.handler))
                                z.handler(e, o);

                        }
                        catch (e) {
                            alert("Publish Error: " + e.message + "\n" + z.subscription_name + " : " + z.handler + "\n" + HemiEngine.error.traceRoute(z.object[z.handler]));
                        }


                    }
                }
            };



            /// <object>
            /// <name>Message</name>
            /// <description>Object published to <i>onsendmessage</i> subscribers when the <i>sendMessage</i> method is invoked.</description>
            /// <property name = "message" type = "variant">Variant message body.</property>
            /// <property name = "level" type = "int">The message threshold.</property>
            /// <property name = "description" type = "String">Description of the message origination, if the message type code was mapped to an internal definition.</property>
            /// </object>

            /// <method>
            /// <name>sendMessage</name>
            /// <param name = "d" type = "String">The message data to be sent.</param>		
            /// <param name = "s" type = "String" optional = "1" default = "200.1">Numeric message code.</param>
            /// <param name = "p" type = "boolean" optional = "1" default = "false">Bit indicating the message should raise an alert.</param>		
            /// <description>Sends the specified message as a Message to all <i>onsendmessage</i> subscribers.</description>
            /// <return-value type = "Message" name = "o">The Message created for this message.</return-value>
            /// </method>
            ///
            t.publicSendMessage = function (d, s, p) {
                return t.sendMessage(d, s, p);
            };
            t.sendMessage = function (d, s, p) {

                var o = null, v, t = this, ms;

                if (t.ready_state != 4) return;
                if (!DATATYPES.TS(s)) s = "200";
                v = t.parseMessageInstruction(s);
                if (v.t < t.properties.rt) {
                    return o;
                }
                if (!DATATYPES.TN(p)) p = 0;

                if (p) o = t._raiseBasicMessage(s, d, v);
                o = t._createBasicMessage(s, d, v);
                ms = t.parseMessage(o);
                if (ms == null) ms = "[message error]";
                t.publish("onsendmessage", { message: ms, level: v.t, description: o.d });

                return o;
            };
            t._raiseBasicMessage = function (s, d, v) {
                var t = this, o;

                o = t._createBasicMessage(s, d, v);

                alert(t.parseMessage(o));
                return o;
            };
            t.newBasicMessage = function (e, d) {
                return {
                    entry: e,
                    index: -1,
                    data: d,
                    time: new Date(),
                    id: HemiEngine.guid()
                };
            };
            t._createBasicMessage = function (s, d, v) {
                var o, i, c, t = this;
                o = t.newBasicMessage(v, d);
                c = t.object_config;
                i = t.objects.e.length;

                if (i >= t.properties.me && t.properties.me > 0) {
                    t.objects.e.shift();
                    i--;
                }

                o.index = i;
                t.objects.e[i] = o;
                return o;
            };

            /// <method>
            /// <name>parseMessage</name>
            /// <param type = "Message" name = "o">A Message object.</param>
            /// <return-value type = "String" name = "sMessage">Formatted message.</return-value>
            /// <description>Parses a message object and returns a formatted construct suitable for printing to a log.</description>
            /// </method>			
            t.parseMessage = function (o) {
                var v = "[error]", a, l, d, c, t = this;
                c = t.object_config;
                if (DATATYPES.TO(o)) {
                    a = t._getMessageDefinition(o);
                    d = o.time;

                    var m = "" + d.getMinutes(),
						s = "" + d.getSeconds(),
						ms = "" + d.getMilliseconds()
					;
                    if (s.length == 1) s = "0" + s;
                    if (m.length == 1) m = "0" + m;
                    if (ms.length == 1) ms = "0" + ms;
                    if (ms.length == 2) ms = "0" + ms;


                    v = d.getHours() + ":" + m + ":" + s + ":" + ms + "::";
                    v += t._getMessageStatusCode(o.entry.t) + ": ";

                    v += (a != null ? a[0] : ":");
                    v += " (" + o.entry.m + ").";
                    o.d = (a != null ? a[1] : "");
                    if (o.data)
                        v += " " + o.data;

                    else
                        v += " " + o.d;

                }

                return v;
            };
            t._getMessageStatusCode = function (i) {
                return this.data.l[i];
            };

            /// After a message definition is registered, the encoded definition data must be resorted
            /// Otherwise, the message definition may (and probably will) return the wrong label!
            /// The hemi.util.logger invokes this for new message definitions
            ///
            t._blc = function(){
                this.data.ed.sort(function(a,b){
                    return (a[2] < b[2] ? -1 : 1);
                });
            };
            t._getMessageDefinition = function (o) {
                var v = null, f = 100, l, m, n, i = 0, a, d, t = this;

                if (DATATYPES.TO(o)) {
                    l = t.data.ed.length;
                    m = o.entry.mc;

                    n = o.entry.nc;
                    for (; i < l; i++) {
                        a = t.data.ed[i];
                        if (a.length >= 2) {
                            d = a[2];

                            if (m >= d && m < (d + f))
                                v = a;

                            if (v != null && m > (d + f)) {

                                break;
                            }
                        }
                    }
                }
                return v;
            };
            /// Given some code in the format of ###.###.###
            /// Return the corresponding instruction object
            ///
            t.parseMessageInstruction = function (s) {
                var a = [], c, i = 100, o, m = 0, n, x = 999, d, p, y;
                o = i;
                if (s) a = s.split(".");


                c = (a[0]) ? parseInt(a[0]) : 200;

                for (y = i; y <= x; y += 100) {
                    if (c >= i && c < (y + i))
                        m = i;

                    if (m > 0 && m <= (y + 100)) break;
                }

                if (m < 0 || m > x || c < 0 || c > x) {
                    m = 200;
                    c = 200;
                }

                n = c - m;
                d = (a[1]) ? parseInt(a[1]) : 3;
                if (d > 7 || d < 0) d = 3;
                l = (a[2]) ? parseInt(a[2]) : 0;
                p = (a[3]) ? parseInt(a[3]) : 0;
                return {
                    mc: c,
                    mb: m,
                    nc: n,
                    t: d,
                    l: l,
                    id: p,
                    d: "",
                    m: c + "." + d + "." + l + "." + p
                };
            };

            HemiEngine.prepareObject("message_service", "%FILE_VERSION%", 0, t);
            HemiEngine.registry.service.addObject(t);
            t.ready_state = 4;
            


            
        }
    }, 1);

    /// </class>

    ///	<static-class>
    ///		<name>xml</name>
    ///		<version>%FILE_VERSION%</version>
    ///		<description>XML Utilities for making AJAX and JSON requests, result caching, request pooling, and XML-XHTML node manipulation.</description>

    /// <example>
    /// <name>Synchronous GET</name>
    /// <description>Make a synchronous request for an XML document.</description>
    /// <syntax>[xml_dom_object] = getXml(path);</syntax>
    /// <code>var oXml = Hemi.xml.getXml("/Data/Test1.xml");</code>
    /// </example>

    /// <example>
    /// <name>Asynchronous GET</name>
    /// <description>Make an asynchronous request for an XML document.</description>
    /// <syntax>[int] = getXml(path,custom_handler,1,{optional_id});</syntax>
    /// <code>function HandleXml(s,v){</code>
    /// <code>   var oXml = v.xdom;</code>
    /// <code>}</code>
    /// <code>Hemi.xml.getXml("/Data/Test1.xml",HandleXml,1);</code>
    /// </example>

    /// <example>
    /// <name>Cached Asynchronous GET</name>
    /// <description>Asynchronously request an XML document, and cached the result for later referal.</description>
    /// <syntax>[int] = getXml(path,custom_handler,1,request_id,1);</syntax>
    /// <code>function HandleXml(s,v){</code>
    /// <code>   var oXml = v.xdom;</code>
    /// <code>}</code>
    /// <code>Hemi.xml.getXml("/Data/Test1.xml",HandleXml,1,"cache-me",1);</code>
    /// </example>

    /// <example>
    /// <name>Synchronous POST</name>
    /// <description>Synchronously post data to the server.</description>
    /// <syntax>[xml_dom_object] = postXml(path,data);</syntax>
    /// <code>var oPostThis = Hemi.xml.newXmlDocument("Request");</code>
    /// <code>var oData = oPostThis.createElement("data");</code>
    /// <code>oData.setAttribute("id","data-id");</code>
    /// <code>oData.setAttribute("value","data-value");</code>
    /// <code>oPostThis.documentElement.appendChild(oData);</code>
    /// <code>var oResponseXml = Hemi.xml.postXml("/Data/TestData.aspx",oPostThis);</code>
    /// </example>

    /// <example>
    /// <name>Asynchronous POST</name>
    /// <description>Asynchronously post data to the server.</description>
    /// <syntax>[int] = postXml(path,data,custom_handler,1,{optional_id});</syntax>
    /// <code>function HandleXml(s,v){</code>
    /// <code>   var oResponseXml = v.xdom;</code>
    /// <code>}</code>
    /// <code>var oPostThis = Hemi.xml.newXmlDocument("Request");</code>
    /// <code>var oResponseXml = Hemi.xml.postXml("/Data/TestData.aspx",oPostThis,HandlePostXml,1);</code>
    /// </example>


    /// <object private="1">
    /// <name>XmlHttp</name>
    /// <description>Object representing a pooled XMLHTTP resource</description>
    /// <property name = "xml_object" type = "object">An XMLHttp object.</property>
    /// <property name = "in_use" type = "boolean">Bit indicating whether the object is in use.</property>
    /// <property name = "vid" type = "int">Integer identifying the variant object identifier.</property>
    /// <property name = "handler" type = "function">Anonymous wrapper to invoke the internal readystate or complete handler for the specified identifier.</property>
    /// </object>
    ///
    /// <object>
    /// <name>XmlObject</name>
    /// <description>Object passed to the event handler following an XML request using <i>getXml</i> or <i>postXml</i>.</description>
    /// <property name = "xdom" type = "XMLDocument">An XML Document object.</property>
    /// <property name = "id" type = "String">Identifier used to distinguish the request for this XML Document from other requests.</property>
    /// </object>
    ///

    HemiEngine.namespace("xml", HemiEngine, {
        object_version: "%FILE_VERSION%",

        /// <property type = "String" get = "1" set = "1" default = "text/xml">
        /// <name>xml_content_type</name>
        /// <description>Specifies the content type to use posting data.</description>
        /// </property>
        xml_content_type: "text/xml",

        /// <property type = "String" get = "1" set = "1" default = "text/xml">
        /// <name>text_content_type</name>
        /// <description>Specifies the content type to use requesting and receiving text data (eg: JSON).</description>
        /// </property>
        text_content_type: "text/plain",
        
        /// <property type = "String" get = "1" set = "1" default = "text/xml">
        /// <name>json_content_type</name>
        /// <description>Specifies the content type to use requesting and receiving json data (eg: JSON).</description>
        /// </property>
        json_content_type: "application/json",

        /// <property type = "boolean" get = "1" set = "1">
        /// <name>auto_content_type</name>
        /// <description>Specifies whether to determine posted content type by included post value.</description>
        /// </property>
        auto_content_type: 1,

        /// <property type = "String" get = "1" set = "1">
        /// <name>form_content_type</name>
        /// <description>Specifies the content type to use when auto_content_type is true and the post value is a string.</description>
        /// </property>
        form_content_type: "application/x-www-form-urlencoded",
        _xml_requests: [],
        _xml_requests_map: [],

         _xml_http_cache_enabled: 1,

        /// <method>
        /// <name>setCacheEnabled</name>
        /// <param name="b" type="boolean">boolean indicating whether caching is enabled.</param>
        /// </method>
        ///
        setCacheEnabled: function (b) {
            HemiEngine.xml.clearCache();
            HemiEngine.xml._xml_http_cache_enabled = b;
        },

        /// <method>
        /// <name>getCacheEnabled</name>
        /// <return-value name="b" type="boolean">boolean indicating whether caching is enabled.</return-value>
        /// </method>
        ///
        getCacheEnabled: function () {
            return HemiEngine.xml._xml_http_cache_enabled;
        },

        _xml_http_objects: [],
        _xml_http_object_use: 0,
        _xml_http_object_count: 0,
        _xml_http_object_pool_size: 5,
        _xml_http_object_pool_max: 50,
        _xml_http_pool_created: 0,
        _xml_http_pool_enabled: 0,
        si: 0,

        /// <method>
        /// <name>setPoolEnabled</name>
        /// <param name="b" type="boolean">boolean indicating whether pooling is enabled.</param>
        /// </method>
        ///
        setPoolEnabled: function (b) {
            HemiEngine.xml._xml_http_pool_enabled = b;
        },

        /// <method>
        /// <name>getPoolEnabled</name>
        /// <return-value name="b" type="boolean">boolean indicating whether pooling is enabled.</return-value>
        /// </method>
        ///
        getPoolEnabled: function () {
            return HemiEngine.xml._xml_http_pool_enabled;
        },

        /// <method>
        /// <name>parseXmlDocument</name>
        /// <param name="s" type="String">XML source text.</param>
        /// <return-value name="oXml" type="XMLDocument">XMLDocument object.</return-value>
        /// </method>
        ///
        parseXmlDocument: function (s) {


            var r = 0, e;
            if (!s) return 0;
            if (typeof DOMParser != DATATYPES.TYPE_UNDEFINED) {
                e = new DOMParser();
                r = e.parseFromString(s, "text/xml");
            }
            else {

            }
            return r;
        },

        /// <method>
        /// <name>newXmlDocument</name>
        /// <param name="s" type="String">Name of root node to create in new document.</param>
        /// <return-value name="oXml" type="XMLDocument">XMLDocument object.</return-value>
        /// </method>
        ///
        newXmlDocument: function (n) {


            var r = 0, e;
            if (!n) return 0;
            if (typeof document.implementation != DATATYPES.TYPE_UNDEFINED && typeof document.implementation.createDocument != DATATYPES.TYPE_UNDEFINED) {
                r = document.implementation.createDocument("", n, null);

                if (r != null && r.documentElement == null) {
                    r.appendChild(r.createElement(n));
                }
            }
            else {

            }
            return r;
        },
        /// <method>
        /// <name>getRequestArray</name>
        /// <return-value type = "array" name = "aRequests">An array of requests.</return-value>
        /// <description>Returns an array of XML requests.</description>
        /// </method>
        ///
        getRequestArray: function () {
            return HemiEngine.xml._xml_requests;
        },

        /// <method>
        /// <name>clear</name>
        /// <description>Clears the request maps and caches.</description>
        /// </method>
        ///
        clear: function () {
            var _x = HemiEngine.xml;

            _x.clearCache();



            _x.resetXmlHttpObjectPool();


            _x._xml_requests = [];
            _xml_requests_map = [];

            return 1;
        },

        /// <method>
        /// <name>clearCache</name>
        /// <description>Clears the response cache.</description>
        /// </method>
        ///
        clearCache: function () {
            var _x = HemiEngine.xml, i = 0, o;
            for (; i < _x._xml_requests.length; i++) {
                o = _x._xml_requests[i];
                if (o.c && typeof o.cd == DATATYPES.TYPE_OBJECT) {

                    o.cd = 0;
                }
                o.obj = null;
                o.ih = null;
                o.h = null;
            }
            _x._xml_requests = [];
            _x._xml_requests_map = [];
        },


        /// <method>
        /// <name>getXmlHttpArray</name>
        /// <return-value name="aXml" type="array">Array of XmlHttp objects.</return-value>
        /// </method>
        ///
        getXmlHttpArray: function () {
            return HemiEngine.xml._xml_http_objects;
        },

        /// <method>
        /// <name>resetXmlHttpObjectPool</name>
        /// <description>Resets the current pool with new instances of XMLHttpRequest objects.</description>
        /// </method>
        ///
        resetXmlHttpObjectPool: function () {
            var _x = HemiEngine.xml, i = 0, o;
            _x._xml_http_pool_created = 1;
            _x._xml_http_object_use = 0;
            _x._xml_http_objects = [];
            _x._xml_http_object_count = _x._xml_http_object_pool_size;
            for (; i < _x._xml_http_object_pool_size; i++)
                o = _x._xml_http_objects[i] = _x.newXmlHttpObject(1, i);

        },

        /// <method>
        /// <name>testXmlHttpObject</name>
        /// <description>Tests whether an XMLHTTPRequest object can be created.</description>
        /// <return-value name="b" type="boolean">Bit indicating whether a new XMLHTTPRequest object was created.</return-value>
        /// </method>
        ///
        testXmlHttpObject: function () {
            return HemiEngine.xml.newXmlHttpObject(null, null, 1);
        },

        /// <method private = "1">
        /// <name>newXmlHttpObject</name>
        /// <description>Creates a new XMLHTTPRequest object.</description>
        /// <param name="b" type="boolean">Bit indicating whether to wrap the new object in an internal XmlHttp object for use with pooling.</param>
        /// <param name="i" type="int">Pool index to set on new XmlHttp object.</param>
        /// <param name="z" type="boolean">Bit indicating whether this is a test operation, and to return true if the object was created, or false otherwise.</param>
        /// <return-value name="v" type="variant">Return value is determined by the specified parameters.</return-value>
        /// </method>
        ///
        newXmlHttpObject: function (b, i, z) {

            var o = null, v, f, _m = HemiEngine.message.service, a = 0;
            /// 2011/04/26
            /// Work-around for IE 9 (which may break Opera offline) : 
            ///   If offline (file:) and ActiveX is supported, use ActiveX instead of XMLHTTPRequest
            ///   
            o = new DATATYPES.XMLHTTPREQUEST();
            if (z) return 1;
            if (b && typeof i == DATATYPES.TYPE_NUMBER) {
                v = {
                    o: o,
                    u: 0,
                    i: i,
                    v: -1,
                    h: 0
                };
                return v;
            }
            else {
                return o;
            }
        },

        /// <method private = "1">
        /// <name>returnXmlHttpObjectToPool</name>
        /// <description>Returns an in-use XmlHttp object to the pool of available resources.</description>
        /// <param name="i" type="int">Pool index of the XmlHttp object to be returned.</param>
        /// <param name="y" type="boolean">Bit indicating whether the pool object was requested for asynchronous operation.</param>
        /// </method>
        ///
        returnXmlHttpObjectToPool: function (i, y) {
            var _x = HemiEngine.xml, b = 0, o, a;
            a = _x._xml_http_objects;
            if (typeof a[i] == DATATYPES.TYPE_OBJECT) {
                o = a[i];
                if (o.i >= _x._xml_http_object_pool_size)


                    a[i] = 0;



                try {
                    if (!y) {
                        o.o.removeEventListener("load", o.h, false);
                        o.h = 0;
                    }
                }
                catch (e) {
                    HemiEngine.message.service.sendMessage("Error in returnXmlHttpObjectToPool: " + (e.description ? e.description : e.message), "512.4", 1);
                }

                o.o.abort();
                o.u = 0;
                o.v = -1;
                _x._xml_http_object_use--;
            }

            return 1;
        },

        /// <method private = "1">
        /// <name>getXmlHttpObjectFromPool</name>
        /// <description>Retrieves the next available XmlHttp object from the pool of available resources.</description>
        /// <param name="y" type="boolean">Bit indicating whether the pool object is requested for asynchronous operation.</param>
        /// <return-value name="oXml" type="XmlHttp">An XmlHttp object.</return-value>
        /// </method>
        ///	
        getXmlHttpObjectFromPool: function (y) {
            var _x = HemiEngine.xml, i = 0, b = 0, o, a, _m = HemiEngine.message.service, n = -1, z = 0;
            if (!_x._xml_http_pool_created) _x.resetXmlHttpObjectPool();
            a = _x._xml_http_objects;
            for (; i < a.length; i++) {
                if (typeof a[i] == DATATYPES.TYPE_OBJECT && typeof a[i].u == DATATYPES.TYPE_NUMBER && !a[i].u) {
                    a[i].u = 1;
                    b = i;

                    z = 1;
                    break;
                }

                if (n == -1 && !a[i])
                    n = i;

            }
            if (!z) {
                b = (n > -1) ? n : a.length;
                if (b < _x._xml_http_object_pool_max) {
                    a[b] = _x.newXmlHttpObject(1, b);
                    a[b].u = 1;

                }
                else {
                    _m.sendMessage("Max pool size reached!", "200.4");
                    return null;
                }
            }
            if (b > -1) {
                _x._xml_http_object_use++;
                o = a[b];

                try {
                    if (!y) {
                        o.h = function () { HemiEngine.xml._handle_xml_request_load(b); };
                        o.o.addEventListener("load", o.h, false);
                    }
                }
                catch (e) {
                    _m.sendMessage("Error in getXmlHttpObjectFromPool: " + (e.description ? e.description : e.message), "512.4", 1);
                }
                return o;
            }
            return null;
        },


        _handle_xml_request_load: function (i) {

            var _x = HemiEngine.xml, o, v, _m = HemiEngine.message.service, z;

            try {


                if (_x._xml_http_pool_enabled && typeof _x._xml_http_objects[i] == DATATYPES.TYPE_OBJECT) {
                    z = _x._xml_http_objects[i].v;
                    if (z == -1) {
                        _m.sendMessage("Invalid pool index for " + i, "200.4", 1);
                        return 0;
                    }
                    i = z;
                }


                if (typeof _x._xml_requests_map[i] == DATATYPES.TYPE_NUMBER) {
                    o = _x._xml_requests[_x._xml_requests_map[i]];
                    v = { text: null, xdom: null, json: null, id: (o.bi ? o.bi : i) };

                     if (o.o != null) {
                        if (o.t) {
                            v.text = o.o.responseText;
                            if (o.t == 2 && typeof JSON != DATATYPES.TYPE_UNDEFINED) {
                                try {
                                    v.json = JSON.parse(v.text, _x.JSONReviver);
                                }
                                catch (e) {
                                    v.json = null;
                                    v.error = e.message;
                                    Hemi.logError(e.message);
                                }
                            }
                        }
                        else {
                            v.xdom = o.o.responseXML;
                            if (o.o.responseXML == null || o.o.responseXML.documentElement == null && o.o.responseText != null) {
                                v.xdom = _x.parseXmlDocument(o.o.responseText);
                                v.text = o.o.responseText;
                            }
                        }
                    }
                    if (!o.t && v.xdom == null) {
                        _m.sendMessage("Error loading '" + o.u + "'. Response text is: " + o.o.responseText + ".   Async is " + o.a + "; Pool Index is " + o.pi, "540.4", 1);
                    }
                    else if (o.t == 2 && v.json == null) {
                        _m.sendMessage("Error loading '" + o.u + "'. The internal JSON object reference is null.  Async is " + o.a + "; Pool Index is " + o.pi, "540.4");
                    }


                    o.r = 1;

                    if (o.ih) {
                        o.ih = 0;
                    }


                    if (_x._xml_http_cache_enabled && o.c) {
                        if(!o.t) o.cd = v.xdom;
						else o.ct = v.text;
                    }


                    HemiEngine.message.service.publish("onloadxml", v);
                    if (typeof o.h == DATATYPES.TYPE_FUNCTION) o.h("onloadxml", v);



                    if (o.pi > -1)
                        _x.returnXmlHttpObjectToPool(o.pi, !o.a);


                    o.o = 0;

                }
                else {
                    _m.sendMessage("Invalid id reference: " + i, "200.4", 1);
                }

            }
            catch (e) {
                _m.sendMessage("Error in handle_xml_request_load: " + (e.description ? e.description : e.message), "512.4", 1);
            }

        },

        /// <method>
        /// <name>getJSON</name>
        /// <description>Retrieve a JSON object from the specified path.</description>
        /// <param name="p" type="String">Path of the JSON source.  If specifying the server, note the server name and port must match the context host name and port.</param>
        /// <param name="h" type="function" optional = "1" default="null">Function to invoke when a response is received.</param>
        /// <param name="a" type="boolean" optional = "1" default="false">Bit indicating whether the request is an asynchronous operation.</param>
        /// <param name="i" type="String" optional = "1" default="null">Identifier to assign to the request.</param>
        /// <param name="c" type="boolean" optional = "1" default="false">Bit indicating whether the response should be cached.</param>
        /// <return-value name="v" type="variant">Returns boolean for asynchronous operations, and a JSON object for synchronous operations.</return-value>
        /// </method>
        ///	
        getJSON: function (p, h, a, i, c) {

            return HemiEngine.xml._request_xmlhttp(p, h, a, i, 0, null, c, 2);
        },
        
        promiseJSON: function (p, m, d, i) {
        	return HemiEngine.xml.promise(p, m, d, i, 2);
        },
 
        deleteJSON: function (p, h, a, i, c) {
            return HemiEngine.xml._request_xmlhttp(p, h, a, i, "DELETE", null, c, 2);
        },

        /// <method>
        /// <name>getText</name>
        /// <description>Retrieve text from the specified path.</description>
        /// <param name="p" type="String">Path of the text source.  If specifying the server, note the server name and port must match the context host name and port.</param>
        /// <param name="h" type="function" optional = "1" default="null">Function to invoke when a response is received.</param>
        /// <param name="a" type="boolean" optional = "1" default="false">Bit indicating whether the request is an asynchronous operation.</param>
        /// <param name="i" type="String" optional = "1" default="null">Identifier to assign to the request.</param>
        /// <param name="c" type="boolean" optional = "1" default="false">Bit indicating whether the response should be cached.</param>
        /// <return-value name="v" type="variant">Returns boolean for asynchronous operations, and text for synchronous operations.</return-value>
        /// </method>
        ///	
        getText: function (p, h, a, i, c) {

            return HemiEngine.xml._request_xmlhttp(p, h, a, i, 0, null, c, 1);
        },
        
        promiseText: function (p, m, d, i) {
        	return HemiEngine.xml.promise(p, m, d, i, 1);
        },
        
        deleteText: function (p, h, a, i, c) {

            return HemiEngine.xml._request_xmlhttp(p, h, a, i, "DELETE", null, c, 1);
        },

        /// <method>
        /// <name>getXml</name>
        /// <description>Retrieve an XML document from the specified path.</description>
        /// <param name="p" type="String">Path of the XML source.  If specifying the server, note the server name and port must match the context host name and port.</param>
        /// <param name="h" type="function" optional = "1" default="null">Function to invoke when a response is received.</param>
        /// <param name="a" type="boolean" optional = "1" default="false">Bit indicating whether the request is an asynchronous operation.</param>
        /// <param name="i" type="String" optional = "1" default="null">Identifier to assign to the request.</param>
        /// <param name="c" type="boolean" optional = "1" default="false">Bit indicating whether the response should be cached.</param>
        /// <return-value name="v" type="variant">Returns boolean for asynchronous operations, and an XMLDocument object for synchronous operations.</return-value>
        /// </method>
        ///	
        getXml: function (p, h, a, i, c) {

            return HemiEngine.xml._request_xmlhttp(p, h, a, i, 0, null, c);
        },
        promiseXml: function (p, m, d, i) {
        	return HemiEngine.xml.promise(p, m, d, i, 0);
        },
        deleteXml: function (p, h, a, i, c) {

            return HemiEngine.xml._request_xmlhttp(p, h, a, i, "DELETE", null, c);
        },

        /// <method>
        /// <name>postJSON</name>
        /// <description>Posts a JSON object to the specified path and returns any JSON response.</description>
        /// <param name="p" type="String">Path of the XML source.  If specifying the server, note the server name and port must match the context host name and port.</param>
        /// <param name="d" type="XMLDocument">XMLDocument to post the server</param>
        /// <param name="h" type="function" optional = "1" default="null">Function to invoke when a response is received.</param>
        /// <param name="a" type="boolean" optional = "1" default="false">Bit indicating whether the request is an asynchronous operation.</param>
        /// <param name="i" type="String" optional = "1" default="null">Identifier to assign to the request.</param>
        /// <return-value name="v" type="variant">Returns boolean for asynchronous operations, and a JSON object for synchronous operations.</return-value>
        /// </method>
        ///	
        postJSON: function (p, d, h, a, i) {

            if (typeof JSON == "undefined") {
                HemiEngine.logError("Missing JSON interpreter");
                return 0;
            }
            return HemiEngine.xml._request_xmlhttp(p, h, a, i, 1, JSON.stringify(d), 0, 2);
        },
        
        

        /// <method>
        /// <name>postText</name>
        /// <description>Posts text to the specified path and returns any text response.</description>
        /// <param name="p" type="String">Path of the XML source.  If specifying the server, note the server name and port must match the context host name and port.</param>
        /// <param name="d" type="XMLDocument">XMLDocument to post the server</param>
        /// <param name="h" type="function" optional = "1" default="null">Function to invoke when a response is received.</param>
        /// <param name="a" type="boolean" optional = "1" default="false">Bit indicating whether the request is an asynchronous operation.</param>
        /// <param name="i" type="String" optional = "1" default="null">Identifier to assign to the request.</param>
        /// <return-value name="v" type="variant">Returns boolean for asynchronous operations, and text for synchronous operations.</return-value>
        /// </method>
        ///	
        postText: function (p, d, h, a, i) {

            return HemiEngine.xml._request_xmlhttp(p, h, a, i, 1, d, 0, 1);
        },

        /// <method>
        /// <name>postXml</name>
        /// <description>Posts an XML document to the specified path and returns any XML response.</description>
        /// <param name="p" type="String">Path of the XML source.  If specifying the server, note the server name and port must match the context host name and port.</param>
        /// <param name="d" type="XMLDocument">XMLDocument to post the server</param>
        /// <param name="h" type="function" optional = "1" default="null">Function to invoke when a response is received.</param>
        /// <param name="a" type="boolean" optional = "1" default="false">Bit indicating whether the request is an asynchronous operation.</param>
        /// <param name="i" type="String" optional = "1" default="null">Identifier to assign to the request.</param>
        /// <return-value name="v" type="variant">Returns boolean for asynchronous operations, and an XMLDocument object for synchronous operations.</return-value>
        /// </method>
        ///	
        postXml: function (p, d, h, a, i) {

            return HemiEngine.xml._request_xmlhttp(p, h, a, i, 1, d, 0);
        },
        
        promise : function(p, m, d, i, t){
        	var  n= ["xdom","text","json"][t];

        	return new Promise(function (resolve, reject) {
                HemiEngine.xml._request_xmlhttp(p,
                	function(s,v){
                		if(v && v[n] && (t == 1 || (DATATYPES.TO(v[n]) && v[n] != null))){
                			resolve(v[n]);
                		}
                		else{
                			///reject(v.message);
                			resolve();
                		}
                	},
                	1, (i ? i : p), (m ? m : (d ? "POST" : "GET")), (d ? d : null), 1, t);
        	});
        },

        /// <message>
        /// <name>onloadxml</name>
        /// <param name = "oXml" type = "XmlObject">The Hemi.xml object representing the request.</param>
        /// <description>Message published to all subscribers when an xml request has completed loading.  This message is published for text and JSON requests made through the XML request.</description>
        /// </message>

        /// <method private = "1">
        /// <name>_request_xmlhttp</name>
        /// <description>Assembles and opens an XMLHTTP Request.</description>
        /// <param name="p" type="String">Path to the XML data source.</param>
        /// <param name="h" type="function" optional="1" default="null">Handler invoked for asynchronous requests.</param>
        /// <param name="a" type="boolean" optional="1" default = "false">Bit indicating whether the request is asynchronous.</param>
        /// <param name="i" type="String" optional = "1" default = "auto">Identifier used to track the request and retrieve cached results.</param>
        /// <param name="x" type="String" optional="1" default = "false">String representing the HTTP verb, or legacy bit field indicating whether the request is a post.</param>
        /// <param name="d" type="XMLDocument" optional="1" default = "null">XML Document to send with post request.</param>
        /// <param name="c" type="boolean" optional="1" default = "false">Bit indicating whether the response should be cached.</param>
        /// <param name="t" type="int" optional="1" default = "0">Int indicating whether the request and response as text (1) or JSON (2) instead of XML (0).</param>
        /// <return-value name="v" type="variant">Returns a boolean value for asynchronous requests, an XML Document for synchronous requests, text when the text bit is set to (1), and a JSON object when the text bit is set to (2).</return-value>
        /// </method>
        ///	
        _request_xmlhttp: function (p, h, a, i, x, d, c, t) {

            var _x = HemiEngine.xml, f, o = null, v, _m = HemiEngine.message.service, y, z, r, b, g, bi = 0;

            if (typeof p != DATATYPES.TYPE_STRING || p.length == 0) {
                _m.sendMessage("Invalid path parameter '" + p + "' in _request_xmlhttp", "512.4", 1);
                return 0;
            }
			
            if (typeof c == DATATYPES.TYPE_UNDEFINED) c = 0;
            if (typeof x == DATATYPES.TYPE_UNDEFINED) x = 0;
            if (typeof d == DATATYPES.TYPE_UNDEFINED) d = null;
            z = (x ? (typeof x == "string" ? x : "POST") : "GET");
            if (typeof i != DATATYPES.TYPE_STRING) i = HemiEngine.guid();

			/// 2011/02/22 Only use the proxy if loaded
			///
			if( HemiEngine.lookup("hemi.data.io.proxy")){
				if(HemiEngine.data.io.proxy.service.isProxied(p)){
					return HemiEngine.data.io.proxy.service.proxyXml(p, h, a, i, x, d, c, t);
				}
				p = HemiEngine.data.io.proxy.service.stripProxyProtocol(p);
			}

            if (
				_x._xml_http_cache_enabled
				&&
				typeof _x._xml_requests_map[i] == DATATYPES.TYPE_NUMBER
				&&
				(r = _x._xml_requests[_x._xml_requests_map[i]])
			) {
                if (r.c && (typeof r.cd == DATATYPES.TYPE_OBJECT || typeof r.ct == DATATYPES.TYPE_STRING)) {
                    if (!t)
                        b = { xdom: r.cd, id: i };
                    else {
                        b = { text: r.ct, id: i };
                        if (t == 2 && typeof JSON != DATATYPES.TYPE_UNDEFINED){
                            try {
                                b.json = JSON.parse(r.ct, _x.JSONReviver);
                            }
                            catch (e) {
                                b.json = null;
                                b.error = e.message;
                                Hemi.logError(e.message);
                            }
                        }
                    }
                    if (b) {
                        _m.publish("onloadxml", b);
                        if (typeof h == DATATYPES.TYPE_FUNCTION) h("onloadxml", b);
                        return (t ? (t==2 ? b.json : b.text) : b.xdom);
                    }
                }
                else if (!r.r) {
                    c = 0;
                    bi = i;
                    i = HemiEngine.guid();
                }
            }
            b = _x._xml_http_pool_enabled;
            if (b) {

                r = _x.getXmlHttpObjectFromPool(!a);

            }
            else {

                r = _x.newXmlHttpObject();

            }


            if (!(b ? (r && r.o) : r)) {
                _m.sendMessage("Null XML object in in _request_xmlhttp.", "512.4");

                b = { text: null, xdom: null, error: "Null XML object in _request_xmlhttp", id: i };
                if (typeof h == DATATYPES.TYPE_FUNCTION) h("onloadxml", b);
                return 0;
            }


            if (b) r.v = i;


            y = _x._xml_requests.length;
            _x._xml_requests[y] = {
                u: p,
                i: i,
                bi: bi,
                a: a,
                o: (b ? r.o : r),
                ih: 0,
                h: h,
                pi: (b ? r.i : -1),
                c: c,
                cd: 0,
                r: 0,
                t: t
            };

            _x._xml_requests_map[i] = y;
            o = _x._xml_requests[y].o;
            if (!p.match(/:\/\//)) {
                var m, e = new RegExp("^/");
                if (!p.match(e)) {
                    if (HemiEngine.hemi_base) {
                        p = HemiEngine.hemi_base + p;
                    }
                    else {
                        m = location.pathname;
                        if (m.match(/\\/)) m = m.replace(/\\/g, "/");
                        m = m.substring(0, m.lastIndexOf("/") + 1);
                        p = m + p;
                    }
                }
                if(!p.match(/:\/\//)){
                    if (!location.protocol.match(/^file:$/i))
                        p = location.protocol + "//" + location.host + p;

                    else
                        p = location.protocol + "//" + p;
                }
            }

            _x._xml_requests[y].u = p;

            try {
                if (!b && a) {
                    _x._xml_requests[y].ih = function () { HemiEngine.xml._handle_xml_request_load(i); };
                    o.addEventListener("load", _x._xml_requests[y].ih, false);
                }
            }
            catch (e) {
                _m.sendMessage("Error in _request_xmlhttp: " + (e.description ? e.description : e.message), "512.4", 1);
            }

            if (b && !a) {
                _x._xml_http_objects[_x._xml_requests[y].pi] = 0;
            }

            g = (a ? true : false);
            o.open(z, p, g);
            
            z = (t ? (t==2?_x.json_content_type : _x.text_content_type) : _x.xml_content_type);
            if (_x.auto_content_type && !t && typeof d == DATATYPES.TYPE_STRING) z = HemiEngine.xml.form_content_type;
            o.setRequestHeader("Content-Type", z);
            o.send(d);
            
            if (!a) {

                z = (t ? o.responseText : o.responseXML);
            	if (t == 2){
                    try {
                        z = JSON.parse(z, _x.JSONReviver);
                    }
                    catch (e) {
                        z = null;
                        Hemi.logError(e.message);
                    }
            	}
                if (!t && (o.responseXML == null || o.responseXML.documentElement == null)) {
                    z = _x.parseXmlDocument(o.responseText);
                }

                if (b) {

                    _x._xml_http_objects[_x._xml_requests[y].pi] = r;
                    _x._handle_xml_request_load(_x._xml_requests[y].pi);
                }
                else {

                    _x._handle_xml_request_load(i);


                }


                _x._xml_requests[y].o = null;

                if (!b && _x._xml_requests[y].pi > -1)
                    _x.returnXmlHttpObjectToPool(_x._xml_requests[y].pi, !a);


                return z;
            }
            return 1;
        },

        /// <method>
        /// <name>transformNode</name>
        /// <description>Transforms the specified Document with the specified XSL document.</description>
        /// <param name="x" type="variant">XML Document to be transformed.  If specified as a string, the string is used as a path to request the XML Document.</param>
        /// <param name="s" type="Document">XSL Document to transform the XML Document.  If specified as a string, the string is used as a path to request the XSL Document.</param>
        /// <param name="n" type="DOMNode" optional="1" default = "null">DOMNode to transform.</param>
        /// <param name="i" type="String" optional="1" default = "null">Identifier used when requesting the XML Document.</param>
        /// <param name="j" type="String" optional="1" default = "null">Identifier used when requesting the XSL Document.</param>
        /// <param name="p" type="boolean" optional = "1" default = "false">Bit indicating whether a request for the XSL Document should be cached.</param>
        /// <param name="t" type="boolean" optional = "1" default = "false">Bit indicating whether the transformation should expect a type text/plain as a result.</param>
        /// <return-value name="v" type="variant">Depending on the type of copy operation, returns a reference to the newly created node.</return-value>
        /// </method>
        ///
        transformNode: function (x, s, n, i, j, p, t) {

            var xp, o = null, _m = HemiEngine.message.service, _x = HemiEngine.xml, v, a, b, c, d;
            if (typeof x == DATATYPES.TYPE_STRING && x.length > 0) {
                if (p && !i) p = 0;
                v = x;
                x = _x.getXml(x, 0, 0, i, p);
                if (v.match(/\?(\S*)$/)) {
                    v = v.match(/\?(\S*)/)[1];
                    a = v.split("&");
                    for (b = 0; b < a.length; b++) {
                        c = a[b].split("=");
                        x.documentElement.setAttribute(c[0], c[1]);
                    }
                }
            }
            if (typeof s == DATATYPES.TYPE_STRING && s.length > 0) {
                if (p && !j) p = 0;
                s = _x.getXml(s, 0, 0, j, p);
            }
            if (typeof x != DATATYPES.TYPE_OBJECT || x == null || typeof s != DATATYPES.TYPE_OBJECT || s == null) {
                _m.sendMessage("Invalid parameters in transformNode. Xml Node = " + x + ", xsl document = " + s, "512.4", 1);
                return o;
            }
            if (typeof n != DATATYPES.TYPE_OBJECT) n = x;

            try {
                if (typeof XSLTProcessor != DATATYPES.TYPE_UNDEFINED) {
                    xp = new XSLTProcessor();
                    xp.importStylesheet(s);
                    o = xp.transformToFragment(n, document);
					///alert(o==null);
                    if (o && o != null) {
                        if (t) o = HemiEngine.xml.serialize(o);
                        else o = o.firstChild;

                    }
                }
                else {
                    _m.sendMessage("Error in transformNode: " + (e.description ? e.description : e.message), "512.4", 1);
                }
            }
            catch (e) {
                _m.sendMessage("Error in transformNode: " + (e.description ? e.description : e.message), "512.4", 1);
            }

            return o;
        },

        /// <method>
        /// <name>selectSingleNode</name>
        /// <description>Returns a DOM Node selected from the specified document and based on the specified path.</description>
        /// <param name="d" type="XMLDocument">XMLDocument.</param>
        /// <param name="p" type="String">XPath query.</param>
        /// <param name="c" type="DOMNode">Context node.</param>
        /// <return-value name="v" type="String">Returns a DOM Node based on the specified xpath query.</return-value>
        /// </method>
        ///	
        selectSingleNode: function (d, x, c) {

            var s, i, n;
            if (typeof d.evaluate != DATATYPES.TYPE_UNDEFINED) {
                c = (c ? c : d.documentElement);
                s = d.evaluate(x, c, HemiEngine.xml, 0, null);
                return s.iterateNext();
            }
            else if (typeof d.selectNodes != DATATYPES.TYPE_UNDEFINED) {
                return (c ? c : d).selectSingleNode(x);
            }
            return 0;

        },

        /// <method>
        /// <name>selectNodes</name>
        /// <description>Returns an array of DOM Nodes selected from the specified document and based on the specified path.</description>
        /// <param name="d" type="XMLDocument">XMLDocument.</param>
        /// <param name="p" type="String">XPath query.</param>
        /// <param name="c" type="DOMNode">Context node.</param>
        /// <return-value name="aNodes" type="array">Returns an array of DOM Nodes based on the specified xpath query.</return-value>
        /// </method>
        ///	
        selectNodes: function (d, x, c) {

            var s, a = [], i, n;
            if (typeof d.evaluate != DATATYPES.TYPE_UNDEFINED) {
                c = (c ? c : d.documentElement);
                s = d.evaluate(x, c, HemiEngine.xml, 0, null);
                n = s.iterateNext();
                while (typeof n == DATATYPES.TYPE_OBJECT && n != null) {
                    a[a.length] = n;
                    n = s.iterateNext();
                }
                return a;
            }
            else if (typeof d.selectNodes != DATATYPES.TYPE_UNDEFINED) {
                return (c ? c : d).selectNodes(x);
            }
            return a;

        },




        /// <method>
        /// <name>queryNodes</name>
        /// <description>Returns an array of DOM Nodes selected from the specified document and based on the specified parent node name, node name, and attribute name and values.</description>
        /// <param name="d" type="XMLDocument">XMLDocument.</param>
        /// <param name="p" type="String">Parent element name.</param>
        /// <param name="n" type="String" optional="1" default="null">Element name.  Defaults to parent if not specified.</param>
        /// <param name="a" type="String" optional="1" default="null">Attribute name.</param>
        /// <param name="v" type="String" optional="1" default="null">Attribute value.</param>
        /// <return-value name="aNodes" type="array">Returns an array of DOM Nodes based on the specified parent node name, node name, and attribute name and value.</return-value>
        /// </method>
        ///	
        queryNodes: function (x, p, n, a, v) {
            return HemiEngine.xml._queryNode(x, p, n, a, v, 1);
        },

        /// <method>
        /// <name>queryNode</name>
        /// <description>Returns a DOM Node selected from the specified document and based on the specified parent node name, node name, and attribute name and values.</description>
        /// <param name="d" type="XMLDocument">XMLDocument.</param>
        /// <param name="p" type="String">Parent element name.</param>
        /// <param name="n" type="String" optional="1" default="null">Element name.  Defaults to parent if not specified.</param>
        /// <param name="a" type="String" optional="1" default="null">Attribute name.</param>
        /// <param name="v" type="String" optional="1" default="null">Attribute value.</param>
        /// <return-value name="aNodes" type="DOMNode">Returns a DOM Node based on the specified parent node name, node name, and attribute name and value.</return-value>
        /// </method>
        ///
        queryNode: function (x, p, n, a, v) {
            return HemiEngine.xml._queryNode(x, p, n, a, v, 0);
        },
        _queryNode: function (x, p, n, a, v, z) {

            var i = 0, b, e, c, r = [];
            if (!z) r = null;
            /*
            var xp = p + (typeof n == DATATYPES.TYPE_STRING ? " > " + n : "") + (a && v ? "[" + a + "='" + v + "']" : "");
            c = document.querySelectorAll(xp);
            if(!z && c.length) r = c[0];
            else r = c;
            */
             
            c = x.getElementsByTagName(p);

            if (typeof n == DATATYPES.TYPE_STRING) {
                if (!c.length) {
                    if (!z) return null;
                    else return r;
                }
                c = c[0];
                e = c.getElementsByTagName(n);
            }
            else e = c;

            for (; i < e.length; i++) {
                b = e[i];
                if ((!a && !v) || (b.getAttribute(a) == v)) {

                    if (!z) {
                        r = b;
                        break;
                    }
                    else r[r.length] = b;

                }
            }
            
            return r;
        },


        /// <method>
        /// <name>serialize</name>
        /// <description>Returns a string representation of the specified node and its children.</description>
        /// <param name="n" type="DOMNode">XML DOM Node.</param>
        /// <return-value name="s" type="String">String representation of the specified node.</return-value>
        /// </method>
        ///	
        serialize: function (n) {
            var v;
			/// 2011/04/10
			/// Switch order to take property over XMLSerializer
			/// IE 9.0 has problems with XMLSerializer and the responseXML document
			///
            if (typeof n.xml == DATATYPES.TYPE_STRING) {
                return n.xml;
            }
            else if (typeof XMLSerializer != DATATYPES.TYPE_UNDEFINED) {
                return (new XMLSerializer()).serializeToString(n);
            }

        },

        /// <method>
        /// <name>getCDATAValue</name>
        /// <description>Returns a concatenation of all CDATA values that are immediate children of the specified node.</description>
        /// <param name="n" type="DOMNode">XML DOM Node.</param>
        /// <return-value name="v" type="String">Returns a concatenation of all child CDATA values.</return-value>
        /// </method>
        ///	
        getCDATAValue: function (n) {
            var c, d = "", i = 0, e;
            if (n == null) return d;
            c = n.childNodes;
            for (; i < c.length; i++) {
                e = c[i];
                if (e.nodeName == "#cdata-section") d += e.nodeValue;
            }
            return d;
        },

        /// <method>
        /// <name>getInnerText</name>
        /// <description>Returns a concatenation of text nodes belonging to all children of the specified node.</description>
        /// <param name="n" type="DOMNode">DOM Node.</param>
        /// <param name="b" type="boolean">Bit indicating to only return the first text value.</param>
        /// <return-value name="sTxt" type="String">Returns the inner text of the specified node.</return-value>
        /// </method>
        ///	
        getInnerText: function (s, b) {
            var r = "", a, i, e;
            if (typeof s == DATATYPES.TYPE_STRING) return s;
            if (s == null) return r;
            if (typeof s == DATATYPES.TYPE_OBJECT && s.nodeType == 3) return s.nodeValue;
            if (s.hasChildNodes()) {
                a = s.childNodes;
                for (i = 0; i < a.length; i++) {
                    e = a[i];
                    if (e.nodeType == 3 || e.nodeType == 4){
                        r += e.nodeValue;
                    }
                    if(b && r.length) break;
                    if (e.nodeType == 1 && e.hasChildNodes()) {
                        r += HemiEngine.xml.getInnerText(e);
                    }
                }
            }
            return r;
        },

        /// <method>
        /// <name>removeChild</name>
        /// <description>Removes the child node of the specified node.</description>
        /// <param name="o" type="DOMNode">DOM Node.</param>
        /// <param name="p" type="DOMNode">Parent DOM Node.</param>
        /// <param name="b" type="boolean">Bit indicating to send a termination signal to any backing objects if a Hemi reference identifier is found.</param>
        /// </method>
        ///
        removeChild : function(n, o, b){
        	var p;
        	if(!n || !o) return;
            if(b && n.nodeType == 1 && HemiEngine.IsAttributeSet(n,"hemi-id") && (p = HemiEngine.registry.service.getObject(n.getAttribute("hemi-id")))){
                HemiEngine.xml.removeChildren(n,b);
                HemiEngine.registry.service.sendDestroyTo(p);
                o.removeChild(n);
            }
            else o.removeChild(n);
        },
        
        /// <method>
        /// <name>removeChildren</name>
        /// <description>Removes all child nodes of the specified node.</description>
        /// <param name="o" type="DOMNode">DOM Node.</param>
        /// <param name="b" type="boolean">Bit indicating to send a termination signal to any backing objects if a Hemi reference identifier is found.</param>
        /// </method>
        ///
        removeChildren: function (o, b) {
            if(!o) return;
            var i,a=o.childNodes,n,p;
            for (i = a.length - 1; i >= 0; i--){
                n = a[i];
                HemiEngine.xml.removeChild(n,o,b);
            }

        },

        /// <method>
        /// <name>swapNode</name>
        /// <description>Replaces the specified node.</description>
        /// <param name="r" type="DOMNode">DOM Node to replace.</param>
        /// <param name="n" type="DOMNode">New DOM Node.</param>
        /// </method>
        ///
        swapNode: function (n, c) {
            if (!n || !c) return;
            if (typeof n.swapNode != DATATYPES.TYPE_UNDEFINED) n.swapNode(c);
            else {
                /*
                var s = n.nextSibling;
                var p = n.parentNode;
                p.replaceChild(n,c);
                p.insertBefore(c, s);
                */
                n.parentNode.insertBefore(c, n);
                n.parentNode.removeChild(n);
                /*
                var p = n.parentNode;
                p.insertBefore(n, c);
                p.removeChild(c);
                */
            }
        },

        /// <method>
        /// <name>setInnerXHTML</name>
        /// <description>Copies the child nodes of the specified source node into the specified target node.</description>
        /// <param name="t" type="DOMNode">DOM Node into which the source node children will be copied.</param>
        /// <param name="s" type="DOMNode">DOM Node from which nodes will be copied into the target node.</param>
        /// <param name="p" type="boolean" optional="1" default = "false">Bit indicating whether to keep the children of the target node, or to remove them before copying in the new contents.</param>
        /// <param name="d" type="Document" optional="1" default = "window.document">Document object to use when creating elements for the target node.</param>
        /// <param name="z" type="boolean" optional = "1" default = "false">Bit indicating whether recursion should be blocked.</param>
        /// <param name="c" type="boolean" optional = "1" default = "false">Bit indicating whether whitespace should be preserved.</param>
        /// <param name="h" type="boolean" optional = "1" default = "false">Bit indicating whether HTML source nodes should be cloned instead of incrementally recreated.</param>
        /// <param name="ch" type="function" optional = "1" default = "false">Optional callback handler for substituting values prior to copying.  Useful for templates.</param>
        /// <return-value name="v" type="variant">Depending on the type of copy operation, returns a reference to the newly created node.</return-value>
        /// </method>
        ///

        setInnerXHTML: function (t, s, p, d, z, c, h, ch) {

            var y, e, a, l, x, n, v, r = 0, b, f;


            if (!d) d = document;

            b = (d == document ? 1 : 0);

            if (!p)
                HemiEngine.xml.removeChildren(t);

            y = (s && typeof s == DATATYPES.TYPE_OBJECT) ? s.nodeType : (typeof s == DATATYPES.TYPE_STRING) ? 33 : -1;

            try {

                switch (y) {
                    case 1:
                        if (h) {
                            e = s.cloneNode(false);
                        }
                        else {
                            f = s.nodeName;
                            if (typeof ch == DATATYPES.TYPE_FUNCTION) f = ch(y, f);
                            if (!f) return 0;
                            e = d.createElement(f);
                            a = s.attributes;
                            l = a.length;
                            for (x = 0; x < l; x++) {
                                n = a[x].nodeName;
                                v = a[x].nodeValue;
                                if (typeof ch == DATATYPES.TYPE_FUNCTION) {
                                    n = ch(2, n);
                                    v = ch(2, v);
                                }



                                if (b && n == "style") {
                                    e.style.cssText = v;
                                }

                                else if (b && n == "id") {
                                    e.id = v;
                                }



                                else if (b && n == "class") {
                                    e.className = v;
                                }


                                else if (b && n.match(/^on/i)) {
                                    eval("e." + n + "=function(){" + v + "}");
                                }
                                else {
                                    e.setAttribute(n, v);
                                }
                            }
                        }
                        if (!z && s.hasChildNodes()) {
                            a = s.childNodes;
                            l = a.length;
                            for (x = 0; x < l; x++)
                                HemiEngine.xml.setInnerXHTML(e, a[x], 1, d, z, c, h, ch);

                        }

                        if (b && s.nodeName.match(/input/i) && HemiEngine.IsAttributeSet(s,"checked")) {
                            e.checked = true;
                        }
                        t.appendChild(e);
                        r = e;
                        break;
                    case 3:
                        e = s.nodeValue;
                        if (typeof ch == DATATYPES.TYPE_FUNCTION) e = ch(y, e);
                        if (e) {
                            e = e.replace(/\s+/g, " ");
                            t.appendChild(d.createTextNode(e));
                            r = e;
                        }
                        break;

                    case 4:
                        e = s.nodeValue;
                        if (typeof ch == DATATYPES.TYPE_FUNCTION) e = ch(y, e);
                        t.appendChild(d.createCDATASection(e));
                        break;
                    case 8:

                        break;
                    case 33:
                        e = s;
                        if (typeof ch == DATATYPES.TYPE_FUNCTION) e = ch(y, e);
                        if (e) {
                            if (!c) {
                                e = e.replace(/^\s*/, "");
                                e = e.replace(/\s*$/, "");
                                e = e.replace(/\s+/g, " ");
                            }
                            t.appendChild(d.createTextNode(e));
                            r = e;
                        }
                        break;
                    default:

                        break;
                }

            }
            catch (e) {
                HemiEngine.message.service.sendMessage((e.message ? e.message : e.description) + " in type " + y + " : " + HemiEngine.error.traceRoute(HemiEngine.xml.setInnerXHTML), "200.4");
            }

            return r;
        },


        _stub: function () {

        },

        StaticInitialize: function () {
            HemiEngine.message.service.subscribe(HemiEngine.xml, "destroy", "_handle_destroy");
            HemiEngine.xml.si = 1;
        },

        _handle_destroy: function (s, v) {

            var _x = HemiEngine.xml;

            HemiEngine.message.service.unsubscribe(HemiEngine.xml, "destroy", "_handle_destroy");

            _x.clearCache();





            _x._xml_requests = [];
            _xml_requests_map = [];
            _x._xml_http_pool_created = 0;
            _x._xml_http_object_use = 0;
            _x._xml_http_objects = [];
        },

        /// <method internal = "1">
        /// <name>JSONReviver</name>
        /// <description>Custom reviver for handling date values.</description>
        /// <param name="k" type="String">Key name.</param>
        /// <param name="v" type="String">Key value.</param>
        /// <return-value name="r" type="String">Revived key value for use with JSON.</return-value>
        /// </method>
        ///
        JSONReviver: function (k, v) {
            var a;
            if (typeof v == "string" && (a = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(v)))
                return new Date(Date.UTC(+a[1], +a[2] - 1, +a[3], +a[4], +a[5], +a[6]));
            if(typeof v == "number" && k.match(/(date|time)/gi))
            	return new Date(v);
            
            return v;
        }
    });

    HemiEngine.namespace("error", HemiEngine, {
		traceDepth:20,
        traceRoute: function (v) {

            var r = "", a = [], i = 0, n, q, g, t, l,d=0;
            if (v != null) {
                while (v && v != null && d < HemiEngine.error.traceDepth) {
                    n = HemiEngine.error.G(v.toString());
                    if (n == null) {
                        v = null;
                        break;
                    }
                    n += "(";
                    g = v.arguments;
                    for (i = 0; g && i < g.length; i++) {
                        if (i > 0) n += ", ";
                        q = "";

                        t = typeof g[i];
                        l = v;
                        if (t == DATATYPES.TYPE_STRING) {
                            q = "\"";
                            if (l.length > 25) l = l.substring(0, 22) + "...";
                        }
                        else if (t == DATATYPES.TYPE_OBJECT) l = "obj";
                        else if (t == DATATYPES.TYPE_FUNCTION) l = "func";

                        n += q + (t == DATATYPES.TYPE_OBJECT ? "obj" : l) + q + " {as " + t + "}";
                    }
                    n += ")";
					/// if(v == v.caller) break;
                    v = v.caller;
					d++;
                }
                r = a.reverse().join("->");
            }
            else {
                r = "null";
            }
            return r;

        },

        G: function (s) {

            var a = s.match(/function\s([A-Za-z0-9_]*)\(/gi), r = null;
            if (s == r) return r;

            if (a != null && a.length) {
                s = a[0];
                s = s.replace(/^function\s+/, "");
                s = s.replace(/^\s*/, "");
                s = s.replace(/\s*$/, "");
                s = s.replace(/\($/, "");
                return s;
            }
            return r;
        }
    });
    ///	</static-class>


    if (!window.Hemi) window.Hemi = HemiEngine;
})();
if(typeof window.Hemi == "object" && typeof Hemi != "object") Hemi = window.Hemi;


/// </package>
/// </source>