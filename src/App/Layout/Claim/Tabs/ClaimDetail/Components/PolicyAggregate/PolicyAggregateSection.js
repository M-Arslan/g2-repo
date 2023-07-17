


import { AgGridReact } from 'ag-grid-react';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import {
    ASYNC_STATES
} from '../../../../../../Core/Enumerations/redux/async-states';
import { Panel, PanelContent, Spinner, formatDate } from '../../../../../../Core/Forms/Common';
import {
    policyAggregateActions,
    policyAggregateSelectors
} from '../../../../../../Core/State/slices/claim';
import {
    claimSelectors
} from '../../../../../../Core/State/slices/claim';
import {
    DATA_FORMATTERS
} from '../../../../../Common/Components/DataGrid';
import {
    policyCodingActions,
    policyCodingSelectors
} from '../../../../../../Core/State/slices/policy-coding';
import {
    safeObj
} from '../../../../../../Core/Utility/safeObject';
import { CLAIM_TYPES } from '../../../../../../Core/Enumerations/app/claim-type';
import { LEGAL_ENTITY } from '../../../../../../Core/Enumerations/app/legal-entity';


const GridContainer = styled.div`
    width: 100%;
`;


const ContentRow = styled.div`
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-start;
    align-items: center;
    align-content: center;
`;

const ContentCell = styled.div`
    width: 50%;
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-start;
    align-items: center;
    align-content: center;
    padding: .5em;
`;


export const PolicyAggregateSection = ({ model }) => {
    let $dispatch = useDispatch();
    const claim = useSelector(claimSelectors.selectData());
    const policyAggregate = (useSelector(policyAggregateSelectors.selectData()) || []).filter(X => X.claimID !== claim.claimID);
    const policyAggregateState = useSelector(policyAggregateSelectors.selectData());
    const policyID = claim.claimPolicyID ? claim.claimPolicyID : claim.claimPolicy ? claim.claimPolicy.policyID : "";
    const dept = parseInt(safeObj(claim.policy).departmentCode || '0');
    const policies = useSelector(policyCodingSelectors.selectData()) || [];

    const columnDefs = [
        {
            headerName: 'Claim Number',
            field: 'claimID',
            flex: 1,
        },
        {
            headerName: 'Date of Loss',
            flex: 1,
            field: 'lossDate',
            valueGetter: function (params) {
                return params.data.lossDate !== null ? formatDate(params.data.lossDate) :  '';
            },
        },
        {
            headerName: 'CMP Status',
            flex: 1,
            field: 'fALClaimStatusText',
            valueGetter: function (params) {
                return params.data.fALClaimStatusText !== null ? formatDate(params.data.fALClaimStatusText) : 'Not In CMP';
            },

        },
        {
            headerName: 'Statutory System Status',
            flex: 1,
            field: 'genServeStatusText',
        },
        {
            headerName: 'Total Incurred',
            flex: 1,
            field: 'totalIncurred',
            valueGetter: function (params) {
                return params.data.totalIncurred ? "$" + DATA_FORMATTERS.Currency(params.data.totalIncurred) : "";
            },
        },

    ];
    const defaultColDef = {
        cellClass: 'cell-wrap-text',
        cellStyle: { 'white-space': 'normal' },
        flex: 1,
        autoHeight: true,
        sortable: true,
        //editable: true,
        resizable: true,
        filter: true,
    };

    React.useEffect(() => {
        $dispatch(policyAggregateActions.list({ policyId: policyID, g2LegalEntityID: claim.g2LegalEntityID, statSystem : claim?.statutorySystem ,includeLegal: claim.claimType === CLAIM_TYPES.LEGAL }));
        $dispatch(policyCodingActions.get({ policyID: policyID, dept }));

    }, [policyID]);
    return (
        policyAggregateState !==  ASYNC_STATES.WORKING ?
            <>
                <Panel>
                    <PanelContent>
                        <ContentRow>
                            <ContentCell width="99%">
                                Claim for Policy {policyID}
                            </ContentCell>
                        </ContentRow>
                        {policies.length > 0 && claim.g2LegalEntityID !== LEGAL_ENTITY.GENESIS_INSURANCE &&
                            <ContentRow>
                                <ContentCell width="20%">
                                <b> Coverage</b>
                                </ContentCell>
                                <ContentCell width="20%">
                                   <b> Policy Aggregate</b>
                                </ContentCell>
                                <ContentCell width="60%">
                                </ContentCell>
                            </ContentRow>
                        }
                        {
                            claim.g2LegalEntityID !== LEGAL_ENTITY.GENESIS_INSURANCE && policies.map(X =>
                                <ContentRow>
                                    <ContentCell width="20%">
                                        {X.coverageCode}
                                    </ContentCell>
                                    <ContentCell width="20%">
                                        {"$" +(DATA_FORMATTERS.Currency(X.aggregateLimit) || 0)}
                                    </ContentCell>
                                    <ContentCell width="60%">
                                    </ContentCell>
                                </ContentRow>

                            )
                        }
                        {policyAggregate.length > 0 ?
                            <GridContainer className="ag-theme-balham">
                                <AgGridReact
                                    columnDefs={columnDefs}
                                    defaultColDef={defaultColDef}
                                    rowData={policyAggregate ? policyAggregate : []}
                                    pagination={true}
                                    paginationPageSize={10}
                                    domLayout={'autoHeight'}
                                />
                            </GridContainer>
                            :
                            "There are no other claims for this policy"
                        }
                    </PanelContent>
                </Panel>
            </>
            : <Spinner />
    );
};