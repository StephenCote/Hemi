Hemi.include("hemi.data.io");
Hemi.include("hemi.framework.io.provider");
Hemi.include("hemi.framework.io.offline.provider");
function ReadData(sGroup, sName) {
	var oRequest = Hemi.data.io.service.newIORequest(
        Hemi.data.io.service.getBusType().OFFLINE,
        "HemiFramework",
        sGroup,
        0,
        "Read",
        0,
        sName, // name
        0, // details only
        0, // async
        0, // cache
        0
    );
	Hemi.data.io.service.openRequest(
		Hemi.data.io.service.getSubject(),
		oRequest
	);
	return Hemi.data.io.service.getResponseByName(oRequest.responseId);
}
function DeleteData(sGroup, sName) {
	var oRequest = Hemi.data.io.service.newIORequest(
        Hemi.data.io.service.getBusType().OFFLINE,
        "HemiFramework",
        sGroup,
        0,
        "Delete",
        0,
        sName, // name
        0, // details only
        0, // async
        0, // cache
        0
    );
	Hemi.data.io.service.openRequest(
		Hemi.data.io.service.getSubject(),
		oRequest
	);
	return Hemi.data.io.service.getResponseByName(oRequest.responseId);
}

function xxTestCleanupComponentGroup(oTest) {
	var oGroup = Hemi.framework.io.offline.provider.service.GetGroup("Components");
	this.Assert(oGroup, "Group doesn't exist");
	Hemi.framework.io.offline.provider.service.DeleteGroup("Components");
	oGroup = Hemi.framework.io.offline.provider.service.GetGroup("Components");
	this.Assert(!oGroup, "Group still exists");
}

function TestOfflineDataAdd(oTest) {
	this.log("Prep Cleanup");
	DeleteData("Components", "component.test.xml");
	var oInstruction = Hemi.data.io.service.newIOInstruction(0, 0, 0, 0, 0);
	var iBus = Hemi.data.io.service.getBusType().OFFLINE;
	var sCat = "Components";
	var sReq = 0; // "Components";
	var sAction = "Add";
	var sId = 0;
	var bDetailsOnly = 1;
	var bAsync = 0;
	var sApp = "HemiFramework";
	var sName = 0;
	var oRequest = Hemi.data.io.service.newIORequest(
        iBus,
        sApp,
        sCat,
        sReq,
        sAction,
        sId,
        sName, // name
        bDetailsOnly, // details only
        bAsync, // async
        0, // cache
        oInstruction
    );
	
	var oData = Hemi.data.io.service.newData();
	oData.name = "component.test.xml";
	oData.mimeType = "text/xml";
	oData.value = "<?xml version=\"1.0\" encoding=\"utf-8\" ?>\n<application-components>\n<application-component id = \"test\">\n<![CDATA[\ncomponent_init:function(){\n//alert('init');\n},\ncomponent_post_init : function(){\n}\n]]>\n</application-component>\n</application-components>";
	oData.group = "Components";
	oRequest.requestData.push(oData);

	oTest.data = oRequest.id;
	this.log("Open Request: " + oTest.data);
	Hemi.data.io.service.openRequest(
		Hemi.data.io.service.getSubject(),
		oRequest
	);
	var oResponse = Hemi.data.io.service.getResponseByName(oRequest.responseId);
	this.Assert(oResponse, "Response is null");
	this.Assert(oResponse.status, "Response status is false");
	return true;
}

function TestOfflineDataList(oTest) {
	var oInstruction = Hemi.data.io.service.newIOInstruction(0, 0, 0, 0, 0);
	var iBus = Hemi.data.io.service.getBusType().OFFLINE;
	var sCat = "Data";
	var sReq = "Components";
	var sAction = "List";
	var sId = 0;
	var bDetailsOnly = 1;
	var bAsync = 0;
	var sApp = "HemiFramework";
	var oRequest = Hemi.data.io.service.newIORequest(
        iBus,
        sApp,
        sCat,
        sReq,
        sAction,
        sId,
        0, // name
        bDetailsOnly, // details only
        bAsync, // async
        0, // cache
        oInstruction
    );
	oTest.data = oRequest.id;
	this.log("Open Request: " + oTest.data);
	Hemi.data.io.service.openRequest(
		Hemi.data.io.service.getSubject(),
		oRequest,
		HandleOfflineDataListRequest
	);
	return false;
}
function HandleOfflineDataListRequest(oService, oSubject, oRequest, oResponse) {
	ContinueTestOfflineDataList();
}
function HandleContinueTestOfflineDataList(oTest) {
	this.Assert(oTest.data, "Test result does not include a request id");

	var oRequest = Hemi.data.io.service.getRequestByName(oTest.data);
	this.Assert(oRequest, "Request was not found for " + oTest.data);
	var oResponse = Hemi.data.io.service.getResponseByName(oRequest.responseId);
	this.Assert(oResponse, "Response was not found for " + oRequest.responseId);
	this.Assert(oResponse.responseData.length, "Response did not contain any data");
	for (var i = 0; i < oResponse.responseData.length; i++) {
		this.log("..." + oResponse.responseData[i].name);
	}
	this.log("Continue request: " + oTest.data);
}

function TestOfflineDataRead(oTest) {
	var oResponse = ReadData("Components", "component.test.xml");
	this.Assert(oResponse, "Response is null");
	this.Assert(oResponse.status, "Response status indicates the data was not found");
	this.Assert(oResponse.responseData.length, "Response contains no data");
	this.log("Retrieved data '" + oResponse.responseData[0].name + "' with size " + oResponse.responseData[0].size);
}
function TestOfflineGroupList(oTest) {
	var oInstruction = Hemi.data.io.service.newIOInstruction(0, 0, 0, 0, 0);
	var iBus = Hemi.data.io.service.getBusType().OFFLINE;
	var sCat = "Directory";
	var sReq = "DWAC";
	var sAction = "List";
	var sId = 0;
	var bDetailsOnly = 1;
	var bAsync = 0;
	var sApp = "HemiFramework";
	var oRequest = Hemi.data.io.service.newIORequest(
        iBus,
        sApp,
        sCat,
        sReq,
        sAction,
        sId,
        0, // name
        bDetailsOnly, // details only
        bAsync, // async
        0, // cache
        oInstruction
    );
	oTest.data = oRequest.id;
	this.log("Open Request: " + oTest.data);
	Hemi.data.io.service.openRequest(
		Hemi.data.io.service.getSubject(),
		oRequest,
		HandleOfflineGroupListRequest
	);
	return false;
}
function HandleOfflineGroupListRequest(oService, oSubject, oRequest, oResponse) {
	ContinueTestOfflineGroupList();
}
function HandleContinueTestOfflineGroupList(oTest) {
	this.log("Continue request: " + oTest.data);
	this.Assert(oTest.data, "Test result does not include a request id");

	var oRequest = Hemi.data.io.service.getRequestByName(oTest.data);
	this.Assert(oRequest, "Request was not found for " + oTest.data);
	var oResponse = Hemi.data.io.service.getResponseByName(oRequest.responseId);
	this.Assert(oResponse, "Response was not found for " + oRequest.responseId);
	this.Assert(oResponse.responseGroups.length, "Response did not contain any groups");
	var oRoot = oResponse.responseGroups[0];
	this.log(oRoot.name);
	for (var i = 0; i < oRoot.groups.length; i++) {
		this.log("..." + oRoot.groups[i].name);
	}
	return true;
}