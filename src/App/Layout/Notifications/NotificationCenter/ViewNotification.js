


import { AgGridReact } from 'ag-grid-react';
import React from 'react';
import styled from 'styled-components';
import { formatDate, Panel } from '../../../Core/Forms/Common';
import { IconButton, ButtonGroup } from '@mui/material';
import {
    loadUsers
} from '../../../Core/Services/EntityGateway';
import {
    Link,
    useParams
} from 'react-router-dom';
import { ensureNonEmptyString } from '../../../Core/Utility/rules';
import MarkAsReadRenderer from './MarkAsReadRenderer';
import { ArrowBack, } from '@mui/icons-material';
import ReminderDateRenderer from './ReminderDateRenderer';
import NotificationDescriptionRenderer from './NotificationDescriptionRenderer';
import { useDispatch, useSelector } from 'react-redux';
import { claimSupportTypeSelectors, claimSupportTypeActions, } from '../../../Core/State/slices/claim-support';
import { PreTrailMemoActions, PreTrailMemoSelectors } from '../../../Core/State/slices/PreTrailMemo';
import { NotificationDrawer } from './NotificationDrawer';
import { ASYNC_STATES } from '../../../Core/Enumerations/redux/async-states';
import { claimSelectors, claimActions } from '../../../Core/State/slices/claim';
import { CLAIM_TYPES } from '../../../Core/Enumerations/app/claim-type';



const Toolbar = styled.nav`
    width: 100%;
    height: auto;
    padding: 0;
    margin: 0;
    border: 0;
    border-top: solid 1px rgb(170, 170, 170);
    border-bottom: solid 1px rgb(170, 170, 170);
    background-color: ${props => props.theme.backgroundDark};

    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    align-content: center;
    align-items: center;
`;
const GridContainer = styled.div`
    height: 500px;
    width: auto;
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
const Title = styled.div`
    display: flex;
    padding: 12px;
    font-weight: bold;
