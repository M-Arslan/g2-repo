import {
    flipObject
} from '../../Utility/flipObject';

export const ASYNC_STATES = Object.freeze({
    IDLE: 'idle',
    WORKING: 'working',
    SUCCESS: 'success',
    ERROR: 'error',
});

export const ASYNC_STATES_LOOKUP = Object.freeze(flipObject(ASYNC_STATES));