////import {
////    customGQLQuery
////} from '../../../../../Core/Services/EntityGateway';

////export const loadAdjustmentDetail = async (reimbursementAdjustmentID) => {
////    let query = {
////        "query": `
////            query {
////               detail(reimbursementAdjustmentID:"${reimbursementAdjustmentID}"){
////                       reimbursementAdjustmentID
////                        wCReimbursementID
////                        claimStatusTypeID
////                        adjustmentType
////                        amountAdjusted
////                        adjustmentExplanation
////                        billingDate
////                } 
////            }
////            `
////    }

////    return await customGQLQuery(`wc-reimbursement-adjustments`, query);
////};
