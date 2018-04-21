
function TestBindObject(oTest){
	var oD = document.createElement("div");
	oD.setAttribute("id",this.getObjectId() + "-ExampleDiv");
	document.body.appendChild(oD);
	
	Hemi.xml.setInnerXHTML(oD,"Test data");
	var oX = Hemi.object.xhtml.newInstance(oD,1);
	this.Assert((oX != null),"XHTML Object is null");
	oX.destroy();
	var oCheck = document.getElementById(this.getObjectId() + "-ExampleDiv");
	this.Assert((oCheck != null), "XHTML Object should not cleanup XHTML artifacts it didn't create");
	oD.parentNode.removeChild(oD);
}



