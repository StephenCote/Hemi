package org.cote.pkglib.factories;

import java.io.File;
import java.util.List;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.cote.accountmanager.util.CalendarUtil;
import org.cote.accountmanager.util.StreamUtil;
import org.cote.pkglib.objects.DeployEnumType;
import org.cote.pkglib.objects.DeployedResourceType;
import org.cote.pkglib.objects.DeploymentType;
import org.cote.pkglib.objects.PackageType;
import org.cote.pkglib.objects.PatternSetType;
import org.cote.pkglib.objects.PatternType;
import org.cote.pkglib.objects.ResourceType;
import org.cote.pkglib.util.ConfigReader;
import org.w3c.dom.Element;
import org.w3c.dom.NodeList;

public class PackageFactory {
	public static final Logger logger = LogManager.getLogger(PackageFactory.class.getName());
	
	public static PackageType importPackage(String packageFile){
		PackageType pt = null;
		ConfigReader cr = new ConfigReader();
		if(cr.init(packageFile)){
			pt = importPackage(cr);
			pt.setConfigPath(packageFile);
		}
		else{
			logger.error("Failed to import package configuration from " + packageFile);
		}
		return pt;
	}
	public static PackageType importPackage(ConfigReader config){
		PackageType pkg = new PackageType();
		
		pkg.setName(config.getParam("meta","name"));
		pkg.setId(config.getParam("meta","id"));
		pkg.setCreatedDate(CalendarUtil.getXmlGregorianCalendar(CalendarUtil.importDateFromLegacyString(config.getParam("meta","created-date"))));
		pkg.setModifiedDate(CalendarUtil.getXmlGregorianCalendar(CalendarUtil.importDateFromLegacyString(config.getParam("meta","modified-date"))));
		pkg.setIsScriptPackage(config.getBooleanParam("meta","script-package"));
		
		pkg.setMajorVersion(config.getIntegerParam("version","major"));
		pkg.setMinorVersion(config.getIntegerParam("version","minor"));
		pkg.setBuildVersion(config.getIntegerParam("version","build"));
		
		
		NodeList dep_nodes = config.getNodeParams("deployments");
		if(dep_nodes != null){
			Element dep_el = null;
			for(int i = 0; i < dep_nodes.getLength();i++){
				dep_el = (Element)dep_nodes.item(i);
				DeploymentType new_deployment = new DeploymentType();
				new_deployment.setName(dep_el.getAttribute("name"));
				pkg.getDeployments().add(new_deployment);

				NodeList drec_nodes = dep_el.getElementsByTagName("resource");
				if(drec_nodes != null){
					Element drec_el = null;
					for(int d = 0; d < drec_nodes.getLength(); d++){
						drec_el = (Element)drec_nodes.item(d);
						DeployedResourceType drec = new DeployedResourceType();
						drec.setDeployType(getDeploymentType(drec_el.getAttribute("type")));
						drec.setName(drec_el.getAttribute("name"));
						new_deployment.getDeployedResources().add(drec);
					}
				}

			}
		}
		
		
		NodeList rec_nodes = config.getNodeParams("resources");
		if(rec_nodes != null){
			Element rec_el = null;
			for(int i = 0; i < rec_nodes.getLength();i++){
				rec_el = (Element)rec_nodes.item(i);
				ResourceType new_resource = new ResourceType();
				new_resource.setName(rec_el.getAttribute("name"));
				new_resource.setMimeType(rec_el.getAttribute("mime-type"));
				new_resource.setSourceFile(config.getParam("resources",new_resource.getName()));
				pkg.getResources().add(new_resource);
			}
		}

		
		NodeList set_nodes = config.getNodeParams("patternsets");
		if(set_nodes != null){
			Element set_el = null;
			for(int i = 0; i < set_nodes.getLength();i++){
				set_el = (Element)set_nodes.item(i);
				PatternSetType new_patternset = new PatternSetType();
				new_patternset.setName(set_el.getAttribute("name"));
				pkg.getPatternsets().add(new_patternset);
				rec_nodes = set_el.getElementsByTagName("resource");
				if(rec_nodes != null){
					for(int r = 0; r < rec_nodes.getLength();r++){
						Element rec_el = (Element)rec_nodes.item(r);
						ResourceType rec = getResourceByName(pkg,rec_el.getAttribute("name"));
						if(rec != null) new_patternset.getResources().add(rec);
					}
				}
				NodeList pat_nodes = set_el.getElementsByTagName("pattern");
				if(pat_nodes != null){
					for(int p = 0; p < pat_nodes.getLength();p++){
						Element pat_el = (Element)pat_nodes.item(p);
						PatternType pat = new PatternType();
						pat.setMatch(pat_el.getAttribute("match"));
						pat.setReplace(pat_el.getAttribute("replace"));
						new_patternset.getPatterns().add(pat);
					}
				}
			}
		}

		
		
		return pkg;
	}
	public static byte[] loadResourceFile(PackageType pkg, String resourceName){
		return loadResourceFile(pkg,getResourceByName(pkg,resourceName));
	}
	public static byte[] loadResourceFile(PackageType pkg, ResourceType rec){
		byte[] out_bytes = new byte[0];
		File f = getResourceFile(pkg,rec);
		if(f == null) return out_bytes;
		return StreamUtil.fileHandleToBytes(f);
	}

	public static File getResourceFile(PackageType pkg, String resourceName){
		return getResourceFile(pkg,getResourceByName(pkg,resourceName));
	}
	public static File getResourceFile(PackageType pkg, ResourceType rec){
		File out_file = null;
		if(rec == null || pkg == null){
			logger.error("Package or resource is null");
			return out_file;
		}
		out_file = new File((new File(pkg.getConfigPath())).getParent(),rec.getSourceFile());
		return out_file;
	}
	protected static PatternSetType getPatternSetByName(PackageType pkg, String name){
		PatternSetType outType = null;
		for(int i = 0; i < pkg.getPatternsets().size();i++){
			if(pkg.getPatternsets().get(i).getName().equals(name)){
				outType = pkg.getPatternsets().get(i);
				break;
			}
		}
		return outType;
	}
	
	protected static ResourceType getResourceByName(PackageType pkg, String name){
		ResourceType outType = null;
		for(int i = 0; i < pkg.getResources().size();i++){
			if(pkg.getResources().get(i).getName().equals(name)){
				outType = pkg.getResources().get(i);
				break;
			}
		}
		return outType;
	}
	
	protected static DeployEnumType getDeploymentType(String val){
		if(val == null || val.length() == 0 || val.equals("0")) return DeployEnumType.UNKNOWN;
		if(val.equals("1")) return DeployEnumType.RESOURCE;
		if(val.equals("2")) return DeployEnumType.PATTERNSET;
		return DeployEnumType.fromValue(val);
	}
	
}
