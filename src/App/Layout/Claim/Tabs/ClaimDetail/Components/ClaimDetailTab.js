import React from 'react';
import {
    useDispatch,
    useSelector
} from 'react-redux';
import { BroadcastEvents, useBroadcaster } from '../../../../../Core/Providers/BroadcastProvider';
import {
    claimActions,
    claimSelectors
} from '../../../../../Core/State/slices/claim';
import {
    adjusterLicenseStatesActions,
    adjusterLicenseStatesSelectors
} from '../../../../../Core/State/slices/metadata/adjusterLicenseStates';
import {
    stripEmptyFields
} from '../../../../../Core/Utility/stripEmptyFields';
import {
    ensureNonNullObject
} from '../../../../../Core/Utility/rules';
import {
    safeObj
} from '../../../../../Core/Utility/safeObject';
import {
    ClaimDetailForm
} from './ClaimDetailForm';
import {
    ClaimPolicyGrid
} from './PolicyGrid/ClaimPolicyGrid';
import {
    DownloadExtractModal
} from './Download/DownloadExtractModal';
import {
    AlertDialogSlide
} from "../../../../Common/Components/Dialog/AlertDialog"
import { LEGAL_ENTITY } from '../../../../../Core/Enumerations/app/legal-entity';
import { checkStatClaimID } from './../Queries/checkStatClaimID';
import { useSnackbar } from 'notistack';
import { FAL_CLAIM_STATUS_TYPES } from '../../../../../Core/Enumerations/app/fal_claim-status-types';
import { checkPolicyRescission } from '../../../../Common/Queries/PolicyRescission/checkPolicyRescission'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
export const ClaimDetailTab = () => {

    const $dispatch = useDispatch();
    const $broadcaster = useBroadcaster();
    const claim = useSelector(claimSelectors.selectData());
    const [manualPolicy, setManualPolicy] = React.useState(false);
    const [downloadOpen, setDownloadOpen] = React.useState(false);
    const initData = { ...safeObj(claim) };
    const { enqueueSnackbar } = useSnackbar();
    const [isPolicyRescission, setIsPolicyRescission] = React.useState(false);
    const [policyRescissionData, setPolicyRescissionData] = React.useState(null);
    const [showPolicyRescissionData, setShowPolicyRescissionData] = React.useState(false);
    const fetchPolicy = async () => {
        if (claim.claimPolicyID !== "" && claim.claimPolicyID !== null ) {
            let ifPolicyRescission = await checkPolicyRescission(claim.claimPolicyID)
            if (ifPolicyRescission.data.getPolicyRescission.length !== 0) {
                setPolicyRescissionData(ifPolicyRescission.data.getPolicyRescission[0]);
                setIsPolicyRescission(true);
            }
            else {
                return;
            }
        }
    }

    React.useEffect(() => {
        fetchPolicy();
        return $broadcaster.subscribe(BroadcastEvents.RequestClaimExtract, () => {
            setDownloadOpen(true);
        });
    }, []);
    React.useEffect(() => {
        $dispatch(adjusterLicenseStatesActions.get());
    }, []);
    const downloadComplete = () => {
        setDownloadOpen(false);
    }

    if (ensureNonNullObject(claim) && ensureNonNullObject(claim.examiner) && ensureNonNullObject(claim.examiner.manager)) {
        initData.managerName = `${claim.examiner.managerFirstName} ${claim.examiner.managerLastName}`;
    }

    const doAutoSave = async (evt) => {
        const { value } = evt.target;
        if (value.request.statutoryClaimID !== "") {
            const result = await checkStatClaimID(value.request.claimMasterID, value.request.statutoryClaimID);
            if (result.errors?.length > 0 && result.data.statClaim.fALClaimStatusTypeID != FAL_CLAIM_STATUS_TYPES.ERROR) {
                enqueueSnackbar("Stat Claim Already Exists.", { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
                value.request.statutoryClaimID = null;
                const data = stripEmptyFields({ ...value.request });
                $dispatch(claimActions.stuff(data));
                $dispatch(claimActions.save({ claim: data }));
                return false;
            }
        }
        if (ensureNonNullObject(value) && value.valid === true && value.modified === true) {
            const data = stripEmptyFields({ ...value.request });
            $dispatch(claimActions.stuff(data));
            $dispatch(claimActions.save({ claim: data }));
            return true;
        }
    }

    const manualPolicyChanged = (evt) => {
        const { value } = evt.target;
        if (value !== manualPolicy) {
            setManualPolicy(value);
        }
    }

    return (
        <>
            <DownloadExtractModal open={downloadOpen} onClose={downloadComplete} />
            <ClaimDetailForm
                id="claim-detail-form"
                onFinalize={doAutoSave}
                initialRequest={initData}
                onManualChanged={manualPolicyChanged}
                isPolicyRescission={isPolicyRescission}
            />
            {
                (manualPolicy || (claim.g2LegalEntityID === LEGAL_ENTITY.GENESIS_INSURANCE || claim.g2LegalEntityID === LEGAL_ENTITY.GENESIS_REINSURANCE)) ? null : <ClaimPolicyGrid />
            }

            <AlertDialogSlide condition={isPolicyRescission} setCondition={setIsPolicyRescission} message={showPolicyRescissionData ? "PolicyRescissionData" : "Policy is part of a buy back, rescission or release"} buttonMessage={showPolicyRescissionData ? "Close" : "Click here to see the details"} setShowPolicyRescissionData={setShowPolicyRescissionData} showPolicyRescissionData={showPolicyRescissionData}>
                {showPolicyRescissionData ? <TableContainer component={Paper} >
                    <Table >
                        <TableBody>

                            {/* <TableRow>
                                <TableCell >Policy Rescission ID: {policyRescissionData?.policyRescissionID}</TableCell>
                            </TableRow> */}
                            <TableRow>
                                <TableCell >Policy Number: {policyRescissionData?.policyNumber}</TableCell>
                            </TableRow>
                            <TableRow>

                                <TableCell >Insured Name: {policyRescissionData?.insuredName}</TableCell>
                            </TableRow>
                            <TableRow>

                                <TableCell >Initial Policy Effective Date: {policyRescissionData?.initialPolicyEffDT}</TableCell>
                            </TableRow>
                            <TableRow>

                                <TableCell >Initial Policy Expiry Date: {policyRescissionData?.initialPolicyExpDT}</TableCell>
                            </TableRow>
                            <TableRow>

                                <TableCell >Underwriting Area: {policyRescissionData?.uWAreaDesc}</TableCell>
                            </TableRow>
                            <TableRow>

                                <TableCell >Premium Return: {policyRescissionData?.premiumReturn ? "Yes" : "No"}</TableCell>
                            </TableRow>
                            <TableRow>

                                <TableCell >Limits: {policyRescissionData?.limits}</TableCell>
                            </TableRow>
                            <TableRow>

                                <TableCell >Comments: {policyRescissionData?.comments}</TableCell>
                            </TableRow>
                            <TableRow>

                                <TableCell >Underwriting Unit Manager: {policyRescissionData?.uWUnitManager}</TableCell>
                            </TableRow>
                            <TableRow>

                                <TableCell >Process Completed: {policyRescissionData?.processCompleted ? "Yes" : "No"}</TableCell>
                            </TableRow>
                            <TableRow>

                                <TableCell >Policy Disposition: {policyRescissionData?.policyDisposition}</TableCell>
                            </TableRow>
                            <TableRow>

                                <TableCell >Claim Manager: {policyRescissionData?.claimManager}</TableCell>
                            </TableRow>
                            <TableRow>

                                <TableCell >Legal Unit Examiner: {policyRescissionData?.legalUnitExaminer}</TableCell>

                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer> : "Policy is part of a buy back, rescission or release"}
            </AlertDialogSlide>

        </>
    );
}

