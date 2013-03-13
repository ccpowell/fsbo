$(function() {
	
	$('#verticalGallery #media_photoLarge a').click(function(){
		var thumb = $('#media_thumbs .on').parent();
		if(thumb.next().length == 0){
			thumb = thumb.parent().find('li').eq(0);
		}else{
			thumb = thumb.next();
		}
		thumb.find('a').trigger('click');

		return false;
	});	
	
	/**
	 * Event handler for hover arrows
	 * */
	$('#verticalGallery #media_photoLarge a, .dialog_Arrow').hover(
		function(e){
			var dialog_Arrows = $('.dialog_Arrow');
			setTimeout(function(){
				dialog_Arrows.css({opacity: 1.0});
			}, 300);
		}, 
		function(e){
			var dialog_Arrows = $('.dialog_Arrow');
			setTimeout(function(){
				dialog_Arrows.css({opacity: 0.5});
			}, 300);
		}
	);
	
	/**
	 * Event handler for arrow clicks
	 * */
	$('#verticalGallery #media_photoLarge .dialog_Arrow').click(function(){
		var thumb = $('#media_thumbs .on').parent();
		if($(this).hasClass('left_Arrow')) { // previous image
			if(thumb.prev().length == 0) {
				thumb = thumb.parent().find('li').eq($('#media_thumbs').children('li').length - 1);
			}
			else {
				thumb = thumb.prev();
			}
			thumb.find('a').trigger('click');
		}
		else if ( $(this).hasClass('right_Arrow') ) { // next image
			if( thumb.next().length == 0) {
				thumb = thumb.parent().find('li').eq(0);
			}
			else {
				thumb = thumb.next();
			}
			thumb.find('a').trigger('click');
		}
	});
	
	$("#verticalGallery #media_thumbs .thumb").bind("click",function() {
		var id = $(this).attr('id');
		var imageNum = id.substring(id.search(/thumblink/)+9);

		captionFill(imageNum);

		if($(this).hasClass('on')){
			return false;
		}

		if (photoArray.length == 1){
			$(".prevNext").hide();
		}
		$('#verticalGallery #media_listingPhoto').attr("src", photoArray[imageNum-1]);

		$('#verticalGallery .thumb').removeClass("on");
		$('#verticalGallery #media_thumblink' + imageNum).addClass("on");

		scrollThumbs();

		return false;
	});

	$("#verticalGallery #media_thumblink1").trigger("click");

	function scrollThumbs(){
		var imagesPerRow = 4;
		var scrollHeight = 60;

		var id = $('#verticalGallery #media_thumbs .on').attr('id');
		var imageNum = id.substring(id.search(/thumblink/)+9)-1;

		var selectedRow = Math.floor(imageNum/imagesPerRow);
		var totalRows = Math.floor(photoArray.length/imagesPerRow);

		if(selectedRow == 0){
			var targetOffset = 0;
		}else if(selectedRow < totalRows){
			var targetOffset = scrollHeight * (selectedRow -1);
		}else if(selectedRow == totalRows){
			var targetOffset = scrollHeight * (totalRows -2);
		}

		$('#verticalGallery #thumbsPane').animate({scrollTop: targetOffset});
	}

	$("#verticalGallery #pic_next_media").click(function() {
		var id        = $("#verticalGallery #media_thumbs .thumb.on").attr('id');
		if(!id) { return false; }
		var imageNum  = id.substring(id.search(/thumblink/)+9);
		var imageNum  = parseInt(imageNum)+1;
		var listingID = $("#verticalGallery input[name=iLID]").val();

		// if already on last image, cycle to first image
		if(parseInt(imageNum) == $("#verticalGallery #media_thumbs .thumb").length +1){
			$("#verticalGallery #media_thumblink1").trigger("click");
			return false;
		}

		captionFill(imageNum);

		$('#verticalGallery #media_listingPhoto').attr("src", photoArray[imageNum-1]);
		$('#verticalGallery .thumb').removeClass("on");
		$('#verticalGallery #media_thumblink' + imageNum).addClass("on");

		scrollThumbs();

		return false;
	});

	$("#verticalGallery #pic_prev_media").click(function() {
		var id        = $("#verticalGallery #media_thumbs .thumb.on").attr('id');
		var imageNum  = id.substring(id.search(/thumblink/)+9);
		var imageNum  = parseInt(imageNum)-1;
		var listingID = $("#verticalGallery input[name=iLID]").val();

		// if already on first image, cycle to last image
		if(parseInt(imageNum) == 0){
			$("#verticalGallery #media_thumblink" + $("#verticalGallery #media_thumbs .thumb").length ).trigger("click");
			return false;
		}

		captionFill(imageNum);

		$('#verticalGallery #media_listingPhoto').attr("src", photoArray[imageNum-1]);
		$('#verticalGallery .thumb').removeClass("on");
		$('#verticalGallery #media_thumblink' + imageNum).addClass("on");

		scrollThumbs();

		return false;
	});

	function captionFill(imageNum) {
		$('#verticalGallery #media_photoTitle').text('');
		$("#verticalGallery #media_photoTitle").append( $('#title' + imageNum).text() );
		$('#verticalGallery #media_photoDescription').text('');
		$("#verticalGallery #media_photoDescription").append( $('#description' + imageNum).text() );
		$('#verticalGallery #media_photoCurrent').text('');
		$("#verticalGallery #media_photoCurrent").append( imageNum  );
		$('#verticalGallery #media_photoTotal').text('');
		$("#verticalGallery #media_photoTotal").append( numPhotos );
	}
});