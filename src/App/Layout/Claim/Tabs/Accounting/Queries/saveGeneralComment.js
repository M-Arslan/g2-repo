import {
    customGQLQuery
} from '../../../../../Core/Services/EntityGateway';

export const saveGeneralComment = async (generalComment) => {
    const query = {
        "query": "mutation($generalComment:GeneralCommentInputType!) {saveGeneralComment(generalComment:$generalComment){generalCommentID}}",
        "variables": { "generalComment": generalComment }
    }
    return await customGQLQuery(`accounting`, query);
}
