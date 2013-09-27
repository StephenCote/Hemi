Hemi.include("hemi.monitor");
function TestMonitorBase(){
	var CMonitor = function(){
		Hemi.util.logger.addLogger(this, "Monitor", "Monitor Class", "201");
		Hemi.prepareObject("Monitor","1.0",1,this);
		Hemi.monitor.service.addMonitor(this);
	}
	CMonitor.prototype.initializeMonitor = function(){
		this.logDebug("Initialize");
		return true;
	}
	CMonitor.prototype.handle_window_load = function(){
		this.logDebug("Window load");
		return true;
	}
	CMonitor.prototype.handle_mouse_click = function(){
		this.logDebug("Click");
		return true;
	}


	var oMonitor = new CMonitor();
	Hemi.monitor.service.removeMonitor(oMonitor);
	/*
	this.log("Destroying Monitor Service!!");
	Hemi.monitor.service.destroy();
	*/
}