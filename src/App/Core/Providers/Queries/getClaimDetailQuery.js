
export const getClaimDetailQuery = (id) => `
    query { 
        detail(id:"${id}") { 
            claimMasterID
            claimID
            claimPolicyID
            lossDesc
            ichronicleID
            batchID
            genReCompanyName
            dateReceived
            lossLocation
            dOL
            claimExaminerID
            deptCD
            policy {
                cancelDate
                claimsMadeDate
                clientBusinessName
                departmentCode
                effectiveDate
                expirationDate
                insuredCity
                insuredName
                insuredNameContinuation
                insuredState
                policyBranch
                underwriterID
            }
            examiner {
                branchID
                claimExaminerID
                claimUnitID
                emailAddress
                firstName
                lastName
                managerFirstName
                managerLastName
                managerID
            }
        } 
    }
`;