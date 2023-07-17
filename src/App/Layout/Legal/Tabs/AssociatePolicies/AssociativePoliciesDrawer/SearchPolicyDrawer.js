import React from 'react';
import styled from 'styled-components';
import {
    useGraphQL
} from '../../../../../Core/Providers/GraphQL/useGraphQL';
import {
    SearchDB2Policy
} from '../Queries/SearchDB2Policy';
import {
    SearchDrawer
} from '../../../../Common/Components/SearchDrawer';
import {
    PolicySearchResult
} from './PolicySearchResult';

import {
    useSnackbar
} from 'notistack';

export const FieldContainer = styled.div`
    width: 100%;
    height: 50px;
    padding: .25em 1em;
    margin-bottom: .5em;
`;


export const SearchPolicyDrawer = ({ open, onPolicySelected , request, dispatch, claim  }) => {

    const { enqueueSnackbar } = useSnackbar();

    const $api = useGraphQL({
        search: SearchDB2Policy
    });

    const genesisFilter = {
        multiSelect: false,
        multiFilter: true,
        filterOptions: [
            { label: 'Policy Number / Contract Number', value: 'P' },
            { label: 'Insured Name', value: 'I' }
        ],
        defaultFilter: 'C',
        noResultsMessages: {
            P: 'No Policy found for this policy number',
            I: 'No Policy found with this insured name',
        }
    };

    const generalStarFilter = {
        multiSelect: false,
        multiFilter: true,
        filterOptions: [
            { label: 'Policy Number', value: 'P' },
            { label: 'Insured Name', value: 'I' }
        ],
        defaultFilter: 'C',
        noResultsMessages: {
            P: 'No Policy found for this policy number',
            I: 'No Policy found with this insured name',
        }
    };

    const policySearch = async (searchTerm, searchType) => {
        if (searchType === "P" && searchTerm.length < 3) {
            enqueueSnackbar("Minimum character length 3 is required.", { variant: 'error',  anchorOrigin: { vertical: 'top', horizontal: 'center' } });
            return;
        }
        let company = request.selectedMenu;
        let g2LegalEntityID = claim.g2LegalEntityID;
        try {
            return await $api.search({ searchType, searchTerm, company, g2LegalEntityID });
        } catch (e) {
            console.error('[PolicySearch] error in DB2 Policy search:', e);
            return Promise.resolve([]);
        }
    };
    return (
        <>
            <SearchDrawer
                title={request.selectedMenu === "GENERALSTAR" ? "General Star Policy Search" : "Genesis Policy Search"}
                onSearch={policySearch}
                onResultSelected={onPolicySelected}
                options={request.selectedMenu === "GENERALSTAR" ? generalStarFilter : genesisFilter}
                open={open}
            >
                {
                    res => <PolicySearchResult policy={res} />
                }
            </SearchDrawer>
        </>
        );
}