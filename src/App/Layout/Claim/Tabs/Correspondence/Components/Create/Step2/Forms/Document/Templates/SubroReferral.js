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
    Email,
    MaxLength,
    EmailList,
    Currency,
    Phone,
    NonEmptyArray
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
    ensureNonEmptyArray,
    ensureNonEmptyString,
    ensureNonNullObject
} from '../../../../../../../../../../Core/Utility/rules';
import { useSelector } from 'react-redux';
import { contactsSelectors } from '../../../../../../../../../../Core/State/slices/contact';
import { makeEvent } from '../../../../../../../../../../Core/Utility/makeEvent';
import styled from 'styled-components';
import { IconButton, MenuItem } from '@mui/material';
import { AddBox, Delete } from '@mui/icons-material';
import { ArrayDropdown } from '../../../../../../../../../../Core/Forms/Common/ArrayDropdown';
import { riskStatesSelectors } from '../../../../../../../../../../Core/State/slices/metadata/risk-states';
import { templateTextSelectors } from '../../../../../../../../../../Core/State/slices/metadata/template-text';
import { TEMPLATE_TEXT } from '../../../../../../../../../../Core/Enumerations/app/correspondence-template-text';
import { getRealPolicy } from '../../../../../../../../../../Core/Utility/getRealPolicy';

const SelectRow = styled.div`
    display: flex;
    flex-flow: row nowrap;
    align-content: center;
    align-items: center;
    width: 100%;
`;

const ContactList = styled.ul`
    width: 100%;
    list-style: none;

    & > li {
        width: 100%;
        height: 1.33em;
        display: flex;
        flex-flow: row nowrap;
        justify-content: space-between;
        align-items: center;
        align-content: center;
        padding: .25em;
    }
`;

/**
 * @typedef {object} DocumentFormProps
 * @property {import('../../../../../../../../../../Core/Providers/FormProvider/model/Model').Model} model the bound model
 */

/**
 * The DocumentForm component
 * @param {DocumentFormProps} props component props
 * @type {import('react').Component<DocumentFormProps>}
 */
