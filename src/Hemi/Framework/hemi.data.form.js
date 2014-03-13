/// <source>
/// <name>Hemi.data.form</name>
/// <project>
/// 	<name>Hemi JavaScript Framework</name>
/// 	<url-title>Hemi JavaScript Framework</url-title>
/// 	<url>/Hemi/</url>
/// </project>
///
/// <package>
///		<path>Hemi.data.form</path>
/// 	<library>Hemi</library>
///		<description>The Form Service is used to represent form elements in a Virtual Form instead of a traditional HTML Form collection.  Virtual Forms track values whether or not the backing element exists (or is rendered), and Virtual Form Elements may be aggregated as desired.  With Application Spaces, Virtual Forms are aggregated at the space level.</description>
///		<class>
///			<name>XHTMLFormElement</name>
///			<description>An internal representation of a form element.</description>
///			<version>%FILE_VERSION%</version>
///			<method>
///				<name>getType</name>
///				<return-value type = "String" name = "t">The type of form element.</return-value>
///				<description>Returns the type of form element.</description>
///			</method>
///			<method>
///				<name>getIsRendered</name>
///				<return-value type = "boolean" name = "b">Bit indicating whether the element is rendered.</return-value>
///				<description>Returns true if the form elemnet is rendered.</description>
///			</method>
///			<method>
///				<name>getName</name>
///				<return-value type = "String" name = "t">The name of form element.</return-value>
///				<description>Returns the name of form element.</description>
///			</method>
///			<method>
///				<name>getValue</name>
///				<return-value type = "String" name = "t">The value of form element.</return-value>
///				<description>Returns the value of form element.</description>
///			</method>
///			<method>
///				<name>getObjectId</name>
///				<return-value type = "String" name = "i">The id of the XHTMLComponent.</return-value>
///				<description>Returns the id of the underlying XHTMLComponent</description>
///			</method>
///			<method>
///				<name>getReferenceId</name>
///				<return-value type = "String" name = "i">The id of the reference implementor.</return-value>
///				<description>Returns the id of the reference implementor, such as an Engine object.</description>
///			</method>
///			<method>
///				<name>getElement</name>
///				<return-value type = "object" name = "o">HTML Form Element</return-value>
///				<description>Returns the rendered HTML Form Element.</description>
///			</method>
///		</class>
						
