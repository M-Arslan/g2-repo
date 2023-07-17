/**
 * @callback GqlExecute
 * @param {TArgs} args
 * @returns {Promise<TReturn>}
 * @template TArgs, TReturn
 */

/**
 * @typedef {object} GqlOperation
 * @property {GqlExecute<TExecArgs, TExecResult>} execute
 * @template TExecArgs, TExecResult
 */

export const KEY = 'GRAPHQL_TYPES';