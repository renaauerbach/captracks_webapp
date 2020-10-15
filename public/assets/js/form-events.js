// Handle Floating Labels
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

// Autofilled Inputs --> Mark
const onAutoFillStart = (e) => e.parent.classList.add('is-autofilled');
const onAutoFillCancel = (e) => e.parent.classList.remove('is-autofilled');
const onAnimationStart = ({ target, animationName }) => {
    switch (animationName) {
        case 'onAutoFillStart':
            return onAutoFillStart(target);
        case 'onAutoFillCancel':
            return onAutoFillCancel(target);
    }
};
document.querySelector('.form-control').addEventListener('animationstart', onAnimationStart, false);

// Change Slider Value
function updateSliderText(val) {
    document.getElementById('sliderText').value = val;
}