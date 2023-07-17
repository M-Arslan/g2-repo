import React from 'react';
import {
    MenuItem
} from '@mui/material';
import {
    FieldContainer,
} from '../../Common';
import {
    DatePicker,
    TextInput,    SelectList} from '../../../../../../../../../../Core/Forms/Common';
import {
    Required,
    Email,
    MaxLength,
    Phone
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
    ensureNonEmptyString,
} from '../../../../../../../../../../Core/Utility/rules';
import { makeEvent } from '../../../../../../../../../../Core/Utility/makeEvent';
import { getRealPolicy } from '../../../../../../../../../../Core/Utility/getRealPolicy';

/**
 * @typedef {object} DocumentFormProps
 * @property {import('../../../../../../../../../../Core/Providers/FormProvider/model/Model').Model} model the bound model
 */

/**
 * The DocumentForm component
 * @param {DocumentFormProps} props component props
 * @type {import('react').Component<DocumentFormProps>}
 */
const NJInternalAppealsDispositionTLG = ({ model }) => {

    const setCompanyFields = (evt) => {
        const { value } = evt.target;

        if (ensureNonEmptyString(value)) {
            model.handleFinalizeInput(makeEvent('Company', (value === 'GSNIC' ? 'General Star National Insurance Company' : (value === 'GIC' ? 'Genesis Insurance Company' : ''))));
            model.handleFinalizeInput(evt);
        }
    };

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
                <TextInput
                    id="Claimant"
                    label="Claimant"
                    value={model.Claimant.value}
                    onChange={model.handleUserInput}
                    onBlur={model.handleFinalizeInput}
                    maxLength="255"
                    error={model.Claimant.showError}
                    helperText={model.Claimant.helperText}
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
                    id="ClaimExaminerTitle"
                    label="Examiner Title"
                    value={model.ClaimExaminerTitle.value}
                    onChange={model.handleUserInput}
                    onBlur={model.handleFinalizeInput}
                    maxLength="255"
                    error={model.ClaimExaminerTitle.showError}
                    helperText={model.ClaimExaminerTitle.helperText}
                    required
                />
            </FieldContainer>
            <FieldContainer>
                <TextInput
                    id="UnitManager"
                    label="Unit Manager Name"
                    value={model.UnitManager.value}
                    onChange={model.handleUserInput}
                    onBlur={model.handleFinalizeInput}
                    maxLength="255"
                    error={model.UnitManager.showError}
                    helperText={model.UnitManager.helperText}
                    required
                />
            </FieldContainer>
            <FieldContainer>
                <TextInput
                    id="UnitManagerAddress"
                    label="Unit Manager Address"
                    value={model.UnitManagerAddress.value}
                    onChange={model.handleUserInput}
                    onBlur={model.handleFinalizeInput}
                    maxLength="255"
                    error={model.UnitManagerAddress.showError}
                    helperText={model.UnitManagerAddress.helperText}
                    required
                />
            </FieldContainer>
            <FieldContainer>
                <TextInput
                    id="UnitManagerCityStateZip"
                    label="Unit Manager City, State, & Zip"
                    value={model.UnitManagerCityStateZip.value}
                    onChange={model.handleUserInput}
                    onBlur={model.handleFinalizeInput}
                    maxLength="255"
                    error={model.UnitManagerCityStateZip.showError}
                    helperText={model.UnitManagerCityStateZip.helperText}
                    required
                />
            </FieldContainer>
            <FieldContainer>
                <TextInput
                    id="UnitManagerPhone"
                    label="Unit Manager Phone"
                    value={model.UnitManagerPhone.value}
                    onChange={model.handleUserInput}
                    onBlur={model.handleFinalizeInput}
                    maxLength="255"
                    error={model.UnitManagerPhone.showError}
                    helperText={model.UnitManagerPhone.helperText}
                    required
                />
            </FieldContainer>
            <FieldContainer>
                <TextInput
                    id="UnitManagerEmail"
                    label="Unit Manager Email"
                    value={model.UnitManagerEmail.value}
                    onChange={model.handleUserInput}
                    onBlur={model.handleFinalizeInput}
                    maxLength="255"
                    error={model.UnitManagerEmail.showError}
                    helperText={model.UnitManagerEmail.helperText}
                    required
                />
            </FieldContainer>
            <FieldContainer>
                <SelectList
                    id="CompanyInitials"
                    name="CompanyInitials"
                    label="Company"
                    value={model.CompanyInitials.value}
                    onChange={setCompanyFields}
                    variant="outlined"
                    allowempty={false}
                    fullWidth={true}
                    error={model.CompanyInitials.showError}
                    helperText={model.CompanyInitials.error}
                    required
                >
                    <MenuItem value="GSNIC">General Star National Insurance Company (GSNIC)</MenuItem>
                    <MenuItem value="GIC">Genesis Insurance Company (GIC)</MenuItem>
                </SelectList>
            </FieldContainer>
            <FieldContainer>
                <TextInput
                    id="CompanyPhoneNumber"
                    label="Company Phone"
                    value={model.CompanyPhoneNumber.value}
                    onChange={model.handleUserInput}
                    onBlur={model.handleFinalizeInput}
                    maxLength="25"
                    error={model.CompanyPhoneNumber.showError}
                    helperText={model.CompanyPhoneNumber.helperText}
                    required
                />
            </FieldContainer>
            <FieldContainer>
                <TextInput
                    id="ClaimExecutiveSignature"
                    label="Claim Executive Signature"
                    value={model.ClaimExecutiveSignature.value}
                    onChange={model.handleUserInput}
                    onBlur={model.handleFinalizeInput}
                    maxLength="255"
                    error={model.ClaimExecutiveSignature.showError}
                    helperText={model.ClaimExecutiveSignature.helperText}
                    required
                />
            </FieldContainer>
            <FieldContainer>
                <SelectList
                    id="CoveragePositionOrOfferedSettlement"
                    name="CoveragePositionOrOfferedSettlement"
                    label="Coverage Position Or Offered Settlement"
                    value={model.CoveragePositionOrOfferedSettlement.value}
                    onChange={model.handleUserInput}
                    onBlur={model.handleFinalizeInput}
                    variant="outlined"
                    allowempty={false}
                    fullWidth={true}
                    error={model.CoveragePositionOrOfferedSettlement.showError}
                    helperText={model.CoveragePositionOrOfferedSettlement.error}
                    required
                >
                    <MenuItem value="coverage position">Coverage Position</MenuItem>
                    <MenuItem value="offered settlement">Offered Settlement</MenuItem>
                </SelectList>
            </FieldContainer>
            <FieldContainer>
                <TextInput
                    id="AdminCode"
                    label="Admin Code"
                    value={model.AdminCode.value}
                    onChange={model.handleUserInput}
                    onBlur={model.handleFinalizeInput}
                    maxLength="255"
                    error={model.AdminCode.showError}
                    helperText={model.AdminCode.helperText}
                    required
                />
            </FieldContainer>
            <FieldContainer>
                <TextInput
                    id="FinalDisposition"
                    label="Final Disposition Text"
                    value={model.FinalDisposition.value}
                    onChange={model.handleUserInput}
                    onBlur={model.handleFinalizeInput}
                    maxLength="5000"
                    multiline={true}
                    rows={6}
                    error={model.FinalDisposition.showError}
                    helperText={model.FinalDisposition.helperText}
                    required
                />
            </FieldContainer>
            <FieldContainer>
                <TextInput
                    id="RecipientName"
                    label="Recipient Name"
                    value={model.RecipientName.value}
                    onChange={model.handleUserInput}
                    onBlur={model.handleFinalizeInput}
                    maxLength="255"
                    error={model.RecipientName.showError}
                    helperText={model.RecipientName.helperText}
                    required
                />
            </FieldContainer>
            <FieldContainer>
                <TextInput
                    id="RecipientCompany"
                    label="Recipient Company"
                    value={model.RecipientCompany.value}
                    onChange={model.handleUserInput}
                    onBlur={model.handleFinalizeInput}
                    maxLength="255"
                    error={model.RecipientCompany.showError}
                    helperText={model.RecipientCompany.helperText}
                    required
                />
            </FieldContainer>
            <FieldContainer>
                <TextInput
                    id="RecipientAddress"
                    label="Recipient Address"
                    value={model.RecipientAddress.value}
                    onChange={model.handleUserInput}
                    onBlur={model.handleFinalizeInput}
                    maxLength="255"
                    error={model.RecipientAddress.showError}
                    helperText={model.RecipientAddress.helperText}
                    required
                />
            </FieldContainer>
            <FieldContainer>
                <TextInput
                    id="CityStateZip"
                    label="Recipient City, State, & Zip"
                    value={model.CityStateZip.value}
                    onChange={model.handleUserInput}
                    onBlur={model.handleFinalizeInput}
                    maxLength="255"
                    error={model.CityStateZip.showError}
                    helperText={model.CityStateZip.helperText}
                    required
                />
            </FieldContainer>
            <FieldContainer>
                <TextInput
                    id="YourEmail"
                    label="Your Email"
                    value={model.YourEmail.value}
                    onChange={model.handleUserInput}
                    onBlur={model.handleFinalizeInput}
                    maxLength="255"
                    error={model.YourEmail.showError}
                    helperText={model.YourEmail.helperText}
                    required
                />
            </FieldContainer>
            <FieldContainer>
                <TextInput
                    id="SubjectOfEmail"
                    label="Email Subject"
                    value={model.SubjectOfEmail.value}
                    onChange={model.handleUserInput}
                    onBlur={model.handleFinalizeInput}
                    maxLength="500"
                    error={model.SubjectOfEmail.showError}
                    helperText={model.SubjectOfEmail.helperText}
                    required
                />
            </FieldContainer>
        </>
    );
};

