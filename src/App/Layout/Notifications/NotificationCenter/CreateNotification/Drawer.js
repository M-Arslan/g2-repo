import React from 'react';
import {
    Drawer,
    IconButton,
    Divider,
} from '@mui/material';
import {
    makeStyles
} from '@mui/styles';
import {
    ChevronLeft
} from '@mui/icons-material';
import {
    useSnackbar
} from 'notistack';
import { ScrollPanel, InputPanel } from './FieldContainer';
import { DrawerForm } from './DrawerForm';
import { createNotification } from '../../Query/saveNotifications';
import { taskTypeActions } from '../../../../Core/State/slices/taskTypes';
import { notificationMessageTypeActions } from '../../../../Core/State/slices/notification-message-type';
import { useDispatch } from 'react-redux';
import { PreTrailMemoActions } from '../../../../Core/State/slices/PreTrailMemo';
import { SaveNotificationActionLog } from '../../../ClaimSupport/Components/NotificationActionLog/Queries/SaveNotificationActionLog';
import { ACTION_TYPES } from '../../../../Core/Enumerations/app/action-type';
const drawerWidth = 600;

const useStyles = makeStyles((theme) => ({
    button: {
        margin: '1em',
    },
    formControl: {
        minWidth: 300,
    },
    selectControl: {
        width: '300px',
        margin: '0 auto',
    },
    root: {
        display: 'flex',
    },
    hide: {
        display: 'none',
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
        listStyle: 'none',
        listStyleType: 'none',
    },
    drawerPaper: {
        width: drawerWidth,
        top: '60px',
    },
    drawerHeader: {
        display: 'flex',
        alignItems: 'center',
padding: '0 1em',
        // necessary for content to be below app bar
        justifyContent: 'flex-start',
        fontWeight:'bold',
        backgroundColor: '#bdc3c7',

    },
    content: {
        flexGrow: 1,
        padding: '3em',
        marginRight: -drawerWidth,
    },
    contentShift: {
        marginRight: 0,
    },
    dividerFullWidth: {
        margin: `5px 0 0 2em`,
    },
    dividerInset: {
        margin: `5px 0 0 9px`,
    },
    heading: {
        fontSize: '15px',
        flexBasis: '33.33%',
        flexShrink: 0,
    },
    secondaryHeading: {
        fontSize: '15px',

    },
    expandedPanel: {
        margin: '0px !important'
    },
    panelDetails: {
        flexDirection: "column"
    }
}));




export const CreateNotificationDrawer = ({ isOpen, claim, onCloseDrawer, litigationData }) => {
    const classes = useStyles();
    const { enqueueSnackbar } = useSnackbar();
    const onFormSubmit = (request) => createNotifications(request);
    const $dispatch = useDispatch();

    React.useEffect(() => {
        $dispatch(taskTypeActions.get());
        $dispatch(notificationMessageTypeActions.get());
    }, []);
    
    const createPreTrailMemo = (id, preTrialMemo) =>{
        preTrialMemo.notificationID = id;
        preTrialMemo.descriptionOfLoss = preTrialMemo.lossDesc;
        delete preTrialMemo.lossDesc;
        $dispatch(PreTrailMemoActions.create({ preTrialMemo }));
    }
    const actionlogMutation = async (NID) => {
        let args = { claimMasterID: claim?.claimMasterID, actionTypeID: ACTION_TYPES.Error, subID: NID };
        let actionLogForNotification = await SaveNotificationActionLog(args);
        console.log(actionLogForNotification.errors, actionLogForNotification.error);
    } 

    const closeDrawer = () => {
        if (typeof onCloseDrawer === 'function') {
            onCloseDrawer();
        }
    };

    const createNotifications = async (request) => {

        /*if (request?.notificationRoles?.length > 0) {
            request.notificationRoles.forEach(item => item.roleID = parseInt(item.roleID));
        }*/

        /*if (request.hasOwnProperty('preTrialMemo')) {
            if (request.preTrialMemo.trialDate) {
                 request.preTrialMemo.trialDate = new Date(request.preTrialMemo.trialDate).toISOString();
            }
        }*/
        let preTrialMemo = request.preTrialMemo;
        delete request.preTrialMemo;
      
        /*if (pathName === '/claimSupportDashboard') {
            request.taskTypeID = '2';
        } else if (pathName !== '/notifications') {
            request.claimMasterID = claim?.claimMasterID;
        }*/
        /*if (request.taskTypeID) {
            request.taskTypeID = parseInt(request.taskTypeID);
        }
        if (request.supportTypeID) {
            request.supportTypeID = parseInt(request.supportTypeID);
        }*/

        /*if (request.typeCode === 'M') {
            request.title = '';
        }*/
        Promise.all([
            createNotification(request)
        ])
            .then((response) => {
                if (response[0].errors) {
                    response[0].errors.map((err, index) => {
                        enqueueSnackbar('Error! There are some errors', { variant: 'error',  anchorOrigin: { vertical: 'top', horizontal: 'center' } });
                        console.log(err.message.replace("GraphQL.ExecutionError:", ""));
                    });
                }
                else {
                    if (response[0].data.create.notificationID) {
                        enqueueSnackbar(' Success! Notification Created Successfully.', { variant: 'success', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
                        if (request.typeCode ===  'T' && request.taskTypeID ===  3) {
                            createPreTrailMemo(response[0].data.create.notificationID, preTrialMemo);
                        }
                        closeDrawer();
                        if (request.taskTypeID ===  2) {
                            actionlogMutation(response[0].data.create.notificationID);
                        }
                      
                        console.log("response", response[0].data);
                    }
                }

            });
    }

        return ( 

            <Drawer
                className={classes.drawer}
                anchor="left"
                open={isOpen}
                classes={{
                    paper: classes.drawerPaper,
                }}
            >
                <div className={classes.drawerHeader}>
                    <IconButton name="arrowchevron_right" onClick={closeDrawer}>
                        <ChevronLeft />
                    </IconButton>
                 Create New Notification
            </div>
                <ScrollPanel>
                    <InputPanel>
                        <DrawerForm litigationData={litigationData} claim={claim} isOpen={isOpen} onSubmit={onFormSubmit} />

                    </InputPanel>
                </ScrollPanel>
                <Divider />
            </Drawer>

        );
     
}