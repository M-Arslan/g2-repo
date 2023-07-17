


import { AgGridReact } from 'ag-grid-react';
import { useSnackbar } from 'notistack';
import React from 'react';
import styled from 'styled-components';
import { LEGAL_ENTITY } from '../../../../../Core/Enumerations/app/legal-entity';
import DeleteChildRenderer from './DeleteChildRenderer';
import { EditChildRenderer } from './DeleteChildRenderer';
import { ACCOUNTING_TRANS_TYPES } from '../../../../../Core/Enumerations/app/accounting-trans-type';
import { VENDOR_PAYMENT_TYPE_CODE } from '../../../../../Core/Enumerations/app/payment-type-code';

const GridContainer = styled.div`
    height: 200px;
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
    width: ${props => props.width || '50%'};
    display: flex;
    flex-flow: row nowrap;
    justify-content: ${props => props.alignContent || 'flex-start'};
    align-items: ${props => props.alignContent || 'flex-start'};
    align-content: ${props => props.alignContent || 'flex-start'};
    padding: 0em;
`;

let gridAPI = null;
let columnAPI = null;

export const VendorListSection = ({ claim, request, dispatch, isViewer, onPaymentClaimActivityDraft }) => {

    const currentClaimActivity = request.currentClaimActivity || {};
    const currentPayment = currentClaimActivity.payments || {};
    const paymentVendors = currentPayment.paymentVendors || [];
    const columnDefs = [
        {
            headerName: currentClaimActivity.accountingTransTypeID === ACCOUNTING_TRANS_TYPES.EXPENSE_PAYMENT ? 'Vendor Name' : 'Payee Name',
            field: 'payeeName',
            flex: 2,
            valueGetter: function (params) {
                return params.data.payeeName;
            },
        },
        {
            headerName: 'Payment Amount',
            field: 'paymentAmount',
            flex: 2,
            valueFormatter: currencyFormatter,
        },
        {
            headerName: 'Payment Type',
            field: 'paymentType',
            flex: 2,
            hide: currentClaimActivity.accountingTransTypeID !== ACCOUNTING_TRANS_TYPES.EXPENSE_PAYMENT,
            valueGetter: function (params) {
                if (params.data.paymentTypeCode === VENDOR_PAYMENT_TYPE_CODE.INTERM)
                    return "Iterm";
                if (params.data.paymentTypeCode === VENDOR_PAYMENT_TYPE_CODE.SUPPLEMENTAL)
                    return "Supplemental";
                if (params.data.paymentTypeCode === VENDOR_PAYMENT_TYPE_CODE.FINAL)
                    return "Final";
                return params.data.paymentTypeCode;
            },
        },
        {
            headerName: 'Financial Transaction Code',
            flex: 2,
            hide: request.claim.g2LegalEntityID === LEGAL_ENTITY.GENESIS_REINSURANCE ,
            field: 'transCodeDescription',
            cellRenderer: function (params) {
                try {
                    return params.data.transCode + ' - ' + params.data.accountingTransCode.transCodeDesc;
                } catch
                {
                    return "";
                }
            }
        },
        {
            hide: isViewer,
            headerName: '',
            flex: 1,
            valueGetter: function (params) {
                return "Edit";
            },
            onCellClicked: onRowEditSelected,
            cellRenderer: 'EditChildRenderer',

        },
        {
            hide: isViewer,
            headerName: '',
            flex: 1,
            valueGetter: function (params) {
                return "Remove";
            },
            onCellClicked: onDeleteRowSelected,
            cellRenderer: 'childMessageRenderer',

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
    function currencyFormatter(params) {
        if (params.value)
            return formatNumber(params.value);

    }
    function formatNumber(number) {
        //return number;
        let val = "$ " + (number).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
        if (val.split('.').length > 1) {
            if (val.split('.')[1].length > 1)
                return val;
            else if (val.split('.')[1].length === 1)
                return val + "0";
            if (val.split('.')[1].length === 0)
                return val + "00";
        } else
            return val + ".00";
    }

    function onDeleteRowSelected(e) {
        if (isViewer)
            return;

        const currentClaimActivity = request.currentClaimActivity || {};
        const currentPayment = currentClaimActivity.payments || {};
        const paymentVendors = currentPayment.paymentVendors || [];

        paymentVendors.filter(X => X.paymentVendorID === e.data.paymentVendorID)[0].isDeleted = true;
        currentPayment.paymentVendors = paymentVendors;

        //currentPayment.paymentVendors = paymentVendors.filter(X => X.paymentVendorID == e.data.paymentVendorID);

        if (currentPayment.paymentWires)
            if (currentPayment.paymentWires.length > 0)
                currentPayment.paymentWires[0].paymentVendorID = null;
        currentClaimActivity.payments = currentPayment;

        request.currentClaimActivity = currentClaimActivity;
        request.vendorReadOnlyMode = false;
        request.vendorKey = request.vendorKey + 2;
        request.updateVendorMode = false;
        request.enableVendorUI = true;

        dispatch({ type: 'UPDATE_UNIVERSAL_REQUEST', request: { ...request} });
        onPaymentClaimActivityDraft();

    }
    function onRowSelected(e) {

        //if (!isViewer)
        //    return;

        const currentClaimActivity = request.currentClaimActivity || {};
        const currentPayment = currentClaimActivity.payments || {};
        const paymentVendors = currentPayment.paymentVendors || [];


        request.currentVendor = paymentVendors.filter(X => X.paymentVendorID === e.data.paymentVendorID)[0];
        request.vendorReadOnlyMode = true;
        request.vendorKey = request.vendorKey + 2;
        request.updateVendorMode = false;
        request.enableVendorUI = false;
        dispatch({ type: 'UPDATE_UNIVERSAL_REQUEST', request: { ...request } });

    }
    function onRowEditSelected(e) {
        if (isViewer)
            return;
        request.currentVendor = e.data;

        request.vendorReadOnlyMode = false;
        request.vendorKey = request.vendorKey + 2;
        request.updateVendorMode = true;
        request.enableVendorUI = !request.currentVendor.vendorCode;
        dispatch({ type: 'UPDATE_UNIVERSAL_REQUEST', request: { ...request} });
    }

    function onGridReady(params) {
        gridAPI = params.api;
        columnAPI = params.columnAPI;
    }
    const frameworkComponents = {
        childMessageRenderer: DeleteChildRenderer,
        EditChildRenderer: EditChildRenderer
    };
    return (
        <div style={{ flex: 1 }}>
            <ContentRow>
                <ContentCell width="100%">
                    <GridContainer className="ag-theme-balham">
                        <AgGridReact
                            columnDefs={columnDefs}
                            defaultColDef={defaultColDef}
                            rowData={paymentVendors}
                            frameworkComponents={frameworkComponents}
                            rowSelection="multiple"
                            onRowClicked={onRowSelected}
                            suppressRowClickSelection={true}
                            onGridReady={onGridReady}
                            key={paymentVendors.length}
                        />
                    </GridContainer>
                </ContentCell>
            </ContentRow>
        </div>
    );
};