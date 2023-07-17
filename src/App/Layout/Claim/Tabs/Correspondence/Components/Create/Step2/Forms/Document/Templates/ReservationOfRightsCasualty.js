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
    Phone,
    MaxLength,
    EmailList,
    Currency
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
import { FormatMoneyString } from '../../../../../../../../../../Core/Providers/FormProvider/actions/CommonActions';

/**
 * @typedef {object} DocumentFormProps
 * @property {import('../../../../../../../../../../Core/Providers/FormProvider/model/Model').Model} model the bound model
 */

/**
 * The DocumentForm component
 * @param {DocumentFormProps} props component props
 * @type {import('react').Component<DocumentFormProps>}
 */
const CasualtyReservationOfRights = ({ model }) => {

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
                model.handleUserInput(makeEvent('CaliforniaClaim', processTemplateString(caTT.text, textDependencies)));
            }
        }
        else {
            model.handleUserInput(makeEvent('CaliforniaClaim', ''));
        }

        if (TEMPLATE_TEXT.hasOwnProperty(`PROR_STATE_${textDependencies.location}`)) {
            const ssTT = templateTexts.find(tt => tt.templateTextID === TEMPLATE_TEXT[`PROR_STATE_${textDependencies.location}`]);
            if (ensureNonNullObject(ssTT)) {
                model.handleUserInput(makeEvent('StateSpecificLanguage', processTemplateString(ssTT, textDependencies)));
            }
        }
        else {
            console.log('Did not find template text for state:', textDependencies.location)
            model.handleUserInput(makeEvent('StateSpecificLanguage', ''));
        }

        model.handleFinalizeInput(evt);
    }

    const [excessLanguageFlag, setExcessLanguageFlag] = React.useState(false);

    const excessLanguageFlagChanged = (evt) => {
        const { value } = evt.target;
        const el = (value === true ? 'The prayer for damages is in excess of the policy limit.  If you have other insurance coverage that may be applicable to this matter, you may wish to place those carriers on notice.  If you are uninsured for any portion of your excess exposure you may wish to retain independent counsel, at your own expense, to represent you in this matter.  Please be advised that under no circumstances will General Star pay in excess of the policy limit.' : '');
        model.handleFinalizeInput(makeEvent('ExcessLanguage', el));
        setExcessLanguageFlag(value === true);
    }

    const [inTheAggregateFlag, setInTheAggregateFlag] = React.useState(false);

    const inTheAggregateFlagChanged = (evt) => {
        const { value } = evt.target;
        const al = (value === true ? 'and in the aggregate' : '');
        model.handleFinalizeInput(makeEvent('AndInTheAggregate', al));
        setInTheAggregateFlag(value === true);
    }

    const [subsequentCallFlag, setSubsequentCallFlag] = React.useState(false);

    const subsequentCallFlagChanged = (evt) => {
        const { value } = evt.target;
        const lang = (value === true ? '' : '');
        model.handleFinalizeInput(makeEvent('AndOurSubsequentTelephoneConversation', lang));
        setSubsequentCallFlag(value === true);
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
                <DatePicker
                    id="RetroactiveDate"
                    name="RetroactiveDate"
                    label="Retroactive Date"
                    fullWidth={true}
                    value={model.RetroactiveDate.value}
                    onChange={model.handleUserInput}
                    onBlur={model.handleFinalizeInput}
                    variant="outlined"
                    disableFuture={true}
                    error={model.RetroactiveDate.showError}
                    helperText={model.RetroactiveDate.helperText}
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
                    id="ExaminerName"
                    label="Examiner Name"
                    value={model.ExaminerName.value}
                    onChange={model.handleUserInput}
                    onBlur={model.handleFinalizeInput}
                    maxLength="255"
                    error={model.ExaminerName.showError}
                    helperText={model.ExaminerName.helperText}
                    required
                />
            </FieldContainer>
            <FieldContainer>
                <TextInput
                    id="ExaminerPhoneNumber"
                    label="Examiner Phone"
                    value={model.ExaminerPhoneNumber.value}
                    onChange={model.handleUserInput}
                    onBlur={model.handleFinalizeInput}
                    maxLength="20"
                    error={model.ExaminerPhoneNumber.showError}
                    helperText={model.ExaminerPhoneNumber.helperText}
                    required
                />
            </FieldContainer>
            <FieldContainer>
                <TextInput
                    id="CCAddress"
                    label="CC Email Addresses"
                    value={model.CCAddress.value}
                    onChange={model.handleUserInput}
                    onBlur={model.handleFinalizeInput}
                    maxLength="500"
                    error={model.CCAddress.showError}
                    helperText={model.CCAddress.helperText}
                    
                />
            </FieldContainer>
            <FieldContainer>
                <TextInput
                    id="LineOfBusiness"
                    label="Line Of Business"
                    value={model.LineOfBusiness.value}
                    onChange={model.handleUserInput}
                    onBlur={model.handleFinalizeInput}
                    maxLength="100"
                    error={model.LineOfBusiness.showError}
                    helperText={model.LineOfBusiness.helperText}
                    required
                />
            </FieldContainer>
            <FieldContainer>
                <SelectList
                    id="BasisType"
                    name="BasisType"
                    label="Basis Type"
                    value={model.BasisType.value}
                    onChange={model.handleFinalizeInput}
                    variant="outlined"
                    allowempty={false}
                    fullWidth={true}
                    error={model.BasisType.showError}
                    helperText={model.BasisType.error}
                    required
                >
                    <MenuItem value="Claims made">Claims made</MenuItem>
                    <MenuItem value="Occurrence">Occurrence</MenuItem>
                </SelectList>
            </FieldContainer>
            <FieldContainer>
                <SelectList
                    id="DamagesOnlyAndClaimExpenses"
                    name="DamagesOnlyAndClaimExpenses"
                    label="Damages Only Or With Claim Expenses"
                    value={model.DamagesOnlyAndClaimExpenses.value}
                    onChange={model.handleFinalizeInput}
                    variant="outlined"
                    allowempty={false}
                    fullWidth={true}
                    error={model.DamagesOnlyAndClaimExpenses.showError}
                    helperText={model.DamagesOnlyAndClaimExpenses.error}
                    required
                >
                    <MenuItem value="Damages only">Damages only</MenuItem>
                    <MenuItem value="Damanges and Claim Expenses">Damanges and Claim Expenses</MenuItem>
                </SelectList>
            </FieldContainer>
            <FieldContainer>
                <SelectList
                    id="AreOrAreNot"
                    name="AreOrAreNot"
                    label="Are Or Are Not"
                    value={model.AreOrAreNot.value}
                    onChange={model.handleFinalizeInput}
                    variant="outlined"
                    allowempty={false}
                    fullWidth={true}
                    error={model.AreOrAreNot.showError}
                    helperText={model.AreOrAreNot.error}
                    required
                >
                    <MenuItem value="are">Are</MenuItem>
                    <MenuItem value="are not">Are Not</MenuItem>
                </SelectList>
            </FieldContainer>
            <FieldContainer>
                <SelectList
                    id="ComplaintDemandLetterNoticeOfClaim"
                    name="ComplaintDemandLetterNoticeOfClaim"
                    label="Complaint/Demand Letter/Notice of Claim"
                    value={model.ComplaintDemandLetterNoticeOfClaim.value}
                    onChange={model.handleFinalizeInput}
                    variant="outlined"
                    allowempty={false}
                    fullWidth={true}
                    error={model.ComplaintDemandLetterNoticeOfClaim.showError}
                    helperText={model.ComplaintDemandLetterNoticeOfClaim.error}
                    required
                >
                    <MenuItem value="complain">Complaint</MenuItem>
                    <MenuItem value="demand letter">Demand Letter</MenuItem>
                    <MenuItem value="notice of claim">Notice of Claim</MenuItem>
                </SelectList>
            </FieldContainer>
            <FieldContainer>
                <SelectList
                    id="SubsequentCallFlag"
                    name="SubsequentCallFlag"
                    label="Include Subsequent Conversation Language"
                    value={subsequentCallFlag}
                    onChange={subsequentCallFlagChanged}
                    variant="outlined"
                    allowempty={false}
                    fullWidth={true}
                    error={model.AndOurSubsequentTelephoneConversation.showError}
                    helperText={model.AndOurSubsequentTelephoneConversation.error}
                    
                >
                    <MenuItem value={false}>No</MenuItem>
                    <MenuItem value={true}>Yes</MenuItem>
                </SelectList>
            </FieldContainer>
            <FieldContainer>
                <TextInput
                    id="Case"
                    label="Case"
                    value={model.Case.value}
                    onChange={model.handleUserInput}
                    onBlur={model.handleFinalizeInput}
                    maxLength="100"
                    error={model.Case.showError}
                    helperText={model.Case.helperText}
                    required
                />
            </FieldContainer>
            <FieldContainer>
                <TextInput
                    id="ClaimantName"
                    label="Claimant Name"
                    value={model.ClaimantName.value}
                    onChange={model.handleUserInput}
                    onBlur={model.handleFinalizeInput}
                    maxLength="50"
                    error={model.ClaimantName.showError}
                    helperText={model.ClaimantName.helperText}
                    required
                />
            </FieldContainer>
            <FieldContainer>
                <TextInput
                    id="PlaintiffClaimant"
                    label="Plaintiff Claimant"
                    value={model.PlaintiffClaimant.value}
                    onChange={model.handleUserInput}
                    onBlur={model.handleFinalizeInput}
                    maxLength="50"
                    error={model.PlaintiffClaimant.showError}
                    helperText={model.PlaintiffClaimant.helperText}
                    required
                />
            </FieldContainer>
            <FieldContainer>
                <SelectList
                    id="Company"
                    name="Company"
                    label="Company"
                    value={model.Company.value}
                    onChange={model.handleFinalizeInput}
                    variant="outlined"
                    allowempty={false}
                    fullWidth={true}
                    error={model.Company.showError}
                    helperText={model.Company.error}
                    required
                >
                    <MenuItem value="General Star Indemnity Company">General Star Indemnity Company</MenuItem>
                    <MenuItem value="General Star National Insurance Company">General Star National Insurance Company</MenuItem>
                </SelectList>
            </FieldContainer>
            <FieldContainer>
                <TextInput
                    id="PerClaimLimit"
                    label="Per Claim Limit"
                    value={model.PerClaimLimit.value}
                    onChange={model.handleUserInput}
                    onBlur={model.handleFinalizeInput}
                    maxLength="25"
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
                    maxLength="25"
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
                    maxLength="25"
                    error={model.Deductible.showError}
                    helperText={model.Deductible.helperText}
                    required
                />
            </FieldContainer>
            <FieldContainer>
                <SelectList
                    id="AndInTheAggregateFlag"
                    name="AndInTheAggregateFlag"
                    label="Include And In The Aggregate"
                    value={inTheAggregateFlag}
                    onChange={inTheAggregateFlagChanged}
                    variant="outlined"
                    allowempty={false}
                    fullWidth={true}
                    error={model.AndInTheAggregate.showError}
                    helperText={model.AndInTheAggregate.error}
                    required
                >
                    <MenuItem value={false}>No</MenuItem>
                    <MenuItem value={true}>Yes</MenuItem>
                </SelectList>
            </FieldContainer>
            <FieldContainer>
                <SelectList
                    id="NoticeOfPotentialClaimOrComplaint"
                    name="NoticeOfPotentialClaimOrComplaint"
                    label="Notice Of Potential Claim Or Complaint"
                    value={model.NoticeOfPotentialClaimOrComplaint.value}
                    onChange={model.handleFinalizeInput}
                    variant="outlined"
                    allowempty={false}
                    fullWidth={true}
                    error={model.NoticeOfPotentialClaimOrComplaint.showError}
                    helperText={model.NoticeOfPotentialClaimOrComplaint.error}
                    required
                >
                    <MenuItem value="notice of potential claim">notice of potential claim</MenuItem>
                    <MenuItem value="complaint">complaint</MenuItem>
                </SelectList>
            </FieldContainer>
            <FieldContainer>
                <SelectList
                    id="PotentialClaimOrComplaintLawsuitPetition"
                    name="PotentialClaimOrComplaintLawsuitPetition"
                    label="Potential Claim Or Complaint Lawsuit Petition"
                    value={model.PotentialClaimOrComplaintLawsuitPetition.value}
                    onChange={model.handleFinalizeInput}
                    variant="outlined"
                    allowempty={false}
                    fullWidth={true}
                    error={model.PotentialClaimOrComplaintLawsuitPetition.showError}
                    helperText={model.PotentialClaimOrComplaintLawsuitPetition.error}
                    required
                >
                    <MenuItem value="Potential Claim">Potential Claim</MenuItem>
                    <MenuItem value="Complaint/Lawsuit/Petition">Complaint/Lawsuit/Petition</MenuItem>
                </SelectList>
            </FieldContainer>
            <FieldContainer>
                <TextInput
                    id="Attorney"
                    label="Attorney"
                    value={model.Attorney.value}
                    onChange={model.handleUserInput}
                    onBlur={model.handleFinalizeInput}
                    maxLength="100"
                    error={model.Attorney.showError}
                    helperText={model.Attorney.helperText}
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
                    id="CaliforniaClaim"
                    label="California Claim Wording"
                    value={model.CaliforniaClaim.value}
                    onChange={model.handleUserInput}
                    onBlur={model.handleFinalizeInput}
                    maxLength="5000"
                    multiline={true}
                    rows={8}
                    error={model.CaliforniaClaim.showError}
                    helperText={model.CaliforniaClaim.helperText}
                    disabled={model.LossLocation.value !== 'CA'}
                />
            </FieldContainer>
            <FieldContainer>
                <TextInput
                    id="CoverageSection"
                    label="Coverage Section"
                    value={model.CoverageSection.value}
                    onChange={model.handleUserInput}
                    onBlur={model.handleFinalizeInput}
                    maxLength="5000"
                    multiline={true}
                    rows={8}
                    error={model.CoverageSection.showError}
                    helperText={model.CoverageSection.helperText}
                    required
                />
            </FieldContainer>
            <FieldContainer>
                <TextInput
                    id="ExclusionsSection"
                    label="Exclusions Section"
                    value={model.ExclusionsSection.value}
                    onChange={model.handleUserInput}
                    onBlur={model.handleFinalizeInput}
                    maxLength="5000"
                    multiline={true}
                    rows={8}
                    error={model.ExclusionsSection.showError}
                    helperText={model.ExclusionsSection.helperText}
                    required
                />
            </FieldContainer>
            <FieldContainer>
                <TextInput
                    id="DamagesSection"
                    label="Damages Section"
                    value={model.DamagesSection.value}
                    onChange={model.handleUserInput}
                    onBlur={model.handleFinalizeInput}
                    maxLength="5000"
                    multiline={true}
                    rows={8}
                    error={model.DamagesSection.showError}
                    helperText={model.DamagesSection.helperText}
                    required
                />
            </FieldContainer>
            <FieldContainer>
                <TextInput
                    id="OtherRelevantSections"
                    label="Other Relevant Sections"
                    value={model.OtherRelevantSections.value}
                    onChange={model.handleUserInput}
                    onBlur={model.handleFinalizeInput}
                    maxLength="5000"
                    multiline={true}
                    rows={8}
                    error={model.OtherRelevantSections.showError}
                    helperText={model.OtherRelevantSections.helperText}
                    
                />
            </FieldContainer>
            <FieldContainer>
                <TextInput
                    id="RORManagerDiscussion"
                    label="ROR Manager Discussion"
                    value={model.RORManagerDiscussion.value}
                    onChange={model.handleUserInput}
                    onBlur={model.handleFinalizeInput}
                    maxLength="5000"
                    multiline={true}
                    rows={8}
                    error={model.RORManagerDiscussion.showError}
                    helperText={model.RORManagerDiscussion.helperText}
                    
                />
            </FieldContainer>
            <FieldContainer>
                <TextInput
                    id="ReservationOfRights"
                    label="Reservation of Rights"
                    value={model.ReservationOfRights.value}
                    onChange={model.handleUserInput}
                    onBlur={model.handleFinalizeInput}
                    maxLength="5000"
                    multiline={true}
                    rows={8}
                    error={model.ReservationOfRights.showError}
                    helperText={model.ReservationOfRights.helperText}
                    required
                />
            </FieldContainer>
            <FieldContainer>
                <SelectList
                    id="ExcessLanguageFlag"
                    name="ExcessLanguageFlag"
                    label="Include Excess Language"
                    value={excessLanguageFlag}
                    onChange={excessLanguageFlagChanged}
                    variant="outlined"
                    allowempty={false}
                    fullWidth={true}
                    error={model.ExcessLanguage.showError}
                    helperText={model.ExcessLanguage.error}
                    
                >
                    <MenuItem value={false}>No</MenuItem>
                    <MenuItem value={true}>Yes</MenuItem>
                </SelectList>
            </FieldContainer>
        </>
    );
};

