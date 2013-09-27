/*
	Performance Monitor
	Source: HemiEngine.monitor.perf
	Copyright 2006 - 2009. All Rights Reserved.
	Version: %FILE_VERSION%
	Author: Stephen W. Cote
	Email: sw.cote@gmail.com
	Project: http://www.whitefrost.com/projects/monitor
	License: http://www.whitefrost.com/projects/monitor/monitor.license.txt
*/
(function(){
	if(typeof _TOP == DATATYPES.TYPE_UNDEFINED) _TOP = new Date();
	HemiEngine.include("hemi.event");
	HemiEngine.include("hemi.monitor");
	HemiEngine.include("hemi.util.url");
	HemiEngine.namespace("monitor.perf",HemiEngine,{


		///
		/// Data Transfer Types ('d')
		/// 1: normal
		/// 2: monitor not supported
		/// 3: script disabled
		///
		/// Report Types ('RT')
		/// 1: normal
		/// 2: backup
		/// 3: runtime script error
		///

		/// Form Delivery Modes
		///   1 = Page Load
		///   2 = Previous Page Unload
		///
		///

		properties:{
			cookie_path : "; path=/",
			page_stop:0,
			unloaded:0,
			/* top of the page */
			start_time:_TOP.getTime(),
			/* top/bottom of the page*/
			stop_time:0,
			load_time:0,
			start_latency:0,
			dwell_time:0,
			js_errors:0,
			js_message:0,
			js_url:0,
			js_line:0,
			image_aborts:0,
			image_errors:0,
			unique_image_count:0,
			unique_image_size:0,
			page_id:0,
			previous_page_hash:0,
			/// mark form submit to block any link clicks for the first 1/2 second
			/// this is to address the browsers not blocking onclick handlers to links that submit forms
			/// 
			form_submit:0,
			mark_end:0,
			previous_form_values:0,
			user_id_variable:"%USER_ID_VARIABLE_NAME%",
			debug_response:(typeof _DEBUG != DATATYPES.TYPE_UNDEFINED && _DEBUG == 1 ? 1 : 0)
		},
		objects:{
			js_hash:[],
			query_hash:[],
			unique_images:[],
			custom_variables:[%CUSTOM_VARIABLES%],
			custom_cookies:[%CUSTOM_COOKIES%],
			custom_forms:[%CUSTOM_FORMS%]
		},
		///
		/// b = skip perf metrics
		///
	   getData : function(b){
		  var _s = this.object_config.status,z,ts,l,pt=0,o,scr=screen,ng=navigator,i=0,_p = this.object_config.pointers,dp=this.getConfigKey("d"),s;

			s = dp + (dp.indexOf("?") == -1 ? "?" : "&") + "d=1&u=" + escape(document.URL)
			 +(document.referrer ? "&ur=" + escape(document.referrer) : "" )
			 + "&s=" + this.getMonitorService().getSessionId()
			 + "&c=" + this.getMonitorService().getContextId()
			 + (document.title.length > 0 ? "&t=" + escape(document.title) : "")
			 + "&g=" + (new Date()).getTimezoneOffset()
		  ;
	      
		  /// Check for user id script variable:
		  ///
		  z = window[_s.user_id_variable];
		  if(typeof z != DATATYPES.TYPE_UNDEFINED) s += "&mi=" + z;
		  if(!b){
			  s+= "&ic=" + _s.unique_image_count + "&is=" + _s.unique_image_size + "&ia=" + _s.image_aborts + "&ie=" + _s.image_errors;
			  if(_s.page_id) s += "&pid=" + _s.page_id;
			  z = (typeof document.fileSize == DATATYPES.TYPE_STRING ? parseInt(document.fileSize) : -1);
				if(z < 0 && typeof document.documentElement != DATATYPES.TYPE_UNDEFINED && typeof (ts = document.documentElement.innerHTML) == DATATYPES.TYPE_STRING)
					z=ts.length;
	                
			  if(_s.start_latency) s += "&l=" + (_s.start_time - _s.start_latency);
			  if(_s.stop_time) s += "&p=" + (_s.stop_time - _s.start_time);
			  if(_s.load_time) s += "&r=" + (_s.load_time - _s.stop_time);
			  if(typeof g_query_time != DATATYPES.TYPE_UNDEFINED) s+= "&dbq=" + parseInt(g_query_time);
			  if(typeof g_read_time != DATATYPES.TYPE_UNDEFINED) s+= "&dbr=" + parseInt(g_read_time);

			  if(_s.start_latency && _s.stop_time){
				l = _s.stop_time - _s.start_latency;
				if(l > 0 && z > 0){
					pt = Math.round(z*8 / (l/1000));
					s += "&pt=" + pt;
				}
			  }

			  if(ng.cpuClass) s += "&cpu=" + ng.cpuClass;
			  o = document.getElementById("PerfMonCC");
			  if(o && o.connectionType) s+= "&ct=" + o.connectionType;
			  /*if(scr.bufferDepth) s += "&bd=" + scr.bufferDepth;*/
			  if(ng.browserLanguage) s+= "&lg=" + ng.browserLanguage;
			  if(typeof ng.javaEnabled != DATATYPES.TYPE_UNDEFINED) s+= "&jb=" + (ng.javaEnabled() ? 1 : 0);
			  s += "&z=" + z + "&cd=" + scr.colorDepth + "&sd=" + scr.width + "x" + scr.height + "&ce=" + (ng.cookieEnabled ? 1 : 0);
		   }
		  s += "&ps=" + _s.page_stop;
		  if(_s.dwell_time) s+= "&dw=" + _s.dwell_time;
		  if(_s.js_errors){
			s+= "&js=" + _s.js_errors + "&ju=" + escape(_s.js_url) + "&jm=" + escape(_s.js_message) + "&jl=" + _s.js_line;
			/// Set the count back to 0 so these errors aren't reported again.
			///
			/* _s.js_errors = 0;*/
		   }
	       
		   /// Tack on custom variables
		   ///
	       
		   /// reuse l
			l = _p.custom_variables.length;
			for(; i < l; i++){
				z =_p.custom_variables[i];
				if(z.length>0){
					o = z.match(/([^\.\[]*)(\.|\[)/);
					if(!o||eval("typeof "+ o[1] + "!=DATATYPES.TYPE_UNDEFINED"))
						if(eval("typeof "+ z +"!=DATATYPES.TYPE_UNDEFINED")){
							///  + ".toString().substr(0,200)"
							s += "&cv"+ (i + 1) + "=" + escape(eval(z));
						}
				}
			}
			
			/// Tack on custom cookies
			l = _p.custom_cookies.length;
			for(i = 0; i < l; i++){
				z = this.getCookie(_p.custom_cookies[i]);
				if(typeof z != DATATYPES.TYPE_UNDEFINED) s += "&cc" + (i+1) + "=" + escape(z);
			}
			
			/// Check for any form values from the previous page
			/// 
			if(_s.previous_form_values) s+= _s.previous_form_values;
			
			/// append form values for page load
			///
			s += this.getFormValues(_p.custom_forms,1);
	      
		  return s;
	   },
		getFormValue:function(n,y){
			var fm = document.forms,
				i = 0,
				e,
				k,
				/// y == type
				y,
				v,
				r = 0
			;
			for(; i < fm.length; i++){
				for(k = 0; k < fm[i].elements.length;){
					e = fm[i].elements[k++];
					if(e.type && e.type == y && e.name == n){
						v = e.value;
						r = v.match(/^\d+$/) ? parseInt(v) : v ;
						break;	
					}
				}
				if(r) break;
			}
			
			return r;
		},
	   
	   /*
	c = array of form query constructs
	s = delivery mode
	u = variable name
	*/
		getFormValues:function(c,s,u){

			var fm = document.forms,
			r,
			i=0,
			d=(s==3 ? u: ""),
			n,
			e,
			m,
			l,
			o,
			f=0,
			z,
			k,
			a,
			t,
			v,
			p=0,
			q="",
			w,
			y
		;

		if(typeof c != DATATYPES.TYPE_OBJECT || !c.length) return d;
		
		for(; f < c.length; f++){
			z = c[f];
			n=z.f;
			/*
				Query Mode
			*/
			k="";
			if(z.d == s && typeof z.e == DATATYPES.TYPE_STRING && s == 1 && n == "get-query"){
				
				
				o = document.URL;
				w = o.indexOf("?");
				d += "&f_" + (typeof z.i == DATATYPES.TYPE_NUMBER ? z.i : f) + "_" + z.d + "=" + n + "[";
				p = (w > -1 ? o.substring(w + 1,o.length).split("&") : []);
				m =  z.e.split(",");
				for(i=0; i < m.length; i++){
					for( w = 0; w < p.length; ){
						o = p[w++].split("=");
						if(o.length <= 1) continue;
						v = (k.length?",":"");
						if(o[0] == m[i]){
							k += v + o[0] + ":" + unescape(escape(o[1]));
							break;
						}
					}
				}
				d += k + "]";
				continue;
			}	
			if( (n == "*" || typeof fm[n] == DATATYPES.TYPE_OBJECT) && typeof z.e == DATATYPES.TYPE_STRING && z.d == s){
				m=  z.e.split(",");
				if(n == "*"){
					e=[];
					for(i=0; i < m.length; i++)
						for( p=0; p < fm.length; p++)
							if(typeof fm[p].elements[m[i]] == DATATYPES.TYPE_OBJECT){
								e[m[i]] = fm[p].elements[m[i]];
								/*
								if(typeof e[m[i]].length == DATATYPES.TYPE_NUMBER && e[m[i]].length > 0 && (!e[m[i]].type || !e[m[i]].type.match(/^select/i)))
									e[m[i]] = e[m[i]][0];
								*/
								break;
							}
				}
				else{
					e = fm[n].elements;
				}
				if(s < 3) d += "&f_" + (typeof z.i == DATATYPES.TYPE_NUMBER ? z.i : f) + "_" + z.d + "=" + n + "[";
				
				for(i=0; i < m.length; i++){
					l = m[i];
					if(typeof e[l] == DATATYPES.TYPE_OBJECT){
						o = e[l];
						v = (k.length?",":"");
						t = (typeof o.type == DATATYPES.TYPE_STRING ? o.type : "");
						w=null;
						if(t=="text" || t=="password" || t=="hidden") w = escape(o.value);
						if(t.match(/^select/i)){
							a = o.selectedIndex;
							w = ( a>=0 ? escape(o.value) : "");
						}

						if(t == "checkbox") w=o.checked;
						
						if(t.length == 0 && o.length > 0){
							for(var y = 0; y < o.length; y++){
								t = (typeof o[y].type == DATATYPES.TYPE_STRING ? o[y].type : "");
								if(t == "radio" && o[y].checked){
									w = escape(o[y].value);
									break;
								}
							}
						}

						if(w){
							if(s == 4) $A.w["TRFV_"+l] = escape(w);
							else if(s == 3) k+= escape("&" + l + "=" + w);
							else if(s < 3) k += v + l + ":" + escape(w);
						}
					}
				}
				if(s==3) q += k; 
				else if(s < 3) d+=k+"]";
			}
		}
		if(s == 3 && q.length > 0){
			if(d.indexOf("%3F") == -1) d += "%3F";
			else d += "&";
			d += "rq%3D1" + q;
		}
		return d;
		},
	   
	   markEnd:function(){
		var _s = this.object_config.status;
		_s.stop_time = (new Date()).getTime();
		_s.page_id = this.SetPageId();
		_s.me = 1;
	   },
	  
	   setCookie:function(n,d){
		document.cookie = n + "=" + escape(d) + this.object_config.status.cookie_path;
		this.getMonitorService().object_config.cookies[n]=escape(d);
	   },
	   
	   clearCookie:function(n){
		document.cookie = n + "=0:N;expires=" + (new Date()).toGMTString() + this.object_config.status.cookie_path;
		this.getMonitorService().object_config.cookies[n]=null;
	   },
	   getCookie:function(n){
		/*
			The HashCookie function on the MonitorService will set int values as int types
		*/
		var v = this.getMonitorService().object_config.cookies[n];
		return v;
	   },
	   /*
	   handle_image_load : function(e){

	   },
	   */
	   handle_document_stop : function(e){
		var _s = this.object_config.status;
		if(!_s.page_stop && !_s.wl) _s.page_stop = 3;
	   },
	   handle_image_abort : function(e){
		this.object_config.status.image_aborts++;
	   },
	   handle_image_error : function(e){
		this.object_config.status.image_errors++;
	   },
	   handle_window_error : function(m, u ,l){
		var _s = this.object_config.status,h,_p = this.object_config.pointers;
		_s.js_errors++;
		_s.js_message = m;
		if(u==document.URL) u = 1;
		_s.js_url = u;
		_s.js_line = l;
		h = HemiEngine.hashlight(m + l + u);

		/// Can only send runtime effor if window is loaded, and is not unloading, and data was sent, and this error wasn't previously reported
		///
		if(!_s.data_sent || !this.getMonitorService().getDocumentRendered() || _s.wu || _p.js_hash[h]) return;
		_p.js_hash[h] = 1;
		(new Image()).src = this.getData(1) + "&RT=3";
	    
	   },
	   handle_mouse_click : function(e){
		var _s = this.object_config.status,fv,_p = this.object_config.pointers;
		if(_s.form_submit) return;
		if(!_s.page_stop && !_s.wl) _s.page_stop = 1;
		var o = HemiEngine.event.getEventSource(e);

		/* mark a possible exit link with mkc, and record the time */
		if(o && o.nodeName.match(/^a$/i) && o.href.match(/^http/i) && !o.mkc){
			o.mkc = 1;
			this.PrepareUnload(o.href)
		}

	   },
	   
	   PrepareUnload : function(u, b, p, f){

		/// u = url
		/// b = grab form values
		/// p = psuedo; data will be sent on next monitored page
		/// f = if p, then force send now
		/// 

			if(typeof u == DATATYPES.TYPE_UNDEFINED) u = document.URL;
			u = this.getUrlHash(u);
			this.setCookie("ltnc",(new Date()).getTime());
			if(typeof _ANOL != DATATYPES.TYPE_UNDEFINED && _ANOL) this.setCookie("anol","1");
			this.setCookie("htag",HemiEngine.hashlight(u));
			
			/// Set a cookie for form values at the time of unload
			///
			if(!p && b) this.setCookie("fv",this.getFormValues(this.object_config.pointers.custom_forms,2));
			else if(p){
				/// Set reporttype as psuedo, to be loaded on the next page
			   if(!f)
				this.setCookie("BD",this.getData() + this.getFormValues(this.object_config.pointers.custom_forms,2) + "&RT=4");
			   else
			   (new Image()).src = this.getData() + this.getFormValues(this.object_config.pointers.custom_forms,2) + "&RT=4";
			}
	        
			this.object_config.status.pu = 1;
	   },
	   
	   /// invoked from a timeout, so use a full object path reference
	   /// 
	   ClearStop:function(){
		HemiEngine.monitor.perf.object_config.status.form_submit = 0;
	   },

	   /// e = possible event object
	   /// b = bit indicating e is a form object
	   ///
	   handle_form_submit : function(e,b){
		var _s = this.object_config.status,u,du = document.URL,_p = this.object_config.pointers;
		if(!_s.page_stop && !_s.wl) _s.page_stop = 1;
		var o = (b ? e : HemiEngine.event.getEventSource(e));
		/* mark a possible exit link with mkc, and record the time */
		/// alert('submit: ' + o.action);
		if(o && o.nodeName.match(/^form$/i) && !o.mkc){
			o.mkc = 1;
			this.PrepareUnload(o.action,1);
		}
	    
		/// Mark the form as being submitted; give a 1/4 second delay before clearing the bit
		/// To accomodate dynamic or repeated submits.
		///
		_s.form_submit = 1;
		setTimeout(this.ClearStop,250);
	   },
	   
	   /// Return a fully qualified URL
	   /// (Note: Fix name)
	   ///
	   getUrlHash : function(u){
		var o = HemiEngine.util.url.newInstance(document.URL);
		return o.qualify(u);
		
	   },
	   
	   handle_window_unload : function(){
			this.unload();
	   },
		handle_window_beforeunload : function(){
			this.unload();
		},
	   unload : function(){
		  /* If the page is unloading before it loaded, save the data to a cookie */
		  var _s = this.object_config.status, b = this.getMonitorService().getDocumentRendered();
		  if(_s.wu) return;
		  _s.wu = 1;      
		  if(!b){
			/* alert('set backup bu / ' + this.getMonitorService().getDocumentRendered()); */
			if(!_s.page_stop) _s.page_stop = 2;
			this.setCookie("BD",this.getData() + "&RT=2");
			/*
			this.setCookie("PS",_s.page_stop);
			*/
			 /*document.cookie = "BackupData=" + escape(this.getData());*/

			 /* make a note that the data was stored */
			 this.object_config.status.data_sent = 1;
		  }
		  /* only have dwell time if the page loaded */
		  else{
			/// If the unload wasn't prepared, then prepare it now
			/// the default URL is the current location
			///
			if(!_s.pu) this.PrepareUnload();
			this.setCookie("dwl",(new Date()).getTime() - _s.load_time);
		   }

	   },
	   handle_window_load : function(){
		setTimeout("$E.registry.ObjectRegistry.getObject('" + this.object_id + "').PsuedoLoad()",0);
	   },
	   PsuedoLoad : function(){
		  /* If there was backup data, send that data. */
		   var _s = this.object_config.status,b = this.getCookie("BD"),_p = this.object_config.pointers,h,i,_i = document.images, o;
		   if(_s.wl) return;
		   _s.wl = 1;
		   if(!_s.me) this.markEnd();
		   /*if(!_s.stop_time) _s.stop_time = _s.start_time;*/
		   _s.load_time = (new Date()).getTime();
	       

		for(i=0; i < _i.length; i++){
			h = HemiEngine.hashlight(_i[i].src);
			if(!_p.unique_images[h]){
				_p.unique_images[h] = 1;
				_s.unique_image_count++;
				if(typeof _i[i].fileSize != DATATYPES.TYPE_UNDEFINED) _s.unique_image_size += parseInt(_i[i].fileSize);
			}
		}

		  if(b){
			 /*
			 var o = new Image();
			 o.src = unescape(b);
			 */
			 (new Image()).src = unescape(b);
			 this.clearCookie("BD");
		  }
	      

		  /* If data wasn't sent, send it and mark it as having been sent */
		  if(!_s.data_sent){
			/*
			 var d = new Image();
			 d.src = this.getData();
			*/
			if(_s.debug_response)
			{
				o = document.createElement("img");
				o.style.cssText = "position:absolute;top:10px;right:10px;";
				document.body.appendChild(o);
			}
			else o = new Image();
			o.onerror = this.handle_data_error;
			o.onabort = this.handle_data_abort;
			o.src = this.getData() + "&RT=1" + (_s.debug_response ? "&DebugImageResponse=1" : "");
			 _s.data_sent = 1;
		  }
	   },
	   handle_data_error : function(){
			if(this.object_config) this.object_config.status.data_error = 1;
	   },
	   handle_data_abort : function(){
			if(this.object_config) this.object_config.status.data_abort = 1;
	   },

	   SetPageId:function(){

		if(typeof PAGE_ID == DATATYPES.TYPE_STRING) return PAGE_ID;
	   
	   /*
		var _s = this.object_config.status,
			_p = this.object_config.pointers,
			u = document.URL,
		;
		*/    

		/// TODO
		/// Developers can use this section to add custom page id determination
		/// Otherwise, the shredder can determine the identifier

	   },
	   
	   /* Required by MonitorService */
	   initializeMonitor : function(){
		  /* must return true for monitoring to be enabled; */
		  var _s = this.object_config.status,dmn,iL,htag,iD,u = document.URL,i,fv,bn, h = location.hostname;
	      
		  if( (i = u.indexOf("?")) > -1){
			this.getMonitorService().hashValue(u.substring(i + 1,u.length),"&","=",this.object_config.pointers.query_hash);
		   }
	      
		  dmn = (h.match(/\d+\.\d+\.\d+\.\d+/)?0:h.match(/^[^.]*(\.[^.]*\..*)$/));
		  if(dmn && dmn[1]) _s.cookie_path += "; domain=" + dmn[1];
		  iL = this.getCookie("ltnc");
			/* bn = no latency validation required */
	      
		  bn = this.getCookie("anol");
		  this.clearCookie("anol");
		  iD = this.getCookie("dwl");
		  this.clearCookie("dwl");
		  this.clearCookie("ltnc");
		  _s.previous_page_hash = htag = this.getCookie("htag");
		  this.clearCookie("htag");
		  fv = this.getCookie("fv");
		  if(fv && fv.length) _s.previous_form_values = unescape(fv);
		  this.clearCookie("fv");

		  /*
			  If the current location hash matches the hash from the previous location, then accept any latency stamp and dwell time.
		  */
		  /*
			Latency validation can only be disabled when:
			1) the previous page had it disabled
			2) and, the current page has it disabled
		  */
		  if( (bn && typeof _ANOL != DATATYPES.TYPE_UNDEFINED && _ANOL) || (htag && htag == HemiEngine.hashlight(document.URL))){
			if(iL > 0){
				_s.start_latency = iL;
			}

			_s.dwell_time = (iD ? iD : 0);
			/*
			_s.page_stop = this.getCookie("ps");
			*/
		  }
	      
		  /*
		  alert(this.object_config.status.cookie_path + "\n" + this.getConfigKey("d"));
		  */
	      
		  return 1;
	   }
	});
	
	/* important to prepare object so 1) it can be registered, and 2) add it to the ObjectRegistry */
	HemiEngine.prepareObject("PerfMonitor","%FILE_VERSION%",true,HemiEngine.monitor.perf);

	/* add the monitor object */
	HemiEngine.monitor.service.addMonitor(HemiEngine.monitor.perf,"%PERF_CONFIG%");

	
}());


