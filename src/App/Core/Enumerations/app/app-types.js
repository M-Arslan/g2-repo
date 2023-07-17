import {
    flipObject
} from '../../Utility/flipObject';

export const APP_TYPES = Object.freeze({
    Claimant: 0,
    Financials: 1,
    FinancialsActivityType: 2,
    Administration: 4,
    File_Activity_Log: 5,
    Loss_Coding: 6,
    Notifications: 7,
    Contacts: 8,
    Litigation: 9,
    Assoc_Claims: 10,
    Claimant_Details: 11,
    Medicare_Details: 12,
    Medicare_Payment: 13,
    Medicare_Attorney: 14,
    CMS_Rejected_Logs: 15,
    CIB_Details: 16,
    Expense_Dashboard: 17,
    Legal_Dashboard: 18,
    Accounting_Dashboard: 19,
    Claim_Dashboard: 20,
    Claim_Detail: 21,
    Correspondence: 22,
    Property_Policy: 23,
    Property_Insurance_Loss_Register: 24,
    Legal_Claim_Detail: 25,
    UL_Claim_Detail: 26,
    Associated_Policies_Contracts: 27,
    Court_Suit_Information: 28,
    WC_Claimant: 29,
    WC_Reimbursement: 30
});

export const APP_TYPES_LOOKUP = Object.freeze(flipObject(APP_TYPES));