const schema = new Schema();
schema.bindProperty('ExaminerName', [Required, MaxLength(255)]) // *
    .bindProperty('InsuredName', [Required, MaxLength(250)]) // *
    .bindProperty('InsuredAddress', [Required, MaxLength(250)]) // *
    .bindProperty('InsuredCityStateZip', [Required, MaxLength(200)]) // *
    .bindProperty('Case', [Required, MaxLength(100)]) // *
    .bindProperty('ClaimantName', [Required, MaxLength(50)]) // *
    .bindProperty('ClaimNumber', [Required, MaxLength(20)]) // *
    .bindProperty('PolicyNumber', [Required, MaxLength(50)]) // * 
    .bindProperty('MrMrs', [Required]) // *
    .bindProperty('RecipientName', [Required, MaxLength(255)]) // *
    .bindProperty('Company', [Required]) // *
    .bindProperty('DateReceived', [Required], { beforeSet: IsoDate }) // *
    .bindProperty('NoticeOfPotentialClaimOrComplaint', [Required]) // *
    .bindProperty('PlaintiffClaimant', [Required, MaxLength(50)]) // *
    .bindProperty('PotentialClaimOrComplaintLawsuitPetition', [Required]) // *
    .bindProperty('PotentialClaimFacts', [Required]) // *
    .bindProperty('LineOfBusiness', [Required]) // *
    .bindProperty('BasisType', [Required]) // *
    .bindProperty('EffectiveDate', [Required], { beforeSet: IsoDate }) // *
    .bindProperty('ExpirationDate', [Required], { beforeSet: IsoDate }) // *
    .bindProperty('PerClaimLimit', [Required, Currency], { beforeSet: FormatMoneyString }) // *
    .bindProperty('AggregateLimit', [Required, Currency], { beforeSet: FormatMoneyString }) // *
    .bindProperty('Deductible', [Required, Currency], { beforeSet: FormatMoneyString }) // *
    .bindProperty('AndInTheAggregate', []) // *
    .bindProperty('DamagesOnlyAndClaimExpenses', [Required]) // *
    .bindProperty('AreOrAreNot', [Required]) // *
    .bindProperty('RetroactiveDate', [Required], { beforeSet: IsoDate }) // *
    .bindProperty('CoverageSection', [Required]) // *
    .bindProperty('ExclusionsSection', [Required]) // *
    .bindProperty('DamagesSection', [Required]) // *
    .bindProperty('OtherRelevantSections', []) // *
    .bindProperty('ReservationOfRights', [Required]) // *
    .bindProperty('ExcessLanguage', []) // *
    .bindProperty('ComplaintDemandLetterNoticeOfClaim', [Required]) // *
    .bindProperty('AndOurSubsequentTelephoneConversation', []) // *
    .bindProperty('Attorney', [Required]) // *
    .bindProperty('CaliforniaClaim', []) // *
    .bindProperty('RORManagerDiscussion', []) // *
    .bindProperty('StateSpecificLanguage', []) // *
    .bindProperty('ExaminerPhoneNumber', [Required, Phone, MaxLength(20)]) // *
    .bindProperty('CCAddress', [EmailList]) // *
    .bindProperty('LossLocation', []) // *
    .bindProperty('TodaysDate', [], {}, (new G2Date(new Date()).format(DATE_FORMATS.ISO_DATE_ONLY)));

