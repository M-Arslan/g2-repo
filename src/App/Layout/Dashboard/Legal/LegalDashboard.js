import {
    Menu as MenuIcon, PostAdd
} from '@mui/icons-material';
import { IconButton } from '@mui/material';



import {
    AgGridReact
} from 'ag-grid-react';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { APP_TYPES } from '../../../Core/Enumerations/app/app-types';
import {
    formatDate
} from '../../../Core/Forms/Common';
import { loadUsers } from '../../../Core/Services/EntityGateway';
import {
    companiesActions
} from '../../../Core/State/slices/metadata/companies';
import {
    legalCompaniesActions
} from '../../../Core/State/slices/metadata/legal-companies';
import { userSelectors } from '../../../Core/State/slices/user';
import {
    usersActions
} from '../../../Core/State/slices/users';
import { getSortedColumns } from '../../../Core/Utility/colStateUtils';
import { CaraUrls } from '../../../Settings';
import { Unauthorized } from '../../Unauthorized';
import {
    CreateLegalClaimDrawer
} from '../CreateLegalClaimDrawer/CreateLegalClaimDrawer';
import { loadLegalClaimGridData } from '../Queries/loadClaimGridData';
import {
    DashboardUserGridViews
} from '../UserGridViews/DashboardUserGridViews';
import { LEGAL_ENTITY } from '../../../Core/Enumerations/app/legal-entity';


const ClaimLandingContainer = styled.div`
    height: 100%;
    width: 100%;
    margin: 0;
    padding: 0;
`;

const ClaimLandingToolbar = styled.div`
    background-color: ${props => props.theme.backgroundDark};
    height: 37px;
    width: 100%;
    padding: 0;
    border-bottom: solid 1px ${props => props.theme.onBackground};

    display: flex;
    flex-flow: row wrap;
    justify-content: space-between;
    align-content: center;
`;

const Toolbuttons = styled.div`
    height: 36px;
    display: flex;
    flex-flow: row wrap;
    justify-content: flex-start;
    align-content: center;
`;
const ClaimLandingHeader = styled.section`
    width: 100%;
    height:100%;
    padding: .5em;
    margin: 0;
    border: none;
    margin-bottom: .5em;
    background-color: ${props => props.theme.backgroundColor};
`;
const Title = styled.div`
    display: flex;
    padding: 12px;
    font-weight: bold;
`;

const GridContainer = styled.div`
    height: 90%;
    width: 100%;
    padding:0px 10px 0px 10px;
`;


