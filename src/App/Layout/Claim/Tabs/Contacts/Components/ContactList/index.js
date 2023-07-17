import React from 'react';
import {
    Delete,
    Edit
} from '@mui/icons-material';
import {
    DataGrid,
    ColumnBuilder,
    DATA_FORMATTERS
} from '../../../../../Common/Components/DataGrid';
import {
    useAppHost
} from '../../../AppHost';
import {
    ensureNonEmptyArray,
    ensureNonEmptyString,
    ensureNonNullObject
} from '../../../../../../Core/Utility/rules';
import {
    CONTACT_TYPE,
    ContactTypeFormatter
} from '../../contact-type';

export const ContactList = ({ rowData, onRequestDelete, onRequestEdit }) => {

    const $host = useAppHost();

    const rows = (ensureNonEmptyArray(rowData) ? rowData : []);

    const deleteContact = (row) => {
        if (ensureNonNullObject(row) && ensureNonEmptyString(row.claimContactID)) {
            if (typeof onRequestDelete === 'function') {
                onRequestDelete(row.claimContactID);
            }
        }
    };

    const editContact = (row) => {
        if (ensureNonNullObject(row)) {
            if (typeof onRequestEdit === 'function') {
                onRequestEdit(row);
            }
        }
    }


    const builder = new ColumnBuilder();
    builder.addColumn('name', 'Name')
        .addColumn('contactType', 'Type', 1, ContactTypeFormatter)
        .addColumn('address1', 'Street', 2, (params) => {
            const { address1 = '', address2 = '' } = params.data;
            return (`${(address1 || '')}${(typeof address2 === 'string' && address2 !== '' ? ` ${address2}` : '')}`);
        })
        .addColumn('city', 'City')
        .addColumn('state', 'State')
        .addColumn('emailAddress', 'Email')
        .addColumn('phone', 'Phone', 1, params => DATA_FORMATTERS.PhoneNumber(params.data.phone))
        .addColumn('attn', 'ATTN')
        .addColumn('comment', 'Comment', 2)
        .addButtonColumn('edit-contact', Edit, editContact, row => ($host.appIsReadonly || row.contactType === CONTACT_TYPE.LOOKUP))
        .addButtonColumn('delete-contact', Delete, deleteContact, $host.appIsReadonly);

    const columnDefs = builder.build();

    return <DataGrid key="contacts-grid" columnDefs={columnDefs} rowData={rows} pageSize={10} />;
};
