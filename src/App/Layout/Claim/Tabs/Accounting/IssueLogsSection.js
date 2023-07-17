import { Button, Divider, MenuItem } from '@mui/material';



import { AgGridReact } from 'ag-grid-react';
import { useSnackbar } from 'notistack';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { APP_TYPES } from '../../../../Core/Enumerations/app/app-types';
import { ROLES } from '../../../../Core/Enumerations/security/roles';
import { formatDate, Panel, PanelContent, PanelHeader, SelectList, Spinner, TextInput } from '../../../../Core/Forms/Common';
import { userSelectors } from '../../../../Core/State/slices/user';
import { usersActions, usersSelectors } from '../../../../Core/State/slices/users';
import { createNotification } from '../../../Notifications/Query/saveNotifications';
import IssueLogCommentRenderer from './IssueLogCommentRenderer';
import IssueLogSelectListRenderer from './IssueLogSelectListRenderer';
import { loadIssueTypeList } from './Queries';
import { loadIssueLogs } from './Queries/loadIssueLogs';
import { saveIssueLogs } from './Queries/saveIssueLogs';
import { CLAIM_TYPES } from '../../../../Core/Enumerations/app/claim-type';
import { FAL_CLAIM_STATUS_TYPES } from '../../../../Core/Enumerations/app/fal_claim-status-types';
import { CLAIM_STATUS_TYPE } from '../../../../Core/Enumerations/app/claim-status-type';


