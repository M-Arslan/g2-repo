import React from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';

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
    display: 'flex',
    flexFlow: 'row nowrap',
};

const TabPanelStyle = {
    border: 'solid 1px rgb(170, 170, 170)',
    borderTop: 'none',
    margin: 0,
    padding: 0,
    height: "calc(100% - 38px)"
};

const Tab = styled(NavLink)`

    border: 1px solid transparent;
    border-bottom: none;
    bottom: -1px;
    cursor: pointer;
    display: inline-block;
    list-style: none;
    padding: 6px 12px;
    position: relative;
    color: #fff;

    &.active {
        background: #fff;
        border-color: #aaa;
        border-radius: 5px 5px 0 0;
        color: #000;
    }
`;

/**
 * @typedef {object} RoutableTabsProps
 * @property {Map<string, string>} tabMap
 * @property {React.ReactNoe} children
 */

/**
 * Tabs that handle routable navigation
 * @param {RoutableTabsProps} props
 */
export const RoutableTabs = ({ tabMap, children }) => {

    return (
        <article style={TabsStyle}>
            <nav style={TabListStyle}>
                {
                    [...tabMap.entries()].map(([key, value], idx) => {
                        return <Tab key={`tab_${key}`} to={`${key}`} className={({ isActive }) => isActive ? 'active' : ''}>{value}</Tab>;
                    })
                }
            </nav>
            <section style={TabPanelStyle}>{children}</section>
        </article>
    );
};