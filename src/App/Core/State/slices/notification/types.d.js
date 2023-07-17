/**
 * @typedef object associatedPolicyContract
 * @property {string} supportTypeID
 * @property {string} supportTypeText
 * @property {string} taskTypeID
 * @property {string} sequenceNumber
 * @property {string} active
 * @property {string} createdBy
 * @property {string} createdDate
 * @property {string} modifiedBy
 * @property {string} modifiedDate
 *
 * @typedef {object} GetAssociatedPolicyContractArgs
 * @property {string} claimMasterID
 *
 *

 *
 * @typedef {object} associatedPolicyContractActions
 * @property {import('../types.d').SliceActionCreator<GetAssociatedPolicyContractArgs>} get
 *
 * @typedef {import('../types.d').BaseListSelectors<associatedPolicyContract>} associatedPolicyContractSelectors
 *
 * @typedef {import('../types.d').StateSlice<associatedPolicyContractActions, associatedPolicyContractSelectors>} associatedPolicyContractSlice

 *
 **/

export const KEY = 'SUPPORT_TYPE_TYPES';