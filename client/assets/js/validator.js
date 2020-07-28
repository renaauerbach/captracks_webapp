const form = document.querySelector('.signup');
var password = document.getElementById('password');
var confirmed = document.getElementById('confirmed');

var reqs = document.querySelectorAll('.reqs');
// 0: At least 1 UPPERCASE letter
// 1: At least 1 lowercase Letter
// 2: At least 1 Number
// 3: At least 1 Special Character
// 4: At least 8 characters in length

// Check strong password
const passwordReqs = e => {
    console.log(e);
    var upper = /[A-Z]/g;
    var lower = /[a-z]/g;
    var num = /[0-9]/g;
    var special = /[~!#$%\^&*+=\-\[\]\\;/{}|\\:<>\?]/g;

    if (e.target.value.match(upper)) {
        reqs[0].classList.remove("invalid");
        reqs[0].classList.add("valid");
    }
    else {
        reqs[0].classList.remove("valid");
        reqs[0].classList.add("invalid");
    }
    if (e.target.value.match(lower)) {
        reqs[1].classList.remove("invalid");
        reqs[1].classList.add("valid");
    }
    else {
        reqs[1].classList.remove("valid");
        reqs[1].classList.add("invalid");
    }
    if (e.target.value.match(num)) {
        reqs[2].classList.remove("invalid");
        reqs[2].classList.add("valid");
    }
    else {
        reqs[2].classList.remove("valid");
        reqs[2].classList.add("invalid");
    }
    if (e.target.value.match(special)) {
        reqs[3].classList.remove("invalid");
        reqs[3].classList.add("valid");
    }
    else {
        reqs[3].classList.remove("valid");
        reqs[3].classList.add("invalid");
    }
    if (e.target.value.length >= 8) {
        reqs[4].classList.remove("invalid");
        reqs[4].classList.add("valid");
    }
    else {
        reqs[4].classList.remove("valid");
        reqs[4].classList.add("invalid");
    }
} 

password.addEventListener('keyup', passwordReqs);

// Check passwords on submit
form.addEventListener('submit', e => {
    // Check is password and confirm match 
    if (password.value !== confirmed.value) {
        e.preventDefault();
        e.stopPropagation();
        var feedback = document.querySelector('.unmatched');
        feedback.style.display = 'block';
    }
    reqs.forEach(req => {
        // Check if any password requirements are still unmet
        if (req.classList.contains('invalid')) {
            e.preventDefault();
            e.stopPropagation();
            var feedback = document.querySelector('.unmet');
            feedback.style.display = 'block';
        }
    });
});



        

