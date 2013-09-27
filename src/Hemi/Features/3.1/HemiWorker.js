importScripts('/Hemi/hemi.js');
//importScripts("HemiFramework.js");
// Try to dress-up the worker as a Hemi object
//

var bFrameworkLoaded = (typeof window.Hemi == "object" && typeof window.Hemi.xml == "object");
var oConsole = 0;
var bSelfRegister = 0;
if (bFrameworkLoaded) {
    Hemi.include("hemi.transaction");
    Hemi.include("hemi.util.logger");
    Hemi.include("hemi.app.module");

    Hemi.prepareObject("dom.worker", "1.0", 1, this);
    HemiEngine.util.logger.addLogger(this, "HemiWorker", "DOM Worker", "700");
    bSelfRegister = (typeof getObjectId == "function" && typeof log == "function");

    oConsole = Hemi.newObject("console", "1.0", 1);


    //Hemi.transaction.service.register(oConsole, true);
    //var iPacket = oConsole.joinTransactionPacket("console");

    Hemi.message.service.subscribe("onsendmessage", function (s, v) {
        update(v.message);
    });

}


//var iC = 0;
function update(sIn) {
    //postMessage('OUT\n\n' + sIn);
    //iC++;
}
onmessage = function (message) {
    var a = [];
    log("Test internal message");
    // Intra framework test
    //var o = [];
    //for (var i in this) o.push("\t" + i);
    //a.push(o.join("\n"));
    //a.push("Is Worker: " + (this instanceof Worker));
    a.push("Hemi: " + (typeof window.Hemi == "object"));
    a.push("Hemi.xml: " + bFrameworkLoaded);
    if (bFrameworkLoaded) {
        a.push("Hemi.hemi_base: " + Hemi.hemi_base);
        a.push("This Register: " + (typeof this.getObjectId == "function"));
        a.push("Self Register: " + bSelfRegister);

        a.push("Check importScripts: " + (typeof importScripts));
        a.push("Check terminate: " + (typeof terminate));
        a.push("Object Register: " + (typeof oConsole.getObjectId == "function"));

        var aTests = ["test.worker", "test.object"];
        for (var i = 0; i < aTests.length; i++) {
            var vTest = Hemi.app.module.service.NewTest(aTests[i]);
            vTest.RunTests();
            a.push(vTest.getReport());
        }
    }

    a.push("Location: " + (typeof location == "object"));
    a.push("Document: " + (typeof document == "object"));
    //update(a.join("\n"));
    //if (bSelfRegister) log(a.join("\n"));
    //else update(a.join("\n"));
    postMessage('OUT\n\n' + a.join("\n"));

};