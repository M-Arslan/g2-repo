import {
    GQL_SCHEMAS,
    GraphOperation
} from '../../../../Providers/GraphQL';


export class GetPropertyPolicy extends GraphOperation {
    constructor() {
        super(GQL_SCHEMAS.PROPERTY_POLICY, 'detail');

        this.defineVariable('claimMasterID', 'String', true)
            .defineFields(
                'propertyPolicyID',
                'claimMasterID',
                'policyForms',
                'limits',
                'coinsurance',
                'deductible',
                'generalStarSharedPercent',
                'calcBasis',
                'lossAddressStreet1',
                'lossAddressStreet2',
                'lossAddressCity',
                'lossAddressState',
                'lossAddressZIP',
                'lossAddressCounty',
                'salvage',
                'restitution',
                'subrogation',
                'subroDemand',
                'subroRecovered',
                'subrogationOpenDate',
                'subrogationClosingDate',
                'subrogationDiaryDate',
                'mortgageHolder',
                'lienHolder',
                'debtor',
                'comment',
                'createdDate',
                'createdBy',
                'modifiedDate',
                'modifiedBy',
            );
    }
}
