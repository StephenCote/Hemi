/// <source>
/// <name>Hemi.object</name>
/// <project>
/// 	<name>Hemi JavaScript Framework</name>
/// 	<url-title>Hemi JavaScript Framework</url-title>
/// 	<url>/Hemi/</url>
/// </project>
///
/// <package>
///	<path>Hemi</path>
///	<library>Hemi</library>
///	<description>The object utility class includes an API decorator for object mapping.</description>
///	<static-class>
///		<name>object</name>
///		<version>%FILE_VERSION%</version>
///		<description>Convenience methods for instrumenting object array mapping and retrieval.</description>

///		<example>
///			<description>Add an object accessor for conveniently storing and retrieving other objects.</description>
///			<name>Instrumentation Example</name>
///			<code>var oSomeObject = {};</code>
///			<code>// Instrument oSomeObject with the object accessor API</code>
///			<code>Hemi.object.addObjectAccessor(oSomeObject, "demo");</code>
///			<code>var oChildObject = {};</code>
///			<code>// Add the chid object as "child1"</code>
///			<code>oSomeObject.addNewDemo(oChildObject, "child1");</code>
///			<code>// Retrieve the object reference</code>
///			<code>var oLookup = oSomeObject.getDemoByName("child1");</code>
///		</example>

	/// <property type = "array" internal = "1" get = "1">
	/// <name>accessors</name>
	/// <description>An array of variant values.  The array is created for an object with <i>implementsObjectAccessor</i>, and is stored on the objects sub structure.</description>
	/// </property>

	/// <property type = "array" internal = "1" get = "1">
	/// <name>accessornames</name>
	/// <description>A hash of variant names whose value is the index of <i>accessors</i>.  The array is created for an object with <i>implementsObjectAccessor</i>, and is stored on the objects sub structure.</description>
	/// </property>
	
	/// <property type = "object" internal = "1" get = "1">
	/// <name>objects</name>
	/// <description>The objects property is used throughout the Hemi JavaScript Framework to store object pointers.  This property as created if it does not exist.</description>
	/// </property>

	/// <property type = "array" internal = "1" get = "1">
	/// <name>accessorindex</name>
	/// <description>A hash of variant identifiers whose value is the index of <i>accessors</i>.  The array is created for an object with <i>implementsObjectAccessor</i>, and is stored on the objects sub structure.</description>
	/// </property>

	/// <method internal = "1">
	/// <name>isAccessor</name>
	/// <parameter name = "v" type = "variant">Int or string used to determine if accessor exists.</parameter>
	/// <return-value name = "b" type = "boolean">Bit indicating whether the accessor exists.</return-value>
	/// <description>Returns true if the accessor exists.  The method is created for an object with <i>implementsObjectAccessor</i>.</description>
	/// </method>

	/// <method internal = "1">
	/// <name>getAccessor</name>
	/// <parameter name = "i" type = "int">Index of the accessor.</parameter>
	/// <return-value name = "v" type = "variant">The value of the accessor.</return-value>
	/// <description>Returns the accessor for the given index.  The method is created for an object with <i>implementsObjectAccessor</i>.</description>
	/// </method>
	
	/// <method internal = "1">
	/// <name>addNewAccessor</name>
	/// <parameter name = "o" type = "object">Object to add to the accessor array.</parameter>
	/// <parameter name = "i" type = "String">Identifier of the object.</parameter>
	/// <return-value name = "b" type = "boolean">Bit indicating whether the object was added.</return-value>
	/// <description>Adds the object to the accessor array.</description>
	/// </method>
	
	/// <method internal = "1">
	/// <name>clearAccessors</name>
	/// <description>Clears all arrays and array maps.</description>
	/// </method>
	
	/// <method internal = "1">
	/// <name>removeAccessor</name>
	/// <parameter name = "o" type = "object">Object that is stored in the accessor array.</parameter>
	/// <description>Removes the specified object from the accessor arrays.</description>
	/// </method>


	/// <method internal = "1">
	/// <name>getAccessorByName</name>
	/// <parameter name = "s" type = "String">Name of the value</parameter>
	/// <return-value name = "v" type = "variant">The value of the accessor.</return-value>
	/// <description>Returns the accessor based on the specified name.  The method is created for an object with <i>implementsObjectAccessor</i>.</description>
	/// </method>

	/// <method internal = "1">
	/// <name>getAccessors</name>
	/// <return-value name = "a" type = "array">The accessor array.</return-value>
	/// <description>Returns the accessors array.  The method is created for an object with <i>implementsObjectAccessor</i>.</description>
	/// </method>

	/// <method internal = "1">
	/// <name>addObjectAccessor</name>
	/// <param name="o" type="object">Object for which the accessors will be created.</param>
	/// <param name="s" type="String">Name of the accessor.</param>
	/// <return-value type = "boolean" name = "b">Returns true if the accessors were created.</return-value>
	/// <description>Creates object accessors, <b>get<i>Accessor</i>ByName</b>, <b>get<i>Accessor</i></b>, <b>get<i>Accessor</i>s</b>, and <b>is<i>Accessor</i></b> methods, and the <b><i>Accessor</i>s</b>, <b><i>Accessor</i>names</b>, and <b><i>Accessor</i>index</b> arrays on the <i>objects</i> sub structure.  It is up to the implementing class to specify the property values jointly in order for the method values to resolve.</description>
	/// </method>
    ///

    /// <method internal = "1">
    /// <name>addObjectDeconstructor</name>
    /// <param name="o" type="object">Registered object for which the deconstructors will be created.</param>
    /// <return-value type = "boolean" name = "b">Returns true if the accessors were created.</return-value>
    /// <description>Creates the deconstructors <i>sigterm</i> and <i>destroy</i>.</description>
    /// </method>
    ///
