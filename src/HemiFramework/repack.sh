cd ../PackageLibrary/ext
java -cp .:./packagelibrary.jar:./lib/commons-cli-1.2.jar:./lib/objects-0.0.1-SNAPSHOT.jar:./lib/util-0.0.1-SNAPSHOT.jar:./lib/log4j-1.2.6.jar:./lib/packageobjects-0.0.1-SNAPSHOT.jar org.cote.pkglib.shell.PackageConfigurator -scriptConfig ~/Projects/Source/Web/Projects/Hemi/config.xml -packageFile ~/Projects/Source/Web/Projects/Hemi/HemiFramework.package.xml 
cp export/HemiFramework/hemi.comp.js ~/Projects/Source/Web/Projects/Hemi/
cd ../../HemiFramework
mvn clean package jboss-as:redeploy
