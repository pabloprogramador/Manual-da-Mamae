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

        container = container.hammer({
            prevent_default: true,
            scale_treshold: 0,
            drag_min_distance: 0
        });
		
		var local = this;
		var liberaTapa = true;
		local.zoomAtual = 1;
		local.liberaGeral = true;
		local.estaTrabalhando = false;
		var estaTransformando = false;
		var fimTransformando = false;
		

        //element = element;
		element.gxInit({queue: 'cancel'});

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
		
		
		container.bind("doubletap", function(event){
			//$('#aux').append(element.attr('src'));
			
			//fimTrans(event);
			//$('#aux').append('duplo');
			if(liberaTapa && local.liberaGeral && element.attr('src')!=''){
				//$('#aux').append(">"+element.attr('src')+"<");
				local.estaTrabalhando = true;
				liberaTapa = false;
				var aux;
				if(scaleFactor != 1){
					aux = 1;
				}else{
					if(element.position().top==0 && element.position().left==0){
						aux = 2;
					}else{
						aux = 1;
					}
				}
				
				local.zoomAtual = aux;
				
				scaleFactor = aux;
				var posx = -event.touches[0].x;
				var posy = -event.touches[0].y;

				if(aux == 1 ){
					posy = posx = 0;
				}
				element.gx({'width': container.width() * aux, 'left':posx , 'top':posy , 'height': container.height() * aux}, 700, 'Sine:Out', function(){liberaTapa = true; local.estaTrabalhando = false;})
				local.zoomAtual = scaleFactor;
				previousScaleFactor = scaleFactor;
			}
		});
		
		
		container.bind("dragstart", function(ev){
		//$('#aux').append('ini_drag ');
			if(scaleFactor > 1 && liberaTapa==true){
				local.estaTrabalhando = true;
				posxIni = element.position().left;
				posyIni = element.position().top;
			}
		});
		
		container.bind("drag", function(ev){
			//alert('aqui');
			//$('#aux').append('drag ');
			if(scaleFactor > 1 && liberaTapa==true){
				local.estaTrabalhando = true;
				element.css({left: posxIni + ev.distanceX});
				element.css({top: posyIni + ev.distanceY});
				//$('#aux').html(ev.distanceX);
			}
		});
		
		container.bind("dragend", function(ev){
			//$('#aux').append('end_drag ');
			if(!estaTransformando){
				ajeitaEixo();
			}
		});
		
	
		
		
		  element.mousemove(function(e){
      			//$('#aux').html(e.pageX - this.offsetLeft);
				imgX = e.pageX - this.offsetLeft;
				imgY = e.pageY - this.offsetTop;
   			}); 

		
        container.bind("transformstart", function(event){
			//alert('ok');
			//$('#aux').append('ini_trans ');
			local.estaTrabalhando = true;
			previousScaleFactor = scaleFactor;
            liberaTapa = false;
			estaTransformando=true;
			posxIni = imgX;
			posyIni = imgY;
			toX = event.touches[0].x;
			toY = event.touches[0].y;
			
			var larguraTmp = element.width();
			var alturaTmp = element.height();
        });
		

        container.bind("transform", function(event) {
			if(local.liberaGeral){
				if(!estaTransformando){
					estaTransformando=true;
					local.estaTrabalhando = true;
				}
				scaleFactor = previousScaleFactor * event.scale;
				
				if(scaleFactor > MAX_ZOOM){
					scaleFactor = MAX_ZOOM;
				}

				var posx = (posxIni - ((toX * scaleFactor) - toX));
				var posy = (posyIni - ((toY * scaleFactor) - toY));
				//$('#aux').append('trans_x '+posx);
				element.css({
					left: posx,
					top: posy,
					width:container.width()*scaleFactor,
					height:container.height()*scaleFactor
				});
				fimTransformando = true;
			}
			
        });

        container.bind("transformend", function(event) {
			//$('#aux').append('fimtrans');
			if(fimTransformando){
				fimTrans(event);
			}
			//ajeitaEixo;
        });
		
		container.bind("swipe", function(event) {
			//$('#aux').append('swipe');
			if(fimTransformando){
				fimTrans(event);
			}
        });
		
		container.bind("release", function(event) {
			//$('#aux').append('release');
			if(fimTransformando){
				fimTrans(event);
			}
        });
		
		function ajeitaEixo(){
			if(scaleFactor != 1){
			//$('#aux').html(element.position().left +' < '+(-(container.width() * scaleFactor)/2) + ' = ' + scaleFactor);
	
			var posx = element.position().left;
			var posy = element.position().top;
				
				
			if(element.position().left < -container.width() ){
					posx = -container.width();
					liberaTapa = false;
			}
				
			if(element.position().top < -container.height()){
					posy = -container.height();
					liberaTapa = false;
			}
			///////////**************
			if(element.position().left > 0){
					posx = 0;
					liberaTapa = false;
			}
			
			if(element.position().top > 0){
					posy = 0;
					liberaTapa = false;
			}
			
			
			element.gx({'left': posx, 'top': posy }, 400, 'Back:Out', function(){liberaTapa = true; local.estaTrabalhando = false;});
			}
		}
		function fimTrans(e){
			//$('#aux').append('fimTransformando ');
					if(fimTransformando){
						//$('#aux').append('dentro '+event.touches.length+'] ');
							fimTransformando = false;
						
							//toX = event.touches[0].x;
							//toY = event.touches[0].y;
							
									if(scaleFactor < 1.3){
										//$('#aux').append('fimTransformando_2 ');
										scaleFactor = 1;
										var aux = scaleFactor;
										//$('#aux').append('fim_trans '+scaleFactor);
										element.gx({'width': container.width() * aux, 'left':0 , 'top':0 , 'height': container.height() * aux}, 300, 'Sine:Out', function(){liberaTapa = true; estaTransformando = false; local.estaTrabalhando = false;}) 
										}else{
													if(scaleFactor > MAX_ZOOM){
														scaleFactor = MAX_ZOOM;
														var aux = scaleFactor;
														
													var posx = (imgX - ((toX * scaleFactor) - toX));
													var posy = (imgY - ((toY * scaleFactor) - toY));
													
														element.gx({'width': container.width() * aux, 'height': container.height() * aux}, 300, 'Sine:Out', function(){liberaTapa = true; estaTransformando = false; local.estaTrabalhando = false;}) 
													}else{
														
														liberaTapa = true;
														estaTransformando = false;
														local.estaTrabalhando = false;
													}
									}
									local.zoomAtual = scaleFactor;
									previousScaleFactor = scaleFactor;
					}
		}
}