/*
 * jQuery.azutek.com.carousel
 *
 * Copyright (c) 2011 Azutek.Com
 * http://azutek.com/jquery-mobile-carousel/
 *
 * Licensed under a Creative Commons Attribution 3.0 License
 * http://creativecommons.org/licenses/by-sa/3.0/
 *
 * Version: 0.1
 */
(function ($) {
		$.fn.azutekCarousel = function (settings) {
			settings = jQuery.extend({
						width : '100%',
						height : '100%',
						transitionSpeed : 500,
						activeCard : 0
					}, settings);
			return this.each(function () {
					var $this = $(this);
					$this.width(settings.width);
					settings.width = $this.width();
					//alert(settings.width);
					$this.height(settings.height);
					settings.height = $this.height();
					
					var CardContainer = $this.children("div");
					var cards = 0;
					CardContainer.children("div").width(settings.width).height(settings.height).each(function () {
						cards++;
					});
					var iniX = 0;
					var endX = 0;
					var actCard = settings.activeCard;
					//slideTocard(actCard);
					CardContainer.width(cards * settings.width);
					CardContainer.draggable({
							axis : "x",
							handle : 'div',
							create : function (event, ui) {
								$(document).keydown(function (e) {
									var oldCard = actCard;
										var keyCode = e.keyCode || e.which, arrow = {left : 37,	up : 38,right : 39,down : 40};
										switch (keyCode) {
											case arrow.left: actCard--; break;
											case arrow.down: actCard--; break;
											case arrow.right: actCard++; break;
											case arrow.up: actCard++; break;
										}
										if (actCard >= cards) actCard = cards - 1;
										else if (actCard < 0) actCard = 0;
										if (oldCard!=actCard) slideTocard(actCard);
									});
							},
							start : function (event, ui) {
								CardContainer.css('cursor', 'move');
								iniX = CardContainer.position().left;
							},
							stop : function (event, ui) {
								CardContainer.css('cursor', 'auto');
								endX = CardContainer.position().left;
								if (endX > 0) actCard = 0;
								else
									if (Math.abs(endX - iniX) > (settings.width / 20))
										if (iniX > endX) actCard++;
										else actCard--;
								slideTocard(actCard);
							}
						});
					slideTocard = function (card) {
						if (card >= cards) actCard = card = cards - 1;
						else if (card < 0)	actCard = card = 0;
						var cardPosLeft = 0 - (card * settings.width);
						CardContainer.stop().gx({'left': cardPosLeft }, 500);
						/*
						CardContainer.stop().animate({
								opacity : 1,
								left : cardPosLeft,
							}, settings.transitionSpeed, function () {});
						*/
						actCard = card;
					}
					var touchX;
					var iniX;
					$(this).bind('touchstart', function (es) {
							iniX = CardContainer.position().left;
							touchX = es.originalEvent.touches[0].pageX;
							var touchMoveX;
							$(this).bind('touchmove', function (em) {
									em.preventDefault();
									touchMoveX = em.originalEvent.touches[0].pageX;
									var touchDiff = iniX + (touchMoveX - touchX);
									try {
										CardContainer.css({
												'left' : touchDiff
											});
									} catch (e) {}
								});
							$(this).bind('touchend', function (ee) {
									if (Math.abs(touchMoveX - touchX) > (settings.width / 20))
										if (touchMoveX < touchX)
											actCard++;
										else
											actCard--;
									slideTocard(actCard);
									$(this).unbind('touchmove touchend');
								});
						});
				slideTocard(actCard);
				});
		};
	})(jQuery);
 