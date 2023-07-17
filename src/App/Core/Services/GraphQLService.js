import {
    GraphQLError
} from "./GraphQLError";
import { NetworkError } from "./NetworkError";

export const executeGQL = async (schema, query, variables = null) => {
    const payload = {
        query
    };

    if (typeof variables === 'object' && variables !== null) {
        payload.variables = variables;
    }

    const uri = `${window.location.protocol}//${window.location.host}/gql/${schema}`;
    const response = await fetch(uri, {
        method: 'POST',
        mode: 'same-origin',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json'
        },
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
        body: JSON.stringify(payload),
    });

    if (response.ok) {
        const result = await response.json();

        if (Array.isArray(result.errors) && result.errors.length > 0) {
            throw new GraphQLError(result.errors);
        }
        else {
            return result.data;
        }
    }
    else {
        throw new NetworkError(response.status, response.statusText, uri);
    }

};