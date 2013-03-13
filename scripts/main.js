/********************************************************
 * Purpose: Generic Function Repository
 ********************************************************/
function selectPopup(select, win_width, win_height) {
return true;
}

//Accepts a form element(input or select) and returns the objects string value with removed alpha-chars
function stripCharacters(theObject) {
var refString = "0123456789";
var checkStr = theObject.value;
theObject = "";
for(var i = 0; i < checkStr.length; i++) {
ch = checkStr.charAt(i);
if (refString.indexOf(ch, 0) != -1) {
theObject = theObject + ch;
}
}
return theObject;
}

// Limits textarea input
function limitTextArea(obj){
	var mlength = obj.getAttribute? parseInt(obj.getAttribute("maxlength")) : ""
	if (obj.getAttribute && obj.value.length>mlength)
		obj.value=obj.value.substring(0,mlength)
}

function isPhoneNumber(theObject) {
var refString = "0123456789+()-.[]ext ";
var checkStr = theObject.value;
var allValid = true;
for (var i = 0; i < checkStr.length; i++) {
ch = checkStr.charAt(i);
if (refString.indexOf(ch, 0) == -1) { return (false); }
}
return (true);
}

function isNumericDecimal(theObject) {
var refString = "0123456789.";
var checkStr = theObject.value;
var allValid = true;
for (var i = 0; i < checkStr.length; i++) {
ch = checkStr.charAt(i);
if (refString.indexOf(ch, 0) == -1) { return (false); }
}
return (true);
}

function isNumeric(theObject) {
var refString = "0123456789";
var checkStr = theObject.value;
var allValid = true;
for (var i = 0; i < checkStr.length; i++) {
ch = checkStr.charAt(i);
if (refString.indexOf(ch, 0) == -1) { return (false); }
}
return (true);
}

function isValidBathroom(num) {
var input = String(num * 2);
return isInteger(input);
}

function isDigit(num) {
if (num.length>1){return false;}
var string="1234567890";
if (string.indexOf(num)!=-1){return true;}
return false;
}

function isInteger(val){
if (isBlank(val)){return false;}
for(var i=0;i<val.length;i++){
if(!isDigit(val.charAt(i))){return false;}
}
return true;
}

function isBlank (theObject) {
if (theObject == null)     { return true; }
if (theObject.value == "") { return true; }
return false;
}

