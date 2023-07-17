import React from 'react';
import styled from 'styled-components';
import {
    BrowserRouter,
    Route,
    Routes,
    NavLink,
    useLocation
} from 'react-router-dom';
import {
    Dashboard as DashboardIcon,
    ArrowDropDown
} from '@mui/icons-material';
import {
    Dashboard
} from './Dashboard/Dashboard';
import { AccountingDashboard } from './Dashboard/Accounting/AccountingDashboard';
import { LegalDashboard } from './Dashboard/Legal/LegalDashboard';
import {
    InvoiceDraftNumberDashboard
} from './Dashboard/InvoiceDraftNumber/InvoiceDraftNumberDashboard';
import { ExpenseInvoiceDashboard } from './Dashboard/ExpenseInvoice/ExpenseInvoiceDashboard';
import { WCDashboard } from './Dashboard/WC/WCDashboard'
import {
    loadNotificationGridData
} from './Notifications/Query/loadNotificationGridData';
import {
    loadNotificationCount
} from './Notifications/Query/loadNotificationCount';
import {
    ClaimScreen
} from './Claim/ClaimScreen';
import logo from './assets/GeneralStarGenesis.png';
import {
    NotificationToolbar
} from './Notifications/NotificationToolbar';
import {
    NotificationCenter
} from './Notifications/NotificationCenter/NotificationCenter';
import {
    ClaimSupportDashboard
} from './Notifications/ClaimSupport/ClaimSupportDashboard';

