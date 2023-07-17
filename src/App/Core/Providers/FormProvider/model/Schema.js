import { ensureNonEmptyArray } from '../../../Utility/rules';
import { ModelRule } from '../rules/FormRule';
import { ModelProperty } from './ModelProperty';

/**
 * Information used to initialize a form's model
 * @class 
 */
export class Schema {

    /**
     * Creates a new instance of the Schema class.
     * @constructor
     * @param {Array<import('../rules/FormRule').ModelRule>} [rules] - array of rules to apply to the entire model
     */
    constructor(rules = []) {

        /**
         * @private
         * @readonly
         * @type {Map<string, ModelProperty>}
         */
        this._propertyMap = new Map();

        /**
         * @private
         * @readonly
         * @type {Array<import('../rules/FormRule').ModelRule>} 
         */
        this._rules = (ensureNonEmptyArray(rules) ? rules : []);
    }

    /** @type {Array<ModelProperty>} */
    get properties() { return [...this._propertyMap.values()]; }

    /** @type {Array<import('../rules/FormRule').ModelRule>} */
    get rules() { return [...this._rules]; }

    /**
     * binds a new property to the schema
     * @param {string} name - unique name of the property
     * @param {Array<import('../rules/FormRule').FormRule>} rules - array of rules
     * @param {import('./ModelProperty').ModelPropertyOptions} options - property specific options
     * @param {any} [initialValue=null] - the value to initialze the property to
     * @returns {Schema} fluent interface
     */
    bindProperty(name, rules, options, initialValue = null) {
        if (this._propertyMap.has(name)) {
            throw new Error(`[Schema::bindProperty] a property with the name "${name}" has already been bound to this schema`);
        }

        this._propertyMap.set(name, { name, initialValue, rules, options });
        return this;
    }

    /**
     * determines if a property with the given name has been bound
     * @param {string} name - name of the property 
     * @returns {boolean}
     */
    hasBoundProperty(name) {
        return this._propertyMap.has(name);
    }

    /**
     * unbinds a given property by name
     * @param {string} name - name of the property
     * @returns {Schema} - fluent interface
     */
    unbindProperty(name) {
        this._propertyMap.delete(name);
        return this;
    }
}