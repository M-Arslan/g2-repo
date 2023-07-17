import React from 'react';
import {
    useAppHost
} from '../../../AppHost';
import {
    Delete,
    Edit
} from '@mui/icons-material';
import {
    DataGrid,
    ColumnBuilder
} from '../../../../../Common/Components/DataGrid';
import {
    ensureNonNullObject
} from '../../../../../../Core/Utility/rules';
import {
    formatDate
} from '../../../../../../Core/Utility/formatDate';
import { Spinner } from '../../../../../../Core/Forms/Common';

/**
 * @typedef {object} CorrespondenceModel
 * @property {string} correspondenceID
 * @property {string} claimMasterID
 * @property {string} from - whom the email is from
 * @property {string} to - whom the email is to
 * @property {string} cc - list of people CC'd on the email
 * @property {string} bcc - list of people BCC'd on the email
 * @property {string} subject - the email subject line
 * @property {string} body - the email body
 */

/**
 * @typedef {object} CorrespondenceTabProps
 * @property {CorrespondenceModel[]} asyncResult - list of Correspondence to display (injected prop)
 * @property {Function} dispatch - callback to force save operation (injected prop)
 */

/**
 * Correspondence tab is the composer component for the Correspondence app
 * @param {CorrespondenceTabProps} props - Component props
 */
export const CorrespondenceGrid = ({ rowData, onDelete, onEdit }) => {

    const $host = useAppHost();

    /**
     * Delete button click event handler
     * @param {object} row - correspondence object
     */
    const onDeleteClick = (row) => {
        if (typeof onDelete === 'function') {
            onDelete(row.correspondenceID);
        }
    };

    /**
     * Resend button click event handler
     * @param {object} row - data bound to the selected row
     */
    const onResendClick = (row) => {
        if (typeof onEdit === 'function') {
            if (ensureNonNullObject(row)) {
                onEdit(row);
            }
        }
    };

    const builder = (new ColumnBuilder())
        .addColumn('from', 'From')
        .addColumn('to', 'To')
        .addColumn('cc', 'CC')
        .addColumn('bcc', 'BCC')
        .addColumn('subject', 'Subject', 2)
        .addColumn('fileName', 'File')
        .addColumn('createdDate', 'Created', 1, (params) => formatDate(params.data['createdDate']), 'desc')
        //.addColumn('addToDocumentum', 'In CARA?', 1, (params) => (params.data['addToDocumentum'] === true ? 'Yes' : 'No'))
        .addColumn('status', 'Status', 1, (params) => (params.data['status'] === 0 ? 'Draft' : 'Sent'));

    if ($host.appIsReadonly !== true) {
        const buttonIsDisabled = (row) => {
            return (ensureNonNullObject(row) === false || row.status === 1);
        }

        builder.addButtonColumn('edit-correspondence', Edit, onResendClick, buttonIsDisabled);
        builder.addButtonColumn('delete-correspondence', Delete, onDeleteClick, buttonIsDisabled);
    }

    const columnDefs = builder.build();

    return (Array.isArray(rowData) ? <DataGrid key="correspondence-grid" columnDefs={columnDefs} rowData={rowData} pageSize={10} /> : <Spinner />);
};