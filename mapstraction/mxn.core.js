/*
Copyright (c) 2009 Tom Carden, Steve Coast, Mikel Maron, Andrew Turner, Henri Bergius, Rob Moran, Derek Fowler
All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

 * Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
 * Neither the name of the Mapstraction nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/
(function(){var $m=mxn.util.$m;var init=function(){this.invoker.go("init",[this.currentElement,this.api]);this.applyOptions()};var Mapstraction=mxn.Mapstraction=function(element,api,debug){if(!api){api=mxn.util.getAvailableProviders()[0]}this.api=api;this.maps={};this.currentElement=$m(element);this.eventListeners=[];this.markers=[];this.layers=[];this.polylines=[];this.images=[];this.loaded={};this.onload={};this.element=element;this.options={enableScrollWheelZoom:false,enableDragging:true};this.addControlsArgs={};this.invoker=new mxn.Invoker(this,"Mapstraction",function(){return this.api});mxn.addEvents(this,["load","click","endPan","changeZoom","markerAdded","markerRemoved","polylineAdded","polylineRemoved"]);init.apply(this)};Mapstraction.ROAD=1;Mapstraction.SATELLITE=2;Mapstraction.HYBRID=3;mxn.addProxyMethods(Mapstraction,["addLargeControls","addMapTypeControls","addOverlay","addSmallControls","applyOptions","getBounds","getCenter","getMapType","getPixelRatio","getZoom","getZoomLevelForBoundingBox","mousePosition","resizeTo","setBounds","setCenter","setCenterAndZoom","setMapType","setZoom","toggleTileLayer"]);Mapstraction.prototype.setOptions=function(oOpts){mxn.util.merge(this.options,oOpts);this.applyOptions()};Mapstraction.prototype.setOption=function(sOptName,vVal){this.options[sOptName]=vVal;this.applyOptions()};Mapstraction.prototype.enableScrollWheelZoom=function(){this.setOption("enableScrollWheelZoom",true)};Mapstraction.prototype.dragging=function(on){this.setOption("enableDragging",on)};Mapstraction.prototype.swap=function(element,api){if(this.api===api){return}var center=this.getCenter();var zoom=this.getZoom();this.currentElement.style.visibility="hidden";this.currentElement.style.display="none";this.currentElement=$m(element);this.currentElement.style.visibility="visible";this.currentElement.style.display="block";this.api=api;if(this.maps[this.api]===undefined){init.apply(this);this.setCenterAndZoom(center,zoom);for(var i=0;i<this.markers.length;i++){this.addMarker(this.markers[i],true)}for(var j=0;j<this.polylines.length;j++){this.addPolyline(this.polylines[j],true)}}else{this.setCenterAndZoom(center,zoom)}this.addControls(this.addControlsArgs)};Mapstraction.prototype.isLoaded=function(api){if(api===null){api=this.api}return this.loaded[api]};Mapstraction.prototype.setDebug=function(debug){if(debug!==null){this.debug=debug}return this.debug};Mapstraction.prototype.clickHandler=function(lat,lon,me){this.callEventListeners("click",{location:new LatLonPoint(lat,lon)})};Mapstraction.prototype.moveendHandler=function(me){this.callEventListeners("moveend",{})};Mapstraction.prototype.addEventListener=function(){var listener={};listener.event_type=arguments[0];listener.callback_function=arguments[1];if(arguments.length==3){listener.back_compat_mode=false;listener.callback_object=arguments[2]}else{listener.back_compat_mode=true;listener.callback_object=null}this.eventListeners.push(listener)};Mapstraction.prototype.callEventListeners=function(sEventType,oEventArgs){oEventArgs.source=this;for(var i=0;i<this.eventListeners.length;i++){var evLi=this.eventListeners[i];if(evLi.event_type==sEventType){if(evLi.back_compat_mode){if(evLi.event_type=="click"){evLi.callback_function(oEventArgs.location)}else{evLi.callback_function()}}else{var scope=evLi.callback_object||this;evLi.callback_function.call(scope,oEventArgs)}}}};Mapstraction.prototype.addControls=function(args){this.addControlsArgs=args;this.invoker.go("addControls",arguments)};Mapstraction.prototype.addMarker=function(marker,old){marker.mapstraction=this;marker.api=this.api;marker.location.api=this.api;marker.map=this.maps[this.api];var propMarker=this.invoker.go("addMarker",arguments);marker.setChild(propMarker);if(!old){this.markers.push(marker)}this.markerAdded.fire({marker:marker})};Mapstraction.prototype.addMarkerWithData=function(marker,data){marker.addData(data);this.addMarker(marker)};Mapstraction.prototype.addPolylineWithData=function(polyline,data){polyline.addData(data);this.addPolyline(polyline)};Mapstraction.prototype.removeMarker=function(marker){var current_marker;for(var i=0;i<this.markers.length;i++){current_marker=this.markers[i];if(marker==current_marker){this.invoker.go("removeMarker",arguments);marker.onmap=false;this.markers.splice(i,1);this.markerRemoved.fire({marker:marker});break}}};Mapstraction.prototype.removeAllMarkers=function(){var current_marker;while(this.markers.length>0){current_marker=this.markers.pop();this.invoker.go("removeMarker",[current_marker])}};Mapstraction.prototype.declutterMarkers=function(opts){if(this.loaded[this.api]===false){var me=this;this.onload[this.api].push(function(){me.declutterMarkers(opts)});return}var map=this.maps[this.api];switch(this.api){case"multimap":map.declutterGroup(opts.groupName);break;case"  dummy":break;default:if(this.debug){alert(this.api+" not supported by Mapstraction.declutterMarkers")}}};Mapstraction.prototype.addPolyline=function(polyline,old){polyline.api=this.api;polyline.map=this.maps[this.api];var propPoly=this.invoker.go("addPolyline",arguments);polyline.setChild(propPoly);if(!old){this.polylines.push(polyline)}this.polylineAdded.fire({polyline:polyline})};var removePolylineImpl=function(polyline){this.invoker.go("removePolyline",arguments);polyline.onmap=false;this.polylineRemoved.fire({polyline:polyline})};Mapstraction.prototype.removePolyline=function(polyline){var current_polyline;for(var i=0;i<this.polylines.length;i++){current_polyline=this.polylines[i];if(polyline==current_polyline){this.polylines.splice(i,1);removePolylineImpl.call(this,polyline);break}}};Mapstraction.prototype.removeAllPolylines=function(){var current_polyline;while(this.polylines.length>0){current_polyline=this.polylines.pop();removePolylineImpl.call(this,current_polyline)}};Mapstraction.prototype.autoCenterAndZoom=function(){var lat_max=-90;var lat_min=90;var lon_max=-180;var lon_min=180;var lat,lon;var checkMinMax=function(){if(lat>lat_max){lat_max=lat}if(lat<lat_min){lat_min=lat}if(lon>lon_max){lon_max=lon}if(lon<lon_min){lon_min=lon}};for(var i=0;i<this.markers.length;i++){lat=this.markers[i].location.lat;lon=this.markers[i].location.lon;checkMinMax()}for(i=0;i<this.polylines.length;i++){for(var j=0;j<this.polylines[i].points.length;j++){lat=this.polylines[i].points[j].lat;lon=this.polylines[i].points[j].lon;checkMinMax()}}this.setBounds(new BoundingBox(lat_min,lon_min,lat_max,lon_max))};Mapstraction.prototype.centerAndZoomOnPoints=function(points){var bounds=new BoundingBox(points[0].lat,points[0].lon,points[0].lat,points[0].lon);for(var i=1,len=points.length;i<len;i++){bounds.extend(points[i])}this.setBounds(bounds)};Mapstraction.prototype.visibleCenterAndZoom=function(){var lat_max=-90;var lat_min=90;var lon_max=-180;var lon_min=180;var lat,lon;var checkMinMax=function(){if(lat>lat_max){lat_max=lat}if(lat<lat_min){lat_min=lat}if(lon>lon_max){lon_max=lon}if(lon<lon_min){lon_min=lon}};for(var i=0;i<this.markers.length;i++){if(this.markers[i].getAttribute("visible")){lat=this.markers[i].location.lat;lon=this.markers[i].location.lon;checkMinMax()}}for(i=0;i<this.polylines.length;i++){if(this.polylines[i].getAttribute("visible")){for(j=0;j<this.polylines[i].points.length;j++){lat=this.polylines[i].points[j].lat;lon=this.polylines[i].points[j].lon;checkMinMax()}}}this.setBounds(new BoundingBox(lat_min,lon_min,lat_max,lon_max))};Mapstraction.prototype.polylineCenterAndZoom=function(radius){var lat_max=-90;var lat_min=90;var lon_max=-180;var lon_min=180;for(var i=0;i<mapstraction.polylines.length;i++){for(var j=0;j<mapstraction.polylines[i].points.length;j++){lat=mapstraction.polylines[i].points[j].lat;lon=mapstraction.polylines[i].points[j].lon;latConv=lonConv=radius;if(radius>0){latConv=(radius/mapstraction.polylines[i].points[j].latConv());lonConv=(radius/mapstraction.polylines[i].points[j].lonConv())}if((lat+latConv)>lat_max){lat_max=(lat+latConv)}if((lat-latConv)<lat_min){lat_min=(lat-latConv)}if((lon+lonConv)>lon_max){lon_max=(lon+lonConv)}if((lon-lonConv)<lon_min){lon_min=(lon-lonConv)}}}this.setBounds(new BoundingBox(lat_min,lon_min,lat_max,lon_max))};Mapstraction.prototype.addImageOverlay=function(id,src,opacity,west,south,east,north){var b=document.createElement("img");b.style.display="block";b.setAttribute("id",id);b.setAttribute("src",src);b.style.position="absolute";b.style.zIndex=1;b.setAttribute("west",west);b.setAttribute("south",south);b.setAttribute("east",east);b.setAttribute("north",north);var oContext={imgElm:b};this.invoker.go("addImageOverlay",arguments,{context:oContext})};Mapstraction.prototype.setImageOpacity=function(id,opacity){if(opacity<0){opacity=0}if(opacity>=100){opacity=100}var c=opacity/100;var d=document.getElementById(id);if(typeof(d.style.filter)=="string"){d.style.filter="alpha(opacity:"+opacity+")"}if(typeof(d.style.KHTMLOpacity)=="string"){d.style.KHTMLOpacity=c}if(typeof(d.style.MozOpacity)=="string"){d.style.MozOpacity=c}if(typeof(d.style.opacity)=="string"){d.style.opacity=c}};Mapstraction.prototype.setImagePosition=function(id){var imgElement=document.getElementById(id);var oContext={latLng:{top:imgElement.getAttribute("north"),left:imgElement.getAttribute("west"),bottom:imgElement.getAttribute("south"),right:imgElement.getAttribute("east")},pixels:{top:0,right:0,bottom:0,left:0}};this.invoker.go("setImagePosition",arguments,{context:oContext});imgElement.style.top=oContext.pixels.top.toString()+"px";imgElement.style.left=oContext.pixels.left.toString()+"px";imgElement.style.width=(oContext.pixels.right-oContext.pixels.left).toString()+"px";imgElement.style.height=(oContext.pixels.bottom-oContext.pixels.top).toString()+"px"};Mapstraction.prototype.addJSON=function(json){var features;if(typeof(json)=="string"){features=eval("("+json+")")}else{features=json}features=features.features;var map=this.maps[this.api];var html="";var item;var polyline;var marker;var markers=[];if(features.type=="FeatureCollection"){this.addJSON(features.features)}for(var i=0;i<features.length;i++){item=features[i];switch(item.geometry.type){case"Point":html="<strong>"+item.title+"</strong><p>"+item.description+"</p>";marker=new Marker(new LatLonPoint(item.geometry.coordinates[1],item.geometry.coordinates[0]));markers.push(marker);this.addMarkerWithData(marker,{infoBubble:html,label:item.title,date:'new Date("'+item.date+'")',iconShadow:item.icon_shadow,marker:item.id,iconShadowSize:item.icon_shadow_size,icon:"http://boston.openguides.org/markers/AQUA.png",iconSize:item.icon_size,category:item.source_id,draggable:false,hover:false});break;case"Polygon":var points=[];polyline=new Polyline(points);mapstraction.addPolylineWithData(polyline,{fillColor:item.poly_color,date:'new Date("'+item.date+'")',category:item.source_id,width:item.line_width,opacity:item.line_opacity,color:item.line_color,polygon:true});markers.push(polyline);break;default:}}return markers};Mapstraction.prototype.addTileLayer=function(tile_url,opacity,copyright_text,min_zoom,max_zoom){if(!tile_url){return}this.tileLayers=this.tileLayers||[];opacity=opacity||0.6;copyright_text=copyright_text||"Mapstraction";min_zoom=min_zoom||1;max_zoom=max_zoom||18;return this.invoker.go("addTileLayer",[tile_url,opacity,copyright_text,min_zoom,max_zoom])};Mapstraction.prototype.addFilter=function(field,operator,value){if(!this.filters){this.filters=[]}this.filters.push([field,operator,value])};Mapstraction.prototype.removeFilter=function(field,operator,value){if(!this.filters){return}var del;for(var f=0;f<this.filters.length;f++){if(this.filters[f][0]==field&&(!operator||(this.filters[f][1]==operator&&this.filters[f][2]==value))){this.filters.splice(f,1);f--}}};Mapstraction.prototype.toggleFilter=function(field,operator,value){if(!this.filters){this.filters=[]}var found=false;for(var f=0;f<this.filters.length;f++){if(this.filters[f][0]==field&&this.filters[f][1]==operator&&this.filters[f][2]==value){this.filters.splice(f,1);f--;found=true}}if(!found){this.addFilter(field,operator,value)}};Mapstraction.prototype.removeAllFilters=function(){this.filters=[]};Mapstraction.prototype.doFilter=function(showCallback,hideCallback){var map=this.maps[this.api];var visibleCount=0;var f;if(this.filters){switch(this.api){case"multimap":var mmfilters=[];for(f=0;f<this.filters.length;f++){mmfilters.push(new MMSearchFilter(this.filters[f][0],this.filters[f][1],this.filters[f][2]))}map.setMarkerFilters(mmfilters);map.redrawMap();break;case"  dummy":break;default:var vis;for(var m=0;m<this.markers.length;m++){vis=true;for(f=0;f<this.filters.length;f++){if(!this.applyFilter(this.markers[m],this.filters[f])){vis=false}}if(vis){visibleCount++;if(showCallback){showCallback(this.markers[m])}else{this.markers[m].show()}}else{if(hideCallback){hideCallback(this.markers[m])}else{this.markers[m].hide()}}this.markers[m].setAttribute("visible",vis)}break}}return visibleCount};Mapstraction.prototype.applyFilter=function(o,f){var vis=true;switch(f[1]){case"ge":if(o.getAttribute(f[0])<f[2]){vis=false}break;case"le":if(o.getAttribute(f[0])>f[2]){vis=false}break;case"eq":if(o.getAttribute(f[0])==f[2]){vis=false}break}return vis};Mapstraction.prototype.getAttributeExtremes=function(field){var min;var max;for(var m=0;m<this.markers.length;m++){if(!min||min>this.markers[m].getAttribute(field)){min=this.markers[m].getAttribute(field)}if(!max||max<this.markers[m].getAttribute(field)){max=this.markers[m].getAttribute(field)}}for(var p=0;m<this.polylines.length;m++){if(!min||min>this.polylines[p].getAttribute(field)){min=this.polylines[p].getAttribute(field)}if(!max||max<this.polylines[p].getAttribute(field)){max=this.polylines[p].getAttribute(field)}}return[min,max]};Mapstraction.prototype.getMap=function(){return this.maps[this.api]};var LatLonPoint=mxn.LatLonPoint=function(lat,lon){this.lat=lat;this.lon=lon;this.lng=lon;this.invoker=new mxn.Invoker(this,"LatLonPoint")};mxn.addProxyMethods(LatLonPoint,["fromProprietary","toProprietary"],true);LatLonPoint.prototype.toString=function(){return this.lat+", "+this.lon};LatLonPoint.prototype.distance=function(otherPoint){var rads=Math.PI/180;var diffLat=(this.lat-otherPoint.lat)*rads;var diffLon=(this.lon-otherPoint.lon)*rads;var a=Math.sin(diffLat/2)*Math.sin(diffLat/2)+Math.cos(this.lat*rads)*Math.cos(otherPoint.lat*rads)*Math.sin(diffLon/2)*Math.sin(diffLon/2);return 2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a))*6371};LatLonPoint.prototype.equals=function(otherPoint){return this.lat==otherPoint.lat&&this.lon==otherPoint.lon};LatLonPoint.prototype.latConv=function(){return this.distance(new LatLonPoint(this.lat+0.1,this.lon))*10};LatLonPoint.prototype.lonConv=function(){return this.distance(new LatLonPoint(this.lat,this.lon+0.1))*10};var BoundingBox=mxn.BoundingBox=function(swlat,swlon,nelat,nelon){this.sw=new LatLonPoint(swlat,swlon);this.ne=new LatLonPoint(nelat,nelon)};BoundingBox.prototype.getSouthWest=function(){return this.sw};BoundingBox.prototype.getNorthEast=function(){return this.ne};BoundingBox.prototype.isEmpty=function(){return this.ne==this.sw};BoundingBox.prototype.contains=function(point){return point.lat>=this.sw.lat&&point.lat<=this.ne.lat&&point.lon>=this.sw.lon&&point.lon<=this.ne.lon};BoundingBox.prototype.toSpan=function(){return new LatLonPoint(Math.abs(this.sw.lat-this.ne.lat),Math.abs(this.sw.lon-this.ne.lon))};BoundingBox.prototype.extend=function(point){if(this.sw.lat>point.lat){this.sw.lat=point.lat}if(this.sw.lon>point.lon){this.sw.lon=point.lon}if(this.ne.lat<point.lat){this.ne.lat=point.lat}if(this.ne.lon<point.lon){this.ne.lon=point.lon}return};var Marker=mxn.Marker=function(point){this.api=null;this.location=point;this.onmap=false;this.proprietary_marker=false;this.attributes=[];this.pinID="mspin-"+new Date().getTime()+"-"+(Math.floor(Math.random()*Math.pow(2,16)));this.invoker=new mxn.Invoker(this,"Marker",function(){return this.api});mxn.addEvents(this,["openInfoBubble","closeInfoBubble","click"])};mxn.addProxyMethods(Marker,["fromProprietary","hide","openBubble","show","toProprietary","update"]);Marker.prototype.setChild=function(some_proprietary_marker){this.proprietary_marker=some_proprietary_marker;some_proprietary_marker.mapstraction_marker=this;this.onmap=true};Marker.prototype.setLabel=function(labelText){this.labelText=labelText};Marker.prototype.addData=function(options){for(var sOptKey in options){if(options.hasOwnProperty(sOptKey)){switch(sOptKey){case"label":this.setLabel(options.label);break;case"infoBubble":this.setInfoBubble(options.infoBubble);break;case"icon":if(options.iconSize&&options.iconAnchor){this.setIcon(options.icon,options.iconSize,options.iconAnchor)}else{if(options.iconSize){this.setIcon(options.icon,options.iconSize)}else{this.setIcon(options.icon)}}break;case"iconShadow":if(options.iconShadowSize){this.setShadowIcon(options.iconShadow,[options.iconShadowSize[0],options.iconShadowSize[1]])}else{this.setIcon(options.iconShadow)}break;case"infoDiv":this.setInfoDiv(options.infoDiv[0],options.infoDiv[1]);break;case"draggable":this.setDraggable(options.draggable);break;case"hover":this.setHover(options.hover);this.setHoverIcon(options.hoverIcon);break;case"hoverIcon":this.setHoverIcon(options.hoverIcon);break;case"openBubble":this.openBubble();break;case"groupName":this.setGroupName(options.groupName);break;default:this.setAttribute(sOptKey,options[sOptKey]);break}}}};Marker.prototype.setInfoBubble=function(infoBubble){this.infoBubble=infoBubble};Marker.prototype.setInfoDiv=function(infoDiv,div){this.infoDiv=infoDiv;this.div=div};Marker.prototype.setIcon=function(iconUrl,iconSize,iconAnchor){this.iconUrl=iconUrl;if(iconSize){this.iconSize=iconSize}if(iconAnchor){this.iconAnchor=iconAnchor}};Marker.prototype.setIconSize=function(iconSize){if(iconSize){this.iconSize=iconSize}};Marker.prototype.setIconAnchor=function(iconAnchor){if(iconAnchor){this.iconAnchor=iconAnchor}};Marker.prototype.setShadowIcon=function(iconShadowUrl,iconShadowSize){this.iconShadowUrl=iconShadowUrl;if(iconShadowSize){this.iconShadowSize=iconShadowSize}};Marker.prototype.setHoverIcon=function(hoverIconUrl){this.hoverIconUrl=hoverIconUrl};Marker.prototype.setDraggable=function(draggable){this.draggable=draggable};Marker.prototype.setHover=function(hover){this.hover=hover};Marker.prototype.setGroupName=function(sGrpName){this.groupName=sGrpName};Marker.prototype.setAttribute=function(key,value){this.attributes[key]=value};Marker.prototype.getAttribute=function(key){return this.attributes[key]};var Polyline=mxn.Polyline=function(points){this.api=null;this.points=points;this.attributes=[];this.onmap=false;this.proprietary_polyline=false;this.pllID="mspll-"+new Date().getTime()+"-"+(Math.floor(Math.random()*Math.pow(2,16)));this.invoker=new mxn.Invoker(this,"Polyline",function(){return this.api})};mxn.addProxyMethods(Polyline,["fromProprietary","hide","show","toProprietary","update"]);Polyline.prototype.addData=function(options){for(var sOpt in options){if(options.hasOwnProperty(sOpt)){switch(sOpt){case"color":this.setColor(options.color);break;case"width":this.setWidth(options.width);break;case"opacity":this.setOpacity(options.opacity);break;case"closed":this.setClosed(options.closed);break;case"fillColor":this.setFillColor(options.fillColor);break;default:this.setAttribute(sOpt,options[sOpt]);break}}}};Polyline.prototype.setChild=function(some_proprietary_polyline){this.proprietary_polyline=some_proprietary_polyline;this.onmap=true};Polyline.prototype.setColor=function(color){this.color=(color.length==7&&color[0]=="#")?color.toUpperCase():color};Polyline.prototype.setWidth=function(width){this.width=width};Polyline.prototype.setOpacity=function(opacity){this.opacity=opacity};Polyline.prototype.setClosed=function(bClosed){this.closed=bClosed};Polyline.prototype.setFillColor=function(sFillColor){this.fillColor=sFillColor};Polyline.prototype.setAttribute=function(key,value){this.attributes[key]=value};Polyline.prototype.getAttribute=function(key){return this.attributes[key]};Polyline.prototype.simplify=function(tolerance){var reduced=[];reduced[0]=this.points[0];var markerPoint=0;for(var i=1;i<this.points.length-1;i++){if(this.points[i].distance(this.points[markerPoint])>=tolerance){reduced[reduced.length]=this.points[i];markerPoint=i}}reduced[reduced.length]=this.points[this.points.length-1];this.points=reduced}})();