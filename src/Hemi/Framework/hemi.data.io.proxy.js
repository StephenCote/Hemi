/// <source>
/// <name>Hemi.data.io</name>
/// <project>
/// 	<name>Hemi JavaScript Framework</name>
/// 	<url-title>Hemi JavaScript Framework Project</url-title>
/// 	<url>/Hemi/</url>
/// </project>
///
/// <package>
///	<path>Hemi.data.io</path>
///	<library>Hemi</library>
///	<description>The Data IO service is used to broker data requests with configured data providers.  The built-in interchange format is loosely modelled on the Account Manager 4 Data and Group object model, but the implementation is open for any object type.</description>
(function () {

	HemiEngine.include("hemi.util.logger");
	HemiEngine.include("hemi.transaction");
	HemiEngine.include("hemi.data.io");
	HemiEngine.include("hemi.event");

	HemiEngine.namespace("data.io.proxy", HemiEngine, {
		service: null,
		///	<static-class>
		///		<name>service</name>
		///		<version>%FILE_VERSION%</version>
		///		<description>Static implementation of the hemi.data.io.proxy.serviceImpl class.</description>
		///
		///
		///	</static-class>
		///	<class>
		///		<name>serviceImpl</name>
		///		<version>%FILE_VERSION%</version>
		///		<description>The Data IO proxy service marshals custom protocol requests through Data IO providers.</description>
		///

		serviceImpl: function () {
			var t = this;
			t.properties = {
				re: /^(none:)/,
				busType: 0,
				/// Change the bus type automatically based on the transaction
				///
				autoChangeBus: 1
			};
			t.objects = {
				proxies: [],
				requests: []
			};
			HemiEngine.prepareObject("io_proxy_service", "%FILE_VERSION%", 1, t, 1);
			HemiEngine.event.addScopeBuffer(t);

			/// <method internal = "1">
			/// 	<name>buildMatcher</name>
			/// 	<description>Builds the expression matcher for custom protocols.</description>
			/// </method>
			t.buildMatcher = function () {
				var a = [], i;
				for (i in this.objects.proxies) {
					if (DATATYPES.TS(i)) a.push(i);
				}
				this.properties.re = new RegExp("^(" + a.join("|") + ")");

			};
			/// <method internal = "1">
			/// 	<name>unregister</name>
			///		<param name = "oProvider" type = "ProviderStruct">Internal Provider Structure</param>
			/// 	<return-value type = "bit" name = "bUnregistered">Bit indicating the provider was unregistered as providing a proxy.</return-value>
			/// 	<description>Delinks a provider from a custom protocol proxy.</description>
			/// </method>
			t.unregister = function (o) {
				_p = t.objects.proxies, b = 0, i = o.properties.proxy;
				if (_p[i]) {
					delete _p[i];
					b = 1;
					t.buildMatcher();
				}
				return b;
				/*
				for (var i in _p) {
				if (_p[i] && _p[i].object_id == o.object_id) {
				delete _p[i];
				b = 1;
				break;
				}
				}
				return b;
				*/
			};
			/// <method internal = "1">
			/// 	<name>register</name>
			///		<param name = "oProvider" type = "ProviderStruct">Internal Provider Structure</param>
			/// 	<return-value type = "bit" name = "bUnregistered">Bit indicating the provider was registered as providing a custom protocol proxy.</return-value>
			/// 	<description>Links a provider to a custom protocol proxy.</description>
			/// </method>
			t.register = function (o, p) {
				var _p = t.objects.proxies, b = 0;
				if (!_p[p]) {
					_p[p] = o;
					o.proxy = p;
					b = 1;
					t.buildMatcher();
					this.log("Register proxy provider " + o.object_id + " for " + p + ":");
				}
				return b;
			};
			/// <method>
			/// 	<name>isProxyProtocol</name>
			///		<param name = "sUri" type = "String">A URI pattern.</param>
			/// 	<return-value type = "bit" name = "bProxied">Bit indicating the provided URI pattern matches a registered protocol proxy.</return-value>
			/// 	<description>Tests whether a URI pattern matches a registered protocol proxy.</description>
			/// </method>
			t.isProxyProtocol = function (p, b) {
				return (DATATYPES.TS(p) && p.match(t.properties.re));
			};
			/// <method>
			/// 	<name>isProxied</name>
			///		<param name = "sUri" type = "String">A URI pattern.</param>
			///		<param name = "iBusType" type = "int" optional = "1">The bus type to use when determining proxy applicability.</param>
			/// 	<return-value type = "bit" name = "bProxied">Bit indicating the provided URI pattern matches a registered protocol proxy.</return-value>
			/// 	<description>Tests whether a URI pattern may be proxied based on a custom protocol.</description>
			/// </method>
			t.isProxied = function (p, b) {
				var m, r;
				/// b = (b ? b : t.properties.busType);
				r = (
					DATATYPES.TS(p)
					&&
					(m = p.match(t.properties.re))
					&&
					(b ? b : t.properties.busType) == t.objects.proxies[m[0]].bus
				);
				/*
				if (m) {
				this.log("Proxy: " + m[0]);
				this.log("Proxy Bus: " + t.objects.proxies[m[0]].bus);
				this.log("Match Bus: " + (b ? behavior : t.properties.busType));
				}
				*/
				/* r = (r && (b ? b : t.properties.busType) == t.objects.proxies[m[0]].bus);*/
				return r;

			};
			/// <method>
			/// 	<name>setAutoChangeBus</name>
			///		<param name = "bAuto" type = "bit">Bit indicating whether the proxy bus should track with the "iobus" transaction.</param>
			/// 	<description>Specify whether the proxy service should change the current bus based on the "iobus" transaction.</description>
			/// </method>
			t.setAutoChangeBus = function (b) {
				this.properties.autoChangeBus = (b ? 1 : 0);
			};
			/// <method>
			/// 	<name>setBusType</name>
			///		<param name = "iType" type = "BUSTYPE">The current bus.</param>
			/// 	<description>Specify the current bus the proxy service should use.</description>
			/// </method>
			t.setBusType = function (i) {
				this.properties.busType = i;
			};

			/// <method>
			/// 	<name>stripProxyProtocol</name>
			///		<param name = "sUri" type = "BUSTYPE">The current bus.</param>
			/// 	<description>Specify the current bus the proxy service should use.</description>
			/// </method>
			t.stripProxyProtocol = function (p) {
				if (DATATYPES.TS(p)) p = p.replace(this.properties.re, "");
				return p;
			};

			/// <method virtual = "1">
			/// 	<name>_handle_change_bus</name>
			///		<param name = "oService" type = "TransactionService">The service handling this channel.</param>
			///		<param name = "oPacket" type = "TransactionPacket">The packet being served.</param>
			/// 	<description>Update the proxied bus type from the "iobus" transaction.</description>
			/// </method>
			t._handle_change_bus = function (s, v) {
				var _p = this.properties;
				if (v && DATATYPES.TN(v.data.src) && _p.autoChangeBus)
					_p.busType = v.data.src;
			};

			/// <method internal = "1">
			/// 	<name>proxyXml</name>
			///		<param name = "sPath" type = "String">The URI to an XML/Text/JSON Resource decorated with the proxy protocol.</param>
			///		<param name="h" type="function" optional="1" default="null">Handler invoked for asynchronous requests.</param>
			///		<param name = "bAsync" type = "bit">Bit indicating wether the request is asynchronous. Currently limited to synchronous; async requests will be ignored.</param>
			///		<param name = "sId" type = "String">Identifier associated with the request.</param>
			///		<param name = "bPost" type = "bit">Bit indicating wether the request should be made via HTTP POST.</param>
			///		<param name = "vData" type = "variant">Data to be included as the POST payload, such as an XMLDocument, text, or JSON structure.</param>
			///		<param name="c" type="boolean" optional="1" default = "false">Bit indicating whether the response should be cached.</param>
			///		<param name="t" type="int" optional="1" default = "0">Int indicating whether the request and response as text (1) or JSON (2) instead of XML (0).</param>
			///		<return-value name = "oXml" type = "HemiXML">Returns an internal XML construct.</return-value>
			/// 	<description>Proxies an XML URI Request to the registered provider for the matching protocol.  TODO: Instrument async handling to proxy async Data IO response through XML Async Response.</description>
			/// </method>
			t.proxyXml = function (p, h, a, i, x, d, c, t) {
				var b, o, r, _p = this.properties, q, _o = this.objects, v;
				b = (a ? false : null);
				if (!this.isProxied(p)) {
					this.logError("URI is not proxied: " + p);
					return b;
				}
				o = _o.proxies[p.match(_p.re)[0]];
				if (!o || !o.proxy || !(o = Hemi.registry.service.getObject(o.providerId))) {
					this.logError("Proxy provider no longer available for " + p);
					return b;
				}

				r = o.handle_proxy_xml(p.replace(_p.re, ""), i, x, d, t, _p.busType);
				if (!r) {
					this.logError("Error composing Data IO Request for " + p);
					return b;
				}
				v = {
					requestId: r.requestId,
					responseId: 0,
					textMode: t,
					xmlHandler: h,
					id: i
				};

				if (a) {
					r.async = 1;
					_o.requests[r.requestId] = v;
				}
				Hemi.data.io.service.openRequest(
					Hemi.data.io.service.getSubject(),
					r,
					(a ? this._prehandle_xml_io_request : 0)
				);
				if (a) return true;
				v.responseId = r.responseId;
				q = Hemi.data.io.service.getResponseByName(r.responseId);
				b = this.composeXmlResponse(v, q);
				HemiEngine.message.service.publish("onloadxml", b);
				if (typeof h == DATATYPES.TYPE_FUNCTION) h("onloadxml", b);
				return (t ? (t == 2 ? b.json : b.text) : b.xdom);

				/*
				2011/02/22 - TODO - Instrument async handling
				*/

				/*
				a = p.replace(_p.re, "").split("/");
				this.log("Proxy " + m[0] + " type for " + p);
				switch (m[0]) {
				case "dwac:":

				return this.queryData("Read", a[0], a[1], a[1], a[2], 0, 1, 0, "text/xml", 0);
				break;
				}
				*/
				/// return b;

			};
			t._handle_xml_io_request = function (oService, oSubject, oRequest, oResponse) {
				var v, _o = this.objects, b;
				v = _o.requests[oRequest.requestId];
				this.log("Handle IO Response");
				if (!v) {
					this.logError("Invalid proxy request: " + oRequest.requestId);
					return;
				}
				delete _o.requests[oRequest.requestId];
				b = this.composeXmlResponse(v, oResponse);
				if (!b) {
					this.logError("Invalid data for request " + oRequest.requestId);
					return;
				}
				HemiEngine.message.service.publish("onloadxml", b);
				if (typeof v.xmlHandler == DATATYPES.TYPE_FUNCTION) v.xmlHandler("onloadxml", b);

			};
			t.composeXmlResponse = function (v, oResponse) {
				var b = { id: v.id }, x;
				if (!oResponse || !oResponse.responseData.length) {
					this.logWarning("Response data not found.");
					return b;
				}
				x = oResponse.responseData[0];
				switch (v.textMode) {
					case 2:
						if (typeof JSON != DATATYPES.TYPE_UNDEFINED)
							b.json = JSON.parse(x.value, HemiEngine.xml.JSONReviver);
						break;
					case 1:
						b.text = x.value;
						break;
					default:
						b.xdom = Hemi.xml.parseXmlDocument(x.value);
						break;
				}
				return b;

			};

			HemiEngine.util.logger.addLogger(t, "IO Proxy Service", "Data IO Proxy Service", "662");
			t.ready_state = 4;
			t.scopeHandler("xml_io_request", 0, 0, 1);
			HemiEngine.transaction.service.register(t, 1);
			t.joinTransactionPacket("iobus");
		}
	}, 1);
} ());

///	</class>
/// </package>
/// </source>