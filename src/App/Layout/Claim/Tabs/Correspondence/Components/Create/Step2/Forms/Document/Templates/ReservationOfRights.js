import React from 'react';
import {
    FieldContainer,
} from '../../Common';
import {
    DatePicker,
    SelectList,
    TextInput,} from '../../../../../../../../../../Core/Forms/Common';
import {
    Required,
    Phone,
    MaxLength,
    EmailList
} from '../../../../../../../../../../Core/Providers/FormProvider/rules/CommonRules';
import {
    asForm,
    IsoDate,
    Schema
} from '../../../../../../../../../../Core/Providers/FormProvider';
import { DATE_FORMATS, G2Date } from '../../../../../../../../../../Core/Utility/G2Date';
import { ArrayDropdown } from '../../../../../../../../../../Core/Forms/Common/ArrayDropdown';
import { useSelector } from 'react-redux';
import { riskStatesSelectors } from '../../../../../../../../../../Core/State/slices/metadata/risk-states';
import { safeObj, safeStr, safeArray } from '../../../../../../../../../../Core/Utility/safeObject';
import { ensureNonNullObject } from '../../../../../../../../../../Core/Utility/rules';
import { getRealPolicy } from '../../../../../../../../../../Core/Utility/getRealPolicy';
import { TEMPLATE_TEXT } from '../../../../../../../../../../Core/Enumerations/app/correspondence-template-text';
import { processTemplateString } from '../../../../../../../../../../Core/Utility/processTemplateString';
import { templateTextSelectors } from '../../../../../../../../../../Core/State/slices/metadata/template-text';
import { makeEvent } from '../../../../../../../../../../Core/Utility/makeEvent';
import { MenuItem } from '@mui/material';

/**
 * @typedef {object} DocumentFormProps
 * @property {import('../../../../../../../../../../Core/Providers/FormProvider/model/Model').Model} model the bound model
 */

/**
 * The DocumentForm component
 * @param {DocumentFormProps} props component props
 * @type {import('react').Component<DocumentFormProps>}
 */
