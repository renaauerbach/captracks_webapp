// Handle link to existing store --> Disable rest of form
const selection = document.getElementsByTagName('select')[0];
if (selection) {
    selection.addEventListener('change', (e) => {
        const form = document.getElementsByClassName('register')[0];
        const inputs = form.getElementsByTagName('input');
        const selects = form.getElementsByTagName('select');
        if (e.target.value !== "") {
            for (var i = 0; i < inputs.length; ++i) {
                inputs[i].disabled = true;
            }
            for (var i = 1; i < selects.length; ++i) {
                selects[i].disabled = true;
            }
        } else {
            for (var i = 0; i < inputs.length; ++i) {
                inputs[i].disabled = false;
            }
            for (var i = 1; i < selects.length; ++i) {
                selects[i].disabled = false;
            }
        }
    });
}

// Handle 24 Hour Checkbox --> Disable content
const checkbox = document.getElementById('24hours');
if (checkbox) {
    checkbox.addEventListener('change', e => {
        const inputs = document.querySelectorAll('.hours');
        if (e.target.checked) {
            for (var i = 0; i < inputs.length; ++i) {
                inputs[i].disabled = true;
            }
        } else {
            for (var i = 0; i < inputs.length; ++i) {
                inputs[i].disabled = false;
            }
        }
    });
}

// Handle Closed Checkbox --> Disable content
document.querySelectorAll('.closed').forEach(cb => {
    cb.addEventListener('change', e => {
        const name = e.srcElement.attributes.name.nodeValue;
        const fields = document.getElementsByName(name);
        if (e.target.checked) {
            for (var i = 1; i < fields.length; ++i) {
                fields[i].disabled = true;
            }
        } else {
            for (var i = 1; i < fields.length; ++i) {
                fields[i].disabled = false;
            }
        }
    });
});

// Capacity
const hidden = document.getElementsByClassName('hide');
// Handle Line Radios
const lines = document.getElementsByName('line');
// Handle "Yes" Radio for "Current Line" --> Show Input
lines[0].addEventListener('click', e => {
    hidden[0].classList.remove('no-line');
    hidden[0].classList.add('yes-line');
});
// Handle "No" Radio for "Current Line" --> Hide Input
lines[1].addEventListener('click', e => {
    hidden[0].classList.remove('yes-line');
    hidden[0].classList.add('no-line');
});

// Handle Register Radios
const registers = document.getElementsByName('register');
// Handle "Yes" Radio for "Open Registers" --> Show Input
registers[0].addEventListener('click', e => {
    hidden[1].classList.remove('no-register');
    hidden[1].classList.add('yes-register');
});
// Handle "No" Radio for "Open Registers" --> Hide Input
registers[1].addEventListener('click', e => {
    hidden[1].classList.remove('yes-register');
    hidden[1].classList.add('no-register');
});