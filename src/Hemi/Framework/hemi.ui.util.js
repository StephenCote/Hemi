/// <source>
/// <name>Hemi.ui.util</name>
/// <project>
/// 	<name>Hemi JavaScript Framework</name>
/// 	<url-title>Hemi JavaScript Framework Project</url-title>
/// 	<url>/Hemi/</url>
/// </project>
///
/// <package>
///	<path>Hemi.ui</path>
///	<library>Hemi</library>
///	<description>The utility class includes Web UI help functions.</description>
///	<static-class>
///		<name>util</name>
///		<version>%FILE_VERSION%</version>
///		<description>Hemi framework utilities</description>
(function(){
	HemiEngine.include("hemi.css");
	HemiEngine.namespace("ui.util", HemiEngine, {
		/// <method>
		/// <name>getIsRequested</name>
		/// <param name="o" type="object">Object to test whether it has been requested.</param>
		/// <return-value name = "b" type = "boolean">Bit indicating whether the control is currently requested for display.</return-value>
		/// <description>Returns a bit indicating whether or not the control is requested for display.</description>
		/// </method>
		getIsRequested : function(o){
			return o.properties.is_requested;
		},
		/// <method>
		/// <name>request</name>
		/// <param name="t" type="FrameworkObject">Control that is making the request.</param>
		/// <param name="o" type="Node">Target node for which the control is being requested.</param>
		/// <param name="c" type="Node">Container node used by the control for display.</param>
		/// <description>Associates a control with a node, and keeps track of the request status.</description>
		/// </method>
		request : function(t, o, c){
			var _s = t.properties,b;
			if(!_s.can_request){
				HemiEngine.logError("Cannot request control");
				return 0;
			}
			if(_s.is_requested){
				b = (o == t.objects.request_object) ? 1 : 0;
				t.endRequest(t, c);
				if(b) return 0;
			}
			/*
				Position the control
			*/
			t.objects.request_object = o;
			HemiEngine.ui.util.alignControl(t, o, c);
			_s.is_requested = 1;
			return 1
		},
		/// <method>
		/// <name>endRequest</name>
		/// <param name="t" type="FrameworkObject">Control that is making the request.</param>
		/// <param name="c" type="Node">Container node used by the control for display.</param>
		/// <description>Hides the WideSelectInstance control if requested.</description>
		/// </method>
		endRequest : function(t, c){
		
			var _p = t.objects,_s = t.properties;
			_s = t.properties;
			if(!_s.is_requested || !_s.can_request) return 0;

			c = (c ? c : _p.c);
			/// Relying on consistency that {hemi-object}.objects.c is the holder for the container object
			/// Otherwise use .getContainer()
			/// 
			c.style.display = "none";
			///if(_s.is_paging) t.clearItems();
			
			_s.is_requested = 0;
		
			_p.request_object = null;
			return 1;

		},

		/// <method>
		/// <name>alignControl</name>
		/// <param name="t" type="FrameworkObject">Control to be aligned.</param>
		/// <param name="o" type="Node">Target node for which the control is being aligned.</param>
		/// <param name="c" type="Node">Container node used by the control for display.</param>
		/// <return-value name = "b" type = "boolean">Bit indicating whether the control is currently requested for display.</return-value>
		/// <description>Returns a bit indicating whether or not the control is requested for display.</description>
		/// </method>
		alignControl : function(s, o, c){
			var
				/* document width */
				/*p_w = document.documentElement.offsetWidth,*/
				/* document height */
				/*p_h = document.documentElement.offsetHeight,*/
				/* request object width */
				w = o.offsetWidth,
				/* request object height */
				h = o.offsetHeight,
				/* request object left */
				l = HemiEngine.css.getAbsoluteLeft(o),
				/* request object top */
				t = HemiEngine.css.getAbsoluteTop(o),
				/* main control width */
				c_w,
				/* main control height */
				c_h,
				/* rr_w = remaining right width */
				/*rr_w,*/
				/* rl_w = remaining left width */
				/*rl_w,*/
				_p = s.objects,
				_s = s.properties

			;
			c.style.display = "block";

			c_w = c.offsetWidth;
			c_h = c.offsetHeight;	
			
			/* don't care about top position right now, it's adjacent */
			c.style.top = (t + h) + "px";
			c.style.left = l + "px";
		
		}
	});
}());
/// </static-class>
	/// </package>
	/// </source>