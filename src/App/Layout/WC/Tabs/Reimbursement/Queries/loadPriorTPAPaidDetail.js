////import {
////    customGQLQuery
////} from '../../../../../Core/Services/EntityGateway';

////export const loadPriorTPAPaidDetail = async (reimbursementPriorTPAID) => {
////    let query = {
////        "query": `
////            query {
////               detail(reimbursementPriorTPAID:"${reimbursementPriorTPAID}"){
////                        reimbursementPriorTPAID
////                        wCReimbursementID
////                        paidToDateIndemnity
////                        outstandingLossReserves
////                        paidToDateMedical
////                        outstandingMedicalReserves
////                        paidToDateExpense
////                        outstandingExpenseReserves
////                        totalLossPaid
////                        totalOutstandingLossReserves
////                } 
////            }
////            `
////    }

////    return await customGQLQuery(`wc-reimbursement-prior-tpa-paid`, query);
////};
