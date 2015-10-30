Hemi.include("hemi.transaction");
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
	});
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
	});
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
	});
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
	});
}

/// This is expected to fail
/// The packet type changes in-flight, causing it to be redirected
///
function TestCrossUsePacketTransaction() {
	var o1 = NewTransactionObject2("Basic");
	var o2 = NewTransactionObject2("Basic");
	var o3 = NewTransactionObject2("Basic");

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
}


function TestDualMultiSelfTransaction() {
	var o1 = NewTransactionObject3("DualMultiSelf");
	var o2 = NewTransactionObject2("Basic");

	var p1 = o1.joinTransactionPacket("outerpacket");
	var p2 = o1.joinTransactionPacket("testpacket");
	var p3 = o2.joinTransactionPacket("testpacket");

	o1.destroy();
	o2.destroy();
}


function TestSelfTransaction() {
	var o = NewTransactionObject1("Basic");
	var p = o.joinTransactionPacket("testpacket");
	this.Assert(p, "Object did not join packet");
	o.serveTransaction("testpacket1", "1", 1);
	this.Assert(o.getProperties().handle_1, "Packet was not handled");
	o.destroy();
}

function TestDualNonSelfTransaction() {
	var o1 = NewTransactionObject1("Basic");
	var o2 = NewTransactionObject1("Basic");
	var p1 = o1.joinTransactionPacket("testpacket");
	var p2 = o2.joinTransactionPacket("testpacket");
	this.Assert(p1 && p2, "Objects did not join packet");
	o1.serveTransaction("testpacket1", "1");
	this.Assert(!o1.getProperties().handle_1, "Packet was not supposed to be handled");
	this.Assert(o2.getProperties().handle_1, "Packet was supposed to be handled");
	o1.destroy();
	o2.destroy();
}
function TestDualSelfTransaction() {
	var o1 = NewTransactionObject1("Basic");
	var o2 = NewTransactionObject1("Basic");
	var p1 = o1.joinTransactionPacket("testpacket");
	var p2 = o2.joinTransactionPacket("testpacket");
	this.Assert(p1 && p2, "Objects did not join packet");
	o1.serveTransaction("testpacket1", "1", 1);
	this.Assert(o1.getProperties().handle_1, "Packet was supposed to be handled");
	this.Assert(o2.getProperties().handle_1, "Packet was supposed to be handled");
	o1.destroy();
	o2.destroy();
}

function TestDualSelfCleanupTransaction() {
	var o1 = NewTransactionObject1("Basic");
	var o2 = NewTransactionObject1("Basic");
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
}


function TestMultiSelfTransaction() {
	var o1 = NewTransactionObject2("Basic");
	var o2 = NewTransactionObject2("Basic");
	var p1 = o1.joinTransactionPacket("testpacket");
	var p2 = o2.joinTransactionPacket("testpacket");
	this.Assert(p1 && p2, "Objects did not join packet");
	o2.serveTransaction("testpacket1", "1", 1);
	o1.serveTransaction("testpacket1", "1", 1);
	this.Assert(o1.getProperties().handle_2, "Packet was supposed to be handled");
	this.Assert(o2.getProperties().handle_2, "Packet was supposed to be handled");
	o1.destroy();
	o2.destroy();
}

function TestEndTransaction() {
	var o1 = NewTransactionObject1("Basic");
	var o2 = NewTransactionObject4("Basic");
	o1.joinTransactionPacket("testpacket1");
	o2.joinTransactionPacket("testpacket1");
	o1.serveTransaction("testpacket1", "1", 1);
	this.Assert(o1.getProperties().handle_1, "Packet was supposed to be handled");
	this.Assert(o2.getProperties().handle_1, "Packet was supposed to be handled");
	o1.serveTransaction("testpacket1", "1", 1);
	this.Assert(o1.getProperties().handle_1==1, "Packet was supposed to be handled only once");
	this.Assert(o2.getProperties().handle_1==2, "Packet was supposed to be handled twice");
}
