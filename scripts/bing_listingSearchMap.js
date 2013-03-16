// The following comments are for JSLint.
// Do NOT remove them!
// see http://www.jslint.com/
/*jslint browser: true, debug: true, devel: true, white: true, plusplus: true, maxerr: 100, unparam: true, indent: 4, bitwise: true, vars: true, nomen: true */
/*global jQuery: false, Microsoft: false, $: false, FavoritesSearchMap: false */


var SearchMap = function () {
    'use strict';
};


/*
* Object Listing
* requires: Object of arguments
* returns: Object Listing
* 
* === Required arguments for Object === 
* => lat:(float)
* => lng:(float)
* => id:(int)
* 
* --- Optional arguments for Object --- 
* -> isSold:(bool),
* -> isUnderContract:(bool),
* -> hasOpenHouse:(bool),
* -> isJustReduced:(bool),
* -> isFeatured:(bool)
* -> iconPrefix:(string)
* -> contentPrefix:(string)
* -> idPrefix:(string)
* -> spriteOffset:(int)
* -> scrollPos(int)
*/
var Listing = function (argObj) {
    'use strict';
    var self = this;
    self.options = $.extend({
        isSold: false,
        isUnderContract: false,
        hasOpenHouse: false,
        isJustReduced: false,
        isFeatured: false,
        iconPrefix: 'listingicon',
        contentPrefix: 'listingcontent',
        idPrefix: 'listing',
        lat: 0,
        lng: 0,
        id: 0,
        spriteOffset: 48,
        scrollPos: false
    }, argObj);
    self.id = self.options.id;
    self._displayStatus_ = self.displayStatus();
    self._iconColor_ = self.iconColor();
    self._unableToMap_ = (self.options.lat === 0 || self.options.lng === 0) ? true : false;
    self._scrollPos_ = self.scrollPos();
    self._html_ = self.html();
    self._point_ = self.point();
    self._icon_ = self.icon();
    self._marker_ = self.marker();
    return self;
};

/*
* function: Listing->displayStatus
* requires: Listing->options
* returns: String of display status
*/
Listing.prototype.displayStatus = function () {
    'use strict';
    if (this._displayStatus_) { return this._displayStatus_; }
    var displayStatus = 'generic';
    switch (true) {

        case !!this.options.isSold:
            displayStatus = 'isSold';
            break;
        case !!this.options.isUnderContract:
            displayStatus = 'isUnderContract';
            break;
        case !!this.options.isNewConstruction:
            displayStatus = 'isNewConstruction';
            break;
        case !!this.options.hasOpenHouse:
            displayStatus = 'hasOpenHouse';
            break;
        case !!this.options.isJustReduced:
            displayStatus = 'isJustReduced';
            break;
        case !!this.options.isFeatured:
            displayStatus = 'isFeatured';
            break;
    }
    return displayStatus;
};

/*
* function: Listing->iconColor
* requires: Listing->_displayStatus
* returns: String for icon color
*/
Listing.prototype.iconColor = function () {
    'use strict';
    if (this._iconColor_) { return this._iconColor_; }
    var iconColor = 'black';
    switch (this._displayStatus_) {
        case 'isSold': iconColor = 'red'; break;
        case 'isUnderContract': iconColor = 'blue'; break;
        case 'isNewConstruction': iconColor = 'brown'; break;
        case 'hasOpenHouse': iconColor = 'purple'; break;
        case 'isJustReduced': iconColor = 'green'; break;
        case 'isFeatured': iconColor = 'orange'; break;
    }
    return iconColor;
};

