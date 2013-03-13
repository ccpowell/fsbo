function FlagListingLightbox(){
	this.disableFormElements = disableFormElements;
	this.flagListing = flagListing;
	this.toggleErrorBox = toggleErrorBox;
	this.toggleSuccessBox = toggleSuccessBox;
	this.resetForm = resetForm;
	
	function flagListing(listingID, reasonCode, reasonComment){
		$.ajax({
				url: '/flag-listing-process.php',
				type: 'POST',
				dataType: 'html',
				data: 'flag=1&flReason='+reasonCode+'&flComment='+reasonComment+'&iLID='+listingID,
				timeout: 10000,
				error: function(){
						alert('A connection error occured... please try again.');
				},
				beforeSend: disableFormElements(), 
				success:  function(data, textStatus){
					if(data == 1){
						toggleSuccessBox('Show', 'FlagSuccess');
						hideForm();
					} else {
						toggleErrorBox('Show', 'FlagFailure');
					}
				}
		});  //end ajax handler
	}
	function hideForm(){
		$('#lightboxFlagListingForm').addClass('hide');
	}
	function disableFormElements(){	}
	function enableFormButtons(){	}
	function resetForm(){
		//reset form fields
		$("input[name=flReason]:checked").attr('checked', '');
		$("#flComment").val('');
		$('#lightboxFlagListingForm').removeClass('hide');
		$("div.lightboxFlagListingResultBox").removeClass('ShowSuccess FlagSuccess');
		$("div.lightboxFlagListingResultBox").removeClass('ShowError MissingReason');
		$("div.lightboxFlagListingResultBox").removeClass('ShowError CommentRequired');
	}
	function toggleSuccessBox(toggleBox, msgHandler){
		if(toggleBox == 'Show'){
				$("div.lightboxFlagListingResultBox").addClass('ShowSuccess '+msgHandler);
		} else if(toggleBox == 'Hide'){
			$("div.lightboxFlagListingBox").removeClass('ShowSuccess '+msgHandler);
		}
	}
	function toggleErrorBox(toggleBox, msgHandler){
		if(toggleBox == 'Show'){
			 $("div.lightboxFlagListingResultBox").addClass('ShowError '+msgHandler);
		} else if(toggleBox == 'Hide'){
			 $("div.lightboxFlagListingResultBox").removeClass('ShowError '+msgHandler);
		}
	}
	
}  //end FlagListingFunction
