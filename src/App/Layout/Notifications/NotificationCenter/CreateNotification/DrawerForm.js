import {
    Delete
} from '@mui/icons-material';
import React, { useEffect, useState } from 'react';
import {
    Autocomplete, Button,Checkbox, CircularProgress, FormControl,FormControlLabel, FormGroup, IconButton, Input,InputLabel,ListItemText, MenuItem,Paper, Radio, RadioGroup,Select, Switch,Table,TableBody,TableCell,TableContainer,TableHead,TableRow,TextField
} from '@mui/material';
import { useSnackbar } from 'notistack';
import { useDispatch, useSelector } from 'react-redux';
import { ASYNC_STATES } from '../../../../Core/Enumerations/redux/async-states';
import {
    ContentCell, ContentRow, DatePicker,SelectList,TextInput
} from '../../../../Core/Forms/Common';
import {
    getClaimExaminersWithoutManager,getRoles
} from '../../../../Core/Services/EntityGateway';
import { supportTypeActions, supportTypeSelectors } from '../../../../Core/State/slices/notification';
import { formatDate } from '../../../../Core/Forms/Common';
import { taskTypeSelectors } from '../../../../Core/State/slices/taskTypes';
import { userSelectors } from '../../../../Core/State/slices/user';
import {
    ButtonContainer, ClaimUserContainer, Container, DescriptionContainer, DropdownContainer,ExaminerContainer, FieldContainer,HorizontalDivider,TitleContainer
} from './FieldContainer'; 
import { getValidUrl, validURL, hasAnyError , validateRequest } from './NotificationEvents';
import {
    DrawerSearch
} from './NotificationClaimSearch';
import { loadADUsersQuery } from '../../Query/loadADUsersData';
import { CLAIM_TYPES } from '../../../../Core/Enumerations/app/claim-type';
import { CLAIM_STATUS_TYPE } from '../../../../Core/Enumerations/app/claim-status-type';
import { ROLES } from '../../../../Core/Enumerations/security/roles';
import { dateTimeFormat } from '../../../../Core/Utility/common';
import { notificationMessageTypeSelectors } from '../../../../Core/State/slices/notification-message-type';

