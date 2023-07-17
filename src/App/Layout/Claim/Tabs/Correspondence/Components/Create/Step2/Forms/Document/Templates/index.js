import React from 'react';
import styled from 'styled-components';
import {
    ensureNonEmptyString,
    ensureNonNullObject
} from '../../../../../../../../../../Core/Utility/rules';
import {
    makeEvent
} from '../../../../../../../../../../Core/Utility/makeEvent';
import {
    getAckLetterData,
    AckLetterForm,
} from './AckLetter';
import {
    getVendorLetterData,
    VendorLetterForm
} from './VendorLetter';
import { useSelector } from 'react-redux';
import { claimSelectors } from '../../../../../../../../../../Core/State/slices/claim';
import { DatabaseEmailForm, getDatabaseEmailData } from './DatabaseEmail';
import { getInternalAdjustmentToBrokerData, InternalAdjustmentToBrokerForm } from './InternalAdjustmentToBroker';
import { getLargeLossData, LargeLossForm } from './LargeLoss';
import { getPALToMgaData, PALToMgaForm } from './ProfessionalAckToMga';
import { getPALToInsuredData, PALToInsuredForm } from './ProfessionalAckToInsured';
import { getAdjusterAssignmentEmailData, AdjusterAssignmentEmailForm } from './AdjusterAssignment';
import { getNJNoticeOfInternalAppealsTLGData, NJNoticeOfInternalAppealsTLGForm } from './NJInternalAppealsTLG';
import { getNJInternalAppealsGSNICGICData, NJInternalAppealsGSNICGICForm } from './NJInternalAppeals';
import { getNJInternalAppealsDispositionTLGData, NJInternalAppealsDispositionTLGForm } from './NJAppealsTLG';
import { getSubroReferralData, SubroReferralForm } from './SubroReferral';
import { riskStatesSelectors } from '../../../../../../../../../../Core/State/slices/metadata/risk-states';
import { getReservationOfRightsData, ReservationOfRightsForm } from './ReservationOfRights';
import { DenialOfCoverageForm, getDenialData } from './DenialOfCoverage';
import { FloridaAffidavitForm, getFloridaAffidavitData } from './FloridaAffidavit';
import { CasualtyReservationOfRightsForm, getCasualtyReservationOfRightsData } from './ReservationOfRightsCasualty';
import { templateTextSelectors } from '../../../../../../../../../../Core/State/slices/metadata/template-text';
import { CasualtyDenialOfCoverageForm, getCasualtyDenialData } from './DenialOfCoverageCasualty';
import { associatedPolicyContractSelectors } from '../../../../../../../../../../Core/State/slices/associated-policy-contracts';
import { getLegalGuidelinesData, LegalGuidelinesForm } from './LegalGuidelines';
import { LegalClaimSelectors } from '../../../../../../../../../../Core/State/slices/legal-claim';
import { usersSelectors } from '../../../../../../../../../../Core/State/slices/users';
import { safeArray, safeObj } from '../../../../../../../../../../Core/Utility/safeObject';
import { propertyPolicySelectors } from '../../../../../../../../../../Core/State/slices/property-policy';
import { FloridaAffidavitNotarizedForm, getFloridaAffidavitNotarizedData } from './FloridaAffidavitNotarized';
import { GenesisAckLetterForm, getGenesisAckLetterData } from './GenesisAckLetter';
import { GenesisClosingNoticeLetterForm, getGenesisClosingNoticeLetterData } from './GenesisClosingNoticeLetter';

const Unselected = styled.span`
    padding: 1em;
    font-style: italic;
`;

/**
 * @typedef {object} DataContext
 * @property {import('../../../../../../../../../../Core/State/slices/claim/types.d').ClaimMaster} claim
 * @property {any} states
 * @property {any} texts
 * @property {any} email
 * @property {any} assocPolicies
 * @property {import('../../../../../../../../../../Core/State/slices/property-policy/types.d').PropertyPolicy} propPolicy
 */

