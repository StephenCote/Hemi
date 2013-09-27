Hemi.message.service.setReportThreshold("NORMAL");
Hemi.include("hemi.app");
Hemi.include("hemi.app.module");
Hemi.include("hemi.app.comp");
Hemi.include("hemi.app.space");
Hemi.include("hemi.css");

var aHemiBVTs = [
	"test.object.xhtml",
	"test.app.space",
	"test.xml",
	"test.app.comp",
	"test.monitor",
	"test.graphics.canvas",
	"test.storage",
	"test.data.form",
	"test.data.validator"
];

Hemi.message.service.subscribe("onspaceconfigload", function (s, v){
	// Only listen for the primary space
	//
	if(!v.is_primary) return;
	/*
	var oD = document.createElement("div");
	document.body.appendChild(oD);

    var oComp = Hemi.app.createApplicationComponent("window",oD,v);
    //alert(oComp.component_post_init);
    oComp.setTemplateIsSpace(1);
	oComp.post_init();
	oComp.setCanResize(0);
	oComp.resizeTo(600,580);
	oComp.loadTemplate("Templates/FrameworkProfiler.xml");
	// var oTest = Hemi.registry.service.getObject("manager");
	*/
	//RunBVTs();
});

function RunBVTs(){
	var PkConsole = Hemi.transaction.service.getPacketByName("console");
	if(PkConsole){
		PkConsole.data.type = "clear";
		Hemi.transaction.service.serveTransaction(PkConsole);
	}
	for(var i = 0; i < aHemiBVTs.length; i++){
		var vTest = Hemi.app.module.service.NewTest(aHemiBVTs[i]);
		vTest.RunTests();
	}
}