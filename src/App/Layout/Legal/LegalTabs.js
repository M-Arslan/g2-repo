import React, { Suspense } from 'react';
import styled from 'styled-components';
import { APP_TYPES } from '../../Core/Enumerations/app/app-types';
import { useSelector } from 'react-redux';
import { userSelectors } from '../../Core/State/slices/user';
import { RoutableTabs } from '../Common/Components/RoutableTabs/RoutableTabs';
import { Routes, Route, Navigate } from 'react-router-dom';
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

const ClaimDetailAppTab = React.lazy(() => import('./Tabs/LegalClaim/LegalClaimDetailApp'));
const ULClaimAppTab = React.lazy(() => import('./Tabs/ULClaim'));
const AssocPolicyAppTab = React.lazy(() => import('./Tabs/AssociatePolicies'));
const ActivityLogAppTab = React.lazy(() => import('../Claim/Tabs/ActivityLog'));
const ContactsAppTab = React.lazy(() => import('../Claim/Tabs/Contacts'));
const AssocClaimsAppTab = React.lazy(() => import('../Claim/Tabs/AssociatedClaims'));
const CorrespondenceAppTab = React.lazy(() => import('../Claim/Tabs/Correspondence/CorrespondenceApp'));
const NotificationsAppTab = React.lazy(() => import('../Notifications/NotificationCenter/NotificationCenter'));
const FinancialsAppTab = React.lazy(() => import('../Claim/Tabs/Accounting'));
const CourtSuitsAppTab = React.lazy(() => import('./Tabs/CourtSuits'));

export const LegalRouter = ({ claim, legalClaim }) => {

    const $auth = useSelector(userSelectors.selectAuthContext());

    const apps = [
        { id: APP_TYPES.Legal_Claim_Detail, key: 'claim-detail', label: 'Legal Claim Detail', hide: (claim.claimType !== CLAIM_TYPES.LEGAL), component: <ClaimDetailAppTab claim={claim} legalClaim={legalClaim} /> },
        { id: APP_TYPES.UL_Claim_Detail, key: 'ul-claim-detail', label: 'U/L Claim', hide: (claim.claimType !== CLAIM_TYPES.LEGAL), component: <ULClaimAppTab claim={claim} /> },
        { id: APP_TYPES.Associated_Policies_Contracts, key: 'associated-policies-contracts', label: 'Associated Policies/Contracts', hide: (claim.claimType !== CLAIM_TYPES.LEGAL), component: <AssocPolicyAppTab claim={claim} /> },
        { id: APP_TYPES.Contacts, key: 'contacts', label: 'Contacts', component: <ContactsAppTab /> },
        { id: APP_TYPES.Assoc_Claims, key: 'associated-claims', label: 'Assoc Claims', component: <AssocClaimsAppTab claim={claim} /> },
        { id: APP_TYPES.Correspondence, key: 'correspondence', label: 'Correspondence', component: <CorrespondenceAppTab /> },
        { id: APP_TYPES.File_Activity_Log, key: 'file-activity-log', label: 'File Activity Log', component: <ActivityLogAppTab /> },
        { id: APP_TYPES.Notifications, key: 'notifications', label: 'Notifications', component: <NotificationsAppTab claim={claim} /> },
        { id: APP_TYPES.Court_Suit_Information, key: 'court-suits', label: 'Court & Suit Information', component: <CourtSuitsAppTab claim={claim} /> },
        { id: APP_TYPES.Financials, key: 'financials', label: 'Financials', component: <FinancialsAppTab claim={claim} /> },
    ];

    const visibleApps = apps.filter(a => a.hide !== true && $auth.hasPermission(a.id));

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

};