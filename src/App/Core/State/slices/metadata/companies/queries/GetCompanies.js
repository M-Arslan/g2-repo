import {
    GQL_SCHEMAS,
    GraphOperation
} from '../../../../../Providers/GraphQL';

export class GetCompanyNames extends GraphOperation {
    
    constructor() {
        super(GQL_SCHEMAS.COMPANY_NAMES, 'get');

        this.defineFields(
            'g2CompanyNameID',
            'g2LegalEntityID',
            'companyName',
            'sequenceNumber'
        );
        this.shouldCache(`${GQL_SCHEMAS.CLAIMS_COMMON}|company-names`);
    }
}