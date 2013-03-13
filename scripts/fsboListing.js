var imagePreload = new Array();
var cycler;
var blockAnimation = false;
var numImagesShown = 5;
var numImagesAvailable = 0;


$(document).ready(function () {
	
	var imageNum = 1;
	var defaultQuestion = 'e.g. What are taxes like? How new is the carpet?';
	var defaultEmail = 'e.g. jimmy@yahoo.com';
	/* BEGIN GWO CONTACT OWNER */
	var altDefaultQuestion = 'Your Question (e.g. How much are taxes? Is the carpet new?)';
	var altDefaultEmail = 'Your E-mail Address';
	/* END GWO CONTACT OWNER */
	if(typeof(AskQuestionLightBox) != 'undefined') {
		var askQuestionLightBox = new AskQuestionLightBox();
	}
	if(typeof(AskQuestionStandard) != 'undefined') {
		var askQuestionStandard = new AskQuestionStandard();
	}
	if(typeof(EmailAFriendLightbox) != 'undefined') {
		var emailFriendLightbox = new EmailAFriendLightbox();
	}
	if(typeof(FlagListingLightbox) != 'undefined') {
		var flagListingLightbox = new FlagListingLightbox();
	}

	if (photoArray.length>1) for (var i=0;i<photoArray.length;i++){
		imagePreload[i]=new Image();
		imagePreload[i].src=photoArray[i];
	}

	if($.ui) {
		$("#listingImages-dialog").dialog({
			autoOpen: false,
			height: 660,
			width: 1060,
			resizable: false,
			draggable: false,
			modal: true,
			dialogClass: 'fsbo',
			open: function(){
				$("#verticalGallery #media_thumblink" + imageNum).trigger("click");
			}
		});
	}
	$("#mediaTabs .photos").click(function(){
		//we refuse focus on photos if there are no photos AND there is a map
		if($(this).hasClass('grey') && !$("#mediaTabs .map").hasClass('grey')){
			return false;
		}

		//$('#mediaWidgetWrap').css('background-image', 'url(/images/fsboListing/bgShadMedia.gif)');

		//close open house lightbox, if it is open
		$("#openHouseLightboxClose").click();

		//handle content display
		$("#listingMainImageContainer").addClass('show');
		$("#mapMode").removeClass('show');
		$(".videoMode").removeClass('show');
		//toggle nav selection
		$("#mediaTabs .active").removeClass('active');  //remove active nav item
		$(this).toggleClass('active');  //activate new nav item
		return false;
	});

	$("#mediaTabs .map").click(function(){
		if((!ListingMap.lat && !ListingMap.lng) || ListingMap.accuracy < ListingMap.minAccuracy) {
			return;
		}
		/*
		if(!$('#mapMode').hasClass('noPhotos')) {
			$('#mediaWidgetWrap').css('background-image', 'url(/images/fsboListing/bgShadMedia381.gif)');
		}
		else {
			$('#mediaWidgetWrap').css('background-image', 'url(/images/fsboListing/bgShadMedia.gif)');
		}
		*/
		//$('#mediaWidgetWrap').css('background-image', 'url(/images/fsboListing/bgShadMedia285.gif)');

		//close open house lightbox, if it is open
		$("#openHouseLightboxClose").click();

		//handle content display
		$("#mapMode").addClass('show');
		$("#listingMainImageContainer").removeClass('show');
		$(".videoMode").removeClass('show');
		//toggle nav selection
		$("#mediaTabs .active").removeClass('active');  //remove active nav item
		$(this).toggleClass('active');  //activate new nav item
		ListingMap.mapListing();
		return false;
	});

	$('.mapButtons .map').click(function() {
		$('#mediaTabs .map').click();
		return false;
	});

	$("#mediaTabs .video").click(function(){
		if($(this).hasClass('grey')){
			return false;
		}

		//$('#mediaWidgetWrap').css('background-image', 'url(/images/fsboListing/bgShadVideo.gif)');

		//close open house lightbox, if it is open
		$("#openHouseLightboxClose").click();

		//handle content display
		$(".videoMode").addClass('show');
		$("#listingMainImageContainer").removeClass('show');
		$("#mapMode").removeClass('show');
		//toggle nav selection
		$("#mediaTabs .active").removeClass('active');  //remove active nav item
		$(this).toggleClass('active');  //activate new nav item
		return false;
	});

	$("#mediaTabs .slide").click(function(){
		if($(this).hasClass('grey')){
			return false;
		}

		//close open house lightbox, if it is open
		$("#openHouseLightboxClose").click();

		window.open($('#mediaTabs .slide a').attr("href"), 'SlideShow','left=0,top=0,toolbar=no,menubar=no,scrollbars=yes,resizable=no,width=450,height=465');
		return false;
	});

	$("#mediaTabs .virtual").click(function(){
		if($(this).hasClass('grey')){
			return false;
		}

		//close open house lightbox, if it is open
		$("#openHouseLightboxClose").click();

		//handle content display
		window.open($('#mediaTabs .virtual a').attr("href"), 'VirtualTour','left=0,top=0,toolbar=no,menubar=no,scrollbars=yes,resizable=yes,width=450,height=465');
		return false;
	});

	/* carousel */
	numImagesAvailable = $("#mediaWidgetWrap .thumb").length;

	$('#listingPhoto').click(function(){
		$('#pic_next').trigger('click');
	});

	$('.viewAll a').click(function(e){
		e.preventDefault();
		$('#listingImages-dialog').dialog({autoOpen:true});

		var winWidth = $(window).width(); // window width
		var modalObj = $("div[aria-labelledby=ui-dialog-title-listingImages-dialog]"); // modal selector
		var modalWidth = modalObj.width(); // width of modal
		var modalLeft = parseInt(modalObj.css("left")); // left position of modal

		if(winWidth < modalWidth) { // the window width is smaller than the modal width
			modalObj.css({'max-width':parseInt(winWidth * 0.97)+"px"});
		}
		if(modalLeft < 0) { // if the left position if left postioned off the window
			modalObj.css({left:parseInt($(window).width()/2) -((winWidth * 0.97)/2)+"px"});
		}
		$(window).resize(function(e){
			var leftPos = ($(window).width()/2) -(modalObj.width()/2);
			if(leftPos < 0) {
				leftPos = 0;
			}
			modalObj.css({'left':leftPos+'px', 'width':parseInt($(window).width() * 0.97)+"px", 'max-width':parseInt($(window).width() * 0.98)+"px"});
		});
	});
	
	$("#mediaWidgetWrap .thumb").bind("click",function() {
		if($(this).hasClass('on') || blockAnimation){
			return false;
		}

		var id = $(this).attr('id');
		imageNum = id.substring(id.search(/thumblink/)+9);

		var listingID   = $("input[name=iLID]").val();

		if (photoArray.length == 1){
			$(".prevNext").hide();
			$(".viewAll a").html('View Photo &raquo;');
		}

		$('#photoCurrent').html(imageNum);
		$('.photoTotal').html( (photoArray.length) );

		$("#photoTitle").hide();
		$("#photoDescription").hide();
		captionFill(imageNum);

		if ($("#photoTitle").html() || $("#photoDescription").html()){
			$("#photoTitle").show();
			$("#photoDescription").show();
		}

		$('#listingPhoto').hide();
		$('#listingPhoto').attr("src", photoArray[imageNum-1]);
		if($(this).hasClass('nc_thumb')) {
			var w = $('img',this).attr('width'),
			    h = $('img',this).attr('height'),
			    d = Math.min( parseFloat(356 / w), parseFloat(268 / h));
			$('#listingPhoto').attr({width: w * d, height: h * d, });
		}
		$('#listingPhoto').show();
		$('#thumbs .thumb').removeClass("on");
		$('#thumblink' + imageNum).addClass("on");

		slideTo(imageNum);

		return false;
	});

	// call to intialize first image (get captions and set display numbers)
	$("#thumblink1").trigger("click");

	$(document).keydown(function(e){
	    if (e.keyCode == 37) { 
	    	if ($("#listingImages-dialog").dialog( "isOpen" )) {
	    		$("#pic_prev_media").trigger("click");
	    	} else {
	    		$("#pic_prev").trigger("click");
	    	}
	    } else if (e.keyCode == 39) { 
	    	if ($("#listingImages-dialog").dialog( "isOpen" )) {
	    		$("#pic_next_media").trigger("click");
	    	} else {
	    		$("#pic_next").trigger("click");
	    	}
	    }
	});

	$("#pic_prev").click(function(){
		if($('#thumbs .on').prev().length == 0){
			slideTo(numImagesAvailable, numImagesAvailable-numImagesShown, function(){$('#thumbs .thumb:last').trigger("click");});
		}else{
			$('#thumbs .on').prev().trigger("click");
		}
	});

	$("#pic_next").click(function(){
		if($('#thumbs .on').next().length == 0){
			slideTo(1, 0, function(){});
			$('#thumbs .thumb:first').trigger("click");
		}else{
			$('#thumbs .on').next().trigger("click");
		}
	});

	if($('#mediaTabs .photos').hasClass('grey') && $("#mediaTabs .video").hasClass('grey')) {
		$('#infoWrap').addClass('noPhotos');
		$('#mapMode').addClass('noPhotos');
	}

	if((!ListingMap.lat && !ListingMap.lng) || ListingMap.accuracy < ListingMap.minAccuracy) {
		$('.mapButtons').html('');

		//If the map tab is active, this means that there were no photos
		if($('#mediaTabs .map').hasClass("active")) {
			//So, if there is a video default to it, else just default to the photo tab
			//which should be displaying a Photo Pending image
			if(!$('#mediaTabs .video').hasClass('grey')) {
				$('#mediaTabs .video').click();
			} else {
				$('#mediaTabs .photos').click();
			}
		}
	} else {
		ListingMap.load();
		$('#mediaTabs .map').removeClass("grey");
		if($('#mediaTabs .map').hasClass("active")) {
			$('#mediaTabs .map').click();
		}
	}

	$("#soldZip").click(function () {
		$(this).attr('value', '');
	});

	$('#syndEmbedCode').focus(function() {
		$(this).select();
	});

	$("#openHouseLightboxClose").click(function(){
		$(".overlay").addClass('hide');
		$(".floater").addClass('hide');
		return false;
	});

	//////////////////////////////
	//Email a Friend Lightbox
	//////////////////////////////
	$(".emailToAFriend").click(function(){
		emailFriendLightbox.resetForm();
		$("#lightboxBg").addClass('show');
		$("#lightboxEmail").addClass('show');
		return false;
	});

	$(".lightboxCloseEmailAFriend").click(function(){
		$("#lightboxBg").removeClass('show');
		$("#lightboxEmail").removeClass('show');
		return false;
	});

	$("#lightboxEmailAFriendForm").submit(function(){
		//small hack to remove old error message (reset it basically)
		var targetElement = $("div.lightboxEmailFriendResultBox").removeClass();
		targetElement.addClass("lightboxEmailFriendResultBox");  //Why I wanted to us ID's and not classes.  die ie6
		var userEmail   = $("input[name=eafEmail]").val();
		var userName    = $("input[name=eafName]").val();
		var friendEmail = $("input[name=eafFriendEmail]").val();
		var friendName  = $("input[name=eafFriendName]").val();
		var message     = $("#eafMessage").val();
		var listingUrl  = $("input[name=url]").val();
		var listingID   = $("input[name=iLID]").val();
		var error = false;
		//error checks

		if(!isEmail(userEmail)){emailFriendLightbox.toggleErrorBox('Show', 'InvalidEmail'); error=true;}
		if(!isEmail(friendEmail)){emailFriendLightbox.toggleErrorBox('Show', 'InvalidEmail'); error=true;}
		if(userName == ''){emailFriendLightbox.toggleErrorBox('Show', 'MissingField'); error=true;}
		if(friendName == ''){emailFriendLightbox.toggleErrorBox('Show', 'MissingField'); error=true;}
		if(error){ return false; } //kill submit if error occurs

		emailFriendLightbox.sendMessage(userEmail, userName, friendEmail, friendName, message, listingUrl, listingID)

		return false;
	});

	//////////////////////////////
	// Flag Listing Lightbox
	//////////////////////////////
	$(".flagListing").click(function(){
		$("#lightboxBg").addClass('show');
		$("#lightboxFlag").addClass('show');
		return false;
	});

	$(".lightboxCloseFlagListing").click(function(){
		$("#lightboxBg").removeClass('show');
		$("#lightboxFlag").removeClass('show');
		flagListingLightbox.resetForm();
		return false;
	});

	$("#lightboxFlagListingForm").submit(function(){
		//small hack to remove old error message (reset it basically)
		var targetElement = $("div.lightboxFlagListingResultBox").removeClass();
		targetElement.addClass("lightboxFlagListingResultBox");  //Why I wanted to us ID's and not classes.  die ie6
		var flagReason  = $("input[name=flReason]:checked").val();
		var flagComment = $("#flComment").val();
		var listingUrl  = $("input[name=url]").val();
		var listingID   = $("input[name=iLID]").val();
		var error = false;
		//error checks
		if(!flagReason){
			flagListingLightbox.toggleErrorBox('Show', 'MissingReason'); error=true;
		}
		if(flagReason == 5 && !jQuery.trim(flagComment)){
			flagListingLightbox.toggleErrorBox('Show', 'CommentRequired'); error=true;
		}
		if(error){ return false; } //kill submit if error occurs
		flagListingLightbox.flagListing(listingID, flagReason, flagComment);
		return false;
	});

	//////////////////////////////
	//Ask a question (LIGHTBOX)
	//////////////////////////////
	if($("#askQuestionTextArea").val() != defaultQuestion && $("#askQuestionTextArea").val() != altDefaultQuestion) {
		$("#askQuestionTextArea").addClass("active");
	}

	$("#askQuestionTextArea").focus(function() {
		if($(this).val() == defaultQuestion) {
			$(this).addClass("active");
			$(this).val('');
		}
	});

	$("#askQuestionTextArea").blur(function() {
		if($(this).val() == '') {
			$(this).removeClass("active");
			$(this).val(defaultQuestion);
		}
	});

	function showQuickAskQuestionLightbox() {
		gaTrackPageView('/listing/' + listingURL + '/email1/form');
		var params = new Object();
		params.page = 'listing';
		params.action = 'email1';
		params.status = 'form';
		$("#lightboxBg").addClass('show');
		$("#lightboxAsk").addClass('show');
		//load input[value] from textarea
		var userQuestion = $("#askQuestionTextArea").val();
		if(userQuestion != defaultQuestion) {
			$("#lightBoxAskQuestionTextArea").val(userQuestion);
		}
		else {
			$("#lightBoxAskQuestionTextArea").val("");
		}
		updateWordCount('#lightBoxAskQuestionTextArea','#askQuestionCharCount');
		if($("#lightBoxAskQuestionTextArea").val() != "") {
			$("#askEmail").focus();
		}
		else {
			$("#lightBoxAskQuestionTextArea").focus();
		}
	}

	$("select#askQuestionTextArea[data-autosubmit=true]").change(showQuickAskQuestionLightbox);
	$(".quickAskQuestion").click(showQuickAskQuestionLightbox);

	$("#lightBoxAskQuestionTextArea").keyup(function(){
			updateWordCount('#lightBoxAskQuestionTextArea','#askQuestionCharCount');
	});

	$("#lightBoxAskQuestionForm").submit(function(){
			//small hack to remove old error message (reset it basically)
			var targetElement = $("div.lightboxAskQuestionResultBox").removeClass();
			targetElement.addClass("lightboxAskQuestionResultBox");  //Why I wanted to us ID's and not classes.  die ie6
			//Build parameters
			var enteredQuestion = $("#lightBoxAskQuestionTextArea").val();
			var charCount = $("#lightBoxAskQuestionTextArea").val().length;
			var email = $("#askEmail").val();
			var name = $("#askName").val();
			var validEmail = isEmail(email);
			var listingID = $("input[name=iLID]").val();
			var errorFound = false;

			// New Home Source
			if(!!$('input[name=isNewConstruction]', this).length){
				var firstName = $.trim($('input[name=szFirstName]', this).val());
				var lastName = $.trim($('input[name=szLastName]', this).val());
				var zipCode = $.trim($('input[name=szZipCode]', this).val());
				var validWord = /^(\w+)$/;
				var validZip = /^(\d{5}|\w\d\w\s?\d\w\d)$/;
				if (!validZip.test(zipCode)) { askQuestionLightBox.toggleErrorBox('Show', 'InvalidZipCode'); errorFound = true; }
				if (!validWord.test(firstName) || !validWord.test(lastName)) { askQuestionLightBox.toggleErrorBox('Show', 'InvalidName'); errorFound = true; }
				if (!errorFound) { 
					name = firstName + ' ' + lastName; 
					askQuestionLightBox.appendQueryParams('szZipCode='+escape(zipCode)+'&isNewConstruction=1')
				}
			}
			if(!validEmail){askQuestionLightBox.toggleErrorBox('Show', 'InvalidEmail'); errorFound = true;}
			if(charCount == 0 || enteredQuestion == defaultQuestion){ askQuestionLightBox.toggleErrorBox('Show', 'InvalidQuestion'); errorFound = true; }
			if(charCount > 500){ askQuestionLightBox.toggleErrorBox('Show', 'InvalidQuestionLength'); errorFound = true; }
			if(errorFound){ return false; } //if error return false to stop form submission
			var SuccessMsg = askQuestionLightBox.sendMessage(enteredQuestion, email, listingID, '', name);
		return false; //false stops the submit because form was sent via ajax

	});

	$(".lightboxCloseAskQuestion").click(function(){
		var enteredQuestion = $("#lightBoxAskQuestionTextArea").val();
		askQuestionLightBox.resetForm();
		$("#lightboxBg").removeClass('show');
		$("#lightboxAsk").removeClass('show');
		if(enteredQuestion != '') {
			$("#askQuestionTextArea").addClass("active");
			$("#askQuestionTextArea").val(enteredQuestion);
		}
		else {
			$("#askQuestionTextArea").removeClass("active");
			$("#askQuestionTextArea").val(defaultQuestion);
		}
		return false;
	});

	/////////////////////////////
	// Ask Question non-lightbox
	/////////////////////////////
	$("#askQuestionStandardForm").submit(function(){
		//remove all past error messages
		var targetElement = $("ul.askQuestionStandardResultBox").removeClass();
		targetElement.addClass("askQuestionStandardResultBox");  //Why I wanted to us ID's and not classes.  die ie6
		var listingID = $("input[name=iLID]").val();  //requires listingID to be hidden field, bad structural - nonModular
		var email = $("#askQuestionStandardEmail").val();
		validEmail = isEmail(email);
		var charCount = $("#askQuestionStandardTextArea").val().length;
		var enteredQuestion = $("#askQuestionStandardTextArea").val();
		var errorFound = false;

		// New Home Source
		if(!!$('input[name=isNewConstruction]', this).length){
			var firstName = $.trim($('input[name=szFirstName]', this).val());
			var lastName = $.trim($('input[name=szLastName]', this).val());
			var zipCode = $.trim($('input[name=szZipCode]', this).val());
			var validWord = /^(\w+)$/;
			var validZip = /^(\d{5}|\w\d\w\s?\d\w\d)$/;
			if (!validZip.test(zipCode)) { askQuestionStandard.toggleErrorBox('Show', 'InvalidPostalCode'); errorFound = true; }
			if (!validWord.test(firstName) || !validWord.test(lastName)) { askQuestionStandard.toggleErrorBox('Show', 'InvalidFirstLastName'); errorFound = true; }
			if (!errorFound) { 
				name = firstName + ' ' + lastName; 
				askQuestionStandard.appendQueryParams('name='+escape(name)+'&szZipCode='+escape(zipCode)+'&isNewConstruction=1');
			}
		}
		
		if(!validEmail){ askQuestionStandard.toggleErrorBox('Show', 'InvalidEmail'); errorFound = true;}
		if(charCount == 0 || enteredQuestion == defaultQuestion){ askQuestionStandard.toggleErrorBox('Show', 'InvalidQuestion'); errorFound = true; }
		if(charCount > 500){ askQuestionStandard.toggleErrorBox('Show', 'InvalidQuestionLength'); errorFound = true; }
		if(errorFound){return false; } //if error return false to stop form submission
		//if no error send mail
		var success = askQuestionStandard.sendMessage(enteredQuestion, email, listingID);
		return false; //false stops the submit because form was sent via ajax
	});

	if($("#askQuestionStandardEmail").val() != defaultEmail) {
		$("#askQuestionStandardEmail").addClass("active");
	}

	$("#askQuestionStandardEmail").focus(function() {
		if($(this).val() == defaultEmail) {
			$(this).addClass("active");
			$(this).val("");
		}
	});

	$("#askQuestionStandardEmail").blur(function() {
		if($(this).val() == "") {
			$(this).removeClass("active")
			$(this).val(defaultEmail);
		}
	});

	if($("#askQuestionStandardTextArea").val() != defaultQuestion) {
		$("#askQuestionStandardTextArea").addClass("active");
	}

	$("#askQuestionStandardTextArea").focus(function() {
		if($(this).val() == defaultQuestion) {
			$(this).addClass("active");
			$(this).val('');
		}
	});

	$("#askQuestionStandardTextArea").blur(function() {
		if($(this).val() == '') {
			$(this).removeClass("active");
			$(this).val(defaultQuestion);
		}
	});

	$("#askQuestionStandardTextArea").keyup(function(){
			updateWordCount('#askQuestionStandardTextArea','#askQuestionStandardCharCount');
	});

	////////////////////
	// Calendar lightbox
	////////////////////
	$(".lightboxCloseAddCal").click(function(){
		$("#lightboxBg").removeClass('show');
		$(".lightboxCal").removeClass('show');
		return false;
	});

	if(typeof(proAdIDs) != 'undefined' && proAdIDs != '') {
		$.ajax({
			url: '/proAd/proAdHits.php',
			type: 'POST',
			data: 'page=listingSearch&type=impression&proAdIDs='+proAdIDs,
			dataType: 'html',
			success: function() {
			},
			error: function(data, textStatus) {
			}
		});
	}

	$('a.proAdExtLink').click(function() {
		var proAdID = $(this).attr('rel');
		$.ajax({
			url: '/proAd/proAdHits.php',
			type: 'POST',
			data: 'page=listingSearch&type=urlclick&proAdIDs='+proAdID,
			dataType: 'html',
			success: function() {
				return true;
			},
			error: function(data, textStatus) {
				return true;
			}
		});
		return false;
	});

	// Init image cycler on listing Detail page.
	cycler = new ListingGalleryCycler();
});

