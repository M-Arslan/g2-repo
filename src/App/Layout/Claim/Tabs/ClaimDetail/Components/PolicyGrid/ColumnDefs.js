import {
    DATA_FORMATTERS,
    ColumnBuilder
} from '../../../../../Common/Components/DataGrid';

const getExcess = () => {
    return (new ColumnBuilder()).addColumn('coverageCode', 'Coverage', 1)
        .addColumn('className', 'Class', 2)
        .addColumn('formOfCoverageCode', 'Form of Coverage', 2)
        .addColumn('attachmentTypeCode', 'Attach Type', 3)
        .addColumn('uLLimit', 'UL Limit', 2, params => DATA_FORMATTERS.Currency(params.data.uLLimit))
        .addColumn('perOccuranceLimit', 'Per Occurrence Limit', 2, params => DATA_FORMATTERS.Currency(params.data.perOccuranceLimit))
        .addColumn('aggregateLimit', 'Aggregate Limit', 2, params => DATA_FORMATTERS.Currency(params.data.aggregateLimit))
        .build();
};

const getFacilitiesPgm = () => {
    return (new ColumnBuilder()).addColumn('coverageCode', 'Coverage', 1)
        .addColumn('className', 'Class', 2)
        .addColumn('formOfCoverageCode', 'Form of Coverage', 2)
        .addColumn('attachmentTypeCode', 'Attach Type', 3)
        .addColumn('perOccuranceLimit', 'Per Occurrence Limit', 2, params => DATA_FORMATTERS.Currency(params.data.perOccuranceLimit))
        .addColumn('aggregateLimit', 'Aggregate Limit', 2, params => DATA_FORMATTERS.Currency(params.data.aggregateLimit))
        .build();
};

const getFacilities = () => {
    return (new ColumnBuilder()).addColumn('coverageCode', 'Coverage', 1)
        .addColumn('className', 'Class', 2)
        .addColumn('formOfCoverageCode', 'Form of Coverage', 2)
        .addColumn('attachmentTypeCode', 'Attach Type', 3)
        .addColumn('perOccuranceLimit', 'Per Occurrence Limit', 2, params => DATA_FORMATTERS.Currency(params.data.perOccuranceLimit))
        .addColumn('aggregateLimit', 'Aggregate Limit', 2, params => DATA_FORMATTERS.Currency(params.data.aggregateLimit))
        .build();
};

const getMedicalProf = () => {
    return (new ColumnBuilder()).addColumn('coverageCode', 'Coverage', 1)
        .addColumn('className', 'Class', 2)
        .addColumn('formOfCoverageCode', 'Form of Coverage', 2)
        .addColumn('attachmentTypeCode', 'Attach Type', 3)
        .addColumn('perOccuranceLimit', 'Per Occurrence Limit', 2, params => DATA_FORMATTERS.Currency(params.data.perOccuranceLimit))
        .addColumn('aggregateLimit', 'Aggregate Limit', 2, params => DATA_FORMATTERS.Currency(params.data.aggregateLimit))
        .build();
};

const getPrimary = () => {
    return (new ColumnBuilder()).addColumn('coverageCode', 'Coverage', 1)
        .addColumn('className', 'Class', 2)
        .addColumn('formOfCoverageCode', 'Form of Coverage', 2)
        .addColumn('attachmentTypeCode', 'Attach Type', 3)
        .addColumn('casualtyDeductible', 'Casualty Deductible', 2, params => DATA_FORMATTERS.Currency(params.data.casualtyDeductible))
        .addColumn('perOccuranceLimit', 'Per Occurrence Limit', 2, params => DATA_FORMATTERS.Currency(params.data.perOccuranceLimit))
        .addColumn('aggregateLimit', 'Aggregate Limit', 2, params => DATA_FORMATTERS.Currency(params.data.aggregateLimit))
        .build();
};

const getProperty = () => {
    return (new ColumnBuilder()).addColumn('coverageCode', 'Coverage', 1)
        .addColumn('className', 'Class', 2)
        .addColumn('formOfCoverageCode', 'Form of Coverage', 2)
        .addColumn('attachmentTypeCode', 'Attach Type', 3)
        .addColumn('propertyDeductible', 'Property Deductible', 2, params => DATA_FORMATTERS.Currency(params.data.propertyDeductible))
        .addColumn('perOccuranceLimit', 'Per Occurrence Limit', 2, params => DATA_FORMATTERS.Currency(params.data.perOccuranceLimit))
        .build();
};


/**
 * Gets the column definition for the policy codings grid based on the supplied department
 * @param {number} dept
 * @returns {Array<object>|null}
 */
export function getColumnDefs(dept) {
    switch (dept) {
        case 1: //Excess
            return getExcess();
        case 2: //Property
            return getProperty();
        case 3: //Primary
            return getPrimary();
        case 4: //Facilities
            return getFacilities();
        case 6: //Medical Prof
            return getMedicalProf();
        case 7: //Facilities PGM
            return getFacilitiesPgm();
        default:
            return null;
    }
}