$(document).ready(function($) {

	var win      = $(window),
	    header     = $('.burger-menu'),
	    eloffset = header.offset().top;

	win.scroll(function() {
	    if (eloffset < win.scrollTop()) {
	        header.addClass("scroll");
	    } else {
	        header.removeClass("scroll");
	    }
	});

	$("#sub-nav").mouseenter(function(event) {
		$(".sub-nav").show();
	});
	$(".sub-nav").mouseleave(function(event) {
		$(this).hide();
	});

	$('.hamburger').click(function(){
		$('.viewport').toggleClass('view-slide');
		$('.burger-menu').toggleClass('open');
	});

	$( "#menu" ).menu();
});