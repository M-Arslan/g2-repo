import styled from 'styled-components';
import { TabContainer } from '../../../../Claim/Tabs/TabContainer';
import { Panel, PanelHeader } from '../../../../../Core/Forms/Common';



import { AgGridReact } from 'ag-grid-react';

const GridContainer = styled.div`
    height: 250px;
    width: auto;
`;

export const ULOthersClaims = ({ UlClaims }) => {

    const [metadata, setMetadata] = React.useState({
        loading: true,
        data: [],
    });

    React.useEffect(() => {
        let ulData = UlClaims.filter((x) => x.ulClaimTypeID == 4);
        setMetadata({ ...metadata, data: ulData, loading: false });
    }, [])

    const colDefs = [
        {
            headerName: 'U/L Claim Number',
            field: 'claimID',
            tooltipField: "U/L Claim Number",
        },
        {
            headerName: 'Policy Number',
            field: 'policyID',
            tooltipField: "Policy Number",
            wrapText: true,
        },
        {
            headerName: 'Insured Name',
            field: 'insuredName',
            tooltipField: "Insured Name",
        },
        {
            headerName: 'Status',
            field: 'policyStatusID',
            tooltipField: "Status",
        },
        {
            headerName: 'Claim Examiner',
            field: 'claimExaminer',
            tooltipField: "Claim Examiner",

        }
    ]

    const defaultColDef = {
        cellClass: 'cell-wrap-text',
        cellStyle: { 'white-space': 'normal' },
        sortable: false,
        //editable: true,
        resizable: true,
    };

    return (
        <>
            <TabContainer>
                <Panel>
                    <PanelHeader><span style={{ fontWeight: 'bold', fontSize: '14px' }}>U/L Claims - others</span></PanelHeader>
                    <GridContainer className="ag-theme-balham">
                        <AgGridReact
                            columnDefs={colDefs}
                            rowData={metadata.data.length ? metadata.data : []}
                            pagination={true}
                            paginationPageSize={10}
                            defaultColDef={defaultColDef}
                        >
                        </AgGridReact>
                    </GridContainer>
                </Panel>
            </TabContainer>
        </>

    );

} 