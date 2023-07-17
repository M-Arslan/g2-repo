import React from 'react';
import styled from 'styled-components';
import {
    AgGridReact
} from 'ag-grid-react';



import {
    customGQLQuery
} from '../../../../../../Core/Services/EntityGateway';
import { useSnackbar } from 'notistack';
import { CLAIM_STATUS_TYPE } from '../../../../../../Core/Enumerations/app/claim-status-type';

const GridContainer = styled.div`
    //height: 100%;
    width: 100%;
`;
let gridAPI = null;
let columnApi;
//FacilitiesPGMPolicyCodingSection
export const FacilitiesPGMPolicyCodingSection = ({ request,policyID, onRowSelected}) => {
    const { enqueueSnackbar } = useSnackbar();

    let currentClaimActivity = request.currentClaimActivity || {};
    let currentOpenRegistrations = currentClaimActivity.openRegistrations || {};
    let currentOpenRegistrationCoverages = currentOpenRegistrations.openRegistrationCoverages || [];

    function ParseGQErrors(errors, error) {
        if (error || errors) {
            console.log("An error occured: ", errors);
            console.log("An error occured: ", error);
            enqueueSnackbar("An error occured.", { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
        }
    }

    function currencyFormatter(params) {
        if (params.value)
            return "$"+formatNumber(params.value);
    }
    function formatNumber(number) {
        return Math.floor(number)
            .toString()
            .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
    }
    const colDefs = [
        {
            headerName: 'Coverage',
            field: 'coverageCode',
            flex: 1,
            checkboxSelection: (!request.currentClaimActivity.activityID || request.currentClaimActivity.claimStatusTypeID === CLAIM_STATUS_TYPE.OUTSTANDING_ISSUE),
       },
        {
            headerName: 'Class',
            field: 'className',
            flex: 2,
        },
        {
            headerName: 'Form of Coverage',
            field: 'formOfCoverageCode',
            flex: 2,
        },
        {
            headerName: 'Attach Type',
            field: 'attachmentTypeCode',
            flex: 3,
        },
        {
            headerName: 'Per Occurrence Limit',
            field: 'perOccuranceLimit',
            valueFormatter: currencyFormatter,
            flex: 2,
        },
        {
            headerName: 'Aggregate Limit',
            field: 'aggregateLimit',
            valueFormatter: currencyFormatter,
            flex: 2,
        },
    ];
    const defaultColDef = {
        flex: 1,
        autoHeight: true,
        autoWidth: true,
        sortable: true,
        //editable: true,
        resizable: true,
        filter: true,
    };

    const loadData = async () => {
        let query = {
            "query": `
            query {
                facilitiesPGMPolicyCodings(policyID:"${policyID}"){ 
                    aggregateLimit
                    attachmentTypeCode
                    classCode
                    className
                    coverageCode
                    formOfCoverageCode
                    perOccuranceLimit       
                    policyID
                } 
            }
            `
        }
        const result = await customGQLQuery(`claim-policy-grid`, query);
        ParseGQErrors(result.errors, result.error);
        
        let covereagesData = []
        covereagesData = result.data.facilitiesPGMPolicyCodings || [];

        setState({
            loaded: true,
            data: covereagesData,
        });

    };

    const [state, setState] = React.useState({
        loaded: false,
        data: {},
    });

    React.useEffect(() => {
        loadData();
    }, ['facilitiesPGMPolicyCodings']);


    if (state.loaded !== true) {
        return <div>Loading grid...</div>;
    }
    function onGridReady(params) {
        gridAPI = params.api;
        columnApi = params.columnApi;

        gridAPI.forEachNode(node => {
            function findCoverage(X) {
                return (X.policyID === node.data.policyID && !X.coverageCode && !X.classCode) || (X.policyID === node.data.policyID && X.coverageCode === node.data.coverageCode && X.classCode === node.data.classCode);
            }

            let index = currentOpenRegistrationCoverages.findIndex(findCoverage);
            if (index > -1)
                node.setSelected(true);
        }
        );
    }

    return (
        <GridContainer className="ag-theme-balham">
            <AgGridReact
                defaultColDef={defaultColDef}
                columnDefs={colDefs}
                rowData={state.data}
                domLayout="autoHeight"
                rowSelection="multiple"
                onRowSelected={onRowSelected}
                onGridReady={onGridReady}

            >
            </AgGridReact>
        </GridContainer>
    );
};