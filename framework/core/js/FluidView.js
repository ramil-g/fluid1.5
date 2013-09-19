var fluid_1_5=fluid_1_5||{};(function($,fluid){fluid.defaults("fluid.viewComponent",{gradeNames:["fluid.littleComponent","fluid.modelComponent","fluid.eventedComponent"],initFunction:"fluid.initView",argumentMap:{container:0,options:1},members:{dom:{expander:{funcName:"fluid.initDomBinder",args:["{that}","{that}.options.selectors"]}}}});fluid.diagnoseFailedView=function(componentName,that,options,args){if(!that&&fluid.hasGrade(options,"fluid.viewComponent")){var container=fluid.wrap(args[1]);var message1="Instantiation of autoInit component with type "+componentName+" failed, since ";if(container.length===0){fluid.fail(message1+'selector "',args[1],'" did not match any markup in the document')}else{fluid.fail(message1+" component creator function did not return a value")}}};fluid.checkTryCatchParameter=function(){var location=window.location||{search:"",protocol:"file:"};var GETparams=location.search.slice(1).split("&");return fluid.find(GETparams,function(param){if(param.indexOf("notrycatch")===0){return true}})===true};fluid.notrycatch=fluid.checkTryCatchParameter();fluid.wrap=function(obj,userJQuery){userJQuery=userJQuery||$;return((!obj||obj.jquery)?obj:userJQuery(obj))};fluid.unwrap=function(obj){return obj&&obj.jquery&&obj.length===1?obj[0]:obj};fluid.container=function(containerSpec,fallible,userJQuery){if(userJQuery){containerSpec=fluid.unwrap(containerSpec)}var container=fluid.wrap(containerSpec,userJQuery);if(fallible&&(!container||container.length===0)){return null}if(!container||!container.jquery||container.length!==1){if(typeof (containerSpec)!=="string"){containerSpec=container.selector}var count=container.length!==undefined?container.length:0;fluid.fail((count>1?"More than one ("+count+") container elements were":"No container element was")+" found for selector "+containerSpec)}if(!fluid.isDOMNode(container[0])){fluid.fail("fluid.container was supplied a non-jQueryable element")}return container};fluid.createDomBinder=function(container,selectors){var cache={},that={id:fluid.allocateGuid()};var userJQuery=container.constructor;function cacheKey(name,thisContainer){return fluid.allocateSimpleId(thisContainer)+"-"+name}function record(name,thisContainer,result){cache[cacheKey(name,thisContainer)]=result}that.locate=function(name,localContainer){var selector,thisContainer,togo;selector=selectors[name];thisContainer=localContainer?localContainer:container;if(!thisContainer){fluid.fail("DOM binder invoked for selector "+name+" without container")}if(!selector){return thisContainer}if(typeof (selector)==="function"){togo=userJQuery(selector.call(null,fluid.unwrap(thisContainer)))}else{togo=userJQuery(selector,thisContainer)}if(togo.get(0)===document){togo=[]}if(!togo.selector){togo.selector=selector;togo.context=thisContainer}togo.selectorName=name;record(name,thisContainer,togo);return togo};that.fastLocate=function(name,localContainer){var thisContainer=localContainer?localContainer:container;var key=cacheKey(name,thisContainer);var togo=cache[key];return togo?togo:that.locate(name,localContainer)};that.clear=function(){cache={}};that.refresh=function(names,localContainer){var thisContainer=localContainer?localContainer:container;if(typeof names==="string"){names=[names]}if(thisContainer.length===undefined){thisContainer=[thisContainer]}for(var i=0;i<names.length;++i){for(var j=0;j<thisContainer.length;++j){that.locate(names[i],thisContainer[j])}}};that.resolvePathSegment=that.locate;return that};fluid.expectFilledSelector=function(result,message){if(result&&result.length===0&&result.jquery){fluid.fail(message+': selector "'+result.selector+'" with name '+result.selectorName+" returned no results in context "+fluid.dumpEl(result.context))}};fluid.initView=function(componentName,containerSpec,userOptions,localOptions){var container=fluid.container(containerSpec,true);fluid.expectFilledSelector(container,'Error instantiating component with name "'+componentName);if(!container){return null}var receiver=function(that,options,strategy){that.container=container};var that=fluid.initLittleComponent(componentName,userOptions,localOptions||{gradeNames:["fluid.viewComponent"]},receiver);if(!that.dom){fluid.initDomBinder(that)}var userJQuery=that.options.jQuery;fluid.log("Constructing view component "+componentName+" with container "+container.constructor.expando+(userJQuery?" user jQuery "+userJQuery.expando:"")+" env: "+$.expando);return that};fluid.initDomBinder=function(that,selectors){that.dom=fluid.createDomBinder(that.container,selectors||that.options.selectors||{});that.locate=that.dom.locate;return that.dom};fluid.findAncestor=function(element,test){element=fluid.unwrap(element);while(element){if(test(element)){return element}element=element.parentNode}};fluid.findForm=function(node){return fluid.findAncestor(node,function(element){return element.nodeName.toLowerCase()==="form"})};fluid.each(["text","html"],function(method){fluid[method]=function(node,newValue){node=$(node);return newValue===undefined?node[method]():node[method](newValue)}});fluid.value=function(nodeIn,newValue){var node=fluid.unwrap(nodeIn);var multiple=false;if(node.nodeType===undefined&&node.length>1){node=node[0];multiple=true}if("input"!==node.nodeName.toLowerCase()||!/radio|checkbox/.test(node.type)){return newValue===undefined?$(node).val():$(node).val(newValue)}var name=node.name;if(name===undefined){fluid.fail("Cannot acquire value from node "+fluid.dumpEl(node)+" which does not have name attribute set")}var elements;if(multiple){elements=nodeIn}else{elements=node.ownerDocument.getElementsByName(name);var scope=fluid.findForm(node);elements=$.grep(elements,function(element){if(element.name!==name){return false}return !scope||fluid.dom.isContainer(scope,element)})}if(newValue!==undefined){if(typeof (newValue)==="boolean"){newValue=(newValue?"true":"false")}$.each(elements,function(){this.checked=(newValue instanceof Array?$.inArray(this.value,newValue)!==-1:newValue===this.value)})}else{var checked=$.map(elements,function(element){return element.checked?element.value:null});return node.type==="radio"?checked[0]:checked}};fluid.jById=function(id,dokkument){dokkument=dokkument&&dokkument.nodeType===9?dokkument:document;var element=fluid.byId(id,dokkument);var togo=element?$(element):[];togo.selector="#"+id;togo.context=dokkument;return togo};fluid.byId=function(id,dokkument){dokkument=dokkument&&dokkument.nodeType===9?dokkument:document;var el=dokkument.getElementById(id);if(el){if(el.id!==id){fluid.fail("Problem in document structure - picked up element "+fluid.dumpEl(el)+" for id "+id+" without this id - most likely the element has a name which conflicts with this id")}return el}else{return null}};fluid.getId=function(element){return fluid.unwrap(element).id};fluid.allocateSimpleId=function(element){var simpleId="fluid-id-"+fluid.allocateGuid();if(!element){return simpleId}element=fluid.unwrap(element);if(!element.id){element.id=simpleId}return element.id};fluid.defaults("fluid.ariaLabeller",{labelAttribute:"aria-label",liveRegionMarkup:'<div class="liveRegion fl-offScreen-hidden" aria-live="polite"></div>',liveRegionId:"fluid-ariaLabeller-liveRegion",events:{generateLiveElement:"unicast"},listeners:{generateLiveElement:"fluid.ariaLabeller.generateLiveElement"}});fluid.ariaLabeller=function(element,options){var that=fluid.initView("fluid.ariaLabeller",element,options);that.update=function(newOptions){newOptions=newOptions||that.options;that.container.attr(that.options.labelAttribute,newOptions.text);if(newOptions.dynamicLabel){var live=fluid.jById(that.options.liveRegionId);if(live.length===0){live=that.events.generateLiveElement.fire(that)}live.text(newOptions.text)}};that.update();return that};fluid.ariaLabeller.generateLiveElement=function(that){var liveEl=$(that.options.liveRegionMarkup);liveEl.prop("id",that.options.liveRegionId);$("body").append(liveEl);return liveEl};var LABEL_KEY="aria-labelling";fluid.getAriaLabeller=function(element){element=$(element);var that=fluid.getScopedData(element,LABEL_KEY);return that};fluid.updateAriaLabel=function(element,text,options){options=$.extend({},options||{},{text:text});var that=fluid.getAriaLabeller(element);if(!that){that=fluid.ariaLabeller(element,options);fluid.setScopedData(element,LABEL_KEY,that)}else{that.update(options)}return that};var dismissList={};$(document).click(function(event){var target=event.target;while(target){if(dismissList[target.id]){return }target=target.parentNode}fluid.each(dismissList,function(dismissFunc,key){dismissFunc(event);delete dismissList[key]})});fluid.globalDismissal=function(nodes,dismissFunc){fluid.each(nodes,function(node){var id=fluid.unwrap(node).ownerDocument===document?fluid.allocateSimpleId(node):fluid.allocateGuid();if(dismissFunc){dismissList[id]=dismissFunc}else{delete dismissList[id]}})};fluid.now=function(){return Date.now?Date.now():(new Date()).getTime()};fluid.deadMansBlur=function(control,options){var that=fluid.initLittleComponent("fluid.deadMansBlur",options);that.blurPending=false;that.lastCancel=0;that.canceller=function(event){fluid.log("Cancellation through "+event.type+" on "+fluid.dumpEl(event.target));that.lastCancel=fluid.now();that.blurPending=false};that.noteProceeded=function(){fluid.globalDismissal(that.options.exclusions)};that.reArm=function(){fluid.globalDismissal(that.options.exclusions,that.proceed)};that.addExclusion=function(exclusions){fluid.globalDismissal(exclusions,that.proceed)};that.proceed=function(event){fluid.log("Direct proceed through "+event.type+" on "+fluid.dumpEl(event.target));that.blurPending=false;that.options.handler(control)};fluid.each(that.options.exclusions,function(exclusion){exclusion=$(exclusion);fluid.each(exclusion,function(excludeEl){$(excludeEl).bind("focusin",that.canceller).bind("fluid-focus",that.canceller).click(that.canceller).mousedown(that.canceller)})});if(!that.options.cancelByDefault){$(control).bind("focusout",function(event){fluid.log("Starting blur timer for element "+fluid.dumpEl(event.target));var now=fluid.now();fluid.log("back delay: "+(now-that.lastCancel));if(now-that.lastCancel>that.options.backDelay){that.blurPending=true}setTimeout(function(){if(that.blurPending){that.options.handler(control)}},that.options.delay)})}else{that.reArm()}return that};fluid.defaults("fluid.deadMansBlur",{delay:150,backDelay:100})})(jQuery,fluid_1_5);