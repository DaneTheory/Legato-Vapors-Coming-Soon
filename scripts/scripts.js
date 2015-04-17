// CLOCK.JS
function getCountDown(cdate) {
	// Set the unit values in milliseconds.
	var msecPerMinute = 1000 * 60;
	var msecPerHour = msecPerMinute * 60;
	var msecPerDay = msecPerHour * 24;

	// Set a date and get the milliseconds
	var date = new Date();
	var dateMsec = date.getTime();

	// Set the date to January 1, at midnight, of the specified year. 2014,7,20,5,25,30,500

	date = cdate;

	// Get the difference in milliseconds.
	var interval = date.getTime() - dateMsec;

	// Calculate how many days the interval contains. Subtract that
	// many days from the interval to determine the remainder.
	var days = Math.floor(interval / msecPerDay);
	interval = interval - (days * msecPerDay );

	// Calculate the hours, minutes, and seconds.
	var hours = Math.floor(interval / msecPerHour);
	interval = interval - (hours * msecPerHour );

	var minutes = Math.floor(interval / msecPerMinute);
	interval = interval - (minutes * msecPerMinute );

	var seconds = Math.floor(interval / 1000);

	// Display the result.
	//				document.write(days + " days, " + hours + " hours, " + minutes + " minutes, " + seconds + " seconds.");

	return (((days < 10) ? '0' + days : days) + " : " + ((hours < 10) ? '0' + hours : hours) + " : " + ((minutes < 10) ? '0' + minutes : minutes) + " : " + ((seconds < 10) ? '0' + seconds : seconds));
}

function initNumbers() {
	var x = 260;
	var y = 230;
	var d = 215;
	var r = [];
	for ( i = 11; i >= 0; i--) {
		var span = $('<span class="clock-number"></span>');
		span.text(((i == 0) ? 12 : i) + '');
		span.css('left', (x + (d) * Math.cos(1.57 - 30 * i * (Math.PI / 180))) + 'px');
		span.css('top', (y - (d) * Math.sin(1.57 - 30 * i * (Math.PI / 180))) + 'px');
		r.push(span);
	}
	return r;
}

function scaleCoordinates(delta, firstTime) {
	$('#ticker, #timelable, #timeleft, .clock-number').each(function() {
		//Get X,Y,font size

		if(firstTime == false) {
			$(this).css({'left':$(this).data('x'), 'top':$(this).data('y'), 'fontSize' : $(this).data('font')});
		}

		var x = $(this).css('left');
		//-px
		x = x.substr(0, x.length - 2);
		var y = $(this).css('top');
		y = y.substr(0, y.length - 2);
		var fs = $(this).css('font-size');
		fs = fs.substr(0, fs.length - 2);
		//-px
		if(firstTime) {
			$(this).attr({ 'data-x' : x, 'data-y' : y, 'data-font' : fs });
		}
		//-%
		x = +x + Math.round((delta * x) / 555);
		//Set new X
		y = +y + Math.round((delta * y) / 555);
		//Set new Y
		fs = +fs + ((delta * fs) / 555);
		//set new font size %

		//apply new values to attributes
		$(this).css({
			"left" : x + "px",
			"top" : y + "px",
			"font-size" : fs + "px"
		});
	});
}


$(document).ready(function() {
	
	var opts={plate:"#FFFFFF",marks:"#FFFFFF",label:"#FFFFFF",hours:"#FFFFFF",minutes:"#FFFFFF",seconds:"#FFFFFF"};

	SVG('canvas', '100%').clock('100%', '', opts).start();

	var n = initNumbers();
	$('#time-container .numbers-container').append(n);

	$("#canvas").everyTime("1s", function(i) {

		/* Date and time when your site starts to work */

		var c = {
			year : 2015,
			month : 4,
			day : 2,
			hh : 0,
			min : 0,
			sec : 0,
			milsec : 0
		};
		var cd = new Date();
		cd.setYear(c.year);
		cd.setMonth(c.month);
		//month start from 0
		cd.setDate(c.day);
		cd.setHours(c.hh, c.min, c.sec, c.milsec);
		//hh min sec milsec
		$('#timeleft').text(getCountDown(cd));
	});

	//////////////////////////////////////////////////////////////////////////////////////
	var delta = 0;
	var curWidth = $('#time-container').width();
	if (curWidth != null) {
		delta = curWidth - 555;
		scaleCoordinates(delta, true);
	}
	//555 , 450 , 250
	$(window).resize(function() {
		scaleCoordinates($('#time-container').width() - 555, false);
	});
	///////////////////////////////////////////////////////////////////////////////////////

}); 


