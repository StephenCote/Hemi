/// <source>
/// <name>Hemi.event</name>
/// <project>
/// 	<name>Hemi JavaScript Framework</name>
/// 	<url-title>Hemi JavaScript Framework</url-title>
/// 	<url>/Hemi/</url>
/// </project>
///
/// <package>
///	<path>Hemi</path>
///	<library>Hemi</library>
///	<description>The Event class provides utilities for working with the browser event object, listening to and capturing events, and decorating Framework Objects with an API for scoping handlers back to the object.</description>
///		<static-class>
///			<name>event</name>
///			<version>%FILE_VERSION%</version>
///			<description>Utilities for DOM Events.</description>
///			<example implementation = "1">
///				<name>Using event utilities</name>
///				<description>This example shows how to use the event buffer and scopeHandler mechanisms to preserve the event handler context to a specific object instance.</description>
///				<code><![CDATA[<p id = "oPara">Test paragraph</p>]]></code>
///				<code><![CDATA[<script type = "text/javascript">]]></code>
///				<code>var oObject = Hemi.newObject("DemoType","1.0",true);</code>
///				<code>// Add the scopeHandler method for this object with addScopeBuffer</code>
///				<code>Hemi.event.addScopeBuffer(oObject);</code>
///				<code>// Create an event handler wrapper with scopeHandler for an onclick event.</code>
///				<code>// Specify the event name and the bit to use the ObjectRegistry.</code>
///				<code>// This creates oObject._prehandle_click which will invoke oObject._handle_click.</code>
///				<code>oObject.scopeHandler("click",0,0,1);</code>
///				<code>oObject._handle_click = function(e){</code>
///				<code>   var oEvent = Hemi.event.getEvent(e);</code>
///				<code>   var oSource = Hemi.event.getEventSource(e);</code>
///				<code>   // The 'this' object refers to the instance of oObject</code>
///				<code>};</code>
///				<code> // Add the onclick event to the paragraph element, oPara</code>
///				<code>var oPara = document.getElementById("oPara");</code>
///				<code>// Use the _prehandle_click created by the scopeHandler method.</code>
///				<code>Hemi.event.addEventListener(oPara, "click", oObject._prehandle_click);</code>
///				<code><![CDATA[</script>]]></code>
///			</example>
(function(){
	HemiEngine.namespace("event",HemiEngine,{
		/// <method>
		/// <name>getEvent</name>
		/// <param name="o" type="object">Possible event object</param>
		/// <return-value type = "object" name = "e">The event object.</return-value>
		/// <description>Returns the event object, where the specified parameter may or may not be the event object depending on the browser.</description>
		/// </method>
		///
		getEvent:function(o){
			return (typeof event == DATATYPES.TYPE_OBJECT)?event:o;
		},
		/// <method>
		/// <name>cancelEvent</name>
		/// <param name="o" type="object">Possible event object</param>
		/// <description>Cancels the event.</description>
		/// </method>
		///
		cancelEvent:function(o){
			(typeof o.preventDefault != DATATYPES.TYPE_FUNCTION)?(o.returnValue=false):o.preventDefault();
			o.cancelBubble = true;
		},
		
		/// <method>
		/// <name>getEventDestination</name>
		/// <param name="o" type="object">Possible event object</param>
		/// <return-value type = "object" name = "e">The event destination object.</return-value>
		/// <description>Returns the event destination or target object.</description>
		/// </method>
		///
		getEventDestination:function(e){
			return (e.relatedTarget)?e.relatedTarget:e.toElement;	
		},
		/// <method>
		/// <name>getEventOrigination</name>
		/// <param name="o" type="object">Possible event object</param>
		/// <return-value type = "object" name = "e">The event origination or source object.</return-value>
		/// <description>Returns the event origination object.</description>
		/// </method>
		///
		getEventOrigination:function(e){
			return (e.relatedTarget)?e.relatedTarget:e.fromElement;	
		},
		
		/// <method>
		/// <name>getEventSource</name>
		/// <param name="o" type="object">Possible event object</param>
		/// <return-value type = "object" name = "e">The event source object.</return-value>
		/// <description>Returns the event source object.</description>
		/// </method>
		///
		getEventSource:function(o){
			var s=HemiEngine.event.getEvent(o);
			if(s==null){
				HemiEngine.message.service.sendMessage("Bad event reference","515.3",1);
				return o;
			}
			return (s.target)?s.target:s.srcElement;
		},

		/// <method virtual = "1">
		/// <name>scopeHandler</name>
		/// <param name = "s" type = "String">Event name, such as <i>click</i>, or <i>load</i>.</param>
		/// <param name = "r" type = "object" optional = "1" default = "null">Reference object for which the event handler should have context.  Object must be registered with ObjectRegistry.</param>
		/// <param name = "x" type = "boolean" optional = "1" default = "false">Bit indicating whether or not the custom handler should be set on the specified object.</param>
		/// <param name = "l" type = "boolean" optional = "1" default = "false">Bit indicating whether the context should be referenced using the ObjectRegistry if true, or the this reference if false.</param>
		/// <return-value type = "function" name = "f">Custom event handler function.</return-value>
		/// <description>Creates a custom event handler, <b>_prehandle_<i>event</i></b>, which invokes <b>_handle_<i>event</i></b> for the specified object, using the specified context.  This method is created by <i>addScopeBuffer</i>.</description>
		/// </method>
		///

		/// <method internal = "1">
		/// <name>_prehandle_event</name>
		/// <return-value type = "variant" name = "v">Returns value from <b>_handle_<i>event</i></b></return-value>
		/// <description>Internal event handler used to establish context and to invoke the custom handler.</description>
		/// </method>
		///

		/// <method virtual = "1">
		/// <name>_handle_event</name>
		/// <return-value type = "variant" name = "v">Returns developer specified value.</return-value>
		/// <description>A developer specified event handler that is invoked after binding an event to the <b>_prehandle_<i>event</i></b> handler, and which has the context specified by the <i>scopeHandler</i> method.</description>
		/// </method>
		///


		/// <method>
		/// <name>addScopeBuffer</name>
		/// <param name="e" type="object">A possible event object.  Use <i>_gevt</i> to resolve the event object.</param>
		/// <description>Creates the <i>scopeHandler</i> method on the specified object.</description>
		/// </method>
		///
		addScopeBuffer:function(o){
			var e = "scopeHandler";
			try{
				o[e]=function(s,r,x,l){
					var b = (typeof r == DATATYPES.TYPE_OBJECT && r!=null?1:0),t=this,e,h,f;
					r = (b)?r:t;
					/*
					if(!DATATYPES.TF(r["_handle_" + s])){
						HemiEngine.message.service.sendMessage("Scope buffer cannot be created for " + s + ". Object " + r.object_id + " does not define '_handle_" + s + "'");
						return;
					}
					*/
					e = "_prehandle_" + s;
					b = (l?1:0);
					h = 
						"f=function(){\n"
						+ "try{\n"
						+ "var o="+ (b?'Hemi.registry.service.getObject(\"' + r.object_id + '\")':"this") + ";\n"
						+ "if(typeof o!=\"object\" || o == null){HemiEngine.logDebug('Object " + r.object_id + " is invalid for event " + s + "');return;}\nreturn o." + (!x ? "_handle_" : "") + s + ".apply(o,arguments);"
						+ "}\ncatch(e){ alert(r.object_id + \"::\" + s + \"::\" + (e.description?e.description:e.message) + \"\\n\" + Hemi.error.traceRoute(f.caller));}\n"
						+ "}"
					;
					eval(h);
					if(!x) t[e] = f;
					return f;
				};
				o["getScopeHandler"] = function(s){
					return "Hemi.registry.service.getObject(\"" + this.object_id + "\")._prehandle_" + s + "()";
				};
			
			}
			catch(e){
				alert("Error: " + e.description);
			}
			
		},
		disableMotionCapture:function(o){
			var f;
			if(typeof document.removeEventListener == DATATYPES.TYPE_FUNCTION){
				document.removeEventListener("mousemove",o.onmousemove,true);
				document.removeEventListener("mouseup",o.onmouseup,true);
			}
			else if(typeof (f = o.releaseCapture) != DATATYPES.TYPE_UNDEFINED)
				f();
			
		},

		enableMotionCapture:function(o){
			var f;
			if(typeof document.addEventListener == DATATYPES.TYPE_FUNCTION){
				document.addEventListener("mousemove",o.onmousemove,true);
				document.addEventListener("mouseup",o.onmouseup,true);
			}
			
			else if(typeof (f = o.setCapture) != DATATYPES.TYPE_UNDEFINED)
				f();
			
			
		},

		addEventListener:function(o,e,f,b){

			/*
				o = object
				e = event name
				f = function pointer
				b = trap
			*/
			if(typeof o.addEventListener != DATATYPES.TYPE_UNDEFINED)
				o.addEventListener(e,f,b);
			
			else if(typeof o.attachEvent != DATATYPES.TYPE_UNDEFINED)
				o.attachEvent("on" + e,f);
			

		},

		removeEventListener:function(o,e,f,b){
			if(typeof o.removeEventListener != DATATYPES.TYPE_UNDEFINED)
				o.removeEventListener(e,f,b);
			
			else if(typeof o.detachEvent != DATATYPES.TYPE_UNDEFINED)
				o.detachEvent("on" + e,f);
			
		}
	
	});
})();
/// </static-class>
/// </package>
/// </source>