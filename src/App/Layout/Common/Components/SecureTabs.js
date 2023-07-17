import React from 'react';
import { useSelector } from 'react-redux';
import {
    Tab,
    Tabs,
    TabList,
    TabPanel
} from 'react-tabs';
import { userSelectors } from '../../../Core/State/slices/user';

const TabsStyle = {
    height: "100%",
    width: "100%",
    fontSize: "12px"
};

const TabListStyle = {
    margin: 0,
    fontSize: '12px',
    backgroundColor: 'rgba(0,130,206,1)',
    color: '#dfdfdf',
};

const TabPanelStyle = {
    border: 'solid 1px rgb(170, 170, 170)',
    borderTop: 'none',
    margin: 0,
    padding: 0,
    height: "calc(100% - 38px)"
};

export const SecureTab = ({ id, label, appName, children }) => {
    return <>{children}</>;
};

export const SecureTabs = ({ children }) => {
    const $auth = useSelector(userSelectors.selectAuthContext());
    const tabMap = React.Children.toArray(children).filter(t => {
        return (React.isValidElement(t) && ($auth.hasPermission(t.props.appName)) && (t.props.hide !== true));
    });
    const cleanHash = (((window.location.hash || '').startsWith('#') ? window.location.hash.substring(1) : window.location.hash) || '');
    const hashSegments = cleanHash.split('/').filter(seg => typeof seg === 'string' && seg !== '').map(s => s.toLowerCase());
    const initial = (hashSegments.length > 0 ? tabMap.findIndex(t => {
        return (t.props.id.toLowerCase() === hashSegments[0]);
    }) : 0);
    const [tabIndex, setTabIndex] = React.useState((initial < 0 ? 0 : initial));
    const onSelect = (index) =>
    {
        setTabIndex(index);
        window.location.hash = tabMap[index].props.id;
    }
    return (
        <Tabs selectedIndex={tabIndex} onSelect={onSelect} style={TabsStyle}>
            <TabList style={TabListStyle}>
                {
                    tabMap.map((element, idx) => {
                        const { id, label } = element.props
                        return <Tab key={`tab_${id}`}>{label}</Tab>;
                    })
                }
            </TabList>
            {
                tabMap.map(element => {
                    const { id, children } = element.props
                    return <TabPanel style={TabPanelStyle} key={`content_${id}`}>{children}</TabPanel>;
                })
            }
        </Tabs>
    );
};