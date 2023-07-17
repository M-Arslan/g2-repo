import React from 'react';
import { ReimbursementInfoSection } from './ReimbursementInfoSection';
import { CompanyDollarInfoSection } from './CompanyDollars/CompanyDollarInfoSection'
import { PriorTPAPaidsInfoSection } from './PriorTPAPaids/PriorTPAPaidInfoSection'
import { AdjustmentsInfoSection } from './WCAdjustments/AdjustmentsInfoSection'
import { CalculationInfoSection } from './Calculation/CalculationInfoSection'
import { ReimbursementPaymentInfoSection } from './Activities/ReimbursementPayment/ReimbursementPaymentInfoSection'
export const InfoSectionSelector = ({ claim, request, dispatch, formValidator, onSave }) => {
    switch (request.selectedMenu) {
        case "REIMBURSEMENT":
            return <ReimbursementInfoSection claim={claim} request={request} dispatch={dispatch} formValidator={formValidator} onSave={onSave} />
            break;
        case "COMPANYDOLLAR":
            return <CompanyDollarInfoSection claim={claim} request={request} dispatch={dispatch} formValidator={formValidator} onSave={onSave} />
            break;
        case "PRIORTPA":
            return <PriorTPAPaidsInfoSection claim={claim} request={request} dispatch={dispatch} formValidator={formValidator} onSave={onSave} />
            break;
        case "ADJUSTMENTS":
            return <AdjustmentsInfoSection claim={claim} request={request} dispatch={dispatch} formValidator={formValidator} onSave={onSave} />
            break;
        case "CALCULATION":
            return <CalculationInfoSection claim={claim} request={request} dispatch={dispatch} formValidator={formValidator} onSave={onSave} />
            break;        
        case "REQUESTREIMBURSEMENTPAYMENT":
            return <ReimbursementPaymentInfoSection claim={claim} request={request} dispatch={dispatch} formValidator={formValidator} onSave={onSave} />
            break;
        default:
            return null;
    }
}
