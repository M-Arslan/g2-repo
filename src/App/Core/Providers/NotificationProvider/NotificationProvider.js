import {
    useSnackbar
} from 'notistack';

const VARIANTS = Object.freeze({
    ERROR: 'error',
    SUCCESS: 'success'
});

export const useNotifications = () => {
    const { enqueueSnackbar } = useSnackbar();

    const doNotify = (message, variant) => {
        enqueueSnackbar(message, { variant, anchorOrigin: { vertical: 'top', horizontal: 'center' } });
    };

    return {
        notifySuccess: (message) => doNotify(message, VARIANTS.SUCCESS),
        notifyError: (error) => {
            const ex = (typeof error === 'string' ? new Error(error) : error);
            const { message = 'An unknown error has occurred' } = ex;
            console.error('[NotificationProvider] An error has been reported:', error);
            doNotify(message, VARIANTS.ERROR);
        }
    };
};