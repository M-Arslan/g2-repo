/// <reference path="policyaggregate/policyaggregatesection.js" />
import React from 'react';
import {
    Panel,
    PanelHeader,
    PanelContent
} from '../../../../../Core/Forms/Common';
import {
    Required,
    asForm,
    Schema,
    DateRules,
    ModelRule,
    RequiredNumber,
    Conditional
} from '../../../../../Core/Providers/FormProvider';
import {
    ClaimInfoForm
} from './ClaimInfo/ClaimInfoForm';
import {
    ClaimPolicyForm
} from './ClaimPolicy/ClaimPolicyForm';
import { FAL_CLAIM_STATUS_TYPES } from '../../../../../Core/Enumerations/app/fal_claim-status-types';


const ClaimDetailsFormComponent = ({ id, model, onManualChanged }) => {


    return (
        <>
            <Panel>
                <PanelHeader>Claim Details</PanelHeader>
                <PanelContent padding="1em">
                    <ClaimInfoForm id={`${id}__claim-info`} model={model} />
                </PanelContent>
            </Panel>
            <ClaimPolicyForm id={`${id}__claim-policy`} model={model} onManualChanged={onManualChanged} />
        </>
    );
};

const datesRule = new ModelRule((data) => {
    return {
        ...DateRules('extendedReportingPeriod').mustBeAfter('dOL', data),
        ...DateRules('dateReceived').mustBeAfter('dOL', data, 'Claim Reported Date must be after DOL'),
    };
});

const schema = new Schema([datesRule]);

// -- state persistence variables (not visible on form)
schema.bindProperty('claimMasterID')
    .bindProperty('claimID')
    .bindProperty('manuallyCreated')
    .bindProperty('ichronicleID')
    .bindProperty('batchID')
    .bindProperty('fALClaimStatusTypeID')
    .bindProperty('createdDate')
    .bindProperty('createdBy')
    .bindProperty('insuredName')
    .bindProperty('insuredNameContinuation');

// -- form bound properties
schema.bindProperty('claimType', [Conditional(Required, (claim) => claim.fALClaimStatusTypeID !== FAL_CLAIM_STATUS_TYPES.CLOSED)])
    .bindProperty('claimPolicyID')
    .bindProperty('claimExaminerID')
    .bindProperty('managerName')
    .bindProperty('claimBranchID')
    .bindProperty('dOL')
    .bindProperty('extendedReportingPeriod')
    .bindProperty('uwDept')
    .bindProperty('deptCD')
    .bindProperty('dateReceived')
    .bindProperty('lossLocation')
    .bindProperty('lossLocationOutsideUsa')
    .bindProperty('g2LegalEntityID', [RequiredNumber])
    .bindProperty('g2CompanyNameID', [RequiredNumber])
    .bindProperty('legalEntityManagerName')
    .bindProperty('managingEntity', [Conditional(Required, (claim) => claim.fALClaimStatusTypeID !== FAL_CLAIM_STATUS_TYPES.CLOSED)])
    .bindProperty('lossDesc')
    .bindProperty('fullDescriptionOfLoss')
    .bindProperty('policy')
    .bindProperty('claimPolicy')
    .bindProperty('statutoryClaimID')
    .bindProperty('statutorySystem')
    .bindProperty('kindOfBusinessID')
    .bindProperty('policyComments')
    .bindProperty('claimSettled')
    .bindProperty('clientClaimID');

export const ClaimDetailForm = asForm(ClaimDetailsFormComponent, schema);
