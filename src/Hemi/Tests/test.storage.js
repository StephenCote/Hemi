Hemi.include("hemi.storage");
Hemi.include("hemi.storage.iestore")

function TestStorageSupported(){
	this.Assert(Hemi.storage.testStorageSupported(), "Storage is not supported");
	this.log("Storage Type = " + Hemi.storage.getStorageProvider().storage_type);
}

function TestPreferredStorageAccess(){
    this.Assert(Hemi.storage.testStorageSupported(), "Storage is not supported");
    Hemi.log("Preferred Storage Type: " + Hemi.storage.getStorageProvider().storage_type);
	var sPrevVal = Hemi.storage.getStorageProvider().getItem("__test_name");

	var sVal = Hemi.guid();
	var bSet = Hemi.storage.getStorageProvider().setItem("__test_name", sVal);
	var sCurVal = Hemi.storage.getStorageProvider().getItem("__test_name");

	this.log("Preferred Storage Type: Previous value = " + sPrevVal + " :: New Value = " + sCurVal);
	this.Assert((sCurVal && sCurVal != sPrevVal), "Preferred storage value (" + Hemi.storage.getStorageProvider().storage_type + ") was not properly set and retrieved");
}

function XXXTestDOMSessionStorage() {
    this.Assert(window.sessionStorage, "DOMStorage::sessionStorage is not supported");
    var sId = "__offline_" + Module.getObjectId();
    try {
        var sLastVal = window.sessionStorage.getItem(sId);
        window.sessionStorage.removeItem(sId);
        window.sessionStorage.setItem(sId, "__test_value");
        var sVal = window.sessionStorage.getItem(sId);
        this.Assert((sVal && sVal != sLastVal), "Session storage value was not property set and retrieved");
    }
    catch (e) {
        this.Assert(true, "TestDOMSessionStorage Error: " + (e.message ? e.message : e.description));
    }
}

function XXTestStorageObject() {
    this.Assert(window.Storage, "DOMStorage::Storage is not supported");
    var sId = "__offline_" + Module.getObjectId();
    var sLastVal = window.Storage.getItem(sId);
    window.Storage.removeItem(sId);
    window.Storage.setItem(sId, "__test_value");
    var sVal = window.Storage.getItem(sId);
    this.Assert((sVal && sVal != sLastVal), "Session storage value was not property set and retrieved");
}

function TestIECompatStore() {
    Hemi.log("IE Compat Store Test");
    if (!document.documentElement.addBehavior) {
        this.log("TestIECompatStore not applicable");
        return true;
    }

    /// oSP is the underlying storage object; in this case, the node with the userdata behavior
    var oSP = Hemi.storage.iestore.getPreferredStorage();

    this.Assert(oSP, "IEStorageProvider is not supported");
    var sId = "__ieoffline_compat_";

    var sLastVal = Hemi.storage.iestore.getItem(sId);
    Hemi.storage.iestore.removeItem(sId);
    Hemi.storage.iestore.setItem(sId, "__test_value");
    var sVal = Hemi.storage.iestore.getItem(sId);
    Hemi.storage.iestore.removeItem(sId);
    this.log("Storage Compat Value Comp = " + sLastVal + " :: " + sVal);
    this.Assert((sVal && sVal != sLastVal), "IE Session storage value was not property set and retrieved");
}

/*
function XXTestSQLite(){
  var file = Components.classes["@mozilla.org/file/directory_service;1"].getService(Components.interfaces.nsIProperties).get("ProfD", Components.interfaces.nsIFile);  
   file.append("my_db_file_name.sqlite");  
   var storageService = Components.classes["@mozilla.org/storage/service;1"].getService(Components.interfaces.mozIStorageService);  
   var mDBConn = storageService.openDatabase(file); // Will also create the file if it does not exist  
}
*/