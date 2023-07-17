import React from 'react';
import {
    FieldContainer,
} from '../../Common';
import {
    DatePicker,
    SelectList,
    TextInput,
} from '../../../../../../../../../../Core/Forms/Common';
import {
    Required,
    Email,
    MaxLength,
    EmailList,
    Phone,
    Currency
} from '../../../../../../../../../../Core/Providers/FormProvider/rules/CommonRules';
import {
    asForm,
    IsoDate,
    Schema
} from '../../../../../../../../../../Core/Providers/FormProvider';
import {
    DATE_FORMATS,
    G2Date
} from '../../../../../../../../../../Core/Utility/G2Date';
import {
    safeArray,
    safeObj,
    safeStr
} from '../../../../../../../../../../Core/Utility/safeObject';
import {
     ensureNonNullObject,
} from '../../../../../../../../../../Core/Utility/rules';
import { makeEvent } from '../../../../../../../../../../Core/Utility/makeEvent';
import { MenuItem } from '@mui/material';
//import { AddBox } from '@mui/icons-material';
//import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { riskStatesSelectors } from '../../../../../../../../../../Core/State/slices/metadata/risk-states';
import { ArrayDropdown } from '../../../../../../../../../../Core/Forms/Common/ArrayDropdown';
import { getRealPolicy } from '../../../../../../../../../../Core/Utility/getRealPolicy';
import { HtmlInput } from '../../../../../../../../../Common/Components/HtmlInput/HtmlInput';
import { contactsSelectors } from '../../../../../../../../../../Core/State/slices/contact';

/**
 * @typedef {object} DocumentFormProps
 * @property {import('../../../../../../../../../../Core/Providers/FormProvider/model/Model').Model} model the bound model
 */


/**
 * The DocumentForm component
 * @param {DocumentFormProps} props component props
 * @type {import('react').Component<DocumentFormProps>}
 */
