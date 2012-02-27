/*
 * jQuery Easing v1.3 - http://gsgd.co.uk/sandbox/jquery/easing/
 *
 * Uses the built in easing capabilities added In jQuery 1.1
 * to offer multiple easing options
 *
 * TERMS OF USE - jQuery Easing
 * 
 * Open source under the BSD License. 
 * 
 * Copyright © 2008 George McGinley Smith
 * All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without modification, 
 * are permitted provided that the following conditions are met:
 * 
 * Redistributions of source code must retain the above copyright notice, this list of 
 * conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright notice, this list 
 * of conditions and the following disclaimer in the documentation and/or other materials 
 * provided with the distribution.
 * 
 * Neither the name of the author nor the names of contributors may be used to endorse 
 * or promote products derived from this software without specific prior written permission.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY 
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
 *  COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 *  EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE
 *  GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED 
 * AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 *  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED 
 * OF THE POSSIBILITY OF SUCH DAMAGE. 
 *
*/

// t: current time, b: begInnIng value, c: change In value, d: duration
jQuery.easing['jswing'] = jQuery.easing['swing'];

jQuery.extend( jQuery.easing,
{
	def: 'easeOutQuad',
	swing: function (x, t, b, c, d) {
		//alert(jQuery.easing.default);
		return jQuery.easing[jQuery.easing.def](x, t, b, c, d);
	},
	easeInQuad: function (x, t, b, c, d) {
		return c*(t/=d)*t + b;
	},
	easeOutQuad: function (x, t, b, c, d) {
		return -c *(t/=d)*(t-2) + b;
	},
	easeInOutQuad: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t + b;
		return -c/2 * ((--t)*(t-2) - 1) + b;
	},
	easeInCubic: function (x, t, b, c, d) {
		return c*(t/=d)*t*t + b;
	},
	easeOutCubic: function (x, t, b, c, d) {
		return c*((t=t/d-1)*t*t + 1) + b;
	},
	easeInOutCubic: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t*t + b;
		return c/2*((t-=2)*t*t + 2) + b;
	},
	easeInQuart: function (x, t, b, c, d) {
		return c*(t/=d)*t*t*t + b;
	},
	easeOutQuart: function (x, t, b, c, d) {
		return -c * ((t=t/d-1)*t*t*t - 1) + b;
	},
	easeInOutQuart: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t*t*t + b;
		return -c/2 * ((t-=2)*t*t*t - 2) + b;
	},
	easeInQuint: function (x, t, b, c, d) {
		return c*(t/=d)*t*t*t*t + b;
	},
	easeOutQuint: function (x, t, b, c, d) {
		return c*((t=t/d-1)*t*t*t*t + 1) + b;
	},
	easeInOutQuint: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t*t*t*t + b;
		return c/2*((t-=2)*t*t*t*t + 2) + b;
	},
	easeInSine: function (x, t, b, c, d) {
		return -c * Math.cos(t/d * (Math.PI/2)) + c + b;
	},
	easeOutSine: function (x, t, b, c, d) {
		return c * Math.sin(t/d * (Math.PI/2)) + b;
	},
	easeInOutSine: function (x, t, b, c, d) {
		return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
	},
	easeInExpo: function (x, t, b, c, d) {
		return (t==0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b;
	},
	easeOutExpo: function (x, t, b, c, d) {
		return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
	},
	easeInOutExpo: function (x, t, b, c, d) {
		if (t==0) return b;
		if (t==d) return b+c;
		if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b;
		return c/2 * (-Math.pow(2, -10 * --t) + 2) + b;
	},
	easeInCirc: function (x, t, b, c, d) {
		return -c * (Math.sqrt(1 - (t/=d)*t) - 1) + b;
	},
	easeOutCirc: function (x, t, b, c, d) {
		return c * Math.sqrt(1 - (t=t/d-1)*t) + b;
	},
	easeInOutCirc: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return -c/2 * (Math.sqrt(1 - t*t) - 1) + b;
		return c/2 * (Math.sqrt(1 - (t-=2)*t) + 1) + b;
	},
	easeInElastic: function (x, t, b, c, d) {
		var s=1.70158;var p=0;var a=c;
		if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
		if (a < Math.abs(c)) { a=c; var s=p/4; }
		else var s = p/(2*Math.PI) * Math.asin (c/a);
		return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
	},
	easeOutElastic: function (x, t, b, c, d) {
		var s=1.70158;var p=0;var a=c;
		if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
		if (a < Math.abs(c)) { a=c; var s=p/4; }
		else var s = p/(2*Math.PI) * Math.asin (c/a);
		return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
	},
	easeInOutElastic: function (x, t, b, c, d) {
		var s=1.70158;var p=0;var a=c;
		if (t==0) return b;  if ((t/=d/2)==2) return b+c;  if (!p) p=d*(.3*1.5);
		if (a < Math.abs(c)) { a=c; var s=p/4; }
		else var s = p/(2*Math.PI) * Math.asin (c/a);
		if (t < 1) return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
		return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )*.5 + c + b;
	},
	easeInBack: function (x, t, b, c, d, s) {
		if (s == undefined) s = 1.70158;
		return c*(t/=d)*t*((s+1)*t - s) + b;
	},
	easeOutBack: function (x, t, b, c, d, s) {
		if (s == undefined) s = 1.70158;
		return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
	},
	easeInOutBack: function (x, t, b, c, d, s) {
		if (s == undefined) s = 1.70158; 
		if ((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
		return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
	},
	easeInBounce: function (x, t, b, c, d) {
		return c - jQuery.easing.easeOutBounce (x, d-t, 0, c, d) + b;
	},
	easeOutBounce: function (x, t, b, c, d) {
		if ((t/=d) < (1/2.75)) {
			return c*(7.5625*t*t) + b;
		} else if (t < (2/2.75)) {
			return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
		} else if (t < (2.5/2.75)) {
			return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
		} else {
			return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
		}
	},
	easeInOutBounce: function (x, t, b, c, d) {
		if (t < d/2) return jQuery.easing.easeInBounce (x, t*2, 0, c, d) * .5 + b;
		return jQuery.easing.easeOutBounce (x, t*2-d, 0, c, d) * .5 + c*.5 + b;
	}
});

/*
 *
 * TERMS OF USE - EASING EQUATIONS
 * 
 * Open source under the BSD License. 
 * 
 * Copyright © 2001 Robert Penner
 * All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without modification, 
 * are permitted provided that the following conditions are met:
 * 
 * Redistributions of source code must retain the above copyright notice, this list of 
 * conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright notice, this list 
 * of conditions and the following disclaimer in the documentation and/or other materials 
 * provided with the distribution.
 * 
 * Neither the name of the author nor the names of contributors may be used to endorse 
 * or promote products derived from this software without specific prior written permission.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY 
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
 *  COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 *  EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE
 *  GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED 
 * AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 *  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED 
 * OF THE POSSIBILITY OF SUCH DAMAGE. 
 *
 */;
/*!
 * jQuery Cycle Plugin (with Transition Definitions)
 * Examples and documentation at: http://jquery.malsup.com/cycle/
 * Copyright (c) 2007-2009 M. Alsup
 * Version: 2.72 (09-SEP-2009)
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 * Requires: jQuery v1.2.6 or later
 *
 * Originally based on the work of:
 *	1) Matt Oakes
 *	2) Torsten Baldes (http://medienfreunde.com/lab/innerfade/)
 *	3) Benjamin Sterling (http://www.benjaminsterling.com/experiments/jqShuffle/)
 */
