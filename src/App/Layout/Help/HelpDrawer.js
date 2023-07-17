import {
    IconButton,
    Drawer,
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Typography,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import {
    ChevronRight,
    ExpandMore as ExpandMoreIcon
} from '@mui/icons-material';
import React, { useState } from 'react';
import { loadHelpTags } from './Queries';

export const HelpDrawer = ({ open, onClose, containerName }) => {
    const drawerWidth = 600;
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
            top: 0,
        },
        drawerHeader: {
            display: 'flex',
            alignItems: 'center',
    padding: '0 1em',
            // necessary for content to be below app bar
            //...theme.mixins.toolbar,
            justifyContent: 'flex-start',
            backgroundColor: '#bdc3c7',
            fontSize: '15px',

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
            fontSize: '15px',
            fontWeight: '400',
        },

    }));
    const classes = useStyles();
    const [helpTags, setHelpTags] = useState([]);

    React.useEffect(() => {
        loadHelpData();
    }, []);

    async function loadHelpData() {
        const tags = await loadHelpTags(containerName);
        setHelpTags(tags.data.list || []);
    }

    const HelpAccordian = ({ helpTag }) => {
        const helpTagChildren = helpTags.filter(ht => ht.parentHelpID === helpTag.helpID);
        return (
            <Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                >
                    <Typography className={classes.heading}>
                        <div style={{ fontWeight: 'bold' }}> {helpTag.title}
                        </div>
                    </Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography>
                        <div dangerouslySetInnerHTML={{ __html: helpTag?.content }} />
                    </Typography>
                </AccordionDetails>
                {helpTagChildren.map((item) =>
                    <div style={{ paddingLeft: 20 }}>
                        <HelpAccordian helpTag={item} />
                    </div>
                )}
            </Accordion>
        );
    }

    return (
        <Drawer
            className={classes.drawer}
            anchor="right"
            open={open}
            classes={{
                paper: classes.drawerPaper,
            }}
        >
            <div className={classes.drawerHeader}>
                <IconButton name="arrowchevron_right" onClick={onClose}>
                    <ChevronRight />
                    <div style={{ fontWeight: 'bold' }}> {containerName} Help</div>
                </IconButton>
            </div>
            <div> 
                {
                    helpTags.filter(ht => ht.parentHelpID === null).map((item) =>
                        <HelpAccordian helpTag={item} />
                    )
                }
            </div>
            
        </Drawer>
    );



}