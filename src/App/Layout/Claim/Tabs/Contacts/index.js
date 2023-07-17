import React from 'react';
import {
    ContactsTab
} from './Components/ContactsTab';
import {
    PersonAdd
} from '@mui/icons-material';
import {
    BroadcastEvents,
    useBroadcaster
} from '../../../../Core/Providers/BroadcastProvider';
import {
    AppHost,
    useAppHost
} from '../AppHost';
import {
    CONTACT_TYPE
} from './contact-type';
import {
    useDispatch,
    useSelector
} from 'react-redux';
import {
    claimSelectors
} from '../../../../Core/State/slices/claim';
import {
    contactsActions,
    contactsSelectors
} from '../../../../Core/State/slices/contact';
import {
    ensureNonEmptyString,
    ensureNonNullObject
} from '../../../../Core/Utility/rules';
import {
    ASYNC_STATES
} from '../../../../Core/Enumerations/redux/async-states';
import {
    Spinner
} from '../../../../Core/Forms/Common';
import { APP_TYPES } from '../../../../Core/Enumerations/app/app-types';

/**
 * ContactsApp - application level component for the Contacts tab on Claim Detail
 * @constructor
 * @returns {React.Component}
 * */
export const ContactsApp = () => {

    const $host = useAppHost();
    const $broadcaster = useBroadcaster();
    const $dispatch = useDispatch();
    const claim = useSelector(claimSelectors.selectData());
    const loadStatus = useSelector(contactsSelectors.selectLoading());
    const isLegalApp = window.location.href.toLowerCase().indexOf("legal") > -1;

    React.useEffect(() => {
        if (ensureNonNullObject(claim) && ensureNonEmptyString(claim.claimMasterID) && loadStatus !== ASYNC_STATES.SUCCESS) {
            $dispatch(contactsActions.get({ claimMasterId: claim.claimMasterID }));
        }
    }, [claim.claimMasterID]);

    React.useEffect(() => {
        $host.addMenuButtons([
            {
                label: 'Add Claimant Contact',
                icon: PersonAdd,
                handler: () => $broadcaster.publish(BroadcastEvents.RequestContactsDrawerOpen, { contactType: CONTACT_TYPE.CLAIMANT }),
                disabled: (ctx) => ctx.appIsReadonly === true,
            },
            {
                label: 'Add Insured Contact',
                icon: PersonAdd,
                handler: () => $broadcaster.publish(BroadcastEvents.RequestContactsDrawerOpen, { contactType: CONTACT_TYPE.INSURED }),
                disabled: (ctx) => ctx.appIsReadonly === true,
            },
            {
                label: 'Add Misc Contact',
                icon: PersonAdd,
                handler: () => $broadcaster.publish(BroadcastEvents.RequestContactsDrawerOpen, { contactType: CONTACT_TYPE.MISC }),
                disabled: (ctx) => ctx.appIsReadonly === true,
            },
            {
                label: 'Add Involved Party',
                icon: PersonAdd,
                handler: () => $broadcaster.publish(BroadcastEvents.RequestContactsDrawerOpen, { contactType: CONTACT_TYPE.INVOLVED }),
                disabled: (ctx) => ctx.appIsReadonly === true,
            },
            {
                label: isLegalApp ? 'Search Attorney Contact' :'Search for Contact',
                icon: PersonAdd,
                handler: () => $broadcaster.publish(BroadcastEvents.RequestContactsDrawerOpen, { contactType: CONTACT_TYPE.LOOKUP }),
                disabled: (ctx) => ctx.appIsReadonly === true,
            },
        ]);
    }, []);

    return (loadStatus === ASYNC_STATES.SUCCESS ? <ContactsTab /> : <Spinner />);
};

export default () => (
    <AppHost app={APP_TYPES.Contacts}>
        <ContactsApp />
    </AppHost>
);