import {
    GQL_SCHEMAS,
    GraphOperation
} from '../../../../../Providers/GraphQL';

export class GetFSRIClaimDB2 extends GraphOperation {

    constructor() {
        super(GQL_SCHEMAS.DB2CLAIMS, 'fsriAssociatedClaimSearch');
        this.defineVariable('filterType', 'String', true)
            .defineVariable('filterValue', 'String', true)
            .defineFields(
                'agreementCD',
                'managingCorpCD',
                'claimID',
                'insuredNM',
                'statusCD',
                'clmProfNM'
            );
        this.shouldCache(`${GQL_SCHEMAS.REFERENCE}|fsriClaimDB2`);
    }
}