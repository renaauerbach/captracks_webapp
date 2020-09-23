// Handle Form POST Without Redirecting
(function($) {
    'use strict';

    // ========== STORE DETAILS ========== //
    // Edit Store Details
    $('.store').on('submit', function(e) {
        e.preventDefault();
        submitted(this);
    });

    // ========== STORE LINKS ========== //
    // Add Store Link
    $('.link').on('submit', function(e) {
        e.preventDefault();
        submitted(this);
    });

    // Remove Store Link
    $('#remove-link').on('click', () => {
        $('.delete-link').submit((e) => {
            e.preventDefault();
            submitted(this);
        });
    });

    // ========== CAPACITY ========== //
    // Update Store Capacity
    $('.capacity').on('submit', function(e) {
        e.preventDefault();
        submitted(this);
    });

    // ========== FORUM ========== //
    // Add Forum Post
    $('.forum').on('submit', function(e) {
        e.preventDefault();
        submitted(this, () => {
            $('.result').addClass('forum-box info-box');
            $('.result').html(data);
        });
    });

    // Remove Forum Post
    $('.delete-forum').on('submit', function(e) {
        e.preventDefault();
        submitted(this);
    });

    // ========== CONTACT ========== //
    // Contact Form
    $('#send-msg').on('click', () => {
        $('.contact').submit(function(e) {
            e.preventDefault();
            submitted(this);
        });
        $('.contact').hide();
        $('#success').removeClass('unsent').addClass('sent');
    });

    function submitted(e, success) {
        $.ajax({
            type: 'POST',
            url: $(e).attr('action'),
            data: $(e).serialize(), // serializes the form's elements
            dataType: 'html',
            success: success ? success : () => { },
        });
    }

})(jQuery);
