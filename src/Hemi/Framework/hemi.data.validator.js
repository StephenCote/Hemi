
/// <source>
/// <name>Hemi.data.validator</name>
/// <project>
/// 	<name>Hemi JavaScript Framework</name>
/// 	<url-title>Hemi JavaScript Framework</url-title>
/// 	<url>/Hemi/</url>
/// </project>
///
/// <package>
///		<path>Hemi.data.validator</path>
///		<library>Hemi</library>
///		<description>The Data Validator service applies patterns defined by Data Validator Definitions, and may be used for Virtual Forms from the Data Form service to validate against field values whose nodes may or may not exist.</description>
/// <static-class>
///		<name>service</name>
///		<description>Static instance of XHTMLValidatorImpl.</description>
///		<version>%FILE_VERSION%</version>
/// </static-class>
/// <class>
///		<name>serviceImpl</name>
///		<description>A service for managing asynchronous and dependency-driven actions.</description>
///		<version>%FILE_VERSION%</version>
/// <example implementation = "1">
///		<name>Example Implementation</name>
///		<description>This is an example of using the validator service to validate a form field.</description>
///		<code><![CDATA[<input type = "text" id = "oText" value = "my@ email.com" />]]></code>
///		<code><![CDATA[<script type = "text/javascript">]]></code>
///		<code>   var oT = document.getElementById("oText");</code>
///		<code>   // validate oText against the "email-address pattern</code>
///		<code>   var bValid = Hemi.data.validator.service.validateField(oT,"email-address");</code>
///		<code>   // obtain the error text for the "email-address" pattern.</code>
///		<code>   var sE = Hemi.data.validator.service.getValidationErrorText("email-address");</code>
///		<code>}</code>
///		<code><![CDATA[</script>]]></code>
///	</example>

/*
	Author: Stephen W. Cote
	Email: wranlon@hotmail.com
	
	Copyright 2002, All Rights Reserved.
	
	Do not copy, archive, or distribute without prior written consent of the author.
*/

