/// <source>
/// <name>Hemi.wires</name>
//// <project>
/// 	<name>Hemi JavaScript Framework</name>
/// 	<url-title>Hemi JavaScript Framework</url-title>
/// 	<url>/Hemi/</url>
/// </project>
///
/// <package>
///		<path>Hemi.wires</path>
/// 	<library>Hemi</library>
///	<description>The Wire Service is used to chain multiple primitive wires (which connect disparate functions).</description>
///		<static-class>
///			<name>service</name>
///			<version>%FILE_VERSION%</version>
///			<description>Static initializer for new Wire instances.</description>
///			<method>
///				<name>newInstance</name>
///				<return-value type = "Wire" name = "w">Returns a new Wire instance.</return-value>
///				<description>Creates and returns a new Wire instance.</description>
///			</method>
///		</static-class>
///		<class>
///			<name>serviceImpl</name>
///			<version>%FILE_VERSION%</version>
///			<description>Service for extending PrimitiveWire utility, auto-linking PrimitiveWires together, and reusing PrimitiveWires.</description>
///  <example>
///    <name><![CDATA[Signal and slot example with wires]]></name>
///    <description><![CDATA[This demonstrates the use of wires to connect a set of functions in a loose signal and slot implementation. The demonstration uses a single wire that connects test1 to test2, test1 to testC, testC to testX, and testX to testC. The wire is invoked with an array of arguments that is passed to all wired functions. When the wire is invoked, the test1 function is invoked. test1 is wired to two handlers, test2 and testC, and both those handlers are invoked if test1 returns true, or handler execution is forced. If the wire is set to signal, the testC causes the testX handler to be invoked, because testC is also an action. When testX is invoked, it invokes testC again because that handler was used twice. The propogation stops after testC is invoked a second time because handlers can only signal a single time. ]]></description>
///    <code><![CDATA[function testWire(){]]></code>
///    <code><![CDATA[  var _w = Hemi.wires.wire,w,w2,co;]]></code>
///    <code><![CDATA[]]></code>
///    <code><![CDATA[  co = new CObj();]]></code>
///    <code><![CDATA[]]></code>
///    <code><![CDATA[  w = _w.newInstance();]]></code>
///    <code><![CDATA[]]></code>
///    <code><![CDATA[  /// Test 1 will invoke test 2]]></code>
///    <code><![CDATA[  /// This results in 2 function invocations]]></code>
///    <code><![CDATA[  ///]]></code>
///    <code><![CDATA[  w.wire(0,"test1",0,"test2");]]></code>
///    <code><![CDATA[  ]]></code>
///    <code><![CDATA[  /// With multiple handlers]]></code>
///    <code><![CDATA[  ///	Test 1 signals to both.]]></code>
///    <code><![CDATA[  ///]]></code>
///    <code><![CDATA[  w.wire(0,"test1",co,"testC");]]></code>
///    <code><![CDATA[  ]]></code>
///    <code><![CDATA[  /// AUTO SIGNAL LINK]]></code>
///    <code><![CDATA[  /// Because testC is both an action and a handler,]]></code>
///    <code><![CDATA[  ///	The first instance of the handler carries over as a signal]]></code>
///    <code><![CDATA[  /// This results in 1 function invocation of testX]]></code>
///    <code><![CDATA[  ///]]></code>
///    <code><![CDATA[  w.wire(co,"testC",0,"testX");]]></code>
///    <code><![CDATA[  /// AUTO SIGNAL LINK]]></code>
///    <code><![CDATA[  ///	Same as above, except back on testC]]></code>
///    <code><![CDATA[  ///	TestX is not invoked again because it is auto-signalling]]></code>
///    <code><![CDATA[  /// TestC is invoked again as a handler, but it will not auto-signal a second time]]></code>
///    <code><![CDATA[  ///]]></code>
///    <code><![CDATA[  w.wire(0,"testX",co,"testC");]]></code>
///    <code><![CDATA[]]></code>
///    <code><![CDATA[  /// Invoke the wire]]></code>
///    <code><![CDATA[        ///]]></code>
///    <code><![CDATA[]]></code>
///    <code><![CDATA[  w.invoke([{id:1,data:"the data"}],0,"test1");]]></code>
///    <code><![CDATA[]]></code>
///    <code><![CDATA[}]]></code>
///    <code><![CDATA[]]></code>
///    <code><![CDATA[function test1(o){]]></code>
///    <code><![CDATA[  alert('test1');]]></code>
///    <code><![CDATA[  return 1;]]></code>
///    <code><![CDATA[}]]></code>
///    <code><![CDATA[function testX(o){]]></code>
///    <code><![CDATA[  alert('testX');]]></code>
///    <code><![CDATA[}]]></code>
///    <code><![CDATA[]]></code>
///    <code><![CDATA[function test2(o){]]></code>
///    <code><![CDATA[  alert('test 2');]]></code>
///    <code><![CDATA[}]]></code>
///    <code><![CDATA[function test1_1(o){]]></code>
///    <code><![CDATA[  alert('test 1_1');]]></code>
///    <code><![CDATA[  return 1;]]></code>
///    <code><![CDATA[}]]></code>
///    <code><![CDATA[]]></code>
///    <code><![CDATA[function CObj(){]]></code>
///    <code><![CDATA[  this.id = "XX";]]></code>
///    <code><![CDATA[  this.object_id = "swc_debug_obj";]]></code>
///    <code><![CDATA[  this.testC = function(o){]]></code>
///    <code><![CDATA[  	alert("TestC = " + this.id + "\n" + arguments[0].data);]]></code>
///    <code><![CDATA[  }]]></code>
///    <code><![CDATA[}]]></code>
///  </example>
/*
	Author: Stephen W. Cote
	Email: wranlon@hotmail.com
	
	Copyright 2002, All Rights Reserved.
	
	Do not copy, archive, or distribute without prior written consent of the author.
*/