///		<class>
///			<name>XHTMLForm</name>
///			<description>An internal representation of a form within the framework.</description>
///			<version>%FILE_VERSION%</version>
///				<method>
/// 			<name>isElement</name>
/// 			<param name = "i" type = "variant">Name or index of the XHTMLFormElement object.</param>
/// 			<return-value name = "b" type = "boolean">Bit indicating whether the specified object name exists.</return-value>
/// 			<description>Returns true if the specified name exists.</description>
/// 			</method>
/// 			<method>
/// 			<name>getElements</name>
/// 			<return-value name = "a" type = "array">Array of XHTMLFormElement objects.</return-value>
/// 			<description>Returns an array of XHTMLFormElement objects.</description>
///				 </method>
/// 			<method>
/// 			<name>getElement</name>
/// 			<param name = "i" type = "int">Index of the XHTMLFormElement object..</param>
/// 			<return-value name = "e" type = "XHTMLFormElement">XHTMLFormElement object.</return-value>
/// 			<description>Returns the specified XHTMLFormElement object.</description>
/// 			</method>
///				 <method>
/// 			<name>getElementByName</name>
/// 			<param name = "n" type = "String">Name of the element.</param>
/// 			<return-value name = "e" type = "XHTMLFormElement">XHTMLFormElement object.</return-value>
/// 			<description>Returns the specified XHTMLFormElement object.</description>
/// 			</method>
///		</class>
///		<static-class>
///			<name>service</name>
///			<version>%FILE_VERSION%</version>
///			<description>Static implementation of serviceImpl.</description>
///		</static-class>
///		<class>
///			<name>serviceImpl</name>
///			<version>%FILE_VERSION%</version>
///			<description>Manage collection of form elements used within Engine and XHTMLComponent contexts.</description>
///  <example>
///    <name><![CDATA[Virtual Form Example #1]]></name>
///    <description><![CDATA[This example shows how a form field, bound as an XHTMLComponent, is virtualized through XHTMLFormComponent.  This allows the form value to persist in a virtual form even though the node no longer exists.]]></description>
///    <code><![CDATA[<!-- HTML Source -->]]></code>
///    <code><![CDATA[<div id = "oFields">]]></code>
///    <code><![CDATA[  <input type = "text" id = "oText" value = "example text" />]]></code>
///    <code><![CDATA[  <input type = "button" value = "Destroy the text field" onclick = "testXhtmlDestroy()" />]]></code>
///    <code><![CDATA[</div>]]></code>
///    <code><![CDATA[]]></code>
///    <code><![CDATA[<!-- Script Source -->]]></code>
///    <code><![CDATA[window.onload = testXhtml;]]></code>
///    <code><![CDATA[var oX;]]></code>
///    <code><![CDATA[function testXhtml(){]]></code>
///    <code><![CDATA[  var oForm = Hemi.data.form.service;]]></code>
///    <code><![CDATA[  var o = document.getElementById("oText");]]></code>
///    <code><![CDATA[  /// Up-bind the component with the service]]></code>
///    <code><![CDATA[  /// Name the component 'My Text']]></code>
///    <code><![CDATA[  /// And identify its form as 'MyForm']]></code>
///    <code><![CDATA[  /// The HTML form it is in doesn't matter.]]></code>
///    <code><![CDATA[  /// ]]></code>
///    <code><![CDATA[  oX = Hemi.object.xhtml.newInstance(o,1,"My Text","MyForm",oForm,0,0);]]></code>
///    <code><![CDATA[  oX.post_init();]]></code>
///    <code><![CDATA[}]]></code>
///    <code><![CDATA[function testXhtmlDestroy(){]]></code>
///    <code><![CDATA[]]></code>
///    <code><![CDATA[  // Destroy the component]]></code>
///    <code><![CDATA[  // And throw away the input field]]></code>
///    <code><![CDATA[  // This will automatically syncronize the field value]]></code>
///    <code><![CDATA[  //]]></code>
///    <code><![CDATA[  oX.destroy();]]></code>
///    <code><![CDATA[  oX = null;]]></code>
///    <code><![CDATA[  document.getElementById("oFields").innerHTML = ]]></code>
///    <code><![CDATA[  	"<input type = \"button\" value = \"Retrieve the form\" onclick = \"testXhtmlRecover()\" />";]]></code>
///    <code><![CDATA[}]]></code>
///    <code><![CDATA[function testXhtmlRecover(){]]></code>
///    <code><![CDATA[  document.getElementById("oFields").innerHTML = "";]]></code>
///    <code><![CDATA[  ]]></code>
///    <code><![CDATA[  // And, make another field]]></code>
///    <code><![CDATA[  //]]></code>
///    <code><![CDATA[  var oI = document.createElement("input");]]></code>
///    <code><![CDATA[  oI.type = "text";]]></code>
///    <code><![CDATA[  oI.style.border = "2px solid #FF0000";]]></code>
///    <code><![CDATA[  document.getElementById("oFields").appendChild(oI);]]></code>
///    <code><![CDATA[  ]]></code>
///    <code><![CDATA[  // Make another component]]></code>
///    <code><![CDATA[  //]]></code>
///    <code><![CDATA[  var oForm = Hemi.data.form.service;]]></code>
///    <code><![CDATA[  var oX = Hemi.object.xhtml.newInstance(oI,1,"My Text","MyForm",oForm,0,0);]]></code>
///    <code><![CDATA[  oX.post_init();]]></code>
///    <code><![CDATA[}]]></code>
///  </example>
/*
	Author: Stephen W. Cote
	Email: wranlon@hotmail.com
	
	Copyright 2002, All Rights Reserved.
	
	Do not copy, archive, or distribute without prior written consent of the author.
*/

