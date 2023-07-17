/**
 * @typedef object WCReimbursements
 * @property {string} WcReimbursementID
 * @property {string} PayeeName
 * @property {string} ClaimStatusTypeID
 * @property {string} VendorNumber
 * @property {string} MailingStreetAddress
 * @property {string} MailingStreetCity
 * @property {string} MailingStreetState
 * @property {string} MailingStreetZip
 * @property {string} Email
 * @property {string} Comment
 * @property {string} PaymentThrough

 *
 * @typedef {object} GetWCReimbursementDetail
 * @property {string} wCReimbursementID
 *
 *

 *
 * @typedef {object} WCReimbursementActions
 * @property {import('../types.d').SliceActionCreator<GetWCReimbursementActionArgs>} get
 *
 * @typedef {import('../types.d').BaseListSelectors<WCReimbursementActions>} WCReimbursementListSelectors
 *
 * @typedef {import('../types.d').StateSlice<WCReimbursementActions, WCReimbursementtSelectors>}  wcReimbursementSlice

 *
 **/

export const KEY = 'WC_REIMBURSEMENT'