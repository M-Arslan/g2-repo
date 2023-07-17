import {
    customGQLQuery
} from '../../../../../Core/Services/EntityGateway';

export const saveIssueLogs = async (issueLog) => {
    const query = {
        "query": "mutation($issueLog:IssueLogInputType!) {createIssueLog(issueLog:$issueLog){issueTypeID}}",
        "variables": { "issueLog": issueLog }
    }
    return await customGQLQuery(`accounting`, query);
}
