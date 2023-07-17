import { APP_TYPES } from '../../../../Core/Enumerations/app/app-types';
import { AppHost } from '../../../Claim/Tabs/AppHost';
import {
    AssociatePoliciesTab
} from '../../Tabs/AssociatePolicies/AssociatePoliciesTab';

export { AssociatePoliciesTab };
export default ({ claim }) => (
    <AppHost app={APP_TYPES.Associated_Policies_Contracts}>
        <AssociatePoliciesTab claim={claim} />
    </AppHost>
);