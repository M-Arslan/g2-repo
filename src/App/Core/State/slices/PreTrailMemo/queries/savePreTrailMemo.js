import {
    GraphOperation,
    GQL_SCHEMAS,
    GQL_MUTATION
} from '../../../../Providers';

export class savePreTrailMemo extends GraphOperation {
    constructor() {
        super(GQL_SCHEMAS.Pre_Trail_Memo, 'create', GQL_MUTATION.IS_MUTATION);

        this.defineVariable('preTrialMemo', 'PreTrialMemoInputType', true)
            .defineFields(
                "preTrialMemoID",
                 "notificationID",
                 "claimMasterID",
                 "claimant",
                 "trialDate",
                 "venue",
                 "primaryExcessCarrier",
                 "defenseCounsel",
                 "limits",
                 "reserve",
                 "descriptionOfLoss",
                 "liability",
                 "damages",
                 "statusOfNegotiations",
            );
    }
}

