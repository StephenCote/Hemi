function TestNodeContent(oTest) {
	this.Assert(Module.Container, "Container is null");
	this.Assert(Module.Container.innerHTML.match(/Example Content/), "Content not found");
}