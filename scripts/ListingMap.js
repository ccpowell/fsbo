/*
Class for listing map
*/
var ListingMap = function() {};
ListingMap.map = null;
ListingMap.lat = null;
ListingMap.lng = null;
ListingMap.accuracy = 0;
ListingMap.minAccuracy = 6;
ListingMap.point = null;
ListingMap.marker = null;
ListingMap.baseIcon = null;
ListingMap.zoom = 15;
ListingMap.zoomControl = true;
ListingMap.mapType = null;
ListingMap.mapTypeControl = true;
ListingMap.hasMarker = true;
ListingMap.mapContainer = 'mapMode';

ListingMap.load = function() {
	if((!ListingMap.lat && !ListingMap.lng) || ListingMap.accuracy < ListingMap.minAccuracy) {
		$('#mediaTabs .map').each(function() {
			//if the map tab is active (usually because the listing has no photos)
			//make the photos tab active instead
			if($(this).hasClass("active")) {
				$('#mediaTabs .photos').trigger('click');
			}
		});
		
		$('#mapLinks').html('');
		return;
	}

	if(!GBrowserIsCompatible()) {
		return;
	}

	ListingMap.baseIcon = new GIcon();
	ListingMap.baseIcon.iconSize = new GSize(20,41);
	ListingMap.baseIcon.iconAnchor = new GPoint(10,41);
	ListingMap.baseIcon.infoWindowAnchor = new GPoint(10,1);
	ListingMap.baseIcon.transparent = "http://www.forsalebyowner.com/images/map/iconBlankTrans.png";
	ListingMap.baseIcon.imageMap = [10,0,6,0,5,1,4,2,3,3,2,4,1,6,1,15,2,15,2,19,3,19,3,22,4,22,4,25,5,25,5,28,6,28,6,31,7,31,7,34,8,34,8,37,9,37,9,39,10,39,10,41,11,41,11,40,12,40,12,37,13,37,13,34,14,34,14,31,15,31,15,28,16,28,16,25,17,25,17,22,18,22,18,19,19,19,19,15,20,15,20,6,19,6,19,4,18,4,18,3,17,3,17,2,16,2,16,1,15,1,15,0,11,0]; 

	ListingMap.blankIcon = new GIcon(ListingMap.baseIcon);
	ListingMap.blankIcon.image = "http://www.forsalebyowner.com/images/map/iconBlank.png";
	ListingMap.blankIcon.printImage = "http://www.forsalebyowner.com/images/map/iconBlank.gif"; 
	ListingMap.blankIcon.mozPrintImage = "http://www.forsalebyowner.com/images/map/iconBlankGrey.gif";

	ListingMap.point = new GLatLng(ListingMap.lat, ListingMap.lng);

	var markerOptions = new Object();
	markerOptions.icon = ListingMap.blankIcon;
	markerOptions.clickable = false;
	ListingMap.marker = new GMarker(ListingMap.point, markerOptions);
};


ListingMap.mapListing = function() {
	ListingMap.map = new GMap2(document.getElementById(ListingMap.mapContainer));
	try {
		if (ListingMap.zoomControl) {
			ListingMap.map.addControl(new GSmallMapControl());
		}
		if (ListingMap.mapTypeControl) {
			ListingMap.map.addControl(new GMapTypeControl());
		}
		ListingMap.map.setCenter(ListingMap.point, ListingMap.zoom);
		if (ListingMap.mapType) {
			ListingMap.map.setMapType(ListingMap.mapType);
		}
		if (ListingMap.hasMarker) {
			ListingMap.map.addOverlay(ListingMap.marker);
		}
		if(ListingMap.map) {
			ListingMap.map.addControl(new NeighborhoodControl());
		}
	} catch(err) {
	}
};

function NeighborhoodControl() {
}

NeighborhoodControl.prototype = new GControl();

NeighborhoodControl.prototype.initialize = function(map) {
	var container = document.createElement("div");
	container.style.position = "absolute";
	container.style.width = '145px';
	container.style.height = '16px';
	container.style.paddingLeft = '10px';
	container.style.paddingRight = '5px';
	container.style.paddingTop = '5px';
	container.style.paddingBottom = '5px';
	container.style.border = '3px solid #336399';
	container.style.fontSize = '12px';
	container.style.lineHeight = '1.3em';
	container.style.backgroundColor = '#fff';
	var html = '<a id="mapExploreNeighborhood" href="/listing/'+listingURL+'/neighborhood">Explore Neighborhood</a> <img src="http://www.forsalebyowner.com/images/global/arrowRtBlue.gif">';
	container.innerHTML = html;
	map.getContainer().appendChild(container);
	return container;
}

NeighborhoodControl.prototype.getDefaultPosition = function() {
  return new GControlPosition(G_ANCHOR_BOTTOM_RIGHT, new GSize(10, 20));
}
