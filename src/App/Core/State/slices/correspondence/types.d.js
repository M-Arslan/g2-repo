/**
 * @typedef {object} Correspondence
 * @property {string} correspondenceID
 * @property {string} claimMasterID
 * @property {string} from
 * @property {string} to
 * @property {string} [cc]
 * @property {string} [bcc]
 * @property {string} subject
 * @property {string} body
 * @property {object} rawData
 * @property {string} [fileName]
 * @property {string} templateName
 * @property {boolean} [addToDocumentum=false]
 * @property {0|1} status
 * @property {string} createdBy
 * @property {string} createdDate
 * 
 */

/**
 * @typedef {object} GetCorrespondenceArgs
 * @property {string} claimMasterId 
 */

/**
 * @callback GetCorrespondenceCreator
 * @param {GetCorrespondenceArgs} args
 * @returns {import('redux').Action}
 */

/**
 * @typedef {object} SaveCorrespondenceArgs
 * @property {Correspondence} data
 */

/** 
 * @callback SaveCorrespondenceCreator
 * @param {SaveCorrespondenceArgs} args
 * @returns {import('redux').Action}
 */

/** 
 * @typedef {object} DeleteCorrespondenceArgs
 * @property {string} id
 */

/**
 * @callback DeleteCorrespondenceCreator
 * @param {DeleteCorrespondenceArgs} args
 * @returns {import('redux').Action}
 */

/**
 * Actions for the Correspondence slice
 *
 * @typedef {object} CorrespondenceActions
 * @property {GetCorrespondenceCreator} get
 * @property {SaveCorrespondenceCreator} save
 * @property {DeleteCorrespondenceCreator} delete
 */

/**
 * @typedef {import('../types.d').BaseListSelectors<Correspondence>} CorrespondenceSelectors
 */

/**
 * @typedef {import('../types.d').StateSlice<CorrespondenceActions, CorrespondenceSelectors>} CorrespondenceSlice
 */

export const KEY = 'CORRESPONDENCE_TYPES';