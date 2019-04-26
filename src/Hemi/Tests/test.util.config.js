this.dependencies.push("hemi.util.config");

function NewXML(){
 return Hemi.xml.newXmlDocument("Config");
}
function NewXMLConfig(oXml) {
   
    var oC =  HemiEngine.util.config.newInstance();
    oC.setElementParentName("c");
    oC.setElementName("p");
    oC.setAttrNameName("n");
    oC.setAttrValueName("v");
    oC.parseConfig(oXml);
    return oC;
}

function TestConfigParse(oTest) {
    var oXml = NewXML();
    var oCfg = NewXMLConfig(oXml);
    this.Assert(oCfg.getReadyState() == 4 && oCfg.getProperties().l, "Config not loaded");
}

function TestConfigParamWrite(oTest) {
    ///var oXml = Hemi.xml.newXmlDocument("Config");
    var oXml = NewXML();
    var oCfg = NewXMLConfig(oXml);
    var bWrite = oCfg.writeParam(oXml, "testname", "testvalue");
    this.Assert(bWrite, "Config param not written, response='" + bWrite + "'");
}

function TestConfigParamReadWrite(oTest) {
    ///var oXml = Hemi.xml.newXmlDocument("Config");
    var oXml = NewXML();
    var oCfg = NewXMLConfig(oXml);
    oCfg.writeParam(oXml, "testname", "testvalue");
    var sVal = oCfg.getParam("testname");
    this.Assert((sVal && sVal == "testvalue"), "Values do not match");
}