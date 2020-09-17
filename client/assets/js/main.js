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

    /* ===== Dropdown Navbar ===== */
    $('.dropbtn').on('click', function() {
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

    /* ===== Store Details Sidepanel ===== */
    $('.btn-expand-collapse').click(function() {
        $('.store-details').toggleClass('collapsed');
        if ($('.store-details').hasClass('collapsed')) {
            $(this).children(0).children().removeClass('fa-angle-up').addClass('fa-angle-down');
        }
        else {
            $(this).children(0).children().removeClass('fa-angle-down').addClass('fa-angle-up');
        }
    });

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

    /* ===== Add Store Link ===== */
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

})(jQuery);