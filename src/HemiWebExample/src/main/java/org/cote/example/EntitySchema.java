package org.cote.example;

import javax.xml.bind.annotation.XmlRootElement;

import org.cote.example.objects.ExampleCollectionType;
import org.cote.example.objects.ExampleType;


@XmlRootElement(name="EntitySchema")
public class EntitySchema {

	/// Note: This is the namespace on the client where objects referenced by this class will be injected
	///
	private String defaultPackage = "org.cote.example.objects";

	private ExampleType example = null;
	private ExampleCollectionType exampleCollection = null;
	
	public EntitySchema(){

		example = new ExampleType();
		exampleCollection = new ExampleCollectionType();
		
	}

	public ExampleType getExample() {
		return example;
	}

	public void setExample(ExampleType example) {
		this.example = example;
	}

	public ExampleCollectionType getExampleCollection() {
		return exampleCollection;
	}

	public void setExampleCollection(ExampleCollectionType exampleCollection) {
		this.exampleCollection = exampleCollection;
	}

	public String getDefaultPackage() {
		return defaultPackage;
	}

	public void setDefaultPackage(String defaultPackage) {
		this.defaultPackage = defaultPackage;
	}
	
	
	
	

}
