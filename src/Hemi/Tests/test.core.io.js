Hemi.include("hemi.data.io");
Hemi.include("core.io", "/Scripts/");


function getLoginTemplate(u, p) {
   return "<Template><import-xml src = 'Templates/TemplateTools.xml' /><input type = 'password' rid = 'password' /><input type = 'text' rid = 'user_name' /><embedded-script><![CDATA["
    + "template_init : function(){"
    + "this.GetElementByRID(\"user_name\").value = \"" + u + "\";"
    + "this.GetElementByRID(\"password\").value = \"" + p + "\";"
    + "var oR = Hemi.xml.postXml(g_application_path + \"Login.aspx?is-xml=1\", this.SerializeForm());"
    + "this.SetFormValue(\"password\", \"\");"
    + "if (this.IsSuccess(oR)) this.GetSession().Refresh(1);"
    + "}]]></embedded-script></Template>"
    ;
}
function getTemplate(s) {
    var oDiv = document.createElement("div");
    var oX = Hemi.object.xhtml.newInstance(oDiv, 1);
    var oA = Hemi.app.comp.newInstance(0, 0, oX.getObjectId(), 0, 0, 1);
    oA.setTemplateIsSpace(1);
    oA.setAsync(false);
    var oTemplate = Hemi.xml.parseXmlDocument(s);
    oA.loadTemplateFromNode(oTemplate.documentElement);
    return oA;
}
function DoLogin(u, p) {
    return getTemplate(getLoginTemplate(u, p));
}
function DoLogout() {
    var oR = Hemi.xml.getXml(g_application_path + "Login.aspx?is-xml=1&logout=1&t=" + (new Date()).getTime());
    var oSession = Hemi.registry.service.getObject("session");
    oSession.Refresh(1);
    return (!oSession.GetBoolParam("IsLoggedIn"));
}

function CheckLogin() {
    var oSession = Hemi.registry.service.getObject("session");
    if (oSession.GetBoolParam("IsLoggedIn")) {
        Module.log("Log out current session");
        Module.Assert(DoLogout(), "Session was not logged out");
    }
    var oSubject = Hemi.data.io.service.getSubject();

    Module.Assert(!oSubject.id, "Subject id '" + oSubject.id + "' should not be specified");
    DoLogin("qa_user1", "password");
    Module.Assert(oSubject.id, "Subject id '" + oSubject.id + "' should be specified");
}

function SerializeForm(oX, sFN, sFV) {
	if(typeof sFV == "boolean") sFV = sFV.toString();
	if (!sFV || sFV.length == 0) return 0 ;
	if(!oX) oX = Hemi.xml.newXmlDocument("Request");
	var oF = oX.documentElement.getElementsByTagName("Form");
	if(oF.length) oF = oF[0];
	else{
		oF = oX.createElement("Form");
		oX.documentElement.appendChild(oF);				
	}

	var oElement = oX.createElement("Element");
	oF.appendChild(oElement);
	var oName = oX.createElement("Name");
	oName.appendChild(oX.createCDATASection(sFN));
	oElement.appendChild(oName);
	var oValue = oX.createElement("Value");
	oValue.appendChild(oX.createCDATASection(sFV));
	oElement.appendChild(oValue);
	return oX;
}
function GetSerialData(){
	var oData = Hemi.data.io.service.newData();
	oData.postData = 1;
	oData.name = "serial_form_data";
	oData.mimeType = "application/xml";
	return oData;
}

function TestGetDataList() {
	// CheckLogin();
	var oRequest = Hemi.data.io.service.newIORequest(
        Hemi.data.io.service.getBusType().ONLINE,
        "DWAC", //application
        "Directory", //context
        "Components", // catalog
        "List", //action
        0, // id
        0, // name
        1, // details only
        0, // async
        0, // cache
        0 // instruction
    );
	Hemi.data.io.service.openRequest(Hemi.data.io.service.getSubject(), oRequest, HandleTestGetDataList);

	return 0;
}
function HandleTestGetDataList(oService, oSubject, oRequest, oResponse) {
	var aData = oResponse.responseData;
	Module.log("Received test data: " + aData.length);
	Module.Assert(aData.length > 0, "There should be some data");
	for (var i = 0; i < aData.length; i++) {
		Module.log(aData[i].name);
	}
	EndTestGetDataList(aData.length > 0);
}

