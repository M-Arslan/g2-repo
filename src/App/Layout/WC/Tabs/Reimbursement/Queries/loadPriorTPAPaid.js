////import {
////    customGQLQuery
////} from '../../../../../Core/Services/EntityGateway'

////export const loadPriorTPAPaid = async (wCReimbursementID) => {
////    debugger;
////    let query = {
////        "query": `
////                query {
////                    reimbursementPriorTPA(wCReimbursementID: "${wCReimbursementID}"){
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
////                        }
////                    }`

////    }
////    return await customGQLQuery(`wc-reimbursement-prior-tpa-paid`, query);
////};