export const TemplateFormSelector = ({ id, model, selected, value, onChange, onBlur }) => {

    const claim = { ...safeObj(useSelector(claimSelectors.selectData())) };
    claim.legal = { ...safeObj(useSelector(LegalClaimSelectors.selectData())) };
    const attorneys = useSelector(usersSelectors.getClaimCounsel());
    claim.legal.claimCounselName = safeObj(safeArray(attorneys).find(u => u.userID === claim.legal.claimCounselUserID)).fullName;
    const riskStates = useSelector(riskStatesSelectors.selectData());
    const texts = useSelector(templateTextSelectors.selectData());
    const formData = model.toRawObject();
    const assocPolicies = useSelector(associatedPolicyContractSelectors.selectData());
    const propPolicy = useSelector(propertyPolicySelectors.selectData());


    /** @type {DataContext} */
    const dataContext = {
        /** @type {import('../../../../../../../../../../Core/State/slices/claim/types.d').ClaimMaster} */
        claim,
        states: riskStates,
        texts,
        email: formData,
        assocPolicies,

        /** @type {import('../../../../../../../../../../Core/State/slices/property-policy/types.d').PropertyPolicy} */
        propPolicy,
    };

    const onFinalize = (evt) => {

        const { value } = evt.target;

        if (ensureNonNullObject(value) && ensureNonNullObject(value.request) && value.valid === true) {
            const data = JSON.stringify(value.request);

            if (typeof onChange === 'function') {
                onChange(makeEvent(id, data));
            }

            if (typeof onBlur === 'function') {
                onBlur(makeEvent(id, data));
            }
        }
    };

    const existingVal = (ensureNonEmptyString(value) ? JSON.parse(value) : null);

    switch (selected) {
        case '/Claims/GS_AckLetter.docx':
            const ackRequest = getAckLetterData(existingVal, dataContext);
            return <AckLetterForm id="ack-letter-form" onFinalize={onFinalize} initialRequest={ackRequest} />;
        case '/Claims/GS_AdjusterAssignmentEmail.docx':
            const aaeRequest = getAdjusterAssignmentEmailData(existingVal, dataContext);
            return <AdjusterAssignmentEmailForm id="adjuster-assignment-email-form" onFinalize={onFinalize} initialRequest={aaeRequest} />;
        case '/Claims/GS_DatabaseMail.docx':
            const dbmRequest = getDatabaseEmailData(existingVal, dataContext);
            return <DatabaseEmailForm id="database-mail-form" onFinalize={onFinalize} initialRequest={dbmRequest} />;
        case '/Claims/GS_DenialCoverageLetterTemplate-2020updateCasualty.docx':
            const cdocRequest = getCasualtyDenialData(existingVal, dataContext);
            return <CasualtyDenialOfCoverageForm id="cdoc-form" onFinalize={onFinalize} initialRequest={cdocRequest} />;
        case '/Claims/GS_PropertyDenialTemplate.docx':
            const pdocRequest = getDenialData(existingVal, dataContext);
            return <DenialOfCoverageForm id="doc-form" onFinalize={onFinalize} initialRequest={pdocRequest} />;
        case '/Claims/GS_AFFIDAVITOFInsCoverageFlorida.docx':
            const faRequest = getFloridaAffidavitData(existingVal, dataContext);
            return <FloridaAffidavitForm id="fl-affidavit-form" onFinalize={onFinalize} initialRequest={faRequest} />;
        case '/Claims/GS_AFFIDAVITOFInsCoverageFlorida_Notarized.docx':
            const fanRequest = getFloridaAffidavitNotarizedData(existingVal, dataContext);
            return <FloridaAffidavitNotarizedForm id="fl-affidavit-notarized-form" onFinalize={onFinalize} initialRequest={fanRequest} />;
        case '/Claims/Genesis_AckLetter.docx':
            const gackRequest = getGenesisAckLetterData(existingVal, dataContext);
            return <GenesisAckLetterForm id="genesis-ack-letter-form" onFinalize={onFinalize} initialRequest={gackRequest} />;
        case '/Claims/Genesis_ClosingNoticeLetter.docx':
            const gcl = getGenesisClosingNoticeLetterData(existingVal, dataContext);
            return <GenesisClosingNoticeLetterForm id="genesis-closing-notice-letter-form" onFinalize={onFinalize} initialRequest={gcl} />;
        case '/Claims/GS_InternalAdjustmentToBroker.docx':
            const iatbRequest = getInternalAdjustmentToBrokerData(existingVal, dataContext);
            return <InternalAdjustmentToBrokerForm id="internal-adjustment-to-broker-form" onFinalize={onFinalize} initialRequest={iatbRequest} />;
        case '/Claims/GS_LargeLoss.docx':
            const llRequest = getLargeLossData(existingVal, dataContext);
            return <LargeLossForm id="large-loss-form" onFinalize={onFinalize} initialRequest={llRequest} />;
        case '/Claims/GS_LegalAssignmentAndBillingGuidelinesCoverLetter.docx':
            const labgRequest = getLegalGuidelinesData(existingVal, dataContext);
            return <LegalGuidelinesForm id="legal-assignment-billing-guidelines-form" onFinalize={onFinalize} initialRequest={labgRequest} />;
        case '/Claims/GS_NewJerseyInternalAppealsDispositionNoticeTLGFinal.docx':
            const niadRequest = getNJInternalAppealsDispositionTLGData(existingVal, dataContext);
            return <NJInternalAppealsDispositionTLGForm id="nj-internal-appeals-disposition-form" onFinalize={onFinalize} initialRequest={niadRequest} />;
        case '/Claims/GS_NewJerseyInternalAppealsProcedureGSNICGICFinalTLG.docx':
            const niacoRequest = getNJInternalAppealsGSNICGICData(existingVal, dataContext);
            return <NJInternalAppealsGSNICGICForm id="nj-notice-internal-appeals-gsnic-gic-form" onFinalize={onFinalize} initialRequest={niacoRequest} />;
        case '/Claims/GS_NewJerseyNoticeofInternalAppealsProcedureTLGFinal.docx':
            const niatRequest = getNJNoticeOfInternalAppealsTLGData(existingVal, dataContext);
            return <NJNoticeOfInternalAppealsTLGForm id="nj-notice-internal-appeals-tlg-form" onFinalize={onFinalize} initialRequest={niatRequest} />;
        case '/Claims/GS_ProfessionalAcknowledgmentLetterToInsured.docx':
            const paltiRequest = getPALToInsuredData(existingVal, dataContext);
            return <PALToInsuredForm id="pal-to-insured-form" onFinalize={onFinalize} initialRequest={paltiRequest} />;
        case '/Claims/GS_ProfessionalAcknowledgmentLetterToMGA.odt':
            const paltmRequest = getPALToMgaData(existingVal, dataContext);
            return <PALToMgaForm id="pal-to-mga-form" onFinalize={onFinalize} initialRequest={paltmRequest} />;
        case '/Claims/GS_RORTemplate-2020updateCasualty.docx':
            const crorRequest = getCasualtyReservationOfRightsData(existingVal, dataContext);
            return <CasualtyReservationOfRightsForm id="cas-ror-form" onFinalize={onFinalize} initialRequest={crorRequest} />;
        case '/Claims/GS_PropertyTemplateROR.docx':
            const rorRequest = getReservationOfRightsData(existingVal, dataContext);
            return <ReservationOfRightsForm id="ror-form" onFinalize={onFinalize} initialRequest={rorRequest} />;
        case '/Claims/GS_SubroReferral.docx':
            const srRequest = getSubroReferralData(existingVal, dataContext);
            return <SubroReferralForm id="subro-referral-form" onFinalize={onFinalize} initialRequest={srRequest} />;
        case '/Claims/GS_VendorLetter.docx':
            const vendorRequest = getVendorLetterData(existingVal, dataContext);
            return <VendorLetterForm id="vendor-letter-form" onFinalize={onFinalize} initialRequest={vendorRequest} />;
        default:
            return <Unselected>No form template is currently selected</Unselected>;
    }
};

