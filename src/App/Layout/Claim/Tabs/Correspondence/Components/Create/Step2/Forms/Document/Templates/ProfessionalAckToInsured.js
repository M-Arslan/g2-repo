import React from 'react';
import {
    FieldContainer,
} from '../../Common';
import {
    Checkbox,
    DatePicker,
    SelectList,
    TextInput,} from '../../../../../../../../../../Core/Forms/Common';
import {
    Required,
    Email,
    MaxLength,
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
    safeObj,
    safeStr
} from '../../../../../../../../../../Core/Utility/safeObject';
import {
    MenuItem
} from '@mui/material';
import { getRealPolicy } from '../../../../../../../../../../Core/Utility/getRealPolicy';
import { makeEvent } from '../../../../../../../../../../Core/Utility/makeEvent';

/**
 * @typedef {object} DocumentFormProps
 * @property {import('../../../../../../../../../../Core/Providers/FormProvider/model/Model').Model} model the bound model
 */

/**
 * The DocumentForm component
 * @param {DocumentFormProps} props component props
 * @type {import('react').Component<DocumentFormProps>}
 */
const PALToInsured = ({ model }) => {

    const onCheckBoxChanged = (evt) => {
        model.handleUserInput(evt);

        let block = '';
        if (model.Investigating.value === true) {
            block += `<p>We are in the process of investigating this claim and would appreciate it if you would forward a complete copy of your file related to this matter.</p>`;
        }

        if (model.DefenseCounsel.value === true) {
            block += `<p>Please contact me to discuss this matter and whether we need to retain defense counsel.</p>`;
        }

        model.handleFinalizeInput(makeEvent('ClaimExaminerInput', block));
    }

    return (
        <>
            <FieldContainer>
                <TextInput
                    id="ClaimID"
                    label="Claim Number"
                    value={model.ClaimID.value}
                    onChange={model.handleUserInput}
                    onBlur={model.handleFinalizeInput}
                    maxLength="50"
                    error={model.ClaimID.showError}
                    helperText={model.ClaimID.helperText}
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
                <SelectList
                    id="Company"
                    name="Company"
                    label="Company"
                    value={model.Company.value}
                    onChange={model.handleUserInput}
                    onBlur={model.handleFinalizeInput}
                    variant="outlined"
                    allowempty={false}
                    fullWidth={true}
                    error={model.Company.showError}
                    helperText={model.Company.error}
                    required
                >
                    <MenuItem value="General Star National Insurance Company">General Star National Insurance Company</MenuItem>
                    <MenuItem value="General Star Indemnity Company">General Star Indemnity Company</MenuItem>
                </SelectList>
            </FieldContainer>
            <FieldContainer>
                <SelectList
                    id="PolicyType"
                    name="PolicyType"
                    label="Policy Type"
                    fullWidth={true}
                    allowempty={false}
                    value={model.PolicyType.value}
                    onChange={model.handleUserInput}
                    onBlur={model.handleFinalizeInput}
                    variant="outlined"
                    error={model.PolicyType.showError}
                    helperText={model.PolicyType.helperText}
                    required
                >
                    <MenuItem value="Accountants">Accountants</MenuItem>
                    <MenuItem value="Architects & Engineers">Architects & Engineers</MenuItem>
                    <MenuItem value="Home Inspector">Home Inspector</MenuItem>
                    <MenuItem value="Lawyers">Lawyers</MenuItem>
                    <MenuItem value="Miscellaneous Health Care Facilities">Miscellaneous Health Care Facilities</MenuItem>
                    <MenuItem value="Miscellaneous Professional">Miscellaneous Professional</MenuItem>
                    <MenuItem value="Physicians and Surgeons Professional Liability">Physicians and Surgeons Professional Liability</MenuItem>
                    <MenuItem value="Real Estate Agents">Real Estate Agents</MenuItem>
                    <MenuItem value="Real Estate Appraisers">Real Estate Appraisers</MenuItem>
                    <MenuItem value="Title Agent">Title Agent</MenuItem>
                </SelectList>
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
                    disableFuture={false}
                    error={model.DateReceived.showError}
                    helperText={model.DateReceived.helperText}
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
                    id="ClaimExaminerEmail"
                    label="Examiner Email"
                    value={model.ClaimExaminerEmail.value}
                    onChange={model.handleUserInput}
                    onBlur={model.handleFinalizeInput}
                    maxLength="255"
                    error={model.ClaimExaminerEmail.showError}
                    helperText={model.ClaimExaminerEmail.helperText}
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
                    maxLength="50"
                    error={model.ClaimExaminerPhoneNumber.showError}
                    helperText={model.ClaimExaminerPhoneNumber.helperText}
                    required
                />
            </FieldContainer>
            <FieldContainer>
                <TextInput
                    id="Claimant"
                    label="Claimant"
                    value={model.Claimant.value}
                    onChange={model.handleUserInput}
                    onBlur={model.handleFinalizeInput}
                    maxLength="500"
                    error={model.Claimant.showError}
                    helperText={model.Claimant.helperText}
                    required
                />
            </FieldContainer>
            <FieldContainer>
                <TextInput
                    id="Recipient"
                    label="Recipient"
                    value={model.Recipient.value}
                    onChange={model.handleUserInput}
                    onBlur={model.handleFinalizeInput}
                    maxLength="500"
                    error={model.Recipient.showError}
                    helperText={model.Recipient.helperText}
                    required
                />
            </FieldContainer>
            <FieldContainer>
                <TextInput
                    id="PerClaimLimit"
                    label="Per Claim Limit"
                    value={model.PerClaimLimit.value}
                    onChange={model.handleUserInput}
                    onBlur={model.handleFinalizeInput}
                    maxLength="50"
                    error={model.PerClaimLimit.showError}
                    helperText={model.PerClaimLimit.helperText}
                    required
                />
            </FieldContainer>
            <FieldContainer>
                <TextInput
                    id="AggregateLimit"
                    label="Aggregate Limit"
                    value={model.AggregateLimit.value}
                    onChange={model.handleUserInput}
                    onBlur={model.handleFinalizeInput}
                    maxLength="50"
                    error={model.AggregateLimit.showError}
                    helperText={model.AggregateLimit.helperText}
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
                    maxLength="50"
                    error={model.Deductible.showError}
                    helperText={model.Deductible.helperText}
                    required
                />
            </FieldContainer>
            <FieldContainer>
                <SelectList
                    id="BasisType"
                    name="BasisType"
                    label="Basis Type"
                    value={model.BasisType.value}
                    onChange={model.handleUserInput}
                    onBlur={model.handleFinalizeInput}
                    variant="outlined"
                    allowempty={false}
                    fullWidth={true}
                    error={model.BasisType.showError}
                    helperText={model.BasisType.error}
                    required
                >
                    <MenuItem value="a claims made and reported">Claims Made & Reported</MenuItem>
                    <MenuItem value="an occurrence">An Occurrence</MenuItem>
                </SelectList>
            </FieldContainer>
            <FieldContainer>
                <SelectList
                    id="AreOrAreNotIncluded"
                    name="AreOrAreNotIncluded"
                    label="Are or Are Not Included"
                    value={model.AreOrAreNotIncluded.value}
                    onChange={model.handleUserInput}
                    onBlur={model.handleFinalizeInput}
                    variant="outlined"
                    allowempty={false}
                    fullWidth={true}
                    error={model.AreOrAreNotIncluded.showError}
                    helperText={model.AreOrAreNotIncluded.error}
                    required
                >
                    <MenuItem value="are">Are</MenuItem>
                    <MenuItem value="are not">Are Not</MenuItem>
                </SelectList>
            </FieldContainer>
            <FieldContainer>
                <SelectList
                    id="DamagesClaimExpensesOrDamages"
                    name="DamagesClaimExpensesOrDamages"
                    label="Damages"
                    value={model.DamagesClaimExpensesOrDamages.value}
                    onChange={model.handleUserInput}
                    onBlur={model.handleFinalizeInput}
                    variant="outlined"
                    allowempty={false}
                    fullWidth={true}
                    error={model.DamagesClaimExpensesOrDamages.showError}
                    helperText={model.DamagesClaimExpensesOrDamages.error}
                    required
                >
                    <MenuItem value="Damages">Damages</MenuItem>
                    <MenuItem value="Damages and Claim Expenses">Damages and Claim Expenses</MenuItem>
                </SelectList>
            </FieldContainer>
            <FieldContainer>
                <Checkbox id="Investigating"
                    onChange={onCheckBoxChanged}
                    checkedValue={true}
                    uncheckedValue={false}
                    value={model.Investigating.value}
                    label="Investigating"
                />
            </FieldContainer>
            <FieldContainer>
                <Checkbox id="DefenseCounsel"
                    onChange={onCheckBoxChanged}
                    checkedValue={true}
                    uncheckedValue={false}
                    value={model.DefenseCounsel.value}
                    label="Defense Counsel"
                />
            </FieldContainer>
        </>
    );
};

