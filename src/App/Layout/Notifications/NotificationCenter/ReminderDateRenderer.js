import React from 'react';
import {
    Cancel,
    Edit as EditIcon
} from '@mui/icons-material';
import {
    IconButton,
    Grid
} from '@mui/material';
import { formatDate } from '../../../Core/Forms/Common';
import {
    DatePicker,
} from '../../../Core/Forms/Common';
import { useSnackbar } from 'notistack';
import { updateReminderDate } from '../Query/saveNotifications';
import { makeStyles } from '@mui/styles';
import { useSelector } from 'react-redux';
import { APP_TYPES } from '../../../Core/Enumerations/app/app-types';
import { userSelectors } from '../../../Core/State/slices/user';

const useStyles = makeStyles((theme) => ({
    root: {
        flex: 1,
    },
    paper: {
        padding: '2em',
    },
    datepickerHeight: {
        height: 25,
    },
    gridButton: {
        paddingRight: '0px !important',
        paddingLeft: '0px !important',
    },
    iconButton: {
        paddingRight: '5px !important',
        paddingLeft: '5px !important',
    }
}));

export default function ({ node }) {
    const classes = useStyles();
    const { enqueueSnackbar } = useSnackbar();
    const [notificationUser, setNotificationUser] = React.useState([]);
    const [reminderDate, setReminderDate] = React.useState(null);
    const $auth = useSelector(userSelectors.selectAuthContext());
    const isViewer = $auth.isReadOnly(APP_TYPES.Notifications);
    const [error, setError] = React.useState(false);
    const [enableEdit, setEnableEdit] = React.useState(false);
    React.useEffect(() => {
        setNotificationUser(node.data);
        setReminderDate(node.data?.reminderDate)

    }, [])

    const onValueChanged = (event) => {
        let x = (event.target.value).toISOString().split('T')[0];
        notificationUser.reminderDate = x;
        setReminderDate(x);
    }

    const updateDate = (user) => {
        Promise.all([
            updateReminderDate(user)
        ])
            .then((nf) => {
                if (nf[0].data.updateReminderDate === null && nf[0].data.errors === undefined) {
                    enqueueSnackbar(' Success! Reminder Date Updated', { variant: 'success', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
                }
                setEnableEdit(false)
            });
    }

    return (

        <span>
            {(node.data?.typeCode === 'T' && node.data?.taskTypeID !== "3") || node.data?.typeCode === 'D' ? (
                enableEdit === false ? (

                    <div className={classes.root}>
                        <Grid container spacing={3}>
                            <Grid item xs={6}>
                                {formatDate(reminderDate) }
                            </Grid>
                            <Grid item xs={4}>
                                { isViewer !== true ? (
                                <IconButton
                                    //className={classes.paper}
                                    color="inherit"
                                    aria-label="open drawer"
                                    onClick={() => setEnableEdit(true)}
                                >
                                    <EditIcon />
                                </IconButton>
                                ) : <span></span> }
                            </Grid>
                        </Grid>
                    </div>
                ) : (
                        <div className={classes.root}>
                            <Grid container spacing={3}>
                                <Grid item xs={10} className={classes.iconButton}>
                                    <DatePicker
                                        fullWidth
                                        className={classes.datepickerHeight}
                                        style={{ height: 25 }}
                                        id="reminderDate"
                                        name="Reminder Date"
                                        value={reminderDate || ""}
                                        onChange={onValueChanged}
                                        views={['day', 'year']}
                                        disablePast={true}
                                        error={error}
                                        helperText={error === true ? 'Format is invalid' : ''}
                                        onClose={() => updateDate(notificationUser) }
                                    />
                                </Grid>
                                <Grid item xs={2} className={classes.gridButton}>
                                    <IconButton
                                        color="inherit"
                                        aria-label="open drawer"
                                        className={classes.iconButton}
                                        edge="start"
                                        onClick={() => setEnableEdit(false)}
                                    >
                                        <Cancel color="action"/>
                                    </IconButton>
                                </Grid>
                            </Grid>
                        </div>
                    )
            ) : ''}

        </span>

    );

}

