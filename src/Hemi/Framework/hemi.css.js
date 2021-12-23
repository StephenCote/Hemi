/// <source>
/// <name>Hemi.css</name>
/// <project>
/// 	<name>Hemi JavaScript Framework</name>
/// 	<url-title>Hemi JavaScript Framework Project</url-title>
/// 	<url>/Hemi/</url>
/// </project>
///
/// <package>
///	<path>Hemi</path>
///	<library>Hemi</library>
///	<description>The CSS Utility class includes tools for positioning, importing external stylesheets, and enabling and disabling stylesheets.</description>
///		<static-class>
///			<name>css</name>
///			<version>%FILE_VERSION%</version>
///			<description>Utilities for DOM Styles and Cascading Style Sheets.</description>
(function(){
	HemiEngine.namespace("css", HemiEngine,{
		getCSSBase : function(){
			return (typeof HemiConfig != DATATYPES.TYPE_UNDEFINED && HemiConfig.cssBase ? HemiConfig.cssBase : HemiEngine.hemi_base);
		},
		/// <method>
		/// <name>toggleStyleSheet</name>
		/// <param name="sTitle" type="String">Name of the stylesheet link.</param>
		/// <param name="bEnable" type="boolean">Bit indicating whether the stylesheet should be enabled.</param>	
		/// <description>Enables or disables the specified external stylesheet.</description>
		/// </method>
		///
		toggleStyleSheet : function(s, b){
			var a = document.documentElement.getElementsByTagName("link"),i=0;
			for(; i < a.length; i++)
				if(a[i].getAttribute("title") == s) a[i].disabled = (!b);
			
		},
		StyleSheetMap : [],
		/// <method>
		/// <name>loadStyleSheet</name>
		/// <param name="sUrl" type="String">Path to the external stylesheet.  Default root path is Hemi.base_path.</param>
		/// <param name="sName" type="String" optional = "1">Name of the stylesheet.</param>	
		/// <description>Imports the specified stylesheet.</description>
		/// </method>
		///
		loadStyleSheet : function(u, n){
			var _s = HemiEngine.css.StyleSheetMap, o, s, l;
			if(!n) n = u;
			if (_s[n]) return;
			/* location.protocol.match(/^http/i) && */
			/// if(!u.match(/^\//)) u = HemiEngine.hemi_base + u;
			if(!u.match(/^\//) && !u.match(/^http/)) u = HemiEngine.css.getCSSBase() + u;
			if(typeof document.createStyleSheet != DATATYPES.TYPE_UNDEFINED){
				o = document.createStyleSheet(u);
				if(o)
					_s[n] = o;
				
			}
			else{
				var s = "@import url(" + u + ");";
				l = document.createElement("link");
				l.setAttribute("href",u);
				l.setAttribute("rel","stylesheet");
				document.getElementsByTagName("head")[0].appendChild(l);
				_s[n] = l;

			}
		},
		/// <method>
		/// <name>getAbsoluteTop</name>
		/// <param name="o" type="object">Source DOM Node.</param>
		/// <param name="r" optional = "1" type="object">Reference DOM Node.</param>	
		/// <return-value type = "int" name = "i">The absolute top of the specified object from the parent window.</return-value>
		/// <description>Returns the absolute top position of the specified node.</description>
		/// </method>
		///
		getAbsoluteTop:function(o,r){
			return HemiEngine.css.getAbsolutePosition(o,r,1);
		},

		/// <method>
		/// <name>getAbsoluteLeft</name>
		/// <param name="o" type="object">Source DOM Node.</param>
		/// <param name="r" optional = "1" type="object">Reference DOM Node.</param>
		/// <return-value type = "int" name = "i">The absolute left of the specified object from the parent window.</return-value>
		/// <description>Returns the absolute left position of the specified node.</description>
		/// </method>
		///
		getAbsoluteLeft:function(o,r){
			return HemiEngine.css.getAbsolutePosition(o,r,0);
		},
		
		/// <method internal = "1">
		/// <name>getAbsolutePosition</name>
		/// <param name="o" type="object">Source DOM Node.</param>
		/// <param name="r" optional = "1" type="object">Reference DOM Node.</param>
		/// <param name="b" type="boolean">Bit indicating the position type</param>
		/// <return-value type = "int" name = "i">The absolute position of the specified object from the parent window.</return-value>
		/// <description>Returns the absolute position of the specified node.</description>
		/// </method>
		///
		getAbsolutePosition:function(o,r,b){
			var c=o,i=0;

			while(c != null && (!r || r != c) && c.nodeName && !c.nodeName.match(/body/i)){
				i += (b?(c.offsetTop?c.offsetTop:0):(c.offsetLeft?c.offsetLeft:0));
				c = c.offsetParent;
			}
			return i;
		},
		/// <method >
		/// <name>decodeJSON</name>
		/// <param name="s" type="String">An encoded JSON-esque string.</param>
		/// <return-value type = "Object" name = "o">The decoded object.</return-value>
		/// <description>Returns an object from the encoded construct.  The accepted pattern is: {#HF_NAME{name:value}}, and the returned value is an object whose first member is NAME and whose children is the encoded data.  For example: {#HF_Test{data:1}} would yield: {Test:{data:1}}, as a JavaScript object.</description>
		/// </method>
		///
		decodeJSON : function(s) {
            var r = /\{#HF_([A-Za-z0-9_]+){/,
            rf = /{#HF_[A-Za-z0-9_]*/,
			a,n,o;
            a = s.match(r);
            if (!a || a.length < 2) return 0;
            n = s.replace(rf, "").replace(/\}$/, "");
            try {
            	eval("o={" + a[1] + ":" + n + "};");
            }
            catch (e) {
            	alert(e.message ? e.message : e.description);
            	o = 0;
            }
            return o;
        }
	
	});
}());
///	</static-class>
/// </package>
/// </source>