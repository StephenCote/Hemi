/// <source>
/// <name>Hemi.app.space</name>
/// <project>
/// 	<name>Hemi JavaScript Framework</name>
/// 	<url-title>Hemi JavaScript Framework Project</url-title>
/// 	<url>/Hemi/</url>
/// </project>
///
/// <package>
///	<path>Hemi.app.space</path>
///	<library>Hemi</library>
///	<description>Application Spaces are controlled environments in which the content (XHTML and XML nodes) drives the implementation (via Application Space Definitions).  XHTML Nodes (Presentation Nodes) that match space definitions are represented as XHTML Components. XHTML Components can automatically load Application Components, Modules, and Templates (which in turn spawn their own Application Space).  These components can be retrieved using unique object identifiers, or more friendly reference identifiers which are contextually sensitive to the space.  Form fields are augmented by the Hemi.data.form service to create Virtual Forms. Spaces can load automatically, or use the Hemi.task service to bootstrap asynchronous dependencies.</description>
(function () {
    HemiEngine.namespace("app.space", HemiEngine, {
    	dependencies : ["hemi.task", "hemi.util", "hemi.object", "hemi.object.xhtml","hemi.data.form","hemi.util.logger","hemi.driver","hemi.app.space.definitions"],
        ///	<static-class>
        ///		<name>service</name>
        ///		<version>%FILE_VERSION%</version>
        ///		<description>Static implementation of the Application Space service.</description>
        ///	</static-class>
        service: null,
        ///	<class>
        ///		<name>serviceImpl</name>
        ///		<version>%FILE_VERSION%</version>
        ///		<description>The Application Space service is used to create managed environments within Web pages.  Each Application Space uses its XHTML contents for self-configuration, instrumentation, and contained lifecycle management.</description>

        /// <message>
        /// <name>onspaceconfigload</name>
        /// <param name = "o" type = "SpaceObject">The EngineObject for which the configuration was loaded.</param>
        /// <description>Message published to all subscribers when configuration has been loaded.</description>
        /// </message>

        serviceImpl: function () {
            var t = this, _m = HemiEngine.message.service, _x = HemiEngine.xml;
            HemiEngine.util.logger.addLogger(t, "Space", "Application Space", "600");

            t.properties = {
                pn: "space_loader",
                pa: "[nothing]",
                pat: "default",
                ph: "space_service_initialized",
                pht: "event",

                dn: "space",
                da: "[nothing]",
                dat: "default",
                dh: "space_initialized",
                dht: "event",

                space_autoid_counter: 0,
                space_id_counter: 0,
                space_id_label: "hemi.space",
                auto_load: 1
            };

            t.objects = {
                local_task_service: new HemiEngine.task.serviceImpl()
            };
            ///		<method>
            ///			<name>getPrimarySpace</name>
            ///			<return-value name = "oSpace" type = "SpaceObject">The primary space object.</return-value>
            ///			<description>Returns the primary application space.   If a space is not explicitly created prior to the page loading, then, by default, a primary space object is created for the HTML BODY.</description>
            ///		</method>
            t.getPrimarySpace = function () {
                return t.getSpaceByName(t.properties.pn);
            };
 

            ///		<method>
            ///			<name>clearAppSpaces</name>
            ///			<description>Clears all Spaces, and destroys all components in each Space.</description>
            ///		</method>
            t.clearAppSpaces = function () {
                var _p = t.objects, a, i, o, h, b, _t;
                a = _p.spaces;
                _t = _p.local_task_service;

                /// Clean up any objects associated with the spaces
                for (i = a.length - 1; i >= 0; i--)
                    t.clearAppSpace(a[i]);
                
                this.clearSpaces();
                _t.clearTasks();
            };


            ///		<method>
            ///			<name>loadSpaces</name>
            ///			<param name = "b" type = "boolean">Bit indicating that a primary space should be defined if one is not specified.  This param will always be true if any space exists and none are marked as primary.</param>
            ///			<param name = "o" type = "object" optional = "1">Object in which to search for potential space declarations.</param>
            ///			<param name = "pr" type = "function" optional = "1">Processor to assign to the space.  Used for pre-processing XML templates and configuration.</param>
            ///			<param name = "xr" type = "function" optional = "1">XML Handler to use when invoking setInnerXHTML.</param>
            ///			<description>Finds all spaces on the current Web page and loads them.  A space node is either the <i>body</i> element, or a <i>span</i>, <i>div</i>, or <i>form</i> element with an <i>is-space</i> attribute.</description>
            ///		</method>
            t.loadSpaces = function (b, d, pr, xr) {
                /*
                b = switch used to force load the primary engine
                d = optional context to search for the engines
				
                o = task for space
                m = array of space elements
                e = element in a array
                i = iterator
                v = engine object instance
                s = default for space; varies whether it is the primary engine
                x = method used to add task, varies whether it is the primary space
					
                a = action
                at = action_type
                h = handler
                ht = handler_type
					
                l = length
					
                n = name
                z = id
					
                pn = page config task name
                */

                var _p = t.objects, m = [], i, p;

                if (document.body == null) {
                    this.logError("Space unable to initialize due to unexpected DOM.");
                    return 0;
                }

                /// Use spread operator to make an array from the nodelist
                /// Currently matching anything with is-space versus div,span,form
                m = [...(d ? d : document.body).querySelectorAll("[is-space='1']")];

                this.logDebug("Loading Spaces " + (b ? 1 : 0) + " : " + m.length);
               
                /// force load a primary space if none exists
                if (!b && !m.length && !_p.spaces.length) {
                    m.push(document.body);
                    document.body.setAttribute("is-space", "1");
                }

                if (b) {
                    this.logDebug("Force load a primary space");
                    m = [1];
                }
                
                m.map(function(i){
                    if (!b) e = i;
                    t.createSpace(e, b, pr, xr);	
                });

            };
            ///		<method>
            ///			<name>createSpace</name>
            ///			<param name = "e" type = "Node">XHTML Element</param>
            ///			<param name = "b" type = "boolean">Bit indicating the space is being forced.</param>
            ///			<param name = "pr" type = "function" optional = "1">Processor to assign to the space.  Used for pre-processing XML templates and configuration.</param>
            ///			<param name = "xr" type = "function" optional = "1">XML Handler to use when invoking setInnerXHTML.</param>
            ///			<param name = "fCallBack" type = "function" optional = "1">Callback handler to be invoked when the space is initialized.</param>
            ///			<return-value name = "v" type = "SpaceObject">A new space object that has been tasked to initialize.</return-value>
            ///			<description>Creates a new Application Space.</description>
            ///		</method>
            t.createSpace = function (e, b, pr, xr, fCallBack) {
                var _p = t.objects, o, m = [], i, v, _s = t.properties, s = "p", x, _t, a, at, h, ht, l, n, z, c, p, q, pn;

                _t = _p.local_task_service;
                x = _t.addTaskLoader;

                c = ++_s.space_id_counter;

                if (_p.spaces.length > 0) {
                    s = "d";
                    x = _t.addTask;
                    n = _s[s + "n"] + "_" + c;
                }
                else {
                    n = _s[s + "n"];
                }

                z = _s.space_id_label + "_" + c;

                /* if forced, the element is invalid so check for !b */
                if (!b) {
                    if (HemiEngine.IsAttributeSet(e, "space-name")) {
                        n = e.getAttribute("space-name");
                    }
                    else {
                        e.setAttribute("space-name", n);
                    }
                    if (HemiEngine.IsAttributeSet(e, "space-id")) {
                        z = e.getAttribute("space-id");
                    }
                    else {
                        e.setAttribute("space-id", z);
                    }
                }

                if (t.getSpaceByName(n)) {
                    this.logError("Space " + n + " (" + z + ") is already loaded.", "1.3");
                    return null;
                }

                if (!b && HemiEngine.IsAttributeSet(e, "space-action"))
                    a = e.getAttribute("space-action");

                else
                    a = _s[s + "a"];

                if (!b && HemiEngine.IsAttributeSet(e, "space-action-type"))
                    at = e.getAttribute("space-action-type");

                else
                    at = _s[s + "at"];

                if (!b && HemiEngine.IsAttributeSet(e, "space-handler"))
                    h = e.getAttribute("space-handler");

                else
                    h = _s[s + "h"];

                if (!b && HemiEngine.IsAttributeSet(e, "space-handler-type"))
                    ht = e.getAttribute("space-handler-type");

                else
                    ht = _s[s + "ht"];


                if (!b && HemiEngine.IsAttributeSet(e, "space-config-task"))
                    _s.config_task = e.getAttribute("space-config-task");

                this.logDebug("Tasking space service: " + n + " / " + at + " / " + a + " / " + ht + " / " + h);
                o = x(
						n,
						at,
						a,
						ht,
						h
					);

                l = _p.spaces.length;

                v = t.newSpaceObject((b ? 0 : e), z, n, o, l, fCallBack);
                if (pr) v.Processor = pr;
                if (xr) v.XhtmlHandler = xr;

                /*
                The first space is the primary.
                */
                if (!l) v.is_primary = 1;
                /*
                add a dependency on the primary space to load
                and for the page_config_task to be complete
                */
                else {
                    _t.addTaskDependency(o, _s.pn);
                    if (_s.config_task) _t.addTaskDependency(o, _s.config_task);
                }
                t.addNewSpace(v, n, z);
                v.space_state = 1;
                _t.executeTask(o);

                return v;
            };

            
            
            ///		<method>
            ///			<name>clearAppSpace</name>
            ///			<param name = "i" type = "variant">Name or object reference of the Space to clear.</param>
            ///			<description>Clears the specified Space, and destroys all components of the Space.</description>
            ///		</method>
            t.clearAppSpace = function (i) {

                /// TODO: Refactor
                /// This is effectively identical with the configureSpace pre-step,
                /// Without the cleanup routines for Form and Parent Node 
                ///

                var _p = t.objects, o, b, h;

                if (typeof i == DATATYPES.TYPE_STRING) o = t.getSpace(i);
                if (typeof i == DATATYPES.TYPE_OBJECT) o = i;

                if (t.isSpace(o)) {

                   t.resetSpaceObject(o);
                   o.space_state = 5;

                    if (o.space_element) {
                        _x.removeChildren(o.space_element);
                        if (o.space_element.parentNode) o.space_element.parentNode.removeChild(o.space_element);
                    }

                    this.removeSpace(o);
                }
                else {
                    _m.sendMessage("Invalid space reference '" + i + "'", "200.4");
                }
            };
            
            t.resetSpaceObject = function(o){
                var b, h;

                if (o && t.isSpace(o)) {
                    b = o.space_objects;
                    for (h = b.length - 1; h >= 0; h--)
                        HemiEngine.registry.service.sendDestroyTo(b[h].object);
                    
                    HemiEngine.data.form.service.removeDataForm(o.space_id);
                    
                    o.space_state = 0;
                    o.space_objects = [];
                    o.space_object_names = [];
                    o.space_object_index = [];
                    o.space_css_map = [];
                    o.space_implementations = {};
                    o.config_name = 0;
                }

            };
            
            ///		<method>
            ///			<name>configureSpace</name>
            ///			<param name = "o" type = "Space">A space object.</param>
            ///			<param name = "c" type = "String">Name of SpaceService configuration.</param>
            ///			<description>Applies the specified configuration to the specified engine.  This can be used to repurpose Space objects, or to load alternate content into the Space.</description>
            ///		</method>
            t.configureSpace = function (o, c) {
                /*
                o = Space object
                c = config_name
					
                v = task object
					
                sf = self
                */
                let v, _s = t.properties, s, _t = t.objects.local_task_service, _p = t.objects, i, a, sf = 0, p1;
                s = _s.config_default;

                v = _t.getTaskByName(_s.config_task);
                if (typeof o == DATATYPES.TYPE_STRING) o = t.getSpace(o);
                if (!c && !HemiEngine.IsAttributeSet(o.space_element, "space-config")) c = "self";
                if (t.isSpace(o)) {

                	t.resetSpaceObject(o);
                    o.space_state = 3;

                    /// only allow 'self' if the space has an HTML element behind it
                    if (typeof c == DATATYPES.TYPE_STRING && c == "self" && o.space_element)
                        s = sf = 1;

                    if (!sf && o.space_element && o.space_element.getAttribute("space-config") != "self")
                        _x.removeChildren(o.space_element);
                    
                    /// Don't require external XML
                    ///
                    if (!v || (_t.isTask(v) && v.handled && typeof v.data == DATATYPES.TYPE_OBJECT)) {

                        if (!sf && (o.space_element && HemiEngine.IsAttributeSet(o.space_element, "space-config")) || DATATYPES.TS(c)) {
                            s = (DATATYPES.TS(c)) ? c : o.space_element.getAttribute("space-config");
                            if (s && s == "self") {
                                /// self can only be used once
                                o.space_element.removeAttribute("space-config");
                                sf = 1;
                            }
                        }

                        if (!s) {
                            this.logDebug("Page config not specified.");
                            return 0;
                        }
                        o.config_name = s;

                        this.logDebug("Process configuration '" + s + "' for " + o.space_name);

                        t.parseConfiguration(o, v, s);
                        
                        o.promiseCount = o.promises.length;
                        
                        p1 = new Promise((res,rej)=>{
                        	Promise.all(o.promises).then(()=>{
                        		res(o);
                        	});
                        })
                        .then((o)=>{
                       			this.completeSpaceConfiguration(o);
                   		});
                            
 
                    }
                    else {
                        this.logWarning("Space config not present.");
                    }
                }
                else {
                    this.logWarning("Invalid space reference for configureSpace", "200.4");
                }
                return p1;
            };
            t.completeSpaceConfiguration = function(o){
            	var _m = HemiEngine.message.service;
            	
            	
            	if(o.promises.length != o.promiseCount){
               		this.logDebug("Wait for additional promises: " + o.promiseCount + "->" + o.promises.length);
            		o.promiseCount = o.promises.length;
            		
            		Promise.all(o.promises).then(()=>{
            			this.completeSpaceConfiguration(o);
            		});
            		return;
            	}
            	
            	o.space_implementations = {};
            	o.promises = [];
            	o.promiseCount = 0;
                o.space_state = 4;
                this.logDebug("Publishing space config: " + o.space_id);
                _m.publish("onspaceconfigload", o);
            };
            /// 2019/03/07 - Rewrote portions of method to leverage promises in asynchronous dependencies
            /// There are likely still some issues with resolving transitive asynchronous dependencies prior to publishing the spaceloaded notification
            ///
            t.parseConfiguration = function (o, v, s, p, x, b) {
                /*
                o = (validated) space object
                v = (validated) task object
                s = page config name
                p = parent node
                x = object instance
                b = return value of parent impl
				*/
            	
            	/*
                cs = current config name
                p = page config node
                a = array of nodes
                h = iterator
                i = iterator
                n = node
					
                q = node query
					
                d = def node
					
                r = tmp val
                m = tmp val
                w = tmp val
                u = tmp val
                g = tmp val
                j = tmp val
                k = tmp val
                y = tmp node
                z = tmp nodeset
                f = tmp val
                c = tmp val
                e = tmp val
                l = tmp val
					
                nl = node length
					
                br = block recursion
					
                cx = context switch
                cxn = context switch type (object_ref probably)
                cxp = context switch path as an xpath, probably
					
                ck = context parent; the output html node is the outbound parent node.  This is used when importing data into self referenced configurations
                cn = context swap name, used with ck
									
                ab = abstract implementation
					
                sf = bool: is self
                ci = cached implementation

                */

                let a, i;

                /// Self must have a space_element, and that becomes the default parent
                if (s == "self" && typeof p == DATATYPES.TYPE_UNDEFINED) p = o.space_element;
                else if (typeof p == DATATYPES.TYPE_UNDEFINED && v && v.data)
                    p = _x.queryNode(v.data.documentElement, "configuration", 0, "id", s);

                if (!p) {
                    this.logWarning("Page config for " + s + " not found.", "200.4");
                    return;
                }

                [...p.childNodes].map(function(n){
                    let q, r, m, u, 
                    	/* g = namespace for implementation */
                    	g = 0, 
                        /* j = params array used when applying a constructor */
                        j = [], 
                        def = 0, f, b, c, h,
                        /* k = bit used to specify whether the constructor is on the parent; eg: as with menuitems and resultitems */
                        k = 0,
                        l, e = 0, w, 
                        br=1, 
                        cx = 0, 
                        cxv, cxp, 
                        ab = 0, nr, sf = 0, 
                        ck = 0, 
                        nl,
                        ci = 0,
                        cs = s
                    ;

                    if (s == "self") sf = 1;

                    if (n.nodeType == 1) {
                        /// 2008/02/07 : Do not process nodes specifically marked for avoidance
                        if (n.getAttribute("avoid") == "1" || n.getAttribute("is-space") == "1")
                        	return;

                        //// 2004/07/02 : Make sure to cast the node name to lower case
                        q = n.nodeName.toLowerCase();

                        /// Cache
                        w = o.space_implementations[q];

                        /// If cached, import the cached values
                        if (w) {
                            k = w.p;
                            cx = w.cs;
                            cxp = w.cp;
                            ab = w.ab;
                            br = w.nr;
                            sf = w.sf;
                            ck = w.ck;
                            g = w.g;
                            f = w.f;
                            def = w.def;
                            cn = w.cn;
                            ci = 1;
                        }
                        else if ((def = HemiEngine.app.space.definitions.service.getDefinition(q))) {
                            k = def.use_parent;
                            cx = def.context_switch;
                            cxp = def.context_path;
                            cn = def.swap_name;

                            ab = def.is_abstract;
                            br = (def.no_recursion ? 0 : 1);

                            /// If this is a self reference, and the context switched, then push config reference to switchedself
                            ///
                            if (cx && cs == "self") {
                                sf = 0;
                                ck = 1;
                            }

                            if (cxp) cxp = _parseORAParam(o, v, cxp, n, x, b, p, cs);

                            if ((u = def.namespace) && (g = HemiEngine.lookup(def.namespace))) {
                                if (g && (u = def.method_reference)) {
                                    if (DATATYPES.TF(g[u])){
                                    	g = g[u](_parseORAParam(o, v, def.method_reference_parameter, n, x, b, p, cs));
                                    }
                                }

                            }

                            w = {};
                            w.p = k;
                            w.cs = cx;
                            w.cp = cxp;
                            w.ab = ab;
                            w.nr = br;
                            w.sf = sf;
                            w.ck = ck;
                            w.g = g;
                            w.def = def;
                            w.cn = cn;
                            o.space_implementations[q] = w;
                        } /* End check for definition */
                       
                        /// If cached or defined
                        if (def || ci) {
                        	/// if cached
                            if (ci)
                                def = w.def;

                            if (def) {
                                z = def.constructor_params;
                                if (!ci) {
                                    f = _parseORAParam(o, v, def.constructor, n, x, b, p, cs);
                                    w.f = f;
                                }
 
                                w = z.length;
                                for (h = 0; h < w; ) {
                                    m = z[h++];
                                    u = 0;
                                    if (DATATYPES.TS(m) && m.match(/^ora:/i))
                                        u = _parseORAParam(o, v, m, n, x, b, p, cs);
                                    else
                                        u = m;

                                    j[j.length] = u;
                                }
                            } /* End if (check_constructor) */

                            nr = HemiEngine.GetSpecifiedAttribute(n, "aid");

                            if (nr)
                                n.setAttribute("id", nr + (++t.properties.space_autoid_counter));
							
                            if (!ab) {
                            	/// g is a package
                                if (typeof g == DATATYPES.TYPE_OBJECT && g != null && typeof g[f] == DATATYPES.TYPE_FUNCTION) {
                                	w = g[f].apply(0, j);
                                }
                                else if (k && typeof x[f] == DATATYPES.TYPE_FUNCTION) {
                                    w = x[f].apply(x, j);
                                }
                                else {
                                    this.logError("Unexpected implementation for " + q + " with g=" + g + " and f=" + f, "200.4");
                                }
                            } /* End if not abstracted */
                            else {
                                /// Abstracted: just push out w to x
                                this.logDebug("Apply #3 " + q + " abstracted");
                                w = x;
                            } /* End if abstracted */

                        	var p1, pd = {
                            		o:o,
                            		cn:cn,
                            		cx:cx,
                            		ck:ck,
                            		cxp:cxp,
                            		sf:sf,
                            		v:v,
                            		n:n,
                            		nr:nr,
                            		q:q,
                            		br:br,
                            		cx:cx,
                            		e:e,
                            		k:k,
                            		w:w,
                            		i:i,
                            		cs:cs,
                            		px:x
                            	};
                        	
                        	if(w instanceof Promise)
                        		p1 = w;
                        	
                        	else
                        		p1 = Promise.resolve(w);
                        	
                        	
                        	p1.then((xd)=>{
                        		t.completeParseConfiguration(pd.o, pd.cn, pd.ck, pd.cx, pd.cxp, pd.sf, pd.nr, pd.br, pd.n, pd.v, xd, pd.px, pd.k, pd.e, pd.cs);
                        	});
                        	o.promises.push(p1);
                        } /* End check for implementation or cached implementation */ 
                        else {
                            /// Copy the whole node
                            if (typeof x == DATATYPES.TYPE_UNDEFINED) x = o;
                            if (typeof x == DATATYPES.TYPE_OBJECT && x != null && typeof x.getContainer == DATATYPES.TYPE_FUNCTION) {
                            	this.logDebug("Copy node " + n.nodeName);
                            	o.Processor(o, n);
                                if (!sf) _x.setInnerXHTML(x.getContainer(), n, true, 0, 0, 0, 0, o.XhtmlHandler);
                            }
                            else {
                                this.logWarning("No object definition for " + n.nodeName + " (1); treating as HTML");
                            }
                        }
                    }
                    else if (n.nodeType == 3) {
                        if (n.nodeValue.replace(/\s/g, "").length && typeof x == DATATYPES.TYPE_OBJECT && typeof x.getContainer == DATATYPES.TYPE_FUNCTION) {
                            o.Processor(o, n);
                            if (!sf) _x.setInnerXHTML(x.getContainer(), n, 1, 0, 0, 0, 0, o.XhtmlHandler);
                        }
                    }
                },this);

                return;
            };

            t.completeParseConfiguration = function(o, cn, ck, cx, cxp, sf, nr, br, n, v, w, x, k, e, cs){

                /// If use parent */
            	/// this.logDebug("Complete configuration for " + n.nodeName);

                /// Use parent
            	if (k) {
                	this.logDebug("Use parent");
                    e = w;
                    w = x;
                }

                o.addSpaceObject(w, w && w.properties && w.properties.cid ? w.properties.cid : HemiEngine.GetSpecifiedAttribute(n, "rid"),cs);
                if (cx && w) {
                    if (ck && cn) {
                        k = document.createElement(cn);
                        n.parentNode.insertBefore(k, n);
                        n.parentNode.removeChild(n);
                        n = k;
                    }
                    if (!w.documentElement) {
                        o.Processor(o, w);
                        if (!sf) _x.setInnerXHTML(n, w, 0, (!ck ? v.data : 0), 0, 0, 0, o.XhtmlHandler);
                    }
                    else {
                        if (o.dp) cxp = o.dp;
                        nr = (cxp ? _x.selectSingleNode(w, cxp, w.documentElement) : w.documentElement);
                        if (!nr) nr = w.documentElement;
                        o.Processor(o, nr);
                        if (!sf) _x.setInnerXHTML(n, nr, 0, (!ck ? v.data : 0), 0, 0, 0, o.XhtmlHandler);
                    }
                    
                    /// Switch the context back to the parent
                    w = x;
                }

                /// If recursive
                if (br) t.parseConfiguration(o, v, cs, n, w, e);
                
                if (w && w.object_type && w.object_type.match(/^xhtml_component$/)) {
                	let p1 = w.post_init();
                	if(p1 instanceof Promise)
                		o.promises.push(p1);
                	
                }

                return;
            };
 
            ///		<object>
            ///			<name>Space</name>
            ///			<property name = "space_element" type = "object">The DOM Node associated with this Space.</property>
            ///			<property name = "space_id" type = "String">The unique identifier of this Space object.</property>
            ///			<property name = "space_name" type = "String">The friendly name of this Space object.</property>
            ///			<property name = "space_state" type = "int">The loading state of the space.</property>
            ///			<property name = "space_index" type = "int">The ordinal index of this Space object.</property>
            ///			<property name = "config_name" type = "String">The configuration name for this Space object.  This value specifically applies to a Space Configuration file.</property>
            ///			<property name = "task" type = "Task">The task object associated with this Space.  All Spaces are bootstrapped with a Task object.</property>
            ///			<property name = "is_primary" type = "boolean">Bit indicating whether this is the primary engine.  There can only be one primary engine per hemi.app.space.serviceImpl instance.</property>
            ///			<property name = "space_implementations" type = "array">Cache of implementation constructors used to build the content within the Space.</property>
            ///			<method virtual = "1">
            ///				<name>Processor</name>
            ///				<param name = "o" type = "Space">An object reference to this Space object.</param>
            ///				<param name = "v" type = "variant">An XHTML Node, or string.</param>
            ///				<description>Allows a document to be processed by an outside process before it is copied into the space context.</description>
            ///			</method>
            ///			<method>
            ///				<name>getContainer</name>
            ///				<return-value type = "object" name = "c">The node containing the Space object.</return-value>
            ///				<description>Returns the node that contains the Space.  For example, a DIV node on which the Space was defined.</description>
            ///			</method>
            ///			<method>
            ///				<name>getSpaceObjects</name>
            ///				<return-value type = "array" name = "a">Array of objects created for this Space.  All objects are likewise registered with the hemi.registry.service.</return-value>
            ///				<description>Returns an array of objects created for this Space.</description>
            ///			</method>
            ///			<method>
            ///				<name>getSpaceObject</name>
            ///				<param name= "i" type = "int">Index into the objects array.</param>
            ///				<return-value type = "object" name = "a">Object created for this Space.</return-value>
            ///				<description>Returns the specified object created for this Space.</description>
            ///			</method>
            ///			<method>
            ///				<name>getSpaceObjectByName</name>
            ///				<param name= "n" type = "String">Name of an object.</param>
            ///				<return-value type = "object" name = "a">Object created for this Space.</return-value>
            ///				<description>Returns the specified object created for this Space.</description>
            ///			</method>
            ///			<method>
            ///				<name>getSpaceObjectsByClass</name>
            ///				<param name= "n" type = "String">CSS class name.</param>
            ///				<return-value type = "array" name = "a">Array of objects with the specified class.</return-value>
            ///				<description>Returns an array of objects with the specified class.</description>
            ///			</method>
            ///			<method>
            ///				<name>isSpaceObjectByName</name>
            ///				<param name= "n" type = "String">Name of an object.</param>
            ///				<return-value type = "boolean" name = "b">Bit indicating whether the object exists in this Space.</return-value>
            ///				<description>Returns true if the object exists, false otherwise.</description>
            ///			</method>
            ///			<method>
            ///				<name>getPrimitiveWire</name>
            ///				<param name= "n" type = "String">Identifier of a primitive wire.</param>
            ///				<return-value type = "PrimitiveWire" name = "o">PrimitiveWire object.</return-value>
            ///				<description>Returns the specified PrimitiveWire.</description>
            ///			</method>
            ///			<method>
            ///				<name>addSpaceObject</name>
            ///				<param name= "o" type = "FrameworkObject">A framework object.</param>
            ///				<param name= "s" type = "String">Reference identifier that can be used to identify this object within the space.</param>
            ///				<description>Adds the specified object to the application space.</description>
            ///			</method>
            ///			<method>
            ///				<name>removeSpaceObject</name>
            ///				<param name= "i" type = "String">FrameworkObject identifier.</param>
            ///				<description>Removes references to the specified identifier from the space.</description>
            ///			</method>
            ///		</object>
            ///
            ///

            ///		<method internal = "1">
            ///			<name>newSpaceObject</name>
            ///			<param name = "e" type = "Node">XHTML Element representing the space.</param>
            ///			<param name = "i" type = "String">Unique identifier.</param>
            ///			<param name = "n" type = "String">Friendly name for the object.</param>
            ///			<param name = "k" type = "TaskObject">Task object used to load this space.</param>
            ///			<param name = "x" type = "int">Index of space relative to adjacent spaces.</param>
            ///			<param name = "f" type = "function">Space initialization callback</param>
            ///			<return-value name = "o" type = "SpaceObject">New space object.</return-value>
            ///			<description>Creates a new Space object.</description>
            ///		</method>
            t.newSpaceObject = function (e, i, n, k, x, f) {

                var r = {
                	promises : [],
                	space_element: e,
                    space_id: i,
                    space_name: n,
                    space_index: x,
                    config_name: 0,
                    task: k,
                    is_primary: 0,
                    space_objects: [],
                    space_object_names: [],
                    space_object_index: [],
                    space_css_map: [],
                    Processor: function (o, n) { },
                    XhtmlHandler: 0,
                    space_implementations: {},
                    space_state: 0,
                    space_callback: f,
                    removeSpaceObject: function (i) {
                        var o = this.space_objects, x = this.space_object_index, m = this.space_object_names, s;
                        if (!DATATYPES.TN(x[i]))
                            return;

                        s = o[x[i]];
                        if (s.rid) delete m[s.rid];
                        o[x[x]] = 0;
                        delete x[i];
                    },
                    addSpaceObject: function (w, q, cs) {
                        var l = this.space_objects.length, n;

                        if (
							w != null
							&&
							typeof w == DATATYPES.TYPE_OBJECT
							&&
							HemiEngine.registry.service.isRegistered(w)
							&&
							typeof this.space_object_index[w.object_id] != DATATYPES.TYPE_NUMBER
						) {
                            n = (w.getContainer ? w.getContainer() : 0);
                            this.space_objects[l] = { object: w, config: cs, rid: q };
                            this.space_object_index[w.object_id] = l;

                            if (q && typeof this.space_object_names[q] != DATATYPES.TYPE_NUMBER)
                                this.space_object_names[q] = l;

                            var aC = (n && n.className ? n.className.split(" ") : []);

                            /// Copy css class names into css_map 
                            ///
                            for (var c = 0; c < aC.length; c++) {
                                if (!DATATYPES.TO(this.space_css_map[aC[c]])) this.space_css_map[aC[c]] = [];
                                this.space_css_map[aC[c]].push(l);
                            }
                        }
                    },
                    getSpaceObjectsByClass: function (cN) {
                        var a = [], o;
                        if (DATATYPES.TO(this.space_css_map[cN])) {
                            for (var c = 0; c < this.space_css_map[cN].length; c++) {
                                o = this.space_objects[this.space_css_map[cN][c]];
                                if (o) a.push(o);
                            }
                        }
                        return a;
                    },
                    getContainer: function () { return this.space_element; },
                    getSpaceObjects: function () { return this.space_objects; },
                    getSpaceObject: function (i) { if (typeof this.space_object_index[i] == DATATYPES.TYPE_NUMBER && typeof this.space_objects[this.space_object_index[i]] == DATATYPES.TYPE_OBJECT) { return this.space_objects[this.space_object_index[i]]; } return 0; },
                    isObject: function (n) { if (typeof n == DATATYPES.TYPE_STRING && typeof this.space_object_names[n] == DATATYPES.TYPE_NUMBER && typeof this.space_objects[this.space_object_names[n]] == DATATYPES.TYPE_OBJECT) { return 1; } return 0; },
                    getSpaceObjectByName: function (n) { if (typeof n == DATATYPES.TYPE_STRING && typeof this.space_object_names[n] == DATATYPES.TYPE_NUMBER && typeof this.space_objects[this.space_object_names[n]] == DATATYPES.TYPE_OBJECT) { return this.space_objects[this.space_object_names[n]]; } return 0; },
                    primitive_wires: [],
                    getPrimitiveWire: function (i) { if (typeof i == DATATYPES.TYPE_STRING && typeof this.primitive_wires[i] != DATATYPES.TYPE_UNDEFINED) return this.primitive_wires[i]; return 0; }
                };
                HemiEngine.prepareObject("space_object", "%FILE_VERSION%", 1, r);

                return r;

            };

            t.handle_window_load = function () {
                if (t.properties.auto_load){
                	if(Object.keys(HemiEngine.including).length){
                		t.logDebug("Waiting for dependent libraries to load");
                		setTimeout(HemiEngine.registry.getEvalStatement(t) + ".handle_window_load()",10);
                	}
                	else{
                		t.logDebug("Auto loading spaces");
                		t.loadSpaces();
                	}
                }
            };

            t.handle_space_initialized = function (s, v) {

                /*
                Use the task_name to retrieve the reference to the engine instance.
                The engine name was used when creating the original task, so it should exist.
                */

                var e;

                this.logDebug("Starting space " + v.task.task_name, "11.1");

                if (typeof v == DATATYPES.TYPE_OBJECT && typeof v.task == DATATYPES.TYPE_OBJECT && (e = t.getSpaceByName(v.task.task_name))) {
                    e.space_state = 2;
                    if (e.is_primary) {
                        this.logWarning("Space " + e.space_id + " is the primary space and should not be handled by this event.", "11.2");
                    }
                    else {
                        this.logDebug("Space " + e.space_id + " initialized", "11.3");
                    }
                    var p1 = t.configureSpace(e);
                    p1.then(()=>{
                    	this.logDebug("Publishing space-onload: " + e.space_id);
	                    if (DATATYPES.TF(e.space_callback)) e.space_callback(this, e);
	                    HemiEngine.util.evaluateElementHandler(e.space_element, "space-onload");
                    });
                }
                else {
                    this.logError("Invalid space reference for space_initialized", "11.4");
                }

            };
            t.handle_space_service_initialized = function () {
                var _p = t.objects, e;

                this.logDebug("Starting space service", "10.1");
                _p.spaces[0].space_state = 2;
                if (_p.spaces.length) {
                    e = _p.spaces[0];
                    
                    var p1 = t.configureSpace(e);
                    p1.then(()=>{
                    	this.logDebug("Publishing space-onload for primary space: " + e.space_id);
	                    if (DATATYPES.TF(e.space_callback)) e.space_callback(this, e);
	                    HemiEngine.util.evaluateElementHandler(e.space_element, "space-onload");
                    });
                }
                return 1;
            };

            t.destroy = function () {
                var _m = HemiEngine.message.service;
                _m.unsubscribe(t, "onremoveobject", "handle_remove_object");
                _m.unsubscribe(t, "dom_event_window_load", "handle_window_load");
                _m.unsubscribe(t, "space_initialized", "handle_space_initialized");
                _m.unsubscribe(t, "space_service_initialized", "handle_space_service_initialized");

            };
            t.handle_remove_object = function (s, i) {
                var s = t.objects.spaces, h = 0, o;
                for (; h < s.length; ) {
                    o = s[h++];
                    if (!o) continue;
                    o.removeSpaceObject(i);
                }
            };

            HemiEngine._implements(t, "base_object", "space_service", "%FILE_VERSION%");
            HemiEngine.object.addObjectAccessor(t, "space");

            _m.subscribe(t, "onremoveobject", "handle_remove_object");
            _m.subscribe(t, "dom_event_window_load", "handle_window_load");
            _m.subscribe(t, "space_initialized", "handle_space_initialized");
            _m.subscribe(t, "space_service_initialized", "handle_space_service_initialized");

            HemiEngine.registry.service.addObject(t);
            t.ready_state = 4;
			if(document.readyState == "complete"){
				t.handle_window_load();
			}

        }
        /// </class>
    }, 1);
    
    
    /*
    ORA = object request alias; just a token that is used to reference a context object
    */
    function _parseORAParam(o, v, r, e, x, b, q, s) {
        /*
        o = engine object
        v = task object
        r = ora value
        e = originating xml element
        x = parent object instance
        b = parent reference; return value from where the parent object was created
        q = html parent
        s = config name
			
        a = variant used for name substring.
        z = return value;
			
			
        p = variant
        c = counter
        d = variant
        f = variant
        */
        var z = 0, a, n, p, d, f, c, up, i;
        if (typeof r != DATATYPES.TYPE_STRING) return;
        r = r.replace(/^ora:/i, "");

        if (r.match(/(\S*)_parent$/i)) {
            r = r.match(/(\S*)_parent$/i)[1];
            up = 1;
        }

        if (r.match(/(\S*)_attr$/i)) {
            a = r.match(/(\S*)_attr$/i)[1];
            r = "attr";
        }
        if (r.match(/integer_(\S*)$/i)) {
            a = r.match(/integer_(\S*)$/i)[1];
            r = "integer";
        }
        if (r.match(/xpath-node-value:(\S*)/i)) {
            a = r.match(/xpath-node-value:(\S*)/i)[1];
            r = "xpath-node-value";
        }
        if (r.match(/xpath-node-value-list:(\S*)/i)) {
            a = r.match(/xpath-node-value-list:(\S*)/i)[1];
            r = "xpath-node-value-list";
        }

        switch (r) {
            case "node_context":
                z = e;
                break;
            case "element_context":
                z = q;
                break;
            case "bool_true":
                z = 1;
                break;
            case "data_source":
                z = o.ds;
                break;
            case "parent_reference":
                z = b;
                break;
            case "xml_document":
                z = v.data;
                break;
            case "xpath-node-value-list":
                f = _x.selectNodes(v.data, a, e);
                p = [];
                for (c = 0; c < f.length; c++) {
                    d = f[c];
                    if (HemiEngine.IsAttributeSet(d, "value")) {
                        p[p.length] = _parseORAParam(o, v, d.getAttribute("value"), e, x, b, q, s);
                    }
                }
                z = p;
                break;
            case "xpath-node-value":
                n = _x.selectSingleNode(v.data, a, e);
                if (n) {
                    z = n.nodeValue;
                }
                break;
            case "params_array":
                a = e.getElementsByTagName("param");
                p = [];
                for (c = 0; c < a.length; c++) {
                    d = a[c];
                    if (HemiEngine.IsAttributeSet(d, "value")) {
                        p[p.length] = d.getAttribute("value");
                    }
                }
                z = p;
                break;
            case "integer":
                z = parseInt(a);
                if (isNaN(z)) z = 0;
                break;
            case "node_name":
                if (up) {
                    z = e.parentNode.nodeName;
                }
                else {
                    z = e.nodeName;
                }
                break;
            case "attr":
                if (a) {
                    if (up) {
                        z = e.parentNode.getAttribute(a);
                    }
                    else {
                        z = e.getAttribute(a);
                    }
                }
                break;
            case "space_object":
                z = o;
                break;
            case "space_config":
                z = s;
                break;
            case "space_element":
                z = o[r];
                break;
            case "parent_element":
                if (typeof x == DATATYPES.TYPE_UNDEFINED) x = o;
                if (typeof x.getContainer == DATATYPES.TYPE_FUNCTION) {
                    z = x.getContainer();
                }
                break;
            case "space_id":
                z = o.space_id;
                break;
            default:
                z = r;
                break;
        }

        return z;
    }
    
} ());
/// </package>
/// </source>