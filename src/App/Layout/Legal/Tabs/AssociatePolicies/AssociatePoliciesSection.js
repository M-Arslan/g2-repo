


import { AgGridReact } from 'ag-grid-react';
import {
    useSnackbar
} from 'notistack';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import {
    ASYNC_STATES
} from '../../../../Core/Enumerations/redux/async-states';
import { formatDate, Panel, PanelHeader, Spinner } from '../../../../Core/Forms/Common';
import {
    associatedPolicyActions, associatedPolicyContractSelectors,
    associatedPolicyDeleteActions, associatedPolicySelectors
} from "../../../../Core/State/slices/associated-policy-contracts";
import { companiesSelectors } from '../../../../Core/State/slices/metadata/companies';
import {
    useAppHost
} from '../../../../Layout/Claim/Tabs/AppHost';
import DeleteChildRenderer, { EditChildRenderer } from '../../../Claim/Tabs/Accounting/PaymentClaimActivity/DeleteChildRenderer';
import { TabContainer } from '../../../Claim/Tabs/TabContainer';
import { COMPANY_NAME } from '../../../../Core/Enumerations/app/company-name';


const GridContainer = styled.div`
    height: 250px;
    width: auto;
`;

export const AssociatePoliciesSection = ({ request, dispatch}) => {

    const policyContracts = useSelector(associatedPolicyContractSelectors.selectData()) || [];
    const currentPolicyContract = useSelector(associatedPolicySelectors.selectData()) || [];
    const currentContractState = useSelector(associatedPolicySelectors.selectLoading());
    const { enqueueSnackbar } = useSnackbar();
    const $host = useAppHost();
    const isViewer = $host.isViewer || $host.appIsReadonly;
    const companies = useSelector(companiesSelectors.selectData());
   
    let $dispatch = useDispatch();





    const colDefs = [
        {
            headerName: 'Policy Number/ Contract Number',
            field: 'policyID',
            tooltipField: "Policy Number/ Contract Number",
            flex: 2
        },
        {
            headerName: 'Insured Name',
            field: 'insuredName',
            tooltipField: "Insured Name",
            wrapText: true,
            flex: 2,

        },
        {
            headerName: 'Effective Date',
            field: 'effectiveDate',
            tooltipField: "Effective Date",
            cellRenderer: function (params) {
                return formatDate(params.value);
            },
            flex: 2
        },
        {
            headerName: 'Expiration Date',
            field: 'expirationDate',
            tooltipField: "Expiration Date'",
            cellRenderer: function (params) {
                return formatDate(params.value);
            },
            flex: 2
        },
        {
            headerName: 'Company Name',
            field: 'g2CompanyNameID',
            tooltipField: "Company Name",
            valueFormatter: claimTypeValueFormatter,
            width: 300,
        },
        {
            headerName: 'Comment',
            field: 'comment',
            tooltipField: "Comment",
            flex: 2
        },
        {
            headerName: 'Associated primary policy',
            field: 'isPrimary',
            tooltipField: "Primary",
            valueFormatter: isPrimaryValueFormatter,
            flex: 2
        },
        {
            headerName: '',
            onCellClicked: onRowEditSelected,
            cellRenderer: 'EditChildRenderer',
            flex: 1,
            hide: isViewer
        },
        {
            headerName: '',
            onCellClicked: onDeleteRowSelected,
            cellRenderer: 'DeleteChildRenderer',
            flex: 1,
            hide: isViewer
        },

    ]
    
    function isPrimaryValueFormatter(params) {
        var value = params.value;
        if (value) {
            return "Yes";
        }
        else{
            return "No";
        }
    };
    function claimTypeValueFormatter(params) {
        var value = params.value;
        if (value === 1) {
            return companies[0].companyName;
        }
        else if (value === 2) {
            return companies[1].companyName;
        }
        else if (value === 3) {
            return companies[2].companyName;
        }
        else if (value === 4) {
            return companies[3].companyName;
        }
        else if (value === 5) {
            return companies[4].companyName;
        }

    };

    const defaultColDef = {
        cellClass: 'cell-wrap-text',
        cellStyle: { 'white-space': 'nowrap' },
        rowStyle: { height: '-webkit-fill-available' },

        filter: true,
        sortable: false,
        //editable: true,
        resizable: true,
    };


    function onDeleteRowSelected(e) {
        if (e.data.isPrimary) {
            enqueueSnackbar("Primary Associated Policy cannot be deleted.", { variant: 'error',  anchorOrigin: { vertical: 'top', horizontal: 'center' } });
            return
        }
        $dispatch(associatedPolicyDeleteActions.delete({ associatedPolicyID: e.data.associatedPolicyID }));
    }
    function onRowEditSelected(e) {
        $dispatch(associatedPolicyActions.get({ associatedPolicyID: e.data.associatedPolicyID }));
    }

    const frameworkComponents = {
        DeleteChildRenderer: DeleteChildRenderer,
        EditChildRenderer: EditChildRenderer
    };


    React.useEffect(() => {
        if (currentContractState === ASYNC_STATES.SUCCESS) {
            $dispatch(associatedPolicyActions.clearStatus())
            if (currentPolicyContract.g2CompanyNameID === COMPANY_NAME.GSI_GENERAL_STAR_INDEMNITY_CO || currentPolicyContract.g2CompanyNameID === COMPANY_NAME.GSN_GENERAL_STAR_NATIONAL_INSURANCE_CO) {
                request.selectedMenu = "GENERALSTAR"
            } else if (currentPolicyContract.g2CompanyNameID === COMPANY_NAME.GIC_GENESIS_INSURANCE_COMPANY || currentPolicyContract.g2CompanyNameID === COMPANY_NAME.GRC_GENERAL_REINSURANCE_CORPORATION) {
                request.selectedMenu = "GENESIS"
            }
            else if (currentPolicyContract.g2CompanyNameID === COMPANY_NAME.OTHER ) {
                request.selectedMenu = "OTHER"
            }

            dispatch({ type: 'UPDATE_UNIVERSAL_REQUEST', request: { ...request, currentAssociatedPolicy: JSON.parse(JSON.stringify(currentPolicyContract)), othersDrawerOpen: true, editMode: true } });
        }
        
    }, [currentContractState])
    
    return (
        companies ? 
            <TabContainer>
                <Panel>
                    <PanelHeader><span style={{ fontWeight: 'bold', fontSize: '14px' }}>Associated Policy/ Contract Detail</span></PanelHeader>
                    <GridContainer className="ag-theme-balham">
                        <AgGridReact
                            columnDefs={colDefs}
                            rowData={policyContracts ?  policyContracts : []}
                            pagination={true}
                            frameworkComponents={frameworkComponents}
                            paginationPageSize={10}
                            defaultColDef={defaultColDef}
                        >
                        </AgGridReact>
                    </GridContainer>
                </Panel>
            </TabContainer>
            : <Spinner />

    );

} 