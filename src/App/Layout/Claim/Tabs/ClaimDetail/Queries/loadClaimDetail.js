import {
    customGQLQuery
} from '../../../../../Core/Services/EntityGateway';

export const loadClaimDetail = async (id) => {
    let query = {
        query: `query { 
                    detail(id:"${id}") { 
                        claimMasterID
                        claimID
                        claimPolicyID
                        claimType
                        lossDesc
                        fullDescriptionOfLoss
                        ichronicleID
                        batchID
                        genReCompanyName
                        dateReceived
                        lossLocation
                        lossLocationOutsideUsa
                        dOL
                        claimExaminerID
                        claimBranchID
                        g2LegalEntityID
                        statutoryClaimID
                        statutorySystem
                        kindOfBusinessID
                        policyComments
                        managingEntity
                        legalEntityManagerName
                        deptCD
                        uwDept
                        senderEmail
                        fALClaimStatusTypeID
                        extendedReportingPeriod
                        createdDate
                        createdBy
                        insuredName
                        insuredNameContinuation
                        clientClaimID
                        claimSettled
                        policy {
                            cancelDate
                            claimsMadeDate
                            clientBusinessName
                            departmentCode
                            effectiveDate
                            expirationDate
                            insuredCity
                            insuredName
                            insuredZip,
                            insuredStreetName,
                            insuredNameContinuation
                            insuredState
                            policyBranch
                            underwriterID
                            mailingCity
                            departmentName
                        }
                        examiner {
                            branchID
                            claimUnitID
                            emailAddress
                            businessPhone
                            firstName
                            lastName
                            managerFirstName
                            managerLastName
                            managerID
                        }
                        claimPolicy {
                            claimPolicyID
                            claimMasterID
                            policyID
                            insuredName
                            polEffDate
                            polExpDate
                            retroDate
                            createdDate
                            createdBy
                            active
                        }
                    } 
                }
            `
    };

    return await customGQLQuery('claim-master', query);
};
