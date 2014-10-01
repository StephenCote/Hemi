/*
	Engine for Web Applications
	Source: Hemi.util.url
	Copyright 2002 - 2009. All Rights Reserved.
	Author: Stephen W. Cote
	Email: sw.cote@gmail.com
	Project: http://www.whitefrost.com/projects/engine/
	License: http://www.whitefrost.com/projects/engine/code/engine.license.txt
*/

/// <source>
/// <name>Hemi.util.url</name>
/// <project>
/// 	<name>Hemi JavaScript Framework</name>
/// 	<url-title>Hemi JavaScript Framework</url-title>
/// 	<url>/Hemi/</url>
/// </project>
///
/// <package>
///		<path>Hemi.util</path>
/// 		<library>Hemi</library>
///		<description>The URL class parses URIs into individual parts.  The class also supports resolving relative paths against specified URLs.</description>
///		<static-class>
///			<name>url</name>
///			<version>%FILE_VERSION%</version>
///			<description>Utility for parsing URLs.</description>
///			<version>%FILE_VERSION%</version>
///			<method>
///				<name>qualifyToHost</name>
///				<param name = "u" type = "String">Partial URL.</param>
///				<description>Merges the specified URL with the current window URL (document.URL).</description>
///				<return-value name = "v" type = "String">Full url derived from the specified partial URL, and the window URL.</return-value>
///			</method>
///			<method>
///				<name>newInstance</name>
///				<param name = "v" type = "String">Partial or complete URL.</param>
///				<param name = "b" type = "boolean">Bit indicating whether to qualify the URL parameter against the current URL.</param>
///				<description>Creates a new Url object.</description>
///				<return-value name = "u" type = "UrlInstance">Instance of a Url.</return-value>
///			</method>
///	 </static-class>
///

/// <class>
///		<name>UrlInstance</name>
///		<version>%FILE_VERSION%</version>
///		<description>On object representation of a specified URL.</description>
/// <example>
///		<description>Demonstrate how to obtain a full URL from a specified partial URL.</description>
///		<name>Url Utility #1</name>
///		<code>var sFullUrl = HemiEngine.util.url.qualifyToHost("someFile.html");</code>
/// </example>
/// <example>
///		<description>Demonstrate how to obtain a UrlInstance and access its members.</description>
///		<name>Url Utility #2</name>
///		<code>var oUrl = HemiEngine.util.url.newInstance("/path/someFile.html?somequery=1");</code>
///		<code>var sQuery = oUrl.getQuery();</code>
/// </example>
(function(){
	HemiEngine.namespace("util.url", HemiEngine, {
		qualifyToHost:function(u){
			var _u = HemiEngine.util.url.newInstance(document.URL,0);
			return _u.qualify(u);
		},
		newInstance:function(v,b){

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


			var n = HemiEngine._forName("base_object","url_composite","%FILE_VERSION%");
			
			if(b) v = HemiEngine.util.url.qualifyToHost(v);
			
			n.properties = {
				/* original_value */
				ov:0,
				/* protocol */
				r:0,
				/* domain */
				d:0,
				/* path */
				p:0,
				/* file */
				f:0,
				/* query */
				q:0,
				/* qualified */
				x:(b?1:0)
			};

			/// <method>
			/// <name>getFile</name>
			/// <return-value name = "f" type = "String">The file portion of the URL.</return-value>
			/// <description>Returns any file reference.</description>
			/// </method>
			n.getFile=function(){
				return this.properties.f;
			};

			/// <method>
			/// <name>getQuery</name>
			/// <return-value name = "q" type = "String">The query string.</return-value>
			/// <description>Returns any query string.</description>
			/// </method>
			n.getQuery=function(){
				return this.properties.q;
			};

			/// <method>
			/// <name>getDomain</name>
			/// <return-value name = "d" type = "String">The domain name.</return-value>
			/// <description>Returns the domain name.</description>
			/// </method>
			n.getDomain=function(){
				return this.properties.d;
			};

			/// <method>
			/// <name>getPath</name>
			/// <return-value name = "p" type = "String">The URL path.</return-value>
			/// <description>Returns the URL path.</description>
			/// </method>
			n.getPath=function(){
				return this.properties.p;
			};

			/// <method>
			/// <name>getProtocol</name>
			/// <return-value name = "p" type = "String">The URL protocol.</return-value>
			/// <description>Returns the URL protocol.</description>
			/// </method>
			n.getProtocol=function(){
				return this.properties.r;
			};
			
	///		<method>
	///			<name>qualify</name>
	///			<param name = "u" type = "String">Partial URL.</param>
	///			<description>Merges the specified partial URL with the current context URL of the UrlInstance.</description>
	///			<return-value name = "v" type = "String">Full url derived from the specified partial URL, and the context URL.</return-value>
	///		</method>
			n.qualify=function(u){
				/*
					u = url
					
					f = full url
				*/
				var f = u,_s,t=this;
				_s = t.properties;


				/* don't bother with fully qualified urls */
				if(!u.match(/\/\//)){
		
					/* if there is no leading slash, or it starts with a ./ */
					if(!u.match(/^\//) || u.match(/^\.\//)){
						if(u.match(/^\.\//)) u=u.substring(2,u.length);
						f = _s.r + "://" + _s.d + _s.p + u;
					}
					else{
						/* if the url has a leading slash */
						if(u.match(/^\//)){
							f = _s.r + "://" + _s.d + u;
						}
						else{
							/* need to count back */

						}
					}
				}
		
				return f;
			};
			
			/// <method internal = "1">
			/// <name>_init</name>
			/// <param name = "o" type = "String">Input URL</param>
			/// <description>Initializes the UrlInstance.</description>
			/// </method>
			n._init = function(o){
				/*
				
					o = original value
					
					u = url
					
					i = variant index
					v = variant value
					m = variant marker
				*/
				var _s,t=this,u,v,m;
				_s = t.properties;
				u = _s.ov = o;

				if(u.match(/\?/)){
					i=u.indexOf("?");
					_s.q=u.substring(i+1,u.length);
					u=u.substring(0,i);
				}
				if(u.match(/\/\//)){
					i=u.indexOf("//");
					v=u.substring(0,i + 2);
					u=u.substring(i+2,u.length);
					if(v.match(/:/)){
						m=v.indexOf(":");
						_s.r=v.substring(0,m);
					}
					else{
						_s.r="http";
					}
				}
				if(!u.match(/\//)){
					if(!_s.r) _s.r="http";
					_s.d=u;
					u="";
				}

				i=u.indexOf("/");
				if(i > -1){
					_s.d=u.substring(0,i);
					u=u.substring(i,u.length);
				}
				if(!_s.r) _s.r="http";

				if(u.length){
					i=u.lastIndexOf("/");
					if(i > -1){
						v=u.substring(0,i + 1);
						_s.p=v;
						u=u.substring(i + 1,u.length);
					}
				}
				if(u.length){
					_s.f=u;
				}
				
			};

			n._init(v);
			return n;
		}
	});
}());

/// </class>
/// </package>
/// </source>
