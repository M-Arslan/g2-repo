import { Close as CloseIcon } from '@mui/icons-material';
import {
    Button,
    IconButton, Modal
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import React from 'react';
import styled from 'styled-components';
import { Panel, PanelContent, PanelHeader } from '../../../../../../Core/Forms/Common';
import {
    useGraphQL
} from '../../../../../../Core/Providers/GraphQL/useGraphQL';
import {
    useNotifications
} from '../../../../../../Core/Providers/NotificationProvider/NotificationProvider';
import { ensureNonEmptyString } from '../../../../../../Core/Utility/rules';
import { safeObj } from '../../../../../../Core/Utility/safeObject';
import { useAppHost } from '../../../AppHost';
import { GetExport } from '../../Queries/GetExport';

const useStyles = makeStyles((theme) => ({
    root: {
        flex: 1,
    },
    datepickerHeight: {
        height: 25,
    },
    gridButton: {
        paddingRight: '0px !important',
        paddingLeft: '0px !important',
    },
    iconButton: {
        paddingRight: '5px !important',
        paddingLeft: '5px !important',
    },
    paper: {
        position: 'absolute',
        width: "90%",
        height: '90%',
        
        border: 'none',
        borderRadius: '4px',
        padding: 0,
    },
    panelContent: {
        display: 'flex',
        flexDirection: 'column',
        gap: '30px',
        backgroundColor:'white'
    },
}));

const CenteredRow = styled.div`
    text-align: center;
    padding: 1em;
    width: 100%;
    height: ${props => props.height || 'auto'};
`;

function getModalStyle() {
    const top = 50;
    const left = 50;
    

    return {
        top: `${top}%`,
        left: `${left}%`,
        width: `90%`,
        transform: `translate(-${top}%, -${left}%)`,
    };
}

const DL_STATUS = {
    WAITING: 'waiting',
    PROCESSING: 'processing',
    COMPLETE: 'complete'
}
export const DownloadExtractModal = ({ open, onClose }) => {

    const $host = useAppHost();
    const $notifications = useNotifications();
    const classes = useStyles();
    const $api = useGraphQL({
        download: GetExport
    });

    const [modalStyle] = React.useState(getModalStyle);
    const [pdfData, setPdfData] = React.useState('');
    const [downloading, setDownloading] = React.useState(DL_STATUS.WAITING);

    const requestClose = () => {
        setPdfData('');
        setDownloading(DL_STATUS.WAITING)
        onClose();
    }

    const startDownload = () => {
        setPdfData('');
        setDownloading(DL_STATUS.PROCESSING);
        $api.download({ claimMasterID: $host.claimMasterId }).then(result => {
            const pdfContent = safeObj(result).document;
            if (ensureNonEmptyString(pdfContent)) {
                setPdfData(`data:application/pdf;base64,${safeObj(result).document}`);
                setDownloading(DL_STATUS.COMPLETE);
            }
            else {
                setPdfData('');
                setDownloading(DL_STATUS.WAITING);
                $notifications.notifyError('There was an error processing the export file.');
            }
        });
    }

    const getStageMessage = () => {
        return (downloading === DL_STATUS.COMPLETE ? 'Your file is ready for download' : (downloading === DL_STATUS.PROCESSING ? 'Please wait while we prepare your file for download.' : 'Please click the button below to start preparing the download.  This process may take a minute.'));
    }

    return (
        <Modal
            open={open}
            onClose={requestClose}
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
        >
            <div style={modalStyle} className={classes.paper}>
                <Panel height="100%" width="100%">
                    <PanelHeader>
                        <span>Generate Extract Document</span>
                        <IconButton onClick={onClose} size="small">
                            <CloseIcon />
                        </IconButton>
                    </PanelHeader>
                    <PanelContent className={classes.panelContent}>
                        <CenteredRow height="20%">
                            <p>{getStageMessage()}</p>
                            {
                                downloading === DL_STATUS.COMPLETE ? <Button id="download-pdf" download={`${$host.claim.claimID} - Extract.pdf`} href={pdfData} variant="contained" color="primary">Click Here to Download PDF Export</Button>
                                    : (downloading === DL_STATUS.WAITING ? <Button id="start-download" onClick={startDownload} variant="contained" color="primary">Process Document for Download</Button> : <div style={{ height: '33px' }}>&nbsp;</div>)
                            }
                        </CenteredRow>
                        <CenteredRow height="80%">
                            {
                                ensureNonEmptyString(pdfData) ?
                                    <div style={{ height: '100%', overflow: 'hidden', width: '100%' }}>
                                        <object data={`${pdfData}`} type="application/pdf" height="100%" width="100%" title="Document Preview"></object>
                                    </div> :
                                    <div>When the document is prepared, the preview will be visible here</div>
                            }
                        </CenteredRow>
                    </PanelContent>
                </Panel>
            </div>
        </Modal>
    );
}

