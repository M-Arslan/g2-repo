/**
 * @typedef {object} PropertyPolicy
 * @property {string} propertyPolicyID
 * @property {string} claimMasterID
 * @property {string} policyForms
 * @property {number} limits
 * @property {number} coinsurance
 * @property {number} deductible
 * @property {string} generalStarSharedPercent
 * @property {string} lossAddressStreet1
 * @property {string} lossAddressStreet2
 * @property {string} lossAddressCity
 * @property {string} lossAddressState
 * @property {string} lossAddressZIP
 * @property {string} lossAddressCounty
 * @property {string} salvage
 * @property {string} restitution
 * @property {string} subrogation
 * @property {string} subroDemand,
 * @property {string} subroRecovered
 * @property {string} subrogationOpenDate
 * @property {string} subrogationClosingDate
 * @property {string} subrogationDiaryDate
 * @property {string} mortgageHolder
 * @property {string} lienHolder
 * @property {string} debtor
 * @property {string} comment
 * @property {Date} createdDate
 * @property {string} createdBy
 * @property {Date} modifiedDate
 * @property {string} modifiedBy
 * 
 */

/**
 * @typedef {object} GetPropertyPolicyArgs
 * @property {string} claimMasterID
 */

/**
 * @callback GetPropertyPolicyCreator
 * @param {GetPropertyPolicyArgs} args
 * @returns {import('redux').Action}
 */

/**
 * @typedef {object} SavePropertyPolicyArgs
 * @property {PropertyPolicy} log
 */

/** 
 * @callback SavePropertyPolicyCreator
 * @param {SavePropertyPolicyArgs} args
 * @returns {import('redux').Action}
 */

/**
 * Actions for the PropertyPolicy slice
 *
 * @typedef {object} PropertyPolicyActions
 * @property {GetPropertyPolicyCreator} get
 * @property {SavePropertyPolicyCreator} save
 */

/**
 * @typedef {import('../types.d').BaseSelectors<PropertyPolicy>} PropertyPolicySelectors
 */

/**
 * @typedef {import('../types.d').StateSlice<PropertyPolicyActions, PropertyPolicySelectors>} PropertyPolicySlice
 */

export const KEY = 'PROPERTYPOLICY_TYPES';