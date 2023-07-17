import React from 'react';
import styled from 'styled-components';
import {
    Button,
    IconButton,
    Drawer,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { ChevronLeft } from '@mui/icons-material';

const HeaderButton = styled(IconButton)`
    justify-content: flex-start !important;
`;

const DrawerContainer = styled.div`
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
    flex-flow: row nowrap;
    padding: 0px;
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
    padding-top: 0em;
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
 * @typedef {object} FormDrawerOptions
 * @property {string} title - title to show in drawer
 * @property {string} submitText - text to show on the submit button
 * @property {number} [width=350] - width of the drawer in pixels
 */

/**
 * @typedef {object} FormDrawerProps
 * @property {boolean} open - flag to determine if drawer should show
 * @property {Function} onClose - drawer closed event handler
 * @property {FormDrawerOptions} [options] - display options
 * @property {React.Node} children - component stack to render within the drawer
 */

/**
 * FormDrawer component
 * @param {FormDrawerProps} props - component properties
 * @returns {React.Component}
 */
export const FormDrawer = ({ open, onSubmit, onClose, children, options = {} }) => {
    const drawerWidth = (options.width || 350);
    const useStyles = makeStyles((theme) => ({
        root: {
            display: 'flex',
            flex: 1,
            width: '100%',
        },
        backdrop: {
            zIndex: 5,
            color: '#fff',
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
            top: '10px !important',
        },
        drawerHeader: {
            display: 'flex',
            alignItems: 'center',
    padding: '0 1em',
            // necessary for content to be below app bar
            //...theme.mixins.toolbar,
            justifyContent: 'flex-start',
            backgroundColor: '#bdc3c7',
            fontSize: '0.97rem',
        },
        content: {
            flexGrow: 1,
            padding: '3em',
            marginRight: -drawerWidth,
        },
        contentShift: {
            marginRight: 0,
        },
        heading: {
            fontSize: '0.97rem',
            fontWeight: '400',
        },
    }));

    const classes = useStyles();

    const onSubmitClicked = () => {
        if (typeof onSubmit === 'function') {
            onSubmit(true);
        }
    };

    const onCancelClicked = () => {
        onClose();
        //if (typeof onClose === 'function') {
        //    onClose(false);
        //}
    };

    return (
        <Drawer
            className={classes.drawer}
            anchor="left"
            open={open}
            classes={{
                paper: classes.drawerPaper,
            }}
        >
            <DrawerContainer>
                <DrawerTitle>
                    <HeaderButton name="arrowchevron_right" onClick={onCancelClicked}>
                        <ChevronLeft />
                        <span className={classes.heading}>{options.title}</span>
                    </HeaderButton>
                </DrawerTitle>
                <DrawerContent>{children}</DrawerContent>
            </DrawerContainer>
                {
                    (options.hideFooter === true ? null :

                        <DrawerFooter>
                            <Button onClick={onSubmitClicked} variant="contained" color="primary">{options.submitText || 'Submit'}</Button>
                            <Button onClick={onCancelClicked} style={{ marginLeft: '1em' }}>Cancel</Button>
                        </DrawerFooter>
                    )
                }
        </Drawer>
    );
}