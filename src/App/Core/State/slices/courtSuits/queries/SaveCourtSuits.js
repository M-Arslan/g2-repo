import {
    GraphOperation,
    GQL_SCHEMAS,
    GQL_MUTATION
} from '../../../../Providers';

export class SaveCourtSuits extends GraphOperation {
    constructor() {
        super(GQL_SCHEMAS.CourtSuits, 'save', GQL_MUTATION.IS_MUTATION);

        this.defineVariable('courtSuits', 'CourtSuitsInputType', true)
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

