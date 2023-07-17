import {
    GraphOperation,
    GQL_SCHEMAS
} from '../../../../Providers';

export class GetCourtSuits extends GraphOperation {
    constructor() {
        super(GQL_SCHEMAS.CourtSuits, 'detail');

        this.defineVariable('claimMasterID', 'String', true)
            .defineFields(
                'courtSuitInfoID',
                'claimMasterID',
                'legalCaseCaption',
                'legalCaseDocketNumber',
                'state',
                'venue',
                'courtName',
                'ulCaseCaption',
                'ulCaseDocketNumber',
                'ulClaimState',
                'ulVenue',
                'ulCourtName',
                'trialDate',
                'ulTrialDate',
                'caseComment',
                'mediationDate',
                'mediationComment',
                'ulMediationDate',
                'ulMediationComment',
                'caseSettled',
                'amountGlobalSettlement',
                'amountWePaidInSettlement',
                'closingComment',
                'judgementBeforeTrial',
                'judgementAfterTrial',
                'judgementNone',
                'totalPaidLegalClaimFile',
                'totalPaidULClaimFile',
                'createdDate',
                'createdBy'
            );
    }
}