const schema = new Schema();
schema.bindProperty('ClaimExaminer', [Required, MaxLength(255)])
    .bindProperty('ClaimExaminerEmail', [Required, Email, MaxLength(250)])
    .bindProperty('ClaimExaminerPhoneNumber', [Required, Phone, MaxLength(50)])
    .bindProperty('ClaimID', [Required, MaxLength(20)])
    .bindProperty('PolicyNumber', [Required, MaxLength(50)])
    .bindProperty('InsuredName', [Required, MaxLength(255)])
    .bindProperty('DateReceived', [Required], { beforeSet: IsoDate })
    .bindProperty('Company', [Required])
    .bindProperty('PolicyType', [Required])
    .bindProperty('BasisType', [Required])
    .bindProperty('EffectiveDate', [Required], { beforeSet: IsoDate })
    .bindProperty('ExpirationDate', [Required], { beforeSet: IsoDate })
    .bindProperty('Claimant', [Required, MaxLength(255)])
    .bindProperty('Recipient', [Required, MaxLength(255)])
    .bindProperty('PerClaimLimit', [Required, Currency])
    .bindProperty('AggregateLimit', [Required, Currency])
    .bindProperty('AreOrAreNotIncluded', [Required])
    .bindProperty('Deductible', [Required, Currency])
    .bindProperty('DamagesClaimExpensesOrDamages', [Required])
    .bindProperty('Investigating')
    .bindProperty('DefenseCounsel')
    .bindProperty('ClaimExaminerInput')
    .bindProperty('TodaysDate', [], {}, (new G2Date(new Date()).format(DATE_FORMATS.ISO_DATE_ONLY)));