export const DrawerForm = ({ claim, isOpen, onSubmit, litigationData }) => {

    /* eslint-disable */    
    const taskTypedata = useSelector(taskTypeSelectors.selectData());
    const notificationMessageTypeData = useSelector(notificationMessageTypeSelectors.selectData());
    const ontaskTypeloaded = useSelector(taskTypeSelectors.selectLoading());
    const onSupportTypeloaded = useSelector(supportTypeSelectors.selectLoading());
    const $auth = useSelector(userSelectors.selectAuthContext());
    const isLoaded = ontaskTypeloaded === ASYNC_STATES.WORKING || onSupportTypeloaded === ASYNC_STATES.WORKING;

    const currentUser = $auth.currentUser;
    const pathName = window.location.pathname;

    let name = currentUser.fullName.split(' ');
    let firstName = name[0];
    let lastName = name[1];
    let currentNotificationUser = { 'networkID': currentUser.id, "emailAddress": currentUser.emailAddress, "firstName": firstName, "lastName": lastName, "reminderDate": null, "isCopyOnly": false, "statusCode": 'N' }

    const BlankRequest = {
        typeCode: claim?.claimMasterID !== undefined && claim?.claimMasterID !== null ? 'D' : 'T',
        statusCode: 0,
        title: '',
        body: '',
        relatedUrl: '',
        reminderDate: null,
        isHighPriority: '',
        modifiedBy: null,
        relatedClaim: null,
        notificationUsers: [currentNotificationUser],
        claimExaminerID: null,
        isCopyOnly: false,
        roleID: null,
        roleIDs: [],
        taskTypeID: null,
        supportType: [],
        taskTypes: [],
        supportTypeID: null,
        messageType:"1",
        preTrialMemo: {
            claimMasterID: claim?.claimMasterID ? claim.claimMasterID : null,
            claimant: "",
            trialDate: litigationData?.trialDate !== null ? litigationData?.trialDate : null,
            venue: "",
            primaryExcessCarrier: "",
            defenseCounsel: "",
            limits: "",
            reserve: "",
            lossDesc: claim?.lossDesc ? claim.lossDesc : '',
            liability: "",
            damages: "",
            statusOfNegotiations: ""
        },
    };

    const [state, setState] = useState({ ...BlankRequest });

    const [errors, setErrors] = useState(Object.keys(BlankRequest).reduce((errs, k) => ({ ...errs, [k]: false }), {}));
    const { enqueueSnackbar } = useSnackbar();
    const [canSubmit, setCanSubmit] = useState(false);
    const [userOrRole, setUserOrRole] = useState('user'); 
    const [UrlOrClaim, setUrlOrClaim] = useState('claim');
    const [isClaimSearchClosed, setIsClaimSearchClosed] = useState(false);
    const [examiner, setexaminer] = useState([]);
    const [assignedUser, setAssignedUser] = useState([]);
    const [validUrl, setValidUrl] = useState(false);
    const [count, setCount] = useState(0);
    const [isClaimEmpty, setIsClaimEmpty] = useState(false);
    const [reminderDateRequired, setReminderDateRequired] = useState(false);
    const [dolRequired, setdolRequired] = useState(false);
    const [claimantRequired, setclaimantRequired] = useState(false);
    const [limitsRequired, setlimitsRequired] = useState(false);
    const [reserveRequired, setreserveRequired] = useState(false);
    const [trialDateRequired, settrialDateRequired] = useState(false);
    const [supportTypeIDRequired, setSupportTypeIDRequired] = useState(false);
    const $dispatch = useDispatch();
    const supportTypedata = useSelector(supportTypeSelectors.selectData());
    const [isProcessing, setIsProcessing] = useState(true);
    const [metadata, setMetadata] = useState({
        loading: false,
        claimExaminers: [],
        roles: []
    });
    const [Claim, setClaim] = useState({
        claimMasterId: null,
        claimId: ''
    });

    const [open, setOpen] = useState(false);
    const [options, setOptions] = useState([]);
    const [loading, setLoading] = useState(false);

   



    useEffect(() => {
        if (pathName === '/claimSupportDashboard') {
            $dispatch(supportTypeActions.get({ taskTypeID: '2' }))
        }
        Promise.all([
            getClaimExaminersWithoutManager(),
            getRoles()
        ])
            .then(([ce, ro]) => {
                setMetadata({
                    loading: false,
                    claimExaminers: (ce || []),
                    roles: (ro || []),
                });
            });
    }, []);

    useEffect(() => {
        if (ontaskTypeloaded === ASYNC_STATES.SUCCESS) {
            setState({ ...state, supportType: supportTypedata, taskTypes: taskTypedata });
            setIsProcessing(false)
        }

    }, [isLoaded]);

    useEffect(() => {
        
        checkUrlFlag();
    }, [isOpen]);

    useEffect(() => {
        let active = true;
        if (!loading) {
            return undefined;
        }
        (async () => {

            //await sleep(1e2); // For demo purposes.
            if (active) {
                //    setOptions(metadata.claimExaminers);
            }
        })();

        return () => {
            active = false;
        };
    }, [loading, state.typeCode])

    const handleUserOrRoleChange = (e) => {
        if (e.target.value === 'user') {
            setUserOrRole('user');
            setCanSubmit(hasAnyError(state,BlankRequest) === false); 
        }
        else if (e.target.value === 'role') {
            setUserOrRole('role');
            if (!state.roleIDs.length) {
                setCanSubmit(false);
            }            
        }
    }
    const onValueChanged = (evt) => {
        const newRequest = { ...state, [evt.target.name]: evt.target.value };
        setState(newRequest);
        setCanSubmit(hasAnyError(newRequest, BlankRequest) === false);
    };

    const onPTMChanged = (evt) => {
        state.preTrialMemo[evt.target.name] = evt.target.value;
        const newRequest = { ...state };
        setState(newRequest);
        setCanSubmit(hasAnyError(newRequest, BlankRequest) === false);
    };

    

    

    const onSearchComplete = ({ claimId = '', claimMasterId = null } = {}) => {
        setIsClaimEmpty(false);
        setClaim({ ...claim, claimMasterId: claimMasterId, claimId: claimId });
        if (claimMasterId == null) {
            enqueueSnackbar('Unable to find the Claim', { variant: 'error',  anchorOrigin: { vertical: 'top', horizontal: 'center' } });
        }
        else if (claimMasterId, claimId) {
            enqueueSnackbar(' Success! Claim Found', { variant: 'success', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
        }
        setCanSubmit(hasAnyError(state,BlankRequest) === false);
    };

    const handleAutoCompleteChange = (event , values) => {
        setAssignedUser(values);
    }
    const handleNotificationUser = (event) => {

        if (state.typeCode == 'M') {
            if (assignedUser == null) {
                enqueueSnackbar('Error! Select User from list', { variant: 'error',  anchorOrigin: { vertical: 'top', horizontal: 'center' } });
                return;
            }
             state.notificationUsers.map((item) => {
                 if (item.networkID.toLowerCase() === 'grn\\' + assignedUser.samAccountName.toLowerCase()) {
                    flag = true;
                }
            }) 

            if (flag == true) {
                enqueueSnackbar('Error! User Already Exist.', { variant: 'error',  anchorOrigin: { vertical: 'top', horizontal: 'center' } });
                return;
            }
            var name = assignedUser.displayName.split(' ');
            var networkID = 'GRN\\' + assignedUser.samAccountName;
            var joined = state.notificationUsers.concat({ 'networkID': networkID, "emailAddress": assignedUser.emailAddress, "firstName": name[0], "lastName": name[1], "reminderDate": null, "isCopyOnly": state.isCopyOnly, "statusCode": 'N' });
            setState({ ...state, notificationUsers: joined });
            setCanSubmit(hasAnyError(state,BlankRequest) === false);
            return;
        }
        else {
            var flag = false;
            if (state.claimExaminerID == null || state.claimExaminerID == '') {
                enqueueSnackbar('Error! Select User from list', { variant: 'error',  anchorOrigin: { vertical: 'top', horizontal: 'center' } });
                return;
            }
            
            state.notificationUsers.map((item) => {
                if (item.networkID === state.claimExaminerID) {
                    flag = true;
                }
            })

            if (flag == true) {
                enqueueSnackbar('Error! User Already Exist.', { variant: 'error',  anchorOrigin: { vertical: 'top', horizontal: 'center' } });
                return;
            }

            getClaimExaminer(state.claimExaminerID);
            var joined = state.notificationUsers.concat({ 'networkID': examiner[0].userID, "emailAddress": examiner[0].emailAddress, "firstName": examiner[0].firstName, "lastName": examiner[0].lastName, "reminderDate": state.reminderDate ,"isCopyOnly": state.isCopyOnly, "statusCode": 'N' });
            setState({ ...state, notificationUsers: joined });
            setexaminer([]);
            setCanSubmit(hasAnyError(state,BlankRequest) === false);
        }
    }

    const getClaimExaminer = (idToSearch) => {
        metadata.claimExaminers.map((ce, idx) => {
               if (ce.userID === idToSearch) {
                   examiner.push(ce);
            }
        });
    };
    const handleRemoveExaminer = ( claimExaminerID ) => {
        var array = state.notificationUsers.filter(function (item) {
            return item.networkID !== claimExaminerID
        });
        setState({ ...state,
            notificationUsers: array
        })        
    }
    const handleChange = (event) => {
        setState({ ...state, [event.target.name]: event.target.checked });
    };

    const handleRolesChange = (evt, index, values) => {
        const newRequest = { ...state, roleIDs: evt.target.value };
        setState(newRequest);
        setUserOrRole("role");
        setCanSubmit(hasAnyError(newRequest,BlankRequest) === false);
    };
    const resetRequest = () => {   
        setValidUrl(false);
        setUserOrRole('user');
        let currentReminderDate = state.reminderDate;
        const req = { ...BlankRequest };
        req.reminderDate = currentReminderDate;
        setState(req);
        setErrors(Object.keys(req).reduce((errs, k) => ({ ...errs, [k]: false }), {}));
        setCanSubmit(hasAnyError(req) === false)
        setIsClaimSearchClosed(true);
        checkUrlFlag();
        setClaim({ claimMasterId: null, claimId: '' });
    };
   
  
    const handleUrlChange = (event) => {
        setState({ ...state, relatedUrl: event.target.value });
        if (event.target.value) {
            let validateUrl = validURL(event.target.value);
            if (!validateUrl) {
                setValidUrl(true);
                return;
            } else {
                setValidUrl(false);
            }
        } else setValidUrl(false);
    }  
    const createNewNotification = () => {
        setCanSubmit(false);
        let _notificationUsers = state.typeCode === 'A' && userOrRole === "role" ? [] : state.notificationUsers;
        let _roleID = state.typeCode === 'A' && userOrRole === "user" ? null : state.roleID;
        var priority = false; 
        priority = state.statusCode === '1' ? true : false;

        if (state.typeCode === 'T') {
            let flag = false;
            if (state.taskTypeID === '3') {
                state.title = claim.claimID + ' - ' + 'Pre-Trial Memo';
                if (!state.preTrialMemo.claimant) {
                    setclaimantRequired(true);
                    flag = true;
                }
                if (!state.preTrialMemo.lossDesc) {
                    setdolRequired(true);
                    flag = true;
                }
                if (!state.preTrialMemo.limits) {
                    setlimitsRequired(true);
                    flag = true;
                }
                if (!state.preTrialMemo.reserve) {
                    setreserveRequired(true);
                    flag = true;
                }
                if (!state.preTrialMemo.trialDate) {
                    settrialDateRequired(true);
                    flag = true;
                } else {
                    state.preTrialMemo.trialDate = new Date(state.preTrialMemo.trialDate).toISOString();
                }

            }
            if (state.taskTypeID === '2' && state.supportTypeID === null) {
                setSupportTypeIDRequired(true);
                flag = true;
            }
            if(flag){
                return;
            }
        }
        if (state.typeCode === 'D') {
            if (!state.reminderDate) {
                setReminderDateRequired(true);
                return;
            }
        }
        if (state.typeCode === 'M') {

            if (Claim?.claimMasterId ?? claim?.claimMasterID) {
            }
            else {
                setIsClaimEmpty(true);
                return;
            }
        }
 
        if (_notificationUsers.length == 0 && state.taskTypeID != '2' && userOrRole === "user") {
             enqueueSnackbar('Error! Select User from list', { variant: 'error',  anchorOrigin: { vertical: 'top', horizontal: 'center' } });
             return;
        }
        if (state.reminderDate !== null) {
            _notificationUsers.forEach(nUser => {
                nUser['reminderDate'] = dateTimeFormat(state.reminderDate).toISOString();
            });
        }
        let newUrl = getValidUrl(state.relatedUrl)
        if (newUrl === "http://") {
            newUrl = "";
        }
        if (pathName === '/claimSupportDashboard') {
            state.taskTypeID = '2';
        } else if (pathName !== '/notifications') {
            state.claimMasterID = claim?.claimMasterID;
        }

        if (state.typeCode === 'A' && userOrRole === "role") {
            let recordIDs = [];
            state.roleIDs.filter((x) => {
                recordIDs.push({ 'roleID': parseInt(x.roleID) });
            });
            const request = {
                claimMasterID: Claim?.claimMasterId ?? claim?.claimMasterID,
                typeCode: state.typeCode,
                title: state.title,
                body: state.body,
                relatedURL: newUrl,
                isHighPriority: priority,
                notificationRoles: recordIDs,
                notificationUsers: _notificationUsers,
            }
     
            const errs = validateRequest(request,BlankRequest);
            if (Object.keys(errs).map(k => errs[k]).some(v => v === true) === true) {
                setErrors(errs);
            }
            else if (typeof onSubmit === 'function') {
                onSubmit(request);
            }

        }
        else {
            const request = {
                claimMasterID: Claim?.claimMasterId ?? claim?.claimMasterID,
                typeCode: state.typeCode,
                title: state.typeCode === 'M' ? "": state.title,
                body: state.body,
                relatedURL: newUrl,
                notificationMessageTypeId: parseInt(state.messageType),
                isHighPriority: priority,
                notificationUsers: _notificationUsers,
                taskTypeID: parseInt(state.taskTypeID)
            }

            if (state.typeCode === 'T' && state.taskTypeID === '2') {
                request.notificationRoles = [{
                    roleID: ROLES.Claims_Assistant,
                    claimStatusTypeID: CLAIM_STATUS_TYPE.NEW_PI_3,
                }]
                request.notificationUsers = []
            }
            if (state.typeCode === 'T' && state.taskTypeID !== '3') {
                request.supportTypeID = parseInt(state.supportTypeID);
            }
            if (state.typeCode === 'T' && state.taskTypeID === '3') {
                request.body = '';
            }
            request.preTrialMemo = state.preTrialMemo;
   
            const errs = validateRequest(request,BlankRequest);
            if (Object.keys(errs).map(k => errs[k]).some(v => v === true) === true) {
                setErrors(errs);
            }
            else if (typeof onSubmit === 'function') {
                    onSubmit(request);
            }   
        }
         
    }
        
    const checkUrlFlag = () => {
        if (Claim?.claimMasterID !== undefined && Claim?.claimMasterID !== null) {
            setClaim({ ...Claim, claimMasterId: Claim?.claimMasterID?.claimMasterID, claimId:   Claim?.claimMasterID?.claimID });
          
        } else {
            setClaim({ claimMasterId: null, claimId: '' });
        }
    }
    const handleNotificationTypeChange = (event) => {
        const newRequest = { ...state, [event.target.name]: event.target.value };

        if (event.target.value === 'M' ||  event.target.value === 'A') {
            newRequest.notificationUsers = [];
        }
        else if (event.target.value === 'T' && state.taskTypeID === null) {
            newRequest.notificationUsers = [];
        } else {
            newRequest.notificationUsers = [currentNotificationUser];
        }
        setState(newRequest);
        setCount(0);
        setUserOrRole('user');
    }
    const handleTaskTypeChange = (event) => {
        if (event.target.value === '2') {
            $dispatch(supportTypeActions.get({ taskTypeID: (event.target.value) }));
        }
        const newRequest = { ...state, [event.target.name]: event.target.value };
        if (state.typeCode === 'T' || (event.target.value === '3' || event.target.value === '1')) {
            newRequest.notificationUsers = [];
        }
        setState(newRequest);
    }
    const handleMessageTypeChange = (event) => {
        const newRequest = { ...state, messageType: event.target.value };
        setState(newRequest);
    }
    const handleSupportTypeChange = (event) => {
        const newRequest = { ...state, [event.target.name]: event.target.value };
        setState(newRequest);
        setSupportTypeIDRequired(false);
        setCanSubmit(hasAnyError(newRequest, BlankRequest) === false);

    }
    const ClaimExaminerComponent = () => {
        return (
            (state.notificationUsers === undefined || state.notificationUsers.length === 0) ? null : (
                <TableContainer component={Paper}>
                    <Table aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Username</TableCell>
                                <TableCell>GRN/ID</TableCell>
                                <TableCell >Copy Only</TableCell>
                                <TableCell align="right">Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {state.notificationUsers.map((row) => (
                                <TableRow key={row.networkID} >
                                    <TableCell >{row.firstName} {row.lastName}</TableCell>
                                    <TableCell component="th" scope="row">
                                        {row.networkID}
                                    </TableCell>
                                    <TableCell>{row.isCopyOnly ? "Yes" : "No"}</TableCell>
                                    <TableCell align="right">
                                        <IconButton onClick={() => handleRemoveExaminer(row.networkID)} size="small" style={{ marginBottom: '17px' }}>
                                            <Delete />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )
            )
    }

    const timeout = null;
    const handleAutocompleteInputChange = (inputValue) => {
        if (inputValue.length >= 3) {
            setLoading(true);
            setTimeout(() => loadADUsers(inputValue), 200);
        }
    }


    const loadADUsers = async (searchString) => {
        const ADUsersData = await loadADUsersQuery(searchString);
        if (ADUsersData.list === []) {
            setOptions([])
            setLoading(false);
        } else {
            setOptions(ADUsersData.list)
            setLoading(false);
        }
    }

    const valueChanged = (date) => {
        let newDate = date.target.value ? date.target.value.toISOString() : null;
        setState({ ...state, reminderDate: newDate });
        setReminderDateRequired(date.target.value ? false : true);
        setCanSubmit(date.target.value ? true : false);
    };
   
    return (
        <>  
            <Container>
          
            <form>
                    {state.typeCode === 'M' ? null :
                        <FieldContainer>
                            <TextInput
                                id="title"
                                label="Title"
                                onChange={onValueChanged}
                                error={errors.title === true}
                                helperText={(errors.title === true ? 'Title is required' : '')}
                                    value={state.typeCode === 'T' && state.taskTypeID === '3' ? claim?.claimID + ' - ' + 'Pre-Trial Memo' :state.title }
                                inputProps={{
                                    maxLength: 100,
                                }}
                                disabled={state.typeCode === 'T' && state.taskTypeID === '3'}
                                required
                            /> 
                        </FieldContainer>
                    }
                    {state.typeCode === 'T' && state.taskTypeID === '3' ? null :
                        <DescriptionContainer>
                            <TextInput
                                id="body"
                                label="Body"
                                inputProps={{
                                    maxLength: 1024,
                                }}
                                value={state.body}
                                error={errors.body}
                                onChange={onValueChanged}
                                multiline
                                rows={4}
                            />
                        </DescriptionContainer>
                    }
                    <DropdownContainer>
                        {
                            pathName === '/claimSupportDashboard' ? null :
                            (  <>
                                    <SelectList
                                    id="typeCode"
                                    label="Notification Type"
                                    value={state.typeCode}
                                    variant="outlined"
                                    onChange={handleNotificationTypeChange}
                                    error={errors.typeCode === true}
                                    allowempty={false}
                                    helperText={(errors.typeCode === true ? 'Notification Type is required' : '')}
                                    required
                                    >
                                        <MenuItem value="T">Task</MenuItem>
                                        <MenuItem value="M">Message</MenuItem>
                                        <MenuItem value="A">Alert</MenuItem>
                                    { pathName !== '/notifications' && <MenuItem value="D">Diary</MenuItem>}
                                    </SelectList>
                                    <HorizontalDivider />
                                </>
                            )

                        }

                        <SelectList
                        id="statusCode" 
                        label="Priority"
                        variant="outlined"
                        value={state.statusCode}
                        onChange={onValueChanged}
                        allowempty={false}
                        error={errors.statusCode === true}
                        helperText={(errors.statusCode === true ? 'Priority is required' : '')}
                        required
                        >
                            <MenuItem value="1">High</MenuItem>
                            <MenuItem value="0">Low</MenuItem>
                        </SelectList>
                    </DropdownContainer>
{/*                    {state.typeCode == 'T' && !isProcessing && pathName != '/claimSupportDashboard' ? (
                        <DropdownContainer >
                            <SelectList
                                id="taskTypeID"
                                name="taskTypeID"
                                label="Task Type"
                                value={state?.taskTypeID}
                                variant="outlined"
                                onChange={handleTaskTypeChange}
                            >

                                {taskTypedata.length && (
                                    taskTypedata?.map((item, idx) =>
                                        <MenuItem key={idx} value={item.taskTypeID} disabled={(item.taskTypeID == "3" && claim?.claimType === CLAIM_TYPES.LEGAL) || (pathName == '/notifications' && (item.taskTypeID == "3" || item.taskTypeID == "2"))}>{item.taskTypeText}</MenuItem>
                                    )
                                )}
                            </SelectList> 
                        </DropdownContainer> 
                    ) : null}*/}
                 
                    {state.typeCode === 'T' && !isProcessing && pathName === '/notifications' ? (
                        <DropdownContainer >
                            <SelectList
                                id="taskTypeID"
                                name="taskTypeID"
                                label="Task Type"
                                value={taskTypedata.length ? taskTypedata[0].taskTypeID : ''}
                                variant="outlined"
                                onChange={handleTaskTypeChange}
                            >

                                {taskTypedata.length && (
                                        <MenuItem value={taskTypedata[0].taskTypeID} >{taskTypedata[0].taskTypeText}</MenuItem>
                                )}
                            </SelectList>
                        </DropdownContainer>

                    ) : state.typeCode === 'T' && !isProcessing && claim?.claimType === CLAIM_TYPES.LEGAL ? (
                            <DropdownContainer >
                                <SelectList
                                    id="taskTypeID"
                                    name="taskTypeID"
                                    label="Task Type"
                                    value={state?.taskTypeID}
                                    variant="outlined"
                                    onChange={handleTaskTypeChange}
                                >

                                    {taskTypedata.length && (
                                        taskTypedata?.map((item, idx) =>
                                            <MenuItem key={idx} value={item.taskTypeID} disabled={item.taskTypeID === "3"}>{item.taskTypeText}</MenuItem>
                                        )
                                    )}
                                </SelectList>
                            </DropdownContainer> 
                
                        ) : state.typeCode === 'T' && !isProcessing ? (
                                <DropdownContainer >
                                    <SelectList
                                        id="taskTypeID"
                                        name="taskTypeID"
                                        label="Task Type"
                                        value={state?.taskTypeID}
                                        variant="outlined"
                                        onChange={handleTaskTypeChange}
                                    >

                                        {taskTypedata.length && (
                                            taskTypedata?.map((item, idx) =>
                                                <MenuItem key={idx} value={item.taskTypeID}>{item.taskTypeText}</MenuItem>
                                            )
                                        )}
                                    </SelectList>
                                </DropdownContainer>) : null}

                    {(state.typeCode === 'T' && state.taskTypeID === '2')  ? (

                        <DropdownContainer >
                            <SelectList
                                id="supportTypeID"
                                name="supportTypeID"
                                label="Support Type"
                                value={state?.supportTypeID}
                                variant="outlined"
                                onChange={handleSupportTypeChange}
                                error={supportTypeIDRequired}
                                allowempty={false}
                                helperText={(supportTypeIDRequired ? 'Field is required' : '')}
                                //required
                            >

                                {state.supportType !== [] && (
                                    state?.supportType?.map((item, idx) => 
                                        <MenuItem key={idx} value={item.supportTypeID}>{item.supportTypeText}</MenuItem>
                                    )
                                )}
                            </SelectList>
                        </DropdownContainer>
                    ) : null}

                    {state.typeCode === 'T' && state.taskTypeID === '3' && claim? (
                        <>
                            <FieldContainer>
                                <TextInput
                                    id="policyNumber"
                                    label="Policy Number"
                                    value={claim?.claimPolicyID ? claim?.claimPolicyID : claim.claimPolicy ? claim.claimPolicy.policyID : ''}
                                    disabled
                                />

                            </FieldContainer>
                            <FieldContainer>
                                <TextInput
                                    id="insuredName"
                                    label="Insured Name"
                                    value={claim && (claim.insuredName || claim.insuredNameContinuation) ? `${claim.insuredName || ''} ${claim.insuredNameContinuation || ''}`.trim() : claim.policy ? `${claim.policy.insuredName || ''} ${claim.policy.insuredNameContinuation || ''}` : ''}
                                    disabled
                                />

                            </FieldContainer>
                            <ContentRow>
                                <ContentCell>
                                    <DatePicker
                                        id="dOL"
                                        name="dOL"
                                        label="Date of Loss"
                                        value={claim?.dOL || ''}
                                        error=""
                                        helperText=""
                                        disabled
                                        />
                                </ContentCell>
                                <ContentCell>   
                                <DatePicker
                                    id="dateReceived"
                                    name="dateReceived"
                                    label="Claim Reported date"
                                    value={claim?.dateReceived || ''}
                                    error=""
                                    helperText=""
                                    disabled
                                />
                                </ContentCell>
                            </ContentRow>
                            <ContentRow>
                                <ContentCell style={{width:"100%"}}>
                                    <TextInput
                                        id="claimant"
                                        label="Claimant"
                                        name="claimant"
                                        onChange={onPTMChanged}
                                        value={state.preTrialMemo.claimant || ''}
                                        error={claimantRequired === true}
                                        helperText={(claimantRequired === true ? 'Claimant field is required' : '')}
                                        required
                                    />
                                </ContentCell>
                            </ContentRow>
                            <ContentRow>
                                <ContentCell>
                                    <DatePicker
                                        id="trialDate"
                                        name="trialDate"
                                        label="Trial Date"
                                        onChange={onPTMChanged}
                                        value={state.preTrialMemo.trialDate || null }
                                        error={trialDateRequired === true}
                                        helperText={(trialDateRequired === true ? 'Trial Date field is required' : '')}
                                        required
                                    />
                                </ContentCell>
                                <ContentCell>
                                    <TextInput
                                        id="venue"
                                        label="Venue"
                                        name="venue"
                                        onChange={onPTMChanged}
                                        value={state?.preTrialMemo.venue || ''}
                                    />
                                </ContentCell>
                            </ContentRow>
                            <ContentRow>
                                <ContentCell>
                                    <TextInput
                                        id="primaryExcessCarrier"
                                        label="Primary / Excess Carrier"
                                        name="primaryExcessCarrier"
                                        onChange={onPTMChanged}
                                        value={state?.preTrialMemo.primaryExcessCarrier || ''}
                                    />
                                </ContentCell>
                                <ContentCell>
                                    <TextInput
                                        id="defenseCounsel"
                                        label="Defense Counsel"
                                        name="defenseCounsel"
                                        onChange={onPTMChanged}
                                        value={state?.preTrialMemo.defenseCounsel || ''}
                                    />
                                </ContentCell>
                            </ContentRow>
                            <ContentRow>
                                <ContentCell>
                                    <TextInput
                                        id="limits"
                                        label="Limits"
                                        name="limits"
                                        onChange={onPTMChanged}
                                        value={state?.preTrialMemo.limits || ''}
                                        error={limitsRequired === true}
                                        helperText={(limitsRequired === true ? 'Limits field is required' : '')}
                                        required
                                    />
                                </ContentCell>
                                <ContentCell>
                                    <TextInput
                                        id="reserve"
                                        name="reserve"
                                        label="Reserve"
                                        onChange={onPTMChanged}
                                        value={state?.preTrialMemo.reserve || ''}
                                        error={reserveRequired === true}
                                        helperText={(reserveRequired === true ? 'Reserve field is required' : '')}
                                        required
                                    />
                                </ContentCell>
                            </ContentRow>
                            <ContentRow>
                                <ContentCell style={{ width: "100%" }}>
                                    <TextInput
                                        label="Description of Loss"
                                        id="lossDesc"
                                        name="lossDesc"
                                        fullWidth={true}
                                        onChange={onPTMChanged}
                                        value={state?.preTrialMemo.lossDesc || ''}
                                        error={dolRequired === true}
                                        helperText={(dolRequired === true ? 'Description of Loss field is required' : '')}
                                        required
                                        multiline
                                        rows={3}
                                        inputProps={{
                                            maxLength: 300,
                                        }}
                                    />
                                </ContentCell>
                            </ContentRow>
                            <ContentRow>
                                <ContentCell style={{ width: "100%" }}>
                                    <TextInput
                                        label="Liability"
                                        id="liability"
                                        name="liability"
                                        fullWidth={true}
                                        onChange={onPTMChanged}
                                        inputProps={{
                                            maxLength: 250,
                                        }}
                                        value={state?.preTrialMemo.liability || ''}
                                        multiline
                                        rows={3}
                                    />
                                </ContentCell>
                            </ContentRow>
                            <ContentRow>
                                <ContentCell style={{ width: "100%" }}>
                                    <TextInput
                                        label="Damages"
                                        id="damages"
                                        name="damages"
                                        fullWidth={true}
                                        onChange={onPTMChanged}
                                        inputProps={{
                                            maxLength: 250,
                                        }}
                                        value={state?.preTrialMemo.damages || ''}
                                        multiline
                                        rows={3}
                                    />
                                </ContentCell>
                            </ContentRow>
                            <ContentRow>
                                <ContentCell style={{ width: "100%" }}>
                                    <TextInput
                                        label="Status of Negotiations"
                                        id="statusOfNegotiations"
                                        name="statusOfNegotiations"
                                        fullWidth={true}
                                        onChange={onPTMChanged}
                                        inputProps={{
                                            maxLength: 250,
                                        }}
                                        value={state?.preTrialMemo.statusOfNegotiations || ''}
                                        multiline
                                        rows={3}
                                    />
                                </ContentCell>
                            </ContentRow>

                        </>
                    ): null}
                   {state.typeCode === 'M' && 
                        <DropdownContainer >
                            <SelectList
                                id="messageType"
                                name="messageType"
                                label="Message Type"
                                value={state.messageType}
                                variant="outlined"
                                onChange={handleMessageTypeChange}
                            >
                                   {notificationMessageTypeData?.length && (
                                            notificationMessageTypeData?.map((item, idx) =>
                                                <MenuItem key={idx} value={item.notificationMessageTypeID}>{item.notificationMessageTypeText}</MenuItem>
                                            )
                                        )}
                            </SelectList>
                        </DropdownContainer>}
                    <FieldContainer>
                        <TextInput
                            id="relatedUrl"
                            label="Related URL"
                            onChange={(value) => handleUrlChange(value)}
                            value={state.relatedUrl}
                            inputProps={{
                                maxLength: 2048,
                            }}
                            error={validUrl}
                            helperText={(validUrl ? 'URL format is not valid' : '')}
                        />
                        
                    </FieldContainer>
                        {
                        (state.typeCode !== 'T' && state.typeCode !== 'M' && state.typeCode !== 'A') ? (
                        <FieldContainer>
                            <DatePicker
                                id="reminderDate"
                                name="Reminder Date"
                                label="Reminder Date"
                                fullWidth={true}
                                value={state?.reminderDate || ''}
                                onChange={valueChanged}
                                variant="outlined"
                                disablePast={true}
                                error={reminderDateRequired === true}
                                helperText={(reminderDateRequired === true ? 'Reminder Date is required' : '')}
                            />
                            
                        </FieldContainer>
                        ) : null}
                    {!claim &&
                        <div>
                            <DrawerSearch isClosed={isOpen} onSearchComplete={onSearchComplete} />
                            {isClaimEmpty ? <span style={{ paddingLeft: 16,fontSize:12,color:"red" }} >Claim ID is required</span> : null}
                        </div>
                    
                    }
                    {!claim &&
                    <FieldContainer>
                    <TextInput
                            id="SelectedClaim"
                            label="Selected Claim"
                            fullWidth={true}
                            value={Claim.claimId}
                            InputProps={{ readOnly: true }}
                            variant="outlined"
                        />
                    </FieldContainer>
          
                    }
                    {state.typeCode === 'T' || state.typeCode === 'M' || state.typeCode === 'D' ? null : (
                        <FieldContainer>
                            <FormControl component="fieldset">
                                <RadioGroup aria-label="" name="role" value={userOrRole} onChange={handleUserOrRoleChange}>
                                    <DropdownContainer>
                                        <FormControlLabel value="user" control={<Radio value="user" />} label="Users" />
                                        <FormControlLabel value="role" control={<Radio value="role" />} label="Roles" />
                                    </DropdownContainer>
                                </RadioGroup>
                            </FormControl>
                        </FieldContainer>
                    )}
                       
                    
                    <div>
                    {userOrRole === 'role'  ? (
                        <DropdownContainer>
                                <FormControl style={{ "width": "100%" }}>
                                <InputLabel id="demo-mutiple-checkbox-label">Roles</InputLabel>
                                <Select
                                        labelId="demo-mutiple-checkbox-label"
                                        id="demo-mutiple-checkbox"
                                        multiple
                                        value={state.roleIDs}
                                        onChange={handleRolesChange}
                                        input={<Input />}
                                        style={{ "width": "100%" }}
                                        renderValue={(selected) => selected.map(x => x.name + ' ' )}
                                >
                                     {
                                        metadata.roles
                                            .map((role, index) => (
                                                <MenuItem key={role.roleID} value={role}>
                                                    <Checkbox checked={state.roleIDs.indexOf(role) > -1 } />
                                                    <ListItemText primary={role.name} />
                                            </MenuItem>
                                        ))}
                                </Select>
                            </FormControl>
                        </DropdownContainer>

                        ) : state.typeCode === 'T' && state.taskTypeID === '2' ? null : userOrRole !== 'role' ?  (
                            <div>
                                <TitleContainer>
                                    Assigned To
                                </TitleContainer>
                                <FieldContainer>
                                    <ClaimUserContainer>
                                            <ExaminerContainer>
                                                {state.typeCode === 'M' ?
                                                    (<Autocomplete
                                                        id="asynchronous-demo"

                                                        open={open}
                                                        onOpen={() => {
                                                            setOpen(true);
                                                        }}
                                                        onClose={() => {
                                                            setOpen(false);
                                                            setLoading(false);
                                                        }}

                                                        getOptionLabel={(option) => option.displayName}
                                                        options={options}
                                                        loading={loading}
                                                        onChange={handleAutoCompleteChange}
                                                        onInputChange={(event, newInputValue) => {
                                                            setTimeout((inputVnewInputValuealue) => handleAutocompleteInputChange(newInputValue), 2000);
                                                        } }
                                                        renderInput={(params) => (
                                                            <TextField
                                                                {...params}
                                                                label="Select User - Type atleast 3 char"
                                                                variant="outlined"
                                                                InputProps={{
                                                                    ...params.InputProps,
                                                                    endAdornment: (
                                                                        <React.Fragment>
                                                                            {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                                                            {params.InputProps.endAdornment}
                                                                        </React.Fragment>
                                                                    ),
                                                                }}
                                                            />
                                                        )}
                                                    />
                                                        ) :
                                                    <div>
                                      
                                             { metadata.loading ?
                                                <span>Loading Claim Examiners...</span> :
                                                <SelectList
                                                id="claimExaminerID"
                                                label="Claim Examiner"
                                                onChange={onValueChanged}
                                                value={state.claimExaminerID}
                                                variant="outlined"
                                                allowempty={false}
                                                >
                                                {state.typeCode === 'T' && state.taskTypeID === '3'?
                                                  (    metadata.claimExaminers.filter(elem => currentNotificationUser.networkID !== elem.userID)
                                                        .map((ce, idx) => <MenuItem value={ce.userID} key={`ce__${idx}`}>{`${ce.firstName} ${ce.lastName}`}</MenuItem>)
                                                  )
                                                      :

                                                  (
                                                      metadata.claimExaminers
                                                        .map((ce, idx) => <MenuItem value={ce.userID} key={`ce__${idx}`}>{`${ce.firstName} ${ce.lastName}`}</MenuItem>)
                                                  )
                                                }

                                                </SelectList>

                                                }
                                            </div>
                                           }
                                        </ExaminerContainer>
                                        <HorizontalDivider />
                                        <FormGroup>
                                            <FormControlLabel
                                                control={<Switch name="isCopyOnly" checked={state.isCopyOnly} onChange={handleChange} size="small" />}
                                                label="Copy Only"
                                                direction="row"
                                            />
                                        </FormGroup>
                                        <HorizontalDivider />
                                        <Button variant="contained" onClick={handleNotificationUser} color="primary">Add User</Button>
                                    </ClaimUserContainer>
                                </FieldContainer>
                                <ClaimExaminerComponent />
                            </div>
                            ) :  null}
                    </div>
                    <div>
                    </div>
                <ButtonContainer>
                        <Button onClick={createNewNotification} variant="contained" color="primary" disabled={state.typeCode === 'T' && state.taskTypeID === '3' && !validUrl ? false : validUrl ? true : canSubmit !== true}>Create Notification</Button>
                     <Button onClick={resetRequest} onClick={resetRequest}  style={{ marginLeft: '1em' }}>Reset Form</Button>
                </ButtonContainer>
                </form>

            </Container>
         </>
      );
}
