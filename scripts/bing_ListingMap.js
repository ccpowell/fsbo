// The following comments are for JSLint.
// Do NOT remove them!
// see http://www.jslint.com/
/*jslint browser: true, debug: true, devel: true, white: true, plusplus: true, maxerr: 100, unparam: true, 
indent: 4, bitwise: true, vars: true */
/*global jQuery: false, Microsoft: false, $: false, listingURL: false */

var ListingMap = {};

function createNeighborhoodLink() {
    'use strict';
    var container = document.createElement("div");
    container.style.bottom = "50px";
    container.style.right = "10px";
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
    var html = '<a id="mapExploreNeighborhood" href="/listing/' + listingURL + '/neighborhood">Explore Neighborhood</a> <img src="http://www.forsalebyowner.com/images/global/arrowRtBlue.gif">';
    container.innerHTML = html;
    $('#' + ListingMap.mapContainer).append(container);
}

/*
Class for listing map
*/
ListingMap.map = null;
ListingMap.lat = null;
ListingMap.lng = null;
ListingMap.accuracy = 0;
ListingMap.minAccuracy = 6;
ListingMap.point = null;
ListingMap.marker = null;
ListingMap.zoom = 15;
ListingMap.mapType = null;
ListingMap.hasMarker = true;
ListingMap.mapContainer = 'mapMode';

ListingMap.load = function () {
    'use strict';
    var markerOptions = {
        icon: "http://www.forsalebyowner.com/images/map/iconBlank.png",
        width: 20,
        height: 41
    };

    if ((!ListingMap.lat && !ListingMap.lng) || ListingMap.accuracy < ListingMap.minAccuracy) {
        $('#mediaTabs .map').each(function () {
            //if the map tab is active (usually because the listing has no photos)
            //make the photos tab active instead
            if ($(this).hasClass("active")) {
                $('#mediaTabs .photos').trigger('click');
            }
        });

        $('#mapLinks').html('');
        return;
    }

    ListingMap.point = new Microsoft.Maps.Location(ListingMap.lat, ListingMap.lng);
    ListingMap.marker = new Microsoft.Maps.Pushpin(ListingMap.point, markerOptions);
};


ListingMap.mapListing = function () {
    'use strict';
    var options = {
        credentials: "AgjSx3sxeWsMwX7tppXvmhHuOOG41Nov_nnjREuMw3B-4_7Tg_Fpuz8fi_EHi0H0",
        showDashboard: true,
        showMapTypeSelector: true,
        enableSearchLogo: false,
        center: ListingMap.point,
        zoom: ListingMap.zoom
    };
    ListingMap.map = new Microsoft.Maps.Map(document.getElementById(ListingMap.mapContainer), options);
    if (ListingMap.hasMarker) {
        ListingMap.map.entities.clear();
        ListingMap.map.entities.push(ListingMap.marker);
    }
    createNeighborhoodLink();
};

