// Format Floating Labels
document.querySelectorAll('.form-control').forEach(input => {
    input.addEventListener('blur', function() {
        const parent = this.parentElement;
        parent.classList.remove('focused');
        if (this.value.length > 0) {
            parent.classList.add('filled');
        }
    });

    input.addEventListener('focus', function() {
        const parent = this.parentElement;
        parent.classList.remove('filled');
        parent.classList.add('focused');
    });
});

// Format Time
function timeFormat(str) {
    if (!/:/.test(str)) {
        str += ':00';
    }
    return str.replace(/^\d{1}:/, '0$&').replace(/:\d{1}$/, '$&0');
}

document.querySelectorAll('.hours').forEach(input => {
    if (input.type === 'text') {
        input.addEventListener('change', e => {
            timeFormat(e.target.value);
        });
    }
});

// Format Phone Number
function isNumeric(e) {
    const key = e.keyCode;
    return (key >= 48 && key <= 57) || (key >= 96 && key <= 105);
}

function isModifier(e) {
    const key = e.keyCode;
    return (
        e.shiftKey === true ||
        key === 35 ||
        key === 36 ||
        (key === 8 || key === 9 || key === 13 || key === 46) ||
        (key > 36 && key < 41) ||
        ((e.ctrlKey === true || e.metaKey === true) &&
            (key === 65 ||
                key === 67 ||
                key === 86 ||
                key === 88 ||
                key === 90))
    );
}

function enforceFormat(e) {
    if (!isNumeric(e) && !isModifier(e)) {
        e.preventDefault();
    }
}

function phoneFormat(e) {
    if (isModifier(e)) {
        return;
    }

    const input = e.target.value.replace(/\D/g, '').substring(0, 10); // First ten digits of input only
    const zip = input.substring(0, 3);
    const mid = input.substring(3, 6);
    const last = input.substring(6, 10);

    if (input.length > 6) {
        e.target.value = `(${zip}) ${mid}-${last}`;
    } else if (input.length > 3) {
        e.target.value = `(${zip}) ${mid}`;
    } else if (input.length > 0) {
        e.target.value = `(${zip}`;
    }
}

const phone = document.getElementsByClassName('phone')[0];
if (phone) {
    phone.addEventListener('keydown', e => {
        enforceFormat(e);
    });
    phone.addEventListener('keyup', e => {
        phoneFormat(e);
    });
}

// Format Slider Value
function updateSliderText(val) {
    document.getElementById('sliderText').value = val;
}