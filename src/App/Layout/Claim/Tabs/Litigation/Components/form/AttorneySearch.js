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
    useGraphQL
} from '../../../../../../Core/Providers/GraphQL/useGraphQL';
import {
    SearchResources
} from '../../../../../Common/Queries/SearchResources';
import {
    SearchDrawer
} from '../../../../../Common/Components/SearchDrawer';

export const AttorneySearch = ({ open, onResourceSelected }) => {

    const $api = useGraphQL({
        search: SearchResources
    });

    const resourceSearch = async (searchTerm) => {
        try {
            return await $api.search({ searchBy: 'N', searchTerm, type: 2 });
        } catch (e) {
            console.error('Error in Resource search:', e);
            return Promise.resolve([]);
        }
    };

    return (
        <SearchDrawer
            title="Attorney Search"
            onSearch={resourceSearch}
            onResultSelected={onResourceSelected}
            open={open}>
            {
                res => (
                    <>
                        <ListItemAvatar>
                            <Avatar><Work /></Avatar>
                        </ListItemAvatar>
                        <ListItemText primary={res.companyName} secondary={
                            <span>
                                {res.address1 || res.address2 ? <span style={{ display: "block" }}>{res.address1 || ''} {res.address2 || ''}</span> :'' }
              
                                {res.attentionContact ? <span style={{ display: "block" }}>{res.attentionContact || ''}</span> : ''}

                                {res.city || res.state || res.zip ? <span style={{ display: "block" }}>{res.city + ',' || ''} {res.state || ''} {res.zip || ''}</span>  : ''}
                            
                                {`${res.emailAddress || ''}`}
                            </span>
                        } />
                    </>
                    )
            }
        </SearchDrawer>
    );
}