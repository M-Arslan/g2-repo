import {
    GQL_SCHEMAS,
    GraphOperation
} from '../../../../../Providers/GraphQL';

export class GetClaimDetailFlagTypes extends GraphOperation {
    
    constructor() {
        super(GQL_SCHEMAS.ClaimDetailFlagTypes, 'list');
        this.defineFields(
            'claimDetailFlagTypeID',
            'claimDetailFlagTypeName',
            'sequenceNumber',
            'createdDate',
            'createdBy');
        this.shouldCache(`${GQL_SCHEMAS.ClaimDetailFlagTypes}|list`);
    }
}