export const PALToInsuredForm = asForm(PALToInsured, schema);

/**
 * 
 * @param {any} existingVal
 * @param {import('../../../../../../../../../../Core/State/slices/claim/types.d').ClaimMaster} claim
 * @param {any} email
 */
export const getPALToInsuredData = (existingVal, dataContext) => {

    const { claim } = dataContext;
    const plc = getRealPolicy(claim, dataContext.assocPolicies);
    const e = safeObj(claim.examiner);

    const defaults = {
        ClaimID: claim.claimID,
        ClaimExaminer: `${e.firstName || ''} ${e.lastName || ''}`,
        ClaimExaminerEmail: safeStr(e.emailAddress),
        ClaimExaminerPhoneNumber: safeStr(e.businessPhone),
        PolicyNumber: plc.policyID,
        InsuredName: plc.insuredName,
        DateReceived: (claim.dateReceived || ''),
        PolicyType: '',
        BasisType: '',
        EffectiveDate: plc.effectiveDate,
        ExpirationDate: plc.expirationDate,
        Company: '',
        Claimant: '',
        Recipient: '',
        PerClaimLimit: '',
        AggregateLimit: '',
        AreOrAreNoIncluded: '',
        Deductible: '',
        DamagesClaimExpensesOrDamages: '',
        Investigating: false,
        DefenseCounsel: false,
    };

    return {
        ...defaults,
        ...(existingVal || {}),
        TodaysDate: (new G2Date(Date.now())).format(DATE_FORMATS.ISO_DATE_ONLY),
    };
}