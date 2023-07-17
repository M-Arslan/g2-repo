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
import { userSelectors } from '../../../Core/State/slices/user';
import {
    usersActions
} from '../../../Core/State/slices/users';
import { CaraUrls } from '../../../Settings';
import { Unauthorized } from '../../Unauthorized';
import {
    DashboardUserGridViews
} from '../UserGridViews/DashboardUserGridViews';
import { getColumn, getSortedColumns } from '../../../Core/Utility/colStateUtils';
import { ensureNonEmptyString } from '../../../Core/Utility/rules';
import { LEGAL_ENTITY } from '../../../Core/Enumerations/app/legal-entity';
import { ROLES } from '../../../Core/Enumerations/security/roles';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import { loadClaimGridData, loadWCGrdiData, getDJClaimID } from '../Queries/loadClaimGridData';
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

const HeaderSwitchToolbar = styled.div`
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

export const WCDashboard = ({ match, landingPage = null }) => {
    const $auth = useSelector(userSelectors.selectAuthContext());
    const $dispatch = useDispatch();
    const isViewer = $auth.isReadOnly(APP_TYPES.WorkersComp);
    const [isAuthorize, setIsAuthorize] = React.useState(true);
    const [users, setUsers] = React.useState([]);
    const [open, setOpen] = React.useState(false);
    const [otherCompany, setOtherCompany] = React.useState(false);
    const [createOpen, setCreateOpen] = React.useState(false);
    const [CARAClaimFileURL, setCARAClaimFileURL] = React.useState("");
    const [CARAUWFileURL, setCARAUWFileURL] = React.useState("");
    const filteredUsers = users?.filter(x => x.userRoles?.find(y => y.roleID === ROLES.Claims_Examiner));
    const colDefs = [
        {
            headerName: 'Claim Number',
            field: 'claimID',
            colId: 'claimID',
            sortable: true,
            filter: "agTextColumnFilter",
            editable: false,
            resizable: false,
            width: 170,
            tooltipField: "Claim Number",
            cellRenderer: function (params) {
                return ((params.data.g2LegalEntity === LEGAL_ENTITY.GENESIS_REINSURANCE) || (!params.data.statutoryClaimID) ? <a href={`/claim/${params.data.claimMasterID}`} target="_blank">{params.data.claimID}</a> : <a href={`/claim/${params.data.claimMasterID}`} target="_blank">{`${params.data.claimID}/${params.data.statutoryClaimID}`}</a>)
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
            headerName: 'Policy',
            field: 'claimPolicyID',
            colId: 'claimPolicyID',
            sortable: true,
            filter: "agTextColumnFilter",
            tooltipField: "Policy Number",
            filterParams: {
                filterOptions: ['contains'],
                suppressAndOrCondition: true
            }
        },
        {
            headerName: 'Company',
            field: 'genReCompanyName',
            colId: 'genReCompanyName',
            sortable: true,
            tooltipField: "Company",
            filter: false,
        },
        {
            headerName: 'Date Received',
            field: 'dateReceived',
            colId: 'dateReceived',
            sortable: true,
            width: 200,
            defaultOption: "empty",
            filter: "agDateColumnFilter",
            tooltipField: "Date Received",
            cellRenderer: function (params) {
                return formatDate(params.value);
            },
            filterParams: {
                filterOptions: ['equals'],
                suppressAndOrCondition: true
            },

        },
        {
            headerName: 'Claim Type',
            field: 'claimType',
            colId: 'claimType',
            sortable: true,
            filter: "agSetColumnFilter",
            tooltipField: "Claim Type",
            valueFormatter: claimTypeValueFormatter,
            filterParams: {
                values: ["Casualty", "Property"],
                suppressAndOrCondition: true
            },
        },
        {
            headerName: 'CARA Docs',
            field: 'deptCD',
            colId: 'deptCD',
            sortable: false,
            filter: false,
            tooltipField: "CARA Docs",
            cellRenderer: function (params) {
                var urls = [];
                if (params.data.claimID !== '' && params.data.batchID !== null) {
                    urls.push(<a href={`${CARAClaimFileURL}${params.data.batchID}`} target="_blank">Claims</a>);
                }
                if (params.data.claimID !== '' && params.data.claimPolicyID && params.data.batchID !== null) {
                    urls.push(<span>||</span>);
                }
                if (params.data.claimPolicyID) {
                    urls.push(<a href={`${CARAUWFileURL}${params.data.claimPolicyID}`} target="_blank">Policy</a>);
                }
                return urls;
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
            headerName: 'Claim Examiner',
            field: 'claimExaminerFullName',
            colId: 'claimExaminerFullName',
            sortable: true,
            tooltipField: "Claim Examiner",
            filter: "agSetColumnFilter",
            filterParams: {
                values: filteredUsers?.map(x => x.fullName),
                suppressAndOrCondition: true
            }
        }
    ];
    function claimTypeValueFormatter(params) {
        var value = params.value;
        if (value === "Casualty") {
            return "Casualty";
        }
        else if (value === "Property") {
            return "Property";
        }
        else if (value === "Legal") {
            return "Legal";
        }
    };

    const handleCompanySwitchChange = (evt) => {
        setOtherCompany(evt.target.checked);
        if (evt.target.checked) {
            localStorage.setItem("userDefaultCompany", $auth.defaultCompany.G2LegalEntityID === LEGAL_ENTITY.GENERAL_STAR ? LEGAL_ENTITY.GENESIS_INSURANCE : LEGAL_ENTITY.GENERAL_STAR);
        }
        else {
            localStorage.setItem("userDefaultCompany", $auth.defaultCompany.G2LegalEntityID === LEGAL_ENTITY.GENERAL_STAR ? LEGAL_ENTITY.GENERAL_STAR : LEGAL_ENTITY.GENESIS_INSURANCE);
        }
        var datasource = ServerSideDatasource();
        gridApi.setServerSideDatasource(datasource);
    }

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
        //sizeToFit();
        //setGridFilters();
        //var datasource = ServerSideDatasource();
        //params.api.setServerSideDatasource(datasource);

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
                    "selectedWorkflows": "FNOL,Invoice,NULL",
                    "fALClaimStatusTypeIDs": "0,1,2,27",
                    "claimTypeText": "Workers Comp"
                };
                let claimSearch = "claimSearch";
                if ((sortCount > 0 || filterCount > 0) && (selectedView === undefined || (selectedView !== undefined && selectedView.isDefault && selectedView.isSystem))) {
                    filterModel.statusText = { "values": ["New", "Assigned"], "filterType": "set" };
                    filterModel.claimExaminerFullName = { "values": [$auth.currentUser.fullName, 'NULL'], "filterType": "set" };
                }
                if (filterCount > 0 || sortCount > 0) {
                    if (filterModel.claimID !== undefined) {
                        searchDataObj.claimID = filterModel.claimID.filter;
                    }
                    else {
                        searchDataObj.claimID = "";
                    }
                    if (filterModel.insuredName !== undefined) {
                        searchDataObj.insuredName = filterModel.insuredName.filter;
                    }
                    if (filterModel.claimPolicyID !== undefined) {
                        searchDataObj.policyID = filterModel.claimPolicyID.filter;
                    }
                    /*if (filterModel.genReCompanyName !== undefined) {
                        searchDataObj.g2LegalEntity = filterModel.genReCompanyName.filter;
                    }*/
                    if (filterModel.dateReceived !== undefined) {
                        searchDataObj.dateReceived = new Date(filterModel.dateReceived.dateFrom).toISOString();
                    }
                    if (filterModel.claimType !== undefined) {
                        searchDataObj.claimTypeText = filterModel.claimType.values.toString();
                    }
                    /*                    if (filterModel.subCategory !== undefined) {
                                            searchDataObj.subCategory = filterModel.subCategory.filter;
                                        }*/
                    if (filterModel.statusText !== undefined) {
                        searchDataObj.fALClaimStatusTypeIDs = JSON.stringify(filterModel.statusText.values).replace('"Closed"', "2").replace('"New"', "0").replace('"Assigned"', "1").replace('"Error"', "27").replace("[", "").replace("]", "");
                    }
                    else {
                        searchDataObj.fALClaimStatusTypeIDs = "0,1,2,27";
                    }
                    if (filterModel.claimExaminerFullName !== undefined) {
                        var userIds = [];
                        var filters = users.filter(x => {
                            if (filterModel.claimExaminerFullName.values.includes(x.fullName)) {
                                userIds.push(x.userID);
                                return x.userID;
                            }
                        });
                        searchDataObj.claimExaminerID = userIds.toString();
                        if ((sortCount > 0 || filterCount > 0) && (selectedView === undefined || (selectedView !== undefined && selectedView.isDefault && selectedView.isSystem))) {
                            searchDataObj.claimExaminerID = searchDataObj.claimExaminerID + ',NULL'
                        }
                    }
                }
                if (sortCount > 0) {
                    const ceColumn = getColumn(columnApi, 'claimExaminerFullName');
                    if (ensureNonEmptyString(ceColumn?.sort)) {
                        searchDataObj.orderBy = "ClaimExaminerID " + ceColumn.sort;
                    }
                    else {
                        const sortedCol = getSortedColumns(columnApi)[0];
                        searchDataObj.orderBy = sortedCol.colId + " " + sortedCol.sort;
                    }
                }
                /*if (localStorage.getItem("userDefaultCompany")) {
                    searchDataObj.g2LegalEntity = localStorage.getItem("userDefaultCompany") == LEGAL_ENTITY.GENERAL_STAR ? "General Star" : "Genesis";
                } else {
                    searchDataObj.g2LegalEntity = $auth.defaultCompany.G2LegalEntityID === LEGAL_ENTITY.GENERAL_STAR ? "General Star" : "Genesis";
                }*/
                const ClaimGridData = await loadClaimGridData(claimSearch, searchDataObj);
                let claims = {};
                claims = ClaimGridData.data.claimSearch.claimsMasterSearchResult;
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

        //let sortData = JSON.stringify(params.api.getSortModel());
        //localStorage.setItem(sortDataKey, sortData);
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
        //let filterData = JSON.stringify(params.api.getFilterModel());
        //localStorage.setItem(filterDataKey, filterData);

        let filterData = params.api.getFilterModel();
        if (selectedView.isSystem === true && selectedView.isDefault === true && landingPage === "ClaimsLandingPage") {
            filterData.statusText = { "values": ["New"], "filterType": "set" };
            filterData.claimExaminerFullName = { "values": [$auth.currentUser.fullName], "filterType": "set" };
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
    const createdClaimFunction = (value) => {
        if (value) {
            //loaduserGridData();
        }
    };
    React.useEffect(() => {
        $dispatch(companiesActions.get());

        localStorage.removeItem(columnDataKey);
        localStorage.removeItem(sortDataKey);
        localStorage.removeItem(filterDataKey);
        localStorage.removeItem("userDefaultCompany");

        Promise.all([
            getDJClaimID(),
            CaraUrls(),
            loadUsers()
        ])
            .then(([dj, ce, lu]) => {
                console.log(dj);
                setCARAClaimFileURL(ce[4]);
                setCARAUWFileURL(ce[1]);
                setUsers(lu.data.users);
            });

    }, []);
     return (
      <>
            { isAuthorize ? (
                <ClaimLandingContainer>
                    <ClaimLandingToolbar>
                         <Toolbuttons>

                             <Title style={{ marginLeft: '55em' }}>WC Dashboard</Title>
                         </Toolbuttons>
                        <HeaderSwitchToolbar>
                        {/*    {$auth.userCompanies.length > 1 ?*/}
                        {/*        <FormGroup>*/}
                        {/*            <FormControlLabel control={<Switch checked={otherCompany} onChange={handleCompanySwitchChange} />} label={`Switch to ${$auth.defaultCompany.G2LegalEntityID === LEGAL_ENTITY.GENERAL_STAR ? "Genesis" : "General Star"}`} />*/}
                        {/*        </FormGroup> : null}*/}
                            <IconButton
                                color="inherit"
                                aria-label="open drawer"
                                onClick={handleDrawerOpen}
                            >  
                                <MenuIcon />
                            </IconButton>
                        </HeaderSwitchToolbar>
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
                                    onColumnMoved={onColumnMoved}
                                    onColumnVisible={onColumnMoved}
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
                    { users?.length > 0 ? (
                    <DashboardUserGridViews open={open} handleDrawerClose={handleDrawerClose} setData={setDataOfMetadata} userGridViewFunction={userGridViewFunction} gridApi={gridApi} landingPage={landingPage} columnApi={columnApi} />
                    ) : null
                    }
                </ClaimLandingContainer >
            )
                : <Unauthorized />}
     </>
    );
}