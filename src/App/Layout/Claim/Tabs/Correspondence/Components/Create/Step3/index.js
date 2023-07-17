import React from 'react';
import {
    Tab,
    Tabs,
    TabList,
    TabPanel
} from 'react-tabs';
import {
    asWizardPage
} from '../../../../../../../Core/Providers/WizardProvider/asWizardPage';
import {
    resolve
} from '../../../../../../../Core/Services/Container/ServiceContainer';
import {
    ensureNonEmptyString,
    ensureNonNullObject
} from '../../../../../../../Core/Utility/rules';
import {
    GenerateDocument
} from '../../../Queries/GenerateDocument';
import {
    DocPreview
} from './DocPreview';
import {
    EmailPreview
} from './EmailPreview';

const TabsStyle = {
    height: "100%",
    width: "100%",
    fontSize: "12px"
};

const TabListStyle = {
    margin: 0,
    fontSize: '10px',
    backgroundColor: 'rgba(0,130,206,1)',
    color: '#dfdfdf',
    height: '30px',
};

const TabPanelStyle = {
    border: 'solid 1px rgb(170, 170, 170)',
    borderTop: 'none',
    margin: 0,
    padding: 0,
    height: 'calc(100% - 30px)',
    overflowX: 'hidden',
    overflowY: 'auto',
};

const DocTabPanelStyle = { ...TabPanelStyle, overflowY: 'hidden' };

const Step3Page = ({ state }) => {
    return (
        <Tabs style={TabsStyle}>
            <TabList style={TabListStyle}>
                <Tab key="tab_doc-preview">Preview Document</Tab>
                <Tab key="tab_email-preview">Preview Email Message</Tab>
            </TabList>
            <TabPanel style={DocTabPanelStyle} key="tab-content_doc-preview">
                <DocPreview document={state.documentData} />             
            </TabPanel>
            <TabPanel style={TabPanelStyle} key="tab-content_email-preview">
                <EmailPreview email={state} />
            </TabPanel>
        </Tabs>
    );
};

export const Step3 = asWizardPage(Step3Page, {
    title: 'Preview',
    nextEnabled: true,
    nextButtonLabel: 'Send',
    extraButtons: [
        {
            id: 'save-as-draft',
            label: 'Save as Draft',
            mutator: (state) => {
                return { ...state, status: 0 };
            }
        }
    ],
    backEnabled: true,
    initialize: (state) => {

        const $api = resolve(GenerateDocument);

        return $api.execute({ data: { templateName: state.templateName, rawDataStr: state.rawData } }).then(result => {
            if (ensureNonNullObject(result) && result.succeeded === true) {
                const tn = (ensureNonEmptyString(state.templateName) ? state.templateName : '/unknown_template.docx');
                const fileName = `${tn.substring(tn.lastIndexOf('/') + 1, tn.lastIndexOf('.'))}_${Date.now()}.pdf`;

                return { ...state, fileName, documentData: (result.resultFile || ''), status: 1 };
            }
            else {
                throw new Error('There was an error attempting to generate the document.  Ensure all fields are completed and valid.');
            }
        });
    }
});