$(document).ready(function($) {


	//	ul dropdown

	$( ".dropdown" ).selectmenu();

	//	datepicker
	$( ".datepicker" ).datepicker();

	//	Header js

	// var win      = $(window),
	//     header     = $('.main-header'),
	//     eloffset = header.offset().top;

	// win.scroll(function() {
	//     if (eloffset < win.scrollTop()) {
	//         header.addClass("active");
	//     } else {
	//         header.removeClass("active");
	//     }
	// });
	

	//		All service grid IsoTope

	var $grid = $('.grid_body').isotope({
	  itemSelector: '.item',
	  layoutMode: 'fitRows',
	  getSortData: {
	    name: '.name',
	    symbol: '.symbol',
	    number: '.number parseInt',
	    category: '[data-category]',
	    weight: function( itemElem ) {
	      var weight = $( itemElem ).find('.weight').text();
	      return parseFloat( weight.replace( /[\(\)]/g, '') );
	    }
	  }
	});

	// filter functions
	var filterFns = {
	  // show if number is greater than 50
	  numberGreaterThan50: function() {
	    var number = $(this).find('.number').text();
	    return parseInt( number, 10 ) > 50;
	  },
	  // show if name ends with -ium
	  ium: function() {
	    var name = $(this).find('.name').text();
	    return name.match( /ium$/ );
	  }
	};

	// bind filter button click
	$('#filters').on( 'click', 'li', function() {
	  var filterValue = $( this ).attr('data-filter');
	  // use filterFn if matches value
	  filterValue = filterFns[ filterValue ] || filterValue;
	  $grid.isotope({ filter: filterValue });

	});


	//		all course tabs
	
	$('#filters li').click(function(e) {

	    $('#filters li').removeClass('active');

	    var $this = $(this);
	    if (!$this.hasClass('active')) {
	        $this.addClass('active');
	    }
	    //e.preventDefault();
	});


	//		profile-scroll top and slide-down
	$('.box-title').click(function(event) {
		
		$(this).parent().find('.box-body.slide').slideToggle( "slow", function(){
			if ($(this).is(":visible")) { //Check to see if element is visible then scroll to it
				$('html,body').animate({ //animate the scroll
					scrollTop: $(this).offset().top -134// the - 25 is to stop the scroll 25px above the element
				}, "slow")
			}
			$(this).parent().find(".mdi-chevron-up").stop().toggleClass('active');
		});
		return false;
	});

	$('.slider').slick({
	  dots: true,
	  infinite: true,
	  speed: 300
	});

	$('.slider_course').slick({
	  dots: true,
	  speed: 300,
	  slidesToShow: 4,
	  slidesToScroll: 4,
	  responsive: [
	    {
	      breakpoint: 1024,
	      settings: {
	        slidesToShow: 3,
	        slidesToScroll: 3,
	        infinite: true,
	        dots: true
	      }
	    },
	    {
	      breakpoint: 640,
	      settings: {
	        slidesToShow: 2,
	        slidesToScroll: 2
	      }
	    },
	    {
	      breakpoint: 480,
	      settings: {
	        slidesToShow: 1,
	        slidesToScroll: 1
	      }
	    }
	    // You can unslick at a given breakpoint now by adding:
	    // settings: "unslick"
	    // instead of a settings object
	  ]
	});


});