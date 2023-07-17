import React from 'react';
import styled from 'styled-components';
import {
    Drawer,
    IconButton,
    Button,
    List,
    ListItem,
    MenuItem
} from '@mui/material';
import {
    makeStyles
} from '@mui/styles';
import {
    ChevronLeft,
    ChevronRight,
    Search
} from '@mui/icons-material';
import {
    TextInput,
    SelectList,
    Spinner
} from '../../../Core/Forms/Common';
import {
    ensureNonEmptyArray,
    ensureNonEmptyString
} from '../../../Core/Utility/rules';

const drawerWidth = 350;

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
        height: 'calc(100% - 65px)',
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


export const FieldContainer = styled.div`
    width: 100%;
    height: 50px;
    padding: .25em 1em;
    margin-bottom: .5em;
`;

const SearchField = styled.div`
    width: 100%;
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-start;
    align-content: center;
    margin-top: .5em;
`;

const ResultListItem = styled(ListItem)`
    cursor: pointer;
    transition: all .3s ease;

    &:hover {
        background-color: #dfdfdf;
        color: #000000;
    }

    &.selected {
        background-color: lightgreen;
    }

    &:hover > .Muiavatar-root {
        background-color: ${props => props.theme.primaryColor};
    }
`;

const DrawerContent = styled.article`
    height: 100%;
    width: 100%;
    padding: 0;
    margin: 0;
    border: 0;

    display: flex;
    flex-flow: column nowrap;
`;

const DrawerHeader = styled.header`
    width: 100%;
    height: 45px;
    background-color: #bdc3c7;
    padding: 0 1em;

    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-start;
    align-content: center;
    align-items: center;
    border-bottom: solid 1px #c0c0c0;
`;

const DrawerFooter = styled.footer`
    width: 100%;
    height: 45px;
    background-color: #bdc3c7;
    padding: 0 1em;

    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-end;
    align-content: center;
    align-items: center;
    border-top: #c0c0c0;

    & > * {
        margin-left: 1em;
    }
`;

const DrawerMain = styled.main`
    width: 100%;
    height: calc(100% - ${(props => props.hasFooter ? '90' : '45')}px);

    padding: 0;
    margin: 0;
    border: 0;

    overflow-x: hidden;
    overflow-y: hidden;

    display: flex;
    flex-flow: column nowrap;
`;

const DrawerMainFilters = styled.section`
    display: flex;
    flex-flow: column nowrap;
    justify-content: space-around;
    align-content: flex-start;
    border-bottom: solid 1px #eaeaea;
    background-color: #efefef;
`;

const DrawerMainResults = styled.section`
    height: 100%;
    width: 100%;
    
    display: flex;
    flex-flow: column nowrap;
    overflow-x: hidden;
    overflow-y: auto;
    padding: 0;
    margin: 0;
    border: 0;
    background-color: #ffffff;
`;

/**
 * @typedef {object} SelectionResult
 * @property {boolean} confirmed - indicates whether the user selected an item or canceled
 * @property {Array<any>} result - the selected item(s)
 */

/**
 * callback OnResultSelected
 * @param {SelectionResult} result - the results of the user's selection choices
 */

/**
 * callback OnSearch
 * @param {string} searchTerm - the search phrase
 * @param {string} searchType - the context indicator
 * @returns {Array<any>} - search results to display
 */

/**
 * @typedef {object} FilterOption
 * @property {string} value - the underlying value of the filter
 * @property {string} label - the string shown in the select box
 */

/**
 * @typedef {object} SearchDrawerOptions
 * @property {boolean} [multiSelect=false] - allows selecting more than one result
 * @property {boolean} [multiFilter=false] - allows changing the search context
 * @property {Array<FilterOption>} [filterOptions] - options for the context switch of the multi filter
 * @property {string} [defaultFilter] - the value of the default option in the filterOptions list
 * @property {object} [noResultsMessages] - digest object of messages by context filter
 * @property {boolean} [autoSubmit=true] - submit automatically on select (ignored in multiselect searches)
 */

/** 
 *  @typedef {object} SearchDrawerProps 
 *  @property {boolean} open - indicates whether or not the drawer is open
 *  @property {function} onResultSelected - callback that indicates a result has been selected by the user
 *  @property {function} onSearch - callback that fires to build the search result list
 *  @property {string} [title='Search'] - the title in the Drawer Header
 *  @property {SearchDrawerOptions} options - the options for this drawer
 *  @property {function} children - renderer function to format and output each search result
 */

/** @type {SearchDrawerOptions} */
const defaultOptions = Object.freeze({
    multiSelect: false,
    multiFilter: false,
    filterOptions: [],
    defaultFilter: '',
    noResultsMessages: {},
    autoSubmit: true,
    anchor: 'right',
});

/**
 * Drawer to house searching functionality
 * @param {SearchDrawerProps} props - the component props
 * @returns {import('react').Component<SearchDrawerProps>}
 */
