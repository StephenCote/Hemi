this.dependencies.push("hemi.app");
function TestBlankApplicationComponent(){
	var p = Hemi.app.createApplicationComponent();
	p.then((c)=>{
		this.Assert(c, "Blank component was not created");
		this.Assert((c.getReadyState()==4), "Component is not ready");
		c.destroy();
		EndTestBlankApplicationComponent(true);
	});
	return false;
}

function TestDynamicApplicationComponent(){
	var p = Hemi.app.createApplicationComponent();
	p.then((c)=>{
		this.Assert(c, "Blank component was not created");
	
		c.importComponentDefinition("component_init : function(){Hemi.registry.service.getObject('" + this.getObjectId() + "').InternalCallback(this.getObjectId());}");
		this.Assert((this.CallBackId == c.getObjectId()),"Callback Id was not the same as the local id");
		c.destroy();
		EndTestDynamicApplicationComponent(true);
	});
	return false;
}

function TestExternalApplicationComponent(){
	var p = Hemi.app.createApplicationComponent("test");
	p.then((c)=>{
		this.Assert(c, "Component was not created");
		c.destroy();
		EndTestExternalApplicationComponent(true);
	});
	return false;
}

function TestExternalApplicationComponentTemplates(){
	var oDiv = document.createElement("div");
	oDiv.className = "template";
	document.body.appendChild(oDiv);
	var p = Hemi.app.createApplicationComponent(0, oDiv, Hemi.app.space.service.getPrimarySpace());
	p.then((c)=>{
		c.loadTemplate("Templates/TestTemplate.xml").then((lc)=>{
			// In order to properly conduct tests for Space, remote components, and templates
			// it's necessary to use an asynchronous test framework - which isn't done yet
			// 
			var oSpace = lc.getTemplateSpace();
			lc.destroy();
			oDiv.parentNode.removeChild(oDiv);
			EndTestExternalApplicationComponentTemplates(true);
		});
	});
	return false;
}

this.InternalCallback = function(sId){
	this.CallBackId = sId;
};