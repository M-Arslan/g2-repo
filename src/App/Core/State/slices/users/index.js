import {
    SliceBuilder
} from '../SliceBuilder';
import {
    GetAllUsers
} from './queries/GetAllUsers';

/** @type {import('./types.d').UserSlice */
const slice = new SliceBuilder('users')
    .addThunkFromOperation('getAllUsers', GetAllUsers)
    .addCustomSelectorFactory('getAccountants', () => (state) => {
        let accountantRoleIDs = [16];
        let users = state.users.data;
        users = (users||[]).filter(X => X.userRoles.some((ur) => accountantRoleIDs.includes(ur.roleID)));
        return users || [];
    })
    .addCustomSelectorFactory('getSupervisors', () => (state) => {
        let supervisorsRoleIDs = [13, 2, 14];
        let users = state.users.data;
        users = (users||[]).filter(X => X.userRoles.some((ur) => supervisorsRoleIDs.includes(ur.roleID)));
        return users || [];
    })
    .addCustomSelectorFactory('getClaimCounsel', () => (state) => {
        let supervisorsRoleIDs = [3];
        let users = state.users.data;
        users = (users || []).filter(X => X.userRoles.some((ur) => supervisorsRoleIDs.includes(ur.roleID)));
        return users || [];
    })

    .create();

export const usersActions = slice.actions;
export const usersSelectors = slice.selectors;
export const usersReducer = slice.rootReducer;
