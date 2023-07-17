import { APP_TYPES } from '../../../../Core/Enumerations/app/app-types';
import { AppHost } from '../../../Claim/Tabs/AppHost';
import {
    CourtSuitsTab
} from './CourtSuitsTab';

export { CourtSuitsTab };
export default ({ claim }) => (
    <AppHost app={APP_TYPES.Court_Suit_Information}>
        <CourtSuitsTab claim={claim} />
    </AppHost>
);