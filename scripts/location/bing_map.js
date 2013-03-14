// The following comments are for JSLint.
// Do NOT remove them!
// see http://www.jslint.com/
/*jslint browser: true, debug: true, devel: true, white: true, plusplus: true, maxerr: 100, unparam: true, indent: 4, bitwise: true, vars: true */
/*global jQuery: false, Microsoft: false, google: false, gBounds: true, gPolygons: true, bound: false, map: true, searchMapListings: true */

// Prototype array to hold google polygons
var polygonShapes = [];

// Prototype tooltip
var toolTip = false;

// Prototype map markers
var markerPoints = [];
var tmpBounds;

function polylineDecode(polyLineString) {
    'use strict';
    var lat_or_lng = 0,
        charIndex = 0,
		points = [],
		previousPoint = [0, 0],
        latlng = [],
        shiftBlock,
        resultBit,
        bit,
        ll,
        delta,
        number;

    while (charIndex < polyLineString.length) {
        shiftBlock = resultBit = 0x00;
        do {
            bit = polyLineString.charCodeAt(charIndex++) - 0x3F; // Convet char to bit & offset
            resultBit |= (bit & 0x1F) << shiftBlock;                 // Alter resulting bit based on last block
            shiftBlock += 0x05;                                        // Advance to next 5-bit block
        } while (bit >= 0x20);
        ll = lat_or_lng % 2;
        delta = resultBit & 0x01 ? ~(resultBit >> 0x01) : resultBit >> 0x01; // Determine number signing by last bit
        number = previousPoint[ll] + delta;          // Calculate next number by addition of delta
        previousPoint[ll] = number;                      // Store new previous point        
        latlng[ll] = (number * 1e-5);
        if (1 === ll) {
            points.push(new google.maps.LatLng(latlng[0], latlng[1]));
        }
        lat_or_lng++;                                                // Move cursor to next lat/lng
    }

    return points;
}


function Shape(map, opts) {
    'use strict';
    this.options.map = map;
    this.m_init(opts);
    // Return polygon instead of Shape's object.
    return this.polygon;
}