;(function($) {

var ver = '2.72';

// if $.support is not defined (pre jQuery 1.3) add what I need
if ($.support == undefined) {
	$.support = {
		opacity: !($.browser.msie)
	};
}

function debug(s) {
	if ($.fn.cycle.debug)
		log(s);
}		
function log() {
	if (window.console && window.console.log)
		window.console.log('[cycle] ' + Array.prototype.join.call(arguments,' '));
	//$('body').append('<div>'+Array.prototype.join.call(arguments,' ')+'</div>');
};

// the options arg can be...
//   a number  - indicates an immediate transition should occur to the given slide index
//   a string  - 'stop', 'pause', 'resume', or the name of a transition effect (ie, 'fade', 'zoom', etc)
//   an object - properties to control the slideshow
//
// the arg2 arg can be...
//   the name of an fx (only used in conjunction with a numeric value for 'options')
//   the value true (only used in conjunction with a options == 'resume') and indicates
//	 that the resume should occur immediately (not wait for next timeout)

$.fn.cycle = function(options, arg2) {
	var o = { s: this.selector, c: this.context };

	// in 1.3+ we can fix mistakes with the ready state
	if (this.length === 0 && options != 'stop') {
		if (!$.isReady && o.s) {
			log('DOM not ready, queuing slideshow');
			$(function() {
				$(o.s,o.c).cycle(options,arg2);
			});
			return this;
		}
		// is your DOM ready?  http://docs.jquery.com/Tutorials:Introducing_$(document).ready()
		log('terminating; zero elements found by selector' + ($.isReady ? '' : ' (DOM not ready)'));
		return this;
	}

	// iterate the matched nodeset
	return this.each(function() {
		var opts = handleArguments(this, options, arg2);
		if (opts === false)
			return;

		// stop existing slideshow for this container (if there is one)
		if (this.cycleTimeout)
			clearTimeout(this.cycleTimeout);
		this.cycleTimeout = this.cyclePause = 0;

		var $cont = $(this);
		var $slides = opts.slideExpr ? $(opts.slideExpr, this) : $cont.children();
		var els = $slides.get();
		if (els.length < 2) {
			log('terminating; too few slides: ' + els.length);
			return;
		}

		var opts2 = buildOptions($cont, $slides, els, opts, o);
		if (opts2 === false)
			return;

		var startTime = opts2.continuous ? 10 : getTimeout(opts2.currSlide, opts2.nextSlide, opts2, !opts2.rev);

		// if it's an auto slideshow, kick it off
		if (startTime) {
			startTime += (opts2.delay || 0);
			if (startTime < 10)
				startTime = 10;
			debug('first timeout: ' + startTime);
			this.cycleTimeout = setTimeout(function(){go(els,opts2,0,!opts2.rev)}, startTime);
		}
	});
};

// process the args that were passed to the plugin fn
function handleArguments(cont, options, arg2) {
	if (cont.cycleStop == undefined)
		cont.cycleStop = 0;
	if (options === undefined || options === null)
		options = {};
	if (options.constructor == String) {
		switch(options) {
		case 'stop':
			cont.cycleStop++; // callbacks look for change
			if (cont.cycleTimeout)
				clearTimeout(cont.cycleTimeout);
			cont.cycleTimeout = 0;
			$(cont).removeData('cycle.opts');
			return false;
		case 'pause':
			cont.cyclePause = 1;
			return false;
		case 'resume':
			cont.cyclePause = 0;
			if (arg2 === true) { // resume now!
				options = $(cont).data('cycle.opts');
				if (!options) {
					log('options not found, can not resume');
					return false;
				}
				if (cont.cycleTimeout) {
					clearTimeout(cont.cycleTimeout);
					cont.cycleTimeout = 0;
				}
				go(options.elements, options, 1, 1);
			}
			return false;
		case 'prev':
		case 'next':
			var opts = $(cont).data('cycle.opts');
			if (!opts) {
				log('options not found, "prev/next" ignored');
				return false;
			}
			$.fn.cycle[options](opts);
			return false;
		default:
			options = { fx: options };
		};
		return options;
	}
	else if (options.constructor == Number) {
		// go to the requested slide
		var num = options;
		options = $(cont).data('cycle.opts');
		if (!options) {
			log('options not found, can not advance slide');
			return false;
		}
		if (num < 0 || num >= options.elements.length) {
			log('invalid slide index: ' + num);
			return false;
		}
		options.nextSlide = num;
		if (cont.cycleTimeout) {
			clearTimeout(cont.cycleTimeout);
			cont.cycleTimeout = 0;
		}
		if (typeof arg2 == 'string')
			options.oneTimeFx = arg2;
		go(options.elements, options, 1, num >= options.currSlide);
		return false;
	}
	return options;
};

function removeFilter(el, opts) {
	if (!$.support.opacity && opts.cleartype && el.style.filter) {
		try { el.style.removeAttribute('filter'); }
		catch(smother) {} // handle old opera versions
	}
};

// one-time initialization
function buildOptions($cont, $slides, els, options, o) {
	// support metadata plugin (v1.0 and v2.0)
	var opts = $.extend({}, $.fn.cycle.defaults, options || {}, $.metadata ? $cont.metadata() : $.meta ? $cont.data() : {});
	if (opts.autostop)
		opts.countdown = opts.autostopCount || els.length;

	var cont = $cont[0];
	$cont.data('cycle.opts', opts);
	opts.$cont = $cont;
	opts.stopCount = cont.cycleStop;
	opts.elements = els;
	opts.before = opts.before ? [opts.before] : [];
	opts.after = opts.after ? [opts.after] : [];
	opts.after.unshift(function(){ opts.busy=0; });

	// push some after callbacks
	if (!$.support.opacity && opts.cleartype)
		opts.after.push(function() { removeFilter(this, opts); });
	if (opts.continuous)
		opts.after.push(function() { go(els,opts,0,!opts.rev); });

	saveOriginalOpts(opts);

	// clearType corrections
	if (!$.support.opacity && opts.cleartype && !opts.cleartypeNoBg)
		clearTypeFix($slides);

	// container requires non-static position so that slides can be position within
	if ($cont.css('position') == 'static')
		$cont.css('position', 'relative');
	if (opts.width)
		$cont.width(opts.width);
	if (opts.height && opts.height != 'auto')
		$cont.height(opts.height);

	if (opts.startingSlide)
		opts.startingSlide = parseInt(opts.startingSlide);

	// if random, mix up the slide array
	if (opts.random) {
		opts.randomMap = [];
		for (var i = 0; i < els.length; i++)
			opts.randomMap.push(i);
		opts.randomMap.sort(function(a,b) {return Math.random() - 0.5;});
		opts.randomIndex = 0;
		opts.startingSlide = opts.randomMap[0];
	}
	else if (opts.startingSlide >= els.length)
		opts.startingSlide = 0; // catch bogus input
	opts.currSlide = opts.startingSlide = opts.startingSlide || 0;
	var first = opts.startingSlide;

	// set position and zIndex on all the slides
	$slides.css({position: 'absolute', top:0, left:0}).hide().each(function(i) {
		var z = first ? i >= first ? els.length - (i-first) : first-i : els.length-i;
		$(this).css('z-index', z)
	});

	// make sure first slide is visible
	$(els[first]).css('opacity',1).show(); // opacity bit needed to handle restart use case
	removeFilter(els[first], opts);

	// stretch slides
	if (opts.fit && opts.width)
		$slides.width(opts.width);
	if (opts.fit && opts.height && opts.height != 'auto')
		$slides.height(opts.height);

	// stretch container
	var reshape = opts.containerResize && !$cont.innerHeight();
	if (reshape) { // do this only if container has no size http://tinyurl.com/da2oa9
		var maxw = 0, maxh = 0;
		for(var j=0; j < els.length; j++) {
			var $e = $(els[j]), e = $e[0], w = $e.outerWidth(), h = $e.outerHeight();
			if (!w) w = e.offsetWidth;
			if (!h) h = e.offsetHeight;
			maxw = w > maxw ? w : maxw;
			maxh = h > maxh ? h : maxh;
		}
		if (maxw > 0 && maxh > 0)
			$cont.css({width:maxw+'px',height:maxh+'px'});
	}

	if (opts.pause)
		$cont.hover(function(){this.cyclePause++;},function(){this.cyclePause--;});

	if (supportMultiTransitions(opts) === false)
		return false;

	// apparently a lot of people use image slideshows without height/width attributes on the images.
	// Cycle 2.50+ requires the sizing info for every slide; this block tries to deal with that.
	var requeue = false;
	options.requeueAttempts = options.requeueAttempts || 0;
	$slides.each(function() {
		// try to get height/width of each slide
		var $el = $(this);
		this.cycleH = (opts.fit && opts.height) ? opts.height : $el.height();
		this.cycleW = (opts.fit && opts.width) ? opts.width : $el.width();

		if ( $el.is('img') ) {
			// sigh..  sniffing, hacking, shrugging...  this crappy hack tries to account for what browsers do when
			// an image is being downloaded and the markup did not include sizing info (height/width attributes);
			// there seems to be some "default" sizes used in this situation
			var loadingIE	= ($.browser.msie  && this.cycleW == 28 && this.cycleH == 30 && !this.complete);
			var loadingFF	= ($.browser.mozilla && this.cycleW == 34 && this.cycleH == 19 && !this.complete);
			var loadingOp	= ($.browser.opera && ((this.cycleW == 42 && this.cycleH == 19) || (this.cycleW == 37 && this.cycleH == 17)) && !this.complete);
			var loadingOther = (this.cycleH == 0 && this.cycleW == 0 && !this.complete);
			// don't requeue for images that are still loading but have a valid size
			if (loadingIE || loadingFF || loadingOp || loadingOther) {
				if (o.s && opts.requeueOnImageNotLoaded && ++options.requeueAttempts < 100) { // track retry count so we don't loop forever
					log(options.requeueAttempts,' - img slide not loaded, requeuing slideshow: ', this.src, this.cycleW, this.cycleH);
					setTimeout(function() {$(o.s,o.c).cycle(options)}, opts.requeueTimeout);
					requeue = true;
					return false; // break each loop
				}
				else {
					log('could not determine size of image: '+this.src, this.cycleW, this.cycleH);
				}
			}
		}
		return true;
	});

	if (requeue)
		return false;

	opts.cssBefore = opts.cssBefore || {};
	opts.animIn = opts.animIn || {};
	opts.animOut = opts.animOut || {};

	$slides.not(':eq('+first+')').css(opts.cssBefore);
	if (opts.cssFirst)
		$($slides[first]).css(opts.cssFirst);

	if (opts.timeout) {
		opts.timeout = parseInt(opts.timeout);
		// ensure that timeout and speed settings are sane
		if (opts.speed.constructor == String)
			opts.speed = $.fx.speeds[opts.speed] || parseInt(opts.speed);
		if (!opts.sync)
			opts.speed = opts.speed / 2;
		while((opts.timeout - opts.speed) < 250) // sanitize timeout
			opts.timeout += opts.speed;
	}
	if (opts.easing)
		opts.easeIn = opts.easeOut = opts.easing;
	if (!opts.speedIn)
		opts.speedIn = opts.speed;
	if (!opts.speedOut)
		opts.speedOut = opts.speed;

	opts.slideCount = els.length;
	opts.currSlide = opts.lastSlide = first;
	if (opts.random) {
		opts.nextSlide = opts.currSlide;
		if (++opts.randomIndex == els.length)
			opts.randomIndex = 0;
		opts.nextSlide = opts.randomMap[opts.randomIndex];
	}
	else
		opts.nextSlide = opts.startingSlide >= (els.length-1) ? 0 : opts.startingSlide+1;

	// run transition init fn
	if (!opts.multiFx) {
		var init = $.fn.cycle.transitions[opts.fx];
		if ($.isFunction(init))
			init($cont, $slides, opts);
		else if (opts.fx != 'custom' && !opts.multiFx) {
			log('unknown transition: ' + opts.fx,'; slideshow terminating');
			return false;
		}
	}

	// fire artificial events
	var e0 = $slides[first];
	if (opts.before.length)
		opts.before[0].apply(e0, [e0, e0, opts, true]);
	if (opts.after.length > 1)
		opts.after[1].apply(e0, [e0, e0, opts, true]);

	if (opts.next)
		$(opts.next).bind(opts.prevNextEvent,function(){return advance(opts,opts.rev?-1:1)});
	if (opts.prev)
		$(opts.prev).bind(opts.prevNextEvent,function(){return advance(opts,opts.rev?1:-1)});
	if (opts.pager)
		buildPager(els,opts);

	exposeAddSlide(opts, els);

	return opts;
};

// save off original opts so we can restore after clearing state
function saveOriginalOpts(opts) {
	opts.original = { before: [], after: [] };
	opts.original.cssBefore = $.extend({}, opts.cssBefore);
	opts.original.cssAfter  = $.extend({}, opts.cssAfter);
	opts.original.animIn	= $.extend({}, opts.animIn);
	opts.original.animOut   = $.extend({}, opts.animOut);
	$.each(opts.before, function() { opts.original.before.push(this); });
	$.each(opts.after,  function() { opts.original.after.push(this); });
};

function supportMultiTransitions(opts) {
	var i, tx, txs = $.fn.cycle.transitions;
	// look for multiple effects
	if (opts.fx.indexOf(',') > 0) {
		opts.multiFx = true;
		opts.fxs = opts.fx.replace(/\s*/g,'').split(',');
		// discard any bogus effect names
		for (i=0; i < opts.fxs.length; i++) {
			var fx = opts.fxs[i];
			tx = txs[fx];
			if (!tx || !txs.hasOwnProperty(fx) || !$.isFunction(tx)) {
				log('discarding unknown transition: ',fx);
				opts.fxs.splice(i,1);
				i--;
			}
		}
		// if we have an empty list then we threw everything away!
		if (!opts.fxs.length) {
			log('No valid transitions named; slideshow terminating.');
			return false;
		}
	}
	else if (opts.fx == 'all') {  // auto-gen the list of transitions
		opts.multiFx = true;
		opts.fxs = [];
		for (p in txs) {
			tx = txs[p];
			if (txs.hasOwnProperty(p) && $.isFunction(tx))
				opts.fxs.push(p);
		}
	}
	if (opts.multiFx && opts.randomizeEffects) {
		// munge the fxs array to make effect selection random
		var r1 = Math.floor(Math.random() * 20) + 30;
		for (i = 0; i < r1; i++) {
			var r2 = Math.floor(Math.random() * opts.fxs.length);
			opts.fxs.push(opts.fxs.splice(r2,1)[0]);
		}
		debug('randomized fx sequence: ',opts.fxs);
	}
	return true;
};

// provide a mechanism for adding slides after the slideshow has started
function exposeAddSlide(opts, els) {
	opts.addSlide = function(newSlide, prepend) {
		var $s = $(newSlide), s = $s[0];
		if (!opts.autostopCount)
			opts.countdown++;
		els[prepend?'unshift':'push'](s);
		if (opts.els)
			opts.els[prepend?'unshift':'push'](s); // shuffle needs this
		opts.slideCount = els.length;

		$s.css('position','absolute');
		$s[prepend?'prependTo':'appendTo'](opts.$cont);

		if (prepend) {
			opts.currSlide++;
			opts.nextSlide++;
		}

		if (!$.support.opacity && opts.cleartype && !opts.cleartypeNoBg)
			clearTypeFix($s);

		if (opts.fit && opts.width)
			$s.width(opts.width);
		if (opts.fit && opts.height && opts.height != 'auto')
			$slides.height(opts.height);
		s.cycleH = (opts.fit && opts.height) ? opts.height : $s.height();
		s.cycleW = (opts.fit && opts.width) ? opts.width : $s.width();

		$s.css(opts.cssBefore);

		if (opts.pager)
			$.fn.cycle.createPagerAnchor(els.length-1, s, $(opts.pager), els, opts);

		if ($.isFunction(opts.onAddSlide))
			opts.onAddSlide($s);
		else
			$s.hide(); // default behavior
	};
}

// reset internal state; we do this on every pass in order to support multiple effects
$.fn.cycle.resetState = function(opts, fx) {
	fx = fx || opts.fx;
	opts.before = []; opts.after = [];
	opts.cssBefore = $.extend({}, opts.original.cssBefore);
	opts.cssAfter  = $.extend({}, opts.original.cssAfter);
	opts.animIn	= $.extend({}, opts.original.animIn);
	opts.animOut   = $.extend({}, opts.original.animOut);
	opts.fxFn = null;
	$.each(opts.original.before, function() { opts.before.push(this); });
	$.each(opts.original.after,  function() { opts.after.push(this); });

	// re-init
	var init = $.fn.cycle.transitions[fx];
	if ($.isFunction(init))
		init(opts.$cont, $(opts.elements), opts);
};

// this is the main engine fn, it handles the timeouts, callbacks and slide index mgmt
function go(els, opts, manual, fwd) {
	// opts.busy is true if we're in the middle of an animation
	if (manual && opts.busy && opts.manualTrump) {
		// let manual transitions requests trump active ones
		$(els).stop(true,true);
		opts.busy = false;
	}
	// don't begin another timeout-based transition if there is one active
	if (opts.busy)
		return;

	var p = opts.$cont[0], curr = els[opts.currSlide], next = els[opts.nextSlide];

	// stop cycling if we have an outstanding stop request
	if (p.cycleStop != opts.stopCount || p.cycleTimeout === 0 && !manual)
		return;

	// check to see if we should stop cycling based on autostop options
	if (!manual && !p.cyclePause &&
		((opts.autostop && (--opts.countdown <= 0)) ||
		(opts.nowrap && !opts.random && opts.nextSlide < opts.currSlide))) {
		if (opts.end)
			opts.end(opts);
		return;
	}

	// if slideshow is paused, only transition on a manual trigger
	if (manual || !p.cyclePause) {
		var fx = opts.fx;
		// keep trying to get the slide size if we don't have it yet
		curr.cycleH = curr.cycleH || $(curr).height();
		curr.cycleW = curr.cycleW || $(curr).width();
		next.cycleH = next.cycleH || $(next).height();
		next.cycleW = next.cycleW || $(next).width();

		// support multiple transition types
		if (opts.multiFx) {
			if (opts.lastFx == undefined || ++opts.lastFx >= opts.fxs.length)
				opts.lastFx = 0;
			fx = opts.fxs[opts.lastFx];
			opts.currFx = fx;
		}

		// one-time fx overrides apply to:  $('div').cycle(3,'zoom');
		if (opts.oneTimeFx) {
			fx = opts.oneTimeFx;
			opts.oneTimeFx = null;
		}

		$.fn.cycle.resetState(opts, fx);

		// run the before callbacks
		if (opts.before.length)
			$.each(opts.before, function(i,o) {
				if (p.cycleStop != opts.stopCount) return;
				o.apply(next, [curr, next, opts, fwd]);
			});

		// stage the after callacks
		var after = function() {
			$.each(opts.after, function(i,o) {
				if (p.cycleStop != opts.stopCount) return;
				o.apply(next, [curr, next, opts, fwd]);
			});
		};

		if (opts.nextSlide != opts.currSlide) {
			// get ready to perform the transition
			opts.busy = 1;
			if (opts.fxFn) // fx function provided?
				opts.fxFn(curr, next, opts, after, fwd);
			else if ($.isFunction($.fn.cycle[opts.fx])) // fx plugin ?
				$.fn.cycle[opts.fx](curr, next, opts, after);
			else
				$.fn.cycle.custom(curr, next, opts, after, manual && opts.fastOnEvent);
		}

		// calculate the next slide
		opts.lastSlide = opts.currSlide;
		if (opts.random) {
			opts.currSlide = opts.nextSlide;
			if (++opts.randomIndex == els.length)
				opts.randomIndex = 0;
			opts.nextSlide = opts.randomMap[opts.randomIndex];
		}
		else { // sequence
			var roll = (opts.nextSlide + 1) == els.length;
			opts.nextSlide = roll ? 0 : opts.nextSlide+1;
			opts.currSlide = roll ? els.length-1 : opts.nextSlide-1;
		}

		if (opts.pager)
			$.fn.cycle.updateActivePagerLink(opts.pager, opts.currSlide);
	}

	// stage the next transtion
	var ms = 0;
	if (opts.timeout && !opts.continuous)
		ms = getTimeout(curr, next, opts, fwd);
	else if (opts.continuous && p.cyclePause) // continuous shows work off an after callback, not this timer logic
		ms = 10;
	if (ms > 0)
		p.cycleTimeout = setTimeout(function(){ go(els, opts, 0, !opts.rev) }, ms);
};

// invoked after transition
$.fn.cycle.updateActivePagerLink = function(pager, currSlide) {
	$(pager).find('a').removeClass('activeSlide').filter('a:eq('+currSlide+')').addClass('activeSlide');
};

// calculate timeout value for current transition
function getTimeout(curr, next, opts, fwd) {
	if (opts.timeoutFn) {
		// call user provided calc fn
		var t = opts.timeoutFn(curr,next,opts,fwd);
		while ((t - opts.speed) < 250) // sanitize timeout
			t += opts.speed;
		debug('calculated timeout: ' + t + '; speed: ' + opts.speed);
		if (t !== false)
			return t;
	}
	return opts.timeout;
};

// expose next/prev function, caller must pass in state
$.fn.cycle.next = function(opts) { advance(opts, opts.rev?-1:1); };
$.fn.cycle.prev = function(opts) { advance(opts, opts.rev?1:-1);};

// advance slide forward or back
function advance(opts, val) {
	var els = opts.elements;
	var p = opts.$cont[0], timeout = p.cycleTimeout;
	if (timeout) {
		clearTimeout(timeout);
		p.cycleTimeout = 0;
	}
	if (opts.random && val < 0) {
		// move back to the previously display slide
		opts.randomIndex--;
		if (--opts.randomIndex == -2)
			opts.randomIndex = els.length-2;
		else if (opts.randomIndex == -1)
			opts.randomIndex = els.length-1;
		opts.nextSlide = opts.randomMap[opts.randomIndex];
	}
	else if (opts.random) {
		if (++opts.randomIndex == els.length)
			opts.randomIndex = 0;
		opts.nextSlide = opts.randomMap[opts.randomIndex];
	}
	else {
		opts.nextSlide = opts.currSlide + val;
		if (opts.nextSlide < 0) {
			if (opts.nowrap) return false;
			opts.nextSlide = els.length - 1;
		}
		else if (opts.nextSlide >= els.length) {
			if (opts.nowrap) return false;
			opts.nextSlide = 0;
		}
	}

	if ($.isFunction(opts.prevNextClick))
		opts.prevNextClick(val > 0, opts.nextSlide, els[opts.nextSlide]);
	go(els, opts, 1, val>=0);
	return false;
};

function buildPager(els, opts) {
	var $p = $(opts.pager);
	$.each(els, function(i,o) {
		$.fn.cycle.createPagerAnchor(i,o,$p,els,opts);
	});
   $.fn.cycle.updateActivePagerLink(opts.pager, opts.startingSlide);
};

$.fn.cycle.createPagerAnchor = function(i, el, $p, els, opts) {
	var a;
	if ($.isFunction(opts.pagerAnchorBuilder))
		a = opts.pagerAnchorBuilder(i,el);
	else
		a = '<a href="#">'+(i+1)+'</a>';
		
	if (!a)
		return;
	var $a = $(a);
	// don't reparent if anchor is in the dom
	if ($a.parents('body').length === 0) {
		var arr = [];
		if ($p.length > 1) {
			$p.each(function() {
				var $clone = $a.clone(true);
				$(this).append($clone);
				arr.push($clone);
			});
			$a = $(arr);
		}
		else {
			$a.appendTo($p);
		}
	}

	$a.bind(opts.pagerEvent, function(e) {
		e.preventDefault();
		opts.nextSlide = i;
		var p = opts.$cont[0], timeout = p.cycleTimeout;
		if (timeout) {
			clearTimeout(timeout);
			p.cycleTimeout = 0;
		}
		if ($.isFunction(opts.pagerClick))
			opts.pagerClick(opts.nextSlide, els[opts.nextSlide]);
		go(els,opts,1,opts.currSlide < i); // trigger the trans
		return false;
	});
	
	if (opts.pagerEvent != 'click')
		$a.click(function(){return false;}); // supress click
	
	if (opts.pauseOnPagerHover)
		$a.hover(function() { opts.$cont[0].cyclePause++; }, function() { opts.$cont[0].cyclePause--; } );
};

// helper fn to calculate the number of slides between the current and the next
$.fn.cycle.hopsFromLast = function(opts, fwd) {
	var hops, l = opts.lastSlide, c = opts.currSlide;
	if (fwd)
		hops = c > l ? c - l : opts.slideCount - l;
	else
		hops = c < l ? l - c : l + opts.slideCount - c;
	return hops;
};

// fix clearType problems in ie6 by setting an explicit bg color
// (otherwise text slides look horrible during a fade transition)
function clearTypeFix($slides) {
	function hex(s) {
		s = parseInt(s).toString(16);
		return s.length < 2 ? '0'+s : s;
	};
	function getBg(e) {
		for ( ; e && e.nodeName.toLowerCase() != 'html'; e = e.parentNode) {
			var v = $.css(e,'background-color');
			if (v.indexOf('rgb') >= 0 ) {
				var rgb = v.match(/\d+/g);
				return '#'+ hex(rgb[0]) + hex(rgb[1]) + hex(rgb[2]);
			}
			if (v && v != 'transparent')
				return v;
		}
		return '#ffffff';
	};
	$slides.each(function() { $(this).css('background-color', getBg(this)); });
};

// reset common props before the next transition
$.fn.cycle.commonReset = function(curr,next,opts,w,h,rev) {
	$(opts.elements).not(curr).hide();
	opts.cssBefore.opacity = 1;
	opts.cssBefore.display = 'block';
	if (w !== false && next.cycleW > 0)
		opts.cssBefore.width = next.cycleW;
	if (h !== false && next.cycleH > 0)
		opts.cssBefore.height = next.cycleH;
	opts.cssAfter = opts.cssAfter || {};
	opts.cssAfter.display = 'none';
	$(curr).css('zIndex',opts.slideCount + (rev === true ? 1 : 0));
	$(next).css('zIndex',opts.slideCount + (rev === true ? 0 : 1));
};

// the actual fn for effecting a transition
$.fn.cycle.custom = function(curr, next, opts, cb, speedOverride) {
	var $l = $(curr), $n = $(next);
	var speedIn = opts.speedIn, speedOut = opts.speedOut, easeIn = opts.easeIn, easeOut = opts.easeOut;
	$n.css(opts.cssBefore);
	if (speedOverride) {
		if (typeof speedOverride == 'number')
			speedIn = speedOut = speedOverride;
		else
			speedIn = speedOut = 1;
		easeIn = easeOut = null;
	}
	var fn = function() {$n.animate(opts.animIn, speedIn, easeIn, cb)};
	$l.animate(opts.animOut, speedOut, easeOut, function() {
		if (opts.cssAfter) $l.css(opts.cssAfter);
		if (!opts.sync) fn();
	});
	if (opts.sync) fn();
};

// transition definitions - only fade is defined here, transition pack defines the rest
$.fn.cycle.transitions = {
	fade: function($cont, $slides, opts) {
		$slides.not(':eq('+opts.currSlide+')').css('opacity',0);
		opts.before.push(function(curr,next,opts) {
			$.fn.cycle.commonReset(curr,next,opts);
			opts.cssBefore.opacity = 0;
		});
		opts.animIn	   = { opacity: 1 };
		opts.animOut   = { opacity: 0 };
		opts.cssBefore = { top: 0, left: 0 };
	}
};

$.fn.cycle.ver = function() { return ver; };

// override these globally if you like (they are all optional)
$.fn.cycle.defaults = {
	fx:			  'fade', // name of transition effect (or comma separated names, ex: fade,scrollUp,shuffle)
	timeout:	   4000,  // milliseconds between slide transitions (0 to disable auto advance)
	timeoutFn:	 null,  // callback for determining per-slide timeout value:  function(currSlideElement, nextSlideElement, options, forwardFlag)
	continuous:	   0,	  // true to start next transition immediately after current one completes
	speed:		   1000,  // speed of the transition (any valid fx speed value)
	speedIn:	   null,  // speed of the 'in' transition
	speedOut:	   null,  // speed of the 'out' transition
	next:		   null,  // selector for element to use as click trigger for next slide
	prev:		   null,  // selector for element to use as click trigger for previous slide
	prevNextClick: null,  // callback fn for prev/next clicks:	function(isNext, zeroBasedSlideIndex, slideElement)
	prevNextEvent:'click',// event which drives the manual transition to the previous or next slide
	pager:		   null,  // selector for element to use as pager container
	pagerClick:	   null,  // callback fn for pager clicks:	function(zeroBasedSlideIndex, slideElement)
	pagerEvent:	  'click', // name of event which drives the pager navigation
	pagerAnchorBuilder: null, // callback fn for building anchor links:  function(index, DOMelement)
	before:		   null,  // transition callback (scope set to element to be shown):	 function(currSlideElement, nextSlideElement, options, forwardFlag)
	after:		   null,  // transition callback (scope set to element that was shown):  function(currSlideElement, nextSlideElement, options, forwardFlag)
	end:		   null,  // callback invoked when the slideshow terminates (use with autostop or nowrap options): function(options)
	easing:		   null,  // easing method for both in and out transitions
	easeIn:		   null,  // easing for "in" transition
	easeOut:	   null,  // easing for "out" transition
	shuffle:	   null,  // coords for shuffle animation, ex: { top:15, left: 200 }
	animIn:		   null,  // properties that define how the slide animates in
	animOut:	   null,  // properties that define how the slide animates out
	cssBefore:	   null,  // properties that define the initial state of the slide before transitioning in
	cssAfter:	   null,  // properties that defined the state of the slide after transitioning out
	fxFn:		   null,  // function used to control the transition: function(currSlideElement, nextSlideElement, options, afterCalback, forwardFlag)
	height:		  'auto', // container height
	startingSlide: 0,	  // zero-based index of the first slide to be displayed
	sync:		   1,	  // true if in/out transitions should occur simultaneously
	random:		   0,	  // true for random, false for sequence (not applicable to shuffle fx)
	fit:		   0,	  // force slides to fit container
	containerResize: 1,	  // resize container to fit largest slide
	pause:		   0,	  // true to enable "pause on hover"
	pauseOnPagerHover: 0, // true to pause when hovering over pager link
	autostop:	   0,	  // true to end slideshow after X transitions (where X == slide count)
	autostopCount: 0,	  // number of transitions (optionally used with autostop to define X)
	delay:		   0,	  // additional delay (in ms) for first transition (hint: can be negative)
	slideExpr:	   null,  // expression for selecting slides (if something other than all children is required)
	cleartype:	   !$.support.opacity,  // true if clearType corrections should be applied (for IE)
	cleartypeNoBg: false, // set to true to disable extra cleartype fixing (leave false to force background color setting on slides)
	nowrap:		   0,	  // true to prevent slideshow from wrapping
	fastOnEvent:   0,	  // force fast transitions when triggered manually (via pager or prev/next); value == time in ms
	randomizeEffects: 1,  // valid when multiple effects are used; true to make the effect sequence random
	rev:		   0,	 // causes animations to transition in reverse
	manualTrump:   true,  // causes manual transition to stop an active transition instead of being ignored
	requeueOnImageNotLoaded: true, // requeue the slideshow if any image slides are not yet loaded
	requeueTimeout: 250   // ms delay for requeue
};

})(jQuery);


