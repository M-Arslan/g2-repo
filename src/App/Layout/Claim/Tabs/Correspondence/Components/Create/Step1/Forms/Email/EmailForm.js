import React from 'react';
import { useSelector } from 'react-redux';
import {
    TextInput,
} from '../../../../../../../../../Core/Forms/Common';
import { ArrayDropdown } from '../../../../../../../../../Core/Forms/Common/ArrayDropdown';
import { contactsSelectors } from '../../../../../../../../../Core/State/slices/contact/index';
import { ensureNonEmptyString } from '../../../../../../../../../Core/Utility/rules';
import {
    FieldContainer,
} from '../Common';
import {
    Attachments
} from './Attachments';

/**
 * @typedef {object} EmailFormProps
 * @property {import('../../../../../../../../../Core/Providers/FormProvider/model/Model').Model} model the bound model
 */

/**
 * The EmailFormLayout component
 * @param {EmailFormProps} props component props
 * @type {import('react').Component<EmailFormProps>}
 */
export const EmailForm = ({ model }) => {

    const contacts = useSelector(contactsSelectors.selectData()).filter(c => ensureNonEmptyString(c.emailAddress));

    return (
        <section>
            <FieldContainer>
                <TextInput
                    id="from"
                    label="Email From"
                    value={model.from.value}
                    onChange={model.handleUserInput}
                    onBlur={model.handleFinalizeInput}
                    maxLength="500"
                    error={model.from.showError}
                    helperText={model.from.helperText}
                    required
                    autoComplete="off"
                />
            </FieldContainer>
            <FieldContainer>
                <ArrayDropdown
                    id="to"
                    label="Email To"
                    list={contacts}
                    valueProp="emailAddress"
                    displayProp="emailAddress"
                    value={model.to.value}
                    onChange={model.handleUserInput}
                    onBlur={model.handleFinalizeInput}
                    error={model.to.showError}
                    helperText={model.to.helperText}
                    multiple={true}
                    required
                />
            </FieldContainer>
            <FieldContainer>
                <TextInput
                    id="cc"
                    label="Email CC"
                    value={model.cc.value}
                    onChange={model.handleUserInput}
                    onBlur={model.handleFinalizeInput}
                    maxLength="500"
                    error={model.cc.showError}
                    helperText={model.cc.helperText}  
                />
            </FieldContainer>
            <FieldContainer>
                <TextInput
                    id="bcc"
                    label="Email BCC"
                    value={model.bcc.value}
                    onChange={model.handleUserInput}
                    onBlur={model.handleFinalizeInput}
                    maxLength="500"
                    error={model.bcc.showError}
                    helperText={model.bcc.helperText}
                    autoComplete="off"
                />
            </FieldContainer>
            <FieldContainer>
                <TextInput
                    id="subject"
                    label="Email Subject"
                    value={model.subject.value}
                    onChange={model.handleUserInput}
                    onBlur={model.handleFinalizeInput}
                    maxLength="200"
                    error={model.subject.showError}
                    helperText={model.subject.helperText}
                    required
                    autoComplete="off"
                />
            </FieldContainer>
            <FieldContainer>
                <TextInput
                    id="body"
                    label="Email Body"
                    value={model.body.value}
                    onChange={model.handleUserInput}
                    onBlur={model.handleFinalizeInput}
                    error={model.body.showError}
                    helperText={model.body.helperText}
                    multiline
                    rows={8}
                    required
                    autoComplete="off"
                />
            </FieldContainer>
            <FieldContainer>
                <Attachments
                    id="attachments"
                    value={model.attachments.value}
                    onChange={model.handleUserInput}
                    onBlur={model.handleFinalizeInput}
                    error={model.attachments.showError}
                    helperText={model.attachments.helperText}
                />
            </FieldContainer>
        </section>
    );
};