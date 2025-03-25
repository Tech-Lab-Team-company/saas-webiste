export const extractAndAddHours = (
    timestamp: string,
    hoursToAdd: number = 2
): string => {
    let date: Date;

    // Check if the timestamp includes "am" or "pm"
    if (/am|pm/i.test(timestamp)) {
        // Parse time in hh:mm am/pm format
        const [time, meridian] = timestamp.split(' ');
        const [hour, minute] = time.split(':').map(Number);

        const isPM = meridian.toLowerCase() === 'pm';
        const adjustedHour = (hour % 12) + (isPM ? 12 : 0); // Convert to 24-hour format

        // Create a Date object for today with the given time
        date = new Date();
        date.setUTCHours(adjustedHour, minute, 0, 0);
    } else {
        // Assume ISO timestamp format
        date = new Date(timestamp);
    }

    // Add the specified hours
    date.setUTCHours(date.getUTCHours() + hoursToAdd);

    let hours = date.getUTCHours();
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');

    // // Determine AM or PM
    // const meridian = hours >= 12 ? 'PM' : 'AM';
    //
    // // Convert to 12-hour format
    // hours = hours % 12 || 12; // Convert 0 to 12 for midnight

    return `${hours}:${minutes}`;
};
