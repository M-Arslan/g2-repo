import { Divider, MenuItem } from '@mui/material';
import React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { formatDate, Panel, PanelContent, PanelHeader, SelectList, Spinner, TextInput } from '../../../../Core/Forms/Common';
import { getCIBLossTypes, getRiskStates } from '../../../../Core/Services/EntityGateway';
import { userSelectors } from '../../../../Core/State/slices/user';
import { loadClaimantDetail } from '../Claimants/queries';
import { loadCIBDetails, loadClaimantCIBActivity } from './Queries';

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

export const InfoFileCIBTaskDetails = ({ request, dispatch, formValidator, claim, onSave }) => {
    const currentClaimActivity = request.currentClaimActivity || {};
    const [currentClaimant, setCurrentClaimant] = React.useState([]);
    const [claimantCIB, setClaimantCIB] = React.useState([]);
    const $auth = useSelector(userSelectors.selectAuthContext());
    const currentUser = $auth.currentUser;
    const ClaimPolicy = claim.policy || claim.claimPolicy;
    const [riskStates, setRiskStates] = React.useState([]);
    const [cIBLossTypes, setCIBLossTypes] = React.useState([]); 
    const [isLoading, setIsLaoding] = React.useState(true); 
    

    React.useEffect(() => {
        Promise.all([
            loadClaimantCIBActivity(currentClaimActivity.activityID),
            getRiskStates(),
            getCIBLossTypes()
        ]).then(([cIBActivity, rs, ci]) => {
            setRiskStates(rs || []);
            setCIBLossTypes(ci || []);
            loadMetaData(cIBActivity.data.cIBActivityDetails[0]);
        })
    },[]);

    const loadMetaData = async (data) => {
        const resultCIBDetails = await loadCIBDetails(data.claimantCIBID);
        if ((resultCIBDetails.data || {}).cIBDetails) {
            const resultClaimant = await loadClaimantDetail((resultCIBDetails.data || {}).cIBDetails.claimantID);
            if ((resultClaimant.data || {}).detail) {
                setClaimantCIB((resultCIBDetails.data || {}).cIBDetails);
                setCurrentClaimant((resultClaimant.data || {}).detail);
                setIsLaoding(false);
            }
            
        }
    } 

    const acronym_name = (str) => {
        if (str) {
            var regular_ex = /\b(\w)/g;
            var matches = str.match(regular_ex);
            var acronym = matches.join('');
            return acronym;
        }
        return '';
    }

    return (
        <Panel>
            <PanelHeader><span style={{ fontWeight: 'bold', fontSize: '14px' }}>CIB Task Details</span></PanelHeader>
            { isLoading ? <Spinner /> : (
                <PanelContent>
                    <ContentRow>
                        <ContentCell width="33%">
                            <span style={{ fontWeight: 'bold' }}>Initial Or Re-Index </span>
                        </ContentCell>
                    </ContentRow>
                    <ContentRow>
                        <ContentCell width="33%">
                            <TextInput
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
                                label="Policy Number"
                                InputProps={{ readOnly: true }}
                                id="policyID"
                                name="policyID"
                                fullWidth={true}
                                variant="outlined"
                                value={(ClaimPolicy || {}).policyID}
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
                                label="Policy Type"
                                InputProps={{ readOnly: true }}
                                id="policyType"
                                name="policyType"
                                fullWidth={true}
                                variant="outlined"
                            />
                        </ContentCell>
                        <ContentCell width="33%">
                            <SelectList
                                id="lossLocation"
                                name="lossLocation"
                                label="Loss State"
                                fullWidth={true}
                                value={claim.lossLocation ? claim.lossLocation : ""}
                                variant="outlined"
                                inputProps={{ readOnly: true }}
                            >
                                {
                                    riskStates.map((rs, idx) => <MenuItem value={rs.riskStateID} key={`state-option-${idx}`}>{rs.stateName}</MenuItem>)
                                }
                            </SelectList>
                        </ContentCell>
                        <ContentCell width="33%">
                            <TextInput
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
                                label="Role"
                                InputProps={{ readOnly: true }}
                                id="claimID"
                                name="claimID"
                                fullWidth={true}
                                variant="outlined"
                            />
                        </ContentCell>
                        <ContentCell width="33%">
                            <TextInput
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
                                label="Claimant Full Name"
                                InputProps={{ readOnly: true }}
                                id="claimID"
                                name="claimID"
                                fullWidth={true}
                                variant="outlined"
                            />
                        </ContentCell>
                    </ContentRow>


                    <ContentRow>
                        <ContentCell width="33%">
                            <TextInput
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
                                label="Coverage"
                                InputProps={{ readOnly: true }}
                                id="claimID"
                                name="claimID"
                                fullWidth={true}
                                variant="outlined"
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
                                label="Alleged Injuries/Property Damage"
                                InputProps={{ readOnly: true }}
                                id="claimID"
                                name="claimID"
                                fullWidth={true}
                                variant="outlined"
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
                            <SelectList
                                id="cIBLossTypeID"
                                name="cIBLossTypeID"
                                label="Type of Loss"
                                fullWidth={true}
                                variant="outlined"
                                inputProps={{ readOnly: true }}
                                value={claimantCIB.cIBLossTypeID}
                            >
                                {
                                    cIBLossTypes.map(rs => <MenuItem value={rs.cIBLossTypeID}>{rs.cIBLossTypeText}</MenuItem>)
                                }

                            </SelectList>
                        </ContentCell>
                        <ContentCell width="33%">
                            <TextInput
                                label="Claim Status"
                                InputProps={{ readOnly: true }}
                                id="claimID"
                                name="claimID"
                                fullWidth={true}
                                variant="outlined"
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
                        <ContentCell width="33%">
                            <TextInput
                                label="Company"
                                InputProps={{ readOnly: true }}
                                id="claimID"
                                name="claimID"
                                fullWidth={true}
                                variant="outlined"
                            />
                        </ContentCell>
                        <ContentCell width="33%">
                            <TextInput
                                label="RRE TIN"
                                InputProps={{ readOnly: true }}
                                id="claimID"
                                name="claimID"
                                fullWidth={true}
                                variant="outlined"
                            />
                        </ContentCell>
                    </ContentRow>
                    <ContentRow>
                        <ContentCell width="50%">
                            <TextInput
                                label="Remarks"
                                InputProps={{ readOnly: true }}
                                id="claimID"
                                name="claimID"
                                fullWidth={true}
                                variant="outlined"
                            />
                        </ContentCell>
                    </ContentRow>
                    <Divider />
                </PanelContent>
            )}      
        </Panel>
    );
};
