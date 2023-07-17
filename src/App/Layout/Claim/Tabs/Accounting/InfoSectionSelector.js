import React from 'react';
import { ActivityGeneralComments } from './ActivityGeneralComments';
import { ClaimFinancial } from './ClaimFinancial';
import { CloseClaimActivity } from './CloseClaimActivity/CloseClaimActivity';
import { FinancialInfoSection } from './FinancialInfoSection';
import { IssueLogsSection } from './IssueLogsSection';
import { MLASuppressionActivityInfoSection } from './MLASuppressionActivity/MLASuppressionActivityInfoSection';
import { GenesisMLAActivityInfoSection } from './GenesisMLAActivity/GenesisMLAActivity';
import { WCTabularUpdateActivityInfoSection } from './WCTabularUpdateActivity/WCTabularUpdateActivityInfoSection';
import { OpenClaimActivityInfoSection } from './OpenClaimActivity/OpenClaimActivityInfoSection';
import { PaymentActivityInfoSection } from './PaymentClaimActivity/PaymentActivityInfoSection';
import { VendorInfoSection } from './PaymentClaimActivity/VendorInfoSection';
import { WirePaymentInfoSection } from './PaymentClaimActivity/WirePaymentInfoSection';
import { PriorActivityHistory } from './PriorActivityHistory';
import { PriorClaimInfoSection } from './PriorClaimInfoSection';
import { QAUISection } from './QAUISection';
import { ReopenActivityInfoSection } from './ReopenActivity/ReopenActivityInfoSection';
import { ReserveChangeActivityInfoSection } from './ReserveChangeActivity/ReserveChangeActivityInfoSection';
import { SpecialInstructionsActivityInfoSection } from './SpecialInstructionsActivity/SpecialInstructionsActivityInfoSection';

export const InfoSectionSelector = ({ claim, request, dispatch, formValidator, onSave, onPaymentClaimActivityDraft, onPaymentClaimActivityCompleted, db2Claim, financialDB2, lossExpenseReserve, currentUser}) => {

    switch (request.selectedMenu) {
        case "FINANCIAL":
        case "INITIALRINOTICE":
        case "DEDUCTIBLECOLLECTION":
            return <FinancialInfoSection request={request} dispatch={dispatch} formValidator={formValidator} onSave={onSave} />
            break;
        case "PRIORCLAIMACTIVITY":
            return <PriorClaimInfoSection request={request} dispatch={dispatch} />
            break;
        case "CLAIMFINANCIAL":
            return <ClaimFinancial claim={claim} request={request} dispatch={dispatch} db2Claim={db2Claim} financialDB2={financialDB2} lossExpenseReserve={lossExpenseReserve}/>
            break;
        case "OPENCLAIMACTIVTY":
            return <OpenClaimActivityInfoSection claim={claim} request={request} dispatch={dispatch} formValidator={formValidator} onSave={onSave} />
            break;
        case "CLOSECLAIMACTIVITY":
            return <CloseClaimActivity claim={claim} request={request} dispatch={dispatch} formValidator={formValidator} onSave={onSave} db2Claim={db2Claim} lossExpenseReserve={lossExpenseReserve}/>
            break;
        case "MLASUPPRESSIONCLAIMACTIVTY":
            return <MLASuppressionActivityInfoSection claim={claim} request={request} dispatch={dispatch} formValidator={formValidator} onSave={onSave} />
            break;
        case "EXPENSEPAYMENTCLAIMACTIVITY":
            return <PaymentActivityInfoSection claim={claim} request={request} dispatch={dispatch} formValidator={formValidator} onSave={onSave} onPaymentClaimActivityDraft={onPaymentClaimActivityDraft} lossExpenseReserve={lossExpenseReserve}/>
            break;
        case "VENDORDETAILS":
            return <VendorInfoSection claim={claim} request={request} dispatch={dispatch} formValidator={formValidator} onSave={onSave} onPaymentClaimActivityDraft={onPaymentClaimActivityDraft} db2Claim={db2Claim} lossExpenseReserve={lossExpenseReserve}/>
            break;
        case "WIREPAYMENTDETAILS":
            return <WirePaymentInfoSection claim={claim} request={request} dispatch={dispatch} formValidator={formValidator} onSave={onSave} />
            break;
        case "SPECIALINSTRUCTIONSACTIVTY":
            return <SpecialInstructionsActivityInfoSection claim={claim} request={request} dispatch={dispatch} formValidator={formValidator} onSave={onSave} />
            break;
        case "REOPENACTIVTY":
            return <ReopenActivityInfoSection claim={claim} request={request} dispatch={dispatch} formValidator={formValidator} onSave={onSave} db2Claim={db2Claim} lossExpenseReserve={lossExpenseReserve}/>
            break;
        case "RESERVECHANGEACTIVTY":
            return <ReserveChangeActivityInfoSection claim={claim} request={request} dispatch={dispatch} formValidator={formValidator} onSave={onSave} lossExpenseReserve={lossExpenseReserve}/>
            break;
        case "ISSUELOG":
            return <IssueLogsSection claim={claim} request={request} dispatch={dispatch}/>
            break;
        case "QAUI":
            return <QAUISection claim={claim} request={request} dispatch={dispatch} onPaymentClaimActivityCompleted={onPaymentClaimActivityCompleted}/>
            break;
        case "ACTIVITYHISTORY":
            return <PriorActivityHistory claim={claim} request={request} dispatch={dispatch}  />
            break;
        case "GENERALCOMMENTS":
            return <ActivityGeneralComments claim={claim} request={request} dispatch={dispatch} />
            break;
        case "GENESISMLA":
            return <GenesisMLAActivityInfoSection claim={claim} request={request} dispatch={dispatch} formValidator={formValidator} onSave={onSave} lossExpenseReserve={lossExpenseReserve} currentUser={currentUser}/>;
        case "WCTABULARUPDATECLAIMACTIVITY":
            return <WCTabularUpdateActivityInfoSection claim={claim} request={request} dispatch={dispatch} formValidator={formValidator} onSave={onSave} lossExpenseReserve={lossExpenseReserve} />
            break;
        default:
            return null;
    }
}




