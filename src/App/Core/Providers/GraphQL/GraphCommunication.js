import {
    GraphError
} from './GraphError';

/**
 * GraphCommunication is a strategy implementation for accessing the GraphQL endpoints
 * @class
 */
export class GraphCommunication {
    /**
     * Creates a new instance of the {GraphCommunication} class. 
     */
    constructor() {

    }

    /**
     * executeGQL posts a serialized query to the supplied GQL Endpoint.
     * @param {string} endpoint - URL of the GQL endpoint
     * @param {string} query - the GQL query string
     * @returns {Promise}
     */
    async executeGQL(endpoint, query) {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(query),
        });

        if (response.ok === true) {
            const result = await response.json();

            if (Array.isArray(result.errors) && result.errors.length > 0) {
                throw new GraphError(result);
            }

            return result;
        }
        else {
            throw new Error('There was an issue communicating with the server.');
        }
    }
}
