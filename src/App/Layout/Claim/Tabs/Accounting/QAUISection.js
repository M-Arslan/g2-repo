import {
    AccordionDetails as ExpansionPanelDetails, Button,
    Checkbox, Divider,
    FormControlLabel,
    FormGroup, MenuItem
} from '@mui/material';
import { makeStyles } from '@mui/styles';



import { AgGridReact } from 'ag-grid-react';
import { useSnackbar } from 'notistack';
import React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { ROLES } from '../../../../Core/Enumerations/security/roles';
import { CLAIM_STATUS_TYPE } from '../../../../Core/Enumerations/app/claim-status-type';
import { formatDate, Panel, PanelContent, PanelHeader, SelectList, TextInput, Spinner } from '../../../../Core/Forms/Common';
import { userSelectors } from '../../../../Core/State/slices/user';
import IssueLogCommentRenderer from './IssueLogCommentRenderer';
import { loadQALogs, loadQASystemCheck, saveQALogs, saveQASystemCheck } from './Queries';

const useStyles = makeStyles((theme) => ({
    panelDetails: {
        flexDirection: "column"
    }
}));
const ContentRow = styled.div`
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-start;
    align-items: center;
    align-content: center;
`;

const ContentCell = styled.div`
    width: ${props => props.width || '50%'};
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-start;
    align-items: center;
    align-content: center;
    padding: 1em;tr
`;
const GridContainer = styled.div`
    height: 500px;
    width: auto;
`;

