/// <source>
/// <name>Hemi.framework.io.offline.provider</name>
/// <project>
/// 	<name>Hemi JavaScript Framework</name>
/// 	<url-title>Hemi JavaScript Framework Project</url-title>
/// 	<url>/Hemi/</url>
/// </project>
///
/// <package>
///	<path>Hemi.framework.io.offline.provider</path>
///	<library>Hemi</library>
///	<description>Data provider for offline storage for use with Hemi Framework projects files.</description>

(function () {
    HemiEngine.namespace("framework.io.offline.provider", HemiEngine, {
    	dependencies : ["hemi.event","hemi.data.io","hemi.storage","hemi.framework.io.provider","hemi.data.io.proxy"],
        ///	<static-class>
        ///		<name>service</name>
        ///		<version>%FILE_VERSION%</version>
        ///		<description>Static implementation of the hemi.framework.io.offline.provider.serviceImpl class.</description>
        ///	</static-class>
        ///	<class>
        ///		<name>serviceImpl</name>
        ///		<version>%FILE_VERSION%</version>
        ///		<description>The framework provider is a <i>hemi.data.io</i> provider for serving requests for offline filesets related to the HemiFramework.</description>
        ///
        service: null,

        serviceImpl: function () {
            var t = this;

            HemiEngine.prepareObject("hemi_framework_io_offline_provider", "%FILE_VERSION%", 1, t, 1);
            HemiEngine.util.logger.addLogger(t, "Hemi Framework Offline IO Provider", "Hemi Framework Offline IO Provider", "663");
            t.getProperties().hfs_key = "_hfs_";

            t.handle_io_register = function (oService) {
                this.getProperties().useRegisteredApi = 1;
                this.implement("Catalog", "List");
                this.implement("Action", "CheckName");
                this.implement("Action", "Add");
                this.implement("Action", "Delete");
                this.implement("Action", "Edit");
                this.implement("Action", "Read");
            };


            /*
            This proxy implementation is only valid for an HTTP/S GET equivalent of a single resource.
            */
            t.handle_proxy_xml = function (p, i, x, d, t, bt) {
                var oD = 0,
					sA = "Read",
					sN = 0,
					sId = 0,
					bFull = 1,
					sFile = 0
				;
                /*
                hemi IO offline provider expects DWAC in the form:
                /DWAC/[User|Anonymous]/[Group]/[Name]
                This equates to the data IO layer as:
                Application = DWAC
                Context = Group
                Catalog = Null
                Name = Name
                */

                /// If the URI is shortened, eg: Components/test.xml instead of /DWAC/[User]/Components/test.xml, then prepend a stub
                if (!p.match(/^\/DWAC/)) p = "/DWAC/Anonymous/" + p;

                var q = p.split("/");
                /// Scrub off the online CoreWeb ID- prefix
                ///
                sFile = q[4];
                if (q[4].match(/\?/)) sFile = q[4].substring(0, q[4].lastIndexOf("?"));
                if (sFile.match(/^ID\-/)) sId = sFile.replace(/^ID\-/, "");
                else sN = sFile;
                ///.replace(/^ID\-/, "");

                var oRequest = Hemi.data.io.service.newIORequest(
					bt,
					"DWAC",
					q[3],
					0,
					sA,
					sId,
					sN,
					(bFull ? 0 : 1),
					0,
					0,
					0
				);

                oRequest.mimeType = (t ? "text/javascript" : "text/xml");
                this.log("Composed proxy request for " + p);
                /*
                for (var z in oRequest) {
                this.log(z + "=" + oRequest[z]);
                }
                */
                return oRequest;

            };

            t.handle_io_request = function (oService, oSubject, oRequest, oResponse) {
                this.getProperties().request = 1;
                return 0;
            };
            t.requestActionCheckName = function (oService, oSubject, oRequest, oResponse) {
                var b = 1;
                var oG = this.GetGroup(oRequest.requestContext);
                if (oG) oResponse.status = (this.CheckData(oG, oRequest.requestName) ? true : false);
                return 1;
            };
            t.requestActionDelete = function (oService, oSubject, oRequest, oResponse) {
                var b = 1;
                var oG = this.GetGroup(oRequest.requestContext);
                if (!oG)
                    t.logWarning("Group '" + oRequest.requestContext + "' does not exist");
                else {
                    var r = -1, oD;
                    for (var i = 0; i < oG.data.length; i++) {
                        oD = oG.data[i];
                        if ((typeof oD.id == "number" && oD.id == oRequest.requestId) || oD.name == oRequest.requestName) {
                            r = i;
                            break;
                        }
                    }
                    if (r >= 0) {
                        t.log("Deleting " + oRequest.requestName + " at " + r);
                        oG.data.splice(r, 1);
                        if (t.SaveGroup(oG)) {
                            t.log("Saved group '" + oG.name + "'");
                            oResponse.status = true;
                        }
                        else {
                            t.logWarning("Unable to save group '" + oG.name + "'");
                        }
                    }
                }
                return b;
            };
            t.DeserializeFormData = function (oD) {
                if (!oD.name.match(/serial_form_data/) || !oD.postData || oD.mimeType != "application/xml") return;
                oD.mimeType = "text/xml";
                var aE = oD.value.documentElement.getElementsByTagName("Element");
                for (var i = 0; i < aE.length; i++) {
                    var sN = t.GT(aE[i], "Name");
                    var sValue = t.GT(aE[i], "Value");
                    if (sN.match(/_id$/)) oD.id = parseInt(sValue);
                    else if (sN.match(/_name$/)) oD.name = sValue;
                    else if (sN.match(/_description$/)) oD.description = sValue;
                    else if (sN.match(/_text$/)) oD.value = unescape(sValue);
                }
            };
            /// Duplicate Method w/ core.io.js
            ///
            /// getElementText
            t.GT = function (oP, sN) {
                var a = oP.getElementsByTagName(sN);
                if (a.length == 0) return "";
                return Hemi.xml.getInnerText(a[0]);
            };
            t.requestActionCheckName = function (oService, oSubject, oRequest, oResponse) {
                var b = 1;
                oResponse.status = true;
                var oG = this.GetGroup(oRequest.requestContext);
                if (!oG)
                    oG = this.AddGroup(oRequest.requestContext);

                if (!oG) {
                    t.logWarning("Invalid group: " + oRequest.requestContext);
                    return b;
                }
                var oD = oRequest.requestData;
                if (!oD.length) {
                    t.logWarning("Invalid data");
                    return b;
                }
                oD = oD[0];
                if (!oD.name || oD.name.length == 0) {
                    t.logError("Data has no name");
                    return b;
                }
                /// If the Data is in the CoreWeb serialization style, it needs to be decomposed
                ///
                t.DeserializeFormData(oD);

                var oD2 = t.GetData(oG, oD.name);

                if (oD2 && oD2.id != oD.id) {
                    t.logWarning("Data '" + oD.name + "' already exists :: " + oD2.name + " / " + oD2.id + "==" + oD.id);
                    return b;
                }
                oResponse.status = false;
                return b;
            };
            t.requestActionEdit = function (oService, oSubject, oRequest, oResponse) {
                var b = 1, dt = new Date();
                var g = this.GetGroup(oRequest.requestContext);
                if (!g)
                    g = this.AddGroup(oRequest.requestContext);

                if (!g) {
                    t.logWarning("Invalid group: " + oRequest.requestContext);
                    return b;
                }
                var oD = oRequest.requestData;
                if (!oD.length) {
                    t.logWarning("Invalid data");
                    return b;
                }
                oD = oD[0];
                if (!oD.name || oD.name.length == 0) {
                    t.logError("Data has no name");
                    return b;
                }
                /// If the Data is in the CoreWeb serialization style, it needs to be decomposed
                ///
                t.DeserializeFormData(oD);

                var oD2 = t.GetData(g, oD.name);

                if (oD.id && oD2 && oD2.id != oD.id) {
                    t.logWarning("Data '" + oD.name + "' already exists (" + oD2.id + "==" + oD.id + ")");
                    return b;
                }
                oD2.name = oD.name;
                oD2.description = oD.description;
                oD2.value = oD.value;
                oD2.modifiedDate = dt.getFullYear() + "/" + (dt.getMonth() + 1) + "/" + dt.getDate() + " " + dt.getHours() + ":" + dt.getMinutes();
                oD2.size = oD.value.length;
                oD2.path = g.name + "/" + oD.name;
                if (t.SaveGroup(g)) {
                    t.log("Saved group '" + g.name + "'");
                    oResponse.status = true;
                    oResponse.responseId = oD2.id;
                    oResponse.responsePath = oD2.path;
                }
                else {
                    t.logWarning("Unable to edit data '" + oD.name + "'");
                }
                return b;
            };
            t.requestActionAdd = function (oService, oSubject, oRequest, oResponse) {
                var b = 1, dt = new Date();
                var g = this.GetGroup(oRequest.requestContext);
                if (!g)
                    g = this.AddGroup(oRequest.requestContext);

                if (!g) {
                    t.logWarning("Invalid group: " + oRequest.requestContext);
                    return b;
                }
                var oD = oRequest.requestData;
                if (!oD.length) {
                    t.logWarning("Invalid data");
                    return b;
                }
                oD = oD[0];
                if (!oD.name || oD.name.length == 0) {
                    t.logError("Data has no name");
                    return b;
                }
                /// If the Data is in the CoreWeb serialization style, it needs to be decomposed
                ///
                t.DeserializeFormData(oD);

                if (t.CheckData(g, oD.name)) {
                    t.logWarning("Data '" + oD.name + "' already exists");
                    return b;
                }
                oD.group = g.name;
                oD.createdDate = dt.getFullYear() + "/" + (dt.getMonth() + 1) + "/" + dt.getDate() + " " + dt.getHours() + ":" + dt.getMinutes();
                oD.modifiedDate = oD.createdDate;
                oD.size = oD.value.length;
                oD.path = g.name + "/" + oD.name;
                if (!oD.policies.length)
                    oD.policies.push(t.NewPolicy());

                /// Caveat: The CoreWeb-style controls assume the id is a number
                ///
                oD.id = parseInt(Math.random() * 10000000);
                /// alert(JSON.stringify(oD));
                g.data.push(oD);
                if (!t.SaveGroup(g)) {
                    t.logError("Failed to save group data");
                }
                else {
                    oResponse.responseId = oD.id;
                    oResponse.status = true;
                    oResponse.responsePath = oRequest.requestApplication + "/" + oRequest.requestContext + "/" + oD.name;
                }
                return b;
            };
            t.NewPolicy = function () {
                var p = HemiEngine.data.io.service.newPolicy();
                p.read = 1;
                p.write = 1;
                p.del = 1;
                p.change = 1;
                return p;
            };
            t.requestActionRead = function (oService, oSubject, oRequest, oResponse) {
                var b = 1, oD, g = this.GetGroup(oRequest.requestContext);
                if (g) {
                    oD = t.GetData(g, oRequest.requestName, oRequest.requestId);
                    if (oD) {
                        oResponse.status = true;
                        oResponse.writeData(oD, t, 0, Hemi.data.io.service.getBusType().OFFLINE);
                        t.log("Reading " + oD.name + " -> " + oResponse.responseData.length);
                    }
                }
                return 1;
            };

            t.requestCatalogList = function (oService, oSubject, oRequest, oResponse) {
                var _ra = oRequest.requestApplication;
                if (_ra != "DWAC" && _ra != "HemiFramework" && _ra != "Explorer") {
                    this.log("Skip Request: " + oRequest.requestApplication);
                    return 1;
                }

                var b = 0, a, r = t.NewPolicy(), ctx = oRequest.requestContext;

                t.log("Catalog: " + _ra + "/" + ctx + "/" + oRequest.requestCatalog + " [#" + oRequest.requestId + "]");
                switch (oRequest.requestCatalog) {
                    case "Components":
                    case "Fragments":
                    case "Modules":
                    case "Tests":
                    case "Tasks":
                    case "Templates":
                    case "Workers":
                    case "Projects":
                    case "Pub":

                    case "Tasks":
                        if (ctx == "Directory") {
                            t.log("Render Group: " + oRequest.requestCatalog);
                            HemiEngine.framework.io.provider.service.RenderGroup(oResponse, oRequest.requestCatalog, r);
                            /// t.RenderGroup(oResponse, oRequest.requestCatalog, r);
                        }
                        /// else if (ctx == "Data") {
                        try {
                            t.RenderDataList(oRequest, oResponse, r);
                        }
                        catch (e) {
                            t.logError((e.message ? e.message : e.description));
                        }
                        /// }
                        b = 1;
                        break;
                    case "Framework":
                    case "Examples":
                    case "Hemi":
                    case "DWAC":
                        /// For group lists, defer to the static values
                        /// 
                        b = HemiEngine.framework.io.provider.service.requestCatalogList(oService, oSubject, oRequest, oResponse);
                        break;
                }
                if (!b) {
                    this.logWarning("Unhandled Request Catalog: " + oRequest.requestCatalog);
                    b = 1;
                }
                return b;
            };

            t.DeleteGroup = function (sN) {
                var _sp = HemiEngine.storage.getStorageProvider(), _hk = this.getProperties().hfs_key + "_grp_" + sN;
                if (!t.CheckKey(_hk)) {
                    t.log("Group '" + _hk + "' doesn't exist");
                    return 0;
                }
                return (_sp.removeItem(_hk) ? 1 : 0);
                return 1;
            };
            t.SaveGroup = function (g) {
                var _sp = HemiEngine.storage.getStorageProvider(), _hk = this.getProperties().hfs_key + "_grp_" + g.name;
                if (!t.CheckKey(_hk)) {
                    t.log("Group '" + _hk + "' doesn't exist");
                    return 0;
                }
                _sp.setItem(_hk, JSON.stringify(g));
                return 1;
            };
            t.AddGroup = function (n) {
                var _sp = HemiEngine.storage.getStorageProvider(), _hk = this.getProperties().hfs_key + "_grp_" + n, g;
                if (t.CheckKey(_hk)) {
                    t.log("Group '" + _hk + "' already exists");
                    return 0;
                }

                g = HemiEngine.data.io.service.newGroup();
                g.name = n;
                g.path = g.name;
                g.populated = 1;

                _sp.setItem(_hk, JSON.stringify(g));
                return g;
            };
            t.CheckData = function (g, n, d) {
                return (t.GetData(g, n) ? 1 : 0);
            };
            t.GetData = function (g, n, d) {
                var b = 0, oD;
                for (var i = 0; i < g.data.length; i++) {
                    oD = g.data[i];
                    if ((n && oD.name == n) || (d && oD.id == d)) {
                        b = oD;
                        break;
                    }
                }
                return b;
            };
            t.CheckKey = function (k) {
                var _sp = HemiEngine.storage.getStorageProvider(), b = 0, l, i = 0;
                l = _sp.getLength();
                for (; i < l; i++) {
                    if (_sp.key(i) == k) {
                        b = 1;
                        break;
                    }
                }
                return b;
            };
            t.GetGroup = function (n) {
                var _sp = HemiEngine.storage.getStorageProvider(), _hk = this.getProperties().hfs_key + "_grp_" + n,
				d, s
				;
                s = _sp.getItem(_hk);
                if (s && (d = JSON.parse(s, HemiEngine.xml.JSONReviver))) {
                    return d;
                }
                t.log("Group not found: '" + _hk + "'");
                return 0;
            };
            /*
            t.RenderGroup = function (oResponse, n, y) {
            var g = t.GetGroup(n);
            if (g)
            oResponse.writeGroup(g, y);
            return g;
            };
            */
            t.RenderDataList = function (oRequest, oResponse, y) {
                var _sp = HemiEngine.storage.getStorageProvider(), _hk = this.getProperties().hfs_key + "_grp_" + oRequest.requestCatalog, g, i = 0;
                g = t.GetGroup(oRequest.requestCatalog);
                if (!g)
                    g = t.AddGroup(oRequest.requestCatalog);

                oResponse.writeGroup(g, y);

                if (oResponse.instruction.paginate) {
                    oResponse.instruction.totalCount = g.data.length;
                    g.data = g.data.sort();
                    g.data = g.data.slice(oResponse.instruction.startRecord, oResponse.instruction.startRecord + oResponse.instruction.recordCount);
                }
                t.log("Writing data list " + g.data.length);
                for (; i < g.data.length; i++)
                    t.log("Data " + i + " " + g.data[i].name);

                oResponse.writeDataArray(g.data, t, 0, Hemi.data.io.service.getBusType().OFFLINE);
            };



            t.ready_state = 4;
            if (HemiEngine.storage.testStorageSupported())
                HemiEngine.data.io.service.register(t, HemiEngine.data.io.service.getBusType().OFFLINE, 0, "dwac:");

            else
                t.logError("Unable to register offline service");

        }
    }, 1);
} ());
///	</class>
/// </package>
/// </source>