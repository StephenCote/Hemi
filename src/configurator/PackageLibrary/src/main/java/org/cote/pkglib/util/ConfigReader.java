package org.cote.pkglib.util;

import java.io.File;
import java.io.IOException;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.cote.accountmanager.util.FileUtil;
import org.cote.accountmanager.util.StreamUtil;
import org.cote.accountmanager.util.XmlUtil;
import org.w3c.dom.*;

public class ConfigReader{

	public static final Logger logger = LogManager.getLogger(ConfigReader.class);
	private Document xmlConfig;

	private boolean ready=false;
	
	private String config_path = null;
	
	public ConfigReader(){
	
	}


	public void setConfigPath(String in_path){
		this.config_path = in_path;
	}
	
	public String getConfigPath(){
		return this.config_path;
	}

	public boolean init(String configPath){
		if(configPath == null){
			return false;
		}
		init(StreamUtil.fileToBytes(configPath));
		this.config_path = configPath;
		if(xmlConfig != null && xmlConfig.getDocumentElement() != null) ready = true;
		return ready;
	}
	
	public boolean init(byte[] config_bytes){
		xmlConfig = XmlUtil.GetDocumentFromBytes(config_bytes);
		this.config_path = null;
		ready = false;
		if(xmlConfig != null && xmlConfig.getDocumentElement() != null) ready = true;
		return ready;
	}

	public boolean saveTo(String path){
		this.config_path = path;
		return save();
	}
	
	public boolean save(){
		boolean ret = false;
		if(!ready || config_path == null) return ret;
		
		File check = new File(config_path);
		try{
			if(!check.exists() && check.createNewFile() == false){
				logger.warn("ConfigReader:: save: Unable to create file " + config_path);
				return ret;
			}
		}
		
		catch(IOException ie){
			logger.warn("ConfigReader:: save: IOException " + ie.toString());
			ie.printStackTrace();
			return ret;
		}
		if(!check.exists() || !check.isFile() || !check.canWrite()){
			logger.warn("ConfigReader:: save: Unable to write to file " + config_path);
			return ret;
		}
		
		if(!dumpToDisk(config_path)){
			logger.warn("ConfigReader:: save: Unable to save " + config_path);
			return ret;
		}
		
		return true;
	}
	protected boolean dumpToDisk(String path){
		String contents = XmlUtil.GetStringFromDoc(xmlConfig);
		return FileUtil.emitFile(path, contents);
	}
	public boolean setCDATAParam(String paramSetName,String paramName,String paramValue){
		return setParam(paramSetName, paramName, "#cdata", paramValue);
	}
	public boolean setParam(String paramSetName,String paramName,String paramValue){
		return setParam(paramSetName, paramName, paramValue, null);
	}
	public boolean setParam(String paramSetName,String paramName,String paramValue, String cdata_value){
		boolean ret = false;

		if(!ready) return ret;
		
		Element root = xmlConfig.getDocumentElement();
		if(root == null){
			logger.warn("Null document element");
			return ret;
		}

		Node sqlNode=root.getElementsByTagName(paramSetName).item(0);
		
		if(sqlNode == null){
			Element new_node = xmlConfig.createElement(paramSetName);
			root.appendChild(new_node);
			sqlNode = new_node;
			logger.debug("Creating new node " + paramSetName);
		}
		
		NodeList nl=((Element)sqlNode).getElementsByTagName("param");

		String tmp_value;
		Element existing_node = null;
		
		for(int i = 0; i < nl.getLength();i++){
			Element param = (Element)nl.item(i);
			String testName = param.getAttribute("name");
			if(testName != null && testName.equals(paramName)){
				if(paramValue == null){
					sqlNode.removeChild(param);
				}
				else{
					existing_node = param;
				}
				break;
			}
		}
		
		if(existing_node == null){
			/* return true if the value is null instead of adding a new node */
			if(paramValue == null) return true;
			
			existing_node = xmlConfig.createElement("param");
			sqlNode.appendChild(existing_node);
			existing_node.setAttribute("name",paramName);
		}
		existing_node.setAttribute("value",paramValue);
		if(paramValue.equals("#cdata") && cdata_value != null){
			//existing_node.getParentNode().removeChild(existing_node);
			removeChildren(existing_node);
			existing_node.appendChild(xmlConfig.createCDATASection(cdata_value));
		}

		return true;
	}
	protected void removeChildren(Node node){
		if(node == null || node.hasChildNodes() == false) return;
		NodeList l = node.getChildNodes();
		for(int i = l.getLength() - 1;i >= 0;i--){
			node.removeChild(l.item(i));
		}
	}

	public boolean getReady(){
		return ready;
	}

	public Document getDocument(){
		return xmlConfig;
	}

	public boolean getParamNodeExists(String paramSetName){
		return (getParamNode(paramSetName) != null);
	}
	public Node getParamNode(String paramSetName){
		Element root=xmlConfig.getDocumentElement();
		if(root==null){
			logger.warn("Null document element");
			return null;
		}
		
		return root.getElementsByTagName(paramSetName).item(0);
	}


