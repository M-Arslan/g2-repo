import { Button, Divider } from '@mui/material';



import { AgGridReact } from 'ag-grid-react';
import { useSnackbar } from 'notistack';
import React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { APP_TYPES } from '../../../../Core/Enumerations/app/app-types';
import { formatDate, Panel, PanelContent, PanelHeader, Spinner, TextInput } from '../../../../Core/Forms/Common';
import { userSelectors } from '../../../../Core/State/slices/user';
import { usersSelectors } from '../../../../Core/State/slices/users';
import GeneralCommentRenderer from './GeneralCommentRenderer';
import { loadGeneralComments } from './Queries';
import { saveGeneralComment } from './Queries/saveGeneralComment';
import { CLAIM_STATUS_TYPE } from '../../../../Core/Enumerations/app/claim-status-type';
import { ROLES } from '../../../../Core/Enumerations/security/roles';


const GridContainer = styled.div`
    height: 90%;
    width: 100%;
`;

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
    padding: 1em;
`;
export const ActivityGeneralComments = (({ claim, request, dispatch }) => {
    const { enqueueSnackbar } = useSnackbar();
    const $auth = useSelector(userSelectors.selectAuthContext());
    const users = useSelector(usersSelectors.selectData());

    //const isClaimAccountant = $auth.isInRole(ROLES.Claims_Accountant);
    const [create, setCreate] = React.useState(false);
    const [generalCommentError, setgeneralCommentError] = React.useState(false);
    const isViewer = $auth.isReadOnly(APP_TYPES.Financials);
    const [state, setState] = React.useState({
        loaded: false,
        data: [],
        comment: "",
    });

    const colDefs = [
        {
            headerName: 'Created Date',
            field: 'createdDate',
            tooltipField: "Reported Date",
            sort: 'desc',
            valueGetter: function (params) {
                return formatDate(params.data.createdDate);
            }
        },
        {
            headerName: 'Created By',
            field: 'createdBy',
            tooltipField: "Created By",
            cellRenderer: function (params) {
                let selected_users = users.filter(x => x.userID.toLowerCase() === params.data.createdBy.toLowerCase());
                if (selected_users.length > 0) {
                    return selected_users[0].fullName;
                }
            }
        },
        {
            headerName: 'Comment',
            field: 'comment',
            tooltipField: "Comment",
            cellRenderer: 'GeneralCommentRenderer',
            wrapText: true,
            width: 600,
            floatingFilterComponentParams: { suppressFilterButton: true }
        },



    ]

    const frameworkComponents = {
        GeneralCommentRenderer: GeneralCommentRenderer
   };

    const defaultColDef = {
        cellClass: 'cell-wrap-text',
        cellStyle: { 'white-space': 'normal' },
        sortable: false,
        rowHeight: 'auto',
        resizable: true,
    };

    function onCellValueChanged(event) {
        var issuelog = event.data;
        issuelog.claimStatusTypeID = event.data.claimStatusTypeID === 'Open' ? CLAIM_STATUS_TYPE.OPEN.toString() : CLAIM_STATUS_TYPE.CLOSED_PI_1.toString();
    }
    const onClick = async () => {
        dispatch({ type: 'UPDATE_UNIVERSAL_REQUEST', request: { ...request, isProcessing: true, isSaving: true } });

        let error = false;
        if (state.comment === '') {
            setgeneralCommentError(true);
            error = true;
        }
        if (!state.comment.replace(/\s/g, '').length) {
            enqueueSnackbar("Comment's field only contains white spaces.", { variant: 'error',  anchorOrigin: { vertical: 'top', horizontal: 'center' } });
            setgeneralCommentError(true);
            error = true;
        }
        if (error) {
            enqueueSnackbar("Field is required", { variant: 'error',  anchorOrigin: { vertical: 'top', horizontal: 'center' } });
            dispatch({ type: 'UPDATE_UNIVERSAL_REQUEST', request: { ...request, isProcessing: false, isSaving: false } });
            return;
        }
        setgeneralCommentError(false);
        var generalComment = {
            "comment": state.comment,
            "activityID": request.currentClaimActivity.activityID
        }
        let result = await saveGeneralComment(generalComment);
        if (result.data.saveGeneralComment.generalCommentID) {
            setCreate(!create);
        }
        dispatch({ type: 'UPDATE_UNIVERSAL_REQUEST', request: { ...request, isProcessing: false, isSaving: false } });

    }
    const onValueChanged = (evt) => {
        const newRequest = { ...state, [evt.target.name]: evt.target.value };
        setState(newRequest);
    };
    React.useEffect(() => {
        Promise.all([
            loadGeneralComments(request.currentClaimActivity.activityID),
        ]).then(([lc]) => {

            setState({
                ...state,
                data: lc.data.commentsList.sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate)), 
                loaded: true,
                comment: ''
            })
          
        })
    }, [create]);

    return (
        !state.loaded ? <Spinner /> :
            <Panel>
                <PanelHeader><span style={{ fontWeight: 'bold', fontSize: '14px' }}>General Comments</span></PanelHeader>
                <PanelContent style={{ height: 500 }}>
                    <ContentRow>
                        <ContentCell width="80%">
                            <TextInput
                                disabled={isViewer}
                                id="comment"
                                name="comment"
                                label="General Comments"
                                defaultValue=""
                                multiline
                                rows={4}
                                inputProps={{ maxlength: 1024 }}
                                value={state.comment}
                                onChange={onValueChanged}
                                helperText={(generalCommentError === true ? 'Field is required' : '')}
                                style={{ width: '100%' }}
                                variant="outlined"
                                required
                            />
                        </ContentCell>
                        <ContentCell width="20%">
                            <Button variant="contained" color="primary" onClick={onClick} disabled={isViewer}>Add</Button>
                        </ContentCell>
                    </ContentRow>
                    <Divider />
                    <GridContainer className="ag-theme-balham">
                        <AgGridReact
                            columnDefs={colDefs}
                            rowData={state.data ? (state.data ? state.data : []) : []}
                            frameworkComponents={frameworkComponents}
                            onCellValueChanged={onCellValueChanged}
                            rowHeight={80}
                            defaultColDef={defaultColDef}
                            pagination={true}
                            paginationPageSize={10}
                        >
                        </AgGridReact>
                    </GridContainer>
                </PanelContent>
            </Panel>
    );

})