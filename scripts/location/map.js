
function Shape(map,opts) {
	this.options.map = map;
	this._init(opts);
	// Return googles polygon instead of Shape's object.
	return this.polygon;
}

Shape.prototype = {
		
		options:{
			clickable : true,
			fillColor: '#8DD8ED',
			fillOpacity: 0.6,
			geodesic: true,
			href: false,
			listingCount: 0,
			map: false,
			paths: [],
			strokeColor: '#2D669D',
			strokeOpacity: 1,
			strokeWeight: 1,
			title: false,
			tooltip: false,
			zIndex: 5
		},
		
		fillColors: ['#8DD8ED','#B0D973','#F2BC4F','#E293FE','#F1024B','#BBF0C4','#1821A3','#960E4E','#26761D','#2A38F6','F1218F','FFFF00'],
		strokeColors: ['#8DD8ED','#B0D973','#F2BC4F','#E293FE','#F1024B','#BBF0C4','#1821A3','#960E4E','#26761D','#2A38F6','F1218F','FFFF00'],
		polygon: false,
		_init: function(options){
			for(k in options) {
				this.options[k] = options[k];
			}
			for( var i = 0; i < this.options.paths.length; i++) {
				this.options.paths[i] = google.maps.geometry.encoding.decodePath(this.options.paths[i]);
			}
			this.options.fillColor = !!this.options.colorCode ? this.options.colorCode :  this._getFillColor(); 
			if(/^[0-9A-Fa-f]{6}$/.test(this.options.fillColor)) { this.options.fillColor = '#'+this.options.fillColor }
			this.polygon = new google.maps.Polygon(this.options);
			google.maps.event.addListener(this.polygon,'click',this._onClick);
			google.maps.event.addListener(this.polygon,'mousemove',this._onMouseMove);
			google.maps.event.addListener(this.polygon,'mouseout',this._onExit);
		},
		_onClick: function(event) {
			if(!!this.href)
				window.location.href = this.href.replace(/\s/g,'_');
		},
		_onMouseMove: function(event) {
			this.setOptions({fillOpacity:1.0,strokeOpacity:1.0});
			if(toolTip)
				toolTip.draw(event, this);
		},
		_onExit: function() {
			this.setOptions({fillOpacity:0.6,strokeOpacity:0.8});
			if(toolTip)
				toolTip.hide();
		},
		_getFillColor: function() {
			return this.fillColors[polygonShapes.length % this.fillColors.length];
		},
		_getStrokeColor: function() {
			return this.fillColors[polygonShapes.length % this.strokeColors.length];
		}
}

function ToolTip(map) {
	google.maps.OverlayView.call(this);
	var div = this.div_ = document.createElement('div');
	div.style.backgroundColor = '#FFFFFF';
	div.style.position = 'absolute';
	div.style.border = '1px solid #CCCCCC';
	div.style.boxShadow = '3px 3px 4px #CCCCCC';
	div.style.borderRadius = '6px';
	div.style.whiteSpace = 'nowrap';
	div.style.fontSize = '12px';
	div.style.padding = '0.5em 1em';
	div.style.zIndex = 10;
	this.setMap(map);
}
ToolTip.prototype = new google.maps.OverlayView();
ToolTip.prototype._init = function(args) {

}

ToolTip.prototype.draw = function(event,args) {
	var self = this;
	var div = this.div_;
	if(event) {
		var title = !!args.askingPrice ? args.text.replace(/,\s/g,',<br>') : args.title
		var html = '<strong>'+title+'</strong>';
		if (!!args.askingPrice && args.askingPrice != "null") {
			html += '<br>'+args.askingPrice;
		}
		div.innerHTML = html;
		var projection = this.get('projection');
		var center = projection.fromLatLngToDivPixel(this.getMap().getCenter());
		var point = projection.fromLatLngToDivPixel(event.latLng);
		if(point) {
			var _left =  point.x > (center.x * 1.25) ? point.x - $(div).outerWidth() : point.x + 15;
			var _top = point.y > (center.y * 1.25 ) ? point.y - $(div).outerHeight() - 15 : point.y + 15;
			div.style.left = _left + 'px';
			div.style.top  = _top + 'px';
			div.style.display = 'block';
		}
	} else { 
		div.style.display = 'none';
	}
}
ToolTip.prototype.hide = function() {
	if (this.div_) {
		this.div_.style.display = 'none';
	}
}
ToolTip.prototype.onAdd = function() {
	var pane = this.getPanes().overlayImage;
	pane.appendChild(this.div_);
}
ToolTip.prototype.onRemove = function() {
	if (this.div_) {
      this.div_.parentNode.removeChild(this.div_);
      this.div_ = null;
    }
}

