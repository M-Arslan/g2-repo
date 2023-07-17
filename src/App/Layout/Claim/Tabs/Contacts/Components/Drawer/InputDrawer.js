import React from 'react';
import {
    FormDrawer
} from '../../../../../Common/Components/FormDrawer';
import {
    ensureNonEmptyString,
    ensureNonNullObject
} from '../../../../../../Core/Utility/rules';
import {
    safeObj
} from '../../../../../../Core/Utility/safeObject';
import {
    ContactInputForm
} from './ContactInputForm';
import {
    stripEmptyFields
} from '../../../../../../Core/Utility/stripEmptyFields';
import {
    ContactTypeFormatter
} from '../../contact-type';
import {
    Spinner
} from '../../../../../../Core/Forms/Common';
import {
    useDispatch,
    useSelector
} from 'react-redux';
import {
    riskStatesActions,
    riskStatesSelectors
} from '../../../../../../Core/State/slices/metadata/risk-states';
import {
    ASYNC_STATES
} from '../../../../../../Core/Enumerations/redux/async-states';

export const InputDrawer = ({ open, onClose, initialRequest }) => {

    const [state, setState] = React.useState({ ...safeObj(initialRequest) });
    const [title, setTitle] = React.useState('');
    const [modelState, setModelState] = React.useState(null);

    const $dispatch = useDispatch();
    const rsStatus = useSelector(riskStatesSelectors.selectLoading());

    React.useEffect(() => {
        if (rsStatus === ASYNC_STATES.IDLE) {
            $dispatch(riskStatesActions.get());
        }
    }, [rsStatus]);

    const initState = (state) => {
        setState({ ...safeObj(state) });
        setTitle(`${(ensureNonEmptyString(safeObj(state).claimContactID) ? 'Edit' : 'New')} ${ContactTypeFormatter({ data: safeObj(state) })} Contact`);
    }

    React.useEffect(() => {
        initState(initialRequest);
    }, [initialRequest]);

    const submitForm = (res) => {
        if (typeof onClose === 'function') {
            const value = modelState;
            if (ensureNonNullObject(value) && value.valid === true) {
                onClose({ confirmed: true, contact: stripEmptyFields(value.request) });
                setModelState(null);
                setState(null);
            }

        }
    }

    const closeDrawer = () => {
        if (typeof onClose === 'function') {
            onClose({ confirmed: false });
            setModelState(null);
            setState(null);
        }
    }

    const finalizeModel = (evt) => {
        const { value } = evt.target;

        if (ensureNonNullObject(value)) {
            setModelState(value);
            return true;
        }
    }

    return <FormDrawer open={open} options={{ width: '50%', title }} onSubmit={submitForm} onClose={closeDrawer}>
        {
            rsStatus === ASYNC_STATES.SUCCESS ? <ContactInputForm id="contact-input-form" onFinalize={finalizeModel} initialRequest={state} /> : <Spinner />
        }        
    </FormDrawer>;
};