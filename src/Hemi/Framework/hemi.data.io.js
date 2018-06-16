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

	HemiEngine.include("hemi.object");
	HemiEngine.include("hemi.util.logger");
	HemiEngine.include("hemi.transaction");

	HemiEngine.namespace("data.io", HemiEngine, {

		/// <static-class>
		///		<name>DataIOProvider</name>
		///		<description>This static class describes the interface an object must expose to provide data via the Data IO Service. A provider must be registered with the ObjectRegistry.  The addServiceAPI method may be used to instrument this API for quick access to the service.</description>
		///		<method>
		///			<name>handle_io_register</name>
		///			<param name = "ioService" type = "DataIOService">The service that registered the provider.</param>
		///			<description>A notification that the provider was registered with the service.</description>
		///		</method>
		///		<method>
		///			<name>handle_io_unregister</name>
		///			<param name = "ioService" type = "DataIOService">The service that is unregistering the provider.</param>
		///			<description>A notification that the provider is being unregistered.</description>
		///		</method>
		///		<method>
		///			<name>handle_io_open_request</name>
		///			<param name = "ioService" type = "DataIOService">The service that is unregistering the provider.</param>
		///			<param name = "vSubj" type = "IOSubject">Subject of the requestor (E.G.: The authenticated user, anonymous user, etc).</param>
		///			<param name = "ioRequest" type = "IORequest">The request that is being opened.</param>
		///			<param name = "ioResponse" type = "IOResponse">The response to the request.</param>
		///			<description>A notification that a request has been opened.</description>
		///		</method>
		///		<method>
		///			<name>handle_io_request</name>
		///			<param name = "ioService" type = "DataIOService">The service that is unregistering the provider.</param>
		///			<param name = "vSubj" type = "IOSubject">Subject of the requestor (E.G.: The authenticated user, anonymous user, etc).</param>
		///			<param name = "IORequest" type = "IORequest">The request that is being opened.</param>
		///			<param name = "ioResponse" type = "IOResponse">The response to the request.</param>
		///			<return-value name = "bComplete" type = "boolean">Bit indicating that the request response was completed.</return-value>
		///			<description>A notification that a request should be processed.</description>
		///		</method>
		///		<method virtual = "1">
		///			<name>requestTypeAction</name>
		///			<param name = "oService" type = "IOService">The Data IO service raising the request.</param>
		///			<param name = "oSubject" type = "IOSubject">Subject of the requestor (E.G.: The authenticated user, anonymous user, etc).</param>
		///			<param name = "oRequest" type = "IORequest">Parameters and filters of the request.</param>
		///			<param name = "oResponse" type = "IOResponse">Data, status, and policies of the response.</param>
		///			<return-value name = "bHandled" type = "bit">Bit indicating the request was handled.</return-value>
		///			<description>The virtual method is invoked based on the combination of the implements method.</description>
		///		</method>
		///		<method virtual = "1">
		///			<name>implement</name>
		///			<param name = "sContext" type = "String">The context of the implementation.</param>
		///			<param name = "sAction" type = "String">The action of the implementation.</param>
		///			<description>Registers a specific implementation.  The order of the invocation is: requestCatalog{Action}, requestAction{Action}. This method is injected onto a provider after registration.</description>
		///		</method>
		///		<method>
		///			<name>handle_proxy_xml</name>
		///			<param name = "sPath" type = "String">The URI to an XML/Text/JSON Resource decorated with the proxy protocol.</param>
		///			<param name = "sId" type = "String">Identifier associated with the request.</param>
		///			<param name = "bPost" type = "bit">Bit indicating wether the request should be made via HTTP POST.</param>
		///			<param name = "vData" type = "variant">Data to be included as the POST payload, such as an XMLDocument, text, or JSON structure.</param>
		///			<param name="c" type="boolean" optional="1" default = "false">Bit indicating whether the response should be cached.</param>
		///			<param name="t" type="int" optional="1" default = "0">Int indicating whether the request and response as text (1) or JSON (2) instead of XML (0).</param>
		///			<param name="iBusType" type="int">The bus type the proxy service is currently operating in.</param>
		///			<return-value name = "oRequest" type = "DataIORequest">Returns a Data IO Request based on the supplied input.</return-value>
		///			<description>When registered as a protocol proxy, matching URI requests made from the context of the registered bus are diverted to this provider. The provider implements the handle_proxy_xml method to compose a Data IO Request based on the URI pattern. NOTE: Only one provider may register for a particular protocol, regardless of bus type.</description>
		///		</method>
		///		<version>%FILE_VERSION%</version>
		/// </static-class>
		///	<static-class>
		///		<name>service</name>
		///		<version>%FILE_VERSION%</version>
		///		<description>Static implementation of the hemi.app.module.serviceImpl class.</description>
		///
		///
		///	</static-class>
		///	<class>
		///		<name>serviceImpl</name>
		///		<version>%FILE_VERSION%</version>
		///		<description>The Data IO service provides a bus to registered Data Providers.  <i>IORequest</i> and <i>IOSubject</i> objects are used to convey a description of the request to the providers.  Each provider may then determine whether and when to handled the request, and return results as an <i>IOResponse</i>.</description>
		///

		service: null,

		serviceImpl: function () {
			var t = this;

			HemiEngine.prepareObject("io_service", "%FILE_VERSION%", 1, t, 1);

			HemiEngine.util.logger.addLogger(t, "IO Service", "Data IO Service", "661");

			HemiEngine.object.addObjectAccessor(t, "provider");
			HemiEngine.object.addObjectAccessor(t, "request");
			HemiEngine.object.addObjectAccessor(t, "response");

			Hemi.transaction.service.register(t, 1);

			t.properties.busType = {
				ANY: 1,
				LOCAL: 2,
				OFFLINE: 3,
				ONLINE: 4,
				STATIC: 5
			};
			/*
			t.properties.methodType = {
			CATALOG: 1,
			PAGE: 2,
			REQUEST: 3,
			ACTION: 4
			};
			*/
			/// <method>
			/// 	<name>getBusName</name>
			///		<param name = "iBus" type = "int">Bus type</param>
			/// 	<return-value type = "String" name = "sBusName">The name of the specified of bus type.</return-value>
			/// 	<description>Returns the name of the specified bus type.</description>
			/// </method>
			t.getBusName = function (i) {
				var r = "NONE", c, b = t.properties.busType;
				if (!DATATYPES.TN(i)) return r;
				for (c in b) {
					if (b[c] == i) {
						r = c;
						break;
					}
				}
				return r;
			};
			/// <method>
			/// 	<name>getBusType</name>
			/// 	<return-value type = "Enum&lt;BusType&gt;" name = "eBus">The enumeration of bus types.</return-value>
			/// 	<description>Returns the enumeration of bus types.</description>
			/// </method>
			t.getBusType = function () {
				return t.properties.busType;
			};
			/*
			"Add",
			"Edit",
			"Verify",
			"Form",
			"Delete",
			"List",
			"Data"
			*/

			/*
			The 1.0 format of the API is to track with the CoreWeb Core Handler structure.
			This can easily be translated from a Data Provider into a REST request, or encoded XML or JSON request.
			The CoreWeb Core Handler Structure is:
			/HandlerApp/{Catalog}/{Page}/{Request}/{Action},
			Where a predefined {Action} is promoted when lacking a {Catalog}, {Page}, or {Request}.
            
			For example:
			If a CoreWeb Handler Request to list groups is:
			/Explorer/Directory/[Name|ID-##]
			And the Provider receives a call to list groups:
                        
			The IORequest would be:
			Catalog = "Groups"
			Action = "List"
			action = [List | null]
			request = {is condensed away} ##
			*/

			/// <method>
			/// 	<name>getList</name>
			///		<param name="eBus" type="Enum&lt;BusType&gt;">The request bus.</param>
			///		<param name = "sApplication" type = "String">The application to handle the request.</param>
			///		<param name = "sContext" type = "String">The context of the request.</param>
			///		<param name = "sCatalog" type = "String">The group catalog.  Reserved values are: directory, data</param>
			///		<param name = "sRequest" type = "String" default = "list" optional = "1">The request, or description, of the catalog. Reserved values are: list, listFull.</param>
			///		<param name = "bAsync" type = "boolean" optional = "1">Bit indicating whether the request should be made asynchronously.</param>
			///		<param name = "fHandler" type = "function" optional = "1">Function pointer to be invoked with the service and response.</param>

			/// 	<return-value type = "IOResponse" name = "oResp">The response object created for the request.</return-value>
			/// 	<description>Opens a catalog request, where the requestName is 'catalog', </description>
			/// </method>
			t.getList = function (b, l, x, c, r, a, h) {
				return t.createRequest(t.getSubject(), b, l, x, c, (r ? r : "List"), 0, 0, 1, 0, 0, 0, h);
			};


			/// Invoked by the instrumented deconstructor
			///
			t.object_destroy = function () {

				HemiEngine.message.service.unsubscribe(t, "onremoveobject", "handle_remove_object");
				HemiEngine.message.service.unsubscribe(t, "onsessionrefresh", "handle_session_refresh");
			};

			t.handle_remove_object = function (s, i) {
				var v, a = t.getProviders(), z = 0;
				for (; z < a.length; ) {
					v = a[z++];
					if (v && v.providerId == i) {
						t.unregister(v, 1);
						break;
					}
				}
			};

			t.handle_session_refresh = function (s, i) {
				t.mapSession(i);
			};

			///		<method internal = "1">
			///			<name>mapSession</name>
			///			<param name = "oSession" type = "SessionComponent">The Session Component used by CoreWeb.</param>
			///			<description>Maps the Core Session component data to the DataIO subject.</description>
			///		</method>
			t.mapSession = function (i) {
				if (!DATATYPES.TO(i) || i == null || !DATATYPES.TF(i.RefreshSession)) return;
				var o = t.getSubject();
				o.isAuthenticated = i.GetBoolParam("IsLoggedIn");
				o.name = i.GetParam("UserName");
				o.id = i.GetParam("RecordId");
				if (o.id && o.id == "0") o.id = 0;
				if (!o.isAuthenticated) o.name = "Anonymous";
				t.updateSubject();
			};
			///		<method virtual = "1">
			///			<name>updateSubject</name>
			///			<description>Notifies subscribers to <i>onupdatesubject</i> message that the subject was updated.</description>
			///		</method>
			t.updateSubject = function () {
				Hemi.message.service.publish("onupdatesubject", this);
			};
			/// <message>
			/// <name>onupdatesubject</name>
			/// <param name = "o" type = "DataIOService">The service for which the subject was updated.</param>
			/// <description>Message published to all subscribers when the default subject for the service has been updated.</description>
			/// </message>


			///		<method virtual = "1">
			///			<name>handle_io_response</name>
			///			<param name = "ioService" type = "DataIOService">The service that is unregistering the provider.</param>
			///			<param name = "vSubj" type = "IOSubject">Subject of the requestor (E.G.: The authenticated user, anonymous user, etc).</param>
			///			<param name = "ioRequest" type = "IORequest">The request that is being opened.</param>
			///			<param name = "ioResponse" type = "IOResponse">The response to the request.</param>
			///			<description>A notification that a response was created for a pending request.</description>
			///		</method>
			/// <object>
			///	    <name>Group</name>
			/// 	<description>An object representing a group.</description>
			///		<property type = "boolean" get = "1" set = "1" name = "populated">Bit indicating whether child data and groups has been populated.</property>
			///		<property type = "String" get = "1" set = "1" name = "provider">The provider of the group.</property>
			///		<property type = "String" get = "1" set = "1" name = "parentId">The group parent id.</property>
			///		<property type = "String" get = "1" set = "1" name = "name">Name of the group.</property>
			///		<property type = "String" get = "1" set = "1" name = "path">Path of the group.</property>
			///		<property type = "String" get = "1" set = "1" name = "type">Type of the group.</property>
			///		<property type = "String" get = "1" name = "id">Unique identifier.</property>
			///		<property type = "String" get = "1" name = "namespace">Namespace.  This may be used to distinguish where the data originates and/or where and how it should be persisted.</property>
			///		<property type = "Array&lt;Data&gt;" get = "1" name = "data">List of data contained by the group.</property>
			///		<property type = "Array&lt;Group&gt;" get = "1" name = "groups">List of groups contained by the group.</property>
			///		<property type = "boolean" get = "1" name = "detailsOnly">Bit indicating whether the group pointers (such as children) are populated.</property>
			///		<property type = "Enum&lt;BusType&gt;" get = "1" name = "bus">The bus via which the group was transferred. Bus is a discriminator used to direct the flow of the request to a subject of IO Providers.</property>
			/// </object>

			/// <object>
			///	    <name>IOSubject</name>
			/// 	<description>An object representing the subject of a request.  This object is determined and set by the framework context.</description>
			///		<property type = "String" get = "1" name = "name">Name of the subject (eg: user name).</property>
			///		<property type = "String" get = "1" name = "id">UID of the subject (eg: user id).</property>
			///		<property type = "boolean" get = "1" name = "isAuthenticated">Bit indicating whether or not the subject is known to be authenticated.</property>
			/// </object>

			/// <method>
			/// 	<name>getSubject</name>
			/// 	<return-value type = "IOSubject" name = "oSub">The current IOSubject.</return-value>
			/// 	<description>Returns the current IOSubject.  This is assumed to be updated by any session handling mechanism (E.G.: Refer component.session.xml for implementation when used with Core Web 4 project).</description>
			/// </method>
			t.getSubject = function () {
				var o = t.objects.subject;
				if (!o) {
					o = { name: null, id: null, isAuthenticated: false };
					t.objects.subject = o;
				}
				return o;
			};

			/// <method>
			/// 	<name>arrayToGroup</name>
			///     <param name = "aArray" type = "Array&lt;String&gt;">An array of group names</param>
			///     <param name = "oPolicy" type = "Policy" optional = "1">Default group policy.</param>
			///     <param name = "sParentPath" type = "String" optional = "1">Parent path to the group.</param>
			/// 	<return-value type = "Array&lt;Group&gt;" name = "aGroups">An array of group objects.</return-value>
			/// 	<description>Returns an array of group objects.</description>
			/// </method>
			t.arrayToGroup = function (a, p, h) {
				var r = [], o;
				for (var i = 0; i < a.length; i++) {
					o = this.newGroup();
					o.name = a[i];
					if (p) o.policies.push(t.clonePolicy(p));
					o.path = (h ? h : "") + a[i];
					r.push(o);
				}
				return r;
			};
			/// <method>
			/// 	<name>newGroup</name>
			/// 	<return-value type = "Data" name = "alist">A new group object.</return-value>
			/// 	<description>Returns a new group object.</description>
			/// </method>
			t.newGroup = function () {
				return {
					provider: 0,
					name: 0,
					id: 0,
					parentId: 0,
					type: 0,
					detailsOnly: 0,
					path: 0,
					populated: 0,
					groups: [],
					data: [],
					namespace: 0,
					policies: [],
					bus: 0
				};
			};
			/// <method>
			/// 	<name>arrayToData</name>
			///     <param name = "aArray" type = "Array&lt;String&gt;">An array of data</param>
			///     <param name = "oPolicy" type = "Policy">Default data policy.</param>
			/// 	<return-value type = "Array&lt;Data&gt;" name = "aData">An array of data objects.</return-value>
			/// 	<description>Returns an array of data objects.</description>
			/// </method>
			t.arrayToData = function (a, p) {
				var r = [], o;
				for (var i = 0; i < a.length; i++) {
					o = this.newData();
					o.value = o.name = a[i];
					o.mimeType = "text/plain";
					if (p) o.policies.push(t.clonePolicy(p));
					r.push(o);
				}
				return r;
			};
			/// <object>
			///	    <name>Data</name>
			/// 	<description>An object representing variable data.</description>
			///		<property type = "String" get = "1" set = "1" name = "provider">The provider of the data.</property>
			///		<property type = "String" get = "1" set = "1" name = "path">The path to the data.</property>
			///		<property type = "String" get = "1" set = "1" name = "value">Value of the data.</property>
			///		<property type = "String" get = "1" set = "1" name = "hash">Hash of the data value.</property>
			///		<property type = "String" get = "1" set = "1" name = "name">Name of the data.</property>
			///		<property type = "String" get = "1" set = "1" name = "type">Type of the data value.</property>
			///		<property type = "String" get = "1" set = "1" name = "mimeType">Content type of the data value.</property>
			///		<property type = "String" get = "1" name = "id">Unique identifier.</property>
			///		<property type = "Date" get = "1" name = "createdDate">Date/time when the data was created.</property>
			///		<property type = "Date" get = "1" name = "modifiedDate">Date/time when the data was last modified.</property>
			///		<property type = "int" get = "1" name = "size">Size of the data</property>
			///		<property type = "boolean" get = "1" name = "detailsOnly">Bit indicating whether the data value is included.  For data lists, this is usually false.</property>
			///		<property type = "boolean" get = "1" name = "postData">Bit indicating whether the data value represents a post payload.</property>
			///		<property type = "String" get = "1" set = "1" name = "group">Group identifier.  This may be used to differentiate the data relative to other data, such as a directory.</property>
			///		<property type = "String" get = "1" set = "1" name = "description">Description of the data.</property>
			///		<property type = "String" get = "1" name = "namespace">Namespace.  This may be used to distinguish where the data originates and/or where and how it should be persisted.</property>
			///		<property type = "Enum&lt;BusType&gt;" get = "1" name = "bus">The bus via which the data was transferred. Bus is a discriminator used to direct the flow of the request to a subject of IO Providers.</property>
			/// </object>
			/// <method>
			/// 	<name>newData</name>
			/// 	<return-value type = "Data" name = "oData">A new data object.</return-value>
			/// 	<description>Returns a new data object.</description>
			/// </method>
			t.newData = function () {
				return {
					provider: 0,
					value: 0,
					name: 0,
					description: 0,
					mimeType: 0,
					id: 0,
					createdDate: 0,
					modifiedDate: 0,
					size: 0,
					detailsOnly: 0,
					group: 0,
					namespace: 0,
					path: 0,
					policies: [],
					hash: 0,
					bus: 0,
					postData: 0
				};
			};

			/// <object>
			///	    <name>Policy</name>
			/// 	<description>Authorization policy affecting a particular object.</description>
			///		<property type = "String" get = "1" set = "1" name = "subjectId">The id of the object that the policy affects.</property>
			///		<property type = "String" get = "1" set = "1" name = "subjectType">The type of subject.</property>
			///		<property type = "String" get = "1" set = "1" name = "statement">A plain text statement of the policy.</property>
			///		<property type = "boolean" get = "1" set = "1" name = "read">Bit indicating whether the subjecrt is able to read the object.</property>
			///		<property type = "boolean" get = "1" set = "1" name = "write">Bit indicating whether the subjecrt is able to write (or add-to) the object.</property>
			///		<property type = "boolean" get = "1" set = "1" name = "change">Bit indicating whether the subjecrt is able to change the object.</property>
			///		<property type = "boolean" get = "1" set = "1" name = "del">Bit indicating whether the subjecrt is able to delete the object.</property>
			/// </object>
			/// <method>
			/// 	<name>newPolicy</name>
			/// 	<return-value type = "Policy" name = "oPolicy">A new policy object.</return-value>
			/// 	<description>Returns a new policy object.</description>
			/// </method>
			t.clonePolicy = function (p) {
				var r = t.newPolicy();
				for (var i in p) r[i] = p[i];
				return r;
			};
			t.newPolicy = function () {
				return {
					subjectId: 0,
					subjectType: 0,
					read: 0,
					write: 0,
					change: 0,
					del: 0,
					statement: 0
				};
			};

			/// <object>
			///	    <name>IOInstruction</name>
			/// 	<description>Instructions relevent to the request.</description>
			///		<property type = "String" get = "1" name = "paginate">Bit indicating whether multiple results should be paginate by the <i>recordCount</i> property.</property>
			///		<property type = "int" get = "1" name = "recordCount">For paginated sets of data, the number of records requested for the set.</property>
			///		<property type = "int" get = "1" name = "startRecord">For paginated sets of data, the start index of the returned set of data from the total set.</property>
			///		<property type = "int" get = "1" name = "totalCount">For paginated sets of data, the total set of available data.</property>
			///		<property type = "boolean" get = "1" name = "paginate">Bit indicating the data set is paginated.</property>
			///		<property type = "String" get = "1" name = "orderBy">Instruction on how the response should be ordered.</property>
			///		<property type = "String" get = "1" name = "groupBy">Instruction on how the response should be grouped.</property>
			/// </object>
			/// <method>
			/// 	<name>newIOInstruction</name>
			/// 	<return-value type = "IOInstruction" name = "oInst">A new set of request instructions.</return-value>
			/// 	<description>Returns a new request object.</description>
			///		<param name="bPaginate" type="boolean">The requested results should be paginated.</param>
			///		<param name="iStartRecord" type="int">For paginated results, the record to begin with.</param>
			///		<param name="iRecordCount" type="int">For paginated results, the maximum number of records to return.</param>
			///		<param name="sOrder" type="String">Record order instruction.</param>
			///		<param name="sGroup" type="String">Record group instruction.</param>
			/// </method>
			t.cloneInstruction = function (p) {
				var r = t.newIOInstruction();
				if (!p) return r;
				for (var i in p) r[i] = p[i];
				return r;
			};

			t.newIOInstruction = function (p, s, r, o, g) {
				return {
					paginate: (p ? p : 0),
					recordCount: (r ? r : 0),
					startRecord: (s ? s : 0),
					totalCount: 0,
					orderBy: o,
					groupBy: g
				};
			};
			/// <object>
			///	    <name>IOResponse</name>
			/// 	<description>An object representing the response to a request.</description>
			///		<property type = "boolean" get = "1" set = "1" name = "authenticationRequired">One or more providers indicated invalid authentication.</property>
			///		<property type = "String" get = "1" set = "1" name = "id">UID to track this IOResponse.</property>
			///		<property type = "String" get = "1" set = "1" name = "responseId">UID of the response (eg: data_id).</property>
			///		<property type = "String" get = "1" set = "1" name = "responsePath">Path of the response.</property>
			///		<property type = "String" get = "1" set = "1" name = "status">Response status.</property>
			///		<property type = "String" get = "1" set = "1" name = "message">Response messages, if any.</property>
			///		<property type = "String" get = "1" set = "1" name = "requestId">The id of the IORequest submitted and instigating this response. (IORequest.id property, not IORequest.requestId).</property>
			///		<property type = "String" get = "1" name = "serviceId">The registered identifier of the service for which the response was created.</property>
			///		<property type = "Array&lt;Variant&gt;" get = "1" name = "responseData">List of data accompanying the response.</property>
			///		<property type = "String" get = "1" name = "namespace">Namespace.  This may be used to distinguish where the data originates and/or where and how it should be persisted.</property>
			///		<property type = "Enum&lt;BusType&gt;" get = "1" name = "eBus">Bus is a discriminator used to direct the flow of the request to a subject of IO Providers.</property>
			///		<property type = "Hash" get = "1" name = "providerResponded">Hash of providers which responded.</property>
			///		<property type = "function" get = "1" name = "responseHandler">Handler to be invoked for asynchronous requests.</property>
			///			<method>
			///				<name>writeData</name>
			///				<param name= "o" type = "Data">A data object.</param>
			///				<param name= "p" type = "IOProvider" optional = "1">The service providing the data.</param>
			///				<param name= "r" type = "Array&lt;Group&gt;" optional = "1">The parent group array.</param>
			///				<param name= "b" type = "String" optional = "1">The bus via which the data was provided.</param>
			///				<description>Adds the specified data object to the response.</description>
			///			</method>
			///			<method>
			///				<name>writeDataArray</name>
			///				<param name= "a" type = "Array&lt;Data&gt;">An array of data objects.</param>
			///				<param name= "p" type = "IOProvider" optional = "1">The service providing the data.</param>
			///				<param name= "r" type = "Array&lt;Data&gt;" optional = "1">The parent data array.</param>
			///				<param name= "b" type = "String" optional = "1">The bus via which the data was provided.</param>
			///				<description>Adds the specified data objects to the response.</description>
			///			</method>
			///			<method>
			///				<name>writeGroup</name>
			///				<param name= "o" type = "Group">A group object.</param>
			///				<param name= "p" type = "IOProvider" optional = "1">The service providing the group.</param>
			///				<param name= "r" type = "Array&lt;Group&gt;" optional = "1">The parent group array.</param>
			///				<param name= "b" type = "String" optional = "1">The bus via which the group was provided.</param>
			///				<description>Adds the specified group object to the response.</description>
			///			</method>
			///			<method>
			///				<name>writeGroupArray</name>
			///				<param name= "a" type = "Array&lt;Group&gt;">An array of group objects.</param>
			///				<param name= "p" type = "IOProvider" optional = "1">The service providing the group.</param>
			///				<param name= "r" type = "Array&lt;Group&gt;" optional = "1">The parent group array.</param>
			///				<param name= "b" type = "String" optional = "1">The bus via which the group was provided.</param>
			///				<description>Adds the specified group objects to the response.</description>
			///			</method>
			/// </object>
			/// <method internal = "1">
			/// 	<name>newIOResponse</name>
			///		<param name = "vReq" type = "IORequest">The request object for which to create the response.</param>
			///		<param name = "fHandler" type = "function" optional = "1">Function pointer to be invoked with the service and response for asynchronous requests.</param>
			/// 	<return-value type = "IOResponse" name = "oReq">A new response object.</return-value>
			/// 	<description>Returns a new response object.</description>
			/// </method>
			t.newIOResponse = function (v, f) {
				return {
					authenticationRequired: 0,
					responseHandler: f,
					responseId: 0,
					responsePath: 0,
					status: 0,
					message: 0,
					serviceId: t.object_id,
					requestId: v.id,
					responseData: [],
					responseGroups: [],
					namespace: 0,
					providerResponded: {},
					bus: 0,
					id: Hemi.guid(),
					writeData: function (o, p, a, b) {
						if (p) o.provider = p.object_id;
						if (b) o.bus = b;
						(a ? a : this.responseData).push(o);
					},
					writeDataArray: function (a, p, r, b) {
						for (var i = 0; i < a.length; i++)
							this.writeData(a[i], p, r, b);
					},
					writeGroup: function (o, p, a, b) {
						if (p) o.provider = p.object_id;
						if (b) o.bus = b;
						(a ? a : this.responseGroups).push(o);
					},
					writeGroupArray: function (a, p, r, b) {
						for (var i = 0; i < a.length; i++)
							this.writeGroup(a[i], p, r, b);

					}
				};
			};
			/// <object>
			///	    <name>IORequest</name>
			/// 	<description>An object representing the subject of a request.  This object is determined and set by the framework context.  The parameters are modeled after the <i>Core Web</i> and <i>Account Manager</i> <i>Core Handler</i> request processor.</description>
			///		<property type = "String" get = "1" name = "requestApplication">The name of a preferred application to handle the requested action.</property>
			///		<property type = "String" get = "1" name = "requestAction">The requested action (eg: get, put, delete).</property>
			///		<property type = "String" get = "1" name = "async">The request may be made asynchronously, and the results returned via a handler callback.</property>
			///		<property type = "String" get = "1" name = "cache">The request results may be cached.</property>
			///		<property type = "String" get = "1" name = "requestName">Name of the request (eg: data name).</property>
			///		<property type = "String" get = "1" name = "requestId">UID of the request being made (eg: data id).</property>
			///		<property type = "String" get = "1" name = "requestCatalog">The catalog (or group) of the request being made (eg: Home group). This may be used to differentiate the data relative to other data, such as a directory.</property>
			///		<property type = "String" get = "1" name = "id">UID to track this IORequest.</property>
			///		<property type = "boolean" get = "1" name = "detailsOnly">Bit indicating whether returned data should include all information, or only meta information.</property>
			///		<property type = "String" get = "1" name = "requestContext">Context is used to distinguish where the data request originated, and where it may be delivered.</property>
			///		<property type = "String" get = "1" name = "namespace">Namespace.  This may be used to distinguish where the data originates and/or where and how it should be persisted.</property>
			///		<property type = "Enum&lt;BusType&gt;" get = "1" name = "eBus">Bus is a discriminator used to direct the flow of the request to a subject of IO Providers.</property>
			///		<property type = "Array&lt;Variant&gt;" get = "1" name = "requestData">List of data accompanying the request.</property>
			///		<property type = "String" get = "1" name = "serviceId">The registered identifier of the service for which the request was created.</property>
			///		<property type = "Hash" get = "1" name = "providerRequested">Hash of provider identifiers to which the request was submitted.</property>
			///		<property type = "String" get = "1" name = "transactionId">The transaction packet identifier.</property>
			///		<property type = "String" get = "1" name = "transactionName">The transaction packet name.</property>
			///		<property type = "String" get = "1" name = "responseId">The id of the IOResponse created for this request. (IOResponse.id property, not IOResponse.responseId).</property>
			///		<property type = "boolean" get = "1" name = "is_open" internal = "1">Bit indicating that the request is still being processed.</property>
			///		<property type = "IOInstruction" get = "1" name = "instruction">A set of instructions for how a request for two or more records should be handled.</property>
			///		<property type = "String" get = "1" set = "1" name = "mimeType">Expected content type of the response.</property>
			/// </object>

			/// <method internal = "1">
			/// 	<name>newIORequest</name>
			///		<param name="eBus" type="Enum&lt;BusType&gt;">The request bus.</param>
			///     <param name = "sApplication" type = "String">The request application.</param>
			///		<param name="sContext" type="String">The context of the request.</param>
			///		<param name="sCatalog" type="String">The name of the request catalog.</param>
			///		<param name="sAction" type="String">The requested action.</param>
			///		<param name="sId" type="String">The requested id.</param>
			///		<param name="sName" type="String">The name of the request.</param>            
			///		<param name="bDetailsOnly" type="boolean">The request is for meta information.</param>
			///		<param name="bAsync" type="boolean">The request is asynchronous.</param>
			///		<param name="bCache" type="boolean">The request may be cached.</param>
			///		<param name="oInstruction" type="IOInstruction">A set of instructions for how a request for two or more records should be handled.</param>
			/// 	<return-value type = "IORequest" name = "oReq">A new request object.</return-value>
			/// 	<description>Returns a new request object.</description>
			/// </method>
			t.newIORequest = function (b, l, x, h, o, i, n, d, a, c, u) {
				return {
					requestApplication: l,
					requestContext: x,
					async: a,
					serviceId: t.object_id,
					responseId: 0,
					requestId: i,
					requestAction: o,
					cache: c,
					requestName: n,
					requestCatalog: h,
					id: Hemi.guid(),
					namespace: 0,
					detailsOnly: d,
					bus: b,
					providerRequested: {},
					requestData: [],
					transactionId: 0,
					transactionName: 0,
					is_open: 0,
					instruction: u,
					mimeType: 0
				};
			};

			/// <method internal = "1">
			/// 	<name>createRequest</name>
			///		<param name="oSubject" type="IOSubject">The subject making the request.</param>
			///		<param name="eBus" type="Enum&lt;BusType&gt;">The request bus.</param>
			///     <param name = "sApplication" type = "String">The request application.</param>
			///		<param name="sContext" type="String">The context of the request.</param>
			///		<param name="sCatalog" type="String">The name of the request catalog.</param>
			///		<param name="sAction" type="String">The requested action.</param>
			///		<param name="sId" type="String">The requested id.</param>
			///		<param name="sName" type="String">The name of the request.</param>            
			///		<param name="bDetailsOnly" type="boolean">The request is for meta information.</param>
			///		<param name="bAsync" type="boolean">The request is asynchronous.</param>
			///		<param name="bCache" type="boolean">The request may be cached.</param>
			///		<param name="oInstruction" type="IOInstruction">A set of instructions for how a request for two or more records should be handled.</param>
			///		<param name = "fHandler" type = "function" optional = "1">Function pointer to be invoked with the service and response.</param>
			/// 	<return-value type = "IORequest" name = "oReq">A request object.</return-value>
			/// 	<description>Constructs a request object from the specified parameters,  opens a new request transaction, and returns a new request object, registered with the io service, prepared with a response, and ready for use.</description>
			/// </method>

			/*
			Creating/Joining to the transaction packet will kick off a call to startTransaction and _handle_begin_transaction
			*/
			t.createRequest = function (j, b, l, x, h, o, i, n, d, a, c, p, f) {
				return t.openRequest(j, t.newIORequest(b, l, x, h, o, i, n, d, a, c, p), f);
			};

			/// <method internal = "1">
			/// 	<name>openRequest</name>
			///		<param name="oSubject" type="IOSubject">The subject making the request.</param>
			///		<param name = "IORequest" type = "function">A request object.</param>
			///		<param name = "fHandler" type = "function" optional = "1">Function pointer to be invoked with the service and response.</param>
			/// 	<return-value type = "IORequest" name = "oReq">A request object.</return-value>
			/// 	<description>Opens a new request transaction, and returns a new request object, registered with the io service, prepared with a response, and ready for use.</description>
			/// </method>
			t.openRequest = function (j, rq, f) {
				var rs = t.newIOResponse(rq, f),
                    k,
                    b = rq.bus,
                    z = t.objects.providers,
                    y = 0,
                    w,
                    v,
                    u,
                    bt = t.properties.busType
                ;

				if (!DATATYPES.TN(b)) b = bt.ANY;
				if (!j) j = t.getSubject();

				u = "io.service.request-" + rq.id;
				k = Hemi.transaction.service.openTransaction(u, t, { type: 0, src: 0, data: 0 }, t.endRequest);

				t.addNewRequest(rq, rq.id);
				t.addNewResponse(rs, rs.id);
				/// if(!rq.instruction) rq.instruction = t.newIOInstruction();
				rs.instruction = t.cloneInstruction(rq.instruction);
				rq.transactionName = u;
				rq.transactionId = k;
				rq.responseId = rs.id;
				rq.is_open = 1;
				t.getPacket(u).data = { serviceId: t.object_id, requestId: rq.id, responseId: rs.id, subject: j };

				/// Join the providers on the specified bus to this transaction
				///
				for (; y < z.length; ) {
					w = z[y++];
					/// TODO: 2010/07/09 - the array should be compacted on prior removal
					/// So this check should be unnecessary
					/// 
					if (!w) continue;
					/// this.log(w.bus + ":" + b + "==" + (w.bus == bt.ANY || w.bus == b));
					/// if provider bus is any
					/// or provider bus is the same as the request
					/// or the request is to any bus
					if (w.bus == bt.ANY || w.bus == b || b == bt.ANY) {
						v = HemiEngine.registry.service.getObject(w.providerId);
						if (!v) {
							t.logWarning("Provider reference was not cleaned up.  Registry #:" + w.providerId + " on bus " + w.bus);
							continue;
						}
						rq.providerRequested[w.providerId] = 1;

						v.joinTransactionPacket(u);
						/*
						if (! && !t.getPacket(u)[v.object_id])
						t.logWarning(v.object_id + " failed to join packet " + u);
						*/
						/// alert("Count at add: " + t.getPacket(u).participant_count + " / Check = " + t.getPacket(u)[v.object_id]);
						/// this.log('Open Request: ' + v.object_id + " : " + u + " (" + !t.getPacket(u)[v.object_id] + ")");
						if (DATATYPES.TF(v.handle_io_open_request)) v.handle_io_open_request(t, j, rq);
					}
				}

				/// Now, serve the transaction
				t.serveTransaction(0, 0, 1, u);

				/// If the request is synchronous, then the packet must be finalized here
				/// Or, it's an error, and any delinquent providers must be forcefully closed
				///


				return rq;
			};

			/// <method internal = "1" virtual = "1">
			/// 	<name>endRequest</name>
			///		<param name="oService" type="TransactionService">The transaction service handling the request.</param>
			///		<param name="oPacket" type="TransactionPacket">The packet representing the transaction.</param>
			/// 	<description>Specified for, and invoked as, the transaction packet handler for transactions opened for requests.</description>
			/// </method>
			t.endRequest = function (s, v) {
				var r = t.getRequestByName(v.data.requestId), q = t.getResponseByName(v.data.responseId), i;
				r.is_open = 0;
				/*
				Now, raise a message and invoke any handlers.
				*/
				i = q.instruction;
				if (i.paginate) {
					if (!i.recordCount) i = q.responseData.length;
					if (!i.totalCount) i = i.recordCount;
				}
				s.closeTransaction(r.transactionId);
				/// r.transactionName = 0;
				/// r.transactionId = 0;

				HemiEngine.message.service.publish("oncloseiorequest", r.id);
				if (DATATYPES.TF(q.responseHandler)) q.responseHandler(t, v.data.subject, r, q);

				/*
				if (!r.cache) {
				q = t.getResponseByName(r.responseId);
				t.removeRequest(r);
				t.removeResponse(q);
				}
				*/
			};
			/// <method internal = "1">
			/// 	<name>continueRequest</name>
			///		<param name="ioRequest" type="variount">Request object or request identifier.</param>
			///		<param name="oProvider" type="ProviderObject" optional = "1">The provider object instigating the request to continue processing.</param>
			///		<param name="bComplete" type="boolean">Bit indicating that the provider completed processing the request and that the underlying transaction may be marked as complete.</param>
			///     <description>For asynchronous requests, continues processing the request transaction.  The instance invoking this method may indicate that it completed processing its portion of the request, and therefore it should not receive a subsequent transaction processing callback.</description>
			/// </method>
			t.continueRequest = function (r, o, b) {
				if (DATATYPES.TS(r)) r = t.getRequestByName(r);
				if (!r) return 0;
				var p = t.getPacket(r.transactionName);
				/// if the packet is finalized, or the provider is not a participant, or the provider is already completed
				/// then return.
				if (!p || p.is_finalized || !DATATYPES.TN(p.participants[o.object_id]) || p.participants[o.object_id] == 2) return 0;

				if (b) p.participants[o.object_id] = 2;
				t.serveTransaction(0, 0, 1, r.transactionName);
				return 1;
			};

			t.startTransaction = function (s, o) {
				///t.log("Start Transaction");
				return 1;
			};
			t.endTransaction = function (s, o) {
				/// t.log("End Transaction");
				/// alert('close');
				/*
				var rs = t.getRequestByName(o.data.requestId),
				rq = t.getResponseByName(o.data.response)
				;
				rs.transactionId = 0;
				rs.transactionName = 0;
				rq.transactionId = 0;
				rq.transactionName = 0;
				Hemi.transaction.service.closeTransaction(o);
				*/
				return 1;
			};
			t.doTransaction = function (s, o) {
				/// t.log("Do Transaction");
				return 1;
			};


			/// <method>
			/// 	<name>register</name>
			///		<param name="oProvider" type="ProviderObject">Hemi FrameworkObject that supports the Provider API.</param>
			///		<param name="sBusType" type="String" optional = "1">The type of bus the provider will use.  Fixed types are: local, offline, online, any.</param>
			///		<param name="sProviderName" type="String" optional = "1">A friendly name for refering to the provider.</param>
			///		<param name="sProtocolProxy" type="String" optional = "1">A custom protocol for directing URI requests through the provider.</param>
			/// 	<return-value type = "bit" name = "bRegistered">Bit indicating whether the provider was registered.</return-value>
			/// 	<description>Registers a Data IO Provider.</description>
			/// </method>
			t.register = function (p, b, n, x) {
				/// Object must be registered
				///
				var h;
				if (!HemiEngine.registry.service.isRegistered(p) || t.getProviderByName(p.object_id))
					return 0;

				if (x && !p.handle_proxy_xml) p.handle_proxy_xml = function () {
					throw "handle_proxy_xml not implemented";
				};
				/// HemiEngine.object.addObjectAccessor(p, "apiRegister");
				p.properties.apiRegister = {};
				/// MethodType = catalog, request, or action
				/// Action = Action name

				p.implement = function (m, a) {
					var f = "request" + m + a;
					if (DATATYPES.TF(this[f])) this.properties.apiRegister[f] = 1;
				};

				p.invokeHandler = function (v, s, r, q) {
					var o = 0,
                        b = "request",
                        c = "Catalog",
                        u = "Request",
                        a = "Action",
                        g = this.properties.apiRegister,
                        f = 0,
                        m
                    ;
					/// requestCatalog****
					f = b + c + r.requestAction;
					Hemi.logDebug("Check Invoke Handler: " + f + " from " + r.requestCatalog + " / " + r.requestAction + " / " + r.requestName);
					/// requestAction****

					if (!g[f]) {
						f = b + a + r.requestAction;
						Hemi.logDebug("Check Invoke Handler: " + f + " from " + r.requestCatalog + " / " + r.requestAction + " / " + r.requestName);
					}

					if (g[f]) o = this[f](v, s, r, q);
					else Hemi.logDebug("No Handler Defined: " + this.getObjectType() + ":" + f);
					return o;
				};

				if (!DATATYPES.TF(p.doTransaction))
					p.doTransaction = function (s, p) {
						var v = HemiEngine.registry.service.getObject(p.data.serviceId), r, q, o = 1;

						/// v.log(p.data.requestId + " -> " + p.data.responseId);
						if (v && (r = v.getRequestByName(p.data.requestId)) && (q = v.getResponseByName(p.data.responseId))) {
							if (DATATYPES.TF(this.handle_io_request)) o = this.handle_io_request(v, p.data.subject, r, q);
							if (!o && this.properties.useRegisteredApi) {
								o = this.invokeHandler(v, p.data.subject, r, q);
							}

							/// v.log(p.data.requestId + " -> " + p.data.responseId + " = " + o);
							if (o) q.providerResponded[this.object_id] = 1;
						}
						return o;
					};

				if (!DATATYPES.TF(p.endTransaction))
					p.endTransaction = function (s, p) {
						var v = HemiEngine.registry.service.getObject(p.data.serviceId), r, q, o = 1;
						if (v && (r = v.getRequestByName(p.data.requestId)) && (q = v.getResponseByName(p.data.responseId)) && DATATYPES.TF(this.handle_io_close_request))
							o = this.handle_io_close_request(v, p.data.subject, r, q);
						/// v.log("End transaction");
						return o;
					};

				if (!HemiEngine.transaction.service.register(p, 1)) return 0;

				if (!DATATYPES.TN(b)) b = t.properties.busType.ANY;

				var r, v = { providerId: p.object_id, bus: b, proxy: 0 };

				if ((r = this.addNewProvider(v, (n ? n : p.object_id)))) {
					if (DATATYPES.TF(p.handle_io_register)) p.handle_io_register(t);
					if (x && HemiEngine.lookup("hemi.data.io.proxy")) HemiEngine.data.io.proxy.service.register(v, x);
				}

				return r;
			};

			/// <method>
			/// 	<name>isRegistered</name>
			///		<param name="oObject" type="FrameworkObject">Hemi FrameworkObject.</param>
			/// 	<return-value type = "bit" name = "bRegistered">Bit indicating whether the provider is registered.</return-value>
			/// 	<description>Determines whether an object is registered as a provider.</description>
			/// </method>
			t.isRegistered = function (o) {

				if (!o || !t.getProviderByName(o.object_id))
					return 0;

				return 1;
			};
			/// <method>
			/// 	<name>unregister</name>
			///		<param name="oProvider" type="ProviderObject">Hemi FrameworkObject that supports the Provider API.</param>
			///		<param name="bPointer" type="boolean">Bit indicating the provider is an internal marker.</param>
			/// 	<return-value type = "bit" name = "bRegistered">Bit indicating whether the provider was unregistered.</return-value>
			/// 	<description>Unregisteres a provider from the Data IO service.</description>
			/// </method>
			t.unregister = function (o, b) {
				var r = t.objects.requests, i = 0, q, p;
				if (b)
					o = Hemi.registry.service.getObject(o.providerId);

				if (!o || !t.isRegistered(o)) return 0;

				/// Notify provider to cleanup any pending requests
				///
				if (DATATYPES.TF(o.handle_io_unregister)) o.handle_io_unregister(t);
				/// Remove the provider from all data io transaction packets
				///

				for (; i < r.length; ) {
					q = r[i++];
					if (!q || !q.is_open) continue;

					b = HemiEngine.transaction.service.removeTransactionParticipant(o, t.getPacket(q.transactionName));
					/// Serve the transaction again
					/// Otherwise, the request will be stuck open
					///
					t.serveTransaction(0, 0, 1, q.transactionName);
					/// t.log("Cleanup: " + o.object_id + " > " + q.transactionName + " = " + b);
				}
				p = t.getProviderByName(o.object_id);
				if (p.proxy && HemiEngine.lookup("hemi.data.io.proxy")) HemiEngine.data.io.proxy.service.unregister(p);
				t.removeProvider(p);
			};

			HemiEngine.message.service.subscribe(t, "onsessionrefresh", "handle_session_refresh");
			HemiEngine.message.service.subscribe(t, "onremoveobject", "handle_remove_object");
			t.ready_state = 4;
		}
	}, 1);
} ());

///	</class>
/// </package>
/// </source>