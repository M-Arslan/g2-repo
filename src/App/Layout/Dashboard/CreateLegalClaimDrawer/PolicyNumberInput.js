import React, { forwardRef, useImperativeHandle }  from 'react';
import styled from 'styled-components';
import {
    IconButton
} from '@mui/material';
import {
    Search,
    CheckCircleOutline,
    HighlightOff
} from '@mui/icons-material';
import {
    TextInput
} from '../../../Core/Forms/Common';
import {
    customGQLQuery
} from '../../../Core/Services/EntityGateway';



export const STATUS = Object.freeze({
    EMPTY: 99,
    SEARCHING: 0,
    VALID: 1,
    INVALID: -1
});



const Wrapper = styled.div`
    width: 100%;
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-start;
    align-items: center;
    align-content: center;
    padding: 0;
    margin: 0;
    border: 0;
`;



export const PolicyNumberInput = forwardRef(( onChange, ref, onSearchStatusChanged , isPolicyValidStatus ) => {
    const [status, setStatus] = React.useState(STATUS.EMPTY);
    const [policyNumber, setPolicyNumber] = React.useState('');
    const [error, setError] = React.useState(false);


    const changeStatusTo = (newStatus) => {
        if (status !== newStatus) {
            if (typeof onSearchStatusChanged === 'function' && newStatus != STATUS.SEARCHING) {
                onSearchStatusChanged({
                    previous: status,
                    current: newStatus,
                });
            }
            setStatus(newStatus);
        }
    };



    const onValueChanged = (evt) => {
        const pn = (typeof evt.target.value === 'string' ? evt.target.value.trim() : '');
        setPolicyNumber(pn);
        changeStatusTo(STATUS.EMPTY);
    }
    useImperativeHandle(
        ref,
        () => ({
            checkPolicy() {
                if (policyNumber.trim().length > 0 && status === STATUS.EMPTY) {
                    setError(true);
                    return false;
                }
                else {
                    return true;
                }
            },
            getPolicyID() {
                return policyNumber;
            },
            getPolicyStatus() {
                return status;
            }
            
        }),
    )


    const onSearchClick = async () => {
        changeStatusTo(STATUS.SEARCHING);

        try {
            const query = {
                "query": `
                    query {
                       policy(id:"${policyNumber}"){ 
                                insuredName
                                insuredNameContinuation
                                departmentCode
                                departmentName
                        } 
                    }
                    `
            };

            const policyResult = await customGQLQuery(`policy`, query);
            const policy = ((policyResult || {}).data || {}).policy;



            if (typeof policy === 'object' && policy !== null) {
                changeStatusTo(STATUS.VALID);
                if (typeof onChange === 'function') {
                    onChange({ target: { name: 'claimPolicyID', value: policyNumber, policy } });
                }
                setError(false);
            }
            else {
                changeStatusTo(STATUS.INVALID);
            }
        }
        catch (ex) {
            console.error('[PolicyNumberInput] failed policy number validation', ex);
            changeStatusTo(STATUS.INVALID);
        }
    };



    return (
        <>
            <Wrapper>
                <TextInput
                    label="Policy Number"
                    fullWidth={true}
                    value={policyNumber}
                    name="claimPolicyID"
                    onChange={onValueChanged}
                    disabled={status === STATUS.SEARCHING}
                    error={status === STATUS.INVALID}
                    variant="outlined"
                    maxLength="10"
                />
                <IconButton onClick={onSearchClick} disabled={status !== STATUS.EMPTY}>
                    {
                        (status === STATUS.VALID ? <CheckCircleOutline style={{ color: 'green' }} /> :
                            (status === STATUS.INVALID ? <HighlightOff style={{ color: 'red' }} /> :
                                <Search color="primary" />
                            )
                        )
                    }
                </IconButton>
            </Wrapper>
            {error ? <span style={{ color: 'red', padding: '5px', fontSize: '10px' }}>Policy ID is not verified</span> : null}
        </>
    );
});