function validate (theForm) {
// set var radio_choice to false
if ((theForm.iAccountNumber != undefined && theForm.iAccountNumber.length != undefined)
		|| (theForm.iAccountNumber2 != undefined && theForm.iAccountNumber2.length != undefined)) {
	var iAccountNumberExists = false;
	var iAccountFormOption   = theForm.iAccountNumber;
	// Check if a regular package chosen
	if (theForm.iAccountNumber != undefined && theForm.iAccountNumber.length != undefined) {
		for (var counter = 0; counter < theForm.iAccountNumber.length; counter++) {
			if (theForm.iAccountNumber[counter].checked) {
				iAccountNumberExists = true;
			}
		}
	}
	if (!iAccountNumberExists
			&& (theForm.iAccountNumber2 != undefined && theForm.iAccountNumber2.length != undefined)) {
		// Check if a publisher package chosen
		for (var counter = 0; counter < theForm.iAccountNumber2.length; counter++) {
			if (theForm.iAccountNumber2[counter].checked) {
				iAccountNumberExists = true;
			}
		}
		if (iAccountFormOption == undefined) {
			iAccountFormOption = theForm.iAccountNumber2;
		}
	}
	if (iAccountNumberExists == false) {
		iAccountFormOption[0].focus();
		iAccountFormOption[0].click();
		alert ("Please select a package type.  I have selected the first option for you.");
		return false;
	}
}
if (isBlank(theForm.szFirstName)) {
theForm.szFirstName.focus();
alert ("Please enter the homeowner's first name.");
return false;
}
if (isBlank(theForm.szLastName)) {
theForm.szLastName.focus();
alert ("Please enter the homeowner's last name.");
return false;
}
if (isBlank(theForm.szOwnerName)) {
theForm.szOwnerName.focus();
alert ("Please enter the Display Name.");
return false;
}
if(isBlank(theForm.szPhone1)){
theForm.szPhone1.focus();
alert ("Please enter a contact phone number.");
return false;
}
if (!isBlank(theForm.szEmailAddress) && !isEmail(theForm.szEmailAddress.value)) {
theForm.szEmailAddress.focus();
theForm.szEmailAddress.select();
alert ("I'm sorry, it appears that the email address you entered is not valid.  Please try again.")
return false;
}
if(theForm.confEmailAddress != undefined) {
if (theForm.szEmailAddress.value != theForm.confEmailAddress.value) {
theForm.confEmailAddress.focus();
theForm.confEmailAddress.select();
alert ("Please enter matching Email Addresses.");
return false;
}
}
if (isBlank(theForm.szAddress)) {
theForm.szAddress.focus();
alert ("Please enter the property address.");
return false;
}
if (isBlank(theForm.szCity)) {
theForm.szCity.focus();
alert ("Please enter the city that this property is in.");
return false;
}
if (theForm.szStateCode.value == "" || theForm.szStateCode.value == "ZZ") {
theForm.szStateCode.focus();
alert ("Please select the state/province for this property.");
return false;
}

if (theForm.szCountryCode && theForm.szCountryCode.type != 'hidden') {
if (theForm.szCountryCode.value == "" || theForm.szCountryCode.value == "ZZ") {
theForm.szCountryCode.focus();
alert ("Please select the country for this property.");
return false;
}
}
if (isBlank(theForm.szPostalCode)) {
theForm.szPostalCode.focus();
if (theForm.szStateCode.value == 0) {
	alert ("Please enter the postal code for this property.\nIf the property address does not include a postal code, enter NONE in this field.");
} else {
	alert ("Please enter the postal code for this property.");
}
return false;
}
if (theForm.iPropTypeCode.selectedIndex == 0) {
theForm.iPropTypeCode.focus();
alert ("Please select the type of property for sale.");
return false;
}
//Attempt to strip all characters associated with the asking price, then check if blank
stripCharacters(theForm.iAskingPrice);
if (isBlank(theForm.iAskingPrice)) {
theForm.iAskingPrice.focus();
alert ("Please enter the asking price for this property.");
return false;
}
//theForm.szPassword is undefined in myListing edit page
if (isBlank(theForm.szPassword) && theForm.szPassword != undefined) {
if (theForm.iAdmin == undefined || theForm.iAdmin.value == "") {
//non-admin attempting to create an account, alert
theForm.szPassword.focus();
alert("Please select a password for this ad.");
return false;
}
}
if (theForm.szPassword != undefined) {
if (theForm.szPassword.value != theForm.szConfPassword.value) {
theForm.szConfPassword.focus();
theForm.szConfPassword.select();
alert ("Please enter matching passwords.");
return false;
}
}
if (!isNumeric(theForm.iNumBedrooms)) {
theForm.iNumBedrooms.focus();
theForm.iNumBedrooms.select();
alert ("Number of bedrooms should be a whole number.");
return false;
}
if(!isValidBathroom(theForm.fNumBathrooms.value)) {
theForm.fNumBathrooms.focus();
alert("Please enter the valid bathroom number, such as 1, 1.5, 2.5");
return false;
}
if (!isNumericDecimal(theForm.fNumFloors)) {
theForm.fNumFloors.focus();
theForm.fNumFloors.select();
alert ("Number of floors should be a whole number.");
return false;
}
//disregard lot size / acres
if (!isNumeric(theForm.iBuilt)) {
theForm.iBuilt.focus();
alert ("Please use only the digits 0-9 to enter the year built.");
return false;
}
if (theForm.iBuilt.value != 0 && (theForm.iBuilt.value < 1050 || theForm.iBuilt.value > 2010) ) {
theForm.iBuilt.focus();
alert ("Please enter 0 or a year between 1050 and 2010.");
return false;
}
var filter = /^[\d\,\.]*$/;
if (!filter.test(theForm.iSqFootage.value)) {
theForm.iSqFootage.focus();
theForm.iSqFootage.select();
alert ("Please use only digits and commas to enter the square footage.");
return false;
}
if (theForm.dEndRun) {
if (!formatDate(theForm.dEndRun.value)) {
theForm.dEndRun.focus();
theForm.dEndRun.select();
alert('Date must be in format YYYY-MM-DD');
return false;
}
}
return true;
}

function verifyInfo(theForm) {
if (isBlank(theForm.szName)){
alert ("Please enter your name so that we may contact you.");
return false;
} else if (!isBlank(theForm.szEmail) && !isEmail(theForm.szEmail.value)) {
alert ("Please enter a valid email address where you can be reached, then try again.");
return false;
} else if (isBlank(theForm.szEmail)&&(isBlank(theForm.szPhone))&&(isBlank(theForm.szPhone2))&&(isBlank(theForm.szPhoneEve))){
alert ("Please enter either a phone numnber or email address where you can be reached, then try again.");
return false;
}
return true;
}

