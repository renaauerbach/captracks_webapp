/*************** DISABLING ***************/
var selection = document.getElementsByTagName('select')[0];
if (selection) {
    selection.addEventListener('change', (e) => {
        let form = document.getElementsByClassName('register')[0];
        let inputs = form.getElementsByTagName('input');
        let selects = form.getElementsByTagName('select')
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
var checkbox = document.getElementById('24hours');
if (checkbox) {
    checkbox.addEventListener('change', e => {
        var inputs = document.querySelectorAll('.hours');
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
        var name = e.srcElement.attributes.name.nodeValue;
        var fields = document.getElementsByName(name);
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

/*************** FORMATTING ***************/
// Format Floating Labels
document.querySelectorAll('.form-control').forEach(input => {
    input.addEventListener('blur', function() {
        var parent = this.parentElement;
        parent.classList.remove('focused');
        if (this.value.length > 0) {
            parent.classList.add('filled');
        }
    });

    input.addEventListener('focus', function() {
        var parent = this.parentElement;
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
    if (input.type == 'text') {
        input.addEventListener('change', e => {
            timeFormat(e.target.value);
        });
    }
});

// Format Phone Number
function enforceFormat(e) {
    if (!isNumeric(e) && !isModifier(e)) {
        e.preventDefault();
    }
};

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
};

function isNumeric(e) {
    var key = e.keyCode;
    return (key >= 48 && key <= 57) || (key >= 96 && key <= 105);
};

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
};

var phone = document.getElementById('phone');
if (phone) {
    phone.addEventListener('keydown', e => {
        enforceFormat(e)
    });
    phone.addEventListener('keyup', e => {
        phoneFormat(e)
    });
}
