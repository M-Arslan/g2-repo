import {
    customGQLQuery
} from '../../../../../Core/Services/EntityGateway';

export const loadClaimDetailForOpenActivity = async (id) => {
    let query = {
        query: `query { 
                    detail(id:"${id}") { 
                        claimMasterID
                        claimID
                        claimPolicyID
                        claimExaminerID
                        lossLocation
                        lossLocationOutsideUsa
                        dateReceived
                        dOL
                        lossDesc
                        fullDescriptionOfLoss
                        fALClaimStatusTypeID
                        claimPolicy {
                            claimPolicyID
                            policyID
                            insuredName
                            polEffDate
                            polExpDate
                            createdDate
                            createdBy
                        }
                    } 
                }
            `
    };

    return await customGQLQuery('claim-master', query);
};


