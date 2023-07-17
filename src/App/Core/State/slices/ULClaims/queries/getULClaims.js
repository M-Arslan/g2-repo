import {
    GraphOperation,
    GQL_SCHEMAS
} from '../../../../Providers';

export class GetULClaims extends GraphOperation {
    constructor() {
        super(GQL_SCHEMAS.UL_Claims, 'list');

        this.defineVariable('claimMasterID', 'String', true)
            .defineVariable('onlyLoadPrimary', 'Boolean', true)
            .defineFields(
                'ulClaimID',
                'claimMasterID',
                'claimID',
                'claimExaminerID',
                'pastClaimExaminerID',
                'lossLocation',
                'lossLocationOutsideUSA',
                'dOL',
                'falClaimStatusTypeID',
                'jurisdictionType',
                'jursidiction',
                'g2CompanyNameID',
                'deductible',
                'formOfCoverageCD',
                'retroDate',
                'comment',
                'isPrimary',
                'createdDate',
                'createdBy',
                'cATNumber'
            );
    }
}

export class GetULClaim extends GraphOperation {
    constructor() {
        super(GQL_SCHEMAS.UL_Claims, 'detail');

        this.defineVariable('uLClaimID', 'String', true)
            .defineFields(
                'ulClaimID',
                'claimMasterID',
                'claimID',
                'claimExaminerID',
                'pastClaimExaminerID',
                'lossLocation',
                'lossLocationOutsideUSA',
                'dOL',
                'falClaimStatusTypeID',
                'jurisdictionType',
                'jursidiction',
                'g2CompanyNameID',
                'deductible',
                'formOfCoverageCD',
                'retroDate',
                'comment',
                'isPrimary',
                'createdDate',
                'createdBy',
                'cATNumber'
            );
    }
}

