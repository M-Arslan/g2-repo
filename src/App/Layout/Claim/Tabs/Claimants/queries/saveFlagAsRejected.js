import {
    customGQLQuery
} from '../../../../../Core/Services/EntityGateway';

export const saveFlagAsRejected = async (claimantMedicareID,rejectionReason) => {
    const query = {
        "query": 'mutation { flagAsRejected(claimantMedicareID:"' + claimantMedicareID + '",rejectionReason:"' + rejectionReason + '"){ claimantMedicareID cMSRejectLogID rejectDate rejectReason rejectedBy errorCorrectedBy correctedDate correctedComment createdDate createdBy modifiedDate modifiedBy}}'
    }
    return await customGQLQuery(`claim-claimant`, query);
}
