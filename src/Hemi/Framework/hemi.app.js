/// <source>
/// <name>Hemi.app</name>
/// <project>
/// 	<name>Hemi JavaScript Framework</name>
/// 	<url-title>Hemi JavaScript Framework Project</url-title>
/// 	<url>/Hemi/</url>
/// </project>
///
/// <package>
///		<path>Hemi</path>
///		<library>Hemi</library>
///		<description>Helper utilities for creating Application Spaces, Application Components, XHTML Components, and loading <a href = "../Components/component.window.xml">Window components</a>.</description>
///		<static-class>
///			<name>app</name>
///			<version>%FILE_VERSION%</version>
///			<description>Convenience methods for instrumenting the Hemi.app.* libraries.</description>
(function () {

    HemiEngine.namespace("app", HemiEngine, {
    	dependencies : ["hemi.app.space","hemi.app.comp","hemi.data.form","hemi.object.xhtml"],
        /// <method>
        /// 	<name>createApplicationSpace</name>
        ///		<param name="oElement" type="Node" optional = "1">XHTML Node in which the space will be created.</param>
        ///		<param name="oParent" type="Node" optional = "1">XHTML Parent of oElement.</param>
        ///		<param name="oSibling" type="Node" optional = "1">XHTML Sibling of oElement, used for node adjacency insertion.</param>
        ///		<param name="fCallback" type="function" optional = "1">Callback function to be invoked after the space is initialized.</param>
        /// 	<return-value type = "SpaceObject" name = "oSpace">A new application space object.</return-value>
        /// 	<description>Creates a new application space at the specified location.</description>
        /// </method>
        createApplicationSpace: function (e, p, s, f) {
            if (!e) {
                e = document.createElement("div");
                e.className = "space";
                if (!p) p = document.body;
                if (s) p.insertBefore(e, s);
                else p.appendChild(e);
            }
            return HemiEngine.app.space.service.createSpace(e, 0, 0, 0, f);
        },

        /// Do not allow a component to be created on a space that isn't loaded
        /// This will cause a duplicate component to be created
        /// The duplicate can't be checked ahead of time because the binding HTML node may not yet exist
        /// within the space
        ///
        /// <method>
        /// 	<name>createComponent</name>
        ///		<param name="oElement" type="Node">XHTML Node for which the XHTML Component will be created.</param>
        ///		<param name="oSpace" type="SpaceObject" optional = "1">Application space in which the component will exist.</param>
        ///		<param name="sRid" type="String" optional = "1">Reference id for addressing this object through the registry service or within the application space.</param>
        ///		<param name="bDynamic" type="bit" optional = "1">Permit creating a component on an existing space.  This is a safety check to allow adding the component without creating a duplicate entry.</param>
        /// 	<return-value type = "XHTMLComponent" name = "oComponent">A new XHTML Component.</return-value>
        /// 	<description>Creates a new XHTML Component.</description>
        /// </method>
        createComponent: function (o, s, r, b) {
            var x = 0;
            if (s && s.space_state != 4 && !b) {
                HemiEngine.logError("Cannot dynamically create and bind a node to a component inside an initializing space");
                return;
            }

            r = (r ? r : HemiEngine.GetSpecifiedAttribute(o, "rid"));

            x = HemiEngine.object.xhtml.newInstance(o, 1, r, (s ? s.space_id : 0), HemiEngine.data.form.service, 0, 0, 0);
            if (s) {
                s.addSpaceObject(x, r);
                x.post_init();
            }

            return x;
        },

        /// Do not allow a component to be created on a space that isn't loaded
        /// This will cause a duplicate component to be created
        /// The duplicate can't be checked ahead of time because the binding HTML node may not yet exist
        /// within the space
        ///
        /// <method>
        /// 	<name>createApplicationComponent</name>
        ///		<param name="sComponentName" type="String" optional = "1">Name of the component to load.  If the name does not end with .xml, the component will be loaded from Hemi/Components/component.{sComponentName}.xml</param>
        ///		<param name="oElement" type="Node" optional = "1">XHTML Node to which the application component will be bound.</param>
        ///		<param name="oSpace" type="SpaceObject" optional = "1">Application space in which this component will operate.</param>
        ///		<param name="sRid" type="String" optional = "1">Reference id for addressing this object through the registry service or within the application space.</param>
        /// 	<return-value type = "ApplicationComponent" name = "oComponent">A new application component.</return-value>
        /// 	<description>Creates a new application component..</description>
        /// </method>
        createApplicationComponent: function (s, o, p, r) {
            var x = 0, a = 0, _a;
            if (o && p && p.space_state != 4) {
                HemiEngine.logError("Cannot dynamically create and bind a node to a component inside an initializing space");
                return;
            }

            _a = HemiEngine.app.comp;
            var h = 0;
            if (s) {
                if (!s.match(/\.xml/)) h = HemiEngine.hemi_base + "Components/component." + s.toLowerCase() + ".xml";
                else {
                    h = s;
                    s = h.match(/(component\.)?([\S][^\.]*)\.xml/)[2];
                }
            }
            if (o) {
                r = (r ? r : HemiEngine.GetSpecifiedAttribute(o, "rid"));
                x = HemiEngine.object.xhtml.newInstance(o, 1, r, (p ? p.space_id : 0), HemiEngine.data.form.service, 0, 0, 0);
                a = _a.newInstance(0, 0, x.getObjectId(), 0, 0, 1);

            }
            else {
                a = _a.newInstance(r, 0, (p ? p.getObjectId() : 0));
            }

            var p1;
            if (s){
                p1 = new Promise((res,rej)=>{
                	a.loadComponent(s, h).then(()=>{
                		res(a);
                	});
                });
            }
            else {
            	a.importComponentDefinition("", 0, r);
            	p1 = Promise.resolve(a);
            }
            
            if (x && p) {
            	p1.then((a) => {
	                p.addSpaceObject(x, (r ? r : HemiEngine.GetSpecifiedAttribute(o, "rid")));
	                /// post_init won't propogate to an application component unless the appcomp is set on the xcomp
	                ///
	                x.post_init();
	                return a;
            	});
            }

            return p1;
        },
        /// <method>
        /// 	<name>getWindowManager</name>
        /// 	<return-value type = "ApplicationComponent" name = "oManager">An instance of the component.manager.xml component.</return-value>
        /// 	<description>Returns a global instance of the component.manager.xml component, dynamically creating it if it does not already exist in the registry.</description>
        /// </method>
        getWindowManager: function () {
            var o, m = "manager",p1;
            o = HemiEngine.registry.service.getObject(m);
            if (!o) {
            	p1 = new Promise((res,rej)=>{
	                var p = HemiEngine.app.createApplicationComponent(m, 0, HemiEngine.app.getPrimarySpace(), m);
	                p.then(()=>{
	                	res(HemiEngine.registry.service.getObject(m));
	                });
            	});
            }
            else{
            	p1 = Promise.resolve(o);
            }
            return p1;
        },
        /// <method>
        /// 	<name>createWindow</name>
        ///		<param name="sTitle" type="String" optional = "1">Title of the window component.</param>
        ///		<param name="sTemplate" type="String" optional = "1">Template to use for the window contents.</param>
        ///		<param name="sName" type="String" optional = "1">Name of the window, used to retrieve a reference from the Window Manager component.</param>
        ///		<param name="vSpace" type="variant" optional = "1">Name of or reference to an Application Space.</param>
        ///		<param name="bNotBound" type="bool" optional = "1">Bit indicating whether the window component is free to move beyond the boundary of the Window Manager.</param>
        ///		<param name="aArguments" type="hash" optional = "1">Property hash that will be copied into the Application Component properties member.</param>
        ///		<param name="fLocalInit" type="function" optional = "1">Callback function to be invoked when the window and any dependent templates are loaded.</param>
        /// 	<return-value type = "ApplicationComponent" name = "oWindow">A new application component if created. If the named object exists, the object is restored but not returned.</return-value>
        /// 	<description>Creates and/or restores a new window as an instance of component.window.xml for the specified name.</description>
        /// </method>
        createWindow: function (t, l, n, v, b, a, f) {

            var o = (DATATYPES.TO(v) ? v : HemiEngine.app.space.service.getSpace(v)), c, b1, b2, u, d, p, p1, r, ex = /\[([\S\.]+)\]$/;
            if (!o) o = HemiEngine.app.getPrimarySpace();
            if (!o) {
                HemiEngine.logError("Invalid space");
                return;
            }
            p1 = new Promise( (res, rej) => {
	            var p = HemiEngine.app.getWindowManager();

	            p.then((m)=>{

		            if (n) {
		                c = m.GetWindowByName(n);
		                if (c) {
		                    if (c.getHideOnClose() && c.getIsClosed()) {
		                        c.open();
		                    }
		                    b1 = c.getManageMaximize();
		                    b2 = c.getManageMinimize();
		                    c.setManageMaximize(0);
		                    c.setManageMinimize(0);
		                    c.restore();
		                    c.getFocus();
		                    c.setManageMaximize(b1);
		                    c.setManageMinimize(b2);
		                    m.CenterWindow(c);
		                    if(f) f(c);
		                    res(c);
		                    return c;
		                }
		            }

		        	u = HemiEngine.guid();
		            if (!n) n = u;
		            if (!t) t = n;
		
		            d = document.createElement("div");
		            if (b)
		                document.body.appendChild(d);
		            else
		                o.space_element.appendChild(d);
		
		            var p2 = HemiEngine.app.createApplicationComponent("window", d, o, n);
		            p2.then((c)=>{
			            c.setTemplateIsSpace(1);
			            if (typeof a == "object") {
			                for (var i in a) {
			                    c.properties[i] = a[i];
			                }
			            }
			
			            c.post_init();
			
			            c.objects.body.appendChild(document.createTextNode("[ ... loading ...]"));
			
			            c.setCanResize(1);
			            c.resizeTo(500, 300);
			            c.setIsBound((b ? 0 : 1));
			            c.local_template_init = f;
			            c.setTitle(t);
			            c.setStatus("");
			            c.setHideOnClose(1);
			            m.CenterWindow(c);
			            c.getFocus();
			            
			            if((r = l.match(ex)) && r.length){
							l = l.replace(ex, "");
						}
			            c.loadTemplate(l, r?r[1]:r);
			            res(c);
		            });
			        
	            });

            });
            return p1;
        },
        /// <method>
        /// 	<name>getPrimarySpace</name>
        /// 	<return-value type = "ApplicationSpace" name = "oSpace">An Application Space.</return-value>
        /// 	<description>Returns the primary Application Space object.  The primary space is loaded if not already done so.</description>
        /// </method>
        getPrimarySpace: function () {
            var o, _s = HemiEngine.app.space.service;
            o = _s.getPrimarySpace();
            if (!o) _s.loadSpaces();
            return _s.getPrimarySpace();
        }

    });
} ());
///	</static-class>
/// </package>
/// </source>