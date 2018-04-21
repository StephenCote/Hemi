/// <source>
/// <name>Hemi.json.rpc</name>
/// <project>
/// 	<name>Hemi JavaScript Framework</name>
/// 	<url-title>Hemi JavaScript Framework Project</url-title>
/// 	<url>/Hemi/</url>
/// </project>
///
/// <package>
///	<path>Hemi.json.rpc</path>
///	<library>Hemi</library>
///	<description>The JSON RPC Service is used to register and generate JSON RPC clients.</description>
/// <static-class>
///		<name>service</name>
///		<description>Static instance of serviceImpl.</description>
///		<version>%FILE_VERSION%</version>
/// </static-class>
/// <class>
///		<name>JSONRPCServiceImpl</name>
///		<description>A service for managing JSON RPC end points.</description>
///		<version>%FILE_VERSION%</version>

/*

t.invokeMethod(0,"postMessage",[JSON.stringify({name:"1",data:"1",id:"1"})])
t.invokeMethod(0,"postMessage",[{in_message:{"name":"1","id":"1","data":"1"}}])

*/
(function () {

	HemiEngine.include("hemi.object");
	HemiEngine.include("hemi.util.logger");
	HemiEngine.include("hemi.json.rpc.cache");

	HemiEngine.namespace("json.rpc", HemiEngine, {
		service: null,

		serviceImpl: function () {
			var t = this;
			HemiEngine.prepareObject("jsonrpc_service", "%FILE_VERSION%", 1, t, 1);
			HemiEngine.util.logger.addLogger(t, "JSON RPC Service", "JSON RPC Service", "667");
			
			t.objects = {
				services : [],
				service_map : [],
				schema : {}
			};
			
			t.properties.schemaToWindow = 1;
			t.getSchemaRoot = function(){
				return (t.properties.schemaToWindow ? window : t.objects.schema);
			};
			t.getServices = function(){
				return t.objects.services;
			};
			t.getService = function(v, b){
				if(typeof v == DATATYPES.TYPE_STRING) v = t.objects.service_map[v];
				if(typeof v != DATATYPES.TYPE_NUMBER || !t.objects.services[v]) return 0;
				if(b && !t.objects.services[v].loaded) t.loadService(t.objects.services[v]);
				return t.objects.services[v];
			};
			t.serviceCallConfig = function(f, a, i, c){
				return {hemiSvcCfg:true,id:i,cache:(c?true:false),async:(a?true:false),handler:(typeof f==DATATYPES.TYPE_FUNCTION?f:0)};
			};
			t.loadService = function(v, x){
				var hls = HemiEngine.json.rpc.service.handleLoadService, vObj=v;
				if(typeof v != DATATYPES.TYPE_OBJECT) v = t.getService(v);
				if(!v || v.loaded) return 0;
				
				/*
				if(x && (typeof x == DATATYPES.TYPE_OBJECT)) hls(x,vObj);
				else HemiEngine.xml.getJSON(v.uri,function(s,v){if(v && v != null) hls(v,vObj); else alert("Unable to load service: " + v.uri);},1);
				*/
				/// NOTE: Synchronous call
				///
				
				var oS = (x && (typeof x == DATATYPES.TYPE_OBJECT) ? x : HemiEngine.xml.getJSON(v.uri));
				if(typeof oS != DATATYPES.TYPE_OBJECT || oS == null){
					alert("Unable to load service: " + v.uri + ":" + (typeof oS));
					return null;
				}
				v.schema = oS;
				v.loaded = 1;
				
				for(var i = 0; i < oS.methods.length; i++){
					var sMName = oS.methods[i].name;
					var sSUrl = oS.serviceURL;
					v[sMName] = buildMethod(v, sMName, sSUrl,oS.methods[i].httpMethod,oS.methods[i].returnValue);
				}
				
				
				return 1;
			};
			t.handleLoadService = function(oS, v){
				if(typeof oS != DATATYPES.TYPE_OBJECT || oS == null){
					alert("Unable to load service: " + v.uri + ":" + (typeof oS));
					return null;
				}
				v.schema = oS;
				v.loaded = 1;
				
				for(var i = 0; i < oS.methods.length; i++){
					var sMName = oS.methods[i].name;
					var sSUrl = oS.serviceURL;
					v[sMName] = buildMethod(v, sMName, sSUrl,oS.methods[i].httpMethod,oS.methods[i].returnValue);
				}

			};
			/*
			t.invokeMethod = function(v, m, p, fH){
				var oSvc = t.getService(v,1);
				var oReq = NewJSONRPCRequest(m, p);
				return uwm.postJSON(oSvc.schema.serviceURL, oReq, fH);
			};
			*/
			t.loadJSONSchema = function(v, j){
				var oSvc = (typeof v == DATATYPES.TYPE_OBJECT ? v : t.getService(v,1));
				if(!oSvc.getJSONSchema && !oSvc.entity){
					return 0;
				}
				if(!oSvc.jsonSchema){
					oSvc.jsonSchema = (j && (typeof j == DATATYPES.TYPE_OBJECT) ? (j.result ? j.result : j) : (oSvc.schema.serviceType.match(/^json-rest$/i) ? oSvc.entity() : oSvc.getJSONSchema().result));
					t.emitJSONSchema(oSvc.jsonSchema);
				}
			};
			
			t.addService = function(n, u, v, j, c){
				if(t.objects.service_map[n]) return 0;
				var l = t.objects.services.length;
				t.objects.service_map[n] = l;
				t.objects.services[l] = {
					name:n,
					cached : c,
					uri:u,
					loaded:0,
					schema:0,
					api : {}
				};
				
				if(v) {
					t.loadService(t.objects.services[l],v);
					if(j) t.loadJSONSchema(t.objects.services[l],j);
				}
			};
			t.emitJSONSchema = function(v){
				if(v.defaultPackage) sDef = v.defaultPackage;
				for(var i in v){
					if(typeof v[i] != DATATYPES.TYPE_OBJECT) continue;
					var o = (t.properties.schemaToWindow ? window : t.objects.schema);
					var sP = v[i].javaClass;
					if(!sP && v.defaultPackage) sP = v.defaultPackage + ".Def";
					var sPP = "";
					if(sP && sP.indexOf(".") > - 1){
						sPP = sP.substring(0,sP.lastIndexOf("."));
						o = HemiEngine.namespace(sPP, o);
					}
					var sN = i.replace(/schema$/gi,""); 
					o[sN] = function(){
						/// JSON Bug?  javaClass is 'cleared' in stringify if not set as a first-class property.
						/// Note: javaClass works when the service doesn't know the base class
						/// But, all the properties must be set BEFORE javaClass for certain parsers such as Jackson
						/// It's probably a parser bug, but this should be optional based on the service provider
						///
						///this.javaClass = this.javaClass;
					};
					/// alert('emit:' + sPP + "::" + sN)
					var udef;
					for(var p in v[i]){
						/// if(p.match(/^javaclass$/gi)) continue;
						o[sN].prototype[p] = udef; 
					}
					/// o[sN].prototype.javaClass = sP; 
					
				}
			};
		}
			
	}, 1);
	
	/// LOCAL CONFIG
	function buildMethod(oSvc, sName, sUrl, sHttpMethod, vReturn){
		
		var x;
		if(oSvc.schema.serviceType.match(/^json-rest$/i)){
			var f = function(){
				/// fn = "post"; 
				var o,v = sHttpMethod,a = [],d,i=0,ufg,fH,g = arguments,l = arguments.length,sc = HemiEngine.json.rpc.cache.service;
				
				/// Check if the last argument is the hemiSvcCfg object
				///
				if(l > 0){
					if(typeof g[0] == DATATYPES.TYPE_OBJECT && !g[0].hemiSvcCfg){
						d = g[0];
					}
					if(typeof g[l - 1] == DATATYPES.TYPE_OBJECT && g[l - 1].hemiSvcCfg){
						ufg = g[l - 1];
						fH = ufg.handler;
						l--;
					}
					/// Handle case where no a client accepts a config parameter, but passes in undefined
					/// Then trim off that undefined value from the method call
					///
					else if(l > 0 && typeof g[l - 1] == DATATYPES.TYPE_UNDEFINED){
						l--;
					}
				}
				if(!ufg) ufg=HemiEngine.json.rpc.service.serviceCallConfig();
				
				if(!v){
					v = "GET";
					HemiEngine.logError("Method not specified for " + sName + ". Defaulting to GET.")
				}
				if(v.match(/^get$/i)){
					for(;i<l;){
						a.push("/" + arguments[i++]);
					
					}
					var sK = f.mname + a.join("");
					if(f.cached && sc.isCached(f.serviceName,sK)){
						o = sc.readByName(f.serviceName, sK);
					}
					else{
						o = HemiEngine.xml["get" + (vReturn && vReturn.type && vReturn.type.match(/String$/) ? "Text" : "JSON")](f.url + "/" + sK, fH, ufg.async, ufg.id, ufg.cache);
						
						/// TODO: Note, the cache mechanism is currently not supported for async requests
						///
						if(f.cached && typeof o == DATATYPES.TYPE_OBJECT && o!=null && !ufg.async){
							sc.addToCache(f.serviceName,o,sK);
						}
						else{
							Hemi.logDebug("Do not cache " + f.serviceName + " " + sK);
						}
					}
				}
				else{
					o = HemiEngine.xml.postJSON(f.url + "/" + f.mname, d, fH, ufg.async, ufg.id, ufg.cache);
					if(f.cached){
						/*
						if(f.mname.match(/^update/gi) && o){
							uwmServiceCache.updateToCache(f.serviceName,d);
						}
						else if((f.mname.match(/^delete/gi) || f.mname.match(/^add/gi)) && o){
						*/
							/// uwmServiceCache.removeFromCache(f.serviceName,d);
							uwmServiceCache.clearServiceCache(f.serviceName);
						///}
					}
				}
				/// sink the parse error
				///
				if(o && o.parseError) o = null;
				return o;
			};
			x = f;
		}
		/// otherwise, assume json-rpc
		else{
			var f = function(p,fH){
				var oReq = NewJSONRPCRequest(f.mname, p);
				return HemiEngine.xml.postJSON(f.url, oReq, fH);
			};
			x = f;
		}
		x.serviceName = oSvc.name;
		x.mname = sName;
		x.url = sUrl;
		x.cached = oSvc.cached;
		return x;
	}
	
	function NewJSONRPCRequest(m, p){
		if(typeof p == "undefined") p = [];
		return {
			jsonrpc:"2.0",
			id:uwm.guid(),
			method: m,
			params: p
		};
	}
	
} ());

/// </class>
/// </package>
/// </source>
