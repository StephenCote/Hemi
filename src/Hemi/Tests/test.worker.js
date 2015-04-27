Hemi.include("hemi.worker");
function TestHemiWorker(oTest) {
    var oWorker = Hemi.worker.service.NewWorker("worker.test");
    oWorker.onmessage = function (v) {
        Module.log("Received message: " + v.data);
        Module.getProperties().test_match = v.data;
        ContinueTestHemiWorker();
 
    };
    oWorker.postMessage(this.getObjectId());
    return false;
}
this.HandleWorkerPostMessage = function (v) {
    Module.log("Received message: " + v.data);
    Module.getProperties().test_match = v.data;
    ContinueTestHemiWorker();
    /// document.getElementById("oNote").innerHTML = "Received message: " + v.data;
};

function HandleContinueTestHemiWorker(oTest) {
    this.log("Corroborating worker data: " + this.getProperties().test_match + " == " + this.getObjectId());
    this.Assert(this.getProperties().test_match == this.getObjectId(), "Worker data was not corroborated");
    return true;
}