export const CasualtyReservationOfRightsForm = asForm(CasualtyReservationOfRights, schema);

/**
 * 
 * @param {object} existingVal
 * @param {import('../../../../../../../../../../Core/State/slices/claim/types.d').ClaimMaster} claim
 * @param {object} email
 * @param {Array<import('../../../../../../../../../../Core/State/slices/metadata/risk-states/types.d').RiskState>} states
 * @param {Array<import('../../../../../../../../../../Core/State/slices/metadata/template-text/types.d').TemplateText>} texts
 */
export const getCasualtyReservationOfRightsData = (existingVal, dataContext) => {

    const { claim, states, texts, email } = dataContext;
    const e = safeObj(safeObj(claim).examiner);
    const pol = getRealPolicy(claim, dataContext.assocPolicies);

    const defState = safeObj(safeArray(states).find(s => s.riskStateID === parseInt(claim.lossLocation))).stateCode;
    const caText = processTemplateString((defState === 'CA' ? texts.find(t => t.templateTextID === TEMPLATE_TEXT.PROR_CA_SPECIFIC).text : ''), { insured: pol.insuredName });
    const ssTextTemplate = (TEMPLATE_TEXT.hasOwnProperty(`PROR_STATE_${defState}`) ? texts.find(t => t.templateTextID === TEMPLATE_TEXT[`PROR_STATE_${defState}`]).text : '');
    const ssText = processTemplateString(ssTextTemplate, {
        insured: pol.insuredName,
        claimant: pol.insuredName
    });

    const defaults = {
        ExaminerName: `${safeStr(e.firstName)} ${safeStr(e.lastName)}`,
        InsuredName: pol.insuredName,
        InsuredAddress: pol.insuredAddress,
        InsuredCityStateZip: pol.insuredCityStateZip,
        Case: '',
        ClaimantName: '',
        ClaimNumber: claim.claimID,
        PolicyNumber: pol.policyID,
        MrMrs: 'Mr.',
        RecipientName: '',
        Company: '',
        DateReceived: safeStr(claim.dateReceived),
        NoticeOfPotentialClaimOrComplaint: '',
        PlaintiffClaimant: '',
        PotentialClaimOrComplaintLawsuitPetition: '',
        PotentialClaimFacts: '',
        LineOfBusiness: '',
        BasisType: '',
        EffectiveDate: pol.effectiveDate,
        ExpirationDate: pol.expirationDate,
        PerClaimLimit: '',
        AggregateLimit: '',
        Deductible: '',
        AndInTheAggregate: '',
        DamagesOnlyAndClaimExpenses: '',
        AreOrAreNot: '',
        RetroactiveDate: '',
        CoverageSection: '',
        ExclusionsSection: '',
        DamagesSection: '',
        OtherRelevantSections: '',
        ReservationOfRights: '',
        ExcessLanguage: '',
        ComplaintDemandLetterNoticeOfClaim: '',
        AndOurSubsequentTelephoneConversation: '',
        Attorney: '',
        CaliforniaClaim: caText,
        RORManagerDiscussion: '',
        StateSpecificLanguage: ssText,
        ExaminerPhoneNumber: safeStr(e.businessPhone),
        CCAddress: safeStr(safeObj(email).cc),
        LossLocation: safeStr(defState),
    };

    /**
     {
    "LineOfBusiness":"Construction",
	"BasisType":"claims made",
	"DamagesOnlyAndClaimExpenses":"Damages only",
	"AreOrAreNot":"are not",
	"RetroactiveDate":"2000-01-01",
	"CoverageSection":"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
	"ExclusionsSection":"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
	"DamagesSection":"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
	"OtherRelevantSections":"Language about other relevant sections>",
	"ComplaintDemandLetterNoticeOfClaim":"demand letter",
	
    "AndOurSubsequentTelephoneConversation":"",
	"Attorney":"Adams and Associates",
	"RORManagerDiscussion":"",
}
     */

    return {
        ...defaults,
        ...(existingVal || {}),
        TodaysDate: (new G2Date(Date.now())).format(DATE_FORMATS.ISO_DATE_ONLY),
    };
}