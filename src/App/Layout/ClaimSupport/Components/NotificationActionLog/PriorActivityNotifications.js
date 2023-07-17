import React from 'react';
import styled from 'styled-components';
import {
    AgGridReact
} from 'ag-grid-react';



import { LoadNotificationActionLogList } from './Queries/LoadNotificationActionLogList';
import { formatDate, Panel, PanelContent, PanelHeader, Spinner } from '../../../../Core/Forms/Common';

const GridContainer = styled.div`
    height: 90%;
    width: 100%;
`;

export const PriorActivityNotifications = ({users,claimMasterID,NotificationID}) => {
    const [state, setState] = React.useState({
        loaded: false,
        data: [],
    });
    function supportTypeStatusFormatter(params) {
        var value = params.value;
        if (value === 28) {
            return "New";
        }
        else if (value === 29) {
            return "In Progress";
        }
        else if (value === 30) {
            return "Void";
        }
        else if (value === 31) {
            return "Completed";
        }
    }
    const colDefs = [
        {
            headerName: 'Requested By',
            field: 'createdBy',
            tooltipField: "Requested By",
            sortable: true,
            valueGetter: function (params) {
                let selected_users = ((users.data || {}).users || []).filter(x => x.userID.toLowerCase() === params.data.createdBy.toLowerCase());
                if (selected_users.length > 0) {
                    return selected_users[0].fullName;
                }
            }
        }, {
            headerName: 'Status',
            field: 'actionTypeID',
            sortable: true,
            tooltipField: "Status",
            cellRenderer: supportTypeStatusFormatter,
        }, {
            headerName: 'Status Date',
            field: 'createdDate',
            tooltipField: "Status Date",
            cellRenderer: function (params) {
                return formatDate(params.value);
            },
        },
    ]

    const defaultColDef = {
        cellClass: 'cell-wrap-text',
        cellStyle: { 'white-space': 'normal' },
        sortable: false,
        //editable: true,
        resizable: true,
    };

    React.useEffect(() => {
        Promise.all([
            LoadNotificationActionLogList(claimMasterID, NotificationID),
        ]).then(([pc]) => {
            setState({
                loaded: true,
                data: pc.data.actionLogList
            });
        })

    }, []);
    
    return (!state.loaded ? <Spinner /> :
        <Panel>
            <PanelHeader><span style={{ fontWeight: 'bold', fontSize: '14px' }}>Prior Notifications</span></PanelHeader>
            <PanelContent style={{ height: 500 }}>
                <GridContainer className="ag-theme-balham">
                    <AgGridReact
                        columnDefs={colDefs}
                        rowData={state.data ? (state.data ? state.data : []) : []}
                        rowHeight={80}
                        defaultColDef={defaultColDef}
                        pagination={true}
                        paginationPageSize={10}
                    >
                    </AgGridReact>
                </GridContainer>
            </PanelContent>
        </Panel>);

}