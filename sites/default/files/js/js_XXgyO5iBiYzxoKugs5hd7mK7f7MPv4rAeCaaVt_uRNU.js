
/*!
 * jQuery UI 1.8.7
 *
 * Copyright 2010, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI
 */
(function(c,j){function k(a){return!c(a).parents().andSelf().filter(function(){return c.curCSS(this,"visibility")==="hidden"||c.expr.filters.hidden(this)}).length}c.ui=c.ui||{};if(!c.ui.version){c.extend(c.ui,{version:"1.8.7",keyCode:{ALT:18,BACKSPACE:8,CAPS_LOCK:20,COMMA:188,COMMAND:91,COMMAND_LEFT:91,COMMAND_RIGHT:93,CONTROL:17,DELETE:46,DOWN:40,END:35,ENTER:13,ESCAPE:27,HOME:36,INSERT:45,LEFT:37,MENU:93,NUMPAD_ADD:107,NUMPAD_DECIMAL:110,NUMPAD_DIVIDE:111,NUMPAD_ENTER:108,NUMPAD_MULTIPLY:106,
NUMPAD_SUBTRACT:109,PAGE_DOWN:34,PAGE_UP:33,PERIOD:190,RIGHT:39,SHIFT:16,SPACE:32,TAB:9,UP:38,WINDOWS:91}});c.fn.extend({_focus:c.fn.focus,focus:function(a,b){return typeof a==="number"?this.each(function(){var d=this;setTimeout(function(){c(d).focus();b&&b.call(d)},a)}):this._focus.apply(this,arguments)},scrollParent:function(){var a;a=c.browser.msie&&/(static|relative)/.test(this.css("position"))||/absolute/.test(this.css("position"))?this.parents().filter(function(){return/(relative|absolute|fixed)/.test(c.curCSS(this,
"position",1))&&/(auto|scroll)/.test(c.curCSS(this,"overflow",1)+c.curCSS(this,"overflow-y",1)+c.curCSS(this,"overflow-x",1))}).eq(0):this.parents().filter(function(){return/(auto|scroll)/.test(c.curCSS(this,"overflow",1)+c.curCSS(this,"overflow-y",1)+c.curCSS(this,"overflow-x",1))}).eq(0);return/fixed/.test(this.css("position"))||!a.length?c(document):a},zIndex:function(a){if(a!==j)return this.css("zIndex",a);if(this.length){a=c(this[0]);for(var b;a.length&&a[0]!==document;){b=a.css("position");
if(b==="absolute"||b==="relative"||b==="fixed"){b=parseInt(a.css("zIndex"),10);if(!isNaN(b)&&b!==0)return b}a=a.parent()}}return 0},disableSelection:function(){return this.bind((c.support.selectstart?"selectstart":"mousedown")+".ui-disableSelection",function(a){a.preventDefault()})},enableSelection:function(){return this.unbind(".ui-disableSelection")}});c.each(["Width","Height"],function(a,b){function d(f,g,l,m){c.each(e,function(){g-=parseFloat(c.curCSS(f,"padding"+this,true))||0;if(l)g-=parseFloat(c.curCSS(f,
"border"+this+"Width",true))||0;if(m)g-=parseFloat(c.curCSS(f,"margin"+this,true))||0});return g}var e=b==="Width"?["Left","Right"]:["Top","Bottom"],h=b.toLowerCase(),i={innerWidth:c.fn.innerWidth,innerHeight:c.fn.innerHeight,outerWidth:c.fn.outerWidth,outerHeight:c.fn.outerHeight};c.fn["inner"+b]=function(f){if(f===j)return i["inner"+b].call(this);return this.each(function(){c(this).css(h,d(this,f)+"px")})};c.fn["outer"+b]=function(f,g){if(typeof f!=="number")return i["outer"+b].call(this,f);return this.each(function(){c(this).css(h,
d(this,f,true,g)+"px")})}});c.extend(c.expr[":"],{data:function(a,b,d){return!!c.data(a,d[3])},focusable:function(a){var b=a.nodeName.toLowerCase(),d=c.attr(a,"tabindex");if("area"===b){b=a.parentNode;d=b.name;if(!a.href||!d||b.nodeName.toLowerCase()!=="map")return false;a=c("img[usemap=#"+d+"]")[0];return!!a&&k(a)}return(/input|select|textarea|button|object/.test(b)?!a.disabled:"a"==b?a.href||!isNaN(d):!isNaN(d))&&k(a)},tabbable:function(a){var b=c.attr(a,"tabindex");return(isNaN(b)||b>=0)&&c(a).is(":focusable")}});
c(function(){var a=document.body,b=a.appendChild(b=document.createElement("div"));c.extend(b.style,{minHeight:"100px",height:"auto",padding:0,borderWidth:0});c.support.minHeight=b.offsetHeight===100;c.support.selectstart="onselectstart"in b;a.removeChild(b).style.display="none"});c.extend(c.ui,{plugin:{add:function(a,b,d){a=c.ui[a].prototype;for(var e in d){a.plugins[e]=a.plugins[e]||[];a.plugins[e].push([b,d[e]])}},call:function(a,b,d){if((b=a.plugins[b])&&a.element[0].parentNode)for(var e=0;e<b.length;e++)a.options[b[e][0]]&&
b[e][1].apply(a.element,d)}},contains:function(a,b){return document.compareDocumentPosition?a.compareDocumentPosition(b)&16:a!==b&&a.contains(b)},hasScroll:function(a,b){if(c(a).css("overflow")==="hidden")return false;b=b&&b==="left"?"scrollLeft":"scrollTop";var d=false;if(a[b]>0)return true;a[b]=1;d=a[b]>0;a[b]=0;return d},isOverAxis:function(a,b,d){return a>b&&a<b+d},isOver:function(a,b,d,e,h,i){return c.ui.isOverAxis(a,d,h)&&c.ui.isOverAxis(b,e,i)}})}})(jQuery);
;

/*!
 * jQuery UI Widget 1.8.7
 *
 * Copyright 2010, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Widget
 */
(function(b,j){if(b.cleanData){var k=b.cleanData;b.cleanData=function(a){for(var c=0,d;(d=a[c])!=null;c++)b(d).triggerHandler("remove");k(a)}}else{var l=b.fn.remove;b.fn.remove=function(a,c){return this.each(function(){if(!c)if(!a||b.filter(a,[this]).length)b("*",this).add([this]).each(function(){b(this).triggerHandler("remove")});return l.call(b(this),a,c)})}}b.widget=function(a,c,d){var e=a.split(".")[0],f;a=a.split(".")[1];f=e+"-"+a;if(!d){d=c;c=b.Widget}b.expr[":"][f]=function(h){return!!b.data(h,
a)};b[e]=b[e]||{};b[e][a]=function(h,g){arguments.length&&this._createWidget(h,g)};c=new c;c.options=b.extend(true,{},c.options);b[e][a].prototype=b.extend(true,c,{namespace:e,widgetName:a,widgetEventPrefix:b[e][a].prototype.widgetEventPrefix||a,widgetBaseClass:f},d);b.widget.bridge(a,b[e][a])};b.widget.bridge=function(a,c){b.fn[a]=function(d){var e=typeof d==="string",f=Array.prototype.slice.call(arguments,1),h=this;d=!e&&f.length?b.extend.apply(null,[true,d].concat(f)):d;if(e&&d.charAt(0)==="_")return h;
e?this.each(function(){var g=b.data(this,a),i=g&&b.isFunction(g[d])?g[d].apply(g,f):g;if(i!==g&&i!==j){h=i;return false}}):this.each(function(){var g=b.data(this,a);g?g.option(d||{})._init():b.data(this,a,new c(d,this))});return h}};b.Widget=function(a,c){arguments.length&&this._createWidget(a,c)};b.Widget.prototype={widgetName:"widget",widgetEventPrefix:"",options:{disabled:false},_createWidget:function(a,c){b.data(c,this.widgetName,this);this.element=b(c);this.options=b.extend(true,{},this.options,
this._getCreateOptions(),a);var d=this;this.element.bind("remove."+this.widgetName,function(){d.destroy()});this._create();this._trigger("create");this._init()},_getCreateOptions:function(){return b.metadata&&b.metadata.get(this.element[0])[this.widgetName]},_create:function(){},_init:function(){},destroy:function(){this.element.unbind("."+this.widgetName).removeData(this.widgetName);this.widget().unbind("."+this.widgetName).removeAttr("aria-disabled").removeClass(this.widgetBaseClass+"-disabled ui-state-disabled")},
widget:function(){return this.element},option:function(a,c){var d=a;if(arguments.length===0)return b.extend({},this.options);if(typeof a==="string"){if(c===j)return this.options[a];d={};d[a]=c}this._setOptions(d);return this},_setOptions:function(a){var c=this;b.each(a,function(d,e){c._setOption(d,e)});return this},_setOption:function(a,c){this.options[a]=c;if(a==="disabled")this.widget()[c?"addClass":"removeClass"](this.widgetBaseClass+"-disabled ui-state-disabled").attr("aria-disabled",c);return this},
enable:function(){return this._setOption("disabled",false)},disable:function(){return this._setOption("disabled",true)},_trigger:function(a,c,d){var e=this.options[a];c=b.Event(c);c.type=(a===this.widgetEventPrefix?a:this.widgetEventPrefix+a).toLowerCase();d=d||{};if(c.originalEvent){a=b.event.props.length;for(var f;a;){f=b.event.props[--a];c[f]=c.originalEvent[f]}}this.element.trigger(c,d);return!(b.isFunction(e)&&e.call(this.element[0],c,d)===false||c.isDefaultPrevented())}}})(jQuery);
;

/*
 * jQuery UI Effects 1.8.7
 *
 * Copyright 2010, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Effects/
 */
jQuery.effects||function(f,j){function n(c){var a;if(c&&c.constructor==Array&&c.length==3)return c;if(a=/rgb\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*\)/.exec(c))return[parseInt(a[1],10),parseInt(a[2],10),parseInt(a[3],10)];if(a=/rgb\(\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*\)/.exec(c))return[parseFloat(a[1])*2.55,parseFloat(a[2])*2.55,parseFloat(a[3])*2.55];if(a=/#([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})/.exec(c))return[parseInt(a[1],
16),parseInt(a[2],16),parseInt(a[3],16)];if(a=/#([a-fA-F0-9])([a-fA-F0-9])([a-fA-F0-9])/.exec(c))return[parseInt(a[1]+a[1],16),parseInt(a[2]+a[2],16),parseInt(a[3]+a[3],16)];if(/rgba\(0, 0, 0, 0\)/.exec(c))return o.transparent;return o[f.trim(c).toLowerCase()]}function s(c,a){var b;do{b=f.curCSS(c,a);if(b!=""&&b!="transparent"||f.nodeName(c,"body"))break;a="backgroundColor"}while(c=c.parentNode);return n(b)}function p(){var c=document.defaultView?document.defaultView.getComputedStyle(this,null):this.currentStyle,
a={},b,d;if(c&&c.length&&c[0]&&c[c[0]])for(var e=c.length;e--;){b=c[e];if(typeof c[b]=="string"){d=b.replace(/\-(\w)/g,function(g,h){return h.toUpperCase()});a[d]=c[b]}}else for(b in c)if(typeof c[b]==="string")a[b]=c[b];return a}function q(c){var a,b;for(a in c){b=c[a];if(b==null||f.isFunction(b)||a in t||/scrollbar/.test(a)||!/color/i.test(a)&&isNaN(parseFloat(b)))delete c[a]}return c}function u(c,a){var b={_:0},d;for(d in a)if(c[d]!=a[d])b[d]=a[d];return b}function k(c,a,b,d){if(typeof c=="object"){d=
a;b=null;a=c;c=a.effect}if(f.isFunction(a)){d=a;b=null;a={}}if(typeof a=="number"||f.fx.speeds[a]){d=b;b=a;a={}}if(f.isFunction(b)){d=b;b=null}a=a||{};b=b||a.duration;b=f.fx.off?0:typeof b=="number"?b:b in f.fx.speeds?f.fx.speeds[b]:f.fx.speeds._default;d=d||a.complete;return[c,a,b,d]}function m(c){if(!c||typeof c==="number"||f.fx.speeds[c])return true;if(typeof c==="string"&&!f.effects[c])return true;return false}f.effects={};f.each(["backgroundColor","borderBottomColor","borderLeftColor","borderRightColor",
"borderTopColor","borderColor","color","outlineColor"],function(c,a){f.fx.step[a]=function(b){if(!b.colorInit){b.start=s(b.elem,a);b.end=n(b.end);b.colorInit=true}b.elem.style[a]="rgb("+Math.max(Math.min(parseInt(b.pos*(b.end[0]-b.start[0])+b.start[0],10),255),0)+","+Math.max(Math.min(parseInt(b.pos*(b.end[1]-b.start[1])+b.start[1],10),255),0)+","+Math.max(Math.min(parseInt(b.pos*(b.end[2]-b.start[2])+b.start[2],10),255),0)+")"}});var o={aqua:[0,255,255],azure:[240,255,255],beige:[245,245,220],black:[0,
0,0],blue:[0,0,255],brown:[165,42,42],cyan:[0,255,255],darkblue:[0,0,139],darkcyan:[0,139,139],darkgrey:[169,169,169],darkgreen:[0,100,0],darkkhaki:[189,183,107],darkmagenta:[139,0,139],darkolivegreen:[85,107,47],darkorange:[255,140,0],darkorchid:[153,50,204],darkred:[139,0,0],darksalmon:[233,150,122],darkviolet:[148,0,211],fuchsia:[255,0,255],gold:[255,215,0],green:[0,128,0],indigo:[75,0,130],khaki:[240,230,140],lightblue:[173,216,230],lightcyan:[224,255,255],lightgreen:[144,238,144],lightgrey:[211,
211,211],lightpink:[255,182,193],lightyellow:[255,255,224],lime:[0,255,0],magenta:[255,0,255],maroon:[128,0,0],navy:[0,0,128],olive:[128,128,0],orange:[255,165,0],pink:[255,192,203],purple:[128,0,128],violet:[128,0,128],red:[255,0,0],silver:[192,192,192],white:[255,255,255],yellow:[255,255,0],transparent:[255,255,255]},r=["add","remove","toggle"],t={border:1,borderBottom:1,borderColor:1,borderLeft:1,borderRight:1,borderTop:1,borderWidth:1,margin:1,padding:1};f.effects.animateClass=function(c,a,b,
d){if(f.isFunction(b)){d=b;b=null}return this.each(function(){f.queue(this,"fx",function(){var e=f(this),g=e.attr("style")||" ",h=q(p.call(this)),l,v=e.attr("className");f.each(r,function(w,i){c[i]&&e[i+"Class"](c[i])});l=q(p.call(this));e.attr("className",v);e.animate(u(h,l),a,b,function(){f.each(r,function(w,i){c[i]&&e[i+"Class"](c[i])});if(typeof e.attr("style")=="object"){e.attr("style").cssText="";e.attr("style").cssText=g}else e.attr("style",g);d&&d.apply(this,arguments)});h=f.queue(this);l=
h.splice(h.length-1,1)[0];h.splice(1,0,l);f.dequeue(this)})})};f.fn.extend({_addClass:f.fn.addClass,addClass:function(c,a,b,d){return a?f.effects.animateClass.apply(this,[{add:c},a,b,d]):this._addClass(c)},_removeClass:f.fn.removeClass,removeClass:function(c,a,b,d){return a?f.effects.animateClass.apply(this,[{remove:c},a,b,d]):this._removeClass(c)},_toggleClass:f.fn.toggleClass,toggleClass:function(c,a,b,d,e){return typeof a=="boolean"||a===j?b?f.effects.animateClass.apply(this,[a?{add:c}:{remove:c},
b,d,e]):this._toggleClass(c,a):f.effects.animateClass.apply(this,[{toggle:c},a,b,d])},switchClass:function(c,a,b,d,e){return f.effects.animateClass.apply(this,[{add:a,remove:c},b,d,e])}});f.extend(f.effects,{version:"1.8.7",save:function(c,a){for(var b=0;b<a.length;b++)a[b]!==null&&c.data("ec.storage."+a[b],c[0].style[a[b]])},restore:function(c,a){for(var b=0;b<a.length;b++)a[b]!==null&&c.css(a[b],c.data("ec.storage."+a[b]))},setMode:function(c,a){if(a=="toggle")a=c.is(":hidden")?"show":"hide";
return a},getBaseline:function(c,a){var b;switch(c[0]){case "top":b=0;break;case "middle":b=0.5;break;case "bottom":b=1;break;default:b=c[0]/a.height}switch(c[1]){case "left":c=0;break;case "center":c=0.5;break;case "right":c=1;break;default:c=c[1]/a.width}return{x:c,y:b}},createWrapper:function(c){if(c.parent().is(".ui-effects-wrapper"))return c.parent();var a={width:c.outerWidth(true),height:c.outerHeight(true),"float":c.css("float")},b=f("<div></div>").addClass("ui-effects-wrapper").css({fontSize:"100%",
background:"transparent",border:"none",margin:0,padding:0});c.wrap(b);b=c.parent();if(c.css("position")=="static"){b.css({position:"relative"});c.css({position:"relative"})}else{f.extend(a,{position:c.css("position"),zIndex:c.css("z-index")});f.each(["top","left","bottom","right"],function(d,e){a[e]=c.css(e);if(isNaN(parseInt(a[e],10)))a[e]="auto"});c.css({position:"relative",top:0,left:0})}return b.css(a).show()},removeWrapper:function(c){if(c.parent().is(".ui-effects-wrapper"))return c.parent().replaceWith(c);
return c},setTransition:function(c,a,b,d){d=d||{};f.each(a,function(e,g){unit=c.cssUnit(g);if(unit[0]>0)d[g]=unit[0]*b+unit[1]});return d}});f.fn.extend({effect:function(c){var a=k.apply(this,arguments),b={options:a[1],duration:a[2],callback:a[3]};a=b.options.mode;var d=f.effects[c];if(f.fx.off||!d)return a?this[a](b.duration,b.callback):this.each(function(){b.callback&&b.callback.call(this)});return d.call(this,b)},_show:f.fn.show,show:function(c){if(m(c))return this._show.apply(this,arguments);
else{var a=k.apply(this,arguments);a[1].mode="show";return this.effect.apply(this,a)}},_hide:f.fn.hide,hide:function(c){if(m(c))return this._hide.apply(this,arguments);else{var a=k.apply(this,arguments);a[1].mode="hide";return this.effect.apply(this,a)}},__toggle:f.fn.toggle,toggle:function(c){if(m(c)||typeof c==="boolean"||f.isFunction(c))return this.__toggle.apply(this,arguments);else{var a=k.apply(this,arguments);a[1].mode="toggle";return this.effect.apply(this,a)}},cssUnit:function(c){var a=this.css(c),
b=[];f.each(["em","px","%","pt"],function(d,e){if(a.indexOf(e)>0)b=[parseFloat(a),e]});return b}});f.easing.jswing=f.easing.swing;f.extend(f.easing,{def:"easeOutQuad",swing:function(c,a,b,d,e){return f.easing[f.easing.def](c,a,b,d,e)},easeInQuad:function(c,a,b,d,e){return d*(a/=e)*a+b},easeOutQuad:function(c,a,b,d,e){return-d*(a/=e)*(a-2)+b},easeInOutQuad:function(c,a,b,d,e){if((a/=e/2)<1)return d/2*a*a+b;return-d/2*(--a*(a-2)-1)+b},easeInCubic:function(c,a,b,d,e){return d*(a/=e)*a*a+b},easeOutCubic:function(c,
a,b,d,e){return d*((a=a/e-1)*a*a+1)+b},easeInOutCubic:function(c,a,b,d,e){if((a/=e/2)<1)return d/2*a*a*a+b;return d/2*((a-=2)*a*a+2)+b},easeInQuart:function(c,a,b,d,e){return d*(a/=e)*a*a*a+b},easeOutQuart:function(c,a,b,d,e){return-d*((a=a/e-1)*a*a*a-1)+b},easeInOutQuart:function(c,a,b,d,e){if((a/=e/2)<1)return d/2*a*a*a*a+b;return-d/2*((a-=2)*a*a*a-2)+b},easeInQuint:function(c,a,b,d,e){return d*(a/=e)*a*a*a*a+b},easeOutQuint:function(c,a,b,d,e){return d*((a=a/e-1)*a*a*a*a+1)+b},easeInOutQuint:function(c,
a,b,d,e){if((a/=e/2)<1)return d/2*a*a*a*a*a+b;return d/2*((a-=2)*a*a*a*a+2)+b},easeInSine:function(c,a,b,d,e){return-d*Math.cos(a/e*(Math.PI/2))+d+b},easeOutSine:function(c,a,b,d,e){return d*Math.sin(a/e*(Math.PI/2))+b},easeInOutSine:function(c,a,b,d,e){return-d/2*(Math.cos(Math.PI*a/e)-1)+b},easeInExpo:function(c,a,b,d,e){return a==0?b:d*Math.pow(2,10*(a/e-1))+b},easeOutExpo:function(c,a,b,d,e){return a==e?b+d:d*(-Math.pow(2,-10*a/e)+1)+b},easeInOutExpo:function(c,a,b,d,e){if(a==0)return b;if(a==
e)return b+d;if((a/=e/2)<1)return d/2*Math.pow(2,10*(a-1))+b;return d/2*(-Math.pow(2,-10*--a)+2)+b},easeInCirc:function(c,a,b,d,e){return-d*(Math.sqrt(1-(a/=e)*a)-1)+b},easeOutCirc:function(c,a,b,d,e){return d*Math.sqrt(1-(a=a/e-1)*a)+b},easeInOutCirc:function(c,a,b,d,e){if((a/=e/2)<1)return-d/2*(Math.sqrt(1-a*a)-1)+b;return d/2*(Math.sqrt(1-(a-=2)*a)+1)+b},easeInElastic:function(c,a,b,d,e){c=1.70158;var g=0,h=d;if(a==0)return b;if((a/=e)==1)return b+d;g||(g=e*0.3);if(h<Math.abs(d)){h=d;c=g/4}else c=
g/(2*Math.PI)*Math.asin(d/h);return-(h*Math.pow(2,10*(a-=1))*Math.sin((a*e-c)*2*Math.PI/g))+b},easeOutElastic:function(c,a,b,d,e){c=1.70158;var g=0,h=d;if(a==0)return b;if((a/=e)==1)return b+d;g||(g=e*0.3);if(h<Math.abs(d)){h=d;c=g/4}else c=g/(2*Math.PI)*Math.asin(d/h);return h*Math.pow(2,-10*a)*Math.sin((a*e-c)*2*Math.PI/g)+d+b},easeInOutElastic:function(c,a,b,d,e){c=1.70158;var g=0,h=d;if(a==0)return b;if((a/=e/2)==2)return b+d;g||(g=e*0.3*1.5);if(h<Math.abs(d)){h=d;c=g/4}else c=g/(2*Math.PI)*Math.asin(d/
h);if(a<1)return-0.5*h*Math.pow(2,10*(a-=1))*Math.sin((a*e-c)*2*Math.PI/g)+b;return h*Math.pow(2,-10*(a-=1))*Math.sin((a*e-c)*2*Math.PI/g)*0.5+d+b},easeInBack:function(c,a,b,d,e,g){if(g==j)g=1.70158;return d*(a/=e)*a*((g+1)*a-g)+b},easeOutBack:function(c,a,b,d,e,g){if(g==j)g=1.70158;return d*((a=a/e-1)*a*((g+1)*a+g)+1)+b},easeInOutBack:function(c,a,b,d,e,g){if(g==j)g=1.70158;if((a/=e/2)<1)return d/2*a*a*(((g*=1.525)+1)*a-g)+b;return d/2*((a-=2)*a*(((g*=1.525)+1)*a+g)+2)+b},easeInBounce:function(c,
a,b,d,e){return d-f.easing.easeOutBounce(c,e-a,0,d,e)+b},easeOutBounce:function(c,a,b,d,e){return(a/=e)<1/2.75?d*7.5625*a*a+b:a<2/2.75?d*(7.5625*(a-=1.5/2.75)*a+0.75)+b:a<2.5/2.75?d*(7.5625*(a-=2.25/2.75)*a+0.9375)+b:d*(7.5625*(a-=2.625/2.75)*a+0.984375)+b},easeInOutBounce:function(c,a,b,d,e){if(a<e/2)return f.easing.easeInBounce(c,a*2,0,d,e)*0.5+b;return f.easing.easeOutBounce(c,a*2-e,0,d,e)*0.5+d*0.5+b}})}(jQuery);
;

/*
 * jQuery BBQ: Back Button & Query Library - v1.2.1 - 2/17/2010
 * http://benalman.com/projects/jquery-bbq-plugin/
 *
 * Copyright (c) 2010 "Cowboy" Ben Alman
 * Dual licensed under the MIT and GPL licenses.
 * http://benalman.com/about/license/
 */
(function($,p){var i,m=Array.prototype.slice,r=decodeURIComponent,a=$.param,c,l,v,b=$.bbq=$.bbq||{},q,u,j,e=$.event.special,d="hashchange",A="querystring",D="fragment",y="elemUrlAttr",g="location",k="href",t="src",x=/^.*\?|#.*$/g,w=/^.*\#/,h,C={};function E(F){return typeof F==="string"}function B(G){var F=m.call(arguments,1);return function(){return G.apply(this,F.concat(m.call(arguments)))}}function n(F){return F.replace(/^[^#]*#?(.*)$/,"$1")}function o(F){return F.replace(/(?:^[^?#]*\?([^#]*).*$)?.*/,"$1")}function f(H,M,F,I,G){var O,L,K,N,J;if(I!==i){K=F.match(H?/^([^#]*)\#?(.*)$/:/^([^#?]*)\??([^#]*)(#?.*)/);J=K[3]||"";if(G===2&&E(I)){L=I.replace(H?w:x,"")}else{N=l(K[2]);I=E(I)?l[H?D:A](I):I;L=G===2?I:G===1?$.extend({},I,N):$.extend({},N,I);L=a(L);if(H){L=L.replace(h,r)}}O=K[1]+(H?"#":L||!K[1]?"?":"")+L+J}else{O=M(F!==i?F:p[g][k])}return O}a[A]=B(f,0,o);a[D]=c=B(f,1,n);c.noEscape=function(G){G=G||"";var F=$.map(G.split(""),encodeURIComponent);h=new RegExp(F.join("|"),"g")};c.noEscape(",/");$.deparam=l=function(I,F){var H={},G={"true":!0,"false":!1,"null":null};$.each(I.replace(/\+/g," ").split("&"),function(L,Q){var K=Q.split("="),P=r(K[0]),J,O=H,M=0,R=P.split("]["),N=R.length-1;if(/\[/.test(R[0])&&/\]$/.test(R[N])){R[N]=R[N].replace(/\]$/,"");R=R.shift().split("[").concat(R);N=R.length-1}else{N=0}if(K.length===2){J=r(K[1]);if(F){J=J&&!isNaN(J)?+J:J==="undefined"?i:G[J]!==i?G[J]:J}if(N){for(;M<=N;M++){P=R[M]===""?O.length:R[M];O=O[P]=M<N?O[P]||(R[M+1]&&isNaN(R[M+1])?{}:[]):J}}else{if($.isArray(H[P])){H[P].push(J)}else{if(H[P]!==i){H[P]=[H[P],J]}else{H[P]=J}}}}else{if(P){H[P]=F?i:""}}});return H};function z(H,F,G){if(F===i||typeof F==="boolean"){G=F;F=a[H?D:A]()}else{F=E(F)?F.replace(H?w:x,""):F}return l(F,G)}l[A]=B(z,0);l[D]=v=B(z,1);$[y]||($[y]=function(F){return $.extend(C,F)})({a:k,base:k,iframe:t,img:t,input:t,form:"action",link:k,script:t});j=$[y];function s(I,G,H,F){if(!E(H)&&typeof H!=="object"){F=H;H=G;G=i}return this.each(function(){var L=$(this),J=G||j()[(this.nodeName||"").toLowerCase()]||"",K=J&&L.attr(J)||"";L.attr(J,a[I](K,H,F))})}$.fn[A]=B(s,A);$.fn[D]=B(s,D);b.pushState=q=function(I,F){if(E(I)&&/^#/.test(I)&&F===i){F=2}var H=I!==i,G=c(p[g][k],H?I:{},H?F:2);p[g][k]=G+(/#/.test(G)?"":"#")};b.getState=u=function(F,G){return F===i||typeof F==="boolean"?v(F):v(G)[F]};b.removeState=function(F){var G={};if(F!==i){G=u();$.each($.isArray(F)?F:arguments,function(I,H){delete G[H]})}q(G,2)};e[d]=$.extend(e[d],{add:function(F){var H;function G(J){var I=J[D]=c();J.getState=function(K,L){return K===i||typeof K==="boolean"?l(I,K):l(I,L)[K]};H.apply(this,arguments)}if($.isFunction(F)){H=F;return G}else{H=F.handler;F.handler=G}}})})(jQuery,this);
/*
 * jQuery hashchange event - v1.2 - 2/11/2010
 * http://benalman.com/projects/jquery-hashchange-plugin/
 *
 * Copyright (c) 2010 "Cowboy" Ben Alman
 * Dual licensed under the MIT and GPL licenses.
 * http://benalman.com/about/license/
 */
(function($,i,b){var j,k=$.event.special,c="location",d="hashchange",l="href",f=$.browser,g=document.documentMode,h=f.msie&&(g===b||g<8),e="on"+d in i&&!h;function a(m){m=m||i[c][l];return m.replace(/^[^#]*#?(.*)$/,"$1")}$[d+"Delay"]=100;k[d]=$.extend(k[d],{setup:function(){if(e){return false}$(j.start)},teardown:function(){if(e){return false}$(j.stop)}});j=(function(){var m={},r,n,o,q;function p(){o=q=function(s){return s};if(h){n=$('<iframe src="javascript:0"/>').hide().insertAfter("body")[0].contentWindow;q=function(){return a(n.document[c][l])};o=function(u,s){if(u!==s){var t=n.document;t.open().close();t[c].hash="#"+u}};o(a())}}m.start=function(){if(r){return}var t=a();o||p();(function s(){var v=a(),u=q(t);if(v!==t){o(t=v,u);$(i).trigger(d)}else{if(u!==t){i[c][l]=i[c][l].replace(/#.*/,"")+"#"+u}}r=setTimeout(s,$[d+"Delay"])})()};m.stop=function(){if(!n){r&&clearTimeout(r);r=0}};return m})()})(jQuery,this);
;

(function ($) {

/**
 * Open the overlay, or load content into it, when an admin link is clicked.
 */
Drupal.behaviors.overlayParent = {
  attach: function (context, settings) {
    if (Drupal.overlay.isOpen) {
      Drupal.overlay.makeDocumentUntabbable(context);
    }

    if (this.processed) {
      return;
    }
    this.processed = true;

    $(window)
      // When the hash (URL fragment) changes, open the overlay if needed.
      .bind('hashchange.drupal-overlay', $.proxy(Drupal.overlay, 'eventhandlerOperateByURLFragment'))
      // Trigger the hashchange handler once, after the page is loaded, so that
      // permalinks open the overlay.
      .triggerHandler('hashchange.drupal-overlay');

    $(document)
      // Instead of binding a click event handler to every link we bind one to
      // the document and only handle events that bubble up. This allows other
      // scripts to bind their own handlers to links and also to prevent
      // overlay's handling.
      .bind('click.drupal-overlay mouseup.drupal-overlay', $.proxy(Drupal.overlay, 'eventhandlerOverrideLink'));
  }
};

/**
 * Overlay object for parent windows.
 *
 * Events
 * Overlay triggers a number of events that can be used by other scripts.
 * - drupalOverlayOpen: This event is triggered when the overlay is opened.
 * - drupalOverlayBeforeClose: This event is triggered when the overlay attempts
 *   to close. If an event handler returns false, the close will be prevented.
 * - drupalOverlayClose: This event is triggered when the overlay is closed.
 * - drupalOverlayBeforeLoad: This event is triggered right before a new URL
 *   is loaded into the overlay.
 * - drupalOverlayReady: This event is triggered when the DOM of the overlay
 *   child document is fully loaded.
 * - drupalOverlayLoad: This event is triggered when the overlay is finished
 *   loading.
 * - drupalOverlayResize: This event is triggered when the overlay is being
 *   resized to match the parent window.
 */
Drupal.overlay = Drupal.overlay || {
  isOpen: false,
  isOpening: false,
  isClosing: false,
  isLoading: false
};

Drupal.overlay.prototype = {};

/**
 * Open the overlay.
 *
 * @param url
 *   The URL of the page to open in the overlay.
 *
 * @return
 *   TRUE if the overlay was opened, FALSE otherwise.
 */
Drupal.overlay.open = function (url) {
  // Just one overlay is allowed.
  if (this.isOpen || this.isOpening) {
    return this.load(url);
  }
  this.isOpening = true;
  // Store the original document title.
  this.originalTitle = document.title;

  // Create the dialog and related DOM elements.
  this.create();

  this.isOpening = false;
  this.isOpen = true;
  $(document.documentElement).addClass('overlay-open');
  this.makeDocumentUntabbable();

  // Allow other scripts to respond to this event.
  $(document).trigger('drupalOverlayOpen');

  return this.load(url);
};

/**
 * Create the underlying markup and behaviors for the overlay.
 */
Drupal.overlay.create = function () {
  this.$container = $(Drupal.theme('overlayContainer'))
    .appendTo(document.body);

  // Overlay uses transparent iframes that cover the full parent window.
  // When the overlay is open the scrollbar of the parent window is hidden.
  // Because some browsers show a white iframe background for a short moment
  // while loading a page into an iframe, overlay uses two iframes. By loading
  // the page in a hidden (inactive) iframe the user doesn't see the white
  // background. When the page is loaded the active and inactive iframes
  // are switched.
  this.activeFrame = this.$iframeA = $(Drupal.theme('overlayElement'))
    .appendTo(this.$container);

  this.inactiveFrame = this.$iframeB = $(Drupal.theme('overlayElement'))
    .appendTo(this.$container);

  this.$iframeA.bind('load.drupal-overlay', { self: this.$iframeA[0], sibling: this.$iframeB }, $.proxy(this, 'loadChild'));
  this.$iframeB.bind('load.drupal-overlay', { self: this.$iframeB[0], sibling: this.$iframeA }, $.proxy(this, 'loadChild'));

  // Add a second class "drupal-overlay-open" to indicate these event handlers
  // should only be bound when the overlay is open.
  var eventClass = '.drupal-overlay.drupal-overlay-open';
  $(window)
    .bind('resize' + eventClass, $.proxy(this, 'eventhandlerOuterResize'));
  $(document)
    .bind('drupalOverlayLoad' + eventClass, $.proxy(this, 'eventhandlerOuterResize'))
    .bind('drupalOverlayReady' + eventClass +
          ' drupalOverlayClose' + eventClass, $.proxy(this, 'eventhandlerSyncURLFragment'))
    .bind('drupalOverlayClose' + eventClass, $.proxy(this, 'eventhandlerRefreshPage'))
    .bind('drupalOverlayBeforeClose' + eventClass +
          ' drupalOverlayBeforeLoad' + eventClass +
          ' drupalOverlayResize' + eventClass, $.proxy(this, 'eventhandlerDispatchEvent'));

  if ($('.overlay-displace-top, .overlay-displace-bottom').length) {
    $(document)
      .bind('drupalOverlayResize' + eventClass, $.proxy(this, 'eventhandlerAlterDisplacedElements'))
      .bind('drupalOverlayClose' + eventClass, $.proxy(this, 'eventhandlerRestoreDisplacedElements'));
  }
};

/**
 * Load the given URL into the overlay iframe.
 *
 * Use this method to change the URL being loaded in the overlay if it is
 * already open.
 *
 * @return
 *   TRUE if URL is loaded into the overlay, FALSE otherwise.
 */
Drupal.overlay.load = function (url) {
  if (!this.isOpen) {
    return false;
  }

  // Allow other scripts to respond to this event.
  $(document).trigger('drupalOverlayBeforeLoad');

  $(document.documentElement).addClass('overlay-loading');

  // The contentDocument property is not supported in IE until IE8.
  var iframeDocument = this.inactiveFrame[0].contentDocument || this.inactiveFrame[0].contentWindow.document;

  // location.replace doesn't create a history entry. location.href does.
  // In this case, we want location.replace, as we're creating the history
  // entry using URL fragments.
  iframeDocument.location.replace(url);

  return true;
};

/**
 * Close the overlay and remove markup related to it from the document.
 *
 * @return
 *   TRUE if the overlay was closed, FALSE otherwise.
 */
Drupal.overlay.close = function () {
  // Prevent double execution when close is requested more than once.
  if (!this.isOpen || this.isClosing) {
    return false;
  }

  // Allow other scripts to respond to this event.
  var event = $.Event('drupalOverlayBeforeClose');
  $(document).trigger(event);
  // If a handler returned false, the close will be prevented.
  if (event.isDefaultPrevented()) {
    return false;
  }

  this.isClosing = true;
  this.isOpen = false;
  $(document.documentElement).removeClass('overlay-open');
  // Restore the original document title.
  document.title = this.originalTitle;
  this.makeDocumentTabbable();

  // Allow other scripts to respond to this event.
  $(document).trigger('drupalOverlayClose');

  // When the iframe is still loading don't destroy it immediately but after
  // the content is loaded (see Drupal.overlay.loadChild).
  if (!this.isLoading) {
    this.destroy();
    this.isClosing = false;
  }
  return true;
};

/**
 * Destroy the overlay.
 */
Drupal.overlay.destroy = function () {
  $([document, window]).unbind('.drupal-overlay-open');
  this.$container.remove();

  this.$container = null;
  this.$iframeA = null;
  this.$iframeB = null;

  this.iframeWindow = null;
};

/**
 * Redirect the overlay parent window to the given URL.
 *
 * @param url
 *   Can be an absolute URL or a relative link to the domain root.
 */
Drupal.overlay.redirect = function (url) {
  // Create a native Link object, so we can use its object methods.
  var link = $(url.link(url)).get(0);

  // If the link is already open, force the hashchange event to simulate reload.
  if (window.location.href == link.href) {
    $(window).triggerHandler('hashchange.drupal-overlay');
  }

  window.location.href = link.href;
  return true;
};

/**
 * Bind the child window.
 *
 * Note that this function is fired earlier than Drupal.overlay.loadChild.
 */
Drupal.overlay.bindChild = function (iframeWindow, isClosing) {
  this.iframeWindow = iframeWindow;

  // We are done if the child window is closing.
  if (isClosing || this.isClosing || !this.isOpen) {
    return;
  }

  // Allow other scripts to respond to this event.
  $(document).trigger('drupalOverlayReady');
};

/**
 * Event handler: load event handler for the overlay iframe.
 *
 * @param event
 *   Event being triggered, with the following restrictions:
 *   - event.type: load
 *   - event.currentTarget: iframe
 */
Drupal.overlay.loadChild = function (event) {
  var iframe = event.data.self;
  var iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
  var iframeWindow = iframeDocument.defaultView || iframeDocument.parentWindow;
  if (iframeWindow.location == 'about:blank') {
    return;
  }

  this.isLoading = false;
  $(document.documentElement).removeClass('overlay-loading');
  event.data.sibling.removeClass('overlay-active').attr({ 'tabindex': -1 });

  // Only continue when overlay is still open and not closing.
  if (this.isOpen && !this.isClosing) {
    // And child document is an actual overlayChild.
    if (iframeWindow.Drupal && iframeWindow.Drupal.overlayChild) {
      // Replace the document title with title of iframe.
      document.title = iframeWindow.document.title;

      this.activeFrame = $(iframe)
        .addClass('overlay-active')
        // Add a title attribute to the iframe for accessibility.
        .attr('title', Drupal.t('@title dialog', { '@title': iframeWindow.jQuery('#overlay-title').text() })).removeAttr('tabindex');
      this.inactiveFrame = event.data.sibling;

      // Load an empty document into the inactive iframe.
      (this.inactiveFrame[0].contentDocument || this.inactiveFrame[0].contentWindow.document).location.replace('about:blank');

      // Move the focus to just before the "skip to main content" link inside
      // the overlay.
      this.activeFrame.focus();
      var skipLink = iframeWindow.jQuery('a:first');
      Drupal.overlay.setFocusBefore(skipLink, iframeWindow.document);

      // Allow other scripts to respond to this event.
      $(document).trigger('drupalOverlayLoad');
    }
    else {
      window.location = iframeWindow.location.href.replace(/([?&]?)render=overlay&?/g, '$1').replace(/\?$/, '');
    }
  }
  else {
    this.destroy();
  }
};

/**
 * Creates a placeholder element to receive document focus.
 *
 * Setting the document focus to a link will make it visible, even if it's a
 * "skip to main content" link that should normally be visible only when the
 * user tabs to it. This function can be used to set the document focus to
 * just before such an invisible link.
 *
 * @param $element
 *   The jQuery element that should receive focus on the next tab press.
 * @param document
 *   The iframe window element to which the placeholder should be added. The
 *   placeholder element has to be created inside the same iframe as the element
 *   it precedes, to keep IE happy. (http://bugs.jquery.com/ticket/4059)
 */
Drupal.overlay.setFocusBefore = function ($element, document) {
  // Create an anchor inside the placeholder document.
  var placeholder = document.createElement('a');
  var $placeholder = $(placeholder).addClass('element-invisible').attr('href', '#');
  // Put the placeholder where it belongs, and set the document focus to it.
  $placeholder.insertBefore($element);
  $placeholder.focus();
  // Make the placeholder disappear as soon as it loses focus, so that it
  // doesn't appear in the tab order again.
  $placeholder.one('blur', function () {
    $(this).remove();
  });
}

/**
 * Check if the given link is in the administrative section of the site.
 *
 * @param url
 *   The url to be tested.
 *
 * @return boolean
 *   TRUE if the URL represents an administrative link, FALSE otherwise.
 */
Drupal.overlay.isAdminLink = function (url) {
  if (Drupal.overlay.isExternalLink(url)) {
    return false;
  }

  var path = this.getPath(url);

  // Turn the list of administrative paths into a regular expression.
  if (!this.adminPathRegExp) {
    var regExpPrefix = '^' + Drupal.settings.pathPrefix + '(';
    var adminPaths = regExpPrefix + Drupal.settings.overlay.paths.admin.replace(/\s+/g, ')$|' + regExpPrefix) + ')$';
    var nonAdminPaths = regExpPrefix + Drupal.settings.overlay.paths.non_admin.replace(/\s+/g, ')$|'+ regExpPrefix) + ')$';
    adminPaths = adminPaths.replace(/\*/g, '.*');
    nonAdminPaths = nonAdminPaths.replace(/\*/g, '.*');
    this.adminPathRegExp = new RegExp(adminPaths);
    this.nonAdminPathRegExp = new RegExp(nonAdminPaths);
  }

  return this.adminPathRegExp.exec(path) && !this.nonAdminPathRegExp.exec(path);
};

/**
 * Determine whether a link is external to the site.
 *
 * @param url
 *   The url to be tested.
 *
 * @return boolean
 *   TRUE if the URL is external to the site, FALSE otherwise.
 */
Drupal.overlay.isExternalLink = function (url) {
  var re = RegExp('^((f|ht)tps?:)?//(?!' + window.location.host + ')');
  return re.test(url);
};

/**
 * Event handler: resizes overlay according to the size of the parent window.
 *
 * @param event
 *   Event being triggered, with the following restrictions:
 *   - event.type: any
 *   - event.currentTarget: any
 */
Drupal.overlay.eventhandlerOuterResize = function (event) {
  // Proceed only if the overlay still exists.
  if (!(this.isOpen || this.isOpening) || this.isClosing || !this.iframeWindow) {
    return;
  }

  // IE6 uses position:absolute instead of position:fixed.
  if (typeof document.body.style.maxHeight != 'string') {
    this.activeFrame.height($(window).height());
  }

  // Allow other scripts to respond to this event.
  $(document).trigger('drupalOverlayResize');
};

/**
 * Event handler: resizes displaced elements so they won't overlap the scrollbar
 * of overlay's iframe.
 *
 * @param event
 *   Event being triggered, with the following restrictions:
 *   - event.type: any
 *   - event.currentTarget: any
 */
Drupal.overlay.eventhandlerAlterDisplacedElements = function (event) {
  // Proceed only if the overlay still exists.
  if (!(this.isOpen || this.isOpening) || this.isClosing || !this.iframeWindow) {
    return;
  }

  $(this.iframeWindow.document.body).css({
    marginTop: Drupal.overlay.getDisplacement('top'),
    marginBottom: Drupal.overlay.getDisplacement('bottom')
  })
  // IE7 isn't reflowing the document immediately.
  // @todo This might be fixed in a cleaner way.
  .addClass('overlay-trigger-reflow').removeClass('overlay-trigger-reflow');

  var documentHeight = this.iframeWindow.document.body.clientHeight;
  var documentWidth = this.iframeWindow.document.body.clientWidth;
  // IE6 doesn't support maxWidth, use width instead.
  var maxWidthName = (typeof document.body.style.maxWidth == 'string') ? 'maxWidth' : 'width';

  if (Drupal.overlay.leftSidedScrollbarOffset === undefined && $(document.documentElement).attr('dir') === 'rtl') {
    // We can't use element.clientLeft to detect whether scrollbars are placed
    // on the left side of the element when direction is set to "rtl" as most
    // browsers dont't support it correctly.
    // http://www.gtalbot.org/BugzillaSection/DocumentAllDHTMLproperties.html
    // There seems to be absolutely no way to detect whether the scrollbar
    // is on the left side in Opera; always expect scrollbar to be on the left.
    if ($.browser.opera) {
      Drupal.overlay.leftSidedScrollbarOffset = document.documentElement.clientWidth - this.iframeWindow.document.documentElement.clientWidth + this.iframeWindow.document.documentElement.clientLeft;
    }
    else if (this.iframeWindow.document.documentElement.clientLeft) {
      Drupal.overlay.leftSidedScrollbarOffset = this.iframeWindow.document.documentElement.clientLeft;
    }
    else {
      var el1 = $('<div style="direction: rtl; overflow: scroll;"></div>').appendTo(document.body);
      var el2 = $('<div></div>').appendTo(el1);
      Drupal.overlay.leftSidedScrollbarOffset = parseInt(el2[0].offsetLeft - el1[0].offsetLeft);
      el1.remove();
    }
  }

  // Consider any element that should be visible above the overlay (such as
  // a toolbar).
  $('.overlay-displace-top, .overlay-displace-bottom').each(function () {
    var data = $(this).data();
    var maxWidth = documentWidth;
    // In IE, Shadow filter makes element to overlap the scrollbar with 1px.
    if (this.filters && this.filters.length && this.filters.item('DXImageTransform.Microsoft.Shadow')) {
      maxWidth -= 1;
    }

    if (Drupal.overlay.leftSidedScrollbarOffset) {
      $(this).css('left', Drupal.overlay.leftSidedScrollbarOffset);
    }

    // Prevent displaced elements overlapping window's scrollbar.
    var currentMaxWidth = parseInt($(this).css(maxWidthName));
    if ((data.drupalOverlay && data.drupalOverlay.maxWidth) || isNaN(currentMaxWidth) || currentMaxWidth > maxWidth || currentMaxWidth <= 0) {
      $(this).css(maxWidthName, maxWidth);
      (data.drupalOverlay = data.drupalOverlay || {}).maxWidth = true;
    }

    // Use a more rigorous approach if the displaced element still overlaps
    // window's scrollbar; clip the element on the right.
    var offset = $(this).offset();
    var offsetRight = offset.left + $(this).outerWidth();
    if ((data.drupalOverlay && data.drupalOverlay.clip) || offsetRight > maxWidth) {
      if (Drupal.overlay.leftSidedScrollbarOffset) {
        $(this).css('clip', 'rect(auto, auto, ' + (documentHeight - offset.top) + 'px, ' + (Drupal.overlay.leftSidedScrollbarOffset + 2) + 'px)');
      }
      else {
        $(this).css('clip', 'rect(auto, ' + (maxWidth - offset.left) + 'px, ' + (documentHeight - offset.top) + 'px, auto)');
      }
      (data.drupalOverlay = data.drupalOverlay || {}).clip = true;
    }
  });
};

/**
 * Event handler: restores size of displaced elements as they were before
 * overlay was opened.
 *
 * @param event
 *   Event being triggered, with the following restrictions:
 *   - event.type: any
 *   - event.currentTarget: any
 */
Drupal.overlay.eventhandlerRestoreDisplacedElements = function (event) {
  var $displacedElements = $('.overlay-displace-top, .overlay-displace-bottom');
  try {
    $displacedElements.css({ maxWidth: '', clip: '' });
  }
  // IE bug that doesn't allow unsetting style.clip (http://dev.jquery.com/ticket/6512).
  catch (err) {
    $displacedElements.attr('style', function (index, attr) {
      return attr.replace(/clip\s*:\s*rect\([^)]+\);?/i, '');
    });
  }
};

/**
 * Event handler: overrides href of administrative links to be opened in
 * the overlay.
 *
 * This click event handler should be bound to any document (for example the
 * overlay iframe) of which you want links to open in the overlay.
 *
 * @param event
 *   Event being triggered, with the following restrictions:
 *   - event.type: click, mouseup
 *   - event.currentTarget: document
 *
 * @see Drupal.overlayChild.behaviors.addClickHandler
 */
Drupal.overlay.eventhandlerOverrideLink = function (event) {
  // In some browsers the click event isn't fired for right-clicks. Use the
  // mouseup event for right-clicks and the click event for everything else.
  if ((event.type == 'click' && event.button == 2) || (event.type == 'mouseup' && event.button != 2)) {
    return;
  }

  var $target = $(event.target);

  // Only continue if clicked target (or one of its parents) is a link.
  if (!$target.is('a')) {
    $target = $target.closest('a');
    if (!$target.length) {
      return;
    }
  }

  // Never open links in the overlay that contain the overlay-exclude class.
  if ($target.hasClass('overlay-exclude')) {
    return;
  }

  // Close the overlay when the link contains the overlay-close class.
  if ($target.hasClass('overlay-close')) {
    // Clearing the overlay URL fragment will close the overlay.
    $.bbq.removeState('overlay');
    return;
  }

  var target = $target[0];
  var href = target.href;
  // Only handle links that have an href attribute and use the http(s) protocol.
  if (href != undefined && href != '' && target.protocol.match(/^https?\:/)) {
    var anchor = href.replace(target.ownerDocument.location.href, '');
    // Skip anchor links.
    if (anchor.length == 0 || anchor.charAt(0) == '#') {
      return;
    }
    // Open admin links in the overlay.
    else if (this.isAdminLink(href)) {
      // If the link contains the overlay-restore class and the overlay-context
      // state is set, also update the parent window's location.
      var parentLocation = ($target.hasClass('overlay-restore') && typeof $.bbq.getState('overlay-context') == 'string')
        ? Drupal.settings.basePath + $.bbq.getState('overlay-context')
        : null;
      href = this.fragmentizeLink($target.get(0), parentLocation);
      // Only override default behavior when left-clicking and user is not
      // pressing the ALT, CTRL, META (Command key on the Macintosh keyboard)
      // or SHIFT key.
      if (event.button == 0 && !event.altKey && !event.ctrlKey && !event.metaKey && !event.shiftKey) {
        // Redirect to a fragmentized href. This will trigger a hashchange event.
        this.redirect(href);
        // Prevent default action and further propagation of the event.
        return false;
      }
      // Otherwise alter clicked link's href. This is being picked up by
      // the default action handler.
      else {
        $target
          // Restore link's href attribute on blur or next click.
          .one('blur mousedown', { target: target, href: target.href }, function (event) { $(event.data.target).attr('href', event.data.href); })
          .attr('href', href);
      }
    }
    // Non-admin links should close the overlay and open in the main window,
    // which is the default action for a link. We only need to handle them
    // if the overlay is open and the clicked link is inside the overlay iframe.
    else if (this.isOpen && target.ownerDocument === this.iframeWindow.document) {
      // Open external links in the immediate parent of the frame, unless the
      // link already has a different target.
      if (target.hostname != window.location.hostname) {
        if (!$target.attr('target')) {
          $target.attr('target', '_parent');
        }
      }
      else {
        // Add the overlay-context state to the link, so "overlay-restore" links
        // can restore the context.
        $target.attr('href', $.param.fragment(href, { 'overlay-context': this.getPath(window.location) + window.location.search }));

        // When the link has a destination query parameter and that destination
        // is an admin link we need to fragmentize it. This will make it reopen
        // in the overlay.
        var params = $.deparam.querystring(href);
        if (params.destination && this.isAdminLink(params.destination)) {
          var fragmentizedDestination = $.param.fragment(this.getPath(window.location), { overlay: params.destination });
          $target.attr('href', $.param.querystring(href, { destination: fragmentizedDestination }));
        }

        // Make the link open in the immediate parent of the frame.
        $target.attr('target', '_parent');
      }
    }
  }
};

/**
 * Event handler: opens or closes the overlay based on the current URL fragment.
 *
 * @param event
 *   Event being triggered, with the following restrictions:
 *   - event.type: hashchange
 *   - event.currentTarget: document
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
  }
  // If there is no overlay URL in the fragment and the overlay is (still)
  // open, close the overlay.
  else if (this.isOpen && !this.isClosing) {
    this.close();
    this.resetActiveClass(this.getPath(window.location));
  }
};

/**
 * Event handler: makes sure the internal overlay URL is reflected in the parent
 * URL fragment.
 *
 * Normally the parent URL fragment determines the overlay location. However, if
 * the overlay redirects internally, the parent doesn't get informed, and the
 * parent URL fragment will be out of date. This is a sanity check to make
 * sure we're in the right place.
 *
 * The parent URL fragment is also not updated automatically when overlay's
 * open, close or load functions are used directly (instead of through
 * eventhandlerOperateByURLFragment).
 *
 * @param event
 *   Event being triggered, with the following restrictions:
 *   - event.type: drupalOverlayReady, drupalOverlayClose
 *   - event.currentTarget: document
 */
Drupal.overlay.eventhandlerSyncURLFragment = function (event) {
  if (this.isOpen) {
    var expected = $.bbq.getState('overlay');
    // This is just a sanity check, so we're comparing paths, not query strings.
    if (this.getPath(Drupal.settings.basePath + expected) != this.getPath(this.iframeWindow.document.location)) {
      // There may have been a redirect inside the child overlay window that the
      // parent wasn't aware of. Update the parent URL fragment appropriately.
      var newLocation = Drupal.overlay.fragmentizeLink(this.iframeWindow.document.location);
      // Set a 'redirect' flag on the new location so the hashchange event handler
      // knows not to change the overlay's content.
      $.data(window.location, newLocation, 'redirect');
      // Use location.replace() so we don't create an extra history entry.
      window.location.replace(newLocation);
    }
  }
  else {
    $.bbq.removeState('overlay');
  }
};

/**
 * Event handler: if the child window suggested that the parent refresh on
 * close, force a page refresh.
 *
 * @param event
 *   Event being triggered, with the following restrictions:
 *   - event.type: drupalOverlayClose
 *   - event.currentTarget: document
 */
Drupal.overlay.eventhandlerRefreshPage = function (event) {
  if (Drupal.overlay.refreshPage) {
    window.location.reload(true);
  }
};

/**
 * Event handler: dispatches events to the overlay document.
 *
 * @param event
 *   Event being triggered, with the following restrictions:
 *   - event.type: any
 *   - event.currentTarget: any
 */
Drupal.overlay.eventhandlerDispatchEvent = function (event) {
  if (this.iframeWindow && this.iframeWindow.document) {
    this.iframeWindow.jQuery(this.iframeWindow.document).trigger(event);
  }
};

/**
 * Make a regular admin link into a URL that will trigger the overlay to open.
 *
 * @param link
 *   A JavaScript Link object (i.e. an <a> element).
 * @param parentLocation
 *   (optional) URL to override the parent window's location with.
 *
 * @return
 *   A URL that will trigger the overlay (in the form
 *   /node/1#overlay=admin/config).
 */
Drupal.overlay.fragmentizeLink = function (link, parentLocation) {
  // Don't operate on links that are already overlay-ready.
  var params = $.deparam.fragment(link.href);
  if (params.overlay) {
    return link.href;
  }

  // Determine the link's original destination. Set ignorePathFromQueryString to
  // true to prevent transforming this link into a clean URL while clean URLs
  // may be disabled.
  var path = this.getPath(link, true);
  // Preserve existing query and fragment parameters in the URL, except for
  // "render=overlay" which is re-added in Drupal.overlay.eventhandlerOperateByURLFragment.
  var destination = path + link.search.replace(/&?render=overlay/, '').replace(/\?$/, '') + link.hash;

  // Assemble and return the overlay-ready link.
  return $.param.fragment(parentLocation || window.location.href, { overlay: destination });
};

/**
 * Refresh any regions of the page that are displayed outside the overlay.
 *
 * @param data
 *   An array of objects with information on the page regions to be refreshed.
 *   For each object, the key is a CSS class identifying the region to be
 *   refreshed, and the value represents the section of the Drupal $page array
 *   corresponding to this region.
 */
Drupal.overlay.refreshRegions = function (data) {
  $.each(data, function () {
    var region_info = this;
    $.each(region_info, function (regionClass) {
      var regionName = region_info[regionClass];
      var regionSelector = '.' + regionClass;
      // Allow special behaviors to detach.
      Drupal.detachBehaviors($(regionSelector));
      $.get(Drupal.settings.basePath + Drupal.settings.overlay.ajaxCallback + '/' + regionName, function (newElement) {
        $(regionSelector).replaceWith($(newElement));
        Drupal.attachBehaviors($(regionSelector), Drupal.settings);
      });
    });
  });
};

/**
 * Reset the active class on links in displaced elements according to
 * given path.
 *
 * @param activePath
 *   Path to match links against.
 */
Drupal.overlay.resetActiveClass = function(activePath) {
  var self = this;
  var windowDomain = window.location.protocol + window.location.hostname;

  $('.overlay-displace-top, .overlay-displace-bottom')
  .find('a[href]')
  // Remove active class from all links in displaced elements.
  .removeClass('active')
  // Add active class to links that match activePath.
  .each(function () {
    var linkDomain = this.protocol + this.hostname;
    var linkPath = self.getPath(this);

    // A link matches if it is part of the active trail of activePath, except
    // for frontpage links.
    if (linkDomain == windowDomain && (activePath + '/').indexOf(linkPath + '/') === 0 && (linkPath !== '' || activePath === '')) {
      $(this).addClass('active');
    }
  });
};

/**
 * Helper function to get the (corrected) Drupal path of a link.
 *
 * @param link
 *   Link object or string to get the Drupal path from.
 * @param ignorePathFromQueryString
 *   Boolean whether to ignore path from query string if path appears empty.
 *
 * @return
 *   The Drupal path.
 */
Drupal.overlay.getPath = function (link, ignorePathFromQueryString) {
  if (typeof link == 'string') {
    // Create a native Link object, so we can use its object methods.
    link = $(link.link(link)).get(0);
  }

  var path = link.pathname;
  // Ensure a leading slash on the path, omitted in some browsers.
  if (path.charAt(0) != '/') {
    path = '/' + path;
  }
  path = path.replace(new RegExp(Drupal.settings.basePath + '(?:index.php)?'), '');
  if (path == '' && !ignorePathFromQueryString) {
    // If the path appears empty, it might mean the path is represented in the
    // query string (clean URLs are not used).
    var match = new RegExp('([?&])q=(.+)([&#]|$)').exec(link.search);
    if (match && match.length == 4) {
      path = match[2];
    }
  }

  return path;
};

/**
 * Get the total displacement of given region.
 *
 * @param region
 *   Region name. Either "top" or "bottom".
 *
 * @return
 *   The total displacement of given region in pixels.
 */
Drupal.overlay.getDisplacement = function (region) {
  var displacement = 0;
  var lastDisplaced = $('.overlay-displace-' + region + ':last');
  if (lastDisplaced.length) {
    displacement = lastDisplaced.offset().top + lastDisplaced.outerHeight();

    // Remove height added by IE Shadow filter.
    if (lastDisplaced[0].filters && lastDisplaced[0].filters.length && lastDisplaced[0].filters.item('DXImageTransform.Microsoft.Shadow')) {
      displacement -= lastDisplaced[0].filters.item('DXImageTransform.Microsoft.Shadow').strength;
      displacement = Math.max(0, displacement);
    }
  }
  return displacement;
};

/**
 * Makes elements outside the overlay unreachable via the tab key.
 *
 * @param context
 *   The part of the DOM that should have its tabindexes changed. Defaults to
 *   the entire page.
 */
Drupal.overlay.makeDocumentUntabbable = function (context) {
  // Manipulating tabindexes for the entire document is unacceptably slow in IE6
  // and IE7, so in those browsers, the underlying page will still be reachable
  // via the tab key. However, we still make the links within the Disable
  // message unreachable, because the same message also exists within the
  // child document. The duplicate copy in the underlying document is only for
  // assisting screen-reader users navigating the document with reading commands
  // that follow markup order rather than tab order.
  if (jQuery.browser.msie && parseInt(jQuery.browser.version, 10) < 8) {
    $('#overlay-disable-message a', context).attr('tabindex', -1);
    return;
  }

  context = context || document.body;
  var $overlay, $tabbable, $hasTabindex;

  // Determine which elements on the page already have a tabindex.
  $hasTabindex = $('[tabindex] :not(.overlay-element)', context);
  // Record the tabindex for each element, so we can restore it later.
  $hasTabindex.each(Drupal.overlay._recordTabindex);
  // Add the tabbable elements from the current context to any that we might
  // have previously recorded.
  Drupal.overlay._hasTabindex = $hasTabindex.add(Drupal.overlay._hasTabindex);

  // Set tabindex to -1 on everything outside the overlay and toolbars, so that
  // the underlying page is unreachable.

  // By default, browsers make a, area, button, input, object, select, textarea,
  // and iframe elements reachable via the tab key.
  $tabbable = $('a, area, button, input, object, select, textarea, iframe');
  // If another element (like a div) has a tabindex, it's also tabbable.
  $tabbable = $tabbable.add($hasTabindex);
  // Leave links inside the overlay and toolbars alone.
  $overlay = $('.overlay-element, #overlay-container, .overlay-displace-top, .overlay-displace-bottom').find('*');
  $tabbable = $tabbable.not($overlay);
  // We now have a list of everything in the underlying document that could
  // possibly be reachable via the tab key. Make it all unreachable.
  $tabbable.attr('tabindex', -1);
};

/**
 * Restores the original tabindex value of a group of elements.
 *
 * @param context
 *   The part of the DOM that should have its tabindexes restored. Defaults to
 *   the entire page.
 */
Drupal.overlay.makeDocumentTabbable = function (context) {
  // Manipulating tabindexes is unacceptably slow in IE6 and IE7. In those
  // browsers, the underlying page was never made unreachable via tab, so
  // there is no work to be done here.
  if (jQuery.browser.msie && parseInt(jQuery.browser.version, 10) < 8) {
    return;
  }

  var $needsTabindex;
  context = context || document.body;

  // Make the underlying document tabbable again by removing all existing
  // tabindex attributes.
  var $tabindex = $('[tabindex]', context);
  if (jQuery.browser.msie && parseInt(jQuery.browser.version, 10) < 8) {
    // removeAttr('tabindex') is broken in IE6-7, but the DOM function
    // removeAttribute works.
    var i;
    var length = $tabindex.length;
    for (i = 0; i < length; i++) {
      $tabindex[i].removeAttribute('tabIndex');
    }
  }
  else {
    $tabindex.removeAttr('tabindex');
  }

  // Restore the tabindex attributes that existed before the overlay was opened.
  $needsTabindex = $(Drupal.overlay._hasTabindex, context);
  $needsTabindex.each(Drupal.overlay._restoreTabindex);
  Drupal.overlay._hasTabindex = Drupal.overlay._hasTabindex.not($needsTabindex);
};

/**
 * Record the tabindex for an element, using $.data.
 *
 * Meant to be used as a jQuery.fn.each callback.
 */
Drupal.overlay._recordTabindex = function () {
  var $element = $(this);
  var tabindex = $(this).attr('tabindex');
  $element.data('drupalOverlayOriginalTabIndex', tabindex);
}

/**
 * Restore an element's original tabindex.
 *
 * Meant to be used as a jQuery.fn.each callback.
 */
Drupal.overlay._restoreTabindex = function () {
  var $element = $(this);
  var tabindex = $element.data('drupalOverlayOriginalTabIndex');
  $element.attr('tabindex', tabindex);
};

/**
 * Theme function to create the overlay iframe element.
 */
Drupal.theme.prototype.overlayContainer = function () {
  return '<div id="overlay-container"><div class="overlay-modal-background"></div></div>';
};

/**
 * Theme function to create an overlay iframe element.
 */
Drupal.theme.prototype.overlayElement = function (url) {
  return '<iframe class="overlay-element" frameborder="0" scrolling="auto" allowtransparency="true"></iframe>';
};

})(jQuery);
;

/*
 * jQuery UI Button 1.8.7
 *
 * Copyright 2010, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Button
 *
 * Depends:
 *	jquery.ui.core.js
 *	jquery.ui.widget.js
 */
(function(a){var g,i=function(b){a(":ui-button",b.target.form).each(function(){var c=a(this).data("button");setTimeout(function(){c.refresh()},1)})},h=function(b){var c=b.name,d=b.form,e=a([]);if(c)e=d?a(d).find("[name='"+c+"']"):a("[name='"+c+"']",b.ownerDocument).filter(function(){return!this.form});return e};a.widget("ui.button",{options:{disabled:null,text:true,label:null,icons:{primary:null,secondary:null}},_create:function(){this.element.closest("form").unbind("reset.button").bind("reset.button",
i);if(typeof this.options.disabled!=="boolean")this.options.disabled=this.element.attr("disabled");this._determineButtonType();this.hasTitle=!!this.buttonElement.attr("title");var b=this,c=this.options,d=this.type==="checkbox"||this.type==="radio",e="ui-state-hover"+(!d?" ui-state-active":"");if(c.label===null)c.label=this.buttonElement.html();if(this.element.is(":disabled"))c.disabled=true;this.buttonElement.addClass("ui-button ui-widget ui-state-default ui-corner-all").attr("role","button").bind("mouseenter.button",
function(){if(!c.disabled){a(this).addClass("ui-state-hover");this===g&&a(this).addClass("ui-state-active")}}).bind("mouseleave.button",function(){c.disabled||a(this).removeClass(e)}).bind("focus.button",function(){a(this).addClass("ui-state-focus")}).bind("blur.button",function(){a(this).removeClass("ui-state-focus")});d&&this.element.bind("change.button",function(){b.refresh()});if(this.type==="checkbox")this.buttonElement.bind("click.button",function(){if(c.disabled)return false;a(this).toggleClass("ui-state-active");
b.buttonElement.attr("aria-pressed",b.element[0].checked)});else if(this.type==="radio")this.buttonElement.bind("click.button",function(){if(c.disabled)return false;a(this).addClass("ui-state-active");b.buttonElement.attr("aria-pressed",true);var f=b.element[0];h(f).not(f).map(function(){return a(this).button("widget")[0]}).removeClass("ui-state-active").attr("aria-pressed",false)});else{this.buttonElement.bind("mousedown.button",function(){if(c.disabled)return false;a(this).addClass("ui-state-active");
g=this;a(document).one("mouseup",function(){g=null})}).bind("mouseup.button",function(){if(c.disabled)return false;a(this).removeClass("ui-state-active")}).bind("keydown.button",function(f){if(c.disabled)return false;if(f.keyCode==a.ui.keyCode.SPACE||f.keyCode==a.ui.keyCode.ENTER)a(this).addClass("ui-state-active")}).bind("keyup.button",function(){a(this).removeClass("ui-state-active")});this.buttonElement.is("a")&&this.buttonElement.keyup(function(f){f.keyCode===a.ui.keyCode.SPACE&&a(this).click()})}this._setOption("disabled",
c.disabled)},_determineButtonType:function(){this.type=this.element.is(":checkbox")?"checkbox":this.element.is(":radio")?"radio":this.element.is("input")?"input":"button";if(this.type==="checkbox"||this.type==="radio"){this.buttonElement=this.element.parents().last().find("label[for="+this.element.attr("id")+"]");this.element.addClass("ui-helper-hidden-accessible");var b=this.element.is(":checked");b&&this.buttonElement.addClass("ui-state-active");this.buttonElement.attr("aria-pressed",b)}else this.buttonElement=
this.element},widget:function(){return this.buttonElement},destroy:function(){this.element.removeClass("ui-helper-hidden-accessible");this.buttonElement.removeClass("ui-button ui-widget ui-state-default ui-corner-all ui-state-hover ui-state-active  ui-button-icons-only ui-button-icon-only ui-button-text-icons ui-button-text-icon-primary ui-button-text-icon-secondary ui-button-text-only").removeAttr("role").removeAttr("aria-pressed").html(this.buttonElement.find(".ui-button-text").html());this.hasTitle||
this.buttonElement.removeAttr("title");a.Widget.prototype.destroy.call(this)},_setOption:function(b,c){a.Widget.prototype._setOption.apply(this,arguments);if(b==="disabled")c?this.element.attr("disabled",true):this.element.removeAttr("disabled");this._resetButton()},refresh:function(){var b=this.element.is(":disabled");b!==this.options.disabled&&this._setOption("disabled",b);if(this.type==="radio")h(this.element[0]).each(function(){a(this).is(":checked")?a(this).button("widget").addClass("ui-state-active").attr("aria-pressed",
true):a(this).button("widget").removeClass("ui-state-active").attr("aria-pressed",false)});else if(this.type==="checkbox")this.element.is(":checked")?this.buttonElement.addClass("ui-state-active").attr("aria-pressed",true):this.buttonElement.removeClass("ui-state-active").attr("aria-pressed",false)},_resetButton:function(){if(this.type==="input")this.options.label&&this.element.val(this.options.label);else{var b=this.buttonElement.removeClass("ui-button-icons-only ui-button-icon-only ui-button-text-icons ui-button-text-icon-primary ui-button-text-icon-secondary ui-button-text-only"),
c=a("<span></span>").addClass("ui-button-text").html(this.options.label).appendTo(b.empty()).text(),d=this.options.icons,e=d.primary&&d.secondary;if(d.primary||d.secondary){b.addClass("ui-button-text-icon"+(e?"s":d.primary?"-primary":"-secondary"));d.primary&&b.prepend("<span class='ui-button-icon-primary ui-icon "+d.primary+"'></span>");d.secondary&&b.append("<span class='ui-button-icon-secondary ui-icon "+d.secondary+"'></span>");if(!this.options.text){b.addClass(e?"ui-button-icons-only":"ui-button-icon-only").removeClass("ui-button-text-icons ui-button-text-icon-primary ui-button-text-icon-secondary");
this.hasTitle||b.attr("title",c)}}else b.addClass("ui-button-text-only")}}});a.widget("ui.buttonset",{options:{items:":button, :submit, :reset, :checkbox, :radio, a, :data(button)"},_create:function(){this.element.addClass("ui-buttonset")},_init:function(){this.refresh()},_setOption:function(b,c){b==="disabled"&&this.buttons.button("option",b,c);a.Widget.prototype._setOption.apply(this,arguments)},refresh:function(){this.buttons=this.element.find(this.options.items).filter(":ui-button").button("refresh").end().not(":ui-button").button().end().map(function(){return a(this).button("widget")[0]}).removeClass("ui-corner-all ui-corner-left ui-corner-right").filter(":first").addClass("ui-corner-left").end().filter(":last").addClass("ui-corner-right").end().end()},
destroy:function(){this.element.removeClass("ui-buttonset");this.buttons.map(function(){return a(this).button("widget")[0]}).removeClass("ui-corner-left ui-corner-right").end().button("destroy");a.Widget.prototype.destroy.call(this)}})})(jQuery);
;

/*!
 * jQuery UI Mouse 1.8.7
 *
 * Copyright 2010, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Mouse
 *
 * Depends:
 *	jquery.ui.widget.js
 */
(function(c){c.widget("ui.mouse",{options:{cancel:":input,option",distance:1,delay:0},_mouseInit:function(){var a=this;this.element.bind("mousedown."+this.widgetName,function(b){return a._mouseDown(b)}).bind("click."+this.widgetName,function(b){if(true===c.data(b.target,a.widgetName+".preventClickEvent")){c.removeData(b.target,a.widgetName+".preventClickEvent");b.stopImmediatePropagation();return false}});this.started=false},_mouseDestroy:function(){this.element.unbind("."+this.widgetName)},_mouseDown:function(a){a.originalEvent=
a.originalEvent||{};if(!a.originalEvent.mouseHandled){this._mouseStarted&&this._mouseUp(a);this._mouseDownEvent=a;var b=this,e=a.which==1,f=typeof this.options.cancel=="string"?c(a.target).parents().add(a.target).filter(this.options.cancel).length:false;if(!e||f||!this._mouseCapture(a))return true;this.mouseDelayMet=!this.options.delay;if(!this.mouseDelayMet)this._mouseDelayTimer=setTimeout(function(){b.mouseDelayMet=true},this.options.delay);if(this._mouseDistanceMet(a)&&this._mouseDelayMet(a)){this._mouseStarted=
this._mouseStart(a)!==false;if(!this._mouseStarted){a.preventDefault();return true}}this._mouseMoveDelegate=function(d){return b._mouseMove(d)};this._mouseUpDelegate=function(d){return b._mouseUp(d)};c(document).bind("mousemove."+this.widgetName,this._mouseMoveDelegate).bind("mouseup."+this.widgetName,this._mouseUpDelegate);a.preventDefault();return a.originalEvent.mouseHandled=true}},_mouseMove:function(a){if(c.browser.msie&&!(document.documentMode>=9)&&!a.button)return this._mouseUp(a);if(this._mouseStarted){this._mouseDrag(a);
return a.preventDefault()}if(this._mouseDistanceMet(a)&&this._mouseDelayMet(a))(this._mouseStarted=this._mouseStart(this._mouseDownEvent,a)!==false)?this._mouseDrag(a):this._mouseUp(a);return!this._mouseStarted},_mouseUp:function(a){c(document).unbind("mousemove."+this.widgetName,this._mouseMoveDelegate).unbind("mouseup."+this.widgetName,this._mouseUpDelegate);if(this._mouseStarted){this._mouseStarted=false;a.target==this._mouseDownEvent.target&&c.data(a.target,this.widgetName+".preventClickEvent",
true);this._mouseStop(a)}return false},_mouseDistanceMet:function(a){return Math.max(Math.abs(this._mouseDownEvent.pageX-a.pageX),Math.abs(this._mouseDownEvent.pageY-a.pageY))>=this.options.distance},_mouseDelayMet:function(){return this.mouseDelayMet},_mouseStart:function(){},_mouseDrag:function(){},_mouseStop:function(){},_mouseCapture:function(){return true}})})(jQuery);
;

/*
 * jQuery UI Draggable 1.8.7
 *
 * Copyright 2010, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Draggables
 *
 * Depends:
 *	jquery.ui.core.js
 *	jquery.ui.mouse.js
 *	jquery.ui.widget.js
 */
(function(d){d.widget("ui.draggable",d.ui.mouse,{widgetEventPrefix:"drag",options:{addClasses:true,appendTo:"parent",axis:false,connectToSortable:false,containment:false,cursor:"auto",cursorAt:false,grid:false,handle:false,helper:"original",iframeFix:false,opacity:false,refreshPositions:false,revert:false,revertDuration:500,scope:"default",scroll:true,scrollSensitivity:20,scrollSpeed:20,snap:false,snapMode:"both",snapTolerance:20,stack:false,zIndex:false},_create:function(){if(this.options.helper==
"original"&&!/^(?:r|a|f)/.test(this.element.css("position")))this.element[0].style.position="relative";this.options.addClasses&&this.element.addClass("ui-draggable");this.options.disabled&&this.element.addClass("ui-draggable-disabled");this._mouseInit()},destroy:function(){if(this.element.data("draggable")){this.element.removeData("draggable").unbind(".draggable").removeClass("ui-draggable ui-draggable-dragging ui-draggable-disabled");this._mouseDestroy();return this}},_mouseCapture:function(a){var b=
this.options;if(this.helper||b.disabled||d(a.target).is(".ui-resizable-handle"))return false;this.handle=this._getHandle(a);if(!this.handle)return false;return true},_mouseStart:function(a){var b=this.options;this.helper=this._createHelper(a);this._cacheHelperProportions();if(d.ui.ddmanager)d.ui.ddmanager.current=this;this._cacheMargins();this.cssPosition=this.helper.css("position");this.scrollParent=this.helper.scrollParent();this.offset=this.positionAbs=this.element.offset();this.offset={top:this.offset.top-
this.margins.top,left:this.offset.left-this.margins.left};d.extend(this.offset,{click:{left:a.pageX-this.offset.left,top:a.pageY-this.offset.top},parent:this._getParentOffset(),relative:this._getRelativeOffset()});this.originalPosition=this.position=this._generatePosition(a);this.originalPageX=a.pageX;this.originalPageY=a.pageY;b.cursorAt&&this._adjustOffsetFromHelper(b.cursorAt);b.containment&&this._setContainment();if(this._trigger("start",a)===false){this._clear();return false}this._cacheHelperProportions();
d.ui.ddmanager&&!b.dropBehaviour&&d.ui.ddmanager.prepareOffsets(this,a);this.helper.addClass("ui-draggable-dragging");this._mouseDrag(a,true);return true},_mouseDrag:function(a,b){this.position=this._generatePosition(a);this.positionAbs=this._convertPositionTo("absolute");if(!b){b=this._uiHash();if(this._trigger("drag",a,b)===false){this._mouseUp({});return false}this.position=b.position}if(!this.options.axis||this.options.axis!="y")this.helper[0].style.left=this.position.left+"px";if(!this.options.axis||
this.options.axis!="x")this.helper[0].style.top=this.position.top+"px";d.ui.ddmanager&&d.ui.ddmanager.drag(this,a);return false},_mouseStop:function(a){var b=false;if(d.ui.ddmanager&&!this.options.dropBehaviour)b=d.ui.ddmanager.drop(this,a);if(this.dropped){b=this.dropped;this.dropped=false}if(!this.element[0]||!this.element[0].parentNode)return false;if(this.options.revert=="invalid"&&!b||this.options.revert=="valid"&&b||this.options.revert===true||d.isFunction(this.options.revert)&&this.options.revert.call(this.element,
b)){var c=this;d(this.helper).animate(this.originalPosition,parseInt(this.options.revertDuration,10),function(){c._trigger("stop",a)!==false&&c._clear()})}else this._trigger("stop",a)!==false&&this._clear();return false},cancel:function(){this.helper.is(".ui-draggable-dragging")?this._mouseUp({}):this._clear();return this},_getHandle:function(a){var b=!this.options.handle||!d(this.options.handle,this.element).length?true:false;d(this.options.handle,this.element).find("*").andSelf().each(function(){if(this==
a.target)b=true});return b},_createHelper:function(a){var b=this.options;a=d.isFunction(b.helper)?d(b.helper.apply(this.element[0],[a])):b.helper=="clone"?this.element.clone():this.element;a.parents("body").length||a.appendTo(b.appendTo=="parent"?this.element[0].parentNode:b.appendTo);a[0]!=this.element[0]&&!/(fixed|absolute)/.test(a.css("position"))&&a.css("position","absolute");return a},_adjustOffsetFromHelper:function(a){if(typeof a=="string")a=a.split(" ");if(d.isArray(a))a={left:+a[0],top:+a[1]||
0};if("left"in a)this.offset.click.left=a.left+this.margins.left;if("right"in a)this.offset.click.left=this.helperProportions.width-a.right+this.margins.left;if("top"in a)this.offset.click.top=a.top+this.margins.top;if("bottom"in a)this.offset.click.top=this.helperProportions.height-a.bottom+this.margins.top},_getParentOffset:function(){this.offsetParent=this.helper.offsetParent();var a=this.offsetParent.offset();if(this.cssPosition=="absolute"&&this.scrollParent[0]!=document&&d.ui.contains(this.scrollParent[0],
this.offsetParent[0])){a.left+=this.scrollParent.scrollLeft();a.top+=this.scrollParent.scrollTop()}if(this.offsetParent[0]==document.body||this.offsetParent[0].tagName&&this.offsetParent[0].tagName.toLowerCase()=="html"&&d.browser.msie)a={top:0,left:0};return{top:a.top+(parseInt(this.offsetParent.css("borderTopWidth"),10)||0),left:a.left+(parseInt(this.offsetParent.css("borderLeftWidth"),10)||0)}},_getRelativeOffset:function(){if(this.cssPosition=="relative"){var a=this.element.position();return{top:a.top-
(parseInt(this.helper.css("top"),10)||0)+this.scrollParent.scrollTop(),left:a.left-(parseInt(this.helper.css("left"),10)||0)+this.scrollParent.scrollLeft()}}else return{top:0,left:0}},_cacheMargins:function(){this.margins={left:parseInt(this.element.css("marginLeft"),10)||0,top:parseInt(this.element.css("marginTop"),10)||0}},_cacheHelperProportions:function(){this.helperProportions={width:this.helper.outerWidth(),height:this.helper.outerHeight()}},_setContainment:function(){var a=this.options;if(a.containment==
"parent")a.containment=this.helper[0].parentNode;if(a.containment=="document"||a.containment=="window")this.containment=[(a.containment=="document"?0:d(window).scrollLeft())-this.offset.relative.left-this.offset.parent.left,(a.containment=="document"?0:d(window).scrollTop())-this.offset.relative.top-this.offset.parent.top,(a.containment=="document"?0:d(window).scrollLeft())+d(a.containment=="document"?document:window).width()-this.helperProportions.width-this.margins.left,(a.containment=="document"?
0:d(window).scrollTop())+(d(a.containment=="document"?document:window).height()||document.body.parentNode.scrollHeight)-this.helperProportions.height-this.margins.top];if(!/^(document|window|parent)$/.test(a.containment)&&a.containment.constructor!=Array){var b=d(a.containment)[0];if(b){a=d(a.containment).offset();var c=d(b).css("overflow")!="hidden";this.containment=[a.left+(parseInt(d(b).css("borderLeftWidth"),10)||0)+(parseInt(d(b).css("paddingLeft"),10)||0)-this.margins.left,a.top+(parseInt(d(b).css("borderTopWidth"),
10)||0)+(parseInt(d(b).css("paddingTop"),10)||0)-this.margins.top,a.left+(c?Math.max(b.scrollWidth,b.offsetWidth):b.offsetWidth)-(parseInt(d(b).css("borderLeftWidth"),10)||0)-(parseInt(d(b).css("paddingRight"),10)||0)-this.helperProportions.width-this.margins.left,a.top+(c?Math.max(b.scrollHeight,b.offsetHeight):b.offsetHeight)-(parseInt(d(b).css("borderTopWidth"),10)||0)-(parseInt(d(b).css("paddingBottom"),10)||0)-this.helperProportions.height-this.margins.top]}}else if(a.containment.constructor==
Array)this.containment=a.containment},_convertPositionTo:function(a,b){if(!b)b=this.position;a=a=="absolute"?1:-1;var c=this.cssPosition=="absolute"&&!(this.scrollParent[0]!=document&&d.ui.contains(this.scrollParent[0],this.offsetParent[0]))?this.offsetParent:this.scrollParent,f=/(html|body)/i.test(c[0].tagName);return{top:b.top+this.offset.relative.top*a+this.offset.parent.top*a-(d.browser.safari&&d.browser.version<526&&this.cssPosition=="fixed"?0:(this.cssPosition=="fixed"?-this.scrollParent.scrollTop():
f?0:c.scrollTop())*a),left:b.left+this.offset.relative.left*a+this.offset.parent.left*a-(d.browser.safari&&d.browser.version<526&&this.cssPosition=="fixed"?0:(this.cssPosition=="fixed"?-this.scrollParent.scrollLeft():f?0:c.scrollLeft())*a)}},_generatePosition:function(a){var b=this.options,c=this.cssPosition=="absolute"&&!(this.scrollParent[0]!=document&&d.ui.contains(this.scrollParent[0],this.offsetParent[0]))?this.offsetParent:this.scrollParent,f=/(html|body)/i.test(c[0].tagName),e=a.pageX,g=a.pageY;
if(this.originalPosition){if(this.containment){if(a.pageX-this.offset.click.left<this.containment[0])e=this.containment[0]+this.offset.click.left;if(a.pageY-this.offset.click.top<this.containment[1])g=this.containment[1]+this.offset.click.top;if(a.pageX-this.offset.click.left>this.containment[2])e=this.containment[2]+this.offset.click.left;if(a.pageY-this.offset.click.top>this.containment[3])g=this.containment[3]+this.offset.click.top}if(b.grid){g=this.originalPageY+Math.round((g-this.originalPageY)/
b.grid[1])*b.grid[1];g=this.containment?!(g-this.offset.click.top<this.containment[1]||g-this.offset.click.top>this.containment[3])?g:!(g-this.offset.click.top<this.containment[1])?g-b.grid[1]:g+b.grid[1]:g;e=this.originalPageX+Math.round((e-this.originalPageX)/b.grid[0])*b.grid[0];e=this.containment?!(e-this.offset.click.left<this.containment[0]||e-this.offset.click.left>this.containment[2])?e:!(e-this.offset.click.left<this.containment[0])?e-b.grid[0]:e+b.grid[0]:e}}return{top:g-this.offset.click.top-
this.offset.relative.top-this.offset.parent.top+(d.browser.safari&&d.browser.version<526&&this.cssPosition=="fixed"?0:this.cssPosition=="fixed"?-this.scrollParent.scrollTop():f?0:c.scrollTop()),left:e-this.offset.click.left-this.offset.relative.left-this.offset.parent.left+(d.browser.safari&&d.browser.version<526&&this.cssPosition=="fixed"?0:this.cssPosition=="fixed"?-this.scrollParent.scrollLeft():f?0:c.scrollLeft())}},_clear:function(){this.helper.removeClass("ui-draggable-dragging");this.helper[0]!=
this.element[0]&&!this.cancelHelperRemoval&&this.helper.remove();this.helper=null;this.cancelHelperRemoval=false},_trigger:function(a,b,c){c=c||this._uiHash();d.ui.plugin.call(this,a,[b,c]);if(a=="drag")this.positionAbs=this._convertPositionTo("absolute");return d.Widget.prototype._trigger.call(this,a,b,c)},plugins:{},_uiHash:function(){return{helper:this.helper,position:this.position,originalPosition:this.originalPosition,offset:this.positionAbs}}});d.extend(d.ui.draggable,{version:"1.8.7"});
d.ui.plugin.add("draggable","connectToSortable",{start:function(a,b){var c=d(this).data("draggable"),f=c.options,e=d.extend({},b,{item:c.element});c.sortables=[];d(f.connectToSortable).each(function(){var g=d.data(this,"sortable");if(g&&!g.options.disabled){c.sortables.push({instance:g,shouldRevert:g.options.revert});g._refreshItems();g._trigger("activate",a,e)}})},stop:function(a,b){var c=d(this).data("draggable"),f=d.extend({},b,{item:c.element});d.each(c.sortables,function(){if(this.instance.isOver){this.instance.isOver=
0;c.cancelHelperRemoval=true;this.instance.cancelHelperRemoval=false;if(this.shouldRevert)this.instance.options.revert=true;this.instance._mouseStop(a);this.instance.options.helper=this.instance.options._helper;c.options.helper=="original"&&this.instance.currentItem.css({top:"auto",left:"auto"})}else{this.instance.cancelHelperRemoval=false;this.instance._trigger("deactivate",a,f)}})},drag:function(a,b){var c=d(this).data("draggable"),f=this;d.each(c.sortables,function(){this.instance.positionAbs=
c.positionAbs;this.instance.helperProportions=c.helperProportions;this.instance.offset.click=c.offset.click;if(this.instance._intersectsWith(this.instance.containerCache)){if(!this.instance.isOver){this.instance.isOver=1;this.instance.currentItem=d(f).clone().appendTo(this.instance.element).data("sortable-item",true);this.instance.options._helper=this.instance.options.helper;this.instance.options.helper=function(){return b.helper[0]};a.target=this.instance.currentItem[0];this.instance._mouseCapture(a,
true);this.instance._mouseStart(a,true,true);this.instance.offset.click.top=c.offset.click.top;this.instance.offset.click.left=c.offset.click.left;this.instance.offset.parent.left-=c.offset.parent.left-this.instance.offset.parent.left;this.instance.offset.parent.top-=c.offset.parent.top-this.instance.offset.parent.top;c._trigger("toSortable",a);c.dropped=this.instance.element;c.currentItem=c.element;this.instance.fromOutside=c}this.instance.currentItem&&this.instance._mouseDrag(a)}else if(this.instance.isOver){this.instance.isOver=
0;this.instance.cancelHelperRemoval=true;this.instance.options.revert=false;this.instance._trigger("out",a,this.instance._uiHash(this.instance));this.instance._mouseStop(a,true);this.instance.options.helper=this.instance.options._helper;this.instance.currentItem.remove();this.instance.placeholder&&this.instance.placeholder.remove();c._trigger("fromSortable",a);c.dropped=false}})}});d.ui.plugin.add("draggable","cursor",{start:function(){var a=d("body"),b=d(this).data("draggable").options;if(a.css("cursor"))b._cursor=
a.css("cursor");a.css("cursor",b.cursor)},stop:function(){var a=d(this).data("draggable").options;a._cursor&&d("body").css("cursor",a._cursor)}});d.ui.plugin.add("draggable","iframeFix",{start:function(){var a=d(this).data("draggable").options;d(a.iframeFix===true?"iframe":a.iframeFix).each(function(){d('<div class="ui-draggable-iframeFix" style="background: #fff;"></div>').css({width:this.offsetWidth+"px",height:this.offsetHeight+"px",position:"absolute",opacity:"0.001",zIndex:1E3}).css(d(this).offset()).appendTo("body")})},
stop:function(){d("div.ui-draggable-iframeFix").each(function(){this.parentNode.removeChild(this)})}});d.ui.plugin.add("draggable","opacity",{start:function(a,b){a=d(b.helper);b=d(this).data("draggable").options;if(a.css("opacity"))b._opacity=a.css("opacity");a.css("opacity",b.opacity)},stop:function(a,b){a=d(this).data("draggable").options;a._opacity&&d(b.helper).css("opacity",a._opacity)}});d.ui.plugin.add("draggable","scroll",{start:function(){var a=d(this).data("draggable");if(a.scrollParent[0]!=
document&&a.scrollParent[0].tagName!="HTML")a.overflowOffset=a.scrollParent.offset()},drag:function(a){var b=d(this).data("draggable"),c=b.options,f=false;if(b.scrollParent[0]!=document&&b.scrollParent[0].tagName!="HTML"){if(!c.axis||c.axis!="x")if(b.overflowOffset.top+b.scrollParent[0].offsetHeight-a.pageY<c.scrollSensitivity)b.scrollParent[0].scrollTop=f=b.scrollParent[0].scrollTop+c.scrollSpeed;else if(a.pageY-b.overflowOffset.top<c.scrollSensitivity)b.scrollParent[0].scrollTop=f=b.scrollParent[0].scrollTop-
c.scrollSpeed;if(!c.axis||c.axis!="y")if(b.overflowOffset.left+b.scrollParent[0].offsetWidth-a.pageX<c.scrollSensitivity)b.scrollParent[0].scrollLeft=f=b.scrollParent[0].scrollLeft+c.scrollSpeed;else if(a.pageX-b.overflowOffset.left<c.scrollSensitivity)b.scrollParent[0].scrollLeft=f=b.scrollParent[0].scrollLeft-c.scrollSpeed}else{if(!c.axis||c.axis!="x")if(a.pageY-d(document).scrollTop()<c.scrollSensitivity)f=d(document).scrollTop(d(document).scrollTop()-c.scrollSpeed);else if(d(window).height()-
(a.pageY-d(document).scrollTop())<c.scrollSensitivity)f=d(document).scrollTop(d(document).scrollTop()+c.scrollSpeed);if(!c.axis||c.axis!="y")if(a.pageX-d(document).scrollLeft()<c.scrollSensitivity)f=d(document).scrollLeft(d(document).scrollLeft()-c.scrollSpeed);else if(d(window).width()-(a.pageX-d(document).scrollLeft())<c.scrollSensitivity)f=d(document).scrollLeft(d(document).scrollLeft()+c.scrollSpeed)}f!==false&&d.ui.ddmanager&&!c.dropBehaviour&&d.ui.ddmanager.prepareOffsets(b,a)}});d.ui.plugin.add("draggable",
"snap",{start:function(){var a=d(this).data("draggable"),b=a.options;a.snapElements=[];d(b.snap.constructor!=String?b.snap.items||":data(draggable)":b.snap).each(function(){var c=d(this),f=c.offset();this!=a.element[0]&&a.snapElements.push({item:this,width:c.outerWidth(),height:c.outerHeight(),top:f.top,left:f.left})})},drag:function(a,b){for(var c=d(this).data("draggable"),f=c.options,e=f.snapTolerance,g=b.offset.left,n=g+c.helperProportions.width,m=b.offset.top,o=m+c.helperProportions.height,h=
c.snapElements.length-1;h>=0;h--){var i=c.snapElements[h].left,k=i+c.snapElements[h].width,j=c.snapElements[h].top,l=j+c.snapElements[h].height;if(i-e<g&&g<k+e&&j-e<m&&m<l+e||i-e<g&&g<k+e&&j-e<o&&o<l+e||i-e<n&&n<k+e&&j-e<m&&m<l+e||i-e<n&&n<k+e&&j-e<o&&o<l+e){if(f.snapMode!="inner"){var p=Math.abs(j-o)<=e,q=Math.abs(l-m)<=e,r=Math.abs(i-n)<=e,s=Math.abs(k-g)<=e;if(p)b.position.top=c._convertPositionTo("relative",{top:j-c.helperProportions.height,left:0}).top-c.margins.top;if(q)b.position.top=c._convertPositionTo("relative",
{top:l,left:0}).top-c.margins.top;if(r)b.position.left=c._convertPositionTo("relative",{top:0,left:i-c.helperProportions.width}).left-c.margins.left;if(s)b.position.left=c._convertPositionTo("relative",{top:0,left:k}).left-c.margins.left}var t=p||q||r||s;if(f.snapMode!="outer"){p=Math.abs(j-m)<=e;q=Math.abs(l-o)<=e;r=Math.abs(i-g)<=e;s=Math.abs(k-n)<=e;if(p)b.position.top=c._convertPositionTo("relative",{top:j,left:0}).top-c.margins.top;if(q)b.position.top=c._convertPositionTo("relative",{top:l-c.helperProportions.height,
left:0}).top-c.margins.top;if(r)b.position.left=c._convertPositionTo("relative",{top:0,left:i}).left-c.margins.left;if(s)b.position.left=c._convertPositionTo("relative",{top:0,left:k-c.helperProportions.width}).left-c.margins.left}if(!c.snapElements[h].snapping&&(p||q||r||s||t))c.options.snap.snap&&c.options.snap.snap.call(c.element,a,d.extend(c._uiHash(),{snapItem:c.snapElements[h].item}));c.snapElements[h].snapping=p||q||r||s||t}else{c.snapElements[h].snapping&&c.options.snap.release&&c.options.snap.release.call(c.element,
a,d.extend(c._uiHash(),{snapItem:c.snapElements[h].item}));c.snapElements[h].snapping=false}}}});d.ui.plugin.add("draggable","stack",{start:function(){var a=d(this).data("draggable").options;a=d.makeArray(d(a.stack)).sort(function(c,f){return(parseInt(d(c).css("zIndex"),10)||0)-(parseInt(d(f).css("zIndex"),10)||0)});if(a.length){var b=parseInt(a[0].style.zIndex)||0;d(a).each(function(c){this.style.zIndex=b+c});this[0].style.zIndex=b+a.length}}});d.ui.plugin.add("draggable","zIndex",{start:function(a,
b){a=d(b.helper);b=d(this).data("draggable").options;if(a.css("zIndex"))b._zIndex=a.css("zIndex");a.css("zIndex",b.zIndex)},stop:function(a,b){a=d(this).data("draggable").options;a._zIndex&&d(b.helper).css("zIndex",a._zIndex)}})})(jQuery);
;

/*
 * jQuery UI Position 1.8.7
 *
 * Copyright 2010, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Position
 */
(function(c){c.ui=c.ui||{};var n=/left|center|right/,o=/top|center|bottom/,t=c.fn.position,u=c.fn.offset;c.fn.position=function(b){if(!b||!b.of)return t.apply(this,arguments);b=c.extend({},b);var a=c(b.of),d=a[0],g=(b.collision||"flip").split(" "),e=b.offset?b.offset.split(" "):[0,0],h,k,j;if(d.nodeType===9){h=a.width();k=a.height();j={top:0,left:0}}else if(d.setTimeout){h=a.width();k=a.height();j={top:a.scrollTop(),left:a.scrollLeft()}}else if(d.preventDefault){b.at="left top";h=k=0;j={top:b.of.pageY,
left:b.of.pageX}}else{h=a.outerWidth();k=a.outerHeight();j=a.offset()}c.each(["my","at"],function(){var f=(b[this]||"").split(" ");if(f.length===1)f=n.test(f[0])?f.concat(["center"]):o.test(f[0])?["center"].concat(f):["center","center"];f[0]=n.test(f[0])?f[0]:"center";f[1]=o.test(f[1])?f[1]:"center";b[this]=f});if(g.length===1)g[1]=g[0];e[0]=parseInt(e[0],10)||0;if(e.length===1)e[1]=e[0];e[1]=parseInt(e[1],10)||0;if(b.at[0]==="right")j.left+=h;else if(b.at[0]==="center")j.left+=h/2;if(b.at[1]==="bottom")j.top+=
k;else if(b.at[1]==="center")j.top+=k/2;j.left+=e[0];j.top+=e[1];return this.each(function(){var f=c(this),l=f.outerWidth(),m=f.outerHeight(),p=parseInt(c.curCSS(this,"marginLeft",true))||0,q=parseInt(c.curCSS(this,"marginTop",true))||0,v=l+p+parseInt(c.curCSS(this,"marginRight",true))||0,w=m+q+parseInt(c.curCSS(this,"marginBottom",true))||0,i=c.extend({},j),r;if(b.my[0]==="right")i.left-=l;else if(b.my[0]==="center")i.left-=l/2;if(b.my[1]==="bottom")i.top-=m;else if(b.my[1]==="center")i.top-=m/2;
i.left=Math.round(i.left);i.top=Math.round(i.top);r={left:i.left-p,top:i.top-q};c.each(["left","top"],function(s,x){c.ui.position[g[s]]&&c.ui.position[g[s]][x](i,{targetWidth:h,targetHeight:k,elemWidth:l,elemHeight:m,collisionPosition:r,collisionWidth:v,collisionHeight:w,offset:e,my:b.my,at:b.at})});c.fn.bgiframe&&f.bgiframe();f.offset(c.extend(i,{using:b.using}))})};c.ui.position={fit:{left:function(b,a){var d=c(window);d=a.collisionPosition.left+a.collisionWidth-d.width()-d.scrollLeft();b.left=
d>0?b.left-d:Math.max(b.left-a.collisionPosition.left,b.left)},top:function(b,a){var d=c(window);d=a.collisionPosition.top+a.collisionHeight-d.height()-d.scrollTop();b.top=d>0?b.top-d:Math.max(b.top-a.collisionPosition.top,b.top)}},flip:{left:function(b,a){if(a.at[0]!=="center"){var d=c(window);d=a.collisionPosition.left+a.collisionWidth-d.width()-d.scrollLeft();var g=a.my[0]==="left"?-a.elemWidth:a.my[0]==="right"?a.elemWidth:0,e=a.at[0]==="left"?a.targetWidth:-a.targetWidth,h=-2*a.offset[0];b.left+=
a.collisionPosition.left<0?g+e+h:d>0?g+e+h:0}},top:function(b,a){if(a.at[1]!=="center"){var d=c(window);d=a.collisionPosition.top+a.collisionHeight-d.height()-d.scrollTop();var g=a.my[1]==="top"?-a.elemHeight:a.my[1]==="bottom"?a.elemHeight:0,e=a.at[1]==="top"?a.targetHeight:-a.targetHeight,h=-2*a.offset[1];b.top+=a.collisionPosition.top<0?g+e+h:d>0?g+e+h:0}}}};if(!c.offset.setOffset){c.offset.setOffset=function(b,a){if(/static/.test(c.curCSS(b,"position")))b.style.position="relative";var d=c(b),
g=d.offset(),e=parseInt(c.curCSS(b,"top",true),10)||0,h=parseInt(c.curCSS(b,"left",true),10)||0;g={top:a.top-g.top+e,left:a.left-g.left+h};"using"in a?a.using.call(b,g):d.css(g)};c.fn.offset=function(b){var a=this[0];if(!a||!a.ownerDocument)return null;if(b)return this.each(function(){c.offset.setOffset(this,b)});return u.call(this)}}})(jQuery);
;

/*
 * jQuery UI Resizable 1.8.7
 *
 * Copyright 2010, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Resizables
 *
 * Depends:
 *	jquery.ui.core.js
 *	jquery.ui.mouse.js
 *	jquery.ui.widget.js
 */
(function(e){e.widget("ui.resizable",e.ui.mouse,{widgetEventPrefix:"resize",options:{alsoResize:false,animate:false,animateDuration:"slow",animateEasing:"swing",aspectRatio:false,autoHide:false,containment:false,ghost:false,grid:false,handles:"e,s,se",helper:false,maxHeight:null,maxWidth:null,minHeight:10,minWidth:10,zIndex:1E3},_create:function(){var b=this,a=this.options;this.element.addClass("ui-resizable");e.extend(this,{_aspectRatio:!!a.aspectRatio,aspectRatio:a.aspectRatio,originalElement:this.element,
_proportionallyResizeElements:[],_helper:a.helper||a.ghost||a.animate?a.helper||"ui-resizable-helper":null});if(this.element[0].nodeName.match(/canvas|textarea|input|select|button|img/i)){/relative/.test(this.element.css("position"))&&e.browser.opera&&this.element.css({position:"relative",top:"auto",left:"auto"});this.element.wrap(e('<div class="ui-wrapper" style="overflow: hidden;"></div>').css({position:this.element.css("position"),width:this.element.outerWidth(),height:this.element.outerHeight(),
top:this.element.css("top"),left:this.element.css("left")}));this.element=this.element.parent().data("resizable",this.element.data("resizable"));this.elementIsWrapper=true;this.element.css({marginLeft:this.originalElement.css("marginLeft"),marginTop:this.originalElement.css("marginTop"),marginRight:this.originalElement.css("marginRight"),marginBottom:this.originalElement.css("marginBottom")});this.originalElement.css({marginLeft:0,marginTop:0,marginRight:0,marginBottom:0});this.originalResizeStyle=
this.originalElement.css("resize");this.originalElement.css("resize","none");this._proportionallyResizeElements.push(this.originalElement.css({position:"static",zoom:1,display:"block"}));this.originalElement.css({margin:this.originalElement.css("margin")});this._proportionallyResize()}this.handles=a.handles||(!e(".ui-resizable-handle",this.element).length?"e,s,se":{n:".ui-resizable-n",e:".ui-resizable-e",s:".ui-resizable-s",w:".ui-resizable-w",se:".ui-resizable-se",sw:".ui-resizable-sw",ne:".ui-resizable-ne",
nw:".ui-resizable-nw"});if(this.handles.constructor==String){if(this.handles=="all")this.handles="n,e,s,w,se,sw,ne,nw";var c=this.handles.split(",");this.handles={};for(var d=0;d<c.length;d++){var f=e.trim(c[d]),g=e('<div class="ui-resizable-handle '+("ui-resizable-"+f)+'"></div>');/sw|se|ne|nw/.test(f)&&g.css({zIndex:++a.zIndex});"se"==f&&g.addClass("ui-icon ui-icon-gripsmall-diagonal-se");this.handles[f]=".ui-resizable-"+f;this.element.append(g)}}this._renderAxis=function(h){h=h||this.element;for(var i in this.handles){if(this.handles[i].constructor==
String)this.handles[i]=e(this.handles[i],this.element).show();if(this.elementIsWrapper&&this.originalElement[0].nodeName.match(/textarea|input|select|button/i)){var j=e(this.handles[i],this.element),k=0;k=/sw|ne|nw|se|n|s/.test(i)?j.outerHeight():j.outerWidth();j=["padding",/ne|nw|n/.test(i)?"Top":/se|sw|s/.test(i)?"Bottom":/^e$/.test(i)?"Right":"Left"].join("");h.css(j,k);this._proportionallyResize()}e(this.handles[i])}};this._renderAxis(this.element);this._handles=e(".ui-resizable-handle",this.element).disableSelection();
this._handles.mouseover(function(){if(!b.resizing){if(this.className)var h=this.className.match(/ui-resizable-(se|sw|ne|nw|n|e|s|w)/i);b.axis=h&&h[1]?h[1]:"se"}});if(a.autoHide){this._handles.hide();e(this.element).addClass("ui-resizable-autohide").hover(function(){e(this).removeClass("ui-resizable-autohide");b._handles.show()},function(){if(!b.resizing){e(this).addClass("ui-resizable-autohide");b._handles.hide()}})}this._mouseInit()},destroy:function(){this._mouseDestroy();var b=function(c){e(c).removeClass("ui-resizable ui-resizable-disabled ui-resizable-resizing").removeData("resizable").unbind(".resizable").find(".ui-resizable-handle").remove()};
if(this.elementIsWrapper){b(this.element);var a=this.element;a.after(this.originalElement.css({position:a.css("position"),width:a.outerWidth(),height:a.outerHeight(),top:a.css("top"),left:a.css("left")})).remove()}this.originalElement.css("resize",this.originalResizeStyle);b(this.originalElement);return this},_mouseCapture:function(b){var a=false;for(var c in this.handles)if(e(this.handles[c])[0]==b.target)a=true;return!this.options.disabled&&a},_mouseStart:function(b){var a=this.options,c=this.element.position(),
d=this.element;this.resizing=true;this.documentScroll={top:e(document).scrollTop(),left:e(document).scrollLeft()};if(d.is(".ui-draggable")||/absolute/.test(d.css("position")))d.css({position:"absolute",top:c.top,left:c.left});e.browser.opera&&/relative/.test(d.css("position"))&&d.css({position:"relative",top:"auto",left:"auto"});this._renderProxy();c=m(this.helper.css("left"));var f=m(this.helper.css("top"));if(a.containment){c+=e(a.containment).scrollLeft()||0;f+=e(a.containment).scrollTop()||0}this.offset=
this.helper.offset();this.position={left:c,top:f};this.size=this._helper?{width:d.outerWidth(),height:d.outerHeight()}:{width:d.width(),height:d.height()};this.originalSize=this._helper?{width:d.outerWidth(),height:d.outerHeight()}:{width:d.width(),height:d.height()};this.originalPosition={left:c,top:f};this.sizeDiff={width:d.outerWidth()-d.width(),height:d.outerHeight()-d.height()};this.originalMousePosition={left:b.pageX,top:b.pageY};this.aspectRatio=typeof a.aspectRatio=="number"?a.aspectRatio:
this.originalSize.width/this.originalSize.height||1;a=e(".ui-resizable-"+this.axis).css("cursor");e("body").css("cursor",a=="auto"?this.axis+"-resize":a);d.addClass("ui-resizable-resizing");this._propagate("start",b);return true},_mouseDrag:function(b){var a=this.helper,c=this.originalMousePosition,d=this._change[this.axis];if(!d)return false;c=d.apply(this,[b,b.pageX-c.left||0,b.pageY-c.top||0]);if(this._aspectRatio||b.shiftKey)c=this._updateRatio(c,b);c=this._respectSize(c,b);this._propagate("resize",
b);a.css({top:this.position.top+"px",left:this.position.left+"px",width:this.size.width+"px",height:this.size.height+"px"});!this._helper&&this._proportionallyResizeElements.length&&this._proportionallyResize();this._updateCache(c);this._trigger("resize",b,this.ui());return false},_mouseStop:function(b){this.resizing=false;var a=this.options,c=this;if(this._helper){var d=this._proportionallyResizeElements,f=d.length&&/textarea/i.test(d[0].nodeName);d=f&&e.ui.hasScroll(d[0],"left")?0:c.sizeDiff.height;
f={width:c.size.width-(f?0:c.sizeDiff.width),height:c.size.height-d};d=parseInt(c.element.css("left"),10)+(c.position.left-c.originalPosition.left)||null;var g=parseInt(c.element.css("top"),10)+(c.position.top-c.originalPosition.top)||null;a.animate||this.element.css(e.extend(f,{top:g,left:d}));c.helper.height(c.size.height);c.helper.width(c.size.width);this._helper&&!a.animate&&this._proportionallyResize()}e("body").css("cursor","auto");this.element.removeClass("ui-resizable-resizing");this._propagate("stop",
b);this._helper&&this.helper.remove();return false},_updateCache:function(b){this.offset=this.helper.offset();if(l(b.left))this.position.left=b.left;if(l(b.top))this.position.top=b.top;if(l(b.height))this.size.height=b.height;if(l(b.width))this.size.width=b.width},_updateRatio:function(b){var a=this.position,c=this.size,d=this.axis;if(b.height)b.width=c.height*this.aspectRatio;else if(b.width)b.height=c.width/this.aspectRatio;if(d=="sw"){b.left=a.left+(c.width-b.width);b.top=null}if(d=="nw"){b.top=
a.top+(c.height-b.height);b.left=a.left+(c.width-b.width)}return b},_respectSize:function(b){var a=this.options,c=this.axis,d=l(b.width)&&a.maxWidth&&a.maxWidth<b.width,f=l(b.height)&&a.maxHeight&&a.maxHeight<b.height,g=l(b.width)&&a.minWidth&&a.minWidth>b.width,h=l(b.height)&&a.minHeight&&a.minHeight>b.height;if(g)b.width=a.minWidth;if(h)b.height=a.minHeight;if(d)b.width=a.maxWidth;if(f)b.height=a.maxHeight;var i=this.originalPosition.left+this.originalSize.width,j=this.position.top+this.size.height,
k=/sw|nw|w/.test(c);c=/nw|ne|n/.test(c);if(g&&k)b.left=i-a.minWidth;if(d&&k)b.left=i-a.maxWidth;if(h&&c)b.top=j-a.minHeight;if(f&&c)b.top=j-a.maxHeight;if((a=!b.width&&!b.height)&&!b.left&&b.top)b.top=null;else if(a&&!b.top&&b.left)b.left=null;return b},_proportionallyResize:function(){if(this._proportionallyResizeElements.length)for(var b=this.helper||this.element,a=0;a<this._proportionallyResizeElements.length;a++){var c=this._proportionallyResizeElements[a];if(!this.borderDif){var d=[c.css("borderTopWidth"),
c.css("borderRightWidth"),c.css("borderBottomWidth"),c.css("borderLeftWidth")],f=[c.css("paddingTop"),c.css("paddingRight"),c.css("paddingBottom"),c.css("paddingLeft")];this.borderDif=e.map(d,function(g,h){g=parseInt(g,10)||0;h=parseInt(f[h],10)||0;return g+h})}e.browser.msie&&(e(b).is(":hidden")||e(b).parents(":hidden").length)||c.css({height:b.height()-this.borderDif[0]-this.borderDif[2]||0,width:b.width()-this.borderDif[1]-this.borderDif[3]||0})}},_renderProxy:function(){var b=this.options;this.elementOffset=
this.element.offset();if(this._helper){this.helper=this.helper||e('<div style="overflow:hidden;"></div>');var a=e.browser.msie&&e.browser.version<7,c=a?1:0;a=a?2:-1;this.helper.addClass(this._helper).css({width:this.element.outerWidth()+a,height:this.element.outerHeight()+a,position:"absolute",left:this.elementOffset.left-c+"px",top:this.elementOffset.top-c+"px",zIndex:++b.zIndex});this.helper.appendTo("body").disableSelection()}else this.helper=this.element},_change:{e:function(b,a){return{width:this.originalSize.width+
a}},w:function(b,a){return{left:this.originalPosition.left+a,width:this.originalSize.width-a}},n:function(b,a,c){return{top:this.originalPosition.top+c,height:this.originalSize.height-c}},s:function(b,a,c){return{height:this.originalSize.height+c}},se:function(b,a,c){return e.extend(this._change.s.apply(this,arguments),this._change.e.apply(this,[b,a,c]))},sw:function(b,a,c){return e.extend(this._change.s.apply(this,arguments),this._change.w.apply(this,[b,a,c]))},ne:function(b,a,c){return e.extend(this._change.n.apply(this,
arguments),this._change.e.apply(this,[b,a,c]))},nw:function(b,a,c){return e.extend(this._change.n.apply(this,arguments),this._change.w.apply(this,[b,a,c]))}},_propagate:function(b,a){e.ui.plugin.call(this,b,[a,this.ui()]);b!="resize"&&this._trigger(b,a,this.ui())},plugins:{},ui:function(){return{originalElement:this.originalElement,element:this.element,helper:this.helper,position:this.position,size:this.size,originalSize:this.originalSize,originalPosition:this.originalPosition}}});e.extend(e.ui.resizable,
{version:"1.8.7"});e.ui.plugin.add("resizable","alsoResize",{start:function(){var b=e(this).data("resizable").options,a=function(c){e(c).each(function(){var d=e(this);d.data("resizable-alsoresize",{width:parseInt(d.width(),10),height:parseInt(d.height(),10),left:parseInt(d.css("left"),10),top:parseInt(d.css("top"),10),position:d.css("position")})})};if(typeof b.alsoResize=="object"&&!b.alsoResize.parentNode)if(b.alsoResize.length){b.alsoResize=b.alsoResize[0];a(b.alsoResize)}else e.each(b.alsoResize,
function(c){a(c)});else a(b.alsoResize)},resize:function(b,a){var c=e(this).data("resizable");b=c.options;var d=c.originalSize,f=c.originalPosition,g={height:c.size.height-d.height||0,width:c.size.width-d.width||0,top:c.position.top-f.top||0,left:c.position.left-f.left||0},h=function(i,j){e(i).each(function(){var k=e(this),q=e(this).data("resizable-alsoresize"),p={},r=j&&j.length?j:k.parents(a.originalElement[0]).length?["width","height"]:["width","height","top","left"];e.each(r,function(n,o){if((n=
(q[o]||0)+(g[o]||0))&&n>=0)p[o]=n||null});if(e.browser.opera&&/relative/.test(k.css("position"))){c._revertToRelativePosition=true;k.css({position:"absolute",top:"auto",left:"auto"})}k.css(p)})};typeof b.alsoResize=="object"&&!b.alsoResize.nodeType?e.each(b.alsoResize,function(i,j){h(i,j)}):h(b.alsoResize)},stop:function(){var b=e(this).data("resizable"),a=b.options,c=function(d){e(d).each(function(){var f=e(this);f.css({position:f.data("resizable-alsoresize").position})})};if(b._revertToRelativePosition){b._revertToRelativePosition=
false;typeof a.alsoResize=="object"&&!a.alsoResize.nodeType?e.each(a.alsoResize,function(d){c(d)}):c(a.alsoResize)}e(this).removeData("resizable-alsoresize")}});e.ui.plugin.add("resizable","animate",{stop:function(b){var a=e(this).data("resizable"),c=a.options,d=a._proportionallyResizeElements,f=d.length&&/textarea/i.test(d[0].nodeName),g=f&&e.ui.hasScroll(d[0],"left")?0:a.sizeDiff.height;f={width:a.size.width-(f?0:a.sizeDiff.width),height:a.size.height-g};g=parseInt(a.element.css("left"),10)+(a.position.left-
a.originalPosition.left)||null;var h=parseInt(a.element.css("top"),10)+(a.position.top-a.originalPosition.top)||null;a.element.animate(e.extend(f,h&&g?{top:h,left:g}:{}),{duration:c.animateDuration,easing:c.animateEasing,step:function(){var i={width:parseInt(a.element.css("width"),10),height:parseInt(a.element.css("height"),10),top:parseInt(a.element.css("top"),10),left:parseInt(a.element.css("left"),10)};d&&d.length&&e(d[0]).css({width:i.width,height:i.height});a._updateCache(i);a._propagate("resize",
b)}})}});e.ui.plugin.add("resizable","containment",{start:function(){var b=e(this).data("resizable"),a=b.element,c=b.options.containment;if(a=c instanceof e?c.get(0):/parent/.test(c)?a.parent().get(0):c){b.containerElement=e(a);if(/document/.test(c)||c==document){b.containerOffset={left:0,top:0};b.containerPosition={left:0,top:0};b.parentData={element:e(document),left:0,top:0,width:e(document).width(),height:e(document).height()||document.body.parentNode.scrollHeight}}else{var d=e(a),f=[];e(["Top",
"Right","Left","Bottom"]).each(function(i,j){f[i]=m(d.css("padding"+j))});b.containerOffset=d.offset();b.containerPosition=d.position();b.containerSize={height:d.innerHeight()-f[3],width:d.innerWidth()-f[1]};c=b.containerOffset;var g=b.containerSize.height,h=b.containerSize.width;h=e.ui.hasScroll(a,"left")?a.scrollWidth:h;g=e.ui.hasScroll(a)?a.scrollHeight:g;b.parentData={element:a,left:c.left,top:c.top,width:h,height:g}}}},resize:function(b){var a=e(this).data("resizable"),c=a.options,d=a.containerOffset,
f=a.position;b=a._aspectRatio||b.shiftKey;var g={top:0,left:0},h=a.containerElement;if(h[0]!=document&&/static/.test(h.css("position")))g=d;if(f.left<(a._helper?d.left:0)){a.size.width+=a._helper?a.position.left-d.left:a.position.left-g.left;if(b)a.size.height=a.size.width/c.aspectRatio;a.position.left=c.helper?d.left:0}if(f.top<(a._helper?d.top:0)){a.size.height+=a._helper?a.position.top-d.top:a.position.top;if(b)a.size.width=a.size.height*c.aspectRatio;a.position.top=a._helper?d.top:0}a.offset.left=
a.parentData.left+a.position.left;a.offset.top=a.parentData.top+a.position.top;c=Math.abs((a._helper?a.offset.left-g.left:a.offset.left-g.left)+a.sizeDiff.width);d=Math.abs((a._helper?a.offset.top-g.top:a.offset.top-d.top)+a.sizeDiff.height);f=a.containerElement.get(0)==a.element.parent().get(0);g=/relative|absolute/.test(a.containerElement.css("position"));if(f&&g)c-=a.parentData.left;if(c+a.size.width>=a.parentData.width){a.size.width=a.parentData.width-c;if(b)a.size.height=a.size.width/a.aspectRatio}if(d+
a.size.height>=a.parentData.height){a.size.height=a.parentData.height-d;if(b)a.size.width=a.size.height*a.aspectRatio}},stop:function(){var b=e(this).data("resizable"),a=b.options,c=b.containerOffset,d=b.containerPosition,f=b.containerElement,g=e(b.helper),h=g.offset(),i=g.outerWidth()-b.sizeDiff.width;g=g.outerHeight()-b.sizeDiff.height;b._helper&&!a.animate&&/relative/.test(f.css("position"))&&e(this).css({left:h.left-d.left-c.left,width:i,height:g});b._helper&&!a.animate&&/static/.test(f.css("position"))&&
e(this).css({left:h.left-d.left-c.left,width:i,height:g})}});e.ui.plugin.add("resizable","ghost",{start:function(){var b=e(this).data("resizable"),a=b.options,c=b.size;b.ghost=b.originalElement.clone();b.ghost.css({opacity:0.25,display:"block",position:"relative",height:c.height,width:c.width,margin:0,left:0,top:0}).addClass("ui-resizable-ghost").addClass(typeof a.ghost=="string"?a.ghost:"");b.ghost.appendTo(b.helper)},resize:function(){var b=e(this).data("resizable");b.ghost&&b.ghost.css({position:"relative",
height:b.size.height,width:b.size.width})},stop:function(){var b=e(this).data("resizable");b.ghost&&b.helper&&b.helper.get(0).removeChild(b.ghost.get(0))}});e.ui.plugin.add("resizable","grid",{resize:function(){var b=e(this).data("resizable"),a=b.options,c=b.size,d=b.originalSize,f=b.originalPosition,g=b.axis;a.grid=typeof a.grid=="number"?[a.grid,a.grid]:a.grid;var h=Math.round((c.width-d.width)/(a.grid[0]||1))*(a.grid[0]||1);a=Math.round((c.height-d.height)/(a.grid[1]||1))*(a.grid[1]||1);if(/^(se|s|e)$/.test(g)){b.size.width=
d.width+h;b.size.height=d.height+a}else if(/^(ne)$/.test(g)){b.size.width=d.width+h;b.size.height=d.height+a;b.position.top=f.top-a}else{if(/^(sw)$/.test(g)){b.size.width=d.width+h;b.size.height=d.height+a}else{b.size.width=d.width+h;b.size.height=d.height+a;b.position.top=f.top-a}b.position.left=f.left-h}}});var m=function(b){return parseInt(b,10)||0},l=function(b){return!isNaN(parseInt(b,10))}})(jQuery);
;

/*
 * jQuery UI Dialog 1.8.7
 *
 * Copyright 2010, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Dialog
 *
 * Depends:
 *	jquery.ui.core.js
 *	jquery.ui.widget.js
 *  jquery.ui.button.js
 *	jquery.ui.draggable.js
 *	jquery.ui.mouse.js
 *	jquery.ui.position.js
 *	jquery.ui.resizable.js
 */
(function(c,j){var k={buttons:true,height:true,maxHeight:true,maxWidth:true,minHeight:true,minWidth:true,width:true},l={maxHeight:true,maxWidth:true,minHeight:true,minWidth:true};c.widget("ui.dialog",{options:{autoOpen:true,buttons:{},closeOnEscape:true,closeText:"close",dialogClass:"",draggable:true,hide:null,height:"auto",maxHeight:false,maxWidth:false,minHeight:150,minWidth:150,modal:false,position:{my:"center",at:"center",collision:"fit",using:function(a){var b=c(this).css(a).offset().top;b<0&&
c(this).css("top",a.top-b)}},resizable:true,show:null,stack:true,title:"",width:300,zIndex:1E3},_create:function(){this.originalTitle=this.element.attr("title");if(typeof this.originalTitle!=="string")this.originalTitle="";this.options.title=this.options.title||this.originalTitle;var a=this,b=a.options,d=b.title||"&#160;",e=c.ui.dialog.getTitleId(a.element),g=(a.uiDialog=c("<div></div>")).appendTo(document.body).hide().addClass("ui-dialog ui-widget ui-widget-content ui-corner-all "+b.dialogClass).css({zIndex:b.zIndex}).attr("tabIndex",
-1).css("outline",0).keydown(function(i){if(b.closeOnEscape&&i.keyCode&&i.keyCode===c.ui.keyCode.ESCAPE){a.close(i);i.preventDefault()}}).attr({role:"dialog","aria-labelledby":e}).mousedown(function(i){a.moveToTop(false,i)});a.element.show().removeAttr("title").addClass("ui-dialog-content ui-widget-content").appendTo(g);var f=(a.uiDialogTitlebar=c("<div></div>")).addClass("ui-dialog-titlebar ui-widget-header ui-corner-all ui-helper-clearfix").prependTo(g),h=c('<a href="#"></a>').addClass("ui-dialog-titlebar-close ui-corner-all").attr("role",
"button").hover(function(){h.addClass("ui-state-hover")},function(){h.removeClass("ui-state-hover")}).focus(function(){h.addClass("ui-state-focus")}).blur(function(){h.removeClass("ui-state-focus")}).click(function(i){a.close(i);return false}).appendTo(f);(a.uiDialogTitlebarCloseText=c("<span></span>")).addClass("ui-icon ui-icon-closethick").text(b.closeText).appendTo(h);c("<span></span>").addClass("ui-dialog-title").attr("id",e).html(d).prependTo(f);if(c.isFunction(b.beforeclose)&&!c.isFunction(b.beforeClose))b.beforeClose=
b.beforeclose;f.find("*").add(f).disableSelection();b.draggable&&c.fn.draggable&&a._makeDraggable();b.resizable&&c.fn.resizable&&a._makeResizable();a._createButtons(b.buttons);a._isOpen=false;c.fn.bgiframe&&g.bgiframe()},_init:function(){this.options.autoOpen&&this.open()},destroy:function(){var a=this;a.overlay&&a.overlay.destroy();a.uiDialog.hide();a.element.unbind(".dialog").removeData("dialog").removeClass("ui-dialog-content ui-widget-content").hide().appendTo("body");a.uiDialog.remove();a.originalTitle&&
a.element.attr("title",a.originalTitle);return a},widget:function(){return this.uiDialog},close:function(a){var b=this,d,e;if(false!==b._trigger("beforeClose",a)){b.overlay&&b.overlay.destroy();b.uiDialog.unbind("keypress.ui-dialog");b._isOpen=false;if(b.options.hide)b.uiDialog.hide(b.options.hide,function(){b._trigger("close",a)});else{b.uiDialog.hide();b._trigger("close",a)}c.ui.dialog.overlay.resize();if(b.options.modal){d=0;c(".ui-dialog").each(function(){if(this!==b.uiDialog[0]){e=c(this).css("z-index");
isNaN(e)||(d=Math.max(d,e))}});c.ui.dialog.maxZ=d}return b}},isOpen:function(){return this._isOpen},moveToTop:function(a,b){var d=this,e=d.options;if(e.modal&&!a||!e.stack&&!e.modal)return d._trigger("focus",b);if(e.zIndex>c.ui.dialog.maxZ)c.ui.dialog.maxZ=e.zIndex;if(d.overlay){c.ui.dialog.maxZ+=1;d.overlay.$el.css("z-index",c.ui.dialog.overlay.maxZ=c.ui.dialog.maxZ)}a={scrollTop:d.element.attr("scrollTop"),scrollLeft:d.element.attr("scrollLeft")};c.ui.dialog.maxZ+=1;d.uiDialog.css("z-index",c.ui.dialog.maxZ);
d.element.attr(a);d._trigger("focus",b);return d},open:function(){if(!this._isOpen){var a=this,b=a.options,d=a.uiDialog;a.overlay=b.modal?new c.ui.dialog.overlay(a):null;a._size();a._position(b.position);d.show(b.show);a.moveToTop(true);b.modal&&d.bind("keypress.ui-dialog",function(e){if(e.keyCode===c.ui.keyCode.TAB){var g=c(":tabbable",this),f=g.filter(":first");g=g.filter(":last");if(e.target===g[0]&&!e.shiftKey){f.focus(1);return false}else if(e.target===f[0]&&e.shiftKey){g.focus(1);return false}}});
c(a.element.find(":tabbable").get().concat(d.find(".ui-dialog-buttonpane :tabbable").get().concat(d.get()))).eq(0).focus();a._isOpen=true;a._trigger("open");return a}},_createButtons:function(a){var b=this,d=false,e=c("<div></div>").addClass("ui-dialog-buttonpane ui-widget-content ui-helper-clearfix"),g=c("<div></div>").addClass("ui-dialog-buttonset").appendTo(e);b.uiDialog.find(".ui-dialog-buttonpane").remove();typeof a==="object"&&a!==null&&c.each(a,function(){return!(d=true)});if(d){c.each(a,function(f,
h){h=c.isFunction(h)?{click:h,text:f}:h;f=c('<button type="button"></button>').attr(h,true).unbind("click").click(function(){h.click.apply(b.element[0],arguments)}).appendTo(g);c.fn.button&&f.button()});e.appendTo(b.uiDialog)}},_makeDraggable:function(){function a(f){return{position:f.position,offset:f.offset}}var b=this,d=b.options,e=c(document),g;b.uiDialog.draggable({cancel:".ui-dialog-content, .ui-dialog-titlebar-close",handle:".ui-dialog-titlebar",containment:"document",start:function(f,h){g=
d.height==="auto"?"auto":c(this).height();c(this).height(c(this).height()).addClass("ui-dialog-dragging");b._trigger("dragStart",f,a(h))},drag:function(f,h){b._trigger("drag",f,a(h))},stop:function(f,h){d.position=[h.position.left-e.scrollLeft(),h.position.top-e.scrollTop()];c(this).removeClass("ui-dialog-dragging").height(g);b._trigger("dragStop",f,a(h));c.ui.dialog.overlay.resize()}})},_makeResizable:function(a){function b(f){return{originalPosition:f.originalPosition,originalSize:f.originalSize,
position:f.position,size:f.size}}a=a===j?this.options.resizable:a;var d=this,e=d.options,g=d.uiDialog.css("position");a=typeof a==="string"?a:"n,e,s,w,se,sw,ne,nw";d.uiDialog.resizable({cancel:".ui-dialog-content",containment:"document",alsoResize:d.element,maxWidth:e.maxWidth,maxHeight:e.maxHeight,minWidth:e.minWidth,minHeight:d._minHeight(),handles:a,start:function(f,h){c(this).addClass("ui-dialog-resizing");d._trigger("resizeStart",f,b(h))},resize:function(f,h){d._trigger("resize",f,b(h))},stop:function(f,
h){c(this).removeClass("ui-dialog-resizing");e.height=c(this).height();e.width=c(this).width();d._trigger("resizeStop",f,b(h));c.ui.dialog.overlay.resize()}}).css("position",g).find(".ui-resizable-se").addClass("ui-icon ui-icon-grip-diagonal-se")},_minHeight:function(){var a=this.options;return a.height==="auto"?a.minHeight:Math.min(a.minHeight,a.height)},_position:function(a){var b=[],d=[0,0],e;if(a){if(typeof a==="string"||typeof a==="object"&&"0"in a){b=a.split?a.split(" "):[a[0],a[1]];if(b.length===
1)b[1]=b[0];c.each(["left","top"],function(g,f){if(+b[g]===b[g]){d[g]=b[g];b[g]=f}});a={my:b.join(" "),at:b.join(" "),offset:d.join(" ")}}a=c.extend({},c.ui.dialog.prototype.options.position,a)}else a=c.ui.dialog.prototype.options.position;(e=this.uiDialog.is(":visible"))||this.uiDialog.show();this.uiDialog.css({top:0,left:0}).position(c.extend({of:window},a));e||this.uiDialog.hide()},_setOptions:function(a){var b=this,d={},e=false;c.each(a,function(g,f){b._setOption(g,f);if(g in k)e=true;if(g in
l)d[g]=f});e&&this._size();this.uiDialog.is(":data(resizable)")&&this.uiDialog.resizable("option",d)},_setOption:function(a,b){var d=this,e=d.uiDialog;switch(a){case "beforeclose":a="beforeClose";break;case "buttons":d._createButtons(b);break;case "closeText":d.uiDialogTitlebarCloseText.text(""+b);break;case "dialogClass":e.removeClass(d.options.dialogClass).addClass("ui-dialog ui-widget ui-widget-content ui-corner-all "+b);break;case "disabled":b?e.addClass("ui-dialog-disabled"):e.removeClass("ui-dialog-disabled");
break;case "draggable":var g=e.is(":data(draggable)");g&&!b&&e.draggable("destroy");!g&&b&&d._makeDraggable();break;case "position":d._position(b);break;case "resizable":(g=e.is(":data(resizable)"))&&!b&&e.resizable("destroy");g&&typeof b==="string"&&e.resizable("option","handles",b);!g&&b!==false&&d._makeResizable(b);break;case "title":c(".ui-dialog-title",d.uiDialogTitlebar).html(""+(b||"&#160;"));break}c.Widget.prototype._setOption.apply(d,arguments)},_size:function(){var a=this.options,b,d,e=
this.uiDialog.is(":visible");this.element.show().css({width:"auto",minHeight:0,height:0});if(a.minWidth>a.width)a.width=a.minWidth;b=this.uiDialog.css({height:"auto",width:a.width}).height();d=Math.max(0,a.minHeight-b);if(a.height==="auto")if(c.support.minHeight)this.element.css({minHeight:d,height:"auto"});else{this.uiDialog.show();a=this.element.css("height","auto").height();e||this.uiDialog.hide();this.element.height(Math.max(a,d))}else this.element.height(Math.max(a.height-b,0));this.uiDialog.is(":data(resizable)")&&
this.uiDialog.resizable("option","minHeight",this._minHeight())}});c.extend(c.ui.dialog,{version:"1.8.7",uuid:0,maxZ:0,getTitleId:function(a){a=a.attr("id");if(!a){this.uuid+=1;a=this.uuid}return"ui-dialog-title-"+a},overlay:function(a){this.$el=c.ui.dialog.overlay.create(a)}});c.extend(c.ui.dialog.overlay,{instances:[],oldInstances:[],maxZ:0,events:c.map("focus,mousedown,mouseup,keydown,keypress,click".split(","),function(a){return a+".dialog-overlay"}).join(" "),create:function(a){if(this.instances.length===
0){setTimeout(function(){c.ui.dialog.overlay.instances.length&&c(document).bind(c.ui.dialog.overlay.events,function(d){if(c(d.target).zIndex()<c.ui.dialog.overlay.maxZ)return false})},1);c(document).bind("keydown.dialog-overlay",function(d){if(a.options.closeOnEscape&&d.keyCode&&d.keyCode===c.ui.keyCode.ESCAPE){a.close(d);d.preventDefault()}});c(window).bind("resize.dialog-overlay",c.ui.dialog.overlay.resize)}var b=(this.oldInstances.pop()||c("<div></div>").addClass("ui-widget-overlay")).appendTo(document.body).css({width:this.width(),
height:this.height()});c.fn.bgiframe&&b.bgiframe();this.instances.push(b);return b},destroy:function(a){var b=c.inArray(a,this.instances);b!=-1&&this.oldInstances.push(this.instances.splice(b,1)[0]);this.instances.length===0&&c([document,window]).unbind(".dialog-overlay");a.remove();var d=0;c.each(this.instances,function(){d=Math.max(d,this.css("z-index"))});this.maxZ=d},height:function(){var a,b;if(c.browser.msie&&c.browser.version<7){a=Math.max(document.documentElement.scrollHeight,document.body.scrollHeight);
b=Math.max(document.documentElement.offsetHeight,document.body.offsetHeight);return a<b?c(window).height()+"px":a+"px"}else return c(document).height()+"px"},width:function(){var a,b;if(c.browser.msie&&c.browser.version<7){a=Math.max(document.documentElement.scrollWidth,document.body.scrollWidth);b=Math.max(document.documentElement.offsetWidth,document.body.offsetWidth);return a<b?c(window).width()+"px":a+"px"}else return c(document).width()+"px"},resize:function(){var a=c([]);c.each(c.ui.dialog.overlay.instances,
function(){a=a.add(this)});a.css({width:0,height:0}).css({width:c.ui.dialog.overlay.width(),height:c.ui.dialog.overlay.height()})}});c.extend(c.ui.dialog.overlay.prototype,{destroy:function(){c.ui.dialog.overlay.destroy(this.$el)}})})(jQuery);
;
/*!
 * debug - v0.3 - 6/8/2009
 * http://benalman.com/projects/javascript-debug-console-log/
 * 
 * Copyright (c) 2009 "Cowboy" Ben Alman
 * Licensed under the MIT license
 * http://benalman.com/about/license/
 * 
 * With lots of help from Paul Irish!
 * http://paulirish.com/
 */

// Script: Debug
//
// Version: 0.3, Date: 6/8/2009
// 
// Tested with Internet Explorer 6-8, Firefox 3, Safari 3-4, Chrome, Opera 9.
// 
// Home       - http://benalman.com/projects/javascript-debug-console-log/
// Source     - http://benalman.com/code/javascript/ba-debug.js
// (Minified) - http://benalman.com/code/javascript/ba-debug.min.js (1.1kb)
// Examples   - http://benalman.com/code/test/js-debug/
// 
// 
// About: License
// 
// Copyright (c) 2009 "Cowboy" Ben Alman
// 
// Licensed under the MIT license
// 
// http://benalman.com/about/license/
// 
// Topic: Pass-through console methods
// 
// assert, clear, count, dir, dirxml, group, groupEnd, profile, profileEnd,
// time, timeEnd, trace
// 
// These console methods are passed through (but only if both the console and
// the method exists), so use them without fear of reprisal. Note that these
// methods will not be passed through if the logging level is set to 0 via
// <debug.setLevel>.

window.debug = (function(){
  var window = this,
    
    // Some convenient shortcuts.
    aps = Array.prototype.slice,
    con = window.console,
    
    // Public object to be returned.
    that = {},
    
    callback_func,
    callback_force,
    
    // Default logging level, show everything.
    log_level = 9,
    
    // Logging methods, in "priority order". Not all console implementations
    // will utilize these, but they will be used in the callback passed to
    // setCallback.
    log_methods = [ 'error', 'warn', 'info', 'debug', 'log' ],
    
    // Pass these methods through to the console if they exist, otherwise just
    // fail gracefully. These methods are provided for convenience.
    pass_methods = 'assert clear count dir dirxml group groupEnd profile profileEnd time timeEnd trace'.split(' '),
    idx = pass_methods.length,
    
    // Logs are stored here so that they can be recalled as necessary.
    logs = [];
  
  while ( --idx >= 0 ) {
    (function( method ){
      
      // Generate pass-through methods. These methods will be called, if they
      // exist, as long as the logging level is non-zero.
      that[ method ] = function() {
        log_level !== 0 && con && con[ method ]
          && con[ method ].apply( con, arguments );
      }
      
    })( pass_methods[idx] );
  }
  
  idx = log_methods.length;
  while ( --idx >= 0 ) {
    (function( idx, level ){
      
      // Method: debug.log
      // 
      // Call the console.log method if available. Adds an entry into the logs
      // array for a callback specified via <debug.setCallback>.
      // 
      // Usage:
      // 
      //  debug.log( object [, object, ...] );                               - -
      // 
      // Arguments:
      // 
      //  object - (Object) Any valid JavaScript object.
      
      // Method: debug.debug
      // 
      // Call the console.debug method if available, otherwise call console.log.
      // Adds an entry into the logs array for a callback specified via
      // <debug.setCallback>.
      // 
      // Usage:
      // 
      //  debug.debug( object [, object, ...] );                             - -
      // 
      // Arguments:
      // 
      //  object - (Object) Any valid JavaScript object.
      
      // Method: debug.info
      // 
      // Call the console.info method if available, otherwise call console.log.
      // Adds an entry into the logs array for a callback specified via
      // <debug.setCallback>.
      // 
      // Usage:
      // 
      //  debug.info( object [, object, ...] );                              - -
      // 
      // Arguments:
      // 
      //  object - (Object) Any valid JavaScript object.
      
      // Method: debug.warn
      // 
      // Call the console.warn method if available, otherwise call console.log.
      // Adds an entry into the logs array for a callback specified via
      // <debug.setCallback>.
      // 
      // Usage:
      // 
      //  debug.warn( object [, object, ...] );                              - -
      // 
      // Arguments:
      // 
      //  object - (Object) Any valid JavaScript object.
      
      // Method: debug.error
      // 
      // Call the console.error method if available, otherwise call console.log.
      // Adds an entry into the logs array for a callback specified via
      // <debug.setCallback>.
      // 
      // Usage:
      // 
      //  debug.error( object [, object, ...] );                             - -
      // 
      // Arguments:
      // 
      //  object - (Object) Any valid JavaScript object.
      
      that[ level ] = function() {
        var args = aps.call( arguments ),
          log_arr = [ level ].concat( args );
        
        logs.push( log_arr );
        exec_callback( log_arr );
        
        if ( !con || !is_level( idx ) ) { return; }
        
        con.firebug ? con[ level ].apply( window, args )
          : con[ level ] ? con[ level ]( args )
          : con.log( args );
      };
      
    })( idx, log_methods[idx] );
  }
  
  // Execute the callback function if set.
  function exec_callback( args ) {
    if ( callback_func && (callback_force || !con || !con.log) ) {
      callback_func.apply( window, args );
    }
  };
  
  // Method: debug.setLevel
  // 
  // Set a minimum or maximum logging level for the console. Doesn't affect
  // the <debug.setCallback> callback function, but if set to 0 to disable
  // logging, <Pass-through console methods> will be disabled as well.
  // 
  // Usage:
  // 
  //  debug.setLevel( [ level ] )                                            - -
  // 
  // Arguments:
  // 
  //  level - (Number) If 0, disables logging. If negative, shows N lowest
  //    priority levels of log messages. If positive, shows N highest priority
  //    levels of log messages.
  //
  // Priority levels:
  // 
  //   log (1) < debug (2) < info (3) < warn (4) < error (5)
  
  that.setLevel = function( level ) {
    log_level = typeof level === 'number' ? level : 9;
  };
  
  // Determine if the level is visible given the current log_level.
  function is_level( level ) {
    return log_level > 0
      ? log_level > level
      : log_methods.length + log_level <= level;
  };
  
  // Method: debug.setCallback
  // 
  // Set a callback to be used if logging isn't possible due to console.log
  // not existing. If unlogged logs exist when callback is set, they will all
  // be logged immediately unless a limit is specified.
  // 
  // Usage:
  // 
  //  debug.setCallback( callback [, force ] [, limit ] )
  // 
  // Arguments:
  // 
  //  callback - (Function) The aforementioned callback function. The first
  //    argument is the logging level, and all subsequent arguments are those
  //    passed to the initial debug logging method.
  //  force - (Boolean) If false, log to console.log if available, otherwise
  //    callback. If true, log to both console.log and callback.
  //  limit - (Number) If specified, number of lines to limit initial scrollback
  //    to.
  
  that.setCallback = function() {
    var args = aps.call( arguments ),
      max = logs.length,
      i = max;
    
    callback_func = args.shift() || null;
    callback_force = typeof args[0] === 'boolean' ? args.shift() : false;
    
    i -= typeof args[0] === 'number' ? args.shift() : max;
    
    while ( i < max ) {
      exec_callback( logs[i++] );
    }
  };
  
  return that;
})();

;
/*jslint bitwise: true, eqeqeq: true, immed: true, newcap: true, nomen: false,
 onevar: false, plusplus: false, regexp: true, undef: true, white: true, indent: 2
 browser: true */

/*global jQuery: true Drupal: true debug: true window: true*/

/**
 * @namespace
 */
var Drupal = Drupal || {};
/**
 * @namespace
 */
Drupal.behaviors = Drupal.behaviors || {};

/**
 * The ThemeBuilder is a namespace in which all themebuilder-specific
 * code will reside.
 * 
 * @namespace
 */
var ThemeBuilder = ThemeBuilder || {};

/**
 * Binds an object method to the object so it the method can be used as a
 * callback that normally takes a function.  This scheme helps control the
 * creation of closures and the specific variables included in the closure's
 * environment to help avoid memory leaks.
 *
 * Caller arguments may be ignored if desired.  This is often helpful
 * when using an existing function to handle an event when the target
 * function doesn't take the event as an argument.
 *
 * The calling context (the 'this' reference) may be passed as an argument.
 *
 * All arguments past the 'method' argument will be stored within the resulting
 * closure and used as parameters on the method call.
 *
 * The order of parameters is [caller args], [this], [bound args].
 *
 * @function
 * @param {Object} object
 *   The object instance which holds the specified method.
 * @param {Function} method
 *   The method of the specified object to call.
 * @param {boolean} ignoreCallerArgs
 *   Optional, default is false.  If true, all arguments supplied by
 *   the caller of the resulting function will not be passed to the
 *   target method.
 * @param {boolean} passThisAsArg
 *   Optional, default is false.  If true, the context of the call to
 *   the resulting function will be passed as the first argument.
 */
ThemeBuilder.bindFull = function (object, method, ignoreCallerArgs, passThisAsArg) {
  if (!object) {
    if (ThemeBuilder.isDevelMode()) {
      // For production it is best not to throw an exception here.  If
      // there is a bug, likely the user will not notice it, but
      // throwing an exception will cause whatever behavior to
      // entirely break even before they try to use it.  Good
      // development stuff, but a poor production experience.
      throw ('Object cannot be null.');
    }
  }
  if (!method) {
    if (ThemeBuilder.isDevelMode()) {
      throw ('Method cannot be null.');
    }
  }
  if (ignoreCallerArgs !== true && ignoreCallerArgs !== false) {
    ignoreCallerArgs = false;
  }
  if (passThisAsArg !== true && passThisAsArg !== false) {
    passThisAsArg = false;
  }
  var _bind_args = [];  // Arguments passed into the bind call.
  for (var i = 4; i < arguments.length; i++) {
    _bind_args.push(arguments[i]);
  }
  i = undefined;
  return function () {
    var invocation_args = []; // Arguments called when the function is called.
    if (false === ignoreCallerArgs) {
      for (var i = 0; i < arguments.length; i++) {
        invocation_args.push(arguments[i]);
      }
    }
    if (true === passThisAsArg) {
      invocation_args.push(this);
    }
    var args = invocation_args.concat(_bind_args); // Final arguments.
    return method.apply(object, args);
  };
};

/**
 * Binds an object method to the object so it the method can be used as a
 * callback that normally takes a function.  This scheme helps control the
 * creation of closures and the specific variables included in the closure's
 * environment to help avoid memory leaks.
 *
 * All arguments past the 'method' argument will be stored within the resulting
 * closure and used as parameters on the method call.
 *
 * @param {Object} object
 *   The object instance which holds the specified method.
 * @param {Function} method
 *   The method of the specified object to call.
 */
ThemeBuilder.bind = function (object, method) {
  var args = [object, method, false, false];
  for (var i = 2; i < arguments.length; i++) {
    args.push(arguments[i]);
  }
  return ThemeBuilder.bindFull.apply(this, args);
};

/**
 * Binds an object method to the object so it the method can be used as a
 * callback that normally takes a function.  This scheme helps control the
 * creation of closures and the specific variables included in the closure's
 * environment to help avoid memory leaks.
 *
 * All arguments past the 'method' argument will be stored within the resulting
 * closure and used as parameters on the method call.  Arguments passed from
 * the caller will be ignored.
 *
 * @param object Object
 *   The object instance which holds the specified method.
 * @param method Function
 *   The method of the specified object to call.
 */
ThemeBuilder.bindIgnoreCallerArgs = function (object, method) {
  var args = [object, method, true, false];
  for (var i = 2; i < arguments.length; i++) {
    args.push(arguments[i]);
  }
  return ThemeBuilder.bindFull.apply(this, args);
};

/**
 * Clones the specified object.
 *
 * @param object mixed
 *   The object to clone.
 * @return
 *   The cloned object.
 */
ThemeBuilder.clone = function (object) {
  if (!object || typeof(object) !== 'object') {
    return object;
  }
  var temp;
  if (object.constructor === Array) {
    temp = [];
    for (var i = 0; i < object.length; i++) {
      temp.push(ThemeBuilder.clone(object[i]));
    }
    i = undefined;
  }
  else {
    temp = {};
    for (var key in object) {
      if (true) { // Make jslint happy
        try {
          temp[key] = ThemeBuilder.clone(object[key]);
        }
        catch (err) {
          // On IE we sometimes encounter an error when cloning the
          // computedStyles object on the outlineWidth property.
        }
      }
    }
    key = undefined;
  }
  return temp;
};

/**
 * Merges two objects
 */
ThemeBuilder.merge = function (destination, source) {
  var output = ThemeBuilder.clone(destination);
  for (var property in source) {
    // Filter out inherited properties
    if (source.hasOwnProperty(property)) {
      // Save to destination object. Overwrite if the property already exists.
      output[property] = source[property];
    }
  }
  return output;
};

/**
 * This function returns a new Class initializer.
 *
 * @return
 *   A new Class initializer which allows new instances to be created easily
 *   and supports a constructor method called 'initialize'.
 */
ThemeBuilder.initClass = function () {
  return function () {
    this.initialize.apply(this, arguments);
  };
};

/**
 * Simulates the behavior in typical OO languages by making a child class.
 * 
 * @return void;
 */
ThemeBuilder.extend = function (subclass, superclass) {
  function Dummy() {}
  Dummy.prototype = superclass.prototype;
  subclass.prototype = new Dummy();
  subclass.prototype.constructor = subclass;
  subclass.superclass = superclass;
  subclass.superproto = superclass.prototype;
};

/**
 * Simple array-based stack implementation.  Implemented so the caller cannot
 * destroy the stack or inspect the data in ways other than what a stack would
 * permit.
 * 
 * @class
 * @constructor
 */
ThemeBuilder.Stack = ThemeBuilder.initClass();

/**
 * Constructor for the stack.  Initialize the array that contains the data in
 * the stack.
 */
ThemeBuilder.Stack.prototype.initialize = function () {
  this._data = [];
  this._listeners = [];
};

/**
 * Add the specified item to the stack.
 *
 * @param item object
 *   The item to add to the top of the stack.
 */
ThemeBuilder.Stack.prototype.push = function (item) {
  this._data.push(item);
  this.notifyListeners();
};

/**
 * Removes the item from the top of the stack.  If there is nothing in the stack,
 * null is returned.
 *
 * @return
 *   The item at the top of the stack.
 */
ThemeBuilder.Stack.prototype.pop = function () {
  var modification = this._data.pop();
  this.notifyListeners();
  return modification;
};

/**
 * Returns a copy of the item at the top of the stack, without actually removing
 * the item from the stack.  The item is cloned so that the client code will
 * not inadvertently alter the copy of the object and by doing so destroy the
 * integrity of the stack.
 *
 * @return
 *   A copy of the item at the top of the stack.  This is useful for finding out
 *   information about the top item without actually removing it from the stack.
 */
ThemeBuilder.Stack.prototype.peek = function () {
  var size = this.size();
  if (size <= 0) {
    return null;
  }
  var obj = this._data[size - 1];
  return ThemeBuilder.clone(obj);
};

/**
 * Clears the contents of the stack.
 */
ThemeBuilder.Stack.prototype.clear = function () {
  this._data = [];
  this.notifyListeners();
};

/**
 * Returns the size of the stack.
 */
ThemeBuilder.Stack.prototype.size = function () {
  return this._data.length;
};

/**
 * Adds a stack listener which is called when the stack is changed in any way.
 *
 * @param listener object
 *   An object with a stackChanged method.
 */
ThemeBuilder.Stack.prototype.addChangeListener = function (listener) {
  this._listeners.push(listener);
};

/**
 * Removes the specified listener from the stack.
 *
 * @param listener object
 *   The listener to remove.
 */
ThemeBuilder.Stack.prototype.removeChangeListener = function (listener) {
  var listeners = [];
  for (var i = 0; i < this._listeners.length; i++) {
    if (this._listeners[i] !== listener) {
      listeners.push(this._listener[i]);
    }
  }
  this._listeners = listeners;
};

/**
 * Notifies the listeners that a change to the state of this stack has occurred.
 */
ThemeBuilder.Stack.prototype.notifyListeners = function () {
  for (var i = 0; i < this._listeners.length; i++) {
    this._listeners[i].stackChanged(this);
  }
};

/**
 * Returns true if the specified object is an array.
 *
 * @return
 *   true if the object is an array; false otherwise.
 */
ThemeBuilder.isArray = function (obj) {
  return Object.prototype.toString.apply(obj) === '[object Array]';
};

/**
 * Returns the last element of the array.
 *
 * @return {mixed}
 *   The last element.
 */
Array.prototype.last = function () {
  // jQuery sometimes (e.g., within $.param()) iterates an array and for every
  // value that's a function, calls the function without an object context, so
  // we can't assume that "this" is an array.
  // @todo Test if jQuery 1.5 has this bug, and if so, report it.
  if (this.slice) {
    return this.slice(-1)[0];
  }
};

/**
 * Returns true if this array contains the specified object.
 */
Array.prototype.contains = function (obj) {
  var i = this.length;
  while (i--) {
    if (this[i] === obj) {
      return true;
    }
  }
  return false;
};

/**
 * Wrapper around ThemeBuilder.sendRequest
 *
 * @see ThemeBuilder.sendRequest
 *
 */
ThemeBuilder.postBack = function (path, data, success_callback, error_callback, ajax_params) {
  ThemeBuilder.sendRequest("POST", path, data, success_callback, error_callback, ajax_params);
};


/**
 * Wrapper around ThemeBuilder.sendRequest
 *
 * @see ThemeBuilder.sendRequest
 *
 */
ThemeBuilder.getBack = function (path, data, success_callback, error_callback, ajax_params) { // handles tokens etc.
  ThemeBuilder.sendRequest("GET", path, data, success_callback, error_callback, ajax_params);
};

/**
 * Centalized handler for Ajax requests.  Handles errors and tokens.
 *
 * @param {String} method POST or GET
 * @param {String} path The Drupal path you are trying to request
 * @param {Object} data The data you wish to send
 * @param {Function} success_callback A function to be called on a correctly parsed
 * @param {Function} error_callback A function to be called if an error is thrown
 * @param {Object} ajax_params Additional Ajax Params to replace defaults
 * @param {Integer} retryCount The # of retries that have been attempted for this request.
 * 
 *                          @see http://docs.jquery.com/Ajax/jQuery.ajax#options
 *
 */
ThemeBuilder.sendRequest = function (method, path, data, success_callback, error_callback, ajax_params, retryCount) {
  // @todo: Store this somewhere more sensibly.
  var maxRetries = 3; // There is the first attempt plus 3 retries if needed.
  var retryDelay = 5; // 5 seconds

  if (!data) {
    data = {};
  }

  if (!retryCount) {
    retryCount = 0;
  }

  /**
   * This function is called when the response arrives, no matter if
   * the request was successful or not.  This function allows
   * preprocessing of the data if needed.
   *
   * @param {object} data
   *   The data received from the server.
   */
  var pre_processing = function (data) {
    if (data && data.app_data) {
      ThemeBuilder.getApplicationInstance().updateData(data.app_data);
      delete data.app_data;
    }
  };

  /**
   * This function is called after the response arrives, no matter if the request
   * was successful or not.  This function allows any cleanup or setting of state.
   * I am using this function to enable the undo buttons, if they were disabled
   * as a result of the request.  Simply add a statusKey field, which holds the
   * key returned from invoking ThemeBuilder.undoButtons.disable().
   */
  var post_processing = function () {
    if (data.statusKey && ThemeBuilder.undoButtons) {
      ThemeBuilder.undoButtons.clear(data.statusKey);
    }
  };

  /**
   * This function wraps the success_callback passed in by the caller.  No matter
   * if the request succeeds or fails, there is post processing that needs to be
   * done.
   *
   * @param {object} data
   *   The data received from the server.
   * @param {string} type
   *   Indicates the type of response.
   */
  var success_wrapper = function (data, type) {
    pre_processing(data);
    if (data && data.exception === true) {
      // This was a non-fatal error.
      // It was triggered via a PHP exception, so we're trying to preserve
      // as much of the exception information as possible.
      // Contrast this with an actual error (below) which would be a parsererror
      // or a HTTP status code != 200.
      if (error_callback) {
        error_callback(data, data.type, 'recoverableError');
      }
      else {
        ThemeBuilder.handleError(data, data.type, 'recoverableError');
      }
    }
    else if (success_callback) {
      success_callback(data, type);
    }
    post_processing();
  };

  var error_wrapper = function (responseData, type, errorThrown) {
    pre_processing(responseData);
    if (responseData.status === 502 || responseData.status === 503 || responseData.status === 504) {
      if (retryCount >= maxRetries) {
        // We were not able to get a response from the server even after
        // several attempts.  Close the themebuilder.
        ThemeBuilder.Log.gardensError('AN-22452 - Failed to successfully submit a request after multiple attempts.', 'Tried ' + retryCount + ' times before failing.  Forcibly closing the themebuilder.');
        var error_data = {type: 'ThemebuilderException', exception: true, handlers: ['alertAndClose']};
        error_data.message = Drupal.t("Oops.  We were unable to process your request (service too busy).  The ThemeBuilder must close now.  After closing, please wait and try changing your site's appearance again.  If you see this message multiple times, please contact support for assistance.");
        ThemeBuilder.handleError(error_data, error_data.type, 'recoverableError');
        return;
      }
      // The delay is 5 * (2^n), where n goes from 0 to 2.  This
      // results in delays of 5s, 10s, 20s, for a total of 35 seconds
      // between the initial attempt and the final attempt (plus
      // failed request time).  Note that the configuration of the
      // balancer causes a webnode to come out of rotation for 30
      // seconds if it is failing to respond to requests.  By spanning
      // that time with the retry attempts, there is a good chance the
      // web server will come back up.  Complete web server failures
      // are rare.  When we don't delay at all, we are noticing about
      // 12 failures in which the themebuilder is forcibly closed per
      // day.
      var delay = retryDelay * Math.pow(2, retryCount);
      retryCount += 1;

      // Note: Do not use ThemeBuilder.Log for this message because it
      // communicates back to the server and this block of code is
      // only used when there are problems communicating with the
      // server.
      ThemeBuilder.logCallback('Request failed, waiting ' + delay + ' seconds for ' + path);

      // Retry the request after a delay.
      setTimeout(ThemeBuilder.bindIgnoreCallerArgs(this, ThemeBuilder.sendRequest, method, path, data, success_callback, error_callback, ajax_params, retryCount), delay * 1000);
      return;
    }
    if (responseData.status === 200 && responseData.responseText === "") {
      // JS: How should we handle empty payloads?  Will throw a parsing error.
      // For now, going to just call the success callback, if it is a 200 code
      if (success_callback) {
        success_callback({});
      }
      post_processing();
      return;
    }
    ThemeBuilder.handleError(responseData, type, errorThrown);
    
    if (error_callback) {
      error_callback(responseData, type, errorThrown);
    } else {
      ThemeBuilder.handleError(responseData, type, errorThrown);
    }
    post_processing();
  };

  data.form_token = ThemeBuilder.getToken(path);
  // About to send an ajax request.  Make certain that the affinity
  // cookie is set.  Keep in mind that some users will delete their
  // cookies because they can.
  if (!jQuery.cookie('ah_app_server')) {
    if (Drupal && Drupal.settings && Drupal.settings.themebuilderServer) {
      jQuery.cookie('ah_app_server', Drupal.settings.themebuilderServer.webnode);
    }
  }
  
  jQuery.ajax(jQuery.extend({
    async: true,
    type: method,
    cache: false,
    url: Drupal.settings.callbacks[path].url,
    dataType: "json",
    data: data,
    success: success_wrapper,
    error: error_wrapper
  }, ajax_params));
};

/**
 * Handles errors which are not caught by the code making an ajax request.
 * 
 * If the error is recoverable, it will iterate through specified fallback
 * handlers.
 * 
 * @see themebuilder_compiler.php.
 * 
 * @param mixed data
 *   The return from an ajax call.  If errorThrown is a 'recoverableError' it will
 *   be an object with properties like code, message and handlers.  Otherwise,
 *   it will be a string which is sent on serious fatal errors.
 *   
 * @param string type
 *   If thrown as a recoverableError (see themebuilder_compile.php), this will
 *   be the name of the exception handling class.  Otherwise, will be provided
 *   by jQuery ajax and will be textStatus from the error function 
 *   @see http://api.jquery.com/jQuery.ajax/.
 * 
 * @param mixed errorThrown
 *   If a recoverable error will be 'recoverableError', if an ajax error will
 *   be an exception because the call was unable to be made.
 */
ThemeBuilder.handleError = function (data, type, errorThrown) {
  if (errorThrown === 'recoverableError') {
    if (data.handlers) {
      for (var i in data.handlers) {
        if (data.handlers.hasOwnProperty(i)) {
          var function_name = data.handlers[i];
          ThemeBuilder.errorHandler[function_name](data, type, errorThrown);
        }
      }
    }   
  } else {
    ThemeBuilder.errorHandler.logSilently(data, type, errorThrown);
  }
};

/**
 * Mostly used in postBack and getBack methods
 *
 * @param path String
 *    The relative path (what you pass to url() in Drupal) a token is required for.
 *
 * @return string
 *   The token
 */
ThemeBuilder.getToken = function (path) {
  if (!path) {
    throw Drupal.t('Path argument is required when calling ThemeBuilder.getToken');
  }
  if (!Drupal.settings.callbacks[path] && !Drupal.settings.callbacks[path].token) {
    throw Drupal.t('Invalid callback specified or no token exists: ') + path;
  }
  return Drupal.settings.callbacks[path].token;
};


/**
 * Slightly modified version of jQuery.load to allow us to integrate tokens and
 * callbacks.
 *
 * @param {jQuery} element The Jquery element you wish to replace HTML into
 * @param {String} path The path you wish to request
 * @param {Object} data Key-Value pairs to send
 * @param {function} callback
 * @param {String} selector a jQuery expression to use on the requested HTML (if any).
 *
 * @return void
 *
 */
ThemeBuilder.load = function (element, path, data, callback, selector, sync) {
  var page = window.location.pathname.substring(Drupal.settings.basePath.length);
  if (page === '') {
    page = '<front>';
  }
  data = jQuery.extend(data, {"page": page});
  ThemeBuilder.sendRequest('GET', path, data,
    function (res, status) {
      if (!ThemeBuilder.util.isHtmlMarkup(res)) {
        // This is not html.  Interpret it as a JSON object.
        try {
	  /*jslint evil: true */
          var obj = eval('(' + res + ')');
	  /* jslint evil: false */
          if (obj.exception && obj.type) {
            ThemeBuilder.handleError(obj, obj.type, 'recoverableError');
            return;
          }
        }
        catch (e) {
          // Ok, so it is not a JSON object.  Go ahead and display the content.
        }
      }
    //ripped this from jquery.load
    // If successful, inject the HTML into all the matched elements
      if (status === "success" || status === "notmodified") {
        // See if a selector was specified
        element.html(selector ?
          // Create a dummy div to hold the results
          jQuery("<div/>")
            // inject the contents of the document in, removing the scripts
            // to avoid any 'Permission Denied' errors in IE
            // JS: jslint doesn't like the dot in the regex, but don't know why.
            // This is ripped from jQuery core directly.
          .append(res.replace(new RegExp('<script(.|\\s)*?\\/script>', 'g'), ""))

            // Locate the specified elements
            .find(selector) :

          // If not, just inject the full result
          res);
      }
      if (callback) {
        callback(res, status);
      }
    }, null, {'dataType': 'html', async: !sync});
};

/**
 * Make sure that spurious console.log messages don't cause javascript errors.
 * Also, warn developers away from using console.log.  This function replaces
 * the console.log method with one that indicates the debug framework should
 * be used instead.
 */
ThemeBuilder.replaceLogging = function () {
  if (window.console) {
    if (window.console.log) {
      ThemeBuilder.log = window.console.log;
    }
  }
  else {
    window.console = {};
  }
  window.console.log = ThemeBuilder._oldConsoleLog;
  if (debug && debug.setCallback) {
    debug.setCallback(ThemeBuilder.logCallback, true);
  }
};

/**
 * This is the function with which the console.log function will be replaced.
 * This function treats any log message as a warning and prefixes a developer
 * message to steer folks in the right direction.
 */
ThemeBuilder._oldConsoleLog = function () {
  var args = [];
  for (var i = 0; i < arguments.length; i++) {
    args.push(arguments[i]);
  }
};

/**
 * This is the callback that will be called to facilitate logging.  Currently
 * the log message will only appear if the console is enabled.
 */
ThemeBuilder.logCallback = function () {
  try {
    if (ThemeBuilder.log) {
      ThemeBuilder.log(arguments);
    }
  }
  catch (e) {
  }
};

// Replace the console.log facility with debug.
ThemeBuilder.replaceLogging();

// IE still has no Array.indexOf method.  Provide one for compatibility.
if (!Array.indexOf) {
  Array.prototype.indexOf = function (obj) {
    for (var i = 0; i < this.length; i++) {
      if (this[i] === obj) {
        return i;
      }
    }
    return -1;
  };
}

/**
 * Error handlers to be used when error_callback is not specified in ajax operations
 * 
 * @namespace
 * @see ThemeBuilder.handlerError()
 */
ThemeBuilder.errorHandler = ThemeBuilder.errorHandler || {};

/**
 * @see ThemeBulder.handleError
 */
ThemeBuilder.errorHandler.logSilently = function (data, type, errorThrown) {
  ThemeBuilder.logCallback(data);
};

/**
 * @see ThemeBulder.handleError
 */
ThemeBuilder.errorHandler.alertAndClose = function (data, type, errorThrown) {
  var message = '';
  if (data.message) {
    message = data.message;
  }
  else {
    message = Drupal.t("Oops! something just happened and we're not sure what to do about it. The error has been logged, and we apologize for any inconvenience."); 
  }
  
  alert(message);
  var bar = ThemeBuilder.Bar.getInstance();
  bar.exit();
};

/**
 * A ThemeBuilder exception handler that displays a message to the user but
 * allows them to continue.  Note that the postBack call tha sends the request
 * must be passed an error handler function that actually handles the error by
 * calling ThemeBuilder.handleError(data, data.type, 'recoverableError') in
 * order for this scheme to work.  This callback gives you the opportunity to
 * correct the user interface state for the failed request.
 *
 * @param data
 *   The data object resulting from the request.
 * @param type
 *   The data.type field
 * @param {String} errorThrown
 *   Should be 'recoverableError'
 */
ThemeBuilder.errorHandler.alert = function (data, type, errorThrown) {
  var message = '';
  if (data.message) {
    alert(data.message);
  }
  var bar = ThemeBuilder.Bar.getInstance();
  bar.hideWaitIndicator();
};

/**
 * Returns true if we are currently running in development mode.
 *
 * In development mode we might run additional code to make error
 * conditions more prominent, but this would not be appropriate for
 * production mode.
 *
 * @return {boolean}
 *   TRUE if development mode is on; FALSE otherwise.
 */
ThemeBuilder.isDevelMode = function () {
  return true === Drupal.settings.gardensDevel;
};
;
/*jslint bitwise: true, eqeqeq: true, immed: true, newcap: true, nomen: false,
 onevar: false, plusplus: false, regexp: true, undef: true, white: true, indent: 2
 browser: true */

/*global jQuery: true Drupal: true ThemeBuilder: true*/

/**
 * @namespace
 */
ThemeBuilder.util = ThemeBuilder.util || {};

/**
 * Stops the specified event.  This is meant to be used as a callback for anything that generates events.
 *
 * usage:
 *  somecallBack = function(event){
 *    // do stuff
 *    return Themebuilder.util.stopEvent(event);
 *  };
 *
 * @param {event} event
 *   The event.
 */
ThemeBuilder.util.stopEvent = function (event) {
  if (event) {
    if (event.preventDefault) {
      event.preventDefault();
    }
    if (event.stopPropagation) {
      event.stopPropagation();
    }
  }
  return false;
};

/**
 * Capitalize the first letter in the specified string and force the rest to lowercase.
 *
 * @param {string} str
 *   The string to manipulate
 *
 * @return
 *   The modified string.
 */
ThemeBuilder.util.capitalize = function (str) {
  return str.charAt(0).toUpperCase() + str.substr(1).toLowerCase();
};

/**
 * Make a string into an acceptable CSS class name.
 *
 * @param {string} str
 *   The string to be munged.
 * @return {string}
 *   The class name.
 */
ThemeBuilder.util.getSafeClassName = function (str) {
  // Only alphanumeric, _, and - allowed.
  // TODO: Get rid of anything but an alpha character at the beginning.
  var class_name = str.toString().replace(new RegExp("[^a-zA-Z0-9_-]", 'g'), "-");
  return class_name;
};

ThemeBuilder.util.themeLabelToName = function (label) {
  var separator = '_';
  var machine_name = label.toLowerCase().replace(/[^a-z0-9_]+/g, separator);

  if (machine_name.length === 0) {
    machine_name = 'untitled';
  }
  if (machine_name.length > 25) {
    machine_name = machine_name.substring(0, 25);
  }
  return 'acq_' + machine_name;
};

/**
 * Test whether an input is a valid number.
 *
 * Code adapted from http://stackoverflow.com/questions/18082/validate-numbers-in-javascript-isnumeric
 */
ThemeBuilder.util.isNumeric = function (input) {
  return !isNaN(Number(input)) && ('' + input).length > 0;
};

/**
 * Takes the specified value and returns an object that breaks it into its components.  For example, a value of "100px" will result in an object:
 *
 * result = {number: '100', units: 'px'};
 *
 * @param {String} value
 *   The css value.
 * @param {String} defaultValue
 *   The value to use if the specified value is undefined.
 * @return
 *   An object with fields for each value component.
 */
ThemeBuilder.util.parseCssValue = function (value, defaultValue) {
  var result = {};
  if (!value) {
    value = defaultValue;
  }
  var matches = value.match(/^\s*(-?\d*\.?\d*)?(\S*)?/);
  if (matches[1]) {
    result.number = matches[1];
    if (matches[2]) {
      result.units = matches[2];
    }
  }
  else {
    result.value = matches[2];
  }
  return result;
};

/**
 * Returns a selector that represents the specified css selector with all pseudoclasses that describe the element's state (as opposed to its identification) removed.
 *
 * For example, :hover, :link, :active, and :visited
 * would be removed.  This is helpful for displaying the selected elements
 * without requiring that those elements be in the configured state.
 *
 * @param {String} selector
 *   The css selector.
 * @return
 *   A string containing an equivalent css selector with all pseudoclasses
 *   that describe the element's state removed.
 */
ThemeBuilder.util.removeStatePseudoClasses = function (selector) {
  var result = selector.replace(/:+link|:+visited|:+hover|:+active/gi, '');
  return result;
};

/**
 * Indicates whether the specified css selector contains one or more pseudoclasses that would describe an element's state.
 *
 * @param {String} selector
 *   The css selector.
 * @return
 *   true if the specified selector contains pseudoclasses that describe an
 *   element's state; false otherwise.
 */
ThemeBuilder.util.hasStatePseudoClasses = function (selector) {
  var result = selector.match(/(:+link|:+visited|:+hover|:+active)/i);
  return (result && result.length > 0);
};

/**
 * Returns a selector that represents the specified css selector with all pseudoclasses removed.
 *
 * @param {String} selector
 *   The css selector.
 * @return
 *   A string containing an equivalent css selector with all pseudoclasses *
 *   removed.
 */
ThemeBuilder.util.removePseudoClasses = function (selector) {
  var result = selector.replace(/:+\S*/g, '');
  return result;
};

/**
 * Indicates whether the specified css selector contains one or more pseudoclasses.
 *
 * @param {String} selector
 *   The css selector.
 * @return
 *   true if the specified selector contains pseudoclasses; false otherwise.
 */
ThemeBuilder.util.hasPseudoClasses = function (selector) {
  var result = selector.match(/:+\S*/);
  return (result && result.length > 0);
};

/**
 * Returns the first pseudoclass from the specified css selector.  Only the name (not the colon) is returned.
 *
 * @param {String} selector
 *   The css selector.
 * @return
 *   The pseudoclass if present, otherwise ''.
 */
ThemeBuilder.util.getPseudoClass = function (selector) {
  var result = '';
  var matches = selector.match(/:+(\S*)/, '');
  if (matches && matches.length > 1) {
    result = matches[1];
  }
  return result;
};

/**
 * Returns the last child of element that is not of type TextNode.
 *
 * Note that many browsers convert '\n' characters in the markup to
 * TextNode elements, which makes the simple act of discovering the
 * last child a bit more * complex.
 *
 * @param {DomElement} element
 *   The element.
 * @return
 *   The last child of the specified element that is not a TextNode.  If the
 *   specified element does not have children, undefined is returned.
 */
ThemeBuilder.util.getLastChild = function (element) {
  var children = element.childNodes;
  var index = children.length - 1;
  var lastChild = children[index];
  while (lastChild.nodeType === 3 && index > 0) {
    lastChild = children[--index];
  }
  return lastChild;
};

/**
 * Determines whether the specified text is html markup or not.
 *
 * @param {String} text
 *   A string.
 * @return
 *   true if the string represents html markup; false otherwise.
 */
ThemeBuilder.util.isHtmlMarkup = function (text) {
  var result = false;
  // Simple test to determine whether this is html markup or perhaps
  // an exception that was thrown.
  text = ThemeBuilder.util.trim(text);
  if (text && text.length > 0 && text.indexOf('<') === 0 && text.charAt(text.length - 1) === '>') {
    result = true;
  }
  return result;
};

/**
 * Efficiently trims the whitespace from the beginning and end of the specified string.
 *
 * This function is more efficient than the typical trim function
 * because it avoids using a regular expression to do the work.
 * Regular expressions can be inefficient at detecting patterns at the
 * end of a string because typically the entire string is evaluated.
 *
 * This function is useful for triming large strings for which the
 * regular expression method would be significantly less efficient
 * than directly indexing into the string.
 *
 * @param {String} str
 *   The string to trim.
 * @return
 *   The trimmed string.
 */
ThemeBuilder.util.trim = function (str) {
  var whitespace = ' \n\r\t\f\x0b\xa0\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u200b\u2028\u2029\u3000';
  var begin = 0;
  var end = str.length;
  for (var i = 0; i < str.length; i++) {
    begin = i;
    if (whitespace.indexOf(str.charAt(i)) === -1) {
      break;
    }
  }
  for (i = str.length - 1; i >= begin - 1; i--) {
    end = i + 1;
    if (whitespace.indexOf(str.charAt(i)) === -1) {
      break;
    }
  }
  if (begin > 0 || end < str.length) {
    if (begin < end) {
      str = str.substring(begin, end);
    }
    else {
      str = '';
    }
  }
  return str;
};

/**
 * Takes two Unix timestamps (seconds since epoch) 
 * and returns time difference in a nice form.
 * 
 * @return {String}
 *   The time difference.
 */
ThemeBuilder.util.niceTime = function (timeCurrent, timePrevious) { 
  // Set up some constants to make things look nice : these are all in terms of seconds. (duh.)
  var sec = 1;
  var min = sec * 60;
  var hour = min * 60;
  var day = hour * 24;
  var month = day * 30;
  
  // calculate the difference in time we'll be describing.
  var timeDelta = timeCurrent - timePrevious;
  var phrase = '';
  
  // Figure out what unit to describe the time difference in: seconds, minutes, hours, or days.
  if (timeDelta < min) {
    phrase = (timeDelta >= sec * 2) ? timeDelta + Drupal.t(' seconds ago') : Drupal.t('a second ago');
  } else if (timeDelta < hour) {
    phrase = (timeDelta >= min * 2) ? Math.floor(timeDelta / min) + Drupal.t(' minutes ago') : Drupal.t('a minute ago');
  } else if (timeDelta < day) {
    phrase = (timeDelta >= hour * 2) ? Math.floor(timeDelta / hour) + Drupal.t(' hours ago') : Drupal.t('an hour ago');
  } else if (timeDelta < month) {
    phrase = (timeDelta >= day * 2) ? Math.floor(timeDelta / day) + Drupal.t(' days ago') : Drupal.t('a day ago');
  } else if (timePrevious > 0) {
    // If the theme is older than 30 days, print the date.
    var d = new Date(timePrevious * 1000);
    phrase = d.getMonth() + 1;
    phrase += '/' + d.getDate();
    phrase += '/' + d.getFullYear();
  }
  else {
    // If there is no date data.
    phrase = Drupal.t('moments ago');
  }
  
  return phrase;
};

/**
 * Sets the application-wide notion of the current selector.
 * 
 * This is set in the Styles tab and the Advanced->Styles CSS subtab,
 * and provides a mechanism through which this state can be easily
 * shared among objects that have no other interdependencies.
 * 
 * @return {String}
 *   The selector.
 */
ThemeBuilder.util.getSelector = function () {
  if (Drupal && Drupal.settings && Drupal.settings.ThemeBuilder) {
    return Drupal.settings.ThemeBuilder.currentSelector;
  }
};

/**
 * Sets the current selector.
 * 
 * @param {String}
 *   The selector.
 */
ThemeBuilder.util.setSelector = function (selector) {
  if (Drupal && Drupal.settings) {
    Drupal.settings.ThemeBuilder = Drupal.settings.ThemeBuilder || {};
    Drupal.settings.ThemeBuilder.currentSelector = selector;
  }
};
;

/*jslint bitwise: true, eqeqeq: true, immed: true, newcap: true, nomen: false,
 onevar: false, plusplus: false, regexp: true, undef: true, white: true, indent: 2
 browser: true */

/*global jQuery: true Drupal: true ThemeBuilder: true*/

/**
 * The Application object maintains client-side application state for
 * the themebuilder and can receive updates to the data on each ajax
 * request.
 * 
 * Note that Application is implemented as a singleton, so use
 * ThemeBuilder.getApplicationInstance() to get the only instance.
 * 
 * @class
 * @constructor
 */
ThemeBuilder.Application = ThemeBuilder.initClass();

/**
 * The version of the JavaScript code comprising the ThemeBuilder.
 *
 * This version is used to determine if a cache clear is required to
 * make the client compatible with the server.
 *
 * Whenever a modification is done to the ThemeBuilder JavaScript
 * code, a cache clear is required.  The individual sites can perform
 * a cache clear as needed by incrementing this version string and the
 * version string in themebuilder_compiler.module (search for
 * 'THEME_BUILDER_JAVASCRIPT_VERSION').  The php version string is sent
 * to the client via Drupal.settings.themebuilderJavaScriptVersion.
 * That version is compared to the one here, and any difference will
 * cause a cache clear to be performed, followed by a page refresh.
 */
ThemeBuilder.Application.version = '1.00.6';

/**
 * Constructor for the Application class.  The Application class is meant to
 * be a singleton, and the constructor enforces that behavior.
 */
ThemeBuilder.Application.prototype.initialize = function () {
  if (ThemeBuilder.Application._instance) {
    throw ('Application is a singleton, please use ThemeBuilder.getApplicationInstance().');
  }

  this.initFunctions = [];
  this.updateFunctions = [];
  this.pollingRequests = {};
  this._requestInitData();
};

/**
 * Private method that requests the initial data from the server.
 */
ThemeBuilder.Application.prototype._requestInitData = function () {
  if (!Drupal.settings.themebuilderInitDataPath) {
    // It isn't possible to request the data until the Drupal settings are
    // established.  There is a security token in the settings which is
    // required to perform the request.
    setTimeout(ThemeBuilder.bindIgnoreCallerArgs(this, this._requestInitData), 50);
    return;
  }

  if (Drupal.settings.themebuilderInEditMode === true && Drupal.settings.themebuilderJavaScriptVersion !== ThemeBuilder.Application.version) {
    // The user is editing a theme and client and server are out of
    // sync.  Clear the JavaScript and CSS caches and reload the page.
    var bar = ThemeBuilder.Bar.getInstance();
    ThemeBuilder.postBack(Drupal.settings.themebuilderClearCachePath, {version: ThemeBuilder.Application.version}, ThemeBuilder.bind(ThemeBuilder.bind(this, this._reloadPage), ThemeBuilder.bind(this, this._reloadPage)));
    return;
  }

  // If the themebuilder cannot save drafts, do not bother to start.
  if (!Drupal.settings.themebuilderWritable) {
    throw ('The theme directory does not appear to be writable.');
  }

  // @todo AN-11140 Currently this loads on every request for admins.
  // We should be smarter about this.
  ThemeBuilder.postBack(Drupal.settings.themebuilderInitDataPath, {},
    ThemeBuilder.bind(this, this._initDataReceived));
};

/**
 * Private method used as a callback for the data request.  Any functions that
 * have been registered as interested in the initialization data will be
 * called when the data is received.
 *
 * @param data
 *   The application initialization data.
 */
ThemeBuilder.Application.prototype._initDataReceived = function (data) {
  this.applicationData = data;
  for (var i = 0; i < this.initFunctions.length; i++) {
    this.initFunctions[i](this.applicationData);
  }
  this.initFunctions = [];
};

/**
 * Called when application data updates have arrived.  This method is
 * responsible for updating the application data with the new values
 * and notifying listeners.
 *
 * @param {Object} data
 *   The key/value pairs representing the changed application data.
 */
ThemeBuilder.Application.prototype.updateData = function (data) {
  for (var name in data) {
    if (data.hasOwnProperty(name)) {
      this.applicationData[name] = data[name];
    }
  }
  this.notifyUpdateListeners(data);
};

/**
 * Adds a function that will be called when the application data is received.
 *
 * @param f
 *   The function to call when data is received.
 */
ThemeBuilder.Application.prototype.addApplicationInitializer = function (f) {
  if (this.applicationData) {
    // The application data has already been received.  Invoke the callback,
    // but do so asyncronously.
    setTimeout(ThemeBuilder.bindIgnoreCallerArgs(this, f, this.applicationData), 0);
  }
  else {
    this.initFunctions.push(f);
  }
};

/**
 * Adds a function that will be called when the application data is updated.
 *
 * @param f
 *   The function to call when data is updated.
 *
 */
ThemeBuilder.Application.prototype.addUpdateListener = function (f) {
  this.updateFunctions.push(f);
};

/**
 * Notifies interested listeners that application data has been updated.
 *
 * @param {Object} data
 *   The key/value pairs representing the changed application data.
 */
ThemeBuilder.Application.prototype.notifyUpdateListeners = function (data) {
  for (var i = 0; i < this.updateFunctions.length; i++) {
    this.updateFunctions[i](data);
  }
};

/**
 * Starts polling the server in a separate thread, to trigger server-side tasks.
 *
 * When this function is called, the current themebuilder instance will begin
 * polling the server at a ten second interval, hitting a special URL designed
 * for this purpose. It does so in a separate thread, so that if the tasks
 * being run on the server take a long time to complete, the performance on the
 * client side is not affected.
 *
 * The server-side code can communicate the results of this polling back to the
 * client side using application data updates, so you can listen for results of
 * this polling by adding an update listener to the themebuilder application;
 * see ThemeBuilder.Application.prototype.addUpdateListener(). Overall, this
 * mechanism can be used for server-side code that needs to queue up several
 * long-running tasks that affect the client side, and only alert the client
 * side when some portion of those task are complete.
 *
 * Multiple parts of the themebuilder may request that polling occur, based on
 * local conditions in that part of the themebuilder; these are differentiated
 * using the requestName parameter to this function. Regardless of how many
 * different requests are made, only one polling thread will be maintained;
 * however, the polling thread will not be stopped during this themebuilder
 * instance until *all* such types of polling requests have been specifically
 * requested to stop (or until ThemeBuilder.Application.prototype.forcePollingToStop()
 * is called).
 *
 * @param {String} requestName
 *   A unique name for this type of polling request. This will typically be
 *   based on the part of the themebuilder code that is making the request.
 *   Every time this function is called with a new requestName, it guarantees
 *   that the current themebuilder instance will not stop polling until
 *   ThemeBuilder.Application.prototype.stopPolling() is called with the same
 *   request name.
 */
ThemeBuilder.Application.prototype.startPolling = function (requestName) {
  // Store the name of the request that initiated the polling.
  this.pollingRequests[requestName] = true;

  // Since a specific request was made, we'll hit the server once immediately
  // (so the caller doesn't have to wait up to 10 seconds for their polling to
  // start).
  setTimeout(ThemeBuilder.bind(this, this._pollServer), 0);

  // If we aren't currently polling, start a new thread that polls once per ten
  // seconds.
  if (!this.pollingId) {
    this.pollingId = setInterval(ThemeBuilder.bind(this, this._pollServer), 10000);
  }
};

/**
 * Make a request to stop polling the server.
 *
 * Polling will only actually stop during this themebuilder instance once *all*
 * types of polling requests that were made are specifically asked to stop.
 *
 * If you need to force polling to stop unconditionally, use
 * ThemeBuilder.Application.prototype.forcePollingToStop() rather than this
 * function.
 *
 * @param {String} requestName
 *   The name of the type of polling request that you would like to stop. This
 *   should match what your code passed in when it made the request to start
 *   polling via ThemeBuilder.Application.prototype.startPolling().
 */
ThemeBuilder.Application.prototype.stopPolling = function (requestName) {
  // Remove the name of the request for the list of active polling requests.
  delete this.pollingRequests[requestName];

  // If we are currently polling and there are no more active polling requests,
  // stop polling now.
  if (this.pollingId && !this.pollingRequests.length) {
    clearInterval(this.pollingId);
    delete this.pollingId;
  }
};

/**
 * Force the themebuilder to stop polling the server.
 *
 * This will cause polling to stop regardless of whether there are still active
 * polling requests. In most cases, rather than calling this function you
 * should call ThemeBuilder.Application.prototype.stopPolling() instead, so as
 * not to interfere with other code that may want the polling to continue.
 */
ThemeBuilder.Application.prototype.forcePollingToStop = function () {
  this.pollingRequests = {};
  if (this.pollingId) {
    clearInterval(this.pollingId);
    delete this.pollingId;
  }
};

/**
 * Make an asynchronous polling request to the server.
 */
ThemeBuilder.Application.prototype._pollServer = function () {
  ThemeBuilder.getBack('themebuilder-phone-home');
};

/**
 * Returns the application data if it has already been loaded.
 */
ThemeBuilder.Application.prototype.getData = function () {
  return (this.applicationData);
};

/**
 * Returns an instance of the ThemeBuilder.Settings class that indicates the
 * current themebuilder settings.  This class should be used rather than the
 * raw data from the themebuilder-init-data request because it allows objects
 * to register callbacks when various settings are changed.
 *
 * @return
 *   The themebuilder settings.
 */
ThemeBuilder.Application.prototype.getSettings = function () {
  if (!ThemeBuilder.Settings._instance) {
    var data = this.getData();
    if (!data) {
      throw ('Requested settings before the application initialization data has been received.');
    }
    ThemeBuilder.Settings._instance = new ThemeBuilder.Settings(data.app_settings);
  }
  return ThemeBuilder.Settings._instance;
};

/**
 * Indicates whether we are running in a preproduction configuration or not.
 * 
 * If in preproduction mode, we may have features enabled for testing
 * that we would not have enabled in production.  This value is set in
 * the gardens_preproduction module, which should be enabled for
 * preproduction mode or disabled otherwise.
 * 
 * @return {Boolean}
 *   True if running in preproduction mode; false otherwise.
 */
ThemeBuilder.Application.prototype.preproductionMode = function () {
  return undefined !== Drupal.settings.gardens_preproduction;
};

/**
 * Reloads the page.
 *
 * This is used to refresh the page if the JavaScript version and the
 * ThemeBuilder version do not match.
 *
 * @private
 */
ThemeBuilder.Application.prototype._reloadPage = function () {
  parent.location.reload(true);
};

/**
 * Returns the Application instance.  Application is a singleton, and more than
 * one instantiation of the Application class will result in an exception.
 *
 * @return
 *   The Application instance.
 */
ThemeBuilder.getApplicationInstance = function () {
  if (!ThemeBuilder.Application._instance) {
    ThemeBuilder.Application._instance = new ThemeBuilder.Application();
  }
  return ThemeBuilder.Application._instance;
};
;

/*jslint bitwise: true, eqeqeq: true, immed: true, newcap: true, nomen: false,
 onevar: false, plusplus: false, regexp: true, undef: true, white: true, indent: 2
 browser: true */

/*global jQuery: true Drupal: true ThemeBuilder: true*/

/**
 * This class is provided to simplify complex interactions that
 * involve multiple steps.  An example is collecting a theme name from
 * the user.  In such an interaction, the user must be presented with
 * a dialog that allows them to type the theme name, and depending on
 * the users response and whether the theme already exists, the name
 * may be accepted or the user may be asked for the theme name again
 * or the application may ask for confirmation whether it is ok to
 * overwrite the existing theme.
 * 
 * This sort of interaction is best removed from the client code if
 * possible to keep the entire sequence together.  Further, if we
 * normalize these sorts of interactions we create a repeatable
 * pattern and we should be able to reduce the total amount of code
 * that must be maintained.
 * 
 * This InteractionController is based on a simple finite state
 * machine, which allows the interaction flowchart to be easily
 * understood just by looking at the interaction table rather than
 * sifting through all of the code.  Also the interaction can be
 * modified by adjusting the table.
 * @class
 * @constructor
 */
ThemeBuilder.InteractionController = ThemeBuilder.initClass();

/**
 * Constructor for the InteractionController.
 */
ThemeBuilder.InteractionController.prototype.initialize = function () {
  this.callbacks = {};
  this.table = {};
  
  this.setInteractionTable({
    // Complete the interaction
    interactionDone: 'done',
    interactionFailed: 'fail',
    interactionCanceled: 'cancel'
  });
};

/**
 * Sets the interaction table that drives the behavior of the
 * InteractionController instance.
 * 
 * The table consists of an object in which the key is the name of a
 * state within the interaction and the value is the name of the
 * method that should be called when that state is entered.
 * 
 * Example:
 *  this.setInteractionTable({
 *    // Show the name dialog
 *    begin: 'showNameDialog',
 *    nameAccepted: 'verifyName',
 *    nameCanceled: 'cancel',
 *
 *    // Verify the theme name
 *    nameAlreadyUsed: 'showOverwriteDialog',
 *    nameOk: 'done',
 *
 *    // Theme already exists
 *    overwriteTheme: 'done',
 *    doNotOverwrite: 'showNameDialog'
 *  });
 * 
 * Note that the value is a string and not a function.
 * 
 * Each method that is part of the interaction must have the same
 * method signature:
 * example.showNameDialog = function (data) {
 * ... in which the data parameter is an object that provides
 * information to the function.
 * 
 * Also, note that the methods enumerated in the interaction table do
 * not return values, but rather cause the state to change by calling
 * the event method.
 * 
 * @param {Object} table
 *   The interaction table in which the key is the state name and the
 *   value is a string that contains the name of the method that is
 *   called when the interaction reaches that state.
 */
ThemeBuilder.InteractionController.prototype.setInteractionTable = function (table) {
  if (table) {
    this.table = ThemeBuilder.merge(this.table, table);
  }
};

/**
 * Sets the callbacks for this interaction.  The caller can register
 * methods for 'done' and 'cancel' which will be called when the
 * interaction completes.
 * 
 * @param {Object} callbacks
 *   The callbacks object in which the key is 'done' and/or 'cancel'
 *   with the corresponding value(s) being the callback function.
 */ 
ThemeBuilder.InteractionController.prototype.setCallbacks = function (callbacks) {
  if (callbacks) {
    this.callbacks = ThemeBuilder.merge(this.callbacks, callbacks);
  }
};

/**
 * Starts the interaction.
 * 
 * @param {Object} data
 * An optional argument that can be passed to the method associated
 * with the 'begin' action.
 */
ThemeBuilder.InteractionController.prototype.start = function (data) {
  this.event(data, 'begin');
};

/**
 * Returns the current state of the interaction.
 * 
 * @return {String}
 *   The current state.
 */
ThemeBuilder.InteractionController.prototype.getCurrentState = function () {
  return this.currentState;
};

/**
 * Called when an event occurs, which causes the state of the
 * interaction to change.
 * 
 * Note that the data and eventName parameters must be the last
 * arguments in the list.  This choice was made because this method is
 * often called as an event callback, so the arguments passed directly
 * from the calling code will always come first.
 * 
 * @param {Array} map
 *  (Optional) An array containing property names that will be used to
 *  set the caller parameters into the data object.  This only works
 *  if the map size exactly matches the number of unnamed parameters.
 *  If there are unnamed parameters and no map, the unnamed parameters
 *  will be inserted into an array named 'callData' which is set into
 *  the data object.
 * @param {Object} data
 *   (Optional) Data associated with the event.  If this object is not
 *   provided, an empty object will be used instead.
 * @param {String} eventName
 *   The name of the event.
 */
ThemeBuilder.InteractionController.prototype.event = function (/* The arguments are assigned dynamically - do not specify them here. */) {
  var arglen = arguments.length, map, i, len, data;
  if (arguments.length < 1) {
    throw 'InteractionController.event called without an event name.';
  }
  var eventName = arguments[arglen - 1];

  // Determine whether an argument map is provided
  if (arglen >= 3 && jQuery.isArray(arguments[arglen - 3]) && arguments[arglen - 3].length === arglen - 3) {
    // An argument map has been provided.
    map = arguments[arglen - 3];
  }

  // Determine whether a data object was provided.  If not, use an empty object.
  data = arglen >= 2 ? arguments[arglen - 2] : {};

  // If there are unnamed parameters, add those to the data object.
  if (arglen > 2) {
    if (map) {
      // A map was provided to allow us to populate the resulting
      // object with named properties.
      for (i = 0, len = arglen - 3; i < len; i++) {
        data[map[i]] = arguments[i];
      }
    }
    else {
      // This is suboptimal, but provide the additional arguments as an array.
      data.callData = [];
      for (i = 0, len = arglen - 2; i < len; i++) {
        data.callData.push(arguments[i]);
      }
    }
  }

  // Invoke the action associated with the event name.
  var action = this.table[eventName];
  if (!action) {
    throw 'Could not find a transition associated with ' + eventName + '.';
  }
  if (!this[action]) {
    throw 'Missing function ' + action + ' associated with event ' + eventName + '.';
  }
  this.currentState = eventName;
  this[action](data);
};

/**
 * Helper method that creates an event callback.  Whenever an event
 * occurs, the InteractionController needs to manage the event and call the appropriate
 * methods so the state can be maintained and the flow through the
 * states can be governed by the table.
 * 
 * @param {String} eventName
 *   The name of the event.
 * @param {Object} data
 *   (Optional) The data associated with the event.
 */
ThemeBuilder.InteractionController.prototype.makeEventCallback = function (eventName, data) {
  if (data) {
    return ThemeBuilder.bind(this, this.event, data, eventName);
  }
  else {
    // This is probably being connected with a redirect, so the data
    // will be a callback-time parameter.
    return ThemeBuilder.bind(this, this.event, eventName);
  }
};

/**
 * The callback associated with the final state of this interaction.
 * 
 * @param {Object} data
 *   The data associated with the event.
 */
ThemeBuilder.InteractionController.prototype.done = function (data) {
  if (this.callbacks && this.callbacks.done) {
    this.callbacks.done(data);
  }
};

/**
 * The callback associated with the final state of this interaction.
 * 
 * @param {Object} data
 *   The data associated with the event.
 */
ThemeBuilder.InteractionController.prototype.fail = function (data) {
  if (this.callbacks && this.callbacks.fail) {
    this.callbacks.fail(data);
  }
};

/**
 * The callback associated with the final state of this interaction.
 * 
 * @param {Object} data
 *   The data associated with the event.
 */
ThemeBuilder.InteractionController.prototype.cancel = function (data) {
  if (this.callbacks && this.callbacks.cancel) {
    this.callbacks.cancel(data);
  }
};
;

/*jslint bitwise: true, eqeqeq: true, immed: true, newcap: true, nomen: false,
 onevar: false, plusplus: false, regexp: true, undef: true, white: true, indent: 2
 browser: true */

/*global jQuery: true Drupal: true ThemeBuilder: true*/

/**
 * This class reveals the themebuilder settings and allows other objects to
 * register event listeners that are triggered when the settings are changed.
 * For that reason, this class should be used in preference to raw settings
 * from the themebuider-init-data request for values that represent the
 * settings for the themebuilder (not the theme or data related to the current
 * theming project).
 * @class
 * @constructor
 */
ThemeBuilder.Settings = ThemeBuilder.initClass();

/**
 * Constructor for the Settings class.  Note that this is a singleton to make
 * it difficult to have different parts of the system using different
 * settings.
 *
 * @param {array} settings
 *   The raw settings data from the themebuilder-init-data request.
 */
ThemeBuilder.Settings.prototype.initialize = function (settings) {
  if (ThemeBuilder.Settings._instance) {
    throw ('Settings is a singleton, please use Application.getSettings().');
  }
  this._settings = settings;
  this._settingsChangeListeners = [];
};

/**
 * Indicates whether power theme mode is enabled.
 *
 * @return
 *   True if power theming is enabled; false otherwise.
 */
ThemeBuilder.Settings.prototype.powerThemeEnabled = function () {
  return (this._settings.powerTheme === true || this._settings.powerTheme === 'true');
};

/**
 * Sets power theming mode.
 *
 * @param {boolean} enabled
 *   Whether power theme mode is enabled.
 */
ThemeBuilder.Settings.prototype.setPowerThemeEnabled = function (enabled) {
  if (this._settings.powerTheme !== enabled) {
    this._settings.powerTheme = enabled;
    this.notifyListeners('powerTheme');
    this.saveSettings();
  }
};

/**

 * Indicates whether natural language mode is enabled.  If enabled, the css
 * selector will be described using human readable text.
 *
 * @return
 *   True if natural language mode is enabled; false otherwise.
 */
ThemeBuilder.Settings.prototype.naturalLanguageEnabled = function () {
  return (this._settings.naturalLanguage === true || this._settings.naturalLanguage === 'true');
};

/**
 * Sets the natural language mode.
 *
 * @param {boolean} enabled
 *   Whether natural language mode is enabled.
 */
ThemeBuilder.Settings.prototype.setNaturalLanguageEnabled = function (enabled) {
  if (this._settings.naturalLanguage !== enabled) {
    this._settings.naturalLanguage = enabled;
    this.notifyListeners('naturalLanguage');
    this.saveSettings();
  }
};

/**
 * Adds the specified object as a change listener.  The object should include
 * methods of the form [property]SettingChanged for all properties for which
 * the object is interested.
 */
ThemeBuilder.Settings.prototype.addSettingsChangeListener = function (o) {
  this._settingsChangeListeners.push(o);
};

/**
 * Notifies change listeners that the specified setting has changed.
 *
 * @param {string} setting
 *   The name of the setting that has changed.
 */
ThemeBuilder.Settings.prototype.notifyListeners = function (setting) {
  var len = this._settingsChangeListeners.length;
  for (var i = 0; i < len; i++) {
    var o = this._settingsChangeListeners[i];
    var method = setting + 'SettingChanged';
    if (o[method]) {
      try {
        o[method](this);
      }
      catch (e) {
      }
    }
  }
};

/**
 * Saves settings to the server so they persist after a page refresh.
 */
ThemeBuilder.Settings.prototype.saveSettings = function () {
  ThemeBuilder.postBack(Drupal.settings.themebuilderSaveSettings,
    {settings: this._settings},
    ThemeBuilder.bind(this, this._settingsSaved));
};

/**
 * The callback which is called after the settings have been saved to the
 * server.
 *
 * @param {array} data
 *   The data resulting from the save request.
 */
ThemeBuilder.Settings.prototype._settingsSaved = function (data) {
};
;
/*jslint bitwise: true, eqeqeq: true, immed: true, newcap: true, nomen: false,
 onevar: false, plusplus: false, regexp: true, undef: true, white: true, indent: 2
 browser: true */

/*global jQuery: true Drupal: true debug: true window: true*/

var ThemeBuilder = ThemeBuilder || {};

/**
 * @namespace
 */
ThemeBuilder.Log = ThemeBuilder.Log || {};

/**
 * The various legal values for log entry levels.
 */
ThemeBuilder.Log.ERROR = 1;
ThemeBuilder.Log.WARNING = 2;
ThemeBuilder.Log.INFO = 3;
ThemeBuilder.Log.TRACE = 7;
ThemeBuilder.Log.TIMING = 9;

/**
 * Logs the specified message as a gardens error.  All such log messages will
 * be alerted through nagios.
 *
 * @param {String} message
 *   The log message.
 * @param {String} info
 *   A string containing any additional info associated with the error.
 */
ThemeBuilder.Log.gardensError = function (message, info) {
  ThemeBuilder.Log.writeLogEntry(ThemeBuilder.Log.ERROR, message, true, info, 'GardensError');
};

/**
 * Logs the specified error message.
 *
 * @param {String} message
 *   The log message.
 * @param {String} info
 *   A string containing any additional info associated with the error.
 */
ThemeBuilder.Log.error = function (message, info) {
  ThemeBuilder.Log.writeLogEntry(ThemeBuilder.Log.ERROR, message, true, info, '');
};

/**
 * Logs a gardens warning message.  These messages will be alerted
 * through nagios, but will have the 'GardensWarning' text to work
 * nicely with the email filters described here: https://i.acquia.com/wiki/gardens-e-mail-alert-system-what-you-should-be-doing
 *
 * @param {String} message
 *   A string containing a static message that is exactly the same
 *   for every single instance of the problem being logged.
 * @param {String} info
 *   A string containing any additional info associated with the error.
 */
ThemeBuilder.Log.gardensWarning = function (message, info) {
  ThemeBuilder.Log.writeLogEntry(ThemeBuilder.Log.ERROR, message, true, info, 'GardensWarning');
};

/**
 * Logs the specified warning message.
 *
 * @param {String} message
 *   The log message.
 * @param {String} info
 *   A string containing any additional info associated with the error.
 */
ThemeBuilder.Log.warning = function (message, info) {
  ThemeBuilder.Log.writeLogEntry(ThemeBuilder.Log.WARNING, message, true, info, '');
};

/**
 * Logs the specified info message.
 *
 * @param {String} message
 *   The log message.
 * @param {String} info
 *   A string containing any additional info associated with the error.
 */
ThemeBuilder.Log.info = function (message, info) {
  ThemeBuilder.Log.writeLogEntry(ThemeBuilder.Log.INFO, message, true, info, '');
};

/**
 * Logs the specified trace message.
 *
 * @param {String} message
 *   The log message.
 */
ThemeBuilder.Log.trace = function (message) {
  ThemeBuilder.Log.writeLogEntry(ThemeBuilder.Log.TRACE, message, false, '', '');
};

/**
 * Logs the specified timing message.
 *
 * @param {String} message
 *   The log message.
 */
ThemeBuilder.Log.timing = function (message) {
  ThemeBuilder.Log.writeLogEntry(ThemeBuilder.Log.TIMING, message, false, '', '');
};

/**
 * Logs the specified message at the specified logging level.
 *
 * @param {int} level
 *   The logging level.
 * @param {String} message
 *   The log message.
 * @param {boolean} includeRequestDetails
 *   If true, request details will be added to the log message to make
 *   following up on the issue easier.
 * @param {String} info
 *   A string containing any additional info associated with the error.
 * @param {boolean} tag
 *   A tag that wraps the static part of the message.  This is used
 *   to aid in parsing the logs.  Example: 'GardensError', or
 *   'GardensWarning'.
 */
ThemeBuilder.Log.writeLogEntry = function (level, message, includeRequestDetails, info, tag) {
  // Only send the log message to the server if the log level is set
  // appropriately.
  if (level <= ThemeBuilder.Log.getLogLevel()) {
    if (false !== includeRequestDetails) {
      includeRequestDetails = true;
    }
    if (!info) {
      info = '';
    }
    if (!tag) {
      tag = '';
    }
    var entry = {level: level, message: message, includeRequestDetails: includeRequestDetails, info: info, tag: tag};
    ThemeBuilder.postBack(Drupal.settings.themebuilderLogPath, {logEntry: entry},
      ThemeBuilder.Log.callback);
    ThemeBuilder.logCallback(message);
  }
};

/**
 * This function is called when the log request returns.
 *
 * @param {Object} data
 *   Any data from the response.
 */
ThemeBuilder.Log.callback = function (data) {
};

/**
 * Returns the current log level, which governs whether log messages are sent
 * to the server.
 *
 * @return
 *   The current log level for this site.
 */
ThemeBuilder.Log.getLogLevel = function () {
  if (!ThemeBuilder.Log.logLevel) {
    var data = ThemeBuilder.getApplicationInstance().getData();
    if (data) {
      // Grab the log level from the application data.
      ThemeBuilder.Log.logLevel = data.logLevel;
    }
    else {
      // If logging messages before the app-data is received, we will assume
      // we should only log error messages.
      return ThemeBuilder.Log.ERROR;
    }
  }
  return ThemeBuilder.Log.logLevel;
};
;

/*
 * jQuery UI Effects Slide 1.8.7
 *
 * Copyright 2010, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Effects/Slide
 *
 * Depends:
 *	jquery.effects.core.js
 */
(function(c){c.effects.slide=function(d){return this.queue(function(){var a=c(this),h=["position","top","left"],f=c.effects.setMode(a,d.options.mode||"show"),b=d.options.direction||"left";c.effects.save(a,h);a.show();c.effects.createWrapper(a).css({overflow:"hidden"});var g=b=="up"||b=="down"?"top":"left";b=b=="up"||b=="left"?"pos":"neg";var e=d.options.distance||(g=="top"?a.outerHeight({margin:true}):a.outerWidth({margin:true}));if(f=="show")a.css(g,b=="pos"?isNaN(e)?"-"+e:-e:e);var i={};i[g]=(f==
"show"?b=="pos"?"+=":"-=":b=="pos"?"-=":"+=")+e;a.animate(i,{queue:false,duration:d.duration,easing:d.options.easing,complete:function(){f=="hide"&&a.hide();c.effects.restore(a,h);c.effects.removeWrapper(a);d.callback&&d.callback.apply(this,arguments);a.dequeue()}})})}})(jQuery);
;

/*
 * jQuery UI Tabs 1.8.7
 *
 * Copyright 2010, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Tabs
 *
 * Depends:
 *	jquery.ui.core.js
 *	jquery.ui.widget.js
 */
(function(d,p){function u(){return++v}function w(){return++x}var v=0,x=0;d.widget("ui.tabs",{options:{add:null,ajaxOptions:null,cache:false,cookie:null,collapsible:false,disable:null,disabled:[],enable:null,event:"click",fx:null,idPrefix:"ui-tabs-",load:null,panelTemplate:"<div></div>",remove:null,select:null,show:null,spinner:"<em>Loading&#8230;</em>",tabTemplate:"<li><a href='#{href}'><span>#{label}</span></a></li>"},_create:function(){this._tabify(true)},_setOption:function(b,e){if(b=="selected")this.options.collapsible&&
e==this.options.selected||this.select(e);else{this.options[b]=e;this._tabify()}},_tabId:function(b){return b.title&&b.title.replace(/\s/g,"_").replace(/[^\w\u00c0-\uFFFF-]/g,"")||this.options.idPrefix+u()},_sanitizeSelector:function(b){return b.replace(/:/g,"\\:")},_cookie:function(){var b=this.cookie||(this.cookie=this.options.cookie.name||"ui-tabs-"+w());return d.cookie.apply(null,[b].concat(d.makeArray(arguments)))},_ui:function(b,e){return{tab:b,panel:e,index:this.anchors.index(b)}},_cleanup:function(){this.lis.filter(".ui-state-processing").removeClass("ui-state-processing").find("span:data(label.tabs)").each(function(){var b=
d(this);b.html(b.data("label.tabs")).removeData("label.tabs")})},_tabify:function(b){function e(g,f){g.css("display","");!d.support.opacity&&f.opacity&&g[0].style.removeAttribute("filter")}var a=this,c=this.options,h=/^#.+/;this.list=this.element.find("ol,ul").eq(0);this.lis=d(" > li:has(a[href])",this.list);this.anchors=this.lis.map(function(){return d("a",this)[0]});this.panels=d([]);this.anchors.each(function(g,f){var i=d(f).attr("href"),l=i.split("#")[0],q;if(l&&(l===location.toString().split("#")[0]||
(q=d("base")[0])&&l===q.href)){i=f.hash;f.href=i}if(h.test(i))a.panels=a.panels.add(a.element.find(a._sanitizeSelector(i)));else if(i&&i!=="#"){d.data(f,"href.tabs",i);d.data(f,"load.tabs",i.replace(/#.*$/,""));i=a._tabId(f);f.href="#"+i;f=a.element.find("#"+i);if(!f.length){f=d(c.panelTemplate).attr("id",i).addClass("ui-tabs-panel ui-widget-content ui-corner-bottom").insertAfter(a.panels[g-1]||a.list);f.data("destroy.tabs",true)}a.panels=a.panels.add(f)}else c.disabled.push(g)});if(b){this.element.addClass("ui-tabs ui-widget ui-widget-content ui-corner-all");
this.list.addClass("ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all");this.lis.addClass("ui-state-default ui-corner-top");this.panels.addClass("ui-tabs-panel ui-widget-content ui-corner-bottom");if(c.selected===p){location.hash&&this.anchors.each(function(g,f){if(f.hash==location.hash){c.selected=g;return false}});if(typeof c.selected!=="number"&&c.cookie)c.selected=parseInt(a._cookie(),10);if(typeof c.selected!=="number"&&this.lis.filter(".ui-tabs-selected").length)c.selected=
this.lis.index(this.lis.filter(".ui-tabs-selected"));c.selected=c.selected||(this.lis.length?0:-1)}else if(c.selected===null)c.selected=-1;c.selected=c.selected>=0&&this.anchors[c.selected]||c.selected<0?c.selected:0;c.disabled=d.unique(c.disabled.concat(d.map(this.lis.filter(".ui-state-disabled"),function(g){return a.lis.index(g)}))).sort();d.inArray(c.selected,c.disabled)!=-1&&c.disabled.splice(d.inArray(c.selected,c.disabled),1);this.panels.addClass("ui-tabs-hide");this.lis.removeClass("ui-tabs-selected ui-state-active");
if(c.selected>=0&&this.anchors.length){a.element.find(a._sanitizeSelector(a.anchors[c.selected].hash)).removeClass("ui-tabs-hide");this.lis.eq(c.selected).addClass("ui-tabs-selected ui-state-active");a.element.queue("tabs",function(){a._trigger("show",null,a._ui(a.anchors[c.selected],a.element.find(a._sanitizeSelector(a.anchors[c.selected].hash))))});this.load(c.selected)}d(window).bind("unload",function(){a.lis.add(a.anchors).unbind(".tabs");a.lis=a.anchors=a.panels=null})}else c.selected=this.lis.index(this.lis.filter(".ui-tabs-selected"));
this.element[c.collapsible?"addClass":"removeClass"]("ui-tabs-collapsible");c.cookie&&this._cookie(c.selected,c.cookie);b=0;for(var j;j=this.lis[b];b++)d(j)[d.inArray(b,c.disabled)!=-1&&!d(j).hasClass("ui-tabs-selected")?"addClass":"removeClass"]("ui-state-disabled");c.cache===false&&this.anchors.removeData("cache.tabs");this.lis.add(this.anchors).unbind(".tabs");if(c.event!=="mouseover"){var k=function(g,f){f.is(":not(.ui-state-disabled)")&&f.addClass("ui-state-"+g)},n=function(g,f){f.removeClass("ui-state-"+
g)};this.lis.bind("mouseover.tabs",function(){k("hover",d(this))});this.lis.bind("mouseout.tabs",function(){n("hover",d(this))});this.anchors.bind("focus.tabs",function(){k("focus",d(this).closest("li"))});this.anchors.bind("blur.tabs",function(){n("focus",d(this).closest("li"))})}var m,o;if(c.fx)if(d.isArray(c.fx)){m=c.fx[0];o=c.fx[1]}else m=o=c.fx;var r=o?function(g,f){d(g).closest("li").addClass("ui-tabs-selected ui-state-active");f.hide().removeClass("ui-tabs-hide").animate(o,o.duration||"normal",
function(){e(f,o);a._trigger("show",null,a._ui(g,f[0]))})}:function(g,f){d(g).closest("li").addClass("ui-tabs-selected ui-state-active");f.removeClass("ui-tabs-hide");a._trigger("show",null,a._ui(g,f[0]))},s=m?function(g,f){f.animate(m,m.duration||"normal",function(){a.lis.removeClass("ui-tabs-selected ui-state-active");f.addClass("ui-tabs-hide");e(f,m);a.element.dequeue("tabs")})}:function(g,f){a.lis.removeClass("ui-tabs-selected ui-state-active");f.addClass("ui-tabs-hide");a.element.dequeue("tabs")};
this.anchors.bind(c.event+".tabs",function(){var g=this,f=d(g).closest("li"),i=a.panels.filter(":not(.ui-tabs-hide)"),l=a.element.find(a._sanitizeSelector(g.hash));if(f.hasClass("ui-tabs-selected")&&!c.collapsible||f.hasClass("ui-state-disabled")||f.hasClass("ui-state-processing")||a.panels.filter(":animated").length||a._trigger("select",null,a._ui(this,l[0]))===false){this.blur();return false}c.selected=a.anchors.index(this);a.abort();if(c.collapsible)if(f.hasClass("ui-tabs-selected")){c.selected=
-1;c.cookie&&a._cookie(c.selected,c.cookie);a.element.queue("tabs",function(){s(g,i)}).dequeue("tabs");this.blur();return false}else if(!i.length){c.cookie&&a._cookie(c.selected,c.cookie);a.element.queue("tabs",function(){r(g,l)});a.load(a.anchors.index(this));this.blur();return false}c.cookie&&a._cookie(c.selected,c.cookie);if(l.length){i.length&&a.element.queue("tabs",function(){s(g,i)});a.element.queue("tabs",function(){r(g,l)});a.load(a.anchors.index(this))}else throw"jQuery UI Tabs: Mismatching fragment identifier.";
d.browser.msie&&this.blur()});this.anchors.bind("click.tabs",function(){return false})},_getIndex:function(b){if(typeof b=="string")b=this.anchors.index(this.anchors.filter("[href$="+b+"]"));return b},destroy:function(){var b=this.options;this.abort();this.element.unbind(".tabs").removeClass("ui-tabs ui-widget ui-widget-content ui-corner-all ui-tabs-collapsible").removeData("tabs");this.list.removeClass("ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all");this.anchors.each(function(){var e=
d.data(this,"href.tabs");if(e)this.href=e;var a=d(this).unbind(".tabs");d.each(["href","load","cache"],function(c,h){a.removeData(h+".tabs")})});this.lis.unbind(".tabs").add(this.panels).each(function(){d.data(this,"destroy.tabs")?d(this).remove():d(this).removeClass("ui-state-default ui-corner-top ui-tabs-selected ui-state-active ui-state-hover ui-state-focus ui-state-disabled ui-tabs-panel ui-widget-content ui-corner-bottom ui-tabs-hide")});b.cookie&&this._cookie(null,b.cookie);return this},add:function(b,
e,a){if(a===p)a=this.anchors.length;var c=this,h=this.options;e=d(h.tabTemplate.replace(/#\{href\}/g,b).replace(/#\{label\}/g,e));b=!b.indexOf("#")?b.replace("#",""):this._tabId(d("a",e)[0]);e.addClass("ui-state-default ui-corner-top").data("destroy.tabs",true);var j=c.element.find("#"+b);j.length||(j=d(h.panelTemplate).attr("id",b).data("destroy.tabs",true));j.addClass("ui-tabs-panel ui-widget-content ui-corner-bottom ui-tabs-hide");if(a>=this.lis.length){e.appendTo(this.list);j.appendTo(this.list[0].parentNode)}else{e.insertBefore(this.lis[a]);
j.insertBefore(this.panels[a])}h.disabled=d.map(h.disabled,function(k){return k>=a?++k:k});this._tabify();if(this.anchors.length==1){h.selected=0;e.addClass("ui-tabs-selected ui-state-active");j.removeClass("ui-tabs-hide");this.element.queue("tabs",function(){c._trigger("show",null,c._ui(c.anchors[0],c.panels[0]))});this.load(0)}this._trigger("add",null,this._ui(this.anchors[a],this.panels[a]));return this},remove:function(b){b=this._getIndex(b);var e=this.options,a=this.lis.eq(b).remove(),c=this.panels.eq(b).remove();
if(a.hasClass("ui-tabs-selected")&&this.anchors.length>1)this.select(b+(b+1<this.anchors.length?1:-1));e.disabled=d.map(d.grep(e.disabled,function(h){return h!=b}),function(h){return h>=b?--h:h});this._tabify();this._trigger("remove",null,this._ui(a.find("a")[0],c[0]));return this},enable:function(b){b=this._getIndex(b);var e=this.options;if(d.inArray(b,e.disabled)!=-1){this.lis.eq(b).removeClass("ui-state-disabled");e.disabled=d.grep(e.disabled,function(a){return a!=b});this._trigger("enable",null,
this._ui(this.anchors[b],this.panels[b]));return this}},disable:function(b){b=this._getIndex(b);var e=this.options;if(b!=e.selected){this.lis.eq(b).addClass("ui-state-disabled");e.disabled.push(b);e.disabled.sort();this._trigger("disable",null,this._ui(this.anchors[b],this.panels[b]))}return this},select:function(b){b=this._getIndex(b);if(b==-1)if(this.options.collapsible&&this.options.selected!=-1)b=this.options.selected;else return this;this.anchors.eq(b).trigger(this.options.event+".tabs");return this},
load:function(b){b=this._getIndex(b);var e=this,a=this.options,c=this.anchors.eq(b)[0],h=d.data(c,"load.tabs");this.abort();if(!h||this.element.queue("tabs").length!==0&&d.data(c,"cache.tabs"))this.element.dequeue("tabs");else{this.lis.eq(b).addClass("ui-state-processing");if(a.spinner){var j=d("span",c);j.data("label.tabs",j.html()).html(a.spinner)}this.xhr=d.ajax(d.extend({},a.ajaxOptions,{url:h,success:function(k,n){e.element.find(e._sanitizeSelector(c.hash)).html(k);e._cleanup();a.cache&&d.data(c,
"cache.tabs",true);e._trigger("load",null,e._ui(e.anchors[b],e.panels[b]));try{a.ajaxOptions.success(k,n)}catch(m){}},error:function(k,n){e._cleanup();e._trigger("load",null,e._ui(e.anchors[b],e.panels[b]));try{a.ajaxOptions.error(k,n,b,c)}catch(m){}}}));e.element.dequeue("tabs");return this}},abort:function(){this.element.queue([]);this.panels.stop(false,true);this.element.queue("tabs",this.element.queue("tabs").splice(-2,2));if(this.xhr){this.xhr.abort();delete this.xhr}this._cleanup();return this},
url:function(b,e){this.anchors.eq(b).removeData("cache.tabs").data("load.tabs",e);return this},length:function(){return this.anchors.length}});d.extend(d.ui.tabs,{version:"1.8.7"});d.extend(d.ui.tabs.prototype,{rotation:null,rotate:function(b,e){var a=this,c=this.options,h=a._rotate||(a._rotate=function(j){clearTimeout(a.rotation);a.rotation=setTimeout(function(){var k=c.selected;a.select(++k<a.anchors.length?k:0)},b);j&&j.stopPropagation()});e=a._unrotate||(a._unrotate=!e?function(j){j.clientX&&
a.rotate(null)}:function(){t=c.selected;h()});if(b){this.element.bind("tabsshow",h);this.anchors.bind(c.event+".tabs",e);h()}else{clearTimeout(a.rotation);this.element.unbind("tabsshow",h);this.anchors.unbind(c.event+".tabs",e);delete this._rotate;delete this._unrotate}return this}})})(jQuery);
;

/*
 * jQuery UI Slider 1.8.7
 *
 * Copyright 2010, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Slider
 *
 * Depends:
 *	jquery.ui.core.js
 *	jquery.ui.mouse.js
 *	jquery.ui.widget.js
 */
(function(d){d.widget("ui.slider",d.ui.mouse,{widgetEventPrefix:"slide",options:{animate:false,distance:0,max:100,min:0,orientation:"horizontal",range:false,step:1,value:0,values:null},_create:function(){var b=this,a=this.options;this._mouseSliding=this._keySliding=false;this._animateOff=true;this._handleIndex=null;this._detectOrientation();this._mouseInit();this.element.addClass("ui-slider ui-slider-"+this.orientation+" ui-widget ui-widget-content ui-corner-all");a.disabled&&this.element.addClass("ui-slider-disabled ui-disabled");
this.range=d([]);if(a.range){if(a.range===true){this.range=d("<div></div>");if(!a.values)a.values=[this._valueMin(),this._valueMin()];if(a.values.length&&a.values.length!==2)a.values=[a.values[0],a.values[0]]}else this.range=d("<div></div>");this.range.appendTo(this.element).addClass("ui-slider-range");if(a.range==="min"||a.range==="max")this.range.addClass("ui-slider-range-"+a.range);this.range.addClass("ui-widget-header")}d(".ui-slider-handle",this.element).length===0&&d("<a href='#'></a>").appendTo(this.element).addClass("ui-slider-handle");
if(a.values&&a.values.length)for(;d(".ui-slider-handle",this.element).length<a.values.length;)d("<a href='#'></a>").appendTo(this.element).addClass("ui-slider-handle");this.handles=d(".ui-slider-handle",this.element).addClass("ui-state-default ui-corner-all");this.handle=this.handles.eq(0);this.handles.add(this.range).filter("a").click(function(c){c.preventDefault()}).hover(function(){a.disabled||d(this).addClass("ui-state-hover")},function(){d(this).removeClass("ui-state-hover")}).focus(function(){if(a.disabled)d(this).blur();
else{d(".ui-slider .ui-state-focus").removeClass("ui-state-focus");d(this).addClass("ui-state-focus")}}).blur(function(){d(this).removeClass("ui-state-focus")});this.handles.each(function(c){d(this).data("index.ui-slider-handle",c)});this.handles.keydown(function(c){var e=true,f=d(this).data("index.ui-slider-handle"),h,g,i;if(!b.options.disabled){switch(c.keyCode){case d.ui.keyCode.HOME:case d.ui.keyCode.END:case d.ui.keyCode.PAGE_UP:case d.ui.keyCode.PAGE_DOWN:case d.ui.keyCode.UP:case d.ui.keyCode.RIGHT:case d.ui.keyCode.DOWN:case d.ui.keyCode.LEFT:e=
false;if(!b._keySliding){b._keySliding=true;d(this).addClass("ui-state-active");h=b._start(c,f);if(h===false)return}break}i=b.options.step;h=b.options.values&&b.options.values.length?(g=b.values(f)):(g=b.value());switch(c.keyCode){case d.ui.keyCode.HOME:g=b._valueMin();break;case d.ui.keyCode.END:g=b._valueMax();break;case d.ui.keyCode.PAGE_UP:g=b._trimAlignValue(h+(b._valueMax()-b._valueMin())/5);break;case d.ui.keyCode.PAGE_DOWN:g=b._trimAlignValue(h-(b._valueMax()-b._valueMin())/5);break;case d.ui.keyCode.UP:case d.ui.keyCode.RIGHT:if(h===
b._valueMax())return;g=b._trimAlignValue(h+i);break;case d.ui.keyCode.DOWN:case d.ui.keyCode.LEFT:if(h===b._valueMin())return;g=b._trimAlignValue(h-i);break}b._slide(c,f,g);return e}}).keyup(function(c){var e=d(this).data("index.ui-slider-handle");if(b._keySliding){b._keySliding=false;b._stop(c,e);b._change(c,e);d(this).removeClass("ui-state-active")}});this._refreshValue();this._animateOff=false},destroy:function(){this.handles.remove();this.range.remove();this.element.removeClass("ui-slider ui-slider-horizontal ui-slider-vertical ui-slider-disabled ui-widget ui-widget-content ui-corner-all").removeData("slider").unbind(".slider");
this._mouseDestroy();return this},_mouseCapture:function(b){var a=this.options,c,e,f,h,g;if(a.disabled)return false;this.elementSize={width:this.element.outerWidth(),height:this.element.outerHeight()};this.elementOffset=this.element.offset();c=this._normValueFromMouse({x:b.pageX,y:b.pageY});e=this._valueMax()-this._valueMin()+1;h=this;this.handles.each(function(i){var j=Math.abs(c-h.values(i));if(e>j){e=j;f=d(this);g=i}});if(a.range===true&&this.values(1)===a.min){g+=1;f=d(this.handles[g])}if(this._start(b,
g)===false)return false;this._mouseSliding=true;h._handleIndex=g;f.addClass("ui-state-active").focus();a=f.offset();this._clickOffset=!d(b.target).parents().andSelf().is(".ui-slider-handle")?{left:0,top:0}:{left:b.pageX-a.left-f.width()/2,top:b.pageY-a.top-f.height()/2-(parseInt(f.css("borderTopWidth"),10)||0)-(parseInt(f.css("borderBottomWidth"),10)||0)+(parseInt(f.css("marginTop"),10)||0)};this.handles.hasClass("ui-state-hover")||this._slide(b,g,c);return this._animateOff=true},_mouseStart:function(){return true},
_mouseDrag:function(b){var a=this._normValueFromMouse({x:b.pageX,y:b.pageY});this._slide(b,this._handleIndex,a);return false},_mouseStop:function(b){this.handles.removeClass("ui-state-active");this._mouseSliding=false;this._stop(b,this._handleIndex);this._change(b,this._handleIndex);this._clickOffset=this._handleIndex=null;return this._animateOff=false},_detectOrientation:function(){this.orientation=this.options.orientation==="vertical"?"vertical":"horizontal"},_normValueFromMouse:function(b){var a;
if(this.orientation==="horizontal"){a=this.elementSize.width;b=b.x-this.elementOffset.left-(this._clickOffset?this._clickOffset.left:0)}else{a=this.elementSize.height;b=b.y-this.elementOffset.top-(this._clickOffset?this._clickOffset.top:0)}a=b/a;if(a>1)a=1;if(a<0)a=0;if(this.orientation==="vertical")a=1-a;b=this._valueMax()-this._valueMin();return this._trimAlignValue(this._valueMin()+a*b)},_start:function(b,a){var c={handle:this.handles[a],value:this.value()};if(this.options.values&&this.options.values.length){c.value=
this.values(a);c.values=this.values()}return this._trigger("start",b,c)},_slide:function(b,a,c){var e;if(this.options.values&&this.options.values.length){e=this.values(a?0:1);if(this.options.values.length===2&&this.options.range===true&&(a===0&&c>e||a===1&&c<e))c=e;if(c!==this.values(a)){e=this.values();e[a]=c;b=this._trigger("slide",b,{handle:this.handles[a],value:c,values:e});this.values(a?0:1);b!==false&&this.values(a,c,true)}}else if(c!==this.value()){b=this._trigger("slide",b,{handle:this.handles[a],
value:c});b!==false&&this.value(c)}},_stop:function(b,a){var c={handle:this.handles[a],value:this.value()};if(this.options.values&&this.options.values.length){c.value=this.values(a);c.values=this.values()}this._trigger("stop",b,c)},_change:function(b,a){if(!this._keySliding&&!this._mouseSliding){var c={handle:this.handles[a],value:this.value()};if(this.options.values&&this.options.values.length){c.value=this.values(a);c.values=this.values()}this._trigger("change",b,c)}},value:function(b){if(arguments.length){this.options.value=
this._trimAlignValue(b);this._refreshValue();this._change(null,0)}return this._value()},values:function(b,a){var c,e,f;if(arguments.length>1){this.options.values[b]=this._trimAlignValue(a);this._refreshValue();this._change(null,b)}if(arguments.length)if(d.isArray(arguments[0])){c=this.options.values;e=arguments[0];for(f=0;f<c.length;f+=1){c[f]=this._trimAlignValue(e[f]);this._change(null,f)}this._refreshValue()}else return this.options.values&&this.options.values.length?this._values(b):this.value();
else return this._values()},_setOption:function(b,a){var c,e=0;if(d.isArray(this.options.values))e=this.options.values.length;d.Widget.prototype._setOption.apply(this,arguments);switch(b){case "disabled":if(a){this.handles.filter(".ui-state-focus").blur();this.handles.removeClass("ui-state-hover");this.handles.attr("disabled","disabled");this.element.addClass("ui-disabled")}else{this.handles.removeAttr("disabled");this.element.removeClass("ui-disabled")}break;case "orientation":this._detectOrientation();
this.element.removeClass("ui-slider-horizontal ui-slider-vertical").addClass("ui-slider-"+this.orientation);this._refreshValue();break;case "value":this._animateOff=true;this._refreshValue();this._change(null,0);this._animateOff=false;break;case "values":this._animateOff=true;this._refreshValue();for(c=0;c<e;c+=1)this._change(null,c);this._animateOff=false;break}},_value:function(){var b=this.options.value;return b=this._trimAlignValue(b)},_values:function(b){var a,c;if(arguments.length){a=this.options.values[b];
return a=this._trimAlignValue(a)}else{a=this.options.values.slice();for(c=0;c<a.length;c+=1)a[c]=this._trimAlignValue(a[c]);return a}},_trimAlignValue:function(b){if(b<=this._valueMin())return this._valueMin();if(b>=this._valueMax())return this._valueMax();var a=this.options.step>0?this.options.step:1,c=(b-this._valueMin())%a;alignValue=b-c;if(Math.abs(c)*2>=a)alignValue+=c>0?a:-a;return parseFloat(alignValue.toFixed(5))},_valueMin:function(){return this.options.min},_valueMax:function(){return this.options.max},
_refreshValue:function(){var b=this.options.range,a=this.options,c=this,e=!this._animateOff?a.animate:false,f,h={},g,i,j,l;if(this.options.values&&this.options.values.length)this.handles.each(function(k){f=(c.values(k)-c._valueMin())/(c._valueMax()-c._valueMin())*100;h[c.orientation==="horizontal"?"left":"bottom"]=f+"%";d(this).stop(1,1)[e?"animate":"css"](h,a.animate);if(c.options.range===true)if(c.orientation==="horizontal"){if(k===0)c.range.stop(1,1)[e?"animate":"css"]({left:f+"%"},a.animate);
if(k===1)c.range[e?"animate":"css"]({width:f-g+"%"},{queue:false,duration:a.animate})}else{if(k===0)c.range.stop(1,1)[e?"animate":"css"]({bottom:f+"%"},a.animate);if(k===1)c.range[e?"animate":"css"]({height:f-g+"%"},{queue:false,duration:a.animate})}g=f});else{i=this.value();j=this._valueMin();l=this._valueMax();f=l!==j?(i-j)/(l-j)*100:0;h[c.orientation==="horizontal"?"left":"bottom"]=f+"%";this.handle.stop(1,1)[e?"animate":"css"](h,a.animate);if(b==="min"&&this.orientation==="horizontal")this.range.stop(1,
1)[e?"animate":"css"]({width:f+"%"},a.animate);if(b==="max"&&this.orientation==="horizontal")this.range[e?"animate":"css"]({width:100-f+"%"},{queue:false,duration:a.animate});if(b==="min"&&this.orientation==="vertical")this.range.stop(1,1)[e?"animate":"css"]({height:f+"%"},a.animate);if(b==="max"&&this.orientation==="vertical")this.range[e?"animate":"css"]({height:100-f+"%"},{queue:false,duration:a.animate})}}});d.extend(d.ui.slider,{version:"1.8.7"})})(jQuery);
;

/*
 * jQuery UI Sortable 1.8.7
 *
 * Copyright 2010, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Sortables
 *
 * Depends:
 *	jquery.ui.core.js
 *	jquery.ui.mouse.js
 *	jquery.ui.widget.js
 */
(function(d){d.widget("ui.sortable",d.ui.mouse,{widgetEventPrefix:"sort",options:{appendTo:"parent",axis:false,connectWith:false,containment:false,cursor:"auto",cursorAt:false,dropOnEmpty:true,forcePlaceholderSize:false,forceHelperSize:false,grid:false,handle:false,helper:"original",items:"> *",opacity:false,placeholder:false,revert:false,scroll:true,scrollSensitivity:20,scrollSpeed:20,scope:"default",tolerance:"intersect",zIndex:1E3},_create:function(){this.containerCache={};this.element.addClass("ui-sortable");
this.refresh();this.floating=this.items.length?/left|right/.test(this.items[0].item.css("float")):false;this.offset=this.element.offset();this._mouseInit()},destroy:function(){this.element.removeClass("ui-sortable ui-sortable-disabled").removeData("sortable").unbind(".sortable");this._mouseDestroy();for(var a=this.items.length-1;a>=0;a--)this.items[a].item.removeData("sortable-item");return this},_setOption:function(a,b){if(a==="disabled"){this.options[a]=b;this.widget()[b?"addClass":"removeClass"]("ui-sortable-disabled")}else d.Widget.prototype._setOption.apply(this,
arguments)},_mouseCapture:function(a,b){if(this.reverting)return false;if(this.options.disabled||this.options.type=="static")return false;this._refreshItems(a);var c=null,e=this;d(a.target).parents().each(function(){if(d.data(this,"sortable-item")==e){c=d(this);return false}});if(d.data(a.target,"sortable-item")==e)c=d(a.target);if(!c)return false;if(this.options.handle&&!b){var f=false;d(this.options.handle,c).find("*").andSelf().each(function(){if(this==a.target)f=true});if(!f)return false}this.currentItem=
c;this._removeCurrentsFromItems();return true},_mouseStart:function(a,b,c){b=this.options;var e=this;this.currentContainer=this;this.refreshPositions();this.helper=this._createHelper(a);this._cacheHelperProportions();this._cacheMargins();this.scrollParent=this.helper.scrollParent();this.offset=this.currentItem.offset();this.offset={top:this.offset.top-this.margins.top,left:this.offset.left-this.margins.left};this.helper.css("position","absolute");this.cssPosition=this.helper.css("position");d.extend(this.offset,
{click:{left:a.pageX-this.offset.left,top:a.pageY-this.offset.top},parent:this._getParentOffset(),relative:this._getRelativeOffset()});this.originalPosition=this._generatePosition(a);this.originalPageX=a.pageX;this.originalPageY=a.pageY;b.cursorAt&&this._adjustOffsetFromHelper(b.cursorAt);this.domPosition={prev:this.currentItem.prev()[0],parent:this.currentItem.parent()[0]};this.helper[0]!=this.currentItem[0]&&this.currentItem.hide();this._createPlaceholder();b.containment&&this._setContainment();
if(b.cursor){if(d("body").css("cursor"))this._storedCursor=d("body").css("cursor");d("body").css("cursor",b.cursor)}if(b.opacity){if(this.helper.css("opacity"))this._storedOpacity=this.helper.css("opacity");this.helper.css("opacity",b.opacity)}if(b.zIndex){if(this.helper.css("zIndex"))this._storedZIndex=this.helper.css("zIndex");this.helper.css("zIndex",b.zIndex)}if(this.scrollParent[0]!=document&&this.scrollParent[0].tagName!="HTML")this.overflowOffset=this.scrollParent.offset();this._trigger("start",
a,this._uiHash());this._preserveHelperProportions||this._cacheHelperProportions();if(!c)for(c=this.containers.length-1;c>=0;c--)this.containers[c]._trigger("activate",a,e._uiHash(this));if(d.ui.ddmanager)d.ui.ddmanager.current=this;d.ui.ddmanager&&!b.dropBehaviour&&d.ui.ddmanager.prepareOffsets(this,a);this.dragging=true;this.helper.addClass("ui-sortable-helper");this._mouseDrag(a);return true},_mouseDrag:function(a){this.position=this._generatePosition(a);this.positionAbs=this._convertPositionTo("absolute");
if(!this.lastPositionAbs)this.lastPositionAbs=this.positionAbs;if(this.options.scroll){var b=this.options,c=false;if(this.scrollParent[0]!=document&&this.scrollParent[0].tagName!="HTML"){if(this.overflowOffset.top+this.scrollParent[0].offsetHeight-a.pageY<b.scrollSensitivity)this.scrollParent[0].scrollTop=c=this.scrollParent[0].scrollTop+b.scrollSpeed;else if(a.pageY-this.overflowOffset.top<b.scrollSensitivity)this.scrollParent[0].scrollTop=c=this.scrollParent[0].scrollTop-b.scrollSpeed;if(this.overflowOffset.left+
this.scrollParent[0].offsetWidth-a.pageX<b.scrollSensitivity)this.scrollParent[0].scrollLeft=c=this.scrollParent[0].scrollLeft+b.scrollSpeed;else if(a.pageX-this.overflowOffset.left<b.scrollSensitivity)this.scrollParent[0].scrollLeft=c=this.scrollParent[0].scrollLeft-b.scrollSpeed}else{if(a.pageY-d(document).scrollTop()<b.scrollSensitivity)c=d(document).scrollTop(d(document).scrollTop()-b.scrollSpeed);else if(d(window).height()-(a.pageY-d(document).scrollTop())<b.scrollSensitivity)c=d(document).scrollTop(d(document).scrollTop()+
b.scrollSpeed);if(a.pageX-d(document).scrollLeft()<b.scrollSensitivity)c=d(document).scrollLeft(d(document).scrollLeft()-b.scrollSpeed);else if(d(window).width()-(a.pageX-d(document).scrollLeft())<b.scrollSensitivity)c=d(document).scrollLeft(d(document).scrollLeft()+b.scrollSpeed)}c!==false&&d.ui.ddmanager&&!b.dropBehaviour&&d.ui.ddmanager.prepareOffsets(this,a)}this.positionAbs=this._convertPositionTo("absolute");if(!this.options.axis||this.options.axis!="y")this.helper[0].style.left=this.position.left+
"px";if(!this.options.axis||this.options.axis!="x")this.helper[0].style.top=this.position.top+"px";for(b=this.items.length-1;b>=0;b--){c=this.items[b];var e=c.item[0],f=this._intersectsWithPointer(c);if(f)if(e!=this.currentItem[0]&&this.placeholder[f==1?"next":"prev"]()[0]!=e&&!d.ui.contains(this.placeholder[0],e)&&(this.options.type=="semi-dynamic"?!d.ui.contains(this.element[0],e):true)){this.direction=f==1?"down":"up";if(this.options.tolerance=="pointer"||this._intersectsWithSides(c))this._rearrange(a,
c);else break;this._trigger("change",a,this._uiHash());break}}this._contactContainers(a);d.ui.ddmanager&&d.ui.ddmanager.drag(this,a);this._trigger("sort",a,this._uiHash());this.lastPositionAbs=this.positionAbs;return false},_mouseStop:function(a,b){if(a){d.ui.ddmanager&&!this.options.dropBehaviour&&d.ui.ddmanager.drop(this,a);if(this.options.revert){var c=this;b=c.placeholder.offset();c.reverting=true;d(this.helper).animate({left:b.left-this.offset.parent.left-c.margins.left+(this.offsetParent[0]==
document.body?0:this.offsetParent[0].scrollLeft),top:b.top-this.offset.parent.top-c.margins.top+(this.offsetParent[0]==document.body?0:this.offsetParent[0].scrollTop)},parseInt(this.options.revert,10)||500,function(){c._clear(a)})}else this._clear(a,b);return false}},cancel:function(){var a=this;if(this.dragging){this._mouseUp();this.options.helper=="original"?this.currentItem.css(this._storedCSS).removeClass("ui-sortable-helper"):this.currentItem.show();for(var b=this.containers.length-1;b>=0;b--){this.containers[b]._trigger("deactivate",
null,a._uiHash(this));if(this.containers[b].containerCache.over){this.containers[b]._trigger("out",null,a._uiHash(this));this.containers[b].containerCache.over=0}}}this.placeholder[0].parentNode&&this.placeholder[0].parentNode.removeChild(this.placeholder[0]);this.options.helper!="original"&&this.helper&&this.helper[0].parentNode&&this.helper.remove();d.extend(this,{helper:null,dragging:false,reverting:false,_noFinalSort:null});this.domPosition.prev?d(this.domPosition.prev).after(this.currentItem):
d(this.domPosition.parent).prepend(this.currentItem);return this},serialize:function(a){var b=this._getItemsAsjQuery(a&&a.connected),c=[];a=a||{};d(b).each(function(){var e=(d(a.item||this).attr(a.attribute||"id")||"").match(a.expression||/(.+)[-=_](.+)/);if(e)c.push((a.key||e[1]+"[]")+"="+(a.key&&a.expression?e[1]:e[2]))});!c.length&&a.key&&c.push(a.key+"=");return c.join("&")},toArray:function(a){var b=this._getItemsAsjQuery(a&&a.connected),c=[];a=a||{};b.each(function(){c.push(d(a.item||this).attr(a.attribute||
"id")||"")});return c},_intersectsWith:function(a){var b=this.positionAbs.left,c=b+this.helperProportions.width,e=this.positionAbs.top,f=e+this.helperProportions.height,g=a.left,h=g+a.width,i=a.top,k=i+a.height,j=this.offset.click.top,l=this.offset.click.left;j=e+j>i&&e+j<k&&b+l>g&&b+l<h;return this.options.tolerance=="pointer"||this.options.forcePointerForContainers||this.options.tolerance!="pointer"&&this.helperProportions[this.floating?"width":"height"]>a[this.floating?"width":"height"]?j:g<b+
this.helperProportions.width/2&&c-this.helperProportions.width/2<h&&i<e+this.helperProportions.height/2&&f-this.helperProportions.height/2<k},_intersectsWithPointer:function(a){var b=d.ui.isOverAxis(this.positionAbs.top+this.offset.click.top,a.top,a.height);a=d.ui.isOverAxis(this.positionAbs.left+this.offset.click.left,a.left,a.width);b=b&&a;a=this._getDragVerticalDirection();var c=this._getDragHorizontalDirection();if(!b)return false;return this.floating?c&&c=="right"||a=="down"?2:1:a&&(a=="down"?
2:1)},_intersectsWithSides:function(a){var b=d.ui.isOverAxis(this.positionAbs.top+this.offset.click.top,a.top+a.height/2,a.height);a=d.ui.isOverAxis(this.positionAbs.left+this.offset.click.left,a.left+a.width/2,a.width);var c=this._getDragVerticalDirection(),e=this._getDragHorizontalDirection();return this.floating&&e?e=="right"&&a||e=="left"&&!a:c&&(c=="down"&&b||c=="up"&&!b)},_getDragVerticalDirection:function(){var a=this.positionAbs.top-this.lastPositionAbs.top;return a!=0&&(a>0?"down":"up")},
_getDragHorizontalDirection:function(){var a=this.positionAbs.left-this.lastPositionAbs.left;return a!=0&&(a>0?"right":"left")},refresh:function(a){this._refreshItems(a);this.refreshPositions();return this},_connectWith:function(){var a=this.options;return a.connectWith.constructor==String?[a.connectWith]:a.connectWith},_getItemsAsjQuery:function(a){var b=[],c=[],e=this._connectWith();if(e&&a)for(a=e.length-1;a>=0;a--)for(var f=d(e[a]),g=f.length-1;g>=0;g--){var h=d.data(f[g],"sortable");if(h&&h!=
this&&!h.options.disabled)c.push([d.isFunction(h.options.items)?h.options.items.call(h.element):d(h.options.items,h.element).not(".ui-sortable-helper").not(".ui-sortable-placeholder"),h])}c.push([d.isFunction(this.options.items)?this.options.items.call(this.element,null,{options:this.options,item:this.currentItem}):d(this.options.items,this.element).not(".ui-sortable-helper").not(".ui-sortable-placeholder"),this]);for(a=c.length-1;a>=0;a--)c[a][0].each(function(){b.push(this)});return d(b)},_removeCurrentsFromItems:function(){for(var a=
this.currentItem.find(":data(sortable-item)"),b=0;b<this.items.length;b++)for(var c=0;c<a.length;c++)a[c]==this.items[b].item[0]&&this.items.splice(b,1)},_refreshItems:function(a){this.items=[];this.containers=[this];var b=this.items,c=[[d.isFunction(this.options.items)?this.options.items.call(this.element[0],a,{item:this.currentItem}):d(this.options.items,this.element),this]],e=this._connectWith();if(e)for(var f=e.length-1;f>=0;f--)for(var g=d(e[f]),h=g.length-1;h>=0;h--){var i=d.data(g[h],"sortable");
if(i&&i!=this&&!i.options.disabled){c.push([d.isFunction(i.options.items)?i.options.items.call(i.element[0],a,{item:this.currentItem}):d(i.options.items,i.element),i]);this.containers.push(i)}}for(f=c.length-1;f>=0;f--){a=c[f][1];e=c[f][0];h=0;for(g=e.length;h<g;h++){i=d(e[h]);i.data("sortable-item",a);b.push({item:i,instance:a,width:0,height:0,left:0,top:0})}}},refreshPositions:function(a){if(this.offsetParent&&this.helper)this.offset.parent=this._getParentOffset();for(var b=this.items.length-1;b>=
0;b--){var c=this.items[b],e=this.options.toleranceElement?d(this.options.toleranceElement,c.item):c.item;if(!a){c.width=e.outerWidth();c.height=e.outerHeight()}e=e.offset();c.left=e.left;c.top=e.top}if(this.options.custom&&this.options.custom.refreshContainers)this.options.custom.refreshContainers.call(this);else for(b=this.containers.length-1;b>=0;b--){e=this.containers[b].element.offset();this.containers[b].containerCache.left=e.left;this.containers[b].containerCache.top=e.top;this.containers[b].containerCache.width=
this.containers[b].element.outerWidth();this.containers[b].containerCache.height=this.containers[b].element.outerHeight()}return this},_createPlaceholder:function(a){var b=a||this,c=b.options;if(!c.placeholder||c.placeholder.constructor==String){var e=c.placeholder;c.placeholder={element:function(){var f=d(document.createElement(b.currentItem[0].nodeName)).addClass(e||b.currentItem[0].className+" ui-sortable-placeholder").removeClass("ui-sortable-helper")[0];if(!e)f.style.visibility="hidden";return f},
update:function(f,g){if(!(e&&!c.forcePlaceholderSize)){g.height()||g.height(b.currentItem.innerHeight()-parseInt(b.currentItem.css("paddingTop")||0,10)-parseInt(b.currentItem.css("paddingBottom")||0,10));g.width()||g.width(b.currentItem.innerWidth()-parseInt(b.currentItem.css("paddingLeft")||0,10)-parseInt(b.currentItem.css("paddingRight")||0,10))}}}}b.placeholder=d(c.placeholder.element.call(b.element,b.currentItem));b.currentItem.after(b.placeholder);c.placeholder.update(b,b.placeholder)},_contactContainers:function(a){for(var b=
null,c=null,e=this.containers.length-1;e>=0;e--)if(!d.ui.contains(this.currentItem[0],this.containers[e].element[0]))if(this._intersectsWith(this.containers[e].containerCache)){if(!(b&&d.ui.contains(this.containers[e].element[0],b.element[0]))){b=this.containers[e];c=e}}else if(this.containers[e].containerCache.over){this.containers[e]._trigger("out",a,this._uiHash(this));this.containers[e].containerCache.over=0}if(b)if(this.containers.length===1){this.containers[c]._trigger("over",a,this._uiHash(this));
this.containers[c].containerCache.over=1}else if(this.currentContainer!=this.containers[c]){b=1E4;e=null;for(var f=this.positionAbs[this.containers[c].floating?"left":"top"],g=this.items.length-1;g>=0;g--)if(d.ui.contains(this.containers[c].element[0],this.items[g].item[0])){var h=this.items[g][this.containers[c].floating?"left":"top"];if(Math.abs(h-f)<b){b=Math.abs(h-f);e=this.items[g]}}if(e||this.options.dropOnEmpty){this.currentContainer=this.containers[c];e?this._rearrange(a,e,null,true):this._rearrange(a,
null,this.containers[c].element,true);this._trigger("change",a,this._uiHash());this.containers[c]._trigger("change",a,this._uiHash(this));this.options.placeholder.update(this.currentContainer,this.placeholder);this.containers[c]._trigger("over",a,this._uiHash(this));this.containers[c].containerCache.over=1}}},_createHelper:function(a){var b=this.options;a=d.isFunction(b.helper)?d(b.helper.apply(this.element[0],[a,this.currentItem])):b.helper=="clone"?this.currentItem.clone():this.currentItem;a.parents("body").length||
d(b.appendTo!="parent"?b.appendTo:this.currentItem[0].parentNode)[0].appendChild(a[0]);if(a[0]==this.currentItem[0])this._storedCSS={width:this.currentItem[0].style.width,height:this.currentItem[0].style.height,position:this.currentItem.css("position"),top:this.currentItem.css("top"),left:this.currentItem.css("left")};if(a[0].style.width==""||b.forceHelperSize)a.width(this.currentItem.width());if(a[0].style.height==""||b.forceHelperSize)a.height(this.currentItem.height());return a},_adjustOffsetFromHelper:function(a){if(typeof a==
"string")a=a.split(" ");if(d.isArray(a))a={left:+a[0],top:+a[1]||0};if("left"in a)this.offset.click.left=a.left+this.margins.left;if("right"in a)this.offset.click.left=this.helperProportions.width-a.right+this.margins.left;if("top"in a)this.offset.click.top=a.top+this.margins.top;if("bottom"in a)this.offset.click.top=this.helperProportions.height-a.bottom+this.margins.top},_getParentOffset:function(){this.offsetParent=this.helper.offsetParent();var a=this.offsetParent.offset();if(this.cssPosition==
"absolute"&&this.scrollParent[0]!=document&&d.ui.contains(this.scrollParent[0],this.offsetParent[0])){a.left+=this.scrollParent.scrollLeft();a.top+=this.scrollParent.scrollTop()}if(this.offsetParent[0]==document.body||this.offsetParent[0].tagName&&this.offsetParent[0].tagName.toLowerCase()=="html"&&d.browser.msie)a={top:0,left:0};return{top:a.top+(parseInt(this.offsetParent.css("borderTopWidth"),10)||0),left:a.left+(parseInt(this.offsetParent.css("borderLeftWidth"),10)||0)}},_getRelativeOffset:function(){if(this.cssPosition==
"relative"){var a=this.currentItem.position();return{top:a.top-(parseInt(this.helper.css("top"),10)||0)+this.scrollParent.scrollTop(),left:a.left-(parseInt(this.helper.css("left"),10)||0)+this.scrollParent.scrollLeft()}}else return{top:0,left:0}},_cacheMargins:function(){this.margins={left:parseInt(this.currentItem.css("marginLeft"),10)||0,top:parseInt(this.currentItem.css("marginTop"),10)||0}},_cacheHelperProportions:function(){this.helperProportions={width:this.helper.outerWidth(),height:this.helper.outerHeight()}},
_setContainment:function(){var a=this.options;if(a.containment=="parent")a.containment=this.helper[0].parentNode;if(a.containment=="document"||a.containment=="window")this.containment=[0-this.offset.relative.left-this.offset.parent.left,0-this.offset.relative.top-this.offset.parent.top,d(a.containment=="document"?document:window).width()-this.helperProportions.width-this.margins.left,(d(a.containment=="document"?document:window).height()||document.body.parentNode.scrollHeight)-this.helperProportions.height-
this.margins.top];if(!/^(document|window|parent)$/.test(a.containment)){var b=d(a.containment)[0];a=d(a.containment).offset();var c=d(b).css("overflow")!="hidden";this.containment=[a.left+(parseInt(d(b).css("borderLeftWidth"),10)||0)+(parseInt(d(b).css("paddingLeft"),10)||0)-this.margins.left,a.top+(parseInt(d(b).css("borderTopWidth"),10)||0)+(parseInt(d(b).css("paddingTop"),10)||0)-this.margins.top,a.left+(c?Math.max(b.scrollWidth,b.offsetWidth):b.offsetWidth)-(parseInt(d(b).css("borderLeftWidth"),
10)||0)-(parseInt(d(b).css("paddingRight"),10)||0)-this.helperProportions.width-this.margins.left,a.top+(c?Math.max(b.scrollHeight,b.offsetHeight):b.offsetHeight)-(parseInt(d(b).css("borderTopWidth"),10)||0)-(parseInt(d(b).css("paddingBottom"),10)||0)-this.helperProportions.height-this.margins.top]}},_convertPositionTo:function(a,b){if(!b)b=this.position;a=a=="absolute"?1:-1;var c=this.cssPosition=="absolute"&&!(this.scrollParent[0]!=document&&d.ui.contains(this.scrollParent[0],this.offsetParent[0]))?
this.offsetParent:this.scrollParent,e=/(html|body)/i.test(c[0].tagName);return{top:b.top+this.offset.relative.top*a+this.offset.parent.top*a-(d.browser.safari&&this.cssPosition=="fixed"?0:(this.cssPosition=="fixed"?-this.scrollParent.scrollTop():e?0:c.scrollTop())*a),left:b.left+this.offset.relative.left*a+this.offset.parent.left*a-(d.browser.safari&&this.cssPosition=="fixed"?0:(this.cssPosition=="fixed"?-this.scrollParent.scrollLeft():e?0:c.scrollLeft())*a)}},_generatePosition:function(a){var b=
this.options,c=this.cssPosition=="absolute"&&!(this.scrollParent[0]!=document&&d.ui.contains(this.scrollParent[0],this.offsetParent[0]))?this.offsetParent:this.scrollParent,e=/(html|body)/i.test(c[0].tagName);if(this.cssPosition=="relative"&&!(this.scrollParent[0]!=document&&this.scrollParent[0]!=this.offsetParent[0]))this.offset.relative=this._getRelativeOffset();var f=a.pageX,g=a.pageY;if(this.originalPosition){if(this.containment){if(a.pageX-this.offset.click.left<this.containment[0])f=this.containment[0]+
this.offset.click.left;if(a.pageY-this.offset.click.top<this.containment[1])g=this.containment[1]+this.offset.click.top;if(a.pageX-this.offset.click.left>this.containment[2])f=this.containment[2]+this.offset.click.left;if(a.pageY-this.offset.click.top>this.containment[3])g=this.containment[3]+this.offset.click.top}if(b.grid){g=this.originalPageY+Math.round((g-this.originalPageY)/b.grid[1])*b.grid[1];g=this.containment?!(g-this.offset.click.top<this.containment[1]||g-this.offset.click.top>this.containment[3])?
g:!(g-this.offset.click.top<this.containment[1])?g-b.grid[1]:g+b.grid[1]:g;f=this.originalPageX+Math.round((f-this.originalPageX)/b.grid[0])*b.grid[0];f=this.containment?!(f-this.offset.click.left<this.containment[0]||f-this.offset.click.left>this.containment[2])?f:!(f-this.offset.click.left<this.containment[0])?f-b.grid[0]:f+b.grid[0]:f}}return{top:g-this.offset.click.top-this.offset.relative.top-this.offset.parent.top+(d.browser.safari&&this.cssPosition=="fixed"?0:this.cssPosition=="fixed"?-this.scrollParent.scrollTop():
e?0:c.scrollTop()),left:f-this.offset.click.left-this.offset.relative.left-this.offset.parent.left+(d.browser.safari&&this.cssPosition=="fixed"?0:this.cssPosition=="fixed"?-this.scrollParent.scrollLeft():e?0:c.scrollLeft())}},_rearrange:function(a,b,c,e){c?c[0].appendChild(this.placeholder[0]):b.item[0].parentNode.insertBefore(this.placeholder[0],this.direction=="down"?b.item[0]:b.item[0].nextSibling);this.counter=this.counter?++this.counter:1;var f=this,g=this.counter;window.setTimeout(function(){g==
f.counter&&f.refreshPositions(!e)},0)},_clear:function(a,b){this.reverting=false;var c=[];!this._noFinalSort&&this.currentItem[0].parentNode&&this.placeholder.before(this.currentItem);this._noFinalSort=null;if(this.helper[0]==this.currentItem[0]){for(var e in this._storedCSS)if(this._storedCSS[e]=="auto"||this._storedCSS[e]=="static")this._storedCSS[e]="";this.currentItem.css(this._storedCSS).removeClass("ui-sortable-helper")}else this.currentItem.show();this.fromOutside&&!b&&c.push(function(f){this._trigger("receive",
f,this._uiHash(this.fromOutside))});if((this.fromOutside||this.domPosition.prev!=this.currentItem.prev().not(".ui-sortable-helper")[0]||this.domPosition.parent!=this.currentItem.parent()[0])&&!b)c.push(function(f){this._trigger("update",f,this._uiHash())});if(!d.ui.contains(this.element[0],this.currentItem[0])){b||c.push(function(f){this._trigger("remove",f,this._uiHash())});for(e=this.containers.length-1;e>=0;e--)if(d.ui.contains(this.containers[e].element[0],this.currentItem[0])&&!b){c.push(function(f){return function(g){f._trigger("receive",
g,this._uiHash(this))}}.call(this,this.containers[e]));c.push(function(f){return function(g){f._trigger("update",g,this._uiHash(this))}}.call(this,this.containers[e]))}}for(e=this.containers.length-1;e>=0;e--){b||c.push(function(f){return function(g){f._trigger("deactivate",g,this._uiHash(this))}}.call(this,this.containers[e]));if(this.containers[e].containerCache.over){c.push(function(f){return function(g){f._trigger("out",g,this._uiHash(this))}}.call(this,this.containers[e]));this.containers[e].containerCache.over=
0}}this._storedCursor&&d("body").css("cursor",this._storedCursor);this._storedOpacity&&this.helper.css("opacity",this._storedOpacity);if(this._storedZIndex)this.helper.css("zIndex",this._storedZIndex=="auto"?"":this._storedZIndex);this.dragging=false;if(this.cancelHelperRemoval){if(!b){this._trigger("beforeStop",a,this._uiHash());for(e=0;e<c.length;e++)c[e].call(this,a);this._trigger("stop",a,this._uiHash())}return false}b||this._trigger("beforeStop",a,this._uiHash());this.placeholder[0].parentNode.removeChild(this.placeholder[0]);
this.helper[0]!=this.currentItem[0]&&this.helper.remove();this.helper=null;if(!b){for(e=0;e<c.length;e++)c[e].call(this,a);this._trigger("stop",a,this._uiHash())}this.fromOutside=false;return true},_trigger:function(){d.Widget.prototype._trigger.apply(this,arguments)===false&&this.cancel()},_uiHash:function(a){var b=a||this;return{helper:b.helper,placeholder:b.placeholder||d([]),position:b.position,originalPosition:b.originalPosition,offset:b.positionAbs,item:b.currentItem,sender:a?a.element:null}}});
d.extend(d.ui.sortable,{version:"1.8.7"})})(jQuery);
;

/*jslint bitwise: true, eqeqeq: true, immed: true, newcap: true, nomen: false,
 onevar: false, plusplus: false, regexp: true, undef: true, white: true, indent: 2
 browser: true */

/*global window: true jQuery: true Drupal: true ThemeBuilder: true debug: true*/

/**
 * Sets the specified handler to handle changes for the specified
 * modification type.
 *
 * @param {String} type
 *   A string identifier that indicates the modification type.
 * @param {Object} handler
 *   An object that will manage changes for the specified modification type.
 */
ThemeBuilder.addModificationHandler = function (type, handler) {
  if (!ThemeBuilder.modificationHandlers) {
    ThemeBuilder.modificationHandlers = {};
  }
  ThemeBuilder.modificationHandlers[type] = handler;
};

/**
 * Removes the specified handler from the list of handlers that manage
 * modifications of the specified type.
 *
 * @param {String} type
 *   A string identifier that indicates the modification type.
 * @param {Object} handler
 *   An object that will manage changes for the specified modification type.
 */
ThemeBuilder.removeModificationHandler = function (type, handler) {
  if (ThemeBuilder.modificationHandlers &&
    ThemeBuilder.modificationHandlers[type] === handler) {
    delete ThemeBuilder.modificationHandlers[type];
  }
};

/**
 * Returns the registered handler that manages changes for the
 * specified modification.
 *
 * @param {String} type
 *   A string identifier that indicates the modification type.
 *
 * @return {Object}
 *   The handler object associated with the specified type, or undefined if
 *   the handler has not been registered.
 */
ThemeBuilder.getModificationHandler = function (type) {
  var handler = undefined;
  if (ThemeBuilder.modificationHandlers) {
    handler = ThemeBuilder.modificationHandlers[type];
  }
  return handler;
};

/**
 * Registers a new modification class.  Registering the class is necessary in
 * order for the system to create new instances of the modification.  The
 * class must have a TYPE field that provides the string that identifies the
 * type of modification being registered.
 *
 * @param {String} classname
 *   The name of the modification class being registered.
 */
ThemeBuilder.registerModificationClass = function (classname) {
  if (!ThemeBuilder._modificationTypes) {
    ThemeBuilder._modificationTypes = {};
  }
  if (!ThemeBuilder[classname].TYPE) {
    throw classname + " is not a recognized Modification subclass.";
  }
  ThemeBuilder._modificationTypes[ThemeBuilder[classname].TYPE] = classname;
};

/**
 * Retrieves the modification class for the specified modification type.  The
 * modification class can be used to instantiate a Modification instance
 * suitable for recording property changes for the specified modification
 * type.
 *
 * @param {String} type
 *   The modification type, which indicates what kind of modification needs to
 *   be stored.
 */
ThemeBuilder.getModificationClassForType = function (type) {
  var classname = undefined;
  if (ThemeBuilder._modificationTypes) {
    classname = ThemeBuilder._modificationTypes[type];
  }
  return classname;
};

/**
 * This class contains a single modification.  The Modification instance captures
 * a delta between a previous value and the next value and can facilitate apply
 * and undo operations by keeping track of both states for every change in a
 * stack.
 * @class
 * @constructor
 */
ThemeBuilder.Modification = ThemeBuilder.initClass();

/**
 * The constructor for the Modification class.  A modification object has the
 * modification type and the selector in common for both the apply and revert
 * states of the change.  The type indicates what kind of change this modification
 * instance holds (css, layout, palette etc.) while the selector indicates the
 * particular entity being modified.
 *
 * @param selector string
 *   The selector of the property being modified.
 */
ThemeBuilder.Modification.prototype.initialize = function (selector) {
  this.selector = selector;
  this.priorState = null;
  this.newState = null;
  this.type = null;
};

/**
 * Creates a new modification from the specified states.
 *
 * @param priorState object
 *   The priorState indicates the state of the property being modified
 *   before the change is applied.
 * @param newState object
 *   The newState indicates the state of the property being modified
 *   after the change is applied.
 * @return
 *   A Modification instance that represents the specified change.
 */
ThemeBuilder.Modification.create = function (priorState, newState) {
  if (!priorState) {
    throw 'The priorState must be specified when calling Modification.create';
  }
  var modification;
  var classname = ThemeBuilder.getModificationClassForType(priorState.type);
  if (classname) {
    modification = ThemeBuilder[classname].create(priorState, newState);
  }
  else {
    throw "Unexpected modification type: " + priorState.type;
  }
  return modification;
};

/**
 * Creates a new modification instance from the specified description.  The
 * description should be an object that contains all of the properties of
 * a Modification instance, but is not an instance of Modification.
 *
 * @param desc object
 *   An object identifying the modification.  This would generally come from
 *   the database.
 * @return
 *   The new Modification instance.
 */
ThemeBuilder.Modification.fromDescription = function (desc) {
  if (!desc) {
    throw 'The description must be specified.';
  }
  var modification;
  if (desc.type === ThemeBuilder.GroupedModification.TYPE) {
    var children = {};
    for (var child in desc.children) {
      if (typeof(desc.children[child]) !== 'function') {
        children[child] = (ThemeBuilder.Modification.fromDescription(desc.children[child]));
      }
    }
    modification = ThemeBuilder.GroupedModification.create(children);
  }
  else {
    var classname = ThemeBuilder.getModificationClassForType(desc.type);
    if (classname) {
      modification = new ThemeBuilder[classname](desc.selector);
    }
    else {
      throw 'Unknown modification type ' + desc.type;
    }
  }
  modification.priorState = desc.priorState;
  modification.newState = desc.newState;
  return modification;
};

/**
 * Returns the selector of the entity being modified.  For CSS, this would be
 * the CSS selector.  For layout, it could be a string that represents when the
 * layout would be applied (page, global, etc.).
 *
 * @return
 *   The selector associated with this modification.
 */
ThemeBuilder.Modification.prototype.getSelector = function () {
  return this.selector;
};

/**
 * Returns the type of modification this instance represents.
 *
 * @return
 *   The type associated with this modification.
 */
ThemeBuilder.Modification.prototype.getType = function () {
  return this.type;
};

/**
 * Configures into the modification instance the state of the property as it
 * existed before the modification was applied.  This is the state to which it
 * will return should the ThemeBuilder.undo() function be called.  Note that
 * the prior state is specific to the particular class of Modification being
 * used.  The arguments will be passed to the createState method.
 */
ThemeBuilder.Modification.prototype.setPriorState = function () {
  this.priorState = this.createState.apply(this, arguments);
};

/**
 * Configures into the modification instance the state of the property as it
 * should be after the modification is applied.  This is the state to which it
 * will be set after the modification is applied, or after a call to
 * ThemeBuilder.redo() if this modification instance is at the top of the undo
 * stack.  Note that the new state parameters are specific to the particular
 * class of Modification being used.  The arguments will be passed to the
 * createState method.
 */
ThemeBuilder.Modification.prototype.setNewState = function () {
  this.newState = this.createState.apply(this, arguments);
};

/**
 * This function will return an object that represents the current state.
 *
 * @return object
 *   An object containing the properties of the state being created.
 */
ThemeBuilder.Modification.prototype.createState = function () {
  throw "The Modification.createState is abstract and must be overridden.";
};

/**
 * Returns a description of what needs to change if this modification instance
 * is applied.
 *
 * @return
 *   An object that contains fields that fully describe this modification when
 *   it is applied.  This object should be used to perform the actual changes.
 */
ThemeBuilder.Modification.prototype.getNewState = function () {
  if (this.newState === null) {
    throw "The Modification instance has not been initialized before apply.";
  }
  var update = ThemeBuilder.clone(this.newState);
  update.type = this.getType();
  update.selector = this.selector;
  return update;
};

/**
 * Returns a description of what needs to change if this modification instance
 * is reverted.
 *
 * @return
 *   An object that contains fields that fully describe this modification when
 *   it is reverted.  This object should be used to perform the actual changes.
 */
ThemeBuilder.Modification.prototype.getPriorState = function () {
  if (this.priorState === null) {
    throw "The Modification instance has not been initialized before revert.";
  }
  var update = ThemeBuilder.clone(this.priorState);
  update.type = this.getType();
  update.selector = this.selector;
  return update;
};

/**
 * Returns a new Modification instance that represents a fresh modification
 * using the new state from the current modification.  This step is required
 * whenever a modification has been committed so the following modification
 * is a different instance and has the correct starting point.
 *
 * @return object
 *   The new Modification instance.
 */
ThemeBuilder.Modification.prototype.getFreshModification = function () {
  return ThemeBuilder.Modification.create(this.getNewState());
};

/**
 * Determines whether the value of the specified modification has changed.
 * This method essentially compares the value in the prior state to the value
 * in the new state to try to detect a change.
 *
 * @return {boolean}
 *   true if the modification represents a change; false otherwise.
 */
ThemeBuilder.Modification.prototype.hasChanged = function () {
  var before = this.getPriorState();
  var after = this.getNewState();
  for (var property in before) {
    if (property && before.hasOwnProperty(property)) {
      if (after[property] !== before[property]) {
        return true;
      }
    }
  }
  return false;
};

/**
 * Indicates the number of Modification instances are represented.
 * 
 * @return {int}
 *   The total number of modifications.
 */
ThemeBuilder.Modification.prototype.getCount = function () {
  return 1;
};

/**
 * The CssModification is a subclass of the abstract Modification class.  An
 * instance of this class can hold a modification to a CSS property such that
 * it can be applied and reverted.
 *
 * @class
 * @extends ThemeBuilder.Modification
 * @constructor
 * @param selector string
 *   The selector for the CSS modification.
 */
ThemeBuilder.CssModification = ThemeBuilder.initClass();

// Subclass the Modification class.
ThemeBuilder.CssModification.prototype = new ThemeBuilder.Modification();

/**
 * The type string that indicates this is a css modification.
 */
ThemeBuilder.CssModification.TYPE = 'css';

ThemeBuilder.registerModificationClass('CssModification');

/**
 * This static method returns a correctly initialized CssModification instance
 * that contains the specified prior state and new state.  Enough checking is
 * performed to ensure that the newly instantiated object is valid.
 *
 * @return
 *   A new instance of CssModification that contains the specified prior
 *   state and new state.
 */
ThemeBuilder.CssModification.create = function (priorState, newState) {
  if (ThemeBuilder.CssModification.TYPE !== priorState.type) {
    throw 'Cannot create a CssModification from state type ' + priorState.type;
  }

  var instance = new ThemeBuilder.CssModification(priorState.selector, priorState.undofunction);
  instance.setPriorState(priorState.property, priorState.value);
  if (newState) {
    instance.setNewState(newState.property, newState.value);
  }
  return instance;
};

/**
 * The constructor for the CssModification class.  This initializes the type
 * and selector for the modification.  You should never call this method
 * directly, but rather use code such as:
 * <pre>
 *   var modification = new CssModification('h1');
 * </pre>
 *
 * @param selector string
 *   The selector that describes the element(s) that the property and values
 *   associated with this Modification instance would apply to.
 */
ThemeBuilder.CssModification.prototype.initialize = function (selector, undofunction) {
  ThemeBuilder.Modification.prototype.initialize.call(this, selector);
  this.type = ThemeBuilder.CssModification.TYPE;
  this.undofunction = undofunction;
};

/**
 * Creates a simple object that encapsulates a state (either a prior state or
 * a new state) which will be associated with this modification instance.
 *
 * @param property string
 *   The property name.
 * @param value string
 *   The value associated with the property.
 * @param resources string
 *   Any resources needed for this property (such as a font or image).
 */
ThemeBuilder.CssModification.prototype.createState = function (property, value, resources) {
  return {
    property : property,
    value : value,
    resources: resources
  };
};

/**
 * The LayoutModification is a subclass of the abstract Modification class.  An
 * instance of this class can hold a modification to the layout such that
 * it can be applied and reverted.
 *
 * @class
 * @extends ThemeBuilder.Modification
 * @param selector string
 *   The selector for the layout modification.  Use 'global' if the layout
 *   should apply to the entire site.
 */
ThemeBuilder.layoutEditorModification = ThemeBuilder.initClass();

// Subclass the Modification class.
ThemeBuilder.layoutEditorModification.prototype = new ThemeBuilder.Modification();

/**
 * The type string that indicates this is a layout modification.
 */
ThemeBuilder.layoutEditorModification.TYPE = 'layout';
ThemeBuilder.registerModificationClass('layoutEditorModification');
/**
 * This static method returns a correctly initialized LayoutModification instance
 * that contains the specified prior state and new state.  Enough checking is
 * performed to ensure that the newly instantiated object is valid.
 *
 * @return
 *   A new instance of LayoutModification that contains the specified prior
 *   state and new state.
 */
ThemeBuilder.layoutEditorModification.create = function (priorState, newState) {
  if (ThemeBuilder.layoutEditorModification.TYPE !== priorState.type) {
    throw 'Cannot create a LayoutModification from state type ' + priorState.type;
  }

  var instance = new ThemeBuilder.layoutEditorModification(priorState.selector);
  instance.setPriorState(priorState.layout);
  if (newState) {
    instance.setNewState(newState.layout);
  }
  return instance;
};

/**
 * The constructor for the LayoutModification class.  This initializes the type
 * of the modification.  You should never call this method directly, but rather
 * use code such as:
 * <pre>
 *   var modification = new LayoutModification(selector);
 * </pre>
 *
 * @param selector
 *   Where to apply this layout change.  For the entire site, this should be
 *   '<global>'.
 */
ThemeBuilder.layoutEditorModification.prototype.initialize = function (selector) {
  ThemeBuilder.Modification.prototype.initialize.call(this, selector);
  this.type = ThemeBuilder.layoutEditorModification.TYPE;
};

/**
 * Creates a simple object that encapsulates a state (either a prior state or
 * a new state) which will be associated with this modification instance.
 *
 * @param layoutName string
 *   The the name of the layout.
 * @param {String} urlPattern A regex to match for selecting this layout.
 */
ThemeBuilder.layoutEditorModification.prototype.createState = function (layoutName) {
  return {
    layout: layoutName
  };
};

/**
 * The GroupedModification is a subclass of the abstract Modification class.  An
 * instance of this class can hold several modifications of any type that can
 * be applied, undone, or redone all at once.
 * @class
 * @extends ThemeBuilder.Modification
 */
ThemeBuilder.GroupedModification = ThemeBuilder.initClass();

// Subclass the Modification class.
ThemeBuilder.GroupedModification.prototype = new ThemeBuilder.Modification();

/**
 * The type string that indicates this is a group modification.
 */
ThemeBuilder.GroupedModification.TYPE = 'grouped';
ThemeBuilder.registerModificationClass('GroupedModification');

ThemeBuilder.GroupedModification.create = function (children) {
  var result = new ThemeBuilder.GroupedModification();
  for (var key in children) {
    if (typeof(children[key]) !== 'function') {
      result.addChild(key, children[key]);
    }
  }
  return result;
};

/**
 * The constructor for the GroupedModification class.  This initializes the type
 * of the modification.  You should never call this method directly, but rather
 * use code such as:
 * <pre>
 *   var modification = new GroupedModification();
 * </pre>
 */
ThemeBuilder.GroupedModification.prototype.initialize = function () {
  ThemeBuilder.Modification.prototype.initialize.call(this, 'group');
  this.type = ThemeBuilder.GroupedModification.TYPE;
  this.children = {};
};

ThemeBuilder.GroupedModification.prototype.getNewState = function () {
  var result = [];
  for (var attribute in this.children) {
    if (true) {
      result.push(this.children[attribute].getNewState());
    }
  }
  return result;
};

ThemeBuilder.GroupedModification.prototype.getPriorState = function () {
  var result = [];
  for (var attribute in this.children) {
    if (true) {
      result.push(this.children[attribute].getPriorState());
    }
  }
  return result;
};


/**
 * // TODO: Not sure what to do with this yet...
 * Creates a simple object that encapsulates a state (either a prior state or
 * a new state) which will be associated with this modification instance.
 *
 * @param layoutName string
 *   The the name of the layout.
 */
ThemeBuilder.GroupedModification.prototype.createState = function (layoutName) {
  return {
    layout: layoutName
  };
};

ThemeBuilder.GroupedModification.prototype.addChild = function (name, modification) {
  this.children[name] = modification;
};

ThemeBuilder.GroupedModification.prototype.getChild = function (name) {
  return this.children[name];
};

/**
 * Returns all children from this GroupedModification instance.
 * 
 * @return {Associative array}
 *   The children.
 */
ThemeBuilder.GroupedModification.prototype.getChildren = function () {
  return this.children;
};

/**
 * Indicates the number of Modification instances are represented.
 * 
 * @return {int}
 *   The total number of modifications.
 */
ThemeBuilder.GroupedModification.prototype.getCount = function () {
  var count = 0;
  for (var name in this.children) {
    if (this.children.hasOwnProperty(name) &&
       this.children[name].getCount) {
      count += this.children[name].getCount();
    }
  }
  return count;
};

/**
 * Make a child modification last in the group.
 * 
 * This will fail in Chrome if the child modification's name is an integer.
 * The order of properties in an ECMAScript object is implementation-dependent.
 * Most browsers respect their order, but Chrome treats them more like PHP
 * arrays; it respects the order of string keys but reorders integer keys.
 * See http://ejohn.org/blog/javascript-in-chrome/ and
 * http://code.google.com/p/chromium/issues/detail?id=20144.
 *
 * The Chrome "bug" is slated to be fixed. In the meantime, callers need to
 * make sure that their modification names are not integers. '1' is a bad idea.
 *
 * @param name string
 *   The name of the modification to be moved.
 */
ThemeBuilder.GroupedModification.prototype.bumpChild = function (name) {
  if (this.children[name]) {
    var lastChild = ThemeBuilder.clone(this.children[name]);
    var newChildren = {};
    var i;
    for (i in this.children) {
      if (i !== name && this.children[i].priorState) {
        newChildren[i] = this.children[i];
      }
    }
    this.children = newChildren;
    this.addChild(name, lastChild);
    return true;
  }
  return false;
};



/**
 * The codeModification is a subclass of the abstract Modification class.  An
 * instance of this class can hold a modification to the code such that
 * it can be applied and reverted.
 *
 * @class
 * @extends ThemeBuilder.Modification
 * @param selector string
 *   The selector for the code modification.  Use 'global' if the code
 *   should apply to the entire site.
 */
ThemeBuilder.codeEditorModification = ThemeBuilder.initClass();

// Subclass the Modification class.
ThemeBuilder.codeEditorModification.prototype = new ThemeBuilder.Modification();

/**
 * The type string that indicates this is a code modification.
 */
ThemeBuilder.codeEditorModification.TYPE = 'code';
ThemeBuilder.registerModificationClass('codeEditorModification');

/**
 * This static method returns a correctly initialized codeModification instance
 * that contains the specified prior state and new state.  Enough checking is
 * performed to ensure that the newly instantiated object is valid.
 *
 * @return
 *   A new instance of codeModification that contains the specified prior
 *   state and new state.
 */
ThemeBuilder.codeEditorModification.create = function (priorState, newState) {
  if (ThemeBuilder.codeEditorModification.TYPE !== priorState.type) {
    throw 'Cannot create a codeModification from state type ' + priorState.type;
  }

  var instance = new ThemeBuilder.codeEditorModification(priorState.selector);
  instance.setPriorState(priorState.code);
  if (newState) {
    instance.setNewState(newState.code);
  }
  return instance;
};

/**
 * The constructor for the codeModification class.  This initializes the type
 * of the modification.  You should never call this method directly, but rather
 * use code such as:
 * <pre>
 *   var modification = new codeModification(selector);
 * </pre>
 *
 * @param selector
 *   Where to apply this code change.  For the entire site, this should be
 *   'global'.
 */
ThemeBuilder.codeEditorModification.prototype.initialize = function (selector) {
  ThemeBuilder.Modification.prototype.initialize.call(this, selector);
  this.type = ThemeBuilder.codeEditorModification.TYPE;
};

/**
 * Creates a simple object that encapsulates a state (either a prior state or
 * a new state) which will be associated with this modification instance.
 *
 * @param codeBuffer string
 *   The buffer of code.
 */
ThemeBuilder.codeEditorModification.prototype.createState = function (codeBuffer) {
  return {
    code: codeBuffer
  };
};

/**
 * The undo stack.  When a modification is performed, it should be placed on
 * the undo stack.  If the user would like to revert the change, the item can
 * be popped from the stack and reverted.  At this point it should be placed
 * on the redo stack.
 */
ThemeBuilder.undoStack = new ThemeBuilder.Stack();

/**
 * The redo stack.  When a modification is reverted, the modification should
 * be placed on the redo stack.  Subsequently, if another modification is
 * performed (and placed on the undo stack), the redo stack should be cleared.
 */
ThemeBuilder.redoStack = new ThemeBuilder.Stack();

/**
 * Meant for debugging purposes, logs the stack
 */
ThemeBuilder.showStack = function (stack) {
  for (var i = 0; i < stack.size(); i++) {
    debug.log(stack._data[i]);
  }
};


// Constant values indicating the type of modification being committed to the server.
ThemeBuilder.APPLY_MODIFICATION = "apply";
ThemeBuilder.UNDO_MODIFICATION = "undo";
ThemeBuilder.REDO_MODIFICATION = "redo";

/**
 * Sends the specified modification to the server and commits it.  The operation
 * must be specified, and can be one of 'apply', 'undo', or 'redo'.
 *
 * @param modification object
 *   The object that encapsulates the modification to be applied.
 * @param operation string
 *   Indicates how the modification should be applied - 'apply', 'undo', or
 *   'redo'.
 */
ThemeBuilder.commitModification = function (modification, operation) {
  var $ = jQuery;  

  // If this is a large modification, show the spinner.
  if (modification.getCount() > 8) {
    ThemeBuilder.Bar.getInstance().showWaitIndicator();
  }

  // Do not allow undo/redo operations while commiting changes.
  var key = ThemeBuilder.undoButtons.disable();
  ThemeBuilder.postBack(Drupal.settings.themebuilderCommitPath,
  {
    'operation': operation,
    'modification': JSON.stringify(modification),
    'statusKey' : key
  }, ThemeBuilder.bindIgnoreCallerArgs(ThemeBuilder, ThemeBuilder._commitSuccess, modification, operation));

  // Trigger the ModificationCommitted event to cause the UI to update
  // while the asynchronous server call is processed.
  $(window).trigger('ModificationCommitted', [modification, operation]);
  ThemeBuilder.Bar.getInstance().setChanged(true);
};

/**
 * Called when a modification is successfully committed.
 *
 * @param {Modification} modification
 *   The modification that was committed.
 * @param {String} operation
 *   "apply" if the modification was applied for the first time,
 *   "undo" if the modification was undone, "redo" if the modification
 *   was redone.
 */
ThemeBuilder._commitSuccess = function (modification, operation) {
  if (modification.getCount() > 8) {
    ThemeBuilder.Bar.getInstance().hideWaitIndicator();
  }
};

/**
 * Retrieves the undo and redo stacks from the server and populates the client
 * side stacks.  This is needed only if a page refresh is done.
 */
ThemeBuilder.populateUndoStack = function () {
  ThemeBuilder.getApplicationInstance().addApplicationInitializer(ThemeBuilder._populateUndoStackCallback);
};

/**
 * This is the function that is called when the undo stack data is retrieved
 * from the server.  This function takes the data and populates the undo and
 * redo stacks.
 *
 * @param {object} data
 *   The data returned from the server.
 */
ThemeBuilder._populateUndoStackCallback = function (data) {
  var undoArray = [];
  var redoArray = [];
  var i;
  var modification;
  if (data.undo) {
    undoArray = data.undo;
  }
  if (data.redo) {
    redoArray = data.redo;
  }
  for (i = 0; i < undoArray.length; i++) {
    modification = ThemeBuilder.Modification.fromDescription(undoArray[i]);
    ThemeBuilder.undoStack.push(modification);
  }
  for (i = redoArray.length - 1; i >= 0; i--) {
    modification = ThemeBuilder.Modification.fromDescription(redoArray[i]);
    ThemeBuilder.redoStack.push(modification);
  }
};

/**
 * Applies the specified modification.  The modification will be applied to the
 * browser (usually a CSS change), and the change will be pushed to the server
 * so a subsequent request will result in the theme being rendered with the
 * new modification applied.
 *
 * @param modification object
 *   The modification to apply.
 */
ThemeBuilder.applyModification = function (modification) {
  ThemeBuilder.preview(modification);
  ThemeBuilder.undoStack.push(ThemeBuilder.clone(modification));
  ThemeBuilder.redoStack.clear();
  ThemeBuilder.commitModification(modification, ThemeBuilder.APPLY_MODIFICATION);
};

/**
 * Causes the last committed modification to be reverted.  The modification
 * will be pushed onto the redo stack as a result.
 */
ThemeBuilder.undo = function () {
  var modification = ThemeBuilder.undoStack.pop();
  if (!modification) {
    return;
  }

  ThemeBuilder.preview(modification, false);
  var handler;
  var state = modification.getPriorState();
  if (ThemeBuilder.isArray(state)) {
    for (var i = 0; i < state.length; i++) {
      handler = ThemeBuilder.getModificationHandler(state[i].type);
      if (handler && handler.processModification) {
        handler.processModification(modification, state[i]);
      }
    }
  }
  else {
    handler = ThemeBuilder.getModificationHandler(modification.type);
    if (handler && handler.processModification) {
      handler.processModification(modification, state);
    }
  }

  ThemeBuilder.redoStack.push(modification);
  ThemeBuilder.commitModification(modification, ThemeBuilder.UNDO_MODIFICATION);
};

/**
 * Causes the last modification that was reverted to be applied again.  The
 * modification will be pushed onto the undo stack as a result.
 */
ThemeBuilder.redo = function () {
  var modification = ThemeBuilder.redoStack.pop();
  if (!modification) {
    return;
  }

  ThemeBuilder.preview(modification);
  var handler;
  var state = modification.getNewState();
  if (ThemeBuilder.isArray(state)) {
    for (var i = 0; i < state.length; i++) {
      handler = ThemeBuilder.getModificationHandler(state[i].type);
      if (handler && handler.processModification) {
        handler.processModification(modification, state[i]);
      }
    }
  }
  else {
    handler = ThemeBuilder.getModificationHandler(modification.type);
    if (handler && handler.processModification) {
      handler.processModification(modification, state);
    }
  }

  ThemeBuilder.undoStack.push(modification);
  ThemeBuilder.commitModification(modification, ThemeBuilder.REDO_MODIFICATION);
};

/**
 * Clears both the undo and redo modification stacks on both the client and
 * server.
 *
 * @param {String} theme
 *   The name of the theme for which the stacks should be cleared.
 * @param {function} success
 *   The success callback.
 * @param {function} fail
 *   The fail callback.
 */
ThemeBuilder.clearModificationStacks = function (theme, success, fail) {
  ThemeBuilder.postBack(Drupal.settings.themebuilderClearModificationStacks, {theme: theme}, ThemeBuilder.bind(this, ThemeBuilder._clearModificationStacksSuccess, success), fail);
};

/**
 * This callback is invoked when the undo and redo stacks have been successfully cleared.
 *
 * @param {object} data
 *   The object passed back from the server containing any interesting
 *   information about the processing of the request.
 * @param {String} type
 *   A string that reveals the type of response.  Usually 'success'.
 * @param {Function} callback
 *   The callback that has been registered to let the caller know when
 *   the request was successfully completed.
 */
ThemeBuilder._clearModificationStacksSuccess = function (data, type, callback) {
  ThemeBuilder.undoStack.clear();
  ThemeBuilder.redoStack.clear();
  if (callback) {
    callback();
  }
};

/**
 * Previews a state within a modification.  The state is the result of calling
 * either modification.getPriorState (to preview after reverting the modification)
 * or modification.getNextState (to preview after the modification is applied).
 *
 * @param state object
 *   The state of a modification to preview.
 */
ThemeBuilder._preview = function (state, modification) {
  if (ThemeBuilder.isArray(state)) {
    for (var i = 0; i < state.length; i++) {
      ThemeBuilder._preview(state[i], modification);
    }
  }
  else {
    var handler = ThemeBuilder.getModificationHandler(state.type);
    if (handler) {
      handler.preview(state, modification);
    }
    else {
      throw Drupal.t('Unknown modification type ') + state.type;
    }
  }
};

/**
 * Previews a modification.  A preview consists of showing the modification in
 * the client without committing the change.  If after previewing a modification
 * the user refreshes the display, the change will no longer be apparent.
 *
 * @param {object} modification
 *   The modification to preview.
 * @param {boolean} apply
 *   Optional - indicates whether the modification should be applied (true)
 *   or reverted (false).  By default, apply is true.
 */
ThemeBuilder.preview = function (modification, apply) {
  if (apply === undefined) {
    apply = true;
  }
  var state = apply === true ? modification.getNewState() : modification.getPriorState();
  ThemeBuilder._preview(state, modification);
};
;

/*jslint bitwise: true, eqeqeq: true, immed: true, newcap: true, nomen: false,
 onevar: false, plusplus: false, regexp: true, undef: true, white: true, indent: 2
 browser: true */

/*global jQuery: true Drupal: true ThemeBuilder: true*/

/**
 * The Theme class stores information about a particular theme.  In order to
 * guarantee the data is current, be sure to use the getTheme static function
 * to retrieve the theme instance.
 * @class
 */
ThemeBuilder.Theme = ThemeBuilder.initClass();

/**
 * Creates a new Theme instance.  The themeInfo should contain information
 * that will be used to initialize the theme.  This should include:
 * name - The human readable theme name
 * system_name - The system name for the theme
 * time - (optional) the time the theme was last saved.
 * isBase - (optional) indicates whether this is a base theme.
 *
 * @param {Object} themeInfo
 *   The data used to initialize the new Theme instance.
 */
ThemeBuilder.Theme.prototype.initialize = function (themeInfo) {
  this.update(themeInfo);
};

/**
 * Updates the theme instance with new data contained in the specified
 * themeInfo object.  Note that all of the information is the same as
 * for the initialize method, but all fields are optional.  This method
 * is generally called after saving a theme or publishing a theme to
 * update the theme data with fresh information from the server.
 *
 * @param {Object} themeInfo
 *   The data used to initialize the new Theme instance.
 */
ThemeBuilder.Theme.prototype.update = function (themeInfo) {
  var isPublished = false;
  var isSelected = false;
  if (themeInfo) {
    if (themeInfo.name) {
      this._name = themeInfo.name;
    }
    if (themeInfo.system_name) {
      var data = ThemeBuilder.getApplicationInstance().getData();
      this._systemName = themeInfo.system_name;
      isPublished = (this._systemName === data.published_theme);
      isSelected = (this._systemName === data.selectedTheme);
    }
    if (themeInfo.time) {
      this._time = themeInfo.time;
    }
    if (themeInfo.screenshot_url) {
      this._screenshotUrl = themeInfo.screenshot_url;
    }
    this._isBase = themeInfo.isBase === true;
  }
  this._isPublished = isPublished;
  this._isSelected = isSelected;
};

/**
 * Returns the human readable theme name.
 *
 * @return {String}
 *   The human readable name for this theme instance.
 */
ThemeBuilder.Theme.prototype.getName = function () {
  return this._name;
};

/**
 * Returns the theme system name.
 *
 * @return {String}
 *   The system name used to identify this theme instance.
 */
ThemeBuilder.Theme.prototype.getSystemName = function () {
  return this._systemName;
};

/**
 * Returns the published state of this theme.
 *
 * @return {boolean}
 *   Returns true if this is the published theme; false otherwise.
 */
ThemeBuilder.Theme.prototype.isPublished = function () {
  return this._isPublished;
};

/**
 * Returns the selected state of this theme.  The selected theme is the theme
 * that was cloned to create an edit session.
 *
 * @return {boolean}
 *   Returns true if this is the selected theme; false otherwise.
 */
ThemeBuilder.Theme.prototype.isSelected = function () {
  return this._isSelected;
};

/**
 * Indicates whether this is a base theme or a custom theme.  A base theme
 * cannot be modified (i.e. overwritten), but can be used as the base of a new
 * theme.  A custom theme can be modified.
 *
 * @return {boolean}
 *   Returns true if this is a base theme; false if this is a custom theme.
 */
ThemeBuilder.Theme.prototype.isBaseTheme = function () {
  return this._isBase;
};

/**
 * Deletes the theme associated with this theme instance.
 * 
 * @param {Object} callbacks
 *   Optional parameter that includes callbacks for success and fail
 *   that are called at the appropriate time.
 */
ThemeBuilder.Theme.prototype.deleteTheme = function (callbacks) {
  // TODO: There need to be some checks here - isBaseTheme, isPublished, etc.
  ThemeBuilder.postBack(Drupal.settings.themebuilderDeleteTheme,
    {theme_name: this.getSystemName()},
    ThemeBuilder.bind(this, this._themeDeleted, callbacks),
    ThemeBuilder.bind(this, this._themeDeleteFailed, callbacks));
};

/**
 * Called when the theme is actually deleted on the server side.
 * 
 * @private
 * @param {Object} event
 *   The event.
 * @param {String} result
 *   The type of error
 * @param {Object} callbacks
 *   The callbacks that were passed to the delete call.
 */
ThemeBuilder.Theme.prototype._themeDeleted = function (event, result, callbacks) {
  // Remove the theme inforation for a deleted theme from the application data.
  // updateData is called on the application, triggering a data updated event.
  var deletedThemeName = this.getSystemName(),
      themes = ThemeBuilder.getApplicationInstance().getData().themes,
      remainingThemes = [];
  for (var i = 0, len = themes.length; i < len; i++) {
    if (deletedThemeName !== themes[i].system_name) {
      remainingThemes.push(themes[i]);
    }
  }
  if (remainingThemes.length !== themes.length) {
    ThemeBuilder.getApplicationInstance().updateData({themes: remainingThemes});
    delete ThemeBuilder.Theme._themes[deletedThemeName];
  }
  
  if (callbacks && callbacks.success) {
    callbacks.success(this);
  }
};

/**
 * Called when the theme delete fails.
 *
 * @private
 * @param {Object} error
 *   The error.
 * @param {String} type
 *   The type of error
 * @param {String} level
 *   The error level (usually 'recoverableError')
 * @param {Object} callbacks
 *   The callbacks that were passed to the delete call.
 */
ThemeBuilder.Theme.prototype._themeDeleteFailed = function (event, type, level, callbacks) {
  if (callbacks && callbacks.fail) {
    callbacks.fail(this);
  }
};

/**
 * Publishes the theme associated with this theme instance.
 * 
 * @param {Object} callbacks
 *   Optional parameter that includes callbacks for success and fail
 *   that are called at the appropriate time.
 */
ThemeBuilder.Theme.prototype.publishTheme = function (callbacks) {
  ThemeBuilder.postBack(Drupal.settings.themebuilderPublishTheme,
    {theme_name: this.getSystemName()},
    ThemeBuilder.bind(this, this._themePublished, callbacks),
    ThemeBuilder.bind(this, this._themePublishFailed, callbacks));
};

/**
 * Called when the theme is actually published.
 * 
 * @private
 * @param {Object} result
 *   The result.
 * @param {String} type
 *   The type of error
 * @param {Object} callbacks
 *   The callbacks that were passed to the publish call.
 */
ThemeBuilder.Theme.prototype._themePublished = function (event, result, callbacks) {
  ThemeBuilder.getApplicationInstance().updateData({published_theme: this.getSystemName()});
  if (callbacks && callbacks.success) {
    callbacks.success(this);
  }
};

/**
 * Called when the theme publish fails.
 *
 * @private
 * @param {Object} error
 *   The error.
 * @param {String} type
 *   The type of error
 * @param {String} level
 *   The error level (usually 'recoverableError')
 * @param {Object} callbacks
 *   The callbacks that were passed to the publish call.
 */
ThemeBuilder.Theme.prototype._themePublishFailed = function (event, type, level, callbacks) {
  if (callbacks && callbacks.fail) {
    callbacks.fail(this);
  }
};

/**
 * Returns a ThemeBuilder application representation of a theme
 *
 * @param {Theme} theme
 *   A Theme instance.
 *
 * @return {Object}
 *   A ThemeBuilder application representation of a theme.
 */
ThemeBuilder.Theme.prototype.getThemeInfo = function () {
  return {
    dom_id: "themetile_" + this._systemName,
    isBase: this._isBase,
    is_base: this._isBase,
    name: this._name,
    system_name: this._systemName,
    screenshot_url: this._screenshotUrl
  };
};

/**
 * Copies the theme associated with this theme instance.
 * 
 * @param {String} newThemeName
 *   The name to use for the copy.
 * @param {Object} callbacks
 *   Optional parameter that includes callbacks for success and fail
 *   that are called at the appropriate time.
 */
ThemeBuilder.Theme.prototype.copyTheme = function (newThemeLabel, newThemeName, callbacks) {
  ThemeBuilder.postBack(Drupal.settings.themebuilderCopyTheme,
    {theme_name: this.getSystemName(),
     new_theme_label: newThemeLabel,
     new_theme_name: newThemeName},
    ThemeBuilder.bind(this, this._themeCopied, callbacks),
    ThemeBuilder.bind(this, this._themeCopyFailed, newThemeLabel, callbacks));
};

/**
 * Called when the theme is actually copied on the server side.
 * 
 * @private
 * @param {Object} result
 *   The result.
 * @param {String} type
 *   The type of error
 * @param {Object} callbacks
 *   The callbacks that were passed to the copy call.
 */
ThemeBuilder.Theme.prototype._themeCopied = function (event, result, callbacks) {
  var theme = new ThemeBuilder.Theme(event.theme_info);
  if (theme) {
    theme.addTheme();
  }
  if (callbacks && callbacks.success) {
    callbacks.success({originalTheme: this, newTheme: theme});
  }
};

/**
 * Called when the theme copy fails.
 *
 * @private
 * @param {Object} error
 *   The error.
 * @param {String} type
 *   The type of error
 * @param {String} level
 *   The error level (usually 'recoverableError')
 * @param {String} newThemeName
 *   The name of the new theme that the system failed to create.
 * @param {Object} callbacks
 *   The callbacks that were passed to the copy call.
 */
ThemeBuilder.Theme.prototype._themeCopyFailed = function (event, type, level, newThemeName, callbacks) {
  if (callbacks && callbacks.fail) {
    callbacks.fail({originalTheme: this, newName: newThemeName});
  }
};

/**
 * This static method is called during initialization to create a Theme
 * instance for each theme found on the system.  This function is registered
 * with the Application instance to perform initialization as soon as the
 * initialization data is available.
 *
 * @param {Object} data
 *   The application initialization data.
 */
ThemeBuilder.Theme.initializeThemes = function (data) {
  if (!data.themes || !(data.themes.length > 0)) {
    return;
  }
  var themeCount = data.themes.length;
  ThemeBuilder.Theme._themes = {};

  for (var i = 0; i < themeCount; i++) {
    var theme = new ThemeBuilder.Theme(data.themes[i]);
    if (theme.getSystemName() === data.published_theme) {
      theme._isPublished = true;
    }
    ThemeBuilder.Theme._themes[theme.getSystemName()] = theme;
  }
};

/**
 * Adds this theme instance to the set of themes known to the system.
 * By adding the theme here, other parts of the application will be able to
 * query and retrieve the theme.
 * 
 * Registered application listeners will be notified of theme changes as
 * a result of adding a theme using this method.
 */
ThemeBuilder.Theme.prototype.addTheme = function () {
  // Add this theme to the Theme object list.
  // This triggers the 'save' event
  var name = this.getSystemName();
  ThemeBuilder.Theme._themes[name] = this;
  
  // Push the theme info into the application if it is new i.e. added
  // via save as or theme import
  var app = ThemeBuilder.getApplicationInstance();
  var themes = app.getData().themes;
  var known = false;
  for (var i = 0, len = themes.length; i < len && !known; i++) {
    if (themes[i].system_name === name) {
      // This theme is already in the application.
      known = true;
    }
  }
  // If the application doesn't know about the theme, push the theme info
  if (!known) {
    themes.push(this.getThemeInfo());
    ThemeBuilder.getApplicationInstance().updateData({themes: themes});
  }
};

/**
 * Retrieves the theme identified by the specified systemName.
 *
 * @static
 * @param {String} systemName
 *   The system name associated with the desired theme instance.
 *
 * @return {Theme}
 *   The theme associated with the specified system name, or undefined if that
 *   theme does not exist.
 */
ThemeBuilder.Theme.getTheme = function (systemName) {
  var theme = ThemeBuilder.Theme._themes[systemName];
  if (theme) {
    var data = ThemeBuilder.getApplicationInstance().getData();
    var name = theme.getSystemName();
    theme._isPublished = (name === data.published_theme);
    theme._isSelected = (name === data.selectedTheme);
  }
  return ThemeBuilder.Theme._themes[systemName];
};

/**
 * Retrieves the currently selected theme instance.  The selected theme is the
 * theme that will be overwritten if the user saves.
 *
 * @return {Theme}
 *   The currently selected theme, or undefined if no theme is currently
 *   selected.
 */
ThemeBuilder.Theme.getSelectedTheme = function () {
  var theme;
  var data = ThemeBuilder.getApplicationInstance().getData();
  if (data) {
    theme = ThemeBuilder.Theme.getTheme(data.selectedTheme);
  }
  return theme;
};

/**
 * Retrieves the currently published theme.
 *
 * @return {Theme}
 *   The currently published theme, or undefined if no theme is currently
 *   published.
 */
ThemeBuilder.Theme.getPublishedTheme = function () {
  var theme;
  var data = ThemeBuilder.getApplicationInstance().getData();
  if (data) {
    theme = ThemeBuilder.Theme.getTheme(data.published_theme);
  }
  return theme;
};

/**
 * Causes the themes to be initialized as soon as the application
 * initialization data is available.
 */
ThemeBuilder.getApplicationInstance().addApplicationInitializer(ThemeBuilder.Theme.initializeThemes);;

/*jslint bitwise: true, eqeqeq: true, immed: true, newcap: true, nomen: false,
 onevar: false, plusplus: false, regexp: true, undef: true, white: true, indent: 2
 browser: true */

/*global jQuery: true Drupal: true ThemeBuilder: true*/

/**
 * The PaletteModification is a subclass of the abstract Modification class.  An
 * instance of this class can hold a modification to the global palette such
 * that it can be applied and reverted.
 * @class
 * @extends ThemeBuilder.Modification
 */
ThemeBuilder.PaletteModification = ThemeBuilder.initClass();

// Subclass the Modification class.
ThemeBuilder.PaletteModification.prototype = new ThemeBuilder.Modification();

/**
 * The type string that indicates this is a palette modification.
 */
ThemeBuilder.PaletteModification.TYPE = 'palette';
ThemeBuilder.registerModificationClass('PaletteModification');

/**
 * This static method returns a correctly initialized PaletteModification
 * instance that contains the specified prior state and new state.  Enough
 * checking is performed to ensure that the newly instantiated object is valid.
 *
 * @return
 *   A new instance of PaletteModification that contains the specified prior
 *   state and new state.
 */
ThemeBuilder.PaletteModification.create = function (priorState, newState) {
  if (ThemeBuilder.PaletteModification.TYPE !== priorState.type) {
    throw 'Cannot create a PaletteModification from state type ' + priorState.type;
  }

  var instance = new ThemeBuilder.PaletteModification(priorState.paletteId);
  instance.setPriorState(priorState.paletteId);
  if (newState) {
    instance.setNewState(newState.paletteId);
  }
  return instance;
};

/**
 * The constructor for the PaletteModification class.  This initializes the type
 * and palette id for the modification.  You should never call this method
 * directly, but rather use code such as:
 * <pre>
 *   var modification = new PaletteModification();
 * </pre>
 *
 * @param selector
 *   Where to apply the palette change. For the entire site, this should be
 *   'global'.
 */
ThemeBuilder.PaletteModification.prototype.initialize = function (selector) {
  ThemeBuilder.Modification.prototype.initialize.call(this, selector);
  this.type = ThemeBuilder.PaletteModification.TYPE;
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
ThemeBuilder.PaletteModification.prototype.createState = function (paletteId) {
  return {
    'paletteId' : paletteId
  };
};
;
/*
    http://www.JSON.org/json2.js
    2009-06-29

    Public Domain.

    NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.

    See http://www.JSON.org/js.html

    This file creates a global JSON object containing two methods: stringify
    and parse.

        JSON.stringify(value, replacer, space)
            value       any JavaScript value, usually an object or array.

            replacer    an optional parameter that determines how object
                        values are stringified for objects. It can be a
                        function or an array of strings.

            space       an optional parameter that specifies the indentation
                        of nested structures. If it is omitted, the text will
                        be packed without extra whitespace. If it is a number,
                        it will specify the number of spaces to indent at each
                        level. If it is a string (such as '\t' or '&nbsp;'),
                        it contains the characters used to indent at each level.

            This method produces a JSON text from a JavaScript value.

            When an object value is found, if the object contains a toJSON
            method, its toJSON method will be called and the result will be
            stringified. A toJSON method does not serialize: it returns the
            value represented by the name/value pair that should be serialized,
            or undefined if nothing should be serialized. The toJSON method
            will be passed the key associated with the value, and this will be
            bound to the object holding the key.

            For example, this would serialize Dates as ISO strings.

                Date.prototype.toJSON = function (key) {
                    function f(n) {
                        // Format integers to have at least two digits.
                        return n < 10 ? '0' + n : n;
                    }

                    return this.getUTCFullYear()   + '-' +
                         f(this.getUTCMonth() + 1) + '-' +
                         f(this.getUTCDate())      + 'T' +
                         f(this.getUTCHours())     + ':' +
                         f(this.getUTCMinutes())   + ':' +
                         f(this.getUTCSeconds())   + 'Z';
                };

            You can provide an optional replacer method. It will be passed the
            key and value of each member, with this bound to the containing
            object. The value that is returned from your method will be
            serialized. If your method returns undefined, then the member will
            be excluded from the serialization.

            If the replacer parameter is an array of strings, then it will be
            used to select the members to be serialized. It filters the results
            such that only members with keys listed in the replacer array are
            stringified.

            Values that do not have JSON representations, such as undefined or
            functions, will not be serialized. Such values in objects will be
            dropped; in arrays they will be replaced with null. You can use
            a replacer function to replace those with JSON values.
            JSON.stringify(undefined) returns undefined.

            The optional space parameter produces a stringification of the
            value that is filled with line breaks and indentation to make it
            easier to read.

            If the space parameter is a non-empty string, then that string will
            be used for indentation. If the space parameter is a number, then
            the indentation will be that many spaces.

            Example:

            text = JSON.stringify(['e', {pluribus: 'unum'}]);
            // text is '["e",{"pluribus":"unum"}]'


            text = JSON.stringify(['e', {pluribus: 'unum'}], null, '\t');
            // text is '[\n\t"e",\n\t{\n\t\t"pluribus": "unum"\n\t}\n]'

            text = JSON.stringify([new Date()], function (key, value) {
                return this[key] instanceof Date ?
                    'Date(' + this[key] + ')' : value;
            });
            // text is '["Date(---current time---)"]'


        JSON.parse(text, reviver)
            This method parses a JSON text to produce an object or array.
            It can throw a SyntaxError exception.

            The optional reviver parameter is a function that can filter and
            transform the results. It receives each of the keys and values,
            and its return value is used instead of the original value.
            If it returns what it received, then the structure is not modified.
            If it returns undefined then the member is deleted.

            Example:

            // Parse the text. Values that look like ISO date strings will
            // be converted to Date objects.

            myData = JSON.parse(text, function (key, value) {
                var a;
                if (typeof value === 'string') {
                    a =
/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(value);
                    if (a) {
                        return new Date(Date.UTC(+a[1], +a[2] - 1, +a[3], +a[4],
                            +a[5], +a[6]));
                    }
                }
                return value;
            });

            myData = JSON.parse('["Date(09/09/2001)"]', function (key, value) {
                var d;
                if (typeof value === 'string' &&
                        value.slice(0, 5) === 'Date(' &&
                        value.slice(-1) === ')') {
                    d = new Date(value.slice(5, -1));
                    if (d) {
                        return d;
                    }
                }
                return value;
            });


    This is a reference implementation. You are free to copy, modify, or
    redistribute.

    This code should be minified before deployment.
    See http://javascript.crockford.com/jsmin.html

    USE YOUR OWN COPY. IT IS EXTREMELY UNWISE TO LOAD CODE FROM SERVERS YOU DO
    NOT CONTROL.
*/

/*jslint evil: true */

/*members "", "\b", "\t", "\n", "\f", "\r", "\"", JSON, "\\", apply,
    call, charCodeAt, getUTCDate, getUTCFullYear, getUTCHours,
    getUTCMinutes, getUTCMonth, getUTCSeconds, hasOwnProperty, join,
    lastIndex, length, parse, prototype, push, replace, slice, stringify,
    test, toJSON, toString, valueOf
*/

// Create a JSON object only if one does not already exist. We create the
// methods in a closure to avoid creating global variables.

var JSON = JSON || {};

(function () {

    function f(n) {
        // Format integers to have at least two digits.
        return n < 10 ? '0' + n : n;
    }

    if (typeof Date.prototype.toJSON !== 'function') {

        Date.prototype.toJSON = function (key) {

            return isFinite(this.valueOf()) ?
                   this.getUTCFullYear()   + '-' +
                 f(this.getUTCMonth() + 1) + '-' +
                 f(this.getUTCDate())      + 'T' +
                 f(this.getUTCHours())     + ':' +
                 f(this.getUTCMinutes())   + ':' +
                 f(this.getUTCSeconds())   + 'Z' : null;
        };

        String.prototype.toJSON =
        Number.prototype.toJSON =
        Boolean.prototype.toJSON = function (key) {
            return this.valueOf();
        };
    }

    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        gap,
        indent,
        meta = {    // table of character substitutions
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '"' : '\\"',
            '\\': '\\\\'
        },
        rep;


    function quote(string) {

// If the string contains no control characters, no quote characters, and no
// backslash characters, then we can safely slap some quotes around it.
// Otherwise we must also replace the offending characters with safe escape
// sequences.

        escapable.lastIndex = 0;
        return escapable.test(string) ?
            '"' + string.replace(escapable, function (a) {
                var c = meta[a];
                return typeof c === 'string' ? c :
                    '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
            }) + '"' :
            '"' + string + '"';
    }


    function str(key, holder) {

// Produce a string from holder[key].

        var i,          // The loop counter.
            k,          // The member key.
            v,          // The member value.
            length,
            mind = gap,
            partial,
            value = holder[key];

// If the value has a toJSON method, call it to obtain a replacement value.

        if (value && typeof value === 'object' &&
                typeof value.toJSON === 'function') {
            value = value.toJSON(key);
        }

// If we were called with a replacer function, then call the replacer to
// obtain a replacement value.

        if (typeof rep === 'function') {
            value = rep.call(holder, key, value);
        }

// What happens next depends on the value's type.

        switch (typeof value) {
        case 'string':
            return quote(value);

        case 'number':

// JSON numbers must be finite. Encode non-finite numbers as null.

            return isFinite(value) ? String(value) : 'null';

        case 'boolean':
        case 'null':

// If the value is a boolean or null, convert it to a string. Note:
// typeof null does not produce 'null'. The case is included here in
// the remote chance that this gets fixed someday.

            return String(value);

// If the type is 'object', we might be dealing with an object or an array or
// null.

        case 'object':

// Due to a specification blunder in ECMAScript, typeof null is 'object',
// so watch out for that case.

            if (!value) {
                return 'null';
            }

// Make an array to hold the partial results of stringifying this object value.

            gap += indent;
            partial = [];

// Is the value an array?

            if (Object.prototype.toString.apply(value) === '[object Array]') {

// The value is an array. Stringify every element. Use null as a placeholder
// for non-JSON values.

                length = value.length;
                for (i = 0; i < length; i += 1) {
                    partial[i] = str(i, value) || 'null';
                }

// Join all of the elements together, separated with commas, and wrap them in
// brackets.

                v = partial.length === 0 ? '[]' :
                    gap ? '[\n' + gap +
                            partial.join(',\n' + gap) + '\n' +
                                mind + ']' :
                          '[' + partial.join(',') + ']';
                gap = mind;
                return v;
            }

// If the replacer is an array, use it to select the members to be stringified.

            if (rep && typeof rep === 'object') {
                length = rep.length;
                for (i = 0; i < length; i += 1) {
                    k = rep[i];
                    if (typeof k === 'string') {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            } else {

// Otherwise, iterate through all of the keys in the object.

                for (k in value) {
                    if (Object.hasOwnProperty.call(value, k)) {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            }

// Join all of the member texts together, separated with commas,
// and wrap them in braces.

            v = partial.length === 0 ? '{}' :
                gap ? '{\n' + gap + partial.join(',\n' + gap) + '\n' +
                        mind + '}' : '{' + partial.join(',') + '}';
            gap = mind;
            return v;
        }
    }

// If the JSON object does not yet have a stringify method, give it one.

    if (typeof JSON.stringify !== 'function') {
        JSON.stringify = function (value, replacer, space) {

// The stringify method takes a value and an optional replacer, and an optional
// space parameter, and returns a JSON text. The replacer can be a function
// that can replace values, or an array of strings that will select the keys.
// A default replacer method can be provided. Use of the space parameter can
// produce text that is more easily readable.

            var i;
            gap = '';
            indent = '';

// If the space parameter is a number, make an indent string containing that
// many spaces.

            if (typeof space === 'number') {
                for (i = 0; i < space; i += 1) {
                    indent += ' ';
                }

// If the space parameter is a string, it will be used as the indent string.

            } else if (typeof space === 'string') {
                indent = space;
            }

// If there is a replacer, it must be a function or an array.
// Otherwise, throw an error.

            rep = replacer;
            if (replacer && typeof replacer !== 'function' &&
                    (typeof replacer !== 'object' ||
                     typeof replacer.length !== 'number')) {
                throw new Error('JSON.stringify');
            }

// Make a fake root object containing our value under the key of ''.
// Return the result of stringifying the value.

            return str('', {'': value});
        };
    }


// If the JSON object does not yet have a parse method, give it one.

    if (typeof JSON.parse !== 'function') {
        JSON.parse = function (text, reviver) {

// The parse method takes a text and an optional reviver function, and returns
// a JavaScript value if the text is a valid JSON text.

            var j;

            function walk(holder, key) {

// The walk method is used to recursively walk the resulting structure so
// that modifications can be made.

                var k, v, value = holder[key];
                if (value && typeof value === 'object') {
                    for (k in value) {
                        if (Object.hasOwnProperty.call(value, k)) {
                            v = walk(value, k);
                            if (v !== undefined) {
                                value[k] = v;
                            } else {
                                delete value[k];
                            }
                        }
                    }
                }
                return reviver.call(holder, key, value);
            }


// Parsing happens in four stages. In the first stage, we replace certain
// Unicode characters with escape sequences. JavaScript handles many characters
// incorrectly, either silently deleting them, or treating them as line endings.

            cx.lastIndex = 0;
            if (cx.test(text)) {
                text = text.replace(cx, function (a) {
                    return '\\u' +
                        ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                });
            }

// In the second stage, we run the text against regular expressions that look
// for non-JSON patterns. We are especially concerned with '()' and 'new'
// because they can cause invocation, and '=' because it can cause mutation.
// But just to be safe, we want to reject all unexpected forms.

// We split the second stage into 4 regexp operations in order to work around
// crippling inefficiencies in IE's and Safari's regexp engines. First we
// replace the JSON backslash pairs with '@' (a non-JSON character). Second, we
// replace all simple value tokens with ']' characters. Third, we delete all
// open brackets that follow a colon or comma or that begin the text. Finally,
// we look to see that the remaining characters are only whitespace or ']' or
// ',' or ':' or '{' or '}'. If that is so, then the text is safe for eval.

            if (/^[\],:{}\s]*$/.
test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@').
replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').
replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

// In the third stage we use the eval function to compile the text into a
// JavaScript structure. The '{' operator is subject to a syntactic ambiguity
// in JavaScript: it can begin a block or an object literal. We wrap the text
// in parens to eliminate the ambiguity.

                j = eval('(' + text + ')');

// In the optional fourth stage, we recursively walk the new structure, passing
// each name/value pair to a reviver function for possible transformation.

                return typeof reviver === 'function' ?
                    walk({'': j}, '') : j;
            }

// If the text is not JSON parseable, then a SyntaxError is thrown.

            throw new SyntaxError('JSON.parse');
        };
    }
}());
;

/**
 * Cookie plugin 1.0
 *
 * Copyright (c) 2006 Klaus Hartl (stilbuero.de)
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 *
 */
jQuery.cookie=function(b,j,m){if(typeof j!="undefined"){m=m||{};if(j===null){j="";m.expires=-1}var e="";if(m.expires&&(typeof m.expires=="number"||m.expires.toUTCString)){var f;if(typeof m.expires=="number"){f=new Date();f.setTime(f.getTime()+(m.expires*24*60*60*1000))}else{f=m.expires}e="; expires="+f.toUTCString()}var l=m.path?"; path="+(m.path):"";var g=m.domain?"; domain="+(m.domain):"";var a=m.secure?"; secure":"";document.cookie=[b,"=",encodeURIComponent(j),e,l,g,a].join("")}else{var d=null;if(document.cookie&&document.cookie!=""){var k=document.cookie.split(";");for(var h=0;h<k.length;h++){var c=jQuery.trim(k[h]);if(c.substring(0,b.length+1)==(b+"=")){d=decodeURIComponent(c.substring(b.length+1));break}}}return d}};
;
/*jslint bitwise: true, eqeqeq: true, immed: true, newcap: true, nomen: false,
 onevar: false, plusplus: false, regexp: true, undef: true, white: true, indent: 2
 browser: true */

/*global jQuery: true Drupal: true window: true ThemeBuilder: true */

(function ($) {
  /**
   * Override the default behavior and style by moving the edit gear to the left
   * of the element and outside the content area.
   *
   * Adds edge detection so that the links aren't displaying off screen
   */

  Drupal.contextualFlyoutLinks = Drupal.contextualFlyoutLinks || {};

  /**
   * UI interaction delay timeout IDs are stored in the delayTimeouts array
   */
  Drupal.contextualFlyoutLinks.delayTimeouts = [];


  Drupal.behaviors.contextualFlyoutLinks = {
    attach: function (context, settings) {
      // Set up contextual links for logged in users, but not when the themebuilder is open
      if ($('body').hasClass('logged-in') && !$('body').hasClass('themebuilder')) {
        // Create the proxy links overlay
        // This will contain the contextual links and be placed over the
        // active contextual links region
        var $proxy = $('<div>', {
          style: "display:none"
        })
        .once('contextual-links-region-proxy', function (context, settings) {
          $(this).bind('mouseleave.contextualFlyoutLinks',
            {
              'functions': [
                {
                  'action': Drupal.contextualFlyoutLinks.deactivateProxy,
                  'delay': 300
                }
              ]
            }, Drupal.contextualFlyoutLinks.createDelay)  
          .addClass('contextual-links-region-proxy')
          .prependTo('body');
        });
        // Set up the outlines that surround the hovered page element.
        var $box = $('<div>').once('contextual-links-region-proxy-outline-top', function (context, settings) {
          $(this).addClass('contextual-links-region-proxy-outline outline-top').insertAfter($proxy);
        });
        $box = $('<div>').once('contextual-links-region-proxy-outline-right', function (context, settings) {
          $(this).addClass('contextual-links-region-proxy-outline outline-right').insertAfter($box);
        });
        $box = $('<div>').once('contextual-links-region-proxy-outline-bottom', function (context, settings) {
          $(this).addClass('contextual-links-region-proxy-outline outline-bottom').insertAfter($box);
        });
        $('<div>').once('contextual-links-region-proxy-outline-left', function (context, settings) {
          $(this).addClass('contextual-links-region-proxy-outline outline-left').insertAfter($box);
        });

        // Process each instance of a contextual link set
        $('div.contextual-links-wrapper', context).once('contextual-flyout-links', function () {
          var $wrapper = $(this);
          var $region = $wrapper.closest('div.contextual-links-region');
          var $trigger = $('<a>', {
            href: '#',
            text: Drupal.t('Configure')
          }).addClass('contextual-links-trigger');
          $wrapper.prepend($trigger);
          Drupal.contextualFlyoutLinks.establishBindings($region, $wrapper);
          // Hide the core contextual links. We keep them in the DOM for accessibility.
          $wrapper.hide();
        });
      }
    }
  };
  
  Drupal.contextualFlyoutLinks.establishBindings = function ($region, $wrapper) {
    var $proxy = $('.contextual-links-region-proxy');

    // Listen for events
    $region.bind('mouseenter.contextualFlyoutLinks',
      {
        'region': $region,
        'wrapper': $wrapper,
        'functions': [
          {'action': Drupal.contextualFlyoutLinks.activateProxy, 'delay': 150 }
        ]
      }, Drupal.contextualFlyoutLinks.createDelay);
    $region.bind('mouseleave.contextualFlyoutLinks',
      {
        'region': $region,
        'wrapper': $wrapper,
        'functions': [
          {'action': Drupal.contextualFlyoutLinks.deactivateProxy, 'delay': 350 }
        ]
      }, Drupal.contextualFlyoutLinks.createDelay);
  };

  Drupal.contextualFlyoutLinks.activateProxy = function (event) {
    // Get the contextual links proxy and empty it of any links already in it
    var $proxy = $('.contextual-links-region-proxy');
    $proxy.hide().empty();

    // Clone the current contextual links and add them to the proxy region
    var $contextLinks = event.data.wrapper.clone();
    // Remove any inlined styling.
    $contextLinks.removeAttr('style');
    $contextLinks.appendTo($proxy);

    // Get the offset of the original region and position the proxy over it
    var $region = event.data.region;

    //Place the proxy
    Drupal.contextualFlyoutLinks.placeProxy($proxy, $region);

    // Get the trigger and the links to bind events to them.
    var $trigger = $('.contextual-links-trigger', $proxy),
        $links = $('.contextual-links', $proxy);

    // Establish bindings
    // Close the proxy if a contextual action link is clicked
    $('a', $links).bind('click.contextualFlyoutLinks',
      {},
      Drupal.contextualFlyoutLinks.deactivateProxy);
    // Show the links when the gear is hovered
    $trigger.bind('mouseenter.contextualFlyoutLinks',
      {
        'functions': [
          { 'action': Drupal.contextualFlyoutLinks.showLinks,
            'delay': 150
          }
        ]
      }, Drupal.contextualFlyoutLinks.createDelay);
    // Hide the links when the user mouses out
    $links.bind('mouseleave.contextualFlyoutLinks',
      {
        'functions': [
          { 'action': Drupal.contextualFlyoutLinks.hideLinks,
            'delay': 50
          }
        ]
      }, Drupal.contextualFlyoutLinks.createDelay);

    // Show the proxy and dotted lines
    $proxy.nextAll('.contextual-links-region-proxy-outline').andSelf().show();

    // Check for collision of the gear icon with the viewport edge
    event.data.element = $trigger;
    Drupal.contextualFlyoutLinks.queueEdgeCollisionCorrection(event);
  };
  Drupal.contextualFlyoutLinks.deactivateProxy = function (event) {
    $('.contextual-links-region-proxy').nextAll('.contextual-links-region-proxy-outline').andSelf().hide();
  };
  Drupal.contextualFlyoutLinks.placeProxy = function ($proxy, $region) {
    if ($proxy && $region) {
      var offset = $region.offset(),
          regionWidth = $region.width(),
          regionHeight = $region.height();

      // Place the proxy element
      $proxy
        .css({
          'left' : offset.left,
          'top' : offset.top,
          'width' : $region.width(),
          'height' : 0
        });

      // Place the dotted outlines. The 'spacing' and 'adjust' add a little
      // space between the dotted lines and the content.
      var spacing = 3,
          adjust = 1;
      $('.contextual-links-region-proxy-outline.outline-top').css({
        'left': (offset.left - adjust),
        'height': '1px',
        'top': (offset.top - adjust),
        'width': (regionWidth + spacing)
      });
      $('.contextual-links-region-proxy-outline.outline-right').css({
        'left': (offset.left + regionWidth + adjust),
        'height': (regionHeight + spacing),
        'top': (offset.top - adjust),
        'width': '1px'
      });
      $('.contextual-links-region-proxy-outline.outline-bottom').css({
        'left': (offset.left - adjust),
        'height': '1px',
        'top': (offset.top + regionHeight + adjust),
        'width': (regionWidth + spacing)
      });
      $('.contextual-links-region-proxy-outline.outline-left').css({
        'left': (offset.left - adjust),
        'height': (regionHeight + spacing),
        'top': (offset.top - adjust),
        'width': '1px'
      });
      return true;
    }
    return false;
  };
  Drupal.contextualFlyoutLinks.showLinks = function (event) {
    var $links = $(event.currentTarget).next();
    event.data.element = $links;
    // Setting the visibility to hidden hides the element, but allows us to get
    // measurements for placement because it renders invisibly.
    $links.css('visibility', 'hidden');
    // Remove the display:none so that we can measure the element
    $links.show();
    // Check for collision of the links with the viewport edge
    Drupal.contextualFlyoutLinks.queueEdgeCollisionCorrection(event);
    // Hide this element before removing the invisibility
    $links.hide();
    // Remove the invisibility
    $links.css('visibility', 'visible');
    // Slide down and reveal
    $links.slideDown(125);
  };
  Drupal.contextualFlyoutLinks.hideLinks = function (event) {
    $(event.currentTarget).slideUp(200);
  };
  Drupal.contextualFlyoutLinks.createDelay = function (event) {
    // Clear the existing timeouts first
    Drupal.contextualFlyoutLinks.destroyDelay();
    // Go through the functions passed in the event and call them with their
    // designated delay.
    for (var i = 0; i < event.data.functions.length; i++) {
      var delay = event.data.functions[i].delay || 500;
      var action = event.data.functions[i].action;
      // @todo This implementation suffers from improper handling of closures
      // when calling the setTimeout function. It works now because only
      // one function is ever called, even though the loop is present to
      // support more than one function being passed in on event.data.functions.
      // A more robust approach that deals with the function closure is needed.
      Drupal.contextualFlyoutLinks.delayTimeouts.unshift(setTimeout(function () {
          action(event);
          event = null;
        }, delay)
      );
    }
  };
  Drupal.contextualFlyoutLinks.destroyDelay = function () {
    // Go through the timeout IDs and clear them
    while (Drupal.contextualFlyoutLinks.delayTimeouts.length > 0) {
      clearTimeout(Drupal.contextualFlyoutLinks.delayTimeouts.pop());
    }
  };
  Drupal.contextualFlyoutLinks.queueEdgeCollisionCorrection = function (event) {
    // Queue the collision detection after any animations that may be
    // associated with the links
    event.data.element.queue(function (next) {
      // If the object was just hidden, we don't need to act on it further. Just return out.
      if (event.data.element.is(':hidden')) {
        // Call the next animation in the fx queue and return
        next();
        return false;
      }
      // If the element is visible, attempt to correct any edge collision
      Drupal.contextualFlyoutLinks.correctEdgeCollision(event);
      // Call the next animation in the fx queue
      next();
      return true;
    });
  };
  Drupal.contextualFlyoutLinks.correctEdgeCollision = function (event) {
    // Check for RTL setting
    var isRTL = ($('html').attr('dir') === 'rtl'),
        isLinks = event.data.element.is('.contextual-links'),
        isTrigger = event.data.element.is('.contextual-links-trigger');
    // Remove the edge-collision class if it exists before we determine a collision
    if (isTrigger) {
      event.data.element.parent().removeClass('edge-collision');
    }
    if (isLinks) {
      event.data.element.removeClass('edge-collision');
    }
    // Get the dimensions of the element and the viewport
    var element = {
        offset: event.data.element.offset(),
        dimensions: {
          width: event.data.element.outerWidth(false)
        }
      },
      viewport = {
        dimensions: {
          width: $('html').width()
        }
      };
    // Determine if the element is rendered outside the viewport
    var isCollided = ((!isRTL && element.offset.left < 0) || (isRTL && ((element.offset.left + element.dimensions.width) > viewport.dimensions.width)));

    // If the left edge of the links is outside the viewport, move them inside the content; or,
    // If the right edge of the links is outside the viewport, move them inside the content
    if (isCollided && isLinks) {
      event.data.element.addClass('edge-collision');
    }
    // If the trigger has collided with the window edge, mark its parent as having collided
    if (isCollided && isTrigger) {
      event.data.element.parent().addClass('edge-collision');
    }
  };
}(jQuery));
;
// ColorBox v1.3.17.2 - a full featured, light-weight, customizable lightbox based on jQuery 1.3+
// Copyright (c) 2011 Jack Moore - jack@colorpowered.com
// Licensed under the MIT license: http://www.opensource.org/licenses/mit-license.php
(function(a,b,c){function bc(b){if(!U){P=b,_(),y=a(P),Q=0,K.rel!=="nofollow"&&(y=a("."+g).filter(function(){var b=a.data(this,e).rel||this.rel;return b===K.rel}),Q=y.index(P),Q===-1&&(y=y.add(P),Q=y.length-1));if(!S){S=T=!0,r.show();if(K.returnFocus)try{P.blur(),a(P).one(l,function(){try{this.focus()}catch(a){}})}catch(c){}q.css({opacity:+K.opacity,cursor:K.overlayClose?"pointer":"auto"}).show(),K.w=Z(K.initialWidth,"x"),K.h=Z(K.initialHeight,"y"),X.position(),o&&z.bind("resize."+p+" scroll."+p,function(){q.css({width:z.width(),height:z.height(),top:z.scrollTop(),left:z.scrollLeft()})}).trigger("resize."+p),ba(h,K.onOpen),J.add(D).hide(),I.html(K.close).show()}X.load(!0)}}function bb(){var a,b=f+"Slideshow_",c="click."+f,d,e,g;K.slideshow&&y[1]?(d=function(){F.text(K.slideshowStop).unbind(c).bind(j,function(){if(Q<y.length-1||K.loop)a=setTimeout(X.next,K.slideshowSpeed)}).bind(i,function(){clearTimeout(a)}).one(c+" "+k,e),r.removeClass(b+"off").addClass(b+"on"),a=setTimeout(X.next,K.slideshowSpeed)},e=function(){clearTimeout(a),F.text(K.slideshowStart).unbind([j,i,k,c].join(" ")).one(c,d),r.removeClass(b+"on").addClass(b+"off")},K.slideshowAuto?d():e()):r.removeClass(b+"off "+b+"on")}function ba(b,c){c&&c.call(P),a.event.trigger(b)}function _(b){K=a.extend({},a.data(P,e));for(b in K)a.isFunction(K[b])&&b.substring(0,2)!=="on"&&(K[b]=K[b].call(P));K.rel=K.rel||P.rel||"nofollow",K.href=K.href||a(P).attr("href"),K.title=K.title||P.title,typeof K.href=="string"&&(K.href=a.trim(K.href))}function $(a){return K.photo||/\.(gif|png|jpg|jpeg|bmp)(?:\?([^#]*))?(?:#(\.*))?$/i.test(a)}function Z(a,b){return Math.round((/%/.test(a)?(b==="x"?z.width():z.height())/100:1)*parseInt(a,10))}function Y(c,d,e){e=b.createElement("div"),c&&(e.id=f+c),e.style.cssText=d||"";return a(e)}var d={transition:"elastic",speed:300,width:!1,initialWidth:"600",innerWidth:!1,maxWidth:!1,height:!1,initialHeight:"450",innerHeight:!1,maxHeight:!1,scalePhotos:!0,scrolling:!0,inline:!1,html:!1,iframe:!1,fastIframe:!0,photo:!1,href:!1,title:!1,rel:!1,opacity:.9,preloading:!0,current:"image {current} of {total}",previous:"previous",next:"next",close:"close",open:!1,returnFocus:!0,loop:!0,slideshow:!1,slideshowAuto:!0,slideshowSpeed:2500,slideshowStart:"start slideshow",slideshowStop:"stop slideshow",onOpen:!1,onLoad:!1,onComplete:!1,onCleanup:!1,onClosed:!1,overlayClose:!0,escKey:!0,arrowKey:!0,top:!1,bottom:!1,left:!1,right:!1,fixed:!1,data:!1},e="colorbox",f="cbox",g=f+"Element",h=f+"_open",i=f+"_load",j=f+"_complete",k=f+"_cleanup",l=f+"_closed",m=f+"_purge",n=a.browser.msie&&!a.support.opacity,o=n&&a.browser.version<7,p=f+"_IE6",q,r,s,t,u,v,w,x,y,z,A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X;X=a.fn[e]=a[e]=function(b,c){var f=this;b=b||{};if(!f[0]){if(f.selector)return f;f=a("<a/>"),b.open=!0}c&&(b.onComplete=c),f.each(function(){a.data(this,e,a.extend({},a.data(this,e)||d,b)),a(this).addClass(g)}),(a.isFunction(b.open)&&b.open.call(f)||b.open)&&bc(f[0]);return f},X.init=function(){z=a(c),r=Y().attr({id:e,"class":n?f+(o?"IE6":"IE"):""}),q=Y("Overlay",o?"position:absolute":"").hide(),s=Y("Wrapper"),t=Y("Content").append(A=Y("LoadedContent","width:0; height:0; overflow:hidden"),C=Y("LoadingOverlay").add(Y("LoadingGraphic")),D=Y("Title"),E=Y("Current"),G=Y("Next"),H=Y("Previous"),F=Y("Slideshow").bind(h,bb),I=Y("Close")),s.append(Y().append(Y("TopLeft"),u=Y("TopCenter"),Y("TopRight")),Y(!1,"clear:left").append(v=Y("MiddleLeft"),t,w=Y("MiddleRight")),Y(!1,"clear:left").append(Y("BottomLeft"),x=Y("BottomCenter"),Y("BottomRight"))).children().children().css({"float":"left"}),B=Y(!1,"position:absolute; width:9999px; visibility:hidden; display:none"),a("body").prepend(q,r.append(s,B)),t.children().hover(function(){a(this).addClass("hover")},function(){a(this).removeClass("hover")}).addClass("hover"),L=u.height()+x.height()+t.outerHeight(!0)-t.height(),M=v.width()+w.width()+t.outerWidth(!0)-t.width(),N=A.outerHeight(!0),O=A.outerWidth(!0),r.css({"padding-bottom":L,"padding-right":M}).hide(),G.click(function(){X.next()}),H.click(function(){X.prev()}),I.click(function(){X.close()}),J=G.add(H).add(E).add(F),t.children().removeClass("hover"),q.click(function(){K.overlayClose&&X.close()}),a(b).bind("keydown."+f,function(a){var b=a.keyCode;S&&K.escKey&&b===27&&(a.preventDefault(),X.close()),S&&K.arrowKey&&y[1]&&(b===37?(a.preventDefault(),H.click()):b===39&&(a.preventDefault(),G.click()))})},X.remove=function(){r.add(q).remove(),a("."+g).removeData(e).removeClass(g)},X.position=function(a,c){function g(a){u[0].style.width=x[0].style.width=t[0].style.width=a.style.width,C[0].style.height=C[1].style.height=t[0].style.height=v[0].style.height=w[0].style.height=a.style.height}var d=0,e=0;z.unbind("resize."+f),r.hide(),K.fixed&&!o?r.css({position:"fixed"}):(d=z.scrollTop(),e=z.scrollLeft(),r.css({position:"absolute"})),K.right!==!1?e+=Math.max(z.width()-K.w-O-M-Z(K.right,"x"),0):K.left!==!1?e+=Z(K.left,"x"):e+=Math.round(Math.max(z.width()-K.w-O-M,0)/2),K.bottom!==!1?d+=Math.max(b.documentElement.clientHeight-K.h-N-L-Z(K.bottom,"y"),0):K.top!==!1?d+=Z(K.top,"y"):d+=Math.round(Math.max(b.documentElement.clientHeight-K.h-N-L,0)/2),r.show(),a=r.width()===K.w+O&&r.height()===K.h+N?0:a||0,s[0].style.width=s[0].style.height="9999px",r.dequeue().animate({width:K.w+O,height:K.h+N,top:d,left:e},{duration:a,complete:function(){g(this),T=!1,s[0].style.width=K.w+O+M+"px",s[0].style.height=K.h+N+L+"px",c&&c(),setTimeout(function(){z.bind("resize."+f,X.position)},1)},step:function(){g(this)}})},X.resize=function(a){if(S){a=a||{},a.width&&(K.w=Z(a.width,"x")-O-M),a.innerWidth&&(K.w=Z(a.innerWidth,"x")),A.css({width:K.w}),a.height&&(K.h=Z(a.height,"y")-N-L),a.innerHeight&&(K.h=Z(a.innerHeight,"y"));if(!a.innerHeight&&!a.height){var b=A.wrapInner("<div style='overflow:auto'></div>").children();K.h=b.height(),b.replaceWith(b.children())}A.css({height:K.h}),X.position(K.transition==="none"?0:K.speed)}},X.prep=function(b){function h(){K.h=K.h||A.height(),K.h=K.mh&&K.mh<K.h?K.mh:K.h;return K.h}function g(){K.w=K.w||A.width(),K.w=K.mw&&K.mw<K.w?K.mw:K.w;return K.w}if(!!S){var c,d=K.transition==="none"?0:K.speed;A.remove(),A=Y("LoadedContent").append(b),A.hide().appendTo(B.show()).css({width:g(),overflow:K.scrolling?"auto":"hidden"}).css({height:h()}).prependTo(t),B.hide(),a(R).css({"float":"none"}),o&&a("select").not(r.find("select")).filter(function(){return this.style.visibility!=="hidden"}).css({visibility:"hidden"}).one(k,function(){this.style.visibility="inherit"}),c=function(){function o(){n&&r[0].style.removeAttribute("filter")}var b,c,g,h,i=y.length,k,l;!S||(l=function(){clearTimeout(W),C.hide(),ba(j,K.onComplete)},n&&R&&A.fadeIn(100),D.html(K.title).add(A).show(),i>1?(typeof K.current=="string"&&E.html(K.current.replace("{current}",Q+1).replace("{total}",i)).show(),G[K.loop||Q<i-1?"show":"hide"]().html(K.next),H[K.loop||Q?"show":"hide"]().html(K.previous),b=Q?y[Q-1]:y[i-1],g=Q<i-1?y[Q+1]:y[0],K.slideshow&&F.show(),K.preloading&&(h=a.data(g,e).href||g.href,c=a.data(b,e).href||b.href,h=a.isFunction(h)?h.call(g):h,c=a.isFunction(c)?c.call(b):c,$(h)&&(a("<img/>")[0].src=h),$(c)&&(a("<img/>")[0].src=c))):J.hide(),K.iframe?(k=a("<iframe/>").addClass(f+"Iframe")[0],K.fastIframe?l():a(k).one("load",l),k.name=f+ +(new Date),k.src=K.href,K.scrolling||(k.scrolling="no"),n&&(k.frameBorder=0,k.allowTransparency="true"),a(k).appendTo(A).one(m,function(){k.src="//about:blank"})):l(),K.transition==="fade"?r.fadeTo(d,1,o):o())},K.transition==="fade"?r.fadeTo(d,0,function(){X.position(0,c)}):X.position(d,c)}},X.load=function(b){var c,d,e=X.prep;T=!0,R=!1,P=y[Q],b||_(),ba(m),ba(i,K.onLoad),K.h=K.height?Z(K.height,"y")-N-L:K.innerHeight&&Z(K.innerHeight,"y"),K.w=K.width?Z(K.width,"x")-O-M:K.innerWidth&&Z(K.innerWidth,"x"),K.mw=K.w,K.mh=K.h,K.maxWidth&&(K.mw=Z(K.maxWidth,"x")-O-M,K.mw=K.w&&K.w<K.mw?K.w:K.mw),K.maxHeight&&(K.mh=Z(K.maxHeight,"y")-N-L,K.mh=K.h&&K.h<K.mh?K.h:K.mh),c=K.href,W=setTimeout(function(){C.show()},100),K.inline?(Y().hide().insertBefore(a(c)[0]).one(m,function(){a(this).replaceWith(A.children())}),e(a(c))):K.iframe?e(" "):K.html?e(K.html):$(c)?(a(R=new Image).addClass(f+"Photo").error(function(){K.title=!1,e(Y("Error").text("This image could not be loaded"))}).load(function(){var a;R.onload=null,K.scalePhotos&&(d=function(){R.height-=R.height*a,R.width-=R.width*a},K.mw&&R.width>K.mw&&(a=(R.width-K.mw)/R.width,d()),K.mh&&R.height>K.mh&&(a=(R.height-K.mh)/R.height,d())),K.h&&(R.style.marginTop=Math.max(K.h-R.height,0)/2+"px"),y[1]&&(Q<y.length-1||K.loop)&&(R.style.cursor="pointer",R.onclick=function(){X.next()}),n&&(R.style.msInterpolationMode="bicubic"),setTimeout(function(){e(R)},1)}),setTimeout(function(){R.src=c},1)):c&&B.load(c,K.data,function(b,c,d){e(c==="error"?Y("Error").text("Request unsuccessful: "+d.statusText):a(this).contents())})},X.next=function(){!T&&y[1]&&(Q<y.length-1||K.loop)&&(Q=Q<y.length-1?Q+1:0,X.load())},X.prev=function(){!T&&y[1]&&(Q||K.loop)&&(Q=Q?Q-1:y.length-1,X.load())},X.close=function(){S&&!U&&(U=!0,S=!1,ba(k,K.onCleanup),z.unbind("."+f+" ."+p),q.fadeTo(200,0),r.stop().fadeTo(300,0,function(){r.add(q).css({opacity:1,cursor:"auto"}).hide(),ba(m),A.remove(),setTimeout(function(){U=!1,ba(l,K.onClosed)},1)}))},X.element=function(){return a(P)},X.settings=d,V=function(a){a.button!==0&&typeof a.button!="undefined"||a.ctrlKey||a.shiftKey||a.altKey||(a.preventDefault(),bc(this))},a.fn.delegate?a(b).delegate("."+g,"click",V):a("."+g).live("click",V),a(X.init)})(jQuery,document,this);;
(function ($) {

/**
 * Provides Ajax page updating via jQuery $.ajax (Asynchronous JavaScript and XML).
 *
 * Ajax is a method of making a request via JavaScript while viewing an HTML
 * page. The request returns an array of commands encoded in JSON, which is
 * then executed to make any changes that are necessary to the page.
 *
 * Drupal uses this file to enhance form elements with #ajax['path'] and
 * #ajax['wrapper'] properties. If set, this file will automatically be included
 * to provide Ajax capabilities.
 */

Drupal.ajax = Drupal.ajax || {};

/**
 * Attaches the Ajax behavior to each Ajax form element.
 */
Drupal.behaviors.AJAX = {
  attach: function (context, settings) {
    // Load all Ajax behaviors specified in the settings.
    for (var base in settings.ajax) {
      if (!$('#' + base + '.ajax-processed').length) {
        var element_settings = settings.ajax[base];

        if (typeof element_settings.selector == 'undefined') {
          element_settings.selector = '#' + base;
        }
        $(element_settings.selector).each(function () {
          element_settings.element = this;
          Drupal.ajax[base] = new Drupal.ajax(base, this, element_settings);
        });

        $('#' + base).addClass('ajax-processed');
      }
    }

    // Bind Ajax behaviors to all items showing the class.
    $('.use-ajax:not(.ajax-processed)').addClass('ajax-processed').each(function () {
      var element_settings = {};
      // Clicked links look better with the throbber than the progress bar.
      element_settings.progress = { 'type': 'throbber' };

      // For anchor tags, these will go to the target of the anchor rather
      // than the usual location.
      if ($(this).attr('href')) {
        element_settings.url = $(this).attr('href');
        element_settings.event = 'click';
      }
      var base = $(this).attr('id');
      Drupal.ajax[base] = new Drupal.ajax(base, this, element_settings);
    });

    // This class means to submit the form to the action using Ajax.
    $('.use-ajax-submit:not(.ajax-processed)').addClass('ajax-processed').each(function () {
      var element_settings = {};

      // Ajax submits specified in this manner automatically submit to the
      // normal form action.
      element_settings.url = $(this.form).attr('action');
      // Form submit button clicks need to tell the form what was clicked so
      // it gets passed in the POST request.
      element_settings.setClick = true;
      // Form buttons use the 'click' event rather than mousedown.
      element_settings.event = 'click';
      // Clicked form buttons look better with the throbber than the progress bar.
      element_settings.progress = { 'type': 'throbber' };

      var base = $(this).attr('id');
      Drupal.ajax[base] = new Drupal.ajax(base, this, element_settings);
    });
  }
};

/**
 * Ajax object.
 *
 * All Ajax objects on a page are accessible through the global Drupal.ajax
 * object and are keyed by the submit button's ID. You can access them from
 * your module's JavaScript file to override properties or functions.
 *
 * For example, if your Ajax enabled button has the ID 'edit-submit', you can
 * redefine the function that is called to insert the new content like this
 * (inside a Drupal.behaviors attach block):
 * @code
 *    Drupal.behaviors.myCustomAJAXStuff = {
 *      attach: function (context, settings) {
 *        Drupal.ajax['edit-submit'].commands.insert = function (ajax, response, status) {
 *          new_content = $(response.data);
 *          $('#my-wrapper').append(new_content);
 *          alert('New content was appended to #my-wrapper');
 *        }
 *      }
 *    };
 * @endcode
 */
Drupal.ajax = function (base, element, element_settings) {
  var defaults = {
    url: 'system/ajax',
    event: 'mousedown',
    keypress: true,
    selector: '#' + base,
    effect: 'none',
    speed: 'none',
    method: 'replaceWith',
    progress: {
      type: 'throbber',
      message: Drupal.t('Please wait...')
    },
    submit: {
      'js': true
    }
  };

  $.extend(this, defaults, element_settings);

  this.element = element;
  this.element_settings = element_settings;

  // Replacing 'nojs' with 'ajax' in the URL allows for an easy method to let
  // the server detect when it needs to degrade gracefully.
  // There are five scenarios to check for:
  // 1. /nojs/
  // 2. /nojs$ - The end of a URL string.
  // 3. /nojs? - Followed by a query (with clean URLs enabled).
  //      E.g.: path/nojs?destination=foobar
  // 4. /nojs& - Followed by a query (without clean URLs enabled).
  //      E.g.: ?q=path/nojs&destination=foobar
  // 5. /nojs# - Followed by a fragment.
  //      E.g.: path/nojs#myfragment
  this.url = element_settings.url.replace(/\/nojs(\/|$|\?|&|#)/g, '/ajax$1');
  this.wrapper = '#' + element_settings.wrapper;

  // If there isn't a form, jQuery.ajax() will be used instead, allowing us to
  // bind Ajax to links as well.
  if (this.element.form) {
    this.form = $(this.element.form);
  }

  // Set the options for the ajaxSubmit function.
  // The 'this' variable will not persist inside of the options object.
  var ajax = this;
  ajax.options = {
    url: ajax.url,
    data: ajax.submit,
    beforeSerialize: function (element_settings, options) {
      return ajax.beforeSerialize(element_settings, options);
    },
    beforeSubmit: function (form_values, element_settings, options) {
      ajax.ajaxing = true;
      return ajax.beforeSubmit(form_values, element_settings, options);
    },
    beforeSend: function (xmlhttprequest, options) {
      ajax.ajaxing = true;
      return ajax.beforeSend(xmlhttprequest, options);
    },
    success: function (response, status) {
      // Sanity check for browser support (object expected).
      // When using iFrame uploads, responses must be returned as a string.
      if (typeof response == 'string') {
        response = $.parseJSON(response);
      }
      return ajax.success(response, status);
    },
    complete: function (response, status) {
      ajax.ajaxing = false;
      if (status == 'error' || status == 'parsererror') {
        return ajax.error(response, ajax.url);
      }
    },
    dataType: 'json',
    type: 'POST'
  };

  // Bind the ajaxSubmit function to the element event.
  $(ajax.element).bind(element_settings.event, function (event) {
    return ajax.eventResponse(this, event);
  });

  // If necessary, enable keyboard submission so that Ajax behaviors
  // can be triggered through keyboard input as well as e.g. a mousedown
  // action.
  if (element_settings.keypress) {
    $(ajax.element).keypress(function (event) {
      return ajax.keypressResponse(this, event);
    });
  }

  // If necessary, prevent the browser default action of an additional event.
  // For example, prevent the browser default action of a click, even if the
  // AJAX behavior binds to mousedown.
  if (element_settings.prevent) {
    $(ajax.element).bind(element_settings.prevent, false);
  }
};

/**
 * Handle a key press.
 *
 * The Ajax object will, if instructed, bind to a key press response. This
 * will test to see if the key press is valid to trigger this event and
 * if it is, trigger it for us and prevent other keypresses from triggering.
 * In this case we're handling RETURN and SPACEBAR keypresses (event codes 13
 * and 32. RETURN is often used to submit a form when in a textfield, and 
 * SPACE is often used to activate an element without submitting. 
 */
Drupal.ajax.prototype.keypressResponse = function (element, event) {
  // Create a synonym for this to reduce code confusion.
  var ajax = this;

  // Detect enter key and space bar and allow the standard response for them,
  // except for form elements of type 'text' and 'textarea', where the 
  // spacebar activation causes inappropriate activation if #ajax['keypress'] is 
  // TRUE. On a text-type widget a space should always be a space.
  if (event.which == 13 || (event.which == 32 && element.type != 'text' && element.type != 'textarea')) {
    $(ajax.element_settings.element).trigger(ajax.element_settings.event);
    return false;
  }
};

/**
 * Handle an event that triggers an Ajax response.
 *
 * When an event that triggers an Ajax response happens, this method will
 * perform the actual Ajax call. It is bound to the event using
 * bind() in the constructor, and it uses the options specified on the
 * ajax object.
 */
Drupal.ajax.prototype.eventResponse = function (element, event) {
  // Create a synonym for this to reduce code confusion.
  var ajax = this;

  // Do not perform another ajax command if one is already in progress.
  if (ajax.ajaxing) {
    return false;
  }

  try {
    if (ajax.form) {
      // If setClick is set, we must set this to ensure that the button's
      // value is passed.
      if (ajax.setClick) {
        // Mark the clicked button. 'form.clk' is a special variable for
        // ajaxSubmit that tells the system which element got clicked to
        // trigger the submit. Without it there would be no 'op' or
        // equivalent.
        element.form.clk = element;
      }

      ajax.form.ajaxSubmit(ajax.options);
    }
    else {
      ajax.beforeSerialize(ajax.element, ajax.options);
      $.ajax(ajax.options);
    }
  }
  catch (e) {
    // Unset the ajax.ajaxing flag here because it won't be unset during
    // the complete response.
    ajax.ajaxing = false;
    alert("An error occurred while attempting to process " + ajax.options.url + ": " + e.message);
  }

  // For radio/checkbox, allow the default event. On IE, this means letting
  // it actually check the box.
  if (typeof element.type != 'undefined' && (element.type == 'checkbox' || element.type == 'radio')) {
    return true;
  }
  else {
    return false;
  }

};

/**
 * Handler for the form serialization.
 *
 * Runs before the beforeSend() handler (see below), and unlike that one, runs
 * before field data is collected.
 */
Drupal.ajax.prototype.beforeSerialize = function (element, options) {
  // Allow detaching behaviors to update field values before collecting them.
  // This is only needed when field values are added to the POST data, so only
  // when there is a form such that this.form.ajaxSubmit() is used instead of
  // $.ajax(). When there is no form and $.ajax() is used, beforeSerialize()
  // isn't called, but don't rely on that: explicitly check this.form.
  if (this.form) {
    var settings = this.settings || Drupal.settings;
    Drupal.detachBehaviors(this.form, settings, 'serialize');
  }

  // Prevent duplicate HTML ids in the returned markup.
  // @see drupal_html_id()
  options.data['ajax_html_ids[]'] = [];
  $('[id]').each(function () {
    options.data['ajax_html_ids[]'].push(this.id);
  });

  // Allow Drupal to return new JavaScript and CSS files to load without
  // returning the ones already loaded.
  // @see ajax_base_page_theme()
  // @see drupal_get_css()
  // @see drupal_get_js()
  options.data['ajax_page_state[theme]'] = Drupal.settings.ajaxPageState.theme;
  options.data['ajax_page_state[theme_token]'] = Drupal.settings.ajaxPageState.theme_token;
  for (var key in Drupal.settings.ajaxPageState.css) {
    options.data['ajax_page_state[css][' + key + ']'] = 1;
  }
  for (var key in Drupal.settings.ajaxPageState.js) {
    options.data['ajax_page_state[js][' + key + ']'] = 1;
  }
};

/**
 * Modify form values prior to form submission.
 */
Drupal.ajax.prototype.beforeSubmit = function (form_values, element, options) {
  // This function is left empty to make it simple to override for modules
  // that wish to add functionality here.
}

/**
 * Prepare the Ajax request before it is sent.
 */
Drupal.ajax.prototype.beforeSend = function (xmlhttprequest, options) {
  // For forms without file inputs, the jQuery Form plugin serializes the form
  // values, and then calls jQuery's $.ajax() function, which invokes this
  // handler. In this circumstance, options.extraData is never used. For forms
  // with file inputs, the jQuery Form plugin uses the browser's normal form
  // submission mechanism, but captures the response in a hidden IFRAME. In this
  // circumstance, it calls this handler first, and then appends hidden fields
  // to the form to submit the values in options.extraData. There is no simple
  // way to know which submission mechanism will be used, so we add to extraData
  // regardless, and allow it to be ignored in the former case.
  if (this.form) {
    options.extraData = options.extraData || {};

    // Let the server know when the IFRAME submission mechanism is used. The
    // server can use this information to wrap the JSON response in a TEXTAREA,
    // as per http://jquery.malsup.com/form/#file-upload.
    options.extraData.ajax_iframe_upload = '1';

    // The triggering element is about to be disabled (see below), but if it
    // contains a value (e.g., a checkbox, textfield, select, etc.), ensure that
    // value is included in the submission. As per above, submissions that use
    // $.ajax() are already serialized prior to the element being disabled, so
    // this is only needed for IFRAME submissions.
    var v = $.fieldValue(this.element);
    if (v !== null) {
      options.extraData[this.element.name] = v;
    }
  }

  // Disable the element that received the change to prevent user interface
  // interaction while the Ajax request is in progress. ajax.ajaxing prevents
  // the element from triggering a new request, but does not prevent the user
  // from changing its value.
  $(this.element).addClass('progress-disabled').attr('disabled', true);

  // Insert progressbar or throbber.
  if (this.progress.type == 'bar') {
    var progressBar = new Drupal.progressBar('ajax-progress-' + this.element.id, eval(this.progress.update_callback), this.progress.method, eval(this.progress.error_callback));
    if (this.progress.message) {
      progressBar.setProgress(-1, this.progress.message);
    }
    if (this.progress.url) {
      progressBar.startMonitoring(this.progress.url, this.progress.interval || 1500);
    }
    this.progress.element = $(progressBar.element).addClass('ajax-progress ajax-progress-bar');
    this.progress.object = progressBar;
    $(this.element).after(this.progress.element);
  }
  else if (this.progress.type == 'throbber') {
    this.progress.element = $('<div class="ajax-progress ajax-progress-throbber"><div class="throbber">&nbsp;</div></div>');
    if (this.progress.message) {
      $('.throbber', this.progress.element).after('<div class="message">' + this.progress.message + '</div>');
    }
    $(this.element).after(this.progress.element);
  }
};

/**
 * Handler for the form redirection completion.
 */
Drupal.ajax.prototype.success = function (response, status) {
  // Remove the progress element.
  if (this.progress.element) {
    $(this.progress.element).remove();
  }
  if (this.progress.object) {
    this.progress.object.stopMonitoring();
  }
  $(this.element).removeClass('progress-disabled').removeAttr('disabled');

  Drupal.freezeHeight();

  for (var i in response) {
    if (response[i]['command'] && this.commands[response[i]['command']]) {
      this.commands[response[i]['command']](this, response[i], status);
    }
  }

  // Reattach behaviors, if they were detached in beforeSerialize(). The
  // attachBehaviors() called on the new content from processing the response
  // commands is not sufficient, because behaviors from the entire form need
  // to be reattached.
  if (this.form) {
    var settings = this.settings || Drupal.settings;
    Drupal.attachBehaviors(this.form, settings);
  }

  Drupal.unfreezeHeight();

  // Remove any response-specific settings so they don't get used on the next
  // call by mistake.
  this.settings = null;
};

/**
 * Build an effect object which tells us how to apply the effect when adding new HTML.
 */
Drupal.ajax.prototype.getEffect = function (response) {
  var type = response.effect || this.effect;
  var speed = response.speed || this.speed;

  var effect = {};
  if (type == 'none') {
    effect.showEffect = 'show';
    effect.hideEffect = 'hide';
    effect.showSpeed = '';
  }
  else if (type == 'fade') {
    effect.showEffect = 'fadeIn';
    effect.hideEffect = 'fadeOut';
    effect.showSpeed = speed;
  }
  else {
    effect.showEffect = type + 'Toggle';
    effect.hideEffect = type + 'Toggle';
    effect.showSpeed = speed;
  }

  return effect;
};

/**
 * Handler for the form redirection error.
 */
Drupal.ajax.prototype.error = function (response, uri) {
  alert(Drupal.ajaxError(response, uri));
  // Remove the progress element.
  if (this.progress.element) {
    $(this.progress.element).remove();
  }
  if (this.progress.object) {
    this.progress.object.stopMonitoring();
  }
  // Undo hide.
  $(this.wrapper).show();
  // Re-enable the element.
  $(this.element).removeClass('progress-disabled').removeAttr('disabled');
  // Reattach behaviors, if they were detached in beforeSerialize().
  if (this.form) {
    var settings = response.settings || this.settings || Drupal.settings;
    Drupal.attachBehaviors(this.form, settings);
  }
};

/**
 * Provide a series of commands that the server can request the client perform.
 */
Drupal.ajax.prototype.commands = {
  /**
   * Command to insert new content into the DOM.
   */
  insert: function (ajax, response, status) {
    // Get information from the response. If it is not there, default to
    // our presets.
    var wrapper = response.selector ? $(response.selector) : $(ajax.wrapper);
    var method = response.method || ajax.method;
    var effect = ajax.getEffect(response);

    // We don't know what response.data contains: it might be a string of text
    // without HTML, so don't rely on jQuery correctly iterpreting
    // $(response.data) as new HTML rather than a CSS selector. Also, if
    // response.data contains top-level text nodes, they get lost with either
    // $(response.data) or $('<div></div>').replaceWith(response.data).
    var new_content_wrapped = $('<div></div>').html(response.data);
    var new_content = new_content_wrapped.contents();

    // For legacy reasons, the effects processing code assumes that new_content
    // consists of a single top-level element. Also, it has not been
    // sufficiently tested whether attachBehaviors() can be successfully called
    // with a context object that includes top-level text nodes. However, to
    // give developers full control of the HTML appearing in the page, and to
    // enable Ajax content to be inserted in places where DIV elements are not
    // allowed (e.g., within TABLE, TR, and SPAN parents), we check if the new
    // content satisfies the requirement of a single top-level element, and
    // only use the container DIV created above when it doesn't. For more
    // information, please see http://drupal.org/node/736066.
    if (new_content.length != 1 || new_content.get(0).nodeType != 1) {
      new_content = new_content_wrapped;
    }

    // If removing content from the wrapper, detach behaviors first.
    switch (method) {
      case 'html':
      case 'replaceWith':
      case 'replaceAll':
      case 'empty':
      case 'remove':
        var settings = response.settings || ajax.settings || Drupal.settings;
        Drupal.detachBehaviors(wrapper, settings);
    }

    // Add the new content to the page.
    wrapper[method](new_content);

    // Immediately hide the new content if we're using any effects.
    if (effect.showEffect != 'show') {
      new_content.hide();
    }

    // Determine which effect to use and what content will receive the
    // effect, then show the new content.
    if ($('.ajax-new-content', new_content).length > 0) {
      $('.ajax-new-content', new_content).hide();
      new_content.show();
      $('.ajax-new-content', new_content)[effect.showEffect](effect.showSpeed);
    }
    else if (effect.showEffect != 'show') {
      new_content[effect.showEffect](effect.showSpeed);
    }

    // Attach all JavaScript behaviors to the new content, if it was successfully
    // added to the page, this if statement allows #ajax['wrapper'] to be
    // optional.
    if (new_content.parents('html').length > 0) {
      // Apply any settings from the returned JSON if available.
      var settings = response.settings || ajax.settings || Drupal.settings;
      Drupal.attachBehaviors(new_content, settings);
    }
  },

  /**
   * Command to remove a chunk from the page.
   */
  remove: function (ajax, response, status) {
    var settings = response.settings || ajax.settings || Drupal.settings;
    Drupal.detachBehaviors($(response.selector), settings);
    $(response.selector).remove();
  },

  /**
   * Command to mark a chunk changed.
   */
  changed: function (ajax, response, status) {
    if (!$(response.selector).hasClass('ajax-changed')) {
      $(response.selector).addClass('ajax-changed');
      if (response.asterisk) {
        $(response.selector).find(response.asterisk).append(' <span class="ajax-changed">*</span> ');
      }
    }
  },

  /**
   * Command to provide an alert.
   */
  alert: function (ajax, response, status) {
    alert(response.text, response.title);
  },

  /**
   * Command to provide the jQuery css() function.
   */
  css: function (ajax, response, status) {
    $(response.selector).css(response.argument);
  },

  /**
   * Command to set the settings that will be used for other commands in this response.
   */
  settings: function (ajax, response, status) {
    if (response.merge) {
      $.extend(true, Drupal.settings, response.settings);
    }
    else {
      ajax.settings = response.settings;
    }
  },

  /**
   * Command to attach data using jQuery's data API.
   */
  data: function (ajax, response, status) {
    $(response.selector).data(response.name, response.value);
  },

  /**
   * Command to apply a jQuery method.
   */
  invoke: function (ajax, response, status) {
    var $element = $(response.selector);
    $element[response.method].apply($element, response.arguments);
  },

  /**
   * Command to restripe a table.
   */
  restripe: function (ajax, response, status) {
    // :even and :odd are reversed because jQuery counts from 0 and
    // we count from 1, so we're out of sync.
    // Match immediate children of the parent element to allow nesting.
    $('> tbody > tr:visible, > tr:visible', $(response.selector))
      .removeClass('odd even')
      .filter(':even').addClass('odd').end()
      .filter(':odd').addClass('even');
  }
};

})(jQuery);
;
