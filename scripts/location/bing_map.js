// The following comments are for JSLint.
// Do NOT remove them!
// see http://www.jslint.com/
/*jslint browser: true, debug: true, devel: true, white: true, plusplus: true, maxerr: 100, unparam: true, indent: 4, bitwise: true, vars: true */
/*global jQuery: false, Microsoft: false, google: false, gBounds: true, gPolygons: true, bound: false, map: true, searchMapListings: true */

// map polygons
var polygonShapes = new Microsoft.Maps.EntityCollection();

// singleton tooltip
var toolTip = false;

// Map markers
var markerPoints = new Microsoft.Maps.EntityCollection();


// return an array of Locations for an encoded path
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
            points.push(new Microsoft.Maps.Location(latlng[0], latlng[1]));
        }
        lat_or_lng++;                                                // Move cursor to next lat/lng
    }

    return points;
}


function Shape(opts) {
    'use strict';
    this.m_init(opts);

    // Return polygon instead of Shape's object.
    return this.polygon;
}

var unused = (function ($) {
    'use strict';
    Shape.prototype = {
        defaults: {
            fillColor: '#8DD8ED',
            fillOpacity: 0.6,
            href: false,
            listingCount: 0,
            paths: [],
            strokeColor: '#2D669D',
            strokeOpacity: 0.8,
            strokeThickness: 1
        },

        fillColors: ['#8DD8ED', '#B0D973', '#F2BC4F', '#E293FE', '#F1024B', '#BBF0C4', '#1821A3', '#960E4E', '#26761D', '#2A38F6', 'F1218F', 'FFFF00'],
        strokeColors: ['#8DD8ED', '#B0D973', '#F2BC4F', '#E293FE', '#F1024B', '#BBF0C4', '#1821A3', '#960E4E', '#26761D', '#2A38F6', 'F1218F', 'FFFF00'],
        polygon: null,

        m_setOpacity: function (color, opacity) {
            color.a = Math.max(0, Math.min(255, (opacity * 255)));
        },

        m_init: function (opts) {
            var i, self = this;
            this.options = $.extend({}, this.defaults, opts);
            for (i = 0; i < this.options.paths.length; i++) {
                //this.options.paths[i] = google.maps.geometry.encoding.decodePath(this.options.paths[i]);
                this.options.paths[i] = polylineDecode(this.options.paths[i]);
            }
            this.options.fillColor = !!this.options.colorCode ? this.options.colorCode : this.m_getFillColor();
            if (/^[0-9A-Fa-f]{6}$/.test(this.options.fillColor)) { this.options.fillColor = '#' + this.options.fillColor; }

            // save the original options for restoring after mouseover
            this.polyopts = {
                fillColor: Microsoft.Maps.Color.fromHex(this.options.fillColor),
                strokeColor: Microsoft.Maps.Color.fromHex(this.options.strokeColor),
                strokeThickness: this.options.strokeThickness
            };
            this.m_setOpacity(this.polyopts.fillColor, this.options.fillOpacity);
            this.m_setOpacity(this.polyopts.strokeColor, this.options.strokeOpacity);

            // currently, we just use the first path
            this.polygon = new Microsoft.Maps.Polygon(this.options.paths[0], this.polyopts);

            // save a set of colors for mouseover
            this.overopts = {
                fillColor: Microsoft.Maps.Color.fromHex(this.options.fillColor),
                strokeColor: Microsoft.Maps.Color.fromHex(this.options.strokeColor)
            };
            this.m_setOpacity(this.overopts.fillColor, 1);
            this.m_setOpacity(this.overopts.strokeColor, 1);

            Microsoft.Maps.Events.addHandler(this.polygon, 'click', function (event) {
                if (!!self.options.href) {
                    window.location.href = self.options.href.replace(/\s/g, '_');
                }
            });
            Microsoft.Maps.Events.addHandler(this.polygon, 'mouseover', function (event) {
                self.polygon.setOptions(self.overopts);
                if (toolTip) {
                    toolTip.draw(event, self.options);
                }
            });
            Microsoft.Maps.Events.addHandler(this.polygon, 'mouseout', function (event) {
                self.polygon.setOptions(self.polyopts);
                if (toolTip) {
                    toolTip.hide();
                }
            });
        },

        m_getFillColor: function () {
            return this.fillColors[polygonShapes.getLength() % this.fillColors.length];
        },

        m_getStrokeColor: function () {
            return this.fillColors[polygonShapes.getLength() % this.strokeColors.length];
        }
    };
} (jQuery));


