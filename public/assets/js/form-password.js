// Handle strong password requirements
const password = document.getElementById('password');
const reqs = document.querySelectorAll('.req');
// 0: At least 1 UPPERCASE letter
// 1: At least 1 lowercase Letter
// 2: At least 1 Number
// 3: At least 1 Special Character
// 4: At least 8 characters in length

function passwordReqs(e) {
    const upper = /[A-Z]/g;
    const lower = /[a-z]/g;
    const num = /[0-9]/g;
    const special = /[~!#$%\^&*+=\-\[\]\\;/{}|\\:<>\?]/g;

    if (e.target.value.match(upper)) {
        reqs[0].classList.remove('invalid');
        reqs[0].classList.add('valid');
    } else {
        reqs[0].classList.remove('valid');
        reqs[0].classList.add('invalid');
    }
    if (e.target.value.match(lower)) {
        reqs[1].classList.remove('invalid');
        reqs[1].classList.add('valid');
    } else {
        reqs[1].classList.remove('valid');
        reqs[1].classList.add('invalid');
    }
    if (e.target.value.match(num)) {
        reqs[2].classList.remove('invalid');
        reqs[2].classList.add('valid');
    } else {
        reqs[2].classList.remove('valid');
        reqs[2].classList.add('invalid');
    }
    if (e.target.value.match(special)) {
        reqs[3].classList.remove('invalid');
        reqs[3].classList.add('valid');
    } else {
        reqs[3].classList.remove('valid');
        reqs[3].classList.add('invalid');
    }
    if (e.target.value.length >= 8) {
        reqs[4].classList.remove('invalid');
        reqs[4].classList.add('valid');
    } else {
        reqs[4].classList.remove('valid');
        reqs[4].classList.add('invalid');
    }
}

if (password) {
    password.addEventListener('keyup', e => {
        passwordReqs(e);
    });
}
