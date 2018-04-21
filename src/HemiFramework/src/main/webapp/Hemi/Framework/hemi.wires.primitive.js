/// <source>
/// <name>Hemi.wires.primitive</name>
/// <project>
/// 	<name>Hemi JavaScript Framework</name>
/// 	<url-title>Hemi JavaScript Framework</url-title>
/// 	<url>/Hemi/</url>
/// </project>
///
/// <package>
///		<path>Hemi.wires</path>
/// 	<library>Hemi</library>
///		<description>The primitive wire service is used to connect two disparate functions together.</description>
///		<static-class>
///			<name>service</name>
///			<version>%FILE_VERSION%</version>
///			<description>Static instance of PrimitiveWireImpl</description>
///		</static-class>
///		<class>
///			<name>serviceImpl</name>
///			<version>%FILE_VERSION%</version>
///			<description>A primitive wire connects two functions, where the first function acts as the instigator of an action, and the second function acts as the handler for the action.</description>
/// <example>
///		<description>Demonstrate how to wire two functions together with a primitive wire.</description>
///		<name>Wire two functions together</name>
///		<code><![CDATA[<script type = "text/javascript">]]></code>
///		<code><![CDATA[ ]]></code>
///		<code><![CDATA[function Init(){]]></code>
///		<code><![CDATA[var _p = Hemi.wires.primitive.PrimitiveWire,w,w2,co;]]></code>
///		<code><![CDATA[	/// Create a new custom object.]]></code>
///		<code><![CDATA[	///]]></code>
///		<code><![CDATA[	co = new CObj();]]></code>
///		<code><![CDATA[	/// Wire custom object to function test]]></code>
///		<code><![CDATA[	///]]></code>
///		<code><![CDATA[	w = _p.wire(co,"testC",0,"test1");]]></code>
///		<code><![CDATA[	]]></code>
///		<code><![CDATA[	/// Invoke wire #1 connecting custom object to function test2]]></code>
///		<code><![CDATA[	/// Sending "test data" as a parameter]]></code>
///		<code><![CDATA[	///]]></code>
///		<code><![CDATA[	_p.invoke(w,["test data"]);]]></code>
///		<code><![CDATA[}]]></code>
///		<code><![CDATA[function test(){]]></code>
///		<code><![CDATA[   alert('test: ' + arguments[0]);]]></code>
///		<code><![CDATA[}]]></code>

///		<code><![CDATA[function CObj(){]]></code>
///		<code><![CDATA[	this.id = "XX";]]></code>
///		<code><![CDATA[	this.testC = function(){]]></code>
///		<code><![CDATA[		alert("TestC = " + this.id + "\n" + arguments[0]);]]></code>
///		<code><![CDATA[		return 1;]]></code>
///		<code><![CDATA[	}]]></code>
///		<code><![CDATA[}]]></code>
///		<code><![CDATA[</script>]]></code>
///	</example>

