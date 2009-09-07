/*
Copyright (c) 2009 Tom Carden, Steve Coast, Mikel Maron, Andrew Turner, Henri Bergius, Rob Moran, Derek Fowler
All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

 * Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
 * Neither the name of the Mapstraction nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/
mxn.register("microsoft",{Mapstraction:{init:function(a,b){var c=this;if(VEMap){this.maps[b]=new VEMap(a.id);this.maps[b].AttachEvent("onclick",function(f){c.clickHandler();var d=f.mapX;var g=f.mapY;var e=new VEPixel(d,g);c.click.fire({location:new mxn.LatLonPoint(e.Latitude,e.Longitude)})});this.maps[b].AttachEvent("onendzoom",function(d){c.moveendHandler(c);c.changeZoom.fire()});this.maps[b].AttachEvent("onendpan",function(d){c.moveendHandler(c);c.endPan.fire()});this.maps[b].AttachEvent("onchangeview",function(d){c.endPan.fire()});this.maps[b].LoadMap();document.getElementById("MSVE_obliqueNotification").style.visibility="hidden";this.loaded[b]=true;c.load.fire()}else{alert(b+" map script not imported")}},applyOptions:function(){var a=this.maps[this.api];if(this.options.enableScrollWheelZoom){a.enableContinuousZoom();a.enableScrollWheelZoom()}},resizeTo:function(b,a){this.maps[this.api].Resize(b,a)},addControls:function(a){var b=this.maps[this.api];if(a.pan){b.SetDashboardSize(VEDashboardSize.Normal)}else{b.SetDashboardSize(VEDashboardSize.Tiny)}if(a.zoom=="large"){b.SetDashboardSize(VEDashboardSize.Small)}else{if(a.zoom=="small"){b.SetDashboardSize(VEDashboardSize.Tiny)}else{b.HideDashboard();b.HideScalebar()}}},addSmallControls:function(){var a=this.maps[this.api];a.SetDashboardSize(VEDashboardSize.Tiny)},addLargeControls:function(){var a=this.maps[this.api];a.SetDashboardSize(VEDashboardSize.Normal);this.addControlsArgs.pan=true;this.addControlsArgs.zoom="large"},addMapTypeControls:function(){var a=this.maps[this.api];a.addTypeControl()},dragging:function(a){var b=this.maps[this.api];if(a){b.enableDragMap()}else{b.disableDragMap()}},setCenterAndZoom:function(a,b){var d=this.maps[this.api];var c=a.toProprietary(this.api);var e=b;d.SetCenterAndZoom(new VELatLong(a.lat,a.lon),e)},addMarker:function(b,a){var d=this.maps[this.api];var c=b.toProprietary(this.api);d.AddShape(c);return c},removeMarker:function(b){var c=this.maps[this.api];var d=b.proprietary_marker.GetID();var a=c.GetShapeByID(d);c.DeleteShape(a)},removeAllMarkers:function(){var a=this.maps[this.api]},declutterMarkers:function(a){var b=this.maps[this.api]},addPolyline:function(b,a){var d=this.maps[this.api];var c=b.toProprietary(this.api);c.HideIcon();d.AddShape(c);return c},removePolyline:function(b){var c=this.maps[this.api];var d=b.proprietary_polyline.GetID();var a=c.GetShapeByID(d);c.DeleteShape(a)},getCenter:function(){var b=this.maps[this.api];var c=b.GetCenter();var a=new mxn.LatLonPoint(c.Latitude,c.Longitude);return a},setCenter:function(a,b){var d=this.maps[this.api];var c=a.toProprietary(this.api);d.SetCenter(new VELatLong(a.lat,a.lon))},setZoom:function(a){var b=this.maps[this.api];b.SetZoomLevel(a)},getZoom:function(){var b=this.maps[this.api];var a=b.GetZoomLevel();return a},getZoomLevelForBoundingBox:function(e){var d=this.maps[this.api];var c=e.getNorthEast();var a=e.getSouthWest();var b;return b},setMapType:function(a){var b=this.maps[this.api];switch(a){case mxn.Mapstraction.ROAD:b.SetMapStyle(VEMapStyle.Road);break;case mxn.Mapstraction.SATELLITE:b.SetMapStyle(VEMapStyle.Aerial);break;case mxn.Mapstraction.HYBRID:b.SetMapStyle(VEMapStyle.Hybrid);break;default:b.SetMapStyle(VEMapStyle.Road)}},getMapType:function(){var a=this.maps[this.api];var b=a.GetMapStyle();switch(b){case VEMapStyle.Aerial:return mxn.Mapstraction.SATELLITE;case VEMapStyle.Road:return mxn.Mapstraction.ROAD;case VEMapStyle.Hybrid:return mxn.Mapstraction.HYBRID;default:return null}},getBounds:function(){var b=this.maps[this.api];view=b.GetMapView();var a=view.TopLeftLatLong;var c=view.BottomRightLatLong;return new mxn.BoundingBox(c.Latitude,a.Longitude,a.Latitude,c.Longitude)},setBounds:function(b){var d=this.maps[this.api];var a=b.getSouthWest();var c=b.getNorthEast();var e=new VELatLongRectangle(new VELatLong(c.lat,c.lon),new VELatLong(a.lat,a.lon));d.SetMapView(e)},addImageOverlay:function(c,a,e,i,f,g,d,h){var b=this.maps[this.api]},setImagePosition:function(e,b){var d=this.maps[this.api];var c;var a},addOverlay:function(a,c){var e=this.maps[this.api];var b=new VEShapeLayer();var d=new VEShapeSourceSpecification(VEDataType.GeoRSS,a,b);e.AddShapeLayer(b)},addTileLayer:function(e,a,b,c,d){throw"Not implemented"},toggleTileLayer:function(a){throw"Not implemented"},getPixelRatio:function(){throw"Not implemented"},mousePosition:function(a){var c=document.getElementById(a);if(c!=null){var b=this.maps[this.api];b.AttachEvent("onmousemove",function(e){var d=b.PixelToLatLong(new VEPixel(e.mapX,e.mapY));var f=d.Latitude.toFixed(4)+" / "+d.Longitude.toFixed(4);c.innerHTML=f});c.innerHTML="0.0000 / 0.0000"}}},LatLonPoint:{toProprietary:function(){return new VELatLong(this.lat,this.lon)},fromProprietary:function(a){this.lat=a.Latitude;this.lon=a.Longitude}},Marker:{toProprietary:function(){var a=new VEShape(VEShapeType.Pushpin,this.location.toProprietary("microsoft"));return a},openBubble:function(){var a=this.proprietary_marker;map.ClearInfoBoxStyles();a.SetTitle(this.infoBubble)},hide:function(){this.proprietary_marker.hide()},show:function(){this.proprietary_marker_unhide()},update:function(){throw"Not implemented"}},Polyline:{toProprietary:function(){var e=[];for(var d=0,g=this.points.length;d<g;d++){e.push(this.points[d].toProprietary("microsoft"))}var c=new VEShape(VEShapeType.Polyline,e);if(this.color){var a=new mxn.util.Color(this.color);var b=(typeof(this.opacity)=="undefined"||this.opacity===null)?1:this.opacity;var f=new VEColor(a.red,a.green,a.blue,b);c.SetLineColor(f)}return c},show:function(){this.proprietary_polyline.Show()},hide:function(){this.proprietary_polyline.Hide()}}});