var FavoritesSearchMap = new Object;

FavoritesSearchMap.addFavoriteClick = function() {
	var href = $(this).attr('href');
	var listingID = href.substring(href.search(/&id=/)+4);
	FavoritesSearchMap.addFavorite(listingID);
	return false;
}

FavoritesSearchMap.removeFavoriteClick = function() {
	var href = $(this).attr('href');
	var listingID = href.substring(href.search(/&id=/)+4);
	FavoritesSearchMap.removeFavorite(listingID);
	return false;
}

FavoritesSearchMap.addFavorite = function(listingID) {
	FavoritesBase.addFavorite(listingID, FavoritesSearchMap.addFavoriteHandler);
	return false;
};

FavoritesSearchMap.addFavoriteHandler = function(listingID) {
	$('.favoritebubble'+listingID).html('<span class="added">Added</span><span class="pipecleaner">|</span><a class="removeFav" href="/favoriteHandler.php?action=remove&id='+listingID+'" title="Remove from Favorites">Remove</a>');
	FavoritesBase.updateFavoritesHeader();
	$('.favoritebubble'+listingID+' .removeFav').click(FavoritesSearchMap.removeFavoriteClick);
}

FavoritesSearchMap.removeFavorite = function(listingID) {
	FavoritesBase.removeFavorite(listingID, FavoritesSearchMap.removeFavoriteHandler);
	return false;
};

FavoritesSearchMap.removeFavoriteHandler = function(listingID) {
	$('.favoritebubble'+listingID).html('<a class="addFav" href="/favoriteHandler.php?action=add&id='+listingID+'" title="Add to Favorites">Add to Favorites</a>');
	$('.favoritebubble'+listingID+' .addFav').click(FavoritesSearchMap.addFavoriteClick);
	FavoritesBase.updateFavoritesHeader();
}
