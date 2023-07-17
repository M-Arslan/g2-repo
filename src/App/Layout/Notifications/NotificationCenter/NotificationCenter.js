import {
    Menu as MenuIcon, PostAdd,
    StarBorder
} from '@mui/icons-material';
import {
    IconButton, List,
    ListItem,
    ListItemIcon, ListItemText
} from '@mui/material';
import {
    makeStyles
} from '@mui/styles';



import {
    AgGridReact
} from 'ag-grid-react';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { APP_TYPES } from '../../../Core/Enumerations/app/app-types';
import { ASYNC_STATES } from '../../../Core/Enumerations/redux/async-states';
import { formatDate, Panel, PanelContent, PanelHeader } from '../../../Core/Forms/Common';
import {
    loadUsers
} from '../../../Core/Services/EntityGateway';
import { claimActions, claimSelectors } from '../../../Core/State/slices/claim';
import { litigationActions, litigationSelectors } from '../../../Core/State/slices/litigation';
import { PreTrailMemoActions, PreTrailMemoSelectors } from '../../../Core/State/slices/PreTrailMemo';
import { userSelectors } from '../../../Core/State/slices/user';
import { getSortedColumns } from '../../../Core/Utility/colStateUtils';
import { ensureNonEmptyString } from '../../../Core/Utility/rules';
import { DashboardUserGridViews } from '../../Dashboard/UserGridViews/DashboardUserGridViews';
import { loadNotificationGridData } from './../Query/loadNotificationGridData';
import { AllNotifications } from './AllNotifications';
import {
    CreateNotificationDrawer
} from './CreateNotification/Drawer';
import MarkAsReadRenderer from './MarkAsReadRenderer';
import NotificationDescriptionRenderer from './NotificationDescriptionRenderer';
import { NotificationDrawer } from './NotificationDrawer';
import ReminderDateRenderer from './ReminderDateRenderer';
import { ClaimLandingContainer, ClaimLandingToolbar, Toolbuttons, ClaimLandingHeader, ContentCell, ContentRow, ContentCellHalf, GridContainer, Title } from "./CreateNotification/FieldContainer";
import { CLAIM_TYPES } from '../../../Core/Enumerations/app/claim-type';
import { FAL_CLAIM_STATUS_TYPES } from '../../../Core/Enumerations/app/fal_claim-status-types';

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        maxWidth: 360,
        margin: '0px',
    },
}));

let gridApi;
let columnApi;
let selectedView;
const columnDataKey = "columnData";
const filterDataKey = "filterData";
const sortDataKey = "sortData";

