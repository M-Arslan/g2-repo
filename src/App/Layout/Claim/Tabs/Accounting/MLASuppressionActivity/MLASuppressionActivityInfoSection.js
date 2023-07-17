import { Divider, MenuItem } from '@mui/material';
import React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { APP_TYPES } from '../../../../../Core/Enumerations/app/app-types';
import { Panel, PanelContent, PanelHeader, SelectList, TextInput } from '../../../../../Core/Forms/Common';
import { userSelectors } from '../../../../../Core/State/slices/user';
import { findHelpTextByTag, loadHelpTags } from '../../../../Help/Queries';
import { ApproverSection } from '../ApproverSection';
import { ClaimActivityStatusInfoSection } from '../ClaimActivityStatusInfoSection';
import { loadMLASuppressionReasonTypes } from '../Queries';
import { CLAIM_STATUS_TYPE } from '../../../../../Core/Enumerations/app/claim-status-type';


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

export const MLASuppressionActivityInfoSection = ({ claim,request, dispatch, formValidator, onSave }) => {
    const $auth = useSelector(userSelectors.selectAuthContext());
    const isViewer = $auth.isReadOnly(APP_TYPES.Financials) || (request.currentClaimActivity.activityID && request.currentClaimActivity.claimStatusTypeID !== CLAIM_STATUS_TYPE.OUTSTANDING_ISSUE);
    const currentClaimActivity = request.currentClaimActivity || {};
    const currentMLASuppression = currentClaimActivity.mLASuppression || {};

    const { register, formState: { errors }, setValue } = formValidator;
    setValue("mLASuppressionReasonTypeID", currentMLASuppression.mLASuppressionReasonTypeID);
    setValue("additionalDetail", currentMLASuppression.additionalDetail);
    
    const [metadata, setMetadata] = React.useState({
        loading: true,
        reasonTypes: [],
        helpTags: []
    });

    const onValueChanged = (evt) => {
        currentMLASuppression[evt.target.name] = evt.target.value.trimStart();
        currentClaimActivity.mLASuppression = currentMLASuppression;
        dispatch({ type: 'UPDATE_UNIVERSAL_REQUEST', request: { ...request, currentClaimActivity: currentClaimActivity } });
    };
    const onDropDownChanged = (evt) => {
        currentMLASuppression[evt.target.name] = parseInt(evt.target.value);
        currentClaimActivity.mLASuppression = currentMLASuppression;
        dispatch({ type: 'UPDATE_UNIVERSAL_REQUEST', request: { ...request, currentClaimActivity: currentClaimActivity } });
    };
    React.useEffect(() => {
        loadMetaData();

    }, []);

    async function loadMetaData() {
        let helpTags = await loadHelpTags(request.helpContainerName);
        let reasonTypes = await loadMLASuppressionReasonTypes();

        setMetadata({
            loading: false,
            helpTags: (helpTags.data.list || []),
            reasonTypes: (reasonTypes.data.mlaSuppressionReasonTypeList || []),
        });

    }

    return (
        <Panel>
            <PanelHeader><span style={{ fontWeight: 'bold', fontSize: '14px' }}>{currentClaimActivity.accountingTransTypeText}</span></PanelHeader>
            <PanelContent>
                <ClaimActivityStatusInfoSection claim={claim} request={request} dispatch={dispatch} />
                <Divider/>
                <ContentRow>
                    <ContentCell width="33%">
                        {
                            metadata.loading ? <div>Loading...</div> :
                                <SelectList
                                    disabled={isViewer}
                                    id="mLASuppressionReasonTypeID"
                                    name="mLASuppressionReasonTypeID"
                                    required
                                    label="Reason"
                                    fullWidth={true}
                                    variant="outlined"
                                    value={currentMLASuppression.mLASuppressionReasonTypeID}
                                    tooltip={findHelpTextByTag("mLASuppressionReasonTypeID", metadata.helpTags)}
                                    {...register("mLASuppressionReasonTypeID",
                                        {
                                            required: "This is required.",
                                            onChange: onDropDownChanged
                                        }
                                    )
                                    }

                                    error={errors.mLASuppressionReasonTypeID}
                                    helperText={errors.mLASuppressionReasonTypeID ? errors.mLASuppressionReasonTypeID.message : ""}
                                >
                                    {
                                        metadata.reasonTypes
                                            .map((item, idx) => <MenuItem value={item.mLASuppressionReasonTypeID} key={item.mLASuppressionReasonTypeID}>{item.mLASuppressionReasonTypeText}</MenuItem>)
                                    }
                                </SelectList>
                        }
                    </ContentCell>
                    <ContentCell width="67%">
                        <TextInput
                            label="Additional Details"
                            disabled={isViewer}
                            id="additionalDetail"
                            name="additionalDetail"
                            required
                            fullWidth={true}
                            variant="outlined"
                            value={currentMLASuppression.additionalDetail}
                            tooltip={findHelpTextByTag("additionalDetail", metadata.helpTags)}
                            {...register("additionalDetail",
                                {
                                    required: "This is required.",
                                    onChange: onValueChanged
                                }
                            )
                            }
                            error={errors.additionalDetail}
                            helperText={errors.additionalDetail ? errors.additionalDetail.message : ""}
                        />
                    </ContentCell>
                </ContentRow>
                <Divider />
                <ApproverSection claim={claim} request={request} dispatch={dispatch} formValidator={formValidator} />
            </PanelContent>
        </Panel>
    );
};
