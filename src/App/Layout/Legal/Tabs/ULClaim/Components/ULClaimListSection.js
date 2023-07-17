


import { AgGridReact } from 'ag-grid-react';
import {
    useSnackbar
} from 'notistack';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import {
    ASYNC_STATES
} from '../../../../../Core/Enumerations/redux/async-states';
import { Panel, PanelHeader, Spinner } from '../../../../../Core/Forms/Common';
import { companiesSelectors } from '../../../../../Core/State/slices/metadata/companies';
import {
    ULClaimActions,
    ULClaimDeleteActions, ULClaimSelectors,
    ULClaimsSelectors
} from "../../../../../Core/State/slices/ULClaims";
import {
    usersSelectors
} from '../../../../../Core/State/slices/users';
import {
    useAppHost
} from '../../../../../Layout/Claim/Tabs/AppHost';
import DeleteChildRenderer, { EditChildRenderer } from '../../../../Claim/Tabs/Accounting/PaymentClaimActivity/DeleteChildRenderer';
import { TabContainer } from '../../../../Claim/Tabs/TabContainer';



const GridContainer = styled.div`
    height: 250px;
    width: auto;
`;

export const ULClaimListSection = ({claim ,request ,dispatch }) => {
    let $dispatch = useDispatch();
    const $host = useAppHost();
    const isViewer = $host.isViewer || $host.appIsReadonly;

    const UlClaims = useSelector(ULClaimsSelectors.selectData()) || [];
    const users = useSelector(usersSelectors.selectData()) || [];
    const currentULClaim = useSelector(ULClaimSelectors.selectData());
    const claimDetailState = useSelector(ULClaimSelectors.selectLoading());
    const { enqueueSnackbar } = useSnackbar();
    const companies = useSelector(companiesSelectors.selectData());
   
    const colDefs = [
        {
            headerName: 'U/L Claim Number',
            field: 'claimID',
            tooltipField: "U/L Claim Number",
            flex:2,
        },
        {
            headerName: 'Status',
            field: 'falClaimStatusTypeID',
            tooltipField: "Status",
            valueFormatter: claimStatusValueFormatter,
            flex: 2,
        },
        {
            headerName: 'Claim Examiner',
            field: 'claimExaminerID',
            tooltipField: "Claim Examiner",
            valueGetter: function (params) {
                return (users.filter(X => X.userID === params.data.claimExaminerID)[0] || {}).fullName;
                //return params.data.claimExaminerID;
            },

            flex: 2,
        },
        {
            headerName: 'Company',
            field: 'g2CompanyNameID',
            sortable: true,
            tooltipField: "Company",
            valueFormatter: claimTypeValueFormatter,
            width: 300
        },
        {
            headerName: 'Primary U/L Claim',
            field: 'isPrimary',
            sortable: true,
            tooltipField: "Primary",
            valueFormatter: isPrimaryValueFormatter,
            flex: 2
        },
        {
            headerName: 'Comment',
            field: 'comment',
            sortable: true,
            tooltipField: "Comment",
            flex: 2
        },
        {
            headerName: '',
            valueGetter: function (params) {
                return "Edit";
            },
            onCellClicked: onRowEditSelected,
            cellRenderer: 'EditChildRenderer',
            flex: 1,
            hide: isViewer
        },
        {
            headerName: '',
            valueGetter: function (params) {
                return "Remove";
            },
            onCellClicked: onDeleteRowSelected,
            cellRenderer: 'DeleteChildRenderer',
            flex: 1,
            hide: isViewer

        },

    ]
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

    function isPrimaryValueFormatter(params) {
        var value = params.value;
        if (value) {
            return "Yes";
        }
        else  {
            return "No";
        }
    };
    function claimStatusValueFormatter(params) {
        var value = params.value;
        if (value === 0) {
            return "New";
        }
        else if (value === 1) {
            return "Assigned";
        }
        else if (value === 2) {
            return "Closed";
        }
        else if (value === 27) {
            return "Error";
        }
    };
    const defaultColDef = {
        cellClass: 'cell-wrap-text',
        cellStyle: { 'white-space': 'normal' },
        sortable: false,
        //editable: true,
        resizable: true,
    };
    const frameworkComponents = {
        DeleteChildRenderer: DeleteChildRenderer,
        EditChildRenderer: EditChildRenderer
    };

    React.useEffect(() => {
        if (claimDetailState === ASYNC_STATES.SUCCESS) {
            $dispatch(ULClaimActions.clearStatus())
            dispatch({ type: 'UPDATE_UNIVERSAL_REQUEST', request: { ...request, currentULClaim: JSON.parse(JSON.stringify(currentULClaim)), editMode: true } });
        }
    }, [])


    const onRowClicked = (e) => {
    }

    function onDeleteRowSelected(e) {
        if (e.data.isPrimary) {
            enqueueSnackbar("Primary U/L Claim cannot be deleted.", { variant: 'error',  anchorOrigin: { vertical: 'top', horizontal: 'center' } });
            return
        }

        $dispatch(ULClaimDeleteActions.delete({ uLClaimID: e.data.ulClaimID }));
    }
    function onRowEditSelected(e) {
        $dispatch(ULClaimActions.get({ uLClaimID: e.data.ulClaimID }));
    }
   

    return (
        companies ? 
            <TabContainer>
                <Panel>
                    <PanelHeader><span style={{ fontWeight: 'bold', fontSize: '14px' }}>U/L Claims</span></PanelHeader>
                    <GridContainer className="ag-theme-balham">
                        <AgGridReact
                            columnDefs={colDefs}
                            rowData={UlClaims}
                            pagination={true}
                            paginationPageSize={10}
                            defaultColDef={defaultColDef}
                            onRowClicked={onRowClicked}
                            frameworkComponents={frameworkComponents}
                        >
                        </AgGridReact>
                    </GridContainer>
                </Panel>
            </TabContainer>
            : <Spinner />
        
        );

} 