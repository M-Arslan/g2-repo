/**
 * A function used to select a certain portion of the redux state data
 *
 * @callback Selector
 * @param {object} state
 * @returns {T}
 * @template T
 */

/**
 * A factory method to create a selector
 *
 * @callback SelectorFactory
 * @param {any} criteria any criteria needed by the selector
 * @returns {Selector<T>}
 * @template T
 */

/**
 * @typedef {object} BaseSelectors
 * @property {SelectorFactory<T>} selectData
 * @property {SelectorFactory<string>} selectLoading
 * @template T
 */

/**
 * @typedef {object} BaseListSelectors
 * @property {SelectorFactory<Array<T>>} selectData
 * @property {SelectorFactory<string>} selectLoading
 * @property {SelectorFactory<Array<T>>} selectByAllCriteria usable when data is array type
 * @property {SelectorFactory<Array<T>>} selectByAnyCriteria usable when data is array type
 * @template T
 */

/**
 * @callback SliceActionCreator
 * @param {TArgs} args
 * @returns {import('redux').Action}
 * @template TArgs
 */

/**
 * @callback ClearStatusActionCreator
 * @returns {import('redux').Action}
 */

/**
 * @typedef {object} BaseActions
 * @property {SliceActionCreator<T>} shelf - stores the data object locally
 * @property {ClearStatusActionCreator} clearStatus - clears the slice's current status
 * @template T
 */

/**
 * The root reducer object
 * 
 * @typedef {object} RootReducer
 * @property {import('redux').Reducer} *
 */

/**
 * The typed slice builder 
 * 
 * @typedef {object} StateSlice
 * @property {TActions} actions
 * @property {TSelectors} selectors
 * @property {RootReducer} rootReducer
 * @template TActions, TSelectors
 * 
 */

export const KEY = 'BASE_STATE_TYPES';