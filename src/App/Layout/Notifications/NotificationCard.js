import {
    ExpandMore as ExpandMoreIcon,
    HighlightOff as HighlightOffIcon,
    PriorityHigh
} from '@mui/icons-material';
import {
    Avatar, Card,
    CardActions,
    CardContent,
    CardHeader,
    Collapse, IconButton,
    Tooltip, Typography
} from '@mui/material';
import {
    makeStyles
} from '@mui/styles';
import clsx from 'clsx';
import React from 'react';
import { useSelector } from 'react-redux';
import {
    Link
} from 'react-router-dom';
import { APP_TYPES } from '../../Core/Enumerations/app/app-types';
import { formatDate } from '../../Core/Forms/Common';
import { userSelectors } from '../../Core/State/slices/user';
import { ensureNonEmptyString } from '../../Core/Utility/rules';

const useStyles = makeStyles((theme) => ({
    root: {
        maxWidth: 500,
    },
    body: {
        marginLeft: '24px',
        overflowWrap:'break-word'
    },
    title: {
        overflowWrap: 'break-word'
    },
    expand: {
        transform: 'rotate(0deg)',
        marginLeft: 'auto',
        marginRight:'-2px'
    },
    expandOpen: {
        transform: 'rotate(180deg)',
    },
    cardHeaderSpacing: {
        padding: '8px',        
        paddingBottom: '0px',
    },
    avatarAlert: {
        color: 'blue !important',
        border: '1px solid',
        borderColor: 'blue !important',
        backgroundColor: 'white !important',
        height: '20px',
        width: '20px',
        fontSize: '10px !important',
        marginLeft:'12px'
    },
    avatarMessage: {
        color: 'green !important',
        border: '1px solid',
        borderColor: 'green !important',
        backgroundColor: 'white !important',
        height: '20px',
        width: '20px',
        fontSize: '10px !important',
        marginLeft: '10px'
    },
    avatarTask: {
        color: 'orange !important',
        border: '1px solid',
        borderColor: 'orange !important',
        backgroundColor: 'white !important',
        height: '20px',
        width: '20px',
        fontSize: '10px !important',
        marginLeft: '10px'
    },
    avatarDiary: {
        color: 'orange !important',
        border: '1px solid',
        borderColor: 'orange !important',
        backgroundColor: 'white !important',
        height: '20px',
        width: '20px',
        fontSize: '10px !important',
        marginLeft: '10px'
    },
    priority: {
        color: 'red',
        paddingTop: '4px',
    },
    cardContentSpacing: {
        paddingTop: '0px',
        paddingBottom: '0px!important',
        padding: "0 31px !important"

    },
    cardActionsSpacing: {
        paddingTop: '0px',
        paddingLeft:'15px'
    },
    notificationTitle: {
        display: 'inline-block',
        verticalAlign: 'super',
        wordBreak: 'break-word'
    },
    notificationPriority: {
        display: 'inline-block',
    },
    reminderDateClass: {
        paddingTop: '0px',
        paddingBottom: '0px!important',
    }
}));


export const NotificationCard = ({ notification, test }) => {
    const classes = useStyles();
    const [expanded, setExpanded] = React.useState(false);
    const $auth = useSelector(userSelectors.selectAuthContext());
    const isViewer = $auth.isReadOnly(APP_TYPES.Notifications);
    const handleExpandClick = () => {
        setExpanded(!expanded);
    };
    let newDate = new Date();

    const handleReadByClick = () => {
        if (typeof test === 'function') {
            test(notification);
        }
    }

    if (notification.typeCode === 'T' && new Date(notification.reminderDate) > newDate) {
        return '';
    }
    else {
        return (
            <Card className={classes.root} variant="outlined">
                <CardHeader
                    avatar={
                        <div>

                        </div>
                    }
                    className={classes.cardHeaderSpacing}
                    action={
                        <div>
                            <IconButton style={{ "paddingRight": 15 }} onClick={handleReadByClick} disabled={isViewer ? true:false} aria-label="settings">
                                <HighlightOffIcon />
                            </IconButton>
                            {notification.typeCode === "T" ? <Tooltip title="Task"><Avatar className={classes.avatarTask} sx={{ width: 20, height: 20 }}>T</Avatar></Tooltip> : null}
                            {notification.typeCode === "A" ? <Tooltip title="Alert"><Avatar className={classes.avatarAlert} sx={{ width: 20, height: 20 }}>A</Avatar></Tooltip> : null}
                            {notification.typeCode === "M" ? <Tooltip title="Message"><Avatar className={classes.avatarMessage} sx={{ width: 20, height: 20 }}>M</Avatar></Tooltip> : null}
                            {notification.typeCode === "D" ? <Tooltip title="Diary"><Avatar className={classes.avatarDiary} sx={{ width: 20, height: 20 }}>D</Avatar></Tooltip> : null}
                        </div>
                    }
                    title={
                        <div>
                            <div className={classes.notificationTitle} >
                                {notification.typeCode === "T" && notification.taskTypeID === 1 && notification.relatedURL !== '' && notification.relatedURL !== undefined ? (
                                    <a href={notification.relatedURL} target="_blank">
                                        {(ensureNonEmptyString(notification.claimID) ? `${notification.claimID} - ` : '')}{notification.title}
                                    </a>
                                ) :
                                    (notification.claimMasterID === null ? (
                                        <div>{(ensureNonEmptyString(notification.claimID) ? `${notification.claimID} - ` : '')}{notification.title}</div>
                                    )
                                        : (
                                            <Link to={"/notification/" + notification.notificationID} target="_blank">{(ensureNonEmptyString(notification.claimID) ? `${notification.claimID} - ` : '')}{notification.title}</Link>
                                        ))
                                }
                            </div>
                            <div className={classes.notificationPriority}>
                                {notification.isHighPriority ? <PriorityHigh className={classes.priority} /> : null}
                            </div>
                        </div>
                    }
                    subheader={formatDate(notification.createdDate)}
                />
                { notification.reminderDate !== null && notification.reminderDate !== 'undefined' ?
                    <CardContent className={classes.reminderDateClass}>
                        <Typography style={{ "paddingLeft": 10 }} variant="body2" color="textSecondary" component="p">
                            <div>Reminder Date : <span>{formatDate(notification.reminderDate)}</span>   </div>
                        </Typography>
                    </CardContent>
                    : null
                }
                <CardActions disableSpacing className={classes.cardActionsSpacing}>
                    <Typography style={{ "paddingLeft": 22 }} variant="body2" color="textSecondary" noWrap="true" component="p">
                        {notification.body}
                    </Typography>
                    <IconButton
                        className={clsx(classes.expand, {
                            [classes.expandOpen]: expanded,
                        })}
                        onClick={handleExpandClick}
                        aria-expanded={expanded}
                        aria-label="show more"
                    >
                        <ExpandMoreIcon />
                    </IconButton>
                </CardActions>
                <Collapse in={expanded} timeout="auto" unmountOnExit>
                    <CardContent className={classes.cardContentSpacing}>
                        <Typography paragraph className={classes.body} >
                            {notification.body}
                        </Typography>
                    </CardContent>
                </Collapse>
            </Card>
        );
    }

}