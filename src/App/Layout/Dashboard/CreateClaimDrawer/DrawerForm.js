import {
    Button,

    Divider, MenuItem
} from '@mui/material';
import {
    useSnackbar
} from 'notistack';
import React from 'react';
import {
    useSelector
} from 'react-redux';
import styled from 'styled-components';
import {
    DatePicker,
    SelectList,

    SwitchInput, TextInput
} from '../../../Core/Forms/Common';
import {
    getClaimExaminers
} from '../../../Core/Services/EntityGateway';
import {
    companiesSelectors
} from '../../../Core/State/slices/metadata/companies';
import {
    ButtonContainer, FieldContainer
} from './FieldContainer';
import {
    PolicyNumberInput, STATUS
} from './PolicyNumberInput';
import { COMPANY_NAME } from '../../../Core/Enumerations/app/company-name';



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
    g2CompanyNameID: '',
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
    const [g2LegalEntityID, setG2LegalEntityID] = React.useState(0);
    const childRef = React.useRef();
    //const [isPolicyValid, setIsPolicyValid] = React.useState(false);
    const [errors, setErrors] = React.useState(Object.keys(BlankRequest).reduce((errs, k) => ({ ...errs, [k]: false }), {}));
    const [disableFields, setDisableFields] = React.useState(true);
    const [dateReceivedError, setDateReceivedError] = React.useState(false);
    const [expiryDateError, setExpiryDateError] = React.useState(false);
    const [policySearchStatus, setPolicySearchStatus] = React.useState(false);
    const [manualPolicyInsuredNameError, setManualPolicyInsuredNameError] = React.useState(false);
    const [manualPolicyNumberError, setManualPolicyNumberError] = React.useState(false);

    let companies = useSelector(companiesSelectors.selectData());
    companies = companies?.filter((e) => {
        return e.g2CompanyNameID !== COMPANY_NAME.OTHER;
    });

    const [metadata, setMetadata] = React.useState({
        loading: true,
        claimExaminers: []
    });
    const [isManualPolicy, setIsManualPolicy] = React.useState(false);

    React.useEffect(() => {
        Promise.all([
            getClaimExaminers()
        ])
            .then(([ce]) => {
                setMetadata({
                    loading: false,
                    claimExaminers: (ce || [])
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
        if (evt.target.name === 'g2CompanyNameID') {
            setG2LegalEntityID(companies.filter(e => e.g2CompanyNameID === evt.target.value)[0].g2LegalEntityID)
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
            if (evt.target.value != null) {
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
        errs.claimExaminerID = (request.claimExaminerID == '');
        errs.lossDesc = (typeof request.lossDesc === 'string' && request.lossDesc.length > 500);
        errs.g2CompanyNameID = (request.g2CompanyNameID === null);
        
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
            } else {
                let recDate = new Date(state.dateReceived)
                state.dateReceived = recDate.toISOString().split('T')[0];
                let dolDate = new Date(state.dOL)
                state.dOL = dolDate.toISOString().split('T')[0];
            }
        }
        if (isManualPolicy && manualpolicyState.polExpDate && (new Date(manualpolicyState.polEffDate) > new Date(manualpolicyState.polExpDate))) {
            setExpiryDateError(true);
            return;
        }
        setCanSubmit(false);
        setDateReceivedError(false);
        const request = prepareRequest(state);
        request.g2LegalEntityID = companies.filter(e => e.g2CompanyNameID === state.g2CompanyNameID)[0].g2LegalEntityID;
        if (isManualPolicy && manualpolicyState.policyID) {
            request.claimPolicy = manualpolicyState;
            request.claimPolicyID = null;
            request.insuredName = manualpolicyState.insuredName;
        }
        if (!isManualPolicy) {
            delete request.claimPolicy
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
            //setIsPolicyValid(policyValid);
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
                    >
                        <MenuItem value="P">Property</MenuItem>
                        <MenuItem value="C">Casualty</MenuItem>
                    </SelectList>
                </FieldContainer>
                <FieldContainer>
                    <SelectList
                        id="g2CompanyNameID"
                        name="g2CompanyNameID"
                        label="Legal Entity"
                        value={state.g2CompanyNameID}
                        onChange={onValueChanged}
                        variant="outlined"
                        allowempty={false}
                        error={errors.g2CompanyNameID === true}
                        helperText={(errors.g2CompanyNameID === true ? 'G2 Legal Entity is required' : '')}
                        required
                    >
                        {
                            companies.filter((item) => item.g2CompanyNameID !== COMPANY_NAME.GIC_GENESIS_INSURANCE_COMPANY && item.g2CompanyNameID !== COMPANY_NAME.GRC_GENERAL_REINSURANCE_CORPORATION ).map((c, idx) => <MenuItem value={c.g2CompanyNameID} key={`company__${idx}`}>{`${c.companyName}`}</MenuItem>)
                        }
                    </SelectList>
                </FieldContainer>

                <FieldContainer>
                    <SwitchInput label={"Manual Policy"} tootltip={"Manual Policy"} onChange={onManualPolicyChange} />
                </FieldContainer>
                {!isManualPolicy ? (
                    <FieldContainer>
                        <PolicyNumberInput ref={childRef} onChange={onValueChanged} onSearchStatusChanged={policySearchStatusChanged} isPolicyValidStatus={policySearchStatus} g2LegalEntityID={g2LegalEntityID}/>
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
                        multiline
                        inputProps={{
                            maxLength: 50,
                                    }}
                        rows={2}
                        error={manualPolicyInsuredNameError || errors.insuredName === true}
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