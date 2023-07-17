import React from 'react';
import ReactDOM from 'react-dom';

import { LicenseManager } from "ag-grid-enterprise";

import {
    App
} from './App/App';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import 'ag-grid-enterprise';
import 'react-tabs/style/react-tabs.css';
import { configureContainer } from './config/configureContainer';
import * as serviceWorker from './serviceWorker';

configureContainer();
ReactDOM.render(<App />, document.getElementById('root'));
serviceWorker.unregister();

export async function getAGGridKey() {

    const uri = `${window.location.protocol}//${window.location.host}/api/auth/GetAGGridKey`;

    //let resposne = await fetch(uri, {
    //    method: 'Get',
    //    headers: {
    //        'Content-Type': 'application/json',
    //    },
    //});

    //let result = await resposne.text();
    //return result;


    return fetch(uri, {
        method: 'Get',
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then(response => {
            var result = response.text().then(text =>
            {
                LicenseManager.setLicenseKey(text);
            })
        });
}

getAGGridKey();