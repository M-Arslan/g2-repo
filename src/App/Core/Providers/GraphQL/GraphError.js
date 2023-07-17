/**
 * GraphQLError represents the expected errors encountered from GraphQL
 * @class
 */
export class GraphError extends Error {
    /**
     * Creates a new instance of the GraphError class by parsing error responses.
     * @constructor
     * @param {object} response - response data
     */
    constructor(response) {
        super('The server has replied with an error');
        this.details = ((response || {}).errors || []);
    }
}