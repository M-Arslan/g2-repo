import {
    ChevronLeft
} from '@mui/icons-material';
import {
    Button, Divider, Drawer,
    IconButton,
    MenuItem
} from '@mui/material';
import {
    makeStyles
} from '@mui/styles';
import {
    useSnackbar
} from 'notistack';
import React from 'react';
import { useForm } from "react-hook-form";
import {
    useDispatch,
    useSelector
} from 'react-redux';
import styled from 'styled-components';
import {
    ASYNC_STATES
} from '../../../Core/Enumerations/redux/async-states';
import {
    DatePicker,
    formatDate,
    SelectList,
    Spinner
} from '../../../Core/Forms/Common';
import {
    customGQLQuery, getClaimExaminers, getG2Companies
} from '../../../Core/Services/EntityGateway';
import {
    LegalClaimActions,
    LegalClaimSelectors
} from '../../../Core/State/slices/legal-claim';
import {
    companiesSelectors
} from '../../../Core/State/slices/metadata/companies';
import {
    usersSelectors
} from '../../../Core/State/slices/users';
import {
    uuid
} from '../../../Core/Utility/uuid';
import { getDJClaimID } from '../Queries/loadClaimGridData';
import {
    ButtonContainer, FieldContainer
} from './FieldContainer';
import { CLAIM_TYPES } from '../../../Core/Enumerations/app/claim-type';
import { COMPANY_NAME } from '../../../Core/Enumerations/app/company-name';

const drawerWidth = 350;

