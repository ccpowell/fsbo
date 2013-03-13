$(document).ready(function () {
		$('#priceSlider').slider({
				min: minPriceLimit,
				max: maxPriceLimit + priceInterval,
				step: priceInterval,
				range: true,
				values: [currMinPrice, currMaxPrice]
		}).bind('slide slidechange', function(e, ui) {
			if($(ui.handle).attr('id') == 'pricehandle1') {
					if($('#minPrice').val() == ui.value) {
							return;
					}
					$('#minPrice').val(ui.value);
					if(ui.value == 0) {
							$('#minPriceDisplay').text('No Minimum');
					}
					else if(ui.value > maxPriceLimit) {
							$('#minPriceDisplay').text('No Maximum');
					}
					else {
							$('#minPriceDisplay').text(moneyFormat(ui.value));
					}
			}
			else if($(ui.handle).attr('id') == 'pricehandle2') {
					if($('#maxPrice').val() == ui.value) {
							return;
					}
					$('#maxPrice').val(ui.value);
					if(ui.value == 0) {
							$('#maxPriceDisplay').text('No Minimum');
					}
					else if(ui.value > maxPriceLimit) {
							$('#maxPriceDisplay').text('No Maximum');
					}
					else {
							$('#maxPriceDisplay').text(moneyFormat(ui.value));
					}
			}
		});

		$('#bedsSlider').slider({
				min: 0,
				max: minBeds.length-1,
				step: 1,
				value: currMinBedKey
		}).bind('slide slidechange', function(e, ui) {
				//This is an optimization, mainly for IE6 because it tends to fire
				//this function much more often than other browsers. So we only
				//edit the value when it has actually changed.
				if($('#minBed').val() == minBeds[ui.value]) {
						return;
				}

				$('#minBed').val(minBeds[ui.value]);
				if(ui.value == 0) {
						$('#minBedDisplay').text('Any');
				}
				else {
						$('#minBedDisplay').text(minBeds[ui.value] + '+');
				}
		});

		$('#bathsSlider').slider({
				min: 0,
				max: minBaths.length-1,
				step: 1,
				value: currMinBathKey
		}).bind('slide slidechange', function(e, ui) {
				//This is an optimization, mainly for IE6 because it tends to fire
				//this function much more often than other browsers. So we only
				//edit the value when it has actually changed.
				if($('#minBath').val() == minBaths[ui.value]) {
						return;
				}

				$('#minBath').val(minBaths[ui.value]);
				if(ui.value == 0) {
						$('#minBathDisplay').text('Any');
				}
				else {
						$('#minBathDisplay').text(minBaths[ui.value] + '+');
				}
		});

		if ($('#moreOptionsLink').hasClass("moreOptionsOn")) {
				applyAdvancedSliders();
		}

		$('#propSelectAll').click(function() {
				$(".propTypeList input").each(function() {
						this.checked = "checked";
				});
				return false;
		});

		$('#propDeselectAll').click(function() {
				$(".propTypeList input").each(function() {
						this.checked = "";
				});
				return false;
		});

		$('#moreOptionsLink').click(function () {
				$('#moreOptionsLink').toggleClass("moreOptions");
				$('#moreOptionsLink').toggleClass("moreOptionsOn");
				//Firefox displays the amenities scroll bar immediately, so we hide the
				//amenities box and bring it back when animation is done
				$('#searchOptions').slideToggle();
				applyAdvancedSliders();
				return false;
		});

		$('.ssLink').click(function() {
				var searchQueryPre = $(this).attr('href');
				var searchQuery = $('#searchToolsForm').serialize();
				$(this).attr('href',searchQueryPre + searchQuery);
				return true;
		});

		$('.reset').click(function() {
				$('#szLocation').val('');
				$('#szLocation').focus();
				$('#priceSlider').slider('values', [minPriceLimit, maxPriceLimit + priceInterval]);
				$('#bedsSlider').slider('value', 0);
				$('#bathsSlider').slider('value', 0);

				if ($('#sqFtSlider:visible').length) {
					$('#sqFtSlider').slider('values', [minSqFtLimit, maxSqFtLimit + sqFtInterval]);
				}
				if ($('#acreSlider:visible').length) {
					$('#acreSlider').slider('values', [0, acres.length-1]);
				}
				$("input[name='iHasPhoto']").each(function() {$(this).attr('checked', '')});
				$("input[name='rgPropTypes[]']").each(function() {$(this).attr('checked', 'checked')});
				$("input[name='hasOpenHouse']").each(function() {$(this).attr('checked', '')});
				$("input[name='iAmenityID[]']").each(function() {$(this).attr('checked', '')});
				$("input[name='iRadius']").each(function() {$(this).val(['20'])});
		});

});

