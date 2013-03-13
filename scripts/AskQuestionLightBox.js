function AskQuestionLightBox(){
	this.disableFormButtons = disableFormButtons;
	this.sendMessage = sendMessage;
	this.toggleErrorBox = toggleErrorBox;
	this.toggleSuccessBox = toggleSuccessBox;
	this.resetForm = resetForm;
	this.additionalQueryParams = '';
	this.appendQueryParams = appendQueryParams;
	
	function appendQueryParams(params) {
		this.additionalQueryParams = '&'+params;
	}
	
	function sendMessage(emailBody, email, listingID, type, name){
		media = (type == 'media') ? ('media/') : ('');			
		gaTrackPageView('/listing/' + listingURL + '/' +  media + 'email1/send');
		var params = new Object();
		params.page = 'listing';
		params.action = 'email1';
		params.status = 'send';
		var queryParams = 'ajaxRequest=1&sendemail=1&name='+escape(name)+'&body_email='+escape(emailBody)+'&szEmailAddress='+email+'&iLID='+listingID;
		if(this.additionalQueryParams) {
			queryParams += this.additionalQueryParams;
		}
		
		$.ajax({
				url: '/email-seller-process.php',
				type: 'POST',
				dataType: 'html',
				data: queryParams,
				timeout: 10000,
				error: function(){
						alert('A connection error occured... please try again.');
				},
				beforeSend: disableFormButtons(), 
				success:  function(data, textStatus){									
					if(data == 1){
						gaTrackPageView('/listing/' + listingURL + '/' +  media + 'email1/success');
						if (typeof window.gwoContactOwnerSuccess == 'function') {
							gwoContactOwnerSuccess();
						}
						var params = new Object();
						params.page = 'listing';
						params.action = 'email1';
						params.status = 'success';
						toggleSuccessBox('Show', 'EmailSuccess');
				
						disableForm();
					} else if(data == -1){
						gaTrackPageView('/listing/' + listingURL + '/' +  media + 'email1/error');
						var params = new Object();
						params.page = 'listing';
						params.action = 'email1';
						params.status = 'error';
						toggleErrorBox('Show', 'EmailFailureSecurity');
					} else {
						gaTrackPageView('/listing/' + listingURL + '/' +  media + 'email1/error');
						var params = new Object();
						params.page = 'listing';
						params.action = 'email1';
						params.status = 'error';
						toggleErrorBox('Show', 'EmailFailure');
					}
				}
		});
	}
	
	function disableForm(){
		$("#lightboxAskQuestionContainer").addClass('hide');
	}
	
	function disableFormButtons(){
		//$("#lightBoxAskQuestionTextArea").attr("disabled", "disabled");  //till we get a new greybackground
		$("#askEmail").attr("disabled", "disabled");
		$("#lightBoxAskQuestionSubmit").attr("disabled", "disabled");
	}

	function enableFormButtons(){
		//$("#lightBoxAskQuestionTextArea").attr.attr("disabled", "");
		$("#askEmail").attr("disabled", "");
		$("#lightBoxAskQuestionSubmit").attr("disabled", "");
	}
	function toggleSuccessBox(toggleBox, msgHandler){
		if(toggleBox == 'Show'){
				$("div.lightboxAskQuestionResultBox").addClass('ShowSuccess '+msgHandler);
		} else if(toggleBox == 'Hide'){
			 $("div.lightboxAskQuestionResultBox").removeClass('ShowSuccess '+msgHandler);
		}
	}
	function toggleErrorBox(toggleBox, msgHandler){
		if(toggleBox == 'Show'){
			 $("div.lightboxAskQuestionResultBox").addClass('ShowError '+msgHandler);
		} else if(toggleBox == 'Hide'){
			 $("div.lightboxAskQuestionResultBox").removeClass('ShowError '+msgHandler);
		}
	}
	function resetForm(){
		//reset form fields
		$("#askQuestionTextArea").val('');
		$("#lightBoxAskQuestionTextArea").val('');
		$('#lightboxAskQuestionContainer').removeClass('hide');
		$("#lightBoxAskQuestionSubmit").attr("disabled", "");
		$("div.lightboxAskQuestionResultBox").removeClass('ShowSuccess EmailSuccess');
	}
}
if ($.browser.msie && $.browser.version < 9) $('#askQuestionTextArea').css("width", "auto");

