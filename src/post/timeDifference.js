// timeDifference
export const timeDifference = (current, previous) => {
    var msPerMinute = 60 * 1000;
    var msPerHour = msPerMinute * 60;
    var msPerDay = msPerHour * 24;
    var msPerMonth = msPerDay * 30;
    var msPerYear = msPerDay * 365;

    var elapsed = current - previous;

    if (elapsed < msPerMinute) {
        return Math.round(elapsed / 1000) + ' seconds ago';
    }
    else if (elapsed < msPerHour) {
        return Math.round(elapsed / msPerMinute) + ' minutes ago';
    }
    else if (elapsed < msPerDay) {
        return Math.round(elapsed / msPerHour) + ' hours ago';
    }
    else if (elapsed < msPerMonth) {
        return Math.round(elapsed / msPerDay) + ' days ago';
    }
    else if (elapsed < msPerYear) {
        return Math.round(elapsed / msPerMonth) + ' months ago';
    }
    else {
        return 'approximately ' + Math.round(elapsed / msPerYear) + ' years ago';
    }
};

// DisplayDateTime12Hour
export const DisplayDateTime12Hour = (date) => {
    // Get the day of the month
    const day = date.getDate();
    // Get the month (0-11, where 0 is January)
    const month = date.getMonth() + 1; // Add 1 to convert to 1-12 range
    // Get the year
    const year = date.getFullYear();
    let hours = date.getHours();
    const minutes = date.getMinutes();
    // Determine AM or PM
    const am_pm = hours >= 12 ? "PM" : "AM";

    // Convert from 24-hour time to 12-hour time
    hours = hours % 12;
    hours = hours ? hours : 12; // If hours is 0, display 12
    const formattedHours = hours < 10 ? "0" + hours : hours;
    const formattedMinutes = minutes < 10 ? "0" + minutes : minutes;

    // Combine the date and time into a formatted string
    const time = `${formattedHours}:${formattedMinutes} ${am_pm}`;
    const dateTime = `${day}/${month}/${year}, ${time}`;

    return dateTime;
}


