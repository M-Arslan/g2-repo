import React from 'react';
import styled from 'styled-components';
import {
    TextInput,
} from '../../../../Core/Forms/Common';
import {
    IconButton
} from '@mui/material';
import {
    Search,
    CheckCircleOutline,
} from '@mui/icons-material';
import {
    FieldContainer
} from './FieldContainer';
import {
    customGQLQuery
} from '../../../../Core/Services/EntityGateway';

const SearchField = styled.div`
    width: 100%;
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-start;
    align-content: center;
    margin-top: .5em;
`;

export const DrawerSearch = ({ isClosed = false, onSearchComplete }) => {
    const [isSearching, setIsSearching] = React.useState(false);
    const [claimId, setClaimId] = React.useState('');
    const [hasError, setHasError] = React.useState(false);
    const [untouched, setUntouched] = React.useState(true);
    const [valid, setValid] = React.useState(false);
    React.useEffect(() => {
       
            setClaimId('');
            setHasError(false);
            setValid(false);
            setIsSearching(false);
        
    }, [isClosed]);

  

   const onValueChanged = (evt) => {
       const val = (typeof evt.target.value === 'string' ? evt.target.value.trim().toUpperCase() : evt.target.value);

       if (typeof val !== 'string' || val === '' || val.length > 20 || /^[a-zA-Z0-9]{5,20}$/.test(val) !== true) {
            setHasError(true);
        }
        else if (hasError === true) {
            setHasError(false);
        }

       if (untouched === true) {
           setUntouched(false);
       }

       setClaimId(val);
    }

    const claimSearch = async () => {
        if (untouched !== true) {
            setIsSearching(true);
            try {
                let searchDataObj = {
                    claimID: claimId,
                };

                let query = {
                    query: `query($search:ClaimMasterSearchInputhype!)
                    {
                        searchByClaimId(search: $search)
                        {
                            claimID
                            claimsMasterSearchResult {
                                claimID
                                claimMasterID
                            }
                        }
                    }`,
                    variables: {
                        search: searchDataObj
                    }
                }

                const searchResult = await customGQLQuery(`claim-master-search`, query);
                const claims = searchResult.data.searchByClaimId.claimsMasterSearchResult;
                setIsSearching(false);

                if (typeof onSearchComplete === 'function') {
                    const foundClaim = (Array.isArray(claims) ? claims.find(c => c.claimID.toUpperCase() === claimId.toUpperCase()) : null);
                    const claimMasterId = (typeof foundClaim === 'object' && foundClaim !== null ? foundClaim.claimMasterID : null);
                    if (claimMasterId === null) {
                        setValid(false);
                    }
                    else {
                        setValid(true);
                    }
                    onSearchComplete({ claimId, claimMasterId });

                }
            } catch (e) {
                setIsSearching(false);
                setClaimId('');
                console.error(e);
            }
        }
    };

    return (
        <FieldContainer style={{ marginBottom: '1.75em' }}>
            {
                isSearching ? <div>Please wait ... </div> : <SearchField>
                    <TextInput
                        id="claimId"
                        label="Claim ID"
                        value={claimId}
                        onChange={onValueChanged}
                        error={hasError === true}
                        helperText="Must be 5-12 alphanumeric characters"
                    />
                    <IconButton onClick={claimSearch} size="small" style={{ marginBottom: '17px' }}>
                        {
                            (valid ? <CheckCircleOutline style={{ color: 'green' }} /> :
                                <Search color="primary" />
                            )
                        }
                    </IconButton>

                    
                </SearchField>
            }
        </FieldContainer>
    );
};