const AdjusterAssignmentEmail = ({ model }) => {

    const contacts = useSelector(contactsSelectors.selectData());
    const riskStates = useSelector(riskStatesSelectors.selectData());

    const selectInspectionContact = (evt) => {
        const { value } = evt.target;
        const ct = contacts.find(c => c.claimContactID === value);
        model.handleFinalizeInput(evt);

        if (ensureNonNullObject(ct)) {
            model.handleFinalizeInput(makeEvent('ContactForInspection', ct.name));
            model.handleFinalizeInput(makeEvent('ContactForInspectionTelephoneNumber', ct.phone));
        }
    }

    console.log(model.LossSection);

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
                <TextInput
                    id="InsuredName"
                    label="Insured Name"
                    value={model.InsuredName.value}
                    onChange={model.handleUserInput}
                    onBlur={model.handleFinalizeInput}
                    maxLength="255"
                    error={model.InsuredName.showError}
                    helperText={model.InsuredName.helperText}
                    required
                />
            </FieldContainer>
            <FieldContainer>
                <DatePicker
                    id="EffectiveDate"
                    name="EfectiveDate"
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
                    disableFuture={false}
                    error={model.ExpirationDate.showError}
                    helperText={model.ExpirationDate.helperText}
                    required
                />
            </FieldContainer>
            <FieldContainer>
                <TextInput
                    id="PolicyForm"
                    label="Policy Form"
                    value={model.PolicyForm.value}
                    onChange={model.handleUserInput}
                    onBlur={model.handleFinalizeInput}
                    maxLength="255"
                    error={model.PolicyForm.showError}
                    helperText={model.PolicyForm.helperText}
                    required
                />
            </FieldContainer>
            <FieldContainer>
                <TextInput
                    id="Limits"
                    label="Limits"
                    value={model.Limits.value}
                    onChange={model.handleUserInput}
                    onBlur={model.handleFinalizeInput}
                    maxLength="255"
                    error={model.Limits.showError}
                    helperText={model.Limits.helperText}
                    required
                />
            </FieldContainer>
            <FieldContainer>
                <TextInput
                    id="Deductible"
                    label="Deductible"
                    value={model.Deductible.value}
                    onChange={model.handleUserInput}
                    onBlur={model.handleFinalizeInput}
                    maxLength="255"
                    error={model.Deductible.showError}
                    helperText={model.Deductible.helperText}
                    required
                />
            </FieldContainer>
            <FieldContainer>
                <TextInput
                    id="Coinsurance"
                    label="Coinsurance"
                    value={model.Coinsurance.value}
                    onChange={model.handleUserInput}
                    onBlur={model.handleFinalizeInput}
                    maxLength="255"
                    error={model.Coinsurance.showError}
                    helperText={model.Coinsurance.helperText}
                    required
                />
            </FieldContainer>
            <FieldContainer>
                <TextInput
                    id="ACVRCV"
                    label="ACV/RCV"
                    value={model.ACVRCV.value}
                    onChange={model.handleUserInput}
                    onBlur={model.handleFinalizeInput}
                    maxLength="255"
                    error={model.ACVRCV.showError}
                    helperText={model.ACVRCV.helperText}
                    required
                />
            </FieldContainer>
            <FieldContainer>
                <DatePicker
                    id="DateOfLoss"
                    name="DateOfLoss"
                    label="Date of Loss"
                    fullWidth={true}
                    value={model.DateOfLoss.value}
                    onChange={model.handleUserInput}
                    onBlur={model.handleFinalizeInput}
                    variant="outlined"
                    disableFuture={true}
                    error={model.DateOfLoss.showError}
                    helperText={model.DateOfLoss.helperText}
                    required
                />
            </FieldContainer>
            <FieldContainer>
                <ArrayDropdown
                    id="LossLocation"
                    label="Loss Location"
                    list={riskStates}
                    valueProp="stateCode"
                    displayProp="stateName"
                    value={model.LossLocation.value}
                    onChange={model.handleUserInput}
                    onBlur={model.handleFinalizeInput}
                    error={model.LossLocation.showError}
                    helperText={model.LossLocation.helperText}
                    required
                />
            </FieldContainer>
            <FieldContainer>
                <TextInput
                    id="LossDescription"
                    label="Loss Description"
                    value={model.LossDescription.value}
                    onChange={model.handleUserInput}
                    onBlur={model.handleFinalizeInput}
                    maxLength="500"
                    error={model.LossDescription.showError}
                    helperText={model.LossDescription.helperText}
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
                    id="ClaimExaminerPhoneNumber"
                    label="Examiner Phone"
                    value={model.ClaimExaminerPhoneNumber.value}
                    onChange={model.handleUserInput}
                    onBlur={model.handleFinalizeInput}
                    maxLength="255"
                    error={model.ClaimExaminerPhoneNumber.showError}
                    helperText={model.ClaimExaminerPhoneNumber.helperText}
                    required
                />
            </FieldContainer>
            <FieldContainer>
                <TextInput
                    id="EmailAddressOfContact"
                    label="Contact Email"
                    value={model.EmailAddressOfContact.value}
                    onChange={model.handleUserInput}
                    onBlur={model.handleFinalizeInput}
                    maxLength="255"
                    error={model.EmailAddressOfContact.showError}
                    helperText={model.EmailAddressOfContact.helperText}
                    required
                />
            </FieldContainer>
            <FieldContainer>
                <TextInput
                    id="PhoneNumberOfContact"
                    label="Contact Phone"
                    value={model.PhoneNumberOfContact.value}
                    onChange={model.handleUserInput}
                    onBlur={model.handleFinalizeInput}
                    maxLength="25"
                    error={model.PhoneNumberOfContact.showError}
                    helperText={model.PhoneNumberOfContact.helperText}
                    required
                />
            </FieldContainer>
            <FieldContainer>
                <TextInput
                    id="EmailAddressFieldOnUI"
                    label="CC Email"
                    value={model.EmailAddressFieldOnUI.value}
                    onChange={model.handleUserInput}
                    onBlur={model.handleFinalizeInput}
                    maxLength="500"
                    error={model.EmailAddressFieldOnUI.showError}
                    helperText={model.EmailAddressFieldOnUI.helperText}
                />
            </FieldContainer>
            <FieldContainer>
                <SelectList
                    id="ContactForInspectionID"
                    name="ContactForInspectionID"
                    label="Contact For Inspection"
                    value={model.ContactForInspectionID.value}
                    onChange={selectInspectionContact}
                    variant="outlined"
                    allowempty={false}
                    fullWidth={true}
                    error={model.ContactForInspectionID.showError}
                    helperText={model.ContactForInspectionID.helperText}
                >
                    {
                        safeArray(contacts).map(c => <MenuItem key={c.claimContactID} value={c.claimContactID}>{c.name}</MenuItem>)
                    }
                </SelectList>
            </FieldContainer>
            <FieldContainer>
                <HtmlInput
                    id="LossSection"
                    label="Loss Lines"
                    value={model.LossSection.value}
                    onBlur={model.handleFinalizeInput}
                    error={model.LossSection.showError}
                    helperText={model.LossSection.helperText}
                    />
            </FieldContainer>
            <FieldContainer>
                <TextInput
                    id="AdditionalComments"
                    label="Additional Comments"
                    value={model.AdditionalComments.value}
                    onChange={model.handleUserInput}
                    onBlur={model.handleFinalizeInput}
                    maxLength="5000"
                    multiline={true}
                    rows={3}
                    error={model.AdditionalComments.showError}
                    helperText={model.AdditionalComments.helperText}
                />
            </FieldContainer>
        </>
    );
};

