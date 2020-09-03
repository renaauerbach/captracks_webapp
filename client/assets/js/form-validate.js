const next = document.getElementById('nextBtn');
const tabs = document.getElementsByClassName('tab');

let currentTab = 0;
showTab(currentTab);

// Display the specified tab of the form
function showTab(n) {
	tabs[n].style.display = 'block';

	// Fix the Previous/Next buttons
	document.getElementById('prevBtn').style.display = (n === 0) ? 'none' : 'inline';
	next.innerHTML = (n === tabs.length - 1) ? 'Submit' : 'Next';

	// Call function to display correct step indicator
	stepIndicator(n);
}

// Determine which tab to display
function nextPrev(n) {
	if (n === 1 && !validateForm()) {
		return false;
	}
	// Hide the current tab
	tabs[currentTab].style.display = 'none';
	currentTab += n;
	// Check if at end of form --> submit
	if (currentTab >= tabs.length) {
		document.getElementById('regForm').submit();
		return false;
	}
	// Display correct tab
	showTab(currentTab);
}

// Removes the "active" class from all steps
function stepIndicator(n) {
	const steps = document.getElementsByClassName('step');
	for (let i = 0; i < steps.length; i++) {
		steps[i].classList.remove('active');
	}
	// Reassign active step
	steps[n].classList.add('active');
}

// Form validation before continuing
function validateForm() {
	const inputs = tabs[currentTab].getElementsByTagName('input');
	const password = document.getElementById('password');
	const confirmed = document.getElementById('confirmed');
	const reqs = document.querySelectorAll('.req');
	const err = document.getElementsByClassName('errorMsg')[0];
	const tempTxt = 'temp temp temp temp temp';

	// Check for any empty inputs
	for (let i = 0; i < inputs.length; i++) {
		const curr = inputs[i];
		if (curr.value === '' && curr.disabled === false) {
			curr.classList.add('invalid');
			err.innerHTML = 'Please fill in all text fields before continuing.';
			err.classList.add('red');
			return false;
		}
	}
	// Reset error msg
	err.classList.add('white');
	err.innerHTML = tempTxt;

	// Check that password and confirmed password match
	if (confirmed.value !== password.value) {
		err.innerHTML = "Passwords do not match. Please try again.";
		err.classList.add('red');
		return false;
	}
	// Reset error msg
	err.classList.add('white');
	err.innerHTML = tempTxt;

	// Check if password requirements are still unmet
	for (let i = 0; i < reqs.length; i++) {
		if (reqs[i].classList.contains('invalid')) {
			err.innerHTML = "Password does not meet the listed requirements.";
			err.classList.add('red');
			return false;
		}
	}
	// Reset error msg
	err.classList.add('white');
	err.innerHTML = tempTxt;

	// Next if form has tabs
	let step = document.getElementsByClassName('step');
	if (step) {
		step[currentTab].classList.add('finish');
		return true;
	}
	// Next if single page form
	else {
		document.getElementsByTagName('submit')[0].submit();
	}
}