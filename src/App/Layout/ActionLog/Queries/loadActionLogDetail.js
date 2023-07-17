import {
    customGQLQuery
} from '../../../Core/Services/EntityGateway';
import { ACTION_TYPES } from '../../../Core/Enumerations/app/action-type';


export const loadActionLogDetail = async (claimMasterID, actionTypeID, subID) => {
    let query = {
        "query": `
            query {
               latestActionLog(claimMasterID:"${claimMasterID}",actionTypeID:"${actionTypeID}",subID:"${subID}"){ 
                actionLogID
                actionTypeID
                claimMasterID
                createdBy
                createdDate
                subID                
                } 
            }
            `
    }

    return await customGQLQuery(`actionlog`, query);
};

export const loadActionLogForFacRIChecked = async (claimMasterID) => {
    return loadActionLogDetail(claimMasterID, ACTION_TYPES.Fac_RI_Checked,"")
}
export const loadActionLogForDeductibleRequested = async (claimMasterID) => {
    return loadActionLogDetail(claimMasterID, ACTION_TYPES.Deductible_Requested, "")
}
export const loadActionLogForInitialRiRequest = async (claimMasterID) => {
    return loadActionLogDetail(claimMasterID, ACTION_TYPES.Initial_RI_Notice_Requested, "")
}
export const loadActionLogForFinancialActivityLog = async (claimMasterID, activityID) => {
    return loadActionLogDetail(claimMasterID, -1, activityID)
}

export const loadActionLogList = async (claimMasterID, subID) => {
    let query = {
        "query": `
            query {
               actionLogList(claimMasterID:"${claimMasterID}",subID:"${subID}"){
                actionLogID
                actionTypeID
                claimMasterID
                createdBy
                createdDate
                subID
                actionTypeText
                firstName
                lastName
                } 
            }
            `
    }

    return await customGQLQuery(`actionlog`, query);
};