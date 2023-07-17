import { ensureIsNumber, ensureNonEmptyString, ensureNonNullObject } from "./rules";

export const TIMEZONE = Object.freeze({
    UTC: 0,
    LOCAL: 99,
    PACIFIC: -8,
    MOUNTAIN: -7,
    CENTRAL: -6,
    EASTERN: -5,
});

export const DATE_FORMATS = Object.freeze({
    US_DATE_ONLY: 'mm/dd/yyyy',
    US_DATE_TIME: 'mm/dd/yyyy hh:ii a',
    US_DATE_TIME_FULL: 'mm/dd/yyyy hh:ii:ss a',
    ISO_DATE_ONLY: 'yyyy-mm-dd',
    ISO_DATE_TIME: 'yyyy-mm-dd HH:ii:ss',
});

function to12HourFormat(hours) {
    const num = parseInt(hours);
    if (ensureIsNumber(num)) {
        if (num === 0) {
            return '12';
        }
        else if (num <= 12) {
            return `${num}`.padStart(2, '0');
        }
        else {
            return `${num - 12}`.padStart(2, '0');
        }
    }
    else {
        return hours;
    }
}

export class G2Date {

    /** @type {Date} */
    #_datetime;

    /** @type {boolean} */
    #_agnostic;

    /** @type {string} */
    #_basePattern;

    /**
     * Creates a new instance of the G2Date class
     * @constructor
     * @param {string|number|Date} from string or number representing the date
     * @param {boolean} [tzAgnostic=true] flag indicating if this date should be treated as timezone agnostic
     * @param {string} [basePattern] the default pattern used for toString
     */
    constructor(from, tzAgnostic = true, basePattern = DATE_FORMATS.US_DATE_ONLY) {
        this.#_datetime = (from instanceof Date ? from : (ensureNonEmptyString(from) || ensureIsNumber(from) ? new Date(from) : null));
        this.#_agnostic = (tzAgnostic !== false);
        this.#_basePattern = basePattern;
    }

    /** @type {boolean} */
    get isTimezoneAgnostic() { return this.#_agnostic; }

    /**
     * formats the internal date time
     * @param {string} pattern
     * @returns {string}
     */
    format(pattern) {
        if (this.#_datetime === null) {
            return '';
        }

        const rx = /(\d{4})-([01]\d)-([0-3]\d)T([0-2]\d):([0-5]\d):([0-5]\d)\.\d+([+-][0-2]\d:[0-5]\d|Z)/;
        const [s, year, month, day, hour, minute, second, tz] = rx.exec(this.#_datetime.toISOString());
        return pattern.replaceAll('yyyy', year).replaceAll('yy', year.substr(2))
            .replaceAll('mm', month)
            .replaceAll('dd', day)
            .replaceAll('hh', to12HourFormat(hour))
            .replaceAll('a', (parseInt(hour) >= 12 ? 'pm' : 'am'))
            .replaceAll('HH', hour)
            .replaceAll('ii', minute)
            .replaceAll('ss', second);
    }

    /**
     * Determines if this instance is between min and max dates (inclusive).
     * @param {Date|number|string} min
     * @param {Date|number|string} max
     * @returns {boolean}
     */
    isBetween(min, max) {
        const minVal = (min instanceof Date ? min : (ensureNonEmptyString(min) || ensureIsNumber(min) ? new Date(min) : null));
        const maxVal = (max instanceof Date ? max : (ensureNonEmptyString(max) || ensureIsNumber(max) ? new Date(max) : null));

        if (minVal === null || maxVal === null || this.#_datetime === null) {
            return false;
        }

        return (this.#_datetime.getTime() >= minVal.getTime() && this.#_datetime.getTime() <= max.getTime());
    }

    /**
     * Retruns system default string representation of the Date
     * @returns {string}
     */
    toString() {
        return this.format(this.#_basePattern);
    }

    /**
     * Returns the ISO Serialization string for the underlying datetime if set, otherwise null
     * @returns {string|null} 
     */
    toISODateString() {
        return (ensureNonNullObject(this.#_datetime) ? this.#_datetime.toISOString() : null);
    }

    /**
     * Attempts to parse a date string in an error safe way
     * @param {string} str
     * @returns {G2Date|null}
     */
    static tryParse(str) {
        const ticks = Date.parse(str);
        if (ticks > 0 && isNaN(ticks) === false) {
            return new G2Date(ticks);
        }
        else {
            return null;
        }
    }
}