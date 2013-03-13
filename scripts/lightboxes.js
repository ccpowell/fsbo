lightboxHeight = 0;
lightboxWidth = 0;

$(document).ready(function() {
	sizeLightboxOverlay();

	$(window).resize(function() {
		sizeLightboxOverlay();
	});
});

function sizeLightboxOverlay() {
	newHeight = $(document).height();
	newWidth = $(document).width();

	if(newHeight != lightboxHeight || newWidth != lightboxWidth) {
		//console.log(newHeight);
		//console.log(newWidth);
		lightboxHeight = newHeight;
		lightboxWidth = newWidth;
		$("#lightboxBg").height(newHeight);
		$("#lightboxBg").width(newWidth);
	}
}