var unused = (function ($) {
    'use strict';
    Shape.prototype = {
        options: {
            clickable: true,
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

        fillColors: ['#8DD8ED', '#B0D973', '#F2BC4F', '#E293FE', '#F1024B', '#BBF0C4', '#1821A3', '#960E4E', '#26761D', '#2A38F6', 'F1218F', 'FFFF00'],
        strokeColors: ['#8DD8ED', '#B0D973', '#F2BC4F', '#E293FE', '#F1024B', '#BBF0C4', '#1821A3', '#960E4E', '#26761D', '#2A38F6', 'F1218F', 'FFFF00'],
        polygon: false,
        m_init: function (options) {
            var i;
            $.extend(this.options, options);
            for (i = 0; i < this.options.paths.length; i++) {
                //this.options.paths[i] = google.maps.geometry.encoding.decodePath(this.options.paths[i]);
                this.options.paths[i] = polylineDecode(this.options.paths[i]);
            }
            this.options.fillColor = !!this.options.colorCode ? this.options.colorCode : this.m_getFillColor();
            if (/^[0-9A-Fa-f]{6}$/.test(this.options.fillColor)) { this.options.fillColor = '#' + this.options.fillColor; }
            this.polygon = new google.maps.Polygon(this.options);
            google.maps.event.addListener(this.polygon, 'click', this.m_onClick);
            google.maps.event.addListener(this.polygon, 'mousemove', this.m_onMouseMove);
            google.maps.event.addListener(this.polygon, 'mouseout', this.m_onExit);
        },
        m_onClick: function (event) {
            if (!!this.href) {
                window.location.href = this.href.replace(/\s/g, '_');
            }
        },
        m_onMouseMove: function (event) {
            this.setOptions({ fillOpacity: 1.0, strokeOpacity: 1.0 });
            if (toolTip) {
                toolTip.draw(event, this);
            }
        },
        m_onExit: function () {
            this.setOptions({ fillOpacity: 0.6, strokeOpacity: 0.8 });
            if (toolTip) {
                toolTip.hide();
            }
        },
        m_getFillColor: function () {
            return this.fillColors[polygonShapes.length % this.fillColors.length];
        },
        m_getStrokeColor: function () {
            return this.fillColors[polygonShapes.length % this.strokeColors.length];
        }
    };
} (jQuery));

function ToolTip(map) {
    'use strict';
    google.maps.OverlayView.call(this);
    var div = this.m_div = document.createElement('div');
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


var unused = (function ($) {
    'use strict';

    ToolTip.prototype = new google.maps.OverlayView();
    ToolTip.prototype.m_init = function (args) {
    };

    ToolTip.prototype.draw = function (event, args) {
        var div = this.m_div;
        if (event) {
            var title = !!args.askingPrice ? args.text.replace(/,\s/g, ',<br>') : args.title;
            var html = '<strong>' + title + '</strong>';
            if (!!args.askingPrice && args.askingPrice !== "null") {
                html += '<br>' + args.askingPrice;
            }
            div.innerHTML = html;
            var projection = this.get('projection');
            var center = projection.fromLatLngToDivPixel(this.getMap().getCenter());
            var point = projection.fromLatLngToDivPixel(event.latLng);
            if (point) {
                var left = point.x > (center.x * 1.25) ? point.x - $(div).outerWidth() : point.x + 15;
                var top = point.y > (center.y * 1.25) ? point.y - $(div).outerHeight() - 15 : point.y + 15;
                div.style.left = left + 'px';
                div.style.top = top + 'px';
                div.style.display = 'block';
            }
        } else {
            div.style.display = 'none';
        }
    };
    ToolTip.prototype.hide = function () {
        if (this.m_div) {
            this.m_div.style.display = 'none';
        }
    };
    ToolTip.prototype.onAdd = function () {
        var pane = this.getPanes().overlayImage;
        pane.appendChild(this.m_div);
    };
    ToolTip.prototype.onRemove = function () {
        if (this.m_div) {
            this.m_div.parentNode.removeChild(this.m_div);
            this.m_div = null;
        }
    };

} (jQuery));

jQuery(document).ready(function () {
    'use strict';
    // Build default bounds to generate map center & parent MBR
    gBounds = new google.maps.LatLngBounds(
			new google.maps.LatLng(bound[0][0], bound[0][1]),
			new google.maps.LatLng(bound[1][0], bound[1][1])
			);
    tmpBounds = new google.maps.LatLngBounds();

    // Map options
    var opts = {
        center: gBounds.getCenter(),
        disableDoubleClickZoom: true,
        draggable: true,
        mapTypeControl: false,
        mapTypeControlOptions: { mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'fsbo'] },
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        overviewMapControl: false,
        panControl: false,
        rotateControl: false,
        scaleControl: false,
        scrollwheel: true,
        streetViewControl: false,
        zoomControl: true,
        zoom: 13
    }, i, j, k;
    // Load map
    map = new google.maps.Map(document.getElementById('mapPlaceHolder'), opts);
    var fsboMapType = new google.maps.StyledMapType(FSBO_Style, { name: 'ForSaleByOwner.com' });
    map.mapTypes.set('fsbo', fsboMapType);
    map.setMapTypeId('fsbo');

    // Init custom tooltip
    toolTip = new ToolTip(map);
    // Build polygons from parent page
    for (i = 0; i < gPolygons.length; i++) {
        polygonShapes.push(new Shape(map, gPolygons[i]));
    }
    // If we have many shapes, recalculate map bounds to all rendered polygons
    if (polygonShapes.length > 0) {
        for (j = 0; j < polygonShapes.length; j++) {
            var paths = polygonShapes[j].getPaths();
            for (k = 0; k < paths.length; k++) {
                var path = paths.getAt(k);
                for (i = 0; i < path.length; i++) {
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
    if (polygonShapes.length === 1) {
        polygonShapes[0].setOptions({ fillOpacity: 0, strokeWeight: 2, clickable: false });
        google.maps.event.clearListeners(polygonShapes[0], 'mouseover');
        google.maps.event.clearListeners(polygonShapes[0], 'mousemove');
        google.maps.event.clearListeners(polygonShapes[0], 'mouseout');
        google.maps.event.clearListeners(polygonShapes[0], 'click');
    }
    /* Look for & add map makers */
    if (searchMapListings === undefined || typeof searchMapListings !== "object") {
        searchMapListings = [];
    }
    for (i = 0; i < searchMapListings.length; i++) {
        var iconPath = i < 5 ? '/images/map/orangeDot.png' : '/images/map/redDot.png';
        if (searchMapListings[i].featured) {
            iconPath = '/images/map/yellowDot.png';
        }
        var icon = new google.maps.MarkerImage(iconPath, new google.maps.Size(7, 7));

        var markerOpts = {
            askingPrice: searchMapListings[i].askingPrice,
            clickable: true,
            href: searchMapListings[i].href,
            icon: icon,
            map: map,
            position: new google.maps.LatLng(searchMapListings[i].lat, searchMapListings[i].lng),
            text: searchMapListings[i].address,
            zIndex: -1
        },
            marker = new google.maps.Marker(markerOpts);
        google.maps.event.addListener(marker, 'click', function () {
            window.location.href = this.href;
        });

        google.maps.event.addListener(marker, 'mousemove', function (event) {
            if (toolTip) {
                toolTip.draw(event, this);
            }
        });
        google.maps.event.addListener(marker, 'mouseout', function () {
            if (toolTip) {
                toolTip.hide();
            }
        });

        markerPoints.push(marker);
    }
});

