import React from 'react';
import { ClaimantInfoSection } from './ClaimantInfoSection';
import { MedicareInfoSection } from './MedicareInfoSection';
import { AttorneyInfoSection } from './AttorneyInfoSection';
import { MedicarePaymentInfoSection } from './MedicarePaymentInfoSection';
import { FileCIBInfoSection } from './FileCIBInfoSection';
import { FILECIBTaskInfoSection } from './FILECIBTaskInfoSection';
import { CMSRejectedLogsSection } from './CMSRejectedLogsSection';
import { ICDCodeInfoSection } from './ICDCodeInfoSection';
import { IssueLogsSection } from '../../Accounting/IssueLogsSection';
import { PriorActivityHistory } from '../../Accounting/PriorActivityHistory';


export const InfoSectionSelector = ({ claim, request, dispatch, formValidator, onSave }) => {
    switch (request.selectedMenu) {
        case "CLAIMANT": 
            return <ClaimantInfoSection claim={claim} request={request} dispatch={dispatch} formValidator={formValidator} onSave={onSave}/>
            break;
        case "MEDICARE": 
            return <MedicareInfoSection claim={claim} request={request} dispatch={dispatch} formValidator={formValidator} onSave={onSave}  />
            break;
        case "TPOCPAYMENT": 
            return <MedicarePaymentInfoSection claim={claim} request={request} dispatch={dispatch} formValidator={formValidator} onSave={onSave} />
            break;
        case "ATTORNEY":
            return <AttorneyInfoSection claim={claim} request={request} dispatch={dispatch} formValidator={formValidator} onSave={onSave}/>
            break;
        case "FILECIB":
            return <FileCIBInfoSection claim={claim} request={request} dispatch={dispatch} formValidator={formValidator} onSave={onSave} />
            break;
        case "FILECIBTASK":
            return <FILECIBTaskInfoSection claim={claim} request={request} dispatch={dispatch} formValidator={formValidator} onSave={onSave} />
            break;
        case "ISSUELOG":
            return <IssueLogsSection claim={claim} request={request} dispatch={dispatch}   />
            break;
        case "CMSREJECTEDLOGS":
            return <CMSRejectedLogsSection claim={claim} request={request} dispatch={dispatch} formValidator={formValidator} onSave={onSave} />
            break;
        case "ICDCODE":
            return <ICDCodeInfoSection claim={claim} request={request} dispatch={dispatch} formValidator={formValidator} onSave={onSave} />
            break;
        case "ACTIVITYHISTORY":
            return <PriorActivityHistory claim={claim} request={request} dispatch={dispatch} />
            break;
        default:
            return null;
    }
}




