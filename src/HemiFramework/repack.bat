@echo off
echo Convenience script to repack and rebundle the Hemi JavaScript Framework
echo *** NOTE *** the paths are environment specific here, so change them as needed
cd C:\Users\"Stephen Cote"\Documents\GitHub\Hemi\src\configurator\bin
call java -classpath .;./packagelibrary.jar;./lib/commons-cli-1.2.jar;./lib/objects-0.0.1-SNAPSHOT.jar;./lib/util-0.0.1-SNAPSHOT.jar;./lib/log4j-1.2.6.jar;./lib/packageobjects-0.0.1-SNAPSHOT.jar org.cote.pkglib.shell.PackageConfigurator -scriptConfig "C:\Users\Stephen Cote\Documents\GitHub\Hemi\src\Hemi\config.xml" -packageFile "C:\Users\Stephen Cote\Documents\GitHub\Hemi\src\Hemi\HemiFramework.package.xml" 
copy export\HemiFramework\hemi.comp.js C:\Users\"Stephen Cote"\Documents\GitHub\Hemi\src\Hemi
cd C:\Users\Stephen Cote\workspace\HemiFramework
call mvn clean package
REM mvn clean package wildfly:undeploy
REM mvn wildfly:deploy