/// <source>
/// <name>Hemi.task</name>
/// <project>
/// 	<name>Hemi JavaScript Framework</name>
/// 	<url-title>Hemi JavaScript Framework Project</url-title>
/// 	<url>/Hemi/</url>
/// </project>
///
/// <package>
///	<path>Hemi.task</path>
///	<library>Hemi</library>
///	<description>The Task Service coordinates various actions and handlers and dependencies.  Tasks are excellent bootstraps for multiple asynchronous operations.</description>
/// <static-class>
///		<name>service</name>
///		<description>Static instance of serviceImpl.</description>
///		<version>%FILE_VERSION%</version>
/// </static-class>
/// <class>
///		<name>TaskServiceImpl</name>
///		<description>A service for managing asynchronous and dependency-driven actions.</description>
///		<version>%FILE_VERSION%</version>
///		<object>
///			<name>Task</name>
///			<property name="task_state" type = "int">Current state of the task.  State ranges from 0 to 5.</property>
///			<property name = "handled" type = "boolean">Bit indicating the task has been handled.</property>
///			<property name= "service_id" type = "String">The unique identifier of the service to which this task belongs.</property>
///			<property name= "task_id" type = "String">The unique task identifier.</property>
///			<property name= "transaction_id" type = "String">The transaction identifier for this task.</property>
///			<property name= "index" type = "int">The index of this task in the TaskService tasks array.</property>
///			<property name= "task_name" type = "String">The name of the task.</property>
///			<property name = "action_type" type = "String">The type of action this task performs.  Supported types are: xml, task, import-task, event, script, and function.</property>
///			<property name = "action" type = "String">The action this task performs, based on the <i>action_type</i>.</property>
///			<property name = "handler_type" type = "String">The type of handler this task performs.  Supported types are: xml, task, import-task, event, script, and function.</property>
///			<property name = "handler" type = "String">The handler this task performs, based on the <i>handler_type</i>.</property>
///			<property name= "data" type = "variant">The data associated with the task.</property>
///			<property name= "depends" type = "array">Array of identifiers representing dependencies that must be completed before the task can be handled.</property>
///			<property name= "executed" type = "boolean">Bit indicating the task has been executed.</property>
///			<property name= "processor" type = "function">Task pre-processor for manipulating XML data prior to the task being evaluated.</property>
///			<property name= "busy" type = "boolean">Bit indicating the task is busy working on its action or handler.</property>
///			<property name= "parent_id" type = "String">The identifier of the parent task, which depends on this task to complete.</property>
///			<property name= "parameters" type = "array">Array of parameters, used as function arguments or general shared task configuration.</property>
///			<property name= "module" type = "Module">For evaluated script statements, a module instance is created and a reference is stored on this property.</property>
///			<property name= "component" type = "Component">A framework component.</property>
///			<property name= "moduleName" type = "String">Name assigned to the module base.</property>
///			<method>
///				<name>setAutoDestroy</name>
///				<param name = "b" type = "boolean">Bit indicating the task should be destroyed once it is completed.</param>
///			</method>
///		</object>

