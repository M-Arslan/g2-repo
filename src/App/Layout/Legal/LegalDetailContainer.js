import React from 'react';
import styled from 'styled-components';
import {
    LegalDetailHeader
} from './LegalDetailHeader';
import {
    ensureNonEmptyString,
    ensureNonNullObject
} from '../../Core/Utility/rules';
import {
    useDispatch,
    useSelector
} from 'react-redux';
import {
    configSelectors
} from '../../Core/State/slices/config';
import {
    claimSelectors
} from '../../Core/State/slices/claim';
import {
    usersActions
} from '../../Core/State/slices/users';
import {
    LegalClaimSelectors
} from '../../Core/State/slices/legal-claim';
import {
    LegalRouter
} from './LegalTabs';
import {
    companiesActions,
    
} from '../../Core/State/slices/metadata/companies';
import {
    Menu
} from '@mui/icons-material';
import { MenuButton } from '../Common/Components/MenuButton';

const LegalContainer = styled.div`
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

const LegalInfoToolbar = styled.div`
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


export const LegalDetailContainer = () => {
    const $dispatch = useDispatch();
    const claim = useSelector(claimSelectors.selectData());
    const legalClaim = useSelector(LegalClaimSelectors.selectData());
   // const legalClaim = useSelector(LegalClaimSelectors.get('26A705D3-5C08-40B5-A4BA-037E4AAB30D6'));

    /** @type {import('../../../types.d').AppConfig} */
    const config = useSelector(configSelectors.selectData());
    

    React.useEffect(() => {
        
        $dispatch(companiesActions.get());
        $dispatch(usersActions.getAllUsers());
    }, [])


    if (ensureNonNullObject(claim) !== true) {
        return <LegalContainer></LegalContainer>;
    }

    const menuItems = [];
    if (ensureNonNullObject(claim)) {

        if (ensureNonEmptyString(claim.statutoryClaimID)) {
            menuItems.push({
                label: 'View CARA Legal Claim File',
                handler: () => window.open(`${config.caraStatClaimFileUrl}${claim.statutoryClaimID}`)
            });
        }
        else if (ensureNonEmptyString(claim.claimID)) {
            menuItems.push({
                label: 'View CARA Legal Claim File',
                handler: () => window.open(`${config.caraClaimLegalFileURL}${claim.claimID}`)
            });
        }

    }

  

    return (
        <LegalContainer>
            <FlexContainer>
                <LegalInfoToolbar>
                    <LegalDetailHeader />
                    <Toolbuttons>
                        <MenuButton id="legal-cara-links-menu" items={menuItems}>
                            <Menu />
                        </MenuButton>
                    </Toolbuttons>
                </LegalInfoToolbar>
                <LegalRouter claim={claim} legalClaim={legalClaim} />
            </FlexContainer>
        </LegalContainer>
    );
}
