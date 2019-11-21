package org.cote.pkglib.factories;

import java.io.UnsupportedEncodingException;
import java.util.Arrays;
import java.util.List;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.cote.accountmanager.util.FileUtil;
import org.cote.accountmanager.util.StreamUtil;
import org.cote.accountmanager.util.ZipUtil;
import org.cote.pkglib.objects.DeployEnumType;
import org.cote.pkglib.objects.DeployedResourceType;
import org.cote.pkglib.objects.DeploymentType;
import org.cote.pkglib.objects.EncodedComponentType;
import org.cote.pkglib.objects.EncodedType;
import org.cote.pkglib.objects.PackageType;
import org.cote.pkglib.objects.PatternSetType;
import org.cote.pkglib.objects.ResourceType;
import org.cote.pkglib.util.PatternUtil;

public class EncoderFactory {
	public static final Logger logger = LogManager.getLogger(EncoderFactory.class);
	public static boolean emitEncodedComponent(EncodedType enc, String componentName, String path){
		boolean out_bool = false;
		byte[] data = getEncodedComponentValue(enc, componentName);
		if(data == null || data.length == 0){
			logger.error("Failed to decode component " + componentName);
			return out_bool;
		}
		out_bool = FileUtil.emitFile(path, data);
		return out_bool;
	}
	public static byte[] getEncodedComponentValue(EncodedType enc, String name){
		byte[] value = null;
		for(int i = 0; i < enc.getComponents().size();i++){
			if(enc.getComponents().get(i).getName().equals(name)){
				value = ZipUtil.gunzipBytes(enc.getComponents().get(i).getData());
				break;
			}
		}
		return value;
	}
	public static EncodedType encodePackage(PackageType pkg)
	{
		EncodedType enc = new EncodedType();

		List<DeploymentType> deployments = pkg.getDeployments();
		ResourceType resource = null;
		pkg.setBuildVersion(pkg.getBuildVersion()+1);
		pkg.setChanged(true);

		enc.setName(pkg.getName());
		
		enc.setVersion(pkg.getMajorVersion() + "." + pkg.getMinorVersion() + "." + pkg.getBuildVersion());

		for (int i = 0; i < deployments.size(); i++)
		{
			List<DeployedResourceType> resources = deployments.get(i).getDeployedResources();
			for (int r = 0; r < resources.size(); r++)
			{
				DeployedResourceType dep_rec = resources.get(r);
				resource = null;
				if (dep_rec.getDeployType() == DeployEnumType.RESOURCE)
				{
					resource = PackageFactory.getResourceByName(pkg,dep_rec.getName());
					EncodedComponentType encc = new EncodedComponentType();
					encc.setName(dep_rec.getName());
					encc.setData(ZipUtil.gzipBytes(StreamUtil.fileToBytes(resource.getSourceFile())));
					enc.getComponents().add(encc);
				}
				else if (dep_rec.getDeployType() == DeployEnumType.PATTERNSET)
				{
					PatternSetType pset = PackageFactory.getPatternSetByName(pkg, dep_rec.getName());
					for (int p = 0; p < pset.getResources().size(); p++)
					{
						resource = pset.getResources().get(p);
						String rec_data = PatternUtil.applyPatternsToResource(pkg, pset, resource);
						EncodedComponentType encc = new EncodedComponentType();
						encc.setName(resource.getName());
						try {
							encc.setData(ZipUtil.gzipBytes(rec_data.getBytes("UTF-8")));
						} catch (UnsupportedEncodingException e) {
							// TODO Auto-generated catch block
							e.printStackTrace();
						}
						enc.getComponents().add(encc);
					}
				}
			}
		}

		return enc;
	}
}
