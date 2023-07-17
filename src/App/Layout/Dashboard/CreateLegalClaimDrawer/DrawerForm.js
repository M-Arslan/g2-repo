import {
    Button, Divider, MenuItem
} from '@mui/material';
import {
    useSnackbar
} from 'notistack';
import React from 'react';
import styled from 'styled-components';
import {
    DatePicker,
    SelectList,

    SwitchInput, TextInput
} from '../../../Core/Forms/Common';
import {
    getClaimExaminers, getG2Companies
} from '../../../Core/Services/EntityGateway';
import {
    ButtonContainer, FieldContainer
} from './FieldContainer';
import {
    PolicyNumberInput, STATUS
} from './PolicyNumberInput';
import { CLAIM_TYPES } from '../../../Core/Enumerations/app/claim-type';
const AlertBox = styled.div`
    width: 100%;
    padding: 1em;
    background-color: rgba(256, 256, 66, .5);
    color: #999900;
`;

const FormDivider = styled(Divider)` margin-bottom: 1em !important; `;

const BlankRequest = {
    claimType: '',
    claimPolicyID: '',
    claimExaminerID: '',
    dOL: null,
    dateReceived: null,
    lossDesc: '',
    g2LegalEntityID: '',
    claimPolicy: null,

};
const PolicyBlankRequest = {
    polEffDate: null,
    polExpDate: null,
    insuredName: '',
    policyID: null,
    active: "true"
}
let isPolicyValid = false;
export const DrawerForm = ({ onSubmit, screenName }) => {

    const [state, setState] = React.useState({ ...BlankRequest });
    const [manualpolicyState, setManualPolicyState] = React.useState({ ...PolicyBlankRequest });
    const [canSubmit, setCanSubmit] = React.useState(false);
    const childRef = React.useRef();
    const [errors, setErrors] = React.useState(Object.keys(BlankRequest).reduce((errs, k) => ({ ...errs, [k]: false }), {}));
    const [disableFields, setDisableFields] = React.useState(true);
    const [dateReceivedError, setDateReceivedError] = React.useState(false);
    const [expiryDateError, setExpiryDateError] = React.useState(false);
    const [manualPolicyInsuredNameError, setManualPolicyInsuredNameError] = React.useState(false);
    const [manualPolicyNumberError, setManualPolicyNumberError] = React.useState(false);
    const [metadata, setMetadata] = React.useState({
        loading: true,
        claimExaminers: [],
        companies: [],
    });
    const [isManualPolicy, setIsManualPolicy] = React.useState(false);

    React.useEffect(() => {

        if (screenName === "LegalLandingPage") {
            setState({ ...state, claimType: CLAIM_TYPES.LEGAL });
        }

        Promise.all([
            getClaimExaminers(),
            getG2Companies()
        ])
            .then(([ce, gc]) => {
                setMetadata({
                    loading: false,
                    claimExaminers: (ce || []),
                    companies: (gc || [])
                });
            });
    }, []);
    const onManualPolicyChange = () => {
        setIsManualPolicy(!isManualPolicy);
    }
    const onValueChanged = (evt) => {
        let newRequest = { ...state, [evt.target.name]: evt.target.value };
        if (evt.target.name === 'claimExaminerID') {
            const ce = (metadata.claimExaminers.find(c => c.userID === evt.target.value) || {})
            newRequest = { ...newRequest, "claimBranchID": ce.branchID };
        }

        if (evt.target.name === 'claimPolicyID') {
            newRequest = {
                ...newRequest,
                deptCD: evt.target.policy.departmentCode,
                uwDept: evt.target.policy.departmentName,
                insuredName: evt.target.policy.insuredName,
                insuredNameContinuation: evt.target.policy.insuredNameContinuation,
            };
        }

        setState(newRequest);
        setCanSubmit(hasAnyError(newRequest) === false);
    };
    const onManualPolicyValueChanged = (evt) => {
        if (evt.target.name === 'policyID') {
            if (evt.target.value !== null) {
                setDisableFields(false);
            }
        }
        let newRequest = { ...manualpolicyState, [evt.target.name]: evt.target.value };
        setManualPolicyState(newRequest);
    }

    const prepareRequest = (request) => {
        return Object.keys(request).reduce((r, k) => {
            const val = request[k];
            return { ...r, [k]: (typeof val === 'string' && val === '' ? null : val) }
        }, {});
    };

    const validateRequest = (request) => {
        const errs = Object.keys(BlankRequest).reduce((errs, k) => ({ ...errs, [k]: false }), {});
        errs.claimType = (typeof request.claimType !== 'string' || request.claimType === '');
        errs.claimPolicyID = (request.claimPolicyID !== null && isPolicyValid !== true);
        errs.claimExaminerID = (request.claimExaminerID === '');
        errs.lossDesc = (typeof request.lossDesc === 'string' && request.lossDesc.length > 500);
        errs.g2LegalEntityID = (request.g2LegalEntityID === null);

        return errs;
    };

    const hasAnyError = (req) => {
        const errs = validateRequest(prepareRequest(req));
        return (Object.keys(errs).some(k => errs[k] === true) === true);
    };
    const { enqueueSnackbar } = useSnackbar();
    const submitRequest = () => {
        let checkPolicyFlag = childRef?.current?.checkPolicy();
        let manualPolicyError = false;
        if (checkPolicyFlag === false) {
            enqueueSnackbar("Policy ID is not Verified", { variant: 'error',  anchorOrigin: { vertical: 'top', horizontal: 'center' } });
            setPolicySearchStatus(true);
            return;
        }
        if (isManualPolicy) {
            if (manualpolicyState.insuredName === '' || manualpolicyState.insuredName.trim().length <= 0) {
                setManualPolicyInsuredNameError(true);
                manualPolicyError = true;
            }
            if (!manualpolicyState.policyID) {
                setManualPolicyNumberError(true);
                manualPolicyError = true;
            }
            if (manualPolicyError) {
                return;
            }
        }
        setManualPolicyInsuredNameError(false);
        setManualPolicyNumberError(false);
        if (state.dateReceived) {
            if (new Date(state.dOL) > new Date(state.dateReceived)) {
                setDateReceivedError(true);
                return;
            }
        }
        if (isManualPolicy && manualpolicyState.polExpDate && (new Date(manualpolicyState.polEffDate) > new Date(manualpolicyState.polExpDate))) {
            setExpiryDateError(true);
            return;
        }
        setCanSubmit(false);
        setDateReceivedError(false);
        const request = prepareRequest(state);
        if (isManualPolicy && manualpolicyState.policyID) {
            request.claimPolicy = manualpolicyState;
            request.claimPolicyID = null;
            request.insuredName = manualpolicyState.insuredName;
        }
        const errs = validateRequest(request);
        if (Object.keys(errs).map(k => errs[k]).some(v => v === true) === true) {
            setErrors(errs);
        }
        else if (typeof onSubmit === 'function') {
            request.claimPolicyID = childRef?.current?.getPolicyStatus() === 1 ? childRef.current.getPolicyID() : null;
            onSubmit(request);
        }
    };

    const resetRequest = () => {
        const req = { ...BlankRequest };
        const b_req = { ...PolicyBlankRequest };
        setState(req);
        setManualPolicyState(b_req);
        setErrors(Object.keys(req).reduce((errs, k) => ({ ...errs, [k]: false }), {}));
        setCanSubmit(hasAnyError(req) === false)
    };

    const policySearchStatusChanged = ({ current }) => {
        if (current !== STATUS.SEARCHING) {
            const policyValid = (current !== STATUS.INVALID);
            isPolicyValid = policyValid;
            setCanSubmit(policyValid && (hasAnyError({ ...state }) === false));
        }
    };

    return (
        <>
            <AlertBox>
                <p>No Claim currently exists for this Claim ID.  Please provide the required details below:</p>
                <span>Policy Valid: {isPolicyValid}</span>
            </AlertBox>
            <FormDivider />
            <form>
                <FieldContainer>
                    <SelectList
                        id="claimType"
                        label="Claim Type"
                        value={state.claimType}
                        onChange={onValueChanged}
                        variant="outlined"
                        error={errors.claimType === true}
                        helperText={(errors.claimType === true ? 'Claim Type is required' : '')}
                        required
                        allowempty={true}
                        inputProps={{ readOnly: screenName === 'LegalLandingPage' === true }}
                    >
                        <MenuItem value="P">Property</MenuItem>
                        <MenuItem value="C">Casualty</MenuItem>
                        <MenuItem value="L" disabled={screenName === 'ClaimsLandingPage' ? true : false}  >Legal</MenuItem>
                    </SelectList>
                </FieldContainer>
                <FieldContainer>
                    {
                        metadata.loading ?
                            <span>Loading Legal Entities...</span> :
                            <SelectList
                                id="g2LegalEntityID"
                                label="Legal Entity"
                                value={state.g2LegalEntityID}
                                onChange={onValueChanged}
                                variant="outlined"
                                error={errors.g2LegalEntityID === true}
                                helperText={(errors.g2LegalEntityID === true ? 'G2 Legal Entity is required' : '')}
                                allowempty={false}
                                required
                            >
                                {
                                    metadata.companies
                                        .map((gc, idx) => <MenuItem value={gc.g2LegalEntityID} key={`ce__${idx}`}>{`${gc.g2LegalEntityDesc}`}</MenuItem>)
                                }
                            </SelectList>
                    }
                </FieldContainer>

                <FieldContainer>
                    <SwitchInput label={"Manual Policy"} tootltip={"Manual Policy"} onChange={onManualPolicyChange} />
                </FieldContainer>
                {!isManualPolicy ? (
                    <FieldContainer>
                        <PolicyNumberInput ref={childRef} onChange={onValueChanged} onSearchStatusChanged={policySearchStatusChanged} isPolicyValidStatus={policySearchStatus} />
                    </FieldContainer>
                ) : (
                <>
                <FieldContainer>
                    <TextInput
                        id="policyID"
                        name="policyID"
                        label="Claim Manual Policy Number"
                        value={manualpolicyState.policyID}
                        onChange={onManualPolicyValueChanged}
                        inputProps={{
                            maxLength: 10,
                        }}
                        maxLength="500"
                        error={manualPolicyNumberError}
                        helperText={manualPolicyNumberError ? 'Policy ID is required' : ''}
                    />
                </FieldContainer>
                <FieldContainer>
                    <TextInput
                        id="insuredName"
                        label="Insured Name"
                        value={manualpolicyState.insuredName}
                        onChange={onManualPolicyValueChanged}
                        disabled={disableFields ? true : false}    
                        maxLength="500"
                        error={errors.insuredName === true}
                        multiline
                        inputProps={{
                            maxLength: 50,
                                    }}
                        rows={2}
                        error={manualPolicyInsuredNameError}
                        helperText={manualPolicyInsuredNameError ? 'Insured Name is required' : ''}
                    />
                </FieldContainer> 
                <FieldContainer>
                    <DatePicker
                        id="polEffDate"
                        name="polEffDate"
                        label="Effective Date"
                        value={manualpolicyState.polEffDate}
                        onChange={onManualPolicyValueChanged}
                        disabled={disableFields ? true : false}  
                        disableFuture={true}
                        error={errors.polEffDate}
                        helperText={errors.polEffDate ? errors.polEffDate.message : ""}
                    />
                </FieldContainer>

                            <FieldContainer>
                                <DatePicker
                                    id="polExpDate"
                                    name="polExpDate"
                                    label="Expiry Date"
                                    value={manualpolicyState.polExpDate}
                                    onChange={onManualPolicyValueChanged}
                                    disableFuture={false}
                                    disabled={disableFields ? true : false}
                                    error={expiryDateError}
                                    helperText={expiryDateError === true ? 'Expiry Date cannot be previous than Effective Date' : ''}

                                />
                            </FieldContainer>
                        </>
                    )}
                <FieldContainer>
                    {
                        metadata.loading ?
                            <span>Loading Claim Examiners...</span> :
                            <SelectList
                                id="claimExaminerID"
                                label="Claim Examiner"
                                value={state.claimExaminerID}
                                onChange={onValueChanged}
                                variant="outlined"
                                allowempty={false}
                            >
                                {
                                    metadata.claimExaminers
                                        .map((ce, idx) => <MenuItem value={ce.userID} key={`ce__${idx}`}>{`${ce.firstName} ${ce.lastName}`}</MenuItem>)
                                }
                            </SelectList>
                    }
                </FieldContainer>
                <FieldContainer>
                    <DatePicker
                        id="dOL"
                        name="dOL"
                        label="Date of Loss"
                        value={state.dOL}
                        onChange={onValueChanged}
                        disableFuture={true}
                        error={errors.dOL}
                        helperText={errors.dOL ? errors.dOL.message : ""}
                    />
                </FieldContainer>
                <FieldContainer>
                    <DatePicker
                        id="dateReceived"
                        name="dateReceived"
                        label="Claim Reported date"
                        value={state.dateReceived}
                        onChange={onValueChanged}
                        disableFuture={true}
                        error={dateReceivedError}
                        helperText={dateReceivedError === true ? 'Reported Date cannot be previous than DOL' : ''}
                    />
                </FieldContainer>
                <FieldContainer>
                    <TextInput
                        id="lossDesc"
                        label="Brief Description of Loss"
                        value={state.lossDesc}
                        onChange={onValueChanged}
                        maxLength="500"
                        error={errors.lossDesc === true}
                        multiline
                        rows={2}
                    />
                </FieldContainer>
                <ButtonContainer>
                    <Button onClick={submitRequest} variant="contained" color="primary" disabled={canSubmit !== true}>Create Claim</Button>
                    <Button onClick={resetRequest} style={{ marginLeft: '1em' }}>Reset Form</Button>
                </ButtonContainer>
            </form>
        </>
    );
}