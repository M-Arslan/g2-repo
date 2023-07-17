import React from 'react';
import styled from 'styled-components';
import {
    AgGridReact
} from 'ag-grid-react';



import { Panel, PanelContent, PanelHeader } from '../../../Core/Forms/Common';
import {
    loadUsers
} from '../../../Core/Services/EntityGateway';
import { Menu as MenuIcon } from '@mui/icons-material';
import { loadClaimSupportDashboard } from './../Query/loadNotificationGridData';
import { DashboardUserGridViews } from '../../Dashboard/UserGridViews/DashboardUserGridViews';
import { IconButton } from '@mui/material';
import {
    CreateNotificationDrawer
} from './../NotificationCenter/CreateNotification/Drawer';
import MarkAsReadRenderer from './../NotificationCenter/MarkAsReadRenderer';
import ReminderDateRenderer from './../NotificationCenter/ReminderDateRenderer';
import NotificationDescriptionRenderer from './../NotificationCenter/NotificationDescriptionRenderer';
import { formatDate } from '../../../Core/Forms/Common';
import { useDispatch, useSelector } from 'react-redux';
import { userSelectors } from '../../../Core/State/slices/user';
import { ClaimSupportApp } from '../../ClaimSupport/ClaimSupportApp';
import { claimActions, claimSelectors } from '../../../Core/State/slices/claim';
import { ASYNC_STATES } from '../../../Core/Enumerations/redux/async-states';
import { NotificationCommentsGetActions } from '../../../Core/State/slices/notificationComment';
import { usersActions } from '../../../Core/State/slices/users';
import { getSortedColumns } from '../../../Core/Utility/colStateUtils';
import { CLAIM_TYPES } from '../../../Core/Enumerations/app/claim-type';
import { CLAIM_STATUS_TYPE } from '../../../Core/Enumerations/app/claim-status-type';
import { ROLES } from '../../../Core/Enumerations/security/roles';

const ClaimLandingContainer = styled.div`
    height: 100%;
    width: 100%;
    margin: 0;
    padding: 0;
`;

const ClaimLandingToolbar = styled.div`
    background-color: ${props => props.theme.backgroundDark};
    height: 36px;
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

const ContentRow = styled.div`
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-start;
    align-items: top;
    align-content: top;
    height:100%;
`;

const ContentCell = styled.div`
    width: 80%;
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-start;
    align-items: top;
    align-content: top;
    padding: .5em;
`;

const Title = styled.div`
    display: flex;
    padding: 12px;
    font-weight: bold;
`;

const GridContainer = styled.div`
    height: 90%;
    width: 100%;
