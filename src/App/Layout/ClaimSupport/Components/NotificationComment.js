import { Button, Divider } from '@mui/material';



import { AgGridReact } from 'ag-grid-react';
import { useSnackbar } from 'notistack';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { ASYNC_STATES } from '../../../Core/Enumerations/redux/async-states';
import { formatDate, Panel, PanelContent, PanelHeader, Spinner, TextInput } from '../../../Core/Forms/Common';
import { NotificationCommentsActions, NotificationCommentsGetActions, NotificationCommentsGetSelectors, NotificationCommentsSelectors } from '../../../Core/State/slices/notificationComment';
import { usersSelectors } from '../../../Core/State/slices/users';
import NotificationDescriptionRenderer from '../../Notifications/NotificationCenter/NotificationDescriptionRenderer';

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
export const NotificationComments = (({ NotificationID }) => {
    const { enqueueSnackbar } = useSnackbar();
    const users = useSelector(usersSelectors.selectData());
    const $dispatch = useDispatch();
    const NotificationCommentsdata = useSelector(NotificationCommentsGetSelectors.selectData());
    const NotificationCommentsSaveState = useSelector(NotificationCommentsSelectors.selectLoading());
    const NotificationCommentsGetState = useSelector(NotificationCommentsGetSelectors.selectLoading());
    
    const isProcessing = NotificationCommentsSaveState === ASYNC_STATES.WORKING
        || NotificationCommentsGetState === ASYNC_STATES.WORKING;

    React.useEffect(() => {
        
        if (NotificationCommentsGetState === ASYNC_STATES.IDLE) {
            $dispatch(NotificationCommentsGetActions.get({ notificationID: NotificationID }));
        }
        if (NotificationCommentsSaveState === ASYNC_STATES.SUCCESS) {
            enqueueSnackbar("Comment has been saved successfully.", { variant: 'success', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
            $dispatch(NotificationCommentsActions.clearStatus());
            $dispatch(NotificationCommentsGetActions.get({ notificationID: NotificationID }));
            $dispatch(NotificationCommentsGetActions.clearStatus());
        }

    }, [isProcessing]);

    const [state, setState] = React.useState({
        notificationID: NotificationID ? NotificationID : '',
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
                let selected_users = users.filter(x => x.userID?.toLowerCase() === params.data?.createdBy?.toLowerCase());
                if (selected_users.length > 0) {
                    return selected_users[0].fullName;
                }
            }
        },
        {
            headerName: 'Comment',
            field: 'comment',
            tooltipField: "Comment",
            cellRenderer: 'NotificationDescriptionRenderer',
            wrapText: true,
            width: 600,
            floatingFilterComponentParams: { suppressFilterButton: true }
        },



    ]

    const defaultColDef = {
        cellClass: 'cell-wrap-text',
        cellStyle: { 'white-space': 'normal' },
        sortable: false,
        rowHeight: 'auto',
        resizable: true,
    };

    const onValueChanged = (evt) => {
        const newRequest = { ...state, [evt.target.name]: evt.target.value };
        setState(newRequest);
    };
    const save = () => {
        $dispatch(NotificationCommentsActions.create({ notificationComment: state }));
        setState({ ...state, comment: "" });
    };
    const frameworkComponents = {
        NotificationDescriptionRenderer: NotificationDescriptionRenderer,
    };
    return (
        isProcessing ? <Spinner /> :
            <Panel>
                <PanelHeader><span style={{ fontWeight: 'bold', fontSize: '14px' }}>General Comments</span></PanelHeader>
                <PanelContent style={{ height: 500 }}>
                    <ContentRow>
                        <ContentCell width="80%">
                            <TextInput
                                id="comment"
                                name="comment"
                                label="General Comments"
                                defaultValue=""
                                multiline
                                rows={4}
                                inputProps={{ maxlength: 500 }}
                                value={state.comment}
                                  onChange={onValueChanged}
                                style={{ width: '100%' }}
                                variant="outlined"
                                required
                            />
                        </ContentCell>
                        <ContentCell width="20%">
                            <Button variant="contained" color="primary" onClick={()=>save()}>Add</Button>
                        </ContentCell>
                    </ContentRow>
                    <Divider />
                    <GridContainer className="ag-theme-balham">
                        <AgGridReact
                            columnDefs={colDefs}
                            rowData={NotificationCommentsdata ?  NotificationCommentsdata : []}
                            defaultColDef={defaultColDef}
                            pagination={true}
                            paginationPageSize={10}
                            frameworkComponents={frameworkComponents}
                        >
                        </AgGridReact>
                    </GridContainer>
                </PanelContent>
            </Panel>
    );

})