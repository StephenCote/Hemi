/// test.asyncxml.js
///
/// Scoped variables added by Hemi.app.module.test
/// var Module = null;
///
/// Properties added by Hemi.app.module.test
///
/// this.Container = null;
/// this.Component = null;


/// Module Initializer
this.Initialize = function () {
	this.log("Initialized");
	if (this.Container) {
		Hemi.xml.setInnerXHTML(this.Container, "test.asyncxml.js");
	}
};

/// Module Cleanup
this.Unload = function () {
	this.log("Unloaded");
};

/// Enter anonymous or member methods

/// Test whether or not the offline example form 'setbeanform' exists
///
function TestSetBeanFormTemplateExists(oTest) {
	Hemi.xml.getXml("dwac:/DWAC/Anonymous/Templates/setbeanform", HandleLoadBeanForm, 1);
	/// Return false to indicate this is a synchronous test and it is not finished.
	return false;
}

/// Asynchronous XML request handler
///
function HandleLoadBeanForm(sMessage, vData) {
    /// Since 'Continue*' doesn't accept variant parameters, stateful data must be stored somewhere
	/// This could be a property on the module, or, in this case, passing an object reference
	/// To the named test
	///
	Module.getTestByName("TestSetBeanFormTemplateExists").data = vData;
	/// Continue* will re-establish object context and continue test handling
	///
	ContinueTestSetBeanFormTemplateExists();
}

/// Invoked by 'Continue*'
function HandleContinueTestAsyncAppCompAltDataProtocol(oTest) {
    /// Test.data is set in the async handler
	this.Assert(oTest.data && oTest.data.xdom && oTest.data.xdom.documentElement, "XML document not found");
	this.Assert(oTest.data.xdom.documentElement.nodeName == "Template", "Expected XML not found");
	/// Return true to indicate the test successfully completed
	return true;
}

/// Basic test for whether or not this is cnn.com
/// Used for demo filler
///
function TestIsNotCnn(oTest) {
	this.Assert(!document.URL.match(/cnn\.com/), "This is not CNN");
}