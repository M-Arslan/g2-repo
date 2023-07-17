import React from 'react';
import {
    TextInput
} from '../../../../Core/Forms/Common';
import {
    ContentCell, ContentRow
} from '../../../../Core/Forms/Common/Layout';
import {
    FormDrawer
} from '../../../Common/Components/FormDrawer';
import {
    useAppHost
} from '../AppHost';

export const RequestInitialRINoticeDrawer = ({ open, onSubmit, onClose, formValidator }) => {

    const $host = useAppHost();
    const [activity, setActivity] = React.useState({ comments: '' });
    const { register, formState: { errors }, setValue } = formValidator;

    setValue("comments", activity.comments);

    const onDrawerClose = (confirm) => {
        onClose();
    }
    const onDrawerSubmit = (confirm) => {
        onSubmit((confirm === true), activity);
    }
    const onValueChanged = (evt) => {
        if ($host.isViewer !== true) {
            const { name, value } = evt.target;
            const val = (name === 'comments' ? value.trimStart() : value);
            if (name === 'comments' && val.length >= 250) {
                return;
            }
            setActivity({ ...activity, [name]: val });
        }
    };

    return (
        <>
            <FormDrawer
                onClose={onDrawerClose}
                onSubmit={onDrawerSubmit}
                open={open}
                options={{ title: 'Request Initial R/I Notice Be Sent', submitText: 'Submit to Accounting' }}
                formValidator={formValidator}
            >
                <ContentRow>
                    <ContentCell width="99%">
                        Please supply any comments and select Submit to send this request to accounting.
                    </ContentCell>
                </ContentRow>

                <ContentRow>
                    <ContentCell width="99%">
                        <TextInput
                            multiLine={true}
                            disabled={$host.isViewer === true}
                            id="comments"
                            name="comments"                            
                            value={activity.comments}
                            label="Comments"
                            required
                            maxLength="250"
                            {...register("comments",
                                {
                                    required: "This is required.",
                                    onChange: onValueChanged
                                }
                            )
                            }
                            error={errors.comments}
                            helperText={errors.comments ? errors.comments.message : ''}
                        />
                    </ContentCell>
                </ContentRow>
            </FormDrawer>
        </>
    );
}