function TestDebugModule() {
    Hemi.app.module.service.NewModule("module.debug").then((o)=>{
    	Hemi.app.module.service.UnloadModule("module.debug");
    	this.Assert(o && o!= null, "Module was null");
    	EndTestDebugModule(true);
    });
    return false;
}