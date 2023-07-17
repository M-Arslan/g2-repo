import {
    ensureNonEmptyArray,
    ensureNonEmptyString,
    ensureNonNullObject
} from '../../../Utility/rules';
import {
    Model
} from './Model';

const default_options = Object.freeze({
    allowInvalidValues: true,
    allowNullValues: false,
    beforeSet: (oldValue, newValue) => {
        return newValue;
    },
    beforeGet: (value) => {
        return value;
    }
})

/**
 * @typedef {object} ModelPropertyOptions
 * @property {boolean} [allowInvalidValues=true] - do not block input if input is invalid
 * @property {function} [beforeSet] - process value before applying to model via a set operation
 * @property {function} [beforeGet] - process the stored value before it is returned from a get operation
 */

/**
 * @typedef {object} ModelPropertyStatus
 * @property {boolean} valid - is the current value valid
 * @property {string} error - the rule message for the status
 */

/**
 * ModelProperty tracks the state of a property on the form model
 * @interface
 * @template T
 * */
export class ModelProperty {
    /**
     * Creates a new instance of the ModelProperty class
     * @constructor
     * @param {string} name - property name
     * @param {Model} parent - the model that owns this property
     * @param {T} initialValue - the intial value of the property
     * @param {Array<import('../rules/FormRule').FormRule>} rules - array of validation rules
     * @param {ModelPropertyOptions} [options] - extra options
     */
    constructor(name, parent, initialValue = null, rules = [], options = {}) {

        if (ensureNonEmptyString(name) !== true) {
            throw new Error('[ModelProperty::ctor] expects argument "name" to be a non-empty string');
        }

        if (ensureNonNullObject(parent) !== true || (parent instanceof Model) !== true) {
            throw new Error('[ModelProperty::ctor] expects argument "parent" to be a non-null object which extends Model');
        }

        this._model = parent;

        /** 
         *  @private
         *  @type {ModelPropertyOptions} 
         */
        this._options = (ensureNonNullObject(options) ? { ...default_options, ...options } : default_options);

        /**
         * @private
         * @type {string}
         */
        this._name = name;

        /**
         * @private
         * @type {boolean}
         */
        this._touched = false;

        /**
         * @private
         * @type {boolean}
         */
        this._hasChanges = false;

        /**
         * @private
         * @type {T}
         */
        this._value = (this._options.allowNullValues === true ? initialValue : (ensureNonNullObject(initialValue) || ensureNonEmptyString(initialValue) ? initialValue : ''));

        /** 
         *  @private
         *  @type {ModelPropertyStatus} 
         */
        this._status = { valid: true, error: '' };

        /**
         * @private
         * @type {Array<FormRule>} 
         */
        this._rules = (ensureNonEmptyArray(rules) ? rules : []);

        /** 
         *  @private
         *  @returns {ModelPropertyStatus} 
         */
        this._verify = (value) => {
            const obj = this._model.toRawObject();
            return this._rules.reduce((status, rule) => {
                return (status.valid === false ? status : rule.verify(value, obj));
            }, { valid: true, error: '' });
        };
    }

    /** 
     *  @readonly
     *  @type {string} 
     */
    get name() { return this._name; }

    /** 
     *  @readonly
     *  @type {T} 
     */
    get value() { return this._value; }

    /** 
     *  @readonly
     *  @type {boolean} 
     */
    get valid() { return (this._status.valid === true); }

    /**
     * @readonly
     * @type {boolean}
     */
    get hasChanges() { return (this._hasChanges === true); }

    /** 
     *  @readonly
     *  @type {boolean} 
     */
    get showError() { return (this.valid === false && this._touched === true); }

    /** 
     *  @readonly
     *  @type {string} 
     */
    get error() { return this._status.error; }

    /**
     * @readonly
     * @type {string}
     */
    get helperText() { return (this.showError === true ? this.error : ''); }

    /**
     * initialize sets the original value.  This does not flag the field as touched.
     * @param {any} value - initial value
     */
    initialize(value) {
        this._status = this._verify(value);
        this._value = value;
    }

    /**
     * changeValue sets the tracked value for this property state
     * @param {any} value
     */
    changeValue(value) {
        const verified = this._verify(value);

        this._touched = true;
        this._status = verified;
        if (this._options.allowInvalidValues !== false || verified.valid === true) {
            this._hasChanges = (this._value !== value);
            this._value = this._options.beforeSet(this._value, value);
        }
    }

    /**
     * invalidate will manually change the validation status of a property
     * @param {ModelPropertyStatus} status - the manually set status of the field
     * @param {boolean} [isTouched] - whether or not to mark the field as having received user focus
     */
    invalidate(status, isTouched) {
        this._touched = (isTouched === true ? true : (isTouched === false ? false : this._touched));
        this._status = status;
    }

    /**
     * Resets changes flag to indicate the changes have been accepted
     */
    acceptChanges() {
        this._hasChanges = false;
    }

    /**
     * Runs the property validation rules against the current value 
     */
    revalidate(touched = true) {
        this._status = this._verify(this.value);
        this._touched = (touched !== false);
    }
}
