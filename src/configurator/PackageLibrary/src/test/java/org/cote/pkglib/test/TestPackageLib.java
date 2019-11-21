package org.cote.pkglib.test;

import static org.junit.Assert.assertTrue;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.cote.accountmanager.util.FileUtil;
import org.cote.accountmanager.util.JAXBUtil;
import org.cote.pkglib.config.ScriptPackageConfigurator;
import org.cote.pkglib.factories.EncoderFactory;
import org.cote.pkglib.factories.PackageFactory;
import org.cote.pkglib.factories.ScriptDocumentationFactory;
import org.cote.pkglib.objects.PackageType;
import org.cote.pkglib.objects.ScriptConfigType;
import org.junit.Before;
import org.junit.Test;

public class TestPackageLib {
	public static final Logger logger = LogManager.getLogger(TestPackageLib.class);

	@Before
	public void setUp() throws Exception {

	}
	
	@Test
	public void TestImportPackage(){
		String imp = FileUtil.getFileAsString("./test.config.xml");
		ScriptConfigType sct = JAXBUtil.importObject(ScriptConfigType.class, imp);
		PackageType pkg = PackageFactory.importPackage("/Users/Steve/Projects/Source/Web/Projects/Hemi/HemiFramework.package.xml");

		ScriptPackageConfigurator scf = new ScriptPackageConfigurator();
		scf.setConfig(sct);
		scf.setEncodedFile(EncoderFactory.encodePackage(pkg));
		
		assertTrue("Failed to initialize", scf.initialize());
		
		ScriptDocumentationFactory df = new ScriptDocumentationFactory();
		df.generateApiDocumentation(pkg, "ScriptAPI");
		
		try {
			scf.configure();
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		//logger.info("Files: " + sct.getScriptFiles().size());
		//logger.info("Patterns: " + sct.getPatterns().size());
		
		/*
		ScriptConfigType sct = new ScriptConfigType();
		DistributionType dt = new DistributionType();
		dt.setDocumentListFile("stage/hemi.files.xml");
		dt.setStagePath("stage/");
		dt.setOutputFile("./hemi.comp.js");
		dt.setOutputHeader("/ *\n\tHemi JavaScript Framework 3.5\n* /\n");
		dt.setOutputFooter("/ * End Hemi JavaScript Framework 3.5\n* /\n");
		TemplateConfigType temp = new TemplateConfigType();
		temp.setLabel("test");
		temp.setDescription("test");
		temp.setPath("./");
		dt.setTemplate(temp);
		sct.setDistribution(dt);
		LinkerType link = new LinkerType();
		link.setEnabled(true);
		link.setRemoveArtifacts(true);
		link.setLinkArtifact("HemiEngine\\.include\\(\"([\\S][^\"]+)\"\\);");
		sct.setLinker(link);
		ScriptFileType file = new ScriptFileType();
		file.setEncodedName("test");
		file.setName("test");
		sct.getScriptFiles().add(file);
		file = new ScriptFileType();
		file.setEncodedName("test2");
		file.setName("test2");
		sct.getScriptFiles().add(file);
		FeatureType feat = new FeatureType();
		feat.setEnabled(true);
		feat.setName("Test");
		sct.getFeatures().add(feat);
		PropertyType prop = new PropertyType();
		prop.setName("test");
		prop.setValue("test");
		sct.getProperties().add(prop);
		PatternType pat = new PatternType();
		pat.setMatch("HemiEngine");
		pat.setReplace("H");
		sct.getPatterns().add(pat);
		
		String contents = JAXBUtil.exportObject(ScriptConfigType.class, sct);
		logger.info("Contents = " + contents);
		FileUtil.emitFile("./testconfig.xml", contents);
		*/
		/*
		PackageType pkg = PackageFactory.importPackage("/Users/Steve/Projects/Source/Web/Projects/Hemi/HemiFramework.package.xml");
		assertNotNull("Package is null", pkg);
		logger.info("Name = " + pkg.getName());
		logger.info("Created Date " + pkg.getCreatedDate());
		EncodedType enc = EncoderFactory.encodePackage(pkg);
		assertNotNull("Null encoded object",enc);
		for(int i = 0; i < enc.getComponents().size();i++){
			logger.info(enc.getComponents().get(i).getName());
		}
		*/
		/*
		ConfigReader cr = new ConfigReader();
		boolean init = cr.init("/Users/Steve/Projects/Source/Web/Projects/Hemi/HemiFramework.package.xml");
		assertTrue("Failed to load package config",init);
		
		String name = cr.getParam("meta","name");
		assertNotNull("Name is null",name);
		logger.info("Name=" + name);
		*/
		
	}
}
