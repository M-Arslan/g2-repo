import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import {
    BroadcastEvents, useBroadcaster
} from '../../../../../Core/Providers/BroadcastProvider';
import { assocClaimsActions, assocClaimsSelectors } from '../../../../../Core/State/slices/assoc-claims';
import {
    ensureNonEmptyArray,
    ensureNonEmptyString
} from '../../../../../Core/Utility/rules';
import {
    useAppHost
} from '../../AppHost';
import {
    ClaimSearch
} from './List/ClaimSearch';
import {
    ClaimList
} from './List/ClaimList';
import {
    useSnackbar
} from 'notistack';

const Container = styled.section`
display: block;
height: 100%;
width: 100%;
padding: 0;
border: 0;
margin: 0;
`;

export const AssociatedClaimsTab = ({ claim, loadAsssociatedClaims }) => {
    const { enqueueSnackbar } = useSnackbar();
    const $host = useAppHost();
    const $broadcaster = useBroadcaster();
    const $dispatch = useDispatch();
    const assocClaims = useSelector(assocClaimsSelectors.selectData());
    const [searchOpen, setSearchOpen] = React.useState(false);
    let duplicateClaims = assocClaims;

    React.useEffect(() => {
        return $broadcaster.subscribe(BroadcastEvents.RequestAssocClaimDrawerOpen, () => setSearchOpen(true));
    }, []);

    const onDelete = async (id) => {
        if (ensureNonEmptyString(id)) {
            await $dispatch(assocClaimsActions.delete({ id }));
        }
        if (typeof loadAsssociatedClaims === 'function') {
            loadAsssociatedClaims();
        }
    };

    /**
    * Handles the selection event of the ClaimSearch
    * @param {import('../../../../../Common/Components/SearchDrawer').SelectionResult} res - result event
    */
    const onAddNew = async (res) => {
        if (res.confirmed === true && ensureNonEmptyArray(res.result)) {
            const claims = await res.result.map(c => ({ claimMasterID: $host.claimMasterId, claimID: c.claimID }));
            const sameClaim = claims.filter((i) => i.claimID === claim.claimID);
            const duplicate = duplicateClaims.length ? claims.filter((i) => {
                return duplicateClaims.find((j) => {
                    return i.claimID === j.claimID;
                })
            }) : null ;
            if (sameClaim.length) {
                enqueueSnackbar(`The current claim and the assocated claim can't be same`, { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' } })
                return
            }
            if (duplicate?.length) {
                enqueueSnackbar(`The Associated claims can't be duplicated`, { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' } })
                return
            }
            await $dispatch(assocClaimsActions.add({ data: { claims } }));
        }
        if (typeof loadAsssociatedClaims === 'function') {
            loadAsssociatedClaims();
        }

        setSearchOpen(false);

    };

    const rowData = (ensureNonEmptyArray(assocClaims) ? assocClaims : []);

    return (
        <Container>
            <ClaimList rowData={rowData} onDelete={onDelete} />
            <ClaimSearch open={searchOpen} onClaimsSelected={onAddNew} claim={claim} />
        </Container>
    );
};