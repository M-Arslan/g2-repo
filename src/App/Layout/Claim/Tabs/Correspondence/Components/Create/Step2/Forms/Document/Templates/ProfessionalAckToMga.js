import React from 'react';
import {
    FieldContainer,
} from '../../Common';
import {
    DatePicker,
    SelectList,
    Checkbox,
    TextInput,
} from '../../../../../../../../../../Core/Forms/Common';
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
    safeArray,
    safeObj,
    safeStr
} from '../../../../../../../../../../Core/Utility/safeObject';
//import {
//    ensureNonNullObject
//} from '../../../../../../../../../../Core/Utility/rules';
import {
    useSelector
} from 'react-redux';
import {
    riskStatesSelectors
} from '../../../../../../../../../../Core/State/slices/metadata/risk-states';
import {
    MenuItem
} from '@mui/material';
import {
    ArrayDropdown
} from '../../../../../../../../../../Core/Forms/Common/ArrayDropdown';
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
const PALToMga = ({ model }) => {

    const riskStates = useSelector(riskStatesSelectors.selectData());

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
                    id="LossState"
                    label="Loss State"
                    list={riskStates}
                    valueProp="stateCode"
                    displayProp="stateName"
                    value={model.LossState.value}
                    onChange={model.handleUserInput}
                    onBlur={model.handleFinalizeInput}
                    error={model.LossState.showError}
                    helperText={model.LossState.helperText}
                    required
                />
            </FieldContainer>
            <FieldContainer>
                <DatePicker
                    id="DateOfNotice"
                    name="DateOfNotice"
                    label="Claim Reported Date"
                    fullWidth={true}
                    value={model.DateOfNotice.value}
                    onChange={model.handleUserInput}
                    onBlur={model.handleFinalizeInput}
                    variant="outlined"
                    disableFuture={false}
                    error={model.DateOfNotice.showError}
                    helperText={model.DateOfNotice.helperText}
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
                <SelectList
                    id="LineOfBusiness"
                    name="LineOfBusiness"
                    label="Line of Business"
                    value={model.LineOfBusiness.value}
                    onChange={model.handleUserInput}
                    onBlur={model.handleFinalizeInput}
                    variant="outlined"
                    allowempty={false}
                    fullWidth={true}
                    error={model.LineOfBusiness.showError}
                    helperText={model.LineOfBusiness.error}
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
                <Checkbox id="PleaseForward"
                    onChange={model.handleUserInput}
                    onBlur={model.handleFinalizeInput}
                    checkedValue={true}
                    uncheckedValue={false}
                    value={model.PleaseForward.value}
                    label="Please forward the current applicable policy, application, and endorsements"
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
    .bindProperty('DateOfNotice', [Required], { beforeSet: IsoDate })
    .bindProperty('DateOfLoss', [Required], { beforeSet: IsoDate })
    .bindProperty('LineOfBusiness', [Required])
    .bindProperty('LossState', [Required])
    .bindProperty('Claimant', [Required, MaxLength(255)])
    .bindProperty('Recipient', [Required, MaxLength(255)])
    .bindProperty('PleaseForward')
    .bindProperty('TodaysDate', [], {}, (new G2Date(new Date()).format(DATE_FORMATS.ISO_DATE_ONLY)));

export const PALToMgaForm = asForm(PALToMga, schema);

/**
 * 
 * @param {any} existingVal
 * @param {import('../../../../../../../../../../Core/State/slices/claim/types.d').ClaimMaster} claim
 * @param {any} email
 */
export const getPALToMgaData = (existingVal, dataContext) => {

    const { claim, states } = dataContext;
    const plc = getRealPolicy(claim, dataContext.assocPolicies);
    const e = safeObj(claim.examiner);

    const defState = safeObj(safeArray(states).find(s => s.riskStateID === parseInt(claim.lossLocation))).stateCode;

    const defaults = {
        ClaimID: claim.claimID,
        ClaimExaminer: `${e.firstName || ''} ${e.lastName || ''}`,
        ClaimExaminerEmail: safeStr(e.emailAddress),
        ClaimExaminerPhoneNumber: safeStr(e.businessPhone),
        PolicyNumber: plc.policyID,
        InsuredName: plc.insuredName,
        DateOfLoss: (claim.dOL || ''),
        LineOfBusiness: '',
        LossState: safeStr(defState),
        Claimant: '',
        Recipient: '',
        DateOfNotice: '',
        PleaseForward: false,
    };

    return {
        ...defaults,
        ...(existingVal || {}),
        TodaysDate: (new G2Date(Date.now())).format(DATE_FORMATS.ISO_DATE_ONLY),
    };
}