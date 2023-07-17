import React from 'react';
import {
    FieldContainer,
} from '../../Common';
import {
    DatePicker,
    TextInput,} from '../../../../../../../../../../Core/Forms/Common';
import {
    Required,
    MaxLength,
} from '../../../../../../../../../../Core/Providers/FormProvider/rules/CommonRules';
import {
    asForm,
    IsoDate,
    Schema
} from '../../../../../../../../../../Core/Providers/FormProvider';
import { DATE_FORMATS, G2Date } from '../../../../../../../../../../Core/Utility/G2Date';
import { useSelector } from 'react-redux';
import { riskStatesSelectors } from '../../../../../../../../../../Core/State/slices/metadata/risk-states';
import { ArrayDropdown } from '../../../../../../../../../../Core/Forms/Common/ArrayDropdown';
import { safeArray, safeObj, safeStr } from '../../../../../../../../../../Core/Utility/safeObject';
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
const DenialOfCoverage = ({ model }) => {

    const riskStates = useSelector(riskStatesSelectors.selectData());

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
                    id="ReportedCause"
                    label="Reported Cause"
                    value={model.ReportedCause.value}
                    onChange={model.handleUserInput}
                    onBlur={model.handleFinalizeInput}
                    maxLength="500"
                    error={model.ReportedCause.showError}
                    helperText={model.ReportedCause.helperText}
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
                    maxLength="50"
                    error={model.ClaimExaminerTitle.showError}
                    helperText={model.ClaimExaminerTitle.helperText}
                    required
                />
            </FieldContainer>
            <FieldContainer>
                <TextInput
                    id="RespectiveUWDepartment"
                    label="UW Department"
                    value={model.RespectiveUWDepartment.value}
                    onChange={model.handleUserInput}
                    onBlur={model.handleFinalizeInput}
                    maxLength="55"
                    error={model.RespectiveUWDepartment.showError}
                    helperText={model.RespectiveUWDepartment.helperText}
                    required
                />
            </FieldContainer>
            <FieldContainer>
                <TextInput
                    id="AgentName"
                    label="Agent Name"
                    value={model.AgentName.value}
                    onChange={model.handleUserInput}
                    onBlur={model.handleFinalizeInput}
                    maxLength="255"
                    error={model.AgentName.showError}
                    helperText={model.AgentName.helperText}
                    required
                />
            </FieldContainer>
            <FieldContainer>
                <TextInput
                    id="AgentAddress"
                    label="AgentAddress"
                    value={model.AgentAddress.value}
                    onChange={model.handleUserInput}
                    onBlur={model.handleFinalizeInput}
                    maxLength="250"
                    error={model.AgentAddress.showError}
                    helperText={model.AgentAddress.helperText}
                    required
                />
            </FieldContainer>
            <FieldContainer>
                <TextInput
                    id="AgentCityStateZip"
                    label="Agent City, State & Zip"
                    value={model.AgentCityStateZip.value}
                    onChange={model.handleUserInput}
                    onBlur={model.handleFinalizeInput}
                    maxLength="250"
                    error={model.AgentCityStateZip.showError}
                    helperText={model.AgentCityStateZip.helperText}
                    required
                />
            </FieldContainer>
            <FieldContainer>
                <TextInput
                    id="BrokerName"
                    label="Broker Name"
                    value={model.BrokerName.value}
                    onChange={model.handleUserInput}
                    onBlur={model.handleFinalizeInput}
                    maxLength="255"
                    error={model.BrokerName.showError}
                    helperText={model.BrokerName.helperText}
                    required
                />
            </FieldContainer>
            <FieldContainer>
                <TextInput
                    id="BrokerAddress"
                    label="Broker Address"
                    value={model.BrokerAddress.value}
                    onChange={model.handleUserInput}
                    onBlur={model.handleFinalizeInput}
                    maxLength="250"
                    error={model.BrokerAddress.showError}
                    helperText={model.BrokerAddress.helperText}
                    required
                />
            </FieldContainer>
            <FieldContainer>
                <TextInput
                    id="BrokerCityStateZip"
                    label="Broker City, State & Zip"
                    value={model.BrokerCityStateZip.value}
                    onChange={model.handleUserInput}
                    onBlur={model.handleFinalizeInput}
                    maxLength="250"
                    error={model.BrokerCityStateZip.showError}
                    helperText={model.BrokerCityStateZip.helperText}
                    required
                />
            </FieldContainer>
            <FieldContainer>
                <TextInput
                    id="AdjusterAdjustmentFirm"
                    label="Adjuster"
                    value={model.AdjusterAdjustmentFirm.value}
                    onChange={model.handleUserInput}
                    onBlur={model.handleFinalizeInput}
                    maxLength="500"
                    error={model.AdjusterAdjustmentFirm.showError}
                    helperText={model.AdjusterAdjustmentFirm.helperText}
                    required
                />
            </FieldContainer>
            <FieldContainer>
                <TextInput
                    id="AdjustersNotes"
                    label="Adjuster Notes"
                    value={model.AdjustersNotes.value}
                    onChange={model.handleUserInput}
                    onBlur={model.handleFinalizeInput}
                    maxLength="5000"
                    multiline={true}
                    rows={4}
                    error={model.AdjustersNotes.showError}
                    helperText={model.AdjustersNotes.helperText}
                    required
                />
            </FieldContainer>
            <FieldContainer>
                <TextInput
                    id="EmailName"
                    label="Email Name"
                    value={model.EmailName.value}
                    onChange={model.handleUserInput}
                    onBlur={model.handleFinalizeInput}
                    maxLength="50"
                    error={model.EmailName.showError}
                    helperText={model.EmailName.helperText}
                    required
                />
            </FieldContainer>
            <FieldContainer>
                <TextInput
                    id="PhoneExtension"
                    label="Phone Extension"
                    value={model.PhoneExtension.value}
                    onChange={model.handleUserInput}
                    onBlur={model.handleFinalizeInput}
                    maxLength="20"
                    error={model.PhoneExtension.showError}
                    helperText={model.PhoneExtension.helperText}
                    required
                />
            </FieldContainer>
            <FieldContainer>
                <TextInput
                    id="MGABrokerAgentFaxEmail"
                    label="MGA, Broker, or Agent Fax/Email"
                    value={model.MGABrokerAgentFaxEmail.value}
                    onChange={model.handleUserInput}
                    onBlur={model.handleFinalizeInput}
                    maxLength="100"
                    error={model.MGABrokerAgentFaxEmail.showError}
                    helperText={model.MGABrokerAgentFaxEmail.helperText}
                    required
                />
            </FieldContainer>
        </>
    );
};

