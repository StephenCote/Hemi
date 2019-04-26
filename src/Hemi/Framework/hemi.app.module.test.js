/// <source>
/// <name>Hemi.app.module.test</name>
/// <project>
/// 	<name>Hemi JavaScript Framework</name>
/// 	<url-title>Hemi JavaScript Framework Project</url-title>
/// 	<url>/Hemi/</url>
/// </project>
///
/// <package>
///	<path>Hemi.app.module.test</path>
///	<library>Hemi</library>
///	<description>Test Modules are Modules decorated for unit testing.  For example, the <a href = "../Tests/test.app.comp.js">Application Component Tests</a> includes several unit tests for vetting the Application Component class.</description>
(function () {
    HemiEngine.namespace("app.module.test", HemiEngine, {
    	dependencies : ["hemi.object","hemi.util.logger","hemi.app.module","hemi.task","hemi.event"],
        ///	<static-class>
        ///		<name>service</name>
        ///		<version>%FILE_VERSION%</version>
        ///		<description>Static implementation of the hemi.app.module.serviceImpl class.</description>
        ///
        ///
        ///	</static-class>
        ///	<class>
        ///		<name>serviceImpl</name>
        ///		<version>%FILE_VERSION%</version>
        ///		<description>The module service provides a convenience for modularizing and managing standard JavaScript as reusable components and tests.</description>
        ///

        service: null,

        serviceImpl: function () {
            var t = this;
            HemiEngine.prepareObject("test_module_service", "%FILE_VERSION%", 0, t);
            HemiEngine.util.logger.addLogger(t, "Test Module Service", "Application Test Module Service", "621");


            Hemi.event.addScopeBuffer(t);

            /// <method>
            /// 	<name>UnloadTest</name>
            ///		<param name="sTest" type="String">Name of the Test Module</param>
            /// 	<return-value type = "boolean" name = "bRemoved">Bit indicating whether the test was removed.</return-value>
            /// 	<description>Unloads the specified test module.</description>
            /// </method>

            t.UnloadTest = function (v) {
                var o, _m = HemiEngine.app.module.service, i = 0, k, _t = HemiEngine.task.service;
                o = _m.getModuleByName(v);
                if (!o) return 0;
                /// Clean up the tasks associated with the test
                /// This means drilling through the implementation ids
                ///
                for (; i < o.Impls.length; ) {
                    k = _t.getTaskByName("TestSuite-" + o.Impls[i++]);
                    HemiEngine.task.service.endTask(k.task_id);
                }
                return HemiEngine.app.module.service.UnloadModule(v);
            };
            /// <method>
            /// 	<name>NewTest</name>
            ///		<param name="sName" type="String">Name of the Test Module</param>
            ///		<param name="oContainer" type="XHTMLComponent" optional = "1">XHTML Component acting as a container for the module.</param>
            ///		<param name="fTestHandler" type="function" optional = "1">Function handler to be invoked when test status has changed.</param>
            ///		<param name="fSuiteHandler" type="function" optional = "1">Function handler to be invoked when all tests have been completed.</param>
            ///     <param name = "sPath" type = "String" optional = "1">Parent path to the test module.</param>
            ///     <param name = "sContent" type = "String" optional = "1">Content of the test module.</param>
            /// 	<return-value type = "TestModule" name = "oTestModule">A new TestModule object.</return-value>
            /// 	<description>Creates a new TestModule object.</description>
            /// </method>
            t.NewTest = function (n, x, ft, fs, p, b) {
                if (!n) return 0;
                if (!p) p = "Tests/";
                var p2 = new Promise((res,rej)=>{
                	var p1 = HemiEngine.app.module.service.NewModule(n, x, p, t, (b ? 1 : 0), "test_module");
	                p1.then((m)=>{
		                m.objects.sh = fs;
		                m.objects.th = ft;
		
		                m.ResetSuite = function () {
		                    var a = m.TestMembers, k, h, i;
		                    if ((i = m.properties.ti)) {
		                        m.properties.ti = 0;
		                        this.logDebug("Unset suite task: " + i);
		                        HemiEngine.task.service.returnDependency(HemiEngine.task.service.getTask(i));
		                        k = HemiEngine.task.service.endTask(i, 1);
		                        for (h=0; h < a.length; )
		                            HemiEngine.task.service.clearDependency(m.properties.ts + "-" + a[h++]);
		                    }
		                    m.properties.ts = "TestSuite-" + m.getObjectId();
		                    k = HemiEngine.task.service.addTask(
							    m.properties.ts,
							    "default",
							    "[nothing]",
							    "function",
							    Hemi.registry.getApplyStatement(m, "handle_testsuite_task")
							);
		                    for (h =0; h < a.length; )
		                        HemiEngine.task.service.addTaskDependency(k, m.properties.ts + "-" + a[h++]);
		
		                    m.properties.ti = k.task_id;
		                    this.logDebug("Reset suite task: " + k.task_id + " / " + k.task_state);
	                 
		                };
		                m.handle_testsuite_task = function (s, v) {
		                    if (!m.properties.ti) {
		                        this.log("Ignore completion of disengaged task");
		                        return;
		                    }
		                    m.logDebug("TestSuite " + m.name + " Completed");
		                    if (DATATYPES.TF(m.objects.sh)) m.objects.sh(m);
		                };
		                m.ResetSuite();
		                res(m);
	                });
                });
                return p2;
            };
            t.handle_testsuite_task = function (o, v) {

            };
            t.DecorateModuleContent = function (n, p, r) {
                var s = [], b = [], a = r.match(/function\s*test\S*\(/gi), g;

                for (var m = 0; a != null && m < a.length; m++) {
                    g = a[m].match(/function\s*(test\S*)\(/i);
                    if (g && g.length > 1) {
                        s.push("\"" + g[1] + "\"");
                        b.push("this._X_" + g[1] + " = function(){var o = this._ST(\"" + g[1] + "\");var b = false;try{this._TS(o,1);b = " + g[1] + ".apply(this, [o]);this._TS(o,2);if(DATATYPES.TU(b)) b = true;}catch(e){this._AM(o, e);o.error=1;}this._TS(o,3);if(b){End" + g[1] + "(b);};return o;};");
                        b.push("function Continue" + g[1] + "(){var b = true,o = Module.getTestByName(\"" + g[1] + "\");if(!o){Module.logWarning(\"Test " + g[1] + " result not found.\");return;} if(o.status == 4){Module.logWarning(\"Attempt made to complete test " + g[1] + ", which is already completed.\");return;} if(typeof HandleContinue" + g[1] + " == \"function\"){try{b = HandleContinue" + g[1] + ".apply(Module,[o]); if(DATATYPES.TU(b)) b = true;}catch(e){ Module._AM(o, e); o.error=1;}} if(b){End" + g[1] + "(b);};return o;}");
                        b.push("\nfunction End" + g[1] + "(b){var o = Module.getTestByName(\"" + g[1] + "\");if(!o){Module.logWarning(\"Test " + g[1] + " result not found.\");return;}Module._SP(o,b);Module._TS(o,4);Hemi.task.service.returnDependency(\"TestSuite-\" + Module.getObjectId()+\"-" + g[1] + "\");}\n");
                    }
                }

                return "this.Assert = function(b,m){if(!b){throw m;}};"
					+ "HemiEngine.object.addObjectAccessor(this,\"test\");"
					+ "HemiEngine.util.logger.addLogger(this, \"Test Module\", \"Test Module Service\", \"621\");"
					+ "this.TestMembers = [" + s.join(",") + "];"
                    + "this.getReport = function(){var a = [\"" + n + " Test Results\"],m = this.getTests(),i=0,r;for(;i < m.length;){r=m[i++];if(!r) continue;var rt=(r.stop_time && r.start_time ? parseInt((r.stop_time.getTime() - r.start_time.getTime())/1000) : 0);a.push('Test: ' + r.name + ' (' + rt + ' sec)\\n\\tErrors: ' + (r.error ? 'Yes':'No') + '\\n\\tMessages:');for(var p=0;p<r.messages.length;p++){a.push('\\n\\t\\t' + r.messages[p]);}} return a.join('\\n');};"
                /// Start Test
					+ "this._ST = function(n){this.logDebug(\"Start Test \" + n);var o = this.getTestByName(n);if(o)o=this.removeTest(o); o={name:n,start_time:(new Date()),stop_time:0,messages:[],result:0,error:0,status:0,data:0};this.addNewTest(o,n);return o;};"
                /// Stop Test
					+ "this._SP = function(o, a){if(a==true)this.logDebug(\"Test " + n + ".\" + o.name + \" Succeeded\"); else this.logWarning(\"Test " + n + ".\" + o.name + \" Failed\");this.logDebug(\"Stop Test " + n + "\");o.stop_time = (new Date());o.result=a;};"
                /// Add Test Message
					+ "this._AM = function(o, a){this.logError(\"Test " + n + ": \" + a);o.messages.push(a);};"
                    + "this.RunTest = function(s){var e = \"" + n + "\",f=\"_X_\" + s;if(!this[f]){this.logError(\"Invalid test: \" + f);return false;} return this[f]();};"
					+ "this.RunTests = function(){var o = HemiEngine.task.service.getTask(this.properties.ti); if(o.task_state > 1) this.ResetSuite();Hemi.task.service.executeTaskByName(this.getProperties().ts);var e = \"" + n + "\",i=0;for(; i < this.TestMembers.length;i++){this.RunTest(this.TestMembers[i]);}};"
                /// Test Status
                    + "this._TS = function(o, s){if(o.status >= s) return;o.status = s;if(DATATYPES.TF(this.objects.th)) this.objects.th(this, o, s);};"
                    + "this.getTestTask = function(){ return Hemi.task.service.getTask(this.properties.ti);};"
					+ b.join("")
				;
            };
            /// <object>
            ///	<name>TestModule</name>
            /// 	<description>A TestModule encapsulates the imported JavaScript and an API for operating within the framework, and includes a testing harness.</description>
            ///		<method virtual = "1">
            ///			<name>Initialize</name>
            /// 		<description>Invoked when the module is loaded.</description>
            ///		</method>
            ///		<method>
            ///			<name>getReport</name>
            ///         <return-value type = "String" name = "sReport">A basic status report of all test results</return-value>
            /// 		<description>Returns a formatted text report of all test results.</description>
            ///		</method>
            ///		<method virtual = "1">
            ///			<name>getTestTask</name>
            ///         <return-value type = "Task" name = "oTask">A task object with named dependencies for each test in the suite.</return-value>
            /// 		<description>Returns the task object used to correlate the test state across the suite.</description>
            ///		</method>
            ///		<method virtual = "1">
            ///			<name>Test*</name>
            ///			<param name = "testResult" type = "TestResult">The object representing the result of this test invocation.</param>
            ///         <return-value type = "boolean" name = "bTested" default = "true">Bit indicating the test completed.  If <i>false</i> is explicitly returned, the test is treated as an asynchronous test and will not complete until the corresponding <i>End*</i> method is invoked.</return-value>
            /// 		<description>When a module is created as a test, any public function whose name begins with Test (e.g.: funtion TestThisScript(){}) is parsed as a managed unit test case.</description>
            ///		</method>
            ///		<method virtual = "1">
            ///			<name>EndTest*</name>
            ///			<param name = "bResult" type = "boolean">Bit indicating the result of the test.</param>
            /// 		<description>EndTest* completes the execution of the test.  When a test explicitly returns <i>false</i>, the test result remains open until this  method is explicitly invoked.  This allows test suites to include asynchronous tests.</description>
            ///		</method>
            ///		<method virtual = "1">
            ///			<name>HandleContinueTest*</name>
            ///			<param name = "testResult" type = "TestResult">The object representing the result of this test invocation.</param>
            /// 		<description>HandleContinueTest* is called  when ContinueTest* is invoked.</description>
            ///		</method>
            ///		<method>
            ///			<name>ContinueTest*</name>
            /// 		<description>Used for cyclical testing and from callbacks while handling dependencies  Used for asynchronous tests with asynchronous dependencies.</description>
            ///		</method>
            ///		<method>
            ///			<name>ResetSuite</name>
            /// 		<description>Resets the tasklist that correlates the tests.  This will cause existing dependencies on these tests to be resolved, and the test suite will be assigned a new task id.</description>
            ///		</method>
            ///		<method>
            ///			<name>Assert</name>
            ///			<param name = "bCondition" type = "boolean">Condition being asserted as true.</param>
            ///			<param name = "sMessage" type = "String">Message to raise if the condition is false.</param>
            /// 		<description>Asserts a condition as being true.  If false, an exception is raised with the specified message.  Within a test case, the exception is caught and recorded against an internal test object for use in propogating the results.</description>
            ///		</method>
            ///		<method internal = "1">
            ///			<name>_AM</name>
            ///			<param name = "oTest" type = "TestResult">A TestResult object.</param>
            ///			<param name = "sMessage" type = "String">Message to record for the specified TestResult.</param>
            /// 		<description>Logs the specified message as an error and adds the message to the specified TestResult messages array.</description>
            ///		</method>
            ///		<method>
            ///			<name>getTests</name>
            ///         <return-value type = "array" name = "aTestResults">An array of test results.</return-value>
            /// 		<description>Every test invocation generates a new TestResultObject and passes that object to the test.  The test can set the status or message property on the result, and the result is stored in the test results array.</description>
            ///		</method>
            ///		<method>
            ///			<name>RunTests</name>
            /// 		<description>Executes all discovered test cases.  Test results are logged to the 621.#.#.# message space (refer to hemi.util.logger and hemi.message for more information).  Method is only available when module is loaded as a TestModule.</description>
            ///		</method>
            ///		<method>
            ///			<name>RunTest</name>
            /// 		<param name="sTestName" type="String">Name of the test to run.</param>
            /// 		<description>Executes the specified test.</description>
            ///		</method>

            /// <method>
            /// 	<name>logError</name>
            ///		<param name="sMessage" type="String">Message to send to the logger.</param>
            /// 	<description>Sends a message in the #100.5 message block.</description>
            /// </method>
            /// <method>
            /// 	<name>logWarning</name>
            ///		<param name="sMessage" type="String">Message to send to the logger.</param>
            /// 	<description>Sends a message in the ###.4 message block.</description>
            /// </method>
            /// <method>
            /// 	<name>logDebug</name>
            ///		<param name="sMessage" type="String">Message to send to the logger.</param>
            /// 	<description>Sends a message in the ###.1 message block.</description>
            /// </method>
            /// <method>
            /// 	<name>logFatal</name>
            ///		<param name="sMessage" type="String">Message to send to the logger.</param>
            /// 	<description>Sends a message in the ###.7 message block.</description>
            /// </method>
            /// <method>
            /// 	<name>logAdvisory</name>
            ///		<param name="sMessage" type="String">Message to send to the logger.</param>
            /// 	<description>Sends a message in the ###.2 message block.</description>
            /// </method>
            /// <method>
            /// 	<name>log</name>
            ///		<param name="sMessage" type="String">Message to send to the logger.</param>
            /// 	<description>Sends a message in the ###.3 message block.</description>
            /// </method>
            ///		<property type = "Array&lt;String&gt;" get = "1" private = "1" name = "TestMembers" internal="1">Array of test names.   Property is only available when module is loaded as a TestModule.</property>
            ///		<property type = "Node" get = "1" name = "Container">A pointer to the XHTML Node for which the module was loaded.</property>
            ///		<property type = "XHTMLComponent" get = "1" name = "Component">A pointer to the XHTMLComponent created for any Container, if a Container was used.</property>
            /// </object>
            /// <object>
            ///	<name>TestResult</name>
            /// 	<description>A TestResult represents the collected and specified metrics of a specific test invocation.</description>
            ///		<property type = "String" get = "1" name = "name">The name of the test.</property>
            ///		<property type = "Date" get = "1" name = "start_time">The time when the test began.</property>
            ///		<property type = "Date" get = "1" name = "stop_time">The time when the test completed.</property>
            ///		<property type = "int" get = "1" set ="1" name = "status" default = "0">The status of the result.  0 = created; 1 = prior to start, 2 = after run, 3 = before end, 4 = ended.</property>
            ///		<property type = "boolean" get = "1" set ="1" name = "error" default = "0">Bit indicating a failure or exception occured.</property>
            ///		<property type = "Array&lt;String&gt;" get = "1" name = "messages">A string array of messages.  </property>
            ///		<property type = "variant" get = "1" set = "1" name = "data">General data property for storing data during the execution of the test.</property>
            /// </object>

            HemiEngine.registry.service.addObject(t);
            t.ready_state = 4;
        }
    }, 1);

} ());

///	</class>
/// </package>
/// </source>