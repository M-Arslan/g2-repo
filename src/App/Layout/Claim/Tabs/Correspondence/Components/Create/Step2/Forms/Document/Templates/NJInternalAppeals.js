import React from 'react';
import {
    FieldContainer,
} from '../../Common';
import {
    SelectList,
} from '../../../../../../../../../../Core/Forms/Common';
import {
    Required,
    MaxLength,
} from '../../../../../../../../../../Core/Providers/FormProvider/rules/CommonRules';
import {
    asForm,
    Schema
} from '../../../../../../../../../../Core/Providers/FormProvider';
import {
    DATE_FORMATS,
    G2Date
} from '../../../../../../../../../../Core/Utility/G2Date';
import {
    MenuItem
} from '@mui/material';
import { ensureNonEmptyString } from '../../../../../../../../../../Core/Utility/rules';
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
const NJInternalAppealsGSNICGIC = ({ model }) => {

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
        </>
    );
};

const schema = new Schema();
schema.bindProperty('CompanyInitials', [Required, MaxLength(255)])
    .bindProperty('Company', [Required, MaxLength(255)])
    .bindProperty('TodaysDate', [], {}, (new G2Date(new Date()).format(DATE_FORMATS.ISO_DATE_ONLY)));

export const NJInternalAppealsGSNICGICForm = asForm(NJInternalAppealsGSNICGIC, schema);

/**
 * 
 * @param {any} existingVal
 * @param {import('../../../../../../../../../../Core/State/slices/claim/types.d').ClaimMaster} claim
 * @param {any} email
 */
export const getNJInternalAppealsGSNICGICData = (existingVal) => {

    const defaults = {
        Company: '',
        CompanyInitials: '',
    };

    return {
        ...defaults,
        ...(existingVal || {}),
        TodaysDate: (new G2Date(Date.now())).format(DATE_FORMATS.ISO_DATE_ONLY),
    };
}