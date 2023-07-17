import { Button } from '@mui/material';



import { AgGridReact } from 'ag-grid-react';
import { useSnackbar } from 'notistack';
import React from 'react';
import styled from 'styled-components';
import { Panel, PanelContent, PanelHeader, TextInput, formatDate } from '../../../../../Core/Forms/Common';
import { saveCMSRejectedLog } from '../queries';
import { loadHelpTags, findHelpTextByTag } from '../../../../Help/Queries';
import correctedCMSCellRenderer  from './correctedCMSCellRenderer';
import rejectedCMSCellRenderer from './rejectedCMSCellRenderer';
import { useSelector } from 'react-redux';
import { APP_TYPES } from '../../../../../Core/Enumerations/app/app-types';
import { userSelectors } from '../../../../../Core/State/slices/user';
import { FAL_CLAIM_STATUS_TYPES } from '../../../../../Core/Enumerations/app/fal_claim-status-types';


const GridContainer = styled.div`
    height: 400px;
    width: 100%;
    margin:0px

`;
const ContentRow = styled.div`
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-start;
    align-items: center;
    align-content: center;
`;

const ContentCell = styled.div`
    width: 100%;
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-start;
    align-items: center;
    align-content: center;
    padding: .5em;
`;

export const CMSRejectedLogsSection = ({claim, request, dispatch, formValidator, onSave }) => {
    const { enqueueSnackbar } = useSnackbar();
    const $auth = useSelector(userSelectors.selectAuthContext());
    const isViewer = claim.fALClaimStatusTypeID === FAL_CLAIM_STATUS_TYPES.CLOSED || claim.fALClaimStatusTypeID === FAL_CLAIM_STATUS_TYPES.ERROR|| $auth.isReadOnly(APP_TYPES.Claimant);
    const [isValid, setIsValid] = React.useState(true);
    const currentCMSRejectedLog = request.currentCMSRejectedLog || {};
    const [metadata, setMetadata] = React.useState({
        loading: true,
        helpTags: []
    });
    React.useEffect(() => {
        Promise.all([
            loadHelpTags(request.helpContainerName)
        ])
            .then(([helpTags]) => {
                setMetadata({
                    loading: false,
                    helpTags: (helpTags.data.list || []),
                });
            });
    }, []);

    const columnDefs = [
        {
            headerName: 'Rejected Date',
            field: 'rejectDate',
            flex: 1.5,
            sort:'asc',
            valueGetter: function (params) {
                return formatDate(params.data.rejectDate);
            },
        },
        {
            headerName: 'Rejection Reason',
            field: 'rejectReason',
            flex: 3,
            cellRenderer: 'rejectedCMSCellRenderer',
        },
        {
            headerName: 'Corrected Date',
            field: 'correctedDate',
            flex: 1.5,
            sort: 'asc',
            valueGetter: function (params) {
                return formatDate(params.data.correctedDate);
            }
        },
        {
            headerName: 'Corrected Comment',
            field: 'correctedComment',
            flex: 3,
            cellRenderer: 'correctedCommentCellRenderer',
        }

    ];

    const frameworkComponents = {
        correctedCommentCellRenderer: correctedCMSCellRenderer,
        rejectedCMSCellRenderer: rejectedCMSCellRenderer
    };


    const defaultColDef = {
        cellClass: 'cell-wrap-text',
        cellStyle: { 'white-space': 'normal' },
        flex: 1,
        sortable: true,
        resizable: true,
        filter: true,
    };

    const onSaveCMSRejectedLog = async () => {
        try {
            let valid = true;

            if (currentCMSRejectedLog.correctedComment) {
                valid = true;
                setIsValid(true);
            } else {
                valid = false;
                setIsValid(false);
            }

            if (valid) {
                dispatch({ type: 'UPDATE_UNIVERSAL_REQUEST', request: { ...request, isSaving: true } });

                let result = await saveCMSRejectedLog(currentCMSRejectedLog);

                ParseGQErrors(result.errors, result.error);
                console.log(result.data.saveCMSRejectedLog);

                request.currentClaimant.medicare.cMSRejected = false;
                request.currentClaimant.medicare.cMSRejectedLogs = JSON.parse(JSON.stringify(result.data.saveCMSRejectedLog));
                console.log(request.currentClaimant.medicare.cMSRejectedLogs);
                request.currentCMSRejectedLog = {};
                request.isSaving = false;
                request.cMSRejectedLogKey = request.cMSRejectedLogKey + 1;
                request.originalClaimant = JSON.parse(JSON.stringify(request.currentClaimant));
                enqueueSnackbar("CMS Rejected Log information has been updated successfully.", { variant: 'success', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
                dispatch({ type: 'UPDATE_UNIVERSAL_REQUEST', request: { ...request } });
            }
        } catch (e) {
            enqueueSnackbar(e.toString(), { variant: 'error',  anchorOrigin: { vertical: 'top', horizontal: 'center' } });
            dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, isSaving: false, isProcessing: false } });
        }

    };

    const onCancelCMSRejectedLog = async () => {
        request.currentCMSRejectedLog = {};
        dispatch({ type: 'UPDATE_UNIVERSAL_REQUEST', request: { ...request } });
    }

    const onValueChanged = (evt) => {
        request.currentCMSRejectedLog.correctedComment = evt.target.value.trimStart();
        dispatch({ type: 'UPDATE_UNIVERSAL_REQUEST', request: { ...request } });
    };

    function onRowClicked(row) {
        request.currentCMSRejectedLog = { ...row.data };
        dispatch({ type: 'UPDATE_UNIVERSAL_REQUEST', request: { ...request } });
    }

    function ParseGQErrors(errors, error) {
        if (error || errors) {
            console.log("An error occured: ", errors);
            console.log("An error occured: ", error);
            enqueueSnackbar("An error occured.", { variant: 'error',  anchorOrigin: { vertical: 'top', horizontal: 'center' } });
        }
    }


    return (
        <Panel>
            <PanelHeader><span style={{ fontWeight: 'bold', fontSize: '14px' }}>CMS Rejection Logs</span></PanelHeader>
            <PanelContent>
                <ContentRow>
                    <ContentCell width="70%">
                        <TextInput
                            key={currentCMSRejectedLog.cMSRejectLogID}
                            disabled={isViewer || !currentCMSRejectedLog.cMSRejectLogID || currentCMSRejectedLog.correctedDate}
                            id="correctedComment"
                            name="correctedComment"
                            label="Correction Comment"
                            fullWidth={true}
                            variant="outlined"
                            value={currentCMSRejectedLog.correctedComment}
                            error={!isValid}
                            helperText={!isValid ? "This field is required." : ""}
                            onChange={onValueChanged}
                            tooltip={findHelpTextByTag("correctedComment", metadata.helpTags)}
                            inputProps={{ maxlength: 500 }}
                        />
                    </ContentCell>
                    <ContentCell width="30%">
                        <Button variant="contained" color="primary" loading={true} onClick={onSaveCMSRejectedLog} style={{ margin: '10px' }} disabled={isViewer || !currentCMSRejectedLog.cMSRejectLogID || currentCMSRejectedLog.correctedDate}>Save</Button>
                        <Button variant="contained" color="secondary" onClick={onCancelCMSRejectedLog} style={{ margin: '10px' }} disabled={isViewer || !currentCMSRejectedLog.cMSRejectLogID || currentCMSRejectedLog.correctedDate}>Cancel</Button>
                    </ContentCell>
                </ContentRow>

                <ContentRow>
                    <ContentCell width="100%">
                        <GridContainer className="ag-theme-balham">
                            <AgGridReact
                                columnDefs={columnDefs}
                                defaultColDef={defaultColDef}
                                frameworkComponents={frameworkComponents}
                                rowData={((request.currentClaimant.medicare || {}).cMSRejectedLogs || [])}
                                onRowClicked={onRowClicked}
                                rowSelection="single"
                                key={request.cMSRejectedLogKey}
                            />
                        </GridContainer>
                    </ContentCell>
                </ContentRow>
            </PanelContent>
        </Panel>
    );
};

