//Accepts a form element(input or select) and returns the objects string value with removed alpha-chars
function stripCharacters(theObject) {
var refString = "0123456789";
var checkStr = theObject.value;
theObject = "";
for(i = 0; i < checkStr.length; i++) {
ch = checkStr.charAt(i);
if (refString.indexOf(ch, 0) != -1) {
theObject = theObject + ch;
}
}
return theObject;
}

//Comma function that takes a integer and adds commas and decimals
function commaSplit(srcNumber) {
var txtNumber = '' + srcNumber;
if (isNaN(txtNumber) || txtNumber == "") {
alert("Oops!  That does not appear to be a valid number.  Please try again.");

}
else {
var rxSplit = new RegExp('([0-9])([0-9][0-9][0-9][,.])');
var arrNumber = txtNumber.split('.');
arrNumber[0] += '.';
do {
arrNumber[0] = arrNumber[0].replace(rxSplit, '$1,$2');
} while (rxSplit.test(arrNumber[0]));
if (arrNumber.length > 1) {
return arrNumber.join('');
}
else {
return arrNumber[0].split('.')[0];
      }
   }
}



function isPhoneNumber(theObject) {
var refString = "0123456789+()-.[]ext ";
var checkStr = theObject.value;
var allValid = true;
for (i = 0; i < checkStr.length; i++) {
ch = checkStr.charAt(i);
if (refString.indexOf(ch, 0) == -1) { return (false); }
}
return (true);
}

function isNumericDecimal(theObject) {
var refString = "0123456789.";
var checkStr = theObject.value;
var allValid = true;
for (i = 0; i < checkStr.length; i++) {
ch = checkStr.charAt(i);
if (refString.indexOf(ch, 0) == -1) { return (false); }
}
return (true);
}

function isNumeric(theObject) {
var refString = "0123456789";
var checkStr = theObject.value;
var allValid = true;
for (i = 0; i < checkStr.length; i++) {
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
for (i=0; i<invalidChars.length; i++) {
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


