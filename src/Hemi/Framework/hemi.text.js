/// <source>
/// <name>Hemi.text</name>
/// <project>
/// 	<name>Hemi JavaScript Framework</name>
/// 	<url-title>Hemi JavaScript Framework Project</url-title>
/// 	<url>/Hemi/</url>
/// </project>
///
/// <package>
///	<path>Hemi</path>
///	<library>Hemi</library>
///	<description>The text class includes Text node and String manipulation utilities.</description>
///	<static-class>
///		<name>text</name>
///		<version>%FILE_VERSION%</version>
///		<description>Hemi framework utilities</description>
(function(){
	HemiEngine.namespace("text",HemiEngine,{
///		<method>
///			<name>trim</name>
///			<param name = "sString" type = "String">Input text value.</param>
///			<return-value name = "sTrimmed" type = "String">Trimmed text value.</return-value>
///			<description>Trims whitespace from the beginning and end of the input string value.</description>
///		</method>	
		trim : function(s){
			if(typeof s != "string") return "";
			s = s.replace(/^\s*/gi,"");
			s = s.replace(/\s*$/gi,"");
			return s;
		},
		///		<method>
		///			<name>pad</name>
		///			<param name = "intVal" type = "int">Integer value</param>
		///			<param name = "lengthVal" type = "int">Length of the padded value</param>
		///			<return-value name = "sPadded" type = "String">A string representing the padded integer.</return-value>
		///			<description>Trims whitespace from the beginning and end of the input string value.</description>
		///		</method>	
		 pad : function(v,l){
			   var s = "" + v, a=[],i;
			   var a = [];
			   for(i = s.length; i < l;i++) a.push("0");
			   a.push(s);
			   return a.join("");
		}
	})
}());

/// </static-class>
/// </package>
/// </source>
