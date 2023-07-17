import React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { APP_TYPES } from '../../../../Core/Enumerations/app/app-types';
import { formatDate, TextInput } from '../../../../Core/Forms/Common';
import { userSelectors } from '../../../../Core/State/slices/user';
import { usersSelectors } from '../../../../Core/State/slices/users';
import { loadActionLogForFinancialActivityLog } from '../../../ActionLog/Queries';
import { findHelpTextByTag, loadHelpTags } from '../../../Help/Queries';

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

export const ClaimActivityStatusInfoSection = ({ claim, request, dispatch}) => {
    const $auth = useSelector(userSelectors.selectAuthContext());
    const users = useSelector(usersSelectors.selectData());

    const isViewer = $auth.isReadOnly(APP_TYPES.Financials) || request.currentClaimActivity.activityID;
    const currentClaimActivity = request.currentClaimActivity || {};
    const [metadata, setMetadata] = React.useState({
        loading: true,
        helpTags: [],
        actionLog: {},
    });
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

    return (
        <>
            <ContentRow>
                <ContentCell width="33%">
                    <TextInput
                        disabled={isViewer}
                        InputProps={{ readOnly: true }}
                        label="Activity Type"
                        fullWidth={true}
                        variant="outlined"
                        value={((currentClaimActivity || {}).accountingTransType || {}).accountingTransTypeText || (currentClaimActivity || {}).accountingTransTypeText}
                        tooltip={findHelpTextByTag("facRIApplies", metadata.helpTags)}
                    />
                </ContentCell>
                <ContentCell width="33%">
                    <TextInput
                        disabled={isViewer}
                        InputProps={{ readOnly: true }}
                        label="Status"
                        fullWidth={true}
                        variant="outlined"
                        value={((currentClaimActivity || {}).claimStatusTypeType || {}).statusText || "Not Submitted"}
                        tooltip={findHelpTextByTag("facRIApplies", metadata.helpTags)}
                    />
                </ContentCell>
                <ContentCell width="33%">
                    <TextInput
                        disabled={isViewer}
                        InputProps={{ readOnly: true }}
                        label="Status Date"
                        fullWidth={true}
                        variant="outlined"
                        value={formatDate((metadata.actionLog || {}).createdDate)}
                        tooltip={findHelpTextByTag("facRIApplies", metadata.helpTags)}
                        key={formatDate((metadata.actionLog || {}).createdDate)}
                    />
                </ContentCell>
            </ContentRow>
            <ContentRow>
                <ContentCell width="33%">
                    <TextInput
                        disabled={isViewer}
                        InputProps={{ readOnly: true }}
                        label="Requested By"
                        fullWidth={true}
                        variant="outlined"
                        value={(users.filter(x => x.userID.toLowerCase() === ((currentClaimActivity || {}).createdBy||"").toLowerCase())[0] || {}).fullName}
                        tooltip={findHelpTextByTag("facRIApplies", metadata.helpTags)}
                    />
                </ContentCell>
                <ContentCell width="33%">
                    <TextInput
                        disabled={isViewer}
                        InputProps={{ readOnly: true }}
                        label="Requested Date"
                        fullWidth={true}
                        variant="outlined"
                        value={formatDate((currentClaimActivity || {}).createdDate)}
                        key={formatDate((currentClaimActivity || {}).createdDate)}
                        tooltip={findHelpTextByTag("facRIApplies", metadata.helpTags)}
                    />
                </ContentCell>
            </ContentRow>
        </>
    );
}