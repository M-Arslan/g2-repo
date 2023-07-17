import {
    MenuItem
} from '@mui/material';
import React from 'react';
import {
    useDispatch,
    useSelector
} from 'react-redux';
import {
    ContentCell, ContentRow, DatePicker,
    SelectList,
    Spinner,
    TextInput
} from '../../../../../../Core/Forms/Common';
import {
    Countries
} from '../../../../../../Core/Services/ISO/countries';
import { claimActivitySelectors } from '../../../../../../Core/State/slices/claim-activity';
import {
    branchesSelectors
} from '../../../../../../Core/State/slices/metadata/branches';
import {
    claimExaminerAllSelectors, claimExaminerSelectors
} from '../../../../../../Core/State/slices/metadata/claim-examiners';
import {
    companiesSelectors
} from '../../../../../../Core/State/slices/metadata/companies';
import {
    riskStatesSelectors
} from '../../../../../../Core/State/slices/metadata/risk-states';
import { makeEvent } from '../../../../../../Core/Utility/makeEvent';
import {
    ensureIsNumber, ensureNonEmptyArray, ensureNonEmptyString, ensureNonNullObject
} from '../../../../../../Core/Utility/rules';
import { LEGAL_ENTITY } from '../../../../../../Core/Enumerations/app/legal-entity';
import { CLAIM_TYPES } from '../../../../../../Core/Enumerations/app/claim-type';
import {
    useAppHost
} from '../../../AppHost';
import { CLAIM_STATUS_TYPE } from '../../../../../../Core/Enumerations/app/claim-status-type';
import { FAL_CLAIM_STATUS_TYPES } from '../../../../../../Core/Enumerations/app/fal_claim-status-types';
import { COMPANY_NAME } from '../../../../../../Core/Enumerations/app/company-name';
import {
    adjusterLicenseStatesActions,
    adjusterLicenseStatesSelectors
} from '../../../../../../Core/State/slices/metadata/adjusterLicenseStates';
import {
    CheckExaminerForAdjusterLicenseStateActions,
    CheckExaminerForAdjusterLicenseStateSelectors
} from '../../../../../../Core/State/slices/metadata/CheckExaminerForAdjusterLicenseState';
import {
    checkExaminerForAdjusterLicenseStateQuery,
} from '../../../../../../Core/State/slices/metadata/CheckExaminerForAdjusterLicenseState/queries/GetCheckExaminerForAdjusterLicenseState';
import { useSnackbar } from 'notistack';
import {
    SwitchInput
} from '../../../../../../Core/Forms/Common';

/**
* @typedef {object} ClaimInfoFormProps
* @property {string} id
* @property {import('../../../../../../Core/Providers/FormProvider').Model} model
*/