function applyAdvancedSliders() {
		if (typeof sqFtSlidersApplied == 'undefined') {
				$('#sqFtSlider').slider({
						min: minSqFtLimit,
						max: maxSqFtLimit + sqFtInterval,
						step: sqFtInterval,
						values: [currMinSqFt, currMaxSqFt],
						range: true
				}).bind('slide slidechange', function(e, ui) {
							if($(ui.handle).attr('id') == 'sqFtHandle1') {
								if($('#minSqFt').val() == ui.value) {
										return;
								}
								$('#minSqFt').val(ui.value);
								if(ui.value == 0) {
										$('#minSqFtDisplay').text('No Minimum');
								}
								else if(ui.value > maxSqFtLimit) {
										$('#minSqFtDisplay').text('No Maximum');
								}
								else {
										$('#minSqFtDisplay').text(sqFtFormat(ui.value));
								}
						}
						else if($(ui.handle).attr('id')== 'sqFtHandle2') {
								if($('#maxSqFt').val() == ui.value) {
										return;
								}
								$('#maxSqFt').val(ui.value);
								if(ui.value == 0) {
										$('#maxSqFtDisplay').text('No Minimum');
								}
								else if(ui.value > maxSqFtLimit) {
										$('#maxSqFtDisplay').text('No Maximum');
								}
								else {
										$('#maxSqFtDisplay').text(sqFtFormat(ui.value));
								}
						}
				});
				sqFtSlidersApplied = true;
		}

		if (typeof acreSlidersApplied == 'undefined') {
				$('#acreSlider').slider({
						min: 0,
						max: acres.length-1,
						step: 1,
						values: [currMinAcreKey, currMaxAcreKey],
						range: true
				}).bind('slide slidechange', function(e, ui) {
						if($(ui.handle).attr('id') == 'acreHandle1') {
								if($('#minAcre').val() == acres[ui.value]) {
										return;
								}
								$('#minAcre').val(acres[ui.value]);
								if(ui.value == 0) {
										$('#minAcreDisplay').text('No Minimum');
								}
								else if(ui.value == acres.length-1) {
										$('#minAcreDisplay').text('No Maximum');
								}
								else {
										var acreText = ' acre';
										if(acres[ui.value] > 1) {
												acreText += 's';
										}
										$('#minAcreDisplay').text(acres[ui.value] + acreText);
								}
						}
						else if($(ui.handle).attr('id')== 'acreHandle2') {
								if($('#maxAcre').val() == acres[ui.value]) {
										return;
								}
								$('#maxAcre').val(acres[ui.value]);
								if(ui.value == 0) {
										$('#maxAcreDisplay').text('No Minimum');
								}
								else if(ui.value == acres.length-1) {
										$('#maxAcreDisplay').text('No Maximum');
								}
								else {
										var acreText = ' acre';
										if(acres[ui.value] > 1) {
												acreText += 's';
										}
										$('#maxAcreDisplay').text(acres[ui.value] + acreText);
								}
						}
				});
				acreSlidersApplied = true;
		}
}

function alterQueryString(varArray) {
		$('.searchQuery').each(function() {
				queryString = $(this).attr('href');
				for(i in varArray) {
						varName = i;
						varValue = varArray[i];
						pattern = new RegExp(varName +"=.*?(?=&|$)");
						if(queryString.search(pattern) == -1) {
								queryString = queryString + "&" + varName + "=" + varValue;
						}
						else {
								queryString = queryString.replace(pattern, varName + "=" + varValue);
						}
				}
				$(this).attr('href', queryString);
		});
}

function moneyFormat(num) {
		var numStr = "" + num;
		var dec = numStr.indexOf(".");
		var end = ((dec > -1) ? "" + numStr.substring(dec, numStr.length) : "");
		numStr = "" + parseInt(numStr);

		var count = 0;
		var temp1 = "";
		var temp2 = "";
		for (var k = numStr.length-1; k >= 0; k--) {
				var oneChar = numStr.charAt(k);
				if(count == 3) {
						temp1 += ",";
						temp1 += oneChar;
						count = 1;
						continue
				}
				else {
						temp1 += oneChar;
						count++;
				}
		}

		for (var k = temp1.length-1; k >= 0; k--) {
				var oneChar = temp1.charAt(k);
				temp2 += oneChar;
		}

		temp2 = "$" + temp2 + end;
		return temp2;
}

function sqFtFormat(num) {
		var numStr = "" + num;
		var dec = numStr.indexOf(".");
		var end = ((dec > -1) ? "" + numStr.substring(dec, numStr.length) : "");
		numStr = "" + parseInt(numStr);

		var count = 0;
		var temp1 = "";
		var temp2 = "";
		for (var k = numStr.length-1; k >= 0; k--) {
				var oneChar = numStr.charAt(k);
				if(count == 3) {
						temp1 += ",";
						temp1 += oneChar;
						count = 1;
						continue
				}
				else {
						temp1 += oneChar;
						count++;
				}
		}

		for (var k = temp1.length-1; k >= 0; k--) {
				var oneChar = temp1.charAt(k);
				temp2 += oneChar;
		}

		temp2 = temp2 + end + " sq ft";
		return temp2;
}
