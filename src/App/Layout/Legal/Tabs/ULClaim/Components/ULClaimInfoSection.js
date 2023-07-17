import {
    Checkbox,
    FormControlLabel,
    MenuItem
} from '@mui/material';
import React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { CurrencyInput, DatePicker, Panel, PanelContent, PanelHeader, SelectList, TextInput } from '../../../../../Core/Forms/Common';
import {
    getG2Companies, loadUsers
} from '../../../../../Core/Services/EntityGateway';
import {
    Countries
} from '../../../../../Core/Services/ISO/countries';
import {
    claimStatusTypeSelectors
} from '../../../../../Core/State/slices/metadata/claim-status-types';
import {
    companiesSelectors
} from '../../../../../Core/State/slices/metadata/companies';
import {
    riskStatesSelectors
} from '../../../../../Core/State/slices/metadata/risk-states';
import {
    FormOfCoverageSelectors
} from "../../../../../Core/State/slices/ULClaims";
import {
    ensureNonEmptyString
} from '../../../../../Core/Utility/rules';
import { AppContainer, TabContainer } from '../../../../Claim/Tabs/TabContainer';
import { COMPANY_NAME } from '../../../../../Core/Enumerations/app/company-name';
import { ROLES } from '../../../../../Core/Enumerations/security/roles';

const ContentRow = styled.div`
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-start;
    align-items: flex-start;
    align-content: flex-start;
`;
const ContentCell = styled.div`
    width: ${props => props.width || '50%'};
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-start;
    align-items: flex-start;
    align-content: flex-start;
    padding: .5em;
`;


