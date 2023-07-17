import {
    GQL_SCHEMAS,
    GraphOperation
} from '../../../../../Providers/GraphQL';

export class GetProfessionalClaimCategories extends GraphOperation {
    
    constructor() {
        super(GQL_SCHEMAS.CLAIMS_COMMON, 'professionalClaimCategories');
        this.defineFields(
            'professionalClaimCategoryID',
            'description',
            'sequenceNumber'
        );
        this.shouldCache(`${GQL_SCHEMAS.CLAIMS_COMMON}|professionalClaimCategories`);
    }
}