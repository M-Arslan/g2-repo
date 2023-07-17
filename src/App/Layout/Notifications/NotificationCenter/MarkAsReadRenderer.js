import React from 'react';
import { CheckCircleOutline as CheckCircleOutlineIcon } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { markNotificationRead } from '../Query/saveNotifications';
import { useSelector } from 'react-redux';
import { APP_TYPES } from '../../../Core/Enumerations/app/app-types';
import { userSelectors } from '../../../Core/State/slices/user';

export default function ChildRenderer({ node }) {
    const [readStatus, setReadStatus] = React.useState('R'); 
    const [user, setUser] = React.useState([]);
    const { context } = node?.beans?.context?.contextParams?.providedBeanInstances?.gridOptions;

    const $auth = useSelector(userSelectors.selectAuthContext());
    const isViewer = $auth.isReadOnly(APP_TYPES.Notifications);
    let currentUser = $auth.currentUser;

    const handleReadByClick = () => {
        if (user.length > 0) {
            Promise.all([
                markNotificationRead(user[0])
            ])
                .then((nf) => {
                    setReadStatus('R');
                });
        } else {
            Promise.all([
                markNotificationRead(node.data)
            ])
                .then((nf) => {
                    setReadStatus('R');
                    context.refreshApp();
                });
        }
        
    }

    React.useEffect(() => {
        if (node.data?.notificationUsers) {
            let currentFilteredUser = node.data.notificationUsers.length > 1 ? node.data.notificationUsers.filter(item => item.networkID === currentUser.id) : node.data.notificationUsers[0];
            if (Array.isArray(currentFilteredUser)) {
                setUser(currentFilteredUser);
                setReadStatus(currentFilteredUser[0]?.statusCode);

            } else {
                setUser([currentFilteredUser]);
                setReadStatus(currentFilteredUser?.statusCode);
            }
        }
        if (node?.data?.statusCode) {
            setReadStatus(node?.data?.statusCode);
        }

    }, [])
 
    if (!isViewer) {
        return (
            <span>
                {readStatus === 'N' ? (
                    <IconButton style={{ padding: 0 }} name="Mark As Read" title="Mark As Read" onClick={handleReadByClick}><CheckCircleOutlineIcon color="primary" /></IconButton>
                ) : <span style={{ paddingLeft: 0 }}>Read</span>}

            </span>

        );

    }
    else {
        return (
            <span></span>);
    }

}

