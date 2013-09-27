/// <source>
/// <name>Hemi.data.stack</name>
/// <project>
/// 	<name>Hemi JavaScript Framework</name>
/// 	<url-title>Hemi JavaScript Framework</url-title>
/// 	<url>/Hemi/</url>
/// </project>
///
/// <package>
///		<path>Hemi.data.stack</path>
///		<library>Hemi</library>
///		<description>The Data Stack is a class for storing and retrieving values that may or may not have unique identifiers, and which don't qualify for or need to be stored in the Hemi.registry service.</description>
/// <static-class>
///		<name>service</name>
///		<description>Static instance of TokenStackImpl.</description>
/// </static-class>
/// <class>
///		<name>serviceImpl</name>
///		<description>A class for storing stacks of variant values and filtering the stack by owner.</description>
///		<object internal="1">
///			<name>Token</name>
///			<description>Internal object used to store the references that comprise a token.</description>
///			<property name = "owner_id" type = "String">The id of the Token owner.</property>
///			<property name = "index" type = "int">The index of the Token in the local stack.</property>
///			<property name=  "token_name" type = "String">The specified name of the token.</property>
///			<property name = "token_value" type = "variant">The specified value of the token.</property>
///		</object>

/*
	Author: Stephen W. Cote
	Email: wranlon@hotmail.com
	
	Copyright 2002, All Rights Reserved.
	
	Do not copy, archive, or distribute without prior written consent of the author.
*/

