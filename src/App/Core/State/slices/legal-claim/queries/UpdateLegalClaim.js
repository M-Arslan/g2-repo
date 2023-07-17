import {
    GQL_MUTATION,
    GQL_SCHEMAS,
    GraphOperation
} from '../../../../Providers/GraphQL';
import { ensureNonNullObject } from '../../../../Utility/rules';

export class UpdateLegalClaim extends GraphOperation {
    constructor() {
        super(GQL_SCHEMAS.LEGAL_CLAIM, 'create', GQL_MUTATION.IS_MUTATION);

        this.defineVariable('legalClaim', 'LegalClaimDetailInputType', true)
            .defineFields(
                'claimDetailID',
                'claimMasterID',
                'assignedToCounsel',
                'g2CompanyNameID',
                'subpoenaOnly',
                'quasiDirectAction',
                'claimCounselUserID',
                'coverageOnly',
                'aobClaim',
                'samClaim',
                'createdDate',
                'createdBy',
                'uWDate',
                'iADate',
                'mGADate',
                'uFDate'
        ).defineFieldObject('claimDetailFlags',
            'claimDetailFlagID',
            'claimDetailFlagTypeID',
            'claimDetailID',
        );
    }


    /**
     * Override the base execute to ensure the object graph is narrowed to the 
     * input type shape
     * @param {import('../types.d').SaveLegalClaimArgs} args
     */
    async execute(args) {
        const { legal_claim } = args;
        if (ensureNonNullObject(legal_claim)) {
            return super.execute({
                legalClaim: {
                    claimDetailID: legal_claim.claimDetailID,
                    claimMasterID: legal_claim.claimMasterID,
                    assignedToCounsel: legal_claim.assignedToCounsel,
                    g2CompanyNameID: legal_claim.g2CompanyNameID,
                    subpoenaOnly: legal_claim.subpoenaOnly,
                    quasiDirectAction: legal_claim.quasiDirectAction,
                    claimCounselUserID: legal_claim.claimCounselUserID,
                    coverageOnly: legal_claim.coverageOnly,
                    aobClaim: legal_claim.aobClaim,
                    samClaim: legal_claim.samClaim,
                    createdBy: legal_claim.createdBy,
                    createdDate: legal_claim.createdDate,
                    claimDetailFlags: legal_claim.claimDetailFlags,
                    uWDate: legal_claim.uWDate,
                    mGADate: legal_claim.mGADate,
                    iADate: legal_claim.iADate,
                    uFDate: legal_claim.uFDate,
                }
            });
        }
        else {
            throw new Error('[UpdateLegalClaimDetail] attempting to save with empty args');
        }
    }
}
