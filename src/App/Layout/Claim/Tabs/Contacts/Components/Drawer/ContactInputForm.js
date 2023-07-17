import React from 'react';
import {
    TextInput,
    ContentRow,
    ContentCell,
    SelectList
} from '../../../../../../Core/Forms/Common';
import {
    MenuItem
} from '@mui/material';
import {
    asForm,
    Schema,
    Required,
    Pattern
} from '../../../../../../Core/Providers/FormProvider';
import {
    Email,
    MaxLength,
    Phone,
    USZip,
} from '../../../../../../Core/Providers/FormProvider/rules/CommonRules';
//import {
//    useAppHost
//} from '../../../AppHost';
import { useSelector } from 'react-redux';
import { riskStatesSelectors } from '../../../../../../Core/State/slices/metadata/risk-states';
import { zipFormat } from '../../../../../../Core/Utility/common';

/**
 * @typedef {object} InsuredContactFormProps
 * @property {import('../../../../../../Core/Providers/FormProvider').Model} model - the bound model
 */

/**
 * FormComponent 
 * @param {InsuredContactFormProps} props
 * @returns {import('react').Component}
 */
const FormComponent = ({ model }) => {

    const riskStates = useSelector(riskStatesSelectors.selectData());
    return (
        <>
            <ContentRow>
                <ContentCell width="100%">
                    <TextInput
                        label="Name"
                        fullWidth={true}
                        value={model.name.value}
                        id="name"
                        name="name"
                        variant="outlined"
                        error={model.name.showError}
                        helperText={model.name.error}
                        onChange={model.handleUserInput}
                        onBlur={model.handleFinalizeInput}
                        inputProps={{ maxLength: 100 }}
                        required
                    />
                </ContentCell>
            </ContentRow>
            <ContentRow>
                <ContentCell width="100%">
                    <TextInput
                        label="Email Address"
                        fullWidth={true}
                        value={model.emailAddress.value}
                        id="emailAddress"
                        name="emailAddress"
                        variant="outlined"
                        error={model.emailAddress.showError}
                        helperText={model.emailAddress.error}
                        onChange={model.handleUserInput}
                        onBlur={model.handleFinalizeInput}
                    />
                </ContentCell>
            </ContentRow>
            <ContentRow>
                <ContentCell width="100%">
                    <TextInput
                        label="Phone Number"
                        fullWidth={true}
                        value={model.phone.value}
                        id="phone"
                        name="phone"
                        variant="outlined"
                        error={model.phone.showError}
                        helperText={model.phone.error || 'Example: 555-555-5555 x123'}
                        onChange={model.handleUserInput}
                        onBlur={model.handleFinalizeInput}
                    />
                </ContentCell>
            </ContentRow>
            <ContentRow>
                <ContentCell width="100%">
                    <TextInput
                        label="Mailing Address"
                        fullWidth={true}
                        value={model.address1.value}
                        id="address1"
                        name="address1"
                        variant="outlined"
                        error={model.address1.showError}
                        helperText={model.address1.error}
                        onChange={model.handleUserInput}
                        onBlur={model.handleFinalizeInput}
                    />
                </ContentCell>
            </ContentRow>
            <ContentRow>
                <ContentCell width="100%">
                    <TextInput
                        label="Address Line 2"
                        fullWidth={true}
                        value={model.address2.value}
                        id="address2"
                        name="address2"
                        variant="outlined"
                        error={model.address2.showError}
                        helperText={model.address2.error}
                        onChange={model.handleUserInput}
                        onBlur={model.handleFinalizeInput}
                    />
                </ContentCell>
            </ContentRow>
            <ContentRow>
                <ContentCell width="100%">
                    <TextInput
                        label="City"
                        fullWidth={true}
                        value={model.city.value}
                        id="city"
                        name="city"
                        variant="outlined"
                        error={model.city.showError}
                        helperText={model.city.error}
                        onChange={model.handleUserInput}
                        onBlur={model.handleFinalizeInput}
                    />
                </ContentCell>
            </ContentRow>
            <ContentRow>
                <ContentCell width="100%">
                    <SelectList
                        id="state"
                        name="state"
                        label="State"
                        fullWidth={true}
                        variant="outlined"
                        value={model.state.value}
                        error={model.state.showError}
                        helperText={model.state.error}
                        onChange={model.handleUserInput}
                        onBlur={model.handleFinalizeInput}
                    >
                        {
                            Array.isArray(riskStates) ?
                                riskStates.map((item) => <MenuItem value={item.stateCode} key={item.stateCode}>{item.stateName}</MenuItem>)
                                : <MenuItem value={''}></MenuItem>
                        }
                    </SelectList>
                </ContentCell>
            </ContentRow>
            <ContentRow>
                <ContentCell width="100%">
                    <TextInput
                        id="zip"
                        label="Zip"
                        fullWidth={true}
                        value={model.zip.value}
                        name="zip"
                        variant="outlined"
                        error={model.zip.showError}
                        helperText={model.zip.error}
                        onChange={(e) => zipFormat(model.handleUserInput,e)}
                        onBlur={model.handleFinalizeInput}
                        inputProps={{ maxlength: `0` }}

                    />
                </ContentCell>
            </ContentRow>
            <ContentRow>
                <ContentCell width="100%">
                    <TextInput
                        id="comment"
                        label="Comment"
                        fullWidth={true}
                        value={model.comment.value}
                        name="comment"
                        variant="outlined"
                        error={model.comment.showError}
                        helperText={model.comment.error}
                        onChange={model.handleUserInput}
                        onBlur={model.handleFinalizeInput}
                    />
                </ContentCell>
            </ContentRow>
        </>
    );
};


const schema = new Schema();
schema.bindProperty('claimContactID')
    .bindProperty('claimMasterID')
    .bindProperty('contactType')
    .bindProperty('resourceID')
    .bindProperty('createdBy')
    .bindProperty('createdDate')
    .bindProperty('name', [Required, Pattern(/^[A-Za-z-'` ]+$/i, 'Must be alphanumeric characters')])
    .bindProperty('emailAddress', [Email, MaxLength(325)])
    .bindProperty('phone', [Phone])
    .bindProperty('address1', [MaxLength(250)], { allowInvalidValues: false })
    .bindProperty('address2', [MaxLength(250)], { allowInvalidValues: false })
    .bindProperty('city', [MaxLength(250)], { allowInvalidValues: false })
    .bindProperty('state', [MaxLength(2)], { allowInvalidValues: false })
    .bindProperty('zip', [USZip])
    .bindProperty('comment', [MaxLength(500)], { allowInvalidValues: false });

/**
 * InsuredContactForm is the exported component as an HOC wrapped with asForm.
 * @type {import('react').Component<import('../../../../../../Core/Providers/FormProvider/useAsForm').FormProps>}
 */
export const ContactInputForm = asForm(FormComponent, schema);
