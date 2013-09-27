/// <source>
/// <name>Hemi.data.validator.definitions</name>
/// <project>
/// 	<name>Hemi JavaScript Framework</name>
/// 	<url-title>Hemi JavaScript Framework Project</url-title>
/// 	<url>/Hemi/</url>
/// </project>
///
/// <package>
///	<path>Hemi.data.validator.definitions</path>
///	<library>Hemi</library>
///		<description>Data Validator Definitions define validation patterns for verifying form field and custom control (e.g.: Hemi.ui.wideselect) input matches expected patterns and allowable characters.  Patterns may be chained together and defined with a meaningful description for end users.</description>
(function(){
	HemiEngine.namespace("data.validator.definitions",HemiEngine,{
		///	<static-class>
		///		<name>service</name>
		///		<version>%FILE_VERSION%</version>
		///		<description>Static implementation of hemi.data.validator.definitions.serviceImpl</description>
		///	</static-class>
		service : null,
		///	<class>
		///		<name>service</name>
		///		<version>%FILE_VERSION%</version>
		///		<description>This service defines validation patterns for use by the Hemi Data Form Service.</description>

		serviceImpl : function(){
			var t = this;
			t.objects = {
				patterns : []
			};
			/// <method>
			/// 	<name>addNewPattern</name>
			///		<param name="sId" type="String">Validation pattern id.</param>
			///		<param name="sType" type="String">The type of validation: bool, replace, or none.</param>
			///		<param name="sComp" type="String" optional = "1">For validation type of bool, the comparison value may be "true" or "false".</param>
			///		<param name="sMatch" type="String">Regular expression to use to match the input value.</param>
			///		<param name="sReplace" type="String" optional = "1">Replacement value to use for the matched expression.</param>
			///		<param name="bNull" type="boolean" optional = "1">Bit indicating whether null values are allowed.</param>
			///		<param name="sError" type="String" optional = "1">Error message to describe the expected pattern. e.g.: Phone numbers should be numbers and hyphens only.</param>
			///		<param name="aIncludes" type="array" optional = "1">Array of pattern ids that should be executed prior to this pattern. e.g.: The trim-ends pattern has a comparison of none and includes the trim-start and trim-end patterns.</param>
			/// 	<return-value type = "object" name = "object">A new internal space definition.</return-value>
			/// 	<description>Creates a new implementation definition.  An implementation definition maps a node name to a specified constructor.</description>
			/// </method>
			t.addNewPattern = function(i, t, c, m, r, n, e, a){
				var v = this.newPattern(i, t, c, m, r, n, e);
				if(DATATYPES.TO(a)) v.include = a;
				this.objects.patterns[i] = v;
				return v;
			};
            t.newPattern = function (i, t, c, m, r, n, e) {
				var v = {
					id:i,
					type:t,
					comp:(c)?true:false,
					allow_null:(n)?true:false,
					match:m,
					replace:r,
					error:e,
					include:[]
				};
				return v;
			};
			t.addNewPattern("not-empty", "bool", "true", "\\S", 0, 0,"Value cannot be an empty string.",["trim-ends"]);
			t.addNewPattern("email-address", "bool", "true", "^([a-zA-Z0-9._\\-\\+]+@[a-zA-Z0-9._\\-]+\\.[a-zA-Z0-9._\\-]+)", 0, 0,"Unexpected format of email address.",["trim-ends"]);
			t.addNewPattern("money", "bool", "true", "\\d\\.", 0, 0,"Expected format is: \"##\" or \"##.##\"  No spaces, parenthesis, letters, or hyphens.",["trim-ends","not-empty"]);
			t.addNewPattern("phone-number", "bool", "true", "\\d*", 0, 0,"Expected format is: \"##########\".  No spaces, parenthesis, or hyphens.",["trim-ends","not-empty"]);
			t.addNewPattern("numbers-only", "bool", "true", "[\\.\\d]+", 0, 0,"Invalid characters.  Numbers only.",["trim-ends","not-empty"]);
			t.addNewPattern("web-safe", "bool", "false", "[^a-zA-Z0-9._\\-\\+'\\(\\)\\]\\[\\)\\(\\/\\{\\}\\s,\\?!:~#@&;%]", 0, 0,"Invalid characters.  Use only standard (not extended) ASCII characters.");
			t.addNewPattern("web-url", "bool", "true", "^(http|https)(:\\/{2}[\\w]+)([\\/|\\.]?)([\\S]*)", 0, 1,"Expected format is (http | https)://[domain]([path/] | [file]).",["trim-ends"]);
			t.addNewPattern("trim-begin", "replace", 0, "^\\s*", "", 0,0);
			t.addNewPattern("trim-end", "replace", 0, "\\s*$", "", 0,0);
			t.addNewPattern("trim-ends", "none", 0, 0, "", 0,0,["trim-begin","trim-end"]);

		}
	},1);
}());
/// </class>
/// </package>
/// </source>