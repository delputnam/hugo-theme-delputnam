var $allVideos,
	$fluidEl;

function windowPopup(url, width, height) {
  // Calculate the position of the popup so
  // it’s centered on the screen.
  var left = (screen.width / 2) - (width / 2),
      top = (screen.height / 2) - (height / 2);

  window.open(
    url,
    "",
    "menubar=no,toolbar=no,resizable=yes,scrollbars=yes,width=" + width + ",height=" + height + ",top=" + top + ",left=" + left
  );
}

var jsSocialShares = document.querySelectorAll(".js-social-share");
if (jsSocialShares) {
  [].forEach.call(jsSocialShares, function(anchor) {
    anchor.addEventListener("click", function(e) {
      e.preventDefault();

      windowPopup(this.href, 500, 300);
    });
  });
}

function initVideoSize() {	
	$allVideos = $("iframe[src*='//player.vimeo.com'], iframe[src*='//www.youtube.com'], object, embed, .video-thumbnail");
	$fluidEl = $(".video-player").first();

	$allVideos.each(function() {
		$(this)
			// jQuery .data does not work on object/embed elements
			.attr('data-aspectRatio', this.height / this.width)
			.removeAttr('height')
			.removeAttr('width');

	});
}

function updateVideoSize() {
	var newWidth = $fluidEl.width();
	$allVideos.each(function() {
  
		var $el = $(this);
		$el
			.width(newWidth)
			.height(newWidth * $el.attr('data-aspectRatio'));
  
	});
}

$(document).ready(function () {

	$('[data-toggle="show-menu"]').click(function () {
		$('.off-canvas-wrap').toggleClass('active');
	});

	$fluidEl = $(".video-player").first();
	
	initVideoSize();	    	

	$(window).resize(function() {
		updateVideoSize();
	}).resize();

	$(".footnote-ref").each(
		function(){

			var fnid = null,
				fntext = '',
				fnreftext = '',
				$fnel = null;

			fnrefid = this.id;
			fnrefid = fnrefid.replace(/:/g, "\\:");
			fnid = fnrefid.replace("fnref","fn");
			
			fntext = $('#' + fnid).html();
			fntext = fntext.replace(" [return]", "");
			fntext = fntext.replace(/<a class="footnote-return" href=".*"><sup>\[return\]<\/sup><\/a>/g, "");

			$('#' + fnrefid + ' a').attr('data-toggle', 'popover');
			$('#' + fnrefid + ' a').attr('data-content', fntext);
			$('#' + fnrefid + ' a').attr('tabindex', '0');
	});

	$('[data-toggle="tooltip"]').tooltip();
	$('[data-toggle="popover"]').popover({
		trigger: 'focus',
		placement: 'top',
		html: true
	});

	$('[data-toggle="popover"]').click(false);
});

