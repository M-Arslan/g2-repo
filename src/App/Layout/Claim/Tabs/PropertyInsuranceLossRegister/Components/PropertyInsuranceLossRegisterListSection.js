

import { AgGridReact } from 'ag-grid-react';


import { useSnackbar } from 'notistack';
import React from 'react';
import styled from 'styled-components';
import { formatDate, Panel, PanelContent, PanelHeader, Spinner } from '../../../../../Core/Forms/Common';
import { loadPropertyInsuranceLossRegisterDetail } from '../Queries/loadPropertyInsuranceLossRegisterDetail';
import { loadPriorClaimActivityForPILR } from '../../Accounting/Queries/loadPriorClaimActivity';
import {
    loadUsers
} from '../../../../../Core/Services/EntityGateway';
const GridContainer = styled.div`
    height: 400px;
    width: 100%;
`;


export const PropertyInsuranceLossRegisterListSection = ({ request, dispatch }) => {
    const { enqueueSnackbar } = useSnackbar();
    const [state, setState] = React.useState({
        loaded: false,
        data: [],
    });
    const colDefs = [
        {
            headerName: 'Activity Type',
            field: 'accountingTransTypeText',
            tooltipField: "Activity Type",
        }, {
            headerName: 'Requested Date',
            field: 'activityCreatedDate',
            tooltipField: "Requested Date",
          //  sort: 'asc',
            sortable: true,
            valueGetter: function (params) {
                return formatDate(params.data.activityCreatedDate);
            }
        }, {
            headerName: 'Requested By',
            field: 'activityCreatedBy',
            tooltipField: "Requested By",
            cellRenderer: function (params) {
                return params.data.activityCreatedByFirstName + ' ' + params.data.activityCreatedByLastName;
            }
        }, {
            headerName: 'Status',
            field: 'statusText',
            tooltipField: "Status",
        }, {
            headerName: 'Status Date',
            field: 'statusDate',
            tooltipField: "Status Date",
            valueGetter: function (params) {
                return formatDate(params.data.statusDate);
            },

        },
    ]

    const defaultColDef = {
        cellClass: 'cell-wrap-text',
        cellStyle: { 'white-space': 'normal' },
        sortable: true,
        rowHeight: 'auto',
        resizable: true,
    };

    React.useEffect(() => {
        //window.history.pushState("", "", '/Claim/' + request.claim.claimMasterID + '/#pilr');
        Promise.all([
            loadPriorClaimActivityForPILR(request.claim.claimMasterID),
            loadUsers(),
        ]).then(([pc, lu]) => {
            setState({
                loaded: true,
                data: pc.data.accountingListForPILR,
                users: lu,
            });
        })
    }, []);

    async function onRowSelected(e) {
        try {
            let result = {};
            dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, isSaving: true, isProcessing: true } });
            result = await loadPropertyInsuranceLossRegisterDetail(e.data.activityID);
            if (result.data.detail) {
                dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, currentClaimActivity: e.data, isSaving: false, isProcessing: false, selectedMenu: "PILR", originalPropertyInsuranceLossRegister: result.data.detail, currentPropertyInsuranceLossRegister: result.data.detail, editMode: true, helpContainerName: 'Property InsuranceLoss Register Details' } });
            }
            else {
                dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, isSaving: false, isProcessing: false } });
            }
        }
        catch (e) {
            enqueueSnackbar(toString(e), { variant: 'error',  anchorOrigin: { vertical: 'top', horizontal: 'center' } });
        }
    }

    //function ParseGQErrors(errors, error) {
    //    if (error || errors) {
    //        enqueueSnackbar("An error occured.", { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
    //    }
    //}


    return (
        !state.loaded ? <Spinner /> :
            <Panel>
                <PanelHeader><span style={{ fontWeight: 'bold', fontSize: '14px' }}>Prior PILR Activity</span></PanelHeader>
                <PanelContent style={{ height: 800 }}>
                    <GridContainer className="ag-theme-balham">
                        <AgGridReact
                            columnDefs={colDefs}
                            rowData={state.data ? (state.data ? state.data : []) : []}
                            onRowClicked={onRowSelected}
                            defaultColDef={defaultColDef}
                        >
                        </AgGridReact>
                    </GridContainer>

                </PanelContent>
            </Panel>
    );

};