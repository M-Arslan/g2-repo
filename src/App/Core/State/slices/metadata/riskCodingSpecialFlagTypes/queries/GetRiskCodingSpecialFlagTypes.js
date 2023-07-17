import {
    GQL_SCHEMAS,
    GraphOperation
} from '../../../../../Providers/GraphQL';

export class GetRiskCodingSpecialFlagTypes extends GraphOperation {
    
    constructor() {
        super(GQL_SCHEMAS.CLAIM_RISK_CODING, 'riskCodingSpecialFlagTypes');

        this.defineFields(
            'riskCodingSpecialFlagTypeID',
            'specialFlagText',
            'active',
            'sequence',
            'createdBy',
            'createdDate',
            'modifiedBy',
            'modifiedDate'
        );
        this.shouldCache(`${GQL_SCHEMAS.CLAIM_RISK_CODING}|risk-Coding-Special-Flag-Types`);
    }
}