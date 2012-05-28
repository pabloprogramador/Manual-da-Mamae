/*
 * GX - Full-Featured Javascript Animations Framework v1.2 - by Riccardo Degni (RD)
 *
 * Copyright (c) 2009 Riccardo Degni (http://www.riccardodegni.net/)
 * MIT-Style License
 */

// Global Methods	
var Fns = {
	Create: function(props) {
		var props = props || {};
		var fn = function() {
			return (this.init) ? this.init.apply(this, arguments) : this;	
		};
		
		for(var prop in props) fn.prototype[prop] = props[prop];
		return fn;
	},
	
	Bind: function(fn, bind, args) {
		return function() {
			fn.apply(bind, args || []);
		};
	},
	
	Contains: function(obj, el) {
		for(var i=0; i<obj.length; i++)
			if(obj[i] == el) return true;
		return false;
	},
	
	Camelize: function(str) {
		str = str.replace(/-\D/g, function(match){
			return match.charAt(1).toUpperCase();
		});
		return str;
	},
	
	Now: function() {
		return new Date().getTime();
	},
	
	Extend: function(base, more, merge) {
		if(typeof base != 'object' && typeof base != 'function') base = {};
		for(var p in more)
			if(!base[p] || merge) base[p] = more[p];
		return base;
	},
	
	Each: function(obj, fn) {
		for(var i = 0; i < obj.length; i++) fn.apply(obj, [obj[i], i, obj]);
	}
};

