import {
    GQL_MUTATION,
    GQL_SCHEMAS,
    GraphOperation
} from '../../../../Providers/GraphQL';
import { initApiClient } from '../../../../Providers/GraphQL/useGraphQL';
import { G2Date } from '../../../../Utility/G2Date';
import { ensureNonNullObject } from '../../../../Utility/rules';
import { UpdateClaimMetadata } from './UpdateClaimMetadata';

export class UpdateClaimMaster extends GraphOperation {
    constructor() {
        super(GQL_SCHEMAS.CLAIM_MASTER, 'update', GQL_MUTATION.IS_MUTATION);

        this.defineVariable('claim', 'ClaimMasterInputType', true)
            .defineFields(
                'claimMasterID',
                'claimID',
                'claimPolicyID',
                'claimType',
                'lossDesc',
                'fullDescriptionOfLoss',
                'ichronicleID',
                'batchID',
                'genReCompanyName',
                'dateReceived',
                'lossLocation',
                'lossLocationOutsideUsa',
                'dOL',
                'claimExaminerID',
                'claimBranchID',
                'g2CompanyNameID',
                'g2LegalEntityID',
                'managingEntity',
                'legalEntityManagerName',
                'deptCD',
                'uwDept',
                'manuallyCreated',
                'senderEmail',
                'fALClaimStatusTypeID',
                'extendedReportingPeriod',
                'createdDate',
                'createdBy',
                'insuredName',
                'insuredNameContinuation',
                'statutoryClaimID',
                'statutorySystem',
                'kindOfBusinessID',
                'policyComments',
                'clientClaimID',
                'claimSettled',
            )
            .defineFieldObject('policy',
                'cancelDate',
                'claimsMadeDate',
                'clientBusinessName',
                'departmentCode',
                'effectiveDate',
                'expirationDate',
                'insuredCity',
                'insuredName',
                'insuredZip',
                'insuredStreetName',
                'insuredNameContinuation',
                'insuredState',
                'policyBranch',
                'underwriterID',
                'mailingCity',
                'departmentName',
            )
            .defineFieldObject('claimPolicy',
                'claimPolicyID',
                'claimMasterID',
                'policyID',
                'insuredName',
                'polEffDate',
                'polExpDate',
                'retroDate',
                'createdDate',
                'createdBy',
                'active',
            )
            .defineFieldObject('examiner',
                'branchID',
                'claimUnitID',
                'emailAddress',
                'businessPhone',
                'firstName',
                'lastName',
                'managerFirstName',
                'managerLastName',
                'managerID',
            );
    }

    
    /**
     * Override the base execute to ensure the object graph is narrowed to the 
     * input type shape
     * @param {import('../types.d').SaveClaimArgs} args
     */
    async execute(args) {
        const { claim } = args;
        if (ensureNonNullObject(claim)) {
            const claimData = {
                claimMasterID: claim.claimMasterID,
                claimID: claim.claimID,
                claimPolicyID: claim.claimPolicyID,
                insuredName: claim.insuredName,
                insuredNameContinuation: claim.insuredNameContinuation,
                uwDept: claim.uwDept,
                claimType: claim.claimType,
                lossDesc: claim.lossDesc,
                ichronicleID: claim.ichronicleID,
                batchID: claim.batchID,
                genReCompanyName: claim.genReCompanyName,
                dateReceived: claim.dateReceived,
                lossLocation: claim.lossLocation,
                lossLocationOutsideUsa: claim.lossLocationOutsideUsa,
                dOL: G2Date.tryParse(claim.dOL)?.toISODateString(),
                dOL: claim.dOL,
                claimExaminerID: claim.claimExaminerID,
                deptCD: claim.deptCD,
                fullDescriptionOfLoss: claim.fullDescriptionOfLoss,
                claimBranchID: claim.claimBranchID,
                senderEmail: claim.senderEmail,
                fALClaimStatusTypeID: claim.fALClaimStatusTypeID,
                extendedReportingPeriod: G2Date.tryParse(claim.extendedReportingPeriod)?.toISODateString(),
                g2CompanyNameID: claim.g2CompanyNameID,
                g2LegalEntityID: claim.g2LegalEntityID,
                manuallyCreated: claim.manuallyCreated,
                managingEntity: claim.managingEntity,
                claimPolicy: claim.claimPolicy,
                createdDate: claim.createdDate,
                createdBy: claim.createdBy,
                statutoryClaimID: claim.statutoryClaimID,
                kindOfBusinessID: claim.kindOfBusinessID,
                statutorySystem: claim.statutorySystem,
                policyComments: claim.policyComments,
                clientClaimID: claim.clientClaimID,
                claimSettled: claim.claimSettled,
            };

            try {
                const $api = initApiClient({
                    updateMetadata: UpdateClaimMetadata
                });

                $api.updateMetadata({ claim: claimData });
            }
            catch (e) { console.warn('[UpdateClaimMaster::execute] unable to update metadata in Documentum:', e); }

            return super.execute({
                claim: claimData
            });
        }
        else {
            throw new Error('[UpdateClaimMaster] attempting to save with empty args');
        }
    }
}
