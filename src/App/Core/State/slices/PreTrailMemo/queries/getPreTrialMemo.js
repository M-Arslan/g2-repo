import {
    GraphOperation,
    GQL_SCHEMAS
} from '../../../../Providers';

export class getPreTrialMemo extends GraphOperation {
    constructor() {
        super(GQL_SCHEMAS.Pre_Trail_Memo, 'get');

        this.defineVariable('notificationID', 'String', true)
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