import {
    Icon,
    IconButton,
    Badge,
    Menu,
    MenuItem
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import {
    NotificationsNone as NotificationsNoneIcon
} from '@mui/icons-material';
import { ViewNotification } from './Notifications/NotificationCenter/ViewNotification'
import {
    AdminScreen
} from './Admin';
import {
    SupportScreen
} from './Support';
import {
    useSelector
} from 'react-redux';
import {
    APP_TYPES
} from '../Core/Enumerations/app/app-types';
import {
    PERMISSIONS
} from '../Core/Enumerations/security/permissions';
import {
    userSelectors
} from '../Core/State/slices/user';
import { StatusNotifier } from './StatusNotifier';
import { LegalScreen } from './Legal/LegalScreen';
import { UIHealth } from './Support/ui-health/UIHealth';
import {
    configSelectors
} from '../Core/State/slices/config';
import { ROLES } from '../Core/Enumerations/security/roles';
import { useSignalR, RTC_EVENTS } from '../Core/Providers/RTC/useSignalr';
import { Logout } from './Logout';


const useStyles = makeStyles(() => ({
    notificationCount: {
        marginRight: '10px'
    }
}));

const Container = styled.article`
    height: 100%;
    width: 100%;
    max-width: 1850px;
    margin: 0px 25px 0px 25px;
    padding: 0;
    padding-bottom: 5px;
    overflow: hidden;
    display: flex;
    flex-flow: column nowrap;
`;

const Header = styled.header`
    height: 60px;
    width: 100%;
    padding: 0em;
    display: flex;
    flex-flow: row no-wrap;
    justify-content: space-between;
    align-content: end;
    background-color: transparent;
    color: ${props => props.theme.primaryColor};
`;

const Navigation = styled.div`
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-end;
    align-content: center;
`;

const Main = styled.main`
    height: 100%;
    width: 100%;
    padding: 0;
    margin: 0;
    overflow-x: hidden;
    overflow-y: hidden;
    background-color: transparent;
    border-radius: 4px;
`;

const Title = styled.h1`
    font-size: 24px;
    font-weight: bold;
    margin: 0;
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-start;
    align-content: center;
    align-items: center;
`;

const Navbar = styled.nav`
    margin: 0px 15px 0px;
    margin-top: 10px;
    
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-end;
    align-content: center;
    align-items: center;
    width: 100%;
`;

const TopNavLink = styled(NavLink)`
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    align-content: center;
    color: ${props => props.theme.primaryColor};
    margin: 5px;
    padding: .5em;
    border-radius: 5px;

    &:hover {
        transition: all .5s ease;
        background-color: ${props => props.theme.backgroundDark};
    }
`;

const DashboardButton = styled.a`
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    align-items: center;
    align-content: center;
    color: ${props => props.theme.primaryColor};
    margin: 5px;
    padding: .5em;
    border-radius: 5px;
    cursor: pointer;

    & > div {
        width: 80%;
        display: flex;
        flex-flow: row nowrap;
        align-content: center;
        align-items: center;
    }

    &:hover {
        transition: all .5s ease;
        background-color: ${props => props.theme.backgroundDark};
    }
`;

const NotificationButton = styled(IconButton)`
    color: ${props => props.theme.primaryColor};
`;

const NotificationsIcon = styled(NotificationsNoneIcon)`
    color: ${props => props.theme.primaryColor};
`

const DashboadLabel = styled.span`
    white-space: nowrap;
`;

const NavItem = ({ to, icon, title, onClick }) => (
    <TopNavLink to={to} title={title} onClick={onClick}>
        <Icon>{icon}</Icon>
        <span style={{ marginLeft: '3px' }}>{title}</span>
    </TopNavLink>
);

const DashboardMenu = ({ user }) => {
    const $location = useLocation();
    const [label, setLabel] = React.useState('Dashboards');
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    React.useEffect(() => {
        const path = $location.pathname;
        if (path === '/') {
            setLabel('Claims Dashboard');
        }
        else if (path === '/legal') {
            setLabel('Legal Dashboard');
        }
        else if (path === '/accounting') {
            setLabel('Accounting Dashboard');
        }
        else if (path === '/expenses') {
            setLabel('Expense Dashboard');
        }
        else if (path === '/claimSupportDashboard') {
            setLabel('Claim Support Dashboard');
        }
        else if (path === '/wcDashboard') {
            setLabel('WC Dashboard');
        }
        else {
            setLabel('Dashboards');
        }
    }, [$location]);

    return (
        <div>
            <DashboardButton id="basic-button" onClick={handleClick}>
                <div>
                    <DashboardIcon />
                    <DashboadLabel>{label}</DashboadLabel>
                </div>
                <ArrowDropDown />
            </DashboardButton>
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
            >
                <MenuItem onClick={handleClose}><NavItem to="/" icon="receiptlong" title="Claims Dashboard" /></MenuItem>
                {
                    user.hasPermission(APP_TYPES.Legal_Dashboard) ? <MenuItem onClick={handleClose}><NavItem to="/legal" icon="gavel" title="Legal Dashboard" /></MenuItem> : null
                }
                {
                    user.hasPermission(APP_TYPES.Accounting_Dashboard) ? <MenuItem onClick={handleClose}><NavItem to="/accounting" icon="calculate" title="Accounting Dashboard" /></MenuItem> : null
                }
                {
                    user.hasPermission(APP_TYPES.Expense_Dashboard) ? <MenuItem onClick={handleClose}><NavItem to="/expenses" icon="local_atm" title="Expense Dashboard" /></MenuItem> : null
                }

                {
                    user.isInRole(ROLES.Claims_Assistant) || user.isInRole(ROLES.Claims_Examiner) ? <MenuItem onClick={handleClose}><NavItem to="/claimSupportDashboard" icon="support_agent" title="Claim Support Dashboard" /></MenuItem> : null
                }
                {
                    user.isInRole(ROLES.Claims_Assistant) || user.isInRole(ROLES.Claims_Examiner) ? <MenuItem onClick={handleClose}><NavItem to="/wcDashboard" icon="engineering" title="WC Dashboard" /></MenuItem> : null
                }
            </Menu>
        </div>
    );
}

export const Layout = () => {
    const $rtc = useSignalR();
    const classes = useStyles();
    const [NotifyOpen, setNotifyOpen] = React.useState(false);
    const [notiCount, setNotiCount] = React.useState(0);
    const [badgeUpdate, setBadgeUpdate] = React.useState(false);
    const handleShowNotificationToolbar = () => {
        setNotifyOpen(true);
    };
    /** @type {import('../../../types.d').AppConfig} */
    const config = useSelector(configSelectors.selectData());
    const $auth = useSelector(userSelectors.selectAuthContext());

    const isClaimAssistant = $auth.isInRole(ROLES.Claims_Assistant);
    const isClaimExaminer = $auth.isInRole(ROLES.Claims_Examiner);

    React.useEffect(() => {
        $rtc.subscribe(RTC_EVENTS.NOTIFICATIONS_UPDATED, (message) => {
            setBadgeUpdate(false);
        });
    },[]);
    const onReportingClick = () => {
        window.open(
            config.reporting,
            '_blank' 
        );
    }
    
    React.useEffect(() => {
        const currentUser = $auth.currentUser.id.replace("\\", "%5C");
        let newDate = new Date();

        Promise.all([
            loadNotificationCount(currentUser)
        ])
            .then(([nf]) => {   
            setNotiCount(nf?.data?.notificationCount?.count);
            setBadgeUpdate(true);
        });
    }, [badgeUpdate]);

    return (
        <BrowserRouter>
            <Container>
                <StatusNotifier/>
                <NotificationToolbar isOpen={NotifyOpen} onCloseDrawer={setNotifyOpen} updateBadge={setBadgeUpdate} />
                <Header>
                    <Title>
                        <img src={logo} alt="Logo" style={{ width: '248px', height: '48px', marginTop: '15px', marginLeft: '-10px', marginRight: '20px', marginBottom: '10px' }} />
                        G2 Claims
                    </Title>
                    <Navigation>
                        <Navbar>
                            <DashboardMenu user={$auth} />
                            <NavItem to="/support" icon="support" title="Support" />
                            <NavItem to="" onClick={onReportingClick} target="_blank" icon="assessment" title="Reporting" />
                            {
                                $auth.hasPermission(APP_TYPES.Administration, PERMISSIONS.Administrator) ? <NavItem to="/admin" icon="settings" title="Admin" /> : null
                            }
                            <NavItem to="" icon="person" title={$auth.currentUser.fullName} />
                            <NotificationButton title="Notification" onClick={handleShowNotificationToolbar} >
                                <Badge badgeContent={notiCount > 0 ? notiCount : "0"} color="error" className={classes.notificationCount} max={notiCount}>
                                    <NotificationsIcon />
                                </Badge>
                            </NotificationButton>
                        </Navbar>
                    </Navigation>
                </Header>
                <Main>
                    <Routes>
                        <Route path="/" exact element={<Dashboard landingPage={"ClaimsLandingPage"} />} />
                        <Route path="/ui-health" exact element={UIHealth} />
                        <Route path="/legal" exact element={<LegalDashboard />} />
                        <Route path="/accounting" exact element={<AccountingDashboard />} />
                        <Route path="/accounting/draft" exact element={<InvoiceDraftNumberDashboard />} />
                        {(isClaimExaminer || isClaimAssistant) ?  <Route path="/claimsupportdashboard" exact element={<ClaimSupportDashboard />} /> : null}
                        <Route path="/expenses" exact element={<ExpenseInvoiceDashboard />} />
                        <Route path="/wcDashboard" exact element={<WCDashboard landingPage={"WorkersCompLandingPage"}/>} />
                        <Route path="/admin" element={<AdminScreen />} />
                        <Route path="/support" element={<SupportScreen />} />
                        <Route path="/profile" element={<Header />} />
                        <Route path="/claim/:id/*" element={<ClaimScreen />} />
                        <Route path="/legal/:id/*" element={<LegalScreen />} />
                        <Route path="/notification/:id" element={<ViewNotification />} />
                        <Route path="/notifications" element={<NotificationCenter />} />
                        <Route path="/logout" element={<Logout />} />
                    </Routes>
                </Main>
            </Container>
        </BrowserRouter>
    );
}