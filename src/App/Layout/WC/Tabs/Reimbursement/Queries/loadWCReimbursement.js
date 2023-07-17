////import {
////    customGQLQuery
////} from '../../../../../Core/Services/EntityGateway'

////export const loadWCReimbursement = async (claimMasterID) => {
////    let query = {
////        "query": `
////                query {
////                    wcReimbursement(claimMasterID: "${claimMasterID}"){
////                        wCReimbursementID
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
////                        }
////                    }`

////    }
////    return await customGQLQuery(`wc-reimbursement`, query);
////};