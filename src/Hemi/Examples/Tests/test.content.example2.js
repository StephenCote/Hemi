function TestStyle(oTest) {

}
function TestAsyncContent(oTest) {
	Hemi.xml.getXml("Examples/TestXhtml.xml", HandleTestAsyncContent);
	return 0;
}
function HandleTestAsyncContent (sMessage, vXml) {
	Module.Assert(vXml.xdom != null, "XML Document is null");
	Hemi.xml.setInnerXHTML(Module.Container, vXml.xdom.documentElement);
	Module.Assert(Module.Container.innerHTML.match(/content to import/i), "Imported content not found");
	EndTestAsyncContent(true);
}