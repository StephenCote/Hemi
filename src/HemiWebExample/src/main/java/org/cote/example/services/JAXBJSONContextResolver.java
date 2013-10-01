package org.cote.example.services;

import javax.ws.rs.ext.ContextResolver;
import javax.ws.rs.ext.Provider;
import javax.xml.bind.JAXBContext;

import org.cote.example.EntitySchema;

import com.sun.jersey.api.json.JSONConfiguration;
import com.sun.jersey.api.json.JSONJAXBContext;

@Provider
//@Produces("application/json")
public class JAXBJSONContextResolver 
implements ContextResolver<JAXBContext>
{

    private JAXBContext context;
    private Class[] types = {EntitySchema.class};

    public JAXBJSONContextResolver() throws Exception {
        JSONConfiguration.MappedBuilder b = JSONConfiguration.mapped();
        b.rootUnwrapping(false);
        context = new JSONJAXBContext(b.build(), types);
    }

    public JAXBContext getContext(Class<?> objectType) {
        return (types[0].equals(objectType)) ? context : null;
    }
}