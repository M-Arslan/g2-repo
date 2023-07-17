import {
    GQL_SCHEMAS,
    GraphOperation
} from "../../../../../Providers/GraphQL";

export class GetOpenLineBobCoverage extends GraphOperation {

    constructor() {
        super(GQL_SCHEMAS.OpenLineBobCoverage, 'list');
        this.defineVariable('policyID', 'String', true)
            .defineVariable('g2LegalEntityID', 'Int', true)
            .defineFields('boBCoverageID',
                'attachment',
                'limit',
                'grcParticipation',
                'classCodeDesc',
                'coverage',
                'triggerDesc',
                'expense'
            );
        this.shouldCache(`${GQL_SCHEMAS.REFERENCE}`);
    }
}