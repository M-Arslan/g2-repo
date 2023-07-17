import {
    GraphOperation,
    GQL_SCHEMAS,
    GQL_MUTATION
} from '../../../../Providers';

export class SaveULClaim extends GraphOperation {
    constructor() {
        super(GQL_SCHEMAS.UL_Claims, 'save', GQL_MUTATION.IS_MUTATION);

        this.defineVariable('ulClaim', 'ULClaimsInputType', true)
            .defineFields(
                'ulClaimID',
                'claimMasterID',
                'claimID',
                'claimExaminerID',
                'pastClaimExaminerID',
                'lossLocation',
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

export class DeleteULClaim extends GraphOperation {
    constructor() {
        super(GQL_SCHEMAS.UL_Claims, 'delete', GQL_MUTATION.IS_MUTATION);

        this.defineVariable('uLClaimID', 'String', true)
            .defineFields('ulClaimID');
    }
}