/*
	BUG 02/10/2003
		components aren't synchronized while visible, so a call to getValue returns no value
		Components should be syrchronized when getValue is called.
		
		Also, add a getXElement method, with the same stipulation as above regarding synchronization.
*/


(function () {
    HemiEngine.include("hemi.object");
    HemiEngine.namespace("data.form", HemiEngine, {
        service: 0,
        serviceImpl: function () {


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


            var t = this,
				_x = HemiEngine.xml,
				_m = HemiEngine.message.service
			;
            t.objects = {
                fn: ["hidden", "text", "password", "textarea", "select-multiple", "select-one", "checkbox"]
            };
            t.properties = {
                a: 1,
                l: "hemi.data.form"
            };

            /// <method>
            /// <name>isFieldNode</name>
            /// <param name = "n" type = "variant">Name or object of a node.</param>
            /// <return-value name = "bField" type = "boolean">Bit indicating whether the node is recognized by the form service.</return-value>
            /// <description>Returns a bit indicating whether the specified field matches a predefined list of recognizable fields or custom components.</description>
            /// </method>
            ///
            t.isFieldNode = function (n) {
                var y = 0;
                if (DATATYPES.TO(n)) {
                    y = n.type;
                    n = n.nodeName;
                }
                var b = 0;
                for (var i = 0; i < this.objects.fn.length; i++) {
                    if ((y && this.objects.fn[i] == y.toLowerCase()) || this.objects.fn[i] == n.toLowerCase()) {
                        b = 1;
                        break;
                    }
                }
                return b;
            };
            /*
            Returns the visible/active elements for the specified form index
            */
            /// <method>
            /// <name>getElements</name>
            /// <param name = "i" type = "int" optional = "1">Index identifying a form.</param>
            /// <return-value name = "a" type = "array">Array of visible or active form elements.</return-value>
            /// <description>Returns an array of visible or active form elements.</description>
            /// </method>
            ///
            t.getElements = function (fi) {
                if (DATATYPES.TU(fi)) fi = t.properties.l;

                var f = t.getFormByName(fi), a, r = [], c = 0, i;
                if (!f) {
                    _m.sendMessage("Invalid form reference '" + fi + "'", "200.4");


                    return 0;

                }


                a = f.getElements();
                for (i = 0; i < a.length; i++) {
                    if (a[i] && a[i].r) r[c++] = a[i];
                }

                return r;
            };

            /// <method>
            /// <name>resetAll</name>
            /// <description>Clears all forms and form hashmaps data and pointers.</description>
            /// </method>
            ///
            t.resetAll = function () {
                this.clearForms();
            };

            /// <method>
            /// <name>resetDataForm</name>
            /// <param name = "i" type = "int" optional = "1">Index identifying a form.</param>
            /// <param name = "q" type = "boolean" optional = "1">Bit indicating whether the form should be reset to the default value instead of the previous value.</param>
            /// <return-value name = "b" type = "boolean">Returns true if the form was reset, false otherwise.</return-value>
            /// <description>Resets the specified form elements to either their default state or their previous state.</description>
            /// </method>
            ///
            t.resetDataForm = function (fi, q) {
                /*
                fi = form index
                q = recover form; reset back to default value as opposed to reset to previous value
                */
                return t.clearDataForm(fi, 1, q);
            };

            /// <method>
            /// <name>clearDataForm</name>
            /// <param name = "i" type = "int" optional = "1">Index identifying a form.</param>
            /// <param name = "b" type = "boolean" optional = "1">Bit indicating whether the form should be reset.</param>
            /// <param name = "q" type = "boolean" optional = "1">Bit indicating whether the form should be reset to the default value instead of the previous value.</param>
            /// <return-value name = "b" type = "boolean">Returns true if the form was reset, false otherwise.</return-value>
            /// <description>Clears or resets the specified form elements.</description>
            /// </method>
            ///
            t.clearDataForm = function (fi, b, q) {
                /*
                fi = form id
                b = reset-switch
                q = recover form - b must be true
                */
                var _p = t.objects, f, o, i, a, y, z;

                /* use base label if no form index is provided */
                if (DATATYPES.TU(fi)) fi = t.properties.l;

                f = t.getFormByName(fi);
                if (!f) {
                    _m.sendMessage("Invalid form reference '" + fi + "'", "200.4");


                    return 0;

                }


                a = f.getElements();
                for (i = 0; i < a.length; i++) {
                    o = a[i];
                    /* Reset */
                    if (o.e && b) {
                        z = HemiEngine.registry.service.getObject(o.object_id);
                        if (z)
                            t.synchronizeComponent(z, 1, 0, q);

                    }
                    /* clear */
                    else if (o.e) {
                        switch (o.t) {
                            case "hidden":
                            case "text":
                            case "password":

                            case "textarea":
                                o.e.value = "";
                                break;
                            case "select-multiple":
                                o.e.selectedIndex = -1;
                                break;
                            case "select-one":
                                o.e.selectedIndex = -1;
                                break;
                            case "checkbox":
                                o.e.checked = false;
                                break;
                        }
                    }
                }
                return 1;
            };

            /// <method>
            /// <name>getElement</name>
            /// <param name = "n" type = "String">String identifying the name of the XHTMLFormElement object.</param>
            /// <param name = "i" type = "int" optional = "1">Index identifying a XHTMLForm.</param>
            /// <return-value name = "o" type = "DOMNode">HTML Form Field Node.</return-value>
            /// <description>Returns the HTML Node corresponding to the specified name and form index.</description>
            /// </method>
            ///
            t.getElement = function (n, fi) {
                var o = t.getXElement(n, fi);
                /*
                Object doesn't exist, or object isn't rendered
                */
                if (!o || !o.r) return 0;
                return o.e;

            };

            /// <method>
            /// <name>getXElement</name>
            /// <param name = "n" type = "String">String identifying the name of the XHTMLFormElement object.</param>
            /// <param name = "i" type = "int" optional = "1">Index identifying a XHTMLForm.</param>
            /// <return-value name = "o" type = "XHTMLFormElement">XHTMLFormElement object.</return-value>
            /// <description>Returns the XHTMLFormElement object corresponding to the specified name and form index.</description>
            /// </method>
            ///
            t.getXElement = function (n, fi) {
                var _p = t.objects, f;

                if (DATATYPES.TU(fi == DATATYPES.TYPE_UNDEFINED)) fi = t.properties.l;
                f = t.getFormByName(fi);

                if (f) return f.getElementByName(n);


                _m.sendMessage("Invalid form reference '" + fi + "' for '" + n + "'", "200.4");


                return 0;
            };


            /// <method>
            /// <name>getValue</name>
            /// <param name = "n" type = "String">String identifying the name of the XHTMLFormElement object.</param>
            /// <param name = "i" type = "int" optional = "1">Index identifying a XHTMLForm.</param>
            /// <return-value name = "v" type = "variant">The value of the XHTMLFormElement.</return-value>
            /// <description>Returns the value of the XHTMLFormElement.  Checkbox values are bit, and multi-selects are arrays of selected values.</description>
            /// </method>
            ///
            t.getValue = function (n, fi) {
                var o = t.getXElement(n, fi), a = [], i = 0;
                if (o) {

                    /* if the element is rendered, perform a synchronize prior to retrieving value */
                    if (o.r) t.synchronizeComponent(HemiEngine.registry.service.getObject(o.object_id), 0, 1);
                    if (!DATATYPES.TO(o.v))
                        return o.v;

                    else if (o.v instanceof Array) {
                        for (; i < o.v.length; ) a.push(o.v[i++].value);
                        return a.join(",");
                    }
                    else
                        return o.v.value;

                }


                _m.sendMessage("Invalid element reference '" + n + "'", "200.4");


                return 0;
            };

            /// <method>
            /// <name>getValue</name>
            /// <param name = "n" type = "String">String identifying the name of the XHTMLFormElement object.</param>
            /// <param name = "v" type = "variant">Value of the XHTMLFormElement</param>
            /// <param name = "i" type = "int" optional = "1">Index identifying a XHTMLForm.</param>
            /// <return-value name = "b" type = "boolean">Bit indicating whether the value was set.</return-value>
            /// <description>Sets the value of the specified XHTMLFormElement.</description>
            /// </method>
            ///
            t.setValue = function (n, v, fi) {
                var o = t.getXElement(n, fi);
                if (o) {
                    o.v = v;
                    if (o.r) t.synchronizeComponent(HemiEngine.registry.service.getObject(o.object_id), 1, 1);
                    return 1;
                };
                return 0;
            };

            /// <method internal = "1">
            /// <name>synchronizeComponent</name>
            /// <param name = "x" type = "XHTMLComponent">XHTMLComponent object representing an HTML Form Element.</param>
            /// <param name = "b" type = "boolean" optional = "1">Bit indicating whether this is a sync-in or sync-out operation.</param>
            /// <param name = "l" type = "boolean" optional = "1">Bit indicating whether the XHTLMFormElement should be linked to the rendered HTML Form Field.</param>
            /// <param name = "q" type = "boolean" optional = "1">Bit indicating whether the field should be reset to the default value before synchronizing.</param>
            /// <param name = "s" type = "variant" optional = "1">Default value to set on the field</param>
            /// <return-value name = "o" type = "boolean">Bit indicating whether the field was synchronized.</return-value>
            /// <description>Synchronizes the XHTMLFormElement, XHTMLComponent, and the rendered HTML Field.</description>
            /// </method>
            ///
            t.synchronizeComponent = function (x, b, l, q, s) {
                /*
                x = XHTMLComponent
                b = sync-in/sync-out
                l = set-link
                q = reset to default value before synchronizing; should be used when b is true
                s = set default value
                */
                if (!x) {
                    _m.sendMessage("Invalid Component reference", "200.4");
                    return 0;
                }

                var o, fi, f, _s = t.properties, z, y, i, a, c, e, j = x.properties.cid, w, v;
                /* use default label if no label is specified */
                if (!(fi = x.properties.rid)) fi = _s.l;

                if (!(f = t.getFormByName(fi))) {
                    _m.sendMessage("Invalid form reference '" + fi + "' in synchronizeComponent", "200.4");
                    return 0;
                }
                c = x.getContainer();
                /// o == internal form element construct
                ///
                o = f.getElementByName(j);
                if (!o) {
                    _m.sendMessage("Object is not registered with the XHTMLFormComponent.", "200.1");
                    return;
                }

                /// If binding is specified, retrieve the object
                ///

                if (o.b){
                	w = HemiEngine.registry.service.getObject(o.b);
                	if(!w){
                		_m.sendMessage("Object binding no longer exists for id " + o.b, "200.2");
                		return;
                	}
                	if(w.bind) w = w.bind;
                }
					/*
                    Hemi.log("Synchronize " + (b ? "In ":"Out ") + o.b);
                    alert(o.b + ":" + w);
                    (fi == _s.l ? HemiEngine.registry.service.getObject(o.b) : (HemiEngine.lookup("hemi.app.space") ? HemiEngine.app.space.service.getSpace(fi).getSpaceObjectByName(o.b) : 0));
                    if (w && w.object) w = w.object;
					*/

                /* if (o.b) alert(x.properties.cid + ":" + o.b + ":" + w); */
                /// If synchronizing in and the reset bit is set,
                /// Restore the default value.
                if (b && q) o.v = o.d;

                switch (o.t) {
                    case "checkbox":
                        if (!b) {
                            if (w) w[j] = c.checked;
                            o.v = c.checked;
                        }
                        else c.checked = (w ? w[j] : o.v);
                        break;
                    case "hidden":
                    case "password":
                    case "date":
                    case "text":
                    case "textarea":
                        if (!b) {
                            o.v = c.value;
                            if (w){
                            	if(w[j] instanceof Date){
                            		w[j] = new Date(c.value);
                            		/// alert("in: " + j + ":" + w[j]);
                            	}
                            	else{

                            		w[j] = c.value;
                            	}
                            }
                        }

                        else{
                        	if(w && (w[j] instanceof Date)){
                        		/// alert("in: " + j + ":" + w[j]);
                        		c.value = (w[j].getMonth() + 1) + "/" + w[j].getDate() + "/" + w[j].getFullYear();
                        	}
                        	else{
                        		c.value = (w ? w[j] : o.v);
                        	}
                        }
                        
                        /// if (w) alert(b + ":" + j + ":" + w[j]);
                        break;
                    case "select-multiple":
                        if (!b) {
                            o.v = [];
                            if (w) w[j] = [];
                            a = c.options;
                            for (i = 0; i < a.length; i++) {
                                if (a[i].selected) {
                                    v = (a[i].value ? a[i].value : a[i].text);
                                    o.v.push({ 'i': i, 'value': v, 'text': a[i].text });
                                    if (w) w[j].push(v);
                                }
                            }
                        }
                        else {
                            if (DATATYPES.TO(o.v) && DATATYPES.TN(o.v.length) && c.options.length >= o.v.length) {
                                a = c.options;
                                for (i = 0; i < o.v.length; i++)
                                    a[o.v[i].i].selected = 1;

                            }
                        }
                        break;
                    case "select-one":
                        if (!b) {
                            z = c.selectedIndex;
                            if (z > -1) {
                                y = c.options[z];
                                o.v = { i: z, value: (y.value ? y.value : y.text), text: y.text };
                                if (w) w[j] = o.v.value;
                            }
                        }
                        else {
                            if (DATATYPES.TO(o.v) && DATATYPES.TN(o.v.i) && c.options.length > o.v.i)
                                c.value = o.v.value;
                           if(w) c.value = w[j];
                            /// c.selectedIndex = o.v.i;

                        }
                        break;
                    case "wideselect":
                        if (!b) {
                            y = x.getApplicationComponent();
                            z = y.getSelectedIndex();
                            if (z > -1) {
                                o.v = { i: z, value: y.getSelectedValue(), text: y.getSelectedText() };
                            }
                            else {
                                if (DATATYPES.TO(o.v) && DATATYPES.TN(o.v.i) && y.getItemSize() > o.v.i) {
                                    y.selectItem(o.v.i);
                                }
                            }
                        }
                        break;

                    default:

                        _m.sendMessage("Unhandled form field type '" + o.t + "'", "200.1");

                        break;
                } /* End Switch */

                if (!b && !l) {
                    if (_s.a) t.validate(o.n, 0, fi);

                    o.e = 0;
                    o.object_id = 0;
                    o.r = 0;
                }
                else {
                    o.e = x.getContainer();
                    o.object_id = x.object_id;
                    o.r = 1;
                }


                _m.sendMessage("Synchronize " + (b ? "in" : "out") + " '" + o.n + "'", "200.1");
                Hemi.message.service.publish("onsynchronizevalue", x);

            };

            /// <method>
            /// <name>removeDataForm</name>
            /// <param name = "v" type = "variant">Name, index, or object representing the XHTMLForm object.</param>
            /// <return-value name = "b" type = "boolean">Bit whether the form was removed.</return-value>
            /// <description>Removes the XHTMLForm object.</description>
            /// </method>
            ///
            t.removeDataForm = function (v) {
                var o, _p = this.objects, i = 0, e, _f;
                if (DATATYPES.TO(v)) o = v;
                else if (DATATYPES.TS(v)) o = t.getFormByName(v);
                if (!o) return 0;
                _f = o.objects;
                this.removeForm(o);


                for (; i < _f.elements.length; ) {
                    e = _f.elements[i++];
                    if(!e) continue;
                    
                    /// Clear out the object pointers
                    /// 
                    e.v = 0;
                    e.d = 0;
                    e.e = 0;

                }

                o.clearElements();

                return 1;

            };

            /// <method>
            /// <name>addComponent</name>
            /// <param name = "x" type = "XHTMLComponent">XHTMLComponent object representing an HTML Form Element.</param>
            /// <param name = "ri" type = "String" optional = "1">Reference id for field containment.</param>
            /// <param name = "bi" type = "String" optional = "1">Binding id.</param>
            /// <return-value name = "b" type = "boolean">Bit indicating whether the component was added.</return-value>
            /// <description>Adds an XHTMLComponent, creating a new XHTMLFormElement that can synchronize and retain data whether or not the HTML Form Element continues to exist.</description>
            /// </method>
            ///
            t.addComponent = function (o, ri, bi) {
                /*
                o = XHTMLComponent
                ri = reference id for forms containment
					
                A component must have a component_id, which is a friendly name id
                */
                var _p = t.objects, i, v, tp = 0, e, l, p, _s = this.properties, f, _f, b = 0;
                if (o && o.object_type && o.object_type.match(/xhtml_component/) && o.properties.cid) {
                    if (!this.isFieldNode(o.getContainer())) {
                        _m.sendMessage("Skip non-field node '" + o.getContainer().nodeName + "'", "200.1");
                        return 0;
                    }

                    if (!DATATYPES.TS(ri)) ri = _s.l;
                    if (!(f = t.getFormByName(ri))) {
                        f = {
                            i: ri,
                            x: 0,
                            n: 0
                        };

                        HemiEngine.object.addObjectAccessor(f, "element");
                        l = _p.forms.length;
                        this.addNewForm(f, ri, _s.l + "-" + l);
                        f.x = l;
                        f.n = _s.l + "-" + l;

                    }

                    i = o.properties.cid;
                    if (!f.getElementByName(i)) {
                        e = o.getContainer();
                        if (!(p = e.getAttribute("pattern-id"))) {
                            p = 0;
                        }
                        if (e.type) tp = e.type;
                        if (!bi) bi = HemiEngine.GetSpecifiedAttribute(e, "bind");

                        l = f.objects.elements.length;
                        v = {
                            t: tp,
                            /* value */
                            v: 0,
                            /* default/original value */
                            d: 0,
                            n: i,
                            i: l,
                            object_id: o.object_id,
                            vp: p,
                            e: e,
                            vd: 0,
                            f: ri,
                            /* r = rendered */
                            r: 1,
                            b: bi, /* binding id */
                            getBindingId: function () { return this.b; },
                            getType: function () { return this.t },
                            getIsRendered: function () { return this.r },
                            getName: function () { return this.n },
                            getValue: function () { return this.v },
                            getObjectId: function () { return this.object_id },
                            getElement: function () { return this.e },
                            getReferenceId: function () { return this.f }
                        };
                           f.addNewElement(v, i, o.object_id);
						
						/// Reuse p
						p = 0;
						if (bi)
							p = HemiEngine.registry.service.getObject(bi);
						/// If a backing bean is specified, and the bean exists, 
						/// Then use the bean value instead of the element value

                        t.synchronizeComponent(o, (p ? 1 : 0), 1, 0, 1);

                        v.d = v.v;
                        _m.sendMessage("Add " + i + " (" + tp + ") with pattern " + p, "200.1");

                    }
                    else
                        t.synchronizeComponent(o, 1);
                    /// _m.sendMessage("Skip existing " + i, "200.1");

                    b = 1;
                }


                else {
                    /// _m.sendMessage("Don't add","200.1");
                }

                return b;
            };

            /// <method>
            /// <name>validateForm</name>
            /// <param name = "fi" type = "variant">Name or index of a form.</param>
            /// <param name = "b" type = "boolean" optional = "1">Bit indicating whether focus should be set on fields failing validation.</param>
            /// <return-value name = "o" type = "boolean">Bit indicating whether the form validated.</return-value>
            /// <description>Validates form fields based on the configured validation patterns. Uses the hemi.data.validator.service class.</description>
            /// </method>
            ///
            t.validateForm = function (fi, b) {
                /*
                fi = form index
                b = visual marker
                */
                var a = t.getElements(fi), i = 0, r = 1, o;

                for (; i < a.length; i++) {
                    r = t.validate(a[i]);
                    if (!r) {
                        if (b) {
                            HemiEngine.message.service.sendMessage(
								(HemiEngine.lookup("hemi.data.validator") ? HemiEngine.data.validator.service.getValidationErrorText(a[i].e) : "Validator not loaded"),
								"200.4",
								1
							);
                            a[i].e.focus();
                        }

                        return r;
                    }
                }
                return r;
            };
            /// <method>
            /// <name>validate</name>
            /// <param name = "n" type = "variant">Name or index of the XHTMLFormElement.</param>
            /// <param name = "w" type = "String">Validation pattern id.</param>
            /// <param name = "i" type = "variant" optional = "1">Name or index of the XHTMLForm.</param>
            /// <return-value name = "o" type = "boolean">Bit indicating whether the form field validated.</return-value>
            /// <description>Validates the specified form field based on the specified validation pattern id. Uses the hemi.data.validator.service class.</description>
            /// </method>
            ///
            t.validate = function (n, w, fi) {
                /*
                n = xelement name
                w = validation id
                f = form reference
                */
                /* return true if the validator is not present, or there is no validation id for this component */
                var _s = this.properties, v, _m = HemiEngine.message.service, r, o;
                if (DATATYPES.TO(n)) {
                    o = n;
                    if (!DATATYPES.TU(o.getAttribute)) o = t.getXElement(o.getAttribute("rid"),o.getAttribute("space-id"));
                }
                else o = t.getXElement(n, fi);
                if (!o) {
                    _m.sendMessage("Invalid XElement reference '" + n + "'", "200.4", 1);
                    return 0;
                }

                if (!o.r) {


                    _m.sendMessage("Unlinked XElement in XHTMLFormComponent for '" + n + "'.  Returning previously validated value.", "200.2");


                    return o.vd;

                }

                if ((!w && !o.vp) || !HemiEngine.lookup("hemi.data.validator")) {


                    _m.sendMessage("Pattern '" + o.vp + "'/'" + w + "' not defined or validator not implemented in XHTMLFormComponent.validate", "200.1");


                    return 1;
                }

                /* use 'w' in preference over the specified pattern */
                if (!DATATYPES.TS(w)) w = o.vp;

                v = HemiEngine.data.validator.service;

                r = v.validateField(o.e, w);
                if (!r) {
                    _m.sendMessage("Validation Error: " + n + " : " + w + ":" + v.getValidationErrorText(w), "200.4");
                }


                else {
                    _m.sendMessage("Validated '" + n + "' with '" + w + "'", "200.1");
                }


                o.vd = r;
                return r;

            };

            HemiEngine._implements(t, "base_object", "xhtml_form", "%FILE_VERSION%");
            HemiEngine.registry.service.addObject(t);
            t.ready_state = 4;
            ///				<method>		
            /// 			<name>isForm</name>
            /// 			<param name = "i" type = "variant">Name or index of the XHTMLForm object..</param>
            /// 			<return-value name = "b" type = "boolean">Bit indicating whether the specified object name exists.</return-value>
            /// 			<description>Returns true if the specified name exists.</description>
            /// 			</method>
            /// 			<method>
            /// 			<name>getForms</name>
            /// 			<return-value name = "a" type = "array">Array of XHTMLForm objects.</return-value>
            /// 			<description>Returns an array of XHTMLForm objects.</description>
            ///				 </method>
            /// 			<method>
            /// 			<name>getForm</name>
            /// 			<param name = "i" type = "int">Index of the XHTMLForm object..</param>
            /// 			<return-value name = "e" type = "XHTMLForm">XHTMLForm object.</return-value>
            /// 			<description>Returns the specified XHTMLForm object.</description>
            /// 			</method>
            ///				 <method>
            /// 			<name>getFormByName</name>
            /// 			<param name = "n" type = "String">Name of the element.</param>
            /// 			<return-value name = "e" type = "XHTMLForm">XHTMLForm object.</return-value>
            /// 			<description>Returns the specified XHTMLForm object.</description>
            /// 			</method>

            /*		HemiEngine.object.addObjectAccessor(t,"element");*/
            HemiEngine.object.addObjectAccessor(t, "form");
            /*		HemiEngine.object.addObjectAccessor(t,"formnames");*/
        }
    }, 1);
} ());

/// </class>
/// </package>
/// </source>
///