// MAIN CUSTOM SCRIPTS & API's
(function($) {
	/* ======= Clear Default ====== */
	$.fn.clearDefault = function() {
		"use strict";
		return this.each(function() {
			var default_value = $(this).val();
		});
	};

	/* ======= Height Fix ====== */
	function vertCenter(item) {
		"use strict";
		item.css({
			'margin-top' : '-' + parseInt((item.height() / 2), 0) + 'px'
		}).fadeIn();
	}

	jQuery(window).load(function(){
		vertCenter($('.itemwrap > li > div'));
		vertCenter($('#thumbs'));
		vertCenter($('#clock'));
		vertCenter($('#demo_thumbs'));
	});


	jQuery(document).ready(function($) {
		"use strict";

		$('.form_submit').click(function(){
			var form = $(this).parents('form');
			form.find('.form_item').removeClass('error');
			form.find('.error_block').remove();
			var post_data;
			var errors = formValidation(form),
				output;
			if( Object.keys(errors).length > 0 ) {
				showErrors(form, errors);
			} else {
				if(form.attr('id') == 'contacts_form') {
 					post_data = {
            		    'name'     : $('input[name=name]').val(),
            		    'email'    : $('input[name=email]').val(),
            		    'message'  : $('input[name=message]').val()
            		};

            		//Ajax post data to server
            		jQuery.post('contacts.php', post_data, function(response){	
            		    if(response.type == 'error'){ //load json data from server and output message    
            		        output = '<div class="error_block">'+response.text+'</div>';
            		    } else{
            		        output = '<div class="success">'+response.text+'</div>';
            		        //reset values in all input fields
            		        $("#contacts_form .form_item").val('');
            		    }
            		    form.find('.form_row').slideUp();
            		    form.find("#contact_results").hide().html(output).slideDown();
            		}, 'json');
        		} else {
        			post_data = {
            		    'subscribe_email': $('input[name=subscribe_email]').val(),
            		};
	
            		jQuery.post('subscribe.php', post_data, function(response){	
	        	    	   
        		        output = '<div class="success">'+response.text+'</div>';
        		        //reset values in all input fields
        		        $("#contacts_form .form_item").val('');
        		        form.find('.form_inner').slideUp();
            		    form.find("#form_results").hide().html(output).slideDown();
            		}, 'json');
        		}

		}
		return false;
	});

		$('.side-page').click(function() {
			var curPage = $(this).attr('id');
			$('.main-menu li').removeClass('active');
			$('.main-menu li a[data-page="' + curPage + '"]').parent().addClass('active');
			$('.side-page').removeClass('active').removeClass('went-left').removeClass('went-right');
			$(this).prev().addClass('side-left').addClass('went-left');
			$(this).next().addClass('side-right').addClass('went-right');
			$(this).addClass('active');
		});

		$('.main-menu a:not(.home-link)').click(function() {
			$('#clock').removeClass('active');
			$('.mainarea-content').addClass('active');
			$('.close').addClass('active');
			var curPage = $(this).attr('data-page');
			$('.main-menu li').removeClass('active');
			$(this).parent().addClass('active');
			$('.mainarea-content > div').removeClass('active').removeClass('went-left').removeClass('went-right');
			$('#' + curPage + '').prev().addClass('side-left').addClass('went-left');
			$('#' + curPage + '').next().addClass('side-right').addClass('went-right');
			$('#' + curPage + '').addClass('active');
		});

		$('.close').click(function(e) {
			e.preventDefault();
			$('#clock').addClass('active');
			$('.main-menu li').removeClass('active');
			$('.close').removeClass('active');
			$('.mainarea-content').removeClass('active');
		});

		$('.home-link').click(function(e) {
			e.preventDefault();
			$('#clock').addClass('active');
			$('.main-menu li').removeClass('active');
			$('.close').removeClass('active');
			$('.mainarea-content').removeClass('active');
			$('.home-link').parent().addClass('active');
		});

		$('input[type="text"]').clearDefault();


		$('#tweet_list').cycle({
			fx : 'custom',
			cssBefore : {
				top : 50,
				height : 100,
				opacity : 0,
				display : 'block'
			},
			animIn : {
				top : 0,
				opacity : 1
			},
			animOut : {
				opacity : 0,
				top : -50
			},
			cssAfter : {
				zIndex : 0,
				display : 'none'
			},
			speed : 1750,
			sync : false,
			easeIn : 'easeOutBack',
			easeOut : 'easeInBack'
		});
	});
	
	function resizeStuff() {
		vertCenter($('.itemwrap > li > div'));
		vertCenter($('#thumbs'));
		vertCenter($('#clock'));
	}
	var onSmartResize = false;

	$(window).resize(function(){
		if(onSmartResize !== false)
			clearTimeout(onSmartResize);
		onSmartResize = setTimeout( function(){resizeStuff() }, 200); //200 is time in miliseconds
	});

})(jQuery);



