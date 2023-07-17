import React from 'react';
import {
    Search
} from '@mui/icons-material';
import {
    IconButton,
    MenuItem
} from '@mui/material';
import {
    Panel,
    PanelHeader,
    PanelContent,
    ContentRow,
    ContentCell,
    DatePicker,
    SelectList,
    TextInput,
    CurrencyInput,
} from '../../../../../../Core/Forms/Common';
import {
    SearchField
} from './Common';
import {
    makeEvent
} from '../../../../../../Core/Utility/makeEvent';
import {
    ensureNonEmptyArray,
    ensureNonNullObject
} from '../../../../../../Core/Utility/rules';
import {
    useAppHost
} from '../../../AppHost';
import {
    AttorneySearch
} from './AttorneySearch';
import ClearIcon from '@mui/icons-material/Clear';
/**
 * @interface LitigationModel
 * @property {string} litigationTypeCode
 * 
 */

/**
 * @typedef {object} LitigationFormProps
 * @property {import('../../../../../../Core/Providers/FormProvider/model/Model').Model} model - the bound model
 */

/**
 * FormComponent for the Litigation form. 
 * @param {LitigationFormProps} props - component props
 * @type {import('react').Component<LitigationFormProps>}
 */
export const FormComponent = ({ model }) => {

 const $host = useAppHost();
    const [isOpen, setIsOpen] = React.useState(false);

    const onSearchClick = () => {
        setIsOpen(true);
    };

    /**
     * Handles the user selection event
     * @param {import('../../../../../Common/Components/SearchDrawer').SelectionResult} res
     */
    const onResourceSelected = (res) => {
        if (res === '') {
            model.handleUserInput(makeEvent('claimResourceID', null));
            model.handleUserInput(makeEvent('claimResourceCompanyName', null));
            model.handleFinalizeInput(makeEvent('claimResourceID', null));
        }
        if (res.confirmed === true && ensureNonEmptyArray(res.result)) {
            const resource = res.result[0];

            if (ensureNonNullObject(resource)) {
                model.handleUserInput(makeEvent('claimResourceID', resource.resourceID));
                model.handleUserInput(makeEvent('claimResourceCompanyName', resource.companyName));
                model.handleFinalizeInput(makeEvent('claimResourceID', resource.resourceID));
            }
        }

        setIsOpen(false);
    };

    return (
        <>
            <Panel height="100%">
                <PanelHeader><span>Litigation Details</span></PanelHeader>
                <PanelContent>
                    <ContentRow>
                        <ContentCell width="33%">
                            <DatePicker
                                id="arbitrationDate"
                                name="arbitrationDate"
                                label="Arbitration Date"
                                fullWidth={true}
                                value={model.arbitrationDate.value}
                                onChange={model.handleUserInput}
                                onBlur={model.handleFinalizeInput}
                                error={model.arbitrationDate.showError}
                                helperText={model.arbitrationDate.error}
                                variant="outlined"
                                inputProps={{ readOnly: $host.appIsReadonly }}
                            />
                        </ContentCell>
                        <ContentCell width="33%">
                            <DatePicker
                                id="mediationDate"
                                name="mediationDate"
                                label="Mediation Date"
                                fullWidth={true}
                                value={model.mediationDate.value}
                                onChange={model.handleUserInput}
                                onBlur={model.handleFinalizeInput}
                                error={model.mediationDate.showError}
                                helperText={model.mediationDate.error}
                                variant="outlined"
                                inputProps={{ readOnly: $host.appIsReadonly }}
                            />
                        </ContentCell>
                        <ContentCell width="33%">
                            <DatePicker
                                id="trialDate"
                                name="trialDate"
                                label="Trial Date"
                                fullWidth={true}
                                value={model.trialDate.value}
                                onChange={model.handleUserInput}
                                onBlur={model.handleFinalizeInput}
                                error={model.trialDate.showError}
                                helperText={model.trialDate.error}
                                variant="outlined"
                                inputProps={{ readOnly: $host.appIsReadonly }}
                            />
                        </ContentCell>
                    </ContentRow>
                    <ContentRow>
                        <ContentCell width="33%">
                            <SearchField>
                                <TextInput
                                    label="Attorney"
                                    fullWidth={true}
                                    value={model.claimResourceCompanyName.value}
                                    name="claimResourceID"
                                    variant="outlined"
                                    inputProps={{ readOnly: true }}
                                />
                                <IconButton
                                    onClick={() => { onResourceSelected("");  }}
                                    disabled={$host.appIsReadonly}
                                    style={{ marginRight: 1 }}
                                >
                                    <ClearIcon />
                                </IconButton>
                                <IconButton
                                    onClick={onSearchClick}
                                    disabled={$host.appIsReadonly}
                                    style={{ padding: 0 }}
                                >
                                    <Search />
                                </IconButton>
                            </SearchField>
                        </ContentCell>
                        <ContentCell width="33%">
                            <SelectList
                                id="counselTypeCode"
                                name="counselTypeCode"
                                label="Counsel Type"
                                fullWidth={true}
                                allowempty={true}
                                value={model.counselTypeCode.value}
                                onChange={model.handleUserInput}
                                onBlur={model.handleFinalizeInput}
                                error={model.counselTypeCode.showError}
                                helperText={model.counselTypeCode.error}
                                variant="outlined"
                                inputProps={{ readOnly: $host.appIsReadonly }}
                            >
                                <MenuItem value="CC">Coverage Counsel</MenuItem>
                                <MenuItem value="MC">Monitoring Counsel</MenuItem>
                                <MenuItem value="GS">General Star</MenuItem>
                                <MenuItem value="DC">Defense Counsel</MenuItem>
                            </SelectList>
                        </ContentCell>
                        <ContentCell width="33%">
                            <SelectList
                                id="coveragePosition"
                                name="coveragePosition"
                                label="Coverage Position"
                                fullWidth={true}
                                value={model.coveragePosition.value}
                                onChange={model.handleUserInput}
                                onBlur={model.handleFinalizeInput}
                                error={model.coveragePosition.showError}
                                helperText={model.coveragePosition.error}
                                allowempty={true}
                                variant="outlined"
                                inputProps={{ readOnly: $host.appIsReadonly }}
                            >
                                <MenuItem value="NO">No</MenuItem>
                                <MenuItem value="DC">DC</MenuItem>
                                <MenuItem value="ROR">ROR</MenuItem>
                            </SelectList>
                        </ContentCell>
                    </ContentRow>
                    <ContentRow>
                         <ContentCell width="33%">
                            <CurrencyInput
                                id="budgetAmount"
                                label="Budget Amount"
                                name="budgetAmount"
                                allowDecimal={true}
                                value={(model.budgetAmount.value)}
                                onStdChange={model.handleUserInput}
                                onStdBlur={model.handleFinalizeInput}
                                error={model.budgetAmount.showError}
                                helperText={model.budgetAmount.error}
                                inputProps={{ readOnly: $host.appIsReadonly }}
                            />
                        </ContentCell>
                       <ContentCell width="33%">
                            <DatePicker
                                id="budgetRequestedDate"
                                name="budgetRequestedDate"
                                label="Date Budget Requested"
                                fullWidth={true}
                                value={model.budgetRequestedDate.value}
                                onChange={model.handleUserInput}
                                onBlur={model.handleFinalizeInput}
                                variant="outlined"
                                helperText={model.budgetRequestedDate.error}
                                error={model.budgetRequestedDate.showError}
                                inputProps={{ readOnly: $host.appIsReadonly }}
                            />
                        </ContentCell>
                        <ContentCell width="33%">
                            <DatePicker
                                id="budgetReceivedDate"
                                name="budgetReceivedDate"
                                label="Date Budget Received"
                                value={model.budgetReceivedDate.value}
                                onChange={model.handleUserInput}
                                onBlur={model.handleFinalizeInput}
                                fullWidth={true}
                                variant="outlined"
                                error={model.budgetReceivedDate.showError}
                                helperText={model.budgetReceivedDate.error}
                                inputProps={{ readOnly: $host.appIsReadonly }}
                            />
                        </ContentCell>
                    </ContentRow>
                    <ContentRow>
                        <ContentCell width="33%">
                            <TextInput
                                id="caseCaption"
                                name="caseCaption"
                                label="Case Caption"
                                value={model?.caseCaption?.value}
                                onChange={model.handleUserInput}
                                onBlur={model.handleFinalizeInput}
                                fullWidth={true}
                                variant="outlined"
                                inputProps={{ readOnly: $host.appIsReadonly }}
                                error={model.caseCaption.showError}
                                helperText={model.caseCaption.error}
                            />
                        </ContentCell>
                        <ContentCell width="33%">
                            <TextInput
                                id="docketNumber"
                                name="docketNumber"
                                label="Docket Number"
                                value={model?.docketNumber?.value}
                                onChange={model.handleUserInput}
                                onBlur={model.handleFinalizeInput}
                                fullWidth={true}
                                variant="outlined"
                                inputProps={{ readOnly: $host.appIsReadonly }}
                                error={model.docketNumber.showError}
                                helperText={model.docketNumber.error}
                            />
                        </ContentCell>
                        <ContentCell width="33%">
                            <SelectList
                                id="courtVenue"
                                name="courtVenue"
                                label="Court Venue"
                                value={model.courtVenue.value}
                                onChange={model.handleUserInput}
                                onBlur={model.handleFinalizeInput}
                                error={model.courtVenue.showError}
                                helperText={model.courtVenue.error}
                                allowempty={true}
                                variant="outlined"
                                inputProps={{ readOnly: $host.appIsReadonly }}
                            >
                                <MenuItem value={"S"} >{"State Court"}</MenuItem>
                                <MenuItem value={"F"} >{"Federal Court"}</MenuItem>

                            </SelectList>
                        </ContentCell>
                    </ContentRow>
                    <ContentRow>
                        <ContentCell width="66%">
                            <TextInput
                                id="comments"
                                name="comments"
                                label="Comments"
                                value={model?.comments?.value}
                                onChange={model.handleUserInput}
                                onBlur={model.handleFinalizeInput}
                                fullWidth={true}
                                variant="outlined"
                                inputProps={{ readOnly: $host.appIsReadonly }}
                                error={model.comments.showError}
                                helperText={model.comments.error}
                                multiline
                                rows={3}
                            />
                            </ContentCell>
                    </ContentRow>
                    
                    
                </PanelContent>
            </Panel>
            <AttorneySearch open={isOpen} onResourceSelected={onResourceSelected} />
        </>
    );
}
