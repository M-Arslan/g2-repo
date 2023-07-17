import React from 'react';
import {
    Visibility,
} from '@mui/icons-material';
import {
    DataGrid,
    ColumnBuilder,
} from '../../Common/Components/DataGrid';
import { useSelector } from 'react-redux';
import { appLogsSelectors } from '../../../Core/State/slices/app-logs';
import { ensureNonNullObject } from '../../../Core/Utility/rules';
import { makeEvent } from '../../../Core/Utility/makeEvent';
import styled from 'styled-components';

const Container = styled.main`
    height: 100%;
    width: 100%;
    grid-column: 1;
    grid-row: 2;
`;

export const LogGrid = ({ id, onSelect }) => {

    const rowData = useSelector(appLogsSelectors.selectData());
    
    const selectLog = (row) => {
        if (ensureNonNullObject(row)) {
            if (typeof onSelect === 'function') {
                onSelect(makeEvent(id, row));
            }
        }
    };

    const builder = new ColumnBuilder();
    builder.addColumn('message', 'Message', 2)
        .addColumn('timestamp', 'Occurred', 2, (params) => {
            try {
                const d = new Date(params.data.timestamp);
                return d.toLocaleString();
            }
            catch (e) {
                return '';
            }
        })
        .addColumn('level', 'Level', 1, (params) => {
            const { level } = params.data;
            return (level === 0 ? 'Error' : (level === 1 ? 'Warning' : 'Info'));
        })
        .addButtonColumn('select-log', Visibility, selectLog);

    const columnDefs = builder.build();

    return <Container><DataGrid key="app-log-grid" columnDefs={columnDefs} rowData={rowData} pageSize={50} /></Container>;
};
