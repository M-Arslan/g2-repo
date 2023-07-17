import {
    SliceBuilder
} from '../SliceBuilder';
import {
    AuthContext
} from './AuthContext';
import {
    GetCurrentUser
} from './queries/GetCurrentUser';

/** @type {import('./types.d').UserSlice */
const slice = new SliceBuilder('user')
    .addThunkFromOperation('get', GetCurrentUser)
    .addCustomSelectorFactory('selectAuthContext', () => (state) => {
        const userData = state.user.data;
        const ctx = new AuthContext(userData);
        return ctx;
    })
    .create();

export const userActions = slice.actions;
export const userSelectors = slice.selectors;
export const userReducer = slice.rootReducer;
