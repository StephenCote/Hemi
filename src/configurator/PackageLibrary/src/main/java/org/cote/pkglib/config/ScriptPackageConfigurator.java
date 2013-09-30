package org.cote.pkglib.config;


import java.io.File;
import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.apache.log4j.Logger;
import org.cote.accountmanager.util.CalendarUtil;
import org.cote.accountmanager.util.FileUtil;
import org.cote.accountmanager.util.JAXBUtil;
import org.cote.pkglib.factories.EncoderFactory;
import org.cote.pkglib.factories.PackageVersionFactory;
import org.cote.pkglib.objects.DocumentListType;
import org.cote.pkglib.objects.DocumentType;
import org.cote.pkglib.objects.EncodedType;
import org.cote.pkglib.objects.FeatureType;
import org.cote.pkglib.objects.PackageFileType;
import org.cote.pkglib.objects.PackageVersionType;
import org.cote.pkglib.objects.PatternType;
import org.cote.pkglib.objects.PropertyDataSetType;
import org.cote.pkglib.objects.PropertySetType;
import org.cote.pkglib.objects.PropertyStructureCollectionType;
import org.cote.pkglib.objects.PropertyStructureType;
import org.cote.pkglib.objects.PropertyType;
import org.cote.pkglib.objects.ScriptConfigType;
import org.cote.pkglib.objects.ScriptFileType;
import org.w3c.dom.Document;

public class ScriptPackageConfigurator {
	public static final Logger logger = Logger.getLogger(ScriptPackageConfigurator.class.getName());
	
	private EncodedType encodedFile = null;
	private ScriptConfigType scriptConfig = null;
	private boolean initialized = false;
	private String basePath = "./export/";
	private String contextPath = null;
	private Map<String,Pattern> patterns = null;
	private String application_name = "ScriptPackageConfigurator";
	private String application_version = "2.0 Beta";
	private String application_developer = "Stephen Core";
	private String deployPath = "";
	
	public ScriptPackageConfigurator(){
		patterns = new HashMap<String,Pattern>();
	}
	
