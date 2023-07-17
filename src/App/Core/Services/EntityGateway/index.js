export {
    get, 
    search,
    customQuery,
    customGQLQuery
} from './EntityGateway';

export {
    getCompanies,
    getRiskStates,
    getBranches,
    getClaimExaminers,
    getClaimExaminersWithoutManager,
    getCIBLossTypes,
    getRoles,
    getG2Companies,
    loadUsers
} from './ReferenceGateway';