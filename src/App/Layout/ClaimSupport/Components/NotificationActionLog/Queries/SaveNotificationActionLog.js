import { customGQLQuery } from "../../../../../Core/Services/EntityGateway";

export const SaveNotificationActionLog = async (actionlog) => {
    const query = {
        "query": "mutation($actionlog:ActionLogInputType!) {create(actionLog:$actionlog){actionLogID actionTypeID claimMasterID createdBy createdDate subID}}",
        "variables": { "actionlog": actionlog }
    }

    return await customGQLQuery(`actionlog`, query);
}