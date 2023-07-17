import { PERMISSIONS } from '../../../Enumerations/security/permissions';
import {
    ensureNonNullObject
} from '../../../Utility/rules';
import {
    safeArray,
    safeObj
} from '../../../Utility/safeObject';

export const TOKEN_KEY = '_g2claims-access-token_';

/**
 * @class 
 */
export class AuthContext {

    /** @type {boolean} */
    #_authenticated;

    /** @type {boolean} */
    #_authorized;

    /** @type {import('./types.d').UserData} */
    #_authData;

    /**
     * Creates a new instance of the AuthContext class
     * @param {import('./types.d').UserData} authData
     */
    constructor(authData) {
        this.#_authenticated = (ensureNonNullObject(authData) ? authData.authenticated === true : false);
        this.#_authorized = (ensureNonNullObject(authData) ? authData.authorized === true : false);
        this.#_authData = Object.freeze({
            ...safeObj(authData),
            permissions: safeArray(safeObj(authData).permissions),
            roles: safeArray(safeObj(authData).roles),
            companies : safeArray(safeObj(authData).companies)
        });
    }

    /**
     * Information for the currently logged in user
     * @type {import('./types.d').UserInformation}
     */
    get currentUser() {
        return {
            id: this.#_authData.id,
            fullName: this.#_authData.fullName,
            emailAddress: this.#_authData.emailAddress,
        };
    }


    get defaultCompany() {
        return this.#_authData.companies.filter(x => x.Default)[0];
    }

    get userCompanies() {
        return this.#_authData.companies;
    }

    /**
     * Indicates whether or not the authentication process has completed.
     * @type {boolean}
     */
    get isAuthenticated() {
        return this.#_authenticated === true;
    }

    /**
     * Indicates whether the authentication process determined that the user may access the application
     * @type {boolean} 
     */
    get isAuthorized() {
        return this.#_authorized === true;
    }

    /**
     * The JWT for the current user session
     * @type {string}
     */
    get token() {
        return this.#_authData.token;
    }

    /**
     * Gets the highest access level granted for a specific app
     * @param {number} appId ID of the application in question
     * @returns {boolean}
     */
    getHighestAppPermissionFor(appId) {
        return this.#_authData.permissions.filter(p => ensureNonNullObject(p) && p.AppTypeID === appId).reduce((highest, perm) => {
            return (perm.PermissionLevelID > highest ? perm.PermissionLevelID : highest);
        }, 0);
    }

    /**
     * Determines if the user has at least a given permission for a given app
     * @param {number} appId
     * @param {number} permission
     * @returns {boolean}
     */
    hasPermission(appId, permission = PERMISSIONS.VIEWER) {
        return (this.getHighestAppPermissionFor(appId) >= permission);
    }

    /**
     * Determines if this user has a given role
     * @param {number} roleId
     * @returns {boolean}
     */
    isInRole(roleId) {
        return this.#_authData.roles.includes(roleId);
    }

    /**
     * Determines if the user has any of the given roles
     * @param {...number} roleIds
     * @returns {boolean}
     */
    isInAnyRole(...roleIds) {
        return safeArray(roleIds).some(ri => safeArray(this.#_authData.roles).includes(ri));
    }

    /**
     * Determines if a given app should be reaonly for this user
     * @param {number} appId
     * @returns {boolean}
     */
    isReadOnly(appId) {
        return this.getHighestAppPermissionFor(appId) < PERMISSIONS.CONTRIBUTOR;
    }
}
