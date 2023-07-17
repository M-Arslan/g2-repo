


import React from 'react';
import {
    AgGridReact
} from 'ag-grid-react';
import styled from 'styled-components';
import {
    ButtonCellRenderer
} from './ButtonCellRenderer';
import {
    ensureIsNumber,
    ensureNonEmptyString,
    ensureNonNullObject
} from '../../../Core/Utility/rules';
import {
    safeObj
} from '../../../Core/Utility/safeObject';

const GridContainer = styled.div`
    height: 100%;
    width: 100%;
    padding: 0;
    margin: 0;
    border: 0;
`;

export const DATA_FORMATTERS = Object.freeze({
    /**
     * Formats a phone number string as (XXX) XXX-XXXX ext.111
     * @param {string} phoneNumberString
     */
    PhoneNumber: (phoneNumberString) => {

        if (ensureNonEmptyString(phoneNumberString) !== true) {
            return phoneNumberString;
        }

        const segments = phoneNumberString.split('x');

        let cleaned = segments[0].replace(/\D/g, '');
        cleaned = (cleaned.length > 10 && cleaned.startsWith('1') ? cleaned.substr(1) : cleaned);
        
        var match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);

        if (match) {
            return `(${match[1]}) ${match[2]}-${match[3]}${segments.length > 1 ? ` ext. ${segments[1].replace(/\D/g, '')}` : ''}`;
        }

        return phoneNumberString;
    },
    /**
     * Formats currency values
     * @param {string|number} val
     */
    Currency: (val) => {
        const number = (ensureIsNumber(val) ? val : parseInt(val));
        return (ensureIsNumber(number) ? `${Math.floor(number)}`.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') : '');
    }
});

/**
 * Shortcut functionality for building AG Grid column defs
 * @class
 */
export class ColumnBuilder {
    /**
     * Creates a new instance of the ColumnBuilder class.
     * @constructor
     */
    constructor() {
        this._columns = new Map();
    }

    /**
     * Adds a column to the column defs
     * @param {string} field
     * @param {string} header
     * @param {number} [flex=1]
     * @param {Function} [customGetter] - additional value getter logic
     * @returns {ColumnBuilder} - fluent interface
     */
    addColumn(field, header, flex = 1, customGetter, sortDirection = null) {
        const colDef = {
            headerName: (ensureNonEmptyString(header) ? header : field.toUpperCase()),
            flex: (isNaN(flex) === true ? 1 : flex),
            field,
            valueGetter: function (params) {
                return (typeof customGetter === 'function' ? customGetter(params) : (params.data[field] || ''));
            }
        };

        if (ensureNonEmptyString(sortDirection) && (sortDirection === 'desc' || sortDirection === 'asc')) {
            colDef.sort = sortDirection;
        }

        this._columns.set(field, colDef);

        return this;
    }

    /**
     * Advanced configuration for previously added columns 
     * @param {string} field the field name
     * @param {object} options configuration options for the column definition
     * @returns {ColumnBuilder} fluent interface
     */
    configureColumn(field, options = {}) {
        if (this._columns.has(field)) {
            const cd = this._columns.get(field);
            if (ensureNonNullObject(cd)) {
                this._columns.set(field, { ...cd, ...safeObj(options) });
            }
        }
        else {
            console.warn('[ColumnBuilder] attempting to configure a field that has not been added');
        }

        return this;
    }

    /**
     * Adds a button column to the column defs
     * @param {string} field - field of data to pass to the click handler
     * @param {any} icon - the button icon
     * @param {Function} onClick - button click handler
     * @returns {ColumnBuilder} - fluent interface
     */
    addButtonColumn(field, icon, onClick, isDisabled = false) {
        this._columns.set(field, {
            field,
            cellRenderer: 'btnCellRenderer',
            cellRendererParams: {
                clicked: function (f) {
                    if (typeof onClick === 'function') {
                        onClick(f);
                    }
                },
                icon,
                isDisabled,
            },
            width: 64,
            headerName: ' ',
            resizable: false,
            sortable: false,
        });

        return this;
    }

    /**
     * Outputs array of column def objects ready for use by AG Grid
     */
    build() {
        return [...this._columns.values()];
    }
}

/**
 * DataGrid wraps the creation of an AG Grid to reduce boilerplate code.
 * @param {any} props - component properties
 * @returns {React.Component}
 */
export const DataGrid = ({ columnDefs, rowData, onRowClick, extraFrameworkComponents = {}, pageSize = 0, options = {} }) => {

    const defaultColDef = {
        cellClass: 'cell-wrap-text',
        cellStyle: { 'whiteSpace': 'normal' },
        autoHeight: isNaN(safeObj(options).rowHeight),
        sortable: true,
        resizable: true,
        filter: true,
    };

    async function onRowClicked(row) {
        if (typeof onRowClick === 'function') {
            await onRowClick(row);
        }
    }

    return (
        <GridContainer className="ag-theme-balham">
            <AgGridReact
                columnDefs={columnDefs}
                defaultColDef={defaultColDef}
                rowData={(Array.isArray(rowData) ? rowData : [])}
                onRowClicked={onRowClicked}
                pagination={(isNaN(pageSize) === false && pageSize > 0)}
                paginationPageSize={pageSize}
                frameworkComponents={{
                    btnCellRenderer: ButtonCellRenderer,
                    ...safeObj(extraFrameworkComponents)
                }}
                style={{ height: '100%', width: '100%', padding: '0' }}
                gridOptions={safeObj(options)}
                
            />
        </GridContainer>
    );
};