/*!
 * jQuery Cycle Plugin Transition Definitions
 * This script is a plugin for the jQuery Cycle Plugin
 * Examples and documentation at: http://malsup.com/jquery/cycle/
 * Copyright (c) 2007-2008 M. Alsup
 * Version:	 2.72
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 */
(function($) {

//
// These functions define one-time slide initialization for the named
// transitions. To save file size feel free to remove any of these that you
// don't need.
//
$.fn.cycle.transitions.none = function($cont, $slides, opts) {
	opts.fxFn = function(curr,next,opts,after){
		$(next).show();
		$(curr).hide();
		after();
	};
}

// scrollUp/Down/Left/Right
$.fn.cycle.transitions.scrollUp = function($cont, $slides, opts) {
	$cont.css('overflow','hidden');
	opts.before.push($.fn.cycle.commonReset);
	var h = $cont.height();
	opts.cssBefore ={ top: h, left: 0 };
	opts.cssFirst = { top: 0 };
	opts.animIn	  = { top: 0 };
	opts.animOut  = { top: -h };
};
$.fn.cycle.transitions.scrollDown = function($cont, $slides, opts) {
	$cont.css('overflow','hidden');
	opts.before.push($.fn.cycle.commonReset);
	var h = $cont.height();
	opts.cssFirst = { top: 0 };
	opts.cssBefore= { top: -h, left: 0 };
	opts.animIn	  = { top: 0 };
	opts.animOut  = { top: h };
};
$.fn.cycle.transitions.scrollLeft = function($cont, $slides, opts) {
	$cont.css('overflow','hidden');
	opts.before.push($.fn.cycle.commonReset);
	var w = $cont.width();
	opts.cssFirst = { left: 0 };
	opts.cssBefore= { left: w, top: 0 };
	opts.animIn	  = { left: 0 };
	opts.animOut  = { left: 0-w };
};
$.fn.cycle.transitions.scrollRight = function($cont, $slides, opts) {
	$cont.css('overflow','hidden');
	opts.before.push($.fn.cycle.commonReset);
	var w = $cont.width();
	opts.cssFirst = { left: 0 };
	opts.cssBefore= { left: -w, top: 0 };
	opts.animIn	  = { left: 0 };
	opts.animOut  = { left: w };
};
$.fn.cycle.transitions.scrollHorz = function($cont, $slides, opts) {
	$cont.css('overflow','hidden').width();
	opts.before.push(function(curr, next, opts, fwd) {
		$.fn.cycle.commonReset(curr,next,opts);
		opts.cssBefore.left = fwd ? (next.cycleW-1) : (1-next.cycleW);
		opts.animOut.left = fwd ? -curr.cycleW : curr.cycleW;
	});
	opts.cssFirst = { left: 0 };
	opts.cssBefore= { top: 0 };
	opts.animIn   = { left: 0 };
	opts.animOut  = { top: 0 };
};
$.fn.cycle.transitions.scrollVert = function($cont, $slides, opts) {
	$cont.css('overflow','hidden');
	opts.before.push(function(curr, next, opts, fwd) {
		$.fn.cycle.commonReset(curr,next,opts);
		opts.cssBefore.top = fwd ? (1-next.cycleH) : (next.cycleH-1);
		opts.animOut.top = fwd ? curr.cycleH : -curr.cycleH;
	});
	opts.cssFirst = { top: 0 };
	opts.cssBefore= { left: 0 };
	opts.animIn   = { top: 0 };
	opts.animOut  = { left: 0 };
};

// slideX/slideY
$.fn.cycle.transitions.slideX = function($cont, $slides, opts) {
	opts.before.push(function(curr, next, opts) {
		$(opts.elements).not(curr).hide();
		$.fn.cycle.commonReset(curr,next,opts,false,true);
		opts.animIn.width = next.cycleW;
	});
	opts.cssBefore = { left: 0, top: 0, width: 0 };
	opts.animIn	 = { width: 'show' };
	opts.animOut = { width: 0 };
};
$.fn.cycle.transitions.slideY = function($cont, $slides, opts) {
	opts.before.push(function(curr, next, opts) {
		$(opts.elements).not(curr).hide();
		$.fn.cycle.commonReset(curr,next,opts,true,false);
		opts.animIn.height = next.cycleH;
	});
	opts.cssBefore = { left: 0, top: 0, height: 0 };
	opts.animIn	 = { height: 'show' };
	opts.animOut = { height: 0 };
};

// shuffle
$.fn.cycle.transitions.shuffle = function($cont, $slides, opts) {
	var i, w = $cont.css('overflow', 'visible').width();
	$slides.css({left: 0, top: 0});
	opts.before.push(function(curr,next,opts) {
		$.fn.cycle.commonReset(curr,next,opts,true,true,true);
	});
	// only adjust speed once!
	if (!opts.speedAdjusted) {
		opts.speed = opts.speed / 2; // shuffle has 2 transitions
		opts.speedAdjusted = true;
	}
	opts.random = 0;
	opts.shuffle = opts.shuffle || {left:-w, top:15};
	opts.els = [];
	for (i=0; i < $slides.length; i++)
		opts.els.push($slides[i]);

	for (i=0; i < opts.currSlide; i++)
		opts.els.push(opts.els.shift());

	// custom transition fn (hat tip to Benjamin Sterling for this bit of sweetness!)
	opts.fxFn = function(curr, next, opts, cb, fwd) {
		var $el = fwd ? $(curr) : $(next);
		$(next).css(opts.cssBefore);
		var count = opts.slideCount;
		$el.animate(opts.shuffle, opts.speedIn, opts.easeIn, function() {
			var hops = $.fn.cycle.hopsFromLast(opts, fwd);
			for (var k=0; k < hops; k++)
				fwd ? opts.els.push(opts.els.shift()) : opts.els.unshift(opts.els.pop());
			if (fwd) {
				for (var i=0, len=opts.els.length; i < len; i++)
					$(opts.els[i]).css('z-index', len-i+count);
			}
			else {
				var z = $(curr).css('z-index');
				$el.css('z-index', parseInt(z)+1+count);
			}
			$el.animate({left:0, top:0}, opts.speedOut, opts.easeOut, function() {
				$(fwd ? this : curr).hide();
				if (cb) cb();
			});
		});
	};
	opts.cssBefore = { display: 'block', opacity: 1, top: 0, left: 0 };
};

// turnUp/Down/Left/Right
$.fn.cycle.transitions.turnUp = function($cont, $slides, opts) {
	opts.before.push(function(curr, next, opts) {
		$.fn.cycle.commonReset(curr,next,opts,true,false);
		opts.cssBefore.top = next.cycleH;
		opts.animIn.height = next.cycleH;
	});
	opts.cssFirst  = { top: 0 };
	opts.cssBefore = { left: 0, height: 0 };
	opts.animIn	   = { top: 0 };
	opts.animOut   = { height: 0 };
};
$.fn.cycle.transitions.turnDown = function($cont, $slides, opts) {
	opts.before.push(function(curr, next, opts) {
		$.fn.cycle.commonReset(curr,next,opts,true,false);
		opts.animIn.height = next.cycleH;
		opts.animOut.top   = curr.cycleH;
	});
	opts.cssFirst  = { top: 0 };
	opts.cssBefore = { left: 0, top: 0, height: 0 };
	opts.animOut   = { height: 0 };
};
$.fn.cycle.transitions.turnLeft = function($cont, $slides, opts) {
	opts.before.push(function(curr, next, opts) {
		$.fn.cycle.commonReset(curr,next,opts,false,true);
		opts.cssBefore.left = next.cycleW;
		opts.animIn.width = next.cycleW;
	});
	opts.cssBefore = { top: 0, width: 0  };
	opts.animIn	   = { left: 0 };
	opts.animOut   = { width: 0 };
};
$.fn.cycle.transitions.turnRight = function($cont, $slides, opts) {
	opts.before.push(function(curr, next, opts) {
		$.fn.cycle.commonReset(curr,next,opts,false,true);
		opts.animIn.width = next.cycleW;
		opts.animOut.left = curr.cycleW;
	});
	opts.cssBefore = { top: 0, left: 0, width: 0 };
	opts.animIn	   = { left: 0 };
	opts.animOut   = { width: 0 };
};

// zoom
$.fn.cycle.transitions.zoom = function($cont, $slides, opts) {
	opts.before.push(function(curr, next, opts) {
		$.fn.cycle.commonReset(curr,next,opts,false,false,true);
		opts.cssBefore.top = next.cycleH/2;
		opts.cssBefore.left = next.cycleW/2;
		opts.animIn	   = { top: 0, left: 0, width: next.cycleW, height: next.cycleH };
		opts.animOut   = { width: 0, height: 0, top: curr.cycleH/2, left: curr.cycleW/2 };
	});
	opts.cssFirst = { top:0, left: 0 };
	opts.cssBefore = { width: 0, height: 0 };
};

// fadeZoom
$.fn.cycle.transitions.fadeZoom = function($cont, $slides, opts) {
	opts.before.push(function(curr, next, opts) {
		$.fn.cycle.commonReset(curr,next,opts,false,false);
		opts.cssBefore.left = next.cycleW/2;
		opts.cssBefore.top = next.cycleH/2;
		opts.animIn	= { top: 0, left: 0, width: next.cycleW, height: next.cycleH };
	});
	opts.cssBefore = { width: 0, height: 0 };
	opts.animOut  = { opacity: 0 };
};

// blindX
$.fn.cycle.transitions.blindX = function($cont, $slides, opts) {
	var w = $cont.css('overflow','hidden').width();
	opts.before.push(function(curr, next, opts) {
		$.fn.cycle.commonReset(curr,next,opts);
		opts.animIn.width = next.cycleW;
		opts.animOut.left   = curr.cycleW;
	});
	opts.cssBefore = { left: w, top: 0 };
	opts.animIn = { left: 0 };
	opts.animOut  = { left: w };
};
// blindY
$.fn.cycle.transitions.blindY = function($cont, $slides, opts) {
	var h = $cont.css('overflow','hidden').height();
	opts.before.push(function(curr, next, opts) {
		$.fn.cycle.commonReset(curr,next,opts);
		opts.animIn.height = next.cycleH;
		opts.animOut.top   = curr.cycleH;
	});
	opts.cssBefore = { top: h, left: 0 };
	opts.animIn = { top: 0 };
	opts.animOut  = { top: h };
};
// blindZ
$.fn.cycle.transitions.blindZ = function($cont, $slides, opts) {
	var h = $cont.css('overflow','hidden').height();
	var w = $cont.width();
	opts.before.push(function(curr, next, opts) {
		$.fn.cycle.commonReset(curr,next,opts);
		opts.animIn.height = next.cycleH;
		opts.animOut.top   = curr.cycleH;
	});
	opts.cssBefore = { top: h, left: w };
	opts.animIn = { top: 0, left: 0 };
	opts.animOut  = { top: h, left: w };
};

// growX - grow horizontally from centered 0 width
$.fn.cycle.transitions.growX = function($cont, $slides, opts) {
	opts.before.push(function(curr, next, opts) {
		$.fn.cycle.commonReset(curr,next,opts,false,true);
		opts.cssBefore.left = this.cycleW/2;
		opts.animIn = { left: 0, width: this.cycleW };
		opts.animOut = { left: 0 };
	});
	opts.cssBefore = { width: 0, top: 0 };
};
// growY - grow vertically from centered 0 height
$.fn.cycle.transitions.growY = function($cont, $slides, opts) {
	opts.before.push(function(curr, next, opts) {
		$.fn.cycle.commonReset(curr,next,opts,true,false);
		opts.cssBefore.top = this.cycleH/2;
		opts.animIn = { top: 0, height: this.cycleH };
		opts.animOut = { top: 0 };
	});
	opts.cssBefore = { height: 0, left: 0 };
};

// curtainX - squeeze in both edges horizontally
$.fn.cycle.transitions.curtainX = function($cont, $slides, opts) {
	opts.before.push(function(curr, next, opts) {
		$.fn.cycle.commonReset(curr,next,opts,false,true,true);
		opts.cssBefore.left = next.cycleW/2;
		opts.animIn = { left: 0, width: this.cycleW };
		opts.animOut = { left: curr.cycleW/2, width: 0 };
	});
	opts.cssBefore = { top: 0, width: 0 };
};
// curtainY - squeeze in both edges vertically
$.fn.cycle.transitions.curtainY = function($cont, $slides, opts) {
	opts.before.push(function(curr, next, opts) {
		$.fn.cycle.commonReset(curr,next,opts,true,false,true);
		opts.cssBefore.top = next.cycleH/2;
		opts.animIn = { top: 0, height: next.cycleH };
		opts.animOut = { top: curr.cycleH/2, height: 0 };
	});
	opts.cssBefore = { left: 0, height: 0 };
};

// cover - curr slide covered by next slide
$.fn.cycle.transitions.cover = function($cont, $slides, opts) {
	var d = opts.direction || 'left';
	var w = $cont.css('overflow','hidden').width();
	var h = $cont.height();
	opts.before.push(function(curr, next, opts) {
		$.fn.cycle.commonReset(curr,next,opts);
		if (d == 'right')
			opts.cssBefore.left = -w;
		else if (d == 'up')
			opts.cssBefore.top = h;
		else if (d == 'down')
			opts.cssBefore.top = -h;
		else
			opts.cssBefore.left = w;
	});
	opts.animIn = { left: 0, top: 0};
	opts.animOut = { opacity: 1 };
	opts.cssBefore = { top: 0, left: 0 };
};

// uncover - curr slide moves off next slide
$.fn.cycle.transitions.uncover = function($cont, $slides, opts) {
	var d = opts.direction || 'left';
	var w = $cont.css('overflow','hidden').width();
	var h = $cont.height();
	opts.before.push(function(curr, next, opts) {
		$.fn.cycle.commonReset(curr,next,opts,true,true,true);
		if (d == 'right')
			opts.animOut.left = w;
		else if (d == 'up')
			opts.animOut.top = -h;
		else if (d == 'down')
			opts.animOut.top = h;
		else
			opts.animOut.left = -w;
	});
	opts.animIn = { left: 0, top: 0 };
	opts.animOut = { opacity: 1 };
	opts.cssBefore = { top: 0, left: 0 };
};

// toss - move top slide and fade away
$.fn.cycle.transitions.toss = function($cont, $slides, opts) {
	var w = $cont.css('overflow','visible').width();
	var h = $cont.height();
	opts.before.push(function(curr, next, opts) {
		$.fn.cycle.commonReset(curr,next,opts,true,true,true);
		// provide default toss settings if animOut not provided
		if (!opts.animOut.left && !opts.animOut.top)
			opts.animOut = { left: w*2, top: -h/2, opacity: 0 };
		else
			opts.animOut.opacity = 0;
	});
	opts.cssBefore = { left: 0, top: 0 };
	opts.animIn = { left: 0 };
};

// wipe - clip animation
$.fn.cycle.transitions.wipe = function($cont, $slides, opts) {
	var w = $cont.css('overflow','hidden').width();
	var h = $cont.height();
	opts.cssBefore = opts.cssBefore || {};
	var clip;
	if (opts.clip) {
		if (/l2r/.test(opts.clip))
			clip = 'rect(0px 0px '+h+'px 0px)';
		else if (/r2l/.test(opts.clip))
			clip = 'rect(0px '+w+'px '+h+'px '+w+'px)';
		else if (/t2b/.test(opts.clip))
			clip = 'rect(0px '+w+'px 0px 0px)';
		else if (/b2t/.test(opts.clip))
			clip = 'rect('+h+'px '+w+'px '+h+'px 0px)';
		else if (/zoom/.test(opts.clip)) {
			var top = parseInt(h/2);
			var left = parseInt(w/2);
			clip = 'rect('+top+'px '+left+'px '+top+'px '+left+'px)';
		}
	}

	opts.cssBefore.clip = opts.cssBefore.clip || clip || 'rect(0px 0px 0px 0px)';

	var d = opts.cssBefore.clip.match(/(\d+)/g);
	var t = parseInt(d[0]), r = parseInt(d[1]), b = parseInt(d[2]), l = parseInt(d[3]);

	opts.before.push(function(curr, next, opts) {
		if (curr == next) return;
		var $curr = $(curr), $next = $(next);
		$.fn.cycle.commonReset(curr,next,opts,true,true,false);
		opts.cssAfter.display = 'block';

		var step = 1, count = parseInt((opts.speedIn / 13)) - 1;
		(function f() {
			var tt = t ? t - parseInt(step * (t/count)) : 0;
			var ll = l ? l - parseInt(step * (l/count)) : 0;
			var bb = b < h ? b + parseInt(step * ((h-b)/count || 1)) : h;
			var rr = r < w ? r + parseInt(step * ((w-r)/count || 1)) : w;
			$next.css({ clip: 'rect('+tt+'px '+rr+'px '+bb+'px '+ll+'px)' });
			(step++ <= count) ? setTimeout(f, 13) : $curr.css('display', 'none');
		})();
	});
	opts.cssBefore = { display: 'block', opacity: 1, top: 0, left: 0 };
	opts.animIn	   = { left: 0 };
	opts.animOut   = { left: 0 };
};

})(jQuery);
;

