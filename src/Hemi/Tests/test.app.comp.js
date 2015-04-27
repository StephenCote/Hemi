Hemi.include("hemi.app");

function TestBlankApplicationComponent(){
	var oComp = Hemi.app.createApplicationComponent();
	this.Assert(oComp, "Blank component was not created");
	this.Assert((oComp.getReadyState()==4), "Component is not ready");
	oComp.destroy();
}

function TestDynamicApplicationComponent(){
	var oComp = Hemi.app.createApplicationComponent();
	this.Assert(oComp, "Blank component was not created");
	oComp.importComponentDefinition("component_init : function(){Hemi.registry.service.getObject('" + this.getObjectId() + "').InternalCallback(this.getObjectId());}");
	this.Assert((this.CallBackId == oComp.getObjectId()),"Callback Id was not the same as the local id");
	oComp.destroy();
}

function TestExternalApplicationComponent(){
	var oComp = Hemi.app.createApplicationComponent("test");
	this.Assert(oComp, "Component was not created");
	oComp.destroy();
}

function TestExternalApplicationComponentTemplates(){
	var oDiv = document.createElement("div");
	oDiv.className = "template";
	document.body.appendChild(oDiv);
	var oComp = Hemi.app.createApplicationComponent(0, oDiv, Hemi.app.space.service.getPrimarySpace());
	oComp.loadTemplate("Templates/TestTemplate.xml");
	
	// In order to properly conduct tests for Space, remote components, and templates
	// it's necessary to use an asynchronous test framework - which isn't done yet
	// 
	var oSpace = oComp.getTemplateSpace();
	oComp.destroy();
	oDiv.parentNode.removeChild(oDiv);
}

this.InternalCallback = function(sId){
	this.CallBackId = sId;
};