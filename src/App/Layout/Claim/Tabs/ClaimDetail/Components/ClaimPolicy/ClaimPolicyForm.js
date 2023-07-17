import React from 'react';
import styled from 'styled-components';
import { Cancel } from '@mui/icons-material';
import {
    useSelector
} from 'react-redux';
import {
    SwitchInput
} from '../../../../../../Core/Forms/Common';
import {
    claimSelectors
} from '../../../../../../Core/State/slices/claim';

import {
    claimActivitySelectors
} from '../../../../../../Core/State/slices/claim-activity';
import {
    ensureNonEmptyArray,
    ensureNonEmptyString,
    ensureNonNullObject
} from '../../../../../../Core/Utility/rules';
import {
    useAppHost
} from '../../../AppHost';
import { useSnackbar } from 'notistack';
import {
    ManualPolicyInfo
} from './ManualPolicyInfo';
import {
    PolicyInfo
} from './PolicyInfo';
import { makeEvent } from '../../../../../../Core/Utility/makeEvent';
import { stripEmptyFields } from '../../../../../../Core/Utility/stripEmptyFields';
import { uuid } from '../../../../../../Core/Utility/uuid';
import {
    useGraphQL
} from '../../../../../../Core/Providers/GraphQL/useGraphQL';
import { LEGAL_ENTITY } from '../../../../../../Core/Enumerations/app/legal-entity';
import {
    useNotifications
} from '../../../../../../Core/Providers/NotificationProvider/NotificationProvider';
import {
    GetPolicy
} from '../../Queries/GetPolicy';
import {
    PolicyAggregateSection
} from '../PolicyAggregate/PolicyAggregateSection';
import {
    Panel,
    PanelHeader,
    PanelContent
} from '../../../../../../Core/Forms/Common';
import { Button, IconButton } from '@mui/material';
import { CLAIM_STATUS_TYPE } from '../../../../../../Core/Enumerations/app/claim-status-type';
import { ConfirmationDialog } from '../../../../../../Core/Forms/Common/ConfirmationDialog'
const ManualPolicyRow = styled.div`
    width: 100%;
    height: auto;
    padding: 0;
    margin: 0;
    border: 0;
    border-top: solid 1px rgb(170, 170, 170);
    border-bottom: solid 1px rgb(170, 170, 170);
    background-color: ${props => props.theme.backgroundDark};
    padding-left: 1em;

    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    align-content: center;
    align-items: center;
`;

const FormContainer = styled.div`
    width: 100%;
    padding: 1em;
`;

