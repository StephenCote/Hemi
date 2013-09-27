Hemi.include("hemi.app");
Hemi.include("hemi.app.comp");
Hemi.include("hemi.data.form");
Hemi.include("hemi.data.validator");

function TestInlineSpace(oTest){
	var local_assert = this.Assert;
	var oSpace = Hemi.app.createApplicationSpace(null, null, null, (function(oService, oSpace){
		var sId = oSpace.space_id;

		oService.clearAppSpace(oSpace);
		var oTestSpace = oService.getSpace(sId);
		
		local_assert(!oTestSpace, "Test Space was not cleaned up");
		
	}));
}