// The GX Wrapper
var GX = Fns.Create({
	options: {
		duration: 1000, 
		fps: 50,
		defaultUnit: 'px',
		queue: 'queue',
		easing: 'Linear',
		delay: false
	},
	
	init: function(element, opts) {
		this.element = element;
		this.options = Fns.Extend(opts, GX.prototype.options);
		return this;
	},
	
	anime: function(styles, duration, easing, callback , delay) {
		if(!this.isRunning) {
			this.isRunning = true;
			this.styles = styles;
			//alert(delay);
			//this.options.delay = delay==false ? this.options.delay : delay ;
			//this.options.delay = delay ;
			this.tempo = delay;
			this.duration = (duration) ? ((typeof duration == 'string') ? GX.durations[Fns.Camelize(duration)] : duration) : this.options.duration;
			this.easing = easing || this.options.easing;
			this.callback = ((typeof callback == 'object') ? callback.complete : ((typeof callback == 'function') ? callback : false));
			this.startFn = (typeof callback == 'object') ? callback.start : false;
			if(!this.chain) this.chain = [];
			this.interval  = Math.round(1000/this.options.fps);
			
			this.starts = {};
			this.ends = {};
			this.changes = {};
			this.sizes = {};
			this.units = {};
			
			// compute values
			for(var style in this.styles) {
				var camelStyle = Fns.Camelize(style), camelStyle = (GX.complex.hasOwnProperty(camelStyle)) ? GX.complex[camelStyle] : camelStyle, jStyle = this.styles[style], jUnit = this.options.defaultUnit || 'px', jChanges = false;
				var cssStyle = this.element.css(camelStyle), startStyle = parseFloat((cssStyle == 'auto') ? 0 : cssStyle);
				if((Fns.Contains(GX.axis, style)) && this.element.css('position') == 'static') this.element.css('position', 'relative');
				
				if(GX.Color.isColor(style)) { // '#ff00ff' | '#f0f' | [255, 0, 255]
					startStyle = GX.Color.cssToRgb(this.element.css(camelStyle));
					jStyle = GX.Color.cssToRgb(this.styles[style]);
					jChanges = [jStyle[0] - startStyle[0], jStyle[1] - startStyle[1], jStyle[2] - startStyle[2]];
				}
				else if(typeof jStyle == 'string') {
					//alert(camelStyle+' - '+jStyle+' - '+cssStyle);
			/////REMENOD DO PABLAO - PARA CENTRALIZAR
					if(jStyle == 'center'){
						//alert(this.styles['width']);
						if(camelStyle == 'left'){ var tipo = 'width'; } else { var tipo = 'height'};
						//alert(tipo);
						if(!this.element.data('gxSave_' + camelStyle)) this.element.data('gxSave_' + camelStyle, cssStyle);
						var auxPosicao = parseFloat(this.element.data('gxSave_' + camelStyle)) || 1;
						
						if(!this.element.data('gxSave_' + tipo)) this.element.data('gxSave_' + tipo, cssStyle);
						var auxTamanho = parseFloat(this.element.data('gxSave_' + tipo)) || 1;
						
						this.styles[style] = jStyle = auxPosicao - ((this.styles[tipo] - auxTamanho )/2);
						jUnit = 'px';
						
						
					}else{
			////// FIM DO REMENDAO
					if(Fns.Contains(GX.specialValues, jStyle)) { // 'show' | 'hide | 'toggle'
						if(!this.element.data('gxSave_' + camelStyle)) this.element.data('gxSave_' + camelStyle, cssStyle);
						var to = parseFloat(this.element.data('gxSave_' + camelStyle)) || 1;
						switch(jStyle) {
							case 'show': this.styles[style] = jStyle = to; break;
							case 'hide': this.styles[style] = jStyle = 0; break;
							case 'toggle': this.styles[style] = jStyle = (parseFloat(Math.round(startStyle)) != 0) ? 0 : to; break;
						}
					}
					else { // '200px' | '200' | '+=200px' | '+=200'
						var fullStyle = GX.Parse.style(jStyle, jUnit);
						if(typeof fullStyle == 'object') {	// '200px' | '400em' | ...
							this.styles[style] = jStyle = parseFloat(fullStyle[0]);
							jUnit = fullStyle[1] || 'px';
							// relative animations
							/////REMENOD DO PABLAO - PARA PORCENTAGEM
							
							if(jUnit == '%'){
								if(!this.element.data('gxSave_' + camelStyle)) this.element.data('gxSave_' + camelStyle, cssStyle);
								var to = parseFloat(this.element.data('gxSave_' + camelStyle)) || 1;
								this.styles[style] = jStyle = (jStyle * to)/100;
								jUnit = 'px';
							}
							///////FIM DO REMENDO - aaaaaaaaaoooo bichao ficou batuta
							if(fullStyle[2]) // '+=' or '-='
								//alert(fullStyle[2]);
								this.styles[style] = jStyle = (fullStyle[2] == '+=') ? (jStyle + startStyle) : (startStyle - jStyle);
						}
						else if(typeof fullStyle == 'string') { // '400' | '20' | ...
							this.styles[style] = jStyle = parseFloat(fullStyle);
						}
					}
				}
				}
				this.starts[style] = startStyle;
				this.ends[style] = jStyle;
				this.changes[style] = jChanges || this.ends[style] - this.starts[style];
				this.units[style] = jUnit;
			}
			
			if(this.startFn) this.startFn.apply(this, [this.element, this]);
			this.time = Fns.Now();
			this.timer = setInterval(Fns.Bind(this.increase, this), this.interval);
		}
		else {
			if(this.options.queue == 'queue') {
				var boundAnime = Fns.Bind(this.anime, this, arguments);
				this.chain.push(boundAnime);
			}
			else if(this.options.queue == 'cancel') {
				this.clearTimer();
				this.anime.apply(this, arguments);
			}
		}
		return this;
	},
	
	increase: function() {
		var elapsedTime = this.elapsedTime = Fns.Now() - this.time;
		if (elapsedTime < this.duration) {
			for(var style in this.styles) {
				var easing = this.easing.split(':'), easingType = (easing[1]) ? easing[1] : 'InOut', ease = GX.Transitions[easing[0]][easingType];
				var starts = this.starts[style], changes = this.changes[style];
				if(typeof starts != 'object') {
					this.sizes[style] = ease(elapsedTime, starts, changes, this.duration);
					if(this.sizes[style] < 0 && !Fns.Contains(GX.axis, style)) this.sizes[style] = 0; // prevent css warnings
				}
				else { // colors
					this.sizes[style] = [ease(elapsedTime, starts[0], changes[0], this.duration),
										 ease(elapsedTime, starts[1], changes[1], this.duration),
										 ease(elapsedTime, starts[2], changes[2], this.duration)];
				}
			}
		}
		else {
			this.clearTimer();
			for(var style in this.styles) {
				this.sizes[style] = (GX.Color.isColor(style)) ? this.ends[style] : this.styles[style];
			}
		}
		this.setStyles();
	},
	
	parseStyle: function(style, sz) {
		var camelStyle = Fns.Camelize(style);
		// ? color value : opacity or integers
		(GX.Color.isColor(camelStyle)) ? this.element.css(camelStyle, 'rgb(' + parseInt(sz[0]) + ',' + parseInt(sz[1]) + ',' + parseInt(sz[2]) + ')') : (this.element.css(camelStyle, (camelStyle == 'opacity') ? sz : sz + this.units[style]));
	},
	
	clearTimer: function() {
		this.isRunning = false;
		this.timer = clearInterval(this.timer);
	},
	
	pause: function() {
		this.clearTimer();
	},
	rodando: function() {
		//alert(this.isRunning);
		return this.isRunning;
	},
	resume: function() {
		this.isRunning = true;
		this.time = Fns.Now() - this.elapsedTime;
		this.timer = setInterval(Fns.Bind(this.increase, this), this.interval);
	},
	
	setStyles: function() {
		for(var style in this.styles) {
			this.parseStyle(style, this.sizes[style]);
		}
		//alert(this.options.delay);
		if(!this.isRunning ) {
			if(this.callback && typeof this.callback == 'function') this.callback.apply(this, [this.element, this]);
			//alert();
			if(this.tempo==undefined){
				var passa = this.options.delay;
			}else{
				var passa = this.tempo;
			}
			var delay = passa, chain = this.chain, ring = function() { chain.shift()(); };
			if(chain.length != 0) (!delay) ? ring() : setTimeout(ring, delay);
		}
	}
});

