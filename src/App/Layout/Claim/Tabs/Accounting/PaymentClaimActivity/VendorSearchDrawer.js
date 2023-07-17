import { Avatar, ListItemAvatar, ListItemText } from '@mui/material';
import { Work } from '@mui/icons-material';
import React from 'react';
import { ensureNonEmptyArray } from '../../../../../Core/Utility/rules';
import { SearchDrawer } from '../../../../Common/Components/SearchDrawer';
import { searchDB2Vendors } from '../Queries';

export const VendorSearchDrawer = ({ open, onResourceSelected }) => {

    const resourceSearch = async (searchTerm) => {
        try {
            let result = await searchDB2Vendors(searchTerm);
            return result.data.db2VendorSearch;
        } catch (e) {
            return Promise.resolve([]);
        }
    };

    /**
     * Handles selection event
     * @param {import('../../../../Common/Components/SearchDrawer').SelectionResult} res
     */
    const resourceSelect = (res) => {
        if (res.confirmed === true && ensureNonEmptyArray(res.result)) {
            onResourceSelected(res.result[0]);
        } else
        {
            onResourceSelected({});
        }
    }

    return (
        <SearchDrawer
            title="Vendor Search"
            onSearch={resourceSearch}
            onResultSelected={resourceSelect}
            open={open}>
            {
                res => (
                    <>
                        <ListItemAvatar>
                            <Avatar><Work /></Avatar>
                        </ListItemAvatar>
                        <ListItemText primary={res.vendorName1} secondary={
                            <span>
                                {`${res.address || ''} ${res.address || ''}`}
                                <br />
                                {`${res.city || ''}, ${res.state || ''}  ${res.zip || ''}`}
                            </span>
                        } />
                    </>
                )
            }
        </SearchDrawer>
    );

}