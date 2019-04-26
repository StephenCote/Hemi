this.dependencies.push("hemi.graphics.canvas");

function TestCanvas(){
	var oDiv = document.createElement("div");
	document.body.appendChild(oDiv);
	oDiv.className = "template";
	
	var oCanvas = Hemi.graphics.canvas.newInstance(oDiv);
	oCanvas.Resize(300,200);

	var oShape1 = oCanvas.Rect(25, 75, 25, 25, "#0000FF","#0000FF");
	var oShape2 = oCanvas.Rect(150, 10, 25, 25, "#0000FF","#0000FF");
	oCanvas.ConnectShapes(oShape2, oShape1);
	oCanvas.Rasterize();
	var oShape3 = oCanvas.RoundedRect(150, 50, 50, 25, "#FF00FF","#0000FF");
	
	var oShape4 = oCanvas.Ellipse(50, 10, 75, 75, "#FF0000");
	var oShape5 = oCanvas.Circle(200,25,10, "#FFFF00","#0000FF");
	// ConnectShapes currently setup only for rects
	// oCanvas.ConnectShapes(oShape4, oShape5);
	var oShape6 = oCanvas.Text("Demo text",10,10,"#000000");
	oCanvas.Rasterize();
	oCanvas.destroy();
	oDiv.parentNode.removeChild(oDiv);
}