import React from 'react';
import {
    useBroadcaster,
    BroadcastEvents
} from '../../../../../Core/Providers/BroadcastProvider';
import {
    CreateWizard
} from './Create/CreateWizard';
import {
    ensureNonEmptyString
} from '../../../../../Core/Utility/rules';
import {
    useAppHost
} from '../../AppHost';
import {
    safeArray,
    safeObj
} from '../../../../../Core/Utility/safeObject';
import {
    withAsyncOperation
} from '../../../../../Core/Providers/AsyncProvider/withAsyncOperation';
import {
    GetCorrespondence
} from '../Queries/GetCorrespondence';
import {
    RemoveCorrespondence
} from '../Queries/RemoveCorrespondence';
import {
    SaveCorrespondence
} from '../Queries/SaveCorrespondence';
import {
    CorrespondenceGrid as View
} from './View/CorrespondenceGrid';

/**
 * @typedef {object} CorrespondenceModel
 * @property {string} correspondenceID
 * @property {string} claimMasterID
 * @property {string} from - whom the email is from
 * @property {string} to - whom the email is to
 * @property {string} cc - list of people CC'd on the email
 * @property {string} bcc - list of people BCC'd on the email
 * @property {string} subject - the email subject line
 * @property {string} body - the email body
 */

/**
 * @typedef {object} CorrespondenceTabProps
 * @property {CorrespondenceModel[]} asyncResult - list of Correspondence to display (injected prop)
 * @property {Function} onSave - callback to force save operation (injected prop)
 */

export const PAGES = Object.freeze({
    CREATE: 0,
    VIEW: 1,
});

/**
 * Correspondence tab is the composer component for the Correspondence app
 * @param {CorrespondenceTabProps} props - Component props
 */
const Tab = ({ asyncResult, requestRefresh, dispatch }) => {

    const $host = useAppHost();
    const $broadcaster = useBroadcaster();


    const DEFAULT_REQUEST = {
        correspondenceID: '',
        from: ($host.currentUser.emailAddress || ''),
        claimMasterID: $host.claimMasterId,
        claimNumber: $host.claim.claimID,
        addToDocumentum: false,
        status: 1,
        createdDate: new Date(),
        createdBy: 'SYSTEM'
    };

    const [request, setRequest] = React.useState({
        ...DEFAULT_REQUEST
    });

    const [showPage, setShowPage] = React.useState(PAGES.VIEW);

    React.useEffect(() => {
        $broadcaster.subscribe(BroadcastEvents.RequestNewCorrespondence, () => {
            setRequest({ ...DEFAULT_REQUEST });
            setShowPage(PAGES.CREATE);
        });

    }, []);

    const onFinishCreate = () => {
        console.log(`[CorrespondenceTab::onFinishCreate] executed while page is "${showPage}"`);
        setShowPage(PAGES.VIEW);
        requestRefresh();
    };

    const onEdit = (record) => {
        setRequest({ ...DEFAULT_REQUEST, ...safeObj(record) });
        setShowPage(PAGES.CREATE);
    };

    const onDelete = (id) => {
        if (ensureNonEmptyString(id)) {
            dispatch({
                type: 'delete',
                args: { id }
            });
        }
    };

    return (
        <>
            {
                showPage === PAGES.CREATE ?
                    <CreateWizard id="create-correspondence" onCompleted={onFinishCreate} initialState={request} /> :
                    <View rowData={safeArray(asyncResult)} onDelete={onDelete} onEdit={onEdit} />
            }
        </>
    );
};

export const CorrespondenceTab = withAsyncOperation(Tab, GetCorrespondence, SaveCorrespondence, {
    delete: RemoveCorrespondence
});