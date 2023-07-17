
/**
 * CommunicationStrategy exposes the interface for accessing GraphQL endpoints.
 * @class
 */
export class CommunicationStrategy {

    /**
     * executeGQL communicates with the GraphQL endpoint
     * @param {string} endpoint
     * @param {string} query
     * @returns {Promise}
     */
    async executeGQL(endpoint, query) {}
}


/**
 * @callback AcceptsBooleanFunction
 * @param {boolean} arg 
 */


