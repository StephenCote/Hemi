/// Worker bootstrap only intended for DOM Worker objects
/// Don't check typeof Worker --- Chrome has no Worker in the Worker?
///
if (typeof Hemi == "undefined" && typeof importScripts == 'function') {

    importScripts('/HemiFramework/Hemi/hemi.js');
    Hemi.in_worker = 1;
    Hemi.hemi_base = "/HemiFramework/Hemi/";
    Hemi.include("hemi.app.module");
    Hemi.include("hemi.worker");

    onmessage = function (v) {
        /// _hwdNo is a key to the function, to validate that if onmessage is not defined in the module that it is not invoked in the bootstrap
        ///
        var vReg = /^_hwi:(.*)$/, sBL, sBD, aM, _hwdNo;
        if (v && typeof v.data == "string" && (aM = v.data.match(vReg))) {
            sBL = "_hwi";
            sBD = aM[1];
        }
        switch (sBL) {
            case "_hwi":
                if (typeof g_module == "undefined")
                	var sBDP = 0, sBDN = sBD;
                	if(sBD.match(/\//)){
                		sBDP = sBD.substring(0,sBD.lastIndexOf("/") + 1);
                		sBDN = sBD.substring(sBD.lastIndexOf("/") + 1, sBD.length);
                	}
                    g_module = Hemi.app.module.service.NewModule(sBDN, null, (sBDP ? sBDP : "Workers/"), Hemi.worker.service);
                
                break;
            default:
                if (g_module && typeof g_module._hwimessage_ == "function")
                    g_module._hwimessage_.apply(this.caller, arguments);
                else
                    postMessage("Boot Backup: " + v.data);
                break;
        }

    }
}