/*jslint bitwise: true, eqeqeq: true, immed: true, newcap: true, nomen: false,
 onevar: false, plusplus: false, regexp: true, undef: true, white: true, indent: 2
 browser: true */

/*global jQuery: true Drupal: true window: true */

(function ($) {
  Drupal.behaviors.rotatingBanner = {
    attach: function (context) {
      $('.rotating-banner', context).once('jCycleActivated', function () {
        if (!Drupal.settings.rotatingBanners) {
          return;
        }
        var settings = Drupal.settings.rotatingBanners[this.id].cycle;
        if ($.fn.cycle === 'undefined' || $.fn.cycle === undefined) {
          alert(Drupal.t('Jquery Cycle is not installed and is required by the rotating_banner module.\n\nSee the README.txt'));
          return;
        }

        settings.fit = 1;
        settings.cleartypeNoBg = true;

        if(Drupal.settings.rotatingBanners[this.id].controls == 'prev_next') {
          settings.prev = "#" + this.id + " .prev";
          settings.next = "#" + this.id + " .next";
        } else {
          settings.pager = "#" + this.id + " .controls";
        }
				
        $('.rb-slides', this).cycle(settings);
      });
    }
  };  
})(jQuery);
;
Drupal.behaviors.mediaGalleryColorbox = {};

