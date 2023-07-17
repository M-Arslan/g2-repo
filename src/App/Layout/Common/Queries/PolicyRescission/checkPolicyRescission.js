import {
    GQL_SCHEMAS,
    GraphOperation
} from '../../../../Core/Providers/GraphQL';
import {
    customGQLQuery
} from '../../../../Core/Services/EntityGateway'
export const checkPolicyRescission = async (claimPolicyID) => {
    let query = {
        query: `query { 
                    getPolicyRescission(claimPolicyID:"${claimPolicyID}") {
                        policyRescissionID
                        policyNumber
                        insuredName
                        initialPolicyEffDT
                        initialPolicyExpDT
                        uWAreaDesc
                        premiumReturn
                        limits
                        comments
                        uWUnitManager
                        processCompleted
                        policyDisposition
                        claimManager
                        legalUnitExaminer
                        createdBy
                        createdDate
                        modifiedBy
                        modifiedDate
                    } 
                }
            `
    };
    return await customGQLQuery('policy-rescission', query);
}