import { MenuItem } from '@mui/material';
import React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { APP_TYPES } from '../../../../../Core/Enumerations/app/app-types';
import { FAL_CLAIM_STATUS_TYPES } from '../../../../../Core/Enumerations/app/fal_claim-status-types';
import { ROLES } from '../../../../../Core/Enumerations/security/roles';
import { DatePicker, Panel, PanelContent, PanelHeader, SelectList, TextInput } from '../../../../../Core/Forms/Common';
import { getRiskStates } from '../../../../../Core/Services/EntityGateway';
import { userSelectors } from '../../../../../Core/State/slices/user';
import { findHelpTextByTag, loadHelpTags } from '../../../../Help/Queries';


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
export const WCClaimantInfoSection = ({ claim, request, dispatch, formValidator, onSave }) => {
    const $auth = useSelector(userSelectors.selectAuthContext());
    const isViewer = claim.fALClaimStatusTypeID === FAL_CLAIM_STATUS_TYPES.CLOSED || claim.fALClaimStatusTypeID === FAL_CLAIM_STATUS_TYPES.ERROR || $auth.isReadOnly(APP_TYPES.WC_Cliamant);
    const isClaimExaminerOrSeniorManager = $auth.isInRole(ROLES.Claims_Examiner) || $auth.isInRole(ROLES.Senior_Management);
    const { currentClaimant } = request;
  
    const [metadata, setMetadata] = React.useState({
        loading: true,
        riskStates: [],
        helpTags: []
    });
    const { register, formState: { errors }, setValue, unregister, clearErrors } = formValidator;
    if (currentClaimant) {
        setValue("claimantName", currentClaimant.claimantName ? currentClaimant.claimantName : null);
        setValue("gender", currentClaimant.gender);
        setValue("tabular", currentClaimant.tabular);
        setValue('escalating', currentClaimant.escalating)
    }
    const onValueChanged = (evt) => {
        const { name, value } = evt.target;
        setValue(name, value ? value : null)
        request.currentClaimant[evt.target.name] = evt.target.value.trimStart();
        dispatch({ type: 'UPDATE_UNIVERSAL_REQUEST', request: { ...request } });

    };
    const onDateChanged = (evt) => {
        request.currentClaimant[evt.target.name] = evt.target.value;
        request.currentClaimant[evt.target.name] = request.currentClaimant[evt.target.name] ? new Date(request.currentClaimant[evt.target.name]).toISOString() : null;
        dispatch({ type: 'UPDATE_UNIVERSAL_REQUEST', request: { ...request } });
    };
    const onDropDownChanged = (evt) => {
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
    return (
        <Panel>
            <PanelHeader><span style={{ fontWeight: 'bold', fontSize: '14px' }}>WC Claimant Details</span></PanelHeader>
            <PanelContent>
                <ContentRow>
                    <ContentCell width="20%">
                        <TextInput
                            //disabled={isViewer}
                            id="claimantName"
                            name="claimantName"
                            label="Claimant Name"
                            required
                            fullWidth={true}
                            variant="outlined"
                            defaultValue={currentClaimant.claimantName}
                            inputProps={{ maxlength: 50 }}
                            {...register("claimantName",
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
                            error={errors.claimantName}
                            helperText={errors.claimantName ? errors.claimantName.message : ""}

                        />
                    </ContentCell>

                      <ContentCell width="20%">
                            <DatePicker
                               id="dateOfBirth"
                               name="dateOfBirth"
                               label="Date of Birth"
                               fullWidth={true}
                               onChange={onDateChanged}
                               variant="outlined"
                               value={currentClaimant.dateOfBirth || null}
                               disableFuture={true}
                               error={errors?.dateOfBirth}
                               helperText={errors?.dateOfBirth ? errors?.dateOfBirth.message : ""}
                                inputProps={{ readOnly: !isClaimExaminerOrSeniorManager}}
                            />
                             </ContentCell>
                    <ContentCell width="20%">
                        <SelectList
                            //disabled={isViewer}
                            id="gender"
                            name="gender"
                            label="Gender"
                            required
                            fullWidth={true}
                            variant="outlined"
                            value={currentClaimant.gender || ""}
                            tooltip={findHelpTextByTag("gender", metadata.helpTags)}
                            {...register("gender",
                                {
                                    required: "This is required.",

                                    onChange: onDropDownChanged
                                }
                            )
                            }
                            error={errors.gender}
                            helperText={errors.gender ? errors.gender.message : ""}
                        >
                            <MenuItem value="Male">Male</MenuItem>
                            <MenuItem value="Female">Female</MenuItem>
                        </SelectList>
                    </ContentCell>
                    <ContentCell width="20%">
                        <SelectList
                            //disabled={isViewer}
                            id="deceased"
                            name="deceased"
                            label="Deceased"
                            fullWidth={true}
                            variant="outlined"
                            onChange={onDropDownChanged}
                            value={currentClaimant.deceased}
                            tooltip={findHelpTextByTag("deceased", metadata.helpTags)}
                        >
                            <MenuItem value={true} >Yes</MenuItem>
                            <MenuItem value={false} >No</MenuItem>
                        </SelectList>
                    </ContentCell>
                    <ContentCell width="25%">
                        <DatePicker
                            id="dateOfDeath"
                            name="dateOfDeath"
                            label="Date of Death"
                            fullWidth={true}
                            onChange={onDateChanged}
                            variant="outlined"
                            value={currentClaimant.dateOfDeath || null}
                            disableFuture={true}
                            error={errors?.dateOfDeath}
                            helperText={errors?.dateOfDeath ? errors?.dateOfDeath.message : ""}
                        //inputProps={{ readOnly: isViewer === true }}
                        />

                    </ContentCell>
                </ContentRow>
                <ContentRow>

                    <ContentCell width="25%">
                        <SelectList
                            //disabled={isViewer}
                            id="tabular"
                            name="tabular"
                            label="Tabular"
                            required
                            fullWidth={true}
                            variant="outlined"
                            value={currentClaimant.tabular || ""}
                            tooltip={findHelpTextByTag("tabular", metadata.helpTags)}
                            {...register("tabular",
                                {
                                    required: "This is required.",
                                    onChange: onDropDownChanged
                                }
                            )
                            }
                            error={errors.tabular}
                            helperText={errors.tabular ? errors.tabular.message : ""}
                        >
                            <MenuItem value="N">No</MenuItem>
                            <MenuItem value="Y">Yes</MenuItem>
                            <MenuItem value="NT">Not at this time</MenuItem>
                            <MenuItem value="U">Unknown</MenuItem>
                        </SelectList>
                    </ContentCell>
                    <ContentCell width="25%">
                        <DatePicker
                            id="tabularStartDate"
                            name="tabularStartDate"
                            label="Tabular Start Date"
                            fullWidth={true}
                            onChange={onDateChanged}
                            variant="outlined"
                            value={currentClaimant.tabularStartDate || null}
                            error={errors?.tabularStartDate}
                            helperText={errors?.tabularStartDate ? errors?.tabularStartDate.message : ""}
                        //inputProps={{ readOnly: isViewer === true }}
                        />

                    </ContentCell>
                    <ContentCell width="25%">
                        <DatePicker
                            id="tabularEndDate"
                            name="tabularEndDate"
                            label="Tabular End Date"
                            fullWidth={true}
                            onChange={onDateChanged}
                            variant="outlined"
                            value={currentClaimant.tabularEndDate || null}
                            error={errors?.tabularEndDate}
                            min={currentClaimant.tabularStartDate ? new Date(currentClaimant.tabularStartDate).toISOString().split("T")[0] : ""}
                            helperText={errors?.tabularEndDate ? errors?.tabularEndDate.message : ""}
                        //inputProps={{ readOnly: isViewer === true }}
                        />

                    </ContentCell>

                    <ContentCell width="25%">
                        <SelectList
                            //disabled={isViewer}
                            id="tabularEndReason"
                            name="tabularEndReason"
                            label="Tabular End Reason"
                            fullWidth={true}
                            variant="outlined"
                            onChange={onDropDownChanged}
                            value={currentClaimant.tabularEndReason || ""}
                            tooltip={findHelpTextByTag("escalating", metadata.helpTags)}
                        >
                            <MenuItem value="I">IW Deceased</MenuItem>
                            <MenuItem value="S">Case Settled</MenuItem>
                            <MenuItem value="C">Closed as Inactive</MenuItem>
                            <MenuItem value="O">Other - See Notes</MenuItem>
                        </SelectList>
                    </ContentCell>
                </ContentRow>

                <ContentRow>
                    <ContentCell width="50%">
                        <SelectList
                            // disabled={isViewer}
                            id="tableType"
                            name="tableType"
                            label="Table Type"
                            fullWidth={true}
                            variant="outlined"
                            onChange={onDropDownChanged}
                            value={currentClaimant.tableType || ""}
                            tooltip={findHelpTextByTag("tableType", metadata.helpTags)}
                        >
                            <MenuItem value="S">Super Impaired</MenuItem>
                            <MenuItem value="I">Impaired</MenuItem>
                            <MenuItem value="R">Remarriage</MenuItem>
                            <MenuItem value="F">Full Life</MenuItem>
                        </SelectList>
                    </ContentCell>
                    <ContentCell width="50%">
                        <SelectList
                            //disabled={isViewer}
                            id="escalating"
                            name="escalating"
                            label="Escalating"
                            fullWidth={true}
                            variant="outlined"
                            onChange={onDropDownChanged}
                            value={currentClaimant.escalating}
                            tooltip={findHelpTextByTag("escalating", metadata.helpTags)}
                        >
                            <MenuItem value={true} >Yes</MenuItem>
                            <MenuItem value={false} >No</MenuItem>
                        </SelectList>
                    </ContentCell>
                </ContentRow>
                <ContentRow>
                    <ContentCell width="100%">
                        <TextInput
                            //disabled={isViewer}
                            multiLine={true}
                            id="comments"
                            name="comments"
                            label="Comments"
                            inputProps={{
                                maxLength: 1024,
                            }}
                            defaultValue={currentClaimant.comments}
                            onChange={onValueChanged}
                            multiline
                            rows={3}
                        />
                    </ContentCell>
                </ContentRow>
            </PanelContent>
        </Panel>
    );
};
