const next = document.getElementById('nextBtn');
const tabs = document.getElementsByClassName('tab');

let currentTab = 0;
if (tabs.length > 0) {
	showTab(currentTab);
}

// Display the specified tab of the form
function showTab(n) {
	tabs[n].style.display = 'block';

	// Fix the Previous/Next buttons
	document.getElementById('prevBtn').style.display =
		n === 0 ? 'none' : 'inline';
	next.innerHTML = n === tabs.length - 1 ? 'Submit' : 'Next';

	// Call function to display correct step indicator
	stepIndicator(n);
}

// Determine which tab to display
function nextPrev(n) {
	if (n === 1 && !validateForm()) {
		return false;
	}
	// Check if at end of form --> submit
	if (next.innerHTML === 'Submit') {
		document.getElementById('join').submit();
		return false;
	}
	// Hide the current tab
	tabs[currentTab].style.display = 'none';
	currentTab += n;
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
	const password = document.getElementById('password');
	const confirmed = document.getElementById('confirmed');
	const reqs = document.querySelectorAll('.req');
	const err = document.getElementsByClassName('errorMsg')[0];

	// If form has tabs
	if (tabs.length > 0) {
		const inputs = tabs[currentTab].getElementsByTagName('input');
		// Check for any empty inputs
		for (let i = 0; i < inputs.length; i++) {
			const curr = inputs[i];
			if (
				curr.value === '' &&
				curr.disabled === false &&
				curr.id !== 'web'
			) {
				curr.classList.add('invalid');
				err.innerHTML =
					'Please fill in all text fields before continuing.';
				return false;
			}
		}
		// Reset error msg
		err.innerHTML = '';
	}

	// Check that password and confirmed password match
	if (confirmed.value !== password.value) {
		err.innerHTML = 'Passwords do not match. Please try again.';
		return false;
	}
	// Reset error msg
	err.innerHTML = '';

	// Check if password requirements are still unmet
	for (let i = 0; i < reqs.length; i++) {
		if (reqs[i].classList.contains('invalid')) {
			err.innerHTML = 'Password does not meet the listed requirements.';
			return false;
		}
	}
	// Reset error msg
	err.innerHTML = '';

	// Next if form has tabs
	const step = document.getElementsByClassName('step');
	if (step.length > 0) {
		step[currentTab].classList.add('finish');
	}

	return true;
}

// Validate Password Reset
const reset = document.getElementById('resetBtn');
if (reset) {
	reset.addEventListener('click', (e) => {
		e.preventDefault();
		if (validateForm()) {
			document.getElementsByTagName('form')[0].submit();
		}
	});
}
