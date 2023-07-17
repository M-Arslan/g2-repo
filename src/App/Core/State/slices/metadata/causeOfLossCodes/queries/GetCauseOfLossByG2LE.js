import {
    GQL_SCHEMAS,
    GraphOperation
} from '../../../../../Providers/GraphQL';

export class GetCauseOfLossCodesListByG2LE extends GraphOperation {

    constructor() {
        super(GQL_SCHEMAS.ACCOUNTING, 'causeOfLossCodesListByG2LE');
        this.defineVariable('g2LegalEntityID', 'Int', true)
        this.defineFields(
            'code',
            'description',
            'active',
            'createdDate',
            'createdBy'
            );
    }
}