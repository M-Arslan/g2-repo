import React from 'react';
import {
    ListItemAvatar,
    ListItemText,
    Avatar
} from '@mui/material';
import {
    Work,
} from '@mui/icons-material';
import {
    SearchDrawer
} from '../../../../../Common/Components/SearchDrawer';
import {
    useGraphQL
} from '../../../../../../Core/Providers/GraphQL/useGraphQL';
import {
    SearchResources
} from '../../../../../Common/Queries/SearchResources';
import {
    ensureNonEmptyArray
} from '../../../../../../Core/Utility/rules';
import {
    makeEvent
} from '../../../../../../Core/Utility/makeEvent';

export const ContactSearch = ({ id, open, exclude = [], onResourceSelected }) => {

    const $api = useGraphQL({
        search: SearchResources
    });

    const resourceSearch = async (searchTerm, searchBy) => {
        try {
            const resources = await $api.search({ searchTerm, searchBy, type: null });
            return resources.filter(r => (ensureNonEmptyArray(exclude) !== true || exclude.every(id => id !== r.resourceID) === true));
        } catch (e) {
            console.error('[ContactSearch] error in Resource search:', e);
            return Promise.resolve([]);
        }
    };

    const selectResource = (res) => {
        if (typeof onResourceSelected === 'function') {
            const rid = (ensureNonEmptyArray(res.result) ? res.result[0].resourceID : null);
            onResourceSelected(makeEvent(id, { confirmed: (res.confirmed === true && rid != null), resourceID: rid }));
        }
    }

    return (
        <SearchDrawer
            title="Contact Search"
            onSearch={resourceSearch}
            onResultSelected={selectResource}
            options={{
                multiFilter: true,
                filterOptions: [
                    { label: 'Name', value: 'N' },
                    { label: 'License State', value: 'S' },
                    { label: 'Attn Contact', value: 'A' },
                    { label: 'Email Address', value: 'E' },
                ],
                autoSubmit: true,
                defaultFilter: 'N',
                noResultsMessages: {
                    N: 'No resources found matching this name',
                    S: 'No resources found with this License State',
                    A: 'No resources found with this Attn Contact',
                    E: 'No respurces found with this Email Address'
                },
                anchor: 'left',
            }}
            open={open}>
            {
                res => (
                    <>
                        <ListItemAvatar>
                            <Avatar><Work /></Avatar>
                        </ListItemAvatar>
                        <ListItemText primary={res.companyName} secondary={
                            <span>
                                {res.address1 || res.address2 ? <span style={{ display: "block" }}>{res.address1 || ''} {res.address2 || ''}</span> : ''}

                                {res.attentionContact ? <span style={{ display: "block" }}>{res.attentionContact || ''}</span> : ''}

                                {res.city || res.state || res.zip ? <span style={{ display: "block" }}>{res.city + ',' || ''} {res.state || ''} {res.zip || ''}</span> : ''}

                                {`${res.emailAddress || ''}`}
                            </span>
                        } />
                    </>
                )
            }
        </SearchDrawer>
    );

}