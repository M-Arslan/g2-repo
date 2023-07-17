/**
 * @typedef {object} Contact
 * @property {string} claimContactID
 * @property {string} claimMasterID
 * @property {string} resourceID
 * @property {string} contactType
 * @property {string} name
 * @property {string} attn
 * @property {string} address1
 * @property {string} address2
 * @property {string} city
 * @property {string} state
 * @property {string} zip
 * @property {string} phone
 * @property {string} emailAddress
 * @property {string} comment
 * @property {string} createdBy
 * @property {string} createdDate
 * 
 */

/**
 * @typedef {object} GetContactsArgs
 * @property {string} claimMasterId 
 */

/**
 * @callback GetContactsCreator
 * @param {GetContactsArgs} args
 * @returns {import('redux').Action}
 */

/**
 * @typedef {object} SaveContactArgs
 * @property {Contact} data
 */

/** 
 * @callback SaveContactCreator
 * @param {SaveContactArgs} args
 * @returns {import('redux').Action}
 */

/** 
 * @typedef {object} DeleteContactArgs
 * @property {string} id
 */

/**
 * @callback DeleteContactCreator
 * @param {DeleteContactArgs} args
 * @returns {import('redux').Action}
 */

/**
 * Actions for the Contact slice
 *
 * @typedef {object} ContactActions
 * @property {GetContactsCreator} get
 * @property {SaveContactCreator} save
 * @property {DeleteContactCreator} delete
 */

/**
 * @typedef {import('../types.d').BaseListSelectors<Contact>} ContactSelectors
 */

/**
 * @typedef {import('../types.d').StateSlice<ContactActions, ContactSelectors>} ContactSlice
 */

export const KEY = 'CONTACT_TYPES';