function isEmail(email) {
invalidChars = " ~\'^\`\"*+=\\|][(){}$!#%/:,;";
// Remove leading and trailing whitespace
email = email.replace(/^\s+/,"");
email = email.replace(/\s+$/,"");
// Check for null
if (email == "") {
return false;
}
// Check for invalid characters as defined above
for (var i=0; i<invalidChars.length; i++) {
badChar = invalidChars.charAt(i);
if (email.indexOf(badChar,0) > -1) {
return false;
}
}
lengthOfEmail = email.length;
if ((email.charAt(lengthOfEmail - 1) == ".") || (email.charAt(lengthOfEmail - 2) == ".")) {
return false;
}
Pos = email.indexOf("@",1);
if (email.charAt(Pos + 1) == ".") {
return false;
}
while ((Pos < lengthOfEmail) && ( Pos != -1)) {
Pos = email.indexOf(".",Pos);
if (email.charAt(Pos + 1) == ".") {
return false;
}
if (Pos != -1) {
Pos++;
}
}
// There must be at least one @ symbol
atPos = email.indexOf("@",1);
if (atPos == -1) {
return false;
}
// But only ONE @ symbol
if (email.indexOf("@",atPos+1) != -1) {
return false;
}
// Also check for at least one period after the @ symbol
periodPos = email.indexOf(".",atPos);
if (periodPos == -1) {
return false;
}
if (periodPos+3 > email.length) {
return false;
}
return true;
}

function checkEmail(val) {
// Remove all whitespace
val = val.replace(/^\s+/,"");
val = val.replace(/\s+$/,"");
if (isEmail(val)==false) {
if (val.length == 0 || val == null) {
var notValid =  "Please enter a valid email address";
} else {
var notValid =  "I'm sorry, " + val + " is not a valid email address";
}
alert(notValid);
return false;
}
return true;
}

function formatDate(date) {
var spot = date.indexOf('-',0)
if ((spot != 4) || (date.length != 10)) {
return false;
}
spot = date.indexOf('-',5)
if (spot != 7) {
return false;
}
return true;
}

//functions for slideshow
//written by: scott bice 6/15/02
var timer = null;
function playpauseShow(option) {
if (option == "play") {
if (currentImage == imageList.length-1) {
currentImage=0;
} else {
currentImage++;
}
document.slideimage.src = imageList[currentImage];
timer = setTimeout("playpauseShow('play')", 3000);
} else {
clearTimeout(timer);
}
}

function nextImage() {
if (currentImage == imageList.length-1) {
currentImage = 0;
} else {
currentImage++;
}
document.slideimage.src = imageList[currentImage];
}

function prevImage() {
if (currentImage == 0) {
currentImage = imageList.length-1;
} else {
currentImage--;
}
document.slideimage.src = imageList[currentImage];
}
//end of functions for slideshow

var browser = navigator.appName;
var version = navigator.appVersion.substring(0,1);
function redirectTopNav(dest) {
window.location=dest;
}

function changeFontColor(loc, color) {
if (browser == "Microsoft Internet Explorer") {
window[loc].style.color=color;
}
}

function changeBGColor(loc, color) {
if (browser == "Microsoft Internet Explorer") {
window[loc].style.backgroundColor=color;
}
}

function changeImage(loc, image) {
if (browser == "Microsoft Internet Explorer") {
window[loc].src = image;
} else if (browser == "Netscape" && version>=5) {
document.getElementById(loc).src = image;
}
}

function formatCurrency(num) {
num = num.toString().replace(/\$|\,/g,'');
if(isNaN(num)) num = "0";
cents = Math.floor((num * 100 + 0.5) % 100);
num = Math.floor((num * 100 + 0.5) / 100).toString();
if(cents < 10) cents = "0" + cents;
for (var i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++)
num = num.substring(0,num.length - (4 * i + 3))+','+num.substring(num.length-(4 * i + 3));
return ("$" + num + "." + cents);
}

