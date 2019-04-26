
/*
	DWAC
	Source: Hemi.app.dwac
	Copyright 2009. All Rights Reserved.
	Version: %FILE_VERSION%
	Author: Stephen W. Cote
	Email: sw.cote@gmail.com
	Project: http://www.whitefrost.com/projects/engine/
	License: http://www.whitefrost.com/projects/engine/code/engine.license.txt
	
*/
/// <source>
/// <name>Hemi.app.dwac</name>
/// <project>
/// 	<name>Hemi JavaScript Framework</name>
/// 	<url-title>Hemi JavaScript Framework</url-title>
/// 	<url>/Hemi/</url>
/// </project>
///
/// <package>
///		<path>Hemi.app.dwac</path>
///		<library>Hemi</library>
///		<description>Distributed Application Components extends the Application Component to support a single file deployment.  Application Components, Templates, Fragments, Modules, and Tasks may be combined into a single XML file for ease of sharing and reuse.</description>
/// <static-class>
///		<name>DistributedComponent</name>
///		<description>Static initializer for DWAC objects.  DWAC objects are special constructs of Application Components.</description>
///		<version>%FILE_VERSION%</version>

///		<method>
///			<name>newInstance</name>
///			<param name = "o" type = "variant">XHTML Node or XHTMLComponent Instance</param>
///			<param name = "u" type = "String">URI to DWAC file.</param>
///			<param name = "t" type = "String">DWAC Template Id</param>
///			<param name = "k" type = "String" optional = "1">Task ID.</param>
///			<param name = "i" type = "String" optional = "1">Component ID</param>
///			<return-value name = "d" type = "DWACInstance">Instance of an ApplicationComponent instrumented with the DWAC loader.</return-value>
///		</method>
/// </static-class>
/// <class>
///		<name>DistributedComponentInstance</name>
///		<version>%FILE_VERSION%</version>
///		<description>An Application Component instance decorated with the DWAC loading modifiers.</description>
/// <example>
///		<description>Demonstrate how a DWAC can be used.</description>
///		<name>Create a new DWAC Instance #1</name>
///		<code><![CDATA[<div id = "oExampleDiv"></div>]]></code>
///		<code><![CDATA[<script type = "text/javascript">]]></code>
///		<code>window.onload = function(){</code>
///		<code>   var oDWAC = Hemi.app.dwac.newInstance(;</code>
///		<code>      document.getElementById("oExampleDiv")</code>
///		<code>      ,"/Path/To/Dwac.xml"</code>
///		<code>      ,"Example Template 1"</code>
///		<code>   );</code>
///		<code>}</code>
///		<code><![CDATA[</script>]]></code>
/// </example>
(function(){

	HemiEngine.namespace("app.dwac", HemiEngine, {
		dependencies : ["hemi.task","hemi.app.comp","hemi.app.space"],
		atkey : "is-dwac",
		aturi : "DWacControlUri",
		attk : "DWacControlTask",
		attid : "DWacTemplateId",
		
		newInstance : function(o, u, t, k,i){
			if(!o) return;
			/* Late bind the component */
			var b = 0;
			if(!DATATYPES.TF(o.getObjectType) || o.getObjectType() != "xhtml_component"){
				o = HemiEngine.object.xhtml.newInstance(o,1);
				b = 1;
			}
			var r = HemiEngine.app.comp.newInstance(0,0,o.getObjectId(),0,0,0);
			r.properties.DWacControlUri = u;
			r.properties.DWacControlTask = k;
			r.properties.DWacTemplateId = t;
			
			r.component_init = function(){
				this.setTemplateIsSpace(1);
				this.objects.task_service = new HemiEngine.task.serviceImpl();
				this.scopeHandler("processor",0,0,1);
			};
			r._handle_processor = function(Service, ParentTask, TaskName, Value){
				return this._handle_xhtml_token(2,Value);
			};
			r.component_post_init = function(){
				///this.setAttribute("avoid","1");
				///alert(this.getTemplateSpace().space_id + ":" + Hemi.app.space.service.getPrimarySpace().space_id);
				var sU = this.properties.DWacControlUri;
				var sT = this.properties.DWacControlTask;
				var sTId = this.properties.DWacTemplateId;
				if(typeof sTId != "string" || sTId.length == 0) sTId = 0;
				if(typeof sU == "string" && sU.length > 0){

					if(typeof sT == "string" && sT.length > 0){
						this.properties.dwac_template_path = sU;
						this.objects.dwac_task = this.objects.task_service.executeTaskLoader(
							"dwac_loader",
							"xml",
							sU,
							"import-task",
							sT,
							this._prehandle_processor
						);
					}
					else{
						this.LoadDwacTemplate(sU, sTId);
					}
				}
				
			};
			r.handle_dwac_task = function(s, v){
				var sU = this.getContainer().getAttribute("DWacControlUri");
				var sTId = this.getContainer().getAttribute("DWacTemplateId");
				if(typeof sTId != "string" || sTId.length == 0) sTId = 0;
				if(typeof sU == "string" && sU.length > 0) this.LoadDwacTemplate(sU,sTId);
			};
			r.LoadDwacTemplate = function(sPath, sTemplateId){
				this.properties.dwac_template_path = sPath;
				this.loadTemplate(sPath, sTemplateId);			
			};
			r.GetDwacTemplatePath = function(){
				return this.properties.dwac_template_path;
			};
			r.local_handle_xhtml_token = function(iType, sTokenValue){
				sTokenValue = sTokenValue.replace(/\$\{dwac\.path\}/g,this.GetDwacTemplatePath());
				return sTokenValue;
			};
			
			if(!i) i = HemiEngine.guid();
			r.importComponentDefinition("",i,0);
			if(b) r.component_post_init();

			return r;
			
		}
	});
}());
/// </class>
/// </package>
/// </source>