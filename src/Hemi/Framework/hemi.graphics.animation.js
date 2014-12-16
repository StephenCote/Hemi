(function(){
	HemiEngine.namespace("graphics.animation", HemiEngine, {
		animateMove : function(
			o,
			iCX,
			iCY,
			iDX,
			iDY,
			bHide,
			bFadeOut,
			bFadeIn,
			bScale,
			bScaleToWidth,
			bScaleToHeight
		){
	       
			 if(!org.cote.js.registry.ObjectRegistry.isRegistered(o)) return;
		     
			 var iDistX=iDX - iCX;
			  var iDistY=iDY - iCY;
			  var iDist=Math.sqrt(Math.pow(iDistX,2) + Math.pow(iDistY,2));
			 var iSNum=iDist/this.getStatus().animate_step;
			  var iMX=iDistX/iSNum;
			  var iMY=iDistY/iSNum;
	      	
					o.getStatus().expected_x = iDX;
					o.getStatus().expected_y = iDY;
			o.getStatus().expected_h = bScaleToHeight;
			o.getStatus().expected_w = bScaleToWidth;
			  this.getStatus().animate_count++;
			  this.animateMotion(o.getObjectId(),iMX,iMY,iDX,iDY,iCX,iCY,iDist,bHide,bFadeOut,bFadeIn,bScale,bScaleToWidth,bScaleToHeight);
	        
		  },


		animateMotion : function(sId,iMX,iMY,iDX,iDY,iCX,iCY,iOrgDist,bHide,bFadeOut,bFadeIn,bScale,bScaleToWidth,bScaleToHeight){

 				var o = org.cote.js.registry.ObjectRegistry.getObject(sId);
				if(!o || o.getReadyState() != 4 || typeof o.getContainer != "function" || o.getContainer() == null) return;

			var iPerc = parseInt((Math.sqrt(Math.pow(iDX - iCX,2) + Math.pow(iDY - iCY,2)) / iOrgDist) * 100);

			if(

				Math.floor(Math.abs(iMX)) < Math.floor(Math.abs(iDX - iCX))
				||
				Math.floor(Math.abs(iMY)) < Math.floor(Math.abs(iDY - iCY))
			){
		    
				iCX+=iMX;
				iCY+=iMY;
			    
				try{

						o.getContainer().style.top = iCY + "px";
						o.getContainer().style.left = iCX + "px";
						if(bFadeOut || bFadeIn){
							o.setOpacity((bFadeIn ? 100 - iPerc : iPerc));
						}
						if(bScale){
							var iWD = o.getContainer().offsetWidth - bScaleToWidth;
							var iHD = o.getContainer().offsetHeight - bScaleToHeight;
							o.getContainer().style.width = ((o.getContainer().offsetWidth >= bScaleToWidth ? o.getContainer().offsetWidth - (iWD * (iPerc/100)) : bScaleToWidth * ((100 - iPerc)  /100))) + "px";
							o.getContainer().style.height = ((o.getContainer().offsetHeight >= bScaleToHeight ? o.getContainer().offsetHeight - (iHD * (iPerc/100)): bScaleToHeight * ((100 - iPerc)  /100))) + "px";
		    			
						}
						
						if(bFadeOut){
							if(iCY > document.documentElement.offsetHeight || iCY < 0
							||
							iCX > document.documentElement.offsetWidth || iCX < 0
							){
								if(bScale){
									o.getContainer().style.width = bScaleToWidth + "px";
									o.getContainer().style.height = bScaleToHeight + "px";
								}
								if(bHide)
								{
									o.getContainer().style.display = "none";
								}
								else if(bFadeIn){
									o.setOpacity(100);
								}
								this.getStatus().animate_count--;
								if(typeof o._handle_animation_complete == "function") o._handle_animation_complete();
								return;
							};
						}
				}
					catch(e){
						o.setStatus("Anim Error #1: " + (e.message ? e.message : e.description));
					}
 					o.getStatus().animated = 1;
			var sAFP="org.cote.js.registry.ObjectRegistry.getObject('" + this.getObjectId() + "').animateMotion('" + sId + "'," + iMX + "," + iMY + "," + iDX + "," + iDY + "," + iCX + "," + iCY + "," + iOrgDist + "," + bHide + "," + bFadeOut + "," + bFadeIn + "," + bScale + "," + bScaleToWidth + "," + bScaleToHeight + ")";
				window.setTimeout(sAFP,this.getStatus().animate_delay);
			}
			else{
				this.getStatus().animate_count--;
			    
				try{

						if(bScale){
							o.getContainer().style.width = bScaleToWidth + "px";
							o.getContainer().style.height = bScaleToHeight + "px";
						}

						if(bHide)
						{
							o.getContainer().style.display = "none";
						}
						else if(bFadeIn){
							o.setOpacity(100);
						}

						o.getContainer().style.top = iDY + "px";
						o.getContainer().style.left = iDX + "px";
    			}
					catch(e){
						this.setStatus("Anim Error #2: " + (e.message ? e.message : e.description));
					}
				if(typeof o._handle_animation_complete == "function") o._handle_animation_complete();
			}
		}	
	});
}());
