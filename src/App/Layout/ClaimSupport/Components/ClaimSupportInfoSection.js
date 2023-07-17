import React from 'react';
import { makeStyles } from '@mui/styles';
import styled from 'styled-components';
import { Panel, PanelContent, PanelHeader, TextInput, SelectList, Spinner } from '../../../Core/Forms/Common/';
import { claimSupportTypeSelectors, claimSupportTypeActions, claimSupportTypeRolesActions,  claimSupportTypeRolesSelectors } from '../../../Core/State/slices/claim-support';
import { ASYNC_STATES } from '../../../Core/Enumerations/redux/async-states';
import { useDispatch, useSelector } from 'react-redux';
import { claimActions, claimSelectors } from '../../../Core/State/slices/claim';
import { NotificationRolesSelectors, NotificationRolesActions } from '../../../Core/State/slices/notification-roles';
import { usersSelectors } from '../../../Core/State/slices/users';
import { MenuItem } from '@mui/material';
import { customGQLQuery } from '../../../Core/Services/EntityGateway';
import {
    useSnackbar
} from 'notistack';
import { createNotification } from '../../Notifications/Query/saveNotifications';
import { SaveNotificationActionLog } from './NotificationActionLog/Queries/SaveNotificationActionLog';
import { LegalClaimActions, LegalClaimSelectors } from '../../../Core/State/slices/legal-claim';
import { CLAIM_STATUS_TYPE } from '../../../Core/Enumerations/app/claim-status-type';
import { CLAIM_TYPES } from '../../../Core/Enumerations/app/claim-type';


const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        maxWidth: 360,
        margin: '0px',
    },
    panelDetails: {
        flexDirection: "column",
    },
    cellDesign: {
        alignItems: "baseline"
    }
}));

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

