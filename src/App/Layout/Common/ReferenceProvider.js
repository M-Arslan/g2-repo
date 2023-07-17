import React from 'react';

const ReferenceContext = React.createContext({});

const ReferenceProvider = ({ children }) => {

    React.useEffect(() => {
        async function loadReferenceData () {

        }

        loadReferenceData();
    }, []);

    return <React.Fragment>{children}</React.Fragment>;
};

export { ReferenceContext, ReferenceProvider };