function ToolTip() {
    'use strict';
    var infodiv = jQuery('<div/>', {'id': 'tooltip-div'})
        .css({
            'z-index': 20,
            'display': 'none',
            'position': 'absolute',
            'padding': '10px',
            'background-color': '#ffffff',
            'border': '1px solid #CCCCCC',
            'box-shadow': '3px 3px 4px #CCCCCC',
            'border-radius': '6px'
        })
        .appendTo(map.getRootElement());

    // adjust the position of the tooltip to track the mouse
    Microsoft.Maps.Events.addHandler(map, 'mousemove', function (event) {
        var position = {
            'top': event.getY() + (map.getHeight() / 2),
            'left': event.getX() + 25 + (map.getWidth() / 2)
        };
        infodiv.css(position);
    });
    this.infodiv = infodiv;
}


var unused = (function ($) {
    'use strict';

    ToolTip.prototype.draw = function (event, args) {
        var title = !!args.askingPrice ? args.address.replace(/,\s/g, ',<br>') : args.title;
        var html = '<strong>' + title + '</strong>';

        if (!!args.askingPrice && args.askingPrice !== "null") {
            html += '<br>' + args.askingPrice;
        }

        this.infodiv
            .html(html)
            .show();
    };

    ToolTip.prototype.hide = function () {
        this.infodiv.hide();
    };

} (jQuery));

jQuery(document).ready(function () {
    'use strict';
    var tmpBounds;

    // Build default bounds to generate map center & parent MBR
    gBounds = Microsoft.Maps.LocationRect.fromCorners(
			new Microsoft.Maps.Location(bound[0][0], bound[0][1]),
			new Microsoft.Maps.Location(bound[1][0], bound[1][1])
			);
    tmpBounds = new Microsoft.Maps.LocationRect();

    // Map options
    var opts = {
        credentials: "AqFS5IR76tuVDO7gUl9YncTj1GHOkrJC00Ol_qz1qJNG31f4Ie9Utw8TZEF0mEIX",
        bounds: gBounds,
        showDashboard: true,
        showMapTypeSelector: false,
        showScalebar: false,
        mapTypeId: Microsoft.Maps.MapTypeId.road
    }, hand, i;

    // Load map
    map = new Microsoft.Maps.Map(document.getElementById('mapPlaceHolder'), opts);
    hand = map.getRootElement().style.cursor;

    Microsoft.Maps.Events.addHandler(map, "mousemove", function (e) {
        // get the HTML DOM Element that represents the Map
        var mapElem = map.getRootElement();
        if (e.targetType === "map") {
            // Mouse is over Map
            mapElem.style.cursor = hand;
        } else {
            // Mouse is over Pushpin, Polyline, Polygon
            mapElem.style.cursor = "pointer";
        }
    });

    // create the tooltip
    toolTip = new ToolTip();

    // Build polygons from parent page
    if (gPolygons.length > 0) {
        for (i = 0; i < gPolygons.length; i++) {
            polygonShapes.push(new Shape(gPolygons[i]));
        }
        map.entities.push(polygonShapes);
    }

    // TODO: If we have many shapes, recalculate map bounds to all rendered polygons

    // TODO: If we're only displaying one shape; remove mouse events and clear shading

    /* Look for & add map makers */
    searchMapListings = searchMapListings || [];

    jQuery.each(searchMapListings, function (index, listing) {
        var location = new Microsoft.Maps.Location(listing.lat, listing.lng),
            iconPath,
            marker;
        iconPath = index < 5 ? 'http://www.forsalebyowner.com/images/map/orangeDot.png' : 'http://www.forsalebyowner.com/images/map/redDot.png';
        if (listing.featured) {
            iconPath = 'http://www.forsalebyowner.com/images/map/yellowDot.png';
        }
        marker = new Microsoft.Maps.Pushpin(location, {
            icon: iconPath,
            width: 7,
            height: 7,
            anchor: new Microsoft.Maps.Point(3, 3)
        });

        Microsoft.Maps.Events.addHandler(marker, 'click', function () {
            window.location.href = listing.href;
        });

        Microsoft.Maps.Events.addHandler(marker, 'mouseover', function (event) {
            if (toolTip) {
                toolTip.draw(event, listing);
            }
        });

        Microsoft.Maps.Events.addHandler(marker, 'mouseout', function () {
            if (toolTip) {
                toolTip.hide();
            }
        });

        markerPoints.push(marker);
    });

    if (markerPoints.getLength() > 0) {
        map.entities.push(markerPoints);
    }
});

