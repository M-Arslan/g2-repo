import React from 'react';
import styled from 'styled-components';
import {
    ButtonGroup,
    Button,
    Grow,
    Popper,
    Paper,
    MenuList,
    MenuItem
} from '@mui/material';
import {
    ArrowDropDown,
    Menu
} from '@mui/icons-material';
import { ensureNonEmptyArray } from '../../../Core/Utility/rules';

const Toolbar = styled.nav`
    width: 100%;
    height: auto;
    padding: 0;
    margin: 0;
    border: 0;
    border-top: solid 1px rgb(170, 170, 170);
    border-bottom: solid 1px rgb(170, 170, 170);
    background-color: ${props => props.theme.backgroundDark};

    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    align-content: center;
    align-items: center;
`;

export const AppToolbar = ({ toolButtons = [], navButtons = [], menuButtons = [] }) => {
    const anchorRef = React.useRef(null);
    const menuAnchorRef = React.useRef(null);
    const [open, setOpen] = React.useState(false);
    const [menuOpen, setMenuOpen] = React.useState(false);

    const handleToggle = () => {
        setOpen(!open);
    };

    const handleMenuToggle = () => {
        setMenuOpen(!menuOpen);
    }

    const handleMenuItemClick = (evt, index) => {
        if (index >= 0 && index < navButtons.length) {
            const btn = navButtons[index];
            if (typeof btn.handler === 'function') {
                btn.handler();
            }

            setOpen(false);
        }
    };

    const handleMenuButtonClick = (evt, index) => {
        if (index >= 0 && index < menuButtons.length) {
            const btn = menuButtons[index];
            if (typeof btn.handler === 'function') {
                btn.handler();
            }

            setMenuOpen(false);
        }
    }

    return (
        <Toolbar>
            {
                ensureNonEmptyArray(menuButtons) ?
                    (<>
                        <ButtonGroup variant="text" ref={menuAnchorRef} aria-label="split button">
                            <Button
                                size="small"
                                onClick={handleMenuToggle}
                            >
                                <Menu />
                            </Button>
                        </ButtonGroup>
                        <Popper open={menuOpen} anchorEl={menuAnchorRef.current} transition>
                            {({ TransitionProps, placement }) => (
                                <Grow
                                    {...TransitionProps}
                                    style={{
                                        transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom',
                                        zIndex: 9999
                                    }}
                                >
                                    <Paper>
                                        <MenuList id="split-button-menu">
                                            {menuButtons.map((btn, index) => (
                                                <MenuItem
                                                    key={`app-navbutton-${index}`}
                                                    onClick={(event) => handleMenuButtonClick(event, index)}
                                                >
                                                    {btn.label}
                                                </MenuItem>
                                            ))}
                                        </MenuList>
                                    </Paper>
                                </Grow>
                            )}
                        </Popper>
                    </>)
                    : null
            }
            <ButtonGroup variant="text">
                {
                    toolButtons.map(({ icon: Icon, handler, tooltip = '' }, idx) => <Button title={tooltip} onClick={handler} key={`app-button-${idx}`}><Icon /></Button>)
                }
            </ButtonGroup>
            {
                ensureNonEmptyArray(navButtons) ?
                    (<>
                        <ButtonGroup variant="text" ref={anchorRef} aria-label="split button">
                            <Button onClick={handleToggle}>Navigate To...</Button>
                            <Button
                                size="small"
                                onClick={handleToggle}
                            >
                                <ArrowDropDown />
                            </Button>
                        </ButtonGroup>
                        <Popper open={open} anchorEl={anchorRef.current} transition disablePortal>
                            {({ TransitionProps, placement }) => (
                                <Grow
                                    {...TransitionProps}
                                    style={{
                                        transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom',
                                    }}
                                >
                                    <Paper>
                                        <MenuList id="split-button-menu">
                                            {navButtons.map((btn, index) => (
                                                <MenuItem
                                                    key={`app-navbutton-${index}`}
                                                    onClick={(event) => handleMenuItemClick(event, index)}
                                                >
                                                    {btn.label}
                                                </MenuItem>
                                            ))}
                                        </MenuList>
                                    </Paper>
                                </Grow>
                            )}
                        </Popper>
                        </>)
                    : null
            }
        </Toolbar>
    );
};