	public String[] getParamValues(String paramSetName){
		String[] retValue = new String[0];
		Element root=xmlConfig.getDocumentElement();
		if(root==null){
			logger.warn("Null document element");
			return retValue;
		}
		
		Node sqlNode=root.getElementsByTagName(paramSetName).item(0);
		String tmp_value = null;
		if(sqlNode!=null){
			NodeList nl=((Element)sqlNode).getElementsByTagName("param");
			if(nl.getLength() == 0){
				logger.debug("Zero params for " + paramSetName);
			}
			retValue = new String[nl.getLength()];
			for(int i=0;i<nl.getLength();i++){
				Element param=(Element)nl.item(i);
				tmp_value = param.getAttribute("value");
				if(tmp_value.equalsIgnoreCase("#cdata")){
					NodeList children = param.getChildNodes();
					StringBuffer buf = new StringBuffer();
					for(int c = 0;c<children.getLength();c++){
						Node node = children.item(c);
						if(node.getNodeType() == Node.CDATA_SECTION_NODE){
							buf.append(node.getNodeValue());
						}
					}
					retValue[i] = buf.toString();
				}
				else{
					retValue[i] = tmp_value;
				}
			}
		}
		else{
			logger.debug("No paramSet for name " + paramSetName);
		}


		return retValue;
	
	}
	public String getParam(String paramSetName,String paramName){
		String retValue=null;
		if(!ready) return retValue;
		
		Element root=xmlConfig.getDocumentElement();
		if(root==null){
			logger.warn("Null document element");
			return retValue;
		}
		Node sqlNode=root.getElementsByTagName(paramSetName).item(0);
		
		if(sqlNode!=null){
			NodeList nl=((Element)sqlNode).getElementsByTagName("param");
			if(nl.getLength() == 0){
				logger.debug("Zero params for " + paramSetName);
			}
			String tmp_value;
			for(int i=0;i<nl.getLength();i++){
				Element param=(Element)nl.item(i);
				String testName=param.getAttribute("name");
				if(testName!=null && testName.equals(paramName)){

				
					tmp_value = param.getAttribute("value");
					if(tmp_value.equalsIgnoreCase("#cdata")){
						NodeList children = param.getChildNodes();
						StringBuffer buf = new StringBuffer();
						for(int c = 0;c<children.getLength();c++){
							Node node = children.item(c);
							if(node.getNodeType() == Node.CDATA_SECTION_NODE){
								buf.append(node.getNodeValue());
							}
						}
						retValue = buf.toString();
					}
					else{
						retValue = tmp_value;
					}
					break;
				}
			}
		}
		else{
			logger.debug("No paramSet for name " + paramSetName);
		}
		return retValue;
	}
	public NodeList getNodeParams(String paramSetName){
		NodeList retValue = null;
		if(!ready) return retValue;
		
		Element root=xmlConfig.getDocumentElement();
		if(root==null){
			logger.warn("Null document element");
			return retValue;
		}
		Node sqlNode=root.getElementsByTagName(paramSetName).item(0);
		if(sqlNode!=null){
			NodeList nl=((Element)sqlNode).getElementsByTagName("param");
			if(nl.getLength() == 0){
				logger.debug("Zero params for " + paramSetName);
				return retValue;
			}
			retValue = nl;
		}
		else{
			logger.debug("No paramSet for name " + paramSetName);
		}
		return retValue;
	}
	
	public Node getNodeParam(String paramSetName,String paramName){
		Node retValue = null;
		if(!ready) return retValue;
		
		Element root=xmlConfig.getDocumentElement();
		if(root==null){
			logger.warn("Null document element");
			return retValue;
		}
		Node sqlNode=root.getElementsByTagName(paramSetName).item(0);
		
		if(sqlNode!=null){
			NodeList nl=((Element)sqlNode).getElementsByTagName("param");
			if(nl.getLength() == 0){
				logger.debug("Zero params for " + paramSetName);
			}
			String tmp_value;
			for(int i=0;i<nl.getLength();i++){
				Element param=(Element)nl.item(i);
				String testName=param.getAttribute("name");
				if(testName!=null && testName.equals(paramName)){
					retValue = param;
					break;
				}
			}
		}
		else{
			logger.debug("No paramSet for name " + paramSetName);
		}
		return retValue;
	}
	public boolean getBooleanParam(String paramSetName,String paramName){
		boolean ret = false;
		String val = getParam(paramSetName, paramName);
		if(val == null || val.length() == 0) return ret;
		
		if(val.equalsIgnoreCase("true") || val.equals("1")) ret = true;
		return ret;
		
	}
	
	public float getFloatParam(String paramSetName,String paramName){
		float ret = 0;
		String val = getParam(paramSetName, paramName);
		if(val == null || val.length() == 0) return ret;
		
		try{
			ret = Float.parseFloat(val);
		}
		catch(NumberFormatException nfe){
			/* */
		}
		return ret;
	}
	
	public int getIntegerParam(String paramSetName,String paramName){
		int ret = 0;
		String val = getParam(paramSetName, paramName);
		if(val == null || val.length() == 0) return ret;
		
		try{
			ret = Integer.parseInt(val);
		}
		catch(NumberFormatException nfe){
			/* */
		}
		return ret;
	}	
	public long getLongParam(String paramSetName,String paramName){
		long ret = 0;
		String val = getParam(paramSetName, paramName);
		if(val == null || val.length() == 0) return ret;
		
		try{
			ret = Long.parseLong(val);
		}
		catch(NumberFormatException nfe){
			/* */
		}
		return ret;
	}	
	public double getDoubleParam(String paramSetName,String paramName){
		double ret = 0;
		String val = getParam(paramSetName, paramName);
		if(val == null || val.length() == 0) return ret;
		
		try{
			ret = Double.parseDouble(val);
		}
		catch(NumberFormatException nfe){
			/* */
		}
		return ret;
	}	
}