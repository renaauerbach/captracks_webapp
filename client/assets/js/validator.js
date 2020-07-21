
var password = document.getElementById('password');
document.getElementById('confirmed').onChange = (e) => {
    validate(this, e);
};
