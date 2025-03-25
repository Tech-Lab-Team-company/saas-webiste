export function formatTimeToAmPm(time: string): string {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours, 10);
    const amPm = hour >= 12 ? 'pm' : 'am';
    const formattedHour = hour % 12 || 12; // Convert hour to 12-hour format
    return `${formattedHour}:${minutes} ${amPm}`;
}