import React from 'react';
import styled from 'styled-components';
import {
    Button,
    IconButton,
    Drawer
} from '@mui/material';
import {
    makeStyles
} from '@mui/styles';
import {
    ChevronLeft
} from '@mui/icons-material';

const DrawerContainerSection = styled.div`
    height: calc(100% - 60px);
    width: 100%;
    display: flex;
    flex-flow: column nowrap;
    justify-content: stretch;
    align-content: stretch;
    overflow: hidden;
`;

const DrawerTitle = styled.header`
    display: flex;
    padding: 0px 8px;
    font-size: 0.9375rem;
    align-items: center;
    justify-content: flex-start;
    background-color: #bdc3c7; 
    height: 32px;
    width: 100%;

    & > button {
        width: 100%;
    }
`;

const DrawerContent = styled.main`
    width: 100%;
    height: 100%;
    overflow-x: hidden;
    overflow-y: auto;
`;

const DrawerFooter = styled.footer`
    height: 50px;
    width: 100%;
    background-color: #ddd;
    padding: 8px;
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-end;
    align-content: center;
    align-items: center;
    border-top: solid 1px #a1a1a1;

    & > * {
        margin-right: 10px;
    }
`;

/**
 * @typedef {object} DrawerContainerOptions
 * @property {string} [title='Drawer'] - title to show in drawer
 * @property {string} [anchor='left'] - anchor position for drawer
 * @property {string} [submitText='Submit'] - text to show on the submit button
 * @property {string} [cancelText='Cancel'] - text to show on the cancel button
 * @property {number} [width=350] - width of the drawer in pixels
 */

/**
 * @typedef {object} DrawerContainerProps
 * @property {boolean} open - flag to determine if drawer should show
 * @property {Function} onClose - drawer closed event handler
 * @property {DrawerContainerOptions} [options] - display options
 * @property {React.Node} children - component stack to render within the drawer
 */

/**
 * DrawerContainer component
 * @param {DrawerContainerProps} props - component properties
 * @returns {React.Component}
 */
export const DrawerContainer = ({ open, onClose, child, options = {} }) => {

    const drawerWidth = (options.width || 350);
    const anchor = (options.anchor || 'left');
    const title = (options.title || 'Drawer');
    const submitText = (options.submitText || 'Submit');
    const cancelText = (options.cancelText || 'Cancel');
    const hasSubmit = (options.hasSubmit !== false);
    const rest = (options.params || {});

    const [isValid, validityChange] = React.useState(false);
    const [request, updateRequest] = React.useState({});

    const useStyles = makeStyles((theme) => ({
        button: {
            margin: '1em',
        },
        formControl: {
            minWidth: 300,
        },
        selectControl: {
            margin: '1em',
            width: '300px',
            margin: '0 auto',
        },
        root: {
            display: 'flex',
        },
        hide: {
            display: 'none',
        },
        drawer: {
            width: drawerWidth,
            flexShrink: 0,
            listStyle: 'none',
            listStyleType: 'none',
        },
        drawerPaper: {
            width: drawerWidth,
            top: '60px',
        },
        drawerHeader: {
            display: 'flex',
            alignItems: 'center',
            padding: '0 1em',
            // necessary for content to be below app bar
            justifyContent: 'flex-start',
            backgroundColor: '#bdc3c7',

        },
        content: {
            flexGrow: 1,
            padding: '3em',
            marginRight: -drawerWidth,
        },
        contentShift: {
            marginRight: 0,
        },
        dividerFullWidth: {
            margin: `5px 0 0 2em`,
        },
        dividerInset: {
            margin: `5px 0 0 9px`,
        },
        heading: {
            fontSize: '15px',
            flexBasis: '33.33%',
            flexShrink: 0,
        },
        secondaryHeading: {
            fontSize: '15px',
        },
        expandedPanel: {
            margin: '0px !important'
        },
        panelDetails: {
            flexDirection: "column"
        }
    }));

    const classes = useStyles();

    const Child = (child || (() => <p>No content provided</p>));

    const onSubmit = () => {
        if (typeof onClose === 'function') {
            onClose({ confirmed: true, payload: request });
            validityChange(false);
        }
    };

    const onCancel = () => {
        if (typeof onClose === 'function') {
            onClose({ confirmed: false });
            validityChange(false);
        }
    };

    const onValidityChanged = (valid) => {
        validityChange(valid === true);
    };

    const onRequestChanged = (req) => {
        updateRequest(req);
    };

    return (
        <Drawer
            className={classes.drawer}
            anchor={anchor}
            open={open}
            classes={{
                paper: classes.drawerPaper,
            }}
        >
            <DrawerContainerSection>
                <DrawerTitle>
                    <IconButton name="arrowchevron_right" onClick={onCancel}>
                        <ChevronLeft />
                        <span>{title}</span>
                    </IconButton>
                </DrawerTitle>
                <DrawerContent>
                    <Child onValidityChanged={onValidityChanged} onRequestChanged={onRequestChanged} {...rest} />
                </DrawerContent>
                {
                    hasSubmit === false ? null :
                        <DrawerFooter>
                            <Button onClick={onSubmit} disabled={isValid !== true} variant="contained" color="primary">{submitText}</Button>
                            <Button onClick={onCancel} style={{ marginLeft: '1em' }}>{cancelText}</Button>
                        </DrawerFooter>
                }
            </DrawerContainerSection>
        </Drawer>
    );
}