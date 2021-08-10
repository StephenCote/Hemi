package org.cote.example.services;


import java.util.Date;
import java.util.GregorianCalendar;
import java.util.UUID;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Produces;

import javax.ws.rs.Path;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.UriInfo;
import javax.xml.datatype.DatatypeConfigurationException;
import javax.xml.datatype.DatatypeFactory;
import javax.xml.datatype.XMLGregorianCalendar;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.cote.example.EntitySchema;
import org.cote.example.objects.ExampleType;
import org.cote.rpc.SchemaBean;
import org.cote.rpc.ServiceSchemaBuilder;


@Path("/example")
public class ExampleService{

	private static final Logger logger = LogManager.getLogger(ExampleService.class);
	private static DatatypeFactory dataTypeFactory = null;
	
	/*
	 * The SchemaBean holds the JSON-RPC style schema for this class 
	 */
	private static SchemaBean schemaBean = null;
	
	/*
	 * The EntitySchema defines object schema that will be injected into the Web page 
	 */
	private static EntitySchema entitySchema = null;
	
	public ExampleService(){


	}
	@GET @Path("/new") @Produces(MediaType.APPLICATION_JSON)
	public ExampleType getSelf(@Context HttpServletRequest request){
		String sessionId = request.getSession(true).getId();
		
		ExampleType out_type = new ExampleType();
		out_type.setName(UUID.randomUUID().toString());
		out_type.setDescription("Object created by session " + sessionId);
		out_type.setCreated(getXmlGregorianCalendar(new Date()));
		out_type.setModified(getXmlGregorianCalendar(new Date()));
		return out_type;

	}
	@POST @Path("/update") @Produces(MediaType.APPLICATION_JSON) @Consumes(MediaType.APPLICATION_JSON)
	public ExampleType postUpdate(ExampleType obj, @Context HttpServletRequest request, @Context HttpServletResponse response){

		String sessionId = request.getSession(true).getId();
		
		obj.setModified(getXmlGregorianCalendar(new Date()));
		obj.setDescription("Object updated by session " + sessionId);
		
		return obj;
	}
	
	 
	 @GET @Path("/entity") @Produces(MediaType.APPLICATION_JSON)
	 public EntitySchema getEntitySchema(){
		 if(entitySchema == null){
			 entitySchema = new EntitySchema();
			 //populateDataSchema(ent.getDataBeanSchema());
		 }
		 return entitySchema;
	 }
	
	 @GET @Path("/smd") @Produces(MediaType.APPLICATION_JSON)
	 public SchemaBean getSmdSchema(@Context UriInfo uri){
		 if(schemaBean != null) return schemaBean;
		 schemaBean = ServiceSchemaBuilder.modelRESTService(this.getClass(),uri.getAbsolutePath().getRawPath().replaceAll("/smd$", ""));
		 return schemaBean;
	 }
	 
	 
	 /// The following is as straight copy from Account Manager CalendarUtil
	 
		public static DatatypeFactory getDatatypeFactory(){
			if(dataTypeFactory != null) return dataTypeFactory;
			try {
				dataTypeFactory = DatatypeFactory.newInstance();
			} catch (DatatypeConfigurationException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			return dataTypeFactory;
		}
		public static XMLGregorianCalendar getXmlGregorianCalendar(Date date){
			GregorianCalendar c = new GregorianCalendar();
			c.setTime(date);
			return getDatatypeFactory().newXMLGregorianCalendar(c);
		}
}