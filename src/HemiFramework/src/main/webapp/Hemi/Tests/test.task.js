Hemi.include("hemi.task");

function TestTaskAPI(oResult) {
    var oTask = Hemi.task.service.addTask("example_api_task", 0, 0, "function", HandleTaskAPICallback);
    Hemi.task.service.addTaskDependency(oTask, "task-depends");
    Hemi.task.service.executeTask(oTask);
    Hemi.task.service.returnDependency("task-depends");
    return false;
}
function HandleTaskAPICallback() {
    ContinueTestTaskAPI();
    return true;
}
function HandleContinueTestTaskAPI(o) {
    var oTask = Hemi.task.service.getTaskByName("example_api_task");
    this.log("Handled " + oTask.task_name + " with state " + oTask.task_state);
    return true;
}
function TestXMLList(oResult) {
    /// var sApply = Hemi.registry.getApplyStatement(this,"HandleLoadTaskXML");
    var oTask = Hemi.task.service.addTaskLoader("test.xml.loader", "xml", "Tests/test.tasks.xml", "function", HandleLoadTaskXML);
    Hemi.task.service.executeTask(oTask);
    return false;
}
function HandleLoadTaskXML(sTaskName, oService) {
    ContinueTestXMLList();
}
function HandleContinueTestXMLList() {
    var oTask = Hemi.task.service.getTaskByName("test.xml.loader");
    this.Assert(oTask, "Task loader not found");
    this.Assert(oTask.data, "Task data not found");
    
    Hemi.task.service.importTaskFromXml("example_task", oTask);

    var oImportedTask = Hemi.task.service.getTaskByName("example_task");
    this.Assert(oImportedTask, "Task was not imported");
    return true;
}
function TestTaskLoader(oResult) {
    Hemi.message.service.subscribe("onloadexampletask", HandleTaskImport);
    var oTask = Hemi.task.service.addTaskLoader("test.task.loader2", "xml", "Tests/test.tasks.xml", "import-task", "example_task");
    Hemi.task.service.executeTask(oTask);
    return false;
}
function HandleTaskImport() {
    ContinueTestTaskLoader();
}
function HandleContinueTestTaskLoader(oResult) {
    var oTask = Hemi.task.service.getTaskByName("test.xml.loader2");
    var oImportedTask = Hemi.task.service.getTaskByName("example_task");
    this.Assert(oImportedTask, "Task was not imported");
    Hemi.message.service.unsubscribe("onloadexampletask", HandleTaskImport);
    return true;
}