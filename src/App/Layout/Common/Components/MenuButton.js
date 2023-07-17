import React from 'react';
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
    ensureNonEmptyArray
} from '../../../Core/Utility/rules';


export const MenuButton = ({ id, children, items = [] }) => {

    const anchorRef = React.useRef(null);
    const [menuOpen, setMenuOpen] = React.useState(false);

    const menuItems = (ensureNonEmptyArray(items) ? items : []);

    const handleToggle = () => {
        setMenuOpen(!menuOpen);
    }

    const handleMenuButtonClick = (evt, index) => {
        if (index >= 0 && index < menuItems.length) {
            const btn = menuItems[index];
            if (typeof btn.handler === 'function') {
                btn.handler();
            }

            handleToggle();
        }
    }

    return (<>
        <ButtonGroup variant="text" ref={anchorRef} aria-label="split button">
            <Button
                size="small"
                onClick={handleToggle}
                disabled={(ensureNonEmptyArray(menuItems) !== true)}
            >
                {children}
            </Button>
        </ButtonGroup>
        <Popper open={menuOpen} anchorEl={anchorRef.current} transition>
            {({ TransitionProps, placement }) => (
                <Grow
                    {...TransitionProps}
                    style={{
                        transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom',
                    }}
                >
                    <Paper>
                        <MenuList id="split-button-menu">
                            {menuItems.map((btn, index) => (
                                <MenuItem
                                    key={`${id}__item-${index}`}
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
    </>);
};