const SubroReferral = ({ model }) => {

    const contacts = useSelector(contactsSelectors.selectData());
    const riskStates = useSelector(riskStatesSelectors.selectData());

    const selectExpertContact = (evt) => {
        const { value } = evt.target;
        const ct = contacts.find(c => c.claimContactID === value);
        model.handleFinalizeInput(evt);

        if (ensureNonNullObject(ct)) {
            model.handleFinalizeInput(makeEvent('ExpertName', ct.name));
            model.handleFinalizeInput(makeEvent('ExpertPhoneNumber', ct.phone));
        }
    }

    const selectOutsideAdjusterContact = (evt) => {
        const { value } = evt.target;
        const ct = contacts.find(c => c.claimContactID === value);
        model.handleFinalizeInput(evt);

        if (ensureNonNullObject(ct)) {
            model.handleFinalizeInput(makeEvent('OutsideAdjusterName', ct.name));
            model.handleFinalizeInput(makeEvent('OutsideAdjusterCompanyName', ct.name));
            model.handleFinalizeInput(makeEvent('OutsideAdjusterAddress', `${safeStr(ct.address1)} ${safeStr(ct.address2)}, ${safeStr(ct.city)}, ${safeStr(ct.state)} ${safeStr(ct.zip)}`));
            model.handleFinalizeInput(makeEvent('OutsideAdjusterPhoneNumber', ct.phone));
        }
    }

    const [selectedInsured, setSelectedInsured] = React.useState('');
    const onSelectedInsuredChanged = (evt) => {
        setSelectedInsured(evt.target.value);
    }

    const [selectedAdversary, setSelectedAdversary] = React.useState('');
    const onSelectedAdversaryChanged = (evt) => {
        setSelectedAdversary(evt.target.value);
    }

    const addPartyContact = () => {

        const ct = contacts.find(c => c.claimContactID === selectedInsured);

        if (ensureNonNullObject(ct)) {
            const insured = {
                InsuredName: ct.name,
                InsuredPhoneNumber: ct.phone
            };

            const existing = Array.from(model.ListOfAllParties.value);
            const list = (ensureNonEmptyArray(existing) ? [...existing, insured] : [insured]);
            model.handleFinalizeInput(makeEvent('ListOfAllParties', list));
        }
    }

    const removePartyContact = (idx) => {
        const arr = Array.from(safeArray(model.ListOfAllParties.value));
        if (idx >= 0 && idx < arr.length) {
            arr.splice(idx, 1);
            model.handleFinalizeInput(makeEvent('ListOfAllParties', arr));
        }
    }

    const addAdversaryContact = () => {

        const ct = contacts.find(c => c.claimContactID === selectedAdversary);

        if (ensureNonNullObject(ct)) {
            const adversary = {
                AdversaryName: ct.name,
                AdversaryNumber: ct.phone
            };

            const existing = Array.from(model.ListOfAdverseParties.value);
            const list = (ensureNonEmptyArray(existing) ? [...existing, adversary] : [adversary]);
            model.handleFinalizeInput(makeEvent('ListOfAdverseParties', list));
        }
    }

    const removeAdversaryContact = (idx) => {
        const arr = Array.from(safeArray(model.ListOfAdverseParties.value));
        if (idx >= 0 && idx < arr.length) {
            arr.splice(idx, 1);
            model.handleFinalizeInput(makeEvent('ListOfAdverseParties', arr));
        }
    }

    const cozenText = useSelector(templateTextSelectors.selectByAnyCriteria({ templateTextID: TEMPLATE_TEXT.SUBRO_SELECTION_COZEN }));
    const nationalText = useSelector(templateTextSelectors.selectByAnyCriteria({ templateTextID: TEMPLATE_TEXT.SUBRO_SELECTION_NATIONAL }));
    const [subro, setSubro] = React.useState(model.SubroSelectionShortcut.value);
    const selectSubro = (evt) => {
        const { value } = evt.target;
        setSubro(value);
        const valuesArr = (value === 'National' ? nationalText : (value === 'Cozen' ? cozenText : []));
        const valueText = (ensureNonEmptyArray(valuesArr) ? valuesArr[0].text : '');
        model.handleUserInput(makeEvent('SubroSelectionShortcut', value));
        model.handleFinalizeInput(makeEvent('SubroSelection', valueText));
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
                <TextInput
                    id="AmountOfLoss"
                    label="Amount Of Loss"
                    value={model.AmountOfLoss.value}
                    onChange={model.handleUserInput}
                    onBlur={model.handleFinalizeInput}
                    maxLength="255"
                    error={model.AmountOfLoss.showError}
                    helperText={model.AmountOfLoss.helperText}
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
                    maxLength="255"
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
                    maxLength="1000"
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
                    maxLength="25"
                    error={model.ClaimExaminerPhoneNumber.showError}
                    helperText={model.ClaimExaminerPhoneNumber.helperText}
                    required
                />
            </FieldContainer>
            <FieldContainer>
                <SelectList
                    id="ExpertId"
                    name="ExpertId"
                    label="Expert"
                    value={model.ExpertId.value}
                    onChange={selectExpertContact}
                    variant="outlined"
                    allowempty={false}
                    fullWidth={true}
                    error={model.ExpertId.showError}
                    helperText={model.ExpertId.helperText}
                >
                    {
                        safeArray(contacts).map(c => <MenuItem key={c.claimContactID} value={c.claimContactID}>{c.name}</MenuItem>)
                    }
                </SelectList>
            </FieldContainer>
            <FieldContainer>
                <SelectList
                    id="OutsideAdjusterId"
                    name="OutsideAdjusterId"
                    label="Outside Adjuster"
                    value={model.OutsideAdjusterId.value}
                    onChange={selectOutsideAdjusterContact}
                    variant="outlined"
                    allowempty={false}
                    fullWidth={true}
                    error={model.OutsideAdjusterId.showError}
                    helperText={model.OutsideAdjusterId.helperText}
                >
                    {
                        safeArray(contacts).map(c => <MenuItem key={c.claimContactID} value={c.claimContactID}>{c.name}</MenuItem>)
                    }
                </SelectList>
            </FieldContainer>
            <FieldContainer>
                <SelectRow>
                    <SelectList
                        id="all-parties-list"
                        name="all-parties-list"
                        label="Insured Party"
                        value={selectedInsured}
                        onChange={onSelectedInsuredChanged}
                        variant="outlined"
                        allowempty={false}
                        fullWidth={true}
                        error={model.ListOfAllParties.showError}
                        helperText={model.ListOfAllParties.helperText}
                        required
                    >
                        {
                            safeArray(contacts).map(c => <MenuItem key={c.claimContactID} value={c.claimContactID}>{c.name}</MenuItem>)
                        }
                    </SelectList>
                    <IconButton
                        onClick={addPartyContact}
                        disabled={Array.isArray(contacts) === false || contacts.length < 1 || ensureNonEmptyString(selectedInsured) === false}>
                        <AddBox />
                    </IconButton>
                </SelectRow>
                <ContactList>
                    {
                        model.ListOfAllParties.value.map((party, idx) => (<li key={`party-${idx}`}>
                            <span>{party.InsuredName} ({party.InsuredPhoneNumber})</span>
                            <IconButton onClick={() => removePartyContact(idx)}><Delete /></IconButton>
                        </li>))
                    }
                </ContactList>
            </FieldContainer>
            <FieldContainer>
                <SelectRow>
                    <SelectList
                        id="adversary-parties-list"
                        name="adversary-parties-list"
                        label="Adverse Party"
                        value={selectedAdversary}
                        onChange={onSelectedAdversaryChanged}
                        variant="outlined"
                        allowempty={false}
                        fullWidth={true}
                        error={model.ListOfAdverseParties.showError}
                        helperText={model.ListOfAdverseParties.helperText}
                        required
                    >
                        {
                            safeArray(contacts).map(c => <MenuItem key={c.claimContactID} value={c.claimContactID}>{c.name}</MenuItem>)
                        }
                    </SelectList>
                    <IconButton
                        onClick={addAdversaryContact}
                        disabled={Array.isArray(contacts) === false || contacts.length < 1 || ensureNonEmptyString(selectedAdversary) === false}>
                        <AddBox />
                    </IconButton>
                </SelectRow>
                <ContactList>
                    {
                        model.ListOfAdverseParties.value.map((party, idx) => (<li key={`adv-${idx}`}>
                            <span>{party.AdversaryName} ({party.AdversaryNumber})</span>
                            <IconButton onClick={() => removeAdversaryContact(idx)}><Delete /></IconButton>
                        </li>))
                    }
                </ContactList>
            </FieldContainer>
            <FieldContainer>
                <SelectList
                    id="SubroSelectionShortcut"
                    name="SubroSelectionShortcut"
                    label="Subro Selection"
                    value={subro}
                    onChange={selectSubro}
                    variant="outlined"
                    allowempty={false}
                    fullWidth={true}
                    error={model.SubroSelection.showError}
                    helperText={model.SubroSelection.helperText}
                    required
                >
                    <MenuItem value="National">National</MenuItem>
                    <MenuItem value="Cozen">Cozen</MenuItem>
                </SelectList>
            </FieldContainer>
            <FieldContainer>
                <TextInput
                    id="ToEmailAddress"
                    label="To Email"
                    value={model.ToEmailAddress.value}
                    onChange={model.handleUserInput}
                    onBlur={model.handleFinalizeInput}
                    maxLength="255"
                    error={model.ToEmailAddress.showError}
                    helperText={model.ToEmailAddress.helperText}
                    required
                />
            </FieldContainer>
            <FieldContainer>
                <TextInput
                    id="CCEmailAddress"
                    label="CC Email"
                    value={model.CCEmailAddress.value}
                    onChange={model.handleUserInput}
                    onBlur={model.handleFinalizeInput}
                    maxLength="500"
                    error={model.CCEmailAddress.showError}
                    helperText={model.CCEmailAddress.helperText}
                />
            </FieldContainer>
            <FieldContainer>
                <TextInput
                    id="AdditionalRemarksComments"
                    label="Additional Remarks"
                    value={model.AdditionalRemarksComments.value}
                    onChange={model.handleUserInput}
                    onBlur={model.handleFinalizeInput}
                    maxLength="5000"
                    multiline={true}
                    rows={4}
                    error={model.AdditionalRemarksComments.showError}
                    helperText={model.AdditionalRemarksComments.helperText}
                />
            </FieldContainer>

        </>
    );
};