const GridContainer = styled.div`
    height: 90%;
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
    justify-content: flex-start;
    align-items: center;
    align-content: center;
    padding: 1em;
`;
export const IssueLogsSection = (({ claim, request, dispatch }) => {
    const { enqueueSnackbar } = useSnackbar();
    const $auth = useSelector(userSelectors.selectAuthContext());
    const users = useSelector(usersSelectors.selectData() || []);
    const $dispatch = useDispatch();

    const isClaimAccountant = $auth.isInRole(ROLES.Claims_Accountant);
    const [create, setCreate] = React.useState(false);
    const [issueCommentsError, setIssueCommentsError] = React.useState(false);
    const [issueTypeError, setIssueTypeError] = React.useState(false);
    const isViewer = (claim || {}).fALClaimStatusTypeID === FAL_CLAIM_STATUS_TYPES.CLOSED || claim.fALClaimStatusTypeID === FAL_CLAIM_STATUS_TYPES.ERROR || $auth.isReadOnly(APP_TYPES.Financials);
    const [state, setState] = React.useState({
        loaded: false,
        data: [],
        issueTypeTypes: [],
        issueTypeID: "",
        issueTypeText: "",
        comment: "",

    });
    const notifyUser = async () => {
        let selected_users = users?.filter(x => x.userID.toLowerCase() === claim.claimExaminerID.toLowerCase());
        let _notificationUsers = [];
        selected_users = selected_users?.filter(e => {
            _notificationUsers.push({ 'networkID': e.userID, "emailAddress": e.emailAddress, "firstName": e.firstName, "lastName": e.lastName, "reminderDate": null, "isCopyOnly": false, "statusCode": 'N' });
        });
        var claimOrLegal = '/Claim/';
        if (claim.claimType === CLAIM_TYPES.LEGAL) {
            claimOrLegal = '/Legal/'
        }
        const notificationRequest = {
            claimMasterID: claim.claimMasterID,
            typeCode: 'T',
            title: "Financials - Issue Log  Created",
            body: 'Financials - Issue Log Created',
            isHighPriority: false,
            roleID: null,
            notificationUsers: _notificationUsers,
            relatedURL: claimOrLegal + claim.claimMasterID + '/financials#Activity/' + request.currentClaimActivity.activityID
        }
        if (window.location.href.toLowerCase().indexOf("claimants") > -1) {
            notificationRequest.relatedURL = claimOrLegal + claim.claimMasterID + '/claimants#Activity/' + request.currentClaimActivity.activityID;
            notificationRequest.title = "File CIB - Issue Log  Created";
            notificationRequest.body = "File CIB - Issue Log  Created";

        } else if (window.location.href.toLowerCase().indexOf("pilr") > -1) {
            notificationRequest.relatedURL = claimOrLegal + claim.claimMasterID + '/pilr#Activity/' + request.currentClaimActivity.activityID;
            notificationRequest.title = "PILR - Issue Log  Created";
            notificationRequest.body = "PILR - Issue Log  Created";
        }
        const notificationResult = await createNotification(notificationRequest);
        ParseGQErrors(notificationResult.errors, notificationResult.error);
        enqueueSnackbar("Notification created successfully.", { variant: 'success', anchorOrigin: { vertical: 'top', horizontal: 'center' } });

    }

    const colDefs = [
        {
            headerName: 'Reported Date',
            field: 'createdDate',
            tooltipField: "Reported Date",
            sort: 'desc',
            valueGetter: function (params) {
                return formatDate(params.data.createdDate);
            }
        },
        {
            headerName: 'Logged By',
            field: 'createdBy',
            tooltipField: "Logged By",
            cellRenderer: function (params) {
                let selected_users = users?.filter(x => x.userID.toLowerCase() === params.data.createdBy.toLowerCase());
                if (selected_users?.length > 0) {
                    return selected_users[0].fullName;
                }
                return "";
            }
        },
        {
            headerName: 'Issue Type',
            field: 'issueType',
            tootltipField: 'Issue Type',
            cellrenderer: function (params) {
                let selected = ((state.issuetypetypes || {}) || []).filter(x => x.issuetypeid === params.data.issuetypeid);
                if (selected.length > 0) {
                    return selected[0].issuetypetext;
                }
            }
        },
        {
            headerName: 'Issue Status',
            field: 'claimStatusTypeID',
            tooltipField: "Status",
            editable: true,
            cellEditor: 'agRichSelectCellEditor',
            cellRenderer: 'IssueLogSelectListRenderer',
        },
        {
            headerName: 'Last Updated Status Date',
            tooltipField: "modifiedDate",
            valueGetter: function (params) {
                return formatDate(params.data.createdDate);
            }
        },
        {
            headerName: 'Issue Comments',
            field: 'comment',
            tooltipField: "Issue Comments",
            cellRenderer: 'IssueLogCommentRenderer',
            wrapText: true,
            width: 500,
            floatingFilterComponentParams: { suppressFilterButton: true }
        },



    ]

    const frameworkComponents = {
        IssueLogCommentRenderer: IssueLogCommentRenderer,
        IssueLogSelectListRenderer: IssueLogSelectListRenderer
    };

    const defaultColDef = {
        cellClass: 'cell-wrap-text',
        cellStyle: { 'white-space': 'normal' },
        sortable: false,
        resizable: true,
    };

    //function typeCodeValueFormatter(params) {
    //    var value = params.value;
    //    if (value === '3') {
    //        return "Open";
    //    }
    //    else if (value === '6') {
    //        return "Close";
    //    }
    //}
    function ParseGQErrors(errors, error) {
        if (error || errors) {
            console.log("An error occured: ", errors);
            console.log("An error occured: ", error);
            enqueueSnackbar("An error occured.", { variant: 'error',  anchorOrigin: { vertical: 'top', horizontal: 'center' } });
        }
    }

    function onCellValueChanged(event) {
        var issuelog = event.data;
        issuelog.claimStatusTypeID = event.data.claimStatusTypeID === 'Open' ? CLAIM_STATUS_TYPE.OPEN.toString() : CLAIM_STATUS_TYPE.CLOSED_PI_1.toString();
        saveIssueLogs(event.data);
    }
    const onClick = async () => {
        let error = false;
        if (state.comment === '') {
            setIssueCommentsError(true);
            error = true;
        }
        if (state.issueTypeID === '') {
            setIssueTypeError(true);
            error = true;
        }
        if (!state.comment.replace(/\s/g, '').length) {
            enqueueSnackbar("Comment's Field only contains white spaces.", { variant: 'error',  anchorOrigin: { vertical: 'top', horizontal: 'center' } });
            setIssueCommentsError(true);
            error = true;
        }
        if (error) {
            enqueueSnackbar("Fields are Required", { variant: 'error',  anchorOrigin: { vertical: 'top', horizontal: 'center' } });
            return;
        }
        setIssueCommentsError(false);
        setIssueTypeError(false);
        state.issueTypeID = parseInt(state.issueTypeID);
        var issuelog = {
            "issueTypeID": state.issueTypeID,
            "comment": state.comment,
            "activityID": request.currentClaimActivity.activityID,
        }
        dispatch({ type: 'UPDATE_UNIVERSAL_REQUEST', request: { ...request, isSaving: true, isProcessing: true } });

        let result = await saveIssueLogs(issuelog);
        if (result.data.createIssueLog.issueTypeID) {
            setCreate(true);
            notifyUser();
            dispatch({ type: 'UPDATE_UNIVERSAL_REQUEST', request: { ...request, isSaving: false, isProcessing: false } });
        }
    }
    const onValueChanged = (evt) => {
        const newRequest = { ...state, [evt.target.name]: evt.target.value };
        if (evt.target.name === "issueTypeID") {
            newRequest["issueTypeText"] = state.issueTypeTypes.filter(e => (e.issueTypeID === evt.target.value))[0].issueTypeText;
        }
        setState(newRequest);

    };
    React.useEffect(() => {
        Promise.all([
            loadIssueLogs(request.currentClaimActivity.activityID),
            loadIssueTypeList(),
        ]).then(([il, it]) => {
            setState({
                loaded: true,
                data: il.data.issueLogList,
                issueTypeTypes: it.data.issueTypeList.filter(x => x.issueTypeID !== '46'),
                issueTypeID: "",
                issueTypeText: "",
                comment: "",
            });
            setCreate(false);
            $dispatch(usersActions.getAllUsers());

        })
    }, [create]);

    return (
        !state.loaded ? <Spinner /> :
            <Panel>
                <PanelHeader><span style={{ fontWeight: 'bold', fontSize: '14px' }}>Issue Logs</span></PanelHeader>
                <PanelContent style={{ height: 500 }}>
                    <ContentRow>
                        <ContentCell width="33%">
                            <SelectList
                                id="issueTypeID"
                                name="issueTypeID"
                                label="Issue Type"
                                fullWidth={true}
                                disabled={(isClaimAccountant ? false : true) || isViewer}
                                onChange={onValueChanged}
                                variant="outlined"
                                value={state.issueTypeID || ""}
                                helperText={(issueTypeError === true ? 'Issue Type is Required' : '')}
                            >
                                {
                                    state.issueTypeTypes
                                        .map((item, idx) => <MenuItem value={item.issueTypeID} key={item.issueTypeID}>{item.issueTypeText}</MenuItem>)
                                }
                            </SelectList>
                        </ContentCell>
                    </ContentRow>
                    <ContentRow>
                        <ContentCell width="100%">
                            <TextInput
                                id="comment"
                                name="comment"
                                label="Issue Comments"
                                defaultValue=""
                                multiline
                                rows={4}
                                inputProps={{ maxlength: 1024 }}
                                value={state.comment}
                                onChange={onValueChanged}
                                disabled={(isClaimAccountant ? false : true) || isViewer}
                                helperText={(issueCommentsError === true ? 'Issue Comments are Required' : '')}
                                style={{ width: '100%' }}
                                variant="outlined"
                                required
                            />
                        </ContentCell>
                    </ContentRow>
                    <ContentRow>
                        <ContentCell width="33%">
                            <Button variant="contained" color="primary" onClick={onClick} disabled={isViewer || !isClaimAccountant}>Add</Button>
                        </ContentCell>
                    </ContentRow>
                    <Divider />
                    <GridContainer className="ag-theme-balham">
                        <AgGridReact
                            columnDefs={colDefs}
                            rowData={state.data ? (state.data ? state.data : []) : []}
                            frameworkComponents={frameworkComponents}
                            onCellValueChanged={onCellValueChanged}
                            rowHeight={50}
                            defaultColDef={defaultColDef}
                            pagination={true}
                            paginationPageSize={10}
                        >
                        </AgGridReact>
                    </GridContainer>

                </PanelContent>
            </Panel>
    );

})