Drupal.behaviors.mediaGalleryColorbox.attach = function (context, settings) {
  var $ = jQuery, $galleries, $gallery, href, $links, $link, $dummyLinksPre, $dummyLinksPost, i, j;
  if ($.fn.colorbox) {
    // Add a colorbox group for each media gallery field on the page.
    $galleries = $('.field-name-media-gallery-media');
    for (i = 0; i < $galleries.length; i++) {
      $gallery = $($galleries[i]);
      $links = $('a.cbEnabled', $gallery);
      $dummyLinksPre = $gallery.parent().find('ul:has(a.colorbox-supplemental-link.pre)');
      $dummyLinksPost = $gallery.parent().find('ul:has(a.colorbox-supplemental-link.post)');
      $dummyLinksPost.appendTo($gallery);
      $links = $links.add('a', $dummyLinksPre).add('a', $dummyLinksPost);
      $links.attr('rel', 'colorbox-' + i);
      for (j = 0; j < $links.length; j++) {
        // Change the link href to point to the lightbox version of the media.
        $link = $($links[j]);
        href = $link.attr('href');
        $link.attr('href', href.replace(/\/detail\/([0-9]+)\/([0-9]+)/, '/lightbox/$1/$2'));
      }
      $links.not('.meta-wrapper').colorbox({
        slideshow: true,
        slideshowAuto: false,
        slideshowStart: Drupal.t('Slideshow'),
        slideshowStop: '[' + Drupal.t('stop slideshow') + ']',
        slideshowSpeed: 4000,
        current: Drupal.t('Item !current of !total', {'!current':'{current}', '!total':'{total}'}),
        innerWidth: 'auto',
        // If 'title' evaluates to false, Colorbox will use the title from the
        // underlying <a> element, which we don't want. Using a space is the
        // officially approved workaround. See
        // http://groups.google.com/group/colorbox/msg/7671ae69708950bf
        title: ' ',
        transition: 'fade',
        preloading: true,
        fastIframe: false,
        onComplete: function () {
          $(this).colorbox.resize();
        }
      });
    }
    $('a.meta-wrapper').bind('click', Drupal.mediaGalleryColorbox.metaClick);
    // Subscribe to the media_youtube module's load event, so we can pause
    // the slideshow and play the video.
    $(window).bind('media_youtube_load', Drupal.mediaGalleryColorbox.handleMediaYoutubeLoad);
  }
};

Drupal.mediaGalleryColorbox = {};

/**
 * Handles the click event on the metadata.
 */
Drupal.mediaGalleryColorbox.metaClick = function (event) {
  event.preventDefault();
  jQuery(this).prev('.media-gallery-item').find('a.cbEnabled').click();
};

/**
 * Handles the media_youtube module's load event.
 *
 * If the colorbox slideshow is playing, and it gets to a video, the video
 * should play automatically, and the slideshow should pause until it's done.
 */
Drupal.mediaGalleryColorbox.handleMediaYoutubeLoad = function (event, videoSettings) {
  var $ = jQuery;
  var slideshowOn = $('#colorbox').hasClass('cboxSlideshow_on');
  // Set a width on a wrapper for the video so that the colorbox will size properly.
  $('#colorbox .media-gallery-item').width(videoSettings.width + 'px').height(videoSettings.height + 'px');
  if (slideshowOn) {
    videoSettings.options.autoplay = 1;
    $('#cboxSlideshow')
      // Turn off the slideshow while the video is playing.
      .click() // No, there is not a better way.
      .text('[' + Drupal.t('resume slideshow') + ']');
      // TODO: If YouTube makes its JavaScript API available for iframe videos,
      // set the slideshow to restart when the video is done playing.
  }
};
;
(function ($) {

Drupal.toolbar = Drupal.toolbar || {};

/**
 * Attach toggling behavior and notify the overlay of the toolbar.
 */
Drupal.behaviors.toolbar = {
  attach: function(context) {

    // Set the initial state of the toolbar.
    $('#toolbar', context).once('toolbar', Drupal.toolbar.init);

    // Toggling toolbar drawer.
    $('#toolbar a.toggle', context).once('toolbar-toggle').click(function(e) {
      Drupal.toolbar.toggle();
      // Allow resize event handlers to recalculate sizes/positions.
      $(window).triggerHandler('resize');
      return false;
    });
  }
};

/**
 * Retrieve last saved cookie settings and set up the initial toolbar state.
 */
Drupal.toolbar.init = function() {
  // Retrieve the collapsed status from a stored cookie.
  var collapsed = $.cookie('Drupal.toolbar.collapsed');

  // Expand or collapse the toolbar based on the cookie value.
  if (collapsed == 1) {
    Drupal.toolbar.collapse();
  }
  else {
    Drupal.toolbar.expand();
  }
};

/**
 * Collapse the toolbar.
 */
Drupal.toolbar.collapse = function() {
  var toggle_text = Drupal.t('Show shortcuts');
  $('#toolbar div.toolbar-drawer').addClass('collapsed');
  $('#toolbar a.toggle')
    .removeClass('toggle-active')
    .attr('title',  toggle_text)
    .html(toggle_text);
  $('body').removeClass('toolbar-drawer').css('paddingTop', Drupal.toolbar.height());
  $.cookie(
    'Drupal.toolbar.collapsed',
    1,
    {
      path: Drupal.settings.basePath,
      // The cookie should "never" expire.
      expires: 36500
    }
  );
};

/**
 * Expand the toolbar.
 */
Drupal.toolbar.expand = function() {
  var toggle_text = Drupal.t('Hide shortcuts');
  $('#toolbar div.toolbar-drawer').removeClass('collapsed');
  $('#toolbar a.toggle')
    .addClass('toggle-active')
    .attr('title',  toggle_text)
    .html(toggle_text);
  $('body').addClass('toolbar-drawer').css('paddingTop', Drupal.toolbar.height());
  $.cookie(
    'Drupal.toolbar.collapsed',
    0,
    {
      path: Drupal.settings.basePath,
      // The cookie should "never" expire.
      expires: 36500
    }
  );
};

/**
 * Toggle the toolbar.
 */
Drupal.toolbar.toggle = function() {
  if ($('#toolbar div.toolbar-drawer').hasClass('collapsed')) {
    Drupal.toolbar.expand();
  }
  else {
    Drupal.toolbar.collapse();
  }
};

Drupal.toolbar.height = function() {
  var height = $('#toolbar').outerHeight();
  // In IE, Shadow filter adds some extra height, so we need to remove it from
  // the returned height.
  if ($('#toolbar').css('filter').match(/DXImageTransform\.Microsoft\.Shadow/)) {
    height -= $('#toolbar').get(0).filters.item("DXImageTransform.Microsoft.Shadow").strength;
  }
  return height;
};

})(jQuery);
;
/* Based on overlay-parent.js,v 1.22 2010/01/14 04:06:54 webchick */

(function ($) {

// Only act if overlay is found.
if (!Drupal.overlay) {
  return;
}

/**
 * Event handler: opens or closes the overlay based on the current URL fragment.
 *
 * @param event
 *   Event being triggered, with the following restrictions:
 *   - event.type: hashchange
 *   - event.currentTarget: document
 *
 * Overrides the same method from overlay-parent.js
 */
Drupal.overlay.eventhandlerOperateByURLFragment = function (event) {
  // If we changed the hash to reflect an internal redirect in the overlay,
  // its location has already been changed, so don't do anything.
  if ($.data(window.location, window.location.href) === 'redirect') {
    $.data(window.location, window.location.href, null);
    return;
  }

  // Get the overlay URL from the current URL fragment.
  var state = $.bbq.getState('overlay');
  if (state) {
    // Append render variable, so the server side can choose the right
    // rendering and add child frame code to the page if needed.
    var url = $.param.querystring(Drupal.settings.basePath + state, { render: 'overlay' });

    this.open(url);
    this.resetActiveClass(this.getPath(Drupal.settings.basePath + state));

    // @gardens: look for gardener specific paths.
    var isGardener = (state.indexOf('gardener/') > -1);
    if (isGardener) {
      // Ok, now we can tell the parent window we're ready.
      // @todo revisit this to use the overlay API more properly.
      $(this.inactiveFrame).addClass('overlay-active');
    }
  }

  // If there is no overlay URL in the fragment and the overlay is (still)
  // open, close the overlay.
  else if (this.isOpen && !this.isClosing) {
    this.close();
    this.resetActiveClass(this.getPath(window.location));
  }
};

})(jQuery);
;

/*jslint bitwise: true, eqeqeq: true, immed: true, newcap: true, nomen: false,
 onevar: false, plusplus: false, regexp: true, undef: true, white: true, indent: 2
 browser: true */

/*global jQuery: true Drupal: true AjaxUpload: true ThemeBuilder: true*/

/**
 * @namespace
 */
ThemeBuilder.brand = ThemeBuilder.brand || {};

/**
 * The LogoPicker class is responsible for the Brand tab's Logo subtab.
 * @class
 */
ThemeBuilder.brand.LogoPicker = ThemeBuilder.initClass();

ThemeBuilder.brand.LogoPicker.uploadDisabledTxt = Drupal.t('Uploading...');
ThemeBuilder.brand.LogoPicker.uploadEnabledTxt = null;

ThemeBuilder.brand.LogoPicker.prototype.initialize = function () {
  this.tabName = "logo";
  var app = ThemeBuilder.getApplicationInstance();
  var data = app.getData();
  if (data) {
    this.createModifications(data);
  }
  else {
    app.addApplicationInitializer(ThemeBuilder.bind(this, this.createModifications));
  }
};

/**
 * Create modifications for the logo and favicon.
 *
 * @param {Object} data
 *   Application data from the ThemeBuilder.Application object.
 */
ThemeBuilder.brand.LogoPicker.prototype.createModifications = function (data) {
  this.logoModification = new ThemeBuilder.ThemeSettingModification('default_logo_path');
  this.logoModification.setPriorState(data.default_logo_path);
  this.faviconModification = new ThemeBuilder.ThemeSettingModification('default_favicon_path');
  this.faviconModification.setPriorState(data.default_favicon_path);
};

/**
 * Initializes the Logo subtab of the Brand tab.
 */
ThemeBuilder.brand.LogoPicker.prototype.setupTab = function () {
  var $ = jQuery;
  var that = this;

  // Set up "Browse" buttons.
  var logoButton = $('#logo-uploader');
  ThemeBuilder.brand.LogoPicker.uploadEnabledTxt = Drupal.t(logoButton.html());

  this.logoUploader = new AjaxUpload(logoButton, {
    action: Drupal.settings.basePath + 'styleedit-file-upload',
    name: 'files[styleedit]',
    data: {
      'form_token': ThemeBuilder.getToken('styleedit-file-upload')
    },
    //responseType: 'json',
    onSubmit: ThemeBuilder.bindIgnoreCallerArgs(this, this.disableUploader, this.uploadDisabledText),
    onComplete: ThemeBuilder.bind(this, this.logoUploadComplete)
  });

  var faviconButton = $('#favicon-uploader');
  this.faviconUploader = new AjaxUpload(faviconButton, {
    action: Drupal.settings.basePath + 'styleedit-file-upload/favicon',
    name: 'files[styleedit]',
    data: {
      'form_token': ThemeBuilder.getToken('styleedit-file-upload')
    },
    //responseType: 'json',
    onSubmit: ThemeBuilder.bindIgnoreCallerArgs(this, this.disableUploader, this.uploadDisabledText),
    onComplete: ThemeBuilder.bind(this, this.faviconUploadComplete)
  });

  // Set up "Remove" links.
  $('#themebuilder-main .themebuilder-brand-logo a').click(ThemeBuilder.bind(this, this.removeLogo));
  $('#themebuilder-main .themebuilder-brand-favicon a').click(ThemeBuilder.bind(this, this.removeFavicon));
};

/**
 * Disables the uploaders.
 *
 * @param {String} newText
 *   Optional text that can be used to replace the button text as the uploader is disabled.
 */
ThemeBuilder.brand.LogoPicker.prototype.disableUploader = function (newText) {
  var $ = jQuery;
  if (newText) {
    $('#logo-uploader').text(newText);
    $('#favicon-uploader').text(newText);
  }
  this.logoUploader.disable();
  this.faviconUploader.disable();
};

/**
 * Enables the uploaders.
 *
 * @param {String} newText
 *   Optional text that can be used to replace the button text.
 */
ThemeBuilder.brand.LogoPicker.prototype.enableUploader = function (newText) {
  var $ = jQuery;
  if (newText) {
    $('#logo-uploader').text(newText);
    $('#favicon-uploader').text(newText);
  }
  this.logoUploader.enable();
  this.faviconUploader.enable();
};

/**
 * Called when the uploader is finished uploading a file.
 *
 * @param {String} file
 *   The name of the file that was uploaded.
 * @param {String} response
 *   The response code from the upload.
 */
