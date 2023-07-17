import {
    customGQLQuery
} from '../../../../../Core/Services/EntityGateway';

export const loadClaimDetailForCIB = async (id) => {
    let query = {
        query: `query { 
                    detail(id:"${id}") { 
                        claimMasterID
                        claimID
                        claimPolicyID
                        claimExaminerID
                        lossDesc
                        lossLocation
                        lossLocationOutsideUsa
                        dOL
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
