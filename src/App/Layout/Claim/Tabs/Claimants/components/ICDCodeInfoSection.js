import {
    Autocomplete,
    Button,
    CircularProgress,
    TextField
} from '@mui/material';
import React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { APP_TYPES } from '../../../../../Core/Enumerations/app/app-types';
import { ConfirmationDialog, Panel, PanelContent, PanelHeader } from '../../../../../Core/Forms/Common';
import {
    customGQLQuery
} from '../../../../../Core/Services/EntityGateway';
import { userSelectors } from '../../../../../Core/State/slices/user';
import { ICDCodeListSection } from './ICDCodeListSection';
import { FAL_CLAIM_STATUS_TYPES } from '../../../../../Core/Enumerations/app/fal_claim-status-types';

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

export const ICDCodeInfoSection = ({claim, request, dispatch, formValidator, onSave}) => {
    const $auth = useSelector(userSelectors.selectAuthContext());
    const isViewer = claim.fALClaimStatusTypeID === FAL_CLAIM_STATUS_TYPES.CLOSED || claim.fALClaimStatusTypeID === FAL_CLAIM_STATUS_TYPES.ERROR|| $auth.isReadOnly(APP_TYPES.Claimant);
    const [showConfimationDialog, setShowConfimationDialog] = React.useState(false);
    const [ICDCodes, setICDCodes] = React.useState([]);
    let currentICDCode = request.currentICDCode || {};
    let currentMedicare = request.currentClaimant.medicare || {};
    let key = (currentMedicare.iCDCodes || []).length;
    const [open, setOpen] = React.useState(false);
    const [options, setOptions] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [icdCodeButtonFlag, setICDCodeButtonFlag] = React.useState(true);
    console.log(request.currentClaimant.medicare);
    const onSaveICDCodeClick = async () => {
        if ((request.currentClaimant.medicare || {}).claimantMedicareID)
        { 
            let iCDCodes = request.currentClaimant.medicare.iCDCodes || [];
            iCDCodes = iCDCodes.filter((code) => {
                delete code.icdCode
                return code;
            });
            iCDCodes.push({ ...request.currentICDCode });
            request.currentICDCode = {};
            request.selectedICDCodeIndex = -1;
            request.currentClaimant.medicare.iCDCodes = iCDCodes;
            dispatch({ type: 'UPDATE_UNIVERSAL_REQUEST', request: { ...request } });
            onSave()
        } else {
            let iCDCodes = [];
            iCDCodes.push({ ...request.currentICDCode });
            let currentMedicare = request.currentClaimant.medicare || {};
            currentMedicare.iCDCodes = iCDCodes;
            request.currentClaimant.medicare = currentMedicare;
            request.currentICDCode = {};
            request.selectedICDCodeIndex = -1;
            dispatch({ type: 'UPDATE_UNIVERSAL_REQUEST', request: { ...request } });
            onSave();
        }
    };
    const onDeleteICDCodeClick = async () => {
        setShowConfimationDialog(true);
    }
    const onDialogCancel = () => {
        setShowConfimationDialog(false);
    };
    const onDialogOk = () => {
        setShowConfimationDialog(false);
        request.currentClaimant.medicare.iCDCodes[request.selectedICDCodeIndex].isDeleted = true;
        request.currentICDCode = {};
        request.selectedICDCodeIndex = -1;
        dispatch({ type: 'UPDATE_UNIVERSAL_REQUEST', request: { ...request } });
        onSave()
    };

    const handleAutoCompleteChange = (event, values) => {
        if (values?.iCDCodeID.trim().length > 0) {
            setICDCodes(values);
            request.currentICDCode.iCDCodeID = values.iCDCodeID;
            setICDCodeButtonFlag(false);
            dispatch({ type: 'UPDATE_UNIVERSAL_REQUEST', request: { ...request } });
        } else {
            setICDCodeButtonFlag(true);
        }
    }

    const handleAutocompleteInputChange = (inputValue) => {
        if (inputValue.length >= 3) {
            setLoading(true);
            setTimeout(() => loadICDCodes(inputValue), 200);
        }
    }
    const loadICDCodes = async (searchString) => {
        let query = {
            "query":`
                query{
                    iCDCodes(searchCriteria:"${searchString}") {
                       iCDCodeID
                       description
                       active
                    }
            }`
        }
        const ICDCodesData = await customGQLQuery(`claims-common`, query); 
        if (ICDCodesData.data.iCDCodes === []) {
            setOptions([])
            setLoading(false);
        } else {
            setOptions(ICDCodesData.data.iCDCodes)
            setLoading(false);
        }
    }

    React.useEffect(() => {
        let active = true;
        if (!loading) {
            return undefined;
        }
        (async () => {
        })();

        return () => {
            active = false;
        };
    }, [loading])

    return (
        <Panel>
            <PanelHeader><span style={{ fontWeight: 'bold', fontSize: '14px' }}>Medicare ICD Code</span></PanelHeader>
            <PanelContent>
                <ConfirmationDialog
                    id="tpocICDCodeConfirmation"
                    keepMounted
                    open={showConfimationDialog}
                    onCancel={onDialogCancel}
                    onOk={onDialogOk}
                    title="Confirmation"
                    description="Are you sure you want to delete TPOC payment?"
                />
                <ContentRow>
                    <ContentCell width="50%">
                        <Autocomplete
                            style={{ width:'100%' }}
                            id="asynchronous-demo"
                            open={open}
                            onOpen={() => {
                                setOpen(true);
                            }}
                            onClose={() => {
                                setOpen(false);
                                setLoading(false);
                            }}

                            getOptionLabel={(option) => option.iCDCodeID + "-" + option.description }
                            options={options}
                            loading={loading}
                            onChange={handleAutoCompleteChange}
                            onInputChange={(event, newInputValue) => {
                                setTimeout((inputVnewInputValuealue) => handleAutocompleteInputChange(newInputValue), 2000);
                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="ICD Code - You must enter at least 3 characters for the search to begin"
                                    variant="outlined"
                                    InputProps={{
                                        ...params.InputProps,
                                        endAdornment: (
                                            <React.Fragment>
                                                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                                {params.InputProps.endAdornment}
                                            </React.Fragment>
                                        ),
                                    }}
                                />
                            )}
                        />
                    </ContentCell>
                    <ContentCell width="34%">
                        <Button variant="contained" color="primary" onClick={onSaveICDCodeClick} style={{ margin: '10px' }} disabled={isViewer || request.currentICDCode.iCDCodingID || icdCodeButtonFlag}>Add</Button>
                        {false &&
                            <Button variant="contained" color="primary" onClick={onDeleteICDCodeClick} style={{ margin: '10px' }} disabled={isViewer || (request.selectedICDCodeIndex < 0)}>Delete</Button>
                        }
                    </ContentCell>
                </ContentRow>
                <ICDCodeListSection request={request} dispatch={dispatch} key={key + 1} />
            </PanelContent>
        </Panel>
    );
};