`;

export const  ViewNotification = ({ claim }) => {
    const [NotificationdrawerOpen, setNotificationdrawerOpen] = React.useState(false);
    const [hideBodyforPTM, sethideBodyforPTM] = React.useState(false);
    const [state, setState] = React.useState({
        loaded: false,
        data: [],
        reload: false,
        users:[]
    });
    const $dispatch = useDispatch();
    const { id } = useParams();
    const notificationData = useSelector(claimSupportTypeSelectors.selectData()) || [];
    const [clickChecker, setClickChecker] = React.useState(false);
    const preTrialMemoState = useSelector(PreTrailMemoSelectors.selectLoading());
    const claimData = useSelector(claimSelectors.selectData());

    React.useEffect(() => {
        if (preTrialMemoState === ASYNC_STATES.SUCCESS && clickChecker === true) {
            setNotificationdrawerOpen(true);
        }
    }, [preTrialMemoState]);

    React.useEffect(() => {
        if (notificationData && notificationData.taskTypeID === 3) {
            sethideBodyforPTM(true);
        }
    }, [notificationData]);
    
    React.useEffect(() => {
        loadMetaData();
        Promise.all([
            loadUsers()
        ])
            .then(([lu]) => {
                setState({
                    reload: true,
                    users: (lu || [])
                });
            });
    }, []);

    const onBtnClicked = (e) => {
        setClickChecker(true);
        if (claim === null || claim === undefined) {
            $dispatch(claimActions.clearStatus());
            $dispatch(claimActions.get({ id: e.data.claimMasterID }))
        }
        if (e.data.taskTypeID ===  3) {
            setNotificationdrawerOpen(true);
            $dispatch(PreTrailMemoActions.get({ notificationID: e.data.notificationID }));
        }
    }
    const setclose = () => {
        setNotificationdrawerOpen(false);
    }

    const defaultColDef = {
        cellClass: 'cell-wrap-text',
        cellStyle: { 'white-space': 'normal' },
        sortable: false,
        //editable: true,
        resizable: true,
    };
    function priorityValueFormatter(params) {
        if (params.value === true) {
            return 'High';
        }
        return 'Low';
    }
    function typeCodeValueFormatter(params) {
        var value = params?.value;
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
        return '';
    };

    const frameworkComponents = {
        childMessageRenderer: MarkAsReadRenderer,
        RemindeDateRenderer: ReminderDateRenderer,
        NotificationDescriptionRenderer: NotificationDescriptionRenderer,
    };



    async function loadMetaData() {
        try {
            $dispatch(claimSupportTypeActions.get({ notificationID: id }));
            
        } catch (e) {
            console.log(toString(e));
        }
    }

    const colDefsModified = [
        {
            headerName: 'Created Date',
            field: 'createdDate',
            colId: 'createdDate',
            filter: "agDateColumnFilter",
            tooltipField: "Date Created",
            width: 160,
            cellRenderer: function (params) {
                return params.value ? formatDate(params?.value) : '';
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
                    return '';
                },
            },

        },
        {
            headerName: 'Created By',
            field: 'createdBy',
            colId: 'createdBy',
            width: 120,
            filter: "agTextColumnFilter",
            sortable: true,
            valueGetter: function (params) {
                let selected_users = ((state.users.data || {}).users || []).filter(x => x.userID.toLowerCase() === params.data?.createdBy?.toLowerCase());
                if (selected_users.length > 0) {
                    return selected_users[0].fullName;
                } else {
                    return '';
                }
            }

        },
        {
            headerName: 'Priority',
            field: 'isHighPriority',
            colId: 'isHighPriority',
            filter: "agSetColumnFilter",
            width: 80,
            sortable: true,
            valueFormatter: priorityValueFormatter,
            filterParams: {
                values: ["High", "Low"],
                suppressAndOrCondition: true
            },
        },
        {
            headerName: 'Type',
            field: 'typeCode',
            colId: 'typeCode',
            width: 80,
            filter: "agSetColumnFilter",
            valueFormatter: typeCodeValueFormatter,
            filterParams: {
                values: ["Task", "Message", "Alert"],
                suppressAndOrCondition: true
            },
            sortable: true,
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
                        legalclaimurls = <a href={"/Legal/" + params.data.claimMasterID + "/notifications"} target="_blank">Claim</a>;
                    }
                    else {
                        claimurls = <a href={"/Claim/" + params.data.claimMasterID + "/notifications"} target="_blank">Claim</a>;
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
        },
                {
            headerName: 'Mark as Read',
            field: "statusCode",
            colId: 'statusCode',
            filter: "agSetColumnFilter",
            sortable: true,
            width: 120,
            cellRenderer: 'childMessageRenderer',
            filterParams: {
                values: ["New", "Read"],
                suppressAndOrCondition: true
            },
        },
        {
            headerName: 'Notification Title',
            field: 'title',
            colId: 'title',
            filter: "agTextColumnFilter",
            floatingFilterComponentParams: { suppressFilterButton: true },
            wrapText: true,
            width: 350,
            valueGetter: function (params) {
                const claimID = params.data ? params?.data?.claimID : '';
                const title = params.data ? params?.data?.title : '';

                return `${(ensureNonEmptyString(claimID) ? `${claimID} - ` : '')}${title}`;
            }
        },
        {
            headerName: 'Notification Body',
            field: 'body',
            colId: 'body',
            filter: "agTextColumnFilter",
            width: 500,
            hide: hideBodyforPTM,
            cellRenderer: 'NotificationDescriptionRenderer',
            floatingFilterComponentParams: { suppressFilterButton: true }
        }

    ];
    const colDefs = [
        {
            headerName: 'Created Date',
            field: 'createdDate',
            colId: 'createdDate',
            filter: "agDateColumnFilter",
            tooltipField: "Date Created",
            width: 160,
            cellRenderer: function (params) {
                return params.value ? formatDate(params?.value) : '';
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
                    return '';
                },
            },

        },
        {
            headerName: 'Created By',
            field: 'createdBy',
            colId: 'createdBy',
            width: 120,
            filter: "agTextColumnFilter",
            sortable: true,
            valueGetter: function (params) {
                let selected_users = ((state.users.data || {}).users || []).filter(x => x.userID.toLowerCase() === params.data?.createdBy?.toLowerCase());
                if (selected_users.length > 0) {
                    return selected_users[0].fullName;
                } else {
                    return '';
                }
            }

        },
        {
            headerName: 'Priority',
            field: 'isHighPriority',
            colId: 'isHighPriority',
            filter: "agSetColumnFilter",
            width: 80,
            sortable: true,
            valueFormatter: priorityValueFormatter,
            filterParams: {
                values: ["High", "Low"],
                suppressAndOrCondition: true
            },
        },
        {
            headerName: 'Type',
            field: 'typeCode',
            colId: 'typeCode',
            width: 80,
            filter: "agSetColumnFilter",
            valueFormatter: typeCodeValueFormatter,
            filterParams:  {
                values: ["Task", "Message", "Alert"],
                suppressAndOrCondition: true
            }, 
            sortable: true,
        },
        {
            headerName: 'TaskType',
            field: 'taskTypeId',
            colId: 'taskTypeId',
            width: 180,
            onCellClicked: onBtnClicked,
            filter: "agSetColumnFilter",
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
            sortable: true,
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
                        legalclaimurls = <a href={"/Legal/" + params.data.claimMasterID + "/notifications"}  target="_blank">Claim</a>;
                    }
                    else {
                        claimurls = <a href={"/Claim/" + params.data.claimMasterID + "/notifications"}  target="_blank">Claim</a>;
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
        },
        {
            headerName: 'Mark as Read',
            field: "statusCode",
            colId: 'statusCode',
            filter: "agSetColumnFilter",
            sortable: true,
            width: 120,
            cellRenderer: 'childMessageRenderer',
            filterParams: {
                values: ["New", "Read"],
                suppressAndOrCondition: true
            },
        },
        {
            headerName: 'Notification Title',
            field: 'title',
            colId: 'title',
            filter: "agTextColumnFilter",
            floatingFilterComponentParams: { suppressFilterButton: true },
            wrapText: true,
            width:  350,
            valueGetter: function (params) {
                const claimID = params.data ? params?.data?.claimID : '';
                const title = params.data ? params?.data?.title : '';

                return `${(ensureNonEmptyString(claimID) ? `${claimID} - ` : '')}${title}`;
            }
        },
        {
            headerName: 'Notification Body',
            field: 'body',
            colId: 'body',
            filter: "agTextColumnFilter",
            width: 500,
            hide: hideBodyforPTM,
            cellRenderer: 'NotificationDescriptionRenderer',
            floatingFilterComponentParams: { suppressFilterButton: true }
        },
           
    ];

    return (
        <Panel>
            <ClaimLandingToolbar>
                <Toolbar>
                    <ButtonGroup variant="text">
                        <Link to={"/notifications"}>
                            <IconButton name="Cancel" title="Go Back"><ArrowBack /></IconButton>
                        </Link>
                    </ButtonGroup>
                    <Title>Notifications Center</Title>
                    <Toolbuttons>

                    </Toolbuttons>
                </Toolbar>
                
            </ClaimLandingToolbar>
            <GridContainer className="ag-theme-balham">
                {(state.users.data || {})?.users?.length && notificationData.taskTypeID !== null ?
                    <AgGridReact
                        rowHeight={80}
                        columnDefs={colDefs}
                        rowData={notificationData ? [notificationData] : []}
                        pagination={true}
                        paginationPageSize={10}
                        defaultColDef={defaultColDef}
                        frameworkComponents={frameworkComponents}
                    >
                    </AgGridReact>
                    : (state.users.data || {})?.users?.length && notificationData.taskTypeID === null ?
                        <AgGridReact
                            rowHeight={80}
                            columnDefs={colDefsModified}
                            rowData={notificationData ? [notificationData] : []}
                            pagination={true}
                            paginationPageSize={10}
                            defaultColDef={defaultColDef}
                            frameworkComponents={frameworkComponents}
                        >
                        </AgGridReact>
                    : 'Loading...'}
            </GridContainer>
            <NotificationDrawer claim={claim ? claim : claimData} isOpen={NotificationdrawerOpen} close={setclose} />

        </Panel>
    );
};