/**
* @PARAMS: textArea amd textCounter need to be qualified jQuery selectors
*/
function updateWordCount(textArea, textCounter){
	var maxChars = 500;
	//var count = maxChars - $("#lightBoxAskQuestionTextArea").val().length;  //calculate # chars left
	var count = maxChars - $(textArea).val().length;  //calculate # chars left
	//Check word count and [do]Error messages

	if(count < 0  ){
		//$("#askQuestionCharCount").addClass("OverLimit");
		$(textCounter).addClass("OverLimit");
		$(textCounter).removeClass("UnderLimit");
		//toggleErrorBox('Show', 'InvalidQuestionLength');
	} else if (count >= 0 ){
		$(textCounter).addClass("UnderLimit");
		$(textCounter).removeClass("OverLimit");
		//toggleErrorBox('Hide', 'InvalidQuestionLength');
	}
	//Update character message with each keyUp
	$(textCounter).text(count.toString());
}


/*
Show open house calendar links in lightbox, given open house ID
*/
function showAddCal(openHouseID) {
	$("#lightboxBg").addClass('show');
	$("#lightboxCal"+openHouseID).addClass('show');
}

/* BEGIN GWO CONTACT OWNER */
function bindQuickAskQuestion() {
	var defaultQuestion = 'e.g. What are taxes like? How new is the carpet?';
	$(".quickAskQuestion").click(showQuickAskQuestionLightbox);
}

