package org.cote.pkglib.shell;

import java.io.IOException;
import java.util.Properties;

import org.apache.commons.cli.CommandLine;
import org.apache.commons.cli.CommandLineParser;
import org.apache.commons.cli.Options;
import org.apache.commons.cli.PosixParser;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.apache.commons.cli.ParseException;
import org.cote.accountmanager.util.FileUtil;
import org.cote.accountmanager.util.JAXBUtil;
import org.cote.pkglib.config.ScriptPackageConfigurator;
import org.cote.pkglib.factories.EncoderFactory;
import org.cote.pkglib.factories.PackageFactory;
import org.cote.pkglib.factories.ScriptDocumentationFactory;
import org.cote.pkglib.objects.PackageType;
import org.cote.pkglib.objects.ScriptConfigType;

public class PackageConfigurator {
	public static final Logger logger = LogManager.getLogger(PackageConfigurator.class);
	public static void main(String[] args){

		logger.info("PackageConfigurator");
		Options options = new Options();
		options.addOption("scriptConfig",true,"JavaScript Configuration File");
		options.addOption("packageFile",true,"JavaScript Package File");
		CommandLineParser parser = new PosixParser();
		try {
			CommandLine cmd = parser.parse( options, args);
			if(cmd.hasOption("scriptConfig") && cmd.hasOption("packageFile")){
				String scriptCfg = cmd.getOptionValue("scriptConfig");
				String pkgCfg = cmd.getOptionValue("packageFile");
				logger.info("Processing " + pkgCfg + " with " + scriptCfg);
				runScriptConfigurator(pkgCfg, scriptCfg);
				
			}
			else{
				logger.warn("Missing required parameters: -scriptConfig and/or -packageFile");
			}
		}
		catch(ParseException pe){
			logger.error(pe.getMessage());
		}
	}
	private static void runScriptConfigurator(String packagePath, String scriptConfigPath){
		String imp = FileUtil.getFileAsString(scriptConfigPath);
		if(imp == null || imp.length() == 0){
			logger.error("Unable to access file: " + scriptConfigPath);
			return;
		}
		
		ScriptConfigType sct = JAXBUtil.importObject(ScriptConfigType.class, imp);
		if(sct == null){
			logger.error("Invalid Script Config file");
			return;
		}
		
		PackageType pkg = PackageFactory.importPackage(packagePath);
		if(pkg == null){
			logger.error("Invalid Package File");
			return;
		}

		ScriptPackageConfigurator scf = new ScriptPackageConfigurator();
		scf.setConfig(sct);
		scf.setEncodedFile(EncoderFactory.encodePackage(pkg));
		
		if(scf.initialize() == false){
			logger.error("Failed to initialize ScriptPackageConfigurator");
			return;
		}
		
		ScriptDocumentationFactory df = new ScriptDocumentationFactory();
		if(df.generateApiDocumentation(pkg, "ScriptAPI") == false){
			logger.error("Failed to process embedded script documentation");
			return;
		}
		
		try {
			if(scf.configure()){
				logger.info("Finished configuration");
			}
			else{
				logger.error("Failed to configure the script package");
			}
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	private static Properties getLogProps(){
		Properties logProps = new Properties();
		try {
			logProps.load(ClassLoader.getSystemResourceAsStream("logging.properties"));
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return logProps;
	}
}
