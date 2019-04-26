this.dependencies.push("hemi.data.form");
function TestVirtualForm(){
	var oSpace = Hemi.app.space.service.getPrimarySpace();
	this.Assert(oSpace,"A primary space is required for this test");
	var oInput = document.createElement("input");
	oInput.setAttribute("type","text");
	oInput.setAttribute("value","Test value");
	oSpace.space_element.appendChild(oInput);
	var oComp = Hemi.app.createComponent(oInput, oSpace, "Test Text");
	
	oInput.parentNode.removeChild(oInput);
	oComp.destroy();
	
	var oForm = Hemi.data.form.service.getFormByName(oSpace.space_id);
	this.Assert(oForm, "Virtualized form was not found for Space '" + oSpace.space_id + "'");
	
	oElement = oForm.getElementByName("Test Text").getElement();
	
	this.Assert(!oElement, "Element pointer was not released");
	
	var sTestVal = Hemi.data.form.service.getValue("Test Text",oSpace.space_id);
	this.Assert((sTestVal == oInput.value), "Virtualized value does not match input value");
}