function bindQuickAskQuestionInPage() {
	$(document).ready(function () {
		var altDefaultQuestion = 'Your Question (e.g. How much are taxes? Is the carpet new?)';
		var altDefaultEmail = 'Your E-mail Address';
		if(typeof(QuickAskQuestionInPage) != 'undefined') {
			var quickAskQuestionInPage = new QuickAskQuestionInPage();
		}
		$("#askQuestionEmailArea").focus(function() {
			if($(this).val() == altDefaultEmail) {
				$(this).addClass("active");
				$(this).val('');
			}
		});
		$("#askQuestionEmailArea").blur(function() {
			if($(this).val() == '') {
				$(this).removeClass("active");
				$(this).val(altDefaultEmail);
			}
		});
		$("#askQuestionTextArea").focus(function() {
			if($(this).val() == altDefaultQuestion) {
				$(this).addClass("active");
				$(this).val('');
			}
		});
		$("#askQuestionTextArea").blur(function() {
			if($(this).val() == '') {
				$(this).removeClass("active");
				$(this).val(altDefaultQuestion);
			}
		});
		var listingID = $("input[name=iLID]").val();
		$("#emailListingID").val(listingID);
		$("#quickAskQuestionInPage").submit(function(){
			//remove all past error messages
			var targetElement = $("ul.quickAskQuestionResultBox").removeClass();
			targetElement.addClass("quickAskQuestionResultBox");  //Why I wanted to us ID's and not classes.  die ie6
			var listingID = $("#emailListingID").val();  //requires listingID to be hidden field, bad structural - nonModular
			var email = $("#askQuestionEmailArea").val();
			validEmail = isEmail(email);
			var charCount = $("#askQuestionTextArea").val().length;
			var enteredQuestion = $("#askQuestionTextArea").val();
			var errorFound = false;
			if(!validEmail){ quickAskQuestionInPage.toggleErrorBox('Show', 'InvalidEmail'); errorFound = true;}
			if(charCount == 0 || enteredQuestion == altDefaultQuestion){ quickAskQuestionInPage.toggleErrorBox('Show', 'InvalidQuestion'); errorFound = true; }
			if(charCount > 500){ quickAskQuestionInPage.toggleErrorBox('Show', 'InvalidQuestionLength'); errorFound = true; }
			if(errorFound){return false; } //if error return false to stop form submission
			//if no error send mail
			var success = quickAskQuestionInPage.sendMessage(enteredQuestion, email, listingID);
			return false; //false stops the submit because form was sent via ajax
		});
	});
}

