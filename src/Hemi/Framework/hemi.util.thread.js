/// <source>
/// <name>Hemi.util.thread</name>
/// <project>
/// 	<name>Hemi JavaScript Framework</name>
/// 	<url-title>Hemi JavaScript Framework</url-title>
/// 	<url>/Hemi/</url>
/// </project>
///
/// <package>
///		<path>Hemi.util.thread</path>
///		<library>Hemi</library>
///		<description>The Thread class provides a psuedo-thread implementation for Framework Objects.  Each thread is sensitive to the object lifecycle, and can stop itself when the object is destroyed or when the framework is shutdown.</description>
/// <static-class>
/// <name>Thread</name>
/// <description>Creates a psuedo asynchronous thread.</description>
/// <method>
///		<name>newInstance</name>
///		<param name = "o" type = "object">A registered object.</param>
///		<return-value name = "t" type = "Thread">A new ThreadInstance.</return-value>
///		<description>Creates a new instance of a psuedo thread.  The thread is bound to the object lifetime of the specified object, so that when the object is explicitly destroyed or removed from the ObjectRegistry, the thread will also terminate.</description>
/// </method>
/// <example implementation = "1">
///		<description>Demonstrate how to use the Thread component.</description>
///		<name>Example Thread #1</name>
///		<code>var MyThreadedObject = {</code>
///		<code>   handle_thread_run : function(oThread){</code>
///		<code>      /* basic demo */</code>
///		<code>      document.title = (new Date()).getTime();</code>
///		<code>   }</code>
///		<code>};</code>
///		<code>/* Prepare the MyThreadedObject for use with Engine */</code>
///		<code>Hemi.prepareObject("CustomThread","1.0",true,MyThreadedObject);</code>
///		<code>/* Create a new thread for MyThreadedObject*/</code>
///		<code>var oThread = Hemi.util.thread.newInstance(MyThreadedObject);</code>
///		<code>/* run the thread every 5 seconds */</code>
///		<code>oThread.run(5000);</code>
/// </example>

/// </static-class>
///	<class>
///	<name>ThreadInstance</name>
///	<description>A psuedo thread that is created by invoking the static <i>thread</i> class <i>newInstance</i> method.</description>
///	<method virtual="1">
///		<name>handle_thread_start</name>
///		<param name = "t" type = "ThreadInstance">An instance of a pseudo thread.</param>
///		<description>Invoked when the thread is starting.</description>
/// </method>
///	<method virtual="1">
///		<name>handle_thread_stop</name>
///		<param name = "t" type = "ThreadInstance">An instance of a pseudo thread.</param>
///		<description>Invoked when the thread is shutting down.</description>
/// </method>
///	<method virtual="1">
///		<name>handle_thread_run</name>
///		<param name = "t" type = "ThreadInstance">An instance of a pseudo thread.</param>
///		<description>Invoked when the thread is running an iteration.</description>
/// </method>


