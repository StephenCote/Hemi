this.dependencies.push("hemi.app","hemi.app.comp","hemi.data.form","hemi.data.validator");
function TestInlineSpace(oTest){
	var local_assert = this.Assert;
	Hemi.app.createApplicationSpace(null, null, null, (function(oService, oSpace){
		var sId = oSpace.space_id;

		oService.clearAppSpace(oSpace);
		var oTestSpace = oService.getSpace(sId);
		
		local_assert(!oTestSpace, "Test Space was not cleaned up");
		EndTestInlineSpace(true);
	}));
	return false;
}