import React from 'react';
import {
    AgGridReact
} from 'ag-grid-react';



import { loadAllNotificationGridData } from './../Query/loadNotificationGridData';
import { formatDate } from '../../../Core/Forms/Common';
import NotificationDescriptionRenderer from './NotificationDescriptionRenderer';
import ReminderDateRenderer from './ReminderDateRenderer';
import {
    loadUsers
} from '../../../Core/Services/EntityGateway';
import { useSelector } from 'react-redux';
import { notificationActionLog } from '../Query/notificationActionLog';
import { claimActions, claimSelectors } from '../../../Core/State/slices/claim';
import { PreTrailMemoActions, PreTrailMemoSelectors } from '../../../Core/State/slices/PreTrailMemo';
import { ASYNC_STATES } from '../../../Core/Enumerations/redux/async-states';
import { NotificationDrawer } from './NotificationDrawer';
import { useDispatch } from 'react-redux';

import { ClaimLandingContainer, ClaimLandingHeader, GridContainer } from "./CreateNotification/FieldContainer";

let gridApi;
let columnApi;
export const AllNotifications = ({claim}) => {
    const [NotificationdrawerOpen, setNotificationdrawerOpen] = React.useState(false);
    const claimData = useSelector(claimSelectors.selectData()); 
    const preTrialMemoLoaded = useSelector(PreTrailMemoSelectors.selectLoading());
    const $dispatch = useDispatch();
    const [state, setState] = React.useState({
        loaded: false,
        data: [],
        users: [],
    });
    const [createOpen, setCreateOpen] = React.useState(false);

    const notificationActitonLogListData = async (params) => {
        try {
            let notificationActionLogList = await notificationActionLog(params.data.notificationID);
            notificationActionLogList.data.notificationActionLog.sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate));
            return notificationActionLogList.data.notificationActionLog;
        } catch (e) {
            console.log(toString(e));
        }
    }
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
    const detailCellRendererParams = {
        detailGridOptions: {
            columnDefs: [
                {
                    field: 'statusCode',
                    headerName: 'Status',
                    cellRenderer: function (params) {                       
                        return params.value === 'N' ? 'New' : 'Read';                       
                    }
                },
                {
                    field: 'networkID',
                    headerName: 'Name',
                    cellRenderer: function (params) {
                        return params.data.firstName + " " + params.data.lastName;
                    }
                },
                {
                    headerName: 'Reminder Date',
                    field: 'reminderDate',
                    filter: "agDateColumnFilter",
                    cellRenderer: function (params) {
                        return formatDate(params.value);
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
                    },
                },
            ],
            defaultColDef: { flex: 1, resizable: true, autoHeight:true},
        },
        getDetailRowData: function (params) {
            Promise.all([
                notificationActitonLogListData(params)
            ]).then(([pc]) => {
                params.successCallback(pc);
            });
        },
    };
    const colDefs = [
        {
            headerName: 'Created Date',
            field: 'createdDate',
            filter: "agDateColumnFilter",
            tooltipField: "Date Created",
            width: 120,
            valueGetter: function (params) {
                return formatDate(params.data.createdDate);
            },
            cellRenderer: 'agGroupCellRenderer',
            sort: 'desc'
        },
        {
            headerName: 'Created By',
            field: 'createdBy',
            width: 120,
            filter: "agSetColumnFilter",
            sortable: true,
            cellRenderer: function (params) {
                let selected_users = ((state.users.data || {}).users || []).filter(x => x.userID.toLowerCase() === params.data.createdBy.toLowerCase());
                if (selected_users.length > 0) {
                    return selected_users[0].fullName;
                }
                else {
                    return '';
                }
            },
            filterParams: {
                values: ((state.users.data || {}).users || []).map(x => x.fullName),
                suppressAndOrCondition: true
            }
        },
        {
            headerName: 'Priority',
            field: 'isHighPriority',
            filter: "agSetColumnFilter",
            width: 120,
            sortable: true,
            cellRenderer: function (params) {
                return params.value === true ? 'High' : 'Low';
            },
            filterParams: {
                values: ["High", "Low"],
                suppressAndOrCondition: true
            }
        },
        {
            headerName: 'Type',
            field: 'typeCode',
            width:120,
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
            field: 'taskTypeId',
            colId: 'taskTypeId',
            width: 150,
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
            filter: "agTextColumnFilter",
            width: 350,
            floatingFilterComponentParams: { suppressFilterButton: true }
        },
        {
            headerName: 'Notification Body',
            field: 'body',
            filter: "agTextColumnFilter",
            autoHeight: true,
            width: 600,
            cellRenderer: 'NotificationDescriptionRenderer',
            floatingFilterComponentParams: { suppressFilterButton: true }
        },
        
    ];

    const frameworkComponents = {
        NotificationDescriptionRenderer: NotificationDescriptionRenderer,
        RemindeDateRenderer: ReminderDateRenderer,
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
    }
    
    const defaultColDef = {
        cellClass: 'cell-wrap-text',
        cellStyle: { 'white-space': 'normal' },
        sortable: false,
        //editable: true,
        resizable: true,
        floatingFilter: true,
        height: 30,
        rowHeight:100
    };

    const checkUrlFlag = () => {
        if (window.location.href.indexOf("notifications") > -1) {
        }

        else if (window.location.href.indexOf("Claim") > -1) {
        }
    }
 
    React.useEffect(() => {
        Promise.all([
            loadUsers()
        ])
            .then(([lu]) => {
                setState({
                    loaded: true,
                    users: (lu || []),
                });
            });
        checkUrlFlag();
    }, [createOpen]);

    const onGridReady = (params) => {
        gridApi = params.api;
        columnApi = params.columnApi;
        setGroupHeight(70);
        var datasource = ServerSideDatasource();
        gridApi.setServerSideDatasource(datasource);
    };

    function ServerSideDatasource() {
        return {
            getRows: async function (params) {

                let filterModel = gridApi.getFilterModel();
                let filterCount = Object.keys(gridApi.getFilterModel()).length;
                let searchDataObj = {
                    "pageNumber": params.request.endRow / 50,
                    "pageSize": 50,
                };
                if (claim !== null && claim  !== undefined) {
                    searchDataObj.claimMasterID = claim.claimMasterID;
                }

                if (filterCount > 0) {
                    if (filterModel.createdDate  !== undefined) {
                        searchDataObj.createdDate = filterModel.createdDate.dateFrom;
                    }
                    if (filterModel.reminderDate  !== undefined) {
                        searchDataObj.reminderDate = filterModel.reminderDate.dateFrom;
                    }
                    if (filterModel.createdBy  !== undefined) {
                        var userIds = [];
                        var filters = ((state.users.data || {}).users || []).filter(x => {
                            if (filterModel.createdBy.values.includes(x.fullName)) {
                                userIds.push(x.userID);
                                return x.userID;
                            }
                        })
                        searchDataObj.createdBy = userIds.toString();
                    }
                    if (filterModel.isHighPriority  !== undefined) {
                        searchDataObj.isHighPriority = JSON.stringify(filterModel.isHighPriority.values).replace("[", "").replace("]", "") === '"Low"' ? 'false' : 'true';
                    }
                    if (filterModel.typeCode  !== undefined) {
                        let value = filterModel.typeCode.values.toString();
                        searchDataObj.typeCode = value.replace("Task", "T").replace("Message", "M").replace("Alert", "A").replace("Diary", "D");
                    }
                    if (filterModel.taskTypeId  !== undefined) {
                        let value = filterModel.taskTypeId.values.toString();
                        searchDataObj.taskTypeID = parseInt(value.replace("General", '1').replace("Pre Trial Memo", '3'));
                    }
                    if (filterModel.title  !== undefined) {
                        searchDataObj.title = filterModel.title.filter;
                    }
                    if (filterModel.body  !== undefined) {
                        searchDataObj.body = filterModel.body.filter;
                    }
                    if (filterModel.statusCode  !== undefined) {
                        searchDataObj.statusCode = JSON.stringify(filterModel.statusCode.values).replace('"New"', "N").replace('"Read"', "R").replace("[", "").replace("]", "");
                    }
                }
/*                if (sortCount > 0) {
                    searchDataObj.orderBy = gridApi.getSortModel()[0].colId + " " + gridApi.getSortModel()[0].sort;
                }*/
                let notifications = await loadAllNotificationGridData(searchDataObj);

                if (notifications !== null && notifications  !== undefined) {
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


    if (state.loaded !== true) {
        return <div>Loading grid...</div>;
    }
    const setGroupHeight = height => {
        var rows = [];
        gridApi.forEachNode(function (row) {
            rows.push(row.id);
        });
        gridApi.resetRowHeights(rows,height);;
    }


    return (
        <ClaimLandingContainer>
            <ClaimLandingHeader>
                <GridContainer className="ag-theme-balham">
                    <AgGridReact
                        defaultColDef={defaultColDef}
                        columnDefs={colDefs}
                        onGridReady={onGridReady}
                        floatingFilter
                        rowSelection="multiple"
                        frameworkComponents={frameworkComponents}
                        masterDetail={(claim !== null && claim  !== undefined)? true:false}
                        detailCellRendererParams={detailCellRendererParams}
                        pagination={true}
                        paginationPageSize={50}
                        rowModelType={'serverSide'}
                        serverSideStoreType={'partial'}
                        cacheBlockSize={50}
                        animateRows={true}
                    >
                    </AgGridReact>
                </GridContainer>
                <NotificationDrawer claim={claim ? claim : claimData} isOpen={NotificationdrawerOpen} close={setclose} />
            </ClaimLandingHeader>
        </ClaimLandingContainer>
    );
};