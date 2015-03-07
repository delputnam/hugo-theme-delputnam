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

	$(".footnote-ref").each(
		function(){

			var fnid = null,
				fntext = '',
				$fnel = null;

			fnrefid = this.id;
			fnrefid = fnrefid.replace(/:/g, "\\:");
			fnid = fnrefid.replace("fnref","fn");

			console.log('fnid: '+fnid);
			
			fntext = $('#' + fnid).text();
			console.log('fntext: '+fntext);

			$('#' + fnrefid + ' a').attr('data-toggle', 'popover');
			$('#' + fnrefid + ' a').attr('data-content', fntext);
	});

	$('[data-toggle="tooltip"]').tooltip();
	$('[data-toggle="popover"]').popover({
		trigger: "click",
		placement: "top"
	});
	$('a[data-toggle="popover"]').click(false);
});

//<a tabindex="0" href="#" data-toggle="popover" data-content="Vestibulum id ligula porta felis euismod semper. Donec ullamcorper nulla non metus auctor fringilla.">1</a>

