import {
    createAsyncThunk,
    createSlice
} from '@reduxjs/toolkit';
import {
    ASYNC_STATES
} from '../../Enumerations/redux/async-states';
import {
    initApiClient
} from '../../Providers/GraphQL/useGraphQL';
import {
    mapToObject
} from '../../Utility/mapToObject';
import {
    ensureNonEmptyArray,
    ensureNonNullObject
} from '../../Utility/rules';
import {
    safeObj
} from '../../Utility/safeObject';

function comparer(value, criteria) {
    const comp = (typeof criteria === 'function' ? criteria : v => criteria === v);
    return comp(value);
}

/**
 * Helper class to build an RTK slice
 * @class
 */
export class SliceBuilder {

    /** @type {string} */
    #_name;

    /** @type {object} */
    #_initialState;

    /** @type {Map<string, Reducer>} */
    #_reducers;

    /** @type {Map<string, any>} */
    #_thunks;

    /** @type {Map<string, SelectorFactory>} */
    #_selectors;

    /** @type {import('@reduxjs/toolkit').Slice<any, any, string>} */
    #_reduxSlice;

    /**
     * Creates a new instance of the Slice class
     * @constructor
     * @param {string} name
     * @param {object} initialData
     */
    constructor(name, initialData = null) {
        this.#_name = name;
        this.#_initialState = {
            loading: ASYNC_STATES.IDLE,
            data: initialData,
            error: null,
        };
        this.#_reducers = new Map();
        this.#_thunks = new Map();
        this.#_selectors = new Map();
    }

    /** @type {string} */
    get name() { return this.#_name; }

    /** @type {object} */
    get thunks() { return mapToObject(this.#_thunks); }

    /** @type {import('@reduxjs/toolkit').Slice<any, any, string>} */
    get slice() { return this.#_reduxSlice; }

    /** @type {Reducer} */
    get rootReducer() {
        return { [this.name]: safeObj(this.#_reduxSlice).reducer };
    }

    /**
     * Returns an object of functions used to generate selectors for this slice
     * @type {BaseSelectors}
     */
    get selectors() {
        return {
            selectData: () => (state) => {
                    return state[this.name]?.data;
            },
            selectLoading: () => (state) => {
                return state[this.name]?.loading;
            },
            selectByAllCriteria: (criteria) => (state) => {
                if (ensureNonNullObject(criteria) !== true) {
                    return state[this.name].data;
                }

                if (ensureNonEmptyArray(state[this.name].data)) {
                    return state[this.name].data.filter(x => {
                        return Object.keys(criteria).every(key => true === comparer(x[key], criteria[key]));
                    });
                }

                return [];
            },
            selectByAnyCriteria: (criteria) => (state) => {
                if (ensureNonNullObject(criteria) !== true) {
                    return state[this.name].data;
                }

                if (ensureNonEmptyArray(state[this.name].data)) {
                    return state[this.name].data.filter(x => {
                        return Object.keys(criteria).some(key => true === comparer(x[key],criteria[key]));
                    });
                }

                return [];
            },
            ...mapToObject(this.#_selectors),
        };
    }

    /**
     * Gets all available actions for this slice
     * @returns {object}
     */
    get actions() {
        if (ensureNonNullObject(this.#_reduxSlice) !== true) {
            throw new Error('[SliceBuilder::actions] cannot access action until the "create" method has been called.');
        }

        const sliceActions = safeObj(this.#_reduxSlice.actions);
        const sliceThunks = safeObj(this.thunks);

        return {
            ...sliceActions,
            ...sliceThunks
        }
    }

    /**
     * Adds a standard reducer to the slice
     * @param {string} name
     * @param {Reducer} handler
     * @returns {SliceBuilder} fluent interface
     */
    addReducer(name, handler) {
        this.#_reducers.set(name, handler);
        return this;
    }

    /**
     * Adds standard reducers for a Thunk
     * @param {string} name
     * @param {any} thunk
     * @returns {SliceBuilder} fluent interface
     */
    addReducerForThunk(name, thunk) {
        this.#_thunks.set(name, thunk);
        return this;
    }

    /**
     * Adds a new Thunk and reducers for a given operation
     * @param {string} name
     * @param {Function} operation - GraphOperation class
     * @returns {SliceBuilder} fluent interface
     */
    addThunkFromOperation(name, operation) {
        this.#_thunks.set(name, createAsyncThunk(`${this.name}/${name}`, async (args) => {
            const $api = initApiClient({
                op: operation
            });

            return await $api.op(args);
        }));
        return this;
    }

    /**
     * Adds a selector factory to the slice
     * @param {string} name
     * @param {SelectorFactory} handler
     * @returns {SliceBuilder} fluent interface
     */
    addCustomSelectorFactory(name, handler) {
        this.#_selectors.set(name, handler);
        return this;
    }

    /**
     * Generates the initialization object provided to the createSlice function from RTK
     * @return {SliceBuilder} fluent interface
     */
    create() {
        const slice = {
            name: this.name,
            initialState: this.#_initialState,
            reducers: {
                shelf: (state, action) => {
                    state.data = action.payload;
                },
                clearStatus: (state, action) => {
                    state.loading = ASYNC_STATES.IDLE;
                    state.error = null;
                },
                ...mapToObject(this.#_reducers)
            },
        };

        if (ensureNonNullObject(this.thunks)) {
            slice.extraReducers = (builder) => {
                Object.keys(this.thunks).forEach(key => {
                    const t = this.thunks[key];

                    builder.addCase(t.pending, (state, action) => {
                        state.loading = ASYNC_STATES.WORKING;
                        state.error = null;
                    });

                    builder.addCase(t.fulfilled, (state, action) => {
                        state.loading = ASYNC_STATES.SUCCESS;
                        state.data = action.payload;
                        state.error = null;
                    });

                    builder.addCase(t.rejected, (state, action) => {
                        state.loading = ASYNC_STATES.ERROR;
                        state.error = action.error;
                    });
                })
            }
        }

        this.#_reduxSlice = createSlice(slice);
        return this;
    }
}
