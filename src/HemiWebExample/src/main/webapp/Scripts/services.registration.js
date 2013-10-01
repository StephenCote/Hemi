/*
 * Define who is providing the service layer
 */
if(!window.uwmServices) window.uwmServices = Hemi.json.rpc.service;

/*
 * Register the available services
 * NOTE: The 3rd and 4th parameters of the service registration may be used to define static service and object models so they are not queried everytime
 */
(function(){
	/// Jersey JSON+REST w/ Basic AM SMD Support
	///
	
	/*
	 * Register the Example Services
	 */
	
	uwmServices.addService(
			"ExampleService",
			"/HemiWebExample/rest/example/smd"
			, true
			, true
	);
	
	
	
}())