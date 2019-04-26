this.dependencies.push("hemi.transaction");
function NewTransactionObject1(sName) {
	return Hemi.newObject(sName, "1.0", 1, 1, {
		object_create: function () {
			Hemi.transaction.service.register(this, 1);
			this.getProperties().handle_1 = 0;
		},
		_handle_testpacket1: function (s, v) {
			Module.log("Handle test 1 #" + v.data.src);
			this.getProperties().handle_1++;
			return true;
		}
	}).getObjects().promise;
}

function NewTransactionObject2(sName) {
	return Hemi.newObject(sName, "1.0", 1, 1, {
		object_create: function () {
			Hemi.transaction.service.register(this, 1);
			this.getProperties().handle_1 = 0;
			this.getProperties().handle_2 = 0;

		},
		serveTestPacket2: function () {
			this.serveTransaction("testpacket2", "2");
		},
		_handle_testpacket1: function (s, v) {
			Module.log("Handle test 1 #" + v.data.src);
			this.serveTestPacket2();
			this.getProperties().handle_1++;
		},
		_handle_testpacket2: function (s, v) {
			Module.log("Handle test 2 #" + v.data.src);
			this.getProperties().handle_2++;
		}
	}).getObjects().promise;
}
function NewTransactionObject3(sName) {
	return Hemi.newObject(sName, "1.0", 1, 1, {
		object_create: function () {
			Hemi.transaction.service.register(this, 1);
		},
		object_destroy: function () {
			if (this.getObjects().ptr) this.getObjects().ptr.destroy();
		},
		_handle_testpacket2: function (s, v) {
			this.getProperties().handle_2 = 1;
		},
		_handle_outerpacket1: function (s, v) {
			Module.log("Handle test 1 #" + v.data.src);
			if (!this.getObjects().ptr) {
				this.getObjects().ptr = NewTransactionObject1("InnerBasic");
				this.getObjects().ptr.joinTransactionPacket("testpacket");
				this.serveTransaction("testpacket1");
			}
			// this.joinTransactionPacket("testpacket");

			this.serveTestPacket2();
			this.getProperties().handle_1 = 1;
		}
	}).getObjects().promise;
}

function NewTransactionObject4(sName) {
	return Hemi.newObject(sName, "1.0", 1, 1, {
		object_create: function () {
			Hemi.transaction.service.register(this, 1);
			this.getProperties().handle_1 = 0;
		},
		_handle_testpacket1: function (s, v) {
			Module.log("Handle test 1 #" + v.data.src);
			this.getProperties().handle_1++;
		}
	}).getObjects().promise;
}

/// This is expected to fail
/// The packet type changes in-flight, causing it to be redirected
///
function TestCrossUsePacketTransaction() {
	var ob1 = NewTransactionObject2("Basic");
	var ob2 = NewTransactionObject2("Basic");
	var ob3 = NewTransactionObject2("Basic");
	Promise.all([ob1,ob2,ob3]).then((aO)=>{
		var o1 = aO[0];
		var o2 = aO[1];
		var o3 = aO[2];
		o1.joinTransactionPacket("testpacket");
		o2.joinTransactionPacket("testpacket");
		o3.joinTransactionPacket("testpacket");
		o1.serveTransaction("testpacket1", "1", 1);
		var p1 = o1.getPacket("testpacket");
		this.log("Packet type: " + p1.data.type);
		this.Assert(o2.getProperties().handle_1, "Packet was not handled");
		this.Assert(o3.getProperties().handle_1, "Packet was not handled");
	
		o1.destroy();
		o2.destroy();
		EndTestCrossUsePacketTransaction(true);
	});
	return false;
}


function TestDualMultiSelfTransaction() {
	var ob1 = NewTransactionObject3("DualMultiSelf");
	var ob2 = NewTransactionObject2("Basic");

	Promise.all([ob1,ob2]).then((aO)=>{
		var o1 = aO[0];
		var o2 = aO[1];

		var p1 = o1.joinTransactionPacket("outerpacket");
		var p2 = o1.joinTransactionPacket("testpacket");
		var p3 = o2.joinTransactionPacket("testpacket");
	
		o1.destroy();
		o2.destroy();
		EndTestDualMultiSelfTransaction(true);
	});
	return false;
}


function TestSelfTransaction() {
	var ob = NewTransactionObject1("Basic");
	ob.then((o)=>{
		var p = o.joinTransactionPacket("testpacket");
		this.Assert(p, "Object did not join packet");
		o.serveTransaction("testpacket1", "1", 1);
		this.Assert(o.getProperties().handle_1, "Packet was not handled");
		o.destroy();
		EndTestSelfTransaction(true);
	});
	return false;
}

