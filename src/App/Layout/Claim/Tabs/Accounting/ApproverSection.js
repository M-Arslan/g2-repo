import React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { APP_TYPES } from '../../../../Core/Enumerations/app/app-types';
import { PanelHeader, TextInput } from '../../../../Core/Forms/Common';
import { userSelectors } from '../../../../Core/State/slices/user';
import { loadActionLogForFinancialActivityLog } from '../../../ActionLog/Queries';
import { findHelpTextByTag, loadHelpTags } from '../../../Help/Queries';
import { CLAIM_STATUS_TYPE } from '../../../../Core/Enumerations/app/claim-status-type';


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

export const ApproverSection = ({ claim, request, dispatch, formValidator}) => {
    const $auth = useSelector(userSelectors.selectAuthContext());
    const currentUser = $auth.currentUser;
    const currentClaimActivity = request.currentClaimActivity || {};
    const isViewer = ($auth.isReadOnly(APP_TYPES.Financials)) || !request.currentClaimActivity.activityID || (request.currentClaimActivity.activityID && request.currentClaimActivity.claimStatusTypeID !== CLAIM_STATUS_TYPE.PENDING_APPROVAL) || currentUser.id !== currentClaimActivity.taskOwner;
    const [metadata, setMetadata] = React.useState({
        loading: true,
        helpTags: [],
        actionLog: {},
    });
    const { register, formState: { errors }, setValue } = formValidator;
    setValue("comment", (currentClaimActivity.workflowTask || {}).comment ? (currentClaimActivity.workflowTask || {}).comment : null);
    React.useEffect(() => {
        loadMetaData();
    }, []);

    async function loadMetaData() {
        let helpTags = await loadHelpTags(request.helpContainerName);
        let actionLog = currentClaimActivity.activityID ? await loadActionLogForFinancialActivityLog(claim.claimMasterID, currentClaimActivity.activityID) : {};
        setMetadata({
            loading: false,
            helpTags: (helpTags.data.list || []),
            actionLog: (actionLog.data || {}).latestActionLog || {},
        });

    }
    const onValueChanged = (evt) => {
        request.currentClaimActivity.workflowTask[evt.target.name] = evt.target.value.trimStart();
        dispatch({ type: 'UPDATE_UNIVERSAL_REQUEST', request: { ...request } });
    };

    return (
        (currentClaimActivity.claimStatusTypeID === CLAIM_STATUS_TYPE.IN_PROGRESS_PI_2 || currentClaimActivity.claimStatusTypeID === CLAIM_STATUS_TYPE.VOID_PI_2 || currentClaimActivity.claimStatusTypeID === CLAIM_STATUS_TYPE.PENDING_APPROVAL || currentClaimActivity.claimStatusTypeID === CLAIM_STATUS_TYPE.REJECTED || currentClaimActivity.claimStatusTypeID === CLAIM_STATUS_TYPE.SUBMITTED || currentClaimActivity.claimStatusTypeID === CLAIM_STATUS_TYPE.OUTSTANDING_ISSUE || currentClaimActivity.claimStatusTypeID === CLAIM_STATUS_TYPE.PENDING_BOT_PROCESSING || currentClaimActivity.claimStatusTypeID === CLAIM_STATUS_TYPE.REINSURANCE_PROCESSING_REQUIRED || currentClaimActivity.claimStatusTypeID === CLAIM_STATUS_TYPE.PROCESSING_IN_PROGRESS) &&
        <>
            <PanelHeader><span style={{ fontWeight: 'bold', fontSize: '14px' }}>Approver Section</span></PanelHeader>
            { currentClaimActivity.claimStatusTypeID === CLAIM_STATUS_TYPE.PENDING_APPROVAL ?
                <ContentRow>
                    <ContentCell width="33%">
                        <TextInput
                            disabled={true}
                            label="Approver User"
                            required
                            value={currentClaimActivity.taskOwner || ''}
                        />
                    </ContentCell>
                </ContentRow>
                : null
            }
            <ContentRow>
                <ContentCell width="99%">
                    <TextInput
                        disabled={isViewer}
                        id="comment"
                        name="comment"
                        label="Comments"
                        required
                        value={(currentClaimActivity.workflowTask || {}).comment}
                        tooltip={findHelpTextByTag("comments", metadata.helpTags)}
                        {...register("comment",
                            {
                                required: "This is required.",
                                onChange: onValueChanged
                            }
                        )
                        }
                        error={errors.comment}
                        helperText={errors.comment ? errors.comment.message : ""}
                    />
                </ContentCell>
            </ContentRow>
        </>
    );
}