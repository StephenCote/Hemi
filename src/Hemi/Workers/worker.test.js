var g_hold_note = 0;

this.Initialize = function () {

};

function test() {
    postMessage(g_hold_note);
};

function onmessage(v) {
    ///postMessage("Received: " + v.data);
    g_hold_note = v.data;
    setTimeout(test, 1000);
};