function QuickAskQuestionInPage(){
	this.disableFormButtons = disableFormButtons;
	this.enableFormButtons = enableFormButtons;
	this.sendMessage = sendMessage;
	this.toggleErrorBox = toggleErrorBox;
	this.toggleSuccessBox = toggleSuccessBox;
	function sendMessage(emailBody, email, listingID){
		gaTrackPageView('/listing/' + listingURL + '/email1/send');
		var params = new Object();
		params.page = 'listing';
		params.action = 'email1';
		params.status = 'send';
		$.ajax({
				url: '/email-seller-process.php',
				type: 'POST',
				dataType: 'html',
				data: 'ajaxRequest=1&sendemail=1&body_email='+escape(emailBody)+'&szEmailAddress='+email+'&iLID='+listingID,
				timeout: 10000,
				error: function(){
						alert('A connection error occured... please try again.');
				},
				beforeSend: disableFormButtons(),
				success:  function(data, textStatus){
					if(data == 1){
						gaTrackPageView('/listing/' + listingURL + '/email1/success');
						if (typeof window.gwoContactOwnerSuccess == 'function') {
							gwoContactOwnerSuccess();
						}
						var params = new Object();
						params.page = 'listing';
						params.action = 'email1';
						params.status = 'success';
						toggleSuccessBox('Show', 'EmailSuccess');
						enableFormButtons();
					} else if(data == -1){
						gaTrackPageView('/listing/' + listingURL + '/email1/error');
						var params = new Object();
						params.page = 'listing';
						params.action = 'email1';
						params.status = 'error';
						toggleErrorBox('Show', 'EmailFailureSecurity');
						enableFormButtons();
					} else {
						gaTrackPageView('/listing/' + listingURL + '/email1/error');
						var params = new Object();
						params.page = 'listing';
						params.action = 'email1';
						params.status = 'error';
						toggleErrorBox('Show', 'EmailFailure');
						enableFormButtons();
					}
				}
		});  //end ajax handler
	}
	function disableFormButtons(){
		$("#askQuestionEmailArea").attr("disabled", "disabled");
		$("#askQuestionTextArea").attr("disabled", "disabled");
		$("#askQuestionSubmit").attr("disabled", "disabled");
	}
	function enableFormButtons(){
		$("#askQuestionEmailArea").attr("disabled", "");
		$("#askQuestionTextArea").attr("disabled", "");
		$("#askQuestionSubmit").attr("disabled", "");
	}
	function toggleErrorBox(toggleBox, msgHandler){
		if(toggleBox == 'Show'){
			$("ul.quickAskQuestionResultBox").addClass('ShowError '+msgHandler);
		} else if(toggleBox == 'Hide'){
			$("ul.quickAskQuestionResultBox").removeClass('ShowError '+msgHandler);
		}
	}
	function toggleSuccessBox(toggleBox, msgHandler){
		if(toggleBox == 'Show'){
			$("ul.quickAskQuestionResultBox").addClass('ShowSuccess '+msgHandler);
		} else if(toggleBox == 'Hide'){
			$("ul.quickAskQuestionResultBox").removeClass('ShowSuccess '+msgHandler);
		}
	}
}
/* END GWO CONTACT OWNER */

