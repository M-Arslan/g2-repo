import {
    ensureNonEmptyString,
    ensureNonNullObject
} from '../../../Utility/rules';

/**
 * @typedef {object} RuleResult
 * @property {boolean} valid - indicates whether or not the rule verifies as valid
 * @property {string} error - the message to show to the user
 */

/**
 * FormRule represents a rule run on the value of a Model Property
 * @class
 */
export class FormRule {

    /**
     * Creates a new instance of the FormRule class
     * @constructor
     * @param {function} fn - function that verifies the value
     * @param {string} message - error message to display to the user when invalid
     */
    constructor(fn, message) {

        if (typeof fn !== 'function') {
            throw new Error('[FormRule::ctor] expects argument "fn" to be a function');
        }

        /** 
         * @private
         * @readonly
         * @type {function}
         */
        this._fn = (typeof fn === 'function' ? fn : (value) => true);

        /**
         * @private
         * @readonly
         * @type {string}
         */
        this._message = (ensureNonEmptyString(message) ? message : 'Input is invalid');
    }

    /**
     * Gets the function used to determine whether this rule has been violated by a given value
     * @private
     * @readonly
     * @type {function}
     */
    get fn() { return this._fn; }

    /**
     * Gets the error message to apply when this rule is violated
     * @private
     * @readonly
     * @type {string}
     */
    get message() { return this._message; }

    /**
     * verify determines if a given value is valid
     * @param {any} value - field value
     * @returns {RuleResult}
     */
    verify(value, obj) {
        const valid = this.fn(value, obj);
        return Object.freeze({
            valid,
            error: (valid === true ? null : this.message)
        });
    }
}

/**
 * ModelRule represents a rule run against multiple properties
 * @class
 */
export class ModelRule {

    /**
     * Creates a new instance of the ModelRule class
     * @constructor
     * @param {function} fn - accepts the request object and returns a digest object of error messages
     */
    constructor(fn) {
        if (typeof fn !== 'function') {
            throw new Error('[ModelRule::ctor] expects argument "fn" to be a function');
        }

        this._fn = fn;
    }

    /**
     * verify determines if a given model object is valid
     * @param {object} request - the underlying model data object
     * @returns {object} - digest object of [propertyName]: errormessage
     */
    verify(request) {
        const errors = this._fn(request);
        return (ensureNonNullObject(errors) ? errors : {});
    }
}