


import { AgGridReact } from 'ag-grid-react';
import React from 'react';
import styled from 'styled-components';
import { formatDate, Panel, PanelHeader } from '../../../../Core/Forms/Common';
import { loadActionLogList } from '../../../ActionLog/Queries';


const GridContainer = styled.div`
    height: 500px;
    width: auto;
`;

export const PriorActivityHistory = ({ claim, request, dispatch }) => {
    const [state, setState] = React.useState({
        loaded: false,
        data: [],
        reload: false,
    });

    const colDefs = [
        {
            field: 'firstName',
            headerName: 'Action User',
            cellRenderer: function (params) {
                return params.data.firstName + " " + params.data.lastName;
            }
        },
        {
            field: 'actionTypeText',
            headerName: 'Action',
        },
        {
            field: 'createdDate',
            headerName: 'Action Date',
            cellRenderer: function (params) {
                return formatDate(params.value);
            },
        }
    ]
    const defaultColDef = {
        cellClass: 'cell-wrap-text',
        cellStyle: { 'white-space': 'normal' },
        sortable: false,
        resizable: true,
    };
   

    React.useEffect(() => {
        loadMetaData();
    }, [state.reload]);


    async function loadMetaData() {
        try {
            let actionLogList = await loadActionLogList(claim.claimMasterID, request.currentClaimActivity.activityID);
            actionLogList.data.actionLogList.sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate));
            setState({
                loaded: true,
                data: actionLogList.data.actionLogList,
                reload:true
            });
        } catch (e) {
            console.error('[ERROR] PriorActivityHistory line 66', e);
            console.log(toString(e));
        }
    }   

    return (
        <Panel>
            <PanelHeader><span style={{ fontWeight: 'bold', fontSize: '14px' }}>Activity History</span></PanelHeader>
            <GridContainer className="ag-theme-balham">
                <AgGridReact
                    columnDefs={colDefs}
                    rowData={state.data}
                    pagination={true}
                    paginationPageSize={10}
                    defaultColDef={defaultColDef}
                >
                </AgGridReact>
            </GridContainer>
        </Panel>
    );
};
