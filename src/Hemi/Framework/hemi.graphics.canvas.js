/// <source>
/// <name>Hemi.graphics.canvas</name>
/// <project>
/// 	<name>Hemi JavaScript Framework</name>
/// 	<url-title>Hemi JavaScript Framework Project</url-title>
/// 	<url>/Hemi/</url>
/// </project>
///
/// <package>
///	<path>Hemi.graphics.canvas</path>
///	<library>Hemi</library>
///	<description>The Canvas class provides a shape management layer for browsers that support Canvas, including a temporary drawing layer and event to shape coordination.</description>
///	<static-class>
///		<name>Canvas</name>
///		<version>%FILE_VERSION%</version>
///		<description>Static initializer for CanvasInstance objects.</description>
///		<method>
/// 		<name>newInstance</name>
///			<param name="o" type="Node" optional = "1">XHTML Node reference, either a canvas element, or an element into which a canvas should be created.</param>
/// 		<return-value type = "CanvasInstance" name = "oCanvas">A new instance of the Canvas class.</return-value>
/// 		<description>Creates a new instance of the Hemi Graphics Canvas class.</description>
///		</method>
///
///	</static-class>
(function () {

	/*
	Check for IE, try injecting excanvas library, and try instrumenting excanvas
	*/
	if (!DATATYPES.TU(document.attachEvent)) {
		if (!HemiEngine.isImported("excanvas")) {
			HemiEngine.include("excanvas", "3rdParty/");
			if (typeof G_vmlCanvasManager != "undefined")
				G_vmlCanvasManager.init_(document);
		}
	}
	/// <object>
	///		<name>ShapeDecorator</name>
	///		<version>%FILE_VERSION%</version>
	///		<description>A shape decorator receives event dispatches from the CanvasInstance allowing managed shapes to be manipulated in response to those events.  Event properties and positions are captured prior to the event being dispatched to the decorator, and are available on the CanvasInstance.properties member.</description>
	///		<method virtual = "1">
	/// 		<name>handle_canvas_mousedown</name>
	///			<param name="oCanvas" type="CanvasInstance">A reference to the CanvasInstance.</param>
	///			<param name="vEvent" type="event">The event captured for the Canvas.</param>
	/// 		<description>Dispatched by the CanvasIntance for a mousedown event.</description>
	///		</method>
	///		<method virtual = "1">
	/// 		<name>handle_canvas_mousemove</name>
	///			<param name="oCanvas" type="CanvasInstance">A reference to the CanvasInstance.</param>
	///			<param name="vEvent" type="event">The event captured for the Canvas.</param>
	/// 		<description>Dispatched by the CanvasIntance for a mousemove event.</description>
	///		</method>
	///		<method virtual = "1">
	/// 		<name>handle_canvas_mouseup</name>
	///			<param name="oCanvas" type="CanvasInstance">A reference to the CanvasInstance.</param>
	///			<param name="vEvent" type="event">The event captured for the Canvas.</param>
	/// 		<description>Dispatched by the CanvasIntance for a mouseup event.</description>
	///		</method>
	/// </object>
	///	<class>
	///		<name>CanvasInstance</name>
	///		<version>%FILE_VERSION%</version>
	///		<description>The Canvas Graphics class provides a number of utitilies and helper methods for working with Canvas elements, and instrumenting and tracking objects created for the Canvas.</description>
	HemiEngine.include("hemi.event");
	HemiEngine.include("hemi.transaction");
	HemiEngine.include("hemi.util.logger");
	HemiEngine.namespace("graphics.canvas", HemiEngine, {
		newInstance: function (oContainer) {
			var n = HemiEngine.newObject("canvas", "%FILE_VERSION%");
			n.properties = {
				MouseTrackLeft: 0,
				MouseTrackTop: 0,
				MouseTrackDown: 0,
				MouseOffsetX: 0,
				MouseOffsetY: 0,
				DefaultShapeRadius: 20,
				DefaultShapeVerticalSpacing: 15,
				DefaultShapeHorizontalSpacing: 15,
				DefaultShapeGridUnit: (20 * 2) + (15 * 2),
				TransactionName: "canvas",
				PacketId: 0,
				IERasterMode: 0
			};
			n.objects = {
				container: oContainer,
				canvas: 0,
				canvas_2d: 0,
				temp_canvas: 0,
				temp_canvas_2d: 0,

				/// shapes contains object representations of vectors applied to the canvas
				///

				shapes: [],
				/// temp_shapes contains shapes currently applied to the temporary canvas
				///
				temp_shapes: [],

				/// shape_track_map is a jagged array of x-axis[int],y-axis[int],node_indices[]
				///
				shape_track_map: [],

				ShapeDecorators: [],
				MouseDownShape: 0,
				MouseDropShape: 0

			};
			n.sigterm = function () {
				this.destroy();
			};
			n.destroy = function () {
				if (this.ready_state != 5) {
					this.ready_state = 5;
					this.Clear();
					var _p = this.objects, _e = HemiEngine.event.removeEventListener;
					_e(_p.temp_canvas, 'mousedown', this._prehandle_canvas_mouse);
					_e(_p.temp_canvas, 'mousemove', this._prehandle_canvas_mouse);
					_e(_p.temp_canvas, 'mouseup', this._prehandle_canvas_mouse);
					_e(_p.temp_canvas, 'click', this._prehandle_canvas_mouse);
					_p.canvas.parentNode.removeChild(_p.canvas);
					_p.temp_canvas.parentNode.removeChild(_p.temp_canvas);

				}
			};
			n.getContainer = function () {
				return this.objects.container;
			};
			/// <method internal = "1" >
			/// 	<name>Initialize</name>
			/// 	<description>Initializes the Canvas Class.</description>
			/// </method>
			n.Initialize = function () {
				var oC = this.getContainer(), oT, _t = HemiEngine.transaction.service, oP, _p = this.properties, _o = this.objects, _e = HemiEngine.event.addEventListener;
				if (oC.nodeName.toLowerCase() != "canvas") {
					oC = document.createElement("canvas");
					this.getContainer().appendChild(oC);
				}
				_o.canvas = oC;
				if (typeof oC.getContext == "undefined") {
					if (typeof G_vmlCanvasManager != "undefined") {
						_p.IERasterMode = 1;
						G_vmlCanvasManager.initElement(oC);
					}
					/// If context is still undefined, leave
					///
					if (typeof oC.getContext == "undefined") {
						this.serveTransaction("canvas_available", this);
						HemiEngine.message.service.sendMessage("Browser does not support canvas", "200.4");
						return;
					}
				}
				oC.parentNode.style.position = "relative";
				_o.canvas_2d = oC.getContext("2d");
				oT = document.createElement("canvas");

				oT.style.cssText = "position:absolute;top:" + oC.offsetTop + "px;left:" + oC.offsetLeft + "px;";
				oT.width = oC.clientWidth;
				oT.height = oC.clientHeight;

				oC.parentNode.appendChild(oT);
				if (typeof oT.getContext == "undefined" && typeof G_vmlCanvasManager != "undefined") {
					G_vmlCanvasManager.initElement(oT);
				}
				_o.temp_canvas = oT;
				_o.temp_canvas_2d = oT.getContext("2d");



				this.scopeHandler("canvas_mouse", 0, 0, 1);
				_e(oT, 'mousedown', this._prehandle_canvas_mouse);
				_e(oT, 'mousemove', this._prehandle_canvas_mouse);
				_e(oT, 'mouseup', this._prehandle_canvas_mouse);
				_e(oT, 'click', this._prehandle_canvas_mouse);

				if (this.getContainer().getAttribute("height")) {
					this.Resize(this.getContainer().getAttribute("width"), this.getContainer().getAttribute("height"));
				}
				_p.canvas_supported = 1;

				HemiEngine.object.addObjectAccessor(this, "config");
				this.addNewConfig(this.getContextConfig(), "default");

				this.joinTransactionPacket();

				this.serveTransaction("canvas_available", this);




			};
			n._handle_canvas_impl_available = function (ts, tp) {
				tp.data.src.SetCanvasComponent(this);
			};
			/// <object>
			/// 	<name>ContextConfig</name>
			/// 	<description>Applies configuration to the context.</description>
			///     <property get = "1" name = "stroke" type = "variant">Stroke style</property>
			///     <property get = "1" name = "fill" type = "variant">Fill style</property>
			///     <property get = "1" name = "alpha" type = "variant">Global alpha</property>
			///     <property get = "1" name = "lineWidth" type = "variant">Line width</property>
			///     <property get = "1" name = "lineCap" type = "variant">Line cap</property>
			///     <property get = "1" name = "lineJoin" type = "variant">Line join</property>
			///     <property get = "1" name = "miterLimit" type = "variant">Miter limit</property>
			///     <property get = "1" name = "shadowOffsetX" type = "variant">Shadow offset X</property>
			///     <property get = "1" name = "shadowOffsetY" type = "variant">Shadow offset Y</property>
			///     <property get = "1" name = "shadowColor" type = "variant">Shadow color</property>
			///     <property get = "1" name = "globalComposite" type = "variant">Global composite operation</property>
			///     <property get = "1" name = "font" type = "variant">Font</property>
			///     <property get = "1" name = "textAlign" type = "variant">Text align</property>
			///     <property get = "1" name = "textBaseline" type = "variant">Text baseline</property>
			/// </object>
			/// <method>
			/// 	<name>getContextConfigByName</name>
			///     <param name = "name" type = "String">The name of the configuration</param>
			///     <return-value name = "cfg" type = "ContextConfig">The context configuration.</return-value>
			/// </method>
			/// <method>
			/// 	<name>newContextConfig</name>
			/// 	<description>Applies configuration to the context.</description>
			///     <param name = "name" type = "String">The name of the configuration.</param>
			///     <param optional = "1" name = "stroke" type = "variant">Stroke style</param>
			///     <param optional = "1" name = "fill" type = "variant">Fill style</param>
			///     <param optional = "1" name = "alpha" type = "variant">Global alpha</param>
			///     <param optional = "1" name = "lWidth" type = "variant">Line width</param>
			///     <param optional = "1" name = "lCap" type = "variant">Line cap</param>
			///     <param optional = "1" name = "lJoin" type = "variant">Line join</param>
			///     <param optional = "1" name = "miter" type = "variant">Miter limit</param>
			///     <param optional = "1" name = "shadowX" type = "variant">Shadow offset X</param>
			///     <param optional = "1" name = "shadowY" type = "variant">Shadow offset Y</param>
			///     <param optional = "1" name = "shadowColor" type = "variant">Shadow color</param>
			///     <param optional = "1" name = "composite" type = "variant">Global composite operation</param>
			///     <param optional = "1" name = "font" type = "variant">Font</param>
			///     <param optional = "1" name = "textAlign" type = "variant">Text align</param>
			///     <param optional = "1" name = "textBaseline" type = "variant">Text baseline</param>
			/// </method>
			n.newContextConfig = function (z, a, b, c, d, e, f, g, h, i, j, k, l, m, n) {
				var y = {
					stroke: a,
					fill: b,
					alpha: c,
					lineWidth: d,
					lineCap: e,
					lineJoin: f,
					miterLimit: g,
					shadowOffsetX: h,
					shadowOffsetY: i,
					shadowColor: j,
					globalComposite: k,
					font: l,
					textAlign: m,
					textBaseline: n
				};
				this.addNewConfig(y, z);
				return y;
			};
			/// <method>
			/// 	<name>setTemporaryContextConfig</name>
			///     <param name = "cfg" type = "ContextConfig">The context configuration</param>
			///     <description>Applies the specified context configuration to the context.</description>
			/// </method>
			n.setTemporaryContextConfig = function (c) {
				this.setContextConfig(c, this.getTemporaryContext());
			};
			n.getTemporaryContextConfig = function () {
				return this.setContextConfig(this.getTemporaryContext());
			};
			n.setContextConfig = function (c, o) {
				if (!o) o = this.getContext();
				if (typeof c == "string") c = this.getConfigByName(c);
				if (!c || !o) return;
				o.save();
				for (var i in c) {
					if (DATATYPES.TU(c[i])) continue;
					o[i] = c[i];
				}
			};
			/// <method>
			/// 	<name>getContextConfig</name>
			///     <param name = "ctx" type = "Context" optional = "1">Context from which the configuration is queried.</param>
			///     <return-value name = "cfg" type = "ContextConfig">The context configuration.</return-value>
			///     <description>Returns the current context configuration as applied to the context.</description>
			/// </method>
			n.getContextConfig = function (c) {
				if (!c) c = this.getContext();
				var o = this.newContextConfig();
				for (var i in o) {
					o[i] = c[i];
				}
				return o;
			};
			/// <method>
			/// 	<name>getContext</name>
			/// 	<description>Returns the Canvas 2D Context.</description>
			///     <return-value name = "ctx" type = "Context">The Canvas 2D Context</return-value>
			/// </method>
			n.getContext = function () {
				return this.objects.canvas_2d;
			};
			/// <method>
			/// 	<name>getTemporaryContext</name>
			/// 	<description>Returns the Temporary Canvas 2D Context.</description>
			///     <return-value name = "ctx" type = "Context">The Canvas 2D Context</return-value>
			/// </method>
			n.getTemporaryContext = function () {
				return this.objects.temp_canvas_2d;
			};
			/// <method>
			/// 	<name>AddShapeDecorator</name>
			/// 	<description>Adds a ShapeDecorator to the canvas.</description>
			/// </method>
			n.AddShapeDecorator = function (o) {
				this.objects.ShapeDecorators.push(o);
			};
			/// <method>
			/// 	<name>Clear</name>
			/// 	<description>Clears the Canvas and Temporary Canvas shapes and drawings.</description>
			/// </method>
			n.Clear = function () {
				this.ClearTempCanvas();
				this.ClearCanvas();
			};
			/// <method>
			/// 	<name>removeShape</name>
			/// 	<description>Removes the specified shape.</description>
			/// </method>
			
			n.removeShape = function (o) {
				var _p = this.objects,i=0,b=0,x=-1;
				if(!o) return b;
				for(; i < _p.shapes.length;i++){

					if(_p.shapes[i] && _p.shapes[i].id==o.id){
						delete _p.shapes[i];
						b = 1;
						x=i;
						break;
					}
				}
				if(x > -1){
					for(i = 0; i < _p.temp_shapes.length;i++){
						if(_p.temp_shapes[i] == x){
							delete _p.temp_shapse[i];
							break;
						}
					}
				}
				return b;
			};
			/// <method>
			/// 	<name>ClearTempCanvas</name>
			/// 	<description>Clears the Temporary Canvas shapes and drawings.</description>
			/// </method>
			n.ClearTempCanvas = function () {
				var _p = this.objects,i=0;
				
				for(; i < _p.temp_shapes.length;){
					if(typeof _p.temp_shapes[i] != DATATYPES.TYPE_NUMBER) continue;
					delete _p.shapes[_p.temp_shapes[i++]];
				}
				_p.shape_track_map = [];
				_p.temp_shapes = [];
				_p.temp_canvas_2d.clearRect(0, 0, _p.canvas.clientWidth, _p.canvas.clientHeight);
			};
			/// <method>
			/// 	<name>ClearCanvas</name>
			/// 	<description>Clears the Canvas shapes and drawings.</description>
			/// </method>
			n.ClearCanvas = function () {
				var _p = this.objects, a, i;
				_p.shape_track_map = [];
				_p.canvas_2d.clearRect(0, 0, _p.canvas.clientWidth, _p.canvas.clientHeight);
				_p.shapes = [];
				/// TODO: Delete non-vectors based on shape property, not blind delete all spans
				///
				a = _p.canvas.parentNode.getElementsByTagName("span");
				for (i = a.length - 1; i >= 0; i--) {
					_p.canvas.parentNode.removeChild(a[i]);
				}

			};
			/*
			bFix = target the main canvas, not the temp canvas
			*/
			/// <method>
			/// 	<name>Draw</name>
			///		<param name="oShape" type="Shape">The shape to be drawn.</param>
			///		<param name="bStroke" type="boolean">Bit indicating whether the shape should be stroked.</param>
			///		<param name="bFix" type="boolean" optional = "1">Dev value.</param>
			/// 	<description>Draws the specified shape onto the temporary canvas.</description>
			/// </method>
			n.Draw = function (o, b, x) {
				var _p = this.objects;
				if (typeof o != "object" || typeof o.type != "string") return;
				if (!o.rendered) {
					_p.temp_shapes.push(o.index);
					o.rendered = 1;
				}
				switch (o.type) {
					case "Triangle":
					case "Polygon":

						this.DrawPolygon(o);
						break;
					case "RoundedRect":

						this.DrawRoundedRect(o);
						break;
					case "Ellipse":

						this.DrawEllipse(o);
						break;
					case "Arc":

						this.DrawArc(o);
						/// this.DrawArc(o.x, o.y, o.radius, o.startAngle, o.endAngle, b, o.fillStyle, o.strokeStyle);
						break;
					case "Rect":

						this.DrawRect(o);
						break;
					case "Text":

						var bType = this.DrawText(o);
						if (bType == 2) o.is_html = 1;
						break;
					case "Image":

						this.DrawImage(o);
						break;
					default:
						alert("Unknown shape: " + o.type);
				}
			};
			/// <method internal = "1">
			/// 	<name>DrawPolygon</name>
			///		<param name="oShape" type="Shape">The shape to be drawn.</param>
			/// 	<description>Draws a polygon.</description>
			/// </method>
			n.DrawPolygon = function (o) {
				var _p = this.objects, tc2, aP = o.points, oP, oLP = 0;
				tc2 = _p.temp_canvas_2d;

				tc2.beginPath();
				if (o.fillStyle) tc2.fillStyle = o.fillStyle;
				if (o.strokeStyle) tc2.strokeStyle = o.strokeStyle;
				/// Hemi.log("Fill = " + o.fillStyle);
				for (var p = 0; p < aP.length; p++) {
					oP = aP[p];
					if (p == 0) {
						oLP = oP;
						tc2.moveTo(oP.x, oP.y);
					}
					else {
						tc2.lineTo(oP.x, oP.y);
						/// Hemi.log("Line " + p + ": " + oLP.x + "," + oLP.y);
					}



				}

				if (oLP && o.closePath) {
					/// Hemi.log("Line: " + oLP.x + "," + oLP.y);
					tc2.lineTo(oLP.x, oLP.y);
				}

				if (o.fillStyle) tc2.fill();
				if (o.strokeStyle) tc2.stroke();
				tc2.closePath();
			};
			/// <method internal = "1">
			/// 	<name>DrawRoundedRect</name>
			///		<param name="oShape" type="Shape">The shape to be drawn.</param>
			/// 	<description>Draws a rounded rectangular shape.  This function is based on the <a href = "http://canvaspaint.org">CanvasPaint</a> paint.js implementation.</description>
			/// </method>
			n.DrawRoundedRect = function (o) {
				/// RoundedRect  based on CanvasPaint's paint.js - http://canvaspaint.org
				///
				if (!o.type == "RoundedRect") return;
				var x1 = o.x, x2 = o.x + o.width, y1 = o.y, y2 = o.y + o.height
						, dx, dy, _p = this.objects, tc2
				;
				tc2 = _p.temp_canvas_2d;
				dx = Math.abs(x2 - x1);
				dy = Math.abs(y2 - y1);

				var dmin = (dx < dy) ? dx : dy;
				var cornersize = (dmin / 2 >= 15) ? 15 : dmin / 2;

				var xdir = (x2 > x1) ? cornersize : -1 * cornersize;
				var ydir = (y2 > y1) ? cornersize : -1 * cornersize;

				tc2.beginPath();
				tc2.fillStyle = o.fillStyle;
				tc2.strokeStyle = o.strokeStyle;
				tc2.moveTo(x1, y1 + ydir);
				tc2.quadraticCurveTo(x1, y1, x1 + xdir, y1);
				tc2.lineTo(x2 - xdir, y1);
				tc2.quadraticCurveTo(x2, y1, x2, y1 + ydir);
				tc2.lineTo(x2, y2 - ydir);
				tc2.quadraticCurveTo(x2, y2, x2 - xdir, y2);
				tc2.lineTo(x1 + xdir, y2);
				tc2.quadraticCurveTo(x1, y2, x1, y2 - ydir);
				tc2.fill();
				tc2.stroke();
				tc2.closePath();

			};
			/// <method internal = "1">
			/// 	<name>DrawEllipse</name>
			///		<param name="oShape" type="Shape">The shape to be drawn.</param>
			/// 	<description>Draws an ellipse shape.  This function is based on the <a href = "http://canvaspaint.org">CanvasPaint</a> paint.js implementation.</description>
			/// </method>
			n.DrawEllipse = function (o) {
				/// Elipse  based on CanvasPaint blog - http://canvaspaint.org/blog/2006/12/ellipse/
				///
				if (!o.type == "Ellipse") return;

				var x1 = o.x,
						x2 = o.x2,
						y1 = o.y,
						y2 = o.y2,
						kappa = o.kappa,
						rx, ry, cx, cy,
						 _p = this.objects,
						 tc2
				;
				tc2 = _p.temp_canvas_2d;
				rx = (x2 - x1) / 2;
				ry = (y2 - y1) / 2;
				cx = x1 + rx;
				cy = y1 + ry;

				tc2.beginPath();
				tc2.fillStyle = o.fillStyle;
				tc2.strokeStyle = o.strokeStyle;
				tc2.moveTo(cx, cy - ry);
				tc2.bezierCurveTo(cx + (kappa * rx), cy - ry, cx + rx, cy - (kappa * ry), cx + rx, cy);
				tc2.bezierCurveTo(cx + rx, cy + (kappa * ry), cx + (kappa * rx), cy + ry, cx, cy + ry);
				tc2.bezierCurveTo(cx - (kappa * rx), cy + ry, cx - rx, cy + (kappa * ry), cx - rx, cy);
				tc2.bezierCurveTo(cx - rx, cy - (kappa * ry), cx - (kappa * rx), cy - ry, cx, cy - ry);
				tc2.fill();
				tc2.stroke();
				tc2.closePath();
			};
			/// <method internal = "1">
			/// 	<name>DrawArc</name>
			///		<param name="oShape" type="Shape">The shape to be drawn.</param>
			/// 	<description>Draws an arc shape.</description>
			/// </method>
			/// n.DrawArc = function (x, y, r, s, e, b, f, c) {
			n.DrawArc = function (o) {
				/// o.x, o.y, o.radius, o.startAngle, o.endAngle, b, o.fillStyle, o.strokeStyle
				var _p = this.objects, tc2, f = o.fillStyle, c = o.strokeStyle;
				tc2 = _p.temp_canvas_2d;

				/// if (!f) f = tc2.fillStyle;
				/// if (!c) c = f;
				tc2.beginPath();
				if (f) tc2.fillStyle = f;
				if (c) tc2.strokeStyle = c;
				tc2.arc(o.x, o.y, o.radius, o.startAngle, o.endAngle, false);

				if (o.slice) tc2.lineTo(o.x, o.y);
				tc2.closePath();
				if (c) tc2.stroke();
				if (f) tc2.fill();

			};
			
			/// <method internal = "1">
			/// 	<name>DrawImage</name>
			///		<param name="oShape" type="Shape">The shape to be drawn.</param>
			/// 	<description>Draws an arc shape.</description>
			/// </method>
			/// n.DrawArc = function (x, y, r, s, e, b, f, c) {
			n.DrawImage = function (o) {
				/// o.x, o.y, o.radius, o.startAngle, o.endAngle, b, o.fillStyle, o.strokeStyle
				var _p = this.objects, tc2, f = o.fillStyle, c = o.strokeStyle;
				tc2 = _p.temp_canvas_2d;

				/// if (!f) f = tc2.fillStyle;
				/// if (!c) c = f;
				
				if (f) tc2.fillStyle = f;
				if (c) tc2.strokeStyle = c;
				tc2.drawImage(o.image, o.x, o.y, o.image.width, o.image.height);
			};
			
			/// <method internal = "1">
			/// 	<name>DrawRect</name>
			///		<param name="oShape" type="Shape">The shape to be drawn.</param>
			/// 	<description>Draws a rectangular shape.</description>
			/// </method>
			n.DrawRect = function (o) {

				var _p = this.objects, tc2,
					x = o.x, y = o.y, w = o.width, h = o.height, b = 0, f = o.fillStyle, c = o.strokeStyle
				;
				/// tc2 = _p[(o.rendered ? "canvas_2d" : "temp_canvas_2d")];
				tc2 = _p.temp_canvas_2d;
				if (!f) f = tc2.fillStyle;
				if (!c)
					c = f;

				tc2.fillStyle = f;
				tc2.strokeStyle = c;
				/// alert(x + "," + y + "\n" + w + "," + h);
				/// tc2[(b ? "strokeRect" : "fillRect")](x, y, w, h);
				/// alert(b + "?" + f + "\n" + c);

				if (f) tc2.fillRect(x, y, w, h);
				if (c) tc2.strokeRect(x, y, w, h);
			};
			/// <method internal = "1">
			/// 	<name>DrawText</name>
			///		<param name="oShape" type="Shape">The shape to be drawn.</param>
			/// 	<description>Draws a text shape.  If the measureText method is not implemented, a positioned HTML element is used to supply the text.</description>
			/// </method>
			n.DrawText = function (o) {

				var x = o.text, vX = o.x, vY = o.y, sColor = o.fillStyle, iH = 0, _o = this.objects,
                    sF = (o.size ? o.size : "10px") + " " + (o.font ? o.font : "Courier");
				;
				iH = _o.canvas.clientHeight;
				if (!sColor) sColor = "#000000";
				if (typeof _o.canvas_2d.measureText != "undefined") {
					_o.temp_canvas_2d.font = sF;
					_o.temp_canvas_2d.fillStyle = sColor;
					if (vX == "center") {
						var iW = _o.canvas.width;
						var iTW = _o.canvas_2d.measureText(x).width;
						if (iTW < iW) vX = (iW / 2) - (iTW / 2);
						else vX = 0;
					}
					vY += 10;
					/// this.log("Draw Text at " + vX + ", " + vY);
					_o.temp_canvas_2d.fillText(x, vX, vY);
					return 1;
				}
				else {

					var oT = document.createElement("span");
					oT.appendChild(document.createTextNode(x));
					oT.style.csx = "font: normal " + sF + ";color: " + sColor + ";position:absolute;top:" + vY + "px;left:" + vX + "px;";
					/// this.log("Draw Text at " + vX + ", " + vY);
					_o.canvas.parentNode.appendChild(oT);
					return 2;
				}
			};
			/// <method>
			/// 	<name>ConnectShapes</name>
			///		<param name="oShape" type="Shape">The source shape to be connected.</param>
			///		<param name="oShape" type="Shape">The target shape to be connected.</param>
			///		<param name="sType" type="String" optional = "1">Type of connection to draw. Currently supports "line" and "elbow" (default).</param>
			/// 	<description>Draws a connection between the two shapes.</description>
			/// </method>
			n.ConnectShapes = function (o1, o2, sT) {
				var _p = this.objects, tc2, x1 = o1.x, x2 = o2.x,
                y1 = o1.y, y2 = o2.y, w1 = o1.width, w2 = o2.width,
                h1 = o1.height, h2 = o2.height,
                yM = 1, xM = 1
                ;
				tc2 = _p.temp_canvas_2d;
				if (!sT) sT = "elbow";
				this.log(sT + " for " + w1 + "x" + h1 + " at " + x1 + ", " + y1 + " to " + w2 + "x" + h2 + " at " + x2 + "," + y2);
				/*
				If (x2 >= x1) center on top/right
				if(y2 + h2 < y1 center on top
				else center on right
				*/
				if (o1.type.match(/Rect/)) {
					/// positive o2 horz position
					///if (x2 >= x1) {
					/// top center 1
					/// >=
					/// x2 is over or off-center-right of x1
					if (x2 >= x1 && x2 < (x1 + w1)) {
						/// top center
						/// y2 is at least half-way above y1
						if ((y2 - h2 / 2) < y1) {
							this.log("top center: " + "(" + y2 + " + " + h2 + " / 2 ) < " + y1);
							x1 += parseInt(w1 / 2);
						}
						/// bottom center
						else if ((y2 + h2 / 2) > y1) {
							this.log("bottom center: " + "(" + y2 + " + " + h2 + " / 2 ) > " + y1);
							x1 += parseInt(w1 / 2);
							y1 += h1;
						}
						/// right center
						else {
							this.log("right center");
							x1 += w1;
							///y1 += parseInt(h1 / 2);
						}


					}
					/// left center 1
					else {

						/// left center 1
						
						if (x2 > x1) x1 += w1;
						y1 += parseInt(h1 / 2);
						this.log("right center 1: " + x1 + ", " + y1);
					}

					/// bottom center 2
					if ((y2 + h2) < y1) {
						/// negative vert position
						
						yM = 0;
						y2 += h2;
						x2 += parseInt(w2 / 2);
						this.log("bottom center 2: " + x2 + ", " + y2);
					}
					else {
						/// left center 2
						
						y2 += parseInt(h2 / 2);
						this.log("left center 2: " + x2 + ", " + y2);
					}
					/// }
					/// Negative 2o horz position
					/*
					else {
					/// top center 1
					if ((x2 + w2) > x1) {
					x1 += parseInt(w1 / 2);
					}
					/// left center1
					else {
					xM = -1;
					y1 += parseInt(h1 / 2);
					}
					/// bottom center 2
					if ((y2 + h2) < y1) {
					yM = -1;
					}
					}
					*/
				}
				/// Straight Line
				///
				if (sT == "line" || x2 == x1 || y2 == y1) {
					tc2.beginPath();
					tc2.moveTo(x1, y1);
					tc2.lineTo(x2, y2);
					/*
					tc2.moveTo(o1.x, o1.y);
					tc2.lineTo(o2.x, o2.y);
					*/
					tc2.stroke();
					tc2.closePath();
				}
				/// Elbow Connector
				///
				else if (sT == "elbow") {
					tc2.beginPath();
					tc2.fillStyle = "#FF0000";
					tc2.strokeStyle = "#FF0000";

					var iMod = 0;
					iMod = parseInt(o1.width / 2);
					tc2.moveTo(x1, y1);
					tc2.lineTo(x1, y1 + (yM * 10));
					tc2.lineTo(x2, y1 + (yM * 10));
					tc2.lineTo(x2, y2);
					/*
					tc2.moveTo(o1.x + iMod, o1.y + o1.height);
					tc2.lineTo(o1.x + iMod, o1.y + o1.height + 10);
					tc2.lineTo(o2.x + iMod, o1.y + o1.height + 10);
					tc2.lineTo(o2.x + iMod, o2.y);
					*/
					tc2.stroke();
					tc2.closePath();
				}
			},
			/// <method>
			/// 	<name>Rasterize</name>
			/// 	<description>Moves the shapes from the temporary canvas to the fixed canvas.</description>
			/// </method>
			n.Rasterize = function () {
				var _p = this.objects, a = [], i=0,x=0;

				/// Repaint temp objects from the temp canvas to the final canvas
				///
				/*
				if(this.properties.IERasterMode){
				for(var i = 0; i < _p.temp_shapes.length;i++) this.Draw(_p.temp_shapes[i]);	
				}
				else{
				*/
				_p.canvas_2d.drawImage(_p.temp_canvas, 0, 0);
				/*}*/
				/// Clear temp shapes out before clearing the canvas
				/// This will preserve the current shape objects
				///
				_p.temp_shapes = [];
				
				/// Repack the shapes array on Rasterize to clear out the dead space
				///

				for(;i<_p.shapes.length;i++){
					if(!_p.shapes[i]) continue;
					a[x] = _p.shapes[i];
					a[x].index = x++;
				}
				_p.shapes = a;
				this.ClearTempCanvas();
			};
			n.Ellipse = function (x, y, x2, y2, f, b) {
				var o = this.NewEllipse(x, y, x2, y2, f, b);
				this.Draw(o);
				return o;
			};
			n.Circle = function (x, y, r, f, b) {
				var o = this.NewCircle(x, y, r, f, b);
				this.Draw(o);
				return o;
			};
			n.RoundedRect = function (x, y, w, h, f, b) {
				var o = this.NewRoundedRect(x, y, w, h, f, b);
				this.Draw(o);
				return o;
			};
			n.Triangle = function (x, y, w, h, f, b) {
				var o = this.NewTriangle(x, y, w, h, f, b);
				this.Draw(o);
				return o;
			};
			n.Rect = function (x, y, w, h, f, b) {
				var o = this.NewRect(x, y, w, h, f, b);
				this.Draw(o);
				return o;
			};
			n.Text = function (e, x, y, f, s, sFz, sFf) {
				var o = this.NewText(e, x, y, f, s, sFz, sFf);
				this.Draw(o);
				return o;
			};
			n.Image = function (e, x, y, f, s) {
				var o = this.NewImage(e, x, y, f, s);
				this.Draw(o);
				return o;
			};
			n.Arc = function (x, y, r, s, e, b, f, k) {
				var o = this.NewArc(x, y, r, s, e, b, f, k);
				this.Draw(o);
				return o;
			};
			/// <method>
			/// 	<name>NewEllipse</name>
			///		<param name="x" type="int">First x axis.</param>
			///		<param name="y" type="int">First y axis.</param>
			///		<param name="x2" type="int">Second x axis.</param>
			///		<param name="y2" type="int">Second y axis.</param>
			///		<param name="sFill" type="String">Fill color.</param>
			///		<param name="sStroke" type="String">Stroke color.</param>
			///		<return-value name = "oShape" type = "Shape">A new shape object.</return-value>
			/// 	<description>Creates a new Ellipse Shape.</description>
			/// </method>
			n.NewEllipse = function (x, y, x2, y2, f, s) {
				var i = this.objects.shapes.length;
				return this.objects.shapes[i] = this.Merge(
					this.NewShape(i, "Ellipse", f, s),
					{
						x: x,
						y: y,
						x2: x2,
						y2: y2,
						kappa: 4 * ((Math.sqrt(2) - 1) / 3)
					}
				);
			};
			/// <method>
			/// 	<name>NewArc</name>
			///		<param name="x" type="int">X axis.</param>
			///		<param name="y" type="int">Y axis.</param>
			///		<param name="r" type="float">Radius.</param>
			///		<param name="s" type="float">Start angle (degrees).</param>
			///		<param name="e" type="float">End angle (degrees).</param>
			///		<param name="b" type="float">Stroke to slice.</param>
			///		<param name="sFill" type="String">Fill color.</param>
			///		<param name="sStroke" type="String">Stroke color.</param>
			///		<return-value name = "oShape" type = "Shape">A new shape object.</return-value>
			/// 	<description>Creates a new Circle Shape.</description>
			/// </method>
			n.NewArc = function (x, y, r, s, e, b, f, k) {
				var i = this.objects.shapes.length, v = (Math.PI / 180);
				return this.objects.shapes[i] = this.Merge(

					this.NewShape(i, "Arc", f, k),
					{
						x: x,
						y: y,
						radius: r,
						startAngle: s * v,
						endAngle: e * v,
						slice: b
					}
				);
			};
			/// <method>
			/// 	<name>NewCircle</name>
			///		<param name="x" type="int">X axis.</param>
			///		<param name="y" type="int">Y axis.</param>
			///		<param name="r" type="float">Radius.</param>
			///		<param name="sFill" type="String">Fill color.</param>
			///		<param name="sStroke" type="String">Stroke color.</param>
			///		<return-value name = "oShape" type = "Shape">A new shape object.</return-value>
			/// 	<description>Creates a new Circle Shape.</description>
			/// </method>
			n.NewCircle = function (x, y, r, f, s) {
				var i = this.objects.shapes.length;
				return this.objects.shapes[i] = this.Merge(
					this.NewShape(i, "Arc", f, s),
					{
						x: x,
						y: y,
						radius: r,
						startAngle: 0,
						endAngle: Math.PI * 2
					}
				);
			};
			/// <method>
			/// 	<name>NewImage</name>
			///		<param name="oImage" type="Image">The image object.</param>
			///		<param name="x" type="int">X axis.</param>
			///		<param name="y" type="int">Y axis.</param>
			///		<param name="sFill" type="String">Fill color.</param>
			///		<param name="sStroke" type="String">Stroke color.</param>
			///		<return-value name = "oShape" type = "Shape">A new shape object.</return-value>
			/// 	<description>Creates a new Image Shape.</description>
			/// </method>
			n.NewImage = function (e, x, y, f, s) {
				var i = this.objects.shapes.length;
				return this.objects.shapes[i] = this.Merge(
					this.NewShape(i, "Image", f, s),
					{
						x: x,
						y: y,
						image: e
					}
				);
			};
			/// <method>
			/// 	<name>NewText</name>
			///		<param name="sText" type="String">The text value.</param>
			///		<param name="x" type="int">X axis.</param>
			///		<param name="y" type="int">Y axis.</param>
			///		<param name="sFill" type="String">Fill color.</param>
			///		<param name="sFz" type="String">Font size</param>
			///		<param name="sFf" type="String">Font family.</param>
			///		<return-value name = "oShape" type = "Shape">A new shape object.</return-value>
			/// 	<description>Creates a new Text Shape.</description>
			/// </method>
			n.NewText = function (e, x, y, f, s, sFz, sFf) {
				var i = this.objects.shapes.length;
				return this.objects.shapes[i] = this.Merge(
					this.NewShape(i, "Text", f, s),
					{
						x: x,
						y: y,
						text: e,
						size: sFz,
						font: sFf
					}
				);
			};
			/// <method>
			/// 	<name>NewRoundedRect</name>
			///		<param name="x" type="int">X axis.</param>
			///		<param name="y" type="int">Y axis.</param>
			///		<param name="w" type="int">Width.</param>
			///		<param name="h" type="int">Height.</param>
			///		<param name="sFill" type="String">Fill color.</param>
			///		<param name="sStroke" type="String">Stroke color.</param>
			///		<return-value name = "oShape" type = "Shape">A new shape object.</return-value>
			/// 	<description>Creates a new RoundedRect Shape.</description>
			/// </method>
			n.NewRoundedRect = function (x, y, w, h, f, s) {
				var o = this.NewRect(x, y, w, h, f, s);
				o.type = "RoundedRect";
				return o;
			};
			/// <object>
			///		<name>Point</name>
			///		<description>Object that describes a point.</description>
			///		<property name = "x" type = "int" get = "1" private = "1">X position of the point.</property>
			///		<property name = "y" type = "int" get = "1" private = "1">Y position of the point.</property>
			/// </object>
			/// <method>
			/// 	<name>NewPoint</name>
			///		<param name="x" type="int">X axis.</param>
			///		<param name="y" type="int">Y axis.</param>
			///		<return-value name = "oPoint" type = "Point">A point object.</return-value>
			/// 	<description>Creates a new Point.</description>
			/// </method>
			n.NewPoint = function (iX, iY) {
				return { x: iX, y: iY };
			};
			/// <method>
			/// 	<name>NewTriangle</name>
			///		<param name="x" type="int">X axis.</param>
			///		<param name="y" type="int">Y axis.</param>
			///		<param name="w" type="int">Width.</param>
			///		<param name="h" type="int">Height.</param>
			///		<param name="sFill" type="String">Fill color.</param>
			///		<param name="sStroke" type="String">Stroke color.</param>
			///		<return-value name = "oShape" type = "Shape">A new isoscelese triangle object.</return-value>
			/// 	<description>Creates a new isoscelese Triangle Shape.</description>
			/// </method>
			n.NewTriangle = function (x, y, w, h, f, s) {
				var iT = parseInt(y - h / 2), aP = [];
				/// Top
				aP.push(this.NewPoint(x, parseInt(y - h / 2)));
				/// Left
				aP.push(this.NewPoint(parseInt(x - w / 2), parseInt(y + h / 2)));
				/// Right
				aP.push(this.NewPoint(parseInt(x + w / 2), parseInt(y + h / 2)));
				var o = this.NewPolygon(aP, f, s);
				o.type = "Triangle";
				o.closeShape = 1;
				return o;
			};
			/// <method>
			/// 	<name>NewPolygon</name>
			///		<param name="aPoints" type="Array&lt;Point&gt;">Array of points.</param>
			///		<param name="sFill" type="String">Fill color.</param>
			///		<param name="sStroke" type="String">Stroke color.</param>
			///		<return-value name = "oShape" type = "Shape">A new shape object.</return-value>
			/// 	<description>Creates a new Polygon Shape.</description>
			/// </method>
			n.NewPolygon = function (aP, f, s) {
				var i = this.objects.shapes.length;
				return this.objects.shapes[i] = this.Merge(
						this.NewShape(i, "Polygon", f, s),
						{
							points: aP,
							closeShape: 0
						}
					);
			};
			/// <method>
			/// 	<name>NewRect</name>
			///		<param name="x" type="int">X axis.</param>
			///		<param name="y" type="int">Y axis.</param>
			///		<param name="w" type="int">Width.</param>
			///		<param name="h" type="int">Height.</param>
			///		<param name="sFill" type="String">Fill color.</param>
			///		<param name="sStroke" type="String">Stroke color.</param>
			///		<return-value name = "oShape" type = "Shape">A new shape object.</return-value>
			/// 	<description>Creates a new Rect Shape.</description>
			/// </method>
			n.NewRect = function (x, y, w, h, f, s) {
				var i = this.objects.shapes.length;
				return this.objects.shapes[i] = this.Merge(
						this.NewShape(i, "Rect", f, s),
						{
							x: x,
							y: y,
							height: h,
							width: w
						}
					);
			};
			/// <object>
			///		<name>Shape</name>
			///		<description>Object that describes a shape that can be rendered to the Canvas.</description>
			///		<property name = "index" type = "int" get = "1" private = "1">Index of the shape in the shapes array.</property>
			///		<property type = "String" get = "1" name = "type">The type of the shape.</property>
			///		<property type = "int" get = "1" private = "1" name = "layerIndex">Dev only.</property>
			///		<property type = "int" get = "1" private = "1" name = "x">The shape x axis.  Applies to limited shapes.</property>
			///		<property type = "int" get = "1" private = "1" name = "x2">The second shape x axis.  Applies to limited shapes.</property>
			///		<property type = "int" get = "1" private = "1" name = "y">The shape y axis.  Applies to limited shapes.</property>
			///		<property type = "int" get = "1" private = "1" name = "y2">The second shape y axis.  Applies to limited shapes.</property>
			///		<property type = "float" get = "1" private = "1"  name = "kappa">The shape kappa.  Applies to limited shapes.</property>
			///		<property type = "float" get = "1" name = "startAngle">The beginning arc position.  Applies to limited shapes.</property>
			///		<property type = "float" get = "1" name = "endAngle" >The ending arc position.  Applies to limited shapes.</property>
			///		<property type = "float" get = "1" name = "radius">The arc radius.  Applies to limited shapes.</property>
			///		<property type = "int" get = "1" private = "1" name = "width">The shape width.  Applies to limited shapes.</property>
			///		<property type = "int" get = "1" private = "1" name = "height">The shape height.  Applies to limited shapes.</property>
			///		<property type = "String" get = "1" private = "1" name = "text" >The text value.  Applies to text shapes.</property>
			///		<property type = "array" get = "1" private = "1" name = "children">Dev only.</property>
			///		<property type = "int" get = "1" private = "1" name = "parent">Dev only.</property>
			///		<property type = "int" get = "1" name = "reference_id">Placeholder for coordinating shape objects with other objects.</property>
			///		<property type = "boolean" get = "1" name = "selectable">Bit indicating whether the shape should be captured as a source or target prior to dispatching events to any specified decorators.</property>
			///		<property type = "boolean" get = "1" private = "1" name = "is_html">Bit indicating whether HTML was used to accommodate an incomplete Canvas implemenetation.</property>
			///		<property type = "String" get = "1" name = "fillStyle">The fill style for the shape.</property>
			///		<property type = "String" get = "1" name = "strokeStyle">The stroke style for the shape.</property>
			///		<property type = "String" get = "1" name = "id" >The shape identifier.</property>
			///		<property type = "boolean" get = "1" name = "rendered" >Bit indicating whether the shape has been rendered.</property>
			/// </object>
			/// <method internal = "1">
			/// 	<name>NewShape</name>
			///		<param name="index" type="int">The internal index of the shape in the shapes array.</param>
			///		<param name="sType" type="String">The type of the shape.</param>
			///		<param name="sFill" type="String">Fill color.</param>
			///		<param name="sStroke" type="String">Stroke color.</param>
			///		<return-value name = "oShape" type = "Shape">A new shape object.</return-value>
			/// 	<description>Creates a new Shape.</description>
			/// </method>
			n.NewShape = function (i, y, f, s) {

				return {
					index: i,
					type: y,
					layerIndex: 0,
					fillStyle: f,
					strokeStyle: s,
					id: HemiEngine.guid(),
					rendered: 0,
					children: [],
					parent: 0,
					is_html: 0,
					reference_id: -1,
					selectable: 1
				};
			};
			n.Merge = function (s, t) {
				for (var i in s) {
					if (typeof t[i] == "undefined") t[i] = s[i];
				}
				return t;
			};
			/// <method>
			/// 	<name>getShapeById</name>
			///		<param name="i" type="String">A shape id</param>
			///		<return-value name = "oShape" type = "Shape">A shape object.</return-value>
			/// 	<description>Returns the shape with the specified shape id.</description>
			/// </method>
			n.getShapeById = function (x) {
				var _p = this.objects,i =0, o;
				for(i=0; !o && i < _p.shapes.length;i++){
					if(!_p.shapes[i]) continue;
					if(_p.shapes[i].id == x){
						o = _p.shapes[i];
						break;
					}
				}
				return o;
			};
			/// <method>
			/// 	<name>ShapeAt</name>
			///		<param name="x" type="int">The x axis.</param>
			///		<param name="y" type="int">The y axis.</param>
			///		<return-value name = "oShape" type = "Shape">A shape object.</return-value>
			/// 	<description>Returns the first shape at the specified coordinates, and caches the location until the canvas is cleared.</description>
			/// </method>
			n.ShapeAt = function (x, y) {
				var _p = this.objects;
				if (typeof _p.shape_track_map[x] == "object" && typeof _p.shape_track_map[x][y] == "number") {
					return _p.shapes[_p.shape_track_map[x][y]];
				}

				var oS = this.FindShapeAt(x, y);
				if (oS) {
					if (typeof _p.shape_track_map[x] != "object") _p.shape_track_map[x] = [];
					_p.shape_track_map[x][y] = oS.index;
				}
				return oS;
			};
			/// <method internal = "1">
			/// 	<name>FindShapeAt</name>
			///		<param name="x" type="int">The x axis.</param>
			///		<param name="y" type="int">The y axis.</param>
			///		<return-value name = "oShape" type = "Shape">A shape object.</return-value>
			/// 	<description>Finds a shape at the specified coordinates.</description>
			/// </method>
			n.FindShapeAt = function (x, y) {
				var oShape, oMatch = 0, _p = this.objects;
				
				/// TODO: 2012/12/26 - Need to search shapes by zIndex instead of just sniffing through the array
				/// As it stands, I reversed the array to look back to front and prefer the last over the prior in selecting a match.
				/// But zIndex matching is the better option.
				/// And better collision detection.
				///
				var aS = _p.shapes;
				
				for (var i = aS.length - 1; i >= 0; i--) {
					if (!(oShape = aS[i]) || !oShape.selectable) continue;
					switch (oShape.type) {

						case "Arc":
							/// Not valid - replace with point - circle intersection
							///
							if (x >= oShape.x && x <= (oShape.x + (oShape.radius * 2)) && y >= oShape.y && y <= (oShape.y + (oShape.radius * 2))) oMatch = oShape;
							break;
						case "Rect":
							if (x >= oShape.x && x <= (oShape.x + oShape.width) && y >= oShape.y && y <= (oShape.y + oShape.height)) oMatch = oShape;
							break;
						case "Image":
							if (x >= oShape.x && x <= (oShape.x + oShape.image.width) && y >= oShape.y && y <= (oShape.y + oShape.image.height)) oMatch = oShape;
							break;
						default:
							/// HemiEngine.message.service.sendMessage("Skip: " + oShape.type + " : " + oShape.x);
							break;
					}
					if (oMatch) break;
				}
				return oMatch;
			};
			/// <method internal = "1">
			/// 	<name>handle_canvas_click</name>
			///		<param name="e" type="event">Event.</param>
			/// 	<description>Dispatches the click event to any specified decorators.  Sets the MouseTrackLeft, MouseTrackTop, and MouseDropShape property.</description>
			/// </method>			
			n.handle_canvas_click = function (e) {
				if(this.getProperties().blockClick){
					this.log("Internal cancel click event");
					this.getProperties().blockClick = 0;
					return false;
				}
				///this.objects.MouseDropShape = this.ShapeAt(this.properties.MouseTrackLeft, this.properties.MouseTrackTop);
				this.objects.MouseClickShape = this.ShapeAt(this.properties.MouseTrackLeft, this.properties.MouseTrackTop);
				var r = this.dispatch_decorators(e);
				this.objects.MouseClickShape = 0;
				return r;
			};
			/// <method internal = "1">
			/// 	<name>handle_canvas_mousemove</name>
			///		<param name="e" type="event">Event.</param>
			/// 	<description>Dispatches the mousemove event to any specified decorators.  Sets the MouseTrackLeft, MouseTrackTop, and MouseDropShape property.</description>
			/// </method>			
			n.handle_canvas_mousemove = function (e) {
				var _o = this.objects, _s = this.properties,ld=0,r;
				/// this.log("Track: " + _s.MouseTrackLeft + "," + _s.MouseTrackTop);
				_o.MouseDropShape = this.ShapeAt(_s.MouseTrackLeft, _s.MouseTrackTop);
				this.dispatch_decorators(e);
				
				/// Compute mouseout/mouseover events
				///
				/// If there was a mouse over shape captured, and it's not the current, release the last object
				///
				/// this.log("Figure mouse over at " + _s.MouseTrackLeft + "," + _s.MouseTrackTop + " with " + _o.MouseDropShape + " and " + _o.MouseOverShape);
				
				if(_o.MouseOverShape && (!_o.MouseDropShape || _o.MouseDropShape.id != _o.MouseOverShape.id)){
					ld = _o.MouseOverShape.id;
					/// this.log("Dispatch mouseout: " + _o.MouseDropShape.id + " to " + (_o.MouseDownShape ? _o.MouseDownShape.id : " nothing"));
					r = this.dispatch_decorators(e, "mouseout");
					
					_o.MouseOverShape = 0;
				}
				if(_o.MouseDropShape && _o.MouseDropShape.id != ld && !_o.MouseOverShape){
					_o.MouseOverShape = _o.MouseDropShape;
					/// this.log("Dispatch mouseover: " + _o.MouseDropShape.id);
					r = this.dispatch_decorators(e, "mouseover");
				}
				return r;
			};
			/// <method internal = "1">
			/// 	<name>handle_canvas_mouseup</name>
			///		<param name="e" type="event">Event.</param>
			/// 	<description>Dispatches the mouseup event to any specified decorators. Clears MouseTrack* properties.</description>
			/// </method>			
			/// <property type = "Shape" get = "1">
			/// 	<name>properties.MouseDropShape</name>
			/// 	<description>The shape at the current MouseTrackLeft and MouseTrackTop location.</description>
			/// </property>
			/// <property type = "Shape" get = "1">
			/// 	<name>properties.MouseDownShape</name>
			/// 	<description>The shape at the MouseTrackLeft and MouseTrackTop location where the mousedown event fired.</description>
			/// </property>
			/// <property type = "boolean" get = "1">
			/// 	<name>properties.MouseTrackDown</name>
			/// 	<description>Bit indicating whether the mousedown event is in effect.</description>
			/// </property>
			/// <property type = "boolean" get = "1">
			/// 	<name>properties.MouseTrackChoose</name>
			/// 	<description>Bit indicating whether the mousedown event captured a shape.</description>
			/// </property>
			/// <property type = "int" get = "1">
			/// 	<name>properties.MouseTrackLeft</name>
			/// 	<description>The left axis of the mouse in the canvas.</description>
			/// </property>
			/// <property type = "int" get = "1">
			/// 	<name>properties.MouseTrackTop</name>
			/// 	<description>The top axis of the mouse in the canvas.</description>
			/// </property>
			/// <property type = "int" get = "1">
			/// 	<name>properties.MouseOffsetX</name>
			/// 	<description>The left offset of the mouse position from the shape edge.</description>
			/// </property>
			/// <property type = "int" get = "1">
			/// 	<name>properties.MouseOffsetY</name>
			/// 	<description>The top offset of the mouse position from the shape edge.</description>
			/// </property>

			n.handle_canvas_mouseup = function (e) {
				var _s = this.properties;
				var r = this.dispatch_decorators(e);
				_s.MouseTrackDown = 0;
				this.objects.MouseDownShape = 0;
				this.objects.MouseDropShape = 0;
				_s.MouseTrackChoose = 0;
				_s.MouseOffsetX = 0;
				_s.MouseOffsetY = 0;
				if(typeof r != DATATYPES.TYPE_UNDEFINED && !r) this.getProperties().blockClick = 1;
				return r;
				/// _s.MouseTrackLeft = 0;
				/// _s.MouseTrackTop = 0;
			};
			/// <method internal = "1">
			/// 	<name>dispatch_decorators</name>
			///		<param name="e" type="event">Event.</param>
			/// 	<description>Dispatches the specified event to specified decorators.</description>
			/// </method>	
			n.dispatch_decorators = function (e,a) {
				var aD = this.objects.ShapeDecorators, s = (a ? a : e.type),r,z;
				/// this.log("Dispatch " + e.type + " to " + aD.length + " decorators");
				
				for (var i = 0; i < aD.length; i++) {
					if (typeof aD[i]["handle_canvas_" + s] == "function"){
						z = aD[i]["handle_canvas_" + s](this, e);
						if(typeof z != "undefined" && !z) r = false;
					}
				}
				return r;
			};
			/// <method internal = "1">
			/// 	<name>handle_canvas_mousedown</name>
			///		<param name="e" type="event">Event.</param>
			/// 	<description>Dispatches the mousedown event to any specified decorators. Sets the MouseTrackLeft, MouseTrackTop, MouseTrackChoose, MouseTrackDown, and MouseDownShape properties.</description>
			/// </method>	
			n.handle_canvas_mousedown = function (e) {
				var _s = this.properties;
				_s.MouseTrackDown = 1;
				if(this.registerMouseDownShape(e)){
					_s.MouseTrackChoose = 1;
				}
				return this.dispatch_decorators(e);
			};
			n.registerMouseDownShape = function(e){
				var _s = this.properties;
				var oShape = this.ShapeAt(_s.MouseTrackLeft, _s.MouseTrackTop);
				if (oShape) {
					this.objects.MouseDownShape = oShape;
					_s.MouseOffsetX = _s.MouseTrackLeft - oShape.x;
					_s.MouseOffsetY = _s.MouseTrackTop - oShape.y;
				}
				return oShape;
			};
			/// <method internal = "1">
			/// 	<name>_handle_canvas_mouse</name>
			///		<param name="e" type="event">Event.</param>
			/// 	<description>Routes mouse events.</description>
			/// </method>	
			n._handle_canvas_mouse = function (e) {
				e = HemiEngine.event.getEvent(e);
				var sHandler = "handle_canvas_" + e.type, r;
				/// this.log("Dispatch: " + sHandler);
				this.properties.MouseTrackLeft = (typeof e.layerX == "number" ? e.layerX : e.offsetX);
				this.properties.MouseTrackTop = (typeof e.layerY == "number" ? e.layerY : e.offsetY);

				if (typeof this[sHandler] == "function") r = this[sHandler](e);
				return r;
			};
			/// <method>
			/// 	<name>Resize</name>
			///		<param name="width" type="String">New width value.</param>
			///		<param name="height" type="String">New height value.</param>
			/// 	<description>Resizes the canvas and temporary canvas elements.</description>
			/// </method>	
			n.Resize = function (x, y) {
				var _p = this.objects;
				this.getContainer().style.width = x;
				this.getContainer().style.height = y;
				_p.canvas.setAttribute("height", y);
				_p.canvas.setAttribute("width", x);
				_p.temp_canvas.setAttribute("height", y);
				_p.temp_canvas.setAttribute("width", x);
				_p.temp_canvas.style.cssText = "position:absolute;top:" + _p.canvas.offsetTop + "px;left:" + _p.canvas.offsetLeft + "px;";
			};

			HemiEngine.event.addScopeBuffer(n);
			HemiEngine.registry.service.addObject(n);
			HemiEngine.transaction.service.register(n, 1);

			HemiEngine.util.logger.addLogger(n, "Canvas Instance", "Canvas Instance", 230);

			n.ready_state = 4;
			n.Initialize();

			return n;
		}
	});
} ());
/// </class>
/// </package>
/// </source>