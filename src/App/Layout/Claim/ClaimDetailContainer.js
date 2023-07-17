import React from 'react';
import styled from 'styled-components';
import {
    ClaimRouter
} from './ClaimTabs';
import {
    ClaimDetailHeader
} from './ClaimDetailHeader';
import {
    Menu
} from '@mui/icons-material';
import {
    MenuButton
} from '../Common/Components/MenuButton';
import {
    ensureNonEmptyString,
    ensureNonNullObject
} from '../../Core/Utility/rules';
import {
    useSelector
} from 'react-redux';
import {
    configSelectors
} from '../../Core/State/slices/config';
import {
    claimSelectors
} from '../../Core/State/slices/claim';
import { Unauthorized } from '../Unauthorized';
import { userSelectors } from '../../Core/State/slices/user';
import { CLAIM_TYPES } from '../../Core/Enumerations/app/claim-type';

const ClaimContainer = styled.div`
    height: 100%;
    width: 100%;
    margin: 0;
    padding: 0;
    background-color: ${props => props.theme.primaryColor};
`;

const FlexContainer = styled.article`
    height: 100%;
    width: 100%;
    display: flex;
    flex-flow: column nowrap;
    justify-content: flex-start;
    align-content: stretch;
    align-items: stretch;
`;

const ClaimInfoToolbar = styled.div`
    background-color: ${props => props.theme.backgroundDark};
    height: 60px;
    width: 100%;
    padding: 0;
    border-bottom: solid 1px ${props => props.theme.backgroundDark};
    margin-bottom: 1em;
    border-radius: 4px;

    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    align-content: center;
    align-items: center;
`;

const Toolbuttons = styled.div`
    height: 36px;
    width: 5%;
    display: flex;
    flex-flow: row wrap;
    justify-content: flex-end;
    align-content: center;
`;


export const ClaimDetailContainer = () => {
    const $auth = useSelector(userSelectors.selectAuthContext());
    const claim = useSelector(claimSelectors.selectData());

    /** @type {import('../../../types.d').AppConfig} */
    const config = useSelector(configSelectors.selectData());

    if (ensureNonNullObject(claim) !== true) {
        return <ClaimContainer></ClaimContainer>;
    }


    const checkIsAuthorized = () => {
        let flag = false;
        if (claim.g2LegalEntityID === null) {
            flag =  true;
        }
        else {
            $auth?.userCompanies.filter(x => {
                if (x.G2LegalEntityID === claim.g2LegalEntityID) {
                    flag = true;
                }
            })
        }

        return flag;

    }

    const menuItems = [];
    if (ensureNonNullObject(claim)) {
        if (ensureNonEmptyString(claim.claimPolicyID)) {
            menuItems.push({
                label: 'View CARA UW File',
                handler: () => window.open(`${config.caraClaimUwFileUrl}${claim.claimPolicyID}`)
            });
        }

        if (ensureNonEmptyString(claim.statutoryClaimID)) {
            menuItems.push({
                label: 'View CARA Claim File',
                handler: () => window.open(`${config.caraStatClaimFileUrl}${claim.statutoryClaimID}`)
            });
        }
        else if (ensureNonEmptyString(claim.claimID)){
            menuItems.push({
                label: 'View CARA Claim File',
                handler: () => window.open(`${config.caraClaimFileUrl}${claim.claimID}`)
            });
        }

        if (ensureNonEmptyString(claim.claimType) && claim.claimType === CLAIM_TYPES.LEGAL && ensureNonEmptyString(claim.claimID)) {
            menuItems.push({
                label: 'View CARA UW Claim File',
                handler: () => window.open(`${config.caraClaimUwFileUrl}${claim.claimID}`)
            });
        }
    }


  
   
    return (
        <ClaimContainer>
            {checkIsAuthorized() ?
                <FlexContainer>
                    <ClaimInfoToolbar>
                        <ClaimDetailHeader />
                        <Toolbuttons>
                            <MenuButton id="cara-links-menu" items={menuItems}>
                                <Menu />
                            </MenuButton>
                        </Toolbuttons>
                    </ClaimInfoToolbar>
                    <ClaimRouter claim={claim} />
                </FlexContainer>
                : <Unauthorized/>}
        </ClaimContainer>
    );
}
