"Hemi" JavaScript Framework
Engine for Web Applications 3.0
Release: 3.0.2
Copyright 2002 - 2009. All Rights Reserved.
Author: Stephen W. Cote
Email: sw.cote@gmail.com
Project: http://www.whitefrost.com/Hemi/
BSD License: http://www.whitefrost.com/Hemi.license.txt


INSTALLATION

   Copy the desired files and folders to your Web application project.  The default Web context path is /Hemi/.
      Example:
         <script type = "text/javascript" src = "/Hemi/hemi.js"></script>

   If a different context path is desired, specify the Hemi.hemi_base property.
      Example:
         <script type = "text/javascript" src = "/Hemi/hemi.js"></script>
         <script type = "text/javascript">
            if(Hemi) Hemi.hemi_base = "/SomeOtherPath/Hemi";
         </script>
   
   Fragments, Components, Modules, Tests, and Templates will automatically resolve to Hemi.hemi_base when using a relative path.

   To verify everything is working, run the feature tests:
      Via script: Hemi.app.createWindow('Feature Test Suite','Templates/FVTs.xml','FVTs');

   Or, load the framework profiler:
      Via script: Hemi.app.createWindow(0,'Templates/FrameworkProfiler.xml','Templates/FrameworkProfiler.xml');

FILE STRUCTURE

Root Folder

   hemi.js
      Compressed version of Code/hemi.js

   hemi.comp.js
      Compressed framework, including hemi.js and all packaged dependencies.

Build Folders

   The following folders do not need to be deployed with your Web project.

   bin/
      Contains the PackageManager and PackageGenerator tools for compiling/composting the Framework.  Also includes all output files.

   Code/
      Contains the Hemi source code.

   xsl/
      Contains the XSL used to generate the API documentation.

Deploy Folders

   The following folders may be deployed with your Web project.

   3rdParty/
     Third party frameworks and libraries, such as the ExtCanvas library for Internet Explorer.

   Api/
     HTML and XML API documentation for the framework.  The API index is Api/hemi_api.html

   Components/
     Application Component definitions.  These are easily instrumented by adding the following attribute to an HTML node: component = "{name}".
     Example: <div component = "tabstrip"><div><h2>Tab1</h2><p>Content</p></div></div>

   Fragments/
     Reusable chunks of XHTML and embedded script.

   Framework/
     The individual framework files.  This can either be the exploded source version, or the compressed version.

   Graphics/
     Logos and Icons

   Modules/
     Modules are freehand scripts (API decorations are injected around the module script).

   Styles/
     CSS files.

   Templates/
     Reusable views comprised of embedded script, components, fragments, modules, et cetera.   
      
   Tests/
     Framework unit tests.  Tests are modules decorated with additional testing facilities.  Functions prefaced with Test* are treated as runnable tests.

BUILD TOOLS

** Build tools are not needed unless making changes to the framework itself **
Build tools currently require .NET 2.0 or later, and the file path references are Windows style.  Although the application source code was not tested with Mono, the underlying libraries are designed for Mono and are used in the Account Manager 4 project.

Build tools include:
   PackageManager2: a GUI for manipulating the XML package file structure, and generating API documentation.  Requires .NET 2.0 runtime.
   PackageGenerator2: A console app for executing the package structure against a specific build command.  Requires .NET 2.0 runtime.
   make_hemi.bat: A batch file demonstrating the syntax of PackageGenerator2 to build the Hemi package.