/**
* 
* @param {ClaimInfoFormProps} props
*/
export const ClaimInfoForm = ({ model }) => {
    const $dispatch = useDispatch();
    const $host = useAppHost();
    const { enqueueSnackbar } = useSnackbar();

    let claimExaminers = useSelector(claimExaminerSelectors.selectData());
    const adjusterLicenseStates = useSelector(adjusterLicenseStatesSelectors.selectData());

   
    const branches = useSelector(branchesSelectors.selectData());
    const companies = useSelector(companiesSelectors.selectByAllCriteria({ g2LegalEntityID: model.g2LegalEntityID.value }));
    const allCompanies = useSelector(companiesSelectors.selectData());
    const riskStates = useSelector(riskStatesSelectors.selectData());

    const isPolicyLocked = ensureNonEmptyArray(useSelector(claimActivitySelectors.selectByAllCriteria({
        claimStatusTypeID: CLAIM_STATUS_TYPE.SUBMITTED.toString()
    })));

    const onClaimExaminerChanged = async (evt) => {

        if ((model.claimType.value == CLAIM_TYPES.CASUALTY || model.claimType.value == CLAIM_TYPES.PROPERTY) && (model.g2LegalEntityID.value !== LEGAL_ENTITY.GENESIS_REINSURANCE)) {
            const riskStateID = model.lossLocation.value;
            const state = riskStates.find(X => X.riskStateID == riskStateID);
            const adjusterLicenseState = adjusterLicenseStates?.find(X => X.state == state?.stateCode);
            if (adjusterLicenseState) {
                // Call API
                let result = await checkExaminerForAdjusterLicenseStateQuery(evt.target.value, riskStateID);
                result = result.data.get;
                if (result) {
                    const examiner = claimExaminers.find(ce => ce.userID === evt.target.value);

                    if (ensureNonNullObject(examiner)) {
                        model.handleUserInput(makeEvent('managerName', `${examiner.managerFirstName} ${examiner.managerLastName}`));
                        model.handleUserInput(makeEvent('claimBranchID', examiner.branchID));
                    }

                    model.handleUserInput(evt);
                    model.handleFinalizeInput(evt);
                } else {
                    enqueueSnackbar("Selected Claim Examiner may not be assigned to this claim because they do not have a current license in the Loss State selected.", { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
                }
            }
            else {
                const examiner = claimExaminers.find(ce => ce.userID === evt.target.value);

                if (ensureNonNullObject(examiner)) {
                    model.handleUserInput(makeEvent('managerName', `${examiner.managerFirstName} ${examiner.managerLastName}`));
                    model.handleUserInput(makeEvent('claimBranchID', examiner.branchID));
                }

                model.handleUserInput(evt);
                model.handleFinalizeInput(evt);
            }
        }
        else {
            const examiner = claimExaminers.find(ce => ce.userID === evt.target.value);

            if (ensureNonNullObject(examiner)) {
                model.handleUserInput(makeEvent('managerName', `${examiner.managerFirstName} ${examiner.managerLastName}`));
                model.handleUserInput(makeEvent('claimBranchID', examiner.branchID));
            }

            model.handleUserInput(evt);
            model.handleFinalizeInput(evt);
        }


        /*if (!model.g2CompanyNameID.value) {
            enqueueSnackbar("Legal entity must be selected before claim examiner can be selected.", { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
            return;
        }*/
    }
    const onLossLocationChanged = async (evt) => {
        if ((model.claimType.value == CLAIM_TYPES.CASUALTY || model.claimType.value == CLAIM_TYPES.PROPERTY) && (model.g2LegalEntityID.value !== LEGAL_ENTITY.GENESIS_REINSURANCE)) {
            if (!model.claimExaminerID.value) {
                enqueueSnackbar("A Claim Examiner must be selected before Loss Location can be selected.", { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
                return;
            }
            const riskStateID = evt.target.value;
            const state = riskStates.find(X => X.riskStateID == riskStateID);
            const adjusterLicenseState = adjusterLicenseStates?.find(X => X.state == state?.stateCode);
            if (adjusterLicenseState) {
                // Call API
                //$dispatch(CheckExaminerForAdjusterLicenseStateActions.get({ examinerID: "grn\\rbrunel", state: "31" }));
                let result = await checkExaminerForAdjusterLicenseStateQuery(model.claimExaminerID.value, riskStateID);
                result = result.data.get;
                if (result) {
                    model.handleUserInput(evt);
                    model.handleFinalizeInput(evt);
                } else {
                    enqueueSnackbar("Selected Claim Examiner may not be assigned to this claim because they do not have a current license in the Loss State selected.", { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
                }
            } else {
                model.handleUserInput(evt);
                model.handleFinalizeInput(evt);
            }
        }
        else
        {
            model.handleUserInput(evt);
            model.handleFinalizeInput(evt);
        }
    }

    const onLossLocationOutsideUsaChanged = async (evt) => {
        if ((model.claimType.value == CLAIM_TYPES.CASUALTY || model.claimType.value == CLAIM_TYPES.PROPERTY) && (model.g2LegalEntityID.value !== LEGAL_ENTITY.GENESIS_REINSURANCE)) {
            if (!model.claimExaminerID.value) {
                enqueueSnackbar("A Claim Examiner must be selected before Loss Location can be selected.", { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
                return;
            }
            else {
                model.handleUserInput(evt);
                model.handleFinalizeInput(evt);
            }
        }
        else {
            model.handleUserInput(evt);
            model.handleFinalizeInput(evt);
        }
    }

    const getManagerName = () => {
        let managerName = '';
        if (model.claimExaminerID.value) {
            const examiner = claimExaminers.find(ce => ce.userID === model.claimExaminerID.value);

            if (ensureNonNullObject(examiner)) {
                managerName = `${examiner.managerFirstName} ${examiner.managerLastName}`;
            }
        }
       return managerName
    }

    const onG2LegalEntityChanged = (evt) => {
        const selectedCompany = allCompanies.find(ce => ce.g2CompanyNameID === evt.target.value);

        if (ensureNonNullObject(selectedCompany)) {
            model.handleUserInput(makeEvent('g2CompanyNameID', selectedCompany.g2CompanyNameID));
            model.handleUserInput(makeEvent('g2LegalEntityID', selectedCompany.g2LegalEntityID));
        }

        model.handleUserInput(evt);
        model.handleFinalizeInput(evt);
    }
    const onCheckBoxChanged = (evt) => {
        model.handleUserInput(makeEvent('claimSettled', evt.target.checked));
        model.handleFinalizeInput(makeEvent('claimSettled', evt.target.checked));
    };
    const claimExaminerReadOnly = ($host.isViewer || ($host.appIsReadonly && ensureNonEmptyString(model.claimExaminerID.value) && model.claimExaminerID.value !== 'SVC_PAYLOAD'));


    React.useEffect(() => {
        if (model.fALClaimStatusTypeID.value === FAL_CLAIM_STATUS_TYPES.CLOSED) {
            claimExaminers = claimExaminers || [];
        } else {
            claimExaminers = claimExaminers?.filter(x => x.active);
        }    
    },[])

    if (ensureNonNullObject(model)) {
        return (
            <>
                <ContentRow>
                    <ContentCell width="33%">
                        <SelectList
                            id="claimExaminerID"
                            name="claimExaminerID"
                            label="Claim Examiner"
                            fullWidth={true}
                            value={model.claimExaminerID.value}
                            onChange={onClaimExaminerChanged}
                            onBlur={model.handleFinalizeInput}
                            variant="outlined"
                            allowempty={false}
                            disabled={claimExaminerReadOnly}
                        >
                            {
                                claimExaminers.map((ce, idx) => <MenuItem value={ce.userID} key={`examiner-${idx}`}>{`${ce.firstName} ${ce.lastName}`}</MenuItem>)
                            }
                        </SelectList>
                    </ContentCell>
                    <ContentCell width="33%">
                        <TextInput
                            id="managerName"
                            name="managerName"
                            label="Manager"
                            fullWidth={true}
                            value={getManagerName()}
                            disabled={$host.appIsReadonly}
                            inputProps={{ readOnly: true }}
                            variant="outlined"
                        />
                    </ContentCell>
                    <ContentCell width="33%">
                        <SelectList
                            id="claimBranchID"
                            name="claimBranchID"
                            label="Claim Branch"
                            fullWidth={true}
                            value={model.claimBranchID.value}
                            onChange={model.handleFinalizeInput}
                            onBlur={model.handleFinalizeInput}
                            variant="outlined"
                            allowempty={false}
                            disabled={$host.appIsReadonly}
                        >
                            {
                                branches.map((b, idx) => <MenuItem value={b.claimBranchID} key={`branch-${idx}`}>{`${b.branchCode} - ${b.branchName}`}</MenuItem>)
                            }
                        </SelectList>
                    </ContentCell>
                </ContentRow>
                <ContentRow>
                    <ContentCell width="33%">
                        <DatePicker
                            id="dOL"
                            name="dOL"
                            label="Date of Loss"
                            fullWidth={true}
                            value={model.dOL.value}
                            onChange={model.handleUserInput}
                            onBlur={model.handleFinalizeInput}
                            variant="outlined"
                            disableFuture={true}
                            disabled={$host.appIsReadonly}
                            error={model.dOL.showError}
                            helperText={model.allErrors.dOL}
                        />
                    </ContentCell>
                    <ContentCell width="33%">
                        <DatePicker
                            id="extendedReportingPeriod"
                            name="extendedReportingPeriod"
                            label="Extended Reporting Period"
                            fullWidth={true}
                            value={model.extendedReportingPeriod.value}
                            onChange={model.handleUserInput}
                            onBlur={model.handleFinalizeInput}
                            variant="outlined"
                            disabled={$host.appIsReadonly}
                            error={model.extendedReportingPeriod.showError}
                            helperText={model.allErrors.extendedReportingPeriod}
                        />
                    </ContentCell>
                    <ContentCell width="33%">
                        <DatePicker
                            id="dateReceived"
                            name="dateReceived"
                            label="Claim Reported Date"
                            value={model.dateReceived.value}
                            onChange={model.handleUserInput}
                            onBlur={model.handleFinalizeInput}
                            fullWidth={true}
                            variant="outlined"
                            disableFuture={true}
                            disabled={$host.appIsReadonly}
                            error={model.dateReceived.showError}
                            helperText={model.allErrors.dateReceived}
                        />
                    </ContentCell>
                </ContentRow>
                <ContentRow>
                    <ContentCell width="33%">
                        <SelectList
                            id="lossLocation"
                            name="lossLocation"
                            label="Loss State"
                            fullWidth={true}
                            value={model.lossLocation.value}
                            onChange={onLossLocationChanged}
                            onBlur={model.handleFinalizeInput}
                            variant="outlined"
                            disabled={($host.appIsReadonly || ensureNonEmptyString(model.lossLocationOutsideUsa.value))}
                        >
                            {
                                riskStates.map((rs, idx) => <MenuItem value={`${rs.riskStateID}`} key={`state-option-${idx}`}>{rs.stateName}</MenuItem>)
                            }
                        </SelectList>
                    </ContentCell>
                    <ContentCell width="33%">
                        <SelectList
                            id="lossLocationOutsideUsa"
                            name="lossLocationOutsideUsa"
                            label="Loss Location Outside USA"
                            fullWidth={true}
                            value={model.lossLocationOutsideUsa.value}
                            onChange={onLossLocationOutsideUsaChanged}
                            onBlur={model.handleFinalizeInput}
                            variant="outlined"
                            disabled={($host.appIsReadonly || ensureNonEmptyString(model.lossLocation.value) || ensureIsNumber(model.lossLocation.value))}
                        >
                            {
                                Countries.map(country => <MenuItem value={country.alpha3} key={`country-option-${country.code}`}>{country.name}</MenuItem>)
                            }
                        </SelectList>
                    </ContentCell>
                    {model.claimType.value == CLAIM_TYPES.WORKERS_COMP ?
                        <>
                            <ContentCell width="33%">
                                <SelectList
                                    id="claimType"
                                    name="claimType"
                                    label="Claim Type"
                                    value={model.claimType.value}
                                    onChange={model.handleUserInput}
                                    onBlur={model.handleFinalizeInput}
                                    variant="outlined"
                                    allowempty={false}
                                    fullWidth={true}
                                    disabled={($host.appIsReadonly || isPolicyLocked === true)}
                                    error={model.claimType.showError}
                                    helperText={model.allErrors.claimType}
                                    required
                                >
                                    <MenuItem value="W">Workers Comp</MenuItem>
                                </SelectList>
                            </ContentCell>
                        </>
                        :
                        <>
                            <ContentCell width="33%">
                                <SelectList
                                    id="claimType"
                                    name="claimType"
                                    label="Claim Type"
                                    value={model.claimType.value}
                                    onChange={model.handleUserInput}
                                    onBlur={model.handleFinalizeInput}
                                    variant="outlined"
                                    allowempty={false}
                                    fullWidth={true}
                                    disabled={($host.appIsReadonly || isPolicyLocked === true)}
                                    error={model.claimType.showError}
                                    helperText={model.allErrors.claimType}
                                    required
                                >
                                    <MenuItem value="P">Property</MenuItem>
                                    <MenuItem value="C">Casualty</MenuItem>
                                </SelectList>
                            </ContentCell>

                        </>
                    }
                </ContentRow>
                <ContentRow>
                    {model.claimType.value == CLAIM_TYPES.WORKERS_COMP ?
                        <ContentCell width="33%">
                            <SelectList
                                id="g2CompanyNameID"
                                name="g2CompanyNameID"
                                label="Legal Entity"
                                value={model.g2CompanyNameID.value}
                                onChange={onG2LegalEntityChanged}
                                onBlur={model.handleFinalizeInput}
                                variant="outlined"
                                disabled={$host.appIsReadonly}
                                allowempty={false}
                                error={model.g2CompanyNameID.showError}
                                helperText={model.allErrors.g2CompanyNameID}
                                required
                            >
                                {
                                    allCompanies.filter((item) => item.g2CompanyNameID === COMPANY_NAME.GRC_GENERAL_REINSURANCE_CORPORATION ).map((c, idx) => <MenuItem value={c.g2CompanyNameID} key={`company__${idx}`}>{`${c.companyName}`}</MenuItem>)
                                }
                            </SelectList>
                        </ContentCell>
                        :
                        <ContentCell width="33%">
                            <SelectList
                                id="g2CompanyNameID"
                                name="g2CompanyNameID"
                                label="Legal Entity"
                                value={model.g2CompanyNameID.value}
                                onChange={onG2LegalEntityChanged}
                                onBlur={model.handleFinalizeInput}
                                variant="outlined"
                                disabled={$host.appIsReadonly}
                                allowempty={false}
                                error={model.g2CompanyNameID.showError}
                                helperText={model.allErrors.g2CompanyNameID}
                                required
                            >
                                {
                                    (["", LEGAL_ENTITY.GENESIS_INSURANCE, LEGAL_ENTITY.GENESIS_REINSURANCE].includes(model.g2LegalEntityID.value)) ?
                                        allCompanies.filter((item) => item.g2CompanyNameID !== COMPANY_NAME.GSI_GENERAL_STAR_INDEMNITY_CO && item.g2CompanyNameID !== COMPANY_NAME.GSN_GENERAL_STAR_NATIONAL_INSURANCE_CO && item.g2CompanyNameID !== COMPANY_NAME.OTHER).map((c, idx) => <MenuItem value={c.g2CompanyNameID} key={`company__${idx}`}>{`${c.companyName}`}</MenuItem>) :
                                        companies.map((c, idx) => <MenuItem value={c.g2CompanyNameID} key={`company__${idx}`}>{`${c.companyName}`}</MenuItem>)

                                }
                            </SelectList>
                        </ContentCell>
                        }
                   
                    {model.g2CompanyNameID.value === COMPANY_NAME.GRC_GENERAL_REINSURANCE_CORPORATION && <>
                        <ContentCell width="33%">
                            <TextInput
                                label="Statutory Claim ID"
                                id="statutoryClaimID"
                                name="statutoryClaimID"
                                fullWidth={true}
                                onChange={model.handleUserInput}
                                onBlur={model.handleFinalizeInput}
                                inputProps={{
                                    maxLength: 50,
                                }}
                                value={model.statutoryClaimID.value}
                                disabled={$host.appIsReadonly}
                                required
                            />
                        </ContentCell>
                        <ContentCell width="33%">
                            <SelectList
                                id="statutorySystem"
                                label="Statutory System"
                                name="statutorySystem"
                                value={model.statutorySystem.value}
                                variant="outlined"
                                onChange={model.handleUserInput}
                                onBlur={model.handleFinalizeInput}
                                allowempty={false}
                                disabled={$host.appIsReadonly}
                                required
                            >
                                <MenuItem value={""} key={""}>{"" }</MenuItem>
                                <MenuItem value={"C"} key={"C"}>{"CONFER"}</MenuItem>
                                <MenuItem value={"F"} key={"F"}>{"FSRI"}</MenuItem>
                                {model.claimType.value == CLAIM_TYPES.WORKERS_COMP &&  <MenuItem value={"N"} key={"N"}>{"Nat Re"}</MenuItem>}

                            </SelectList>
                        </ContentCell>
                    </>
                    }

                    <ContentCell width="33%">
                        <TextInput
                            id="legalEntityManagerName"
                            name="legalEntityManagerName"
                            label="Legal Entity Manager"
                            fullWidth={true}
                            value={model.legalEntityManagerName.value}
                            variant="outlined"
                            disabled={$host.appIsReadonly}
                            inputProps={{ readOnly: true }}
                        />
                    </ContentCell>
                    <ContentCell width="33%">
                        <SelectList
                            id="managingEntity"
                            label="Managing Entity"
                            value={model.managingEntity.value}
                            onChange={model.handleUserInput}
                            onBlur={model.handleFinalizeInput}
                            variant="outlined"
                            disabled={$host.appIsReadonly}
                            allowempty={false}
                            error={model.managingEntity.showError}
                            helperText={model.allErrors.managingEntity}
                            required
                        >
                            <MenuItem value="GSMGMT">GenStar Management</MenuItem>
                            <MenuItem value="GMIS">GMIS</MenuItem>
                        </SelectList>
                    </ContentCell>
                    {[LEGAL_ENTITY.GENESIS_INSURANCE, LEGAL_ENTITY.GENESIS_REINSURANCE].includes(model.g2LegalEntityID.value) &&
                        <ContentCell width="33%">
                            <TextInput
                                label="Client Claim ID"
                                id="clientClaimID"
                                name="clientClaimID"
                                fullWidth={true}
                                onChange={model.handleUserInput}
                                onBlur={model.handleFinalizeInput}
                                inputProps={{
                                    maxLength: 50,
                                }}
                                value={model?.clientClaimID?.value}
                                disabled={$host.appIsReadonly}
                            />
                        </ContentCell>
                    }

                </ContentRow>
                <ContentRow>
                    <ContentCell width="100%">
                        <TextInput
                            id="lossDesc"
                            name="lossDesc"
                            label="Brief Description of Loss"
                            fullWidth={true}
                            value={model.lossDesc.value}
                            onChange={model.handleUserInput}
                            onBlur={model.handleFinalizeInput}
                            variant="outlined"
                            multiline
                            rows={2}
                            disabled={$host.appIsReadonly}
                            inputProps={{ maxLength: 500 }}
                        />
                    </ContentCell>
                </ContentRow>
                <ContentRow>
                    <ContentCell width={model.claimType.value == CLAIM_TYPES.WORKERS_COMP ? "80%" : "100%"}>
                        <TextInput
                            label="Full Description of Loss"
                            name="fullDescriptionOfLoss"
                            fullWidth={true}
                            value={model.fullDescriptionOfLoss.value}
                            multiline
                            rows={3}
                            variant="outlined"
                            onChange={model.handleUserInput}
                            onBlur={model.handleFinalizeInput}
                            disabled={$host.appIsReadonly}
                            inputProps={{ maxLength: 5000 }}
                        />
                    </ContentCell>
                    {model.claimType.value == CLAIM_TYPES.WORKERS_COMP && <>
                        <ContentCell width="20%">
                            <SwitchInput
                                disabled={$host.appIsReadonly}
                                id="claimSettled"
                                name="claimSettled"
                                label="Claim Settled?"
                                checked={model.claimSettled.checked}
                                onChange={onCheckBoxChanged}
                            />
                        </ContentCell>
                    </>}
                    
                </ContentRow>
            </>
        );
    }
    else {
        return <Spinner />;
    }
};