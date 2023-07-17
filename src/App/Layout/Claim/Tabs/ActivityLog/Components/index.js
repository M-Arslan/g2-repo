import {
    withAsyncOperation
} from '../../../../../Core/Providers/AsyncProvider/withAsyncOperation';
import {
    AddNarrative
} from '../Queries/AddNarrative';
import {
    GetNarratives
} from '../Queries/GetNarratives';
import {
    TabComponent
} from './ActivityLogTab';

export const ActivityLogTab = withAsyncOperation(TabComponent, GetNarratives, AddNarrative);