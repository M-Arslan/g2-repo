import React from 'react';
import styled from 'styled-components';
import {
    Checkbox,
    FormControlLabel
} from '@mui/material';
import { MenuItem } from '@mui/material';
import { ContentCell, ContentRow, DatePicker, TextInput, formatDate, SelectList,Spinner } from '../../../../../Core/Forms/Common';
import { Container } from '../../../../Notifications/NotificationCenter/CreateNotification/FieldContainer';
import { makeStyles } from '@mui/styles';
import {  useSelector } from 'react-redux';
import { companiesSelectors } from '../../../../../Core/State/slices/metadata/companies';
import { COMPANY_NAME } from '../../../../../Core/Enumerations/app/company-name';

const useStyles = makeStyles((theme) => ({
    cellDesign: {
        width: "100%"
    }
}));
const ScrollPanel = styled.div`
    height: calc(100% - 85px - 20px);
    width: 100%;
    padding: 0;
    margin: 0;
    border: 0;
    overflow-x: hidden;
    overflow-y: auto;
`;

export const AssociativePoliciesDrawerForm = ({ request, dispatch, formValidator }) => {
    const classes = useStyles();;
    const companies = useSelector(companiesSelectors.selectData());

    const { formState: { errors }, unregister, setValue, register } = formValidator;

    let currentAssociatedPolicy = request.currentAssociatedPolicy || {};
    const [issueExpirationDateError, setExpirationDateError] = React.useState(false);

    const onValueChanged = (evt) => {
        setValue(evt.target.name, evt.target.value ? evt.target.value : null);
        request.currentAssociatedPolicy[evt.target.name] = evt.target.value.trimStart();
        dispatch({ type: 'UPDATE_UNIVERSAL_REQUEST', request: { ...request } });
    };

    const onDropDownChanged = (evt) => {
        setValue(evt.target.name, evt.target.value ? evt.target.value : null);
        request.currentAssociatedPolicy[evt.target.name] = evt.target.value ? parseInt(evt.target.value) : null;
        dispatch({ type: 'UPDATE_UNIVERSAL_REQUEST', request: { ...request } });
    };
    const onCheckboxChecked = (evt) => {
        request.currentAssociatedPolicy[evt.target.name] = evt.target.checked;
        dispatch({ type: 'UPDATE_UNIVERSAL_REQUEST', request: { ...request } });
    }
    const onDateChanged = (evt) => {
        request.currentAssociatedPolicy[evt.target.name] = evt.target.value ? new Date(evt.target.value).toISOString() : null;
        if (currentAssociatedPolicy.expirationDate < currentAssociatedPolicy.effectiveDate) {
            setExpirationDateError(true);
        } else {
            setExpirationDateError(false);
        }
        dispatch({ type: 'UPDATE_UNIVERSAL_REQUEST', request: { ...request } });
    };
    if (!request.searchMode && !request.editMode) {
        currentAssociatedPolicy.g2CompanyNameID = COMPANY_NAME.OTHER;
    } else {
        setValue("g2CompanyNameID", currentAssociatedPolicy.g2CompanyNameID ? currentAssociatedPolicy.g2CompanyNameID : null);
    }
   
    React.useEffect(() => {
        setValue("coverage", currentAssociatedPolicy.coverage);
        setValue("insuredName", currentAssociatedPolicy.insuredName);

        return () => {
            unregister("coverage");
            unregister("g2CompanyNameID");
        }

    }, [])
    
    return (
        companies ?
            <ScrollPanel>
                <Container>
                    <form>
                        <ContentRow>
                            <ContentCell className={classes.cellDesign}>

                                {request.selectedMenu === "GENERALSTAR"  ? (<>
                                    <SelectList
                                        id="g2CompanyNameID"
                                        name="g2CompanyNameID"
                                        label="Company"
                                        fullWidth={true}
                                        value={currentAssociatedPolicy.g2CompanyNameID || ""}
                                        {...register("g2CompanyNameID", {
                                            required: true,
                                            onChange: (e) => onDropDownChanged(e)
                                        })}
                                        variant="outlined"
                                        allowempty={false}
                                        error={errors.g2CompanyNameID}
                                        helperText={errors.g2CompanyNameID ? "This field is required." : ""}
                                        required
                                    >
                                        <MenuItem value="1">{companies[0]?.companyName}</MenuItem>
                                        <MenuItem value="2">{companies[1]?.companyName}</MenuItem>
                                    </SelectList>

                                </>) : request.selectedMenu === "GENESIS"  ? (<>
                                    <SelectList
                                            id="g2CompanyNameID"
                                            name="g2CompanyNameID"
                                        label="Company"
                                        fullWidth={true}
                                        value={currentAssociatedPolicy.g2CompanyNameID || ""}
                                        {...register("g2CompanyNameID", {
                                            required: true,
                                            onChange: (e) => onDropDownChanged(e)
                                        })}
                                        variant="outlined"
                                        allowempty={false}
                                        error={errors.g2CompanyNameID}
                                        helperText={errors.g2CompanyNameID ? "This field is required." : ""}
                                        required
                                    >
                                         <MenuItem value="3">{companies[2]?.companyName}</MenuItem>
                                         <MenuItem value="4">{companies[3]?.companyName}</MenuItem>
                                    </SelectList>
                                </>) :  (<>
                                    <SelectList
                                        id="g2CompanyNameID"
                                        name="g2CompanyNameID"
                                        label="Company"
                                        fullWidth={true}
                                        value={currentAssociatedPolicy.g2CompanyNameID || ""}
                                        {...register("g2CompanyNameID", {
                                            required: true,
                                            onChange: (e) => onDropDownChanged(e)
                                        })}
                                        variant="outlined"
                                        allowempty={false}
                                        error={errors.g2CompanyNameID}
                                        helperText={errors.g2CompanyNameID ? "This field is required." : ""}
                                        required
                                    >
                                        <MenuItem value="5">{companies[4]?.companyName}</MenuItem>
                                    </SelectList>
                                </>)}
                            </ContentCell>

                        </ContentRow>
                        <ContentRow>
                            <ContentCell width="100%">
                                <TextInput
                                    id="policyID"
                                    name="policyID"
                                    label="Policy Number"
                                    variant="outlined"
                                    value={currentAssociatedPolicy.policyID || ''}
                                    onChange={onValueChanged}
                                    inputProps={{
                                        maxLength: 10,
                                    }}
                                    disabled={currentAssociatedPolicy.g2CompanyNameID !== COMPANY_NAME.OTHER ? true : request.searchMode ? true : false}
                                />
                            </ContentCell>
                        </ContentRow>
                        <ContentRow>
                            <ContentCell width="100%">
                                {request.selectedMenu === "GENESIS" || request.selectedMenu === "GENERALSTAR" ? 
                                    <TextInput
                                        id="contractName"
                                        name="insuredName"
                                        label="Contract Name/ Insured Name"
                                        variant="outlined"
                                        value={currentAssociatedPolicy.insuredName || ''}
                                        onChange={onValueChanged}
                                        disabled={currentAssociatedPolicy.g2CompanyNameID !== COMPANY_NAME.OTHER ? true : request.searchMode ? true : false}
                                    />
                                    :
                                    <TextInput
                                        id="contractName"
                                        name="insuredName"
                                        label="Contract Name/ Insured Name"
                                        variant="outlined"
                                        value={currentAssociatedPolicy.insuredName || ''}
                                        disabled={currentAssociatedPolicy.g2CompanyNameID !== COMPANY_NAME.OTHER ? true : request.searchMode ? true : false}
                                        required
                                        {...register("insuredName", {
                                            required: true,
                                            onChange: (e) => onValueChanged(e)
                                        })}
                                        error={errors.insuredName}
                                        helperText={errors.insuredName ? "This field is required." : ""}
                                    />
                                }
                            </ContentCell>
                        </ContentRow>
                        <ContentRow>
                            <ContentCell width="100%">
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            id="isPrimary"
                                            name="isPrimary"
                                            color="primary"
                                            key={currentAssociatedPolicy?.isPrimary}
                                            checked={currentAssociatedPolicy?.isPrimary}
                                            onChange={onCheckboxChecked}
                                            disabled={currentAssociatedPolicy?.isPrimary}
                                        />
                                    }
                                    label="Associated primary policy"
                                />
                            </ContentCell>
                        </ContentRow>
                        <ContentRow>
                            <ContentCell>
                                <DatePicker
                                    id="effectiveDate"
                                    name="effectiveDate"
                                    label="Effective Date"
                                    variant="outlined"
                                    value={formatDate(currentAssociatedPolicy.effectiveDate) || ''}
                                    onChange={onDateChanged}
                                    helperText=''
                                    error={false}
                                    disabled={currentAssociatedPolicy.g2CompanyNameID !== COMPANY_NAME.OTHER  ? true :request.searchMode ? true : false}
                                />
                            </ContentCell>
                            <ContentCell>
                                <DatePicker
                                    id="expirationDate"
                                    name="expirationDate"
                                    label="Expiration Date"
                                    variant="outlined"
                                    value={formatDate(currentAssociatedPolicy.expirationDate) || ''}
                                    onChange={onDateChanged}
                                    error={issueExpirationDateError}
                                    helperText={issueExpirationDateError ? 'Expiration date should not be earlier than Effective date' : ''}
                                    disabled={currentAssociatedPolicy.g2CompanyNameID !== COMPANY_NAME.OTHER  ? true :request.searchMode ? true : false}
                                />
                            </ContentCell>
                        </ContentRow>
                        {request.selectedMenu === "GENESIS" ? null :<ContentRow>
                            <ContentCell className={classes.cellDesign}>
                                <DatePicker
                                    id="cancelledDate"
                                    name="cancelledDate"
                                    label="Cancel Date"
                                    variant="outlined"
                                    value={formatDate(currentAssociatedPolicy.cancelledDate) || ''}
                                    onChange={onDateChanged}
                                    error={false}
                                    helperText=''
                                    disabled={currentAssociatedPolicy.g2CompanyNameID !== COMPANY_NAME.OTHER  ? true :request.searchMode ? true : false}
                                />
                            </ContentCell>
                        </ContentRow>}
                        <ContentRow>
                            <ContentCell className={classes.cellDesign}>
                                <TextInput
                                    id="coverage"
                                    label="Coverage"
                                    name="coverage"
                                    value={currentAssociatedPolicy.coverage || ''}
                                    error={errors.coverage}
                                    helperText={errors.coverage ? "This field is required." : ""}
                                    required
                                    {...register("coverage", {
                                        required: true,
                                        onChange: (e) => onValueChanged(e)
                                    })}
                                />
                            </ContentCell>
                        </ContentRow>
                        <ContentRow>
                            <ContentCell className={classes.cellDesign}>
                                <TextInput
                                    id="comments"
                                    label="Comments"
                                    name="comment"
                                    value={currentAssociatedPolicy.comment || ''}
                                    onChange={onValueChanged}
                                />
                            </ContentCell>
                        </ContentRow>
                        {//added these two fields
                        }
                        <ContentRow>
                            <ContentCell className={classes.cellDesign}>
                                <TextInput
                                    id="underwriter"
                                    label="Underwriter"
                                    name="underwriter"
                                    value={currentAssociatedPolicy.underwriter ||''}
                                    onChange={onValueChanged}
                                    inputProps={{
                                        maxLength: 255,
                                    }}
                                />
                            </ContentCell>
                        </ContentRow>
                        <ContentRow>
                            <ContentCell className={classes.cellDesign}>
                                <TextInput
                                    id="pastUnderwriter"
                                    label="Past Underwriter"
                                    name="pastUnderwriter"
                                    value={currentAssociatedPolicy.pastUnderwriter || ''}
                                    onChange={onValueChanged}
                                    inputProps={{
                                        maxLength: 255,
                                    }}
                                />
                            </ContentCell>
                        </ContentRow>
                    </form>
                </Container>
            </ScrollPanel>
        : <Spinner />
    );

}