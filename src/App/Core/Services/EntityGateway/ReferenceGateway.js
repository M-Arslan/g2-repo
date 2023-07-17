import {
    execute,
    executeGQLQuery
} from './graphql';

const CACHE = Object.freeze({
    RISK_STATES: 'risk-states',
    BRANCH: 'branch',
    COMPANY: 'companies',
    CIBLossTypes: 'cibLossTypes',
});

const __refCache = new Map();

async function getData(cacheKey, schema, query) {
    if (__refCache.has(cacheKey) !== true) {
        const result = await execute(schema, query);
        const data = result.data;
        __refCache.set(cacheKey, data);
    }

    return __refCache.get(cacheKey);
}

export async function getRiskStates() {
    const result = await getData(CACHE.RISK_STATES, 'reference', `query {
        riskStates {
            riskStateID
            stateCode
            stateName
        }
    }`);

    return result.riskStates;
}

export async function getBranches() {
    const result = await getData(CACHE.BRANCH, 'claim-branch', `query {
        list {
            claimBranchID
            branchName
            branchCode
        }
    }`);
    return result.list;
}

export async function getCompanies() {
    const result = await getData('company', 'reference', `query {
        companies {
            companyID
            companyCode
            companyName
            taxIdentificationNumber
        }
    }`); 
    return result.companies;
}

export async function getClaimExaminers() {
    const result = await execute('claim-examiner', `query {
        list {
            userID
            firstName
            lastName
            branchID
            managerFirstName
            managerLastName
        }
    }
    `);
    return result.data.list;
}
export async function getClaimExaminersWithoutManager() {
    const result = await execute( 'claim-examiner', `query {
        list {
            userID
            firstName
            lastName
            branchID
            emailAddress
        }
    }
    `);
    return result.data.list;
}

export async function getRoles() {
    const result = await execute('roles', `query{
            list
            {
                roleID
                name
                isExaminer
            }
        }
    `);
    return result.data.list;
}

export async function loadUsers() {
    let query = {
        "query": `
            query {
               users{ 
                    userID
                    firstName
                    lastName
                    fullName
                    managerID
                    emailAddress
                    branchID
                    userRoles{
                        roleID
                    }
                } 
            }
            `
    }

    return await executeGQLQuery(`user`, query);
};

export async function getCIBLossTypes() {
    try {

    //    const result = await getData(Cache.BRANCH, 'reference', `query {
    //    cibLossTypes {
    //        cIBLossTypeID
    //        cIBLossTypeText
    //    }
    //}`);

        const result = await execute('reference', `query {
        cibLossTypes {
            cIBLossTypeID
            cIBLossTypeText
        }
    }`);
        return result.data.cibLossTypes;
    } catch (e) {
    }
}


export async function getG2Companies() {
    const result = await execute('claims-common', `query{
            getG2LegalEntityList
            {
                g2LegalEntityID
                g2LegalEntityDesc
            }
        }
    `);
    return result.data.getG2LegalEntityList;
}


