/*
 * jQuery UI Touch Punch 0.2.2
 *
 * Copyright 2011, Dave Furfero
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *
 * Depends:
 *  jquery.ui.widget.js
 *  jquery.ui.mouse.js
 */
(function($){$.support.touch="ontouchend" in document;if(!$.support.touch){return }var mouseProto=$.ui.mouse.prototype,_mouseInit=mouseProto._mouseInit,touchHandled;function simulateMouseEvent(event,simulatedType){if(event.originalEvent.touches.length>1){return }event.preventDefault();var touch=event.originalEvent.changedTouches[0],simulatedEvent=document.createEvent("MouseEvents");simulatedEvent.initMouseEvent(simulatedType,true,true,window,1,touch.screenX,touch.screenY,touch.clientX,touch.clientY,false,false,false,false,0,null);event.target.dispatchEvent(simulatedEvent)}mouseProto._touchStart=function(event){var self=this;if(touchHandled||!self._mouseCapture(event.originalEvent.changedTouches[0])){return }touchHandled=true;self._touchMoved=false;simulateMouseEvent(event,"mouseover");simulateMouseEvent(event,"mousemove");simulateMouseEvent(event,"mousedown")};mouseProto._touchMove=function(event){if(!touchHandled){return }this._touchMoved=true;simulateMouseEvent(event,"mousemove")};mouseProto._touchEnd=function(event){if(!touchHandled){return }simulateMouseEvent(event,"mouseup");simulateMouseEvent(event,"mouseout");if(!this._touchMoved){simulateMouseEvent(event,"click")}touchHandled=false};mouseProto._mouseInit=function(){var self=this;self.element.bind("touchstart",$.proxy(self,"_touchStart")).bind("touchmove",$.proxy(self,"_touchMove")).bind("touchend",$.proxy(self,"_touchEnd"));_mouseInit.call(self)}})(jQuery);