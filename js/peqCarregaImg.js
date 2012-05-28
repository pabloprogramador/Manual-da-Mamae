/*
 *
 * Copyright (c) 2012 peqRevista
 * pabloprogramador@gmail.com
 *
 * Licensed under a Creative Commons Attribution 3.0 License
 * 
 *
 * Version: 0.1
 */
function peqCarregaImg(este, num, total, end, msgStatus) {
		
		//iniPagina(num);
		//este.children('div').children('img').css({opacity:0});

		function carregaPagina(e){

			este.children('div:nth-child('+e+')').find('img').load(function(){
			este.children('div:nth-child('+e+')').find('div').hide();
			este.children('div:nth-child('+e+')').find('img').show();
			este.children('div:nth-child('+e+')').find('img').gx({'opacity':1}, 500);
				if(e < total){
					/*
					var pausa = (e == 1) ? 1 : (Math.random()*9000)+5000;
					este.children('div:nth-child('+e+')').find('div').gx(null, pausa, '', function(){iniPagina(e+1);} );
					*/
					iniPagina(e+1);
				}
			});
		}

		function iniPagina(e){
			//este.children('div:nth-child('+e+')').find('div').html(msgStatus);
			//este.children('div:nth-child('+e+')').find('img').hide();
			este.children('div:nth-child('+e+')').find('div').hide();
			este.children('div:nth-child('+e+')').find('img').attr({src: end+e+".jpg"});

	
			
			//carregaPagina(e);
	
			//$("#aux").html(teste);
			//este.children('div:nth-child('+e+')').find('img').gx
			
		}
		
		for(i = num; i < total; i++){
			iniPagina(i);
		}
};