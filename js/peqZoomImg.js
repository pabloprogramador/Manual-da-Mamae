/*
 *
 * Copyright (c) 2012 peqZoomImg
 * pabloprogramador@gmail.com
 *
 * Licensed under a Creative Commons Attribution 3.0 License
 * 
 *
 * Version: 0.1
 */
function peqZoomImg(container, element) {
        
		
		var local = this;
		var liberaTapa = true;
		local.zoomAtual = 1;
		local.liberaGeral = true;
		local.estaTrabalhando = false;
		var estaTransformando = false;
		var fimTransformando = false;
		local.myScroll;

        var displayWidth = container.width();
        var displayHeight = container.height();

        //These two constants specify the minimum and maximum zoom
        var MIN_ZOOM = 1;
        var MAX_ZOOM = 2;

        var scaleFactor = 1;
        var previousScaleFactor = 1;

        //These two variables keep track of the X and Y coordinate of the finger when it first
        //touches the screen
        var startX = 0;
        var startY = 0;
		
		var imgX = 0;
		var imgY = 0;

        //These two variables keep track of the amount we need to translate the canvas along the X
        //and the Y coordinate
        var translateX = 0;
        var translateY = 0;

        //These two variables keep track of the amount we translated the X and Y coordinates, the last time we
        //panned.
        var previousTranslateX = 0;
        var previousTranslateY = 0;
		
		var posxIni = 0;
		var posyIni = 0;
		
		posxIni = element.position().left;
		posyIni = element.position().top;

        //Translate Origin variables
		var larguraTmp = 0;
		var alturaTmp = 0;

        var tch1 = 0, 
            tch2 = 0, 
            tcX = 0, 
            tcY = 0,
            toX = 0,
            toY = 0,
            cssOrigin = "";
		
		/*
		function iniZoom(){
			if(myScroll.scale==1){
				local.zoomAtual = 1;
				myScroll.disable();
			}
		}
*/
		var myScroll = new iScroll(container.attr('ID'), { zoom:true , bounce:false});
		
		container.bind("doubletap", function(event){
			
			//local.myScroll = new iScroll(container.attr('ID'), { zoom:true , bounce:false});
			/*
			if(local.zoomAtual==1 && local.liberaGeral && element.attr('src')!=''){
				local.myScroll = new iScroll(container.attr('ID'), { zoom:true , onZoomEnd:function(){iniZoom();}});
				local.zoomAtual==2;
				myScroll.zoom(event.touches[0].x, event.touches[0].y, local.zoomAtual);
			}
			*/
		});
		
}