export const ULClaimInfoSection = ({ request, dispatch, formValidator }) => {
    const { register, formState: { errors } } = formValidator;
    const [isCompanyOther, setIsCompanyOther] = React.useState(false);
    const [metadata, setMetadata] = React.useState({
        loading: true,
        claimExaminers: [],
        companies: [],
        users:[]
    });

    let currentULClaim = request.currentULClaim || {};
    const companies = useSelector(companiesSelectors.selectData()) || [];
    const riskStates = useSelector(riskStatesSelectors.selectData()) || [];
    const statusTypes = useSelector(claimStatusTypeSelectors.selectData()) || [];
    const formOfCoverages = useSelector(FormOfCoverageSelectors.selectData()) || [];
    const filteredUsers = metadata?.users?.filter(x => x.userRoles?.find(y => y.roleID === ROLES.Claims_Examiner));

    React.useEffect(() => {
        formValidator.setValue("claimID", currentULClaim.claimID);
        formValidator.setValue("dOL", currentULClaim.dOL);

        Promise.all([
            getG2Companies(),
            loadUsers()
        ])
            .then(([gc, lu]) => {
                setMetadata({
                    loading: false,
                    companies: (gc || []),
                    users:(lu?.data?.users || [])
                    
                });
            });

    }, []);

    const onValueChanged = (evt) => {
        request.currentULClaim[evt.target.name] = evt.target.value.trimStart();
        formValidator.setValue(evt.target.name, evt.target.value);
        dispatch({ type: 'UPDATE_UNIVERSAL_REQUEST', request: { ...request } });
    };
    const onDateChanged = (evt) => {
        request.currentULClaim[evt.target.name] = evt.target.value;
        formValidator.setValue(evt.target.name, evt.target.value);
        dispatch({ type: 'UPDATE_UNIVERSAL_REQUEST', request: { ...request } });

    };
    const onDropDownChanged = (evt) => {
        //setValue(evt.target.name, evt.target.value || null); 
        request.currentULClaim[evt.target.name] = evt.target.value;
        if (evt.target.name === 'jurisdictionType') {
            request.currentULClaim['jursidiction'] = '';
        }
        if (evt.target.name === 'g2CompanyNameID' && evt.target.value === COMPANY_NAME.OTHER) {
            request.currentULClaim['isPrimary'] = false;
            setIsCompanyOther(true);
            onCheckboxChecked(evt);
            request.currentULClaim['g2CompanyNameID'] = COMPANY_NAME.OTHER;
        }
        else if (evt.target.name === 'g2CompanyNameID'){
            setIsCompanyOther(false);
        }
        dispatch({ type: 'UPDATE_UNIVERSAL_REQUEST', request: { ...request } });
    };
    const onCurrencyChanged = (evt) => {
        request.currentULClaim[evt.target.name] = evt.target.value;
        dispatch({ type: 'UPDATE_UNIVERSAL_REQUEST', request: { ...request } });
    };
    const onCheckboxChecked = (evt) => {
            request.currentULClaim[evt.target.name] = evt.target.checked;
            dispatch({ type: 'UPDATE_UNIVERSAL_REQUEST', request: { ...request } });
    }

    return (
        <AppContainer>
            <TabContainer>
                <Panel>
                    <PanelHeader><span style={{ fontWeight: 'bold', fontSize: '14px' }}>U/L Claim Detail</span></PanelHeader>
                    <PanelContent>
                        <ContentRow style={{ marginTop: 10 }}>
                            <ContentCell width="33%">
                                <TextInput
                                    id="claimID"
                                    name="claimID"
                                    label="U/L Claim Number"
                                    required
                                    fullWidth={true}
                                    variant="outlined"
                                    inputProps={{ maxlength: 20 }}
                                    value={currentULClaim.claimID}
                                    {...register("claimID", {
                                        required: "This is required.",
                                        onChange: (e) => onValueChanged(e)
                                    })}
                                    error={errors?.claimID}
                                    helperText={errors?.claimID ? errors?.claimID.message : ""}

                                />
                            </ContentCell>
                            <ContentCell width="33%">
                                {filteredUsers.length > 0 ? <SelectList
                                    id="claimExaminerID"
                                    name="claimExaminerID"
                                    label="Claim Examiner"
                                    fullWidth={true}
                                    value={currentULClaim.claimExaminerID}
                                    onChange={onDropDownChanged}
                                    variant="outlined"
                                >
                                    {
                                        filteredUsers?.map((ce, idx) => <MenuItem value={ce.userID} key={`examiner-${idx}`}>{`${ce.firstName} ${ce.lastName}`}</MenuItem>)
                                    }
                                </SelectList>:"Loading..."}
                            </ContentCell>
                            <ContentCell width="33%">
                                <TextInput
                                    id="pastClaimExaminerID"
                                    name="pastClaimExaminerID"
                                    label="Past Examiner"
                                    fullWidth={true}
                                    variant="outlined"
                                    onChange={onValueChanged}
                                    value={currentULClaim.pastClaimExaminerID}
                                />
                            </ContentCell>
                        </ContentRow>
                        <ContentRow>
                            <ContentCell width="33%">
                                <SelectList
                                    id="lossLocation"
                                    name="lossLocation"
                                    label="State/Location of Loss"
                                    fullWidth={true}
                                    value={currentULClaim.lossLocation}
                                    onChange={onDropDownChanged}
                                    variant="outlined"
                                    disabled={ensureNonEmptyString(currentULClaim.lossLocationOutsideUSA)}
                                >
                                    {
                                        riskStates.map((rs, idx) => <MenuItem value={`${rs.riskStateID}`} key={`state-option-${idx}`}>{rs.stateName}</MenuItem>)
                                    }
                                </SelectList>
                            </ContentCell>
                            <ContentCell width="33%">
                                <SelectList
                                    id="lossLocationOutsideUSA"
                                    name="lossLocationOutsideUSA"
                                    label="Location Outside USA"
                                    fullWidth={true}
                                    value={currentULClaim.lossLocationOutsideUSA}
                                    onChange={onDropDownChanged}
                                    variant="outlined"
                                    disabled={ensureNonEmptyString(currentULClaim.lossLocation)}
                                >
                                    {
                                        Countries.map(country => <MenuItem value={country.alpha3}>{country.name}</MenuItem>)
                                    }
                                </SelectList>
                            </ContentCell>
                            <ContentCell width="33%">
                                <SelectList
                                    id="falClaimStatusTypeID"
                                    name="falClaimStatusTypeID"
                                    label="Claim Status"
                                    fullWidth={true}
                                    value={currentULClaim.falClaimStatusTypeID}
                                    onChange={onDropDownChanged}
                                    variant="outlined"
                                >
                                    {
                                        statusTypes
                                            .map((item, idx) => <MenuItem value={item.claimStatusTypeID} key={`fal-option-${idx}`} >{item.statusText}</MenuItem>)
                                    }
                                </SelectList>
                            </ContentCell>
                        </ContentRow>
                        <ContentRow>
                            <ContentCell width="33%">
                                <SelectList
                                    id="jurisdictionType"
                                    name="jurisdictionType"
                                    label="Jurisdiction Type"
                                    fullWidth={true}
                                    value={currentULClaim.jurisdictionType}
                                    onChange={onDropDownChanged}
                                    variant="outlined"
                                >
                                    <MenuItem value={"S"}>State</MenuItem>
                                    <MenuItem value={"F"}>Federal</MenuItem>
                                    <MenuItem value={"C"}>Country</MenuItem>
                                </SelectList>
                            </ContentCell>
                            <ContentCell width="33%">
                                {currentULClaim.jurisdictionType === "S" &&
                                    <SelectList
                                        id="jursidiction"
                                        name="jursidiction"
                                        label="Jursidiction State"
                                        fullWidth={true}
                                        value={currentULClaim.jursidiction}
                                        onChange={onDropDownChanged}
                                        variant="outlined"
                                    >
                                        {
                                            riskStates.map((rs, idx) => <MenuItem value={`${rs.riskStateID}`}>{rs.stateName}</MenuItem>)
                                        }
                                    </SelectList>
                                }
                                {currentULClaim.jurisdictionType === "C" &&
                                    <SelectList
                                        id="jursidiction"
                                        name="jursidiction"
                                        label="Jursidiction Country"
                                        fullWidth={true}
                                        value={currentULClaim.jursidiction}
                                        onChange={onDropDownChanged}
                                        variant="outlined"
                                    >
                                        {
                                            Countries.map(country => <MenuItem value={country.alpha3}>{country.name}</MenuItem>)
                                        }
                                    </SelectList>
                                }
                                {currentULClaim.jurisdictionType === "F" &&
                                    <TextInput
                                        id="jursidiction"
                                        name="jursidiction"
                                        label="Jursidiction Federal"
                                        fullWidth={true}
                                        variant="outlined"
                                        onChange={onValueChanged}
                                        value={currentULClaim.jursidiction}
                                    />
                                }
                            </ContentCell>
                            <ContentCell width="33%">
                                <DatePicker
                                    id="dOL"
                                    name="dOL"
                                    label="Date of Loss"
                                    variant="outlined"
                                    disableFuture={true}
                                    value={currentULClaim.dOL || null}
                                    
                                    required
                                    {...register("dOL",
                                        {
                                            required: "This is required.",
                                            onChange: onDateChanged 
                                        })}
                                    error={errors?.dOL}
                                    helperText={errors?.dOL ? errors?.dOL.message : ""}
                                />
                            </ContentCell>
                        </ContentRow>
                        <ContentRow>
                            <ContentCell width="33%">
                                    <SelectList
                                            id="g2CompanyNameID"
                                            name="g2CompanyNameID"
                                            label="Company"
                                            fullWidth={true}
                                            value={currentULClaim.g2CompanyNameID}
                                            onChange={onDropDownChanged}
                                            variant="outlined"
                                >
                                    {currentULClaim.isPrimary  ? companies
                                        .filter((item) => item.g2CompanyNameID !== COMPANY_NAME.OTHER).map((gc, idx) => <MenuItem value={gc.g2CompanyNameID} key={`ce__${idx}`}>{`${gc.companyName}`}</MenuItem>)  :
                                                companies
                                            .map((gc, idx) => <MenuItem value={gc.g2CompanyNameID} key={`ce__${idx}`}>{`${gc.companyName}`}</MenuItem>)                                               
                                            }
                                        </SelectList>
                            </ContentCell>
                            <ContentCell width="33%">
                                <CurrencyInput
                                    onChange={onCurrencyChanged}
                                    id="deductible"
                                    name="deductible"
                                    inputProps={{ maxlength: 15 }}
                                    label="Deductible / SIR"
                                    fullWidth={true}
                                    variant="outlined"
                                    value={currentULClaim.deductible}
                                />
                            </ContentCell>
                        </ContentRow>
                        <ContentRow>
                            <ContentCell width="33%">
                                <SelectList
                                    id="formOfCoverageCD"
                                    name="formOfCoverageCD"
                                    label="Form Of Coverage"
                                    fullWidth={true}
                                    value={currentULClaim.formOfCoverageCD}
                                    onChange={onDropDownChanged}
                                    variant="outlined"
                                >
                                    {
                                        formOfCoverages.map(formOfCoverage => <MenuItem value={formOfCoverage.formOfCoverageCD}>{formOfCoverage.formOfCoverageDesc}</MenuItem>)
                                    }
                                </SelectList>
                            </ContentCell>
                            <ContentCell width="33%">
                                <DatePicker
                                    id="retroDate"
                                    name="retroDate"
                                    label="CM / Retro Date"
                                    variant="outlined"
                                    value={currentULClaim.retroDate || null}
                                    onChange={onDateChanged}
                                    disableFuture={true}
                                    error=''
                                    helperText=''
                                />
                            </ContentCell>
                            <ContentCell width="33%">
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            id="isPrimary"
                                            name="isPrimary"
                                            color="primary"
                                            key={currentULClaim?.isPrimary}
                                            checked={!isCompanyOther && currentULClaim?.isPrimary}
                                            onChange={onCheckboxChecked}
                                            disabled={isCompanyOther || currentULClaim?.isPrimary}
                                        />
                                    }
                                    label="Is Primary U/L Claim"
                                />
                            </ContentCell>

                        </ContentRow>
                        <ContentRow>
                            <ContentCell width="33%">
                                <TextInput
                                    id="cATNumber"
                                    name="cATNumber"
                                    label="CAT#"
                                    fullWidth={true}
                                    variant="outlined" 
                                    onChange={onValueChanged}
                                    inputProps={{ maxlength: 50 }}
                                    value={currentULClaim?.cATNumber}
                                    error={errors?.cATNumber}
                                    helperText={errors?.cATNumber ? errors?.cATNumber.message : ""}

                                />
                            </ContentCell>
                        </ContentRow>
                        <ContentRow>
                            <ContentCell width="99%">
                                <TextInput
                                    id="comment"
                                    name="comment"
                                    label="Comments"
                                    fullWidth={true}
                                    onChange={onValueChanged}
                                    value={currentULClaim.comment}
                                    variant="outlined"
                                    multiline
                                    rows={3}
                                />
                            </ContentCell>
                        </ContentRow>
                    </PanelContent>
                </Panel>
            </TabContainer>
        </AppContainer>
    );
}