export const ClaimPolicyForm = ({ id, model, onManualChanged }) => {
    const claim = useSelector(claimSelectors.selectData());
    const policyID = claim.claimPolicyID ? claim.claimPolicyID : claim.claimPolicy ? claim.claimPolicy.policyID : "";
    const { enqueueSnackbar } = useSnackbar();
    const $host = useAppHost();

    const $notify = useNotifications();
    const $api = useGraphQL({
        getPolicy: GetPolicy
    });

    const activities = useSelector(claimActivitySelectors.selectByAllCriteria({
        claimStatusTypeID: CLAIM_STATUS_TYPE.SUBMITTED.toString()
    }));
    const readonly = ($host.appIsReadonly || ensureNonEmptyArray(activities));

    const [manualPolicy, setManualPolicy] = React.useState((ensureNonEmptyString(model.claimPolicyID.value) !== true && ensureNonNullObject(model.claimPolicy.value) && ensureNonEmptyString(model.claimPolicy.value.policyID)));
    const [showAggregatePolicy, setShowAggregatePolicy] = React.useState(false);
    const [showConfirmationDialog, setShowConfirmationDialog] = React.useState(false);
    const toggleManualPolicySwitch = (evt) => {
        setShowConfirmationDialog(false);
        const mp = !manualPolicy;
        setManualPolicy(mp);

        if (mp && ensureNonNullObject(model.claimPolicy.value) !== true) {
            const cpid = uuid();
            const e = makeEvent('claimPolicy', null);
            model.handleUserInput(e);
            model.handleUserInput(makeEvent('insuredName', claim.insuredName));
            model.handleUserInput(makeEvent('insuredNameContinuation', null));
            model.handleUserInput(makeEvent('uwDept', null));
            model.handleUserInput(makeEvent('policy', null));
            model.handleUserInput(makeEvent('deptCD', null));
            model.handleUserInput(makeEvent('claimPolicyID', null));

            model.handleUserInput(makeEvent('claimPolicy', {
                claimPolicyID: cpid,
                claimMasterID: model.claimMasterID.value,
                active: true,
                isNew: "true"
            }));
            model.handleFinalizeInput(e);
        }
        else if (ensureNonNullObject(model.claimPolicy.value)) {
            model.handleFinalizeInput(makeEvent('claimPolicy', {
                ...model.claimPolicy.value,
                active: (mp === true)
            }));
        }

        if (typeof onManualChanged === 'function') {
            onManualChanged(makeEvent(id, mp));
        }
    }

    const onCancel = () => {
        setShowConfirmationDialog(false);
    }
    const checkIfNotEmpty = () => {
        if (model.claimPolicy.value === "" && model.policy.value === "") {
            toggleManualPolicySwitch();
        }
        else {
            setShowConfirmationDialog(true);
        }
    }
    // -- finalizing the changes to Manual Policy
    const onFinalize = async (evt) => {

        const { value } = evt.target;

        if (value.request.retroDate !== "") {
            let retroDate = value.request.retroDate;
            retroDate = new Date(retroDate).toISOString().split('T')[0];
            delete value.request.retroDate;
            value.request.retroDate = retroDate;
        }

        if (value.request.polEffDate !== "") {
            let polEffDate = value.request.polEffDate;
            polEffDate = new Date(polEffDate).toISOString().split('T')[0];
            delete value.request.polEffDate;
            value.request.polEffDate = polEffDate;
        }

        if (value.request.polExpDate !== "") {
            let polExpDate = value.request.polExpDate;
            polExpDate = new Date(polExpDate).toISOString().split('T')[0];
            delete value.request.polExpDate;
            value.request.polExpDate = polExpDate;
        }

        if (ensureNonNullObject(value) && ensureNonNullObject(value.request) && value.valid === true && value.modified === true) {

            const result = await $api.getPolicy({ id: value.request.policyID });
            if (ensureNonNullObject(result)) {
                $notify.notifyError('The policy is in GenServe. This would not be saved as a Manual Policy');
                const e = makeEvent('policy', stripEmptyFields(result));
                model.handleUserInput(e);
                model.handleUserInput(makeEvent('claimPolicyID', value.request.policyID));
                model.handleUserInput(makeEvent('insuredName', result.insuredName));
                model.handleUserInput(makeEvent('insuredNameContinuation', result.insuredNameContinuation));
                model.handleUserInput(makeEvent('deptCD', result.departmentCode));
                model.handleUserInput(makeEvent('uwDept', result.departmentName));
                model.handleUserInput(makeEvent('claimPolicy', null));
                model.handleFinalizeInput(e);
                toggleManualPolicySwitch();
            }
            else {
                //Manual
                const policy = { ...value.request, claimMasterID: model.claimMasterID.value, active: (manualPolicy === true) };
                const e = makeEvent('claimPolicy', stripEmptyFields(policy));
                model.handleUserInput(e);
                if (manualPolicy === true) {
                    model.handleUserInput(makeEvent('insuredName', policy.insuredName));
                    model.handleUserInput(makeEvent('insuredNameContinuation', null));
                    model.handleUserInput(makeEvent('uwDept', null));
                    model.handleUserInput(makeEvent('policy', null));
                    model.handleUserInput(makeEvent('deptCD', null));
                    model.handleUserInput(makeEvent('claimPolicyID', null));
                }

                model.handleFinalizeInput(e);
            }
        }
    };

    const onViewClaims = (e) =>
    {
        if ([LEGAL_ENTITY.GENESIS_REINSURANCE].includes(model.g2LegalEntityID.value) && !model.statutorySystem.value) {
            enqueueSnackbar("You must first select a Statutory System.", { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
            return;
        }
        setShowAggregatePolicy(!showAggregatePolicy);
    }
    return (
        <>
            {showAggregatePolicy &&
                <Panel>
                    <PanelHeader>
                        Policy Releated Claims
                        <IconButton name="Cancel" title="Go Back" onClick={onViewClaims}><Cancel /></IconButton>
                    </PanelHeader>
                    <PanelContent padding="0">
                        <ManualPolicyRow>
                        </ManualPolicyRow>
                        <PolicyAggregateSection id={`${id}__claim-policy-aggregate`} model={model} />
                    </PanelContent>
                </Panel>
            }
            {!showAggregatePolicy &&
                <Panel>
                    <PanelHeader>Policy Details{policyID &&
                        <Button onClick={onViewClaims} variant="contained" color="primary">{"View policy related claims"}</Button>
                    }
                    </PanelHeader>
                    <PanelContent padding="0">
                        <ManualPolicyRow>
                            <SwitchInput
                                disabled={readonly}
                                id="manualPolicy"
                                name="manualPolicy"
                                label="Manual Policy"
                                checked={manualPolicy}
                                onChange={() => { checkIfNotEmpty() }}
                            />
                        </ManualPolicyRow>
                        <FormContainer>
                            {
                                manualPolicy === true ? <ManualPolicyInfo id={id} onFinalize={onFinalize} initialRequest={model.claimPolicy.value} readOnly={readonly} claimModel={model}/> : <PolicyInfo id={id} model={model} readOnly={readonly} />
                            }
                            <ConfirmationDialog
                                id="fileCIBConfirmation"
                                keepMounted
                                open={showConfirmationDialog}
                                onCancel={onCancel}
                                onOk={toggleManualPolicySwitch}
                                title="Confirmation"
                                description="Do you want to remove previously added policy data?"
                            />
                        </FormContainer>
                    </PanelContent>
                </Panel>
            }

        </>
    );
}