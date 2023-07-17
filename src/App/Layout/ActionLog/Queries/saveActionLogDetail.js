import {
    customGQLQuery
} from '../../../Core/Services/EntityGateway';
import { ACTION_TYPES } from '../../../Core/Enumerations/app/action-type';
export const saveActionLogDetail = async (actionlog) => {
    const query = {
        "query": "mutation($actionlog:ActionLogInputType!) {create(actionLog:$actionlog){actionLogID actionTypeID claimMasterID createdBy createdDate subID}}",
        "variables": { "actionlog": actionlog }
    }

    return await customGQLQuery(`actionlog`, query);
}

export const createActionLogForFacRIChecked = async (claimMasterID) => {
    return saveActionLogDetail({ claimMasterID: claimMasterID, actionTypeID: ACTION_TYPES.Fac_RI_Checked });
}

export const createActionLogForDeductibleRequested = async (claimMasterID) => {
    return saveActionLogDetail({ claimMasterID: claimMasterID, actionTypeID: ACTION_TYPES.Deductible_Requested});
};

export const createActionLogForInitialRiRequest = async (claimMasterID) => {
    return saveActionLogDetail({ claimMasterID: claimMasterID, actionTypeID: ACTION_TYPES.Initial_RI_Notice_Requested});
};

export const createActionLogForFileCIB = async (claimMasterID,claimantID) => {
    return saveActionLogDetail({ claimMasterID: claimMasterID, actionTypeID: ACTION_TYPES.File_CIB, subID: claimantID });
}

export const createActionLogForFlagAsMedicareEligibleAndInformCE = async (claimMasterID, claimantID) => {
    return saveActionLogDetail({ claimMasterID: claimMasterID, actionTypeID: ACTION_TYPES.Flag_as_Medicare_Eligible_and_Inform_CE, subID: claimantID });
}

export const createActionLogForFlagAsRejectedByISOAndInformCE = async (claimMasterID, claimantID) => {
    return saveActionLogDetail({ claimMasterID: claimMasterID, actionTypeID: ACTION_TYPES.Flag_as_Rejected_by_CMS_and_Inform_CE, subID: claimantID });
}

export const createActionLogForFinacialActivityType = async (claimMasterID, actionTypeID, activityTypeID) => {
    return saveActionLogDetail({ claimMasterID: claimMasterID, actionTypeID: actionTypeID, subID: activityTypeID });
}
export const createActionLogForReportToISO = async (claimMasterID, claimantID) => {
    return saveActionLogDetail({ claimMasterID: claimMasterID, actionTypeID: ACTION_TYPES.Report_to_CMS, subID: claimantID });
}
export const createActionLogForReportedToCMS = async (claimMasterID, claimantID) => {
    return saveActionLogDetail({ claimMasterID: claimMasterID, actionTypeID: ACTION_TYPES.Reported_to_CMS, subID: claimantID });
}
export const createActionLogForReportingToCMSNotRequired = async (claimMasterID, claimantID) => {
    return saveActionLogDetail({ claimMasterID: claimMasterID, actionTypeID: ACTION_TYPES.Reporting_to_CMS_Not_Required, subID: claimantID });
}
export const createActionLogForFALStatusChangeNew = async (claimMasterID) => {
    return saveActionLogDetail({ claimMasterID: claimMasterID, actionTypeID: ACTION_TYPES.Set_FAL_Status_to_New });
}
export const createActionLogForFALStatusChangeAssigned = async (claimMasterID) => {
    return saveActionLogDetail({ claimMasterID: claimMasterID, actionTypeID: ACTION_TYPES.Set_FAL_Status_to_Assigned });
}
export const createActionLogForFALStatusChangeClosed = async (claimMasterID) => {
    return saveActionLogDetail({ claimMasterID: claimMasterID, actionTypeID: ACTION_TYPES.Set_FAL_Status_to_Closed });
}
