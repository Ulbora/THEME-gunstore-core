var fflNeeded = false;
var ranCookie = 0;
var secureUrl = "";
//var invoice = "";
function checkFFL(txt) {
	ranCookie = new Date().getTime();
	//console.log(txt)
	if (txt !== undefined && txt !== null) {
		if (txt.includes("FFL")) {
			fflNeeded = true;
			console.log("contians a firearm");
		}
	}
}
function setSecureUrl(val) {
	secureUrl = val;
}

// function setInvoice(val){
// 	invoice = val;
// }

function containsFirearms() {
	setInterval(function () {
		if (fflNeeded) {
			document.getElementById("showFFL").style.display = "block";
		}
	}, 2000);
}

function getFFL() {
	console.log("getting ffl");
	var zip = document.getElementById("ffl_zip").value;
	console.log("zip: " + zip)
	$('#ffl_list')
		.find('option')
		.remove()
		.end()
		;
	$.ajax({
		url: 'http://localhost:8070/dcart/rs/ffllist/' + zip,
		//url: 'http://localhost:8070/dcart/rs/ffllist/30132',
		headers: {
			'SecureURL': secureUrl
		},
		method: 'GET',
		//dataType: 'json',
		//data: YourData,
		success: function (data) {
			console.log('success: ' + JSON.stringify(data));
			var $dropdown = $("#ffl_list");
			$dropdown.append($("<option />").text("Select FFL"));
			$.each(data, function () {
				$dropdown.append($("<option />").val(this.id).text(this.businessName + " - " + this.premiseStreet + ", " + this.premiseCity + ", " + this.premiseState + " " + this.premiseZipCode));
				// document.getElementById("showFflButton").style.display = "block";
			});
			document.getElementById("selectFFL").style.display = "block";
		},
		error: function (XMLHttpRequest, textStatus, errorThrown) {
			//alert(textStatus, errorThrown);
			console.log(textStatus + errorThrown)
		}
	});
}

function useThisFFL() {
	var selectedFFL = $("#ffl_list option:selected").text();
	var fflId = $("#ffl_list option:selected").val();
	document.getElementById("useThisFFL").style.display = "block";
	document.getElementById("useFFL").value = selectedFFL;
	console.log("selected ffl will be added to cookie: " + selectedFFL);
	console.log("selected ffl id will be added to cookie: " + fflId);

	// set cookie	
	//document.cookie = "FFLChosen" + ranCookie + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT"

	document.cookie = "FFLChosen" + ranCookie + "=" + fflId + ";max-age=3600"
	// var d = new Date;
	// d.setTime(d.getTime() + 24 * 60 * 60 * 1000 * 365);
	// document.cookie = "FFLChosen" + "=" + fflId + ";path=/;expires=" + d.toGMTString();
	//var cstr = '/(?:(?:^|.*;\s*)FFLChosen' + ranCookie + '\\s*\=\s*([^;]*).*$)|^.*$/'
	var name = "FFLChosen"	+ ranCookie;	
	//var name = "FFLChosen";
	var cookieValue = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
	var cval = cookieValue ? cookieValue[2] : null;
	console.log("cooke value:" + cval);
}

function setFFLAddress(inv) {
	var invoice = "";
	invoice = inv;
	var ca = document.cookie.split(';');
	var ffl = "";
	for(var i = (ca.length-1); i > 0; i--) {
		var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
		}
		if (c.indexOf("FFLChosen") == 0) {
			ci = c.indexOf("=");
			ci++;
			ffl= c.substr(ci);
			break;
		}
	}
	console.log("ffl=" + ffl);
	// var name = "FFLChosen";//	+ ranCookie;	
	// var cookieValue = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
	// var cval = cookieValue ? cookieValue[2] : null;
	//console.log("cookie value to use in address:" + cval);
	//console.log("invoice: " + val)

	var rbody = {}
	rbody.fflId = ffl
	rbody.invoice = invoice;
	
	$.ajax({
		url: 'http://localhost:8070/dcart/rs/shipment',			
		headers: {
			'SecureURL': 'sandbox-ulboralabs-com.3dcartstores.com',
			'Content-Type': 'application/json'
		},
		method: 'POST',
		dataType: 'json',
		data: JSON.stringify(rbody),
		success: function (data) {
			console.log('success: ' + JSON.stringify(data));
			//var $dropdown = $("#ffl_list");
			//$dropdown.append($("<option />").text("Select FFL"));
			// $.each(data, function () {
			// 	$dropdown.append($("<option />").val(this.id).text(this.businessName + " - " + this.premiseStreet + ", " + this.premiseCity + ", " + this.premiseState + " " + this.premiseZipCode));
			// 	// document.getElementById("showFflButton").style.display = "block";
			// });
			//document.getElementById("selectFFL").style.display = "block";
		},
		error: function (XMLHttpRequest, textStatus, errorThrown) {
			//alert(textStatus, errorThrown);
			console.log(textStatus + errorThrown)
		}
	});
}

	// function showSelect(){
	// 	document.getElementById("selectFFL").style.display = "block";
	// }