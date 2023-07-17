import {
    Visibility
} from '@mui/icons-material';
import React from 'react';
import styled from 'styled-components';
import {
    Panel,
    PanelContent,
    PanelHeader
} from '../../../../../../Core/Forms/Common';
import {
    ensureNonEmptyArray
} from '../../../../../../Core/Utility/rules';
import {
    ColumnBuilder, DataGrid
} from '../../../../../Common/Components/DataGrid';

const GridContainer = styled.div`
    height: 100%;
    width: 100%;
    padding: 0;
    margin: 0;
    border: none;
    display: flex;
    flex-flow: column nowrap;
`;

const HtmlContainer = styled.div`
    width: 100%;
    height: 60px;
    overflow: hidden;

    & > * {
        margin: 0;
    }
`;

function stripTags(html) {
    let doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || "";
}

function NarrativeTextRenderer({ node }) {

    const content = node.data.narrative;
    return <HtmlContainer>{stripTags(content)}</HtmlContainer>;
}

export const ActivityLogList = ({ rowData, onReadMore }) => {

    const [supervisorRowData, setSupervisorRowData] = React.useState([]);
    const [ceRowData, setCeRowData] = React.useState([]);

    const doRowFiltering = (rowData) => {
        setSupervisorRowData((ensureNonEmptyArray(rowData) ? rowData.filter(row => row.isSupervisor === true) : []));
        setCeRowData((ensureNonEmptyArray(rowData) ? rowData.filter(row => row.isSupervisor !== true) : []));
    }

    React.useEffect(() => {
        doRowFiltering(rowData);
    }, [rowData]);

    const readMore = (evt) => {
        if (typeof onReadMore === 'function') {
            onReadMore(evt);
        }
    }

    const builder = new ColumnBuilder();
    builder.addColumn('userCreatedDate', 'Created On', 1, params => params.data.userCreatedDate, 'desc')
        .configureColumn('userCreatedDate', {
            comparator: (d1, d2) => {
                const d1num = Date.parse(d1);
                const d2num = Date.parse(d2);

                const invalid = (n) => (isNaN(n) || n === null || typeof n === 'undefined');

                if (invalid(d1num) && invalid(d2num)) {
                    return 0;
                }

                if (invalid(d1num)) {
                    return -1;
                }
                else if (invalid(d2num)) {
                    return 1;
                }
                else {
                    return d1num - d2num;
                }
            }
        })
        .addColumn('createdByDisplayName', 'Created By')
        .addColumn('narrative', 'Narrative', 3)
        .configureColumn('narrative', {
            cellRenderer: 'NarrativeTextRenderer',
            wrapText: true,
            floatingFilterComponentParams: { suppressFilterButton: true }
        })
        .addButtonColumn('claimNarrativeID', Visibility, readMore);

    const columnDefs = builder.build();

    return <>
        <GridContainer>
           <Panel height="50%">
                <PanelHeader>
                    <span>Examiner Notes</span>
                </PanelHeader>
                <PanelContent>
                    <DataGrid key="ce-notes-grid" columnDefs={columnDefs} rowData={ceRowData} extraFrameworkComponents={{ NarrativeTextRenderer }} options={{ rowHeight: 60 }} />
                </PanelContent>
            </Panel>
            <Panel height="50%">
                <PanelHeader>
                    <span>Supervisor Notes</span>
                </PanelHeader>
                <PanelContent>
                    <DataGrid key="supervisor-notes-grid" columnDefs={columnDefs} rowData={supervisorRowData} extraFrameworkComponents={{ NarrativeTextRenderer }} options={{ rowHeight: 60 }} />
                </PanelContent>
            </Panel>
        </GridContainer>
    </>;
};