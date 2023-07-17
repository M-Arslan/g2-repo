import {
    CloudDownload,
    PostAdd
} from '@mui/icons-material';
import React from 'react';
import { APP_TYPES } from '../../../../Core/Enumerations/app/app-types';
import {
    BroadcastEvents, useBroadcaster
} from '../../../../Core/Providers/BroadcastProvider';
import {
    AppHost,
    useAppHost
} from '../AppHost';
import {
    ActivityLogTab
} from './Components';

/**
 * ActivityLogApp - application level component for the File Activity Log tab on Claim Detail
 * @constructor
 * */
export const ActivityLogApp = () => {

    const $host = useAppHost();

    const $broadcaster = useBroadcaster();

    React.useEffect(() => {

        $host.removeMenuButtons();
        if ($host.appIsReadonly !== true) {
            $host.addMenuButtons([
                {
                    label: 'Add Examiner Note',
                    icon: PostAdd,
                    handler: () => $broadcaster.publish(BroadcastEvents.RequestNewNarrative, { isSupervisor: false }),
                },
                {
                    label: 'Add Supervisor Note',
                    icon: PostAdd,
                    handler: () => $broadcaster.publish(BroadcastEvents.RequestNewNarrative, { isSupervisor: true }),
                }

            ]);
        }

        $host.addMenuButtons({
            label: 'Export Activity Log',
            icon: CloudDownload,
            handler: () => $broadcaster.publish(BroadcastEvents.RequestExportActivityLog),
        });

    }, [$host.appIsReadonly]);

    return <ActivityLogTab context={{ claimMasterID: $host.claimMasterId, isSupervisor: null }} />;
};

export default () => (
    <AppHost app={APP_TYPES.File_Activity_Log}>
        <ActivityLogApp />
    </AppHost>
);
