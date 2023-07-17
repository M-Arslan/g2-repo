import { createSlice } from "@reduxjs/toolkit";
import { ASYNC_STATES } from "../../../Enumerations/redux/async-states";
import { ensureNonEmptyArray } from "../../../Utility/rules";

const watches = [];

/**
 * Watch a thunk's status to show a message to the user
 * @param {string} status async_states to watch
 * @param {string} message the message to display when the state occurs
 * @param {any} thunk thunk to watch
 */
export const watch = (status, message, thunk) => {
    watches.push({
        status,
        message,
        thunk
    });
}

export const createAppStatusReducer = () => {
    const slice = {
        name: 'appStatus',
        initialState: {
            status: ASYNC_STATES.IDLE,
            message: null
        },
        reducers: {
            clearStatus: (state) => {
                state.status = ASYNC_STATES.IDLE;
                state.message = null;
            }
        },
    };

    if (ensureNonEmptyArray(watches)) {
        slice.extraReducers = (builder) => {
            watches.forEach(w => {
                if (w.status === ASYNC_STATES.SUCCESS || w.status === ASYNC_STATES.ERROR) {
                    const name = (w.status === ASYNC_STATES.SUCCESS ? w.thunk.fulfilled : w.thunk.rejected);
                    builder.addCase(name, (state) => {
                        state.status = w.status;
                        state.message = w.message;
                    });
                }
            });
        }
    }

    return createSlice(slice);
}