	public void setConfig(ScriptConfigType config){
		scriptConfig = config;
	}
	public EncodedType getEncodedFile(){
		return encodedFile;
	}
	public void setEncodedFile(EncodedType enc){
		encodedFile = enc;
		contextPath = basePath + enc.getName() + "/";
	}
	public boolean initializeConfiguration(String configName){
		if(encodedFile == null) return false;
		String contents = null;
		try {
			contents = new String(EncoderFactory.getEncodedComponentValue(encodedFile, configName),"UTF-8");
		} catch (UnsupportedEncodingException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		if(contents == null){
			logger.error("Config does nat exist for " + configName);
			return false;
		}
		scriptConfig = JAXBUtil.importObject(ScriptConfigType.class, contents);
		setConfig(scriptConfig);
		return (scriptConfig != null);
		
	}
	public boolean initialize(){
		initialized = false;
		if(scriptConfig == null){
			logger.error("Configuration is not specified");
			return false;
		}
		if(scriptConfig.getDistribution() == null || scriptConfig.getDistribution().getStagePath() == null){
			logger.error("Configuration is not complete. Distribution parameters are missing");
			return false;
		}
		if(encodedFile == null){
			logger.error("Encoded file is not specified");
			return false;
		}
		File f = new File(contextPath + scriptConfig.getDistribution().getStagePath());
		if(f.exists() == false && f.mkdirs() == false){
			logger.error("Unable to access stage path: " + contextPath + scriptConfig.getDistribution().getStagePath());
			return false;
		}
		deployPath = contextPath + scriptConfig.getDistribution().getStagePath();
		initialized = true;
		return initialized;
	}
	private DocumentType getDocumentByName(DocumentListType list, String name){
		DocumentType dType = null;
		for(int i = 0; i < list.getDocuments().size();i++){
			if(list.getDocuments().get(i).getFileName().equals(name)){
				dType = list.getDocuments().get(i);
				break;
			}
		}
		return dType;
	}
	public boolean configure() throws Exception{
		if(!initialized) return false;

		boolean encountered_error = false;
	
		int dataset_id = scriptConfig.getDistribution().getDatasetId();
		String dlist = scriptConfig.getDistribution().getDocumentListFile();
		File fdList = new File(contextPath + dlist);

		DocumentListType document_list = null;

		if(fdList.exists() == false){
			document_list = new DocumentListType();
		}
		else{
			document_list = JAXBUtil.importObject(DocumentListType.class, FileUtil.getFileAsString(contextPath + dlist));
		}
	
	
		String output_path = contextPath + scriptConfig.getDistribution().getOutputFile();
		File output_file = new File(output_path);
		try{
			if(output_file.exists()) output_file.delete();
		}
		catch(Exception e){
			logger.error("Exception: " + e.getMessage());
			return false;
			
		}

		StringBuffer wrapper = new StringBuffer();
		StringBuffer data = new StringBuffer();


		/*
		 * 
		 * Script files are processed separately from template files
		 * because the script files are combined into a single source
		 * while the template files should be output separately.
		 * 
		 */

		List<PackageFileType> file_list = fileLinker();
		PackageVersionType av = new PackageVersionType();
		
        for (int i = 0; i < file_list.size(); i++)
        {
        	
			av.setMajorVersion(0);
			av.setMinorVersion(0);
			av.setBuildVersion(0);

			File info = new File(output_path);
			if(file_list.get(i).getName().equals(info.getName())){
				logger.info("Skip output file entry: " + file_list.get(i).getName());
				continue;
			}
		
			Date last_modified = new Date(info.lastModified());

			DocumentType file_node = getDocumentByName(document_list, file_list.get(i).getName());
			if(file_node == null){
                logger.info("Add new entry: " + file_list.get(i).getName());
				file_node = new DocumentType();
				file_node.setFileName(file_list.get(i).getName());
				file_node.setLastModified(CalendarUtil.getXmlGregorianCalendar(last_modified));
				document_list.getDocuments().add(file_node);
			}
		
		
			boolean file_changed = (last_modified.getTime() > file_node.getLastModified().toGregorianCalendar().getTimeInMillis())?true:false;

            file_list.get(i).setData(applyPatternsToPackageFileType(file_list.get(i).getData(), file_list.get(i).getName(), av, file_changed));
			file_list.get(i).setRawData(applyPatternsToPackageFileType(file_list.get(i).getRawData(), file_list.get(i).getName(), av, file_changed));

			if(file_changed) file_node.setLastModified(CalendarUtil.getXmlGregorianCalendar(last_modified));
			file_node.setVersion(PackageVersionFactory.getVersion(av));

			//logger.info("Script File " + file_list.get(i).getName() + " (" + last_modified + ")");
		
			if(file_list.get(i).getWrap()){
				wrapper.append("\r\n" + (new String(file_list.get(i).getData(),"UTF-8")));
			}
			else{
				data.append("\r\n" + (new String(file_list.get(i).getData(),"UTF-8")));
			}
		} // end for files loop

		/*
		 * Handle code wrapping / embedding
		 */
		String config_data = data.toString();
		String wrapper_data = wrapper.toString();
		String wrapper_token = "%WRAP_CODE%";
		if(wrapper_data.length() > 0){
		
			//Pattern expr = GetBufferPattern(wrapper_token);
			Matcher m = getBufferMatcher(wrapper_token,wrapper_data);
			if(m.find()){
			
				config_data = m.replaceAll(config_data);
				wrapper_data = null;
			}
		}
		/* clear out data buffer */
	
		data = null;


		config_data = applyPropertyConfiguration(config_data);
		config_data = applyPropertySetConfiguration(config_data);
		config_data = applyPropertyStructsConfiguration(config_data, dataset_id);
		config_data = applyFilePatterns(config_data);
		config_data = applyFileHeaderFooter(output_path,av,config_data);
		config_data = applySpecialTokens(config_data);
		
		logger.info("Writing configured resource: " + output_path);
			if(writeFile(output_path,config_data, true) == false){
				logger.error("Failed to Write " + output_path);
			}
	
	

		String template_path = (scriptConfig.getDistribution().getTemplate() != null ? scriptConfig.getDistribution().getTemplate().getPath() : null);

			/*
			* 
			* Template files are processed independently
			* 
			*/
			//for(int i = 0;i<files.size();i++){
			for(int i = 0; i < file_list.size(); i++){
				String out_path = file_list.get(i).getSourcePath();
				//logger.info("Writing template: " + out_path);
				String raw_data = new String(file_list.get(i).getRawData(), "UTF-8");
				raw_data = applyPropertyConfiguration(raw_data);
				raw_data = applyPropertySetConfiguration(raw_data);
				raw_data = applyPropertyStructsConfiguration(raw_data, dataset_id);
				raw_data = applyFilePatterns(raw_data);
				raw_data = applyFileHeaderFooter(output_path, av, raw_data);
				raw_data = applySpecialTokens(raw_data);
				FileUtil.emitFile(out_path, raw_data);

			} // end for template files loop
		//}  // end if decodeOnly == false
		if(encountered_error == true) return false;
	
		FileUtil.emitFile(contextPath  + dlist, JAXBUtil.exportObject(DocumentListType.class, document_list));
		return true;
	}
	private boolean writeFile(String output_path, String data, boolean overwrite){
		logger.info("Writing " + output_path);
		return FileUtil.emitFile(output_path, data);
	}

	private byte[] applyPatternsToPackageFileType(byte[] file_data_bytes, String name, PackageVersionType av,boolean file_changed) throws UnsupportedEncodingException{
		String file_data = new String(file_data_bytes,"UTF-8");

			//Pattern expr = getBufferPattern("%FILE_VERSION%");
			Matcher matcher = getBufferMatcher("%FILE_VERSION%",file_data);
			
			String version_name = contextPath + "config/versions/" + name + ".public.xml";
			if(matcher.find() == true){
				PackageVersionFactory.importIntoPackageVersion(av, version_name);
				if(file_changed){
					//logger.info("Increment build version for " + name);
					av.setBuildVersion(av.getBuildVersion() + 1);
				}
				
				av.setName(name);
				PackageVersionFactory.exportPackageVersion(av, version_name);
				file_data = matcher.replaceAll(PackageVersionFactory.getVersion(av));
			}


		for(int i = 0; i < scriptConfig.getFeatures().size(); i++){
			FeatureType feat = scriptConfig.getFeatures().get(i);

			String feature_name = feat.getName();
		
			if(
				feature_name != null
				&& feature_name.length() > 0
				){
		
				boolean feature_enabled = feat.getEnabled();
				String feature_token = feature_name.toUpperCase();
			
				String feature_start = "%START_" + feature_token + "%";
				String feature_stop = "%STOP_" + feature_token + "%";

				if(feature_enabled){
					Matcher m = getBufferMatcher(feature_start,file_data);
					if(m.find()){
						file_data = m.replaceAll("");
					}
					m = getBufferMatcher(feature_stop,file_data);
					if(m.find()){
						file_data = m.replaceAll("");
					}
				}
				else{
					String match_pattern = feature_start + ".*?" + feature_stop;
					Matcher m = getBufferMatcher(match_pattern,file_data);
					if(m.find()){
						file_data = m.replaceAll("");

					}
				}
			} // end feature check
			else{
				logger.info("JSConfig: Invalid Feature '" + feature_name + "'");
			}
		} // end for 
		return file_data.getBytes("UTF-8");
	}


	public String applyPropertySetConfiguration(String in_data){
		for(int j = 0; j < scriptConfig.getPropertySets().size(); j++){
			PropertySetType pset = scriptConfig.getPropertySets().get(j);
			String name_token;
			String name_attr = pset.getName();
			String key_delim_attr = pset.getKeyDelimeter();
			if(key_delim_attr == null || key_delim_attr.length() == 0) key_delim_attr = "=";
			String value_delim_attr = pset.getValueDelimiter();
			if(value_delim_attr == null || value_delim_attr.length() == 0) value_delim_attr = ",";
		
			String set_open = pset.getOpenSet();
			String set_close = pset.getCloseSet();

			if(set_open == null || set_close == null){
				set_open = "";
				set_close = "";
			}
		
			if(
				name_attr != null
				&& name_attr.length() > 0
				){
				name_token = "%" + name_attr.toUpperCase() + "%";

				Matcher m = getBufferMatcher(name_token,in_data);
				if(m.find()){
					logger.info("Configure property-set: " + name_attr);
					StringBuffer value_buff = new StringBuffer();
					value_buff.append(set_open);
					int prop_count = 0;
					for(int i = 0; i < pset.getProperties().size(); i++){
						PropertyType prop = pset.getProperties().get(i);
						String key_attr = prop.getKey();
						String value_attr = prop.getValue();
						if(value_attr != null){
							if(prop_count > 0) value_buff.append(value_delim_attr);
							if(key_attr != null && key_attr.length() > 0){
								value_buff.append(key_attr + key_delim_attr + value_attr);
							}
							else{
								value_buff.append(value_attr);
							}
							prop_count++;
						}
					}
					value_buff.append(set_close);
					in_data = m.replaceAll(value_buff.toString());
				}

			}	
		}
		return in_data;
	}

	public String applyPropertyConfiguration(String in_data){
		
		for(int j=0; j < scriptConfig.getProperties().size(); j++){
			PropertyType prop = scriptConfig.getProperties().get(j);
			String name_token;
			String name_attr = prop.getName();
			String value_attr = prop.getValue();

			if(
				name_attr != null
				&& name_attr.length() > 0
				&& value_attr != null
				//				&& value_attr.length() > 0
				){
				name_token = "%" + name_attr.toUpperCase() + "%";

				
				Matcher m = getBufferMatcher(name_token,in_data);
				if(m.find()){
					logger.info("Configure property: " + name_attr);
					in_data = m.replaceAll(value_attr);
				}


			}		
		}
		return in_data;
	}
	private PropertyDataSetType getDataSetById(PropertyStructureCollectionType pcol, int id){
		PropertyDataSetType dset = null;
		for(int i = 0; i < pcol.getDatasets().size();i++){
			if(pcol.getDatasets().get(i).getId() == id){
				dset = pcol.getDatasets().get(i);
				break;
			}
			
		}
		return dset;
	}
	private PropertyStructureType getPropertyStructureById(PropertyDataSetType dset, int id){
		PropertyStructureType pstruct = null;
		for(int i = 0; i < dset.getPropertyStructures().size();i++){
			if(dset.getPropertyStructures().get(i).getId() == id){
				pstruct = dset.getPropertyStructures().get(i);
				break;
			}
		}
		return pstruct;
	}
	public String applyPropertyStructsConfiguration(String in_data, int dataset_id){
		
		for(int j = 0; j <scriptConfig.getPropertyStructures().size(); j++){
			PropertyStructureCollectionType pstruct = scriptConfig.getPropertyStructures().get(j);
			String name_token;
			String name_attr = pstruct.getName();
		
			if(
				name_attr != null
				&& name_attr.length() > 0
				){
				name_token = "%" + name_attr.toUpperCase() + "%";

				Matcher m = getBufferMatcher(name_token,in_data);
				if(m.find()){
					logger.info("Configure property-struct: " + name_attr);
					PropertyDataSetType dataset_0 = getDataSetById(pstruct,0);
					PropertyDataSetType dataset_n = null;

					if(dataset_id > 0){
						dataset_n = getDataSetById(pstruct,dataset_id);
						if(dataset_n == null){
							logger.info("Invalid dataset id specification for '" + dataset_id + "'.  Skipping property-struct.");
							continue;
						}
					}

					StringBuffer value_buff = new StringBuffer();
					int prop_count = 0;

					if(dataset_0 != null && dataset_n != null){
						
						for(int s = 0; s < dataset_n.getPropertyStructures().size(); s++){
							PropertyStructureType pstructn = dataset_n.getPropertyStructures().get(s);
							int ps_id = pstructn.getId();
							if(ps_id < 0){
								logger.info("Null property struct id in " + name_attr);
								continue;
							}
							PropertyStructureType pstruct0 = getPropertyStructureById(dataset_0,ps_id);

							/* mark the 0th dataset property structure with the same id as bubbled so it will be skipped */
							if(pstruct0 != null) pstruct0.setBubbled(true);

							StringBuffer sub_buff = new StringBuffer();
							int sub_prop_count = 0;
							for(int t = 0; t < pstructn.getProperties().size(); t++){
								PropertyType prop = pstructn.getProperties().get(t);
								
								String pkey_attr = prop.getKey();
								String pval_attr = prop.getValue();
								if(pkey_attr != null && pkey_attr.length() > 0 && pval_attr != null){
									if(pval_attr.equals("%JSC_PROPERTY_STRUCT_ID%")){
										pval_attr = Integer.toString(ps_id);
									}
									if(sub_prop_count > 0) sub_buff.append(",");
									sub_buff.append(pkey_attr + ":" + pval_attr);
									sub_prop_count++;
								}
							}
							if(sub_prop_count > 0){
								if(prop_count > 0) value_buff.append(",");
								value_buff.append("{" + sub_buff.toString() + "}");
								prop_count++;
							}
						} // end loop through dataset_n structs
				
					} // end check for dataset n
				
					if(dataset_0 != null){

						for(int s = 0; s < dataset_0.getPropertyStructures().size(); s++){
							PropertyStructureType pstruct0 = dataset_0.getPropertyStructures().get(s);
							if(pstruct0.getBubbled() == true) continue;

							int ps_id = pstruct0.getId();

							
							StringBuffer sub_buff = new StringBuffer();
							int sub_prop_count = 0;
							for(int t = 0; t < pstruct0.getProperties().size(); t++){
								PropertyType prop = pstruct0.getProperties().get(t);

								String pkey_attr = prop.getKey();
								String pval_attr = prop.getValue();
								if(pkey_attr != null && pkey_attr.length() > 0 && pval_attr != null){
									if(pval_attr.equals("%JSC_PROPERTY_STRUCT_ID%")){
										pval_attr = Integer.toString(ps_id);
									}
									if(sub_prop_count > 0) sub_buff.append(",");
									sub_buff.append(pkey_attr + ":" + pval_attr);
									sub_prop_count++;
								}
							}
							if(sub_prop_count > 0){
								if(prop_count > 0) value_buff.append(",");
								value_buff.append("{" + sub_buff.toString() + "}");
								prop_count++;
							}
						} // end loop through non-bubbled dataset_0 structs
					} // end check for dataset_0;
					in_data = m.replaceAll(value_buff.toString());
				}


			}	
		}

		return in_data;
	}

	public String applyFilePatterns(String data){
		String in_data = data;

		for(int i = 0; i < scriptConfig.getPatterns().size(); i++){
			PatternType pat = scriptConfig.getPatterns().get(i);
			
			String pattern = pat.getMatch();
			String replace = pat.getReplace();
			///logger.info("Pattern = " + pattern);
			if(
				pattern != null
				&& pattern.length() > 0
				&& replace != null
				){
				if(pattern.equals("%JSC_STRIP_SPACE_AROUND_SPECIAL_CHAR%")){
					pattern = "\\s*([,:?+\\*\\-=;()<>&!|{])\\s*";
				}
				if(pattern.equals("%JSC_STRIP_SPACE_AROUND_CONDITIONS%")){
					pattern = "\\s*\\}[ \\t\\r\\f]*";
				}
				if(pattern.equals("%JSC_STRIP_EXTRA_SPACE%")){
					pattern = "(\\s)+";
				}
			
				if(replace.equals("%JSC_NEWLINE%")){
					replace = System.getProperty("line.separator");
				}
				if(replace.equals("%JSC_NEWLINE_HASHFUNCTION%")){
					replace = ":\nfunction";
				}
				
				
				Matcher m = getBufferMatcher(pattern,in_data);
				if(m.find()){
					in_data = m.replaceAll(replace);
				}
				else{
					//logger.info("Didn't match " + pattern);
				}
			}
		}
		return in_data;
	}

	private String applyFileHeaderFooter(String output_path,PackageVersionType av,String in_data) throws UnsupportedEncodingException{


		File info = new File(output_path);
		String file_header = scriptConfig.getDistribution().getOutputHeader();
		String lineChar = System.getProperty("line.separator");
		if(file_header == null || file_header.length() == 0){
			file_header = 
				"/*" + lineChar + "\t"
				+ info.getName().toUpperCase() + " (deployment_version: %FILE_VERSION%)"
				+ lineChar + lineChar + "\t"
				+ "Created with " + application_name + " (v. " + application_version + "), "
				+ "Copright " + application_developer + ", 2002 - 2013"
				+ lineChar + "*/" + lineChar + lineChar;
				;
		}

		String name_token = "%OUTPUT_FILE%";
		Matcher match = getBufferMatcher(name_token,file_header);

		if(match.find()){
			file_header = match.replaceAll(info.getName());
		}


		String file_footer = scriptConfig.getDistribution().getOutputFooter();
		if(file_footer == null || file_footer.length() == 0){
			file_footer = 
				lineChar + "/* "
				+ "Created with " + application_name + " (v. " + application_version + "), "
				+ "Copright " + application_developer + ", 2002 - 2013 "
				+ "*/" + lineChar
				;
		}
	
		file_header = new String(applyPatternsToPackageFileType(file_header.getBytes("UTF-8"), info.getName(), av, true),"UTF-8");
	
		return (file_header + in_data + file_footer);

	}

	public String applySpecialTokens(String in_data){
		String tmp_token = "%CDATA_START%";
		//Pattern expr = GetBufferPattern(tmp_token);
		Matcher match = getBufferMatcher(tmp_token,in_data);
		if(match.find()){
			in_data = match.replaceAll("<![CDATA[");
		}
	
		tmp_token = "%CDATA_STOP%";
		//expr = GetBufferPattern(tmp_token);
		match = getBufferMatcher(tmp_token,in_data);
		if(match.find()){
			in_data = match.replaceAll("]]>");
		}

		tmp_token = "%FILE_SIZE%";
		//expr = GetBufferPattern(tmp_token);
		match = getBufferMatcher(tmp_token,in_data);
		if(match.find()){
			in_data = match.replaceAll(Integer.toString(in_data.length()));				
		}
	
		return in_data;

	}
    private void linkFile(List<PackageFileType> out_list, List<PackageFileType> work_list, Map<String, Integer> list_map, int work_index) throws Exception
    {
    	PackageFileType work = work_list.get(work_index);
        if (list_map.containsKey(work.getClassName()) || work.getLinkBase() == true) return;
        for (int k = 0; k < work.getRequireLinks().size(); k++)
        {
            /// if the required link is  in the master order list
            /// then continue
            ///
            if (list_map.containsKey(work.getRequireLinks().get(k)) == true)
            {
                continue;
            }
            /// Find the required link in the work list, and recurse into that node
            int m = -1;
            for (int z = 0; z < work_list.size(); z++)
            {
                if (z != work_index && work_list.get(z).getClassName().equals(work.getRequireLinks().get(k)))
                {
                    m = z;
                    break;
                }
            }
            if (m == -1) throw new Exception("Unlinked reference: " + work.getRequireLinks().get(k) + " was not found");
            linkFile(out_list, work_list, list_map, m);
        }
        /// All required links at work_index should be resolved
        /// If the link does not exist in the master list, add it
        /// 
        if (list_map.containsKey(work.getClassName()) == false)
        {
        	list_map.put(work.getClassName(), out_list.size());
            out_list.add(work);
        }


    }

	private List<PackageFileType> fileLinker() throws Exception
	{
		List<PackageFileType> out_list = new ArrayList<PackageFileType>();
		List<PackageFileType> work_list = new ArrayList<PackageFileType>();
		Map<String,Integer> list_map = new HashMap<String,Integer>();
		//Dictionary<string, int> list_map = new Dictionary<string, int>();

        boolean use_linker = false;
        boolean remove_artifacts = false;
        
        Pattern reg = null;
        if (scriptConfig.getLinker() != null && scriptConfig.getLinker().getEnabled())
        {
               use_linker = true;
                //"HemiEngine\\.include\\(\"([\\S][^\"]+)\"\\)"
                reg = Pattern.compile(scriptConfig.getLinker().getLinkArtifact(), Pattern.MULTILINE);
                   remove_artifacts = scriptConfig.getLinker().getRemoveArtifacts();
            }

		
		
		for (int i = 0; i < scriptConfig.getScriptFiles().size(); i++)
		{
			ScriptFileType file = scriptConfig.getScriptFiles().get(i);
			

			PackageFileType file_data = new PackageFileType();
			file_data.setName(file.getName());
			file_data.setClassName(file_data.getName().replaceAll("\\.js$", ""));
			file_data.setEncodedName(file.getEncodedName());
			file_data.setLinkBase(file.getLinkBase());
            file_data.setEmit(file.getEmit());
            file_data.setWrap(file.getWrap());
            file_data.setSourcePath(deployPath + "/" + file_data.getName());
            
            byte[] data = new byte[0];
            File sourceFile = new File(file_data.getSourcePath());
            
            /*
            if (sourceFile.exists() == false)
            {
			*/

                if (encodedFile == null || file_data.getEncodedName() == null)
                {
                    logger.error("File '" + deployPath + "/" + file_data.getName() + "' does not exist and no encoded version specified.");
                    continue;
                }
                data = EncoderFactory.getEncodedComponentValue(encodedFile, file_data.getEncodedName());
                file_data.setEncoded(true);
                if (data == null || data.length == 0)
                {
                    logger.error("Failed to restore encoded data for '" + file_data.getEncodedName() + "'");
                    continue;
                }
                if (file_data.getEmit() == true)
                {
                    /* emit if needed, but don't overwrite */
                    if (FileUtil.emitFile(file_data.getSourcePath(), data) == false)
                    {
                        logger.info("Decoder failed to emit file: " + file_data.getName());
                    }
                    else
                    {
                        logger.info("Emitting file: " + file_data.getName());
                    }
                }
            /*
            } // end if emit file
            else
            {
                data = FileUtil.getFile(file_data.getSourcePath());
            }
			*/
		    String data_str = new String(data,"UTF-8");
		    if(data_str.contains("<source")) logger.error("Remove inline documentation from file: " + file_data.getSourcePath());
			file_data.setRawData(data);
            if (use_linker)
            {
                Matcher match = reg.matcher(data_str);
                while (match.find())
                {
                	//logger.info("Match: " + match.group(1));
                	file_data.getRequireLinks().add(match.group(1));
                }
                if (remove_artifacts)
                {
                	data_str = match.replaceAll("");
                }
            }
			file_data.setData(data_str.getBytes("UTF-8"));
			work_list.add(file_data);
			if(file_data.getLinkBase()) out_list.add(file_data);
        }

		/// Pre-populate the files with no dependencies
		/// 
		for (int i = 0; i < work_list.size(); i++)
		{
			if(work_list.get(i).getRequireLinks().size() ==0 && work_list.get(i).getLinkBase() == false){
				out_list.add(work_list.get(i));
				list_map.put(work_list.get(i).getClassName(),out_list.size() -1);
			}
		}
		for (int i = 0; i < work_list.size(); i++)
		{
            linkFile(out_list, work_list, list_map, i);

		}

		return out_list;
	}
	
	
	public Matcher getBufferMatcher(String pattern,String data){
		Pattern new_pattern = getBufferPattern(pattern);
		if(new_pattern == null) return null;
		return new_pattern.matcher(data);
	}

	public Pattern getBufferPattern(String pattern){
		Pattern new_pattern = getPattern(pattern);
		if(new_pattern == null){
			new_pattern = setPattern(pattern);
		}
		return new_pattern;
	}

	public Pattern setPattern(String pattern){
		/// why not multipline?
		Pattern new_pattern = Pattern.compile(pattern,Pattern.MULTILINE);
		patterns.put(pattern,new_pattern);
		return new_pattern;
	}

	public Pattern getPattern(String pattern){
		if(patterns.containsKey(pattern)){
			return patterns.get(pattern);
		}
		return null;
	}		

	
}
