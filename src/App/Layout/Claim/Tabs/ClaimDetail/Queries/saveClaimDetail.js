import { initApiClient } from '../../../../../Core/Providers/GraphQL/useGraphQL';
import {
    customGQLQuery
} from '../../../../../Core/Services/EntityGateway';
import { UpdateClaimMetadata } from './UpdateClaimMetadata';

export const saveClaimDetail = async (data) => {
    const claim = {
        claimMasterID: data.claimMasterID,
        claimExaminerID: data.claimExaminerID,
        claimBranchID: data.claimBranchID,
        g2LegalEntityID: data.g2LegalEntityID,
        statutoryClaimID: data.statutoryClaimID,
        statutorySystem: data.statutorySystem,
        kindOfBusinessID: data.kindOfBusinessID,
        policyComments: data.policyComments,
        managingEntity: data.managingEntity,
        claimID: data.claimID,
        claimPolicyID: data.claimPolicyID,
        claimType: data.claimType,
        lossDesc: data.lossDesc,
        fullDescriptionOfLoss: data.fullDescriptionOfLoss,
        ichronicleID: data.ichronicleID,
        batchID: data.batchID,
        genReCompanyName: data.genReCompanyName,
        dateReceived: data.dateReceived?.split('T')[0],
        lossLocation: data.lossLocation ? data.lossLocation.toString() : data.lossLocation,
        lossLocationOutsideUsa: data.lossLocationOutsideUsa,
        dOL: data.dOL?.split('T')[0],
        deptCD: data.deptCD,
        senderEmail: data.senderEmail,
        fALClaimStatusTypeID: typeof data.fALClaimStatusTypeID === 'number' ? data.fALClaimStatusTypeID.toString() : data.fALClaimStatusTypeID,
        extendedReportingPeriod: data.extendedReportingPeriod?.split('T')[0],
        createdDate: data.createdDate,
        createdBy: data.createdBy,
        insuredName: data.policy ? data.policy.insuredName : null,
        insuredNameContinuation: data.policy ? data.policy.insuredNameContinuation : null,
        uwDept: data.uwDept,
        claimPolicy: data.claimPolicy && data.claimPolicy.policyID !== "" ? data.claimPolicy : null,
        claimSettled: data.claimSettled,
    };

    const query = {
        query: 'mutation($claim:ClaimMasterInputType!) {update(claim:$claim) { claimMasterID } }',
        variables: { claim }
    }

    try {
        const $api = initApiClient({
            updateMetadata: UpdateClaimMetadata
        });

        $api.updateMetadata({ claim });
    }
    catch (e) { console.error(e); }

    return await customGQLQuery('claim-master', query);
 };