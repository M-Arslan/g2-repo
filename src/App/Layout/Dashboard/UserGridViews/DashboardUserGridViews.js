import {
    ChevronRight as ChevronRightIcon,
    Delete as DeleteIcon,

    ExpandMore as ExpandMoreIcon, Save as SaveIcon
} from '@mui/icons-material';
import {
    Accordion as ExpansionPanel,
    AccordionActions as ExpansionPanelActions,
    AccordionDetails as ExpansionPanelDetails,
    AccordionSummary as ExpansionPanelSummary,
    Button,
    Checkbox,
    Divider,
    Drawer,
    FormControl,
    FormControlLabel,
    FormGroup,
    IconButton,
    List,
    ListItem,
    ListItemText,
    MenuItem, Typography
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useSnackbar } from 'notistack';
import React from 'react';
import { useSelector } from 'react-redux';
import { SelectList, TextInput } from '../../../Core/Forms/Common';
import { customGQLQuery } from '../../../Core/Services/EntityGateway';
import { userSelectors } from '../../../Core/State/slices/user';
import { loadUserGridViews } from '../Queries/loadUserGridViews';
const drawerWidth = 350;

const useStyles = makeStyles((theme) => ({
    button: {
        margin: '1em',
    },
    formControl: {
        minWidth: 300,
    },
    selectControl: {
        width: '300px',
        margin: '0 auto',
    },
    root: {
        display: 'flex',
    },
    hide: {
        display: 'none',
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
        listStyle: 'none',
        listStyleType: 'none',
    },
    drawerPaper: {
        width: drawerWidth,
        top: '60px',
    },
    drawerHeader: {
        display: 'flex',
        alignItems: 'center',
        padding: '0 1em',
        justifyContent: 'flex-start',
        backgroundColor: '#bdc3c7',

    },
    content: {
        flexGrow: 1,
        padding: '3em',
        marginRight: -drawerWidth,
    },
    contentShift: {
        marginRight: 0,
    },
    dividerFullWidth: {
        margin: `5px 0 0 2em`,
    },
    dividerInset: {
        margin: `5px 0 0 9px`,
    },
    heading: {
        fontSize: '15px',
        flexBasis: '33.33%',
        flexShrink: 0,
    },
    secondaryHeading: {
        fontSize: '15px',

    },
    expandedPanel: {
        margin: '0px !important'
    },
    panelDetails: {
        flexDirection: "column"
    }
}));


let selectedView;
const columnDataKey = "columnData";
const filterDataKey = "filterData";

