import { MenuItem } from '@mui/material';
import React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { APP_TYPES } from '../../../../../Core/Enumerations/app/app-types';
import { ROLES } from '../../../../../Core/Enumerations/security/roles';
import { CurrencyInput, DatePicker, formatDate, Panel, PanelContent, PanelHeader, SelectList, SwitchInput, TextInput } from '../../../../../Core/Forms/Common';
import { getRiskStates } from '../../../../../Core/Services/EntityGateway';
import { userSelectors } from '../../../../../Core/State/slices/user';
import { findHelpTextByTag, loadHelpTags } from '../../../../Help/Queries';
import { FAL_CLAIM_STATUS_TYPES } from '../../../../../Core/Enumerations/app/fal_claim-status-types';
import { USZip } from '../../../../../Core/Providers/FormProvider';
import { zipFormat } from '../../../../../Core/Utility/common';


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

export const ClaimantInfoSection = ({ claim, request, dispatch, formValidator, onSave }) => {
    const $auth = useSelector(userSelectors.selectAuthContext());
    const isViewer = claim.fALClaimStatusTypeID === FAL_CLAIM_STATUS_TYPES.CLOSED || claim.fALClaimStatusTypeID === FAL_CLAIM_STATUS_TYPES.ERROR || $auth.isReadOnly(APP_TYPES.Claimant);
    const isClaimExaminerOrAccountantOrAssistant = $auth.isInRole(ROLES.Claims_Examiner) || $auth.isInRole(ROLES.Claims_Accountant) || $auth.isInRole(ROLES.Claims_Assistant);
    
    let currentClaimant = request.currentClaimant;
    const [metadata, setMetadata] = React.useState({
        loading: true,
        riskStates: [],
        helpTags: []
    });
    const { register, formState: { errors }, setValue, unregister, clearErrors } = formValidator;
    setValue("lastName", currentClaimant.lastName ? currentClaimant.lastName : null);
    setValue("medicareNumber", currentClaimant.medicareNumber ? currentClaimant.medicareNumber : null);
    setValue("addressCity", currentClaimant.addressCity ? currentClaimant.addressCity : null);
    setValue("addressZIP", currentClaimant.addressZIP ? currentClaimant.addressZIP : null);
    setValue("occupation", currentClaimant.occupation ? currentClaimant.occupation : null);
    setValue("injuries", currentClaimant.injuries ? currentClaimant.injuries : null);
    setValue("sSN", currentClaimant.sSN);

    const onValueChanged = (evt) => {

        const { name, value } = evt.target;
        setValue(name, value ? value : null)
        if(evt.target.name === "addressZIP"){
        request.currentClaimant[evt.target.name] = zipFormat(null,evt).target.value.trimStart();
        }else{
        request.currentClaimant[evt.target.name] = evt.target.value.trimStart();
        }
        dispatch({ type: 'UPDATE_UNIVERSAL_REQUEST', request: { ...request } });

    };
    const onCheckBoxChanged = (evt) => {
        request.currentClaimant[evt.target.name] = evt.target.checked;
        dispatch({ type: 'UPDATE_UNIVERSAL_REQUEST', request: { ...request } });
        onSave();
    };
    const onDateChanged = (evt) => {
        request.currentClaimant[evt.target.name] = evt.target.value;
        request.currentClaimant['dateOfBirth'] = request.currentClaimant['dateOfBirth'] ? new Date(request.currentClaimant['dateOfBirth']).toISOString() : null;
        dispatch({ type: 'UPDATE_UNIVERSAL_REQUEST', request: { ...request } });
        onSave();
    };
    const onDropDownChanged = (evt) => {
        request.currentClaimant[evt.target.name] = evt.target.value;
        dispatch({ type: 'UPDATE_UNIVERSAL_REQUEST', request: { ...request } });
        onSave();
    };
    const onCurrencyChanged = (evt) => {
        request.currentClaimant[evt.target.name] = evt.target.value;
        dispatch({ type: 'UPDATE_UNIVERSAL_REQUEST', request: { ...request } });
    };
    React.useEffect(() => {
        Promise.all([
            getRiskStates(),
            loadHelpTags(request.helpContainerName)
        ])
            .then(([rs, helpTags]) => {
                setMetadata({
                    loading: false,
                    riskStates: (rs || []),
                    helpTags: (helpTags.data.list || []),
                });
            });

    }, []);
    const phoneNumberFormatter = (payload) => {
        if (payload?.length === 9) {
            var match = payload?.match(/^(\d{3})(\d{2})(\d{4})$/);
            if (match) {  
                clearErrors(["sSN"])
                return `${match[1]}-${match[2]}-${match[3]}`;
            }

        } else {
            if (payload?.includes('-')) {
                let matches = payload.replace(/[^\d]/g, '');
                request.currentClaimant.sSN = matches;
                setValue("sSN", matches)
                return matches;
            }
            return payload;
        }
    }
    const phoneNumberVal = React.useMemo(() => phoneNumberFormatter(currentClaimant.sSN), [currentClaimant.sSN]);

    return (
        <Panel>
            <PanelHeader><span style={{ fontWeight: 'bold', fontSize: '14px' }}>Claimant Details</span></PanelHeader>
            <PanelContent>
                <ContentRow>
                    <ContentCell width="33%">
                        <TextInput
                            disabled={isViewer}
                            id="firstName"
                            name="firstName"
                            label="First Name"
                            required={currentClaimant.bIClaimant}
                            fullWidth={true}
                            variant="outlined"
                            value={currentClaimant.firstName}
                            inputProps={{ maxlength: 50 }}
                            {...register("firstName",
                                {
                                    required: "This is required.",
                                    pattern: {
                                        value: /^[a-zA-Z -`']*$/i,
                                        message: "Must contain characters only"
                                    },
                                    onChange: onValueChanged
                                }
                            )
                            }
                            onBlur={onSave}
                            error={currentClaimant.bIClaimant && currentClaimant.firstName === ""}
                            helperText={(currentClaimant.bIClaimant && currentClaimant.firstName === "") ? "This field is required." : ""}
                           
                        />
                    </ContentCell>
                    <ContentCell width="33%">
                        <TextInput
                            disabled={isViewer}
                            id="middleName"
                            name="middleName"
                            label="Middle Name"
                            fullWidth={true}
                            variant="outlined"
                            value={currentClaimant.middleName}
                            onChange={onValueChanged}
                            inputProps={{ maxlength: 50 }}
                            error={errors.middleName}
                            helperText={errors.middleName ? errors.middleName.message : ""}
                            onBlur={onSave}
                           
                        />
                    </ContentCell>
                    <ContentCell width="33%">
                        <TextInput
                            disabled={isViewer}
                            id="lastName"
                            name="lastName"
                            label="Last Name"
                            required
                            fullWidth={true}
                            variant="outlined"
                            value={currentClaimant.lastName}
                            inputProps={{ maxlength: 50 }}
                            {...register("lastName",
                                {
                                    required: "This is required.",
                                    onChange: onValueChanged
                                }
                            )
                            }
                            error={errors.lastName}
                            helperText={errors.lastName ? errors.lastName.message : ""}
                            onBlur={onSave}
                          
                        />
                    </ContentCell>
                </ContentRow>
                <ContentRow>
                    <ContentCell width="33%">
                        {isClaimExaminerOrAccountantOrAssistant ?
                            <DatePicker
                                id="dateOfBirth"
                                name="dateOfBirth"
                                label="Date of Birth"
                                fullWidth={true}
                                onChange={onDateChanged}
                                variant="outlined"
                                required
                                value={currentClaimant.dateOfBirth || null}
                                disableFuture={true}
                                error={errors?.dateOfBirth}
                                helperText={errors?.dateOfBirth ? errors?.dateOfBirth.message : ""}
                                inputProps={{ readOnly: isViewer === true }}
                            /> 
                            :
                            <TextInput
                                disabled={true}
                                id="dateOfBirth"
                                name="dateOfBirth"
                                label="Date of Birth"
                                fullWidth={true}
                                variant="outlined"
                                value={currentClaimant.dateOfBirth || null}
                                type="password"
                            /> }
                    </ContentCell>
                    <ContentCell width="33%">
                        <SelectList
                            disabled={isViewer}
                            id="gender"
                            name="gender"
                            label="Gender"
                            required
                            fullWidth={true}
                            onChange={onDropDownChanged}
                            variant="outlined"
                            value={currentClaimant.gender || ""}
                            tooltip={findHelpTextByTag("gender", metadata.helpTags)}
                        >
                            <MenuItem value="Male">Male</MenuItem>
                            <MenuItem value="Female">Female</MenuItem>
                        </SelectList>
                    </ContentCell>
                    <ContentCell width="33%">
                        {isClaimExaminerOrAccountantOrAssistant ? (

                            <TextInput
                                disabled={isViewer}
                                id="sSN"
                                name="sSN"
                                label="SSN Number"
                                fullWidth={true}
                                variant="outlined"
                                value={phoneNumberVal}
                                inputProps={{ maxlength: 9 }}
                                {...register("sSN",
                                    {
                                        pattern: {
                                            value: /[\d-]{9}/i,
                                            message: "Must be 9 numeric digits."
                                        },
                                        onChange: onValueChanged
                                    }
                                )
                                }
                                error={errors.sSN}
                                helperText={errors.sSN ? errors.sSN.message : ""}
                                onBlur={onSave}
                                tooltip={findHelpTextByTag("sSN", metadata.helpTags)}
                            />
                        ) : (
                            <TextInput
                                disabled={true}
                                id="sSN"
                                name="sSN"
                                label="SSN Number"
                                type="password"
                                fullWidth={true}
                                variant="outlined"
                                value={currentClaimant.sSN}
                            />
                        )}
                    </ContentCell>
                </ContentRow>
                <ContentRow>
                    <ContentCell width="33%">
                        <SwitchInput
                            disabled={isViewer}
                            id="nonUSCitizen"
                            name="nonUSCitizen"
                            label="Non US Citizen"
                            checked={currentClaimant.nonUSCitizen}
                            onChange={onCheckBoxChanged}
                            tooltip={findHelpTextByTag("nonUSCitizen", metadata.helpTags)}
                        />
                    </ContentCell>
                    <ContentCell width="33%">
                        <SwitchInput
                            disabled={isViewer}
                            id="bIClaimant"
                            name="bIClaimant"
                            label="BI Claimant"
                            onChange={onCheckBoxChanged}
                            checked={currentClaimant.bIClaimant}
                            tooltip={findHelpTextByTag("bIClaimant", metadata.helpTags)}
                        />
                    </ContentCell>
                    <ContentCell width="33%">
                        {isClaimExaminerOrAccountantOrAssistant ? (
                            <TextInput
                                disabled={isViewer}
                                id="medicareNumber"
                                name="medicareNumber"
                                label="Medicare Number"
                                fullWidth={true}
                                variant="outlined"
                                value={currentClaimant.medicareNumber}
                                inputProps={{ maxlength: 20 }}
                                {...register("medicareNumber",
                                    {
                                        pattern: {
                                            value: /^[0-9a-z]+$/i,
                                            message: "Only Alpha numeric values are allowed."
                                        },
                                        onChange: onValueChanged
                                    }
                                )
                                }
                                error={errors.medicareNumber}
                                helperText={errors.medicareNumber ? errors.medicareNumber.message : ""}
                                onBlur={onSave}
                                tooltip={findHelpTextByTag("medicareNumber", metadata.helpTags)}
                            />
                        ) : (
                            <TextInput
                                disabled={true}
                                id="medicareNumber"
                                name="medicareNumber"
                                label="Medicare Number"
                                type="password"
                                fullWidth={true}
                                variant="outlined"
                                value={currentClaimant.medicareNumber}
                            />
                        )}
                    </ContentCell>
                </ContentRow>
                <ContentRow>
                    <ContentCell width="66%">
                        <TextInput
                            disabled={isViewer}
                            id="addressStreet1"
                            name="addressStreet1"
                            label="Street Address 1"
                            required
                            fullWidth={true}
                            onChange={onValueChanged}
                            variant="outlined"
                            value={currentClaimant.addressStreet1}
                            inputProps={{ maxlength: 250 }}
                            onBlur={onSave}
                            tooltip={findHelpTextByTag("addressStreet1", metadata.helpTags)}
                        />
                    </ContentCell>
                </ContentRow>
                <ContentRow>
                    <ContentCell width="66%">
                        <TextInput
                            disabled={isViewer}
                            id="addressStreet2"
                            name="addressStreet2"
                            label="Street Address 2"
                            fullWidth={true}
                            onChange={onValueChanged}
                            variant="outlined"
                            value={currentClaimant.addressStreet2}
                            inputProps={{ maxlength: 250 }}
                            onBlur={onSave}
                            tooltip={findHelpTextByTag("addressStreet2", metadata.helpTags)}
                        />
                    </ContentCell>
                </ContentRow>
                <ContentRow>
                    <ContentCell width="33%">
                        <TextInput
                            disabled={isViewer}
                            id="addressCity"
                            name="addressCity"
                            required
                            label="City"
                            fullWidth={true}
                            variant="outlined"
                            value={currentClaimant.addressCity}
                            inputProps={{ maxlength: 50 }}
                            tooltip={findHelpTextByTag("addressCity", metadata.helpTags)}
                            {...register("addressCity",
                                {
                                    pattern: {
                                        value: /^[a-zA-Z `'-]*$/i,
                                        message: "Must contain characters only"
                                    },
                                    onChange: onValueChanged
                                }
                            )
                            }
                            onBlur={onSave}
                            error={errors.addressCity}
                            helperText={errors.addressCity ? errors.addressCity.message : ""}
                        />
                    </ContentCell>
                    <ContentCell width="33%">
                        {
                            metadata.loading ? <>Loading...</> :
                                <SelectList
                                    disabled={isViewer}
                                    id="addressState"
                                    name="addressState"
                                    required
                                    label="State"
                                    fullWidth={true}
                                    {...register("addressState", {
                                        required: "This field is required",
                                        onChange: (e) => onValueChanged(e),
                                        onBlur: () => onSave(null)
                                    })}
                                    variant="outlined"
                                    value={currentClaimant.addressState || ""}
                                    tooltip={findHelpTextByTag("addressState", metadata.helpTags)}
                                >
                                    {
                                        metadata.riskStates.map(rs => <MenuItem value={rs.stateCode}>{rs.stateName}</MenuItem>)
                                    }
                                </SelectList>
                        }
                    </ContentCell>
                    <ContentCell width="33%">
                        <TextInput
                            disabled={isViewer}
                            id="addressZIP"
                            name="addressZIP"
                            label="Zip"
                            fullWidth={true}
                            required
                            variant="outlined"
                            value={currentClaimant.addressZIP}
                            inputProps={{ maxlength: 10 }}
                            {...register("addressZIP",
                                {
                                    pattern: {
                                        value: USZip,
                                        message: "This field is invalid."
                                    },
                                    onChange: (e) => zipFormat(onValueChanged,e)

                                }
                            )
                            }
                            error={errors.addressZIP}
                            helperText={errors.addressZIP ? errors.addressZIP.message : ""}
                            onBlur={onSave}
                            tooltip={findHelpTextByTag("addressZIP", metadata.helpTags)}
                        />
                    </ContentCell>
                </ContentRow>
                <ContentRow>
                    <ContentCell width="33%">
                        <TextInput
                            disabled={isViewer}
                            id="occupation"
                            name="occupation"
                            label="Occupation"
                            fullWidth={true}
                            variant="outlined"
                            value={currentClaimant.occupation}
                            inputProps={{ maxlength: 50 }}
                            tooltip={findHelpTextByTag("occupation", metadata.helpTags)}
                            {...register("occupation",
                                {
                                    pattern: {
                                        value: /^[a-zA-Z ]*$/i,
                                        message: "Must contain characters only"
                                    },
                                    onChange: onValueChanged
                                }
                            )
                            }
                            error={errors.occupation}
                            helperText={errors.occupation ? errors.occupation.message : ""}
                        />
                    </ContentCell>
                    <ContentCell width="33%">
                        <CurrencyInput
                            disabled={isViewer}
                            inputProps={{ maxlength: 15 }}
                            id="annualIncome"
                            name="annualIncome"
                            label="Annual Income"
                            value={currentClaimant.annualIncome}
                            onChange={onCurrencyChanged}
                            onBlur={onSave}
                          
                        />
                    </ContentCell>
                    <ContentCell width="33%">
                        <CurrencyInput
                            disabled={isViewer}
                            inputProps={{ maxlength: 15 }}
                            id="lostIncome"
                            name="lostIncome"
                            label="Lost Income"
                            value={currentClaimant.lostIncome}
                            onChange={onCurrencyChanged}
                            onBlur={onSave}
                          
                        />
                    </ContentCell>
                </ContentRow>
                <ContentRow>
                    <ContentCell width="33%">
                        <CurrencyInput
                            disabled={isViewer}
                            inputProps={{ maxlength: 15 }}
                            id="medicalExpenses"
                            name="medicalExpenses"
                            label="Medical Expenses"
                            value={currentClaimant.medicalExpenses}
                            onChange={onCurrencyChanged}
                            onBlur={onSave}
                            
                        />
                    </ContentCell>
                    <ContentCell width="33%">
                        <TextInput
                            disabled={isViewer}
                            id="injuries"
                            name="injuries"
                            label="Injuries"
                            required
                            fullWidth={true}
                            variant="outlined"
                            value={currentClaimant.injuries}
                            inputProps={{ maxlength: 250 }}
                            tooltip={findHelpTextByTag("injuries", metadata.helpTags)}
                            {...register("injuries",
                                {
                                    pattern: {
                                        value: /^[a-zA-Z ]*$/i,
                                        message: "Must contain characters only"
                                    },
                                    onChange: onValueChanged
                                }
                            )
                            }
                            onBlur={onSave}
                            error={errors.injuries}
                            helperText={errors.injuries ? errors.injuries.message : ""}
                        />
                    </ContentCell>
                </ContentRow>
                <ContentRow>
                    <ContentCell width="25%">
                        <TextInput
                            disabled={isViewer}
                            id="cIBRequested"
                            name="cIBRequested"
                            label="CIB Requested"
                            fullWidth={true}
                            variant="outlined"
                            value={currentClaimant.cIBRequested !== null && currentClaimant.cIBRequested !== undefined ? (currentClaimant.cIBRequested === true ? 'Yes' : 'No') : " "}
                            InputProps={{ readOnly: true }}
                            onBlur={onSave}
                            tooltip={findHelpTextByTag("cIBRequested", metadata.helpTags)}
                        />
                    </ContentCell>
                    <ContentCell width="25%">
                        <TextInput
                            disabled={isViewer}
                            id="cIBRequestedDate"
                            name="cIBRequestedDate"
                            label="CIB Requested Date"
                            fullWidth={true}
                            variant="outlined"
                            value={formatDate(currentClaimant.cIBRequestedDate) || " "}
                            InputProps={{ readOnly: true }}
                            onBlur={onSave}
                            tooltip={findHelpTextByTag("cIBRequestedDate", metadata.helpTags)}
                        />
                    </ContentCell>
                    <ContentCell width="25%">
                        <TextInput
                            disabled={isViewer}
                            id="medicareEligible"
                            name="medicareEligible"
                            label="Medicare Eligible"
                            fullWidth={true}
                            variant="outlined"
                            value={currentClaimant.medicareEligible !== null && currentClaimant.medicareEligible !== undefined ? (currentClaimant.medicareEligible === true ? 'Yes' : 'No') : " "}
                            InputProps={{ readOnly: true }}
                            onBlur={onSave}
                            tooltip={findHelpTextByTag("medicareEligible", metadata.helpTags)}
                        />
                    </ContentCell>
                    <ContentCell width="24%">
                        <TextInput
                            disabled={isViewer}
                            id="medicareReportedDate"
                            name="medicareReportedDate"
                            label="Medicare Reported Date"
                            fullWidth={true}
                            variant="outlined"
                            value={formatDate(currentClaimant.medicareReportedDate) || " "}
                            InputProps={{ readOnly: true }}
                            onBlur={onSave}
                            tooltip={findHelpTextByTag("medicareReportedDate", metadata.helpTags)}
                        />
                    </ContentCell>
                </ContentRow>
            </PanelContent>
        </Panel>
    );
};
