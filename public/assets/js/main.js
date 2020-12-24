(function ($) {
	('use strict');

	/* ===== Mobile Navbar ===== */
	$('.navbar-toggler').on('click', function () {
		$(this).toggleClass('active');
	});

	$('.navbar-nav a').on('click', () => {
		$('.navbar-toggler').removeClass('active');
	});

	// Close navbar-collapse when clicked
	$('.navbar-nav a').on('click', () => {
		$('.navbar-collapse').removeClass('show');
	});

	/* ===== Stick Navbar ===== */
	$(window).on('scroll', () => {
		const scroll = $(window).scrollTop();
		if (scroll < 10) {
			$('.navigation').removeClass('sticky');
		} else {
			$('.navigation').addClass('sticky');
		}
	});

	/* ===== Dropdown Navbar ===== */
	$('.dropbtn').on('click', function () {
		const dropdown = $(this).parent().parent();
		dropdown.toggleClass('show');
	});

	// /* ===== Form Popup ===== */
	// $('.form-toggler').on('click', function() {
	//     $('.form-popup').toggleClass('open');
	// });

	// $('.form-container .close-btn').on('click', function() {
	//     $('.form-popup').removeClass('open');
	// });

	/* ===== Map Key Panel ===== */
	// if ($('.map-key')) {
	//     $('.btn-expand-collapse').click(function() {
	//         $('.map-key').toggleClass('collapsed');
	//         if ($('.map-key').hasClass('collapsed')) {
	//             console.log($(this).children(0).children());
	//             $(this)
	//                 .children(0)
	//                 .children()
	//                 .removeClass('fa-angle-up')
	//                 .addClass('fa-angle-down');
	//         } else {
	//             $(this)
	//                 .children(0)
	//                 .children()
	//                 .removeClass('fa-angle-down')
	//                 .addClass('fa-angle-up');
	//         }
	//     });
	// }

	/* ===== Store Details Sidepanel ===== */
	if ($('.store-details')) {
		$('.btn-expand-collapse').click(function () {
			$('.store-details').toggleClass('collapsed');
			if ($('.store-details').hasClass('collapsed')) {
				$(this)
					.children(0)
					.children()
					.removeClass('fa-angle-up')
					.addClass('fa-angle-down');
			} else {
				$(this)
					.children(0)
					.children()
					.removeClass('fa-angle-down')
					.addClass('fa-angle-up');
			}
		});
	}

	/* ===== Edit Store Details ===== */
	$('#edit').click(function () {
		$(this).hide();
		$('#save').show();
		$('.edit').removeClass('edit').addClass('view');
		$('.saved').removeClass('saved').addClass('edit');
	});

	$('#save').click(function () {
		$('.store-form').submit();
		$(this).hide();
		$('#edit').show();
		$('.edit').removeClass('edit').addClass('saved');
		$('.view').removeClass('view').addClass('edit');
	});

	/* ===== Add Store Link ===== */
	$('#add').click(function () {
		$('#check').show();
		$('#cancel').show();
		$('.hide-link').removeClass('hide-link').addClass('show');
	});

	$('#check').click(function () {
		$('.link').submit();
		$(this).hide();
		$('#cancel').hide();
		$('#add').show();
		$('.show').removeClass('show').addClass('hide-link');
	});

	$('#cancel').click(function () {
		$(this).hide();
		$('#check').hide();
		$('#add').show();
		$('.show').removeClass('show').addClass('hide-link');
	});

	/* ===== Capacity Progress Bar (Store Page) ===== */
	if ($('.cap-progress')) {
		var capacity = $('.cap-bar').text().split(' ')[0];

		// Set width of progress bar as capacity
		capacity == 0
			? $('.cap-bar').width('1%')
			: $('.cap-bar').width(capacity);

		// Convert capacity to integer
		var val = parseInt(capacity);

		// Set color of progress bar
		// Green = capacity < 50%
		// Yellow = capacity between 50-80%
		// Red = capacity > 80% capacity
		let color =
			val < 50 ? '#009900' : val > 50 && val < 80 ? '#fff500' : '#fa2043';
		$('.cap-bar').css('background-color', color);
	}
})(jQuery);
