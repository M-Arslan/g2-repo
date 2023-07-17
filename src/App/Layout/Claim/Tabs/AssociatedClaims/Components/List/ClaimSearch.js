import React from 'react';
import {
    useGraphQL
} from '../../../../../../Core/Providers/GraphQL/useGraphQL';
import {
    SearchDrawer
} from '../../../../../Common/Components/SearchDrawer';
import {
    SearchConferDB2Claims
} from '../../Queries/SearchConferDB2Claims';
import {
    SearchFSRIDB2Claims
} from '../../Queries/SearchFSRIDB2Claims';
import {
    SearchDB2Claims
} from '../../Queries/SearchDB2Claims';
import {
    ClaimSearchResult
} from './ClaimSearchResult';
import { useSelector, useDispatch } from 'react-redux';
import { claimSelectors } from '../../../../../../Core/State/slices/claim';
import { useNotifications } from '../../../../../../Core/Providers/NotificationProvider/NotificationProvider';
import { LEGAL_ENTITY } from '../../../../../../Core/Enumerations/app/legal-entity';
import { STAT_TYPES } from '../../../../../../Core/Enumerations/app/claim-type';
import { STATUTORY_SYSTEM } from '../../../../../../Core/Enumerations/app/statutory-system';
let mainApp = '';
export const ClaimSearch = ({ open, onClaimsSelected}) => {
    const claim = useSelector(claimSelectors.selectData());
    const $notifications = useNotifications();

    const $api = useGraphQL({
        search: SearchDB2Claims,
        searchConfer: SearchConferDB2Claims,
        searchFSRI: SearchFSRIDB2Claims
    });


    const claimSearch = async (searchTerm, searchType) => {
        if (claim.g2LegalEntityID === LEGAL_ENTITY.GENESIS_REINSURANCE && (claim.statutorySystem === null || claim.statutorClaimID)) {
            $notifications.notifyError('Please assign the Statutory Claim ID and Statutory System First');
            return;
        }


        /*        try {*/
        let res = "";
        if (claim.g2LegalEntityID === LEGAL_ENTITY.GENERAL_STAR || claim.g2LegalEntityID === LEGAL_ENTITY.GENESIS_INSURANCE || (claim.g2LegalEntityID === LEGAL_ENTITY.GENESIS_REINSURANCE && claim.statutorySystem == STAT_TYPES.NATRE)) {
            res = await $api.search({ searchType, searchTerm, g2LegalEntityID: claim.g2LegalEntityID, statSystem: claim?.statutorySystem, includeLegal: false })
        }
        else if (claim.g2LegalEntityID === LEGAL_ENTITY.GENESIS_REINSURANCE || claim.g2LegalEntityID === null) {
            if (claim.statutorySystem === STATUTORY_SYSTEM.FSRI) {
                res = await $api.searchFSRI({ filterType: searchType, filterValue: searchTerm });
            } else {

                res = await $api.searchConfer({ filterType: searchType, filterValue: searchTerm });
            }

        }

        if (res.length && mainApp === 'LEGAL') {
            res = res.filter((x) => x.claimID.includes('DJ'));
            
        }

        return res;
        /*const res2 = await $api.searchConfer({ filterType:searchType, filterValue:searchTerm });*/
        //const res2 = await $api.searchFSRI({ filterType: searchType, filterValue: searchTerm });
        /*const res3 = await $api.searchFSRI({ searchType, searchTerm });*/
        /*} catch (e) {
        console.error('[ClaimSearch] error in DB2 Claim search:', e);
        return Promise.resolve([]);
        }*/
    };

    React.useEffect(() => {
        if (window.location.href.includes('legal')) {
            mainApp = 'LEGAL'
        }
    },[])

    return (
        <SearchDrawer
            title="Claim Search"
            onSearch={claimSearch}
            onResultSelected={onClaimsSelected}
            options={{
                multiSelect: true,
                multiFilter: true,
                filterOptions: [
                    { label: 'Policy Number', value: 'P' },
                    { label: 'Claim ID', value: 'C' },
                    claim.statutorySystem !== STATUTORY_SYSTEM.FSRI && { label: 'Insured Name', value: 'I' }
                ],
                defaultFilter: 'C',
                noResultsMessages: {
                    C: 'Claim number provided not found in GenServe',
                    P: 'No claims found in GenServe for this policy number',
                    I: 'No Claims found with this insured name',
                }
            }}
            displayMessageFlag={claim.g2LegalEntityID === LEGAL_ENTITY.GENESIS_REINSURANCE && claim.statutorySystem == STAT_TYPES.NATRE}
            open={open}
        >
            {
                res => <ClaimSearchResult claim={res} />
            }
        </SearchDrawer>
    );
}