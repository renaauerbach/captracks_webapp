// Handle 24 Hour Checkbox
var checkbox = document.getElementById('24hours');
if (checkbox) {
    checkbox.addEventListener('change', e => {
        var inputs = document.querySelectorAll('.hours');
        if (e.target.checked) {
            for (var i = 0; i < inputs.length; ++i) {
                inputs[i].disabled = true;
            }
        }
        else {
            for (var i = 0; i < inputs.length; ++i) {
                inputs[i].disabled = false;
            }
        }
    });
}

// Handle Closed Checkbox
document.querySelectorAll('.closed').forEach(cb => {
    cb.addEventListener('change', e => {
        var name = e.srcElement.attributes.name.nodeValue;
        var fields = document.getElementsByName(name);
        if (e.target.checked) {
            for (var i = 0; i < fields.length; ++i) {
                fields[i].disabled = true;
            }
        }
        else {
            for (var i = 0; i < fields.length; ++i) {
                fields[i].disabled = false;
            }
        }
    });
});


// Auto Format Time
function timeFormat(str) {
    console.log(/:/.test(str));
    if (!/:/.test(str)) { 
        str += ':00'; 
    }
    return str.replace(/^\d{1}:/, '0$&').replace(/:\d{1}$/, '$&0');
}

document.querySelectorAll('.hours').forEach(input => {
    if (input.type == 'text') {
        input.addEventListener('change', e => {
            timeFormat(e.target.value);
        })
    }
})


// Handle Phone Number Formatting
function phoneFormat(e, restore) {
    var newNumber,
        start = e.selectionStart,
        end = e.selectionEnd,
        number = e.value.replace(/\D/g, '');

    // Automatically add dashes
    if (number.length > 2) {
        newNumber = number.substring(0, 3) + '-';
        if (number.length === 4 || number.length === 5) {
            newNumber += number.substr(3);
        } else if (number.length > 5) {
            newNumber += number.substring(3, 6) + '-';
        }
        if (number.length > 6) {
            newNumber += number.substring(6);
        }
    } else {
        newNumber = number;
    }

    e.value = newNumber.length > 12 ? newNumber.substring(12, 0) : newNumber;

    // Restore cursor selection
    // Prevent cursor from going to the end unless cursor was at end when formatted
    if (
        (newNumber.slice(-1) === '-' &&
            restore === false &&
            (newNumber.length === 8 && end === 7)) ||
        (newNumber.length === 4 && end === 3)
    ) {
        start = newNumber.length;
        end = newNumber.length;
    } else if (restore === 'revert') {
        start--;
        end--;
    }
    e.setSelectionRange(start, end);
}

function checkNumber(field, e) {
    var keyCode = e.keyCode,
        keyStr = String.fromCharCode(keyCode),
        deleteKey = false,
        dash = 189,
        backspace = [8, 46],
        directionKey = [33, 34, 35, 36, 37, 38, 39, 40],
        end = field.selectionEnd;

    // Check if backspace was pressed
    deleteKey = backspace.indexOf(keyCode) > -1 ? true : false;

    // Force format if a number or backspace is pressed
    if (keyStr.match(/^\d+$/) || deleteKey) {
        phoneFormat(field, deleteKey);
    }
    // Ignore direction keys
    else if (directionKey.indexOf(keyCode) > -1) {
        // Do nothing
    } else if (dash === keyCode) {
        if (end === field.value.length) {
            field.value = field.value.slice(0, -1);
        } else {
            field.value =
                field.value.substring(0, end - 1) + field.value.substr(end);
            field.selectionEnd = end - 1;
        }
    }
    // Remove value of non numerical inputs
    else {
        e.preventDefault();
        phoneFormat(field, 'revert');
    }
}

var phone = document.getElementById('phone');
if (phone) {
    phone.addEventListener('keyup', e => {
        checkNumber(this, e);
    });    
}
