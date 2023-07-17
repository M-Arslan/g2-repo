import {
    customGQLQuery
} from '../../../Core/Services/EntityGateway';

export const loadClaimGridData = async (claimSearch, searchDataObj) => {

    let query = {
        "query": `query($claimMasterSearch:ClaimMasterSearchInputhype!)
            {
            `+ claimSearch + `(claimMasterSearch: $claimMasterSearch)
            {
                claimsMasterSearchResult{
                  claimMasterID
                  statutoryClaimID
                  g2LegalEntity
                  claimID                  
                  claimPolicyID
                  batchID
                  genReCompanyName
                  dateReceived
                  statusText
                  subCategory
                  selectedWorkflow
                  claimExaminerFirstName
                  claimExaminerLastName
                  insuredName
                  insuredNameContinuation
                  recipients
                  claimType
                  claimExaminerFullName
                }
            }
        }`,
        "variables": { "claimMasterSearch": searchDataObj }
    }
    const ClaimGridData = await customGQLQuery(`claim-master-search`, query);

    return ClaimGridData;
};


export const getDJClaimID = async () => {
    let query = {
        "query": `
            query {
               getDJClaimID{
                    claimID
                }
            }
            `
    }

    return await customGQLQuery(`claim-master`, query);
};

export const loadLegalClaimGridData = async (searchDataObj) => {

    let query = {
        "query": `query($legalSearch:LegalSearchInputType!)
            {
            legalSearch(legalSearch: $legalSearch)
            {
                legalSearchResult{
                  claimMasterID
                  claimID                  
                  insuredName
                  genReCompanyName
                  policyContractID
                  assignedToCounsel
                  claimCounselUserID
                  claimCounselFirstName
                  claimCounselLastName
                  claimCounselFullName
                  statusText
                  createdDate
                  statutoryClaimID
                }
            }
        }`,
        "variables": { "legalSearch": searchDataObj }
    }
    const LegalGridData = await customGQLQuery(`legal-search`, query);

    return LegalGridData;
};

export const loadWCGrdiData = async (searchDataObj) => {
    let query = {
        "query": `query($wcSearch:WCSearchInputType!)
            {
                wcSearch(wcSearch: $wcSearch)
                {
                    wcSearchResult{
                        claimMasterID
                        statutoryClaimID
                        g2LegalEntity
                        claimID
                        claimPolicyID
                        batchID
                        genReCompanyName
                        dateReceived
                        statusText
                        subCategory
                        selectedWorkflow
                        claimExaminerFirstName
                        claimExaminerLastName
                        insuredName
                        insuredNameContinuation
                        recipients
                        claimType
                        claimExaminerFullName
                    }
                }
            }`,
        "variables": { "wcSearch": searchDataObj }
    }
    const WCGridData = await customGQLQuery(`wc-search`, query);
    return WCGridData;
}