const LOSS_SECTION_DEFAULT = `<ul>
<li>None</li>
<li>Assign adjuster or Sr. Adj - A General Adj needs Gstar approval</li>
<li>Confirm cause of loss and point of origin.</li>
<li>Determine scope of loss with estimate of damages.</li>
<li>Determine values of building, contents, loss of income for coinsurance valuation.</li>
<li>Get statement from insured.</li>
<li>Insured contact within 24 hours of loss assignment.</li>
<li>Issue Proof of Loss Forms pursuant to state regulations to include required fraud language.</li>
<li>Notify police of our interest upon settlement.</li>
<li>Obtain ACV / RCV appraisal of damages, as applicable.</li>
<li>Obtain fire and / or police department report.</li>
<li>Salvage - location - value - buyer - and charge.</li>
<li>Subrogation investigation - place our interests on notice.</li>
<li>Take a reasonable amount of photos of damage.</li>
<li>Take non - waiver reservation of rights.</li>
</ul>`;

const schema = new Schema();
schema.bindProperty('ClaimExaminer', [Required, MaxLength(255)])
    .bindProperty('EmailAddressOfContact', [Required, Email, MaxLength(250)])
    .bindProperty('PhoneNumberOfContact', [Required, Phone])
    .bindProperty('EmailAddressFieldOnUI', [EmailList, MaxLength(500)])
    .bindProperty('ClaimExaminerPhoneNumber', [Required, Phone])
    .bindProperty('InsuredName', [Required, MaxLength(255)])
    .bindProperty('ClaimNumber', [Required, MaxLength(20)])
    .bindProperty('PolicyNumber', [Required, MaxLength(50)])
    .bindProperty('DateOfLoss', [Required], { beforeSet: IsoDate })
    .bindProperty('EffectiveDate', [Required], { beforeSet: IsoDate })
    .bindProperty('ExpirationDate', [Required], { beforeSet: IsoDate })
    .bindProperty('LossSection', [], {}, LOSS_SECTION_DEFAULT)
    .bindProperty('ContactForInspectionID', [Required])
    .bindProperty('ContactForInspection', [MaxLength(255)])
    .bindProperty('ContactForInspectionTelephoneNumber', [Phone])
    .bindProperty('LossLocation', [Required, MaxLength(255)])
    .bindProperty('LossDescription', [Required, MaxLength(500)])
    .bindProperty('PolicyForm', [Required, MaxLength(50)])
    .bindProperty('Deductible', [Required, Currency])
    .bindProperty('Limits', [Required, Currency])
    .bindProperty('Coinsurance', [Required])
    .bindProperty('ACVRCV', [Required])
    .bindProperty('AdditionalComments', [MaxLength(5000)])
    .bindProperty('TodaysDate', [], {}, (new G2Date(new Date()).format(DATE_FORMATS.ISO_DATE_ONLY)));

export const AdjusterAssignmentEmailForm = asForm(AdjusterAssignmentEmail, schema);

/**
 * 
 * @param {any} existingVal
 * @param {import('./index').DataContext} dataContext
 */
export const getAdjusterAssignmentEmailData = (existingVal, dataContext) => {

    const { claim, email, states, propPolicy } = dataContext;

    const { examiner = {} } = safeObj(claim);
    const plc = getRealPolicy(claim, dataContext.assocPolicies);
    const e = safeObj(examiner);

    const defState = safeObj(safeArray(states).find(s => s.riskStateID === parseInt(claim.lossLocation))).stateCode;

    const defaults = {
        EmailAddressOfContact: safeStr(safeObj(email).to),
        PhoneNumberOfContact: '',
        EmailAddressFieldOnUI: safeStr(safeObj(email).cc),
        ClaimExaminer: `${safeStr(e.firstName)} ${safeStr(e.lastName)}`,
        ClaimExaminerPhoneNumber: safeStr(e.businessPhone),
        InsuredName: plc.insuredName,
        ClaimNumber: claim.claimID,
        PolicyNumber: plc.policyID,
        DateOfLoss: (claim.dOL || ''),
        EffectiveDate: plc.effectiveDate,
        ExpirationDate: plc.expirationDate,
        MortgageHolderName: '',
        LienHolderName: '',
        LossSection: '',
        BrokerName: '',
        BrokerPhoneNumber: '',
        BrokerEmailAddress: '',
        AgentName: '',
        AgentPhoneNumber: '',
        AgentEmailAddress: '',
        ContactForInspectionID: '',
        ContactForInspection: '',
        ContactForInspectionTelephoneNumber: '',
        LossLocation: defState,
        LossDescription: claim.lossDesc,
        PolicyForm: safeObj(propPolicy).policyForms,
        Deductible: safeObj(propPolicy).deductible,
        Limits: safeObj(propPolicy).limits,
        Coinsurance: safeObj(propPolicy).coinsurance,
        ACVRCV: safeObj(propPolicy).calcBasis,
        AdditionalComments: '',
    };

    return {
        ...defaults,
        ...(existingVal || {}),
        TodaysDate: (new G2Date(Date.now())).format(DATE_FORMATS.ISO_DATE_ONLY),
    };
}