/*
* function: Listing->scrollPos
* requires: Listing->options
* returns:	Integer of Listing offest
*/
Listing.prototype.scrollPos = function () {
    'use strict';
    if (this._scrollPos_) { return this._scrollPos_; }
    var offset = $('#' + this.options.idPrefix + this.id).offset();
    return !!offset ? offset.top : 0;
};
/*
* function: Listing->icon
* requires: Lisitng->id
* requires: Listing->options
* requires: Listing->_iconColor_
* requires: Listing->_displayStatus_
* requires: Listing->_scrollPos_
* returns: Icon (aka PushpinOptions). Was a GIcon or a URL.
*/
Listing.prototype.icon = function () {
    'use strict';
    var self = this;
    if (self._icon_) { return self._icon_; }
    if (self._unableToMap_) {
        $('#' + self.options.iconPrefix + self.id + ' .iconInner').css('background-image', 'url(http://www.forsalebyowner.com/images/map/icon.unableToMap.png)');
        return 'http://www.forsalebyowner.com/images/map/icon.unableToMap.png';
    }
    /*

    var Icon = new GIcon();
    Icon.iconSize = new GSize(48, 54);
    Icon.iconAnchor = new GPoint(10, 41);
    Icon.infoWindowAnchor = new GPoint(24, 5);
    Icon.transparent = "http://www.forsalebyowner.com/images/map/iconBlankTrans.png";
    Icon.imageMap = [4, 21, 13, 7, 30, 5, 38, 20, 35, 24, 33, 37, 21, 50, 10, 37, 8, 21];
    Icon.sprite = {
    image: 'http://www.forsalebyowner.com/images/map/sprites/sprite.' + self._iconColor_ + '.png',
    width: 48,
    height: 54,
    top: 0,
    left: ((SearchMap.featuredListings.length + SearchMap.listings.length) * self.options.spriteOffset + self.options.spriteOffset)
    };
    $('#' + self.options.iconPrefix + self.id).css({
    cursor: 'pointer'
    }).find('.iconInner').css({
    backgroundPosition: ((SearchMap.featuredListings.length + SearchMap.listings.length) * -1 * self.options.spriteOffset - self.options.spriteOffset) + 'px 0px',
    backgroundImage: 'url(http://www.forsalebyowner.com/images/map/sprites/sprite.' + self._iconColor_ + '.png)'
    });
    // Rail item click Event 
    $('#' + self.options.idPrefix + self.id).click(function () {
    GEvent.trigger(self._marker_, "click");
    return true;
    });
    return Icon;
    */
    return {};
};

/*
* function: Listing->html
* requires: Listing->id
* requires: Listing->options
* returns: HTML string of listing
*/
Listing.prototype.html = function () {
    'use strict';
    var self = this;
    if (self._html_) { return self._html_; }
    var html = $('#' + self.options.contentPrefix + self.id).html();
    var classes = $('#' + self.options.contentPrefix + self.id).attr('class');
    return '<div id="openbubble' + self.id + '" class="' + classes + '">' + html + '</div>';
};

/*
* function: Listing->point
* requires: Listing->options
* returns: Google LatLng Object
*/
Listing.prototype.point = function () {
    'use strict';
    if (this._point_) { return this._point_; }
    return new Microsoft.Maps.Location(this.options.lat, this.options.lng);
};

/*
* function: Listing->marker
* requires: Listing->id
* requries: Listing->options
* requires: Listing->_point_
* requires: Listing->_icon_
* returns: Bing Pushpin, similar to a Google Marker Object
*/
Listing.prototype.marker = function () {
    'use strict';
    var self = this, marker;
    if (this._marker_) { return this._marker_; }
    if (self._unableToMap_) {
        return 'http://www.forsalebyowner.com/images/map/icon.unableToMap.png';
    }

    marker = new Microsoft.Maps.Pushpin(self._point_);
    return marker;
    /*
    SearchMap.bounds.extend(self._point_);

    var marker = new GMarker(self._point_, { icon: self._icon_, clickable: true });

    GEvent.addListener(marker, "click", function () {
    marker.openInfoWindowHtml(self._html_, SearchMap.windowOptions);
    $('#listingsScroller').animate({ scrollTop: self._scrollPos_ - SearchMap.initialTopHeight }, "fast", "easeOutExpo");
    $('#' + self.options.idPrefix + self.id).addClass('listingSel');
    });

    GEvent.addListener(marker, "infowindowopen", function () {
    $('#openbubble' + self.id + ' .addFav').click(FavoritesSearchMap.addFavoriteClick);
    $('#openbubble' + self.id + ' .removeFav').click(FavoritesSearchMap.removeFavoriteClick);
    }
    );

    GEvent.addListener(marker, "infowindowclose", function () {
    $('#' + self.options.idPrefix + self.id).removeClass('listingSel');
    });

    return marker;
    */
};


SearchMap.resizeTimeoutID = 0;
SearchMap.map = null;
SearchMap.listings = [];
SearchMap.featuredListings = [];
SearchMap.bounds = null;
SearchMap.initialTopHeight = 0;

SearchMap.load = function () {
    'use strict';
    var opts = {
            credentials: "AqFS5IR76tuVDO7gUl9YncTj1GHOkrJC00Ol_qz1qJNG31f4Ie9Utw8TZEF0mEIX",
            showDashboard: true,
            showMapTypeSelector: false,
            showScalebar: false,
            mapTypeId: Microsoft.Maps.MapTypeId.road
        },
        x = $('#listingsHolder').offset();
    SearchMap.initialTopHeight = x.top;
    SearchMap.windowOptions = {};
    SearchMap.windowOptions.minWidth = 300;
    SearchMap.windowOptions.maxWidth = 400;
    SearchMap.map = new Microsoft.Maps.Map(document.getElementById('mapHolder'), opts);
        
        SearchMap.placeListings();
        // TODO: extend map bounds to show all pushpins
};

