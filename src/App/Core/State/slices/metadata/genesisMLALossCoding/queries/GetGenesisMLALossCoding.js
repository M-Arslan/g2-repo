import {
    GQL_SCHEMAS,
    GraphOperation
} from "../../../../../Providers/GraphQL";

export class GetGenesisMLALossCoding extends GraphOperation {

    constructor() {
        super(GQL_SCHEMAS.ACCOUNTING, 'genesisMLALossCoding');
        this.defineVariable('boBCoverageID', 'String', true)
            .defineVariable('g2LegalEntityID', 'Int', true)
            .defineFields('coverage',
                'trigger',
                'attachmentPoint',
                'limit',
                'expense',
                'grcParticipation'
            );
        this.shouldCache(`${GQL_SCHEMAS.ACCOUNTING}`);
    }
}