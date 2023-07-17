import {
    SliceBuilder
} from '../SliceBuilder';

import { getClaimSupportDetails } from './queries/getClaimSupportDetails';
import { getNotificationRoleDetail } from './queries/getNotificationRoleDetail';
 
/** @type {import('./types.d').claimSupportTypeSlice} */
const claimSupportTypeSlice = new SliceBuilder('supportType')
    .addThunkFromOperation('get', getClaimSupportDetails)
    .create();

const claimSupportTypeRolesSlice = new SliceBuilder('claimsupportRoles')
    .addThunkFromOperation('getDetail', getNotificationRoleDetail)
    .create();


export const claimSupportTypeReducer = claimSupportTypeSlice.rootReducer;
export const claimSupportTypeSelectors = claimSupportTypeSlice.selectors;
export const claimSupportTypeActions = claimSupportTypeSlice.actions;

export const claimSupportTypeRolesReducer = claimSupportTypeRolesSlice.rootReducer;
export const claimSupportTypeRolesSelectors = claimSupportTypeRolesSlice.selectors;
export const claimSupportTypeRolesActions = claimSupportTypeRolesSlice.actions;