function TestDataRead() {
	CheckLogin();
	var oRequest = Hemi.data.io.service.newIORequest(
        Hemi.data.io.service.getBusType().ANY,
        "DWAC", //application
        "Components", //context
        0, // catalog
        "Read", //action
        0, // id
        "ExampleComponentTest2", // name
        1, // details only
        0, // async
        0, // cache
        0 // instruction
    );
	Hemi.data.io.service.openRequest(Hemi.data.io.service.getSubject(), oRequest);
	var oResponse = Hemi.data.io.service.getResponseByName(oRequest.responseId);
	this.Assert(oResponse.responseData.length, "Expected response data");
	this.Assert(oResponse.responseData.length == 1, "Only expected one data item");
	var oD = oResponse.responseData[0];
	this.Assert(oD.id, "Expected a data identifier");
	this.log("Data = " + oD.name + " [#" + oD.id + "]");
}
function TestDataEdit() {
	CheckLogin();

	var oD = GetSerialData();
	oD.value = SerializeForm(0, "component_name", "ExampleComponentTest2");

	var oRequest = Hemi.data.io.service.newIORequest(
        Hemi.data.io.service.getBusType().ONLINE,
        "DWAC", //application
        "Components", //context
        0, // catalog
        "Delete", //action
        0, // id
        "ExampleComponentTest2", // name
        1, // details only
        0, // async
        0, // cache
        0 // instruction
    );
	oRequest.requestData.push(oD);
	Hemi.data.io.service.openRequest(Hemi.data.io.service.getSubject(), oRequest);

	oD = GetSerialData();
	oX = SerializeForm(0, "component_name", "ExampleComponentTest2");
	SerializeForm(oX, "participation_name", "ExampleComponentTest2");
	SerializeForm(oX, "component_text", escape("<?xml version=\"1.0\" encoding=\"utf-8\" ?>\n<application-components><application-component id = \"test\"><![CDATA[component_init:function(){alert('init');},component_post_init : function(){}]]></application-component></application-components>\n"));
	oD.value = oX;
	var oRequest = Hemi.data.io.service.newIORequest(
        Hemi.data.io.service.getBusType().ONLINE,
        "DWAC", //application
        "Components", //context
        0, // catalog
        "Add", //action
        0, // id
        "ExampleComponentTest2", // name
        1, // details only
        0, // async
        0, // cache
        0 // instruction
    );
	oRequest.requestData.push(oD);
	Hemi.data.io.service.openRequest(Hemi.data.io.service.getSubject(), oRequest);
	var oResponse = Hemi.data.io.service.getResponseByName(oRequest.responseId);
	this.Assert(oResponse.status == true, "Response status was not true");
	this.Assert(oResponse.responseId, "New data id was not returned");

	oRequest = Hemi.data.io.service.newIORequest(
        Hemi.data.io.service.getBusType().ONLINE,
        "DWAC", //application
        "Components", //context
        0, // catalog
        "Read", //action
        oResponse.responseId, // id
        0, // name
        1, // details only
        0, // async
        0, // cache
        0 // instruction
    );
	Hemi.data.io.service.openRequest(Hemi.data.io.service.getSubject(), oRequest);
	oResponse = Hemi.data.io.service.getResponseByName(oRequest.responseId);
	this.Assert(oResponse.responseData.length == 1, "Only expected one data item");
	var oDat = oResponse.responseData[0];

	oD = GetSerialData();
	oX = SerializeForm(0, "component_name", "ExampleComponentTest2");
	SerializeForm(oX, "component_id", oDat.id);
	SerializeForm(oX, "participation_name", "ExampleComponentTest2");
	SerializeForm(oX, "component_text", escape("<?xml version=\"1.0\" encoding=\"utf-8\" ?>\n<application-components><application-component id = \"test\"><![CDATA[component_init:function(){alert('init edit');},\ncomponent_post_init : function(){\n}]]></application-component></application-components>\n"));
	oD.value = oX;

	oRequest = Hemi.data.io.service.newIORequest(
        Hemi.data.io.service.getBusType().ONLINE,
        "DWAC", //application
        "Components", //context
        0, // catalog
        "Edit", //action
        oDat.id, // id
        0, // name
        1, // details only
        0, // async
        0, // cache
        0 // instruction
    );
	oRequest.requestData.push(oD);
	Hemi.data.io.service.openRequest(Hemi.data.io.service.getSubject(), oRequest);
	var oResponse = Hemi.data.io.service.getResponseByName(oRequest.responseId);
	this.Assert(oResponse.status == true, "Response status was not true");

}
function TestDataAdd() {
	CheckLogin();
	var oD = GetSerialData();
	var oX = SerializeForm(0, "component_name", "ExampleComponentTest");
	SerializeForm(oX, "participation_name", "ExampleComponentTest");
	/// SerializeForm(oX, "package_name", "");
	SerializeForm(oX, "component_text", escape("<?xml version=\"1.0\" encoding=\"utf-8\" ?>\n<application-components><application-component id = \"test\"><![CDATA[component_init:function(){alert('init');},component_post_init : function(){}]]></application-component></application-components>\n"));
	oD.value = oX;

	var oRequest = Hemi.data.io.service.newIORequest(
        Hemi.data.io.service.getBusType().ONLINE,
        "DWAC", //application
        "Components", //context
        0, // catalog
        "Add", //action
        0, // id
        "ExampleComponentTest", // name
        1, // details only
        0, // async
        0, // cache
        0 // instruction
    );
	oRequest.requestData.push(oD);
	Hemi.data.io.service.openRequest(Hemi.data.io.service.getSubject(), oRequest);
	var oResponse = Hemi.data.io.service.getResponseByName(oRequest.responseId);
	this.Assert(oResponse.status == true, "Response status was not true");
	this.Assert(oResponse.responseId, "New data id was not returned");
}
function TestDataDelete() {
	CheckLogin();
	var oD = GetSerialData();
	oD.value = SerializeForm(0, "component_name", "ExampleComponentTest");

	var oRequest = Hemi.data.io.service.newIORequest(
        Hemi.data.io.service.getBusType().ONLINE,
        "DWAC", //application
        "Components", //context
        0, // catalog
        "Delete", //action
        0, // id
        "ExampleComponentTest", // name
        1, // details only
        0, // async
        0, // cache
        0 // instruction
    );
	oRequest.requestData.push(oD);
	Hemi.data.io.service.openRequest(Hemi.data.io.service.getSubject(), oRequest);
	var oResponse = Hemi.data.io.service.getResponseByName(oRequest.responseId);
	this.Assert(oResponse.status == true, "Response status was not true");
}
function TestDataCheckName() {
	var oD = GetSerialData();
	oD.value = SerializeForm(0, "component_name", "ExampleComponent");

	var oRequest = Hemi.data.io.service.newIORequest(
        Hemi.data.io.service.getBusType().ONLINE,
        "DWAC", //application
        "Components", //context
        0, // catalog
        "CheckName", //action
        0, // id
        "ExampleComponent", // name
        1, // details only
        0, // async
        0, // cache
        0 // instruction
    );
	oRequest.requestData.push(oD);
	Hemi.data.io.service.openRequest(Hemi.data.io.service.getSubject(), oRequest);
	var oResponse = Hemi.data.io.service.getResponseByName(oRequest.responseId);
	this.Assert(oResponse.status == true, "Response status was not true");
}
function TestQAUserSubject() {
    CheckLogin();
}
function TestGetDirectoryList() {
    CheckLogin();
    Hemi.data.io.service.getList(Hemi.data.io.service.getBusType().ANY, "Explorer","Directory", "DWAC", "List", true, HandleTestGetDirectoryList);
    return 0;
}
function HandleTestGetDirectoryList(oService, oSubject, oRequest, oResponse) {
    var aGroups = oResponse.responseGroups;
    Module.log("Received test data: " + aGroups.length);
    Module.Assert(aGroups.length > 0, "There should be some groups");
    for (var i = 0; i < aGroups.length; i++) {
        Module.log(aGroups[i].name);
    }
    EndTestGetDirectoryList(aGroups.length > 0);
}