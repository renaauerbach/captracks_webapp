// Handle Form POST without Redirecting

(function($) {
    'use strict';

    $('#send-msg').click((e) => {
        e.preventDefault();

        $.ajax
            ({
                type: 'POST',
                url: $(this).attr('action'),
                data: $("#contact").serialize(), // serializes the form's elements.
                success: () => {
                    $('#contact').hide();
                    $('#success').removeClass('unsent').addClass('sent');
                }
            });
    });


    // $(document).ready(function() {

    //     $('#test-form').on('submit', function(e) {
    //         e.preventDefault();

    //         $.ajax({
    //             type: $(this).attr('method'),
    //             url: $(this).attr('action'),
    //             data: $(this).serialize(),
    //             success: function(data) {
    //                 $('#ajax-response').html(data);
    //             }
    //         });

    //     });

    // });


})(jQuery);