const ReservationOfRights = ({ model }) => {

    const riskStates = useSelector(riskStatesSelectors.selectData());
    const templateTexts = useSelector(templateTextSelectors.selectData());

    const [textDependencies, setTextDependencies] = React.useState({
        location: model.LossLocation.value,
        insured: model.InsuredName.value,
        claimant: model.InsuredName.value,
    });

    const onTextDependentChanged = (evt) => {
        const name = (evt.target.name === 'LossLocation' ? 'location' : (evt.target.name === 'InsuredName' ? 'insured' : (evt.target.name === 'ClaimantName' ? 'claimant' : evt.target.name)));
        setTextDependencies({ ...textDependencies, [name]: evt.target.value });
        model.handleUserInput(evt);
    }

    const finalizeTextDependentChange = (evt) => {
        if (textDependencies.location === 'CA') {
            const caTT = templateTexts.find(tt => tt.templateTextID === TEMPLATE_TEXT.PROR_CA_SPECIFIC);
            if (ensureNonNullObject(caTT)) {
                model.handleUserInput(makeEvent('CaliforniaSpecificClaimLanguage', processTemplateString(caTT.text, textDependencies)));
            }
        }
        else {
            model.handleUserInput(makeEvent('CaliforniaSpecificClaimLanguage', ''));
        }

        if (TEMPLATE_TEXT.hasOwnProperty(`PROR_STATE_${textDependencies.location}`)) {
            const ssTT = templateTexts.find(tt => tt.templateTextID === TEMPLATE_TEXT[`PROR_STATE_${textDependencies.location}`]);
            if (ensureNonNullObject(ssTT)) {
                model.handleUserInput(makeEvent('StateSpecificLanguage', processTemplateString(ssTT, textDependencies)));
            }
        }
        else {
            model.handleUserInput(makeEvent('StateSpecificLanguage', ''));
        }

        model.handleFinalizeInput(evt);
    }

    return (
        <>
            <FieldContainer>
                <TextInput
                    id="ClaimNumber"
                    label="Claim Number"
                    value={model.ClaimNumber.value}
                    onChange={model.handleUserInput}
                    onBlur={model.handleFinalizeInput}
                    maxLength="50"
                    error={model.ClaimNumber.showError}
                    helperText={model.ClaimNumber.helperText}
                    required
                />
            </FieldContainer>
            <FieldContainer>
                <TextInput
                    id="PolicyNumber"
                    label="Policy Number"
                    value={model.PolicyNumber.value}
                    onChange={model.handleUserInput}
                    onBlur={model.handleFinalizeInput}
                    maxLength="50"
                    error={model.PolicyNumber.showError}
                    helperText={model.PolicyNumber.helperText}
                    required
                />
            </FieldContainer>
            <FieldContainer>
                <DatePicker
                    id="EffectiveDate"
                    name="EffectiveDate"
                    label="Policy Effective Date"
                    fullWidth={true}
                    value={model.EffectiveDate.value}
                    onChange={model.handleUserInput}
                    onBlur={model.handleFinalizeInput}
                    variant="outlined"
                    disableFuture={true}
                    error={model.EffectiveDate.showError}
                    helperText={model.EffectiveDate.helperText}
                    required
                />
            </FieldContainer>
            <FieldContainer>
                <DatePicker
                    id="ExpirationDate"
                    name="ExpirationDate"
                    label="Policy Expiration Date"
                    fullWidth={true}
                    value={model.ExpirationDate.value}
                    onChange={model.handleUserInput}
                    onBlur={model.handleFinalizeInput}
                    variant="outlined"
                    disableFuture={true}
                    error={model.ExpirationDate.showError}
                    helperText={model.ExpirationDate.helperText}
                    required
                />
            </FieldContainer>
            <FieldContainer>
                <TextInput
                    id="InsuredName"
                    label="Insured Name"
                    value={model.InsuredName.value}
                    onChange={onTextDependentChanged}
                    onBlur={model.handleFinalizeInput}
                    maxLength="255"
                    error={model.InsuredName.showError}
                    helperText={model.InsuredName.helperText}
                    required
                />
            </FieldContainer>
            <FieldContainer>
                <TextInput
                    id="InsuredAddress"
                    label="Insured Address"
                    value={model.InsuredAddress.value}
                    onChange={model.handleUserInput}
                    onBlur={model.handleFinalizeInput}
                    maxLength="250"
                    error={model.InsuredAddress.showError}
                    helperText={model.InsuredAddress.helperText}
                    required
                />
            </FieldContainer>
            <FieldContainer>
                <TextInput
                    id="InsuredCityStateZip"
                    label="Insured City, State, Zip"
                    value={model.InsuredCityStateZip.value}
                    onChange={model.handleUserInput}
                    onBlur={model.handleFinalizeInput}
                    maxLength="250"
                    error={model.InsuredCityStateZip.showError}
                    helperText={model.InsuredCityStateZip.helperText}
                    required
                />
            </FieldContainer>
            <FieldContainer>
                <DatePicker
                    id="DateReceived"
                    name="DateReceived"
                    label="Date Received"
                    fullWidth={true}
                    value={model.DateReceived.value}
                    onChange={model.handleUserInput}
                    onBlur={model.handleFinalizeInput}
                    variant="outlined"
                    disableFuture={true}
                    error={model.DateReceived.showError}
                    helperText={model.DateReceived.helperText}
                    required
                />
            </FieldContainer>
            <FieldContainer>
                <SelectList
                    id="MrMrs"
                    name="MrMrs"
                    label="Recipient Salutation"
                    value={model.MrMrs.value}
                    onChange={model.handleFinalizeInput}
                    variant="outlined"
                    allowempty={false}
                    fullWidth={true}
                    error={model.MrMrs.showError}
                    helperText={model.MrMrs.error}
                    required
                >
                    <MenuItem value="Mr.">Mr.</MenuItem>
                    <MenuItem value="Mrs.">Mrs.</MenuItem>
                    <MenuItem value="Ms.">Ms.</MenuItem>
                    <MenuItem value="Dr.">Dr.</MenuItem>
                </SelectList>
            </FieldContainer>
            <FieldContainer>
                <TextInput
                    id="RecipientName"
                    label="Recipient Name"
                    value={model.RecipientName.value}
                    onChange={model.handleUserInput}
                    onBlur={model.handleFinalizeInput}
                    maxLength="250"
                    error={model.RecipientName.showError}
                    helperText={model.RecipientName.helperText}
                    required
                />
            </FieldContainer>
            <FieldContainer>
                <ArrayDropdown
                    id="LossLocation"
                    label="Loss State"
                    list={riskStates}
                    valueProp="stateCode"
                    displayProp="stateName"
                    value={model.LossLocation.value}
                    onChange={onTextDependentChanged}
                    onBlur={finalizeTextDependentChange}
                    error={model.LossLocation.showError}
                    helperText={model.LossLocation.helperText}
                    required
                />
            </FieldContainer>
            <FieldContainer>
                <TextInput
                    id="ClaimExaminer"
                    label="Examiner Name"
                    value={model.ClaimExaminer.value}
                    onChange={model.handleUserInput}
                    onBlur={model.handleFinalizeInput}
                    maxLength="255"
                    error={model.ClaimExaminer.showError}
                    helperText={model.ClaimExaminer.helperText}
                    required
                />
            </FieldContainer>
            <FieldContainer>
                <TextInput
                    id="ClaimExaminerPhone"
                    label="Examiner Phone"
                    value={model.ClaimExaminerPhone.value}
                    onChange={model.handleUserInput}
                    onBlur={model.handleFinalizeInput}
                    maxLength="15"
                    error={model.ClaimExaminerPhone.showError}
                    helperText={model.ClaimExaminerPhone.helperText}
                    required
                />
            </FieldContainer>
            <FieldContainer>
                <TextInput
                    id="MGABrokerAgentLawfirm"
                    label="CC Email Addresses"
                    value={model.MGABrokerAgentLawfirm.value}
                    onChange={model.handleUserInput}
                    onBlur={model.handleFinalizeInput}
                    maxLength="500"
                    error={model.MGABrokerAgentLawfirm.showError}
                    helperText={model.MGABrokerAgentLawfirm.helperText}
                    required
                />
            </FieldContainer>
            <FieldContainer>
                <TextInput
                    id="TypeOfNotice"
                    label="Type Of Notice"
                    value={model.TypeOfNotice.value}
                    onChange={model.handleUserInput}
                    onBlur={model.handleFinalizeInput}
                    maxLength="250"
                    error={model.TypeOfNotice.showError}
                    helperText={model.TypeOfNotice.helperText}
                    required
                />
            </FieldContainer>
            <FieldContainer>
                <TextInput
                    id="PotentialClaimFacts"
                    label="Facts of the Claim"
                    value={model.PotentialClaimFacts.value}
                    onChange={model.handleUserInput}
                    onBlur={model.handleFinalizeInput}
                    maxLength="5000"
                    multiline={true}
                    rows={8}
                    error={model.PotentialClaimFacts.showError}
                    helperText={model.PotentialClaimFacts.helperText}
                    required
                />
            </FieldContainer>
            <FieldContainer>
                <TextInput
                    id="CaliforniaSpecificClaimLanguage"
                    label="California Claim Wording"
                    value={model.CaliforniaSpecificClaimLanguage.value}
                    onChange={model.handleUserInput}
                    onBlur={model.handleFinalizeInput}
                    maxLength="5000"
                    multiline={true}
                    rows={8}
                    error={model.CaliforniaSpecificClaimLanguage.showError}
                    helperText={model.CaliforniaSpecificClaimLanguage.helperText}
                    disabled={model.LossLocation.value !== 'CA'}
                />
            </FieldContainer>
            <FieldContainer>
                <TextInput
                    id="SectionOfThePolicy"
                    label="Sections from Insuring Agreement"
                    value={model.SectionOfThePolicy.value}
                    onChange={model.handleUserInput}
                    onBlur={model.handleFinalizeInput}
                    maxLength="5000"
                    multiline={true}
                    rows={8}
                    error={model.SectionOfThePolicy.showError}
                    helperText={model.SectionOfThePolicy.helperText}
                    required
                />
            </FieldContainer>
            <FieldContainer>
                <TextInput
                    id="DetailsOfSectionOfThePolicy"
                    label="Reservation of Rights"
                    value={model.DetailsOfSectionOfThePolicy.value}
                    onChange={model.handleUserInput}
                    onBlur={model.handleFinalizeInput}
                    maxLength="5000"
                    multiline={true}
                    rows={8}
                    error={model.DetailsOfSectionOfThePolicy.showError}
                    helperText={model.DetailsOfSectionOfThePolicy.helperText}
                    required
                />
            </FieldContainer>
        </>
    );
};