const useStyles = makeStyles((theme) => ({
    button: {
        margin: '1em',
    },
    formControl: {
        minWidth: 300,
    },
    selectControl: {
        margin: '1em',
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
        // necessary for content to be below app bar
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

const ScrollPanel = styled.div`
    height: calc(100% - 85px - 45px);
    width: 100%;
    padding: 0;
    margin: 0;
    border: 0;
    overflow-x: hidden;
    overflow-y: auto;
`;
const FormDivider = styled(Divider)` margin-bottom: 1em !important; `;

export const CreateLegalClaimDrawer = ({ isOpen, onCloseDrawer }) => {

    const claimCounsils = useSelector(usersSelectors.getClaimCounsel());
    const legalClaimState = useSelector(LegalClaimSelectors.selectLoading());
    const Companies = useSelector(companiesSelectors.selectData());

    let companies = Companies?.filter((e) => {
        return e.g2CompanyNameID !== COMPANY_NAME.OTHER;
    });

    const formValidator = useForm();
    const { trigger, formState: { errors }, unregister, setValue, register, clearErrors } = formValidator;

    const $dispatch = useDispatch();

    const { enqueueSnackbar } = useSnackbar();

    const [legalClaim, setLegalClaim] = React.useState({});
    const [isProcessing, setIsProcessing] = React.useState(false);
    React.useEffect(() => {

    setValue("claimCounselUserID", legalClaim?.claimCounselUserID ? legalClaim?.claimCounselUserID : null);
   /* setValue("g2LegalEntityID", legalClaim.g2LegalEntityID ? legalClaim.g2LegalEntityID : null);*/
    setValue("g2CompanyNameID", legalClaim?.g2CompanyNameID ? legalClaim?.g2CompanyNameID : null);
    },[])

    const classes = useStyles();

    const closeDrawer = () => {
        if (typeof onCloseDrawer === 'function') {
            onCloseDrawer();
            clearErrors(['claimCounselUserID', 'assignedToCounsel', 'g2CompanyNameID']);
        }

        setLegalClaim({});
    };
    const validateLegalClaim = async (triggerValidation) => {
        let isLegalClaimValid = true, result = true;

        result = await triggerValidation("assignedToCounsel");
        if (!result)
            isLegalClaimValid = result;

        result = await triggerValidation("claimCounselUserID");
        if (!result)
            isLegalClaimValid = result;

        result = await triggerValidation("g2CompanyNameID");
        if (!result)
            isLegalClaimValid = result;

        return isLegalClaimValid;
    }
    const onCreateLegalClaim = async () => {
        if (await validateLegalClaim(trigger) === false)
            return;
        setIsProcessing(true);
        const resultDJClaimID = await getDJClaimID();

        if (resultDJClaimID?.data?.getDJClaimID?.claimID) {
            let newG2LegalEntityID = companies.filter(e => e.g2CompanyNameID === legalClaim.g2CompanyNameID);
            const claim = { g2LegalEntityID: newG2LegalEntityID[0].g2LegalEntityID, g2CompanyNameID: legalClaim.g2CompanyNameID, claimMasterID: uuid(), claimID: resultDJClaimID.data.getDJClaimID.claimID, claimType: CLAIM_TYPES.LEGAL };
            const query = {
                "query": "mutation($claim:CreateClaimInputType!) {create(claim:$claim)}",
                "variables": { "claim": claim }
            };

            const result = await customGQLQuery(`claim-master`, query);
            if (result?.data?.create) {
                legalClaim.claimMasterID = claim.claimMasterID;
                $dispatch(LegalClaimActions.save({ legal_claim: legalClaim }))
            }
            else {
                const { error = null, errors = null, data = null } = result;

                if (error) {
                    enqueueSnackbar(error.replace("GraphQL.ExecutionError:", ""), { variant: 'error',  anchorOrigin: { vertical: 'top', horizontal: 'center' } });
                }
                if (Array.isArray(errors) && errors?.length > 0) {
                    errors?.forEach((err) => {
                        enqueueSnackbar(err.message.replace("GraphQL.ExecutionError:", ""), { variant: 'error',  anchorOrigin: { vertical: 'top', horizontal: 'center' } });
                    });
                }
                setIsProcessing(false);
            }
        } else
        {
            setIsProcessing(false);
            enqueueSnackbar("Unable to generate DJClaimID.", { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
        }
    };

    const onValueChanged = (e) => {
        const { name, value } = e.target;
        legalClaim[name] = value;
        setValue(name, value ? value : null);
        setLegalClaim(legalClaim);
    }

    const onDateChanged = (e) => {
        const { name, value } = e.target;
        let newVal = value ? (new Date(value)).toISOString() : null;
        legalClaim[name] = newVal;
        setValue(name, value ? value : null);
        setLegalClaim(JSON.parse(JSON.stringify(legalClaim)));

    };
    React.useEffect(() => {
        Promise.all([
            getClaimExaminers(),
            getG2Companies()
        ])
            .then(([ce, gc]) => {
               
            });

        if (legalClaimState === ASYNC_STATES.SUCCESS) {
            $dispatch(LegalClaimActions.clearStatus())
            onCloseDrawer();
            setIsProcessing(false);
            if (legalClaim.claimMasterID) {
                enqueueSnackbar("Legal claim has been created successfully.", { variant: 'success', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
                window.location.href = "/Legal/" + legalClaim.claimMasterID;
            }
            setLegalClaim({});

        }
       // register({ name: "claimCounselUserID" }, { required: "This field is required.", type: 'custom' });
        //register({ name: "g2CompanyNameID" }, { required: "This field is required.", type: 'custom' });

        return () => {
            unregister("claimCounselUserID");
            unregister("g2CompanyNameID");
        }

    }, [legalClaimState])

    return (

        <Drawer
            className={classes.drawer}
            anchor="left"
            open={isOpen}
            classes={{
                paper: classes.drawerPaper,
            }}
        >
            <div className={classes.drawerHeader}>
                <IconButton name="arrowchevron_right" onClick={closeDrawer}>
                    <ChevronLeft />
                </IconButton>
                Create a New Legal Claim
            </div>
            <ScrollPanel>
                    <FormDivider />
                    {isProcessing ? <Spinner /> :
                        <form>
                            <FieldContainer>
                                <SelectList
                                    id="search"
                                    label="Claim Counsel Search"
                                    value={legalClaim?.claimCounselUserID}
                                    variant="outlined"
                                    name="claimCounselUserID"
                                    {...register("claimCounselUserID", {
                                        required: "This field is required.",
                                        onChange: (e) => onValueChanged(e)
                                    })}
                                    error={errors?.claimCounselUserID}
                                    helperText={errors?.claimCounselUserID ? "This field is required" : ""}
                                    allowempty={false}
                                    required
                                >
                                    {claimCounsils.length ?
                                        claimCounsils.map((x) => <MenuItem value={x.userID}>{x.fullName}</MenuItem>)
                                        : null}
                                </SelectList>
                            </FieldContainer>
                            <FieldContainer>
                                <DatePicker
                                    id="assignedToCounsel"
                                    name="assignedToCounsel"
                                    label="Assigned To Counsel"
                                    variant="outlined"
                                    value={formatDate(legalClaim?.assignedToCounsel) || null}
                                    disableFuture={true}
                                    required
                                    {...register("assignedToCounsel", {
                                        required: "This field is required.",
                                        onChange: (e) => onDateChanged(e)
                                    })}
                                    error={errors?.assignedToCounsel}
                                    helperText={errors?.assignedToCounsel ? "This field is required" : ""}

                                />
                            </FieldContainer>
                            <FieldContainer>
                                {
                                    companies === null ?
                                        <span>Loading Company Entities...</span> :
                                        <SelectList
                                            id="g2CompanyNameID"
                                            label="Company"
                                            name="g2CompanyNameID"
                                            value={legalClaim?.g2CompanyNameID}
                                            variant="outlined"
                                            allowempty={false}
                                            {...register("g2CompanyNameID", {
                                                required: "This field is required.",
                                                   onChange: (e) => onValueChanged(e)
                                            })}
                                            error={errors?.g2CompanyNameID}
                                            helperText={errors?.g2CompanyNameID ? "This field is required" : ""}
                                            required
                                        >
                                            {

                                                companies?.map((gc, idx) => <MenuItem value={gc.g2CompanyNameID} key={`ce__${idx}`}>{`${gc.companyName}`}</MenuItem>)
                                            }

                                        </SelectList>
                                }
                            </FieldContainer>
                            <ButtonContainer>
                                <Button variant="contained" color="primary" onClick={onCreateLegalClaim}>Create Claim</Button>
                                <Button style={{ marginLeft: '1em' }} onClick={closeDrawer}>Cancel</Button>
                            </ButtonContainer>
                        </form>
                    }
            </ScrollPanel>
        </Drawer>
    );
}


