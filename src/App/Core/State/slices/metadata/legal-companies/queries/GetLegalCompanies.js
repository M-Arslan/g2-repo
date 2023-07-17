import {
    GQL_SCHEMAS,
    GraphOperation
} from '../../../../../Providers/GraphQL';

export class GetLegalCompanies extends GraphOperation {

    constructor() {
        super(GQL_SCHEMAS.LEGAL_COMPANIES, 'getLegalEntitiesList');

        this.defineFields(
            'companyEntityTypeID',
            'companyName',
            'sequenceNumber',
            'active'
        );
    }
}