(function(){
	HemiEngine.namespace("data.stack", HemiEngine, {
		service:null,
		serviceImpl:function(){
			var t=this;

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

			t.properties = {
				/* enable_overstack */
				e:0
			};
			t.objects = {
				t:[],
				tn:[]
			};
			
	///		<property private = "1" get = "1" set = "1">
	///			<name>enable_overstack</name>
	///			<description>Allows Token objects to be overstacked, meaning that names do not have to be unique.  Defaults to false.</description>
	/// 		</property>

	///		<method>
	///			<name>add</name>
	///			<description>Adds a token with the specified name and value for the specified owner.</description>
	///			<param name = "o" type = "object">Registered object that will own the token.</param>
	///			<param name = "n" type = "String">Name of the token.</param>
	///			<param name = "v" type = "variant">Value of the token.</param>
	///			<param name = "b" type = "boolean" optional = "1">Bit indicating whether a token with the same name for the same owner should be overwritten with the new value if it exists.  If overstacking is enabled, the new value would be added without overwriting.</param>
	///			<return-value name = "r" type = "boolean">Bit indicating whether the token was added.</return-value>
	///		</method>
			t.add = function(o, n, v, b){
				/*
					o = object owner; used to prevent overstacking
					n = some name
					v = some value
					b = overwrite token
				*/
				
				var _p = t.objects,
					_r = HemiEngine.registry.service,
					_m = HemiEngine.message.service,
					l,
					nl
				;
				if(!_r.isRegistered(o)) return 0;
				
				if(!DATATYPES.TS(n)) return 0;
				l = _p.t.length;
				
				if(!t.properties.e && t.checkOverstack(o, n)){
					if(!b){
						_m.sendMessage("Overstacked " + n + " for " + o.object_id,"200.4");
						return 0;
					}

					/* otherwise, remove the existing token for the specified owner */
					t.remove(o,n);
				}
				
				if(DATATYPES.TU(_p.tn[n])) _p.tn[n] = [];
				nl = _p.tn[n].length;
				_p.tn[n][nl] = l;
				_p.t[l] = {owner_id:o.object_id,index:l,token_name:n,token_value:v};

				return 1;

			};

	///		<method>
	///			<name>getAll</name>
	///			<description>Returns an array of tokens that match the specified name.</description>
	///			<param name = "n" type = "String">Name of the token.</param>
	///			<return-value name = "a" type = "array">Array of tokens that match the specified name.</return-value>
	///		</method>
			t.getAll = function(n){
				var _p = t.objects;
				if(!DATATYPES.TO(_p.tn[n])) return [];
				return _p.tn[n];
			};
			
	///		<method>
	///			<name>getTokenValue</name>
	///			<description>Returns the value of the specified token.</description>
	///			<param name = "n" type = "String">Name of the token.</param>
	///			<param name = "i" type = "int" optional="1" default = "0">Index of the array for this token name to use to retrieve the value.</param>
	///			<return-value name = "r" type = "variant">The value of the specified token.</return-value>
	///		</method>
			t.getValue = function(n, z){
				var v = t.get(n,z);
				return (v ? v.token_value : 0);
			};

	///		<method>
	///			<name>get</name>
	///			<description>Returns the specified token.</description>
	///			<param name = "n" type = "String">Name of the token.</param>
	///			<param name = "i" type = "int" optional="1" default = "0">Index of the array for this token name to use to retrieve the value.</param>
	///			<return-value name = "r" type = "Token">The specified token object.</return-value>
	///		</method>
			t.get = function(n,z){
				/*
					n = token name
					z = start index
				*/
				var _p = t.objects, a, v;
				if(!DATATYPES.TO(_p.tn[n])) return 0;
				a = _p.tn[n];
				if(!DATATYPES.TN(z)) z = 0;
				if(z < 0 || z >= a.length) return 0;

				for(;z < a.length; z++){
					if(DATATYPES.TN(a[z]) && a[z] >= 0)
						return _p.t[a[z]];

				}

				return 0;
				
			};

	///		<method>
	///			<name>getByOwner</name>
	///			<description>Returns the specified token.</description>
	///			<param name = "o" type = "object" >A registered object that owns a token with the specified name.</param>
	///			<param name = "n" type = "String">Name of the token.</param>
	///			<return-value name = "r" type = "Token">The specified token object belonging to the specified owner.</return-value>
	///		</method>
			t.getValueByOwner = function(o, n){
				var o = t.getByOwner(o, n);
				if(!o) return 0;
				return o.token_value;
			};
			t.getByOwner = function(o, n){
				var _p = t.objects,
					a,
					i = 0,
					z,
					y,
					_r = HemiEngine.registry.service
				;
				if(!_r.isRegistered(o)) return 0;
				if(!DATATYPES.TO(_p.tn[n])) return 0;
				a = _p.tn[n];
				for(; i < a.length;i++){
					z = a[i];
					if(!DATATYPES.TN(z) || z < 0 || z > _p.t.length  || DATATYPES.TU(_p.t[z])){
						HemiEngine.message.service.sendMessage("Invalid reference for " + n + " with " + o.object_id + " at " + i,"200.4");
						continue;
					}
					y = _p.t[z];
					if(y.owner_id == o.object_id) return y;
				}
				return 0;

			};

	///		<method>
	///			<name>getAllByOwner</name>
	///			<description>Returns all tokens for the specified owner.</description>
	///			<param name = "o" type = "object" >A registered object that owns one or more tokens.</param>
	///			<return-value name = "r" type = "array">Array of tokens belonging to the specified owner.</return-value>
	///		</method>
			t.getAllByOwner = function(o){
				var _p = t.objects,
					a,
					i = 0,
					z,
					y,
					r = [],
					_r = HemiEngine.registry.service,
					_m = HemiEngine.message.service
				;
				if(!_r.isRegistered(o)){
					_m.sendMessage("Unregistered object","200.4");
					return r;
				}
				for(;i < _p.t.length;i++){
					if(!DATATYPES.TO(_p.t[i]))
						continue;

					y = _p.t[i];
					if(y.owner_id == o.object_id)
						r[r.length] = y;

				}
				
				return r;
				
			};
			
	///		<method>
	///			<name>clear</name>
	///			<description>Removes all tokens for the specified owner.</description>
	///			<param name = "o" type = "object" >A registered object that owns one or more tokens.</param>
	///		</method>
			t.clear = function(o){
				var a = t.getAllByOwner(o), i = 0;
				for(;i < a.length;i++){
					this.remove(o,a[i].token_name);
				}
			};

	///		<method>
	///			<name>remove</name>
	///			<description>Removes all tokens for the specified owner.</description>
	///			<param name = "o" type = "object" >A registered object that owns one or more tokens.</param>
	///			<param name = "n" type = "String" >The name of a token.</param>
	///		</method>	
			t.remove = function(o, n){
				var a,i=0,_p = t.objects,ti,_r = HemiEngine.registry.service;
				if(!_r.isRegistered(o)){
					HemiEngine.message.service.sendMessage("Owner object is not registered","200.4");
					return 0;
				}
				if(!DATATYPES.TO(_p.tn[n])){
					a = [];
					HemiEngine.message.service.sendMessage("Token Reference does not exist in remove for " + n,"200.1");
				}
				else{
					a = _p.tn[n];
				}
				for(;i < a.length;i++){
					z = a[i];
					if(!DATATYPES.TN(z) || z < 0 || z > _p.t.length || !DATATYPES.TO(_p.t[z])){
						continue;
					}
					y = _p.t[z];
					if(y.owner_id == o.object_id){
						ti = y.index;
						_p.tn[n][i] = -1;
						break;
					}
				}
				if(DATATYPES.TO(_p.t[ti])) _p.t[ti] = 0;

			};
			
			t.checkOverstack = function(o, n){
				return (DATATYPES.TO(this.getByOwner(o, n)) ? 1 : 0);
			};

			HemiEngine._implements(t,"base_object","token_ring","%FILE_VERSION%");
			HemiEngine.registry.service.addObject(t);
		}
	}, 1);
}());

/// </class>
/// </package>
/// </source>
