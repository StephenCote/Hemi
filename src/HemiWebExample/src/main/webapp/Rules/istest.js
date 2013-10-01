function TestIsTest(oTest){
	this.log("Testing the test rule");
	this.Assert(true, "True isn't true");
	oTest.data = true;
}
