var next = document.getElementById('nextBtn');
var tabs = document.getElementsByClassName('tab');

var currentTab = 0; 
showTab(currentTab); 

// Display the specified tab of the form
function showTab(n) {
    tabs[n].style.display = 'block';
    
    // Fix the Previous/Next buttons
    document.getElementById('prevBtn').style.display = (n == 0) ? 'none' : 'inline';
    next.innerHTML = (n == tabs.length - 1) ? 'Submit' : 'Next';
    
    // Call function to display correct step indicator
	stepIndicator(n);
}

// Determine which tab to display
function nextPrev(n) {
    if (n == 1 && !validateForm()) {
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
	var steps = document.getElementsByClassName('step');
	for (let i = 0; i < steps.length; i++) {
		steps[i].classList.remove('active')
	}
    // Reassign active step
    steps[n].classList.add('active');
}

// Form validation before continuing
function validateForm() {
	let inputs = tabs[currentTab].getElementsByTagName('input');
    let confirmed = document.getElementById('confirmed');
	let err = document.getElementsByClassName('errorMsg')[0];
	let tempTxt = 'temp temp temp temp temp';

	// Check for any empty inputs
	for (let i = 0; i < inputs.length; i++) {
        var curr = inputs[i];
		if (curr.value == '' && curr.disabled == false) {
			curr.classList.add('invalid');
			err.innerHTML = 'Please fill in all text fields before continuing.'
			err.className = 'red';
			return false;
		}
	}
	// Reset error msg
	err.className = 'white';
	err.innerHTML = tempTxt;

	// Check that password and confirmed password match
    if (confirmed.value != password.value) {
		err.innerHTML = "Passwords do not match. Please try again.";
		err.className = 'red';
		return false;
	}
	// Reset error msg
	err.className = 'white';
	err.innerHTML = tempTxt;

	// Check if password requirements are still unmet
	for (let i = 0; i < reqs.length; i++) {
		if (reqs[i].classList.contains('invalid')) {
			err.innerHTML = "Password does not meet the listed requirements.";
			err.className = 'red';
			return false;
		}
	}  
	// Reset error msg
	err.className = 'white';
	err.innerHTML = tempTxt;


	document.getElementsByClassName('step')[currentTab].classList.add('finish');
	return true; 
}
