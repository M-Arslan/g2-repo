import React, { Suspense } from 'react';
import styled from 'styled-components';
import { APP_TYPES } from '../../Core/Enumerations/app/app-types';
import { useSelector } from 'react-redux';
import { userSelectors } from '../../Core/State/slices/user';
import { RoutableTabs } from '../Common/Components/RoutableTabs/RoutableTabs';
import { Navigate, Route, Routes } from 'react-router-dom';
import { Spinner } from '../../Core/Forms/Common';
import { CLAIM_TYPES } from '../../Core/Enumerations/app/claim-type';


const TabContainer = styled.div`
    height: calc(100% - 40px);
    width: 100%;
    padding: 0;
    margin: 0;
    overflow: hidden;
    background-color: ${props => props.theme.backgroundColor};
`;

const ClaimDetailAppTab = React.lazy(() => import('./Tabs/ClaimDetail/ClaimDetailApp'));
const ClaimantAppTab = React.lazy(() => import('./Tabs/Claimants'));
const LitigationAppTab = React.lazy(() => import('./Tabs/Litigation/LitigationApp'));
const ActivityLogAppTab = React.lazy(() => import('./Tabs/ActivityLog'));
const ContactsAppTab = React.lazy(() => import('./Tabs/Contacts'));
const AssocClaimsAppTab = React.lazy(() => import('./Tabs/AssociatedClaims'));
const CorrespondenceAppTab = React.lazy(() => import('./Tabs/Correspondence/CorrespondenceApp'));
const NotificationsAppTab = React.lazy(() => import('../Notifications/NotificationCenter/NotificationCenter'));
const LossCodingAppTab = React.lazy(() => import('./Tabs/ClaimRiskCoding/ClaimRiskCodingTab'));
const FinancialsAppTab = React.lazy(() => import('./Tabs/Accounting'));
const PropertyPolicyAppTab = React.lazy(() => import('./Tabs/PropertyPolicy'));
const PilrAppTab = React.lazy(() => import('./Tabs/PropertyInsuranceLossRegister'));
const WCClaimantApp = React.lazy(() => import('../WC/Tabs/WC Claimant/'));
const ReimbursementApp = React.lazy(() => import('../WC/Tabs/Reimbursement/'));

export const ClaimRouter = ({ claim }) => {
    const $auth = useSelector(userSelectors.selectAuthContext());

    const apps = [
        { id: APP_TYPES.Claim_Detail, key: 'claim-detail', label: 'Claim Detail', component: <ClaimDetailAppTab /> },
        { id: APP_TYPES.Claimant, key: 'claimants', label: 'Claimants', hide: (claim.claimType === CLAIM_TYPES.PROPERTY || claim.claimType === CLAIM_TYPES.WORKERS_COMP), component: <ClaimantAppTab /> },
        { id: APP_TYPES.WC_Claimant, key: 'wCClaimants', label: 'W/C Claimants', hide: (claim.claimType === CLAIM_TYPES.PROPERTY || claim.claimType === CLAIM_TYPES.CASUALTY), component: <WCClaimantApp /> },
        { id: APP_TYPES.Litigation, key: 'litigation', label: 'Litigation Mgt', component: <LitigationAppTab /> },
        { id: APP_TYPES.Contacts, key: 'contacts', label: 'Contacts', component: <ContactsAppTab /> },
        { id: APP_TYPES.Assoc_Claims, key: 'associated-claims', label: 'Assoc Claims', component: <AssocClaimsAppTab claim={claim} /> },
        { id: APP_TYPES.Correspondence, key: 'correspondence', label: 'Correspondence', component: <CorrespondenceAppTab /> },
        { id: APP_TYPES.File_Activity_Log, key: 'file-activity-log', label: 'File Activity Log', component: <ActivityLogAppTab claim={claim} /> },
        { id: APP_TYPES.Notifications, key: 'notifications', label: 'Notifications', component: <NotificationsAppTab claim={claim} /> },
        { id: APP_TYPES.Loss_Coding, key: 'loss-coding', label: 'Loss Coding', component: <LossCodingAppTab claim={claim} /> },
        { id: APP_TYPES.Financials, key: 'financials', label: 'Financials', component: <FinancialsAppTab claim={claim} /> },
        { id: APP_TYPES.Property_Policy, key: 'property-policy', label: 'Property Policy', hide: (claim.claimType !== CLAIM_TYPES.PROPERTY || claim.claimType === CLAIM_TYPES.WORKERS_COMP), component: <PropertyPolicyAppTab claim={claim} /> },
        { id: APP_TYPES.Property_Insurance_Loss_Register, key: 'pilr', label: 'PILR', hide: (claim.claimType !== CLAIM_TYPES.PROPERTY || claim.claimType === CLAIM_TYPES.WORKERS_COMP), component: <PilrAppTab claim={claim} /> },
        { id: APP_TYPES.Financials, key: 'reimbursement', label: 'Reimbursement', hide: (claim.claimType === CLAIM_TYPES.PROPERTY || claim.claimType === CLAIM_TYPES.CASUALTY), component: <ReimbursementApp /> },
    ];

    const visibleApps = apps.filter(a => $auth.hasPermission(a.id) && a.hide !== true);

    const tabMap = new Map();
    visibleApps.forEach(app => tabMap.set(app.key, app.label));

    return (
        <TabContainer>
            <RoutableTabs tabMap={tabMap}>
                <Suspense fallback={<Spinner />}>
                    <Routes>
                        <Route path="/" element={<Navigate to="claim-detail" replace />} />
                        {
                            visibleApps.map(app => <Route path={app.key} element={app.component} key={`app-${app.id}`} />)
                        }
                        
                    </Routes>
                </Suspense>
            </RoutableTabs>
        </TabContainer>
    );
}
