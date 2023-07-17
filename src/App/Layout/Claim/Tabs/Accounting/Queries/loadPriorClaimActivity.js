import {
    customGQLQuery
} from '../../../../../Core/Services/EntityGateway';

export const loadPriorClaimActivity = async (claimMasterID) => {
    let query = {
        "query": `
            query {
               accountingList(claimMasterID:"${claimMasterID}"){ 
                    activityID
                    claimMasterID
                    accountingTransTypeID
                    accountingTransTypeText
                    activityCreatedDate
                    statusText
                    statusDate
                    activityCreatedByFullName
                    activityCreatedBy
                    activityCreatedByFirstName
                    activityCreatedByLastName
                } 
            }
            `
    }

    return await customGQLQuery(`accounting`, query);
};

export const loadPriorClaimActivityForPILR = async (claimMasterID) => {
    let query = {
        "query": `
            query {
               accountingListForPILR(claimMasterID:"${claimMasterID}"){ 
                    activityID
                    claimMasterID
                    accountingTransTypeID
                    accountingTransTypeText
                    activityCreatedDate
                    statusText
                    statusDate
                    activityCreatedBy
                    activityCreatedByFirstName
                    activityCreatedByLastName
                    claimStatusTypeID
                } 
            }
            `
    }

    return await customGQLQuery(`accounting`, query);
};

