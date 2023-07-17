/**
 * Gets the short month name for a month number
 * @param {number} month
 * @returns {string}
 */
export function getShortMonthName(month) {
    return [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec'
    ][month];
}

/**
 * Gets the full month name for a month number
 * @param {number} month
 * @returns {string}
 */
export function getFullMonthName(month) {
    return [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
    ][month];
}