(function () {

    HemiEngine.namespace("task", HemiEngine, {
    	dependencies : ["hemi.object", "hemi.driver", "hemi.transaction"],
        service: null,
        serviceImpl: function () {
            var t = this,
			_x = HemiEngine.xml,
			_m = HemiEngine.message.service,
			_t = HemiEngine.transaction.service
		;

            t.objects = {
                rd: []
            };
            t.properties = {
                etn: 0,
                etl: 0,
                wl: 0,
                til: "task_trans_",
                serve_delay: 0
            };
            t.data = {
                TASK_STATE_UNINITIALIZED: 0,
                TASK_STATE_INITIALIZED: 1,
                TASK_STATE_BUSY: 2,
                TASK_STATE_ACTIVE: 3,
                TASK_STATE_HANDLED: 4,
                TASK_STATE_COMPLETE: 5,

                TASK_STATE_DESTROY: 99,

                TASK_EXEC_XML: "xml",
                TASK_EXEC_TASK: "task",
                TASK_EXEC_IMPORT_TASK: "import-task",
                TASK_EXEC_FUNCTION: DATATYPES.TYPE_FUNCTION,
                TASK_EXEC_EVENT: "event",
                TASK_EXEC_SCRIPT: "script",
                TASK_EXEC_COMPONENT: "component",

                n: ""
            };

            ///				<method>		
            /// 			<name>isTask</name>
            /// 			<param name = "i" type = "variant">Name or index of the Task object..</param>
            /// 			<return-value name = "b" type = "boolean">Bit indicating whether the specified object name exists.</return-value>
            /// 			<description>Returns true if the specified name exists.</description>
            /// 			</method>
            /// 			<method>
            /// 			<name>getTasks</name>
            /// 			<return-value name = "a" type = "array">Array of Task objects.</return-value>
            /// 			<description>Returns an array of Task objects.</description>
            ///				 </method>
            /// 			<method>
            /// 			<name>getTask</name>
            /// 			<param name = "i" type = "int">Index of the Task object..</param>
            /// 			<return-value name = "e" type = "Task">XHTMLForm object.</return-value>
            /// 			<description>Returns the specified Task object.</description>
            /// 			</method>
            ///				 <method>
            /// 			<name>getTaskByName</name>
            /// 			<param name = "n" type = "String">Name of the element.</param>
            /// 			<return-value name = "e" type = "Task">Task object.</return-value>
            /// 			<description>Returns the specified Task object.</description>
            /// 			</method>
            ///		<method internal = "1">
            ///			<name>newTaskObject</name>
            ///			<param name = "n" type = "String">Unique task name.</param>
            ///			<param name = "at" type = "String">Action type.</param>
            ///			<param name = "a" type = "String">Action, based on type.  Example: Action type of function would be a function name (not evaluatable)</param>
            ///			<param name = "ht" type = "String">Handler type.</param>
            ///			<param name = "h" type = "String">Handler, based on type.</param>
            ///			<param name = "k" type = "String">Task id.</param>
            ///			<param name = "i" type = "int">Task index.</param>
            ///			<param name = "r" type = "String">Transaction id.</param>
            ///			<param name = "p" type = "function">Task pre-prococessor.</param>
            ///			<return-value type = "TaskObject" name = "t">Returns a new TaskObject.</return-value>
            ///			<description>Creates a new task object.</description>
            ///		</method>
            t.newTaskObject = function (n, at, a, ht, h, k, i, r, p) {
                var o = {
                    service_id: t.object_id,
                    task_state: 0,
                    handled: 0,
                    task_name: n,
                    action_type: at,
                    action: a,
                    handler_type: ht,
                    handler: h,
                    task_id: k,
                    index: i,
                    transaction_id: r,
                    processor: p,
                    data: 0,
                    depends: [],
                    executed: 0,
                    busy: 0,
                    auto_destroy: 0,
                    parent_id: 0,
                    parameters: [],
                    module: 0,
                    moduleName: 0,
                    component: 0,
                    setAutoDestroy: function (b) { this.auto_destroy = (b ? 1 : 0); }


                };
                HemiEngine.prepareObject("task_object", "%FILE_VERSION%", 1, o);
                return o;
            };

            ///		<method>
            ///			<name>endTask</name>
            ///			<param name = "v" type = "Variant">TaskObject or task identifier.</param>
            ///			<param name = "b" type = "Boolean">Bit indicating that all task dependencies should be removed from the cleared dependencies list.</param>
            ///			<return-value type = "boolean" name = "t">Returns true if the task was ended.</return-value>
            ///			<description>End task returns all named dependencies for the task, and then invokes clearTask.</description>
            ///		</method>
            t.endTask = function (i, b) {
                var o;
                if (DATATYPES.TS(i)) o = t.getTask(i);
                else if (DATATYPES.TO(i)) o = i;
                if (!t.isTask(o)) return 0;
                for (var d = 0; d < o.depends.length; d++) {
                    t.returnDependency(o.depends[d]);
                    if (b) delete t.objects.rd[o.depends[d]];
                }
                t.clearTask(i);
            };

            ///		<method>
            ///			<name>clearTask</name>
            ///			<param name = "v" type = "Variant">TaskObject or task identifier.</param>
            ///			<return-value type = "boolean" name = "t">Returns true if the task was cleared or slated to be cleared, or otherwise false.</return-value>
            ///			<description>Clears the specified task and removes the TaskObject.  If the task is still in operation, auto destroy is enabled and the task will continue to function.</description>
            ///		</method>
            t.clearTask = function (i) {
                var _p = t.objects, o, l;
                if (DATATYPES.TS(i)) o = t.getTask(i);
                else if (DATATYPES.TO(i)) o = i;
                if (t.isTask(o)) {

                    if (o.task_state < t.data.TASK_STATE_COMPLETE) {

                        o.setAutoDestroy(1);
                        return 1;
                    }
                    if (o.module) {
                        o.module = 0;
                        Hemi.app.module.service.UnloadModule(o.moduleName);
                    }
                    if (o.component) {
                        if (DATATYPES.TF(o.component.destroy)) o.component.destroy();
                        o.component = 0;
                    }

                    t.removeTask(o);

                    _t.closeTransaction(o.transaction_id);

                    return 1;
                }
                else {
                    _m.sendMessage("Invalid task id " + i, "200.4", 1);
                }
                return 0;
            };

            ///		<method>
            ///			<name>clearAllTasks</name>
            ///			<description>Clears all tasks.  Any task that is still in operation will be unceremoniously removed from operation, as opposed to <i>clearTask</i> which allows the task to continue current operation until it's finished.</description>
            ///		</method>	
            t.clearAllTasks = function () {
                var _p = t.objects, _s = t.properties, a, i, o;
                a = _p.tasks;
                t.clearTasks();
                _p.rd = [];
                _s.etn = 0;
                _s.etl = 0;



                for (i = 0; i < a.length; i++) {
                    o = a[i];
                    if (!o) continue;
                    _t.closeTransaction(o.transaction_id);
                }

                if (_s.wl) {
                    t.returnDependency("dom_event_window_load");
                }

            };

            ///		<method>
            ///			<name>destroy</name>
            ///			<description>Prepares this object for destruction.  All tasks will be cleared.</description>
            ///		</method>
            t.destroy = function () {
                var t = this;
                if (t.ready_state != 5) {
                    t.ready_state = 5;
                    HemiEngine.message.service.unsubscribe(t, "dom_event_window_load", "_handle_window_load");
                    HemiEngine.message.service.unsubscribe(t, "destroy", "_handle_window_destroy", window);
                    t.clearAllTasks();
                    t.objects.rd = [];
                    HemiEngine.registry.service.removeObject(this);
                }
            };

            ///		<method>
            ///			<name>sigterm</name>
            ///			<description>Sends a termination signal to this object.</description>
            ///		</method>			
            t.sigterm = function () {
                this.destroy();
            };
            t._handle_window_destroy = function (s, v) {
                this.destroy();
            };

            ///		<method>
            ///			<name>isExternalLoaded</name>
            ///			<return-value type = "boolean" name = "b">Bit indicating whether an external task list has been loaded.</return-value>
            ///			<description>Returns true if any external task list has been loaded, false otherwise.</description>
            ///		</method>
            t.isExternalLoaded = function () {
                return t.properties.etl;
            };

            ///		<method>
            ///			<name>addTaskDependency</name>
            ///			<param name = "t" type = "TaskObject">A Task object.</param>
            ///			<param name = "d" type = "String">Name of the dependency.</param>
            ///			<return-value name = "a" type = "boolean">Bit indicating whether the dependency was added.</return-value>
            ///			<description>Adds a dependency to a Task object.</description>
            ///		</method>	
            t.addTaskDependency = function (o, d) {

                if (t.isTask(o) && !t.objects.rd[d]) {
                    o.depends[o.depends.length] = d;

                    return 1;
                }
                return 0;

            };

            ///		<method>
            ///			<name>getTaskDepends</name>
            ///			<param name = "t" type = "TaskObject">A Task object.</param>
            ///			<return-value name = "a" type = "array">Array of task dependency names.</return-value>
            ///			<description>Returns a copy of the dependency names for this task.</description>
            ///		</method>
            t.getTaskDepends = function (o) {
                var h, m, r = [];

                if (!t.isTask(o)) return r;

                if (!o.depends.length) return r;
                for (h = 0; h < o.depends.length; h++)
                    r[h] = o.depends[h];
                return r;
            };

            ///		<method>
            ///			<name>returnDependency</name>
            ///			<param name = "v" type = "variant">A Task object, task name, or dependency name.</param>
            ///			<description>Returns the specified depency name or dependent task name, causing all tasks identifying this dependency to be updated.  If the returned dependency is a task, the task is forced closed regardless of whether its action or handler were executed.</description>
            ///		</method>
            t.returnDependency = function (v) {

                var o, _p = t.objects;

                if (DATATYPES.TO(v) && t.isTask(v)) {
                    o = v;
                    v = v.task_name;
                }
                else {
                    o = t.getTaskByName(v);
                }


                if (
				    t.isTask(o)
				    &&
				    o.task_state < t.data.TASK_STATE_HANDLED
			    ) {

                    o.task_state = t.data.TASK_STATE_HANDLED;
                }
                if (!_p.rd[v]) {
                    _p.rd[v] = 1;

                    t._update_task_depends(v);
                }

                return 1;
            };

            ///		<method>
            ///			<name>clearDependency</name>
            ///			<param name = "v" type = "variant">A Task object, task name, or dependency name.</param>
            ///			<description>Removes the specified dependency, regardless of whether it was resolved or completed.</description>
            ///		</method>
            t.clearDependency = function (v) {

                var o, _p = t.objects;

                if (t.isTask(v)) {
                    o = v;
                    v = v.task_name;
                }
                else {
                    o = t.getTaskByName(v);
                }
                if (_p.rd[v]) {
                    /*_p.rd[v] = 0;*/
                    delete _p.rd[v];

                    t._update_task_depends(v);
                }
                return 1;
            };

            t._update_task_depends = function (s) {
                var a, o, i, h, m, _d = t.data;
                a = t.objects.tasks;

                for (i = 0; i < a.length; i++) {
                    o = a[i];
                    if (
					!DATATYPES.TO(o)
					||
					o.task_state == _d.TASK_STATE_COMPLETE


				) {
                        continue;
                    }
                    m = 0;
                    for (h = 0; h < o.depends.length; h++) {
                        if (o.depends[h] == s) {
                            o.depends[h] = 0;
                        }
                        else if (o.depends[h] != 0) {
                            m = 1;
                        }
                    }
                    if (!m) {
                        o.depends = [];
                        t.serveTaskTransaction(o);
                    }
                }
            };
            ///		<method>
            ///			<name>HP</name>
            ///			<param name = "s" type = "TaskService">A Task Service object.</param>
            ///			<param name = "o" type = "Task">A Parent Task object.</param>
            ///			<param name = "n" type = "name">A Task name.</param>
            ///			<param name = "v" type = "value">A variant value.</param>
            ///			<return-value type = "String" name = "c">The processed value</return-value>
            ///			<description>Returns the evaluated token value.</description>
            ///		</method>

            t.HP = function (s, o, n, v) {
                var r = v, f = "replace", q = HemiEngine.registry.getEvalStatement(s);
                r = r[f](/\$\{task\}/g, q + ".getTaskByName('" + n + "')");
                r = r[f](/\$\{task\.name\}/g, n);
                r = r[f](/\$\{taskservice}/g, q);
                r = r[f](/\$\{taskservice\.id}/g, s.object_id);

                return r;
            };

            ///		<method>
            ///			<name>isTaskComplete</name>
            ///			<param name = "o" type = "Task">A Task object.</param>
            ///			<return-value type = "boolean" name = "c">Bit indicating whether the task was completed.</return-value>
            ///			<description>Returns whether or not the task was completed.</description>
            ///		</method>
            t.isTaskComplete = function (o) {
                if (
				t.isTask(o)
				&&
				o.task_state == t.data.TASK_STATE_COMPLETE
			) {
                    return 1;
                }
                return 0;
            };

            ///		<method>
            ///			<name>serveTaskTransaction</name>
            ///			<param name = "o" type = "Task">A Task object.</param>
            ///			<description>Forces the transaction that drives the Task object to serve the corresponding TransactionPacket.  This is used when a Task object is thought to be stuck due to some uncaught exception in its action, handler, or dependencies.  Alternately, use the advance method.</description>
            ///		</method>
            t.serveTaskTransaction = function (o) {
                var t = this;
                if (t.isTask(o) && t.properties.serve_delay) {
                    setTimeout("Hemi.registry.service.getObject('" + t.object_id + "')._serveTaskTransaction('" + o.task_id + "')", t.properties.serve_delay);
                }
                else {
                    t._serveTaskTransaction(o);
                }
            };
            t._serveTaskTransaction = function (o) {
                if (DATATYPES.TS(o)) o = t.getTask(o);
                if (t.isTask(o)) {
                    var z = _t.getPacket(o.transaction_id), _d = t.data;
                    if (z) {

                        _t.serveTransaction(z, t.object_id);
                        return 1;
                    }
                    else {
                        _m.sendMessage("Task could not be executed as a transaction.", "200.4");
                        return 0;
                    }
                }
                else {
                    _m.sendMessage("Tasks: object is not a task.  Auto-Destroyed tasks may also cause this message.", "511.4");
                }
            };

            ///		<method>
            ///			<name>executeTaskHandler</name>
            ///			<param name = "o" type = "Task">A Task object.</param>
            ///			<return-value type = "boolean" name = "b">Bit indicating whether the handler was executed.</return-value>
            ///			<description>Forces the task handler to be executed, and positioning the task to be in a completed state.</description>
            ///		</method>
            t.executeTaskHandler = function (o) {
                var _d = t.data, b = 0;
                if (t.isTask(o)) {
                    if (o.task_state == _d.TASK_STATE_BUSY && o.executed && !o.handled) {
                        o.task_state = _d.TASK_STATE_ACTIVE;


                        t.serveTaskTransaction(o);
                        b = 1;
                    }
                    else {
                        _m.sendMessage("Task handler " + o.task_name + " (" + o.task_state + " / " + o.executed + " / " + o.handled + ") cannot be served at this time.", "511.4");
                    }
                }
                else {
                    _m.sendMessage("Task object handler cannot be executed.", "511.4");
                }
                return b;
            };

            ///		<method>
            ///			<name>executeTaskHandlerByName</name>
            ///			<param name = "n" type = "String">The name of a task object.</param>
            ///			<return-value type = "boolean" name = "b">Bit indicating whether the handler was executed.</return-value>
            ///			<description>Forces the task handler to be executed, and positioning the task to be in a completed state.</description>
            ///		</method>
            t.executeTaskHandlerByName = function (n) {
                return t.executeTaskHandler(t.getTaskByName(n));
            };

            ///		<method>
            ///			<name>executeTaskByName</name>
            ///			<param name = "n" type = "String">The name of a task object.</param>
            ///			<return-value type = "boolean" name = "b">Bit indicating whether the task action was executed.</return-value>
            ///			<description>Forces the task action to be executed.</description>
            ///		</method>
            t.executeTaskByName = function (n) {
                return t.executeTask(t.getTaskByName(n));
            };

            ///		<method>
            ///			<name>executeTask</name>
            ///			<param name = "o" type = "Task">A Task object.</param>
            ///			<return-value type = "boolean" name = "b">Bit indicating whether the task action was executed.</return-value>
            ///			<description>Forces the task action to be executed.</description>
            ///		</method>
            t.executeTask = function (o) {

                var _d = t.data, b = 0;

                if (t.isTask(o)) {
                    if (o.task_state != _d.TASK_STATE_INITIALIZED) {
                        _m.sendMessage("executeTask: Task is not initialized.", "511.4");
                        return b;
                    }
                    o.task_state = _d.TASK_STATE_BUSY;
                    t.serveTaskTransaction(o);
                    b = 1;

                }
                else {
                    _m.sendMessage("executeTask: Task object '" + (DATATYPES.TO(o) ? o.task_name : o) + "' does not exist.", "511.4");
                }
                return b;
            };

            ///		<method>
            ///			<name>importTaskFromXML</name>
            ///			<param name = "n" type = "variant">XML Node representing a task, or a String naming a task.</param>
            ///			<param name = "o" type = "TaskObject" optional = "1">Parent task, which would be made dependent on this task.</param>
            ///			<param type = "DOMDocument" name = "d">The XML Document from which the XML Node originated.</param>
            ///			<param type = "boolean" name = "b">Bit indicating the task should be executed immediately.</param>
            ///			<description>Creates a TaskObject from the specified XML Node.</description>
            ///		</method>
            t.importTaskFromXml = function (n, p, d, b) {

                var r, i, a, at, h, ht, z, x, pi, v;

                if (
				!DATATYPES.TO(d)
			) {
                    if (p && p.action_type.match(/xml/) && DATATYPES.TO(p.data)) {
                        d = p.data;
                        pi = p.task_id;
                    }
                    else if (t.properties.etl) {
                        z = t.getTaskByName(t.properties.etn);
                        if (z) d = z.data;
                    }
                }

                if (!pi && p) pi = (p.parent_id ? p.parent_id : p.task_id);

                if (!DATATYPES.TO(d) || d == null) {

                    return 0;
                }

                if (DATATYPES.TS(n)) {
                    z = _x.queryNode(d.documentElement, "task", 0, "id", n);
                    if (DATATYPES.TO(z) && z != null)
                        return t.importTaskFromXml(z, p, d, b);

                    else
                        _m.sendMessage("Task '" + n + "' does not exist", "200.4");

                }
                if (
					DATATYPES.TO(n)
					&& n != null
					&& DATATYPES.TO(d)
					&& d != null
				) {
                    r = HemiEngine.GetSpecifiedAttribute(n, "rid");
                    i = HemiEngine.GetSpecifiedAttribute(n, "id");
                    if (r) {
                        z = _x.queryNode(d.documentElement, "task", 0, "id", r);
                        if (DATATYPES.TO(z) && z != null) {

                            if (n.getAttribute("auto-execute") == "1") b = 1;
                            t.importTaskFromXml(z, p, 0, b);
                            return 1;
                        }
                        else {
                            _m.sendMessage("Task id " + r + " does not exist", "200.4");
                        }
                    }
                    else if (i) {
                        a = t.HP(t, p, i, n.getAttribute("action"));
                        at = t.HP(t, p, i, n.getAttribute("action-type"));
                        h = t.HP(t, p, i, n.getAttribute("handler"));
                        ht = t.HP(t, p, i, n.getAttribute("handler-type"));

                        if (DATATYPES.TO(p)) {
                            if (DATATYPES.TF(p.processor)) {
                                a = p.processor(t, p, n, a);
                                at = p.processor(t, p, n, at);
                                h = p.processor(t, p, n, h);
                                ht = p.processor(t, p, n, ht);
                            }
                            t.addTaskDependency(p, i);
                        }

                        r = t.addTask(i, at, a, ht, h, (p ? p.processor : 0));
                        z = n.getElementsByTagName("param");
                        for (x = 0; x < z.length; x++) {
                            a = t.HP(t, p, i, _x.getCDATAValue(z[x]));
                            if (z[x].getAttribute("eval") == "1") {
                                /// alert(a);
                                eval("a = (" + a + ")");
                            }
                            else if (DATATYPES.TO(p) && DATATYPES.TF(p.processor))
                                a = p.processor(t, r, z[x], a);
                            r.parameters.push(a);
                        }




                        if (!t.isTask(r)) return 0;
                        if (pi) r.parent_id = pi;

                        z = n.getElementsByTagName("task");

                        for (x = 0; x < z.length; x++)
                            t.importTaskFromXml(z[x], r);


                        z = n.getElementsByTagName("depends");
                        for (x = 0; x < z.length; x++) {
                            if (HemiEngine.IsAttributeSet(z[x], "rid")) {
                                t.addTaskDependency(p, z[x].getAttribute("rid"));
                            }
                        }

                        if (b) {

                            t.executeTask(r);
                        }

                        return 1;

                    }
                    else {
                        _m.sendMessage("Task does not define an id or reference-id", "200.4");
                    }
                }
                return 0;
            };

            ///		<method>
            ///			<name>executeTaskLoader</name>
            ///			<param name = "n" type = "String">Task name.</param>
            ///			<param name = "at" type = "String">Action type. Supported types are: xml, task, import-task, event, script, and function.</param>
            ///			<param name = "a" type = "variant">Task action, based on specified action type.</param>
            ///			<param name = "ht" type = "String">Handler type. Supported types are: xml, task, import-task, event, script, and function.</param>
            ///			<param name = "h" type = "variant">Task handler, based on specified action type.</param>
            ///			<param name = "f" type = "function" optional = "1">Dependency pre-processor used to resolve tokenized values for xml import tasks.</param>
            ///			<return-value name = "o" type = "TaskObject">New Task object.</return-value>
            ///			<description>Convenience method for adding and immediately executing a task.  Used as a driver to launch other task lists by the Space service.  Invokes <i>addTaskLoader</i>.</description>
            ///		</method>
            t.executeTaskLoader = function (n, at, a, ht, h, f) {
                var i = t.addTaskLoader(n, at, a, ht, h, f);
                t.executeTask(i);
            };

            ///		<method>
            ///			<name>addTaskLoader</name>
            ///			<param name = "n" type = "String">Task name.</param>
            ///			<param name = "at" type = "String">Action type. Supported types are: xml, task, import-task, event, script, and function.</param>
            ///			<param name = "a" type = "variant">Task action, based on specified action type.</param>
            ///			<param name = "ht" type = "String">Handler type. Supported types are: xml, task, import-task, event, script, and function.</param>
            ///			<param name = "h" type = "variant">Task handler, based on specified action type.</param>
            ///			<param name = "f" type = "function" optional = "1">Dependency pre-processor used to resolve tokenized values for xml import tasks.</param>
            ///			<return-value name = "o" type = "TaskObject">New Task object.</return-value>
            ///			<description>Convenience method for adding a task that overrides the default task loader name.</description>
            ///		</method>
            t.addTaskLoader = function (n, at, a, ht, h, f) {
                t.properties.etl = 0;
                t.properties.etn = n;
                return t.addTask(n, at, a, ht, h, f);
            };

            ///		<method>
            ///			<name>addTask</name>
            ///			<param name = "n" type = "String">Task name.</param>
            ///			<param name = "at" type = "String">Action type. Supported types are: xml, task, import-task, event, script, and function.</param>
            ///			<param name = "a" type = "variant">Task action, based on specified action type.</param>
            ///			<param name = "ht" type = "String">Handler type. Supported types are: xml, task, import-task, event, script, and function.</param>
            ///			<param name = "h" type = "variant">Task handler, based on specified action type.</param>
            ///			<param name = "f" type = "function" optional = "1">Dependency pre-processor used to resolve tokenized values for xml import tasks.</param>
            ///			<return-value name = "o" type = "TaskObject">New Task object.</return-value>
            ///			<description>Adds a new task.</description>
            ///		</method>
            t.addTask = function (n, at, a, ht, h, f) {

                var v, i, l;

                i = t.properties.til + (++HemiEngine.driver.service.properties.global_counter);
                if (t.isTask(n)) {

                    return 0;
                }

                l = t.objects.tasks.length;
                if (!DATATYPES.TS(h) && !DATATYPES.TF(h)) h = 0;
                if (!h) ht = 0;
                v = t.newTaskObject(n, at, a, ht, h, i, l, 0, f);

                t.addNewTask(v, n, i);

                v.transaction_id = _t.openTransaction(i, t, { id: i, name: n });
                return v;
            };

            ///		<method internal = "1">
            ///			<name>doTransaction</name>
            ///			<param name = "s" type = "TransactionService">TransactionService managing this transaction.</param>
            ///			<param name = "p" type = "TransactionPacket">TransactionPacket used to monitor the task state.</param>
            ///			<description>Invoked by TransactionService as a TransactionParticipant.</description>
            ///		</method>	
            t.doTransaction = function (s, p) {

                var v, _d = t.data, _s = t.properties;
                v = t.getTask(p.data.id);
                if (v) {
                    _m.sendMessage("Processing " + v.task_name + ": D/S/E=" + v.depends.length + "/" + v.task_state + "/" + v.executed, "511.1");
                    switch (v.task_state) {
                        case _d.TASK_STATE_INITIALIZED:

                            break;
                        case _d.TASK_STATE_BUSY:
                            if (!v.executed) {
                                v.executed = 1;

                                t._executeTaskAction(v, 0);
                            }
                            break;
                        case _d.TASK_STATE_ACTIVE:
                            if (!v.handled) {
                                if (v.task_name == _s.etn) {
                                    _s.etl = 1;
                                }
                                if (!v.depends.length) {
                                    v.handled = 1;

                                    t._executeTaskAction(v, 1);
                                }
                                else {

                                }
                            }
                            break;
                        case _d.TASK_STATE_HANDLED:

                            if (!v.depends.length) {
                                v.task_state = _d.TASK_STATE_COMPLETE;
                                t.serveTaskTransaction(v);
                            }
                            break;
                        case _d.TASK_STATE_COMPLETE:
                            if (
							!v.depends.length
							&&
							v.executed
							&&
							v.handled
						) {
                                _m.sendMessage("Return " + v.task_name, "200.1");
                                t.returnDependency(v.task_name);
                            }
                            else {
                                _m.sendMessage("Task " + v.task_name + " was completed without an action, handler, or with dependencies", "200.4");
                            }

                            return 1;
                            break;
                        case _d.TASK_STATE_DESTROY:
                            return 1;
                            break;
                        default:
                            _m.sendMessage("Task " + v.task_name + " in state " + v.task_state + " will not be handled.", "200.4");
                            break;
                    }
                }
                else {
                    _m.sendMessage("Invalid task reference for " + p.data.id, "200.4");
                }
                return 0;
            };

            t._executeTaskAction = function (o, z) {


                var x, y, _d = t.data, _s = t.properties, d, n, z, r, i, v;
                x = (z ? o.handler : o.action);
                y = (z ? o.handler_type : o.action_type);
                _m.sendMessage("Executing task " + o.task_name + " " + y + " " + x, "511.1");
                if (t.isTask(o)) {
                    switch (y) {
                        case _d.TASK_EXEC_EVENT:
                            t.advance(o, 1);
                            _m.publish(x, { service: t, task: o });
                            t.serveTaskTransaction(o);
                            break;
                        case _d.TASK_EXEC_XML:
                            _x.getXml(x, t._handle_load_xml, 1, o.task_id);
                            break;
                        case _d.TASK_EXEC_TASK:
                            r = t.executeTaskByName(x);
                            /*
                            Advance the task based on the response from executing the target task.
                            This does not make the handling action of the task a blocking dependency.
                            */
                            t.advance(o, r);
                            t.serveTaskTransaction(o);

                            /// return 1;
                            break;
                        case _d.TASK_EXEC_IMPORT_TASK:

                            t.importTaskFromXml(x, o);

                            t.advance(o, 1);
                            t.executeTaskByName(x);
                            t.serveTaskTransaction(o);


                            /// return 1;

                            break;
                        case _d.TASK_EXEC_SCRIPT:


                            try {
                                if (x == "#cdata") {
                                    v = (o.parent_id ? t.getTask(o.parent_id) : 0);
                                    if (!v || !t.isTask(v)) v = (_s.etl ? t.getTaskByName(_s.etn) : 0);
                                    if (v) {
                                        d = v.data;
                                        z = _x.queryNode(d.documentElement, "task", 0, "id", o.task_name);
                                        if (DATATYPES.TO(z) && z != null) {
                                            n = _x.getCDATAValue(z);
                                        }
                                        else {
                                            _m.sendMessage("Null task id pointer", "200.4");
                                            return;
                                        }
                                    }
                                    else {
                                        _m.sendMessage("Cannot execute #cdata task action without xml document", "200.4");
                                        return;
                                    }

                                }
                                else {
                                    n = x;
                                }
                                if (n) {
                                    n = t.HP(t, v, o.task_name, n);
                                    if (o.processor) n = o.processor(o, v, z, n);
                                    HemiEngine.include("hemi.app.module");
                                    o.moduleName = o.task_id + "-script";
                                    d = HemiEngine.app.module.service.NewModule(o.moduleName, 0, n, this, 1, "task_module");
                                    o.module = d;
                                    r = d._exec(o);
                                    t.advance(o, r);

                                    t.serveTaskTransaction(o);
                                    /// return 1;
                                }
                                else {
                                    _m.sendMessage("Invalid script value '" + n + "'", "200.4");
                                }

                            }
                            catch (e) {
                                _m.sendMessage("Error executing script action: " + (e.description ? e.description : e.message), "200.4");
                                /// return 0;
                            }


                            break;
                        case _d.TASK_EXEC_COMPONENT:
                        case _d.TASK_EXEC_FUNCTION:

                            try {
                                if (DATATYPES.TS(x)) z = eval(x);
                                else z = x;
                                /// alert('ev=' + z);
                                if (DATATYPES.TF(z))
                                    r = z.apply(o, (o.parameters.length ? o.parameters : [o.task_name, t]));
                                else r = 1;
                                if (y == _d.TASK_EXEC_COMPONENT) {
                                    o.component = r;
                                    r = 1;
                                }
                                t.advance(o, r);
                                t.serveTaskTransaction(o);

                            }
                            catch (e) {
                                _m.sendMessage("Error executing function action: " + (e.description ? e.description : e.message), "200.4");
                                /// return 0;
                            }

                            break;
                        default:
                            t.advance(o, 1);
                            /// _m.sendMessage("Moving task " + o.task_name + " state to " + o.task_state, "511.1");
                            t.serveTaskTransaction(o);
                            break;
                    }
                }
                else {
                    _m.sendMessage("Invalid task reference", "200.4");
                }
                /// return 0;
            };
            ///		<method internal = "1">
            ///			<name>Advance</name>
            ///			<param name = "o" type = "Task">A task object</param>
            ///			<param name = "b" type = "boolean">Bit indicating whether the state should advance.</param>
            ///			<param name = "s" type = "boolean">Bit indicating whether the task transaction should be served.</param>
            ///			<description>Advances the task state based on the condition.</description>
            ///		</method>
            t.advance = function (o, b, s) {
                _d = this.data;
                if (b) {
                    if (o.task_state == _d.TASK_STATE_ACTIVE) o.task_state = _d.TASK_STATE_HANDLED;
                    if (o.task_state <= _d.TASK_STATE_BUSY) o.task_state = _d.TASK_STATE_ACTIVE;
                }
                if (s) this.serveTaskTransaction(o);
            };
            /// <method virtual = "1">
            /// 	<name>RunTaskScript</name>
            ///		<param name="oTask" type="Task">Task object.</param>
            /// 	<return-value type = "boolean" name = "bCompleted">Boolean indicating whether the script successfully completed.  If not true, the task will become stuck and the advance method must be used to move the task forward.</return-value>
            /// 	<description>Invoked for JavaScript defined as a task action or handler, either inline or as CDATA.  Script contents support the following tokens: ${taskservice}, ${taskservice.id}, ${task}, and ${task.name}.</description>
            /// </method>
            /// <method internal = "1">
            /// 	<name>DecorateModuleContent</name>
            ///		<param name="sName" type="String">Name of the Module</param>
            ///		<param name="sPath" type="String">Path to the Module</param>
            ///		<param name="sRaw" type="String">The raw imported text of the module.</param>
            /// 	<return-value type = "String" name = "sDecoration">A value to be included in the module prior to the module being instantiated.</return-value>
            /// 	<description>Decorates the task script for use as a module and with the virtual RunTaskScript function.</description>
            /// </method>
            t.DecorateModuleContent = function (n, p, r) {
                return "this._exec = function(o){var b = 0;if(typeof RunTaskScript == 'function'){b = RunTaskScript(o);}return b;};";
            };
            ///		<method internal = "1">
            ///			<name>startTransaction</name>
            ///			<param name = "s" type = "TransactionService">TransactionService managing this transaction.</param>
            ///			<param name = "p" type = "TransactionPacket">TransactionPacket used to monitor the task state.</param>
            ///			<description>Invoked by TransactionService as a TransactionParticipant.</description>
            ///		</method>
            t.startTransaction = function (s, p) {

                var v, _d = t.data;
                v = t.getTask(p.data.id);
                if (v)
                    v.task_state = _d.TASK_STATE_INITIALIZED;
                else
                    _m.sendMessage("Invalid task id " + p.data.id, "200.4");

                return 1;
            };

            ///		<method internal = "1">
            ///			<name>endTransaction</name>
            ///			<param name = "s" type = "TransactionService">TransactionService managing this transaction.</param>
            ///			<param name = "p" type = "TransactionPacket">TransactionPacket used to monitor the task state.</param>
            ///			<description>Invoked by TransactionService as a TransactionParticipant.</description>
            ///		</method>	
            t.endTransaction = function (s, p) {

                var v = t.getTask(p.data.id);
                if (v.auto_destroy) {
                    v.task_state = t.data.TASK_STATE_DESTROY;
                    t.clearTask(v);
                }

                return 1;
            };
            t._handle_load_xml = function (n, x) {
                var i = x.id, c = t, b, _d, a, z;
                _d = c.data;

                b = t.getTask(i);

                if (b) {
                    if (
					!DATATYPES.TU(x.xdom)
				) {
                        b.data = x.xdom;
                    }
                    else {
                        _m.sendMessage("Null XML Response", "512.5", 1);
                    }
                    b.task_state = _d.TASK_STATE_ACTIVE;

                    t.serveTaskTransaction(b);
                }
                else {
                    _m.sendMessage("Invalid task identifier in xml handler", "200.4")
                }
            };

            t._handle_window_load = function () {
                t.properties.wl = 1;
                t.returnDependency("dom_event_window_load");
            };

            HemiEngine.prepareObject("task_service", "%FILE_VERSION%", 1, t);

            HemiEngine.object.addObjectAccessor(t, "task");


            _t.register(t);
            _m.subscribe(t, "dom_event_window_load", "_handle_window_load");
            _m.subscribe(t, "destroy", "_handle_window_destroy", window);

            t.ready_state = 4;
        }

    }, 1);
} ());
/// </class>
/// </package>
/// </source>