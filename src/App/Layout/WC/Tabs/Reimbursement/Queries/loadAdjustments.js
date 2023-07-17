////import {
////    customGQLQuery
////} from '../../../../../Core/Services/EntityGateway'

////export const loadAdjustments = async (wCReimbursementID) => {
////    let query = {
////        "query": `
////                query {
////                    reimbursementAdjustments(wCReimbursementID: "${wCReimbursementID}"){
////                        reimbursementAdjustmentID
////                        wCReimbursementID
////                        claimStatusTypeID
////                        adjustmentType
////                        amountAdjusted
////                        adjustmentExplanation
////                        billingDate
////                        }
////                    }`
////    }
////    return await customGQLQuery(`wc-reimbursement-adjustments`, query);
////};