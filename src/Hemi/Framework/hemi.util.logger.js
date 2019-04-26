/// <source>
/// <name>Hemi.util.logger</name>
/// <project>
/// 	<name>Hemi JavaScript Framework</name>
/// 	<url-title>Hemi JavaScript Framework</url-title>
/// 	<url>/Hemi/</url>
/// </project>
///
/// <package>
///	<path>Hemi.util</path>
///	<library>Hemi</library>
///	<description>The Logger class may be used to instrument an object with logging functionality.  Application logging is handled by the Hemi.message.service.sendMessage function, which supports multiple levels of message levels and message scoping. </description>
///	<static-class>
///		<name>logger</name>
///		<version>%FILE_VERSION%</version>
///		<description>Utility for instrumenting a logging API into an object.  Logging facilities use the Message Service message block format of: ###.#.###.### where the first set identifies the global scope, the second is the level, the third is the inner scope, and the fourth is the fine scope.</description>
///
/// <example implementation = "1">
///		<description>Demonstrate how to use the Logger with an existing object.</description>
///		<name>Example Log</name>
///		<code>// Some JavaScript Object</code>
///		<code>var oMyObject = ...;</code>
///		<code>// The '900' block is an arbitrary value of 1 - 999</code>
///		<code>Hemi.util.logger.addLogger(oMyObject, "MyLog","Actions for my object", 900);</code>
///		<code>// Define a function to receive all log messages</code>
///		<code>oMyObject.HandleMessages = function(sType, oMessage){</code>
///		<code>   var iLevel = oMessage.level; // iLevel == 900</code>
///		<code>   var sMessage = oMessage.message;</code>
///		<code>}</code>
///		<code>// Listen for log messages on the same object</code>
///		<code>Hemi.message.service.subscribe("onsendmessage", oMyObject.HandleMessages);</code>
///		<code>// Test it out, optionally supply a numeric code pair (###.###) to identify message origination.</code>
///		<code>// The entire code for the message would be: 900.4.100.1</code>
///		<code>oMyObject.logWarning("Something happened!","100.1");</code>
///	</example>
	/// <method virtual = "1">
	/// 	<name>logError</name>
	///		<param name="sMessage" type="String">Message to send to the logger.</param>
	/// 	<description>Sends a message in the #100.5 message block.</description>
	/// </method>
	/// <method virtual = "1">
	/// 	<name>logWarning</name>
	///		<param name="sMessage" type="String">Message to send to the logger.</param>
	/// 	<description>Sends a message in the ###.4 message block.</description>
	/// </method>
	/// <method virtual = "1">
	/// 	<name>logDebug</name>
	///		<param name="sMessage" type="String">Message to send to the logger.</param>
	/// 	<description>Sends a message in the ###.1 message block.</description>
	/// </method>
	/// <method virtual = "1">
	/// 	<name>logFatal</name>
	///		<param name="sMessage" type="String">Message to send to the logger.</param>
	/// 	<description>Sends a message in the ###.7 message block.</description>
	/// </method>
	/// <method virtual = "1">
	/// 	<name>logAdvisory</name>
	///		<param name="sMessage" type="String">Message to send to the logger.</param>
	/// 	<description>Sends a message in the ###.2 message block.</description>
	/// </method>
	/// <method virtual = "1">
	/// 	<name>log</name>
	///		<param name="sMessage" type="String">Message to send to the logger.</param>
	/// 	<description>Sends a message in the ###.3 message block.</description>
	/// </method>
(function () {
    HemiEngine.namespace("util.logger", HemiEngine, {
    	logToConsole : 1,
    	levels : ["Debug", "Advisory", "Normal", "Warning", "Error", "Fatal"],
        /// <method>
        /// 	<name>addLogger</name>
        ///		<param name="oObject" type="FrameworkObject">Object onto which the logger will be instrumented.</param>
        ///		<param name="sLogName" type="String">Short name of the log.</param>
        ///		<param name="sLogDescription" type="String">Short description of the log.</param>
        ///		<param name="iContextId" type="int">The logging context.  The context must be between 1 and 999.  If the context already exists, then the first context to define the name and description will be used.</param>
        /// 	<description>Instruments the specified logger with a context sensitive logging facility.</description>
        /// </method>
        addLogger: function (o, s, d, i) {
            i = parseInt(i);
            if (isNaN(i)) return 0;
            if (!HemiEngine.message.service.data.dm[i]) {
                HemiEngine.message.service.data.dm[i] = 1;
                HemiEngine.message.service.data.ed.push([s, d, i]);
                HemiEngine.message.service._blc();
            }
            HemiEngine.util.logger.levels.map((x, z, a) => {
            	o["log" + (z != 2 ? x : "")] = function(m, l){
            		var lb = i + "." + (z + 1) + (i > 0 ? "." + i : "");
            		HemiEngine.message.service.sendMessage(m, lb);
            		if(HemiEngine.util.logger.logToConsole){
            			var mn = "log";
            			if(z < 2) mn = "debug";
            			else if (z > 3) mn = "error";
            			else if (z == 3) mn = "warn";
            			console[mn]("(" + lb + ") " + x.toUpperCase() + " " + m);
            		}
            	};
            });
        }
    });
} ());
/// </static-class>
/// </package>
/// </source>