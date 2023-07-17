import React from 'react';
import { PropertyInsuranceLossRegisterInfoSection } from './PropertyInsuranceLossRegisterInfoSection';
import { IssueLogsSection } from '../../Accounting/IssueLogsSection';
import { PriorActivityHistory } from '../../Accounting/PriorActivityHistory';



export const InfoSectionSelector = ({ claim, request, dispatch, formValidator, onSave }) => {
    switch (request.selectedMenu) {
        case "PILR":
            return <PropertyInsuranceLossRegisterInfoSection claim={claim} request={request} dispatch={dispatch} formValidator={formValidator} onSave={onSave} />
            break;
        case "ISSUELOG":
            return <IssueLogsSection claim={claim} request={request} dispatch={dispatch} />
            break;
        case "ACTIVITYHISTORY":
            return <PriorActivityHistory claim={claim} request={request} dispatch={dispatch} />
            break;
        default:
            return null;
    }
}