GX.Parse = {
	style: function(s, un) {
		var fullStyle = [], value, unit, relative, relatives = ['+=', '-='];
		
		Fns.Each(relatives, function(rel, i) {
			if(s.indexOf(rel) != -1) { 
				relative = rel;
				s = s.replace(rel, '');
			}		 
		});
		
		Fns.Each(GX.units, function(u, i){
			if(s.indexOf(u) != -1) { 
				value = parseFloat(s);
				unit = u;
				fullStyle.push(value, unit);
			}
		});
		
		if(!unit) {
			value = parseFloat(s);
			unit = un;
			fullStyle.push(value, unit);
		}
		
		if(relative) fullStyle.push(relative);
		return (fullStyle.length > 0) ? fullStyle : s;
	}
};

// Global Methods for dealing with colors
GX.Color = {
	decToHex: function(dec) {
		return dec.toString(16);
	},
	
	hexToDec: function(hex) {
		return parseInt(hex, 16);
	},
	
	rgbToHex: function(r, g, b) {
		var dth = GX.Color.decToHex;
		return [dth(r), dth(g), dth(b)];
	},
	
	hexToRgb: function(h, e, x) {
		var htd = GX.Color.hexToDec;
		return [htd(h), htd(e), htd(x)];
	},
	
	cssToRgb: function(color) {
		if(GX.Color.customColors[color]) return GX.Color.customColors[color]; // 'red' | 'blue' | ...
		
		if(typeof color == 'object' && color.length == 3) return color; // [255, 0, 255]
		
		if(color.indexOf('rgb') <= -1) { // #ff00ff | #f0f
			var color = (color.length > 4) ? color : GX.Color.shortToFull(color);
			return GX.Color.hexToRgb(color.substring(1, 3), color.substring(3, 5), color.substring(5, 7));
		}
		
		var col = color.substring(4, color.length-1).split(','), nCol = [];
		Fns.Each(col, function(c) {
			nCol.push(parseInt(c));
		});
		return nCol;
	},
	
	shortToFull: function(color) {
		var r = color.charAt(1), g = color.charAt(2), b = color.charAt(3);
		return '#' + r + r + g + g + b + b;
	},
	
	isColor: function(style) {
		return (style.toLowerCase().indexOf('color') != -1);
	},
	
	customColors: {
		red: [255, 0, 0],
		green: [0, 255, 0],
		blue: [0, 0, 255],
		white: [255, 255, 255],
		black: [0, 0, 0]
	}
};

