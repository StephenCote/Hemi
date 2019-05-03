<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">
<html xml:lang="en" xmlns="http://www.w3.org/1999/xhtml">
    <head>
        <title>Hemi JavaScript Framework - v4.0 Beta 1</title>
	    <link rel="stylesheet" href="Hemi/Styles/hemi.css" type="text/css" />
	    <link rel="stylesheet" href ="/HemiFramework/Hemi/Styles/TreeStyles.css" type = "text/css" />
	    <link rel = "shortcut icon" href="favicon.ico">
	    <script type = "text/javascript">
		    // Run Hemi from within the Hemi project
		    // Note the default hemi_base assumes Hemi is located in a child 'Hemi' directory
		    //
		    HemiConfig = { hemi_base: "/HemiFramework/Hemi/" };
	    </script>
	    <script type = "text/javascript" src = "Hemi/hemi.comp.js"></script>

	    <style type = "text/css">
		    html
		    {
				    /*height:auto;*/
				
				    overflow:auto;
				    background-color: #FFFFFF;
				    height:100%;
		    }
		    body{

			    color: #000000;
			    margin: 5px 0px 0px 0px;
			    padding:0px;
			    min-height:100%;
		    }
		    div.header
		    {
		        height: 86px;
		        background:url(Hemi/Graphics/Hemi_Logo_2_2.png) #FFFFFF no-repeat;
		    }

	        h1,h2 {
		        margin: 0px 0px 0px 80px;
		        font-family: Verdana;
	        }


	    </style>
	    <script type = "text/javascript">
		    var g_application_path = "/HemiFramework/";
		    Hemi.include("hemi.app");
		    Hemi.include("hemi.css");
		    Hemi.include("hemi.app.space");
		    Hemi.include("hemi.app.comp");
		    Hemi.include("hemi.app.module");
		    Hemi.include("hemi.app.module.test");
	    </script>
    </head>
    <body>
        <div class = "header">
            <h1>Hemi JavaScript Framework - v4.0 Beta 1</h1>
            <h2>Services - AJAX/JSONRPC - Monitoring - Templates - Since 2002</h2>
        </div>
        <!--
        <p>
        	<ul class = "treecomp"><li><a href = "#">Test</a></li></ul>
        </p>
        -->
        <div template = "ToolBar">&nbsp;</div>
		<div template = "ExampleExplorer">&nbsp;</div>
        <p>
	        Hemi is the fourth major version of Engine for Web Applications, and includes derivatives from the libXmlRequest, IMNMotion Behavior Monitor, Function Monitor, and JavaScript Profiler code bases.
	        To use Hemi for a Web application:
        </p>
		<ol>
			<li>Copy the framework to a directory named /Hemi
				<ul>
					<li>Or, copy the framework to any directory, and refer to the documentation for alternate locations.</li>
				</ul>
			</li>
			<li>Include the <i>hemi.js</i> core, and import desired features, or include everything with <i>hemi.comp.js</i>.</li>
			<li>To try out Hemi features:
				<ul>
					<li>Include the <i>ExampleExplorer</i> or <i>ToolBar</i> templates:
					<ul>
						<li>&lt;div template = "ExampleExplorer"&gt;[ loading examples ]&lt;/div&gt;</li>
						<li>&lt;div template = "ToolBar"&gt;[ loading toolbar ]&lt;/div&gt;</li>
					</ul>
					</li>
				</ul>
			</li>
			<li>To use the framework examples:
				<ul>
					<li>Click the <i>Framework</i> folder in the Example Explorer.</li>
					<li>Open <i>setup.examples</i></li>
				</ul>
			</li>
			<li>To browse and reuse provided fragments, templates, modules, tests, and components:
				<ul>
					<li>Click the <i>Framework Designer</i> icon in the <i>ToolBar</i>.</li>
					<li>Note: When navigating within the designer, provided content is available on the <i>STATIC</i> bus, and offline content is available on the <i>OFFLINE</i> bus.</li>
				</ul>
			</li>

		</ol>
        <h3>Offline Notes</h3>
        <ul>
			<li>
				<b>Internet Explorer 9:</b> This page will not work offline with default security settings.
			</li>
            <li>
	            <b>Chrome:</b> This page will not work offline without enabling offline XMLHTTPRequests.  Refer <a href = "http://code.google.com/p/chromium/issues/detail?id=47416">Issue 47416</a>.
            </li>
			<li><b>Storage:</b> DOM Storage does not work consistently when running from the filesystem.</li>
			<ul>
				<li>
					<b>Internet Explorer:</b> DOM Storage from the filesystem does not appear to be working.
				</li>
				<li>
					<b>Firefox:</b> DOM Storage from the filesystem appears to work, partially, for the page view.
				</li>
			</ul>
        </ul>
        <h3>Online Documentation</h3>
        <ul>
            <li><a href = "http://www.whitefrost.com/Hemi/">Hemi JavaScript Framework - whitefrost.com Project Page</a></li>
            <li><a href = "https://github.com/StephenCote/Hemi">Hemi JavaScript Framework - GitHub</a></li>
        </ul>
		


    </body>
</html>