const schema = new Schema();
schema.bindProperty('ClaimExaminer', [Required, MaxLength(50)])
    .bindProperty('ClaimExaminerTitle', [Required, MaxLength(50)])
    .bindProperty('RecipientName', [Required, MaxLength(150)])
    .bindProperty('RecipientCompany', [Required, MaxLength(200)])
    .bindProperty('RecipientAddress', [Required, MaxLength(250)])
    .bindProperty('CityStateZip', [Required, MaxLength(255)])
    .bindProperty('InsuredName', [Required])
    .bindProperty('DateOfLoss', [Required], { beforeSet: IsoDate })
    .bindProperty('PolicyNumber', [Required, MaxLength(50)])
    .bindProperty('Claimant', [Required, MaxLength(250)])
    .bindProperty('ClaimNumber', [Required, MaxLength(20)])
    .bindProperty('Company', [Required, MaxLength(250)])
    .bindProperty('CompanyInitials', [Required, MaxLength(255)])
    .bindProperty('DateReceived', [Required], { beforeSet: IsoDate })
    .bindProperty('CoveragePositionOrOfferedSettlement', [Required])
    .bindProperty('FinalDisposition', [Required])
    .bindProperty('UnitManager', [Required])
    .bindProperty('UnitManagerAddress', [Required])
    .bindProperty('UnitManagerCityStateZip', [Required])
    .bindProperty('UnitManagerPhone', [Required, Phone])
    .bindProperty('UnitManagerEmail', [Required, Email])
    .bindProperty('SubjectOfEmail', [Required])
    .bindProperty('ClaimExecutiveSignature', [Required])
    .bindProperty('CompanyPhoneNumber', [Required, Phone])
    .bindProperty('YourEmail', [Required, Email])
    .bindProperty('AdminCode', [Required])
    .bindProperty('TodaysDate', [], {}, (new G2Date(new Date()).format(DATE_FORMATS.ISO_DATE_ONLY)));

