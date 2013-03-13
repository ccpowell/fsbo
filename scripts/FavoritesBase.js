var FavoritesBase = function() {};

FavoritesBase.numFavorites = 0;
FavoritesBase.isLoggedIn = 0;

FavoritesBase.addFavorite = function(listingID, handler) {
	if(!FavoritesBase.isLoggedIn) {
		window.location.href = '/favoriteHandler.php?action=add&id='+listingID;
		return false;
	}

	$.ajax({
	url: '/favoriteHandler.php',
	type: 'GET',
	data: 'ajax=1&action=add&id='+listingID,
	success: function(data, textStatus) {
		FavoritesBase.numFavorites += 1;
		handler(listingID);
	},
	timeout: 10000
	});
	return false;
};

FavoritesBase.removeFavorite = function(listingID, handler) {
	if(!FavoritesBase.isLoggedIn) {
		window.location.href = '/favoriteHandler.php?action=remove&id='+listingID;
		return false;
	}

	$.ajax({
	url: '/favoriteHandler.php',
	type: 'GET',
	dataType: 'html',
	data: 'ajax=1&action=remove&id='+listingID,
	success: function(data, textStatus) {
		FavoritesBase.numFavorites -= 1;
		handler(listingID);
	},
	timeout: 10000
	});
	return false;
};

FavoritesBase.updateFavoritesHeader = function() {
	//We do "" + FavoritesBase.numFavorites, to force string conversion
	//Otherwise "0" prints as ""
	$('#numFavorites').html("" + FavoritesBase.numFavorites);
	return false;
};


