this.dependencies.push("hemi.framework.io.provider");

function TestProviderLoaded() {
    /// Check loaded
    ///
    this.Assert(Hemi.isImported("hemi.framework.io.provider"), "Framework IO Provider not loaded");

    /// Check registered
    ///
    this.Assert(Hemi.data.io.service.isRegistered(Hemi.framework.io.provider.service), "Provider service was not registered");
}

function TestGetFrameworkTestFiles() {
    var oReq = Hemi.data.io.service.getList(Hemi.data.io.service.getBusType().STATIC, "HemiFramework", "Directory", "Tests", "List");
    this.log(oReq.requestId);
}