import React from 'react';

export const Logout = ({ match }) => {

    document.execCommand("ClearAuthenticationCache");
    window.close();

    React.useEffect(() => {

    }, []);

    return <h3>Logged out</h3>;

};
