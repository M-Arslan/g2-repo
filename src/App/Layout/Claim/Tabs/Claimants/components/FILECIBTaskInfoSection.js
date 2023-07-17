import { Divider, MenuItem } from '@mui/material';
import React from 'react';
import styled from 'styled-components';
import { formatDate, Panel, PanelContent, PanelHeader, SelectList, TextInput } from '../../../../../Core/Forms/Common';
import { customGQLQuery, getCIBLossTypes, getCompanies, getG2Companies, getRiskStates, loadUsers } from '../../../../../Core/Services/EntityGateway';
import { loadActionLogForFinancialActivityLog } from '../../../../ActionLog/Queries';
import { LEGAL_ENTITY } from '../../../../../Core/Enumerations/app/legal-entity';

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
    justify-content: flex-start;
    align-items: center;
    align-content: center;
    padding: 1em;
`;

export const FILECIBTaskInfoSection = ({ request, dispatch, formValidator, claim, onSave }) => {
    const currentClaimant = request.currentClaimant || {};
    const claimantCIB = request.currentClaimant.cIB || {};
    const [actionLog, setActionLog] = React.useState([]);
    const [currentClaimActivity,setCurrentClaimActivity] = React.useState(request.currentClaimActivity || {});
    const ClaimPolicy = claim.policy  || claim.claimPolicy;
    const [riskStates, setRiskStates] = React.useState([]);
    const [cIBLossTypes, setCIBLossTypes] = React.useState([]);
    const [statusTypes, setStatusTypes] = React.useState([]);
    const [g2Company, setG2Company] = React.useState([]);
    const [Company, setCompany] = React.useState([]);
    const [users, setUsers] = React.useState([]);

    const acronym_name = (str) => {
        if (str) {
            var regular_ex = /\b(\w)/g;
            var matches = str.match(regular_ex);
            var acronym = matches.join('');
            return acronym;
        }
        return '';
    }

    const claimCoverageValue = (value) => {
        switch (value) {
            case 'LBI':
                return "Liability Bodily Injury";
            case 'OBI':
                return "Other Bodily Injury";
            case 'PBI':
                return "Pollution Bodily Injury";
            case 'PCO':
                return "Products and Completed Operation";
            case 'EOBI':
                return "Errors and Omission Bodily Injury"
            default:
                return '';
        }
    } 

    const getFullName = () => {
        return (currentClaimant.firstName || '' ) + ' ' + ( currentClaimant.middleName || '' ) + ' ' + (currentClaimant.lastName || '');
    }

    
        const loadStatusTypes = async () => {
            let query = {
                query: `
                query { 
                    claimStatusTypesByPID { 
                        claimStatusTypeID
                        claimProcessIndicatorID
                        statusText
                    }
                }
            `,
            }

            const result = await customGQLQuery(`claims-common`, query);
            if (typeof result.data === 'object' && result.data !== null) {
                setStatusTypes(result.data.claimStatusTypesByPID);
            }
        }

    React.useEffect(() => {
            setCurrentClaimActivity(request.currentClaimActivity);
            loadStatusTypes();
            Promise.all([
                getRiskStates(),
                getCIBLossTypes(),
                getCompanies(),
                getG2Companies(),
                loadUsers(),
                loadActionLogForFinancialActivityLog(claim.claimMasterID, currentClaimActivity.activityID),
            ]).then(([rs, ci, co, g2,users,alog]) => {
                setRiskStates(rs || []);
                setCIBLossTypes(ci || []);
                setCompany(co || []);
                setG2Company(g2 || []);
                setUsers((users.data || {}).users);
                setActionLog((alog.data || {}).latestActionLog);
            })

    }, [request]);

        return (
            <Panel>
                <PanelHeader><span style={{ fontWeight: 'bold', fontSize: '14px' }}>CIB Task Details</span></PanelHeader>
                <PanelContent>
                    <ContentRow>
                        <ContentCell width="33%">
                            <TextInput
                                disabled={true}
                                InputProps={{ readOnly: true }}
                                label="Activity Type"
                                fullWidth={true}
                                variant="outlined"
                                value={((currentClaimActivity || {}).accountingTransType || {}).accountingTransTypeText || (currentClaimActivity || {}).accountingTransTypeText}
                            />
                        </ContentCell>
                        <ContentCell width="33%">
                            <TextInput
                                disabled={true}
                                InputProps={{ readOnly: true }}
                                label="Status"
                                fullWidth={true}
                                variant="outlined"
                                value={((currentClaimActivity || {}).claimStatusTypeType || {}).statusText || "Not Submitted"}
                            />
                        </ContentCell>
                        <ContentCell width="33%">
                            <TextInput
                                disabled={true}
                                InputProps={{ readOnly: true }}
                                label="Status Date"
                                fullWidth={true}
                                variant="outlined"
                                value={formatDate((actionLog || {}).createdDate) || ''}
                            />
                        </ContentCell>
                    </ContentRow>
                    <ContentRow>
                        <ContentCell width="33%">
                            <TextInput
                                disabled={true}
                                InputProps={{ readOnly: true }}
                                label="Requested By"
                                fullWidth={true}
                                variant="outlined"
                                value={((users?.filter(x => x.userID.toLowerCase() === ((currentClaimActivity || {}).createdBy || "").toLowerCase())[0] || {}).fullName) || ' '}
                            />
                        </ContentCell>
                        <ContentCell width="33%">
                            <TextInput
                                disabled={true}
                                InputProps={{ readOnly: true }}
                                label="Requested Date"
                                fullWidth={true}
                                variant="outlined"
                                value={formatDate((currentClaimActivity || {}).createdDate)}
                            />
                        </ContentCell>
                    </ContentRow>
                    <Divider />
                    <ContentRow>
                        <ContentCell width="33%">
                            <SelectList
                                disabled={true}
                                InputProps={{ readOnly: true }}
                                id="cIBTypeCode"
                                name="cIBTypeCode"
                                label="Initial or Reindex"
                                fullWidth={true}
                                variant="outlined"
                                value={claimantCIB.cIBTypeCode || ""}
                            >
                                <MenuItem value="I">Initial</MenuItem>
                                <MenuItem value="R">Reindex</MenuItem>
                            </SelectList>
                        </ContentCell>
                    </ContentRow>
                    <ContentRow>
                        <ContentCell width="33%">
                            <TextInput
                                disabled={true}
                                label="Claim Number"
                                InputProps={{ readOnly: true }}
                                id="claimID"
                                name="claimID"
                                fullWidth={true}
                                variant="outlined"
                                value={claim.claimID}
                            />
                        </ContentCell>
                        <ContentCell width="33%">
                            <TextInput
                                disabled={true}
                                label="Date of loss"
                                InputProps={{ readOnly: true }}
                                id="dOL"
                                name="dOL"
                                fullWidth={true}
                                variant="outlined"
                                value={formatDate(claim.dOL)}
                            />
                        </ContentCell>
                        <ContentCell width="33%">
                            <TextInput
                                disabled={true}
                                label="Policy Number"
                                InputProps={{ readOnly: true }}
                                id="policyID"
                                name="policyID"
                                fullWidth={true}
                                variant="outlined"
                                value={!claim.claimPolicy ? claim.claimPolicyID : claim.claimPolicy.policyID}
                            />
                        </ContentCell>

                    </ContentRow>
                    <Divider />

                    <ContentRow>
                        <ContentCell width="33%">
                            <span style={{ fontWeight: 'bold' }}>Basic Information </span>
                        </ContentCell>
                    </ContentRow>

                    <ContentRow>
                        <ContentCell width="33%">
                            <TextInput
                                disabled={true}
                                label="Policy Type"
                                InputProps={{ readOnly: true }}
                                id="policyType"
                                name="policyType"
                                fullWidth={true}
                                variant="outlined"
                                value={(claim || {}).g2LegalEntityID === LEGAL_ENTITY.GENERAL_STAR  ? 'Commercial General Liability' : ' '}
                            />
                        </ContentCell>
                        <ContentCell width="33%">
                            
                            <TextInput
                                disabled={true}
                                label="Loss State"
                                InputProps={{ readOnly: true }}
                                id="lossLocation"
                                name="lossLocation"
                                fullWidth={true}
                                variant="outlined"
                                value={(riskStates.filter((state) => state.riskStateID === parseInt(claim.lossLocation))[0] || {}).stateName || ' '}
                            />
                        </ContentCell>
                        <ContentCell width="33%">
                            <TextInput
                                disabled={true}
                                label="Loss Description"
                                InputProps={{ readOnly: true }}
                                id="lossDesc"
                                name="lossDesc"
                                fullWidth={true}
                                variant="outlined"
                                value={(claim || {}).lossDesc}
                            />
                        </ContentCell>
                    </ContentRow>
                    <Divider />

                    <ContentRow>
                        <ContentCell width="33%">
                            <span style={{ fontWeight: 'bold' }}>Involved Party Information - Insured </span>
                        </ContentCell>
                    </ContentRow>

                    <ContentRow>
                        <ContentCell width="33%">
                            <TextInput
                                disabled={true}
                                label="Role"
                                InputProps={{ readOnly: true }}
                                id="claimID"
                                name="claimID"
                                fullWidth={true}
                                value={"Inusred"}
                                variant="outlined"
                            />
                        </ContentCell>
                        <ContentCell width="33%">
                            <TextInput
                                disabled={true}
                                label="Insured"
                                InputProps={{ readOnly: true }}
                                id="insuredName"
                                name="insuredName"
                                fullWidth={true}
                                variant="outlined"
                                value={(ClaimPolicy || {}).insuredName}
                            />
                        </ContentCell>
                        <ContentCell width="33%">
                            <TextInput
                                disabled={true}
                                label="Insured Street"
                                InputProps={{ readOnly: true }}
                                id="insuredStreet"
                                name="insuredStreet"
                                fullWidth={true}
                                variant="outlined"
                                value={(claimantCIB || {}).insuredStreet}
                            />
                        </ContentCell>
                    </ContentRow>

                    <ContentRow>
                        <ContentCell width="33%">
                            <TextInput
                                disabled={true}
                                label="Insured City"
                                InputProps={{ readOnly: true }}
                                id="insuredCity"
                                name="insuredCity"
                                fullWidth={true}
                                variant="outlined"
                                value={(claimantCIB || {}).insuredCity}
                            />


                        </ContentCell>

                        <ContentCell width="33%">
                            <TextInput
                                disabled={true}
                                label="Insured State"
                                InputProps={{ readOnly: true }}
                                id="insuredState"
                                name="insuredState"
                                fullWidth={true}
                                variant="outlined"
                                value={(claimantCIB || {}).insuredState}
                            />
                        </ContentCell>

                        <ContentCell width="33%">
                            <TextInput
                                disabled={true}
                                label="Insured Zip"
                                InputProps={{ readOnly: true }}
                                id="insuredZip"
                                name="insuredZip"
                                fullWidth={true}
                                variant="outlined"
                                value={(claimantCIB || {}).insuredZip}
                            />
                        </ContentCell>
                    </ContentRow>


                    <Divider />

                    <ContentRow>
                        <ContentCell width="33%">
                            <span style={{ fontWeight: 'bold' }}>Involved Party Information - Claimant </span>
                        </ContentCell>
                    </ContentRow>

                    <ContentRow>
                        <ContentCell width="33%">
                            <TextInput
                                disabled={true}
                                label="Claimant Full Name"
                                InputProps={{ readOnly: true }}
                                id="claimID"
                                name="claimID"
                                fullWidth={true}
                                variant="outlined"
                                value={getFullName()}
                            />
                        </ContentCell>
                    </ContentRow>


                    <ContentRow>
                        <ContentCell width="33%">
                            <TextInput
                                disabled={true}
                                label="Claimant First Name"
                                InputProps={{ readOnly: true }}
                                id="firstName"
                                name="firstName"
                                fullWidth={true}
                                variant="outlined"
                                value={(currentClaimant || {}).firstName}
                            />
                        </ContentCell>
                        <ContentCell width="33%">
                            <TextInput
                                disabled={true}
                                label="Claimant Last Name"
                                InputProps={{ readOnly: true }}
                                id="lastName"
                                name="lastName"
                                fullWidth={true}
                                variant="outlined"
                                value={(currentClaimant || {}).lastName}
                            />
                        </ContentCell>
                        <ContentCell width="33%">
                            <TextInput
                                disabled={true}
                                label="Claimant Middle Initial"
                                InputProps={{ readOnly: true }}
                                id="claimID"
                                name="claimID"
                                fullWidth={true}
                                variant="outlined"
                                value={acronym_name(currentClaimant.middleName)}
                            />
                        </ContentCell>
                    </ContentRow>

                    <ContentRow>

                        <ContentCell width="33%">
                            <TextInput
                                disabled={true}
                                label="Claimant Address Street1"
                                InputProps={{ readOnly: true }}
                                id="addressStreet1"
                                name="addressStreet1"
                                fullWidth={true}
                                variant="outlined"
                                value={(currentClaimant || {}).addressStreet1}
                            />
                        </ContentCell>
                        <ContentCell width="33%">
                            <TextInput
                                disabled={true}
                                label="Claimant Address Street2"
                                InputProps={{ readOnly: true }}
                                id="addressStreet2"
                                name="addressStreet2"
                                fullWidth={true}
                                variant="outlined"
                                value={(currentClaimant || {}).addressStreet2}
                            />
                        </ContentCell>
                        <ContentCell width="33%">
                            <TextInput
                                disabled={true}
                                label="Claimant Address City"
                                InputProps={{ readOnly: true }}
                                id="addressCity"
                                name="addressCity"
                                fullWidth={true}
                                variant="outlined"
                                value={(currentClaimant || {}).addressCity}
                            />
                        </ContentCell>
                    </ContentRow>
                    <ContentRow>
                        <ContentCell width="33%">
                            <TextInput
                                disabled={true}
                                label="Claimant Address State"
                                InputProps={{ readOnly: true }}
                                id="addressState"
                                name="addressState"
                                fullWidth={true}
                                variant="outlined"
                                value={(currentClaimant || {}).addressState}
                            />
                        </ContentCell>
                        <ContentCell width="33%">
                            <TextInput
                                disabled={true}
                                label="Claimant Address Zip"
                                InputProps={{ readOnly: true }}
                                id="addressZIP"
                                name="addressZIP"
                                fullWidth={true}
                                variant="outlined"
                                value={(currentClaimant || {}).addressZIP}
                            />

                        </ContentCell>
                    </ContentRow>
                    <ContentRow>
                        <ContentCell width="33%">
                            <TextInput
                                disabled={true}
                                label="Date Of Birth"
                                InputProps={{ readOnly: true }}
                                id="dOB"
                                name="dOB"
                                fullWidth={true}
                                variant="outlined"
                                value={formatDate((currentClaimant || {}).dateOfBirth)}
                            />
                        </ContentCell>
                        <ContentCell width="33%">
                            <TextInput
                                disabled={true}
                                label="Social Security Number"
                                InputProps={{ readOnly: true }}
                                id="ssn"
                                name="ssn"
                                fullWidth={true}
                                variant="outlined"
                                value={(currentClaimant || {}).sSN}
                            />
                        </ContentCell>
                    </ContentRow>
                    <ContentRow>
                        <ContentCell width="33%">
                            <TextInput
                                disabled={true}
                                label="Occupation"
                                InputProps={{ readOnly: true }}
                                id="claimID"
                                name="claimID"
                                fullWidth={true}
                                variant="outlined"
                                value={(currentClaimant || {}).occupation}
                            />
                        </ContentCell>
                        <ContentCell width="33%">
                            <TextInput
                                disabled={true}
                                label="Claimant Former Street"
                                InputProps={{ readOnly: true }}
                                id="claimID"
                                name="claimID"
                                fullWidth={true}
                                variant="outlined"
                                value={(claimantCIB || {}).claimantFormerStreet}
                            />
                        </ContentCell>


                        <ContentCell width="33%">
                            <TextInput
                                disabled={true}
                                label="Claimant Former City"
                                InputProps={{ readOnly: true }}
                                id="claimID"
                                name="claimID"
                                fullWidth={true}
                                variant="outlined"
                                value={(claimantCIB || {}).claimantFormerCity}
                            />

                        </ContentCell>
                    </ContentRow>

                    <ContentRow>
                        <ContentCell width="33%">
                            <TextInput
                                disabled={true}
                                label="Claimant Former State"
                                InputProps={{ readOnly: true }}
                                id="claimID"
                                name="claimID"
                                fullWidth={true}
                                variant="outlined"
                                value={(claimantCIB || {}).claimantFormerState}
                            />
                        </ContentCell>
                        <ContentCell width="33%">
                            <TextInput
                                disabled={true}
                                label="Claimant Former Zip"
                                InputProps={{ readOnly: true }}
                                id="claimID"
                                name="claimID"
                                fullWidth={true}
                                variant="outlined"
                                value={(claimantCIB || {}).claimantFormerZip}
                            />
                        </ContentCell>

                    </ContentRow>
                    <ContentRow>
                        <ContentCell width="66%">
                            <TextInput
                                disabled={true}
                                label="Husband Or Wife,Former Names,Parents Of Minors,Aliases"
                                InputProps={{ readOnly: true }}
                                id="claimID"
                                name="claimID"
                                fullWidth={true}
                                variant="outlined"
                                value={(claimantCIB || {}).husbandWifeAllias}
                            />
                        </ContentCell>
                    </ContentRow>
                    <Divider />
                    <ContentRow>
                        <ContentCell width="66%">
                            <TextInput
                                disabled={true}
                                label="Doctor's Name"
                                InputProps={{ readOnly: true }}
                                id="claimID"
                                name="claimID"
                                fullWidth={true}
                                variant="outlined"
                                value={(claimantCIB || {}).claimantDoctorName}
                            />
                        </ContentCell>
                    </ContentRow>

                    <ContentRow>
                        <ContentCell width="33%">
                            <TextInput
                                disabled={true}
                                label="Claimant Doctor City"
                                InputProps={{ readOnly: true }}
                                id="claimID"
                                name="claimID"
                                fullWidth={true}
                                variant="outlined"
                                value={(claimantCIB || {}).claimantDoctorCity}
                            />
                        </ContentCell>

                        <ContentCell width="33%">
                            <TextInput
                                disabled={true}
                                label="Claimant Doctor State"
                                InputProps={{ readOnly: true }}
                                id="claimID"
                                name="claimID"
                                fullWidth={true}
                                variant="outlined"
                                value={(claimantCIB || {}).claimantDoctorState}
                            />
                        </ContentCell>

                    </ContentRow>


                    <Divider />
                    <ContentRow>
                        <ContentCell width="66%">
                            <TextInput
                                disabled={true}
                                label="Claimant Attorney Name"
                                InputProps={{ readOnly: true }}
                                id="claimID"
                                name="claimID"
                                fullWidth={true}
                                variant="outlined"
                                value={(claimantCIB || {}).claimantAttorneyName}
                            />
                        </ContentCell>
                    </ContentRow>

                    <ContentRow>
                        <ContentCell width="33%">
                            <TextInput
                                disabled={true}
                                label="Claimant Attorney Street"
                                InputProps={{ readOnly: true }}
                                id="claimID"
                                name="claimID"
                                fullWidth={true}
                                variant="outlined"
                                value={(claimantCIB || {}).claimantAttorneyStreet}
                            />
                        </ContentCell>
                        <ContentCell width="33%">
                            <TextInput
                                disabled={true}
                                label="Claimant Attorney City"
                                InputProps={{ readOnly: true }}
                                id="claimID"
                                name="claimID"
                                fullWidth={true}
                                variant="outlined"
                                value={(claimantCIB || {}).claimantAttorneyCity}
                            />

                        </ContentCell>
                    </ContentRow>

                    <ContentRow>
                        <ContentCell width="33%">
                            <TextInput
                                disabled={true}
                                label="Claimant Attorney State"
                                InputProps={{ readOnly: true }}
                                id="claimID"
                                name="claimID"
                                fullWidth={true}
                                variant="outlined"
                                value={(claimantCIB || {}).claimantAttorneyState}
                            />

                        </ContentCell>
                        <ContentCell width="33%">
                            <TextInput
                                disabled={true}
                                label="Claimant Attorney Zip"
                                InputProps={{ readOnly: true }}
                                id="claimID"
                                name="claimID"
                                fullWidth={true}
                                variant="outlined"
                                value={(claimantCIB || {}).claimantAttorneyZip}
                            />

                        </ContentCell>

                    </ContentRow>

                    <Divider />

                    <ContentRow>
                        <ContentCell width="33%">
                            <span style={{ fontWeight: 'bold' }}>Coverage Information</span>
                        </ContentCell>
                    </ContentRow>

                    <ContentRow>
                        <ContentCell width="33%">
                            <TextInput
                                disabled={true}
                                label="Type of Claim/Coverage"
                                InputProps={{ readOnly: true }}
                                id="claimCoverageTypeCode"
                                name="claimCoverageTypeCode"
                                fullWidth={true}
                                variant="outlined"
                                value={claimCoverageValue(claimantCIB.claimCoverageTypeCode)}
                            />
                        </ContentCell>
                    </ContentRow>

                    <Divider />
                    <ContentRow>
                        <ContentCell width="33%">
                            <span style={{ fontWeight: 'bold' }}>GENERAL CASUALTY INFORMATION </span>
                        </ContentCell>
                    </ContentRow>

                    <ContentRow>
                        <ContentCell width="33%">
                            <TextInput
                                disabled={true}
                                label="Alleged Injuries/Property Damage"
                                InputProps={{ readOnly: true }}
                                id="injuries"
                                name="injuries"
                                fullWidth={true}
                                variant="outlined"
                                value={(currentClaimant || {}).injuries}
                            />
                        </ContentCell>
                    </ContentRow>
                    <Divider />
                    <ContentRow>
                        <ContentCell width="33%">
                            <span style={{ fontWeight: 'bold' }}>Casualty Coverage Information </span>
                        </ContentCell>
                    </ContentRow>

                    <ContentRow>
                        <ContentCell width="33%">
                            <TextInput
                                disabled={true}
                                label="Type of Loss"
                                InputProps={{ readOnly: true }}
                                id="cIBLossTypeID"
                                name="cIBLossTypeID"
                                fullWidth={true}
                                variant="outlined"
                                value={(cIBLossTypes.filter(x => x.cIBLossTypeID === claimantCIB.cIBLossTypeID)[0] || {}).cIBLossTypeText || ' '}
                            />
                        </ContentCell>
                        <ContentCell width="33%">
                            <TextInput
                                disabled={true}
                                label="Claim Status"
                                InputProps={{ readOnly: true }}
                                id="fALClaimStatusTypeID"
                                name="fALClaimStatusTypeID"
                                fullWidth={true}
                                variant="outlined"
                                value={(statusTypes.filter(x => x.claimStatusTypeID === claim.fALClaimStatusTypeID)[0] || {}).statusText || ' '}
                            />
                        </ContentCell>
                    </ContentRow>
                    <Divider />
                    <ContentRow>
                        <ContentCell width="33%">
                            <span style={{ fontWeight: 'bold' }}>Medicare Reporting </span>
                        </ContentCell>
                    </ContentRow>

                    <ContentRow>
                        <ContentCell width="66%">
                            <TextInput
                                disabled={true}
                                label="Company"
                                InputProps={{ readOnly: true }}
                                id="claimID"
                                name="claimID"
                                fullWidth={true}
                                variant="outlined"
                                value={(Company.filter((x) => x.companyCode === claimantCIB.companyCodeRef)[0] || {}).companyName || ' '}
                            />
                        </ContentCell>
                        <ContentCell width="33%">
                            <TextInput
                                disabled={true}
                                label="RRE TIN"
                                InputProps={{ readOnly: true }}
                                id="claimID"
                                name="claimID"
                                fullWidth={true}
                                variant="outlined"
                                value={(Company.filter((x) => x.companyCode === claimantCIB.companyCodeRef)[0] || {}).taxIdentificationNumber || ' '}
                            />
                        </ContentCell>
                    </ContentRow>
                    <ContentRow>
                        <ContentCell width="66%">
                            <TextInput
                                disabled={true}
                                label="Remarks"
                                InputProps={{ readOnly: true }}
                                id="claimID"
                                name="claimID"
                                fullWidth={true}
                                variant="outlined"
                                value={claimantCIB.remarks}
                            />
                        </ContentCell>
                    </ContentRow>
                    <Divider />
                </PanelContent>
            </Panel>
        );
    
}
