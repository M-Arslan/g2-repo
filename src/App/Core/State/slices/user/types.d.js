/**
 * @typedef {object} AppPermission
 * @property {number} AppTypeId
 * @property {1|2|3} PermissionLevelId
 */

/**
 * @typedef {object} UserInformation
 * @property {string} id the user id
 * @property {string} fullName the full display name of the user
 * @property {string} emailAddress the user's email address
 */

/**
 * @typedef {object} ExtraUserData
 * @property {string} token
 * @property {Array<AppPermission>} permissions
 * @property {Array<number>} roles
 * @property {Array<number>} roles
 * @property {boolean} authenticated
 * @property {boolean} authorized
 * 
 * @typedef {UserInformation & ExtraUserData} UserData
 */

/**
 * Actions for the User slice
 *
 * @typedef {object} UserActions
 * @property {Function} get
 */

/**
 * @typedef {object} UserSpecificSelectors
 * @property {import('../types.d').SelectorFactory<import('./AuthContext').AuthContext>} selectAuthContext
 * 
 * @typedef {import('../types.d').BaseSelectors<UserData> & UserSpecificSelectors} UserSelectors
 */

/**
 * @typedef {import('../types.d').StateSlice<UserActions, UserSelectors>} UserSlice
 */

export const KEY = 'USER_TYPES';