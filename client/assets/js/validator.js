(function() {
    'use strict';
    window.addEventListener(
        'load',
        function() {
            // Fetch all the forms we want to apply custom Bootstrap validation styles to
            var forms = document.getElementsByClassName('needs-validation');
            var validation = Array.prototype.filter.call(forms, function(form) {
                form.addEventListener(
                    'submit',
                    function(event) {
                        if (form.checkValidity() === false) {
                            event.preventDefault();
                            event.stopPropagation();
                        }
                        form.classList.add('was-validated');
                    },
                    false
                );
            });
        },
        false
    );
})();


var password = document.getElementById('password');
// document.getElementById('confirmed').onChange = (e) => {
//     validate(this, e);
// };

// Check password and confirmed password match

// Check why phone formatting not working on register user

// Reguire difficult password


