/**
 * @typedef object associatedPolicyContract
 * @property {string} AssociatedPolicyID
 * @property {string} ClaimMasterID
 * @property {string} AssociationTypeID
 * @property {string} PolicyID
 * @property {string} ContractID
 * @property {string} InsuredName
 * @property {string} UnderwriterID
 * @property {string} EffectiveDate
 * @property {string} ExpirationDate
 * @property {string} CancelledDate
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

export const KEY = 'ASSOCIATED_POLICY_CONTRACT';

