import {
    GQL_MUTATION,
    GQL_SCHEMAS,
    GraphOperation
} from '../../../../../Core/Providers';


export class UpdateClaimMetadata extends GraphOperation {
    constructor() {
        super(GQL_SCHEMAS.CLAIM_MASTER, 'updateDocumentumClaim', GQL_MUTATION.IS_MUTATION);

        this.defineVariable('claim', 'ClaimMasterInputType', true);
        this.makeSilent();
    }
}