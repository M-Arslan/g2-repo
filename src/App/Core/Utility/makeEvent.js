import { ensureNonEmptyString } from "./rules";

/**
 * @interface AppEventTarget
 * @template T
 * @property {string} name - name of the originator
 * @property {T} value - event arguments
 */
class AppEventTarget {
    /**
     * Creates a new instance of the AppEventTarget class
     * @param {string} name name of the event originator
     * @param {T} value argument value
     */
    constructor(name, value) {

        /**
         * @private
         * @readonly
         */
        this._name = name;

        /**
         * @private
         * @readonly
         */
        this._value = value;
    }

    /** 
     *  @type {string}
     *  @readonly
     */
    get name() { return this._name; }

    /**
     * @type {T}
     * @readonly
     */
    get value() { return this._value; }
}

/**
 * @interface AppEvent
 * @template T
 * @property {AppEventTarget.<T>} target - the event target
 */
export class AppEvent {
    /**
     * Creates a new instance of the AppEvent class
     * @param {string} name name of the originator
     * @param {T} value argument value
     */
    constructor(name, value) {

        /**
         * @private
         * @readonly
         */
        this._target = new AppEventTarget(name, value);
    }

    /**
     * @type {AppEventTarget.<T>}
     * @readonly
     */
    get target() { return this._target; }
}

/**
 * Creates an event args object to provide to event handlers
 * @param {string} name - the name of the event originator
 * @param {any} [value=null] - the event arguments
 * @returns {AppEvent<any>}
 */
export function makeEvent(name, value = null) {
    if (ensureNonEmptyString(name) !== true) {
        console.warn('[makeEvent] received bad name:', name);
        throw new Error('[makeEvent] expected argument "name" to be a non-empty string');
    }

    return new AppEvent(name, (typeof value === 'undefined' ? null : value));
}