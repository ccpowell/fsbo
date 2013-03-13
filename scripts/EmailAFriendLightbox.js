function EmailAFriendLightbox(){
	this.disableFormElements = disableFormElements;
	this.sendMessage = sendMessage;
	this.toggleErrorBox = toggleErrorBox;
	this.toggleSuccessBox = toggleSuccessBox;
	this.resetForm = resetForm;
	
	function sendMessage(userEmail, userName, friendEmail, friendName, message, url, listingID){
		$.ajax({
				url: '/email-friend-process.php',
				type: 'POST',
				dataType: 'html',
				data: 'mail=1&eafEmail='+escape(userEmail)+'&eafName='+escape(userName)+'&eafFriendEmail='+escape(friendEmail)+'&eafFriendName='+escape(friendName)+'&message='+escape(message)+'&url='+escape(url)+'&iLID='+escape(listingID),
				timeout: 10000,
				error: function(){
						alert('A connection error occured... please try again.');
				},
				beforeSend: disableFormElements(), 
				success:  function(data, textStatus){
					if(data == 1){
						toggleSuccessBox('Show', 'EmailSuccess');
						hideForm();
					} else {
						toggleErrorBox('Show', 'EmailFailure');
					}
				}
		});  //end ajax handler
	}
	
	function hideForm(){
		$('#lightboxEmailAFriendForm').addClass('hide');
	}
	
	function disableFormElements(){	}
	function enableFormButtons(){	}
	
	function resetForm(){
		//reset form fields
		$("input[name=eafEmail]").val('');
		$("input[name=eafName]").val('');
		$("input[name=eafFriendEmail]").val('');
		$("input[name=eafFriendName]").val('');
		$("#eafMessage").val('');
		$('#lightboxEmailAFriendForm').removeClass('hide');
		$("div.lightboxEmailFriendResultBox").removeClass('ShowSuccess EmailSuccess');
	}
	function toggleSuccessBox(toggleBox, msgHandler){
		if(toggleBox == 'Show'){
				$("div.lightboxEmailFriendResultBox").addClass('ShowSuccess '+msgHandler);
		} else if(toggleBox == 'Hide'){
			 $("div.lightboxEmailFriendResultBox").removeClass('ShowSuccess '+msgHandler);
		}
	}
	function toggleErrorBox(toggleBox, msgHandler){
		if(toggleBox == 'Show'){
			 $("div.lightboxEmailFriendResultBox").addClass('ShowError '+msgHandler);
		} else if(toggleBox == 'Hide'){
			 $("div.lightboxEmailFriendResultBox").removeClass('ShowError '+msgHandler);
		}
	}
	
}  //end AskQuestionFunction
