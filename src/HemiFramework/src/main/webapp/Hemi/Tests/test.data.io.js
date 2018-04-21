Hemi.include("hemi.data.io");
function GetSyncProviderTemplate() {
    return Hemi.newObject("sync_data_io", "1.0", 1, 1, {
        handle_io_register: function (oService) {
            this.getProperties().isRegistered = 1;
        },
        handle_io_unregister: function (oService) {
            this.getProperties().isRegistered = 0;
        },
        handle_io_open_request: function (oService, oSubject, oRequest, oResponse) {
            this.getProperties().requestOpened = 1;
        },
        handle_io_close_request: function (oService, oSubject, oRequest, oResponse) {
            this.getProperties().requestClosed = 1;
        },
        handle_io_request: function (oService, oSubject, oRequest, oResponse) {
            this.getProperties().request = 1;

            return 1;
        }

    });
}

function GetAsyncProviderTemplate() {
    return Hemi.newObject("async_data_io", "1.0", 1, 1, {
        object_create: function () {

        },
        handle_io_register: function (oService) {
            this.getProperties().isRegistered = 1;
        },
        handle_io_unregister: function (oService) {
            this.getProperties().isRegistered = 0;
        },
        handle_io_open_request: function (oService, oSubject, oRequest, oResponse) {
            this.getProperties().requestOpened = 1;
        },
        handle_io_close_request: function (oService, oSubject, oRequest, oResponse) {
            this.getProperties().requestClosed = 1;
        },
        handle_io_request: function (oService, oSubject, oRequest, oResponse) {
            this.getProperties().request = 1;

            return 0;
        },
        requestCatalogList: function (oService, oSubject, oRequest, oResponse) {
            /// alert('cat list');
        }

    });
}


function TestDataIOProviderGetList(oTest) {
    
    var oProvider = GetAsyncProviderTemplate();
    Hemi.data.io.service.register(oProvider);
    oProvider.getProperties().useRegisteredApi = 1;
    oProvider.implement("Catalog", "List");
    var oResp = Hemi.data.io.service.getList(Hemi.data.io.service.getBusType().ONLINE, "HemiFramework","DataFiles", "Components", "List");
    Hemi.data.io.service.unregister(oProvider);
    this.AssertCleanup(oProvider);    

}


function TestDataIOClose(oTest) {

    var oProvider = GetAsyncProviderTemplate();

    Hemi.data.io.service.register(oProvider);
    var oReqs = Hemi.data.io.service.getList(Hemi.data.io.service.getBusType().ONLINE, "HemiFramework","DataFiles", "Components", "List");

    this.AssertAsyncProvider(oProvider, oReqs);

    Hemi.data.io.service.continueRequest(oReqs.id, oProvider, 1);

    Hemi.data.io.service.unregister(oProvider);
    this.AssertCleanup(oProvider);    
}

this.AssertCleanup = function (oProvider) {
    var oCheck = Hemi.data.io.service.getProviderByName(oProvider.getObjectId());
    this.Assert(!oCheck, "Provider was not cleaned up from service");
};