export const SearchDrawer = ({ open, onResultSelected, displayMessageFlag = false,onSearch, title = 'Search', options = {}, children }) => {

    const opts = { ...defaultOptions, ...options };
    const defaultType = (ensureNonEmptyString(opts.defaultFilter) ? opts.defaultFilter : (ensureNonEmptyArray(opts.filterOptions) ? opts.filterOptions[0].value : ''));

    const [isSearching, setIsSearching] = React.useState(false);
    const [hasSearched, setHasSearched] = React.useState(false);
    const [searchTerm, setSearchTerm] = React.useState('');
    const [searchType, setSearchType] = React.useState(defaultType);
    const [searchResults, setSearchResults] = React.useState([]);   

    const classes = useStyles();

    /**
     * Handles user input to the SearchTerm textfield
     * @param {any} evt
     */
    const onSearchTermChanged = (evt) => {
        setSearchTerm(evt.target.value);
    }

    /**
     * Handles user input to the SearchType select box
     * @param {any} evt
     */
    const onSearchTypeChanged = (evt) => {
        setSearchType(evt.target.value);
    };

    /**
     * Return the results of the user's selection(s) and request the drawer be closed. 
     * @param {SelectionResult} result
     */
    const closeDrawer = (result) => {
        setSearchResults([]);
        setIsSearching(false);
        setSearchTerm('');
        setHasSearched(false);
        setSearchType(defaultType);

        if (typeof onResultSelected === 'function') {
            onResultSelected(result);
        }
    };

    /**
     * Execute the search callback and populate the search result pane
     */
    const doSearch = async (evt) => {
        evt.preventDefault();

        setIsSearching(true);
        let searchResult = [];

        try {
            searchResult = await onSearch(searchTerm, searchType);
        } catch (e) {
            searchResult = [];
            console.error('[SearchDrawer::doSearch] error when executing search provider:', e);
        }

        setIsSearching(false);
        setHasSearched(true);
        setSearchResults(searchResult);
    };

    /**
     * Handles user selection of a result item
     * @param {any} result - the selected result object
     */
    const onSelectResult = (result) => {
        if (opts.multiSelect === false && opts.autoSubmit === true) {
            closeDrawer({ confirmed: true, result: [result] });
        }
        else {
            result.selected = true;
            setSearchResults(Array.from(searchResults));
        }
    };

    /**
     * Handles user cancellation interaction 
     */
    const cancel = () => {
        closeDrawer({ confirmed: false });
    }

    /**
     * Handles user acceptance interaction 
     */
    const submit = () => {
        closeDrawer({ confirmed: true, result: (ensureNonEmptyArray(searchResults) ? searchResults.filter(s => s.selected === true) : [])})
    }

    return (
        <Drawer
            className={classes.drawer}
            anchor={opts.anchor || 'right'}
            open={open}
            classes={{
                paper: classes.drawerPaper,
            }}
        >
            <DrawerContent>
                <DrawerHeader>
                    <IconButton name="arrowchevron_right" onClick={cancel}>
                        {(ensureNonEmptyString(opts.anchor) && opts.anchor === 'left' ? <ChevronLeft /> : <ChevronRight />)}
                    </IconButton>
                    <span>{title}</span>
                </DrawerHeader>
                <DrawerMain hasFooter={opts.multiSelect === true}>
                    <form onSubmit={doSearch}>
                        <DrawerMainFilters>
                            <FieldContainer style={(opts.multiFilter === true ? {} : { display: 'none' })}>
                                <SearchField>
                                    <SelectList
                                        id="searchType"
                                        name="searchType"
                                        label="Search Type"
                                        fullWidth={true}
                                        value={searchType}
                                        onChange={onSearchTypeChanged}
                                        variant="outlined"
                                        allowempty={false}
                                    >
                                        {
                                            (opts.filterOptions || [])
                                                .map((item, idx) => <MenuItem value={item.value} key={`search-option-${idx}`}>{item.label}</MenuItem>)
                                        }
                                    </SelectList>
                                </SearchField>
                            </FieldContainer>
                            <FieldContainer style={{ marginBottom: '.5em' }}>
                                <SearchField>
                                    <TextInput
                                        id="searchTerm"
                                        value={searchTerm}
                                        onChange={onSearchTermChanged}
                                        inputProps={{ 'maxLength': 255 }}
                                    />
                                    <IconButton type="submit" size="small" disabled={isSearching === true}>
                                        <Search />
                                    </IconButton>
                                </SearchField>
                            </FieldContainer>
                        </DrawerMainFilters>
                    </form>
                    { displayMessageFlag &&
                        <FieldContainer>
                            <p>Policy related claims for Nat Re claims are pulled only from CMP</p>
                        </FieldContainer>
                    }
                    <DrawerMainResults>
                    {
                        isSearching === true ? <Spinner /> :
                        <List>
                            {
                                ensureNonEmptyArray(searchResults) ?
                                    searchResults.map((res, idx) => (
                                        <ResultListItem key={`result-${idx}`} className={`${res.selected ? 'selected' : ''}`} onClick={() => onSelectResult(res)}>
                                            {children(res)}
                                        </ResultListItem>
                                    ))
                                : <span style={{ padding: '1em' }}>{(hasSearched === true ? (opts.noResultsMessages[searchType] || 'No Results Found') : '')}</span>
                            }
                        </List>
                    }

                    </DrawerMainResults>
                </DrawerMain>
                <DrawerFooter style={(opts.multiSelect === true || opts.autoSubmit === false ? {} : { display: 'none' })}>
                    <Button name="search_cancel" onClick={cancel}>
                        Cancel
                    </Button>
                    <Button name="search_submit" onClick={submit} disabled={ensureNonEmptyArray(searchResults) !== true}>
                        Submit
                    </Button>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
}