const schema = new Schema();
schema.bindProperty('ClaimNumber', [Required, MaxLength(20)])
    .bindProperty('ClaimExaminer', [Required, MaxLength(255)])
    .bindProperty('ClaimExaminerTitle', [MaxLength(255)])
    .bindProperty('PolicyNumber', [Required, MaxLength(50)])
    .bindProperty('InsuredName', [Required, MaxLength(255)])
    .bindProperty('DateOfLoss', [Required], { beforeSet: IsoDate })
    .bindProperty('LossLocation', [Required])
    .bindProperty('DateReceived', [Required], { beforeSet: IsoDate })
    .bindProperty('ReportedCause', [Required, MaxLength(500)])
    .bindProperty('AdjusterAdjustmentFirm', [Required, MaxLength(500)])
    .bindProperty('AdjustersNotes', [MaxLength(5000)])
    .bindProperty('BrokerName', [Required, MaxLength(255)])
    .bindProperty('BrokerAddress', [Required, MaxLength(255)])
    .bindProperty('BrokerCityStateZip', [Required, MaxLength(255)])
    .bindProperty('AgentName', [Required, MaxLength(255)])
    .bindProperty('AgentAddress', [Required, MaxLength(255)])
    .bindProperty('AgentCityStateZip', [Required, MaxLength(255)])
    .bindProperty('MGABrokerAgentFaxEmail', [Required, MaxLength(100)])
    .bindProperty('RespectiveUWDepartment', [Required, MaxLength(50)])
    .bindProperty('StateSpecificLanguage', [])
    .bindProperty('EmailName', [Required, MaxLength(100)])
    .bindProperty('PhoneExtension', [Required, MaxLength(20)])
    .bindProperty('FaxExtension', [MaxLength(20)])
    .bindProperty('TodaysDate', [], {}, (new G2Date(new Date()).format(DATE_FORMATS.ISO_DATE_ONLY)));

export const DenialOfCoverageForm = asForm(DenialOfCoverage, schema);

/**
 * 
 * @param {any} existingVal
 * @param {import('../../../../../../../../../../Core/State/slices/claim/types.d').ClaimMaster} claim
 * @param {any} email
 */
export const getDenialData = (existingVal, dataContext) => {

    const { claim, states } = dataContext;
    const plc = getRealPolicy(claim, dataContext.assocPolicies);
    const e = safeObj(claim.examiner);

    const defState = safeObj(safeArray(states).find(s => s.riskStateID === parseInt(claim.lossLocation))).stateCode;

    const defaults = {
        ClaimNumber: claim.claimID,
        ClaimExaminer: `${e.firstName || ''} ${e.lastName || ''}`,
        ClaimExaminerTitle: '',
        PolicyNumber: plc.policyID,
        InsuredName: plc.insuredName,
        DateOfLoss: (claim.dOL || ''),
        LossLocation: safeStr(defState),
        DateReceived: (claim.dateReceived || ''),
        ReportedCause: (claim.lossDesc || ''),
        AdjusterAdjustmentFirm: '',
        AdjustersNotes: 'The adjuster’s investigation was unable to find any damage to the exterior of the building that may have been caused by a Covered Cause of Loss insured under your Policy.',
        ReferToLetter: 'At this time, please refer to our Reservation of Rights letter, dated February 3, 2010, in which we advised you of the coverage issues that exist, and reserved General Star’s rights to conduct an investigation of the claim.',
        CoverageForm: '',
        CoverageFormStates: '',
        YourPolicyCoverage: '',
        ReasonNoCoverage: '',
        BrokerName: '',
        BrokerAddress: '',
        BrokerCityStateZip: '',
        AgentName: '',
        AgentAddress: '',
        AgentCityStateZip: '',
        MGABrokerAgentFaxEmail: '',
        RespectiveUWDepartment: '',
        StateSpecificLanguage: '',
        PhoneExtension: '',
        FaxExtension: '',
        EmailName: '',
    };

    return {
        ...defaults,
        ...(existingVal || {}),
        TodaysDate: (new G2Date(Date.now())).format(DATE_FORMATS.ISO_DATE_ONLY),
    };
}