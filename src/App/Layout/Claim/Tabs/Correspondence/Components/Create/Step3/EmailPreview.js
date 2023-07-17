import React from 'react';
import styled from 'styled-components';
import {
    ensureNonEmptyArray,
    ensureNonNullObject
} from '../../../../../../../Core/Utility/rules';
import {
    Chip
} from '@mui/material';

const EmailContainer = styled.article`
    height: 100%;
    width: 70%;
    padding: 1em;
    margin: 0;
    border: 0;
`;

const FieldWrapper = styled.section`
    width: 100%;
    display: flex;
    flex-flow: row nowrap;
    align-items: flex-start;
    align-content: flex-start;
    margin-bottom: 1em;
`;

const Field = styled.section`
    display: flex;
    flex-flow: column nowrap;
    align-content: center;
    align-items: center;
    min-height: 1.75em;
    line-height: 100%;
    width: ${props => props.width || '100%'};

    & > div {
        display: flex;
        flex-flow: row wrap;
        align-content: center;
        align-items: center;
        height: 100%;
        width: 100%;
        white-space: pre;
    }

    & > div:first-child {
        padding-right: .5em;
        font-weight: bold;
        border-bottom: solid 1px #efefef;
        margin-bottom: .5em;
    }
`;

const BodyDisplay = styled.pre`
    font-family: inherit;
    font-size: inherit;
    white-space: pre-line;
    word-wrap: break-word;
    max-width: 100%;
`;

const ChipRows = styled.div`
    display: flex;
    flex-flow: row wrap;
    align-content: center;
    align-items: center;
    width: 100%;
    height: auto;
    padding: .25em;
    margin: 0;

    & > * {
        margin-right: 1em;
    }
`;

export const EmailPreview = ({ email }) => {
    if (ensureNonNullObject(email) !== true) {
        return <div>Email loading....</div>;
    }

    return (
        <EmailContainer>
            <FieldWrapper>
                <Field>
                    <div>From:</div>
                    <div>{email.from}</div>
                </Field>
            </FieldWrapper>
            <FieldWrapper>
                <Field>
                    <div>To:</div>
                    <div>{email.to}</div>
                </Field>
            </FieldWrapper>
            <FieldWrapper>
                <Field>
                    <div>CC:</div>
                    <div>{email.cc}</div>
                </Field>
            </FieldWrapper>
            <FieldWrapper>
                <Field>
                    <div>BCC:</div>
                    <div>{email.bcc}</div>
                </Field>
            </FieldWrapper>
            <FieldWrapper>
                <Field>
                    <div>Subject:</div>
                    <div>{email.subject}</div>
                </Field>
            </FieldWrapper>
            <FieldWrapper>
                <Field>
                    <div>Body:</div>
                    <div><BodyDisplay>{email.body}</BodyDisplay></div>
                </Field>
            </FieldWrapper>
            <FieldWrapper>
                <Field>
                    <div>Attachments:</div>
                    <ChipRows>
                        {
                            ensureNonEmptyArray(email.attachments) ?
                                email.attachments.map((att, idx) => <Chip key={`attachment-${idx}`} label={att.fileName} />) :
                                <span>No Attachments</span>
                        }
                    </ChipRows>
                </Field>
            </FieldWrapper>
        </EmailContainer>
    );
};