const columnDataKey = "columnData";
const filterDataKey = "filterData";
const sortDataKey = "sortData";
let gridApi;
let columnApi;
let selectedView;
export const LegalDashboard = ({ match }) => {
    const $auth = useSelector(userSelectors.selectAuthContext());
    const $dispatch = useDispatch();

    const isViewer = $auth.isReadOnly(APP_TYPES.Legal_Dashboard);
    const [isAuthorize, setIsAuthorize] = React.useState(true);
    const [users, setUsers] = React.useState([]);
    const [open, setOpen] = React.useState(false);
    const [createOpen, setCreateOpen] = React.useState(false);
    const [CARAClaimFileURL, setCARAClaimFileURL] = React.useState("");
    const colDefs = [
        {
            headerName: 'Legal Claim Number',
            field: 'claimID',
            colId: 'claimID',
            sortable: true,
            filter: "agTextColumnFilter",
            editable: false,
            resizable: false,
            width: 170,
            tooltipField: "Claim Number",
            cellRenderer: function(params) {
                return ((params.data.g2LegalEntity === LEGAL_ENTITY.GENESIS_REINSURANCE) || (!params.data.statutoryClaimID) ? <a href={`/legal/${params.data.claimMasterID}`} target="_blank">{params.data.claimID}</a> : <a href={`/legal/${params.data.claimMasterID}`} target="_blank">{`${params.data.claimID}/${params.data.statutoryClaimID}`}</a>)
            },
            filterParams: {
                filterOptions: ['contains'],
                suppressAndOrCondition: true
            }
        },
        {
            headerName: 'Insured Name',
            field: 'insuredName',
            colId: 'insuredName',
            sortable: true,
            filter: "agTextColumnFilter",
            tooltipField: "Insured Name",
            filterParams: {
                filterOptions: ['contains'],
                suppressAndOrCondition: true
            }
        },
        {
            headerName: 'Policy / Contract ',
            field: 'policyContractID',
            colId: 'policyContractID',
            sortable: true,
            filter: "agTextColumnFilter",
            tooltipField: "Policy Number",
            filterParams: {
                filterOptions: ['contains'],
                suppressAndOrCondition: true
            }
        },
        {
            headerName: 'Company Entity',
            field: 'genReCompanyName',
            colId: 'genReCompanyName',
            sortable: true,
            filter: "agSetColumnFilter",
            tooltipField: "Company",
            filterParams: {
                values: ["General Star", "Genesis"],
                suppressAndOrCondition: true
            },
        },
        {
            headerName: 'Date Assigned To Counsel',
            field: 'assignedToCounsel',
            colId: 'assignedToCounsel',
            sortable: true,
            defaultOption:"empty",
            filter: "agDateColumnFilter",
            tooltipField: "Date Assigned To Counsel",
            cellRenderer: function (params) {
                return formatDate(params.value);
            },
            filterParams: {
                filterOptions: ['equals'],
                suppressAndOrCondition: true
            },

        },
        {
            headerName: 'CARA Docs',
            field: 'deptCD',
            colId: 'deptCD',
            sortable: true,
            filter: false,
            tooltipField: "CARA Docs",
            cellRenderer: function (params) {
                if (params.data.claimID !== '')
                {
                    if (params.data.statutoryClaimID !== null) {
                    return <a href={`${CARAClaimFileURL}${params.data.statutoryClaimID}`} target="_blank">Claims</a>;

                    }
                    return <a href={`${CARAClaimFileURL}${params.data.claimID}`} target="_blank">Claims</a>;
                }
                return '';
            },
            filterParams: {
                filterOptions: ['contains'],
                suppressAndOrCondition: true
            }
        },
        {
            headerName: 'Status',
            field: 'statusText',
            colId: 'statusText',
            filter: "agSetColumnFilter",
            filterParams: {
                values: ['New', 'Assigned', 'Closed', 'Error'],
                suppressAndOrCondition: true
            },
            sortable: true,
            tooltipField: "status Text",
        },
        {
            headerName: 'Claim Counsel',
            field: 'claimCounselFullName',
            colId: 'claimCounselFullName',
            sortable: true,
            tooltipField: "Claim Counsel",
            filter: "agSetColumnFilter",
            filterParams: {
                values: users?.map(x => x.fullName),
                suppressAndOrCondition: true
            }
        }
    ];

    
    const defaultColDef = {
        autoHeight: true,
        autoWidth: true,
        sortable: true,
        resizable: true,
        filter: true,
        floatingFilter: true,
    };
    /* Start Grid Functions */
    const onGridReady = (params) => {
        gridApi = params.api;
        columnApi = params.columnApi;
    };
    function ServerSideDatasource() {
        return {
            getRows: async function (params) {


                let filterModel = gridApi.getFilterModel();
                let filterCount = Object.keys(gridApi.getFilterModel()).length;
                let sortCount = getSortedColumns(columnApi).length;
                let searchDataObj = {
                    "pageNumber": params.request.endRow / 50,
                    "pageSize": 50,
                    "falClaimStatusTypeIDs": "0,1,2,27",
                };
                if ((sortCount > 0 || filterCount > 0) && (selectedView === undefined || (selectedView !== undefined && selectedView.isDefault && selectedView.isSystem))) {
                    filterModel.claimCounselFullName = { "values": [$auth.currentUser.fullName], "filterType": "set" };
                }

                if (filterCount > 0) {
                    if (filterModel.claimID !== undefined) {
                        searchDataObj.claimID = filterModel.claimID.filter;
                    }
                    if (filterModel.insuredName !== undefined) {
                        searchDataObj.insuredName = filterModel.insuredName.filter;
                    }
                    if (filterModel.policyContractID !== undefined) {
                        searchDataObj.policyID = filterModel.policyContractID.filter;
                    }
                    if (filterModel.genReCompanyName !== undefined) {
                        searchDataObj.g2Company = filterModel.genReCompanyName.values.toString();
                    }
                    if (filterModel.assignedToCounsel !== undefined) {
                        searchDataObj.dateAssignedToCounsel = new Date(filterModel.assignedToCounsel.dateFrom).toISOString();
                    }

                    if (filterModel.statusText !== undefined) {
                        searchDataObj.falClaimStatusTypeIDs = JSON.stringify(filterModel.statusText.values).replace('"Closed"', "2").replace('"New"', "0").replace('"Assigned"', "1").replace('"Error"', "27").replace("[", "").replace("]", "");
                    }
                    else {
                        searchDataObj.falClaimStatusTypeIDs = "0,1,2,27";
                    }
                    if (filterModel.claimCounselFullName !== undefined) {
                        var userIds = [];
                        var filters = users.filter(x => {
                            if (filterModel.claimCounselFullName.values.includes(x.fullName)) {
                                userIds.push(x.userID);
                                return x.userID;
                            }
                        });
                        searchDataObj.claimCounselUserID = userIds.toString();
                    }
                }
                if (sortCount > 0) {
                    const sortedCol = getSortedColumns(columnApi)[0];
                    if (sortedCol.colId === 'legalCounselFullName') {
                        searchDataObj.orderBy = "ClaimExaminerID " + sortedCol.sort;
                    }
                    else {
                        searchDataObj.orderBy = sortedCol.colId + " " + sortedCol.sort;
                    }
                }
                const ClaimGridData = await loadLegalClaimGridData(searchDataObj);
                let claims = {};

                claims = ClaimGridData.data.legalSearch.legalSearchResult;
                var totalRows = -1;
                if (claims.length < 50) {
                    totalRows = params.request.startRow + claims.length;
                }
                params.successCallback(claims, totalRows);
            },
        };
    };
    const onColumnMoved = (params) => {
        let columnData = JSON.stringify(params.columnApi.getColumnState());
        localStorage.setItem(columnDataKey, columnData);
    };
    const onSortChanged = (params) => {
        var colState = params.columnApi.getColumnState();
        var sortState = colState
            .filter(function (s) {
                return s.sort !== null;
            })
            .map(function (s) {
                return { colId: s.colId, sort: s.sort, sortIndex: s.sortIndex };
            });
        localStorage.setItem(sortDataKey, JSON.stringify(sortState));
        localStorage.setItem(columnDataKey, JSON.stringify(colState));
    };
    const onFilterChanged = (params) => {
        let filterData = params.api.getFilterModel();
        if (selectedView.isSystem === true && selectedView.isDefault === true) {
            filterData.statusText = { "values": ["New"], "filterType": "set" };
            filterData.legalCounselFullName = { "values": [$auth.currentUser.fullName], "filterType": "set" };
        }
        filterData = JSON.stringify(filterData);
        localStorage.setItem(filterDataKey, filterData);

    };

    const setGridFilters = () => {
        if (selectedView !== null && selectedView !== undefined) {

            try {
                columnApi.applyColumnState(
                {
                    state: JSON.parse(selectedView.columnData),
                    defaultState: { sort: null },
                });
                gridApi.setFilterModel(JSON.parse(selectedView.filterData));
            }
            catch (ex) {
                console.log(ex);
            }
        }
        gridApi.sizeColumnsToFit();
    };
    /* End Grid Functions */

    const userGridViewFunction = (view) => {
        selectedView = view;
        setGridFilters();
        var datasource = ServerSideDatasource();
        gridApi.setServerSideDatasource(datasource);
    };
    const setDataOfMetadata = (data) => {
        /*setMetadata(data);*/
    };
    const handleDrawerOpen = () => {
        setOpen(true);
    };
    const handleDrawerClose = () => {
        setOpen(false);
    };

    /* End View Funtions */
    const handleShowCreateClaim = () => {
        setCreateOpen(true);
    };
    React.useEffect(() => {
        if ($auth.hasPermission(APP_TYPES.Legal_Dashboard)) {
            setIsAuthorize(true);
            $dispatch(legalCompaniesActions.get());
            $dispatch(usersActions.getAllUsers());
            $dispatch(companiesActions.get());
        }
        else {
            setIsAuthorize(false);
        }
        localStorage.removeItem(columnDataKey);
        localStorage.removeItem(sortDataKey);
        localStorage.removeItem(filterDataKey);

        Promise.all([
            CaraUrls(),
            loadUsers()
        ])
            .then(([ce, lu]) => {
                setCARAClaimFileURL(ce[0]);
                setUsers(lu.data.users);
            });
        
    }, []);
    
    return (
      <>
            { isAuthorize ? (
                <ClaimLandingContainer>
                    <ClaimLandingToolbar>
                        <Toolbuttons>
                            {isViewer !== true ?
                                <IconButton name="new" title="New Claim" onClick={handleShowCreateClaim}>
                                    <PostAdd />
                                </IconButton>
                                : null}
                        </Toolbuttons>
                        <Title>Legal Dashboard</Title>
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            onClick={handleDrawerOpen}
                        >
                            <MenuIcon />
                        </IconButton>
                    </ClaimLandingToolbar>
                    <ClaimLandingHeader>
                        { users?.length > 0 ? (
                            <GridContainer className="ag-theme-balham">
                                <AgGridReact
                                    defaultColDef={defaultColDef}
                                    columnDefs={colDefs}
                                    onGridReady={onGridReady}
                                    onSortChanged={onSortChanged}
                                    onFilterChanged={onFilterChanged}
                                    onColumnVisible={onColumnMoved}
                                    onColumnMoved={onColumnMoved}
                                    pagination={true}
                                    paginationPageSize={50}
                                    floatingFilter
                                    rowModelType={'serverSide'}
                                    serverSideStoreType={'partial'}
                                    cacheBlockSize={50}
                                    animateRows={true}

                                >
                                </AgGridReact>
                            </GridContainer>
                        ) : null
                        }
                    </ClaimLandingHeader>
                    <CreateLegalClaimDrawer isOpen={createOpen} onCloseDrawer={setCreateOpen} />
                    { users?.length > 0 ? (
                        <DashboardUserGridViews open={open} handleDrawerClose={handleDrawerClose} setData={setDataOfMetadata} userGridViewFunction={userGridViewFunction} gridApi={gridApi} landingPage={"LegalLandingPage"} columnApi={columnApi} />
                    ) : null
                    }
                </ClaimLandingContainer >
            )
                : <Unauthorized />}
     </>
    );
};