SearchMap.addFeatureListing = function (id, lat, lng, accuracy) {
    'use strict';
    var x = {};
    x.id = id;
    x.lat = lat;
    x.lng = lng;
    x.accuracy = accuracy;
    // x.spriteOffset = 0;
    x.isFeatured = true;
    x.idPrefix = 'featlisting';
    x.iconPrefix = 'featlisting';
    x.contentPrefix = 'featlistingcontent';
    SearchMap.featuredListings.push(new Listing(x));
};

SearchMap.addListing = function (id, lat, lng, accuracy, isFeatured, isSold, isUnderContract, isNewConstruction, hasOpenHouse, isJustReduced) {
    'use strict';
    var x = {};
    x.id = id;
    x.lat = lat;
    x.lng = lng;
    x.accuracy = accuracy;
    x.isFeatured = isFeatured;
    x.isSold = isSold;
    x.isUnderContract = isUnderContract;
    x.isNewConstruction = isNewConstruction;
    x.hasOpenHouse = hasOpenHouse;
    x.isJustReduced = isJustReduced;
    SearchMap.listings.push(new Listing(x));
};

SearchMap.placeListings = function () {
    'use strict';
    var locations = [];
    $.each(SearchMap.listings, function (index, listingObj) {
        if (!listingObj._unableToMap_) {
            SearchMap.map.entities.push(listingObj.marker());
            locations.push(listingObj.marker().getLocation());
        }
    });
    $.each(SearchMap.featuredListings, function (index, listingObj) {
        if (!listingObj._unableToMap_) {
            SearchMap.map.entities.push(listingObj.marker());
            locations.push(listingObj.marker().getLocation());
        }
    });

    // set the bounds to fit all locations
    if (locations.length > 0) {
        SearchMap.bounds = Microsoft.Maps.LocationRect.fromLocations(locations);
    } else {
        SearchMap.bounds = null;
    }

    // set the map bounds
    SearchMap.recenterMap();
};

SearchMap.getListingById = function (listingID) {
    'use strict';
    var listing = null;
    var listings = SearchMap.featuredListings.concat(SearchMap.listings);
    $.each(listings, function (index, item) {
        if (item.id === listingID) {
            listing = item;
            return false;
        }
    });
    return listing;
};

/*
This function recenters the map based on the listing that have been placed.
It should be called if new listings are added for the size of the map is changed.
*/
SearchMap.recenterMap = function () {
    'use strict';

    if (SearchMap.bounds) {
        SearchMap.map.setView({ bounds: SearchMap.bounds });
    } else {
        SearchMap.map.setView({ center: new Microsoft.Maps.Location(40, -105), zoom: 10 });
    }
};


/*
This function makes it so the SearchMap.resizeWindowHelper function
is called in delayLength milliseconds if it is not already scheduled to be called
*/
SearchMap.resizeWindow = function (delayLength) {
    'use strict';
    if (SearchMap.resizeTimeoutID === 0) {
        SearchMap.resizeTimeoutID = setTimeout(SearchMap.resizeWindowHelper, delayLength);
    }
};


/*
This function resizes the listings div and the map div to fit the window
so there is no vertical scrollbar
*/
SearchMap.resizeWindowHelper = function () {
    'use strict';
    var x = $('#listingsHolder').offset();
    var topHeight = x.top;
    var windowHeight = $(window).height();
    var bottomHeight = windowHeight - topHeight;

    var width = $(window).width() - $('#listingsScroller').width() - 5;

    SearchMap.resizeTimeoutID = 0;

    //Need this because IE sometimes throws false resize events that
    //when clicking a marker, causes map to be recentered
    if ($('#listingsScroller').height() === bottomHeight && $('#mapHolder').height() === bottomHeight && $('#mapHolder').width() === width) {
        return;
    }

    $('#listingsScroller').height(bottomHeight);
    $('#mapHolder').height(bottomHeight).width(width);

    SearchMap.recenterMap();
};


$(document).ready(function () {
    'use strict';
    $('#viewThree').hover(
		function () {
		    $('#viewThree').addClass('hov');
		},
		function () {
		    $('#viewThree').removeClass('hov');
		}
	);

    $('#viewFour').hover(
		function () {
		    $('#viewFour').addClass('hov');
		},
		function () {
		    $('#viewFour').removeClass('hov');
		}
	);

    $('#rssReader').click(function () {
        $('#rssReader').toggleClass("on");
        if ($('#readerMenu').css("display") === "block") {
            $('#readerMenu').css("display", "none");
        }
        else {
            $('#readerMenu').css("display", "block");
        }
    });

    $('.listing').hover(
		function () {
		    $(this).addClass('listingHov');
		},
		function () {
		    $(this).removeClass('listingHov');
		}
	);
    SearchMap.load();
    SearchMap.resizeWindowHelper();
    $(window).resize(function () { SearchMap.resizeWindow(400); });
    $('#moreOptionsLink').click(function () { SearchMap.resizeWindow(2400); });
});
