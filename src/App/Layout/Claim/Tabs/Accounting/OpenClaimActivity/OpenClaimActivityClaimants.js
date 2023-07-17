


import { AgGridReact } from 'ag-grid-react';
import { useSnackbar } from 'notistack';
import React from 'react';
import styled from 'styled-components';
import { loadClaimants } from '../../Claimants/queries';
import { Button } from '@mui/material';
import { formatDate } from '../../../../../Core/Forms/Common';
import { CLAIM_TYPES } from '../../../../../Core/Enumerations/app/claim-type';
import { LEGAL_ENTITY } from '../../../../../Core/Enumerations/app/legal-entity';
import { ACCOUNTING_TRANS_TYPES } from '../../../../../Core/Enumerations/app/accounting-trans-type';
import { CLAIM_STATUS_TYPE } from '../../../../../Core/Enumerations/app/claim-status-type';



const GridContainer = styled.div`
    height: 400px;
    width: 100%;
`;


const ContentRow = styled.div`
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-start;
    align-items: center;
    align-content: center;
`;

const ContentCell = styled.div`
    width: ${props => props.width || '50%'};
    display: flex;
    flex-flow: row nowrap;
    justify-content: ${props => props.alignContent || 'flex-start'};
    align-items: ${props => props.alignContent || 'flex-start'};
    align-content: ${props => props.alignContent || 'flex-start'};
    padding: 0em;
`;

