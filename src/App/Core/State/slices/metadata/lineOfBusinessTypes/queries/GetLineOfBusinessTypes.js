import {
    GQL_SCHEMAS,
    GraphOperation
} from '../../../../../Providers/GraphQL';

export class GetLineOfBusinessTypes extends GraphOperation {
    
    constructor() {
        super(GQL_SCHEMAS.CLAIM_RISK_CODING, 'lineOfBusinessTypesByID');
        this.defineVariable('g2LegalEntityID', 'Int', true)
        this.defineFields(
            'lineOfBusinessCodingTypeID',
            'lineOfBusinessCodingText',
            'active',
            'sequence',
            'createdBy',
            'createdDate',
            'modifiedBy',
            'modifiedDate'
        );
        this.shouldCache(`${GQL_SCHEMAS.CLAIM_RISK_CODING}|claim-risk-coding`);
    }
}