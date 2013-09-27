(function () {
    HemiEngine.app.module.service.Register("test.object", { impl: function () {

        this.Assert = function (b, m) { if (!b) { throw m; } }; HemiEngine.object.addObjectAccessor(this, "test"); HemiEngine.util.logger.addLogger(this, "Test Module", "Test Module Service", "621"); this.TestMembers = ["TestNewFrameworkObject", "TestPrepareFrameworkObject"]; this.getReport = function () { var a = ["test.object Test Results"], m = this.getTests(), i = 0, r; for (; i < m.length; ) { r = m[i++]; var rt = parseInt((r.stop_time.getTime() - r.start_time.getTime()) / 1000); a.push('Test: ' + r.name + ' (' + rt + ' sec)\n\tErrors: ' + (r.error ? 'Yes' : 'No') + '\n\tMessages:'); for (var p = 0; p < r.messages.length; p++) { a.push('\n\t\t' + r.messages[p]); } } return a.join('\n'); }; this._ST = function (n) { this.logDebug("Start Test " + n); var o = { name: n, start_time: (new Date()), stop_time: 0, messages: [], result: 0, error: 0, status: 0 }; this.addNewTest(o, n); return o; }; this._SP = function (o, a) { if (a == true) this.log("Test test.object." + o.name + " Succeeded"); else this.logWarning("Test test.object." + o.name + " Failed"); this.logDebug("Stop Test test.object"); o.stop_time = (new Date()); o.result = a; }; this._AM = function (o, a) { this.log("Test Message test.object: " + a); o.messages.push(a); }; this.RunTest = function (s) { var e = "test.object", f = "_X_" + s; if (!this[f]) { this.logError("Invalid test: " + f); return false; } return this[f](); }; this.RunTests = function () { Hemi.task.service.executeTaskByName(this.getProperties().ts); var e = "test.object", i = 0; for (; i < this.TestMembers.length; i++) { this.RunTest(this.TestMembers[i]); } }; this._TS = function (o, s) { o.status = s; if (DATATYPES.TF(this.objects.th)) this.objects.th(this, o, s); }; this._X_TestNewFrameworkObject = function () { var o = this._ST("TestNewFrameworkObject"); var b = false; try { this._TS(o, 1); b = TestNewFrameworkObject.apply(this, [o]); this._TS(o, 2); if (DATATYPES.TU(b)) b = true; } catch (e) { this._AM(o, e); o.error = 1; } this._TS(o, 3); if (b) { EndTestNewFrameworkObject(b); }; return o; };
        function EndTestNewFrameworkObject(b) { var o = Module.getTestByName("TestNewFrameworkObject"); Module._SP(o, b); Module._TS(o, 4); Hemi.task.service.returnDependency("TestSuite-" + Module.getObjectId() + "-TestNewFrameworkObject"); }
        this._X_TestPrepareFrameworkObject = function () { var o = this._ST("TestPrepareFrameworkObject"); var b = false; try { this._TS(o, 1); b = TestPrepareFrameworkObject.apply(this, [o]); this._TS(o, 2); if (DATATYPES.TU(b)) b = true; } catch (e) { this._AM(o, e); o.error = 1; } this._TS(o, 3); if (b) { EndTestPrepareFrameworkObject(b); }; return o; };
        function EndTestPrepareFrameworkObject(b) { var o = Module.getTestByName("TestPrepareFrameworkObject"); Module._SP(o, b); Module._TS(o, 4); Hemi.task.service.returnDependency("TestSuite-" + Module.getObjectId() + "-TestPrepareFrameworkObject"); }
        Hemi.include("hemi.object");
        function TestNewFrameworkObject(oTest) {
            var bDest = 0;
            var oObject = Hemi.newObject("SomeObject", "1.0", 1, 1, {
                object_prepare: function () {
                    this.getProperties().prepared = 1;
                },
                object_create: function () {
                    this.getProperties().created = 1;
                },
                object_destroy: function () {
                    bDest = 1;
                }
            });

            this.Assert(oObject.getProperties().prepared, "Object is not prepared");
            this.Assert(oObject.getProperties().created, "Object is not created");

            oObject.destroy();

            this.Assert(bDest && oObject.getReadyState() == 5, "Object is not destroyed.  bDest=" + (!bDest) + "/RS=" + (oObject.getReadyState() < 5));
        }

        function TestPrepareFrameworkObject(oTest) {
            var bDest = 0;
            var oObject = {
                object_prepare: function () {
                    this.getProperties().prepared = 1;
                },
                object_create: function () {
                    this.getProperties().created = 1;
                },
                object_destroy: function () {
                    bDest = 1;
                }
            }
            Hemi.prepareObject("SomeObject", "1.0", 1, oObject, 1);


            this.Assert(oObject.getProperties().prepared, "Object is not prepared");
            this.Assert(!oObject.getProperties().created, "Object should not have been created");

            oObject.destroy();

            this.Assert(bDest && oObject.getReadyState() == 5, "Object is not destroyed.  bDest=" + (!bDest) + "/RS=" + (oObject.getReadyState() < 5));
        } this.Component = null; this.Container = null; var Module = null; this.name = "test.object"; this.object_prepare = function () { Module = this; };
        this.object_destroy = function () {  if (DATATYPES.TF(this.Unload)) { this.Unload(); } }; HemiEngine.prepareObject("module", "%FILE_VERSION%", 1, this, 1); this.ready_state = 4;
    }
    });
} ());