/*
	Author: Stephen W. Cote
	Email: wranlon@hotmail.com
	
	Copyright 2002, All Rights Reserved.
	
	Do not copy, archive, or distribute without prior written consent of the author.
*/
(function(){
	HemiEngine.namespace("wires.primitive",HemiEngine,{
		service:null,
		serviceImpl:function(){
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
			/// <description>Object API structure for storing sub structures: objects and properties.</description>
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
			/// <return-value name = "o" type = "object">The properties substructure.</return-value>
			/// <description>Returns the properties sub structure.</description>
			/// </method>
			///
			/// <method>
			/// <name>getPointers</name>
			/// <return-value name = "o" type = "object">The objects substructure.</return-value>
			/// <description>Returns the objects sub structure.</description>
			/// </method>
			///

			var t = this;
			t.objects = {
				/* wires */
				w:[]
			};
			t.properties = {
				/* counter */
				c:0
			};
			
			/// <method>
			/// <name>getPrimitiveWires</name>
			/// <return-value name = "w" type = "Array">Array of primitive wire objects.</return-value>
			/// <description>Returns an array of primitive wires.</description>
			/// </method>
			t.getWires = function(){
				return this.objects.w;
			};
			
			/// <method>
			/// <name>sigterm</name>
			/// <description>Sends termination signal to destroy object.</description>
			/// </method>
			t.sigterm = function(){
				if(this.ready_state != 5){
					var _p = this.objects;
					_p.w = [];
					this.ready_state =5;
				}		
			};
			
			/// <method>
			/// <name>invoke</name>
			/// <param name = "i" type = "String">Identifier of the primitive wire to invoke.</param>
			/// <param name = "a" type = "array" optional = "1">Arguments to pass to the wired functions.</param>
			/// <param name = "b" type = "boolean" optional = "1" default = "false">Bit indicating the handler should be force-fired even if the action did not evaluate to true.</param>
			/// <param name = "z" type = "boolean" optional = "1" default = "false">Bit indicating the handler should be skipped.</param>
			/// <param name = "p" type = "boolean" optional = "1" default = "false">Bit indicating the wire should be preserved.</param>
			/// <param name = "m" type = "boolean" optional = "1" default = "false">Bit indicating the wire may be used more than once.</param>
			/// <return-value name = "r" type = "boolean">Returns true if the chain completed successfully, false if otherwise.</return-value>
			/// <description>Invokes a wire, causing the action-handler chain to be processed.</description>
			/// </method>
			t.invoke=function(i,args,b,z,p,o,m){
				/*
					 i = id

					 args = array of arguments to pass to the action and handler

					 b = force handle even if invoke doesn't return true
					 z = skip handler
					 p = preserve data
					 o = handler only
					 m = multi-purposed; don't flag usage;
					 
					 
					 r = return value from action; returned for z
					 
				*/
				var h,a,d,r=0;
				h = t.objects.w[i];

				if(!DATATYPES.TO(args)) args = [];


				if(DATATYPES.TO(h)){

					a = (DATATYPES.TO(h.ap) && DATATYPES.TS(h.a))?1:0;
	/*
					h.ap.testC();
					h.ap[h.a]();
		v = _js._forName.apply(this.caller,n_a);
	*/
					if(
						(
							o
							||
							(!h.i && (r = ( a ? h.ap[h.a].apply(h.ap,args) : h.a.apply(window,args) )) )
						)
						||
						b
					){
						if(!m) h.i = 1;
						if(z) return r;

						a = (DATATYPES.TO(h.hp) && DATATYPES.TS(h.h))?1:0;
						if(!h.r){
							
							if(a){
								if(DATATYPES.TF(h.hp[h.h])) h.hp[h.h].apply(h.hp,args);
							}
							else{
								if(DATATYPES.TF(h.h)) h.h.apply(window,args);
							}
							if(!m) h.r=1;

							/*
								unless specified, nuke the data after use
								WireService may want to keep it around
							*/
							if(!p) t.objects.w[i] = 0;
							return r;
						}
					}
				}
				else{
					alert("hemi.wires.primitive::invoke Error = Invalid wire reference with " + i);
				}
				return 0;
			};

			/// <method internal = "1">
			/// <name>getWire</name>
			/// <param name = "i" type = "String">Identifier of the primitive wire.</param>
			/// <return-value name = "r" type = "object">Returns a wire object.</return-value>
			/// <description>Returns the wire object based on the specified Identifier.</description>
			/// </method>
			t.getWire=function(i){
				var h = t.objects.w[i];
				if(DATATYPES.TO(h)){
					return h;
				}
				return 0;
			};
			/// <method>
			/// <name>fireWire</name>
			/// <param name = "i" type = "String">Identifier of the primitive wire.</param>
			/// <description>Causes the specified wire to be invoked.</description>
			/// </method>
			t.fireWire=function(i){
				var h = t.objects.w[i];
				if(DATATYPES.TO(h)){
					/* set the invocation flag */
					h.i=1;
					t.invoke(i,0,1);
				}
			};
			
			
			/// <method>
			/// <name>wire</name>
			/// <param name = "xp" type = "variant">Object, or string evaluation, to which the action function is defined.</param>
			/// <param name = "x" type = "function">The action function.</param>
			/// <param name = "yp" type = "variant">Object, or string evaluation, to which the handler function is defined.</param>
			/// <param name = "y" type = "function">The hander function.</param>
			/// <param name = "ep" type = "variant">Object, or string evaluation, to which the error function is defined.</param>
			/// <param name = "e" type = "function">The error function.</param>
			/// <param name = "tl" type = "String" optional = "1">The label prefix of the wire.</param>
			/// <return-value name = "i" type = "String">Returns the identifier of the primitive wire object.</return-value>
			/// <description>Creates and returns a primitive wire based on the specified parameters.</description>
			/// </method>
			t.wire=function(xp,x,yp,y,ep,e,tl){
				/*
					xp = Action Package
					x = Action
					yp = Handler Package
					y = Handler
					ep = Error Package
					e = Error
					
				*/
				
				if(!DATATYPES.TS(tl)) tl = "swc.ocjw.primitive";

				try{
					if(DATATYPES.TS(xp)) xp = eval(xp);
					if(DATATYPES.TS(yp)) yp = eval(yp);
					if(DATATYPES.TS(ep)) ep = eval(ep);
				}
				catch(e){
					alert("hemi.wire.Error: " + e.toString());
					return 0;
				}

				var i = tl + "." + (++t.properties.c);
				if(!xp) xp=window;
				if(!yp) yp=window;
				if(!ep) ep=window;
				t.objects.w[i] = {ap:xp,a:x,hp:yp,h:y,ep:ep,e:e,i:0,r:0};
				return i;
			};

			HemiEngine._implements(t,"base_object","primitive_wire","%FILE_VERSION%");
			HemiEngine.registry.service.addObject(t);
			t.ready_state = 4;
		}
	}, 1);
}());


/// </class>
/// </package>
/// </source>
///
