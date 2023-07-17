


import { AgGridReact } from 'ag-grid-react';
import { useSnackbar } from 'notistack';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import {
    ASYNC_STATES
} from '../../../../../Core/Enumerations/redux/async-states';
import { Spinner } from '../../../../../Core/Forms/Common';
import { WCClaimantActions, WCClaimantListSelectors } from '../../../../../Core/State/slices/wc-claimant';


const GridContainer = styled.div`
    height: 400px;
    width: 100%;
`;


//const ContentRow = styled.div`
//    display: flex;
//    flex-flow: row nowrap;
//    justify-content: flex-start;
//    align-items: center;
//    align-content: center;
//`;

//const ContentCell = styled.div`
//    width: 50%;
//    display: flex;
//    flex-flow: row nowrap;
//    justify-content: flex-start;
//    align-items: center;
//    align-content: center;
//    padding: .5em;
//`;

export const WCClaimantListSection = ({ request, dispatch }) => {
    const { enqueueSnackbar } = useSnackbar();
    let $dispatch = useDispatch(); 
    const claimantListState = useSelector(WCClaimantListSelectors.selectLoading());
    const TabularMapping = {
        "N": "No",
        "NT": "Not at this time",
        "U" : "Unknown",
        "Y" : "Yes"
    }
    const columnDefs = [
        {
            headerName: 'Name',
            field: 'claimantName',
            flex: 1,
            valueGetter: function (params) {
                return (params.data.claimantName ? params.data.claimantName : "");
            },
        },
        {
            headerName: 'Tabular',
            field: 'tabular',
            flex: 1,
            valueGetter: function (params) {
                return params.data.tabular !== null ? (TabularMapping[params.data.tabular]) : "";
            }
        },
        {
            headerName: 'Comments',
            flex: 1,
            field: 'comments',
            valueGetter: function (params) {
                return params.data.comments !== null ? params.data.comments : "";
            }
        },
    ];
    const defaultColDef = {
        cellClass: 'cell-wrap-text',
        cellStyle: { 'white-space': 'normal' },
        flex: 1,
        autoHeight: true,
        sortable: true,
        resizable: true,
        filter: true,
    };

    async function onRowClicked(obj) {
        try {
            $dispatch(WCClaimantActions.get({ wCClaimantID: obj.data.wCClaimantID }));
            dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, isProcessing: true, selectedMenu: "WCCLAIMANT", helpContainerName: 'Claimant Details'  } });

        } catch (e) {
            enqueueSnackbar(e.toString(), { variant: 'error',  anchorOrigin: { vertical: 'top', horizontal: 'center' } });
        }
    }
    return (
      
        claimantListState !== ASYNC_STATES.WORKING  ?
            <GridContainer className="ag-theme-balham">
                    <AgGridReact
                    columnDefs={columnDefs}
                    defaultColDef={defaultColDef}
                    rowData={request ? (request.claimants ? request.claimants : []) : []}
                    onRowClicked={onRowClicked}
                    pagination={true}
                    paginationPageSize={10}
                    />
                </GridContainer>
            : <Spinner />
    );

};