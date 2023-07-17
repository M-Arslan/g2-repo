import {
    Delete
} from '@mui/icons-material';
import React from 'react';
import { ensureNonEmptyString, ensureNonNullObject } from '../../../../../../Core/Utility/rules';
import {
    ColumnBuilder, DataGrid
} from '../../../../../Common/Components/DataGrid';
import {
    useAppHost
} from '../../../AppHost';

export const ClaimList = ({ rowData, onDelete }) => {

    const $host = useAppHost();

    const doDelete = (row) => {
        if (ensureNonNullObject(row) && ensureNonEmptyString(row.associatedClaimID)) {
            if (typeof onDelete === 'function') {
                onDelete(row.associatedClaimID);
            }
        }
    };

    const builder = new ColumnBuilder();
    builder.addColumn('claimID', 'Claim ID')
        .addColumn('policyID', 'Policy Number')
        .addColumn('insuredName', 'Insured Name')
        .addColumn('statusText', 'Status')
        .addColumn('examinerFirstName', 'Claim Examiner', 1, (params) => `${params.data.examinerFirstName || ''} ${params.data.examinerLastName || ''}`)
        .addButtonColumn('associatedClaimID', Delete, doDelete, $host.appIsReadonly);

    const columnDefs = builder.build();

    return <DataGrid key="associated-claims-grid" columnDefs={columnDefs} rowData={rowData} />;
};