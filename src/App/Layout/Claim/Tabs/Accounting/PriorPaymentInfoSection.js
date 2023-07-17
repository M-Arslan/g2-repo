import { ChevronRight } from '@mui/icons-material';
import {
    Drawer,
    IconButton
} from '@mui/material';
import { makeStyles } from '@mui/styles';



import {
    AgGridReact
} from 'ag-grid-react';
import React from 'react';
import styled from 'styled-components';
import {
    formatDate
} from '../../../../Core/Forms/Common';

const AccountingLandingContainer = styled.div`
    height: 100%;
    width: 100%;
    margin: 0;
    padding: 0;
`;

const AccountingLandingHeader = styled.section`
    width: 100%;
    height:500px;
    padding: .5em;
    margin: 0;
    border: none;
    margin-bottom: .5em;
    background-color: ${props => props.theme.backgroundColor};
`;

const GridContainer = styled.div`
    height: 90%;
    width: 100%;
    padding:0px 10px 0px 10px;
`;

const useStyles = makeStyles((theme) => ({
    button: {
        margin: '1em',
    },
    formControl: {
        minWidth: 300,
    },
    selectControl: {
        width: '300px',
        margin: '0 auto',
    },
    root: {
        display: 'flex',
    },
    hide: {
        display: 'none',
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
        listStyle: 'none',
        listStyleType: 'none',
    },
    drawerPaper: {
        width: drawerWidth,
        top: '60px',
    },
    drawerHeader: {
        display: 'flex',
        alignItems: 'center',
padding: '0 1em',
        justifyContent: 'flex-start',
        backgroundColor: '#bdc3c7',
    },
    content: {
        flexGrow: 1,
        padding: '3em',
        marginRight: -drawerWidth,
    },
    contentShift: {
        marginRight: 0,
    },
    dividerFullWidth: {
        margin: `5px 0 0 2em`,
    },
    dividerInset: {
        margin: `5px 0 0 9px`,
    },
    heading: {
        fontSize: '15px',
        flexBasis: '33.33%',
        flexShrink: 0,
    },
    secondaryHeading: {
        fontSize: '15px',
    },
    expandedPanel: {
        margin: '0px !important'
    },
    panelDetails: {
        flexDirection: "column"
    }
}));

const columnDataKey = "columnData";
const filterDataKey = "filterData";
let gridApi;
let columnApi;
const drawerWidth = '75%';
let selectedView;
export const PriorPaymentInfoSection = ({ openDrawer, priorPayments, request, dispatch }) => {
    const classes = useStyles();

    const [open, setOpen] = React.useState(openDrawer);

    const colDefs = [
      
        {
            headerName: 'Invoice Number',
            field: 'invoiceNumber',
            sortable: true,
            filter: "agTextColumnFilter",
            tooltipField: "Invoice Number",
        },
        {
            headerName: 'Amount',
            field: 'amount',
            sortable: true,
            filter: "agTextColumnFilter",
            tooltipField: "Amount",
        },
        {
            headerName: 'Draft ID',
            field: 'draftID',
            sortable: true,
            filter: "agTextColumnFilter",
            tooltipField: "Draft ID",
        },

        {
            headerName: 'Issue Date',
            field: 'issuedDate',
            sortable: true,
            filter: "agSetColumnFilter",
            tooltipField: "Issue Date",
            cellRenderer: function (params) {
                return formatDate(params.value);
            },
        },
        {
            headerName: 'Void Date',
            field: 'voidDate',
            sortable: true,
            filter: "agTextColumnFilter",
            tooltipField: "voidDate",
            cellRenderer: function (params) {
                return formatDate(params.value);
            },
        },
        {
            headerName: 'Payee NO',
            sortable: true,
            filter: "agTextColumnFilter",
            field: 'payeeNumber',
            tooltipField: "Payee Number",
        },        
    ];

    const defaultColDef = {
        autoHeight: true,
        autoWidth: true,
        sortable: true,
        resizable: true,
        flex: 1,
        filter: true,
    };

    const onGridReady = (params) => {
        gridApi = params.api;
        columnApi = params.columnApi;
        sizeToFit();
        setGridFilters();
    };
 

 
    const sizeToFit = () => {
        gridApi.sizeColumnsToFit();
    };
    const setGridFilters = () => {
        if (selectedView !== null && selectedView !== undefined) {

            try {
                columnApi.applyColumnState(JSON.parse(selectedView.columnData));
            }
            catch (ex) {

            }
            gridApi.setSortModel(JSON.parse(selectedView.sortData));
            gridApi.setFilterModel(JSON.parse(selectedView.filterData));
        }
        gridApi.sizeColumnsToFit();

    };
    const onClose = () => {
        setOpen(false);
        dispatch({ type: 'UPDATE_UNIVERSAL_REQUEST', request: { ...request, openPriorPaymentDrawer: false } });
    }


    React.useEffect(() => {

        localStorage.removeItem(columnDataKey);
        localStorage.removeItem(filterDataKey);
    }, []);

    return (
        <Drawer
            className={classes.drawer}
            anchor="right"
            open={request.openPriorPaymentDrawer}
            classes={{
                paper: classes.drawerPaper,
            }}
        >
        <AccountingLandingContainer>
                <div className={classes.drawerHeader}>
                    <IconButton name="arrowchevron_right" onClick={onClose}>
                    <ChevronRight />
                    Prior Payments
                </IconButton>
            </div>
            <AccountingLandingHeader>
                <GridContainer className="ag-theme-balham">
                    <AgGridReact
                        defaultColDef={defaultColDef}
                        columnDefs={colDefs}
                            rowData={priorPayments.priorPayments ? priorPayments.priorPayments : []}
                        onGridReady={onGridReady}
                        pagination={true}
                        paginationPageSize={20}
                        floatingFilter
                    >
                    </AgGridReact>
                </GridContainer>
            </AccountingLandingHeader>

            </AccountingLandingContainer>
        </Drawer>
    );
};