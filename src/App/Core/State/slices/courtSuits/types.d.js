/**
 * @typedef object CourtSuits
 * @property {string} CourtSuitInfoID
 * @property {string} ClaimMasterID
 * @property {string} LegalCaseCaption
 * @property {string} LegalCaseDocketNumber
 * @property {string} State
 * @property {string} Venue
 * @property {string} CourtName
 * @property {string} UlCaseCaption
 * @property {string} UlCaseDocketNumber
 * @property {string} UlClaimState
 * @property {string} UlVenue
 * @property {string} UlCourtName
 * @property {string} TrialDate
 * @property {string} UlTrialDate
 * @property {string} CaseComment
 * @property {string} MediationDate
 * @property {string} MediationComment
 * @property {string} UlMediationDate
 * @property {string} UlMediationComment
 * @property {string} CaseSettled
 * @property {string} AmountGlobalSettlement
 * @property {string} AmountWePaidInSettlement
 * @property {string} ClosingComment
 * @property {string} JudgementBeforeTrial
 * @property {string} JudgementAfterTrial
 * @property {string} JudgementNone
 * @property {string} TotalPaidLegalClaimFile
 * @property {string} TotalPaidULClaimFile
 *
 * @typedef {object} GetCourtSuitsActionArgs
 * @property {string} claimMasterID
 * 
 * 

 * 
 * @typedef {object} CourtSuitsActions
 * @property {import('../types.d').SliceActionCreator<GetCourtSuitsActionArgs>} get
 * @property {import('../types.d').SliceActionCreator<GetCourtSuitsActionArgs>} save
 *
 * @typedef {import('../types.d').BaseListSelectors<CourtSuits>} CourtSuitsSelectors
 * 
 * @typedef {import('../types.d').StateSlice<CourtSuitsActions, CourtSuitsSelectors>}  CourtSuitsSlice
 
 *   
 **/


