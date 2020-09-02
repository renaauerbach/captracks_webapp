// General text formatting (non-form related)
const months = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];
const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const posts = document.querySelectorAll('.info-box');
posts.forEach(created => {
    const date = created.getElementsByClassName('post-date')[0].innerHTML.split(' ');

    // Collect relevant date data
    const fullDate = date.slice(0, 4).join(' ');

    // Collect relevant time data
    const time = date[4].split(':');
    let hour = time[0];
    let period = 'AM';

    // Convert hours
    if (hour === 0) {
        hour = 12;
    }
    else if (hour >= 12) {
        period = 'PM';
        if (hour > 12) {
            hour = Math.abs(hour - 12);
        }
    }

    const fullTime = hour + ':' + time[1] + ' ' + period;

    return created.getElementsByClassName('post-date')[0].innerText = fullDate + ' - ' + fullTime;
});