const schema = new Schema();
schema.bindProperty('ClaimExaminer', [Required, MaxLength(255)])
    .bindProperty('ClaimExaminerPhoneNumber', [Required, Phone])
    .bindProperty('ToEmailAddress', [Required, Email, MaxLength(250)])
    .bindProperty('CCEmailAddress', [EmailList, MaxLength(500)])
    .bindProperty('ClaimNumber', [Required, MaxLength(20)])
    .bindProperty('PolicyNumber', [Required, MaxLength(50)])
    .bindProperty('InsuredName', [Required, MaxLength(255)])
    .bindProperty('DateOfLoss', [Required], { beforeSet: IsoDate })
    .bindProperty('AmountOfLoss', [Required, Currency])
    .bindProperty('LossLocation', [Required])
    .bindProperty('LossDescription', [Required])
    .bindProperty('ExpertId', [Required])
    .bindProperty('ExpertName', [Required])
    .bindProperty('ExpertPhoneNumber', [])
    .bindProperty('OutsideAdjusterId', [Required])
    .bindProperty('OutsideAdjusterName', [Required])
    .bindProperty('OutsideAdjusterCompanyName', [])
    .bindProperty('OutsideAdjusterAddress', [])
    .bindProperty('OutsideAdjusterPhoneNumber', [])
    .bindProperty('AdditionalRemarksComments', [])
    .bindProperty('ListOfAllParties', [NonEmptyArray('Must have at least one party')])
    .bindProperty('ListOfAdverseParties', [NonEmptyArray('Must have at least one adverse party')])
    .bindProperty('SubroSelection', [Required])
    .bindProperty('SubroSelectionShortcut', [])
    .bindProperty('TodaysDate', [], {}, (new G2Date(new Date()).format(DATE_FORMATS.ISO_DATE_ONLY)));