/*
	Author: Stephen W. Cote
	Email: wranlon@hotmail.com
	
	Copyright 2003, All Rights Reserved.
	
	Do not copy, archive, or distribute without prior written consent of the author.
*/
(function(){
	HemiEngine.namespace("util.thread", HemiEngine, {
		newInstance:function(o){

			/*
				o = reference object
			*/
			
			if(!HemiEngine.registry.service.isRegistered(o)){
				HemiEngine.message.service.sendMessage("Object must be registered to use a thread.","200.4",1);
				return 0;
			}

			var n = HemiEngine._forName("base_object","thread","%FILE_VERSION%");
			
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
			/// <description>Object API structure for storing sub structures: object_config.pointers and object_config.status.</description>
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
			/// <return-value name = "o" type = "object">The object_config.status substructure.</return-value>
			/// <description>Returns the object_config.status sub structure.</description>
			/// </method>
			///
			/// <method>
			/// <name>getPointers</name>
			/// <return-value name = "o" type = "object">The object_config.pointers substructure.</return-value>
			/// <description>Returns the object_config.pointers sub structure.</description>
			/// </method>
			///
			n.properties = {
				r:"handle_thread_run",
				s:"handle_thread_start",
				t:"handle_thread_stop",
				d:1000,

				/* u = interval in use */
				u:0,
				i:0,
				m:0,

				/* z = object's id */
				z:o.object_id,

				/*
					y = all stop; some error happened and everything should grind to a halt
					There is no recovery from All Stop.  The object is frozen once this happens.
				*/
				y:0
			};
				
			n.objects = {
				o:o
			};
		
			
	///		<method>
	///			<name>restart</name>
	///			<description>Restarts the thread interval.</description>
	///			<return-value type = "boolean" name = "b">Bit indicating whether the thread was restarted.</return-value>
	///		 </method>

			n.restart = function(){
				if(!this.stop(1) || !this.run(this.properties.u, 1)) return 0;
				return 1;
			};

	///		<method>
	///			<name>getLastInterval</name>
	///			<description>Returns the delay interval used to start the thread.</description>
	///			<return-value type = "int" name = "i">The interval in milliseconds used to start the thread.</return-value>
	///		 </method>
			n.getLastInterval = function(){
				return this.properties.u;
			};

	///		<method>
	///			<name>run</name>
	///			<param name = "d" type = "int" optional="1" default = "1000">Delay in execution between thread iterations.</param>
	///			<param name = "b" type = "boolean" optional = "1">Bit indicating whether the virtual handle_thread_stop method should be suppressed.</param>
	///			<description>Runs the thread with the specifed delay.</description>
	///			<return-value type = "boolean" name = "b">Bit indicating whether the thread started running.</return-value>
	///		 </method>
			n.run = function(d,b){
				var t = this, _s;
				_s = t.properties;
				if(!t.getIsRunnable() || _s.i) return 0;
				
				if(!DATATYPES.TN(d) || d < 0) d = _s.d;
				_s.u = d;
				
				/* m = 1; interval */
				_s.m = 1;
				
				if(!b && DATATYPES.TF(t.objects.o[_s.s])) t.objects.o[_s.s](t);
				
				_s.i = window.setInterval("HemiEngine.registry.service.getObject('" + t.object_id + "').handle_run()",d);
				return 1;
			};
		
			n.handle_run = function(){
				var t = this, _s, _p;
				_s = t.properties;
				_p = t.objects;

				/*
					If there is no interval/timer value, or the thread is in All Stop mode, then just return
				*/
				if(!_s.i || _s.y) return 0;
				
				if(DATATYPES.TO(_p.o) && _p.o.ready_state > 4){
				    /* All stop */
					if(!t.stop())
						_s.y = 1;
					
					return 0;
				}
				
				try{
					_p.o[_s.r](t);
					if(_s.m == 2){
						_s.i = 0;
						_s.m = 0
					}
				}
				catch(e){
					/* if an interval */
					if(_s.m == 1)
						window.clearInterval(_s.i);
					
					_s.i = 0;
				}
				
				return 1;
			};

	///		<method>
	///			<name>allStop</name>
	///			<description>Invokes the <i>stop</i> method and prevents the thread from further execution.</description>
	///		 </method>
			n.allStop = function(){
				this.properties.y = 1;
				this.stop();
			};

	///		<method>
	///			<name>stop</name>
	///			<description>Stops the thread.</description>
	///			<param name = "b" type = "boolean" optional = "1">Bit indicating whether the virtual handle_thread_stop method should be suppressed.</param>
	///			<return-value type = "boolean" name = "b">Bit indicating whether the thread was stopped.</return-value>
	///		 </method>		
			n.stop = function(b){
				var t = this, _s;

				_s = t.properties;
				if(!_s.i) return 0;
				/* if it's a timeout */
				if(_s.m == 2){
					window.clearTimeout(_s.i);
				}
				else if(_s.m == 1){
					window.clearInterval(_s.i);
				}
				else{
					/* return 0 here because 'm' is an unexpected state */
					return 0;
				}

				if(!b && DATATYPES.TF(t.objects.o[_s.t])) t.objects.o[_s.t](t);
				
				_s.m = 0;
				_s.i = 0;
				return 1;
			};

	///		<method>
	///			<name>getIsRunning</name>
	///			<description>Returns true if the thread is running, false otherwise.</description>
	///			<return-value type = "boolean" name = "b">Bit indicating whether the thread is running.</return-value>
	///		 </method>	
			n.getIsRunning = function(){
				if(this.properties.i) return 1;
				return 0;
			};

	///		<method>
	///			<name>getIsRunnable</name>
	///			<description>Returns true if the thread can be run.</description>
	///			<return-value type = "boolean" name = "b">Bit indicating whether the thread can be run.</return-value>
	///		 </method>
			n.getIsRunnable = function(){
				var o = this.objects.o;
				if(
					DATATYPES.TO(o)
					&&
					typeof DATATYPES.TF(o[this.properties.r])
				) return 1;
				
				return 0;
		
			};

	///		<method>
	///			<name>destroy</name>
	///			<description>Prepares the object for destruction.</description>
	///		 </method>
			n.destroy = function(){
				var t = this;
				/* only do this once */
				if(t.ready_state < 5){

					t.stop();
					t.ready_state = 5;

					HemiEngine.message.service.unsubscribe(t,"onremoveobject","handle_remove_object");

					/* It is up to the object to remove itself from the registry */
					HemiEngine.registry.service.removeObject(t);

				}
			};

			n.handle_remove_object = function(s,i){

				if(i == this.properties.z){
					this.destroy();
				}
			};
			

			HemiEngine.registry.service.addObject(n);
			HemiEngine.message.service.subscribe(n,"onremoveobject","handle_remove_object");
			
			o = 0;
			
			return n;
		}
	});
}());

/// </class>
/// </package>
/// </source>