// Prototype array to hold google polygons
var polygonShapes = [];

// Prototype tooltip
var toolTip = false;

// Prototype map markers
var markerPoints = [];
var tmpBounds;
// FSBO map style
var FSBO_Style = [
  { featureType: "poi", elementType: "geometry", stylers: [ { visibility: 'off' } ] },
  { featureType: "administrative", elementType: "geometry", stylers: [ { visibility: 'off' } ] },
  { featureType: "landscape.man_made", stylers: [ { visibility: 'off' } ] },
  { featureType: "road.local", stylers: [ { visibility: 'off' } ] },
  { featureType: "transit", stylers: [ { visibility: 'off' } ] }
];

$(document).ready(function(){
	// Build default bounds to generate map center & parent MBR
	gBounds = new google.maps.LatLngBounds(
			new google.maps.LatLng(bound[0][0],bound[0][1]),
			new google.maps.LatLng(bound[1][0],bound[1][1])
			);
	tmpBounds = new google.maps.LatLngBounds();
	// Map options
	var opts =  {
			center : gBounds.getCenter(),
			disableDoubleClickZoom: true,
			draggable: true,
			mapTypeControl: false,
			mapTypeControlOptions: { mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'fsbo'] },
			mapTypeId: google.maps.MapTypeId.ROADMAP,
			overviewMapControl : false,
			panControl: false,
			rotateControl: false,
			scaleControl: false,
			scrollwheel: true,
			streetViewControl: false,
			zoomControl: true,
			zoom: 13
		};
	// Load map
	map = new google.maps.Map(document.getElementById('mapPlaceHolder'),opts);
	var fsboMapType = new google.maps.StyledMapType(FSBO_Style, { name: 'ForSaleByOwner.com' })
	map.mapTypes.set('fsbo', fsboMapType);
	map.setMapTypeId('fsbo');
	
	// Init custom tooltip
	toolTip = new ToolTip(map);
	// Build polygons from parent page
	for( var i = 0; i < gPolygons.length; i++ ) {
		polygonShapes.push(new Shape(map,gPolygons[i]));
	}
	// If we have many shapes, recalculate map bounds to all rendered polygons
	if ( polygonShapes.length > 0 ) {
		for( var j = 0; j < polygonShapes.length; j++ ) {
			var paths = polygonShapes[j].getPaths();
			for( var k = 0; k < paths.length; k++ ) {
				var path = paths.getAt(k);
				for( var i = 0; i < path.length; i++ ) {
					tmpBounds.extend(path.getAt(i));
				}
			}
		}
		map.fitBounds(tmpBounds);
	} else {
		// No shapes, but try bounds
		map.fitBounds(gBounds);
	}
	// If we're only displaying one shape; remove mouse events
	// and clear shading
	if(polygonShapes.length == 1) {
		polygonShapes[0].setOptions({fillOpacity:0,strokeWeight:2,clickable:false});
		google.maps.event.clearListeners(polygonShapes[0], 'mouseover');
		google.maps.event.clearListeners(polygonShapes[0], 'mousemove');
		google.maps.event.clearListeners(polygonShapes[0], 'mouseout');
		google.maps.event.clearListeners(polygonShapes[0], 'click');
	}
	/* Look for & add map makers */
	if(typeof searchMapListings == "undefined" || typeof searchMapListings != "object") {
		searchMapListings = [];
	}
	for( var i = 0; i < searchMapListings.length; i++ ) {
		var iconPath = i < 5 ? '/images/map/orangeDot.png' : '/images/map/redDot.png';
		if(searchMapListings[i].featured) {
			iconPath = '/images/map/yellowDot.png';
		}
		var icon = new google.maps.MarkerImage(iconPath, new google.maps.Size(7,7));
		
		var markerOpts = {
				askingPrice: searchMapListings[i].askingPrice,
				clickable: true,
				href: searchMapListings[i].href,
				icon: icon,
				map: map,
				position: new google.maps.LatLng(searchMapListings[i].lat,searchMapListings[i].lng),
				text: searchMapListings[i].address,
				zIndex: -1
		}
		var marker = new google.maps.Marker(markerOpts);
		google.maps.event.addListener(marker,'click',function(){
			window.location.href = this.href;
		});
		
		google.maps.event.addListener(marker,'mousemove',function(event){
			if(toolTip)
				toolTip.draw(event,this);
		});
		google.maps.event.addListener(marker,'mouseout',function(){
			if(toolTip)
				toolTip.hide();
		});
		
		markerPoints.push(marker);
	}
});

function showBounds() {
	return new google.maps.Rectangle({map:map,bounds: !!tmpBounds ? tmpBounds : gBounds})
}