export const NotificationCenter = ({ claim }) => {
    const landingPage = "MyNotificationCenter";
    const classes = useStyles();
    const [open, setViewOpen] = React.useState(false);
    const $auth = useSelector(userSelectors.selectAuthContext());
    const [allNotificationsCheck, setAllNotificationsCheck] = React.useState(false);
    const isViewer = (claim || {}).fALClaimStatusTypeID === FAL_CLAIM_STATUS_TYPES.CLOSED || (claim || {}).fALClaimStatusTypeID === FAL_CLAIM_STATUS_TYPES.ERROR|| $auth.isReadOnly(APP_TYPES.Notifications);
    const [createOpen, setCreateOpen] = React.useState(false);
    const [UrlOrClaim, setUrlOrClaim] = React.useState('claim');
    const [refresh, setRefresh] = React.useState(false);
    const [selectedMenu, setSelectedMenu] = React.useState('myNotifications');
    const [NotificationdrawerOpen, setNotificationdrawerOpen] = React.useState(false);
    const litigationData = useSelector(litigationSelectors.selectData());
    const pathName = window.location.pathname;
    const preTrialMemoLoaded = useSelector(PreTrailMemoSelectors.selectLoading());
    const claimData = useSelector(claimSelectors.selectData());
    const [state, setState] = React.useState({
        loaded: false,
        data: {},
    });
    const [users, setUsers] = React.useState({
        users: [],
    });
    const $dispatch = useDispatch();
    const onBtnClicked = (e) => {

        if (claim === null || claim === undefined) {
            $dispatch(claimActions.clearStatus());
            $dispatch(claimActions.get({ id: e.data.claimMasterID }))
        }
        if (e.data.taskTypeID === 3) {
            setNotificationdrawerOpen(true);
            $dispatch(PreTrailMemoActions.clearStatus());
            if (preTrialMemoLoaded === ASYNC_STATES.IDLE) {
                $dispatch(PreTrailMemoActions.get({ notificationID: e.data.notificationID }));
            }
        }
    }
    const setclose = () => {
        setNotificationdrawerOpen(false);
    }

    React.useEffect(() => {
        localStorage.removeItem(columnDataKey);
        localStorage.removeItem(sortDataKey);
        localStorage.removeItem(filterDataKey);

        Promise.all([
            loadUsers()
        ])
            .then(([lu]) => {
                setUsers({
                    users: lu.data.users,
                });
                setState({
                    loaded: true,
                });
            });
        checkUrlFlag();
    }, [createOpen, refresh]);

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

        },
        {
            headerName: 'Reminder Date',
            field: 'reminderDate',
            colId: 'reminderDate',
            filter: "agDateColumnFilter",
            cellRenderer: 'RemindeDateRenderer',
            getQuickFilterText: function (params) {
                return params.value;
            },
            width: 280,
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
                valueGetter: function getter(params) {
                    return params.value
                }
            },
        },
        {
            headerName: 'Created By',
            field: 'createdBy',
            colId: 'createdBy',
            width: 120,
            filter: "agSetColumnFilter",
            sortable: true,
            filterParams: {
                values: users?.users?.map(x => x.fullName),
                suppressAndOrCondition: true
            }
        },
        {
            headerName: 'Priority',
            field: 'isHighPriority',
            colId: 'isHighPriority',
            width: 80,
            cellRenderer: function (params) {
                return params.value === true ? 'High' : 'Low';
            },
            filterParams: {
                values: ["High", "Low"],
                suppressAndOrCondition: true
            },
            sortable: true,
        },
        {
            headerName: 'Type',
            field: 'typeCode',
            colId: 'typeCode',
            width: 80,
            filter: "agSetColumnFilter",
            valueFormatter: typeCodeValueFormatter,
            filterParams: {
                values: ["Task", "Message", "Alert", "Diary"],
                suppressAndOrCondition: true
            },
            sortable: true,
        },
        {
            headerName: 'TaskType',
            field: 'taskTypeID',
            colId: 'taskTypeID',
            width: 80,
            filter: "agSetColumnFilter",
            sortable: true,
            onCellClicked: onBtnClicked,
            cellRenderer: function (params) {
                if (params.data.taskTypeID === 1) {
                    return 'General';
                } else if (params.data.taskTypeID === 2) {
                    return 'Claim Suppport';
                } else if (params.data.taskTypeID === 3) {
                    return <a href="#">View Pre Trial Memo</a>;
                }
                return '';
            },
            filterParams: {
                values: ["General", "Pre Trial Memo"],
                suppressAndOrCondition: true
            }
        },
        {
            headerName: 'Notification Title',
            field: 'title',
            colId: 'title',
            filter: "agTextColumnFilter",
            floatingFilterComponentParams: { suppressFilterButton: true },
            wrapText: true,
            width: UrlOrClaim === 'claim' ? 250 : 350,
            valueGetter: function (params) {
                const claimID =  params.data ?  params?.data?.claimID : '';
                const title = params.data ? params?.data?.title : '';

                return `${(ensureNonEmptyString(claimID) ? `${ claimID } - ` : '')}${title}`;
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
            headerName: 'Mark as Read',
            field: "statusCode",
            colId: 'statusCode',
            filter: "agSetColumnFilter",
            sortable: true,
            width: 120,
            cellRenderer: 'childMessageRenderer',
            hide: !allNotificationsCheck ? false : true,
            filterParams: {
                values: ["New", "Read"],
                suppressAndOrCondition: true
            },
        },
        {
            headerName: 'Related URL',
            field: "relatedURL",
            colId: 'relatedURL',
            sortable: true,
            width: 120,
            filter: false,
            cellRenderer: function (params) {
                var urls;
                var claimurls;
                var legalclaimurls;

                if (params.data?.relatedURL !== '' && params.data?.relatedURL !== null) {
                    urls = <a href={params.data.relatedURL} target="_blank">URL</a>;
                }

                if ((params.data?.claimMasterID !== '' && params.data?.claimMasterID !== null) && (claim === '' || claim === undefined)) {
                    if (params.data?.claimType === CLAIM_TYPES.LEGAL) {
                        legalclaimurls = <a href={"/Legal/" + params.data.claimMasterID} target="_blank">Claim</a>;
                    }
                    else {
                        claimurls = <a href={"/Claim/" + params.data.claimMasterID} target="_blank">Claim</a>;
                    }
                }

                if (urls) {
                    let newClaimUrl = claimurls ? claimurls : legalclaimurls ? legalclaimurls : '';
                    return [urls, ' ||  ', newClaimUrl];
                } else {
                    return claimurls ? claimurls : legalclaimurls ? legalclaimurls : '';
                }

                return '';
            }
        }
    ];
    const frameworkComponents = {
        childMessageRenderer: MarkAsReadRenderer,
        RemindeDateRenderer: ReminderDateRenderer,
        NotificationDescriptionRenderer: NotificationDescriptionRenderer,
    };
    function typeCodeValueFormatter(params) {
        var value = params.value;
        if (value === 'T') {
            return "Task";
        }
        else if (value === 'M') {
            return "Message";
        }
        else if (value === 'A') {
            return "Alert";
        }
        else if (value === 'D') {
            return "Diary";
        }
    };
    

    const defaultColDef = {
        cellClass: 'cell-wrap-text',
        cellStyle: { 'white-space': 'normal' },
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
    const handleNotificationsCenterCheck = () => {
        setAllNotificationsCheck(false);
        setSelectedMenu('myNotifications')
    };
    const handleAllNotificationsCheck = () => {
        setAllNotificationsCheck(true);
        setSelectedMenu('allNotifications')
    };
    
    const { id } = useParams();
    React.useEffect(() => {
        if (pathName !== '/notifications') {  
            $dispatch(litigationActions.get({ claimMasterId: id }));
        }
    }, []); 
 


    const userGridViewFunction = (view) => {
        selectedView = view;
        setGridFilters();
        var datasource = ServerSideDatasource();
        gridApi.setServerSideDatasource(datasource);
    }

    const onGridReady = (params) => {
        gridApi = params.api;
        columnApi = params.columnApi;
        
    };

    function ServerSideDatasource() {
        return {
            getRows: async function (params) {
                let filterModel = gridApi.getFilterModel();
                let filterCount = Object.keys(gridApi.getFilterModel()).length;
                let sortCount = getSortedColumns(columnApi).length
                let searchDataObj = {
                    "pageNumber": params.request.endRow / 50,
                    "pageSize": 50,
                };
                if (claim !== null && claim !== undefined) {
                    searchDataObj.claimMasterID = claim.claimMasterID;
                }
                if (!allNotificationsCheck) {
                    searchDataObj.userID = $auth.currentUser.id;
                    searchDataObj.statusCode = "N";
                }

                if (filterCount > 0) {
                    if (filterModel.createdDate !== undefined) {
                        searchDataObj.createdDate = new Date(filterModel.createdDate.dateFrom).toISOString();
                    }

                    if (filterModel.reminderDate !== undefined) {
                        searchDataObj.reminderDate = new Date(filterModel.reminderDate.dateFrom).toISOString();
                    }
                    if (filterModel.isHighPriority !== undefined) {
                        searchDataObj.isHighPriority = JSON.stringify(filterModel.isHighPriority.values).replace("[", "").replace("]", "") === '"Low"' ? 'false' : 'true';
                    }
                    if (filterModel.typeCode !== undefined) {
                        let value = filterModel.typeCode.values.toString();
                        searchDataObj.typeCode = value.replace("Task", "T").replace("Message", "M").replace("Alert", "A").replace("Diary", "D");
                    }
                    if (filterModel.taskTypeID !== undefined) {
                        let value = filterModel.taskTypeID.values.toString();
                        searchDataObj.taskTypeID = parseInt(value.replace("General", '1').replace("Pre Trial Memo", '3'));
                    }
                    if (filterModel.title !== undefined) {
                        searchDataObj.title = filterModel.title.filter;
                    }
                    if (filterModel.body !== undefined) {
                        searchDataObj.body = filterModel.body.filter;
                    }
                    if (filterModel.claimID !== undefined) {
                        searchDataObj.claimID = filterModel.claimID.filter;
                    }
                    if (filterModel.createdBy !== undefined) {
                        var userIds = [];
                        var filters = users?.users?.filter(x => {
                            if (filterModel.createdBy.values.includes(x.fullName)) {
                                userIds.push(x.userID);
                                return x.userID;
                            }
                        })
                        searchDataObj.createdBy = userIds.toString();
                    }
                    if (filterModel.statusCode !== undefined) {
                        searchDataObj.statusCode = JSON.stringify(filterModel.statusCode.values).replace('"New"', "N").replace('"Read"', "R").replace("[", "").replace("]", "");
                    } else if ((claim || {}).claimMasterID) {
                        searchDataObj.statusCode = "N"
                    }
                }
                if (sortCount > 0) {
                    const sortCol = getSortedColumns(columnApi)[0];
                    searchDataObj.orderBy = sortCol.colId + " " + sortCol.sort;
                }
                let notifications = await loadNotificationGridData(searchDataObj);

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

    const onColumnMoved = (params) => {
        let columnData = JSON.stringify(params.columnApi.getColumnState());
        localStorage.setItem(columnDataKey, columnData);
    };

    const onSortChanged = (params) => {
        var colState = params.columnApi.getColumnState();
        var sortState = colState
            .filter(function (s) {
                return s.sort != null;
            })
            .map(function (s) {
                return { colId: s.colId, sort: s.sort, sortIndex: s.sortIndex };
            });
        localStorage.setItem(sortDataKey, JSON.stringify(sortState));
    };

    const onFilterChanged = (params) => {
        let filterData = params.api.getFilterModel();
        if (selectedView.isSystem === true && selectedView.isDefault === true) {
            filterData.taskOwner = { "values": [$auth.currentUser.fullName], "filterType": "set" };
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
    const setDataOfMetadata = (data) => {
       /* setMetadata(data);*/
    }
    const handleDrawerOpen = () => {
        setViewOpen(true);
    };

    const handleDrawerClose = () => {
        setViewOpen(false);
    };

    const handleShowCreateNotification = () => {
        setCreateOpen(true);
    };
    const refreshNotifications = () => {
        setRefresh(!refresh);
        setCreateOpen(false);
        var datasource = ServerSideDatasource();
        gridApi.setServerSideDatasource(datasource);
    }
    if (state.loaded !== true) {
        return <div>Loading grid...</div>;
    }
    return (
        <ClaimLandingContainer>
            <ClaimLandingToolbar>
                <Toolbuttons>
                        {isViewer !== true ?
                            <IconButton name="new" title="New Notification" onClick={handleShowCreateNotification}>
                                <PostAdd />
                            </IconButton>
                            : null}
                </Toolbuttons>
                <Title>Notifications Center</Title>      
                <Toolbuttons>
                    {UrlOrClaim !== "claim" ?
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            onClick={handleDrawerOpen}
                        >
                            <MenuIcon />
                    
                        </IconButton>
                    : null}
                </Toolbuttons>
            </ClaimLandingToolbar>
           
             <ClaimLandingHeader>
                <ContentRow>
                    <ContentCell style={{ width: UrlOrClaim === 'claim' ? '80%' : '100%' }}>
                            <Panel>
                            <PanelHeader>
                                {!allNotificationsCheck ? (
                                     UrlOrClaim === 'claim' ? (
                                        <span style={{ fontWeight: 'bold', fontSize: '14px' }}>My New Notifications</span>
                                    ) : <span style={{ fontWeight: 'bold', fontSize: '14px' }}>My Notifications</span>

                                    
                                ) : <span style={{ fontWeight: 'bold', fontSize: '14px' }}>All Notifications</span>
                                }
                            </PanelHeader>
                            {!allNotificationsCheck ? (
                                <PanelContent>
                                    <GridContainer className="ag-theme-balham">
                                        <AgGridReact
                                            rowHeight={80}
                                            defaultColDef={defaultColDef}
                                            frameworkComponents={frameworkComponents}
                                            columnDefs={colDefs}
                                            onGridReady={onGridReady}
                                            context={{
                                                refreshApp: refreshNotifications
                                            }}
                                            pagination={true}
                                            paginationPageSize={50}
                                            floatingFilter
                                            onFilterChanged={onFilterChanged}
                                            onSortChanged={onSortChanged}
                                            onColumnMoved={onColumnMoved}
                                            rowModelType={'serverSide'}
                                            serverSideStoreType={'partial'}
                                            cacheBlockSize={50}
                                            animateRows={true}
                                        >
                                        </AgGridReact>
                                    </GridContainer>
                                </PanelContent>
                            ) : (
                                    <PanelContent style={{ height: 500 }}>
                                        <GridContainer className="ag-theme-balham">
                                            <AllNotifications claim={claim} />
                                        </GridContainer>
                                    </PanelContent>
                                )}
                            </Panel>

                    </ContentCell>
                   
                    {UrlOrClaim === 'claim' ? (
                        <ContentCellHalf style={{ justifyContent: "flex-start", alignItems: "flex-start" }}>
                            <Panel padding="0" margin="0" border="0">
                                <PanelHeader><span style={{ fontWeight: 'bold', fontSize: '14px' }}>Notifications</span></PanelHeader>
                                <PanelContent>
                                    <List component="nav" className={classes.root}>
                                        <ListItem button onClick={handleNotificationsCenterCheck} selected={selectedMenu === 'myNotifications'}>
                                            <ListItemIcon>
                                                <StarBorder />
                                            </ListItemIcon>
                                            <ListItemText primary="My New Notifications" secondary="My New Notifications" />
                                        </ListItem>
                                        <ListItem button onClick={handleAllNotificationsCheck} selected={selectedMenu === 'allNotifications'}>
                                            <ListItemIcon>
                                                <StarBorder />
                                            </ListItemIcon>
                                            <ListItemText primary="All Notifications" secondary="All Notifications" />
                                        </ListItem>
                                    </List>
                                </PanelContent>
                            </Panel>
                        </ContentCellHalf>
                    ) : null} 
                </ContentRow >
                <NotificationDrawer claim={claim ? claim : claimData} isOpen={NotificationdrawerOpen} close={setclose} />
            </ClaimLandingHeader >
            <CreateNotificationDrawer litigationData={litigationData} isOpen={createOpen} claim={claim} onCloseDrawer={refreshNotifications} />
            {!allNotificationsCheck ? (<DashboardUserGridViews open={open} handleDrawerClose={handleDrawerClose} setData={setDataOfMetadata} userGridViewFunction={userGridViewFunction} gridApi={gridApi} landingPage={landingPage} columnApi={columnApi} />) : null}
        </ClaimLandingContainer>
    );
};

export default NotificationCenter;