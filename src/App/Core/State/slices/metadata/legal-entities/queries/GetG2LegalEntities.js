import {
    GQL_SCHEMAS,
    GraphOperation
} from '../../../../../Providers/GraphQL';

export class GetLegalEntities extends GraphOperation {
    
    constructor() {
        super(GQL_SCHEMAS.CLAIMS_COMMON, 'getG2LegalEntityList');

        this.defineFields('g2LegalEntityID', 'g2LegalEntityDesc');
        this.shouldCache(`${GQL_SCHEMAS.CLAIMS_COMMON}|legal-entities`);
    }
}