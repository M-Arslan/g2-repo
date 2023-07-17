import {
    ensureNonEmptyArray,
    ensureNonEmptyString,
    ensureNonNullObject
} from '../../../Utility/rules';
import { ModelProperty } from './ModelProperty';


/**
 * Model holds the user input state data for a form
 * @class
 * */
export class Model {
    /**
     * Creates a new instance of the Model class
     * @constructor
     * @param {import('./Schema').Schema} schema - object to populate model, propeties not on this object will not be bound
     */
    constructor(schema, onModelFieldChanged, onModelFinalized) {

        /**
         * Used for diagnostic purposes
         * @readonly
         * @type {number}
         */
        this._instanceId = Math.random() * Date.now();

        /**
         * @private
         * @type {boolean}
         */
        this._hasChanges = false;

        /** 
         *  @private
         *  @readonly
         *  @type {Map<string, import('./ModelProperty').ModelProperty>} 
         */
        this._propertyMap = (ensureNonNullObject(schema) && ensureNonEmptyArray(schema.properties) ? schema.properties.reduce((map, curr) => {
            map.set(curr.name, new ModelProperty(curr.name, this, curr.initialValue, curr.rules, curr.options));
            return map;
        }, new Map()) : new Map());

        /**
         * @private
         * @readonly
         * @type {Array<import('../rules/FormRule').ModelRule>} 
         */
        this._rules = (ensureNonNullObject(schema) && ensureNonEmptyArray(schema.rules) ? schema.rules : []);

        /**
         * @private
         * @readonly
         * @type {function}
         */
        this._modelFieldChanged = () => {
            if (typeof onModelFieldChanged === 'function') {
                onModelFieldChanged(this);
            }
        };

        /**
         * @private
         * @readonly
         * @type {function}
         */
        this._modelFinalized = () => {
            if (typeof onModelFinalized === 'function') {
                onModelFinalized(this);
            }
        };

        /**
         * @private
         * @readonly
         * @type {function} 
         */
        this._processModelRules = () => {
            const request = this.toRawObject();
            const errors = this._rules.reduce((errs, rule) => ({ ...errs, ...(rule.verify(request)) }), {});
            [...this._propertyMap.values()].forEach(prop => {
                prop.revalidate();

                if (ensureNonEmptyString(errors[prop.name])) {
                    prop.invalidate({ valid: false, error: errors[prop.name] }, true);
                }
            });
        };

        // -- fix binding context so that the functions can be bound directly to event handlers
        this.handleFinalizeInput = this.handleFinalizeInput.bind(this);
        this.handleUserInput = this.handleUserInput.bind(this);
        this.property = this.property.bind(this);
    }

    /** 
     *  @readonly
     *  @type {boolean} 
     */
    get isValid() {
        return [...this._propertyMap.values()].every(prop => prop.valid === true);
    }

    /**
     * @readonly
     * @type {boolean}
     */
    get hasChanges() {
        return [...this._propertyMap.values()].some(prop => prop.hasChanges === true);
    }

    /**
     * Resets the has changes flag on all properties to indicate the changes have been accepted 
     */
    acceptAllChanges() {
        [...this._propertyMap.values()].forEach(prop => {
            prop.acceptChanges();
        });
    }

    /**
     * hasProperty reports if a property has been registered with the supplied name.
     * @param {string} name - unique name of the property
     * @returns {boolean}
     */
    hasProperty(name) {
        return this._propertyMap.has(name);
    }

    /**
     * handleUserInput takes the UI Event and modified the underlying, bound model property
     * @param {Event} evt - the triggering event
     */
    handleUserInput(evt) {

        const { name, value } = evt.target;

        if (this.hasProperty(name)) {
            this.property(name).changeValue(value);
            this._modelFieldChanged();
        }
        else {
            console.warn(`[Model] attempting to set untracked property "${name}".`);
        }
    }

    /**
     * handleFinalizeInput processes the finalization of field input
     */
    handleFinalizeInput(evt) {

        const { name, value } = evt.target;

        if (this.hasProperty(name) && this.property(name).value !== value) {

            this.property(name).changeValue(value);
            this._modelFieldChanged();
        }

        this._processModelRules();
        this._modelFinalized();
    }

    /**
     * gets a property by name
     * @param {string} name - unique name for the desired property
     * @returns {import('./ModelProperty').ModelProperty}
     */
    property(name) {
        const prop = this._propertyMap.get(name);
        return prop;
    }

    get allErrors() {
        return [...this._propertyMap.values()].reduce((errs, prop) => {
            if (prop.valid) {
                return errs;
            }
            else {
                return { ...errs, [prop.name]: prop.error };
            }
        }, {});
    }

    /**
     * initialize the values for a group of properties
     * @param {object} initialValues - key/value object of property values
     */
    initialize(initialValues) {
        [...this._propertyMap.keys()].forEach(key => {
            this.property(key).initialize((initialValues[key] === undefined || initialValues[key] === null ? '' : initialValues[key]));
        });

        this._processModelRules();
    }

    /**
     * Converts the model structure into a raw key/value object
     * @returns {object}
     */
    toRawObject() {
        return [...this._propertyMap.values()].reduce((request, prop) => {
            return { ...request, [prop.name]: prop.value };
        }, {});
    }
}