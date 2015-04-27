/// <source>
/// <name>Hemi.util</name>
/// <project>
/// 	<name>Hemi JavaScript Framework</name>
/// 	<url-title>Hemi JavaScript Framework Project</url-title>
/// 	<url>/Hemi/</url>
/// </project>
///
/// <package>
///	<path>Hemi</path>
///	<library>Hemi</library>
///	<description>The utility class includes node and object help functions.</description>
///	<static-class>
///		<name>util</name>
///		<version>%FILE_VERSION%</version>
///		<description>Hemi framework utilities</description>
(function(){
	HemiEngine.namespace("util",HemiEngine,{
///		<method>
///			<name>getDate</name>
///			<param name = "i" type = "bit">Bit indicating whether to return the date as the time, or the date object.</param>
///			<return-value name = "d" type = "vDate">Returns the date</return-value>
///			<description>Returns the current date.</description>
///		</method>	
		getDate : function(i){
			var d = new Date();
			return i?d:d.getTime();
		},
///		<method>
///			<name>evaluateElementHandler</name>
///			<param name = "e" type = "Node">An XHTML Node.</param>
///			<param name = "h" type = "String">The name of an attribute that includes JavaScript.</param>
///			<description>Evaluates an attribute on an XHTML Node (e.g.: onclick)</description>
///		</method>	
		evaluateElementHandler:function(e,h){
			/* don't use shorthand for e.getAttribute, typeof == unknown will throw an error */
			if(DATATYPES.TO(e)&& typeof e.getAttribute != DATATYPES.TYPE_UNDEFINED && DATATYPES.TS(e.getAttribute(h))){
				try{
					eval(e.getAttribute(h));
				}
				catch(z){
					HemiEngine.logError("Error evaluating [element]." + h + ": " + (z.description?z.description:z.message));
				}
			}	
		},
	/// <method private = "1">
	/// <name>merge</name>
	/// <param name="o" type="object">Target object to merge features..</param>
	/// <param name="n" type="String">Name of merge features.</param>
	/// <param name="s" type="String">String representing merge features.</param>
	/// <return-value type = "String" name = "h">A hash of the specified value.</return-value>
	/// <description>Merges an internal object into the specified.</description>
	/// </method>
	///
		merge:function(o,n,s){
			/*
				o = object
				n = name
				s = string data
			*/
			HemiEngine.ClassImports[n] = s;
			HemiEngine._implements(o,n);
		},

///		<method>
///			<name>absorb</name>
///			<param name = "a" type = "array">Source array.</param>
///			<param name = "b" type = "array">Target array.</param>
///			<description>Copies the source array into the target array.</description>
///		</method>	
		absorb : function(a,b){
			var i = 0, l = a.length;
			for(;i<l;)
				b[b.length] = a[i++];
			
			
		}
	})
}());

/// </static-class>
/// </package>
/// </source>