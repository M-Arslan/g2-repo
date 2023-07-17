import {
    customGQLQuery
} from '../../../../../Core/Services/EntityGateway';

export const loadFinancialDetail = async (claimantID) => {
    let query = {
        "query": `
            query {
               financialDetail(claimMasterID:"${claimantID}"){ 
                    claimMasterID
                    createdBy
                    createdDate
                    deductibleAmount
                    deductibleAmountRemaining
                    deductibleApplies
                    deductibleHasBeenMet
                    deductibleMasterPolicies
                    doNotSetDeductibleReserve
                    facRIApplies
                    financialID
                    modifiedBy
                    modifiedDate
                    salvageSubroAmountCollected
                    salvageSubroApplies
                    salvageSubroCollected
                    salvageSubroDateCollected
                    salvageSubroDemand
                    salvageSubroDemandDate
                    salvageSubroRemarks
                    sIRAmount
                    sIRApplies
                    treatyRIApplies
                    supplementalPaymentLimit
                    supplementalPaymentRemaining
                    initialRINoticeComment
                    deductibleCollectionAmount
                    specialCoverages
                    specialCoverageType
                    offsetApplies
                    offsetType
                } 
            }
            `
    }

    return await customGQLQuery(`accounting`, query);
};


export const loadFinancialDB2Detail = async (claimID) => {
    let query = {
        "query": `
            query {
               financialsDB2(claimID:"${claimID}"){ 
                    claimID
                    deductableRecoverable
                    deductableRecovered
                    expenseReserves
                    lossReserves
                    paidExpense
                    paidLoss
                    reinsuranceRecoverable
                    reinsuranceRecovered
                    reinsuranceReserves
                    statusCode
                    statusText
                } 
            }
            `
    }

    return await customGQLQuery(`accounting`, query);
};