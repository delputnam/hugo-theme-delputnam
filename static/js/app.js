$(document).ready(function () {

	$('[data-toggle="show-menu"]').click(function () {
		$('.off-canvas-wrap').toggleClass('active');
	});

	var $allVideos = $("iframe[src*='//player.vimeo.com'], iframe[src*='//www.youtube.com'], object, embed"),
	$fluidEl = $(".video-player");
	    	
	$allVideos.each(function() {

		$(this)
			// jQuery .data does not work on object/embed elements
			.attr('data-aspectRatio', this.height / this.width)
			.removeAttr('height')
			.removeAttr('width');

	});

	$(window).resize(function() {

		var newWidth = $fluidEl.width();
		$allVideos.each(function() {
	  
			var $el = $(this);
			$el
				.width(newWidth)
				.height(newWidth * $el.attr('data-aspectRatio'));
	  
	  });

	}).resize();
});