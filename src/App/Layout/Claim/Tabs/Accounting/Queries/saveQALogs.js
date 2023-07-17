import {
    customGQLQuery
} from '../../../../../Core/Services/EntityGateway';

export const saveQALogs = async (qALog) => {
    const query = {
        "query": "mutation($qALog:QALogInputType!) {createQALog(qALog:$qALog){qALogID}}",
        "variables": { "qALog": qALog }
    }
    return await customGQLQuery(`accounting`, query);
}
