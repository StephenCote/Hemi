This is a shell project for bundling the Hemi JavaScript Framework into a .war file for use on Java Application Servers.  Although the Hemi framework code is not included in this directory, a link to the adjacent Hemi directory is included.

Before packaging the .war file, please verify that the following link is correct:

./src/main/webapp/Hemi -> ../../../../Hemi

If the link does not exist, create it, and/or copy the contents of the Hemi project into the ./src/main/webapp/Hemi directory. To use the condensed code instead of the verbose code, run the deploy/packageHemi.sh script to obtain the condensed version. Otherwise, the hemi.comp.js file includes the entire compressed framework (the script portion). 
