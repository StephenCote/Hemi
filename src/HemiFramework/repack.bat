@echo off
echo Convenience script to repack and rebundle the Hemi JavaScript Framework
echo *** NOTE *** the paths are environment specific here, so change them as needed
REM --add-modules java.xml.bind 
cd C:\Users\swcot\Documents\GitHub\Hemi\src\configurator\bin
call java -classpath .;./packagelibrary.jar;./lib/commons-cli-1.2.jar;./lib/objects-0.0.1-SNAPSHOT.jar;./lib/util-0.0.1-SNAPSHOT.jar;./lib/jaxb-runtime-2.3.2.jar;./lib/log4j-api-2.12.1.jar;./lib/log4j-core-2.12.1.jar;./lib/packageobjects-0.0.1-SNAPSHOT.jar org.cote.pkglib.shell.PackageConfigurator -scriptConfig "C:\Users\swcot\Documents\GitHub\Hemi\src\Hemi\config.xml" -packageFile "C:\Users\swcot\Documents\GitHub\Hemi\src\Hemi\HemiFramework.package.xml" 
copy /y export\HemiFramework\hemi.comp.js C:\Users\swcot\Documents\GitHub\Hemi\src\Hemi
cd c:\Users\swcot\eclipse-workspace\HemiFramework
call mvn clean package
REM mvn clean package wildfly:undeploy
REM mvn wildfly:deploy