export const ClaimSupportInfoSection = ({ request,dispatch,policy,NotificationID}) => {
    const $dispatch = useDispatch();
    const classes = useStyles();
    const [requestor, setRequestor] = React.useState(null);
    const [loader, setLoader] = React.useState(false);
    const [statuses, setStatuses] = React.useState([]);
    const [currentClaimStatus, setcurrentClaimStatus] = React.useState(null);
    const ClaimSupportData = useSelector(claimSupportTypeSelectors.selectData());
    const ClaimSupportLoaded = useSelector(claimSupportTypeSelectors.selectLoading());
    const ClaimData = useSelector(claimSelectors.selectData());

    const claimLoaded = useSelector(claimSelectors.selectLoading());
    const NotificationRoleData = useSelector(NotificationRolesSelectors.selectData());

    const usersData = useSelector(usersSelectors.selectData());
    const usersDataLoaded = useSelector(usersSelectors.selectLoading());
    const RolesData = useSelector(claimSupportTypeRolesSelectors.selectData());
    const rolesDataLoaded = useSelector(usersSelectors.selectLoading());
    const MutationLoaded = useSelector(NotificationRolesSelectors.selectLoading());
    const { enqueueSnackbar } = useSnackbar();
   
    /* In case of legal claim */
    
    const legalClaimData = useSelector(LegalClaimSelectors.selectData());
    const [assignedToCouncel, setassignedToCouncel] = React.useState(null);
    let modifyNotification = {
        ...ClaimSupportData,
        notificationID: NotificationID
    }
    if (modifyNotification.claimType) {
        delete modifyNotification.claimType;
    }

  /*  const sendNotifcation = async () => {
        const notificationRequest = {
            claimMasterID: ClaimData?.claimMasterID,
            typeCode: 'T',
            title: "Claim Support",
            body: "'" + ClaimData?.claimID + "' - Claims Support - is completed",
            isHighPriority: ClaimSupportData?.isHighPriority,
            roleID: RolesData[0].roleID,
            notificationUsers: [user],
            relatedURL: "/Claim/" + ClaimData?.claimMasterID + '#notifications/'
        }

        const notificationResult = await createNotification(notificationRequest);
        console.log(notificationResult.errors, notificationResult.error);
    }*/

    React.useEffect(() => {
        if (NotificationRoleData !== null && MutationLoaded === ASYNC_STATES.SUCCESS) {
            enqueueSnackbar("Claim Status has been saved successfully.", { variant: 'success', anchorOrigin: { vertical: 'top', horizontal: 'center' } });

  /*          if (currentClaimStatus == '31') {
                sendNotifcation();
            }*/
        }
        else if (MutationLoaded === ASYNC_STATES.ERROR) {
            enqueueSnackbar("An error occured", { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
        }
        $dispatch(NotificationRolesActions.clearStatus());

    }, [NotificationRoleData]);
    const loadClaimStatusTypes = async () => {
        let query = {
            query: `
                query { 
                    claimStatusTypesForClaimSupport {
                        claimStatusTypeID
                        claimProcessIndicatorID
                        statusText
                    }
                }
            `,
        }      

        const result = await customGQLQuery(`claims-common`, query);
        if (result.error) {
            //$notifications.notifyError(result.error);
        }

        if (typeof result.data === 'object' && result.data !== null) {
            setStatuses(result.data.claimStatusTypesForClaimSupport);
        }
        return null;

    }

    const isLoaded = rolesDataLoaded === ASYNC_STATES.WORKING;
    React.useEffect(() => {
        if (RolesData != null) {
            setcurrentClaimStatus(RolesData[0]?.claimStatusTypeID);
        }
    }, [isLoaded, RolesData]);


    React.useEffect(() => {
        loadClaimStatusTypes();
        if (NotificationID !== '' && NotificationID != null) {
            $dispatch(claimSupportTypeRolesActions.getDetail({ notificationID: NotificationID }));
            $dispatch(claimSupportTypeActions.get({ notificationID: NotificationID }));
        }

    }, [NotificationID]);

    React.useEffect(() => {
        if (usersDataLoaded === ASYNC_STATES.SUCCESS) {
            if (ClaimSupportData != null) {
                let selected_users = usersData?.filter(x => x.userID?.toLowerCase() === ClaimSupportData?.createdBy?.toLowerCase());
                if (selected_users.length > 0) {
                    //let e = selected_users[0];
                    setRequestor(selected_users[0].fullName);
                }
            }
        }

    }, [usersDataLoaded, ClaimSupportLoaded]);
  
    function supportTypeIDValueFormatter(value) {
        if (value === 1) {
            return "Claim Acknowledgment";
        }
        else if (value === 2) {
            return "Claim Communication";
        }
        else if (value === 3) {
            return "Certified Policy";
        }
        else if (value === 4) {
            return "Policy Request";
        }
        else if (value === 5) {
            return "File Request";
        }
    };
    const onValueChanged = (evt) => {
        setcurrentClaimStatus(evt.target.value);
    };
    const actionlogMutation = async () => {
        let args = { claimMasterID: ClaimData.claimMasterID, actionTypeID: currentClaimStatus, subID: RolesData[0].notificationID };
        let actionLogForNotification = await SaveNotificationActionLog(args);
        console.log(actionLogForNotification.errors, actionLogForNotification.error);

    } 
    const createNotifications = async (request) => {
        Promise.all([
            createNotification(request)
        ])
            .then((response) => {
                if (response[0].errors) {
                    response[0].errors.map((err, index) => {
                        console.log(err.message.replace("GraphQL.ExecutionError:", ""));
                    });
                }
                else {
                      console.log("response", response[0].data);
                }

            });
    }
    const onSave = (evt) => {
        var notificationRole = {
            claimStatusTypeID: currentClaimStatus,
            notificationID: RolesData[0].notificationID,
            notificationRoleID: RolesData[0].notificationRoleID,
            roleID: RolesData[0].roleID,
            createdBy: RolesData[0].createdBy,
            createdDate: new Date(RolesData[0].createdDate).toISOString(),
        }
        $dispatch(NotificationRolesActions.save({ notificationRole: JSON.parse(JSON.stringify(notificationRole)) }));
        actionlogMutation();
        createNotifications(modifyNotification);
    }
    const isItemDisabled = (item) => {
        if (currentClaimStatus === CLAIM_STATUS_TYPE.NEW_PI_3) {
            return item.claimStatusTypeID === CLAIM_STATUS_TYPE.COMPLETED_PI_3;
        } else if (currentClaimStatus === CLAIM_STATUS_TYPE.IN_PROGRESS_PI_3) {
            return item.claimStatusTypeID === CLAIM_STATUS_TYPE.NEW_PI_3;
        } else if (currentClaimStatus === CLAIM_STATUS_TYPE.COMPLETED_PI_3) {
            return item.claimStatusTypeID === CLAIM_STATUS_TYPE.NEW_PI_3 || item.claimStatusTypeID === CLAIM_STATUS_TYPE.VOID_PI_3;
        }
    }

    React.useEffect(() => {
        assigned();
    }, [legalClaimData])

    const assigned = (item) => {
        if (legalClaimData != null) {
            let selected_users = (usersData?.filter(x => x.userID.toLowerCase() === legalClaimData?.claimCounselUserID.toLowerCase()));
            if (selected_users.length > 0) {
                setassignedToCouncel(selected_users[0].fullName);
            }
        }       
    }

    
    React.useEffect(() => {
        if (ClaimData != null) {
            if (ClaimData.claimType === CLAIM_TYPES.LEGAL) {
                $dispatch(LegalClaimActions.get({ claimMasterID: ClaimData.claimMasterID }));
            } else
            {
                setLoader(false);
            }
            dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, show: true, claimDetail: ClaimData } }); 
        }

        if (claimLoaded === ASYNC_STATES.WORKING) {
            setLoader(true);
        }

        if (claimLoaded === ASYNC_STATES.SUCCESS || claimLoaded === ASYNC_STATES.IDLE) {
            setLoader(false);
            $dispatch(claimActions.clearStatus());  
        }


    }, [claimLoaded])

    return (
        loader ? <Spinner /> : 
            <Panel>
                <PanelHeader><span style={{ fontWeight: 'bold', fontSize: '14px' }}>Claim Support Detail</span></PanelHeader>
                <PanelContent>
                    <ContentRow>
                        <ContentCell width="49%">
                            {request.claimDetail != null ?    <TextInput
                                label="Claim Number"
                                id="claimMasterID"
                                name="claimMasterID"
                                fullWidth={true}
                                inputProps={{
                                    maxLength: 1024,
                                }}
                                value={request.claimDetail?.claimID || ''}
                               disabled
                        /> : "Loading..."}
                        </ContentCell>
                    <ContentCell width="49%">
                            {ClaimSupportData ?    <TextInput
                            disabled={true}
                            id="supportTypeID"
                            name="supportTypeID"
                            label="support Type"
                            required
                            fullWidth={true}
                            variant="outlined"
                            value={ClaimSupportData?.supportTypeID ? supportTypeIDValueFormatter(ClaimSupportData?.supportTypeID) : ''}
                            /> : "Loading..."}
                    </ContentCell>
                </ContentRow>
                <ContentRow className={classes.cellDesign}>
                     <ContentCell width="49%">
                            {request.claimDetail != null && request.claimDetail.claimPolicy == null ?
                            <TextInput
                                label="Policy Number"
                                id="policyId"
                                name="policyId"
                                fullWidth={true}
                                inputProps={{
                                    maxLength: 1024,
                                }}
                                value={policy || ''}
                                disabled
                            /> : request.claimDetail != null && request.claimDetail.claimPolicy != null ? (
                            <TextInput
                                label="Policy Number"
                                id="policyId"
                                name="policyId"
                                fullWidth={true}
                                inputProps={{
                                    maxLength: 1024,
                                }}
                                value={policy || ''}
                                disabled
                            />
                            ): "Loading..."}
                    </ContentCell> 
                    <ContentCell width="49%">
                            {ClaimSupportData ?   <TextInput
                            label="Priority"
                            id="priority"
                            name="priority"
                            fullWidth={true}
                            inputProps={{
                                maxLength: 1024,
                            }}
                            disabled
                            value={ClaimSupportData?.isHighPriority === true ? "High" : "Low"}
                            /> : "Loading..."}
                    </ContentCell>
                </ContentRow>
                    <ContentRow className={classes.cellDesign}>
                        <ContentCell width="49%">
                            <TextInput
                                label="Requestor"
                                id="requestor"
                                name="requestor"
                                fullWidth={true}
                                inputProps={{
                                    maxLength: 1024,
                                }}
                                value={requestor ? requestor: ''}
                                disabled
                            />
                        </ContentCell>
                        <ContentCell width="49%">
                            {(request.claimDetail !== null && request.claimDetail.claimType !== CLAIM_TYPES.LEGAL) ?
                                
                            <TextInput
                                label="Assigned To"
                                id="assignedto"
                                name="assignedto"
                                fullWidth={true}
                                inputProps={{
                                    maxLength: 1024,
                                 }}
                                disabled
                                 value={request.claimDetail ? (request.claimDetail.examiner !== null ? request.claimDetail?.examiner?.firstName + ' ' + request.claimDetail?.examiner?.lastName : '') : ''}
                                /> :
                                request.claimDetail !== null && request.claimDetail.claimType === CLAIM_TYPES.LEGAL && assignedToCouncel !== null ?
                                (
                                   <TextInput
                                        label="Assigned To"
                                        id="assignedto"
                                        name="assignedto"
                                        fullWidth={true}
                                        inputProps={{
                                            maxLength: 1024,
                                        }}
                                        disabled
                                        value={assignedToCouncel}
                                    />
                                )
                                    : "Loading..."
                              }
                        </ContentCell>
                    </ContentRow>
                    <ContentRow className={classes.cellDesign}>
                        <ContentCell width="49%">
                            {ClaimSupportData ?  <TextInput
                            label="title"
                            id="title"
                            name="title"
                                fullWidth={true}
                                inputProps={{
                                maxLength: 1024,
                            }}
                            value={ClaimSupportData?.title || ''}
                            disabled
                            /> : "Loading..."}
                        </ContentCell>
                    <ContentCell width="49%">
                        {statuses !== [] && currentClaimStatus !== null  ?(
                            <SelectList
                                id="Status"
                                label="Status"
                                value={currentClaimStatus || ''}
                                variant="outlined"
                                onChange={onValueChanged}
                                onBlur={onSave}
                            >
                                {
                                    statuses.map((item, idx) =>
                                        <MenuItem key={idx} disabled={isItemDisabled(item)} value={item.claimStatusTypeID}>{item.statusText}</MenuItem>
                                    )
                                }
                            </SelectList>) : "Loading..."}
                        </ContentCell>
                </ContentRow>
                <ContentRow>
                        <ContentCell width="98%">
                            {ClaimSupportData ? <TextInput
                            label="Related URL"
                            id="relatedURL"
                            name="relatedURL"
                            fullWidth={true}
                            inputProps={{
                                maxLength: 1024,
                            }}
                            value={ClaimSupportData?.relatedURL || ''}
                            disabled

                            />: "Loading..."}
                    </ContentCell>
                </ContentRow>
                    <ContentRow>
                        <ContentCell width="98%">
                            {ClaimSupportData ? <TextInput
                                label="Body"
                                id="body"
                                name="body"
                                fullWidth={true}
                                inputProps={{
                                    maxLength: 1024,
                                }}
                                value={ClaimSupportData?.body || ''}
                                disabled
                                multiline
                                rows={4}
                            /> : "Loading..."}
                        </ContentCell>
                </ContentRow>
                </PanelContent>
            </Panel>
    );
};




