/// <source>
/// <name>Hemi.worker</name>
/// <project>
/// 	<name>Hemi JavaScript Framework</name>
/// 	<url-title>Hemi JavaScript Framework Project</url-title>
/// 	<url>/Hemi/</url>
/// </project>
///
/// <package>
///	<path>Hemi.worker</path>
///	<library>Hemi</library>
///	<description>The worker is a managed wrapper for the HTML 5 DOM Worker.  Hemi Worker implements the <i>Hemi Module</i> service to inject the target worker script with the Module API, add a lightweight Psuedo Worker API for browsers that don't support Worker, and add a bootstrap to browsers that do support Worker so the Worker runs in the Hemi framework.</description>
(function () {

    /// Inside worker
    /// Add Hemi framework
    /*
    if (typeof Worker != "undefined"
        &&
        typeof importScripts == "function"
     ) {
        importScripts('/Hemi/hemi.js');
        Hemi.is_worker = 1;
    }
    */

    ///	<static-class>
    ///		<name>service</name>
    ///		<version>%FILE_VERSION%</version>
    ///		<description>Static implementation of the hemi.worker.serviceImpl class.</description>
    ///
    ///
    ///	</static-class>
    ///	<class>
    ///		<name>serviceImpl</name>
    ///		<version>%FILE_VERSION%</version>
    ///		<description>The worker service provides a wrapper for adding the Hemi Module API to Worker scripts, and adding a lightweight wrapper for browsers that don't support Workers.</description>
    ///

    HemiEngine.namespace("worker", HemiEngine, {
    	dependencies : ["hemi.event","hemi.app.module","hemi.object","hemi.util.logger"],
        service: null,

        serviceImpl: function () {
            var t = this;
            HemiEngine._implements(t, "base_object", "worker_service", "%FILE_VERSION%");
            HemiEngine.util.logger.addLogger(t, "Worker Service", "Worker Service", "630");

            HemiEngine.registry.service.addObject(t);
            t.ready_state = 4;
            /*
            HemiEngine.event.addScopeBuffer(t);
            t.scopeHandler("worker", 0, 0, 1);
            */

            /// <object>
            ///	<name>PsuedoWorker</name>
            /// 	<description>A lightweight Worker implementation.  Includes all FrameworkObject members.</description>
            ///		<method virtual = "1">
            ///			<name>onmessage</name>
            /// 		<description>Invoked by the Worker via the <i>postMessage</i> method.</description>
            ///		</method>
            ///		<method>
            ///			<name>postMessage</name>
            ///         <param name = "sData" type = "String">Data to post to the worker.</param>
            /// 		<description>Posts the specified message to the Worker.  <i>Note:</i> The wrapper does not currently convert objects into JSON notation.</description>
            ///		</method>
            /// </object>


            /// <method>
            /// 	<name>NewWorker</name>
            ///		<param name="sName" type="String">Name of the worker script.</param>
            ///		<param name="sPath" optional = "1" type="String">Parent path to the script which the worker will process.</param>
            ///		<param name="oContainer" type="XHTMLComponent" optional = "1">XHTML Component acting as a container for the module.</param>
            /// 	<return-value type = "Worker" name = "vWorker">A Worker or PsuedoWorker object..</return-value>
            /// 	<description>Creates a new Worker or PsuedoWorker object, depending on browser support.</description>
            /// </method>
            t.NewWorker = function (n, p, x) {

                var w;

                if (typeof Worker != "undefined") {
                    w = new Worker(Hemi.hemi_base + "Workers/worker.bootstrap.js");
                    w.onmessage = this._prehandle_worker;
                    w.postMessage('_hwi:' + (p ? p : "Workers/") + n);
                }
                else {
                    w = Hemi.newObject("proxy_worker", "%FILE_VERSION%", 1, 0, {
                        object_create: function () {
                            this.getObjects().module = Hemi.app.module.service.NewModule(n, null, (p ? p : "Workers/"), {
                                DecorateModuleContent: function () {
                                    return "var WorkerProxy = null;"
                                        +
                                        "function postMessage(v){var d = [{ data: v }];if(WorkerProxy && typeof WorkerProxy.onmessage == 'function'){WorkerProxy.onmessage.apply(this,d);}};"
                                        +
                                        "this._hwimessage_ = function(){if(typeof onmessage == 'function' && !onmessage.toString().match(/_hwdNo/)){onmessage.apply(this,arguments);}};"
                                        +
                                        "this.SetWorkerProxy = function(o){ WorkerProxy = o;};"
                                    ;
                                }
                            });
                            this.getObjects().module.SetWorkerProxy(this);
                        },
                        postMessage: function (v) {
                            var d = [{ data: v}];
                            this.getObjects().module._hwimessage_.apply(this.getObjects().module, d);
                        }
                    });
                    /// oW.onmessage = this._prehandle_worker;
                }
                /*
                oW.postMessage("Demo");
                */
                return w;
            };
            /*
            t._handle_worker = function (s, v) {
                alert('handle: ' + s.data + ":" + this.getObjectId());
            };
            */
            t.DecorateModuleContent = function () {
                var s =
                    (Hemi.in_worker ? "" : "function postMessage(v){Module._hwimessage_(v);};")
                    +
                    "this._hwimessage_ = function(){if(typeof onmessage == 'function' && !onmessage.toString().match(/_hwdNo/)){onmessage.apply(this,arguments);}};"
                  ;
                return s;
            };
        }
    }, 1);
} ());
///	</class>
/// </package>
/// </source>