export const Templates = [
    {
        id: '/Claims/GS_AckLetter.docx',
        name: 'Ack Letter',
        excludeFrom: ['L'],
        
    },
    {
        id: '/Claims/GS_AdjusterAssignmentEmail.docx',
        name: 'Adjuster Assignment Email',
        excludeFrom: ['L']
    },
    //{
    //    id: '/Claims/GS_DatabaseMail.docx',
    //    name: 'Database Mail'
    //},
    {
        id: '/Claims/GS_DenialCoverageLetterTemplate-2020updateCasualty.docx',
        name: 'Denial of Coverage (Casualty)',
        excludeFrom: ['L', 'P']
    },
    {
        id: '/Claims/GS_PropertyDenialTemplate.docx',
        name: 'Denial of Coverage (Property)',
        excludeFrom: ['L', 'C']
    },
    {
        id: '/Claims/GS_AFFIDAVITOFInsCoverageFlorida.docx',
        name: 'Florida Affidavit of Coverage',
        excludeFrom: ['L']
    },
    {
        id: '/Claims/GS_AFFIDAVITOFInsCoverageFlorida_Notarized.docx',
        name: 'Florida Affidavit of Coverage (Notarized)',
        excludeFrom: ['L']
    },
    {
        id: '/Claims/Genesis_AckLetter.docx',
        name: 'Genesis Ack Letter',
        excludeFrom: ['L'],
        includeForLegalEntity: [2, 3]
    },
    {
        id: '/Claims/Genesis_ClosingNoticeLetter.docx',
        name: 'Genesis Closing Notice Letter',
        excludeFrom: ['L'],
        includeForLegalEntity: [2, 3]
    },
    {
        id: '/Claims/GS_InternalAdjustmentToBroker.docx',
        name: 'Internal Adjustment to Broker',
        excludeFrom: ['L']
    },
    //{
    //    id: '/Claims/GS_LargeLoss.docx',
    //    name: 'Large Loss'
    //},
    {
        id: '/Claims/GS_LegalAssignmentAndBillingGuidelinesCoverLetter.docx',
        name: 'Legal Assignment & Billing Guidelines Cover Letter',
        excludeFrom: ['P', 'C']
    },
    {
        id: '/Claims/GS_NewJerseyInternalAppealsDispositionNoticeTLGFinal.docx',
        name: 'New Jersey Internal Appeals Disposition Notice',
        excludeFrom: ['L']
    },
    {
        id: '/Claims/GS_NewJerseyInternalAppealsProcedureGSNICGICFinalTLG.docx',
        name: 'New Jersey Internal Appeals Procedure GSNIC/GIC',
        excludeFrom: ['L']
    },
    {
        id: '/Claims/GS_NewJerseyNoticeofInternalAppealsProcedureTLGFinal.docx',
        name: 'New Jersey Notice of Internal Appeals Procedure',
        excludeFrom: ['L']
    },
    {
        id: '/Claims/GS_ProfessionalAcknowledgmentLetterToInsured.docx',
        name: 'Professional Acknowledgment to Insured',
        excludeFrom: ['L']
    },
    {
        id: '/Claims/GS_ProfessionalAcknowledgmentLetterToMGA.odt',
        name: 'Professional Acknowledgement to MGA',
        excludeFrom: ['L']
    },
    {
        id: '/Claims/GS_PropertyTemplateROR.docx',
        name: 'Reservation of Rights (Property)',
        excludeFrom: ['L', 'C']
    },
    {
        id: '/Claims/GS_RORTemplate-2020updateCasualty.docx',
        name: 'Reservation of Rights (Casualty)',
        excludeFrom: ['L', 'P']
    },
    {
        id: '/Claims/GS_SubroReferral.docx',
        name: 'Subro Referral',
        excludeFrom: ['L']
    },
    {
        id: '/Claims/GS_VendorLetter.docx',
        name: 'Vendor Letter',
        excludeFrom: ['L']
    },
];