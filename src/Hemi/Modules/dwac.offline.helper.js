Hemi.include("hemi.data.io");
Hemi.include("hemi.data.io.proxy");
Hemi.include("hemi.framework.io.offline.provider");

this.ListDirectory = function (sName) {
	return queryList("Directory", sName);
};
this.ListData = function(sName){
	return queryList("Data", sName);
};
function queryList(sCtx, sName){
	var oRequest = Hemi.data.io.service.newIORequest(
        Hemi.data.io.service.getBusType().OFFLINE,
        "DWAC",
		sCtx,
        sName,
		"List",
		0, // id
		0, // name
		1, // details only
		0, // async
		0, // cache
		0 // instruction
	);
	Hemi.data.io.service.openRequest(Hemi.data.io.service.getSubject(), oRequest, 0);
	return Hemi.data.io.service.getResponseByName(oRequest.responseId);
}

this.ReadData = function (sGroup, sName) {
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
};

this.DeleteData = function (sGroup, sName) {
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
};

this.AddData = function (sGroup, sName, sType, sValue) {

	var oInstruction = Hemi.data.io.service.newIOInstruction(0, 0, 0, 0, 0);
	var iBus = Hemi.data.io.service.getBusType().OFFLINE;
	var sCat = sGroup;
	var sReq = 0;
	var sAction = "Add";
	var sId = 0;
	var bDetailsOnly = 0;
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
	oData.mimeType = sType;
	oData.value = sValue;
	oData.size = sValue.length;
	oData.group = sGroup;
	oRequest.requestData.push(oData);
	Hemi.data.io.service.openRequest(
		Hemi.data.io.service.getSubject(),
		oRequest
	);
	var oResponse = Hemi.data.io.service.getResponseByName(oRequest.responseId);
	return (oResponse && oResponse.status);
};