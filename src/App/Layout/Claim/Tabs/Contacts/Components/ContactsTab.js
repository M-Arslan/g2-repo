import React from 'react';
import styled from 'styled-components';
import {
    ContactList
} from './ContactList';
import {
    useAppHost
} from '../../AppHost';
import {
    ensureIsNumber,
    ensureNonEmptyArray,
    ensureNonEmptyString,
    ensureNonNullObject
} from '../../../../../Core/Utility/rules';
import {
    safeObj
} from '../../../../../Core/Utility/safeObject';
import {
    useBroadcaster,
    BroadcastEvents
} from '../../../../../Core/Providers/BroadcastProvider';
import {
    CONTACT_TYPE
} from '../contact-type';
import {
    InputDrawer
} from './Drawer/InputDrawer';
import {
    ContactSearch
} from './Drawer/ContactSearch';
import {
    useDispatch,
    useSelector
} from 'react-redux';
import {
    contactsActions,
    contactsSelectors
} from '../../../../../Core/State/slices/contact';
import {
    AttorneySearch
} from '../../Litigation/Components/form/AttorneySearch';

const Container = styled.section`
    display: block;
    height: 100%;
    width: 100%;
    padding: 0;
    border: 0;
    margin: 0;
`;

export const ContactsTab = () => {

    const $host = useAppHost();
    const $broadcaster = useBroadcaster();
    const $dispatch = useDispatch();

    /** @type {Array<import('../../../../../Core/State/slices/contact/types.d').Contact} */
    const contacts = Array.from(useSelector(contactsSelectors.selectData())).sort((a, b) => (new Date(b.createdDate)).getTime() - (new Date(a.createdDate)).getTime());

    const isLegalApp = window.location.href.toLowerCase().indexOf("legal") > -1;

    const [inputOpen, setInputOpen] = React.useState(false);
    const [inputContext, setInputContext] = React.useState(null);
    const [searchOpen, setSearchOpen] = React.useState(false);

    const openInput = (init) => {
        setInputContext({ ...safeObj(init) });
        setInputOpen(true);
    };

    const openSearch = () => {
        setSearchOpen(true);
    }

    React.useEffect(() => {
        $broadcaster.subscribe(BroadcastEvents.RequestContactsDrawerOpen, (args) => {
            if (ensureNonNullObject(args) && ensureNonEmptyString(args.contactType)) {
                if (args.contactType === CONTACT_TYPE.LOOKUP) {
                    openSearch();
                }
                else {
                    const p = { ...args, claimMasterID: $host.claimMasterId, resourceID: null };
                    openInput(p);
                }
            }
        });
    }, []);

    const deleteRow = (id) => {
        if (ensureNonEmptyString(id)) {
            $dispatch(contactsActions.delete({ id }));
        }
    };

    const saveRecordChanges = (result) => {
        if (result.confirmed === true && ensureNonNullObject(result.contact)) {
            $dispatch(contactsActions.save({ data: result.contact }));
        }

        setInputOpen(false);
        setInputContext(null);
    };

    const saveLookup = (evt) => {
        const { value } = evt.target;
        if (value.confirmed === true && ensureIsNumber(value.resourceID)) {
            const data = { claimMasterID: $host.claimMasterId, resourceID: value.resourceID, contactType: CONTACT_TYPE.LOOKUP };
            $dispatch(contactsActions.save({ data }))
        }
        setSearchOpen(false);
    };

    const onResourceSelected = (evt) => {      
        const { value } = evt.target || { value: { confirmed: evt.confirmed, resourceID: evt.result ? evt.result[0].resourceID : "" } };
        if (value.confirmed === true && ensureIsNumber(value.resourceID)) {
            const data = { claimMasterID: $host.claimMasterId, resourceID: value.resourceID, contactType: CONTACT_TYPE.LOOKUP };
            $dispatch(contactsActions.save({ data }))
        }
        setSearchOpen(false);
    };

    return (
        <Container>
            <ContactList rowData={contacts} onRequestDelete={deleteRow} onRequestEdit={openInput} />
            <InputDrawer onClose={saveRecordChanges} open={inputOpen} initialRequest={inputContext} />
            {!isLegalApp && <ContactSearch id="contact-search" onResourceSelected={saveLookup} open={searchOpen} exclude={(ensureNonEmptyArray(contacts) ? Array.from(new Set(contacts.map(r => r.resourceID))) : [])} />}
            {isLegalApp && <AttorneySearch id="contact-search" open={searchOpen} onResourceSelected={onResourceSelected} />}
            </Container>
    );
};