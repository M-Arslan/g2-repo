/**
 * Claim Master object schema
 *
 * @typedef {object} ClaimMaster
 * @property {string} claimMasterID
 * @property {string} claimID
 * @property {string} claimPolicyID
 * @property {string} claimType
 * @property {string} lossDesc
 * @property {string} fullDescriptionOfLoss
 * @property {string} ichronicleID
 * @property {string} batchID
 * @property {string} genReCompanyName
 * @property {string} dateReceived
 * @property {string} lossLocation
 * @property {string} lossLocationOutsideUsa
 * @property {string} dOL
 * @property {string} claimExaminerID
 * @property {string} claimBranchID
 * @property {number} g2CompanyNameID
 * @property {number} g2LegalEntityID
 * @property {string} managingEntity
 * @property {string} claimSettled
 * @property {string} legalEntityManagerName
 * @property {string} deptCD
 * @property {string} uwDept
 * @property {string} senderEmail
 * @property {number} fALClaimStatusTypeID
 * @property {string} extendedReportingPeriod
 * @property {string} createdDate
 * @property {string} createdBy
 * @property {string} insuredName
 * @property {string} insuredNameContinuation
 * @property {boolean} manuallyCreated
 * @property {object} policy
 * @property {string} policy.cancelDate
 * @property {string} policy.claimsMadeDate
 * @property {string} policy.clientBusinessName
 * @property {string} policy.departmentCode
 * @property {string} policy.effectiveDate
 * @property {string} policy.expirationDate
 * @property {string} policy.insuredCity
 * @property {string} policy.insuredName
 * @property {string} policy.insuredZip
 * @property {string} policy.insuredStreetName
 * @property {string} policy.insuredNameContinuation
 * @property {string} policy.insuredState
 * @property {string} policy.policyBranch
 * @property {string} policy.underwriterID
 * @property {string} policy.mailingCity
 * @property {string} policy.departmentName
 * @property {object} claimPolicy
 * @property {string} claimPolicy.claimPolicyID
 * @property {string} claimPolicy.claimMasterID
 * @property {string} claimPolicy.policyID
 * @property {string} claimPolicy.insuredName
 * @property {string} claimPolicy.polEffDate
 * @property {string} claimPolicy.polExpDate
 * @property {string} claimPolicy.retroDate
 * @property {string} claimPolicy.createdDate
 * @property {string} claimPolicy.createdBy
 * @property {string} claimPolicy.active
 * @property {object} examiner
 * @property {string} examiner.branchID
 * @property {string} examiner.claimUnitID
 * @property {string} examiner.emailAddress
 * @property {string} examiner.businessPhone
 * @property {string} examiner.firstName
 * @property {string} examiner.lastName
 * @property {string} examiner.managerID
 * @property {string} examiner.managerFirstName
 * @property {string} examiner.managerLastName
 */

/**
 * Save Claim args
 * 
 * @typedef {object} SaveClaimArgs
 * @property {ClaimMaster} claim
 */

/**
 * Save Claim action
 * 
 * @callback SaveClaim
 * @param {SaveClaimArgs} args
 * @returns {import('redux').Action<ClaimMaster>}
 */

/**
 * Get Claim action
 * 
 * @callback GetClaim
 * @returns {import('redux').Action<ClaimMaster>}
 */

/**
 * Stuff Claim Action
 * 
 * @callback StuffClaim
 * @param {ClaimMaster} claim
 * @returns {import('redux').Action<ClaimMaster>} 
 */

/**
 * Actions available for the Claim slice 
 * 
 * @typedef {object} ClaimActions
 * @property {StuffClaim} stuff
 * @property {GetClaim} get
 * @property {SaveClaim} save
 */

/** @typedef {import('../types.d').BaseSelectors<ClaimMaster>} ClaimSelectors */

/** @typedef {import('../types.d').StateSlice<ClaimActions, ClaimSelectors>} ClaimSlice */

export const key = 'CLAIM_TYPES';