export const SubroReferralForm = asForm(SubroReferral, schema);

/**
 * 
 * @param {any} existingVal
 * @param {import('../../../../../../../../../../Core/State/slices/claim/types.d').ClaimMaster} claim
 * @param {any} email
 */
export const getSubroReferralData = (existingVal, dataContext) => {

    const { claim, email, states } = dataContext;
    const plc = getRealPolicy(claim, dataContext.assocPolicies);
    const e = safeObj(claim.examiner);
    const defState = safeObj(safeArray(states).find(s => s.riskStateID === parseInt(claim.lossLocation))).stateCode;

    const defaults = {
        ToEmailAddress: safeStr(safeObj(email).to),
        CCEmailAddress: safeStr(safeObj(email).cc),
        ClaimExaminer: `${safeStr(e.firstName)} ${safeStr(e.lastName)}`,
        ClaimNumber: claim.claimID,
        InsuredName: plc.insuredName,
        PolicyNumber: plc.policyID,
        DateOfLoss: safeStr(claim.dOL),
        AmountOfLoss: '',
        LossLocation: safeStr(defState),
        ExpertId: '',
        ExpertName: '',
        ExpertPhoneNumber: '',
        LossDescription: safeStr(claim.lossDesc),
        ListOfAllParties: [],
        ListOfAdverseParties: [],
        OutsideAdjusterId: '',
        OutsideAdjusterName: '',
        OutsideAdjusterCompanyName: '',
        OutsideAdjusterAddress: '',
        OutsideAdjusterPhoneNumber: '',
        AdditionalRemarksComments: '',
        ClaimExaminerPhoneNumber: safeStr(e.businessPhone),
        SubroSelection: '',
    };

    return {
        ...defaults,
        ...(existingVal || {}),
        TodaysDate: (new G2Date(Date.now())).format(DATE_FORMATS.ISO_DATE_ONLY),
    };
}