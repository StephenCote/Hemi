/// Anonymouse reference
function AnonymousExample(){
	//Use global 'Module' variable
	// If the module is bound to a container, the container can be accessed as:
	if(Module.Container){
		// Module.Container
	}
}

/// Member reference
this.MemberExample = function(){
	//Use 'this' to refer to the Module.
	// If the module is bound to a container, the container can be accessed as:
	if(this.Container){
		// this.Container
	}
};

/// Module Initializer
this.Initialize = function(){
	
};

/// Module Cleanup
this.Unload = function(){
	
};

/// Synchronous Test Example
function TestSynchronous(oTestResult){
	this.Assert(true,"The test passed");
}

/// Aynchronous Test Example
/// EndTestAsynchronous is automatically created when this module is loaded as a test
function TestAsynchronous(oTestResult){
	window.setTimeout(CompleteTest,1000);
	// Return false to indicate an async test
	return false;
}
function CompleteTest(){
	EndTestAsynchronous(true);
}
/// Enter anonymous or member methods