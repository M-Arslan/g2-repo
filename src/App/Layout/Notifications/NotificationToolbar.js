import React from 'react';
import styled from 'styled-components';
import {
    Link
} from 'react-router-dom';
import {
    NotificationCard
} from './NotificationCard';
import {
    SwipeableDrawer,
    IconButton,
} from '@mui/material';
import { loadNotificationGridData } from './Query/loadNotificationGridData';

import { markNotificationRead } from './Query/saveNotifications';
import {
    makeStyles
} from '@mui/styles';

import {
    ChevronRight
} from '@mui/icons-material';

import {
    Spinner,
} from '../../Core/Forms/Common';
import { useSelector } from 'react-redux';
import { userSelectors } from '../../Core/State/slices/user';


const drawerWidth = 500;

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
    },
    drawerHeader: {
        display: 'flex',
        alignItems: 'center',
padding: '0 1em',
        // necessary for content to be below app bar
        justifyContent: 'flex-start',
        backgroundColor: '#bdc3c7',
        textDecoration : 'none'

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

const ScrollPanel = styled.div`
    width: 100%;
    padding: 0;
    margin: 0;
    border: 0;
    overflow-x: hidden;
    overflow-y: auto;
`;

export const NotificationToolbar = ({ isOpen, onCloseDrawer, updateBadge }) => {

    const classes = useStyles();
    const $auth = useSelector(userSelectors.selectAuthContext());
    let currentUser = $auth.currentUser;
    const [reload, setReload] = React.useState(false); 
    const [isNotificationLoading, setIsNotificationLoading] = React.useState(true);
    const closeDrawer = () => {
        if (typeof onCloseDrawer === 'function') {
            onCloseDrawer();
        }
    };
    const [notificationsData, setNotificationsData] = React.useState({
        notifications:[]
    });
    const onRead =  (request) =>   handleNotificationReadBy(request);
    const handleNotificationReadBy = (request) => {
        
        Promise.all([
            markNotificationRead(request)
        ])
            .then((nf) => {
                setIsNotificationLoading(false);
                setReload(false);
                if (typeof updateBadge == 'function') {
                    updateBadge();
                } 

            });
        setReload(true);
     }    

    React.useEffect(() => {
        setIsNotificationLoading(true);
        let newDate = new Date();

        Promise.all([
            loadNotificationGridData({
                "pageNumber": 1,
                "pageSize": 5000,
                "userID": currentUser.id,
                "statusCode": 'N'
            },true)
        ])
            .then(([nf]) => {
                setIsNotificationLoading(false);
                let notifications = nf?.filter((item) => {
                    return new Date(item.reminderDate) <= newDate
                })
                setNotificationsData({ notifications: (notifications || []) });
                setReload(false);

            });
    }, [isOpen,reload]);
    return (
        <SwipeableDrawer
            anchor="right"
            open={isOpen}
            onClose={onCloseDrawer}

            classes={{
                paper: classes.drawerPaper,
            }}
        >
            <div className={classes.drawerHeader}>
                <IconButton name="arrowchevron_left" onClick={closeDrawer}>
                    <ChevronRight />
                </IconButton>
                
                <Link to="/notifications" onClick={closeDrawer}>My Notification Center</Link>
            </div>
            <ScrollPanel>
                {isNotificationLoading ? <Spinner /> : (
                    <div>
                        {((notificationsData || {}).notifications || []).map( (item,index) => {
                            return <NotificationCard key={index} notification={item} test={onRead} />
                        })}
                    </div>     
               )}
            </ScrollPanel>
        </SwipeableDrawer>
    );
}