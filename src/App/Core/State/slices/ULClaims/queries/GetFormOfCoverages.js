import {
    GraphOperation,
    GQL_SCHEMAS
} from '../../../../Providers';

export class GetFormOfCoverages extends GraphOperation {
    constructor() {
        super(GQL_SCHEMAS.UL_Claims, 'formOfCoverageList');

        this.defineFields(
            'formOfCoverageCD',
            'formOfCoverageDesc'
        );
    }
}
