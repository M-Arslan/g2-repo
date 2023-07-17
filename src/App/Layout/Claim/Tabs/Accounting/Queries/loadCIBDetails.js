import {
    customGQLQuery
} from '../../../../../Core/Services/EntityGateway';

export const loadCIBDetails = async (claimantCIBID) => {
    let query = {
        "query": `
            query {
               cIBDetails(claimantCIBID:"${claimantCIBID}"){ 
                    claimantCIBID,
                    claimantID,
                    claimantFormerStreet,
                    claimantFormerCity,
                    claimantFormerState,
                    claimantFormerZip,
                    claimantAttorneyName,
                    claimantAttorneyStreet,
                    claimantAttorneyCity,
                    claimantAttorneyState,
                    claimantAttorneyZip,
                    claimantDoctorCity,
                    claimantDoctorState,
                    insuredZip,
                    insuredStreet,
                    insuredState,
                    insuredCity
               }
        }`
    }
    return await customGQLQuery(`claim-claimant`, query);
};