ThemeBuilder.brand.LogoPicker.prototype.logoUploadComplete = function (file, response) {
  this.enableUploader(ThemeBuilder.brand.LogoPicker.uploadEnabledTxt);
  if (this.isImageFile(response)) {
    this.logoModification.setNewState(response);
    ThemeBuilder.applyModification(this.logoModification);
    this.logoModification = this.logoModification.getFreshModification();
  }
};

/**
 * Called when the uploader is finished uploading a file.
 *
 * @param {String} file
 *   The name of the file that was uploaded.
 * @param {String} response
 *   The response code from the upload.
 */
ThemeBuilder.brand.LogoPicker.prototype.faviconUploadComplete = function (file, response) {
  this.enableUploader(ThemeBuilder.brand.LogoPicker.uploadEnabledTxt);
  if (this.isImageFile(response)) {
    this.faviconModification.setNewState(response);
    ThemeBuilder.applyModification(this.faviconModification);
    this.faviconModification = this.faviconModification.getFreshModification();
    // Favicons can't be updated live on IE or Webkit.
    if (jQuery.browser.msie || jQuery.browser.webkit) {
      var bar = ThemeBuilder.Bar.getInstance();
      bar.setStatus(Drupal.t('The favicon will appear on your next page refresh.'));
    }
  }
};


ThemeBuilder.brand.LogoPicker.prototype.removeLogo = function () {
  this.logoModification.setNewState('');
  ThemeBuilder.applyModification(this.logoModification);
  this.logoModification = this.logoModification.getFreshModification();
};

ThemeBuilder.brand.LogoPicker.prototype.removeFavicon = function () {
  this.faviconModification.setNewState('');
  ThemeBuilder.applyModification(this.faviconModification);
  this.faviconModification = this.faviconModification.getFreshModification();
};

/**
 * Acceptable image extensions.
 *
 * A case insensitive compare is done on the following extensions to
 * determine if the filename represents an acceptable image.
 */
ThemeBuilder.brand.LogoPicker.imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'ico'];

/**
 * Determines if the specified filename represents a valid image filename.
 *
 * We have had cases in which an HTML document gets added to the
 * theme's .info file, causing really bad things to happen.
 *
 * @param {String} file
 *   The filename
 * @return {boolean}
 *   true if the filename represents a valid image file; false otherwise.
 */
ThemeBuilder.brand.LogoPicker.prototype.isImageFile = function (file) {
  if (file && typeof(file) === 'string') {
    // The size of the 'value' property in the themebuilder_css table
    // is 512 characters.
    if (file.length < 500) {
      var extension = this.getFileExtension(file);
      if (extension !== null) {
        extension = extension.toLowerCase();
        var extensionSet = ThemeBuilder.brand.LogoPicker.imageExtensions;
        for (var i = 0; i < extensionSet.length; i++) {
          if (extension === extensionSet[i]) {
            return true;
          }
        }
      }
    }
  }
  return false;
};

/**
 * Returns the extension of the specified filename.
 *
 * If the parameter doesn't represent a file with an extension, null
 * is returned instead.
 *
 * @param {String} file
 *   The name of the image file.
 * @return {String}
 *   The file extension or null if the name doesn't have an extension.
 */
ThemeBuilder.brand.LogoPicker.prototype.getFileExtension = function (file) {
  var index = file.lastIndexOf('.');
  if (index > 0 && (index + 1) < file.length) {
    return file.substring(index + 1);
  }
  return null;
};
;
/*jslint bitwise: true, eqeqeq: true, immed: true, newcap: true, nomen: false,
 onevar: false, plusplus: false, regexp: true, undef: true, white: true, indent: 2
 browser: true */

/*global window: true jQuery: true Drupal: true ThemeBuilder: true*/

var ThemeBuilder = ThemeBuilder || {};

/**
 * @namespace
 */
ThemeBuilder.brandEditor = ThemeBuilder.brandEditor || {};

ThemeBuilder.brandEditor.PalettePicker = function (swatchDiv) {
  this.enabled = true;
  this.swatchDiv = jQuery(swatchDiv);
  this.paletteItems = {};

  // Set up a CSS modification object for changing an element to another color.
  this.modification = new ThemeBuilder.GroupedModification();
  ThemeBuilder.getApplicationInstance().addApplicationInitializer(
    ThemeBuilder.bind(this, this.colorDataLoaded));
};

ThemeBuilder.extend(ThemeBuilder.brandEditor.PalettePicker,
  ThemeBuilder.styles.PalettePicker);

ThemeBuilder.brandEditor.PalettePicker.prototype.show = function () {
  this.swatchDiv.show();
};

ThemeBuilder.brandEditor.PalettePicker.prototype.colorDataLoaded = function () {
  var colorManager = ThemeBuilder.getColorManager();
  if (!colorManager.isInitialized()) {
    // Cannot initialize yet. We need the color manager to be fully initialized
    // first.
    setTimeout(ThemeBuilder.bindIgnoreCallerArgs(this, this.colorDataLoaded),
      50);
    return;
  }
  this.palette = colorManager.getPalette();
  this.custom = colorManager.getCustom();

  var indexes = colorManager.getIndexes('palette');
  this.renderPalletesToTable(jQuery('.palette-list-table', this.swatchDiv), 7);

  // Set up events:
  // Show/hide the dialog box when its swatch is clicked.
  this.swatchDiv.click(ThemeBuilder.bind(this, this.show));
};

ThemeBuilder.brandEditor.PalettePicker.prototype.setPalette = function (e) {
  // call the super class
  ThemeBuilder.brandEditor.PalettePicker.superproto.setPalette.call(this, e);
  // Also commit the change.
  ThemeBuilder.applyModification(this.modification);
  // Create a new modification instance to keep the modifications distinct.
  this.modification = new ThemeBuilder.GroupedModification();
};

ThemeBuilder.brand = ThemeBuilder.brand || {};

var Drupal = Drupal || parent.Drupal;

(function ($) {

  /**
   * Invoked after the brand tab is started. Primarily it is used to setup event
   * handlers
   * 
   */
  ThemeBuilder.brandEditor.init = function () {
    // tab-ize
    $('#themebuilder-brand').tabs({
      show : function (event, ui) {
        return true;
      }
    });
    // Set up the logo subtab.
    this.logoPicker = new ThemeBuilder.brand.LogoPicker();
    this.logoPicker.setupTab();

    var palettePicker = new ThemeBuilder.brandEditor.PalettePicker(
      '#themebuilder-brand-palette-picker');
    palettePicker.show();
    ThemeBuilder.addModificationHandler(ThemeBuilder.ThemeSettingModification.TYPE, this);
    $(window).bind('ModificationCommitted', ThemeBuilder.brandEditor._modificationCommitted);
  };

  /**
   * Invoked when a different tab is selected.
   */
  ThemeBuilder.brandEditor.hide = function () {
  };

  /**
   * Invoked when the brand tab is selected.
   */
  ThemeBuilder.brandEditor.show = function () {
    return true;
  };

  /**
   * Applies the specified modification description to the client side only.
   * This allows the user to preview the modification without committing it
   * to the theme.
   *
   * @param {Object} state
   *   The modification description.  To get this value, you should pass in
   *   the result of Modification.getNewState() or Modification.getPriorState().
   * @param {Modification} modification
   *   The modification that represents the change in the current state that
   *   should be previewed.
   */
  ThemeBuilder.brandEditor.preview = function (state, modification) {
    var imagePath;
    switch (state.selector) {
    case 'default_logo_path':
      ThemeBuilder.brandEditor._blockSet = false;
      ThemeBuilder.brandEditor._logoCommitted = false;
      var headerInner = '.stack-header-inner .col-c';
      // Specify a logo image.
      if (state.value) {
        // TODO: The cleanImage() function could clearly use a better home.
        imagePath = Drupal.settings.basePath +
          Drupal.settings.themebuilderCurrentThemePath + "/" +
          ThemeBuilder.styles.BackgroundEditor.prototype.cleanImage(state.value);

        if (jQuery('.logo img', headerInner).length > 0) {
          jQuery('.logo:hidden', headerInner).show();
          jQuery('.logo img', headerInner).attr('src', imagePath);
        }
        else {
          // The markup for the logo is not on the page.  Try to
          // enable the block.
          if (confirm(Drupal.t("The logo will only appear if the 'Site logo' block is enabled.  Would you like to enable it now?"))) {
            // Note that we use the same handler for success and
            // failure.  With older themes that don't use the block, the
            // success of setting the block makes no difference because a
            // page refresh will cause the markup for the logo to be
            // rendered.
            ThemeBuilder.postBack('themebuilder-brand-configure-logo', {}, ThemeBuilder.brandEditor._blockConfigured, ThemeBuilder.brandEditor._blockConfigured);
            ThemeBuilder.Bar.getInstance().disableThemebuilder();
          }
        }
        jQuery("#themebuilder-main #themebuilder-brand-logo .themebuilder-brand-logo img").attr('src', imagePath);
      }
      // Remove logo image
      else {
        // Remove the logo and put back the original 1px logo.png.
        imagePath = Drupal.settings.basePath + Drupal.settings.themebuilderCurrentThemePath + "/logo.png";
        jQuery('.logo', headerInner).hide();
        jQuery("#themebuilder-main #themebuilder-brand-logo .themebuilder-brand-logo img").attr('src', imagePath);
      }
      break;
    case 'default_favicon_path':
      if (state.value) {
        // Change the favicon.
        imagePath = Drupal.settings.basePath +
          Drupal.settings.themebuilderCurrentThemePath + "/" +
          ThemeBuilder.styles.BackgroundEditor.prototype.cleanImage(state.value);
      }
      else {
        // Put back the default favicon.
        imagePath = Drupal.settings.basePath + 'misc/favicon.ico';
      }
      // Update the favicon itself. This only works in Firefox.
      var link = document.createElement('link');
      link.type = 'image/x-icon';
      link.rel = 'shortcut icon';
      link.href = imagePath;
      jQuery('link[rel="shortcut icon"]').remove();
      jQuery('head').append(link);
      // Update the Themebuilder UI.
      jQuery(
        "#themebuilder-main #themebuilder-brand-logo .themebuilder-brand-favicon img")
        .attr('src', imagePath);
      break;
    }
  };

  /**
   * Called when the site logo block was successfully configured.
   *
   * @param {Object} data
   *   The data that resulted from the server request.
   */
  ThemeBuilder.brandEditor._blockConfigured = function (data) {
    ThemeBuilder.brandEditor._blockSet = true;
    ThemeBuilder.brandEditor._reloadPageAfterEnablingBlock();
  };

  /**
   * Called when a modification is successfully committed.
   *
   * This method is used to determine if a page reload is required.
   * If the default logo was successfully changed and the user
   * requested to have the logo block configured automatically, a
   * refresh is required to reload the page, getting the new markup
   * for the site logo.
   *
   * @param {Event} event
   *   The event associated with the commit operation.
   * @param {Modification} modification
   *   The modification that was committed.
   * @param {String} operation
   *   Indicates whether the modification was applied ("apply"),
   *   undone ("undo"), or redone ("redo").
   */
  ThemeBuilder.brandEditor._modificationCommitted = function (event, modification, operation) {
    if (operation === 'apply' && modification.getSelector() === 'default_logo_path') {
      ThemeBuilder.brandEditor._logoCommitted = true;
      ThemeBuilder.brandEditor._reloadPageAfterEnablingBlock();
    }
  };

  /**
   * Performs the actual page reload.
   *
   * This occurs only if the user requested to have the logo block
   * configured and committed a new logo image.
   */
  ThemeBuilder.brandEditor._reloadPageAfterEnablingBlock = function () {
    if (ThemeBuilder.brandEditor._blockSet === true && ThemeBuilder.brandEditor._logoCommitted === true) {
      parent.location.reload(true);
    }
  };

   /**
    * @class
    */
  Drupal.behaviors.editBrand = {
    attach : function (context, settings) {
      // Add brand tab actions to page.
      jQuery('#themebuilder-brand').bind('init', function (e) {
        ThemeBuilder.brandEditor.init();
      });
    }
  };
}(jQuery));

;

/*jslint bitwise: true, eqeqeq: true, immed: true, newcap: true, nomen: false,
 onevar: false, plusplus: false, regexp: true, undef: true, white: true, indent: 2
 browser: true */

/*global jQuery: true Drupal: true ThemeBuilder: true*/

/**
 * The ThemeSettingModification is a subclass of the abstract Modification
 * class.  An instance of this class can hold a modification to the theme
 * settings such that it can be applied and reverted.
 * @class
 * @extends ThemeBuilder.Modification
 */
ThemeBuilder.ThemeSettingModification = ThemeBuilder.initClass();

// Subclass the Modification class.
ThemeBuilder.ThemeSettingModification.prototype = new ThemeBuilder.Modification();

/**
 * The type string that indicates this is a theme setting modification.
 */
ThemeBuilder.ThemeSettingModification.TYPE = 'themeSetting';
ThemeBuilder.registerModificationClass('ThemeSettingModification');

/**
 * This static method returns a correctly initialized ThemeSettingModification
 * instance that contains the specified prior state and new state.  Enough
 * checking is performed to ensure that the newly instantiated object is valid.
 *
 * @return
 *   A new instance of ThemeSettingModification that contains the specified
 *   prior state and new state.
 */
ThemeBuilder.ThemeSettingModification.create = function (priorState, newState) {
  if (ThemeBuilder.ThemeSettingModification.TYPE !== priorState.type) {
    throw 'Cannot create a ThemeSettingModification from state type ' + priorState.type;
  }

  var instance = new ThemeBuilder.ThemeSettingModification(priorState.selector);
  instance.setPriorState(priorState.value);
  if (newState) {
    instance.setNewState(newState.value);
  }
  return instance;
};

/**
 * The constructor for the ThemeSettingModification class. You should never call
 * this method directly, but rather use code such as:
 * <pre>
 *   var modification = new ThemeSettingModification();
 * </pre>
 */
ThemeBuilder.ThemeSettingModification.prototype.initialize = function (key) {
  ThemeBuilder.Modification.prototype.initialize.call(this, key);
  this.type = ThemeBuilder.ThemeSettingModification.TYPE;
};

