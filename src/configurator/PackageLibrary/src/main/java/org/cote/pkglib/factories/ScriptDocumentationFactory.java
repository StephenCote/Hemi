package org.cote.pkglib.factories;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.StringWriter;
import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.xml.transform.Transformer;

import org.apache.log4j.Logger;
import org.cote.accountmanager.util.FileUtil;
import org.cote.accountmanager.util.StreamUtil;
import org.cote.accountmanager.util.XmlUtil;

import org.cote.pkglib.objects.DocumentIndexType;
import org.cote.pkglib.objects.PackageType;
import org.cote.pkglib.objects.PatternType;
import org.cote.pkglib.objects.ResourceType;
import org.cote.pkglib.util.DocumentIndexComparator;
import org.cote.pkglib.util.PatternUtil;
import org.w3c.dom.Document;
import org.w3c.dom.Element;

public class ScriptDocumentationFactory {
	public static final Logger logger = Logger.getLogger(ScriptDocumentationFactory.class.getName());
	
	private String basePath = "./export/";
	private String apiPath = "api/";
	public ScriptDocumentationFactory(){
		
	}
	
	private void bufferInlineDocumentation(PackageType pkg, ResourceType rec, StringBuffer buff){
		
		File f = PackageFactory.getResourceFile(pkg, rec);
		bufferInlineDocumentation(pkg, f, buff);
	}
	private void bufferInlineDocumentation(PackageType pkg, File recF, StringBuffer buff){
		try{
			BufferedReader reader = new BufferedReader(new InputStreamReader(new FileInputStream(recF),"UTF-8"));
			String line = null;
			Pattern p = Pattern.compile("^\\s*///\\s*(.*)$");
			String lineChar = System.getProperty("line.separator");
			
			while ((line = reader.readLine()) != null) {
				line = line.trim();
				Matcher m = p.matcher(line);
				if (m.matches()) {
					buff.append(m.group(1) + lineChar);
				}
				else if(line.indexOf("///") > -1){
					logger.info("Failed to match line with leading documentation comment annotation");
					break;
				}
			}
			reader.close();
		}
		catch(IOException e){
			logger.error(e.getMessage());
			e.printStackTrace();
		}
	}

	
	public boolean generateApiDocumentation(PackageType pkg, String xslName){
		boolean out_bool = false;
		
		String contextPath = basePath + pkg.getName() + "/" + apiPath; 
		
		logger.info("Generating documentation in " + contextPath);
		
		byte[] rec_data = PackageFactory.loadResourceFile(pkg, xslName);
		if(rec_data.length == 0){
			logger.error("Resource file was empty");
			return out_bool;
		}
		Transformer transformer = XmlUtil.loadTransformer(rec_data);
		if(transformer == null){
			logger.error("Failed to load transformer from " + xslName + " resource");
			return out_bool;
		}
		
		PatternType ver_pat = new PatternType();
		ver_pat.setMatch("%FILE_VERSION%");
		ver_pat.setReplace("%VERSION%");
		ver_pat.setVolatileReplace(pkg.getMajorVersion() + "." + pkg.getMinorVersion() + "." + pkg.getBuildVersion());

		int proc_count = 0;
		Map<String, List<DocumentIndexType>> libs = new HashMap<String,List<DocumentIndexType>>();
		out_bool = true;
		for(int i = 0; i < pkg.getResources().size();i++){
			ResourceType rec = pkg.getResources().get(i);
			if(rec.getMimeType().equals("text/javascript") == false){
				logger.info("Skipping non JavaScript resource");
				continue;
			}
			StringBuffer buff = new StringBuffer();
			File recF = PackageFactory.getResourceFile(pkg, rec);
			bufferInlineDocumentation(pkg,recF,buff);

			String out_data = PatternUtil.applyPattern(ver_pat, buff.toString());
			if(out_data == null || out_data.length() == 0) continue;
			try{
			
				Document doc = XmlUtil.GetDocumentFromBytes(out_data.getBytes("UTF-8"));
				if(doc == null){
					logger.error("Failed to parse XML from resource " + rec.getName());
					continue;
				}
				
				String lib_name = XmlUtil.getNodeText(XmlUtil.selectSingleNode(doc,"/source/package/library"));
	            String lib_desc = XmlUtil.getNodeText(XmlUtil.selectSingleNode(doc,"/source/package/description"));
	            String src_name = null;
	            boolean add_lib = false;
	            if(lib_name != null){
	            	src_name = XmlUtil.getNodeText(XmlUtil.selectSingleNode(doc,"/source/name"));
	            	Element ind = doc.createElement("index");
	            	doc.getDocumentElement().appendChild(ind);
	            	if(lib_desc != null){
	            		Element desc = doc.createElement("description");
	            		ind.appendChild(desc);
	            		desc.appendChild(doc.createTextNode(lib_desc));
	            	}
	            	Element url = doc.createElement("url");
	            	url.appendChild(doc.createTextNode(lib_name + "_api.html"));
	            	ind.appendChild(url);
	            	Element url_t = doc.createElement("url-title");
	            	url_t.appendChild(doc.createTextNode("API Index"));
	            	ind.appendChild(url_t);
	            	out_data = XmlUtil.GetStringFromDoc(doc);
	            	add_lib = true;
	            }
	            
	            String out_name = recF.getName();

	            String xml_name = out_name.substring(0,out_name.lastIndexOf(".")) + ".xml";
	            out_name = out_name.substring(0,out_name.lastIndexOf(".")) + ".html";
	            
	            FileUtil.emitFile(contextPath + xml_name, out_data);
	            byte[] trans = XmlUtil.transform(transformer, doc);
	            FileUtil.emitFile(contextPath + out_name, trans);
	            //logger.info("Out = " + out_name + " / XML = " + xml_name);
	            
	            if(add_lib){
	            	if(libs.containsKey(lib_name) == false){
	            		libs.put(lib_name, new ArrayList<DocumentIndexType>());
	            	}
	            	DocumentIndexType dit = new DocumentIndexType();
	            	dit.setName(src_name);
	            	dit.setPath(out_name);
	            	dit.setXmlPath(xml_name);
	            	if(lib_desc != null) dit.setDescription(lib_desc);
	            	libs.get(lib_name).add(dit);
	            }
	            
	            proc_count++;
			}
			catch(UnsupportedEncodingException uee){
				logger.error(uee.getMessage());
				out_bool = false;
				break;
			}
            
		}
		if(out_bool && libs.size() > 0){
			logger.info("Generating documentation index in " + contextPath);
			Set<String> keys = libs.keySet();
			Iterator<String> keyIter = keys.iterator();
			while(keyIter.hasNext()){
				String key = keyIter.next();
				List<DocumentIndexType> ind = libs.get(key);
				StringBuffer buff = new StringBuffer();
				buff.append("<source><name>" + key + "</name><library>" + key + "</library>");
				buff.append("<project><name>API Indices</name><url>../</url><url-title>Project</url-title></project>");
				buff.append("<indices>");
				Collections.sort(ind,new DocumentIndexComparator());
				for(int i = 0; i < ind.size();i++){
					DocumentIndexType dit = ind.get(i);
					buff.append("<index><url-title>" + dit.getName() + "</url-title><url>" + dit.getPath() + "</url><xml-url>" + dit.getXmlPath() + "</xml-url>");
	                if (dit.getDescription() != null)
	                {
	                    buff.append("<description>" + dit.getDescription() + "</description>");
	                }
	                buff.append("</index>");
				}
				
				buff.append("</indices>");
				buff.append("</source>");
				
				String out_name = key + "_api.html";
				FileUtil.emitFile(contextPath + key + "_api.xml", buff.toString());
				File tst = new File(contextPath + key.toLowerCase() + "_api.xml",buff.toString());
				if(tst.exists() == false) FileUtil.emitFile(contextPath + key.toLowerCase() + "_api.xml", buff.toString());
				byte[] indData = XmlUtil.transform(transformer, XmlUtil.GetDocumentFromBytes(buff.toString().getBytes()));
				FileUtil.emitFile(contextPath +  out_name,indData);
			}
		}
		

		return out_bool;
	}
	
}
