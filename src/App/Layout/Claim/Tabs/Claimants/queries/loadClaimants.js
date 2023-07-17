import {
    customGQLQuery
} from '../../../../../Core/Services/EntityGateway';

export const loadClaimants = async (claimMasterID) => {
    let query = {
        "query": `
            query {
               claimants(claimMasterID:"${claimMasterID}"){ 
                    claimantID
                    claimMasterID
                    firstName
                    middleName
                    lastName
                    bIClaimant
                    dateOfBirth
                    gender
                    occupation
                    sSN
                    annualIncome
                    medicalExpenses
                    lostIncome
                    addressStreet1
                    addressStreet2
                    addressCity
                    addressState
                    addressZIP
                    injuries
                    cIBRequested
                    cIBRequestedDate
                    medicareEligible
                    medicareReportedDate
                    nonUSCitizen
                    createdDate
                    createdBy
                    modifiedDate
                    modifiedBy
                    lossReserve
                    expenseReserve
                    medPayReserve
                    medicare
                    {
                        cMSRejected
                        reportToCMS
                        reportedToCMS
                        reportingToCMSNotRequired

                    }
                } 
            }
            `
    }

    return await customGQLQuery(`claim-claimant`, query);
};
