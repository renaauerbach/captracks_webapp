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