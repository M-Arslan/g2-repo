import React from 'react';
import styled from 'styled-components';
import {
    Chip
} from '@mui/material';
import {
    FileInput
} from '../../../../../../../../../Core/Forms/Common/FileInput';
import {
    useNotifications
} from '../../../../../../../../../Core/Providers/NotificationProvider/NotificationProvider';
import {
    AppEvent,
    makeEvent
} from '../../../../../../../../../Core/Utility/makeEvent';
import {
    ensureNonEmptyArray,
    ensureNonEmptyString
} from '../../../../../../../../../Core/Utility/rules';

/**
 * @typedef {object} Attachment
 * @property {string} fileName - the name of the attached file
 * @property {string} fileData - the string encoded file contents
 */

const AttachmentRow = styled.div`
    display: flex;
    flex-flow: row wrap;
    align-content: center;
    align-items: center;

    width: 100%;
    margin-top: 1em;

    & > * {
        margin-right: 1em;
    }
`;


export const Attachments = ({ id, onBlur, onChange, value, ...rest }) => {

    const $notifications = useNotifications();

    /** @type {[Array<Attachment>, function(Array<Attachment>):void]} */
    const [attachments, setAttachments] = React.useState((ensureNonEmptyArray(value) ? value : []));

    const allowedFileTypes = [
        '.png',
        '.jpg',
        '.jpeg',
        '.gif',
        '.tiff',
        '.pdf',
        '.doc',
        '.docx',
        '.xls',
        '.xlsx',
        '.txt',
        '.csv',
        '.rtf'
    ];

    /**
     * Builds a usable file attachment instance from user input
     * @param {File} file
     * @returns {Attachment}
     */
    const getAttachmentInfo = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);

            reader.onload = () => {
                const fileData = (ensureNonEmptyString(reader.result) ? reader.result.substring(reader.result.indexOf(',') + 1) : null);
                resolve(fileData);
            };

            reader.onerror = (error) => reject(error);
        });
    }

    /**
     * Handles request to add new attachment
     * @param {AppEvent<string>} evt
     */
    const onAttachmentsAdded = async (evt) => {

        const { value, file } = evt.target;

        if (ensureNonEmptyString(value)) {

            const startIndex = (value.indexOf('\\') >= 0 ? value.lastIndexOf('\\') : value.lastIndexOf('/'));
            const fileName = value.substring(startIndex + 1);

            if (allowedFileTypes.some(ft => fileName.toUpperCase().endsWith(ft.toUpperCase())) !== true) {
                $notifications.notifyError('The file type you have tried to attach is not supported.');
                return;
            }

            const fileData = await getAttachmentInfo(file);
            const att = attachments.concat([{ fileName, fileData }]);
            setAttachments(att);

            const e = makeEvent(id, att);

            if (typeof onChange === 'function') {
                onChange(e);
            }

            if (typeof onBlur === 'function') {
                onBlur(e);
            }
        }
    };

    /**
     * Handles request to remove attachment
     * @param {number} index
     */
    const onAttachmentDeleted = (index) => () => {
        const att = Array.from(attachments);
        att.splice(index, 1);
        setAttachments(att);

        const evt = makeEvent(id, att);

        if (typeof onChange === 'function') {
            onChange(evt);
        }

        if (typeof onBlur === 'function') {
            onBlur(evt);
        }
    };


    return (
        <>
            <FileInput id={id} onFileAdded={onAttachmentsAdded} accept={allowedFileTypes.join(',')} {...rest} />
            <AttachmentRow>
                {
                    attachments.map((data, idx) => <Chip label={data.fileName} onDelete={onAttachmentDeleted(idx)} />)
                }
            </AttachmentRow>
        </>
    );
}