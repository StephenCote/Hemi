/// Example
/// File: Hemi/Tests/mytest.js
/// Script:
/// Hemi.include("hemi.app.module");
/// var oTest = Hemi.app.module.service.NewTest("mytest");
/// oTest.RunTests();

/// Injected Properties
///
/// var Container = null;
/// var Component = null;

/// Injected Test Members
///
/// this.Assert = function(bCondition, sErrorMessage)
/// this.RunTests = function() -- runs all discovered tests
/// this.logDebug(sMessage)
/// this.logInfo(sMessage)
/// this.log(sMessage)
/// this.logWarning(sMessage)
/// this.logError(sMessage)
/// this.logFatal(sMessage)
/// this.TestMembers = [] -- discovered test members
/// this._Execute_[TestName] = function() -- Executes a test
/// this._StartTest(sName) -- internal, starts a specified test, returns a new Test object
/// this._StopTest(oTest) -- internal, completes a test object
/// this._AddTestMessage(oTest, sMessage) -- internal, sets the test message from a failed Assert
/// 

/// function Test[Name]() -- any function in the format "function Test..." is included in the available tests
/// Test functions are invoked in the context of the TestModule, and include the Test object as a parameter
/// Example:
function TestMyExample(oTest){

}

/// Interface members
///
this.Initialize = function(){
	/// To automatically run tests when Test module is loaded:
	/// this.RunTests();
}

this.Unload = function(){

}



