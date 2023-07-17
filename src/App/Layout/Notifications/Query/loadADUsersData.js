
import {
    customQuery
} from '../../../Core/Services/EntityGateway';

export const loadADUsersQuery = async (searchString) => {
    const ADUsersData = await customQuery(`ad-users`, `
            query{
                list(nameSearch:"`+ searchString + `") {
                    displayName
                    distinguishedName
                    emailAddress
                    givenName
                    name
                    samAccountName
                    surname
                    userPrincipalName
                }
            }
        `);
    return ADUsersData;
}