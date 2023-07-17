import {
    customGQLQuery
} from '../../../../../Core/Services/EntityGateway';

export const saveQASystemCheck = async (qASystemCheck) => {
    const query = {
        "query": "mutation($qASystemCheck:  QASystemCheckInputType!) {createQASystemCheck(qASystemCheck:$qASystemCheck){qASystemCheckID}}",
        "variables": { "qASystemCheck": qASystemCheck }
    }
    return await customGQLQuery(`accounting`, query);
}
