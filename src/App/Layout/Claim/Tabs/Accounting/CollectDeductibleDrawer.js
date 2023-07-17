import React from 'react';
import {
    CurrencyInput
} from '../../../../Core/Forms/Common';
import {
    ContentCell, ContentRow
} from '../../../../Core/Forms/Common/Layout';
import {
    FormDrawer
} from '../../../Common/Components/FormDrawer';
import {
    findHelpTextByTag
} from '../../../Help/Queries';
import {
    useAppHost
} from '../AppHost';

export const CollectDeductibleDrawer = ({ open,onSubmit, onClose, formValidator }) => {

    const $host = useAppHost();
    const [helpTags, setHelpTags] = React.useState([]);
    const [activity, setActivity] = React.useState({ amount: 0 });

    const { register, formState: { errors }, setValue } = formValidator;
    setValue("amount", activity.amount);

    const onDrawerClose = (confirm) => {
        onClose();
    }
    const onDrawerSubmit = (confirm) => {
        if (activity.amount)
            activity.amount = parseFloat(activity.amount);
        onSubmit((confirm === true), activity);
    }

    const onValueChanged = (evt) => {
        if ($host.isViewer !== true) {
            setActivity({ ...activity, [evt.target.name]: evt.target.value });
        }
    };
    const convertFloatStringToFloat = (evt) => {
        if ($host.isViewer !== true) {
            let val = evt.target.value;
            val = val.replace("$", "");
            val = val.replaceAll(",", "");
            setActivity({ ...activity, [evt.target.name]: val });
        }
    };

    return (
        <>
            <FormDrawer
                onClose={onDrawerClose}
                onSubmit={onDrawerSubmit}
                open={open}
                options={{ title: 'Request Collect Deductible Begin', submitText: 'Submit to Accounting' }}
                formValidator={formValidator}
            >
                <ContentRow>
                    <ContentCell width="99%">
                        Please supply amount and select Submit to send this request to accounting.
                    </ContentCell>
                </ContentRow>
                <ContentRow>
                    <ContentCell width="99%">
                        <CurrencyInput
                            disabled={$host.isViewer === true}
                            id="amount"
                            name="amount"
                            required
                            value={activity.amount}
                            {...register("amount",
                                {
                                    required: "This is required.",
                                    onChange: onValueChanged
                                }
                            )
                            }
                            error={errors.amount}
                            helperText={errors.amount ? errors.amount.message : ''}
                            label="Amount of deductible to collect"
                            tooltip={findHelpTextByTag('amount', helpTags)}
                            allowDecimal={true}
                            onBlur={convertFloatStringToFloat}
                        />
                    </ContentCell>
                </ContentRow>
            </FormDrawer>
        </>
    );
}