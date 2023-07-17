import moment from 'moment-timezone';
import React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import {
    BroadcastEvents, useBroadcaster
} from '../../../../../Core/Providers/BroadcastProvider';
import { claimSelectors } from '../../../../../Core/State/slices/claim';
import {
    ensureNonEmptyArray,
    ensureNonEmptyString
} from '../../../../../Core/Utility/rules';
import { safeObj } from '../../../../../Core/Utility/safeObject';
import {
    useAppHost
} from '../../AppHost';
import {
    DownloadModal
} from './Download/DownloadModal';
import {
    AddActivityLogDrawer
} from './Drawer/AddActivityLogDrawer';
import {
    ViewActivityLogDrawer
} from './Drawer/ViewActivityLogDrawer';
import {
    ActivityLogList
} from './List';


const Container = styled.section`
    display: block;
    height: 100%;
    width: 100%;
    padding: 0;
    border: 0;
    margin: 0;
`;

export const TabComponent = ({ asyncResult, requestSave , claim }) => {

    const $host = useAppHost();
    const $broadcaster = useBroadcaster();

    const [viewOpen, setViewOpen] = React.useState(false);
    const [downloadOpen, setDownloadOpen] = React.useState(false);
    const [viewData, setViewData] = React.useState(null);
    const [addOpen, setAddOpen] = React.useState(false);
    const [addSupervisorOpen, setAddSupervisorOpen] = React.useState(false);
    const claimData = useSelector(claimSelectors.selectData());
    React.useEffect(() => {
        return $broadcaster.subscribe(BroadcastEvents.RequestNewNarrative, (args) => {
            if (safeObj(args).isSupervisor === true) {
                setAddSupervisorOpen(true);
            }
            else {
                setAddOpen(true);
            }
        });
    }, []);

    React.useEffect(() => {
        return $broadcaster.subscribe(BroadcastEvents.RequestExportActivityLog, () => {
            setDownloadOpen(true);
        });
    }, []);

    const onAddNew = async (res) => {

        if (res.confirmed === true && ensureNonEmptyString(res.content)) {
            const claimNarrative = {
                claimMasterID: $host.claimMasterId,
                narrative: res.content,
                raw: res.raw,
                createdByDisplayName: $host.currentUser.fullName,
                isSupervisor: (res.isSupervisor === true),
                userCreatedDate: (moment.tz(moment.tz.guess()).format("l LTS z"))
            };

            await requestSave({ claimNarrative }, false);
            setAddOpen(false);
            setAddSupervisorOpen(false);
        }
        else {
            setAddOpen(false);
            setAddSupervisorOpen(false);
        }
    };

    const onReadMore = (entry) => {
        setViewData(entry);
        setViewOpen(true);
    };

    const closeReadMore = () => {
        setViewData(null);
        setViewOpen(false);
    }

    const downloadComplete = () => {
        setDownloadOpen(false);
    }

    const rowData = (ensureNonEmptyArray(asyncResult) ? asyncResult : []);

    return (
        <Container>
            <DownloadModal open={downloadOpen} onClose={downloadComplete} rowData={rowData} />
            <ActivityLogList rowData={rowData} onReadMore={onReadMore} />
            <AddActivityLogDrawer open={addOpen} onClose={onAddNew} claim={claimData} />
            <AddActivityLogDrawer open={addSupervisorOpen} onClose={onAddNew} isSupervisor={true} claim={claimData} />
            <ViewActivityLogDrawer open={viewOpen} onClose={closeReadMore} content={viewData} claim={claimData} />
        </Container>
    );
};