function TestDualNonSelfTransaction() {
	var ob1 = NewTransactionObject1("Basic");
	var ob2 = NewTransactionObject1("Basic");
	Promise.all([ob1,ob2]).then((aO)=>{
		var o1 = aO[0];
		var o2 = aO[1];
			
		var p1 = o1.joinTransactionPacket("testpacket");
		var p2 = o2.joinTransactionPacket("testpacket");
		this.Assert(p1 && p2, "Objects did not join packet");
		o1.serveTransaction("testpacket1", "1");
		this.Assert(!o1.getProperties().handle_1, "Packet was not supposed to be handled");
		this.Assert(o2.getProperties().handle_1, "Packet was supposed to be handled");
		o1.destroy();
		o2.destroy();
		EndTestDualNonSelfTransaction(true);
	});
	return false;
}
function TestDualSelfTransaction() {
	var ob1 = NewTransactionObject1("Basic");
	var ob2 = NewTransactionObject1("Basic");
	Promise.all([ob1,ob2]).then((aO)=>{
		var o1 = aO[0];
		var o2 = aO[1];
		
		var p1 = o1.joinTransactionPacket("testpacket");
		var p2 = o2.joinTransactionPacket("testpacket");
		this.Assert(p1 && p2, "Objects did not join packet");
		o1.serveTransaction("testpacket1", "1", 1);
		this.Assert(o1.getProperties().handle_1, "Packet was supposed to be handled");
		this.Assert(o2.getProperties().handle_1, "Packet was supposed to be handled");
		o1.destroy();
		o2.destroy();
		EndTestDualSelfTransaction(true);
	});
	return false;
}

function TestDualSelfCleanupTransaction() {
	var ob1 = NewTransactionObject1("Basic");
	var ob2 = NewTransactionObject1("Basic");
	Promise.all([ob1,ob2]).then((aO)=>{
		var o1 = aO[0];
		var o2 = aO[1];
		var p1 = o1.joinTransactionPacket("testpacket");
		var p2 = o2.joinTransactionPacket("testpacket");
		this.Assert(p1 && p2, "Objects did not join packet");
		o1.serveTransaction("testpacket1", "1", 1);
		o1.getProperties().handle_1 = 0;
		o2.getProperties().handle_1 = 0;
		o1.removeFromTransactionPacket("testpacket");
		o2.serveTransaction("testpacket1", "1", 1);
		this.Assert(!o1.getProperties().handle_1, "Packet was not supposed to be handled");
		this.Assert(o2.getProperties().handle_1, "Packet was supposed to be handled");
		o1.destroy();
		o2.destroy();
		EndTestDualSelfCleanupTransaction(true);
	});
	return false;
}


function TestMultiSelfTransaction() {
	var ob1 = NewTransactionObject2("Basic");
	var ob2 = NewTransactionObject2("Basic");
	Promise.all([ob1,ob2]).then((aO)=>{
		var o1 = aO[0];
		var o2 = aO[1];
		var p1 = o1.joinTransactionPacket("testpacket");
		var p2 = o2.joinTransactionPacket("testpacket");
		this.Assert(p1 && p2, "Objects did not join packet");
		o2.serveTransaction("testpacket1", "1", 1);
		o1.serveTransaction("testpacket1", "1", 1);
		this.Assert(o1.getProperties().handle_2, "Packet was supposed to be handled");
		this.Assert(o2.getProperties().handle_2, "Packet was supposed to be handled");
		o1.destroy();
		o2.destroy();
		EndTestMultiSelfTransaction(true);
	});
	return false;
}

function TestEndTransaction() {
	var ob1 = NewTransactionObject1("Basic");
	var ob2 = NewTransactionObject4("Basic");
	Promise.all([ob1,ob2]).then((aO)=>{
		var o1 = aO[0];
		var o2 = aO[1];
//		window.dbgObj = o1;
//		window.dbgObjs = aO;
		o1.joinTransactionPacket("testpacket1");
		o2.joinTransactionPacket("testpacket1");
		o1.serveTransaction("testpacket1", "1", 1);
		this.Assert(o1.getProperties().handle_1, "Packet was supposed to be handled");
		this.Assert(o2.getProperties().handle_1, "Packet was supposed to be handled");
		o1.serveTransaction("testpacket1", "1", 1);
		this.Assert(o1.getProperties().handle_1==1, "Packet was supposed to be handled only once");
		this.Assert(o2.getProperties().handle_1==2, "Packet was supposed to be handled twice");
		EndTestEndTransaction(true);
	});
	return false;
}
window.debugTest = this;
this.debugObject = NewTransactionObject1;
