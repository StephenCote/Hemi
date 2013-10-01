/// Catch-all continuation operation:
/// 1) check base rules
/// 2) continue flow as needed - eg: post-login to special, or post-login to main
///
Hemi.util.logger.addLogger(this, "Operation", "Operation Module", "622");
this.DoOperation = function(){
	/// TODO: The template contents should be provided by teh template service, not
	/// hard coded into the operation
	///
	this.log("Continuing with the test operation");

	window.uwm.createContent("oMain",g_application_path + "Forms/Main.xml");
}

this.SetRule = function(sRule){
	this.ruleName = sRule;
}