/**
 * Creates a simple object that encapsulates a state (either a prior state or
 * a new state) which will be associated with this modification instance.
 *
 * @param property string
 *   The property name.
 *
 * @param value string
 *   The value associated with the property.
 */
ThemeBuilder.ThemeSettingModification.prototype.createState = function (value) {
  return {
    'value' : value
  };
};
;
(function($) {

Drupal.behaviors.gardensHelp = {
  attach: function(context) {
          Drupal.gardensHelp.init(context);
  }
};

Drupal.gardensHelp = Drupal.gardensHelp || {};

Drupal.gardensHelp.init = function(context) {
  // Move help area to inside the toolbar, so the toolbar resizes with it.
  var helpHeader = $('#help-header').html();
  $('#help-header').remove();
  $('#toolbar').prepend('<div id="help-header" style="display: none;">' + helpHeader + '</div>');

  // Bind our click handler to the help item.
  $('#toolbar-user .help a', context).bind('click', Drupal.gardensHelp.open);

  // Bind search submission handler to search form.
  $('#gardens-help-search-form').bind('submit', Drupal.gardensHelp.searchSubmit);

  // Bind links in the help header so that they will open a single new window
  $('#help-header a').bind('click', Drupal.gardensHelp.helpClick);
};

Drupal.gardensHelp.open = function() {
  $("#help-header").slideToggle("slow", Drupal.gardensHelp.positionOverlay);
  $("#toolbar-user .help").toggleClass("help-active");
  // Blur the link so that the :active suedo-class doesn't cause it to have the grey background
  $("#toolbar-user .help a").blur();
  return false;
};

Drupal.gardensHelp.positionOverlay = function() {
  // As the toolbar is an overlay displaced region, overlay should be
  // notified of it's height change to adapt its position.
  $('body').css('paddingTop', Drupal.toolbar.height());
  $(window).triggerHandler('resize.overlay-event');

  // Porting the fix for IE and the slideToggle from the Gardener
  var wrapper = $(this).parent();
  if (wrapper.css('zoom') != 1) {
    wrapper.css('zoom', 1);
  } else {
    wrapper.css('zoom', '');
  }
}

Drupal.gardensHelp.searchSubmit = function(event) {
  // This method needs to work the same way as the link click handler so that it doesn't create an additional window
  event.preventDefault();
  if (Drupal.gardensHelp.helpWindow) {
          Drupal.gardensHelp.helpWindow.close();
  }
  // The Gardener will read the URL arguments and take care of the lack of a POST submition
  Drupal.gardensHelp.helpWindow = window.open(Drupal.settings.gardenerHelpSearchURL + '/search/apachesolr_search/' + $('#gardens-help-search-query').val(), 'gardens_help');

}

Drupal.gardensHelp.helpClick = function (event) {
  // Stop normal link behavior
  event.preventDefault();

  // If there has already been a window created by the help drop down, close it.  Creating a new window will put focus on that window.
  if (Drupal.gardensHelp.helpWindow) {
    Drupal.gardensHelp.helpWindow.close();
  }
  Drupal.gardensHelp.helpWindow = window.open($(event.target).attr('href'), 'gardens_help');
};

})(jQuery);
;
/*jslint bitwise: true, eqeqeq: true, immed: true, newcap: true, nomen: false,
 onevar: false, plusplus: false, regexp: true, undef: true, white: true, indent: 2
 browser: true */

/*global jQuery: true debug: true Drupal: true window: true */

var ThemeBuilder = ThemeBuilder || {};
ThemeBuilder.styleEditor = ThemeBuilder.styleEditor || {};

/**
 * @class
 */
Drupal.behaviors.themebuilderBarLast = {
  attach: function (context, settings) {
    ThemeBuilder.initializeUI();
  }
};

/**
 * Initializes the initial state of the themebuilder.
 */
ThemeBuilder.initializeUI = function () {
  ThemeBuilder.addThemeEditButton();

  if (jQuery('body').hasClass('themebuilder')) {
    ThemeBuilder.open();
  }
  else {
    ThemeBuilder.close();
  }
};

/**
 * Overrides the "Appearance" toolbar button so that it launches themebuilder.
 */
ThemeBuilder.addThemeEditButton = function () {
  // Strip the 'admin/appearance' href from the "Appearance" toolbar link.
  // We can't use '#' as the href, because if we do, the link will show up
  // as highlighted when the overlay is closed and the hash changes to '#'.
  var $toolbarLink = jQuery('#toolbar-link-admin-appearance').removeAttr('href').css('cursor', 'pointer');

  // @see: function themebuilder_compiler_preprocess_html()
  // The themebuilder is disabled if we're using an admin theme, for example.
  if (!jQuery('body').hasClass('themebuilder-disabled')) {
    // Avoid attaching multiple event listeners.
    $toolbarLink.unbind('click', ThemeBuilder._appearanceButtonCallback);
    $toolbarLink.click(ThemeBuilder._appearanceButtonCallback);
  }
};

/**
 * Determines whether the browser being used is supported by the themebuilder.
 *
 * @return {boolean}
 *   true if the browser is supported; false otherwise.
 */
ThemeBuilder.browserSupported = function () {
  var browserOk = false;
  var browserDetect = new ThemeBuilder.BrowserDetect();
  switch (browserDetect.browser) {
  case 'Mozilla':
  case 'Firefox':
    browserOk = (parseFloat(browserDetect.version) >= 1.9);
    break;

  case 'Explorer':
    browserOk = (parseFloat(browserDetect.version) >= 8.0);
    break;

  case 'Safari':
    browserOk = true;
    break;

  case 'Chrome':
    browserOk = true;
    break;

  default:
  }
  return browserOk;
};

/**
 * Called when the appearance button is clicked.
 */
ThemeBuilder._appearanceButtonCallback = function () {
  // If the themebuilder is open and an overlay is open, 
  // clicking the appearance button will close the overlay
  // instead of acting on the themebuilder
  if (jQuery('body').hasClass('themebuilder') && Drupal.overlay.isOpen) {
    jQuery.bbq.removeState('overlay');
    return false;
  }
  if (ThemeBuilder.browserSupported()) {
    // This is idempotent, so no need to check if themebuilder is
    // open already.
    var bar = ThemeBuilder.Bar.getInstance();
    bar.openThemebuilder();
  }
  else {
    alert("Editing your site's appearance requires one of the following browsers: Firefox version 3.0 or higher, Internet Explorer 8, Safari 4, or Google Chrome 4.");
  }
  return false;
};

/**
 * Opens the themebuilder.  This function causes the shortcuts bar to disappear
 * and opens the themebuilder panel.
 */
ThemeBuilder.open = function () {
  if (jQuery('div.toolbar-shortcuts')) {
    Drupal.toolbar.collapse();
  }

  // Convert any embed tags into placeholder images to not break z-index
  jQuery('embed').each(ThemeBuilder.embedReplace);

  // Make sure the initialization data has been received.
  var app = ThemeBuilder.getApplicationInstance();
  var appData = app.getData();
  if (!appData) {
    app.addApplicationInitializer(ThemeBuilder.open);
    return;
  }
  app.addApplicationInitializer(ThemeBuilder.applicationDataInitialized);
  app.addUpdateListener(ThemeBuilder.applicationDataUpdated);
  var bar = ThemeBuilder.Bar.getInstance();
  bar.show();
  ThemeBuilder.populateUndoStack();
  ThemeBuilder.undoStack.addChangeListener(bar);
  ThemeBuilder.redoStack.addChangeListener(bar);
  bar.stackChanged();
};

/**
 * Closes the themebuilder panel.
 */
ThemeBuilder.close = function () {
  if (Drupal.toolbar) {
    Drupal.toolbar.expand();
  }
  var bar = ThemeBuilder.Bar.getInstance(false);
  if (bar && ThemeBuilder.undoStack) {
    ThemeBuilder.undoStack.removeChangeListener(bar);
    ThemeBuilder.redoStack.addChangeListener(bar);
  }
};

ThemeBuilder.embedReplace = function (index, element) {
  var $ = jQuery;
  var h = $(element).height();
  var w = $(element).width();

  var placeholder = $('<div class="flash-content tb-no-select" title="Flash content not available while Themebuilding"></div>').css({'height': h, 'width': w});

  $(element).replaceWith(placeholder);
};

/**
 * Called when the application data is initialized.
 *
 * @param {Array} data
 *   The initial application data returned from the server.
 */
ThemeBuilder.applicationDataInitialized = function (data) {
  // Trigger any behaviors that the server side code requested to be triggered.
  ThemeBuilder.triggerBehaviors(data);
};

/**
 * Called when the application data has changed.
 *
 * @param {Array} data
 *   The set of application data that changed.
 */
ThemeBuilder.applicationDataUpdated = function (data) {
  // Look for a change to the maintenance mode state and alert the user to save
  // their theme.
  if (data.maintenance_mode === true) {
    alert(Drupal.t('The ThemeBuilder will soon be undergoing a brief maintenance period.  Please save your work and close the ThemeBuilder.'));
  }
  else if (data.maintenance_mode === false) {
    // Probably don't need a message when we come out of maintenance mode.
  }

  // Trigger any behaviors that the server side code requested to be triggered.
  ThemeBuilder.triggerBehaviors(data);
};

/**
 * Triggers behaviors that the server side code requested to be triggered.
 *
 * @param {Array} data
 *   The data returned from the server, either on application initialization or
 *   on application update.
 */
ThemeBuilder.triggerBehaviors = function (data) {
  if (data.hasOwnProperty("behaviors_to_trigger")) {
    for (var behavior_to_trigger in data.behaviors_to_trigger) {
      if (data.behaviors_to_trigger.hasOwnProperty(behavior_to_trigger)) {
        jQuery('#themebuilder-main').trigger(behavior_to_trigger);
      }
    }
  }
};

/**
 * Work around an issue in Drupal's behavior code that causes the attach method to not be called if a previously called attach method encountered an error.
 *
 * Because of a lack of exception handling in behaviors code, it is
 * not guaranteed that all of the behaviors code will actually get
 * executed.  See http://drupal.org/node/990880.
 * Until that issue is resolved, wrap each behavior attach method with
 * a wrapper that catches and ignores any error.
 */
ThemeBuilder.protectAgainstBrokenInitializers = function () {
  for (var behavior in Drupal.behaviors) {
    if (jQuery.isFunction(Drupal.behaviors[behavior].attach)) {
      var attach = Drupal.behaviors[behavior].attach;
      Drupal.behaviors[behavior].attach = ThemeBuilder.errorCatchingWrapper(behavior, attach);
    }
  }
};

/**
 * This wrapper is used to wrap each behavior's attach method to prevent errors encountered during initialization from preventing subsequent initialization code from executing.
 *
 * @param {String} behavior
 *   The name of the behaivor the specified attach function is associated with.
 * @param {Function} attach
 *   The attach method that is to be wrapped with error handling functionality.
 */
ThemeBuilder.errorCatchingWrapper = function (behavior, attach) {
  return function () {
    try {
      return attach.apply(this, arguments);
    }
    catch (e) {
      var message = e.message ? e.message : e;
      ThemeBuilder.Log.gardensWarning('AN-25177 - Error encountered in the JavaScript initialization code', 'Drupal.behaviors.' + behavior + ': ' + message);
      if (ThemeBuilder.isDevelMode()) {
        alert(message);
      }
    }
  };
};

/**
 * Make sure that any errors encountered during initialization do not
 * make it impossible to open the themebuilder.
 */
ThemeBuilder.protectAgainstBrokenInitializers();
;
/*jslint bitwise: true, eqeqeq: true, immed: true, newcap: true, nomen: false,
 onevar: false, plusplus: false, regexp: true, undef: true, white: true, indent: 2
 browser: true */

/*global jQuery: true Drupal: true window: true ThemeBuilder: true */

