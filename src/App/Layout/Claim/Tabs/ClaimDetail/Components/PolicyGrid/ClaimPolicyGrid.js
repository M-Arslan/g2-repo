import React from 'react';
import {
    useDispatch,
    useSelector
} from 'react-redux';
import {
    ASYNC_STATES
} from '../../../../../../Core/Enumerations/redux/async-states';
import {
    Panel,
    PanelContent,
    PanelHeader
} from '../../../../../../Core/Forms/Common';
import {
    claimSelectors
} from '../../../../../../Core/State/slices/claim';
import {
    policyCodingActions,
    policyCodingSelectors
} from '../../../../../../Core/State/slices/policy-coding';
import {
    ensureNonEmptyString,
    ensureNonNullObject
} from '../../../../../../Core/Utility/rules';
import {
    safeObj
} from '../../../../../../Core/Utility/safeObject';
import {
    DataGrid,
} from '../../../../../Common/Components/DataGrid';
import {
    getColumnDefs
} from './ColumnDefs';

export const ClaimPolicyGrid = () => {

    const $dispatch = useDispatch();
    const claim = useSelector(claimSelectors.selectData());
    const dept = parseInt(safeObj(claim.policy).departmentCode || '0');
    const pcLoading = useSelector(policyCodingSelectors.selectLoading());
    const rowData = useSelector(policyCodingSelectors.selectData());

    React.useEffect(() => {
        if (ensureNonEmptyString(claim.claimPolicyID)) {
            $dispatch(policyCodingActions.get({ policyID: claim.claimPolicyID, dept }));
        }
    }, [claim.claimPolicyID, dept]);

    const gridConfig = getColumnDefs(dept);

    return (ensureNonNullObject(gridConfig) ? 
        <Panel height="450px">
            <PanelHeader>Policy Coding</PanelHeader>
            <PanelContent padding="0">
                {(pcLoading === ASYNC_STATES.SUCCESS ? <DataGrid key="claim-detail__policy-codings" columnDefs={gridConfig} rowData={rowData} /> : null)}
            </PanelContent>
        </Panel>
        : null);

}