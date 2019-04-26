/// <source>
/// <name>Hemi.framework.io.provider</name>
/// <project>
/// 	<name>Hemi JavaScript Framework</name>
/// 	<url-title>Hemi JavaScript Framework Project</url-title>
/// 	<url>/Hemi/</url>
/// </project>
///
/// <package>
///	<path>Hemi.framework.io.provider</path>
///	<library>Hemi</library>
///	<description>Data provider for static file and data sets within the Hemi Framework.</description>

(function () {
	HemiEngine.namespace("framework.io.provider", HemiEngine, {
		dependencies : ["hemi.event","hemi.data.io"],
		///	<static-class>
		///		<name>service</name>
		///		<version>%FILE_VERSION%</version>
		///		<description>Static implementation of the hemi.framework.io.provider.serviceImpl class.</description>
		///	</static-class>
		///	<class>
		///		<name>serviceImpl</name>
		///		<version>%FILE_VERSION%</version>
		///		<description>The framework provider is a <i>hemi.data.io</i> provider for serving requests for static filesets related to the HemiFramework.</description>
		///
		service: null,

		serviceImpl: function () {
			var t = this;

			HemiEngine.prepareObject("hemi_framework_io_provider", "%FILE_VERSION%", 1, t, 1);
			HemiEngine.util.logger.addLogger(t, "Hemi Framework IO Provider", "Hemi Framework IO Provider", "660");
			Hemi.event.addScopeBuffer(t);
			t.scopeHandler("loadxml", 0, 0, 1);

			t.handle_io_register = function (oService) {
				this.getProperties().useRegisteredApi = 1;
				this.implement("Catalog", "List");
				this.implement("Action", "Read");
			};
			t.handle_io_request = function (oService, oSubject, oRequest, oResponse) {
				this.getProperties().request = 1;
				/// this.log("IO Request: " + oRequest.requestContext);
				return 0;
			};

			t.handleRequestAction = function (oService, oSubject, oRequest, oResponse, a) {
				n = oRequest.requestName;
				if (!n) n = oRequest.requestId;
				t.log("handleRequestAction: " + a + ": " + Hemi.hemi_base + oRequest.requestContext + "/" + n);
				return Hemi.xml[(oRequest.mimeType && oRequest.mimeType.match(/^text/) ? "getText" : "getXml")](oRequest.requestContext + "/" + n, (oRequest.async ? this._prehandle_loadxml : 0), oRequest.async, oRequest.id);
			};

			t.requestActionRead = function (oService, oSubject, oRequest, oResponse) {
				this.log("ActionRead - " + oRequest.application + "/" + oRequest.requestContext + "/" + oRequest.requestCatalog + "/" + oRequest.requestName + " [#" + oRequest.requestId + "]/" + oRequest.requestAction);
				var oR = this.handleRequestAction(oService, oSubject, oRequest, oResponse, "Read");
				if (oRequest.async)
					return 0;
				
				this.writeRawData(oRequest, oResponse, v.xdom, oResponse.responseData);
				return 1;

			};

			t.requestCatalogList = function (oService, oSubject, oRequest, oResponse) {
			    var _ra = oRequest.requestApplication;
				if (_ra != "DWAC" && _ra != "HemiFramework" && _ra != "Explorer") {
					this.logDebug("Skip Request: " + oRequest.requestApplication);
					return 1;
				}

				var b = 0, a, r = HemiEngine.data.io.service.newPolicy(), ctx = oRequest.requestContext;
				r.read = 1;
				t.log("Catalog: " + _ra + "/" + ctx + "/" + oRequest.requestCatalog + " [#" + oRequest.requestId + "]");
				switch (oRequest.requestCatalog) {
					case "Components":
					case "Fragments":
					case "Modules":
					case "Tests":
					case "Templates":
					case "Workers":
					case "Projects":
					case "Pub":
                    case "Framework":
					case "Tasks":
						if (ctx == "Directory") t.RenderGroup(oResponse, oRequest.requestCatalog, r);
						else if (ctx == "Data") {
							try {
								if (t["RenderData" + oRequest.requestCatalog]) t["RenderData" + oRequest.requestCatalog](oResponse, r);
							}
							catch (e) {
								t.logError((e.message ? e.message : e.description));
							}
						}
						b = 1;
						break;
		            case "Examples":

		                var g = HemiEngine.data.io.service.newGroup();
		                g.name = "Examples";
		                g.path = g.name;
		                g.populated = 1;
		                oResponse.writeGroup(g, r);

		                oResponse.writeGroupArray(t.getHemiExampleGroups(r, "/" + oRequest.requestCatalog + "/"), t, g.groups, oService.getBusType().STATIC);
		                b = 1;
		                break;
					case "Hemi":
					case "DWAC":

						var g = HemiEngine.data.io.service.newGroup();
						g.name = "DWAC";
						g.path = g.name;
						g.populated = 1;
						oResponse.writeGroup(g, r);

						oResponse.writeGroupArray(t.getHemiGroups(r, "/" + oRequest.requestCatalog + "/"), t, g.groups, oService.getBusType().STATIC);
						b = 1;
						break;
				}
				if (!b) {
					this.logWarning("Unhandled Request Catalog: " + oRequest.requestCatalog);
					b = 1;
				}
				return b;
			};
			t._handle_loadxml = function (s, v) {
				try {

					var oRequest = Hemi.data.io.service.getRequestByName(v.id), oResponse;
					if (!oRequest) {
						this.logError("Invalid request for id " + v.id);
						return;
					}
					oResponse = Hemi.data.io.service.getResponseByName(oRequest.responseId);
					if (!oResponse) {
						this.logError("Invalid response for id " + v.id);
						return;
					}
					if (oRequest.requestAction == "Read")
						this.writeRawData(oRequest, oResponse, (v.xdom ? v.xdom : v.text), oResponse.responseData);
					
					Hemi.data.io.service.continueRequest(oRequest, this, true);

				}
				catch (e) {
					alert(e.name + "\n" + e.number + "\n" + e.description + "\n" + e.message);
				}
			};
			t.writeRawData = function (oRequest, oResponse, x, a) {
				var o = Hemi.data.io.service.newData(), p = HemiEngine.data.io.service.newPolicy();
				var s = DATATYPES.TO(x) ? escape(Hemi.xml.serialize(x.documentElement)) : x;
				p.read = 1;
				o.name = (oRequest.requestName ? oRequest.requestName : oRequest.requestId);
				o.path = oRequest.requestContext + "/" + o.name;
				o.id = oRequest.requestId;
				o.group = oRequest.requestContext;
				o.size = s.length;
				o.description = 0;
				o.createdDate = "%FILE_VERSION%";
				o.modifiedDate = 0;
				o.detailsOnly = 0;
				o.hash = 0;
				o.mimeType = "text/xml";
				o.value = s;
				o.policies.push(p);

				oResponse.writeData(o, t, a, Hemi.data.io.service.getBusType().STATIC);

				return o;
			};
            t.RenderDataFramework = function (oResponse, y) {
                t.RenderDataList(oResponse, t.getFrameworkData(y));
            };
			t.RenderDataComponents = function (oResponse, y) {
				t.RenderDataList(oResponse, t.getComponentData(y));
			};
			t.RenderDataModules = function (oResponse, y) {
				t.RenderDataList(oResponse, t.getModuleData(y));
			};
			t.RenderDataTemplates = function (oResponse, y) {
				t.RenderDataList(oResponse, t.getTemplateData(y));
			};
			t.RenderDataFragments = function (oResponse, y) {
				t.RenderDataList(oResponse, t.getFragmentData(y));
			};
			t.RenderDataTests = function (oResponse, y) {
				t.RenderDataList(oResponse, t.getTestData(y));
			};
			t.RenderDataList = function (oResponse, a) {
				if (oResponse.instruction.paginate) {
					oResponse.instruction.totalCount = a.length;
					a = a.slice(oResponse.instruction.startRecord, oResponse.instruction.startRecord + oResponse.instruction.recordCount);
				}
				for (var i = 0; i < a.length; i++) {
					a[i].createdDate = "%FILE_VERSION%";
					a[i].modifiedDate = "%FILE_VERSION%";
				}
				oResponse.writeDataArray(a, t, 0, Hemi.data.io.service.getBusType().STATIC);
			};
			t.RenderGroup = function (oResponse, n, y) {
				var g = HemiEngine.data.io.service.newGroup();
				g.name = n;
				g.path = g.name;
				g.populated = 1;
				oResponse.writeGroup(g, y);
				return g;
            };
            t.getHemiExampleGroups = function (o, p) {
                return HemiEngine.data.io.service.arrayToGroup(
                                [
                                    "Framework",
                                    "Fragments",
                                    "Templates",
                                    "Projects",
									"Tasks",
                                    "Tests",
                                    "Spaces",
                                    "Components",
                                    "Modules"
                                ],
                                o,
                                p
				            );
            };
			t.getHemiGroups = function (o, p) {
				return HemiEngine.data.io.service.arrayToGroup(
                    [
                        "Components",
                        "Fragments",
                        "Modules",
                        "Projects",
						"Pub",
                        "Tasks",
                        "Tests",
                        "Templates",
                        "Workers"
                    ],
                    o,
                    p
				);
                };
                t.getFrameworkData = function (o) {
                    return HemiEngine.data.io.service.arrayToData(
					                [
										"setup.examples",
						                "framework.object.new",
										"framework.object.hook",
                                        "framework.object.prepare"
					                ],
                                    o
                                );
                };
			t.getComponentData = function (o) {
				return HemiEngine.data.io.service.arrayToData(
					[
						"component.canvas.xml",
						"component.content_viewer.xml",
						"component.draggable.xml",
						"component.dragtracker.xml",
						"component.manager.xml",
						"component.session.xml",
						"component.steps.xml",
						"component.tabstrip.xml",
						"component.tree.xml",
						"component.tree_context.xml",
						"component.tree_decorator.xml",
						"component.wideselect.xml",
						"component.window.xml"
					].sort(),
                    o
                );
			};
			t.getFragmentData = function (o) {
				return HemiEngine.data.io.service.arrayToData(
					[
						"ActiveSource.xml",
						"BuilderControls.xml",
						"EngineStats.xml",
						"FrameworkAPIBrowser.xml",
						"FunMonInject.xml",
						"IOGrid.xml",
						"JavaScriptProfilerInject.xml",
						"MemberModelTools.xml",
						"RichSelect.xml",
						"RuntimeContainer.xml",
						"ScopeViewer.xml",
						"ScriptProfiler.xml",
						"TabTools.xml",
						"TestSuite.xml"
					].sort(),
                    o
                );
			};
			t.getModuleData = function (o) {
				return HemiEngine.data.io.service.arrayToData(
					[
						"console.output.js",
						"module.template.js",
                        "module.debug.js",
                        "dwac.offline.helper.js"
					].sort(),
                    o
                );
			};
			t.getTemplateData = function (o) {
				return HemiEngine.data.io.service.arrayToData(
					[
						"ActiveSource.xml",
						"ComponentBuilder.xml",
						"DWACDesigner.xml",
						"FragmentBuilder.xml",
						"FrameworkAPIBrowser.xml",
						"FrameworkDesigner.xml",
						"FrameworkProfiler.xml",
						"FVTs.xml",
						"IOGridTemplate.xml",
						"LogViewer.xml",
						"NewComponent.xml",
						"NewFragment.xml",
						"NewProject.xml",
						"NewTask.xml",
						"NewTaskList.xml",
						"NewTemplate.xml",
						"Picker.xml",
						"ProjectBuilder.xml",
						"RichSelectTemplate.xml",
						"RuntimeContainer.xml",
						"TaskBuilder.xml",
						"TemplateBuilder.xml",
						"TemplateTools.xml",
						"TestSuite.xml",
						"TextViewer.xml",
						"XslTransformer.xml"
					].sort(),
                    o
                );
			};
			t.getTestData = function (o) {
				return HemiEngine.data.io.service.arrayToData(
					[
					"test.app.comp.js",
					"test.app.comp.altdata.js",
					"test.app.space.js",
					/// "test.core.io.js",
					"test.data.form.js",
					"test.data.io.js",
                    "test.data.io.offline.js",
					"test.data.validator.js",
					"test.framework.io.provider.js",
					"test.graphics.canvas.js",
					"test.message.js",
					"test.module.js",
					"test.monitor.js",
					"test.object.js",
					"test.object.xhtml.js",
					"test.storage.js",
					"test.task.js",
					"test.transaction.js",
                    "test.util.config.js",
					"test.xml.js",
					"test.worker.js"
					].sort(),
                    o
                );
			};

			t.ready_state = 4;
			HemiEngine.data.io.service.register(t, Hemi.data.io.service.getBusType().STATIC);

		}
	}, 1);
} ());
///	</class>
/// </package>
/// </source>