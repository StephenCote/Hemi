Hemi.include("hemi.data.io");
Hemi.include("hemi.data.io.proxy");
Hemi.include("hemi.framework.io.offline.provider");

function TestProxies(oTest) {
	var oService = Hemi.data.io.proxy.service;
	oService.setAutoChangeBus(1);
	oService.setBusType(Hemi.data.io.service.getBusType().OFFLINE);


	this.Assert(!oService.isProxied("Components/test.xml"), "No protocol should not be proxied");
	this.Assert(!oService.isProxied("http://localhost/Hemi/Components/test.xml"), "HTTP protocol should not be proxied");
	this.Assert(!oService.isProxied("https://localhost/Hemi/Components/test.xml"), "HTTPS protocol should not be proxied");
	this.Assert(!oService.isProxied("file://localhost/Hemi/Components/test.xml"), "FILE protocol should not be proxied");
	this.Assert(oService.isProxied("dwac:Components/test.xml"), "DWAC protocol should be proxied");
}

function TestAppCompAltDataProtocol(oTest) {
	this.Assert(AddOfflineData("Components", "component.proxy.xml"), "Offline data not added");
	var oResponse = ReadData("Components", "component.proxy.xml");
	this.Assert((oResponse && oResponse.status && oResponse.responseData.length), "Offline data not found");
	var oXml = Hemi.xml.parseXmlDocument(oResponse.responseData[0].value);
	this.Assert(oXml && oXml.documentElement.nodeName == "application-components", "Invalid XML structure.");


	var oXml = Hemi.xml.getXml("dwac:/DWAC/User/Components/component.proxy.xml");
	return;
	this.Assert(oXml && oXml.documentElement.nodeName == "application-components", "Invalid XML Structure #2.");
	/// this.log("Path: " + oResponse.responseData[0].path);
	/// Now, try to get the data via Hemi.xml.getXml using a proxy protocol
}

function TestAsyncAppCompAltDataProtocol(oTest) {
	Hemi.xml.getXml("dwac:/DWAC/User/Components/component.proxy.xml", HandleAsyncAppCompAltDataProtocol, true);
	return false;
}
function HandleContinueTestAsyncAppCompAltDataProtocol(oTest){
	this.Assert(oTest.data && oTest.data.xdom && oTest.data.xdom.documentElement, "XML document not found");
	this.Assert(oTest.data.xdom.documentElement.nodeName == "application-components","Expected XML not found");
	return true;
}
function HandleAsyncAppCompAltDataProtocol(sMessage, vData) {
	Module.getTestByName("TestAsyncAppCompAltDataProtocol").data = vData;
	ContinueTestAsyncAppCompAltDataProtocol();
}

/// Utility Functions


function ReadData(sGroup, sName) {
	var oRequest = Hemi.data.io.service.newIORequest(
        Hemi.data.io.service.getBusType().OFFLINE,
        "DWAC",
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
        "DWAC",
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

function AddOfflineData(sGroup, sName) {
	DeleteData("Components", sName);
	var oInstruction = Hemi.data.io.service.newIOInstruction(0, 0, 0, 0, 0);
	var iBus = Hemi.data.io.service.getBusType().OFFLINE;
	var sCat = sGroup;
	var sReq = 0; // "Components";
	var sAction = "Add";
	var sId = 0;
	var bDetailsOnly = 1;
	var bAsync = 0;
	var sApp = "DWAC";

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

	var oData = Hemi.data.io.service.newData();
	oData.name = sName;
	oData.mimeType = "text/xml";
	oData.value = "<?xml version=\"1.0\" encoding=\"utf-8\" ?>\n<application-components>\n<application-component id = \"test\">\n<![CDATA[\ncomponent_init:function(){\n//alert('init');\n},\ncomponent_post_init : function(){\n}\n]]>\n</application-component>\n</application-components>";
	oData.group = sGroup;
	oRequest.requestData.push(oData);
	/// this.log("Adding " + sName);
	Hemi.data.io.service.openRequest(
		Hemi.data.io.service.getSubject(),
		oRequest
	);
	var oResponse = Hemi.data.io.service.getResponseByName(oRequest.responseId);
	return (oResponse && oResponse.status);
}

/*
function XXXXTestExternalApplicationComponent() {
	var oComp = Hemi.app.createApplicationComponent("test");
	this.Assert(oComp, "Component was not created");
	oComp.destroy();
}
*/