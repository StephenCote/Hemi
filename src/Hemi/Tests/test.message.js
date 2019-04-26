function TestParseMessage() {
    var sCode = "661.3";
    var oM = Hemi.message.service._createBasicMessage(sCode, "Test", Hemi.message.service.parseMessageInstruction(sCode));
    var sM = Hemi.message.service.parseMessage(oM);
    this.log("Instruction: " + oM.entry.m);
    this.log(sM);
    this.Assert(!sM.match(/Test Module/), "Invalid message decoding: " + sM);
}