//IE support
var listingMem = {};
function poorJavascriptSupport(id) { 
	if(!!listingMem[id]) 
		listingMem[id].run(listingMem[id]); 
}

var ListingGalleryCycler = function(arg){
	this.init(arg);
	return this;
}

ListingGalleryCycler.prototype = {
		uuid: 0,
		selectors : {
			toggle: '#pic_player_toggle',
			terminateOnClick: '#pic_next, #pic_prev, #thumbs .thumb, #paginPhotos .viewAll a'
		},
		INTERVAL:  null,
		isRunning: false,
		delay: 3000,
		init : function(arg) {
			for(var v in arg) this[v] = arg[v];
			$(this.selectors.toggle).bind('click',{self:this},this.toggleHandle)
			$(this.selectors.terminateOnClick).bind('click',{self:this},this.stop)
			this.uuid = new Date().valueOf();
			listingMem[this.uuid] = this;
			this.start();
		},
		run : function(){
			var newImage = $('#thumbs .on').next().length ? $('#thumbs .on').next() : $('#thumbs .thumb:first');
			var id = $(newImage).attr('id');
			if(!id) { return false; }
			imageNum = id.substring(id.search(/thumblink/)+9);

			var listingID   = $("input[name=iLID]").val();

			if (photoArray.length == 1){
				$(".prevNext").hide();
				$(".viewAll a").html('View Photo &raquo;');
			}

			$('#photoCurrent').html(imageNum);
			$('.photoTotal').html( (photoArray.length) );

			$("#photoTitle").hide();
			$("#photoDescription").hide();
			captionFill(imageNum);

			if ($("#photoTitle").html() || $("#photoDescription").html()){
				$("#photoTitle").show();
				$("#photoDescription").show();
			}

			$('#listingPhoto').hide();
			$('#listingPhoto').attr("src", photoArray[imageNum-1]);
			$('#listingPhoto').show();
			$('#thumbs .thumb').removeClass("on");
			$('#thumblink' + imageNum).addClass("on");

			slideTo(imageNum);
		},
		start: function() {
				this.INTERVAL =  $.browser.msie ? setInterval("poorJavascriptSupport("+this.uuid+")",this.delay) : setInterval(this.run,this.delay,this);
				this.isRunning = true;
				$(this.selectors.toggle).css({backgroundPosition:"0 -19px"}).html('Pause');
		},
		stop: function(event) {
			var self = !!event.data.self ? event.data.self: this;
			clearInterval(self.INTERVAL);
			self.isRunning = false;
			$(self.selectors.toggle).css({backgroundPosition:"0 0"}).html('Play');
		},
		// This method is within jQuery's event closure
		toggleHandle: function(event) {
			event.data.self.isRunning ? event.data.self.stop(event) : event.data.self.start(event);
			return false;
		}
}

