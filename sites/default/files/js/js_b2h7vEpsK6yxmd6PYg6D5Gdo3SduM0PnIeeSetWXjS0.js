
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

/*!
 * jQuery Form Plugin
 * version: 2.52 (07-DEC-2010)
 * @requires jQuery v1.3.2 or later
 *
 * Examples and documentation at: http://malsup.com/jquery/form/
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 */
;(function(b){function q(){if(b.fn.ajaxSubmit.debug){var a="[jquery.form] "+Array.prototype.join.call(arguments,"");if(window.console&&window.console.log)window.console.log(a);else window.opera&&window.opera.postError&&window.opera.postError(a)}}b.fn.ajaxSubmit=function(a){function f(){function t(){var o=i.attr("target"),m=i.attr("action");l.setAttribute("target",u);l.getAttribute("method")!="POST"&&l.setAttribute("method","POST");l.getAttribute("action")!=e.url&&l.setAttribute("action",e.url);e.skipEncodingOverride|| i.attr({encoding:"multipart/form-data",enctype:"multipart/form-data"});e.timeout&&setTimeout(function(){F=true;s()},e.timeout);var v=[];try{if(e.extraData)for(var w in e.extraData)v.push(b('<input type="hidden" name="'+w+'" value="'+e.extraData[w]+'" />').appendTo(l)[0]);r.appendTo("body");r.data("form-plugin-onload",s);l.submit()}finally{l.setAttribute("action",m);o?l.setAttribute("target",o):i.removeAttr("target");b(v).remove()}}function s(){if(!G){r.removeData("form-plugin-onload");var o=true; try{if(F)throw"timeout";p=x.contentWindow?x.contentWindow.document:x.contentDocument?x.contentDocument:x.document;var m=e.dataType=="xml"||p.XMLDocument||b.isXMLDoc(p);q("isXml="+m);if(!m&&window.opera&&(p.body==null||p.body.innerHTML==""))if(--K){q("requeing onLoad callback, DOM not available");setTimeout(s,250);return}G=true;j.responseText=p.documentElement?p.documentElement.innerHTML:null;j.responseXML=p.XMLDocument?p.XMLDocument:p;j.getResponseHeader=function(L){return{"content-type":e.dataType}[L]}; var v=/(json|script)/.test(e.dataType);if(v||e.textarea){var w=p.getElementsByTagName("textarea")[0];if(w)j.responseText=w.value;else if(v){var H=p.getElementsByTagName("pre")[0],I=p.getElementsByTagName("body")[0];if(H)j.responseText=H.textContent;else if(I)j.responseText=I.innerHTML}}else if(e.dataType=="xml"&&!j.responseXML&&j.responseText!=null)j.responseXML=C(j.responseText);J=b.httpData(j,e.dataType)}catch(D){q("error caught:",D);o=false;j.error=D;b.handleError(e,j,"error",D)}if(j.aborted){q("upload aborted"); o=false}if(o){e.success.call(e.context,J,"success",j);y&&b.event.trigger("ajaxSuccess",[j,e])}y&&b.event.trigger("ajaxComplete",[j,e]);y&&!--b.active&&b.event.trigger("ajaxStop");if(e.complete)e.complete.call(e.context,j,o?"success":"error");setTimeout(function(){r.removeData("form-plugin-onload");r.remove();j.responseXML=null},100)}}function C(o,m){if(window.ActiveXObject){m=new ActiveXObject("Microsoft.XMLDOM");m.async="false";m.loadXML(o)}else m=(new DOMParser).parseFromString(o,"text/xml");return m&& m.documentElement&&m.documentElement.tagName!="parsererror"?m:null}var l=i[0];if(b(":input[name=submit],:input[id=submit]",l).length)alert('Error: Form elements must not have name or id of "submit".');else{var e=b.extend(true,{},b.ajaxSettings,a);e.context=e.context||e;var u="jqFormIO"+(new Date).getTime(),E="_"+u;window[E]=function(){var o=r.data("form-plugin-onload");if(o){o();window[E]=undefined;try{delete window[E]}catch(m){}}};var r=b('<iframe id="'+u+'" name="'+u+'" src="'+e.iframeSrc+'" onload="window[\'_\'+this.id]()" />'), x=r[0];r.css({position:"absolute",top:"-1000px",left:"-1000px"});var j={aborted:0,responseText:null,responseXML:null,status:0,statusText:"n/a",getAllResponseHeaders:function(){},getResponseHeader:function(){},setRequestHeader:function(){},abort:function(){this.aborted=1;r.attr("src",e.iframeSrc)}},y=e.global;y&&!b.active++&&b.event.trigger("ajaxStart");y&&b.event.trigger("ajaxSend",[j,e]);if(e.beforeSend&&e.beforeSend.call(e.context,j,e)===false)e.global&&b.active--;else if(!j.aborted){var G=false, F=0,z=l.clk;if(z){var A=z.name;if(A&&!z.disabled){e.extraData=e.extraData||{};e.extraData[A]=z.value;if(z.type=="image"){e.extraData[A+".x"]=l.clk_x;e.extraData[A+".y"]=l.clk_y}}}e.forceSync?t():setTimeout(t,10);var J,p,K=50}}}if(!this.length){q("ajaxSubmit: skipping submit process - no element selected");return this}if(typeof a=="function")a={success:a};var d=this.attr("action");if(d=typeof d==="string"?b.trim(d):"")d=(d.match(/^([^#]+)/)||[])[1];d=d||window.location.href||"";a=b.extend(true,{url:d, type:this.attr("method")||"GET",iframeSrc:/^https/i.test(window.location.href||"")?"javascript:false":"about:blank"},a);d={};this.trigger("form-pre-serialize",[this,a,d]);if(d.veto){q("ajaxSubmit: submit vetoed via form-pre-serialize trigger");return this}if(a.beforeSerialize&&a.beforeSerialize(this,a)===false){q("ajaxSubmit: submit aborted via beforeSerialize callback");return this}var c,h,g=this.formToArray(a.semantic);if(a.data){a.extraData=a.data;for(c in a.data)if(a.data[c]instanceof Array)for(var k in a.data[c])g.push({name:c, value:a.data[c][k]});else{h=a.data[c];h=b.isFunction(h)?h():h;g.push({name:c,value:h})}}if(a.beforeSubmit&&a.beforeSubmit(g,this,a)===false){q("ajaxSubmit: submit aborted via beforeSubmit callback");return this}this.trigger("form-submit-validate",[g,this,a,d]);if(d.veto){q("ajaxSubmit: submit vetoed via form-submit-validate trigger");return this}c=b.param(g);if(a.type.toUpperCase()=="GET"){a.url+=(a.url.indexOf("?")>=0?"&":"?")+c;a.data=null}else a.data=c;var i=this,n=[];a.resetForm&&n.push(function(){i.resetForm()}); a.clearForm&&n.push(function(){i.clearForm()});if(!a.dataType&&a.target){var B=a.success||function(){};n.push(function(t){var s=a.replaceTarget?"replaceWith":"html";b(a.target)[s](t).each(B,arguments)})}else a.success&&n.push(a.success);a.success=function(t,s,C){for(var l=a.context||a,e=0,u=n.length;e<u;e++)n[e].apply(l,[t,s,C||i,i])};c=b("input:file",this).length>0;k=i.attr("enctype")=="multipart/form-data"||i.attr("encoding")=="multipart/form-data";if(a.iframe!==false&&(c||a.iframe||k))a.closeKeepAlive? b.get(a.closeKeepAlive,f):f();else b.ajax(a);this.trigger("form-submit-notify",[this,a]);return this};b.fn.ajaxForm=function(a){if(this.length===0){var f={s:this.selector,c:this.context};if(!b.isReady&&f.s){q("DOM not ready, queuing ajaxForm");b(function(){b(f.s,f.c).ajaxForm(a)});return this}q("terminating; zero elements found by selector"+(b.isReady?"":" (DOM not ready)"));return this}return this.ajaxFormUnbind().bind("submit.form-plugin",function(d){if(!d.isDefaultPrevented()){d.preventDefault(); b(this).ajaxSubmit(a)}}).bind("click.form-plugin",function(d){var c=d.target,h=b(c);if(!h.is(":submit,input:image")){c=h.closest(":submit");if(c.length==0)return;c=c[0]}var g=this;g.clk=c;if(c.type=="image")if(d.offsetX!=undefined){g.clk_x=d.offsetX;g.clk_y=d.offsetY}else if(typeof b.fn.offset=="function"){h=h.offset();g.clk_x=d.pageX-h.left;g.clk_y=d.pageY-h.top}else{g.clk_x=d.pageX-c.offsetLeft;g.clk_y=d.pageY-c.offsetTop}setTimeout(function(){g.clk=g.clk_x=g.clk_y=null},100)})};b.fn.ajaxFormUnbind= function(){return this.unbind("submit.form-plugin click.form-plugin")};b.fn.formToArray=function(a){var f=[];if(this.length===0)return f;var d=this[0],c=a?d.getElementsByTagName("*"):d.elements;if(!c)return f;var h,g,k,i,n,B;h=0;for(n=c.length;h<n;h++){g=c[h];if(k=g.name)if(a&&d.clk&&g.type=="image"){if(!g.disabled&&d.clk==g){f.push({name:k,value:b(g).val()});f.push({name:k+".x",value:d.clk_x},{name:k+".y",value:d.clk_y})}}else if((i=b.fieldValue(g,true))&&i.constructor==Array){g=0;for(B=i.length;g< B;g++)f.push({name:k,value:i[g]})}else i!==null&&typeof i!="undefined"&&f.push({name:k,value:i})}if(!a&&d.clk){a=b(d.clk);c=a[0];if((k=c.name)&&!c.disabled&&c.type=="image"){f.push({name:k,value:a.val()});f.push({name:k+".x",value:d.clk_x},{name:k+".y",value:d.clk_y})}}return f};b.fn.formSerialize=function(a){return b.param(this.formToArray(a))};b.fn.fieldSerialize=function(a){var f=[];this.each(function(){var d=this.name;if(d){var c=b.fieldValue(this,a);if(c&&c.constructor==Array)for(var h=0,g=c.length;h< g;h++)f.push({name:d,value:c[h]});else c!==null&&typeof c!="undefined"&&f.push({name:this.name,value:c})}});return b.param(f)};b.fn.fieldValue=function(a){for(var f=[],d=0,c=this.length;d<c;d++){var h=b.fieldValue(this[d],a);h===null||typeof h=="undefined"||h.constructor==Array&&!h.length||(h.constructor==Array?b.merge(f,h):f.push(h))}return f};b.fieldValue=function(a,f){var d=a.name,c=a.type,h=a.tagName.toLowerCase();if(f===undefined)f=true;if(f&&(!d||a.disabled||c=="reset"||c=="button"||(c=="checkbox"|| c=="radio")&&!a.checked||(c=="submit"||c=="image")&&a.form&&a.form.clk!=a||h=="select"&&a.selectedIndex==-1))return null;if(h=="select"){var g=a.selectedIndex;if(g<0)return null;d=[];h=a.options;var k=(c=c=="select-one")?g+1:h.length;for(g=c?g:0;g<k;g++){var i=h[g];if(i.selected){var n=i.value;n||(n=i.attributes&&i.attributes.value&&!i.attributes.value.specified?i.text:i.value);if(c)return n;d.push(n)}}return d}return b(a).val()};b.fn.clearForm=function(){return this.each(function(){b("input,select,textarea", this).clearFields()})};b.fn.clearFields=b.fn.clearInputs=function(){return this.each(function(){var a=this.type,f=this.tagName.toLowerCase();if(a=="text"||a=="password"||f=="textarea")this.value="";else if(a=="checkbox"||a=="radio")this.checked=false;else if(f=="select")this.selectedIndex=-1})};b.fn.resetForm=function(){return this.each(function(){if(typeof this.reset=="function"||typeof this.reset=="object"&&!this.reset.nodeType)this.reset()})};b.fn.enable=function(a){if(a===undefined)a=true;return this.each(function(){this.disabled= !a})};b.fn.selected=function(a){if(a===undefined)a=true;return this.each(function(){var f=this.type;if(f=="checkbox"||f=="radio")this.checked=a;else if(this.tagName.toLowerCase()=="option"){f=b(this).parent("select");a&&f[0]&&f[0].type=="select-one"&&f.find("option").selected(false);this.selected=a}})}})(jQuery);;

(function ($) {

/**
 * Attach the child dialog behavior to new content.
 */
Drupal.behaviors.overlayChild = {
  attach: function (context, settings) {
    // Make sure this behavior is not processed more than once.
    if (this.processed) {
      return;
    }
    this.processed = true;

    // If we cannot reach the parent window, break out of the overlay.
    if (!parent.Drupal || !parent.Drupal.overlay) {
      window.location = window.location.href.replace(/([?&]?)render=overlay&?/g, '$1').replace(/\?$/, '');
    }

    var settings = settings.overlayChild || {};

    // If the entire parent window should be refreshed when the overlay is
    // closed, pass that information to the parent window.
    if (settings.refreshPage) {
      parent.Drupal.overlay.refreshPage = true;
    }

    // If a form has been submitted successfully, then the server side script
    // may have decided to tell the parent window to close the popup dialog.
    if (settings.closeOverlay) {
      parent.Drupal.overlay.bindChild(window, true);
      // Use setTimeout to close the child window from a separate thread,
      // because the current one is busy processing Drupal behaviors.
      setTimeout(function () {
        if (typeof settings.redirect == 'string') {
          parent.Drupal.overlay.redirect(settings.redirect);
        }
        else {
          parent.Drupal.overlay.close();
        }
      }, 1);
      return;
    }

    // If one of the regions displaying outside the overlay needs to be
    // reloaded immediately, let the parent window know.
    if (settings.refreshRegions) {
      parent.Drupal.overlay.refreshRegions(settings.refreshRegions);
    }

    // Ok, now we can tell the parent window we're ready.
    parent.Drupal.overlay.bindChild(window);

    // IE8 crashes on certain pages if this isn't called; reason unknown.
    window.scrollTo(window.scrollX, window.scrollY);

    // Attach child related behaviors to the iframe document.
    Drupal.overlayChild.attachBehaviors(context, settings);

    // There are two links within the message that informs people about the
    // overlay and how to disable it. Make sure both links are visible when
    // either one has focus and add a class to the wrapper for styling purposes.
    $('#overlay-disable-message', context)
      .focusin(function () {
        $(this).addClass('overlay-disable-message-focused');
        $('a.element-focusable', this).removeClass('element-invisible');
      })
      .focusout(function () {
        $(this).removeClass('overlay-disable-message-focused');
        $('a.element-focusable', this).addClass('element-invisible');
      });
  }
};

/**
 * Overlay object for child windows.
 */
Drupal.overlayChild = Drupal.overlayChild || {
  behaviors: {}
};

Drupal.overlayChild.prototype = {};

/**
 * Attach child related behaviors to the iframe document.
 */
Drupal.overlayChild.attachBehaviors = function (context, settings) {
  $.each(this.behaviors, function () {
    this(context, settings);
  });
};

/**
 * Capture and handle clicks.
 *
 * Instead of binding a click event handler to every link we bind one to the
 * document and handle events that bubble up. This also allows other scripts
 * to bind their own handlers to links and also to prevent overlay's handling.
 */
Drupal.overlayChild.behaviors.addClickHandler = function (context, settings) {
  $(document).bind('click.drupal-overlay mouseup.drupal-overlay', $.proxy(parent.Drupal.overlay, 'eventhandlerOverrideLink'));
};

/**
 * Modify forms depending on their relation to the overlay.
 *
 * By default, forms are assumed to keep the flow in the overlay. Thus their
 * action attribute get a ?render=overlay suffix.
 */
Drupal.overlayChild.behaviors.parseForms = function (context, settings) {
  $('form', context).once('overlay', function () {
    // Obtain the action attribute of the form.
    var action = $(this).attr('action');
    // Keep internal forms in the overlay.
    if (action == undefined || (action.indexOf('http') != 0 && action.indexOf('https') != 0)) {
      action += (action.indexOf('?') > -1 ? '&' : '?') + 'render=overlay';
      $(this).attr('action', action);
      // Special handling for method=get forms, which will break out of the
      // overlay entirely if we let them submit by themselves.
      if ($(this).attr('method') === 'get') {
        $(this).bind('submit.overlay', function (event) {
          event.preventDefault();
          var $form = $(event.target);
          // Determine the URL this form would submit to if left to its own
          // devices.
          var newHref = $form.attr('action') + "&" + $form.formSerialize();
          // Make that URL overlay-ready (i.e. "fragmentize" it).
          // First, create a native link object for fragmentizeLink() to act on.
          var link = jQuery('<a href="' + newHref + '"></a>').get(0);
          var newParentHref = parent.Drupal.overlay.fragmentizeLink(link);
          // Redirect the parent window to the new overlay-ready URL.
          parent.Drupal.overlay.redirect(newParentHref);
        });
      }
    }
    // Submit external forms into a new window.
    else {
      $(this).attr('target', '_new');
    }
  });
};

/**
 * Replace the overlay title with a message while loading another page.
 */
Drupal.overlayChild.behaviors.loading = function (context, settings) {
  var $title;
  var text = Drupal.t('Loading');
  var dots = '';

  $(document).bind('drupalOverlayBeforeLoad.drupal-overlay.drupal-overlay-child-loading', function () {
    $title = $('#overlay-title').text(text);
    var id = setInterval(function () {
      dots = (dots.length > 10) ? '' : dots + '.';
      $title.text(text + dots);
    }, 500);
  });
};

/**
 * Switch active tab immediately.
 */
Drupal.overlayChild.behaviors.tabs = function (context, settings) {
  var $tabsLinks = $('#overlay-tabs > li > a');

  $('#overlay-tabs > li > a').bind('click.drupal-overlay', function () {
    var active_tab = Drupal.t('(active tab)');
    $tabsLinks.parent().siblings().removeClass('active').find('element-invisible:contains(' + active_tab + ')').appendTo(this);
    $(this).parent().addClass('active');
  });
};

/**
 * If the shortcut add/delete button exists, move it to the overlay titlebar.
 */
Drupal.overlayChild.behaviors.shortcutAddLink = function (context, settings) {
  // Remove any existing shortcut button markup from the titlebar.
  $('#overlay-titlebar').find('.add-or-remove-shortcuts').remove();
  // If the shortcut add/delete button exists, move it to the titlebar.
  var $addToShortcuts = $('.add-or-remove-shortcuts');
  if ($addToShortcuts.length) {
    $addToShortcuts.insertAfter('#overlay-title');
  }

  $(document).bind('drupalOverlayBeforeLoad.drupal-overlay.drupal-overlay-child-loading', function () {
    $('#overlay-titlebar').find('.add-or-remove-shortcuts').remove();
  });
};

/**
 * Use displacement from parent window.
 */
Drupal.overlayChild.behaviors.alterTableHeaderOffset = function (context, settings) {
  if (Drupal.settings.tableHeaderOffset) {
    Drupal.overlayChild.prevTableHeaderOffset = Drupal.settings.tableHeaderOffset;
  }
  Drupal.settings.tableHeaderOffset = 'Drupal.overlayChild.tableHeaderOffset';
};

/**
 * Callback for Drupal.settings.tableHeaderOffset.
 */
Drupal.overlayChild.tableHeaderOffset = function () {
  var topOffset = Drupal.overlayChild.prevTableHeaderOffset ? eval(Drupal.overlayChild.prevTableHeaderOffset + '()') : 0;

  return topOffset + parseInt($(document.body).css('marginTop'));
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
