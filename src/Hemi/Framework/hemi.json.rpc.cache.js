/// <source>
/// <name>Hemi.json.rpc.cache</name>
/// <project>
/// 	<name>Hemi JavaScript Framework</name>
/// 	<url-title>Hemi JavaScript Framework Project</url-title>
/// 	<url>/Hemi/</url>
/// </project>
///
/// <package>
///	<path>Hemi.json.rpc.cache</path>
///	<library>Hemi</library>
///	<description>The JSON RPC Cache Service manages caching for JSON RPC clients.</description>
/// <static-class>
///		<name>service</name>
///		<description>Static instance of serviceImpl.</description>
///		<version>%FILE_VERSION%</version>
/// </static-class>
/// <class>
///		<name>JSONRPCCacheServiceImpl</name>
///		<description>A service for managing JSON RPC client caches.</description>
///		<version>%FILE_VERSION%</version>

(function () {
	HemiEngine.namespace("json.rpc.cache", HemiEngine, {
		dependencies : ["hemi.object","hemi.util.logger","hemi.transaction"],
		service: null,

		serviceImpl: function () {
			var t = this;
			HemiEngine.prepareObject("jsonrpc_service_cache", "%FILE_VERSION%", 1, t, 1);
			HemiEngine.util.logger.addLogger(t, "JSON RPC Service Cache", "JSON RPC Service Cache", "668");
			
			t.objects.cache = {};
			
			t.setCacheKeyResolver = function(f){
				t.objects.cacheKeyResolver = f;
			};
			t.canCache = function(o){
				if(typeof o == DATATYPES.TYPE_OBJECT && typeof o.id == DATATYPES.TYPE_NUMBER && typeof o.name == DATATYPES.TYPE_STRING) return 1;
				else if(o instanceof Array) return 1;
				return 0;
			};
			t.defaulteCacheKeyResolver = function(o){
				if(!o || o instanceof Array) return;
				return (o.name + (o.parentId ? "-" + o.parentId : (o.group ? "-" + o.group.id : "")));
			};
			t.getCacheKey = function(o){
				if(!t.objects.cacheKeyResolver) return;
				return t.objects.cacheKeyResolver(o);
			};
			
			t.isCached = function(sSvc,sKey){
				var c = t.objects.cache[sSvc];
				return (c && (typeof c.names[sKey] == DATATYPES.TYPE_NUMBER || typeof c.ids[sKey] == DATATYPES.TYPE_NUMBER || typeof c.altNames[sKey]==DATATYPES.TYPE_NUMBER));
			};
			
			t.readByName = function(sSvc, sName, vParent){
				var sKey = sName + (vParent ? "-" + vParent : ""),uObj;
				var c = t;
				if(!c.objects.cache[sSvc]) return uObj;
				if(typeof c.objects.cache[sSvc].names[sKey] == DATATYPES.TYPE_NUMBER){
					t.logDebug("Retrieve cached " + sSvc + " object by name " + sKey);
					return c.objects.cache[sSvc].stack[c.objects.cache[sSvc].names[sKey]];
				}
				else if(typeof c.objects.cache[sSvc].altNames[sKey] == DATATYPES.TYPE_NUMBER){
					t.logDebug("Retrieve cached " + sSvc + " object by alternate name " + sKey);
					return c.objects.cache[sSvc].stack[c.objects.cache[sSvc].altNames[sKey]];
				}
				return uObj;
			};
			t.readById = function(sSvc, iId){
				var c = t, uObj;
				if(c.objects.cache[sSvc] && typeof c.objects.cache[sSvc].ids[iId] == DATATYPES.TYPE_NUMBER){
					t.logDebug("Retrieve cached " + sSvc + " object by id " + iId);
					return c.objects.cache[sSvc].stack[c.objects.cache[sSvc].ids[iId]];
				}
				return uObj;
			};
			t.updateToCache = function(sSvc, o){
				var c = t;
				if(!c.canCache(o)) return 0;
				t.logDebug("Update to " + sSvc + " cache " + o.name + " #" + o.id);
				if(c.isCached(sSvc,o)) c.removeFromCache(sSvc,o);
				return c.addToCache(sSvc,o);
			};
			t.addToCache = function(sSvc, o, sAltKey){
				var c = t, iIdx,uObj,x;
				if(!c.canCache(o)) return 0;
				if(!c.objects.cache[sSvc]){
					c.objects.cache[sSvc] = {
						stack : [],
						ids : {},
						names : {},
						altNames : {}
					};
				}
				x = c.objects.cache[sSvc];
				if(x.ids[o.id]){
					/// If the object was looked up via an alternate name,
					/// such as a directory by its path rather than name/parent
					/// then cache against the alternate name
					///
					if(sKey && !x.names[sKey] && !x.altNames[sKey]){
						x.altNames[sKey] = x.ids[o.id];
					}
					/// id is already cached
					/// todo: support multiple name lookups, such as by path
					return 0;
				}
				iIdx = x.stack.length;
				sKey = c.getCacheKey(o);
				x.stack[iIdx] = o;
				if(sKey) x.names[sKey] = iIdx;
				if(sAltKey && sAltKey != o.name && sAltKey != sKey) x.altNames[sAltKey] = iIdx;
				x.ids[o.id] = iIdx;
				t.logDebug("Add " + sSvc + " object to cache as " + sKey + " #" + o.id + " at index " + iIdx);
				return 1;
			};
			t.clearCache = function(){
				t.logDebug("Clear all service caches");
				t.objects.cache = {};
			};
			t.clearServiceCache = function(sSvc){
				t.logDebug("Clear " + sSvc + " service cache");
				delete t.objects.cache[sSvc];
			};
			t.removeFromCache = function(sSvc, o){
				var c = t, iIdx,uObj;
				if(!c.canCache(o)) return 0;
				if(!c.objects.cache[sSvc]) return 0;

				iIdx = c.objects.cache[sSvc].ids[o.id];
				
				if(!iIdx) return 0;
				
				delete c.objects.cache[sSvc].stack[iIdx];
				
				for(var i in c.objects.cache[sSvc].names){
					if(c.objects.cache[sSvc].names[i] == iIdx){
						delete c.objects.cache[sSvc].names[i];
						break;
					}
				}
				for(var i in c.objects.cache[sSvc].altNames){
					if(c.objects.cache[sSvc].altNames[i] == iIdx){
						delete c.objects.cache[sSvc].altNames[i];
						break;
					}
				}

				delete c.objects.cache[sSvc].ids[o.id];
				t.logDebug("Removed cached " + sSvc + " object " + sKey + " #" + o.id + " at index " + iIdx);
				
			};
			t.setCacheKeyResolver(t.defaulteCacheKeyResolver);
			t.ready_state = 4;
		}
	}, 1);
} ());

/// </class>
/// </package>
/// </source>
