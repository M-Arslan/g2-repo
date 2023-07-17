import { APP_TYPES } from '../../../../Core/Enumerations/app/app-types';
import { AppHost } from '../../../Claim/Tabs/AppHost';

import {
    ULClaimApp
} from './ULClaimApp';

export { ULClaimApp };
export default ({ claim }) => (
    <AppHost app={APP_TYPES.UL_Claim_Detail}>
        <ULClaimApp claim={claim} />
    </AppHost>
);