/* Forms Validation */
function formValidation(form) {

	var error = {};

	if(form) {
		form.find('.form_item').each(function(){
			var $th = $(this);

			if( $th.val() != '' ) {
				if( $th.attr('type') == 'email' ) {
					var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
					if( !emailReg.test( jQuery.trim($th.val()) ) ) {
						error[$th.attr('id')] = 'not_email';
					}
				}
			} else {				
				error[$th.attr('id')] = 'empty';
			}

		});
	}
	return error;
}

/* Validation Errors */
function showErrors(form, errors) {
	var error_message = ''
	for(var i in errors) {
		var form_item = form.find($('#'+i)),
			form_item_name = form_item.attr('placeholder');

		form_item.addClass('error');
		if( errors[i] == 'empty' )
			error_message += '<div class="error">Field '+form_item_name+' is required</div>';
		else
			error_message += '<div class="error">You entered an invalid email</div>';
	}
	if( form.find('.error_block').length > 0) {
		form.find('.error_block').html(error_message);
	} else {
		form.append('<div class="error_block">'+error_message+'</div>');
	}
};

// PARALLAX ELEMENTS
$(document).ready( function(){
	
	$('.singlecolor').plaxify({"xRange":5,"yRange":5,"invert":false});
	$('#logoLarge').plaxify({"xRange":10,"yRange":6,"invert":false});
	$('.mainarea').plaxify({"xRange":8,"yRange":8,"invert":false});
	$('#subscribe').plaxify({"xRange":6,"yRange":3,"invert":true});
	$('.main-menu-container').plaxify({"xRange":14,"yRange":14,"invert":true});
	$('.social-container').plaxify({"xRange":15,"yRange":16,"invert":true});
	$('.twitter-container').plaxify({"xRange":15,"yRange":20,"invert":true});
	$.plax.enable();

});


$(document).ready( function(){

	$('.show_toggle').click( function(event){
	 
	 	var trigger = $(this);
	 
	 		if( trigger.hasClass("toggleMenu")){
	 				trigger.removeClass("toggleMenu");
	 				
	 				$('.main-menu').stop(true,true).animate({marginLeft: '100%'}, 10);
	 				
	 				
	 			
	 			} else {
		 			
	 			trigger.addClass("toggleMenu");
	 			
	 				
	 				$('.main-menu').stop(true,true).animate({marginLeft: '-10%'}, 10);
	 			
	 			} 
	 			
	 			
	 			if( trigger.hasClass("toggleMenu")) {
		 			
		 			trigger.removeClass("toggleMenu");
		 			
	 				$(".main-menu-container a").click(function(){
		 				
	 					$('.main-menu').stop(true,true).animate({marginLeft: '100%'}, 10)
	 				});
	 			}
	 		});
 		
 });
