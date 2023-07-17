


import { AgGridReact } from 'ag-grid-react';
import { useSnackbar } from 'notistack';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import {
    ASYNC_STATES
} from '../../../../../Core/Enumerations/redux/async-states';
import { Spinner } from '../../../../../Core/Forms/Common';
import { ClaimantActions, ClaimantListSelectors } from '../../../../../Core/State/slices/claimant';


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


export const ClaimantListSection = ({ request, dispatch }) => {
    const { enqueueSnackbar } = useSnackbar();
    let $dispatch = useDispatch(); 
    const claimantListState = useSelector(ClaimantListSelectors.selectLoading());
    const columnDefs = [
        {
            headerName: 'Name',
            field: 'firstName',
            flex: 1,
            valueGetter: function (params) {
                return (params.data.firstName ? params.data.firstName : "") + ' ' + (params.data.middleName ? params.data.middleName : "") + ' ' + params.data.lastName;
            },
        },
        {
            headerName: 'BI Claimant',
            field: 'bIClaimant',
            flex: 1,
            valueGetter: function (params) {
                return params.data.bIClaimant !== null ? (params.data.bIClaimant === true ? 'Yes' : 'No') : "";
            }
        },
        {
            headerName: 'CIB Requested',
            flex: 1,
            field: 'cIBRequested',
            valueGetter: function (params) {
                return params.data.cIBRequested !== null ? (params.data.cIBRequested === true ? 'Yes' : 'No') : "";
            }
        },
        {
            headerName: 'Medicare Eligible',
            flex: 1,
            field: 'medicareEligible',
            valueGetter: function (params) {
                return params.data.medicareEligible !== null ? (params.data.medicareEligible === true ? 'Yes' : 'No') : "";
            }
        },
        {
            headerName: 'CMS Rejected',
            flex: 1,
            field: 'cMSRejected',
            valueGetter: function (params) {
                return params.data.medicare ?  (params.data.medicare.cMSRejected === true ? 'Yes' : 'No') : "";
            }
        },
        {
            headerName: 'Reported To CMS',
            flex: 1,
            field: 'reportedToCMS',
            valueGetter: function (params) {
                return params.data.medicare ?  (params.data.medicare.reportedToCMS === true ? 'Yes' : 'No') : "";
            }
        },
        {
            headerName: 'Report To CMS',
            flex: 1,
            field: 'medicare.reportToCMS',
            valueGetter: function (params) {
                return params.data.medicare ? (params.data.medicare.reportToCMS === true ? 'Yes' : 'No'): "";
            }
        },
        {
            headerName: 'Reporting To CMS Not Required',
            flex: 1,
            field: 'medicare.reportingToCMSNotRequired',
            valueGetter: function (params) {
                return params.data.medicare ? (params.data.medicare.reportingToCMSNotRequired === true ? 'Yes' : 'No') : "";
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
            $dispatch(ClaimantActions.get({ claimantID: obj.data.claimantID }));
            dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, isProcessing: true, selectedMenu: "CLAIMANT", helpContainerName: 'Claimant Details'  } });

        } catch (e) {
            console.log(e);
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