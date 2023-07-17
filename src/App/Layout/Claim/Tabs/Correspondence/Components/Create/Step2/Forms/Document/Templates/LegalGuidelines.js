import React from 'react';
import {
    FieldContainer,
} from '../../Common';
import {
    TextInput,} from '../../../../../../../../../../Core/Forms/Common';
import {
    Required,
    EmailList,
    MaxLength
} from '../../../../../../../../../../Core/Providers/FormProvider/rules/CommonRules';
import {
    asForm,
    Schema
} from '../../../../../../../../../../Core/Providers/FormProvider';
import { DATE_FORMATS, G2Date } from '../../../../../../../../../../Core/Utility/G2Date';
import { safeObj, safeStr } from '../../../../../../../../../../Core/Utility/safeObject';

/**
 * @typedef {object} DocumentFormProps
 * @property {import('../../../../../../../../../../Core/Providers/FormProvider/model/Model').Model} model the bound model
 */

/**
 * The DocumentForm component
 * @param {DocumentFormProps} props component props
 * @type {import('react').Component<DocumentFormProps>}
 */
const LegalGuidelines = ({ model }) => {

    return (
        <>
            <FieldContainer>
                <TextInput
                    id="LegalClaimNumber"
                    label="Claim Number"
                    value={model.LegalClaimNumber.value}
                    onChange={model.handleUserInput}
                    onBlur={model.handleFinalizeInput}
                    maxLength="50"
                    error={model.LegalClaimNumber.showError}
                    helperText={model.LegalClaimNumber.helperText}
                    required
                />
            </FieldContainer>
            <FieldContainer>
                <TextInput
                    id="CounselName"
                    label="Counsel Name"
                    value={model.CounselName.value}
                    onChange={model.handleUserInput}
                    onBlur={model.handleFinalizeInput}
                    maxLength="255"
                    error={model.CounselName.showError}
                    helperText={model.CounselName.helperText}
                    required
                />
            </FieldContainer>
            <FieldContainer>
                <TextInput
                    id="GenStarCounselName"
                    label="GenStar Counsel Name"
                    value={model.GenStarCounselName.value}
                    onChange={model.handleUserInput}
                    onBlur={model.handleFinalizeInput}
                    maxLength="255"
                    error={model.GenStarCounselName.showError}
                    helperText={model.GenStarCounselName.helperText}
                    required
                />
            </FieldContainer>
            <FieldContainer>
                <TextInput
                    id="CounselCC"
                    label="Counsel CC Email"
                    value={model.CounselCC.value}
                    onChange={model.handleUserInput}
                    onBlur={model.handleFinalizeInput}
                    maxLength="250"
                    error={model.CounselCC.showError}
                    helperText={model.CounselCC.helperText}
                />
            </FieldContainer>
            <FieldContainer>
                <TextInput
                    id="FirmName"
                    label="Firm Name"
                    value={model.FirmName.value}
                    onChange={model.handleUserInput}
                    onBlur={model.handleFinalizeInput}
                    maxLength="150"
                    error={model.FirmName.showError}
                    helperText={model.FirmName.helperText}
                />
            </FieldContainer>
            <FieldContainer>
                <TextInput
                    id="Subject"
                    label="Subject"
                    value={model.Subject.value}
                    onChange={model.handleUserInput}
                    onBlur={model.handleFinalizeInput}
                    maxLength="150"
                    error={model.Subject.showError}
                    helperText={model.Subject.helperText}
                />
            </FieldContainer>
        </>
    );
};

const schema = new Schema();
schema.bindProperty('CounselName', [Required, MaxLength(255)])
    .bindProperty('CounselCC', [EmailList, MaxLength(250)])
    .bindProperty('LegalClaimNumber', [Required, MaxLength(20)])
    .bindProperty('GenStarCounselName', [Required, MaxLength(255)])
    .bindProperty('Subject', [Required, MaxLength(150)])
    .bindProperty('FirmName', [Required, MaxLength(150)])
    .bindProperty('TodaysDate', [], {}, (new G2Date(new Date()).format(DATE_FORMATS.ISO_DATE_ONLY)));

export const LegalGuidelinesForm = asForm(LegalGuidelines, schema);

export const getLegalGuidelinesData = (existing, dataContext) => {

    const { claim, email } = dataContext

    const defaults = {
        CounselName: '',
        CounselCC: safeStr(safeObj(email).cc),
        GenStarCounselName: safeStr(claim.legal?.claimCounselName),
        Subject: safeStr(safeObj(email).subject),
        FirmName: '',
        LegalClaimNumber: safeStr(safeObj(claim).claimID)
    };

    return {
        ...defaults,
        ...(existing || {}),
        TodaysDate: (new G2Date(Date.now())).format(DATE_FORMATS.ISO_DATE_ONLY),
    };
}