this.AssertAsyncProvider = function (oProvider, oReqs) {
    this.Assert(oProvider.getProperties().requestOpened, "Request was not opened for provider");
    this.Assert(oProvider.getProperties().request, "Request was not made for provider");
    this.Assert(!oProvider.getProperties().requestClosed, "Async request was closed");
    var oPacket = Hemi.data.io.service.getPacket(oReqs.transactionName);
    this.Assert(oPacket && !oPacket.is_finalized, "Request transaction '" + oReqs.transactionName + "' should still be open.");
};
this.AssertSyncProvider = function (oProvider, oReqs) {
	var oPacket = Hemi.data.io.service.getPacket(oReqs.transactionName);
	/// Note: Packet may still exist in a finalized state; need to check cleanup
	//
	this.Assert(!oPacket || oPacket.is_finalized, "Request transaction " + oReqs.transactionName + " should have been completed and the packet cleaned up.");
	this.Assert(oProvider.getProperties().requestOpened, "Request was not opened for provider");
	this.Assert(oProvider.getProperties().request, "Request was not made for provider");
	this.Assert(oProvider.getProperties().requestOpened, "Request was not closed for provider");

};
/*
Bus, Context, Catalog, Request, Async, Handler
*/
function TestDataIOAsyncOpenTransaction(oTest) {

    var oProvider = GetAsyncProviderTemplate();
    Hemi.data.io.service.register(oProvider);
    var oReqs = Hemi.data.io.service.getList(Hemi.data.io.service.getBusType().ONLINE, "HemiFramework", "DataFiles", "Components", "List");
    this.AssertAsyncProvider(oProvider, oReqs);
    Hemi.data.io.service.continueRequest(oReqs.id, oProvider, 1);
    Hemi.data.io.service.unregister(oProvider);
    this.AssertCleanup(oProvider);
    return false;
}
function TestDataIOAsyncCompleteTransaction(oTest) {
    EndTestDataIOAsyncOpenTransaction(true);
}

function TestDataIOOpenRequestTransaction(oTest) {
    var oProvider = GetSyncProviderTemplate();
    Hemi.data.io.service.register(oProvider);
    var oReqs = Hemi.data.io.service.getList(Hemi.data.io.service.getBusType().ONLINE, "HemiFramework", "DataFiles", "Components", "List");

    this.AssertSyncProvider(oProvider, oReqs);
    Hemi.data.io.service.unregister(oProvider);
    this.AssertCleanup(oProvider);  
}
function TestDataIOBussedTransaction(oTest) {
    /// THis test is not supposed to make any actual request as the bus is crossed.
    var oProvider = GetSyncProviderTemplate();

    var b1 = Hemi.data.io.service.register(oProvider, Hemi.data.io.service.getBusType().STATIC);

    var oResp = Hemi.data.io.service.getList(Hemi.data.io.service.getBusType().ONLINE, "HemiFramework", "DataFiles", "Components", "List");

    this.Assert(!oProvider.getProperties().requestOpened, "Request was opened for provider");
    this.Assert(!oProvider.getProperties().request, "Request was made for provider");

    Hemi.data.io.service.unregister(oProvider);
}

function TestDataIOProviderDirtyCleanup(oTest) {

    var oProvider = GetSyncProviderTemplate();
    var b1 = Hemi.data.io.service.register(oProvider);
    this.Assert((b1), "Provider was not registered");
    this.Assert(oProvider.getProperties().isRegistered, "Provider did not receive registration callback");
    this.Assert(!(Hemi.data.io.service.register(oProvider)), "Provider was registered twice");
    var oCheck = Hemi.data.io.service.getProvider(sId);
    this.Assert(!oCheck, "Provider was retrieved from service");
    var sId = oProvider.getObjectId();
    oProvider.destroy();
    oCheck = Hemi.data.io.service.getProvider(sId);
    this.Assert(!oCheck, "Provider was not cleaned up from service");
    /// Don't check unregistered property here because the post destroy action is to flush all the properties
    /// from the object
    /// this.Assert(!oProvider.getProperties().isRegistered, "Provider did not receive unregistration callback");
}

function TestDataIOProviderCleanCleanup(oTest) {

    var oProvider = GetSyncProviderTemplate();
    var b1 = Hemi.data.io.service.register(oProvider);
    this.Assert((b1), "Provider was not registered");
    var oCheck = Hemi.data.io.service.getProvider(sId);
    this.Assert(!oCheck, "Provider was retrieved from service");
    var sId = oProvider.getObjectId();
    Hemi.data.io.service.unregister(oProvider);
    oCheck = Hemi.data.io.service.getProvider(sId);
    this.Assert(!oCheck, "Provider was not cleaned up from service");
    this.Assert(!oProvider.getProperties().isRegistered, "Provider did not receive unregistration callback");
    oProvider.destroy();
}