export const QAUISection = ({ claim, request, dispatch, formValidator, onSave, onPaymentClaimActivityCompleted }) => {
    const { enqueueSnackbar } = useSnackbar();
    const classes = useStyles();
    const $auth = useSelector(userSelectors.selectAuthContext());
    const isClaimAccountant = $auth.isInRole(ROLES.Claims_Accountant);
    const currentClaimActivity = request.currentClaimActivity || {};
    const [metadata, setMetadata] = React.useState({
        loading: true,
        qaLogs: [],
        qaSystemCheck: [],
    });
    const [qACommentError, setQACommentsError] = React.useState(false);
    const [reload, setReload] = React.useState(false);

    const [state, setState] = React.useState({
        loaded: false,
        data: [{'QAReviewer':'GRN\HANASIR','QADate':'10-02-2003','QAComment':'QA is passed'}],
        QAComment: "",
        QAGrade: '',
        genServeChecked: metadata.qaSystemCheck.genServeChecked || 0,
        frsiChecked: metadata.qaSystemCheck.frsiChecked || 0,
        conferChecked: metadata.qaSystemCheck.conferChecked || 0,
        reload: false,
    });

    const onValueChanged = (evt) => {
        state[evt.target.name] = evt.target.value;
        setState(state);
    };
    const onSelectionValueChanges = async (evt) => {
        const newRequest = { ...state, [evt.target.name]: evt.target.checked };
        setState(newRequest);

        newRequest.genServeChecked = newRequest.genServeChecked == 0 ? false : true;
        newRequest.conferChecked = newRequest.conferChecked == 0 ? false : true;
        newRequest.frsiChecked = newRequest.frsiChecked == 0 ? false : true;

        const newObj = { 
            qASystemCheckID: metadata?.qaSystemCheck?.qASystemCheckID || null,
            activityID: request.currentClaimActivity.activityID,
            genServeChecked: newRequest.genServeChecked,
            conferChecked: newRequest.conferChecked,
            frsiChecked: newRequest.frsiChecked,
            createdDate: metadata?.qaSystemCheck?.createdDate,
            createdBy: metadata?.qaSystemCheck?.createdBy
        }; 
        
        let result = await saveQASystemCheck(newObj);
        if (result.data.createQASystemCheck === null) {
            setReload(true);
            enqueueSnackbar("Value saved Successfully", { variant: 'success', anchorOrigin: { vertical: 'top', horizontal: 'center' } });

        }
        else if (result.data.createQASystemCheck.qASystemCheckID) {
            setReload(true);
            enqueueSnackbar("Value saved Successfully", { variant: 'success', anchorOrigin: { vertical: 'top', horizontal: 'center' } });

        }
    };

    const colDefs = [
        {
            headerName: 'QA Reviewer',
            field: 'createdBy',
            tooltipField: "QA Reviewer",
        },
        {
            headerName: 'QA Comments',
            field: 'comment',
            tooltipField: "QA Comments",
            cellRenderer: 'IssueLogCommentRenderer',
            wrapText: true,
            width: 500,
            floatingFilterComponentParams: { suppressFilterButton: true }
        },
        {
            headerName: 'QA Grade',
            field: 'grade',
            tooltipField: "QA Grade",
        }, 
        {
            headerName: 'QA Date',
            field: 'createdDate',
            tooltipField: "Reported Date",
            valueGetter: function (params) {
                return formatDate(params.data.createdDate);
            }
        }, 
    ]
    const defaultColDef = {
        cellClass: 'cell-wrap-text',
        cellStyle: { 'white-space': 'normal' },
        sortable: false,
        resizable: true,
    };
    const frameworkComponents = {
        IssueLogCommentRenderer: IssueLogCommentRenderer,
    };
    const saveQAReview = async () => {
        if (state.QAComment === '' || state.QAGrade === '') {
            enqueueSnackbar("Both Comment and Grade are required", { variant: 'error',  anchorOrigin: { vertical: 'top', horizontal: 'center' } });
            return;
        }
        if (!state.QAComment.replace(/\s/g, '').length) {
            enqueueSnackbar("Comment's Field only contains white spaces.", { variant: 'error',  anchorOrigin: { vertical: 'top', horizontal: 'center' } });
            setQACommentsError(true);
            return;
        }
        setQACommentsError(false)
        dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, isSaving: true, isProcessing: true } });
        const newRequest = {
            activityID: request.currentClaimActivity.activityID,
            comment: state.QAComment,
            grade: state.QAGrade,
        }
        const QALogResult = await saveQALogs(newRequest);
        ParseGQErrors(QALogResult.errors, QALogResult.error);
        enqueueSnackbar("QA Log Created Successfully", { variant: 'success', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
        dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, isSaving: false, isProcessing: false } });
        if (request.currentClaimActivity.claimStatusTypeID === CLAIM_STATUS_TYPE.QA_PENDING)
            await onPaymentClaimActivityCompleted();
    }   

    React.useEffect(() => {
        loadMetaData();
    }, [reload]);


    async function loadMetaData() {
        let qaLogs = await loadQALogs(request.currentClaimActivity.activityID);
        let qASystemCheck = await loadQASystemCheck(request.currentClaimActivity.activityID); 
        setMetadata({
            loading: false,
            qaLogs: (qaLogs.data.qALogList || []),
            qaSystemCheck: qASystemCheck.data.qASystemCheckList.length ? qASystemCheck?.data?.qASystemCheckList[0] : [],
        });
        setState({
            ...state,
            genServeChecked: qASystemCheck?.data?.qASystemCheckList[0].genServeChecked || 0,
            frsiChecked: qASystemCheck?.data?.qASystemCheckList[0].frsiChecked || 0,
            conferChecked: qASystemCheck?.data?.qASystemCheckList[0].conferChecked || 0,
        })
    }

    function ParseGQErrors(errors, error) {
        if (error || errors) {
            enqueueSnackbar("An error occured.", { variant: 'error',  anchorOrigin: { vertical: 'top', horizontal: 'center' } });
        }
    }

    return (

        <Panel>
            <PanelHeader><span style={{ fontWeight: 'bold', fontSize: '14px' }}>QA UI Section</span></PanelHeader>
            {metadata.loading ? <Spinner /> : (<PanelContent>
                <ContentRow>
                    <ContentCell width="25%"><span style={{ fontWeight: 'bold' }}> Claim ID:</span></ContentCell>
                    <ContentCell width="25%">{claim.claimID}</ContentCell>
                    <ContentCell width="25%"><span style={{ fontWeight: 'bold' }}> Activity Transaction Status</span></ContentCell>
                    <ContentCell width="25%">{request.currentClaimActivity.claimStatusTypeType.statusText}</ContentCell>
                </ContentRow>
                <ContentRow>
                    <ContentCell width="25%"><span style={{ fontWeight: 'bold' }}> Insured Name:</span></ContentCell>
                    <ContentCell width="50%">{claim.insuredName ? claim.insuredName : (claim.claimPolicy ? claim.claimPolicy.insuredName :  claim.policy ? claim.policy.insuredName : '' )}</ContentCell>
                </ContentRow> 
                <ContentRow>
                    <ContentCell width="25%"><span style={{ fontWeight: 'bold' }}> Activity Transaction Type:</span></ContentCell>
                    <ContentCell width="50%">{request.currentClaimActivity.accountingTransTypeText}</ContentCell>
                </ContentRow>
                <Divider />
                <ContentRow>
                    <ContentCell width="25%"><span style={{ fontWeight: 'bold' }}>QA Review</span></ContentCell>
                </ContentRow>
                <ExpansionPanelDetails className={classes.panelDetails}>
                    <FormGroup row>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    id="genServeChecked"
                                    name="genServeChecked"
                                    color="primary"
                                    disabled={isClaimAccountant ? false : true}
                                    checked={state.genServeChecked}
                                    onChange={onSelectionValueChanges}
                                />
                            }
                            label="GenServe Checked"
                        />
                    </FormGroup>
                    <FormGroup row>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    id="conferChecked"
                                    name="conferChecked"
                                    color="primary"
                                    disabled={isClaimAccountant ? false : true}
                                    checked={state.conferChecked}
                                    onChange={onSelectionValueChanges}
                                />
                            }
                            label="CONFER Checked"
                        />
                    </FormGroup>
                    <FormGroup row>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    id="frsiChecked"
                                    name="frsiChecked"
                                    color="primary"
                                    disabled={isClaimAccountant ? false : true}
                                    checked={state.frsiChecked}
                                    onChange={onSelectionValueChanges}
                                />
                            }
                            label="FSRI Checked"
                        />
                    </FormGroup>
                </ExpansionPanelDetails>
               
                <ContentRow>
                    <ContentCell width="50%">
                        <TextInput
                            label="QA Comments"
                            id="QAComment"
                            name="QAComment"
                            disabled={isClaimAccountant ? false : true}
                            fullWidth={true}
                            helperText={(qACommentError ? 'Comments only contains white spaces' : '')}
                            onChange={onValueChanged}                            
                            inputProps={{
                                maxLength: 1024,
                            }}
                        />
                    </ContentCell>
                    <ContentCell width="30%">
                        <SelectList
                            id="QAGrade"
                            name="QAGrade"
                            label="QA Grade"
                            variant="outlined"
                            onChange={onValueChanged}
                            disabled={isClaimAccountant ? false : true}
                            allowempty={false}
                            required
                        >
                            <MenuItem value="P">QA Pass</MenuItem>
                            <MenuItem value="F">QA Fail</MenuItem>
                        </SelectList>
                    </ContentCell>
                    <ContentCell>
                        <Button onClick={saveQAReview} disabled={isClaimAccountant ? false : true} variant="contained" color="primary" style={{ marginLeft: '1em' }}>Add</Button>
                    </ContentCell>
                </ContentRow>
                <Divider />
                <ContentRow>
                    <ContentCell width="25%"><span style={{ fontWeight: 'bold' }}>QA Review</span></ContentCell>
                </ContentRow>
                
            </PanelContent>
            )}
            <GridContainer className="ag-theme-balham">
                <AgGridReact
                    columnDefs={colDefs}
                    rowData={metadata.qaLogs ? (metadata.qaLogs ? metadata.qaLogs : []) : []}
                    pagination={true}
                    paginationPageSize={10}
                    defaultColDef={defaultColDef}
                    frameworkComponents={frameworkComponents}
                >
                </AgGridReact>
            </GridContainer>
        </Panel>
    );
};
