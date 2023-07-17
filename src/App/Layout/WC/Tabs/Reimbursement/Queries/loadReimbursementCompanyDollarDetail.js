////import {
////    customGQLQuery
////} from '../../../../../Core/Services/EntityGateway';

////export const loadReimbursementCompanyDollarDetail = async (reimbursementCompanyDollarID) => {
////    let query = {
////        "query": `
////            query {
////               detail(reimbursementCompanyDollarID:"${reimbursementCompanyDollarID}"){
////                        reimbursementCompanyDollarID
////                        wCReimbursementID
////                        wCClaimantID
////                        outstandingIndemnityReserves
////                        subrogation
////                        paidToDateMedical
////                        paidToDateIndemnity
////                        outstandingMedicalReserves
////                        secondInjuryFund
////                        totalLossPaid
////                        paidToDateExpense
////                        totalOutstandingLossReserves
////                        outstandingExpenseReserves
////                        comments
////                        createdDate
////                        createdBy
////                        modifiedDate
////                        modifiedBy
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
////                } 
////            }
////            `
////    }

////    return await customGQLQuery(`wc-reimbursement-company-dollar`, query);
////};
