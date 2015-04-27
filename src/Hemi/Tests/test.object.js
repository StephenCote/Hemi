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
}