(function () {
    HemiEngine.namespace("object", HemiEngine, {
      
        addObjectDeconstructor: function (o) {
            /// Object must be a registered framework object
            ///
            if (!HemiEngine.registry.service.isRegistered(o)) return 0;

            ///		<method internal = "1">
            ///			<name>sigterm</name>
            ///			<description>Sends a termination signal to the object.   This automatically invokes the destroy method.  The method is created for an object with <i>addObjectDeconstructor</i>.</description>
            ///		</method>
            o.sigterm = function () {
                this.destroy();
            };
            ///		<method internal = "1">
            ///			<name>destroy</name>
            ///			<description>Prepares the object to be destroyed.  As a decoration, this method invokes any locally defined <i>handle_destroy</i> handler and increments the internal <i>ready_state</i> to five (5).   The method is created for an object with <i>addObjectDeconstructor</i>.</description>
            ///		</method>
            o.destroy = function () {
                var t = this, v;
                if (t.ready_state < 5) {
                    if (typeof t.object_destroy == DATATYPES.TYPE_FUNCTION) t.object_destroy();
                    t.ready_state = 5;
                    /*
                        It is up to the object to remove itself from the registry
                        This raises the 'onremoveobject' message for this object.
                    */
                    HemiEngine.registry.service.removeObject(t);

                    /* cleanup pointers */
                    v = t.objects;
                    Object.keys(v).forEach(i => delete v[i]);
 
                    /* cleanup properties */
                    v = t.properties;
                    Object.keys(v).forEach(i => delete v[i]);
                }
            };
        },
        addObjectAccessor: function (o, s) {
            if (!DATATYPES.TO(o)) {
                alert("Invalid object reference");
                return 0;
            }
            if (!DATATYPES.TO(o.objects)) o.objects = {};
            var b = o.objects, nk = s + "Names",k = s + "s", ik = s + "Index";
            b[s + "s"] = [];
            b[nk] = [];
            b[ik] = [];
            var 
				s_name = s.substring(0, 1).toUpperCase() + s.substring(1, s.length),
				f
			;

            o["get" + s_name + "ByName"] = function(n){
				var c = this.objects;
				if(typeof c[nk][n]==DATATYPES.TYPE_NUMBER) return c[k][c[nk][n]];
				return 0;
            };
            o["clear" + s_name + "s"] = function(o){
            	var _p = this.objects;
            	_p[k] = [];
            	_p[nk] = [];
            	_p[ik] = [];
            	return 1;
            };
            o["remove" + s_name] = function(o){
            	var _p = this.objects,i;
            	if(!DATATYPES.TO(o) || !DATATYPES.TN(o.access_index)) return 0;
            	delete _p[k][o.access_index];
            	delete _p[ik][o.object_id];
            	delete _p[nk][o.access_name];
            	return 1;
            };
            o["addNew" + s_name] = function(o, n, i){
            	var _p = b,l;
            	if(!i){
            		if(!o.object_id) o.object_id = HemiEngine.guid();
            		i = o.object_id;
            	}
            	if(this["is" + s_name](n)) return 0;
            	l = _p[k].length;
            	_p[k][l] = o;
            	_p[ik][i] = l;
            	_p[nk][n] = l;
            	o.access_index = l;
            	o.access_name = n;
            	return 1;
            };
            o["get" + s_name] = function(i){
            	if(typeof b[ik][i] == DATATYPES.TYPE_NUMBER && typeof b[k][b[ik][i]] == DATATYPES.TYPE_OBJECT){
            		return b[k][b[ik][i]];
            	}
            	return 0;
            };
            o["get" + s_name + "s"] = function(){
            	return b[k];
            };

            o["is" + s_name] = eval(
				'f = function(o){var _p = this.objects;if(typeof o == DATATYPES.TYPE_STRING){if(this.get' + s_name + 'ByName(o)) return 1;return 0;}if(typeof o==DATATYPES.TYPE_OBJECT&&o!=null&&typeof _p.' + s + 'Index[o.' + s + '_id] == DATATYPES.TYPE_NUMBER&&typeof _p.' + s + 's[_p.' + s + 'Index[o.' + s + '_id]] == DATATYPES.TYPE_OBJECT){return 1;}return 0;};'
			);
            return 1;
        }
    });
} ());
/// </static-class>
/// </package>
/// </source>