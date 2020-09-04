(function($) {
    'use strict';

    /* ===== Mobile Navbar ===== */
    $('.navbar-toggler').on('click', function() {
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

    // /* ===== Form Popup ===== */
    // $('.form-toggler').on('click', function() {
    //     $('.form-popup').toggleClass('open');
    // });

    // $('.form-container .close-btn').on('click', function() {
    //     $('.form-popup').removeClass('open');
    // });

    /* ===== Edit Store Details ===== */
    $('#edit').click(function() {
        $(this).hide();
        $('#save').show();
        $('.edit').removeClass('edit').addClass('view');
        $('.saved').removeClass('saved').addClass('edit');
    });

    $('#save').click(function() {
        $('.store-form').submit();
        $(this).hide();
        $('#edit').show();
        $('.edit').removeClass('edit').addClass('saved');
        $('.view').removeClass('view').addClass('edit');
    });

    /* ===== Edit Store Details ===== */
    $('#add').click(function() {
        $(this).hide();
        $('#check').show();
        $('#cancel').show();
        $('.hide-link').removeClass('hide-link').addClass('show');
    });

    $('#check').click(function() {
        $('.link-form').submit();
        $(this).hide();
        $('#cancel').hide();
        $('#add').show();
        $('.show').removeClass('show').addClass('hide-link');
    });

    $('#cancel').click(function() {
        $(this).hide();
        $('#check').hide();
        $('#add').show();
        $('.show').removeClass('show').addClass('hide-link');
    });

    /* ===== Hide Contact Form on Submit ===== */
    $('#send-msg').click(() => {
        $('#contact').submit(e => {
            // Stop page refresh
            e.preventDefault();
        });
        $('#contact').hide();
        $('#success').removeClass('unsent').addClass('sent');
    });

})(jQuery);