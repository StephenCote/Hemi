
Hemi.include("hemi.ui.wideselect");
Hemi.include("hemi.css");

this._handle_clear = function(){
	this.Select.clearItems();
}

this.Initialize = function () {
    Hemi.css.loadStyleSheet(Hemi.hemi_base + "Styles/wideselect.css");
    Hemi.transaction.service.register(this, true);
    var i = this.joinTransactionPacket("console");

    this.Select = Hemi.ui.wideselect.newInstance(this.Container);

    var oSelect = this.Select;
    oSelect.setAutoScroll(1);
    this.AddControls();

    oSelect.getContainer().className = "";

    var local_container = this.Container;
    local_container.className = "notes";
    local_container.style.height = "150px";
    var aM = Hemi.message.service.getEntries();
    for (var i = 0; i < aM.length; i++) oSelect.addItem(aM[i].data);
    Hemi.message.service.subscribe("onsendmessage", function (s, v) {
        if (oSelect != null) {
            oSelect.addItem(v.message);
            /*
            var d = document.createElement("p");
            d.appendChild(document.createTextNode(v.message));
            if(local_container.firstChild) local_container.insertBefore(d, local_container.firstChild);
            else local_container.appendChild(d);
            */
        }
    });
};
this.AddControls = function(){
	var oP = document.createElement("p");
	this.Container.insertBefore(oP,this.Container.firstChild);
	var oBtn = document.createElement("input");
	oBtn.setAttribute("type","button");
	oBtn.setAttribute("value","Clear");
	
	var oBtn2 = document.createElement("input");
	oBtn2.setAttribute("type","button");
	oBtn2.setAttribute("value","Print");
	var oSelect = this.Select;

	oBtn.onclick = function(){ oSelect.clearItems();};
	oBtn2.onclick = function(){ oSelect.clearItems(); var aM = Hemi.message.service.getEntries(); for(var i = 0; i < aM.length; i++) oSelect.addItem(aM[i].data);};

	oP.appendChild(document.createTextNode("Message Level: "));
	var oLevel = document.createElement("select");
	oP.appendChild(oLevel);
	oP.appendChild(oBtn);
	oP.appendChild(oBtn2);
	var aLevels = Hemi.message.service.getLevels();
	for(var i = 0; i < aLevels.length; i++){
		oLevel.options[i] = new Option(aLevels[i],i);
		if(i == Hemi.message.service.getReportThreshold()) oLevel.selectedIndex = i;
	}
	oLevel.onchange = function(){ Hemi.message.service.setReportThreshold(oLevel.selectedIndex);};

};
this.Unload = function(){

};