const schema = new Schema();
schema.bindProperty('ClaimExaminer', [Required, MaxLength(255)])
    .bindProperty('InsuredName', [Required, MaxLength(250)])
    .bindProperty('InsuredAddress', [Required, MaxLength(250)])
    .bindProperty('InsuredCityStateZip', [Required, MaxLength(200)])
    .bindProperty('ClaimNumber', [Required, MaxLength(20)])
    .bindProperty('PolicyNumber', [Required, MaxLength(50)])
    .bindProperty('MrMrs', [Required])
    .bindProperty('RecipientName', [Required, MaxLength(255)])
    .bindProperty('DateReceived', [Required], { beforeSet: IsoDate })
    .bindProperty('TypeOfNotice', [Required, MaxLength(500)])
    .bindProperty('PotentialClaimFacts', [Required])
    .bindProperty('EffectiveDate', [Required], { beforeSet: IsoDate })
    .bindProperty('ExpirationDate', [Required], { beforeSet: IsoDate })
    .bindProperty('SectionOfThePolicy', [Required])
    .bindProperty('DetailsOfSectionOfThePolicy', [Required])
    .bindProperty('CaliforniaSpecificClaimLanguage', [])
    .bindProperty('StateSpecificLanguage', [])
    .bindProperty('ClaimExaminerPhone', [Required, Phone, MaxLength(20)])
    .bindProperty('MGABrokerAgentLawfirm', [EmailList])
    .bindProperty('LossLocation', [])
    .bindProperty('TodaysDate', [], {}, (new G2Date(new Date()).format(DATE_FORMATS.ISO_DATE_ONLY)));