function slideTo(newImageNum, carouselOffset, callback){
	if(!blockAnimation){
		blockAnimation = true;

		var imageNum = getImageNum();

		if(carouselOffset == undefined){
			var carouselOffset = getCarouselOffset();
			if(newImageNum > imageNum){
				carouselOffset++;
			}else{
				carouselOffset--;
			}
		}
		if(
				(imageNum != 1 || newImageNum != 2) 
			 && (imageNum != numImagesAvailable || newImageNum != numImagesAvailable-1) 
			 && (imageNum != newImageNum) 
			 && carouselOffset >= 0 
			 && carouselOffset <= numImagesAvailable-numImagesShown
		){
			var _left = newImageNum == 1 ? 0 : $('#thumbs .thumb:first').width() * -carouselOffset ;
			carouselOffset = newImageNum == 1 ? 0 : carouselOffset;
			$('#thumbs').animate({'left':_left}, function(){
				$('#thumbs').data('carouselOffset', carouselOffset);
				setImageNum(newImageNum);
				blockAnimation = false;
				if (typeof callback != "undefined") {
					callback();
				}
			});
		}else{
			blockAnimation = false;
		}
	}
}

function in_array(string, array) {
	for (var i = 0; i < array.length; i++) {
		if(array[i] == parseInt(string)) {
		return true;
		}
	}
	return false;
}

function captionFill(imageNum) {
	$('#photoTitle').text('');
	$("#photoTitle").append( $('#title' + imageNum).text()  );
	$('#photoDescription').text('');
	$("#photoDescription").append( $('#description' + imageNum).text()  );
	$('#photoCurrent').text('');
	$("#photoCurrent").append( imageNum  );
	$('#photoTotal').text('');
	$("#photoTotal").append( numPhotos );
}

function getImageNum(){
	return parseInt($('#thumbs').data('imageNum')) || 1;
}
function setImageNum(num) {
	return $('#thumbs').data('imageNum', num);
}

function getCarouselOffset(){
	return parseInt($('#thumbs').data('carouselOffset')) || 0;
}

