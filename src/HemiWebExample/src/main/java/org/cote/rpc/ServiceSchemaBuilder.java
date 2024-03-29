package org.cote.rpc;

import java.lang.annotation.Annotation;
import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.List;

import javax.ws.rs.Path;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

public class ServiceSchemaBuilder {
	private static final Logger logger = LogManager.getLogger(ServiceSchemaBuilder.class);
	public static SchemaBean modelRESTService(Class c, String servicePath){
		SchemaBean schemaBean = new SchemaBean();
		schemaBean.setServiceURL(servicePath);
		Method[] ma = c.getDeclaredMethods();
		for(int i = 0; i < ma.length;i++){
			logger.info("Declared method: " + ma[i].getName());
			if(
				ServiceSchemaBuilder.isAnnotated(ma[i], javax.ws.rs.POST.class)
				|| ServiceSchemaBuilder.isAnnotated(ma[i], javax.ws.rs.GET.class)
				|| ServiceSchemaBuilder.isAnnotated(ma[i], javax.ws.rs.PUT.class)
				|| ServiceSchemaBuilder.isAnnotated(ma[i], javax.ws.rs.DELETE.class)
			){
				String altName = ma[i].getName();
				if(ServiceSchemaBuilder.isAnnotated(ma[i], javax.ws.rs.Path.class)){
					Path an = ma[i].getAnnotation(Path.class);

					if(an != null && an.value() != null){
						altName = an.value().replaceAll("/","");
						if(altName.indexOf("{") > -1) altName = altName.substring(0,altName.indexOf("{"));
						//logger.info("Annotated for " + altName);
					}
					else{
						//logger.info("Null path for " + altName);
					}
				}
				else{
					logger.info("Not annotated for " + altName);
				}
				schemaBean.getMethods().add(ServiceSchemaBuilder.modelMethod(ma[i], altName));
			}
		}
		return schemaBean;
	}
	public static ServiceSchemaMethod modelMethod(Method m){
		return modelMethod(m, m.getName());
	}
	public static ServiceSchemaMethod modelMethod(Method m, String name){
		ServiceSchemaMethod meth = new ServiceSchemaMethod();
		meth.setName(name);
		if(m.getReturnType() != null){
			meth.setReturnValue(new ServiceSchemaMethodParameter("retVal",m.getReturnType().getName()));
		}
		for(int i = 0; i < m.getParameterTypes().length;i++){
			meth.getParameters().add(new ServiceSchemaMethodParameter("p" + i,m.getParameterTypes()[i].getName()));
		}

		if(ServiceSchemaBuilder.isAnnotated(m, javax.ws.rs.POST.class)) meth.setHttpMethod("POST");
		else if (ServiceSchemaBuilder.isAnnotated(m, javax.ws.rs.PUT.class)) meth.setHttpMethod("PUT");
		else if(ServiceSchemaBuilder.isAnnotated(m, javax.ws.rs.DELETE.class)) meth.setHttpMethod("DELETE");
		/*
		logger.info(m.getName() + " annotated for " + 
				ServiceSchemaBuilder.isAnnotated(m, javax.ws.rs.POST.class) 
				+ ServiceSchemaBuilder.isAnnotated(m, javax.ws.rs.GET.class)
				+ ServiceSchemaBuilder.isAnnotated(m, javax.ws.rs.PUT.class)
				+ ServiceSchemaBuilder.isAnnotated(m, javax.ws.rs.DELETE.class)
				);
		*/	
		return meth;
	}
	public static boolean isAnnotated(Method m, Class c){
		boolean out_bool = false;
		try{
			Annotation[] an = m.getDeclaredAnnotations();
			for(int i = 0; i < an.length;i++){
				if(an[i].annotationType().getName().equals(c.getName())){
					//logger.info(an[i].annotationType().getName() + " == " + c.getName());
					out_bool = true;
					break;
				}
			}
			//Annotation an = m.getAnnotation(c);
			//logger.info("Annotation " + c.getName() + " == " + (an == null? an.annotationType().getName() : false));
			//out_bool = true;
		}
		catch(Exception e){
			/// sink error
		}
		return out_bool;
			
	}
	public static ServiceSchemaMethod[] getMethods(Class c, Document d){
		String name = c.getSimpleName();
		Element svc = null;
		NodeList nl = d.getElementsByTagName("service");
		for(int i = 0; i < nl.getLength(); i++){
			Element m = (Element)nl.item(i);
			if(name.equals(m.getAttribute("name"))){
				svc = m;
				break;
			}
		}
		if(svc == null) return new ServiceSchemaMethod[0];
		return getMethods(svc);
	}
	public static ServiceSchemaMethod[] getMethods(Element svc){
		List<ServiceSchemaMethod> methods = new ArrayList<ServiceSchemaMethod>();
		NodeList nl = svc.getElementsByTagName("method");
		if(nl.getLength() == 0) return new ServiceSchemaMethod[0];
		for(int i = 0; i < nl.getLength(); i++){
			
			Element m = (Element)nl.item(i);
			String name = GetElementText(m, "name");
			
			
			ServiceSchemaMethod newMethod = new ServiceSchemaMethod();
			newMethod.setName(name);
			NodeList pl = m.getElementsByTagName("parameter");
			for(int pt = 0; pt < pl.getLength(); pt++){
				Element p = (Element)pl.item(pt);
				String pName = GetElementText(p,  "name");
				String pType = GetElementText(p, "type");
				newMethod.getParameters().add(new ServiceSchemaMethodParameter(pName, pType));
			}
			methods.add(newMethod);
		}
		return methods.toArray(new ServiceSchemaMethod[0]);
	}
	
	
	/// The following is a straight copy from Account Manager XmlUtil - it keeps the example self contained to reduce the dependencies
	
	public static String GetElementText(Element parent, String node_name)
	{
		NodeList match = parent.getElementsByTagName(node_name);
		if (match.getLength() == 0) return null;
		Node m = match.item(0);
		return getNodeText(m);
	}
	public static String getNodeText(Node node){
		if(node == null) return null;
		StringBuffer buff = new StringBuffer();
		for(int c = 0; c < node.getChildNodes().getLength();c++){
			Node cn = node.getChildNodes().item(c);
			if(cn.getNodeType() == Node.TEXT_NODE || cn.getNodeType() == Node.CDATA_SECTION_NODE){
				buff.append(cn.getNodeValue());
			}
		}
		return buff.toString().trim();

	}

}