// Savings Calculation: Used in What Will I Save sections
// Need more input as to when this is used with prior calculations
function checkChoice(whichbox) {
with (whichbox.form) {
var p = price.value;
var prior = priorval.value;
var savings = "$0.00";
// Make sure value is a number and no decimal is entered, or reset to prior
if (isNaN(whichbox.value)) {
whichbox.value = prior;
whichbox.focus();
}
whichbox.value = Math.abs(whichbox.value);
var dec = whichbox.value.indexOf('.', 1)
if (dec > 0) {
alert('No decimal places allowed for \"' +whichbox.name +'\" !');
whichbox.value = prior;
whichbox.focus();
}
hiddentotal.value = eval(hiddentotal.value) - eval(p * prior);
prior = whichbox.value;
hiddentotal.value = eval(p * whichbox.value);
savings = formatCurrency(hiddentotal.value);
return(savings.substring(0,(savings.length)-3));
}
}

function popup(mypage, windowname, h, w) {
if (! window.focus) { return true; }
window.open(mypage, windowname, 'height='+h+',width='+w+',scrollbars=no');
return true;
}

function termsWindow() {
window.open ('/terms/popup', 'TermsAndConditions', 'height=350, width=640, scrollbars=1, resizable=1');
return false;
}

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
//add event function from http://www.dynarch.com/projects/calendar/
function addAnEvent(el, evname, func) {
if (el.attachEvent) { // IE
el.attachEvent("on" + evname, func);
} else if (el.addEventListener) { // Gecko / W3C
el.addEventListener(evname, func, true);
} else {
el["on" + evname] = func;
}
}

/* Image Functions (taken from image.js) */
function preloadImages() {
var d=document; if(d.images){ if(!d.p) d.p=new Array();
var i,j=d.p.length,a=preloadImages.arguments; for(i=0; i<a.length; i++)
if (a[i].indexOf("#")!=0){ d.p[j]=new Image; d.p[j++].src=a[i];}}
}

function swapImgRestore() {
var i,x,a=document.sr; for(i=0;a&&i<a.length&&(x=a[i])&&x.oSrc;i++) x.src=x.oSrc;
}

function findObj(n, d) {
var p,i,x;  if(!d) d=document;
if((p=n.indexOf("?"))>0&&parent.frames.length) {
d=parent.frames[n.substring(p+1)].document; n=n.substring(0,p);
}
if(!(x=d[n])&&d.all) x=d.all[n]; for (i=0;!x&&i<d.forms.length;i++) x=d.forms[i][n];
for(i=0;!x&&d.layers&&i<d.layers.length;i++) {
x=findObj(n,d.layers[i].document);
}
return x;
}

function swapImage() {
var i,j=0,x,a=swapImage.arguments;
document.sr=new Array;
for(i=0;i<(a.length-2);i+=3) {
if ((x=findObj(a[i]))!=null) {
document.sr[j++]=x; if(!x.oSrc) x.oSrc=x.src; x.src=a[i+2];
}
}
}
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
function gaTrackPageView(gaPageID) {
	if (typeof(pageTracker) != 'undefined') {
		pageTracker._trackPageview(gaPageID);
	}
}
function gaTrackEvent(a,b,c,d) {
	if (typeof(pageTracker) != 'undefined') {
		pageTracker._trackEvent(a,b,c,d);
	}
}
/**
 * wrapper for gaTrackPageView, but will always return true;
 * @param gaPageID string of url to send to GA
 * @return boolean true
 */
function gaTrackPageViewOnSubmit(gaPageID) {
	try { gaTrackPageView(gaPageID); } catch(e) {}
	return true;
}

if (typeof jQuery != 'undefined' && $.fn.jquery != '1.2.6') {
	$(function(){
		$("input[type=text].title_hint").live('focus', function(){
			if ($(this).val() === $(this).attr('title')) {
				$(this).val('');
				$(this).addClass('active');
			}
		}).live('blur', function(){
			jqTitle = $(this).attr("title");
			jqVal = $(this).val();
			if (jqVal === '' || jqVal === jqTitle) {
				$(this).removeClass('active');
				$(this).val(jqTitle);
			} else {
				$(this).addClass('active');
			}
		}).trigger('blur').closest('form').submit(function(){
			$(this).find('input[type=text].title_hint').each(function(){
				if ($(this).val() === $(this).attr('title')) {
					$(this).val('');
				}
			});
		});
	});
}

