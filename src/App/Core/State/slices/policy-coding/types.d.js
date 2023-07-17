/**
 * @typedef {object} ExcessPolicyCoding
 * @property {number} aggregateLimit
 * @property {number} attachmentTypeCode
 * @property {string} classCode
 * @property {string} className
 * @property {string} coverageCode
 * @property {string} formOfCoverageCode
 * @property {number} perOccuranceLimit
 * @property {number} uLLimit
 * 
 * 
 * @typedef {object} FacilitiesPGMPolicyCoding
 * @property {number} aggregateLimit
 * @property {number} attachmentTypeCode
 * @property {string} classCode
 * @property {string} className
 * @property {string} coverageCode
 * @property {string} formOfCoverageCode
 * @property {number} perOccuranceLimit
 *
 * 
 * @typedef {object} FacilitiesPolicyCoding
 * @property {number} aggregateLimit
 * @property {number} attachmentTypeCode
 * @property {string} classCode
 * @property {string} className
 * @property {string} coverageCode
 * @property {string} formOfCoverageCode
 * @property {number} perOccuranceLimit
 * @property {string} propertyDeductible
 * @property {string} casualtyDeductible
 * 
 * 
 * @typedef {object} MedicalProfPolicyCoding
 * @property {number} aggregateLimit
 * @property {number} attachmentTypeCode
 * @property {string} classCode
 * @property {string} className
 * @property {string} coverageCode
 * @property {string} formOfCoverageCode
 * @property {number} perOccuranceLimit
 * 
 *
 * @typedef {object} PrimaryPolicyCoding
 * @property {number} aggregateLimit
 * @property {number} attachmentTypeCode
 * @property {string} classCode
 * @property {string} className
 * @property {string} coverageCode
 * @property {string} formOfCoverageCode
 * @property {number} perOccuranceLimit
 * @property {string} casualtyDeductible
 * 
 *
 * @typedef {object} PropertyPolicyCoding
 * @property {number} aggregateLimit
 * @property {number} attachmentTypeCode
 * @property {string} classCode
 * @property {string} className
 * @property {string} coverageCode
 * @property {string} formOfCoverageCode
 * @property {number} perOccuranceLimit
 * @property {string} propertyDeductible
 */

/**
 * @typedef {object} GetPolicyCodingArgs
 * @property {string} policyID 
 * @property {number} dept
 */

/**
 * @callback GetPolicyCodingCreator
 * @param {GetPolicyCodingArgs} args
 * @returns {import('redux').Action}
 */

/**
 * Actions for the Policy Codings slice
 *
 * @typedef {object} PolicyCodingActions
 * @property {GetPolicyCodingCreator} get
 */

/**
 * @typedef {import('../types.d').BaseListSelectors<ExcessPolicyCoding|FacilitiesPGMPolicyCoding|FacilitiesPolicyCoding|MedicalProfPolicyCoding|PrimaryPolicyCoding|PropertyPolicyCoding>} PolicyCodingSelectors
 */

/**
 * @typedef {import('../types.d').StateSlice<PolicyCodingActions, PolicyCodingSelectors>} PolicyCodingSlice
 */

export const KEY = 'POLICY_CODING_TYPES';