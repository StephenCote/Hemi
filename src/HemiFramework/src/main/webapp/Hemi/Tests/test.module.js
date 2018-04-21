function TestDebugModule() {
    var oModule = Hemi.app.module.service.NewModule("module.debug");
    Hemi.app.module.service.UnloadModule("module.debug");
}