`;

let gridApi;
let columnApi;
let selectedView;
const columnDataKey = "columnData";
const filterDataKey = "filterData";
const sortDataKey = "sortData";
let landingPage = "ClaimSupportLandingPage";

export const ClaimSupportDashboard = ({ claim }) => {
    const $auth = useSelector(userSelectors.selectAuthContext());
    const [createOpen, setCreateOpen] = React.useState(false);
    const [UrlOrClaim, setUrlOrClaim] = React.useState('claim');
    const [showDetail, setShowDetail] = React.useState(false);
    const [NID, setNID] = React.useState(null);
    const [CID, setCID] = React.useState(null);
    const [policyID, setpolicyID] = React.useState('');
    const $dispatch = useDispatch();
    const claimLoaded = useSelector(claimSelectors.selectLoading());
    const [open, setOpen] = React.useState(false);
    const [reload, setReload] = React.useState(false);
    //const isClaimAssistant = $auth.isInRole(ROLES.Claims_Assistant);
    //const [metadata, setMetadata] = React.useState({
    //    viewName: "",
    //    setDefaultView: false,
    //    ddlSelectedView: "de4fce1a-9382-40d1-5fc2-08d89a8e89bc",
    //});
    const onBtnClicked = (e) => {
        setShowDetail(true);
        setNID(e.data?.notificationID);
        setCID(e.data?.claimMasterID);
        setpolicyID(e.data.policyID);
        let Cid = e.data?.claimMasterID;
        $dispatch(claimActions.clearStatus());
        if (Cid !== null && claimLoaded === ASYNC_STATES.IDLE) {
            $dispatch(claimActions.get({ id: Cid }));
        }
        $dispatch(NotificationCommentsGetActions.clearStatus());
    }

    const setDetail = (e) => {
        setShowDetail(false);
    }
    const [state, setState] = React.useState({
        loaded: false,
        data: {},
        users: {},
    });

    React.useEffect(() => {

        Promise.all([
            loadUsers()
        ])
            .then(([lu]) => {
                setState({
                    loaded: true,
                    users: (lu || [])
                });
            });
        checkUrlFlag();
    }, [createOpen]);

    React.useEffect(() => {
        $dispatch(usersActions.getAllUsers());
    }, []);



    const colDefs = [
        {
            headerName: 'Created Date',
            field: 'createdDate',
            colId: 'createdDate',
            filter: "agDateColumnFilter",
            tooltipField: "Date Created",
            width: 160,
            cellRenderer: function (params) {
                return formatDate(params.value);
            },
            sort: 'desc',
            filterParams: {
                comparator: function (filterLocalDateAtMidnight, cellValue) {
                    let dateAsString = cellValue;
                    if (dateAsString === null) return -1;
                    let dateParts = dateAsString.split("T")[0];
                    dateParts = dateParts.split("-");
                    let cellDate = new Date(Number(dateParts[0]), Number(dateParts[1]) - 1, Number(dateParts[2]));
                    if (filterLocalDateAtMidnight.getTime() === cellDate.getTime()) {
                        return 0;
                    }
                    if (cellDate < filterLocalDateAtMidnight) {
                        return -1;
                    }
                    if (cellDate > filterLocalDateAtMidnight) {
                        return 1;
                    }
                },
            },

        },
        {
            headerName: 'Claim Number',
            field: 'claimID',
            colId: 'claimID',
            width: 120,
            filter: "agTextColumnFilter",
            sortable: true,
            filterParams: {
                filterOptions: ['contains'],
                suppressAndOrCondition: true
            },
            valueGetter: function (params) {
                console.log("Checking params", params)
                return (!params?.data?.statutoryClaimID ? `${params?.data?.claimID}` : `${params?.data?.claimID}/${params?.data?.statutoryClaimID}`)
            },
        },
        {
            headerName: 'Policy Number',
            field: 'policyID',
            colId: 'policyID',
            width: 120,
            filter: "agTextColumnFilter",
            sortable: true,
            filterParams: {
                filterOptions: ['contains'],
                suppressAndOrCondition: true
            }
        },
        {
            headerName: 'Claim Support Status',
            field: 'claimStatusTypeID',
            colId: 'claimStatusTypeID',
            width: 180,
            filter: "agSetColumnFilter",
            sortable: true,
            cellRenderer: supportTypeStatusFormatter,
            filterParams: {
                values: ["New", "In Progress", "Void", "Completed"],
                suppressAndOrCondition: true
            },
        },
        {
            headerName: 'Insured Name',
            field: 'insuredName',
            colId: 'insuredName',
            width: 160,
            filter: "agTextColumnFilter",
            sortable: true,
            filterParams: {
                filterOptions: ['contains'],
                suppressAndOrCondition: true
            }
        },
        {
            headerName: 'Created By',
            field: 'createdBy',
            colId: 'createdBy',
            width: 120,
            filter: "agSetColumnFilter",
            sortable: true,
            filterParams: {
                values: state?.users?.data?.users.map(x => x.fullName),
                suppressAndOrCondition: true
            },
            valueGetter: function (params) {
                let selected_users = ((state?.users?.data || {}).users || []).filter(x => x?.userID.toLowerCase() === params.data?.createdBy?.toLowerCase());
                if (selected_users.length > 0) {
                    return selected_users[0].fullName;
                }
            }

        },
        {
            headerName: 'Task Owner',
            field: 'modifiedBy',
            colId: 'modifiedBy',
            filter: "agSetColumnFilter",
            width: 160,
            sortable: true,
            filterParams: {
                values: state?.users?.data?.users.map(x => x.fullName),
                suppressAndOrCondition: true
            },
            valueGetter: function (params) {
                let selected_users = ((state.users.data || {}).users || []).filter(x => x.userID.toLowerCase() === params?.data?.modifiedBy?.toLowerCase());
                if (selected_users.length > 0) {
                    return selected_users[0].fullName;
                }
            }

        },
        {
            headerName: 'Priority',
            field: 'isHighPriority',
            colId: 'isHighPriority',
            filter: "agSetColumnFilter",
            width: 100,
            sortable: true,
            valueFormatter: priorityValueFormatter,
            filterParams: {
                values: ["High", "Low"],
                suppressAndOrCondition: true
            },
        },
        {
            headerName: 'Support Type',
            field: 'supportTypeID',
            colId: 'supportTypeID',
            width: 150,
            filter: "agSetColumnFilter",
            valueFormatter: tasktTypeIDValueFormatter,
            filterParams: {
                values: ["Claim Acknowledgment", "Claim Communication", "Policy Request", "Certified Policy", "File Request"],
                suppressAndOrCondition: true
            },
            sortable: true,
            cellRenderer: supportTypeFormatter
        },
        /*        {
                    headerName: 'Task Type',
                    field: 'tasktTypeID',
                    colId: 'tasktTypeID',
                    width: 80,
                    filter: "agSetColumnFilter",x
                    valueFormatter: tasktTypeIDValueFormatter,
                    filterParams: {
                        values: ["General", "Claims Support", "Pre-Trial Memo"],
                        suppressAndOrCondition: true
                    },
                    sortable: true,
                },*/
        {
            headerName: 'Notification Title',
            field: 'title',
            colId: 'title',
            filter: "agTextColumnFilter",
            floatingFilterComponentParams: { suppressFilterButton: true },
            wrapText: true,
            onCellClicked: onBtnClicked,
            width: UrlOrClaim === 'claim' ? 250 : 350,
            cellRenderer: function (params) {
                var btn = params.value;
                return btn;
            }
        },
        {
            headerName: 'Notification Body',
            field: 'body',
            colId: 'body',
            filter: "agTextColumnFilter",
            width: UrlOrClaim === 'claim' ? 250 : 500,
            cellRenderer: 'NotificationDescriptionRenderer',
            floatingFilterComponentParams: { suppressFilterButton: true }
        },
        {
            headerName: 'Related URL',
            field: "relatedURL",
            colId: 'relatedURL',
            sortable: true,
            width: 120,
            filter: false,
            cellRenderer: function (params) {
                var urls = [];
                if (params.data?.relatedURL !== '' && params.data?.relatedURL !== null) {
                    urls.push(<a href={`${params?.data?.relatedURL}`} target="_blank">URL</a>);
                }
                if ((params.data.relatedURL !== '' && params.data?.relatedURL !== null && params.data?.claimMasterID !== null) && (claim === '' || claim === undefined)) {
                    urls.push(<span>&nbsp;||&nbsp;</span>);
                }
                if ((params.data?.claimMasterID !== '' && params.data?.claimMasterID !== null) && (claim === '' || claim === undefined)) {
                    if (params.data?.claimType === CLAIM_TYPES.LEGAL) {
                        urls.push(<a href={`/Legal/${params?.data?.claimMasterID}`} target="_blank">Claim</a>);
                    }
                    else {
                        urls.push(<a href={`/Claim/${params?.data?.claimMasterID}`} target="_blank">Claim</a>);
                    }
                }
                return urls;
            }
        },
        {
            headerName: 'Modified Date',
            field: 'modifiedDate',
            colId: 'modifiedDate',
            width: 120,
            filter: "agDateColumnFilter",
            sortable: true,
            cellRenderer: function (params) {
                return formatDate(params.value);
            },
        },
       
    ];
    const frameworkComponents = {
        childMessageRenderer: MarkAsReadRenderer,
        RemindeDateRenderer: ReminderDateRenderer,
        NotificationDescriptionRenderer: NotificationDescriptionRenderer,
    };
    function supportTypeFormatter(params) {
        var value = params.value;
        if (value === '1') {
            return "Claim Acknowledgment";
        }
        else if (value === '2') {
            return "Claim Communication";
        }
        else if (value === '3') {
            return "Certified Policy";
        }
        else if (value === '4') {
            return "Policy Request";
        }
        else if (value === '5') {
            return "File Request";
        }
        else {
            return "";
        }
    }
    function supportTypeStatusFormatter(params) {
        var value = params.value;
        if (value === '28') {
            return "New";
        }
        else if (value === '29') {
            return "In Progress";
        }
        else if (value === '30') {
            return "Void";
        }
        else if (value === '31') {
            return "Completed";
        }
        else {
            return "";
        }
    }
    function tasktTypeIDValueFormatter(params) {
        var value = params.value;
        if (value === '1') {
            return "General";
        }
        else if (value === '2') {
            return "Claims Support";
        }
        else if (value === '3') {
            return "Pre-Trial Memo";
        }
        else {
            return "";
        }
    };

    function priorityValueFormatter(params) {
        return params.value === "true" ? 'High' : 'Low';
    }
    const defaultColDef = {
        autoHeight: true,
        autoWidth: true,
        sortable: true,
        resizable: true,
        filter: true,
        floatingFilter: true,
    };

    const checkUrlFlag = () => {
        if (claim !== null && claim !== undefined) {
            setUrlOrClaim('claim');
        }
        else {
            setUrlOrClaim('url');
        }
    };

    const onGridReady = (params) => {
        gridApi = params.api;
        columnApi = params.columnApi;
        setReload(!reload);
        $dispatch(claimActions.clearStatus());
    };

    const userGridViewFunction = (view) => {
        selectedView = view;
        setGridFilters();
        var datasource = ServerSideDatasource();
        gridApi.setServerSideDatasource(datasource);
    }

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
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
    };
    const onFilterChanged = (params) => {
        //let filterData = JSON.stringify(params.api.getFilterModel());
        //localStorage.setItem(filterDataKey, filterData);

        let filterData = params.api.getFilterModel();
        if (selectedView.isSystem === true && selectedView.isDefault === true && landingPage === "ClaimsLandingPage") {
            filterData.statusText = { "values": ["New"], "filterType": "set" };
        }
        filterData = JSON.stringify(filterData);
        localStorage.setItem(filterDataKey, filterData);
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
                };
                if (claim !== null && claim !== undefined) {
                    searchDataObj.claimMasterID = claim.claimMasterID;
                }


                if (sortCount === 0 && filterCount === 0 && (selectedView === undefined || (selectedView !== undefined && selectedView.isDefault && selectedView.isSystem))) {
                    searchDataObj = {
                        "userID": $auth.currentUser.id,
                        "pageNumber": params.request.endRow / 50,
                        "pageSize": 50
                    };
                }
                if ((sortCount > 0 || filterCount > 0) && (selectedView === undefined || (selectedView !== undefined && selectedView.isDefault && selectedView.isSystem))) {
                    filterModel.userID = { "values": [$auth.currentUser.fullName], "filterType": "set" };
                }
                if (filterCount > 0) {
                    if (filterModel.reminderDate !== undefined) {
                        searchDataObj.reminderDate = new Date(filterModel.reminderDate.dateFrom).toISOString();
                    }
                    if (filterModel.createdBy !== undefined) {
                        var userIds = [];
                        var filters = ((state.users.data || {}).users || []).filter(x => {
                            if (filterModel.createdBy.values.includes(x.fullName)) {
                                userIds.push(x.userID);
                                return x.userID;
                            }
                        })
                        searchDataObj.createdBy = userIds.toString();
                    }
                    if (filterModel.modifiedBy !== undefined) {
                        var userIds = [];
                        var filters = ((state.users.data || {}).users || []).filter(x => {
                            if (filterModel.modifiedBy.values.includes(x.fullName)) {
                                userIds.push(x.userID);
                                return x.userID;
                            }
                        })
                        searchDataObj.modifiedBy = userIds.toString();
                    }
                    if (filterModel.claimID !== undefined) {
                        searchDataObj.claimID = filterModel.claimID.filter;
                    }
                    if (filterModel.isHighPriority !== undefined) {
                          searchDataObj.isHighPriority = JSON.stringify(filterModel.isHighPriority.values).replace("[", "").replace("]", "") === '"Low"' ? 'false' : 'true';
                    }
                    if (filterModel.typeCode !== undefined) {
                        searchDataObj.typeCode = filterModel.typeCode.filter;
                    }
                    if (filterModel.policyID !== undefined) {
                        searchDataObj.policyID = filterModel.policyID.filter;
                    }
                    if (filterModel.supportTypeID !== undefined) {
                        searchDataObj.supportTypeID = JSON.stringify(filterModel.supportTypeID.values).replace('"File Request"', "5").replace('"Policy Request"', "4").replace('"Certified Policy"', "3").replace('"Claim Communication"', "2").replace('"Claim Acknowledgment"', "1").replace("[", "").replace("]", "");
                    }
                    if (filterModel.title !== undefined) {
                        searchDataObj.title = filterModel.title.filter;
                    }
                    if (filterModel.body !== undefined) {
                        searchDataObj.body = filterModel.body.filter;
                    }
                    if (filterModel.createdDate !== undefined) {
                        searchDataObj.createdDate = new Date(filterModel.createdDate.dateFrom).toISOString();
                    }
                    if (filterModel.modifiedDate !== undefined) {
                        searchDataObj.modifiedDate = new Date(filterModel.modifiedDate.dateFrom).toISOString();
                    }
                    if (filterModel.insuredName !== undefined) {
                        searchDataObj.insuredName = filterModel.insuredName.filter;
                    }
                    if (filterModel.claimStatusTypeID !== undefined) {
                        searchDataObj.statusCode = JSON.stringify(filterModel.claimStatusTypeID.values).replace('"New"', CLAIM_STATUS_TYPE.NEW_PI_3.toString()).replace('"In Progress"', CLAIM_STATUS_TYPE.IN_PROGRESS_PI_3.toString()).replace('"Void"', CLAIM_STATUS_TYPE.VOID_PI_3.toString()).replace('"Completed"', CLAIM_STATUS_TYPE.COMPLETED_PI_3.toString()).replace("[", "").replace("]", "");

                    }
                } 
                if (sortCount > 0) {
                    const sortedCol = getSortedColumns(columnApi)[0];
                    searchDataObj.orderBy = sortedCol.colId + " " + sortedCol.sort;
                }
                let notifications = await loadClaimSupportDashboard(searchDataObj);

                if (notifications !== null && notifications !== undefined) {
                    var totalRows = -1;
                    if (notifications.length < 50) {
                        totalRows = params.request.startRow + notifications.length;
                    }
                    params.successCallback(notifications, totalRows);
                }
                else {
                    params.successCallback([], totalRows);
                }

            },
        };
    };

    //const handleShowCreateNotification = () => {
    //    setCreateOpen(true);
    //};
    if (state.loaded !== true) {
        return <div>Loading grid...</div>;
    }
    return (
        <ClaimLandingContainer>
            {!showDetail && <ClaimLandingToolbar>
                <Toolbuttons>
                    {/*                        {isViewer !== true ?
                            <IconButton name="new" title="New Notification" onClick={handleShowCreateNotification}>
                                <PostAdd />
                            </IconButton>
                            : null}*/}
                </Toolbuttons>
                <Title>Claim Support Dashboard</Title>
                <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    onClick={handleDrawerOpen}
                >
                    <MenuIcon />
                </IconButton>
            </ClaimLandingToolbar>}

            {!showDetail && <ClaimLandingHeader>
                <ContentRow>
                    <ContentCell style={{ width: UrlOrClaim === 'claim' ? '80%' : '100%' }}>
                        <Panel>
                            <PanelHeader>
                                <span style={{ fontWeight: 'bold', fontSize: '14px' }}>Claim Support Dashboard</span>
                            </PanelHeader>
                            <PanelContent>
                                <GridContainer className="ag-theme-balham">
                                    <AgGridReact
                                        rowHeight={80}
                                        defaultColDef={defaultColDef}
                                        frameworkComponents={frameworkComponents}
                                        columnDefs={colDefs}
                                        onGridReady={onGridReady}
                                        onSortChanged={onSortChanged}
                                        onFilterChanged={onFilterChanged}
                                        onColumnMoved={onColumnMoved}
                                        pagination={true}
                                        paginationPageSize={50}
                                        floatingFilter
                                        rowModelType={'serverSide'}
                                        serverSideStoreType={'partial'}
                                        cacheBlockSize={50}
                                        animateRows={true}
                                        onRowClicked={onBtnClicked}
                                    >
                                    </AgGridReact>
                                </GridContainer>
                            </PanelContent>
                        </Panel>

                    </ContentCell>
                </ContentRow >
            </ClaimLandingHeader >}
            <CreateNotificationDrawer isOpen={createOpen} ClaimID={claim} onCloseDrawer={setCreateOpen} />
            <DashboardUserGridViews reload={reload} open={open} handleDrawerClose={handleDrawerClose} userGridViewFunction={userGridViewFunction} gridApi={gridApi} landingPage={landingPage} columnApi={columnApi} />

            {showDetail && <ClaimSupportApp users={state.users} claimMasterID={CID} NotificationID={NID} policy={policyID} handleDetail={setDetail} />}
        </ClaimLandingContainer>
    );
};