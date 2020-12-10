// General text formatting (non-form related)
const posts = document.querySelectorAll('.forum-box');
posts.forEach((created) => {
	var date = created
		.getElementsByClassName('post-date')[0]
		.innerHTML.split(' ');

	// Collect relevant date data
	const fullDate = date.slice(0, 4).join(' ');

	// Get timezone
	var tz = date.slice(6, 9);
	const timezone = '(' + tz[0][1] + tz[1][0] + tz[2][0] + ')';

	// Collect relevant time data
	const time = date[4].split(':');
	let hour = time[0];
	let period = 'AM';

	// Convert hours
	if (hour === 0) {
		hour = 12;
	} else if (hour >= 12) {
		period = 'PM';
		if (hour > 12) {
			hour = Math.abs(hour - 12);
		}
	}

	const fullTime = hour + ':' + time[1] + ' ' + period;

	return (created.getElementsByClassName('post-date')[0].innerText =
		fullDate + ' - ' + fullTime + ' ' + timezone);
});
