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