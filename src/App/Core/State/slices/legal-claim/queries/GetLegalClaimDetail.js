import {
    GraphOperation,
    GQL_SCHEMAS
} from '../../../../Providers';

export class GetLegalClaim extends GraphOperation {
    constructor() {
        super(GQL_SCHEMAS.LEGAL_CLAIM, 'detail');

        this.defineVariable('claimMasterID', 'String', true)
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
                'createdBy',
                'createdDate',
                'uWDate',
                'iADate',
                'uFDate',
                'mGADate'
        ).defineFieldObject('claimDetailFlags',
            'claimDetailFlagID',
            'claimDetailFlagTypeID',
            'claimDetailID',
        )
;
    }
}