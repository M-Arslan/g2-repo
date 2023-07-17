import {
    customGQLQuery
} from '../../../../../Core/Services/EntityGateway';

export const saveFileCIB = async (claimantID) => {
    const query = {
        "query": 'mutation { fileCIB(claimantID:"' + claimantID + '"){ cIB{ claimantCIBID } claimantID cIBRequested cIBRequestedDate}}'
    }
    return await customGQLQuery(`claim-claimant`, query);
}
