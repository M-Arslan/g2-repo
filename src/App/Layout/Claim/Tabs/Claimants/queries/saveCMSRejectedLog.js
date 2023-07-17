import {
    customGQLQuery
} from '../../../../../Core/Services/EntityGateway';

export const saveCMSRejectedLog = async (cMSRejectedLog) => {
    const query = {
        "query": "mutation($cMSRejectedLog:ClaimClaimantCMSRejectedLogInputType!) {saveCMSRejectedLog(cMSRejectedLog:$cMSRejectedLog){ claimantMedicareID cMSRejectLogID rejectDate rejectReason rejectedBy errorCorrectedBy correctedDate correctedComment createdDate createdBy modifiedDate modifiedBy }}",
        "variables": { "cMSRejectedLog": cMSRejectedLog }
    }


    return await customGQLQuery(`claim-claimant`, query);
}