/*
	BUG
	
		Need a way to reset a wire.
*/

(function(){

	HemiEngine.namespace("wires",HemiEngine,{
		dependencies : ["hemi.wires.primitive"],
		service : null,
		serviceImpl : function(){
			var t = this;

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

			t.objects = {
				w:[],
				h:[],
				/* track the actions for use in disseminating handlers*/
				l:[],
				pw: new HemiEngine.wires.primitive.serviceImpl()
			};
			t.properties = {
				counter:0,
				wire_id_label:"hemi.wire",
				can_signal:1
			};
			/// <method>
			/// <name>getWires</name>
			/// <return-value name = "w" type = "Array">Array of wire objects.</return-value>
			/// <description>Returns an array of wires.</description>
			/// </method>
			t.getWires = function(){
				return this.objects.w;
			};
			/// <method>
			/// <name>getWiresHash</name>
			/// <return-value name = "w" type = "Hash">Hash of wire identifiers.</return-value>
			/// <description>Returns a hash of wire identifiers where the key is the id and the value is the index into the wires array.</description>
			/// </method>
			t.getWiresHash = function(){
				return this.objects.h;
			};
			/// <method>
			/// <name>sigterm</name>
			/// <description>Sends termination signal to destroy object.</description>
			/// </method>
			t.sigterm = function(){
				if(this.ready_state != 5){
					var _p = this.objects;
					_p.w = [];
					_p.h = [];
					_p.l = [];
					this.ready_state =5;
				}		
			};

			t.getLength = function(){
			
			};
			
			/// <method>
			/// <name>setCanSignal</name>
			/// <param name = "b" type = "boolean">Bit indicating similar PrimitiveWires signal to each other.</param>
			/// <description>Specifies whether the underlying PrimitiveWire objects signal to each other based on commonality between actions and handlers.</description>
			/// </method>
			///
			t.setCanSignal = function(b){
				t.properties.can_signal = (b?1:0);
			};
			
			/// <method>
			/// <name>getCanSignal</name>
			/// <return-value name = "b" type = "boolean">Bit indicating whether PrimitiveWires signal to each other.</return-value>
			/// <description>Returns whether the underlying PrimitiveWire objects signal to each other based on commonality between actions and handlers.</description>
			/// </method>
			///
			t.getCanSignal = function(){
				return t.properties.can_signal;
			};
			
			/*
				Invoke should be alterned to use the same method as primitiveInvoke,
				where the b argument, used to skip the check for whether the handler should be used,
				is replaced with a z argument for forcing the handler in lieu of executing the action.
				
				This woud make the invoke method more consistent with the implementation.
				
				At the moment, active implementations are being switched to use hard wires.
				
				Hard Wiring as a masking API for making non-signalling wires.
				Invoke is much more robust than primitiveInvoke, which is used for hard wiring, and remains as it includes
				the process for signalling.
			*/

			/// <method>
			/// <name>invoke</name>
			/// <param name = "a" type = "array">Arguments to pass to the wired functions.</param>
			/// <param name = "x" type = "variant">String evaluation or object on which the specified wire function exists.</param>
			/// <param name = "f" type = "String">Name of function to invoke.</param>
			/// <param name = "b" type = "boolean">Force the wire handler to execute.</param>
			/// <param name = "o" type = "boolean">Bit specifying only the handler should fire.</param>
			/// <return-value name = "v" type = "variant">Returns false if unsuccessful, true otherwise.</return-value>
			/// <description>Invokes a specified function that exists on the wire.</description>
			/// </method>
			///
			t.invoke = function(args,xp,x,b,o){
				var i=-1,l,d,
					_p = t.objects,
					_s = t.properties,
					w,wl,
					pw,r,a
				;
				
				if(!DATATYPES.TO(args)) args = [];
				
				/*
					i = variant index
					l = lookup id
					d = link id composed of 'l'
					w = wire pointer
					wl = wire linkage
					r = return value
					
					b = skip force handler
					o = handler only
				*/

				try{
					if(DATATYPES.TS(xp)) xp = eval(xp);
				}
				catch(e){
					alert("ocjw.invoke.Error: " + e.toString());
					return 0;
				}
				
				if(!DATATYPES.TU(xp) && x){
				
					l = (xp!=null?(xp.getObjectId ? xp.getObjectId() : (xp.id?xp.id:(xp.name?xp.name:0))):0);
					d = l + "-" + x;
					if(DATATYPES.TO(_p.l[d])){
						wl = _p.l[d];
					}
					else{
						alert("Invalid Wire Reference (" + d + ") in hemi.wires.service::invoke");
					}
				}
				else{
					if(DATATYPES.TO(_p.w[0])){
						w = _p.w[0];
						wl = _p.l[w.la + "-" + w.a];
					}
				}
				
				if(DATATYPES.TO(wl) && wl.length > 0){
					w = _p.w[wl[0]];
					
					/*
						invoke the primitive wire action,
						don't force handler,
						skip the handler,
						preserve the data
						don't specify handler only
						set as multi-purposed
					*/
					
					
					/* add request interceptor hook-up here */
					
					if(!o) r = _p.pw.invoke(w.pid,args,0,1,0,0,1);

					if(
						(
							o
							||
							(!w.i && r)
						)
						||
						b
					){

						w.i = 1;

						for(i = 0;i<wl.length;i++){
							w = _p.w[wl[i]];
							
							/*
								invoke the primitivewire action
								force the handler
								don't skip the handler
								preserve the data
								specify handler only
								set as multi-purposed
							*/
		
							/* add response interceptor hook-up here */
							
							_p.pw.invoke(w.pid,args,1,0,1,1,1);
							if(_s.can_signal){

								d = w.lh + "-" + w.h;

								/* reuse l */
								if(DATATYPES.TO(_p.l[d])){
									
									/* reuse w */
									l = _p.w[_p.l[d][0]];
									
									/*
										Get the primitive wire data.
										Some data is being stored twice on the wire,
										but for the most part it should only be located
										in one place.  So, use the primitive wire data.
										Note that this does add an extra lookup.
									*/

									pw = _p.pw.getWire(l.pid);
									if(pw){

										/*
											Enforce one-time linkage to avoid loops.
										*/
										if(!l.i) t.invoke(args,pw.ap,pw.a,0,1);
									}
								}

							}
							/*
								The previous code does a lookup into the linkage for cross-linking
								
								And that, my friends, is the basic hook to a signals & slots implementation.
								
								A generic S&S class can then define the standard API which makes the corresponding
								wire setup.
								
							*/
							
						}				
					}
					else{

	/*					alert("wire action false");*/

					}

				}

				return r;
			};

			t.addInterceptor = function(o){
				/* Adds an object request or response interceptor */
			};

			t.join = function(yp,y){
				/*
				 add this handler to the linkage of the first wire
				
				 this is done by taking the first wire, and then creating a new wire
				 with the new handler.
				*/
				
			};
			
			/// <method>
			/// <name>wire</name>
			/// <param name = "xp" type = "variant">Object, or string evaluation, to which the action function is defined.</param>
			/// <param name = "x" type = "function">The action function.</param>
			/// <param name = "yp" type = "variant">Object, or string evaluation, to which the handler function is defined.</param>
			/// <param name = "y" type = "function">The hander function.</param>
			/// <param name = "ep" type = "variant">Object, or string evaluation, to which the error function is defined.</param>
			/// <param name = "e" type = "function">The error function.</param>
			/// <return-value name = "i" type = "String">Returns the identifier of the wire object.</return-value>
			/// <description>Creates and returns a wire based on the specified parameters.  This function creates an underlying PrimitiveWire as well as creating linkage to be connected with other wires.</description>
			/// </method>
			t.wire = function(xp,x,yp,y,ep,e){
				var v,i,a,
					_p = t.objects,
					_s=t.properties
				;
	/*
				if(arguments.length == 2){
					y = x;
					x = xp;
					yp = xp = 0;
				}
	*/

				try{
					if(DATATYPES.TS(xp)) xp = eval(xp);
					if(DATATYPES.TS(yp)) yp = eval(yp);
					if(DATATYPES.TS(ep)) ep = eval(ep);
				}
				catch(e){
					alert("ocjw.wire.Error: " + e.toString());
					return 0;
				}

				/* primitive wires are created out of all values. */
				
				i = _p.pw.wire(xp,x,yp,y,ep,e,_s.wire_id_label);

				v = {
					pid:i,
					a:x,
					h:y,

					/* link action id */
					la:(xp!=null?(xp.object_id?xp.object_id:(xp.id?xp.id:(xp.name?xp.name:0))):0),

					/* link handler id */
					lh:(yp!=null?(yp.object_id?yp.object_id:(yp.id?yp.id:(yp.name?yp.name:0))):0),

					/* link error id */
					le:(ep!=null?(ep.object_id?ep.object_id:(ep.id?ep.id:(ep.name?ep.name:0))):0),
					
					id:0,
					i:0
				};

				v.id = v.a + "-" + v.h + "-" + v.pid;
				
				_p.h[v.id] = _p.w.length;
				_p.w[_p.w.length] = v;

				/* re-use i */
				i = v.la + "-" + v.a;

				if(!DATATYPES.TO(_p.l[i])) _p.l[i] = [];
				
				a = _p.l[i];
				a[a.length] = _p.h[v.id];
				
				return 1;
			};
		
			/// <method>
			/// <name>primitiveWire</name>
			/// <param name = "xp" type = "variant">Object, or string evaluation, to which the action function is defined.</param>
			/// <param name = "x" type = "function">The action function.</param>
			/// <param name = "yp" type = "variant">Object, or string evaluation, to which the handler function is defined.</param>
			/// <param name = "y" type = "function">The hander function.</param>
			/// <param name = "ep" type = "variant">Object, or string evaluation, to which the error function is defined.</param>
			/// <param name = "e" type = "function">The error function.</param>
			/// <return-value name = "i" type = "String">Returns the identifier of the PrimitiveWire object.</return-value>
			/// <description>Creates and returns a PrimiteWire based on the specified parameters.</description>
			/// </method>
			t.primitiveWire = function(xp,x,yp,y,ep,e){
				var _p = t.objects,
					_s=t.properties
				;

				try{
					if(DATATYPES.TS(xp)) xp = eval(xp);
					if(DATATYPES.TS(yp)) yp = eval(yp);
					if(DATATYPES.TS(ep)) ep = eval(ep);
				}
				catch(e){
					alert("ocjw.wire.Error: " + e.toString());
					return 0;
				}

				/* primitive wires are created out of all values. */

				return _p.pw.wire(xp,x,yp,y,ep,e,_s.wire_id_label);
			};

			/// <method>
			/// <name>invokePrimitive</name>
			/// <param name = "a" type = "array" optional = "1">Arguments to pass to the wired functions.</param>
			/// <param name = "i" type = "String">Identifier of the primitive wire to invoke.</param>
			/// <param name = "b" type = "boolean" optional = "1" default = "false">Bit indicating only the handler should be fired.</param>
			/// <param name = "z" type = "boolean" optional = "1" default = "false">Bit indicating the handler should be skipped.</param>
			/// <return-value name = "r" type = "boolean">Returns true if the chain completed successfully, false if otherwise.</return-value>
			/// <description>Invokes a wire, causing the action-handler chain to be processed.</description>
			/// </method>

			t.invokePrimitive = function(args,i,o,z){
				/*
					i = primitive wire id
					z = skip handler
					o = handler only, don't execute action
				*/
				var _pw = t.objects.pw,r;
				
				if(DATATYPES.TS(i)){
					if(!o){
						r = _pw.invoke(i,args,0,1,0,0,1);
					}
					if(
						o
						||
						r
					){
						if(!z){
							_pw.invoke(i,args,1,0,1,1,1);
						}
					}
					else{
	/*					wire action returned false */

					}
				}

				return r;
			};

			/// <method>
			/// <name>invokeHardWireAction</name>
			/// <param name = "o" type = "PrimitiveWire">A PrimitiveWire object.</param>
			/// <param name = "i" type = "String">Identifier of a wire.</param>
			/// <param name = "a" type = "array" optional = "1">Arguments to pass to the wired functions.</param>
			/// <return-value name = "r" type = "boolean">Returns true if the chain completed successfully, false if otherwise.</return-value>
			/// <description>Invokes the action of a hardened wire.</description>
			/// </method>
			t.invokeHardWireAction=function(o,i,a){
				/*
					o = object reference that contains primitive wire data
					i = wire id
					a = optional argument addition
					
					b = action_args array
					c = copy array
					a = optional args array
				*/
				var pw, c = [], b, l, k=0,_m = HemiEngine.message.service;
				if(!DATATYPES.TO(o) || !DATATYPES.TO(o.primitive_wires)){
					_m.sendMessage("Invalid object reference for primitive wire","511.4");
					return 0;
				}
				pw = o.getPrimitiveWire(i);
				if(!DATATYPES.TO(pw)){
					_m.sendMessage("Invalid primitive wire id " + i,"511.4");
					return 0;
				}
				
				b = pw.action_arguments;
				for(;k < b.length;) c[k] = b[k++];
				if(DATATYPES.TO(a) && (l = a.length) )
					for(k=0;k < l;) c[c.length] = a[k++];


				return t.invokePrimitive(c,pw.id,0,1);
			};

			/// <method>
			/// <name>invokeHardWireHandler</name>
			/// <param name = "o" type = "PrimitiveWire">A PrimitiveWire object.</param>
			/// <param name = "i" type = "String">Identifier of a wire.</param>
			/// <param name = "a" type = "array" optional = "1">Arguments to pass to the wired functions.</param>
			/// <return-value name = "r" type = "boolean">Returns true if the chain completed successfully, false if otherwise.</return-value>
			/// <description>Invokes the handler of a hardened wire.</description>
			/// </method>
			t.invokeHardWireHandler=function(o,i,a){
				var pw,c = [], b, l, k=0,_m = HemiEngine.message.service;
				if(!DATATYPES.TO(o) || !DATATYPES.TO(o.primitive_wires)){
					_m.sendMessage("Invalid object reference for primitive wire","511.4");
					return 0;
				}
				pw = o.getPrimitiveWire(i);
				if(!DATATYPES.TO(pw)){
					_m.sendMessage("Invalid primitive wire id " + i,"511.4");
					return 0;
				}
				b = pw.handler_arguments;
				for(;k < b.length;) c[k] = b[k++];
				if(DATATYPES.TO(a) && (l = a.length) )
					for(k=0;k < l;) c[c.length] = a[k++];

				return t.invokePrimitive(c,pw.id,1,0);
			};

			/*
				A hard wire binds arguments with the action and handler.
			*/		

			/// <method>
			/// <name>hardWire</name>
			/// <param name = "o" type = "PrimitiveWire">A PrimitiveWire object.</param>
			/// <param name = "i" type = "String">Identifier of a primitive wire.</param>
			/// <param name = "aa" type = "array" optional = "1">Arguments to pass to the action function.</param>
			/// <param name = "ha" type = "array" optional = "1">Arguments to pass to the handler function.</param>
			/// <param name = "xp" type = "variant">Object, or string evaluation, to which the action function is defined.</param>
			/// <param name = "x" type = "function">The action function.</param>
			/// <param name = "yp" type = "variant">Object, or string evaluation, to which the handler function is defined.</param>
			/// <param name = "y" type = "function">The hander function.</param>
			/// <param name = "ep" type = "variant">Object, or string evaluation, to which the error function is defined.</param>
			/// <param name = "e" type = "function">The error function.</param>
			/// <param name = "ea" type = "array" optional = "1">Arguments to pass to the error function.</param>
			/// <return-value name = "i" type = "String">Returns the identifier of the newly created hardened wire.</return-value>
			/// <description>Invokes the action of a hardened wire.</description>
			/// </method>
			t.hardWire=function(o,i,action_args,handler_args,ac,a,hc,h,ec,e,error_args){
				/*
					o = an object that has a primitive_wires hash object.
					i = id used for the primitive_wires hash lookup.  The value will be the primitive wire id, pid.
					ac = action class
					a = action
					hc = handler class
					h = handler
					ec = error class
					e = error
					
					pid = primitive id
				*/
				if(!DATATYPES.TO(o) || !DATATYPES.TO(o.primitive_wires)) return 0;

				var pid = t.primitiveWire(ac,a,hc,h,ec,e);
				if(pid != 0){
					o.primitive_wires[i] = {id:pid,action_arguments:action_args,handler_arguments:handler_args,error_arguments:error_args};
				}
				return pid;
			};

			HemiEngine._implements(t,"base_object","wire_service","%FILE_VERSION%");
			HemiEngine.registry.service.addObject(t);
			t.ready_state = 4;
			return t;
		}
	},1);
}());


/// </class>
/// </package>
/// </source>
///
