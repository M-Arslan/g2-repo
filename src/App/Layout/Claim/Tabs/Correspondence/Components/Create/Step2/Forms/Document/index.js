import React from 'react';
import styled from 'styled-components';
import {
    IconButton,
    MenuItem,
} from '@mui/material';
import {
    HelpOutlined
} from '@mui/icons-material';
import {
    FormDivider,
    FieldContainer
} from '../Common';
import {
    Templates,
    TemplateFormSelector
} from './Templates';
import {
    SelectList,
} from '../../../../../../../../../Core/Forms/Common';
import { makeEvent } from '../../../../../../../../../Core/Utility/makeEvent';
import { ensureNonEmptyArray } from '../../../../../../../../../Core/Utility/rules';
import { useSelector } from 'react-redux';
import { claimSelectors } from '../../../../../../../../../Core/State/slices/claim';

/**
 * @typedef {object} DocumentFormProps
 * @property {import('../../../../../../../../../Core/Providers/FormProvider/model/Model').Model} model the bound model
 */

const Stretch = styled.div`
    width: 100%;
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    align-content: center;
    align-items: center;
`;

/**
 * The DocumentForm component
 * @param {DocumentFormProps} props component props
 * @type {import('react').Component<DocumentFormProps>}
 */
export const DocumentForm = ({ model }) => {

    const claim = useSelector(claimSelectors.selectData());

    const onTemplateChanged = (evt) => {
        model.handleUserInput(evt);
        model.handleUserInput(makeEvent('rawData', ''));
        model.handleFinalizeInput(evt);
    }

    const templateList = Templates
        .filter(tmp => (ensureNonEmptyArray(tmp.excludeFrom) === false || tmp.excludeFrom.includes(claim.claimType) === false))
        .filter(tmp => (ensureNonEmptyArray(tmp.includeForLegalEntity) === false || isNaN(claim.g2LegalEntityID) || tmp.includeForLegalEntity.includes(claim.g2LegalEntityID)));

    return (
        <section>
            <FieldContainer>
                <Stretch>
                <SelectList
                    id="templateName"
                    label="Correspondence Template"
                    value={model.templateName.value}
                    onChange={onTemplateChanged}
                    onBlur={model.handleFinalizeInput}
                    variant="outlined"
                    allowempty={false}
                    error={model.templateName.showError}
                    helperText={model.templateName.helperText}
                    required
                >
                    {
                        templateList.map((temp, idx) => <MenuItem value={temp.id} key={`template__${idx}`}>{`${temp.name}`}</MenuItem>)
                    }
                    </SelectList>
                    <IconButton name="Help" style={{ marginLeft: '2em' }} disabled={model.templateName.showError}><HelpOutlined /></IconButton>
                </Stretch>
            </FieldContainer>
            <FormDivider />
            <TemplateFormSelector
                id="rawData"
                selected={model.templateName.value}
                value={model.rawData.value}
                model={model}
                onChange={model.handleUserInput}
                onBlur={model.handleFinalizeInput}
            />
        </section>
    );
};
