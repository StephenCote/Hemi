Hemi.message.service.setReportThreshold("NORMAL");

Hemi.include("hemi.driver");
Hemi.include("hemi.data.stack");
Hemi.include("hemi.object");
Hemi.include("hemi.task");
Hemi.include("hemi.wires");
Hemi.include("hemi.util.logger");
Hemi.include("hemi.util.url");
Hemi.include("hemi.util.thread");
Hemi.include("hemi.monitor");
Hemi.include("hemi.object.xhtml");
Hemi.include("hemi.util.config");
Hemi.include("hemi.storage");
Hemi.include("hemi.util.url");
Hemi.include("hemi.ui.wideselect");
Hemi.include("hemi.app.space");
Hemi.include("hemi.app");
Hemi.include("hemi.app.comp");
Hemi.include("hemi.app.module");
Hemi.include("hemi.data.validator");


Hemi.message.service.subscribe("onsendmessage", function(s,v){
	var oSpot = document.getElementById("_spot");
	if(oSpot != null){
		var d = document.createElement("p");
		d.appendChild(document.createTextNode(v.message));
		if(oSpot.firstChild) oSpot.insertBefore(d, oSpot.firstChild);
		else document.getElementById("_spot").appendChild(d);
	}
});
// dom_event_window_load
Hemi.message.service.subscribe("onspaceconfigload", function (s, v){
	/// Invoke LoadSpaces before creating the demo space
	///
	//Hemi.app.space.service.loadSpaces();
	if(v != Hemi.app.space.service.getPrimarySpace()) return;

	//var oX = Hemi.app.module.service.NewModule("console.output");
	
	//document.getElementById("_spot").style.display = "block";
	var oLast = document.body.getElementsByTagName("div");
	oLast = oLast[oLast.length - 1];
	var vTest = Hemi.app.module.service.NewTest("test.object.xhtml");
	vTest.RunTests();
	return;
	
	/*
	var oSelect = document.createElement("div");
	document.body.insertBefore(oSelect, oLast);

	var oSelectCtrl = Hemi.ui.wideselect.newInstance(oSelect);
	oSelectCtrl.getContainer().style.display = "block";
	oSelectCtrl.getContainer().style.position = "relative";
	oSelectCtrl.addItem("Test","test");
	*/
	
	var oSpace = Hemi.app.createApplicationSpace(null, null, oLast, (function(oService, oSpace){
		var oInput = document.createElement("input");
		oInput.setAttribute("type","text");
		oInput.setAttribute("value","Test value");
		oSpace.space_element.appendChild(oInput);
		var oComp4 = Hemi.app.createComponent(oInput, oSpace, "Test Text");

		var sTestVal = HemiEngine.data.form.service.getValue("Test Text",oSpace.space_id);
		Hemi.log("Virtual Form Test #1 = " + (sTestVal == oInput.value));
		//alert(sTestVal);
	}));
	
	var oComp1 = Hemi.app.createApplicationComponent("test");
	var oTestCompNode = document.createElement("div");

	oTestCompNode.innerHTML = "Test Comp Node";
	oSpace.space_element.appendChild(oTestCompNode);
	
	var oComp2 = Hemi.app.createApplicationComponent("test", oTestCompNode, oSpace);
	
	var oTestCompNode2 = document.createElement("div");
	oTestCompNode2.innerHTML = "Test Comp Node #2";
	document.body.insertBefore(oTestCompNode2, oLast);
	var oComp3 = Hemi.app.createApplicationComponent("test", oTestCompNode2, Hemi.app.space.service.getPrimarySpace(), "Test Comp");

	var oComp3_check = Hemi.app.space.service.getPrimarySpace().getSpaceObjectByName("Test Comp");
	Hemi.log("Test inject component with reference id: " + (oComp3_check ? " true " : " false "));
	
	//var sTestVal = HemiEngine.data.form.service.getValue("Test Text",oSpace.space_id);
	//alert(sTestVal);

	var CMonitor = function(){
		Hemi.util.logger.addLogger(this, "Monitor", "Monitor Class", "201");
		Hemi.prepareObject("Monitor","1.0",1,this);
		Hemi.monitor.service.addMonitor(this);
	}
	CMonitor.prototype.initializeMonitor = function(){
		this.log("Initialize");
		return true;
	}
	CMonitor.prototype.handle_window_load = function(){
		this.log("Window load");
		return true;
	}	

	var oMonitor = new CMonitor();

	
	var oStackParent = Hemi.newObject("StackParent","1.0",1);
	var oStackParent2 = Hemi.newObject("StackParent","1.0",1);
	Hemi.log("Stack add (success) = " + Hemi.data.stack.service.add(oStackParent,"test-name","test-value"));
	Hemi.log("Same-parent over stack add (fail) = " + Hemi.data.stack.service.add(oStackParent,"test-name","test-value"));
	Hemi.log("Other-parent over stack add (success) = " + Hemi.data.stack.service.add(oStackParent2,"test-name","test-value"));
	Hemi.log("Stack get (success) = " + Hemi.data.stack.service.getValueByOwner(oStackParent,"test-name"));
	function IThread(){
		Hemi.prepareObject("Threadable","1.0",1,this);
		Hemi.util.logger.addLogger(this, "Thread", "Threaded Class", "400");
		this.properties.iterations = 0;
		var oThread = Hemi.util.thread.newInstance(this);
		oThread.run(10);
	}
	IThread.prototype.handle_thread_start = function(oThread){
		this.log("Thread Start");
	}
	IThread.prototype.handle_thread_stop = function(oThread){
		this.log("Thread Stop");
	}
	IThread.prototype.handle_thread_run = function(oThread){
		this.log("Thread Run " + (++this.properties.iterations));
		if(this.properties.iterations >= 3) oThread.stop();
	}	
	var oThreaded = new IThread();
	
	var sUrl = Hemi.util.url.qualifyToHost("index.html");
	Hemi.log("Url Test = \"" + sUrl + "\"");
	
	Hemi.log("Storage Test: Storage Supported: " + Hemi.storage.testStorageSupported());
	var oStore = Hemi.storage.getStorageProvider();
	Hemi.log("Storage Provider: " + oStore.storage_type);
	var sVal = (new Date()).getTime();
	Hemi.log("Storage Test: Last stored value: " + oStore.getItem("__hemi_demo_test1"));
	oStore.setItem("__hemi_demo_test1",sVal);
	
	var oConfig = Hemi.util.config.newInstance("config.xml");
	Hemi.log("Config Test: " + oConfig.getParam("appcomp_path"));
	
	/// 'ObjectsByClass' returns Space object references
	/// A Space object reference has syntax:
	///		object: o <object>
	///		config: cs <string>
	///		rid: r <string>
	/// Space objects are created for XHTMLObjects
	/// Therefore, object -> XHTMLObject.getContainer() == HTML Node
	/// And, SpaceObject.object.getContainer() == HTML Node
	///
	var aBC = Hemi.app.space.service.getPrimarySpace().getObjectsByClass("body_content");

	var oTestNode = document.createElement("div");
	aBC[0].object.getContainer().appendChild(oTestNode);
	var oObj = Hemi.object.xhtml.bind(oTestNode);
	Hemi.util.logger.addLogger(oObj, "XhtmlNode", "Xhtml Node Event", "300");
	
	oObj.log("Test Logging Facility","1.1");

	
	function WireTest1(){
		Hemi.message.service.sendMessage("Wire 1");
		return true;
	}
	
	function WireTest2(){
		Hemi.message.service.sendMessage("Wire 2");
		return true;
	}
	Hemi.wires.service.wire(window,WireTest1,window,WireTest2);
	Hemi.wires.service.invoke([],window, WireTest1);
	return;
	
	function PWireTest1(){
		Hemi.message.service.sendMessage("Pwire 1");
		return true;
	}
	function PWireTest2(){
		Hemi.message.service.sendMessage("Pwire 2");
		return true;
	}
	var oPWire = Hemi.wires.primitive.service.wire(window,PWireTest1,window,PWireTest2);
	Hemi.wires.primitive.service.invoke(oPWire);
	
	
	//var oDemoTask = Hemi.task.service.addTask("DemoTask","script","Task1","script","Task2",1);
	var vTaskClass = Hemi.namespace("MyTaskClassSpace",0,{

		MyTaskClass : function(){
			
			Hemi.include("hemi.event");
			Hemi.include("hemi.task");
			
			Hemi.prepareObject("MyTaskClass","1.0",1,this);

			Hemi.event.addScopeBuffer(this);
			this.scopeHandler("task_1", 0, 0, 1);
			this.scopeHandler("task_2", 0, 0, 1);

			this._handle_task_1 = function(){
				Hemi.message.service.sendMessage("Handle task 1");
			}
			this._handle_task_2 = function(){
				Hemi.message.service.sendMessage("Handle task 2");
			}
		}
		
	});
	var oTaskClass = new vTaskClass.MyTaskClass();
	//alert(oTaskClass.getScopeHandler("task_1"));
	//alert(oTaskClass._handle_task_1);
	var oDemoTask = Hemi.task.service.addTask("DemoTask","function",oTaskClass.getScopeHandler("task_1"),"function",oTaskClass.getScopeHandler("task_2"));
	//alert(Hemi.task.service.addTask);
	var b = Hemi.task.service.executeTask(oDemoTask);
	//alert(oDemoTask.task_state);
	var vEventClass = Hemi.namespace("MyEventClassSpace",0,{

		MyClass : function(){
			Hemi.prepareObject("MyEventClass","1.0",1,this);
			Hemi.include("hemi.event");
			Hemi.event.addScopeBuffer(this);
			this.scopeHandler("outside_test", 0, 0, 1);
			this._handle_outside_test = function(){

			}
		}
	});
	var oEventClass = new MyEventClassSpace.MyClass();
	oEventClass._prehandle_outside_test("Foo");

	var vClass = Hemi.namespace("MyClassSpace",0,{
		MyClass : function(){
			Hemi.prepareObject("MyClass","1.0",1,this);
		}
	});
	var oClass = new vClass.MyClass();

	var vAutoRegisterService = Hemi.namespace("MyServiceSpace",0,{
		service : null,
		serviceImpl : function(){
			Hemi.prepareObject("MyService","1.0",1,this);
		}
	},1);

	Hemi.namespace("MyClassSpace",0,{
		MyTransactionClass : function(){
			var t = this;
			
			Hemi.include("hemi.transaction");
			
			t.doTransaction=function(TransactionService,  TransactionPacket){
				Hemi.message.service.sendMessage("Do transaction");
				return 1;
			}			
			t.startTransaction=function(TransactionService,  TransactionPacket){
				//TransactionService.addTransactionParticipant(this, TransactionPacket);
				//TransactionPacket.setBlockStartTransaction(false);
				Hemi.message.service.sendMessage("Start transaction");
				return 1;
			}			
			t.endTransaction=function(s,p){
				Hemi.message.service.sendMessage("End transaction");
				return 0;
			}	
					
			Hemi.prepareObject("MyTransactionClass","1.0",1,t);
			Hemi.transaction.service.register(t);
			Hemi.transaction.service.openTransaction("MyTransactionClass",this,{type:0,src:0,data:0});
		}
	});

	var oTransactionClass = new vClass.MyTransactionClass();
});

//vName.MyServiceImpl =
/*
var oTest = vName.test = {};
Hemi.addObjectAccessor(oTest,"test");
oTest.addTest({'name':'foo'},"foo");
alert(oTest.getTests()[0].object_id);
*/