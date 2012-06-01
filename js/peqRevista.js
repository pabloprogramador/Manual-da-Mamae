/*
 * jQuery peqRevista
 *
 * Copyright (c) 2012 peqRevista
 * pabloprogramador@gmail.com
 *
 * Licensed under a Creative Commons Attribution 3.0 License
 * 
 *
 * Version: 0.1
 */
$.fn.peqRevista = function (configuracao) {
	configuracao = jQuery.extend({
						atual:1,
						padraoSrc:'img/MANUAL DA MAMAE GYN 2012 - ',
						padraoSrcMini:'img/MANUAL DA MAMAE GYN 2012 - ',
						quantidade:8,
				}, configuracao);
				

				atual = configuracao.atual;
				var este = $(this);
				var largura = este.width();
				var altura = este.height();
				var folhasQt = configuracao.quantidade;
				var liberaMorte = true;
				var liberaProxima = true;
				var i = 0;
				var dentroDiv = '';
				var dentroMini = '';
				var dentroNav = '';
				var dentroNav = '';
				var ativaDrag = false;
				navegacaoAtual = false;
				miniAtual = false;
				var listaZoom = {};
				var escuro = false;
				
				var NavScroll;
				var MiniScroll;
				
				$("#mini").css({top:altura, height:altura-100});
				$("#navegacao").css({top:altura});
				
				
				navegacao = function() {
					if(!navegacaoAtual){
						abreNav();
					}else{
						fechaNav();
					}
				}
				
				miniatura = function(){
					if(!miniAtual){
						abreMini();
					}else{
						fechaMini();
					}
				}
				
				
				passaPagina = function(e){
					//alert(e + ' - ' +atual)
					if(e > 0 && e <= folhasQt){
						fechaTudo();
						//fechaSub();
						passa(e, 'auto');
					}
				}
				
				passaPaginaMini = function(e){
					//alert(e + ' - ' +atual)
					if(e > 0 && e <= folhasQt){
						fechaTudo();
						fechaSub();
						passa(e, 'auto');
					}
				}
				
				passaPaginaNav = function(e){
					//alert(e + ' - ' +atual)
					if(e > 0 && e <= folhasQt){
						//fechaTudo();
						//fechaSub();
						passa(e, 'auto');
					}
				}
				
				function fechaTudo(){
					
					fechaMini();
					fechaNav();
				}
				
				function fechaMini(){
					if(MiniScroll!=undefined){MiniScroll.destroy();}
					$("#mini").gx({'top': altura}, 300);
					miniAtual = false;
					//ativaScroll();
				}
				
				function fechaNav(){
					if(NavScroll!=undefined){NavScroll.destroy();}
					$("#navegacao").gx({'top': altura}, 300);
					navegacaoAtual = false;
				}
				
				function abreMini(){
					fechaTudo();
					$("#mini").gx({'top': 50}, 500);
					miniAtual = true;
					//desativaScroll();
					MiniScroll = new iScroll('mini');
					
					//MiniScroll = new iScroll('mini');
				}
				
				function abreNav(){
					fechaTudo();
					//$("#navegacaoC").show();
					$("#navegacao").gx({'top': altura-220}, 300);
					navegacaoAtual = true;
					//desativaScroll();
					NavScroll = new iScroll('navegacao');
					
				}
				
				$("#mini").gxInit({queue: 'cancel'});
				$("#navagecao").gxInit({queue: 'cancel'});
				
				
				$("body").bind("dragstart", function() { 
        			return false; 
				});


				for(i = 1; i <= folhasQt ; i++){
					//new iScroll("folha"+i);
					//listaZoom[i] = new iScroll('folha'+i, { zoom:true , bounce:true});
					//listaZoom[i].disable();
dentroDiv += '<div id="folha'+i+'" class="folhas"><div id="infolha'+i+'" class="infolhas"><div><img style="position:absolute;" class="folhas_img" src="'+configuracao.padraoSrcMini+i+'.jpg"/></div></div></div>';
dentroMini += '<div class="folhasMini"><a href="javascript:passaPaginaMini('+i+');"><img  class="folhas_imgMini" src="'+configuracao.padraoSrcMini+i+'.jpg"/></a></div>';
dentroNav += '<div class="folhasMini"><a href="javascript:passaPaginaNav('+i+');"><img  class="folhas_imgMini" src="'+configuracao.padraoSrcMini+i+'.jpg"/></a></div>';
					}
					
				$("#miniC").html(dentroMini);
				$("#miniC").css({height:folhasQt*(153/6)});
				$("#navegacaoC").css({width:folhasQt*(120)});
				$("#navegacaoC").html(dentroNav);
				este.html(dentroDiv);
				
				$("#folha"+atual+" > div > div").find('img').attr({src: configuracao.padraoSrc+atual+".jpg"});
				
				function ativaScroll(){
					//$("#aux").append(listaZoom[atual] + ' / '+ escuro +"}");
					if(!escuro){
						//alert('foi');
						desativaScroll();
						listaZoom[atual] = new iScroll('infolha'+atual, { zoom:true , bounce:true});
					}
				}
				
				function escuroAtivaScroll(){
					escuro = false;
					ativaScroll();
				}
				
				function desativaScroll(){
					if(listaZoom[atual]!=undefined){
						//alert('morre');
						listaZoom[atual].destroy();
					}
				}

				//var peqZoom = peqZoom = new peqZoomImg($("#folha"+atual+" > div"),$("#folha"+atual+" > div > div").children('img'));

				//var zoom = new ZoomView(este,este.children('div:nth-child('+e+')').children('img')); //Zoom
				 
				ini();
				fechaSub();
				ativaScroll();
				
				$("#protecao").click(function() {
					fechaSub();
				});
			
				$("#cabecalho, #rodape").click(function() {
					abreSub();
				});
				
				
				function abreSub(){
					escuro = true;
					desativaScroll();
					$("#cabecalho").hide();
					$("#rodape").hide();
					$("#cabecalhoDentro").gx({'top': '0'}, 500, 'Sine:Out')
					//animate({ top: 0 });
					$("#rodapeDentro").animate({ bottom: 0 });
					//$("#cabecalhoDentro").show();
					//$("#rodapeDentro").show();
					$('#protecao').show().gx({'opacity':.3}, 500);
				}
		
				function fechaSub(){
					fechaTudo();
					$('#protecao').gx({'opacity':0}, 500);
					$('#protecao').hide();
					$("#cabecalho").show();
					$("#rodape").show();
					$("#cabecalhoDentro").gx({'top': '-50'}, 500, 'Sine:Out', function(){escuroAtivaScroll();})
					$("#rodapeDentro").animate({ bottom: -50 });
					//$("#cabecalhoDentro").hide();
					//$("#rodapeDentro").hide();
				   //$("protecao").animate({ top: $(this).offset().top, height: $(this).height() });
				}


				
				function ini(){
					

					//$("#folha"+atual).css({top:'0px'});
					$("#folha"+atual).show();
					$('.folhas').gxInit({queue: 'cancel'});
					
					
					este.children("div").width(largura).height(altura);
					este.children("div").children("div").children("div").children("img").width(largura).height(altura);
					este.children("div").children("div").children("div").width(largura).height(altura);
					//.each(function (i, ob) { });
					
					este.children("div").hammer().bind("dragstart drag dragend", function(ev) {
						var imagem = $(this);
						//$('#aux').html(peqZoom.zoomAtual);
						//var teste ='ok';
						var teste = ev.touches.length;
						//teste = 1;
						//var teste2 = ev.touches[1].y+'';
						//$('#aux').html(ev.touches[0].x+" - "+ev.touches[0].y + " / " + teste+" - "+teste);
						//teste = 1;
						//alert(listaZoom[atual]);
						if(listaZoom[atual].scale==1 && teste<2){
							desativaScroll();
							//listaZoom[atual].destroy();
							//peqZoom = null;
							//peqZoom = new Object;
							//peqZoom.zoomAtual = 1;
							//peqZoom.liberaGeral = false;
							if(ev.type=='dragstart'){
								ativaDrag=true;
								liberaMorte = false;
								$(".folhas").gx('pause');
								//$("#folha"+(atual-1)).css({top:'0px' });
								$("#folha"+(atual-1)).show();
								//$("#folha"+(atual+1)).css({top:'0px' });
								$("#folha"+(atual+1)).show();
								//.css({top:'0px' });
								//alert(imagem.children("img").css('transformOrigin'));
							}
							//DRAG
							if(ev.type=='drag' && ativaDrag==true){
								if(ev.direction == 'left') {
									   left = 0 - ev.distance;
								} else if(ev.direction == 'right') {
										left = ev.distance;
								}
								
								$("#folha"+(atual)).css({left: left});
								$("#folha"+(atual+1)).css({left: left+largura});
								$("#folha"+(atual-1)).css({left: left-largura});
							}
							
							//FIM DRAG
							if(ev.type=='dragend' && ativaDrag==true){
								ativaDrag=false;
								liberaMorte = true;
								 if(Math.abs(ev.distance) > 100) {
									if(ev.direction == 'right') {
										proximo();
									} else if(ev.direction == 'left') {
										anterior();
									}
								}else{
									passa(atual , 'ficou');
								}
							}
					}
							//TOQUE
					});
				}
						//FUNCOES
						function proximo(){
							passa(atual-1);
						}
						
						function anterior(){
							passa(atual+1);
						}
						
						function passa(e, modo){
							//peqZoom.liberaGeral = false;
							if(e==atual){
								modo = 'ficou';
							}
							var antigo = atual;
							e = e < 1 ? 1 : e;
							e = e > folhasQt ? folhasQt : e;
							if(e < 1){
								e = 1;
							}
							atual = e;
							var velocidade = (modo == 'ficou') ? 100 : 350;
							var tipo = 'Sine:Out';
							
							var proxima = atual + 1;
							var anterior = atual - 1; 
							var dir = 1;

							if(modo == 'auto'){
								if(atual > antigo){
									anterior = antigo;
									proxima = atual+1;
									dir = 1; 
								}else{
									anterior = atual-1;
									proxima = antigo;
									dir = -1;
								}
								//liberaMorte = false;
								//$(".folhas").gx('pause');
								$("#folha"+(atual)).css({left:largura*dir});
								$("#folha"+(atual)).show();
								//$("#folha"+(anterior)).css({top:'0px' , left:-largura});
								//$("#folha"+(proximo)).css({top:'0px' , left:largura });
							}
				
							$('#folha'+anterior).gx({'left':-largura}, velocidade, tipo);
							$('#folha'+atual).gx({'left':0}, velocidade, tipo, function(){morre();});
							$('#folha'+proxima).gx({'left':largura}, velocidade, tipo);
							
							//$("#folha"+atual).children('img').unbind();
							//$("#folha"+anterior).children('img').unbind();
							//$("#folha"+proxima).children('img').unbind();

						}
						
						function morre(){
							if(liberaMorte) {
								//alert('ok');
								//peqZoom.liberaGeral = true;
								//$("#aux").append(atual);
								//$(".folhas").css({top:'-9999999px' , left: '0px'});
								for(i = 1; i <= folhasQt ; i++){
									$("#folha"+i+" > div > div").find('img').attr({src: configuracao.padraoSrcMini+i+".jpg"});
									if(listaZoom[i]!=undefined){
										listaZoom[i].destroy();
									}
								}
								
								ativaScroll();
								//listaZoom[atual].zoom(0, 0, 2);
								//$(".folhas > div").unbind();
								$(".folhas").hide();
								$("#folha"+atual+" > div > div").find('img').attr({src: configuracao.padraoSrc+atual+".jpg"});
								//folha1S = new iScroll('folha'+atual,  { zoom:true });
								$("#folha"+atual).show();
								//este.unbind();
								//$("#folha"+atual).children('img').unbind();
								
								//peqZoom = new peqZoomImg($("#folha"+atual+" > div"),$("#folha"+atual));
								
								//$("#folha"+atual).children('img').unbind();
								//peqZoom.liberaGeral = false;
							}
						}
						//////////////////////////////////////////////////////////
return this;
};