export const ReservationOfRightsForm = asForm(ReservationOfRights, schema);

/**
 * 
 * @param {object} existingVal
 * @param {import('../../../../../../../../../../Core/State/slices/claim/types.d').ClaimMaster} claim
 * @param {object} email
 * @param {Array<import('../../../../../../../../../../Core/State/slices/metadata/risk-states/types.d').RiskState>} states
 * @param {Array<import('../../../../../../../../../../Core/State/slices/metadata/template-text/types.d').TemplateText>} texts
 */
export const getReservationOfRightsData = (existingVal, dataContext) => {

    const { claim, states, texts } = dataContext;
    const pol = getRealPolicy(claim, dataContext.assocPolicies);
    const e = safeObj(claim.examiner);

    const defState = safeObj(safeArray(states).find(s => s.riskStateID === parseInt(claim.lossLocation))).stateCode;
    const caText = processTemplateString((defState === 'CA' ? texts.find(t => t.templateTextID === TEMPLATE_TEXT.PROR_CA_SPECIFIC).text : ''), { insured: pol.insuredName });
    const ssTextTemplate = (TEMPLATE_TEXT.hasOwnProperty(`PROR_STATE_${defState}`) ? texts.find(t => t.templateTextID === TEMPLATE_TEXT[`PROR_STATE_${defState}`]).text : '');
    const ssText = processTemplateString(ssTextTemplate, {
        insured: pol.insuredName,
        claimant: pol.insuredName
    });

    const defaults = {
        ClaimExaminer: `${safeStr(e.firstName)} ${safeStr(e.lastName)}`,
        InsuredName: pol.insuredName,
        InsuredAddress: pol.insuredAddress,
        InsuredCityStateZip: pol.insuredCityStateZip,
        ClaimNumber: claim.claimID,
        PolicyNumber: pol.policyID,
        MrMrs: 'Mr.',
        RecipientName: '',
        DateReceived: safeStr(claim.dateReceived),
        TypeOfNotice: 'the Insuring Agreement',
        PotentialClaimFacts: '',
        EffectiveDate: pol.effectiveDate,
        ExpirationDate: pol.expirationDate,
        SectionOfThePolicy: '',
        DetailsOfSectionOfThePolicy: '',
        CaliforniaSpecificClaimLanguage: caText,
        StateSpecificLanguage: ssText,
        ClaimExaminerPhone: safeStr(e.businessPhone),
        MGABrokerAgentLawfirm: '',
        LossLocation: safeStr(defState),
    };

    return {
        ...defaults,
        ...(existingVal || {}),
        TodaysDate: (new G2Date(Date.now())).format(DATE_FORMATS.ISO_DATE_ONLY),
    };
}