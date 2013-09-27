echo Rebuilding Deployment Directory

rm -rf Hemi/

mkdir Hemi
mkdir Hemi/bin
mkdir Hemi/Code
mkdir Hemi/Code/Framework
mkdir Hemi/Templates
mkdir Hemi/Fragments
mkdir Hemi/Components
mkdir Hemi/Styles
mkdir Hemi/Modules
mkdir Hemi/Tests
mkdir Hemi/3rdParty
mkdir Hemi/Api
mkdir Hemi/xsl
mkdir Hemi/Workers
mkdir Hemi/DWACs
mkdir Hemi/Framework
mkdir Hemi/Examples
mkdir Hemi/Examples/Runnable
mkdir Hemi/Graphics

cp ../src/Hemi/xsl/*.* Hemi/xsl
cp ../src/Hemi/Api/*.css Hemi/Api
cp ../src/Hemi/hemi.js Hemi/Code
cp ../src/Hemi/Framework/hemi*.js Hemi/Code/Framework
cp ../src/Hemi/3rdParty/*.* Hemi/3rdParty
cp ../src/Hemi/Templates/*.* Hemi/Templates
cp ../src/Hemi/Fragments/*.* Hemi/Fragments
cp ../src/Hemi/Components/*.* Hemi/Components
# cp ../src/Hemi/Graphics/*.* Hemi/Graphics
cp -r ../src/Hemi/Graphics Hemi/Graphics
cp ../src/Hemi/Styles/*.* Hemi/Styles
cp ../src/Hemi/Modules/*.* Hemi/Modules
cp ../src/Hemi/Workers/*.* Hemi/Workers
cp ../src/Hemi/Tests/*.* Hemi/Tests
cp ../src/Hemi/DWACs/*.* Hemi/DWACs
cp ../src/Hemi/index_offline.html Hemi/
cp ../src/Hemi/Examples/Runnable/*.* Hemi/Examples/Runnable

cp ../src/Hemi/hemi.license.txt Hemi/

echo "Cleaning up unused artifacts …"

rm -rf Hemi/*.xml
rm -rf Hemi/Components/component.hierarchy*
rm -rf Hemi/Components/component.jsontree*
rm -rf Styles/box.css
rm -rf Templates/HierarchyBuilder.xml

cp ../src/Hemi/config.xml Hemi/Code

echo "Configuring Framework …"

cd ../src/configurator/bin
rm -rf export
sh config.sh ../../Hemi/config.xml ../../Hemi/HemiFramework.package.xml
cp export/HemiFramework/api/*.* ../../../deploy/Hemi/Api
cp export/HemiFramework/hemi.comp.js ../../../deploy/Hemi/
cp export/HemiFramework/stage/*.* ../../../deploy/Hemi/Framework
mv ../../../deploy/Hemi/Framework/hemi.js ../../../deploy/Hemi
cd ../../../deploy

