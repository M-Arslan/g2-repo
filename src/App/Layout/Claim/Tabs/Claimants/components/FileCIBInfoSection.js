import { Divider, MenuItem } from '@mui/material';
import React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { APP_TYPES } from '../../../../../Core/Enumerations/app/app-types';
import { Panel, PanelContent, PanelHeader, SelectList, TextInput } from '../../../../../Core/Forms/Common';
import { getCIBLossTypes, getRiskStates, getCompanies } from '../../../../../Core/Services/EntityGateway';
import { userSelectors } from '../../../../../Core/State/slices/user';
import { loadHelpTags, findHelpTextByTag } from '../../../../Help/Queries';
import { FAL_CLAIM_STATUS_TYPES } from '../../../../../Core/Enumerations/app/fal_claim-status-types';

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

export const FileCIBInfoSection = ({claim, request, dispatch, formValidator, onSave }) => {
    const $auth = useSelector(userSelectors.selectAuthContext());

    const isViewer = claim.fALClaimStatusTypeID === FAL_CLAIM_STATUS_TYPES.CLOSED || claim.fALClaimStatusTypeID === FAL_CLAIM_STATUS_TYPES.ERROR || $auth.isReadOnly(APP_TYPES.Claimant);
  
    let currentCIB = request.currentClaimant.cIB || {};

    const { register, formState: { errors }, setValue } = formValidator;

    setValue("claimCoverageTypeCode", currentCIB.claimCoverageTypeCode);
    setValue("cIBLossTypeID", currentCIB.cIBLossTypeID);
    setValue("claimantFormerCity", currentCIB.currentCIB);
    setValue("claimantFormerZip", currentCIB.claimantFormerZip);
    setValue("claimantDoctorCity", currentCIB.claimantDoctorCity);
    setValue("claimantDoctorZip", currentCIB.claimantDoctorZip);
    setValue("claimantAttorneyCity", currentCIB.claimantAttorneyCity);
    setValue("claimantAttorneyZip", currentCIB.claimantAttorneyZip);
    setValue("insuredStreet", currentCIB.insuredStreet);
    setValue("insuredCity", currentCIB.insuredCity);
    setValue("insuredZip", currentCIB.insuredZip);
    setValue("companyCodeRef", currentCIB.companyCodeRef);
    

    const [metadata, setMetadata] = React.useState({
        loading: true,
        riskStates: [],
        cibLossTypes: [],
        helpTags: [],
        companies:[],
    });

    const onValueChanged = (evt) => {
        const { name, value } = evt.target;
        setValue(name, value ? value : null)
        if (evt.target.name === "claimCoverageTypeCode" || evt.target.name === "cIBLossTypeID")
            setValue(evt.target.name, evt.target.value.trimStart());
        let currentCIB = request.currentClaimant.cIB || {};
        currentCIB[evt.target.name] = evt.target.value.trimStart();
        request.currentClaimant.cIB = currentCIB;
        dispatch({ type: 'UPDATE_UNIVERSAL_REQUEST', request: { ...request } });
    };

    const onDropDownChanged = (evt) => {

        if (evt.target.name === "claimCoverageTypeCode" || evt.target.name === "cIBLossTypeID" || evt.target.name === "companyCodeRef")
            setValue(evt.target.name, evt.target.value);

        let currentCIB = request.currentClaimant.cIB || {};
        currentCIB[evt.target.name] = evt.target.value;
        request.currentClaimant.cIB = currentCIB;
        console.log(currentCIB.cIBLossTypeID);
        dispatch({ type: 'UPDATE_UNIVERSAL_REQUEST', request: { ...request } });
        onSave();
    };

    React.useEffect(() => {

        async function LoadMetaData() {
            let cltypes = await getCIBLossTypes();
            let riskStates = await getRiskStates();
            let companies = await getCompanies();
            let helpTags = await loadHelpTags(request.helpContainerName);
            setMetadata({
                loading: false,
                riskStates: (riskStates || []),
                cibLossTypes: (cltypes || []),
                helpTags: (helpTags.data.list || []),
                companies: (companies || []),
            });
        }
        LoadMetaData();


    }, []);

    return (
        <Panel>
            <PanelHeader><span style={{ fontWeight: 'bold', fontSize: '14px' }}>CIB Details</span></PanelHeader>
            <PanelContent>
                <ContentRow>
                    <ContentCell width="33%">
                        <SelectList
                            disabled={isViewer}
                            id="cIBTypeCode"
                            name="cIBTypeCode"
                            label="Initial or Reindex"
                            fullWidth={true}
                            onChange={onDropDownChanged}
                            variant="outlined"
                            value={currentCIB.cIBTypeCode || ""}
                            allowempty={false}
                            tooltip={findHelpTextByTag("cIBTypeCode", metadata.helpTags)}
                        >
                            <MenuItem value="I">Initial</MenuItem>
                            <MenuItem value="R">Reindex</MenuItem>
                        </SelectList>
                    </ContentCell>
                    <ContentCell width="33%">
                        <SelectList
                            disabled={isViewer}
                            id="claimCoverageTypeCode"
                            name="claimCoverageTypeCode"
                            label="Type of Claim/Coverage"
                            required
                            fullWidth={true}
                            variant="outlined"
                            allowempty={false}
                            {...register("claimCoverageTypeCode", {
                                required: "This field is required",
                                onChange: (e) => onDropDownChanged(e),
                            })}
                            value={currentCIB.claimCoverageTypeCode || ""}
                            {...register("claimCoverageTypeCode",
                                {
                                    required: "This is required.",
                                    onChange: onDropDownChanged
                                }
                            )
                            }
                            error={errors.claimCoverageTypeCode}
                            helperText={errors.claimCoverageTypeCode ? errors.claimCoverageTypeCode.message : ""}
                            tooltip={findHelpTextByTag("claimCoverageTypeCode", metadata.helpTags)}
                        >
                            <MenuItem value="LBI">Liability Bodily Injury</MenuItem>
                            <MenuItem value="OBI">Other Bodily Injury</MenuItem>
                            <MenuItem value="PBI">Pollution Bodily Injury</MenuItem>
                            <MenuItem value="PCO">Products and Completed Operation</MenuItem>
                            <MenuItem value="EOBI">Errors and Omission Bodily Injury</MenuItem>
                        </SelectList>
                    </ContentCell>
                    <ContentCell width="33%">
                        {
                            metadata.loading ? <>Loading...</> :
                                <SelectList
                                    disabled={isViewer}
                                    id="cIBLossTypeID"
                                    name="cIBLossTypeID"
                                    label="Type of Loss"
                                    required
                                    fullWidth={true}
                                    variant="outlined"
                                    value={currentCIB.cIBLossTypeID}
                                    {...register("cIBLossTypeID",
                                        {
                                            required: "This is required.",
                                            onChange: onDropDownChanged
                                        }
                                    )
                                    }
                                    error={errors.cIBLossTypeID}
                                    helperText={errors.cIBLossTypeID ? errors.cIBLossTypeID.message : ""}
                                    tooltip={findHelpTextByTag("cIBLossTypeID", metadata.helpTags)}
                                >
                                    {
                                        metadata.cibLossTypes.map(rs => <MenuItem value={rs.cIBLossTypeID}>{rs.cIBLossTypeText}</MenuItem>)
                                    }

                                </SelectList>
                        }
                    </ContentCell>
                </ContentRow>
                <ContentRow>
                    <ContentCell width="33%">
                        <TextInput
                            disabled={isViewer}
                            id="claimantFormerStreet"
                            name="claimantFormerStreet"
                            label="Former Street"
                            fullWidth={true}
                            onChange={onValueChanged}
                            variant="outlined"
                            value={currentCIB.claimantFormerStreet}
                            inputProps={{ maxLength: 250 }}
                            onBlur={onSave}
                            tooltip={findHelpTextByTag("claimantFormerStreet", metadata.helpTags)}
                        />
                    </ContentCell>
                    <ContentCell width="33%">
                        <TextInput
                            disabled={isViewer}
                            id="claimantFormerCity"
                            name="claimantFormerCity"
                            label="Former City"
                            fullWidth={true}
                            variant="outlined"
                            value={currentCIB.claimantFormerCity}
                            inputProps={{ maxLength: 50 }}
                            tooltip={findHelpTextByTag("claimantFormerCity", metadata.helpTags)}
                            {...register("claimantFormerCity",
                                {
                                    pattern: {
                                        value: /^[a-zA-Z -`',.]*$/i,
                                        message: "Must contain characters only"
                                    },
                                    onChange: onValueChanged
                                }
                            )
                            }
                            onBlur={onSave}
                            error={errors.claimantFormerCity}
                            helperText={errors.claimantFormerCity ? errors.claimantFormerCity.message : ""}

                        />
                    </ContentCell>
                    <ContentCell width="33%">
                        {
                            metadata.loading ? <>Loading...</> :
                                <SelectList
                                    disabled={isViewer}
                                    id="companyCodeRef"
                                    name="companyCodeRef"
                                    label="Company"
                                    fullWidth={true}
                                    {...register("companyCodeRef", {
                                        required: "This field is required",
                                        onChange: (e) => onDropDownChanged(e),
                                    })}
                                    variant="outlined"
                                    value={currentCIB.companyCodeRef}
                                    error={errors?.companyCodeRef}
                                    helperText={errors?.claimantFormerCity ? errors?.claimantFormerCity.message : ""}
                                    tooltip={findHelpTextByTag("companyCodeRef", metadata.helpTags)}
                                >
                                    {
                                        metadata.companies.map(rs => <MenuItem value={rs.companyCode}>{rs.companyName}</MenuItem>)
                                    }

                                </SelectList>
                        }
                    </ContentCell>
                </ContentRow>
                <ContentRow>
                    <ContentCell width="33%">
                        {
                            metadata.loading ? <>Loading...</> :
                                <SelectList
                                    disabled={isViewer}
                                    id="claimantFormerState"
                                    name="claimantFormerState"
                                    label="Former State"
                                    fullWidth={true}
                                    onChange={onDropDownChanged}
                                    variant="outlined"
                                    value={currentCIB.claimantFormerState || ""}
                                    tooltip={findHelpTextByTag("claimantFormerState", metadata.helpTags)}
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
                            id="claimantFormerZip"
                            name="claimantFormerZip"
                            label="Former Zip"
                            fullWidth={true}
                            variant="outlined"
                            value={currentCIB.claimantFormerZip}
                            inputProps={{ maxLength: 5 }}
                            tooltip={findHelpTextByTag("claimantFormerZip", metadata.helpTags)}
                            {...register("claimantFormerZip",
                                {
                                    pattern: {
                                        value: /^[0-9]*$/i,
                                        message: "Must be numeric characters"
                                    },
                                    onChange: onValueChanged
                                }
                            )
                            }
                            onBlur={onSave}
                            error={errors.claimantFormerZip}
                            helperText={errors.claimantFormerZip ? errors.claimantFormerZip.message : ""}
                        />
                    </ContentCell>
                </ContentRow>
                <ContentRow>
                    <ContentCell width="66%">
                        <TextInput
                            disabled={isViewer}
                            id="husbandWifeAllias"
                            name="husbandWifeAllias"
                            label="Husband or Wife, Former Name, Aliases, Parents of Minor"
                            fullWidth={true}
                            onChange={onValueChanged}
                            variant="outlined"
                            value={currentCIB.husbandWifeAllias}
                            inputProps={{ maxLength: 100 }}
                            onBlur={onSave}
                            tooltip={findHelpTextByTag("husbandWifeAllias", metadata.helpTags)}
                        />
                    </ContentCell>
                </ContentRow>
                <Divider />
                <ContentRow>
                    <ContentCell width="66%">
                        <TextInput
                            disabled={isViewer}
                            id="claimantDoctorName"
                            name="claimantDoctorName"
                            label="Doctor Name"
                            fullWidth={true}
                            onChange={onValueChanged}
                            variant="outlined"
                            value={currentCIB.claimantDoctorName}
                            inputProps={{ maxLength: 50 }}
                            onBlur={onSave}
                            tooltip={findHelpTextByTag("claimantDoctorName", metadata.helpTags)}
                        />
                    </ContentCell>
                </ContentRow>
                <ContentRow>
                    <ContentCell width="33%">
                        <TextInput
                            disabled={isViewer}
                            id="claimantDoctorStreet"
                            name="claimantDoctorStreet"
                            label="Doctor Street"
                            fullWidth={true}
                            onChange={onValueChanged}
                            variant="outlined"
                            value={currentCIB.claimantDoctorStreet}
                            inputProps={{ maxLength: 250 }}
                            onBlur={onSave}
                            tooltip={findHelpTextByTag("claimantDoctorStreet", metadata.helpTags)}
                        />
                    </ContentCell>
                    <ContentCell width="33%">
                        <TextInput
                            disabled={isViewer}
                            id="claimantDoctorCity"
                            name="claimantDoctorCity"
                            label="Doctor City"
                            fullWidth={true}
                            variant="outlined"
                            value={currentCIB.claimantDoctorCity}
                            inputProps={{ maxLength: 50 }}
                            onBlur={onSave}
                            tooltip={findHelpTextByTag("claimantDoctorCity", metadata.helpTags)}
                            {...register("claimantDoctorCity",
                                {
                                    pattern: {
                                        value: /^[a-zA-Z -`',.]*$/i,
                                        message: "Must contain characters only"
                                    },
                                    onChange: onValueChanged
                                }
                            )
                            }

                            error={errors.claimantDoctorCity}
                            helperText={errors.claimantDoctorCity ? errors.claimantDoctorCity.message : ""}

                        />
                    </ContentCell>
                </ContentRow>
                <ContentRow>
                    <ContentCell width="33%">
                        {
                            metadata.loading ? <>Loading...</> :
                                <SelectList
                                    disabled={isViewer}
                                    id="claimantDoctorState"
                                    name="claimantDoctorState"
                                    label="Doctor State"
                                    fullWidth={true}
                                    onChange={onDropDownChanged}
                                    variant="outlined"
                                    value={currentCIB.claimantDoctorState || ""}
                                    tooltip={findHelpTextByTag("claimantDoctorState", metadata.helpTags)}
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
                            id="claimantDoctorZip"
                            name="claimantDoctorZip"
                            label="Doctor Zip"
                            fullWidth={true}
                            variant="outlined"
                            value={currentCIB.claimantDoctorZip}
                            inputProps={{ maxLength: 5 }}
                            tooltip={findHelpTextByTag("claimantDoctorZip", metadata.helpTags)}
                            {...register("claimantDoctorZip",
                                {
                                    pattern: {
                                        value: /^[0-9]*$/i,
                                        message: "Must be numeric characters"
                                    },
                                    onChange: onValueChanged
                                }
                            )
                            }
                            onBlur={onSave}
                            error={errors.claimantDoctorZip}
                            helperText={errors.claimantDoctorZip ? errors.claimantDoctorZip.message : ""}
                        />
                    </ContentCell>
                </ContentRow>
                <Divider />
                <ContentRow>
                    <ContentCell width="66%">
                        <TextInput
                            disabled={isViewer}
                            id="claimantAttorneyName"
                            name="claimantAttorneyName"
                            label="Attorney Name"
                            fullWidth={true}
                            onChange={onValueChanged}
                            variant="outlined"
                            value={currentCIB.claimantAttorneyName}
                            inputProps={{ maxLength: 50 }}
                            onBlur={onSave}
                            tooltip={findHelpTextByTag("claimantAttorneyName", metadata.helpTags)}
                        />
                    </ContentCell>
                </ContentRow>
                <ContentRow>
                    <ContentCell width="33%">
                        <TextInput
                            disabled={isViewer}
                            id="claimantAttorneyStreet"
                            name="claimantAttorneyStreet"
                            label="Attorney Street"
                            fullWidth={true}
                            onChange={onValueChanged}
                            variant="outlined"
                            value={currentCIB.claimantAttorneyStreet}
                            inputProps={{ maxLength: 250 }}
                            onBlur={onSave}
                            tooltip={findHelpTextByTag("claimantAttorneyStreet", metadata.helpTags)}
                        />
                    </ContentCell>
                    <ContentCell width="33%">
                        <TextInput
                            disabled={isViewer}
                            id="claimantAttorneyCity"
                            name="claimantAttorneyCity"
                            label="Attorney City"
                            fullWidth={true}
                            variant="outlined"
                            value={currentCIB.claimantAttorneyCity}
                            inputProps={{ maxLength: 50 }}
                            onBlur={onSave}
                            tooltip={findHelpTextByTag("claimantAttorneyCity", metadata.helpTags)}
                            {...register("claimantAttorneyCity",
                                {
                                    pattern: {
                                        value: /^[a-zA-Z '`,.-]*$/i,
                                        message: "Must contain characters only"
                                    },
                                    onChange: onValueChanged
                                }
                            )
                            }
                            error={errors.claimantAttorneyCity}
                            helperText={errors.claimantAttorneyCity ? errors.claimantAttorneyCity.message : ""}

                        />
                    </ContentCell>
                </ContentRow>
                <ContentRow>
                    <ContentCell width="33%">
                        {
                            metadata.loading ? <>Loading...</> :
                                <SelectList
                                    disabled={isViewer}
                                    id="claimantAttorneyState"
                                    name="claimantAttorneyState"
                                    label="Attorney State"
                                    fullWidth={true}
                                    onChange={onDropDownChanged}
                                    variant="outlined"
                                    value={currentCIB.claimantAttorneyState || ""}
                                    tooltip={findHelpTextByTag("claimantAttorneyState", metadata.helpTags)}
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
                            id="claimantAttorneyZip"
                            name="claimantAttorneyZip"
                            label="Attorney Zip"
                            fullWidth={true}
                            variant="outlined"
                            value={currentCIB.claimantAttorneyZip}
                            inputProps={{ maxLength: 5 }}
                            tooltip={findHelpTextByTag("claimantAttorneyZip", metadata.helpTags)}
                            {...register("claimantAttorneyZip",
                                {
                                    pattern: {
                                        value: /^[0-9]*$/i,
                                        message: "Must be numeric characters"
                                    },
                                    onChange: onValueChanged
                                }
                            )
                            }
                            onBlur={onSave}
                            error={errors.claimantAttorneyZip}
                            helperText={errors.claimantAttorneyZip ? errors.claimantAttorneyZip.message : ""}
                        />
                    </ContentCell>
                </ContentRow>
                <Divider />
                <ContentRow>
                    <ContentCell width="33%">
                        <TextInput
                            disabled={isViewer}
                            id="insuredStreet"
                            name="insuredStreet"
                            label="Insured Street"
                            fullWidth={true}
                            variant="outlined"
                            required
                            value={currentCIB.insuredStreet}
                            inputProps={{ maxlength: 250 }}
                            onBlur={onSave}
                            {...register("insuredStreet",
                                {
                                    required: "Field is required",
                                    onChange: onValueChanged
                                }
                            )
                            }

                            error={errors.insuredStreet}
                            helperText={errors.insuredStreet ? errors.insuredStreet.message : ""}
                            tooltip={findHelpTextByTag("insuredStreet", metadata.helpTags)}
                        />
                    </ContentCell>
                    <ContentCell width="33%">
                        <TextInput
                            disabled={isViewer}
                            id="insuredCity"
                            name="insuredCity"
                            label="Insured City"
                            fullWidth={true}
                            required
                            variant="outlined"
                            value={currentCIB.insuredCity}
                            inputProps={{ maxLength: 50 }}
                            tooltip={findHelpTextByTag("insuredCity", metadata.helpTags)}
                            {...register("insuredCity",
                                {
                                    pattern: {
                                        value: /^[a-zA-Z '`,.-]*$/i,
                                        message: "Must contain characters only"
                                    },
                                    onChange: onValueChanged
                                }
                            )
                            }
                            onBlur={onSave}
                            error={errors.insuredCity}
                            helperText={errors.insuredCity ? errors.insuredCity.message : ""}

                        />
                    </ContentCell>
                </ContentRow>
                <ContentRow>
                    <ContentCell width="33%">
                        {
                            metadata.loading ? <>Loading...</> :
                                <SelectList
                                    disabled={isViewer}
                                    id="insuredState"
                                    name="insuredState"
                                    label="Insured State"
                                    fullWidth={true}
                                    onChange={onDropDownChanged}
                                    variant="outlined"
                                    required
                                    value={currentCIB.insuredState || ""}
                                    tooltip={findHelpTextByTag("insuredState", metadata.helpTags)}
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
                            id="insuredZip"
                            name="insuredZip"
                            label="Insured Zip"
                            fullWidth={true}
                            variant="outlined"
                            required
                            value={currentCIB.insuredZip}
                            inputProps={{ maxLength: 5 }}
                            tooltip={findHelpTextByTag("insuredZip", metadata.helpTags)}
                            {...register("insuredZip",
                                {
                                    pattern: {
                                        value: /^[0-9]*$/i,
                                        message: "Must be numeric characters"
                                    },
                                    onChange: onValueChanged
                                }
                            )
                            }
                            onBlur={onSave}
                            error={errors.insuredZip}
                            helperText={errors.insuredZip ? errors.insuredZip.message : ""}
                        />
                    </ContentCell>
                </ContentRow>
                <Divider />
                <ContentRow>
                    <ContentCell width="100%">
                        <TextInput
                            disabled={isViewer}
                            id="remarks"
                            name="remarks"
                            label="Remarks"
                            fullWidth={true}
                            onChange={onValueChanged}
                            variant="outlined"
                            value={currentCIB.remarks}
                            inputProps={{ maxLength: 250 }}
                            onBlur={onSave}
                            tooltip={findHelpTextByTag("remarks", metadata.helpTags)}
                        />
                    </ContentCell>
                </ContentRow>
            </PanelContent>
        </Panel>
    );
};
