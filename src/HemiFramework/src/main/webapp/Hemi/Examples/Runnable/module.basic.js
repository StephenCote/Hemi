/// module.basic.js
///
/// Scoped variables added by Hemi.app.module.test
/// var Module = null;
///
/// Properties added by Hemi.app.module.test
///
/// this.Container = null;
/// this.Component = null;


/// Module Initializer
Hemi.include("Hemi.util.logger");
this.Initialize = function () {
    Hemi.util.logger.addLogger(this, "Basic Module", "Basic Module Example", "101");
    this.log("Initialized");
    if (this.Container) {
        Hemi.xml.setInnerXHTML(this.Container, "module.basic.js");
    }
};

/// Module Cleanup
this.Unload = function () {
    this.log("Unloaded");
};