(function ($) {

  /**
   * Override for the extlink module.
   *
   * ThemeBuilder requires the <a> and <span> tags for external links to have
   * different classes, so they can be targeted separately.
   */
  Drupal.extlink = Drupal.extlink || {};

  Drupal.behaviors.extlink = Drupal.behaviors.extlink || {};

  Drupal.behaviors.extlink.attach = function (context, settings) {
    // Add "-link" to the end of the class name that's applied to both <a> and
    // <span> tags. We will remove it later before applying it to <span> tags.
    if (Drupal.settings.extlink && Drupal.settings.extlink.extClass) {
      Drupal.settings.extlink.extClass = Drupal.settings.extlink.extClass + '-link';
    }
    if ($.isFunction(Drupal.extlink.attach)) {
      Drupal.extlink.attach(context, settings);
    }
  };

  /**
   * Overrides method from the extlink module.
   *
   * Change the class name for the <span> that comes after external links,
   * so that it's "ext", not "ext-link".
   */
  Drupal.extlink.applyClassAndSpan = function (links, class_name) {
    var $links_to_process;
    if (parseFloat($().jquery) < 1.2) {
      $links_to_process = $(links).not('[img]');
    }
    else {
      var links_with_images = $(links).find('img').parents('a');
      $links_to_process = $(links).not(links_with_images);
    }
    $links_to_process.addClass(class_name);
    var i;
    var length = $links_to_process.length;
    // If we've added "-link" to the end of the class name, remove it for
    // <span> tags. We want "-link" only at the end of the link class.
    var span_class = class_name.replace(/-link$/, '');
    for (i = 0; i < length; i++) {
      var $link = $($links_to_process[i]);
      if ($link.css('display') === 'inline') {
        $link.after('<span class=' + span_class + '></span>');
      }
    }
  };

  /**
   * Stop the rotation in the Rotating Banner when the ThemeBuilder is open
   */
  Drupal.behaviors.RotatingBannerInThemeBuilder = {
    attach: function (context) {
      if ($('body').hasClass('themebuilder')) {
        $('.rb-slides').each(function () {
          if ($(this).cycle) {
            $(this).cycle('stop');
          }
        });
      }
    }
  };

  /**
   * Activate Superfish Pulldown menus
   */
  Drupal.behaviors.GardensFeaturesPulldownMenus = {
    attach: function (context, settings) {
      Drupal.behaviors.GardensFeaturesPulldownMenus.settings = {
        appearance: {
          gutter: 10,
          push: 2,
          overlapOffset: 1.4545
        }
      };
      if (settings) {
        $.extend(Drupal.behaviors.GardensFeaturesPulldownMenus.settings, settings);
      }
      if ($().superfish) {
        $('.content > .menu', '#page .stack-navigation').once('pulldown', function () {
          $(this).superfish({
            hoverClass: 'menu-dropdown-hover',
            delay: 150,
            dropShadows: false,
            speed: 300,
            autoArrows: true,
            onBeforeShow: Drupal.behaviors.GardensFeaturesPulldownMenus.adjustPulldown
          });
        }).addClass('pulldown');
      }
    }
  };

  /**
   * This function is run to adjust the placement of a pulldown.
   *
   * @param {DomElement} this
   *   The pulldown (ul) that is currently being shown.
   */
  Drupal.behaviors.GardensFeaturesPulldownMenus.adjustPulldown = function () {
    $(this).css({display: 'block', visibility: 'hidden'});
    Drupal.behaviors.GardensFeaturesPulldownMenus.adjustPulldownPlacement($(this));
    $(this).css({display: 'none', visibility: 'visible'});
  };

  /**
   * Progressively increases the width of the pulldown by 33% until
   * the height of each item is less than the line height
   *
   * @param {DomElement} pulldown
   *   The pulldown (ul) to be positioned
   * @param {DomElement} item
   *   The anchor tag of an item in the list
   * @param {int} lineHeight
   *   The line height of the item's anchor tag. This is passed in
   *   because it does not need to be calculated more than once
   * @param {int} safety
   *   A counter to prevent recursive errors. The width of the pulldown
   *   will be adjusted at most 5 times currently.
   */
  Drupal.behaviors.GardensFeaturesPulldownMenus.adjustPulldownWidth = function (pulldown, item, lineHeight, safety) {
    var width = pulldown.width();
    var height = item.height();
    var wrapped = ((height - lineHeight) > 2) ? true : false; // Provide a little give with a 2 pixel fudge factor for IE7
    if (wrapped && (safety < 5)) {
      pulldown.animate({
          width: width * 1.2
        },
        {
          duration: 0,
          queue: true,
          complete: function () {
            safety += 1;
            Drupal.behaviors.GardensFeaturesPulldownMenus.adjustPulldownWidth(pulldown, item, lineHeight, safety);
          }
        }
      );
    }
  };

  /**
   * Moves a pulldown left or right, according to its alignment, after its
   * parent's width has been adjusted
   *
   * @param {DomElement} pulldown
   *   The pulldown (ul) to be positioned
   */
  Drupal.behaviors.GardensFeaturesPulldownMenus.adjustPulldownPlacement = function (element) {
    var pulldown = {};
    pulldown.el = element;
    var isRTL = ($('html').attr('dir') === 'rtl');

    // Wipe out any previous positioning
    pulldown.el.removeAttr('style');

    // Get the depth of the sub menu
    // 0 is first tier sub menu
    // 1 is second tier sub menu, etc
    var depth = pulldown.el.parentsUntil('.pulldown-processed').filter('.menu').length;
    pulldown.parent = {};
    pulldown.parent.el = element.prev('a');
    pulldown.parent.css = {
      lineHeight: Drupal.behaviors.GardensFeaturesPulldownMenus._stripPX(pulldown.parent.el.css('line-height')),
      padding: {
        top: Drupal.behaviors.GardensFeaturesPulldownMenus._stripPX(pulldown.parent.el.css('padding-top'))
      },
      margin: {
        top: Drupal.behaviors.GardensFeaturesPulldownMenus._stripPX(pulldown.parent.el.css('margin-top'))
      }
    };
    // Only consider pulldowns, not the main menu items
    // Basic placement without edge detection
    var root = {};
    root.el = pulldown.el.parents('.pulldown-processed li .menu');
    if (root.el && (root.el.length > 0)) {
      pulldown.el.css({
        left: root.el.width()
      });
    }
    // Get the viewport and scroll information
    var viewport = {};
    viewport.width = $(window).width(); // Width of the visible viewport
    viewport.height = $(window).height(); // Height of the visible viewport
    viewport.scroll = {};
    viewport.scroll.top = $(window).scrollTop();
    pulldown.pos = pulldown.el.position();
    // pushDir corresponds to the RTL setting
    var pushDir = (isRTL) ? 'right' : 'left';
    // handDir corresponds to which edge of the screen the menus might collide with. It is the opposite
    // of pushDir.
    var hangDir = (pushDir === 'right') ? 'left' : 'right';
    // Move the pulldown back to its origin if we moved it because of edge correction previously
    var prevCorrection = Drupal.behaviors.GardensFeaturesPulldownMenus._stripPX(pulldown.el.css(pushDir));
    if (prevCorrection < 0) {
      pulldown.el.css[pushDir] = pulldown.pos[pushDir] = 0;
    }
    // Now check for edge collision
    pulldown.offset = pulldown.el.offset();
    if (pulldown.offset) {
      pulldown.width = pulldown.el.outerWidth(false);
      pulldown.height = pulldown.el.outerHeight(false);
      pulldown.edge = {};
      pulldown.edge.left = pulldown.offset.left;
      pulldown.edge.right = pulldown.offset.left + pulldown.width;
      pulldown.edge.bottom = pulldown.offset.top + pulldown.height;
      pulldown.hang = {};
      pulldown.hang.left = pulldown.edge.left;
      pulldown.hang.right = viewport.width - pulldown.edge.right;
      pulldown.hang.bottom = (viewport.height + viewport.scroll.top) - pulldown.edge.bottom  - Drupal.behaviors.GardensFeaturesPulldownMenus.settings.appearance.gutter;
      pulldown.hang.bottomModified = 1;
      pulldown.correction = {};
      pulldown.correction.left = pulldown.pos.left + pulldown.hang.right - Drupal.behaviors.GardensFeaturesPulldownMenus.settings.appearance.gutter;
      pulldown.correction.right = (depth > 0) ?
        pulldown.hang.left + pulldown.width - Drupal.behaviors.GardensFeaturesPulldownMenus.settings.appearance.gutter :
        pulldown.hang.left - Drupal.behaviors.GardensFeaturesPulldownMenus.settings.appearance.gutter;

      // Move the pulldown back onto the screen
      if (pulldown.hang[hangDir] <= 0) {
        var leftVal = (pushDir === 'left') ? pulldown.correction.left : 'auto';
        var rightVal = (pushDir === 'right') ? pulldown.correction.right : 'auto';
        pulldown.el.css(
          {
            'left': leftVal,
            'right': rightVal
          }
        );
        // Push the pulldown down half a line height if it is a sub-sub menu so that sub menu items aren't completely occluded.
        if (depth > 0) {
          var top = (((pulldown.parent.css.lineHeight) / Drupal.behaviors.GardensFeaturesPulldownMenus.settings.appearance.overlapOffset) + (pulldown.parent.css.padding.top) + (pulldown.parent.css.margin.top));
          pulldown.el.css('top', top);
          pulldown.hang.bottomModified = pulldown.hang.bottom - top;
        }
      }
      // Move the pulldown up if it hangs off the bottom
      if (pulldown.hang.bottom <= 0 || pulldown.hang.bottomModified <= 0) {
        pulldown.el.css('top', (pulldown.pos.top + pulldown.hang.bottom));
      }
    }
  };

  /**
   * Utility function to remove 'px' from calculated values.  The function assumes that
   * that unit 'value' is pixels.
   *
   * @param {String} value
   *   The String containing the CSS value that includes px.
   * @return {int}
   *   Value stripped of 'px' and casted as a number or NaN if 'px' is not found in the string.
   */
  Drupal.behaviors.GardensFeaturesPulldownMenus._stripPX = function (value) {
    if (value) {
      var index = value.indexOf('px');
      if (index === -1) {
        return NaN;
      }
      else {
        return Number(value.substring(0, index));
      }
    }
    else {
      return NaN;
    }
  };

  /**
   * Add a "Show/Hide disabled views" toggle link to the Views list on
   * admin/structure/views, similar to the "Show/Hide row weights" link on
   * tabledrag tables.
   */
  Drupal.behaviors.GardensFeaturesViewsListFilter = {
    attach: function (context, settings) {
      $('body.page-admin-structure-views table.#ctools-export-ui-list-items').once('gardens-features-views-list-filter', function () {
        var $table = $(this);

        // Remove any prior links created (for when table gets replaced by AJAX)
        $('.gardens-features-toggle-disabled-wrapper').remove();

        // Create the toggle link, initialized to reflect that all rows are
        // currently shown.
        var $link = $('<a href="#" class="gardens-features-toggle-disabled gardens-features-toggle-disabled-show"></a>')
          .text(Drupal.t('Hide disabled views'))
          .click(function () {
            if ($(this).hasClass('gardens-features-toggle-disabled-show')) {
              $(this).removeClass('gardens-features-toggle-disabled-show');
              $(this).addClass('gardens-features-toggle-disabled-hide');
              $('.ctools-export-ui-disabled', $table).hide();
              if ($('tbody tr', $table).length === $('.ctools-export-ui-disabled', $table).length) {
                $('tbody', $table).prepend('<tr class="gardens-features-toggle-disabled-empty odd"><td colspan="5">' + Drupal.t('No enabled views found.') + '</td></tr>');
              }
              $.cookie('Drupal.GardensFeaturesViewsListFilter.showDisabled', 0, {path: Drupal.settings.basePath, expires: 365});
              $(this).text(Drupal.t('Show disabled views'));
            }
            else {
              $(this).removeClass('gardens-features-toggle-disabled-hide');
              $(this).addClass('gardens-features-toggle-disabled-show');
              $('.ctools-export-ui-disabled', $table).show();
              $('.gardens-features-toggle-disabled-empty', $table).remove();
              $.cookie('Drupal.GardensFeaturesViewsListFilter.showDisabled', 1, {path: Drupal.settings.basePath, expires: 365});
              $(this).text(Drupal.t('Hide disabled views'));
            }
            return false;
          });

        // Add it before the table.
        $table.before($link.wrap('<div class="gardens-features-toggle-disabled-wrapper"></div>').parent());

        // Unless there's a cookie for disabled views to be shown, "click" the
        // link in order to hide them.
        if ($.cookie('Drupal.GardensFeaturesViewsListFilter.showDisabled') !== '1') {
          $link.click();
        }

        // If the filter form is also active, remove the widget to filter by
        // enabled/disabled status, to not conflict with the toggle link.
        $('#ctools-export-ui-list-form .form-item-disabled').hide();
      });
    }
  };

  /**
   * Open all links to Drupal Gardens "Learn More" pages in a new window.
   */
  Drupal.behaviors.GardensFeaturesLearnMoreLinks = {
    attach: function (context, settings) {
      $('a[href^="http://www.drupalgardens.com/learnmore/"]', context).attr('target', '_blank');
    }
  };


  /**
   * Scroll to top of AJAX view on pager click.
   */
  Drupal.behaviors.viewsAjaxScroll = {
    attach: function (context, settings) {
      if (typeof Drupal.settings.views !== 'undefined' &&
          typeof Drupal.settings.views.ajax_path !== 'undefined' &&
          typeof Drupal.behaviors.ViewsLoadMore === 'undefined') {
        // make sure we have AJAX, but not load_more
        $('.item-list .pager a').not('a.load-more').once('views-ajax-scroll').click(function ()
        {
          var outer = $(this).parents('.view');
          if ($(outer).parents('.pane').length) {
            // if there is surrounding pane, scroll to top of it
            outer = $(outer).parents('.pane');
          }
          else if ($(outer).parents('.block').length) {
            // if there is surrounding block, scroll top top of it
            outer = $(outer).parents('.block');
          }
          var viewtop = outer.offset().top - $('#toolbar').outerHeight();
          $('html, body').animate({scrollTop: viewtop}, 'slow', 'linear');
        });
      }
    }
  };

  /**
   * Add dialog behavior to /user links for anonymous users.
   */
  Drupal.behaviors.gardensUserDialog = {};
  Drupal.behaviors.gardensUserDialog.attach = function (context, settings) {
    if (settings.gardensFeatures && settings.gardensFeatures.userIsAnonymous && settings.gardensFeatures.dialogUserEnabled) {
      // Modify all /user links so that they appear in a popup dialog.
      var links = $('a[href^=/user]').once('user-dialog');
      var length = links.length;
      if (links.length === 0) {
        return;
      }
      var i, link, intab;
      for (i = 0; i < length; i++) {
        link = links[i];
        // Is the link in a tab (e.g. on the user login register or password pages)
        intab = $(link).parents().filter('ul.tabs');
        // Only act on the following types of links:
        // /user, /user/login, /user/register, /user/password
        // Ignore links that were already set up correctly on the server side.
        if (link.href.indexOf('nojs') === -1 && link.href.indexOf('ajax') === -1) {
          if (link.href.match(/\/user$/)) {
            if(intab.length == 0) {
              link.href = '/user/login/ajax';
            }
            else {
              link.href = '/user/login/nojs';
            }
            $(link).addClass('use-ajax use-dialog');
          }
          else if (link.href.match(/\/user\/(login|register|password)$/)) {
            if(intab.length == 0) {
                    link.href = link.href.replace(/\/user\/(login|register|password)/, '/user/$1/ajax');
            }
            else {
              link.href = link.href.replace(/\/user\/(login|register|password)/, '/user/$1/nojs');
            }
            $(link).addClass('use-ajax use-dialog');
          }
        }
      }
      // The AJAX and dialog behaviors have already run; rerun them to pick up
      // newly ajaxified links.
      Drupal.behaviors.AJAX.attach(context, settings);
      Drupal.behaviors.dialog.attach(context, settings);
    }
  };

  // Disable the lazyloader: http://drupal.org/node/665128#comment-5301192
  if (typeof(Drupal.ajax) !== 'undefined') {
    Drupal.ajax.prototype.commands.xlazyloader = function () {};
  }
}(jQuery));
;
