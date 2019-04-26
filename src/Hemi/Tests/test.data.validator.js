this.dependencies.push("hemi.data.form", "hemi.data.validator");
function TestVirtualFormValidation(){
		var oSpace = Hemi.app.space.service.getPrimarySpace();
		this.Assert(oSpace,"A primary space is required for this test");
		var oInput = document.createElement("input");
		oInput.setAttribute("type","text");
		oInput.setAttribute("value","Test valid value");
		oSpace.space_element.appendChild(oInput);
		var oComp = Hemi.app.createComponent(oInput, oSpace, "Test Valid Text");
		var oForm = GetVirtualForm(oSpace.space_id);
		this.Assert(oForm, "Virtualized form was not found for Space '" + oSpace.space_id + "'");
		
		var oElement = oForm.getElementByName("Test Valid Text");
		this.Assert(oElement, "Virtualized element was not found for Form '" + oForm.i + "'");
		
		var sPattern = "not-empty";
		var bValid = Hemi.data.validator.service.validateField(oElement.getElement(), sPattern);
		
		this.Assert(bValid, "Element value from control was not valid");
		
		oInput.value = "";
		bValid = Hemi.data.validator.service.validateField(oElement.getElement(), sPattern);
		this.Assert(!bValid, "Element value from control was valid, and it should have been invalid");
		
		/// Delete the control
		///
		/// Clean the element from the virtual form
		/// This is typically handled by dumping the entire form
		/// Otherwise, the value is preserved though the backing objects have been removed
		///
		oForm.removeElement(oForm.getElementByName("Test Valid Text"));
		oInput.parentNode.removeChild(oInput);
		oComp.destroy();
		oElement = oForm.getElementByName("Test Valid Text");

		this.Assert(!oElement || oElement.getElement(), "Element pointer was not released");
		
}

function GetVirtualForm(sName){
	return Hemi.data.form.service.getFormByName(sName);
}