// Internal GXs
GX.linear = function(t, b, c, d) { return c*t/d + b; };
Fns.Extend(GX, {
	Transitions: { Linear: {'In': GX.linear, 'Out': GX.linear, 'InOut': GX.linear} }, // Base Transition
	units: ['px', 'em', '%', 'in', 'pt', 'ex'],
	durations: {'verySlow': 4000, 'slow': 2000, 'normal': 1000, 'fast': 500, 'veryFast': 250},
	specialValues: ['show', 'hide', 'toggle'],
	complex: {'borderWidth': 'borderTopWidth', 'borderColor': 'borderTopColor', 'margin': 'marginTop', 'padding': 'paddingTop'},
	axis: ['top', 'left'],
	unlink: function(obj) {
		var end = {};
		switch (typeof obj) {
			case 'object': for(var p in obj) end[p] = GX.unlink(obj[p]);
			break;
			default: return obj;
		}
		return end;
	}
});

// jQuery related fns
(function($) {
jQuery.fn.extend({	
	gxRodando:  function(el) {
		var set = $(this), jq = this;
		var aux;
		Fns.Each(set, function(el) {
			var el = jq.setGX($(el)), gx = el.data('gx');
			aux = gx['rodando']();
		});
		return aux;
	},
	setGX: function(el) {
		if(!el.data('gx')) el.data('gx', new GX().init(el, {}));
		return el;
	},			 
	
	gxInit: function(opts) {
		var set = $(this), jq = this;
		Fns.Each(set, function(el) {
			var el = jq.setGX($(el));
			Fns.Extend(el.data('gx').options, opts, true);	  
		});
		return this;
	},
	
	gx: function(styles, duration, easing, callback, delay) {
		var set = $(this), jq = this;
		Fns.Each(set, function(el) {
			var el = jq.setGX($(el)), gx = el.data('gx');
			(typeof styles == 'string') ? gx[styles]() : gx.anime(GX.unlink(styles), duration, easing, callback, delay);		  
		});
		return this;
	}
});
})(jQuery);

