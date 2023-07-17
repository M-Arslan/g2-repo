/**
 * GraphQLError represents the expected errors encountered from GraphQL
 * @class
 */
export class GraphQLError extends Error {
    /**
     * Creates a new instance of the GraphQLError class by parsing error responses.
     * @constructor
     * @param {...any} details - response data
     */
    constructor(...details) {
        super('GraphQL errors encountered');
        this.details = details.map(e => (typeof e === 'object' && e !== null ? e.message : e)).filter(e => (typeof e === 'string' && e !== ''));
    }
}