(function(){
	HemiEngine.namespace("data.validator", HemiEngine, {
		dependencies : ["hemi.data.validator.definitions"],
		service:null,
		serviceImpl:function(){
			
			var t = this,
				_x = HemiEngine.xml,
				_m = HemiEngine.message.service;

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
			
			t.properties = {
				p:0,
				l:0,
				a:0
			};

			t._getFieldValue=function(o){
				return t._queryFieldValue(o,null,0);
			};
			t._setFieldValue=function(o,v){
				return t._queryFieldValue(o,1,v);
			};

			t._queryFieldValue = function(o,q,v){
				/*
					o = field
					q = query type
					v = value
				*/
				var r;
				switch(o.type){
					case "checkbox":
						if(!q) r = "" + o.checked;
						else{
							r = v;
							o.checked = (v == "true" ? true : false);
						}
					break;
					case "select-one":
					case "textarea":
					case "password":
					case "text":
						if(!q) r = o.value;
						else r = o.value = v;
						break;
					/* unhandled field types return false; */
					default:
						HemiEngine.logWarning("Unhandled element: '" + o.type + "'");
						return 0;
						break;
				}
				return r;
			};
			t.getPattern = function(i){
				return HemiEngine.data.validator.definitions.service.objects.patterns[i];
			};

	///		<method>
	///			<name>getValidationErrorText</name>
	///			<param type = "variant" name = "o">DOM Node the defines a <i>pattern-id</i> attribute, or a String representing a pattern identifier.</param>
	///			<description>Returns the validation error text for the specified pattern id or based on the specified DOM Node.</description>
	///			<return-value name = "s" type = "String">Validation error text.</return-value>
	///		</method>		
			t.getValidationErrorText = function(o){
				var r,i,p;
				/*
					o = field
					r = ret value
					i = id
					p = pattern obj
				*/

				if(!DATATYPES.TO(o) && !DATATYPES.TS(o)){
					return "Invalid field reference";
				}	
			
				if(DATATYPES.TS(o)) i = o;
				else i = o.getAttribute("pattern-id");
			
				if(!i){
					return "Field doesn't define a validation pattern id";
				}
				
				p =  t.getPattern(i);
				if(!DATATYPES.TO(p)){
					return "Pattern id '" + i + "' is not a valid id.";
				}
				
				if(p.error) r = p.error;
				else r = "Undefined error for " + i;
				
				return r;
				
			};

	///		<method>
	///			<name>getIsWebSafe</name>
	///			<param type = "object" name = "o">DOM Node</param>
	///			<description>Returns true if the field value validates against the <i>web-safe</i> pattern.</description>
	///			<return-value name = "b" type = "boolean">Bit indicating whether the specified field value validated against the <i>web-safe</i> pattern.</return-value>
	///		</method>		
			t.getIsWebSafe = function(o){
				return t.validateField(o,"web-safe");
			};

	///		<method>
	///			<name>validateField</name>
	///			<param type = "variant" name = "o">DOM Node.  Any defined <i>pattern-id</i> attribute is used if a pattern id is not specified.</param>
	///			<param type = "String" name = "i" optional = "1">Pattern identifier.  If not specified, the DOM Node must define a <i>pattern-id</i>, or the field cannot be validated.</param>
	///			<description>Returns true if the field value validates against the specified pattern, and returns true if no pattern is specified; otherwise returns false.</description>
	///			<return-value name = "b" type = "boolean">Bit indicating whether the specified field value validated against the specified pattern.</return-value>
	///		</method>		
			t.validateField = function(o,i){
				/*
					o = field
					i = pid
				*/
			
				var r = 0,
					ir = 1,
					tir,
					pid = 0,
					po,
					v,
					c
				;

				/* return false if there is no object */
				if(!DATATYPES.TO(o)){
					_m.sendMessage("Invalid field reference in validateField.","200.4",1);
					return 0;
				}
				
				if(DATATYPES.TS(i)) pid = i;
				else pid = o.getAttribute("pattern-id");
			
				/* return true if there is no pattern-id */
				if(!pid){
					_m.sendMessage("Skipping empty pattern","200.1");
					return 1;
				}
				
				po = t.getPattern(pid);

				/* return false if the pattern_id was invalid/not loaded */
				if(!DATATYPES.TO(po)){
					_m.sendMessage("Pattern id '" + pid + "' is invalid in validateField.","200.4",1);
					return 0;
				}
			
				for(c = 0; c < po.include.length;c++){
					/*
						imported patterns only get applied when they return false and
						the current return value is true;
					*/
					tir = t.validateField(o,po.include[c]);
					if(ir && !tir) ir = 0;
				}
				
				v = t._getFieldValue(o);
				/*
					If the field value is 0, then the field type was not handled.
					This is not a bug, and 0 should be fine as an integer because field values will be 
					strings.
				*/
				/* check typeof == "number" because "" == 0*/
				if(DATATYPES.TN(v) && v == 0){
					return 1;
				}
				if(DATATYPES.TU(v)){
					_m.sendMessage("Value is undefined for " + n,"200.4",1);
					return 0;
				}
			
				if(po.match){
					try{
						re = new RegExp(po.match);
						switch(po.type){
							case "replace":
								r = 1;
								if(DATATYPES.TS(po.replace)){
									v = v.replace(re,po.replace);
									t._setFieldValue(o,v);
								}
								break;
							case "bool":
								HemiEngine.logDebug("Validating " + po.match + " against " + v);
								if(
									/*
										Obviously, an allow-null won't work if the validation
										pattern includes an import to a non-empty string.
									*/
									(po.allow_null && v.length == 0)
									||
									(v.match(re) != null ) == po.comp
								){
									r = 1;
								}
								break;
						}
					}
					catch(e){
						_m.sendMessage("Error in validator.validateField:: " + (e.description?e.description:e.message),"200.4",1);
					}
				}
				
				if(po.type == "none") r = 1;
				/*
					if the return value is true, but the include return value is false
					set the return value to false
				*/
				if(r && !ir) r = 0;
				
				return r;
			};

			HemiEngine._implements(t,"base_object","xhtml_validator","%FILE_VERSION%");
			HemiEngine.registry.service.addObject(t);
			t.ready_state = 4;

		}
	},1);
}());


/// </class>
/// </package>
/// </source>