Fns.Extend(GX.Transitions, {
	Sine: {
		'In':function(t,b,c,d) { return-c*Math.cos(t/d*(Math.PI/2))+c+b; },
		'Out':function(t,b,c,d) { return c*Math.sin(t/d*(Math.PI/2))+b; },
		'InOut':function(t,b,c,d) { return-c/2*(Math.cos(Math.PI*t/d)-1)+b; }
	},
	
	Quint: {
		'In':function(t,b,c,d) { return c*(t/=d)*t*t*t*t+b; },
		'Out':function(t,b,c,d) { return c*((t=t/d-1)*t*t*t*t+1)+b; },
		'InOut':function(t,b,c,d) { return ((t/=d/2)<1) ? c/2*t*t*t*t*t+b : c/2*((t-=2)*t*t*t*t+2)+b; }
	},
	
	Quart: {
		'In':function(t,b,c,d) { return c*(t/=d)*t*t*t+b; },
		'Out':function(t,b,c,d) { return-c*((t=t/d-1)*t*t*t-1)+b; },
		'InOut':function(t,b,c,d) { return ((t/=d/2)<1) ? c/2*t*t*t*t+b : -c/2*((t-=2)*t*t*t-2)+b; }
	},
	
	Quad: {
		'In':function(t,b,c,d) { return c*(t/=d)*t+b; },
		'Out':function(t,b,c,d) { return-c*(t/=d)*(t-2)+b; },
		'InOut':function(t,b,c,d) { return ((t/=d/2)<1) ? c/2*t*t+b : -c/2*((--t)*(t-2)-1)+b; }
	},
	
	Expo: {
		'In':function(t,b,c,d) { return(t==0)?b:c*Math.pow(2, 10*(t/d-1))+b; },
		'Out':function(t,b,c,d) { return(t==d)?b+c:c*(-Math.pow(2,-10*t/d)+1)+b; },
		'InOut':function(t,b,c,d) { return (t==0) ? b : ((t==d) ? b+c : ((t/=d/2)<1) ?  c/2*Math.pow(2, 10*(t-1))+b : c/2*(-Math.pow(2,-10*--t)+2)+b); }
	},
	
	Elastic: {
		'In':function(t,b,c,d) {
			if(t==0) return b; if((t/=d)==1) return b+c; var p=d*.3, a=c, s=p/4;
			return-(a*Math.pow(2,10*(t-=1))*Math.sin((t*d-s)*(2*Math.PI)/p))+b;
		},
		'Out':function(t,b,c,d,a,p) {
			if(t==0) return b; if((t/=d)==1) return b+c; var p=d*.3, a=c, s=p/4;
			return(a*Math.pow(2,-10*t)*Math.sin((t*d-s)*(2*Math.PI)/p)+c+b);
		},
		'InOut':function(t,b,c,d,a,p) {
			if(t==0) return b; if((t/=d/2)==2) return b+c; var p=d*(.3*1.5), a=c, s=p/4;
			return (t<1) ? -.5*(a*Math.pow(2,10*(t-=1))*Math.sin((t*d-s)*(2*Math.PI)/p))+b : a*Math.pow(2,-10*(t-=1))*Math.sin((t*d-s)*(2*Math.PI)/p)*.5+c+b;
		}
	},
	
	Cubic: {
		'In':function(t,b,c,d) { return c*(t/=d)*t*t+b; },
		'Out':function(t,b,c,d) { return c*((t=t/d-1)*t*t+1)+b; },
		'InOut':function(t,b,c,d) { return ((t/=d/2)<1) ? c/2*t*t*t+b : c/2*((t-=2)*t*t+2)+b; }
	},
	
	Circ: {
		'In':function(t,b,c,d) { return-c*(Math.sqrt(1-(t/=d)*t)-1)+b; },
		'Out':function(t,b,c,d) { return c*Math.sqrt(1-(t=t/d-1)*t)+b; },
		'InOut':function(t,b,c,d) { return ((t/=d/2)<1) ? -c/2*(Math.sqrt(1-t*t)-1)+b : c/2*(Math.sqrt(1-(t-=2)*t)+1)+b; }
	},
	
	Bounce: {
		'In':function(t,b,c,d) { return c-GX.Transitions.Bounce.Out(d-t, 0, c, d)+b; },
		'Out':function(t,b,c,d) { return ((t/=d)<(1/2.75)) ? c*(7.5625*t*t)+b : ((t<(2/2.75)) ? c*(7.5625*(t-=(1.5/2.75))*t+.75)+b : (t<(2.5/2.75) ? c*(7.5625*(t-=(2.25/2.75))*t+.9375)+b : c*(7.5625*(t-=(2.625/2.75))*t+.984375)+b )); },
		'InOut':function(t,b,c,d) { return (t<d/2) ? (GX.Transitions.Bounce.In(t*2, 0, c, d)*.5+b) : (GX.Transitions.Bounce.Out(t*2-d, 0, c, d)*.5+c*.5+b); }
	},
	
	Back: {
		'In':function(t,b,c,d) { var s=1.70158; return c*(t/=d)*t*((s+1)*t-s)+b; },
		'Out':function(t,b,c,d) { var s=1.70158; return c*((t=t/d-1)*t*((s+1)*t+s)+1)+b; },
		'InOut':function(t,b,c,d) { var s=1.70158; return ((t/=d/2)<1) ? c/2*(t*t*(((s*=(1.525))+1)*t-s))+b : c/2*((t-=2)*t*(((s*=(1.525))+1)*t+s)+2)+b; }
	}
});

