////import {
////    customGQLQuery
////} from '../../../../../Core/Services/EntityGateway'

////export const loadReimbursementCompanyDollar = async (wCReimbursementID) => {
////    debugger;
////    let query = {
////        "query": `
////                query {
////                    reimbursementCompanyDollars(wCReimbursementID: "${wCReimbursementID}"){
////                        reimbursementCompanyDollarID
////                        wCReimbursementID
////                        wCClaimantID
////                        outstandingIndemnityReserves
////                        subrogation
////                        paidToDateMedical
////                        paidToDateIndemnity
////                        paidToDateExpense
////                        outstandingMedicalReserves
////                        secondInjuryFund
////                        totalLossPaid
////                        totalOutstandingLossReserves
////                        outstandingExpenseReserves
////                        comments
////                        wCClaimant{
////                            wCClaimantID
////                            claimMasterID
////                            claimantName
////                            dateOfBirth
////                            gender
////                            deceased
////                            tabular
////                            esclating
////                            tableType
////                            comments
////                            tabularEndReason
////                            dateOfDeath
////                            tabularStartDate
////                            tabularEndDate
////                            createdDate
////                            createdBy
////                            modifiedDate
////                            modifiedBy
////                        }
////                        }
////                    }`

////    }
////    return await customGQLQuery(`wc-reimbursement-company-dollar`, query);
////};