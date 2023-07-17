import React from 'react';
import styled from 'styled-components';
import {
    EmailList,
    MaxLength,
    Required,
    asForm,
    Schema
} from '../../../../../../../Core/Providers/FormProvider';
import {
    EmailForm
} from './Forms/Email/EmailForm';


const Container = styled.section`
    display: flex;
    flex-flow: row nowrap;
    
    width: 100%;
    height: 100%;

    overflow: hidden;

    & > section:first-child {
        border-right: solid 1px #dedede;
    }

    & > section {
        height: 100%;
        width: 100%;
        overflow-x: hidden;
        overflow-y: auto;
        padding: 1em;
    }
`;

const CreateFormComponent = ({ id, model }) => {

    return (
        <Container id={id}>
            <EmailForm id="correspondence-email-form" model={model} />
        </Container>
    );
};

const schema = new Schema();

// -- state persistence variables (not visible on form)
schema.bindProperty('correspondenceID')
    .bindProperty('claimMasterID')
    .bindProperty('claimNumber')
    .bindProperty('fileName')
    .bindProperty('documentData')
    .bindProperty('createdDate')
    .bindProperty('createdBy');

// -- form bound properties
schema.bindProperty('to', [Required, EmailList])
    .bindProperty('from', [Required, EmailList])
    .bindProperty('cc', [EmailList])
    .bindProperty('bcc', [EmailList])
    .bindProperty('subject', [Required, MaxLength(200)])
    .bindProperty('body', [Required])
    .bindProperty('attachments', [], {}, [])
    .bindProperty('templateName', [])
    .bindProperty('addToDocumentum', [], {}, true)
    .bindProperty('rawData', []);

export const CreateForm = asForm(CreateFormComponent, schema);