let gridAPI = null;
let columnApi;
export const OpenClaimActivityClaimants = ({ claim, request, dispatch, isViewer }) => {
    const { enqueueSnackbar } = useSnackbar();
    const [state, setState] = React.useState({
        loading: true,
        data: [],
    });
    let currentClaimActivity = request.currentClaimActivity || {};
    let currentOpenRegistrations = currentClaimActivity.openRegistrations || {};
    let currentOpenRegistrationClaimants = currentOpenRegistrations.openRegistrationClaimants || [];
    let columnDefs = [
        {
            headerName: 'Name',
            field: 'firstName',
            flex: 1,
            valueGetter: function (params) {
                let firstName = params.data.firstName ? params.data.firstName : '';
                let middletName = params.data.middleName ? params.data.middleName : '';
                let lastName = params.data.lastName ? params.data.lastName : '';
                return firstName + ' ' + middletName   + ' ' + lastName;
            },
            checkboxSelection: (!request.currentClaimActivity.activityID || request.currentClaimActivity.claimStatusTypeID === CLAIM_STATUS_TYPE.OUTSTANDING_ISSUE),
        },
        {
            headerName: 'Date Of Birth',
            field: 'dateOfBirth',
            flex: 1,
            valueGetter: function (params) {
                return formatDate(params.data.dateOfBirth);
            },
        },
    ];

    if (request.currentClaimActivity.accountingTransTypeID === ACCOUNTING_TRANS_TYPES.OPEN)
    {
        columnDefs.push({
            headerName: 'Loss Reserve',
            field: 'lossReserve',
            flex: 1,
            editable: (!request.currentClaimActivity.activityID || request.currentClaimActivity.claimStatusTypeID === CLAIM_STATUS_TYPE.OUTSTANDING_ISSUE),
            //type: 'numericColumn',
            //filter: 'agNumberColumnFilter'
        });
        columnDefs.push({
            headerName: 'Expense Reserve',
            flex: 1,
            field: 'expenseReserve',
            editable: (!request.currentClaimActivity.activityID || request.currentClaimActivity.claimStatusTypeID === CLAIM_STATUS_TYPE.OUTSTANDING_ISSUE),
        });
        columnDefs.push({
            headerName: 'Med Pay Reserve',
            flex: 1,
            field: 'medPayReserve',
            hide: !(request.currentClaimActivity.accountingTransTypeID === ACCOUNTING_TRANS_TYPES.OPEN && request.claim.claimType !== CLAIM_TYPES.PROPERTY && claim.g2LegalEntityID !== LEGAL_ENTITY.GENESIS_INSURANCE) ,
            editable: (!request.currentClaimActivity.activityID || request.currentClaimActivity.claimStatusTypeID === CLAIM_STATUS_TYPE.OUTSTANDING_ISSUE),
        });

    }
    const defaultColDef = {
        cellClass: 'cell-wrap-text',
        cellStyle: { 'white-space': 'normal' },
        flex: 1,
        autoHeight: true,
        sortable: true,
        //editable: true,
        resizable: true,
        filter: true,
    };
    function onRowSelected(e) {
        //splitValues();
        function findClaimant(X) {
            return X.claimantID === e.data.claimantID;
        }

        if (e.node.selected) {
            let index = currentOpenRegistrationClaimants.findIndex(findClaimant);
            if (index === -1) {
                currentOpenRegistrationClaimants.push(
                    {
                        claimantID: e.data.claimantID,
                        lossReserve: isNaN(parseFloat(e.data.lossReserve)) ? null : parseFloat(e.data.lossReserve),
                        expenseReserve: isNaN(parseFloat(e.data.expenseReserve)) ? null : parseFloat(e.data.expenseReserve),
                        medPayReserve: isNaN(parseFloat(e.data.medPayReserve)) ? null : parseFloat(e.data.medPayReserve)
                    });
            } 
        } else {
            currentOpenRegistrationClaimants = currentOpenRegistrationClaimants.filter(x => !(x.claimantID === e.data.claimantID));
        }
        currentOpenRegistrations.openRegistrationClaimants = currentOpenRegistrationClaimants;
        currentClaimActivity.openRegistrations = currentOpenRegistrations;
        request.currentClaimActivity = currentClaimActivity;
        dispatch({ type: 'UPDATE_UNIVERSAL_REQUEST', request: { ...request, currentClaimActivity: currentClaimActivity } });

    }

    const loadClaimtList = async () => {
        try {

            const result = await loadClaimants(claim.claimMasterID);

            ParseGQErrors(result.errors, result.error);

            let claimantsData = [];

            currentOpenRegistrationClaimants.map((claimant) => {
                function findClaimant(X) {
                    return X.claimantID === claimant.claimantID;
                }

                let index = result.data.claimants.findIndex(findClaimant);

                if (index > -1) {
                    result.data.claimants[index].lossReserve = claimant.lossReserve;
                    result.data.claimants[index].expenseReserve = claimant.expenseReserve;
                    result.data.claimants[index].medPayReserve = claimant.medPayReserve;

                    //claimantsData.push(result.data.claimants[index]);
                }
            });

            claimantsData = result.data.claimants || [];

            setState({
                loading: false,
                data: claimantsData
            });

        } catch (e) {
            enqueueSnackbar(e, { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
            setState({
                loading: false,
                data: []
            });
        }
    };

    function ParseGQErrors(errors, error) {
        if (error || errors) {
            console.log("An error occured: ", errors);
            console.log("An error occured: ", error);
            enqueueSnackbar("An error occured.", { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
        }
    }

    const splitValues = () => {
        let selectedRowCount = currentOpenRegistrationClaimants.length;
        if (selectedRowCount <= 0) {
            enqueueSnackbar("Please select at least one claimant.", { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
        }
        let remLossReserveTotal = (currentOpenRegistrations.lossReserveTotal % 1).toFixed(2);
        let remExpenseReserveTotal = (currentOpenRegistrations.expenseReserveTotal % 1).toFixed(2);
        let remMedPayReserveTotal = (currentOpenRegistrations.medPayReserveTotal % 1).toFixed(2);

        let modLossReserveTotal = (currentOpenRegistrations.lossReserveTotal - remLossReserveTotal) % selectedRowCount;
        let modExpenseReserveTotal = (currentOpenRegistrations.expenseReserveTotal - remExpenseReserveTotal) % selectedRowCount;
        let modMedPayReserveTotal = (currentOpenRegistrations.medPayReserveTotal - remMedPayReserveTotal) % selectedRowCount;

        let lossReserveTotal = (currentOpenRegistrations.lossReserveTotal - remLossReserveTotal) - modLossReserveTotal;
        let expenseReserveTotal = (currentOpenRegistrations.expenseReserveTotal - remExpenseReserveTotal) - modExpenseReserveTotal;
        let medPayReserveTotal = (currentOpenRegistrations.medPayReserveTotal - remMedPayReserveTotal) - modMedPayReserveTotal;

        state.data.map((claimant) => {
            function findClaimant(X) {
                return X.claimantID === claimant.claimantID;
            }

            let index = currentOpenRegistrationClaimants.findIndex(findClaimant);

            //if (currentOpenRegistrationClaimants.filter(X => X.claimantID == claimant.claimantID).length > 0) {
            if (index > -1) {
                let lossReserve = (lossReserveTotal / selectedRowCount) + (modLossReserveTotal > 0 ? 1 : 0) + (index === 0 ? parseFloat(remLossReserveTotal): 0);
                currentOpenRegistrationClaimants[index]["lossReserve"] = claimant["lossReserve"] = isNaN(parseFloat(lossReserve)) ? null : parseFloat(lossReserve);
                    modLossReserveTotal = modLossReserveTotal - 1;

                let expenseReserve = (expenseReserveTotal / selectedRowCount) + (modExpenseReserveTotal > 0 ? 1 : 0) + (index === 0 ? parseFloat(remExpenseReserveTotal) : 0);
                currentOpenRegistrationClaimants[index]["expenseReserve"] = claimant["expenseReserve"] = isNaN(parseFloat(expenseReserve)) ? null : parseFloat(expenseReserve);
                    modExpenseReserveTotal = modExpenseReserveTotal - 1;

                let medPayReserve = (medPayReserveTotal / selectedRowCount) + (modMedPayReserveTotal > 0 ? 1 : 0) + (index === 0 ? parseFloat(remMedPayReserveTotal) : 0);
                currentOpenRegistrationClaimants[index]["medPayReserve"] = claimant["medPayReserve"] = isNaN(parseFloat(medPayReserve)) ? null : parseFloat(medPayReserve);
                    modMedPayReserveTotal = modMedPayReserveTotal - 1;                
            } else {
                claimant["lossReserve"] = null;
                claimant["expenseReserve"] = null;
                claimant["medPayReserve"] = null;
            }
        });
        currentOpenRegistrations.openRegistrationClaimants = currentOpenRegistrationClaimants;
        currentClaimActivity.openRegistrations = currentOpenRegistrations;
        dispatch({ type: 'UPDATE_UNIVERSAL_REQUEST', request: { ...request, currentClaimActivity: currentClaimActivity } });

        setState({ loading: false, data: state.data });
        gridAPI.refreshCells();
    }

    function onCellValueChanged(e) {
        function findClaimant(X) {
            return X.claimantID === e.data.claimantID;
        }

        let index = currentOpenRegistrationClaimants.findIndex(findClaimant);
        if (index > -1) {

            state.data[e.rowIndex][e.colDef.field] = currentOpenRegistrationClaimants[index][e.colDef.field] = isNaN(parseInt(e.newValue)) ? e.oldValue : parseInt(e.newValue);

            currentOpenRegistrations.openRegistrationClaimants = currentOpenRegistrationClaimants;
            currentClaimActivity.openRegistrations = currentOpenRegistrations;

          

            setState({ loading: false, data: state.data });
            gridAPI.refreshCells();
            dispatch({ type: 'UPDATE_UNIVERSAL_REQUEST', request: { ...request, currentClaimActivity: currentClaimActivity } });

        }
    }
    function onCellEditingStarted(e) {
        if (!e.node.selected)
            e.node.setSelected(true);
    }
    function onGridReady(params) {
        gridAPI = params.api;
        columnApi = params.columnApi;

        gridAPI.forEachNode(node => {
            function findClaimant(X) {
                return X.claimantID === node.data.claimantID;
            }

            let index = currentOpenRegistrationClaimants.findIndex(findClaimant);
            if (index > -1)
                node.setSelected(true);
        }
        );
    }
    React.useEffect(() => {
        loadClaimtList();
    }, []);

    return (
        state.loading ? <div>Loading...</div> :
            <div style={{ flex: 1 }}>
                <ContentRow>
                    <ContentCell width="50%">
                        Select Claimants
                    </ContentCell>
                    {request.currentClaimActivity.accountingTransTypeID === ACCOUNTING_TRANS_TYPES.OPEN &&
                        <ContentCell width="50%" alignContent='flex-end'>
                            <Button variant="contained" color="primary" style={{ margin: '10px' }} onClick={splitValues} disabled={isViewer}>Split</Button>
                        </ContentCell>
                    }
                </ContentRow>
                <ContentRow>
                    <ContentCell width="100%">
                        <GridContainer className="ag-theme-balham">
                            <AgGridReact
                                columnDefs={columnDefs}
                                defaultColDef={defaultColDef}
                                rowData={state.data}
                                rowSelection="multiple"
                                onRowSelected={onRowSelected}
                                suppressRowClickSelection={true}
                                onCellValueChanged={onCellValueChanged}
                                onCellEditingStarted={onCellEditingStarted}
                                onGridReady={onGridReady}
                            />
                        </GridContainer>
                    </ContentCell>
                </ContentRow>
            </div>
    );
};