export const NJInternalAppealsDispositionTLGForm = asForm(NJInternalAppealsDispositionTLG, schema);

/**
 * 
 * @param {any} existingVal
 * @param {import('../../../../../../../../../../Core/State/slices/claim/types.d').ClaimMaster} claim
 * @param {any} email
 */
export const getNJInternalAppealsDispositionTLGData = (existingVal, dataContext) => {

    const { claim, email } = dataContext;
    const plc = getRealPolicy(claim, dataContext.assocPolicies);
    const e = safeObj(claim.examiner);

    const defaults = {
        ClaimExaminer: `${e.firstName || ''} ${e.lastName || ''}`,
        ClaimExaminerTitle: '',
        RecipientName: '',
        RecipientCompany: '',
        RecipientAddress: '',
        CityStateZip: '',
        InsuredName: plc.insuredName,
        PolicyNumber: plc.policyID,
        Claimant: '',
        DateOfLoss: (claim.dOL || ''),
        ClaimNumber: claim.claimID,
        Company: '',
        CompanyInitials: '',
        DateReceived: claim.dateReceived,
        CoveragePositionOrOfferedSettlement: '',
        FinalDisposition: '',
        UnitManager: '',
        UnitManagerAddress: '',
        UnitManagerCityStateZip: '',
        UnitManagerPhone: '',
        UnitManagerEmail: '',
        SubjectOfEmail: safeStr(safeObj(email).subject),
        ClaimExecutiveSignature: '',
        CompanyPhoneNumber: '',
        YourEmail: safeStr(safeObj(email).from),
        AdminCode: '',
    };

    return {
        ...defaults,
        ...(existingVal || {}),
        TodaysDate: (new G2Date(Date.now())).format(DATE_FORMATS.ISO_DATE_ONLY),
    };
}