var navigationTimer, navigationDestroyBoolean;
function navigationDestroy() {
	if(navigationDestroyBoolean) {
		$('ul#tabs div.navMenu').hide();
		$('ul#tabs li.activeNavMenu').removeClass('activeNavMenu');
	}
}
if (typeof jQuery != 'undefined' && $.fn.jquery != '1.2.6') {
	$(document).ready(function(){
		$('ul#tabs > li').live('mouseenter, mouseover',function(){
			// clear any watches
			clearTimeout(navigationTimer);
			navigationDestroyBoolean = false;
			// find child menu
			var flyoutNav = $(this).find('div.navMenu');
			if(flyoutNav.length > 0) {
				if (flyoutNav.is(':hidden')) {
					$('ul#tabs div.navMenu').hide();
					$('ul#tabs li.activeNavMenu').removeClass('activeNavMenu');
					flyoutNav.show().parent().addClass('activeNavMenu');
				}
			} else {
				$('ul#tabs div.navMenu').hide();
				$('ul#tabs li.activeNavMenu').removeClass('activeNavMenu');
			}
		});
		$('ul#tabs div.navMenu').live('mouseleave',function(){
			$(this).hide();
			$('ul#tabs li.activeNavMenu').removeClass('activeNavMenu');
		}).live('mouseenter, mouseover',function(){
			navigationDestroyBoolean = false;
			clearTimeout(navigationTimer);
		});
		// Set & kick-off timer when user start interacting with page content
		$('#wrapper, #holder').live('mouseenter, mouseover',function(){
			if(!navigationDestroyBoolean) {
				navigationTimer = setTimeout(navigationDestroy,1234);
				navigationDestroyBoolean = true;
			}
		});
		
		$('ul#PrimaryMenu > li').live('mouseenter, mouseover',function(){
			// clear any watches
			clearTimeout(navigationTimer);
			navigationDestroyBoolean = false;
			// find child menu
			var flyoutNav = $(this).find('div.navMenu');
			if(flyoutNav.length > 0) {
				if (flyoutNav.is(':hidden')) {
					$('ul#PrimaryMenu div.navMenu').hide();
					$('ul#PrimaryMenu li.active').removeClass('active');
					flyoutNav.show().parent().addClass('active');
				}
			} else {
				$('ul#PrimaryMenu div.navMenu').hide();
				$('ul#PrimaryMenu li.active').removeClass('active');
			}
		});
		$('ul#PrimaryMenu div.navMenu').live('mouseleave',function(){
			$(this).hide();
			$('ul#PrimaryMenu li.active').removeClass('active');
		}).live('mouseenter, mouseover',function(){
			navigationDestroyBoolean = false;
			clearTimeout(navigationTimer);
		});
		// Set & kick-off timer when user start interacting with page content
		$('#bodyContent').live('mouseenter, mouseover',function(){
			if(!navigationDestroyBoolean) {
				navigationTimer = setTimeout(navigationDestroy,1234);
				navigationDestroyBoolean = true;
			}
		});
	});
}

$(document).ready(function(){
	if($.browser.msie && parseInt($.browser.version) < 8) {
		$('ul.breadcrumbs li.breadcrumbsParent').hover(
				function(){$(this).addClass('hover');},
				function(){$(this).removeClass('hover');}
		);
	}
});

var util = {};
/**
 * wrapper function for autocomplete
 * @param s = jquery selector
 * @param p = optional parameters
 * @param loc = location of ajax
 * */
util.autocomplete = function(s,p,loc) {
	var version = (typeof _version != 'undefined') ? _version : 0;
	if(typeof jQuery.fn.autocomplete != 'function')
	{
		$('head')
			.append('<script type="text/javascript" src="/scripts/jqueryPlugins/auto.complete.js?v='+version+'"></script>');
	}
	if(!$("link[href^='/scripts/jqueryPlugins/auto.complete.css']").length)
	{
		$('head')
			.append('<link rel="stylesheet" type="text/css" href="/scripts/jqueryPlugins/auto.complete.css?v='+version+'" />');
	}
	$(function(){
		if(!$(s).length) {
			return false;
		}

		if(!(p instanceof Object))
		{
			p = {};
		}
		if(typeof loc == 'undefined') {
			loc = "/admin/autoComplete.php";
		}
		var defaults = {
				inputClass: "ac_input",
				resultsClass: "ac_results",
				lineSeparator: "\n",
				cellSeparator: "|",
				minChars: 1,
				delay: 400,
				matchCase: 0,
				matchSubset: 1,
				matchContains: 0,
				cacheLength: 1,
				mustMatch: 0,
				extraParams: {},
				loadingClass: "ac_loading",
				selectFirst: false,
				selectOnly: false,
				mode: "single",
				multipleSeperator: ",",
				selectValue: "value",
				formatItem:function(){}
		};
		var o = $.extend(true, defaults, p);
		//console.log(o);
		$(s).autocomplete(loc, o);
	});
};