export const DashboardUserGridViews = ({ open, reload = false, handleDrawerClose, landingPage, gridApi, userGridViewFunction, columnApi }) => {

    const { enqueueSnackbar } = useSnackbar();
    const [screenName] = React.useState(landingPage);
    const $auth = useSelector(userSelectors.selectAuthContext());


    const [expanded, setExpanded] = React.useState(false);
    const [userViewData, setUserViewData] = React.useState({
        userGridViews: [],
    });
    const [btnUpdateDisabled, setBtnUpdateDisabled] = React.useState(true);
    const [btnDeleteDisabled, setBtnDeleteDisabled] = React.useState(true);
    const [metadata, setMetadata] = React.useState({
        viewName: "",
        setDefaultView: false,
        ddlSelectedView: "2D3D1954-D93A-4469-A534-08D7FDB0ECE0",
    });
    let viewExists = [];
    const classes = useStyles();


    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    const handleInputChange = (evt) => {
        setMetadata({
            ...metadata,
            viewName: evt.target.value,
        })
    };

    let loadDefaultView = (userGridViews) => {
        setMetadata({
            ...metadata,
            ddlSelectedView: "2D3D1954-D93A-4469-A534-08D7FDB0ECE0",
            viewName: "",
            setDefaultView: false
        });
        if (metadata.viewName === '') {
            selectedView = userGridViews.filter(function (item) {
                return item.isDefault === true && item.isSystem === false && item.screenName === landingPage;
            });
        } else {
            selectedView = userGridViews.filter(function (item) {
                return item.isSystem === false && item.screenName === landingPage && metadata.viewName.toLowerCase() === item.viewName.toLowerCase();
            });
        }
        
        if (selectedView.length > 0) {
            selectedView = selectedView[0];
            if (selectedView !== undefined && selectedView.userGridViewID !== undefined) {
                setMetadata({
                    ...metadata,
                    ddlSelectedView: selectedView.userGridViewID,
                    viewName: selectedView.viewName,
                    setDefaultView: selectedView.isDefault
                });
                setBtnUpdateDisabled(false);
                setBtnDeleteDisabled(false);
            }
        }
        else {
            selectedView = userGridViews.filter(function (item) {
                return item.isDefault === true && item.isSystem === true && item.screenName === landingPage;
            });
            if (selectedView.length > 0) {
                selectedView = selectedView[0];
                setMetadata({
                    ...metadata,
                    ddlSelectedView: selectedView.userGridViewID,
                    viewName: "",
                    setDefaultView: false
                });
                setBtnUpdateDisabled(true);
                setBtnDeleteDisabled(true);
            }
        }
        if (typeof userGridViewFunction === 'function') {
            userGridViewFunction(selectedView);
        }
    };

    const onViewChange = (e) => {
        //gridApi.showLoadingOverlay();
        selectedView = userViewData.userGridViews.find(x => x.userGridViewID === e.target.value);
       // loadClaimData();
        if (typeof userGridViewFunction === 'function') {
            userGridViewFunction(selectedView);
        }
        gridApi.sizeColumnsToFit();
        if (selectedView.isSystem) {
            setMetadata({
                ...metadata,
                ddlSelectedView: e.target.value,
                viewName: "",
                setDefaultView: false
            });
            setBtnUpdateDisabled(true);
            setBtnDeleteDisabled(true);

        }
        else {
            setMetadata({
                ...metadata,
                ddlSelectedView: e.target.value,
                viewName: selectedView.viewName,
                setDefaultView: selectedView.isDefault
            });
            setBtnUpdateDisabled(false);
            setBtnDeleteDisabled(false);
        }
        if (typeof handleDrawerClose === 'function') {
            handleDrawerClose();
        }
    };
    const onDefaultCBChange = async (e) => {
        setMetadata({
            ...metadata,
            setDefaultView: e.target.checked,
        });
    };

    const btnDeleteViewClick = async (event) => {
        try {
            if (selectedView.isSystem) {
                enqueueSnackbar('Unable to Delete System View.', { variant: 'error',  anchorOrigin: { vertical: 'top', horizontal: 'center' } });
                return;
            }
            let query = {
                "query": 'mutation {  delete(userGridViewID: "' + selectedView.userGridViewID + '") {userGridViewID}}',
            }
            const result = await customGQLQuery(`user-grid-view`, query);
            if (result && result.data) {
                enqueueSnackbar('View Deleted.', { variant: 'success', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
                loaduserGridData();
            }
            else if (result.errors) {
                result.errors.map((err, index) =>  enqueueSnackbar(err.message, { variant: 'error',  anchorOrigin: { vertical: 'top', horizontal: 'center' } }));
            }
            else {
                enqueueSnackbar('Unable to Delete View.', { variant: 'error',  anchorOrigin: { vertical: 'top', horizontal: 'center' } });
            }
        }
        catch (e) {
            console.log(e);
            enqueueSnackbar("Error!", { variant: 'error',  anchorOrigin: { vertical: 'top', horizontal: 'center' } });
        }
    };

    const btnUpdateViewClick = async (event) => {
        try {
            if (selectedView.isSystem) {
                enqueueSnackbar('Unable to Update System View.', { variant: 'error',  anchorOrigin: { vertical: 'top', horizontal: 'center' } });
                return;
            }
            viewExists = userViewData.userGridViews.filter(function (view) {
                return (view.viewName.toString().toLowerCase() === metadata.viewName.toLowerCase() && view.createdBy.toString().toLowerCase() === selectedView.createdBy.toLowerCase() && view.screenName.toString().toLowerCase() === selectedView.screenName.toLowerCase() && view.userGridViewID.toString().toLowerCase() !== selectedView.userGridViewID.toLowerCase());
            });
            if (viewExists.length) {
                enqueueSnackbar("You already have a view with this name." + metadata.viewName, { variant: 'error',  anchorOrigin: { vertical: 'top', horizontal: 'center' } });
                return;
            }
            let columnData = localStorage.getItem(columnDataKey);
            let filterData = localStorage.getItem(filterDataKey);
            let currentUser = $auth.currentUser;

            if (columnData === null) {
                columnData = JSON.stringify(columnApi.getColumnState());
                localStorage.setItem(columnDataKey, columnData);
            }
            if (filterData === null) {
                filterData = JSON.stringify(gridApi.getFilterModel());
                localStorage.setItem(filterDataKey, filterData);

            }
            let GetDateTime = (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().slice(0, -1);

            let metadataObj = {
                "userGridViewID": selectedView.userGridViewID,
                "viewName": metadata.viewName,
                "isDefault": metadata.setDefaultView,
                "isSystem": selectedView.isSystem,
                "columnData": columnData,
                "filterData": filterData,
                "screenName": selectedView.screenName,
                "createdBy": selectedView.createdBy,
                "createdDate": selectedView.createdDate,
                "modifiedBy": currentUser.id,
                "modifiedDate": GetDateTime
            };

            let query = {
                "query": "mutation($userGridView: UserGridViewInputType!) {update(userGridView: $userGridView){userGridViewID}}",
                "variables": { "userGridView": metadataObj }
            }
            const result = await customGQLQuery(`user-grid-view`, query);
            if (result && result.data) {
                enqueueSnackbar('View Updated.', { variant: 'success', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
                loaduserGridData();
                metadata.viewName = "";
            }
            else if (result.errors) {
                result.errors.map((err, index) => enqueueSnackbar(err.message, { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' } }));
            }
            else {
                enqueueSnackbar('Unable to Update View.', { variant: 'error',  anchorOrigin: { vertical: 'top', horizontal: 'center' } });
            }
        } catch (e) {
            console.log(e);
            e.map((err, index) => {
                enqueueSnackbar(err.message, { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
            });
        }

    };
    const btnSaveViewClick = async (event) => {
        var format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
        try {

            if (metadata.viewName === "" || metadata.viewName.trim() === "") {
                enqueueSnackbar("Please enter a view name", { variant: 'error',  anchorOrigin: { vertical: 'top', horizontal: 'center' } });
            }
            else if (format.test(metadata.viewName)) {
                enqueueSnackbar("Special Characters are not allowed", { variant: 'error',  anchorOrigin: { vertical: 'top', horizontal: 'center' } });
                return;
            }
            else {
                let currentUser = $auth.currentUser;
                viewExists = userViewData.userGridViews.filter(function (view) {
                    return (view.viewName.toString().toLowerCase() === metadata.viewName.toLowerCase() && view.createdBy.toString().toLowerCase() === currentUser.id.toLowerCase() && view.screenName.toString().toLowerCase() === landingPage.toLowerCase());
                });
                if (viewExists.length) {
                    enqueueSnackbar("You already have a view with this name." + metadata.viewName, { variant: 'error',  anchorOrigin: { vertical: 'top', horizontal: 'center' } });
                    return;
                }

                let columnData = localStorage.getItem(columnDataKey);

                let filterData = localStorage.getItem(filterDataKey);


                if (columnData === null) {
                    columnData = JSON.stringify(columnApi.getColumnState());
                    localStorage.setItem(columnDataKey, columnData);
                }
                if (filterData === null) {
                    filterData = gridApi.getFilterModel();
                    if (selectedView.isSystem === true && selectedView.isDefault === true  && (landingPage === "AccountingLandingPage" || landingPage === "ClaimsLandingPage")) {
                        filterData.statusText = { "values": ["New"], "filterType": "set" };
                        filterData.claimExaminerFullName = { "values": [currentUser.fullName], "filterType": "set" };
                    }
                    filterData = JSON.stringify(filterData);
                    localStorage.setItem(filterDataKey, filterData);
                }


                let GetDateTime = (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().slice(0, -1);

                let metadataObj = {
                    "viewName": metadata.viewName,
                    "isDefault": metadata.setDefaultView,
                    "isSystem": false,
                    "columnData": columnData,
                    "filterData": filterData,
                    "createdBy": currentUser.id,
                    "createdDate": GetDateTime,
                    "modifiedBy": currentUser.id,
                    "modifiedDate": GetDateTime,
                    "screenName": screenName
                };


                let query = {
                    "query": "mutation($userGridView: UserGridViewInputType!) {create(userGridView: $userGridView){userGridViewID}}",
                    "variables": { "userGridView": metadataObj }
                }
                const result = await customGQLQuery(`user-grid-view`, query);
                if (result && result.data) {
                    enqueueSnackbar('New View created.', { variant: 'success', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
                    loaduserGridData();
                    metadata.viewName = "";
                }
                else if (result.errors) {
                    result.errors.map((err, index) => {
                        enqueueSnackbar(err.message, { variant: 'error',  anchorOrigin: { vertical: 'top', horizontal: 'center' } });
                    }
                    );
                }
                else {
                    enqueueSnackbar('Unable to create View.', { variant: 'error',  anchorOrigin: { vertical: 'top', horizontal: 'center' } });
                }
            }
        } catch (e) {
            console.log(e);
            e.map((err, index) => {
                enqueueSnackbar(err.message, { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
            });
        }
    }


    const loaduserGridData = async () => {
        let currentUser = $auth.currentUser;
        let cid = currentUser.id.replace("\\", "%5C");
        let userGridViewData = await loadUserGridViews(cid);
        let uGViews = userGridViewData.userGridViews;
        if (uGViews === null) {
            uGViews = [];
        }
        setUserViewData({
            userGridViews: uGViews,
        });
        loadDefaultView(uGViews);
        return uGViews;
    };


    React.useEffect(() => {
        Promise.all([
            loaduserGridData(),
        ]).then(([ug]) => {
            setUserViewData({
                userGridViews: ug
            });
        });
    }, [reload])


    return (
        <Drawer
            className={classes.drawer}
            anchor="right"
            open={open}
            classes={{
                paper: classes.drawerPaper,
            }}
        >

            <div className={classes.drawerHeader}>
                <IconButton onClick={handleDrawerClose}>
                    <ChevronRightIcon />
                </IconButton>
                            View Settings
                        </div>
            <ExpansionPanel expanded={expanded === 'panel1'} onChange={handleChange('panel1')} classes={{ expanded: classes.expandedPanel }}>
                <ExpansionPanelSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1bh-content"
                    id="panel1bh-header"
                >
                    <Typography className={classes.heading}>My Views</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                    <FormControl className={classes.selectControl}>
                        <SelectList onChange={onViewChange} label="Select View" id="ddlSelectedView" variant="outlined" value={metadata?.ddlSelectedView || ""}>
                            {userViewData.userGridViews.map(item => {
                                if (!item.isSystem && item.screenName === landingPage) {
                                    return <MenuItem value={item.userGridViewID}>{item.viewName}</MenuItem>
                                }
                            })}
                        </SelectList>
                    </FormControl>
                </ExpansionPanelDetails>
                <Divider />
                <ExpansionPanelDetails className={classes.panelDetails}>
                    <FormGroup row>
                        <FormControl className={classes.selectControl}>
                            <TextInput id="view-name" label="View Name" variant="outlined" value={metadata?.viewName || ""}
                                inputProps={{ maxLength: 50 }}
                                onChange={handleInputChange}
                            />
                        </FormControl>
                    </FormGroup>
                    <FormGroup row>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    id="cbDefaultView"
                                    name="cbDefaultView"
                                    color="primary"
                                    checked={metadata?.setDefaultView}
                                    onChange={onDefaultCBChange}
                                />
                            }
                            label="Set as default View"
                        />
                    </FormGroup>
                </ExpansionPanelDetails>
                <ExpansionPanelActions>
                    <Button size="small"
                        variant="contained"
                        color="secondary"
                        className={classes.margin}
                        disabled={btnDeleteDisabled}
                        startIcon={<DeleteIcon />}
                        onClick={btnDeleteViewClick}>Delete</Button>
                    <Button
                        variant="contained"
                        color="primary"
                        className={classes.margin}
                        size="small"
                        id="btnUpdateView"
                        disabled={btnUpdateDisabled}
                        startIcon={<SaveIcon />}
                        onClick={btnUpdateViewClick}>
                        Update
                        </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        className={classes.margin}
                        startIcon={<SaveIcon />}
                        onClick={btnSaveViewClick}>
                        Create
                                </Button>
                </ExpansionPanelActions>
                <Divider />
            </ExpansionPanel>
            <ExpansionPanel expanded={expanded === 'panel2'} onChange={handleChange('panel2')} classes={{ expanded: classes.expandedPanel }}>
                <ExpansionPanelSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel2bh-content"
                    id="panel2bh-header"
                >
                    <Typography className={classes.heading}>System Views</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails className={classes.panelDetails}>
                    <FormControl className={classes.selectControl}>
                        <SelectList onChange={onViewChange} label="Select System View" variant="outlined" id="ddlSelectedView" value={metadata?.ddlSelectedView || ""}>
                            {userViewData.userGridViews.map(item => {
                                if (item.isSystem && item.screenName === landingPage) {
                                    return <MenuItem value={item.userGridViewID}>{item.viewName}</MenuItem>
                                }
                            })}
                        </SelectList>
                    </FormControl>
                </ExpansionPanelDetails>
            </ExpansionPanel>
            {  landingPage === "AccountingLandingPage" ?
                <>
                <Divider />
                <List>
                    <a href="/accounting/draft">
                        <ListItem button>
                            <ListItemText primary="Draft Invoice Dashboard" />
                        </ListItem>
                        </a>
                    </List> </> : null
            }
            
        </Drawer>
    );
}