import {
    CommunicationStrategy
} from '../../../../types.d';
import {
    CLASS_KEYS
} from '../../../../config/ClassKeys';
import {
    ensureNonEmptyArray,
    ensureNonEmptyString,
    ensureNonNullObject
} from '../../Utility/rules';
import {
    DurableCache
} from './DurableCache';
import {
    resolve
} from '../../Services/Container/ServiceContainer';
import { safeObj } from '../../Utility/safeObject';

/*************************************************************************************
 * USAGE EXAMPLE
 *
 * class SpecificQuery extends GraphOperation { 
 *   constructor() {
 *     super([SCHEMA], [OPERATION], [IS_MUTATION]);
 *     
 *     this.defineVariable([VARIABLE_NAME], [VARIABLE_TYPE], [IS_REQUIRED]);
 *     this.defineFields([FIELD_NAME_1], [FIELD_NAME_2], ...);
 *   }
 * };
 *
 *************************************************************************************/
/**
 * GraphOperation is a base class for communication with GraphQL
 * @class
 */
export class GraphOperation {
    /**
     * Creates a new instance of the GraphOperation class.
     * @constructor
     * @param {string} schema - the GQL schema to access
     * @param {string} operation - the schema operation name
     * @param {boolean} [isMutation=false] - indicates if this operation is a mutation or a read
     */
    constructor(schema, operation, isMutation = false, name = null) {
        this.endpoint = `${window.location.protocol}//${window.location.host}/gql/${schema}`;
        this.operation = operation;
        this.varDefs = [];
        this.fieldDefs = [];
        this.isMutation = (isMutation === true);
        this.name = (ensureNonEmptyString(name) ? name : `${schema}|${operation}`);
        this.isSilent = false;
    }

    /** @type {object} */
    static get inject() {
        return {
            $comm: CLASS_KEYS.GraphCommunication,
        };
    };

    /** @type {CommunicationStrategy} */
    $comm = null;

    /**
     * join consolidates multiple operations into a single atomic execution
     * @param {...ObjectConstructor} operations - classes which extend GraphOperation
     * @returns {ObjectConstructor}
     */
    static join(...operations) {
        if (operations.every(op => op.prototype instanceof GraphOperation) !== true) {
            throw new Error(`[GraphOperation::join] all joined operations must extend GraphOperation`);
        }

        return class CompositeOperation extends GraphOperation {
            constructor() {
                super('', '');
            }

            async execute(context) {
                return Promise.all(operations.map(op => {
                    return new Promise((res, rej) => {
                        /** @type {GraphOperation} */
                        const o = resolve(op);

                        o.execute(context[o.name]).then(result => res(result), err => rej(err));
                    });
                })).then((results) => {
                    return operations.reduce((result, op, idx) => {
                        const o = resolve(op);
                        return { ...result, [o.name]: results[idx] };
                    }, {});
                });
            }
        };
    }

    /**
     * notifyOnSuccess indicates that success of this operation should display the supplied message to the user.
     * @param {string} message - the message to show to the user on success
     * @returns {GraphOperation} - fluent interface
     */
    notifyOnSuccess(message) {
        this.notify = true;
        this.notifyMessage = message;
        return this;
    }

    /**
     * notifyOnError indicates that an error in this operation should display the supplied message to the user.
     * @param {string} message the message to show to the user on error
     * @returns {GraphOperation} fluent interface
     */
    notifyOnError(message) {
        this.notifyError = true;
        this.errorMessage = message;
        return this;
    }

    makeSilent(silent = true) {
        this.isSilent = (silent !== false);
    }

    /**
     * shouldCache instructs this GraphOperation to cache its results based on a given key
     * @param {string} cacheKey - the overall cache key, applied to all instances of this operation
     * @returns {GraphOperation} - fluent interface
     */
    shouldCache(cacheKey) {
        if (ensureNonEmptyString(cacheKey) !== true) {
            throw new Error('[GraphOperations::shouldCache] expected argument "cacheKey" to be a non-empty string.');
        }

        this.shouldCache = true;
        this.cacheKey = `${cacheKey}-${this.constructor.name}`;
        return this;
    }

    /**
     * defines a variable to be sent to the GQL Operation endpoint. 
     * @example operation.defineVariable('id', 'String', true);
     * @param {string} name - variable name defined in the GraphQL Schema
     * @param {string} type - the variable's GraphQL type name
     * @param {boolean} [required=false] - denotes whether or not the field is required
     * @returns {GraphOperation} - fluent interface
     */
    defineVariable(name, type, required = false) {
        this.varDefs.push(`$${name}:${type}${(required === true ? '!' : '')}`);
        return this;
    }

    /**
     * defineFields sets the names of the expected fields for the query
     * @example operation.defineFields('id', 'name');
     * @param {...string} field - name of the field used by the query
     * @returns {GraphOperation} - fluent interface
     */
    defineFields(...field) {
        this.fieldDefs = this.fieldDefs.concat(field);
        return this;
    }

    /**
     * defineFieldObject sets the name and properties of a subobject field
     * @param {string} objectFieldName name of the field that holds the subobject
     * @param {...string} objectFields names of the fields of the subobject
     * @returns {GraphOperation} fluent interface
     */
    defineFieldObject(objectFieldName, ...objectFields) {
        this.fieldDefs.push(`${objectFieldName} { ${objectFields.join(' ')} }`);
        return this;
    }

    /**
     * execute accesses the GQL endpoint with the configured query
     * @async
     * @example operation.execute({ id: 123 });
     * @param {object} variables - key/value object of query variables
     * @returns {Promise<any>} - resolves to query result
     */
    async execute(variables = {}) {
        if (ensureNonEmptyArray(this.varDefs) === true && ensureNonNullObject(variables) === false) {
            throw new Error('[GraphMutation::execute] expected variables argument to be an object if supplied');
        }

        if (this.shouldCache === true && DurableCache.hasDataFor(this.cacheKey, JSON.stringify(safeObj(variables)))) {
            return DurableCache.getDataFor(this.cacheKey, JSON.stringify(safeObj(variables)));
        }

        const vars = (ensureNonNullObject(variables) && ensureNonEmptyArray(this.varDefs) ? `(${Object.keys(variables).map(k => `${k}:$${k}`).join(',')})` : '');

        const query = `${(this.isMutation === true ? 'mutation' : 'query')}${ensureNonEmptyArray(this.varDefs) ? `(${this.varDefs.join(',')})` : ''} {
                    ${this.operation}${vars}
                    ${(Array.isArray(this.fieldDefs) && this.fieldDefs.length > 0 ? `{ ${((this.fieldDefs || []).join(' '))} }` : '')}
                }`;

        const payload = {
            query,
            variables
        };

        const result = await this.$comm.executeGQL(this.endpoint, payload);
        const data = result.data[this.operation];

        if (this.shouldCache === true) {
            DurableCache.setDataFor(this.cacheKey, JSON.stringify(safeObj(variables)), data);
        }

        return data;
    }
}

/**
 * NOOP is a GraphOperation implementation that performs no action.  It is used as a stub in instances where 
 * a valid GraphOperation class/instance is requires by the consumer but one is not really necessary.
 * @class
 */
export class NOOP extends GraphOperation {

    /**
     * Creates a new instance of the NOOP class
     * @constructor
     */
    constructor() {
        super('ping', 'noop');
    }

    /**
     * execute runs the GraphOperation with the provided data
     * @async
     * @param {any} data - the variables context for the execution
     * @returns {Promise<any>} - returns the data provided to execute
     */
    async execute(data) {
        return Promise.resolve(data);
    }
}