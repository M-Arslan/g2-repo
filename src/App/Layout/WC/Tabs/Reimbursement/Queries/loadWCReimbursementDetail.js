////import {
////    customGQLQuery
////} from '../../../../../Core/Services/EntityGateway';

////export const loadWCReimbursementDetail = async (wCReimbursementID) => {
////    let query = {
////        "query": `
////            query {
////               detail(wCReimbursementID:"${wCReimbursementID}"){
////                        wCReimbursementID
////                        claimMasterID
////                        payeeName
////                        claimStatusTypeID
////                        vendorNumber
////                        mailingStreetAddress
////                        mailingStreetCity
////                        mailingStreetState
////                        mailingStreetZip
////                        email
////                        comment
////                        paymentThrough
////                        createdDate
////                        createdBy
////                        modifiedDate
////                        modifiedBy
////                } 
////            }
////            `
////    }

////    return await customGQLQuery(`wc-reimbursement`, query);
////};
